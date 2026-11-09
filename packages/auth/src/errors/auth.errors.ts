export type AuthErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "CONFIGURATION"
  | "PROVIDER"
  | "SESSION"
  | "INVALID_TOKEN";

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

/**
 * Does not disclose whether the email address already exists.
 *
 * Public registration endpoints should map this to the same generic
 * response used for other account-creation outcomes.
 */
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
