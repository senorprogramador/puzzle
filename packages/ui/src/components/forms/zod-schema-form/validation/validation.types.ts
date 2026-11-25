import type * as z from "zod";

export type ValidationPathSegment = string | number;
export type ValidationPath = readonly ValidationPathSegment[];

export interface ValidationIssue {
  readonly path: ValidationPath;
  readonly message: string;
  readonly code?: string;
}

export type ValidationResult<S extends z.ZodType> =
  | {
      readonly success: true;
      readonly data: z.output<S>;
    }
  | {
      readonly success: false;
      readonly issues: readonly ValidationIssue[];
      readonly messages: Readonly<Record<string, readonly string[]>>;
    };
