import type {
  EmailProvider,
  PasswordHasher,
  RateLimitProvider,
} from "@puzzle-ui/auth";

import {
  createAuthMfaHandlers,
  type AuthMfaHandlers,
  type AuthMfaHandlersOptions,
} from "./mfa";

import {
  createAuthLifecycleHandlers,
  type AuthLifecycleHandlers,
  type AuthLifecycleHandlersOptions,
} from "./lifecycle";

export type AuthServerOptions = AuthMfaHandlersOptions & {
  readonly passwordHasher?: PasswordHasher;
  readonly emailProvider?: EmailProvider;
  readonly rateLimitProvider?: RateLimitProvider;
  readonly lifecycle?: AuthLifecycleHandlersOptions;
};

export type AuthServerHandlers = AuthMfaHandlers &
  Partial<AuthLifecycleHandlers>;

export type AuthServer = {
  readonly options: AuthServerOptions;
  readonly handlers: AuthServerHandlers;
  initialize(): Promise<void>;
};

export type AuthHttpMethod = "GET" | "POST";

export type AuthRouteHandlerMap = Readonly<
  Record<
    string,
    Readonly<
      Partial<Record<AuthHttpMethod, (request: Request) => Promise<Response>>>
    >
  >
>;

const createInitializationErrorResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: {
        code: "AUTH_INITIALIZATION_FAILED",
        message: "Authentication is temporarily unavailable.",
      },
    }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    },
  );

export const createAuthServer = (options: AuthServerOptions): AuthServer => {
  let initializationPromise: Promise<void> | null = null;

  const initialize = (): Promise<void> => {
    if (!initializationPromise) {
      const initialization = (async () => {
        await options.mfa.initialize();
        await options.auth.initialize();
        await options.stepUp.initialize();

        if (options.lifecycle) {
          await options.lifecycle.lifecycle.initialize();
        }
      })();

      initializationPromise = initialization.catch((error) => {
        initializationPromise = null;
        throw error;
      });
    }

    return initializationPromise;
  };

  const rawHandlers: AuthServerHandlers = {
    ...createAuthMfaHandlers(options),
    ...(options.lifecycle
      ? createAuthLifecycleHandlers(options.lifecycle)
      : {}),
  };

  const handlers = Object.fromEntries(
    Object.entries(rawHandlers).map(([name, handler]) => [
      name,
      async (request: Request): Promise<Response> => {
        try {
          await initialize();
        } catch {
          return createInitializationErrorResponse();
        }

        return handler!(request);
      },
    ]),
  ) as AuthServerHandlers;

  return {
    options,
    handlers,
    initialize,
  };
};

export const createAuthRouteHandlers = (
  server: AuthServer,
  basePath = "/api/auth",
): AuthRouteHandlerMap => {
  const prefix = basePath.replace(/\/+$/, "");

  const route = (path: string): string => `${prefix}${path}`;

  const handlers = server.handlers;

  return {
    [route("/register")]: {
      POST: handlers.register,
    },

    [route("/sign-in")]: {
      POST: handlers.signIn,
    },

    [route("/state")]: {
      GET: handlers.getAuthState,
    },

    [route("/sign-out")]: {
      POST: handlers.signOut,
    },

    [route("/mfa/sign-in/totp")]: {
      POST: handlers.verifySignInTotp,
    },

    [route("/mfa/sign-in/recovery-code")]: {
      POST: handlers.verifySignInRecoveryCode,
    },

    [route("/mfa/passkey/sign-in/start")]: {
      POST: handlers.beginPasskeySignIn,
    },

    [route("/mfa/passkey/sign-in/finish")]: {
      POST: handlers.finishPasskeySignIn,
    },

    [route("/mfa/passkey/challenge/start")]: {
      POST: handlers.beginPasskeyMfa,
    },

    [route("/mfa/passkey/challenge/finish")]: {
      POST: handlers.finishPasskeyMfa,
    },

    [route("/mfa/totp/enrollment/start")]: {
      POST: handlers.beginTotpEnrollment,
    },

    [route("/mfa/totp/enrollment/finish")]: {
      POST: handlers.verifyTotpEnrollment,
    },

    [route("/mfa/passkey/enrollment/start")]: {
      POST: handlers.beginPasskeyRegistration,
    },

    [route("/mfa/passkey/enrollment/finish")]: {
      POST: handlers.finishPasskeyRegistration,
    },

    [route("/mfa/factors")]: {
      GET: handlers.listMfaFactors,
    },

    [route("/mfa/factors/remove")]: {
      POST: handlers.removeMfaFactor,
    },

    [route("/mfa/recovery-codes/regenerate")]: {
      POST: handlers.regenerateRecoveryCodes,
    },

    [route("/mfa/step-up/start")]: {
      POST: handlers.beginStepUp,
    },

    [route("/mfa/step-up/totp")]: {
      POST: handlers.verifyStepUpTotp,
    },

    [route("/mfa/step-up/recovery-code")]: {
      POST: handlers.verifyStepUpRecoveryCode,
    },

    [route("/mfa/step-up/passkey/start")]: {
      POST: handlers.beginStepUpPasskey,
    },

    [route("/mfa/step-up/passkey/finish")]: {
      POST: handlers.finishStepUpPasskey,
    },

    [route("/mfa/enrollment/required/totp/start")]: {
      POST: handlers.beginRequiredTotpEnrollment,
    },

    [route("/mfa/enrollment/required/totp/finish")]: {
      POST: handlers.verifyRequiredTotpEnrollment,
    },

    [route("/mfa/enrollment/required/passkey/start")]: {
      POST: handlers.beginRequiredPasskeyEnrollment,
    },

    [route("/mfa/enrollment/required/passkey/finish")]: {
      POST: handlers.finishRequiredPasskeyEnrollment,
    },

    ...(handlers.requestEmailVerification
      ? {
          [route("/email/verification/request")]: {
            POST: handlers.requestEmailVerification,
          },
        }
      : {}),

    ...(handlers.verifyEmail
      ? {
          [route("/email/verification/verify")]: {
            POST: handlers.verifyEmail,
          },
        }
      : {}),

    ...(handlers.requestPasswordReset
      ? {
          [route("/password/reset/request")]: {
            POST: handlers.requestPasswordReset,
          },
        }
      : {}),

    ...(handlers.resetPassword
      ? {
          [route("/password/reset/finish")]: {
            POST: handlers.resetPassword,
          },
        }
      : {}),

    ...(handlers.changePassword
      ? {
          [route("/password/change")]: {
            POST: handlers.changePassword,
          },
        }
      : {}),
  };
};

export {
  getRequestSession,
  protectAuthenticatedRequest,
  createSessionResponse,
  clearSessionResponse,
  logoutRequest,
  logoutAllRequest,
} from "./session";

export type { SessionRequestOptions, SessionResponseOptions } from "./session";

export {
  MFA_CHALLENGE_COOKIE_NAME,
  serializeMfaChallengeCookie,
  serializeClearedMfaChallengeCookie,
  readMfaChallengeCookie,
  createMfaPendingResponse,
  createMfaChallengeResponse,
  createAuthMfaHandlers,
  hasRecentStepUp,
  requireRecentStepUp,
  AuthStepUpRequiredError,
} from "./mfa";

export type {
  AuthMfaHandlersOptions,
  AuthMfaHandlers,
  AuthMfaPendingResponse,
  AuthClientUserResponse,
} from "./mfa";

export { createAuthLifecycleHandlers } from "./lifecycle";

export type {
  AuthLifecycleHandlers,
  AuthLifecycleHandlersOptions,
} from "./lifecycle";

export { createAuthReadinessHandler } from "./health";

export type {
  AuthReadinessCheck,
  AuthReadinessOptions,
  AuthReadinessResult,
} from "./health";
