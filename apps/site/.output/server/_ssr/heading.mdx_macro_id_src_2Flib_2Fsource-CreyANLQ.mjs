import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/heading.mdx_macro_id_src_2Flib_2Fsource-CreyANLQ.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Heading",
	"description": "Apply theme heading styles independently of semantic level."
};
var structuredData = {
	"contents": [
		{
			"heading": "visual-and-semantic-hierarchy",
			"content": "`level` selects typography; `as` selects the HTML heading level. The default element is always `h2`, regardless of visual style."
		},
		{
			"heading": "visual-and-semantic-hierarchy",
			"content": "Page title"
		},
		{
			"heading": "visual-and-semantic-hierarchy",
			"content": "Section title"
		},
		{
			"heading": "visual-and-semantic-hierarchy",
			"content": "Subsection title"
		},
		{
			"heading": "visual-and-semantic-hierarchy",
			"content": "Supporting title"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type                                                                                   | Default  | Description            |\n| ------- | -------------------------------------------------------------------------------------- | -------- | ---------------------- |\n| `level` | `\"display1\" \\| \"display2\" \\| \"headline1\" \\| \"headline2\" \\| \"headline3\" \\| \"headline4\"` | Required | Theme typography role. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop | Type          | Default | Description       |\n| ---- | ------------- | ------- | ----------------- |\n| `as` | `ElementType` | `\"h2\"`  | Semantic element. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type        | Default | Description      |\n| ---------- | ----------- | ------- | ---------------- |\n| `children` | `ReactNode` | -       | Heading content. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "Native attributes, styles, classes, and refs for the chosen element are forwarded. Follow a logical heading hierarchy; do not choose semantic levels solely for appearance. Responsive typography comes from the active theme."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "visual-and-semantic-hierarchy",
			"content": "Visual and semantic hierarchy"
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
		url: "#visual-and-semantic-hierarchy",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Visual and semantic hierarchy" })
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
	}, { Heading, Preview, Section, Stack } = _components;
	if (!Heading) _missingMdxReference("Heading", true);
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
						children: " { Heading } "
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
			id: "visual-and-semantic-hierarchy",
			children: "Visual and semantic hierarchy"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "level" }),
			" selects typography; ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			" selects the HTML heading level. The default element is always ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "h2" }),
			", regardless of visual style."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 450,
			code: `\
<Stack>
<Heading as="h1" level="headline1">Page title</Heading>
<Heading as="h2" level="headline2">Section title</Heading>
<Heading as="h3" level="headline3">Subsection title</Heading>
<Heading as="h4" level="headline4">Supporting title</Heading>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsx)(Heading, {
					as: "h1",
					level: "headline1",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Page title" })
				}),
				(0, import_jsx_runtime.jsx)(Heading, {
					as: "h2",
					level: "headline2",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Section title" })
				}),
				(0, import_jsx_runtime.jsx)(Heading, {
					as: "h3",
					level: "headline3",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Subsection title" })
				}),
				(0, import_jsx_runtime.jsx)(Heading, {
					as: "h4",
					level: "headline4",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Supporting title" })
				})
			] }) })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "level" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"display1\" | \"display2\" | \"headline1\" | \"headline2\" | \"headline3\" | \"headline4\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Theme typography role." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "as" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ElementType" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"h2\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Semantic element." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Heading content." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Native attributes, styles, classes, and refs for the chosen element are forwarded. Follow a logical heading hierarchy; do not choose semantic levels solely for appearance. Responsive typography comes from the active theme." })
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
