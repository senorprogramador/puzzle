import { DropdownMenuExample } from "./doc-examples-CB6xK7z_.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/dropdown-menu.mdx_macro_id_src_2Flib_2Fsource-2n2QpIol.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Dropdown Menu",
	"description": "An accessible, keyboard-navigable menu of actions anchored to a trigger."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "DropdownMenu displays a set of actions in a popout attached to a trigger. Its compound components support grouped actions, checkable options, and mutually exclusive choices."
		},
		{
			"heading": "basic-usage",
			"content": "Every menu requires exactly one `DropdownMenu.Trigger` and one `DropdownMenu.Content`. `asChild` lets the trigger use a custom element, such as a Puzzle `Button`."
		},
		{
			"heading": "basic-usage",
			"content": "The root can be controlled with `open` and `onOpenChange`, or initialized with `defaultOpen`. When controlled, update `open` in response to `onOpenChange`. Set `disabled` on the root or trigger to prevent opening."
		},
		{
			"heading": "groups-checkboxes-and-radio-choices",
			"content": "Use `Group` and `Label` to organize actions and `Separator` to divide sections. Checkbox items stay open by default so users can make multiple choices; radio items close the menu by default after selection."
		},
		{
			"heading": "groups-checkboxes-and-radio-choices",
			"content": "Checkbox items can also use `defaultChecked` when uncontrolled. Radio groups accept `defaultValue` for an uncontrolled selection. `checked=\"indeterminate\"` is available for a checkbox item to expose a mixed state."
		},
		{
			"heading": "position-and-sizing",
			"content": "`position` requests a side of the trigger (`top`, `right`, `bottom`, or `left`); the popout may adjust when space is limited. `align` accepts `start`, `center`, or `end`. `offset` and `collisionPadding` are pixel values. Set `matchTriggerWidth` to make the content match the trigger width. Use `DropdownMenu.Content`'s `maxHeight` to control its maximum height."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "The trigger exposes menu-button semantics and opens on click, Enter, Space, Arrow Down, or Arrow Up. Arrow Up opens with focus on the last enabled item; other opening actions focus the first."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Within the menu, Arrow Up and Arrow Down move between enabled items; Home and End focus the first and last item. Typing characters moves focus by item text."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Enter or Space activates the focused item. Escape closes the menu and restores focus to the trigger. Tab closes the menu and moves focus out of it."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Disabled items cannot be activated or reached using menu navigation. Use `textValue` when an item's visible content is not a suitable typeahead label."
		},
		{
			"heading": "keyboard-interaction-and-accessibility",
			"content": "Give the trigger a meaningful accessible name. The content is labelled by the trigger by default; `aria-label` can provide a direct name on `DropdownMenu.Content`."
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop       | Type        | Default  | Description                                                |\n| ---------- | ----------- | -------- | ---------------------------------------------------------- |\n| `children` | `ReactNode` | Required | One `DropdownMenu.Trigger` and one `DropdownMenu.Content`. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop   | Type      | Default | Description            |\n| ------ | --------- | ------- | ---------------------- |\n| `open` | `boolean` | -       | Controlled visibility. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop          | Type      | Default | Description                           |\n| ------------- | --------- | ------- | ------------------------------------- |\n| `defaultOpen` | `boolean` | `false` | Initial visibility when uncontrolled. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop           | Type                      | Default | Description                                   |\n| -------------- | ------------------------- | ------- | --------------------------------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Called when visibility changes are requested. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop       | Type      | Default | Description                |\n| ---------- | --------- | ------- | -------------------------- |\n| `disabled` | `boolean` | `false` | Prevents opening the menu. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop       | Type                                     | Default    | Description                    |\n| ---------- | ---------------------------------------- | ---------- | ------------------------------ |\n| `position` | `\"top\" \\| \"right\" \\| \"bottom\" \\| \"left\"` | `\"bottom\"` | Preferred side of the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop    | Type                           | Default   | Description                  |\n| ------- | ------------------------------ | --------- | ---------------------------- |\n| `align` | `\"start\" \\| \"center\" \\| \"end\"` | `\"start\"` | Alignment along the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop     | Type     | Default | Description                     |\n| -------- | -------- | ------- | ------------------------------- |\n| `offset` | `number` | `8`     | Gap from the trigger in pixels. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop               | Type     | Default | Description                                      |\n| ------------------ | -------- | ------- | ------------------------------------------------ |\n| `collisionPadding` | `number` | `8`     | Minimum space from the viewport edges in pixels. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop                | Type      | Default | Description                             |\n| ------------------- | --------- | ------- | --------------------------------------- |\n| `matchTriggerWidth` | `boolean` | `false` | Match the content width to the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "dropdownmenu",
			"content": "| Prop                                   | Type     | Default | Description                                   |\n| -------------------------------------- | -------- | ------- | --------------------------------------------- |\n| `triggerClassName`, `contentClassName` | `string` | -       | Additional classes on the trigger or content. |",
			"table": "table-0"
		},
		{
			"heading": "compound-components",
			"content": "| Component              | Key props                                    | Description                                                                   |\n| ---------------------- | -------------------------------------------- | ----------------------------------------------------------------------------- |\n| `DropdownMenu.Trigger` | `asChild`, `disabled`, standard button props | Trigger button. With `asChild`, composes its behavior onto one child element. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component              | Key props                                                        | Description                                                          |\n| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |\n| `DropdownMenu.Content` | `maxHeight`, `aria-label`, `aria-labelledby`, standard div props | Menu panel; labelled by the trigger unless `aria-label` is provided. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component           | Key props                                                                  | Description                                                                                                                                                              |\n| ------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |\n| `DropdownMenu.Item` | `asChild`, `disabled`, `textValue`, `closeOnSelect`, `variant`, `onSelect` | Action item. `variant=\"danger\"` emphasizes destructive actions. By default, selection closes the menu; prevent the event's default action in `onSelect` to keep it open. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component            | Key props                        | Description                |\n| -------------------- | -------------------------------- | -------------------------- |\n| `DropdownMenu.Group` | `aria-label`, standard div props | Groups related menu items. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component            | Key props                      | Description               |\n| -------------------- | ------------------------------ | ------------------------- |\n| `DropdownMenu.Label` | `children`, standard div props | Text label for a section. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component                | Key props          | Description                            |\n| ------------------------ | ------------------ | -------------------------------------- |\n| `DropdownMenu.Separator` | standard div props | Horizontal separator between sections. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component                   | Key props                                                                                            | Description                                                                                           |\n| --------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |\n| `DropdownMenu.CheckboxItem` | `checked`, `defaultChecked`, `onCheckedChange`, `closeOnSelect`, `disabled`, `textValue`, `onSelect` | Checkable option. Uncontrolled by default; does not close on selection unless `closeOnSelect` is set. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component                 | Key props                                | Description                           |\n| ------------------------- | ---------------------------------------- | ------------------------------------- |\n| `DropdownMenu.RadioGroup` | `value`, `defaultValue`, `onValueChange` | Holds mutually exclusive radio items. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "| Component                | Key props                                                     | Description                                                  |\n| ------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------ |\n| `DropdownMenu.RadioItem` | `value`, `closeOnSelect`, `disabled`, `textValue`, `onSelect` | Choice within a radio group; closes on selection by default. |",
			"table": "table-1"
		},
		{
			"heading": "compound-components",
			"content": "Items also accept standard button attributes, and groups, labels, separators, and content accept standard div attributes. Item `onSelect` receives the triggering mouse event. Each item supports `textValue` for keyboard typeahead when its text content is unsuitable."
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
			"id": "groups-checkboxes-and-radio-choices",
			"content": "Groups, checkboxes, and radio choices"
		},
		{
			"id": "position-and-sizing",
			"content": "Position and sizing"
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
			"id": "dropdownmenu",
			"content": "`DropdownMenu`"
		},
		{
			"id": "compound-components",
			"content": "Compound components"
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
		url: "#groups-checkboxes-and-radio-choices",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Groups, checkboxes, and radio choices" })
	},
	{
		depth: 2,
		url: "#position-and-sizing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Position and sizing" })
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
		url: "#dropdownmenu",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)("code", { children: "DropdownMenu" }) })
	},
	{
		depth: 3,
		url: "#compound-components",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Compound components" })
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "DropdownMenu displays a set of actions in a popout attached to a trigger. Its compound components support grouped actions, checkable options, and mutually exclusive choices." }),
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
						children: " { DropdownMenu } "
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
			"Every menu requires exactly one ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Trigger" }),
			" and one ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Content" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "asChild" }),
			" lets the trigger use a custom element, such as a Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Button" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 340,
			code: `\
<DropdownMenu>
<DropdownMenu.Trigger asChild>
  <Button variant="outline">Project options</Button>
</DropdownMenu.Trigger>
<DropdownMenu.Content>
  <DropdownMenu.Item onSelect={() => editProject()}>
    Edit project
  </DropdownMenu.Item>
  <DropdownMenu.Item onSelect={() => duplicateProject()}>
    Duplicate project
  </DropdownMenu.Item>
  <DropdownMenu.Separator />
  <DropdownMenu.Item variant="danger" onSelect={() => deleteProject()}>
    Delete project
  </DropdownMenu.Item>
</DropdownMenu.Content>
</DropdownMenu>
`,
			children: (0, import_jsx_runtime.jsx)(DropdownMenuExample, {})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The root can be controlled with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			", or initialized with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			". When controlled, update ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" in response to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			". Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" on the root or trigger to prevent opening."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "groups-checkboxes-and-radio-choices",
			children: "Groups, checkboxes, and radio choices"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Group" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Label" }),
			" to organize actions and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Separator" }),
			" to divide sections. Checkbox items stay open by default so users can make multiple choices; radio items close the menu by default after selection."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 380,
			code: `\
<DropdownMenu.CheckboxItem
checked={showArchived}
onCheckedChange={setShowArchived}
>
Show archived
</DropdownMenu.CheckboxItem>

<DropdownMenu.RadioGroup value={density} onValueChange={setDensity}>
<DropdownMenu.Label>Density</DropdownMenu.Label>
<DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
<DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
`,
			children: (0, import_jsx_runtime.jsx)(DropdownMenuExample, {})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Checkbox items can also use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultChecked" }),
			" when uncontrolled. Radio groups accept ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" for an uncontrolled selection. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "checked=\"indeterminate\"" }),
			" is available for a checkbox item to expose a mixed state."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "position-and-sizing",
			children: "Position and sizing"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "position" }),
			" requests a side of the trigger (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "top" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "right" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "bottom" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "left" }),
			"); the popout may adjust when space is limited. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align" }),
			" accepts ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "start" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "center" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "end" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "collisionPadding" }),
			" are pixel values. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "matchTriggerWidth" }),
			" to make the content match the trigger width. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Content" }),
			"'s ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxHeight" }),
			" to control its maximum height."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "keyboard-interaction-and-accessibility",
			children: "Keyboard interaction and accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The trigger exposes menu-button semantics and opens on click, Enter, Space, Arrow Down, or Arrow Up. Arrow Up opens with focus on the last enabled item; other opening actions focus the first." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Within the menu, Arrow Up and Arrow Down move between enabled items; Home and End focus the first and last item. Typing characters moves focus by item text." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Enter or Space activates the focused item. Escape closes the menu and restores focus to the trigger. Tab closes the menu and moves focus out of it." }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Disabled items cannot be activated or reached using menu navigation. Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
				" when an item's visible content is not a suitable typeahead label."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Give the trigger a meaningful accessible name. The content is labelled by the trigger by default; ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
				" can provide a direct name on ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Content" }),
				"."
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
			id: "dropdownmenu",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu" })
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
					"One ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Trigger" }),
					" and one ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Content" }),
					"."
				] })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial visibility when uncontrolled." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when visibility changes are requested." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents opening the menu." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "position" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"top\" | \"right\" | \"bottom\" | \"left\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"bottom\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Preferred side of the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "align" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\" | \"center\" | \"end\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Alignment along the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Gap from the trigger in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "collisionPadding" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Minimum space from the viewport edges in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "matchTriggerWidth" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Match the content width to the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "triggerClassName" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "contentClassName" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional classes on the trigger or content." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "compound-components",
			children: "Compound components"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Component" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Key props" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Trigger" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "asChild" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
					", standard button props"
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Trigger button. With ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "asChild" }),
					", composes its behavior onto one child element."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Content" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "maxHeight" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
					", standard div props"
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Menu panel; labelled by the trigger unless ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
					" is provided."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Item" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "asChild" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "closeOnSelect" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Action item. ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "variant=\"danger\"" }),
					" emphasizes destructive actions. By default, selection closes the menu; prevent the event's default action in ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
					" to keep it open."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Group" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }), ", standard div props"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Groups related menu items." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Label" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }), ", standard div props"] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Text label for a section." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.Separator" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "standard div props" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Horizontal separator between sections." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.CheckboxItem" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "checked" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultChecked" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onCheckedChange" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "closeOnSelect" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Checkable option. Uncontrolled by default; does not close on selection unless ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "closeOnSelect" }),
					" is set."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.RadioGroup" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Holds mutually exclusive radio items." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "DropdownMenu.RadioItem" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "closeOnSelect" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Choice within a radio group; closes on selection by default." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Items also accept standard button attributes, and groups, labels, separators, and content accept standard div attributes. Item ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onSelect" }),
			" receives the triggering mouse event. Each item supports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "textValue" }),
			" for keyboard typeahead when its text content is unsuitable."
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
