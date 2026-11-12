import { ControlledAccordionExample, shippingItems } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/accordion.mdx_macro_id_src_2Flib_2Fsource-C48ueqbX.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Accordion",
	"description": "Show and hide related sections of content."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Accordion groups related sections behind expandable headings. Prefer stable item IDs when sections may be reordered."
		},
		{
			"heading": "basic-usage",
			"content": "Each item has a `title` and `content`. When using `defaultValue` or `value`, every item must also have a unique `id`."
		},
		{
			"heading": "basic-usage",
			"content": "The Support item demonstrates `disabled`: its trigger cannot be activated."
		},
		{
			"heading": "multiple-sections",
			"content": "`type=\"multiple\"` is the default. Pass an array of IDs to open more than one section. In multiple mode, `onValueChange` returns an array; in single mode it returns an ID or `null` when the last section closes."
		},
		{
			"heading": "keep-one-section-open",
			"content": "In single mode, `collapsible={false}` prevents the currently open section from being closed by its trigger. Set an initial value if a section should be open from the start."
		},
		{
			"heading": "controlled-selection",
			"content": "Pair `value` with `onValueChange`. Stable IDs keep open sections associated with the same items after reordering. Do not mix the ID-based and index-based selection APIs."
		},
		{
			"heading": "panel-lifecycle-and-semantics",
			"content": "`headingLevel` matches the surrounding document hierarchy. `region` explicitly enables or disables panel landmarks. With `unMountOnClose`, content unmounts after the closing animation; reopening resets local state. Enter a note and close/reopen the section to try it."
		},
		{
			"heading": "accordion",
			"content": "`AccordionItemId` is `string | number`. `AccordionValue` is an ID, a readonly array of IDs, or `null`."
		},
		{
			"heading": "accordion",
			"content": "| Prop    | Type                  | Default  | Description         |\n| ------- | --------------------- | -------- | ------------------- |\n| `items` | `AccordionItemData[]` | Required | Sections to render. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop   | Type                     | Default      | Description                             |\n| ------ | ------------------------ | ------------ | --------------------------------------- |\n| `type` | `\"single\" \\| \"multiple\"` | `\"multiple\"` | Whether more than one section can open. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop    | Type             | Default | Description                                             |\n| ------- | ---------------- | ------- | ------------------------------------------------------- |\n| `value` | `AccordionValue` | -       | Controlled open IDs; requires unique IDs on every item. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop           | Type             | Default | Description                    |\n| -------------- | ---------------- | ------- | ------------------------------ |\n| `defaultValue` | `AccordionValue` | -       | Initial uncontrolled open IDs. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop            | Type                                                            | Default | Description      |\n| --------------- | --------------------------------------------------------------- | ------- | ---------------- |\n| `onValueChange` | `(value: AccordionItemId \\| AccordionItemId[] \\| null) => void` | -       | Next open ID(s). |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop          | Type      | Default | Description                                      |\n| ------------- | --------- | ------- | ------------------------------------------------ |\n| `collapsible` | `boolean` | `true`  | Allows the open item to collapse in single mode. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop                     | Type       | Default | Description                                            |\n| ------------------------ | ---------- | ------- | ------------------------------------------------------ |\n| `initialOpenItemIndexes` | `number[]` | `[]`    | Initial uncontrolled open indexes (compatibility API). |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop              | Type       | Default | Description                                  |\n| ----------------- | ---------- | ------- | -------------------------------------------- |\n| `openItemIndexes` | `number[]` | -       | Controlled open indexes (compatibility API). |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop       | Type                          | Default | Description                                |\n| ---------- | ----------------------------- | ------- | ------------------------------------------ |\n| `onChange` | `(indexes: number[]) => void` | -       | Next open indexes, also called in ID mode. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop           | Type                         | Default | Description                          |\n| -------------- | ---------------------------- | ------- | ------------------------------------ |\n| `headingLevel` | `1 \\| 2 \\| 3 \\| 4 \\| 5 \\| 6` | `3`     | Semantic heading level for triggers. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop     | Type      | Default             | Description                      |\n| -------- | --------- | ------------------- | -------------------------------- |\n| `region` | `boolean` | `items.length <= 6` | Adds region landmarks to panels. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop             | Type      | Default | Description                                   |\n| ---------------- | --------- | ------- | --------------------------------------------- |\n| `unMountOnClose` | `boolean` | `false` | Unmounts content after its closing animation. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop        | Type     | Default | Description                       |\n| ----------- | -------- | ------- | --------------------------------- |\n| `className` | `string` | -       | Additional class on the root div. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop               | Type     | Default | Description                       |\n| ------------------ | -------- | ------- | --------------------------------- |\n| `triggerClassName` | `string` | -       | Additional class on each trigger. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop             | Type     | Default | Description                              |\n| ---------------- | -------- | ------- | ---------------------------------------- |\n| `panelClassName` | `string` | -       | Additional class on each animated panel. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "| Prop               | Type     | Default | Description                               |\n| ------------------ | -------- | ------- | ----------------------------------------- |\n| `contentClassName` | `string` | -       | Additional class on each content wrapper. |",
			"table": "table-0"
		},
		{
			"heading": "accordion",
			"content": "Other native div attributes are forwarded to the root, except `children` and `onChange`."
		},
		{
			"heading": "accordionitemdata",
			"content": "| Prop | Type               | Default | Description                                         |\n| ---- | ------------------ | ------- | --------------------------------------------------- |\n| `id` | `string \\| number` | -       | Stable identifier; required for ID-based selection. |",
			"table": "table-1"
		},
		{
			"heading": "accordionitemdata",
			"content": "| Prop    | Type        | Default  | Description      |\n| ------- | ----------- | -------- | ---------------- |\n| `title` | `ReactNode` | Required | Trigger content. |",
			"table": "table-1"
		},
		{
			"heading": "accordionitemdata",
			"content": "| Prop      | Type        | Default  | Description               |\n| --------- | ----------- | -------- | ------------------------- |\n| `content` | `ReactNode` | Required | Expandable panel content. |",
			"table": "table-1"
		},
		{
			"heading": "accordionitemdata",
			"content": "| Prop       | Type      | Default | Description             |\n| ---------- | --------- | ------- | ----------------------- |\n| `disabled` | `boolean` | `false` | Prevents user toggling. |",
			"table": "table-1"
		},
		{
			"heading": "accessibility",
			"content": "Triggers are native buttons inside headings, with `aria-expanded` and `aria-controls`. Use Tab to move between enabled triggers and Enter or Space to toggle them. Keep headings concise and use the panel for longer content."
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
			"id": "multiple-sections",
			"content": "Multiple sections"
		},
		{
			"id": "keep-one-section-open",
			"content": "Keep one section open"
		},
		{
			"id": "controlled-selection",
			"content": "Controlled selection"
		},
		{
			"id": "panel-lifecycle-and-semantics",
			"content": "Panel lifecycle and semantics"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "accordion",
			"content": "Accordion"
		},
		{
			"id": "accordionitemdata",
			"content": "AccordionItemData"
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
		url: "#multiple-sections",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Multiple sections" })
	},
	{
		depth: 2,
		url: "#keep-one-section-open",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keep one section open" })
	},
	{
		depth: 2,
		url: "#controlled-selection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled selection" })
	},
	{
		depth: 2,
		url: "#panel-lifecycle-and-semantics",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Panel lifecycle and semantics" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#accordion",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accordion" })
	},
	{
		depth: 3,
		url: "#accordionitemdata",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "AccordionItemData" })
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
		input: "input",
		label: "label",
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
	}, { Accordion, Preview, Section } = _components;
	if (!Accordion) _missingMdxReference("Accordion", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Accordion groups related sections behind expandable headings. Prefer stable item IDs when sections may be reordered." }),
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
						children: " { Accordion, "
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "type"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " AccordionValue } "
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
			"Each item has a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "title" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "content" }),
			". When using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			", every item must also have a unique ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
const items = [
{ id: "shipping", title: "Shipping", content: "Orders ship within two business days." },
{ id: "returns", title: "Returns", content: "Return unused items within 30 days." },
{ id: "support", title: "Support", content: "Contact our team for help with your order.", disabled: true },
];

<Accordion items={items} type="single" defaultValue="shipping" />
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(Accordion, {
				items: shippingItems,
				type: "single",
				defaultValue: "shipping"
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The Support item demonstrates ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			": its trigger cannot be activated."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "multiple-sections",
			children: "Multiple sections"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "type=\"multiple\"" }),
			" is the default. Pass an array of IDs to open more than one section. In multiple mode, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }),
			" returns an array; in single mode it returns an ID or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
			" when the last section closes."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 380,
			code: `\
<Accordion items={items} type="multiple" defaultValue={["shipping", "returns"]} />
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(Accordion, {
				items: shippingItems,
				type: "multiple",
				defaultValue: ["shipping", "returns"]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "keep-one-section-open",
			children: "Keep one section open"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"In single mode, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "collapsible={false}" }),
			" prevents the currently open section from being closed by its trigger. Set an initial value if a section should be open from the start."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
<Accordion items={items} type="single" collapsible={false} defaultValue="shipping" />
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(Accordion, {
				items: shippingItems,
				type: "single",
				collapsible: false,
				defaultValue: "shipping"
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-selection",
			children: "Controlled selection"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pair ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }),
			". Stable IDs keep open sections associated with the same items after reordering. Do not mix the ID-based and index-based selection APIs."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 420,
			code: `\
const [value, setValue] = useState<AccordionValue>("shipping");

return (

<Stack>
  <Button variant="outline" onClick={() => setValue("returns")}>Show returns</Button>
  <Accordion items={items} type="single" value={value} onValueChange={setValue} />
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ControlledAccordionExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "panel-lifecycle-and-semantics",
			children: "Panel lifecycle and semantics"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "headingLevel" }),
			" matches the surrounding document hierarchy. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "region" }),
			" explicitly enables or disables panel landmarks. With ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "unMountOnClose" }),
			", content unmounts after the closing animation; reopening resets local state. Enter a note and close/reopen the section to try it."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 320,
			code: `\
<Accordion
headingLevel={4}
region={false}
unMountOnClose
type="single"
defaultValue="note"
items={[{
  id: "note",
  title: "Order note",
  content: <label>Note <input placeholder="Resets after closing" /></label>,
}]}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(Accordion, {
				headingLevel: 4,
				region: false,
				unMountOnClose: true,
				type: "single",
				defaultValue: "note",
				items: [{
					id: "note",
					title: "Order note",
					content: (0, import_jsx_runtime.jsxs)(_components.label, { children: ["Note ", (0, import_jsx_runtime.jsx)(_components.input, { placeholder: "Resets after closing" })] })
				}]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "accordion",
			children: "Accordion"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "AccordionItemId" }),
			" is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "AccordionValue" }),
			" is an ID, a readonly array of IDs, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "items" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AccordionItemData[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Sections to render." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "type" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"single\" | \"multiple\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"multiple\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Whether more than one section can open." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AccordionValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled open IDs; requires unique IDs on every item." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AccordionValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled open IDs." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: AccordionItemId | AccordionItemId[] | null) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Next open ID(s)." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "collapsible" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Allows the open item to collapse in single mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "initialOpenItemIndexes" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled open indexes (compatibility API)." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "openItemIndexes" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled open indexes (compatibility API)." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(indexes: number[]) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Next open indexes, also called in ID mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "headingLevel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1 | 2 | 3 | 4 | 5 | 6" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "3" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Semantic heading level for triggers." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "region" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "items.length <= 6" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Adds region landmarks to panels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "unMountOnClose" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Unmounts content after its closing animation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the root div." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "triggerClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on each trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "panelClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on each animated panel." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "contentClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on each content wrapper." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other native div attributes are forwarded to the root, except ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "accordionitemdata",
			children: "AccordionItemData"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Stable identifier; required for ID-based selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Trigger content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "content" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Expandable panel content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents user toggling." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Triggers are native buttons inside headings, with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-expanded" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-controls" }),
			". Use Tab to move between enabled triggers and Enter or Space to toggle them. Keep headings concise and use the panel for longer content."
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
