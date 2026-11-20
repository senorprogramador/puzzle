# @puzzle-ui/auth

Use Auth for framework-independent server authentication services and
authentication lifecycle workflows. It is not a router, browser auth store, or
ready-made authentication page.

Install with `npm install @puzzle-ui/auth`. Its public API is exported from the
package root (`@puzzle-ui/auth`); inspect the installed types and package
documentation before selecting a manager, provider, or option.

Auth composes the Storage and Session contracts with injected providers. Supply
appropriate password hashing, durable rate limiting, email, and WebAuthn
implementations for the application. Keep authorization checks on the server.

Use typed Auth errors and avoid exposing tokens, password material, TOTP
secrets, recovery codes, or provider details in browser responses or logs.
Follow the Session package's cookie and CSRF contracts.

Do not import private source paths, add framework routes here, assume a
database driver is bundled, or treat browser auth state as an authorization
boundary. See the [Auth documentation](https://puzzle-ui.com/docs/auth).
