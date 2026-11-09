import type {
  EmailProvider,
  PasswordHasher,
  RateLimitProvider,
} from "@puzzle-ui/auth";
import type { SessionManager } from "@puzzle-ui/session";

export type AuthServerOptions = {
  readonly passwordHasher: PasswordHasher;
  readonly emailProvider: EmailProvider;
  readonly rateLimitProvider: RateLimitProvider;
  readonly sessions: SessionManager;
};

export type AuthServer = {
  readonly options: AuthServerOptions;
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
