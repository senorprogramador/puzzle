import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/stripe.ts",
    "src/mollie.ts",
    "src/paypal.ts",
    "src/adyen.ts",
  ],
  root: "src",
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
  deps: {
    neverBundle: ["@puzzle-ui/commerce"],
  },
});
