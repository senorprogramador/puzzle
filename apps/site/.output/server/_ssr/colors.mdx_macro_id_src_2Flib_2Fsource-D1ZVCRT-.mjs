import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/colors.mdx_macro_id_src_2Flib_2Fsource-D1ZVCRT-.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Colors",
	"description": "Semantic color roles, light and dark color schemes, and the built-in color themes."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Puzzle uses semantic color roles instead of raw palette values. Each role exists in a light and a dark color scheme, and the active theme mode decides which scheme resolves into the semantic `--puzzle-color-*` variables that components consume."
		},
		{
			"heading": "color-roles",
			"content": "Every color scheme defines the following roles (`ThemeColorSchemeTokens`):"
		},
		{
			"heading": "color-roles",
			"content": "| Role         | CSS variable                | Purpose          |\n| ------------ | --------------------------- | ---------------- |\n| `background` | `--puzzle-color-background` | Page background. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role      | CSS variable             | Purpose                               |\n| --------- | ------------------------ | ------------------------------------- |\n| `surface` | `--puzzle-color-surface` | Default surface for cards and panels. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role              | CSS variable                      | Purpose                                    |\n| ----------------- | --------------------------------- | ------------------------------------------ |\n| `surfaceElevated` | `--puzzle-color-surface-elevated` | Raised surfaces such as menus and dialogs. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role            | CSS variable                    | Purpose                                     |\n| --------------- | ------------------------------- | ------------------------------------------- |\n| `surfaceSunken` | `--puzzle-color-surface-sunken` | Recessed surfaces such as wells and inputs. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role   | CSS variable          | Purpose       |\n| ------ | --------------------- | ------------- |\n| `text` | `--puzzle-color-text` | Primary text. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role        | CSS variable                | Purpose         |\n| ----------- | --------------------------- | --------------- |\n| `textMuted` | `--puzzle-color-text-muted` | Secondary text. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role         | CSS variable                 | Purpose                       |\n| ------------ | ---------------------------- | ----------------------------- |\n| `textSubtle` | `--puzzle-color-text-subtle` | Tertiary, de-emphasized text. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role     | CSS variable            | Purpose                       |\n| -------- | ----------------------- | ----------------------------- |\n| `border` | `--puzzle-color-border` | Default borders and dividers. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role           | CSS variable                   | Purpose             |\n| -------------- | ------------------------------ | ------------------- |\n| `borderStrong` | `--puzzle-color-border-strong` | Emphasized borders. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                            | CSS variable                                                   | Purpose                         |\n| ------------------------------- | -------------------------------------------------------------- | ------------------------------- |\n| `primary` / `primaryForeground` | `--puzzle-color-primary` / `--puzzle-color-primary-foreground` | Primary actions and their text. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                                | CSS variable                                                       | Purpose            |\n| ----------------------------------- | ------------------------------------------------------------------ | ------------------ |\n| `secondary` / `secondaryForeground` | `--puzzle-color-secondary` / `--puzzle-color-secondary-foreground` | Secondary actions. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                          | CSS variable                                                 | Purpose                 |\n| ----------------------------- | ------------------------------------------------------------ | ----------------------- |\n| `accent` / `accentForeground` | `--puzzle-color-accent` / `--puzzle-color-accent-foreground` | Accents and highlights. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role   | CSS variable          | Purpose      |\n| ------ | --------------------- | ------------ |\n| `ring` | `--puzzle-color-ring` | Focus rings. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                            | CSS variable                                                   | Purpose          |\n| ------------------------------- | -------------------------------------------------------------- | ---------------- |\n| `success` / `successForeground` | `--puzzle-color-success` / `--puzzle-color-success-foreground` | Positive status. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                            | CSS variable                                                   | Purpose            |\n| ------------------------------- | -------------------------------------------------------------- | ------------------ |\n| `warning` / `warningForeground` | `--puzzle-color-warning` / `--puzzle-color-warning-foreground` | Cautionary status. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                          | CSS variable                                                 | Purpose                         |\n| ----------------------------- | ------------------------------------------------------------ | ------------------------------- |\n| `danger` / `dangerForeground` | `--puzzle-color-danger` / `--puzzle-color-danger-foreground` | Destructive actions and errors. |",
			"table": "table-0"
		},
		{
			"heading": "color-roles",
			"content": "| Role                      | CSS variable                                             | Purpose               |\n| ------------------------- | -------------------------------------------------------- | --------------------- |\n| `info` / `infoForeground` | `--puzzle-color-info` / `--puzzle-color-info-foreground` | Informational status. |",
			"table": "table-0"
		},
		{
			"heading": "light-and-dark-schemes",
			"content": "Both schemes are always emitted as scheme-specific variables—`--puzzle-color-scheme-light-{role}` and `--puzzle-color-scheme-dark-{role}`—and the package's static CSS maps the active scheme onto the semantic `--puzzle-color-{role}` variables. In `system` mode this happens through `prefers-color-scheme`, so switching the OS appearance updates the UI without re-rendering. The CSS `color-scheme` property is set alongside, keeping native form controls and scrollbars consistent."
		},
		{
			"heading": "light-and-dark-schemes",
			"content": "Override individual scheme colors through the `tokens` prop:"
		},
		{
			"heading": "built-in-color-themes",
			"content": "The `colorTheme` prop swaps the default color schemes for a curated palette:"
		},
		{
			"heading": "built-in-color-themes",
			"content": "Available themes:"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`cobalt-sky`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`violet-dream`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`emerald-forest`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`coral-navy`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`ocean-blue`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`mint-graphite`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`plum-rose`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`graphite-cyan`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`soft-white-terracotta`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "`electric-indigo`"
		},
		{
			"heading": "built-in-color-themes",
			"content": "Each color theme (`ColorTheme`) defines a complete light scheme plus dark-mode overrides for the brand roles (`primary`, `secondary`, and `accent` with their foregrounds); the remaining dark roles fall back to the theme's light values merged with Puzzle's dark defaults. `tokens.colorSchemes` overrides still apply on top of a color theme, so you can pick a palette and fine-tune individual roles."
		},
		{
			"heading": "guidelines",
			"content": "Always pair a role with its foreground: `primary` text should use `primaryForeground`."
		},
		{
			"heading": "guidelines",
			"content": "Use `ring` for focus indicators rather than reusing `primary`."
		},
		{
			"heading": "guidelines",
			"content": "Never hardcode colors in component CSS; reference the semantic variables so light/dark modes and color themes keep working."
		}
	],
	"headings": [
		{
			"id": "color-roles",
			"content": "Color roles"
		},
		{
			"id": "light-and-dark-schemes",
			"content": "Light and dark schemes"
		},
		{
			"id": "built-in-color-themes",
			"content": "Built-in color themes"
		},
		{
			"id": "guidelines",
			"content": "Guidelines"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#color-roles",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Color roles" })
	},
	{
		depth: 2,
		url: "#light-and-dark-schemes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Light and dark schemes" })
	},
	{
		depth: 2,
		url: "#built-in-color-themes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Built-in color themes" })
	},
	{
		depth: 2,
		url: "#guidelines",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Guidelines" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
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
			"Puzzle uses semantic color roles instead of raw palette values. Each role exists in a light and a dark color scheme, and the active ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/theme/theme-provider#theme-modes",
				children: "theme mode"
			}),
			" decides which scheme resolves into the semantic ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-*" }),
			" variables that components consume."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "color-roles",
			children: "Color roles"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Every color scheme defines the following roles (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ThemeColorSchemeTokens" }),
			"):"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Role" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Purpose" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "background" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-background" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Page background." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "surface" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-surface" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Default surface for cards and panels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "surfaceElevated" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-surface-elevated" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Raised surfaces such as menus and dialogs." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "surfaceSunken" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-surface-sunken" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Recessed surfaces such as wells and inputs." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "text" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-text" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Primary text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "textMuted" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-text-muted" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Secondary text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "textSubtle" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-text-subtle" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Tertiary, de-emphasized text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "border" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-border" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Default borders and dividers." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "borderStrong" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-border-strong" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Emphasized borders." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "primaryForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-primary" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-primary-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Primary actions and their text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "secondary" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "secondaryForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-secondary" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-secondary-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Secondary actions." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "accent" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "accentForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-accent" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-accent-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accents and highlights." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ring" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-ring" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Focus rings." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "success" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "successForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-success" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-success-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Positive status." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "warning" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "warningForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-warning" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-warning-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Cautionary status." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "danger" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "dangerForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-danger" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-danger-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Destructive actions and errors." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "info" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "infoForeground" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-info" }),
					" / ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-info-foreground" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Informational status." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "light-and-dark-schemes",
			children: "Light and dark schemes"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Both schemes are always emitted as scheme-specific variables—",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-scheme-light-{role}" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-scheme-dark-{role}" }),
			"—and the package's static CSS maps the active scheme onto the semantic ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-{role}" }),
			" variables. In ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "system" }),
			" mode this happens through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "prefers-color-scheme" }),
			", so switching the OS appearance updates the UI without re-rendering. The CSS ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "color-scheme" }),
			" property is set alongside, keeping native form controls and scrollbars consistent."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Override individual scheme colors through the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tokens" }),
			" prop:"
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
						children: "    colorSchemes: {"
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
							children: "      light: { primary: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"#0F766E\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", primaryForeground: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"#FFFFFF\""
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
							children: "      dark: { primary: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"#2DD4BF\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", primaryForeground: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"#042F2E\""
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
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "built-in-color-themes",
			children: "Built-in color themes"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "colorTheme" }),
			" prop swaps the default color schemes for a curated palette:"
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
							children: "Theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " colorTheme"
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
							children: "\"violet-dream\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Available themes:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "cobalt-sky" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "violet-dream" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "emerald-forest" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "coral-navy" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ocean-blue" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "mint-graphite" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "plum-rose" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "graphite-cyan" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "soft-white-terracotta" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "electric-indigo" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Each color theme (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ColorTheme" }),
			") defines a complete light scheme plus dark-mode overrides for the brand roles (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "secondary" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "accent" }),
			" with their foregrounds); the remaining dark roles fall back to the theme's light values merged with Puzzle's dark defaults. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tokens.colorSchemes" }),
			" overrides still apply on top of a color theme, so you can pick a palette and fine-tune individual roles."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "guidelines",
			children: "Guidelines"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Always pair a role with its foreground: ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
				" text should use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "primaryForeground" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "ring" }),
				" for focus indicators rather than reusing ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Never hardcode colors in component CSS; reference the semantic variables so light/dark modes and color themes keep working." }),
			"\n"
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
