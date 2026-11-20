# @puzzle-ui/create – AI development instructions

## 1. Responsibility

The `create-puzzle` CLI scaffolds Puzzle React applications. No arguments start the interactive flow; `--config` supports validated non-interactive execution. The package is CLI-only, not an importable library API.

## 2. Public API

The package publishes the `create-puzzle` binary (`dist/index.js`), README, `CONFIGURATION.md`, and `config.schema.json`. There is no package export map.

## 3. Architecture

- `src/configuration.ts` validates the shared configuration model and resolves it to project options; `config.schema.json` is the published JSON Schema.
- `src/cli.ts` parses CLI modes and connects interactive prompts, validation/dry-run, safe stdin credentials, and project creation.
- `src/prompts.ts` defines the interactive project choices and defaults using that same configuration model.
- `src/create-project.ts` generates framework files; `src/post-generation.ts` handles database safeguards, package installation, fonts, and initial-user setup.
- `src/frameworks/` contains Next.js, TanStack Start, React Router, and Basic React/Vite generators.
- `src/tailwind/`, `src/theme/`, and `src/auth/` configure optional features and generated files.
- `src/utils/` handles package-manager detection, execution, validation, and common file operations.
- `e2e/` tests generated project shapes against packed local packages.

## 4. Dependencies

The runtime dependency is `@clack/prompts`. Frameworks, templates, and generated app dependencies are selected by generator code; do not add them as Create runtime dependencies without a concrete CLI need.

## 5. Implementation conventions

Keep framework-specific generation inside its generator and shared changes in the relevant configuration module. Tailwind is enabled by default; Auth is opt-in. Full-stack frameworks can select MongoDB, D1, or a custom database; Basic React does not receive a database integration. Detect and use npm, Bun, pnpm, or Yarn as the selected generator supports.

Treat generated environment files and bootstrap credentials as security-sensitive. Keep passwords masked, bounded, and off command lines/configuration files; accept automation credentials only through stdin. Configuration mode must never automatically reset MongoDB volumes. Preserve existing project directories and database volumes unless the interactive user explicitly confirms a destructive reset. Do not silently overwrite files or existing data.

## 6. Testing

Unit and integration tests live beside source modules. `e2e/` runs the supported scaffold matrix through the non-interactive configuration interface against packed local Puzzle packages, then installs, builds, typechecks, and exercises generated applications. The suite currently covers 28 framework/feature combinations.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run test:e2e`
- `bun run build`

E2E requires Bun, Node.js 20.19+, Docker Compose, Playwright Chromium, and network access. `PUZZLE_E2E_FILTER` narrows scaffold IDs; `PUZZLE_E2E_CONCURRENCY` sets parallel framework files; `PUZZLE_E2E_SKIP_BUILD=1` reuses builds; `PUZZLE_E2E_KEEP=1` preserves generated projects/containers.

## 8. Documentation

See [`README.md`](./README.md), the [Create documentation](../../apps/site/content/docs/create/index.mdx), and the [deployment guide](../../apps/site/content/docs/create/deployment.mdx). Update supported framework options, generated files, environment variables, and requirements together.

## 9. Common mistakes

- Keep interactive and non-interactive execution on the shared `ProjectConfiguration` model.
- Keep the runtime validator, JSON Schema, and supported framework/database options synchronized.
- Do not add credentials or destructive-reset approval to the project configuration.
- Do not change prompt options without updating the scaffold matrix and relevant tests.
- Do not test only the CLI prompt: verify the generated files for each affected framework/feature.
- Do not send credentials in process arguments or write user passwords to generated files.

## 10. Context-efficient workflow

Read `src/prompts.ts` and `src/types.ts`, then the selected framework generator and only the relevant feature configurator. Check `e2e/matrix.ts` and matching E2E coverage when altering a project shape.
