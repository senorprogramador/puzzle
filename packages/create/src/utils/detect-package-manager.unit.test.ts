import { describe, expect, it } from "vitest";

import { detectPackageManager } from "./detect-package-manager";

describe("detectPackageManager", () => {
  it("detects Bun", () => {
    expect(detectPackageManager("bun/1.4.4")).toBe("bun");
  });

  it("detects npm", () => {
    expect(detectPackageManager("npm/11.0.0 node/v22.0.0")).toBe("npm");
  });

  it("defaults to npm", () => {
    expect(detectPackageManager("")).toBe("npm");
  });

  it("defaults to npm for an unknown package manager", () => {
    expect(detectPackageManager("pnpm/10.0.0")).toBe("npm");
  });
});
