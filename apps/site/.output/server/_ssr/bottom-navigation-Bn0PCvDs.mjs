import { __toESM } from "../_runtime.mjs";
import { Link, cn } from "./section-Cp-bzptr.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/bottom-navigation-Bn0PCvDs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BottomNavigationItem = ({ icon, label, href, onClick, active = false, className, style }) => {
	const classes = cn("puzzle-bottom-navigation-item", active && "active", className);
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "puzzle-bottom-navigation-item__icon",
		"aria-hidden": "true",
		children: icon
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "puzzle-bottom-navigation-item__label",
		children: label
	})] });
	if (href !== void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		href,
		className: classes,
		style,
		"aria-label": label,
		"aria-current": active ? "page" : void 0,
		"data-active": active || void 0,
		children: content
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: classes,
		style,
		onClick,
		"aria-label": label,
		"data-active": active || void 0,
		children: content
	});
};
var BottomNavigation = ({ children, className, style, ariaLabel = "Bottom navigation" }) => {
	if (import_react.Children.toArray(children).filter((child) => !(0, import_react.isValidElement)(child) || child.type !== BottomNavigationItem).length > 0) console.warn("BottomNavigation only accepts BottomNavigationItem as children.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cn("puzzle-bottom-navigation", className),
		style,
		"aria-label": ariaLabel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-bottom-navigation__track",
			children
		})
	});
};
export { BottomNavigation, BottomNavigationItem };
