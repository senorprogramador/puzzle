import type { ValidationPath } from "./validation.types";

/**
 * Formats paths as RFC 6901-style URI-fragment JSON Pointers.
 * The root is "#"; "~" and "/" are escaped as "~0" and "~1", and other
 * characters are URI-encoded so property names remain unambiguous.
 */
export const formatValidationPath = (path: ValidationPath): string => {
  if (path.length === 0) {
    return "#";
  }

  const tokens = path.map((segment) => {
    const escaped = String(segment).replaceAll("~", "~0").replaceAll("/", "~1");
    return encodeURIComponent(escaped);
  });

  return `#/${tokens.join("/")}`;
};
