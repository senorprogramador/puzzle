import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/paper.mdx_macro_id_src_2Flib_2Fsource-PHFHNVq-.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Paper",
	"description": "Paper is a basic surface that lifts content off the page with a configurable elevation."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Use the Paper component as a neutral surface when you need an elevated container without the structure of a Card."
		},
		{
			"heading": "basic-usage",
			"content": "Content on a paper surface"
		},
		{
			"heading": "basic-usage",
			"content": "Paper has no built-in padding, so add spacing yourself."
		},
		{
			"heading": "elevation",
			"content": "Use `elevation` to control the shadow depth. Available levels are `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, and `24`. The default is `1`."
		},
		{
			"heading": "elevation",
			"content": "1"
		},
		{
			"heading": "elevation",
			"content": "4"
		},
		{
			"heading": "elevation",
			"content": "8"
		},
		{
			"heading": "elevation",
			"content": "24"
		},
		{
			"heading": "rendering-a-different-element",
			"content": "Use `as` to render semantic HTML, such as `section` or `aside`."
		},
		{
			"heading": "paper-props",
			"content": "| Prop | Type          | Default | Description                            |\n| ---- | ------------- | ------- | -------------------------------------- |\n| `as` | `ElementType` | `\"div\"` | Element type used to render the paper. |",
			"table": "table-0"
		},
		{
			"heading": "paper-props",
			"content": "| Prop        | Type                                           | Default | Description   |\n| ----------- | ---------------------------------------------- | ------- | ------------- |\n| `elevation` | `1 \\| 2 \\| 3 \\| 4 \\| 6 \\| 8 \\| 12 \\| 16 \\| 24` | `1`     | Shadow depth. |",
			"table": "table-0"
		},
		{
			"heading": "paper-props",
			"content": "| Prop        | Type     | Default | Description                 |\n| ----------- | -------- | ------- | --------------------------- |\n| `className` | `string` | —       | Additional CSS class names. |",
			"table": "table-0"
		},
		{
			"heading": "paper-props",
			"content": "| Prop       | Type        | Default | Description                         |\n| ---------- | ----------- | ------- | ----------------------------------- |\n| `children` | `ReactNode` | —       | Content displayed inside the paper. |",
			"table": "table-0"
		},
		{
			"heading": "element-props",
			"content": "Paper accepts the props of the element selected by `as`, passed through to it."
		},
		{
			"heading": "typescript-types",
			"content": "The component exports `PaperProps<C extends ElementType>`. The generic follows the element selected by `as`."
		},
		{
			"heading": "accessibility",
			"content": "Paper is purely presentational and adds no role or semantics. Choose a semantic element with `as` when the surface represents a landmark, and provide an accessible name where needed."
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
			"id": "elevation",
			"content": "Elevation"
		},
		{
			"id": "rendering-a-different-element",
			"content": "Rendering a different element"
		},
		{
			"id": "api-reference",
			"content": "API reference"
		},
		{
			"id": "paper-props",
			"content": "Paper props"
		},
		{
			"id": "element-props",
			"content": "Element props"
		},
		{
			"id": "typescript-types",
			"content": "TypeScript types"
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
		url: "#basic-usage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Basic usage" })
	},
	{
		depth: 2,
		url: "#elevation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Elevation" })
	},
	{
		depth: 2,
		url: "#rendering-a-different-element",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Rendering a different element" })
	},
	{
		depth: 2,
		url: "#api-reference",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API reference" })
	},
	{
		depth: 3,
		url: "#paper-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Paper props" })
	},
	{
		depth: 3,
		url: "#element-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Element props" })
	},
	{
		depth: 3,
		url: "#typescript-types",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "TypeScript types" })
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
	}, { Paper, Preview } = _components;
	if (!Paper) _missingMdxReference("Paper", true);
	if (!Preview) _missingMdxReference("Preview", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the Paper component as a neutral surface when you need an elevated container without the structure of a Card." }),
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
						children: " { Paper } "
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
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
  <Paper style={{ padding: 24 }}>Content on a paper surface</Paper>
`,
			children: (0, import_jsx_runtime.jsx)(Paper, {
				style: { padding: 24 },
				children: "Content on a paper surface"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Paper has no built-in padding, so add spacing yourself." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "elevation",
			children: "Elevation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "elevation" }),
			" to control the shadow depth. Available levels are ",
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
			". The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
    <Paper elevation={1} style={{ padding: 24 }}>1</Paper>
    <Paper elevation={4} style={{ padding: 24 }}>4</Paper>
    <Paper elevation={8} style={{ padding: 24 }}>8</Paper>
    <Paper elevation={24} style={{ padding: 24 }}>24</Paper>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexWrap: "wrap",
					gap: 24
				},
				children: [
					(0, import_jsx_runtime.jsx)(Paper, {
						elevation: 1,
						style: { padding: 24 },
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "1" })
					}),
					(0, import_jsx_runtime.jsx)(Paper, {
						elevation: 4,
						style: { padding: 24 },
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "4" })
					}),
					(0, import_jsx_runtime.jsx)(Paper, {
						elevation: 8,
						style: { padding: 24 },
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "8" })
					}),
					(0, import_jsx_runtime.jsx)(Paper, {
						elevation: 24,
						style: { padding: 24 },
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "24" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "rendering-a-different-element",
			children: "Rendering a different element"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			" to render semantic HTML, such as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "section" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aside" }),
			"."
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
							children: "Paper"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " as"
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
							children: "\"aside\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " aria-label"
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
							children: "\"Tips\""
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
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  Remember to save your work."
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
							children: "</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Paper"
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
			id: "api-reference",
			children: "API reference"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "paper-props",
			children: "Paper props"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Element type used to render the paper." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "elevation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Shadow depth." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional CSS class names." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content displayed inside the paper." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "element-props",
			children: "Element props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Paper accepts the props of the element selected by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			", passed through to it."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component exports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "PaperProps<C extends ElementType>" }),
			". The generic follows the element selected by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Paper is purely presentational and adds no role or semantics. Choose a semantic element with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			" when the surface represents a landmark, and provide an accessible name where needed."
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
