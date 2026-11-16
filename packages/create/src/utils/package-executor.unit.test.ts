import { describe, expect, it } from "vitest";

import { getPackageExecutor } from "./package-executor";

describe("getPackageExecutor", () => {
  it.each([
    ["bun", "bunx", []],
    ["npm", "npx", ["--yes"]],
    ["pnpm", "pnpm", ["dlx"]],
    ["yarn", "yarn", ["dlx"]],
  ] as const)("uses the correct no-install command for %s", (manager, command, prefix) => {
    expect(getPackageExecutor(manager)).toEqual({ command, prefix });
  });
});
