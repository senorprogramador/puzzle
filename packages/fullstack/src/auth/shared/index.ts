export type AuthClientStatus =
  | "loading"
  | "unauthenticated"
  | "mfa-pending"
  | "mfa-enrollment-pending"
  | "mfa-enrollment-required"
  | "step-up-pending"
  | "authenticated";

export type AuthClientUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly image: string | null;
  readonly emailVerified: boolean;
};

export type AuthClientMfaState = {
  readonly purpose: "sign-in" | "enrollment" | "step-up" | "passkey-sign-in";
  readonly challengeId: string;
  readonly expiresAt: string;
  readonly availableFactors?: readonly ("totp" | "passkey" | "recovery-code")[];
};

export type AuthClientOptions = {
  readonly basePath?: string;
  readonly credentials?: "same-origin" | "include";
  readonly fetcher?: typeof fetch;
};

export type AuthClientSnapshot = {
  readonly status: AuthClientStatus;
  readonly user: AuthClientUser | null;
  readonly mfa?: AuthClientMfaState;
};

export type AuthClientSignInInput = {
  readonly email: string;
  readonly password: string;
};

export type AuthClientRegisterInput = {
  readonly email: string;
  readonly password: string;
  readonly name?: string | null;
};

export type AuthClientMfaFactor = {
  readonly id: string;
  readonly type: "totp" | "passkey";
  readonly status: "pending" | "active";
  readonly label: string;
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
};

export type AuthClientTotpEnrollment = {
  readonly status: "totp-enrollment-pending";
  readonly factorId: string;
  readonly secret: string;
  readonly otpauthUrl: string;
  readonly expiresAt: string;
};

export type AuthClientEnrollmentResult = {
  readonly status: "mfa-factor-added";
  readonly factor: AuthClientMfaFactor;
  readonly recoveryCodes: readonly string[];
};

export type AuthClientRecoveryCodesResult = {
  readonly status: "recovery-codes-regenerated";
  readonly recoveryCodes: readonly string[];
};

export type AuthClientFactorList = {
  readonly factors: readonly AuthClientMfaFactor[];
  readonly recoveryCodeCount: number;
};

export type AuthClientLifecycleResult = {
  readonly status:
    | "verification-requested"
    | "email-verified"
    | "password-reset-requested"
    | "password-reset"
    | "password-changed";
};
