import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/testing/index.ts",
  ],
  unbundle: false,
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: {
    generator: "oxc",
  },
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
  deps: {
    neverBundle: ["bun:test"],
  },
});
