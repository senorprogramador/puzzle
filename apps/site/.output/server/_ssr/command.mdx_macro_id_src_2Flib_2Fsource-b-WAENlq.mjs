import { CommandDialogExample, CommandExample } from "./doc-examples-BedOXFxx.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/command.mdx_macro_id_src_2Flib_2Fsource-b-WAENlq.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Command",
	"description": "Searchable, keyboard-navigable command lists and command palettes."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Command provides a searchable list of actions. Use it inline for a compact action menu, or use `CommandDialog` to present the list as a modal command palette."
		},
		{
			"heading": "inline-command-list",
			"content": "Pass commands as data. By default, search matches every query term against each command's label, description, keywords, and group, without case or accent sensitivity. Select an item with a click or the keyboard."
		},
		{
			"heading": "command-dialog",
			"content": "`CommandDialog` wraps the list in a modal dialog. It opens with `⌘K` on macOS or `Ctrl+K` elsewhere by default, and closes after a command is selected. The shortcut is ignored while focus is in an editable field. Set `shortcut={false}` to disable it."
		},
		{
			"heading": "command-dialog",
			"content": "Visibility can be controlled with `open` and `onOpenChange`, or initialized with `defaultOpen`. When controlled, update `open` in response to `onOpenChange`."
		},
		{
			"heading": "filtering-and-query-state",
			"content": "Use `query` with `onQueryChange` to control the search input. `defaultQuery` sets its initial value when using the built-in state. Provide `filter` to replace the default matching behavior:"
		},
		{
			"heading": "filtering-and-query-state",
			"content": "Use `loading` and `loadingMessage` while searching asynchronously. `emptyMessage` customizes the no-results message. Disabled items remain visible but cannot be selected or reached with keyboard navigation."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Arrow Up and Arrow Down move between enabled commands; navigation wraps by default. Set `loop={false}` to stop at the ends."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Enter selects the active command. Ctrl/Cmd+Home and Ctrl/Cmd+End move to the first and last enabled command."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "`autoFocus` focuses the search input on mount and is enabled by default."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "The search input is a labeled combobox associated with a listbox. Groups, disabled options, and result/loading status are exposed to assistive technology. Set `label` to provide a useful accessible name when the default is not appropriate."
		},
		{
			"heading": "command",
			"content": "| Prop       | Type            | Default  | Description       |\n| ---------- | --------------- | -------- | ----------------- |\n| `commands` | `CommandItem[]` | Required | Items to display. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop          | Type     | Default                | Description               |\n| ------------- | -------- | ---------------------- | ------------------------- |\n| `placeholder` | `string` | `\"Search commands...\"` | Search input placeholder. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop    | Type     | Default             | Description                           |\n| ------- | -------- | ------------------- | ------------------------------------- |\n| `label` | `string` | `\"Search commands\"` | Accessible name for the search input. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop           | Type        | Default                | Description                                     |\n| -------------- | ----------- | ---------------------- | ----------------------------------------------- |\n| `emptyMessage` | `ReactNode` | `\"No commands found.\"` | Message shown when there are no matching items. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop      | Type      | Default | Description                                  |\n| --------- | --------- | ------- | -------------------------------------------- |\n| `loading` | `boolean` | `false` | Shows the loading state instead of the list. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop             | Type        | Default          | Description                      |\n| ---------------- | ----------- | ---------------- | -------------------------------- |\n| `loadingMessage` | `ReactNode` | `\"Searching...\"` | Loading and live-region message. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop     | Type                          | Default        | Description                                            |\n| -------- | ----------------------------- | -------------- | ------------------------------------------------------ |\n| `filter` | `(command, query) => boolean` | Default search | Custom matching function; replaces the default filter. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop    | Type     | Default | Description                                         |\n| ------- | -------- | ------- | --------------------------------------------------- |\n| `query` | `string` | -       | Controlled search query. Pair with `onQueryChange`. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop           | Type     | Default | Description                              |\n| -------------- | -------- | ------- | ---------------------------------------- |\n| `defaultQuery` | `string` | `\"\"`    | Initial query for an uncontrolled input. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop            | Type                      | Default | Description                           |\n| --------------- | ------------------------- | ------- | ------------------------------------- |\n| `onQueryChange` | `(query: string) => void` | -       | Called when the search query changes. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop       | Type                             | Default | Description                                 |\n| ---------- | -------------------------------- | ------- | ------------------------------------------- |\n| `onSelect` | `(command: CommandItem) => void` | -       | Called when an enabled command is selected. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop   | Type      | Default | Description                                    |\n| ------ | --------- | ------- | ---------------------------------------------- |\n| `loop` | `boolean` | `true`  | Whether keyboard navigation wraps at the ends. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop        | Type      | Default | Description                      |\n| ----------- | --------- | ------- | -------------------------------- |\n| `autoFocus` | `boolean` | `true`  | Focus the search input on mount. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "| Prop        | Type     | Default | Description                           |\n| ----------- | -------- | ------- | ------------------------------------- |\n| `className` | `string` | -       | Additional class on the root element. |",
			"table": "table-0"
		},
		{
			"heading": "command",
			"content": "`Command` also accepts standard `div` attributes, except `children` and `onSelect`."
		},
		{
			"heading": "commanddialog",
			"content": "| Prop   | Type      | Default | Description            |\n| ------ | --------- | ------- | ---------------------- |\n| `open` | `boolean` | -       | Controlled visibility. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop          | Type      | Default | Description                           |\n| ------------- | --------- | ------- | ------------------------------------- |\n| `defaultOpen` | `boolean` | `false` | Initial visibility when uncontrolled. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop           | Type                      | Default | Description                                   |\n| -------------- | ------------------------- | ------- | --------------------------------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Called when visibility changes are requested. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop    | Type        | Default             | Description   |\n| ------- | ----------- | ------------------- | ------------- |\n| `title` | `ReactNode` | `\"Command palette\"` | Dialog title. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop          | Type     | Default | Description                  |\n| ------------- | -------- | ------- | ---------------------------- |\n| `description` | `string` | -       | Optional dialog description. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop       | Type              | Default | Description                                                                      |\n| ---------- | ----------------- | ------- | -------------------------------------------------------------------------------- |\n| `shortcut` | `string \\| false` | `\"k\"`   | Key used with Ctrl/Cmd to toggle the dialog, or `false` to disable the shortcut. |",
			"table": "table-1"
		},
		{
			"heading": "commanddialog",
			"content": "| Prop                                                                                                                                                                 | Type              | Default           | Description                          |\n| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------- | ------------------------------------ |\n| `commands`, `placeholder`, `label`, `emptyMessage`, `loading`, `loadingMessage`, `filter`, `onSelect`, `onQueryChange`, `query`, `defaultQuery`, `loop`, `className` | Same as `Command` | Same as `Command` | Props forwarded to the command list. |",
			"table": "table-1"
		},
		{
			"heading": "commanditem",
			"content": "| Property | Type     | Description                                         |\n| -------- | -------- | --------------------------------------------------- |\n| `id`     | `string` | Unique item identifier, also used as its React key. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property | Type     | Description           |\n| -------- | -------- | --------------------- |\n| `label`  | `string` | Primary command text. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property      | Type     | Description                                          |\n| ------------- | -------- | ---------------------------------------------------- |\n| `description` | `string` | Optional secondary text; included in default search. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property   | Type       | Description                  |\n| ---------- | ---------- | ---------------------------- |\n| `keywords` | `string[]` | Optional extra search terms. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property | Type     | Description                                         |\n| -------- | -------- | --------------------------------------------------- |\n| `group`  | `string` | Optional group heading; included in default search. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property   | Type     | Description                                     |\n| ---------- | -------- | ----------------------------------------------- |\n| `shortcut` | `string` | Optional shortcut hint displayed with the item. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property | Type        | Description               |\n| -------- | ----------- | ------------------------- |\n| `icon`   | `ReactNode` | Optional decorative icon. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property   | Type      | Description                            |\n| ---------- | --------- | -------------------------------------- |\n| `disabled` | `boolean` | Prevents selection and keyboard focus. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "| Property   | Type         | Description                                |\n| ---------- | ------------ | ------------------------------------------ |\n| `onSelect` | `() => void` | Optional item-specific selection callback. |",
			"table": "table-2"
		},
		{
			"heading": "commanditem",
			"content": "When selected, an item's `onSelect` runs before the component's `onSelect`. `CommandDialog` then requests that the dialog close."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "inline-command-list",
			"content": "Inline command list"
		},
		{
			"id": "command-dialog",
			"content": "Command dialog"
		},
		{
			"id": "filtering-and-query-state",
			"content": "Filtering and query state"
		},
		{
			"id": "keyboard-interaction-and-accessibility",
			"content": "Keyboard interaction and accessibility"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "command",
			"content": "`Command`"
		},
		{
			"id": "commanddialog",
			"content": "`CommandDialog`"
		},
		{
			"id": "commanditem",
			"content": "`CommandItem`"
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
		url: "#inline-command-list",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Inline command list" })
	},
	{
		depth: 2,
		url: "#command-dialog",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Command dialog" })
	},
	{
		depth: 2,
		url: "#filtering-and-query-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Filtering and query state" })
	},
	{
		depth: 2,
		url: "#keyboard-interaction-and-accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keyboard interaction and accessibility" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#command",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)("code", { children: "Command" }) })
	},
	{
		depth: 3,
		url: "#commanddialog",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)("code", { children: "CommandDialog" }) })
	},
	{
		depth: 3,
		url: "#commanditem",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)("code", { children: "CommandItem" }) })
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
	}, { Preview } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Command provides a searchable list of actions. Use it inline for a compact action menu, or use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CommandDialog" }),
			" to present the list as a modal command palette."
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
						children: " { Command, CommandDialog } "
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
			id: "inline-command-list",
			children: "Inline command list"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Pass commands as data. By default, search matches every query term against each command's label, description, keywords, and group, without case or accent sensitivity. Select an item with a click or the keyboard." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 440,
			code: `\
const commands = [
{ id: "new-file", label: "New file", group: "File", keywords: ["create"] },
{ id: "settings", label: "Settings", group: "Preferences" },
];

<Command
commands={commands}
autoFocus={false}
onSelect={(command) => console.log(command.id)}
/>
`,
			children: (0, import_jsx_runtime.jsx)(CommandExample, {})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "command-dialog",
			children: "Command dialog"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CommandDialog" }),
			" wraps the list in a modal dialog. It opens with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "⌘K" }),
			" on macOS or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Ctrl+K" }),
			" elsewhere by default, and closes after a command is selected. The shortcut is ignored while focus is in an editable field. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "shortcut={false}" }),
			" to disable it."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			code: `\
<CommandDialog
title="Project commands"
commands={commands}
onSelect={(command) => runCommand(command.id)}
/>
`,
			children: (0, import_jsx_runtime.jsx)(CommandDialogExample, {})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Visibility can be controlled with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			", or initialized with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			". When controlled, update ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" in response to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "filtering-and-query-state",
			children: "Filtering and query state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "query" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onQueryChange" }),
			" to control the search input. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultQuery" }),
			" sets its initial value when using the built-in state. Provide ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "filter" }),
			" to replace the default matching behavior:"
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
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "<"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "Command"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  commands"
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
							children: "{commands}"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  query"
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
							children: "{query}"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  onQueryChange"
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
							children: "{setQuery}"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  filter"
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
							children: "{("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "command"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "search"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ") "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=>"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " command.id."
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "startsWith"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(search)}"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "/>"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loadingMessage" }),
			" while searching asynchronously. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "emptyMessage" }),
			" customizes the no-results message. Disabled items remain visible but cannot be selected or reached with keyboard navigation."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "keyboard-interaction-and-accessibility",
			children: "Keyboard interaction and accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Arrow Up and Arrow Down move between enabled commands; navigation wraps by default. Set ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "loop={false}" }),
				" to stop at the ends."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Enter selects the active command. Ctrl/Cmd+Home and Ctrl/Cmd+End move to the first and last enabled command." }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "autoFocus" }), " focuses the search input on mount and is enabled by default."] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The search input is a labeled combobox associated with a listbox. Groups, disabled options, and result/loading status are exposed to assistive technology. Set ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
				" to provide a useful accessible name when the default is not appropriate."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "command",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Command" })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "commands" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CommandItem[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Items to display." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "placeholder" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Search commands...\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Search input placeholder." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Search commands\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name for the search input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "emptyMessage" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"No commands found.\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Message shown when there are no matching items." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Shows the loading state instead of the list." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loadingMessage" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Searching...\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Loading and live-region message." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "filter" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(command, query) => boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Default search" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Custom matching function; replaces the default filter." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "query" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Controlled search query. Pair with ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onQueryChange" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultQuery" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial query for an uncontrolled input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onQueryChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(query: string) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when the search query changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(command: CommandItem) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when an enabled command is selected." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loop" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Whether keyboard navigation wraps at the ends." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "autoFocus" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Focus the search input on mount." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the root element." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Command" }),
			" also accepts standard ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "div" }),
			" attributes, except ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "commanddialog",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CommandDialog" })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial visibility when uncontrolled." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when visibility changes are requested." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Command palette\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dialog title." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional dialog description." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "shortcut" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"k\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Key used with Ctrl/Cmd to toggle the dialog, or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "false" }),
					" to disable the shortcut."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "commands" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "placeholder" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "emptyMessage" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loadingMessage" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "filter" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onQueryChange" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "query" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultQuery" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loop" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "className" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: ["Same as ", (0, import_jsx_runtime.jsx)(_components.code, { children: "Command" })] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: ["Same as ", (0, import_jsx_runtime.jsx)(_components.code, { children: "Command" })] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Props forwarded to the command list." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "commanditem",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CommandItem" })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Property" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Unique item identifier, also used as its React key." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Primary command text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional secondary text; included in default search." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "keywords" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional extra search terms." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "group" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional group heading; included in default search." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "shortcut" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional shortcut hint displayed with the item." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional decorative icon." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents selection and keyboard focus." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "() => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional item-specific selection callback." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When selected, an item's ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
			" runs before the component's ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CommandDialog" }),
			" then requests that the dialog close."
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
