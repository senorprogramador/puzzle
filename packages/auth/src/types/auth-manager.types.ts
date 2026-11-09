import type { StorageAdapter } from "@puzzle-ui/storage";
import type { SessionManager } from "@puzzle-ui/session";

import type {
  PasswordHasher,
  RateLimitProvider,
} from "../providers/provider.types";
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

export type AuthManagerOptions = {
  readonly rateLimitKeySecret: string;

  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
  readonly auditCollection?: string;

  readonly minimumPasswordLength?: number;
  readonly maximumPasswordLength?: number;

  /**
   * When enabled, valid credentials are still rejected until the account
   * has completed email verification.
   */
  readonly requireVerifiedEmail?: boolean;

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

  /**
   * Raw session token.
   *
   * Server-only. Deliver exclusively through a secure HttpOnly cookie.
   * Never serialize this token into a client-side JSON response.
   */
  readonly token: string;
};

export type AuthRegisterInput = {
  readonly email: string;
  readonly password: string;
  readonly name?: string | null;

  /**
   * The trusted client IP supplied by the framework integration.
   * Do not blindly trust arbitrary X-Forwarded-For values.
   */
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

  signIn(input: AuthSignInInput): Promise<AuthResult>;

  getCurrentUser(token: string): Promise<AuthUser | null>;

  getAuthState(token: string): Promise<AuthState>;

  signOut(token: string): Promise<void>;

  signOutEverywhere(userId: string): Promise<void>;
}
