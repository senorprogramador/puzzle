import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/badge.mdx_macro_id_src_2Flib_2Fsource-BywwGBWb.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Badge",
	"description": "Badges attach a small count, label, or status indicator to another element."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Use the Badge component to annotate an element, such as an avatar or icon, with a count or status. Badge wraps its children and positions the indicator on a corner."
		},
		{
			"heading": void 0,
			"content": "Without children, Badge renders as an inline label. `anchorOrigin` and\n`anchorOverlap` and `anchorOffset` apply only when the badge wraps an element. Text stays on one\nline, and the indicator grows to fit its content with padding."
		},
		{
			"heading": "basic-usage",
			"content": "Pass the indicator through `content` and the element to annotate as `children`."
		},
		{
			"heading": "basic-usage",
			"content": "Inbox"
		},
		{
			"heading": "color",
			"content": "Use `color` with a theme role (`primary`, `secondary`, `accent`, `danger`, `info`) or any hex value. For hex colors, the text color is chosen automatically for contrast. The default is `primary`."
		},
		{
			"heading": "size",
			"content": "Use `size` to set the minimum width and height of the badge in pixels. The default is `20`; values below `16` are raised to `16`. The font size scales with it."
		},
		{
			"heading": "position-and-overlap",
			"content": "Use `anchorOrigin` to choose the corner (`vertical`: `top` | `bottom`, `horizontal`: `left` | `right`). The default is top right. Set `anchorOverlap=\"circular\"` when the child is round so the badge sits on the curve instead of the bounding-box corner."
		},
		{
			"heading": "anchor-offset",
			"content": "Use `anchorOffset={{ vertical: 8, horizontal: 12 }}` to move the indicator\nin pixels from its normal anchor position. Positive values move inward from\nthe selected corner; negative values move outward. The default is zero on\nboth axes. Offsets work with rectangular and circular overlap and are ignored\nfor standalone labels."
		},
		{
			"heading": "badge-props",
			"content": "| Prop      | Type        | Default | Description                                      |\n| --------- | ----------- | ------- | ------------------------------------------------ |\n| `content` | `ReactNode` | —       | Content of the badge, such as a count. Required. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop   | Type     | Default | Description                                                        |\n| ------ | -------- | ------- | ------------------------------------------------------------------ |\n| `size` | `number` | `20`    | Minimum width and height in pixels. Values below `16` become `16`. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop    | Type         | Default     | Description                                                                            |\n| ------- | ------------ | ----------- | -------------------------------------------------------------------------------------- |\n| `color` | `BadgeColor` | `\"primary\"` | `primary`, `secondary`, `accent`, `danger`, `info`, or a hex string such as `#7c3aed`. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop           | Type                                                             | Default                                    | Description                       |\n| -------------- | ---------------------------------------------------------------- | ------------------------------------------ | --------------------------------- |\n| `anchorOrigin` | `{ vertical: \"top\" \\| \"bottom\"; horizontal: \"left\" \\| \"right\" }` | `{ vertical: \"top\", horizontal: \"right\" }` | Corner where the badge is placed. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop           | Type                                       | Default                          | Description                                                    |\n| -------------- | ------------------------------------------ | -------------------------------- | -------------------------------------------------------------- |\n| `anchorOffset` | `{ vertical: number; horizontal: number }` | `{ vertical: 0, horizontal: 0 }` | Finite pixel offsets; positive moves inward, negative outward. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop            | Type                          | Default         | Description                                           |\n| --------------- | ----------------------------- | --------------- | ----------------------------------------------------- |\n| `anchorOverlap` | `\"rectangular\" \\| \"circular\"` | `\"rectangular\"` | Positioning relative to a rectangular or round child. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop        | Type     | Default | Description                                |\n| ----------- | -------- | ------- | ------------------------------------------ |\n| `className` | `string` | —       | Additional CSS class names on the wrapper. |",
			"table": "table-0"
		},
		{
			"heading": "badge-props",
			"content": "| Prop       | Type        | Default | Description                       |\n| ---------- | ----------- | ------- | --------------------------------- |\n| `children` | `ReactNode` | —       | Element the badge is attached to. |",
			"table": "table-0"
		},
		{
			"heading": "typescript-types",
			"content": "The component exports `BadgeProps`, `BadgeColor`, `AnchorOrigin`, `AnchorOffset` and `AnchorOverlap`."
		},
		{
			"heading": "theming",
			"content": "Role colors use the `--puzzle-color-<role>` and `--puzzle-color-<role>-foreground` tokens, so badges follow light, dark, and scoped themes. The default palette uses distinct colors for each role; custom themes can choose their own. Hex colors bypass the theme."
		},
		{
			"heading": "accessibility",
			"content": "Badge does not add any ARIA semantics. Screen readers read `content` as plain text next to the child, so for status dots or ambiguous counts, convey the meaning in the child's accessible name (for example `aria-label=\"Inbox, 4 unread\"`)."
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
			"id": "color",
			"content": "Color"
		},
		{
			"id": "size",
			"content": "Size"
		},
		{
			"id": "position-and-overlap",
			"content": "Position and overlap"
		},
		{
			"id": "anchor-offset",
			"content": "Anchor offset"
		},
		{
			"id": "api-reference",
			"content": "API reference"
		},
		{
			"id": "badge-props",
			"content": "Badge props"
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
		url: "#basic-usage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Basic usage" })
	},
	{
		depth: 2,
		url: "#color",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Color" })
	},
	{
		depth: 2,
		url: "#size",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Size" })
	},
	{
		depth: 2,
		url: "#position-and-overlap",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Position and overlap" })
	},
	{
		depth: 2,
		url: "#anchor-offset",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Anchor offset" })
	},
	{
		depth: 2,
		url: "#api-reference",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API reference" })
	},
	{
		depth: 3,
		url: "#badge-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Badge props" })
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
	}, { Avatar, Badge, Button, Preview } = _components;
	if (!Avatar) _missingMdxReference("Avatar", true);
	if (!Badge) _missingMdxReference("Badge", true);
	if (!Button) _missingMdxReference("Button", true);
	if (!Preview) _missingMdxReference("Preview", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the Badge component to annotate an element, such as an avatar or icon, with a count or status. Badge wraps its children and positions the indicator on a corner." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Without children, Badge renders as an inline label. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOrigin" }),
			" and\n",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOverlap" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOffset" }),
			" apply only when the badge wraps an element. Text stays on one\nline, and the indicator grows to fit its content with padding."
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
						children: " { Badge } "
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
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass the indicator through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "content" }),
			" and the element to annotate as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
  <Badge content="4">
    <Button variant="secondary">Inbox</Button>
  </Badge>
`,
			children: (0, import_jsx_runtime.jsx)(Badge, {
				content: "4",
				children: (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					children: "Inbox"
				})
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "color",
			children: "Color"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "color" }),
			" with a theme role (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "secondary" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "accent" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "danger" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "info" }),
			") or any hex value. For hex colors, the text color is chosen automatically for contrast. The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", gap: 24 }}>
    <Badge content="1" color="primary"><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="2" color="secondary"><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="3" color="accent"><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="4" color="danger"><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="5" color="info"><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="6" color="#7c3aed"><Avatar alt="Ada Lovelace" /></Badge>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: 24
				},
				children: [
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "1",
						color: "primary",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "2",
						color: "secondary",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "3",
						color: "accent",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "4",
						color: "danger",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "5",
						color: "info",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "6",
						color: "#7c3aed",
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "size",
			children: "Size"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "size" }),
			" to set the minimum width and height of the badge in pixels. The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "20" }),
			"; values below ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "16" }),
			" are raised to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "16" }),
			". The font size scales with it."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", gap: 24 }}>
    <Badge content="" size={16}><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="9" size={20}><Avatar alt="Ada Lovelace" /></Badge>
    <Badge content="99+" size={28}><Avatar alt="Ada Lovelace" /></Badge>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: 24
				},
				children: [
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "",
						size: 16,
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "9",
						size: 20,
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					}),
					(0, import_jsx_runtime.jsx)(Badge, {
						content: "99+",
						size: 28,
						children: (0, import_jsx_runtime.jsx)(Avatar, { alt: "Ada Lovelace" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "position-and-overlap",
			children: "Position and overlap"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOrigin" }),
			" to choose the corner (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "vertical" }),
			": ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "top" }),
			" | ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "bottom" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "horizontal" }),
			": ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "left" }),
			" | ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "right" }),
			"). The default is top right. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOverlap=\"circular\"" }),
			" when the child is round so the badge sits on the curve instead of the bounding-box corner."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", gap: 24 }}>
    <Badge content="1" anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
      <Avatar alt="Ada Lovelace" size={48} shape="square" />
    </Badge>
    <Badge content="2" anchorOverlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Avatar alt="Ada Lovelace" size={48} />
    </Badge>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: 24
				},
				children: [(0, import_jsx_runtime.jsx)(Badge, {
					content: "1",
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "left"
					},
					children: (0, import_jsx_runtime.jsx)(Avatar, {
						alt: "Ada Lovelace",
						size: 48,
						shape: "square"
					})
				}), (0, import_jsx_runtime.jsx)(Badge, {
					content: "2",
					anchorOverlap: "circular",
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "right"
					},
					children: (0, import_jsx_runtime.jsx)(Avatar, {
						alt: "Ada Lovelace",
						size: 48
					})
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "anchor-offset",
			children: "Anchor offset"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOffset={{ vertical: 8, horizontal: 12 }}" }),
			" to move the indicator\nin pixels from its normal anchor position. Positive values move inward from\nthe selected corner; negative values move outward. The default is zero on\nboth axes. Offsets work with rectangular and circular overlap and are ignored\nfor standalone labels."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
<Badge content="4" anchorOffset={{ vertical: 8, horizontal: 12 }}>
<Avatar alt="Ada Lovelace" size={48} shape="square" />
</Badge>
`,
			children: (0, import_jsx_runtime.jsx)(Badge, {
				content: "4",
				anchorOffset: {
					vertical: 8,
					horizontal: 12
				},
				children: (0, import_jsx_runtime.jsx)(Avatar, {
					alt: "Ada Lovelace",
					size: 48,
					shape: "square"
				})
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api-reference",
			children: "API reference"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "badge-props",
			children: "Badge props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "content" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content of the badge, such as a count. Required." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "20" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Minimum width and height in pixels. Values below ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "16" }),
					" become ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "16" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "color" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "BadgeColor" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"primary\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "secondary" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "accent" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "danger" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "info" }),
					", or a hex string such as ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "#7c3aed" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOrigin" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "{ vertical: \"top\" | \"bottom\"; horizontal: \"left\" | \"right\" }" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "{ vertical: \"top\", horizontal: \"right\" }" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Corner where the badge is placed." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOffset" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "{ vertical: number; horizontal: number }" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "{ vertical: 0, horizontal: 0 }" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Finite pixel offsets; positive moves inward, negative outward." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "anchorOverlap" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"rectangular\" | \"circular\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"rectangular\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Positioning relative to a rectangular or round child." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional CSS class names on the wrapper." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Element the badge is attached to." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component exports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "BadgeProps" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "BadgeColor" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "AnchorOrigin" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "AnchorOffset" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "AnchorOverlap" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "theming",
			children: "Theming"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Role colors use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-<role>" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-<role>-foreground" }),
			" tokens, so badges follow light, dark, and scoped themes. The default palette uses distinct colors for each role; custom themes can choose their own. Hex colors bypass the theme."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Badge does not add any ARIA semantics. Screen readers read ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "content" }),
			" as plain text next to the child, so for status dots or ambiguous counts, convey the meaning in the child's accessible name (for example ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label=\"Inbox, 4 unread\"" }),
			")."
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
