import { DEFAULT_FONT_FALLBACKS } from "./constants";
import { FontConfig } from "./types";

const validateFamilyName = (value: string) => {
  const family = value.trim();
  if (!family || /[\u0000-\u001f\u007f<>;]/.test(family)) {
    throw new TypeError(
      `fontFamily '${family}' must be non-empty and must not contain control characters, angle brackets, or semicolons.`,
    );
  }
  return family;
};

export const resolveFontConfig = (input: FontConfig) => {
  const family = validateFamilyName(input.family);
  const rawWeights = input.weights ?? [400, 700];
  const rawStyles = input.styles ?? ["normal"];
  const display = input.display ?? "swap";
  const fallback = input.fallback ?? [
    ...DEFAULT_FONT_FALLBACKS[input.role ?? "body"],
  ];

  if (
    rawWeights.length === 0 ||
    rawWeights.some(
      (weight) => !Number.isInteger(weight) || weight < 1 || weight > 1000,
    )
  ) {
    throw new RangeError(
      `font ${family}.weights must be a non-empty array of integers between 1 and 1000.`,
    );
  }

  if (rawStyles.length === 0) {
    throw new TypeError(
      `font ${family}.styles must contain "normal" and/or "italic".`,
    );
  }

  if (
    fallback.length === 0 ||
    fallback.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        /[\u0000-\u001f\u007f<>;]/.test(value),
    )
  ) {
    throw new TypeError(
      `font ${family}.fallback must be a non-empty array of font-family names.`,
    );
  }

  return {
    family,
    weights: [...new Set(rawWeights)].sort((a, b) => a - b),
    styles: [...new Set(rawStyles)].sort(
      (a, b) => (a === "normal" ? 0 : 1) - (b === "normal" ? 0 : 1),
    ),
    display,
    fallback: fallback.map((name) => name.trim()),
    role: input.role ?? "body",
  };
};
