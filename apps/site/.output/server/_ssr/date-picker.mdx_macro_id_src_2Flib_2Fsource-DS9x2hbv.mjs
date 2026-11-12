import { ControlledDatePickerExample, DatePickerFormExample } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/date-picker.mdx_macro_id_src_2Flib_2Fsource-DS9x2hbv.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Date Picker",
	"description": "Choose a single date from an accessible calendar popup."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Date Picker combines a button trigger, a calendar dialog, and a native date input for form integration. It selects a single calendar date, not a time or a date range."
		},
		{
			"heading": "basic-usage",
			"content": "Use `label` for a visible, accessible field name. `placeholder` appears when nothing is selected, and `description` provides supporting text. Click the trigger or use Enter, Space, ArrowUp, or ArrowDown to open the calendar."
		},
		{
			"heading": "basic-usage",
			"content": "The calendar opens at the selected date when it is available. Without an available selection, it starts from today or the nearest available date within your bounds. Selecting a day closes the calendar and returns focus to the trigger. **Today** selects the current date when it is available."
		},
		{
			"heading": "date-values-and-time-zones",
			"content": "Pass JavaScript `Date` objects. Date Picker normalizes them to midnight in the local time zone and calls `onChange` with a new `Date` instance, or `null` when cleared."
		},
		{
			"heading": "date-values-and-time-zones",
			"content": "Use `new Date(year, monthIndex, day)` for calendar dates; months are zero-based. For example, `new Date(2025, 2, 15)` is 15 March 2025. Avoid `new Date(\"2025-03-15\")` for a local date because date-only ISO strings are parsed as UTC and can display a different day in some time zones."
		},
		{
			"heading": "controlled-selection-and-clearing",
			"content": "Use `value` with `onChange` to own the selection. Date Picker uses `null` for a controlled empty value; omitting `value` enables uncontrolled usage with `defaultValue`."
		},
		{
			"heading": "controlled-selection-and-clearing",
			"content": "`clearable` adds a clear button when a date is selected. Customize its accessible name with `clearLabel`. Required fields cannot be cleared through this button."
		},
		{
			"heading": "date-availability",
			"content": "`minDate` and `maxDate` define inclusive bounds. Use `disabledDates` for specific exclusions and `shouldDisableDate` for recurring rules such as weekends. All restrictions are combined; the callback receives a date normalized to local midnight."
		},
		{
			"heading": "date-availability",
			"content": "Unavailable days remain visible but disabled, and keyboard navigation skips them. Month navigation is disabled at the minimum and maximum boundaries. A selected date that becomes unavailable is not silently replaced; its native input is marked invalid until a valid date is selected."
		},
		{
			"heading": "locale-week-start-and-formatting",
			"content": "`locale` controls month names, weekday labels, day numbers, and the displayed selection. `weekStartsOn` overrides the locale's first weekday: `0` is Sunday, `1` is Monday, through `6` for Saturday."
		},
		{
			"heading": "locale-week-start-and-formatting",
			"content": "`dateFormat` customizes the trigger's date format without shortening the accessible names of day buttons. Translate `calendarLabel`, `previousMonthLabel`, `nextMonthLabel`, and `clearLabel` for your application. The built-in Today action and empty-calendar message currently use English text."
		},
		{
			"heading": "sizes-and-responsive-width",
			"content": "`size` supports `sm`, `md`, and `lg`. `fullWidth` fills the available width. Both accept responsive values using `mobile`, `tablet`, and `desktop` keys. Change the preview device to compare the responsive control."
		},
		{
			"heading": "popup-placement-and-visibility",
			"content": "`position` requests a side, `align` controls alignment, and `offset` sets the trigger gap in pixels. `collisionPadding` reserves space at viewport edges. The calendar can fall back to another side when the requested placement does not fit."
		},
		{
			"heading": "popup-placement-and-visibility",
			"content": "`defaultOpen` sets initial uncontrolled visibility. Use `open` with `onOpenChange` for controlled visibility, independently of controlled selection."
		},
		{
			"heading": "required-error-and-disabled-states",
			"content": "`required` marks the field required and enables native required validation. `error` displays a message and marks the trigger invalid; `error={true}` displays \"Invalid date\". External `aria-invalid` is combined with the error state."
		},
		{
			"heading": "required-error-and-disabled-states",
			"content": "`disabled` prevents interaction and excludes the native input from form submission. Supporting description and error IDs are combined with any external `aria-describedby`."
		},
		{
			"heading": "native-forms",
			"content": "Supply `name` to include the selected date in native form submission as `YYYY-MM-DD`, regardless of the display locale. `form` associates the input with a form elsewhere in the document. The hidden native input carries required, minimum, maximum, and custom date-availability validation; invalid submission focuses the visible trigger."
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop    | Type           | Default | Description                                      |\n| ------- | -------------- | ------- | ------------------------------------------------ |\n| `value` | `Date \\| null` | -       | Controlled selection; `null` represents no date. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop           | Type           | Default | Description                     |\n| -------------- | -------------- | ------- | ------------------------------- |\n| `defaultValue` | `Date \\| null` | `null`  | Initial uncontrolled selection. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop       | Type                            | Default | Description                                           |\n| ---------- | ------------------------------- | ------- | ----------------------------------------------------- |\n| `onChange` | `(value: Date \\| null) => void` | -       | Selected local-midnight date, or `null` when cleared. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop    | Type        | Default | Description          |\n| ------- | ----------- | ------- | -------------------- |\n| `label` | `ReactNode` | -       | Visible field label. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop          | Type        | Default         | Description                          |\n| ------------- | ----------- | --------------- | ------------------------------------ |\n| `placeholder` | `ReactNode` | `\"Select date\"` | Trigger content without a selection. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop          | Type        | Default | Description                        |\n| ------------- | ----------- | ------- | ---------------------------------- |\n| `description` | `ReactNode` | -       | Supporting text below the control. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop    | Type                   | Default | Description                                |\n| ------- | ---------------------- | ------- | ------------------------------------------ |\n| `error` | `ReactNode \\| boolean` | -       | Error message; `true` uses \"Invalid date\". |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop       | Type      | Default | Description                            |\n| ---------- | --------- | ------- | -------------------------------------- |\n| `disabled` | `boolean` | `false` | Disables the control and native input. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop       | Type      | Default | Description                                        |\n| ---------- | --------- | ------- | -------------------------------------------------- |\n| `required` | `boolean` | `false` | Enables required validation and prevents clearing. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop        | Type      | Default | Description                                            |\n| ----------- | --------- | ------- | ------------------------------------------------------ |\n| `clearable` | `boolean` | `false` | Adds a clear action for a selected, non-required date. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop         | Type     | Default        | Description                          |\n| ------------ | -------- | -------------- | ------------------------------------ |\n| `clearLabel` | `string` | `\"Clear date\"` | Accessible name of the clear button. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop   | Type     | Default | Description             |\n| ------ | -------- | ------- | ----------------------- |\n| `name` | `string` | -       | Native form field name. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop   | Type     | Default | Description                |\n| ------ | -------- | ------- | -------------------------- |\n| `form` | `string` | -       | ID of the associated form. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop   | Type                              | Default | Description                              |\n| ------ | --------------------------------- | ------- | ---------------------------------------- |\n| `size` | `ResponsiveValue<DatePickerSize>` | `\"md\"`  | Trigger size: `\"sm\"`, `\"md\"`, or `\"lg\"`. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "| Prop        | Type                       | Default | Description                |\n| ----------- | -------------------------- | ------- | -------------------------- |\n| `fullWidth` | `ResponsiveValue<boolean>` | `false` | Fills the available width. |",
			"table": "table-0"
		},
		{
			"heading": "selection-and-field-props",
			"content": "`ResponsiveValue<T>` accepts a value or an object with `mobile`, `tablet`, and `desktop` keys."
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop      | Type   | Default | Description                          |\n| --------- | ------ | ------- | ------------------------------------ |\n| `minDate` | `Date` | -       | Earliest selectable date, inclusive. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop      | Type   | Default | Description                        |\n| --------- | ------ | ------- | ---------------------------------- |\n| `maxDate` | `Date` | -       | Latest selectable date, inclusive. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop            | Type              | Default | Description                    |\n| --------------- | ----------------- | ------- | ------------------------------ |\n| `disabledDates` | `readonly Date[]` | `[]`    | Dates excluded from selection. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop                | Type                      | Default | Description                           |\n| ------------------- | ------------------------- | ------- | ------------------------------------- |\n| `shouldDisableDate` | `(date: Date) => boolean` | -       | Returns `true` for unavailable dates. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop     | Type     | Default        | Description                                           |\n| -------- | -------- | -------------- | ----------------------------------------------------- |\n| `locale` | `string` | Runtime locale | Locale for dates, month names, weekdays, and numbers. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop           | Type                              | Default           | Description                                                                                       |\n| -------------- | --------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |\n| `weekStartsOn` | `0 \\| 1 \\| 2 \\| 3 \\| 4 \\| 5 \\| 6` | Locale week start | First weekday; Sunday is `0`. Sunday is the fallback when locale week information is unavailable. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop         | Type                         | Default                      | Description                                  |\n| ------------ | ---------------------------- | ---------------------------- | -------------------------------------------- |\n| `dateFormat` | `Intl.DateTimeFormatOptions` | Long month, numeric day/year | Format for the selected date in the trigger. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop            | Type     | Default         | Description                             |\n| --------------- | -------- | --------------- | --------------------------------------- |\n| `calendarLabel` | `string` | `\"Choose date\"` | Accessible name of the calendar dialog. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop                 | Type     | Default            | Description                                                 |\n| -------------------- | -------- | ------------------ | ----------------------------------------------------------- |\n| `previousMonthLabel` | `string` | `\"Previous month\"` | Previous navigation label prefix; target month is appended. |",
			"table": "table-1"
		},
		{
			"heading": "availability-and-localization",
			"content": "| Prop             | Type     | Default        | Description                                             |\n| ---------------- | -------- | -------------- | ------------------------------------------------------- |\n| `nextMonthLabel` | `string` | `\"Next month\"` | Next navigation label prefix; target month is appended. |",
			"table": "table-1"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop   | Type      | Default | Description                     |\n| ------ | --------- | ------- | ------------------------------- |\n| `open` | `boolean` | -       | Controlled calendar visibility. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop          | Type      | Default | Description                      |\n| ------------- | --------- | ------- | -------------------------------- |\n| `defaultOpen` | `boolean` | `false` | Initial uncontrolled visibility. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop           | Type                      | Default | Description                                   |\n| -------------- | ------------------------- | ------- | --------------------------------------------- |\n| `onOpenChange` | `(open: boolean) => void` | -       | Called when visibility changes are requested. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop       | Type                                     | Default    | Description           |\n| ---------- | ---------------------------------------- | ---------- | --------------------- |\n| `position` | `\"top\" \\| \"right\" \\| \"bottom\" \\| \"left\"` | `\"bottom\"` | Preferred popup side. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop    | Type                           | Default   | Description                  |\n| ------- | ------------------------------ | --------- | ---------------------------- |\n| `align` | `\"start\" \\| \"center\" \\| \"end\"` | `\"start\"` | Alignment along the trigger. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop     | Type     | Default | Description                          |\n| -------- | -------- | ------- | ------------------------------------ |\n| `offset` | `number` | `8`     | Trigger-to-popup distance in pixels. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop               | Type     | Default | Description                               |\n| ------------------ | -------- | ------- | ----------------------------------------- |\n| `collisionPadding` | `number` | `8`     | Minimum viewport-edge distance in pixels. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop        | Type     | Default | Description                             |\n| ----------- | -------- | ------- | --------------------------------------- |\n| `className` | `string` | -       | Additional class on the trigger button. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop            | Type     | Default | Description                          |\n| --------------- | -------- | ------- | ------------------------------------ |\n| `rootClassName` | `string` | -       | Additional class on the outer field. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "| Prop               | Type     | Default | Description                            |\n| ------------------ | -------- | ------- | -------------------------------------- |\n| `popoverClassName` | `string` | -       | Additional class on the popup content. |",
			"table": "table-2"
		},
		{
			"heading": "popup-and-styling",
			"content": "Other supported native button attributes, including `id`, `style`, `dir`, `aria-label`, `aria-labelledby`, and `aria-describedby`, apply to the trigger. Use an accessible name when there is no visible label."
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "The trigger exposes `aria-haspopup=\"dialog\"`, `aria-expanded`, and `aria-controls` while open. The dialog contains a labelled grid; days have full localized date names, selected cells expose `aria-selected`, and today exposes `aria-current=\"date\"`."
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key                                  | Behavior                                         |\n| ------------------------------------ | ------------------------------------------------ |\n| Enter, Space, Up/Down on the trigger | Opens the calendar and focuses an available day. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key        | Behavior                                                                     |\n| ---------- | ---------------------------------------------------------------------------- |\n| Left/Right | Moves one day, skipping unavailable dates; horizontal direction follows RTL. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key                     | Behavior                                             |\n| ----------------------- | ---------------------------------------------------- |\n| Up/Down in the calendar | Moves one week, then searches for an available date. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key      | Behavior                                                   |\n| -------- | ---------------------------------------------------------- |\n| Home/End | Moves to the first/last available day in the current week. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key             | Behavior                                               |\n| --------------- | ------------------------------------------------------ |\n| PageUp/PageDown | Moves one month, clamping the day at month boundaries. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key                     | Behavior                                     |\n| ----------------------- | -------------------------------------------- |\n| Shift + PageUp/PageDown | Moves one year, including leap-day clamping. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key                  | Behavior                                                           |\n| -------------------- | ------------------------------------------------------------------ |\n| Enter/Space on a day | Selects it, closes the calendar, and returns focus to the trigger. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key    | Behavior                                              |\n| ------ | ----------------------------------------------------- |\n| Escape | Closes the calendar and returns focus to the trigger. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "| Key             | Behavior                                                         |\n| --------------- | ---------------------------------------------------------------- |\n| Tab/Shift + Tab | Closes the calendar and resumes tab navigation from the trigger. |",
			"table": "table-3"
		},
		{
			"heading": "accessibility-and-keyboard-interaction",
			"content": "Month changes are announced politely. Provide visible explanations for unavailable dates and validation errors rather than relying only on disabled styling."
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
			"id": "date-values-and-time-zones",
			"content": "Date values and time zones"
		},
		{
			"id": "controlled-selection-and-clearing",
			"content": "Controlled selection and clearing"
		},
		{
			"id": "date-availability",
			"content": "Date availability"
		},
		{
			"id": "locale-week-start-and-formatting",
			"content": "Locale, week start, and formatting"
		},
		{
			"id": "sizes-and-responsive-width",
			"content": "Sizes and responsive width"
		},
		{
			"id": "popup-placement-and-visibility",
			"content": "Popup placement and visibility"
		},
		{
			"id": "required-error-and-disabled-states",
			"content": "Required, error, and disabled states"
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
			"id": "selection-and-field-props",
			"content": "Selection and field props"
		},
		{
			"id": "availability-and-localization",
			"content": "Availability and localization"
		},
		{
			"id": "popup-and-styling",
			"content": "Popup and styling"
		},
		{
			"id": "accessibility-and-keyboard-interaction",
			"content": "Accessibility and keyboard interaction"
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
		depth: 3,
		url: "#date-values-and-time-zones",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Date values and time zones" })
	},
	{
		depth: 2,
		url: "#controlled-selection-and-clearing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Controlled selection and clearing" })
	},
	{
		depth: 2,
		url: "#date-availability",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Date availability" })
	},
	{
		depth: 2,
		url: "#locale-week-start-and-formatting",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Locale, week start, and formatting" })
	},
	{
		depth: 2,
		url: "#sizes-and-responsive-width",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Sizes and responsive width" })
	},
	{
		depth: 2,
		url: "#popup-placement-and-visibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Popup placement and visibility" })
	},
	{
		depth: 2,
		url: "#required-error-and-disabled-states",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Required, error, and disabled states" })
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
		depth: 3,
		url: "#selection-and-field-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Selection and field props" })
	},
	{
		depth: 3,
		url: "#availability-and-localization",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Availability and localization" })
	},
	{
		depth: 3,
		url: "#popup-and-styling",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Popup and styling" })
	},
	{
		depth: 2,
		url: "#accessibility-and-keyboard-interaction",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility and keyboard interaction" })
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
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	}, { DatePicker, Preview, Section, Stack } = _components;
	if (!DatePicker) _missingMdxReference("DatePicker", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Date Picker combines a button trigger, a calendar dialog, and a native date input for form integration. It selects a single calendar date, not a time or a date range." }),
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
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "import"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " {"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  DatePicker,"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "  type"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " DatePickerProps,"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "  type"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " DatePickerSize,"
					})]
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
							children: "} "
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
				})
			] })
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
			" for a visible, accessible field name. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "placeholder" }),
			" appears when nothing is selected, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "description" }),
			" provides supporting text. Click the trigger or use Enter, Space, ArrowUp, or ArrowDown to open the calendar."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 600,
			code: `\
<DatePicker
label="Appointment date"
placeholder="Choose an appointment"
description="Choose a date that works for you."
locale="en-GB"
defaultValue={new Date(2025, 2, 15)}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Appointment date",
				placeholder: "Choose an appointment",
				description: "Choose a date that works for you.",
				locale: "en-GB",
				defaultValue: new Date(2025, 2, 15)
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The calendar opens at the selected date when it is available. Without an available selection, it starts from today or the nearest available date within your bounds. Selecting a day closes the calendar and returns focus to the trigger. ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "Today" }),
			" selects the current date when it is available."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "date-values-and-time-zones",
			children: "Date values and time zones"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Pass JavaScript ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Date" }),
			" objects. Date Picker normalizes them to midnight in the local time zone and calls ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" with a new ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Date" }),
			" instance, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
			" when cleared."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "new Date(year, monthIndex, day)" }),
			" for calendar dates; months are zero-based. For example, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "new Date(2025, 2, 15)" }),
			" is 15 March 2025. Avoid ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "new Date(\"2025-03-15\")" }),
			" for a local date because date-only ISO strings are parsed as UTC and can display a different day in some time zones."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "controlled-selection-and-clearing",
			children: "Controlled selection and clearing"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" to own the selection. Date Picker uses ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
			" for a controlled empty value; omitting ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" enables uncontrolled usage with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clearable" }),
			" adds a clear button when a date is selected. Customize its accessible name with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }),
			". Required fields cannot be cleared through this button."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 620,
			code: `\
const [date, setDate] = useState<Date | null>(new Date(2025, 2, 15));

return (

<Stack>
  <DatePicker
    label="Appointment"
    locale="en-GB"
    value={date}
    onChange={setDate}
    clearable
  />
  <span role="status">
    {date
      ? "Selected: " + date.toLocaleDateString("en-GB")
      : "No date selected"}
  </span>
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(ControlledDatePickerExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "date-availability",
			children: "Date availability"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "minDate" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxDate" }),
			" define inclusive bounds. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabledDates" }),
			" for specific exclusions and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "shouldDisableDate" }),
			" for recurring rules such as weekends. All restrictions are combined; the callback receives a date normalized to local midnight."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 600,
			code: `\
<DatePicker
label="Delivery date"
locale="en-GB"
defaultValue={new Date(2025, 2, 14)}
minDate={new Date(2025, 2, 10)}
maxDate={new Date(2025, 2, 28)}
disabledDates={[new Date(2025, 2, 17)]}
shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
description="Weekdays from 10 to 28 March, excluding 17 March."
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Delivery date",
				locale: "en-GB",
				defaultValue: new Date(2025, 2, 14),
				minDate: new Date(2025, 2, 10),
				maxDate: new Date(2025, 2, 28),
				disabledDates: [new Date(2025, 2, 17)],
				shouldDisableDate: (date) => date.getDay() === 0 || date.getDay() === 6,
				description: "Weekdays from 10 to 28 March, excluding 17 March."
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Unavailable days remain visible but disabled, and keyboard navigation skips them. Month navigation is disabled at the minimum and maximum boundaries. A selected date that becomes unavailable is not silently replaced; its native input is marked invalid until a valid date is selected." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "locale-week-start-and-formatting",
			children: "Locale, week start, and formatting"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "locale" }),
			" controls month names, weekday labels, day numbers, and the displayed selection. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "weekStartsOn" }),
			" overrides the locale's first weekday: ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
			" is Sunday, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "1" }),
			" is Monday, through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "6" }),
			" for Saturday."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "dateFormat" }),
			" customizes the trigger's date format without shortening the accessible names of day buttons. Translate ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "calendarLabel" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "previousMonthLabel" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nextMonthLabel" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }),
			" for your application. The built-in Today action and empty-calendar message currently use English text."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 700,
			code: `\
<Stack>
<DatePicker
  label="Datum"
  locale="nl-NL"
  weekStartsOn={1}
  dateFormat={{ day: "2-digit", month: "2-digit", year: "numeric" }}
  defaultValue={new Date(2025, 2, 15)}
  calendarLabel="Kies een datum"
  previousMonthLabel="Vorige maand"
  nextMonthLabel="Volgende maand"
  clearable
  clearLabel="Datum wissen"
/>
<DatePicker
  label="Sunday-first calendar"
  locale="en-US"
  weekStartsOn={0}
  defaultValue={new Date(2025, 2, 15)}
/>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Datum",
				locale: "nl-NL",
				weekStartsOn: 1,
				dateFormat: {
					day: "2-digit",
					month: "2-digit",
					year: "numeric"
				},
				defaultValue: new Date(2025, 2, 15),
				calendarLabel: "Kies een datum",
				previousMonthLabel: "Vorige maand",
				nextMonthLabel: "Volgende maand",
				clearable: true,
				clearLabel: "Datum wissen"
			}), (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Sunday-first calendar",
				locale: "en-US",
				weekStartsOn: 0,
				defaultValue: new Date(2025, 2, 15)
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "sizes-and-responsive-width",
			children: "Sizes and responsive width"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "size" }),
			" supports ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }),
			". ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }),
			" fills the available width. Both accept responsive values using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "mobile" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tablet" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "desktop" }),
			" keys. Change the preview device to compare the responsive control."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 760,
			code: `\
<Stack>
<DatePicker label="Small" size="sm" defaultValue={new Date(2025, 2, 15)} />
<DatePicker label="Medium" size="md" defaultValue={new Date(2025, 2, 15)} />
<DatePicker label="Large" size="lg" defaultValue={new Date(2025, 2, 15)} />
<DatePicker
  label="Responsive"
  size={{ mobile: "sm", tablet: "md", desktop: "lg" }}
  fullWidth
  defaultValue={new Date(2025, 2, 15)}
/>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsx)(DatePicker, {
					label: "Small",
					size: "sm",
					defaultValue: new Date(2025, 2, 15)
				}),
				(0, import_jsx_runtime.jsx)(DatePicker, {
					label: "Medium",
					size: "md",
					defaultValue: new Date(2025, 2, 15)
				}),
				(0, import_jsx_runtime.jsx)(DatePicker, {
					label: "Large",
					size: "lg",
					defaultValue: new Date(2025, 2, 15)
				}),
				(0, import_jsx_runtime.jsx)(DatePicker, {
					label: "Responsive",
					size: {
						mobile: "sm",
						tablet: "md",
						desktop: "lg"
					},
					fullWidth: true,
					defaultValue: new Date(2025, 2, 15)
				})
			] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "popup-placement-and-visibility",
			children: "Popup placement and visibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "position" }),
			" requests a side, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "align" }),
			" controls alignment, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }),
			" sets the trigger gap in pixels. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "collisionPadding" }),
			" reserves space at viewport edges. The calendar can fall back to another side when the requested placement does not fit."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }),
			" sets initial uncontrolled visibility. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "open" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }),
			" for controlled visibility, independently of controlled selection."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 650,
			align: "end",
			code: `\
<DatePicker
label="Open above"
locale="en-GB"
defaultValue={new Date(2025, 2, 15)}
defaultOpen
position="top"
align="end"
offset={12}
collisionPadding={16}
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Open above",
				locale: "en-GB",
				defaultValue: new Date(2025, 2, 15),
				defaultOpen: true,
				position: "top",
				align: "end",
				offset: 12,
				collisionPadding: 16
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "required-error-and-disabled-states",
			children: "Required, error, and disabled states"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "required" }),
			" marks the field required and enables native required validation. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "error" }),
			" displays a message and marks the trigger invalid; ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "error={true}" }),
			" displays \"Invalid date\". External ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }),
			" is combined with the error state."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" prevents interaction and excludes the native input from form submission. Supporting description and error IDs are combined with any external ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 720,
			code: `\
<Stack>
<DatePicker
  label="Required appointment"
  name="required-appointment"
  required
  error="Choose a date to continue."
/>
<DatePicker
  label="Unavailable"
  disabled
  defaultValue={new Date(2025, 2, 15)}
  description="Appointments are temporarily locked."
/>
</Stack>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsxs)(Stack, { children: [(0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Required appointment",
				name: "required-appointment",
				required: true,
				error: "Choose a date to continue."
			}), (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Unavailable",
				disabled: true,
				defaultValue: new Date(2025, 2, 15),
				description: "Appointments are temporarily locked."
			})] }) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "native-forms",
			children: "Native forms"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Supply ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "name" }),
			" to include the selected date in native form submission as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "YYYY-MM-DD" }),
			", regardless of the display locale. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "form" }),
			" associates the input with a form elsewhere in the document. The hidden native input carries required, minimum, maximum, and custom date-availability validation; invalid submission focuses the visible trigger."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 680,
			code: `\
const [submittedDate, setSubmittedDate] = useState("");

return (

<form onSubmit={(event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  setSubmittedDate(String(data.get("appointment")));
}}>
  <Stack>
    <DatePicker
      label="Appointment date"
      name="appointment"
      locale="en-GB"
      defaultValue={new Date(2025, 2, 15)}
      required
    />
    <Button type="submit">Submit appointment</Button>
    <span role="status">
      {submittedDate ? "Submitted: " + submittedDate : "Not submitted"}
    </span>
  </Stack>
</form>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(DatePickerFormExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "selection-and-field-props",
			children: "Selection and field props"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Date | null" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Controlled selection; ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
					" represents no date."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Date | null" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "null" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(value: Date | null) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Selected local-midnight date, or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "null" }),
					" when cleared."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible field label." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "placeholder" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Select date\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Trigger content without a selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Supporting text below the control." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "error" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode | boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Error message; ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "true" }),
					" uses \"Invalid date\"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables the control and native input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "required" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Enables required validation and prevents clearing." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearable" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Adds a clear action for a selected, non-required date." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "clearLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Clear date\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name of the clear button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "name" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native form field name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "form" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "ID of the associated form." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ResponsiveValue<DatePickerSize>" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Trigger size: ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"sm\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }),
					", or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"lg\"" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ResponsiveValue<boolean>" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Fills the available width." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ResponsiveValue<T>" }),
			" accepts a value or an object with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "mobile" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tablet" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "desktop" }),
			" keys."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "availability-and-localization",
			children: "Availability and localization"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "minDate" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Date" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Earliest selectable date, inclusive." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "maxDate" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Date" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Latest selectable date, inclusive." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabledDates" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly Date[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dates excluded from selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "shouldDisableDate" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(date: Date) => boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"Returns ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "true" }),
					" for unavailable dates."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "locale" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Runtime locale" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Locale for dates, month names, weekdays, and numbers." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "weekStartsOn" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "0 | 1 | 2 | 3 | 4 | 5 | 6" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Locale week start" }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					"First weekday; Sunday is ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
					". Sunday is the fallback when locale week information is unavailable."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "dateFormat" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Intl.DateTimeFormatOptions" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Long month, numeric day/year" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Format for the selected date in the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "calendarLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Choose date\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name of the calendar dialog." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "previousMonthLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Previous month\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Previous navigation label prefix; target month is appended." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "nextMonthLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Next month\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Next navigation label prefix; target month is appended." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "popup-and-styling",
			children: "Popup and styling"
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Controlled calendar visibility." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "defaultOpen" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Initial uncontrolled visibility." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onOpenChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(open: boolean) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Called when visibility changes are requested." })
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
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Alignment along the trigger." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "offset" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Trigger-to-popup distance in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "collisionPadding" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "8" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Minimum viewport-edge distance in pixels." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the trigger button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "rootClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the outer field." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "popoverClassName" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the popup content." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other supported native button attributes, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "id" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "style" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "dir" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-labelledby" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }),
			", apply to the trigger. Use an accessible name when there is no visible label."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility-and-keyboard-interaction",
			children: "Accessibility and keyboard interaction"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The trigger exposes ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-haspopup=\"dialog\"" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-expanded" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-controls" }),
			" while open. The dialog contains a labelled grid; days have full localized date names, selected cells expose ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-selected" }),
			", and today exposes ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-current=\"date\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Key" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Behavior" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Enter, Space, Up/Down on the trigger" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Opens the calendar and focuses an available day." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Left/Right" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Moves one day, skipping unavailable dates; horizontal direction follows RTL." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Up/Down in the calendar" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Moves one week, then searches for an available date." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Home/End" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Moves to the first/last available day in the current week." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "PageUp/PageDown" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Moves one month, clamping the day at month boundaries." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Shift + PageUp/PageDown" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Moves one year, including leap-day clamping." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Enter/Space on a day" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Selects it, closes the calendar, and returns focus to the trigger." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Escape" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Closes the calendar and returns focus to the trigger." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Tab/Shift + Tab" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Closes the calendar and resumes tab navigation from the trigger." })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Month changes are announced politely. Provide visible explanations for unavailable dates and validation errors rather than relying only on disabled styling." })
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
