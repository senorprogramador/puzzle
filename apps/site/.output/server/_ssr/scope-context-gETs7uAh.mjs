import { __toESM } from "../_runtime.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/scope-context-gETs7uAh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeComponentsContext = (0, import_react.createContext)(void 0);
var ThemeComponentsProvider = ({ components, children }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeComponentsContext.Provider, {
		value: components,
		children
	});
};
var useThemeComponents = () => {
	return (0, import_react.useContext)(ThemeComponentsContext);
};
var ThemeScopeContext = (0, import_react.createContext)(null);
var ThemeScopeProvider = ({ scopeId, theme, children }) => {
	const scopeElementRef = (0, import_react.useRef)(null);
	const [portalState, setPortalState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (scopeId === null) return;
		const ownerDocument = scopeElementRef.current?.ownerDocument;
		if (!ownerDocument?.body) return;
		const portalTarget = ownerDocument.createElement("div");
		portalTarget.className = "puzzle-theme-scope puzzle-theme-scope--portal";
		portalTarget.dataset.puzzleThemeScope = scopeId;
		portalTarget.dataset.theme = theme;
		portalTarget.dataset.puzzleThemePortal = "true";
		ownerDocument.body.append(portalTarget);
		setPortalState({
			scopeId,
			theme,
			element: portalTarget
		});
		return () => {
			portalTarget.remove();
		};
	}, [scopeId, theme]);
	const portalTarget = scopeId !== null && portalState?.scopeId === scopeId && portalState.theme === theme ? portalState.element : null;
	const value = (0, import_react.useMemo)(() => {
		return scopeId === null ? null : {
			scopeId,
			theme,
			portalTarget
		};
	}, [
		scopeId,
		theme,
		portalTarget
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeScopeContext.Provider, {
		value,
		children: scopeId === null ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: scopeElementRef,
			className: "puzzle-theme-scope",
			"data-puzzle-theme-scope": scopeId,
			"data-theme": theme,
			children
		})
	});
};
var useThemeScope = () => {
	return (0, import_react.useContext)(ThemeScopeContext);
};
export { ThemeComponentsProvider, ThemeScopeProvider, useThemeComponents, useThemeScope };
