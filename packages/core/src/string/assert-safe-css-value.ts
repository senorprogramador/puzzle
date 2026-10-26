export const assertSafeCssValue = (value: unknown, label: string) => {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new TypeError(`${label} must be a string or number.`);
  }

  const serialized = String(value).trim();
  if (
    serialized.length === 0 ||
    /[;{}<>\u0000-\u001f\u007f]/.test(serialized)
  ) {
    throw new TypeError(
      `${label} must be a non-empty CSS value and must not contain semicolons, braces, angle brackets, or control characters.`,
    );
  }
  return serialized;
};
