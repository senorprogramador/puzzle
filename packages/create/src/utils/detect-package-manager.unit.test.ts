import { describe, expect, it } from "vitest";

import { detectPackageManager } from "./detect-package-manager";

describe("detectPackageManager", () => {
  it.each([
    ["bun/1.4.4", "bun"],
    ["npm/11.0.0 node/v22.0.0", "npm"],
    ["pnpm/10.0.0 npm/? node/v22.0.0", "pnpm"],
    ["yarn/4.6.0 npm/? node/v22.0.0", "yarn"],
  ] as const)("detects %s as %s", (userAgent, expected) => {
    expect(detectPackageManager(userAgent)).toBe(expected);
  });

  it("defaults to npm when the user agent is empty", () => {
    expect(detectPackageManager("")).toBe("npm");
  });

  it("defaults to npm for an unknown package manager", () => {
    expect(detectPackageManager("unknown/1.0.0")).toBe("npm");
  });
});
