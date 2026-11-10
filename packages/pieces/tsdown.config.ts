import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
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
      "@puzzle-ui/core",
      "@puzzle-ui/theme",
      "@puzzle-ui/icons",
      "@puzzle-ui/hooks",
      "@puzzle-ui/ui",
    ],
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
