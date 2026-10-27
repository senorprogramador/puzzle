import type { GoogleFontFamily } from "./google-font-familiy";

export type FontRole = "heading" | "body" | "accent";
export type FontStyle = "normal" | "italic";

export type FontDisplay = "auto" | "block" | "swap" | "fallback" | "optional";

export type FontConfig = {
  family: GoogleFontFamily;
  role?: FontRole;
  weights?: readonly number[];
  styles?: readonly FontStyle[];
  display?: FontDisplay;
  fallback?: readonly string[];
  nonce?: string;
};

export type ResolvedFontConfig = Required<Omit<FontConfig, "nonce">> & {
  nonce?: string;
};

export type CreateGoogleFontUrlOptions = {
  family: GoogleFontFamily;
  weights?: readonly number[];
  styles?: readonly FontStyle[];
  display?: FontDisplay;
};

export type ThemeFonts = Partial<Record<FontRole, FontConfig>>;

export type FontStylesheet = {
  href: string;
  family: string;
  display: FontDisplay;
};
