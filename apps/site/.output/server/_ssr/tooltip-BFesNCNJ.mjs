import { __toESM } from "../_runtime.mjs";
import { Backdrop, Transition, registerOverlay, resolveResponsiveValue } from "./carousel-DRWW6spl.mjs";
import { Icon$1, cn } from "./section-Cp-bzptr.mjs";
import { useThemeScope } from "./scope-context-gETs7uAh.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
import { require_react_dom } from "../_libs/react-dom.mjs";
// node_modules/.nitro/vite/services/ssr/assets/tooltip-BFesNCNJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
/**
* Call the original function, but applying the debounce rules.
*
* Only the last call to the function shall be executed after the timeout has been reached.
* @returns the debounced function with a cancel function property to clear the timeout.
*/
var debounce = (func, wait) => {
	let timeout;
	const cancel = () => clearTimeout(timeout);
	return Object.assign((...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(void 0, args), wait);
	}, { cancel });
};
var useRovingFocus = ({ items, orientation = "horizontal", dir = "ltr", loop = true, initialActiveId }) => {
	const itemRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const callbackRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const itemsRef = (0, import_react.useRef)(items);
	itemsRef.current = items;
	const [activeId, setActiveId] = (0, import_react.useState)(() => {
		return items.find((item) => item.id === initialActiveId && !item.disabled)?.id ?? items.find((item) => !item.disabled)?.id;
	});
	const resolvedActiveId = items.find((item) => item.id === activeId && !item.disabled)?.id ?? items.find((item) => !item.disabled)?.id;
	(0, import_react.useEffect)(() => {
		if (activeId !== resolvedActiveId) setActiveId(resolvedActiveId);
	}, [activeId, resolvedActiveId]);
	const getItemRef = (0, import_react.useCallback)((id) => {
		const existingCallback = callbackRefs.current.get(id);
		if (existingCallback) return existingCallback;
		const callback = (node) => {
			if (node) {
				itemRefs.current.set(id, node);
				return;
			}
			itemRefs.current.delete(id);
			if (callbackRefs.current.get(id) === callback) callbackRefs.current.delete(id);
		};
		callbackRefs.current.set(id, callback);
		return callback;
	}, []);
	const focusItem = (0, import_react.useCallback)((id) => {
		const item = itemsRef.current.find((candidate) => candidate.id === id && !candidate.disabled);
		const element = itemRefs.current.get(id);
		if (!item || !element) return;
		setActiveId(id);
		element.focus();
	}, []);
	return {
		activeId: resolvedActiveId,
		getItemRef,
		getItemTabIndex: (0, import_react.useCallback)((id, disabled = false) => {
			if (disabled || resolvedActiveId === void 0) return -1;
			return id === resolvedActiveId ? 0 : -1;
		}, [resolvedActiveId]),
		focusItem,
		onItemFocus: (0, import_react.useCallback)((id) => {
			if (itemsRef.current.find((candidate) => candidate.id === id && !candidate.disabled)) setActiveId(id);
		}, []),
		onItemKeyDown: (0, import_react.useCallback)((event, id) => {
			if (event.defaultPrevented) return;
			const enabledItems = itemsRef.current.filter((item) => !item.disabled);
			if (enabledItems.length === 0) return;
			const currentIndex = enabledItems.findIndex((item) => item.id === id);
			if (currentIndex === -1) return;
			let nextIndex;
			let direction;
			switch (event.key) {
				case "Home":
					nextIndex = 0;
					break;
				case "End":
					nextIndex = enabledItems.length - 1;
					break;
				case "ArrowRight":
					if (orientation === "horizontal" || orientation === "both") direction = dir === "rtl" ? -1 : 1;
					break;
				case "ArrowLeft":
					if (orientation === "horizontal" || orientation === "both") direction = dir === "rtl" ? 1 : -1;
					break;
				case "ArrowDown":
					if (orientation === "vertical" || orientation === "both") direction = 1;
					break;
				case "ArrowUp": if (orientation === "vertical" || orientation === "both") direction = -1;
			}
			if (direction !== void 0) {
				const candidateIndex = currentIndex + direction;
				nextIndex = loop ? (candidateIndex + enabledItems.length) % enabledItems.length : Math.min(Math.max(candidateIndex, 0), enabledItems.length - 1);
			}
			if (nextIndex === void 0) return;
			const nextItem = enabledItems[nextIndex];
			if (!nextItem) return;
			event.preventDefault();
			focusItem(nextItem.id);
		}, [
			dir,
			focusItem,
			loop,
			orientation
		])
	};
};
var PROGRESS_MIN = 0;
var PROGRESS_MAX = 100;
/** Clamps a progress value to 0-100. Missing or non-finite values are indeterminate. */
var normalizeProgressValue = (value) => value === void 0 || !Number.isFinite(value) ? void 0 : Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, value));
/** Shared progressbar semantics; aria-valuenow is omitted while indeterminate. */
var getProgressAriaProps = (value) => ({
	role: "progressbar",
	"aria-valuemin": PROGRESS_MIN,
	"aria-valuemax": PROGRESS_MAX,
	"aria-valuenow": value
});
var LinearProgress = ({ color, value: rawValue, showTrack = true, className, style, ...props }) => {
	const value = normalizeProgressValue(rawValue);
	const classes = cn("puzzle-linear-progress-track", showTrack && "puzzle-linear-progress-show-track", className);
	const indicatorClasses = cn("puzzle-linear-progress", value === void 0 && "puzzle-linear-progress-indeterminate");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		...getProgressAriaProps(value),
		style: {
			color: color ?? "var(--puzzle-color-primary)",
			...style
		},
		className: classes,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: indicatorClasses,
			style: {
				backgroundColor: color ?? "var(--puzzle-color-primary)",
				transform: value !== void 0 ? `scaleX(${value / 100})` : "scaleX(1)",
				height: "100%",
				transition: "transform 0.3s"
			}
		})
	});
};
var getPositionCoordinates = (position, align, anchor, content, offset) => {
	let top = 0;
	let left = 0;
	switch (position) {
		case "top":
			top = anchor.top - content.height - offset;
			break;
		case "right":
			left = anchor.right + offset;
			break;
		case "bottom":
			top = anchor.bottom + offset;
			break;
		case "left": left = anchor.left - content.width - offset;
	}
	if (position === "top" || position === "bottom") switch (align) {
		case "start":
			left = anchor.left;
			break;
		case "center":
			left = anchor.left + (anchor.width - content.width) / 2;
			break;
		case "end": left = anchor.right - content.width;
	}
	else switch (align) {
		case "start":
			top = anchor.top;
			break;
		case "center":
			top = anchor.top + (anchor.height - content.height) / 2;
			break;
		case "end": top = anchor.bottom - content.height;
	}
	return {
		top,
		left
	};
};
var getOppositePosition = (position) => {
	switch (position) {
		case "top": return "bottom";
		case "right": return "left";
		case "bottom": return "top";
		case "left": return "right";
	}
};
var getFallbackPositions = (position) => {
	const opposite = getOppositePosition(position);
	return [
		position,
		opposite,
		...[
			"top",
			"right",
			"bottom",
			"left"
		].filter((item) => item !== position && item !== opposite)
	];
};
var fitsViewport = (coordinates, content, viewportWidth, viewportHeight, padding) => {
	return coordinates.top >= padding && coordinates.left >= padding && coordinates.top + content.height <= viewportHeight - padding && coordinates.left + content.width <= viewportWidth - padding;
};
var clampPosition = (coordinates, content, viewportWidth, viewportHeight, padding) => {
	const maxLeft = Math.max(padding, viewportWidth - content.width - padding);
	const maxTop = Math.max(padding, viewportHeight - content.height - padding);
	return {
		top: Math.min(Math.max(coordinates.top, padding), maxTop),
		left: Math.min(Math.max(coordinates.left, padding), maxLeft)
	};
};
var calculatePosition = (anchor, content, { position, align, offset, collisionPadding, viewportWidth, viewportHeight }) => {
	const candidates = getFallbackPositions(position);
	for (const candidate of candidates) {
		const coordinates = getPositionCoordinates(candidate, align, anchor, content, offset);
		if (fitsViewport(coordinates, content, viewportWidth, viewportHeight, collisionPadding)) return {
			position: candidate,
			coordinates
		};
	}
	return {
		position,
		coordinates: clampPosition(getPositionCoordinates(position, align, anchor, content, offset), content, viewportWidth, viewportHeight, collisionPadding)
	};
};
var useFloatingPosition = ({ anchor, content, enabled, position, align, offset, collisionPadding, matchTriggerWidth = false }) => {
	const [result, setResult] = (0, import_react.useState)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!enabled || !anchor || !content) {
			setResult(null);
			return;
		}
		const ownerDocument = anchor.ownerDocument;
		const ownerWindow = ownerDocument.defaultView;
		if (!ownerWindow || content.ownerDocument !== ownerDocument) {
			setResult(null);
			return;
		}
		let animationFrame = 0;
		let disposed = false;
		const updatePosition = () => {
			if (disposed || !anchor.isConnected || !content.isConnected || anchor.ownerDocument !== ownerDocument || content.ownerDocument !== ownerDocument || anchor.getClientRects().length === 0 || content.getClientRects().length === 0) return;
			const anchorRect = anchor.getBoundingClientRect();
			const contentRect = content.getBoundingClientRect();
			if (anchorRect.width === 0 && anchorRect.height === 0 || contentRect.width === 0 && contentRect.height === 0) return;
			const placement = calculatePosition(anchorRect, contentRect, {
				position,
				align,
				offset,
				collisionPadding,
				viewportWidth: ownerDocument.documentElement.clientWidth,
				viewportHeight: ownerDocument.documentElement.clientHeight
			});
			setResult({
				placement: placement.position,
				style: {
					position: "fixed",
					top: placement.coordinates.top,
					left: placement.coordinates.left,
					...matchTriggerWidth ? { minWidth: anchorRect.width } : {}
				}
			});
		};
		const requestFrame = ownerWindow.requestAnimationFrame?.bind(ownerWindow) ?? ((callback) => ownerWindow.setTimeout(() => callback(Date.now()), 16));
		const cancelFrame = ownerWindow.cancelAnimationFrame?.bind(ownerWindow) ?? ownerWindow.clearTimeout.bind(ownerWindow);
		const scheduleUpdate = () => {
			cancelFrame(animationFrame);
			animationFrame = requestFrame(updatePosition);
		};
		setResult(null);
		updatePosition();
		const ResizeObserverConstructor = ownerWindow.ResizeObserver ?? globalThis.ResizeObserver;
		const resizeObserver = ResizeObserverConstructor ? new ResizeObserverConstructor(scheduleUpdate) : null;
		resizeObserver?.observe(anchor);
		resizeObserver?.observe(content);
		const handleResize = () => scheduleUpdate();
		const handleScroll = () => scheduleUpdate();
		ownerWindow.addEventListener("resize", handleResize);
		ownerWindow.addEventListener("scroll", handleScroll, true);
		const visualViewport = ownerWindow.visualViewport;
		visualViewport?.addEventListener("resize", handleResize);
		visualViewport?.addEventListener("scroll", handleScroll);
		return () => {
			disposed = true;
			ownerWindow.cancelAnimationFrame(animationFrame);
			resizeObserver?.disconnect();
			ownerWindow.removeEventListener("resize", handleResize);
			ownerWindow.removeEventListener("scroll", handleScroll, true);
			visualViewport?.removeEventListener("resize", handleResize);
			visualViewport?.removeEventListener("scroll", handleScroll);
		};
	}, [
		anchor,
		content,
		enabled,
		position,
		align,
		offset,
		collisionPadding,
		matchTriggerWidth
	]);
	return {
		style: result?.style ?? null,
		placement: result?.placement ?? position,
		isPositioned: result !== null
	};
};
var PopoutPositionedContext = (0, import_react.createContext)(true);
var usePopoutPositioned = () => (0, import_react.useContext)(PopoutPositionedContext);
var setRef$3 = (ref, value) => {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
};
var Popout = ({ trigger, children, position = "bottom", align = "start", action = "click", offset = 8, collisionPadding = 8, exitDelay = 150, open, defaultOpen = false, onOpenChange, closeOnOutsideClick = true, closeOnEscape = true, toggleOnClick = false, matchTriggerWidth = false, className, contentClassName }) => {
	const themeScope = useThemeScope();
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [anchorElement, setAnchorElement] = (0, import_react.useState)(null);
	const [portalContainer, setPortalContainer] = (0, import_react.useState)(null);
	const [contentElement, setContentElement] = (0, import_react.useState)(null);
	const anchorRef = (0, import_react.useRef)(null);
	const contentRef = (0, import_react.useRef)(null);
	const pointerDocumentRef = (0, import_react.useRef)(null);
	const isOpen = open ?? internalOpen;
	const changeOpenState = (0, import_react.useCallback)((nextOpen) => {
		if (open === void 0) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [open, onOpenChange]);
	const debouncedClose = (0, import_react.useMemo)(() => debounce(() => changeOpenState(false), Math.max(0, exitDelay)), [changeOpenState, exitDelay]);
	const cancelDebouncedClose = (0, import_react.useCallback)(() => {
		debouncedClose.cancel();
	}, [debouncedClose]);
	const scheduleClose = (0, import_react.useCallback)(() => {
		if (exitDelay > 0) debouncedClose();
		else changeOpenState(false);
	}, [
		debouncedClose,
		exitDelay,
		changeOpenState
	]);
	const removePointerListeners = (0, import_react.useCallback)((handler) => {
		const ownerDocument = pointerDocumentRef.current;
		if (!ownerDocument) return;
		ownerDocument.removeEventListener("pointerup", handler);
		ownerDocument.removeEventListener("pointercancel", handler);
		pointerDocumentRef.current = null;
	}, []);
	const handleDocumentPointerUp = (0, import_react.useCallback)(() => {
		removePointerListeners(handleDocumentPointerUp);
		debouncedClose();
	}, [debouncedClose, removePointerListeners]);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			debouncedClose.cancel();
			removePointerListeners(handleDocumentPointerUp);
		};
	}, [
		debouncedClose,
		handleDocumentPointerUp,
		removePointerListeners
	]);
	const handleTriggerRef = (0, import_react.useCallback)((node) => {
		anchorRef.current = node;
		setAnchorElement(node);
		setPortalContainer(themeScope ? themeScope.portalTarget : node?.ownerDocument.body ?? null);
		setRef$3(trigger.props.ref, node);
	}, [trigger, themeScope]);
	const handleContentRef = (0, import_react.useCallback)((node) => {
		contentRef.current = node;
		setContentElement(node);
	}, []);
	const { style: positionStyle, placement, isPositioned } = useFloatingPosition({
		anchor: anchorElement,
		content: contentElement,
		enabled: mounted && isOpen,
		position,
		align,
		offset,
		collisionPadding,
		matchTriggerWidth
	});
	(0, import_react.useEffect)(() => {
		if (!isOpen || !closeOnOutsideClick || !portalContainer) return;
		const ownerDocument = anchorElement?.ownerDocument;
		const ownerWindow = ownerDocument?.defaultView;
		if (!ownerDocument || !ownerWindow) return;
		const handlePointerDown = (event) => {
			const target = event.target;
			if (!(target instanceof ownerWindow.Node)) return;
			if (anchorRef.current?.contains(target) || contentRef.current?.contains(target)) return;
			cancelDebouncedClose();
			changeOpenState(false);
		};
		ownerDocument.addEventListener("pointerdown", handlePointerDown);
		return () => {
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [
		isOpen,
		closeOnOutsideClick,
		portalContainer,
		anchorElement,
		cancelDebouncedClose,
		changeOpenState
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || !portalContainer || !anchorElement) return;
		const ownerDocument = anchorElement.ownerDocument;
		return registerOverlay(ownerDocument, () => {
			if (!closeOnEscape) return;
			cancelDebouncedClose();
			changeOpenState(false);
			if (contentRef.current?.contains(ownerDocument.activeElement)) anchorRef.current?.focus({ preventScroll: true });
		});
	}, [
		isOpen,
		portalContainer,
		anchorElement,
		closeOnEscape,
		cancelDebouncedClose,
		changeOpenState
	]);
	const handlePointerEnter = (event) => {
		trigger.props.onPointerEnter?.(event);
		if (action !== "hover") return;
		cancelDebouncedClose();
		changeOpenState(true);
	};
	const handlePointerLeave = (event) => {
		trigger.props.onPointerLeave?.(event);
		if (action !== "hover") return;
		scheduleClose();
	};
	const handlePointerUp = (event) => {
		trigger.props.onPointerUp?.(event);
	};
	const handlePointerDown = (event) => {
		trigger.props.onPointerDown?.(event);
		if (action !== "down" || event.defaultPrevented) return;
		changeOpenState(true);
		const ownerDocument = event.currentTarget.ownerDocument;
		removePointerListeners(handleDocumentPointerUp);
		pointerDocumentRef.current = ownerDocument;
		ownerDocument.addEventListener("pointerup", handleDocumentPointerUp);
		ownerDocument.addEventListener("pointercancel", handleDocumentPointerUp);
	};
	const handleClick = (event) => {
		trigger.props.onClick?.(event);
		if (action !== "click" || event.defaultPrevented) return;
		changeOpenState(toggleOnClick ? !isOpen : true);
	};
	const triggerElement = (0, import_react.cloneElement)(trigger, {
		ref: handleTriggerRef,
		className: cn(trigger.props.className, className),
		onPointerEnter: handlePointerEnter,
		onPointerLeave: handlePointerLeave,
		onPointerDown: handlePointerDown,
		onPointerUp: handlePointerUp,
		onClick: handleClick
	});
	if (!mounted) return triggerElement;
	const contentStyle = {
		...positionStyle ?? {},
		visibility: isPositioned ? "visible" : "hidden",
		pointerEvents: isOpen && isPositioned ? "auto" : "none"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [triggerElement, portalContainer && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
		visible: isOpen,
		template: "fade",
		duration: 200,
		unmountOnExit: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: handleContentRef,
			className: cn("puzzle-popout__content", contentClassName),
			"data-placement": placement,
			style: contentStyle,
			onPointerEnter: action === "hover" ? cancelDebouncedClose : void 0,
			onPointerLeave: action === "hover" ? scheduleClose : void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoutPositionedContext.Provider, {
				value: isPositioned,
				children
			})
		})
	}), portalContainer)] });
};
var normalizeAutocompleteText = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
var filterAutocompleteOptions = (options, inputValue) => {
	const query = normalizeAutocompleteText(inputValue.trim());
	if (!query) return [...options];
	return options.filter((option) => {
		const label = normalizeAutocompleteText(option.label);
		const description = typeof option.description === "string" ? normalizeAutocompleteText(option.description) : "";
		return label.includes(query) || description.includes(query);
	});
};
var groupAutocompleteOptions = (options) => {
	const groups = /* @__PURE__ */ new Map();
	options.forEach((option, index) => {
		const label = option.group ?? null;
		let group = groups.get(label);
		if (!group) {
			group = {
				label,
				options: []
			};
			groups.set(label, group);
		}
		group.options.push({
			option,
			index
		});
	});
	return Array.from(groups.values());
};
var findEnabledAutocompleteIndex = (options, startIndex, direction, wrap = true) => {
	const length = options.length;
	if (length === 0) return -1;
	for (let step = 1; step <= length; step++) {
		let index = startIndex + step * direction;
		if (wrap) index = (index + length) % length;
		else if (index < 0 || index >= length) break;
		if (!options[index]?.disabled) return index;
	}
	return -1;
};
var areSelectionsEqual = (previous, next, multiple) => {
	if (!multiple) return Object.is(previous, next);
	if (!Array.isArray(previous) || !Array.isArray(next)) return Object.is(previous, next);
	return previous.length === next.length && previous.every((value, index) => Object.is(value, next[index]));
};
var Autocomplete = (props) => {
	const { options, label, description, error, disabled = false, required = false, readOnly = false, freeSolo = false, name, form, serializeValue, isOptionEqualToValue, filterOptions, renderOption, value, defaultValue, onChange, inputValue, defaultInputValue, onInputChange, open, defaultOpen = false, onOpenChange, openOnFocus = false, autoHighlight = false, clearOnBlur: clearOnBlurProp, clearOnEscape = false, clearable = true, clearLabel = "Clear selection", removeOptionLabel = "Remove", loading = false, loadingText = "Loading options...", noOptionsText = "No options found", requiredMessage = "Please select an option.", closeOnSelect: closeOnSelectProp, maxSelected, filterSelectedOptions, maxOptions, position = "bottom", align = "start", offset = 8, collisionPadding = 8, matchTriggerWidth = true, menuMaxHeight = "18rem", size = "md", fullWidth = false, className, inputClassName, popoverClassName, menuClassName, optionClassName, id, ref, onFocus, onBlur, onKeyDown, autoComplete = "off", placeholder = "Search options", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...inputProps } = props;
	const multiple = props.multiple === true;
	const controlledValue = Object.prototype.hasOwnProperty.call(props, "value");
	const controlledInputValue = inputValue !== void 0;
	const controlledOpen = open !== void 0;
	const baseId = (0, import_react.useId)();
	const inputId = id ?? `${baseId}-input`;
	const labelId = `${baseId}-label`;
	const descriptionId = `${baseId}-description`;
	const errorId = `${baseId}-error`;
	const listboxId = `${baseId}-listbox`;
	const initialValue = multiple ? defaultValue ?? [] : defaultValue;
	const initialSingleValue = controlledValue ? value : defaultValue;
	const initialOption = initialSingleValue === void 0 ? void 0 : options.find((option) => isOptionEqualToValue ? isOptionEqualToValue(option, initialSingleValue) : Object.is(option.value, initialSingleValue));
	const [internalValue, setInternalValue] = (0, import_react.useState)(initialValue);
	const [internalInputValue, setInternalInputValue] = (0, import_react.useState)(() => defaultInputValue ?? (multiple ? "" : initialOption?.label ?? (initialSingleValue === void 0 ? "" : String(initialSingleValue))));
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(-1);
	const inputRef = (0, import_react.useRef)(null);
	const listboxRef = (0, import_react.useRef)(null);
	const previousValueRef = (0, import_react.useRef)(controlledValue ? value : initialValue);
	const handleInputRef = (0, import_react.useCallback)((node) => {
		inputRef.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	const selectedValue = controlledValue ? value : internalValue;
	const selectedValues = multiple ? selectedValue ?? [] : selectedValue === void 0 ? [] : [selectedValue];
	const resolvedInputValue = controlledInputValue ? inputValue ?? "" : internalInputValue;
	const isOpen = disabled ? false : open ?? internalOpen;
	const closeOnSelect = closeOnSelectProp ?? !multiple;
	const clearOnBlur = clearOnBlurProp ?? !freeSolo;
	const hasError = error !== void 0 && error !== null && error !== false;
	const isInvalid = hasError || ariaInvalid !== void 0 && ariaInvalid !== false && ariaInvalid !== "false";
	const errorContent = error === true ? "Invalid value" : error;
	const responsiveSize = resolveResponsiveValue(size, "md");
	const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);
	const isEqual = (0, import_react.useCallback)((option, selected) => isOptionEqualToValue ? isOptionEqualToValue(option, selected) : Object.is(option.value, selected), [isOptionEqualToValue]);
	const getValueLabel = (0, import_react.useCallback)((selected) => {
		return options.find((candidate) => isEqual(candidate, selected))?.label ?? String(selected);
	}, [options, isEqual]);
	const isOptionSelected = (0, import_react.useCallback)((option) => selectedValues.some((selected) => isEqual(option, selected)), [selectedValues, isEqual]);
	const changeInputValue = (0, import_react.useCallback)((nextValue, reason) => {
		if (!controlledInputValue) setInternalInputValue(nextValue);
		onInputChange?.(nextValue, reason);
	}, [controlledInputValue, onInputChange]);
	const changeOpenState = (0, import_react.useCallback)((nextOpen) => {
		if (disabled && nextOpen) return;
		if (!controlledOpen) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [
		controlledOpen,
		disabled,
		onOpenChange
	]);
	const updateValue = (0, import_react.useCallback)((nextValue) => {
		previousValueRef.current = nextValue;
		if (!controlledValue) setInternalValue(nextValue);
		if (multiple) onChange?.([...nextValue]);
		else onChange?.(nextValue);
	}, [
		controlledValue,
		multiple,
		onChange
	]);
	(0, import_react.useEffect)(() => {
		if (areSelectionsEqual(previousValueRef.current, selectedValue, multiple)) return;
		previousValueRef.current = selectedValue;
		if (controlledInputValue) return;
		const nextInputValue = multiple ? "" : selectedValues.length > 0 ? getValueLabel(selectedValues[0]) : "";
		changeInputValue(nextInputValue, "reset");
	}, [
		selectedValue,
		selectedValues,
		multiple,
		controlledInputValue,
		getValueLabel,
		changeInputValue
	]);
	const filteredOptions = (0, import_react.useMemo)(() => {
		const candidates = filterOptions ? filterOptions(options, resolvedInputValue) : filterAutocompleteOptions(options, resolvedInputValue);
		const visibleOptions = filterSelectedOptions ?? multiple ? candidates.filter((option) => !isOptionSelected(option)) : [...candidates];
		return maxOptions === void 0 ? visibleOptions : visibleOptions.slice(0, Math.max(0, maxOptions));
	}, [
		options,
		resolvedInputValue,
		filterOptions,
		filterSelectedOptions,
		multiple,
		isOptionSelected,
		maxOptions
	]);
	const navigationOptions = (0, import_react.useMemo)(() => filteredOptions.map((option) => ({
		...option,
		disabled: option.disabled === true || multiple && maxSelected !== void 0 && selectedValues.length >= maxSelected && !isOptionSelected(option)
	})), [
		filteredOptions,
		multiple,
		maxSelected,
		selectedValues.length,
		isOptionSelected
	]);
	const groupedOptions = (0, import_react.useMemo)(() => groupAutocompleteOptions(filteredOptions), [filteredOptions]);
	const findEnabledIndex = (startIndex, direction, wrap = true) => findEnabledAutocompleteIndex(navigationOptions, startIndex, direction, wrap);
	const isRequiredSatisfied = selectedValues.length > 0 || freeSolo && resolvedInputValue.trim().length > 0;
	(0, import_react.useEffect)(() => {
		inputRef.current?.setCustomValidity(required && !disabled && !isRequiredSatisfied ? requiredMessage : "");
	}, [
		required,
		disabled,
		isRequiredSatisfied,
		requiredMessage
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			if (activeIndex !== -1) setActiveIndex(-1);
			return;
		}
		if (activeIndex >= 0 && (!navigationOptions[activeIndex] || navigationOptions[activeIndex].disabled)) {
			setActiveIndex(-1);
			return;
		}
		if (activeIndex === -1 && autoHighlight) {
			const firstIndex = findEnabledIndex(-1, 1, false);
			if (firstIndex !== -1) setActiveIndex(firstIndex);
		}
	}, [
		isOpen,
		activeIndex,
		navigationOptions,
		autoHighlight
	]);
	const activeOptionId = activeIndex >= 0 && navigationOptions[activeIndex] && !navigationOptions[activeIndex].disabled ? `${listboxId}-option-${activeIndex}` : void 0;
	(0, import_react.useEffect)(() => {
		if (!isOpen || !activeOptionId) return;
		(listboxRef.current?.ownerDocument.getElementById(activeOptionId))?.scrollIntoView?.({ block: "nearest" });
	}, [isOpen, activeOptionId]);
	const moveActive = (direction, amount = 1, wrap = true) => {
		let nextIndex = activeIndex;
		for (let step = 0; step < amount; step++) {
			const startIndex = nextIndex === -1 ? direction === 1 ? -1 : navigationOptions.length : nextIndex;
			const candidateIndex = findEnabledIndex(startIndex, direction, wrap);
			if (candidateIndex === -1) break;
			nextIndex = candidateIndex;
		}
		if (nextIndex !== -1) setActiveIndex(nextIndex);
	};
	const isAtSelectionLimit = (option) => multiple && maxSelected !== void 0 && selectedValues.length >= maxSelected && !isOptionSelected(option);
	const handleOptionSelect = (option) => {
		if (disabled || option.disabled || isAtSelectionLimit(option)) return;
		if (multiple) {
			const nextValues = isOptionSelected(option) ? selectedValues.filter((selected) => !isEqual(option, selected)) : [...selectedValues, option.value];
			updateValue(nextValues);
			changeInputValue("", "select");
			if (closeOnSelect) changeOpenState(false);
			else {
				setActiveIndex(-1);
				changeOpenState(true);
			}
		} else {
			updateValue(option.value);
			changeInputValue(option.label, "select");
			changeOpenState(false);
		}
		inputRef.current?.focus({ preventScroll: true });
	};
	const handleFreeSoloCommit = () => {
		const nextValue = resolvedInputValue.trim();
		if (!freeSolo || !nextValue || disabled || readOnly) return;
		if (multiple) {
			if (maxSelected !== void 0 && selectedValues.length >= maxSelected) return;
			if (!selectedValues.some((selected) => selected === nextValue)) updateValue([...selectedValues, nextValue]);
			changeInputValue("", "select");
			if (closeOnSelect) changeOpenState(false);
			else setActiveIndex(-1);
		} else {
			updateValue(nextValue);
			changeInputValue(nextValue, "select");
			changeOpenState(false);
		}
	};
	const handleClear = () => {
		if (disabled || readOnly) return;
		updateValue(multiple ? [] : void 0);
		changeInputValue("", "clear");
		setActiveIndex(-1);
		inputRef.current?.focus({ preventScroll: true });
	};
	const handleRemoveSelected = (selectedIndex) => {
		if (!multiple || disabled || readOnly) return;
		const nextValues = selectedValues.filter((_, index) => index !== selectedIndex);
		updateValue(nextValues);
		inputRef.current?.focus({ preventScroll: true });
	};
	const handleInputChange = (event) => {
		if (readOnly) return;
		changeInputValue(event.currentTarget.value, "input");
		setActiveIndex(-1);
		changeOpenState(true);
	};
	const handleInputFocus = (event) => {
		onFocus?.(event);
		if (openOnFocus && !disabled) {
			setActiveIndex(-1);
			changeOpenState(true);
		}
	};
	const handleInputBlur = (event) => {
		onBlur?.(event);
	};
	const handleControlBlur = (event) => {
		const relatedTarget = event.relatedTarget;
		if (relatedTarget && event.currentTarget.contains(relatedTarget)) return;
		changeOpenState(false);
		if (clearOnBlur) {
			const nextInputValue = multiple ? "" : selectedValues.length > 0 ? getValueLabel(selectedValues[0]) : "";
			changeInputValue(nextInputValue, "reset");
		}
	};
	const handleInputKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled || event.nativeEvent.isComposing) return;
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				if (!isOpen) {
					setActiveIndex(findEnabledIndex(-1, 1, false));
					changeOpenState(true);
				} else moveActive(1);
				return;
			case "ArrowUp":
				event.preventDefault();
				if (!isOpen) {
					setActiveIndex(findEnabledIndex(navigationOptions.length, -1, false));
					changeOpenState(true);
				} else moveActive(-1);
				return;
			case "Home":
				if (isOpen) {
					event.preventDefault();
					setActiveIndex(findEnabledIndex(-1, 1, false));
				}
				return;
			case "End":
				if (isOpen) {
					event.preventDefault();
					setActiveIndex(findEnabledIndex(navigationOptions.length, -1, false));
				}
				return;
			case "PageDown":
				if (isOpen) {
					event.preventDefault();
					moveActive(1, 10, false);
				}
				return;
			case "PageUp":
				if (isOpen) {
					event.preventDefault();
					moveActive(-1, 10, false);
				}
				return;
			case "Enter":
				if (isOpen && activeIndex >= 0) {
					const option = filteredOptions[activeIndex];
					if (option && !navigationOptions[activeIndex]?.disabled) {
						event.preventDefault();
						handleOptionSelect(option);
						return;
					}
				}
				if (freeSolo && resolvedInputValue.trim()) {
					const normalizedInput = normalizeAutocompleteText(resolvedInputValue.trim());
					const exactMatch = filteredOptions.find((option, index) => !navigationOptions[index]?.disabled && normalizeAutocompleteText(option.label) === normalizedInput);
					event.preventDefault();
					if (exactMatch) handleOptionSelect(exactMatch);
					else handleFreeSoloCommit();
				}
				return;
			case "Escape":
				if (isOpen) {
					event.preventDefault();
					event.stopPropagation();
					changeOpenState(false);
					const nextInputValue = multiple ? "" : selectedValues.length > 0 ? getValueLabel(selectedValues[0]) : "";
					changeInputValue(nextInputValue, "reset");
				} else if (clearOnEscape && (selectedValues.length > 0 || resolvedInputValue)) {
					event.preventDefault();
					handleClear();
				}
				return;
			case "Tab":
				changeOpenState(false);
				return;
			case "Backspace":
				if (multiple && !readOnly && resolvedInputValue.length === 0 && selectedValues.length > 0) {
					event.preventDefault();
					handleRemoveSelected(selectedValues.length - 1);
				}
				return;
			default: return;
		}
	};
	const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : void 0);
	const resolvedDescribedBy = [
		ariaDescribedBy,
		description != null ? descriptionId : void 0,
		hasError ? errorId : void 0
	].filter(Boolean).join(" ") || void 0;
	const hasClearableValue = selectedValues.length > 0 || resolvedInputValue.length > 0;
	const formValues = selectedValues.length > 0 ? selectedValues : freeSolo && resolvedInputValue.trim() ? [resolvedInputValue.trim()] : [];
	const renderOptionElement = (option, index) => {
		const selected = isOptionSelected(option);
		const active = activeIndex === index;
		const optionDisabled = navigationOptions[index]?.disabled ?? false;
		const state = {
			selected,
			active,
			disabled: optionDisabled,
			multiple
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: `${listboxId}-option-${index}`,
			className: cn("puzzle-autocomplete__option", optionClassName),
			role: "option",
			"aria-label": option.label,
			"aria-describedby": !renderOption && option.description != null ? `${listboxId}-description-${index}` : void 0,
			"aria-selected": selected,
			"aria-disabled": optionDisabled || void 0,
			"aria-posinset": index + 1,
			"aria-setsize": filteredOptions.length,
			"data-active": active || void 0,
			"data-disabled": optionDisabled || void 0,
			onMouseDown: (event) => event.preventDefault(),
			onMouseMove: () => {
				if (!optionDisabled) setActiveIndex(index);
			},
			onClick: () => handleOptionSelect(option),
			children: renderOption ? renderOption(option, state) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "puzzle-autocomplete__option-content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-autocomplete__option-label",
					children: option.label
				}), option.description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: `${listboxId}-description-${index}`,
					className: "puzzle-autocomplete__option-description",
					children: option.description
				})]
			})
		}, option.id ?? index);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-autocomplete", className),
		"data-size-mobile": responsiveSize.mobile,
		"data-size-tablet": responsiveSize.tablet,
		"data-size-desktop": responsiveSize.desktop,
		"data-full-width-mobile": String(responsiveFullWidth.mobile),
		"data-full-width-tablet": String(responsiveFullWidth.tablet),
		"data-full-width-desktop": String(responsiveFullWidth.desktop),
		"data-open": isOpen || void 0,
		"data-invalid": isInvalid || void 0,
		"data-disabled": disabled || void 0,
		"data-multiple": multiple || void 0,
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				id: labelId,
				htmlFor: inputId,
				className: "puzzle-autocomplete__label",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-autocomplete__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popout, {
				trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-autocomplete__anchor",
					onClick: (event) => {
						if (disabled) {
							event.preventDefault();
							return;
						}
						if (!isOpen && autoHighlight) setActiveIndex(findEnabledIndex(-1, 1, false));
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "puzzle-autocomplete__control",
						onBlur: handleControlBlur,
						"data-disabled": disabled || void 0,
						children: [
							multiple && selectedValues.map((selected, index) => {
								const valueLabel = getValueLabel(selected);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "puzzle-autocomplete__tag",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-autocomplete__tag-label",
										children: valueLabel
									}), !disabled && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "puzzle-autocomplete__tag-remove",
										"aria-label": `${removeOptionLabel} ${valueLabel}`,
										onMouseDown: (event) => event.preventDefault(),
										onClick: () => handleRemoveSelected(index),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "×"
										})
									})]
								}, `${String(selected)}-${index}`);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								...inputProps,
								ref: handleInputRef,
								id: inputId,
								type: "text",
								role: "combobox",
								"aria-autocomplete": "list",
								"aria-haspopup": "listbox",
								"aria-expanded": isOpen,
								"aria-controls": isOpen ? listboxId : void 0,
								"aria-activedescendant": activeOptionId,
								"aria-label": ariaLabel,
								"aria-labelledby": resolvedLabelledBy,
								"aria-describedby": resolvedDescribedBy,
								"aria-invalid": isInvalid ? true : ariaInvalid,
								"aria-required": required || void 0,
								"aria-readonly": readOnly || void 0,
								autoComplete,
								placeholder,
								value: resolvedInputValue,
								disabled,
								readOnly,
								required: required && !multiple && !isRequiredSatisfied,
								className: cn("puzzle-autocomplete__input", inputClassName),
								onChange: handleInputChange,
								onFocus: handleInputFocus,
								onBlur: handleInputBlur,
								onKeyDown: handleInputKeyDown
							}),
							clearable && hasClearableValue && !disabled && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "puzzle-autocomplete__clear",
								"aria-label": clearLabel,
								onMouseDown: (event) => event.preventDefault(),
								onClick: handleClear,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "×"
								})
							})
						]
					})
				}),
				action: "click",
				open: isOpen,
				onOpenChange: changeOpenState,
				position,
				align,
				offset,
				collisionPadding,
				matchTriggerWidth,
				closeOnOutsideClick: true,
				closeOnEscape: true,
				contentClassName: cn("puzzle-autocomplete__popover", popoverClassName),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: listboxRef,
					id: listboxId,
					className: cn("puzzle-autocomplete__listbox", menuClassName),
					role: "listbox",
					"aria-label": resolvedLabelledBy ? void 0 : ariaLabel,
					"aria-labelledby": resolvedLabelledBy,
					"aria-multiselectable": multiple || void 0,
					style: { maxHeight: menuMaxHeight },
					children: groupedOptions.map((group, groupIndex) => {
						const renderedOptions = group.options.map(({ option, index }) => renderOptionElement(option, index));
						if (group.label === null) return renderedOptions;
						const groupId = `${listboxId}-group-${groupIndex}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-autocomplete__group",
							role: "group",
							"aria-labelledby": groupId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								id: groupId,
								className: "puzzle-autocomplete__group-label",
								children: group.label
							}), renderedOptions]
						}, groupId);
					})
				}), filteredOptions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-autocomplete__empty",
					role: "status",
					"aria-live": "polite",
					children: loading ? loadingText : noOptionsText
				})]
			}),
			name && formValues.map((selected, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "puzzle-autocomplete__native",
				type: "hidden",
				name,
				form,
				value: serializeValue ? serializeValue(selected) : String(selected)
			}, `${String(selected)}-${index}`)),
			description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: descriptionId,
				className: "puzzle-autocomplete__description",
				children: description
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: errorId,
				className: "puzzle-autocomplete__error",
				"aria-live": "polite",
				"aria-atomic": "true",
				children: errorContent
			})
		]
	});
};
var isValidDate = (date) => date instanceof Date && Number.isFinite(date.getTime());
var startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
var startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
var addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
var addMonths = (date, amount) => {
	const day = date.getDate();
	const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
	return new Date(target.getFullYear(), target.getMonth(), Math.min(day, lastDay));
};
var addYears = (date, amount) => addMonths(date, amount * 12);
var toDateKey = (date) => {
	return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
var isSameDay = (first, second) => first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
var isSameMonth = (first, second) => first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
var getCalendarDays = (month, weekStartsOn) => {
	const firstDay = startOfMonth(month);
	const calendarStart = addDays(firstDay, -((firstDay.getDay() - weekStartsOn + 7) % 7));
	return Array.from({ length: 42 }, (_, index) => {
		const date = addDays(calendarStart, index);
		return {
			date,
			key: toDateKey(date),
			outsideMonth: !isSameMonth(date, month)
		};
	});
};
var getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
var sundayRegions = [
	"US",
	"CA",
	"JP",
	"KR",
	"TW",
	"TH",
	"PH",
	"BR",
	"CO",
	"MX"
];
var getLocaleWeekStartsOn = (locale) => {
	try {
		const Locale = Intl.Locale;
		if (Locale) {
			const localeInfo = new Locale(locale);
			const firstDay = localeInfo.getWeekInfo?.().firstDay ?? localeInfo.weekInfo?.firstDay;
			if (firstDay !== void 0) return firstDay % 7;
		}
	} catch {
		const region = locale.split("-").find((part) => /^[A-Z]{2}$/.test(part));
		return region && sundayRegions.includes(region) ? 0 : 1;
	}
	return 0;
};
var getWeekdayDates = (weekStartsOn) => {
	const sunday = new Date(2024, 0, 7);
	return Array.from({ length: 7 }, (_, index) => addDays(sunday, weekStartsOn + index));
};
var EMPTY_DATES = [];
var normalizeDate = (date) => date && isValidDate(date) ? startOfDay(date) : null;
var findDateFromInput = (value) => {
	if (!value) return null;
	const [year, month, day] = value.split("-").map(Number);
	if (!year || !month || !day) return null;
	const date = new Date(year, month - 1, day);
	return isValidDate(date) && toDateKey(date) === value ? date : null;
};
var DatePicker = ({ value, defaultValue, onChange, label, placeholder = "Select date", description, error, disabled = false, required = false, clearable = false, clearLabel = "Clear date", name, form, minDate, maxDate, disabledDates = EMPTY_DATES, shouldDisableDate, locale, weekStartsOn, dateFormat, size = "md", fullWidth = false, open, defaultOpen = false, onOpenChange, position = "bottom", align = "start", offset = 8, collisionPadding = 8, calendarLabel = "Choose date", previousMonthLabel = "Previous month", nextMonthLabel = "Next month", rootClassName, popoverClassName, id, className, style, onClick, onKeyDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, dir, ...buttonProps }) => {
	const baseId = (0, import_react.useId)();
	const triggerId = id ?? `${baseId}-trigger`;
	const labelId = `${baseId}-label`;
	const descriptionId = `${baseId}-description`;
	const errorId = `${baseId}-error`;
	const calendarId = `${baseId}-calendar`;
	const gridId = `${baseId}-grid`;
	const triggerRef = (0, import_react.useRef)(null);
	const calendarGridRef = (0, import_react.useRef)(null);
	const nativeInputRef = (0, import_react.useRef)(null);
	const isControlledValue = value !== void 0;
	const isControlledOpen = open !== void 0;
	const initialValue = normalizeDate(value !== void 0 ? value : defaultValue);
	const [today] = (0, import_react.useState)(() => startOfDay(/* @__PURE__ */ new Date()));
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => normalizeDate(defaultValue));
	const selectedDate = isControlledValue ? normalizeDate(value) : internalValue;
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const isOpen = open ?? internalOpen;
	const [viewDate, setViewDate] = (0, import_react.useState)(() => startOfMonth(initialValue ?? today));
	const [activeDate, setActiveDate] = (0, import_react.useState)(() => initialValue ?? today);
	const resolvedLocale = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
	const resolvedWeekStartsOn = weekStartsOn ?? getLocaleWeekStartsOn(resolvedLocale);
	const responsiveSize = resolveResponsiveValue(size, "md");
	const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);
	const normalizedMinDate = (0, import_react.useMemo)(() => normalizeDate(minDate), [minDate]);
	const normalizedMaxDate = (0, import_react.useMemo)(() => normalizeDate(maxDate), [maxDate]);
	const disabledDateKeys = (0, import_react.useMemo)(() => new Set(disabledDates.filter(isValidDate).map((date) => toDateKey(startOfDay(date)))), [disabledDates]);
	const selectedKey = selectedDate ? toDateKey(selectedDate) : "";
	const minDateKey = normalizedMinDate ? toDateKey(normalizedMinDate) : void 0;
	const maxDateKey = normalizedMaxDate ? toDateKey(normalizedMaxDate) : void 0;
	const dateFormatter = (0, import_react.useMemo)(() => new Intl.DateTimeFormat(resolvedLocale, dateFormat ?? {
		day: "numeric",
		month: "long",
		year: "numeric"
	}), [resolvedLocale, dateFormat]);
	const accessibleDateFormatter = (0, import_react.useMemo)(() => new Intl.DateTimeFormat(resolvedLocale, {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}), [resolvedLocale]);
	const monthFormatter = (0, import_react.useMemo)(() => new Intl.DateTimeFormat(resolvedLocale, {
		month: "long",
		year: "numeric"
	}), [resolvedLocale]);
	const weekdayFormatter = (0, import_react.useMemo)(() => new Intl.DateTimeFormat(resolvedLocale, { weekday: "short" }), [resolvedLocale]);
	const weekdayAccessibleFormatter = (0, import_react.useMemo)(() => new Intl.DateTimeFormat(resolvedLocale, { weekday: "long" }), [resolvedLocale]);
	const dayNumberFormatter = (0, import_react.useMemo)(() => new Intl.NumberFormat(resolvedLocale), [resolvedLocale]);
	const weekdayLabels = (0, import_react.useMemo)(() => getWeekdayDates(resolvedWeekStartsOn).map((date) => ({
		short: weekdayFormatter.format(date),
		long: weekdayAccessibleFormatter.format(date)
	})), [
		resolvedWeekStartsOn,
		weekdayFormatter,
		weekdayAccessibleFormatter
	]);
	const calendarDays = (0, import_react.useMemo)(() => getCalendarDays(viewDate, resolvedWeekStartsOn), [viewDate, resolvedWeekStartsOn]);
	const hasError = error !== void 0 && error !== null && error !== false;
	const isInvalid = hasError || ariaInvalid !== void 0 && ariaInvalid !== false && ariaInvalid !== "false";
	const resolvedAriaInvalid = isInvalid ? true : ariaInvalid;
	const errorContent = error === true ? "Invalid date" : error;
	const displayedValue = selectedDate ? dateFormatter.format(selectedDate) : placeholder;
	const monthLabel = monthFormatter.format(viewDate);
	const isDateDisabled = (0, import_react.useCallback)((date) => {
		const normalized = startOfDay(date);
		if (!isValidDate(normalized) || normalizedMinDate && normalizedMaxDate && normalizedMinDate > normalizedMaxDate) return true;
		if (normalizedMinDate && normalized < normalizedMinDate) return true;
		if (normalizedMaxDate && normalized > normalizedMaxDate) return true;
		if (disabledDateKeys.has(toDateKey(normalized))) return true;
		return shouldDisableDate?.(normalized) === true;
	}, [
		normalizedMinDate,
		normalizedMaxDate,
		disabledDateKeys,
		shouldDisableDate
	]);
	/**
	* Search in one direction for the next selectable date.
	* The search stops immediately when it reaches a hard date boundary.
	*/
	const findAvailableDate = (0, import_react.useCallback)((date, direction, maxDistance = 3660) => {
		if (normalizedMinDate && normalizedMaxDate && normalizedMinDate > normalizedMaxDate) return null;
		const base = startOfDay(date);
		for (let offset = 0; offset <= maxDistance; offset++) {
			const candidate = addDays(base, offset * direction);
			if (normalizedMinDate && candidate < normalizedMinDate) {
				if (direction === -1) return null;
				continue;
			}
			if (normalizedMaxDate && candidate > normalizedMaxDate) {
				if (direction === 1) return null;
				continue;
			}
			if (!isDateDisabled(candidate)) return candidate;
		}
		return null;
	}, [
		normalizedMinDate,
		normalizedMaxDate,
		isDateDisabled
	]);
	/**
	* Find the closest selectable date around a starting point.
	* Prefer the future when both dates are equally distant.
	*/
	const findNearestAvailableDate = (0, import_react.useCallback)((date) => {
		if (normalizedMinDate && normalizedMaxDate && normalizedMinDate > normalizedMaxDate) return null;
		let base = startOfDay(date);
		if (normalizedMinDate && base < normalizedMinDate) base = normalizedMinDate;
		if (normalizedMaxDate && base > normalizedMaxDate) base = normalizedMaxDate;
		for (let distance = 0; distance <= 3660; distance++) {
			const future = addDays(base, distance);
			if ((!normalizedMaxDate || future <= normalizedMaxDate) && !isDateDisabled(future)) return future;
			if (distance > 0) {
				const past = addDays(base, -distance);
				if ((!normalizedMinDate || past >= normalizedMinDate) && !isDateDisabled(past)) return past;
			}
		}
		return null;
	}, [
		normalizedMinDate,
		normalizedMaxDate,
		isDateDisabled
	]);
	const changeOpenState = (0, import_react.useCallback)((nextOpen) => {
		if (!isControlledOpen) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [isControlledOpen, onOpenChange]);
	const openCalendar = (0, import_react.useCallback)(() => {
		const initialDate = selectedDate && !isDateDisabled(selectedDate) ? selectedDate : findNearestAvailableDate(today);
		if (initialDate) {
			setActiveDate(initialDate);
			setViewDate(startOfMonth(initialDate));
		}
		changeOpenState(true);
	}, [
		selectedDate,
		today,
		isDateDisabled,
		findNearestAvailableDate,
		changeOpenState
	]);
	const updateValue = (0, import_react.useCallback)((nextDate) => {
		const normalized = normalizeDate(nextDate);
		if (normalized && isDateDisabled(normalized)) return;
		if (!isControlledValue) setInternalValue(normalized);
		onChange?.(normalized ? new Date(normalized.getTime()) : null);
	}, [
		isControlledValue,
		isDateDisabled,
		onChange
	]);
	const selectDate = (0, import_react.useCallback)((date) => {
		const normalized = startOfDay(date);
		if (disabled || isDateDisabled(normalized)) return;
		setActiveDate(normalized);
		setViewDate(startOfMonth(normalized));
		updateValue(normalized);
		changeOpenState(false);
		triggerRef.current?.focus({ preventScroll: true });
	}, [
		disabled,
		isDateDisabled,
		updateValue,
		changeOpenState
	]);
	const clearDate = (0, import_react.useCallback)(() => {
		if (disabled || required || !selectedDate) return;
		updateValue(null);
		changeOpenState(false);
		triggerRef.current?.focus({ preventScroll: true });
	}, [
		disabled,
		required,
		selectedDate,
		updateValue,
		changeOpenState
	]);
	const changeMonth = (0, import_react.useCallback)((amount) => {
		const nextMonth = addMonths(viewDate, amount);
		const candidate = addMonths(activeDate, amount);
		const availableDate = findNearestAvailableDate(candidate);
		setViewDate(startOfMonth(availableDate ?? nextMonth));
		if (availableDate) setActiveDate(availableDate);
	}, [
		viewDate,
		activeDate,
		findNearestAvailableDate
	]);
	const isPreviousMonthDisabled = normalizedMinDate !== null && normalizedMinDate !== void 0 && getLastDayOfMonth(addMonths(viewDate, -1)) < normalizedMinDate;
	const isNextMonthDisabled = normalizedMaxDate !== null && normalizedMaxDate !== void 0 && startOfMonth(addMonths(viewDate, 1)) > normalizedMaxDate;
	const handleTriggerClick = (event) => {
		onClick?.(event);
		if (event.defaultPrevented || disabled) return;
		event.preventDefault();
		if (isOpen) changeOpenState(false);
		else openCalendar();
	};
	const handleTriggerKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled) return;
		if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (!isOpen) openCalendar();
			return;
		}
	};
	const handleDayKeyDown = (event, date) => {
		if (event.defaultPrevented) return;
		const computedDirection = triggerRef.current?.ownerDocument.defaultView?.getComputedStyle(triggerRef.current).direction;
		const direction = dir === "rtl" || dir !== "ltr" && computedDirection === "rtl" ? -1 : 1;
		let candidate = null;
		let searchDirection = 1;
		let searchDistance = 3660;
		switch (event.key) {
			case "ArrowLeft":
				candidate = addDays(date, -direction);
				searchDirection = -direction;
				break;
			case "ArrowRight":
				candidate = addDays(date, direction);
				searchDirection = direction;
				break;
			case "ArrowUp":
				candidate = addDays(date, -7);
				searchDirection = -1;
				break;
			case "ArrowDown":
				candidate = addDays(date, 7);
				searchDirection = 1;
				break;
			case "Home":
				candidate = addDays(date, -((date.getDay() - resolvedWeekStartsOn + 7) % 7));
				searchDirection = 1;
				searchDistance = 6;
				break;
			case "End":
				candidate = addDays(date, 6 - (date.getDay() - resolvedWeekStartsOn + 7) % 7);
				searchDirection = -1;
				searchDistance = 6;
				break;
			case "PageUp":
				candidate = event.shiftKey ? addYears(date, -1) : addMonths(date, -1);
				searchDirection = -1;
				break;
			case "PageDown":
				candidate = event.shiftKey ? addYears(date, 1) : addMonths(date, 1);
				searchDirection = 1;
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				selectDate(date);
				return;
			default: return;
		}
		if (!candidate) return;
		const nextDate = findAvailableDate(candidate, searchDirection, searchDistance);
		event.preventDefault();
		if (!nextDate) return;
		setActiveDate(nextDate);
		setViewDate(startOfMonth(nextDate));
	};
	const handleNativeChange = (event) => {
		updateValue(findDateFromInput(event.currentTarget.value));
	};
	const handleNativeInvalid = (event) => {
		event.preventDefault();
		triggerRef.current?.focus({ preventScroll: true });
	};
	(0, import_react.useEffect)(() => {
		if (!selectedDate) return;
		setActiveDate(selectedDate);
		setViewDate(startOfMonth(selectedDate));
	}, [selectedKey]);
	(0, import_react.useEffect)(() => {
		const input = nativeInputRef.current;
		if (!input) return;
		const invalidSelection = selectedDate !== null && isDateDisabled(selectedDate);
		input.setCustomValidity(invalidSelection ? "Please select an available date." : "");
	}, [
		selectedKey,
		isDateDisabled,
		selectedDate
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const ownerDocument = triggerRef.current?.ownerDocument;
		const ownerWindow = ownerDocument?.defaultView;
		if (!ownerDocument || !ownerWindow) return;
		let focusDate = activeDate;
		if (isDateDisabled(focusDate)) {
			const nearestDate = findNearestAvailableDate(focusDate);
			if (nearestDate) {
				focusDate = nearestDate;
				setActiveDate(nearestDate);
				setViewDate(startOfMonth(nearestDate));
			} else {
				calendarGridRef.current?.focus({ preventScroll: true });
				return;
			}
		}
		const focusActiveDate = () => {
			ownerDocument.getElementById(`${gridId}-day-${toDateKey(focusDate)}`)?.focus({ preventScroll: true });
		};
		if (typeof ownerWindow.requestAnimationFrame === "function") {
			const frame = ownerWindow.requestAnimationFrame(focusActiveDate);
			return () => {
				ownerWindow.cancelAnimationFrame(frame);
			};
		}
		focusActiveDate();
	}, [
		isOpen,
		activeDate,
		gridId,
		isDateDisabled,
		findNearestAvailableDate
	]);
	const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : void 0);
	const resolvedDescribedBy = [
		ariaDescribedBy,
		description != null ? descriptionId : void 0,
		hasError ? errorId : void 0
	].filter(Boolean).join(" ") || void 0;
	const triggerElement = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		...buttonProps,
		ref: triggerRef,
		id: triggerId,
		type: "button",
		disabled,
		dir,
		style,
		className: cn("puzzle-date-picker__trigger", className),
		onClick: handleTriggerClick,
		onKeyDown: handleTriggerKeyDown,
		"aria-label": ariaLabel,
		"aria-labelledby": resolvedLabelledBy,
		"aria-describedby": resolvedDescribedBy,
		"aria-haspopup": "dialog",
		"aria-expanded": isOpen,
		"aria-controls": isOpen ? calendarId : void 0,
		"aria-required": required || void 0,
		"aria-invalid": resolvedAriaInvalid,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("puzzle-date-picker__value", !selectedDate && "puzzle-date-picker__placeholder"),
			children: displayedValue
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-date-picker__calendar-icon",
			"aria-hidden": "true"
		})]
	});
	const calendarHasEnabledDate = calendarDays.some(({ date }) => !isDateDisabled(date));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-date-picker", rootClassName),
		"data-open": isOpen ? "true" : "false",
		"data-disabled": disabled ? "true" : void 0,
		"data-invalid": isInvalid ? "true" : void 0,
		"data-size-mobile": responsiveSize.mobile,
		"data-size-tablet": responsiveSize.tablet,
		"data-size-desktop": responsiveSize.desktop,
		"data-full-width-mobile": String(responsiveFullWidth.mobile),
		"data-full-width-tablet": String(responsiveFullWidth.tablet),
		"data-full-width-desktop": String(responsiveFullWidth.desktop),
		lang: resolvedLocale,
		dir,
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				id: labelId,
				htmlFor: triggerId,
				className: "puzzle-date-picker__label",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-date-picker__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-date-picker__control",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
					trigger: triggerElement,
					open: isOpen,
					onOpenChange: changeOpenState,
					action: "click",
					position,
					align,
					offset,
					collisionPadding,
					contentClassName: cn("puzzle-date-picker__popover", popoverClassName),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: calendarId,
						className: "puzzle-date-picker__calendar",
						role: "dialog",
						"aria-label": calendarLabel,
						lang: resolvedLocale,
						dir,
						onKeyDown: (event) => {
							if (event.key === "Tab") {
								changeOpenState(false);
								triggerRef.current?.focus({ preventScroll: true });
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "puzzle-date-picker__header",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "puzzle-date-picker__navigation",
										"aria-label": `${previousMonthLabel}: ${monthFormatter.format(addMonths(viewDate, -1))}`,
										disabled: disabled || isPreviousMonthDisabled,
										onClick: () => changeMonth(-1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "‹"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										id: `${calendarId}-month`,
										className: "puzzle-date-picker__month",
										"aria-live": "polite",
										"aria-atomic": "true",
										children: monthLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "puzzle-date-picker__navigation",
										"aria-label": `${nextMonthLabel}: ${monthFormatter.format(addMonths(viewDate, 1))}`,
										disabled: disabled || isNextMonthDisabled,
										onClick: () => changeMonth(1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "›"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								ref: calendarGridRef,
								id: gridId,
								className: "puzzle-date-picker__grid",
								role: "grid",
								"aria-labelledby": `${calendarId}-month`,
								tabIndex: calendarHasEnabledDate ? -1 : 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									role: "row",
									children: weekdayLabels.map((weekday, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										scope: "col",
										role: "columnheader",
										"aria-label": weekday.long,
										children: weekday.short
									}, index))
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Array.from({ length: 6 }, (_, weekIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									role: "row",
									children: calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ date, key, outsideMonth }) => {
										const selected = selectedDate !== null && isSameDay(date, selectedDate);
										const isToday = isSameDay(date, today);
										const isActive = isSameDay(date, activeDate);
										const dayDisabled = disabled || isDateDisabled(date);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											role: "gridcell",
											"aria-selected": selected || void 0,
											className: "puzzle-date-picker__cell",
											"data-outside-month": outsideMonth || void 0,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												id: `${gridId}-day-${key}`,
												className: "puzzle-date-picker__day",
												disabled: dayDisabled,
												tabIndex: isActive && !dayDisabled ? 0 : -1,
												"aria-label": accessibleDateFormatter.format(date),
												"aria-current": isToday ? "date" : void 0,
												"data-selected": selected || void 0,
												"data-today": isToday || void 0,
												"data-outside-month": outsideMonth || void 0,
												"data-active": isActive || void 0,
												onFocus: () => {
													setActiveDate(date);
													if (!isSameMonth(date, viewDate)) setViewDate(startOfMonth(date));
												},
												onKeyDown: (event) => handleDayKeyDown(event, date),
												onClick: () => selectDate(date),
												children: dayNumberFormatter.format(date.getDate())
											})
										}, key);
									})
								}, weekIndex)) })]
							}),
							!calendarHasEnabledDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "puzzle-date-picker__empty",
								role: "status",
								children: "No available dates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "puzzle-date-picker__footer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "puzzle-date-picker__today",
									disabled: disabled || isDateDisabled(today),
									onClick: () => selectDate(today),
									children: "Today"
								})
							})
						]
					})
				}), clearable && selectedDate && !required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "puzzle-date-picker__clear",
					disabled,
					"aria-label": clearLabel,
					onClick: clearDate,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "×"
					})
				})]
			}),
			description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: descriptionId,
				className: "puzzle-date-picker__description",
				children: description
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: errorId,
				className: "puzzle-date-picker__error",
				role: "alert",
				children: errorContent
			}),
			(name !== null || required) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: nativeInputRef,
				className: "puzzle-date-picker__native",
				type: "date",
				name: name ?? void 0,
				form,
				value: selectedKey,
				min: minDateKey,
				max: maxDateKey,
				disabled,
				required,
				tabIndex: -1,
				"aria-hidden": "true",
				onChange: handleNativeChange,
				onInvalid: handleNativeInvalid
			})
		]
	});
};
var formatFileSize = (bytes) => {
	if (bytes === 0) return "0 B";
	if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	];
	const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / 1024 ** index;
	return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};
var matchesMimeType = (fileType, acceptedTypes) => {
	const normalizedType = fileType.split(";")[0].trim().toLowerCase();
	if (!normalizedType) return false;
	return acceptedTypes.some((acceptedType) => {
		const accepted = acceptedType.trim().toLowerCase();
		if (!accepted) return false;
		if (accepted.endsWith("/*")) return normalizedType.startsWith(accepted.slice(0, -1));
		return normalizedType === accepted;
	});
};
var createRejection = (file, code, message) => ({
	file,
	code,
	message
});
var validateFile = (file, options) => {
	const { accept = [], maxFileSize } = options;
	if (accept.length > 0 && !matchesMimeType(file.type, accept)) return createRejection(file, "file-type", "This file type is not allowed.");
	if (maxFileSize !== void 0 && file.size > maxFileSize) return createRejection(file, "file-too-large", `File exceeds the maximum size of ${formatFileSize(maxFileSize)}.`);
};
var validateFiles = (incomingFiles, existingFiles, options = {}) => {
	const { multiple = false, maxFiles, maxTotalSize } = options;
	const accepted = [];
	const rejected = [];
	const currentFiles = multiple ? [...existingFiles] : [];
	let totalSize = currentFiles.reduce((total, file) => total + file.size, 0);
	let fileCount = currentFiles.length;
	incomingFiles.forEach((file) => {
		const validationError = validateFile(file, options);
		if (validationError) {
			rejected.push(validationError);
			return;
		}
		if (!multiple && accepted.length > 0) {
			rejected.push(createRejection(file, "too-many-files", "Only one file can be selected."));
			return;
		}
		if (multiple && maxFiles !== void 0 && fileCount >= maxFiles) {
			rejected.push(createRejection(file, "too-many-files", `You can select a maximum of ${maxFiles} files.`));
			return;
		}
		if (maxTotalSize !== void 0 && totalSize + file.size > maxTotalSize) {
			rejected.push(createRejection(file, "total-too-large", `The combined file size exceeds ${formatFileSize(maxTotalSize)}.`));
			return;
		}
		accepted.push(file);
		totalSize += file.size;
		fileCount++;
	});
	return {
		accepted,
		rejected
	};
};
var FileUpload = ({ accept = [], multiple = false, maxFiles, maxFileSize, maxTotalSize, name, required = false, disabled = false, title = "Drop files here", description = "Drag and drop your files here or browse to select them.", browseLabel = "Browse files", onChange, onReject, onUpload, className, style, id, ref, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? generatedId;
	const descriptionId = `${generatedId}-description`;
	const inputRef = (0, import_react.useRef)(null);
	const itemIdRef = (0, import_react.useRef)(0);
	const itemsRef = (0, import_react.useRef)([]);
	const controllersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const dragDepthRef = (0, import_react.useRef)(0);
	const [items, setItems] = (0, import_react.useState)([]);
	const [rejections, setRejections] = (0, import_react.useState)([]);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [dragRejected, setDragRejected] = (0, import_react.useState)(false);
	const acceptAttribute = accept.join(",");
	const commitItems = (0, import_react.useCallback)((nextItems) => {
		itemsRef.current = nextItems;
		setItems(nextItems);
		onChange?.(nextItems.map((item) => item.file));
	}, [onChange]);
	const updateItem = (0, import_react.useCallback)((id, update) => {
		const nextItems = itemsRef.current.map((item) => item.id === id ? {
			...item,
			...update
		} : item);
		itemsRef.current = nextItems;
		setItems(nextItems);
	}, []);
	const uploadItem = (0, import_react.useCallback)(async (id, file) => {
		if (!onUpload) return;
		controllersRef.current.get(id)?.abort();
		const controller = new AbortController();
		controllersRef.current.set(id, controller);
		updateItem(id, {
			status: "uploading",
			progress: 0,
			error: void 0
		});
		try {
			await onUpload(file, {
				signal: controller.signal,
				onProgress: (progress) => {
					if (controller.signal.aborted) return;
					updateItem(id, { progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0 });
				}
			});
			if (controller.signal.aborted) return;
			updateItem(id, {
				status: "complete",
				progress: 100,
				error: void 0
			});
		} catch (error) {
			if (controller.signal.aborted) return;
			updateItem(id, {
				status: "error",
				error: error instanceof Error ? error.message : "Upload failed."
			});
		} finally {
			if (controllersRef.current.get(id) === controller) controllersRef.current.delete(id);
		}
	}, [onUpload, updateItem]);
	const addFiles = (0, import_react.useCallback)((incomingFiles) => {
		if (disabled || incomingFiles.length === 0) return;
		const existingItems = itemsRef.current;
		const result = validateFiles(incomingFiles, multiple ? existingItems.map((item) => item.file) : [], {
			accept,
			maxFileSize,
			maxTotalSize,
			maxFiles,
			multiple
		});
		setRejections(result.rejected);
		if (result.rejected.length > 0) onReject?.(result.rejected);
		if (result.accepted.length === 0) return;
		if (!multiple) existingItems.forEach((item) => {
			controllersRef.current.get(item.id)?.abort();
			controllersRef.current.delete(item.id);
		});
		const acceptedItems = result.accepted.map((file) => ({
			id: `${generatedId}-${++itemIdRef.current}`,
			file,
			status: onUpload ? "uploading" : "queued",
			progress: 0
		}));
		const nextItems = multiple ? [...existingItems, ...acceptedItems] : acceptedItems;
		commitItems(nextItems);
		acceptedItems.forEach((item) => {
			if (onUpload) uploadItem(item.id, item.file);
		});
	}, [
		accept,
		commitItems,
		disabled,
		generatedId,
		maxFileSize,
		maxFiles,
		maxTotalSize,
		multiple,
		onReject,
		onUpload,
		uploadItem
	]);
	const handleInputChange = (event) => {
		addFiles(Array.from(event.currentTarget.files ?? []));
		event.currentTarget.value = "";
	};
	const handleDragEnter = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (disabled) return;
		dragDepthRef.current++;
		if (dragDepthRef.current !== 1) return;
		setDragActive(true);
		const types = Array.from(event.dataTransfer.items).filter((item) => item.kind === "file").map((item) => item.type).filter(Boolean);
		const hasRejectedType = accept.length > 0 && types.some((type) => !matchesMimeType(type, accept));
		setDragRejected(hasRejectedType);
	};
	const handleDragLeave = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (disabled) return;
		dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
		if (dragDepthRef.current === 0) {
			setDragActive(false);
			setDragRejected(false);
		}
	};
	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!disabled) event.dataTransfer.dropEffect = "copy";
	};
	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		dragDepthRef.current = 0;
		setDragActive(false);
		setDragRejected(false);
		if (disabled) return;
		addFiles(Array.from(event.dataTransfer.files));
	};
	const handleKeyDown = (event) => {
		if (disabled || event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		inputRef.current?.click();
	};
	const removeFile = (id) => {
		controllersRef.current.get(id)?.abort();
		controllersRef.current.delete(id);
		const nextItems = itemsRef.current.filter((item) => item.id !== id);
		commitItems(nextItems);
	};
	const retryFile = (item) => {
		if (disabled || !onUpload) return;
		uploadItem(item.id, item.file);
	};
	const openFilePicker = () => {
		if (!disabled) inputRef.current?.click();
	};
	(0, import_react.useEffect)(() => {
		return () => {
			controllersRef.current.forEach((controller) => {
				controller.abort();
			});
			controllersRef.current.clear();
		};
	}, []);
	const currentTotalSize = items.reduce((total, item) => total + item.file.size, 0);
	const isDragRejected = dragActive && dragRejected;
	const resolvedDescription = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...rootProps,
		ref,
		className: cn("puzzle-file-upload", className),
		style,
		"data-disabled": disabled || void 0,
		"data-invalid": ariaInvalid || void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				id: inputId,
				className: "puzzle-file-upload__input",
				type: "file",
				name,
				accept: acceptAttribute || void 0,
				multiple,
				required,
				disabled,
				tabIndex: -1,
				"aria-hidden": "true",
				"aria-describedby": resolvedDescription,
				"aria-invalid": ariaInvalid,
				onChange: handleInputChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-file-upload__dropzone",
				role: "button",
				tabIndex: disabled ? -1 : 0,
				"aria-label": ariaLabel ?? title,
				"aria-describedby": resolvedDescription,
				"aria-disabled": disabled || void 0,
				"data-dragging": dragActive || void 0,
				"data-rejected": isDragRejected || void 0,
				onClick: openFilePicker,
				onKeyDown: handleKeyDown,
				onDragEnter: handleDragEnter,
				onDragLeave: handleDragLeave,
				onDragOver: handleDragOver,
				onDrop: handleDrop,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-file-upload__icon",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:upload-cloud" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-file-upload__title",
						children: isDragRejected ? "Unsupported file type" : dragActive ? "Drop your files here" : title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-file-upload__description",
						id: descriptionId,
						children: description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-file-upload__browse",
						children: browseLabel
					}),
					accept.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "puzzle-file-upload__hint",
						children: ["Accepted: ", accept.join(", ")]
					})
				]
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-file-upload__files",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "puzzle-file-upload__files-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Selected files (",
						items.length,
						")"
					] }), maxTotalSize !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						formatFileSize(currentTotalSize),
						" / ",
						formatFileSize(maxTotalSize)
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "puzzle-file-upload__list",
					"aria-label": "Selected files",
					"aria-live": "polite",
					"aria-relevant": "additions removals",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "puzzle-file-upload__item",
						"data-status": item.status,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "puzzle-file-upload__file-icon",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:file" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "puzzle-file-upload__file-content",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "puzzle-file-upload__file-header",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "puzzle-file-upload__filename",
											title: item.file.name,
											children: item.file.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "puzzle-file-upload__filesize",
											children: formatFileSize(item.file.size)
										})]
									}),
									item.status === "uploading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "puzzle-file-upload__progress",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinearProgress, {
											value: item.progress,
											showTrack: true,
											"aria-label": `Uploading ${item.file.name}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(item.progress), "%"] })]
									}),
									item.status === "queued" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-file-upload__status",
										children: "Ready to upload"
									}),
									item.status === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-file-upload__status puzzle-file-upload__status--success",
										role: "status",
										children: "Upload complete"
									}),
									item.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-file-upload__status puzzle-file-upload__status--error",
										role: "status",
										children: item.error ?? "Upload failed."
									})
								]
							}),
							item.status === "error" && onUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "puzzle-file-upload__retry",
								disabled,
								onClick: () => retryFile(item),
								"aria-label": `Retry upload of ${item.file.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:refresh-cw" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "puzzle-file-upload__remove",
								disabled,
								"aria-label": `Remove ${item.file.name}`,
								onClick: () => removeFile(item.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:x" })
							})
						]
					}, item.id))
				})]
			}),
			rejections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-file-upload__rejections",
				role: "alert",
				children: rejections.map((rejection, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "puzzle-file-upload__rejection",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:alert-circle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rejection.file.name }),
						" — ",
						rejection.message
					] })]
				}, `${rejection.file.name}-${index}`))
			})
		]
	});
};
var Label = ({ children, required = false, optional = false, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
	...props,
	className: cn("puzzle-label", className),
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-label__text",
			children
		}),
		required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-label__required",
			"aria-hidden": "true",
			children: "*"
		}),
		optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-label__optional",
			children: "Optional"
		})
	]
});
var resolveFormFieldState = ({ generatedId, controlId, childProps, description, error, invalid }) => {
	const resolvedControlId = controlId ?? (typeof childProps.id === "string" ? childProps.id : generatedId);
	const isInvalid = invalid ?? (error !== void 0 && error !== null && error !== false);
	const errorContent = error === true ? "Invalid value" : error;
	const hasError = isInvalid && errorContent !== void 0 && errorContent !== null;
	const descriptionId = description != null ? `${resolvedControlId}-description` : void 0;
	const errorId = hasError ? `${resolvedControlId}-error` : void 0;
	return {
		resolvedControlId,
		isInvalid,
		errorContent,
		hasError,
		descriptionId,
		errorId,
		describedBy: [
			typeof childProps["aria-describedby"] === "string" ? childProps["aria-describedby"] : void 0,
			descriptionId,
			errorId
		].filter(Boolean).join(" ") || void 0
	};
};
var FormField = ({ label, description, error, invalid, required = false, disabled = false, controlId, optional = false, className, children, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const child = children;
	const childProps = child.props;
	const { resolvedControlId, isInvalid, errorContent, hasError, descriptionId, errorId, describedBy } = resolveFormFieldState({
		generatedId,
		controlId,
		childProps,
		description,
		error,
		invalid
	});
	const control = (0, import_react.cloneElement)(child, {
		id: resolvedControlId,
		required: required || childProps.required === true,
		disabled: disabled || childProps.disabled === true,
		"aria-describedby": describedBy,
		"aria-invalid": isInvalid ? true : childProps["aria-invalid"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...rootProps,
		className: cn("puzzle-form-field", className),
		"data-invalid": isInvalid || void 0,
		"data-disabled": disabled || void 0,
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: resolvedControlId,
				required,
				optional,
				className: "puzzle-form-field__label",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-form-field__control",
				children: control
			}),
			description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: descriptionId,
				className: "puzzle-form-field__description",
				children: description
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: errorId,
				className: "puzzle-form-field__error",
				"aria-live": "polite",
				"aria-atomic": "true",
				children: errorContent
			})
		]
	});
};
var findEnabledIndex = (options, startIndex, direction, wrap = true) => {
	const length = options.length;
	for (let step = 1; step <= length; step++) {
		let index = startIndex + step * direction;
		if (wrap) index = (index + length) % length;
		else if (index < 0 || index >= length) break;
		if (!options[index].disabled) return index;
	}
	return -1;
};
var groupOptions = (options) => {
	const groups = /* @__PURE__ */ new Map();
	options.forEach((option, index) => {
		const label = option.group ?? null;
		let group = groups.get(label);
		if (!group) {
			group = {
				label,
				options: []
			};
			groups.set(label, group);
		}
		group.options.push({
			option,
			index
		});
	});
	return Array.from(groups.values());
};
var Select = (props) => {
	const { options, label, placeholder = "Select an option", description, error, disabled = false, required = false, clearable = false, clearLabel = "Clear selection", name, form, autoComplete, serializeValue, isOptionEqualToValue, renderValue, renderOption, size = "md", fullWidth = false, open, defaultOpen = false, onOpenChange, position = "bottom", align = "start", offset = 8, collisionPadding = 8, closeOnSelect: closeOnSelectProp, maxSelected, matchTriggerWidth = true, menuMaxHeight = "18rem", noOptionsText = "No options", rootClassName, popoverClassName, menuClassName, value, onChange, id, className, onClick, onKeyDown, onKeyUp, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...buttonProps } = props;
	const multiple = props.multiple === true;
	const controlledValue = Object.prototype.hasOwnProperty.call(props, "value");
	const controlledOpen = open !== void 0;
	const baseId = (0, import_react.useId)();
	const triggerId = id ?? `${baseId}-trigger`;
	const labelId = `${baseId}-label`;
	const descriptionId = `${baseId}-description`;
	const errorId = `${baseId}-error`;
	const listboxId = `${baseId}-listbox`;
	const triggerRef = (0, import_react.useRef)(null);
	const listboxRef = (0, import_react.useRef)(null);
	const typeaheadRef = (0, import_react.useRef)({
		query: "",
		timestamp: 0
	});
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => multiple ? props.defaultValue ?? [] : props.defaultValue);
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(-1);
	const [triggerWidth, setTriggerWidth] = (0, import_react.useState)(0);
	const selectedValue = controlledValue ? value : internalValue;
	const selectedValues = multiple ? selectedValue ?? [] : selectedValue === void 0 ? [] : [selectedValue];
	const isOpen = open ?? internalOpen;
	const hasSelection = selectedValues.length > 0;
	const hasError = error !== void 0 && error !== null && error !== false;
	const isInvalid = hasError || ariaInvalid !== void 0 && ariaInvalid !== false && ariaInvalid !== "false";
	const resolvedAriaInvalid = isInvalid ? hasError || ariaInvalid === true ? true : ariaInvalid : ariaInvalid;
	const errorContent = error === true ? "Invalid value" : error;
	const closeOnSelect = closeOnSelectProp ?? !multiple;
	const responsiveSize = resolveResponsiveValue(size, "md");
	const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);
	const groups = (0, import_react.useMemo)(() => groupOptions(options), [options]);
	const isEqual = (0, import_react.useCallback)((option, selected) => isOptionEqualToValue ? isOptionEqualToValue(option, selected) : Object.is(option.value, selected), [isOptionEqualToValue]);
	const selectedOptions = selectedValues.map((selected) => options.find((option) => isEqual(option, selected))).filter((option) => option !== void 0);
	const isSelected = (option) => selectedValues.some((selected) => isEqual(option, selected));
	const initialActiveIndex = (0, import_react.useCallback)((direction = 1) => {
		const selectedIndex = options.findIndex((option) => !option.disabled && selectedValues.some((selected) => isEqual(option, selected)));
		if (selectedIndex !== -1) return selectedIndex;
		return direction === 1 ? findEnabledIndex(options, -1, 1, false) : findEnabledIndex(options, options.length, -1, false);
	}, [
		options,
		selectedValues,
		isEqual
	]);
	const changeOpenState = (0, import_react.useCallback)((nextOpen) => {
		if (!controlledOpen) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [controlledOpen, onOpenChange]);
	const updateValue = (0, import_react.useCallback)((nextValue) => {
		if (!controlledValue) setInternalValue(nextValue);
		if (multiple) onChange?.([...nextValue]);
		else onChange?.(nextValue);
	}, [
		controlledValue,
		multiple,
		onChange
	]);
	const getSerializedValue = (0, import_react.useCallback)((selected) => serializeValue ? serializeValue(selected) : String(selected), [serializeValue]);
	const findTypeaheadMatch = (character, startIndex) => {
		if (options.length === 0) return -1;
		const now = Date.now();
		const previous = typeaheadRef.current;
		const query = now - previous.timestamp > 700 ? character : previous.query + character;
		typeaheadRef.current = {
			query,
			timestamp: now
		};
		const normalizedSearch = (query.length > 1 && Array.from(query).every((item) => item.toLowerCase() === query[0].toLowerCase()) ? character : query).toLocaleLowerCase();
		for (let offset = 1; offset <= options.length; offset++) {
			const index = (startIndex + offset + options.length) % options.length;
			const option = options[index];
			if (!option.disabled && option.label.toLocaleLowerCase().startsWith(normalizedSearch)) return index;
		}
		return -1;
	};
	const focusTrigger = () => {
		triggerRef.current?.focus({ preventScroll: true });
	};
	const handleOptionSelect = (option) => {
		if (disabled || option.disabled) return;
		const currentlySelected = isSelected(option);
		if (multiple) {
			if (!currentlySelected && maxSelected !== void 0 && selectedValues.length >= maxSelected) return;
			const nextValues = currentlySelected ? selectedValues.filter((selected) => !isEqual(option, selected)) : [...selectedValues, option.value];
			updateValue(nextValues);
		} else updateValue(option.value);
		if (closeOnSelect) {
			changeOpenState(false);
			focusTrigger();
		}
	};
	const handleClear = () => {
		if (!hasSelection || disabled) return;
		updateValue(multiple ? [] : void 0);
		focusTrigger();
	};
	const handleTriggerRef = (0, import_react.useCallback)((node) => {
		triggerRef.current = node;
	}, []);
	const handleListboxRef = (0, import_react.useCallback)((node) => {
		listboxRef.current = node;
	}, []);
	const handleTriggerClick = (event) => {
		onClick?.(event);
		if (event.defaultPrevented || disabled) return;
		event.preventDefault();
		if (!isOpen) setActiveIndex(initialActiveIndex());
		changeOpenState(!isOpen);
	};
	const handleTriggerKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled) return;
		if (isOpen) {
			handleComboboxKeyDown(event);
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setActiveIndex(initialActiveIndex(event.key === "ArrowUp" ? -1 : 1));
			changeOpenState(true);
			return;
		}
		if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
			const index = findTypeaheadMatch(event.key, activeIndex);
			if (index !== -1) {
				event.preventDefault();
				setActiveIndex(index);
				if (!isOpen) changeOpenState(true);
			}
		}
	};
	const handleTriggerKeyUp = (event) => {
		onKeyUp?.(event);
		if (event.key === " ") event.preventDefault();
	};
	const moveActive = (direction, amount = 1, wrap = true) => {
		let nextIndex = activeIndex;
		for (let step = 0; step < amount; step++) {
			const startIndex = nextIndex === -1 ? direction === 1 ? -1 : options.length : nextIndex;
			const next = findEnabledIndex(options, startIndex, direction, wrap);
			if (next === -1) break;
			nextIndex = next;
		}
		if (nextIndex !== -1) setActiveIndex(nextIndex);
	};
	const handleComboboxKeyDown = (event) => {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				moveActive(1);
				return;
			case "ArrowUp":
				event.preventDefault();
				moveActive(-1);
				return;
			case "Home":
				event.preventDefault();
				setActiveIndex(findEnabledIndex(options, -1, 1, false));
				return;
			case "End":
				event.preventDefault();
				setActiveIndex(findEnabledIndex(options, options.length, -1, false));
				return;
			case "PageDown":
				event.preventDefault();
				moveActive(1, 10, false);
				return;
			case "PageUp":
				event.preventDefault();
				moveActive(-1, 10, false);
				return;
			case "Enter":
			case " ":
				event.preventDefault();
				if (activeIndex >= 0 && options[activeIndex]) handleOptionSelect(options[activeIndex]);
				return;
			case "Escape":
				event.preventDefault();
				event.stopPropagation();
				changeOpenState(false);
				focusTrigger();
				return;
			case "Tab":
				changeOpenState(false);
				return;
		}
		if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			const index = findTypeaheadMatch(event.key, activeIndex);
			if (index !== -1) setActiveIndex(index);
		}
	};
	const handleNativeChange = (event) => {
		const serializedValues = new Set(Array.from(event.currentTarget.selectedOptions, (option) => option.value));
		const nextValues = options.filter((option) => serializedValues.has(getSerializedValue(option.value))).map((option) => option.value);
		updateValue(multiple ? nextValues : nextValues[0]);
	};
	(0, import_react.useEffect)(() => {
		if (isOpen && (activeIndex < 0 || !options[activeIndex] || options[activeIndex].disabled)) setActiveIndex(initialActiveIndex());
	}, [
		isOpen,
		activeIndex,
		options,
		initialActiveIndex
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || activeIndex < 0) return;
		(listboxRef.current?.ownerDocument.getElementById(`${listboxId}-option-${activeIndex}`))?.scrollIntoView({ block: "nearest" });
	}, [
		isOpen,
		activeIndex,
		listboxId
	]);
	(0, import_react.useLayoutEffect)(() => {
		if (!isOpen || !matchTriggerWidth) return;
		const trigger = triggerRef.current;
		const ownerWindow = trigger?.ownerDocument.defaultView;
		if (!trigger || !ownerWindow) return;
		const updateWidth = () => {
			setTriggerWidth(trigger.getBoundingClientRect().width);
		};
		updateWidth();
		const observer = new (ownerWindow.ResizeObserver ?? ResizeObserver)(updateWidth);
		observer.observe(trigger);
		ownerWindow.addEventListener("resize", updateWidth);
		return () => {
			observer.disconnect();
			ownerWindow.removeEventListener("resize", updateWidth);
		};
	}, [isOpen, matchTriggerWidth]);
	const activeOptionId = activeIndex >= 0 && options[activeIndex] && !options[activeIndex].disabled ? `${listboxId}-option-${activeIndex}` : void 0;
	const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : void 0);
	const resolvedDescribedBy = [
		ariaDescribedBy,
		description != null ? descriptionId : void 0,
		hasError ? errorId : void 0
	].filter(Boolean).join(" ") || void 0;
	const displayValue = hasSelection ? renderValue ? renderValue(multiple ? selectedOptions : selectedOptions[0]) : multiple ? selectedOptions.length ? selectedOptions.map((option) => option.label).join(", ") : selectedValues.map(String).join(", ") : selectedOptions[0]?.label ?? String(selectedValues[0]) : placeholder;
	const listboxStyle = {
		minWidth: matchTriggerWidth && triggerWidth > 0 ? triggerWidth : void 0,
		maxHeight: menuMaxHeight
	};
	const triggerElement = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		...buttonProps,
		ref: handleTriggerRef,
		id: triggerId,
		type: "button",
		role: "combobox",
		disabled,
		className: cn("puzzle-select__trigger", className),
		onClick: handleTriggerClick,
		onKeyDown: handleTriggerKeyDown,
		onKeyUp: handleTriggerKeyUp,
		"aria-label": ariaLabel,
		"aria-labelledby": resolvedLabelledBy,
		"aria-describedby": resolvedDescribedBy,
		"aria-autocomplete": "none",
		"aria-haspopup": "listbox",
		"aria-expanded": isOpen,
		"aria-controls": isOpen ? listboxId : void 0,
		"aria-activedescendant": isOpen ? activeOptionId : void 0,
		"aria-required": required || void 0,
		"aria-invalid": resolvedAriaInvalid,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("puzzle-select__value", !hasSelection && "puzzle-select__placeholder"),
			children: displayValue
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-select__icon",
			"aria-hidden": "true"
		})]
	});
	const renderOptionElement = ({ option, index }) => {
		const selected = isSelected(option);
		const active = activeIndex === index;
		const content = renderOption ? renderOption(option, {
			selected,
			active,
			multiple
		}) : option.description != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "puzzle-select__option-content",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-select__option-label",
				children: option.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				id: `${listboxId}-description-${index}`,
				className: "puzzle-select__option-description",
				children: option.description
			})]
		}) : option.label;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: `${listboxId}-option-${index}`,
			className: "puzzle-select__option",
			role: "option",
			"aria-label": option.label,
			"aria-selected": selected,
			"aria-disabled": option.disabled || void 0,
			"aria-describedby": !renderOption && option.description != null ? `${listboxId}-description-${index}` : void 0,
			"data-index": index,
			"data-active": active ? "true" : void 0,
			onPointerDown: (event) => event.preventDefault(),
			onPointerMove: (event) => {
				if (event.pointerType !== "touch" && !option.disabled) setActiveIndex(index);
			},
			onClick: () => handleOptionSelect(option),
			children: content
		}, option.id ?? index);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-select", rootClassName),
		"data-open": isOpen ? "true" : "false",
		"data-disabled": disabled ? "true" : void 0,
		"data-invalid": isInvalid ? "true" : void 0,
		"data-multiple": multiple ? "true" : void 0,
		"data-size-mobile": responsiveSize.mobile,
		"data-size-tablet": responsiveSize.tablet,
		"data-size-desktop": responsiveSize.desktop,
		"data-full-width-mobile": String(responsiveFullWidth.mobile),
		"data-full-width-tablet": String(responsiveFullWidth.tablet),
		"data-full-width-desktop": String(responsiveFullWidth.desktop),
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				id: labelId,
				htmlFor: triggerId,
				className: "puzzle-select__label",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-select__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-select__control",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
					trigger: triggerElement,
					open: isOpen,
					onOpenChange: changeOpenState,
					action: "click",
					position,
					align,
					offset,
					collisionPadding,
					contentClassName: cn("puzzle-select__popover", popoverClassName),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: handleListboxRef,
						id: listboxId,
						className: cn("puzzle-select__listbox", menuClassName),
						role: "listbox",
						"aria-label": label == null && ariaLabelledBy == null ? ariaLabel : void 0,
						"aria-labelledby": ariaLabelledBy ?? (label != null ? labelId : void 0),
						"aria-multiselectable": multiple || void 0,
						style: listboxStyle,
						children: options.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "puzzle-select__empty",
							role: "presentation",
							children: noOptionsText
						}) : groups.map((group) => group.label != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-select__group",
							role: "group",
							"aria-label": group.label,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "puzzle-select__group-label",
								"aria-hidden": "true",
								children: group.label
							}), group.options.map(renderOptionElement)]
						}, group.label) : group.options.map(renderOptionElement))
					})
				}), clearable && hasSelection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "puzzle-select__clear",
					disabled,
					"aria-label": clearLabel,
					onClick: (event) => {
						event.preventDefault();
						event.stopPropagation();
						handleClear();
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "×"
					})
				})]
			}),
			description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: descriptionId,
				className: "puzzle-select__description",
				children: description
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: errorId,
				className: "puzzle-select__error",
				role: "alert",
				children: errorContent
			}),
			name != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "puzzle-select__native",
				"aria-hidden": "true",
				tabIndex: -1,
				name,
				form,
				autoComplete,
				disabled,
				required,
				multiple,
				value: multiple ? selectedValues.map(getSerializedValue) : selectedValues.length ? getSerializedValue(selectedValues[0]) : "",
				onChange: handleNativeChange,
				onInvalid: (event) => {
					event.preventDefault();
					focusTrigger();
				},
				children: [!multiple && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: " "
				}), groups.map((group) => group.label != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
					label: group.label,
					children: group.options.map(({ option, index }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: getSerializedValue(option.value),
						disabled: option.disabled,
						children: option.label
					}, option.id ?? index))
				}, group.label) : group.options.map(({ option, index }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: getSerializedValue(option.value),
					disabled: option.disabled,
					children: option.label
				}, option.id ?? index)))]
			})
		]
	});
};
var getPrecision = (value) => {
	const [coefficient = "", exponent = "0"] = String(value).toLowerCase().split("e");
	const decimals = coefficient.split(".")[1]?.length ?? 0;
	return Math.min(12, Math.max(0, decimals - Number(exponent)));
};
var normalizeSliderValue = (value, min, max, step) => {
	if (max <= min) return min;
	const boundedValue = Math.min(max, Math.max(min, value));
	if (step === "any") return boundedValue;
	const factor = 10 ** Math.max(getPrecision(min), getPrecision(step));
	const steppedValue = min + Math.round((boundedValue - min) / step) * step;
	return Math.min(max, Math.max(min, Math.round(steppedValue * factor) / factor));
};
var Slider = ({ value, defaultValue, onChange, min = 0, max = 100, step = 1, size = "md", marks, showValue = false, formatValue, className, id, ref, disabled = false, style, "aria-invalid": ariaInvalid, "aria-valuetext": ariaValueText, ...inputProps }) => {
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? generatedId;
	const resolvedMin = Number.isFinite(min) ? min : 0;
	const resolvedMax = Math.max(resolvedMin, Number.isFinite(max) ? max : 100);
	const resolvedStep = step === "any" ? "any" : Number.isFinite(step) && step > 0 ? step : 1;
	const isControlled = value !== void 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => normalizeSliderValue(defaultValue ?? (resolvedMin + resolvedMax) / 2, resolvedMin, resolvedMax, resolvedStep));
	const currentValue = normalizeSliderValue(isControlled ? value : internalValue, resolvedMin, resolvedMax, resolvedStep);
	const progress = resolvedMax > resolvedMin ? (currentValue - resolvedMin) / (resolvedMax - resolvedMin) * 100 : 0;
	const formattedValue = formatValue?.(currentValue);
	const isInvalid = ariaInvalid === true || ariaInvalid === "true";
	const resolvedMarks = (marks ?? []).filter((mark) => Number.isFinite(mark.value) && mark.value >= resolvedMin && mark.value <= resolvedMax).slice().sort((a, b) => a.value - b.value);
	const hasMarkLabels = resolvedMarks.some((mark) => mark.label != null);
	const handleChange = (event) => {
		const nextValue = normalizeSliderValue(event.currentTarget.valueAsNumber, resolvedMin, resolvedMax, resolvedStep);
		if (!isControlled) setInternalValue(nextValue);
		onChange?.(nextValue);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-slider", className),
		"data-size": size,
		"data-disabled": disabled || void 0,
		"data-invalid": isInvalid || void 0,
		children: [
			showValue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("output", {
				htmlFor: inputId,
				className: "puzzle-slider__value",
				children: formattedValue ?? currentValue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...inputProps,
				ref,
				id: inputId,
				className: "puzzle-slider__input",
				type: "range",
				min: resolvedMin,
				max: resolvedMax,
				step: resolvedStep,
				value: currentValue,
				disabled,
				"aria-invalid": ariaInvalid,
				"aria-valuetext": ariaValueText ?? formattedValue,
				style: {
					...style,
					"--puzzle-slider-progress": `${progress}%`
				},
				onChange: handleChange
			}),
			resolvedMarks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-slider__marks",
				"data-has-labels": hasMarkLabels || void 0,
				children: resolvedMarks.map((mark, index) => {
					const position = resolvedMax > resolvedMin ? (mark.value - resolvedMin) / (resolvedMax - resolvedMin) * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "puzzle-slider__mark",
						"data-edge": index === 0 ? "start" : index === resolvedMarks.length - 1 ? "end" : void 0,
						style: { insetInlineStart: `${position}%` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-slider__mark-tick",
							"aria-hidden": "true"
						}), mark.label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-slider__mark-label",
							children: mark.label
						})]
					}, `${mark.value}-${index}`);
				})
			})
		]
	});
};
var StepperStep = (_props) => null;
var isStepperStep = (child) => (0, import_react.isValidElement)(child) && child.type === StepperStep;
var StepperRoot = ({ activeStep, activeStepId, defaultActiveStep = 0, defaultActiveStepId, onStepChange, onStepIdChange, orientation = "horizontal", clickable = false, linear = true, children, className, ...rootProps }) => {
	const [uncontrolledActiveStep, setUncontrolledActiveStep] = (0, import_react.useState)(defaultActiveStep);
	const [uncontrolledActiveStepId, setUncontrolledActiveStepId] = (0, import_react.useState)(defaultActiveStepId);
	const orientations = resolveResponsiveValue(orientation);
	const steps = import_react.Children.toArray(children).filter(isStepperStep);
	const isIdSelection = activeStepId !== void 0 || defaultActiveStepId !== void 0;
	const requestedActiveStepId = activeStepId ?? uncontrolledActiveStepId;
	if (isIdSelection) {
		const stepIds = /* @__PURE__ */ new Set();
		for (const step of steps) {
			const id = step.props.id;
			if (id === void 0) throw new Error("Stepper ID-based selection requires an id on every step.");
			const key = `${typeof id}:${id}`;
			if (stepIds.has(key)) throw new Error("Stepper step IDs must be unique.");
			stepIds.add(key);
		}
	}
	const requestedActiveStep = activeStep ?? uncontrolledActiveStep;
	const requestedActiveStepIndex = isIdSelection ? steps.findIndex((step) => step.props.id === requestedActiveStepId) : void 0;
	if (isIdSelection && steps.length > 0 && requestedActiveStepIndex === -1) throw new Error("Stepper activeStepId must match an available step ID.");
	const currentActiveStep = isIdSelection ? requestedActiveStepIndex ?? -1 : steps.length === 0 ? -1 : Number.isFinite(requestedActiveStep) ? Math.min(steps.length - 1, Math.max(0, Math.trunc(requestedActiveStep))) : 0;
	const direction = rootProps.dir === "rtl" ? "rtl" : "ltr";
	const focusItems = steps.map((step, index) => {
		const selectable = clickable && !step.props.disabled && (!linear || index <= currentActiveStep);
		return {
			id: step.props.id === void 0 ? `index:${index}` : `${typeof step.props.id}:${step.props.id}`,
			disabled: !selectable
		};
	});
	const rovingFocus = useRovingFocus({
		items: focusItems,
		orientation: "both",
		dir: direction,
		initialActiveId: currentActiveStep >= 0 ? focusItems[currentActiveStep]?.id : void 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		...rootProps,
		className: cn("puzzle-stepper", className),
		"data-orientation-mobile": orientations.mobile,
		"data-orientation-tablet": orientations.tablet,
		"data-orientation-desktop": orientations.desktop,
		children: steps.map((step, index) => {
			const { id, label, description, icon, completed: completedProp, error, disabled = false, optional, className: stepClassName } = step.props;
			const state = error ? "error" : completedProp ?? index < currentActiveStep ? "completed" : index === currentActiveStep ? "active" : "upcoming";
			const selectable = !disabled && (!linear || index <= currentActiveStep);
			const focusId = id === void 0 ? `index:${index}` : `${typeof id}:${id}`;
			const handleClick = () => {
				if (!selectable || index === currentActiveStep) return;
				if (isIdSelection) {
					if (activeStepId === void 0) setUncontrolledActiveStepId(id);
				} else if (activeStep === void 0) setUncontrolledActiveStep(index);
				onStepChange?.(index);
				if (isIdSelection && id !== void 0) onStepIdChange?.(id);
			};
			const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-stepper__indicator",
				"data-has-icon": icon != null ? "true" : "false",
				"aria-hidden": "true",
				children: icon ?? (state === "completed" || state === "error" ? null : index + 1)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "puzzle-stepper__label",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-stepper__label-text",
						children: label
					}),
					description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-stepper__description",
						children: description
					}),
					optional != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-stepper__optional",
						children: optional
					})
				]
			})] });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cn("puzzle-stepper__item", stepClassName),
				"data-state": state,
				"data-disabled": disabled || clickable && !selectable ? "true" : void 0,
				"aria-current": index === currentActiveStep ? "step" : void 0,
				children: clickable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "puzzle-stepper__step",
					disabled: !selectable,
					ref: rovingFocus.getItemRef(focusId),
					tabIndex: rovingFocus.getItemTabIndex(focusId, !selectable),
					onFocus: () => rovingFocus.onItemFocus(focusId),
					onKeyDown: (event) => rovingFocus.onItemKeyDown(event, focusId),
					onClick: handleClick,
					children: content
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-stepper__step",
					children: content
				})
			}, id === void 0 ? step.key ?? index : `${typeof id}:${id}`);
		})
	});
};
var Stepper = Object.assign(StepperRoot, { Step: StepperStep });
var normalizePanelConstraints = (constraints) => {
	if (constraints.length < 2) throw new RangeError("ResizablePanels requires at least two panels.");
	const normalized = constraints.map((constraint, index) => {
		const minSize = constraint.minSize ?? 0;
		const maxSize = constraint.maxSize ?? 100;
		if (!Number.isFinite(minSize) || !Number.isFinite(maxSize) || minSize < 0 || maxSize > 100 || minSize > maxSize) throw new RangeError(`Invalid size constraints for panel ${index}.`);
		return {
			minSize,
			maxSize
		};
	});
	const minimumTotal = normalized.reduce((total, constraint) => total + constraint.minSize, 0);
	const maximumTotal = normalized.reduce((total, constraint) => total + constraint.maxSize, 0);
	if (minimumTotal > 100 || maximumTotal < 100) throw new RangeError("Panel size constraints cannot produce a layout totaling 100%.");
	return normalized;
};
/**
* Normalizes panel sizes to 100% while respecting every panel constraint.
*
* When a panel reaches its minimum or maximum, the remaining space is
* distributed proportionally between the other panels.
*/
var normalizePanelSizes = (sizes, constraints) => {
	const normalizedConstraints = normalizePanelConstraints(constraints);
	if (sizes && sizes.length !== constraints.length) throw new RangeError("The number of panel sizes must match the number of panels.");
	const weights = normalizedConstraints.map((_, index) => {
		const size = sizes?.[index] ?? 1;
		return Number.isFinite(size) ? Math.max(0, size) : 0;
	});
	const result = new Array(constraints.length).fill(0);
	const unresolved = normalizedConstraints.map((_, index) => index);
	let remainingSize = 100;
	while (unresolved.length > 0) {
		const activeWeightTotal = unresolved.reduce((total, index) => total + weights[index], 0);
		const useEqualDistribution = activeWeightTotal === 0;
		const candidates = unresolved.map((index) => ({
			index,
			size: remainingSize * (useEqualDistribution ? 1 : weights[index]) / (useEqualDistribution ? unresolved.length : activeWeightTotal)
		}));
		const violations = candidates.filter(({ index, size }) => {
			const constraint = normalizedConstraints[index];
			return size < constraint.minSize || size > constraint.maxSize;
		});
		if (violations.length === 0) {
			for (const candidate of candidates) result[candidate.index] = candidate.size;
			break;
		}
		const clampedViolations = violations.map(({ index, size }) => {
			const constraint = normalizedConstraints[index];
			return {
				index,
				size,
				fixedSize: Math.min(constraint.maxSize, Math.max(constraint.minSize, size))
			};
		});
		const totalCorrection = clampedViolations.reduce((total, { size, fixedSize }) => total + fixedSize - size, 0);
		const fixedIndexes = /* @__PURE__ */ new Set();
		for (const { index, size, fixedSize } of clampedViolations) {
			if (totalCorrection > 0 && fixedSize < size || totalCorrection < 0 && fixedSize > size) continue;
			result[index] = fixedSize;
			remainingSize -= fixedSize;
			fixedIndexes.add(index);
		}
		for (let index = unresolved.length - 1; index >= 0; index--) if (fixedIndexes.has(unresolved[index])) unresolved.splice(index, 1);
	}
	return result;
};
/**
* Returns the allowed size range of the first panel in a pair.
*
* Both panels retain their combined size during resizing.
*/
var getPanelPairBounds = (sizes, constraints, panelIndex) => {
	const normalizedConstraints = normalizePanelConstraints(constraints);
	const normalizedSizes = normalizePanelSizes(sizes, normalizedConstraints);
	if (!Number.isInteger(panelIndex) || panelIndex < 0 || panelIndex >= normalizedSizes.length - 1) throw new RangeError("Invalid panel resize index.");
	const first = normalizedConstraints[panelIndex];
	const second = normalizedConstraints[panelIndex + 1];
	const combinedSize = normalizedSizes[panelIndex] + normalizedSizes[panelIndex + 1];
	return {
		minSize: Math.max(first.minSize, combinedSize - second.maxSize),
		maxSize: Math.min(first.maxSize, combinedSize - second.minSize)
	};
};
/**
* Resizes two adjacent panels while keeping their combined size unchanged.
*
* A positive delta increases the first panel.
* A negative delta decreases the first panel.
*/
var resizePanelPair = (sizes, constraints, panelIndex, delta) => {
	if (!Number.isFinite(delta)) throw new RangeError("Resize delta must be a finite number.");
	const normalizedSizes = normalizePanelSizes(sizes, constraints);
	const bounds = getPanelPairBounds(normalizedSizes, constraints, panelIndex);
	const combinedSize = normalizedSizes[panelIndex] + normalizedSizes[panelIndex + 1];
	const nextFirstSize = Math.min(bounds.maxSize, Math.max(bounds.minSize, normalizedSizes[panelIndex] + delta));
	const nextSizes = [...normalizedSizes];
	nextSizes[panelIndex] = nextFirstSize;
	nextSizes[panelIndex + 1] = combinedSize - nextFirstSize;
	return nextSizes;
};
var isResizablePanelElement = (child) => (0, import_react.isValidElement)(child) && child.type === ResizablePanel;
var isResizableHandleElement = (child) => (0, import_react.isValidElement)(child) && child.type === ResizableHandle;
var parsePixels = (value) => Number.parseFloat(value ?? "") || 0;
var getAvailableSize = (group, orientation) => {
	const computedStyle = group.ownerDocument.defaultView?.getComputedStyle(group);
	const isHorizontal = orientation === "horizontal";
	const totalSize = isHorizontal ? group.clientWidth : group.clientHeight;
	const paddingSize = computedStyle ? isHorizontal ? parsePixels(computedStyle.paddingLeft) + parsePixels(computedStyle.paddingRight) : parsePixels(computedStyle.paddingTop) + parsePixels(computedStyle.paddingBottom) : 0;
	const handleSize = Array.from(group.children).reduce((total, child) => {
		const element = child;
		if (!element.hasAttribute("data-puzzle-resizable-handle")) return total;
		const rect = element.getBoundingClientRect();
		return total + (isHorizontal ? rect.width : rect.height);
	}, 0);
	return Math.max(0, totalSize - paddingSize - handleSize);
};
var getResizeDirection = (element, orientation) => {
	if (orientation !== "horizontal") return 1;
	return element.ownerDocument.defaultView?.getComputedStyle(element).direction === "rtl" ? -1 : 1;
};
var getPointerCoordinate = (event, orientation) => orientation === "horizontal" ? event.clientX : event.clientY;
var ResizablePanel = ({ id, minSize = 0, maxSize = 100, panelIndex = 0, panelSize = 1, panelId, className, style, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	id: panelId ?? id,
	className: cn("puzzle-resizable-panels__panel", className),
	style: {
		...style,
		flex: `${panelSize} 1 0%`
	},
	"data-panel-index": panelIndex,
	"data-panel-size": panelSize,
	"data-panel-min-size": minSize,
	"data-panel-max-size": maxSize
});
var ResizableHandle = ({ withGrip = false, disabled = false, handleIndex = -1, orientation = "horizontal", value, minValue, maxValue, panelIds, inheritedDisabled = false, onResizeStart, onResizeMove, onResizeEnd, onResizeKeyDown, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown, className, children, tabIndex, "aria-label": ariaLabel, ...props }) => {
	const isDisabled = disabled || inheritedDisabled;
	const handlePointerDown = (event) => {
		onPointerDown?.(event);
		if (!event.defaultPrevented && !isDisabled) onResizeStart?.(event, handleIndex);
	};
	const handlePointerMove = (event) => {
		onPointerMove?.(event);
		if (!event.defaultPrevented && !isDisabled) onResizeMove?.(event, handleIndex);
	};
	const handlePointerUp = (event) => {
		onResizeEnd?.(event, handleIndex);
		onPointerUp?.(event);
	};
	const handlePointerCancel = (event) => {
		onResizeEnd?.(event, handleIndex);
		onPointerCancel?.(event);
	};
	const handleLostPointerCapture = (event) => {
		onResizeEnd?.(event, handleIndex);
		onLostPointerCapture?.(event);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (!event.defaultPrevented && !isDisabled) onResizeKeyDown?.(event, handleIndex);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("puzzle-resizable-panels__handle", className),
		role: "separator",
		tabIndex: isDisabled ? -1 : tabIndex ?? 0,
		"aria-label": ariaLabel ?? "Resize panels",
		"aria-orientation": orientation === "horizontal" ? "vertical" : "horizontal",
		"aria-controls": panelIds?.join(" "),
		"aria-valuenow": value,
		"aria-valuemin": minValue,
		"aria-valuemax": maxValue,
		"aria-valuetext": value === void 0 ? void 0 : `${Math.round(value * 100) / 100}%`,
		"aria-disabled": isDisabled || void 0,
		"data-puzzle-resizable-handle": "",
		"data-orientation": orientation,
		"data-disabled": isDisabled ? "true" : void 0,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerCancel,
		onLostPointerCapture: handleLostPointerCapture,
		onKeyDown: handleKeyDown,
		children: withGrip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-resizable-panels__handle-grip",
			"aria-hidden": "true"
		}) : children
	});
};
var ResizablePanelsRoot = ({ children, orientation = "horizontal", sizes, defaultSizes, onSizesChange, disabled = false, keyboardStep = 1, id, role, className, style, ref: forwardedRef, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const groupId = id ?? `puzzle-resizable-panels-${generatedId}`;
	if (!Number.isFinite(keyboardStep) || keyboardStep <= 0) throw new RangeError("keyboardStep must be a positive finite number.");
	const childrenArray = import_react.Children.toArray(children);
	if (!(childrenArray.length >= 3 && childrenArray.length % 2 === 1 && childrenArray.every((child, index) => index % 2 === 0 ? isResizablePanelElement(child) : isResizableHandleElement(child)))) throw new Error("ResizablePanels requires alternating Panel and Handle children, starting and ending with a Panel. At least two panels are required.");
	const panelElements = childrenArray.filter(isResizablePanelElement);
	const panelCount = panelElements.length;
	const panelConstraints = panelElements.map((panel) => ({
		minSize: panel.props.minSize,
		maxSize: panel.props.maxSize
	}));
	const panelIds = panelElements.map((panel, index) => panel.props.id ?? `${groupId}-panel-${index}`);
	if (new Set(panelIds).size !== panelIds.length) throw new Error("ResizablePanels requires unique panel IDs.");
	const [uncontrolledSizes, setUncontrolledSizes] = (0, import_react.useState)(() => normalizePanelSizes(sizes === void 0 ? defaultSizes : void 0, panelConstraints));
	const currentSizes = normalizePanelSizes(sizes ?? (uncontrolledSizes.length === panelCount ? uncontrolledSizes : void 0), panelConstraints);
	const [isResizing, setIsResizing] = (0, import_react.useState)(false);
	const groupRef = (0, import_react.useRef)(null);
	const pointerDragRef = (0, import_react.useRef)(null);
	const updateSizes = (nextSizes) => {
		const normalized = normalizePanelSizes(nextSizes, panelConstraints);
		if (!normalized.some((size, index) => Math.abs(size - (currentSizes[index] ?? 0)) > 1e-6)) return;
		if (sizes === void 0) setUncontrolledSizes(normalized);
		onSizesChange?.(normalized);
	};
	const handlePointerDown = (event, handleIndex) => {
		const group = groupRef.current;
		if (!group || disabled) return;
		if (event.button !== 0 && event.pointerType !== "touch" && event.pointerType !== "pen") return;
		const availableSize = getAvailableSize(group, orientation);
		if (availableSize <= 0) return;
		pointerDragRef.current = {
			handleIndex,
			pointerId: event.pointerId,
			startCoordinate: getPointerCoordinate(event, orientation),
			availableSize,
			direction: getResizeDirection(group, orientation),
			sizes: [...currentSizes]
		};
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {}
		event.preventDefault();
		setIsResizing(true);
	};
	const handlePointerMove = (event, handleIndex) => {
		const drag = pointerDragRef.current;
		if (!drag || drag.pointerId !== event.pointerId || drag.handleIndex !== handleIndex) return;
		const delta = (getPointerCoordinate(event, orientation) - drag.startCoordinate) / drag.availableSize * 100 * drag.direction;
		const nextSizes = resizePanelPair(drag.sizes, panelConstraints, handleIndex, delta);
		event.preventDefault();
		updateSizes(nextSizes);
	};
	const handlePointerEnd = (event, handleIndex) => {
		const drag = pointerDragRef.current;
		if (!drag || drag.pointerId !== event.pointerId || drag.handleIndex !== handleIndex) return;
		pointerDragRef.current = null;
		setIsResizing(false);
	};
	const handleKeyDown = (event, handleIndex) => {
		if (disabled) return;
		const currentSize = currentSizes[handleIndex];
		const bounds = getPanelPairBounds(currentSizes, panelConstraints, handleIndex);
		const group = groupRef.current;
		const direction = group ? getResizeDirection(group, orientation) : 1;
		const step = keyboardStep * (event.shiftKey ? 10 : 1);
		let nextSize;
		if (event.key === "Home") nextSize = bounds.minSize;
		else if (event.key === "End") nextSize = bounds.maxSize;
		else if (orientation === "horizontal") {
			if (event.key === "ArrowRight") nextSize = currentSize + step * direction;
			else if (event.key === "ArrowLeft") nextSize = currentSize - step * direction;
		} else if (event.key === "ArrowDown") nextSize = currentSize + step;
		else if (event.key === "ArrowUp") nextSize = currentSize - step;
		if (nextSize === void 0) return;
		event.preventDefault();
		updateSizes(resizePanelPair(currentSizes, panelConstraints, handleIndex, nextSize - currentSize));
	};
	let panelIndex = 0;
	const enhancedChildren = childrenArray.map((child) => {
		if (isResizablePanelElement(child)) {
			const index = panelIndex++;
			return (0, import_react.cloneElement)(child, {
				panelIndex: index,
				panelSize: currentSizes[index],
				panelId: panelIds[index]
			});
		}
		const handleIndex = panelIndex - 1;
		const bounds = getPanelPairBounds(currentSizes, panelConstraints, handleIndex);
		return (0, import_react.cloneElement)(child, {
			handleIndex,
			orientation,
			value: currentSizes[handleIndex],
			minValue: bounds.minSize,
			maxValue: bounds.maxSize,
			panelIds: [panelIds[handleIndex], panelIds[handleIndex + 1]],
			inheritedDisabled: disabled,
			onResizeStart: handlePointerDown,
			onResizeMove: handlePointerMove,
			onResizeEnd: handlePointerEnd,
			onResizeKeyDown: handleKeyDown
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...rootProps,
		ref: (node) => {
			groupRef.current = node;
			if (typeof forwardedRef === "function") forwardedRef(node);
			else if (forwardedRef) forwardedRef.current = node;
		},
		id: groupId,
		role: role ?? "group",
		className: cn("puzzle-resizable-panels", className),
		style,
		"data-orientation": orientation,
		"data-disabled": disabled ? "true" : void 0,
		"data-resizing": isResizing ? "true" : void 0,
		children: enhancedChildren
	});
};
var ResizablePanels = Object.assign(ResizablePanelsRoot, {
	Panel: ResizablePanel,
	Handle: ResizableHandle
});
var normalizeOpenItemIndexes = (indexes, itemCount, type) => {
	const validIndexes = Array.from(new Set((indexes ?? []).filter((index) => Number.isInteger(index) && index >= 0 && index < itemCount)));
	if (type === "single") return validIndexes.slice(0, 1);
	return validIndexes.sort((a, b) => a - b);
};
var normalizeOpenItemIds = (value, type) => {
	const ids = value == null ? [] : Array.isArray(value) ? [...value] : [value];
	const uniqueIds = Array.from(new Set(ids));
	return type === "single" ? uniqueIds.slice(0, 1) : uniqueIds;
};
var Accordion = ({ items, initialOpenItemIndexes, openItemIndexes, onChange, value, defaultValue, onValueChange, type = "multiple", collapsible = true, headingLevel = 3, region, className, triggerClassName, panelClassName, contentClassName, unMountOnClose = false, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const isValueMode = value !== void 0 || defaultValue !== void 0;
	const isValueControlled = value !== void 0;
	const triggerRefs = (0, import_react.useRef)([]);
	const contentRefs = (0, import_react.useRef)([]);
	if (isValueMode) {
		const itemIds = /* @__PURE__ */ new Set();
		for (const item of items) {
			if (item.id === void 0) throw new Error("Accordion value and defaultValue require an id on every item.");
			const key = `${typeof item.id}:${item.id}`;
			if (itemIds.has(key)) throw new Error("Accordion item IDs must be unique.");
			itemIds.add(key);
		}
	}
	const [uncontrolledOpenItemIndexes, setUncontrolledOpenItemIndexes] = (0, import_react.useState)(() => normalizeOpenItemIndexes(initialOpenItemIndexes, items.length, type));
	const [uncontrolledOpenItemIds, setUncontrolledOpenItemIds] = (0, import_react.useState)(() => normalizeOpenItemIds(defaultValue, type));
	const requestedOpenItemIds = normalizeOpenItemIds(isValueControlled ? value : uncontrolledOpenItemIds, type);
	const currentOpenItemIndexes = isValueMode ? items.flatMap((item, index) => requestedOpenItemIds.includes(item.id) ? [index] : []) : normalizeOpenItemIndexes(openItemIndexes ?? uncontrolledOpenItemIndexes, items.length, type);
	const HeadingTag = `h${headingLevel}`;
	const useRegions = region ?? items.length <= 6;
	const handleToggle = (index, disabled = false) => {
		if (disabled) return;
		const isOpen = currentOpenItemIndexes.includes(index);
		if (type === "single" && isOpen && !collapsible) return;
		const nextOpenItemIndexes = normalizeOpenItemIndexes(type === "single" ? isOpen ? [] : [index] : isOpen ? currentOpenItemIndexes.filter((openIndex) => openIndex !== index) : [...currentOpenItemIndexes, index], items.length, type);
		if (isValueMode) {
			const nextIds = nextOpenItemIndexes.map((openIndex) => items[openIndex].id);
			if (!isValueControlled) setUncontrolledOpenItemIds(nextIds);
			onValueChange?.(type === "single" ? nextIds[0] ?? null : nextIds);
		} else if (openItemIndexes === void 0) setUncontrolledOpenItemIndexes(nextOpenItemIndexes);
		onChange?.(nextOpenItemIndexes);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("puzzle-accordion", className),
		...rootProps,
		children: items.map((item, index) => {
			const isOpen = currentOpenItemIndexes.includes(index);
			const cannotCollapse = type === "single" && isOpen && !collapsible;
			const triggerId = `${generatedId}-trigger-${index}`;
			const panelId = `${generatedId}-panel-${index}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadingTag, {
				className: "puzzle-accordion__heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: (node) => {
						triggerRefs.current[index] = node;
					},
					id: triggerId,
					type: "button",
					className: cn("puzzle-accordion__trigger", triggerClassName),
					"aria-expanded": isOpen,
					"aria-controls": panelId,
					"aria-disabled": cannotCollapse || void 0,
					"data-state": isOpen ? "open" : "closed",
					disabled: item.disabled,
					onClick: () => handleToggle(index, item.disabled),
					children: item.title
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
				visible: isOpen,
				template: "accordion",
				duration: 300,
				unmountOnExit: unMountOnClose,
				className: panelClassName,
				id: panelId,
				role: useRegions ? "region" : void 0,
				"aria-labelledby": useRegions ? triggerId : void 0,
				"aria-hidden": !isOpen,
				inert: !isOpen,
				"data-state": isOpen ? "open" : "closed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: (node) => {
						contentRefs.current[index] = node;
					},
					className: "puzzle-accordion__panel",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-accordion__panel-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("puzzle-accordion__content", contentClassName),
							children: item.content
						})
					})
				})
			})] }, item.id === void 0 ? index : `${typeof item.id}:${item.id}`);
		})
	});
};
var isTabElement = (child) => (0, import_react.isValidElement)(child) && child.type === TabsTab;
var TabsTab = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
var TabsRoot = ({ tabBarPosition = "top", initialActiveId, activeId, onActivate, forceMountContent = false, children, className, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const isControlled = activeId !== void 0;
	const tabs = import_react.Children.toArray(children).filter(isTabElement);
	const firstEnabledTabId = tabs.find((tab) => !tab.props.disabled)?.props.id;
	const [uncontrolledActiveId, setUncontrolledActiveId] = (0, import_react.useState)(() => initialActiveId ?? firstEnabledTabId);
	const requestedActiveId = isControlled ? activeId : uncontrolledActiveId;
	const currentActiveId = tabs.some((tab) => tab.props.id === requestedActiveId && !tab.props.disabled) ? requestedActiveId : firstEnabledTabId;
	const isVertical = tabBarPosition === "left" || tabBarPosition === "right";
	const dir = rootProps.dir === "rtl" ? "rtl" : "ltr";
	const previousActiveIndex = (0, import_react.useRef)(Math.max(0, tabs.findIndex((tab) => tab.props.id === currentActiveId)));
	const currentActiveIndex = Math.max(0, tabs.findIndex((tab) => tab.props.id === currentActiveId));
	const slideDirection = currentActiveIndex > previousActiveIndex.current ? 1 : currentActiveIndex < previousActiveIndex.current ? -1 : 0;
	if (currentActiveId !== tabs[previousActiveIndex.current]?.props.id) previousActiveIndex.current = currentActiveIndex;
	const rovingFocus = useRovingFocus({
		items: tabs.map((tab) => ({
			id: tab.props.id,
			disabled: tab.props.disabled
		})),
		orientation: isVertical ? "vertical" : "horizontal",
		dir,
		initialActiveId: currentActiveId
	});
	const isKeyboardNavigation = (0, import_react.useRef)(false);
	const activateTab = (tabId) => {
		if (!tabs.some((tab) => tab.props.id === tabId && !tab.props.disabled)) return;
		if (!isControlled) setUncontrolledActiveId(tabId);
		onActivate?.(tabId);
	};
	const getTabId = (tabId) => `${generatedId}-tab-${encodeURIComponent(tabId)}`;
	const getPanelId = (tabId) => `${generatedId}-panel-${encodeURIComponent(tabId)}`;
	const handleKeyDown = (event, id) => {
		isKeyboardNavigation.current = true;
		try {
			rovingFocus.onItemKeyDown(event, id);
		} finally {
			isKeyboardNavigation.current = false;
		}
	};
	const handleFocus = (id) => {
		rovingFocus.onItemFocus(id);
		if (isKeyboardNavigation.current) activateTab(id);
	};
	const handleClick = (id) => {
		rovingFocus.onItemFocus(id);
		activateTab(id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...rootProps,
		className: cn("puzzle-tabs", `puzzle-tabs--${tabBarPosition}`, className),
		"data-orientation": isVertical ? "vertical" : "horizontal",
		"data-position": tabBarPosition,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-tabs__list",
			role: "tablist",
			"aria-orientation": isVertical ? "vertical" : "horizontal",
			children: tabs.map((tab) => {
				const { id, tab: tabContent, disabled = false } = tab.props;
				const isActive = id === currentActiveId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: rovingFocus.getItemRef(id),
					id: getTabId(id),
					type: "button",
					role: "tab",
					className: "puzzle-tabs__trigger",
					disabled,
					"aria-selected": isActive,
					"aria-controls": getPanelId(id),
					tabIndex: disabled ? -1 : isActive ? 0 : -1,
					"data-state": isActive ? "active" : "inactive",
					onClick: () => handleClick(id),
					onFocus: () => handleFocus(id),
					onKeyDown: (event) => handleKeyDown(event, id),
					children: tabContent
				}, id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-tabs__content",
			"data-direction": slideDirection,
			"data-position": tabBarPosition,
			children: tabs.map((tab) => {
				const { id, children: content } = tab.props;
				const isActive = id === currentActiveId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: getPanelId(id),
					role: "tabpanel",
					"aria-labelledby": getTabId(id),
					hidden: !isActive,
					tabIndex: 0,
					className: "puzzle-tabs__panel",
					"data-state": isActive ? "active" : "inactive",
					children: forceMountContent || isActive ? content : null
				}, id);
			})
		})]
	});
};
var Tabs = Object.assign(TabsRoot, { Tab: TabsTab });
var Portal = ({ targetId, container, children }) => {
	const themeScope = useThemeScope();
	const [target, setTarget] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (container) {
			setTarget(container);
			return;
		}
		if (targetId) {
			setTarget(document.getElementById(targetId) ?? document.body);
			return;
		}
		if (themeScope) {
			setTarget(themeScope.portalTarget);
			return;
		}
		setTarget(document.body);
	}, [
		targetId,
		container,
		themeScope
	]);
	if (!target || children == null) return null;
	return (0, import_react_dom.createPortal)(children, target);
};
var Dialog = ({ open, onOpenChange, title, description, children, footer, size = "md", closeButton = true, closeLabel = "Close dialog", closeOnBackdrop = true, closeOnEscape = true, className, onClick, onClose, "aria-describedby": externalDescriptionId, ...props }) => {
	const titleId = (0, import_react.useId)();
	const descriptionId = (0, import_react.useId)();
	const handleClose = (0, import_react.useCallback)(() => {
		onOpenChange(false);
		onClose?.();
	}, [onOpenChange, onClose]);
	const handleClick = (event) => {
		onClick?.(event);
	};
	const describedBy = [description ? descriptionId : void 0, externalDescriptionId].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Backdrop, {
		open,
		modal: true,
		closeOnBackdrop,
		closeOnEscape,
		onClose: handleClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
			template: "slide-in-up",
			visible: open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				...props,
				"data-overlay-content": "",
				tabIndex: -1,
				className: cn("puzzle-dialog", `puzzle-dialog--${size}`, className),
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": titleId,
				"aria-describedby": describedBy,
				onClick: handleClick,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "puzzle-dialog__header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-dialog__heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: titleId,
								className: "puzzle-dialog__title",
								children: title
							}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: descriptionId,
								className: "puzzle-dialog__description",
								children: description
							})]
						}), closeButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "puzzle-dialog__close",
							"aria-label": closeLabel,
							onClick: handleClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "×"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-dialog__body",
						children
					}),
					footer != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "puzzle-dialog__footer",
						children: footer
					})
				]
			})
		})
	}) });
};
var normalizeCommandText = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
var filterCommands = (commands, query) => {
	const normalizedQuery = normalizeCommandText(query);
	if (!normalizedQuery) return commands;
	const terms = normalizedQuery.split(/\s+/);
	return commands.filter((command) => {
		const searchableText = normalizeCommandText([
			command.label,
			command.description ?? "",
			...command.keywords ?? [],
			command.group ?? ""
		].join(" "));
		return terms.every((term) => searchableText.includes(term));
	});
};
var getNextEnabledIndex = (commands, currentIndex, direction, loop = true) => {
	if (commands.length === 0) return -1;
	let index = currentIndex;
	for (let attempt = 0; attempt < commands.length; attempt++) {
		index += direction;
		if (loop) index = (index + commands.length) % commands.length;
		else if (index < 0 || index >= commands.length) return currentIndex;
		if (!commands[index]?.disabled) return index;
	}
	return -1;
};
var findFirstEnabledIndex = (commands) => commands.findIndex((command) => !command.disabled);
var findLastEnabledIndex = (commands) => {
	for (let index = commands.length - 1; index >= 0; index--) if (!commands[index]?.disabled) return index;
	return -1;
};
var Command = ({ commands, placeholder = "Search commands...", label = "Search commands", emptyMessage = "No commands found.", loading = false, loadingMessage = "Searching...", filter, onSelect, onQueryChange, query, defaultQuery = "", loop = true, autoFocus = true, className, ...props }) => {
	const baseId = (0, import_react.useId)();
	const inputId = `${baseId}-input`;
	const listId = `${baseId}-list`;
	const statusId = `${baseId}-status`;
	const inputRef = (0, import_react.useRef)(null);
	const controlledQuery = query !== void 0;
	const [internalQuery, setInternalQuery] = (0, import_react.useState)(defaultQuery);
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(-1);
	const currentQuery = controlledQuery ? query : internalQuery;
	const filteredCommands = (0, import_react.useMemo)(() => filter ? commands.filter((command) => filter(command, currentQuery)) : filterCommands(commands, currentQuery), [
		commands,
		currentQuery,
		filter
	]);
	const enabledCommands = (0, import_react.useMemo)(() => filteredCommands.filter((command) => !command.disabled), [filteredCommands]);
	const groupedCommands = (0, import_react.useMemo)(() => {
		const groups = /* @__PURE__ */ new Map();
		filteredCommands.forEach((command) => {
			const group = command.group ?? "";
			const items = groups.get(group) ?? [];
			items.push(command);
			groups.set(group, items);
		});
		return Array.from(groups.entries());
	}, [filteredCommands]);
	const activeCommand = filteredCommands[activeIndex];
	const changeQuery = (0, import_react.useCallback)((nextQuery) => {
		if (!controlledQuery) setInternalQuery(nextQuery);
		setActiveIndex(-1);
		onQueryChange?.(nextQuery);
	}, [controlledQuery, onQueryChange]);
	const selectCommand = (0, import_react.useCallback)((command) => {
		if (command.disabled) return;
		command.onSelect?.();
		onSelect?.(command);
	}, [onSelect]);
	const handleInputChange = (event) => {
		changeQuery(event.currentTarget.value);
	};
	const handleKeyDown = (event) => {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				setActiveIndex((current) => getNextEnabledIndex(filteredCommands, current, 1, loop));
				break;
			case "ArrowUp":
				event.preventDefault();
				setActiveIndex((current) => getNextEnabledIndex(filteredCommands, current < 0 ? filteredCommands.length : current, -1, loop));
				break;
			case "Home":
				if (event.ctrlKey || event.metaKey) {
					event.preventDefault();
					setActiveIndex(findFirstEnabledIndex(filteredCommands));
				}
				break;
			case "End":
				if (event.ctrlKey || event.metaKey) {
					event.preventDefault();
					setActiveIndex(findLastEnabledIndex(filteredCommands));
				}
				break;
			case "Enter":
				event.preventDefault();
				if (activeCommand && !activeCommand.disabled) selectCommand(activeCommand);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!autoFocus) return;
		inputRef.current?.focus({ preventScroll: true });
	}, [autoFocus]);
	(0, import_react.useEffect)(() => {
		if (activeIndex >= filteredCommands.length || filteredCommands[activeIndex]?.disabled) setActiveIndex(findFirstEnabledIndex(filteredCommands));
	}, [activeIndex, filteredCommands]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...props,
		className: cn("puzzle-command", className),
		"data-command": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-command__search",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "puzzle-command__search-icon",
					viewBox: "0 0 24 24",
					width: "18",
					height: "18",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "11",
						cy: "11",
						r: "8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 21-4.35-4.35" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					id: inputId,
					className: "puzzle-command__input",
					type: "text",
					role: "combobox",
					"aria-label": label,
					"aria-autocomplete": "list",
					"aria-expanded": true,
					"aria-controls": listId,
					"aria-activedescendant": activeCommand ? `${baseId}-item-${encodeURIComponent(activeCommand.id)}` : void 0,
					"aria-describedby": statusId,
					placeholder,
					value: currentQuery,
					onChange: handleInputChange,
					onKeyDown: handleKeyDown,
					autoComplete: "off",
					spellCheck: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: listId,
				className: "puzzle-command__list",
				role: "listbox",
				"aria-label": "Commands",
				"aria-busy": loading,
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-command__empty",
					role: "status",
					children: loadingMessage
				}) : filteredCommands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-command__empty",
					role: "status",
					children: emptyMessage
				}) : groupedCommands.map(([group, items]) => {
					const groupId = group ? `${baseId}-group-${encodeURIComponent(group)}` : void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "puzzle-command__group",
						role: "group",
						"aria-labelledby": groupId,
						children: [group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: groupId,
							className: "puzzle-command__group-heading",
							children: group
						}), items.map((command) => {
							const index = filteredCommands.indexOf(command);
							const selected = index === activeIndex;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: `${baseId}-item-${encodeURIComponent(command.id)}`,
								className: cn("puzzle-command__item", selected && "puzzle-command__item--active", command.disabled && "puzzle-command__item--disabled"),
								role: "option",
								"aria-selected": selected,
								"aria-disabled": command.disabled || void 0,
								"data-active": selected || void 0,
								onMouseEnter: () => {
									if (!command.disabled) setActiveIndex(index);
								},
								onMouseDown: (event) => {
									event.preventDefault();
								},
								onClick: () => {
									selectCommand(command);
								},
								children: [
									command.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-command__item-icon",
										"aria-hidden": "true",
										children: command.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "puzzle-command__item-content",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "puzzle-command__item-label",
											children: command.label
										}), command.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "puzzle-command__item-description",
											children: command.description
										})]
									}),
									command.shortcut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "puzzle-command__shortcut",
										children: command.shortcut
									})
								]
							}, command.id);
						})]
					}, group || "__default");
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: statusId,
				className: "puzzle-command__sr-only",
				role: "status",
				"aria-live": "polite",
				"aria-atomic": "true",
				children: loading ? loadingMessage : enabledCommands.length === 0 ? emptyMessage : `${enabledCommands.length} ${enabledCommands.length === 1 ? "command" : "commands"} available`
			})
		]
	});
};
var CommandDialog = ({ open, defaultOpen = false, onOpenChange, title = "Command palette", description, shortcut = "k", commands, onSelect, ...commandProps }) => {
	const controlled = open !== void 0;
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const isOpen = controlled ? open : internalOpen;
	const [ownerDocument, setOwnerDocument] = (0, import_react.useState)(null);
	const rootRef = (0, import_react.useCallback)((node) => {
		setOwnerDocument(node?.ownerDocument ?? null);
	}, []);
	const changeOpen = (0, import_react.useCallback)((nextOpen) => {
		if (!controlled) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [controlled, onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (shortcut === false || !ownerDocument) return;
		const view = ownerDocument.defaultView;
		if (!view) return;
		const handleGlobalKeyDown = (event) => {
			if (!(event instanceof view.KeyboardEvent)) return;
			const keyboardEvent = event;
			if (keyboardEvent.defaultPrevented || keyboardEvent.isComposing || keyboardEvent.key.toLowerCase() !== shortcut.toLowerCase() || !(keyboardEvent.metaKey || keyboardEvent.ctrlKey) || keyboardEvent.shiftKey || keyboardEvent.altKey) return;
			const target = keyboardEvent.target;
			if (target instanceof view.HTMLElement) {
				if (target.isContentEditable || target.closest([
					"input",
					"textarea",
					"select",
					"[contenteditable=\"true\"]",
					"[role=\"textbox\"]"
				].join(", ")) !== null) return;
			}
			keyboardEvent.preventDefault();
			changeOpen(!isOpen);
		};
		ownerDocument.addEventListener("keydown", handleGlobalKeyDown);
		return () => {
			ownerDocument.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, [
		ownerDocument,
		shortcut,
		isOpen,
		changeOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: rootRef,
		"data-command-dialog-root": "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: isOpen,
			onOpenChange: changeOpen,
			title,
			description,
			size: "md",
			closeButton: false,
			className: "puzzle-command-dialog",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, {
				...commandProps,
				commands,
				autoFocus: isOpen,
				onSelect: (command) => {
					onSelect?.(command);
					changeOpen(false);
				}
			})
		})
	});
};
var DropdownMenuContext = (0, import_react.createContext)(null);
var RadioGroupContext = (0, import_react.createContext)(null);
var useDropdownMenuContext = () => {
	const context = (0, import_react.useContext)(DropdownMenuContext);
	if (!context) throw new Error("DropdownMenu components must be rendered inside DropdownMenu.");
	return context;
};
var useRadioGroupContext = () => {
	const context = (0, import_react.useContext)(RadioGroupContext);
	if (!context) throw new Error("DropdownMenu.RadioItem must be rendered inside DropdownMenu.RadioGroup.");
	return context;
};
var normalizeMenuText = (value) => value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").trim().toLocaleLowerCase();
var findNextMenuItemIndex = (items, currentIndex, direction, loop = true) => {
	if (items.length === 0) return -1;
	for (let step = 1; step <= items.length; step += 1) {
		let index = currentIndex + step * direction;
		if (loop) index = (index + items.length) % items.length;
		else if (index < 0 || index >= items.length) return -1;
		if (!items[index].disabled) return index;
	}
	return -1;
};
var findMenuItemIndexByText = (items, query, currentIndex = -1) => {
	const normalizedQuery = normalizeMenuText(query);
	if (!normalizedQuery || items.length === 0) return -1;
	for (let step = 1; step <= items.length; step += 1) {
		const index = (currentIndex + step + items.length) % items.length;
		const item = items[index];
		if (!item.disabled && normalizeMenuText(item.text ?? "").startsWith(normalizedQuery)) return index;
	}
	return -1;
};
var setRef$2 = (ref, value) => {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
};
var getEnabledMenuItems = (menu) => Array.from(menu.querySelectorAll("[data-puzzle-dropdown-menu-item=\"true\"]")).filter((item) => item.getAttribute("aria-disabled") !== "true" && !("disabled" in item && Boolean(item.disabled)) && !item.hasAttribute("hidden") && !item.closest("[hidden], [inert], [aria-hidden='true']"));
var focusElement = (element) => {
	if (!element) return;
	try {
		element.focus({ preventScroll: true });
	} catch {
		element.focus();
	}
	element.scrollIntoView?.({ block: "nearest" });
};
var DropdownMenuContent = ({ children, id, className, style, maxHeight = "min(24rem, calc(100dvh - 2rem))", onKeyDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...contentProps }) => {
	const context = useDropdownMenuContext();
	const menuRef = (0, import_react.useRef)(null);
	const typeaheadRef = (0, import_react.useRef)("");
	const typeaheadTimerRef = (0, import_react.useRef)(null);
	const initialFocusDoneRef = (0, import_react.useRef)(false);
	const positioned = usePopoutPositioned();
	(0, import_react.useEffect)(() => {
		if (!context.open) initialFocusDoneRef.current = false;
		typeaheadRef.current = "";
		if (typeaheadTimerRef.current !== null) {
			clearTimeout(typeaheadTimerRef.current);
			typeaheadTimerRef.current = null;
		}
	}, [context.open]);
	(0, import_react.useEffect)(() => {
		if (!context.open) return;
		const menu = menuRef.current;
		if (!menu) return;
		if (!positioned || initialFocusDoneRef.current) return;
		initialFocusDoneRef.current = true;
		const items = getEnabledMenuItems(menu);
		focusElement((context.focusPositionRef.current === "last" ? items[items.length - 1] : items[0]) ?? menu);
	}, [
		context.open,
		context.focusPositionRef,
		positioned
	]);
	(0, import_react.useEffect)(() => () => {
		if (typeaheadTimerRef.current !== null) clearTimeout(typeaheadTimerRef.current);
	}, []);
	const focusIndex = (items, index) => {
		if (index >= 0 && index < items.length) focusElement(items[index]);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented) return;
		const menu = menuRef.current;
		if (!menu) return;
		if (event.key === "Tab") {
			const ownerDocument = event.currentTarget.ownerDocument;
			const trigger = context.triggerRef.current;
			const tabbableSelector = [
				"a[href]",
				"area[href]",
				"button:not([disabled])",
				"input:not([disabled]):not([type='hidden'])",
				"select:not([disabled])",
				"textarea:not([disabled])",
				"iframe",
				"object",
				"embed",
				"summary",
				"audio[controls]",
				"video[controls]",
				"[contenteditable='true']",
				"[tabindex]:not([tabindex='-1'])"
			].join(",");
			const tabbableElements = Array.from(ownerDocument.querySelectorAll(tabbableSelector)).filter((element) => {
				if (element === menu || menu.contains(element) || element.hidden || element.tabIndex < 0 || element.getAttribute("aria-disabled") === "true" || element.closest("[hidden], [inert], [aria-hidden='true']")) return false;
				const computedStyle = ownerDocument.defaultView?.getComputedStyle(element);
				return computedStyle?.display !== "none" && computedStyle?.visibility !== "hidden";
			});
			const triggerIndex = trigger ? tabbableElements.indexOf(trigger) : -1;
			const targetIndex = triggerIndex + (event.shiftKey ? -1 : 1);
			const target = triggerIndex >= 0 && tabbableElements.length > 0 ? tabbableElements[(targetIndex + tabbableElements.length) % tabbableElements.length] : void 0;
			context.changeOpen(false);
			if (target) {
				event.preventDefault();
				focusElement(target);
			}
			return;
		}
		const items = getEnabledMenuItems(menu);
		const activeIndex = items.indexOf(menu.ownerDocument.activeElement);
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const direction = event.key === "ArrowDown" ? 1 : -1;
			const startIndex = activeIndex < 0 ? direction === 1 ? -1 : 0 : activeIndex;
			const nextIndex = findNextMenuItemIndex(items.map(() => ({ disabled: false })), startIndex, direction);
			focusIndex(items, nextIndex);
			return;
		}
		if (event.key === "Home" || event.key === "End") {
			event.preventDefault();
			focusIndex(items, event.key === "Home" ? 0 : items.length - 1);
			return;
		}
		if (event.key.length !== 1 || event.key === " " || event.ctrlKey || event.metaKey || event.altKey) return;
		event.preventDefault();
		const nextBuffer = `${typeaheadRef.current}${event.key}`;
		const query = [...nextBuffer].every((character) => character.toLocaleLowerCase() === nextBuffer[0].toLocaleLowerCase()) ? event.key : nextBuffer;
		typeaheadRef.current = query;
		if (typeaheadTimerRef.current !== null) clearTimeout(typeaheadTimerRef.current);
		typeaheadTimerRef.current = setTimeout(() => {
			typeaheadRef.current = "";
			typeaheadTimerRef.current = null;
		}, 500);
		const nextIndex = findMenuItemIndexByText(items.map((item) => ({ text: item.dataset.textValue ?? item.querySelector(".puzzle-dropdown-menu__item-label")?.textContent ?? item.textContent ?? "" })), query, activeIndex);
		focusIndex(items, nextIndex);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...contentProps,
		ref: menuRef,
		id: id ?? context.contentId,
		className: cn("puzzle-dropdown-menu__content", className),
		role: "menu",
		"aria-orientation": "vertical",
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabel ? void 0 : ariaLabelledBy ?? context.triggerId,
		tabIndex: -1,
		"data-state": context.open ? "open" : "closed",
		style: {
			...style,
			maxHeight
		},
		onKeyDown: handleKeyDown,
		children
	});
};
var DropdownMenuTrigger = ({ asChild = false, children, id, className, disabled = false, onKeyDown, onPointerDown, ref, ...buttonProps }) => {
	const context = useDropdownMenuContext();
	const handleRef = (0, import_react.useCallback)((node) => {
		context.triggerRef.current = node;
		setRef$2(ref, node);
	}, [context.triggerRef, ref]);
	const child = asChild ? import_react.Children.only(children) : null;
	const childRef = (0, import_react.isValidElement)(child) ? child.props.ref : void 0;
	const handleChildRef = (0, import_react.useCallback)((node) => {
		handleRef(node);
		setRef$2(childRef, node);
	}, [childRef, handleRef]);
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled || context.disabled) return;
		const target = event.currentTarget;
		const isNativeButton = target.tagName === "BUTTON" || target.tagName === "INPUT";
		const isNativeLink = target.tagName === "A" && target.hasAttribute("href");
		const needsSyntheticActivation = asChild && !isNativeButton && (event.key === " " || event.key === "Enter" && !isNativeLink);
		if (event.key === "ArrowDown" || event.key === "ArrowUp" || needsSyntheticActivation) {
			event.preventDefault();
			context.openFromKeyboard(event.key === "ArrowUp" ? "last" : "first");
		}
	};
	const handlePointerDown = (event) => {
		onPointerDown?.(event);
		if (!event.defaultPrevented) context.focusPositionRef.current = "first";
	};
	const commonProps = {
		...buttonProps,
		id,
		ref: handleRef,
		className: cn("puzzle-dropdown-menu__trigger", className),
		"aria-haspopup": "menu",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		disabled: disabled || context.disabled,
		"data-state": context.open ? "open" : "closed",
		onKeyDown: handleKeyDown,
		onPointerDown: handlePointerDown
	};
	if (asChild) {
		if (!(0, import_react.isValidElement)(child)) throw new Error("DropdownMenu.Trigger with asChild expects one element.");
		if (child.type === import_react.Fragment) throw new Error("DropdownMenu.Trigger with asChild expects one non-Fragment element.");
		const childProps = child.props;
		const childDisabled = disabled || context.disabled || childProps.disabled === true || childProps["aria-disabled"] === true || childProps["aria-disabled"] === "true";
		const handleClick = (event) => {
			if (childDisabled) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			childProps.onClick?.(event);
			if (!event.defaultPrevented) buttonProps.onClick?.(event);
		};
		return (0, import_react.cloneElement)(child, {
			...buttonProps,
			id,
			ref: handleChildRef,
			className: cn("puzzle-dropdown-menu__trigger", childProps.className, className),
			role: child.type === "button" ? void 0 : "button",
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": context.open ? context.contentId : void 0,
			"aria-disabled": childDisabled || void 0,
			disabled: child.type === "button" ? childDisabled : void 0,
			...child.type === "button" ? { type: buttonProps.type ?? childProps.type ?? "button" } : {},
			tabIndex: childDisabled ? -1 : childProps.tabIndex ?? 0,
			"data-state": context.open ? "open" : "closed",
			onKeyDown: (event) => {
				childProps.onKeyDown?.(event);
				if (!event.defaultPrevented) handleKeyDown(event);
			},
			onPointerDown: (event) => {
				childProps.onPointerDown?.(event);
				if (!event.defaultPrevented) handlePointerDown(event);
			},
			onClick: handleClick
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...commonProps,
		type: "button",
		children
	});
};
var getMenuElements = (children) => import_react.Children.toArray(children).flatMap((child) => {
	if ((0, import_react.isValidElement)(child) && child.type === import_react.Fragment) return getMenuElements(child.props.children);
	return (0, import_react.isValidElement)(child) ? [child] : [];
});
var DropdownMenu = ({ children, open, defaultOpen = false, onOpenChange, disabled = false, position = "bottom", align = "start", offset = 8, collisionPadding = 8, matchTriggerWidth = false, triggerClassName, contentClassName }) => {
	const baseId = (0, import_react.useId)();
	const generatedTriggerId = `${baseId}-trigger`;
	const generatedContentId = `${baseId}-content`;
	const childElements = getMenuElements(children);
	const triggers = childElements.filter((child) => child.type === DropdownMenuTrigger);
	const contents = childElements.filter((child) => child.type === DropdownMenuContent);
	const triggerElement = triggers[0];
	const contentElement = contents[0];
	if (triggers.length !== 1 || contents.length !== 1 || !triggerElement || !contentElement) throw new Error("DropdownMenu requires exactly one DropdownMenu.Trigger and one DropdownMenu.Content.");
	const triggerChild = triggerElement.props.asChild ? import_react.Children.only(triggerElement.props.children) : null;
	const triggerChildProps = (0, import_react.isValidElement)(triggerChild) ? triggerChild.props : void 0;
	const triggerDisabled = disabled || triggerElement.props.disabled === true || triggerElement.props["aria-disabled"] === true || triggerElement.props["aria-disabled"] === "true" || triggerChildProps?.disabled === true || triggerChildProps?.["aria-disabled"] === true || triggerChildProps?.["aria-disabled"] === "true";
	const controlled = open !== void 0;
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const isOpen = !triggerDisabled && (controlled ? open ?? false : internalOpen);
	(0, import_react.useEffect)(() => {
		if (triggerDisabled && !controlled && internalOpen) {
			setInternalOpen(false);
			onOpenChange?.(false);
		}
	}, [
		controlled,
		internalOpen,
		onOpenChange,
		triggerDisabled
	]);
	const triggerRef = (0, import_react.useRef)(null);
	const focusPositionRef = (0, import_react.useRef)("first");
	const keyboardFocusPendingRef = (0, import_react.useRef)(false);
	const triggerId = triggerElement.props.id ?? triggerChildProps?.id ?? generatedTriggerId;
	const contentId = contentElement.props.id ?? generatedContentId;
	const changeOpen = (0, import_react.useCallback)((nextOpen) => {
		if (triggerDisabled && nextOpen) {
			keyboardFocusPendingRef.current = false;
			return;
		}
		if (nextOpen && !keyboardFocusPendingRef.current) focusPositionRef.current = "first";
		keyboardFocusPendingRef.current = false;
		if (nextOpen === isOpen) return;
		if (!controlled) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [
		controlled,
		isOpen,
		onOpenChange,
		triggerDisabled
	]);
	const context = {
		open: isOpen,
		disabled: triggerDisabled,
		triggerId,
		contentId,
		triggerRef,
		focusPositionRef,
		changeOpen,
		openFromKeyboard: (0, import_react.useCallback)((focusPosition) => {
			focusPositionRef.current = focusPosition;
			keyboardFocusPendingRef.current = true;
			changeOpen(true);
		}, [changeOpen]),
		close: (0, import_react.useCallback)((restoreFocus) => {
			changeOpen(false);
			if (restoreFocus) focusElement(triggerRef.current ?? void 0);
		}, [changeOpen])
	};
	const trigger = (0, import_react.cloneElement)(triggerElement, {
		id: triggerId,
		disabled: triggerDisabled,
		className: cn(triggerElement.props.className, triggerClassName)
	});
	const content = (0, import_react.cloneElement)(contentElement, {
		id: contentId,
		className: cn(contentElement.props.className, contentClassName)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContext.Provider, {
		value: context,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
			trigger,
			open: isOpen,
			onOpenChange: changeOpen,
			position,
			align,
			offset,
			collisionPadding,
			matchTriggerWidth,
			closeOnOutsideClick: true,
			closeOnEscape: true,
			toggleOnClick: true,
			contentClassName: "puzzle-dropdown-menu__popover",
			children: content
		})
	});
};
var DropdownMenuItem = ({ asChild = false, children, className, disabled = false, "aria-disabled": ariaDisabled, textValue, closeOnSelect = true, variant = "default", onClick, onKeyDown, onSelect, ...itemProps }) => {
	const context = useDropdownMenuContext();
	const itemDisabled = disabled || ariaDisabled === true || ariaDisabled === "true";
	const handleClick = (event) => {
		if (itemDisabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		onClick?.(event);
		if (event.defaultPrevented) return;
		onSelect?.(event);
		if (!event.defaultPrevented && closeOnSelect) context.close(true);
	};
	const classes = cn("puzzle-dropdown-menu__item", variant === "danger" && "puzzle-dropdown-menu__item--danger", className);
	if (asChild) {
		const child = import_react.Children.only(children);
		if (!(0, import_react.isValidElement)(child) || child.type === import_react.Fragment) throw new Error("DropdownMenu.Item with asChild expects one non-Fragment element.");
		const childProps = child.props;
		const childDisabled = itemDisabled || childProps.disabled === true || childProps["aria-disabled"] === true || childProps["aria-disabled"] === "true";
		return (0, import_react.cloneElement)(child, {
			...itemProps,
			role: "menuitem",
			tabIndex: -1,
			"aria-disabled": childDisabled || void 0,
			disabled: child.type === "button" ? childDisabled : void 0,
			...child.type === "button" ? { type: itemProps.type ?? childProps.type ?? "button" } : {},
			"data-puzzle-dropdown-menu-item": "true",
			"data-text-value": textValue,
			className: cn(classes, childProps.className),
			onClick: (event) => {
				if (childDisabled) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				childProps.onClick?.(event);
				if (!event.defaultPrevented) handleClick(event);
			},
			onKeyDown: (event) => {
				childProps.onKeyDown?.(event);
				if (!event.defaultPrevented) onKeyDown?.(event);
				if (event.defaultPrevented || childDisabled || event.key !== " ") return;
				event.preventDefault();
				event.currentTarget.click();
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...itemProps,
		type: "button",
		className: classes,
		role: "menuitem",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"data-puzzle-dropdown-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children
	});
};
var DropdownMenuGroup = ({ children, className, "aria-label": ariaLabel, ...groupProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...groupProps,
	className: cn("puzzle-dropdown-menu__group", className),
	role: "group",
	"aria-label": ariaLabel,
	children
});
var DropdownMenuLabel = ({ children, className, ...labelProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...labelProps,
	className: cn("puzzle-dropdown-menu__label", className),
	children
});
var DropdownMenuSeparator = ({ className, ...separatorProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...separatorProps,
	className: cn("puzzle-dropdown-menu__separator", className),
	role: "separator",
	"aria-orientation": "horizontal"
});
var DropdownMenuCheckboxItem = ({ children, checked, defaultChecked = false, onCheckedChange, closeOnSelect = false, textValue, className, disabled = false, "aria-disabled": ariaDisabled, onClick, onSelect, ...itemProps }) => {
	const context = useDropdownMenuContext();
	const itemDisabled = disabled || ariaDisabled === true || ariaDisabled === "true";
	const controlled = checked !== void 0;
	const [internalChecked, setInternalChecked] = (0, import_react.useState)(defaultChecked);
	const resolvedChecked = checked ?? internalChecked;
	const handleClick = (event) => {
		if (itemDisabled) {
			event.preventDefault();
			return;
		}
		onClick?.(event);
		if (event.defaultPrevented) return;
		onSelect?.(event);
		if (event.defaultPrevented) return;
		const nextChecked = resolvedChecked !== true;
		if (!controlled) setInternalChecked(nextChecked);
		onCheckedChange?.(nextChecked);
		if (closeOnSelect) context.close(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		...itemProps,
		type: "button",
		className: cn("puzzle-dropdown-menu__item", className),
		role: "menuitemcheckbox",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"aria-checked": resolvedChecked === "indeterminate" ? "mixed" : resolvedChecked,
		"data-state": resolvedChecked === "indeterminate" ? "indeterminate" : resolvedChecked ? "checked" : "unchecked",
		"data-puzzle-dropdown-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-dropdown-menu__indicator",
			"aria-hidden": "true",
			children: resolvedChecked === "indeterminate" ? "−" : resolvedChecked ? "✓" : ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-dropdown-menu__item-label",
			children
		})]
	});
};
var DropdownMenuRadioGroup = ({ children, value, defaultValue, onValueChange, className, ...groupProps }) => {
	const controlled = value !== void 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(defaultValue);
	const resolvedValue = controlled ? value : internalValue;
	const setValue = (0, import_react.useCallback)((nextValue) => {
		if (nextValue === resolvedValue) return;
		if (!controlled) setInternalValue(nextValue);
		onValueChange?.(nextValue);
	}, [
		controlled,
		onValueChange,
		resolvedValue
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupContext.Provider, {
		value: {
			value: resolvedValue,
			setValue
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			...groupProps,
			className: cn("puzzle-dropdown-menu__radio-group", className),
			role: "group",
			children
		})
	});
};
var DropdownMenuRadioItem = ({ children, value, closeOnSelect = true, textValue, className, disabled = false, "aria-disabled": ariaDisabled, onClick, onSelect, ...itemProps }) => {
	const context = useDropdownMenuContext();
	const radioGroup = useRadioGroupContext();
	const checked = radioGroup.value === value;
	const itemDisabled = disabled || ariaDisabled === true || ariaDisabled === "true";
	const handleClick = (event) => {
		if (itemDisabled) {
			event.preventDefault();
			return;
		}
		onClick?.(event);
		if (event.defaultPrevented) return;
		onSelect?.(event);
		if (event.defaultPrevented) return;
		radioGroup.setValue(value);
		if (closeOnSelect) context.close(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		...itemProps,
		type: "button",
		className: cn("puzzle-dropdown-menu__item", className),
		role: "menuitemradio",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"aria-checked": checked,
		"data-state": checked ? "checked" : "unchecked",
		"data-puzzle-dropdown-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-dropdown-menu__indicator",
			"aria-hidden": "true",
			children: checked ? "●" : ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-dropdown-menu__item-label",
			children
		})]
	});
};
var CompoundDropdownMenu = Object.assign(DropdownMenu, {
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Item: DropdownMenuItem,
	Group: DropdownMenuGroup,
	Label: DropdownMenuLabel,
	Separator: DropdownMenuSeparator,
	CheckboxItem: DropdownMenuCheckboxItem,
	RadioGroup: DropdownMenuRadioGroup,
	RadioItem: DropdownMenuRadioItem
});
var notificationId = 0;
var createNotificationId = () => {
	notificationId += 1;
	return `puzzle-notification-${notificationId}`;
};
var normalizeNotification = (input, severity = "info", defaults) => {
	const options = typeof input === "string" ? {
		title: input,
		severity
	} : input;
	return {
		...options,
		id: options.id ?? createNotificationId(),
		severity: options.severity ?? severity,
		closable: options.closable ?? true,
		duration: options.duration ?? defaults?.duration
	};
};
var NotificationContext = (0, import_react.createContext)(null);
var NotificationProvider = ({ children, position = "bottom-right", maxNotifications = 5, defaultDuration = 5e3, label = "Notifications" }) => {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const dismiss = (0, import_react.useCallback)((id) => {
		setNotifications((current) => current.filter((item) => item.id !== id));
	}, []);
	const dismissAll = (0, import_react.useCallback)(() => {
		setNotifications([]);
	}, []);
	const showWithSeverity = (0, import_react.useCallback)((severity, message, options) => {
		const item = normalizeNotification({
			...options,
			title: message,
			severity
		}, severity, { duration: defaultDuration });
		setNotifications((current) => {
			return [...current.filter((notification) => notification.id !== item.id), item].slice(-Math.max(1, maxNotifications));
		});
		return item.id;
	}, [defaultDuration, maxNotifications]);
	const show = (0, import_react.useCallback)((input) => {
		const item = normalizeNotification(input, "info", { duration: defaultDuration });
		setNotifications((current) => {
			return [...current.filter((notification) => notification.id !== item.id), item].slice(-Math.max(1, maxNotifications));
		});
		return item.id;
	}, [defaultDuration, maxNotifications]);
	const success = (0, import_react.useCallback)((message, options) => showWithSeverity("success", message, options), [showWithSeverity]);
	const info = (0, import_react.useCallback)((message, options) => showWithSeverity("info", message, options), [showWithSeverity]);
	const warning = (0, import_react.useCallback)((message, options) => showWithSeverity("warning", message, options), [showWithSeverity]);
	const error = (0, import_react.useCallback)((message, options) => showWithSeverity("error", message, options), [showWithSeverity]);
	const value = (0, import_react.useMemo)(() => ({
		show,
		success,
		info,
		warning,
		error,
		dismiss,
		dismissAll
	}), [
		show,
		success,
		info,
		warning,
		error,
		dismiss,
		dismissAll
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NotificationContext.Provider, {
		value,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationViewport, {
			notifications,
			position,
			label,
			onDismiss: dismiss
		}) })]
	});
};
var useNotification = () => {
	const context = (0, import_react.useContext)(NotificationContext);
	if (!context) throw new Error("useNotification must be used within a NotificationProvider.");
	return context;
};
var NotificationIcon = ({ severity }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: {
			success: "M5 12l4 4L19 6",
			info: "M12 8h.01M11 12h1v4h1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
			warning: "M12 9v4m0 4h.01M10.3 3.9L1.8 18.5A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z",
			error: "M18 6 6 18M6 6l12 12"
		}[severity] })
	});
};
var Notification = ({ notification, onDismiss }) => {
	const { id, severity, title, description, duration, action, closable } = notification;
	const [paused, setPaused] = (0, import_react.useState)(false);
	const remainingRef = (0, import_react.useRef)(duration ?? 0);
	const startedAtRef = (0, import_react.useRef)(0);
	const dismiss = (0, import_react.useCallback)(() => {
		onDismiss(id);
	}, [id, onDismiss]);
	(0, import_react.useEffect)(() => {
		if (!duration || duration <= 0 || paused) return;
		startedAtRef.current = Date.now();
		const timer = window.setTimeout(dismiss, remainingRef.current);
		return () => {
			window.clearTimeout(timer);
			remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
		};
	}, [
		duration,
		paused,
		dismiss
	]);
	(0, import_react.useEffect)(() => {
		const handleWindowBlur = () => setPaused(true);
		const handleWindowFocus = () => setPaused(false);
		window.addEventListener("blur", handleWindowBlur);
		window.addEventListener("focus", handleWindowFocus);
		return () => {
			window.removeEventListener("blur", handleWindowBlur);
			window.removeEventListener("focus", handleWindowFocus);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const handleVisibilityChange = () => {
			setPaused(document.visibilityState !== "visible");
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);
	const handleAction = () => {
		try {
			action?.onClick();
		} finally {
			dismiss();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("puzzle-notification", `puzzle-notification--${severity}`),
		"data-severity": severity,
		role: severity === "error" ? "alert" : "status",
		"aria-live": severity === "error" ? "assertive" : "polite",
		"aria-atomic": "true",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: (event) => {
			if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-notification__icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationIcon, { severity })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-notification__content",
				children: [
					title != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-notification__title",
						children: title
					}),
					description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-notification__description",
						children: description
					}),
					action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "puzzle-notification__action",
						onClick: handleAction,
						children: action.label
					})
				]
			}),
			closable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "puzzle-notification__close",
				"aria-label": "Dismiss notification",
				onClick: dismiss,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					"aria-hidden": "true",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6 6 18M6 6l12 12" })
				})
			})
		]
	});
};
var NotificationViewport = ({ notifications, position, label, onDismiss }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("puzzle-notification-viewport", `puzzle-notification-viewport--${position}`),
	role: "region",
	"aria-label": label,
	style: { "--puzzle-notification-count": notifications.length },
	children: notifications.map((notification) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notification, {
		notification,
		onDismiss
	}, notification.id))
});
var FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type='hidden'])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
	"[contenteditable='true']"
].join(",");
var getFocusable = (dialog) => Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
/** Returns whether focus actually landed inside the dialog. */
var focusFirst = (dialog) => {
	(getFocusable(dialog)[0] ?? dialog).focus({ preventScroll: true });
	return dialog.contains(dialog.ownerDocument.activeElement);
};
var setRef$1 = (ref, value) => {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
};
var PopoverContent = ({ id, title, ariaLabel, closable, closeLabel, skipAutoFocusRef, dialogRef, anchorRef, onClose, children, className }) => {
	const titleId = `${id}-title`;
	(0, import_react.useEffect)(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (skipAutoFocusRef.current) {
			skipAutoFocusRef.current = false;
			return;
		}
		const surface = dialog.parentElement;
		if (focusFirst(dialog) || !surface) return;
		const observer = new ((dialog.ownerDocument.defaultView?.MutationObserver) ?? MutationObserver)(() => {
			if (surface.style.visibility !== "hidden") {
				observer.disconnect();
				focusFirst(dialog);
			}
		});
		observer.observe(surface, {
			attributes: true,
			attributeFilter: ["style"]
		});
		return () => observer.disconnect();
	}, [dialogRef, skipAutoFocusRef]);
	const handleBlur = (event) => {
		const next = event.relatedTarget;
		if (next && !event.currentTarget.contains(next) && !anchorRef.current?.contains(next)) onClose();
	};
	const handleKeyDown = (event) => {
		if (event.key !== "Tab") return;
		const dialog = event.currentTarget;
		const focusable = getFocusable(dialog);
		const active = dialog.ownerDocument.activeElement;
		const first = focusable[0] ?? dialog;
		const last = focusable[focusable.length - 1] ?? dialog;
		if (event.shiftKey && (active === first || active === dialog)) {
			event.preventDefault();
			anchorRef.current?.focus({ preventScroll: true });
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			onClose();
			anchorRef.current?.focus({ preventScroll: true });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: dialogRef,
		id,
		role: "dialog",
		"aria-labelledby": title != null ? titleId : void 0,
		"aria-label": title == null ? ariaLabel : void 0,
		tabIndex: -1,
		className: cn("puzzle-popover", className),
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
		children: [(title != null || closable) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "puzzle-popover__header",
			children: [title != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: titleId,
				className: "puzzle-popover__title",
				children: title
			}), closable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "puzzle-popover__close",
				"aria-label": closeLabel,
				onClick: () => {
					onClose();
					anchorRef.current?.focus({ preventScroll: true });
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "×"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-popover__body",
			children
		})]
	});
};
var Popover = ({ trigger, children, title, "aria-label": ariaLabel, closable = false, closeLabel = "Close", position = "bottom", align = "center", offset = 8, open, defaultOpen, onOpenChange, className, triggerClassName }) => {
	const popoverId = (0, import_react.useId)();
	const anchorRef = (0, import_react.useRef)(null);
	const dialogRef = (0, import_react.useRef)(null);
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen ?? false);
	const isOpen = open ?? internalOpen;
	const skipAutoFocusRef = (0, import_react.useRef)(isOpen);
	const handleOpenChange = (0, import_react.useCallback)((nextOpen) => {
		if (open === void 0) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [open, onOpenChange]);
	const handleTriggerRef = (0, import_react.useCallback)((node) => {
		anchorRef.current = node;
		setRef$1(trigger.props.ref, node);
	}, [trigger]);
	const handleTriggerKeyDown = (event) => {
		trigger.props.onKeyDown?.(event);
		if (event.defaultPrevented || event.key !== "Tab" || event.shiftKey || !isOpen || !dialogRef.current) return;
		event.preventDefault();
		focusFirst(dialogRef.current);
	};
	const triggerElement = (0, import_react.cloneElement)(trigger, {
		ref: handleTriggerRef,
		onKeyDown: handleTriggerKeyDown,
		"aria-haspopup": "dialog",
		"aria-expanded": isOpen,
		"aria-controls": isOpen ? popoverId : void 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
		trigger: triggerElement,
		position,
		align,
		action: "click",
		toggleOnClick: true,
		offset,
		open: isOpen,
		onOpenChange: handleOpenChange,
		closeOnOutsideClick: true,
		closeOnEscape: true,
		className: triggerClassName,
		contentClassName: "puzzle-popover__surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			id: popoverId,
			title,
			ariaLabel,
			closable,
			closeLabel,
			skipAutoFocusRef,
			dialogRef,
			anchorRef,
			onClose: () => handleOpenChange(false),
			className,
			children
		})
	});
};
var PortalTarget = ({ id, className, children, ...props }) => {
	const classes = cn("puzzle-portal-target", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id,
		className: classes,
		...props,
		children
	});
};
var arrowSize = 8;
var setRef = (ref, value) => {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
};
var TooltipContent = ({ id, children, className }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		role: "tooltip",
		className: cn("puzzle-tooltip", className),
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "puzzle-tooltip__arrow"
		})]
	});
};
var Tooltip = ({ trigger, children, position = "bottom", align = "center", offset = arrowSize, exitDelay = 100, open, defaultOpen = false, onOpenChange, className, triggerClassName }) => {
	const tooltipId = (0, import_react.useId)();
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const isOpen = open ?? internalOpen;
	const handleOpenChange = (0, import_react.useCallback)((nextOpen) => {
		if (open === void 0) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [open, onOpenChange]);
	const handleFocus = (event) => {
		trigger.props.onFocus?.(event);
		if (!event.defaultPrevented) handleOpenChange(true);
	};
	const handleBlur = (event) => {
		trigger.props.onBlur?.(event);
		if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget)) handleOpenChange(false);
	};
	const describedBy = [trigger.props["aria-describedby"], isOpen ? tooltipId : void 0].filter(Boolean).join(" ");
	const triggerElement = (0, import_react.cloneElement)(trigger, {
		ref: (node) => {
			setRef(trigger.props.ref, node);
		},
		onFocus: handleFocus,
		onBlur: handleBlur,
		"aria-describedby": describedBy || void 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
		trigger: triggerElement,
		position,
		align,
		action: "hover",
		offset,
		exitDelay,
		open: isOpen,
		onOpenChange: handleOpenChange,
		closeOnOutsideClick: true,
		closeOnEscape: true,
		className: triggerClassName,
		contentClassName: "puzzle-tooltip__content",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
			id: tooltipId,
			className,
			children
		})
	});
};
export { Accordion, Autocomplete, Command, CommandDialog, CompoundDropdownMenu, DatePicker, Dialog, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, FileUpload, FormField, Label, LinearProgress, Notification, NotificationProvider, NotificationViewport, Popout, Popover, Portal, PortalTarget, ResizableHandle, ResizablePanel, ResizablePanels, Select, Slider, Stepper, Tabs, TabsTab, Tooltip, getProgressAriaProps, normalizeProgressValue, useNotification, usePopoutPositioned, useRovingFocus };
