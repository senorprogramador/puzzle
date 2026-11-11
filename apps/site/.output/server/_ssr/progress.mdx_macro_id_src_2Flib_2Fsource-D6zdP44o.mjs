import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/progress.mdx_macro_id_src_2Flib_2Fsource-D6zdP44o.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Progress",
	"description": "Progress indicators show that work is underway, either as a bar or a spinner."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Puzzle provides two progress indicators: LinearProgress for a horizontal bar and CircularProgress for a spinner. Both are determinate when given a `value` and indeterminate when `value` is omitted."
		},
		{
			"heading": "determinate",
			"content": "Pass `value` as a number from `0` to `100`."
		},
		{
			"heading": "indeterminate",
			"content": "Omit `value` when the duration is unknown."
		},
		{
			"heading": "color-and-track",
			"content": "Use `color` to override the primary color with any CSS color value, and `showTrack={false}` to hide the background track."
		},
		{
			"heading": "indeterminate-1",
			"content": "Omit `value` to show a continuously spinning indicator."
		},
		{
			"heading": "size",
			"content": "Use `size` (`sm`, `md`, `lg`) to scale the spinner. The default is `md`."
		},
		{
			"heading": "shared-props",
			"content": "| Prop    | Type     | Default | Description                                                               |\n| ------- | -------- | ------- | ------------------------------------------------------------------------- |\n| `value` | `number` | —       | Progress from `0` to `100`. When omitted, the indicator is indeterminate. |",
			"table": "table-0"
		},
		{
			"heading": "shared-props",
			"content": "| Prop    | Type     | Default                       | Description                           |\n| ------- | -------- | ----------------------------- | ------------------------------------- |\n| `color` | `string` | `var(--puzzle-color-primary)` | CSS color of the indicator and track. |",
			"table": "table-0"
		},
		{
			"heading": "shared-props",
			"content": "| Prop        | Type      | Default | Description                                      |\n| ----------- | --------- | ------- | ------------------------------------------------ |\n| `showTrack` | `boolean` | `true`  | Shows the background track behind the indicator. |",
			"table": "table-0"
		},
		{
			"heading": "linearprogress-props",
			"content": "LinearProgress accepts the shared props and the props of `<div>`, which are passed to the track element. `className` and `style` are merged with the component's own; your `style` takes precedence."
		},
		{
			"heading": "circularprogress-props",
			"content": "| Prop   | Type                   | Default | Description              |\n| ------ | ---------------------- | ------- | ------------------------ |\n| `size` | `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Diameter of the spinner. |",
			"table": "table-1"
		},
		{
			"heading": "circularprogress-props",
			"content": "CircularProgress also accepts the shared props and the props of `<svg>`. Its `aria-label` defaults to `\"Loading...\"`."
		},
		{
			"heading": "typescript-types",
			"content": "The package exports `ProgressProps`, `LinearProgressProps`, `CircularProgressProps`, and `CircularProgressSize`."
		},
		{
			"heading": "theming",
			"content": "Both indicators default to `--puzzle-color-primary`, so they follow light, dark, and scoped themes. Animation is handled in CSS."
		},
		{
			"heading": "accessibility",
			"content": "Both components render `role=\"progressbar\"` with `aria-valuemin=\"0\"` and `aria-valuemax=\"100\"`. Determinate indicators also set `aria-valuenow`; indeterminate ones omit it, as the specification requires."
		},
		{
			"heading": "accessibility",
			"content": "`value` is clamped to `0`–`100`; non-finite values are treated as indeterminate."
		},
		{
			"heading": "accessibility",
			"content": "Always provide an accessible name with `aria-label` or `aria-labelledby`."
		},
		{
			"heading": "accessibility",
			"content": "CircularProgress sets `aria-label=\"Loading...\"` by default; override it with a more specific label, such as the task being performed."
		},
		{
			"heading": "accessibility",
			"content": "For long-running or important operations, also announce completion in a live region so assistive technology users know when work finishes."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "linear-progress",
			"content": "Linear progress"
		},
		{
			"id": "determinate",
			"content": "Determinate"
		},
		{
			"id": "indeterminate",
			"content": "Indeterminate"
		},
		{
			"id": "color-and-track",
			"content": "Color and track"
		},
		{
			"id": "circular-progress",
			"content": "Circular progress"
		},
		{
			"id": "determinate-1",
			"content": "Determinate"
		},
		{
			"id": "indeterminate-1",
			"content": "Indeterminate"
		},
		{
			"id": "size",
			"content": "Size"
		},
		{
			"id": "api-reference",
			"content": "API reference"
		},
		{
			"id": "shared-props",
			"content": "Shared props"
		},
		{
			"id": "linearprogress-props",
			"content": "LinearProgress props"
		},
		{
			"id": "circularprogress-props",
			"content": "CircularProgress props"
		},
		{
			"id": "typescript-types",
			"content": "TypeScript types"
		},
		{
			"id": "theming",
			"content": "Theming"
		},
		{
			"id": "accessibility",
			"content": "Accessibility"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#import",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Import" })
	},
	{
		depth: 2,
		url: "#linear-progress",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Linear progress" })
	},
	{
		depth: 3,
		url: "#determinate",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Determinate" })
	},
	{
		depth: 3,
		url: "#indeterminate",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Indeterminate" })
	},
	{
		depth: 3,
		url: "#color-and-track",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Color and track" })
	},
	{
		depth: 2,
		url: "#circular-progress",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Circular progress" })
	},
	{
		depth: 3,
		url: "#determinate-1",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Determinate" })
	},
	{
		depth: 3,
		url: "#indeterminate-1",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Indeterminate" })
	},
	{
		depth: 3,
		url: "#size",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Size" })
	},
	{
		depth: 2,
		url: "#api-reference",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API reference" })
	},
	{
		depth: 3,
		url: "#shared-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Shared props" })
	},
	{
		depth: 3,
		url: "#linearprogress-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "LinearProgress props" })
	},
	{
		depth: 3,
		url: "#circularprogress-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "CircularProgress props" })
	},
	{
		depth: 3,
		url: "#typescript-types",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "TypeScript types" })
	},
	{
		depth: 2,
		url: "#theming",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Theming" })
	},
	{
		depth: 2,
		url: "#accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility" })
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
	}, { CircularProgress, LinearProgress, Preview } = _components;
	if (!CircularProgress) _missingMdxReference("CircularProgress", true);
	if (!LinearProgress) _missingMdxReference("LinearProgress", true);
	if (!Preview) _missingMdxReference("Preview", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Puzzle provides two progress indicators: LinearProgress for a horizontal bar and CircularProgress for a spinner. Both are determinate when given a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" and indeterminate when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" is omitted."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "import",
			children: "Import"
		}),
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
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
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
						children: " { LinearProgress, CircularProgress } "
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
						children: " \"@puzzle-ui/ui\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: ";"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "linear-progress",
			children: "Linear progress"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "determinate",
			children: "Determinate"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" as a number from ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
			" to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 120,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ width: 280 }}>
    <LinearProgress value={60} aria-label="Upload progress" />
  </div>
`,
			children: (0, import_jsx_runtime.jsx)("div", {
				style: { width: 280 },
				children: (0, import_jsx_runtime.jsx)(LinearProgress, {
					value: 60,
					"aria-label": "Upload progress"
				})
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "indeterminate",
			children: "Indeterminate"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Omit ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" when the duration is unknown."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 120,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ width: 280 }}>
    <LinearProgress aria-label="Loading" />
  </div>
`,
			children: (0, import_jsx_runtime.jsx)("div", {
				style: { width: 280 },
				children: (0, import_jsx_runtime.jsx)(LinearProgress, { "aria-label": "Loading" })
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "color-and-track",
			children: "Color and track"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "color" }),
			" to override the primary color with any CSS color value, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "showTrack={false}" }),
			" to hide the background track."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "grid", gap: 16, width: 280 }}>
    <LinearProgress value={40} color="var(--puzzle-color-danger)" />
    <LinearProgress value={40} showTrack={false} />
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "grid",
					gap: 16,
					width: 280
				},
				children: [(0, import_jsx_runtime.jsx)(LinearProgress, {
					value: 40,
					color: "var(--puzzle-color-danger)"
				}), (0, import_jsx_runtime.jsx)(LinearProgress, {
					value: 40,
					showTrack: false
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "circular-progress",
			children: "Circular progress"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "determinate-1",
			children: "Determinate"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 140,
			align: "center",
			justify: "center",
			code: `\
  <CircularProgress value={75} aria-label="Upload progress" />
`,
			children: (0, import_jsx_runtime.jsx)(CircularProgress, {
				value: 75,
				"aria-label": "Upload progress"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "indeterminate-1",
			children: "Indeterminate"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Omit ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" to show a continuously spinning indicator."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 140,
			align: "center",
			justify: "center",
			code: `\
  <CircularProgress />
`,
			children: (0, import_jsx_runtime.jsx)(CircularProgress, {})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "size",
			children: "Size"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "size" }),
			" (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }),
			") to scale the spinner. The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 140,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <CircularProgress size="sm" />
    <CircularProgress size="md" />
    <CircularProgress size="lg" />
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 24
				},
				children: [
					(0, import_jsx_runtime.jsx)(CircularProgress, { size: "sm" }),
					(0, import_jsx_runtime.jsx)(CircularProgress, { size: "md" }),
					(0, import_jsx_runtime.jsx)(CircularProgress, { size: "lg" })
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api-reference",
			children: "API reference"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "shared-props",
			children: "Shared props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Progress from ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
					" to ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
					". When omitted, the indicator is indeterminate."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "color" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "var(--puzzle-color-primary)" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "CSS color of the indicator and track." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "showTrack" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Shows the background track behind the indicator." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "linearprogress-props",
			children: "LinearProgress props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"LinearProgress accepts the shared props and the props of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<div>" }),
			", which are passed to the track element. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			" are merged with the component's own; your ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			" takes precedence."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "circularprogress-props",
			children: "CircularProgress props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsx)(_components.tbody, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "Diameter of the spinner." })
		] }) })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"CircularProgress also accepts the shared props and the props of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<svg>" }),
			". Its ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			" defaults to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"Loading...\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The package exports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ProgressProps" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "LinearProgressProps" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CircularProgressProps" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CircularProgressSize" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "theming",
			children: "Theming"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Both indicators default to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-primary" }),
			", so they follow light, dark, and scoped themes. Animation is handled in CSS."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Both components render ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"progressbar\"" }),
				" with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuemin=\"0\"" }),
				" and ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuemax=\"100\"" }),
				". Determinate indicators also set ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuenow" }),
				"; indeterminate ones omit it, as the specification requires."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
				" is clamped to ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
				"–",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
				"; non-finite values are treated as indeterminate."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Always provide an accessible name with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"CircularProgress sets ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label=\"Loading...\"" }),
				" by default; override it with a more specific label, such as the task being performed."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "For long-running or important operations, also announce completion in a live region so assistive technology users know when work finishes." }),
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
export { MDXContent as default, frontmatter, structuredData, toc };
