export type NormalizedZodPathSegment = string | number;

export type NormalizedZodFieldType =
  | "string"
  | "email"
  | "url"
  | "number"
  | "boolean"
  | "enum"
  | "literal"
  | "date"
  | "object"
  | "array"
  | "unsupported";

export type NormalizedZodMetadataValue =
  | string
  | number
  | boolean
  | null
  | readonly NormalizedZodMetadataValue[]
  | NormalizedZodMetadataObject;

export interface NormalizedZodMetadataObject {
  readonly [key: string]: NormalizedZodMetadataValue;
}

export type NormalizedZodOptionValue =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

export interface NormalizedZodOption {
  readonly value: NormalizedZodOptionValue;
  readonly label: string;
}

/**
 * Constraint boundaries exposed through Zod's public schema properties.
 * Numeric boundaries do not describe whether the source check is exclusive.
 */
export interface NormalizedZodConstraints {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly integer?: boolean;
  readonly minDate?: string;
  readonly maxDate?: string;
}

export type NormalizedZodDiagnosticCode =
  | "pipe_input_display"
  | "recursive_schema"
  | "unsupported_schema";

export interface NormalizedZodDiagnostic {
  readonly code: NormalizedZodDiagnosticCode;
  readonly severity: "info" | "warning";
  readonly path: readonly NormalizedZodPathSegment[];
  readonly message: string;
  readonly sourceType?: string;
}

export interface NormalizedZodDescriptorBase {
  readonly path: readonly NormalizedZodPathSegment[];
  readonly name?: string;
  readonly label?: string;
  readonly description?: string;
  readonly optional: boolean;
  readonly nullable: boolean;
  readonly defaulted: boolean;
  readonly readOnly: boolean;
  readonly metadata: Readonly<Record<string, NormalizedZodMetadataValue>>;
  readonly constraints: NormalizedZodConstraints;
}

export interface NormalizedZodStringDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "string" | "email" | "url";
  readonly format?: string;
}

export interface NormalizedZodNumberDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "number";
}

export interface NormalizedZodBooleanDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "boolean";
}

export interface NormalizedZodEnumDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "enum";
  readonly options: readonly NormalizedZodOption[];
}

export interface NormalizedZodLiteralDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "literal";
  readonly options: readonly NormalizedZodOption[];
}

export interface NormalizedZodDateDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "date";
}

export interface NormalizedZodObjectDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "object";
  readonly properties: readonly NormalizedZodDescriptor[];
}

export interface NormalizedZodArrayDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "array";
  readonly element: NormalizedZodDescriptor;
}

export interface NormalizedZodUnsupportedDescriptor
  extends NormalizedZodDescriptorBase {
  readonly type: "unsupported";
  readonly sourceType: string;
  readonly reason: "recursive_schema" | "unsupported_schema";
}

export type NormalizedZodDescriptor =
  | NormalizedZodStringDescriptor
  | NormalizedZodNumberDescriptor
  | NormalizedZodBooleanDescriptor
  | NormalizedZodEnumDescriptor
  | NormalizedZodLiteralDescriptor
  | NormalizedZodDateDescriptor
  | NormalizedZodObjectDescriptor
  | NormalizedZodArrayDescriptor
  | NormalizedZodUnsupportedDescriptor;

export interface NormalizedZodObjectSchema
  extends NormalizedZodObjectDescriptor {
  readonly diagnostics: readonly NormalizedZodDiagnostic[];
}
