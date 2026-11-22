export type CloudflareMediaErrorCode =
  | "CONFIGURATION"
  | "PROVIDER"
  | "VALIDATION";

export class CloudflareMediaError extends Error {
  readonly code: CloudflareMediaErrorCode;
  override readonly cause?: unknown;

  constructor(
    code: CloudflareMediaErrorCode,
    message: string,
    options?: { readonly cause?: unknown },
  ) {
    super(message);
    this.name = "CloudflareMediaError";
    this.code = code;
    this.cause = options?.cause;
  }
}

export class CloudflareMediaConfigurationError extends CloudflareMediaError {
  constructor(message: string) {
    super("CONFIGURATION", message);
    this.name = "CloudflareMediaConfigurationError";
  }
}

export class CloudflareMediaProviderError extends CloudflareMediaError {
  constructor(message: string, cause?: unknown) {
    super("PROVIDER", message, { cause });
    this.name = "CloudflareMediaProviderError";
  }
}

export class CloudflareMediaValidationError extends CloudflareMediaError {
  constructor(message: string) {
    super("VALIDATION", message);
    this.name = "CloudflareMediaValidationError";
  }
}
