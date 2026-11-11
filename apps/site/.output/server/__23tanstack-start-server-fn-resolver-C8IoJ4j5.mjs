// node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C8IoJ4j5.js
var manifest = { "3754d170b07e5384cb393a7ce01e3317e54e102cb5b75ed0780e1a678ae2d91a": {
	functionName: "serverLoader_createServerFn_handler",
	importer: () => import("./_-DJPtgSt_.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
export { getServerFnById };
