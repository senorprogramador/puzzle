# Changelog

All notable changes to `@puzzle-ui/fullstack` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.20.0 - 2026-11-25

- No changes; version bumped in lockstep.

## 0.19.1 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.19.0 - 2026-11-24

- Breaking: rewrote the CMS client, shared contracts and server handlers around code-first collections and singletons, with flat JSON-safe `CmsApiDocument` records and `where`/`sort`/`limit`/`page`/`locale` queries.
- Added a client API of `cms.collection(key)` and `cms.singleton(key)` with `find`, `create`, `update`, `delete`, `purge`, publishing, scheduling, revision, locale-variant and translation methods, and a separate `.public` client for published reads.
- Added routes derived from the static CMS config, including a scheduler worker route that derives tenant context from the host, plus Next.js and TanStack Start handlers.
- Added opt-in webhook management and change-event routes and client methods, with sanitized DTOs that never expose secrets, secret references or delivery lease tokens.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- Added `@puzzle-ui/fullstack/payments/shared` and `@puzzle-ui/fullstack/payments/server` for serializable payment contracts and server-only order resolution, provider operations, idempotency, refunds, and webhook handling built on `@puzzle-ui/commerce`.
- Documented the Auth, Media, CMS, and Payments subpaths as published; there is still no package-root export.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- Added workspace-only CMS and Media client/server, Next.js, and TanStack integrations with tenant authorization and sanitized contracts.
- Added optional CMS webhook administration and Media audit callbacks; hosts must provide policies, audit storage, and a safe webhook transport.
- Added payment server and shared entry points.
- Added an opt-in completed-upload content verification callback so a host content inspector can run before an asset is created.
- Fixed guarded permanent deletion for soft-deleted media assets and prevented single-upload retries from using expired targets.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Added packaged AI guidance (`ai/` instructions and manifest).

## 0.12.0 - 2026-11-18

- Added auth lifecycle routes and handlers for requesting and verifying an email change, updating the profile name and image, listing sessions and revoking other sessions.
- Added an `allowPasswordChange` lifecycle option to disable password changes with a `PASSWORD_CHANGE_DISABLED` response, and an `emailChangeUrl` option for email-change links.
- Added client auth components `PasswordResetRequestForm`, `PasswordResetForm`, `EmailVerificationNotice`, `EmailVerificationForm`, `ChangePasswordForm` and `RequiredMfaEnrollment`, with their prop types.
- Added a `demoTotpCode` option on `AuthProvider` that shows the demo authentication code on the sign-in MFA challenge.

## 0.11.0 - 2026-11-16

- Added an `offerPasskeyAfterSignIn` option to `AuthExperience`. After sign-in, users without a passkey can add one (the current password is required) and see their recovery codes, or skip the step.
- Added optional `passkeyOfferDescription`, `passkeyAdded` and `skip` auth messages, with English defaults, for the passkey enrollment step.

## 0.10.1 - 2026-11-16

- Fixed the auth experience so sign-in pages show the MFA challenge form when a sign-in is awaiting a second factor, instead of the password form.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- Fixed hydration mismatches in the sign-in, MFA challenge, MFA enrollment, and MFA settings forms by detecting passkey support only after hydration.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

### Added

- Initial release with a React authentication client, provider, hooks, customizable authentication forms and screens, localization, and passkey support.
- Added server-side authentication handlers for MFA, email verification, password reset and changes, sessions, and readiness, plus Next.js App Router and TanStack Start adapters.
- Added shared public authentication contracts for client/server integrations.
