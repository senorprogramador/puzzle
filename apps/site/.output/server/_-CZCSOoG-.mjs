import { getServerFnById } from "./__23tanstack-start-server-fn-resolver-C8IoJ4j5.mjs";
import { TSS_SERVER_FUNCTION, createServerFn } from "./_ssr/createServerFn-DRXAnLP9.mjs";
import { docs } from "./_ssr/source-CzFR8U2j.mjs";
import { createFileRoute, lazyRouteComponent } from "./_libs/@tanstack/react-router+[2...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-CZCSOoG-.js
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
var $$splitComponentImporter = () => import("./_-BnQ6iKBk.mjs");
var Route = createFileRoute("/docs/$")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async ({ params }) => {
		const data = await serverLoader({ data: params._splat?.split("/") ?? [] });
		await docs.getPage(data.path)?.preload();
		return data;
	}
});
var serverLoader = createServerFn({ method: "GET" }).validator((slugs) => slugs).handler(createSsrRpc("3754d170b07e5384cb393a7ce01e3317e54e102cb5b75ed0780e1a678ae2d91a"));
export { Route };
