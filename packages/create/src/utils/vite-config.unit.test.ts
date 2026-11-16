import { describe, expect, it } from "vitest";

import { prependVitePlugin } from "./vite-config";

describe("prependVitePlugin", () => {
  it("keeps an inline plugins array on one line", () => {
    expect(prependVitePlugin("plugins: [react()],", "tailwindcss()")).toBe(
      "plugins: [tailwindcss(), react()],",
    );
  });

  it("keeps a multiline plugins array multiline", () => {
    expect(
      prependVitePlugin("plugins: [\n    react(),\n  ],", "tailwindcss()"),
    ).toBe("plugins: [\n    tailwindcss(),\n    react(),\n  ],");
  });
});
