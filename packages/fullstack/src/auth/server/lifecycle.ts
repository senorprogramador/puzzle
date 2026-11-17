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
  readonly emailChangeUrl: (request: Request) => string;
  readonly allowPasswordChange?: boolean;
};

export type AuthLifecycleHandlers = {
  readonly requestEmailVerification: (request: Request) => Promise<Response>;
  readonly verifyEmail: (request: Request) => Promise<Response>;
  readonly requestPasswordReset: (request: Request) => Promise<Response>;
  readonly resetPassword: (request: Request) => Promise<Response>;
  readonly changePassword: (request: Request) => Promise<Response>;
  readonly requestEmailChange: (request: Request) => Promise<Response>;
  readonly verifyEmailChange: (request: Request) => Promise<Response>;
  readonly updateProfile: (request: Request) => Promise<Response>;
  readonly listSessions: (request: Request) => Promise<Response>;
  readonly revokeSession: (request: Request) => Promise<Response>;
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

const optionalNullableString = (
  body: JsonObject,
  field: string,
  maximumLength: number,
): { readonly present: false } | { readonly present: true; readonly value: string | null } => {
  if (!Object.hasOwn(body, field)) return { present: false };

  const value = body[field];

  if (value === null) return { present: true, value: null };
  if (typeof value !== "string" || value.length > maximumLength) {
    throw new Error("INVALID_REQUEST");
  }

  return { present: true, value };
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

    if (options.allowPasswordChange === false) {
      return jsonResponse(
        {
          error: {
            code: "PASSWORD_CHANGE_DISABLED",
            message: "Password changes are disabled.",
          },
        },
        403,
      );
    }

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

  const requestEmailChange = endpoint(async (request) => {
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

    await options.lifecycle.requestEmailChange({
      sessionToken,
      currentPassword: requiredString(body, "currentPassword"),
      email: requiredString(body, "email", 320),
      verificationUrl: options.emailChangeUrl(request),
      ipAddress: options.resolveClientIp(request),
    });

    return jsonResponse({ status: "email-change-requested" });
  });

  const verifyEmailChange = endpoint(async (request) => {
    protect(request);

    const body = await readBody(request);
    const user = await options.lifecycle.verifyEmailChange(
      requiredString(body, "token"),
    );

    return jsonResponse({ status: "email-changed", user });
  });

  const updateProfile = endpoint(async (request) => {
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
    const name = optionalNullableString(body, "name", 120);
    const image = optionalNullableString(body, "image", 2048);

    if (!name.present && !image.present) {
      throw new Error("INVALID_REQUEST");
    }

    const user = await options.lifecycle.updateProfile({
      sessionToken,
      ...(name.present ? { name: name.value } : {}),
      ...(image.present ? { image: image.value } : {}),
    });

    return jsonResponse({ user });
  });

  const listSessions = async (request: Request): Promise<Response> => {
    if (request.method !== "GET") {
      return jsonResponse(
        {
          error: {
            code: "METHOD_NOT_ALLOWED",
            message: "Only GET requests are supported.",
          },
        },
        405,
      );
    }

    try {
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

      const sessions = await options.sessions.list(
        session.userId,
        session.id,
      );

      return jsonResponse({ sessions });
    } catch (error) {
      return getErrorResponse(error);
    }
  };

  const revokeSession = endpoint(async (request) => {
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

    const body = await readBody(request);
    const sessionId = requiredString(body, "sessionId", 256);
    const target = await options.sessions.get(sessionId);

    if (
      !target ||
      target.userId !== session.userId ||
      target.id === session.id
    ) {
      return jsonResponse(
        {
          error: {
            code: "SESSION_NOT_FOUND",
            message: "The session could not be revoked.",
          },
        },
        404,
      );
    }

    await options.sessions.revoke(target.id);

    return jsonResponse({ status: "session-revoked" });
  });

  return {
    requestEmailVerification,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    requestEmailChange,
    verifyEmailChange,
    updateProfile,
    listSessions,
    revokeSession,
  };
};

export { createAuthLifecycleHandlers };
