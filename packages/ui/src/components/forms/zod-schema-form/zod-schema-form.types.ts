import type { FormEventHandler, Key, ReactNode } from "react";
import type * as z from "zod/v4";

import type {
  NormalizedZodConstraints,
  NormalizedZodDescriptor,
  NormalizedZodDiagnostic,
  NormalizedZodFieldType,
  NormalizedZodPathSegment,
} from "./schema";
import type { ValidationResult } from "./validation";

type DeepPartial<T> = T extends Date
  ? T
  : T extends readonly (infer Item)[]
    ? readonly DeepPartial<Item>[]
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T;

type ZodSchemaFormValidationMode = "change" | "blur" | "submit" | "touched";

type ZodSchemaFormValidationStatus =
  | "unvalidated"
  | "validating"
  | "valid"
  | "invalid";

type ZodSchemaFormValidationState<Schema extends z.ZodType> = {
  status: ZodSchemaFormValidationStatus;
  result: ValidationResult<Schema> | null;
  errors: Readonly<Record<string, readonly string[]>>;
  isValid: boolean;
  isValidating: boolean;
};

type ZodSchemaFieldContext = {
  schema: NormalizedZodDescriptor;
  value: unknown;
  path: readonly NormalizedZodPathSegment[];
  key: string;
  type: NormalizedZodFieldType | (string & {});
  required: boolean;
  optional: boolean;
  nullable: boolean;
  disabled: boolean;
  readOnly: boolean;
  error: string | undefined;
  errors: readonly string[];
  description: ReactNode;
  label: ReactNode;
  constraints: NormalizedZodConstraints;
  onChange: (value: unknown) => void;
};

type ZodSchemaFieldRenderer = (context: ZodSchemaFieldContext) => ReactNode;

type ZodSchemaFieldConfig = {
  render?: ZodSchemaFieldRenderer;
  hidden?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  array?: ZodSchemaArrayConfig;
};

type ZodSchemaArrayConfig = {
  createItem?: () => unknown;
  getItemKey?: (item: unknown, index: number) => Key;
  itemLabel?: (item: unknown, index: number) => ReactNode;
  minItems?: number;
  maxItems?: number;
  reorderable?: boolean;
  addLabel?: string;
  emptyMessage?: ReactNode;
};

type ZodSchemaFormGroup<Key extends string = string> = {
  id: string;
  label?: ReactNode;
  description?: ReactNode;
  keys: readonly Key[];
  columns?: number;
};

type ZodSchemaObjectConfig = {
  label?: ReactNode;
  description?: ReactNode;
  groups?: readonly ZodSchemaFormGroup[];
  columns?: number;
  border?: boolean;
  padding?: boolean;
  showHeader?: boolean;
  collapsible?: boolean;
};

type ZodSchemaFormDiagnostic =
  | NormalizedZodDiagnostic
  | {
      code:
        | "unknown_group_key"
        | "duplicate_group_key"
        | "unassigned_field"
        | "unsupported_field";
      path: readonly NormalizedZodPathSegment[];
      message: string;
    };

type ZodSchemaFormState<Schema extends z.ZodType> =
  ZodSchemaFormValidationState<Schema> & {
    fields: ReactNode;
    touchedFields: readonly string[];
    unresolvedFields: readonly ZodSchemaFormDiagnostic[];
    diagnostics: readonly ZodSchemaFormDiagnostic[];
    validate: () => Promise<ValidationResult<Schema>>;
    resetValidation: () => void;
  };

type ZodSchemaFormProps<Schema extends z.ZodObject> = {
  schema: Schema;
  value: DeepPartial<z.input<Schema>>;
  onChange: (value: DeepPartial<z.input<Schema>>) => void;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  onValidationChange?: (state: ZodSchemaFormValidationState<Schema>) => void;
  validationMode?:
    | ZodSchemaFormValidationMode
    | readonly ZodSchemaFormValidationMode[];
  validationDebounceMs?: number;
  disabled?: boolean;
  readOnly?: boolean;
  groups?: readonly ZodSchemaFormGroup<
    Extract<keyof z.input<Schema>, string>
  >[];
  fields?: Readonly<Record<string, ZodSchemaFieldConfig>>;
  fieldTypes?: Readonly<Record<string, ZodSchemaFieldRenderer>>;
  objects?: Readonly<Record<string, ZodSchemaObjectConfig>>;
  unassignedFields?: "after-groups" | "hide" | "error";
  render?: (state: ZodSchemaFormState<Schema>) => ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export type {
  DeepPartial,
  ZodSchemaFieldContext,
  ZodSchemaFieldConfig,
  ZodSchemaFieldRenderer,
  ZodSchemaArrayConfig,
  ZodSchemaFormDiagnostic,
  ZodSchemaFormGroup,
  ZodSchemaFormProps,
  ZodSchemaFormState,
  ZodSchemaFormValidationMode,
  ZodSchemaFormValidationState,
  ZodSchemaFormValidationStatus,
  ZodSchemaObjectConfig,
};
