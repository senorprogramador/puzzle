import { randomBytes, randomUUID } from "node:crypto";

import {
  protectStateChangingRequest,
  readSessionCookie,
  serializeClearedSessionCookie,
  serializeSessionCookie,
  SessionSecurityError,
  type SessionCookieOptions,
} from "@puzzle-ui/session";

export type WorkspaceDeviceAuthUser = {
  readonly id: string;
  readonly email: string;
  readonly emailVerifiedAt: null;
  readonly name: string | null;
  readonly image: null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

type DeviceSession = {
  readonly user: WorkspaceDeviceAuthUser;
  readonly expiresAt: Date;
};

type CreateDeviceSessionInput = {
  readonly userId?: string;
  readonly email: string;
  readonly name: string | null;
};

type CreatedDeviceSession = {
  readonly user: WorkspaceDeviceAuthUser;
  readonly token: string;
  readonly expiresAt: Date;
};

const MAX_ACTIVE_DEVICE_SESSIONS = 5000;

export class WorkspaceDeviceAuthManager {
  private readonly sessions = new Map<string, DeviceSession>();

  createSession(input: CreateDeviceSessionInput): CreatedDeviceSession | null {
    const now = new Date();
    for (const [token, session] of this.sessions) {
      if (session.expiresAt.getTime() <= now.getTime()) {
        this.sessions.delete(token);
      } else if (input.userId && session.user.id === input.userId) {
        this.sessions.delete(token);
      }
    }

    if (this.sessions.size >= MAX_ACTIVE_DEVICE_SESSIONS) return null;

    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const user: WorkspaceDeviceAuthUser = {
      id: input.userId ?? `device_${randomUUID()}`,
      email: input.email,
      emailVerifiedAt: null,
      name: input.name,
      image: null,
      createdAt: now,
      updatedAt: now,
    };
    const token = randomBytes(32).toString("base64url");

    this.sessions.set(token, { user, expiresAt });

    return { user, token, expiresAt };
  }

  getUser(token: string): WorkspaceDeviceAuthUser | null {
    const session = this.sessions.get(token);

    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session.user;
  }

  revoke(token: string): void {
    this.sessions.delete(token);
  }
}

type DeviceAuthRequestOptions = {
  readonly manager: WorkspaceDeviceAuthManager;
  readonly cookie: SessionCookieOptions;
  readonly allowedOrigins: readonly string[];
};

const noStore = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

const jsonResponse = (body: unknown, status = 200): Response =>
  Response.json(body, { status, headers: noStore });

const withCookie = (response: Response, cookie: string): Response => {
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", cookie);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const readBody = async (request: Request): Promise<Record<string, unknown> | null> => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return null;
  }

  return typeof body === "object" && body !== null && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null;
};

const invalidRequest = () =>
  jsonResponse(
    {
      error: {
        code: "INVALID_REQUEST",
        message: "The request is invalid.",
      },
    },
    400,
  );

const protect = (
  request: Request,
  allowedOrigins: readonly string[],
): Response | null => {
  try {
    protectStateChangingRequest(request, { allowedOrigins });
    return null;
  } catch (error) {
    if (!(error instanceof SessionSecurityError)) throw error;

    return jsonResponse(
      {
        error: {
          code: "CSRF_REJECTED",
          message: "The request origin could not be verified.",
        },
      },
      403,
    );
  }
};

const clientUser = (user: WorkspaceDeviceAuthUser) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  emailVerified: false,
});

export const handleWorkspaceDeviceAuthRequest = async (
  request: Request,
  options: DeviceAuthRequestOptions,
): Promise<Response> => {
  const pathname = new URL(request.url).pathname;
  const isStateRequest = pathname === "/api/auth/device/state";
  const isSessionRequest = pathname === "/api/auth/device/session";
  const isSignOutRequest = pathname === "/api/auth/device/sign-out";

  if (!isStateRequest && !isSessionRequest && !isSignOutRequest) {
    return jsonResponse(
      { error: { code: "NOT_FOUND", message: "The route was not found." } },
      404,
    );
  }

  if (
    (isStateRequest && request.method !== "GET") ||
    (!isStateRequest && request.method !== "POST")
  ) {
    return jsonResponse(
      {
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: isStateRequest
            ? "Only GET requests are supported."
            : "Only POST requests are supported.",
        },
      },
      405,
    );
  }

  const token = readSessionCookie(
    request.headers.get("cookie"),
    options.cookie.name,
  );

  if (isStateRequest) {
    const user = token ? options.manager.getUser(token) : null;

    return jsonResponse({
      status: user ? "authenticated" : "unauthenticated",
      user: user ? clientUser(user) : null,
    });
  }

  const csrfResponse = protect(request, options.allowedOrigins);
  if (csrfResponse) return csrfResponse;

  if (isSignOutRequest) {
    if (token) options.manager.revoke(token);

    return withCookie(
      jsonResponse({ status: "unauthenticated", user: null }),
      serializeClearedSessionCookie(options.cookie),
    );
  }

  const body = await readBody(request);
  if (!body) return invalidRequest();

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name =
    body.name === null || body.name === undefined
      ? null
      : typeof body.name === "string"
        ? body.name.trim()
        : undefined;
  const userId = body.userId;

  if (
    !email ||
    email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    name === undefined ||
    (name !== null && name.length > 100) ||
    (userId !== undefined &&
      (typeof userId !== "string" ||
        !/^device_[0-9a-f-]{36}$/i.test(userId)))
  ) {
    return invalidRequest();
  }

  if (token) options.manager.revoke(token);

  const created = options.manager.createSession({
    userId: typeof userId === "string" ? userId : undefined,
    email,
    name: name || null,
  });

  if (!created) {
    return jsonResponse(
      {
        error: {
          code: "SESSION_CAPACITY_REACHED",
          message: "Device sessions are temporarily unavailable.",
        },
      },
      503,
    );
  }

  const maxAge = Math.floor(
    (created.expiresAt.getTime() - Date.now()) / 1000,
  );

  return withCookie(
    jsonResponse({
      status: "authenticated",
      user: clientUser(created.user),
    }),
    serializeSessionCookie(created.token, options.cookie, maxAge),
  );
};
