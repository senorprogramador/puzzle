import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/color-picker.mdx_macro_id_src_2Flib_2Fsource-CbBremqN.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Color Picker",
	"description": "Choose a color with an interactive picker, text input, or preset swatches."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "ColorPicker provides a trigger and popup for choosing a color. Users can adjust saturation and brightness, set hue and opacity, enter a CSS color value, or choose from preset swatches."
		},
		{
			"heading": "basic-usage",
			"content": "Provide a visible `label` and optionally an initial `defaultValue`. Add preset colors with `colors`; a swatch can be a color string or an object with a `value` and optional accessible `label`."
		},
		{
			"heading": "preset-swatches",
			"content": "Use labeled swatch objects when the color value alone is not a useful accessible name. CSS color values such as variables can also be used as swatches; the picker returns the original value when a swatch is selected."
		},
		{
			"heading": "controlled-value-and-format",
			"content": "Use `value` with `onChange` when the parent owns the selected color; otherwise, use `defaultValue` for an uncontrolled picker. The callback receives the color string, or `undefined` when the color is cleared."
		},
		{
			"heading": "controlled-value-and-format",
			"content": "`format` determines the string produced when users adjust the picker controls. It supports `\"hex\"`, `\"hexa\"`, `\"rgb\"`, and `\"hsl\"`; the default is `\"hexa\"`. Selecting a swatch or applying a valid text value preserves that input string rather than converting it to the selected format."
		},
		{
			"heading": "clearing-and-disabled-state",
			"content": "The picker is clearable by default. Set `clearable={false}` to remove the clear action; customize its accessible name with `clearLabel`. Clearing calls `onChange` with `undefined`. Set `disabled` to prevent opening the picker."
		},
		{
			"heading": "popup-placement",
			"content": "`position` selects the preferred side of the trigger (`top`, `right`, `bottom`, or `left`); `align` selects `start`, `center`, or `end` alignment. The popup closes when users press Escape or click outside. Use `open` with `onOpenChange` to control popup visibility, or `defaultOpen` for its initial state."
		},
		{
			"heading": "api",
			"content": "| Prop    | Type        | Default | Description                                                  |\n| ------- | ----------- | ------- | ------------------------------------------------------------ |\n| `label` | `ReactNode` | -       | Visible label and accessible name for the trigger and popup. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop          | Type        | Default | Description                                  |\n| ------------- | ----------- | ------- | -------------------------------------------- |\n| `description` | `ReactNode` | -       | Supporting text associated with the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type                  | Default | Description                                                         |\n| ------- | --------------------- | ------- | ------------------------------------------------------------------- |\n| `value` | `string \\| undefined` | -       | Controlled color value. Pass `undefined` to represent no selection. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type     | Default | Description                               |\n| -------------- | -------- | ------- | ----------------------------------------- |\n| `defaultValue` | `string` | -       | Initial color for an uncontrolled picker. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type                                   | Default | Description                                                   |\n| ---------- | -------------------------------------- | ------- | ------------------------------------------------------------- |\n| `onChange` | `(value: string \\| undefined) => void` | -       | Called when a color is chosen, adjusted, applied, or cleared. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop          | Type     | Default          | Description                             |\n| ------------- | -------- | ---------------- | --------------------------------------- |\n| `placeholder` | `string` | `\"Select color\"` | Trigger text when no color is selected. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop     | Type                           | Default | Description                                     |\n| -------- | ------------------------------ | ------- | ----------------------------------------------- |\n| `colors` | `readonly ColorPickerSwatch[]` | `[]`    | Preset strings or `{ value, label? }` swatches. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop     | Type                                | Default  | Description                                                 |\n| -------- | ----------------------------------- | -------- | ----------------------------------------------------------- |\n| `format` | `\"hex\" \\| \"hexa\" \\| \"rgb\" \\| \"hsl\"` | `\"hexa\"` | Output format for colors adjusted with the picker controls. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop        | Type      | Default | Description                             |\n| ----------- | --------- | ------- | --------------------------------------- |\n| `clearable` | `boolean` | `true`  | Whether to show the clear-color action. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop         | Type     | Default         | Description                           |\n| ------------ | -------- | --------------- | ------------------------------------- |\n| `clearLabel` | `string` | `\"Clear color\"` | Accessible name for the clear action. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type      | Default | Description           |\n| ---------- | --------- | ------- | --------------------- |\n| `disabled` | `boolean` | `false` | Disables the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop   | Type      | Default | Description                  |\n| ------ | --------- | ------- | ---------------------------- |\n| `open` | `boolean` | -       | Controlled popup visibility. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop          | Type      | Default | Description                                 |\n| ------------- | --------- | ------- | ------------------------------------------- |\n| `defaultOpen` | `boolean` | `false` | Initial popup visibility when uncontrolled. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop           | Type                      | Default | Description                           |\n| -------------- | ------------------------- | ------- | ------------------------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Called when popup visibility changes. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop       | Type                                     | Default    | Description           |\n| ---------- | ---------------------------------------- | ---------- | --------------------- |\n| `position` | `\"top\" \\| \"right\" \\| \"bottom\" \\| \"left\"` | `\"bottom\"` | Preferred popup side. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop    | Type                           | Default   | Description                              |\n| ------- | ------------------------------ | --------- | ---------------------------------------- |\n| `align` | `\"start\" \\| \"center\" \\| \"end\"` | `\"start\"` | Popup alignment relative to the trigger. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop                 | Type                | Default | Description                    |\n| -------------------- | ------------------- | ------- | ------------------------------ |\n| `className`, `style` | Native button props | -       | Applied to the trigger button. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop            | Type     | Default | Description                            |\n| --------------- | -------- | ------- | -------------------------------------- |\n| `rootClassName` | `string` | -       | Additional class for the root wrapper. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "| Prop               | Type     | Default | Description                               |\n| ------------------ | -------- | ------- | ----------------------------------------- |\n| `popoverClassName` | `string` | -       | Additional class for the popup container. |",
			"table": "table-0"
		},
		{
			"heading": "api",
			"content": "Other native button attributes, including `id`, `name`, and `aria-*`, are forwarded to the trigger."
		},
		{
			"heading": "accessibility",
			"content": "Always provide a `label`; without one, the trigger uses the generic accessible name “Choose color.”"
		},
		{
			"heading": "accessibility",
			"content": "Preset swatches are buttons with accessible names and pressed states. Give swatches a descriptive `label` when the raw color value is not meaningful."
		},
		{
			"heading": "accessibility",
			"content": "The saturation/brightness area supports arrow keys; hold Shift to adjust in larger increments. Hue and opacity use native range inputs and support their standard keyboard controls."
		},
		{
			"heading": "accessibility",
			"content": "Use Escape to close the popup; clicking outside also closes it."
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
			"id": "preset-swatches",
			"content": "Preset swatches"
		},
		{
			"id": "controlled-value-and-format",
			"content": "Controlled value and format"
		},
		{
			"id": "clearing-and-disabled-state",
			"content": "Clearing and disabled state"
		},
		{
			"id": "popup-placement",
			"content": "Popup placement"
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
		url: "#preset-swatches",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Preset swatches" })
	},
	{
		depth: 2,
		url: "#controlled-value-and-format",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled value and format" })
	},
	{
		depth: 2,
		url: "#clearing-and-disabled-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Clearing and disabled state" })
	},
	{
		depth: 2,
		url: "#popup-placement",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Popup placement" })
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
	}, { ColorPicker, Preview, Section } = _components;
	if (!ColorPicker) _missingMdxReference("ColorPicker", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "ColorPicker provides a trigger and popup for choosing a color. Users can adjust saturation and brightness, set hue and opacity, enter a CSS color value, or choose from preset swatches." }),
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
						children: " { ColorPicker } "
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
			"Provide a visible ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			" and optionally an initial ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			". Add preset colors with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "colors" }),
			"; a swatch can be a color string or an object with a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" and optional accessible ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 300,
			code: `\
<ColorPicker
label="Brand color"
description="Choose a color for your workspace."
defaultValue="#6750a4"
colors={["#6750a4", "#d97706", "#16803c"]}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ColorPicker, {
				label: "Brand color",
				description: "Choose a color for your workspace.",
				defaultValue: "#6750a4",
				colors: [
					"#6750a4",
					"#d97706",
					"#16803c"
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "preset-swatches",
			children: "Preset swatches"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use labeled swatch objects when the color value alone is not a useful accessible name. CSS color values such as variables can also be used as swatches; the picker returns the original value when a swatch is selected." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 280,
			code: `\
<ColorPicker
label="Status color"
colors={[
  { value: "var(--puzzle-color-success)", label: "Success" },
  { value: "var(--puzzle-color-warning)", label: "Warning" },
  { value: "var(--puzzle-color-danger)", label: "Danger" },
]}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ColorPicker, {
				label: "Status color",
				colors: [
					{
						value: "var(--puzzle-color-success)",
						label: "Success"
					},
					{
						value: "var(--puzzle-color-warning)",
						label: "Warning"
					},
					{
						value: "var(--puzzle-color-danger)",
						label: "Danger"
					}
				]
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-value-and-format",
			children: "Controlled value and format"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" when the parent owns the selected color; otherwise, use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" for an uncontrolled picker. The callback receives the color string, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "undefined" }),
			" when the color is cleared."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "format" }),
			" determines the string produced when users adjust the picker controls. It supports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"hex\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"hexa\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"rgb\"" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"hsl\"" }),
			"; the default is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"hexa\"" }),
			". Selecting a swatch or applying a valid text value preserves that input string rather than converting it to the selected format."
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
							children: "const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ColorSetting"
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
							children: "color"
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
							children: "setColor"
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
							children: "<"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "string"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " |"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " undefined"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"#6750a4\""
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
						children: "ColorPicker"
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
							children: "\"Accent color\""
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
							children: "{color}"
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
							children: "      onChange"
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
							children: "{setColor}"
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
							children: "      format"
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
							children: "\"hex\""
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
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "clearing-and-disabled-state",
			children: "Clearing and disabled state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The picker is clearable by default. Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clearable={false}" }),
			" to remove the clear action; customize its accessible name with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }),
			". Clearing calls ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "undefined" }),
			". Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" to prevent opening the picker."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "popup-placement",
			children: "Popup placement"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "position" }),
			" selects the preferred side of the trigger (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "top" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "right" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "bottom" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "left" }),
			"); ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align" }),
			" selects ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "start" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "center" }),
			", or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "end" }),
			" alignment. The popup closes when users press Escape or click outside. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			" to control popup visibility, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			" for its initial state."
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible label and accessible name for the trigger and popup." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Supporting text associated with the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string | undefined" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Controlled color value. Pass ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "undefined" }),
					" to represent no selection."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial color for an uncontrolled picker." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: string | undefined) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when a color is chosen, adjusted, applied, or cleared." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "placeholder" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Select color\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Trigger text when no color is selected." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "colors" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly ColorPickerSwatch[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Preset strings or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "{ value, label? }" }),
					" swatches."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "format" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"hex\" | \"hexa\" | \"rgb\" | \"hsl\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"hexa\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Output format for colors adjusted with the picker controls." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearable" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "true" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Whether to show the clear-color action." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Clear color\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name for the clear action." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "open" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled popup visibility." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial popup visibility when uncontrolled." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when popup visibility changes." })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"start\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Popup alignment relative to the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "style" })
				] }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native button props" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Applied to the trigger button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "rootClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class for the root wrapper." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "popoverClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class for the popup container." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other native button attributes, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "name" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-*" }),
			", are forwarded to the trigger."
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
				"Always provide a ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
				"; without one, the trigger uses the generic accessible name “Choose color.”"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Preset swatches are buttons with accessible names and pressed states. Give swatches a descriptive ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "label" }),
				" when the raw color value is not meaningful."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The saturation/brightness area supports arrow keys; hold Shift to adjust in larger increments. Hue and opacity use native range inputs and support their standard keyboard controls." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use Escape to close the popup; clicking outside also closes it." }),
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
