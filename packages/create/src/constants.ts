import type { Framework } from "./types";

export const PACKAGE_NAME = "@puzzle-ui/create";

export const PUZZLE_PACKAGES = [
  "@puzzle-ui/ui@latest",
  "@puzzle-ui/theme@latest",
] as const;

export const PUZZLE_AUTH_PACKAGES = [
  "@puzzle-ui/auth@latest",
  "@puzzle-ui/fullstack@latest",
  "@puzzle-ui/session@latest",
] as const;

export const FRAMEWORKS: {
  value: Framework;
  label: string;
  hint: string;
}[] = [
  {
    value: "react",
    label: "Basic React Project",
    hint: "React + Vite + TypeScript",
  },
  {
    value: "tanstack",
    label: "TanStack Start",
    hint: "Full-stack React framework",
  },
  {
    value: "next",
    label: "Next.js",
    hint: "React framework with App Router",
  },
];
