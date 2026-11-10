import type { StorageRecord } from "@puzzle-ui/storage";

import type { ProtectedAuthSecret } from "../providers/mfa-provider.types";

import type { AuthState } from "./state.types";

export type AuthMfaFactorType = "totp" | "passkey";

export type AuthMfaFactorStatus = "pending" | "active";

export type AuthMfaAvailableFactor = "totp" | "passkey" | "recovery-code";

export type AuthMfaFactor = {
  readonly id: string;
  readonly type: AuthMfaFactorType;
  readonly status: AuthMfaFactorStatus;
  readonly label: string;
  readonly createdAt: Date;
  readonly lastUsedAt: Date | null;
};

export type AuthMfaFactorStorageRecord = StorageRecord & {
  readonly userId: string;

  /**
   * Globally unique key.
   * TOTP: totp:<factor-id>
   * Passkey: passkey:<credential-id>
   */
  readonly factorKey: string;

  readonly type: AuthMfaFactorType;
  readonly status: AuthMfaFactorStatus;
  readonly label: string;

  /** Encrypted TOTP secret; never populated for passkeys. */
  readonly secret: ProtectedAuthSecret | null;

  /** WebAuthn credential data; never populated for TOTP. */
  readonly credentialId: string | null;
  readonly publicKey: string | null;
  readonly counter: number;
  readonly transports: readonly string[];

  /** Prevents reuse of an accepted TOTP time step. */
  readonly lastUsedStep: number | null;

  readonly lastUsedAt: Date | null;

  /** Pending enrollments expire automatically at the domain level. */
  readonly expiresAt: Date | null;
};

export type AuthMfaChallengePurpose =
  | "sign-in"
  | "passkey-registration"
  | "passkey-sign-in";

export type AuthMfaChallengeStorageRecord = StorageRecord & {
  readonly purpose: AuthMfaChallengePurpose;

  /** SHA-256 hash of the temporary challenge token. */
  readonly tokenHash: string;

  /** Null for discoverable passkey sign-in. */
  readonly userId: string | null;

  /** Factors accepted by the current MFA challenge. */
  readonly factorIds: readonly string[];

  /** Passkeys allowed for an in-progress WebAuthn ceremony. */
  readonly webAuthnFactorIds: readonly string[];

  /** WebAuthn challenge, bound to this temporary record. */
  readonly webAuthnChallenge: string | null;

  /** Label selected when a passkey registration was initiated. */
  readonly factorLabel: string | null;

  /**
   * Account-state snapshot for password-backed sign-in challenges.
   * A challenge becomes invalid if either record changes.
   */
  readonly userRevision: number | null;
  readonly credentialRevision: number | null;

  readonly attemptCount: number;
  readonly maximumAttempts: number;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
};

export type AuthRecoveryCodeStorageRecord = StorageRecord & {
  readonly userId: string;
  readonly factorId: string;
  readonly codeHash: string;
  readonly consumedAt: Date | null;
};

export type AuthMfaPendingResult = {
  readonly status: "mfa-pending";
  readonly challengeId: string;

  /**
   * Server-only temporary credential.
   *
   * Deliver this through a short-lived HttpOnly cookie.
   * Never serialize it into browser JSON or browser storage.
   */
  readonly challengeToken: string;

  readonly expiresAt: Date;
  readonly availableFactors: readonly AuthMfaAvailableFactor[];
};

export type AuthMfaGateway = {
  initialize(): Promise<void>;

  createSignInChallenge(input: {
    readonly userId: string;
    readonly ipAddress: string;
  }): Promise<AuthMfaPendingResult | null>;

  getPendingAuthState(token: string): Promise<AuthState | null>;

  revokeChallenges(userId: string): Promise<void>;
};

export type AuthMfaTotpOptions = {
  readonly digits: number;
  readonly periodSeconds: number;

  /** Number of adjacent time steps accepted on either side. */
  readonly window: number;
};

export type AuthMfaWebAuthnOptions = {
  readonly rpId: string;
  readonly rpName: string;

  /** Exact expected browser origin, including scheme and port. */
  readonly origin: string;
};

export type AuthMfaManagerOptions = {
  readonly rateLimitKeySecret: string;

  readonly usersCollection?: string;
  readonly credentialsCollection?: string;
  readonly auditCollection?: string;

  readonly factorsCollection?: string;
  readonly challengesCollection?: string;
  readonly recoveryCodesCollection?: string;

  readonly challengeLifetimeSeconds?: number;
  readonly recoveryCodeCount?: number;

  readonly issuer?: string;

  readonly totp?: Partial<AuthMfaTotpOptions>;
  readonly webAuthn?: AuthMfaWebAuthnOptions;

  /** Keep this aligned with AuthManagerOptions.requireVerifiedEmail. */
  readonly requireVerifiedEmail?: boolean;

  readonly clock?: () => Date;
};

export type BeginTotpEnrollmentInput = {
  readonly sessionToken: string;
  readonly currentPassword: string;
  readonly ipAddress: string;
  readonly label?: string;
};

export type TotpEnrollmentStarted = {
  readonly factorId: string;
  readonly secret: string;
  readonly otpauthUrl: string;
  readonly expiresAt: Date;
};

export type VerifyTotpEnrollmentInput = {
  readonly sessionToken: string;
  readonly factorId: string;
  readonly code: string;
  readonly ipAddress: string;
};

export type MfaEnrollmentCompleted = {
  readonly factor: AuthMfaFactor;
  readonly recoveryCodes: readonly string[];
};

export type BeginPasskeyRegistrationInput = {
  readonly sessionToken: string;
  readonly currentPassword: string;
  readonly ipAddress: string;
  readonly label?: string;
};

export type PasskeyRegistrationStarted = {
  readonly challengeId: string;
  readonly challengeToken: string;
  readonly options: Readonly<Record<string, unknown>>;
  readonly expiresAt: Date;
};

export type FinishPasskeyRegistrationInput = {
  readonly sessionToken: string;
  readonly challengeToken: string;
  readonly response: unknown;
  readonly ipAddress: string;
};

export type BeginPasskeySignInInput = {
  readonly ipAddress: string;
};

export type PasskeySignInStarted = {
  readonly challengeId: string;
  readonly challengeToken: string;
  readonly options: Readonly<Record<string, unknown>>;
  readonly expiresAt: Date;
};

export type CompleteMfaSignInInput = {
  readonly challengeToken: string;
  readonly code: string;
  readonly ipAddress: string;
};

export type PasskeyMfaStarted = {
  readonly options: Readonly<Record<string, unknown>>;
  readonly expiresAt: Date;
};

export type PasskeyMfaCompletedInput = {
  readonly challengeToken: string;
  readonly response: unknown;
  readonly ipAddress: string;
};

export type RemoveMfaFactorInput = {
  readonly sessionToken: string;
  readonly factorId: string;
  readonly currentPassword: string;
  readonly ipAddress: string;
};

export type RegenerateRecoveryCodesInput = {
  readonly sessionToken: string;
  readonly currentPassword: string;
  readonly ipAddress: string;
};
