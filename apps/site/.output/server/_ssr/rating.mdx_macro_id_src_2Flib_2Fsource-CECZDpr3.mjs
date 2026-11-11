import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/rating.mdx_macro_id_src_2Flib_2Fsource-CECZDpr3.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Rating",
	"description": "Display and collect star-based ratings with keyboard and pointer support."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Use the Rating component to display a score or let users select one. It supports controlled and uncontrolled values, half-star precision, and a read-only display mode."
		},
		{
			"heading": "basic-usage",
			"content": "Use `defaultValue` for an uncontrolled rating. The default maximum is five stars."
		},
		{
			"heading": "controlled-value",
			"content": "Pass `value` and update it through `onValueChange` when the user selects a rating."
		},
		{
			"heading": "read-only",
			"content": "Set `readOnly` when the rating is informational rather than interactive."
		},
		{
			"heading": "maximum-and-precision",
			"content": "Set `max` to change the number of stars. `precision` controls the smallest selectable increment: `0.5` (default) or `1`."
		},
		{
			"heading": "size-and-color",
			"content": "Use `size` to choose `sm`, `md` (default), or `lg`. Override `color` and `emptyColor` to match a particular context."
		},
		{
			"heading": "keyboard-interaction",
			"content": "When interactive, the component exposes the slider pattern:"
		},
		{
			"heading": "keyboard-interaction",
			"content": "**Arrow Right / Arrow Up:** increase by `precision`."
		},
		{
			"heading": "keyboard-interaction",
			"content": "**Arrow Left / Arrow Down:** decrease by `precision`."
		},
		{
			"heading": "keyboard-interaction",
			"content": "**Home:** set the value to zero."
		},
		{
			"heading": "keyboard-interaction",
			"content": "**End:** set the value to `max`."
		},
		{
			"heading": "keyboard-interaction",
			"content": "The value is clamped to the range from zero to `max`."
		},
		{
			"heading": "rating-props",
			"content": "| Prop    | Type     | Default | Description              |\n| ------- | -------- | ------- | ------------------------ |\n| `value` | `number` | —       | Controlled rating value. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop           | Type     | Default | Description                        |\n| -------------- | -------- | ------- | ---------------------------------- |\n| `defaultValue` | `number` | `0`     | Initial uncontrolled rating value. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop            | Type                      | Default | Description                     |\n| --------------- | ------------------------- | ------- | ------------------------------- |\n| `onValueChange` | `(value: number) => void` | —       | Called when the rating changes. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop  | Type     | Default | Description                            |\n| ----- | -------- | ------- | -------------------------------------- |\n| `max` | `number` | `5`     | Number of stars; integer from 1 to 10. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop        | Type       | Default | Description                    |\n| ----------- | ---------- | ------- | ------------------------------ |\n| `precision` | `0.5 \\| 1` | `0.5`   | Smallest selectable increment. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop   | Type                   | Default | Description               |\n| ------ | ---------------------- | ------- | ------------------------- |\n| `size` | `\"sm\" \\| \"md\" \\| \"lg\"` | `\"md\"`  | Visual size of the stars. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop       | Type      | Default | Description                             |\n| ---------- | --------- | ------- | --------------------------------------- |\n| `readOnly` | `boolean` | `false` | Displays the value without interaction. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop       | Type      | Default | Description           |\n| ---------- | --------- | ------- | --------------------- |\n| `disabled` | `boolean` | `false` | Disables interaction. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop    | Type     | Default             | Description                        |\n| ------- | -------- | ------------------- | ---------------------------------- |\n| `color` | `string` | Theme warning color | Filled and half-filled star color. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop         | Type     | Default            | Description       |\n| ------------ | -------- | ------------------ | ----------------- |\n| `emptyColor` | `string` | Theme border color | Empty star color. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop         | Type     | Default    | Description                      |\n| ------------ | -------- | ---------- | -------------------------------- |\n| `aria-label` | `string` | `\"Rating\"` | Accessible name for the control. |",
			"table": "table-0"
		},
		{
			"heading": "rating-props",
			"content": "| Prop        | Type     | Default | Description                                 |\n| ----------- | -------- | ------- | ------------------------------------------- |\n| `className` | `string` | —       | Additional class names on the root element. |",
			"table": "table-0"
		},
		{
			"heading": "typescript-types",
			"content": "The component exports `RatingProps` and `RatingSize`."
		},
		{
			"heading": "accessibility",
			"content": "Interactive Rating uses the slider pattern with a single tab stop, a meaningful accessible name, and an announced current value."
		},
		{
			"heading": "accessibility",
			"content": "Arrow keys change the value using the configured precision; Home and End move to the range boundaries."
		},
		{
			"heading": "accessibility",
			"content": "Read-only ratings are exposed as images with an accessible name that includes the current score."
		},
		{
			"heading": "accessibility",
			"content": "Star icons are decorative and hidden from assistive technology."
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
			"id": "controlled-value",
			"content": "Controlled value"
		},
		{
			"id": "read-only",
			"content": "Read-only"
		},
		{
			"id": "maximum-and-precision",
			"content": "Maximum and precision"
		},
		{
			"id": "size-and-color",
			"content": "Size and color"
		},
		{
			"id": "keyboard-interaction",
			"content": "Keyboard interaction"
		},
		{
			"id": "api-reference",
			"content": "API reference"
		},
		{
			"id": "rating-props",
			"content": "Rating props"
		},
		{
			"id": "typescript-types",
			"content": "TypeScript types"
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
		url: "#controlled-value",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled value" })
	},
	{
		depth: 2,
		url: "#read-only",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Read-only" })
	},
	{
		depth: 2,
		url: "#maximum-and-precision",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Maximum and precision" })
	},
	{
		depth: 2,
		url: "#size-and-color",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Size and color" })
	},
	{
		depth: 2,
		url: "#keyboard-interaction",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keyboard interaction" })
	},
	{
		depth: 2,
		url: "#api-reference",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API reference" })
	},
	{
		depth: 3,
		url: "#rating-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Rating props" })
	},
	{
		depth: 3,
		url: "#typescript-types",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "TypeScript types" })
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
		li: "li",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	}, { Preview, Rating } = _components;
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Rating) _missingMdxReference("Rating", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the Rating component to display a score or let users select one. It supports controlled and uncontrolled values, half-star precision, and a read-only display mode." }),
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
						children: " { Rating } "
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
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" for an uncontrolled rating. The default maximum is five stars."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 100,
			align: "center",
			justify: "center",
			code: `\
  <Rating defaultValue={3.5} />
`,
			children: (0, import_jsx_runtime.jsx)(Rating, { defaultValue: 3.5 })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-value",
			children: "Controlled value"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" and update it through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }),
			" when the user selects a rating."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 120,
			align: "center",
			justify: "center",
			code: `\
  const [rating, setRating] = useState(4);

  <Rating value={rating} onValueChange={setRating} />

`,
			children: (0, import_jsx_runtime.jsx)(Rating, { defaultValue: 4 })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "read-only",
			children: "Read-only"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "readOnly" }),
			" when the rating is informational rather than interactive."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 100,
			align: "center",
			justify: "center",
			code: `\
  <Rating value={4.5} readOnly aria-label="Product rating" />
`,
			children: (0, import_jsx_runtime.jsx)(Rating, {
				value: 4.5,
				readOnly: true,
				"aria-label": "Product rating"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "maximum-and-precision",
			children: "Maximum and precision"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "max" }),
			" to change the number of stars. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "precision" }),
			" controls the smallest selectable increment: ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0.5" }),
			" (default) or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 100,
			align: "center",
			justify: "center",
			code: `\
  <Rating defaultValue={7} max={10} precision={1} />
`,
			children: (0, import_jsx_runtime.jsx)(Rating, {
				defaultValue: 7,
				max: 10,
				precision: 1
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "size-and-color",
			children: "Size and color"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "size" }),
			" to choose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			" (default), or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }),
			". Override ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "color" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "emptyColor" }),
			" to match a particular context."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 120,
			align: "center",
			justify: "center",
			code: `\
  <div style={{ display: "grid", gap: 12 }}>
    <Rating value={4} readOnly size="sm" />
    <Rating value={4} readOnly size="md" />
    <Rating value={4} readOnly size="lg" color="#b66a4d" />
  </div>
`,
			children: (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "grid",
					gap: 12
				},
				children: [
					(0, import_jsx_runtime.jsx)(Rating, {
						value: 4,
						readOnly: true,
						size: "sm"
					}),
					(0, import_jsx_runtime.jsx)(Rating, {
						value: 4,
						readOnly: true,
						size: "md"
					}),
					(0, import_jsx_runtime.jsx)(Rating, {
						value: 4,
						readOnly: true,
						size: "lg",
						color: "#b66a4d"
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "keyboard-interaction",
			children: "Keyboard interaction"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When interactive, the component exposes the slider pattern:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "Arrow Right / Arrow Up:" }),
				" increase by ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "precision" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "Arrow Left / Arrow Down:" }),
				" decrease by ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "precision" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.strong, { children: "Home:" }), " set the value to zero."] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "End:" }),
				" set the value to ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "max" }),
				"."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The value is clamped to the range from zero to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "max" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api-reference",
			children: "API reference"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "rating-props",
			children: "Rating props"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled rating value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled rating value." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onValueChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: number) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when the rating changes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "max" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "5" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Number of stars; integer from 1 to 10." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "precision" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.5 | 1" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0.5" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Smallest selectable increment." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\" | \"md\" | \"lg\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual size of the stars." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readOnly" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays the value without interaction." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables interaction." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "color" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Theme warning color" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Filled and half-filled star color." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "emptyColor" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Theme border color" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Empty star color." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Rating\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name for the control." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class names on the root element." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component exports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "RatingProps" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "RatingSize" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Interactive Rating uses the slider pattern with a single tab stop, a meaningful accessible name, and an announced current value." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Arrow keys change the value using the configured precision; Home and End move to the range boundaries." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Read-only ratings are exposed as images with an accessible name that includes the current score." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Star icons are decorative and hidden from assistive technology." })
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
