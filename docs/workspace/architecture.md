# Puzzle Workspace architecture

`@puzzle-ui/workspace` is a private monorepo package shared by the TanStack
Start and Next.js applications. It owns framework-independent domain contracts,
validation, collection schemas, and services. The applications remain thin
request and rendering adapters.

## Import boundaries

- `@puzzle-ui/workspace` and `@puzzle-ui/workspace/client` expose domain types,
  validation schemas, and collection-name constants.
- `@puzzle-ui/workspace/server` exposes storage initialization and services.
- Client code must not import the `/server` entrypoint.
- The package does not import either framework, database driver, or Auth
  implementation. A server adapter supplies a verified Auth user ID and a
  `StorageAdapter`.

The package root deliberately exports only client-safe contracts. Server
capabilities are an explicit subpath, which makes the intended boundary
reviewable in app imports and build output.

`createWorkspaceApiHandler` is the shared Web Request/Response adapter used by
the Next.js and TanStack Start apps. Framework routes inject server-verified
identity, origin protection, storage, and optional invitation delivery; the
handler owns route validation, authorization calls, status mapping, and
no-store responses.

## Storage and tenancy

Workspace data uses the existing `@puzzle-ui/storage` contract. The MongoDB
adapter is configured by each server application and can share its connection
pool with Puzzle Auth. Auth-managed collections retain their existing `auth_*`
names; Workspace collections are separate:

- `workspaces`
- `workspaceMembers`
- `invitations`
- `projects`
- `projectMembers`
- `tasks`
- `activities`
- `notificationPreferences`

`initializeWorkspaceStorage` registers schemas and indexes and requires storage
support for unique constraints and atomic batches. Services receive an
authenticated user ID and verify an active workspace membership server-side
before returning tenant data. A caller-supplied workspace ID is only a lookup
key, never proof of access.

Workspace creation uses one atomic batch for the workspace record, its owner
membership, and the initial activity event. Activities are created by server
services, not accepted as client-authored audit records.

## Domain and validation

`models.ts` defines the persisted records and role/status unions.
`validation.ts` defines the shared Zod schemas for those records and
create/update input contracts. Use the same schemas in framework request
boundaries and server services; services validate again before persistence.

Workspace IDs, user IDs, invitation token hashes, and activity actor IDs are
opaque strings. Dates are represented as `Date` values in storage contracts.
Invitation roles cannot be `owner`.

## Service use

At server startup, initialize the adapter once:

```ts
import { initializeWorkspaceStorage } from "@puzzle-ui/workspace/server";

await initializeWorkspaceStorage(storage);
```

Create a workspace only after the framework adapter has verified the current
session:

```ts
import { createWorkspace } from "@puzzle-ui/workspace/server";

const workspace = await createWorkspace(
  { storage, userId: session.user.id },
  { name: "Product Team", slug: "product-team" },
);
```

Project and task services enforce active workspace membership, scope every
lookup to the workspace, validate related projects and assignees, and save
activity records in the same atomic batch as each mutation:

```ts
import {
  createProject,
  createTask,
  listTasks,
} from "@puzzle-ui/workspace/server";

const project = await createProject(
  { storage, userId: session.user.id },
  workspaceId,
  { name: "Launch" },
);
const tasks = await listTasks(
  { storage, userId: session.user.id },
  workspaceId,
  { projectId: project.id },
);
```

Notification preferences are stored per workspace member. Unset preferences
remain `null` until changed; updates use optimistic revisions and add a
`settings.updated` activity in the same batch.
The activity feed is cursor-paginated and requires active membership before
querying by workspace.

Invitation creation returns a one-time raw token only from the server service;
send it through a trusted email delivery path and never include it in a browser
response. Acceptance requires the invitee's verified Auth email to match the
invitation, then atomically consumes the invitation and adds the member.
Owners and admins manage invitations; only owners can grant or revoke admin
roles. Members can leave a workspace, but its owner cannot be removed or leave
without an explicit ownership-transfer flow.

Never pass database handles, session cookies, or Auth secrets to client
components. Framework handlers should translate `WorkspaceAccessError` and
`WorkspaceValidationError` into their framework's response conventions without
exposing storage internals.

The sample apps use the Resend HTTP API for Auth lifecycle messages and
workspace invitation delivery when `RESEND_API_KEY` and
`WORKSPACE_EMAIL_FROM` are configured. Invitation delivery is disabled before
token creation if either setting is absent, and the shared API redacts token
hashes from invitation responses.
