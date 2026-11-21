# Puzzle UI Roadmap

This roadmap separates capabilities already present in published packages from
ideas that have not been committed to a release. It has no target dates.

## Current capabilities

“Completed” means the package or tooling is present in the repository and
published to npm; it is not a production-readiness or support guarantee.

| Area | Status | Current capability |
| --- | --- | --- |
| UI and theme | Completed | `@puzzle-ui/ui` components and `@puzzle-ui/theme` tokens/provider are published. |
| Core, hooks, icons, and sections | Completed | `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, and `@puzzle-ui/pieces` provide shared utilities and React building blocks. |
| SEO | Completed | `@puzzle-ui/seo` provides metadata, structured data, sitemap, robots, and related utilities. |
| Multilingual support | Completed | `@puzzle-ui/i18n` provides locale resolution, ICU translations, Intl formatting, localized routing, catalog tooling, React bindings, and framework adapters. |
| Authentication, sessions, and storage | Completed | `@puzzle-ui/auth`, `@puzzle-ui/session`, `@puzzle-ui/storage`, and the D1 and MongoDB adapters are published. |
| Framework integrations | Completed | `@puzzle-ui/fullstack` publishes client, server, Next.js, and TanStack Start entry points. |
| Project generator | Completed | `@puzzle-ui/create` offers Next.js App Router, TanStack Start, React Router, and Basic React/Vite templates. |
| Documentation and playground | Completed | The repository contains a documentation site and a Storybook playground. |

These descriptions summarize package metadata and repository structure; consult
the package documentation for exact APIs and compatibility.

## Under consideration

The following are discussion topics, not scheduled or promised work:

- Establish a formal supported-version and compatibility policy for the 0.x
  packages.
- Publish a confirmed private reporting channel for security and conduct
  concerns.
- Maintain a public roadmap through GitHub issues, milestones, or a project
  board.

## Planning status

As of 2026-11-21, the repository's public GitHub API returned no open issues or
milestones. Discussions are enabled, but no public project board could be
verified. No work is therefore marked Planned or In Progress here. Follow
[GitHub Issues](https://github.com/senorprogramador/puzzle/issues) and
[Discussions](https://github.com/senorprogramador/puzzle/discussions) for
proposals and maintainer-confirmed priorities.
