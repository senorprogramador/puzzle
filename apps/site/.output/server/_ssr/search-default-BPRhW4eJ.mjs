import { __toESM } from "../_runtime.mjs";
import { DismissableLayer, FocusScope, FocusScopeBranchProvider, Presence, Primitive, ReactRemoveScroll, T, buttonVariants, cn, composeEventHandlers, createContextScope, createSlot, cva, e, hideOthers, require_lucide_react, useComposedRefs, useControllableState, useDismissableLayerSurface, useFocusGuards, useFocusScopeBranchRegistry, useI18n, useId$1, useLayoutEffect2, useOnChange, useRouter, useTranslations } from "./dist-sg2c9ME_.mjs";
import { useHighlightQuery, useSearch as useSearch$1 } from "./use-search-eSAjMJVB-sJn5wXOm.mjs";
import { fetchClient } from "./fetch-CMsQybKV.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/search-default-BPRhW4eJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
var aria = "ActiveDescendant Atomic AutoComplete Busy Checked ColCount ColIndex ColSpan Controls Current DescribedBy Details Disabled DropEffect ErrorMessage Expanded FlowTo Grabbed HasPopup Hidden Invalid KeyShortcuts Label LabelledBy Level Live Modal MultiLine MultiSelectable Orientation Owns Placeholder PosInSet Pressed ReadOnly Relevant Required RoleDescription RowCount RowIndex RowSpan Selected SetSize Sort ValueMax ValueMin ValueNow ValueText";
var common = "role className content crossOrigin download height href hrefLang id lang max media method min name Abort AfterPrint BeforePrint Cancel CanPlay CanPlayThrough Change Click Close Copy CueChange Cut DblClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop DurationChange Emptied Ended Error Focus HashChange Input Invalid KeyDown KeyPress KeyUp Load LoadedData LoadedMetadata LoadStart Message MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Offline Online PageHide PageShow Paste Pause Play Playing PopState Progress RateChange Reset Resize Scroll Seeked Seeking Select Stalled Storage Submit Suspend TimeUpdate Toggle Unload VolumeChange Waiting ping referrerPolicy rel style tabIndex target title type width color event rev version property xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xmlns:xlink xmlns xml:base xml:lang xml:space";
var html = {
	names: createNames("abbr accept accept-charset accessKey action allow allowFullScreen allowPaymentRequest allowUserMedia alpha alt as async autoCapitalize autoComplete autoFocus autoPlay blocking capture charSet checked cite closedBy colorSpace cols colSpan command commandFor contentEditable controls controlsList coords data dateTime decoding default defer dir dirName disabled draggable encType enterKeyHint fetchPriority form formAction formEncType formMethod formNoValidate formTarget headers hidden high htmlFor http-equiv imageSizes imageSrcSet inert inputMode integrity is isMap itemID itemProp itemRef itemScope itemType kind label language list loading loop low manifest maxLength minLength multiple muted nonce noModule noValidate AuxClick BeforeMatch BeforeToggle BeforeUnload Blur ContextLost ContextMenu ContextRestored FormData LanguageChange LoadEnd MessageError RejectionHandled ScrollEnd SecurityPolicyViolation SlotChange UnhandledRejection Wheel open optimum pattern placeholder playsInline popover popoverTarget popoverTargetAction poster preload readOnly required reversed rows rowSpan sandbox scope scoped seamless selected shadowRootClonable shadowRootCustomElementRegistry shadowRootDelegatesFocus shadowRootMode shadowRootSerializable shape size sizes slot span spellCheck src srcDoc srcLang srcSet start step translate typeMustMatch useMap value wrap writingSuggestions align aLink archive axis background bgColor border borderColor bottomMargin cellPadding cellSpacing char charOff classID clear code codeBase codeType compact declare face frame frameBorder hSpace leftMargin link longDesc lowSrc marginHeight marginWidth noResize noHref noShade noWrap object profile prompt rightMargin rules scheme scrolling standby summary text topMargin valueType vAlign vLink vSpace allowTransparency autoCorrect autoSave credentialless disablePictureInPicture disableRemotePlayback exportParts part prefix results security unselectable").set("for", "htmlFor"),
	commaSeparated: [
		"accept",
		"coords",
		"exportParts"
	]
};
var svg = {
	names: createNames("about accent-height accumulate additive alignment-baseline alphabetic amplitude arabic-form ascent attributeName attributeType azimuth bandwidth baseline-shift baseFrequency baseProfile bbox begin bias by calcMode cap-height clip clip-path clipPathUnits clip-rule color-interpolation color-interpolation-filters color-profile color-rendering contentScriptType contentStyleType cursor cx cy d datatype defaultAction descent diffuseConstant direction display dur divisor dominant-baseline dx dy edgeMode editable elevation enable-background end exponent externalResourcesRequired fill fill-opacity fill-rule filter filterRes filterUnits flood-color flood-opacity focusable focusHighlight font-family font-size font-size-adjust font-stretch font-style font-variant font-weight format fr from fx fy g1 g2 glyph-name glyph-orientation-horizontal glyph-orientation-vertical glyphRef gradientTransform gradientUnits handler hanging hatchContentUnits hatchUnits horiz-adv-x horiz-origin-x horiz-origin-y ideographic image-rendering initialVisibility in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength keyPoints keySplines keyTimes kerning lengthAdjust letter-spacing lighting-color limitingConeAngle local marker-end marker-mid marker-start markerHeight markerUnits markerWidth mask maskContentUnits mask-type maskUnits mathematical mediaCharacterEncoding mediaContentEncodings mediaSize mediaTime mode nav-down nav-down-left nav-down-right nav-left nav-next nav-prev nav-right nav-up nav-up-left nav-up-right numOctaves observer offset Activate Begin End FocusIn FocusOut MouseWheel Repeat Show Zoom opacity operator order orient orientation origin overflow overlay overline-position overline-thickness paint-order panose-1 path pathLength patternContentUnits patternTransform patternUnits phase pitch playbackOrder pointer-events points pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits propagate r radius refX refY rendering-intent repeatCount repeatDur requiredExtensions requiredFeatures requiredFonts requiredFormats resource restart result rotate rx ry scale seed shape-rendering side slope snapshotTime specularConstant specularExponent spreadMethod spacing startOffset stdDeviation stemh stemv stitchTiles stop-color stop-opacity strikethrough-position strikethrough-thickness string stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width surfaceScale syncBehavior syncBehaviorDefault syncMaster syncTolerance syncToleranceDefault systemLanguage tableValues targetX targetY text-anchor text-decoration text-rendering textLength timelineBegin transformBehavior typeof to transform transform-origin u1 u2 underline-position underline-thickness unicode unicode-bidi unicode-range units-per-em values v-alphabetic v-mathematical vector-effect v-hanging v-ideographic vert-adv-y vert-origin-x vert-origin-y viewBox viewTarget visibility widths word-spacing writing-mode x x1 x2 xChannelSelector x-height y y1 y2 yChannelSelector z zoomAndPan"),
	commaSeparated: [
		"g1",
		"g2",
		"glyphName"
	]
};
var tableElements = /* @__PURE__ */ new Set([
	"table",
	"tbody",
	"thead",
	"tfoot",
	"tr"
]);
var escapable = /["&'<>]/g;
var escapes = {
	"\"": "&quot;",
	"&": "&amp;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
var identifier = /^[$_\p{ID_Start}][$_\p{Join_Control}\p{ID_Continue}]*$/u;
var styleError = "Cannot parse `style` attribute";
var mdxError = "Cannot handle MDX estrees without `evaluator`";
var PROPERTY = 1;
var CUSTOM = 2;
var BRACKET = 4;
var VALUE = 8;
var chars = Uint8Array.from({ length: 128 }, (_, code) => {
	const char = String.fromCharCode(code);
	return (/[-#/*\\\w]/.test(char) ? PROPERTY : 0) | (/[-\w]/.test(char) ? CUSTOM : 0) | (/[0-9a-z_-]/.test(char) ? BRACKET : 0) | (/[;}"'(]/.test(char) ? VALUE : 0);
});
/**
* Convert hast, with MDX nodes, into React elements like `toJsxRuntime()` from `hast-util-to-jsx-runtime`, but faster.
*/
function toJsx(tree, { components = {}, evaluator } = {}) {
	const result = one(tree, {
		components,
		evaluator,
		styles: /* @__PURE__ */ new Map(),
		styleAttributes: /* @__PURE__ */ new Map()
	}, html, void 0);
	if (result && typeof result !== "string") return result;
	return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: result || void 0 });
}
function one(node, state, schema, key) {
	if (node.type === "element") return element(node, state, schema, key);
	if (node.type === "text") return node.value;
	if (node.type === "root") return create(import_jsx_runtime.Fragment, {}, children(node, state, schema), key);
	if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") return create(node.name === null ? import_jsx_runtime.Fragment : jsxType(node.name, state), jsxProps(node.attributes, state.evaluator), children(node, state, schema === html && node.name === "svg" ? svg : schema), key);
	if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") return evaluate(node.data?.estree, state.evaluator);
	if (node.type === "mdxjsEsm") {
		if (!node.data?.estree || !state.evaluator) throw new Error(mdxError);
		return state.evaluator.evaluateProgram(node.data.estree);
	}
}
function element(node, state, parentSchema, key) {
	const schema = parentSchema === html && node.tagName.toLowerCase() === "svg" ? svg : parentSchema;
	const props = {};
	let align;
	for (const name in node.properties) {
		let value = node.properties[name];
		if (value === null || value === void 0 || Number.isNaN(value)) continue;
		if (name === "children" || !Object.hasOwn(node.properties, name)) continue;
		const prop = propertyName(schema, name);
		if (Array.isArray(value)) value = schema.commaSeparated.includes(prop) ? (value.join(", ") + (value.at(-1) === "" ? ", " : "")).trim() : value.join(" ").trim();
		if (prop === "style" && typeof value === "object") props.style = value;
		else if (prop === "style") {
			const input = String(value);
			let style = state.styles.get(input);
			if (!style) state.styles.set(input, style = parseStyle(input));
			props.style = style;
		} else if (prop === "align" && typeof value === "string" && (node.tagName === "td" || node.tagName === "th")) align = value;
		else props[prop] = value;
	}
	if (align) props.style = {
		...props.style,
		textAlign: align
	};
	const type = Object.hasOwn(state.components, node.tagName) ? state.components[node.tagName] : node.tagName;
	const first = node.children[0];
	if (typeof type === "string" && first?.type === "element" && first.tagName === "span" && !state.components.span && !tableElements.has(node.tagName)) {
		const html = toHtml(node.children, state);
		if (html !== void 0) {
			props.dangerouslySetInnerHTML = { __html: html };
			return create(type, props, [], key);
		}
	}
	return create(type, props, children(node, state, schema), key);
}
/** spans with class, style and `data-*` attributes, and text, as the HTML React renders; `undefined` for other content */
function toHtml(nodes, state) {
	let html = "";
	for (const node of nodes) {
		if (node.type === "text") {
			html += escape(node.value);
			continue;
		}
		if (node.type !== "element" || node.tagName !== "span") return;
		html += "<span";
		for (const name in node.properties) {
			const value = node.properties[name];
			if (value === null || value === void 0 || Number.isNaN(value) || name === "children") continue;
			if (name === "style" && typeof value === "string") {
				html += styleAttribute(value, state);
				continue;
			}
			const attribute = name === "className" ? "class" : name;
			if (attribute !== "class" && !attribute.startsWith("data-")) return;
			if (typeof value !== "string" && typeof value !== "number" && !Array.isArray(value)) return;
			html += ` ${attribute}="${escape(Array.isArray(value) ? value.join(" ").trim() : String(value))}"`;
		}
		const children = toHtml(node.children, state);
		if (children === void 0) return;
		html += `>${children}</span>`;
	}
	return html;
}
/** the `style` attribute React writes for the parsed `input` */
function styleAttribute(input, { styleAttributes }) {
	let attribute = styleAttributes.get(input);
	if (attribute !== void 0) return attribute;
	attribute = "";
	for (const [name, value] of Object.entries(parseStyle(input))) {
		const property = name.startsWith("--") ? name : name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`).replace(/^ms-/, "-ms-");
		attribute += `${attribute ? ";" : " style=\""}${escape(property)}:${escape(value)}`;
	}
	if (attribute) attribute += "\"";
	styleAttributes.set(input, attribute);
	return attribute;
}
function escape(value) {
	return value.replace(escapable, (char) => escapes[char]);
}
function children(node, state, schema) {
	const out = [];
	const table = node.type === "element" && tableElements.has(node.tagName);
	let counts;
	for (const child of node.children) {
		let result;
		if (child.type === "text") result = child.value;
		else {
			let key;
			const name = child.type === "element" ? child.tagName : child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement" ? child.name : void 0;
			if (name) {
				counts ??= /* @__PURE__ */ new Map();
				const count = counts.get(name) ?? 0;
				key = `${name}-${count}`;
				counts.set(name, count + 1);
			}
			result = one(child, state, schema, key);
			if (result === void 0) continue;
		}
		if (table && typeof result === "string" && isWhitespace(result)) continue;
		out.push(result);
	}
	return out;
}
function create(type, props, list, key) {
	if (list.length > 1) props.children = list;
	else if (list[0]) props.children = list[0];
	const fn = list.length > 1 || Array.isArray(props.children) ? import_jsx_runtime.jsxs : import_jsx_runtime.jsx;
	return key ? fn(type, props, key) : fn(type, props);
}
/** capitalized and member names are evaluated, like `findComponentFromName()` of `hast-util-to-jsx-runtime` */
function jsxType(name, { components, evaluator }) {
	let expression;
	if (name.includes(".")) for (const part of name.split(".")) {
		const property = identifier.test(part) ? {
			type: "Identifier",
			name: part
		} : {
			type: "Literal",
			value: part
		};
		const computed = property.type === "Literal";
		expression = expression ? {
			type: "MemberExpression",
			object: expression,
			property,
			computed,
			optional: false
		} : property;
	}
	else if (identifier.test(name) && !/^[a-z]/.test(name)) expression = {
		type: "Identifier",
		name
	};
	if (!expression) return Object.hasOwn(components, name) ? components[name] : name;
	if (!evaluator) throw new Error(mdxError);
	return evaluator.evaluateExpression(expression);
}
function jsxProps(attributes, evaluator) {
	const props = {};
	for (const attribute of attributes) if (attribute.type === "mdxJsxExpressionAttribute") Object.assign(props, evaluate(attribute.data?.estree, evaluator, true));
	else if (attribute.value && typeof attribute.value === "object") props[attribute.name] = evaluate(attribute.value.data?.estree, evaluator);
	else props[attribute.name] = attribute.value === null ? true : attribute.value;
	return props;
}
/** evaluate the expression of an MDX estree, or the argument of `{...spread}` */
function evaluate(estree, evaluator, spread = false) {
	if (!estree || !evaluator) throw new Error(mdxError);
	let { expression: value } = estree.body[0];
	if (spread) value = value.properties[0].argument;
	return evaluator.evaluateExpression(value);
}
function createNames(list) {
	const names = /* @__PURE__ */ new Map([["class", "className"]]);
	for (const name of aria.split(" ")) {
		const prop = `aria-${name.toLowerCase()}`;
		names.set(prop, prop).set(`aria${name}`, prop).set(`aria${name.toLowerCase()}`, prop);
	}
	for (let name of `${common} ${list}`.split(" ")) {
		if (name.charCodeAt(0) < 97) name = `on${name}`;
		const prop = name.replace(/[-:](.)/g, (_, char) => char.toUpperCase());
		names.set(name, prop).set(prop, prop).set(prop.toLowerCase(), prop);
	}
	return names;
}
/** the React prop of a hast property name, like `find()` of `property-information` */
function propertyName({ names }, name) {
	if (name.startsWith("data-")) return name;
	return names.get(name) ?? names.get(name.toLowerCase()) ?? dataName(name);
}
/** unknown `dataFooBar` names become `data-foo-bar` */
function dataName(name) {
	if (name.charCodeAt(4) === 45 || /-[a-z]/.test(name)) return name;
	if (!/^data[-\w.:]+$/i.test(name)) return name;
	const rest = name.slice(4).replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
	return rest.charCodeAt(0) === 45 ? `data${rest}` : `data-${rest}`;
}
/** inter-element white space, like `hast-util-whitespace` */
function isWhitespace(value) {
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		if (code !== 32 && code !== 9 && code !== 10 && code !== 12 && code !== 13) return false;
	}
	return true;
}
/**
* Parse a `style` attribute like `style-to-js` with `reactCompat`, reading declarations the way `inline-style-parser` does.
*/
function parseStyle(input) {
	const style = {};
	let i = comments(input, skipSpace(input, 0));
	for (;;) {
		const start = i;
		let plain = true;
		let code = input.charCodeAt(i);
		while (is(code, PROPERTY)) {
			if (!is(code, CUSTOM)) plain = false;
			code = input.charCodeAt(++i);
		}
		if (i === start) break;
		if (code === 91) {
			let end = i + 1;
			while (is(input.charCodeAt(end), BRACKET)) end++;
			if (end > i + 1 && input.charCodeAt(end) === 93) {
				i = end + 1;
				plain = false;
			}
		}
		const name = plain ? input.slice(start, i) : removeComments(input.slice(start, i));
		i = comment(input, skipSpace(input, i));
		if (input.charCodeAt(i) !== 58) throw new Error(styleError);
		const valueStart = skipSpace(input, i + 1);
		i = valueEnd(input, valueStart);
		const value = removeComments(input.slice(valueStart, i)).trim();
		if (value) style[plain && name.startsWith("--") ? name : camelCase(name)] = value;
		while (input.charCodeAt(i) === 59 || isSpace(input.charCodeAt(i))) i++;
		i = comments(input, i);
	}
	return style;
}
/** where a value ends: at `;` or `}` outside of strings and parentheses */
function valueEnd(input, i) {
	while (i < input.length) {
		const code = input.charCodeAt(i);
		if (!is(code, VALUE)) i++;
		else if (code === 59 || code === 125) break;
		else if (code === 40) {
			const end = input.indexOf(")", i + 1);
			i = end === -1 ? i + 1 : end + 1;
		} else i = quoteEnd(input, i, code);
	}
	return i;
}
/** a string ends at its closing quote on the same line, or else after its last escaped quote */
function quoteEnd(input, start, quote) {
	let end = start + 1;
	for (let i = start + 1; i < input.length; i++) {
		const code = input.charCodeAt(i);
		if (code === quote) return i + 1;
		if (code === 92 && input.charCodeAt(i + 1) === quote) end = ++i + 1;
		else if (code === 10 || code === 13 || code === 8232 || code === 8233) break;
	}
	return end;
}
function comments(input, i) {
	for (let next = comment(input, i); next !== i; next = comment(input, i)) i = next;
	return i;
}
function comment(input, i) {
	if (input.charCodeAt(i) !== 47 || input.charCodeAt(i + 1) !== 42) return i;
	const end = input.indexOf("*/", i + 2);
	if (end === -1) throw new Error(styleError);
	return skipSpace(input, end + 2);
}
function removeComments(value) {
	let out = "";
	let last = 0;
	for (let start = value.indexOf("/*"); start !== -1; start = value.indexOf("/*", last)) {
		const end = value.indexOf("*/", start + 2);
		if (end === -1) break;
		out += value.slice(last, start);
		last = end + 2;
	}
	return last === 0 ? value : out + value.slice(last);
}
function camelCase(name) {
	if (!name.includes("-") || isCustomProperty(name)) return name;
	let lower = name.toLowerCase();
	if (lower.startsWith("-ms-")) lower = lower.slice(1);
	let out = "";
	let last = 0;
	for (let i = lower.indexOf("-"); i !== -1; i = lower.indexOf("-", i + 1)) {
		const code = lower.charCodeAt(i + 1);
		if (code >= 97 && code <= 122) {
			out += lower.slice(last, i) + String.fromCharCode(code - 32);
			last = i + 2;
			i++;
		}
	}
	return out + lower.slice(last);
}
function isCustomProperty(name) {
	if (name.length < 3 || !name.startsWith("--")) return false;
	for (let i = 2; i < name.length; i++) if (!is(name.charCodeAt(i), CUSTOM)) return false;
	return true;
}
function skipSpace(input, i) {
	while (isSpace(input.charCodeAt(i))) i++;
	return i;
}
/** `\s` of regular expressions */
function isSpace(code) {
	return code === 32 || code >= 9 && code <= 13 || code > 127 && String.fromCharCode(code).trim() === "";
}
function is(code, flag) {
	return code < 128 && (chars[code] & flag) !== 0;
}
/**
* Provide a hook to query different official search clients.
*
* Note: it will re-query when its parameters changed, make sure to define `deps` array if you encounter rendering issues.
*
* @deprecated Use the search hook of your provider instead, like `useFetchSearch()`, or `experimental_useSearch()` for other clients.
*/
function useDocsSearch({ delayMs, allowEmpty, ...options }, customDeps) {
	const client = "type" in options ? createPresetClient(options) : options.client;
	const run = (0, import_react.useCallback)((query) => client.search(query), customDeps ?? client.deps ?? []);
	const output = useSearch$1(run, {
		delayMs,
		allowEmpty
	});
	const data = (0, import_react.useMemo)(() => {
		if (!output.data) return "empty";
		const out = [];
		for (const item of output.data.items) if (item.type === "table") out.push(...item.rows);
		else out.push(item);
		return out;
	}, [output.data]);
	return {
		...output,
		setSearch: output.onSearchChange,
		query: {
			isLoading: output.isLoading,
			data,
			error: output.error
		}
	};
}
function createPresetClient(options) {
	const client = loadPreset(options);
	return {
		deps: [JSON.stringify(options)],
		search: async (query) => (await client).search(query)
	};
}
function loadPreset(options) {
	switch (options.type) {
		case "fetch": return import("./fetch-CzTdBd9g.mjs").then((mod) => mod.fetchClient(options));
		case "algolia": return import("./algolia-Bbge9qtY.mjs").then((mod) => mod.algoliaClient(options));
		case "orama-cloud": return import("./orama-cloud-CnkBWdaE.mjs").then((mod) => mod.oramaCloudClient(options));
		case "orama-cloud-legacy": return import("./orama-cloud-legacy-D6vbBs0q.mjs").then((mod) => mod.oramaCloudLegacyClient(options));
		case "mixedbread": return import("./mixedbread-D4vCQD3a.mjs").then((mod) => mod.mixedbreadClient(options));
		case "static": return import("./orama-static-CCin0bWj.mjs").then((mod) => mod.staticClient(options));
		default: throw new Error("unknown search client");
	}
}
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = /* @__PURE__ */ __name((props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = import_react.useRef(null);
	const contentRef = import_react.useRef(null);
	const { nodes: branchNodes, registry: branchRegistry } = useFocusScopeBranchRegistry();
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	const [titleCount, setTitleCount] = import_react.useState(0);
	const [descriptionCount, setDescriptionCount] = import_react.useState(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId$1(),
		titleId: useId$1(),
		descriptionId: useId$1(),
		titlePresent: titleCount > 0,
		descriptionPresent: descriptionCount > 0,
		setTitleCount,
		setDescriptionCount,
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		branchNodes,
		branchRegistry,
		children
	});
}, "Dialog");
var [PortalProvider, usePortalContext] = createDialogContext("DialogPortal", { forceMount: void 0 });
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogOverlay2(props, forwardedRef) {
	const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
}, "DialogOverlay"));
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogOverlayImpl2(props, forwardedRef) {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	const registerDismissableSurface = useDismissableLayerSurface();
	const composedRefs = useComposedRefs(forwardedRef, registerDismissableSurface);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot,
		allowPinchZoom: true,
		shards: import_react.useMemo(() => [context.contentRef, ...context.branchNodes.map((node) => ({ current: node }))], [context.contentRef, context.branchNodes]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": getState(context.open),
			...overlayProps,
			ref: composedRefs,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
}, "DialogOverlayImpl"));
var CONTENT_NAME = "DialogContent";
var DialogContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogContent2(props, forwardedRef) {
	const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
}, "DialogContent"));
var DialogContentModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogContentModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
}, "DialogContentModal"));
var DialogContentNonModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogContentNonModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
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
}, "DialogContentNonModal"));
var DialogContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogContentImpl2(props, forwardedRef) {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, "aria-describedby": ariaDescribedby, children, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, __scopeDialog);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScopeBranchProvider, {
		registry: context.branchRegistry,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
			asChild: true,
			loop: true,
			trapped: trapFocus,
			branches: context.branchNodes,
			onMountAutoFocus: onOpenAutoFocus,
			onUnmountAutoFocus: onCloseAutoFocus,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
				role: "dialog",
				id: context.contentId,
				"aria-labelledby": context.titlePresent ? context.titleId : void 0,
				"aria-describedby": context.descriptionPresent ? concatAriaDescribedby(ariaDescribedby, context.descriptionId) : ariaDescribedby,
				"data-state": getState(context.open),
				...contentProps,
				ref: forwardedRef,
				deferPointerDownOutside: true,
				onDismiss: () => context.onOpenChange(false),
				children
			})
		})
	});
}, "DialogContentImpl"));
var DialogTitle = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function DialogTitle2(props, forwardedRef) {
	const { __scopeDialog, ...titleProps } = props;
	const context = useDialogContext("DialogTitle", __scopeDialog);
	const { setTitleCount } = context;
	useLayoutEffect2(() => {
		setTitleCount((count) => count + 1);
		return () => setTitleCount((count) => count - 1);
	}, [setTitleCount]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.h2, {
		id: context.titleId,
		...titleProps,
		ref: forwardedRef
	});
}, "DialogTitle"));
function concatAriaDescribedby(...values) {
	const ids = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (typeof value !== "string") continue;
		for (const id of String(value).trim().split(/\s+/)) if (id) ids.add(id);
	}
	return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
}
__name(concatAriaDescribedby, "concatAriaDescribedby");
function getState(open) {
	return open ? "open" : "closed";
}
__name(getState, "getState");
var RootContext = (0, import_react.createContext)(null);
var TagsListContext = (0, import_react.createContext)(null);
var mdComponents = {
	mark(props) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			...props,
			className: "text-fd-primary underline"
		});
	},
	a: "span",
	p(props) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			...props,
			className: "min-w-0"
		});
	},
	custom({ tagName, children, ...rest }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex max-w-full items-center border p-0.5 rounded-md bg-fd-card text-fd-card-foreground divide-x divide-fd-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					"data-highlight-ignore": "",
					className: "not-prose rounded-sm px-0.5 me-1 bg-fd-primary font-medium text-xs text-fd-primary-foreground border-none",
					children: tagName
				}),
				Object.entries(rest).map(([k, v]) => {
					if (typeof v !== "string") return;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
						"data-highlight-ignore": "",
						className: "not-prose truncate text-xs text-fd-muted-foreground px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-fd-card-foreground",
							children: [k, ": "]
						}), v]
					}, k);
				}),
				children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ps-1",
					children
				})
			]
		});
	},
	pre(props) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			...props,
			className: cn("not-prose flex flex-col border rounded-md my-0.5 p-2 bg-fd-secondary text-fd-secondary-foreground max-h-20 overflow-hidden *:mask-[linear-gradient(to_bottom,white,white_30px,transparent_80px)]", props.className)
		});
	}
};
var renderOptions = { components: mdComponents };
function Children$1({ children }) {
	return children;
}
function TableCell(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: "min-w-0 not-last:truncate last:line-clamp-2"
	});
}
var tableRenderOptions = { components: {
	...mdComponents,
	table: Children$1,
	thead: Children$1,
	tbody: Children$1,
	tr: Children$1,
	th: TableCell,
	td: TableCell
} };
var rowRenderOptions = { components: {
	...tableRenderOptions.components,
	thead: () => null
} };
function SearchDialog({ open, onOpenChange, search, onSearchChange, isLoading = false, data, error, onSelect: onSelectProp, children }) {
	const router = useRouter();
	const onOpenChangeCallback = (0, import_react.useRef)(onOpenChange);
	onOpenChangeCallback.current = onOpenChange;
	const onSearchChangeCallback = (0, import_react.useRef)(onSearchChange);
	onSearchChangeCallback.current = onSearchChange;
	const onSelect = (item) => {
		if (item.type === "action") item.onSelect();
		else if (item.external) window.open(item.url, "_blank")?.focus();
		else router.push(item.url);
		onOpenChange(false);
		onSelectProp?.(item);
	};
	const onSelectCallback = (0, import_react.useRef)(onSelect);
	onSelectCallback.current = onSelect;
	const activeItem = (0, import_react.useMemo)(() => {
		let active = null;
		const listeners = /* @__PURE__ */ new Set();
		return {
			getActive: () => active,
			setActive(id) {
				active = id;
				for (const listener of listeners) listener();
			},
			subscribeActive(listener) {
				listeners.add(listener);
				return () => void listeners.delete(listener);
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootContext, {
			value: (0, import_react.useMemo)(() => ({
				...activeItem,
				open,
				search,
				isLoading,
				data,
				error,
				query: data ? data.query : search,
				onOpenChange: (v) => onOpenChangeCallback.current(v),
				onSearchChange: (v) => onSearchChangeCallback.current(v),
				onSelect: (v) => onSelectCallback.current(v)
			}), [
				activeItem,
				isLoading,
				open,
				search,
				data,
				error
			]),
			children
		})
	});
}
function SearchDialogHeader(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("flex flex-row items-center gap-2 p-3", props.className)
	});
}
function SearchDialogInput(props) {
	const t = useTranslations({ note: "search dialog" });
	const { search, onSearchChange, getActive, subscribeActive } = useSearch();
	const active = (0, import_react.useSyncExternalStore)(subscribeActive, getActive, getActive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		role: "combobox",
		"aria-expanded": active !== null,
		"aria-activedescendant": active !== null ? `fd-search-option-${active}` : void 0,
		"aria-label": t("Search"),
		"aria-autocomplete": "list",
		"aria-controls": "fd-search-list",
		...props,
		value: search,
		onChange: (e) => onSearchChange(e.target.value),
		placeholder: t("Search"),
		className: "w-0 flex-1 bg-transparent text-lg placeholder:text-fd-muted-foreground focus-visible:outline-none"
	});
}
function SearchDialogClose({ children = "ESC", className, ...props }) {
	const { onOpenChange } = useSearch();
	const t = useTranslations({ note: "search dialog" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": t("Close Search", { note: "aria-label" }),
		onClick: () => onOpenChange(false),
		className: cn(buttonVariants({
			variant: "outline",
			size: "sm",
			className: "font-mono text-fd-muted-foreground"
		}), className),
		...props,
		children
	});
}
function SearchDialogFooter(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("bg-fd-secondary/50 p-3 empty:hidden", props.className)
	});
}
function SearchDialogOverlay(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
		...props,
		className: cn("fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out", props.className)
	});
}
function SearchDialogContent({ children, ...props }) {
	const t = useTranslations({ note: "search dialog" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		"aria-describedby": void 0,
		...props,
		className: cn("fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in", "*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0", props.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "hidden",
			children: t("Search")
		}), children]
	});
}
function SearchDialogList({ items: itemsProp, defaultItems = null, Empty = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	role: "status",
	className: "py-12 text-center text-sm text-fd-muted-foreground",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T, {
		text: "No results found",
		note: "search dialog"
	})
}), Item = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogListItem, { ...props }), Table = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogListTable, { ...props }), ...props }) {
	const ref = (0, import_react.useRef)(null);
	const t = useTranslations({ note: "search dialog" });
	const { onSelect, data, error, getActive, setActive } = useSearch();
	const items = itemsProp === void 0 ? data?.items ?? defaultItems : itemsProp;
	(0, import_react.useLayoutEffect)(() => setActive(error ? null : items?.[0]?.id ?? null), [
		setActive,
		items,
		error
	]);
	const onKey = (0, import_react.useEffectEvent)((e) => {
		if (!items || e.isComposing || e.keyCode === 229) return;
		const list = flattenItems(items);
		if (e.key === "ArrowDown" || e.key == "ArrowUp") {
			let idx = list.findIndex((item) => item.id === getActive());
			if (idx === -1) idx = 0;
			else if (e.key === "ArrowDown") idx++;
			else idx--;
			setActive(list.at(idx % list.length)?.id ?? null);
			e.preventDefault();
		}
		if (e.key === "Enter") {
			const selected = list.find((item) => item.id === getActive());
			if (selected) onSelect(selected);
			e.preventDefault();
		}
	});
	(0, import_react.useEffect)(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new ResizeObserver(() => {
			let height = 0;
			for (const child of element.children) height += child.offsetHeight;
			element.style.setProperty("--fd-animated-height", `${height}px`);
		});
		for (const child of element.children) observer.observe(child);
		window.addEventListener("keydown", onKey);
		return () => {
			observer.disconnect();
			window.removeEventListener("keydown", onKey);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...props,
		ref,
		"data-empty": items === null && !error,
		className: cn("overflow-hidden h-(--fd-animated-height) transition-[height] [&_::highlight(fd-search)]:text-fd-primary [&_::highlight(fd-search)]:underline", props.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: cn("truncate text-sm not-empty:p-3", items && "not-empty:border-b"),
			children: error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CircleAlert, { className: "inline size-5 me-2 align-top text-fd-error" }), data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T, {
				text: "Search failed, showing results for {query}",
				note: "search dialog",
				variables: { query: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: data.query
				}) }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T, {
				text: "Search failed",
				note: "search dialog"
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "fd-search-list",
			role: items?.length ? "listbox" : void 0,
			"aria-label": items?.length ? t("Search") : void 0,
			className: cn("w-full flex flex-col overflow-y-auto max-h-[460px] p-1", !items && "hidden"),
			children: [items?.length === 0 && Empty(), items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: item.type === "table" ? Table({
				table: item,
				Item,
				onSelect
			}) : Item({
				item,
				onClick: () => onSelect(item)
			}) }, item.id))]
		})]
	});
}
function flattenItems(items) {
	const out = [];
	for (const item of items) if (item.type === "table") out.push(...item.rows);
	else out.push(item);
	return out;
}
function SearchDialogListTable({ table, Item, onSelect }) {
	const { query } = useSearch();
	const highlightRef = useHighlightQuery(query);
	const headerId = `fd-search-table-${table.id}`;
	const header = (0, import_react.useMemo)(() => table.header && toJsx(table.header, tableRenderOptions), [table.header]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: table.header ? "group" : void 0,
		"aria-labelledby": table.header ? headerId : void 0,
		className: "ms-3 shrink-0 border-s py-2 ps-3.25 pe-2.5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-x-3 overflow-hidden rounded-lg border bg-fd-card text-sm",
			style: { gridTemplateColumns: `${"fit-content(30%) ".repeat(table.columns - 1)}minmax(30%, 1fr)` },
			children: [header && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: headerId,
				ref: highlightRef,
				"aria-hidden": true,
				className: "col-span-full grid grid-cols-subgrid bg-fd-secondary px-3 py-1 text-xs text-fd-muted-foreground",
				children: header
			}), table.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: Item({
				item: row,
				table,
				onClick: () => onSelect(row)
			}) }, row.id))]
		})
	});
}
function SearchDialogListItem({ item, table, className, children, renderMarkdown, ...props }) {
	const { query, getActive, setActive, subscribeActive } = useSearch();
	const isActive = () => getActive() === item.id;
	const active = (0, import_react.useSyncExternalStore)(subscribeActive, isActive, isActive);
	const highlightRef = useHighlightQuery(query);
	const content = (0, import_react.useMemo)(() => {
		if (item.type === "action") return item.node;
		if (renderMarkdown && typeof item.content === "string") return renderMarkdown(item.content);
		if (!("hastContent" in item)) return item.content;
		if (!table) return toJsx(item.hastContent, renderOptions);
		return toJsx(item.hastContent, table.header ? rowRenderOptions : tableRenderOptions);
	}, [
		item,
		renderMarkdown,
		table
	]);
	if (item.type === "action") children ??= content;
	else if (table) children ??= /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: highlightRef,
		className: cn("contents", !table.header && "*:first:font-medium *:first:text-fd-primary *:nth-2:text-xs *:not-first:text-fd-muted-foreground"),
		children: content
	});
	else children ??= /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "inline-flex items-center text-fd-muted-foreground text-xs empty:hidden",
			children: item.breadcrumbs?.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "size-4 rtl:rotate-180" }), item] }, i))
		}),
		item.type !== "page" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "none",
			className: "absolute inset-s-3 inset-y-0 w-px bg-fd-border"
		}),
		item.type === "heading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Hash, { className: "absolute inset-s-6 top-2.5 size-4 text-fd-muted-foreground" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: highlightRef,
			className: cn("prose prose-sm min-w-0", item.type === "text" && "ps-4", item.type === "heading" && "ps-8", item.type === "page" || item.type === "heading" ? "font-medium text-inherit" : "text-fd-popover-foreground/80"),
			children: content
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: `fd-search-option-${item.id}`,
		role: "option",
		ref: (0, import_react.useCallback)((element) => {
			if (active && element) e(element, {
				scrollMode: "if-needed",
				block: "nearest",
				boundary: element.closest("[role=\"listbox\"]")
			});
		}, [active]),
		"aria-selected": active,
		className: cn("cursor-default", table ? "col-span-full grid grid-cols-subgrid items-baseline px-3 py-1.5 not-first:border-t" : "relative shrink-0 px-2.5 py-2 text-sm overflow-hidden rounded-lg", active && "bg-fd-accent text-fd-accent-foreground", className),
		onPointerMove: () => setActive(item.id),
		...props,
		children
	});
}
function SearchDialogIcon(props) {
	const { isLoading } = useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SearchIcon, {
		...props,
		className: cn("size-5 text-fd-muted-foreground", isLoading && "animate-pulse duration-400", props.className)
	});
}
var itemVariants = cva("rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors", { variants: { active: { true: "bg-fd-accent text-fd-accent-foreground" } } });
function TagsList({ tag, onTagChange, allowClear = false, ...props }) {
	const onTagChangeCallback = (0, import_react.useRef)(onTagChange);
	onTagChangeCallback.current = onTagChange;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		...props,
		className: cn("flex items-center gap-1 flex-wrap", props.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagsListContext, {
			value: (0, import_react.useMemo)(() => ({
				value: tag,
				onValueChange: (v) => onTagChangeCallback.current(v),
				allowClear
			}), [allowClear, tag]),
			children: props.children
		})
	});
}
function TagsListItem({ value, className, ...props }) {
	const { onValueChange, value: selectedValue, allowClear } = useTagsList();
	const selected = value === selectedValue;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-active": selected,
		className: cn(itemVariants({
			active: selected,
			className
		})),
		onClick: () => onValueChange(selected && allowClear ? void 0 : value),
		tabIndex: -1,
		...props,
		children: props.children
	});
}
function useSearch() {
	const ctx = (0, import_react.use)(RootContext);
	if (!ctx) throw new Error("Missing <SearchDialog />");
	return ctx;
}
function useTagsList() {
	const ctx = (0, import_react.use)(TagsListContext);
	if (!ctx) throw new Error("Missing <TagsList />");
	return ctx;
}
var STATIC;
function DefaultSearchDialog({ type, defaultTag, tags = [], api, delayMs, allowClear = false, links = [], footer, ...props }) {
	const { locale } = useI18n();
	const [tag, setTag] = (0, import_react.useState)(defaultTag);
	let client;
	if (type === "static") client = (0, import_react.use)(STATIC ??= import("./orama-static-CCin0bWj.mjs")).staticClient({
		from: api,
		locale,
		tag
	});
	else client = fetchClient({
		api,
		locale,
		tag
	});
	const search = useDocsSearch({
		client,
		delayMs
	});
	const defaultItems = (0, import_react.useMemo)(() => {
		if (links.length === 0) return null;
		return links.map(([name, link]) => ({
			type: "page",
			id: name,
			content: name,
			url: link
		}));
	}, [links]);
	useOnChange(defaultTag, (v) => {
		setTag(v);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchDialog, {
		...search,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchDialogHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogIcon, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogInput, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogClose, {})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialogList, { defaultItems })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SearchDialogFooter, { children: [tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagsList, {
				tag,
				onTagChange: setTag,
				allowClear,
				children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagsListItem, {
					value: tag.value,
					children: tag.name
				}, tag.value))
			}), footer] })
		]
	});
}
export { DefaultSearchDialog as default };
