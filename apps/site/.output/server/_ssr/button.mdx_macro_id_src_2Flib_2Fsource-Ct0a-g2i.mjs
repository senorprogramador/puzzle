import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/button.mdx_macro_id_src_2Flib_2Fsource-Ct0a-g2i.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Button",
	"description": "Buttons allow users to perform actions and navigate through your application."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "They provide clear visual feedback and communicate the importance and intent of an action."
		},
		{
			"heading": void 0,
			"content": "The Puzzle Button component supports both native buttons and links. When a `href` is provided, the component automatically renders a Puzzle `Link` instead of a native `<button>`."
		},
		{
			"heading": void 0,
			"content": "Read more about the Link component here."
		},
		{
			"heading": "basic-usage",
			"content": "Use the Button component to trigger an action."
		},
		{
			"heading": "basic-usage",
			"content": "Click me"
		},
		{
			"heading": "basic-usage",
			"content": "By default, a Button renders a native HTML `<button>` element with `type=\"button\"`."
		},
		{
			"heading": "variants",
			"content": "The `variant` prop controls the visual appearance and emphasis of the Button."
		},
		{
			"heading": "variants",
			"content": "| Variant   | Description                                                                 |\n| --------- | --------------------------------------------------------------------------- |\n| `primary` | The primary action. Use for the most important action in a section or page. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant     | Description                                   |\n| ----------- | --------------------------------------------- |\n| `secondary` | A secondary action with less visual emphasis. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant   | Description                                                                          |\n| --------- | ------------------------------------------------------------------------------------ |\n| `outline` | An outlined button for actions that need a visible boundary without strong emphasis. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant | Description                                     |\n| ------- | ----------------------------------------------- |\n| `ghost` | A subtle button without a prominent background. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant  | Description                                                       |\n| -------- | ----------------------------------------------------------------- |\n| `danger` | An action that may have destructive or irreversible consequences. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant | Description                               |\n| ------- | ----------------------------------------- |\n| `link`  | A button styled to look like a text link. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant  | Description                                  |\n| -------- | -------------------------------------------- |\n| `toggle` | A toggle-style button in its inactive state. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "| Variant         | Description                                |\n| --------------- | ------------------------------------------ |\n| `toggle-active` | A toggle-style button in its active state. |",
			"table": "table-0"
		},
		{
			"heading": "variants",
			"content": "The default variant is `primary`."
		},
		{
			"heading": "variants",
			"content": "Primary"
		},
		{
			"heading": "variants",
			"content": "Secondary"
		},
		{
			"heading": "variants",
			"content": "Outline"
		},
		{
			"heading": "variants",
			"content": "Ghost"
		},
		{
			"heading": "variants",
			"content": "Danger"
		},
		{
			"heading": "variants",
			"content": "Link"
		},
		{
			"heading": "variants",
			"content": "Toggle"
		},
		{
			"heading": "variants",
			"content": "Toggle active"
		},
		{
			"heading": "variants",
			"content": "The `link` variant only changes the visual appearance. It does not turn the Button\ninto a navigation link. To render an actual link, provide an href."
		},
		{
			"heading": "sizes",
			"content": "Use the size prop to control the dimensions of the Button."
		},
		{
			"heading": "sizes",
			"content": "| Size | Description |\n| ---- | ----------- |\n| `xs` | Extra small |",
			"table": "table-1"
		},
		{
			"heading": "sizes",
			"content": "| Size | Description |\n| ---- | ----------- |\n| `sm` | Small       |",
			"table": "table-1"
		},
		{
			"heading": "sizes",
			"content": "| Size | Description |\n| ---- | ----------- |\n| `md` | Medium      |",
			"table": "table-1"
		},
		{
			"heading": "sizes",
			"content": "| Size | Description |\n| ---- | ----------- |\n| `lg` | Large       |",
			"table": "table-1"
		},
		{
			"heading": "sizes",
			"content": "| Size   | Description      |\n| ------ | ---------------- |\n| `icon` | Icon-only button |",
			"table": "table-1"
		},
		{
			"heading": "sizes",
			"content": "The default size is `md`."
		},
		{
			"heading": "sizes",
			"content": "Extra small"
		},
		{
			"heading": "sizes",
			"content": "Small"
		},
		{
			"heading": "sizes",
			"content": "Medium"
		},
		{
			"heading": "sizes",
			"content": "Large"
		},
		{
			"heading": "sizes",
			"content": "The `icon` size is intended for buttons that contain only an icon. Always provide an accessible name, for example through `aria-label`."
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "The `leading` and `trailing` props allow you to add content before or after the Button's children."
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "They are useful for icons, indicators, or other supplementary content."
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "Add item"
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "Continue"
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "Add and continue"
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "Both props accept React nodes, so you can use any component or element as their content."
		},
		{
			"heading": "leading-and-trailing-content",
			"content": "When `loading` is enabled, the leading content is replaced by the loading indicator. Trailing content remains visible."
		},
		{
			"heading": "loading",
			"content": "Use the `loading` prop to indicate that an action is being processed."
		},
		{
			"heading": "loading",
			"content": "Saving"
		},
		{
			"heading": "loading",
			"content": "When loading:"
		},
		{
			"heading": "loading",
			"content": "A loading indicator replaces the leading content."
		},
		{
			"heading": "loading",
			"content": "The Button receives `aria-busy=\"true\"`."
		},
		{
			"heading": "loading",
			"content": "Native buttons become disabled."
		},
		{
			"heading": "loading",
			"content": "Link buttons prevent navigation and interaction."
		},
		{
			"heading": "loading",
			"content": "Trailing content remains visible."
		},
		{
			"heading": "loading",
			"content": "The loading state also prevents accidental repeated activation while an operation is in progress."
		},
		{
			"heading": "disabled",
			"content": "Use the `disabled` prop when an action is currently unavailable."
		},
		{
			"heading": "disabled",
			"content": "Disabled"
		},
		{
			"heading": "disabled",
			"content": "The disabled state can also be activated through `aria-disabled`."
		},
		{
			"heading": "disabled",
			"content": "Unavailable"
		},
		{
			"heading": "disabled",
			"content": "For native buttons, the component uses the native `disabled` attribute."
		},
		{
			"heading": "disabled",
			"content": "For links, the component uses `aria-disabled`, removes the link from the tab order, and prevents mouse and keyboard activation. This preserves the semantic distinction between a button and a link while providing consistent disabled behavior."
		},
		{
			"heading": "disabled",
			"content": "A Button is also considered disabled while `loading` is active."
		},
		{
			"heading": "full-width",
			"content": "Use `fullWidth` to make a Button fill the available width of its container."
		},
		{
			"heading": "full-width",
			"content": "Continue"
		},
		{
			"heading": "full-width",
			"content": "This is useful for form actions, mobile layouts, and other situations where a full-width action is preferred."
		},
		{
			"heading": "navigation-links",
			"content": "The Button component automatically renders a Puzzle `Link` when an `href` is provided."
		},
		{
			"heading": "navigation-links",
			"content": "Go to dashboard"
		},
		{
			"heading": "navigation-links",
			"content": "This means you can use the same component API for actions and navigation without manually switching between Button and Link components."
		},
		{
			"heading": "navigation-links",
			"content": "The component determines which element to render based on the presence of `href`:"
		},
		{
			"heading": "navigation-links",
			"content": "| Configuration | Rendered element  |\n| ------------- | ----------------- |\n| Without href  | Native `<button>` |",
			"table": "table-2"
		},
		{
			"heading": "navigation-links",
			"content": "| Configuration | Rendered element |\n| ------------- | ---------------- |\n| With href     | Puzzle `<Link>`  |",
			"table": "table-2"
		},
		{
			"heading": "navigation-links",
			"content": "The `href` property is required when using the link version of the Button."
		},
		{
			"heading": "router-specific-properties",
			"content": "The link version supports the properties of the Puzzle `Link` component."
		},
		{
			"heading": "router-specific-properties",
			"content": "Router-specific properties can be passed through componentProps."
		},
		{
			"heading": "router-specific-properties",
			"content": "This allows the Button to work with the routing integrations supported by Puzzle without coupling the Button component to a specific router."
		},
		{
			"heading": "link-versus-button",
			"content": "Use a native Button when the user is performing an action, such as submitting a form, opening a dialog, or saving data."
		},
		{
			"heading": "link-versus-button",
			"content": "Use `href` when the user is navigating to another location."
		},
		{
			"heading": "link-versus-button",
			"content": "The visual `link` variant does not change the underlying HTML element. Navigation semantics are determined by `href`, not by `variant`."
		},
		{
			"heading": "props",
			"content": "The Button component exposes a shared set of properties for both native buttons and links."
		},
		{
			"heading": "props",
			"content": "| Prop      | Type            | Default     | Description                 |\n| --------- | --------------- | ----------- | --------------------------- |\n| `variant` | `ButtonVariant` | `\"primary\"` | Visual style of the Button. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop   | Type         | Default | Description         |\n| ------ | ------------ | ------- | ------------------- |\n| `size` | `ButtonSize` | `\"md\"`  | Size of the Button. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop      | Type        | Default | Description                            |\n| --------- | ----------- | ------- | -------------------------------------- |\n| `leading` | `ReactNode` | —       | Content displayed before the children. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type        | Default | Description                           |\n| ---------- | ----------- | ------- | ------------------------------------- |\n| `trailing` | `ReactNode` | —       | Content displayed after the children. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop      | Type      | Default | Description                                           |\n| --------- | --------- | ------- | ----------------------------------------------------- |\n| `loading` | `boolean` | `false` | Displays a loading indicator and prevents activation. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type      | Default | Description          |\n| ---------- | --------- | ------- | -------------------- |\n| `disabled` | `boolean` | `false` | Disables the Button. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type      | Default | Description                                  |\n| ----------- | --------- | ------- | -------------------------------------------- |\n| `fullWidth` | `boolean` | `false` | Makes the Button fill its container's width. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop        | Type     | Default | Description                 |\n| ----------- | -------- | ------- | --------------------------- |\n| `className` | `string` | —       | Additional CSS class names. |",
			"table": "table-3"
		},
		{
			"heading": "props",
			"content": "| Prop       | Type        | Default | Description                          |\n| ---------- | ----------- | ------- | ------------------------------------ |\n| `children` | `ReactNode` | —       | Content displayed inside the Button. |",
			"table": "table-3"
		},
		{
			"heading": "native-button-props",
			"content": "When `href` is not provided, the component renders a native HTML `<button>`."
		},
		{
			"heading": "native-button-props",
			"content": "All standard React button attributes are supported, including:"
		},
		{
			"heading": "native-button-props",
			"content": "`type`"
		},
		{
			"heading": "native-button-props",
			"content": "`onClick`"
		},
		{
			"heading": "native-button-props",
			"content": "`onFocus`"
		},
		{
			"heading": "native-button-props",
			"content": "`onBlur`"
		},
		{
			"heading": "native-button-props",
			"content": "`name`"
		},
		{
			"heading": "native-button-props",
			"content": "`value`"
		},
		{
			"heading": "native-button-props",
			"content": "`form`"
		},
		{
			"heading": "native-button-props",
			"content": "`aria-\\*`"
		},
		{
			"heading": "native-button-props",
			"content": "`data-\\*`"
		},
		{
			"heading": "native-button-props",
			"content": "The `type` property defaults to `\"button\"`."
		},
		{
			"heading": "link-props",
			"content": "When `href` is provided, the component renders a Puzzle `Link`."
		},
		{
			"heading": "link-props",
			"content": "The link version supports the properties of the Puzzle `Link` component, including:"
		},
		{
			"heading": "link-props",
			"content": "`href`"
		},
		{
			"heading": "link-props",
			"content": "`target`"
		},
		{
			"heading": "link-props",
			"content": "`rel`"
		},
		{
			"heading": "link-props",
			"content": "`onClick`"
		},
		{
			"heading": "link-props",
			"content": "`aria-*`"
		},
		{
			"heading": "link-props",
			"content": "`data-*`"
		},
		{
			"heading": "link-props",
			"content": "`componentProps`"
		},
		{
			"heading": "link-props",
			"content": "The `href` property is required for this version."
		},
		{
			"heading": "typescript-types",
			"content": "The component exposes the following types:"
		},
		{
			"heading": "typescript-types",
			"content": "`ButtonProps` is a discriminated union based on the presence of `href`."
		},
		{
			"heading": "typescript-types",
			"content": "This ensures that native button attributes and link attributes are correctly typed and that incompatible properties cannot accidentally be combined."
		},
		{
			"heading": "typescript-types",
			"content": "For example, `type` is only available on the native button version, while `href` is required for the link version."
		},
		{
			"heading": "accessibility",
			"content": "The Button component includes accessibility behavior for both native buttons and links."
		},
		{
			"heading": "keyboard-interaction",
			"content": "Native buttons support the standard browser keyboard interactions."
		},
		{
			"heading": "keyboard-interaction",
			"content": "Link buttons support normal link keyboard navigation."
		},
		{
			"heading": "keyboard-interaction",
			"content": "Disabled links cannot be activated using Enter or Space."
		},
		{
			"heading": "keyboard-interaction",
			"content": "Disabled links are removed from the tab order."
		},
		{
			"heading": "focus-visibility",
			"content": "Buttons provide a visible focus indicator when navigating with a keyboard through `:focus-visible`."
		},
		{
			"heading": "loading-state",
			"content": "When loading:"
		},
		{
			"heading": "loading-state",
			"content": "The component exposes `aria-busy=\"true\"`."
		},
		{
			"heading": "loading-state",
			"content": "The loading indicator is hidden from assistive technology."
		},
		{
			"heading": "loading-state",
			"content": "The Button cannot be activated again until loading ends."
		},
		{
			"heading": "disabled-state",
			"content": "The component uses the native `disabled` attribute for buttons and `aria-disabled` for links."
		},
		{
			"heading": "disabled-state",
			"content": "This ensures that the underlying element retains the correct semantic meaning."
		},
		{
			"heading": "icon-only-buttons",
			"content": "When using `size=\"icon\"`, always provide an accessible name."
		},
		{
			"heading": "icon-only-buttons",
			"content": "Do not rely on the visual appearance of an icon to communicate its meaning to assistive technology."
		},
		{
			"heading": "reduced-motion",
			"content": "The Button respects the user's reduced-motion preference. Transitions and loading animations are adjusted when `prefers-reduced-motion: reduce` is active."
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
			"id": "variants",
			"content": "Variants"
		},
		{
			"id": "sizes",
			"content": "Sizes"
		},
		{
			"id": "leading-and-trailing-content",
			"content": "Leading and trailing content"
		},
		{
			"id": "loading",
			"content": "Loading"
		},
		{
			"id": "disabled",
			"content": "Disabled"
		},
		{
			"id": "full-width",
			"content": "Full width"
		},
		{
			"id": "navigation-links",
			"content": "Navigation links"
		},
		{
			"id": "router-specific-properties",
			"content": "Router-specific properties"
		},
		{
			"id": "link-versus-button",
			"content": "Link versus button"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "props",
			"content": "Props"
		},
		{
			"id": "native-button-props",
			"content": "Native button props"
		},
		{
			"id": "link-props",
			"content": "Link props"
		},
		{
			"id": "typescript-types",
			"content": "TypeScript types"
		},
		{
			"id": "accessibility",
			"content": "Accessibility"
		},
		{
			"id": "keyboard-interaction",
			"content": "Keyboard interaction"
		},
		{
			"id": "focus-visibility",
			"content": "Focus visibility"
		},
		{
			"id": "loading-state",
			"content": "Loading state"
		},
		{
			"id": "disabled-state",
			"content": "Disabled state"
		},
		{
			"id": "icon-only-buttons",
			"content": "Icon-only buttons"
		},
		{
			"id": "reduced-motion",
			"content": "Reduced motion"
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
		url: "#variants",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Variants" })
	},
	{
		depth: 2,
		url: "#sizes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Sizes" })
	},
	{
		depth: 2,
		url: "#leading-and-trailing-content",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Leading and trailing content" })
	},
	{
		depth: 2,
		url: "#loading",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Loading" })
	},
	{
		depth: 2,
		url: "#disabled",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled" })
	},
	{
		depth: 2,
		url: "#full-width",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Full width" })
	},
	{
		depth: 2,
		url: "#navigation-links",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Navigation links" })
	},
	{
		depth: 3,
		url: "#router-specific-properties",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Router-specific properties" })
	},
	{
		depth: 3,
		url: "#link-versus-button",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Link versus button" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Props" })
	},
	{
		depth: 3,
		url: "#native-button-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Native button props" })
	},
	{
		depth: 3,
		url: "#link-props",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Link props" })
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
	},
	{
		depth: 3,
		url: "#keyboard-interaction",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Keyboard interaction" })
	},
	{
		depth: 3,
		url: "#focus-visibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Focus visibility" })
	},
	{
		depth: 3,
		url: "#loading-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Loading state" })
	},
	{
		depth: 3,
		url: "#disabled-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled state" })
	},
	{
		depth: 3,
		url: "#icon-only-buttons",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Icon-only buttons" })
	},
	{
		depth: 3,
		url: "#reduced-motion",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Reduced motion" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
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
	}, { Button, Icon, Preview, Stack } = _components;
	if (!Button) _missingMdxReference("Button", true);
	if (!Icon) _missingMdxReference("Icon", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Stack) _missingMdxReference("Stack", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "They provide clear visual feedback and communicate the importance and intent of an action." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The Puzzle Button component supports both native buttons and links. When a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is provided, the component automatically renders a Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Link" }),
			" instead of a native ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<button>" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.a, {
			href: "/docs/components/link",
			children: "Read more about the Link component here"
		}), "."] }),
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
						children: " { Button } "
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the Button component to trigger an action." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 140,
			align: "center",
			justify: "center",
			code: `\
  <Button onClick={() => alert("Clicked")}>
      Click me
  </Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => alert("Clicked"),
				children: "Click me"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"By default, a Button renders a native HTML ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<button>" }),
			" element with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "type=\"button\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "variants",
			children: "Variants"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }),
			" prop controls the visual appearance and emphasis of the Button."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Variant" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "The primary action. Use for the most important action in a section or page." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "secondary" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "A secondary action with less visual emphasis." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "outline" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "An outlined button for actions that need a visible boundary without strong emphasis." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ghost" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "A subtle button without a prominent background." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "danger" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "An action that may have destructive or irreversible consequences." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "link" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "A button styled to look like a text link." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "toggle" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "A toggle-style button in its inactive state." })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "toggle-active" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "A toggle-style button in its active state." })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The default variant is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "primary" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			code: `\
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>
<Button variant="toggle">Toggle</Button>
<Button variant="toggle-active">Toggle active</Button>
`,
			height: 600,
			align: "center",
			justify: "center",
			children: (0, import_jsx_runtime.jsxs)(Stack, { children: [
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					children: "Primary"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					children: "Secondary"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Outline"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					children: "Ghost"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					children: "Danger"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					children: "Link"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "toggle",
					children: "Toggle"
				}),
				(0, import_jsx_runtime.jsx)(Button, {
					variant: "toggle-active",
					children: "Toggle active"
				})
			] })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "link" }),
			" variant only changes the visual appearance. It does not turn the Button\ninto a navigation link. To render an actual link, provide an href."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "sizes",
			children: "Sizes"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the size prop to control the dimensions of the Button." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Size" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "xs" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Extra small" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "sm" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Small" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "md" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Medium" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "lg" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Large" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }) }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Icon-only button" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The default size is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "md" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 600,
			align: "center",
			justify: "center",
			code: `\
<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Add">
  <Icon name="akar-icons:plus" size={20} />
</Button>
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				alignH: "center",
				children: [
					(0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						children: "Extra small"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						children: "Small"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						size: "md",
						children: "Medium"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						children: "Large"
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						"aria-label": "Add",
						children: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:plus",
							size: 20
						})
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "icon" }),
			" size is intended for buttons that contain only an icon. Always provide an accessible name, for example through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "leading-and-trailing-content",
			children: "Leading and trailing content"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "leading" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "trailing" }),
			" props allow you to add content before or after the Button's children."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "They are useful for icons, indicators, or other supplementary content." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 400,
			align: "center",
			justify: "center",
			code: `\
const plusIcon = (<Icon name="akar-icons:plus" size={20} />);
const arrowRightIcon = (<Icon name="akar-icons:arrow-right" size={20} />);
return (
  <Stack alignH="center">
    <Button leading={<Icon name="akar-icons:plus" size={20} />}>
      Add item
    </Button>
    <Button trailing={<Icon name="akar-icons:arrow-right" size={20} />}>
      Continue
    </Button>
    <Button
      leading={<Icon name="akar-icons:plus" size={20} />}
      trailing={<Icon name="akar-icons:arrow-right" size={20} />}
    >
      Add and continue
    </Button>
  </Stack>
);
`,
			children: (0, import_jsx_runtime.jsxs)(Stack, {
				alignH: "center",
				children: [
					(0, import_jsx_runtime.jsx)(Button, {
						leading: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:plus",
							size: 20
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Add item" })
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						trailing: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:arrow-right",
							size: 20
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Continue" })
					}),
					(0, import_jsx_runtime.jsx)(Button, {
						leading: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:plus",
							size: 20
						}),
						trailing: (0, import_jsx_runtime.jsx)(Icon, {
							name: "akar-icons:arrow-right",
							size: 20
						}),
						children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Add and continue" })
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Both props accept React nodes, so you can use any component or element as their content." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
			" is enabled, the leading content is replaced by the loading indicator. Trailing content remains visible."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "loading",
			children: "Loading"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
			" prop to indicate that an action is being processed."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Button loading>
  Saving
</Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				loading: true,
				children: "Saving"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When loading:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A loading indicator replaces the leading content." }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The Button receives ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-busy=\"true\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Native buttons become disabled." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Link buttons prevent navigation and interaction." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Trailing content remains visible." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The loading state also prevents accidental repeated activation while an operation is in progress." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "disabled",
			children: "Disabled"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" prop when an action is currently unavailable."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Button disabled>
  Disabled
</Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				disabled: true,
				children: "Disabled"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The disabled state can also be activated through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Button aria-disabled="true">
  Unavailable
</Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				"aria-disabled": "true",
				children: "Unavailable"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"For native buttons, the component uses the native ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" attribute."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"For links, the component uses ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled" }),
			", removes the link from the tab order, and prevents mouse and keyboard activation. This preserves the semantic distinction between a button and a link while providing consistent disabled behavior."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"A Button is also considered disabled while ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }),
			" is active."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "full-width",
			children: "Full width"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }),
			" to make a Button fill the available width of its container."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Button fullWidth>
  Continue
</Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				fullWidth: true,
				children: "Continue"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This is useful for form actions, mobile layouts, and other situations where a full-width action is preferred." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "navigation-links",
			children: "Navigation links"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The Button component automatically renders a Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Link" }),
			" when an ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is provided."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 200,
			align: "center",
			justify: "center",
			code: `\
<Button href="/dashboard">
  Go to dashboard
</Button>
`,
			children: (0, import_jsx_runtime.jsx)(Button, {
				href: "/dashboard",
				children: "Go to dashboard"
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This means you can use the same component API for actions and navigation without manually switching between Button and Link components." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component determines which element to render based on the presence of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			":"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Configuration" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Rendered element" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Without href" }), (0, import_jsx_runtime.jsxs)(_components.td, { children: ["Native ", (0, import_jsx_runtime.jsx)(_components.code, { children: "<button>" })] })] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "With href" }), (0, import_jsx_runtime.jsxs)(_components.td, { children: ["Puzzle ", (0, import_jsx_runtime.jsx)(_components.code, { children: "<Link>" })] })] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" property is required when using the link version of the Button."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "router-specific-properties",
			children: "Router-specific properties"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The link version supports the properties of the Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Link" }),
			" component."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Router-specific properties can be passed through componentProps." }),
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
						children: "Button"
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
							children: "  href"
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
							children: "\"/dashboard\""
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
							children: "  componentProps"
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
							children: "{"
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
						children: "    {"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "      // Router-specific properties"
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
						children: "    }"
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
						children: "  }"
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
						children: ">"
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
						children: "  Go to dashboard"
					})
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
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This allows the Button to work with the routing integrations supported by Puzzle without coupling the Button component to a specific router." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "link-versus-button",
			children: "Link versus button"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use a native Button when the user is performing an action, such as submitting a form, opening a dialog, or saving data." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" when the user is navigating to another location."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The visual ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "link" }),
			" variant does not change the underlying HTML element. Navigation semantics are determined by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			", not by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "props",
			children: "Props"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Button component exposes a shared set of properties for both native buttons and links." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "variant" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ButtonVariant" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"primary\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visual style of the Button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "size" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ButtonSize" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"md\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Size of the Button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "leading" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content displayed before the children." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "trailing" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content displayed after the children." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "loading" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Displays a loading indicator and prevents activation." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables the Button." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "fullWidth" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Makes the Button fill its container's width." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional CSS class names." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "children" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ReactNode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "—" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Content displayed inside the Button." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "native-button-props",
			children: "Native button props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is not provided, the component renders a native HTML ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "<button>" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "All standard React button attributes are supported, including:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "type" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onClick" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onFocus" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onBlur" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "name" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "value" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "form" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-\\*" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "data-\\*" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "type" }),
			" property defaults to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"button\"" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "link-props",
			children: "Link props"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is provided, the component renders a Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Link" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The link version supports the properties of the Puzzle ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "Link" }),
			" component, including:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "href" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "target" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "rel" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onClick" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-*" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "data-*" }) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "componentProps" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" property is required for this version."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "typescript-types",
			children: "TypeScript types"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The component exposes the following types:" }),
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "type"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ButtonVariant"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"primary\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"secondary\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"outline\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"ghost\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"danger\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"link\""
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
						children: "  |"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"toggle\""
					})]
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
							children: "  |"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"toggle-active\""
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
							children: "type"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ButtonSize"
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
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"xs\""
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
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"sm\""
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
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"md\""
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
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"lg\""
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
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"icon\""
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
							children: "type"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ButtonProps"
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
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ButtonNativeProps"
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
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " ButtonLinkProps"
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
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "ButtonProps" }),
			" is a discriminated union based on the presence of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This ensures that native button attributes and link attributes are correctly typed and that incompatible properties cannot accidentally be combined." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"For example, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "type" }),
			" is only available on the native button version, while ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "href" }),
			" is required for the link version."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Button component includes accessibility behavior for both native buttons and links." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "keyboard-interaction",
			children: "Keyboard interaction"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Native buttons support the standard browser keyboard interactions." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Link buttons support normal link keyboard navigation." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Disabled links cannot be activated using Enter or Space." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Disabled links are removed from the tab order." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "focus-visibility",
			children: "Focus visibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Buttons provide a visible focus indicator when navigating with a keyboard through ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: ":focus-visible" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "loading-state",
			children: "Loading state"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When loading:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"The component exposes ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-busy=\"true\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The loading indicator is hidden from assistive technology." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The Button cannot be activated again until loading ends." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "disabled-state",
			children: "Disabled state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The component uses the native ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }),
			" attribute for buttons and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "aria-disabled" }),
			" for links."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This ensures that the underlying element retains the correct semantic meaning." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "icon-only-buttons",
			children: "Icon-only buttons"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "size=\"icon\"" }),
			", always provide an accessible name."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not rely on the visual appearance of an icon to communicate its meaning to assistive technology." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "reduced-motion",
			children: "Reduced motion"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The Button respects the user's reduced-motion preference. Transitions and loading animations are adjusted when ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "prefers-reduced-motion: reduce" }),
			" is active."
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
