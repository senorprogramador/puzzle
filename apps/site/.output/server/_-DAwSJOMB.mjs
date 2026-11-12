import { getServerFnById } from "./__23tanstack-start-server-fn-resolver-Bxb3Py9r.mjs";
import { TSS_SERVER_FUNCTION, createServerFn } from "./_ssr/createServerFn-DRXAnLP9.mjs";
import { docs } from "./_ssr/source-DxywneDS.mjs";
import { createFileRoute, lazyRouteComponent } from "./_libs/@tanstack/react-router+[2...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-DAwSJOMB.js
var SITE_URL = "https://puzzle-ui.com";
var getCanonicalUrl = (path) => new URL(path, SITE_URL).toString();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var $$splitComponentImporter = () => import("./_-uum16i8j.mjs");
var Route = createFileRoute("/docs/$")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async ({ params }) => {
		const data = await serverLoader({ data: params._splat?.split("/") ?? [] });
		await docs.getPage(data.path)?.preload();
		return data;
	},
	head: ({ params }) => {
		const slug = params._splat ?? "";
		const canonicalPath = slug ? `/docs/${slug.split("/").map((segment) => encodeURIComponent(segment)).join("/")}` : "/docs";
		return {
			links: [{
				rel: "canonical",
				href: getCanonicalUrl(canonicalPath)
			}],
			meta: [{
				property: "og:url",
				content: getCanonicalUrl(canonicalPath)
			}]
		};
	}
});
var serverLoader = createServerFn({ method: "GET" }).validator((slugs) => slugs).handler(createSsrRpc("3754d170b07e5384cb393a7ce01e3317e54e102cb5b75ed0780e1a678ae2d91a"));
export { Route, getCanonicalUrl };
