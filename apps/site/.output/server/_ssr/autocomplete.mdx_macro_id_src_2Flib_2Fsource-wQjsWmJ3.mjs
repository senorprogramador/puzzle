import { AutocompleteExample } from "./doc-examples-BedOXFxx.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/autocomplete.mdx_macro_id_src_2Flib_2Fsource-wQjsWmJ3.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Autocomplete",
	"description": "Search options, select multiple values, or accept custom text."
};
var structuredData = {
	"contents": [
		{
			"heading": "controlled-selection",
			"content": "Options pair a display `label` with a typed `value`. Clearing a controlled single selection produces `undefined`, not `null`."
		},
		{
			"heading": "multiple-values-and-custom-text",
			"content": "`multiple` uses an array. `freeSolo` permits text not present in the options; Enter commits it. Use `maxSelected` to limit selections."
		},
		{
			"heading": "selection-and-input",
			"content": "`V` is `T`, or `T | string` when `freeSolo` is enabled."
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop      | Type                               | Default  | Description         |\n| --------- | ---------------------------------- | -------- | ------------------- |\n| `options` | `readonly AutocompleteOption<T>[]` | Required | Searchable options. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                    | Type                                                 | Default | Description                   |\n| ----------------------- | ---------------------------------------------------- | ------- | ----------------------------- |\n| `value`, `defaultValue` | `V \\| undefined`, or `readonly V[]` in multiple mode | -       | Controlled/initial selection. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop       | Type                                                          | Default | Description         |\n| ---------- | ------------------------------------------------------------- | ------- | ------------------- |\n| `onChange` | `(value: V \\| undefined) => void`, or `(values: V[]) => void` | -       | Selection callback. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                   | Type      | Default | Description                        |\n| ---------------------- | --------- | ------- | ---------------------------------- |\n| `multiple`, `freeSolo` | `boolean` | `false` | Multiple selection or custom text. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                            | Type        | Default | Description               |\n| ------------------------------- | ----------- | ------- | ------------------------- |\n| `label`, `description`, `error` | `ReactNode` | -       | Accessible field content. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                               | Type      | Default | Description  |\n| ---------------------------------- | --------- | ------- | ------------ |\n| `disabled`, `required`, `readOnly` | `boolean` | `false` | Input state. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                              | Type     | Default | Description                     |\n| --------------------------------- | -------- | ------- | ------------------------------- |\n| `inputValue`, `defaultInputValue` | `string` | -       | Controlled/initial search text. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop            | Type                     | Default | Description                                           |\n| --------------- | ------------------------ | ------- | ----------------------------------------------------- |\n| `onInputChange` | `(text, reason) => void` | -       | Reasons: `\"input\"`, `\"reset\"`, `\"clear\"`, `\"select\"`. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop           | Type     | Default | Description              |\n| -------------- | -------- | ------- | ------------------------ |\n| `name`, `form` | `string` | -       | Native form association. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop             | Type                   | Default                | Description                       |\n| ---------------- | ---------------------- | ---------------------- | --------------------------------- |\n| `serializeValue` | `(value: V) => string` | Built-in serialization | Hidden-input value serialization. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                   | Type                                                   | Default           | Description                     |\n| ---------------------- | ------------------------------------------------------ | ----------------- | ------------------------------- |\n| `isOptionEqualToValue` | `(option: AutocompleteOption<T>, value: V) => boolean` | Built-in equality | Match object-valued selections. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop            | Type                               | Default         | Description              |\n| --------------- | ---------------------------------- | --------------- | ------------------------ |\n| `filterOptions` | `(options, inputValue) => options` | Built-in filter | Custom search filtering. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop           | Type                           | Default                  | Description                            |\n| -------------- | ------------------------------ | ------------------------ | -------------------------------------- |\n| `renderOption` | `(option, state) => ReactNode` | Option label/description | Custom non-interactive option content. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                        | Type     | Default | Description                          |\n| --------------------------- | -------- | ------- | ------------------------------------ |\n| `maxSelected`, `maxOptions` | `number` | -       | Selection and visible-option limits. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                    | Type      | Default | Description            |\n| ----------------------- | --------- | ------- | ---------------------- |\n| `filterSelectedOptions` | `boolean` | -       | Hide selected options. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop        | Type      | Default | Description         |\n| ----------- | --------- | ------- | ------------------- |\n| `clearable` | `boolean` | `true`  | Show clear control. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop                              | Type     | Default                         | Description             |\n| --------------------------------- | -------- | ------------------------------- | ----------------------- |\n| `clearLabel`, `removeOptionLabel` | `string` | `\"Clear selection\"`, `\"Remove\"` | Accessible button text. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop          | Type      | Default             | Description                      |\n| ------------- | --------- | ------------------- | -------------------------------- |\n| `clearOnBlur` | `boolean` | Depends on freeSolo | Reset uncommitted input on blur. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-input",
			"content": "| Prop            | Type      | Default | Description            |\n| --------------- | --------- | ------- | ---------------------- |\n| `clearOnEscape` | `boolean` | `false` | Allow Escape to clear. |",
			"table": "table-0"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                  | Type      | Default | Description                    |\n| --------------------- | --------- | ------- | ------------------------------ |\n| `open`, `defaultOpen` | `boolean` | `false` | Controlled/initial menu state. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop           | Type                      | Default | Description         |\n| -------------- | ------------------------- | ------- | ------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Menu state changes. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                           | Type      | Default | Description                                  |\n| ------------------------------ | --------- | ------- | -------------------------------------------- |\n| `openOnFocus`, `autoHighlight` | `boolean` | `false` | Open on focus or highlight the first option. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop            | Type      | Default                       | Description             |\n| --------------- | --------- | ----------------------------- | ----------------------- |\n| `closeOnSelect` | `boolean` | Single: true; multiple: false | Dismiss after choosing. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop      | Type      | Default | Description    |\n| --------- | --------- | ------- | -------------- |\n| `loading` | `boolean` | `false` | Loading state. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                           | Type        | Default                                      | Description    |\n| ------------------------------ | ----------- | -------------------------------------------- | -------------- |\n| `loadingText`, `noOptionsText` | `ReactNode` | `\"Loading options...\"`, `\"No options found\"` | Menu feedback. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop              | Type     | Default                      | Description                  |\n| ----------------- | -------- | ---------------------------- | ---------------------------- |\n| `requiredMessage` | `string` | `\"Please select an option.\"` | Required validation message. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop       | Type                                     | Default    | Description     |\n| ---------- | ---------------------------------------- | ---------- | --------------- |\n| `position` | `\"top\" \\| \"right\" \\| \"bottom\" \\| \"left\"` | `\"bottom\"` | Preferred side. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop    | Type                           | Default   | Description |\n| ------- | ------------------------------ | --------- | ----------- |\n| `align` | `\"start\" \\| \"center\" \\| \"end\"` | `\"start\"` | Alignment.  |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                         | Type     | Default | Description                      |\n| ---------------------------- | -------- | ------- | -------------------------------- |\n| `offset`, `collisionPadding` | `number` | `8`     | Positioning distances in pixels. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                | Type      | Default | Description               |\n| ------------------- | --------- | ------- | ------------------------- |\n| `matchTriggerWidth` | `boolean` | `true`  | Menu width follows input. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop            | Type               | Default   | Description        |\n| --------------- | ------------------ | --------- | ------------------ |\n| `menuMaxHeight` | `string \\| number` | `\"18rem\"` | Menu height limit. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop   | Type                              | Default | Description |\n| ------ | --------------------------------- | ------- | ----------- |\n| `size` | Responsive `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Input size. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop        | Type                 | Default | Description           |\n| ----------- | -------------------- | ------- | --------------------- |\n| `fullWidth` | Responsive `boolean` | `false` | Fill available width. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "| Prop                                                                                  | Type     | Default | Description           |\n| ------------------------------------------------------------------------------------- | -------- | ------- | --------------------- |\n| `className`, `inputClassName`, `popoverClassName`, `menuClassName`, `optionClassName` | `string` | -       | Scoped styling hooks. |",
			"table": "table-1"
		},
		{
			"heading": "menu-and-presentation",
			"content": "Options support `id`, `value`, `label`, `description`, `group`, and `disabled`. Standard input attributes and refs are supported. Arrow keys navigate, Enter selects, and Escape closes. Custom renderers must not nest interactive controls inside options."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "controlled-selection",
			"content": "Controlled selection"
		},
		{
			"id": "multiple-values-and-custom-text",
			"content": "Multiple values and custom text"
		},
		{
			"id": "validation-and-loading",
			"content": "Validation and loading"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "selection-and-input",
			"content": "Selection and input"
		},
		{
			"id": "menu-and-presentation",
			"content": "Menu and presentation"
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
		url: "#controlled-selection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled selection" })
	},
	{
		depth: 2,
		url: "#multiple-values-and-custom-text",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Multiple values and custom text" })
	},
	{
		depth: 2,
		url: "#validation-and-loading",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Validation and loading" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#selection-and-input",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Selection and input" })
	},
	{
		depth: 3,
		url: "#menu-and-presentation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Menu and presentation" })
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
	}, { Autocomplete, Preview, Section, Stack } = _components;
	if (!Autocomplete) _missingMdxReference("Autocomplete", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Stack) _missingMdxReference("Stack", true);
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
						children: " { Autocomplete } "
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
			id: "controlled-selection",
			children: "Controlled selection"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Options pair a display ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			" with a typed ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			". Clearing a controlled single selection produces ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "undefined" }),
			", not ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 450,
			code: `\
const [value, setValue] = useState<string | undefined>();
<Autocomplete
label="Fruit"
options={[
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" },
  { value: "orange", label: "Orange" },
  { value: "mango", label: "Mango", disabled: true },
]}
value={value}
onChange={setValue}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(AutocompleteExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "multiple-values-and-custom-text",
			children: "Multiple values and custom text"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "multiple" }),
			" uses an array. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "freeSolo" }),
			" permits text not present in the options; Enter commits it. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxSelected" }),
			" to limit selections."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 500,
			code: `\
<Stack>
<Autocomplete label="Skills" multiple maxSelected={3} options={[
  { value: "react", label: "React", group: "Frontend" },
  { value: "typescript", label: "TypeScript", group: "Frontend" },
  { value: "go", label: "Go", group: "Backend" },
]} />
<Autocomplete label="Tag" freeSolo options={[{ value: "design", label: "Design" }]} />
<Autocomplete label="Unavailable" disabled options={[]} />
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsx)(Autocomplete, {
					label: "Skills",
					multiple: true,
					maxSelected: 3,
					options: [
						{
							value: "react",
							label: "React",
							group: "Frontend"
						},
						{
							value: "typescript",
							label: "TypeScript",
							group: "Frontend"
						},
						{
							value: "go",
							label: "Go",
							group: "Backend"
						}
					]
				}),
				(0, import_jsx_runtime.jsx)(Autocomplete, {
					label: "Tag",
					freeSolo: true,
					options: [{
						value: "design",
						label: "Design"
					}]
				}),
				(0, import_jsx_runtime.jsx)(Autocomplete, {
					label: "Unavailable",
					disabled: true,
					options: []
				})
			] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "validation-and-loading",
			children: "Validation and loading"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 400,
			code: `\
<Stack>
<Autocomplete label="Assignee" required error="Choose an assignee." options={[]} />
<Autocomplete label="Search users" loading loadingText="Finding users..." options={[]} />
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsx)(Autocomplete, {
				label: "Assignee",
				required: true,
				error: "Choose an assignee.",
				options: []
			}), (0, import_jsx_runtime.jsx)(Autocomplete, {
				label: "Search users",
				loading: true,
				loadingText: "Finding users...",
				options: []
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "selection-and-input",
			children: "Selection and input"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "V" }),
			" is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "T" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "T | string" }),
			" when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "freeSolo" }),
			" is enabled."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "options" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly AutocompleteOption<T>[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Searchable options." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" })
				] }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "V | undefined" }),
					", or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "readonly V[]" }),
					" in multiple mode"
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled/initial selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "(value: V | undefined) => void" }),
					", or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "(values: V[]) => void" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selection callback." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "multiple" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "freeSolo" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Multiple selection or custom text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "description" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "error" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible field content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "required" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "readOnly" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Input state." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "inputValue" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultInputValue" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled/initial search text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onInputChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(text, reason) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Reasons: ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"input\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"reset\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"clear\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"select\"" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "name" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "form" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native form association." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "serializeValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: V) => string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Built-in serialization" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Hidden-input value serialization." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "isOptionEqualToValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(option: AutocompleteOption<T>, value: V) => boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Built-in equality" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Match object-valued selections." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "filterOptions" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(options, inputValue) => options" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Built-in filter" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Custom search filtering." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "renderOption" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(option, state) => ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Option label/description" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Custom non-interactive option content." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "maxSelected" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "maxOptions" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selection and visible-option limits." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "filterSelectedOptions" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Hide selected options." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearable" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Show clear control." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "removeOptionLabel" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"Clear selection\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"Remove\"" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible button text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearOnBlur" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Depends on freeSolo" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Reset uncommitted input on blur." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearOnEscape" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Allow Escape to clear." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "menu-and-presentation",
			children: "Menu and presentation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled/initial menu state." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Menu state changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "openOnFocus" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "autoHighlight" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Open on focus or highlight the first option." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "closeOnSelect" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Single: true; multiple: false" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dismiss after choosing." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Loading state." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "loadingText" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "noOptionsText" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"Loading options...\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"No options found\"" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Menu feedback." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "requiredMessage" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Please select an option.\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Required validation message." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "position" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"top\" | \"right\" | \"bottom\" | \"left\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"bottom\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Preferred side." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "align" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\" | \"center\" | \"end\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Alignment." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "collisionPadding" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Positioning distances in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "matchTriggerWidth" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Menu width follows input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "menuMaxHeight" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"18rem\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Menu height limit." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: ["Responsive ", (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" })] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Input size." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: ["Responsive ", (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" })] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Fill available width." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "inputClassName" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "popoverClassName" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "menuClassName" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "optionClassName" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Scoped styling hooks." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Options support ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "description" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "group" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			". Standard input attributes and refs are supported. Arrow keys navigate, Enter selects, and Escape closes. Custom renderers must not nest interactive controls inside options."
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
