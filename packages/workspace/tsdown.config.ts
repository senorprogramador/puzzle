import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/server.ts"],
  unbundle: true,
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  deps: {
    neverBundle: ["@puzzle-ui/storage", "zod"],
  },
});
