import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/button-group.mdx_macro_id_src_2Flib_2Fsource-BAfAwbzF.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Button Group",
	"description": "Button groups organize related actions into a single, coherent control."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Use the ButtonGroup component to visually group related buttons. It arranges its children together without changing their individual behavior or appearance."
		},
		{
			"heading": "basic-usage",
			"content": "Place related Button components inside a ButtonGroup."
		},
		{
			"heading": "basic-usage",
			"content": "Save draft"
		},
		{
			"heading": "basic-usage",
			"content": "Publish"
		},
		{
			"heading": "basic-usage",
			"content": "ButtonGroup renders a `<div>` by default and gives it the `group` role. Provide an accessible name with `aria-label` or `aria-labelledby` so assistive technology can identify the related actions."
		},
		{
			"heading": "orientation",
			"content": "Use the `orientation` prop to arrange buttons horizontally or vertically. The default orientation is `horizontal`."
		},
		{
			"heading": "orientation",
			"content": "Open"
		},
		{
			"heading": "orientation",
			"content": "Rename"
		},
		{
			"heading": "orientation",
			"content": "Delete"
		},
		{
			"heading": "orientation",
			"content": "Orientation changes the visual layout only; it does not change the buttons' keyboard behavior."
		},
		{
			"heading": "attached-buttons",
			"content": "Set `attached` to remove the space between buttons and visually join them."
		},
		{
			"heading": "attached-buttons",
			"content": "Left"
		},
		{
			"heading": "attached-buttons",
			"content": "Center"
		},
		{
			"heading": "attached-buttons",
			"content": "Right"
		},
		{
			"heading": "full-width",
			"content": "Use `fullWidth` to make the group fill its container and let its children flex to fill the available space."
		},
		{
			"heading": "full-width",
			"content": "Cancel"
		},
		{
			"heading": "full-width",
			"content": "Continue"
		},
		{
			"heading": "spacing",
			"content": "Use `spacing` to set the gap between buttons. A number is interpreted as pixels; a string can be any valid CSS gap value. The default gap is `0.5rem`. Spacing has no effect when `attached` is enabled."
		},
		{
			"heading": "disabled",
			"content": "Use `disabled` to disable the whole group: the group gets `aria-disabled=\"true\"` and every direct child receives `disabled`."
		},
		{
			"heading": "props",
			"content": "| Prop | Type          | Default | Description                            |\n| ---- | ------------- | ------- | -------------------------------------- |\n| `as` | `ElementType` | `\"div\"` | Element type used to render the group. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop          | Type                         | Default        | Description                    |\n| ------------- | ---------------------------- | -------------- | ------------------------------ |\n| `orientation` | `\"horizontal\" \\| \"vertical\"` | `\"horizontal\"` | Visual direction of the group. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type      | Default | Description                                           |\n| ---------- | --------- | ------- | ----------------------------------------------------- |\n| `attached` | `boolean` | `false` | Removes the gap and visually joins adjacent children. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type      | Default | Description                                                                                |\n| ----------- | --------- | ------- | ------------------------------------------------------------------------------------------ |\n| `fullWidth` | `boolean` | `false` | Makes the group fill its container and lets its children flex to fill the available space. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type      | Default | Description                                                      |\n| ---------- | --------- | ------- | ---------------------------------------------------------------- |\n| `disabled` | `boolean` | `false` | Marks the group with `aria-disabled`; does not disable children. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop      | Type               | Default | Description                                                                                |\n| --------- | ------------------ | ------- | ------------------------------------------------------------------------------------------ |\n| `spacing` | `number \\| string` | —       | Gap between children. Numbers are interpreted as pixels; strings are passed as CSS values. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type     | Default | Description                 |\n| ----------- | -------- | ------- | --------------------------- |\n| `className` | `string` | —       | Additional CSS class names. |",
			"table": "table-0"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type        | Default | Description                         |\n| ---------- | ----------- | ------- | ----------------------------------- |\n| `children` | `ReactNode` | —       | Content displayed inside the group. |",
			"table": "table-0"
		},
		{
			"heading": "element-props",
			"content": "ButtonGroup accepts the props of the element selected by `as`. By default, standard `<div>` props are supported and passed through, including `aria-*` and `data-*` attributes. Its `role` defaults to `\"group\"` and can be overridden."
		},
		{
			"heading": "typescript-types",
			"content": "The component exports `ButtonGroupProps<C extends ElementType = \"div\">`. The generic follows the element selected by `as`, which defaults to `\"div\"`."
		},
		{
			"heading": "group-semantics",
			"content": "ButtonGroup uses the `group` role by default. Give each group an accessible name with `aria-label` or `aria-labelledby`, especially when a page contains multiple groups."
		},
		{
			"heading": "keyboard-interaction",
			"content": "The group does not add custom keyboard behavior. Each child control retains its standard keyboard interaction and focus behavior."
		},
		{
			"heading": "disabled-state",
			"content": "`disabled` sets `aria-disabled` on the group but does not prevent interaction with its children. Apply each child control's disabled state as needed."
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
			"id": "attached-buttons",
			"content": "Attached buttons"
		},
		{
			"id": "full-width",
			"content": "Full width"
		},
		{
			"id": "spacing",
			"content": "Spacing"
		},
		{
			"id": "disabled",
			"content": "Disabled"
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
		},
		{
			"id": "group-semantics",
			"content": "Group semantics"
		},
		{
			"id": "keyboard-interaction",
			"content": "Keyboard interaction"
		},
		{
			"id": "disabled-state",
			"content": "Disabled state"
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
		url: "#attached-buttons",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Attached buttons" })
	},
	{
		depth: 2,
		url: "#full-width",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Full width" })
	},
	{
		depth: 2,
		url: "#spacing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Spacing" })
	},
	{
		depth: 2,
		url: "#disabled",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled" })
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
	},
	{
		depth: 3,
		url: "#group-semantics",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Group semantics" })
	},
	{
		depth: 3,
		url: "#keyboard-interaction",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keyboard interaction" })
	},
	{
		depth: 3,
		url: "#disabled-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled state" })
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
	}, { Button, ButtonGroup, Preview } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!ButtonGroup) _missingMdxReference("ButtonGroup", true);
	if (!Preview) _missingMdxReference("Preview", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the ButtonGroup component to visually group related buttons. It arranges its children together without changing their individual behavior or appearance." }),
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
						children: " { ButtonGroup } "
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Place related Button components inside a ButtonGroup." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
  <ButtonGroup aria-label="Document actions">
    <Button variant="secondary">Save draft</Button>
    <Button>Publish</Button>
  </ButtonGroup>
`,
			children: (0, import_jsx_runtime.jsxs)(ButtonGroup, {
				"aria-label": "Document actions",
				children: [(0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					children: "Save draft"
				}), (0, import_jsx_runtime.jsx)(Button, { children: "Publish" })]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"ButtonGroup renders a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<div>" }),
			" by default and gives it the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "group" }),
			" role. Provide an accessible name with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
			" so assistive technology can identify the related actions."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "orientation",
			children: "Orientation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }),
			" prop to arrange buttons horizontally or vertically. The default orientation is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "horizontal" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 300,
			align: "center",
			justify: "center",
			code: `\
<ButtonGroup orientation="vertical" aria-label="File actions">
  <Button variant="secondary">Open</Button>
  <Button variant="secondary">Rename</Button>
  <Button variant="danger">Delete</Button>
</ButtonGroup>
`,
			children: (0, import_jsx_runtime.jsxs)(ButtonGroup, {
				orientation: "vertical",
				"aria-label": "File actions",
				children: [
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Open"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Rename"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						children: "Delete"
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Orientation changes the visual layout only; it does not change the buttons' keyboard behavior." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "attached-buttons",
			children: "Attached buttons"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "attached" }),
			" to remove the space between buttons and visually join them."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
<ButtonGroup attached aria-label="Text alignment">
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>
`,
			children: (0, import_jsx_runtime.jsxs)(ButtonGroup, {
				attached: true,
				"aria-label": "Text alignment",
				children: [
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Left"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Center"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Right"
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "full-width",
			children: "Full width"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }),
			" to make the group fill its container and let its children flex to fill the available space."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 160,
			align: "center",
			justify: "center",
			code: `\
<ButtonGroup fullWidth aria-label="Form actions">
  <Button variant="secondary">Cancel</Button>
  <Button>Continue</Button>
</ButtonGroup>
`,
			children: (0, import_jsx_runtime.jsxs)(ButtonGroup, {
				fullWidth: true,
				"aria-label": "Form actions",
				children: [(0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					children: "Cancel"
				}), (0, import_jsx_runtime.jsx)(Button, { children: "Continue" })]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "spacing",
			children: "Spacing"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "spacing" }),
			" to set the gap between buttons. A number is interpreted as pixels; a string can be any valid CSS gap value. The default gap is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0.5rem" }),
			". Spacing has no effect when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "attached" }),
			" is enabled."
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
							children: "ButtonGroup"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " spacing"
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
							children: "12"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "} "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "aria-label"
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
							children: "\"Page navigation\""
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
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " variant"
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
							children: "\"secondary\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Previous</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
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
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Next</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
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
							children: "</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "ButtonGroup"
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
			id: "disabled",
			children: "Disabled"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" to disable the whole group: the group gets ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled=\"true\"" }),
			" and every direct child receives ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
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
							children: "ButtonGroup"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " disabled"
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
							children: "\"Unavailable actions\""
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
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " disabled"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Save</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
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
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " disabled"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Publish</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
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
							children: "</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "ButtonGroup"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "as" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ElementType" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"div\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Element type used to render the group." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\" | \"vertical\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual direction of the group." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "attached" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Removes the gap and visually joins adjacent children." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Makes the group fill its container and lets its children flex to fill the available space." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Marks the group with ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled" }),
					"; does not disable children."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "spacing" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number | string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Gap between children. Numbers are interpreted as pixels; strings are passed as CSS values." })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content displayed inside the group." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "element-props",
			children: "Element props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"ButtonGroup accepts the props of the element selected by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			". By default, standard ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<div>" }),
			" props are supported and passed through, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-*" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "data-*" }),
			" attributes. Its ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "role" }),
			" defaults to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"group\"" }),
			" and can be overridden."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component exports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ButtonGroupProps<C extends ElementType = \"div\">" }),
			". The generic follows the element selected by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "as" }),
			", which defaults to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"div\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "group-semantics",
			children: "Group semantics"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"ButtonGroup uses the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "group" }),
			" role by default. Give each group an accessible name with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
			", especially when a page contains multiple groups."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "keyboard-interaction",
			children: "Keyboard interaction"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The group does not add custom keyboard behavior. Each child control retains its standard keyboard interaction and focus behavior." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "disabled-state",
			children: "Disabled state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" sets ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled" }),
			" on the group but does not prevent interaction with its children. Apply each child control's disabled state as needed."
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
