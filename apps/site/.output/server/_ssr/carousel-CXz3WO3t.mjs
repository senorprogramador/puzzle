import { __toESM } from "../_runtime.mjs";
import { Link, cn } from "./section-BhsGlFRU.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/carousel-CXz3WO3t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BREAKPOINTS = [
	"mobile",
	"tablet",
	"desktop"
];
var resolveResponsiveValueForBreakpoint = (breakpoint, value, fallback) => {
	if (value === void 0 || value === null) return fallback;
	return typeof value !== "object" || !(breakpoint in value) ? value ?? fallback : value[breakpoint] ?? fallback;
};
var resolveResponsiveValue = (value, fallback) => {
	const mobile = resolveResponsiveValueForBreakpoint("mobile", value, fallback);
	const tablet = resolveResponsiveValueForBreakpoint("tablet", value, mobile);
	return {
		mobile,
		tablet,
		desktop: resolveResponsiveValueForBreakpoint("desktop", value, tablet)
	};
};
var ButtonContent = ({ children, leading, trailing, loading }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-button__spinner",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "9",
					stroke: "currentColor",
					strokeWidth: "3",
					opacity: ".25"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M21 12a9 9 0 0 0-9-9",
					stroke: "currentColor",
					strokeWidth: "3",
					strokeLinecap: "round"
				})]
			})
		}) : leading != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-button__leading",
			children: leading
		}) : null,
		children != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-button__content",
			children
		}),
		trailing != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-button__trailing",
			children: trailing
		})
	] });
};
var getButtonClassName = (variant, size, fullWidth, loading, className) => {
	return cn("puzzle-button", `puzzle-button--${variant}`, `puzzle-button--${size}`, fullWidth && "puzzle-button--full-width", loading && "puzzle-button--loading", className);
};
/**
* Prevents navigation when an anchor is disabled.
*/
var preventDisabledLinkClick = (event) => {
	event.preventDefault();
	event.stopPropagation();
};
/**
* Prevents keyboard activation when an anchor is disabled.
*/
var preventDisabledLinkKeyDown = (event) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		event.stopPropagation();
	}
};
/**
* Renders a Button using the configured Puzzle Link component.
*/
var renderLinkButton = ({ href, variant = "primary", size = "md", leading, trailing, loading = false, disabled = false, fullWidth = false, className, children, tabIndex, onClick, onKeyDown, "aria-disabled": ariaDisabled, "aria-busy": ariaBusy, ...linkProps }) => {
	const isDisabled = disabled || loading || ariaDisabled === true || ariaDisabled === "true";
	const classes = getButtonClassName(variant, size, fullWidth, loading, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		...linkProps,
		href,
		className: classes,
		"aria-disabled": isDisabled ? true : ariaDisabled,
		"aria-busy": loading ? true : ariaBusy,
		tabIndex: isDisabled ? -1 : tabIndex,
		onClick: isDisabled ? preventDisabledLinkClick : onClick,
		onKeyDown: isDisabled ? preventDisabledLinkKeyDown : onKeyDown,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContent, {
			loading,
			leading,
			trailing,
			children
		})
	});
};
/**
* Renders a native HTML button.
*/
var renderNativeButton = ({ variant = "primary", size = "md", leading, trailing, loading = false, disabled = false, fullWidth = false, className, children, type = "button", "aria-disabled": ariaDisabled, "aria-busy": ariaBusy, ...buttonProps }) => {
	const isDisabled = disabled || loading || ariaDisabled === true || ariaDisabled === "true";
	const classes = getButtonClassName(variant, size, fullWidth, loading, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...buttonProps,
		type,
		className: classes,
		disabled: isDisabled,
		"aria-disabled": isDisabled ? true : ariaDisabled,
		"aria-busy": loading ? true : ariaBusy,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContent, {
			loading,
			leading,
			trailing,
			children
		})
	});
};
var isLinkButton = (props) => {
	return typeof props.href === "string";
};
var Button = (props) => {
	if (isLinkButton(props)) return renderLinkButton(props);
	return renderNativeButton(props);
};
var Card = ({ as, variant = "outlined", size = "md", orientation = "vertical", interactive = false, className, children, ...props }) => {
	const Component = as ?? (interactive ? "href" in props ? "a" : "button" : "div");
	return (0, import_react.createElement)(Component, {
		...props,
		...Component === "button" && !("type" in props) ? { type: "button" } : {},
		className: cn("puzzle-card", `puzzle-card--${variant}`, `puzzle-card--${size}`, `puzzle-card--${orientation}`, interactive && "puzzle-card--interactive", className),
		"data-variant": variant,
		"data-size": size,
		"data-orientation": orientation,
		"data-interactive": interactive ? "" : void 0
	}, children);
};
var createCardPart = (defaultElement, className) => {
	const Part = ({ as, className: customClassName, children, ...props }) => {
		return (0, import_react.createElement)(as ?? defaultElement, {
			...props,
			className: cn(className, customClassName)
		}, children);
	};
	return Part;
};
var CardHeader = createCardPart("div", "puzzle-card__header");
var CardTitle = createCardPart("h3", "puzzle-card__title");
var CardDescription = createCardPart("p", "puzzle-card__description");
var CardAction = createCardPart("div", "puzzle-card__action");
var CardContent = createCardPart("div", "puzzle-card__content");
var CardFooter = createCardPart("div", "puzzle-card__footer");
var CardMedia = createCardPart("div", "puzzle-card__media");
var Stack = ({ as: Component = "div", direction = "col", alignH, alignV, wrap = "nowrap", gap = "md", divider, reverse = false, children, className, ...props }) => {
	const directions = typeof direction === "string" ? { mobile: direction } : {
		...direction,
		mobile: direction.mobile ?? "col"
	};
	const directionClasses = BREAKPOINTS.flatMap((breakpoint) => {
		const value = directions[breakpoint];
		return value ? [`direction-${breakpoint}-${value}`] : [];
	});
	const hasAlignment = alignH !== void 0 || alignV !== void 0;
	const responsiveAlignH = typeof alignH === "string" ? { mobile: alignH } : {
		...alignH,
		mobile: alignH?.mobile ?? "start"
	};
	const responsiveAlignV = typeof alignV === "string" ? { mobile: alignV } : {
		...alignV,
		mobile: alignV?.mobile ?? "start"
	};
	const responsiveAlignHClasses = BREAKPOINTS.flatMap((breakpoint) => {
		const value = responsiveAlignH[breakpoint];
		return value ? [`align-h-${breakpoint}-${value}`] : [];
	});
	const responsiveAlignVClasses = BREAKPOINTS.flatMap((breakpoint) => {
		const value = responsiveAlignV[breakpoint];
		return value ? [`align-v-${breakpoint}-${value}`] : [];
	});
	const classes = cn("puzzle-stack", ...directionClasses, reverse && "reverse", wrap, `gap-${gap}`, ...responsiveAlignHClasses, ...responsiveAlignVClasses, hasAlignment && "has-alignment", className);
	const childrenWithDividers = divider ? import_react.Children.toArray(children).flatMap((child, index, arr) => {
		if (index === arr.length - 1) return [child];
		const dividerKey = `stack-divider-${(0, import_react.isValidElement)(child) ? child.key : index}`;
		return [child, (0, import_react.isValidElement)(divider) ? (0, import_react.cloneElement)(divider, { key: dividerKey }) : (0, import_react.createElement)(import_react.Fragment, { key: dividerKey }, divider)];
	}) : children;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		className: classes,
		...props,
		children: childrenWithDividers
	});
};
var resolveTemplate = (template, enterFromProp, enterToProp, exitToProp) => {
	switch (template) {
		case "slide-in-up": return {
			enterFrom: enterFromProp ?? "puzzle-transition-slide-in-up-from",
			enterTo: enterToProp ?? "puzzle-transition-slide-in-up-active",
			exitTo: exitToProp ?? "puzzle-transition-slide-in-up-exit"
		};
		case "slide-in-down": return {
			enterFrom: enterFromProp ?? "puzzle-transition-slide-in-down-from",
			enterTo: enterToProp ?? "puzzle-transition-slide-in-down-active",
			exitTo: exitToProp ?? "puzzle-transition-slide-in-down-exit"
		};
		case "slide-in-left": return {
			enterFrom: enterFromProp ?? "puzzle-transition-slide-in-left-from",
			enterTo: enterToProp ?? "puzzle-transition-slide-in-left-active",
			exitTo: exitToProp ?? "puzzle-transition-slide-in-left-exit"
		};
		case "slide-in-right": return {
			enterFrom: enterFromProp ?? "puzzle-transition-slide-in-right-from",
			enterTo: enterToProp ?? "puzzle-transition-slide-in-right-active",
			exitTo: exitToProp ?? "puzzle-transition-slide-in-right-exit"
		};
		case "accordion": return {
			enterFrom: enterFromProp ?? "puzzle-transition-accordion-from",
			enterTo: enterToProp ?? "puzzle-transition-accordion-active",
			exitTo: exitToProp ?? "puzzle-transition-accordion-exit"
		};
		default: return {
			enterFrom: enterFromProp ?? "puzzle-transition-fade-from",
			enterTo: enterToProp ?? "puzzle-transition-fade-active",
			exitTo: exitToProp ?? "puzzle-transition-fade-exit"
		};
	}
};
var Transition = ({ visible, children, as, template, enterFrom: enterFromProp, enterTo: enterToProp, exitTo: exitToProp, className = "", duration = 300, unmountOnExit = true, forceMount = false, onEnter, onEntered, onExit, onExited, ...restProps }) => {
	const { onAnimationEnd: propsOnAnimationEnd, onTransitionEnd: propsOnTransitionEnd, ...props } = restProps;
	const [mounted, setMounted] = (0, import_react.useState)(() => visible || forceMount || !unmountOnExit);
	const { enterFrom, enterTo, exitTo } = resolveTemplate(template, enterFromProp, enterToProp, exitToProp);
	const [phase, setPhase] = (0, import_react.useState)(() => visible || forceMount || !unmountOnExit ? "enterFrom" : "exitTo");
	const frameRef = (0, import_react.useRef)(null);
	const timeoutRef = (0, import_react.useRef)(null);
	const isInitialRenderRef = (0, import_react.useRef)(true);
	const callbacksRef = (0, import_react.useRef)({
		onEnter,
		onEntered,
		onExit,
		onExited
	});
	(0, import_react.useLayoutEffect)(() => {
		callbacksRef.current = {
			onEnter,
			onEntered,
			onExit,
			onExited
		};
	});
	const clearTimers = () => {
		if (frameRef.current !== null) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};
	(0, import_react.useEffect)(() => {
		clearTimers();
		if (isInitialRenderRef.current) {
			isInitialRenderRef.current = false;
			if (!visible) {
				if (forceMount || !unmountOnExit) {
					setMounted(true);
					setPhase("enterFrom");
				}
				return clearTimers;
			}
		}
		if (!unmountOnExit || forceMount) setMounted(true);
		if (visible) {
			setMounted(true);
			setPhase("enterFrom");
			callbacksRef.current.onEnter?.();
			frameRef.current = requestAnimationFrame(() => {
				frameRef.current = requestAnimationFrame(() => {
					setPhase("enterTo");
				});
			});
		} else {
			if (!mounted && unmountOnExit && !forceMount) return clearTimers;
			setPhase("exitTo");
			callbacksRef.current.onExit?.();
			timeoutRef.current = setTimeout(() => {
				if (unmountOnExit && !forceMount) setMounted(false);
				setPhase("enterFrom");
				callbacksRef.current.onExited?.();
			}, duration);
		}
		return clearTimers;
	}, [
		visible,
		unmountOnExit,
		duration,
		forceMount
	]);
	const settledPhaseRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		settledPhaseRef.current = null;
	}, [phase, visible]);
	const handleEnd = (event) => {
		if (event.target !== event.currentTarget) return;
		if (settledPhaseRef.current === phase) return;
		if (phase === "enterTo") {
			settledPhaseRef.current = phase;
			callbacksRef.current.onEntered?.();
		}
		if (phase === "exitTo" && !visible) {
			settledPhaseRef.current = phase;
			clearTimers();
			if (unmountOnExit && !forceMount) setMounted(false);
			setPhase("enterFrom");
			callbacksRef.current.onExited?.();
		}
	};
	const handleAnimationEnd = handleEnd;
	const handleTransitionEnd = handleEnd;
	if (!mounted && !forceMount) return null;
	const phaseClass = {
		enterFrom,
		enterTo,
		exitTo
	}[phase];
	if (as) return (0, import_react.createElement)(as, {
		...props,
		className: cn(className, phaseClass),
		onAnimationEnd: (event) => {
			propsOnAnimationEnd?.(event);
			handleAnimationEnd(event);
		},
		onTransitionEnd: (event) => {
			propsOnTransitionEnd?.(event);
			handleTransitionEnd(event);
		}
	}, children);
	return import_react.Children.map(children, (child) => {
		if (!(0, import_react.isValidElement)(child)) return child;
		return (0, import_react.cloneElement)(child, {
			...child.props,
			...props,
			className: cn(child.props?.className, className, phaseClass),
			onAnimationEnd: (event) => {
				child.props.onAnimationEnd?.(event);
				propsOnAnimationEnd?.(event);
				handleAnimationEnd(event);
			},
			onTransitionEnd: (event) => {
				child.props.onTransitionEnd?.(event);
				propsOnTransitionEnd?.(event);
				handleTransitionEnd(event);
			}
		});
	});
};
var OverlayPriorityContext = (0, import_react.createContext)(0);
var overlayStacks = /* @__PURE__ */ new WeakMap();
var FOCUSABLE_SELECTOR = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type='hidden'])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"object",
	"embed",
	"[contenteditable='true']",
	"[tabindex]:not([tabindex='-1'])"
].join(",");
var focusElement = (element) => {
	if (!element?.isConnected) return;
	try {
		element.focus({ preventScroll: true });
	} catch {
		element.focus();
	}
};
var getFocusableElements = (container) => {
	return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
		if (element.hidden || element.closest("[hidden], [inert], [aria-hidden='true']") || element.getAttribute("aria-disabled") === "true") return false;
		const style = element.ownerDocument.defaultView?.getComputedStyle(element);
		return style?.display !== "none" && style?.visibility !== "hidden";
	});
};
var getTopOverlay = (entries) => {
	return entries.reduce((top, entry) => {
		if (!top || entry.priority > top.priority || entry.priority === top.priority && entry.order > top.order) return entry;
		return top;
	}, void 0);
};
var focusInitial = (entry) => {
	const content = entry.getContent?.();
	if (!content) return;
	const autofocus = content.querySelector("[autofocus]");
	const focusable = getFocusableElements(content);
	const target = autofocus ?? focusable[0] ?? content;
	if (target === content && !content.hasAttribute("tabindex")) content.setAttribute("tabindex", "-1");
	focusElement(target);
};
var restoreInertSnapshots = (stack) => {
	for (const [element, snapshot] of stack.inertSnapshots) {
		element.inert = snapshot.inert;
		if (snapshot.ariaHidden === null) element.removeAttribute("aria-hidden");
		else element.setAttribute("aria-hidden", snapshot.ariaHidden);
	}
	stack.inertSnapshots.clear();
};
var getBodyBranch = (element, body) => {
	let current = element;
	while (current?.parentElement && current.parentElement !== body) current = current.parentElement;
	return current?.parentElement === body ? current : null;
};
var syncModalIsolation = (stack) => {
	restoreInertSnapshots(stack);
	const top = getTopOverlay(stack.entries);
	if (!top?.modal) return;
	const content = top.getContent?.();
	const layer = top.getLayer?.() ?? content;
	if (!content || !layer) return;
	const body = content.ownerDocument.body;
	const activeBranch = getBodyBranch(layer, body);
	if (!activeBranch) return;
	for (const child of Array.from(body.children)) {
		if (!(child instanceof content.ownerDocument.defaultView.HTMLElement)) continue;
		if (child === activeBranch || child.contains(activeBranch)) continue;
		stack.inertSnapshots.set(child, {
			inert: child.inert,
			ariaHidden: child.getAttribute("aria-hidden")
		});
		child.inert = true;
		child.setAttribute("aria-hidden", "true");
	}
};
var createOverlayStack = (ownerDocument) => {
	const stack = {
		entries: [],
		nextOrder: 0,
		inertSnapshots: /* @__PURE__ */ new Map(),
		syncIsolation: () => {
			syncModalIsolation(stack);
		},
		handleKeyDown: (event) => {
			const top = getTopOverlay(stack.entries);
			if (!top) return;
			if (event.key === "Escape" && !event.defaultPrevented) {
				event.preventDefault();
				event.stopPropagation();
				top.onEscape();
				return;
			}
			if (event.key !== "Tab" || !top.modal) return;
			const content = top.getContent?.();
			if (!content) return;
			const focusable = getFocusableElements(content);
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = ownerDocument.activeElement;
			if (!first || !last) {
				event.preventDefault();
				focusElement(content);
				return;
			}
			if (event.shiftKey) {
				if (active === first || !content.contains(active)) {
					event.preventDefault();
					focusElement(last);
				}
				return;
			}
			if (active === last || !content.contains(active)) {
				event.preventDefault();
				focusElement(first);
			}
		},
		handleFocusIn: (event) => {
			const top = getTopOverlay(stack.entries);
			if (!top?.modal) return;
			const content = top.getContent?.();
			if (!content) return;
			const target = event.target;
			if (target instanceof ownerDocument.defaultView.HTMLElement) {
				if (content.contains(target)) {
					top.lastFocused = target;
					return;
				}
			}
			const lastFocused = top.lastFocused;
			focusElement(lastFocused?.isConnected && content.contains(lastFocused) ? lastFocused : getFocusableElements(content)[0] ?? content);
		}
	};
	ownerDocument.addEventListener("keydown", stack.handleKeyDown, true);
	ownerDocument.addEventListener("focusin", stack.handleFocusIn, true);
	return stack;
};
var registerOverlay = (ownerDocument, onEscape, priority = 0, options = {}) => {
	const stack = overlayStacks.get(ownerDocument) ?? createOverlayStack(ownerDocument);
	overlayStacks.set(ownerDocument, stack);
	const activeElement = ownerDocument.activeElement;
	const entry = {
		onEscape,
		priority,
		order: stack.nextOrder++,
		modal: options.modal ?? false,
		getContent: options.getContent,
		getLayer: options.getLayer,
		previousFocus: activeElement instanceof ownerDocument.defaultView.HTMLElement ? activeElement : null,
		lastFocused: null
	};
	stack.entries.push(entry);
	stack.syncIsolation();
	if (entry.modal) focusInitial(entry);
	const unregister = (() => {
		const index = stack.entries.indexOf(entry);
		if (index === -1) return;
		const wasTop = getTopOverlay(stack.entries) === entry;
		stack.entries.splice(index, 1);
		stack.syncIsolation();
		if (stack.entries.length === 0) {
			ownerDocument.removeEventListener("keydown", stack.handleKeyDown, true);
			ownerDocument.removeEventListener("focusin", stack.handleFocusIn, true);
			overlayStacks.delete(ownerDocument);
		}
		if (!wasTop || !entry.modal) return;
		Promise.resolve().then(() => {
			const nextTop = getTopOverlay(stack.entries);
			if (nextTop?.modal) {
				const content = nextTop.getContent?.();
				if (content && !content.contains(ownerDocument.activeElement)) focusInitial(nextTop);
				return;
			}
			if (entry.previousFocus?.isConnected) focusElement(entry.previousFocus);
		});
	});
	unregister.isTop = () => {
		return getTopOverlay(stack.entries) === entry;
	};
	return unregister;
};
var OverlayStackProvider = ({ priority, children }) => {
	return (0, import_react.createElement)(OverlayPriorityContext.Provider, { value: priority }, children);
};
var useOverlayPriority = () => (0, import_react.useContext)(OverlayPriorityContext);
var BODY_STYLE_PROPERTIES = [
	"overflow",
	"padding-right",
	"position",
	"top",
	"left",
	"width"
];
var HTML_STYLE_PROPERTIES = [
	"overflow-x",
	"overflow-y",
	"scrollbar-gutter",
	"scroll-behavior"
];
var scrollLocks = /* @__PURE__ */ new WeakMap();
var getStyleSnapshots = (style, properties) => {
	const snapshots = {};
	for (const property of properties) snapshots[property] = {
		value: style.getPropertyValue(property),
		priority: style.getPropertyPriority(property)
	};
	return snapshots;
};
var restoreInlineStyle = (style, property, snapshot) => {
	if (snapshot.value) {
		style.setProperty(property, snapshot.value, snapshot.priority);
		return;
	}
	style.removeProperty(property);
};
var restoreStyleSnapshots = (style, snapshots) => {
	for (const property of Object.keys(snapshots)) restoreInlineStyle(style, property, snapshots[property]);
};
var isIOSDevice = (window) => {
	const { navigator } = window;
	return /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
};
var getScrollbarWidth = (document) => {
	const window = document.defaultView;
	if (!window) return 0;
	return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
};
var lockScroll = (document) => {
	const body = document.body;
	const html = document.documentElement;
	const window = document.defaultView;
	if (!body || !window) return () => {};
	const existingState = scrollLocks.get(document);
	if (existingState) {
		existingState.count += 1;
		return () => unlockScroll(document);
	}
	const computedBodyStyle = window.getComputedStyle(body);
	const computedGutter = window.getComputedStyle(html).getPropertyValue("scrollbar-gutter");
	const supportsStableGutter = typeof window.CSS !== "undefined" && window.CSS.supports("scrollbar-gutter: stable");
	const hasStableGutter = computedGutter.split(/\s+/).includes("stable");
	const isIOS = isIOSDevice(window);
	const state = {
		count: 1,
		scrollX: window.scrollX,
		scrollY: window.scrollY,
		isIOS,
		bodyStyles: getStyleSnapshots(body.style, BODY_STYLE_PROPERTIES),
		htmlStyles: getStyleSnapshots(html.style, HTML_STYLE_PROPERTIES)
	};
	scrollLocks.set(document, state);
	if (supportsStableGutter && !hasStableGutter) html.style.setProperty("scrollbar-gutter", "stable", "important");
	if (!supportsStableGutter && !isIOS) {
		const scrollbarWidth = getScrollbarWidth(document);
		if (scrollbarWidth > 0) {
			const paddingRight = Number.parseFloat(computedBodyStyle.paddingRight) || 0;
			body.style.setProperty("padding-right", `${paddingRight + scrollbarWidth}px`, "important");
		}
	}
	body.style.setProperty("overflow", "hidden", "important");
	html.style.setProperty("overflow-x", "hidden", "important");
	html.style.setProperty("overflow-y", "hidden", "important");
	if (isIOS) {
		body.style.setProperty("position", "fixed", "important");
		body.style.setProperty("top", `${-state.scrollY}px`, "important");
		body.style.setProperty("left", `${-state.scrollX}px`, "important");
		body.style.setProperty("width", `${html.clientWidth}px`, "important");
	}
	return () => unlockScroll(document);
};
var unlockScroll = (document) => {
	const state = scrollLocks.get(document);
	const body = document.body;
	const html = document.documentElement;
	const window = document.defaultView;
	if (!state || !body || !window) return;
	state.count -= 1;
	if (state.count > 0) return;
	scrollLocks.delete(document);
	restoreStyleSnapshots(body.style, state.bodyStyles);
	restoreInlineStyle(html.style, "overflow-x", state.htmlStyles["overflow-x"]);
	restoreInlineStyle(html.style, "overflow-y", state.htmlStyles["overflow-y"]);
	restoreInlineStyle(html.style, "scrollbar-gutter", state.htmlStyles["scrollbar-gutter"]);
	html.style.setProperty("scroll-behavior", "auto", "important");
	try {
		if (state.isIOS) window.scrollTo(state.scrollX, state.scrollY);
	} finally {
		restoreInlineStyle(html.style, "scroll-behavior", state.htmlStyles["scroll-behavior"]);
	}
};
var ScrollLock = ({ enabled = true }) => {
	const markerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const ownerDocument = markerRef.current?.ownerDocument;
		if (!enabled || !ownerDocument) return;
		return lockScroll(ownerDocument);
	}, [enabled]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref: markerRef,
		hidden: true
	});
};
var Backdrop = ({ as, open = true, modal = false, closeOnBackdrop = true, closeOnEscape = true, onClose, className, children, onClick, ...props }) => {
	const Component = as ?? "div";
	const rootRef = (0, import_react.useRef)(null);
	const registrationRef = (0, import_react.useRef)(null);
	const [rootElement, setRootElement] = (0, import_react.useState)(null);
	const parentPriority = useOverlayPriority();
	const classes = cn("puzzle-backdrop", className);
	const forwardedRef = props.ref;
	const componentProps = { ...props };
	delete componentProps.ref;
	const setRootRef = (0, import_react.useCallback)((node) => {
		rootRef.current = node;
		setRootElement(node);
		if (typeof forwardedRef === "function") forwardedRef(node);
		else if (forwardedRef) forwardedRef.current = node;
	}, [forwardedRef]);
	(0, import_react.useEffect)(() => {
		if (!open || !rootElement) return;
		const unregister = registerOverlay(rootElement.ownerDocument, () => {
			if (closeOnEscape) onClose?.();
		}, parentPriority, {
			modal,
			getContent: () => rootRef.current?.querySelector("[data-overlay-content]") ?? rootRef.current,
			getLayer: () => rootRef.current
		});
		registrationRef.current = unregister;
		return () => {
			unregister();
			if (registrationRef.current === unregister) registrationRef.current = null;
		};
	}, [
		open,
		rootElement,
		modal,
		closeOnEscape,
		onClose,
		parentPriority
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(OverlayStackProvider, {
		priority: parentPriority + 1,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollLock, { enabled: open && modal }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
			visible: open,
			template: "fade",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
				...componentProps,
				ref: setRootRef,
				className: classes,
				onClick: (event) => {
					onClick?.(event);
					if (event.defaultPrevented || !closeOnBackdrop || event.target !== event.currentTarget || !registrationRef.current?.isTop()) return;
					event.stopPropagation();
					onClose?.();
				},
				children
			})
		})]
	});
};
var KEYBOARD_STEP = 16;
var KEYBOARD_LARGE_STEP = 64;
var isHorizontal = (position) => position === "left" || position === "right";
var getDirection = (position) => position === "left" || position === "top" ? 1 : -1;
var getViewportMax = (position, margin, ownerWindow) => Math.max(margin, (isHorizontal(position) ? ownerWindow.innerWidth : ownerWindow.innerHeight) - margin);
var useResizeBar = (position, active, { min = 100, margin = 40 } = {}) => {
	const resizeRef = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)(null);
	const [measured, setMeasured] = (0, import_react.useState)(null);
	const [viewportMax, setViewportMax] = (0, import_react.useState)(null);
	const measure = (0, import_react.useCallback)(() => {
		const panel = resizeRef.current?.parentElement;
		if (!panel) return null;
		const rect = panel.getBoundingClientRect();
		const value = Math.round(isHorizontal(position) ? rect.width : rect.height);
		setMeasured(value);
		return value;
	}, [position]);
	(0, import_react.useEffect)(() => {
		if (active) setSize(null);
	}, [active, position]);
	(0, import_react.useLayoutEffect)(() => {
		if (active) measure();
	}, [
		active,
		size,
		position,
		measure
	]);
	(0, import_react.useLayoutEffect)(() => {
		const ownerWindow = resizeRef.current?.ownerDocument.defaultView;
		if (!active || !ownerWindow) return;
		const update = () => setViewportMax(getViewportMax(position, margin, ownerWindow));
		update();
		ownerWindow.addEventListener("resize", update);
		return () => ownerWindow.removeEventListener("resize", update);
	}, [
		active,
		position,
		margin
	]);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const element = resizeRef.current;
		const ownerDocument = element?.ownerDocument;
		const ownerWindow = ownerDocument?.defaultView;
		if (!element || !ownerDocument || !ownerWindow) return;
		const body = ownerDocument.body;
		let activePointerId = null;
		let startPointer = 0;
		let startSize = 0;
		let previousUserSelect = "";
		let previousTouchAction = "";
		const endDrag = (event) => {
			if (activePointerId === null) return;
			if (event && element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId);
			activePointerId = null;
			body.style.userSelect = previousUserSelect;
			body.style.touchAction = previousTouchAction;
		};
		const getPointer = (event) => isHorizontal(position) ? event.clientX : event.clientY;
		const handlePointerDown = (event) => {
			if (event.button !== 0 && event.pointerType === "mouse") return;
			event.stopPropagation();
			const panel = element.parentElement;
			if (!panel) return;
			const rect = panel.getBoundingClientRect();
			activePointerId = event.pointerId;
			startPointer = getPointer(event);
			startSize = isHorizontal(position) ? rect.width : rect.height;
			previousUserSelect = body.style.userSelect;
			previousTouchAction = body.style.touchAction;
			body.style.userSelect = "none";
			body.style.touchAction = "none";
			element.setPointerCapture?.(event.pointerId);
		};
		const handlePointerMove = (event) => {
			if (event.pointerId !== activePointerId) return;
			event.stopPropagation();
			const delta = (getPointer(event) - startPointer) * getDirection(position);
			setSize(Math.min(Math.max(0, Math.round(startSize + delta)), getViewportMax(position, margin, ownerWindow)));
		};
		const handlePointerEnd = (event) => {
			if (event.pointerId !== activePointerId) return;
			endDrag(event);
		};
		element.addEventListener("pointerdown", handlePointerDown);
		element.addEventListener("pointermove", handlePointerMove);
		element.addEventListener("pointerup", handlePointerEnd);
		element.addEventListener("pointercancel", handlePointerEnd);
		return () => {
			element.removeEventListener("pointerdown", handlePointerDown);
			element.removeEventListener("pointermove", handlePointerMove);
			element.removeEventListener("pointerup", handlePointerEnd);
			element.removeEventListener("pointercancel", handlePointerEnd);
			endDrag();
		};
	}, [
		position,
		active,
		margin
	]);
	const max = Math.max(min, viewportMax ?? min);
	const handleKeyDown = (event) => {
		const current = size ?? measured ?? measure();
		if (current === null) return;
		const step = event.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP;
		const direction = getDirection(position);
		const horizontal = isHorizontal(position);
		let next = null;
		switch (event.key) {
			case "ArrowRight":
				next = horizontal ? current + step * direction : null;
				break;
			case "ArrowLeft":
				next = horizontal ? current - step * direction : null;
				break;
			case "ArrowDown":
				next = horizontal ? null : current + step * direction;
				break;
			case "ArrowUp":
				next = horizontal ? null : current - step * direction;
				break;
			case "PageUp":
				next = current + KEYBOARD_LARGE_STEP;
				break;
			case "PageDown":
				next = current - KEYBOARD_LARGE_STEP;
				break;
			case "Home":
				next = min;
				break;
			case "End": next = max;
		}
		if (next === null) return;
		event.preventDefault();
		setSize(Math.min(Math.max(next, min), max));
	};
	return {
		size,
		value: size ?? measured,
		min,
		max,
		resizeRef,
		handleKeyDown
	};
};
var TRANSITION_MAP = {
	left: "slide-in-right",
	right: "slide-in-left",
	top: "slide-in-down",
	bottom: "slide-in-up"
};
var Drawer = ({ position = "left", open, onOpenChange, closeOnEscape = true, className, children, ...props }) => {
	const handleClose = (0, import_react.useCallback)(() => {
		onOpenChange(false);
	}, [onOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Backdrop, {
		open,
		modal: true,
		closeOnEscape,
		onClose: handleClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
			visible: open,
			template: TRANSITION_MAP[position],
			forceMount: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
				position,
				open,
				onOpenChange,
				className,
				...props,
				children
			})
		})
	});
};
var DrawerContent = ({ children, className, position = "left", open, onOpenChange, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }) => {
	const classes = cn("puzzle-drawer", `puzzle-drawer--${position}`, className);
	const horizontal = position === "left" || position === "right";
	const { size, value, min, max, resizeRef, handleKeyDown } = useResizeBar(position, open);
	(0, import_react.useEffect)(() => {
		if (size !== null && size < min) onOpenChange(false);
	}, [
		size,
		min,
		onOpenChange
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		...props,
		direction: ["left", "right"].includes(position) ? "row" : "col",
		reverse: ["top", "left"].includes(position),
		gap: "0",
		className: classes,
		"data-overlay-content": "",
		tabIndex: -1,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": ariaLabelledBy ? void 0 : ariaLabel,
		"aria-labelledby": ariaLabelledBy,
		style: size !== null ? { [horizontal ? "width" : "height"]: `${size}px` } : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: resizeRef,
			role: "separator",
			tabIndex: 0,
			className: "puzzle-drawer__resize-bar",
			"aria-label": "Resize drawer",
			"aria-orientation": horizontal ? "vertical" : "horizontal",
			"aria-valuenow": value ?? void 0,
			"aria-valuemin": min,
			"aria-valuemax": max,
			onKeyDown: handleKeyDown,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "puzzle-drawer__resize-bar-inner" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack, {
			direction: "col",
			className: "puzzle-drawer__content-wrapper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack, {
				direction: "col",
				className: "puzzle-drawer__content",
				children
			})
		})]
	});
};
var CarouselContext = (0, import_react.createContext)(null);
var normalizePanel = (panel) => {
	if (!Number.isFinite(panel)) return 0;
	return Math.max(0, Math.floor(panel));
};
var CarouselController = ({ items, children, currentPanel: controlledPanel, defaultPanel = 0, onPanelChange }) => {
	const isControlled = controlledPanel !== void 0;
	const [internalPanel, setInternalPanel] = (0, import_react.useState)(() => normalizePanel(defaultPanel));
	const currentPanel = normalizePanel(isControlled ? controlledPanel : internalPanel);
	const setPanel = (0, import_react.useCallback)((panel) => {
		const nextPanel = normalizePanel(panel);
		if (nextPanel === currentPanel) return;
		if (!isControlled) setInternalPanel(nextPanel);
		onPanelChange?.(nextPanel);
	}, [
		currentPanel,
		isControlled,
		onPanelChange
	]);
	const contextValue = (0, import_react.useMemo)(() => ({
		currentPanel,
		setPanel,
		items
	}), [
		currentPanel,
		setPanel,
		items
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContext.Provider, {
		value: contextValue,
		children
	});
};
var useCarouselContext = () => {
	const context = (0, import_react.useContext)(CarouselContext);
	if (!context) throw new Error("useCarouselContext must be used within a CarouselController.");
	return context;
};
var defaultLayout = {
	itemsPerPage: 1,
	numberOfPages: 0,
	maxStartIndex: 0,
	maxOffset: 0,
	itemOffsets: []
};
var rubberBandDistance = (distance, dimension) => {
	const size = Math.max(1, dimension);
	const resistance = .55;
	return distance * resistance * size / (size + resistance * distance);
};
var rubberBandOffset = (offset, maxOffset, viewportWidth) => {
	if (offset < 0) return -rubberBandDistance(-offset, viewportWidth);
	if (offset > maxOffset) return maxOffset + rubberBandDistance(offset - maxOffset, viewportWidth);
	return offset;
};
var readRenderedOffset = (element, fallback) => {
	const transform = (element.ownerDocument.defaultView ?? window).getComputedStyle(element).transform;
	if (!transform || transform === "none") return fallback;
	const isMatrix3d = transform.startsWith("matrix3d(");
	const translateX = transform.slice(isMatrix3d ? 9 : 7, -1).split(",").map(Number)[isMatrix3d ? 12 : 4] ?? NaN;
	return Number.isFinite(translateX) ? -translateX : fallback;
};
var estimatePointerVelocity = (samples) => {
	if (samples.length < 2) return 0;
	const end = samples[samples.length - 1];
	const cutoff = end.time - 100;
	let start = samples[0];
	for (const sample of samples) if (sample.time <= cutoff) start = sample;
	else break;
	const elapsedSeconds = (end.time - start.time) / 1e3;
	if (elapsedSeconds <= 0) return 0;
	return -(end.x - start.x) / elapsedSeconds;
};
var toCssLength = (value) => {
	if (typeof value === "number") return `${value}px`;
	return value ?? "0px";
};
var getItemBasis = (itemsPerPage, gap) => {
	const count = Math.max(1, Math.floor(itemsPerPage || 1));
	if (count === 1) return "100%";
	if (gap === "" || gap === "0px" || gap === "0") return `calc((100% / ${count}) - (1px / ${count}))`;
	return `calc((100% - (${Array.from({ length: count - 1 }, () => `(${gap})`).join(" + ")})) / ${count})`;
};
var getPagerDataAttribute = (alignment) => alignment === "under" ? "under" : "over";
var cloneNavigationButton = (button, disabled, onNavigate) => {
	if (!button) return null;
	const originalProps = button.props;
	const isDisabled = disabled || originalProps.disabled === true;
	return (0, import_react.cloneElement)(button, {
		disabled: isDisabled,
		"aria-disabled": isDisabled,
		onClick: (event) => {
			if (isDisabled) {
				event.preventDefault();
				return;
			}
			originalProps.onClick?.(event);
			onNavigate();
		}
	});
};
var Carousel = ({ renderItem, getItemKey, panelsPerView, itemWidth, gap = 0, className, viewportClassName, viewportStyle, ariaLabel = "Carousel", singlePageAlignment = "left", backButton, nextButton, buttonAlignment, pagerAlignment, renderPager }) => {
	const { items, currentPanel, setPanel } = useCarouselContext();
	const viewportRef = (0, import_react.useRef)(null);
	const trackRef = (0, import_react.useRef)(null);
	const itemRefs = (0, import_react.useRef)([]);
	const dragRef = (0, import_react.useRef)(null);
	const pointerCleanupRef = (0, import_react.useRef)(null);
	const animationFrameRef = (0, import_react.useRef)(null);
	const visualOffsetRef = (0, import_react.useRef)(0);
	const suppressClickRef = (0, import_react.useRef)(false);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [isAnimating, setIsAnimating] = (0, import_react.useState)(false);
	const [layout, setLayout] = (0, import_react.useState)(defaultLayout);
	const sizingMode = itemWidth !== void 0 ? "item-width" : "panels";
	const panelCounts = resolveResponsiveValue(panelsPerView, 1);
	const itemWidths = resolveResponsiveValue(itemWidth, "100%");
	const gaps = resolveResponsiveValue(gap, 0);
	const buttonAlignments = resolveResponsiveValue(buttonAlignment, "over");
	const pagerAlignments = resolveResponsiveValue(pagerAlignment, "under");
	const cssVariables = {
		"--puzzle-carousel-gap-mobile": toCssLength(gaps.mobile),
		"--puzzle-carousel-gap-tablet": toCssLength(gaps.tablet),
		"--puzzle-carousel-gap-desktop": toCssLength(gaps.desktop),
		"--puzzle-carousel-basis-mobile": getItemBasis(panelCounts.mobile, toCssLength(gaps.mobile)),
		"--puzzle-carousel-basis-tablet": getItemBasis(panelCounts.tablet ?? panelCounts.mobile, toCssLength(gaps.tablet)),
		"--puzzle-carousel-basis-desktop": getItemBasis(panelCounts.desktop ?? panelCounts.tablet ?? panelCounts.mobile, toCssLength(gaps.desktop)),
		"--puzzle-carousel-item-width-mobile": toCssLength(itemWidths.mobile),
		"--puzzle-carousel-item-width-tablet": toCssLength(itemWidths.tablet),
		"--puzzle-carousel-item-width-desktop": toCssLength(itemWidths.desktop)
	};
	/**
	* Read the actual rendered widths and positions of the items.
	* This supports both panelsPerView and itemWidth sizing.
	*/
	const measureLayout = (0, import_react.useCallback)(() => {
		const viewport = viewportRef.current;
		const track = trackRef.current;
		if (!viewport || !track || items.length === 0) {
			setLayout(defaultLayout);
			return;
		}
		const viewportWidth = viewport.getBoundingClientRect().width;
		const itemNodes = itemRefs.current.slice(0, items.length).filter((item) => item !== null);
		if (viewportWidth <= 0 || itemNodes.length === 0) return;
		const trackRect = track.getBoundingClientRect();
		const itemRects = itemNodes.map((item) => item.getBoundingClientRect());
		const itemOffsets = itemRects.map((rect) => rect.left - trackRect.left);
		let itemsPerPage = 0;
		for (const rect of itemRects) if (rect.right - trackRect.left <= viewportWidth + .01) itemsPerPage += 1;
		else break;
		itemsPerPage = Math.max(1, itemsPerPage);
		const numberOfPages = Math.ceil(items.length / itemsPerPage);
		const maxStartIndex = Math.max(0, items.length - itemsPerPage);
		const lastItemEnd = itemRects[itemRects.length - 1].right - trackRect.left;
		const maxOffset = Math.max(0, lastItemEnd - viewportWidth);
		setLayout((previous) => {
			if (previous.itemsPerPage === itemsPerPage && previous.numberOfPages === numberOfPages && previous.maxStartIndex === maxStartIndex && previous.maxOffset === maxOffset && previous.itemOffsets.length === itemOffsets.length && previous.itemOffsets.every((offset, index) => offset === itemOffsets[index])) return previous;
			return {
				itemsPerPage,
				numberOfPages,
				maxStartIndex,
				maxOffset,
				itemOffsets
			};
		});
	}, [items.length]);
	const itemOrderSignature = items.map((item, index) => String(getItemKey ? getItemKey(item, index) : index)).join("\0");
	(0, import_react.useEffect)(() => {
		const viewport = viewportRef.current;
		const track = trackRef.current;
		if (!viewport || !track) return;
		const ownerWindow = viewport.ownerDocument.defaultView ?? window;
		measureLayout();
		if (typeof ResizeObserver === "undefined") {
			ownerWindow.addEventListener("resize", measureLayout);
			return () => {
				ownerWindow.removeEventListener("resize", measureLayout);
			};
		}
		const observer = new ResizeObserver(measureLayout);
		observer.observe(viewport);
		observer.observe(track);
		itemRefs.current.slice(0, items.length).forEach((item) => {
			if (item) observer.observe(item);
		});
		return () => observer.disconnect();
	}, [
		items.length,
		itemOrderSignature,
		measureLayout,
		gaps.mobile,
		gaps.tablet,
		gaps.desktop
	]);
	/**
	* currentPanel is always an item index.
	*
	* Restrict it to the last position from which the viewport can be
	* completely filled without scrolling beyond the end of the track.
	*/
	const activePanel = Math.min(Math.max(0, Math.floor(currentPanel)), layout.maxStartIndex);
	/**
	* Logical page starts can overlap at the end.
	*
	* Example: 5 items with 3 visible per page:
	* [0, 2], not [0, 3].
	*
	* Example: 8 items with 3 visible per page:
	* [0, 3, 5].
	*/
	const pageStartIndices = (0, import_react.useMemo)(() => Array.from({ length: layout.numberOfPages }, (_, pageIndex) => {
		if (pageIndex === layout.numberOfPages - 1) return layout.maxStartIndex;
		return Math.min(pageIndex * layout.itemsPerPage, layout.maxStartIndex);
	}), [
		layout.itemsPerPage,
		layout.maxStartIndex,
		layout.numberOfPages
	]);
	/**
	* Map the active item to the nearest logical page.
	* This lets swipe-to-panel and page-based navigation coexist.
	*/
	const activePageIndex = (0, import_react.useMemo)(() => {
		if (pageStartIndices.length === 0) return 0;
		return pageStartIndices.reduce((closestIndex, pageStart, index) => {
			const closestStart = pageStartIndices[closestIndex];
			return Math.abs(pageStart - activePanel) < Math.abs(closestStart - activePanel) ? index : closestIndex;
		}, 0);
	}, [activePanel, pageStartIndices]);
	const clampOffset = (0, import_react.useCallback)((offset) => Math.min(layout.maxOffset, Math.max(0, offset)), [layout.maxOffset]);
	const activeOffset = clampOffset(layout.itemOffsets[activePanel] ?? 0);
	(0, import_react.useEffect)(() => {
		if (dragRef.current || animationFrameRef.current !== null) return;
		visualOffsetRef.current = activeOffset;
	}, [activeOffset]);
	(0, import_react.useEffect)(() => () => {
		pointerCleanupRef.current?.();
		if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
	}, []);
	/**
	* Only correct the controller after layout measurement has completed.
	* This avoids forcing currentPanel to 0 during the initial render.
	*/
	(0, import_react.useEffect)(() => {
		if (layout.numberOfPages > 0 && currentPanel !== activePanel) setPanel(activePanel);
	}, [
		activePanel,
		currentPanel,
		layout.numberOfPages,
		setPanel
	]);
	const goToPage = (0, import_react.useCallback)((pageIndex) => {
		const targetPage = Math.max(0, Math.min(pageIndex, pageStartIndices.length - 1));
		const targetPanel = pageStartIndices[targetPage];
		if (targetPanel !== void 0) setPanel(targetPanel);
	}, [pageStartIndices, setPanel]);
	const goToPreviousPage = (0, import_react.useCallback)(() => {
		goToPage(activePageIndex - 1);
	}, [activePageIndex, goToPage]);
	const goToNextPage = (0, import_react.useCallback)(() => {
		goToPage(activePageIndex + 1);
	}, [activePageIndex, goToPage]);
	/**
	* Start tracking a swipe or mouse drag.
	*
	* Capture on the original element rather than always on the viewport,
	* so a normal click on an interactive child can still work.
	*/
	const writeTrackOffset = (0, import_react.useCallback)((offset) => {
		visualOffsetRef.current = offset;
		if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
	}, []);
	const getNearestPanelIndex = (0, import_react.useCallback)((offset) => {
		let nearestIndex = 0;
		let nearestDistance = Number.POSITIVE_INFINITY;
		for (let index = 0; index <= layout.maxStartIndex; index += 1) {
			const candidateOffset = clampOffset(layout.itemOffsets[index] ?? 0);
			const distance = Math.abs(candidateOffset - offset);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		}
		return nearestIndex;
	}, [
		clampOffset,
		layout.itemOffsets,
		layout.maxStartIndex
	]);
	/**
	* Animate to a panel using a damped spring.
	*
	* A little underdamping gives the motion a natural overshoot.
	* The target remains a real, reachable item offset.
	*/
	const animateToPanel = (0, import_react.useCallback)((fromOffset, targetPanel, initialVelocity) => {
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		const track = trackRef.current;
		const ownerWindow = viewportRef.current?.ownerDocument.defaultView ?? window;
		const targetOffset = clampOffset(layout.itemOffsets[targetPanel] ?? 0);
		if (!track || ownerWindow.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			writeTrackOffset(targetOffset);
			track?.style.removeProperty("transition");
			setPanel(targetPanel);
			setIsDragging(false);
			setIsAnimating(false);
			return;
		}
		track.style.transition = "none";
		setIsDragging(false);
		setIsAnimating(true);
		let position = fromOffset;
		let velocity = Math.max(-1800, Math.min(1800, initialVelocity * .4));
		let previousTime = performance.now();
		const stiffness = 230;
		const damping = 24;
		const animate = (now) => {
			const deltaSeconds = Math.min((now - previousTime) / 1e3, 1 / 30);
			previousTime = now;
			const springAcceleration = (targetOffset - position) * stiffness;
			const dampingAcceleration = velocity * damping;
			velocity += (springAcceleration - dampingAcceleration) * deltaSeconds;
			position += velocity * deltaSeconds;
			const viewportWidth = viewportRef.current?.clientWidth ?? 1;
			writeTrackOffset(rubberBandOffset(position, layout.maxOffset, viewportWidth));
			if (Math.abs(targetOffset - position) < .5 && Math.abs(velocity) < 10) {
				animationFrameRef.current = null;
				writeTrackOffset(targetOffset);
				track.style.removeProperty("transition");
				setPanel(targetPanel);
				setIsAnimating(false);
				return;
			}
			animationFrameRef.current = requestAnimationFrame(animate);
		};
		animationFrameRef.current = requestAnimationFrame(animate);
	}, [
		clampOffset,
		layout.itemOffsets,
		layout.maxOffset,
		setPanel,
		writeTrackOffset
	]);
	const handlePointerDown = (0, import_react.useCallback)((event) => {
		if (!event.isPrimary || dragRef.current) return;
		if (event.pointerType === "mouse" && event.button !== 0) return;
		if (layout.maxOffset <= 0) return;
		const track = trackRef.current;
		const viewport = viewportRef.current;
		const ownerWindow = viewport?.ownerDocument.defaultView ?? window;
		if (!track || !viewport || !ownerWindow) return;
		const interruptedAnimation = animationFrameRef.current !== null;
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		const startOffset = readRenderedOffset(track, visualOffsetRef.current);
		track.style.transition = "none";
		writeTrackOffset(startOffset);
		setIsAnimating(false);
		setIsDragging(true);
		const startTime = performance.now();
		const drag = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startOffset,
			currentOffset: startOffset,
			renderedOffset: startOffset,
			hasMoved: false,
			interruptedAnimation,
			samples: [{
				x: event.clientX,
				time: startTime
			}]
		};
		dragRef.current = drag;
		const updatePointerPosition = (pointerEvent) => {
			const deltaX = pointerEvent.clientX - drag.startX;
			if (!drag.hasMoved && Math.abs(deltaX) <= 4) return;
			drag.hasMoved = true;
			drag.currentOffset = drag.startOffset - deltaX;
			drag.renderedOffset = rubberBandOffset(drag.currentOffset, layout.maxOffset, viewport.clientWidth);
			const now = performance.now();
			drag.samples.push({
				x: pointerEvent.clientX,
				time: now
			});
			while (drag.samples.length > 2 && now - drag.samples[1].time > 120) drag.samples.shift();
			writeTrackOffset(drag.renderedOffset);
			if (pointerEvent.cancelable) pointerEvent.preventDefault();
		};
		const cleanup = () => {
			ownerWindow.removeEventListener("pointermove", handleWindowPointerMove);
			ownerWindow.removeEventListener("pointerup", handleWindowPointerUp);
			ownerWindow.removeEventListener("pointercancel", handleWindowPointerCancel);
			ownerWindow.removeEventListener("blur", handleWindowBlur);
			if (pointerCleanupRef.current === cleanup) pointerCleanupRef.current = null;
		};
		const settleCancelledDrag = () => {
			if (dragRef.current !== drag) return;
			cleanup();
			dragRef.current = null;
			setIsDragging(false);
			const targetPanel = getNearestPanelIndex(clampOffset(drag.currentOffset));
			animateToPanel(drag.renderedOffset, targetPanel, 0);
		};
		const handleWindowPointerMove = (pointerEvent) => {
			if (pointerEvent.pointerId !== drag.pointerId) return;
			updatePointerPosition(pointerEvent);
		};
		const handleWindowPointerUp = (pointerEvent) => {
			if (pointerEvent.pointerId !== drag.pointerId) return;
			updatePointerPosition(pointerEvent);
			cleanup();
			dragRef.current = null;
			setIsDragging(false);
			if (!drag.hasMoved) {
				if (drag.interruptedAnimation) {
					const targetPanel = getNearestPanelIndex(clampOffset(drag.startOffset));
					animateToPanel(drag.startOffset, targetPanel, 0);
				} else {
					track.style.removeProperty("transition");
					writeTrackOffset(drag.startOffset);
				}
				return;
			}
			suppressClickRef.current = true;
			ownerWindow.setTimeout(() => {
				suppressClickRef.current = false;
			}, 0);
			const velocity = estimatePointerVelocity(drag.samples);
			const projectedOffset = clampOffset(clampOffset(drag.currentOffset) + velocity * .18);
			const targetPanel = getNearestPanelIndex(projectedOffset);
			animateToPanel(drag.renderedOffset, targetPanel, velocity);
		};
		const handleWindowPointerCancel = (pointerEvent) => {
			if (pointerEvent.pointerId === drag.pointerId) settleCancelledDrag();
		};
		const handleWindowBlur = () => {
			settleCancelledDrag();
		};
		pointerCleanupRef.current = cleanup;
		ownerWindow.addEventListener("pointermove", handleWindowPointerMove);
		ownerWindow.addEventListener("pointerup", handleWindowPointerUp);
		ownerWindow.addEventListener("pointercancel", handleWindowPointerCancel);
		ownerWindow.addEventListener("blur", handleWindowBlur);
	}, [
		animateToPanel,
		clampOffset,
		getNearestPanelIndex,
		layout.maxOffset,
		setIsAnimating,
		writeTrackOffset
	]);
	const handleClickCapture = (0, import_react.useCallback)((event) => {
		if (!suppressClickRef.current) return;
		event.preventDefault();
		event.stopPropagation();
		suppressClickRef.current = false;
	}, []);
	const isFirstPage = activePageIndex === 0;
	const isLastPage = layout.numberOfPages <= 1 || activePageIndex >= layout.numberOfPages - 1;
	const currentPage = layout.numberOfPages > 0 ? activePageIndex : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-carousel", className),
		style: cssVariables,
		"data-sizing": sizingMode,
		"data-dragging": isDragging ? "true" : "false",
		"data-animating": isAnimating ? "true" : "false",
		"data-single-page": layout.numberOfPages <= 1 ? "true" : "false",
		"data-single-page-alignment": singlePageAlignment,
		"data-button-mobile": buttonAlignments.mobile,
		"data-button-tablet": buttonAlignments.tablet,
		"data-button-desktop": buttonAlignments.desktop,
		"data-pager-mobile": getPagerDataAttribute(pagerAlignments.mobile),
		"data-pager-tablet": getPagerDataAttribute(pagerAlignments.tablet ?? pagerAlignments.mobile),
		"data-pager-desktop": getPagerDataAttribute(pagerAlignments.desktop ?? pagerAlignments.tablet ?? pagerAlignments.mobile),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "puzzle-carousel__stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-carousel__navigation puzzle-carousel__navigation--previous",
					children: cloneNavigationButton(backButton, isFirstPage, goToPreviousPage)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: viewportRef,
					className: cn("puzzle-carousel__viewport", viewportClassName),
					style: viewportStyle,
					role: "group",
					"aria-roledescription": "carousel",
					"aria-label": ariaLabel,
					onPointerDown: handlePointerDown,
					onClickCapture: handleClickCapture,
					onDragStart: (event) => event.preventDefault(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: trackRef,
						className: "puzzle-carousel__track",
						style: { transform: `translate3d(${-activeOffset}px, 0, 0)` },
						children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: (node) => {
								itemRefs.current[index] = node;
							},
							className: "puzzle-carousel__item",
							role: "group",
							"aria-roledescription": "slide",
							"aria-label": `${index + 1} of ${items.length}`,
							children: renderItem(item, index)
						}, getItemKey ? getItemKey(item, index) : index))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-carousel__navigation puzzle-carousel__navigation--next",
					children: cloneNavigationButton(nextButton, isLastPage, goToNextPage)
				})
			]
		}), renderPager && layout.numberOfPages > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-carousel__pager",
			children: renderPager(currentPage, layout.numberOfPages)
		})]
	});
};
export { Backdrop, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Carousel, CarouselController, Drawer, ScrollLock, Stack, Transition, registerOverlay, resolveResponsiveValue, useCarouselContext };
