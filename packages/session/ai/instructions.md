# @puzzle-ui/session

Use Session for database-neutral server session lifecycle, validation, token
rotation and revocation, session data, cookie serialization, and CSRF/origin
helpers. It does not provide framework request adapters or authentication
policy.

Install with `npm install @puzzle-ui/session`. Its public API is the package
root. Use the installed types and the Storage contract to configure a manager
and its required capabilities.

Keep opaque session tokens out of persisted records; store token hashes.
Validate expiry on requests, use secure HttpOnly cookies, validate origins and
state-changing requests, and fail closed when required storage capabilities
are unavailable.

Do not add React, framework, or database-driver imports, or replace capability
checks with assumptions about a particular adapter. See the
[Auth and Session documentation](https://puzzle-ui.com/docs/auth).
