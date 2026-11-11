import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/tree-view.mdx_macro_id_src_2Flib_2Fsource-DoLsLfWf.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Tree View",
	"description": "Navigate and select items in a keyboard-accessible hierarchy."
};
var structuredData = {
	"contents": [
		{
			"heading": "hierarchy-and-selection",
			"content": "Each item needs a stable unique ID. Supply `textValue` for rich labels so typeahead can find them. Every tree requires an accessible name."
		},
		{
			"heading": "multiple-selection-and-navigation",
			"content": "`selectionMode=\"none\"` is useful for navigation trees. Link items can report route state with `getItemActive`. Use multiple selection for independent file-like choices."
		},
		{
			"heading": "api",
			"content": "| Prop    | Type                    | Default  | Description        |\n| ------- | ----------------------- | -------- | ------------------ |\n| `items` | `TreeViewItem<TData>[]` | Required | Hierarchical data. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                              | Type     | Default  | Description           |\n| --------------------------------- | -------- | -------- | --------------------- |\n| `aria-label` or `aria-labelledby` | `string` | Required | Accessible tree name. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop            | Type                               | Default    | Description         |\n| --------------- | ---------------------------------- | ---------- | ------------------- |\n| `selectionMode` | `\"none\" \\| \"single\" \\| \"multiple\"` | `\"single\"` | Selection behavior. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                                | Type       | Default | Description                   |\n| ----------------------------------- | ---------- | ------- | ----------------------------- |\n| `expandedIds`, `defaultExpandedIds` | `string[]` | `[]`    | Controlled/initial expansion. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type                      | Default | Description        |\n| ------------------ | ------------------------- | ------- | ------------------ |\n| `onExpandedChange` | `(ids: string[]) => void` | -       | Expansion changes. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                                | Type       | Default | Description                   |\n| ----------------------------------- | ---------- | ------- | ----------------------------- |\n| `selectedIds`, `defaultSelectedIds` | `string[]` | `[]`    | Controlled/initial selection. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                | Type                      | Default | Description        |\n| ------------------- | ------------------------- | ------- | ------------------ |\n| `onSelectionChange` | `(ids: string[]) => void` | -       | Selection changes. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type     | Default                     | Description           |\n| ------------------ | -------- | --------------------------- | --------------------- |\n| `defaultFocusedId` | `string` | Selected or first root item | Initial focus target. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop              | Type                   | Default | Description    |\n| ----------------- | ---------------------- | ------- | -------------- |\n| `onFocusedChange` | `(id: string) => void` | -       | Focus changes. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type                                       | Default | Description                            |\n| -------------- | ------------------------------------------ | ------- | -------------------------------------- |\n| `loadChildren` | `(item) => Promise<TreeViewItem<TData>[]>` | -       | Load children of a `hasChildren` item. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                  | Type                             | Default | Description           |\n| --------------------- | -------------------------------- | ------- | --------------------- |\n| `onLoadChildrenError` | `(item, error: unknown) => void` | -       | Handle load failures. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop             | Type             | Default | Description       |\n| ---------------- | ---------------- | ------- | ----------------- |\n| `onItemActivate` | `(item) => void` | -       | Enter activation. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop            | Type                | Default | Description              |\n| --------------- | ------------------- | ------- | ------------------------ |\n| `getItemActive` | `(item) => boolean` | -       | Current-route predicate. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                                      | Type                         | Default           | Description                     |\n| ----------------------------------------- | ---------------------------- | ----------------- | ------------------------------- |\n| `renderItem`, `renderIcon`, `renderLabel` | `(item, state) => ReactNode` | Built-in renderer | Non-interactive custom content. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                | Type      | Default | Description                     |\n| ------------------- | --------- | ------- | ------------------------------- |\n| `expandOnItemClick` | `boolean` | `false` | Toggle branches on label click. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type           | Default | Description |\n| ------ | -------------- | ------- | ----------- |\n| `size` | `\"sm\" \\| \"md\"` | `\"md\"`  | Density.    |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop          | Type               | Default       | Description            |\n| ------------- | ------------------ | ------------- | ---------------------- |\n| `indentation` | `string \\| number` | Theme spacing | Hierarchy indentation. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type      | Default | Description                 |\n| ----------- | --------- | ------- | --------------------------- |\n| `typeahead` | `boolean` | `true`  | Character-based navigation. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                             | Type     | Default           | Description             |\n| -------------------------------- | -------- | ----------------- | ----------------------- |\n| `loadingLabel`, `loadErrorLabel` | `string` | Built-in messages | Loading/error feedback. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop            | Type     | Default | Description         |\n| --------------- | -------- | ------- | ------------------- |\n| `itemClassName` | `string` | -       | Class on each item. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "Items require `id` and `label`; optional fields are `href`, `textValue`, `icon`, `endAdornment`, `children`, `hasChildren`, `disabled`, `selectable`, and `data`. Disabled branches can still expand. Rendering state contains `expanded`, `selected`, `focused`, `loading`, `disabled`, and `hasChildren`."
		},
		{
			"heading": "api",
			"content": "Arrow keys move through the hierarchy; Home/End reach boundaries, Enter activates, and Space selects. Re-collapse and re-expand a failed lazy branch to retry. Keep nested buttons and links out of custom row content."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "hierarchy-and-selection",
			"content": "Hierarchy and selection"
		},
		{
			"id": "multiple-selection-and-navigation",
			"content": "Multiple selection and navigation"
		},
		{
			"id": "api",
			"content": "API"
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
		url: "#hierarchy-and-selection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Hierarchy and selection" })
	},
	{
		depth: 2,
		url: "#multiple-selection-and-navigation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Multiple selection and navigation" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	}
];
function _createMdxContent(props) {
	const _components = {
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
	}, { Preview, Section, TreeView } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!TreeView) _missingMdxReference("TreeView", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
						children: " { TreeView, "
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
						children: " TreeViewItem } "
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
			id: "hierarchy-and-selection",
			children: "Hierarchy and selection"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Each item needs a stable unique ID. Supply ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
			" for rich labels so typeahead can find them. Every tree requires an accessible name."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 400,
			code: `\
<TreeView aria-label="Project files" defaultExpandedIds={["src"]} items={[
{ id: "src", label: "src", children: [
  { id: "app", label: "app.tsx" },
  { id: "styles", label: "styles.css" },
] },
{ id: "readme", label: "README.md" },
{ id: "archive", label: "Archive", disabled: true },
]} />
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(TreeView, {
				"aria-label": "Project files",
				defaultExpandedIds: ["src"],
				items: [
					{
						id: "src",
						label: "src",
						children: [{
							id: "app",
							label: "app.tsx"
						}, {
							id: "styles",
							label: "styles.css"
						}]
					},
					{
						id: "readme",
						label: "README.md"
					},
					{
						id: "archive",
						label: "Archive",
						disabled: true
					}
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "multiple-selection-and-navigation",
			children: "Multiple selection and navigation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "selectionMode=\"none\"" }),
			" is useful for navigation trees. Link items can report route state with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "getItemActive" }),
			". Use multiple selection for independent file-like choices."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 300,
			code: `\
<TreeView aria-label="Choose resources" selectionMode="multiple" size="sm"
defaultSelectedIds={["guides"]}
items={[{ id: "guides", label: "Guides" }, { id: "examples", label: "Examples" }]}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(TreeView, {
				"aria-label": "Choose resources",
				selectionMode: "multiple",
				size: "sm",
				defaultSelectedIds: ["guides"],
				items: [{
					id: "guides",
					label: "Guides"
				}, {
					id: "examples",
					label: "Examples"
				}]
			}) })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "items" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "TreeViewItem<TData>[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Hierarchical data." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
					" or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible tree name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "selectionMode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"none\" | \"single\" | \"multiple\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"single\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selection behavior." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "expandedIds" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultExpandedIds" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled/initial expansion." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onExpandedChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(ids: string[]) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Expansion changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "selectedIds" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultSelectedIds" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled/initial selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onSelectionChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(ids: string[]) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selection changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultFocusedId" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selected or first root item" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial focus target." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onFocusedChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(id: string) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Focus changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loadChildren" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(item) => Promise<TreeViewItem<TData>[]>" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Load children of a ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "hasChildren" }),
					" item."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onLoadChildrenError" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(item, error: unknown) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Handle load failures." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onItemActivate" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(item) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Enter activation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "getItemActive" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(item) => boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Current-route predicate." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "renderItem" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "renderIcon" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "renderLabel" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(item, state) => ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Built-in renderer" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Non-interactive custom content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "expandOnItemClick" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Toggle branches on label click." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Density." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "indentation" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Theme spacing" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Hierarchy indentation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "typeahead" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Character-based navigation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loadingLabel" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loadErrorLabel" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Built-in messages" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Loading/error feedback." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "itemClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Class on each item." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Items require ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			"; optional fields are ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "endAdornment" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "hasChildren" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "selectable" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "data" }),
			". Disabled branches can still expand. Rendering state contains ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "expanded" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "selected" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "focused" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "hasChildren" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Arrow keys move through the hierarchy; Home/End reach boundaries, Enter activates, and Space selects. Re-collapse and re-expand a failed lazy branch to retry. Keep nested buttons and links out of custom row content." })
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
