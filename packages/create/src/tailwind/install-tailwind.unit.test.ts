import { describe, expect, it, vi } from "vitest";

import type { PackageManager } from "../types";

import { installTailwind } from "./install-tailwind";

const packageManagers: {
  packageManager: PackageManager;
  command: string;
  prefix: string[];
}[] = [
  {
    packageManager: "bun",
    command: "bun",
    prefix: ["add", "-D"],
  },
  {
    packageManager: "npm",
    command: "npm",
    prefix: ["install", "--save-dev"],
  },
  {
    packageManager: "pnpm",
    command: "pnpm",
    prefix: ["add", "-D"],
  },
  {
    packageManager: "yarn",
    command: "yarn",
    prefix: ["add", "--dev"],
  },
];

describe("installTailwind", () => {
  it.each(packageManagers)(
    "installs Vite Tailwind dependencies with $packageManager",
    async ({ packageManager, command, prefix }) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await installTailwind({
        directory: "/project",
        framework: "react",
        packageManager,
        runner,
      });

      expect(runner).toHaveBeenCalledWith(
        command,
        [...prefix, "tailwindcss@latest", "@tailwindcss/vite@latest"],
        { cwd: "/project" },
      );
    },
  );

  it.each(packageManagers)(
    "installs Next.js Tailwind dependencies with $packageManager",
    async ({ packageManager, command, prefix }) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await installTailwind({
        directory: "/project",
        framework: "next",
        packageManager,
        runner,
      });

      expect(runner).toHaveBeenCalledWith(
        command,
        [
          ...prefix,
          "tailwindcss@latest",
          "@tailwindcss/postcss@latest",
          "postcss@latest",
        ],
        { cwd: "/project" },
      );
    },
  );
});
