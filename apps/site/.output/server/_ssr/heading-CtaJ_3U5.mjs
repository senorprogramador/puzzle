import { __toESM } from "../_runtime.mjs";
import { Drawer, Stack, resolveResponsiveValue } from "./carousel-DRWW6spl.mjs";
import { Icon$1, Link, Section, cn } from "./section-Cp-bzptr.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/heading-CtaJ_3U5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var normalizeHue = (hue) => (hue % 360 + 360) % 360;
var normalizeAlpha = (value) => {
	if (value === void 0) return 1;
	return clamp(value.endsWith("%") ? Number.parseFloat(value) / 100 : Number.parseFloat(value), 0, 1);
};
var normalizeChannel = (value) => {
	return clamp(value.endsWith("%") ? Number.parseFloat(value) / 100 * 255 : Number.parseFloat(value), 0, 255);
};
var getColorType = (color) => {
	const value = color.trim().toLowerCase();
	if (/^var\(\s*--[\w-]+(?:\s*,\s*.+)?\)$/.test(value)) return "css-variable";
	if (/^#[\da-f]{8}$/.test(value) || /^#[\da-f]{4}$/.test(value)) return "hexa";
	if (/^#[\da-f]{6}$/.test(value) || /^#[\da-f]{3}$/.test(value)) return "hex";
	if (/^rgba\(/.test(value)) return "rgba";
	if (/^rgb\(/.test(value)) return "rgb";
	if (/^hsla\(/.test(value)) return "hsla";
	if (/^hsl\(/.test(value)) return "hsl";
	if (/^[a-z]+$/.test(value)) return "named";
	return "unknown";
};
var hexToRgba = (hex) => {
	const value = hex.trim().replace(/^#/, "");
	if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) throw new Error(`Invalid HEX color: ${hex}`);
	const expanded = value.length <= 4 ? [...value].map((channel) => channel + channel).join("") : value;
	return {
		r: Number.parseInt(expanded.slice(0, 2), 16),
		g: Number.parseInt(expanded.slice(2, 4), 16),
		b: Number.parseInt(expanded.slice(4, 6), 16),
		a: expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1
	};
};
var parseRgb = (color) => {
	const match = color.trim().match(/^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
	if (!match) return null;
	const [, r, g, b, alpha] = match;
	if (r === void 0 || g === void 0 || b === void 0) return null;
	return {
		r: normalizeChannel(r),
		g: normalizeChannel(g),
		b: normalizeChannel(b),
		a: normalizeAlpha(alpha)
	};
};
var hslToRgb = ({ h, s, l, a = 1 }) => {
	const hue = normalizeHue(h) / 360;
	const saturation = clamp(s / 100, 0, 1);
	const lightness = clamp(l / 100, 0, 1);
	const channel = (n) => {
		const k = (n + hue * 12) % 12;
		const chroma = saturation * Math.min(lightness, 1 - lightness);
		return Math.round((lightness - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
	};
	return {
		r: channel(0),
		g: channel(8),
		b: channel(4),
		a: clamp(a, 0, 1)
	};
};
var rgbToHsl = ({ r, g, b, a = 1 }) => {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;
	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));
		if (max === red) h = 60 * ((green - blue) / delta % 6);
		else if (max === green) h = 60 * ((blue - red) / delta + 2);
		else h = 60 * ((red - green) / delta + 4);
	}
	return {
		h: normalizeHue(h),
		s: s * 100,
		l: l * 100,
		a
	};
};
var parseHsl = (color) => {
	const match = color.trim().match(/^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
	if (!match) return null;
	const [, h, s, l, alpha] = match;
	return hslToRgb({
		h: Number(h),
		s: Number(s),
		l: Number(l),
		a: normalizeAlpha(alpha)
	});
};
var parseColor = (color) => {
	const type = getColorType(color);
	if (type === "hex" || type === "hexa") return hexToRgba(color);
	if (type === "rgb" || type === "rgba") return parseRgb(color);
	if (type === "hsl" || type === "hsla") return parseHsl(color);
	return null;
};
var rgbToCss = ({ r, g, b, a }) => a < 1 ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(a.toFixed(3))})` : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
var hslToCss = ({ h, s, l, a }) => a < 1 ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${Number(a.toFixed(3))})` : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
var getColorLuminance = (color) => {
	const rgb = parseColor(color);
	if (!rgb) return null;
	const linearize = (value) => {
		const channel = value / 255;
		return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
	};
	return .2126 * linearize(rgb.r) + .7152 * linearize(rgb.g) + .0722 * linearize(rgb.b);
};
var isColorDark = (color) => {
	const luminance = getColorLuminance(color);
	return luminance === null ? null : luminance < .179;
};
var isHexColor = (color) => /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color.trim());
var isDarkColor = (color) => {
	const result = isColorDark(color);
	if (result === null) throw new Error(`Unsupported color: ${color}`);
	return result;
};
var Badge = ({ content, size = 20, color = "primary", anchorOrigin = {
	vertical: "top",
	horizontal: "right"
}, anchorOffset = {
	vertical: 0,
	horizontal: 0
}, anchorOverlap = "rectangular", className, children }) => {
	if (!Number.isFinite(anchorOffset.vertical) || !Number.isFinite(anchorOffset.horizontal)) throw new TypeError("Badge anchorOffset values must be finite numbers.");
	const resolvedSize = Math.max(size, 16);
	const isHex = isHexColor(color);
	const isDark = isHex ? isDarkColor(color) : false;
	const classes = cn("puzzle-badge", children != null && [
		anchorOrigin.vertical,
		anchorOrigin.horizontal,
		anchorOverlap
	], children == null && "puzzle-badge-standalone", !isHex && `puzzle-badge-${color}`, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: classes,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "puzzle-badge-indicator",
			style: {
				fontSize: `clamp(0.7rem, calc(${resolvedSize}px - 1em), 4rem)`,
				minHeight: `${resolvedSize}px`,
				minWidth: `${resolvedSize}px`,
				translate: children != null ? `${anchorOffset.horizontal * (anchorOrigin.horizontal === "left" ? 1 : -1)}px ${anchorOffset.vertical * (anchorOrigin.vertical === "top" ? 1 : -1)}px` : void 0,
				backgroundColor: isHex ? color : void 0,
				color: isHex ? isDark ? "var(--puzzle-color-light-foreground)" : "var(--puzzle-color-dark-foreground)" : void 0
			},
			children: content
		})]
	});
};
var Checkbox = ({ label, children, description, size = "md", indeterminate = false, className, style, id, ref, disabled = false, required = false, "aria-describedby": ariaDescribedBy, ...inputProps }) => {
	const checkboxLabel = label ?? children;
	const generatedId = (0, import_react.useId)();
	const descriptionId = description != null ? `${id ?? generatedId}-description` : void 0;
	const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || void 0;
	const setInputRef = (0, import_react.useCallback)((node) => {
		if (node) node.indeterminate = indeterminate;
		if (typeof ref === "function") return ref(node);
		if (ref) ref.current = node;
	}, [indeterminate, ref]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("puzzle-checkbox", `puzzle-checkbox--${size}`, (inputProps.checked ?? inputProps.defaultChecked) && "puzzle-checkbox--checked", indeterminate && "puzzle-checkbox--indeterminate", disabled && "puzzle-checkbox--disabled", className),
		style,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "puzzle-checkbox__control",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...inputProps,
				ref: setInputRef,
				id,
				type: "checkbox",
				disabled,
				required,
				"aria-describedby": describedBy
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "puzzle-checkbox__indicator",
				viewBox: "0 0 18 18",
				"aria-hidden": "true",
				focusable: "false",
				fill: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						fill: "currentColor",
						x: "0",
						y: "0",
						width: "18",
						height: "18",
						rx: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						className: "puzzle-checkbox__check",
						d: "M2.75 9.25 7 13.5 15.25 4.75",
						strokeWidth: "3",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						className: "puzzle-checkbox__mixed",
						d: "M4.25 9h9.5",
						strokeWidth: "3",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				]
			})]
		}), (checkboxLabel != null || description != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "puzzle-checkbox__content",
			children: [checkboxLabel != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "puzzle-checkbox__label",
				children: [checkboxLabel, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "puzzle-checkbox__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}), description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				id: descriptionId,
				className: "puzzle-checkbox__description",
				children: description
			})]
		})]
	});
};
var TextInput = ({ type = "text", prefix, suffix, className, disabled, ref, ...props }) => {
	const [passwordVisible, setPasswordVisible] = (0, import_react.useState)(false);
	const isPassword = type === "password";
	const resolvedType = isPassword ? passwordVisible ? "text" : "password" : type === "phone" ? "tel" : type;
	const resolvedPrefix = prefix !== void 0 ? prefix : type === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:mail" }) : type === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: "lucide:phone" }) : null;
	const resolvedSuffix = suffix !== void 0 ? suffix : isPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "puzzle-input__icon-button",
		"aria-label": passwordVisible ? "Hide password" : "Show password",
		"aria-pressed": passwordVisible,
		disabled,
		onClick: () => setPasswordVisible((visible) => !visible),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, { name: passwordVisible ? "lucide:eye-off" : "lucide:eye" })
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("puzzle-input", "puzzle-input--text", className),
		"data-disabled": disabled || void 0,
		children: [
			resolvedPrefix != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-input__affix puzzle-input__prefix",
				"aria-hidden": "true",
				children: resolvedPrefix
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...props,
				ref,
				type: resolvedType,
				disabled,
				className: "puzzle-input__control"
			}),
			resolvedSuffix != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-input__affix puzzle-input__suffix",
				children: resolvedSuffix
			})
		]
	});
};
var Switch = ({ size = "md", label, description, checked, defaultChecked, disabled = false, required = false, className, id, onChange, "aria-describedby": ariaDescribedBy, ...rest }) => {
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? (description != null ? generatedId : void 0);
	const descriptionId = description != null ? `${inputId ?? generatedId}-description` : void 0;
	const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || void 0;
	const classes = cn("puzzle-switch", `puzzle-switch--${size}`, disabled && "puzzle-switch--disabled", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: classes,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...rest,
				id: inputId,
				className: "puzzle-switch__input",
				type: "checkbox",
				role: "switch",
				...checked !== void 0 ? { checked } : defaultChecked !== void 0 ? { defaultChecked } : {},
				disabled,
				required,
				"aria-describedby": describedBy,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "puzzle-switch__control",
				"aria-hidden": "true"
			}),
			(label != null || description != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("puzzle-switch__content", label == null && "puzzle-switch__content--description-only"),
				children: [label, description != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: descriptionId,
					className: "puzzle-switch__description",
					children: description
				})]
			})
		]
	});
};
var useIsomorphicLayoutEffect = typeof window === "undefined" ? import_react.useEffect : import_react.useLayoutEffect;
var AppBar = ({ logo, title, logoHref = "/", navigationItems = [], customNavigationItems = [], renderCustomNavigationItems, trailingComponents, sticky = false, ariaLabel = "Main navigation", className }) => {
	const [open, setOpen] = (0, import_react.useState)(false);
	const appBarRef = (0, import_react.useRef)(null);
	const navigationId = `puzzle-app-bar-nav-${(0, import_react.useId)()}`;
	const hasBrand = logo != null || title != null;
	const hasCustomNavigation = customNavigationItems.length > 0 && renderCustomNavigationItems != null;
	const hasNavigation = navigationItems.length > 0 || hasCustomNavigation;
	const style = { "--puzzle-app-bar-sticky": sticky ? "sticky" : "relative" };
	useIsomorphicLayoutEffect(() => {
		if (!sticky) return;
		const appBar = appBarRef.current;
		if (!appBar) return;
		const pageLayout = appBar.closest("[data-puzzle-page-layout]");
		const parent = appBar.parentElement;
		const isPageHeader = parent?.classList.contains("puzzle-page-layout__header") && parent.parentElement === pageLayout;
		if (pageLayout && parent !== pageLayout && !isPageHeader) return;
		const scope = pageLayout ?? appBar.ownerDocument.documentElement;
		const property = "--puzzle-sticky-offset";
		const previousValue = scope.style.getPropertyValue(property);
		const previousPriority = scope.style.getPropertyPriority(property);
		const updateOffset = () => {
			scope.style.setProperty(property, `${appBar.getBoundingClientRect().height}px`);
		};
		updateOffset();
		const observer = new ((appBar.ownerDocument.defaultView?.ResizeObserver) ?? ResizeObserver)(updateOffset);
		observer.observe(appBar);
		return () => {
			observer.disconnect();
			if (previousValue) scope.style.setProperty(property, previousValue, previousPriority);
			else scope.style.removeProperty(property);
		};
	}, [sticky]);
	const renderNavigationItems = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "puzzle-app-bar__list",
		children: [navigationItems.map(({ label, href, current, external }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			className: "puzzle-app-bar__link",
			href,
			"aria-current": current ? "page" : void 0,
			...external ? {
				target: "_blank",
				rel: "noopener noreferrer"
			} : {},
			onClick: () => setOpen(false),
			children: label
		}) }, href)), hasCustomNavigation && customNavigationItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: renderCustomNavigationItems(item, index) }, index))]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		ref: appBarRef,
		className: cn("puzzle-app-bar", className),
		style,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "puzzle-app-bar__inner",
			children: [
				hasBrand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "puzzle-app-bar__brand",
					href: logoHref,
					"aria-label": title ?? "Home",
					children: [logo, title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "puzzle-app-bar__title",
						children: title
					})]
				}),
				hasNavigation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "puzzle-app-bar__navigation",
					"aria-label": ariaLabel,
					children: renderNavigationItems()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "puzzle-app-bar__actions",
					children: [trailingComponents != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "puzzle-app-bar__trailing",
						children: trailingComponents
					}), hasNavigation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "puzzle-app-bar__menu-button",
						type: "button",
						"aria-label": "Open navigation",
						"aria-expanded": open,
						"aria-controls": navigationId,
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							"aria-hidden": "true",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 6h16M4 12h16M4 18h16" })
						})
					})]
				})
			]
		}), hasNavigation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: navigationId,
			className: "puzzle-app-bar__mobile",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer, {
				position: "right",
				open,
				onOpenChange: setOpen,
				className: "puzzle-app-bar__drawer",
				"aria-label": ariaLabel,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
						direction: "row",
						alignH: "between",
						alignV: "center",
						children: [hasBrand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "puzzle-app-bar__brand",
							href: logoHref,
							"aria-label": title ?? "Home",
							children: [logo, title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "puzzle-app-bar__title",
								children: title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "puzzle-app-bar__menu-button",
							type: "button",
							"aria-label": "Close navigation",
							"aria-expanded": open,
							"aria-controls": navigationId,
							onClick: () => setOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "×"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "puzzle-app-bar__drawer-navigation",
						"aria-label": ariaLabel,
						children: renderNavigationItems()
					})
				]
			})
		})]
	});
};
var Text = ({ as, type = "body1", className, textAlign, style, ...props }) => {
	const Component = as ?? "span";
	const classes = cn("puzzle-text", `puzzle-typography-${type}`, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		...props,
		className: classes,
		style: textAlign === void 0 ? style : {
			...style,
			textAlign
		}
	});
};
var cx = (...values) => values.filter(Boolean).join(" ");
var toCSSSize = (value) => value === void 0 ? void 0 : typeof value === "number" ? `${value}px` : value;
var createRegion = (type) => {
	const Region = (_props) => null;
	Region.displayName = `PageLayout.${type}`;
	return Object.assign(Region, { regionType: type });
};
var Header = createRegion("header");
var Main = createRegion("main");
var LeftSidebar = createRegion("leftSidebar");
var RightSidebar = createRegion("rightSidebar");
var Footer = createRegion("footer");
var PageLayoutBase = ({ children, className, contentClassName, style, maxWidth, gap, rowGap, columnGap, contentPaddingInline, contentPaddingBlock, minHeight, sidebarPlacement }) => {
	const placement = resolveResponsiveValue(sidebarPlacement ?? {
		mobile: "below",
		tablet: "below",
		desktop: "beside"
	});
	const regions = {};
	import_react.Children.forEach(children, (child) => {
		if (!(0, import_react.isValidElement)(child)) return;
		const type = child.type;
		if (type.regionType) regions[type.regionType] = child;
	});
	const renderRegion = (region, className, tag, ariaLabel) => {
		if (!region) return null;
		const { children: content, className: regionClassName, ...props } = region.props;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tag, {
			...props,
			className: cx(className, regionClassName),
			"aria-label": ariaLabel ?? props["aria-label"],
			children: content
		});
	};
	const layoutStyle = {
		"--puzzle-page-max-width": toCSSSize(maxWidth),
		"--puzzle-page-gap": toCSSSize(gap),
		"--puzzle-page-row-gap": toCSSSize(rowGap),
		"--puzzle-page-column-gap": toCSSSize(columnGap),
		"--puzzle-page-padding-inline": toCSSSize(contentPaddingInline),
		"--puzzle-page-padding-block": toCSSSize(contentPaddingBlock),
		"--puzzle-page-min-height": toCSSSize(minHeight),
		...style
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx("puzzle-page-layout", className),
		style: layoutStyle,
		"data-puzzle-page-layout": "",
		"data-sidebar-placement-mobile": placement.mobile,
		"data-sidebar-placement-tablet": placement.tablet,
		"data-sidebar-placement-desktop": placement.desktop,
		children: [
			renderRegion(regions.header, "puzzle-page-layout__header", "header"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx("puzzle-page-layout__content", contentClassName),
				children: [
					renderRegion(regions.main, "puzzle-page-layout__main", "main"),
					renderRegion(regions.leftSidebar, "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--left", "aside"),
					renderRegion(regions.rightSidebar, "puzzle-page-layout__sidebar puzzle-page-layout__sidebar--right", "aside")
				]
			}),
			renderRegion(regions.footer, "puzzle-page-layout__footer", "footer")
		]
	});
};
var PageLayout = Object.assign(PageLayoutBase, {
	Header,
	Main,
	LeftSidebar,
	RightSidebar,
	Footer
});
var isSection = (node) => (0, import_react.isValidElement)(node) && node.type === Section;
var SectionStack = ({ children, className, divideY }) => {
	const sections = import_react.Children.toArray(children);
	const enhancedSections = sections.map((child, index) => {
		if (!isSection(child)) return child;
		const previous = sections[index - 1];
		const next = sections[index + 1];
		const previousTheme = isSection(previous) ? previous.props.theme ?? "default" : void 0;
		const nextTheme = isSection(next) ? next.props.theme ?? "default" : void 0;
		const theme = child.props.theme ?? "default";
		return (0, import_react.cloneElement)(child, {
			compactTop: previousTheme === theme && index > 0,
			compactBottom: nextTheme === theme && index < sections.length - 1,
			divider: divideY && index < sections.length - 1
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("puzzle-section-stack", className),
		children: enhancedSections
	});
};
var Heading = ({ level, as, className, textAlign, style, ...props }) => {
	const Component = as ?? "h2";
	const classes = cn("puzzle-heading", `puzzle-typography-${level}`, className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		...props,
		className: classes,
		style: textAlign === void 0 ? style : {
			...style,
			textAlign
		}
	});
};
export { AppBar, Badge, Checkbox, Heading, PageLayout, SectionStack, Switch, Text, TextInput, clamp, hslToCss, isColorDark, parseColor, rgbToCss, rgbToHsl };
