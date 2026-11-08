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
  deps: {
    neverBundle: [
      "react",
      "@puzzle/core",
      "@puzzle/theme",
      "@puzzle/icons",
      "@puzzle/hooks",
    ],
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
