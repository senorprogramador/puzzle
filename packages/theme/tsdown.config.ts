import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components-context.tsx",
    "src/scope-context.tsx",
    "src/cli.ts",
    "src/nitro.ts",
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
    neverBundle: ["react", "@puzzle-ui/core"],
  },
  checks: {
    legacyCjs: false,
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
