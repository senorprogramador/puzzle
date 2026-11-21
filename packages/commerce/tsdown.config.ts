import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  root: "src",
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
});
