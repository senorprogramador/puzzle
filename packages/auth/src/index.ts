export { StorageAuthManager } from "./auth.manager";
export type { StorageAuthManagerDependencies } from "./auth.manager";

export {
  AUTH_USER_COLLECTION,
  AUTH_CREDENTIAL_COLLECTION,
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
  AuthAccountConflictError,
  AuthRateLimitError,
  AuthConfigurationError,
  AuthProviderError,
  AuthSessionError,
} from "./errors/auth.errors";

export type { AuthErrorCode } from "./errors/auth.errors";

export { normalizeEmail, normalizeDisplayName } from "./utils/email.utils";

export { generateAuthId, createRateLimitKey } from "./utils/auth-crypto.utils";
