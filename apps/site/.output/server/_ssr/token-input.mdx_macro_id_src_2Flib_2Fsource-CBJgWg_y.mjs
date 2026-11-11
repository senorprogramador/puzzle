import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/token-input.mdx_macro_id_src_2Flib_2Fsource-CBJgWg_y.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Token Input",
	"description": "Enter verification codes and short tokens using individual character slots."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "TokenInput displays a short token as a row of native inputs. It supports numeric and alphanumeric values, automatic focus advancement, pasting, masking, and native form submission."
		},
		{
			"heading": "basic-usage",
			"content": "Use `label` to provide a visible label. The default configuration accepts six numeric characters and preserves leading zeroes."
		},
		{
			"heading": "basic-usage",
			"content": "Typing replaces the character at the active slot and advances focus. Backspace and Delete remove a character and shift the remaining characters left. Arrow keys move between slots; Home and End focus the first and last slots."
		},
		{
			"heading": "length-and-character-mode",
			"content": "Set `length` to an integer from 1 through 32. Numeric mode accepts ASCII digits only. Alphanumeric mode accepts ASCII letters and digits, preserving letter case. Other characters are removed, and values are truncated to the configured length."
		},
		{
			"heading": "length-and-character-mode",
			"content": "The default `inputMode` is `\"numeric\"` for numeric tokens and `\"text\"` for alphanumeric tokens. Override it when a different virtual keyboard is appropriate."
		},
		{
			"heading": "controlled-values-and-completion",
			"content": "Use `defaultValue` for an uncontrolled initial value, or pair `value` with `onValueChange` for controlled usage. Values and callbacks use a single string rather than an array of characters."
		},
		{
			"heading": "controlled-values-and-completion",
			"content": "`onComplete` runs when an interaction changes an incomplete token into a complete one. It does not run for an initially complete value, a parent-driven value update, or replacement of a character in an already complete token. Completion means every slot is filled, not that the token has been verified; verify it on the server."
		},
		{
			"heading": "controlled-values-and-completion",
			"content": "The first input defaults to `autoComplete=\"one-time-code\"`. Pasting a complete token replaces the existing value. A shorter paste replaces characters starting at the active slot."
		},
		{
			"heading": "sizes-and-masking",
			"content": "Choose `\"sm\"`, `\"md\"` (default), or `\"lg\"` for the slot size. Set `mask` to render password inputs."
		},
		{
			"heading": "sizes-and-masking",
			"content": "Masking only changes the visual presentation; it does not encrypt the token."
		},
		{
			"heading": "validation-and-interaction-states",
			"content": "Use `FormField` to associate instructions and error messages with the inputs. `aria-invalid` applies the invalid state to the group and each slot."
		},
		{
			"heading": "native-forms",
			"content": "Providing `name` renders a hidden input containing the combined token. Individual slots do not have names, so the token is submitted once. `required` marks each slot as required for native form validation."
		},
		{
			"heading": "native-forms",
			"content": "Disabled tokens are omitted from form submission; read-only tokens remain included. The `form` prop associates the hidden submission input with a form by ID; it does not associate the visible character inputs with that external form for validation."
		},
		{
			"heading": "api",
			"content": "| Prop     | Type     | Default | Description               |\n| -------- | -------- | ------- | ------------------------- |\n| `length` | `number` | `6`     | Integer between 1 and 32. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type     | Default | Description             |\n| ------- | -------- | ------- | ----------------------- |\n| `value` | `string` | -       | Controlled token value. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type     | Default | Description                 |\n| -------------- | -------- | ------- | --------------------------- |\n| `defaultValue` | `string` | `\"\"`    | Initial uncontrolled value. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop            | Type                      | Default | Description                                              |\n| --------------- | ------------------------- | ------- | -------------------------------------------------------- |\n| `onValueChange` | `(value: string) => void` | -       | Called when an interaction changes the normalized value. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop         | Type                      | Default | Description                                       |\n| ------------ | ------------------------- | ------- | ------------------------------------------------- |\n| `onComplete` | `(value: string) => void` | -       | Called when an incomplete token becomes complete. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type                          | Default     | Description            |\n| ------ | ----------------------------- | ----------- | ---------------------- |\n| `mode` | `\"numeric\" \\| \"alphanumeric\"` | `\"numeric\"` | Allowed character set. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type                   | Default | Description       |\n| ------ | ---------------------- | ------- | ----------------- |\n| `size` | `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Visual slot size. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type      | Default | Description                                |\n| ------ | --------- | ------- | ------------------------------------------ |\n| `mask` | `boolean` | `false` | Displays characters using password inputs. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type      | Default | Description                              |\n| ---------- | --------- | ------- | ---------------------------------------- |\n| `disabled` | `boolean` | `false` | Disables editing, focus, and submission. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type      | Default | Description                            |\n| ---------- | --------- | ------- | -------------------------------------- |\n| `readOnly` | `boolean` | `false` | Prevents editing while allowing focus. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type      | Default | Description                     |\n| ---------- | --------- | ------- | ------------------------------- |\n| `required` | `boolean` | `false` | Requires every character input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type        | Default | Description                                    |\n| ------- | ----------- | ------- | ---------------------------------------------- |\n| `label` | `ReactNode` | -       | Visible label associated with the first input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop | Type     | Default   | Description                   |\n| ---- | -------- | --------- | ----------------------------- |\n| `id` | `string` | Generated | ID of the first native input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type     | Default | Description                              |\n| ------ | -------- | ------- | ---------------------------------------- |\n| `name` | `string` | -       | Name of the hidden combined-value input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type     | Default | Description                              |\n| ------ | -------- | ------- | ---------------------------------------- |\n| `form` | `string` | -       | Form ID for the hidden submission input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type              | Default         | Description                          |\n| ----------- | ----------------- | --------------- | ------------------------------------ |\n| `inputMode` | Native input mode | Based on `mode` | Virtual keyboard hint for all slots. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type                      | Default           | Description                                                    |\n| -------------- | ------------------------- | ----------------- | -------------------------------------------------------------- |\n| `autoComplete` | Native autocomplete value | `\"one-time-code\"` | Autocomplete hint for the first slot; other slots use `\"off\"`. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop  | Type                    | Default | Description                    |\n| ----- | ----------------------- | ------- | ------------------------------ |\n| `ref` | `Ref<HTMLInputElement>` | -       | Ref to the first native input. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                             | Type                  | Default | Description                               |\n| -------------------------------- | --------------------- | ------- | ----------------------------------------- |\n| `onFocus`, `onBlur`, `onKeyDown` | Native input handlers | -       | Handlers for individual character inputs. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "Other supported native `div` attributes, including `className`, `style`, and `data-*`, apply to the root group. `aria-describedby` and `aria-invalid` are also forwarded to each slot."
		},
		{
			"heading": "accessibility",
			"content": "Provide a visible `label`, use `FormField`, or supply an accessible name with `aria-label`. Use `aria-describedby` for instructions and errors."
		},
		{
			"heading": "accessibility",
			"content": "The root has `role=\"group\"`. One slot is in the tab order at a time; Tab leaves the component, while arrow keys navigate within it."
		},
		{
			"heading": "accessibility",
			"content": "`id` and `ref` target the first input, allowing external labels and programmatic focus."
		},
		{
			"heading": "accessibility",
			"content": "Keep error messages visible and explain how to recover, such as requesting a new verification code."
		},
		{
			"heading": "accessibility",
			"content": "Prefer short token lengths. Long rows may exceed narrow containers; choose a length and size appropriate to the available space."
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
			"id": "length-and-character-mode",
			"content": "Length and character mode"
		},
		{
			"id": "controlled-values-and-completion",
			"content": "Controlled values and completion"
		},
		{
			"id": "sizes-and-masking",
			"content": "Sizes and masking"
		},
		{
			"id": "validation-and-interaction-states",
			"content": "Validation and interaction states"
		},
		{
			"id": "native-forms",
			"content": "Native forms"
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
		url: "#length-and-character-mode",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Length and character mode" })
	},
	{
		depth: 2,
		url: "#controlled-values-and-completion",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled values and completion" })
	},
	{
		depth: 2,
		url: "#sizes-and-masking",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Sizes and masking" })
	},
	{
		depth: 2,
		url: "#validation-and-interaction-states",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Validation and interaction states" })
	},
	{
		depth: 2,
		url: "#native-forms",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Native forms" })
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
	}, { FormField, Preview, Section, TokenInput } = _components;
	if (!FormField) _missingMdxReference("FormField", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!TokenInput) _missingMdxReference("TokenInput", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "TokenInput displays a short token as a row of native inputs. It supports numeric and alphanumeric values, automatic focus advancement, pasting, masking, and native form submission." }),
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
						children: " { TokenInput } "
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
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			" to provide a visible label. The default configuration accepts six numeric characters and preserves leading zeroes."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 220,
			code: `\
<TokenInput label="Verification code" name="code" required />
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(TokenInput, {
				label: "Verification code",
				name: "code",
				required: true
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Typing replaces the character at the active slot and advances focus. Backspace and Delete remove a character and shift the remaining characters left. Arrow keys move between slots; Home and End focus the first and last slots." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "length-and-character-mode",
			children: "Length and character mode"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "length" }),
			" to an integer from 1 through 32. Numeric mode accepts ASCII digits only. Alphanumeric mode accepts ASCII letters and digits, preserving letter case. Other characters are removed, and values are truncated to the configured length."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			code: `\
<TokenInput label="Four-digit PIN" length={4} defaultValue="0123" />
<TokenInput label="Recovery code" length={8} mode="alphanumeric" />
`,
			children: (0, import_jsx_runtime.jsxs)(Section, { children: [(0, import_jsx_runtime.jsx)(TokenInput, {
				label: "Four-digit PIN",
				length: 4,
				defaultValue: "0123"
			}), (0, import_jsx_runtime.jsx)(TokenInput, {
				label: "Recovery code",
				length: 8,
				mode: "alphanumeric"
			})] })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The default ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "inputMode" }),
			" is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"numeric\"" }),
			" for numeric tokens and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"text\"" }),
			" for alphanumeric tokens. Override it when a different virtual keyboard is appropriate."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-values-and-completion",
			children: "Controlled values and completion"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" for an uncontrolled initial value, or pair ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }),
			" for controlled usage. Values and callbacks use a single string rather than an array of characters."
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
							children: " { useState } "
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
							children: " \"react\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
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
							children: " { TokenInput } "
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
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "export"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " VerificationCode"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " () "
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
							children: " {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "  const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "code"
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
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "setCode"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "] "
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
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " useState"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "  return"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " ("
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    <"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "TokenInput"
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
							children: "      label"
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
							children: "\"Verification code\""
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
							children: "      value"
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
							children: "{code}"
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
							children: "      onValueChange"
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
							children: "{setCode}"
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
							children: "      onComplete"
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
							children: "completedCode"
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
							children: " {"
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
							children: "        console."
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "log"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Code ready for verification:\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", completedCode."
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "length"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
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
						children: "      }}"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    />"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  );"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "};"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "onComplete" }), " runs when an interaction changes an incomplete token into a complete one. It does not run for an initially complete value, a parent-driven value update, or replacement of a character in an already complete token. Completion means every slot is filled, not that the token has been verified; verify it on the server."] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The first input defaults to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "autoComplete=\"one-time-code\"" }),
			". Pasting a complete token replaces the existing value. A shorter paste replaces characters starting at the active slot."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "sizes-and-masking",
			children: "Sizes and masking"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Choose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }),
			" (default), or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"lg\"" }),
			" for the slot size. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "mask" }),
			" to render password inputs."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 320,
			code: `\
<TokenInput label="Small" size="sm" length={4} />
<TokenInput label="Medium" size="md" length={4} />
<TokenInput label="Masked PIN" size="lg" length={4} mask />
`,
			children: (0, import_jsx_runtime.jsxs)(Section, { children: [
				(0, import_jsx_runtime.jsx)(TokenInput, {
					label: "Small",
					size: "sm",
					length: 4
				}),
				(0, import_jsx_runtime.jsx)(TokenInput, {
					label: "Medium",
					size: "md",
					length: 4
				}),
				(0, import_jsx_runtime.jsx)(TokenInput, {
					label: "Masked PIN",
					size: "lg",
					length: 4,
					mask: true
				})
			] })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Masking only changes the visual presentation; it does not encrypt the token." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "validation-and-interaction-states",
			children: "Validation and interaction states"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
			" to associate instructions and error messages with the inputs. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }),
			" applies the invalid state to the group and each slot."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
<FormField
label="Verification code"
description="Enter the six-digit code from your email."
error="This code has expired. Request a new one."
>
<TokenInput aria-invalid="true" />
</FormField>
<TokenInput label="Disabled" defaultValue="123456" disabled />
<TokenInput label="Read-only" defaultValue="123456" readOnly />
`,
			children: (0, import_jsx_runtime.jsxs)(Section, { children: [
				(0, import_jsx_runtime.jsx)(FormField, {
					label: "Verification code",
					description: "Enter the six-digit code from your email.",
					error: "This code has expired. Request a new one.",
					children: (0, import_jsx_runtime.jsx)(TokenInput, { "aria-invalid": "true" })
				}),
				(0, import_jsx_runtime.jsx)(TokenInput, {
					label: "Disabled",
					defaultValue: "123456",
					disabled: true
				}),
				(0, import_jsx_runtime.jsx)(TokenInput, {
					label: "Read-only",
					defaultValue: "123456",
					readOnly: true
				})
			] })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "native-forms",
			children: "Native forms"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Providing ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "name" }),
			" renders a hidden input containing the combined token. Individual slots do not have names, so the token is submitted once. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "required" }),
			" marks each slot as required for native form validation."
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
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "form"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " method"
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
							children: "\"post\""
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
							children: "TokenInput"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " label"
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
							children: "\"Verification code\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " name"
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
							children: "\"code\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " required"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " />"
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
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " type"
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
							children: "\"submit\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Verify</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "button"
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
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "form"
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
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Disabled tokens are omitted from form submission; read-only tokens remain included. The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "form" }),
			" prop associates the hidden submission input with a form by ID; it does not associate the visible character inputs with that external form for validation."
		] }),
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "length" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "6" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Integer between 1 and 32." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled token value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: string) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when an interaction changes the normalized value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onComplete" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: string) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when an incomplete token becomes complete." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "mode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"numeric\" | \"alphanumeric\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"numeric\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Allowed character set." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual slot size." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "mask" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays characters using password inputs." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables editing, focus, and submission." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readOnly" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Prevents editing while allowing focus." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "required" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Requires every character input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible label associated with the first input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Generated" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "ID of the first native input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "name" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Name of the hidden combined-value input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "form" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Form ID for the hidden submission input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "inputMode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native input mode" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: ["Based on ", (0, import_jsx_runtime.jsx)(_components.code, { children: "mode" })] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Virtual keyboard hint for all slots." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "autoComplete" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native autocomplete value" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"one-time-code\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Autocomplete hint for the first slot; other slots use ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"off\"" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Ref<HTMLInputElement>" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Ref to the first native input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onFocus" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onBlur" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "onKeyDown" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native input handlers" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Handlers for individual character inputs." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other supported native ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "div" }),
			" attributes, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "data-*" }),
			", apply to the root group. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }),
			" are also forwarded to each slot."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Provide a visible ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
				", use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
				", or supply an accessible name with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
				". Use ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
				" for instructions and errors."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The root has ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "role=\"group\"" }),
				". One slot is in the tab order at a time; Tab leaves the component, while arrow keys navigate within it."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
				" and ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }),
				" target the first input, allowing external labels and programmatic focus."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep error messages visible and explain how to recover, such as requesting a new verification code." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Prefer short token lengths. Long rows may exceed narrow containers; choose a length and size appropriate to the available space." }),
			"\n"
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
