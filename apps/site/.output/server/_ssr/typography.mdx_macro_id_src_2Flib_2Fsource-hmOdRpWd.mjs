import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/typography.mdx_macro_id_src_2Flib_2Fsource-hmOdRpWd.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Typography & Fonts",
	"description": "Typography scales, named typography roles, fluid font sizes, and Google Font loading."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "The theme package provides base typography scales, a set of named typography roles used by the `Heading` and `Text` components, and first-class Google Font loading for three font roles."
		},
		{
			"heading": "font-roles",
			"content": "Fonts are organized into three roles (`FontRole`): `heading`, `body`, and `accent`. Each role resolves to a font family variable, emitted under two equivalent names:"
		},
		{
			"heading": "font-roles",
			"content": "`--puzzle-font-heading` / `--puzzle-font-family-heading`"
		},
		{
			"heading": "font-roles",
			"content": "`--puzzle-font-body` / `--puzzle-font-family-body`"
		},
		{
			"heading": "font-roles",
			"content": "`--puzzle-font-accent` / `--puzzle-font-family-accent`"
		},
		{
			"heading": "font-roles",
			"content": "Without configured fonts, every role falls back to `\"Open Sans\", sans-serif`."
		},
		{
			"heading": "loading-google-fonts",
			"content": "Pass a `fonts` map to `Theme`. Each entry is a `FontConfig`:"
		},
		{
			"heading": "loading-google-fonts",
			"content": "| Field    | Type               | Default | Description                      |\n| -------- | ------------------ | ------- | -------------------------------- |\n| `family` | `GoogleFontFamily` | —       | A typed Google Font family name. |",
			"table": "table-0"
		},
		{
			"heading": "loading-google-fonts",
			"content": "| Field     | Type                | Default             | Description          |\n| --------- | ------------------- | ------------------- | -------------------- |\n| `weights` | `readonly number[]` | role-based defaults | The weights to load. |",
			"table": "table-0"
		},
		{
			"heading": "loading-google-fonts",
			"content": "| Field    | Type                                | Default      | Description          |\n| -------- | ----------------------------------- | ------------ | -------------------- |\n| `styles` | `readonly (\"normal\" \\| \"italic\")[]` | `[\"normal\"]` | Font styles to load. |",
			"table": "table-0"
		},
		{
			"heading": "loading-google-fonts",
			"content": "| Field     | Type                                                      | Default  | Description                      |\n| --------- | --------------------------------------------------------- | -------- | -------------------------------- |\n| `display` | `\"auto\" \\| \"block\" \\| \"swap\" \\| \"fallback\" \\| \"optional\"` | `\"swap\"` | The CSS `font-display` strategy. |",
			"table": "table-0"
		},
		{
			"heading": "loading-google-fonts",
			"content": "| Field      | Type                | Default             | Description             |\n| ---------- | ------------------- | ------------------- | ----------------------- |\n| `fallback` | `readonly string[]` | role-based defaults | Fallback font families. |",
			"table": "table-0"
		},
		{
			"heading": "loading-google-fonts",
			"content": "`Theme` renders the Google Fonts preconnect links and one stylesheet link per font, and builds properly quoted `font-family` values including your fallbacks."
		},
		{
			"heading": "standalone-font-loading",
			"content": "`GoogleFont` loads a single font and sets its role variable without the rest of the theme system. Prefer `Theme` when you want the full token system."
		},
		{
			"heading": "creategooglefonturl",
			"content": "Builds a Google Fonts CSS2 stylesheet URL for a font configuration:"
		},
		{
			"heading": "base-typography-scales",
			"content": "These token groups form the raw scales. Font sizes use `rem` and letter spacing uses `em`."
		},
		{
			"heading": "base-typography-scales",
			"content": "| Group                 | CSS variable               | Keys                                                 |\n| --------------------- | -------------------------- | ---------------------------------------------------- |\n| `typography.fontSize` | `--puzzle-font-size-{key}` | `xs` (0.75rem) … `6xl` (3.75rem), with `base` = 1rem |",
			"table": "table-1"
		},
		{
			"heading": "base-typography-scales",
			"content": "| Group                   | CSS variable                 | Keys                                                                    |\n| ----------------------- | ---------------------------- | ----------------------------------------------------------------------- |\n| `typography.fontWeight` | `--puzzle-font-weight-{key}` | `normal` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800 |",
			"table": "table-1"
		},
		{
			"heading": "base-typography-scales",
			"content": "| Group                   | CSS variable                      | Keys                                                                         |\n| ----------------------- | --------------------------------- | ---------------------------------------------------------------------------- |\n| `typography.lineHeight` | `--puzzle-font-line-height-{key}` | `none` 1, `tight` 1.15, `snug` 1.3, `normal` 1.5, `relaxed` 1.625, `loose` 2 |",
			"table": "table-1"
		},
		{
			"heading": "base-typography-scales",
			"content": "| Group                      | CSS variable                         | Keys                               |\n| -------------------------- | ------------------------------------ | ---------------------------------- |\n| `typography.letterSpacing` | `--puzzle-font-letter-spacing-{key}` | `tighter` −0.05em … `widest` 0.1em |",
			"table": "table-1"
		},
		{
			"heading": "base-typography-scales",
			"content": "| Group                | CSS variable              | Keys                                                                   |\n| -------------------- | ------------------------- | ---------------------------------------------------------------------- |\n| `typography.fontGap` | `--puzzle-font-gap-{key}` | `headingStackGap`, `headingParagraphGap`, `paragraphGap`, `sectionGap` |",
			"table": "table-1"
		},
		{
			"heading": "typography-roles",
			"content": "Named roles (`TypographyStyle`) describe complete text styles. Each role resolves to a font role plus size, weight, line height, and letter spacing, emitted as:"
		},
		{
			"heading": "typography-roles",
			"content": "`--puzzle-font-family-{role}`"
		},
		{
			"heading": "typography-roles",
			"content": "`--puzzle-font-size-{role}`"
		},
		{
			"heading": "typography-roles",
			"content": "`--puzzle-font-weight-{role}`"
		},
		{
			"heading": "typography-roles",
			"content": "`--puzzle-font-line-height-{role}`"
		},
		{
			"heading": "typography-roles",
			"content": "`--puzzle-font-letter-spacing-{role}`"
		},
		{
			"heading": "typography-roles",
			"content": "| Role       | Font    | Size          | Weight | Notes                 |\n| ---------- | ------- | ------------- | ------ | --------------------- |\n| `display1` | heading | 40–80px fluid | 300    | Largest display text. |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role       | Font    | Size          | Weight | Notes |\n| ---------- | ------- | ------------- | ------ | ----- |\n| `display2` | heading | 36–60px fluid | 300    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size          | Weight | Notes |\n| ----------- | ------- | ------------- | ------ | ----- |\n| `headline1` | heading | 32–48px fluid | 400    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size          | Weight | Notes |\n| ----------- | ------- | ------------- | ------ | ----- |\n| `headline2` | heading | 28–36px fluid | 400    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size          | Weight | Notes |\n| ----------- | ------- | ------------- | ------ | ----- |\n| `headline3` | heading | 22–28px fluid | 400    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size       | Weight | Notes |\n| ----------- | ------- | ---------- | ------ | ----- |\n| `headline4` | heading | `xl` scale | 500    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size         | Weight | Notes |\n| ----------- | ------- | ------------ | ------ | ----- |\n| `subtitle1` | heading | `base` scale | 500    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role        | Font    | Size       | Weight | Notes |\n| ----------- | ------- | ---------- | ------ | ----- |\n| `subtitle2` | heading | `sm` scale | 500    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role    | Font | Size         | Weight | Notes              |\n| ------- | ---- | ------------ | ------ | ------------------ |\n| `body1` | body | `base` scale | 400    | Default body text. |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role    | Font | Size       | Weight | Notes |\n| ------- | ---- | ---------- | ------ | ----- |\n| `body2` | body | `sm` scale | 400    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role     | Font | Size       | Weight | Notes |\n| -------- | ---- | ---------- | ------ | ----- |\n| `button` | body | `sm` scale | 500    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role      | Font | Size | Weight | Notes |\n| --------- | ---- | ---- | ------ | ----- |\n| `caption` | body | 12px | 400    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "| Role       | Font | Size | Weight | Notes |\n| ---------- | ---- | ---- | ------ | ----- |\n| `overline` | body | 10px | 500    |       |",
			"table": "table-2"
		},
		{
			"heading": "typography-roles",
			"content": "The larger roles use fluid font sizes built with `clamp()`, scaling smoothly between a minimum and maximum size across viewport widths. The smaller roles reference the base font-size scale, so overriding `typography.fontSize` flows through to them."
		},
		{
			"heading": "overriding-roles",
			"content": "Roles can be overridden per property through `tokens.typography.roles`:"
		},
		{
			"heading": "overriding-roles",
			"content": "Each role override accepts `font` (a font role), `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`."
		}
	],
	"headings": [
		{
			"id": "font-roles",
			"content": "Font roles"
		},
		{
			"id": "loading-google-fonts",
			"content": "Loading Google Fonts"
		},
		{
			"id": "standalone-font-loading",
			"content": "Standalone font loading"
		},
		{
			"id": "creategooglefonturl",
			"content": "createGoogleFontUrl"
		},
		{
			"id": "base-typography-scales",
			"content": "Base typography scales"
		},
		{
			"id": "typography-roles",
			"content": "Typography roles"
		},
		{
			"id": "overriding-roles",
			"content": "Overriding roles"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#font-roles",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Font roles" })
	},
	{
		depth: 2,
		url: "#loading-google-fonts",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Loading Google Fonts" })
	},
	{
		depth: 3,
		url: "#standalone-font-loading",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Standalone font loading" })
	},
	{
		depth: 3,
		url: "#creategooglefonturl",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "createGoogleFontUrl" })
	},
	{
		depth: 2,
		url: "#base-typography-scales",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Base typography scales" })
	},
	{
		depth: 2,
		url: "#typography-roles",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Typography roles" })
	},
	{
		depth: 3,
		url: "#overriding-roles",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Overriding roles" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		p: "p",
		pre: "pre",
		span: "span",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The theme package provides base typography scales, a set of named typography roles used by the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Heading" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Text" }),
			" components, and first-class Google Font loading for three font roles."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "font-roles",
			children: "Font roles"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Fonts are organized into three roles (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FontRole" }),
			"): ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "heading" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "body" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "accent" }),
			". Each role resolves to a font family variable, emitted under two equivalent names:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-heading" }),
				" / ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-family-heading" })
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-body" }),
				" / ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-family-body" })
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-accent" }),
				" / ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-family-accent" })
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Without configured fonts, every role falls back to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"Open Sans\", sans-serif" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "loading-google-fonts",
			children: "Loading Google Fonts"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fonts" }),
			" map to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Theme" }),
			". Each entry is a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FontConfig" }),
			":"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Field" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "family" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "GoogleFontFamily" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "A typed Google Font family name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "weights" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly number[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "role-based defaults" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "The weights to load." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "styles" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly (\"normal\" | \"italic\")[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[\"normal\"]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Font styles to load." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "display" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"auto\" | \"block\" | \"swap\" | \"fallback\" | \"optional\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"swap\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"The CSS ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "font-display" }),
					" strategy."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "fallback" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly string[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "role-based defaults" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Fallback font families." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "<"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "Theme"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  fonts"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "{{"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    heading: { family: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Sora\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", weights: ["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "600"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "700"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "] },"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    body: { family: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Inter\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " },"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    accent: { family: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"JetBrains Mono\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", styles: ["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"normal\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"italic\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "] },"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  }}"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: ">"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "App"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " />"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Theme" }),
			" renders the Google Fonts preconnect links and one stylesheet link per font, and builds properly quoted ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "font-family" }),
			" values including your fallbacks."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "standalone-font-loading",
			children: "Standalone font loading"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "GoogleFont" }),
			" loads a single font and sets its role variable without the rest of the theme system. Prefer ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Theme" }),
			" when you want the full token system."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "import"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { GoogleFont } "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "from"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/theme\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "<"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "GoogleFont"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " family"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Inter\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " role"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"body\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " />;"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "creategooglefonturl",
			children: "createGoogleFontUrl"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Builds a Google Fonts CSS2 stylesheet URL for a font configuration:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "import"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { createGoogleFontUrl } "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "from"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/theme\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " href"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " createGoogleFontUrl"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "({"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  family: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Inter\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ","
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  weights: ["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "400"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "700"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "],"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  styles: ["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"normal\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"italic\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "],"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  display: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"swap\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ","
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "});"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "base-typography-scales",
			children: "Base typography scales"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"These token groups form the raw scales. Font sizes use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "rem" }),
			" and letter spacing uses ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "em" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Group" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Keys" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typography.fontSize" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-size-{key}" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "xs" }),
					" (0.75rem) … ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "6xl" }),
					" (3.75rem), with ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "base" }),
					" = 1rem"
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typography.fontWeight" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-weight-{key}" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "normal" }),
					" 400, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "medium" }),
					" 500, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "semibold" }),
					" 600, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "bold" }),
					" 700, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "extrabold" }),
					" 800"
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typography.lineHeight" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-line-height-{key}" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "none" }),
					" 1, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "tight" }),
					" 1.15, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "snug" }),
					" 1.3, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "normal" }),
					" 1.5, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "relaxed" }),
					" 1.625, ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loose" }),
					" 2"
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typography.letterSpacing" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-letter-spacing-{key}" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "tighter" }),
					" −0.05em … ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "widest" }),
					" 0.1em"
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typography.fontGap" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-gap-{key}" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "headingStackGap" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "headingParagraphGap" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "paragraphGap" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "sectionGap" })
				] })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "typography-roles",
			children: "Typography roles"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Named roles (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "TypographyStyle" }),
			") describe complete text styles. Each role resolves to a font role plus size, weight, line height, and letter spacing, emitted as:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-family-{role}" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-size-{role}" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-weight-{role}" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-line-height-{role}" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-font-letter-spacing-{role}" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Role" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Font" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Size" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Weight" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Notes" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "display1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "40–80px fluid" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "300" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Largest display text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "display2" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "36–60px fluid" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "300" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "headline1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "32–48px fluid" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "headline2" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "28–36px fluid" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "headline3" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "22–28px fluid" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "headline4" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "xl" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "500" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "subtitle1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "base" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "500" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "subtitle2" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "heading" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "500" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "body1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "body" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "base" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Default body text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "body2" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "body" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "button" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "body" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }), " scale"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "500" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "caption" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "body" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "12px" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "400" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "overline" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "body" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "10px" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "500" }),
				(0, import_jsx_runtime.jsx)(_components.td, {})
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The larger roles use fluid font sizes built with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clamp()" }),
			", scaling smoothly between a minimum and maximum size across viewport widths. The smaller roles reference the base font-size scale, so overriding ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "typography.fontSize" }),
			" flows through to them."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "overriding-roles",
			children: "Overriding roles"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Roles can be overridden per property through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tokens.typography.roles" }),
			":"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "<"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "Theme"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  tokens"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "{{"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    typography: {"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "      roles: {"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "        headline1: { fontWeight: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"600\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " },"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "        body1: { lineHeight: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"1.6\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " },"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "      },"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    },"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  }}"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: ">"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "App"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " />"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Each role override accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "font" }),
			" (a font role), ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fontSize" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fontWeight" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lineHeight" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "letterSpacing" }),
			"."
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
export { MDXContent as default, frontmatter, structuredData, toc };
