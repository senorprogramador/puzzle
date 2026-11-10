import type { StorageRecord } from "@puzzle-ui/storage";

export type AuthActionTokenPurpose =
  | "email-verification"
  | "password-reset"
  | "email-change";

export type AuthActionTokenStorageRecord = StorageRecord & {
  readonly userId: string;
  readonly purpose: AuthActionTokenPurpose;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
  readonly targetEmail: string | null;
};

export type AuthAuditAction =
  | "account-registered"
  | "sign-in"
  | "sign-in-failed"
  | "sign-out"
  | "sign-out-everywhere"
  | "email-verification-requested"
  | "email-verified"
  | "password-reset-requested"
  | "password-reset-completed"
  | "password-changed"
  | "profile-updated"
  | "email-change-requested"
  | "email-changed"
  | "account-deactivated"
  | "account-deleted"
  | "mfa-challenge-created"
  | "mfa-challenge-failed"
  | "mfa-completed"
  | "mfa-factor-added"
  | "mfa-factor-removed"
  | "mfa-recovery-codes-regenerated"
  | "passkey-registered"
  | "passkey-authenticated";

export type AuthAuditEventStorageRecord = StorageRecord & {
  readonly action: AuthAuditAction;
  readonly userId: string | null;
  readonly sessionId: string | null;
  readonly metadata?: Readonly<
    Record<string, string | number | boolean | null>
  >;
};

export type AuthRateLimitStorageRecord = StorageRecord & {
  readonly windowStartedAt: Date;
  readonly resetAt: Date;
  readonly windowSeconds: number;
  readonly count: number;
};

export type AuthRateLimitRule = {
  readonly limit: number;
  readonly windowSeconds: number;
};

export type AuthLifecycleRateLimitAction =
  | "emailVerification"
  | "passwordReset"
  | "emailChange";

export type AuthLifecycleRateLimitPolicy = {
  readonly email?: AuthRateLimitRule;
  readonly ip?: AuthRateLimitRule;
};

export type AuthLifecycleRateLimitPolicies = Partial<
  Record<AuthLifecycleRateLimitAction, AuthLifecycleRateLimitPolicy>
>;

export type AuthLifecycleManagerOptions = {
  readonly rateLimitKeySecret: string;

  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
  readonly actionTokensCollection?: string;
  readonly auditCollection?: string;
  readonly rateLimitsCollection?: string;

  readonly minimumPasswordLength?: number;
  readonly maximumPasswordLength?: number;

  readonly emailVerificationTokenLifetimeSeconds?: number;
  readonly passwordResetTokenLifetimeSeconds?: number;
  readonly emailChangeTokenLifetimeSeconds?: number;

  readonly emailTemplates?: Partial<
    Record<"emailVerification" | "passwordReset" | "emailChange", string>
  >;

  readonly emailSubjects?: Partial<
    Record<"emailVerification" | "passwordReset" | "emailChange", string>
  >;

  readonly rateLimits?: AuthLifecycleRateLimitPolicies;
  readonly clock?: () => Date;

  readonly requireVerifiedEmail?: boolean;

  readonly onEmailDeliveryError?: (error: unknown) => void;
  readonly onSessionRevocationError?: (error: unknown) => void;
};
