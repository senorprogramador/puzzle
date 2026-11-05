import type { FontConfig } from "./types";
/** Standalone font loader; Theme is recommended when you want the full token system. */
declare const GoogleFont: ({ family, weights, styles, display, fallback, role, nonce, }: FontConfig) => import("react").JSX.Element;
export { GoogleFont };
