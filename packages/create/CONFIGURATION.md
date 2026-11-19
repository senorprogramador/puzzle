# Automated project configuration

The `create-puzzle` command remains interactive when invoked without arguments. To scaffold an application without prompts, provide a JSON configuration:

```bash
create-puzzle --config puzzle.config.json
```

These examples invoke the published `create-puzzle` executable. If you use a package-manager launcher, pass the same options after the package name, for example `npx @puzzle-ui/create --config puzzle.config.json`.

The published [`config.schema.json`](./config.schema.json) defines the versioned configuration format. The runtime validates every field and rejects unsupported combinations before creating project files. Unknown fields—including passwords—are rejected.

## Fields

| Field | Required | Values / behavior |
| --- | --- | --- |
| `projectName` | Yes | Non-empty name up to 120 characters. It is normalized to kebab-case for the directory and package name. |
| `framework` | Yes | `next`, `tanstack`, `react-router`, or `react`. |
| `styling` | Yes | `tailwind` or `none`. |
| `auth` | Yes | `true` or `false`. |
| `database` | Conditional | `mongodb`, `d1`, or `custom`. Required when Auth is enabled for Next.js, TanStack Start, or React Router. Not supported for Basic React or when Auth is disabled. |
| `packageManager` | No | `bun`, `npm`, `pnpm`, or `yarn`. If omitted, the CLI detects the invoking package manager and falls back to npm. |

Example for Next.js with D1 Auth:

```json
{
  "projectName": "customer-portal",
  "framework": "next",
  "styling": "tailwind",
  "auth": true,
  "database": "d1",
  "packageManager": "bun"
}
```

Basic React supports client-side Auth UI, but has no generated database integration. Full-stack frameworks require a database choice whenever Auth is enabled.

## Commands

Validate a configuration without checking or creating the target directory:

```bash
create-puzzle --config puzzle.config.json --validate
```

Check the target directory and preview the generation choices without writing project files:

```bash
create-puzzle --config puzzle.config.json --dry-run
```

Generate the project:

```bash
create-puzzle --config puzzle.config.json
```

The CLI refuses an existing project directory. It does not silently overwrite generated files.

## Initial-user credentials

MongoDB and D1 Auth scaffolds create an initial application account. For non-interactive execution, send a JSON object with `email` and `password` fields to stdin and add `--credentials-stdin`:

```bash
trusted-secret-provider read puzzle/initial-user-json |
  create-puzzle --config puzzle.config.json --credentials-stdin
```

The value supplied by the secret provider must be JSON such as `{"email":"owner@example.com","password":"..."}`. Do not put the password in the config, command-line arguments, logs, or generated files. Stdin is bounded to 8192 UTF-8 bytes; the email and password use the same validation limits as the interactive prompts. The credential JSON accepts no extra fields.

`--credentials-stdin` is required only for MongoDB or D1 Auth. It is rejected for validation/dry-run and unsupported configurations. If generation detects an existing project-labeled MongoDB volume, configuration mode preserves the volume and cancels; it never assumes consent to delete data. Use the interactive flow to review and explicitly confirm a reset.

## Shared behavior and validation

Interactive prompts and JSON configuration resolve to the same typed project configuration and project options. The CLI validates configuration and destination paths before project generation. Framework generation, package installation, initial-user setup, and database safety checks use the same implementation in both modes.

Useful checks:

```bash
create-puzzle --help
bun run --filter @puzzle-ui/create typecheck
bun run --filter @puzzle-ui/create test
```

The end-to-end suite also exercises all 28 supported framework, Auth, database, and Tailwind combinations through this configuration interface. It requires Docker Compose, Playwright Chromium, and network access.
