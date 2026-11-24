---
title: Puzzle Production Release
description: Release prerequisites, validation, publishing, and rollback procedures for Puzzle packages.
---

This document describes the release requirements for Puzzle packages.

## 1. Release prerequisites

Before preparing a release:

- All required EPICs must be complete.
- The working tree must be clean.
- All packages must use the same version.
- All workspace dependencies must resolve.
- No production secrets may be committed.
- The latest CI workflow must pass.
- The release must have an assigned semantic version.

Required development tooling:

- Bun 1.4.4.
- Node.js 22 or 24 for the validated CI matrix.
- npm CLI.
- GitHub Copilot access, authenticated for non-interactive CLI use.
- Docker with Docker Compose.
- Chromium through Playwright.

If `copilot` is not on PATH, the release script runs it through
`bun x --package @github/copilot copilot`, downloading it into Bun's shared
package cache when needed without changing workspace dependencies.
Authenticate before releasing:

    bun x --package @github/copilot copilot login

If changelog generation reports missing credentials, the release script starts
Copilot login and retries generation once after you authorize it in the browser.
It does not rerun the builds or tests. Login failures or a failed retry stop the
release before committing or publishing. Existing GitHub CLI authentication
(`gh auth login`) or `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN`
environment variables can also provide credentials. Never commit tokens.

## 2. Required CI checks

The GitHub Actions workflow must pass on both Node versions:

- CI (Node 22)
- CI (Node 24)

Enable branch protection on main and require both checks before merging.

The repository should require:

- Pull requests for changes to main.
- Successful required status checks.
- At least one review for security-sensitive changes.
- No force pushes to main.
- No deletion of main.

The CI workflow uses read-only repository permissions.

## 3. Local validation

Install dependencies:

    bun install --frozen-lockfile

Build every package:

    bun run build

Typecheck the complete workspace:

    bun run typecheck

Run the complete test suite:

    bun run vitest

Build the documentation site:

    bun run --filter '@puzzle-ui/site' build

The complete test command includes:

- Core tests.
- Theme tests.
- Icons tests.
- UI unit tests.
- UI component tests.
- UI browser tests.
- Pieces unit tests.
- Pieces component tests.
- Pieces browser tests.
- Create CLI tests.
- Storage tests.
- D1 conformance tests.
- MongoDB conformance tests.
- Session tests.
- Auth tests.
- Fullstack integration tests.
- Fullstack browser tests.

The MongoDB tests require Docker and a working replica set.

The D1 tests use Miniflare.

## 4. Production configuration

### Application

Configure the production application to:

- Serve authentication routes over HTTPS.
- Use an exact allowed-origin list.
- Use secure HttpOnly session cookies.
- Keep session tokens out of browser storage.
- Use a restrictive SameSite policy.
- Configure WebAuthn RP ID and expected origin.
- Disable development-only authentication providers.

### Storage

Use durable storage.

For MongoDB:

- Use a replica set.
- Enable the transaction capabilities required by the adapter.
- Configure authentication and TLS.
- Configure backups.
- Monitor connection failures and transaction errors.

For Cloudflare D1:

- Use a production D1 database.
- Apply database migrations before enabling new application code.
- Verify unique constraints and conditional-write behavior.
- Keep local Miniflare state out of production artifacts.

Do not use in-memory storage for production sessions or authentication.

### Secrets

Configure the following values using the deployment platform's secret manager:

- Rate-limit HMAC secret.
- TOTP encryption keys.
- Database credentials.
- Email provider credentials.
- Application-specific secrets.

Use separate secrets for development, staging and production.

Do not reuse test encryption keys in production.

Keep previous TOTP encryption keys available during a controlled key-rotation
period when existing encrypted records still depend on them.

## 5. Authentication security acceptance

Before enabling production authentication, verify:

- Registration and sign-in work.
- Password reset does not disclose account existence.
- Email verification tokens are single-use.
- Password changes invalidate existing sessions.
- Session rotation invalidates the previous session.
- CSRF rejects untrusted origins.
- Rate limiting works across application instances.
- MFA challenges expire correctly.
- Recovery codes cannot be reused.
- TOTP replay is rejected.
- WebAuthn challenge validation works.
- WebAuthn origin validation works.
- WebAuthn RP ID validation works.
- Required MFA enrollment does not create a normal session before
  successful enrollment.
- Only authenticated states authorize protected operations.

## 6. Release preparation

The release script publishes all packages in dependency order.

The release order is:

1. core
2. commerce
3. theme
4. hooks
5. icons
6. storage
7. media
8. media-cloudflare
9. cms
10. ui
11. pieces
12. create
13. session
14. storage-d1
15. storage-mongodb
16. auth
17. fullstack
18. payment-providers
19. seo
20. i18n

The script checks package coverage, version consistency, typechecks, tests,
builds, AI instructions, documentation, and npm package contents. It generates
changelogs, then audits public site documentation and consumer AI instructions
against the implementation and package contents for the release. Copilot
automatically applies only the validated documentation edits returned by that
audit.

Perform a dry run first:

    bun run release:dry-run

Inspect the output and confirm that every package is included.

A dry run must not publish packages, create commits or create Git tags.
It runs Copilot changelog generation and the documentation audit, then performs
`npm publish --dry-run` for each package. It restores version, lockfile,
generated registry, changelog, documentation, and consumer AI-instruction
changes afterwards. Copilot usage may consume premium requests.

After validation, Copilot reads the files changed since the current version's
release tag (`v<current-version>`) and returns release notes for every package.
Fetch that tag before releasing; it must be an ancestor of HEAD.
The script prepends a dated version entry to each package's `CHANGELOG.md`,
incorporates any pending package notes, and preserves previous release history.
Packages without substantive changes receive a lockstep version-bump note.
Invalid or incomplete Copilot output stops the release before publishing.

## 7. Publishing

Before a real release:

- Confirm the npm account is authenticated.
- Confirm that the package scope is available.
- Confirm the intended release type.
- Confirm the CI checks are green.
- Confirm the working tree is clean.

Start the release:

    bun run release

Select one of:

- patch
- minor
- major

After building and testing, the release procedure generates changelogs and
audits public documentation and consumer AI instructions. It then validates
the updated instructions and site, and runs npm package preflights. Packages
are published in dependency order. The script polls npm for each exact package
version every 10 seconds, for up to 15 minutes, before committing and pushing
the release changes. Once that commit is pushed, it creates and pushes the
annotated release tag.

On macOS and Linux, npm login and publishing use Bash and the system `script`
utility so the release automatically answers "Press ENTER to open in the browser".
Complete authentication in the browser yourself; OTP and other prompts remain
manual. npm login uses web authentication.

Failures before any package is successfully published restore release versions,
lockfile, generated registry, changelogs, and documentation/AI-instruction
edits. Once any package has been published, the script preserves all release
files and reports the packages it knows were published. This also applies if
npm propagation times out or a later Git commit, push, or tag operation fails.
Inspect npm and Git state, then complete only the missing steps; do not blindly
rerun the release or republish versions that are already available.

## 8. Post-release verification

Verify each package on npm:

- @puzzle-ui/core
- @puzzle-ui/commerce
- @puzzle-ui/theme
- @puzzle-ui/hooks
- @puzzle-ui/icons
- @puzzle-ui/storage
- @puzzle-ui/media
- @puzzle-ui/media-cloudflare
- @puzzle-ui/cms
- @puzzle-ui/ui
- @puzzle-ui/pieces
- @puzzle-ui/create
- @puzzle-ui/session
- @puzzle-ui/storage-d1
- @puzzle-ui/storage-mongodb
- @puzzle-ui/auth
- @puzzle-ui/fullstack
- @puzzle-ui/payment-providers
- @puzzle-ui/seo
- @puzzle-ui/i18n

Verify:

- Package versions match the release tag.
- Package exports resolve.
- Type declarations are present.
- ESM entry points resolve.
- CommonJS entry points resolve where provided.
- CSS files are included where required.
- Peer dependencies are documented.
- Package installation works in a clean consumer project.

Run a production smoke test using the published packages.

## 9. Rollback

Published npm versions must never be overwritten.

If a release contains a critical issue:

1. Stop further deployments.
2. Identify the affected packages.
3. Revert the application deployment where possible.
4. Publish a corrected patch release.
5. Verify dependency compatibility.
6. Invalidate affected sessions when security requires it.
7. Review audit events and security logs.
8. Communicate the issue and remediation.

For compromised credentials or encryption keys, follow the application's
incident response procedure.

## 10. Runtime validation limitations

Passing Node.js and Miniflare tests does not replace deployment smoke tests.

Before declaring a production deployment ready, test the actual deployment
environment.

This includes:

- A real Node.js deployment.
- A real Cloudflare Workers deployment when D1 is used.
- The configured production database.
- Production cookie behavior behind the actual reverse proxy.
- WebAuthn using the actual production domain.
- Email delivery and recovery flows.

Record the tested runtime versions and deployment configuration alongside
the release.
