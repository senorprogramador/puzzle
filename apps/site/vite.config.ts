import { createLogger, defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

const logger = createLogger();
const warn = logger.warn.bind(logger);
logger.warn = (message, options) => {
  // Fumadocs shares this server runtime with its client macro; the fs import
  // is tree-shaken from client output.
  const isFumadocsServerImportWarning =
    message.includes(
      'Module "node:fs/promises" has been externalized for browser compatibility',
    ) && message.includes("fumadocs-mdx/dist/runtime/server.js");
  if (isFumadocsServerImportWarning) {
    return;
  }
  warn(message, options);
};

export default defineConfig({
  customLogger: logger,
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    cssMinify: "esbuild",
  },
  plugins: [
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss({ optimize: false }),
    fumadocsMdx(),
  ],
});
