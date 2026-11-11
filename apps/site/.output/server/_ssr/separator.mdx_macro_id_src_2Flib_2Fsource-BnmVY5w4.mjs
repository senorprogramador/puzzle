import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/separator.mdx_macro_id_src_2Flib_2Fsource-BnmVY5w4.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Separator",
	"description": "Visually divide content into distinct sections with horizontal or vertical separators."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "The Separator component provides a subtle visual boundary between content and groups of elements."
		},
		{
			"heading": void 0,
			"content": "It supports horizontal and vertical orientations and can be either decorative or semantically meaningful."
		},
		{
			"heading": "basic-usage",
			"content": "Use a horizontal separator to divide sections of content."
		},
		{
			"heading": "basic-usage",
			"content": "Account details"
		},
		{
			"heading": "basic-usage",
			"content": "Security settings"
		},
		{
			"heading": "basic-usage",
			"content": "The default orientation is horizontal."
		},
		{
			"heading": "orientation",
			"content": "Use the `orientation` prop to control the direction of the separator."
		},
		{
			"heading": "orientation",
			"content": "`horizontal`: spans the available width."
		},
		{
			"heading": "orientation",
			"content": "`vertical`: spans the available height."
		},
		{
			"heading": "orientation",
			"content": "Overview"
		},
		{
			"heading": "orientation",
			"content": "Settings"
		},
		{
			"heading": "orientation",
			"content": "Activity"
		},
		{
			"heading": "orientation",
			"content": "Vertical separators inherit their height from their containing element. Make sure the parent has a defined height."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "By default, separators are decorative."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "Decorative separators use `role=\"none\"` and are excluded from the accessibility tree."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "Use `decorative={false}` when the separator communicates a meaningful structural boundary."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "Semantic separators expose `role=\"separator\"` to assistive technology."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "Vertical semantic separators additionally expose `aria-orientation=\"vertical\"`."
		},
		{
			"heading": "decorative-and-semantic-separators",
			"content": "Horizontal separators use the implicit horizontal orientation."
		},
		{
			"heading": "props",
			"content": "| Prop          | Type                         | Default        | Description                   |\n| ------------- | ---------------------------- | -------------- | ----------------------------- |\n| `orientation` | `\"horizontal\" \\| \"vertical\"` | `\"horizontal\"` | Orientation of the separator. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop         | Type      | Default | Description                             |\n| ------------ | --------- | ------- | --------------------------------------- |\n| `decorative` | `boolean` | `true`  | Whether the separator is purely visual. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type     | Default | Description             |\n| ----------- | -------- | ------- | ----------------------- |\n| `className` | `string` | -       | Additional CSS classes. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "All standard HTML `div` attributes are supported, including:"
		},
		{
			"heading": "props",
			"content": "`id`"
		},
		{
			"heading": "props",
			"content": "`title`"
		},
		{
			"heading": "props",
			"content": "`style`"
		},
		{
			"heading": "props",
			"content": "`data-*`"
		},
		{
			"heading": "props",
			"content": "`aria-*`"
		},
		{
			"heading": "props",
			"content": "`ref`"
		},
		{
			"heading": "props",
			"content": "The component does not accept children."
		},
		{
			"heading": "accessibility",
			"content": "The Separator component follows the WAI-ARIA separator semantics."
		},
		{
			"heading": "decorative-separators",
			"content": "Decorative separators:"
		},
		{
			"heading": "decorative-separators",
			"content": "Use `role=\"none\"`."
		},
		{
			"heading": "decorative-separators",
			"content": "Are excluded from the accessibility tree."
		},
		{
			"heading": "decorative-separators",
			"content": "Do not introduce unnecessary announcements for screen reader users."
		},
		{
			"heading": "decorative-separators",
			"content": "This is the default behavior."
		},
		{
			"heading": "semantic-separators",
			"content": "When `decorative={false}`:"
		},
		{
			"heading": "semantic-separators",
			"content": "The component exposes `role=\"separator\"`."
		},
		{
			"heading": "semantic-separators",
			"content": "Horizontal separators use the implicit horizontal orientation."
		},
		{
			"heading": "semantic-separators",
			"content": "Vertical separators expose `aria-orientation=\"vertical\"`."
		},
		{
			"heading": "layout-considerations",
			"content": "A separator is not an interactive element."
		},
		{
			"heading": "layout-considerations",
			"content": "It does not receive keyboard focus and does not implement keyboard interaction."
		},
		{
			"heading": "layout-considerations",
			"content": "For vertical separators, ensure that the containing element provides a meaningful height."
		},
		{
			"heading": "theming",
			"content": "The Separator uses the following Puzzle theme tokens:"
		},
		{
			"heading": "theming",
			"content": "| Token                   | Purpose         |\n| ----------------------- | --------------- |\n| `--puzzle-color-border` | Separator color |",
			"table": "table-1"
		},
		{
			"heading": "theming",
			"content": "| Token                   | Purpose             |\n| ----------------------- | ------------------- |\n| `--puzzle-border-width` | Separator thickness |",
			"table": "table-1"
		},
		{
			"heading": "theming",
			"content": "The component automatically follows light, dark, and scoped themes."
		},
		{
			"heading": "theming",
			"content": "There are no component-specific color variants or hardcoded colors."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "basic-usage",
			"content": "Basic usage"
		},
		{
			"id": "orientation",
			"content": "Orientation"
		},
		{
			"id": "decorative-and-semantic-separators",
			"content": "Decorative and semantic separators"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "props",
			"content": "Props"
		},
		{
			"id": "accessibility",
			"content": "Accessibility"
		},
		{
			"id": "decorative-separators",
			"content": "Decorative separators"
		},
		{
			"id": "semantic-separators",
			"content": "Semantic separators"
		},
		{
			"id": "layout-considerations",
			"content": "Layout considerations"
		},
		{
			"id": "theming",
			"content": "Theming"
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
		url: "#basic-usage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Basic usage" })
	},
	{
		depth: 2,
		url: "#orientation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Orientation" })
	},
	{
		depth: 2,
		url: "#decorative-and-semantic-separators",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Decorative and semantic separators" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Props" })
	},
	{
		depth: 2,
		url: "#accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility" })
	},
	{
		depth: 3,
		url: "#decorative-separators",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Decorative separators" })
	},
	{
		depth: 3,
		url: "#semantic-separators",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Semantic separators" })
	},
	{
		depth: 3,
		url: "#layout-considerations",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Layout considerations" })
	},
	{
		depth: 2,
		url: "#theming",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Theming" })
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
	}, { Preview, Separator, Stack } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Separator) _missingMdxReference("Separator", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Separator component provides a subtle visual boundary between content and groups of elements." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "It supports horizontal and vertical orientations and can be either decorative or semantically meaningful." }),
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
						children: " { Separator } "
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
			id: "basic-usage",
			children: "Basic usage"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use a horizontal separator to divide sections of content." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 180,
			align: "center",
			justify: "center",
			code: `\
<Stack gap="md">
<div>Account details</div>
<Separator />
<div>Security settings</div>
</Stack>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				gap: "md",
				style: {
					width: "100%",
					maxWidth: 320
				},
				children: [
					(0, import_jsx_runtime.jsx)("div", { children: "Account details" }),
					(0, import_jsx_runtime.jsx)(Separator, {}),
					(0, import_jsx_runtime.jsx)("div", { children: "Security settings" })
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The default orientation is horizontal." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "orientation",
			children: "Orientation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }),
			" prop to control the direction of the separator."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "horizontal" }), ": spans the available width."] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "vertical" }), ": spans the available height."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
<Stack direction="row" alignV="center" gap="md" style={{ height: 64 }}>
<span>Overview</span>
<Separator orientation="vertical" />
<span>Settings</span>
<Separator orientation="vertical" />
<span>Activity</span>
</Stack>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				alignV: "center",
				gap: "md",
				style: { height: 64 },
				children: [
					(0, import_jsx_runtime.jsx)("span", { children: "Overview" }),
					(0, import_jsx_runtime.jsx)(Separator, { orientation: "vertical" }),
					(0, import_jsx_runtime.jsx)("span", { children: "Settings" }),
					(0, import_jsx_runtime.jsx)(Separator, { orientation: "vertical" }),
					(0, import_jsx_runtime.jsx)("span", { children: "Activity" })
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Vertical separators inherit their height from their containing element. Make sure the parent has a defined height." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "decorative-and-semantic-separators",
			children: "Decorative and semantic separators"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "By default, separators are decorative." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Decorative separators use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"none\"" }),
			" and are excluded from the accessibility tree."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "decorative={false}" }),
			" when the separator communicates a meaningful structural boundary."
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
							children: "Separator"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " decorative"
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
							children: "{"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "false"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "} />"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
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
						children: "Separator"
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
							children: "  orientation"
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
							children: "\"vertical\""
						})
					]
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
							children: "  decorative"
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
							children: "{"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "false"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "}"
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
						children: "/>"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Semantic separators expose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"separator\"" }),
			" to assistive technology."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Vertical semantic separators additionally expose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-orientation=\"vertical\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Horizontal separators use the implicit horizontal orientation." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "props",
			children: "Props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\" | \"vertical\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Orientation of the separator." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "decorative" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Whether the separator is purely visual." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional CSS classes." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"All standard HTML ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "div" }),
			" attributes are supported, including:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "style" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "data-*" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-*" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The component does not accept children." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Separator component follows the WAI-ARIA separator semantics." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "decorative-separators",
			children: "Decorative separators"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Decorative separators:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"none\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Are excluded from the accessibility tree." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Do not introduce unnecessary announcements for screen reader users." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This is the default behavior." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "semantic-separators",
			children: "Semantic separators"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "decorative={false}" }),
			":"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The component exposes ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"separator\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Horizontal separators use the implicit horizontal orientation." }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Vertical separators expose ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-orientation=\"vertical\"" }),
				"."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "layout-considerations",
			children: "Layout considerations"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A separator is not an interactive element." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "It does not receive keyboard focus and does not implement keyboard interaction." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For vertical separators, ensure that the containing element provides a meaningful height." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "theming",
			children: "Theming"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Separator uses the following Puzzle theme tokens:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Token" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Purpose" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-border" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Separator color" })] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-border-width" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Separator thickness" })] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The component automatically follows light, dark, and scoped themes." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "There are no component-specific color variants or hardcoded colors." })
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
