import { ControlledStepperExample } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/stepper.mdx_macro_id_src_2Flib_2Fsource-ByPWQGkL.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Stepper",
	"description": "Show progress through a sequence of steps."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Stepper shows progress through a sequence. It does not render panels or validate a form: your application owns the content and the rules for advancing."
		},
		{
			"heading": "basic-usage",
			"content": "Compose direct `Stepper.Step` children. Steps before the active step are completed automatically. Stable IDs preserve selection when steps are reordered; every step needs a unique ID in ID-based mode, and the active ID must match an available step."
		},
		{
			"heading": "orientation-and-supporting-text",
			"content": "`orientation` accepts `\"horizontal\"`, `\"vertical\"`, or a responsive object. Use `description` for supporting text and `optional` to identify a non-required step. Change device sizes to see the layout switch."
		},
		{
			"heading": "clickable-and-non-linear-steps",
			"content": "`clickable` turns selectable steps into buttons. By default, `linear` allows only the current and earlier steps to be selected. Set `linear={false}` to allow navigation to future steps; `disabled` still prevents selection."
		},
		{
			"heading": "completed-error-and-custom-icons",
			"content": "`completed` overrides automatic completion. `error` takes precedence over other visual states. `icon` replaces the numeric or state indicator; keep the visible `label` meaningful because the indicator is hidden from assistive technology."
		},
		{
			"heading": "controlled-progress",
			"content": "Use `activeStep` with `onStepChange` for zero-based index selection. An external Continue action can advance progress while clickable steps allow returning to completed work. ID-based controlled selection uses `activeStepId` with `onStepIdChange` instead; do not mix the two modes."
		},
		{
			"heading": "stepper",
			"content": "| Prop       | Type        | Default  | Description                     |\n| ---------- | ----------- | -------- | ------------------------------- |\n| `children` | `ReactNode` | Required | Direct `Stepper.Step` children. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop         | Type     | Default | Description                                              |\n| ------------ | -------- | ------- | -------------------------------------------------------- |\n| `activeStep` | `number` | -       | Controlled zero-based index, clamped to available steps. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop                | Type     | Default | Description                 |\n| ------------------- | -------- | ------- | --------------------------- |\n| `defaultActiveStep` | `number` | `0`     | Initial uncontrolled index. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop           | Type                     | Default | Description                                            |\n| -------------- | ------------------------ | ------- | ------------------------------------------------------ |\n| `onStepChange` | `(step: number) => void` | -       | Next index after user selection, including in ID mode. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop           | Type               | Default | Description                                         |\n| -------------- | ------------------ | ------- | --------------------------------------------------- |\n| `activeStepId` | `string \\| number` | -       | Controlled stable ID; must match an available step. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop                  | Type               | Default | Description                     |\n| --------------------- | ------------------ | ------- | ------------------------------- |\n| `defaultActiveStepId` | `string \\| number` | -       | Initial uncontrolled stable ID. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop             | Type                                 | Default | Description                         |\n| ---------------- | ------------------------------------ | ------- | ----------------------------------- |\n| `onStepIdChange` | `(stepId: string \\| number) => void` | -       | Next ID after selection in ID mode. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop          | Type                                          | Default        | Description                                                              |\n| ------------- | --------------------------------------------- | -------------- | ------------------------------------------------------------------------ |\n| `orientation` | `ResponsiveValue<\"horizontal\" \\| \"vertical\">` | `\"horizontal\"` | Layout direction; responsive keys are `mobile`, `tablet`, and `desktop`. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop        | Type      | Default | Description                          |\n| ----------- | --------- | ------- | ------------------------------------ |\n| `clickable` | `boolean` | `false` | Renders step buttons for navigation. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop     | Type      | Default | Description                                       |\n| -------- | --------- | ------- | ------------------------------------------------- |\n| `linear` | `boolean` | `true`  | Prevents selecting steps ahead of the active one. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop        | Type     | Default | Description                                |\n| ----------- | -------- | ------- | ------------------------------------------ |\n| `className` | `string` | -       | Additional class on the root ordered list. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "| Prop  | Type                       | Default | Description                                                             |\n| ----- | -------------------------- | ------- | ----------------------------------------------------------------------- |\n| `dir` | `\"ltr\" \\| \"rtl\" \\| \"auto\"` | -       | Root direction; explicit `rtl` reverses horizontal keyboard navigation. |",
			"table": "table-0"
		},
		{
			"heading": "stepper",
			"content": "Other native ordered-list attributes are forwarded to the root."
		},
		{
			"heading": "stepperstep",
			"content": "| Prop | Type               | Default | Description                                           |\n| ---- | ------------------ | ------- | ----------------------------------------------------- |\n| `id` | `string \\| number` | -       | Stable identifier; required on every step in ID mode. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop    | Type        | Default  | Description         |\n| ------- | ----------- | -------- | ------------------- |\n| `label` | `ReactNode` | Required | Visible step label. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop          | Type        | Default | Description                        |\n| ------------- | ----------- | ------- | ---------------------------------- |\n| `description` | `ReactNode` | -       | Supporting text beneath the label. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop       | Type        | Default | Description                    |\n| ---------- | ----------- | ------- | ------------------------------ |\n| `optional` | `ReactNode` | -       | Additional optional-step text. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop   | Type        | Default | Description               |\n| ------ | ----------- | ------- | ------------------------- |\n| `icon` | `ReactNode` | -       | Custom indicator content. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop        | Type      | Default            | Description                     |\n| ----------- | --------- | ------------------ | ------------------------------- |\n| `completed` | `boolean` | Before active step | Overrides automatic completion. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop    | Type      | Default | Description              |\n| ------- | --------- | ------- | ------------------------ |\n| `error` | `boolean` | `false` | Displays an error state. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop       | Type      | Default | Description                       |\n| ---------- | --------- | ------- | --------------------------------- |\n| `disabled` | `boolean` | `false` | Prevents navigation to this step. |",
			"table": "table-1"
		},
		{
			"heading": "stepperstep",
			"content": "| Prop        | Type     | Default | Description                             |\n| ----------- | -------- | ------- | --------------------------------------- |\n| `className` | `string` | -       | Additional class on the step list item. |",
			"table": "table-1"
		},
		{
			"heading": "accessibility",
			"content": "Clickable steps use roving focus: arrow keys move focus (in either orientation), Home and End move to the first and last selectable step, and Enter or Space activates the focused step. With the default `linear` behavior, steps ahead of the active step cannot be selected."
		},
		{
			"heading": "accessibility",
			"content": "The active list item exposes `aria-current=\"step\"`. Give the ordered list a descriptive `aria-label` when there are multiple progress indicators."
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
			"id": "orientation-and-supporting-text",
			"content": "Orientation and supporting text"
		},
		{
			"id": "clickable-and-non-linear-steps",
			"content": "Clickable and non-linear steps"
		},
		{
			"id": "completed-error-and-custom-icons",
			"content": "Completed, error, and custom icons"
		},
		{
			"id": "controlled-progress",
			"content": "Controlled progress"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "stepper",
			"content": "Stepper"
		},
		{
			"id": "stepperstep",
			"content": "Stepper.Step"
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
		url: "#orientation-and-supporting-text",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Orientation and supporting text" })
	},
	{
		depth: 2,
		url: "#clickable-and-non-linear-steps",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Clickable and non-linear steps" })
	},
	{
		depth: 2,
		url: "#completed-error-and-custom-icons",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Completed, error, and custom icons" })
	},
	{
		depth: 2,
		url: "#controlled-progress",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled progress" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#stepper",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Stepper" })
	},
	{
		depth: 3,
		url: "#stepperstep",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Stepper.Step" })
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
	}, { Icon, Preview, Section, Stepper } = _components;
	if (!Icon) _missingMdxReference("Icon", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Stepper) _missingMdxReference("Stepper", true);
	if (!Stepper.Step) _missingMdxReference("Stepper.Step", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Stepper shows progress through a sequence. It does not render panels or validate a form: your application owns the content and the rules for advancing." }),
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
						children: " { Stepper } "
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
			"Compose direct ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Stepper.Step" }),
			" children. Steps before the active step are completed automatically. Stable IDs preserve selection when steps are reordered; every step needs a unique ID in ID-based mode, and the active ID must match an available step."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			code: `\
<Stepper defaultActiveStepId="shipping" aria-label="Checkout progress">
<Stepper.Step id="details" label="Details" />
<Stepper.Step id="shipping" label="Shipping" />
<Stepper.Step id="payment" label="Payment" />
</Stepper>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stepper, {
				defaultActiveStepId: "shipping",
				"aria-label": "Checkout progress",
				children: [
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "details",
						label: "Details"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "shipping",
						label: "Shipping"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "payment",
						label: "Payment"
					})
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "orientation-and-supporting-text",
			children: "Orientation and supporting text"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }),
			" accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"vertical\"" }),
			", or a responsive object. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "description" }),
			" for supporting text and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "optional" }),
			" to identify a non-required step. Change device sizes to see the layout switch."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 420,
			code: `\
<Stepper
orientation={{ mobile: "vertical", tablet: "horizontal" }}
defaultActiveStep={1}
>
<Stepper.Step label="Details" description="Your contact information" />
<Stepper.Step label="Shipping" description="Delivery address" />
<Stepper.Step label="Gift note" optional="Optional" />
</Stepper>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stepper, {
				orientation: {
					mobile: "vertical",
					tablet: "horizontal"
				},
				defaultActiveStep: 1,
				children: [
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Details",
						description: "Your contact information"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Shipping",
						description: "Delivery address"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Gift note",
						optional: "Optional"
					})
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "clickable-and-non-linear-steps",
			children: "Clickable and non-linear steps"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clickable" }),
			" turns selectable steps into buttons. By default, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "linear" }),
			" allows only the current and earlier steps to be selected. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "linear={false}" }),
			" to allow navigation to future steps; ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" still prevents selection."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 340,
			code: `\
<Stepper clickable linear={false} defaultActiveStepId="details" orientation="vertical">
<Stepper.Step id="details" label="Details" />
<Stepper.Step id="shipping" label="Shipping" />
<Stepper.Step id="payment" label="Payment" disabled description="Not available yet" />
</Stepper>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stepper, {
				clickable: true,
				linear: false,
				defaultActiveStepId: "details",
				orientation: "vertical",
				children: [
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "details",
						label: "Details"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "shipping",
						label: "Shipping"
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						id: "payment",
						label: "Payment",
						disabled: true,
						description: "Not available yet"
					})
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "completed-error-and-custom-icons",
			children: "Completed, error, and custom icons"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "completed" }),
			" overrides automatic completion. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "error" }),
			" takes precedence over other visual states. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }),
			" replaces the numeric or state indicator; keep the visible ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			" meaningful because the indicator is hidden from assistive technology."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 380,
			code: `\
<Stepper defaultActiveStep={1} orientation="vertical">
<Stepper.Step label="Account" completed icon={<Icon name="akar-icons:check" size={20} />} />
<Stepper.Step label="Address" error description="Add a valid postal code to continue." />
<Stepper.Step label="Payment" completed={false} optional="Choose a method later" />
</Stepper>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stepper, {
				defaultActiveStep: 1,
				orientation: "vertical",
				children: [
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Account",
						completed: true,
						icon: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:check",
							size: 20
						})
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Address",
						error: true,
						description: "Add a valid postal code to continue."
					}),
					(0, import_jsx_runtime.jsx)(Stepper.Step, {
						label: "Payment",
						completed: false,
						optional: "Choose a method later"
					})
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-progress",
			children: "Controlled progress"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "activeStep" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onStepChange" }),
			" for zero-based index selection. An external Continue action can advance progress while clickable steps allow returning to completed work. ID-based controlled selection uses ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "activeStepId" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onStepIdChange" }),
			" instead; do not mix the two modes."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
const [activeStep, setActiveStep] = useState(0);

return (

<Stack>
  <Stepper activeStep={activeStep} onStepChange={setActiveStep} clickable>
    <Stepper.Step label="Details" />
    <Stepper.Step label="Shipping" />
    <Stepper.Step label="Payment" />
  </Stepper>
  <Stack direction="row">
    <Button variant="outline" disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
    <Button disabled={activeStep === 2} onClick={() => setActiveStep(activeStep + 1)}>Continue</Button>
  </Stack>
  <span role="status">Step {activeStep + 1} of 3</span>
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ControlledStepperExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "stepper",
			children: "Stepper"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Direct ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "Stepper.Step" }),
					" children."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "activeStep" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled zero-based index, clamped to available steps." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultActiveStep" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled index." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onStepChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(step: number) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Next index after user selection, including in ID mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "activeStepId" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled stable ID; must match an available step." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultActiveStepId" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled stable ID." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onStepIdChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(stepId: string | number) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Next ID after selection in ID mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "orientation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ResponsiveValue<\"horizontal\" | \"vertical\">" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"horizontal\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Layout direction; responsive keys are ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "mobile" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "tablet" }),
					", and ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "desktop" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clickable" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Renders step buttons for navigation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "linear" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents selecting steps ahead of the active one." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the root ordered list." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "dir" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"ltr\" | \"rtl\" | \"auto\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Root direction; explicit ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "rtl" }),
					" reverses horizontal keyboard navigation."
				] })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Other native ordered-list attributes are forwarded to the root." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "stepperstep",
			children: "Stepper.Step"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Stable identifier; required on every step in ID mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible step label." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Supporting text beneath the label." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "optional" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional optional-step text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Custom indicator content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "completed" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Before active step" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Overrides automatic completion." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "error" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays an error state." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents navigation to this step." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the step list item." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Clickable steps use roving focus: arrow keys move focus (in either orientation), Home and End move to the first and last selectable step, and Enter or Space activates the focused step. With the default ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "linear" }),
			" behavior, steps ahead of the active step cannot be selected."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The active list item exposes ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-current=\"step\"" }),
			". Give the ordered list a descriptive ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			" when there are multiple progress indicators."
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
