import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/components-context.tsx"],
  unbundle: true,
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "@puzzle/core"],
});
