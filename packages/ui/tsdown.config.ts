import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/utilities/rendering/deferred.tsx",
    "src/components/utilities/rendering/fold.tsx",
    "src/components/utilities/rendering/ssr.tsx",
    "src/components/utilities/rendering/static.tsx",
    "src/components/utilities/rendering/next/client.tsx",
    "src/components/utilities/rendering/next/server.tsx",
    "src/components/utilities/rendering/tanstack/client.tsx",
    "src/components/utilities/rendering/tanstack/server.tsx",
    "src/components/utilities/rendering/tanstack/shared.ts",
    "src/zod.ts",
  ],
  unbundle: true,
  format: ["esm", "cjs"],
  fixedExtension: false,
  css: { inject: true },
  dts: true,
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
  deps: {
    neverBundle: [
      "react",
      "react-dom",
      "@puzzle-ui/core",
      "@puzzle-ui/theme",
      "@puzzle-ui/icons",
      "@puzzle-ui/hooks",
      "zod",
    ],
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
