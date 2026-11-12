import { ControlledTabsExample } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/tabs.mdx_macro_id_src_2Flib_2Fsource-j9zLLBdV.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Tabs",
	"description": "Switch between related panels of content."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Organize related content into panels, with a single selected tab at a time. Compose `Tabs` with direct `Tabs.Tab` children, each with a unique `id`."
		},
		{
			"heading": "basic-usage",
			"content": "`tab` supplies the trigger label, and `children` supplies the panel content. `initialActiveId` chooses the initial panel; otherwise the first enabled tab is selected."
		},
		{
			"heading": "basic-usage",
			"content": "A summary of your project."
		},
		{
			"heading": "basic-usage",
			"content": "Project settings and details."
		},
		{
			"heading": "tab-bar-position",
			"content": "`tabBarPosition` supports `top`, `bottom`, `left`, and `right`. Left and right positions use vertical keyboard navigation."
		},
		{
			"heading": "tab-bar-position",
			"content": "Bottom navigation."
		},
		{
			"heading": "tab-bar-position",
			"content": "Recent activity."
		},
		{
			"heading": "tab-bar-position",
			"content": "Left navigation."
		},
		{
			"heading": "tab-bar-position",
			"content": "Recent activity."
		},
		{
			"heading": "tab-bar-position",
			"content": "Right navigation."
		},
		{
			"heading": "tab-bar-position",
			"content": "Recent activity."
		},
		{
			"heading": "controlled-selection",
			"content": "Use `activeId` with `onActivate` to own the selected tab. Do not combine controlled selection with `initialActiveId`."
		},
		{
			"heading": "preserve-panel-state",
			"content": "Inactive panel contents are unmounted by default. `forceMountContent` keeps them mounted but hidden, preserving local state and uncontrolled form values. Type a note, switch tabs, then return to see it preserved."
		},
		{
			"heading": "preserve-panel-state",
			"content": "Draft note"
		},
		{
			"heading": "preserve-panel-state",
			"content": "Your note stays mounted in the other panel."
		},
		{
			"heading": "disabled-tabs-and-rtl",
			"content": "Set `disabled` on a tab to prevent selection and skip it during keyboard navigation. Provide `dir=\"rtl\"` on `Tabs` for right-to-left horizontal arrow-key behavior."
		},
		{
			"heading": "disabled-tabs-and-rtl",
			"content": "Overview content"
		},
		{
			"heading": "disabled-tabs-and-rtl",
			"content": "Details content"
		},
		{
			"heading": "disabled-tabs-and-rtl",
			"content": "Settings content"
		},
		{
			"heading": "tabs",
			"content": "| Prop       | Type        | Default  | Description                 |\n| ---------- | ----------- | -------- | --------------------------- |\n| `children` | `ReactNode` | Required | Direct `Tabs.Tab` children. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop             | Type                                     | Default | Description                              |\n| ---------------- | ---------------------------------------- | ------- | ---------------------------------------- |\n| `tabBarPosition` | `\"top\" \\| \"bottom\" \\| \"left\" \\| \"right\"` | `\"top\"` | Position and orientation of the tab bar. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop              | Type     | Default           | Description                     |\n| ----------------- | -------- | ----------------- | ------------------------------- |\n| `initialActiveId` | `string` | First enabled tab | Initial uncontrolled selection. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop       | Type     | Default | Description                                                                       |\n| ---------- | -------- | ------- | --------------------------------------------------------------------------------- |\n| `activeId` | `string` | -       | Controlled selection. Invalid or disabled IDs fall back to the first enabled tab. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop         | Type                      | Default | Description                     |\n| ------------ | ------------------------- | ------- | ------------------------------- |\n| `onActivate` | `(tabId: string) => void` | -       | Called when a tab is activated. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop                | Type      | Default | Description                                       |\n| ------------------- | --------- | ------- | ------------------------------------------------- |\n| `forceMountContent` | `boolean` | `false` | Keeps inactive panel contents mounted and hidden. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop        | Type     | Default | Description                       |\n| ----------- | -------- | ------- | --------------------------------- |\n| `className` | `string` | -       | Additional class on the root div. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "| Prop  | Type                       | Default | Description                                                          |\n| ----- | -------------------------- | ------- | -------------------------------------------------------------------- |\n| `dir` | `\"ltr\" \\| \"rtl\" \\| \"auto\"` | -       | Root text direction; use explicit `rtl` for RTL keyboard navigation. |",
			"table": "table-0"
		},
		{
			"heading": "tabs",
			"content": "Other native div attributes are forwarded to the root, except `onChange`."
		},
		{
			"heading": "tabstab",
			"content": "`TabsTab` is also exported as a named alias of `Tabs.Tab`, with the same props and direct-child requirement."
		},
		{
			"heading": "tabstab",
			"content": "| Prop | Type     | Default  | Description            |\n| ---- | -------- | -------- | ---------------------- |\n| `id` | `string` | Required | Unique tab identifier. |",
			"table": "table-1"
		},
		{
			"heading": "tabstab",
			"content": "| Prop  | Type        | Default  | Description                |\n| ----- | ----------- | -------- | -------------------------- |\n| `tab` | `ReactNode` | Required | Content of the tab button. |",
			"table": "table-1"
		},
		{
			"heading": "tabstab",
			"content": "| Prop       | Type        | Default  | Description    |\n| ---------- | ----------- | -------- | -------------- |\n| `children` | `ReactNode` | Required | Panel content. |",
			"table": "table-1"
		},
		{
			"heading": "tabstab",
			"content": "| Prop       | Type      | Default | Description                   |\n| ---------- | --------- | ------- | ----------------------------- |\n| `disabled` | `boolean` | `false` | Prevents focus and selection. |",
			"table": "table-1"
		},
		{
			"heading": "accessibility",
			"content": "Tabs use automatic activation: arrow-key focus changes the selected panel. Horizontal tabs use Left/Right; vertical tabs use Up/Down. Home and End move to the first and last enabled tab. Tab buttons expose `aria-selected` and `aria-controls`, and each panel is labelled by its trigger."
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
			"id": "tab-bar-position",
			"content": "Tab bar position"
		},
		{
			"id": "controlled-selection",
			"content": "Controlled selection"
		},
		{
			"id": "preserve-panel-state",
			"content": "Preserve panel state"
		},
		{
			"id": "disabled-tabs-and-rtl",
			"content": "Disabled tabs and RTL"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "tabs",
			"content": "Tabs"
		},
		{
			"id": "tabstab",
			"content": "Tabs.Tab"
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
		url: "#tab-bar-position",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tab bar position" })
	},
	{
		depth: 2,
		url: "#controlled-selection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled selection" })
	},
	{
		depth: 2,
		url: "#preserve-panel-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Preserve panel state" })
	},
	{
		depth: 2,
		url: "#disabled-tabs-and-rtl",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled tabs and RTL" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#tabs",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tabs" })
	},
	{
		depth: 3,
		url: "#tabstab",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tabs.Tab" })
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
	}, { Preview, Section, Stack, Tabs } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Stack) _missingMdxReference("Stack", true);
	if (!Tabs) _missingMdxReference("Tabs", true);
	if (!Tabs.Tab) _missingMdxReference("Tabs.Tab", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Organize related content into panels, with a single selected tab at a time. Compose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Tabs" }),
			" with direct ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Tabs.Tab" }),
			" children, each with a unique ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
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
						children: " { Tabs } "
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
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tab" }),
			" supplies the trigger label, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			" supplies the panel content. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "initialActiveId" }),
			" chooses the initial panel; otherwise the first enabled tab is selected."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			code: `\
<Tabs initialActiveId="details">
<Tabs.Tab id="overview" tab="Overview">A summary of your project.</Tabs.Tab>
<Tabs.Tab id="details" tab="Details">Project settings and details.</Tabs.Tab>
</Tabs>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Tabs, {
				initialActiveId: "details",
				children: [(0, import_jsx_runtime.jsx)(Tabs.Tab, {
					id: "overview",
					tab: "Overview",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "A summary of your project." })
				}), (0, import_jsx_runtime.jsx)(Tabs.Tab, {
					id: "details",
					tab: "Details",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Project settings and details." })
				})]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "tab-bar-position",
			children: "Tab bar position"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tabBarPosition" }),
			" supports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "top" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "bottom" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "left" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "right" }),
			". Left and right positions use vertical keyboard navigation."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 540,
			code: `\
<Stack>
<Tabs tabBarPosition="bottom">
  <Tabs.Tab id="summary" tab="Summary">Bottom navigation.</Tabs.Tab>
  <Tabs.Tab id="activity" tab="Activity">Recent activity.</Tabs.Tab>
</Tabs>
<Tabs tabBarPosition="left">
  <Tabs.Tab id="summary" tab="Summary">Left navigation.</Tabs.Tab>
  <Tabs.Tab id="activity" tab="Activity">Recent activity.</Tabs.Tab>
</Tabs>
<Tabs tabBarPosition="right">
  <Tabs.Tab id="summary" tab="Summary">Right navigation.</Tabs.Tab>
  <Tabs.Tab id="activity" tab="Activity">Recent activity.</Tabs.Tab>
</Tabs>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsxs)(Tabs, {
					tabBarPosition: "bottom",
					children: [(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "summary",
						tab: "Summary",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Bottom navigation." })
					}), (0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "activity",
						tab: "Activity",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Recent activity." })
					})]
				}),
				(0, import_jsx_runtime.jsxs)(Tabs, {
					tabBarPosition: "left",
					children: [(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "summary",
						tab: "Summary",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Left navigation." })
					}), (0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "activity",
						tab: "Activity",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Recent activity." })
					})]
				}),
				(0, import_jsx_runtime.jsxs)(Tabs, {
					tabBarPosition: "right",
					children: [(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "summary",
						tab: "Summary",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Right navigation." })
					}), (0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "activity",
						tab: "Activity",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Recent activity." })
					})]
				})
			] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-selection",
			children: "Controlled selection"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "activeId" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onActivate" }),
			" to own the selected tab. Do not combine controlled selection with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "initialActiveId" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 240,
			code: `\
const [activeId, setActiveId] = useState("overview");

return (

<Tabs activeId={activeId} onActivate={setActiveId}>
  <Tabs.Tab id="overview" tab="Overview">Selected tab: {activeId}</Tabs.Tab>
  <Tabs.Tab id="details" tab="Details">Selected tab: {activeId}</Tabs.Tab>
</Tabs>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ControlledTabsExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "preserve-panel-state",
			children: "Preserve panel state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Inactive panel contents are unmounted by default. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "forceMountContent" }),
			" keeps them mounted but hidden, preserving local state and uncontrolled form values. Type a note, switch tabs, then return to see it preserved."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 300,
			code: `\
<Tabs forceMountContent>
<Tabs.Tab id="notes" tab="Notes">
  <label>Draft note <input placeholder="Write a note" /></label>
</Tabs.Tab>
<Tabs.Tab id="help" tab="Help">Your note stays mounted in the other panel.</Tabs.Tab>
</Tabs>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Tabs, {
				forceMountContent: true,
				children: [(0, import_jsx_runtime.jsx)(Tabs.Tab, {
					id: "notes",
					tab: "Notes",
					children: (0, import_jsx_runtime.jsx)("label", { children: (0, import_jsx_runtime.jsxs)(_components.p, { children: ["Draft note ", (0, import_jsx_runtime.jsx)("input", { placeholder: "Write a note" })] }) })
				}), (0, import_jsx_runtime.jsx)(Tabs.Tab, {
					id: "help",
					tab: "Help",
					children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Your note stays mounted in the other panel." })
				})]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "disabled-tabs-and-rtl",
			children: "Disabled tabs and RTL"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" on a tab to prevent selection and skip it during keyboard navigation. Provide ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "dir=\"rtl\"" }),
			" on ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Tabs" }),
			" for right-to-left horizontal arrow-key behavior."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 280,
			code: `\
<Tabs dir="rtl" initialActiveId="details">
<Tabs.Tab id="overview" tab="Overview">Overview content</Tabs.Tab>
<Tabs.Tab id="details" tab="Details">Details content</Tabs.Tab>
<Tabs.Tab id="settings" tab="Settings" disabled>Settings content</Tabs.Tab>
</Tabs>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Tabs, {
				dir: "rtl",
				initialActiveId: "details",
				children: [
					(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "overview",
						tab: "Overview",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Overview content" })
					}),
					(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "details",
						tab: "Details",
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Details content" })
					}),
					(0, import_jsx_runtime.jsx)(Tabs.Tab, {
						id: "settings",
						tab: "Settings",
						disabled: true,
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Settings content" })
					})
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "tabs",
			children: "Tabs"
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
					(0, import_jsx_runtime.jsx)(_components.code, { children: "Tabs.Tab" }),
					" children."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "tabBarPosition" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"top\" | \"bottom\" | \"left\" | \"right\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"top\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Position and orientation of the tab bar." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "initialActiveId" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "First enabled tab" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "activeId" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled selection. Invalid or disabled IDs fall back to the first enabled tab." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onActivate" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(tabId: string) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when a tab is activated." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "forceMountContent" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Keeps inactive panel contents mounted and hidden." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the root div." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "dir" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"ltr\" | \"rtl\" | \"auto\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Root text direction; use explicit ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "rtl" }),
					" for RTL keyboard navigation."
				] })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other native div attributes are forwarded to the root, except ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "tabstab",
			children: "Tabs.Tab"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "TabsTab" }),
			" is also exported as a named alias of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Tabs.Tab" }),
			", with the same props and direct-child requirement."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Unique tab identifier." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "tab" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content of the tab button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Panel content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents focus and selection." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Tabs use automatic activation: arrow-key focus changes the selected panel. Horizontal tabs use Left/Right; vertical tabs use Up/Down. Home and End move to the first and last enabled tab. Tab buttons expose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-selected" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-controls" }),
			", and each panel is labelled by its trigger."
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
