import type * as z from "zod";

import { formatValidationPath } from "./validation-path";
import type {
  ValidationIssue,
  ValidationPathSegment,
  ValidationResult,
} from "./validation.types";

export const createZodSchemaValidator = <S extends z.ZodType>(
  schema: S,
): ((input: z.input<S>) => Promise<ValidationResult<S>>) => {
  return async (input) => {
    const result = await schema.safeParseAsync(input);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    const issues: ValidationIssue[] = result.error.issues.map((issue) => ({
      path: issue.path.map((segment): ValidationPathSegment =>
        typeof segment === "symbol" ? String(segment) : segment,
      ),
      message: issue.message,
      code: issue.code,
    }));
    const messages: Record<string, string[]> = {};

    for (const issue of issues) {
      const pathKey = formatValidationPath(issue.path);
      (messages[pathKey] ??= []).push(issue.message);
    }

    return {
      success: false,
      issues,
      messages,
    };
  };
};
