import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Avoid coupling unit tests to build output for this optional workspace peer.
      "@puzzle-ui/seo/sitemap": fileURLToPath(
        new URL("../seo/src/sitemap/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
