import type { StorageAdapter } from "@puzzle-ui/storage";
import type { SessionManager } from "@puzzle-ui/session";

import type {
  PasswordHasher,
  RateLimitProvider,
} from "../providers/provider.types";

import type { AuthMfaGateway, AuthMfaPendingResult } from "./mfa.types";
import type { AuthState } from "./state.types";
import type { AuthUser } from "./user.types";

export type AuthRateLimitRule = {
  readonly limit: number;
  readonly windowSeconds: number;
};

export type AuthRateLimitScopePolicy = {
  readonly email: AuthRateLimitRule;
  readonly ip: AuthRateLimitRule;
};

export type AuthRateLimitPolicies = {
  readonly registration: AuthRateLimitScopePolicy;
  readonly signIn: AuthRateLimitScopePolicy;
};

/**
 * Determines which users must authenticate with MFA.
 *
 * When required is true, MFA is required for every user.
 * requiredFor can additionally enforce MFA for selected users.
 *
 * When neither option is configured, MFA remains optional for
 * users without enrolled factors. Existing enrolled factors are
 * still challenged during sign-in.
 */
export type AuthMfaPolicy = {
  readonly required?: boolean;
  readonly requiredFor?: (user: AuthUser) => boolean | Promise<boolean>;
};

export type AuthManagerOptions = {
  readonly rateLimitKeySecret: string;

  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
  readonly auditCollection?: string;

  readonly minimumPasswordLength?: number;
  readonly maximumPasswordLength?: number;

  readonly requireVerifiedEmail?: boolean;

  readonly mfaPolicy?: AuthMfaPolicy;

  readonly rateLimits?: {
    readonly registration?: Partial<AuthRateLimitScopePolicy>;
    readonly signIn?: Partial<AuthRateLimitScopePolicy>;
  };

  readonly clock?: () => Date;
};

export type AuthManagerDependencies = {
  readonly storage: StorageAdapter;
  readonly passwordHasher: PasswordHasher;
  readonly rateLimitProvider: RateLimitProvider;
  readonly sessions: SessionManager;
  readonly mfa?: AuthMfaGateway;
};

export type AuthSession = {
  readonly id: string;
  readonly userId: string;
  readonly kind: "authenticated";
  readonly createdAt: Date;
  readonly lastSeenAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
};

export type AuthResult = {
  readonly user: AuthUser;
  readonly session: AuthSession;

  /** Server-only. Deliver exclusively through a secure HttpOnly cookie. */
  readonly token: string;
};

/**
 * A successful password check may result in either:
 *
 * 1. A fully authenticated session.
 * 2. An MFA-pending challenge without an authenticated session.
 */
export type AuthSignInResult = AuthResult | AuthMfaPendingResult;

export type AuthRegisterInput = {
  readonly email: string;
  readonly password: string;
  readonly name?: string | null;
  readonly ipAddress: string;
  readonly sessionMetadata?: Readonly<Record<string, unknown>>;
};

export type AuthSignInInput = {
  readonly email: string;
  readonly password: string;
  readonly ipAddress: string;
  readonly sessionMetadata?: Readonly<Record<string, unknown>>;
};

export interface AuthManager {
  initialize(): Promise<void>;

  register(input: AuthRegisterInput): Promise<AuthResult>;

  signIn(input: AuthSignInInput): Promise<AuthSignInResult>;

  getCurrentUser(token: string): Promise<AuthUser | null>;

  getAuthState(token: string): Promise<AuthState>;

  signOut(token: string): Promise<void>;

  signOutEverywhere(userId: string): Promise<void>;
}
