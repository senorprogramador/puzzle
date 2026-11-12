import { resolveFontConfig } from "./resolve-font-config";
import type { CreateGoogleFontUrlOptions } from "./types";

const GOOGLE_FONTS_CSS2_URL = "https://fonts.googleapis.com/css2";

export const createGoogleFontUrl = (options: CreateGoogleFontUrlOptions) => {
  const font = resolveFontConfig(options);
  const hasItalic = font.styles.includes("italic");
  const weights = font.weightRange
    ? [font.weightRange.join("..")]
    : font.weights.map(String);
  const tuples = font.styles.flatMap((style) =>
    weights.map((weight) => ({
      italic: style === "italic" ? 1 : 0,
      weight,
    })),
  );

  const familySpec = hasItalic
    ? [
        font.family,
        ":ital,wght@",
        tuples.map(({ italic, weight }) => `${italic},${weight}`).join(";"),
      ].join("")
    : [font.family, ":wght@", weights.join(";")].join("");

  const params = new URLSearchParams();
  params.set("family", familySpec);
  params.set("display", font.display);

  return `${GOOGLE_FONTS_CSS2_URL}?${params.toString()}`;
};
