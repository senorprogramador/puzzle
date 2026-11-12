import type { GoogleFontFamily } from "./google-font-familiy";

export type FontRole = "heading" | "body" | "accent";

export type FontStyle = "normal" | "italic";

export type FontDisplay = "auto" | "block" | "swap" | "fallback" | "optional";

/**
 * Determines where configured fonts are loaded from.
 *
 * - google: Load stylesheets directly from Google Fonts.
 * - local: Load the generated stylesheet from the application's public directory.
 */
export type FontSource = "google" | "local";

export type FontConfig = {
  family: GoogleFontFamily;
  role?: FontRole;
  weights?: readonly number[];
  weightRange?: readonly [number, number];
  styles?: readonly FontStyle[];
  display?: FontDisplay;
  fallback?: readonly string[];
  nonce?: string;
};

export type ResolvedFontConfig = Required<Omit<FontConfig, "nonce" | "weightRange">> & {
  nonce?: string;
  weightRange?: readonly [number, number];
};

export type CreateGoogleFontUrlOptions = {
  family: GoogleFontFamily;
  weights?: readonly number[];
  weightRange?: readonly [number, number];
  styles?: readonly FontStyle[];
  display?: FontDisplay;
};

export type ThemeFonts = Partial<Record<FontRole, FontConfig>>;

export type FontStylesheet = {
  href: string;
  family: string;
  display: FontDisplay;
};
