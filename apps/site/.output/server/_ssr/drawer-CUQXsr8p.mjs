import { __toESM } from "../_runtime.mjs";
import { Link, cn } from "./section-Ns7rCqaa.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/drawer-CUQXsr8p.js
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
export { Backdrop, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Drawer, ScrollLock, Stack, Transition, registerOverlay, resolveResponsiveValue };
