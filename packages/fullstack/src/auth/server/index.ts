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

export type AuthServerOptions = AuthMfaHandlersOptions & {
  readonly passwordHasher?: PasswordHasher;
  readonly emailProvider?: EmailProvider;
  readonly rateLimitProvider?: RateLimitProvider;
};

export type AuthServer = {
  readonly options: AuthServerOptions;
  readonly handlers: AuthMfaHandlers;
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

export const createAuthServer = (options: AuthServerOptions): AuthServer => {
  let initializationPromise: Promise<void> | null = null;

  return {
    options,
    handlers: createAuthMfaHandlers(options),

    initialize: () => {
      if (!initializationPromise) {
        const initialization = (async () => {
          const authServer = createAuthServer(options);

          await authServer.initialize();

          const routes = createAuthRouteHandlers(authServer, "/api/auth");
          await options.auth.initialize();
          await options.mfa.initialize();
          await options.stepUp.initialize();
        })();

        initializationPromise = initialization.catch((error) => {
          initializationPromise = null;
          throw error;
        });
      }

      return initializationPromise;
    },
  };
};

export const createAuthRouteHandlers = (
  server: AuthServer,
  basePath = "",
): AuthRouteHandlerMap => {
  const prefix = basePath.replace(/\/+$/, "");

  const route = (path: string): string => `${prefix}${path}`;

  const handlers = server.handlers;

  return {
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
