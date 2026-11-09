import { AuthValidationError } from "../errors/auth.errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => {
  if (typeof email !== "string") {
    throw new AuthValidationError("A valid email address is required.");
  }

  const normalized = email.trim().toLowerCase();

  if (
    normalized.length === 0 ||
    normalized.length > 254 ||
    !EMAIL_PATTERN.test(normalized)
  ) {
    throw new AuthValidationError("A valid email address is required.");
  }

  return normalized;
};

export const normalizeDisplayName = (
  name: string | null | undefined,
): string | null => {
  if (name === undefined || name === null) {
    return null;
  }

  if (typeof name !== "string") {
    throw new AuthValidationError("Name must be a string.");
  }

  const normalized = name.trim();

  if (normalized.length > 100) {
    throw new AuthValidationError("Name must be 100 characters or fewer.");
  }

  return normalized || null;
};
