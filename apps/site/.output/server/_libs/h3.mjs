import { decodePreservingSeparators, isNonCanonicalPathname } from "./h3+rou3+srvx.mjs";
// ../../node_modules/.bun/h3@2.0.8+087a1040bb474d54/node_modules/h3/dist/path.mjs
var DOT_SEGMENT_SRC = String.raw`(?:^|/)(?:\.|%(?:25)*2e){1,2}(?:/|$)`;
var ENCODED_SEP_SRC = String.raw`%(?:25)*(?:2f|5c)`;
var ENCODED_SEP_RE_G = /* @__PURE__ */ new RegExp(ENCODED_SEP_SRC, "gi");
var TRIGGER_RES = /* @__PURE__ */ (() => {
	const base = String.raw`\\|` + DOT_SEGMENT_SRC;
	return [
		new RegExp(base, "i"),
		new RegExp(`${base}|${ENCODED_SEP_SRC}`, "i"),
		new RegExp(`${base}|//`, "i"),
		new RegExp(`${base}|${ENCODED_SEP_SRC}|//`, "i")
	];
})();
var ENCODED_DOT_RE_G = /%(?:25)*2e/gi;
function resolveDotSegments(path, opts) {
	if (path[0] !== "/" || path[1] === "/" || path[1] === "\\") path = "/" + path.replace(/^[/\\]+/, "");
	if (isCanonicalPath(path, opts)) return path;
	const decodeSlashes = opts?.decodeSlashes;
	const mergeSlashes = opts?.mergeSlashes;
	let normalized = path.includes("\\") ? path.replaceAll("\\", "/") : path;
	if (decodeSlashes) normalized = normalized.replace(ENCODED_SEP_RE_G, "/");
	const segments = normalized.split("/");
	const lastIndex = segments.length - 1;
	const resolved = [];
	for (let i = 0; i <= lastIndex; i++) {
		const segment = segments[i];
		const normalizedSegment = segment.includes("%") ? segment.replace(ENCODED_DOT_RE_G, ".") : segment;
		const isDotSegment = normalizedSegment === "." || normalizedSegment === "..";
		if (normalizedSegment === "..") {
			if (resolved.length > 1) resolved.pop();
		} else if (mergeSlashes && normalizedSegment === "" && i > 0 && i < lastIndex) {} else if (!isDotSegment) resolved.push(segment);
		if (isDotSegment && i === lastIndex) resolved.push("");
	}
	return (resolved.join("/") || "/").replace(/^\/+/, "/");
}
function isCanonicalPath(path, opts) {
	return path[0] === "/" && path[1] !== "/" && path[1] !== "\\" && !TRIGGER_RES[(opts?.decodeSlashes ? 1 : 0) | (opts?.mergeSlashes ? 2 : 0)].test(path);
}
// ../../node_modules/.bun/h3@2.0.8+087a1040bb474d54/node_modules/h3/dist/_utils.mjs
var CANONICAL_OPTS = { decodeSlashes: true };
var MERGED_OPTS = {
	decodeSlashes: true,
	mergeSlashes: true
};
function canonicalPath(pathname) {
	return resolveDotSegments(pathname, CANONICAL_OPTS);
}
function decodedPath(pathname) {
	let decoded = pathname;
	for (let pass = 0; hasDecodableEscape(decoded); pass++) {
		if (pass >= MAX_PASSES) return decoded;
		const input = pass < EXACT_PASSES ? decoded : flattenNesting(decoded);
		let next;
		try {
			next = decodePreservingSeparators(input);
		} catch {
			return input;
		}
		if (next === input) return input;
		decoded = next;
	}
	return decoded;
}
var PATH_ENCODE_RE = /(?:[\u0000-\u0020"#<>?^`{}]|[^\u0000-\u007E])+/gu;
function encodedReading(pathname) {
	return pathname.replace(PATH_ENCODE_RE, (run) => encodeURIComponent(run.replace(/[\uD800-\uDFFF]/gu, "�")));
}
var EXACT_PASSES = 8;
var MAX_PASSES = 24;
var CHAR_2 = 50;
var CHAR_5 = 53;
function needsCanonicalPasses(pathname) {
	return !isCanonicalPath(pathname, MERGED_OPTS);
}
function mergedCanonicalPath(pathname, canonical) {
	const merged = resolveDotSegments(pathname, MERGED_OPTS);
	return merged === canonical ? void 0 : merged;
}
function hasDecodableEscape(value) {
	for (let i = value.indexOf("%"); i !== -1; i = value.indexOf("%", i + 1)) {
		const byte = escapeByte(value, nestingEnd(value, i));
		if (byte !== 47 && byte !== 92) return true;
	}
	return false;
}
function flattenNesting(path) {
	let flat = "";
	let last = 0;
	for (let i = path.indexOf("%"); i !== -1; i = path.indexOf("%", i + 1)) {
		const end = nestingEnd(path, i);
		if (end === i + 1) continue;
		const byte = escapeByte(path, end);
		if (byte === 47 || byte === 92) continue;
		flat += path.slice(last, i) + (byte === -1 ? "%25" : "%");
		last = end;
	}
	return last === 0 ? path : flat + path.slice(last);
}
function nestingEnd(value, index) {
	let end = index + 1;
	while (value.charCodeAt(end) === CHAR_2 && value.charCodeAt(end + 1) === CHAR_5) end += 2;
	return end;
}
function escapeByte(value, index) {
	const high = hexDigit(value.charCodeAt(index));
	const low = hexDigit(value.charCodeAt(index + 1));
	return high === -1 || low === -1 ? -1 : high * 16 + low;
}
function hexDigit(code) {
	if (code >= 48 && code <= 57) return code - 48;
	if (code >= 97 && code <= 102) return code - 87;
	if (code >= 65 && code <= 70) return code - 55;
	return -1;
}
// ../../node_modules/.bun/h3@2.0.8+087a1040bb474d54/node_modules/h3/dist/normalize.mjs
function recordResets(resets, resetEntries, routeRules, canOverride) {
	for (const entry of resetEntries) {
		const rule = routeRules[entry.name];
		if (!rule || !canOverride?.(entry.route, rule.route)) addReset(resets, entry.name, entry.route);
	}
}
function addReset(resets, name, route) {
	const routes = resets.get(name);
	if (!routes) resets.set(name, [route]);
	else if (!routes.includes(route)) routes.push(route);
}
function canReinstate(resetRoutes, route, canOverride) {
	return !resetRoutes || canOverride !== void 0 && resetRoutes.every((resetRoute) => canOverride(resetRoute, route));
}
function mergeMatchedRouteRules(rawLayers, altLayers, canOverride) {
	if (!altLayers) return resolveLayers(rawLayers);
	const resets = /* @__PURE__ */ new Map();
	const routeRules = resolveLayers(rawLayers, resets, canOverride);
	const resolved = altLayers.map((layers) => layers?.length ? resolveLayers(layers, resets, canOverride) : void 0);
	for (const rules of resolved) if (rules) unionRules(routeRules, rules, resets, canOverride);
	return routeRules;
}
function unionRules(routeRules, resolved, resets, canOverride) {
	for (const [name, rule] of Object.entries(resolved)) {
		const current = routeRules[name];
		if (current) {
			if (canOverride && !canOverride(current.route, rule.route)) continue;
		} else if (!rule.handler?.restricting && !canReinstate(resets.get(name), rule.route, canOverride)) continue;
		mergeRouteRule(routeRules, name, rule, rule.params);
	}
}
function resolveLayers(layers, resets, canOverride) {
	const firstData = layers?.[0]?.data;
	if (firstData && !Array.isArray(firstData)) return resolvePreMergedLayers(layers, resets);
	const routeRules = emptyRouteRules();
	let resetEntries;
	for (const layer of orderedLayers(layers)) for (const entry of layer.data) {
		if (resets && entry.options === false) (resetEntries ||= []).push(entry);
		mergeRouteRule(routeRules, entry.name, entry, layer.params);
	}
	if (resetEntries) recordResets(resets, resetEntries, routeRules, canOverride);
	return routeRules;
}
function isMergeableObject(value) {
	return value !== null && typeof value === "object";
}
function emptyRouteRules() {
	return Object.create(null);
}
function mergeRuleOptions(current, incoming) {
	return isMergeableObject(current) && isMergeableObject(incoming) ? {
		...current,
		...incoming
	} : incoming;
}
function orderedLayers(layers) {
	if (!layers || layers.length < 2) return layers || [];
	let ordered = layers;
	for (let i = 1; i < ordered.length; i++) {
		const layer = ordered[i];
		const rank = layerRank(layer);
		let j = i - 1;
		while (j >= 0 && layerRank(ordered[j]) > rank) {
			if (ordered === layers) ordered = [...layers];
			ordered[j + 1] = ordered[j];
			j--;
		}
		if (j + 1 !== i) ordered[j + 1] = layer;
	}
	return ordered;
}
function layerRank(layer) {
	return layer.data[0]?.rank ?? 0;
}
function resolvePreMergedLayers(rawLayers, resets) {
	const layers = rawLayers.length < 2 ? rawLayers : [...rawLayers].sort((a, b) => a.data.rank - b.data.rank);
	const routeRules = emptyRouteRules();
	const winning = layers[layers.length - 1].data;
	if (resets && winning.resets) for (const name of winning.resets) addReset(resets, name, winning.route);
	for (const entry of winning.rules) {
		const paramRoutes = entry.paramRoutes;
		let params;
		for (const layer of layers) {
			const layerParams = layer.params;
			if (!layerParams) continue;
			const layerRoute = layer.data.route;
			if (paramRoutes ? paramRoutes.includes(layerRoute) : layerRoute === entry.route) params = params ? {
				...params,
				...layerParams
			} : layerParams;
		}
		routeRules[entry.name] = {
			route: entry.route,
			options: entry.options,
			handler: entry.handler,
			params
		};
	}
	return routeRules;
}
function mergeRouteRule(routeRules, ruleName, rule, params) {
	const name = ruleName;
	const currentRule = routeRules[name];
	if (currentRule) {
		if (rule.options === false) {
			delete routeRules[name];
			return;
		}
		currentRule.options = mergeRuleOptions(currentRule.options, rule.options);
		currentRule.route = rule.route;
		if (currentRule.params || params) currentRule.params = {
			...currentRule.params,
			...params
		};
	} else if (rule.options !== false) routeRules[name] = {
		route: rule.route,
		options: rule.options,
		handler: rule.handler,
		params
	};
}
var headers = {
	order: -1,
	handler: (m) => {
		const entries = Object.entries(m.options || {});
		return async function headersRouteRule(event, next) {
			let result;
			try {
				result = await next();
			} catch (error) {
				setRuleHeaders(event, entries, error);
				throw error;
			}
			setRuleHeaders(event, entries, result);
			return result;
		};
	}
};
function setRuleHeaders(event, entries, outcome) {
	const own = outcome instanceof Error && outcome.name === "HTTPError" && outcome.status > 99 ? outcome.headers : void 0;
	for (const [key, value] of entries) {
		event.res.headers.set(key, value);
		if (!own?.has(key)) event.res.errHeaders.set(key, value);
	}
}
var WHOLE_PARAM_SEGMENT_RE = /^:[A-Za-z_]\w*[?+*]?$/;
var CONCRETE_SEGMENT_RE = /^[^:*(){}\\]+$/;
var DOT_SEGMENT_RE = /(?:^|\/)(?:\.|%2e){1,2}(?:\/|$)/i;
var GROUP_RE = /[{}]/;
var canOverrideRouteShape = (currentRoute, incomingRoute) => {
	if (DOT_SEGMENT_RE.test(currentRoute) || DOT_SEGMENT_RE.test(incomingRoute)) return false;
	if (currentRoute === incomingRoute) return true;
	if (GROUP_RE.test(currentRoute) || GROUP_RE.test(incomingRoute)) return false;
	const current = currentRoute.split("/");
	const incoming = incomingRoute.split("/");
	for (let i = 0; i < current.length; i++) {
		const cur = current[i];
		if (cur === "**") return i === current.length - 1 && incoming.length > i && !current.slice(1, i).includes("");
		const inc = incoming[i];
		if (inc === void 0) return false;
		if (cur === inc) continue;
		if ((cur === "*" || WHOLE_PARAM_SEGMENT_RE.test(cur)) && CONCRETE_SEGMENT_RE.test(inc)) continue;
		return false;
	}
	return current.length === incoming.length;
};
function createMatcherFromFind(findRouteRules, canOverride = canOverrideRouteShape) {
	return (method, pathname) => {
		const rawLayers = findRouteRules(method, pathname);
		let altLayers;
		let hasAltMatch = false;
		const readings = alternateReadings(pathname);
		if (readings) {
			altLayers = [];
			for (const reading of readings) {
				const layers = findRouteRules(method, reading);
				if (layers?.length) hasAltMatch = true;
				altLayers.push(layers);
			}
		}
		if (!rawLayers?.length && !hasAltMatch) return {
			routeRules: {},
			matchedRules: {},
			routeRuleMiddleware: []
		};
		const matchedRules = mergeMatchedRouteRules(rawLayers, altLayers, canOverride);
		return {
			routeRules: toRouteRules(matchedRules),
			matchedRules,
			routeRuleMiddleware: buildRouteRuleMiddleware(matchedRules)
		};
	};
}
function toRouteRules(matchedRules) {
	const routeRules = Object.create(null);
	for (const name in matchedRules) routeRules[name] = matchedRules[name].options;
	return routeRules;
}
function buildRouteRuleMiddleware(matchedRules) {
	const routeRuleMiddleware = [];
	const rules = Object.entries(matchedRules);
	if (rules.length > 1) rules.sort(compareRuleOrder);
	for (const [, rule] of rules) {
		if (!rule.handler) continue;
		routeRuleMiddleware.push(rule.handler.handler(rule));
	}
	return routeRuleMiddleware;
}
function memoizeRouteRulesMatcher(matcher, opts) {
	const max = opts?.max ?? 1024;
	if (max <= 0) return matcher;
	const memo = /* @__PURE__ */ new Map();
	let hand;
	const evict = () => {
		for (;;) {
			let next = hand?.next();
			if (!next || next.done) {
				hand = memo.values();
				next = hand.next();
				if (next.done) return;
			}
			const entry = next.value;
			if (entry.visited) entry.visited = false;
			else {
				memo.delete(entry.key);
				return;
			}
		}
	};
	return (method, pathname) => {
		const key = method + " " + pathname;
		const entry = memo.get(key);
		if (entry) {
			entry.visited = true;
			return entry.result;
		}
		const result = matcher(method, pathname);
		if (memo.size >= max) evict();
		memo.set(key, {
			key,
			result,
			visited: false
		});
		return result;
	};
}
function alternateReadings(pathname) {
	const recase = pathname.includes("%") && !isNonCanonicalPathname(pathname);
	const upper = recase ? recaseEscapes(pathname, true) : pathname;
	const lower = recase ? recaseEscapes(pathname, false) : pathname;
	const decoded = decodedPath(pathname);
	const encoded = encodedReading(decoded);
	const lowerEncoded = recaseEscapes(encoded, false);
	if (upper === pathname && lower === pathname && decoded === pathname && encoded === pathname && lowerEncoded === pathname && !needsCanonicalPasses(pathname)) return;
	const readings = [];
	pushReading(readings, pathname, upper);
	pushReading(readings, pathname, lower);
	const spellings = [pathname];
	for (const spelling of [
		encoded,
		lowerEncoded,
		decoded
	]) if (!spellings.includes(spelling)) spellings.push(spelling);
	for (const spelling of spellings) {
		if (!needsCanonicalPasses(spelling)) {
			pushReading(readings, pathname, spelling);
			continue;
		}
		const canonical = canonicalPath(spelling);
		pushReading(readings, pathname, canonical);
		const merged = mergedCanonicalPath(spelling, canonical);
		if (merged !== void 0) pushReading(readings, pathname, merged);
	}
	return readings.length > 0 ? readings : void 0;
}
var ESCAPE_RE_G = /%[\da-f]{2}/gi;
function recaseEscapes(path, upper) {
	return path.includes("%") ? path.replace(ESCAPE_RE_G, (escape) => upper ? escape.toUpperCase() : escape.toLowerCase()) : path;
}
function pushReading(readings, pathname, reading) {
	if (reading !== pathname && !readings.includes(reading)) readings.push(reading);
}
var compareRuleOrder = (a, b) => orderWeight(a[1].handler) - orderWeight(b[1].handler) || (a[0] < b[0] ? -1 : 1);
function orderWeight(handler) {
	return handler?.order ?? 0;
}
export { createMatcherFromFind, headers, memoizeRouteRulesMatcher };
