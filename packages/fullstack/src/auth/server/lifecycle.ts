import { AuthError, type StorageAuthLifecycleManager } from "@puzzle-ui/auth";

import {
  readSessionCookie,
  protectStateChangingRequest,
  type CsrfOptions,
  type SessionCookieOptions,
  type SessionManager,
} from "@puzzle-ui/session";

import { getRequestSession, type SessionRequestOptions } from "./session";

export type AuthLifecycleHandlersOptions = {
  readonly lifecycle: StorageAuthLifecycleManager;
  readonly sessions: SessionManager;
  readonly cookie: SessionCookieOptions;
  readonly csrf: CsrfOptions;
  readonly resolveClientIp: (request: Request) => string;
  readonly verificationUrl: (request: Request) => string;
  readonly passwordResetUrl: (request: Request) => string;
};

export type AuthLifecycleHandlers = {
  readonly requestEmailVerification: (request: Request) => Promise<Response>;
  readonly verifyEmail: (request: Request) => Promise<Response>;
  readonly requestPasswordReset: (request: Request) => Promise<Response>;
  readonly resetPassword: (request: Request) => Promise<Response>;
  readonly changePassword: (request: Request) => Promise<Response>;
};

type JsonObject = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
  });

const readBody = async (request: Request): Promise<JsonObject> => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_REQUEST");
  }

  if (!isRecord(body)) {
    throw new Error("INVALID_REQUEST");
  }

  return body;
};

const requiredString = (
  body: JsonObject,
  field: string,
  maximumLength = 2048,
): string => {
  const value = body[field];

  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maximumLength
  ) {
    throw new Error("INVALID_REQUEST");
  }

  return value;
};

const getErrorResponse = (error: unknown): Response => {
  if (error instanceof AuthError) {
    const status =
      error.code === "RATE_LIMITED"
        ? 429
        : error.code === "PROVIDER"
          ? 503
          : error.code === "SESSION"
            ? 401
            : 400;

    return jsonResponse(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      status,
    );
  }

  if (error instanceof Error && error.message === "INVALID_REQUEST") {
    return jsonResponse(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "The request is invalid.",
        },
      },
      400,
    );
  }

  return jsonResponse(
    {
      error: {
        code: "INTERNAL_AUTH_ERROR",
        message: "An authentication error occurred.",
      },
    },
    500,
  );
};

const endpoint =
  (handler: (request: Request) => Promise<Response>) =>
  async (request: Request): Promise<Response> => {
    try {
      if (request.method !== "POST") {
        return jsonResponse(
          {
            error: {
              code: "METHOD_NOT_ALLOWED",
              message: "Only POST requests are supported.",
            },
          },
          405,
        );
      }

      return await handler(request);
    } catch (error) {
      return getErrorResponse(error);
    }
  };

const getSessionToken = (
  request: Request,
  cookie: SessionCookieOptions,
): string | null =>
  readSessionCookie(request.headers.get("cookie"), cookie.name);

const createAuthLifecycleHandlers = (
  options: AuthLifecycleHandlersOptions,
): AuthLifecycleHandlers => {
  const sessionOptions: SessionRequestOptions = {
    sessions: options.sessions,
    cookie: options.cookie,
  };

  const protect = (request: Request) => {
    protectStateChangingRequest(request, options.csrf);
  };

  const requestEmailVerification = endpoint(async (request) => {
    protect(request);

    const session = await getRequestSession(request, sessionOptions);

    if (!session || session.kind !== "authenticated" || !session.userId) {
      return jsonResponse(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication is required.",
          },
        },
        401,
      );
    }

    await options.lifecycle.sendEmailVerification({
      userId: session.userId,
      verificationUrl: options.verificationUrl(request),
      ipAddress: options.resolveClientIp(request),
    });

    return jsonResponse({
      status: "verification-requested",
    });
  });

  const verifyEmail = endpoint(async (request) => {
    protect(request);

    const body = await readBody(request);
    const token = requiredString(body, "token");

    await options.lifecycle.verifyEmail(token);

    return jsonResponse({
      status: "email-verified",
    });
  });

  const requestPasswordReset = endpoint(async (request) => {
    protect(request);

    const body = await readBody(request);

    await options.lifecycle.requestPasswordReset({
      email: requiredString(body, "email", 320),
      resetUrl: options.passwordResetUrl(request),
      ipAddress: options.resolveClientIp(request),
    });

    // The public result must never reveal whether an account exists.
    return jsonResponse({
      status: "password-reset-requested",
    });
  });

  const resetPassword = endpoint(async (request) => {
    protect(request);

    const body = await readBody(request);

    await options.lifecycle.resetPassword({
      token: requiredString(body, "token"),
      newPassword: requiredString(body, "newPassword"),
    });

    return jsonResponse({
      status: "password-reset",
    });
  });

  const changePassword = endpoint(async (request) => {
    protect(request);

    const sessionToken = getSessionToken(request, options.cookie);

    if (!sessionToken) {
      return jsonResponse(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication is required.",
          },
        },
        401,
      );
    }

    const body = await readBody(request);

    await options.lifecycle.changePassword({
      sessionToken,
      currentPassword: requiredString(body, "currentPassword"),
      newPassword: requiredString(body, "newPassword"),
    });

    return jsonResponse({
      status: "password-changed",
    });
  });

  return {
    requestEmailVerification,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
  };
};

export { createAuthLifecycleHandlers };
