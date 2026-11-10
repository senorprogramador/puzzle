import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/auth/client/index.ts",
    "src/auth/server/index.ts",
    "src/auth/shared/index.ts",
    "src/auth/next/index.ts",
    "src/auth/tanstack/index.ts",
  ],
  unbundle: true,
  root: "src",
  format: ["esm", "cjs"],
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  copy: ["../../LICENSE"],
  deps: {
    neverBundle: [
      "@puzzle-ui/ui",
      "@puzzle-ui/auth",
      "@puzzle-ui/session",
      "@simplewebauthn/browser",
      "react",
      "react-dom",
      "next",
      "@tanstack/react-start",
    ],
  },
});
