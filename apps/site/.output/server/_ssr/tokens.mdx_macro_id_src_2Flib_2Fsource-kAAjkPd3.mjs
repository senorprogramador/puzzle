import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/tokens.mdx_macro_id_src_2Flib_2Fsource-kAAjkPd3.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Design Tokens",
	"description": "The typed token groups that Theme resolves into --puzzle-* CSS custom properties."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "All of Puzzle's design values live in a single typed `ThemeTokens` object. `Theme` merges your overrides into the defaults and emits every value as a `--puzzle-*` CSS custom property. Components never hardcode design values; they reference these variables."
		},
		{
			"heading": "overriding-tokens",
			"content": "Pass a deep-partial `tokens` object to `Theme`. Anything you omit keeps its default. Unknown token names throw a `TypeError`, so typos are caught immediately:"
		},
		{
			"heading": "overriding-tokens",
			"content": "Every value is validated as a safe CSS value before it is injected."
		},
		{
			"heading": "spacing",
			"content": "Emitted as `--puzzle-space-{key}`."
		},
		{
			"heading": "spacing",
			"content": "| Key | Default |\n| --- | ------- |\n| `0` | `0`     |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default |\n| ---- | ------- |\n| `px` | `1px`   |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key   | Default    |\n| ----- | ---------- |\n| `0.5` | `0.125rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default   |\n| --- | --------- |\n| `1` | `0.25rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key   | Default    |\n| ----- | ---------- |\n| `1.5` | `0.375rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default  |\n| --- | -------- |\n| `2` | `0.5rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default   |\n| --- | --------- |\n| `3` | `0.75rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default |\n| --- | ------- |\n| `4` | `1rem`  |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default   |\n| --- | --------- |\n| `5` | `1.25rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default  |\n| --- | -------- |\n| `6` | `1.5rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key | Default |\n| --- | ------- |\n| `8` | `2rem`  |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default  |\n| ---- | -------- |\n| `10` | `2.5rem` |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default |\n| ---- | ------- |\n| `12` | `3rem`  |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default |\n| ---- | ------- |\n| `16` | `4rem`  |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default |\n| ---- | ------- |\n| `20` | `5rem`  |",
			"table": "table-0"
		},
		{
			"heading": "spacing",
			"content": "| Key  | Default |\n| ---- | ------- |\n| `24` | `6rem`  |",
			"table": "table-0"
		},
		{
			"heading": "radius",
			"content": "Emitted as `--puzzle-radius-{key}`."
		},
		{
			"heading": "radius",
			"content": "| Key    | Default |\n| ------ | ------- |\n| `none` | `0`     |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key  | Default    |\n| ---- | ---------- |\n| `sm` | `0.125rem` |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key  | Default    |\n| ---- | ---------- |\n| `md` | `0.375rem` |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key  | Default  |\n| ---- | -------- |\n| `lg` | `0.5rem` |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key  | Default   |\n| ---- | --------- |\n| `xl` | `0.75rem` |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key   | Default |\n| ----- | ------- |\n| `2xl` | `1rem`  |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key   | Default  |\n| ----- | -------- |\n| `3xl` | `1.5rem` |",
			"table": "table-1"
		},
		{
			"heading": "radius",
			"content": "| Key    | Default  |\n| ------ | -------- |\n| `full` | `9999px` |",
			"table": "table-1"
		},
		{
			"heading": "shadows",
			"content": "Emitted as `--puzzle-shadow-{key}` with keys `none`, `xs`, `sm`, `md`, `lg`, and `xl`."
		},
		{
			"heading": "elevation",
			"content": "A finer-grained elevation scale emitted as `--puzzle-elevation-{key}` with keys `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, and `24`. Use elevation for layered surfaces such as cards, menus, and dialogs."
		},
		{
			"heading": "borders",
			"content": "| Token           | CSS variable            | Default |\n| --------------- | ----------------------- | ------- |\n| `borders.width` | `--puzzle-border-width` | `1px`   |",
			"table": "table-2"
		},
		{
			"heading": "borders",
			"content": "| Token                 | CSS variable                   | Default |\n| --------------------- | ------------------------------ | ------- |\n| `borders.widthStrong` | `--puzzle-border-width-strong` | `2px`   |",
			"table": "table-2"
		},
		{
			"heading": "borders",
			"content": "| Token           | CSS variable            | Default |\n| --------------- | ----------------------- | ------- |\n| `borders.style` | `--puzzle-border-style` | `solid` |",
			"table": "table-2"
		},
		{
			"heading": "layout",
			"content": "| Token              | CSS variable               | Default |\n| ------------------ | -------------------------- | ------- |\n| `layout.container` | `--puzzle-container-width` | `80rem` |",
			"table": "table-3"
		},
		{
			"heading": "layout",
			"content": "| Token            | CSS variable             | Default |\n| ---------------- | ------------------------ | ------- |\n| `layout.content` | `--puzzle-content-width` | `64rem` |",
			"table": "table-3"
		},
		{
			"heading": "layout",
			"content": "| Token          | CSS variable           | Default |\n| -------------- | ---------------------- | ------- |\n| `layout.prose` | `--puzzle-prose-width` | `65ch`  |",
			"table": "table-3"
		},
		{
			"heading": "layout",
			"content": "A responsive gutter, `--puzzle-container-gutter: clamp(2rem, 6vw, 6rem)`, is provided by the base stylesheet."
		},
		{
			"heading": "breakpoints",
			"content": "Emitted as `--puzzle-breakpoint-{key}` with keys `tablet` (`768px`), `desktop` (`1024px`), and `hd` (`1440px`). See Breakpoints for the JavaScript constants."
		},
		{
			"heading": "overlays",
			"content": "| Token               | CSS variable                | Default             |\n| ------------------- | --------------------------- | ------------------- |\n| `overlays.backdrop` | `--puzzle-overlay-backdrop` | `rgb(0 0 0 / 0.35)` |",
			"table": "table-4"
		},
		{
			"heading": "overlays",
			"content": "| Token                   | CSS variable                     | Default |\n| ----------------------- | -------------------------------- | ------- |\n| `overlays.backdropBlur` | `--puzzle-overlay-backdrop-blur` | `2px`   |",
			"table": "table-4"
		},
		{
			"heading": "motion",
			"content": "| Token         | CSS variable             | Default |\n| ------------- | ------------------------ | ------- |\n| `motion.fast` | `--puzzle-duration-fast` | `120ms` |",
			"table": "table-5"
		},
		{
			"heading": "motion",
			"content": "| Token           | CSS variable               | Default |\n| --------------- | -------------------------- | ------- |\n| `motion.normal` | `--puzzle-duration-normal` | `200ms` |",
			"table": "table-5"
		},
		{
			"heading": "motion",
			"content": "| Token         | CSS variable             | Default |\n| ------------- | ------------------------ | ------- |\n| `motion.slow` | `--puzzle-duration-slow` | `320ms` |",
			"table": "table-5"
		},
		{
			"heading": "motion",
			"content": "| Token                   | CSS variable               | Default                      |\n| ----------------------- | -------------------------- | ---------------------------- |\n| `motion.easingStandard` | `--puzzle-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |",
			"table": "table-5"
		},
		{
			"heading": "motion",
			"content": "| Token             | CSS variable         | Default                      |\n| ----------------- | -------------------- | ---------------------------- |\n| `motion.easingIn` | `--puzzle-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` |",
			"table": "table-5"
		},
		{
			"heading": "motion",
			"content": "| Token              | CSS variable          | Default                      |\n| ------------------ | --------------------- | ---------------------------- |\n| `motion.easingOut` | `--puzzle-easing-out` | `cubic-bezier(0, 0, 0.2, 1)` |",
			"table": "table-5"
		},
		{
			"heading": "z-index",
			"content": "Emitted as `--puzzle-z-index-{key}`."
		},
		{
			"heading": "z-index",
			"content": "| Key    | Default |\n| ------ | ------- |\n| `base` | `0`     |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key        | Default |\n| ---------- | ------- |\n| `dropdown` | `100`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key      | Default |\n| -------- | ------- |\n| `sticky` | `200`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key          | Default |\n| ------------ | ------- |\n| `navigation` | `250`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key       | Default |\n| --------- | ------- |\n| `overlay` | `300`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key     | Default |\n| ------- | ------- |\n| `modal` | `400`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key       | Default |\n| --------- | ------- |\n| `popover` | `500`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key     | Default |\n| ------- | ------- |\n| `toast` | `600`   |",
			"table": "table-6"
		},
		{
			"heading": "z-index",
			"content": "| Key       | Default |\n| --------- | ------- |\n| `tooltip` | `700`   |",
			"table": "table-6"
		},
		{
			"heading": "colors-and-typography",
			"content": "Color scheme tokens are documented on the Colors page, and typography scales and roles on the Typography & Fonts page."
		},
		{
			"heading": "using-tokens-in-css",
			"content": "Reference the variables directly in component styles:"
		},
		{
			"heading": "using-tokens-in-css",
			"content": "Prefer semantic tokens over raw values so your styles respond to theme changes, token overrides, and light/dark mode automatically."
		}
	],
	"headings": [
		{
			"id": "overriding-tokens",
			"content": "Overriding tokens"
		},
		{
			"id": "token-groups",
			"content": "Token groups"
		},
		{
			"id": "spacing",
			"content": "Spacing"
		},
		{
			"id": "radius",
			"content": "Radius"
		},
		{
			"id": "shadows",
			"content": "Shadows"
		},
		{
			"id": "elevation",
			"content": "Elevation"
		},
		{
			"id": "borders",
			"content": "Borders"
		},
		{
			"id": "layout",
			"content": "Layout"
		},
		{
			"id": "breakpoints",
			"content": "Breakpoints"
		},
		{
			"id": "overlays",
			"content": "Overlays"
		},
		{
			"id": "motion",
			"content": "Motion"
		},
		{
			"id": "z-index",
			"content": "Z-index"
		},
		{
			"id": "colors-and-typography",
			"content": "Colors and typography"
		},
		{
			"id": "using-tokens-in-css",
			"content": "Using tokens in CSS"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#overriding-tokens",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Overriding tokens" })
	},
	{
		depth: 2,
		url: "#token-groups",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Token groups" })
	},
	{
		depth: 3,
		url: "#spacing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Spacing" })
	},
	{
		depth: 3,
		url: "#radius",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Radius" })
	},
	{
		depth: 3,
		url: "#shadows",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Shadows" })
	},
	{
		depth: 3,
		url: "#elevation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Elevation" })
	},
	{
		depth: 3,
		url: "#borders",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Borders" })
	},
	{
		depth: 3,
		url: "#layout",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Layout" })
	},
	{
		depth: 3,
		url: "#breakpoints",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Breakpoints" })
	},
	{
		depth: 3,
		url: "#overlays",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Overlays" })
	},
	{
		depth: 3,
		url: "#motion",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Motion" })
	},
	{
		depth: 3,
		url: "#z-index",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Z-index" })
	},
	{
		depth: 3,
		url: "#colors-and-typography",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Colors and typography" })
	},
	{
		depth: 2,
		url: "#using-tokens-in-css",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Using tokens in CSS" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
		h3: "h3",
		p: "p",
		pre: "pre",
		span: "span",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	};
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"All of Puzzle's design values live in a single typed ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ThemeTokens" }),
			" object. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Theme" }),
			" merges your overrides into the defaults and emits every value as a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-*" }),
			" CSS custom property. Components never hardcode design values; they reference these variables."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "overriding-tokens",
			children: "Overriding tokens"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass a deep-partial ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tokens" }),
			" object to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Theme" }),
			". Anything you omit keeps its default. Unknown token names throw a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "TypeError" }),
			", so typos are caught immediately:"
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
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    radius: { md: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"0.5rem\""
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
							children: "    spacing: { "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "4"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"1.125rem\""
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
							children: "    motion: { normal: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"240ms\""
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Every value is validated as a safe CSS value before it is injected." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "token-groups",
			children: "Token groups"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "spacing",
			children: "Spacing"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-space-{key}" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Key" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "px" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1px" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.5" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.125rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.25rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1.5" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.375rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "3" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.75rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "4" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "5" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1.25rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "6" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1.5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "10" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2.5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "12" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "3rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "16" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "4rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "20" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "24" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "6rem" }) })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "radius",
			children: "Radius"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-radius-{key}" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Key" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "none" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.125rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "md" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.375rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "xl" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.75rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2xl" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "3xl" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1.5rem" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "full" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "9999px" }) })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "shadows",
			children: "Shadows"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-shadow-{key}" }),
			" with keys ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "none" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "xs" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "xl" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "elevation",
			children: "Elevation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"A finer-grained elevation scale emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-elevation-{key}" }),
			" with keys ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "2" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "3" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "4" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "6" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "8" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "12" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "16" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "24" }),
			". Use elevation for layered surfaces such as cards, menus, and dialogs."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "borders",
			children: "Borders"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Token" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "borders.width" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-border-width" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1px" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "borders.widthStrong" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-border-width-strong" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2px" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "borders.style" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-border-style" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "solid" }) })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "layout",
			children: "Layout"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Token" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "layout.container" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-container-width" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "80rem" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "layout.content" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-content-width" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "64rem" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "layout.prose" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-prose-width" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "65ch" }) })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"A responsive gutter, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-container-gutter: clamp(2rem, 6vw, 6rem)" }),
			", is provided by the base stylesheet."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "breakpoints",
			children: "Breakpoints"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-breakpoint-{key}" }),
			" with keys ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tablet" }),
			" (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "768px" }),
			"), ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "desktop" }),
			" (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1024px" }),
			"), and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "hd" }),
			" (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1440px" }),
			"). See ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/theme/breakpoints",
				children: "Breakpoints"
			}),
			" for the JavaScript constants."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "overlays",
			children: "Overlays"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Token" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "overlays.backdrop" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-overlay-backdrop" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "rgb(0 0 0 / 0.35)" }) })
		] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "overlays.backdropBlur" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-overlay-backdrop-blur" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "2px" }) })
		] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "motion",
			children: "Motion"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Token" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "CSS variable" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.fast" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-duration-fast" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "120ms" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.normal" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-duration-normal" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "200ms" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.slow" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-duration-slow" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "320ms" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.easingStandard" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-easing-standard" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "cubic-bezier(0.2, 0, 0, 1)" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.easingIn" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-easing-in" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "cubic-bezier(0.4, 0, 1, 1)" }) })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "motion.easingOut" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-easing-out" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "cubic-bezier(0, 0, 0.2, 1)" }) })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "z-index",
			children: "Z-index"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Emitted as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-z-index-{key}" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Key" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Default" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "base" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "dropdown" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "100" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "sticky" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "200" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "navigation" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "250" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "overlay" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "300" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "modal" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "400" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "popover" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "500" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "toast" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "600" }) })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "tooltip" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "700" }) })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "colors-and-typography",
			children: "Colors and typography"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Color scheme tokens are documented on the ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/theme/colors",
				children: "Colors"
			}),
			" page, and typography scales and roles on the ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/theme/typography",
				children: "Typography & Fonts"
			}),
			" page."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "using-tokens-in-css",
			children: "Using tokens in CSS"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Reference the variables directly in component styles:" }),
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: ".my-panel"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " {"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  background"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-color-surface"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  border"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-border-width"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ") "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-border-style"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ")"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "    var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-color-border"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  border-radius"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-radius-lg"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  box-shadow"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-elevation-2"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  padding"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-space-4"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "  transition"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": box-shadow "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-duration-normal"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ")"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "    var"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "--puzzle-easing-standard"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
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
						children: "}"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Prefer semantic tokens over raw values so your styles respond to theme changes, token overrides, and light/dark mode automatically." })
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
