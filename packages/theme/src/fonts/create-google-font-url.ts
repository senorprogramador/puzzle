import { resolveFontConfig } from "./resolve-font-config";
import type { CreateGoogleFontUrlOptions } from "./types";

const GOOGLE_FONTS_CSS2_URL = "https://fonts.googleapis.com/css2";

export const createGoogleFontUrl = (options: CreateGoogleFontUrlOptions) => {
  const font = resolveFontConfig(options);
  const hasItalic = font.styles.includes("italic");
  const tuples = font.styles.flatMap((style) =>
    font.weights.map((weight) => ({
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
    : [font.family, ":wght@", font.weights.join(";")].join("");

  const params = new URLSearchParams();
  params.set("family", familySpec);
  params.set("display", font.display);

  return `${GOOGLE_FONTS_CSS2_URL}?${params.toString()}`;
};
