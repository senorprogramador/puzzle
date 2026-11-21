import { registerHooks } from "node:module";

const workspacePackages = new Map([
  [
    "@puzzle-ui/media",
    new URL("../../media/dist/index.js", import.meta.url).href,
  ],
  [
    "@puzzle-ui/media/testing/adapters",
    new URL("../../media/dist/testing/adapters.js", import.meta.url).href,
  ],
  [
    "@puzzle-ui/storage",
    new URL("../../storage/dist/index.js", import.meta.url).href,
  ],
]);

registerHooks({
  resolve(specifier, context, nextResolve) {
    const workspaceEntry = workspacePackages.get(specifier);
    if (workspaceEntry) {
      return nextResolve(workspaceEntry, context);
    }

    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    // Node's rendering tests do not need browser styles.
    if (url.startsWith("file:") && new URL(url).pathname.endsWith(".css")) {
      return {
        format: "module",
        source: "export {};",
        shortCircuit: true,
      };
    }

    return nextLoad(url, context);
  },
});
