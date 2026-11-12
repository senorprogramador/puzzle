import { __toESM } from "./_runtime.mjs";
import { __exportAll as __exportAll$1 } from "./_ssr/rolldown-runtime-BrwM56v-.mjs";
import { DismissableLayer, FocusScope, FocusScopeBranchProvider, FrameworkProvider, I18nProvider, Image as Image$2, Link, Presence, Primitive, ReactRemoveScroll, buttonVariants, cn, composeEventHandlers, createContextScope, createSlot, createSlottable, cva, e, hideOthers, isEqualShallow, require_lucide_react, useCallbackRef$1, useComposedRefs, useControllableState, useFocusGuards, useFocusScopeBranch, useFocusScopeBranchRegistry, useI18n, useId$1, useLayoutEffect2, useOnChange, usePathname, useTranslations } from "./_ssr/dist-sg2c9ME_.mjs";
import { normalizeUrl } from "./_ssr/url-BF81yL4m-CIPmfM51.mjs";
import { docs, findPath, findProjection, visit } from "./_ssr/source-DxywneDS.mjs";
import { Backdrop, Button, Card as Card$1, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Carousel, CarouselController, Drawer, ScrollLock, Stack, Transition, resolveResponsiveValue, useCarouselContext } from "./_ssr/carousel-CXz3WO3t.mjs";
import { Icon$1, Link as Link$1, Section, cn as cn$1, getContainerPresetClass } from "./_ssr/section-BhsGlFRU.mjs";
import { Accordion, Autocomplete, Command, CommandDialog, CompoundDropdownMenu, DatePicker, Dialog, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, FileUpload, FormField, Label, LinearProgress, Notification, NotificationProvider, NotificationViewport, Popout, Popover as Popover$2, Portal as Portal$1, PortalTarget, ResizableHandle, ResizablePanel, ResizablePanels, Select, Slider, Stepper, Tabs as Tabs$3, TabsTab, Tooltip, getProgressAriaProps, normalizeProgressValue, useNotification, usePopoutPositioned, useRovingFocus } from "./_ssr/tooltip-CNnboNv3.mjs";
import { AppBar, Badge, Checkbox, Header as Header$2, Heading as Heading$1, PageLayout, SectionStack, Switch, Text, TextInput, clamp as clamp$4, hslToCss, isColorDark, parseColor, rgbToCss, rgbToHsl } from "./_ssr/header-BlP--mVN.mjs";
import { ThemeScopeProvider, useThemeComponents, useThemeScope } from "./_ssr/scope-context-gETs7uAh.mjs";
import { BottomNavigation, BottomNavigationItem } from "./_ssr/bottom-navigation-Bfm20zFO.mjs";
import { stringWithCasing } from "./_ssr/casing-BRvB1fDS.mjs";
import { Route } from "./_-DAwSJOMB.mjs";
import { require_react } from "./_libs/react.mjs";
import { Link as Link$3, useNavigate, useParams } from "./_libs/@tanstack/react-router+[2...].mjs";
import { useMatchRoute } from "./_libs/tanstack__react-router.mjs";
import { useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { useRouterState } from "./_libs/tanstack__react-router2.mjs";
import { require_jsx_runtime } from "./_libs/react2.mjs";
import { require_react_dom } from "./_libs/react-dom.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-uum16i8j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var NAME_PARTICLES = /* @__PURE__ */ new Set([
	"van",
	"den",
	"der",
	"de",
	"ter",
	"ten",
	"te",
	"het",
	"'t",
	"von",
	"vom",
	"zum",
	"zur",
	"zu",
	"du",
	"des",
	"le",
	"la",
	"les",
	"del",
	"los",
	"las",
	"da",
	"das",
	"do",
	"dos",
	"di",
	"della",
	"delle",
	"dello",
	"dei",
	"degli",
	"al",
	"el",
	"bin",
	"ibn",
	"bint",
	"af",
	"av",
	"ap",
	"ab"
]);
var NAME_SUFFIXES = /* @__PURE__ */ new Set([
	"jr",
	"sr",
	"ii",
	"iii",
	"iv",
	"v",
	"phd",
	"md"
]);
var normalizeNamePart = (part) => {
	return part.toLocaleLowerCase().replace(/[\p{P}\p{S}]/gu, "");
};
var getFirstLetter = (part) => {
	return part.match(/\p{L}/u)?.[0].toLocaleUpperCase() ?? "";
};
var nameToInitials = (name) => {
	const parts = name.trim().split(/\s+/u).filter(Boolean);
	const [firstPart] = parts;
	if (firstPart === void 0) return "?";
	while (parts.length > 1 && NAME_SUFFIXES.has(normalizeNamePart(parts.at(-1)))) parts.pop();
	const firstInitial = getFirstLetter(firstPart);
	if (parts.length === 1) return firstInitial;
	return firstInitial + getFirstLetter([...parts.slice(1)].reverse().find((part) => !NAME_PARTICLES.has(normalizeNamePart(part))) ?? parts.at(-1));
};
var rgbToHex = (r, g, b, a) => {
	const channel = (value) => Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, "0");
	const alpha = a !== void 0 && a < 1 ? channel(Math.min(1, Math.max(0, a)) * 255) : "";
	return `#${channel(r)}${channel(g)}${channel(b)}${alpha}`;
};
var ButtonGroup = ({ as, orientation = "horizontal", attached = false, fullWidth = false, disabled = false, spacing, className, children, style, ...props }) => {
	const Component = as ?? "div";
	const classes = cn$1("puzzle-button-group", `puzzle-button-group--${orientation}`, attached && "puzzle-button-group--attached", fullWidth && "puzzle-button-group--full-width", disabled && "puzzle-button-group--disabled", className);
	const groupStyle = {
		...style,
		...spacing !== void 0 ? { "--puzzle-button-group-gap": typeof spacing === "number" ? `${spacing}px` : spacing } : {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		...props,
		className: classes,
		style: groupStyle,
		role: props.role ?? "group",
		"aria-disabled": disabled || void 0,
		children: import_react.Children.map(children, (child) => disabled && (0, import_react.isValidElement)(child) ? (0, import_react.cloneElement)(child, { disabled: true }) : child)
	});
};
var ToggleGroupContext = (0, import_react.createContext)(null);
var useToggleGroupContext = () => {
	const context = (0, import_react.useContext)(ToggleGroupContext);
	if (!context) throw new Error("ToggleGroup.Item must be rendered inside a ToggleGroup.");
	return context;
};
var ToggleGroupItem = ({ value, disabled = false, onClick, onFocus, onKeyDown, children, ...buttonProps }) => {
	const context = useToggleGroupContext();
	const isDisabled = context.disabled || disabled;
	const isSelected = context.selectedValues.includes(value);
	const handleClick = (event) => {
		onClick?.(event);
		if (!event.defaultPrevented) context.toggleValue(value);
	};
	const handleFocus = (event) => {
		context.rovingFocus.onItemFocus(value);
		onFocus?.(event);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (!event.defaultPrevented) context.rovingFocus.onItemKeyDown(event, value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		...buttonProps,
		ref: context.rovingFocus.getItemRef(value),
		type: "button",
		size: context.size,
		variant: isSelected ? "toggle-active" : "toggle",
		disabled: isDisabled,
		tabIndex: context.rovingFocus.getItemTabIndex(value, isDisabled),
		"aria-pressed": isSelected,
		"data-state": isSelected ? "on" : "off",
		"data-disabled": isDisabled ? "true" : void 0,
		onClick: handleClick,
		onFocus: handleFocus,
		onKeyDown: handleKeyDown,
		children
	});
};
var isToggleGroupItem = (child) => (0, import_react.isValidElement)(child) && child.type === ToggleGroupItem;
var getToggleGroupItems = (children) => import_react.Children.toArray(children).flatMap((child) => {
	if ((0, import_react.isValidElement)(child) && child.type === import_react.Fragment) return getToggleGroupItems(child.props.children);
	return isToggleGroupItem(child) ? [child] : [];
});
var ToggleGroupRoot = (props) => {
	const { type: groupType = "single", value, defaultValue, onValueChange, orientation = "horizontal", size = "md", dir = "ltr", disabled = false, loop = true, required = false, attached = false, fullWidth = false, spacing, children, className, style, role, ...rootProps } = props;
	const isMultiple = groupType === "multiple";
	const [uncontrolledValues, setUncontrolledValues] = (0, import_react.useState)(() => {
		if (isMultiple) return [...defaultValue ?? []];
		return defaultValue == null ? [] : [defaultValue];
	});
	const controlledValue = isMultiple ? value : value;
	const isControlled = controlledValue !== void 0;
	const selectedValues = isControlled ? isMultiple ? controlledValue : controlledValue == null ? [] : [controlledValue] : uncontrolledValues;
	const toggleValue = (0, import_react.useCallback)((nextValue) => {
		const isSelected = selectedValues.includes(nextValue);
		let nextValues;
		if (isMultiple) {
			if (isSelected && required && selectedValues.length === 1) return;
			nextValues = isSelected ? selectedValues.filter((item) => item !== nextValue) : [...selectedValues, nextValue];
		} else {
			if (isSelected && required) return;
			nextValues = isSelected ? [] : [nextValue];
		}
		if (!(nextValues.length !== selectedValues.length || nextValues.some((item, index) => item !== selectedValues[index]))) return;
		if (!isControlled) setUncontrolledValues(nextValues);
		if (isMultiple) onValueChange?.(nextValues);
		else onValueChange?.(nextValues[0]);
	}, [
		isControlled,
		isMultiple,
		onValueChange,
		required,
		selectedValues
	]);
	const rovingItems = getToggleGroupItems(children).map((item) => ({
		id: item.props.value,
		disabled: disabled || item.props.disabled
	}));
	const contextValue = {
		selectedValues,
		disabled,
		size,
		toggleValue,
		rovingFocus: useRovingFocus({
			items: rovingItems,
			orientation,
			dir,
			loop,
			initialActiveId: selectedValues[0]
		})
	};
	const groupStyle = spacing === void 0 ? style : {
		...style,
		"--puzzle-toggle-group-gap": typeof spacing === "number" ? `${spacing}px` : spacing
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			...rootProps,
			className: cn$1("puzzle-toggle-group", className),
			style: groupStyle,
			role: role ?? "group",
			dir,
			"aria-disabled": disabled || void 0,
			"data-orientation": orientation,
			"data-attached": attached ? "true" : void 0,
			"data-full-width": fullWidth ? "true" : void 0,
			children
		})
	});
};
var ToggleGroup = Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });
var getAlertSemantics = (severity) => {
	const isUrgent = severity === "error" || severity === "warning";
	return {
		role: isUrgent ? "alert" : "status",
		ariaLive: isUrgent ? "assertive" : "polite"
	};
};
var AlertIcon = ({ severity }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "puzzle-alert__icon",
		viewBox: "0 0 24 24",
		width: "20",
		height: "20",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		focusable: "false",
		children: {
			success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m5 12 4 4L19 6" }) }),
			info: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 16v-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8h.01" })
			] }),
			warning: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 9v4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 17h.01" })
			] }),
			error: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m15 9-6 6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 9 6 6" })
			] })
		}[severity]
	});
};
var CloseIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	"aria-hidden": "true",
	focusable: "false",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m18 6-12 12M6 6l12 12" })
});
var Alert = ({ severity = "info", variant = "standard", title, icon, closable = false, closeLabel = "Dismiss alert", onClose, children, className, style, ...props }) => {
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	if (dismissed) return null;
	const handleClose = () => {
		setDismissed(true);
		onClose?.();
	};
	const classes = cn$1("puzzle-alert", `puzzle-alert--${severity}`, `puzzle-alert--${variant}`, className);
	const semantics = getAlertSemantics(severity);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...props,
		className: classes,
		style,
		role: semantics.role,
		"aria-live": semantics.ariaLive,
		"aria-atomic": "true",
		children: [
			icon !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-alert__icon-wrapper",
				children: icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertIcon, { severity })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-alert__content",
				children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-alert__title",
					children: title
				}), children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-alert__description",
					children
				})]
			}),
			closable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "puzzle-alert__close",
				"aria-label": closeLabel,
				onClick: handleClose,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseIcon, {})
			})
		]
	});
};
var Avatar = ({ src, alt, size: propsSize = 32, shape = "circle", className, onError, ...rest }) => {
	const [failedSrc, setFailedSrc] = (0, import_react.useState)(null);
	const classes = cn$1("puzzle-avatar", `puzzle-avatar-${shape}`, className);
	const size = Math.max(propsSize, 1);
	if (src && failedSrc !== src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		width: size,
		height: size,
		className: classes,
		...rest,
		onError: (event) => {
			onError?.(event);
			setFailedSrc(src);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": alt || void 0,
		"aria-hidden": alt ? void 0 : true,
		className: classes,
		style: {
			width: size,
			height: size
		},
		...rest,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "puzzle-avatar-initials",
			children: nameToInitials(alt ?? "")
		})
	});
};
var getEmptyStateClasses = (size, variant, className) => cn$1("puzzle-empty-state", `puzzle-empty-state--${size}`, `puzzle-empty-state--${variant}`, className);
var EmptyState = ({ size = "md", variant = "default", className, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: getEmptyStateClasses(size, variant, className),
	"data-size": size,
	"data-variant": variant,
	children
});
var EmptyStateHeader = ({ className, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn$1("puzzle-empty-state__header", className),
	children
});
var EmptyStateMedia = ({ variant = "default", className, children, "aria-label": ariaLabel, "aria-hidden": ariaHidden, role, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn$1("puzzle-empty-state__media", `puzzle-empty-state__media--${variant}`, className),
	"data-variant": variant,
	role: ariaLabel ? role ?? "img" : role,
	"aria-label": ariaLabel,
	"aria-hidden": ariaLabel ? void 0 : ariaHidden ?? true,
	children
});
var EmptyStateTitle = ({ className, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
	...props,
	className: cn$1("puzzle-empty-state__title", className),
	children
});
var EmptyStateDescription = ({ className, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
	...props,
	className: cn$1("puzzle-empty-state__description", className),
	children
});
var EmptyStateContent = ({ className, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn$1("puzzle-empty-state__content", className),
	children
});
/**
* Checks whether an image source contains a usable URL.
*/
var hasImageSource = (source) => {
	if (typeof source === "string") return source.trim().length > 0;
	return typeof source?.src === "string" && source.src.length > 0;
};
/**
* Resolves a source to a regular URL.
*
* Static image objects are converted to their `src` property.
*/
var getImageSourceUrl = (source) => {
	if (!hasImageSource(source)) return;
	return typeof source === "string" ? source : source.src;
};
/**
* Retrieves intrinsic dimensions from static image imports.
*/
var getImageDimensions = (source) => {
	if (typeof source !== "object" || source === null) return;
	return {
		width: source.width,
		height: source.height
	};
};
/**
* Resolves an explicitly provided or statically imported blur image.
*/
var getImageBlurDataURL = (source) => {
	if (typeof source !== "object" || source === null) return;
	return source.blurDataURL;
};
/**
* Resolves semantic radius values to Puzzle theme tokens.
*/
var resolveImageRadius = (radius) => {
	if (radius === void 0) return;
	return {
		none: "0",
		sm: "var(--puzzle-radius-sm, 0.25rem)",
		md: "var(--puzzle-radius-md, 0.5rem)",
		lg: "var(--puzzle-radius-lg, 0.75rem)",
		xl: "var(--puzzle-radius-xl, 1rem)",
		full: "var(--puzzle-radius-full, 9999px)"
	}[radius] ?? radius;
};
var createImageState = (source, fallbackSource) => {
	return {
		source,
		fallbackSource,
		usingFallback: !hasImageSource(source) && hasImageSource(fallbackSource),
		status: "loading"
	};
};
var useImageState = (source, fallbackSource) => {
	const [state, setState] = (0, import_react.useState)(() => createImageState(source, fallbackSource));
	const isCurrentSource = Object.is(state.source, source) && Object.is(state.fallbackSource, fallbackSource);
	const usingFallback = isCurrentSource ? state.usingFallback : !hasImageSource(source) && hasImageSource(fallbackSource);
	const status = isCurrentSource ? state.status : "loading";
	return {
		activeSource: usingFallback ? fallbackSource : source,
		usingFallback,
		status,
		markLoaded: (0, import_react.useCallback)(() => {
			setState({
				source,
				fallbackSource,
				usingFallback,
				status: "loaded"
			});
		}, [
			source,
			fallbackSource,
			usingFallback
		]),
		markError: (0, import_react.useCallback)(() => {
			setState((current) => {
				const currentUsesFallback = Object.is(current.source, source) && Object.is(current.fallbackSource, fallbackSource) ? current.usingFallback : !hasImageSource(source) && hasImageSource(fallbackSource);
				if (!currentUsesFallback && hasImageSource(fallbackSource)) return {
					source,
					fallbackSource,
					usingFallback: true,
					status: "loading"
				};
				return {
					source,
					fallbackSource,
					usingFallback: currentUsesFallback,
					status: "error"
				};
			});
		}, [source, fallbackSource])
	};
};
var Image = ({ src, alt, width, height, fit = "cover", position = "center", aspectRatio, fill = false, radius, fallbackSrc, fallback, loadingPlaceholder, placeholder = "empty", blurDataURL, sources, component, componentProps, quality, preload: preload$1 = false, unoptimized, className, style, containerClassName, containerStyle, loading, fetchPriority, decoding, srcSet, sizes, crossOrigin, referrerPolicy, ref, onLoad, onError, ...rest }) => {
	const configuredImage = useThemeComponents()?.image;
	const Component = component ?? configuredImage ?? "img";
	const isNativeImage = Component === "img";
	const { activeSource, usingFallback, status, markLoaded, markError } = useImageState(src, fallbackSrc);
	const hasActiveSource = hasImageSource(activeSource);
	const sourceUrl = getImageSourceUrl(activeSource);
	const sourceDimensions = getImageDimensions(activeSource);
	const resolvedWidth = width ?? sourceDimensions?.width;
	const resolvedHeight = height ?? sourceDimensions?.height;
	const resolvedBlurDataURL = blurDataURL ?? getImageBlurDataURL(activeSource);
	const imageRef = (0, import_react.useRef)(null);
	/**
	* Assigns the image element to both the internal and external refs.
	*/
	const setImageRef = (0, import_react.useCallback)((node) => {
		imageRef.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	/**
	* Handles successful image loading.
	*/
	const handleLoad = (0, import_react.useCallback)((event) => {
		markLoaded();
		onLoad?.(event);
	}, [markLoaded, onLoad]);
	/**
	* Handles image loading failures.
	*/
	const handleError = (0, import_react.useCallback)((event) => {
		markError();
		onError?.(event);
	}, [markError, onError]);
	/**
	* Handles images that were loaded before React attached its listeners.
	*
	* This is particularly useful for cached images during hydration.
	*/
	(0, import_react.useEffect)(() => {
		const image = imageRef.current;
		if (!image || !image.complete) return;
		if (image.naturalWidth > 0) markLoaded();
	}, [activeSource, markLoaded]);
	/**
	* Preloads native images using React DOM.
	*
	* Framework image components handle their own preload behavior.
	*/
	if (preload$1 && isNativeImage && sourceUrl) (0, import_react_dom.preload)(sourceUrl, {
		as: "image",
		crossOrigin,
		fetchPriority: fetchPriority ?? "high",
		imageSrcSet: srcSet,
		imageSizes: sizes,
		referrerPolicy
	});
	const mediaStyle = {
		...fill || aspectRatio ? {
			width: "100%",
			height: "100%"
		} : {},
		...fill ? {
			position: "absolute",
			inset: 0
		} : {},
		objectFit: fit,
		objectPosition: position,
		...style
	};
	const wrapperStyle = {
		...aspectRatio ? {
			aspectRatio,
			width: "100%"
		} : {},
		...fill ? {
			position: "relative",
			display: "block",
			width: "100%",
			...aspectRatio ? {} : { height: "100%" }
		} : {},
		...radius ? { borderRadius: resolveImageRadius(radius) } : {},
		...containerStyle
	};
	const isLoading = hasActiveSource && status === "loading";
	const shouldShowFallback = fallback !== void 0 && (!hasActiveSource || status === "error");
	if (!hasActiveSource && !shouldShowFallback) return null;
	const renderedSource = isNativeImage ? sourceUrl : activeSource;
	/**
	* Framework-specific props are only forwarded to custom components.
	* This prevents invalid attributes from leaking onto native img tags.
	*/
	const imageElement = (0, import_react.createElement)(Component, {
		...!isNativeImage ? componentProps : {},
		...rest,
		key: usingFallback ? "fallback" : "source",
		ref: setImageRef,
		src: renderedSource,
		alt,
		width: resolvedWidth,
		height: resolvedHeight,
		loading,
		fetchPriority,
		decoding,
		crossOrigin,
		referrerPolicy,
		srcSet,
		sizes,
		className: cn$1("puzzle-image__media", className),
		style: mediaStyle,
		onLoad: handleLoad,
		onError: handleError,
		...fill && !isNativeImage ? { fill: true } : {},
		...preload$1 && !isNativeImage ? { preload: true } : {},
		...quality !== void 0 && !isNativeImage ? { quality } : {},
		...unoptimized !== void 0 && !isNativeImage ? { unoptimized } : {},
		...!isNativeImage && placeholder === "blur" && resolvedBlurDataURL ? {
			placeholder: "blur",
			blurDataURL: resolvedBlurDataURL
		} : {}
	});
	/**
	* Picture sources allow art direction and responsive source selection.
	*/
	const media = sources?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", {
		className: "puzzle-image__picture",
		children: [sources.map((source, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
			srcSet: source.srcSet,
			media: source.media,
			type: source.type,
			sizes: source.sizes
		}, `${source.srcSet}-${index}`)), imageElement]
	}) : imageElement;
	const showLoadingPlaceholder = isLoading && loadingPlaceholder !== void 0;
	const showBlurPlaceholder = isLoading && !loadingPlaceholder && isNativeImage && placeholder === "blur" && Boolean(resolvedBlurDataURL);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("puzzle-image", containerClassName),
		style: wrapperStyle,
		"data-status": hasActiveSource ? status : "empty",
		"data-image-fill": fill ? "true" : void 0,
		"data-image-ratio": aspectRatio ? "true" : void 0,
		children: [
			showBlurPlaceholder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "puzzle-image__blur",
				src: resolvedBlurDataURL,
				alt: "",
				"aria-hidden": "true"
			}) : null,
			showLoadingPlaceholder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-image__placeholder",
				"aria-hidden": "true",
				children: loadingPlaceholder
			}) : null,
			shouldShowFallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-image__fallback",
				role: alt ? "img" : void 0,
				"aria-label": alt || void 0,
				"aria-hidden": alt ? void 0 : true,
				children: fallback
			}) : media
		]
	});
};
var Paper = ({ as, elevation = 1, children, className, ...rest }) => {
	const Component = as || "div";
	const classes = cn$1("puzzle-paper", `elevation-${elevation}`, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		className: classes,
		...rest,
		children
	});
};
var getDimension = (size) => {
	switch (size) {
		case "sm": return 24 + 2 * getStrokeWidth(size);
		case "md": return 44 + 2 * getStrokeWidth(size);
		case "lg": return 64 + 2 * getStrokeWidth(size);
	}
};
var getHalfDimension = (size) => {
	return .5 * getDimension(size) - getStrokeWidth(size);
};
var getStrokeWidth = (size) => {
	switch (size) {
		case "sm": return 2;
		case "md": return 3.6;
		case "lg": return 4;
	}
};
var getCenter = (size) => {
	switch (size) {
		case "sm": return 12 + getStrokeWidth(size);
		case "md": return 22 + getStrokeWidth(size);
		case "lg": return 32 + getStrokeWidth(size);
	}
};
var getStrokeDasharray = (size) => {
	switch (size) {
		case "sm": return 84;
		case "md": return 128;
		case "lg": return 192;
	}
};
var CircularProgress = ({ color, className, "aria-label": ariaLabel = "Loading...", value: rawValue, size = "md", showTrack = true, ...props }) => {
	const value = normalizeProgressValue(rawValue);
	const classes = cn$1("puzzle-circular-progress", value === void 0 && "puzzle-circular-progress-indeterminate", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...props,
		...getProgressAriaProps(value),
		className: classes,
		"aria-label": ariaLabel,
		color: color ?? "var(--puzzle-color-primary)",
		width: getDimension(size),
		height: getDimension(size),
		viewBox: `0 0 ${getDimension(size)} ${getDimension(size)}`,
		children: [showTrack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			className: "puzzle-circular-progress-track",
			cx: getCenter(size),
			cy: getCenter(size),
			r: getHalfDimension(size),
			fill: "none",
			stroke: "currentColor",
			strokeWidth: getStrokeWidth(size),
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			className: "puzzle-circular-progress-circle",
			cx: getCenter(size),
			cy: getCenter(size),
			r: getHalfDimension(size),
			fill: "none",
			stroke: "currentColor",
			strokeWidth: getStrokeWidth(size),
			strokeLinecap: "round",
			strokeDasharray: getStrokeDasharray(size),
			style: { strokeDashoffset: value !== void 0 ? `${getStrokeDasharray(size) - value / 100 * getStrokeDasharray(size)}px` : "32px" }
		})]
	});
};
var src_exports$2 = /* @__PURE__ */ __exportAll$1({ Icon: () => Icon$1 });
var normalizeRating = (value, max, precision) => {
	if (!Number.isFinite(value)) return 0;
	return Math.round(Math.min(max, Math.max(0, value)) / precision) * precision;
};
var getRatingStarState = (value, index) => {
	const remainder = value - index;
	if (remainder >= 1) return "full";
	if (remainder >= .5) return "half";
	return "empty";
};
var getNextRating = (value, key, max, precision) => {
	switch (key) {
		case "ArrowRight":
		case "ArrowUp": return normalizeRating(value + precision, max, precision);
		case "ArrowLeft":
		case "ArrowDown": return normalizeRating(value - precision, max, precision);
		case "Home": return 0;
		case "End": return max;
		default: return;
	}
};
var ICONS = {
	full: "ph:star-fill",
	half: "ph:star-half-fill",
	empty: "ph:star"
};
var SIZE_MAP = {
	sm: 16,
	md: 20,
	lg: 24
};
var Rating = ({ value, defaultValue = 0, onValueChange, max = 5, precision = .5, size = "md", readOnly = false, disabled = false, color = "var(--puzzle-color-warning, #FABC0A)", emptyColor = "var(--puzzle-color-border)", className, style, "aria-label": ariaLabel = "Rating", onKeyDown, ...props }) => {
	if (!Number.isInteger(max) || max < 1 || max > 10) throw new Error("Rating max must be an integer between 1 and 10.");
	const isControlled = value !== void 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => normalizeRating(defaultValue, max, precision));
	const currentValue = normalizeRating(isControlled ? value : internalValue, max, precision);
	const commitValue = (nextValue) => {
		if (disabled || readOnly) return;
		const next = normalizeRating(nextValue, max, precision);
		if (next === currentValue) return;
		if (!isControlled) setInternalValue(next);
		onValueChange?.(next);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled || readOnly) return;
		const nextValue = getNextRating(currentValue, event.key, max, precision);
		if (nextValue === void 0) return;
		event.preventDefault();
		commitValue(nextValue);
	};
	const classes = cn$1("puzzle-rating", disabled && "puzzle-rating-disabled", readOnly && "puzzle-rating-readonly", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: classes,
		style: {
			...style,
			"--puzzle-rating-color": color,
			"--puzzle-rating-empty-color": emptyColor
		},
		role: readOnly ? "img" : "slider",
		tabIndex: disabled || readOnly ? void 0 : 0,
		"aria-label": readOnly ? `${ariaLabel}: ${currentValue} out of ${max} stars` : ariaLabel,
		"aria-valuemin": readOnly ? void 0 : 0,
		"aria-valuemax": readOnly ? void 0 : max,
		"aria-valuenow": readOnly ? void 0 : currentValue,
		"aria-valuetext": readOnly ? void 0 : `${currentValue} out of ${max} stars`,
		"aria-disabled": disabled || void 0,
		"aria-readonly": readOnly || void 0,
		onKeyDown: handleKeyDown,
		"data-size": size,
		"data-disabled": disabled || void 0,
		"data-readonly": readOnly || void 0,
		children: Array.from({ length: max }, (_, index) => {
			const state = getRatingStarState(currentValue, index);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-rating__star",
				"data-state": state,
				"aria-hidden": "true",
				onClick: (event) => {
					const rect = event.currentTarget.getBoundingClientRect();
					const isHalf = precision === .5 && event.clientX < rect.left + rect.width / 2;
					commitValue(index + (isHalf ? .5 : 1));
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
					name: ICONS[state],
					size: SIZE_MAP[size],
					"aria-hidden": "true",
					focusable: "false"
				})
			}, index);
		})
	});
};
var Skeleton = ({ width = "100%", height = "1rem", radius = "standard", className }) => {
	const classes = cn$1("puzzle-skeleton", `puzzle-skeleton-${radius}`, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: classes,
		style: {
			width,
			height
		}
	});
};
var HEADING_VARIANTS$1 = /* @__PURE__ */ new Set([
	"display1",
	"display2",
	"headline1",
	"headline2",
	"headline3",
	"headline4"
]);
var MARK_ORDER = [
	"bold",
	"italic",
	"underline",
	"strike"
];
var isHeadingVariant = (variant) => HEADING_VARIANTS$1.has(variant);
var createTextDocument = (text = "") => ({
	type: "doc",
	content: [{
		type: "paragraph",
		variant: "body1",
		children: text ? [{ text }] : []
	}]
});
var createTextSelection = (block = 0, offset = 0) => ({
	anchor: {
		block,
		offset
	},
	focus: {
		block,
		offset
	}
});
var getBlockLength = (block) => block.children.reduce((length, child) => length + child.text.length, 0);
var isCollapsedSelection = (selection) => selection.anchor.block === selection.focus.block && selection.anchor.offset === selection.focus.offset;
var getOrderedSelection = (selection) => {
	const { anchor, focus } = selection;
	if (anchor.block < focus.block || anchor.block === focus.block && anchor.offset <= focus.offset) return {
		start: anchor,
		end: focus
	};
	return {
		start: focus,
		end: anchor
	};
};
var normalizeMarks = (marks = []) => MARK_ORDER.filter((mark) => marks.includes(mark));
var sameMarks = (left = [], right = []) => {
	const a = normalizeMarks(left);
	const b = normalizeMarks(right);
	return a.length === b.length && a.every((mark, index) => mark === b[index]);
};
var normalizeInlines = (inlines) => {
	const result = [];
	for (const inline of inlines) {
		if (!inline.text) continue;
		const marks = normalizeMarks(inline.marks);
		const previous = result[result.length - 1];
		if (previous && sameMarks(previous.marks, marks)) {
			previous.text += inline.text;
			continue;
		}
		result.push({
			text: inline.text,
			...marks.length ? { marks } : {}
		});
	}
	return result;
};
var isTextMark = (value) => value === "bold" || value === "italic" || value === "underline" || value === "strike";
var isTextVariant = (value) => value === "display1" || value === "display2" || value === "headline1" || value === "headline2" || value === "headline3" || value === "headline4" || value === "subtitle1" || value === "subtitle2" || value === "body1" || value === "body2" || value === "button" || value === "caption" || value === "overline";
var normalizeTextDocument = (input) => {
	const content = Array.isArray(input?.content) ? input.content.flatMap((candidate) => {
		if (!candidate || !Array.isArray(candidate.children)) return [];
		const variant = isTextVariant(candidate.variant) ? candidate.variant : "body1";
		const children = normalizeInlines(candidate.children.flatMap((inline) => {
			if (!inline || typeof inline.text !== "string") return [];
			const marks = Array.isArray(inline.marks) ? inline.marks.filter(isTextMark) : [];
			return [{
				text: inline.text,
				marks
			}];
		}));
		const listType = candidate.listType === "bullet" || candidate.listType === "ordered" ? candidate.listType : void 0;
		const align = candidate.align === "left" || candidate.align === "center" || candidate.align === "right" || candidate.align === "justify" ? candidate.align : void 0;
		const headingLevel = (listType ? "listItem" : candidate.type === "heading" && isHeadingVariant(variant) ? "heading" : "paragraph") === "heading" && Number.isInteger(candidate.headingLevel) && candidate.headingLevel >= 1 && candidate.headingLevel <= 6 ? candidate.headingLevel : void 0;
		return [{
			type: listType ? "listItem" : candidate.type === "heading" && isHeadingVariant(variant) ? "heading" : "paragraph",
			variant,
			children,
			...listType ? { listType } : {},
			...align ? { align } : {},
			...headingLevel ? { headingLevel } : {}
		}];
	}) : [];
	return {
		type: "doc",
		content: content.length ? content : [{
			type: "paragraph",
			variant: "body1",
			children: []
		}]
	};
};
var sliceInlines = (inlines, from, to) => {
	if (to <= from) return [];
	const result = [];
	let position = 0;
	for (const inline of inlines) {
		const start = position;
		const end = position + inline.text.length;
		const overlapStart = Math.max(start, from);
		const overlapEnd = Math.min(end, to);
		if (overlapStart < overlapEnd) result.push({
			text: inline.text.slice(overlapStart - start, overlapEnd - start),
			...inline.marks?.length ? { marks: [...inline.marks] } : {}
		});
		position = end;
		if (position >= to) break;
	}
	return normalizeInlines(result);
};
var transformInlineRange = (inlines, from, to, transform) => {
	if (to <= from) return inlines.map((inline) => ({ ...inline }));
	const result = [];
	let position = 0;
	for (const inline of inlines) {
		const start = position;
		const end = start + inline.text.length;
		if (end <= from || start >= to) result.push({
			...inline,
			...inline.marks ? { marks: [...inline.marks] } : {}
		});
		else {
			const leftLength = Math.max(0, from - start);
			const rightStart = Math.max(0, to - start);
			const marks = inline.marks ?? [];
			if (leftLength > 0) result.push({
				text: inline.text.slice(0, leftLength),
				...marks.length ? { marks: [...marks] } : {}
			});
			const middleEnd = Math.min(inline.text.length, to - start);
			if (middleEnd > leftLength) result.push({
				text: inline.text.slice(leftLength, middleEnd),
				marks: transform([...marks])
			});
			if (rightStart < inline.text.length) result.push({
				text: inline.text.slice(Math.max(0, rightStart)),
				...marks.length ? { marks: [...marks] } : {}
			});
		}
		position = end;
	}
	return normalizeInlines(result);
};
var applyMark = (document, selection, mark, force) => {
	if (isCollapsedSelection(selection)) return document;
	const { start, end } = getOrderedSelection(selection);
	const allMarked = document.content.every((block, index) => {
		if (index < start.block || index > end.block) return true;
		const from = index === start.block ? start.offset : 0;
		const to = index === end.block ? end.offset : getBlockLength(block);
		if (to <= from) return true;
		let position = 0;
		for (const inline of block.children) {
			const inlineStart = position;
			const inlineEnd = position + inline.text.length;
			position = inlineEnd;
			if (inlineEnd <= from || inlineStart >= to) continue;
			if (!inline.marks?.includes(mark)) return false;
		}
		return true;
	});
	const addMark = force ?? !allMarked;
	return {
		type: "doc",
		content: document.content.map((block, index) => {
			if (index < start.block || index > end.block) return block;
			const from = index === start.block ? start.offset : 0;
			const to = index === end.block ? end.offset : getBlockLength(block);
			if (to <= from) return block;
			return {
				...block,
				children: transformInlineRange(block.children, from, to, (marks) => {
					const next = new Set(marks);
					if (addMark) next.add(mark);
					else next.delete(mark);
					return MARK_ORDER.filter((item) => next.has(item));
				})
			};
		})
	};
};
var setTextVariant = (document, selection, variant) => {
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	return {
		type: "doc",
		content: document.content.map((block, index) => {
			if (index < start.block || index > lastBlock) return block;
			return {
				...block,
				type: block.listType ? "listItem" : isHeadingVariant(variant) ? "heading" : "paragraph",
				variant
			};
		})
	};
};
var inlineWithOffset = (inlines, offset) => ({
	before: sliceInlines(inlines, 0, offset),
	after: sliceInlines(inlines, offset, inlines.reduce((sum, item) => sum + item.text.length, 0))
});
var insertDocumentAtSelection = (document, selection, insertedDocument) => {
	const source = normalizeTextDocument(document);
	const inserted = normalizeTextDocument(insertedDocument);
	const { start, end } = getOrderedSelection(selection);
	const startIndex = Math.max(0, Math.min(start.block, source.content.length - 1));
	const endIndex = Math.max(startIndex, Math.min(end.block, source.content.length - 1));
	const startBlock = source.content[startIndex];
	const endBlock = source.content[endIndex];
	const startOffset = Math.max(0, Math.min(start.offset, getBlockLength(startBlock)));
	const endOffset = Math.max(0, Math.min(end.offset, getBlockLength(endBlock)));
	const prefix = inlineWithOffset(startBlock.children, startOffset).before;
	const suffix = inlineWithOffset(endBlock.children, endOffset).after;
	const insertedBlocks = inserted.content.map((block) => ({
		...block,
		children: block.children.map((inline) => ({
			...inline,
			...inline.marks ? { marks: [...inline.marks] } : {}
		}))
	}));
	const leftSurvives = prefix.length > 0 || startOffset > 0;
	const rightSurvives = suffix.length > 0 || endOffset < getBlockLength(endBlock);
	const first = insertedBlocks[0];
	const last = insertedBlocks[insertedBlocks.length - 1];
	const separatePrefix = leftSurvives && first.type === "heading";
	const separateSuffix = rightSurvives && last.type === "heading";
	const replacement = [];
	if (separatePrefix) replacement.push({
		...startBlock,
		children: prefix
	});
	if (insertedBlocks.length === 1) {
		if (separatePrefix || separateSuffix) {
			replacement.push({
				...first,
				type: separatePrefix || !leftSurvives ? first.type : startBlock.type,
				variant: separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
				children: separatePrefix ? first.children : normalizeInlines([...prefix, ...first.children])
			});
			if (separateSuffix) replacement.push({
				...endBlock,
				children: suffix
			});
			else {
				const finalIndex = replacement.length - 1;
				replacement[finalIndex] = {
					...replacement[finalIndex],
					children: normalizeInlines([...replacement[finalIndex].children, ...suffix])
				};
			}
		} else {
			const useInsertedStyle = !leftSurvives && !rightSurvives;
			replacement.push({
				...useInsertedStyle ? first : startBlock,
				type: useInsertedStyle ? first.type : startBlock.type,
				variant: useInsertedStyle ? first.variant : startBlock.variant,
				children: normalizeInlines([
					...prefix,
					...first.children,
					...suffix
				])
			});
		}
	} else {
		replacement.push({
			...separatePrefix || !leftSurvives ? first : startBlock,
			type: separatePrefix || !leftSurvives ? first.type : startBlock.type,
			variant: separatePrefix || !leftSurvives ? first.variant : startBlock.variant,
			children: separatePrefix ? first.children : normalizeInlines([...prefix, ...first.children])
		});
		for (let index = 1; index < insertedBlocks.length - 1; index += 1) replacement.push(insertedBlocks[index]);
		if (separateSuffix) {
			replacement.push(last);
			replacement.push({
				...endBlock,
				children: suffix
			});
		} else replacement.push({
			...rightSurvives ? endBlock : last,
			type: rightSurvives ? endBlock.type : last.type,
			variant: rightSurvives ? endBlock.variant : last.variant,
			children: normalizeInlines([...last.children, ...suffix])
		});
	}
	const content = [
		...source.content.slice(0, startIndex),
		...replacement,
		...source.content.slice(endIndex + 1)
	];
	const caretReplacementIndex = separateSuffix ? replacement.length - 2 : replacement.length - 1;
	const caretBlock = replacement[Math.max(0, caretReplacementIndex)];
	const suffixLength = suffix.reduce((total, inline) => total + inline.text.length, 0);
	const caretOffset = separateSuffix ? getBlockLength(caretBlock) : Math.max(0, getBlockLength(caretBlock) - suffixLength);
	const caret = {
		block: startIndex + Math.max(0, caretReplacementIndex),
		offset: caretOffset
	};
	return {
		document: {
			type: "doc",
			content: content.length ? content : createTextDocument().content
		},
		selection: {
			anchor: caret,
			focus: caret
		}
	};
};
var insertTextAtSelection = (document, selection, text, marks = []) => {
	return insertDocumentAtSelection(document, selection, {
		type: "doc",
		content: text.split("\n").map((line) => ({
			type: "paragraph",
			variant: "body1",
			children: line ? [{
				text: line,
				...marks.length ? { marks: [...marks] } : {}
			}] : []
		}))
	});
};
/** Apply text alignment to every block touched by the current selection. */
var setTextAlign = (document, selection, align) => {
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	return {
		type: "doc",
		content: document.content.map((block, index) => {
			if (index < start.block || index > lastBlock) return block;
			return {
				...block,
				align
			};
		})
	};
};
var getTextAlign = (document, selection) => {
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	const selected = document.content.slice(start.block, lastBlock + 1);
	if (selected.length === 0) return null;
	const align = selected[0].align ?? null;
	return selected.every((block) => (block.align ?? null) === align) ? align : null;
};
/** Toggle a list type for the selected blocks; null removes list formatting. */
var setListType = (document, selection, listType) => {
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	const selected = document.content.slice(start.block, lastBlock + 1);
	const remove = listType != null && selected.length > 0 && selected.every((block) => block.listType === listType);
	return {
		type: "doc",
		content: document.content.map((block, index) => {
			if (index < start.block || index > lastBlock) return block;
			if (remove || listType == null) {
				const { listType: _listType, ...rest } = block;
				return {
					...rest,
					type: block.type === "listItem" ? "paragraph" : block.type
				};
			}
			return {
				...block,
				type: "listItem",
				listType
			};
		})
	};
};
var getListType = (document, selection, listType) => {
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	const selected = document.content.slice(start.block, lastBlock + 1);
	return selected.length > 0 && selected.every((block) => block.listType === listType);
};
var VARIANTS = /* @__PURE__ */ new Set([
	"display1",
	"display2",
	"headline1",
	"headline2",
	"headline3",
	"headline4",
	"subtitle1",
	"subtitle2",
	"body1",
	"body2",
	"button",
	"caption",
	"overline"
]);
var MARK_TAGS = {
	b: "bold",
	strong: "bold",
	i: "italic",
	em: "italic",
	u: "underline",
	s: "strike",
	strike: "strike",
	del: "strike"
};
var HEADING_VARIANTS = {
	h1: "headline1",
	h2: "headline2",
	h3: "headline3",
	h4: "headline4"
};
var appendText = (target, text, marks) => {
	if (!text) return;
	target.push({
		text,
		...marks.length ? { marks: [...marks] } : {}
	});
};
var readInlineNodes = (nodes, inheritedMarks = []) => {
	const result = [];
	for (const node of Array.from(nodes)) {
		if (node.nodeType === Node.TEXT_NODE) {
			appendText(result, node.textContent ?? "", inheritedMarks);
			continue;
		}
		if (!(node instanceof Element)) continue;
		const tag = node.tagName.toLowerCase();
		if ([
			"script",
			"style",
			"iframe",
			"object",
			"embed",
			"noscript"
		].includes(tag)) continue;
		if (tag === "br") {
			if (!node.hasAttribute("data-puzzle-placeholder")) appendText(result, "\n", inheritedMarks);
			continue;
		}
		if (node.children.length === 1 && node.firstElementChild?.tagName.toLowerCase() === "br" && node.textContent === "") continue;
		const mark = MARK_TAGS[tag];
		const nextMarks = mark ? Array.from(/* @__PURE__ */ new Set([...inheritedMarks, mark])) : inheritedMarks;
		result.push(...readInlineNodes(Array.from(node.childNodes), nextMarks));
	}
	return normalizeInlines(result);
};
var createBlock = (variant, children, forceHeading, align, listType) => ({
	type: listType ? "listItem" : forceHeading || isHeadingVariant(variant) ? "heading" : "paragraph",
	variant,
	children: normalizeInlines(children),
	...align ? { align } : {},
	...listType ? { listType } : {}
});
var getBlockAlign = (element) => {
	const align = element.getAttribute("data-puzzle-align") ?? element.style.textAlign;
	return align === "left" || align === "center" || align === "right" || align === "justify" ? align : void 0;
};
var getBlockVariant = (element) => {
	const provided = element.getAttribute("data-puzzle-variant");
	if (provided && VARIANTS.has(provided)) return provided;
	return HEADING_VARIANTS[element.tagName.toLowerCase()];
};
var containsBlockChild = (element) => Array.from(element.children).some((child) => [
	"p",
	"div",
	"h1",
	"h2",
	"h3",
	"h4",
	"ul",
	"ol",
	"li"
].includes(child.tagName.toLowerCase()));
var readHtmlBlocks = (nodes) => {
	const blocks = [];
	let looseInlines = [];
	const flushLoose = () => {
		if (!looseInlines.length) return;
		blocks.push(createBlock("body1", looseInlines));
		looseInlines = [];
	};
	const visit = (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent ?? "";
			if (looseInlines.length === 0 && !text.trim()) return;
			appendText(looseInlines, text, []);
			return;
		}
		if (!(node instanceof Element)) return;
		const tag = node.tagName.toLowerCase();
		if ([
			"script",
			"style",
			"iframe",
			"object",
			"embed",
			"noscript"
		].includes(tag)) return;
		const isKnownBlock = [
			"p",
			"div",
			"h1",
			"h2",
			"h3",
			"h4"
		].includes(tag);
		if (isKnownBlock && containsBlockChild(node)) {
			flushLoose();
			for (const child of Array.from(node.childNodes)) visit(child);
			return;
		}
		if (isKnownBlock) {
			flushLoose();
			const variant = getBlockVariant(node) ?? "body1";
			const forceHeading = Boolean(HEADING_VARIANTS[tag]);
			const dataListType = node.getAttribute("data-puzzle-list-type");
			const listType = dataListType === "bullet" || dataListType === "ordered" ? dataListType : void 0;
			blocks.push(createBlock(variant, readInlineNodes(Array.from(node.childNodes)), forceHeading, getBlockAlign(node), listType));
			return;
		}
		if (tag === "li") {
			flushLoose();
			const parentTag = node.parentElement?.tagName.toLowerCase();
			const listType = parentTag === "ul" ? "bullet" : parentTag === "ol" ? "ordered" : void 0;
			blocks.push(createBlock("body1", readInlineNodes(Array.from(node.childNodes)), false, getBlockAlign(node), listType));
			return;
		}
		if (tag === "ul" || tag === "ol") {
			flushLoose();
			for (const child of Array.from(node.childNodes)) visit(child);
			return;
		}
		if (tag === "br") {
			appendText(looseInlines, "\n", []);
			return;
		}
		if (containsBlockChild(node)) {
			flushLoose();
			for (const child of Array.from(node.childNodes)) visit(child);
			return;
		}
		looseInlines.push(...readInlineNodes([node]));
	};
	for (const node of Array.from(nodes)) visit(node);
	flushLoose();
	return blocks;
};
/** Parse HTML into the supported document model. Runs in a browser environment. */
var parseHtmlToDocument = (html) => {
	if (typeof DOMParser === "undefined") return createTextDocument(html.replace(/<(script|style|iframe|object|embed|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<[^>]*>/g, ""));
	const parsed = new DOMParser().parseFromString(html, "text/html");
	const blocks = readHtmlBlocks(Array.from(parsed.body.childNodes));
	return normalizeTextDocument({
		type: "doc",
		content: blocks.length ? blocks : createTextDocument().content
	});
};
var parseInlineMarkdown = (input) => {
	const pattern = /!\[([^\]]*)\]\([^)]+\)|\[([^\]]+)\]\([^)]+\)|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*(.+?)\*|_(.+?)_|`([^`]+)`/g;
	const result = [];
	let previousIndex = 0;
	let match;
	while ((match = pattern.exec(input)) !== null) {
		appendText(result, input.slice(previousIndex, match.index), []);
		if (match[1] !== void 0) appendText(result, match[1], []);
		else if (match[2] !== void 0) appendText(result, match[2], []);
		else if (match[3] !== void 0 || match[4] !== void 0) appendText(result, match[3] ?? match[4] ?? "", ["bold"]);
		else if (match[5] !== void 0) appendText(result, match[5], ["strike"]);
		else if (match[6] !== void 0 || match[7] !== void 0) appendText(result, match[6] ?? match[7] ?? "", ["italic"]);
		else if (match[8] !== void 0) appendText(result, match[8], []);
		previousIndex = pattern.lastIndex;
	}
	appendText(result, input.slice(previousIndex), []);
	return normalizeInlines(result);
};
/**
* Parse a small Markdown subset without a dependency. Unsupported constructs
* are flattened to readable text; supported inline marks, headings and lists remain semantic.
*/
var parseMarkdownToDocument = (markdown) => {
	const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
	const blocks = [];
	let paragraphLines = [];
	let insideCodeFence = false;
	const flushParagraph = () => {
		if (!paragraphLines.length) return;
		const text = paragraphLines.join("\n");
		blocks.push(createBlock("body1", parseInlineMarkdown(text)));
		paragraphLines = [];
	};
	for (const line of lines) {
		if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
			flushParagraph();
			insideCodeFence = !insideCodeFence;
			continue;
		}
		if (!insideCodeFence && !line.trim()) {
			flushParagraph();
			continue;
		}
		if (!insideCodeFence) {
			const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
			if (heading) {
				flushParagraph();
				const variant = `headline${heading[1].length}`;
				blocks.push(createBlock(variant, parseInlineMarkdown(heading[2]), true));
				continue;
			}
			if (/^\s{0,3}(?:[-*_]\s*){3,}$/.test(line)) {
				flushParagraph();
				continue;
			}
			const listItem = line.match(/^\s{0,3}([-+*]|\d+[.)])\s+(.+)$/);
			if (listItem) {
				flushParagraph();
				const listType = /^\d/.test(listItem[1]) ? "ordered" : "bullet";
				blocks.push(createBlock("body1", parseInlineMarkdown(listItem[2]), false, void 0, listType));
				continue;
			}
			const quote = line.match(/^\s{0,3}>\s?(.*)$/);
			if (quote) {
				paragraphLines.push(quote[1]);
				continue;
			}
		}
		paragraphLines.push(line);
	}
	flushParagraph();
	return normalizeTextDocument({
		type: "doc",
		content: blocks.length ? blocks : createTextDocument().content
	});
};
var isInside = (root, node) => node != null && (node === root || root.contains(node));
var nodeTextLength = (node) => {
	if (node.nodeType === Node.TEXT_NODE) return node.textContent?.length ?? 0;
	if (node instanceof Element && node.tagName.toLowerCase() === "br") return node.hasAttribute("data-puzzle-placeholder") ? 0 : 1;
	return Array.from(node.childNodes).reduce((total, child) => total + nodeTextLength(child), 0);
};
var measureBeforePoint = (current, target, targetOffset) => {
	if (current === target) {
		if (current.nodeType === Node.TEXT_NODE) return Math.max(0, Math.min(targetOffset, current.textContent?.length ?? 0));
		return Array.from(current.childNodes).slice(0, targetOffset).reduce((total, child) => total + nodeTextLength(child), 0);
	}
	let total = 0;
	for (const child of Array.from(current.childNodes)) {
		if (child === target || child.contains(target)) {
			const nested = measureBeforePoint(child, target, targetOffset);
			return nested == null ? null : total + nested;
		}
		total += nodeTextLength(child);
	}
	return null;
};
var pointFromDom = (root, node, offset) => {
	if (!isInside(root, node)) return null;
	if (node === root) {
		const blocks = Array.from(root.children);
		if (!blocks.length) return null;
		const blockIndex = Math.max(0, Math.min(offset, blocks.length - 1));
		const blockElement = blocks[blockIndex];
		return {
			block: blockIndex,
			offset: offset >= blocks.length ? nodeTextLength(blockElement) : 0
		};
	}
	const markedBlock = node instanceof Element ? node.closest("[data-puzzle-editor-block]") : node.parentElement?.closest("[data-puzzle-editor-block]");
	let directChild = node;
	while (directChild && directChild.parentNode !== root) directChild = directChild.parentNode;
	const blockElement = markedBlock ?? (directChild instanceof HTMLElement ? directChild : null);
	if (!blockElement || !root.contains(blockElement)) return null;
	const block = Array.from(root.children).indexOf(blockElement);
	if (block < 0) return null;
	const measured = measureBeforePoint(blockElement, node, offset);
	const contentLength = nodeTextLength(blockElement);
	return {
		block,
		offset: Math.max(0, Math.min(measured ?? 0, contentLength))
	};
};
var selectionFromDom = (root) => {
	const selection = root.ownerDocument.defaultView?.getSelection();
	if (!selection?.anchorNode || !selection.focusNode) return null;
	if (!root.contains(selection.anchorNode) || !root.contains(selection.focusNode)) return null;
	const anchor = pointFromDom(root, selection.anchorNode, selection.anchorOffset);
	const focus = pointFromDom(root, selection.focusNode, selection.focusOffset);
	return anchor && focus ? {
		anchor,
		focus
	} : null;
};
var collectDomPoints = (root) => {
	const points = [];
	let length = 0;
	const visit = (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const nodeLength = node.textContent?.length ?? 0;
			if (nodeLength) {
				points.push({
					start: length,
					length: nodeLength,
					node,
					kind: "text"
				});
				length += nodeLength;
			}
			return;
		}
		if (node instanceof Element && node.tagName.toLowerCase() === "br") {
			if (!node.hasAttribute("data-puzzle-placeholder")) {
				points.push({
					start: length,
					length: 1,
					node,
					kind: "break"
				});
				length += 1;
			}
			return;
		}
		for (const child of Array.from(node.childNodes)) visit(child);
	};
	visit(root);
	return {
		points,
		length
	};
};
var domPointFromPoint = (blockElement, targetOffset) => {
	const { points, length } = collectDomPoints(blockElement);
	const offset = Math.max(0, Math.min(targetOffset, length));
	for (const point of points) {
		const end = point.start + point.length;
		if (point.kind === "text" && offset <= end) return {
			node: point.node,
			offset: Math.max(0, Math.min(offset - point.start, point.length))
		};
		if (point.kind === "break" && offset <= end) {
			const br = point.node;
			const parent = br.parentNode;
			if (!parent) break;
			return {
				node: parent,
				offset: Array.prototype.indexOf.call(parent.childNodes, br) + (offset === end ? 1 : 0)
			};
		}
	}
	const last = points[points.length - 1];
	if (last?.kind === "text") return {
		node: last.node,
		offset: last.length
	};
	return {
		node: blockElement,
		offset: blockElement.childNodes.length
	};
};
var setDomSelection = (root, selection) => {
	const anchorBlock = root.children.item(selection.anchor.block);
	const focusBlock = root.children.item(selection.focus.block);
	if (!anchorBlock || !focusBlock) return;
	const anchor = domPointFromPoint(anchorBlock, selection.anchor.offset);
	const focus = domPointFromPoint(focusBlock, selection.focus.offset);
	const domSelection = root.ownerDocument.defaultView?.getSelection();
	if (!domSelection) return;
	try {
		if (typeof domSelection.setBaseAndExtent === "function") {
			domSelection.setBaseAndExtent(anchor.node, anchor.offset, focus.node, focus.offset);
			return;
		}
		const range = root.ownerDocument.createRange();
		const ordered = getOrderedSelection(selection);
		const startBlock = root.children.item(ordered.start.block);
		const endBlock = root.children.item(ordered.end.block);
		if (!startBlock || !endBlock) return;
		const start = domPointFromPoint(startBlock, ordered.start.offset);
		const end = domPointFromPoint(endBlock, ordered.end.offset);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		domSelection.removeAllRanges();
		domSelection.addRange(range);
	} catch {}
};
/**
* Render the canonical document into a contenteditable element without making
* React responsible for its children. Browsers mutate contenteditable DOM while
* editing (for example, Backspace may remove a placeholder <br> itself). React
* must therefore not reconcile those descendants as React-owned nodes.
*/
var renderDocumentToDom = (root, textDocument) => {
	const ownerDocument = root.ownerDocument;
	const fragment = ownerDocument.createDocumentFragment();
	for (const block of textDocument.content) {
		const blockElement = ownerDocument.createElement("p");
		blockElement.className = `puzzle-text-editor__block puzzle-typography-${block.variant}`;
		blockElement.dataset.puzzleEditorBlock = "true";
		blockElement.dataset.puzzleVariant = block.variant;
		if (block.align) {
			blockElement.dataset.puzzleAlign = block.align;
			blockElement.style.textAlign = block.align;
		}
		if (block.listType) blockElement.dataset.puzzleListType = block.listType;
		if (!block.children.length) {
			const placeholder = ownerDocument.createElement("br");
			placeholder.dataset.puzzlePlaceholder = "true";
			blockElement.appendChild(placeholder);
		} else for (const inline of block.children) {
			const inlineElement = ownerDocument.createElement("span");
			const content = ownerDocument.createDocumentFragment();
			inline.text.split("\n").forEach((part, index) => {
				if (index > 0) content.appendChild(ownerDocument.createElement("br"));
				if (part) content.appendChild(ownerDocument.createTextNode(part));
			});
			let node = content;
			for (const mark of [...inline.marks ?? []].reverse()) {
				const tagName = mark === "bold" ? "strong" : mark === "italic" ? "em" : mark === "underline" ? "u" : "s";
				const wrapper = ownerDocument.createElement(tagName);
				wrapper.appendChild(node);
				node = wrapper;
			}
			inlineElement.appendChild(node);
			blockElement.appendChild(inlineElement);
		}
		fragment.appendChild(blockElement);
	}
	root.replaceChildren(fragment);
};
var isMark = (value) => value === "bold" || value === "italic" || value === "underline" || value === "strike";
var documentsEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);
var getMarksForSelection = (document, selection, pendingMarks = [], pendingMarksOverride = false) => {
	if (isCollapsedSelection(selection)) {
		if (pendingMarksOverride) return [...pendingMarks];
		const block = document.content[selection.focus.block];
		if (!block) return [];
		const offset = selection.focus.offset;
		let position = 0;
		let previous;
		for (const inline of block.children) {
			const end = position + inline.text.length;
			if (offset > position && offset <= end) return [...inline.marks ?? []];
			if (offset === position && previous) return [...previous];
			if (offset < end) return [...inline.marks ?? []];
			previous = inline.marks ?? [];
			position = end;
		}
		return [...previous ?? []];
	}
	const { start, end } = getOrderedSelection(selection);
	let commonMarks = null;
	let foundText = false;
	document.content.forEach((block, blockIndex) => {
		if (blockIndex < start.block || blockIndex > end.block) return;
		const from = blockIndex === start.block ? start.offset : 0;
		const to = blockIndex === end.block ? end.offset : block.children.reduce((total, inline) => total + inline.text.length, 0);
		if (to <= from) return;
		let position = 0;
		for (const inline of block.children) {
			const inlineStart = position;
			const inlineEnd = inlineStart + inline.text.length;
			position = inlineEnd;
			if (inlineEnd <= from || inlineStart >= to) continue;
			foundText = true;
			const marks = new Set(inline.marks ?? []);
			commonMarks = commonMarks == null ? marks : new Set([...commonMarks].filter((mark) => marks.has(mark)));
		}
	});
	return foundText && commonMarks ? [...commonMarks] : [];
};
var getVariantForSelection = (document, selection) => {
	if (!document.content.length) return null;
	const { start, end } = getOrderedSelection(selection);
	const lastBlock = isCollapsedSelection(selection) ? start.block : end.offset === 0 && end.block > start.block ? end.block - 1 : end.block;
	const variants = document.content.slice(start.block, lastBlock + 1).map((block) => block.variant);
	return variants.length && variants.every((variant) => variant === variants[0]) ? variants[0] : null;
};
var Editor = (0, import_react.forwardRef)(({ value, defaultValue, onChange, onSelectionChange, onActiveMarksChange, onActiveTextVariantChange, placeholder, className, readOnly = false, autoFocus = false, "aria-label": ariaLabel = "Text editor" }, forwardedRef) => {
	const [documentState, setDocumentState] = (0, import_react.useState)(() => normalizeTextDocument(value ?? defaultValue ?? createTextDocument()));
	const [selectionState, setSelectionState] = (0, import_react.useState)(() => createTextSelection());
	const editableRef = (0, import_react.useRef)(null);
	const documentRef = (0, import_react.useRef)(documentState);
	const selectionRef = (0, import_react.useRef)(selectionState);
	const restoreSelectionRef = (0, import_react.useRef)(null);
	const renderDomOnDocumentChangeRef = (0, import_react.useRef)(true);
	const inputTypeRef = (0, import_react.useRef)("");
	const selectionBeforeInputRef = (0, import_react.useRef)(selectionState);
	const pendingMarksRef = (0, import_react.useRef)([]);
	const pendingMarksOverrideRef = (0, import_react.useRef)(false);
	const historyRef = (0, import_react.useRef)({
		undo: [],
		redo: [],
		lastInputType: "",
		lastInputAt: 0
	});
	const updateSelection = (0, import_react.useCallback)((nextSelection) => {
		selectionRef.current = nextSelection;
		setSelectionState(nextSelection);
		onSelectionChange?.(nextSelection);
		onActiveMarksChange?.(getMarksForSelection(documentRef.current, nextSelection, pendingMarksRef.current, pendingMarksOverrideRef.current));
		onActiveTextVariantChange?.(getVariantForSelection(documentRef.current, nextSelection));
	}, [
		onSelectionChange,
		onActiveMarksChange,
		onActiveTextVariantChange
	]);
	const restoreSelection = (0, import_react.useCallback)((nextSelection) => {
		const root = editableRef.current;
		if (!root) return;
		setDomSelection(root, nextSelection);
	}, []);
	const focus = (0, import_react.useCallback)(() => {
		const root = editableRef.current;
		if (!root) return;
		root.focus({ preventScroll: true });
		restoreSelection(selectionRef.current);
	}, [restoreSelection]);
	const clearTypingGroup = (0, import_react.useCallback)(() => {
		historyRef.current.lastInputAt = 0;
		historyRef.current.lastInputType = "";
	}, []);
	const pushHistory = (0, import_react.useCallback)((document, selection) => {
		historyRef.current.undo.push({
			document,
			selection
		});
		if (historyRef.current.undo.length > 100) historyRef.current.undo.shift();
		historyRef.current.redo = [];
		clearTypingGroup();
	}, [clearTypingGroup]);
	const emitDocument = (0, import_react.useCallback)((nextDocument, nextSelection = selectionRef.current) => {
		const normalized = normalizeTextDocument(nextDocument);
		renderDomOnDocumentChangeRef.current = true;
		documentRef.current = normalized;
		restoreSelectionRef.current = nextSelection;
		updateSelection(nextSelection);
		setDocumentState(normalized);
		onChange?.(normalized);
	}, [onChange, updateSelection]);
	const commitTransform = (0, import_react.useCallback)((nextDocument, nextSelection = selectionRef.current) => {
		if (documentsEqual(documentRef.current, nextDocument)) {
			updateSelection(nextSelection);
			restoreSelectionRef.current = nextSelection;
			return;
		}
		pushHistory(documentRef.current, selectionRef.current);
		emitDocument(nextDocument, nextSelection);
	}, [
		emitDocument,
		pushHistory,
		updateSelection
	]);
	const undo = (0, import_react.useCallback)(() => {
		const history = historyRef.current;
		const previous = history.undo.pop();
		if (!previous) return;
		history.redo.push({
			document: documentRef.current,
			selection: selectionRef.current
		});
		clearTypingGroup();
		emitDocument(previous.document, previous.selection);
	}, [clearTypingGroup, emitDocument]);
	const redo = (0, import_react.useCallback)(() => {
		const history = historyRef.current;
		const next = history.redo.pop();
		if (!next) return;
		history.undo.push({
			document: documentRef.current,
			selection: selectionRef.current
		});
		clearTypingGroup();
		emitDocument(next.document, next.selection);
	}, [clearTypingGroup, emitDocument]);
	const getActiveMarks = (0, import_react.useCallback)(() => getMarksForSelection(documentRef.current, selectionRef.current, pendingMarksRef.current, pendingMarksOverrideRef.current), []);
	const isActive = (0, import_react.useCallback)((mark) => getActiveMarks().includes(mark), [getActiveMarks]);
	const getActiveTextVariant = (0, import_react.useCallback)(() => getVariantForSelection(documentRef.current, selectionRef.current), []);
	const isTextVariantActive = (0, import_react.useCallback)((variant) => getActiveTextVariant() === variant, [getActiveTextVariant]);
	const toggleMark = (0, import_react.useCallback)((mark) => {
		focus();
		const selection = selectionRef.current;
		if (isCollapsedSelection(selection)) {
			const pending = new Set(getActiveMarks());
			if (pending.has(mark)) pending.delete(mark);
			else pending.add(mark);
			pendingMarksRef.current = [
				"bold",
				"italic",
				"underline",
				"strike"
			].filter(isMark).filter((item) => pending.has(item));
			pendingMarksOverrideRef.current = true;
			onActiveMarksChange?.(getMarksForSelection(documentRef.current, selectionRef.current, pendingMarksRef.current, true));
			return;
		}
		commitTransform(applyMark(documentRef.current, selection, mark));
	}, [
		commitTransform,
		focus,
		getActiveMarks,
		onActiveMarksChange
	]);
	const changeVariant = (0, import_react.useCallback)((variant) => {
		focus();
		commitTransform(setTextVariant(documentRef.current, selectionRef.current, variant));
	}, [commitTransform, focus]);
	const changeAlign = (0, import_react.useCallback)((align) => {
		focus();
		commitTransform(setTextAlign(documentRef.current, selectionRef.current, align));
	}, [commitTransform, focus]);
	const isTextAlignActive = (0, import_react.useCallback)((align) => {
		const currentAlign = getTextAlign(documentRef.current, selectionRef.current);
		return currentAlign === align || currentAlign === null && align === "left";
	}, []);
	const changeListType = (0, import_react.useCallback)((listType) => {
		focus();
		commitTransform(setListType(documentRef.current, selectionRef.current, listType));
	}, [commitTransform, focus]);
	const isListTypeActive = (0, import_react.useCallback)((listType) => {
		return getListType(documentRef.current, selectionRef.current, listType);
	}, []);
	const replaceSelection = (0, import_react.useCallback)((insertedDocument) => {
		focus();
		const result = insertDocumentAtSelection(documentRef.current, selectionRef.current, insertedDocument);
		pendingMarksRef.current = [];
		pendingMarksOverrideRef.current = false;
		commitTransform(result.document, result.selection);
	}, [commitTransform, focus]);
	const insertText = (0, import_react.useCallback)((text) => {
		focus();
		const result = insertTextAtSelection(documentRef.current, selectionRef.current, text, pendingMarksRef.current);
		pendingMarksRef.current = [];
		pendingMarksOverrideRef.current = false;
		commitTransform(result.document, result.selection);
	}, [commitTransform, focus]);
	(0, import_react.useImperativeHandle)(forwardedRef, () => ({
		focus,
		getDocument: () => documentRef.current,
		getSelection: () => selectionRef.current,
		getActiveMarks,
		isActive,
		getActiveTextVariant,
		isTextVariantActive,
		toggleMark,
		setTextVariant: changeVariant,
		setTextAlign: changeAlign,
		isTextAlignActive,
		setListType: changeListType,
		isListTypeActive,
		insertText,
		replaceSelection,
		undo,
		redo,
		canUndo: () => historyRef.current.undo.length > 0,
		canRedo: () => historyRef.current.redo.length > 0
	}), [
		changeAlign,
		changeListType,
		changeVariant,
		focus,
		isTextAlignActive,
		getActiveMarks,
		getActiveTextVariant,
		insertText,
		isActive,
		isTextVariantActive,
		redo,
		replaceSelection,
		toggleMark,
		undo
	]);
	(0, import_react.useEffect)(() => {
		if (!value || value === documentRef.current) return;
		const normalized = normalizeTextDocument(value);
		renderDomOnDocumentChangeRef.current = true;
		documentRef.current = normalized;
		const selection = createTextSelection();
		selectionRef.current = selection;
		restoreSelectionRef.current = selection;
		historyRef.current = {
			undo: [],
			redo: [],
			lastInputType: "",
			lastInputAt: 0
		};
		setDocumentState(normalized);
		updateSelection(selection);
	}, [value, updateSelection]);
	(0, import_react.useLayoutEffect)(() => {
		const root = editableRef.current;
		if (!root) return;
		if (renderDomOnDocumentChangeRef.current) renderDocumentToDom(root, documentState);
		renderDomOnDocumentChangeRef.current = true;
		const selection = restoreSelectionRef.current;
		if (!selection) return;
		restoreSelectionRef.current = null;
		restoreSelection(selection);
	}, [documentState, restoreSelection]);
	(0, import_react.useEffect)(() => {
		onActiveMarksChange?.(getActiveMarks());
		onActiveTextVariantChange?.(getActiveTextVariant());
	}, [
		getActiveMarks,
		getActiveTextVariant,
		onActiveMarksChange,
		onActiveTextVariantChange
	]);
	(0, import_react.useEffect)(() => {
		if (autoFocus) focus();
	}, [autoFocus, focus]);
	(0, import_react.useEffect)(() => {
		const ownerDocument = editableRef.current?.ownerDocument;
		if (!ownerDocument) return;
		const onSelectionChangeInDocument = () => {
			const root = editableRef.current;
			if (!root) return;
			const next = selectionFromDom(root);
			if (!next) return;
			const current = selectionRef.current;
			if (next.anchor.block === current.anchor.block && next.anchor.offset === current.anchor.offset && next.focus.block === current.focus.block && next.focus.offset === current.focus.offset) return;
			updateSelection(next);
		};
		ownerDocument.addEventListener("selectionchange", onSelectionChangeInDocument);
		return () => ownerDocument.removeEventListener("selectionchange", onSelectionChangeInDocument);
	}, [updateSelection]);
	const handleBeforeInput = (event) => {
		const inputType = event.nativeEvent.inputType ?? "";
		inputTypeRef.current = inputType;
		selectionBeforeInputRef.current = selectionFromDom(event.currentTarget) ?? selectionRef.current;
		if (inputType === "historyUndo") {
			event.preventDefault();
			undo();
		} else if (inputType === "historyRedo") {
			event.preventDefault();
			redo();
		}
	};
	const handleInput = (event) => {
		const root = event.currentTarget;
		const previousDocument = documentRef.current;
		const beforeSelection = selectionBeforeInputRef.current;
		const inputType = inputTypeRef.current;
		let nextDocument = parseHtmlToDocument(root.innerHTML);
		const nextSelection = selectionFromDom(root) ?? selectionRef.current;
		if (pendingMarksRef.current.length && isCollapsedSelection(beforeSelection) && (inputType === "insertText" || inputType === "insertCompositionText")) {
			const insertedRange = {
				anchor: beforeSelection.anchor,
				focus: nextSelection.focus
			};
			if (!isCollapsedSelection(insertedRange)) for (const mark of pendingMarksRef.current) nextDocument = applyMark(nextDocument, insertedRange, mark, true);
		}
		if (documentsEqual(previousDocument, nextDocument)) {
			updateSelection(nextSelection);
			return;
		}
		const now = Date.now();
		if (!(isCollapsedSelection(beforeSelection) && (inputType === "insertText" || inputType === "insertCompositionText" || inputType === "deleteContentBackward" || inputType === "deleteContentForward") && historyRef.current.lastInputType === inputType && now - historyRef.current.lastInputAt < 800)) {
			historyRef.current.undo.push({
				document: previousDocument,
				selection: beforeSelection
			});
			if (historyRef.current.undo.length > 100) historyRef.current.undo.shift();
		}
		historyRef.current.redo = [];
		historyRef.current.lastInputType = inputType;
		historyRef.current.lastInputAt = now;
		documentRef.current = normalizeTextDocument(nextDocument);
		if (inputType === "insertText" || inputType === "insertCompositionText" || inputType === "insertFromPaste") {
			pendingMarksRef.current = [];
			pendingMarksOverrideRef.current = false;
		}
		restoreSelectionRef.current = nextSelection;
		updateSelection(nextSelection);
		renderDomOnDocumentChangeRef.current = false;
		setDocumentState(documentRef.current);
		onChange?.(documentRef.current);
	};
	const handlePaste = (event) => {
		if (readOnly) return;
		event.preventDefault();
		const currentSelection = selectionFromDom(event.currentTarget);
		if (currentSelection) updateSelection(currentSelection);
		const html = event.clipboardData.getData("text/html");
		const plainText = event.clipboardData.getData("text/plain");
		if (!html.trim() && !plainText) return;
		const parsed = html.trim() ? parseHtmlToDocument(html) : parseMarkdownToDocument(plainText);
		replaceSelection(parsed);
	};
	const handleKeyDown = (event) => {
		if (!(event.metaKey || event.ctrlKey)) return;
		const key = event.key.toLowerCase();
		if (key === "z") {
			event.preventDefault();
			if (event.shiftKey) redo();
			else undo();
		} else if (key === "y") {
			event.preventDefault();
			redo();
		} else if (key === "b") {
			event.preventDefault();
			toggleMark("bold");
		} else if (key === "i") {
			event.preventDefault();
			toggleMark("italic");
		} else if (key === "u") {
			event.preventDefault();
			toggleMark("underline");
		} else if (key === "x" && event.shiftKey) {
			event.preventDefault();
			toggleMark("strike");
		}
	};
	const handleKeyUp = () => {
		const root = editableRef.current;
		const next = root ? selectionFromDom(root) : null;
		if (next) updateSelection(next);
	};
	const handleMouseUp = () => {
		const root = editableRef.current;
		const next = root ? selectionFromDom(root) : null;
		if (next) updateSelection(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: editableRef,
		className: cn$1("puzzle-text-editor", className),
		contentEditable: !readOnly,
		suppressContentEditableWarning: true,
		role: "textbox",
		"aria-label": ariaLabel,
		"aria-multiline": "true",
		"aria-readonly": readOnly || void 0,
		"data-placeholder": placeholder,
		"data-empty": documentState.content.every((block) => block.children.every((inline) => !inline.text)) ? "true" : void 0,
		spellCheck: true,
		onBeforeInput: handleBeforeInput,
		onInput: handleInput,
		onPaste: handlePaste,
		onKeyDown: handleKeyDown,
		onKeyUp: handleKeyUp,
		onMouseUp: handleMouseUp,
		onFocus: handleKeyUp
	});
});
Editor.displayName = "Editor";
var TextEditorContext = (0, import_react.createContext)(null);
var useTextEditor = () => {
	const context = (0, import_react.useContext)(TextEditorContext);
	if (!context) throw new Error("useTextEditor must be used within a TextEditorProvider");
	return context;
};
var TextEditor = ({ toolbar, value, defaultValue, onChange }) => {
	const editorHandleRef = (0, import_react.useRef)(null);
	const [activeMarks, setActiveMarks] = (0, import_react.useState)([]);
	const [activeVariant, setActiveVariant] = (0, import_react.useState)("body1");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		direction: "col",
		gap: "md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditorContext.Provider, {
			value: {
				...editorHandleRef.current,
				activeMarks,
				activeVariant
			},
			children: toolbar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
			ref: editorHandleRef,
			value,
			defaultValue,
			onChange,
			onActiveMarksChange: setActiveMarks,
			onActiveTextVariantChange: setActiveVariant
		})]
	});
};
var TextEditorToolbar = ({ className, ariaLabel = "Text formatting", dir = "ltr" }) => {
	const { toggleMark, isActive, setTextAlign, isTextAlignActive, setListType, isListTypeActive, undo, redo, canUndo, canRedo } = useTextEditor();
	const iconSize = 20;
	const classes = cn$1("text-editor-toolbar", className);
	const canUndoAction = canUndo?.() ?? false;
	const canRedoAction = canRedo?.() ?? false;
	const rovingFocus = useRovingFocus({
		items: [
			{ id: "bold" },
			{ id: "italic" },
			{ id: "underline" },
			{ id: "strike" },
			{ id: "align-left" },
			{ id: "align-center" },
			{ id: "align-right" },
			{ id: "align-justify" },
			{
				id: "undo",
				disabled: !canUndoAction
			},
			{
				id: "redo",
				disabled: !canRedoAction
			},
			{ id: "list-bullet" },
			{ id: "list-ordered" }
		],
		orientation: "horizontal",
		dir
	});
	const getToolbarItemProps = (id, disabled = false) => ({
		ref: rovingFocus.getItemRef(id),
		tabIndex: rovingFocus.getItemTabIndex(id, disabled),
		onFocus: () => rovingFocus.onItemFocus(id),
		onKeyDown: (event) => rovingFocus.onItemKeyDown(event, id)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		className: classes,
		direction: "row",
		alignH: "start",
		alignV: "stretch",
		gap: "md",
		role: "toolbar",
		"aria-label": ariaLabel,
		"aria-orientation": "horizontal",
		dir,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				alignH: "start",
				alignV: "center",
				gap: "xs",
				role: "group",
				"aria-label": "Text style",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("bold"),
						"aria-label": "Bold",
						"aria-pressed": isActive?.("bold") ?? false,
						variant: isActive?.("bold") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => toggleMark?.("bold"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-bold",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("italic"),
						"aria-label": "Italic",
						"aria-pressed": isActive?.("italic") ?? false,
						variant: isActive?.("italic") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => toggleMark?.("italic"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-italic",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("underline"),
						"aria-label": "Underline",
						"aria-pressed": isActive?.("underline") ?? false,
						variant: isActive?.("underline") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => toggleMark?.("underline"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-underline",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("strike"),
						"aria-label": "Strikethrough",
						"aria-pressed": isActive?.("strike") ?? false,
						variant: isActive?.("strike") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => toggleMark?.("strike"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-strike",
							size: iconSize
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "separator",
				"aria-orientation": "vertical",
				className: "text-editor-toolbar__separator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				alignH: "start",
				alignV: "center",
				gap: "xs",
				role: "group",
				"aria-label": "Alignment",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("align-left"),
						"aria-label": "Align left",
						"aria-pressed": isTextAlignActive?.("left") ?? false,
						variant: isTextAlignActive?.("left") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => setTextAlign?.("left"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-align-left",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("align-center"),
						"aria-label": "Align center",
						"aria-pressed": isTextAlignActive?.("center") ?? false,
						variant: isTextAlignActive?.("center") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => setTextAlign?.("center"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-align-center",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("align-right"),
						"aria-label": "Align right",
						"aria-pressed": isTextAlignActive?.("right") ?? false,
						variant: isTextAlignActive?.("right") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => setTextAlign?.("right"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "oui:editor-align-right",
							size: iconSize
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...getToolbarItemProps("align-justify"),
						"aria-label": "Justify text",
						"aria-pressed": isTextAlignActive?.("justify") ?? false,
						variant: isTextAlignActive?.("justify") ? "toggle-active" : "toggle",
						onMouseDown: (event) => event.preventDefault(),
						onClick: () => setTextAlign?.("justify"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
							name: "energy-icons:align-justify-20",
							size: iconSize
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "separator",
				"aria-orientation": "vertical",
				className: "text-editor-toolbar__separator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				alignH: "start",
				alignV: "center",
				gap: "xs",
				role: "group",
				"aria-label": "History",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					...getToolbarItemProps("undo", !canUndoAction),
					"aria-label": "Undo",
					variant: "outline",
					disabled: !canUndoAction,
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => undo?.(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
						name: "oui:editor-undo",
						size: iconSize
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					...getToolbarItemProps("redo", !canRedoAction),
					"aria-label": "Redo",
					variant: "outline",
					disabled: !canRedoAction,
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => redo?.(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
						name: "oui:editor-redo",
						size: iconSize
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "row",
				alignH: "start",
				alignV: "center",
				gap: "xs",
				role: "group",
				"aria-label": "Lists",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					...getToolbarItemProps("list-bullet"),
					"aria-label": "Bulleted list",
					"aria-pressed": isListTypeActive?.("bullet") ?? false,
					variant: isListTypeActive?.("bullet") ? "toggle-active" : "toggle",
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => setListType?.("bullet"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
						name: "oui:editor-ordered-list",
						size: iconSize
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					...getToolbarItemProps("list-ordered"),
					"aria-label": "Numbered list",
					"aria-pressed": isListTypeActive?.("ordered") ?? false,
					variant: isListTypeActive?.("ordered") ? "toggle-active" : "toggle",
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => setListType?.("ordered"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
						name: "oui:editor-unordered-list",
						size: iconSize
					})
				})]
			})
		]
	});
};
var MARK_COMPONENTS = {
	bold: (children) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children }),
	italic: (children) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children }),
	underline: (children) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("u", { children }),
	strike: (children) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("s", { children })
};
var renderInline = (block, blockIndex) => block.children.map((inline, inlineIndex) => {
	let node = inline.text.split("\n").flatMap((part, partIndex) => partIndex === 0 ? [part] : [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}, `break-${blockIndex}-${inlineIndex}-${partIndex}`), part]);
	for (const mark of [...inline.marks ?? []].reverse()) node = MARK_COMPONENTS[mark](node);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: node }, `${blockIndex}-${inlineIndex}`);
});
var HEADING_TAGS = [
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
];
var getHeadingTag = (block) => {
	if (block.headingLevel) return HEADING_TAGS[block.headingLevel - 1];
	switch (block.variant) {
		case "display1":
		case "headline1": return "h1";
		case "display2":
		case "headline2": return "h2";
		case "headline3": return "h3";
		default: return "h4";
	}
};
var TextRenderer = ({ document, className }) => {
	const blocks = document.content;
	const output = [];
	let index = 0;
	while (index < blocks.length) {
		const block = blocks[index];
		if (block.listType) {
			const listType = block.listType;
			const items = [];
			while (index < blocks.length && blocks[index].listType === listType) {
				const item = blocks[index];
				const itemChildren = renderInline(item, index);
				items.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cn$1("puzzle-text-renderer__block", `puzzle-typography-${item.variant}`),
					style: { textAlign: item.align },
					children: itemChildren.length ? itemChildren : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
				}, index));
				index++;
			}
			const List = listType === "ordered" ? "ol" : "ul";
			output.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
				className: "puzzle-text-renderer__list",
				children: items
			}, `list-${index}`));
			continue;
		}
		const blockClass = cn$1("puzzle-text-renderer__block", `puzzle-typography-${block.variant}`);
		const children = renderInline(block, index);
		const style = { textAlign: block.align };
		if (block.type === "heading") {
			const HeadingTag = getHeadingTag(block);
			output.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadingTag, {
				className: blockClass,
				style,
				children: children.length ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
			}, index));
		} else output.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: blockClass,
			style,
			children: children.length ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
		}, index));
		index++;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn$1("puzzle-text-renderer", className),
		children: output
	});
};
var DEFAULT_HSV = {
	h: 0,
	s: 100,
	v: 100,
	a: 1
};
var rgbToHsv = ({ r, g, b, a = 1 }) => {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;
	const max = Math.max(red, green, blue);
	const delta = max - Math.min(red, green, blue);
	let h = 0;
	if (delta !== 0) {
		if (max === red) h = 60 * ((green - blue) / delta % 6);
		else if (max === green) h = 60 * ((blue - red) / delta + 2);
		else h = 60 * ((red - green) / delta + 4);
	}
	return {
		h: (h + 360) % 360,
		s: max === 0 ? 0 : delta / max * 100,
		v: max * 100,
		a
	};
};
var hsvToRgb = ({ h, s, v, a }) => {
	const hue = (h % 360 + 360) % 360;
	const saturation = clamp$4(s / 100, 0, 1);
	const value = clamp$4(v / 100, 0, 1);
	const chroma = value * saturation;
	const x = chroma * (1 - Math.abs(hue / 60 % 2 - 1));
	const m = value - chroma;
	let channels;
	if (hue < 60) channels = [
		chroma,
		x,
		0
	];
	else if (hue < 120) channels = [
		x,
		chroma,
		0
	];
	else if (hue < 180) channels = [
		0,
		chroma,
		x
	];
	else if (hue < 240) channels = [
		0,
		x,
		chroma
	];
	else if (hue < 300) channels = [
		x,
		0,
		chroma
	];
	else channels = [
		chroma,
		0,
		x
	];
	return {
		r: Math.round((channels[0] + m) * 255),
		g: Math.round((channels[1] + m) * 255),
		b: Math.round((channels[2] + m) * 255),
		a: clamp$4(a, 0, 1)
	};
};
var rgbToFormat = (rgb, format) => {
	switch (format) {
		case "rgb": return rgbToCss(rgb);
		case "hsl": return hslToCss(rgbToHsl(rgb));
		default: return rgbToHex(rgb.r, rgb.g, rgb.b, rgb.a);
	}
};
var hsvToFormat = (hsv, format) => rgbToFormat(hsvToRgb(hsv), format);
var parseColorToHsv = (color) => {
	const rgb = parseColor(color);
	return rgb ? rgbToHsv(rgb) : null;
};
/**
* Resolves a CSS color in browser context.
* Core stays framework/browser independent.
*/
var resolveCssColor = (color) => {
	if (typeof document === "undefined") return null;
	const element = document.createElement("span");
	element.style.color = color;
	if (!element.style.color) return null;
	element.style.position = "absolute";
	element.style.visibility = "hidden";
	document.body.appendChild(element);
	const resolved = getComputedStyle(element).color;
	element.remove();
	return resolved || null;
};
var parseColorToHsvInBrowser = (color) => {
	const direct = parseColorToHsv(color);
	if (direct) return direct;
	const resolved = resolveCssColor(color);
	return resolved ? parseColorToHsv(resolved) : null;
};
var getSwatchValue = (swatch) => typeof swatch === "string" ? swatch : swatch.value;
var getSwatchLabel = (swatch) => typeof swatch === "string" ? swatch : swatch.label ?? swatch.value;
var ColorPicker = (props) => {
	const { value, defaultValue, onChange, label, description, placeholder = "Select color", colors = [], format = "hexa", clearable = true, clearLabel = "Clear color", open, defaultOpen = false, onOpenChange, position = "bottom", align = "start", disabled = false, className, style, rootClassName, popoverClassName, id, ref, ...triggerProps } = props;
	const generatedId = (0, import_react.useId)();
	const triggerId = id ?? generatedId;
	const labelId = `${generatedId}-label`;
	const descriptionId = `${generatedId}-description`;
	const panelId = `${generatedId}-panel`;
	const areaId = `${generatedId}-area`;
	const [internalValue, setInternalValue] = (0, import_react.useState)(defaultValue);
	const isControlled = Object.prototype.hasOwnProperty.call(props, "value");
	const selectedColor = isControlled ? value : internalValue;
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const isOpen = open ?? internalOpen;
	const [hsv, setHsv] = (0, import_react.useState)(() => (selectedColor ? parseColorToHsvInBrowser(selectedColor) : null) ?? DEFAULT_HSV);
	const [inputValue, setInputValue] = (0, import_react.useState)(selectedColor ?? "");
	const [inputError, setInputError] = (0, import_react.useState)(false);
	const areaRef = (0, import_react.useRef)(null);
	const changeOpen = (0, import_react.useCallback)((nextOpen) => {
		if (open === void 0) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [open, onOpenChange]);
	const commitColor = (0, import_react.useCallback)((nextColor) => {
		if (!isControlled) setInternalValue(nextColor);
		onChange?.(nextColor);
		setInputValue(nextColor ?? "");
		setInputError(false);
	}, [isControlled, onChange]);
	const updateHsv = (0, import_react.useCallback)((next) => {
		const normalized = {
			h: (next.h % 360 + 360) % 360,
			s: clamp$4(next.s, 0, 100),
			v: clamp$4(next.v, 0, 100),
			a: clamp$4(next.a, 0, 1)
		};
		setHsv(normalized);
		commitColor(hsvToFormat(normalized, format));
	}, [commitColor, format]);
	(0, import_react.useEffect)(() => {
		if (!selectedColor) {
			setHsv(DEFAULT_HSV);
			return;
		}
		const parsed = parseColorToHsvInBrowser(selectedColor);
		if (parsed) setHsv(parsed);
	}, [selectedColor]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setInputValue(selectedColor ?? "");
			setInputError(false);
		}
	}, [isOpen, selectedColor]);
	const updateArea = (event) => {
		if (event.type === "pointermove" && event.buttons !== 1) return;
		const rect = event.currentTarget.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return;
		const saturation = clamp$4((event.clientX - rect.left) / rect.width * 100, 0, 100);
		const brightness = clamp$4((1 - (event.clientY - rect.top) / rect.height) * 100, 0, 100);
		updateHsv({
			...hsv,
			s: saturation,
			v: brightness
		});
	};
	const handleAreaKeyDown = (event) => {
		const step = event.shiftKey ? 10 : 1;
		let saturation = hsv.s;
		let brightness = hsv.v;
		switch (event.key) {
			case "ArrowLeft":
				saturation -= step;
				break;
			case "ArrowRight":
				saturation += step;
				break;
			case "ArrowUp":
				brightness += step;
				break;
			case "ArrowDown":
				brightness -= step;
				break;
			case "Home":
				saturation = 0;
				break;
			case "End":
				saturation = 100;
				break;
			default: return;
		}
		event.preventDefault();
		updateHsv({
			...hsv,
			s: saturation,
			v: brightness
		});
	};
	const selectSwatch = (color) => {
		commitColor(color);
		const parsed = parseColorToHsvInBrowser(color);
		if (parsed) setHsv(parsed);
	};
	const applyInput = () => {
		const color = inputValue.trim();
		const parsed = parseColorToHsvInBrowser(color);
		if (!parsed) {
			setInputError(true);
			return;
		}
		commitColor(color);
		setHsv(parsed);
	};
	const hueColor = `hsl(${hsv.h}, 100%, 50%)`;
	const colorAreaStyle = { "--puzzle-color-picker-hue": hueColor };
	const triggerSwatchStyle = { background: selectedColor ? resolveCssColor(selectedColor) ?? selectedColor : void 0 };
	const clearColor = () => {
		commitColor(void 0);
		setHsv(DEFAULT_HSV);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("puzzle-color-picker", rootClassName),
		"data-disabled": disabled || void 0,
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				id: labelId,
				className: "puzzle-color-picker__label",
				htmlFor: triggerId,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
				position,
				align,
				action: "click",
				open: isOpen,
				onOpenChange: changeOpen,
				closeOnOutsideClick: true,
				closeOnEscape: true,
				contentClassName: cn$1("puzzle-color-picker__popover", popoverClassName),
				trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					...triggerProps,
					ref,
					id: triggerId,
					type: "button",
					className: cn$1("puzzle-color-picker__trigger", className),
					style,
					disabled,
					"aria-label": label ? void 0 : "Choose color",
					"aria-labelledby": label ? labelId : void 0,
					"aria-describedby": description ? descriptionId : void 0,
					"aria-haspopup": "dialog",
					"aria-expanded": isOpen,
					"aria-controls": isOpen ? panelId : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-color-picker__trigger-swatch",
							style: triggerSwatchStyle,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-color-picker__trigger-value",
							children: selectedColor ?? placeholder
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-color-picker__trigger-chevron",
							"aria-hidden": "true",
							children: "▾"
						})
					]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: panelId,
					className: "puzzle-color-picker__panel",
					role: "dialog",
					"aria-label": label ? `Choose ${label}` : "Choose color",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: areaRef,
							id: areaId,
							className: "puzzle-color-picker__area",
							style: colorAreaStyle,
							onPointerDown: (event) => {
								event.currentTarget.setPointerCapture(event.pointerId);
								updateArea(event);
							},
							onPointerMove: updateArea,
							onKeyDown: handleAreaKeyDown,
							role: "group",
							"aria-label": "Color saturation and brightness",
							tabIndex: 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "puzzle-color-picker__area-saturation",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "puzzle-color-picker__area-brightness",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "puzzle-color-picker__area-indicator",
									style: {
										left: `${hsv.s}%`,
										top: `${100 - hsv.v}%`
									},
									"aria-hidden": "true"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-color-picker__sliders",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "puzzle-color-picker__slider-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 359,
									value: Math.round(hsv.h),
									"aria-label": "Hue",
									onChange: (event) => updateHsv({
										...hsv,
										h: Number(event.currentTarget.value)
									}),
									className: "puzzle-color-picker__hue-slider"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "puzzle-color-picker__slider-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 100,
									value: Math.round(hsv.a * 100),
									"aria-label": "Opacity",
									onChange: (event) => updateHsv({
										...hsv,
										a: Number(event.currentTarget.value) / 100
									}),
									className: "puzzle-color-picker__opacity-slider",
									style: { "--puzzle-color-picker-hue": hueColor }
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-color-picker__input-section",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: `${generatedId}-input`,
									className: "puzzle-color-picker__input-label",
									children: "Color value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "puzzle-color-picker__input-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: `${generatedId}-input`,
										type: "text",
										value: inputValue,
										spellCheck: false,
										autoComplete: "off",
										"aria-label": "Color value",
										"aria-invalid": inputError || void 0,
										placeholder: "#RRGGBB",
										onChange: (event) => {
											setInputValue(event.currentTarget.value);
											setInputError(false);
										},
										onKeyDown: (event) => {
											if (event.key === "Enter") {
												event.preventDefault();
												applyInput();
											}
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "puzzle-color-picker__apply",
										onClick: applyInput,
										children: "Apply"
									})]
								}),
								inputError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "puzzle-color-picker__error",
									role: "alert",
									children: "Enter a valid CSS color."
								})
							]
						}),
						(clearable || colors.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "puzzle-color-picker__swatches-section",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "puzzle-color-picker__section-label",
								children: "Presets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "puzzle-color-picker__swatches",
								role: "group",
								"aria-label": "Preset colors",
								children: [clearable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "puzzle-color-picker__swatch puzzle-color-picker__clear",
									"aria-label": clearLabel,
									"aria-pressed": selectedColor === void 0,
									title: clearLabel,
									onClick: clearColor,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": "true" })
								}), colors.map((swatch, index) => {
									const color = getSwatchValue(swatch);
									const swatchLabel = getSwatchLabel(swatch);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "puzzle-color-picker__swatch",
										style: { background: resolveCssColor(color) ?? color },
										"aria-label": swatchLabel,
										"aria-pressed": selectedColor === color,
										title: swatchLabel,
										"data-selected": selectedColor === color || void 0,
										"data-dark": isColorDark(color) || void 0,
										onClick: () => selectSwatch(color)
									}, `${color}-${index}`);
								})]
							})]
						})
					]
				})
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				id: descriptionId,
				className: "puzzle-color-picker__description",
				children: description
			})
		]
	});
};
var resolveInputGroupAddonAlign = (align) => align ?? "start";
var InputGroupAddon = ({ align, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn$1("puzzle-input-group__addon", className),
	"data-align": resolveInputGroupAddonAlign(align)
});
var InputGroupRoot = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn$1("puzzle-input-group", className)
});
var InputGroup = Object.assign(InputGroupRoot, { Addon: InputGroupAddon });
var TextAreaInput = ({ rows = 3, autoSize = true, resizable = false, className, value, defaultValue, onChange, ...props }) => {
	const textareaRef = (0, import_react.useRef)(null);
	const resize = (0, import_react.useCallback)(() => {
		const element = textareaRef.current;
		if (!element || !autoSize) return;
		element.style.height = "auto";
		const styles = (element.ownerDocument.defaultView ?? window).getComputedStyle(element);
		const lineHeight = Number.parseFloat(styles.lineHeight) || 20;
		const padding = (Number.parseFloat(styles.paddingTop) || 0) + (Number.parseFloat(styles.paddingBottom) || 0);
		const border = (Number.parseFloat(styles.borderTopWidth) || 0) + (Number.parseFloat(styles.borderBottomWidth) || 0);
		const minHeight = lineHeight * rows + padding + border;
		element.style.height = `${Math.max(minHeight, element.scrollHeight)}px`;
	}, [autoSize, rows]);
	(0, import_react.useLayoutEffect)(() => {
		resize();
	}, [
		resize,
		value,
		defaultValue
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		ref: textareaRef,
		rows,
		value,
		defaultValue,
		onChange: (event) => {
			onChange?.(event);
			resize();
		},
		className: cn$1("puzzle-input", "puzzle-input--textarea", className),
		style: {
			...props.style,
			resize: resizable ? "vertical" : "none",
			overflowY: autoSize ? "hidden" : "auto"
		}
	});
};
var clamp$3 = (value, min, max) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
var getPrecision = (value) => {
	const valueString = String(value);
	if (valueString.includes("e-")) return Number(valueString.split("e-")[1]) || 0;
	return valueString.split(".")[1]?.length ?? 0;
};
var NumberInput = ({ value, initialValue = 0, onChange, min, max, step = 1, largeStep, fractionDigits = getPrecision(step), longPressDelay = 450, repeatInterval = 120, decrementLabel = "Decrease value", incrementLabel = "Increase value", disabled, readOnly, className, onBlur, onFocus, onKeyDown, ...inputProps }) => {
	const isControlled = value !== void 0;
	const digits = Math.min(12, Math.max(0, Math.trunc(fractionDigits)));
	const factor = 10 ** digits;
	const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
	const safeLargeStep = largeStep !== void 0 && Number.isFinite(largeStep) && largeStep > 0 ? largeStep : safeStep * 10;
	const allowsNegative = min === void 0 || min < 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => clamp$3(Number.isFinite(initialValue) ? initialValue : 0, min, max));
	const currentValue = clamp$3(isControlled ? value : internalValue, min, max);
	const [draft, setDraft] = (0, import_react.useState)(() => String(Number(currentValue.toFixed(digits))));
	const currentValueRef = (0, import_react.useRef)(currentValue);
	const focusedRef = (0, import_react.useRef)(false);
	const holdTimerRef = (0, import_react.useRef)(null);
	const repeatTimerRef = (0, import_react.useRef)(null);
	const holdStartedAtRef = (0, import_react.useRef)(0);
	const holdDirectionRef = (0, import_react.useRef)(1);
	currentValueRef.current = currentValue;
	(0, import_react.useEffect)(() => {
		if (!focusedRef.current) setDraft(String(Number(currentValue.toFixed(digits))));
	}, [currentValue, digits]);
	const commit = (0, import_react.useCallback)((nextValue) => {
		const rounded = Math.round(clamp$3(nextValue, min, max) * factor) / factor;
		if (!Number.isFinite(rounded) || rounded === currentValueRef.current) return;
		currentValueRef.current = rounded;
		if (!isControlled) setInternalValue(rounded);
		setDraft(String(rounded));
		onChange?.(rounded);
	}, [
		factor,
		isControlled,
		max,
		min,
		onChange
	]);
	const changeBy = (0, import_react.useCallback)((direction, amount = safeStep) => {
		const next = Math.round((currentValueRef.current + direction * amount) * factor) / factor;
		commit(next);
	}, [
		commit,
		factor,
		safeStep
	]);
	const stopHold = (0, import_react.useCallback)(() => {
		if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
		if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
		holdTimerRef.current = null;
		repeatTimerRef.current = null;
	}, []);
	const scheduleRepeat = (0, import_react.useCallback)(() => {
		const elapsed = Date.now() - holdStartedAtRef.current;
		const interval = Math.max(45, repeatInterval - Math.floor(elapsed / 1800) * 20);
		repeatTimerRef.current = setTimeout(() => {
			changeBy(holdDirectionRef.current);
			scheduleRepeat();
		}, interval);
	}, [changeBy, repeatInterval]);
	const startHold = (direction) => (event) => {
		if (disabled || readOnly || event.button !== 0) return;
		event.preventDefault();
		stopHold();
		holdDirectionRef.current = direction;
		holdStartedAtRef.current = Date.now();
		changeBy(direction);
		holdTimerRef.current = setTimeout(scheduleRepeat, longPressDelay);
	};
	const handleStepperKeyDown = (direction) => (event) => {
		if (event.key !== " " && event.key !== "Enter") return;
		event.preventDefault();
		changeBy(direction);
	};
	const handleInputKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled || readOnly) return;
		switch (event.key) {
			case "ArrowUp":
				changeBy(1);
				break;
			case "ArrowDown":
				changeBy(-1);
				break;
			case "PageUp":
				changeBy(1, safeLargeStep);
				break;
			case "PageDown":
				changeBy(-1, safeLargeStep);
				break;
			case "Home":
				if (min === void 0) return;
				commit(min);
				break;
			case "End":
				if (max === void 0) return;
				commit(max);
				break;
			default: return;
		}
		event.preventDefault();
	};
	const handleInputChange = (event) => {
		const nextDraft = event.target.value;
		setDraft(nextDraft);
		if (nextDraft.trim() === "" || nextDraft === "-" || nextDraft === "." || nextDraft === "-.") return;
		const parsed = Number(nextDraft.replace(",", "."));
		if (Number.isFinite(parsed)) commit(parsed);
	};
	const handleBlur = (event) => {
		focusedRef.current = false;
		const parsed = Number(draft.replace(",", "."));
		const nextValue = draft.trim() !== "" && Number.isFinite(parsed) ? clamp$3(Math.round(parsed * factor) / factor, min, max) : currentValueRef.current;
		commit(nextValue);
		setDraft(String(Number(nextValue.toFixed(digits))));
		onBlur?.(event);
	};
	(0, import_react.useEffect)(() => stopHold, [stopHold]);
	const atMinimum = min !== void 0 && currentValue <= min;
	const atMaximum = max !== void 0 && currentValue >= max;
	const trimmedDraft = draft.trim();
	const draftIsIncomplete = trimmedDraft === "" || trimmedDraft === "-" || trimmedDraft === "." || trimmedDraft === "-.";
	const draftValue = Number(trimmedDraft.replace(",", "."));
	const draftIsInvalid = !draftIsIncomplete && (!Number.isFinite(draftValue) || min !== void 0 && draftValue < min || max !== void 0 && draftValue > max);
	const stepperDisabled = disabled || readOnly;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("puzzle-input", "puzzle-input--number", className),
		"data-disabled": disabled || void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "puzzle-input__stepper",
				"aria-label": decrementLabel,
				tabIndex: -1,
				disabled: stepperDisabled || atMinimum,
				onPointerDown: startHold(-1),
				onPointerUp: stopHold,
				onPointerLeave: stopHold,
				onPointerCancel: stopHold,
				onKeyDown: handleStepperKeyDown(-1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:minus" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...inputProps,
				type: "text",
				role: "spinbutton",
				"aria-valuenow": currentValue,
				"aria-valuemin": min,
				"aria-valuemax": max,
				"aria-invalid": draftIsInvalid || inputProps["aria-invalid"],
				inputMode: allowsNegative ? "text" : digits > 0 ? "decimal" : "numeric",
				pattern: `${allowsNegative ? "-?" : ""}[0-9]*${digits > 0 ? "[.,]?[0-9]*" : ""}`,
				disabled,
				readOnly,
				value: draft,
				className: "puzzle-input__control",
				onFocus: (event) => {
					focusedRef.current = true;
					onFocus?.(event);
				},
				onChange: handleInputChange,
				onKeyDown: handleInputKeyDown,
				onBlur: handleBlur
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "puzzle-input__stepper",
				"aria-label": incrementLabel,
				tabIndex: -1,
				disabled: stepperDisabled || atMaximum,
				onPointerDown: startHold(1),
				onPointerUp: stopHold,
				onPointerLeave: stopHold,
				onPointerCancel: stopHold,
				onKeyDown: handleStepperKeyDown(1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:plus" })
			})
		]
	});
};
var mergeDescribedBy = (...values) => {
	const ids = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (!value) continue;
		for (const id of value.trim().split(/\s+/)) if (id) ids.add(id);
	}
	return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
};
var resolveRadioGroupError = (error, invalid) => {
	const errorContent = error === true ? "Invalid value" : error;
	const isInvalid = invalid ?? (error !== void 0 && error !== null && error !== false);
	return {
		isInvalid,
		errorContent,
		hasError: isInvalid && errorContent !== void 0 && errorContent !== null && errorContent !== false
	};
};
var RadioGroupContext$1 = (0, import_react.createContext)(null);
var useRadioGroupContext$1 = () => {
	const context = (0, import_react.useContext)(RadioGroupContext$1);
	if (!context) throw new Error("Radio must be rendered inside a RadioGroup.");
	return context;
};
var Radio = ({ value, label, children, description, disabled = false, className, style, id, ref, onChange, onFocus, onKeyDown, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...inputProps }) => {
	const context = useRadioGroupContext$1();
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? generatedId;
	const descriptionId = description != null ? `${inputId}-description` : void 0;
	const radioLabel = label ?? children;
	const labelId = radioLabel != null ? `${inputId}-label` : void 0;
	const isDisabled = context.disabled || disabled;
	const isSelected = context.value === value;
	const isRequired = Boolean(context.name) && context.required && context.requiredValue === value;
	const describedBy = mergeDescribedBy(context.describedBy, ariaDescribedBy, descriptionId);
	const rovingRef = context.rovingFocus.getItemRef(value);
	const setInputRef = (0, import_react.useCallback)((node) => {
		rovingRef(node);
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref, rovingRef]);
	const handleFocus = (event) => {
		context.rovingFocus.onItemFocus(value);
		if (context.keyboardNavigationRef.current) {
			context.keyboardNavigationRef.current = false;
			context.selectValue(value);
		}
		onFocus?.(event);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || isDisabled) return;
		const isHorizontalArrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
		const isVerticalArrow = event.key === "ArrowUp" || event.key === "ArrowDown";
		const isArrowKey = isHorizontalArrow || isVerticalArrow;
		const isSupportedArrow = context.orientation === "horizontal" ? isHorizontalArrow : isVerticalArrow;
		if (isArrowKey && !isSupportedArrow) {
			event.preventDefault();
			return;
		}
		const activeElement = event.currentTarget.ownerDocument.activeElement;
		context.keyboardNavigationRef.current = true;
		context.rovingFocus.onItemKeyDown(event, value);
		if (event.currentTarget.ownerDocument.activeElement === activeElement) context.keyboardNavigationRef.current = false;
	};
	const handleChange = (event) => {
		onChange?.(event);
		if (!event.defaultPrevented) context.selectValue(value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn$1("puzzle-radio", `puzzle-radio--${context.size}`, isSelected && "puzzle-radio--checked", isDisabled && "puzzle-radio--disabled", className),
		style,
		"data-state": isSelected ? "checked" : "unchecked",
		"data-disabled": isDisabled ? "true" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...inputProps,
				ref: setInputRef,
				id: inputId,
				className: "puzzle-radio__input",
				type: "radio",
				name: context.name,
				form: context.form,
				value,
				checked: isSelected,
				disabled: isDisabled,
				required: isRequired,
				tabIndex: context.rovingFocus.getItemTabIndex(value, isDisabled),
				"aria-labelledby": inputProps["aria-labelledby"] ?? (inputProps["aria-label"] ? void 0 : labelId),
				"aria-describedby": describedBy,
				"aria-invalid": context.invalid ? true : ariaInvalid,
				"data-state": isSelected ? "checked" : "unchecked",
				onChange: handleChange,
				onFocus: handleFocus,
				onKeyDown: handleKeyDown
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-radio__control",
				"aria-hidden": "true"
			}),
			(radioLabel != null || description != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "puzzle-radio__content",
				children: [radioLabel != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: labelId,
					className: "puzzle-radio__label",
					children: radioLabel
				}), description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: descriptionId,
					className: "puzzle-radio__description",
					children: description
				})]
			})
		]
	});
};
var isRadioElement = (child) => (0, import_react.isValidElement)(child) && child.type === Radio;
var getRadioElements = (children) => import_react.Children.toArray(children).flatMap((child) => {
	if ((0, import_react.isValidElement)(child) && child.type === import_react.Fragment) return getRadioElements(child.props.children);
	return isRadioElement(child) ? [child] : [];
});
var RadioGroupRoot = ({ value, defaultValue, onValueChange, name, form, label, description, error, invalid, required = false, disabled = false, orientation = "vertical", size = "md", dir = "ltr", loop = true, children, id, className, style, role, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, "aria-labelledby": ariaLabelledBy, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const groupId = id ?? generatedId;
	const descriptionId = description != null ? `${groupId}-description` : void 0;
	const errorState = resolveRadioGroupError(error, invalid);
	const errorId = errorState.hasError ? `${groupId}-error` : void 0;
	const describedBy = mergeDescribedBy(ariaDescribedBy, descriptionId, errorId);
	const groupName = name?.trim() || void 0;
	const [uncontrolledValue, setUncontrolledValue] = (0, import_react.useState)(() => defaultValue);
	const isControlled = value !== void 0;
	const selectedValue = isControlled ? value ?? void 0 : uncontrolledValue;
	const radioElements = getRadioElements(children);
	const seenValues = /* @__PURE__ */ new Set();
	for (const radio of radioElements) {
		const radioValue = radio.props.value;
		if (seenValues.has(radioValue)) throw new Error("RadioGroup radio values must be unique.");
		seenValues.add(radioValue);
	}
	const firstEnabledValue = radioElements.find((radio) => !disabled && !radio.props.disabled)?.props.value;
	const selectedFocusValue = radioElements.find((radio) => radio.props.value === selectedValue && !disabled && !radio.props.disabled)?.props.value ?? firstEnabledValue;
	const focusItems = radioElements.map((radio) => ({
		id: radio.props.value,
		disabled: disabled || radio.props.disabled
	}));
	const rovingFocus = useRovingFocus({
		items: focusItems,
		orientation,
		dir,
		loop,
		initialActiveId: selectedFocusValue
	});
	(0, import_react.useEffect)(() => {
		if (selectedFocusValue !== void 0) rovingFocus.onItemFocus(selectedFocusValue);
	}, [selectedFocusValue, rovingFocus.onItemFocus]);
	const keyboardNavigationRef = (0, import_react.useRef)(false);
	const selectValue = (0, import_react.useCallback)((nextValue) => {
		if (selectedValue === nextValue) return;
		if (!isControlled) setUncontrolledValue(nextValue);
		onValueChange?.(nextValue);
	}, [
		isControlled,
		onValueChange,
		selectedValue
	]);
	const contextValue = {
		value: selectedValue,
		name: groupName,
		form,
		disabled,
		required,
		requiredValue: firstEnabledValue,
		orientation,
		size,
		invalid: errorState.isInvalid,
		describedBy,
		keyboardNavigationRef,
		rovingFocus,
		selectValue
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupContext$1.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			...rootProps,
			id: groupId,
			form,
			disabled,
			className: cn$1("puzzle-radio-group", className),
			style,
			role: role ?? "radiogroup",
			dir,
			"aria-labelledby": ariaLabelledBy,
			"aria-describedby": describedBy,
			"aria-invalid": errorState.isInvalid ? true : ariaInvalid,
			"aria-required": required || void 0,
			"aria-disabled": disabled || void 0,
			"data-orientation": orientation,
			"data-disabled": disabled ? "true" : void 0,
			"data-invalid": errorState.isInvalid ? "true" : void 0,
			"data-size": size,
			children: [
				label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
					id: `${groupId}-label`,
					className: "puzzle-radio-group__legend",
					children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-radio-group__required",
						"aria-hidden": "true",
						children: "*"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-radio-group__options",
					"data-orientation": orientation,
					children
				}),
				description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: descriptionId,
					className: "puzzle-radio-group__description",
					children: description
				}),
				errorState.hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: errorId,
					className: "puzzle-radio-group__error",
					role: "alert",
					"aria-live": "polite",
					"aria-atomic": "true",
					children: errorState.errorContent
				})
			]
		})
	});
};
var RadioGroup = RadioGroupRoot;
var TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;
var parseTime = (value) => {
	if (!value) return null;
	const match = TIME_PATTERN.exec(value);
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	const seconds = Number(match[3] ?? 0);
	return hours * 3600 + minutes * 60 + seconds;
};
var normalizeTime = (value, showSeconds = false) => {
	if (!value) return null;
	const parsed = parseTime(value);
	if (parsed === null) return null;
	const hours = Math.floor(parsed / 3600);
	const minutes = Math.floor(parsed % 3600 / 60);
	const seconds = parsed % 60;
	const base = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
	return showSeconds ? `${base}:${String(seconds).padStart(2, "0")}` : base;
};
var TimePicker = ({ value, defaultValue, onChange, label, description, error, disabled = false, readOnly = false, required = false, name, form, minTime, maxTime, minuteStep = 1, showSeconds = false, secondStep = 1, size = "md", fullWidth = false, rootClassName, className, id, style, onBlur, onFocus, onInvalid, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...inputProps }) => {
	const baseId = (0, import_react.useId)();
	const inputId = id ?? `${baseId}-input`;
	const labelId = `${baseId}-label`;
	const descriptionId = `${baseId}-description`;
	const errorId = `${baseId}-error`;
	const isControlled = value !== void 0;
	const selectedValue = normalizeTime(isControlled ? value : defaultValue, showSeconds);
	const responsiveSize = resolveResponsiveValue(size, "md");
	const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);
	const hasError = error !== void 0 && error !== null && error !== false;
	const isInvalid = hasError || ariaInvalid !== void 0 && ariaInvalid !== false && ariaInvalid !== "false";
	const resolvedAriaInvalid = isInvalid ? true : ariaInvalid;
	const errorContent = error === true ? "Invalid time" : error;
	const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : void 0);
	const resolvedDescribedBy = [
		ariaDescribedBy,
		description != null ? descriptionId : void 0,
		hasError ? errorId : void 0
	].filter(Boolean).join(" ") || void 0;
	const isConfigurationInvalid = (0, import_react.useMemo)(() => {
		const min = parseTime(minTime);
		const max = parseTime(maxTime);
		return minTime != null && min === null || maxTime != null && max === null || min !== null && max !== null && min > max || !Number.isInteger(minuteStep) || minuteStep < 1 || minuteStep > 60 || !Number.isInteger(secondStep) || secondStep < 1 || secondStep > 60;
	}, [
		minTime,
		maxTime,
		minuteStep,
		secondStep
	]);
	const step = showSeconds ? secondStep : minuteStep * 60;
	const handleChange = (event) => {
		const nextValue = normalizeTime(event.currentTarget.value, showSeconds);
		onChange?.(nextValue);
	};
	const inputValue = selectedValue ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("puzzle-time-picker", rootClassName),
		"data-disabled": disabled ? "true" : void 0,
		"data-readonly": readOnly ? "true" : void 0,
		"data-invalid": isInvalid ? "true" : void 0,
		"data-size-mobile": responsiveSize.mobile,
		"data-size-tablet": responsiveSize.tablet,
		"data-size-desktop": responsiveSize.desktop,
		"data-full-width-mobile": String(responsiveFullWidth.mobile),
		"data-full-width-tablet": String(responsiveFullWidth.tablet),
		"data-full-width-desktop": String(responsiveFullWidth.desktop),
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				id: labelId,
				className: "puzzle-time-picker__label",
				htmlFor: inputId,
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-time-picker__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...inputProps,
				id: inputId,
				type: "time",
				name,
				form,
				value: isControlled ? inputValue : void 0,
				defaultValue: !isControlled ? inputValue : void 0,
				disabled: disabled || isConfigurationInvalid,
				readOnly,
				required,
				min: minTime,
				max: maxTime,
				step,
				style,
				className: cn$1("puzzle-time-picker__input", className),
				onChange: handleChange,
				onBlur,
				onFocus,
				onInvalid,
				"aria-label": ariaLabel,
				"aria-labelledby": resolvedLabelledBy,
				"aria-describedby": resolvedDescribedBy,
				"aria-invalid": resolvedAriaInvalid,
				"aria-required": required || void 0
			}),
			description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: descriptionId,
				className: "puzzle-time-picker__description",
				children: description
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: errorId,
				className: "puzzle-time-picker__error",
				role: "alert",
				children: errorContent
			})
		]
	});
};
var sanitizeToken = (value, length, mode = "numeric") => {
	return (mode === "numeric" ? value.replace(/[^0-9]/g, "") : value.replace(/[^a-zA-Z0-9]/g, "")).slice(0, Math.max(0, length));
};
var getNextActiveIndex = (value, length) => Math.min(value.length, length - 1);
var getPreviousActiveIndex = (index) => Math.max(0, index - 1);
var isTokenComplete = (value, length) => value.length === length;
var removeTokenCharacter = (value, index) => value.slice(0, index) + value.slice(index + 1);
var replaceTokenCharacter = (value, index, character, length, mode) => {
	const normalized = sanitizeToken(character, length, mode);
	if (!normalized) return removeTokenCharacter(value, index);
	return sanitizeToken(value.slice(0, index) + normalized[0] + value.slice(index + 1), length, mode);
};
var insertTokenCharacters = (value, index, insertedValue, length, mode) => {
	const normalized = sanitizeToken(insertedValue, length, mode);
	if (!normalized) return value;
	if (normalized.length >= length) return normalized.slice(0, length);
	if (normalized.length === 1) return replaceTokenCharacter(value, index, normalized, length, mode);
	const start = Math.max(0, Math.min(index, length));
	return sanitizeToken(value.slice(0, start) + normalized + value.slice(start + normalized.length), length, mode);
};
var TokenInput = ({ length = 6, value, defaultValue = "", onValueChange, onComplete, mode = "numeric", mask = false, disabled = false, readOnly = false, required = false, size = "md", label, id, name, form, inputMode, autoComplete = "one-time-code", className, style, ref, onFocus, onBlur, onKeyDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rootProps }) => {
	if (!Number.isInteger(length) || length < 1 || length > 32) throw new Error("TokenInput length must be an integer between 1 and 32.");
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? `${generatedId}-input`;
	const labelId = `${inputId}-label`;
	const isControlled = value !== void 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(() => sanitizeToken(defaultValue, length, mode));
	const currentValue = sanitizeToken(isControlled ? value : internalValue, length, mode);
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(() => getNextActiveIndex(currentValue, length));
	const inputRefs = (0, import_react.useRef)([]);
	const completedValueRef = (0, import_react.useRef)(null);
	const resolvedActiveIndex = Math.min(activeIndex, length - 1);
	const isInvalid = ariaInvalid === true || ariaInvalid === "true";
	const setFirstInputRef = (0, import_react.useCallback)((node) => {
		inputRefs.current[0] = node;
		if (typeof ref === "function") return ref(node);
		if (ref) ref.current = node;
	}, [ref]);
	const focusInput = (0, import_react.useCallback)((index) => {
		const nextIndex = Math.max(0, Math.min(index, length - 1));
		setActiveIndex(nextIndex);
		const input = inputRefs.current[nextIndex];
		input?.focus();
		input?.select();
	}, [length]);
	const commitValue = (0, import_react.useCallback)((nextValue) => {
		const normalized = sanitizeToken(nextValue, length, mode);
		if (normalized === currentValue) return;
		const wasComplete = isTokenComplete(currentValue, length);
		const isComplete = isTokenComplete(normalized, length);
		if (!isControlled) setInternalValue(normalized);
		onValueChange?.(normalized);
		if (!wasComplete && isComplete) {
			if (completedValueRef.current !== normalized) onComplete?.(normalized);
			completedValueRef.current = normalized;
		} else if (!isComplete) completedValueRef.current = null;
	}, [
		currentValue,
		isControlled,
		length,
		mode,
		onComplete,
		onValueChange
	]);
	const handleChange = (index, event) => {
		if (disabled || readOnly) return;
		const enteredValue = sanitizeToken(event.currentTarget.value, length, mode);
		const nextValue = enteredValue.length > 1 ? insertTokenCharacters(currentValue, index, enteredValue, length, mode) : replaceTokenCharacter(currentValue, index, enteredValue, length, mode);
		commitValue(nextValue);
		if (enteredValue.length > 0) focusInput(Math.min(index + enteredValue.length, length - 1));
		else focusInput(index);
	};
	const handlePaste = (index, event) => {
		if (disabled || readOnly) {
			event.preventDefault();
			return;
		}
		event.preventDefault();
		const pastedValue = sanitizeToken(event.clipboardData.getData("text"), length, mode);
		if (!pastedValue) return;
		const nextValue = insertTokenCharacters(currentValue, index, pastedValue, length, mode);
		commitValue(nextValue);
		focusInput(Math.min(index + pastedValue.length, length - 1));
	};
	const handleKeyDown = (index, event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || disabled) return;
		switch (event.key) {
			case "ArrowLeft":
				event.preventDefault();
				focusInput(index - 1);
				break;
			case "ArrowRight":
				event.preventDefault();
				focusInput(index + 1);
				break;
			case "Home":
				event.preventDefault();
				focusInput(0);
				break;
			case "End":
				event.preventDefault();
				focusInput(length - 1);
				break;
			case "Backspace":
				if (readOnly) return;
				event.preventDefault();
				if (currentValue[index]) {
					commitValue(removeTokenCharacter(currentValue, index));
					focusInput(index);
				} else if (index > 0) {
					const previousIndex = getPreviousActiveIndex(index);
					commitValue(removeTokenCharacter(currentValue, previousIndex));
					focusInput(previousIndex);
				}
				break;
			case "Delete":
				if (readOnly) return;
				event.preventDefault();
				if (currentValue[index]) commitValue(removeTokenCharacter(currentValue, index));
				focusInput(index);
		}
	};
	const handleFocus = (event) => {
		const index = Number(event.currentTarget.dataset.tokenIndex);
		setActiveIndex(index);
		event.currentTarget.select();
		onFocus?.(event);
	};
	const handleBlur = (event) => {
		onBlur?.(event);
	};
	const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...rootProps,
		className: cn$1("puzzle-token-input", className),
		style,
		role: "group",
		"aria-label": ariaLabel,
		"aria-labelledby": resolvedLabelledBy,
		"aria-describedby": ariaDescribedBy,
		"aria-invalid": ariaInvalid,
		"aria-required": required || void 0,
		"aria-disabled": disabled || void 0,
		"data-size": size,
		"data-disabled": disabled || void 0,
		"data-readonly": readOnly || void 0,
		"data-invalid": isInvalid || void 0,
		children: [
			label != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				id: labelId,
				htmlFor: inputId,
				className: "puzzle-token-input__label",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-token-input__slots",
				children: Array.from({ length }, (_, index) => {
					const character = currentValue[index] ?? "";
					const slotLabel = ariaLabel ? `${ariaLabel}, character ${index + 1} of ${length}` : index === 0 && (id != null || label != null) ? void 0 : `Character ${index + 1} of ${length}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: index === 0 ? setFirstInputRef : (node) => {
							inputRefs.current[index] = node;
						},
						id: index === 0 ? inputId : void 0,
						"data-token-index": index,
						className: "puzzle-token-input__slot",
						type: mask ? "password" : "text",
						inputMode: inputMode ?? (mode === "numeric" ? "numeric" : "text"),
						autoComplete: index === 0 ? autoComplete : "off",
						autoCapitalize: "off",
						spellCheck: false,
						maxLength: length,
						value: character,
						disabled,
						readOnly,
						required,
						tabIndex: index === resolvedActiveIndex ? 0 : -1,
						"aria-label": slotLabel,
						"aria-describedby": ariaDescribedBy,
						"aria-invalid": ariaInvalid,
						onChange: (event) => handleChange(index, event),
						onPaste: (event) => handlePaste(index, event),
						onKeyDown: (event) => handleKeyDown(index, event),
						onFocus: handleFocus,
						onBlur: handleBlur
					}, index);
				})
			}),
			name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name,
				form,
				value: currentValue,
				disabled
			})
		]
	});
};
var getAspectRatioStyle = (ratio, style) => {
	if (!Number.isFinite(ratio) || ratio <= 0) throw new RangeError("AspectRatio: ratio must be a positive finite number.");
	return {
		...style,
		aspectRatio: ratio
	};
};
var AspectRatio = ({ as, ratio = 1, className, style, children, ...rest }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(as ?? "div", {
		className: cn$1("puzzle-aspect-ratio", className),
		style: getAspectRatioStyle(ratio, style),
		...rest,
		children
	});
};
var toCssLength = (value) => typeof value === "number" ? `${value}px` : value;
var toCssAngle = (value) => typeof value === "number" ? `${value}deg` : value;
var clampOpacity = (value) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : void 0;
var Background = ({ as, pattern = "grid", size = 24, majorSize, lineWidth = 1, dotSize = 2, angle = 45, patternColor, backgroundColor, patternOpacity, meshColors, fade, className, style, children, ...props }) => {
	const Component = as ?? "div";
	const backgroundStyle = {
		...style,
		"--_background-size": toCssLength(size),
		"--_background-major-size": majorSize ? toCssLength(majorSize) : void 0,
		"--_background-line-width": toCssLength(lineWidth),
		"--_background-dot-size": toCssLength(dotSize),
		"--_background-angle": toCssAngle(angle),
		"--_background-color": backgroundColor,
		"--_pattern-color": patternColor,
		"--_pattern-opacity": patternOpacity === void 0 ? void 0 : clampOpacity(patternOpacity),
		"--_mesh-color-1": meshColors?.[0],
		"--_mesh-color-2": meshColors?.[1],
		"--_mesh-color-3": meshColors?.[2],
		"--_mesh-color-4": meshColors?.[3]
	};
	return (0, import_react.createElement)(Component, {
		...props,
		className: cn$1("puzzle-background", `puzzle-background--${pattern}`, className),
		style: backgroundStyle,
		"data-fade": fade
	}, children);
};
var Breadcrumbs = ({ items, className, style, "aria-label": ariaLabel = "Breadcrumbs", ...navProps }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		...navProps,
		"aria-label": ariaLabel,
		className: cn$1("puzzle-breadcrumbs", className),
		style,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "puzzle-breadcrumbs__list",
			children: items.map((item, index) => {
				const isCurrent = index === items.length - 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn$1("puzzle-breadcrumbs__item", isCurrent && "puzzle-breadcrumbs__item--current"),
					"aria-current": isCurrent ? "page" : void 0,
					children: [item.leadingIcon != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-breadcrumbs__icon",
						"aria-hidden": "true",
						children: item.leadingIcon
					}), isCurrent || item.href === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-breadcrumbs__label",
						children: item.label
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						className: "puzzle-breadcrumbs__link",
						href: item.href,
						children: item.label
					})]
				}, index);
			})
		})
	});
};
var isSidebarGroup = (entry) => "items" in entry;
var SidebarItemRenderer = ({ item, collapsed }) => {
	const className = cn$1("puzzle-collapsable-sidebar__item", item.active && "active");
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "puzzle-collapsable-sidebar__icon",
		"aria-hidden": "true",
		children: item.icon
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "puzzle-collapsable-sidebar__label",
		children: item.label
	})] });
	if ("href" in item && item.href !== void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
		className,
		href: item.href,
		"aria-current": item.active ? "page" : void 0,
		title: collapsed ? item.label : void 0,
		"data-active": item.active || void 0,
		children: content
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className,
		onClick: item.onClick,
		title: collapsed ? item.label : void 0,
		"data-active": item.active || void 0,
		children: content
	});
};
var SidebarGroupRenderer = ({ group, collapsed, idPrefix }) => {
	const headingId = `${idPrefix}-${group.id}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "puzzle-collapsable-sidebar__group",
		"aria-labelledby": group.label ? headingId : void 0,
		children: [group.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			id: headingId,
			type: "overline",
			as: "h2",
			className: "puzzle-collapsable-sidebar__group-label",
			children: group.label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-collapsable-sidebar__group-items",
			children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarItemRenderer, {
				item,
				collapsed
			}, item.id))
		})]
	});
};
var CollapsableSidebar = ({ items, expand = "inline", collapsed: controlledCollapsed, defaultCollapsed = true, onCollapsedChange, ariaLabel = "Main navigation", className, style }) => {
	const [internalCollapsed, setInternalCollapsed] = (0, import_react.useState)(defaultCollapsed);
	const idPrefix = `puzzle-sidebar-${(0, import_react.useId)()}`;
	const isControlled = controlledCollapsed !== void 0;
	const collapsed = isControlled ? controlledCollapsed : internalCollapsed;
	const toggleCollapsed = () => {
		const nextCollapsed = !collapsed;
		if (!isControlled) setInternalCollapsed(nextCollapsed);
		onCollapsedChange?.(nextCollapsed);
	};
	const classes = cn$1("puzzle-collapsable-sidebar", `expand-${expand}`, collapsed && "collapsed", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: classes,
		"data-collapsed": collapsed,
		"data-expand": expand,
		style,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "puzzle-collapsable-sidebar__toggle",
			onClick: toggleCollapsed,
			"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
			"aria-expanded": !collapsed,
			"aria-controls": `${idPrefix}-navigation`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: collapsed ? "›" : "‹"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			id: `${idPrefix}-navigation`,
			className: "puzzle-collapsable-sidebar__navigation",
			"aria-label": ariaLabel,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "puzzle-collapsable-sidebar__sections",
				children: items.map((entry) => isSidebarGroup(entry) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupRenderer, {
					group: entry,
					collapsed,
					idPrefix
				}, entry.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-collapsable-sidebar__group-items",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarItemRenderer, {
						item: entry,
						collapsed
					})
				}, entry.id))
			})
		})]
	});
};
var Container$2 = ({ as, className, children, widthPreset = "container", ...rest }) => {
	const Component = as ?? "div";
	const classes = cn$1("puzzle-container", getContainerPresetClass(widthPreset), className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		className: classes,
		...rest,
		children
	});
};
var getScrollAreaOverflow = (orientation) => ({
	overflowX: orientation === "horizontal" || orientation === "both" ? "auto" : "hidden",
	overflowY: orientation === "vertical" || orientation === "both" ? "auto" : "hidden"
});
var ScrollArea$1 = ({ orientation = "vertical", children, className, role, tabIndex, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ref, ...props }) => {
	const overflow = getScrollAreaOverflow(orientation);
	const accessibleName = ariaLabel || ariaLabelledBy;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		ref,
		role: role ?? (accessibleName ? "region" : void 0),
		tabIndex: tabIndex ?? 0,
		className: cn$1("puzzle-scroll-area", className),
		"data-orientation": orientation,
		style: {
			...overflow,
			...props.style
		},
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledBy,
		children
	});
};
var getSeparatorSemantics = (orientation, decorative) => {
	if (decorative) return { role: "none" };
	return {
		role: "separator",
		...orientation === "vertical" ? { "aria-orientation": "vertical" } : {}
	};
};
var Separator = ({ orientation = "horizontal", decorative = true, className, ref, ...props }) => {
	const semantics = getSeparatorSemantics(orientation, decorative);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		...semantics,
		ref,
		className: cn$1("puzzle-separator", className),
		"data-orientation": orientation
	});
};
var Sidebar$2 = ({ as, className, children, ...props }) => {
	const Component = as ?? "aside";
	const classes = cn$1("puzzle-sidebar", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		className: classes,
		...props,
		children
	});
};
var normalizeCount = (value) => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
var getPaginationItems = (totalPages, currentPage, boundaryCount = 1, siblingCount = 1) => {
	const total = normalizeCount(totalPages);
	const boundaries = normalizeCount(boundaryCount);
	const siblings = normalizeCount(siblingCount);
	if (total === 0) return [];
	const page = Math.min(Math.max(1, normalizeCount(currentPage)), total);
	if (total <= boundaries * 2 + siblings * 2 + 3) return Array.from({ length: total }, (_, index) => ({
		type: "page",
		page: index + 1
	}));
	const visiblePages = /* @__PURE__ */ new Set();
	for (let index = 1; index <= Math.min(boundaries, total); index += 1) visiblePages.add(index);
	for (let index = Math.max(1, total - boundaries + 1); index <= total; index += 1) visiblePages.add(index);
	for (let index = Math.max(1, page - siblings); index <= Math.min(total, page + siblings); index += 1) visiblePages.add(index);
	if (page - siblings <= boundaries + 1) visiblePages.add(boundaries + siblings + 1);
	if (page + siblings >= total - boundaries - 1) visiblePages.add(total - boundaries - siblings);
	const pages = [...visiblePages].sort((a, b) => a - b);
	const items = [];
	pages.forEach((current, index) => {
		if (index === 0) {
			items.push({
				type: "page",
				page: current
			});
			return;
		}
		const previous = pages[index - 1];
		const difference = current - previous;
		if (difference === 2) items.push({
			type: "page",
			page: previous + 1
		});
		else if (difference > 2) items.push({
			type: "ellipsis",
			position: index === 1 ? "start" : "end"
		});
		items.push({
			type: "page",
			page: current
		});
	});
	return items;
};
var normalizePage = (page, totalPages) => {
	const total = normalizeCount(totalPages);
	if (total === 0) return 0;
	return Math.min(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1), total);
};
var defaultLabels = {
	navigation: "Pagination",
	first: "Go to first page",
	previous: "Go to previous page",
	next: "Go to next page",
	last: "Go to last page",
	ellipsis: "More pages",
	page: (page) => `Go to page ${page}`
};
var Pagination = ({ totalPages, page, defaultPage = 1, onPageChange, siblingCount = 1, boundaryCount = 1, showFirstLast = true, disabled = false, size = "md", labels, getPageHref, getPageAriaLabel, className, ...navProps }) => {
	const [internalPage, setInternalPage] = (0, import_react.useState)(() => normalizePage(defaultPage, totalPages));
	const isControlled = page !== void 0;
	const currentPage = normalizePage(isControlled ? page : internalPage, totalPages);
	const resolvedLabels = {
		...defaultLabels,
		...labels
	};
	const items = getPaginationItems(totalPages, currentPage, boundaryCount, siblingCount);
	const changePage = (nextPage) => {
		if (disabled) return;
		const normalizedPage = normalizePage(nextPage, totalPages);
		if (normalizedPage === 0 || normalizedPage === currentPage) return;
		if (!isControlled) setInternalPage(normalizedPage);
		onPageChange?.(normalizedPage);
	};
	const renderControl = (type, targetPage, content, ariaLabel) => {
		const isDisabled = disabled || totalPages === 0 || targetPage < 1 || targetPage > totalPages || targetPage === currentPage;
		const controlClass = cn$1("puzzle-pagination__control", "puzzle-pagination__navigation", isDisabled && "puzzle-pagination__control--disabled");
		if (getPageHref && !isDisabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
			href: getPageHref(targetPage),
			className: controlClass,
			"aria-label": ariaLabel,
			onClick: () => changePage(targetPage),
			"data-pagination-action": type,
			children: content
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: controlClass,
			disabled: isDisabled,
			"aria-label": ariaLabel,
			onClick: () => changePage(targetPage),
			"data-pagination-action": type,
			children: content
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		...navProps,
		"aria-label": navProps["aria-label"] ?? resolvedLabels.navigation,
		className: cn$1("puzzle-pagination", `puzzle-pagination--${size}`, className),
		"data-disabled": disabled || void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "puzzle-pagination__list",
			children: [
				showFirstLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "puzzle-pagination__item",
					children: renderControl("first", 1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "«"
					}), resolvedLabels.first)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "puzzle-pagination__item",
					children: renderControl("previous", currentPage - 1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "‹"
					}), resolvedLabels.previous)
				}),
				items.map((item) => {
					if (item.type === "ellipsis") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "puzzle-pagination__item",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "puzzle-pagination__ellipsis",
							"aria-label": resolvedLabels.ellipsis,
							children: "…"
						})
					}, `ellipsis-${item.position}`);
					const isCurrent = item.page === currentPage;
					const ariaLabel = getPageAriaLabel?.(item.page) ?? resolvedLabels.page(item.page);
					const pageClass = cn$1("puzzle-pagination__control", "puzzle-pagination__page", isCurrent && "puzzle-pagination__page--active");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "puzzle-pagination__item",
						children: getPageHref ? isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: pageClass,
							"aria-label": ariaLabel,
							"aria-current": "page",
							"aria-disabled": disabled || void 0,
							children: item.page
						}) : disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn$1(pageClass, "puzzle-pagination__control--disabled"),
							"aria-label": ariaLabel,
							"aria-disabled": "true",
							children: item.page
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							href: getPageHref(item.page),
							className: pageClass,
							"aria-label": ariaLabel,
							"aria-current": void 0,
							onClick: () => changePage(item.page),
							children: item.page
						}) : isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: pageClass,
							"aria-label": ariaLabel,
							"aria-current": "page",
							"aria-disabled": disabled || void 0,
							children: item.page
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: pageClass,
							"aria-label": ariaLabel,
							"aria-current": isCurrent ? "page" : void 0,
							disabled: disabled || isCurrent,
							onClick: () => changePage(item.page),
							children: item.page
						})
					}, item.page);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "puzzle-pagination__item",
					children: renderControl("next", currentPage + 1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "›"
					}), resolvedLabels.next)
				}),
				showFirstLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "puzzle-pagination__item",
					children: renderControl("last", totalPages, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "»"
					}), resolvedLabels.last)
				})
			]
		})
	});
};
var normalizeIds = (ids) => Array.from(new Set((ids ?? []).filter((id) => typeof id === "string" && id.length > 0)));
var getTextValue = (item) => {
	if (item.textValue !== void 0) return item.textValue;
	if (typeof item.label === "string" || typeof item.label === "number") return String(item.label);
	return "";
};
var normalizeSearchText = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
var TreeView = ({ items, selectionMode = "single", defaultExpandedIds = [], expandedIds, onExpandedChange, defaultSelectedIds = [], selectedIds, onSelectionChange, defaultFocusedId, onFocusedChange, loadChildren, onLoadChildrenError, onItemActivate, getItemActive, renderItem, renderIcon, renderLabel, expandOnItemClick = false, typeahead = true, size = "md", indentation, loadingLabel = "Loading…", loadErrorLabel = "Could not load children. Collapse and expand to retry.", itemClassName, className, style, dir, ...rootProps }) => {
	const generatedId = (0, import_react.useId)();
	const isExpandedControlled = expandedIds !== void 0;
	const isSelectionControlled = selectedIds !== void 0;
	const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = (0, import_react.useState)(() => normalizeIds(defaultExpandedIds));
	const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = (0, import_react.useState)(() => normalizeIds(defaultSelectedIds));
	const [focusedId, setFocusedId] = (0, import_react.useState)(() => defaultFocusedId ?? (selectionMode === "none" ? void 0 : normalizeIds(selectedIds ?? defaultSelectedIds)[0]) ?? items[0]?.id);
	const [loadedChildren, setLoadedChildren] = (0, import_react.useState)(() => /* @__PURE__ */ new Map());
	const [loadingIds, setLoadingIds] = (0, import_react.useState)([]);
	const [loadErrors, setLoadErrors] = (0, import_react.useState)(() => /* @__PURE__ */ new Map());
	const itemRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const inFlightLoads = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const previousExpandedIds = (0, import_react.useRef)(null);
	const pendingFocusId = (0, import_react.useRef)(null);
	const focusWithinTree = (0, import_react.useRef)(false);
	const typeaheadState = (0, import_react.useRef)({
		value: "",
		time: 0
	});
	const currentExpandedIds = isExpandedControlled ? expandedIds ?? [] : uncontrolledExpandedIds;
	const requestedSelectedIds = isSelectionControlled ? selectedIds ?? [] : uncontrolledSelectedIds;
	const currentSelectedIds = selectionMode === "single" ? requestedSelectedIds.slice(0, 1) : requestedSelectedIds;
	const expandedSet = (0, import_react.useMemo)(() => new Set(normalizeIds(currentExpandedIds)), [currentExpandedIds]);
	const selectedSet = (0, import_react.useMemo)(() => new Set(normalizeIds(currentSelectedIds)), [currentSelectedIds]);
	const loadingSet = (0, import_react.useMemo)(() => new Set(loadingIds), [loadingIds]);
	const getChildren = (0, import_react.useCallback)((item) => item.children ?? loadedChildren.get(item.id) ?? [], [loadedChildren]);
	const hasChildren = (0, import_react.useCallback)((item) => {
		if (item.children !== void 0 || loadedChildren.has(item.id)) return getChildren(item).length > 0;
		return Boolean(item.hasChildren);
	}, [getChildren, loadedChildren]);
	const visibleItems = (0, import_react.useMemo)(() => {
		const result = [];
		const visit = (nodes) => {
			nodes.forEach((item) => {
				result.push(item);
				const children = getChildren(item);
				if (expandedSet.has(item.id) && hasChildren(item) && children.length > 0) visit(children);
			});
		};
		visit(items);
		return result;
	}, [
		items,
		expandedSet,
		getChildren,
		hasChildren
	]);
	const parentIds = (0, import_react.useMemo)(() => {
		const result = /* @__PURE__ */ new Map();
		const visit = (nodes, parentId) => {
			nodes.forEach((item) => {
				if (parentId !== void 0) result.set(item.id, parentId);
				visit(getChildren(item), item.id);
			});
		};
		visit(items);
		return result;
	}, [items, getChildren]);
	const visibleIds = (0, import_react.useMemo)(() => new Set(visibleItems.map((item) => item.id)), [visibleItems]);
	let effectiveFocusedId = focusedId;
	if (!effectiveFocusedId || !visibleIds.has(effectiveFocusedId)) {
		let ancestor = effectiveFocusedId;
		while (ancestor && !visibleIds.has(ancestor)) ancestor = parentIds.get(ancestor);
		effectiveFocusedId = ancestor ?? visibleItems[0]?.id;
	}
	(0, import_react.useEffect)(() => {
		if (pendingFocusId.current && visibleIds.has(pendingFocusId.current)) {
			itemRefs.current.get(pendingFocusId.current)?.focus();
			pendingFocusId.current = null;
		}
	}, [visibleItems, visibleIds]);
	(0, import_react.useEffect)(() => {
		if (focusedId !== effectiveFocusedId && effectiveFocusedId) {
			setFocusedId(effectiveFocusedId);
			onFocusedChange?.(effectiveFocusedId);
			if (focusWithinTree.current) itemRefs.current.get(effectiveFocusedId)?.focus();
		}
	}, [
		effectiveFocusedId,
		focusedId,
		onFocusedChange
	]);
	const commitExpandedIds = (nextIds) => {
		const next = normalizeIds(nextIds);
		if (!isExpandedControlled) setUncontrolledExpandedIds(next);
		onExpandedChange?.(next);
	};
	const commitSelectedIds = (nextIds) => {
		const next = normalizeIds(nextIds);
		if (!isSelectionControlled) setUncontrolledSelectedIds(next);
		onSelectionChange?.(next);
	};
	const loadNodeChildren = (0, import_react.useCallback)(async (item) => {
		if (!loadChildren || !item.hasChildren || item.children !== void 0) return;
		if (loadedChildren.has(item.id) || inFlightLoads.current.has(item.id)) return;
		inFlightLoads.current.add(item.id);
		setLoadingIds((current) => [...current, item.id]);
		setLoadErrors((current) => {
			const next = new Map(current);
			next.delete(item.id);
			return next;
		});
		try {
			const children = await loadChildren(item);
			setLoadedChildren((current) => {
				const next = new Map(current);
				next.set(item.id, children);
				return next;
			});
		} catch (error) {
			setLoadErrors((current) => {
				const next = new Map(current);
				next.set(item.id, error);
				return next;
			});
			onLoadChildrenError?.(item, error);
		} finally {
			inFlightLoads.current.delete(item.id);
			setLoadingIds((current) => current.filter((id) => id !== item.id));
		}
	}, [
		loadChildren,
		loadedChildren,
		onLoadChildrenError
	]);
	(0, import_react.useEffect)(() => {
		const previous = new Set(previousExpandedIds.current ?? []);
		const newlyExpandedIds = currentExpandedIds.filter((id) => !previous.has(id));
		previousExpandedIds.current = normalizeIds(currentExpandedIds);
		newlyExpandedIds.forEach((id) => {
			const item = findItemById(items, id, getChildren);
			if (item) loadNodeChildren(item);
		});
	}, [
		currentExpandedIds,
		items,
		getChildren,
		loadNodeChildren
	]);
	const toggleExpanded = (item) => {
		if (!hasChildren(item)) return;
		const next = new Set(currentExpandedIds);
		if (next.has(item.id)) next.delete(item.id);
		else {
			next.add(item.id);
			loadNodeChildren(item);
		}
		commitExpandedIds(Array.from(next));
	};
	const selectItem = (item, toggleSingle = false) => {
		if (selectionMode === "none" || item.disabled || item.selectable === false) return;
		if (selectionMode === "single") {
			if (currentSelectedIds.length === 1 && currentSelectedIds[0] === item.id) {
				if (toggleSingle) commitSelectedIds([]);
				return;
			}
			commitSelectedIds([item.id]);
			return;
		}
		const next = new Set(currentSelectedIds);
		if (next.has(item.id)) next.delete(item.id);
		else next.add(item.id);
		commitSelectedIds(Array.from(next));
	};
	const focusItem = (id) => {
		const element = itemRefs.current.get(id);
		if (element) element.focus();
		else {
			setFocusedId(id);
			onFocusedChange?.(id);
			pendingFocusId.current = id;
		}
	};
	const expandSiblings = (itemId) => {
		const parentId = parentIds.get(itemId);
		const parentItem = parentId ? findItemById(items, parentId, getChildren) : void 0;
		const siblings = parentItem ? getChildren(parentItem) : items;
		const next = new Set(currentExpandedIds);
		let changed = false;
		siblings.forEach((sibling) => {
			if (hasChildren(sibling) && !next.has(sibling.id)) {
				next.add(sibling.id);
				changed = true;
				loadNodeChildren(sibling);
			}
		});
		if (changed) commitExpandedIds(Array.from(next));
	};
	const handleKeyDown = (event, item, parentId) => {
		const eventTarget = event.target;
		if (eventTarget.closest("[role=\"treeitem\"]") !== event.currentTarget) return;
		if (eventTarget.closest("button, a, input, select, textarea, [contenteditable='true']")) return;
		const index = visibleItems.findIndex((visibleItem) => visibleItem.id === item.id);
		const inheritedDirection = event.currentTarget.closest("[dir]")?.getAttribute("dir");
		const isRtl = dir === "rtl" || dir === void 0 && inheritedDirection === "rtl";
		const openKey = isRtl ? "ArrowLeft" : "ArrowRight";
		const closeKey = isRtl ? "ArrowRight" : "ArrowLeft";
		let handled = false;
		switch (event.key) {
			case "ArrowDown":
				if (index < visibleItems.length - 1) focusItem(visibleItems[index + 1].id);
				handled = true;
				break;
			case "ArrowUp":
				if (index > 0) focusItem(visibleItems[index - 1].id);
				handled = true;
				break;
			case "Home":
				if (visibleItems[0]) focusItem(visibleItems[0].id);
				handled = true;
				break;
			case "End":
				if (visibleItems.length > 0) focusItem(visibleItems[visibleItems.length - 1].id);
				handled = true;
				break;
			case "Enter":
				if (item.href) {
					if (!item.disabled) {
						event.currentTarget.querySelector("a.puzzle-tree__row")?.click();
						onItemActivate?.(item);
					}
				} else if (hasChildren(item)) {
					toggleExpanded(item);
					if (!item.disabled) onItemActivate?.(item);
				} else {
					selectItem(item);
					if (!item.disabled) onItemActivate?.(item);
				}
				handled = true;
				break;
			case " ":
			case "Spacebar":
				selectItem(item, true);
				handled = true;
				break;
			case "*":
				expandSiblings(item.id);
				handled = true;
				break;
			default: if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
				if (!typeahead) break;
				const currentTime = event.timeStamp;
				const previousValue = currentTime - typeaheadState.current.time > 500 ? "" : typeaheadState.current.value;
				const normalizedPrevious = normalizeSearchText(previousValue);
				const normalizedKey = normalizeSearchText(event.key);
				const searchValue = normalizedPrevious.length > 0 && [...normalizedPrevious].every((character) => character === normalizedKey) ? event.key : `${previousValue}${event.key}`;
				typeaheadState.current = {
					value: searchValue,
					time: currentTime
				};
				const normalizedSearch = normalizeSearchText(searchValue);
				const match = [...visibleItems.slice(index + 1), ...visibleItems.slice(0, index + 1)].find((candidate) => normalizeSearchText(getTextValue(candidate)).startsWith(normalizedSearch));
				if (match) focusItem(match.id);
				handled = true;
			}
		}
		if (event.key === openKey) {
			if (hasChildren(item)) {
				if (!expandedSet.has(item.id)) toggleExpanded(item);
				else {
					const firstChild = getChildren(item)[0];
					if (firstChild) focusItem(firstChild.id);
				}
			}
			handled = true;
		} else if (event.key === closeKey) {
			if (hasChildren(item) && expandedSet.has(item.id)) toggleExpanded(item);
			else if (parentId) focusItem(parentId);
			handled = true;
		}
		if (handled) event.preventDefault();
	};
	const handleItemClick = (event, item) => {
		const target = event.target;
		if (target.closest("[role=\"treeitem\"]") !== event.currentTarget) return;
		if (target.closest("button, a, input, select, textarea, [data-tree-stop-selection]")) return;
		focusItem(item.id);
		if (hasChildren(item) && (target.closest("[data-tree-toggle]") || expandOnItemClick)) {
			toggleExpanded(item);
			return;
		}
		selectItem(item);
	};
	/**
	* Handles pointer activation of a linked row.
	*
	* The row link is the navigation target, but the tree item remains the
	* roving-focus element. Clicking the expansion affordance is the exception:
	* it expands the branch and deliberately does not navigate.
	*/
	const handleItemLinkClick = (event, item) => {
		if (event.target.closest("[data-tree-toggle]")) {
			event.preventDefault();
			event.stopPropagation();
			focusItem(item.id);
			toggleExpanded(item);
			return;
		}
		if (item.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		focusItem(item.id);
		selectItem(item);
	};
	const renderItems = (nodes, depth = 0, parentId) => nodes.map((item, index) => {
		const itemChildren = getChildren(item);
		const itemHasChildren = hasChildren(item);
		const expanded = itemHasChildren && expandedSet.has(item.id);
		const disabled = Boolean(item.disabled);
		const active = Boolean(getItemActive?.(item));
		const selected = selectionMode !== "none" && selectedSet.has(item.id) && item.selectable !== false && !disabled;
		const loading = loadingSet.has(item.id);
		const focused = effectiveFocusedId === item.id;
		const itemState = {
			expanded,
			selected,
			focused,
			loading,
			disabled,
			hasChildren: itemHasChildren
		};
		const iconContent = renderIcon ? renderIcon(item, itemState) : item.icon;
		const itemId = `${generatedId}-item-${encodeURIComponent(item.id)}`;
		const selectable = selectionMode !== "none" && item.selectable !== false && !disabled;
		const hasLoadError = loadErrors.has(item.id);
		const rowContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [itemHasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-tree__toggle",
			"data-tree-toggle": "true",
			"data-expanded": expanded || void 0,
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-tree__toggle-spacer",
			"aria-hidden": "true"
		}), renderItem ? renderItem(item, itemState) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			iconContent != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-tree__icon",
				"aria-hidden": "true",
				children: iconContent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-tree__label",
				children: renderLabel ? renderLabel(item, itemState) : item.label
			}),
			item.endAdornment != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-tree__adornment",
				children: item.endAdornment
			})
		] })] });
		const row = item.href !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
			href: item.href,
			className: "puzzle-tree__row",
			tabIndex: -1,
			"aria-current": active ? "page" : void 0,
			"aria-disabled": disabled || void 0,
			"data-tree-row-link": "true",
			onClick: (event) => handleItemLinkClick(event, item),
			children: rowContent
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "puzzle-tree__row",
			children: rowContent
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			ref: (element) => {
				if (element) itemRefs.current.set(item.id, element);
				else itemRefs.current.delete(item.id);
			},
			id: itemId,
			role: "treeitem",
			"aria-level": depth + 1,
			"aria-posinset": index + 1,
			"aria-setsize": nodes.length,
			"aria-expanded": itemHasChildren ? expanded : void 0,
			"aria-selected": selectable ? selected : void 0,
			"aria-disabled": disabled || void 0,
			"aria-busy": loading || void 0,
			tabIndex: focused ? 0 : -1,
			className: cn$1("puzzle-tree__item", itemClassName),
			"data-tree-item-id": item.id,
			"data-active": active || void 0,
			"data-selected": selected || void 0,
			"data-disabled": disabled || void 0,
			"data-expanded": itemHasChildren ? expanded : void 0,
			onFocus: (event) => {
				if (event.target !== event.currentTarget) return;
				if (focusedId !== item.id) {
					setFocusedId(item.id);
					onFocusedChange?.(item.id);
				}
			},
			onClick: (event) => handleItemClick(event, item),
			onKeyDown: (event) => handleKeyDown(event, item, parentId),
			children: [row, itemHasChildren && expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "puzzle-tree__group",
				role: "group",
				children: [loading || hasLoadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					role: "none",
					className: cn$1("puzzle-tree__status-row", hasLoadError && !loading && "puzzle-tree__status-row--error"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						role: "status",
						"aria-live": "polite",
						children: loading ? loadingLabel : loadErrorLabel
					})
				}) : null, renderItems(itemChildren, depth + 1, item.id)]
			})]
		}, item.id);
	});
	const rootStyle = {
		...style,
		...indentation !== void 0 ? { "--puzzle-tree-indentation": typeof indentation === "number" ? `${indentation}px` : indentation } : {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		...rootProps,
		role: "tree",
		"aria-multiselectable": selectionMode === "multiple" || void 0,
		className: cn$1("puzzle-tree", `puzzle-tree--${size}`, className),
		style: rootStyle,
		dir,
		tabIndex: visibleItems.length === 0 ? 0 : void 0,
		onFocusCapture: () => {
			focusWithinTree.current = true;
		},
		onBlurCapture: (event) => {
			const nextTarget = event.relatedTarget;
			const target = event.target;
			if (event.currentTarget.contains(target) && (nextTarget && !event.currentTarget.contains(nextTarget) || !nextTarget && target.isConnected)) focusWithinTree.current = false;
		},
		children: renderItems(items)
	});
};
var findItemById = (nodes, id, getChildren) => {
	for (const item of nodes) {
		if (item.id === id) return item;
		const found = findItemById(getChildren(item), id, getChildren);
		if (found) return found;
	}
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
var setRef = (ref, value) => {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
};
var getEnabledMenuItems = (menu) => Array.from(menu.querySelectorAll("[data-puzzle-context-menu-item=\"true\"]")).filter((item) => item.getAttribute("aria-disabled") !== "true" && !("disabled" in item && Boolean(item.disabled)) && !item.hasAttribute("hidden") && !item.closest("[hidden], [inert], [aria-hidden='true']"));
var focusElement = (element) => {
	if (!element) return;
	try {
		element.focus({ preventScroll: true });
	} catch {
		element.focus();
	}
	element.scrollIntoView?.({ block: "nearest" });
};
var getMenuItemText = (item) => item.dataset.textValue ?? item.querySelector(".puzzle-context-menu__item-label")?.textContent ?? item.textContent ?? "";
var ContextMenuContext = (0, import_react.createContext)(null);
var RadioGroupContext = (0, import_react.createContext)(null);
var SubContext = (0, import_react.createContext)(null);
var useContextMenuContext = () => {
	const context = (0, import_react.useContext)(ContextMenuContext);
	if (!context) throw new Error("ContextMenu components must be rendered inside ContextMenu.");
	return context;
};
var useRadioGroupContext = () => {
	const context = (0, import_react.useContext)(RadioGroupContext);
	if (!context) throw new Error("ContextMenu.RadioItem must be rendered inside ContextMenu.RadioGroup.");
	return context;
};
var useSubContext = () => {
	const context = (0, import_react.useContext)(SubContext);
	if (!context) throw new Error("ContextMenu.SubTrigger and SubContent must be rendered inside ContextMenu.Sub.");
	return context;
};
var getMenuElements = (children) => import_react.Children.toArray(children).flatMap((child) => {
	if ((0, import_react.isValidElement)(child) && child.type === import_react.Fragment) return getMenuElements(child.props.children);
	return (0, import_react.isValidElement)(child) ? [child] : [];
});
var ContextMenuRoot = ({ children, open, defaultOpen = false, onOpenChange, disabled = false, triggerClassName, contentClassName }) => {
	const baseId = (0, import_react.useId)();
	const triggerId = `${baseId}-trigger`;
	const contentId = `${baseId}-content`;
	const childElements = getMenuElements(children);
	const triggers = childElements.filter((child) => child.type === ContextMenuTrigger);
	const contents = childElements.filter((child) => child.type === ContextMenuContent);
	const triggerElement = triggers[0];
	const contentElement = contents[0];
	if (triggers.length !== 1 || contents.length !== 1 || !triggerElement || !contentElement) throw new Error("ContextMenu requires exactly one ContextMenu.Trigger and one ContextMenu.Content.");
	const controlled = open !== void 0;
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(defaultOpen);
	const triggerDisabled = disabled || triggerElement.props.disabled === true;
	const isOpen = !triggerDisabled && (controlled ? open ?? false : internalOpen);
	const [point, setPoint] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const triggerRef = (0, import_react.useRef)(null);
	const focusPositionRef = (0, import_react.useRef)("first");
	const changeOpen = (0, import_react.useCallback)((nextOpen) => {
		if (triggerDisabled && nextOpen) return;
		if (nextOpen === isOpen) return;
		if (!controlled) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}, [
		controlled,
		isOpen,
		onOpenChange,
		triggerDisabled
	]);
	const openAt = (0, import_react.useCallback)((nextPoint, position = "first") => {
		if (triggerDisabled) return;
		setPoint({
			x: Math.max(0, nextPoint.x),
			y: Math.max(0, nextPoint.y)
		});
		focusPositionRef.current = position;
		changeOpen(true);
	}, [changeOpen, triggerDisabled]);
	const close = (0, import_react.useCallback)((restoreFocus = false) => {
		changeOpen(false);
		if (restoreFocus) focusElement(triggerRef.current ?? void 0);
	}, [changeOpen]);
	const context = (0, import_react.useMemo)(() => ({
		open: isOpen,
		disabled: triggerDisabled,
		triggerId,
		contentId,
		triggerRef,
		focusPositionRef,
		openAt,
		changeOpen,
		close
	}), [
		isOpen,
		triggerDisabled,
		triggerId,
		contentId,
		openAt,
		changeOpen,
		close
	]);
	const trigger = (0, import_react.cloneElement)(triggerElement, {
		id: triggerId,
		disabled: triggerDisabled,
		className: cn$1(triggerElement.props.className, triggerClassName)
	});
	const content = (0, import_react.cloneElement)(contentElement, {
		id: contentId,
		className: cn$1(contentElement.props.className, contentClassName)
	});
	const anchor = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: "puzzle-context-menu__anchor",
		style: {
			left: point.x,
			top: point.y
		},
		tabIndex: -1
	});
	(0, import_react.useEffect)(() => {
		if (!isOpen || !triggerRef.current) return;
		const ownerDocument = triggerRef.current.ownerDocument;
		const handleOutsidePointerDown = (event) => {
			const target = event.target;
			if (!(target instanceof ownerDocument.defaultView.Node)) return;
			if (triggerRef.current?.contains(target) || target instanceof Element && target.closest(".puzzle-context-menu__popover")) return;
			changeOpen(false);
		};
		ownerDocument.addEventListener("pointerdown", handleOutsidePointerDown, true);
		return () => {
			ownerDocument.removeEventListener("pointerdown", handleOutsidePointerDown, true);
		};
	}, [isOpen, changeOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ContextMenuContext.Provider, {
		value: context,
		children: [trigger, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
			trigger: anchor,
			open: isOpen,
			onOpenChange: (nextOpen) => {
				if (nextOpen) changeOpen(true);
				else close(true);
			},
			position: "bottom",
			align: "start",
			offset: 0,
			collisionPadding: 8,
			closeOnOutsideClick: false,
			closeOnEscape: true,
			contentClassName: "puzzle-context-menu__popover",
			children: content
		})]
	});
};
var ContextMenuTrigger = ({ children, asChild = false, disabled = false, id, className, ref, onContextMenu, onClick, onKeyDown, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, ...triggerProps }) => {
	const context = useContextMenuContext();
	const longPressTimerRef = (0, import_react.useRef)(null);
	const pointerStartRef = (0, import_react.useRef)(null);
	const isDisabled = disabled || context.disabled;
	const clearLongPress = (0, import_react.useCallback)(() => {
		if (longPressTimerRef.current !== null) {
			clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	}, []);
	(0, import_react.useEffect)(() => clearLongPress, [clearLongPress]);
	const handleRef = (0, import_react.useCallback)((node) => {
		context.triggerRef.current = node;
		setRef(ref, node);
	}, [context.triggerRef, ref]);
	const handleContextMenu = (event) => {
		onContextMenu?.(event);
		if (event.defaultPrevented || isDisabled) return;
		event.preventDefault();
		context.triggerRef.current = event.currentTarget;
		context.openAt({
			x: event.clientX,
			y: event.clientY
		});
	};
	const handleClick = (event) => {
		onClick?.(event);
		if (event.defaultPrevented || isDisabled || event.button !== 0) return;
		if (event.ctrlKey) {
			event.preventDefault();
			context.triggerRef.current = event.currentTarget;
			context.openAt({
				x: event.clientX,
				y: event.clientY
			});
			return;
		}
		if (context.open) context.close(false);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || isDisabled) return;
		const target = event.currentTarget;
		const rect = target.getBoundingClientRect();
		if (event.key === "ContextMenu" || event.shiftKey && event.key === "F10") {
			event.preventDefault();
			context.triggerRef.current = target;
			context.openAt({
				x: rect.left,
				y: rect.bottom
			});
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			context.triggerRef.current = target;
			context.openAt({
				x: rect.left,
				y: rect.bottom
			}, event.key === "ArrowUp" ? "last" : "first");
		}
	};
	const handlePointerDown = (event) => {
		onPointerDown?.(event);
		if (event.defaultPrevented || isDisabled || event.pointerType !== "touch") return;
		pointerStartRef.current = {
			x: event.clientX,
			y: event.clientY
		};
		const target = event.currentTarget;
		longPressTimerRef.current = setTimeout(() => {
			const rect = target.getBoundingClientRect();
			context.triggerRef.current = target;
			context.openAt({
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2
			});
		}, 550);
	};
	const handlePointerMove = (event) => {
		onPointerMove?.(event);
		const start = pointerStartRef.current;
		if (start && (Math.abs(event.clientX - start.x) > 10 || Math.abs(event.clientY - start.y) > 10)) {
			clearLongPress();
			pointerStartRef.current = null;
		}
	};
	const handlePointerEnd = (event, callback) => {
		callback?.(event);
		clearLongPress();
		pointerStartRef.current = null;
	};
	const commonProps = {
		...triggerProps,
		id,
		ref: handleRef,
		className: cn$1("puzzle-context-menu__trigger", className),
		role: "button",
		tabIndex: isDisabled ? -1 : triggerProps.tabIndex ?? 0,
		"aria-haspopup": "menu",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"aria-disabled": isDisabled || void 0,
		"data-state": context.open ? "open" : "closed",
		onContextMenu: handleContextMenu,
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: (event) => handlePointerEnd(event, onPointerUp),
		onPointerCancel: (event) => handlePointerEnd(event, onPointerCancel)
	};
	if (!asChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...commonProps,
		children
	});
	const child = import_react.Children.only(children);
	if (!(0, import_react.isValidElement)(child) || child.type === import_react.Fragment) throw new Error("ContextMenu.Trigger with asChild expects one non-Fragment element.");
	const childProps = child.props;
	const childDisabled = isDisabled || childProps.disabled === true || childProps["aria-disabled"] === true || childProps["aria-disabled"] === "true";
	return (0, import_react.cloneElement)(child, {
		...commonProps,
		ref: (node) => {
			handleRef(node);
			setRef(childProps.ref, node);
		},
		className: cn$1("puzzle-context-menu__trigger", childProps.className, className),
		role: child.type === "button" ? void 0 : "button",
		tabIndex: childDisabled ? -1 : childProps.tabIndex ?? 0,
		"aria-disabled": childDisabled || void 0,
		disabled: child.type === "button" ? childDisabled : void 0,
		onContextMenu: (event) => {
			if (childDisabled) {
				event.preventDefault();
				return;
			}
			childProps.onContextMenu?.(event);
			if (!event.defaultPrevented) handleContextMenu(event);
		},
		onClick: (event) => {
			if (childDisabled) return;
			childProps.onClick?.(event);
			if (!event.defaultPrevented) handleClick(event);
		},
		onKeyDown: (event) => {
			childProps.onKeyDown?.(event);
			if (!event.defaultPrevented) handleKeyDown(event);
		},
		onPointerDown: (event) => {
			childProps.onPointerDown?.(event);
			if (!event.defaultPrevented) handlePointerDown(event);
		},
		onPointerMove: (event) => {
			childProps.onPointerMove?.(event);
			if (!event.defaultPrevented) handlePointerMove(event);
		},
		onPointerUp: (event) => {
			childProps.onPointerUp?.(event);
			handlePointerEnd(event);
		},
		onPointerCancel: (event) => {
			childProps.onPointerCancel?.(event);
			handlePointerEnd(event);
		}
	});
};
var ContextMenuContent = ({ children, id, className, style, maxHeight = "min(24rem, calc(100dvh - 1rem))", onKeyDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...contentProps }) => {
	const context = useContextMenuContext();
	const positioned = usePopoutPositioned();
	const menuRef = (0, import_react.useRef)(null);
	const typeaheadRef = (0, import_react.useRef)("");
	const typeaheadTimerRef = (0, import_react.useRef)(null);
	const initialFocusDoneRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!context.open) {
			initialFocusDoneRef.current = false;
			typeaheadRef.current = "";
			if (typeaheadTimerRef.current !== null) {
				clearTimeout(typeaheadTimerRef.current);
				typeaheadTimerRef.current = null;
			}
		}
	}, [context.open]);
	(0, import_react.useEffect)(() => {
		if (!context.open || !positioned || initialFocusDoneRef.current) return;
		const menu = menuRef.current;
		if (!menu) return;
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
		if (event.key === "Escape") {
			event.preventDefault();
			context.close(true);
			return;
		}
		if (event.key === "Tab") {
			const ownerDocument = event.currentTarget.ownerDocument;
			const trigger = context.triggerRef.current;
			const selector = [
				"a[href]",
				"area[href]",
				"button:not([disabled])",
				"input:not([disabled]):not([type='hidden'])",
				"select:not([disabled])",
				"textarea:not([disabled])",
				"iframe",
				"summary",
				"[contenteditable='true']",
				"[tabindex]:not([tabindex='-1'])"
			].join(",");
			const tabbableElements = Array.from(ownerDocument.querySelectorAll(selector)).filter((element) => {
				if (menu.contains(element) || element.hidden || element.tabIndex < 0 || element.getAttribute("aria-disabled") === "true" || element.closest("[hidden], [inert], [aria-hidden='true']")) return false;
				const computedStyle = ownerDocument.defaultView?.getComputedStyle(element);
				return computedStyle?.display !== "none" && computedStyle?.visibility !== "hidden";
			});
			const triggerIndex = trigger ? tabbableElements.indexOf(trigger) : -1;
			const targetIndex = triggerIndex + (event.shiftKey ? -1 : 1);
			const target = triggerIndex >= 0 && tabbableElements.length > 0 ? tabbableElements[(targetIndex + tabbableElements.length) % tabbableElements.length] : void 0;
			context.close(false);
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
		if (event.key === "ArrowRight") {
			const activeItem = items[activeIndex];
			if (activeItem?.hasAttribute("data-puzzle-context-menu-sub-trigger")) {
				event.preventDefault();
				activeItem.click();
			}
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
		const nextIndex = findMenuItemIndexByText(items.map((item) => ({ text: getMenuItemText(item) })), query, activeIndex);
		focusIndex(items, nextIndex);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...contentProps,
		ref: menuRef,
		id: id ?? context.contentId,
		className: cn$1("puzzle-context-menu__content", className),
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
var ContextMenuItem = ({ children, className, disabled = false, "aria-disabled": ariaDisabled, textValue, closeOnSelect = true, variant = "default", onClick, onSelect, ...itemProps }) => {
	const context = useContextMenuContext();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...itemProps,
		type: "button",
		className: cn$1("puzzle-context-menu__item", variant === "danger" && "puzzle-context-menu__item--danger", className),
		role: "menuitem",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"data-puzzle-context-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__item-label",
			children
		})
	});
};
var ContextMenuGroup = ({ children, className, "aria-label": ariaLabel, ...groupProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...groupProps,
	className: cn$1("puzzle-context-menu__group", className),
	role: "group",
	"aria-label": ariaLabel,
	children
});
var ContextMenuLabel = ({ children, className, ...labelProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...labelProps,
	className: cn$1("puzzle-context-menu__label", className),
	children
});
var ContextMenuSeparator = ({ className, ...separatorProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...separatorProps,
	className: cn$1("puzzle-context-menu__separator", className),
	role: "separator",
	"aria-orientation": "horizontal"
});
var ContextMenuCheckboxItem = ({ children, checked, defaultChecked = false, onCheckedChange, closeOnSelect = false, textValue, className, disabled = false, "aria-disabled": ariaDisabled, onClick, onSelect, ...itemProps }) => {
	const context = useContextMenuContext();
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
		className: cn$1("puzzle-context-menu__item", className),
		role: "menuitemcheckbox",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"aria-checked": resolvedChecked === "indeterminate" ? "mixed" : resolvedChecked,
		"data-state": resolvedChecked === "indeterminate" ? "indeterminate" : resolvedChecked ? "checked" : "unchecked",
		"data-puzzle-context-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__indicator",
			"aria-hidden": "true",
			children: resolvedChecked === "indeterminate" ? "−" : resolvedChecked ? "✓" : ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__item-label",
			children
		})]
	});
};
var ContextMenuRadioGroup = ({ children, value, defaultValue, onValueChange, className, ...groupProps }) => {
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
			className: cn$1("puzzle-context-menu__group", className),
			role: "group",
			children
		})
	});
};
var ContextMenuRadioItem = ({ children, value, closeOnSelect = true, textValue, className, disabled = false, "aria-disabled": ariaDisabled, onClick, onSelect, ...itemProps }) => {
	const context = useContextMenuContext();
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
		className: cn$1("puzzle-context-menu__item", className),
		role: "menuitemradio",
		tabIndex: -1,
		disabled: itemDisabled,
		"aria-disabled": itemDisabled || void 0,
		"aria-checked": checked,
		"data-state": checked ? "checked" : "unchecked",
		"data-puzzle-context-menu-item": "true",
		"data-text-value": textValue,
		onClick: handleClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__indicator",
			"aria-hidden": "true",
			children: checked ? "●" : ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__item-label",
			children
		})]
	});
};
var ContextMenuSub = ({ children, defaultOpen = false }) => {
	const rootContext = useContextMenuContext();
	const baseId = (0, import_react.useId)();
	const triggerId = `${baseId}-trigger`;
	const contentId = `${baseId}-content`;
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	const triggerRef = (0, import_react.useRef)(null);
	const elements = getMenuElements(children);
	const triggers = elements.filter((child) => child.type === ContextMenuSubTrigger);
	const contents = elements.filter((child) => child.type === ContextMenuSubContent);
	const triggerElement = triggers[0];
	const contentElement = contents[0];
	if (triggers.length !== 1 || contents.length !== 1 || !triggerElement || !contentElement) throw new Error("ContextMenu.Sub requires exactly one SubTrigger and one SubContent.");
	(0, import_react.useEffect)(() => {
		if (!rootContext.open) setOpen(false);
	}, [rootContext.open]);
	const close = (0, import_react.useCallback)((restoreFocus = false) => {
		setOpen(false);
		if (restoreFocus) focusElement(triggerRef.current ?? void 0);
	}, []);
	const subContext = (0, import_react.useMemo)(() => ({
		open,
		setOpen,
		triggerId,
		contentId,
		triggerRef,
		close
	}), [
		open,
		triggerId,
		contentId,
		close
	]);
	const trigger = (0, import_react.cloneElement)(triggerElement, { id: triggerId });
	const content = (0, import_react.cloneElement)(contentElement, { id: contentId });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContext.Provider, {
		value: subContext,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popout, {
			trigger,
			open,
			onOpenChange: setOpen,
			position: "right",
			align: "start",
			offset: 4,
			collisionPadding: 8,
			action: "hover",
			closeOnOutsideClick: true,
			closeOnEscape: true,
			contentClassName: "puzzle-context-menu__popover puzzle-context-menu__submenu-popover",
			children: content
		})
	});
};
var ContextMenuSubTrigger = (0, import_react.forwardRef)(({ children, className, disabled = false, onClick, onKeyDown, ...props }, ref) => {
	const context = useSubContext();
	const handleClick = (event) => {
		onClick?.(event);
		if (!event.defaultPrevented && !disabled) context.setOpen(true);
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (!event.defaultPrevented && !disabled && event.key === "ArrowRight") {
			event.preventDefault();
			context.setOpen(true);
		}
		if (!event.defaultPrevented && !disabled && event.key === "ArrowLeft") {
			event.preventDefault();
			context.close(true);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		...props,
		ref: (node) => {
			context.triggerRef.current = node;
			setRef(ref, node);
		},
		id: context.triggerId,
		type: "button",
		role: "menuitem",
		tabIndex: -1,
		className: cn$1("puzzle-context-menu__item", className),
		"aria-haspopup": "menu",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"aria-disabled": disabled || void 0,
		disabled,
		"data-puzzle-context-menu-item": "true",
		"data-puzzle-context-menu-sub-trigger": "true",
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		onPointerEnter: () => {
			if (!disabled) context.setOpen(true);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__item-label",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-context-menu__submenu-indicator",
			"aria-hidden": "true",
			children: "›"
		})]
	});
});
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";
var ContextMenuSubContent = ({ children, id, className, style, maxHeight = "min(24rem, calc(100dvh - 1rem))", onKeyDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...contentProps }) => {
	const context = useSubContext();
	const positioned = usePopoutPositioned();
	const menuRef = (0, import_react.useRef)(null);
	const typeaheadRef = (0, import_react.useRef)("");
	const typeaheadTimerRef = (0, import_react.useRef)(null);
	const initialFocusDoneRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!context.open) {
			initialFocusDoneRef.current = false;
			typeaheadRef.current = "";
			if (typeaheadTimerRef.current !== null) {
				clearTimeout(typeaheadTimerRef.current);
				typeaheadTimerRef.current = null;
			}
		}
	}, [context.open]);
	(0, import_react.useEffect)(() => () => {
		if (typeaheadTimerRef.current !== null) clearTimeout(typeaheadTimerRef.current);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!context.open || !positioned || initialFocusDoneRef.current) return;
		const menu = menuRef.current;
		if (!menu) return;
		initialFocusDoneRef.current = true;
		focusElement(getEnabledMenuItems(menu)[0] ?? menu);
	}, [context.open, positioned]);
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.defaultPrevented) return;
		event.stopPropagation();
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			context.close(true);
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			context.close(true);
			return;
		}
		const menu = menuRef.current;
		if (!menu) return;
		const items = getEnabledMenuItems(menu);
		const activeIndex = items.indexOf(menu.ownerDocument.activeElement);
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const direction = event.key === "ArrowDown" ? 1 : -1;
			const startIndex = activeIndex < 0 ? direction === 1 ? -1 : 0 : activeIndex;
			const nextIndex = findNextMenuItemIndex(items.map(() => ({ disabled: false })), startIndex, direction);
			if (nextIndex >= 0) focusElement(items[nextIndex]);
			return;
		}
		if (event.key === "Home" || event.key === "End") {
			event.preventDefault();
			const target = event.key === "Home" ? items[0] : items[items.length - 1];
			if (target) focusElement(target);
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
		const nextIndex = findMenuItemIndexByText(items.map((item) => ({ text: getMenuItemText(item) })), query, activeIndex);
		if (nextIndex >= 0) focusElement(items[nextIndex]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...contentProps,
		ref: menuRef,
		id: id ?? context.contentId,
		className: cn$1("puzzle-context-menu__content", className),
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
var ContextMenuSubCompound = Object.assign(ContextMenuSub, {
	Trigger: ContextMenuSubTrigger,
	Content: ContextMenuSubContent
});
var ContextMenu = Object.assign(ContextMenuRoot, {
	Trigger: ContextMenuTrigger,
	Content: ContextMenuContent,
	Item: ContextMenuItem,
	Group: ContextMenuGroup,
	Label: ContextMenuLabel,
	Separator: ContextMenuSeparator,
	CheckboxItem: ContextMenuCheckboxItem,
	RadioGroup: ContextMenuRadioGroup,
	RadioItem: ContextMenuRadioItem,
	Sub: ContextMenuSubCompound,
	SubTrigger: ContextMenuSubTrigger,
	SubContent: ContextMenuSubContent
});
var TOKEN_PATTERN = new RegExp([
	"(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
	"(?<string>\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
	`(?<keyword>\\b(?:${[
		"as",
		"async",
		"await",
		"break",
		"case",
		"class",
		"const",
		"continue",
		"default",
		"else",
		"enum",
		"export",
		"extends",
		"false",
		"finally",
		"for",
		"from",
		"function",
		"if",
		"implements",
		"import",
		"in",
		"interface",
		"let",
		"new",
		"null",
		"of",
		"return",
		"switch",
		"this",
		"throw",
		"true",
		"try",
		"type",
		"typeof",
		"undefined",
		"var",
		"void",
		"while"
	].join("|")})\\b)`,
	"(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
	"(?<type>\\b[A-Z][A-Za-z0-9_]*\\b)"
].join("|"), "g");
var TOKEN_TYPES = [
	"comment",
	"string",
	"keyword",
	"number",
	"type"
];
/**
* Splits TypeScript/TSX source into plain text and highlighted spans.
* This is a lightweight lexical pass, not a parser.
*/
var highlightCode = (code) => {
	const nodes = [];
	let lastIndex = 0;
	for (const match of code.matchAll(TOKEN_PATTERN)) {
		const type = TOKEN_TYPES.find((name) => match.groups?.[name] !== void 0);
		if (!type) continue;
		if (match.index > lastIndex) nodes.push(code.slice(lastIndex, match.index));
		nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `puzzle-preview__token--${type}`,
			children: match[0]
		}, match.index));
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
	return nodes;
};
var PREVIEW_DEVICES = {
	mobile: {
		label: "Mobile",
		width: 390,
		height: 844
	},
	tablet: {
		label: "Tablet",
		width: 768,
		height: 1024
	},
	desktop: {
		label: "Desktop",
		width: 1024,
		height: 768
	}
};
var PREVIEW_DEVICE_ITEMS = Object.keys(PREVIEW_DEVICES).map((id) => ({ id }));
var ALIGN_VALUES = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch"
};
var JUSTIFY_VALUES = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	between: "space-between",
	around: "space-around",
	evenly: "space-evenly"
};
var createPreviewDocument = (rootId) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="${rootId}"></div>
  </body>
</html>`;
var useIsomorphicLayoutEffect = typeof window === "undefined" ? import_react.useEffect : import_react.useLayoutEffect;
var PreviewBackground = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {
	pattern: "blueprint",
	size: 20,
	majorSize: 100,
	lineWidth: 1,
	patternOpacity: .25,
	...props
});
var Preview = ({ children, className, defaultDevice = "mobile", code, height, align, justify, hideDevices = false }) => {
	const generatedId = (0, import_react.useId)();
	const frameRootId = `${generatedId}-root`;
	const previewTabId = `${generatedId}-tab-preview`;
	const codeTabId = `${generatedId}-tab-code`;
	const panelId = `${generatedId}-panel`;
	const themeScope = useThemeScope();
	const [device, setDevice] = (0, import_react.useState)(defaultDevice);
	const [activeTab, setActiveTab] = (0, import_react.useState)("preview");
	const [frameRoot, setFrameRoot] = (0, import_react.useState)(null);
	const [scale, setScale] = (0, import_react.useState)(1);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const iframeRef = (0, import_react.useRef)(null);
	const copyTimeoutRef = (0, import_react.useRef)(null);
	const config = PREVIEW_DEVICES[device];
	const frameHeight = height ?? config.height;
	const hasCode = code !== void 0;
	const [direction, setDirection] = (0, import_react.useState)("ltr");
	const sectionRef = (0, import_react.useRef)(null);
	const isKeyboardNavigation = (0, import_react.useRef)(false);
	(0, import_react.useLayoutEffect)(() => {
		const section = sectionRef.current;
		if (section) {
			const isRtl = getComputedStyle(section).direction === "rtl" || section.closest("[dir]")?.getAttribute("dir")?.toLowerCase() === "rtl";
			setDirection(isRtl ? "rtl" : "ltr");
		}
	}, []);
	const rovingFocus = useRovingFocus({
		items: hasCode ? [{ id: "preview" }, { id: "code" }] : [{ id: "preview" }],
		dir: direction,
		initialActiveId: activeTab
	});
	const deviceFocus = useRovingFocus({
		items: PREVIEW_DEVICE_ITEMS,
		dir: direction,
		initialActiveId: device
	});
	const handleTabKeyDown = (event, tab) => {
		isKeyboardNavigation.current = true;
		try {
			rovingFocus.onItemKeyDown(event, tab);
		} finally {
			isKeyboardNavigation.current = false;
		}
	};
	const handleTabFocus = (tab) => {
		rovingFocus.onItemFocus(tab);
		if (isKeyboardNavigation.current) setActiveTab(tab);
	};
	const syncStyles = (0, import_react.useCallback)(() => {
		const frameDocument = iframeRef.current?.contentDocument;
		if (!frameDocument) return;
		const frameHead = frameDocument.head;
		frameHead.querySelectorAll("[data-puzzle-preview-style]").forEach((element) => element.remove());
		document.querySelectorAll([
			"head link[rel='stylesheet']",
			"head style",
			"style[data-puzzle-theme]",
			"style[data-puzzle-theme-scope-style]"
		].join(", ")).forEach((element) => {
			const clone = element.cloneNode(true);
			clone.setAttribute("data-puzzle-preview-style", "");
			frameHead.appendChild(clone);
		});
		const sourceRoot = document.documentElement;
		const targetRoot = frameDocument.documentElement;
		targetRoot.style.cssText = sourceRoot.style.cssText;
		targetRoot.className = sourceRoot.className;
		Array.from(sourceRoot.attributes).forEach((attribute) => {
			if (attribute.name === "style" || attribute.name === "class") return;
			targetRoot.setAttribute(attribute.name, attribute.value);
		});
		const body = frameDocument.body;
		body.className = document.body.className;
		body.style.cssText = document.body.style.cssText;
		targetRoot.style.setProperty("box-sizing", "border-box", "important");
		targetRoot.style.setProperty("width", "100%", "important");
		targetRoot.style.setProperty("height", "100%", "important");
		targetRoot.style.setProperty("min-height", "100%", "important");
		targetRoot.style.setProperty("margin", "0", "important");
		targetRoot.style.setProperty("overflow-x", "hidden", "important");
		targetRoot.style.setProperty("overflow-y", "auto", "important");
		targetRoot.style.setProperty("scrollbar-width", "none", "important");
		targetRoot.style.setProperty("-ms-overflow-style", "none", "important");
		body.style.setProperty("display", "block", "important");
		body.style.setProperty("position", "static", "important");
		body.style.setProperty("box-sizing", "border-box", "important");
		body.style.setProperty("width", "100%", "important");
		body.style.setProperty("height", "auto", "important");
		body.style.setProperty("min-height", "100%", "important");
		body.style.setProperty("margin", "0", "important");
		body.style.setProperty("overflow", "visible", "important");
		frameDocument.getElementById(frameRootId)?.style.removeProperty("min-height");
		const scrollbarStyle = frameDocument.createElement("style");
		scrollbarStyle.setAttribute("data-puzzle-preview-style", "");
		scrollbarStyle.textContent = `
      html,
      body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
		frameHead.appendChild(scrollbarStyle);
	}, [frameRootId]);
	const updateScale = (0, import_react.useCallback)((availableWidth) => {
		const nextScale = Math.min(1, Math.max(0, availableWidth) / config.width);
		setScale((current) => Math.abs(current - nextScale) < .001 ? current : nextScale);
	}, [config.width]);
	useIsomorphicLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const measure = () => {
			const styles = window.getComputedStyle(container);
			const horizontalPadding = (Number.parseFloat(styles.paddingLeft) || 0) + (Number.parseFloat(styles.paddingRight) || 0);
			updateScale(container.clientWidth - horizontalPadding);
		};
		measure();
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) updateScale(entry.contentRect.width);
		});
		observer.observe(container);
		return () => observer.disconnect();
	}, [updateScale]);
	(0, import_react.useEffect)(() => {
		const isStyleNode = (node) => node instanceof Element && (node.matches("style, link[rel='stylesheet']") || node.querySelector("style, link[rel='stylesheet']") !== null);
		const headObserver = new MutationObserver(syncStyles);
		headObserver.observe(document.head, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true
		});
		const bodyObserver = new MutationObserver((mutations) => {
			if (mutations.some((mutation) => {
				return (mutation.target instanceof Element ? mutation.target : mutation.target.parentElement)?.closest("style[data-puzzle-theme], style[data-puzzle-theme-scope-style]") != null || Array.from(mutation.addedNodes).some(isStyleNode) || Array.from(mutation.removedNodes).some(isStyleNode);
			})) syncStyles();
		});
		bodyObserver.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["data-theme"]
		});
		return () => {
			headObserver.disconnect();
			bodyObserver.disconnect();
		};
	}, [syncStyles]);
	const initializeFrame = (0, import_react.useCallback)(() => {
		const root = (iframeRef.current?.contentDocument)?.getElementById(frameRootId);
		if (!root) return;
		syncStyles();
		setFrameRoot(root);
	}, [frameRootId, syncStyles]);
	(0, import_react.useEffect)(() => {
		initializeFrame();
	}, [initializeFrame]);
	const handleCopyCode = (0, import_react.useCallback)(async () => {
		if (code === void 0) return;
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => {
				setCopied(false);
			}, 2e3);
		} catch {
			setCopied(false);
		}
	}, [code]);
	(0, import_react.useEffect)(() => () => {
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hasCode && activeTab === "code") setActiveTab("preview");
	}, [activeTab, hasCode]);
	const frameStyle = {
		width: config.width,
		height: frameHeight,
		transform: `scale(${scale})`,
		transformOrigin: "top left"
	};
	const contentStyle = {
		display: "flex",
		boxSizing: "border-box",
		minHeight: "100vh",
		alignItems: align ? ALIGN_VALUES[align] : void 0,
		justifyContent: justify ? JUSTIFY_VALUES[justify] : void 0
	};
	const viewportStyle = {
		width: config.width * scale,
		aspectRatio: `${config.width} / ${frameHeight}`
	};
	const panelProps = {
		id: panelId,
		role: "tabpanel",
		"aria-labelledby": activeTab === "preview" ? previewTabId : codeTabId
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: sectionRef,
		className: cn$1("puzzle-preview", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "puzzle-preview__toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "puzzle-preview__tabs",
					role: "tablist",
					"aria-label": "Preview view",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						id: previewTabId,
						ref: rovingFocus.getItemRef("preview"),
						tabIndex: activeTab === "preview" ? 0 : -1,
						onFocus: () => handleTabFocus("preview"),
						onKeyDown: (event) => handleTabKeyDown(event, "preview"),
						"aria-selected": activeTab === "preview",
						"aria-controls": panelId,
						className: cn$1("puzzle-preview__tab", activeTab === "preview" && "puzzle-preview__tab--active"),
						onClick: () => setActiveTab("preview"),
						children: "Preview"
					}), hasCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						id: codeTabId,
						ref: rovingFocus.getItemRef("code"),
						tabIndex: activeTab === "code" ? 0 : -1,
						onFocus: () => handleTabFocus("code"),
						onKeyDown: (event) => handleTabKeyDown(event, "code"),
						"aria-selected": activeTab === "code",
						"aria-controls": panelId,
						className: cn$1("puzzle-preview__tab", activeTab === "code" && "puzzle-preview__tab--active"),
						onClick: () => setActiveTab("code"),
						children: "Code"
					})]
				}), activeTab === "preview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "puzzle-preview__toolbar-actions",
					children: [!hideDevices && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-preview__devices",
						role: "group",
						"aria-label": "Device size",
						children: Object.keys(PREVIEW_DEVICES).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							ref: deviceFocus.getItemRef(item),
							type: "button",
							className: cn$1("puzzle-preview__device", device === item && "puzzle-preview__device--active"),
							"aria-pressed": device === item,
							tabIndex: deviceFocus.getItemTabIndex(item),
							onFocus: () => deviceFocus.onItemFocus(item),
							onKeyDown: (event) => deviceFocus.onItemKeyDown(event, item),
							onClick: () => setDevice(item),
							children: PREVIEW_DEVICES[item].label
						}, item))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "puzzle-preview__dimensions",
						children: [
							config.width,
							" × ",
							frameHeight
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "puzzle-preview__copy",
					onClick: handleCopyCode,
					"aria-label": copied ? "Code copied" : "Copy code",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
						name: copied ? "tabler:check" : "tabler:copy",
						size: 16,
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy code" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PreviewBackground, {
				...panelProps,
				className: "puzzle-preview__panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: containerRef,
					className: "puzzle-preview__stage",
					hidden: activeTab !== "preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "puzzle-preview__viewport",
						style: viewportStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							ref: iframeRef,
							className: "puzzle-preview__frame",
							srcDoc: createPreviewDocument(frameRootId),
							title: `${config.label} component preview`,
							onLoad: initializeFrame,
							style: frameStyle
						}), frameRoot && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeScopeProvider, {
							scopeId: themeScope?.scopeId ?? null,
							theme: themeScope?.theme ?? "system",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: contentStyle,
								children
							})
						}), frameRoot)]
					})
				}), activeTab === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-preview__code",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "language-tsx",
						children: code === void 0 ? null : highlightCode(code)
					}) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-preview__copy-status",
				role: "status",
				"aria-live": "polite",
				children: copied ? "Code copied to clipboard." : ""
			})
		]
	});
};
var src_exports$1 = /* @__PURE__ */ __exportAll$1({
	Accordion: () => Accordion,
	Alert: () => Alert,
	AppBar: () => AppBar,
	AspectRatio: () => AspectRatio,
	Autocomplete: () => Autocomplete,
	Avatar: () => Avatar,
	Backdrop: () => Backdrop,
	Background: () => Background,
	Badge: () => Badge,
	BottomNavigation: () => BottomNavigation,
	BottomNavigationItem: () => BottomNavigationItem,
	Breadcrumbs: () => Breadcrumbs,
	Button: () => Button,
	ButtonGroup: () => ButtonGroup,
	Card: () => Card$1,
	CardAction: () => CardAction,
	CardContent: () => CardContent,
	CardDescription: () => CardDescription,
	CardFooter: () => CardFooter,
	CardHeader: () => CardHeader,
	CardMedia: () => CardMedia,
	CardTitle: () => CardTitle,
	Carousel: () => Carousel,
	CarouselController: () => CarouselController,
	Checkbox: () => Checkbox,
	CircularProgress: () => CircularProgress,
	CollapsableSidebar: () => CollapsableSidebar,
	ColorPicker: () => ColorPicker,
	Command: () => Command,
	CommandDialog: () => CommandDialog,
	Container: () => Container$2,
	ContextMenu: () => ContextMenu,
	ContextMenuCheckboxItem: () => ContextMenuCheckboxItem,
	ContextMenuContent: () => ContextMenuContent,
	ContextMenuGroup: () => ContextMenuGroup,
	ContextMenuItem: () => ContextMenuItem,
	ContextMenuLabel: () => ContextMenuLabel,
	ContextMenuRadioGroup: () => ContextMenuRadioGroup,
	ContextMenuRadioItem: () => ContextMenuRadioItem,
	ContextMenuSeparator: () => ContextMenuSeparator,
	ContextMenuSub: () => ContextMenuSubCompound,
	ContextMenuSubContent: () => ContextMenuSubContent,
	ContextMenuSubTrigger: () => ContextMenuSubTrigger,
	ContextMenuTrigger: () => ContextMenuTrigger,
	DatePicker: () => DatePicker,
	Dialog: () => Dialog,
	Drawer: () => Drawer,
	DropdownMenu: () => CompoundDropdownMenu,
	DropdownMenuCheckboxItem: () => DropdownMenuCheckboxItem,
	DropdownMenuContent: () => DropdownMenuContent,
	DropdownMenuGroup: () => DropdownMenuGroup,
	DropdownMenuItem: () => DropdownMenuItem,
	DropdownMenuLabel: () => DropdownMenuLabel,
	DropdownMenuRadioGroup: () => DropdownMenuRadioGroup,
	DropdownMenuRadioItem: () => DropdownMenuRadioItem,
	DropdownMenuSeparator: () => DropdownMenuSeparator,
	DropdownMenuTrigger: () => DropdownMenuTrigger,
	EmptyState: () => EmptyState,
	EmptyStateContent: () => EmptyStateContent,
	EmptyStateDescription: () => EmptyStateDescription,
	EmptyStateHeader: () => EmptyStateHeader,
	EmptyStateMedia: () => EmptyStateMedia,
	EmptyStateTitle: () => EmptyStateTitle,
	FileUpload: () => FileUpload,
	FormField: () => FormField,
	Heading: () => Heading$1,
	Image: () => Image,
	InputGroup: () => InputGroup,
	Label: () => Label,
	LinearProgress: () => LinearProgress,
	Link: () => Link$1,
	Notification: () => Notification,
	NotificationProvider: () => NotificationProvider,
	NotificationViewport: () => NotificationViewport,
	NumberInput: () => NumberInput,
	PageLayout: () => PageLayout,
	Pagination: () => Pagination,
	Paper: () => Paper,
	Popout: () => Popout,
	Popover: () => Popover$2,
	Portal: () => Portal$1,
	PortalTarget: () => PortalTarget,
	Preview: () => Preview,
	Radio: () => Radio,
	RadioGroup: () => RadioGroup,
	Rating: () => Rating,
	ResizableHandle: () => ResizableHandle,
	ResizablePanel: () => ResizablePanel,
	ResizablePanels: () => ResizablePanels,
	ScrollArea: () => ScrollArea$1,
	ScrollLock: () => ScrollLock,
	Section: () => Section,
	SectionStack: () => SectionStack,
	Select: () => Select,
	Separator: () => Separator,
	Sidebar: () => Sidebar$2,
	Skeleton: () => Skeleton,
	Slider: () => Slider,
	Stack: () => Stack,
	Stepper: () => Stepper,
	Switch: () => Switch,
	Tabs: () => Tabs$3,
	TabsTab: () => TabsTab,
	Text: () => Text,
	TextAreaInput: () => TextAreaInput,
	TextEditor: () => TextEditor,
	TextEditorToolbar: () => TextEditorToolbar,
	TextInput: () => TextInput,
	TextRenderer: () => TextRenderer,
	TimePicker: () => TimePicker,
	ToggleGroup: () => ToggleGroup,
	TokenInput: () => TokenInput,
	Tooltip: () => Tooltip,
	Transition: () => Transition,
	TreeView: () => TreeView,
	useCarouselContext: () => useCarouselContext,
	useNotification: () => useNotification
});
function normalize(urlOrPath) {
	if (urlOrPath.length > 1 && urlOrPath.endsWith("/")) return urlOrPath.slice(0, -1);
	return urlOrPath;
}
/**
* @returns if `href` is matching the given pathname
*/
function isActive(href, pathname, nested = false) {
	href = normalize(href);
	pathname = normalize(pathname);
	return href === pathname || nested && pathname.startsWith(`${href}/`);
}
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp$2(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$3 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp$2(minPadding, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement": resetPlacement = initialPlacement;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp$2(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			var _rawOffset$mainAxis, _rawOffset$crossAxis;
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
				crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
				else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) {
		if (offsetParent) {
			if (isElement(offsetParent)) scale = getScale(offsetParent);
		} else scale = getScale(element);
	}
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove, ancestorResize) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	const win = getWindow(element);
	const handleResize = () => refresh(ancestorResize);
	win.addEventListener("resize", handleResize);
	refresh(true);
	return () => {
		win.removeEventListener("resize", handleResize);
		cleanup();
	};
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update);
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$2 = offset$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$2 = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$2 = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$2 = size$1;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$2 = hide$1;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$2 = arrow$3;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$2 = limitShift$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
var index = typeof document !== "undefined" ? import_react.useLayoutEffect : function noop() {};
function deepEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && a.toString() === b.toString()) return true;
	let length;
	let i;
	let keys;
	if (a && b && typeof a === "object") {
		if (Array.isArray(a)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key === "_owner" && a.$$typeof) continue;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
	const ref = import_react.useRef(value);
	index(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Provides data to position a floating element.
* @see https://floating-ui.com/docs/useFloating
*/
function useFloating(options) {
	if (options === void 0) options = {};
	const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
	const [data, setData] = import_react.useState({
		x: 0,
		y: 0,
		strategy,
		placement,
		middlewareData: {},
		isPositioned: false
	});
	const [latestMiddleware, setLatestMiddleware] = import_react.useState(middleware);
	if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
	const [_reference, _setReference] = import_react.useState(null);
	const [_floating, _setFloating] = import_react.useState(null);
	const setReference = import_react.useCallback((node) => {
		if (node !== referenceRef.current) {
			referenceRef.current = node;
			_setReference(node);
		}
	}, []);
	const setFloating = import_react.useCallback((node) => {
		if (node !== floatingRef.current) {
			floatingRef.current = node;
			_setFloating(node);
		}
	}, []);
	const referenceEl = externalReference || _reference;
	const floatingEl = externalFloating || _floating;
	const referenceRef = import_react.useRef(null);
	const floatingRef = import_react.useRef(null);
	const dataRef = import_react.useRef(data);
	const hasWhileElementsMounted = whileElementsMounted != null;
	const whileElementsMountedRef = useLatestRef(whileElementsMounted);
	const platformRef = useLatestRef(platform);
	const openRef = useLatestRef(open);
	const update = import_react.useCallback(() => {
		if (!referenceRef.current || !floatingRef.current) return;
		const config = {
			placement,
			strategy,
			middleware: latestMiddleware
		};
		if (platformRef.current) config.platform = platformRef.current;
		computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
			const fullData = {
				...data,
				isPositioned: openRef.current !== false
			};
			if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
				dataRef.current = fullData;
				import_react_dom.flushSync(() => {
					setData(fullData);
				});
			}
		});
	}, [
		latestMiddleware,
		placement,
		strategy,
		platformRef,
		openRef
	]);
	index(() => {
		if (open === false && dataRef.current.isPositioned) {
			dataRef.current.isPositioned = false;
			setData((data) => ({
				...data,
				isPositioned: false
			}));
		}
	}, [open]);
	const isMountedRef = import_react.useRef(false);
	index(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	index(() => {
		if (referenceEl) referenceRef.current = referenceEl;
		if (floatingEl) floatingRef.current = floatingEl;
		if (referenceEl && floatingEl) {
			if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
			update();
		}
	}, [
		referenceEl,
		floatingEl,
		update,
		whileElementsMountedRef,
		hasWhileElementsMounted
	]);
	const refs = import_react.useMemo(() => ({
		reference: referenceRef,
		floating: floatingRef,
		setReference,
		setFloating
	}), [setReference, setFloating]);
	const elements = import_react.useMemo(() => ({
		reference: referenceEl,
		floating: floatingEl
	}), [referenceEl, floatingEl]);
	const floatingStyles = import_react.useMemo(() => {
		const initialStyles = {
			position: strategy,
			left: 0,
			top: 0
		};
		if (!elements.floating) return initialStyles;
		const x = roundByDPR(elements.floating, data.x);
		const y = roundByDPR(elements.floating, data.y);
		if (transform) return {
			...initialStyles,
			transform: "translate(" + x + "px, " + y + "px)",
			...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: x,
			top: y
		};
	}, [
		strategy,
		transform,
		elements.floating,
		data.x,
		data.y
	]);
	return import_react.useMemo(() => ({
		...data,
		update,
		refs,
		elements,
		floatingStyles
	}), [
		data,
		update,
		refs,
		elements,
		floatingStyles
	]);
}
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = (options) => {
	function isRef(value) {
		return {}.hasOwnProperty.call(value, "current");
	}
	return {
		name: "arrow",
		options,
		fn(state) {
			const { element, padding } = typeof options === "function" ? options(state) : options;
			if (element && isRef(element)) {
				if (element.current != null) return arrow$2({
					element: element.current,
					padding
				}).fn(state);
				return {};
			}
			if (element) return arrow$2({
				element,
				padding
			}).fn(state);
			return {};
		}
	};
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = (options, deps) => {
	const result = offset$2(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = (options, deps) => {
	const result = shift$2(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = (options, deps) => {
	return {
		fn: limitShift$2(options).fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = (options, deps) => {
	const result = flip$2(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = (options, deps) => {
	const result = size$2(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = (options, deps) => {
	const result = hide$2(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow = (options, deps) => {
	const result = arrow$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
var __defProp$12 = Object.defineProperty;
var __name$11 = (target, value) => __defProp$12(target, "name", {
	value,
	configurable: true
});
function useSize(element) {
	const [size, setSize] = import_react.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			let rAF = 0;
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				window.cancelAnimationFrame(rAF);
				rAF = window.requestAnimationFrame(() => {
					let width;
					let height;
					if ("borderBoxSize" in entry) {
						const borderSizeEntry = entry["borderBoxSize"];
						const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
						width = borderSize["inlineSize"];
						height = borderSize["blockSize"];
					} else {
						width = element.offsetWidth;
						height = element.offsetHeight;
					}
					setSize({
						width,
						height
					});
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => {
				window.cancelAnimationFrame(rAF);
				resizeObserver.unobserve(element);
			};
		} else setSize(void 0);
	}, [element]);
	return size;
}
__name$11(useSize, "useSize");
var __defProp$11 = Object.defineProperty;
var __name$10 = (target, value) => __defProp$11(target, "name", {
	value,
	configurable: true
});
var Sticky = {
	Partial: "partial",
	Always: "always"
};
var UpdatePositionStrategy = {
	Optimized: "optimized",
	Always: "always"
};
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = /* @__PURE__ */ __name$10((props) => {
	const { __scopePopper, children } = props;
	const [anchor, setAnchor] = import_react.useState(null);
	const [placementState, setPlacementState] = import_react.useState(void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperProvider, {
		scope: __scopePopper,
		anchor,
		onAnchorChange: setAnchor,
		placementState,
		setPlacementState,
		children
	});
}, "Popper");
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$10(function PopperAnchor2(props, forwardedRef) {
	const { __scopePopper, virtualRef, ...anchorProps } = props;
	const context = usePopperContext(ANCHOR_NAME, __scopePopper);
	const ref = import_react.useRef(null);
	const onAnchorChange = context.onAnchorChange;
	const callbackRef = import_react.useCallback((node) => {
		ref.current = node;
		if (node) onAnchorChange(node);
	}, [onAnchorChange]);
	const composedRefs = useComposedRefs(forwardedRef, callbackRef);
	const anchorRef = import_react.useRef(null);
	import_react.useEffect(() => {
		if (!virtualRef) return;
		const previousAnchor = anchorRef.current;
		anchorRef.current = virtualRef.current;
		if (previousAnchor !== anchorRef.current) onAnchorChange(anchorRef.current);
	});
	const sideAndAlign = context.placementState && getSideAndAlignFromPlacement(context.placementState);
	const placedSide = sideAndAlign?.[0];
	const placedAlign = sideAndAlign?.[1];
	return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-radix-popper-side": placedSide,
		"data-radix-popper-align": placedAlign,
		...anchorProps,
		ref: composedRefs
	});
}, "PopperAnchor"));
var CONTENT_NAME$4 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$4);
var PopperContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$10(function PopperContent2(props, forwardedRef) {
	const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = Sticky.Partial, hideWhenDetached = false, updatePositionStrategy = UpdatePositionStrategy.Optimized, onPlaced, ...contentProps } = props;
	const context = usePopperContext(CONTENT_NAME$4, __scopePopper);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContent);
	const [arrow$4, setArrow] = import_react.useState(null);
	const arrowSize = useSize(arrow$4);
	const arrowWidth = arrowSize?.width ?? 0;
	const arrowHeight = arrowSize?.height ?? 0;
	const desiredPlacement = side + (align !== "center" ? "-" + align : "");
	const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...collisionPaddingProp
	};
	const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	const hasExplicitBoundaries = boundary.length > 0;
	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		altBoundary: hasExplicitBoundaries
	};
	const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
		strategy: "fixed",
		placement: desiredPlacement,
		whileElementsMounted: /* @__PURE__ */ __name$10((...args) => {
			return autoUpdate(...args, { animationFrame: updatePositionStrategy === UpdatePositionStrategy.Always });
		}, "whileElementsMounted"),
		elements: { reference: context.anchor },
		middleware: [
			offset({
				mainAxis: sideOffset + arrowHeight,
				alignmentAxis: alignOffset
			}),
			avoidCollisions && shift({
				mainAxis: true,
				crossAxis: false,
				...sticky === Sticky.Partial ? { limiter: limitShift() } : {},
				...detectOverflowOptions
			}),
			avoidCollisions && flip({ ...detectOverflowOptions }),
			size({
				...detectOverflowOptions,
				apply: /* @__PURE__ */ __name$10(({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
					contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
					contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
				}, "apply")
			}),
			arrow$4 && arrow({
				element: arrow$4,
				padding: arrowPadding
			}),
			transformOrigin({
				arrowWidth,
				arrowHeight
			}),
			hideWhenDetached && hide(hasExplicitBoundaries ? {
				strategy: "referenceHidden",
				...detectOverflowOptions
			} : {
				strategy: "referenceHidden",
				padding: detectOverflowOptions.padding,
				altBoundary: detectOverflowOptions.altBoundary
			})
		]
	});
	const setPlacementState = context.setPlacementState;
	useLayoutEffect2(() => {
		setPlacementState(placement);
		return () => {
			setPlacementState(void 0);
		};
	}, [placement, setPlacementState]);
	const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
	const handlePlaced = useCallbackRef$1(onPlaced);
	useLayoutEffect2(() => {
		if (isPositioned) handlePlaced?.();
	}, [isPositioned, handlePlaced]);
	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: refs.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...floatingStyles,
			transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: contentZIndex,
			"--radix-popper-transform-origin": [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
			...middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: props.dir,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			placedAlign,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				"data-side": placedSide,
				"data-align": placedAlign,
				...contentProps,
				ref: composedRefs,
				style: {
					...contentProps.style,
					animation: !isPositioned ? "none" : contentProps.style?.animation
				}
			})
		})
	});
}, "PopperContent"));
function isNotNull(value) {
	return value !== null;
}
__name$10(isNotNull, "isNotNull");
var transformOrigin = /* @__PURE__ */ __name$10((options) => ({
	name: "transformOrigin",
	options,
	fn(data) {
		const { placement, rects, middlewareData } = data;
		const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
		const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
		const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
		const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
		const noArrowAlign = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[placedAlign];
		const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
		const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
		let x = "";
		let y = "";
		if (placedSide === "bottom") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${-arrowHeight}px`;
		} else if (placedSide === "top") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${rects.floating.height + arrowHeight}px`;
		} else if (placedSide === "right") {
			x = `${-arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		} else if (placedSide === "left") {
			x = `${rects.floating.width + arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		}
		return { data: {
			x,
			y
		} };
	}
}), "transformOrigin");
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
__name$10(getSideAndAlignFromPlacement, "getSideAndAlignFromPlacement");
var __defProp$10 = Object.defineProperty;
var __name$9 = (target, value) => __defProp$10(target, "name", {
	value,
	configurable: true
});
var Portal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$9(function Portal2(props, forwardedRef) {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = import_react.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
}, "Portal"));
var __defProp$9 = Object.defineProperty;
var __name$8 = (target, value) => __defProp$9(target, "name", {
	value,
	configurable: true
});
var POPOVER_NAME = "Popover";
var [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [createPopperScope]);
var usePopperScope = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = /* @__PURE__ */ __name$8((props) => {
	const { __scopePopover, children, open: openProp, defaultOpen, onOpenChange, modal = false } = props;
	const popperScope = usePopperScope(__scopePopover);
	const triggerRef = import_react.useRef(null);
	const [hasCustomAnchor, setHasCustomAnchor] = import_react.useState(false);
	const [titleCount, setTitleCount] = import_react.useState(0);
	const [descriptionCount, setDescriptionCount] = import_react.useState(0);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: POPOVER_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popper, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverProvider, {
			scope: __scopePopover,
			contentId: useId$1(),
			titleId: useId$1(),
			descriptionId: useId$1(),
			titlePresent: titleCount > 0,
			descriptionPresent: descriptionCount > 0,
			setTitleCount,
			setDescriptionCount,
			triggerRef,
			open,
			onOpenChange: setOpen,
			onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
			hasCustomAnchor,
			onCustomAnchorAdd: import_react.useCallback(() => setHasCustomAnchor(true), []),
			onCustomAnchorRemove: import_react.useCallback(() => setHasCustomAnchor(false), []),
			modal,
			children
		})
	});
}, "Popover");
var TRIGGER_NAME$2 = "PopoverTrigger";
var PopoverTrigger$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverTrigger2(props, forwardedRef) {
	const { __scopePopover, ...triggerProps } = props;
	const context = usePopoverContext(TRIGGER_NAME$2, __scopePopover);
	const popperScope = usePopperScope(__scopePopover);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	const trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"data-state": getState$1(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
	return context.hasCustomAnchor ? trigger : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperAnchor, {
		asChild: true,
		...popperScope,
		children: trigger
	});
}, "PopoverTrigger"));
var PORTAL_NAME = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME, { forceMount: void 0 });
var PopoverPortal = /* @__PURE__ */ __name$8((props) => {
	const { __scopePopover, forceMount, children, container } = props;
	const context = usePopoverContext(PORTAL_NAME, __scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
		scope: __scopePopover,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
				asChild: true,
				container,
				children
			})
		})
	});
}, "PopoverPortal");
var CONTENT_NAME$3 = "PopoverContent";
var PopoverContent$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverContent2(props, forwardedRef) {
	const portalContext = usePortalContext(CONTENT_NAME$3, props.__scopePopover);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME$3, props.__scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
}, "PopoverContent"));
var Slot = createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverContentModal2(props, forwardedRef) {
	const context = usePopoverContext(CONTENT_NAME$3, props.__scopePopover);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	const isRightClickOutsideRef = import_react.useRef(false);
	const { nodes: branchNodes, registry: branchRegistry } = useFocusScopeBranchRegistry();
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot,
		allowPinchZoom: true,
		shards: import_react.useMemo(() => [contentRef, ...branchNodes.map((node) => ({ current: node }))], [contentRef, branchNodes]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentImpl, {
			...props,
			ref: composedRefs,
			branchNodes,
			branchRegistry,
			trapFocus: context.open,
			disableOutsidePointerEvents: true,
			onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
				event.preventDefault();
				if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
			}),
			onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
				const originalEvent = event.detail.originalEvent;
				const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
				const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
				isRightClickOutsideRef.current = isRightClick;
			}, { checkForDefaultPrevented: false }),
			onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false })
		})
	});
}, "PopoverContentModal"));
var PopoverContentNonModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverContentNonModal2(props, forwardedRef) {
	const context = usePopoverContext(CONTENT_NAME$3, props.__scopePopover);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
}, "PopoverContentNonModal"));
var PopoverContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverContentImpl2(props, forwardedRef) {
	const { __scopePopover, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, "aria-describedby": ariaDescribedby, branchNodes, branchRegistry, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME$3, __scopePopover);
	const popperScope = usePopperScope(__scopePopover);
	const [contentNode, setContentNode] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContentNode);
	useFocusScopeBranch(contentNode);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScopeBranchProvider, {
		registry: branchRegistry,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
			asChild: true,
			loop: true,
			trapped: trapFocus,
			branches: branchNodes,
			onMountAutoFocus: onOpenAutoFocus,
			onUnmountAutoFocus: onCloseAutoFocus,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
				asChild: true,
				disableOutsidePointerEvents,
				onInteractOutside,
				onEscapeKeyDown,
				onPointerDownOutside,
				onFocusOutside,
				onDismiss: () => context.onOpenChange(false),
				deferPointerDownOutside: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperContent, {
					"data-state": getState$1(context.open),
					role: "dialog",
					id: context.contentId,
					"aria-labelledby": context.titlePresent ? context.titleId : void 0,
					"aria-describedby": context.descriptionPresent ? concatAriaDescribedby(ariaDescribedby, context.descriptionId) : ariaDescribedby,
					...popperScope,
					...contentProps,
					ref: composedRefs,
					style: {
						...contentProps.style,
						"--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
						"--radix-popover-content-available-width": "var(--radix-popper-available-width)",
						"--radix-popover-content-available-height": "var(--radix-popper-available-height)",
						"--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
						"--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
					}
				})
			})
		})
	});
}, "PopoverContentImpl"));
var CLOSE_NAME = "PopoverClose";
var PopoverClose$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function PopoverClose2(props, forwardedRef) {
	const { __scopePopover, ...closeProps } = props;
	const context = usePopoverContext(CLOSE_NAME, __scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
}, "PopoverClose"));
function getState$1(open) {
	return open ? "open" : "closed";
}
__name$8(getState$1, "getState");
function concatAriaDescribedby(...values) {
	const ids = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (typeof value !== "string") continue;
		for (const id of String(value).trim().split(/\s+/)) if (id) ids.add(id);
	}
	return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
}
__name$8(concatAriaDescribedby, "concatAriaDescribedby");
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
function PopoverContent({ className, align = "center", sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
		align,
		sideOffset,
		side: "bottom",
		className: cn("z-50 origin-(--radix-popover-content-transform-origin) overflow-y-auto max-h-(--radix-popover-content-available-height) min-w-[240px] max-w-[98vw] rounded-xl border bg-fd-popover/60 backdrop-blur-lg p-2 text-sm text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[state=closed]:animate-fd-popover-out data-[state=open]:animate-fd-popover-in", className),
		...props
	}) });
}
var PopoverClose = PopoverClose$1;
function LanguageSelect({ className, variant = "ghost", children, ...rest }) {
	const context = useI18n();
	const t = useTranslations({ note: "language switcher" });
	if (!context.locales) throw new Error("Missing `<I18nProvider />`");
	const chooseLanguage = t("Choose a language");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		"aria-label": t("Choose a language", { note: "aria-label" }),
		className: cn(buttonVariants({ variant }), "gap-1.5 p-1.5 data-[state=open]:bg-fd-accent", className),
		...rest,
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		className: "flex flex-col gap-0.5 p-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-2 text-xs font-medium text-fd-muted-foreground",
			children: chooseLanguage
		}), context.locales.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
			className: cn("px-2 py-1.5 text-start text-sm rounded-lg transition-colors", item.locale === context.locale ? "bg-fd-primary/10 text-fd-primary" : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"),
			onClick: () => {
				context.onChange?.(item.locale);
			},
			children: item.name
		}, item.locale))]
	})] });
}
function LanguageSelectText(props) {
	const { locales, locale } = useI18n();
	const text = locales?.find((item) => item.locale === locale)?.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		...props,
		children: text
	});
}
/**
* Listen to `keydown` on window, skipping keys that are already handled or composing text.
*/
function useHotKey(onKeyDown, { enabled = true, ignoreTyping = false } = {}) {
	const listener = (0, import_react.useEffectEvent)((e) => {
		if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
		if (ignoreTyping && isTypingTarget(e.target)) return;
		onKeyDown(e);
	});
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, [enabled]);
}
function isTypingTarget(target) {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable) return true;
	if ([
		"INPUT",
		"TEXTAREA",
		"SELECT"
	].includes(target.tagName)) return true;
	return target.closest("[role=\"dialog\"]") !== null;
}
var SearchContext = (0, import_react.createContext)({
	enabled: false,
	open: false,
	hotKey: [],
	setOpenSearch: () => void 0
});
function useSearchContext() {
	return (0, import_react.use)(SearchContext);
}
var noop$2 = () => () => {};
function MetaOrControl() {
	return (0, import_react.useSyncExternalStore)(noop$2, () => true, () => false) && /Windows|Linux/i.test(navigator.userAgent) ? "Ctrl" : "⌘";
}
var DEFAULT_HOT_KEYS = [{
	key: (e) => e.metaKey || e.ctrlKey,
	display: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaOrControl, {})
}, {
	key: "k",
	display: "K"
}];
var DefaultSearchDialog = (0, import_react.lazy)(() => import("./_ssr/search-default-BPRhW4eJ.mjs"));
function SearchProvider({ SearchDialog = DefaultSearchDialog, children, preload = true, options, hotKey = DEFAULT_HOT_KEYS, links }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(preload ? false : void 0);
	useHotKey((e) => {
		if (hotKey.every((v) => typeof v.key === "string" ? e.key === v.key : v.key(e))) {
			setIsOpen((open) => !open);
			e.preventDefault();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchContext, {
		value: (0, import_react.useMemo)(() => ({
			enabled: true,
			open: isOpen ?? false,
			hotKey,
			setOpenSearch: setIsOpen
		}), [isOpen, hotKey]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: isOpen !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
				open: isOpen,
				onOpenChange: setIsOpen,
				links,
				...options
			})
		}), children]
	});
}
var import_lucide_react = require_lucide_react();
function SearchTrigger({ hideIfDisabled, size = "icon-sm", color, variant = color ?? "ghost", ...props }) {
	const { setOpenSearch, enabled } = useSearchContext();
	const t = useTranslations({ note: "search trigger" });
	if (hideIfDisabled && !enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn(buttonVariants({
			size,
			variant
		}), props.className),
		"data-search": "",
		"aria-label": t("Open Search", { note: "aria-label" }),
		onClick: () => {
			setOpenSearch(true);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, {})
	});
}
function FullSearchTrigger({ hideIfDisabled, ...props }) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const t = useTranslations({ note: "search trigger" });
	if (hideIfDisabled && !enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-search-full": "",
		...props,
		className: cn("inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground", props.className),
		onClick: () => {
			setOpenSearch(true);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "size-4" }),
			t("Search"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ms-auto inline-flex gap-0.5",
				children: hotKey.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
					className: "rounded-md border bg-fd-background px-1.5",
					children: k.display
				}, i))
			})
		]
	});
}
var M = (e, i, s, u, m, a, l, h) => {
	let d = document.documentElement, w = ["light", "dark"];
	function p(n) {
		(Array.isArray(e) ? e : [e]).forEach((y) => {
			let k = y === "class", S = k && a ? m.map((f) => a[f] || f) : m;
			k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
		}), R(n);
	}
	function R(n) {
		h && w.includes(n) && (d.style.colorScheme = n);
	}
	function c() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	if (u) p(u);
	else try {
		let n = localStorage.getItem(i) || s;
		p(l && n === "system" ? c() : n);
	} catch (n) {}
};
var b = ["light", "dark"];
var I = "(prefers-color-scheme: dark)";
var O = typeof window == "undefined";
var x = import_react.createContext(void 0);
var U = {
	setTheme: (e) => {},
	themes: []
};
var z = () => {
	var e;
	return (e = import_react.useContext(x)) != null ? e : U;
};
var J = (e) => import_react.useContext(x) ? import_react.createElement(import_react.Fragment, null, e.children) : import_react.createElement(V, { ...e });
var N = ["light", "dark"];
var V = ({ forcedTheme: e, disableTransitionOnChange: i = !1, enableSystem: s = !0, enableColorScheme: u = !0, storageKey: m = "theme", themes: a = N, defaultTheme: l = s ? "system" : "light", attribute: h = "data-theme", value: d, children: w, nonce: p, scriptProps: R }) => {
	let [c, n] = import_react.useState(() => H(m, l)), [T, y] = import_react.useState(() => c === "system" ? E() : c), k = d ? Object.values(d) : a, S = import_react.useCallback((o) => {
		let r = o;
		if (!r) return;
		o === "system" && s && (r = E());
		let v = d ? d[r] : r, C = i ? W(p) : null, P = document.documentElement, L = (g) => {
			g === "class" ? (P.classList.remove(...k), v && P.classList.add(v)) : g.startsWith("data-") && (v ? P.setAttribute(g, v) : P.removeAttribute(g));
		};
		if (Array.isArray(h) ? h.forEach(L) : L(h), u) {
			let g = b.includes(l) ? l : null, D = b.includes(r) ? r : g;
			P.style.colorScheme = D;
		}
		C?.();
	}, [p]), f = import_react.useCallback((o) => {
		let r = typeof o == "function" ? o(c) : o;
		n(r);
		try {
			localStorage.setItem(m, r);
		} catch (v) {}
	}, [c]), A = import_react.useCallback((o) => {
		let r = E(o);
		y(r), c === "system" && s && !e && S("system");
	}, [c, e]);
	import_react.useEffect(() => {
		let o = window.matchMedia(I);
		return o.addListener(A), A(o), () => o.removeListener(A);
	}, [A]), import_react.useEffect(() => {
		let o = (r) => {
			r.key === m && (r.newValue ? n(r.newValue) : f(l));
		};
		return window.addEventListener("storage", o), () => window.removeEventListener("storage", o);
	}, [f]), import_react.useEffect(() => {
		S(e != null ? e : c);
	}, [e, c]);
	let Q = import_react.useMemo(() => ({
		theme: c,
		setTheme: f,
		forcedTheme: e,
		resolvedTheme: c === "system" ? T : c,
		themes: s ? [...a, "system"] : a,
		systemTheme: s ? T : void 0
	}), [
		c,
		f,
		e,
		T,
		s,
		a
	]);
	return import_react.createElement(x.Provider, { value: Q }, import_react.createElement(_, {
		forcedTheme: e,
		storageKey: m,
		attribute: h,
		enableSystem: s,
		enableColorScheme: u,
		defaultTheme: l,
		value: d,
		themes: a,
		nonce: p,
		scriptProps: R
	}), w);
};
var _ = import_react.memo(({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w }) => {
	let p = JSON.stringify([
		s,
		i,
		a,
		e,
		h,
		l,
		u,
		m
	]).slice(1, -1);
	return import_react.createElement("script", {
		...w,
		suppressHydrationWarning: !0,
		nonce: typeof window == "undefined" ? d : "",
		dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` }
	});
});
var H = (e, i) => {
	if (O) return;
	let s;
	try {
		s = localStorage.getItem(e) || void 0;
	} catch (u) {}
	return s || i;
};
var W = (e) => {
	let i = document.createElement("style");
	return e && i.setAttribute("nonce", e), i.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(i), () => {
		window.getComputedStyle(document.body), setTimeout(() => {
			document.head.removeChild(i);
		}, 1);
	};
};
var E = (e) => (e || (e = window.matchMedia(I)), e.matches ? "dark" : "light");
var noop$1 = () => () => {};
var itemVariants$1 = cva("size-6.5 p-1.5 text-fd-muted-foreground", { variants: { active: {
	true: "bg-fd-accent text-fd-accent-foreground",
	false: "text-fd-muted-foreground"
} } });
var full = [
	["light", import_lucide_react.Sun],
	["dark", import_lucide_react.Moon],
	["system", import_lucide_react.Airplay]
];
function ThemeSwitch({ className, mode = "light-dark", ...props }) {
	const { setTheme, theme, resolvedTheme } = z();
	const mounted = (0, import_react.useSyncExternalStore)(noop$1, () => true, () => false);
	const t = useTranslations({ note: "theme switcher" });
	const themeAriaLabels = {
		light: t("Light", { note: "aria-label" }),
		dark: t("Dark", { note: "aria-label" }),
		system: t("System", { note: "aria-label" })
	};
	const handleThemeChange = (newTheme) => {
		if (document?.startViewTransition) document.startViewTransition(() => (0, import_react_dom.flushSync)(() => setTheme(newTheme)));
		else setTheme(newTheme);
	};
	const container = cn("inline-flex items-center rounded-full border p-1 overflow-hidden *:rounded-full", className);
	if (mode === "light-dark") {
		const value = mounted ? resolvedTheme : null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: container,
			"aria-label": t("Toggle Theme", { note: "aria-label" }),
			onClick: () => handleThemeChange(value === "light" ? "dark" : "light"),
			"data-theme-toggle": "",
			children: full.map(([key, Icon]) => {
				if (key === "system") return;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					fill: "currentColor",
					className: cn(itemVariants$1({ active: value === key }))
				}, key);
			})
		});
	}
	const value = mounted ? theme : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: container,
		"data-theme-toggle": "",
		...props,
		children: full.map(([key, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": themeAriaLabels[key],
			className: cn(itemVariants$1({ active: value === key })),
			onClick: () => handleThemeChange(key),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "size-full",
				fill: "currentColor"
			})
		}, key))
	});
}
function Link$2({ ref, href = "#", external = !!(href.match(/^\w+:/) || href.startsWith("//")), prefetch, children, ...props }) {
	if (external) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		ref,
		href,
		rel: "noreferrer noopener",
		target: "_blank",
		...props,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		ref,
		href,
		prefetch,
		...props,
		children
	});
}
function LinkItem({ ref, item, ...props }) {
	const active = isLinkItemActive(item, usePathname());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$2, {
		ref,
		href: item.url,
		external: item.external,
		...props,
		"data-active": active,
		children: props.children
	});
}
/**
* The place of AI chat, docked by the layout on wide viewports, and floating on smaller ones.
*/
function AIChatPanel({ open, className, children }) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	if (open && !mounted) setMounted(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: cn("z-40 overflow-clip bg-fd-card text-fd-card-foreground layout:[--fd-ai-chat-width:min(--spacing(100),100vw---spacing(4))] transition-[width,margin,translate] duration-300 ease-in-out motion-reduce:transition-none max-xl:fixed max-xl:inset-y-2 max-xl:end-2 max-xl:w-(--fd-ai-chat-width) max-xl:rounded-2xl max-xl:border max-xl:shadow-xl", open ? "w-(--fd-ai-chat-width)" : "invisible w-0 transition-[width,margin,translate,visibility] max-xl:translate-x-[calc(100%+--spacing(2))] rtl:max-xl:-translate-x-[calc(100%+--spacing(2))]", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col size-full xl:w-(--fd-ai-chat-width)",
			children: mounted && children
		})
	});
}
/** a floating button toggling the chat, for layouts without one of their own */
function AIChatTrigger({ open, onOpenChange }) {
	const t = useTranslations({ note: "AI chat button" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-expanded": open,
		className: cn(buttonVariants({ variant: "secondary" }), "fixed inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))] bottom-4 z-20 gap-2 rounded-2xl text-fd-muted-foreground shadow-lg transition-[translate,opacity] motion-reduce:transition-none", open && "translate-y-10 opacity-0"),
		inert: open,
		onClick: () => onOpenChange(!open),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircleIcon, {
			"aria-hidden": true,
			className: "size-4.5"
		}), t("Ask AI")]
	});
}
function baseSlots({ useProps }) {
	function InlineThemeSwitch(props) {
		const { themeSwitch } = useProps();
		if (themeSwitch.component) return themeSwitch.component;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwitch, {
			...props,
			...themeSwitch
		});
	}
	function InlineSearchTrigger(props) {
		const { searchToggle } = useProps();
		if (searchToggle.components?.sm) return searchToggle.components.sm;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchTrigger, {
			...props,
			...searchToggle.sm
		});
	}
	function InlineSearchTriggerFull(props) {
		const { searchToggle } = useProps();
		if (searchToggle.components?.lg) return searchToggle.components.lg;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullSearchTrigger, {
			...props,
			...searchToggle.full
		});
	}
	function InlineNavTitle({ href: defaultUrl = "/", ...props }) {
		const { url = defaultUrl, title } = useProps().nav ?? {};
		if (typeof title === "function") return title({
			href: url,
			...props
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$2, {
			href: url,
			...props,
			children: title
		});
	}
	return { useBaseSlots(options) {
		const { locales = [] } = useI18n();
		const { nav, slots = {}, i18n = locales.length > 1, searchToggle: { enabled: searchToggleEnabled = true, ...searchToggle } = {}, themeSwitch: { enabled: themeSwitchEnabled = true, ...themeSwitch } = {} } = options;
		return {
			baseSlots: {
				navTitle: slots.navTitle ?? InlineNavTitle,
				themeSwitch: themeSwitchEnabled && (slots.themeSwitch ?? InlineThemeSwitch),
				languageSelect: i18n ? slots.languageSelect ?? {
					root: LanguageSelect,
					text: LanguageSelectText
				} : false,
				searchTrigger: searchToggleEnabled && (slots.searchTrigger ?? {
					sm: InlineSearchTrigger,
					full: InlineSearchTriggerFull
				})
			},
			baseProps: {
				nav,
				searchToggle,
				themeSwitch
			}
		};
	} };
}
function SkipToContent() {
	const t = useTranslations({ note: "skip link" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "#nd-page",
		className: "sr-only",
		children: t("Skip to Content")
	});
}
var defaultTransform = (option, node) => {
	if (!node.icon) return option;
	return {
		...option,
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "size-full [&_svg]:size-full max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary",
			children: node.icon
		})
	};
};
function getLayoutTabs(tree, { transform = defaultTransform } = {}) {
	const results = [];
	function next(node, unlisted) {
		if ("root" in node && node.root) {
			const url = node.index?.url ?? node.children.find((node) => node.type === "page")?.url;
			if (url) {
				const option = {
					title: node.name,
					icon: node.icon,
					description: node.description,
					url,
					unlisted,
					$folder: node
				};
				const mapped = transform ? transform(option, node) : option;
				if (mapped) results.push(mapped);
			}
		}
		for (const child of node.children) if (child.type === "folder") next(child, unlisted);
	}
	next(tree);
	if (tree.fallback) next(tree.fallback, true);
	return results;
}
function isLayoutTabActive(tab, pathname) {
	if (tab.$folder) return findPath(tab.$folder.children, (node) => node.type === "page" && isActive(node.url, pathname)) !== null;
	if (tab.urls) return tab.urls.has(normalize(pathname));
	return isActive(tab.url, pathname, true);
}
/**
* Get link items with shortcuts
*/
function resolveLinkItems({ links = [], githubUrl }) {
	const result = [...links];
	if (githubUrl) result.push({
		type: "icon",
		url: githubUrl,
		text: "Github",
		label: "GitHub",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			"aria-hidden": "true",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" })
		}),
		external: true
	});
	return result;
}
function useLinkItems({ githubUrl, links }) {
	return (0, import_react.useMemo)(() => {
		const all = resolveLinkItems({
			links,
			githubUrl
		});
		const navItems = [];
		const menuItems = [];
		for (const item of all) switch (item.on) {
			case "menu":
				menuItems.push(item);
				break;
			case "nav":
				navItems.push(item);
				break;
			default:
				navItems.push(item);
				menuItems.push(item);
		}
		return {
			navItems,
			menuItems,
			all
		};
	}, [links, githubUrl]);
}
function isLinkItemActive(link, pathname) {
	if (link.type === "custom" || !link.url) return false;
	if (link.active === "none") return false;
	return isActive(link.url, pathname, link.active === "nested-url");
}
function getBreadcrumbItemsFromPath(tree, path, options) {
	const { includePage = false, includeSeparator = false, includeRoot = false } = options;
	let items = [];
	for (let i = 0; i < path.length; i++) {
		const item = path[i];
		switch (item.type) {
			case "page":
				if (includePage) items.push({
					name: item.name,
					url: item.url
				});
				break;
			case "folder":
				if (item.root) {
					items = [];
					if (includeRoot) items.push({
						name: tree.name,
						url: typeof includeRoot === "object" ? includeRoot.url : item.index?.url
					});
					break;
				}
				if (i === path.length - 1 || item.index !== path[i + 1]) items.push({
					name: item.name,
					url: item.index?.url
				});
				break;
			case "separator": if (item.name && includeSeparator) items.push({ name: item.name });
		}
	}
	return items;
}
/**
* Search the path of a node in the tree by a specified url
*
* - When the page doesn't exist, return null
*
* @returns The path to the target node from root
* @internal Don't use this on your own
*/
function searchPath(nodes, url) {
	const normalizedUrl = normalizeUrl(url);
	return findPath(nodes, (node) => node.type === "page" && node.url === normalizedUrl);
}
var TreeContext = (0, import_react.createContext)(null);
var PathContext = (0, import_react.createContext)([]);
function TreeContextProvider({ tree: rawTree, children }) {
	const nextIdRef = (0, import_react.useRef)(0);
	const pathname = usePathname();
	const tree = (0, import_react.useMemo)(() => rawTree, [rawTree.$id]);
	const path = (0, import_react.useMemo)(() => {
		return searchPath(tree.children, pathname) ?? (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ?? [];
	}, [tree, pathname]);
	const root = path.findLast((item) => item.type === "folder" && item.root) ?? tree;
	root.$id ??= String(nextIdRef.current++);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeContext, {
		value: (0, import_react.useMemo)(() => ({
			root,
			full: tree
		}), [root, tree]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathContext, {
			value: path,
			children
		})
	});
}
function useTreePath() {
	return (0, import_react.use)(PathContext);
}
function useTreeContext() {
	const ctx = (0, import_react.use)(TreeContext);
	if (!ctx) throw new Error("You must wrap this component under <DocsLayout />");
	return ctx;
}
/**
* Group tabs by the root folders on the current page's path (outermost first): each tab is
* matched to its root folder, linking to the projection of current page when possible.
*
* Tabs not bound to the page tree are appended to the group of `root: true` folders.
*/
function useTabsGroups(tabs) {
	const { full: tree } = useTreeContext();
	const path = (0, import_react.use)(PathContext);
	return (0, import_react.useMemo)(() => {
		const out = [];
		const last = path[path.length - 1];
		const page = last?.type === "page" ? last : void 0;
		let scope = tree.fallback ? [...tree.children, ...tree.fallback.children] : tree.children;
		for (const node of path) {
			if (node.type !== "folder" || !node.root) continue;
			const group = {
				active: node,
				options: []
			};
			collectTabs(scope, node, page, tabs, group.options);
			if (group.options.length > 0) out.push(group);
			scope = node.children;
		}
		const custom = tabs.filter((tab) => !tab.$folder);
		if (custom.length > 0) {
			const group = out.findLast((group) => group.active?.root === true);
			if (group) group.options.push(...custom);
			else out.push({ options: custom });
		}
		return out;
	}, [
		tabs,
		tree,
		path
	]);
}
/** collect the tabs of root folders with the same type as `active` within a scope */
function collectTabs(scope, active, page, tabs, out) {
	for (const node of scope) {
		if (node.type !== "folder") continue;
		if (node.root === active.root) {
			const tab = tabs.find((tab) => tab.$folder && (tab.$folder === node || tab.$folder.$id === node.$id));
			if (!tab) continue;
			const projection = page && findProjection(active, node, page);
			out.push(projection ? {
				...tab,
				url: projection.url
			} : tab);
		} else if (!node.root) collectTabs(node.children, active, page, tabs, out);
	}
}
var subscribe$1 = (onChange) => {
	window.addEventListener("scroll", onChange, { passive: true });
	return () => window.removeEventListener("scroll", onChange);
};
var noop = () => () => {};
var getServerSnapshot$1 = () => void 0;
/**
* @returns `undefined` on the server, during hydration, or when disabled.
*/
function useIsScrollTop({ enabled = true }) {
	return (0, import_react.useSyncExternalStore)(enabled ? subscribe$1 : noop, () => enabled ? window.scrollY < 10 : void 0, getServerSnapshot$1);
}
function mergeRefs$1(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref) ref.current = value;
		});
	};
}
var __defProp$8 = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp$8(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp$8(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __defProp$7 = Object.defineProperty;
var __name$7 = (target, value) => __defProp$7(target, "name", {
	value,
	configurable: true
});
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function Collapsible2(props, forwardedRef) {
	const { __scopeCollapsible, open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props;
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: COLLAPSIBLE_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleProvider, {
		scope: __scopeCollapsible,
		disabled,
		contentId: useId$1(),
		open,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": getState(open),
			"data-disabled": disabled ? "" : void 0,
			...collapsibleProps,
			ref: forwardedRef
		})
	});
}, "Collapsible"));
var TRIGGER_NAME$1 = "CollapsibleTrigger";
var CollapsibleTrigger$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function CollapsibleTrigger2(props, forwardedRef) {
	const { __scopeCollapsible, ...triggerProps } = props;
	const context = useCollapsibleContext(TRIGGER_NAME$1, __scopeCollapsible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-controls": context.open ? context.contentId : void 0,
		"aria-expanded": context.open || false,
		"data-state": getState(context.open),
		"data-disabled": context.disabled ? "" : void 0,
		disabled: context.disabled,
		...triggerProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
}, "CollapsibleTrigger"));
var CONTENT_NAME$2 = "CollapsibleContent";
var CollapsibleContent$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function CollapsibleContent2(props, forwardedRef) {
	const { forceMount, ...contentProps } = props;
	const context = useCollapsibleContext(CONTENT_NAME$2, props.__scopeCollapsible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContentImpl, {
			...contentProps,
			ref: forwardedRef,
			present
		})
	});
}, "CollapsibleContent"));
var CollapsibleContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function CollapsibleContentImpl2(props, forwardedRef) {
	const { __scopeCollapsible, present, children, ...contentProps } = props;
	const context = useCollapsibleContext(CONTENT_NAME$2, __scopeCollapsible);
	const [isPresent, setIsPresent] = import_react.useState(present);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const heightRef = import_react.useRef(0);
	const height = heightRef.current;
	const widthRef = import_react.useRef(0);
	const width = widthRef.current;
	const isOpen = context.open || isPresent;
	const isMountAnimationPreventedRef = import_react.useRef(isOpen);
	const originalStylesRef = import_react.useRef(void 0);
	import_react.useEffect(() => {
		const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
		return () => cancelAnimationFrame(rAF);
	}, []);
	useLayoutEffect2(() => {
		const node = ref.current;
		if (node) {
			originalStylesRef.current = originalStylesRef.current || {
				transitionDuration: node.style.transitionDuration,
				animationName: node.style.animationName
			};
			node.style.transitionDuration = "0s";
			node.style.animationName = "none";
			const rect = node.getBoundingClientRect();
			heightRef.current = rect.height;
			widthRef.current = rect.width;
			if (!isMountAnimationPreventedRef.current) {
				node.style.transitionDuration = originalStylesRef.current.transitionDuration;
				node.style.animationName = originalStylesRef.current.animationName;
			}
			setIsPresent(present);
		}
	}, [context.open, present]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-state": getState(context.open),
		"data-disabled": context.disabled ? "" : void 0,
		id: context.contentId,
		hidden: !isOpen,
		...contentProps,
		ref: composedRefs,
		style: {
			[`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
			[`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
			...props.style
		},
		children: isOpen && children
	});
}, "CollapsibleContentImpl"));
function getState(open) {
	return open ? "open" : "closed";
}
__name$7(getState, "getState");
var Collapsible = Collapsible$1;
var CollapsibleTrigger = CollapsibleTrigger$1;
function CollapsibleContent({ children, ...props }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent$1, {
		...props,
		className: cn("overflow-hidden", mounted && "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down", props.className),
		children
	});
}
var getServerSnapshot = () => null;
/**
* @returns `null` on the server, during hydration, or when disabled.
*/
function useMediaQuery(query, disabled = false) {
	const subscribe = (0, import_react.useCallback)((onChange) => {
		if (disabled) return () => {};
		const list = window.matchMedia(query);
		list.addEventListener("change", onChange);
		return () => list.removeEventListener("change", onChange);
	}, [query, disabled]);
	return (0, import_react.useSyncExternalStore)(subscribe, () => disabled ? null : window.matchMedia(query).matches, getServerSnapshot);
}
var __defProp$6 = Object.defineProperty;
var __name$6 = (target, value) => __defProp$6(target, "name", {
	value,
	configurable: true
});
var Direction$2 = {
	LTR: "ltr",
	RTL: "rtl"
};
var DirectionContext = import_react.createContext(void 0);
var DirectionProvider = /* @__PURE__ */ __name$6((props) => {
	const { dir, children } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectionContext.Provider, {
		value: dir,
		children
	});
}, "DirectionProvider");
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || Direction$2.LTR;
}
__name$6(useDirection, "useDirection");
var __defProp$5 = Object.defineProperty;
var __name$5 = (target, value) => __defProp$5(target, "name", {
	value,
	configurable: true
});
function clamp$1(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
__name$5(clamp$1, "clamp");
var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", {
	value,
	configurable: true
});
function useStateMachine(initialState, machine) {
	return import_react.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
__name$4(useStateMachine, "useStateMachine");
var ScrollAreaType = {
	Auto: "auto",
	Always: "always",
	Scroll: "scroll",
	Hover: "hover"
};
var Orientation$1 = {
	Vertical: "vertical",
	Horizontal: "horizontal"
};
var Direction$1 = {
	LTR: "ltr",
	RTL: "rtl"
};
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollArea2(props, forwardedRef) {
	const { __scopeScrollArea, type = ScrollAreaType.Hover, dir, scrollHideDelay = 600, ...scrollAreaProps } = props;
	const [scrollArea, setScrollArea] = import_react.useState(null);
	const [viewport, setViewport] = import_react.useState(null);
	const [content, setContent] = import_react.useState(null);
	const [scrollbarX, setScrollbarX] = import_react.useState(null);
	const [scrollbarY, setScrollbarY] = import_react.useState(null);
	const [cornerWidth, setCornerWidth] = import_react.useState(0);
	const [cornerHeight, setCornerHeight] = import_react.useState(0);
	const [scrollbarXEnabled, setScrollbarXEnabled] = import_react.useState(false);
	const [scrollbarYEnabled, setScrollbarYEnabled] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, setScrollArea);
	const direction = useDirection(dir);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaProvider, {
		scope: __scopeScrollArea,
		type,
		dir: direction,
		scrollHideDelay,
		scrollArea,
		viewport,
		onViewportChange: setViewport,
		content,
		onContentChange: setContent,
		scrollbarX,
		onScrollbarXChange: setScrollbarX,
		scrollbarXEnabled,
		onScrollbarXEnabledChange: setScrollbarXEnabled,
		scrollbarY,
		onScrollbarYChange: setScrollbarY,
		scrollbarYEnabled,
		onScrollbarYEnabledChange: setScrollbarYEnabled,
		onCornerWidthChange: setCornerWidth,
		onCornerHeightChange: setCornerHeight,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			dir: direction,
			...scrollAreaProps,
			ref: composedRefs,
			style: {
				position: "relative",
				"--radix-scroll-area-corner-width": cornerWidth + "px",
				"--radix-scroll-area-corner-height": cornerHeight + "px",
				...props.style
			}
		})
	});
}, "ScrollArea"));
var VIEWPORT_NAME = "ScrollAreaViewport";
var Slottable = createSlottable(VIEWPORT_NAME);
var ScrollAreaViewport = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaViewport2(props, forwardedRef) {
	const { __scopeScrollArea, children, nonce, disableImplicitContentElement, ...viewportProps } = props;
	const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
	const canSlotOntoChildren = import_react.isValidElement(children);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewportStyle, { nonce }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-radix-scroll-area-viewport": "",
		...viewportProps,
		ref: composedRefs,
		style: {
			/**
			* We don't support `visible` because the intention is to have at least one scrollbar
			* if this component is used and `visible` will behave like `auto` in that case
			* https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
			*
			* We don't handle `auto` because the intention is for the native implementation
			* to be hidden if using this component. We just want to ensure the node is scrollable
			* so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
			* the browser from having to work out whether to render native scrollbars or not,
			* we tell it to with the intention of hiding them in CSS.
			*/
			overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
			...props.style
		},
		children: disableImplicitContentElement ? children : canSlotOntoChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, {
			child: children,
			children: (slottable) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaContent, {
				__scopeScrollArea,
				children: slottable
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaContent, {
			__scopeScrollArea,
			children
		}) })
	})] });
}, "ScrollAreaViewport"));
var ScrollAreaViewportStyle = /* @__PURE__ */ import_react.memo(/* @__PURE__ */ __name$4(function ScrollAreaViewportStyle2({ nonce }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
		dangerouslySetInnerHTML: { __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}` },
		nonce
	});
}, "ScrollAreaViewportStyle"), (prevProps, nextProps) => prevProps.nonce === nextProps.nonce);
var CONTENT_NAME$1 = "ScrollAreaContent";
var ScrollAreaContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaContent2(props, forwardedRef) {
	const { __scopeScrollArea, children, ...contentProps } = props;
	const context = useScrollAreaContext(CONTENT_NAME$1, __scopeScrollArea);
	const composedRefs = useComposedRefs(forwardedRef, context.onContentChange);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...contentProps,
		ref: composedRefs,
		style: {
			minWidth: "100%",
			display: "table",
			...props.style
		},
		children
	});
}, "ScrollAreaContent"));
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbar2(props, forwardedRef) {
	const { forceMount, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
	const isHorizontal = props.orientation === Orientation$1.Horizontal;
	import_react.useEffect(() => {
		isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
		return () => {
			isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
		};
	}, [
		isHorizontal,
		onScrollbarXEnabledChange,
		onScrollbarYEnabledChange
	]);
	return context.type === ScrollAreaType.Hover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarHover, {
		...scrollbarProps,
		ref: forwardedRef,
		forceMount
	}) : context.type === ScrollAreaType.Scroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarScroll, {
		...scrollbarProps,
		ref: forwardedRef,
		forceMount
	}) : context.type === ScrollAreaType.Auto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarAuto, {
		...scrollbarProps,
		ref: forwardedRef,
		forceMount
	}) : context.type === ScrollAreaType.Always ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarVisible, {
		...scrollbarProps,
		ref: forwardedRef,
		"data-state": "visible"
	}) : null;
}, "ScrollAreaScrollbar"));
var ScrollAreaScrollbarHover = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarHover2(props, forwardedRef) {
	const { forceMount, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const [visible, setVisible] = import_react.useState(false);
	import_react.useEffect(() => {
		const scrollArea = context.scrollArea;
		let hideTimer = 0;
		if (scrollArea) {
			const handlePointerEnter = /* @__PURE__ */ __name$4(() => {
				window.clearTimeout(hideTimer);
				setVisible(true);
			}, "handlePointerEnter");
			const handlePointerLeave = /* @__PURE__ */ __name$4(() => {
				hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
			}, "handlePointerLeave");
			scrollArea.addEventListener("pointerenter", handlePointerEnter);
			scrollArea.addEventListener("pointerleave", handlePointerLeave);
			return () => {
				window.clearTimeout(hideTimer);
				scrollArea.removeEventListener("pointerenter", handlePointerEnter);
				scrollArea.removeEventListener("pointerleave", handlePointerLeave);
			};
		}
	}, [context.scrollArea, context.scrollHideDelay]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || visible,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarAuto, {
			"data-state": visible ? "visible" : "hidden",
			...scrollbarProps,
			ref: forwardedRef
		})
	});
}, "ScrollAreaScrollbarHover"));
var ScrollAreaScrollbarScroll = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarScroll2(props, forwardedRef) {
	const { forceMount, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const isHorizontal = props.orientation === Orientation$1.Horizontal;
	const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
	const [state, send] = useStateMachine("hidden", {
		hidden: { SCROLL: "scrolling" },
		scrolling: {
			SCROLL_END: "idle",
			POINTER_ENTER: "interacting"
		},
		interacting: {
			SCROLL: "interacting",
			POINTER_LEAVE: "idle"
		},
		idle: {
			HIDE: "hidden",
			SCROLL: "scrolling",
			POINTER_ENTER: "interacting"
		}
	});
	import_react.useEffect(() => {
		if (state === "idle") {
			const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
			return () => window.clearTimeout(hideTimer);
		}
	}, [
		state,
		context.scrollHideDelay,
		send
	]);
	import_react.useEffect(() => {
		const viewport = context.viewport;
		const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
		if (viewport) {
			let prevScrollPos = viewport[scrollDirection];
			const handleScroll = /* @__PURE__ */ __name$4(() => {
				const scrollPos = viewport[scrollDirection];
				if (prevScrollPos !== scrollPos) {
					send("SCROLL");
					debounceScrollEnd();
				}
				prevScrollPos = scrollPos;
			}, "handleScroll");
			viewport.addEventListener("scroll", handleScroll);
			return () => viewport.removeEventListener("scroll", handleScroll);
		}
	}, [
		context.viewport,
		isHorizontal,
		send,
		debounceScrollEnd
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || state !== "hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarVisible, {
			"data-state": state === "hidden" ? "hidden" : "visible",
			...scrollbarProps,
			ref: forwardedRef,
			onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
		})
	});
}, "ScrollAreaScrollbarScroll"));
var ScrollAreaScrollbarAuto = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarAuto2(props, forwardedRef) {
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const { forceMount, ...scrollbarProps } = props;
	const [visible, setVisible] = import_react.useState(false);
	const isHorizontal = props.orientation === Orientation$1.Horizontal;
	const handleResize = useDebounceCallback(() => {
		if (context.viewport) {
			const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
			const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
			setVisible(isHorizontal ? isOverflowX : isOverflowY);
		}
	}, 10);
	useResizeObserver(context.viewport, handleResize);
	useResizeObserver(context.content, handleResize);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || visible,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarVisible, {
			"data-state": visible ? "visible" : "hidden",
			...scrollbarProps,
			ref: forwardedRef
		})
	});
}, "ScrollAreaScrollbarAuto"));
var ScrollAreaScrollbarVisible = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarVisible2(props, forwardedRef) {
	const { orientation = Orientation$1.Vertical, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const thumbRef = import_react.useRef(null);
	const pointerOffsetRef = import_react.useRef(0);
	const [sizes, setSizes] = import_react.useState({
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	});
	const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
	const commonProps = {
		...scrollbarProps,
		sizes,
		onSizesChange: setSizes,
		hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
		onThumbChange: /* @__PURE__ */ __name$4((thumb) => thumbRef.current = thumb, "onThumbChange"),
		onThumbPointerUp: /* @__PURE__ */ __name$4(() => pointerOffsetRef.current = 0, "onThumbPointerUp"),
		onThumbPointerDown: /* @__PURE__ */ __name$4((pointerPos) => pointerOffsetRef.current = pointerPos, "onThumbPointerDown")
	};
	function getScrollPosition(pointerPos, dir) {
		return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
	}
	__name$4(getScrollPosition, "getScrollPosition");
	if (orientation === Orientation$1.Horizontal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarX, {
		...commonProps,
		ref: forwardedRef,
		onThumbPositionChange: () => {
			if (context.viewport && thumbRef.current) {
				const scrollPos = context.viewport.scrollLeft;
				const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
				thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
			}
		},
		onWheelScroll: (scrollPos) => {
			if (context.viewport) context.viewport.scrollLeft = scrollPos;
		},
		onDragScroll: (pointerPos) => {
			if (context.viewport) context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
		}
	});
	if (orientation === Orientation$1.Vertical) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarY, {
		...commonProps,
		ref: forwardedRef,
		onThumbPositionChange: () => {
			if (context.viewport && thumbRef.current) {
				const scrollPos = context.viewport.scrollTop;
				const offset = getThumbOffsetFromScroll(scrollPos, sizes);
				thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
			}
		},
		onWheelScroll: (scrollPos) => {
			if (context.viewport) context.viewport.scrollTop = scrollPos;
		},
		onDragScroll: (pointerPos) => {
			if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
		}
	});
	return null;
}, "ScrollAreaScrollbarVisible"));
var ScrollAreaScrollbarX = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarX2(props, forwardedRef) {
	const { sizes, onSizesChange, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const [computedStyle, setComputedStyle] = import_react.useState();
	const ref = import_react.useRef(null);
	const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
	import_react.useEffect(() => {
		if (ref.current) setComputedStyle(getComputedStyle(ref.current));
	}, [ref]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarImpl, {
		"data-orientation": "horizontal",
		...scrollbarProps,
		ref: composeRefs,
		sizes,
		style: {
			bottom: 0,
			left: context.dir === Direction$1.RTL ? "var(--radix-scroll-area-corner-width)" : 0,
			right: context.dir === Direction$1.LTR ? "var(--radix-scroll-area-corner-width)" : 0,
			"--radix-scroll-area-thumb-width": getThumbSize(sizes) + "px",
			...props.style
		},
		onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
		onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
		onWheelScroll: (event, maxScrollPos) => {
			if (context.viewport) {
				const scrollPos = context.viewport.scrollLeft + event.deltaX;
				props.onWheelScroll(scrollPos);
				if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) event.preventDefault();
			}
		},
		onResize: () => {
			if (ref.current && context.viewport && computedStyle) onSizesChange({
				content: context.viewport.scrollWidth,
				viewport: context.viewport.offsetWidth,
				scrollbar: {
					size: ref.current.clientWidth,
					paddingStart: toInt(computedStyle.paddingLeft),
					paddingEnd: toInt(computedStyle.paddingRight)
				}
			});
		}
	});
}, "ScrollAreaScrollbarX"));
var ScrollAreaScrollbarY = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarY2(props, forwardedRef) {
	const { sizes, onSizesChange, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
	const [computedStyle, setComputedStyle] = import_react.useState();
	const ref = import_react.useRef(null);
	const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
	import_react.useEffect(() => {
		if (ref.current) setComputedStyle(getComputedStyle(ref.current));
	}, [ref]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbarImpl, {
		"data-orientation": "vertical",
		...scrollbarProps,
		ref: composeRefs,
		sizes,
		style: {
			top: 0,
			right: context.dir === Direction$1.LTR ? 0 : void 0,
			left: context.dir === Direction$1.RTL ? 0 : void 0,
			bottom: "var(--radix-scroll-area-corner-height)",
			"--radix-scroll-area-thumb-height": getThumbSize(sizes) + "px",
			...props.style
		},
		onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
		onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
		onWheelScroll: (event, maxScrollPos) => {
			if (context.viewport) {
				const scrollPos = context.viewport.scrollTop + event.deltaY;
				props.onWheelScroll(scrollPos);
				if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) event.preventDefault();
			}
		},
		onResize: () => {
			if (ref.current && context.viewport && computedStyle) onSizesChange({
				content: context.viewport.scrollHeight,
				viewport: context.viewport.offsetHeight,
				scrollbar: {
					size: ref.current.clientHeight,
					paddingStart: toInt(computedStyle.paddingTop),
					paddingEnd: toInt(computedStyle.paddingBottom)
				}
			});
		}
	});
}, "ScrollAreaScrollbarY"));
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaScrollbarImpl2(props, forwardedRef) {
	const { __scopeScrollArea, sizes, hasThumb, onThumbChange, onThumbPointerUp, onThumbPointerDown, onThumbPositionChange, onDragScroll, onWheelScroll, onResize, ...scrollbarProps } = props;
	const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
	const [scrollbar, setScrollbar] = import_react.useState(null);
	const composeRefs = useComposedRefs(forwardedRef, setScrollbar);
	const rectRef = import_react.useRef(null);
	const prevWebkitUserSelectRef = import_react.useRef("");
	const viewport = context.viewport;
	const maxScrollPos = sizes.content - sizes.viewport;
	const handleWheelScroll = useCallbackRef$1(onWheelScroll);
	const handleThumbPositionChange = useCallbackRef$1(onThumbPositionChange);
	const handleResize = useDebounceCallback(onResize, 10);
	function handleDragScroll(event) {
		if (rectRef.current) {
			const x = event.clientX - rectRef.current.left;
			const y = event.clientY - rectRef.current.top;
			onDragScroll({
				x,
				y
			});
		}
	}
	__name$4(handleDragScroll, "handleDragScroll");
	import_react.useEffect(() => {
		const handleWheel = /* @__PURE__ */ __name$4((event) => {
			const element = event.target;
			if (scrollbar?.contains(element)) handleWheelScroll(event, maxScrollPos);
		}, "handleWheel");
		document.addEventListener("wheel", handleWheel, { passive: false });
		return () => document.removeEventListener("wheel", handleWheel, { passive: false });
	}, [
		viewport,
		scrollbar,
		maxScrollPos,
		handleWheelScroll
	]);
	import_react.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
	useResizeObserver(scrollbar, handleResize);
	useResizeObserver(context.content, handleResize);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollbarProvider, {
		scope: __scopeScrollArea,
		scrollbar,
		hasThumb,
		onThumbChange: useCallbackRef$1(onThumbChange),
		onThumbPointerUp: useCallbackRef$1(onThumbPointerUp),
		onThumbPositionChange: handleThumbPositionChange,
		onThumbPointerDown: useCallbackRef$1(onThumbPointerDown),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			...scrollbarProps,
			ref: composeRefs,
			style: {
				position: "absolute",
				...scrollbarProps.style
			},
			onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
				if (event.button === 0) {
					event.target.setPointerCapture(event.pointerId);
					rectRef.current = scrollbar.getBoundingClientRect();
					prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
					document.body.style.webkitUserSelect = "none";
					if (context.viewport) context.viewport.style.scrollBehavior = "auto";
					handleDragScroll(event);
				}
			}),
			onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
			onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
				const element = event.target;
				if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
				document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
				if (context.viewport) context.viewport.style.scrollBehavior = "";
				rectRef.current = null;
			})
		})
	});
}, "ScrollAreaScrollbarImpl"));
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaThumb2(props, forwardedRef) {
	const { forceMount, ...thumbProps } = props;
	const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || scrollbarContext.hasThumb,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumbImpl, {
			ref: forwardedRef,
			...thumbProps
		})
	});
}, "ScrollAreaThumb"));
var ScrollAreaThumbImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaThumbImpl2(props, forwardedRef) {
	const { __scopeScrollArea, style, ...thumbProps } = props;
	const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
	const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
	const { onThumbPositionChange } = scrollbarContext;
	const composedRef = useComposedRefs(forwardedRef, scrollbarContext.onThumbChange);
	const removeUnlinkedScrollListenerRef = import_react.useRef(void 0);
	const debounceScrollEnd = useDebounceCallback(() => {
		if (removeUnlinkedScrollListenerRef.current) {
			removeUnlinkedScrollListenerRef.current();
			removeUnlinkedScrollListenerRef.current = void 0;
		}
	}, 100);
	import_react.useEffect(() => {
		const viewport = scrollAreaContext.viewport;
		if (viewport) {
			const handleScroll = /* @__PURE__ */ __name$4(() => {
				debounceScrollEnd();
				if (!removeUnlinkedScrollListenerRef.current) {
					const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
					removeUnlinkedScrollListenerRef.current = listener;
					onThumbPositionChange();
				}
			}, "handleScroll");
			onThumbPositionChange();
			viewport.addEventListener("scroll", handleScroll);
			return () => viewport.removeEventListener("scroll", handleScroll);
		}
	}, [
		scrollAreaContext.viewport,
		debounceScrollEnd,
		onThumbPositionChange
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
		...thumbProps,
		ref: composedRef,
		style: {
			width: "var(--radix-scroll-area-thumb-width)",
			height: "var(--radix-scroll-area-thumb-height)",
			...style
		},
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
			const thumbRect = event.target.getBoundingClientRect();
			const x = event.clientX - thumbRect.left;
			const y = event.clientY - thumbRect.top;
			scrollbarContext.onThumbPointerDown({
				x,
				y
			});
		}),
		onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
	});
}, "ScrollAreaThumbImpl"));
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaCorner2(props, forwardedRef) {
	const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
	const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
	return context.type !== ScrollAreaType.Scroll && hasBothScrollbarsVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCornerImpl, {
		...props,
		ref: forwardedRef
	}) : null;
}, "ScrollAreaCorner"));
var ScrollAreaCornerImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function ScrollAreaCornerImpl2(props, forwardedRef) {
	const { __scopeScrollArea, ...cornerProps } = props;
	const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
	const [width, setWidth] = import_react.useState(0);
	const [height, setHeight] = import_react.useState(0);
	const hasSize = Boolean(width && height);
	const { onCornerWidthChange, onCornerHeightChange } = context;
	useResizeObserver(context.scrollbarX, () => {
		const height2 = context.scrollbarX?.offsetHeight || 0;
		context.onCornerHeightChange(height2);
		setHeight(height2);
	});
	useResizeObserver(context.scrollbarY, () => {
		const width2 = context.scrollbarY?.offsetWidth || 0;
		context.onCornerWidthChange(width2);
		setWidth(width2);
	});
	import_react.useEffect(() => {
		return () => {
			onCornerWidthChange(0);
			onCornerHeightChange(0);
		};
	}, [onCornerWidthChange, onCornerHeightChange]);
	return hasSize ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...cornerProps,
		ref: forwardedRef,
		style: {
			width,
			height,
			position: "absolute",
			right: context.dir === Direction$1.LTR ? 0 : void 0,
			left: context.dir === Direction$1.RTL ? 0 : void 0,
			bottom: 0,
			...props.style
		}
	}) : null;
}, "ScrollAreaCornerImpl"));
function toInt(value) {
	return value ? parseInt(value, 10) : 0;
}
__name$4(toInt, "toInt");
function getThumbRatio(viewportSize, contentSize) {
	const ratio = viewportSize / contentSize;
	return isNaN(ratio) ? 0 : ratio;
}
__name$4(getThumbRatio, "getThumbRatio");
function getThumbSize(sizes) {
	const ratio = getThumbRatio(sizes.viewport, sizes.content);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
	return Math.max(thumbSize, 18);
}
__name$4(getThumbSize, "getThumbSize");
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = Direction$1.LTR) {
	const thumbSizePx = getThumbSize(sizes);
	const thumbCenter = thumbSizePx / 2;
	const offset = pointerOffset || thumbCenter;
	const thumbOffsetFromEnd = thumbSizePx - offset;
	const minPointerPos = sizes.scrollbar.paddingStart + offset;
	const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
	const maxScrollPos = sizes.content - sizes.viewport;
	const scrollRange = dir === Direction$1.LTR ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	return linearScale([minPointerPos, maxPointerPos], scrollRange)(pointerPos);
}
__name$4(getScrollPositionFromPointer, "getScrollPositionFromPointer");
function getThumbOffsetFromScroll(scrollPos, sizes, dir = Direction$1.LTR) {
	const thumbSizePx = getThumbSize(sizes);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const scrollbar = sizes.scrollbar.size - scrollbarPadding;
	const maxScrollPos = sizes.content - sizes.viewport;
	const maxThumbPos = scrollbar - thumbSizePx;
	const scrollWithoutMomentum = clamp$1(scrollPos, dir === Direction$1.LTR ? [0, maxScrollPos] : [maxScrollPos * -1, 0]);
	return linearScale([0, maxScrollPos], [0, maxThumbPos])(scrollWithoutMomentum);
}
__name$4(getThumbOffsetFromScroll, "getThumbOffsetFromScroll");
function linearScale(input, output) {
	return (value) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}
__name$4(linearScale, "linearScale");
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
	return scrollPos > 0 && scrollPos < maxScrollPos;
}
__name$4(isScrollingWithinScrollbarBounds, "isScrollingWithinScrollbarBounds");
var addUnlinkedScrollListener = /* @__PURE__ */ __name$4((node, handler = () => {}) => {
	let prevPosition = {
		left: node.scrollLeft,
		top: node.scrollTop
	};
	let rAF = 0;
	function loop() {
		const position = {
			left: node.scrollLeft,
			top: node.scrollTop
		};
		const isHorizontalScroll = prevPosition.left !== position.left;
		const isVerticalScroll = prevPosition.top !== position.top;
		if (isHorizontalScroll || isVerticalScroll) handler();
		prevPosition = position;
		rAF = window.requestAnimationFrame(loop);
	}
	__name$4(loop, "loop");
	loop();
	return () => window.cancelAnimationFrame(rAF);
}, "addUnlinkedScrollListener");
function useDebounceCallback(callback, delay) {
	const handleCallback = useCallbackRef$1(callback);
	const debounceTimerRef = import_react.useRef(0);
	import_react.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
	return import_react.useCallback(() => {
		window.clearTimeout(debounceTimerRef.current);
		debounceTimerRef.current = window.setTimeout(handleCallback, delay);
	}, [handleCallback, delay]);
}
__name$4(useDebounceCallback, "useDebounceCallback");
function useResizeObserver(element, onResize) {
	const handleResize = useCallbackRef$1(onResize);
	useLayoutEffect2(() => {
		let rAF = 0;
		if (element) {
			const resizeObserver = new ResizeObserver(() => {
				cancelAnimationFrame(rAF);
				rAF = window.requestAnimationFrame(handleResize);
			});
			resizeObserver.observe(element);
			return () => {
				window.cancelAnimationFrame(rAF);
				resizeObserver.unobserve(element);
			};
		}
	}, [element, handleResize]);
}
__name$4(useResizeObserver, "useResizeObserver");
var base_exports = /* @__PURE__ */ __exportAll({
	SidebarCollapseTrigger: () => SidebarCollapseTrigger$1,
	SidebarContent: () => SidebarContent$1,
	SidebarDrawerContent: () => SidebarDrawerContent,
	SidebarDrawerOverlay: () => SidebarDrawerOverlay,
	SidebarFolder: () => SidebarFolder$1,
	SidebarFolderContent: () => SidebarFolderContent$1,
	SidebarFolderLink: () => SidebarFolderLink$1,
	SidebarFolderTrigger: () => SidebarFolderTrigger$1,
	SidebarItem: () => SidebarItem$1,
	SidebarProvider: () => SidebarProvider$1,
	SidebarSeparator: () => SidebarSeparator$1,
	SidebarTrigger: () => SidebarTrigger$1,
	SidebarViewport: () => SidebarViewport,
	useAutoScroll: () => useAutoScroll,
	useFolder: () => useFolder,
	useFolderDepth: () => useFolderDepth,
	useSidebar: () => useSidebar$1
});
var SidebarContext = (0, import_react.createContext)(null);
var FolderContext = (0, import_react.createContext)(null);
function SidebarProvider$1({ defaultOpenLevel = 0, prefetch, collapsible = true, children }) {
	const closeOnRedirect = (0, import_react.useRef)(true);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const pathname = usePathname();
	const mode = useMediaQuery("(width < 768px)") ? "drawer" : "full";
	useOnChange(pathname, () => {
		if (closeOnRedirect.current) setOpen(false);
		closeOnRedirect.current = true;
	});
	useHotKey((e) => {
		if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey || e.key !== "b") return;
		e.preventDefault();
		setCollapsed((prev) => !prev);
	}, {
		enabled: collapsible && mode === "full",
		ignoreTyping: true
	});
	useHotKey((e) => {
		if (e.key !== "Escape") return;
		e.preventDefault();
		setOpen(false);
	}, {
		enabled: open && mode === "drawer",
		ignoreTyping: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContext, {
		value: (0, import_react.useMemo)(() => ({
			open,
			setOpen,
			collapsed,
			setCollapsed,
			closeOnRedirect,
			defaultOpenLevel,
			prefetch,
			mode
		}), [
			open,
			collapsed,
			defaultOpenLevel,
			prefetch,
			mode
		]),
		children
	});
}
function useSidebar$1() {
	const ctx = (0, import_react.use)(SidebarContext);
	if (!ctx) throw new Error("Missing SidebarContext, make sure you have wrapped the component in <DocsLayout /> and the context is available.");
	return ctx;
}
function useFolder() {
	return (0, import_react.use)(FolderContext);
}
function useFolderDepth() {
	return (0, import_react.use)(FolderContext)?.depth ?? 0;
}
function SidebarContent$1({ mode: allowedMode = "full", children }) {
	const { collapsed, mode } = useSidebar$1();
	const [hover, setHover] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(0);
	useOnChange(collapsed, () => {
		if (collapsed) setHover(false);
	});
	if (allowedMode !== true && allowedMode !== mode) return;
	function shouldIgnoreHover(e) {
		const element = ref.current;
		if (!element) return true;
		return !collapsed || e.pointerType === "touch" || element.getAnimations().length > 0;
	}
	return children({
		ref,
		collapsed,
		hovered: hover,
		onPointerEnter(e) {
			if (shouldIgnoreHover(e)) return;
			window.clearTimeout(timerRef.current);
			setHover(true);
		},
		onPointerLeave(e) {
			if (shouldIgnoreHover(e)) return;
			window.clearTimeout(timerRef.current);
			timerRef.current = window.setTimeout(() => setHover(false), Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100 ? 0 : 500);
		}
	});
}
function SidebarViewport({ area, viewport, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea, {
		type: "scroll",
		...area,
		className: cn("overflow-hidden min-h-0 flex-1", area?.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewport, {
				...viewport,
				className: cn("size-full rounded-[inherit] *:flex! *:flex-col! *:gap-0.5! p-4 overscroll-contain mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]", viewport?.className),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCorner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
				className: "flex h-full w-1.5 select-none data-[state=hidden]:animate-fd-fade-out",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-fd-border" })
			})
		]
	});
}
function SidebarDrawerOverlay(props) {
	const { open, setOpen, mode } = useSidebar$1();
	if (mode !== "drawer") return;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-state": open ? "open" : "closed",
			onClick: () => setOpen(false),
			...props
		})
	});
}
function SidebarDrawerContent({ className, children, ...props }) {
	const { open, mode } = useSidebar$1();
	const state = open ? "open" : "closed";
	const returnFocusRef = (0, import_react.useRef)(null);
	if (mode !== "drawer") return;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: open,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			id: "nd-sidebar-mobile",
			"data-state": state,
			className: cn(!present && "invisible", className),
			onFocus: (e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) returnFocusRef.current = e.relatedTarget instanceof HTMLElement ? e.relatedTarget : null;
			},
			onAnimationEnd: (e) => {
				if (!open && e.currentTarget.contains(document.activeElement)) returnFocusRef.current?.focus();
			},
			...props,
			children
		})
	});
}
function SidebarSeparator$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { ...props });
}
function SidebarItem$1({ icon, active = false, children, ...props }) {
	const ref = (0, import_react.useRef)(null);
	const { prefetch } = useSidebar$1();
	useAutoScroll(active, ref);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$2, {
		ref,
		"data-active": active,
		prefetch,
		...props,
		children: [icon ?? (props.external ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, {}) : null), children]
	});
}
function SidebarFolder$1({ defaultOpen: defaultOpenProp, collapsible = true, active = false, children, ...props }) {
	const { defaultOpenLevel } = useSidebar$1();
	const depth = useFolderDepth() + 1;
	const defaultOpen = collapsible === false || active || (defaultOpenProp ?? defaultOpenLevel >= depth);
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	useOnChange(defaultOpen, (v) => {
		if (v) setOpen(v);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
		open,
		onOpenChange: setOpen,
		disabled: !collapsible,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderContext, {
			value: (0, import_react.useMemo)(() => ({
				open,
				setOpen,
				depth,
				collapsible
			}), [
				collapsible,
				depth,
				open
			]),
			children
		})
	});
}
function SidebarFolderTrigger$1({ children, ...props }) {
	const { open, collapsible } = (0, import_react.use)(FolderContext);
	if (collapsible) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleTrigger, {
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, {
			"data-icon": true,
			className: cn("ms-auto transition-transform", !open && "-rotate-90 rtl:rotate-90")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		children
	});
}
function SidebarFolderLink$1({ children, active = false, ...props }) {
	const ref = (0, import_react.useRef)(null);
	const { open, setOpen, collapsible } = (0, import_react.use)(FolderContext);
	const { prefetch } = useSidebar$1();
	useAutoScroll(active, ref);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$2, {
		ref,
		"data-active": active,
		onClick: (e) => {
			if (!collapsible) return;
			if (e.target instanceof Element && e.target.matches("[data-icon], [data-icon] *")) {
				setOpen(!open);
				e.preventDefault();
			} else setOpen(active ? !open : true);
		},
		prefetch,
		...props,
		children: [children, collapsible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, {
			"data-icon": true,
			className: cn("ms-auto transition-transform", !open && "-rotate-90 rtl:rotate-90")
		})]
	});
}
function SidebarFolderContent$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
		...props,
		children: props.children
	});
}
function SidebarTrigger$1({ children, ...props }) {
	const { open, setOpen } = useSidebar$1();
	const t = useTranslations({ note: "sidebar" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": open ? t("Close Sidebar", { note: "aria-label" }) : t("Open Sidebar", { note: "aria-label" }),
		"aria-expanded": open,
		"aria-controls": "nd-sidebar-mobile",
		onClick: () => setOpen((prev) => !prev),
		...props,
		children
	});
}
function SidebarCollapseTrigger$1(props) {
	const { collapsed, setCollapsed } = useSidebar$1();
	const t = useTranslations({ note: "sidebar" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": t("Collapse Sidebar", { note: "aria-label" }),
		"aria-controls": "nd-sidebar",
		"aria-expanded": !collapsed,
		"data-collapsed": collapsed,
		onClick: (e) => {
			const button = e.currentTarget;
			(0, import_react_dom.flushSync)(() => setCollapsed((prev) => !prev));
			if (button.matches("[inert] *")) document.querySelector("[aria-controls=\"nd-sidebar\"]:not([inert] *)")?.focus();
		},
		...props,
		children: props.children
	});
}
/**
* scroll to the element if `active` is true
*/
function useAutoScroll(active, ref) {
	const { mode } = useSidebar$1();
	(0, import_react.useEffect)(() => {
		if (active && ref.current) e(ref.current, {
			boundary: document.getElementById(mode === "drawer" ? "nd-sidebar-mobile" : "nd-sidebar"),
			scrollMode: "if-needed"
		});
	}, [
		active,
		mode,
		ref
	]);
}
var RendererContext = (0, import_react.createContext)(null);
function createPageTreeRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarSeparator, SidebarItem }) {
	function renderList(nodes) {
		return nodes.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTreeNode, { node }, i));
	}
	function PageTreeNode({ node }) {
		const { Separator, Item, Folder, pathname } = (0, import_react.use)(RendererContext);
		if (node.type === "separator") {
			if (Separator) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { item: node });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarSeparator, { children: [node.icon, node.name] });
		}
		if (node.type === "folder") {
			const path = useTreePath();
			if (Folder) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
				item: node,
				children: renderList(node.children)
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolder, {
				collapsible: node.collapsible,
				active: path.includes(node),
				defaultOpen: node.defaultOpen,
				children: [node.index ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolderLink, {
					href: node.index.url,
					active: isActive(node.index.url, pathname),
					external: node.index.external,
					children: [node.icon, node.name]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolderTrigger, { children: [node.icon, node.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolderContent, { children: renderList(node.children) })]
			});
		}
		if (Item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, { item: node });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarItem, {
			href: node.url,
			external: node.external,
			active: isActive(node.url, pathname),
			icon: node.icon,
			children: node.name
		});
	}
	/**
	* Render sidebar items from page tree
	*/
	return function SidebarPageTree(components) {
		const { Folder, Item, Separator } = components;
		const { root } = useTreeContext();
		const pathname = usePathname();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RendererContext, {
			value: (0, import_react.useMemo)(() => ({
				Folder,
				Item,
				Separator,
				pathname
			}), [
				Folder,
				Item,
				Separator,
				pathname
			]),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: renderList(root.children) }, root.$id)
		});
	};
}
function createLinkItemRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarItem }) {
	/**
	* Render sidebar items from page tree
	*/
	return function SidebarLinkItem({ item, ...props }) {
		const active = isLinkItemActive(item, usePathname());
		if (item.type === "custom") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			...props,
			children: item.children
		});
		if (item.type === "menu") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolder, {
			...props,
			children: [item.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolderLink, {
				href: item.url,
				active,
				external: item.external,
				children: [item.icon, item.text]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarFolderTrigger, { children: [item.icon, item.text] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolderContent, { children: item.items.map((child, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLinkItem, { item: child }, i)) })]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarItem, {
			href: item.url,
			icon: item.icon,
			external: item.external,
			active,
			...props,
			children: item.text
		});
	};
}
/**
* Renders the given tabs as a dropdown per tabs group, one for each root folder on the
* current page's path, letting users switch between root folders of the same type.
*/
function SidebarTabsDropdown({ options, placeholder, ...props }) {
	return useTabsGroups(options).map((group, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dropdown, {
		options: group.options,
		placeholder,
		...props
	}, i));
}
function Dropdown({ options, placeholder, ...props }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { closeOnRedirect } = useSidebar$1();
	const pathname = usePathname();
	const selected = (0, import_react.useMemo)(() => {
		return options.findLast((item) => isLayoutTabActive(item, pathname));
	}, [options, pathname]);
	const onClick = () => {
		closeOnRedirect.current = false;
		setOpen(false);
	};
	const item = selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "size-9 shrink-0 empty:hidden md:size-5",
		children: selected.icon
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm font-medium",
		children: selected.title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-fd-muted-foreground empty:hidden md:hidden",
		children: selected.description
	})] })] }) : placeholder;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [item && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverTrigger, {
			...props,
			className: cn("flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground", props.className),
			children: [item, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronsUpDown, { className: "shrink-0 ms-auto size-4 text-fd-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			className: "flex flex-col gap-1 w-(--radix-popover-trigger-width) p-1 fd-scroll-container",
			children: options.map((item) => {
				const isActive = selected && item.url === selected.url;
				if (!isActive && item.unlisted) return;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$2, {
					href: item.url,
					onClick,
					...item.props,
					className: cn("flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground", item.props?.className),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 size-9 md:mb-auto md:size-5 empty:hidden",
							children: item.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium leading-none",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden",
							children: item.description
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { className: cn("shrink-0 ms-auto size-3.5 text-fd-primary", !isActive && "invisible") })
					]
				}, item.url);
			})
		})]
	});
}
var itemVariants = cva("relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0", { variants: {
	variant: {
		link: "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors",
		button: "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none"
	},
	highlight: { true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5" }
} });
var { useSidebar } = base_exports;
function SidebarProvider(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider$1, { ...props });
}
function Sidebar$1({ footer, banner, collapsible = true, components, ...rest }) {
	const { menuItems, slots, props: { tabs, nav, tabMode } } = useDocsLayout();
	const iconLinks = menuItems.filter((item) => item.type === "icon");
	const viewport = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarViewport, { children: [menuItems.filter((v) => v.type !== "icon").map((item, i, list) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLinkItem, {
		item,
		className: cn(i === list.length - 1 && "mb-4")
	}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarPageTree, { ...components })] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarContent, {
		...rest,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 p-4 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex",
						children: [
							slots.navTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.navTitle, { className: "inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto" }),
							nav?.children,
							collapsible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarCollapseTrigger, {
								className: cn(buttonVariants({
									variant: "ghost",
									size: "icon-sm",
									className: "mb-auto text-fd-muted-foreground"
								})),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SidebarIcon, {})
							})
						]
					}),
					slots.searchTrigger && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.searchTrigger.full, { hideIfDisabled: true }),
					tabs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTabsDropdown, { options: tabMode === "auto" ? tabs : tabs.filter((tab) => typeof tab.$folder?.root === "string") }),
					banner
				]
			}),
			viewport,
			(slots.languageSelect || iconLinks.length > 0 || slots.themeSwitch || footer) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col p-4 pt-2",
				children: [
					slots.languageSelect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(slots.languageSelect.root, {
						variant: "secondary",
						className: "text-fd-muted-foreground text-start justify-start bg-fd-secondary/50 mb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Languages, { className: "size-4.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.languageSelect.text, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { className: "ms-auto size-3.5" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex text-fd-muted-foreground items-center border bg-fd-secondary/50 p-0.5 pe-0 rounded-lg empty:hidden",
						children: [iconLinks.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkItem, {
							item,
							className: cn(buttonVariants({
								size: "icon-sm",
								variant: "ghost"
							})),
							"aria-label": item.label,
							children: item.icon
						}, i)), slots.themeSwitch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.themeSwitch, { className: "px-1 py-0 border-y-0 border-e-0 rounded-none ms-auto *:rounded-md" })]
					}),
					footer
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarDrawer, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 p-4 pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex text-fd-muted-foreground items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-1",
							children: iconLinks.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkItem, {
								item,
								className: cn(buttonVariants({
									size: "icon-sm",
									variant: "ghost",
									className: "p-2"
								})),
								"aria-label": item.label,
								children: item.icon
							}, i))
						}),
						slots.languageSelect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(slots.languageSelect.root, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Languages, { className: "size-4.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.languageSelect.text, {})] }),
						slots.themeSwitch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.themeSwitch, { className: "p-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, {
							className: cn(buttonVariants({
								variant: "ghost",
								size: "icon-sm",
								className: "p-2"
							})),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SidebarIcon, {})
						})
					]
				}),
				tabs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTabsDropdown, { options: tabs }),
				banner
			]
		}),
		viewport,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col border-t p-4 pt-2 empty:hidden",
			children: footer
		})
	] })] });
}
function SidebarFolder(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolder$1, { ...props });
}
function SidebarCollapseTrigger(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarCollapseTrigger$1, { ...props });
}
function SidebarTrigger(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger$1, { ...props });
}
function SidebarContent({ ref: refProp, className, children, ...props }) {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent$1, { children: ({ collapsed, hovered, ref: asideRef, ...rest }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-sidebar-placeholder": "",
		className: "sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:268px] max-md:hidden",
		children: [collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-s-0 inset-y-0 w-4",
			...rest
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			id: "nd-sidebar",
			ref: mergeRefs$1(ref, refProp, asideRef),
			"data-collapsed": collapsed,
			"data-hovered": collapsed && hovered,
			inert: collapsed && !hovered,
			className: cn("absolute flex flex-col w-full inset-s-0 inset-y-0 items-end bg-fd-card text-sm border-e duration-250 *:w-(--fd-sidebar-width)", collapsed && ["inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)", hovered ? "shadow-lg translate-x-2 rtl:-translate-x-2" : "-translate-x-(--fd-sidebar-width) rtl:translate-x-full"], ref.current && ref.current.getAttribute("data-collapsed") === "true" !== collapsed && "transition-[width,inset-block,translate,background-color]", className),
			...props,
			...rest,
			children
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-sidebar-panel": "",
		className: cn("fixed flex top-[calc(--spacing(4)+var(--fd-docs-row-3))] inset-s-4 shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10", (!collapsed || hovered) && "pointer-events-none opacity-0"),
		inert: !collapsed || hovered,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarCollapseTrigger$1, {
			className: cn(buttonVariants({
				variant: "ghost",
				size: "icon-sm",
				className: "rounded-lg"
			})),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SidebarIcon, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchTrigger, {
			className: "rounded-lg",
			hideIfDisabled: true
		})]
	})] }) });
}
function SidebarDrawer({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarDrawerOverlay, { className: "fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarDrawerContent, {
		className: cn("fixed text-[0.9375rem] flex flex-col shadow-lg border-s inset-e-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out", className),
		...props,
		children
	})] });
}
function SidebarSeparator({ className, style, children, ...props }) {
	const depth = useFolderDepth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarSeparator$1, {
		className: cn("inline-flex items-center gap-2 mb-1 px-2 mt-6 empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0", depth === 0 && "first:mt-0", className),
		style: {
			paddingInlineStart: getItemOffset$3(depth),
			...style
		},
		...props,
		children
	});
}
function SidebarItem({ className, style, children, ...props }) {
	const depth = useFolderDepth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarItem$1, {
		className: cn(itemVariants({
			variant: "link",
			highlight: depth >= 1
		}), className),
		style: {
			paddingInlineStart: getItemOffset$3(depth),
			...style
		},
		...props,
		children
	});
}
function SidebarFolderTrigger({ className, style, ...props }) {
	const { depth, collapsible } = useFolder();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolderTrigger$1, {
		className: cn(itemVariants({ variant: collapsible ? "button" : null }), "w-full", className),
		style: {
			paddingInlineStart: getItemOffset$3(depth - 1),
			...style
		},
		...props,
		children: props.children
	});
}
function SidebarFolderLink({ className, style, ...props }) {
	const depth = useFolderDepth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolderLink$1, {
		className: cn(itemVariants({
			variant: "link",
			highlight: depth > 1
		}), "w-full", className),
		style: {
			paddingInlineStart: getItemOffset$3(depth - 1),
			...style
		},
		...props,
		children: props.children
	});
}
function SidebarFolderContent({ className, children, ...props }) {
	const depth = useFolderDepth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFolderContent$1, {
		className: cn("relative", depth === 1 && "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-0.5 pt-0.5",
			children
		})
	});
}
function getItemOffset$3(depth) {
	return `calc(${2 + 3 * depth} * var(--spacing))`;
}
var SidebarPageTree = createPageTreeRenderer({
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarItem,
	SidebarSeparator
});
var SidebarLinkItem = createLinkItemRenderer({
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarItem
});
function Header(props) {
	const { isNavTransparent, slots, props: { nav } } = useDocsLayout();
	if (nav?.component) return nav.component;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		id: "nd-subnav",
		"data-transparent": isNavTransparent,
		...props,
		className: cn("[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80", props.className),
		children: [
			slots.navTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-semibold" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: nav?.children
			}),
			slots.searchTrigger && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.searchTrigger.sm, {
				hideIfDisabled: true,
				className: "p-2"
			}),
			slots.sidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.sidebar.trigger, {
				className: cn(buttonVariants({
					variant: "ghost",
					size: "icon-sm",
					className: "p-2"
				})),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SidebarIcon, {})
			})
		]
	});
}
function Container$1(props) {
	const { slots } = useDocsLayout();
	const { collapsed } = slots.sidebar.useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "nd-docs-layout",
		"data-sidebar-collapsed": collapsed,
		...props,
		style: {
			gridTemplate: `"sidebar sidebar header toc toc"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar tabs toc toc"
"sidebar sidebar main toc toc" 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) minmax(min-content, 1fr)`,
			"--fd-docs-row-1": "var(--fd-banner-height, 0px)",
			"--fd-docs-row-2": "calc(var(--fd-docs-row-1) + var(--fd-header-height))",
			"--fd-docs-row-3": "calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))",
			"--fd-sidebar-col": collapsed ? "0px" : "var(--fd-sidebar-width)",
			...props.style
		},
		className: cn("grid overflow-x-clip min-h-(--fd-docs-height) [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px] transition-[--fd-sidebar-col]", props.className),
		children: props.children
	});
}
var { useBaseSlots } = baseSlots({ useProps() {
	return useDocsLayout().props;
} });
var LayoutContext = (0, import_react.createContext)(null);
function useDocsLayout() {
	const context = (0, import_react.use)(LayoutContext);
	if (!context) throw new Error("Please use <DocsPage /> (`fumadocs-ui/layouts/docs/page`) under <DocsLayout /> (`fumadocs-ui/layouts/docs`).");
	return context;
}
function LayoutBody(props) {
	const { nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = "none" } = {}, sidebar: { enabled: sidebarEnabled = true, defaultOpenLevel, prefetch, ...sidebarProps } = {}, slots: defaultSlots, tabs, tabMode = "auto", tree, containerProps, aiChat, children } = props;
	const isTop = useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
	const isNavTransparent = navTransparentMode === "top" ? isTop : navTransparentMode === "always";
	const { baseSlots, baseProps } = useBaseSlots(props);
	const linkItems = useLinkItems(props);
	const slots = {
		...baseSlots,
		header: defaultSlots?.header ?? Header,
		container: defaultSlots?.container ?? Container$1,
		sidebar: defaultSlots?.sidebar ?? {
			provider: SidebarProvider,
			root: Sidebar$1,
			trigger: SidebarTrigger,
			useSidebar
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeContextProvider, {
		tree,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutContext, {
			value: {
				props: {
					tabMode,
					tabs,
					aiChat,
					...baseProps
				},
				isNavTransparent,
				slots,
				...linkItems
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.sidebar.provider, {
				defaultOpenLevel,
				prefetch,
				collapsible: sidebarEnabled && sidebarProps.collapsible,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(slots.container, {
					...containerProps,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipToContent, {}),
						navEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.header, {}),
						sidebarEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.sidebar.root, { ...sidebarProps }),
						tabMode === "top" && tabs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutTabs, {
							tabs,
							className: "z-10 bg-fd-background border-b px-6 pt-3 xl:px-8 max-md:hidden"
						}),
						children,
						aiChat?.panel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatPanel, {
							open: aiChat.open,
							className: "[grid-area:toc] justify-self-end xl:sticky xl:top-(--fd-docs-row-1) xl:h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] xl:border-s",
							children: aiChat.panel
						}),
						aiChat?.trigger && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatTrigger, { ...aiChat })
					]
				})
			})
		})
	});
}
function LayoutTabs({ tabs: allTabs, ...props }) {
	const pathname = usePathname();
	const group = useTabsGroups(allTabs).findLast((group) => typeof group.active?.root !== "string");
	const selected = (0, import_react.useMemo)(() => {
		return group?.options.findLast((option) => isLayoutTabActive(option, pathname));
	}, [group, pathname]);
	if (!group) return;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("flex flex-row items-end gap-6 overflow-auto [grid-area:tabs]", props.className),
		children: group.options.map((tab, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$2, {
			href: tab.url,
			className: cn("inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground", tab.unlisted && selected !== tab && "hidden", selected === tab && "border-fd-primary text-fd-primary"),
			children: tab.title
		}, i))
	});
}
function DocsLayout({ tree, sidebar: { tabs: _tabs, tabMode: _tabMode, ...sidebarProps } = {}, tabs: layoutTabs = _tabs, tabMode = _tabMode, children, ...props }) {
	const tabs = (0, import_react.useMemo)(() => {
		if (Array.isArray(layoutTabs)) return layoutTabs;
		if (typeof layoutTabs === "object") return getLayoutTabs(tree, layoutTabs);
		if (layoutTabs !== false) return getLayoutTabs(tree);
		return [];
	}, [tree, layoutTabs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutBody, {
		tree,
		tabs,
		tabMode,
		sidebar: sidebarProps,
		...props,
		children
	});
}
var toc_exports = /* @__PURE__ */ __exportAll$1({
	AnchorProvider: () => AnchorProvider,
	ScrollProvider: () => ScrollProvider,
	TOCItem: () => TOCItem$3,
	useActiveAnchor: () => useActiveAnchor$1,
	useActiveAnchors: () => useActiveAnchors$1,
	useItems: () => useItems$1,
	useTOC: () => useTOC,
	useTOCListener: () => useTOCListener,
	useTOCSelector: () => useTOCSelector
});
function mergeRefs(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref != null) ref.current = value;
		});
	};
}
var ObserverContext = (0, import_react.createContext)(null);
var ScrollContext = (0, import_react.createContext)(null);
/** Optional: add auto-scroll to TOC items. */
function ScrollProvider({ containerRef, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollContext, {
		value: containerRef,
		children
	});
}
function AnchorProvider({ toc, single = false, children }) {
	const observer = (0, import_react.useMemo)(() => new Observer(toc, single), [toc, single]);
	(0, import_react.useEffect)(() => {
		observer.watch();
		return () => observer.unwatch();
	}, [observer]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObserverContext, {
		value: observer,
		children
	});
}
function TOCItem$3({ ref, onActiveChange, onClick, autoScroll = true, ...props }) {
	const id = props.href ? getItemId(props.href) : null;
	const containerRef = (0, import_react.use)(ScrollContext);
	const anchorRef = (0, import_react.useRef)(null);
	const isMountedRef = (0, import_react.useRef)(false);
	const observer = useObserver();
	const active = useObserverValue((observer) => id !== null && observer.activeAnchors.includes(id));
	const prevActiveRef = (0, import_react.useRef)(active);
	if (prevActiveRef.current !== active) {
		prevActiveRef.current = active;
		onActiveChange?.(active);
	}
	(0, import_react.useEffect)(() => {
		if (id === null) return;
		const callback = () => {
			const anchor = anchorRef.current;
			const container = containerRef?.current;
			if (autoScroll && observer.activeAnchor === id && anchor && container) e(anchor, {
				behavior: isMountedRef.current ? "smooth" : "instant",
				block: "center",
				inline: "center",
				scrollMode: "always",
				boundary: container
			});
		};
		callback();
		isMountedRef.current = true;
		return observer.subscribe(callback);
	}, [
		autoScroll,
		id,
		observer,
		containerRef
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		ref: mergeRefs(anchorRef, ref),
		"data-active": String(active),
		onClick: (e) => {
			onClick?.(e);
			if (id !== null && !e.defaultPrevented) observer.select(id);
		},
		...props
	});
}
function useObserver() {
	const observer = (0, import_react.use)(ObserverContext);
	if (!observer) throw new Error(`Component must be used under the <AnchorProvider /> component.`);
	return observer;
}
/** subscribe to a value of the observer, it must be stable between updates */
function useObserverValue(get) {
	const observer = useObserver();
	const getSnapshot = () => get(observer);
	return (0, import_react.useSyncExternalStore)(observer.subscribe, getSnapshot, getSnapshot);
}
/** @returns static info object, useful for custom rendering logic */
function useTOC() {
	const observer = useObserver();
	return (0, import_react.useMemo)(() => ({
		get() {
			return observer.items;
		},
		listen: observer.listen.bind(observer),
		unlisten: observer.unlisten.bind(observer)
	}), [observer]);
}
function useTOCListener(listener) {
	const observer = useObserver();
	const callback = (0, import_react.useEffectEvent)(listener);
	(0, import_react.useEffect)(() => observer.subscribe(callback), [observer]);
}
function useTOCSelector(select, isEqual = isEqualShallow) {
	const cache = (0, import_react.useRef)(null);
	return useObserverValue(({ items }) => {
		const prev = cache.current;
		if (prev && prev.items === items && prev.select === select) return prev.value;
		const next = select(items);
		const value = prev && isEqual(prev.value, next) ? prev.value : next;
		cache.current = {
			items,
			select,
			value
		};
		return value;
	});
}
/**
* The current heading ID
*/
function useActiveAnchor$1() {
	return useObserverValue((observer) => observer.activeAnchor);
}
/**
* The id of visible anchors
*/
function useActiveAnchors$1() {
	return useObserverValue((observer) => observer.activeAnchors);
}
function useItems$1() {
	return useObserverValue((observer) => observer.items);
}
function getItemId(url) {
	if (url.startsWith("#")) return url.slice(1);
	return null;
}
/** a heading is in view when this ratio of it is visible */
var VISIBLE_RATIO = .9;
var Observer = class {
	constructor(toc, single) {
		this.single = single;
		this.activeAnchors = [];
		this.observer = null;
		this.visible = /* @__PURE__ */ new Set();
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = (listener) => {
			this.listeners.add(listener);
			return () => {
				this.listeners.delete(listener);
			};
		};
		this.items = [];
		for (const item of toc) {
			const id = getItemId(item.url);
			if (id) this.items.push({
				id,
				active: false,
				fallback: false,
				t: 0,
				original: item
			});
		}
	}
	listen(listener) {
		this.listeners.add(listener);
	}
	unlisten(listener) {
		this.listeners.delete(listener);
	}
	select(id) {
		this.activeAnchor = id;
		this.update();
	}
	watch() {
		if (this.observer) return;
		this.observer = new IntersectionObserver(this.callback.bind(this), { threshold: VISIBLE_RATIO });
		for (const item of this.items) {
			const element = document.getElementById(item.id);
			if (!element) continue;
			this.observer.observe(element);
		}
	}
	unwatch() {
		this.observer?.disconnect();
		this.observer = null;
		this.visible.clear();
	}
	callback(entries) {
		for (const entry of entries) if (entry.intersectionRatio >= VISIBLE_RATIO) this.visible.add(entry.target.id);
		else this.visible.delete(entry.target.id);
		if (this.activeAnchor === void 0 || !this.visible.has(this.activeAnchor)) this.activeAnchor = this.items.find((item) => this.visible.has(item.id))?.id ?? this.findAbove(entries[0].rootBounds);
		this.update();
	}
	/**
	* Measure the last heading above the view, when no heading is in view.
	*
	* Headings can pass the view without intersecting it, so this cannot be tracked from entries.
	*/
	findAbove(root) {
		if (!root) return;
		const center = (root.top + root.bottom) / 2;
		let id;
		for (const item of this.items) {
			const rect = document.getElementById(item.id)?.getBoundingClientRect();
			if (!rect || rect.height === 0) continue;
			if (rect.top >= center) break;
			id = item.id;
		}
		return id;
	}
	update() {
		const activeAnchors = [];
		const t = Date.now();
		this.items = this.items.map((item) => {
			const active = this.single || this.visible.size === 0 ? item.id === this.activeAnchor : this.visible.has(item.id);
			const fallback = active && !this.visible.has(item.id);
			if (active) activeAnchors.push(item.id);
			return item.active === active && item.fallback === fallback ? item : {
				...item,
				active,
				fallback,
				t
			};
		});
		this.activeAnchors = activeAnchors;
		for (const listener of this.listeners) listener(this.items);
	}
};
var TOCContext = (0, import_react.createContext)([]);
function useTOCItems() {
	return (0, import_react.use)(TOCContext);
}
var { useActiveAnchor, useActiveAnchors, useItems } = toc_exports;
function TOCProvider$1({ toc, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCContext, {
		value: toc,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnchorProvider, {
			toc,
			...props,
			children
		})
	});
}
function TOCScrollArea({ ref, className, ...props }) {
	const viewRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: mergeRefs$1(viewRef, ref),
		className: cn("relative min-h-0 text-sm ms-px overflow-auto overscroll-contain [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollProvider, {
			containerRef: viewRef,
			children: props.children
		})
	});
}
var default_exports = /* @__PURE__ */ __exportAll({
	TOCEmpty: () => TOCEmpty$1,
	TOCItem: () => TOCItem$2,
	TOCItems: () => TOCItems$2
});
function TOCItems$2({ className, thumbBox = true, children, ...props }) {
	const items = useTOCItems();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col", className),
		...props,
		children: [items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbTrack$1, {
			items,
			thumbBox
		}), children]
	});
}
function TOCEmpty$1() {
	const t = useTranslations({ note: "table of contents" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground",
		children: t("No Headings")
	});
}
function ThumbTrack$1({ items, thumbBox }) {
	const toc = useTOC();
	const ref = (0, import_react.useCallback)((track) => {
		const container = track.parentElement;
		const svg = track.querySelector("svg");
		const path = svg.querySelector("path");
		const steps = svg.getElementsByTagName("g");
		const thumb = thumbBox ? track.querySelector("div") : null;
		const segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
		const positions = /* @__PURE__ */ new Map();
		let previous;
		const update = (infos) => {
			let start = -1;
			let end = -1;
			for (const [i, info] of infos.entries()) {
				if (!info.active || !positions.has(info.original.url)) continue;
				if (start === -1) start = i;
				end = i;
			}
			if (start === -1) return;
			const first = positions.get(infos[start].original.url);
			const last = positions.get(infos[end].original.url);
			svg.style.clipPath = `polygon(0 ${first.top}px, 100% ${first.top}px, 100% ${last.bottom}px, 0 ${last.bottom}px)`;
			if (!thumb) return;
			const isUp = previous !== void 0 && (previous.start > start || previous.end > end || previous.start === start && previous.end === end && previous.isUp);
			previous = {
				start,
				end,
				isUp
			};
			thumb.style.offsetDistance = `${isUp ? first.offset : last.offset + last.bottom - last.top}px`;
			thumb.style.opacity = infos[isUp ? start : end].original._step === void 0 ? "1" : "0";
		};
		const observer = new ResizeObserver(() => {
			if (container.clientHeight === 0) return;
			const anchors = /* @__PURE__ */ new Map();
			for (const anchor of container.getElementsByTagName("a")) anchors.set(anchor.getAttribute("href"), anchor);
			let d = "";
			let width = 0;
			let height = 0;
			let length = 0;
			let last;
			positions.clear();
			for (const item of items) {
				const anchor = anchors.get(item.url);
				if (!anchor) continue;
				const styles = getComputedStyle(anchor);
				const x = getLineOffset$1(item.depth) + .5;
				const top = anchor.offsetTop + parseFloat(styles.paddingTop);
				const bottom = anchor.offsetTop + anchor.clientHeight - parseFloat(styles.paddingBottom);
				if (last) {
					const curve = `C ${last.x} ${top - 4} ${x} ${last.bottom + 4} ${x} ${top}`;
					d += ` ${curve} L${x} ${bottom}`;
					if (thumb) {
						segment.setAttribute("d", `M${last.x} ${last.bottom} ${curve}`);
						length += segment.getTotalLength();
					}
				} else d += `M${x} ${top} L${x} ${bottom}`;
				last = {
					x,
					top,
					bottom,
					offset: length
				};
				positions.set(item.url, last);
				length += bottom - top;
				width = Math.max(width, x + 8);
				height = Math.max(height, bottom);
			}
			let step = 0;
			for (const item of items) {
				if (item._step === void 0) continue;
				const position = positions.get(item.url);
				const g = steps[step++];
				if (position && g) g.setAttribute("transform", `translate(${position.x}, ${(position.top + position.bottom) / 2})`);
			}
			path.setAttribute("d", d);
			track.style.width = `${width}px`;
			track.style.height = `${height}px`;
			if (thumb) thumb.style.offsetPath = `path("${d}")`;
			update(toc.get());
		});
		observer.observe(container);
		toc.listen(update);
		return () => {
			observer.disconnect();
			toc.unlisten(update);
		};
	}, [
		items,
		thumbBox,
		toc
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "absolute top-0 inset-s-0 origin-center rtl:-scale-x-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "absolute size-full [clip-path:polygon(0_0,100%_0,100%_0,0_0)] transition-[clip-path]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "stroke-fd-primary",
				strokeWidth: "1",
				fill: "none"
			}), items.map((item) => item._step !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				r: "8",
				className: "fill-fd-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				textAnchor: "middle",
				alignmentBaseline: "central",
				dominantBaseline: "middle",
				className: "fill-fd-primary-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
				children: item._step
			})] }, item.url))]
		}), thumbBox && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 size-1 bg-fd-primary rounded-full opacity-0 transition-[opacity,offset-distance]" })]
	});
}
var BASE$1 = 8;
function getItemOffset$2(depth) {
	if (depth <= 2) return 20;
	if (depth === 3) return 32;
	return 44;
}
function getLineOffset$1(depth) {
	if (depth <= 2) return BASE$1;
	if (depth === 3) return 16;
	return 24;
}
function TOCItem$2({ item, ...props }) {
	const items = useTOCItems();
	const { isFirst, isLast, svg } = (0, import_react.useMemo)(() => {
		const index = items.indexOf(item);
		const isFirst = index === 0;
		const isLast = index === items.length - 1;
		const l1 = getLineOffset$1(item.depth);
		const l0 = getLineOffset$1(items[index - 1]?.depth ?? item.depth);
		const l2 = getLineOffset$1(items[index + 1]?.depth ?? item.depth);
		return {
			isFirst,
			isLast,
			svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				className: cn("absolute -top-1.5 inset-s-0 bottom-0 h-[calc(100%+--spacing(1.5))] -z-1 rtl:-scale-x-100", l1 !== l2 && "h-full bottom-1.5"),
				style: { width: Math.max(l0, l1) + 9 },
				children: [
					l0 !== l1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: `M ${l0 + .5} 0 C ${l0 + .5} 8 ${l1 + .5} 4 ${l1 + .5} 12`,
						stroke: "black",
						strokeWidth: "1",
						fill: "none",
						className: "stroke-fd-foreground/10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: l1 + .5,
						y1: l0 === l1 ? "6" : "12",
						x2: l1 + .5,
						y2: "100%",
						strokeWidth: "1",
						className: "stroke-fd-foreground/10"
					}),
					item._step !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${l1 + .5}, ${l1 === l2 ? "3" : "6"})`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "0",
							cy: "50%",
							r: "8",
							className: "fill-fd-muted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "0",
							y: "50%",
							textAnchor: "middle",
							alignmentBaseline: "central",
							dominantBaseline: "middle",
							className: "fill-fd-muted-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
							children: item._step
						})]
					})
				]
			})
		};
	}, [items, item]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TOCItem$3, {
		href: item.url,
		...props,
		className: cn("prose prose-sm relative py-1.5 scroll-m-4 text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary", isFirst && "pt-0", isLast && "pb-0", props.className),
		style: {
			paddingInlineStart: getItemOffset$2(item.depth),
			...props.style
		},
		children: [svg, item.title]
	});
}
var clerk_exports = /* @__PURE__ */ __exportAll({
	TOCEmpty: () => TOCEmpty,
	TOCItem: () => TOCItem$1,
	TOCItems: () => TOCItems$1
});
function TOCItems$1({ className, children, ...props }) {
	const items = useTOCItems();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col", className),
		...props,
		children: [items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbTrack, { items }), children]
	});
}
function TOCEmpty() {
	const t = useTranslations({ note: "table of contents" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground",
		children: t("No Headings")
	});
}
function ThumbTrack({ items }) {
	const toc = useTOC();
	const ref = (0, import_react.useCallback)((track) => {
		const container = track.parentElement;
		const svg = track.querySelector("svg");
		const path = svg.querySelector("path");
		const steps = svg.getElementsByTagName("g");
		const positions = /* @__PURE__ */ new Map();
		const update = (infos) => {
			let top = -1;
			let bottom = -1;
			for (const info of infos) {
				const position = info.active ? positions.get(info.original.url) : void 0;
				if (!position) continue;
				if (top === -1) top = position.top;
				bottom = position.bottom;
			}
			if (top !== -1) svg.style.clipPath = `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)`;
		};
		const observer = new ResizeObserver(() => {
			if (container.clientHeight === 0) return;
			const anchors = /* @__PURE__ */ new Map();
			for (const anchor of container.getElementsByTagName("a")) anchors.set(anchor.getAttribute("href"), anchor);
			let d = "";
			let width = 0;
			let height = 0;
			let last;
			positions.clear();
			for (const item of items) {
				const anchor = anchors.get(item.url);
				if (!anchor) continue;
				const styles = getComputedStyle(anchor);
				const x = getLineOffset(item.depth) + .5;
				const top = anchor.offsetTop + parseFloat(styles.paddingTop);
				const bottom = anchor.offsetTop + anchor.clientHeight - parseFloat(styles.paddingBottom);
				d += last ? ` L ${last.x} ${last.bottom} ${x} ${top}` : `M${x} ${top}`;
				d += ` L${x} ${bottom}`;
				last = {
					x,
					top,
					bottom
				};
				positions.set(item.url, last);
				width = Math.max(width, x + 8);
				height = Math.max(height, bottom);
			}
			let step = 0;
			for (const item of items) {
				if (item._step === void 0) continue;
				const position = positions.get(item.url);
				const g = steps[step++];
				if (position && g) g.setAttribute("transform", `translate(${position.x}, ${(position.top + position.bottom) / 2})`);
			}
			path.setAttribute("d", d);
			track.style.width = `${width}px`;
			track.style.height = `${height}px`;
			update(toc.get());
		});
		observer.observe(container);
		toc.listen(update);
		return () => {
			observer.disconnect();
			toc.unlisten(update);
		};
	}, [items, toc]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "absolute top-0 inset-s-0 origin-center rtl:-scale-x-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "absolute size-full [clip-path:polygon(0_0,100%_0,100%_0,0_0)] transition-[clip-path]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "stroke-fd-primary",
				strokeWidth: "1",
				fill: "none"
			}), items.map((item) => item._step !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				r: "8",
				className: "fill-fd-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				textAnchor: "middle",
				alignmentBaseline: "central",
				dominantBaseline: "middle",
				className: "fill-fd-primary-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
				children: item._step
			})] }, item.url))]
		})
	});
}
var BASE = 8;
function getItemOffset$1(depth) {
	if (depth <= 2) return 20;
	if (depth === 3) return 32;
	return 44;
}
function getLineOffset(depth) {
	if (depth <= 2) return BASE;
	if (depth === 3) return 20;
	return 32;
}
function TOCItem$1({ item, ...props }) {
	const items = useTOCItems();
	const { isFirst, isLast, svg } = (0, import_react.useMemo)(() => {
		const index = items.indexOf(item);
		const isFirst = index === 0;
		const isLast = index === items.length - 1;
		const l1 = getLineOffset(item.depth);
		const l0 = getLineOffset(items[index - 1]?.depth ?? item.depth);
		const l2 = getLineOffset(items[index + 1]?.depth ?? item.depth);
		return {
			isFirst,
			isLast,
			svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				className: cn("absolute -top-1.5 inset-s-0 bottom-0 h-[calc(100%+--spacing(1.5))] -z-1 rtl:-scale-x-100", l1 !== l2 && "h-full bottom-1.5"),
				style: { width: Math.max(l0, l1) + 9 },
				children: [
					l0 !== l1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: `M ${l0 + .5} 0 L ${l0 + .5} 0 ${l1 + .5} 12`,
						stroke: "black",
						strokeWidth: "1",
						fill: "none",
						className: "stroke-fd-foreground/10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: l1 + .5,
						y1: l0 === l1 ? "6" : "12",
						x2: l1 + .5,
						y2: "100%",
						strokeWidth: "1",
						className: "stroke-fd-foreground/10"
					}),
					item._step !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${l1 + .5}, ${l1 === l2 ? "3" : "6"})`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "0",
							cy: "50%",
							r: "8",
							className: "fill-fd-muted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "0",
							y: "50%",
							textAnchor: "middle",
							alignmentBaseline: "central",
							dominantBaseline: "middle",
							className: "fill-fd-muted-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
							children: item._step
						})]
					})
				]
			})
		};
	}, [items, item]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TOCItem$3, {
		href: item.url,
		...props,
		className: cn("prose prose-sm relative py-1.5 scroll-m-4 text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary", isFirst && "pt-0", isLast && "pb-0", props.className),
		style: {
			paddingInlineStart: getItemOffset$1(item.depth),
			...props.style
		},
		children: [svg, item.title]
	});
}
var block_exports = /* @__PURE__ */ __exportAll({
	TOCEmpty: () => TOCEmpty$1,
	TOCItem: () => TOCItem,
	TOCItems: () => TOCItems
});
function TOCItems({ className, children, ...props }) {
	const tocInfo = useTOC();
	const ref = (0, import_react.useCallback)((block) => {
		const container = block.parentElement;
		const positions = /* @__PURE__ */ new Map();
		let height = 0;
		const update = (items) => {
			let top = -1;
			let bottom = -1;
			for (const item of items) {
				if (!item.active) continue;
				const pos = positions.get(item.original.url);
				if (!pos) continue;
				if (top === -1) top = pos[0];
				bottom = pos[1];
			}
			if (top !== -1) block.style.clipPath = `inset(${top}px 0 ${height - bottom}px round 8px)`;
		};
		const observer = new ResizeObserver(() => {
			positions.clear();
			for (const anchor of container.getElementsByTagName("a")) {
				const href = anchor.getAttribute("href");
				if (href) positions.set(href, [anchor.offsetTop, anchor.offsetTop + anchor.offsetHeight]);
			}
			height = container.clientHeight;
			update(tocInfo.get());
		});
		observer.observe(container);
		tocInfo.listen(update);
		return () => {
			observer.disconnect();
			tocInfo.unlisten(update);
		};
	}, [tocInfo]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "absolute inset-0 bg-fd-primary/10 [clip-path:inset(0_0_100%)] transition-[clip-path] duration-300 ease-out"
		}), children]
	});
}
function getItemOffset(depth) {
	if (depth <= 2) return 8;
	if (depth === 3) return 20;
	return 32;
}
function TOCItem({ item, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TOCItem$3, {
		href: item.url,
		...props,
		className: cn("group prose relative py-1 pe-2 text-[0.8125rem]/5 scroll-m-4 text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary", props.className),
		style: {
			paddingInlineStart: getItemOffset(item.depth),
			...props.style
		},
		children: [item._step !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex size-4 me-1.5 items-center justify-center rounded-full align-text-bottom bg-fd-muted text-fd-muted-foreground font-mono font-medium text-[10px] transition-colors group-data-[active=true]:bg-fd-primary group-data-[active=true]:text-fd-primary-foreground",
			children: item._step
		}), item.title]
	});
}
var variants = {
	normal: default_exports,
	clerk: clerk_exports,
	block: block_exports
};
function TOCProvider(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCProvider$1, { ...props });
}
function TOC({ container, header, footer, style = "normal", list }) {
	const items = useTOCItems();
	const t = useTranslations({ note: "table of contents" });
	const { TOCItems, TOCEmpty, TOCItem } = variants[style];
	const { props: { aiChat } } = useDocsLayout();
	if (items.length === 0 && !header && !footer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "nd-toc-placeholder",
		className: "hidden xl:layout:[--fd-toc-width:268px]"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "nd-toc",
		...container,
		className: cn("sticky top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] flex flex-col [grid-area:toc] w-(--fd-toc-width) pt-12 pe-4 pb-2 xl:layout:[--fd-toc-width:268px] max-xl:hidden", "transition-[opacity,visibility] duration-300", aiChat?.open && aiChat.panel && "invisible opacity-0", container?.className),
		children: [
			header,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				id: "toc-title",
				className: "inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Text, { className: "size-4" }), t("On this page")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCScrollArea, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TOCItems, {
				...list,
				children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCEmpty, {}), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCItem, { item }, item.url))]
			}) }),
			footer
		]
	});
}
var TocPopoverContext = (0, import_react.createContext)(null);
function TOCPopover({ container, trigger, content, header, footer, style = "normal", list }) {
	const items = useTOCItems();
	const ref = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { isNavTransparent } = useDocsLayout();
	const { TOCItems, TOCItem, TOCEmpty } = variants[style];
	const onClickOutside = (0, import_react.useEffectEvent)((e) => {
		if (!open || !(e.target instanceof HTMLElement)) return;
		if (ref.current && !ref.current.contains(e.target)) setOpen(false);
	});
	const onClickItem = () => {
		setOpen(false);
	};
	(0, import_react.useEffect)(() => {
		window.addEventListener("click", onClickOutside);
		return () => {
			window.removeEventListener("click", onClickOutside);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TocPopoverContext, {
		value: (0, import_react.useMemo)(() => ({
			open,
			setOpen
		}), [setOpen, open]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
			open,
			onOpenChange: setOpen,
			"data-toc-popover": "",
			...container,
			className: cn("sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]", container?.className),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				ref,
				className: cn("border-b backdrop-blur-sm transition-colors", (!isNavTransparent || open) && "bg-fd-background/80", open && "shadow-lg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTOCPopoverTrigger, { ...trigger }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageTOCPopoverContent, {
					...content,
					children: [
						header,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCScrollArea, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TOCItems, {
							...list,
							children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCEmpty, {}), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TOCItem, {
								item,
								onClick: onClickItem
							}, item.url))]
						}) }),
						footer
					]
				})]
			})
		})
	});
}
function PageTOCPopoverTrigger({ className, ...props }) {
	const t = useTranslations({ note: "table of contents" });
	const { open } = (0, import_react.use)(TocPopoverContext);
	const items = useItems();
	const selectedIdx = items.findIndex((item) => item.active);
	const path = useTreePath().at(-1);
	const showItem = selectedIdx !== -1 && !open;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleTrigger, {
		className: cn("flex w-full h-10 items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6", className),
		"data-toc-popover-trigger": "",
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressCircle, {
				value: (items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length),
				max: 1,
				className: cn("shrink-0", open && "text-fd-primary")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "grid flex-1 *:my-auto *:row-start-1 *:col-start-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("truncate transition-[opacity,translate,color]", open && "text-fd-foreground", showItem && "opacity-0 -translate-y-full pointer-events-none"),
					children: path?.name ?? t("On this page")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("truncate transition-[opacity,translate]", !showItem && "opacity-0 translate-y-full pointer-events-none"),
					children: items[selectedIdx]?.original.title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { className: cn("shrink-0 transition-transform mx-0.5", open && "rotate-180") })
		]
	});
}
function clamp(input, min, max) {
	if (input < min) return min;
	if (input > max) return max;
	return input;
}
function ProgressCircle({ value, strokeWidth = 1.5, size = 18, min = 0, max = 100, style, ...restSvgProps }) {
	const normalizedValue = clamp(value, min, max);
	const radius = size / 2 - strokeWidth;
	const circumference = 2 * Math.PI * radius;
	const progress = normalizedValue / max * circumference;
	const circleProps = {
		cx: size / 2,
		cy: size / 2,
		r: radius,
		fill: "none",
		strokeWidth
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		role: "progressbar",
		viewBox: `0 0 ${size} ${size}`,
		"aria-valuenow": normalizedValue,
		"aria-valuemin": min,
		"aria-valuemax": max,
		style: {
			width: size,
			height: size,
			...style
		},
		...restSvgProps,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...circleProps,
			className: "stroke-current/25"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...circleProps,
			stroke: "currentColor",
			strokeDasharray: circumference,
			strokeDashoffset: circumference - progress,
			strokeLinecap: "round",
			transform: `rotate(-90 ${size / 2} ${size / 2})`,
			className: "transition-all"
		})]
	});
}
function PageTOCPopoverContent(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
		"data-toc-popover-content": "",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col px-4 max-h-[50vh] md:px-6",
			children: props.children
		})
	});
}
var footerCache = /* @__PURE__ */ new WeakMap();
/**
* @returns a list of page tree items (linear), that you can obtain footer items
*/
function useFooterItems() {
	const { root } = useTreeContext();
	const cached = footerCache.get(root);
	if (cached) return cached;
	const list = [];
	function onNode(node) {
		if (node.type === "folder") {
			if (node.index) onNode(node.index);
			for (const child of node.children) onNode(child);
		} else if (node.type === "page" && !node.external) list.push(node);
	}
	for (const child of root.children) onNode(child);
	footerCache.set(root, list);
	return list;
}
function Footer({ items, children, className, ...props }) {
	const footerList = useFooterItems();
	const pathname = usePathname();
	const { previous, next } = (0, import_react.useMemo)(() => {
		if (items) return items;
		const idx = footerList.findIndex((item) => isActive(item.url, pathname));
		if (idx === -1) return {};
		return {
			previous: footerList[idx - 1],
			next: footerList[idx + 1]
		};
	}, [
		footerList,
		items,
		pathname
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("@container grid gap-4", previous && next ? "grid-cols-2" : "grid-cols-1", className),
		...props,
		children: [previous && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterItem, {
			item: previous,
			index: 0
		}), next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterItem, {
			item: next,
			index: 1
		})]
	}), children] });
}
function FooterItem({ item, index }) {
	const t = useTranslations({ note: "pagination" });
	const Icon = index === 0 ? import_lucide_react.ChevronLeft : import_lucide_react.ChevronRight;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$2, {
		href: item.url,
		className: cn("flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full", index === 1 && "text-end"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("inline-flex items-center gap-1.5 font-medium", index === 1 && "flex-row-reverse"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "-mx-1 size-4 shrink-0 rtl:rotate-180" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.name })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-fd-muted-foreground",
			children: item.description ?? (index === 0 ? t("Previous Page") : t("Next Page"))
		})]
	});
}
function Breadcrumb({ includeRoot, includeSeparator, includePage, ...props }) {
	const path = useTreePath();
	const { root } = useTreeContext();
	const items = (0, import_react.useMemo)(() => {
		return getBreadcrumbItemsFromPath(root, path, {
			includePage,
			includeSeparator,
			includeRoot
		});
	}, [
		includePage,
		includeRoot,
		includeSeparator,
		path,
		root
	]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("flex items-center gap-1.5 text-sm text-fd-muted-foreground", props.className),
		children: items.map((item, i) => {
			const className = cn("truncate", i === items.length - 1 && "text-fd-primary font-medium");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "size-3.5 shrink-0" }), item.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$2, {
				href: item.url,
				className: cn(className, "transition-opacity hover:opacity-80"),
				children: item.name
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className,
				children: item.name
			})] }, i);
		})
	});
}
function Container(props) {
	const { full } = useDocsPage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid [grid-area:main] justify-items-center",
		"data-layout-main": "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			id: "nd-page",
			"data-layout-content": "",
			"data-full": full,
			...props,
			className: cn("flex flex-col min-w-0 w-full max-w-[900px] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14", "md:in-data-[sidebar-collapsed=true]:pt-16 xl:in-data-[sidebar-collapsed=true]:pt-14", full && "max-w-[1168px]", props.className),
			children: props.children
		})
	});
}
function useCopyButton(onCopy) {
	const [checked, setChecked] = (0, import_react.useState)(false);
	const callbackRef = (0, import_react.useRef)(onCopy);
	const timeoutRef = (0, import_react.useRef)(null);
	callbackRef.current = onCopy;
	const onClick = (0, import_react.useCallback)(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		Promise.resolve(callbackRef.current()).then(() => {
			setChecked(true);
			timeoutRef.current = window.setTimeout(() => {
				setChecked(false);
			}, 1500);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, []);
	return [checked, onClick];
}
var PageContext = (0, import_react.createContext)(null);
function useDocsPage() {
	const context = (0, import_react.use)(PageContext);
	if (!context) throw new Error("Please use page components under <DocsPage /> (`fumadocs-ui/layouts/docs/page`).");
	return context;
}
function DocsPage({ full = false, tableOfContent: { enabled: tocEnabled = !full, single, ...tocProps } = {}, tableOfContentPopover: { enabled: tocPopoverEnabled, ...tocPopoverProps } = {}, breadcrumb: { enabled: breadcrumbEnabled = true, ...breadcrumb } = {}, footer: { enabled: footerEnabled = true, ...footer } = {}, toc = [], slots: defaultSlots = {}, children, ...containerProps }) {
	tocPopoverEnabled ??= Boolean(toc.length > 0 || tocPopoverProps.header || tocPopoverProps.footer);
	const slots = {
		breadcrumb: defaultSlots.breadcrumb ?? Breadcrumb,
		footer: defaultSlots.footer ?? Footer,
		toc: defaultSlots.toc ?? {
			provider: TOCProvider,
			main: TOC,
			popover: TOCPopover
		},
		container: defaultSlots.container ?? Container
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageContext, {
		value: {
			full,
			slots
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(slots.toc.provider, {
			single,
			toc: tocEnabled || tocPopoverEnabled ? toc : [],
			children: [
				tocPopoverEnabled && (tocPopoverProps.component ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.toc.popover, { ...tocPopoverProps })),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(slots.container, {
					...containerProps,
					children: [
						breadcrumbEnabled && (breadcrumb.component ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.breadcrumb, { ...breadcrumb })),
						children,
						footerEnabled && (footer.component ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.footer, { ...footer }))
					]
				}),
				tocEnabled && (tocProps.component ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(slots.toc.main, { ...tocProps }))
			]
		})
	});
}
/**
* Add typography styles
*/
function DocsBody({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("prose flex-1", className),
		children
	});
}
function DocsDescription({ children, className, ...props }) {
	if (children === void 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		...props,
		className: cn("mb-8 text-lg text-fd-muted-foreground", className),
		children
	});
}
function DocsTitle({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		...props,
		className: cn("text-[1.75em] font-semibold", className),
		children
	});
}
function baseOptions() {
	return {
		themeSwitch: { enabled: false },
		nav: { title: "Puzzle" }
	};
}
function deserializePageTree(serialized) {
	return visit(serialized.data, (item) => {
		item = { ...item };
		if ("children" in item) item.children = [...item.children];
		if ("icon" in item && typeof item.icon === "string") item.icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { dangerouslySetInnerHTML: { __html: item.icon } });
		if (typeof item.name === "string") item.name = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "fd-page-tree-item-name",
			dangerouslySetInnerHTML: { __html: item.name }
		});
		return item;
	});
}
/**
* Deserialize loader data that is serialized by the server-side Fumadocs `loader()`, supported:
* - Page Tree
*
* other unrelated properties are kept in the output.
*/
function useFumadocsLoader(serialized) {
	return (0, import_react.useMemo)(() => {
		const out = {};
		for (const k in serialized) {
			const v = serialized[k];
			if (isSerializedPageTree(v)) out[k] = deserializePageTree(v);
			else out[k] = v;
		}
		return out;
	}, [serialized]);
}
function isSerializedPageTree(v) {
	return typeof v === "object" && v !== null && "$fumadocs_loader" in v && v.$fumadocs_loader === "page-tree";
}
function Cards(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("grid grid-cols-2 gap-3 @container", props.className),
		children: props.children
	});
}
function Card({ icon, title, description, ...props }) {
	const E = props.href ? Link$2 : "div";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(E, {
		...props,
		"data-card": true,
		className: cn("block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full", props.href && "hover:bg-fd-accent/80", props.className),
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "not-prose mb-2 w-fit shadow-md rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground [&_svg]:size-4",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "not-prose mb-1 text-sm font-medium",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-0! text-sm text-fd-muted-foreground",
				children: description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-fd-muted-foreground prose-no-margin empty:hidden",
				children: props.children
			})
		]
	});
}
var iconClass = "size-5 -me-0.5 fill-(--callout-color) text-fd-card";
function Callout({ children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalloutContainer, {
		...props,
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalloutTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalloutDescription, { children })]
	});
}
function resolveAlias(type) {
	if (type === "warn") return "warning";
	if (type === "tip") return "info";
	return type;
}
function CalloutContainer({ type: inputType = "info", icon, children, className, style, ...props }) {
	const type = resolveAlias(inputType);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex gap-2 my-4 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground", className),
		style: {
			"--callout-color": `var(--color-fd-${type}, var(--color-fd-muted))`,
			...style
		},
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "none",
				className: "w-0.5 bg-(--callout-color)/50 rounded-sm"
			}),
			icon ?? {
				info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: iconClass }),
				warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.TriangleAlert, { className: iconClass }),
				error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CircleX, { className: iconClass }),
				success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CircleCheck, { className: iconClass }),
				idea: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lightbulb, { className: "size-5 -me-0.5 fill-(--callout-color) text-(--callout-color)" })
			}[type],
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 min-w-0 flex-1",
				children
			})
		]
	});
}
function CalloutTitle({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("font-medium my-0!", className),
		...props,
		children
	});
}
function CalloutDescription({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("text-fd-muted-foreground prose-no-margin empty:hidden", className),
		...props,
		children
	});
}
function Heading({ as, ...props }) {
	const As = as ?? "h1";
	const t = useTranslations({ note: "heading anchor" });
	const [isChecked, onCopy] = useCopyButton(() => {
		if (!props.id) return;
		const url = new URL(window.location.href);
		url.hash = props.id;
		return navigator.clipboard.writeText(url.href);
	});
	if (!props.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, { ...props });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(As, {
		...props,
		className: cn("group/heading flex scroll-m-28 flex-row items-center gap-1", props.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			"data-card": "",
			href: `#${props.id}`,
			children: props.children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			"aria-live": "polite",
			className: cn(buttonVariants({
				variant: "ghost",
				size: "icon-xs"
			}), "not-prose shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100 focus-visible:opacity-100"),
			onClick: onCopy,
			children: [isChecked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CopyCheckIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LinkIcon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: isChecked ? t("Copied Anchor Link", { note: "aria-label" }) : t("Copy Anchor Link", { note: "aria-label" })
			})]
		})]
	});
}
var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", {
	value,
	configurable: true
});
// @__NO_SIDE_EFFECTS__
function createCollection(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	});
	const CollectionProvider = /* @__PURE__ */ __name$3((props) => {
		const { scope, children } = props;
		const ref = import_react.useRef(null);
		const itemMap = import_react.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			scope,
			itemMap,
			collectionRef: ref,
			children
		});
	}, "CollectionProvider");
	CollectionProvider.displayName = PROVIDER_NAME;
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
		const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionSlotImpl, {
			ref: composedRefs,
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = import_react.useRef(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context = useCollectionContext(ITEM_SLOT_NAME, scope);
		import_react.useEffect(() => {
			context.itemMap.set(ref, {
				ref,
				...itemData
			});
			return () => void context.itemMap.delete(ref);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useCollection(scope) {
		const context = useCollectionContext(name + "CollectionConsumer", scope);
		return import_react.useCallback(() => {
			const collectionNode = context.collectionRef.current;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
		}, [context.collectionRef, context.itemMap]);
	}
	__name$3(useCollection, "useCollection");
	return [
		{
			Provider: CollectionProvider,
			Slot: CollectionSlot,
			ItemSlot: CollectionItemSlot
		},
		useCollection,
		createCollectionScope
	];
}
__name$3(createCollection, "createCollection");
var __instanciated = /* @__PURE__ */ new WeakMap();
var OrderedDict = class _OrderedDict extends Map {
	static {
		__name$3(this, "OrderedDict");
	}
	#keys;
	constructor(entries) {
		super(entries);
		this.#keys = [...super.keys()];
		__instanciated.set(this, true);
	}
	set(key, value) {
		if (__instanciated.get(this) && !this.has(key)) this.#keys.push(key);
		super.set(key, value);
		return this;
	}
	/**
	* Sets a key-value pair so that it ends up at the given index.
	* - Existing keys are moved
	* - Negative indices count from the end of the resulting dictionary, so
	*   inserting at -1 makes the item the last one, -2 the second to last, etc.
	* - Out-of-range indices are clamped
	*/
	insert(index, key, value) {
		const has = this.has(key);
		const finalSize = has ? this.size : this.size + 1;
		const relativeIndex = toSafeInteger(index);
		const targetIndex = relativeIndex >= 0 ? Math.min(relativeIndex, finalSize - 1) : Math.max(finalSize + relativeIndex, 0);
		if (has ? this.#keys.indexOf(key) === targetIndex : targetIndex === this.size) {
			this.set(key, value);
			return this;
		}
		const keys = this.#keys.filter((existingKey) => existingKey !== key);
		keys.splice(targetIndex, 0, key);
		const entries = keys.map((entryKey) => [entryKey, entryKey === key ? value : this.get(entryKey)]);
		this.clear();
		for (const [entryKey, entryValue] of entries) this.set(entryKey, entryValue);
		return this;
	}
	with(index, key, value) {
		const copy = new _OrderedDict(this);
		copy.insert(index, key, value);
		return copy;
	}
	before(key) {
		const index = this.#keys.indexOf(key) - 1;
		if (index < 0) return;
		return this.entryAt(index);
	}
	/**
	* Sets a new key-value pair at the position before the given key.
	*/
	setBefore(key, newKey, value) {
		const index = this.#keys.indexOf(key);
		if (index === -1) return this;
		const currentIndex = this.#keys.indexOf(newKey);
		const targetIndex = currentIndex !== -1 && currentIndex < index ? index - 1 : index;
		return this.insert(targetIndex, newKey, value);
	}
	after(key) {
		let index = this.#keys.indexOf(key);
		index = index === -1 || index === this.size - 1 ? -1 : index + 1;
		if (index === -1) return;
		return this.entryAt(index);
	}
	/**
	* Sets a new key-value pair at the position after the given key.
	*/
	setAfter(key, newKey, value) {
		const index = this.#keys.indexOf(key);
		if (index === -1) return this;
		const currentIndex = this.#keys.indexOf(newKey);
		const targetIndex = currentIndex !== -1 && currentIndex <= index ? index : index + 1;
		return this.insert(targetIndex, newKey, value);
	}
	first() {
		return this.entryAt(0);
	}
	last() {
		return this.entryAt(-1);
	}
	clear() {
		this.#keys = [];
		return super.clear();
	}
	delete(key) {
		const deleted = super.delete(key);
		if (deleted) this.#keys.splice(this.#keys.indexOf(key), 1);
		return deleted;
	}
	deleteAt(index) {
		const key = this.keyAt(index);
		if (key !== void 0) return this.delete(key);
		return false;
	}
	at(index) {
		const key = at(this.#keys, index);
		if (key !== void 0) return this.get(key);
	}
	entryAt(index) {
		const key = at(this.#keys, index);
		if (key !== void 0) return [key, this.get(key)];
	}
	indexOf(key) {
		return this.#keys.indexOf(key);
	}
	keyAt(index) {
		return at(this.#keys, index);
	}
	from(key, offset) {
		const index = this.indexOf(key);
		if (index === -1) return;
		let dest = index + offset;
		if (dest < 0) dest = 0;
		if (dest >= this.size) dest = this.size - 1;
		return this.at(dest);
	}
	keyFrom(key, offset) {
		const index = this.indexOf(key);
		if (index === -1) return;
		let dest = index + offset;
		if (dest < 0) dest = 0;
		if (dest >= this.size) dest = this.size - 1;
		return this.keyAt(dest);
	}
	find(predicate, thisArg) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [
				entry,
				index,
				this
			])) return entry;
			index++;
		}
	}
	findIndex(predicate, thisArg) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [
				entry,
				index,
				this
			])) return index;
			index++;
		}
		return -1;
	}
	filter(predicate, thisArg) {
		const entries = [];
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [
				entry,
				index,
				this
			])) entries.push(entry);
			index++;
		}
		return new _OrderedDict(entries);
	}
	map(callbackfn, thisArg) {
		const entries = [];
		let index = 0;
		for (const entry of this) {
			entries.push([entry[0], Reflect.apply(callbackfn, thisArg, [
				entry,
				index,
				this
			])]);
			index++;
		}
		return new _OrderedDict(entries);
	}
	reduce(...args) {
		const [callbackfn, initialValue] = args;
		const hasInitialValue = args.length > 1;
		if (!hasInitialValue && this.size === 0) throw new TypeError("Reduce of empty OrderedDict with no initial value");
		let index = 0;
		let accumulator = initialValue;
		for (const entry of this) {
			if (index === 0 && !hasInitialValue) accumulator = entry;
			else accumulator = Reflect.apply(callbackfn, this, [
				accumulator,
				entry,
				index,
				this
			]);
			index++;
		}
		return accumulator;
	}
	reduceRight(...args) {
		const [callbackfn, initialValue] = args;
		const hasInitialValue = args.length > 1;
		if (!hasInitialValue && this.size === 0) throw new TypeError("Reduce of empty OrderedDict with no initial value");
		let accumulator = initialValue;
		for (let index = this.size - 1; index >= 0; index--) {
			const entry = this.entryAt(index);
			if (index === this.size - 1 && !hasInitialValue) accumulator = entry;
			else accumulator = Reflect.apply(callbackfn, this, [
				accumulator,
				entry,
				index,
				this
			]);
		}
		return accumulator;
	}
	/**
	* Sorts the dictionary in place. This method mutates the dictionary and
	* returns a reference to the same object
	*
	* @param compareFn Function used to determine the order of the elements. It
	* is expected to return a negative value if the first argument is less than
	* the second argument, zero if they're equal, and a positive value otherwise.
	*/
	sort(compareFn) {
		if (typeof compareFn !== "function") throw new TypeError(`OrderedDict.sort requires a compare function`);
		const entries = [...this.entries()].sort(compareFn);
		this.clear();
		for (const [key, value] of entries) this.set(key, value);
		return this;
	}
	/**
	* Returns a copy of the dictionary with its elements sorted.
	*
	* @param compareFn Function used to determine the order of the elements. It
	* is expected to return a negative value if the first argument is less than
	* the second argument, zero if they're equal, and a positive value otherwise.
	*/
	toSorted(compareFn) {
		if (typeof compareFn !== "function") throw new TypeError(`OrderedDict.toSorted requires a compare function`);
		const entries = [...this.entries()].sort(compareFn);
		return new _OrderedDict(entries);
	}
	toReversed() {
		const reversed = new _OrderedDict();
		for (let index = this.size - 1; index >= 0; index--) {
			const key = this.keyAt(index);
			const element = this.get(key);
			reversed.set(key, element);
		}
		return reversed;
	}
	toSpliced(...args) {
		const entries = [...this.entries()];
		entries.splice(...args);
		return new _OrderedDict(entries);
	}
	slice(start, end) {
		const result = new _OrderedDict();
		for (const key of this.#keys.slice(start, end)) result.set(key, this.get(key));
		return result;
	}
	every(predicate, thisArg) {
		let index = 0;
		for (const entry of this) {
			if (!Reflect.apply(predicate, thisArg, [
				entry,
				index,
				this
			])) return false;
			index++;
		}
		return true;
	}
	some(predicate, thisArg) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [
				entry,
				index,
				this
			])) return true;
			index++;
		}
		return false;
	}
};
function at(array, index) {
	if ("at" in Array.prototype) return Array.prototype.at.call(array, index);
	const actualIndex = toSafeIndex(array, index);
	return actualIndex === -1 ? void 0 : array[actualIndex];
}
__name$3(at, "at");
function toSafeIndex(array, index) {
	const length = array.length;
	const relativeIndex = toSafeInteger(index);
	const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
	return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}
__name$3(toSafeIndex, "toSafeIndex");
function toSafeInteger(number) {
	return number !== number || number === 0 ? 0 : Math.trunc(number);
}
__name$3(toSafeInteger, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function createCollection2(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionStableContextProvider, useStableCollectionContext] = createCollectionContext(PROVIDER_NAME);
	CollectionStableContextProvider.displayName = name + "CollectionStableContextProvider";
	const [CollectionStatefulContextProvider, useStatefulCollectionContext] = createCollectionContext(PROVIDER_NAME);
	CollectionStatefulContextProvider.displayName = name + "CollectionStatefulContextProvider";
	const CollectionProvider = /* @__PURE__ */ __name$3(({ state, ...props }) => {
		return state ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			...props,
			state
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionInit, { ...props });
	}, "CollectionProvider");
	CollectionProvider.displayName = PROVIDER_NAME;
	const CollectionInit = /* @__PURE__ */ __name$3((props) => {
		const state = useInitCollection();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			...props,
			state
		});
	}, "CollectionInit");
	CollectionInit.displayName = name + "CollectionInit";
	const CollectionProviderImpl = /* @__PURE__ */ __name$3((props) => {
		const { scope, children, state } = props;
		const ref = import_react.useRef(null);
		const [collectionElement, setCollectionElement] = import_react.useState(null);
		const composeRefs = useComposedRefs(ref, setCollectionElement);
		const [collection, setCollection] = state;
		const registryRef = import_react.useRef(new OrderedDict());
		const getCollection = import_react.useCallback(() => {
			const registry = registryRef.current;
			if (!isInDocumentOrder(registry)) registry.sort(sortByDocumentPosition);
			return registry;
		}, []);
		import_react.useEffect(() => {
			if (!collectionElement) return;
			const observer = getChildListObserver(() => {
				setCollection((map) => {
					const sorted = map.toSorted(sortByDocumentPosition);
					return sorted.some(([key], index) => map.keyAt(index) !== key) ? sorted : map;
				});
			});
			observer.observe(collectionElement, {
				childList: true,
				subtree: true
			});
			return () => {
				observer.disconnect();
			};
		}, [collectionElement, setCollection]);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionStableContextProvider, {
			scope,
			collectionElementRef: composeRefs,
			collectionElementRefObject: ref,
			getCollection,
			setCollection,
			registryRef,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionStatefulContextProvider, {
				scope,
				collectionElement,
				collection,
				children
			})
		});
	}, "CollectionProviderImpl");
	CollectionProviderImpl.displayName = name + "CollectionProviderImpl";
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		const context = useStableCollectionContext(COLLECTION_SLOT_NAME, scope);
		const composedRefs = useComposedRefs(forwardedRef, context.collectionElementRef);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionSlotImpl, {
			ref: composedRefs,
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = import_react.useRef(null);
		const { setCollection, registryRef } = useStableCollectionContext(ITEM_SLOT_NAME, scope);
		const itemDataRef = import_react.useRef(itemData);
		if (!shallowEqual(itemDataRef.current, itemData)) itemDataRef.current = itemData;
		const memoizedItemData = itemDataRef.current;
		const registerElement = import_react.useCallback((node) => {
			const registry = registryRef.current;
			if (node) registry.set(node, {
				...itemDataRef.current,
				element: node
			});
			else if (ref.current) registry.delete(ref.current);
		}, [registryRef]);
		const composedRefs = useComposedRefs(forwardedRef, registerElement, ref);
		useLayoutEffect2(() => {
			const node = ref.current;
			const registry = registryRef.current;
			if (node && registry.has(node)) registry.set(node, {
				...memoizedItemData,
				element: node
			});
		}, [memoizedItemData, registryRef]);
		const registeredRef = import_react.useRef(null);
		import_react.useEffect(() => {
			const element = ref.current;
			const registered = registeredRef.current;
			if ((registered?.element ?? null) === element && (!element || registered?.itemData === memoizedItemData)) return;
			registeredRef.current = element ? {
				element,
				itemData: memoizedItemData
			} : null;
			setCollection((map) => {
				const next = new OrderedDict(map);
				if (registered && registered.element !== element) next.delete(registered.element);
				if (element) next.set(element, {
					...memoizedItemData,
					element
				});
				return next.sort(sortByDocumentPosition);
			});
		});
		import_react.useEffect(() => {
			return () => {
				const registered = registeredRef.current;
				registeredRef.current = null;
				if (!registered) return;
				setCollection((map) => {
					if (!map.has(registered.element)) return map;
					const next = new OrderedDict(map);
					next.delete(registered.element);
					return next;
				});
			};
		}, [setCollection]);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useInitCollection() {
		return import_react.useState(new OrderedDict());
	}
	__name$3(useInitCollection, "useInitCollection");
	function useCollection(scope) {
		const { collection } = useStatefulCollectionContext(name + "CollectionConsumer", scope);
		return collection;
	}
	__name$3(useCollection, "useCollection");
	function useGetCollection(scope) {
		const { getCollection } = useStableCollectionContext(name + "CollectionConsumer", scope);
		return getCollection;
	}
	__name$3(useGetCollection, "useGetCollection");
	return [{
		Provider: CollectionProvider,
		Slot: CollectionSlot,
		ItemSlot: CollectionItemSlot
	}, {
		createCollectionScope,
		useCollection,
		useGetCollection,
		useInitCollection
	}];
}
__name$3(createCollection2, "createCollection");
function shallowEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== "object" || typeof b !== "object") return false;
	if (a == null || b == null) return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) {
		if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
		if (a[key] !== b[key]) return false;
	}
	return true;
}
__name$3(shallowEqual, "shallowEqual");
function isElementPreceding(a, b) {
	return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
__name$3(isElementPreceding, "isElementPreceding");
function isInDocumentOrder(dict) {
	let previous;
	for (const element of dict.keys()) {
		if (previous) {
			const position = previous.compareDocumentPosition(element);
			if (!(position & Node.DOCUMENT_POSITION_DISCONNECTED) && position & Node.DOCUMENT_POSITION_PRECEDING) return false;
		}
		previous = element;
	}
	return true;
}
__name$3(isInDocumentOrder, "isInDocumentOrder");
function sortByDocumentPosition(a, b) {
	return !a[1].element || !b[1].element ? 0 : isElementPreceding(a[1].element, b[1].element) ? -1 : 1;
}
__name$3(sortByDocumentPosition, "sortByDocumentPosition");
function getChildListObserver(callback) {
	return new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) if (mutation.type === "childList") {
			callback();
			return;
		}
	});
}
__name$3(getChildListObserver, "getChildListObserver");
var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", {
	value,
	configurable: true
});
var _isHydrated = false;
function useIsHydrated() {
	const [isHydrated, setIsHydrated] = import_react.useState(_isHydrated);
	import_react.useEffect(() => {
		if (!_isHydrated) {
			_isHydrated = true;
			setIsHydrated(true);
		}
	}, []);
	return isHydrated;
}
__name$2(useIsHydrated, "useIsHydrated");
var useReactSyncExternalStore = import_react[" useSyncExternalStore ".trim().toString()];
function subscribe() {
	return () => {};
}
__name$2(subscribe, "subscribe");
function useIsHydratedModern() {
	return useReactSyncExternalStore(subscribe, () => true, () => false);
}
__name$2(useIsHydratedModern, "useIsHydratedModern");
var useIsHydrated2 = typeof useReactSyncExternalStore === "function" ? useIsHydratedModern : useIsHydrated;
var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", {
	value,
	configurable: true
});
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = /* @__PURE__ */ createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME, [createCollectionScope]);
var Orientation = {
	Vertical: "vertical",
	Horizontal: "horizontal"
};
var Direction = {
	LTR: "ltr",
	RTL: "rtl"
};
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function RovingFocusGroup2(props, forwardedRef) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
		scope: props.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
			scope: props.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroupImpl, {
				...props,
				ref: forwardedRef
			})
		})
	});
}, "RovingFocusGroup"));
var RovingFocusGroupImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function RovingFocusGroupImpl2(props, forwardedRef) {
	const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const direction = useDirection(dir);
	const [currentTabStopId, setCurrentTabStopId] = useControllableState({
		prop: currentTabStopIdProp,
		defaultProp: defaultCurrentTabStopId ?? null,
		onChange: onCurrentTabStopIdChange,
		caller: GROUP_NAME
	});
	const [isTabbingBackOut, setIsTabbingBackOut] = import_react.useState(false);
	const handleEntryFocus = useCallbackRef$1(onEntryFocus);
	const getItems = useCollection(__scopeRovingFocusGroup);
	const isClickFocusRef = import_react.useRef(false);
	const [focusableItemsCount, setFocusableItemsCount] = import_react.useState(0);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
			return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
		}
	}, [handleEntryFocus]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusProvider, {
		scope: __scopeRovingFocusGroup,
		orientation,
		dir: direction,
		loop,
		currentTabStopId,
		onItemFocus: import_react.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
		onItemShiftTab: import_react.useCallback(() => setIsTabbingBackOut(true), []),
		onFocusableItemAdd: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), []),
		onFocusableItemRemove: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
			"data-orientation": orientation,
			...groupProps,
			ref: composedRefs,
			style: {
				outline: "none",
				...props.style
			},
			onMouseDown: composeEventHandlers(props.onMouseDown, () => {
				isClickFocusRef.current = true;
			}),
			onFocus: composeEventHandlers(props.onFocus, (event) => {
				const isKeyboardFocus = !isClickFocusRef.current;
				if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
					const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
					event.currentTarget.dispatchEvent(entryFocusEvent);
					if (!entryFocusEvent.defaultPrevented) {
						const items = getItems().filter((item) => item.focusable);
						focusFirst([
							items.find((item) => item.active),
							items.find((item) => item.id === currentTabStopId),
							...items
						].filter(Boolean).map((item) => item.ref.current), preventScrollOnEntryFocus);
					}
				}
				isClickFocusRef.current = false;
			}),
			onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
		})
	});
}, "RovingFocusGroupImpl"));
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function RovingFocusGroupItem2(props, forwardedRef) {
	const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
	const autoId = useId$1();
	const id = tabStopId || autoId;
	const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
	const isCurrentTabStop = context.currentTabStopId === id;
	const getItems = useCollection(__scopeRovingFocusGroup);
	const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
	const isHydrated = useIsHydrated2();
	useLayoutEffect2(() => {
		if (!isHydrated || !focusable) return;
		onFocusableItemAdd();
		return () => onFocusableItemRemove();
	}, [
		isHydrated,
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	import_react.useEffect(() => {
		if (isHydrated || !focusable) return;
		onFocusableItemAdd();
		return () => onFocusableItemRemove();
	}, [
		isHydrated,
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
		scope: __scopeRovingFocusGroup,
		id,
		focusable,
		active,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			tabIndex: isCurrentTabStop ? 0 : -1,
			"data-orientation": context.orientation,
			...itemProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!focusable) event.preventDefault();
				else context.onItemFocus(id);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === "Tab" && event.shiftKey) {
					context.onItemShiftTab();
					return;
				}
				if (event.target !== event.currentTarget) return;
				const focusIntent = getFocusIntent(event, context.orientation, context.dir);
				if (focusIntent !== void 0) {
					if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
					event.preventDefault();
					let candidateNodes = getItems().filter((item) => item.focusable).map((item) => item.ref.current);
					if (focusIntent === "last") candidateNodes.reverse();
					else if (focusIntent === "prev" || focusIntent === "next") {
						if (focusIntent === "prev") candidateNodes.reverse();
						const currentIndex = candidateNodes.indexOf(event.currentTarget);
						candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
					}
					setTimeout(() => focusFirst(candidateNodes));
				}
			}),
			children: typeof children === "function" ? children({
				isCurrentTabStop,
				hasTabStop: currentTabStopId != null
			}) : children
		})
	});
}, "RovingFocusGroupItem"));
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== Direction.RTL) return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
__name$1(getDirectionAwareKey, "getDirectionAwareKey");
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === Orientation.Vertical && ["ArrowLeft", "ArrowRight"].includes(key)) return;
	if (orientation === Orientation.Horizontal && ["ArrowUp", "ArrowDown"].includes(key)) return;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
__name$1(getFocusIntent, "getFocusIntent");
function focusFirst(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
__name$1(focusFirst, "focusFirst");
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
__name$1(wrapArray, "wrapArray");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var ActivationMode = {
	Automatic: "automatic",
	Manual: "manual"
};
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$2 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function Tabs2(props, forwardedRef) {
	const { __scopeTabs, value: valueProp, onValueChange, defaultValue, orientation = "horizontal", dir, activationMode = ActivationMode.Automatic, ...tabsProps } = props;
	const direction = useDirection(dir);
	const [value, setValue] = useControllableState({
		prop: valueProp,
		onChange: onValueChange,
		defaultProp: defaultValue ?? "",
		caller: TABS_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsProvider, {
		scope: __scopeTabs,
		baseId: useId$1(),
		value,
		onValueChange: setValue,
		orientation,
		dir: direction,
		activationMode,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			dir: direction,
			"data-orientation": orientation,
			...tabsProps,
			ref: forwardedRef
		})
	});
}, "Tabs"));
var TAB_LIST_NAME = "TabsList";
var TabsList$2 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function TabsList2(props, forwardedRef) {
	const { __scopeTabs, loop = true, ...listProps } = props;
	const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroup, {
		asChild: true,
		...rovingFocusGroupScope,
		orientation: context.orientation,
		dir: context.dir,
		loop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			role: "tablist",
			"aria-orientation": context.orientation,
			...listProps,
			ref: forwardedRef
		})
	});
}, "TabsList"));
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$2 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function TabsTrigger2(props, forwardedRef) {
	const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
	const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroupItem, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: isSelected,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "tab",
			"aria-selected": isSelected,
			"aria-controls": contentId,
			"data-state": isSelected ? "active" : "inactive",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			id: triggerId,
			...triggerProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) {
					event.currentTarget.focus();
					context.onValueChange(value);
				} else event.preventDefault();
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (disabled || event.target !== event.currentTarget) return;
				if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => {
				const isAutomaticActivation = context.activationMode !== ActivationMode.Manual;
				if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
			})
		})
	});
}, "TabsTrigger"));
var CONTENT_NAME = "TabsContent";
var TabsContent$2 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function TabsContent2(props, forwardedRef) {
	const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
	const context = useTabsContext(CONTENT_NAME, __scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	const isMountAnimationPreventedRef = import_react.useRef(isSelected);
	import_react.useEffect(() => {
		const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
		return () => cancelAnimationFrame(rAF);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || isSelected,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": isSelected ? "active" : "inactive",
			"data-orientation": context.orientation,
			role: "tabpanel",
			"aria-labelledby": triggerId,
			hidden: !present,
			id: contentId,
			tabIndex: 0,
			...contentProps,
			ref: forwardedRef,
			style: {
				...props.style,
				animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
			},
			children: present && children
		})
	});
}, "TabsContent"));
function makeTriggerId(baseId, value) {
	return `${baseId}-trigger-${value}`;
}
__name(makeTriggerId, "makeTriggerId");
function makeContentId(baseId, value) {
	return `${baseId}-content-${value}`;
}
__name(makeContentId, "makeContentId");
var listeners = /* @__PURE__ */ new Map();
var TabsContext$2 = (0, import_react.createContext)(null);
function useTabContext$1() {
	const ctx = (0, import_react.use)(TabsContext$2);
	if (!ctx) throw new Error("You must wrap your component in <Tabs>");
	return ctx;
}
var TabsList$1 = TabsList$2;
function TabsTrigger$1({ value, ref, ...props }) {
	const { triggers } = useTabContext$1();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$2, {
		ref: mergeRefs$1(ref, (element) => {
			if (element) triggers.add(value);
			else triggers.delete(value);
		}),
		value,
		...props
	});
}
function Tabs$1({ ref, groupId, persist = false, updateAnchor = false, defaultValue, value: _value, onValueChange: _onValueChange, ...props }) {
	const tabsRef = (0, import_react.useRef)(null);
	const valueToIdMap = (0, import_react.useMemo)(() => /* @__PURE__ */ new Map(), []);
	const panels = (0, import_react.useMemo)(() => /* @__PURE__ */ new Map(), []);
	const triggers = (0, import_react.useMemo)(() => /* @__PURE__ */ new Set(), []);
	const [value, setValue] = _value === void 0 ? (0, import_react.useState)(defaultValue) : [_value, (v) => _onValueChange?.(v)];
	const onChange = (0, import_react.useEffectEvent)((v) => {
		if (triggers.has(v)) setValue(v);
	});
	const openFromHash = (0, import_react.useEffectEvent)(() => {
		const hash = window.location.hash.slice(1);
		if (!hash) return;
		for (const [value, id] of valueToIdMap.entries()) if (id === hash) {
			setValue(value);
			tabsRef.current?.scrollIntoView();
			return;
		}
		const target = document.getElementById(hash);
		if (!target) return;
		for (const [value, panel] of panels.entries()) {
			if (!panel.contains(target)) continue;
			setValue(value);
			requestAnimationFrame(() => target.scrollIntoView());
			return;
		}
	});
	(0, import_react.useLayoutEffect)(() => {
		if (!groupId) return;
		let previous = sessionStorage.getItem(groupId);
		if (persist) previous ??= localStorage.getItem(groupId);
		if (previous) onChange(previous);
		const groupListeners = listeners.get(groupId) ?? /* @__PURE__ */ new Set();
		groupListeners.add(onChange);
		listeners.set(groupId, groupListeners);
		return () => {
			groupListeners.delete(onChange);
		};
	}, [groupId, persist]);
	(0, import_react.useLayoutEffect)(() => {
		openFromHash();
		window.addEventListener("hashchange", openFromHash);
		return () => window.removeEventListener("hashchange", openFromHash);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs$2, {
		ref: mergeRefs$1(ref, tabsRef),
		value,
		onValueChange: (v) => {
			if (updateAnchor) {
				const id = valueToIdMap.get(v);
				if (id) window.history.replaceState(null, "", `#${id}`);
			}
			if (groupId) {
				const groupListeners = listeners.get(groupId);
				if (groupListeners) for (const listener of groupListeners) listener(v);
				sessionStorage.setItem(groupId, v);
				if (persist) localStorage.setItem(groupId, v);
			} else setValue(v);
		},
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContext$2, {
			value: (0, import_react.useMemo)(() => ({
				valueToIdMap,
				panels,
				triggers
			}), [
				valueToIdMap,
				panels,
				triggers
			]),
			children: props.children
		})
	});
}
function TabsContent$1({ value, id, ref, ...props }) {
	const { valueToIdMap, panels } = useTabContext$1();
	if (id) valueToIdMap.set(value, id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$2, {
		ref: mergeRefs$1(ref, (element) => {
			if (element) panels.set(value, element);
			else panels.delete(value);
		}),
		value,
		...props,
		children: props.children
	});
}
var TabsContext$1 = (0, import_react.createContext)(null);
function Pre(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		...props,
		className: cn("min-w-full w-max *:flex *:flex-col", props.className),
		children: props.children
	});
}
function CodeBlock({ ref, title, allowCopy = true, keepBackground = false, icon, viewportProps = {}, children, Actions = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...props,
	className: cn("empty:hidden", props.className)
}), ...props }) {
	const inTab = (0, import_react.use)(TabsContext$1) !== null;
	const areaRef = (0, import_react.useRef)(null);
	if (allowCopy === "true") allowCopy = true;
	else if (allowCopy === "false") allowCopy = false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		ref,
		dir: "ltr",
		...props,
		tabIndex: -1,
		className: cn(inTab ? "bg-fd-secondary -mx-px -mb-px last:rounded-b-xl" : "my-4 bg-fd-card rounded-xl", keepBackground && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)", "shiki relative border not-prose overflow-hidden text-sm", props.className),
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4",
			children: [
				typeof icon === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "[&_svg]:size-3.5",
					dangerouslySetInnerHTML: { __html: icon }
				}) : icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "flex-1 truncate",
					children: title
				}),
				Actions({
					className: "-me-2",
					children: allowCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { containerRef: areaRef })
				})
			]
		}) : Actions({
			className: "absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground",
			children: allowCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { containerRef: areaRef })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: areaRef,
			...viewportProps,
			role: "region",
			tabIndex: 0,
			className: cn("text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring", viewportProps.className),
			style: {
				"--padding-right": !title ? "calc(var(--spacing) * 8)" : void 0,
				counterSet: props["data-line-numbers"] ? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}` : void 0,
				...viewportProps.style
			},
			children
		})]
	});
}
function CopyButton({ className, containerRef, ...props }) {
	const t = useTranslations({ note: "code block" });
	const [checked, onClick] = useCopyButton(() => {
		const pre = containerRef.current?.getElementsByTagName("pre").item(0);
		if (!pre) return;
		const clone = pre.cloneNode(true);
		clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
			node.replaceWith("\n");
		});
		return navigator.clipboard.writeText(clone.textContent ?? "");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-checked": checked || void 0,
		className: cn(buttonVariants({
			className: "hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground",
			size: "icon-xs"
		}), className),
		"aria-live": "polite",
		onClick,
		...props,
		children: [checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clipboard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: checked ? t("Copied Text", { note: "aria-label" }) : t("Copy Text", { note: "aria-label" })
		})]
	});
}
function CodeBlockTabs({ ref, ...props }) {
	const containerRef = (0, import_react.useRef)(null);
	const nested = (0, import_react.use)(TabsContext$1) !== null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs$1, {
		ref: mergeRefs$1(containerRef, ref),
		...props,
		className: cn("bg-fd-card rounded-xl border", !nested && "my-4", props.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContext$1, {
			value: (0, import_react.useMemo)(() => ({
				containerRef,
				nested
			}), [nested]),
			children: props.children
		})
	});
}
function CodeBlockTabsList(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
		...props,
		className: cn("flex flex-row px-2 overflow-x-auto text-fd-muted-foreground", props.className),
		children: props.children
	});
}
function CodeBlockTabsTrigger({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger$1, {
		...props,
		className: cn("relative group inline-flex text-sm font-medium text-nowrap items-center transition-colors gap-2 px-2 py-1.5 hover:text-fd-accent-foreground data-[state=active]:text-fd-primary [&_svg]:size-3.5", props.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary" }), children]
	});
}
function CodeBlockTab(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, { ...props });
}
function Image$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px",
		...props,
		className: cn("rounded-lg", props.className)
	});
}
function Table(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-auto prose-no-margin my-6",
		tabIndex: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { ...props })
	});
}
var defaultMdxComponents = {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	pre: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pre, { children: props.children })
	}),
	Card,
	Cards,
	a: Link$2,
	img: Image$1,
	h1: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h1",
		...props
	}),
	h2: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h2",
		...props
	}),
	h3: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h3",
		...props
	}),
	h4: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h4",
		...props
	}),
	h5: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h5",
		...props
	}),
	h6: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
		as: "h6",
		...props
	}),
	table: Table,
	Callout,
	CalloutContainer,
	CalloutTitle,
	CalloutDescription
};
var HeroVideo = ({ source, className }) => {
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
		const synchronizePlayback = () => {
			if (motionPreference.matches) {
				video.pause();
				return;
			}
			video.play()?.catch(() => {});
		};
		synchronizePlayback();
		motionPreference.addEventListener("change", synchronizePlayback);
		return () => {
			motionPreference.removeEventListener("change", synchronizePlayback);
			video.pause();
		};
	}, [source.src]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref: videoRef,
		className,
		muted: true,
		loop: true,
		playsInline: true,
		preload: "metadata",
		poster: source.poster,
		controls: false,
		disablePictureInPicture: true,
		tabIndex: -1,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
			src: source.src,
			type: source.type
		})
	});
};
var Hero = ({ as: Component = "section", titleAs: Heading = "h1", id, testId, className, contentClassName, mediaClassName, style, layout = "split", mediaPosition = "right", alignment = "start", height = "auto", theme = "light", overlay = "none", contentWidth = "normal", reverseOnMobile = true, eyebrow, title, description, media, backgroundImage, backgroundVideo, actions, search, meta, children, role, ariaLabel, ariaLabelledBy }) => {
	const hasMedia = Boolean(media || backgroundImage || backgroundVideo);
	const hasBackground = Boolean(backgroundImage || backgroundVideo || mediaPosition === "background" && media);
	const rootClassName = ["puzzle-hero", className].filter(Boolean).join(" ");
	const contentClasses = ["puzzle-hero__content", contentClassName].filter(Boolean).join(" ");
	const mediaClasses = ["puzzle-hero__media", mediaClassName].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Component, {
		id,
		"data-testid": testId,
		className: rootClassName,
		style,
		"data-layout": layout,
		"data-media-position": mediaPosition,
		"data-alignment": alignment,
		"data-height": height,
		"data-theme": theme,
		"data-overlay": overlay,
		"data-content-width": contentWidth,
		"data-has-media": hasMedia,
		"data-has-background": hasBackground,
		"data-reverse-mobile": reverseOnMobile,
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledBy,
		role,
		children: [hasBackground && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "puzzle-hero__background",
			"aria-hidden": "true",
			"data-hero-background": true,
			children: [
				backgroundImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "puzzle-hero__background-image",
					src: backgroundImage,
					alt: "",
					loading: "eager",
					decoding: "async",
					draggable: false
				}),
				backgroundVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroVideo, {
					source: backgroundVideo,
					className: "puzzle-hero__background-video"
				}),
				mediaPosition === "background" && media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "puzzle-hero__background-media",
					children: media
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "puzzle-hero__overlay" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "puzzle-hero__inner",
			"data-hero-inner": true,
			children: [media && mediaPosition !== "background" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: mediaClasses,
				"data-hero-media": true,
				children: media
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: contentClasses,
				"data-hero-content": true,
				children: [
					eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__eyebrow",
						children: eyebrow
					}),
					title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						className: "puzzle-hero__title",
						children: title
					}),
					description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__description",
						children: description
					}),
					children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__children",
						children
					}),
					actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__actions",
						children: actions
					}),
					search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__search",
						children: search
					}),
					meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-hero__meta",
						children: meta
					})
				]
			})]
		})]
	});
};
var mergeHeroPresetProps = (defaults, props) => ({
	...defaults,
	...props
});
var createHeroPreset = (defaults) => {
	const HeroPreset = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { ...mergeHeroPresetProps(defaults, props) });
	return HeroPreset;
};
var SplitHero = createHeroPreset({
	layout: "split",
	mediaPosition: "right",
	alignment: "start",
	height: "auto",
	theme: "light",
	overlay: "none"
});
var CenteredHero = createHeroPreset({
	layout: "centered",
	alignment: "center",
	height: "auto",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var FullScreenHero = createHeroPreset({
	layout: "full-width",
	mediaPosition: "background",
	alignment: "center",
	height: "viewport",
	theme: "dark",
	overlay: "gradient",
	contentWidth: "wide"
});
var VideoHero = ({ backgroundVideo, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
	layout: "full-width",
	mediaPosition: "background",
	alignment: "center",
	height: "viewport",
	theme: "dark",
	overlay: "gradient",
	...props,
	backgroundVideo
});
var ImageHero = ({ backgroundImage, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
	layout: "full-width",
	mediaPosition: "background",
	alignment: "center",
	height: "large",
	theme: "dark",
	overlay: "gradient",
	...props,
	backgroundImage
});
var MinimalHero = createHeroPreset({
	layout: "centered",
	alignment: "start",
	height: "auto",
	theme: "light",
	overlay: "none",
	contentWidth: "narrow"
});
var EditorialHero = createHeroPreset({
	layout: "asymmetric",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var AgencyHero = createHeroPreset({
	layout: "asymmetric",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "dark",
	overlay: "none",
	contentWidth: "normal"
});
var ProductHero = createHeroPreset({
	layout: "split",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var SaaSHero = createHeroPreset({
	layout: "asymmetric",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var StoreHero = createHeroPreset({
	layout: "split",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var RestaurantHero = createHeroPreset({
	layout: "full-width",
	mediaPosition: "background",
	alignment: "start",
	height: "large",
	theme: "dark",
	overlay: "gradient",
	contentWidth: "normal"
});
var AccommodationHero = createHeroPreset({
	layout: "full-width",
	mediaPosition: "background",
	alignment: "center",
	height: "viewport",
	theme: "dark",
	overlay: "gradient",
	contentWidth: "wide"
});
var PrintShopHero = createHeroPreset({
	layout: "split",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var DashboardWelcomeHero = createHeroPreset({
	layout: "full-width",
	alignment: "start",
	height: "auto",
	theme: "light",
	overlay: "none",
	contentWidth: "full"
});
var AppHero = createHeroPreset({
	layout: "split",
	mediaPosition: "right",
	alignment: "start",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "normal"
});
var CampaignHero = createHeroPreset({
	layout: "full-width",
	mediaPosition: "background",
	alignment: "center",
	height: "large",
	theme: "contrast",
	overlay: "gradient",
	contentWidth: "wide"
});
var ComingSoonHero = createHeroPreset({
	layout: "centered",
	alignment: "center",
	height: "viewport",
	theme: "dark",
	overlay: "none",
	contentWidth: "narrow"
});
var SearchHero = createHeroPreset({
	layout: "centered",
	alignment: "center",
	height: "large",
	theme: "light",
	overlay: "none",
	contentWidth: "wide"
});
var src_exports = /* @__PURE__ */ __exportAll$1({
	AccommodationHero: () => AccommodationHero,
	AgencyHero: () => AgencyHero,
	AppHero: () => AppHero,
	CampaignHero: () => CampaignHero,
	CenteredHero: () => CenteredHero,
	ComingSoonHero: () => ComingSoonHero,
	DashboardWelcomeHero: () => DashboardWelcomeHero,
	EditorialHero: () => EditorialHero,
	FullScreenHero: () => FullScreenHero,
	Hero: () => Hero,
	ImageHero: () => ImageHero,
	MinimalHero: () => MinimalHero,
	PrintShopHero: () => PrintShopHero,
	ProductHero: () => ProductHero,
	RestaurantHero: () => RestaurantHero,
	SaaSHero: () => SaaSHero,
	SearchHero: () => SearchHero,
	SplitHero: () => SplitHero,
	StoreHero: () => StoreHero,
	VideoHero: () => VideoHero
});
var TabsContext = (0, import_react.createContext)(null);
function useTabContext() {
	const ctx = (0, import_react.useContext)(TabsContext);
	if (!ctx) throw new Error("You must wrap your component in <Tabs>");
	return ctx;
}
function TabsList(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
		...props,
		className: cn("flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose", props.className)
	});
}
function TabsTrigger(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
		...props,
		className: cn("inline-flex items-center gap-2 whitespace-nowrap text-fd-muted-foreground border-b border-transparent py-2 text-sm font-medium transition-colors [&_svg]:size-4 hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary", props.className)
	});
}
function Tabs({ ref, className, items, label, defaultIndex = 0, defaultValue = items ? escapeValue(items[defaultIndex]) : void 0, ...props }) {
	const collection = (0, import_react.useMemo)(() => [], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs$1, {
		ref,
		className: cn("flex flex-col overflow-hidden rounded-xl border bg-fd-secondary my-4", className),
		defaultValue,
		...props,
		children: [items && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium my-auto me-auto",
			children: label
		}), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
			value: escapeValue(item),
			children: item
		}, item))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContext.Provider, {
			value: (0, import_react.useMemo)(() => ({
				items,
				collection
			}), [collection, items]),
			children: props.children
		})]
	});
}
function Tab({ value, ...props }) {
	const { items } = useTabContext();
	const resolved = value ?? items?.at(useCollectionIndex());
	if (!resolved) throw new Error("Failed to resolve tab `value`, please pass a `value` prop to the Tab component.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
		value: escapeValue(resolved),
		...props,
		children: props.children
	});
}
function TabsContent({ value, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
		value,
		className: cn("p-4 text-[0.9375rem] bg-fd-background rounded-xl outline-none prose-no-margin data-[state=inactive]:hidden [&>figure:only-child]:-m-4 [&>figure:only-child]:border-none", className),
		...props,
		children: props.children
	});
}
/**
* Inspired by Headless UI.
*
* Return the index of children, this is made possible by registering the order of render from children using React context.
* This is supposed by work with pre-rendering & pure client-side rendering.
*/
function useCollectionIndex() {
	const key = (0, import_react.useId)();
	const { collection } = useTabContext();
	(0, import_react.useEffect)(() => {
		return () => {
			const idx = collection.indexOf(key);
			if (idx !== -1) collection.splice(idx, 1);
		};
	}, [key, collection]);
	if (!collection.includes(key)) collection.push(key);
	return collection.indexOf(key);
}
/**
* only escape whitespaces in values in simple mode
*/
function escapeValue(v) {
	return v.toLowerCase().replace(/\s+/g, "-");
}
var PackageManagerTabs = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
	items: [
		"npm",
		"bun",
		"pnpm",
		"yarn"
	],
	groupId: "puzzle-package-manager",
	persist: true,
	children
});
var puzzleComponentEntries = [
	Object.entries(src_exports$1),
	Object.entries(src_exports),
	Object.entries(src_exports$2)
].flat();
var puzzleComponents = Object.fromEntries(puzzleComponentEntries.filter(([name]) => /^[A-Z]/.test(name)));
var createHeading = (tag, level) => {
	const Base = defaultMdxComponents[tag];
	const Heading = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Base, {
		...props,
		className: cn$1("puzzle-docs-heading", `puzzle-typography-${level}`, props.className)
	});
	return Heading;
};
var headings = {
	h1: createHeading("h1", "headline1"),
	h2: createHeading("h2", "headline2"),
	h3: createHeading("h3", "headline3"),
	h4: createHeading("h4", "headline4")
};
function getMDXComponents(components) {
	return {
		...defaultMdxComponents,
		...puzzleComponents,
		...headings,
		PackageManagerTabs,
		PackageManagerTab: Tab,
		...components
	};
}
var useMDXComponents = getMDXComponents;
/**
* Toggle between light/dark mode with a hotkey, must be placed under `next-themes` provider.
*/
function ThemeHotKey({ hotKey }) {
	const { setTheme, resolvedTheme } = z();
	useHotKey((e) => {
		if (!(typeof hotKey === "string" ? !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === hotKey.toLowerCase() : hotKey(e))) return;
		e.preventDefault();
		const next = resolvedTheme === "dark" ? "light" : "dark";
		if (document?.startViewTransition) document.startViewTransition(() => (0, import_react_dom.flushSync)(() => setTheme(next)));
		else setTheme(next);
	}, { ignoreTyping: true });
	return null;
}
function RootProvider$1({ children, dir = "ltr", theme = {}, search, i18n }) {
	let body = children;
	if (search?.enabled !== false) body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchProvider, {
		...search,
		children: body
	});
	if (theme?.enabled !== false) {
		const { enabled: _, hotKey = "d", ...themeProps } = theme;
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(J, {
			attribute: "class",
			defaultTheme: "system",
			enableSystem: true,
			disableTransitionOnChange: true,
			...themeProps,
			children: [hotKey !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeHotKey, { hotKey }), body]
		});
	}
	if (i18n) body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, {
		...i18n,
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectionProvider, {
		dir,
		children: body
	});
}
var framework = {
	Link({ href = "", prefetch = true, ...props }) {
		const router = useRouter();
		if (href.startsWith("#")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			...props
		});
		const hashIdx = href.indexOf("#");
		const path = hashIdx === -1 ? href : href.slice(0, hashIdx);
		const searchIdx = path.indexOf("?");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$3, {
			to: searchIdx === -1 ? path : path.slice(0, searchIdx),
			search: searchIdx === -1 ? void 0 : router.options.parseSearch(path.slice(searchIdx)),
			hash: hashIdx === -1 ? void 0 : href.slice(hashIdx + 1),
			preload: prefetch ? "intent" : false,
			...props,
			children: props.children
		});
	},
	usePathname() {
		const { isLoading, pathname } = useRouterState({ select: (state) => ({
			isLoading: state.isLoading,
			pathname: state.location.pathname
		}) });
		const activePathname = (0, import_react.useRef)(pathname);
		return (0, import_react.useMemo)(() => {
			if (isLoading) return activePathname.current;
			activePathname.current = pathname;
			return pathname;
		}, [isLoading, pathname]);
	},
	useRouter() {
		const router = useRouter();
		return (0, import_react.useMemo)(() => ({
			push(url) {
				router.navigate({ href: url });
			},
			refresh() {
				router.invalidate();
			}
		}), [router]);
	},
	useParams() {
		return useParams({ strict: false });
	}
};
/**
* Fumadocs adapter for Tanstack Router/Start
*/
function TanstackProvider({ children, Link: CustomLink, Image: CustomImage }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameworkProvider, {
		...framework,
		Link: CustomLink ?? framework.Link,
		Image: CustomImage ?? framework.Image,
		children
	});
}
function RootProvider({ components, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TanstackProvider, {
		Link: components?.Link,
		Image: components?.Image,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootProvider$1, {
			...props,
			children: props.children
		})
	});
}
var folder$2 = "/docs/developer";
var developer = {
	id: "developer",
	label: "Developer Guide",
	children: [
		{
			id: "developer-create-project",
			label: "Create a Project",
			href: `${folder$2}/create-project`
		},
		{
			id: "developer-authentication",
			label: "Authentication Setup",
			href: `${folder$2}/authentication`
		},
		{
			id: "developer-contributing",
			label: "Contributing",
			href: `${folder$2}/contributing`
		},
		{
			id: "developer-testing",
			label: "Testing",
			href: `${folder$2}/testing`
		}
	]
};
var folder$1 = "/docs/ui";
var actions = {
	id: "ui-actions",
	label: "Actions",
	children: [
		{
			id: "ui-button-group",
			label: "Button Group",
			href: `${folder$1}/actions/button-group`
		},
		{
			id: "ui-button",
			label: "Button",
			href: `${folder$1}/actions/button`
		},
		{
			id: "ui-toggle-group",
			label: "Toggle Group",
			href: `${folder$1}/actions/toggle-group`
		}
	]
};
var dataDisplay = {
	id: "ui-data-display",
	label: "Data Display",
	children: [
		{
			id: "ui-alert",
			label: "Alert",
			href: `${folder$1}/data-display/alert`
		},
		{
			id: "ui-avatar",
			label: "Avatar",
			href: `${folder$1}/data-display/avatar`
		},
		{
			id: "ui-badge",
			label: "Badge",
			href: `${folder$1}/data-display/badge`
		},
		{
			id: "ui-card",
			label: "Card",
			href: `${folder$1}/data-display/card`
		},
		{
			id: "ui-empty-state",
			label: "Empty State",
			href: `${folder$1}/data-display/empty-state`
		},
		{
			id: "ui-image",
			label: "Image",
			href: `${folder$1}/data-display/image`
		},
		{
			id: "ui-paper",
			label: "Paper",
			href: `${folder$1}/data-display/paper`
		},
		{
			id: "ui-progress",
			label: "Progress",
			href: `${folder$1}/data-display/progress`
		},
		{
			id: "ui-rating",
			label: "Rating",
			href: `${folder$1}/data-display/rating`
		},
		{
			id: "ui-skeleton",
			label: "Skeleton",
			href: `${folder$1}/data-display/skeleton`
		}
	]
};
var editors = {
	id: "ui-editors",
	label: "Editors",
	children: [{
		id: "ui-text-editor",
		label: "Text Editor",
		href: `${folder$1}/editors/text-editor`
	}]
};
var forms = {
	id: "ui-forms",
	label: "Forms",
	children: [
		{
			id: "ui-autocomplete",
			label: "Autocomplete",
			href: `${folder$1}/forms/autocomplete`
		},
		{
			id: "ui-checkbox",
			label: "Checkbox",
			href: `${folder$1}/forms/checkbox`
		},
		{
			id: "ui-color-picker",
			label: "Color Picker",
			href: `${folder$1}/forms/color-picker`
		},
		{
			id: "ui-date-picker",
			label: "Date Picker",
			href: `${folder$1}/forms/date-picker`
		},
		{
			id: "ui-file-upload",
			label: "File Upload",
			href: `${folder$1}/forms/file-upload`
		},
		{
			id: "ui-form-field",
			label: "Form Field",
			href: `${folder$1}/forms/form-field`
		},
		{
			id: "ui-input-group",
			label: "Input Group",
			href: `${folder$1}/forms/input-group`
		},
		{
			id: "ui-label",
			label: "Label",
			href: `${folder$1}/forms/label`
		},
		{
			id: "ui-number-input",
			label: "Number Input",
			href: `${folder$1}/forms/number-input`
		},
		{
			id: "ui-radio-group",
			label: "Radio Group",
			href: `${folder$1}/forms/radio-group`
		},
		{
			id: "ui-select",
			label: "Select",
			href: `${folder$1}/forms/select`
		},
		{
			id: "ui-slider",
			label: "Slider",
			href: `${folder$1}/forms/slider`
		},
		{
			id: "ui-stepper",
			label: "Stepper",
			href: `${folder$1}/forms/stepper`
		},
		{
			id: "ui-switch",
			label: "Switch",
			href: `${folder$1}/forms/switch`
		},
		{
			id: "ui-text-area-input",
			label: "Text Area Input",
			href: `${folder$1}/forms/text-area-input`
		},
		{
			id: "ui-text-input",
			label: "Text Input",
			href: `${folder$1}/forms/text-input`
		},
		{
			id: "ui-time-picker",
			label: "Time Picker",
			href: `${folder$1}/forms/time-picker`
		},
		{
			id: "ui-token-input",
			label: "Token Input",
			href: `${folder$1}/forms/token-input`
		}
	]
};
var layout = {
	id: "ui-layout",
	label: "Layout",
	children: [
		{
			id: "ui-app-bar",
			label: "App Bar",
			href: `${folder$1}/layout/app-bar`
		},
		{
			id: "ui-aspect-ratio",
			label: "Aspect Ratio",
			href: `${folder$1}/layout/aspect-ratio`
		},
		{
			id: "ui-background",
			label: "Background",
			href: `${folder$1}/layout/background`
		},
		{
			id: "ui-bottom-navigation",
			label: "Bottom Navigation",
			href: `${folder$1}/layout/bottom-navigation`
		},
		{
			id: "ui-breadcrumbs",
			label: "Breadcrumbs",
			href: `${folder$1}/layout/breadcrumbs`
		},
		{
			id: "ui-collapsable-sidebar",
			label: "Collapsable Sidebar",
			href: `${folder$1}/layout/collapsable-sidebar`
		},
		{
			id: "ui-container",
			label: "Container",
			href: `${folder$1}/layout/container`
		},
		{
			id: "ui-page-layout",
			label: "Page Layout",
			href: `${folder$1}/layout/page-layout`
		},
		{
			id: "ui-resizable-panels",
			label: "Resizable Panels",
			href: `${folder$1}/layout/resizable-panels`
		},
		{
			id: "ui-scroll-area",
			label: "Scroll Area",
			href: `${folder$1}/layout/scroll-area`
		},
		{
			id: "ui-section",
			label: "Section",
			href: `${folder$1}/layout/section`
		},
		{
			id: "ui-section-stack",
			label: "Section Stack",
			href: `${folder$1}/layout/section-stack`
		},
		{
			id: "ui-separator",
			label: "Separator",
			href: `${folder$1}/layout/separator`
		},
		{
			id: "ui-sidebar",
			label: "Sidebar",
			href: `${folder$1}/layout/sidebar`
		},
		{
			id: "ui-stack",
			label: "Stack",
			href: `${folder$1}/layout/stack`
		}
	]
};
var navigation = {
	id: "ui-navigation",
	label: "Navigation",
	children: [
		{
			id: "ui-accordion",
			label: "Accordion",
			href: `${folder$1}/navigation/accordion`
		},
		{
			id: "ui-carousel",
			label: "Carousel",
			href: `${folder$1}/navigation/carousel`
		},
		{
			id: "ui-link",
			label: "Link",
			href: `${folder$1}/navigation/link`
		},
		{
			id: "ui-pagination",
			label: "Pagination",
			href: `${folder$1}/navigation/pagination`
		},
		{
			id: "ui-tabs",
			label: "Tabs",
			href: `${folder$1}/navigation/tabs`
		},
		{
			id: "ui-tree-view",
			label: "Tree View",
			href: `${folder$1}/navigation/tree-view`
		}
	]
};
var overlays = {
	id: "ui-overlays",
	label: "Overlays",
	children: [
		{
			id: "ui-backdrop",
			label: "Backdrop",
			href: `${folder$1}/overlays/backdrop`
		},
		{
			id: "ui-command",
			label: "Command",
			href: `${folder$1}/overlays/command`
		},
		{
			id: "ui-context-menu",
			label: "Context Menu",
			href: `${folder$1}/overlays/context-menu`
		},
		{
			id: "ui-dialog",
			label: "Dialog",
			href: `${folder$1}/overlays/dialog`
		},
		{
			id: "ui-drawer",
			label: "Drawer",
			href: `${folder$1}/overlays/drawer`
		},
		{
			id: "ui-dropdown-menu",
			label: "Dropdown Menu",
			href: `${folder$1}/overlays/dropdown-menu`
		},
		{
			id: "ui-notification",
			label: "Notification",
			href: `${folder$1}/overlays/notification`
		},
		{
			id: "ui-popout",
			label: "Popout",
			href: `${folder$1}/overlays/popout`
		},
		{
			id: "ui-popover",
			label: "Popover",
			href: `${folder$1}/overlays/popover`
		},
		{
			id: "ui-portal",
			label: "Portal",
			href: `${folder$1}/overlays/portal`
		},
		{
			id: "ui-tooltip",
			label: "Tooltip",
			href: `${folder$1}/overlays/tooltip`
		}
	]
};
var typography = {
	id: "ui-typography",
	label: "Typography",
	children: [{
		id: "ui-heading",
		label: "Heading",
		href: `${folder$1}/typography/heading`
	}, {
		id: "ui-text",
		label: "Text",
		href: `${folder$1}/typography/text`
	}]
};
var utilities = {
	id: "ui-utilities",
	label: "Utilities",
	children: [
		{
			id: "ui-preview",
			label: "Preview",
			href: `${folder$1}/utilities/preview`
		},
		{
			id: "ui-scroll-lock",
			label: "Scroll Lock",
			href: `${folder$1}/utilities/scroll-lock`
		},
		{
			id: "ui-transition",
			label: "Transition",
			href: `${folder$1}/utilities/transition`
		}
	]
};
var ui = {
	id: "ui",
	label: "UI",
	children: [
		{
			id: "ui-overview",
			label: "Overview",
			href: folder$1
		},
		actions,
		dataDisplay,
		editors,
		forms,
		layout,
		navigation,
		overlays,
		typography,
		utilities
	]
};
var ALL_UI_GROUP_IDS = [
	"ui",
	"ui-actions",
	"ui-data-display",
	"ui-editors",
	"ui-forms",
	"ui-layout",
	"ui-navigation",
	"ui-overlays",
	"ui-typography",
	"ui-utilities"
];
var pieces = {
	id: "pieces",
	label: "Pieces",
	children: [{
		id: "pieces-components",
		label: "Components",
		children: [{
			id: "pieces-hero",
			label: "Hero",
			href: `/docs/pieces/components/hero`
		}]
	}]
};
var folder = "/docs/theme";
var items = [
	{
		id: "getting-started",
		label: "Getting Started",
		href: "/docs/getting-started"
	},
	developer,
	{
		id: "theme",
		label: "Theme",
		children: [
			{
				id: "theme-overview",
				label: "Overview",
				href: folder
			},
			{
				id: "theme-provider",
				label: "Theme Provider",
				href: `${folder}/theme-provider`
			},
			{
				id: "theme-tokens",
				label: "Design Tokens",
				href: `${folder}/tokens`
			},
			{
				id: "theme-colors",
				label: "Colors",
				href: `${folder}/colors`
			},
			{
				id: "theme-typography",
				label: "Typography & Fonts",
				href: `${folder}/typography`
			},
			{
				id: "theme-breakpoints",
				label: "Breakpoints",
				href: `${folder}/breakpoints`
			},
			{
				id: "theme-components",
				label: "Component Overrides",
				href: `${folder}/components`
			}
		]
	},
	pieces,
	ui
];
var findComponentItems = (items) => {
	if (Array.isArray(items)) return items.flatMap((item) => findComponentItems(item));
	if (items.children) return findComponentItems(items.children).flat();
	return [items];
};
var componentItems = findComponentItems(items).map((item) => ({
	label: typeof item.label === "string" ? item.label : stringWithCasing(item.id, "pascalcase"),
	value: item.href
}));
var Sidebar = () => {
	const navigate = useNavigate();
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const matchRoute = useMatchRoute();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar$2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		direction: "col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Autocomplete, {
			placeholder: "Search",
			options: componentItems,
			onChange: (value) => {
				navigate({ to: value });
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeView, {
			"aria-label": "Navigation",
			items,
			selectionMode: "single",
			defaultExpandedIds: [
				...ALL_UI_GROUP_IDS,
				"pieces-components",
				"developer"
			],
			selectedIds,
			onSelectionChange: setSelectedIds,
			getItemActive: (item) => Boolean(item.href && matchRoute({
				to: item.href,
				fuzzy: false
			}))
		})]
	}) });
};
function Content({ path }) {
	const page = docs.getPage(path);
	if (!page) throw new Error(`unknown page: ${path}`);
	const { toc } = (0, import_react.use)(page.load());
	const MDX = page.body;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DocsPage, {
		toc,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsTitle, { children: page.title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsDescription, { children: page.description }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MDX, { components: useMDXComponents() }) })
		]
	});
}
function Page() {
	const data = useFumadocsLoader(Route.useLoaderData());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLayout.Header, {
			className: "puzzle-site-header",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header$2, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLayout.LeftSidebar, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageLayout.Main, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootProvider, {
			theme: { enabled: false },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsLayout, {
				...baseOptions(),
				containerProps: { className: "puzzle-site-docs" },
				tree: data.pageTree,
				sidebar: { enabled: false },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, { path: data.path }) })
			})
		}), ";"] })
	] });
}
export { Page as component };
