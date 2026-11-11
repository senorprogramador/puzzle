import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/scroll-area.mdx_macro_id_src_2Flib_2Fsource-07vOZ2FA.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Scroll Area",
	"description": "Create accessible, theme-aware scrollable regions with native browser scrolling."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Scroll Area provides a constrained viewport for overflowing content. It keeps browser-native scrolling and keyboard behavior while applying Puzzle's scrollbar styling."
		},
		{
			"heading": "basic-usage",
			"content": "Give the component a height or max-height so vertical overflow can occur. The component fills its available width by default."
		},
		{
			"heading": "scroll-direction",
			"content": "Use the `orientation` prop to choose which axis can scroll."
		},
		{
			"heading": "scroll-direction",
			"content": "`vertical` (default): vertical scrolling only."
		},
		{
			"heading": "scroll-direction",
			"content": "`horizontal`: horizontal scrolling only."
		},
		{
			"heading": "scroll-direction",
			"content": "`both`: scrolling on both axes."
		},
		{
			"heading": "keyboard-and-accessibility",
			"content": "The viewport is focusable by default, so users can scroll it with the keyboard using the browser's native scrolling keys (for example, Arrow keys, Page Up, Page Down, Home, and End)."
		},
		{
			"heading": "keyboard-and-accessibility",
			"content": "Provide an accessible name with `aria-label` or `aria-labelledby` when the scrollable region is meaningful as a named region."
		},
		{
			"heading": "keyboard-and-accessibility",
			"content": "When an accessible name is provided and no explicit role is set, the component uses `role=\"region\"`."
		},
		{
			"heading": "keyboard-and-accessibility",
			"content": "Use `tabIndex={-1}` to remove the viewport from sequential keyboard navigation while keeping it programmatically focusable."
		},
		{
			"heading": "keyboard-and-accessibility",
			"content": "Touch, trackpad, wheel, and pointer scrolling remain native."
		},
		{
			"heading": "props",
			"content": "| Prop          | Type                                   | Default      | Description                    |\n| ------------- | -------------------------------------- | ------------ | ------------------------------ |\n| `orientation` | `\"vertical\" \\| \"horizontal\" \\| \"both\"` | `\"vertical\"` | Which scroll axes are enabled. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type        | Default | Description         |\n| ---------- | ----------- | ------- | ------------------- |\n| `children` | `ReactNode` | -       | Scrollable content. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type     | Default | Description             |\n| ----------- | -------- | ------- | ----------------------- |\n| `className` | `string` | -       | Additional CSS classes. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type     | Default | Description                            |\n| ---------- | -------- | ------- | -------------------------------------- |\n| `tabIndex` | `number` | `0`     | Keyboard focus order for the viewport. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop   | Type     | Default               | Description             |\n| ------ | -------- | --------------------- | ----------------------- |\n| `role` | `string` | `\"region\"` when named | Explicit semantic role. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "All standard HTML `div` attributes are supported, including `id`, `title`, `style`, `data-*`, `aria-*`, event handlers, and `ref`."
		},
		{
			"heading": "props",
			"content": "Caller-provided styles can override the orientation's default overflow styles."
		},
		{
			"heading": "layout",
			"content": "A Scroll Area needs a constrained dimension to overflow:"
		},
		{
			"heading": "layout",
			"content": "For vertical scrolling, set `height` or `maxHeight`."
		},
		{
			"heading": "layout",
			"content": "For horizontal scrolling, constrain the width and make the inner content wider than the viewport."
		},
		{
			"heading": "layout",
			"content": "For both axes, constrain both dimensions as needed."
		},
		{
			"heading": "theming",
			"content": "The scrollbar thumb uses `--puzzle-color-border` and follows the active light, dark, or scoped theme."
		},
		{
			"heading": "theming",
			"content": "Scrollbar rendering and visibility remain subject to the browser and operating-system settings."
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
			"id": "scroll-direction",
			"content": "Scroll direction"
		},
		{
			"id": "keyboard-and-accessibility",
			"content": "Keyboard and accessibility"
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
			"id": "layout",
			"content": "Layout"
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
		url: "#scroll-direction",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Scroll direction" })
	},
	{
		depth: 2,
		url: "#keyboard-and-accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keyboard and accessibility" })
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
		url: "#layout",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Layout" })
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
	}, { Preview, ScrollArea } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	if (!ScrollArea) _missingMdxReference("ScrollArea", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Scroll Area provides a constrained viewport for overflowing content. It keeps browser-native scrolling and keyboard behavior while applying Puzzle's scrollbar styling." }),
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
						children: " { ScrollArea } "
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Give the component a height or max-height so vertical overflow can occur. The component fills its available width by default." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			align: "center",
			justify: "center",
			code: `\
<ScrollArea aria-label="Recent activity" style={{ height: 180, width: 320 }}>
{Array.from({ length: 12 }, (_, index) => (
  <div key={index} style={{ padding: "12px 16px", borderBottom: "1px solid var(--puzzle-color-border)" }}>
    Activity item {index + 1}
  </div>
))}
</ScrollArea>
`,
			children: (0, import_jsx_runtime.jsx)(ScrollArea, {
				"aria-label": "Recent activity",
				style: {
					height: 180,
					width: 320
				},
				children: Array.from({ length: 12 }, (_, index) => (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "12px 16px",
						borderBottom: "1px solid var(--puzzle-color-border)"
					},
					children: ["Activity item ", index + 1]
				}, index))
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "scroll-direction",
			children: "Scroll direction"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }),
			" prop to choose which axis can scroll."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "vertical" }), " (default): vertical scrolling only."] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "horizontal" }), ": horizontal scrolling only."] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "both" }), ": scrolling on both axes."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 180,
			code: `\
<ScrollArea
orientation="horizontal"
aria-label="Scrollable cards"
style={{ width: "100%", height: 100 }}
>
<div style={{ display: "flex", gap: 12, width: 720 }}>
  {Array.from({ length: 8 }, (_, index) => (
    <div
      key={index}
      style={{
        flex: "0 0 120px",
        padding: 16,
        border: "1px solid var(--puzzle-color-border)",
        borderRadius: 8,
      }}
    >
      Card {index + 1}
    </div>
  ))}
</div>
</ScrollArea>
`,
			children: (0, import_jsx_runtime.jsx)(ScrollArea, {
				orientation: "horizontal",
				"aria-label": "Scrollable cards",
				style: {
					width: "100%",
					height: 100
				},
				children: (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: 12,
						width: 720
					},
					children: Array.from({ length: 8 }, (_, index) => (0, import_jsx_runtime.jsxs)("div", {
						style: {
							flex: "0 0 120px",
							padding: 16,
							border: "1px solid var(--puzzle-color-border)",
							borderRadius: 8
						},
						children: ["Card ", index + 1]
					}, index))
				})
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "keyboard-and-accessibility",
			children: "Keyboard and accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The viewport is focusable by default, so users can scroll it with the keyboard using the browser's native scrolling keys (for example, Arrow keys, Page Up, Page Down, Home, and End)." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Provide an accessible name with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
				" when the scrollable region is meaningful as a named region."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"When an accessible name is provided and no explicit role is set, the component uses ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"region\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "tabIndex={-1}" }),
				" to remove the viewport from sequential keyboard navigation while keeping it programmatically focusable."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Touch, trackpad, wheel, and pointer scrolling remain native." }),
			"\n"
		] }),
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"vertical\" | \"horizontal\" | \"both\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"vertical\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Which scroll axes are enabled." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Scrollable content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional CSS classes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "tabIndex" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Keyboard focus order for the viewport." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "role" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "\"region\"" }), " when named"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Explicit semantic role." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"All standard HTML ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "div" }),
			" attributes are supported, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "title" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "data-*" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-*" }),
			", event handlers, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Caller-provided styles can override the orientation's default overflow styles." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "layout",
			children: "Layout"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A Scroll Area needs a constrained dimension to overflow:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"For vertical scrolling, set ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "height" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "maxHeight" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "For horizontal scrolling, constrain the width and make the inner content wider than the viewport." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "For both axes, constrain both dimensions as needed." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "theming",
			children: "Theming"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The scrollbar thumb uses ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "--puzzle-color-border" }),
			" and follows the active light, dark, or scoped theme."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Scrollbar rendering and visibility remain subject to the browser and operating-system settings." })
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
