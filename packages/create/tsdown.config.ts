import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20.19",
  platform: "node",
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  outDir: "dist",
  fixedExtension: false,
});
