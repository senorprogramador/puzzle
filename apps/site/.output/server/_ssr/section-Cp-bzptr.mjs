import { __toESM } from "../_runtime.mjs";
import { useThemeComponents } from "./scope-context-gETs7uAh.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
import { Icon } from "../_libs/iconify__react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/section-Cp-bzptr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Concatenates and trims the given arguments into a single string of class names.
*
* @param args - The arguments to be concatenated.
* @returns A string of class names.
*/
var cn = (...args) => {
	return args.filter((v) => !!v).flat().flatMap((v) => v.split(" ")).filter((v) => v.length > 0).join(" ").trim();
};
var isThemeLinkComponentConfig = (value) => {
	return typeof value === "object" && value !== null && "component" in value;
};
/**
* Ensures links opening a new browsing context are protected
* from reverse-tabnabbing.
*/
var resolveRel = (target, rel) => {
	if (target !== "_blank") return rel;
	const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean));
	tokens.add("noopener");
	tokens.add("noreferrer");
	return [...tokens].join(" ");
};
var Link = ({ href, className, componentProps, children, target, rel, ref, ...rest }) => {
	const linkConfig = useThemeComponents()?.link;
	const isConfigured = isThemeLinkComponentConfig(linkConfig);
	const Component = isConfigured ? linkConfig.component : linkConfig ?? "a";
	const hrefProp = isConfigured ? linkConfig.hrefProp ?? "href" : "href";
	const classes = cn("puzzle-link", className);
	const elementProps = {
		...componentProps,
		...rest,
		[hrefProp]: href,
		ref,
		target,
		rel: resolveRel(target, rel),
		className: classes
	};
	return (0, import_react.createElement)(Component, elementProps, children);
};
var Icon$1 = ({ name, size, color, showLoader = false, style, children, ...props }) => {
	const iconStyle = {
		display: "inline-block",
		flexShrink: 0,
		verticalAlign: "middle",
		...style,
		color: color ?? style?.color,
		width: size !== void 0 ? size : style?.width ?? props.width,
		height: size !== void 0 ? size : style?.height ?? props.height
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		...props,
		icon: name ?? "",
		width: size ?? props.width ?? "1em",
		height: size ?? props.height ?? "1em",
		style: iconStyle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			...props,
			width: size ?? props.width ?? "1em",
			height: size ?? props.height ?? "1em",
			style: iconStyle,
			viewBox: "0 0 100 100",
			children: showLoader ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
              @keyframes puzzle-icon-loading { from { opacity: 1; } to { opacity: 0.2; } }
              .puzzle-icon-loading-bar { animation: puzzle-icon-loading 1.2s linear infinite; }
              @media (prefers-reduced-motion: reduce) { .puzzle-icon-loading-bar { animation: none; } }
            ` }), Array.from({ length: 12 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				className: "puzzle-icon-loading-bar",
				x: "47",
				y: "4",
				width: "6",
				height: "24",
				rx: "3",
				fill: iconStyle.color ?? "currentColor",
				transform: `rotate(${index * 30} 50 50)`,
				style: {
					animationDelay: `${index * .1}s`,
					opacity: (index + 1) / 12
				}
			}, index))] }) : children
		})
	});
};
var CONTAINER_PRESET_CLASSES = {
	container: "puzzle-container--container",
	content: "puzzle-container--content",
	prose: "puzzle-container--prose",
	full: "puzzle-container--full"
};
var getContainerPresetClass = (preset) => CONTAINER_PRESET_CLASSES[preset];
var Section = ({ children, className, theme = "default", fullWidth = false, noPadding = false, compactTop = false, compactBottom = false, divider = false, as: Component = "section" }) => {
	const constrainContent = theme !== "default" && !fullWidth;
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [children, divider && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "puzzle-section--divider" })] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		className: cn("puzzle-section", !fullWidth && !constrainContent && ["puzzle-container", getContainerPresetClass("container")], compactTop && "puzzle-section--compact-top", compactBottom && "puzzle-section--compact-bottom", noPadding && "puzzle-section--no-padding", className),
		"data-theme": theme,
		children: constrainContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("puzzle-section__content", "puzzle-container", getContainerPresetClass("container")),
			children: content
		}) : content
	});
};
export { Icon$1, Link, Section, cn, getContainerPresetClass };
