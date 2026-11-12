import { __toESM } from "../_runtime.mjs";
import { ThemeComponentsProvider, ThemeScopeProvider } from "./scope-context-gETs7uAh.mjs";
import { stringWithCasing } from "./casing-BRvB1fDS.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/theme-vjuhMOMB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var assertSafeCssValue = (value, label) => {
	if (typeof value !== "string" && typeof value !== "number") throw new TypeError(`${label} must be a string or number.`);
	const serialized = String(value).trim();
	if (serialized.length === 0 || /[;{}<>\u0000-\u001f\u007f]/.test(serialized)) throw new TypeError(`${label} must be a non-empty CSS value and must not contain semicolons, braces, angle brackets, or control characters.`);
	return serialized;
};
var DEFAULT_FONT_FALLBACKS = {
	heading: ["system-ui", "sans-serif"],
	body: ["system-ui", "sans-serif"],
	accent: ["system-ui", "sans-serif"]
};
var validateFamilyName = (value) => {
	const family = value.trim();
	if (!family || /[\u0000-\u001f\u007f<>;]/.test(family)) throw new TypeError(`fontFamily '${family}' must be non-empty and must not contain control characters, angle brackets, or semicolons.`);
	return family;
};
var resolveFontConfig = (input) => {
	const family = validateFamilyName(input.family);
	const rawWeights = input.weights ?? [400, 700];
	const rawStyles = input.styles ?? ["normal"];
	const display = input.display ?? "swap";
	const fallback = input.fallback ?? [...DEFAULT_FONT_FALLBACKS[input.role ?? "body"]];
	if (rawWeights.length === 0 || rawWeights.some((weight) => !Number.isInteger(weight) || weight < 1 || weight > 1e3)) throw new RangeError(`font ${family}.weights must be a non-empty array of integers between 1 and 1000.`);
	if (rawStyles.length === 0) throw new TypeError(`font ${family}.styles must contain "normal" and/or "italic".`);
	if (fallback.length === 0 || fallback.some((value) => typeof value !== "string" || !value.trim() || /[\u0000-\u001f\u007f<>;]/.test(value))) throw new TypeError(`font ${family}.fallback must be a non-empty array of font-family names.`);
	return {
		family,
		weights: [...new Set(rawWeights)].sort((a, b) => a - b),
		styles: [...new Set(rawStyles)].sort((a, b) => (a === "normal" ? 0 : 1) - (b === "normal" ? 0 : 1)),
		display,
		fallback: fallback.map((name) => name.trim()),
		role: input.role ?? "body"
	};
};
var GOOGLE_FONTS_CSS2_URL = "https://fonts.googleapis.com/css2";
var createGoogleFontUrl = (options) => {
	const font = resolveFontConfig(options);
	const hasItalic = font.styles.includes("italic");
	const tuples = font.styles.flatMap((style) => font.weights.map((weight) => ({
		italic: style === "italic" ? 1 : 0,
		weight
	})));
	const familySpec = hasItalic ? [
		font.family,
		":ital,wght@",
		tuples.map(({ italic, weight }) => `${italic},${weight}`).join(";")
	].join("") : [
		font.family,
		":wght@",
		font.weights.join(";")
	].join("");
	const params = new URLSearchParams();
	params.set("family", familySpec);
	params.set("display", font.display);
	return `${GOOGLE_FONTS_CSS2_URL}?${params.toString()}`;
};
var GENERIC_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-serif",
	"ui-sans-serif",
	"ui-monospace",
	"ui-rounded",
	"math",
	"fangsong",
	"emoji"
]);
var DEFAULT_TOKENS = {
	colorSchemes: {
		light: {
			background: "#FCFCFC",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F0F0F0",
			text: "#171A35",
			textMuted: "#5F6485",
			textSubtle: "#8B91B3",
			border: "#E0E5F5",
			borderStrong: "#C4CBE6",
			primary: "#0277B5",
			primaryForeground: "#FFFFFF",
			secondary: "#475569",
			secondaryForeground: "#FFFFFF",
			accent: "#6D28D9",
			accentForeground: "#FFFFFF",
			ring: "#A5B4FC",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#1D4ED8",
			infoForeground: "#FFFFFF"
		},
		dark: {
			background: "#111518",
			surface: "#1c2226",
			surfaceElevated: "#242c31",
			surfaceSunken: "#0d1113",
			text: "#f5f5f5",
			textMuted: "#a4adb3",
			textSubtle: "#8c969d",
			border: "#343c42",
			borderStrong: "#4a555d",
			primary: "#38BDF8",
			primaryForeground: "#082F49",
			secondary: "#94A3B8",
			secondaryForeground: "#0F172A",
			accent: "#C4B5FD",
			accentForeground: "#1E1B4B",
			ring: "#93c5fd",
			success: "#4ade80",
			successForeground: "#052e16",
			warning: "#fbbf24",
			warningForeground: "#422006",
			danger: "#f87171",
			dangerForeground: "#450a0a",
			info: "#818CF8",
			infoForeground: "#1E1B4B"
		}
	},
	typography: {
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "3.75rem"
		},
		fontWeight: {
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800"
		},
		lineHeight: {
			none: "1",
			tight: "1.15",
			snug: "1.3",
			normal: "1.5",
			relaxed: "1.625",
			loose: "2"
		},
		letterSpacing: {
			tighter: "-0.05em",
			tight: "-0.025em",
			normal: "0em",
			wide: "0.025em",
			wider: "0.05em",
			widest: "0.1em"
		},
		fontGap: {
			headingStackGap: "0.3em",
			headingParagraphGap: "0.65em",
			paragraphGap: "1em",
			sectionGap: "1.5em"
		}
	},
	spacing: {
		0: "0",
		px: "1px",
		"0.5": "0.125rem",
		1: "0.25rem",
		"1.5": "0.375rem",
		2: "0.5rem",
		3: "0.75rem",
		4: "1rem",
		5: "1.25rem",
		6: "1.5rem",
		8: "2rem",
		10: "2.5rem",
		12: "3rem",
		16: "4rem",
		20: "5rem",
		24: "6rem"
	},
	radius: {
		none: "0",
		sm: "0.125rem",
		md: "0.375rem",
		lg: "0.5rem",
		xl: "0.75rem",
		"2xl": "1rem",
		"3xl": "1.5rem",
		full: "9999px"
	},
	shadows: {
		none: "none",
		xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
		sm: "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)",
		md: "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
		lg: "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
		xl: "0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)"
	},
	borders: {
		width: "1px",
		widthStrong: "2px",
		style: "solid"
	},
	breakpoints: {
		tablet: "768px",
		desktop: "1024px",
		hd: "1440px"
	},
	layout: {
		container: "80rem",
		content: "64rem",
		prose: "65ch"
	},
	overlays: {
		backdrop: "rgb(0 0 0 / 0.35)",
		backdropBlur: "2px"
	},
	elevation: {
		1: "0 1px 2px rgb(0 0 0 / 0.05)",
		2: "0 1px 3px rgb(0 0 0 / 0.10), 0 1px 2px rgb(0 0 0 / 0.06)",
		3: "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
		4: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)",
		6: "0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
		8: "0 25px 50px -12px rgb(0 0 0 / 0.20)",
		12: "0 35px 60px -15px rgb(0 0 0 / 0.22)",
		16: "0 45px 80px -20px rgb(0 0 0 / 0.25)",
		24: "0 60px 100px -25px rgb(0 0 0 / 0.30)"
	},
	motion: {
		fast: "120ms",
		normal: "200ms",
		slow: "320ms",
		easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
		easingIn: "cubic-bezier(0.4, 0, 1, 1)",
		easingOut: "cubic-bezier(0, 0, 0.2, 1)"
	},
	zIndex: {
		base: "0",
		dropdown: "100",
		sticky: "200",
		navigation: "250",
		overlay: "300",
		modal: "400",
		popover: "500",
		toast: "600",
		tooltip: "700"
	}
};
var COLOR_THEMES = {
	"cobalt-sky": {
		light: {
			background: "#F8FAFC",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F1F5F9",
			text: "#0F172A",
			textMuted: "#64748B",
			textSubtle: "#94A3B8",
			border: "#E2E8F0",
			borderStrong: "#CBD5E1",
			primary: "#2563EB",
			primaryForeground: "#FFFFFF",
			secondary: "#1E3A8A",
			secondaryForeground: "#FFFFFF",
			accent: "#0EA5E9",
			accentForeground: "#FFFFFF",
			ring: "#93C5FD",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#B45309",
			warningForeground: "#FFFFFF",
			danger: "#DC2626",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#60A5FA",
			primaryForeground: "#0F172A",
			secondary: "#93C5FD",
			secondaryForeground: "#0F172A",
			accent: "#38BDF8",
			accentForeground: "#082F49"
		}
	},
	"violet-dream": {
		light: {
			background: "#FAF9FF",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F3EEFF",
			text: "#1E1B4B",
			textMuted: "#6D688A",
			textSubtle: "#9691B5",
			border: "#E7E2F5",
			borderStrong: "#C9C0E8",
			primary: "#6D28D9",
			primaryForeground: "#FFFFFF",
			secondary: "#5B21B6",
			secondaryForeground: "#FFFFFF",
			accent: "#A855F7",
			accentForeground: "#FFFFFF",
			ring: "#C4B5FD",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#BE123C",
			dangerForeground: "#FFFFFF",
			info: "#2563EB",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#A78BFA",
			primaryForeground: "#1E1B4B",
			secondary: "#C4B5FD",
			secondaryForeground: "#1E1B4B",
			accent: "#D8B4FE",
			accentForeground: "#2E1065"
		}
	},
	"emerald-forest": {
		light: {
			background: "#F7FCF9",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#EAF7F0",
			text: "#102A22",
			textMuted: "#527568",
			textSubtle: "#829F93",
			border: "#D7EDE2",
			borderStrong: "#A8D8C1",
			primary: "#047857",
			primaryForeground: "#FFFFFF",
			secondary: "#065F46",
			secondaryForeground: "#FFFFFF",
			accent: "#10B981",
			accentForeground: "#FFFFFF",
			ring: "#6EE7B7",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#34D399",
			primaryForeground: "#052E22",
			secondary: "#6EE7B7",
			secondaryForeground: "#064E3B",
			accent: "#6EE7B7",
			accentForeground: "#064E3B"
		}
	},
	"coral-navy": {
		light: {
			background: "#FAFAFC",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F3F1F5",
			text: "#1C2333",
			textMuted: "#667085",
			textSubtle: "#9299A8",
			border: "#E5E7EB",
			borderStrong: "#C7CDD6",
			primary: "#F97316",
			primaryForeground: "#FFFFFF",
			secondary: "#334155",
			secondaryForeground: "#FFFFFF",
			accent: "#E11D48",
			accentForeground: "#FFFFFF",
			ring: "#FDBA74",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#FB923C",
			primaryForeground: "#431407",
			secondary: "#94A3B8",
			secondaryForeground: "#0F172A",
			accent: "#FB7185",
			accentForeground: "#4C0519"
		}
	},
	"ocean-blue": {
		light: {
			background: "#F6FAFF",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#EAF3FC",
			text: "#102A43",
			textMuted: "#526D82",
			textSubtle: "#8299AC",
			border: "#D8E7F4",
			borderStrong: "#B7D1E7",
			primary: "#0284C7",
			primaryForeground: "#FFFFFF",
			secondary: "#075985",
			secondaryForeground: "#FFFFFF",
			accent: "#06B6D4",
			accentForeground: "#FFFFFF",
			ring: "#7DD3FC",
			success: "#0F9D75",
			successForeground: "#FFFFFF",
			warning: "#B45309",
			warningForeground: "#FFFFFF",
			danger: "#DC2626",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#38BDF8",
			primaryForeground: "#082F49",
			secondary: "#7DD3FC",
			secondaryForeground: "#082F49",
			accent: "#22D3EE",
			accentForeground: "#083344"
		}
	},
	"mint-graphite": {
		light: {
			background: "#F8FBFA",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#EEF5F3",
			text: "#172321",
			textMuted: "#5D716D",
			textSubtle: "#8A9D99",
			border: "#DCE8E5",
			borderStrong: "#B9D0CA",
			primary: "#0D9488",
			primaryForeground: "#FFFFFF",
			secondary: "#334155",
			secondaryForeground: "#FFFFFF",
			accent: "#84CC16",
			accentForeground: "#1A2E05",
			ring: "#5EEAD4",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#2DD4BF",
			primaryForeground: "#042F2E",
			secondary: "#94A3B8",
			secondaryForeground: "#0F172A",
			accent: "#A3E635",
			accentForeground: "#1A2E05"
		}
	},
	"plum-rose": {
		light: {
			background: "#FFFAFC",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F9EEF4",
			text: "#2B1D2A",
			textMuted: "#795F73",
			textSubtle: "#A18A9B",
			border: "#EEDDE7",
			borderStrong: "#D8BCCD",
			primary: "#9333EA",
			primaryForeground: "#FFFFFF",
			secondary: "#6B214F",
			secondaryForeground: "#FFFFFF",
			accent: "#E11D48",
			accentForeground: "#FFFFFF",
			ring: "#D8B4FE",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#C084FC",
			primaryForeground: "#3B0764",
			secondary: "#E9A8D4",
			secondaryForeground: "#500724",
			accent: "#FB7185",
			accentForeground: "#4C0519"
		}
	},
	"graphite-cyan": {
		light: {
			background: "#F7FAFC",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#EDF2F7",
			text: "#1A202C",
			textMuted: "#4A5568",
			textSubtle: "#718096",
			border: "#E2E8F0",
			borderStrong: "#CBD5E0",
			primary: "#0F766E",
			primaryForeground: "#FFFFFF",
			secondary: "#334155",
			secondaryForeground: "#FFFFFF",
			accent: "#0891B2",
			accentForeground: "#FFFFFF",
			ring: "#67E8F9",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#2DD4BF",
			primaryForeground: "#042F2E",
			secondary: "#94A3B8",
			secondaryForeground: "#0F172A",
			accent: "#22D3EE",
			accentForeground: "#083344"
		}
	},
	"soft-white-terracotta": {
		light: {
			background: "#FCFCFB",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#F4F3F1",
			text: "#242321",
			textMuted: "#686662",
			textSubtle: "#92908A",
			border: "#E7E5E1",
			borderStrong: "#D0CCC5",
			primary: "#C2410C",
			primaryForeground: "#FFFFFF",
			secondary: "#44403C",
			secondaryForeground: "#FFFFFF",
			accent: "#0F766E",
			accentForeground: "#FFFFFF",
			ring: "#FDBA74",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#FB923C",
			primaryForeground: "#431407",
			secondary: "#A8A29E",
			secondaryForeground: "#1C1917",
			accent: "#2DD4BF",
			accentForeground: "#042F2E"
		}
	},
	"electric-indigo": {
		light: {
			background: "#F8FAFF",
			surface: "#FFFFFF",
			surfaceElevated: "#FFFFFF",
			surfaceSunken: "#EEF2FF",
			text: "#171A35",
			textMuted: "#5F6485",
			textSubtle: "#8B91B3",
			border: "#E0E5F5",
			borderStrong: "#C4CBE6",
			primary: "#4F46E5",
			primaryForeground: "#FFFFFF",
			secondary: "#3730A3",
			secondaryForeground: "#FFFFFF",
			accent: "#DB2777",
			accentForeground: "#FFFFFF",
			ring: "#A5B4FC",
			success: "#15803D",
			successForeground: "#FFFFFF",
			warning: "#FABC0A",
			warningForeground: "#FFFFFF",
			danger: "#B91C1C",
			dangerForeground: "#FFFFFF",
			info: "#0369A1",
			infoForeground: "#FFFFFF"
		},
		dark: {
			primary: "#818CF8",
			primaryForeground: "#1E1B4B",
			secondary: "#A5B4FC",
			secondaryForeground: "#1E1B4B",
			accent: "#F472B6",
			accentForeground: "#500724"
		}
	}
};
var typographyDefaults = {
	display1: {
		size: 80,
		lineHeight: 1.05,
		weight: 300,
		letterSpacing: -1.5,
		font: "heading",
		responsive: {
			min: 40,
			max: 80,
			minViewport: 360,
			maxViewport: 1440
		}
	},
	display2: {
		size: 60,
		lineHeight: 1.1,
		weight: 300,
		letterSpacing: -.5,
		font: "heading",
		responsive: {
			min: 36,
			max: 60,
			minViewport: 360,
			maxViewport: 1200
		}
	},
	headline1: {
		size: 48,
		lineHeight: 1.15,
		weight: 400,
		letterSpacing: -.5,
		font: "heading",
		responsive: {
			min: 32,
			max: 48,
			minViewport: 360,
			maxViewport: 1200
		}
	},
	headline2: {
		size: 36,
		lineHeight: 1.2,
		weight: 400,
		letterSpacing: -.25,
		font: "heading",
		responsive: {
			min: 28,
			max: 36,
			minViewport: 360,
			maxViewport: 1024
		}
	},
	headline3: {
		size: 28,
		lineHeight: 1.25,
		weight: 400,
		letterSpacing: 0,
		font: "heading",
		responsive: {
			min: 22,
			max: 28,
			minViewport: 360,
			maxViewport: 900
		}
	},
	headline4: {
		size: 20,
		lineHeight: 1.3,
		weight: 500,
		letterSpacing: .15,
		font: "heading"
	},
	subtitle1: {
		size: 16,
		lineHeight: 1.5,
		weight: 500,
		letterSpacing: .15,
		font: "heading"
	},
	subtitle2: {
		size: 14,
		lineHeight: 1.43,
		weight: 500,
		letterSpacing: .1,
		font: "heading"
	},
	body1: {
		size: 16,
		lineHeight: 1.5,
		weight: 400,
		letterSpacing: .5,
		font: "body"
	},
	body2: {
		size: 14,
		lineHeight: 1.43,
		weight: 400,
		letterSpacing: .25,
		font: "body"
	},
	button: {
		size: 14,
		lineHeight: 1.43,
		weight: 500,
		letterSpacing: .5,
		font: "body"
	},
	caption: {
		size: 12,
		lineHeight: 1.4,
		weight: 400,
		letterSpacing: .4,
		font: "body"
	},
	overline: {
		size: 10,
		lineHeight: 1.6,
		weight: 500,
		letterSpacing: 1,
		font: "body"
	}
};
var createFluidFontSize = ({ min, max, minViewport = 360, maxViewport = 1440 }) => {
	const minRem = min / 16;
	const maxRem = max / 16;
	const slope = (max - min) / (maxViewport - minViewport) * 100;
	return `clamp(${minRem}rem, ${((min - slope * minViewport / 100) / 16).toFixed(4)}rem + ${slope.toFixed(4)}vw, ${maxRem}rem)`;
};
var fontSizeScaleByRole = {
	headline4: "xl",
	subtitle1: "base",
	subtitle2: "sm",
	body1: "base",
	body2: "sm",
	button: "sm",
	caption: "xs"
};
var fontWeightTokenByValue = /* @__PURE__ */ new Map([
	[400, "normal"],
	[500, "medium"],
	[600, "semibold"],
	[700, "bold"],
	[800, "extrabold"]
]);
var lineHeightTokenByValue = /* @__PURE__ */ new Map([
	[1, "none"],
	[1.15, "tight"],
	[1.3, "snug"],
	[1.5, "normal"],
	[1.625, "relaxed"],
	[2, "loose"]
]);
var createTypographyRole = (name, typography) => {
	const fontSizeScale = fontSizeScaleByRole[name];
	const fontWeightToken = fontWeightTokenByValue.get(typography.weight);
	const lineHeightToken = lineHeightTokenByValue.get(typography.lineHeight);
	return {
		font: typography.font,
		fontSize: fontSizeScale !== void 0 ? `var(--puzzle-font-size-${fontSizeScale})` : "responsive" in typography ? createFluidFontSize(typography.responsive) : `${typography.size / 16}rem`,
		fontWeight: fontWeightToken !== void 0 ? `var(--puzzle-font-weight-${fontWeightToken})` : String(typography.weight),
		lineHeight: lineHeightToken !== void 0 ? `var(--puzzle-font-line-height-${lineHeightToken})` : String(typography.lineHeight),
		letterSpacing: `${typography.letterSpacing / typography.size}em`
	};
};
var DEFAULT_TYPOGRAPHY_ROLES = Object.fromEntries(Object.entries(typographyDefaults).map(([name, typography]) => [name, createTypographyRole(name, typography)]));
var isRecord = (value) => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};
var structuredCloneSafe = (value) => {
	if (Array.isArray(value)) return value.map(structuredCloneSafe);
	if (isRecord(value)) {
		const copy = {};
		for (const [key, child] of Object.entries(value)) copy[key] = structuredCloneSafe(child);
		return copy;
	}
	return value;
};
var mergeKnownShape = (defaults, override, path) => {
	if (override === void 0) return structuredCloneSafe(defaults);
	if (!isRecord(override)) throw new TypeError(`${path} must be an object.`);
	for (const key of Object.keys(override)) if (!Object.prototype.hasOwnProperty.call(defaults, key)) throw new TypeError(`Unknown theme token: ${path}.${key}`);
	const result = {};
	for (const key of Object.keys(defaults)) {
		const defaultValue = defaults[key];
		const overrideValue = override[key];
		if (isRecord(defaultValue)) result[key] = mergeKnownShape(defaultValue, overrideValue, `${path}.${key}`);
		else if (overrideValue === void 0) result[key] = defaultValue;
		else result[key] = assertSafeCssValue(overrideValue, `${path}.${key}`);
	}
	return result;
};
var setGroupVariables = (output, prefix, values) => {
	for (const [key, value] of Object.entries(values)) output[`--puzzle-${prefix}-${stringWithCasing(key, "kebabcase")}`] = assertSafeCssValue(value, `token ${prefix}.${key}`);
};
var quoteCssFontFamily = (family) => {
	if (GENERIC_FAMILIES.has(family.toLowerCase())) return family;
	return `"${family.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
};
var buildFontFamilyValue = (family, fallback) => {
	return [family, ...fallback].map(quoteCssFontFamily).join(", ");
};
var resolveThemeTokens = (overrides, colorTheme) => {
	let defaultTokens = DEFAULT_TOKENS;
	if (colorTheme) defaultTokens = {
		...DEFAULT_TOKENS,
		colorSchemes: {
			...DEFAULT_TOKENS.colorSchemes,
			light: COLOR_THEMES[colorTheme].light,
			dark: {
				...COLOR_THEMES[colorTheme].light,
				...COLOR_THEMES[colorTheme].dark
			}
		}
	};
	return mergeKnownShape({
		...defaultTokens,
		typography: {
			...defaultTokens.typography,
			roles: DEFAULT_TYPOGRAPHY_ROLES
		}
	}, overrides, "tokens");
};
var createThemeVariables = (fonts, tokens, _theme = "system", colorTheme, customVariables) => {
	const output = {};
	const resolvedTokens = resolveThemeTokens(tokens, colorTheme);
	setGroupVariables(output, "color-scheme-light", resolvedTokens.colorSchemes.light);
	setGroupVariables(output, "color-scheme-dark", resolvedTokens.colorSchemes.dark);
	setGroupVariables(output, "font-size", resolvedTokens.typography.fontSize);
	setGroupVariables(output, "font-weight", resolvedTokens.typography.fontWeight);
	setGroupVariables(output, "font-line-height", resolvedTokens.typography.lineHeight);
	setGroupVariables(output, "font-letter-spacing", resolvedTokens.typography.letterSpacing);
	setGroupVariables(output, "font-gap", resolvedTokens.typography.fontGap);
	setGroupVariables(output, "space", resolvedTokens.spacing);
	setGroupVariables(output, "radius", resolvedTokens.radius);
	setGroupVariables(output, "shadow", resolvedTokens.shadows);
	setGroupVariables(output, "elevation", resolvedTokens.elevation);
	setGroupVariables(output, "breakpoint", resolvedTokens.breakpoints);
	setGroupVariables(output, "overlay", resolvedTokens.overlays);
	setGroupVariables(output, "z-index", resolvedTokens.zIndex);
	output["--puzzle-border-width"] = assertSafeCssValue(resolvedTokens.borders.width, "tokens.borders.width");
	output["--puzzle-border-width-strong"] = assertSafeCssValue(resolvedTokens.borders.widthStrong, "tokens.borders.widthStrong");
	output["--puzzle-border-style"] = assertSafeCssValue(resolvedTokens.borders.style, "tokens.borders.style");
	output["--puzzle-container-width"] = assertSafeCssValue(resolvedTokens.layout.container, "tokens.layout.container");
	output["--puzzle-content-width"] = assertSafeCssValue(resolvedTokens.layout.content, "tokens.layout.content");
	output["--puzzle-prose-width"] = assertSafeCssValue(resolvedTokens.layout.prose, "tokens.layout.prose");
	output["--puzzle-duration-fast"] = assertSafeCssValue(resolvedTokens.motion.fast, "tokens.motion.fast");
	output["--puzzle-duration-normal"] = assertSafeCssValue(resolvedTokens.motion.normal, "tokens.motion.normal");
	output["--puzzle-duration-slow"] = assertSafeCssValue(resolvedTokens.motion.slow, "tokens.motion.slow");
	output["--puzzle-easing-standard"] = assertSafeCssValue(resolvedTokens.motion.easingStandard, "tokens.motion.easingStandard");
	output["--puzzle-easing-in"] = assertSafeCssValue(resolvedTokens.motion.easingIn, "tokens.motion.easingIn");
	output["--puzzle-easing-out"] = assertSafeCssValue(resolvedTokens.motion.easingOut, "tokens.motion.easingOut");
	for (const [name, typography] of Object.entries(resolvedTokens.typography.roles ?? DEFAULT_TYPOGRAPHY_ROLES)) {
		const role = typography.font;
		const config = fonts?.[role];
		const fontFamily = config ? (() => {
			const resolved = resolveFontConfig({
				...config,
				role
			});
			return buildFontFamilyValue(resolved.family, resolved.fallback);
		})() : DEFAULT_FONT_FALLBACKS[role].map(quoteCssFontFamily).join(", ");
		output[`--puzzle-font-family-${name}`] = fontFamily;
		output[`--puzzle-font-size-${name}`] = assertSafeCssValue(typography.fontSize, `tokens.typography.roles.${name}.fontSize`);
		output[`--puzzle-font-weight-${name}`] = assertSafeCssValue(typography.fontWeight, `tokens.typography.roles.${name}.fontWeight`);
		output[`--puzzle-font-line-height-${name}`] = assertSafeCssValue(typography.lineHeight, `tokens.typography.roles.${name}.lineHeight`);
		output[`--puzzle-font-letter-spacing-${name}`] = assertSafeCssValue(typography.letterSpacing, `tokens.typography.roles.${name}.letterSpacing`);
	}
	for (const role of [
		"heading",
		"body",
		"accent"
	]) {
		const config = fonts?.[role];
		const fontFamily = config ? (() => {
			const resolved = resolveFontConfig({
				...config,
				role
			});
			return buildFontFamilyValue(resolved.family, resolved.fallback);
		})() : DEFAULT_FONT_FALLBACKS[role].map(quoteCssFontFamily).join(", ");
		output[`--puzzle-font-${role}`] = fontFamily;
		output[`--puzzle-font-family-${role}`] = fontFamily;
	}
	if (customVariables !== void 0) for (const [name, value] of Object.entries(customVariables)) {
		if (!/^--puzzle-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) throw new TypeError(`Custom CSS variable "${name}" must start with --puzzle- and contain only lowercase letters, numbers, and hyphens.`);
		output[name] = assertSafeCssValue(value, `variables.${name}`);
	}
	return output;
};
var resolveFontStylesheets = (fonts) => {
	if (fonts === void 0) return [];
	const resolved = [];
	for (const role of [
		"heading",
		"body",
		"accent"
	]) {
		const font = fonts[role];
		if (font !== void 0) resolved.push(resolveFontConfig({
			...font,
			role
		}));
	}
	const groups = /* @__PURE__ */ new Map();
	for (const font of resolved) {
		const key = `${font.family.toLocaleLowerCase("en-US")}\u0000${font.display}`;
		let group = groups.get(key);
		if (!group) {
			group = {
				family: font.family,
				display: font.display,
				weights: /* @__PURE__ */ new Set(),
				styles: /* @__PURE__ */ new Set()
			};
			groups.set(key, group);
		}
		font.weights.forEach((weight) => group.weights.add(weight));
		font.styles.forEach((style) => group.styles.add(style));
	}
	return [...groups.values()].map((group) => ({
		family: group.family,
		display: group.display,
		href: createGoogleFontUrl({
			family: group.family,
			weights: [...group.weights].sort((a, b) => a - b),
			styles: [...group.styles].sort((a, b) => (a === "normal" ? 0 : 1) - (b === "normal" ? 0 : 1)),
			display: group.display
		})
	}));
};
var createThemeCss = (variables) => {
	return `${Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n`;
};
var Theme = ({ nonce, fonts, theme = "system", scope = "root", globalStyles, tokens, colorTheme, components, children }) => {
	const scopeId = (0, import_react.useId)();
	const fontStylesheets = resolveFontStylesheets(fonts);
	const cssVariables = createThemeVariables(fonts, tokens, theme, colorTheme);
	const css = `${scope === "root" ? ":root" : `[data-puzzle-theme-scope="${scopeId}"]`} {\n${createThemeCss(cssVariables)}\n}`;
	const shouldApplyGlobalStyles = scope === "root" && (globalStyles ?? true);
	const scopedContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeScopeProvider, {
		scopeId: scope === "local" ? scopeId : null,
		theme,
		children: components === void 0 ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeComponentsProvider, {
			components,
			children
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		fontStylesheets.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "preconnect",
			href: "https://fonts.googleapis.com"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous"
		})] }) : null,
		fontStylesheets.map(({ href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "stylesheet",
			href,
			precedence: "default"
		}, href)),
		shouldApplyGlobalStyles ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
			nonce,
			"data-puzzle-global-styles": ""
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
			nonce,
			"data-theme": theme,
			"data-puzzle-theme": scope === "root" ? "true" : void 0,
			"data-puzzle-theme-scope-style": scope === "local" ? scopeId : void 0,
			children: css
		}),
		scopedContent
	] });
};
export { Theme };
