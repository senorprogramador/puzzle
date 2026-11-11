import { ControlledTooltipExample } from "./doc-examples-BedOXFxx.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/tooltip.mdx_macro_id_src_2Flib_2Fsource-CSfDMVZb.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Tooltip",
	"description": "Short, non-interactive supplementary information for a trigger."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Tooltip provides a short hint on hover or keyboard focus. Use a focusable trigger that forwards its ref and event handlers, such as a native button or Puzzle `Button`."
		},
		{
			"heading": "basic-usage",
			"content": "Hover over the button or reach it with Tab. The tooltip closes on pointer leave, blur, or Escape."
		},
		{
			"heading": "basic-usage",
			"content": "Saves a draft"
		},
		{
			"heading": "position",
			"content": "`position` requests one of four sides. The popup can fall back to another side when there is not enough space."
		},
		{
			"heading": "position",
			"content": "Above the trigger"
		},
		{
			"heading": "position",
			"content": "Beside the trigger"
		},
		{
			"heading": "position",
			"content": "Below the trigger"
		},
		{
			"heading": "position",
			"content": "Beside the trigger"
		},
		{
			"heading": "alignment-offset-and-exit-delay",
			"content": "`align` aligns the popup along the trigger's edge. `offset` is the gap in pixels; `exitDelay` is the delay in milliseconds before closing on pointer leave."
		},
		{
			"heading": "alignment-offset-and-exit-delay",
			"content": "Aligned to the start with a 16px gap."
		},
		{
			"heading": "alignment-offset-and-exit-delay",
			"content": "Aligned to the end of the trigger."
		},
		{
			"heading": "controlled-visibility",
			"content": "Use `open` with `onOpenChange` when visibility belongs to application state. Use `defaultOpen` instead to start an uncontrolled tooltip open."
		},
		{
			"heading": "api",
			"content": "| Prop      | Type           | Default  | Description                                        |\n| --------- | -------------- | -------- | -------------------------------------------------- |\n| `trigger` | `ReactElement` | Required | Single trigger accepting DOM attributes and a ref. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type        | Default  | Description                   |\n| ---------- | ----------- | -------- | ----------------------------- |\n| `children` | `ReactNode` | Required | Non-interactive hint content. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type                                     | Default    | Description           |\n| ---------- | ---------------------------------------- | ---------- | --------------------- |\n| `position` | `\"top\" \\| \"right\" \\| \"bottom\" \\| \"left\"` | `\"bottom\"` | Preferred popup side. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type                           | Default    | Description                        |\n| ------- | ------------------------------ | ---------- | ---------------------------------- |\n| `align` | `\"start\" \\| \"center\" \\| \"end\"` | `\"center\"` | Popup alignment along the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop     | Type     | Default | Description                     |\n| -------- | -------- | ------- | ------------------------------- |\n| `offset` | `number` | `8`     | Gap from the trigger in pixels. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type     | Default | Description                          |\n| ----------- | -------- | ------- | ------------------------------------ |\n| `exitDelay` | `number` | `100`   | Pointer-leave delay in milliseconds. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type      | Default | Description            |\n| ------ | --------- | ------- | ---------------------- |\n| `open` | `boolean` | -       | Controlled visibility. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop          | Type      | Default | Description                      |\n| ------------- | --------- | ------- | -------------------------------- |\n| `defaultOpen` | `boolean` | `false` | Initial uncontrolled visibility. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type                      | Default | Description                                   |\n| -------------- | ------------------------- | ------- | --------------------------------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Called when visibility changes are requested. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type     | Default | Description                              |\n| ----------- | -------- | ------- | ---------------------------------------- |\n| `className` | `string` | -       | Additional class on the tooltip content. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type     | Default | Description                               |\n| ------------------ | -------- | ------- | ----------------------------------------- |\n| `triggerClassName` | `string` | -       | Additional class merged onto the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "accessibility",
			"content": "The popup has `role=\"tooltip\"` and is linked to its trigger with `aria-describedby`; an existing description relationship is preserved. Keep a meaningful accessible name on the trigger itself, and do not put essential information only in a tooltip."
		},
		{
			"heading": "accessibility",
			"content": "Tooltip content must not be interactive: keyboard users cannot reach it because it closes when focus leaves the trigger. Use Popover for links, buttons, form controls, or a close button."
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
			"id": "position",
			"content": "Position"
		},
		{
			"id": "alignment-offset-and-exit-delay",
			"content": "Alignment, offset, and exit delay"
		},
		{
			"id": "controlled-visibility",
			"content": "Controlled visibility"
		},
		{
			"id": "api",
			"content": "API"
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
		url: "#position",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Position" })
	},
	{
		depth: 2,
		url: "#alignment-offset-and-exit-delay",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Alignment, offset, and exit delay" })
	},
	{
		depth: 2,
		url: "#controlled-visibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled visibility" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 2,
		url: "#accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
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
	}, { Button, Preview, Stack, Tooltip } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Stack) _missingMdxReference("Stack", true);
	if (!Tooltip) _missingMdxReference("Tooltip", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Tooltip provides a short hint on hover or keyboard focus. Use a focusable trigger that forwards its ref and event handlers, such as a native button or Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Button" }),
			"."
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
						children: " { Tooltip } "
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Hover over the button or reach it with Tab. The tooltip closes on pointer leave, blur, or Escape." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Tooltip trigger={<Button>Save</Button>}>Saves a draft</Tooltip>
`,
			children: (0, import_jsx_runtime.jsx)(Tooltip, {
				trigger: (0, import_jsx_runtime.jsx)(Button, { children: "Save" }),
				children: "Saves a draft"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "position",
			children: "Position"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "position" }), " requests one of four sides. The popup can fall back to another side when there is not enough space."] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 300,
			align: "center",
			justify: "center",
			code: `\
<Stack alignH="center">
<Tooltip position="top" trigger={<Button variant="outline">Top</Button>}>Above the trigger</Tooltip>
<Tooltip position="right" trigger={<Button variant="outline">Right</Button>}>Beside the trigger</Tooltip>
<Tooltip position="bottom" trigger={<Button variant="outline">Bottom</Button>}>Below the trigger</Tooltip>
<Tooltip position="left" trigger={<Button variant="outline">Left</Button>}>Beside the trigger</Tooltip>
</Stack>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				alignH: "center",
				children: [
					(0, import_jsx_runtime.jsx)(Tooltip, {
						position: "top",
						trigger: (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Top"
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Above the trigger" })
					}),
					(0, import_jsx_runtime.jsx)(Tooltip, {
						position: "right",
						trigger: (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Right"
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Beside the trigger" })
					}),
					(0, import_jsx_runtime.jsx)(Tooltip, {
						position: "bottom",
						trigger: (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Bottom"
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Below the trigger" })
					}),
					(0, import_jsx_runtime.jsx)(Tooltip, {
						position: "left",
						trigger: (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Left"
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Beside the trigger" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "alignment-offset-and-exit-delay",
			children: "Alignment, offset, and exit delay"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align" }),
			" aligns the popup along the trigger's edge. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }),
			" is the gap in pixels; ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "exitDelay" }),
			" is the delay in milliseconds before closing on pointer leave."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			align: "center",
			justify: "center",
			code: `\
<Stack alignH="center">
<Tooltip align="start" offset={16} exitDelay={500} trigger={<Button variant="outline">Start, longer delay</Button>}>
  Aligned to the start with a 16px gap.
</Tooltip>
<Tooltip align="end" trigger={<Button variant="outline">End</Button>}>
  Aligned to the end of the trigger.
</Tooltip>
</Stack>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				alignH: "center",
				children: [(0, import_jsx_runtime.jsx)(Tooltip, {
					align: "start",
					offset: 16,
					exitDelay: 500,
					trigger: (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Start, longer delay"
					}),
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Aligned to the start with a 16px gap." })
				}), (0, import_jsx_runtime.jsx)(Tooltip, {
					align: "end",
					trigger: (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "End"
					}),
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Aligned to the end of the trigger." })
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-visibility",
			children: "Controlled visibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			" when visibility belongs to application state. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			" instead to start an uncontrolled tooltip open."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			align: "center",
			justify: "center",
			code: `\
const [open, setOpen] = useState(false);

return (

<Stack alignH="center">
  <Tooltip open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Focus or hover me</Button>}>
    Your changes are saved automatically.
  </Tooltip>
  <span role="status">{open ? "Tooltip open" : "Tooltip closed"}</span>
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(ControlledTooltipExample, {})
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "trigger" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactElement" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Single trigger accepting DOM attributes and a ref." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Non-interactive hint content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "position" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"top\" | \"right\" | \"bottom\" | \"left\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"bottom\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Preferred popup side." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "align" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\" | \"center\" | \"end\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"center\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Popup alignment along the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Gap from the trigger in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "exitDelay" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "100" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Pointer-leave delay in milliseconds." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "open" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled visibility." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled visibility." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when visibility changes are requested." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the tooltip content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "triggerClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class merged onto the trigger." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The popup has ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"tooltip\"" }),
			" and is linked to its trigger with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			"; an existing description relationship is preserved. Keep a meaningful accessible name on the trigger itself, and do not put essential information only in a tooltip."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Tooltip content must not be interactive: keyboard users cannot reach it because it closes when focus leaves the trigger. Use ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/components/ui/overlays/popover",
				children: "Popover"
			}),
			" for links, buttons, form controls, or a close button."
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
