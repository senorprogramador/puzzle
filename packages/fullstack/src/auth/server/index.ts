import type { PasswordHasher, EmailProvider, RateLimitProvider } from "@puzzle-ui/auth";
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
