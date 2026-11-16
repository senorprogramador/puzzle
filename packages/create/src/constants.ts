import type { AuthDatabase, Framework, FullStackFramework } from "./types";

export const PACKAGE_NAME = "@puzzle-ui/create";

export const DOCS_URL = "https://puzzle-ui.com/docs";

export const PUZZLE_PACKAGES = [
  "@puzzle-ui/ui@latest",
  "@puzzle-ui/theme@latest",
] as const;

export const PUZZLE_AUTH_PACKAGES = [
  "@puzzle-ui/auth@latest",
  "@puzzle-ui/fullstack@latest",
  "@puzzle-ui/session@latest",
] as const;

/**
 * Server dependencies for each Puzzle Auth storage option.
 */
export const AUTH_DATABASE_PACKAGES: Record<AuthDatabase, readonly string[]> = {
  mongodb: [
    "@puzzle-ui/storage@latest",
    "@puzzle-ui/storage-mongodb@latest",
    "mongodb@latest",
    "@node-rs/argon2@latest",
  ],
  d1: [
    "@puzzle-ui/storage@latest",
    "@puzzle-ui/storage-d1@latest",
  ],
  custom: ["@puzzle-ui/storage@latest", "@node-rs/argon2@latest"],
};

/**
 * Cloudflare tooling required to run D1 locally and deploy to Workers.
 */
export const D1_FRAMEWORK_PACKAGES: Record<
  FullStackFramework,
  { dependencies: readonly string[]; devDependencies: readonly string[] }
> = {
  next: {
    dependencies: ["@opennextjs/cloudflare@latest"],
    devDependencies: ["wrangler@latest"],
  },
  tanstack: {
    dependencies: [],
    devDependencies: ["@cloudflare/vite-plugin@latest", "wrangler@latest"],
  },
  "react-router": {
    dependencies: [],
    devDependencies: ["@cloudflare/vite-plugin@latest", "wrangler@latest"],
  },
};

/**
 * Node.js server output for TanStack Start projects that do not deploy to
 * Cloudflare Workers.
 */
export const TANSTACK_NITRO_PACKAGES = ["nitro@latest"] as const;

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
  {
    value: "react-router",
    label: "React Router",
    hint: "Full-stack React Router framework mode",
  },
];

export const AUTH_DATABASES: {
  value: AuthDatabase;
  label: string;
  hint: string;
}[] = [
  {
    value: "mongodb",
    label: "MongoDB",
    hint: "Includes a Docker Compose replica set for local development",
  },
  {
    value: "d1",
    label: "Cloudflare D1",
    hint: "Runs on Cloudflare Workers; local D1 needs no account",
  },
  {
    value: "custom",
    label: "Custom",
    hint: "Bring your own Puzzle Storage adapter",
  },
];

export const isFullStackFramework = (
  framework: Framework,
): framework is FullStackFramework => framework !== "react";
