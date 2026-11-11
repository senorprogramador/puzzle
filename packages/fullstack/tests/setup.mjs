import { registerHooks } from "node:module";

registerHooks({
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
