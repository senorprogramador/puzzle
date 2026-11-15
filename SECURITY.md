# Security Policy

## Supported versions

Puzzle packages are currently in the 0.x release series. A formal supported
version and maintenance policy has not been established. When reporting an
issue, identify the affected package and version; the maintainer will assess
the report against the current code and published packages.

## Reporting a vulnerability

Do not disclose exploitable vulnerabilities in public issues, discussions, or
pull requests.

Use [GitHub's private vulnerability reporting page](https://github.com/senorprogramador/puzzle/security/advisories/new)
if private reporting is available for this repository. Its availability could
not be verified from the public repository settings. If the reporting form is
unavailable, use a private contact method listed on the
[maintainer's GitHub profile](https://github.com/senorprogramador), if one is
available. No dedicated security email address is published in this
repository. Do not include vulnerability details in a public request for
contact information.

Please include, when known:

- The affected Puzzle package and version.
- The affected runtime, framework, and relevant configuration.
- A description of the vulnerability and its potential impact.
- Reproduction steps or a proof of concept that does not expose real user data
  or credentials.
- A suggested mitigation, if available.

Do not send real user credentials, production secrets, or personal data.

## Disclosure process

Please give the maintainer an opportunity to investigate, coordinate a fix,
and prepare any necessary release before public disclosure. Keep details
private while the issue is unresolved and coordinate a disclosure date with
the maintainer. The project has not established response-time or remediation
SLAs.

## Security scope

Puzzle is a collection of packages, not a complete security boundary.
Security-sensitive areas include authentication and session management in
`@puzzle-ui/auth`, `@puzzle-ui/session`, and `@puzzle-ui/fullstack`; MFA and
passkey flows; and the `@puzzle-ui/storage`, `@puzzle-ui/storage-d1`, and
`@puzzle-ui/storage-mongodb` adapters.

The presence of security-related features does not guarantee that an
application is secure. Application owners remain responsible for selecting
and configuring providers, storage, deployment settings, and other controls
for their own threat model.
