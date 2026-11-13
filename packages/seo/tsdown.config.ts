import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/core/index.ts",
    "src/context/index.ts",
    "src/schema/index.ts",
    "src/metadata/index.ts",
    "src/react/index.ts",
    "src/server/index.ts",
    "src/sitemap/index.ts",
    "src/robots/index.ts",
    "src/urls/index.ts",
    "src/testing/index.ts",
    "src/validation/index.ts",
    "src/next/index.ts",
    "src/tanstack/index.ts",
    "src/react-router/index.ts",
  ],
  unbundle: true,
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
});
