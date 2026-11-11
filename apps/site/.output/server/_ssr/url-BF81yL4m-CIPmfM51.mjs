// node_modules/.nitro/vite/services/ssr/assets/url-BF81yL4m-CIPmfM51.js
function join(...paths) {
	let out = "";
	for (let p of paths) {
		if (out.length > 0) {
			if (p.startsWith("/")) p = p.slice(1);
			if (!out.endsWith("/")) out += "/";
		}
		out += p;
	}
	return out;
}
/**
* normalize URL into the Fumadocs standard form (`/slug-1/slug-2`).
*
* This includes URLs with trailing slashes.
*/
function normalizeUrl(url) {
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (!url.startsWith("/")) url = "/" + url;
	if (url.length > 1 && url.endsWith("/")) url = url.slice(0, -1);
	return url;
}
export { join, normalizeUrl };
