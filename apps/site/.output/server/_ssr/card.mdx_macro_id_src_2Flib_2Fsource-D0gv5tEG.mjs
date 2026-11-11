import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/card.mdx_macro_id_src_2Flib_2Fsource-D0gv5tEG.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Card",
	"description": "Cards group related content and actions into a single, self-contained surface."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Use the Card component to present a unit of related content, such as a summary, a product, or a settings group. Compose it from the Card parts to get consistent spacing and structure."
		},
		{
			"heading": "basic-usage",
			"content": "Project Atlas"
		},
		{
			"heading": "basic-usage",
			"content": "Last updated 2 hours ago"
		},
		{
			"heading": "basic-usage",
			"content": "A shared workspace for planning and tracking the next release."
		},
		{
			"heading": "basic-usage",
			"content": "Open"
		},
		{
			"heading": "variants",
			"content": "Use `variant` to set the surface style: `outlined` (default), `elevated`, `filled`, or `ghost`."
		},
		{
			"heading": "variants",
			"content": "Outlined"
		},
		{
			"heading": "variants",
			"content": "Elevated"
		},
		{
			"heading": "variants",
			"content": "Filled"
		},
		{
			"heading": "variants",
			"content": "Ghost"
		},
		{
			"heading": "size",
			"content": "Use `size` (`sm`, `md`, `lg`) to control the card's spacing. The default is `md`."
		},
		{
			"heading": "size",
			"content": "Small"
		},
		{
			"heading": "size",
			"content": "Medium"
		},
		{
			"heading": "size",
			"content": "Large"
		},
		{
			"heading": "header-action",
			"content": "Place a `CardAction` inside `CardHeader` to add a control, such as a button, next to the title."
		},
		{
			"heading": "header-action",
			"content": "Notifications"
		},
		{
			"heading": "header-action",
			"content": "Choose what you hear about."
		},
		{
			"heading": "header-action",
			"content": "Edit"
		},
		{
			"heading": "orientation",
			"content": "Set `orientation=\"horizontal\"` to lay media and content side by side. The default is `vertical`. Use `CardMedia` for the image or other visual."
		},
		{
			"heading": "orientation",
			"content": "Horizontal card"
		},
		{
			"heading": "orientation",
			"content": "Media sits beside the content."
		},
		{
			"heading": "interactive-cards",
			"content": "Set `interactive` to add hover and focus styling when the whole card is clickable. Render it as a link or button with `as` so it is keyboard accessible."
		},
		{
			"heading": "interactive-cards",
			"content": "Read the guide"
		},
		{
			"heading": "interactive-cards",
			"content": "Everything you need to get started."
		},
		{
			"heading": "interactive-cards",
			"content": "When `interactive` is set without `as`, the card renders a `button` (or an `a` when `href` is passed) so it is keyboard operable. Do not combine `interactive` with `as=\"div\"`: it only adds styling, not semantics."
		},
		{
			"heading": "card-props",
			"content": "| Prop | Type          | Default | Description                           |\n| ---- | ------------- | ------- | ------------------------------------- |\n| `as` | `ElementType` | `\"div\"` | Element type used to render the card. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop      | Type                                              | Default      | Description    |\n| --------- | ------------------------------------------------- | ------------ | -------------- |\n| `variant` | `\"elevated\" \\| \"outlined\" \\| \"filled\" \\| \"ghost\"` | `\"outlined\"` | Surface style. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop   | Type                   | Default | Description    |\n| ------ | ---------------------- | ------- | -------------- |\n| `size` | `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Spacing scale. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop          | Type                         | Default      | Description                                       |\n| ------------- | ---------------------------- | ------------ | ------------------------------------------------- |\n| `orientation` | `\"vertical\" \\| \"horizontal\"` | `\"vertical\"` | Direction in which the card's parts are laid out. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop          | Type      | Default | Description                                       |\n| ------------- | --------- | ------- | ------------------------------------------------- |\n| `interactive` | `boolean` | `false` | Adds hover and focus styling for clickable cards. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop        | Type     | Default | Description                 |\n| ----------- | -------- | ------- | --------------------------- |\n| `className` | `string` | —       | Additional CSS class names. |",
			"table": "table-0"
		},
		{
			"heading": "card-props",
			"content": "| Prop       | Type        | Default | Description   |\n| ---------- | ----------- | ------- | ------------- |\n| `children` | `ReactNode` | —       | Card content. |",
			"table": "table-0"
		},
		{
			"heading": "card-parts",
			"content": "| Component    | Default element | Purpose                                    |\n| ------------ | --------------- | ------------------------------------------ |\n| `CardHeader` | `div`           | Groups the title, description, and action. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component   | Default element | Purpose                                   |\n| ----------- | --------------- | ----------------------------------------- |\n| `CardTitle` | `h3`            | Card heading. Change the level with `as`. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component         | Default element | Purpose                        |\n| ----------------- | --------------- | ------------------------------ |\n| `CardDescription` | `p`             | Supporting text for the title. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component    | Default element | Purpose                             |\n| ------------ | --------------- | ----------------------------------- |\n| `CardAction` | `div`           | Control placed alongside the title. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component     | Default element | Purpose                |\n| ------------- | --------------- | ---------------------- |\n| `CardContent` | `div`           | Main body of the card. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component    | Default element | Purpose                                     |\n| ------------ | --------------- | ------------------------------------------- |\n| `CardFooter` | `div`           | Actions or metadata at the end of the card. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "| Component   | Default element | Purpose                |\n| ----------- | --------------- | ---------------------- |\n| `CardMedia` | `div`           | Image or other visual. |",
			"table": "table-1"
		},
		{
			"heading": "card-parts",
			"content": "Every part accepts `as`, `className`, `children`, and the props of the element it renders."
		},
		{
			"heading": "element-props",
			"content": "Card accepts the props of the element selected by `as`, passed through to it."
		},
		{
			"heading": "typescript-types",
			"content": "The component exports `CardProps`, `CardPartProps`, `CardVariant`, `CardSize`, and `CardOrientation`."
		},
		{
			"heading": "accessibility",
			"content": "`CardTitle` renders an `<h3>`. Use `as` to pick the level that fits the page's heading hierarchy."
		},
		{
			"heading": "accessibility",
			"content": "For a clickable card, render the card as `a` or `button` with `as` rather than adding a click handler to a `div`. Avoid nesting other interactive controls inside it."
		},
		{
			"heading": "accessibility",
			"content": "The card has no implicit role. Add `role`, `aria-labelledby`, or similar only when the card represents a meaningful landmark or group."
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
			"id": "variants",
			"content": "Variants"
		},
		{
			"id": "size",
			"content": "Size"
		},
		{
			"id": "header-action",
			"content": "Header action"
		},
		{
			"id": "orientation",
			"content": "Orientation"
		},
		{
			"id": "interactive-cards",
			"content": "Interactive cards"
		},
		{
			"id": "api-reference",
			"content": "API reference"
		},
		{
			"id": "card-props",
			"content": "Card props"
		},
		{
			"id": "card-parts",
			"content": "Card parts"
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
		url: "#variants",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Variants" })
	},
	{
		depth: 2,
		url: "#size",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Size" })
	},
	{
		depth: 2,
		url: "#header-action",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Header action" })
	},
	{
		depth: 2,
		url: "#orientation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Orientation" })
	},
	{
		depth: 2,
		url: "#interactive-cards",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Interactive cards" })
	},
	{
		depth: 2,
		url: "#api-reference",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API reference" })
	},
	{
		depth: 3,
		url: "#card-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Card props" })
	},
	{
		depth: 3,
		url: "#card-parts",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Card parts" })
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
	}, { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Preview, Skeleton } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!Card) _missingMdxReference("Card", true);
	if (!CardAction) _missingMdxReference("CardAction", true);
	if (!CardContent) _missingMdxReference("CardContent", true);
	if (!CardDescription) _missingMdxReference("CardDescription", true);
	if (!CardFooter) _missingMdxReference("CardFooter", true);
	if (!CardHeader) _missingMdxReference("CardHeader", true);
	if (!CardMedia) _missingMdxReference("CardMedia", true);
	if (!CardTitle) _missingMdxReference("CardTitle", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Skeleton) _missingMdxReference("Skeleton", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the Card component to present a unit of related content, such as a summary, a product, or a settings group. Compose it from the Card parts to get consistent spacing and structure." }),
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
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "import"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " {"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  Card,"
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
						children: "  CardHeader,"
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
						children: "  CardTitle,"
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
						children: "  CardDescription,"
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
						children: "  CardAction,"
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
						children: "  CardContent,"
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
						children: "  CardFooter,"
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
						children: "  CardMedia,"
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
							children: "} "
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
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "basic-usage",
			children: "Basic usage"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			align: "center",
			justify: "center",
			code: `\
  <Card style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>Project Atlas</CardTitle>
      <CardDescription>Last updated 2 hours ago</CardDescription>
    </CardHeader>
    <CardContent>
      A shared workspace for planning and tracking the next release.
    </CardContent>
    <CardFooter>
      <Button>Open</Button>
    </CardFooter>
  </Card>
`,
			children: (0, import_jsx_runtime.jsxs)(Card, {
				style: { width: 320 },
				children: [
					(0, import_jsx_runtime.jsxs)(CardHeader, { children: [(0, import_jsx_runtime.jsx)(CardTitle, { children: "Project Atlas" }), (0, import_jsx_runtime.jsx)(CardDescription, { children: "Last updated 2 hours ago" })] }),
					(0, import_jsx_runtime.jsx)(CardContent, { children: (0, import_jsx_runtime.jsx)(_components.p, { children: "A shared workspace for planning and tracking the next release." }) }),
					(0, import_jsx_runtime.jsx)(CardFooter, { children: (0, import_jsx_runtime.jsx)(Button, { children: "Open" }) })
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "variants",
			children: "Variants"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }),
			" to set the surface style: ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "outlined" }),
			" (default), ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "elevated" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "filled" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ghost" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 220,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
    <Card variant="outlined"><CardContent>Outlined</CardContent></Card>
    <Card variant="elevated"><CardContent>Elevated</CardContent></Card>
    <Card variant="filled"><CardContent>Filled</CardContent></Card>
    <Card variant="ghost"><CardContent>Ghost</CardContent></Card>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexWrap: "wrap",
					gap: 16
				},
				children: [
					(0, import_jsx_runtime.jsx)(Card, {
						variant: "outlined",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Outlined" })
					}),
					(0, import_jsx_runtime.jsx)(Card, {
						variant: "elevated",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Elevated" })
					}),
					(0, import_jsx_runtime.jsx)(Card, {
						variant: "filled",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Filled" })
					}),
					(0, import_jsx_runtime.jsx)(Card, {
						variant: "ghost",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Ghost" })
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
			" (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }),
			") to control the card's spacing. The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 220,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
    <Card size="sm"><CardContent>Small</CardContent></Card>
    <Card size="md"><CardContent>Medium</CardContent></Card>
    <Card size="lg"><CardContent>Large</CardContent></Card>
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexWrap: "wrap",
					gap: 16
				},
				children: [
					(0, import_jsx_runtime.jsx)(Card, {
						size: "sm",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Small" })
					}),
					(0, import_jsx_runtime.jsx)(Card, {
						size: "md",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Medium" })
					}),
					(0, import_jsx_runtime.jsx)(Card, {
						size: "lg",
						children: (0, import_jsx_runtime.jsx)(CardContent, { children: "Large" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "header-action",
			children: "Header action"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Place a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardAction" }),
			" inside ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardHeader" }),
			" to add a control, such as a button, next to the title."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
  <Card style={{ width: 360 }}>
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>Choose what you hear about.</CardDescription>
      <CardAction>
        <Button variant="secondary">Edit</Button>
      </CardAction>
    </CardHeader>
  </Card>
`,
			children: (0, import_jsx_runtime.jsx)(Card, {
				style: { width: 360 },
				children: (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
					(0, import_jsx_runtime.jsx)(CardTitle, { children: "Notifications" }),
					(0, import_jsx_runtime.jsx)(CardDescription, { children: "Choose what you hear about." }),
					(0, import_jsx_runtime.jsx)(CardAction, { children: (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Edit"
					}) })
				] })
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "orientation",
			children: "Orientation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "orientation=\"horizontal\"" }),
			" to lay media and content side by side. The default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "vertical" }),
			". Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardMedia" }),
			" for the image or other visual."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			align: "center",
			justify: "center",
			code: `\
  <Card orientation="horizontal" style={{ width: 420 }}>
    <CardMedia>
      <Skeleton width={120} height="100%" radius="none" />
    </CardMedia>
    <CardContent>
      <CardTitle>Horizontal card</CardTitle>
      <CardDescription>Media sits beside the content.</CardDescription>
    </CardContent>
  </Card>
`,
			children: (0, import_jsx_runtime.jsxs)(Card, {
				orientation: "horizontal",
				style: { width: 420 },
				children: [(0, import_jsx_runtime.jsx)(CardMedia, { children: (0, import_jsx_runtime.jsx)(Skeleton, {
					width: 120,
					height: "100%",
					radius: "none"
				}) }), (0, import_jsx_runtime.jsxs)(CardContent, { children: [(0, import_jsx_runtime.jsx)(CardTitle, { children: "Horizontal card" }), (0, import_jsx_runtime.jsx)(CardDescription, { children: "Media sits beside the content." })] })]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "interactive-cards",
			children: "Interactive cards"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "interactive" }),
			" to add hover and focus styling when the whole card is clickable. Render it as a link or button with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			" so it is keyboard accessible."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
  <Card as="a" href="#" interactive style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>Read the guide</CardTitle>
      <CardDescription>Everything you need to get started.</CardDescription>
    </CardHeader>
  </Card>
`,
			children: (0, import_jsx_runtime.jsx)(Card, {
				as: "a",
				href: "#",
				interactive: true,
				style: { width: 320 },
				children: (0, import_jsx_runtime.jsxs)(CardHeader, { children: [(0, import_jsx_runtime.jsx)(CardTitle, { children: "Read the guide" }), (0, import_jsx_runtime.jsx)(CardDescription, { children: "Everything you need to get started." })] })
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "interactive" }),
			" is set without ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			", the card renders a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "button" }),
			" (or an ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "a" }),
			" when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is passed) so it is keyboard operable. Do not combine ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "interactive" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as=\"div\"" }),
			": it only adds styling, not semantics."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api-reference",
			children: "API reference"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "card-props",
			children: "Card props"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Element type used to render the card." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"elevated\" | \"outlined\" | \"filled\" | \"ghost\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"outlined\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Surface style." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Spacing scale." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"vertical\" | \"horizontal\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"vertical\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Direction in which the card's parts are laid out." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "interactive" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Adds hover and focus styling for clickable cards." })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Card content." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "card-parts",
			children: "Card parts"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Component" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default element" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Purpose" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardHeader" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "div" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Groups the title, description, and action." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardTitle" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "h3" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Card heading. Change the level with ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardDescription" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "p" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Supporting text for the title." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardAction" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "div" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Control placed alongside the title." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardContent" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "div" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Main body of the card." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardFooter" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "div" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Actions or metadata at the end of the card." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CardMedia" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "div" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Image or other visual." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Every part accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			", and the props of the element it renders."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "element-props",
			children: "Element props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Card accepts the props of the element selected by ",
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
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardProps" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardPartProps" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardVariant" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardSize" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CardOrientation" }),
			"."
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
				(0, import_jsx_runtime.jsx)(_components.code, { children: "CardTitle" }),
				" renders an ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "<h3>" }),
				". Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
				" to pick the level that fits the page's heading hierarchy."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"For a clickable card, render the card as ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "a" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "button" }),
				" with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
				" rather than adding a click handler to a ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "div" }),
				". Avoid nesting other interactive controls inside it."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The card has no implicit role. Add ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role" }),
				", ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
				", or similar only when the card represents a meaningful landmark or group."
			] }),
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
