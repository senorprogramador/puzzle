import type { TokenInputMode } from "./token-input.types";

const sanitizeToken = (
  value: string,
  length: number,
  mode: TokenInputMode = "numeric",
): string => {
  const normalized =
    mode === "numeric"
      ? value.replace(/[^0-9]/g, "")
      : value.replace(/[^a-zA-Z0-9]/g, "");

  return normalized.slice(0, Math.max(0, length));
};

const getNextActiveIndex = (value: string, length: number): number =>
  Math.min(value.length, length - 1);

const getPreviousActiveIndex = (index: number): number =>
  Math.max(0, index - 1);

const isTokenComplete = (value: string, length: number): boolean =>
  value.length === length;

const removeTokenCharacter = (value: string, index: number): string =>
  value.slice(0, index) + value.slice(index + 1);

const replaceTokenCharacter = (
  value: string,
  index: number,
  character: string,
  length: number,
  mode: TokenInputMode,
): string => {
  const normalized = sanitizeToken(character, length, mode);

  if (!normalized) {
    return removeTokenCharacter(value, index);
  }

  return sanitizeToken(
    value.slice(0, index) + normalized[0] + value.slice(index + 1),
    length,
    mode,
  );
};

const insertTokenCharacters = (
  value: string,
  index: number,
  insertedValue: string,
  length: number,
  mode: TokenInputMode,
): string => {
  const normalized = sanitizeToken(insertedValue, length, mode);

  if (!normalized) {
    return value;
  }

  // A complete token always replaces the existing token.
  if (normalized.length >= length) {
    return normalized.slice(0, length);
  }

  // A single character replaces the current position.
  if (normalized.length === 1) {
    return replaceTokenCharacter(value, index, normalized, length, mode);
  }

  // Multiple characters are inserted at the current position.
  const start = Math.max(0, Math.min(index, length));

  return sanitizeToken(
    value.slice(0, start) + normalized + value.slice(start + normalized.length),
    length,
    mode,
  );
};

export {
  sanitizeToken,
  getNextActiveIndex,
  getPreviousActiveIndex,
  isTokenComplete,
  removeTokenCharacter,
  replaceTokenCharacter,
  insertTokenCharacters,
};
