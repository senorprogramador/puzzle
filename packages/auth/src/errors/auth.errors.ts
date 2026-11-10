export type AuthErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "CONFIGURATION"
  | "PROVIDER"
  | "SESSION"
  | "INVALID_TOKEN"
  | "MFA_CHALLENGE"
  | "MFA_FACTOR";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  override readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: AuthErrorCode,
    message: string,
    options?: {
      readonly cause?: unknown;
      readonly details?: Readonly<Record<string, unknown>>;
    },
  ) {
    super(message);

    this.name = "AuthError";
    this.code = code;
    this.cause = options?.cause;
    this.details = options?.details;
  }
}

export class AuthValidationError extends AuthError {
  constructor(message: string) {
    super("INVALID_INPUT", message);
    this.name = "AuthValidationError";
  }
}

export class AuthInvalidCredentialsError extends AuthError {
  constructor() {
    super("INVALID_CREDENTIALS", "Invalid email or password.");
    this.name = "AuthInvalidCredentialsError";
  }
}

export class AuthEmailVerificationRequiredError extends AuthError {
  constructor() {
    super("EMAIL_NOT_VERIFIED", "Verify your email address before signing in.");
    this.name = "AuthEmailVerificationRequiredError";
  }
}

export class AuthAccountConflictError extends AuthError {
  constructor(options?: { readonly cause?: unknown }) {
    super(
      "CONFLICT",
      "Unable to create an account with the supplied details.",
      options,
    );

    this.name = "AuthAccountConflictError";
  }
}

export class AuthRateLimitError extends AuthError {
  readonly resetAt: Date;

  constructor(resetAt: Date) {
    super(
      "RATE_LIMITED",
      "Too many authentication attempts. Try again later.",
      {
        details: { resetAt },
      },
    );

    this.name = "AuthRateLimitError";
    this.resetAt = resetAt;
  }
}

export class AuthConfigurationError extends AuthError {
  constructor(message: string, options?: { readonly cause?: unknown }) {
    super("CONFIGURATION", message, options);
    this.name = "AuthConfigurationError";
  }
}

export class AuthProviderError extends AuthError {
  constructor(message: string, options?: { readonly cause?: unknown }) {
    super("PROVIDER", message, options);
    this.name = "AuthProviderError";
  }
}

export class AuthSessionError extends AuthError {
  constructor(message: string, options?: { readonly cause?: unknown }) {
    super("SESSION", message, options);
    this.name = "AuthSessionError";
  }
}

export class AuthTokenError extends AuthError {
  constructor() {
    super("INVALID_TOKEN", "This link is invalid or has expired.");
    this.name = "AuthTokenError";
  }
}

/**
 * Deliberately generic.
 *
 * Do not expose whether a challenge exists, which factor failed,
 * or whether a recovery code belonged to another account.
 */
export class AuthMfaChallengeError extends AuthError {
  constructor(options?: { readonly cause?: unknown }) {
    super(
      "MFA_CHALLENGE",
      "The authentication challenge is invalid or has expired.",
      options,
    );

    this.name = "AuthMfaChallengeError";
  }
}

export class AuthMfaFactorError extends AuthError {
  constructor(
    message = "The authentication factor could not be used.",
    options?: {
      readonly cause?: unknown;
    },
  ) {
    super("MFA_FACTOR", message, options);
    this.name = "AuthMfaFactorError";
  }
}
