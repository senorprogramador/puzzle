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
      "react-dom",
      "@puzzle-ui/pieces",
      "@puzzle-ui/ui",
      "@puzzle-ui/workspace",
    ],
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
