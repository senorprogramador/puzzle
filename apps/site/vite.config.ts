import { createLogger, defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

const logger = createLogger();

const DAY = 60 * 60 * 24;
const YEAR = DAY * 365;

const cachedForADay = ["/", "/docs", "/docs/**", "/fonts/puzzle-fonts.css"];

const cachedForAYear = [
  "/fonts/*.{woff,woff2,ttf,otf}",
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
  },
  build: {
    cssMinify: "esbuild",
  },
  plugins: [
    tanstackStart(),
    nitro({
      routeRules: Object.fromEntries([
        ...cachedForADay.map((path) => [path, dayCache]),
        ...cachedForAYear.map((path) => [path, immutableCache]),
      ]),
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
