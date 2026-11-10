export {
  StorageAuthManager,
  type StorageAuthManagerDependencies,
} from "./auth.manager";

export {
  StorageAuthLifecycleManager,
  type StorageAuthLifecycleManagerDependencies,
  type RequestEmailVerificationInput,
  type RequestPasswordResetInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type UpdateAuthProfileInput,
  type RequestEmailChangeInput,
  type DeleteAuthAccountInput,
  type DeactivateAuthAccountInput,
} from "./auth.lifecycle.manager";

export {
  StorageRateLimitProvider,
  type StorageRateLimitProviderOptions,
} from "./auth.rate-limit";

export {
  AUTH_USER_COLLECTION,
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_ACTION_TOKEN_COLLECTION,
  AUTH_AUDIT_COLLECTION,
  AUTH_RATE_LIMIT_COLLECTION,
  initializeAuthStorage,
} from "./auth.storage";

export type {
  AuthUserStorageRecord,
  InitializeAuthStorageOptions,
} from "./auth.storage";

export type { AuthUser } from "./types/user.types";
export type { AuthState } from "./types/state.types";
export type { PasswordCredentialStorageRecord } from "./types/credential.types";

export type {
  AuthManager,
  AuthManagerOptions,
  AuthManagerDependencies,
  AuthRateLimitRule,
  AuthRateLimitScopePolicy,
  AuthRateLimitPolicies,
  AuthSession,
  AuthResult,
  AuthRegisterInput,
  AuthSignInInput,
} from "./types/auth-manager.types";

export type {
  AuthActionTokenPurpose,
  AuthActionTokenStorageRecord,
  AuthAuditAction,
  AuthAuditEventStorageRecord,
  AuthRateLimitStorageRecord,
  AuthLifecycleRateLimitAction,
  AuthLifecycleRateLimitPolicy,
  AuthLifecycleRateLimitPolicies,
  AuthLifecycleManagerOptions,
} from "./types/auth-lifecycle.types";

export type {
  PasswordHash,
  PasswordHasher,
  EmailMessage,
  EmailProvider,
  RateLimitProvider,
} from "./providers/provider.types";

export {
  AuthError,
  AuthValidationError,
  AuthInvalidCredentialsError,
  AuthEmailVerificationRequiredError,
  AuthAccountConflictError,
  AuthRateLimitError,
  AuthConfigurationError,
  AuthProviderError,
  AuthSessionError,
  AuthTokenError,
} from "./errors/auth.errors";

export type { AuthErrorCode } from "./errors/auth.errors";

export { normalizeEmail, normalizeDisplayName } from "./utils/email.utils";

export {
  generateAuthId,
  generateSecureAuthToken,
  hashAuthToken,
  createRateLimitKey,
} from "./utils/auth-crypto.utils";

export {
  StorageAuthMfaManager,
  type StorageAuthMfaManagerDependencies,
} from "./auth.mfa.manager";

export type {
  ProtectedAuthSecret,
  AuthSecretProtector,
  WebAuthnOptionsJSON,
  WebAuthnRegistrationCredential,
  WebAuthnRegistrationVerification,
  WebAuthnAuthenticationVerification,
  WebAuthnProvider,
} from "./providers/mfa-provider.types";

export {
  AuthMfaChallengeError,
  AuthMfaFactorError,
} from "./errors/auth.errors";

export type {
  AuthMfaFactorType,
  AuthMfaFactorStatus,
  AuthMfaAvailableFactor,
  AuthMfaFactor,
  AuthMfaFactorStorageRecord,
  AuthMfaChallengePurpose,
  AuthMfaChallengeStorageRecord,
  AuthRecoveryCodeStorageRecord,
  AuthMfaPendingResult,
  AuthMfaGateway,
  AuthMfaTotpOptions,
  AuthMfaWebAuthnOptions,
  AuthMfaManagerOptions,
  BeginTotpEnrollmentInput,
  TotpEnrollmentStarted,
  VerifyTotpEnrollmentInput,
  MfaEnrollmentCompleted,
  BeginPasskeyRegistrationInput,
  PasskeyRegistrationStarted,
  FinishPasskeyRegistrationInput,
  BeginPasskeySignInInput,
  PasskeySignInStarted,
  CompleteMfaSignInInput,
  PasskeyMfaStarted,
  PasskeyMfaCompletedInput,
  RemoveMfaFactorInput,
  RegenerateRecoveryCodesInput,
} from "./types/mfa.types";

export {
  encodeBase32,
  decodeBase32,
  generateTotpSecret,
  generateTotpCode,
  verifyTotpCode,
  createTotpUri,
} from "./utils/totp.utils";
