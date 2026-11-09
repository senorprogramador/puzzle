export type StorageErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "DUPLICATE"
  | "VALIDATION"
  | "CAPABILITY"
  | "ATOMICITY"
  | "MIGRATION"
  | "QUERY"
  | "UNKNOWN";

export class StorageError extends Error {
  readonly code: StorageErrorCode;
  override readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: StorageErrorCode,
    message: string,
    options?: {
      readonly cause?: unknown;
      readonly details?: Readonly<Record<string, unknown>>;
    },
  ) {
    super(message);
    this.name = "StorageError";
    this.code = code;
    this.cause = options?.cause;
    this.details = options?.details;
  }
}

export class StorageCapabilityError extends StorageError {
  readonly capability: string;

  constructor(
    capability: string,
    message = `Storage adapter does not support required capability: ${capability}`,
  ) {
    super("CAPABILITY", message, {
      details: { capability },
    });

    this.name = "StorageCapabilityError";
    this.capability = capability;
  }
}

export class StorageConflictError extends StorageError {
  constructor(
    message = "The storage operation conflicted with the current record state.",
  ) {
    super("CONFLICT", message);
    this.name = "StorageConflictError";
  }
}

export class StorageDuplicateError extends StorageError {
  readonly constraint: string;

  constructor(constraint: string) {
    super(
      "DUPLICATE",
      `A record violates the unique constraint "${constraint}".`,
      {
        details: { constraint },
      },
    );

    this.name = "StorageDuplicateError";
    this.constraint = constraint;
  }
}

export class StorageValidationError extends StorageError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super("VALIDATION", message, { details });
    this.name = "StorageValidationError";
  }
}

export class StorageAtomicityError extends StorageError {
  constructor(
    message = "The adapter cannot guarantee atomic execution and rollback.",
  ) {
    super("ATOMICITY", message);
    this.name = "StorageAtomicityError";
  }
}
