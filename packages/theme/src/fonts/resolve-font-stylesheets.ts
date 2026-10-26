import { createGoogleFontUrl } from "./create-google-font-url";
import { resolveFontConfig } from "./resolve-font-config";
import type {
  FontStylesheet,
  ResolvedFontConfig,
  ThemeFonts,
  FontDisplay,
  FontStyle,
} from "./types";

export const resolveFontStylesheets = (
  fonts?: ThemeFonts,
): FontStylesheet[] => {
  if (fonts === undefined) return [];

  const resolved: ResolvedFontConfig[] = [];
  for (const role of ["heading", "body", "accent"] as const) {
    const font = fonts[role];
    if (font !== undefined) resolved.push(resolveFontConfig({ ...font, role }));
  }

  // Merge requests for the same family and display mode. This avoids loading
  // separate stylesheets when roles share a family but need different weights.
  const groups = new Map<
    string,
    {
      family: string;
      display: FontDisplay;
      weights: Set<number>;
      styles: Set<FontStyle>;
    }
  >();

  for (const font of resolved) {
    const key = `${font.family.toLocaleLowerCase("en-US")}\u0000${font.display}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        family: font.family,
        display: font.display,
        weights: new Set<number>(),
        styles: new Set<FontStyle>(),
      };
      groups.set(key, group);
    }
    font.weights.forEach((weight) => group!.weights.add(weight));
    font.styles.forEach((style) => group!.styles.add(style));
  }

  return [...groups.values()].map((group) => ({
    family: group.family,
    display: group.display,
    href: createGoogleFontUrl({
      family: group.family,
      weights: [...group.weights].sort((a, b) => a - b),
      styles: [...group.styles].sort(
        (a, b) => (a === "normal" ? 0 : 1) - (b === "normal" ? 0 : 1),
      ),
      display: group.display,
    }),
  }));
};
