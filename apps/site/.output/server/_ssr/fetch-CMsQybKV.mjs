import "../_runtime.mjs";
import { join } from "./url-BF81yL4m-CIPmfM51.mjs";
import { require_react } from "../_libs/react.mjs";
require_react();
var globalCache = /* @__PURE__ */ new Map();
async function searchFetch({ api = join("/", "/api/search"), locale, tag, cache = globalCache }, query) {
	const url = new URL(api, window.location.origin);
	url.searchParams.set("query", query);
	if (locale) url.searchParams.set("locale", locale);
	if (tag) url.searchParams.set("tag", Array.isArray(tag) ? tag.join(",") : tag);
	const key = url.toString();
	const cached = cache.get(key);
	if (cached) return cached;
	const res = await fetch(url);
	if (!res.ok) throw new Error(await res.text());
	const result = await res.json();
	cache.set(key, result);
	return result;
}
function fetchClient(options = {}) {
	return {
		deps: [
			options.api,
			options.locale,
			String(options.tag)
		],
		search: (query) => searchFetch(options, query)
	};
}
export { fetchClient };
