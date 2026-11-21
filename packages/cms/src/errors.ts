export type CmsErrorCode =
  | "VALIDATION"
  | "SCHEMA"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DUPLICATE"
  | "PERMISSION_DENIED"
  | "CAPABILITY"
  | "SCHEDULER"
  | "AUDIT";

export class CmsError extends Error {
  readonly code: CmsErrorCode;
  override readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: CmsErrorCode,
    message: string,
    options?: {
      readonly cause?: unknown;
      readonly details?: Readonly<Record<string, unknown>>;
    },
  ) {
    super(message);
    this.name = "CmsError";
    this.code = code;
    this.cause = options?.cause;
    this.details = options?.details;
  }
}

export type CmsValidationIssue = {
  readonly path: string;
  readonly message: string;
  readonly code: string;
};

export class CmsValidationError extends CmsError {
  readonly issues: readonly CmsValidationIssue[];

  constructor(issues: readonly CmsValidationIssue[]) {
    super("VALIDATION", "CMS input failed validation.", {
      details: { issues },
    });
    this.name = "CmsValidationError";
    this.issues = issues;
  }
}

export class CmsSchemaError extends CmsError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super("SCHEMA", message, { details });
    this.name = "CmsSchemaError";
  }
}

export class CmsNotFoundError extends CmsError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} was not found.`);
    this.name = "CmsNotFoundError";
  }
}

export class CmsConflictError extends CmsError {
  constructor(message = "The CMS record changed since it was read.") {
    super("CONFLICT", message);
    this.name = "CmsConflictError";
  }
}

export class CmsDuplicateError extends CmsError {
  constructor(resource: string, options?: { readonly cause?: unknown }) {
    super("DUPLICATE", `${resource} already exists.`, options);
    this.name = "CmsDuplicateError";
  }
}

export class CmsPermissionDeniedError extends CmsError {
  constructor() {
    super("PERMISSION_DENIED", "The actor is not permitted to perform this operation.");
    this.name = "CmsPermissionDeniedError";
  }
}

export class CmsCapabilityError extends CmsError {
  readonly capability: string;

  constructor(capability: string) {
    super(
      "CAPABILITY",
      `The configured storage adapter does not support the required capability: ${capability}.`,
      { details: { capability } },
    );
    this.name = "CmsCapabilityError";
    this.capability = capability;
  }
}

export class CmsSchedulerError extends CmsError {
  readonly publication: {
    readonly entryId: string;
    readonly scheduledRevisionNumber: number;
  };

  constructor(
    message: string,
    publication: {
      readonly entryId: string;
      readonly scheduledRevisionNumber: number;
    },
    options?: { readonly cause?: unknown },
  ) {
    super("SCHEDULER", message, {
      ...options,
      details: publication,
    });
    this.name = "CmsSchedulerError";
    this.publication = publication;
  }
}

export class CmsAuditError extends CmsError {
  constructor(options?: { readonly cause?: unknown }) {
    super("AUDIT", "The CMS operation could not write its required audit event.", options);
    this.name = "CmsAuditError";
  }
}
