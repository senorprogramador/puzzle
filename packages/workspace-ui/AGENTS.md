# @puzzle-ui/workspace-ui – AI development instructions

## 1. Responsibility

Private React UI for the Workspace sample application. It composes Workspace domain services/contracts with Puzzle UI and Pieces; it is not a general-purpose UI library or persistence service.

## 2. Public API

The package root exports `WorkspaceApp`, `InvitationAcceptance`, `EmailChangeVerification`, `WorkspaceAuthProvider`, `createWorkspaceAuthClient`, and their public types from [`src/index.ts`](./src/index.ts).

## 3. Architecture

`workspace-app.tsx` composes the app experience, `workspace-auth.tsx` adapts the device-local auth flow, and `workspace-device-store.ts` merges browser-local changes with seeded data. App routes and server-backed Workspace APIs remain in the framework applications.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/fullstack`, `@puzzle-ui/pieces`, `@puzzle-ui/ui`, and `@puzzle-ui/workspace`; React and React DOM 19 are peers. Do not add framework imports or put domain/storage services in this UI package.

## 5. Implementation conventions

Prefer existing Pieces and UI components over custom primitives. Preserve the sample's device-local signup boundary: the password verifier remains on the device and only identity is sent to the server; do not send or persist plaintext passwords. Workspace edits in the sample are browser-local overlays on seeded data, not general server persistence. Keep the existing app-specific auth and password-change limitations explicit.

## 6. Testing

Tests under `tests/` use Bun. Cover device auth request payloads and local credential handling, local upsert/delete/merge behavior, and public app interactions. Use existing UI/browser infrastructure when a real browser is required.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

## 8. Documentation

There is no package README. See [`docs/workspace/apps.md`](../../docs/workspace/apps.md) and [`docs/workspace/architecture.md`](../../docs/workspace/architecture.md). Update these when the sample app's auth or local-data behavior changes.

## 9. Common mistakes

- Do not treat device-local signup as a production multi-device account system.
- Do not send passwords or password verifiers to the server.
- Do not describe browser-local changes as durable Workspace service writes.
- Do not duplicate UI or Pieces components without checking their public exports.

## 10. Context-efficient workflow

Read [`src/index.ts`](./src/index.ts), then the target auth/store/app module and its focused Bun test. Use the Workspace architecture and apps docs to verify data ownership and framework responsibilities.
