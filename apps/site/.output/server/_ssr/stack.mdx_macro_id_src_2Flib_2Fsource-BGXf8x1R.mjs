import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/stack.mdx_macro_id_src_2Flib_2Fsource-BGXf8x1R.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Stack",
	"description": "Arrange elements with token-based spacing and responsive direction."
};
var structuredData = {
	"contents": [
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "Stack defaults to a column. Alignment maps to CSS properties according to the\ncurrent direction:"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "| Direction | `alignH`      | `alignV`          |\n| --------- | ------------- | ----------------- |\n| `col`     | `align-items` | `justify-content` |",
			"table": "table-0"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "| Direction | `alignH`          | `alignV`      |\n| --------- | ----------------- | ------------- |\n| `row`     | `justify-content` | `align-items` |",
			"table": "table-0"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "Resize the preview to see a responsive column become a row."
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "First"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "Second"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "One"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "Two"
		},
		{
			"heading": "direction-alignment-and-wrapping",
			"content": "Three"
		},
		{
			"heading": "api",
			"content": "| Prop | Type          | Default | Description   |\n| ---- | ------------- | ------- | ------------- |\n| `as` | `ElementType` | `\"div\"` | Root element. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type                                  | Default | Description       |\n| ----------- | ------------------------------------- | ------- | ----------------- |\n| `direction` | `\"row\" \\| \"col\"` or responsive object | `\"col\"` | Layout direction. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop  | Type                                          | Default | Description          |\n| ----- | --------------------------------------------- | ------- | -------------------- |\n| `gap` | `\"0\" \\| \"xs\" \\| \"sm\" \\| \"md\" \\| \"lg\" \\| \"xl\"` | `\"md\"`  | Theme spacing scale. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type                     | Default | Description                                         |\n| ------------------ | ------------------------ | ------- | --------------------------------------------------- |\n| `alignH`, `alignV` | Axis-dependent alignment | -       | Alignment mapped by direction; see the table above. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type                                   | Default    | Description    |\n| ------ | -------------------------------------- | ---------- | -------------- |\n| `wrap` | `\"wrap\" \\| \"nowrap\" \\| \"wrap-reverse\"` | `\"nowrap\"` | Flex wrapping. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop      | Type      | Default | Description               |\n| --------- | --------- | ------- | ------------------------- |\n| `reverse` | `boolean` | `false` | Reverse visual direction. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "| Prop      | Type        | Default | Description                        |\n| --------- | ----------- | ------- | ---------------------------------- |\n| `divider` | `ReactNode` | -       | Content inserted between children. |",
			"table": "table-1"
		},
		{
			"heading": "api",
			"content": "Main-axis alignment accepts `start`, `center`, `end`, `stretch`, `around`, `between`, `evenly`; cross-axis alignment accepts `start`, `center`, `end`, `stretch`. Native props are forwarded. Reversing visual order does not change DOM/keyboard order."
		},
		{
			"heading": "api",
			"content": "Both `alignH` and `alignV` also accept responsive objects, such as\n`alignH={{ mobile: \"start\", tablet: \"center\", desktop: \"end\" }}`.\nEach prop changes independently of `direction` and inherits its last specified\nvalue at larger breakpoints. When direction changes, the mapping to\n`justify-content` and `align-items` changes with it. Distribution values\n(`around`, `between`, `evenly`) belong to `alignH` in rows and `alignV` in columns;\nuse cross-axis values at breakpoints where a prop maps to `align-items`."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "direction-alignment-and-wrapping",
			"content": "Direction, alignment, and wrapping"
		},
		{
			"id": "api",
			"content": "API"
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
		url: "#direction-alignment-and-wrapping",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Direction, alignment, and wrapping" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
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
	}, { Button, Preview, Section, Stack } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
						children: " { Stack } "
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
			id: "direction-alignment-and-wrapping",
			children: "Direction, alignment, and wrapping"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Stack defaults to a column. Alignment maps to CSS properties according to the\ncurrent direction:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Direction" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "alignH" }) }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "alignV" }) })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "col" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "align-items" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "justify-content" }) })
		] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "row" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "justify-content" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "align-items" }) })
		] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Resize the preview to see a responsive column become a row." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 400,
			code: `\
<Stack>
<Stack direction={{ mobile: "col", tablet: "row", desktop: "row" }} gap="lg" alignH="center">
  <Button>First</Button><Button variant="outline">Second</Button>
</Stack>
<Stack direction="row" wrap="wrap" gap="sm" alignV="center">
  <Button>One</Button><Button>Two</Button><Button>Three</Button>
</Stack>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsxs)(Stack, {
				direction: {
					mobile: "col",
					tablet: "row",
					desktop: "row"
				},
				gap: "lg",
				alignH: "center",
				children: [(0, import_jsx_runtime.jsx)(Button, { children: "First" }), (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Second"
				})]
			}), (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				wrap: "wrap",
				gap: "sm",
				alignV: "center",
				children: [
					(0, import_jsx_runtime.jsx)(Button, { children: "One" }),
					(0, import_jsx_runtime.jsx)(Button, { children: "Two" }),
					(0, import_jsx_runtime.jsx)(Button, { children: "Three" })
				]
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "as" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ElementType" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"div\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Root element." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "direction" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "\"row\" | \"col\"" }), " or responsive object"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"col\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Layout direction." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "gap" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"0\" | \"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Theme spacing scale." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "alignH" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "alignV" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Axis-dependent alignment" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Alignment mapped by direction; see the table above." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "wrap" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"wrap\" | \"nowrap\" | \"wrap-reverse\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"nowrap\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Flex wrapping." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "reverse" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Reverse visual direction." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "divider" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content inserted between children." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Main-axis alignment accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "start" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "center" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "end" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "stretch" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "around" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "between" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "evenly" }),
			"; cross-axis alignment accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "start" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "center" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "end" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "stretch" }),
			". Native props are forwarded. Reversing visual order does not change DOM/keyboard order."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Both ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "alignH" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "alignV" }),
			" also accept responsive objects, such as\n",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "alignH={{ mobile: \"start\", tablet: \"center\", desktop: \"end\" }}" }),
			".\nEach prop changes independently of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "direction" }),
			" and inherits its last specified\nvalue at larger breakpoints. When direction changes, the mapping to\n",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "justify-content" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align-items" }),
			" changes with it. Distribution values\n(",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "around" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "between" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "evenly" }),
			") belong to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "alignH" }),
			" in rows and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "alignV" }),
			" in columns;\nuse cross-axis values at breakpoints where a prop maps to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align-items" }),
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
export { MDXContent as default, frontmatter, structuredData, toc };
