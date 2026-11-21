export type MediaErrorCode =
  | "INVALID_FILE"
  | "QUOTA_EXCEEDED"
  | "UNSUPPORTED_MEDIA"
  | "UPLOAD_EXPIRED"
  | "CHECKSUM_MISMATCH"
  | "PROCESSING_FAILED"
  | "PERMISSION_DENIED"
  | "ASSET_CONFLICT"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CAPABILITY"
  | "OBJECT_STORAGE"
  | "UNKNOWN";

export type MediaErrorOptions = {
  readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;
};

export class MediaError extends Error {
  readonly code: MediaErrorCode;
  override readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: MediaErrorCode,
    message: string,
    options?: MediaErrorOptions,
  ) {
    super(message);
    this.name = "MediaError";
    this.code = code;
    this.cause = options?.cause;
    this.details = options?.details;
  }
}

export class InvalidMediaFileError extends MediaError {
  constructor(message: string, options?: MediaErrorOptions) {
    super("INVALID_FILE", message, options);
    this.name = "InvalidMediaFileError";
  }
}

export class MediaQuotaExceededError extends MediaError {
  constructor(message = "The media quota has been exceeded.") {
    super("QUOTA_EXCEEDED", message);
    this.name = "MediaQuotaExceededError";
  }
}

export class UnsupportedMediaError extends MediaError {
  constructor(message: string, options?: MediaErrorOptions) {
    super("UNSUPPORTED_MEDIA", message, options);
    this.name = "UnsupportedMediaError";
  }
}

export class MediaUploadExpiredError extends MediaError {
  constructor(message = "The media upload session has expired.") {
    super("UPLOAD_EXPIRED", message);
    this.name = "MediaUploadExpiredError";
  }
}

export class MediaChecksumMismatchError extends MediaError {
  constructor(message = "The uploaded object's checksum does not match.") {
    super("CHECKSUM_MISMATCH", message);
    this.name = "MediaChecksumMismatchError";
  }
}

export class MediaProcessingError extends MediaError {
  readonly retryable: boolean;

  constructor(
    message: string,
    options?: MediaErrorOptions & { readonly retryable?: boolean },
  ) {
    super("PROCESSING_FAILED", message, options);
    this.name = "MediaProcessingError";
    this.retryable = options?.retryable ?? true;
  }
}

export class MediaPermissionDeniedError extends MediaError {
  constructor(message = "The actor is not permitted to perform this operation.") {
    super("PERMISSION_DENIED", message);
    this.name = "MediaPermissionDeniedError";
  }
}

export class MediaAssetConflictError extends MediaError {
  constructor(message: string, options?: MediaErrorOptions) {
    super("ASSET_CONFLICT", message, options);
    this.name = "MediaAssetConflictError";
  }
}

export class MediaNotFoundError extends MediaError {
  constructor(resource = "Media resource") {
    super("NOT_FOUND", `${resource} was not found.`);
    this.name = "MediaNotFoundError";
  }
}

export class MediaValidationError extends MediaError {
  constructor(
    message: string,
    details?: Readonly<Record<string, unknown>>,
  ) {
    super("VALIDATION", message, { details });
    this.name = "MediaValidationError";
  }
}

export class MediaCapabilityError extends MediaError {
  readonly capability: string;

  constructor(capability: string) {
    super(
      "CAPABILITY",
      `The configured adapter does not support the required capability: ${capability}.`,
      { details: { capability } },
    );
    this.name = "MediaCapabilityError";
    this.capability = capability;
  }
}

export class MediaObjectStorageError extends MediaError {
  constructor(message: string, options?: MediaErrorOptions) {
    super("OBJECT_STORAGE", message, options);
    this.name = "MediaObjectStorageError";
  }
}
