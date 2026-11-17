# Workspace applications

The Workspace domain package is shared by two parity-focused applications:

- `apps/workspace-next` uses Next.js.
- `apps/workspace-tanstack` uses TanStack Start.

Both apps use Puzzle Auth and Session with MongoDB storage. Workspace API
requests derive the user identity from the server-verified Auth session and
reject state-changing requests whose origin is not the configured app origin.

## Local development

Install dependencies and start the app you want to run:

```sh
bun install
cd apps/workspace-next
bun run dev
```

For TanStack Start, run `bun run dev` from `apps/workspace-tanstack`. Each
development command starts its local MongoDB service, runs `db:setup`, resets
the app's workspace collections, and seeds the demo data before starting the
server. The reset only accepts the local `workspace_next` or
`workspace_tanstack` database; it never clears auth users or sessions and
refuses production or remote MongoDB URIs. Both apps use port 3000, so run one
at a time unless you change the app origin and development port together.

Sign in with `demo@puzzle-ui.com` and `demouser1234`. The other seeded users are
workspace members for demonstration and do not have sign-in credentials.
If the demo account requests an authenticator code, enter `123456`. This fixed
code is accepted only for the seeded demo account.

Signup creates a device-only account. The email, display name, and a salted
password verifier are stored in that browser's local storage; the password is
never sent to the server. The server keeps the authenticated session in memory
only, and no user or credential record is written to MongoDB. The browser can
recreate its session while its local account remains, but the account cannot be
used on another device or recovered after clearing this site's storage.

Workspace, project, task, membership, invitation, notification, and profile
changes are saved in browser local storage and merged with the seeded database
data when the dashboard loads. The demo seed uses stable workspace, project,
and task IDs so those local changes survive a development restart. Clear this
site's browser storage to discard local changes and device-only accounts.
Password changes are disabled by both workspace apps' interface and auth API.

The Auth scaffold creates a local `.env` with database and cryptographic
settings. Do not commit that file. Copy the optional email settings from the
app's `.env.example` into `.env` to enable email verification, password reset,
and workspace invitation delivery. The sender must be verified by the Resend
account associated with `RESEND_API_KEY`. Without both settings, invitation
creation is disabled before a token is generated; other email flows return an
explicit delivery error.

## Shared application behavior

The browser UI is implemented in the private `@puzzle-ui/workspace-ui` package
and uses Puzzle Pieces dashboard, project, activity, and settings compositions.
Framework routes provide protected dashboard rendering and delegate workspace
requests to `createWorkspaceApiHandler` from `@puzzle-ui/workspace/server`.
That handler keeps workspace authorization, input validation, invitation-token
redaction, and response semantics consistent across both frameworks.

Email verification and password-reset links are generated from the trusted
`APP_ORIGIN`, not the incoming request's Host header. Invitation tokens are
delivered server-to-server and are never included in the API response.

For production containers and deployment, see the
[Workspace deployment guide](./deployment.md).
