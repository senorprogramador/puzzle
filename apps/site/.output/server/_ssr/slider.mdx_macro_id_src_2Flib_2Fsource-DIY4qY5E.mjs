import { ControlledSliderExample } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/slider.mdx_macro_id_src_2Flib_2Fsource-DIY4qY5E.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Slider",
	"description": "Select a numeric value within a defined range."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Slider allows users to select a numeric value between a minimum and maximum. It uses a native HTML range input for accessibility, keyboard interaction and form integration."
		},
		{
			"heading": "basic-usage",
			"content": "Wrap Slider in `FormField` to provide a visible label and supporting text. `defaultValue` sets its initial value; without it, Slider starts at the range midpoint, rounded to the allowed step."
		},
		{
			"heading": "range-and-increments",
			"content": "`min` and `max` define the bounds. `step` defines increments relative to `min`; use `\"any\"` to avoid step rounding. Values are clamped to the range and rounded to the nearest allowed increment."
		},
		{
			"heading": "sizes",
			"content": "`size` changes the track and thumb size without changing the numeric range."
		},
		{
			"heading": "marks-and-value-formatting",
			"content": "`marks` adds visual reference points; it does not restrict selection to those points. Use `step` to constrain values. Marks outside the range are ignored."
		},
		{
			"heading": "marks-and-value-formatting",
			"content": "`showValue` displays the current number. `formatValue` formats that display and supplies `aria-valuetext`, even when `showValue` is off. An explicit `aria-valuetext` takes precedence."
		},
		{
			"heading": "controlled-value",
			"content": "Use `value` with `onChange` to own the value. The callback receives a number, not a change event. Use either controlled `value` or uncontrolled `defaultValue`, not both."
		},
		{
			"heading": "disabled-and-invalid-states",
			"content": "`disabled` prevents interaction and native form submission. Use `FormField` to connect an error message, or supply `aria-invalid` and `aria-describedby` yourself. Invalid state does not disable the slider."
		},
		{
			"heading": "slider",
			"content": "| Prop    | Type     | Default | Description               |\n| ------- | -------- | ------- | ------------------------- |\n| `value` | `number` | -       | Controlled numeric value. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop           | Type     | Default        | Description                                              |\n| -------------- | -------- | -------------- | -------------------------------------------------------- |\n| `defaultValue` | `number` | Range midpoint | Initial uncontrolled value, rounded to the allowed step. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop       | Type                      | Default | Description                               |\n| ---------- | ------------------------- | ------- | ----------------------------------------- |\n| `onChange` | `(value: number) => void` | -       | Called with the normalized numeric value. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop  | Type     | Default | Description               |\n| ----- | -------- | ------- | ------------------------- |\n| `min` | `number` | `0`     | Minimum selectable value. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop  | Type     | Default | Description               |\n| ----- | -------- | ------- | ------------------------- |\n| `max` | `number` | `100`   | Maximum selectable value. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop   | Type              | Default | Description                                   |\n| ------ | ----------------- | ------- | --------------------------------------------- |\n| `step` | `number \\| \"any\"` | `1`     | Positive increment or unrestricted precision. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop   | Type                   | Default | Description  |\n| ------ | ---------------------- | ------- | ------------ |\n| `size` | `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Visual size. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop    | Type                    | Default | Description                            |\n| ------- | ----------------------- | ------- | -------------------------------------- |\n| `marks` | `readonly SliderMark[]` | -       | Visual tick marks and optional labels. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop        | Type      | Default | Description                                 |\n| ----------- | --------- | ------- | ------------------------------------------- |\n| `showValue` | `boolean` | `false` | Displays the current value above the track. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop          | Type                        | Default | Description                                          |\n| ------------- | --------------------------- | ------- | ---------------------------------------------------- |\n| `formatValue` | `(value: number) => string` | -       | Formats the visible value and accessible value text. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop        | Type     | Default | Description                        |\n| ----------- | -------- | ------- | ---------------------------------- |\n| `className` | `string` | -       | Additional class on the outer div. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop       | Type      | Default | Description                      |\n| ---------- | --------- | ------- | -------------------------------- |\n| `disabled` | `boolean` | `false` | Disables the native range input. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop | Type     | Default   | Description                           |\n| ---- | -------- | --------- | ------------------------------------- |\n| `id` | `string` | Generated | Input ID, used for label association. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop   | Type     | Default | Description                        |\n| ------ | -------- | ------- | ---------------------------------- |\n| `name` | `string` | -       | Native form submission field name. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "| Prop           | Type                             | Default | Description                                                       |\n| -------------- | -------------------------------- | ------- | ----------------------------------------------------------------- |\n| `aria-invalid` | `AriaAttributes[\"aria-invalid\"]` | -       | Sets native invalid semantics; `true` also enables error styling. |",
			"table": "table-0"
		},
		{
			"heading": "slider",
			"content": "Other native input props, including `ref`, `form`, `aria-label`, `aria-describedby`, and `aria-valuetext`, are forwarded to the range input. `style` applies to the input; `className` applies to its wrapper."
		},
		{
			"heading": "slidermark",
			"content": "| Prop    | Type     | Default  | Description                       |\n| ------- | -------- | -------- | --------------------------------- |\n| `value` | `number` | Required | Position within the slider range. |",
			"table": "table-1"
		},
		{
			"heading": "slidermark",
			"content": "| Prop    | Type        | Default | Description                            |\n| ------- | ----------- | ------- | -------------------------------------- |\n| `label` | `ReactNode` | -       | Optional visible label below the mark. |",
			"table": "table-1"
		},
		{
			"heading": "accessibility",
			"content": "Always provide a visible label through `FormField` or a native label, or supply `aria-label`/`aria-labelledby`. Native range keyboard behavior includes arrow keys for increments and Home/End for the bounds. Use `formatValue` to announce meaningful units rather than relying on decorative mark labels."
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
			"id": "range-and-increments",
			"content": "Range and increments"
		},
		{
			"id": "sizes",
			"content": "Sizes"
		},
		{
			"id": "marks-and-value-formatting",
			"content": "Marks and value formatting"
		},
		{
			"id": "controlled-value",
			"content": "Controlled value"
		},
		{
			"id": "disabled-and-invalid-states",
			"content": "Disabled and invalid states"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "slider",
			"content": "Slider"
		},
		{
			"id": "slidermark",
			"content": "SliderMark"
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
		url: "#range-and-increments",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Range and increments" })
	},
	{
		depth: 2,
		url: "#sizes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Sizes" })
	},
	{
		depth: 2,
		url: "#marks-and-value-formatting",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Marks and value formatting" })
	},
	{
		depth: 2,
		url: "#controlled-value",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled value" })
	},
	{
		depth: 2,
		url: "#disabled-and-invalid-states",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled and invalid states" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#slider",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Slider" })
	},
	{
		depth: 3,
		url: "#slidermark",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "SliderMark" })
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
	}, { FormField, Preview, Section, Slider, Stack } = _components;
	if (!FormField) _missingMdxReference("FormField", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Slider) _missingMdxReference("Slider", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Slider allows users to select a numeric value between a minimum and maximum. It uses a native HTML range input for accessibility, keyboard interaction and form integration." }),
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
						children: " { Slider } "
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
			"Wrap Slider in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
			" to provide a visible label and supporting text. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" sets its initial value; without it, Slider starts at the range midpoint, rounded to the allowed step."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			code: `\
<FormField label="Volume" description="Adjust the audio volume.">
  <Slider name="volume" defaultValue={65} showValue />
</FormField>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FormField, {
				label: "Volume",
				description: "Adjust the audio volume.",
				children: (0, import_jsx_runtime.jsx)(Slider, {
					name: "volume",
					defaultValue: 65,
					showValue: true
				})
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "range-and-increments",
			children: "Range and increments"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "min" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "max" }),
			" define the bounds. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "step" }),
			" defines increments relative to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "min" }),
			"; use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"any\"" }),
			" to avoid step rounding. Values are clamped to the range and rounded to the nearest allowed increment."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 340,
			code: `\
<Stack>
<FormField label="Temperature" description="Between 16 and 30 degrees, in half-degree steps.">
  <Slider min={16} max={30} step={0.5} defaultValue={21.5} showValue formatValue={(value) => value + " degrees"} />
</FormField>
<FormField label="Playback speed">
  <Slider min={0.5} max={2} step="any" defaultValue={1} showValue formatValue={(value) => value.toFixed(2) + "x"} />
</FormField>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsx)(FormField, {
				label: "Temperature",
				description: "Between 16 and 30 degrees, in half-degree steps.",
				children: (0, import_jsx_runtime.jsx)(Slider, {
					min: 16,
					max: 30,
					step: .5,
					defaultValue: 21.5,
					showValue: true,
					formatValue: (value) => value + " degrees"
				})
			}), (0, import_jsx_runtime.jsx)(FormField, {
				label: "Playback speed",
				children: (0, import_jsx_runtime.jsx)(Slider, {
					min: .5,
					max: 2,
					step: "any",
					defaultValue: 1,
					showValue: true,
					formatValue: (value) => value.toFixed(2) + "x"
				})
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "sizes",
			children: "Sizes"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "size" }), " changes the track and thumb size without changing the numeric range."] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
<Stack>
<FormField label="Small"><Slider size="sm" defaultValue={25} /></FormField>
<FormField label="Medium"><Slider size="md" defaultValue={50} /></FormField>
<FormField label="Large"><Slider size="lg" defaultValue={75} /></FormField>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsx)(FormField, {
					label: "Small",
					children: (0, import_jsx_runtime.jsx)(Slider, {
						size: "sm",
						defaultValue: 25
					})
				}),
				(0, import_jsx_runtime.jsx)(FormField, {
					label: "Medium",
					children: (0, import_jsx_runtime.jsx)(Slider, {
						size: "md",
						defaultValue: 50
					})
				}),
				(0, import_jsx_runtime.jsx)(FormField, {
					label: "Large",
					children: (0, import_jsx_runtime.jsx)(Slider, {
						size: "lg",
						defaultValue: 75
					})
				})
			] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "marks-and-value-formatting",
			children: "Marks and value formatting"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "marks" }),
			" adds visual reference points; it does not restrict selection to those points. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "step" }),
			" to constrain values. Marks outside the range are ignored."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "showValue" }),
			" displays the current number. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "formatValue" }),
			" formats that display and supplies ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuetext" }),
			", even when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "showValue" }),
			" is off. An explicit ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuetext" }),
			" takes precedence."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			code: `\
<FormField label="Storage budget">
<Slider
  min={0}
  max={100}
  step={25}
  defaultValue={50}
  showValue
  formatValue={(value) => value + " GB"}
  marks={[
    { value: 0, label: "0 GB" },
    { value: 50, label: "50 GB" },
    { value: 100, label: "100 GB" },
  ]}
/>
</FormField>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FormField, {
				label: "Storage budget",
				children: (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 100,
					step: 25,
					defaultValue: 50,
					showValue: true,
					formatValue: (value) => value + " GB",
					marks: [
						{
							value: 0,
							label: "0 GB"
						},
						{
							value: 50,
							label: "50 GB"
						},
						{
							value: 100,
							label: "100 GB"
						}
					]
				})
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-value",
			children: "Controlled value"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" to own the value. The callback receives a number, not a change event. Use either controlled ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" or uncontrolled ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			", not both."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 260,
			code: `\
const [volume, setVolume] = useState(40);

return (

<Stack>
  <FormField label="Volume">
    <Slider value={volume} onChange={setVolume} showValue formatValue={(value) => value + "%"} />
  </FormField>
  <span role="status">Selected volume: {volume}%</span>
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ControlledSliderExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "disabled-and-invalid-states",
			children: "Disabled and invalid states"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" prevents interaction and native form submission. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
			" to connect an error message, or supply ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			" yourself. Invalid state does not disable the slider."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 340,
			code: `\
<Stack>
<FormField label="Locked volume" disabled>
  <Slider defaultValue={60} showValue />
</FormField>
<FormField label="Budget" error="Choose a budget of at least 50.">
  <Slider defaultValue={20} showValue />
</FormField>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsx)(FormField, {
				label: "Locked volume",
				disabled: true,
				children: (0, import_jsx_runtime.jsx)(Slider, {
					defaultValue: 60,
					showValue: true
				})
			}), (0, import_jsx_runtime.jsx)(FormField, {
				label: "Budget",
				error: "Choose a budget of at least 50.",
				children: (0, import_jsx_runtime.jsx)(Slider, {
					defaultValue: 20,
					showValue: true
				})
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "slider",
			children: "Slider"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled numeric value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Range midpoint" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled value, rounded to the allowed step." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: number) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called with the normalized numeric value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "min" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Minimum selectable value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "max" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "100" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Maximum selectable value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "step" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number | \"any\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Positive increment or unrestricted precision." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual size." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "marks" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly SliderMark[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual tick marks and optional labels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "showValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays the current value above the track." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "formatValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: number) => string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Formats the visible value and accessible value text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the outer div." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables the native range input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Generated" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Input ID, used for label association." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "name" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native form submission field name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AriaAttributes[\"aria-invalid\"]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Sets native invalid semantics; ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "true" }),
					" also enables error styling."
				] })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other native input props, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "form" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-valuetext" }),
			", are forwarded to the range input. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			" applies to the input; ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "className" }),
			" applies to its wrapper."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "slidermark",
			children: "SliderMark"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "Required" }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "Position within the slider range." })
		] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional visible label below the mark." })
		] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Always provide a visible label through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
			" or a native label, or supply ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			"/",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
			". Native range keyboard behavior includes arrow keys for increments and Home/End for the bounds. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "formatValue" }),
			" to announce meaningful units rather than relying on decorative mark labels."
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
