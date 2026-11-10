import {
  AuthError,
  AuthMfaChallengeError,
  AuthSessionError,
  AuthValidationError,
  type AuthManager,
  type AuthMfaPendingResult,
  type AuthResult,
  type AuthUser,
  type StorageAuthMfaManager,
  type StorageAuthStepUpManager,
} from "@puzzle-ui/auth";

import {
  protectStateChangingRequest,
  readSessionCookie,
  serializeClearedSessionCookie,
  type CsrfOptions,
  type SessionCookieOptions,
  type SessionManager,
  type SessionRecord,
} from "@puzzle-ui/session";

import {
  createSessionResponse,
  clearSessionResponse,
  getRequestSession,
  type SessionRequestOptions,
} from "./session";

export const MFA_CHALLENGE_COOKIE_NAME = "__Host-puzzle.mfa";

const MAX_MFA_COOKIE_LIFETIME_SECONDS = 600;

export type AuthMfaHandlersOptions = {
  readonly auth: AuthManager;
  readonly mfa: StorageAuthMfaManager;
  readonly stepUp: StorageAuthStepUpManager;
  readonly sessions: SessionManager;
  readonly cookie: SessionCookieOptions;
  readonly csrf: CsrfOptions;

  /**
   * Resolve the client IP using the deployment's trusted proxy configuration.
   *
   * Do not blindly trust arbitrary X-Forwarded-For values.
   */
  readonly resolveClientIp: (request: Request) => string;
};

export type AuthMfaPendingResponse = {
  readonly status: "mfa-pending";
  readonly purpose: "sign-in" | "step-up";
  readonly challengeId: string;
  readonly expiresAt: string;
  readonly availableFactors: readonly string[];
};

export type AuthClientUserResponse = {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly image: string | null;
  readonly emailVerified: boolean;
};

export type AuthMfaHandlers = {
  readonly signIn: (request: Request) => Promise<Response>;
  readonly getAuthState: (request: Request) => Promise<Response>;
  readonly signOut: (request: Request) => Promise<Response>;

  readonly verifySignInTotp: (request: Request) => Promise<Response>;
  readonly verifySignInRecoveryCode: (request: Request) => Promise<Response>;
  readonly beginPasskeySignIn: (request: Request) => Promise<Response>;
  readonly finishPasskeySignIn: (request: Request) => Promise<Response>;

  readonly beginPasskeyMfa: (request: Request) => Promise<Response>;
  readonly finishPasskeyMfa: (request: Request) => Promise<Response>;

  readonly beginTotpEnrollment: (request: Request) => Promise<Response>;
  readonly verifyTotpEnrollment: (request: Request) => Promise<Response>;
  readonly beginPasskeyRegistration: (request: Request) => Promise<Response>;
  readonly finishPasskeyRegistration: (request: Request) => Promise<Response>;

  readonly listMfaFactors: (request: Request) => Promise<Response>;
  readonly removeMfaFactor: (request: Request) => Promise<Response>;
  readonly regenerateRecoveryCodes: (request: Request) => Promise<Response>;

  readonly beginStepUp: (request: Request) => Promise<Response>;
  readonly beginStepUpPasskey: (request: Request) => Promise<Response>;
  readonly verifyStepUpTotp: (request: Request) => Promise<Response>;
  readonly verifyStepUpRecoveryCode: (request: Request) => Promise<Response>;
  readonly finishStepUpPasskey: (request: Request) => Promise<Response>;
};

type AuthEndpointHandler = (request: Request) => Promise<Response>;

type JsonObject = Record<string, unknown>;

type SignInResult = Awaited<ReturnType<AuthManager["signIn"]>>;

const isRecord = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isMfaPendingResult = (
  result: SignInResult,
): result is AuthMfaPendingResult =>
  "status" in result && result.status === "mfa-pending";

const jsonResponse = (
  value: unknown,
  status = 200,
  additionalHeaders?: HeadersInit,
): Response => {
  const headers = new Headers(additionalHeaders);

  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("Pragma", "no-cache");

  return new Response(JSON.stringify(value), {
    status,
    headers,
  });
};

const toClientUser = (user: AuthUser): AuthClientUserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  emailVerified: user.emailVerifiedAt !== null,
});

const containsChallengeToken = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.some(containsChallengeToken);
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(
    ([key, nested]) =>
      key === "challengeToken" || containsChallengeToken(nested),
  );
};

const getErrorResponse = (error: unknown): Response => {
  if (error instanceof AuthError) {
    const status =
      error.code === "RATE_LIMITED"
        ? 429
        : error.code === "INVALID_CREDENTIALS" ||
            error.code === "SESSION" ||
            error.code === "MFA_CHALLENGE"
          ? 401
          : error.code === "PROVIDER"
            ? 503
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

  if (error instanceof Error && error.name === "AuthStepUpRequiredError") {
    return jsonResponse(
      {
        error: {
          code: "STEP_UP_REQUIRED",
          message: "Recent MFA verification is required.",
        },
      },
      403,
    );
  }

  if (
    error instanceof Error &&
    (error.name === "SessionSecurityError" ||
      error.name === "SessionConfigurationError")
  ) {
    return jsonResponse(
      {
        error: {
          code: "REQUEST_FORBIDDEN",
          message: "The request could not be authorized.",
        },
      },
      403,
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
  (handler: AuthEndpointHandler): AuthEndpointHandler =>
  async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      return getErrorResponse(error);
    }
  };

const readJsonObject = async (request: Request): Promise<JsonObject> => {
  let value: unknown;

  try {
    value = await request.json();
  } catch {
    throw new AuthValidationError("A valid JSON request body is required.");
  }

  if (!isRecord(value)) {
    throw new AuthValidationError("The request body must be a JSON object.");
  }

  if (containsChallengeToken(value)) {
    throw new AuthValidationError(
      "MFA challenge tokens are managed by the HttpOnly cookie.",
    );
  }

  return value;
};

const requiredString = (
  body: JsonObject,
  name: string,
  maximumLength = 2048,
): string => {
  const value = body[name];

  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > maximumLength
  ) {
    throw new AuthValidationError(`A valid ${name} value is required.`);
  }

  return value;
};

const optionalString = (
  body: JsonObject,
  name: string,
  maximumLength = 2048,
): string | undefined => {
  const value = body[name];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string" || value.length > maximumLength) {
    throw new AuthValidationError(`The ${name} value is invalid.`);
  }

  return value;
};

const requireRequestMethod = (
  request: Request,
  expected: "GET" | "POST",
): void => {
  if (request.method.toUpperCase() !== expected) {
    throw new AuthValidationError(
      `This authentication endpoint requires ${expected}.`,
    );
  }
};

const protectPost = (
  request: Request,
  options: AuthMfaHandlersOptions,
): void => {
  requireRequestMethod(request, "POST");
  protectStateChangingRequest(request, options.csrf);
};

const requireSignInChallengeToken = (
  request: Request,
  options: AuthMfaHandlersOptions,
): string => {
  const sessionToken = getSessionToken(request, options.cookie);

  if (sessionToken) {
    throw new AuthMfaChallengeError();
  }

  return requireMfaChallengeToken(request);
};

const requireMfaChallengeToken = (request: Request): string => {
  const token = readMfaChallengeCookie(request.headers.get("cookie"));

  if (!token) {
    throw new AuthMfaChallengeError();
  }

  return token;
};

const getSessionToken = (
  request: Request,
  cookie: SessionCookieOptions,
): string | null =>
  readSessionCookie(request.headers.get("cookie"), cookie.name);

const getAuthenticatedContext = async (
  request: Request,
  options: AuthMfaHandlersOptions,
): Promise<{
  readonly session: SessionRecord;
  readonly sessionToken: string;
}> => {
  const sessionToken = getSessionToken(request, options.cookie);

  if (!sessionToken) {
    throw new AuthSessionError("An authenticated session is required.");
  }

  let session: SessionRecord | null;

  try {
    session = await options.sessions.validate(sessionToken);
  } catch (error) {
    throw new AuthSessionError(
      "Could not validate the authentication session.",
      { cause: error },
    );
  }

  if (
    !session ||
    session.kind !== "authenticated" ||
    !session.userId ||
    session.revokedAt !== null ||
    session.expiresAt.getTime() <= Date.now()
  ) {
    throw new AuthSessionError("An authenticated session is required.");
  }

  return {
    session,
    sessionToken,
  };
};

const getClientIp = (
  request: Request,
  options: AuthMfaHandlersOptions,
): string => {
  const ipAddress = options.resolveClientIp(request);

  if (
    typeof ipAddress !== "string" ||
    ipAddress.trim().length === 0 ||
    ipAddress.length > 128
  ) {
    throw new AuthValidationError(
      "The request does not contain a valid client IP address.",
    );
  }

  return ipAddress.trim();
};

const withSetCookie = (response: Response, cookie: string): Response => {
  const headers = new Headers(response.headers);

  headers.append("Set-Cookie", cookie);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const withClearedMfaChallengeCookie = (response: Response): Response =>
  withSetCookie(response, serializeClearedMfaChallengeCookie());

const withClearedSessionCookie = (
  response: Response,
  cookie: SessionCookieOptions,
): Response => withSetCookie(response, serializeClearedSessionCookie(cookie));

const maxAgeUntil = (expiresAt: Date): number => {
  const seconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new AuthMfaChallengeError();
  }

  return Math.min(seconds, MAX_MFA_COOKIE_LIFETIME_SECONDS);
};

const createSessionResultResponse = (
  result: AuthResult,
  options: AuthMfaHandlersOptions,
): Response => {
  const response = createSessionResponse(
    JSON.stringify({
      status: "authenticated",
      user: toClientUser(result.user),
    }),
    result.token,
    {
      sessions: options.sessions,
      cookie: options.cookie,
    },
    result.session.expiresAt,
  );

  return withClearedMfaChallengeCookie(response);
};

export const serializeMfaChallengeCookie = (
  challengeToken: string,
  maxAgeSeconds: number,
): string => {
  if (
    typeof challengeToken !== "string" ||
    !/^[a-f0-9]{64}$/i.test(challengeToken)
  ) {
    throw new AuthMfaChallengeError();
  }

  if (
    !Number.isInteger(maxAgeSeconds) ||
    maxAgeSeconds < 1 ||
    maxAgeSeconds > MAX_MFA_COOKIE_LIFETIME_SECONDS
  ) {
    throw new AuthValidationError(
      "The MFA challenge cookie lifetime is invalid.",
    );
  }

  return [
    `${MFA_CHALLENGE_COOKIE_NAME}=${encodeURIComponent(challengeToken)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ].join("; ");
};

export const serializeClearedMfaChallengeCookie = (): string =>
  [
    `${MFA_CHALLENGE_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ].join("; ");

export const readMfaChallengeCookie = (
  cookieHeader: string | null,
): string | null => {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator < 0) {
      continue;
    }

    const name = part.slice(0, separator).trim();

    if (name !== MFA_CHALLENGE_COOKIE_NAME) {
      continue;
    }

    let token: string;

    try {
      token = decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }

    return /^[a-f0-9]{64}$/i.test(token) ? token : null;
  }

  return null;
};

/**
 * Builds a safe public MFA-pending response.
 *
 * The raw challenge token is written only to Set-Cookie and is deliberately
 * excluded from the JSON body.
 */
export const createMfaPendingResponse = (
  challenge: AuthMfaPendingResult,
  purpose: "sign-in" | "step-up" = "sign-in",
): Response =>
  createMfaChallengeResponse(challenge.challengeToken, challenge.expiresAt, {
    status: "mfa-pending",
    purpose,
    challengeId: challenge.challengeId,
    expiresAt: challenge.expiresAt.toISOString(),
    availableFactors: challenge.availableFactors,
  });

export const createMfaChallengeResponse = (
  challengeToken: string,
  expiresAt: Date,
  body: JsonObject,
  status = 200,
): Response => {
  if (containsChallengeToken(body)) {
    throw new AuthValidationError(
      "The raw MFA challenge token cannot be included in a response body.",
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });

  headers.append(
    "Set-Cookie",
    serializeMfaChallengeCookie(challengeToken, maxAgeUntil(expiresAt)),
  );

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
};

export const createAuthMfaHandlers = (
  options: AuthMfaHandlersOptions,
): AuthMfaHandlers => {
  const sessionOptions: SessionRequestOptions = {
    sessions: options.sessions,
    cookie: options.cookie,
  };

  const signIn = endpoint(async (request) => {
    protectPost(request, options);

    const body = await readJsonObject(request);

    const result = await options.auth.signIn({
      email: requiredString(body, "email", 320),
      password: requiredString(body, "password", 4096),
      ipAddress: getClientIp(request, options),
    });

    if (isMfaPendingResult(result)) {
      const pending = createMfaPendingResponse(result, "sign-in");

      return withClearedSessionCookie(pending, options.cookie);
    }

    return createSessionResultResponse(result, options);
  });

  const getAuthState = endpoint(async (request) => {
    requireRequestMethod(request, "GET");

    const challengeToken = readMfaChallengeCookie(
      request.headers.get("cookie"),
    );
    const sessionToken = getSessionToken(request, options.cookie);

    if (challengeToken && sessionToken) {
      const stepUpState = await options.stepUp.getPendingAuthState(
        challengeToken,
        sessionToken,
      );

      if (stepUpState) {
        const availableFactors =
          await options.mfa.getAvailableFactors(challengeToken);

        return jsonResponse({
          status: "step-up-pending",
          user: null,
          mfa: {
            purpose: "step-up",
            challengeId: stepUpState.challengeId,
            expiresAt: stepUpState.expiresAt.toISOString(),
            availableFactors,
          },
        });
      }
    } else if (challengeToken) {
      const pending = await options.auth.getAuthState(challengeToken);

      if (pending.status === "mfa-pending") {
        const availableFactors =
          await options.mfa.getAvailableFactors(challengeToken);

        return jsonResponse({
          status: "mfa-pending",
          user: null,
          mfa: {
            purpose: "sign-in",
            challengeId: pending.challengeId,
            expiresAt: pending.expiresAt.toISOString(),
            availableFactors,
          },
        });
      }
    }

    if (!sessionToken) {
      return jsonResponse({
        status: "unauthenticated",
        user: null,
      });
    }

    const state = await options.auth.getAuthState(sessionToken);

    if (state.status !== "authenticated") {
      return jsonResponse({
        status: "unauthenticated",
        user: null,
      });
    }

    const user = await options.auth.getCurrentUser(sessionToken);

    if (!user) {
      return jsonResponse({
        status: "unauthenticated",
        user: null,
      });
    }

    return jsonResponse({
      status: "authenticated",
      user: toClientUser(user),
    });
  });

  const signOut = endpoint(async (request) => {
    protectPost(request, options);

    const sessionToken = getSessionToken(request, options.cookie);

    if (sessionToken) {
      await options.auth.signOut(sessionToken);
    }

    const response = clearSessionResponse(
      JSON.stringify({ success: true }),
      sessionOptions,
    );

    return withClearedMfaChallengeCookie(response);
  });

  const verifySignInTotp = endpoint(async (request) => {
    protectPost(request, options);

    const body = await readJsonObject(request);
    const challengeToken = await requireSignInChallengeToken(request, options);

    const result = await options.mfa.verifySignInTotp({
      challengeToken,
      code: requiredString(body, "code", 16),
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const verifySignInRecoveryCode = endpoint(async (request) => {
    protectPost(request, options);

    const body = await readJsonObject(request);
    const challengeToken = await requireSignInChallengeToken(request, options);

    const result = await options.mfa.verifySignInRecoveryCode({
      challengeToken,
      code: requiredString(body, "code", 128),
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const beginPasskeySignIn = endpoint(async (request) => {
    protectPost(request, options);

    const challenge = await options.mfa.beginPasskeySignIn({
      ipAddress: getClientIp(request, options),
    });

    return createMfaChallengeResponse(
      challenge.challengeToken,
      challenge.expiresAt,
      {
        status: "mfa-pending",
        purpose: "passkey-sign-in",
        challengeId: challenge.challengeId,
        expiresAt: challenge.expiresAt.toISOString(),
        options: challenge.options,
      },
    );
  });

  const finishPasskeySignIn = endpoint(async (request) => {
    protectPost(request, options);

    const body = await readJsonObject(request);
    const response = body.response;

    if (!isRecord(response)) {
      throw new AuthValidationError(
        "A valid passkey authentication response is required.",
      );
    }

    const result = await options.mfa.finishPasskeySignIn({
      challengeToken: requireMfaChallengeToken(request),
      response,
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const beginPasskeyMfa = endpoint(async (request) => {
    protectPost(request, options);

    const challengeToken = await requireSignInChallengeToken(request, options);

    const started = await options.mfa.beginPasskeyMfa(
      challengeToken,
      getClientIp(request, options),
    );

    const pending = await options.auth.getAuthState(challengeToken);

    if (pending.status !== "mfa-pending") {
      throw new AuthMfaChallengeError();
    }

    return createMfaChallengeResponse(challengeToken, started.expiresAt, {
      status: "mfa-pending",
      purpose: "sign-in",
      challengeId: pending.challengeId,
      expiresAt: started.expiresAt.toISOString(),
      options: started.options,
    });
  });

  const finishPasskeyMfa = endpoint(async (request) => {
    protectPost(request, options);

    const body = await readJsonObject(request);
    const response = body.response;

    if (!isRecord(response)) {
      throw new AuthValidationError(
        "A valid passkey authentication response is required.",
      );
    }

    const result = await options.mfa.finishPasskeyMfa({
      challengeToken: await requireSignInChallengeToken(request, options),
      response,
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const beginTotpEnrollment = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const enrollment = await options.mfa.beginTotpEnrollment({
      sessionToken: context.sessionToken,
      currentPassword: requiredString(body, "currentPassword", 4096),
      ipAddress: getClientIp(request, options),
      label: optionalString(body, "label", 64),
    });

    return jsonResponse({
      status: "totp-enrollment-pending",
      factorId: enrollment.factorId,
      secret: enrollment.secret,
      otpauthUrl: enrollment.otpauthUrl,
      expiresAt: enrollment.expiresAt.toISOString(),
    });
  });

  const verifyTotpEnrollment = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const completed = await options.mfa.verifyTotpEnrollment({
      sessionToken: context.sessionToken,
      factorId: requiredString(body, "factorId", 256),
      code: requiredString(body, "code", 16),
      ipAddress: getClientIp(request, options),
    });

    return jsonResponse({
      status: "mfa-factor-added",
      factor: completed.factor,
      recoveryCodes: completed.recoveryCodes,
    });
  });

  const beginPasskeyRegistration = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const started = await options.mfa.beginPasskeyRegistration({
      sessionToken: context.sessionToken,
      currentPassword: requiredString(body, "currentPassword", 4096),
      ipAddress: getClientIp(request, options),
      label: optionalString(body, "label", 64),
    });

    return createMfaChallengeResponse(
      started.challengeToken,
      started.expiresAt,
      {
        status: "passkey-registration-pending",
        challengeId: started.challengeId,
        expiresAt: started.expiresAt.toISOString(),
        options: started.options,
      },
    );
  });

  const finishPasskeyRegistration = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    if (!isRecord(body.response)) {
      throw new AuthValidationError(
        "A valid passkey registration response is required.",
      );
    }

    const completed = await options.mfa.finishPasskeyRegistration({
      sessionToken: context.sessionToken,
      challengeToken: requireMfaChallengeToken(request),
      response: body.response,
      ipAddress: getClientIp(request, options),
    });

    return withClearedMfaChallengeCookie(
      jsonResponse({
        status: "mfa-factor-added",
        factor: completed.factor,
        recoveryCodes: completed.recoveryCodes,
      }),
    );
  });

  const listMfaFactors = endpoint(async (request) => {
    requireRequestMethod(request, "GET");

    const context = await getAuthenticatedContext(request, options);
    const factors = await options.mfa.listFactors(context.sessionToken);
    const recoveryCodeCount = await options.mfa.getRecoveryCodeCount(
      context.sessionToken,
    );

    return jsonResponse({
      factors,
      recoveryCodeCount,
    });
  });

  const removeMfaFactor = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    await options.mfa.removeFactor({
      sessionToken: context.sessionToken,
      factorId: requiredString(body, "factorId", 256),
      currentPassword: requiredString(body, "currentPassword", 4096),
      ipAddress: getClientIp(request, options),
    });

    return jsonResponse({ success: true });
  });

  const regenerateRecoveryCodes = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const recoveryCodes = await options.mfa.regenerateRecoveryCodes({
      sessionToken: context.sessionToken,
      currentPassword: requiredString(body, "currentPassword", 4096),
      ipAddress: getClientIp(request, options),
    });

    return jsonResponse({
      status: "recovery-codes-regenerated",
      recoveryCodes,
    });
  });

  const beginStepUp = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);

    const challenge = await options.stepUp.beginStepUp({
      sessionToken: context.sessionToken,
      ipAddress: getClientIp(request, options),
    });

    return createMfaPendingResponse(challenge, "step-up");
  });

  const beginStepUpPasskey = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const challengeToken = requireMfaChallengeToken(request);

    const started = await options.stepUp.beginPasskey({
      challengeToken,
      sessionToken: context.sessionToken,
      ipAddress: getClientIp(request, options),
    });

    const pending = await options.stepUp.getPendingAuthState(
      challengeToken,
      context.sessionToken,
    );

    if (!pending) {
      throw new AuthMfaChallengeError();
    }

    return createMfaChallengeResponse(challengeToken, started.expiresAt, {
      status: "step-up-pending",
      purpose: "step-up",
      challengeId: pending.challengeId,
      expiresAt: started.expiresAt.toISOString(),
      options: started.options,
    });
  });

  const verifyStepUpTotp = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const result = await options.stepUp.verifyTotp({
      challengeToken: requireMfaChallengeToken(request),
      sessionToken: context.sessionToken,
      code: requiredString(body, "code", 16),
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const verifyStepUpRecoveryCode = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    const result = await options.stepUp.verifyRecoveryCode({
      challengeToken: requireMfaChallengeToken(request),
      sessionToken: context.sessionToken,
      code: requiredString(body, "code", 128),
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  const finishStepUpPasskey = endpoint(async (request) => {
    protectPost(request, options);

    const context = await getAuthenticatedContext(request, options);
    const body = await readJsonObject(request);

    if (!isRecord(body.response)) {
      throw new AuthValidationError(
        "A valid passkey authentication response is required.",
      );
    }

    const result = await options.stepUp.finishPasskey({
      challengeToken: requireMfaChallengeToken(request),
      sessionToken: context.sessionToken,
      response: body.response,
      ipAddress: getClientIp(request, options),
    });

    return createSessionResultResponse(result, options);
  });

  return {
    signIn,
    getAuthState,
    signOut,

    verifySignInTotp,
    verifySignInRecoveryCode,
    beginPasskeySignIn,
    finishPasskeySignIn,

    beginPasskeyMfa,
    finishPasskeyMfa,

    beginTotpEnrollment,
    verifyTotpEnrollment,
    beginPasskeyRegistration,
    finishPasskeyRegistration,

    listMfaFactors,
    removeMfaFactor,
    regenerateRecoveryCodes,

    beginStepUp,
    beginStepUpPasskey,
    verifyStepUpTotp,
    verifyStepUpRecoveryCode,
    finishStepUpPasskey,
  };
};

/**
 * Returns true when the current authenticated session has a recent,
 * successfully verified step-up.
 *
 * This can be used by sensitive server actions after `getRequestSession()`.
 */
export const hasRecentStepUp = (
  session: SessionRecord | null,
  maxAgeSeconds = 300,
  now = new Date(),
): boolean => {
  if (
    !session ||
    session.kind !== "authenticated" ||
    !session.userId ||
    !Number.isInteger(maxAgeSeconds) ||
    maxAgeSeconds < 1 ||
    maxAgeSeconds > 3600
  ) {
    return false;
  }

  const verifiedAt = session.metadata?.stepUpVerifiedAt;
  const previousSessionId = session.metadata?.stepUpOfSessionId;

  if (
    typeof verifiedAt !== "string" ||
    typeof previousSessionId !== "string" ||
    previousSessionId.length === 0
  ) {
    return false;
  }

  const timestamp = Date.parse(verifiedAt);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const age = now.getTime() - timestamp;

  return age >= -30_000 && age <= maxAgeSeconds * 1000;
};

export class AuthStepUpRequiredError extends Error {
  constructor() {
    super("Recent MFA verification is required.");

    this.name = "AuthStepUpRequiredError";
  }
}

/**
 * Use this from server actions that require recent MFA verification.
 *
 * The returned session has already been validated by SessionManager.
 */
export const requireRecentStepUp = async (
  request: Request,
  options: SessionRequestOptions,
  maxAgeSeconds = 300,
): Promise<SessionRecord> => {
  const session = await getRequestSession(request, options);

  if (!session || !hasRecentStepUp(session, maxAgeSeconds)) {
    throw new AuthStepUpRequiredError();
  }

  return session;
};
