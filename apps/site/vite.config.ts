import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createLogger, defineConfig, type Plugin } from "vite";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { createFontRouteRules } from "@puzzle-ui/theme/nitro";

const logger = createLogger();
const routerEntry = createRequire(import.meta.url).resolve(
  "@tanstack/react-router",
);

const routerCoreResolution: Plugin = {
  name: "puzzle:router-core-resolution",
  enforce: "pre",
  resolveId(source, _importer, options) {
    if (
      source === "@tanstack/router-core" ||
      source.startsWith("@tanstack/router-core/")
    ) {
      // Use React Router's core dependency for both SSR transport and hydration.
      return this.resolve(source, routerEntry, { ...options, skipSelf: true });
    }
  },
};

const DAY = 60 * 60 * 24;
const YEAR = DAY * 365;

const cachedForADay = ["/", "/docs", "/docs/**"];

const cachedForAYear = [
  "/assets/**",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-96x96.png",
  "/site.webmanifest",
  "/puzzle_social.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

const dayCache = {
  headers: {
    "cache-control": `public, max-age=${DAY}, s-maxage=${DAY}`,
  },
};

const immutableCache = {
  headers: {
    "cache-control": `public, max-age=${YEAR}, immutable`,
  },
};

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
    // MDX importers must share source modules and contexts with TSX importers.
    alias: ["ui", "pieces", "icons"].map((name) => ({
      find: `@puzzle-ui/${name}`,
      replacement: fileURLToPath(
        new URL(`../../packages/${name}/src`, import.meta.url),
      ),
    })),
    noExternal: [
      "fumadocs-core",
      "fumadocs-ui",
      "fumadocs-openapi",
      "@fumadocs/base-ui",
    ],
  },
  build: {
    cssMinify: "esbuild",

    rolldownOptions: {
      output: {
        codeSplitting: {
          // Keep shared source bounded without pulling component CSS out of page assets.
          groups: [
            {
              name: "schemaorg",
              test: /schemaorg-chunks[\\/]/,
              maxSize: 400 * 1024,
            },
            {
              name: "puzzle-pieces",
              test: (id) =>
                /packages[\\/]pieces[\\/]src[\\/]/.test(id) &&
                !/\.css(?:\?.*)?$/.test(id),
              entriesAware: true,
              includeDependenciesRecursively: false,
              maxSize: 350 * 1024,
            },
            {
              name: "puzzle-ui",
              test: (id) =>
                /packages[\\/]ui[\\/]src[\\/]/.test(id) &&
                !/\.css(?:\?.*)?$/.test(id),
              entriesAware: true,
              includeDependenciesRecursively: false,
              maxSize: 350 * 1024,
            },
            {
              name: "site-doc-examples",
              test: (id) =>
                /apps[\\/]site[\\/]src[\\/]components[\\/]doc-examples[\\/]/.test(
                  id,
                ) && !/\.css(?:\?.*)?$/.test(id),
              entriesAware: true,
              includeDependenciesRecursively: false,
              maxSize: 350 * 1024,
            },
          ],
        },
      },
    },
  },
  plugins: [
    routerCoreResolution,
    tanstackStart(),
    nitro({
      compressPublicAssets: true,
      routeRules: {
        ...Object.fromEntries([
          ...cachedForADay.map((path) => [path, dayCache]),
          ...cachedForAYear.map((path) => [path, immutableCache]),
        ]),
        ...createFontRouteRules(),
      },
    }),
    viteReact(),
    tailwindcss({
      optimize: {
        minify: false,
      },
    }),
    fumadocsMdx(),
  ],
});
