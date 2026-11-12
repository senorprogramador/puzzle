import { ControlledPopoverExample } from "./doc-examples-CB6xK7z_.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/popover.mdx_macro_id_src_2Flib_2Fsource-FNnQpquQ.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Popover",
	"description": "A non-modal dialog anchored to a trigger, for interactive content."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Popover opens on click and contains an interactive, non-modal dialog. Use a focusable trigger that forwards its ref and event handlers, such as Puzzle `Button`."
		},
		{
			"heading": "basic-usage",
			"content": "Name the dialog with a visible `title`. `closable` adds a close button alongside the title."
		},
		{
			"heading": "basic-usage",
			"content": "Only available"
		},
		{
			"heading": "position-alignment-and-offset",
			"content": "`position` requests `top`, `right`, `bottom`, or `left`; placement can change when space is limited. `align` accepts `start`, `center`, or `end`. `offset` changes the gap in pixels."
		},
		{
			"heading": "position-alignment-and-offset",
			"content": "Content with a 16px gap."
		},
		{
			"heading": "position-alignment-and-offset",
			"content": "Content aligned to the end."
		},
		{
			"heading": "accessible-name-and-close-label",
			"content": "When there is no visible title, provide `aria-label`. Customize `closeLabel` to describe the close action in the language of your application."
		},
		{
			"heading": "accessible-name-and-close-label",
			"content": "Show completed items"
		},
		{
			"heading": "controlled-visibility",
			"content": "Pair `open` with `onOpenChange` to respond to trigger clicks and dismissal. Application actions inside the popover can close it through the same state. For uncontrolled usage, `defaultOpen` sets only the initial visibility."
		},
		{
			"heading": "api",
			"content": "| Prop      | Type           | Default  | Description                                        |\n| --------- | -------------- | -------- | -------------------------------------------------- |\n| `trigger` | `ReactElement` | Required | Single trigger accepting DOM attributes and a ref. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type        | Default  | Description                                    |\n| ---------- | ----------- | -------- | ---------------------------------------------- |\n| `children` | `ReactNode` | Required | Dialog body; may contain interactive controls. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type        | Default | Description                                 |\n| ------- | ----------- | ------- | ------------------------------------------- |\n| `title` | `ReactNode` | -       | Visible heading and accessible dialog name. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop         | Type     | Default | Description                            |\n| ------------ | -------- | ------- | -------------------------------------- |\n| `aria-label` | `string` | -       | Dialog name when no title is provided. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type      | Default | Description              |\n| ---------- | --------- | ------- | ------------------------ |\n| `closable` | `boolean` | `false` | Displays a close button. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop         | Type     | Default   | Description                          |\n| ------------ | -------- | --------- | ------------------------------------ |\n| `closeLabel` | `string` | `\"Close\"` | Accessible name of the close button. |",
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
			"content": "| Prop        | Type     | Default | Description                     |\n| ----------- | -------- | ------- | ------------------------------- |\n| `className` | `string` | -       | Additional class on the dialog. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type     | Default | Description                               |\n| ------------------ | -------- | ------- | ----------------------------------------- |\n| `triggerClassName` | `string` | -       | Additional class merged onto the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "focus-behavior",
			"content": "Opening moves focus to the first focusable element, or to the dialog itself. A popover that is open on first render does not take focus."
		},
		{
			"heading": "focus-behavior",
			"content": "Tab from the trigger enters the popover; Shift+Tab from its first element returns to the trigger."
		},
		{
			"heading": "focus-behavior",
			"content": "Tabbing past the last element, Escape and the close button close the popover and return focus to the trigger."
		},
		{
			"heading": "focus-behavior",
			"content": "Moving focus elsewhere or clicking outside closes it."
		},
		{
			"heading": "focus-behavior",
			"content": "The dialog has `role=\"dialog\"`. The trigger exposes `aria-haspopup=\"dialog\"`, `aria-expanded`, and, while open, `aria-controls`."
		},
		{
			"heading": "focus-behavior",
			"content": "Use Tooltip for short, non-interactive hints."
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
			"id": "position-alignment-and-offset",
			"content": "Position, alignment, and offset"
		},
		{
			"id": "accessible-name-and-close-label",
			"content": "Accessible name and close label"
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
			"id": "focus-behavior",
			"content": "Focus behavior"
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
		url: "#position-alignment-and-offset",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Position, alignment, and offset" })
	},
	{
		depth: 2,
		url: "#accessible-name-and-close-label",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessible name and close label" })
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
		url: "#focus-behavior",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Focus behavior" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
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
	}, { Button, Popover, Preview, Stack } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!Popover) _missingMdxReference("Popover", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Popover opens on click and contains an interactive, non-modal dialog. Use a focusable trigger that forwards its ref and event handlers, such as Puzzle ",
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
						children: " { Popover } "
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
			"Name the dialog with a visible ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "title" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "closable" }),
			" adds a close button alongside the title."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 320,
			align: "center",
			justify: "center",
			code: `\
<Popover trigger={<Button>Filters</Button>} title="Filters" closable>
<label>
  <input type="checkbox" /> Only available
</label>
</Popover>
`,
			children: (0, import_jsx_runtime.jsx)(Popover, {
				trigger: (0, import_jsx_runtime.jsx)(Button, { children: "Filters" }),
				title: "Filters",
				closable: true,
				children: (0, import_jsx_runtime.jsx)("label", { children: (0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)("input", { type: "checkbox" }), " Only available"] }) })
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "position-alignment-and-offset",
			children: "Position, alignment, and offset"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "position" }),
			" requests ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "top" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "right" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "bottom" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "left" }),
			"; placement can change when space is limited. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align" }),
			" accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "start" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "center" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "end" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }),
			" changes the gap in pixels."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 320,
			align: "center",
			justify: "center",
			code: `\
<Stack alignH="center">
<Popover position="top" align="start" offset={16} title="Above" closable trigger={<Button variant="outline">Top / start</Button>}>
  Content with a 16px gap.
</Popover>
<Popover position="bottom" align="end" title="Below" closable trigger={<Button variant="outline">Bottom / end</Button>}>
  Content aligned to the end.
</Popover>
</Stack>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				alignH: "center",
				children: [(0, import_jsx_runtime.jsx)(Popover, {
					position: "top",
					align: "start",
					offset: 16,
					title: "Above",
					closable: true,
					trigger: (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Top / start"
					}),
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Content with a 16px gap." })
				}), (0, import_jsx_runtime.jsx)(Popover, {
					position: "bottom",
					align: "end",
					title: "Below",
					closable: true,
					trigger: (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Bottom / end"
					}),
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Content aligned to the end." })
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessible-name-and-close-label",
			children: "Accessible name and close label"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When there is no visible title, provide ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			". Customize ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "closeLabel" }),
			" to describe the close action in the language of your application."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 280,
			align: "center",
			justify: "center",
			code: `\
<Popover aria-label="Display options" closable closeLabel="Close display options" trigger={<Button variant="outline">Display options</Button>}>
<label>
  <input type="checkbox" defaultChecked /> Show completed items
</label>
</Popover>
`,
			children: (0, import_jsx_runtime.jsx)(Popover, {
				"aria-label": "Display options",
				closable: true,
				closeLabel: "Close display options",
				trigger: (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Display options"
				}),
				children: (0, import_jsx_runtime.jsx)("label", { children: (0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					defaultChecked: true
				}), " Show completed items"] }) })
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-visibility",
			children: "Controlled visibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pair ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			" to respond to trigger clicks and dismissal. Application actions inside the popover can close it through the same state. For uncontrolled usage, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			" sets only the initial visibility."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 340,
			align: "center",
			justify: "center",
			code: `\
const [open, setOpen] = useState(false);

return (

<Popover open={open} onOpenChange={setOpen} title="Ready to continue?" trigger={<Button>Review changes</Button>}>
  <Stack>
    <p>Your changes are ready to save.</p>
    <Button onClick={() => setOpen(false)}>Done</Button>
  </Stack>
</Popover>
);
`,
			children: (0, import_jsx_runtime.jsx)(ControlledPopoverExample, {})
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dialog body; may contain interactive controls." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible heading and accessible dialog name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dialog name when no title is provided." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "closable" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays a close button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "closeLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Close\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name of the close button." })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the dialog." })
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
			id: "focus-behavior",
			children: "Focus behavior"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Opening moves focus to the first focusable element, or to the dialog itself. A popover that is open on first render does not take focus." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Tab from the trigger enters the popover; Shift+Tab from its first element returns to the trigger." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Tabbing past the last element, Escape and the close button close the popover and return focus to the trigger." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Moving focus elsewhere or clicking outside closes it." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The dialog has ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"dialog\"" }),
			". The trigger exposes ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-haspopup=\"dialog\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-expanded" }),
			", and, while open, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-controls" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/components/ui/overlays/tooltip",
				children: "Tooltip"
			}),
			" for short, non-interactive hints."
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
