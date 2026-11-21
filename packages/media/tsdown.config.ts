import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "browser/index": "src/browser/index.ts",
    "testing/index": "src/testing/index.ts",
    "testing/adapters": "src/testing/adapters.ts",
    "image-worker": "src/browser/image-worker.ts",
  },
  unbundle: false,
  format: {
    esm: {},
    cjs: { define: { "import.meta.url": "undefined" } },
  },
  fixedExtension: false,
  dts: {
    generator: "oxc",
  },
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
  deps: {
    neverBundle: ["@puzzle-ui/storage", "bun:test"],
  },
});
