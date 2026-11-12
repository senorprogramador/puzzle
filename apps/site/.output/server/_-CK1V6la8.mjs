import { TSS_SERVER_FUNCTION, createServerFn } from "./_ssr/createServerFn-DRXAnLP9.mjs";
import { source } from "./_ssr/source-DxywneDS.mjs";
import { notFound } from "./_libs/tanstack__router-core.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-CK1V6la8.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var serverLoader_createServerFn_handler = createServerRpc({
	id: "3754d170b07e5384cb393a7ce01e3317e54e102cb5b75ed0780e1a678ae2d91a",
	name: "serverLoader",
	filename: "src/routes/docs/$.tsx"
}, (opts) => serverLoader.__executeServer(opts));
var serverLoader = createServerFn({ method: "GET" }).validator((slugs) => slugs).handler(serverLoader_createServerFn_handler, async ({ data: slugs }) => {
	const page = source.getPage(slugs);
	if (!page) throw notFound();
	return {
		path: page.path,
		pageTree: await source.serializePageTree(source.getPageTree())
	};
});
export { serverLoader_createServerFn_handler };
