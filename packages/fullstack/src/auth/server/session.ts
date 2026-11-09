import {
  protectStateChangingRequest,
  readSessionCookie,
  serializeClearedSessionCookie,
  serializeSessionCookie,
  type CsrfOptions,
  type SessionCookieOptions,
  type SessionManager,
} from "@puzzle-ui/session";

export type SessionRequestOptions = {
  readonly sessions: SessionManager;
  readonly cookie: SessionCookieOptions;
};

export type SessionResponseOptions = SessionRequestOptions & {
  readonly csrf: CsrfOptions;
};

export const getRequestSession = async (
  request: Request,
  options: SessionRequestOptions,
) => {
  const token = readSessionCookie(
    request.headers.get("cookie"),
    options.cookie.name,
  );

  if (!token) return null;

  return options.sessions.validate(token);
};

export const protectAuthenticatedRequest = (
  request: Request,
  csrf: CsrfOptions,
): void => {
  protectStateChangingRequest(request, csrf);
};

export const createSessionResponse = (
  body: BodyInit | null,
  token: string,
  options: SessionRequestOptions,
  expiresAt: Date,
  status = 200,
): Response => {
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

  if (maxAge <= 0) {
    throw new Error("Cannot create a cookie for an expired session.");
  }

  const headers = new Headers({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });

  headers.append(
    "Set-Cookie",
    serializeSessionCookie(token, options.cookie, maxAge),
  );

  return new Response(body, {
    status,
    headers,
  });
};

export const clearSessionResponse = (
  body: BodyInit | null,
  options: SessionRequestOptions,
  status = 200,
): Response => {
  const headers = new Headers({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });

  headers.append("Set-Cookie", serializeClearedSessionCookie(options.cookie));

  return new Response(body, {
    status,
    headers,
  });
};

export const logoutRequest = async (
  request: Request,
  options: SessionResponseOptions,
): Promise<Response> => {
  protectAuthenticatedRequest(request, options.csrf);

  const session = await getRequestSession(request, options);

  if (session) {
    await options.sessions.revoke(session.id);
  }

  return clearSessionResponse(JSON.stringify({ success: true }), options);
};

export const logoutAllRequest = async (
  request: Request,
  options: SessionResponseOptions,
): Promise<Response> => {
  protectAuthenticatedRequest(request, options.csrf);

  const session = await getRequestSession(request, options);

  if (!session || session.kind !== "authenticated" || !session.userId) {
    return new Response(null, {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  await options.sessions.revokeAll(session.userId);

  return clearSessionResponse(JSON.stringify({ success: true }), options);
};
