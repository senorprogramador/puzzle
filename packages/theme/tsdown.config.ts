import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components-context.tsx",
    "src/scope-context.tsx",
  ],
  unbundle: true,
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  deps: {
    neverBundle: ["react", "@puzzle/core"],
  },
  suppressWarnings: [/MODULE_LEVEL_DIRECTIVE/],
});
