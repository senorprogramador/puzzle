import{t as e}from"./jsx-runtime-LKYXHABd.js";var t=e(),n={title:`Puzzle Production Release`,description:`Release prerequisites, validation, publishing, and rollback procedures for Puzzle packages.`},r={contents:[{heading:void 0,content:`This document describes the release requirements for Puzzle packages.`},{heading:`1-release-prerequisites`,content:`Before preparing a release:`},{heading:`1-release-prerequisites`,content:`All required EPICs must be complete.`},{heading:`1-release-prerequisites`,content:`The working tree must be clean.`},{heading:`1-release-prerequisites`,content:`All packages must use the same version.`},{heading:`1-release-prerequisites`,content:`All workspace dependencies must resolve.`},{heading:`1-release-prerequisites`,content:`No production secrets may be committed.`},{heading:`1-release-prerequisites`,content:`The latest CI workflow must pass.`},{heading:`1-release-prerequisites`,content:`The release must have an assigned semantic version.`},{heading:`1-release-prerequisites`,content:`Required development tooling:`},{heading:`1-release-prerequisites`,content:`Bun 1.4.4.`},{heading:`1-release-prerequisites`,content:`Node.js 22 or 24 for the validated CI matrix.`},{heading:`1-release-prerequisites`,content:`npm CLI.`},{heading:`1-release-prerequisites`,content:`Docker with Docker Compose.`},{heading:`1-release-prerequisites`,content:`Chromium through Playwright.`},{heading:`2-required-ci-checks`,content:`The GitHub Actions workflow must pass on both Node versions:`},{heading:`2-required-ci-checks`,content:`CI (Node 22)`},{heading:`2-required-ci-checks`,content:`CI (Node 24)`},{heading:`2-required-ci-checks`,content:`Enable branch protection on main and require both checks before merging.`},{heading:`2-required-ci-checks`,content:`The repository should require:`},{heading:`2-required-ci-checks`,content:`Pull requests for changes to main.`},{heading:`2-required-ci-checks`,content:`Successful required status checks.`},{heading:`2-required-ci-checks`,content:`At least one review for security-sensitive changes.`},{heading:`2-required-ci-checks`,content:`No force pushes to main.`},{heading:`2-required-ci-checks`,content:`No deletion of main.`},{heading:`2-required-ci-checks`,content:`The CI workflow uses read-only repository permissions.`},{heading:`3-local-validation`,content:`Install dependencies:`},{heading:`3-local-validation`,content:`Build every package:`},{heading:`3-local-validation`,content:`Typecheck the complete workspace:`},{heading:`3-local-validation`,content:`Run the complete test suite:`},{heading:`3-local-validation`,content:`Build the documentation site:`},{heading:`3-local-validation`,content:`The complete test command includes:`},{heading:`3-local-validation`,content:`Core tests.`},{heading:`3-local-validation`,content:`Theme tests.`},{heading:`3-local-validation`,content:`Icons tests.`},{heading:`3-local-validation`,content:`UI unit tests.`},{heading:`3-local-validation`,content:`UI component tests.`},{heading:`3-local-validation`,content:`UI browser tests.`},{heading:`3-local-validation`,content:`Pieces unit tests.`},{heading:`3-local-validation`,content:`Pieces component tests.`},{heading:`3-local-validation`,content:`Pieces browser tests.`},{heading:`3-local-validation`,content:`Create CLI tests.`},{heading:`3-local-validation`,content:`Storage tests.`},{heading:`3-local-validation`,content:`D1 conformance tests.`},{heading:`3-local-validation`,content:`MongoDB conformance tests.`},{heading:`3-local-validation`,content:`Session tests.`},{heading:`3-local-validation`,content:`Auth tests.`},{heading:`3-local-validation`,content:`Fullstack integration tests.`},{heading:`3-local-validation`,content:`Fullstack browser tests.`},{heading:`3-local-validation`,content:`The MongoDB tests require Docker and a working replica set.`},{heading:`3-local-validation`,content:`The D1 tests use Miniflare.`},{heading:`application`,content:`Configure the production application to:`},{heading:`application`,content:`Serve authentication routes over HTTPS.`},{heading:`application`,content:`Use an exact allowed-origin list.`},{heading:`application`,content:`Use secure HttpOnly session cookies.`},{heading:`application`,content:`Keep session tokens out of browser storage.`},{heading:`application`,content:`Use a restrictive SameSite policy.`},{heading:`application`,content:`Configure WebAuthn RP ID and expected origin.`},{heading:`application`,content:`Disable development-only authentication providers.`},{heading:`storage`,content:`Use durable storage.`},{heading:`storage`,content:`For MongoDB:`},{heading:`storage`,content:`Use a replica set.`},{heading:`storage`,content:`Enable the transaction capabilities required by the adapter.`},{heading:`storage`,content:`Configure authentication and TLS.`},{heading:`storage`,content:`Configure backups.`},{heading:`storage`,content:`Monitor connection failures and transaction errors.`},{heading:`storage`,content:`For Cloudflare D1:`},{heading:`storage`,content:`Use a production D1 database.`},{heading:`storage`,content:`Apply database migrations before enabling new application code.`},{heading:`storage`,content:`Verify unique constraints and conditional-write behavior.`},{heading:`storage`,content:`Keep local Miniflare state out of production artifacts.`},{heading:`storage`,content:`Do not use in-memory storage for production sessions or authentication.`},{heading:`secrets`,content:`Configure the following values using the deployment platform's secret manager:`},{heading:`secrets`,content:`Rate-limit HMAC secret.`},{heading:`secrets`,content:`TOTP encryption keys.`},{heading:`secrets`,content:`Database credentials.`},{heading:`secrets`,content:`Email provider credentials.`},{heading:`secrets`,content:`Application-specific secrets.`},{heading:`secrets`,content:`Use separate secrets for development, staging and production.`},{heading:`secrets`,content:`Do not reuse test encryption keys in production.`},{heading:`secrets`,content:`Keep previous TOTP encryption keys available during a controlled key-rotation
period when existing encrypted records still depend on them.`},{heading:`5-authentication-security-acceptance`,content:`Before enabling production authentication, verify:`},{heading:`5-authentication-security-acceptance`,content:`Registration and sign-in work.`},{heading:`5-authentication-security-acceptance`,content:`Password reset does not disclose account existence.`},{heading:`5-authentication-security-acceptance`,content:`Email verification tokens are single-use.`},{heading:`5-authentication-security-acceptance`,content:`Password changes invalidate existing sessions.`},{heading:`5-authentication-security-acceptance`,content:`Session rotation invalidates the previous session.`},{heading:`5-authentication-security-acceptance`,content:`CSRF rejects untrusted origins.`},{heading:`5-authentication-security-acceptance`,content:`Rate limiting works across application instances.`},{heading:`5-authentication-security-acceptance`,content:`MFA challenges expire correctly.`},{heading:`5-authentication-security-acceptance`,content:`Recovery codes cannot be reused.`},{heading:`5-authentication-security-acceptance`,content:`TOTP replay is rejected.`},{heading:`5-authentication-security-acceptance`,content:`WebAuthn challenge validation works.`},{heading:`5-authentication-security-acceptance`,content:`WebAuthn origin validation works.`},{heading:`5-authentication-security-acceptance`,content:`WebAuthn RP ID validation works.`},{heading:`5-authentication-security-acceptance`,content:`Required MFA enrollment does not create a normal session before
successful enrollment.`},{heading:`5-authentication-security-acceptance`,content:`Only authenticated states authorize protected operations.`},{heading:`6-release-preparation`,content:`The release script publishes all packages in dependency order.`},{heading:`6-release-preparation`,content:`The release order is:`},{heading:`6-release-preparation`,content:`core`},{heading:`6-release-preparation`,content:`theme`},{heading:`6-release-preparation`,content:`hooks`},{heading:`6-release-preparation`,content:`icons`},{heading:`6-release-preparation`,content:`ui`},{heading:`6-release-preparation`,content:`pieces`},{heading:`6-release-preparation`,content:`create`},{heading:`6-release-preparation`,content:`storage`},{heading:`6-release-preparation`,content:`session`},{heading:`6-release-preparation`,content:`storage-d1`},{heading:`6-release-preparation`,content:`storage-mongodb`},{heading:`6-release-preparation`,content:`auth`},{heading:`6-release-preparation`,content:`fullstack`},{heading:`6-release-preparation`,content:`The script checks package coverage, version consistency, typechecks, tests,
builds and npm package contents.`},{heading:`6-release-preparation`,content:`Perform a dry run first:`},{heading:`6-release-preparation`,content:`Inspect the output and confirm that every package is included.`},{heading:`6-release-preparation`,content:`A dry run must not publish packages, create commits or create Git tags.`},{heading:`7-publishing`,content:`Before a real release:`},{heading:`7-publishing`,content:`Confirm the npm account is authenticated.`},{heading:`7-publishing`,content:`Confirm that the package scope is available.`},{heading:`7-publishing`,content:`Confirm the intended release type.`},{heading:`7-publishing`,content:`Confirm the CI checks are green.`},{heading:`7-publishing`,content:`Confirm the working tree is clean.`},{heading:`7-publishing`,content:`Start the release:`},{heading:`7-publishing`,content:`Select one of:`},{heading:`7-publishing`,content:`patch`},{heading:`7-publishing`,content:`minor`},{heading:`7-publishing`,content:`major`},{heading:`7-publishing`,content:`The release procedure publishes packages in dependency order.`},{heading:`7-publishing`,content:`It then commits and tags the release and pushes the commit and tag.`},{heading:`7-publishing`,content:`Do not interrupt a release after one or more packages have been published.`},{heading:`7-publishing`,content:`If publishing fails partway through, inspect the npm registry before retrying.
Already published versions cannot be overwritten.`},{heading:`8-post-release-verification`,content:`Verify each package on npm:`},{heading:`8-post-release-verification`,content:`@puzzle-ui/core`},{heading:`8-post-release-verification`,content:`@puzzle-ui/theme`},{heading:`8-post-release-verification`,content:`@puzzle-ui/hooks`},{heading:`8-post-release-verification`,content:`@puzzle-ui/icons`},{heading:`8-post-release-verification`,content:`@puzzle-ui/ui`},{heading:`8-post-release-verification`,content:`@puzzle-ui/pieces`},{heading:`8-post-release-verification`,content:`@puzzle-ui/create`},{heading:`8-post-release-verification`,content:`@puzzle-ui/storage`},{heading:`8-post-release-verification`,content:`@puzzle-ui/session`},{heading:`8-post-release-verification`,content:`@puzzle-ui/storage-d1`},{heading:`8-post-release-verification`,content:`@puzzle-ui/storage-mongodb`},{heading:`8-post-release-verification`,content:`@puzzle-ui/auth`},{heading:`8-post-release-verification`,content:`@puzzle-ui/fullstack`},{heading:`8-post-release-verification`,content:`Verify:`},{heading:`8-post-release-verification`,content:`Package versions match the release tag.`},{heading:`8-post-release-verification`,content:`Package exports resolve.`},{heading:`8-post-release-verification`,content:`Type declarations are present.`},{heading:`8-post-release-verification`,content:`ESM entry points resolve.`},{heading:`8-post-release-verification`,content:`CommonJS entry points resolve where provided.`},{heading:`8-post-release-verification`,content:`CSS files are included where required.`},{heading:`8-post-release-verification`,content:`Peer dependencies are documented.`},{heading:`8-post-release-verification`,content:`Package installation works in a clean consumer project.`},{heading:`8-post-release-verification`,content:`Run a production smoke test using the published packages.`},{heading:`9-rollback`,content:`Published npm versions must never be overwritten.`},{heading:`9-rollback`,content:`If a release contains a critical issue:`},{heading:`9-rollback`,content:`Stop further deployments.`},{heading:`9-rollback`,content:`Identify the affected packages.`},{heading:`9-rollback`,content:`Revert the application deployment where possible.`},{heading:`9-rollback`,content:`Publish a corrected patch release.`},{heading:`9-rollback`,content:`Verify dependency compatibility.`},{heading:`9-rollback`,content:`Invalidate affected sessions when security requires it.`},{heading:`9-rollback`,content:`Review audit events and security logs.`},{heading:`9-rollback`,content:`Communicate the issue and remediation.`},{heading:`9-rollback`,content:`For compromised credentials or encryption keys, follow the application's
incident response procedure.`},{heading:`10-runtime-validation-limitations`,content:`Passing Node.js and Miniflare tests does not replace deployment smoke tests.`},{heading:`10-runtime-validation-limitations`,content:`Before declaring a production deployment ready, test the actual deployment
environment.`},{heading:`10-runtime-validation-limitations`,content:`This includes:`},{heading:`10-runtime-validation-limitations`,content:`A real Node.js deployment.`},{heading:`10-runtime-validation-limitations`,content:`A real Cloudflare Workers deployment when D1 is used.`},{heading:`10-runtime-validation-limitations`,content:`The configured production database.`},{heading:`10-runtime-validation-limitations`,content:`Production cookie behavior behind the actual reverse proxy.`},{heading:`10-runtime-validation-limitations`,content:`WebAuthn using the actual production domain.`},{heading:`10-runtime-validation-limitations`,content:`Email delivery and recovery flows.`},{heading:`10-runtime-validation-limitations`,content:`Record the tested runtime versions and deployment configuration alongside
the release.`}],headings:[{id:`1-release-prerequisites`,content:`1. Release prerequisites`},{id:`2-required-ci-checks`,content:`2. Required CI checks`},{id:`3-local-validation`,content:`3. Local validation`},{id:`4-production-configuration`,content:`4. Production configuration`},{id:`application`,content:`Application`},{id:`storage`,content:`Storage`},{id:`secrets`,content:`Secrets`},{id:`5-authentication-security-acceptance`,content:`5. Authentication security acceptance`},{id:`6-release-preparation`,content:`6. Release preparation`},{id:`7-publishing`,content:`7. Publishing`},{id:`8-post-release-verification`,content:`8. Post-release verification`},{id:`9-rollback`,content:`9. Rollback`},{id:`10-runtime-validation-limitations`,content:`10. Runtime validation limitations`}]},i=[{depth:2,url:`#1-release-prerequisites`,title:(0,t.jsx)(t.Fragment,{children:`1. Release prerequisites`})},{depth:2,url:`#2-required-ci-checks`,title:(0,t.jsx)(t.Fragment,{children:`2. Required CI checks`})},{depth:2,url:`#3-local-validation`,title:(0,t.jsx)(t.Fragment,{children:`3. Local validation`})},{depth:2,url:`#4-production-configuration`,title:(0,t.jsx)(t.Fragment,{children:`4. Production configuration`})},{depth:3,url:`#application`,title:(0,t.jsx)(t.Fragment,{children:`Application`})},{depth:3,url:`#storage`,title:(0,t.jsx)(t.Fragment,{children:`Storage`})},{depth:3,url:`#secrets`,title:(0,t.jsx)(t.Fragment,{children:`Secrets`})},{depth:2,url:`#5-authentication-security-acceptance`,title:(0,t.jsx)(t.Fragment,{children:`5. Authentication security acceptance`})},{depth:2,url:`#6-release-preparation`,title:(0,t.jsx)(t.Fragment,{children:`6. Release preparation`})},{depth:2,url:`#7-publishing`,title:(0,t.jsx)(t.Fragment,{children:`7. Publishing`})},{depth:2,url:`#8-post-release-verification`,title:(0,t.jsx)(t.Fragment,{children:`8. Post-release verification`})},{depth:2,url:`#9-rollback`,title:(0,t.jsx)(t.Fragment,{children:`9. Rollback`})},{depth:2,url:`#10-runtime-validation-limitations`,title:(0,t.jsx)(t.Fragment,{children:`10. Runtime validation limitations`})}];function a(e){let n={code:`code`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,span:`span`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:`This document describes the release requirements for Puzzle packages.`}),`
`,(0,t.jsx)(n.h2,{id:`1-release-prerequisites`,children:`1. Release prerequisites`}),`
`,(0,t.jsx)(n.p,{children:`Before preparing a release:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`All required EPICs must be complete.`}),`
`,(0,t.jsx)(n.li,{children:`The working tree must be clean.`}),`
`,(0,t.jsx)(n.li,{children:`All packages must use the same version.`}),`
`,(0,t.jsx)(n.li,{children:`All workspace dependencies must resolve.`}),`
`,(0,t.jsx)(n.li,{children:`No production secrets may be committed.`}),`
`,(0,t.jsx)(n.li,{children:`The latest CI workflow must pass.`}),`
`,(0,t.jsx)(n.li,{children:`The release must have an assigned semantic version.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Required development tooling:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Bun 1.4.4.`}),`
`,(0,t.jsx)(n.li,{children:`Node.js 22 or 24 for the validated CI matrix.`}),`
`,(0,t.jsx)(n.li,{children:`npm CLI.`}),`
`,(0,t.jsx)(n.li,{children:`Docker with Docker Compose.`}),`
`,(0,t.jsx)(n.li,{children:`Chromium through Playwright.`}),`
`]}),`
`,(0,t.jsx)(n.h2,{id:`2-required-ci-checks`,children:`2. Required CI checks`}),`
`,(0,t.jsx)(n.p,{children:`The GitHub Actions workflow must pass on both Node versions:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`CI (Node 22)`}),`
`,(0,t.jsx)(n.li,{children:`CI (Node 24)`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Enable branch protection on main and require both checks before merging.`}),`
`,(0,t.jsx)(n.p,{children:`The repository should require:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Pull requests for changes to main.`}),`
`,(0,t.jsx)(n.li,{children:`Successful required status checks.`}),`
`,(0,t.jsx)(n.li,{children:`At least one review for security-sensitive changes.`}),`
`,(0,t.jsx)(n.li,{children:`No force pushes to main.`}),`
`,(0,t.jsx)(n.li,{children:`No deletion of main.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`The CI workflow uses read-only repository permissions.`}),`
`,(0,t.jsx)(n.h2,{id:`3-local-validation`,children:`3. Local validation`}),`
`,(0,t.jsx)(n.p,{children:`Install dependencies:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun install --frozen-lockfile`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Build every package:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run build`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Typecheck the complete workspace:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run typecheck`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Run the complete test suite:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run vitest`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Build the documentation site:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run --filter '@puzzle-ui/site' build`})})})})}),`
`,(0,t.jsx)(n.p,{children:`The complete test command includes:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Core tests.`}),`
`,(0,t.jsx)(n.li,{children:`Theme tests.`}),`
`,(0,t.jsx)(n.li,{children:`Icons tests.`}),`
`,(0,t.jsx)(n.li,{children:`UI unit tests.`}),`
`,(0,t.jsx)(n.li,{children:`UI component tests.`}),`
`,(0,t.jsx)(n.li,{children:`UI browser tests.`}),`
`,(0,t.jsx)(n.li,{children:`Pieces unit tests.`}),`
`,(0,t.jsx)(n.li,{children:`Pieces component tests.`}),`
`,(0,t.jsx)(n.li,{children:`Pieces browser tests.`}),`
`,(0,t.jsx)(n.li,{children:`Create CLI tests.`}),`
`,(0,t.jsx)(n.li,{children:`Storage tests.`}),`
`,(0,t.jsx)(n.li,{children:`D1 conformance tests.`}),`
`,(0,t.jsx)(n.li,{children:`MongoDB conformance tests.`}),`
`,(0,t.jsx)(n.li,{children:`Session tests.`}),`
`,(0,t.jsx)(n.li,{children:`Auth tests.`}),`
`,(0,t.jsx)(n.li,{children:`Fullstack integration tests.`}),`
`,(0,t.jsx)(n.li,{children:`Fullstack browser tests.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`The MongoDB tests require Docker and a working replica set.`}),`
`,(0,t.jsx)(n.p,{children:`The D1 tests use Miniflare.`}),`
`,(0,t.jsx)(n.h2,{id:`4-production-configuration`,children:`4. Production configuration`}),`
`,(0,t.jsx)(n.h3,{id:`application`,children:`Application`}),`
`,(0,t.jsx)(n.p,{children:`Configure the production application to:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Serve authentication routes over HTTPS.`}),`
`,(0,t.jsx)(n.li,{children:`Use an exact allowed-origin list.`}),`
`,(0,t.jsx)(n.li,{children:`Use secure HttpOnly session cookies.`}),`
`,(0,t.jsx)(n.li,{children:`Keep session tokens out of browser storage.`}),`
`,(0,t.jsx)(n.li,{children:`Use a restrictive SameSite policy.`}),`
`,(0,t.jsx)(n.li,{children:`Configure WebAuthn RP ID and expected origin.`}),`
`,(0,t.jsx)(n.li,{children:`Disable development-only authentication providers.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`storage`,children:`Storage`}),`
`,(0,t.jsx)(n.p,{children:`Use durable storage.`}),`
`,(0,t.jsx)(n.p,{children:`For MongoDB:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Use a replica set.`}),`
`,(0,t.jsx)(n.li,{children:`Enable the transaction capabilities required by the adapter.`}),`
`,(0,t.jsx)(n.li,{children:`Configure authentication and TLS.`}),`
`,(0,t.jsx)(n.li,{children:`Configure backups.`}),`
`,(0,t.jsx)(n.li,{children:`Monitor connection failures and transaction errors.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`For Cloudflare D1:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Use a production D1 database.`}),`
`,(0,t.jsx)(n.li,{children:`Apply database migrations before enabling new application code.`}),`
`,(0,t.jsx)(n.li,{children:`Verify unique constraints and conditional-write behavior.`}),`
`,(0,t.jsx)(n.li,{children:`Keep local Miniflare state out of production artifacts.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Do not use in-memory storage for production sessions or authentication.`}),`
`,(0,t.jsx)(n.h3,{id:`secrets`,children:`Secrets`}),`
`,(0,t.jsx)(n.p,{children:`Configure the following values using the deployment platform's secret manager:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Rate-limit HMAC secret.`}),`
`,(0,t.jsx)(n.li,{children:`TOTP encryption keys.`}),`
`,(0,t.jsx)(n.li,{children:`Database credentials.`}),`
`,(0,t.jsx)(n.li,{children:`Email provider credentials.`}),`
`,(0,t.jsx)(n.li,{children:`Application-specific secrets.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Use separate secrets for development, staging and production.`}),`
`,(0,t.jsx)(n.p,{children:`Do not reuse test encryption keys in production.`}),`
`,(0,t.jsx)(n.p,{children:`Keep previous TOTP encryption keys available during a controlled key-rotation
period when existing encrypted records still depend on them.`}),`
`,(0,t.jsx)(n.h2,{id:`5-authentication-security-acceptance`,children:`5. Authentication security acceptance`}),`
`,(0,t.jsx)(n.p,{children:`Before enabling production authentication, verify:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Registration and sign-in work.`}),`
`,(0,t.jsx)(n.li,{children:`Password reset does not disclose account existence.`}),`
`,(0,t.jsx)(n.li,{children:`Email verification tokens are single-use.`}),`
`,(0,t.jsx)(n.li,{children:`Password changes invalidate existing sessions.`}),`
`,(0,t.jsx)(n.li,{children:`Session rotation invalidates the previous session.`}),`
`,(0,t.jsx)(n.li,{children:`CSRF rejects untrusted origins.`}),`
`,(0,t.jsx)(n.li,{children:`Rate limiting works across application instances.`}),`
`,(0,t.jsx)(n.li,{children:`MFA challenges expire correctly.`}),`
`,(0,t.jsx)(n.li,{children:`Recovery codes cannot be reused.`}),`
`,(0,t.jsx)(n.li,{children:`TOTP replay is rejected.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn challenge validation works.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn origin validation works.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn RP ID validation works.`}),`
`,(0,t.jsx)(n.li,{children:`Required MFA enrollment does not create a normal session before
successful enrollment.`}),`
`,(0,t.jsx)(n.li,{children:`Only authenticated states authorize protected operations.`}),`
`]}),`
`,(0,t.jsx)(n.h2,{id:`6-release-preparation`,children:`6. Release preparation`}),`
`,(0,t.jsx)(n.p,{children:`The release script publishes all packages in dependency order.`}),`
`,(0,t.jsx)(n.p,{children:`The release order is:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsx)(n.li,{children:`core`}),`
`,(0,t.jsx)(n.li,{children:`theme`}),`
`,(0,t.jsx)(n.li,{children:`hooks`}),`
`,(0,t.jsx)(n.li,{children:`icons`}),`
`,(0,t.jsx)(n.li,{children:`ui`}),`
`,(0,t.jsx)(n.li,{children:`pieces`}),`
`,(0,t.jsx)(n.li,{children:`create`}),`
`,(0,t.jsx)(n.li,{children:`storage`}),`
`,(0,t.jsx)(n.li,{children:`session`}),`
`,(0,t.jsx)(n.li,{children:`storage-d1`}),`
`,(0,t.jsx)(n.li,{children:`storage-mongodb`}),`
`,(0,t.jsx)(n.li,{children:`auth`}),`
`,(0,t.jsx)(n.li,{children:`fullstack`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`The script checks package coverage, version consistency, typechecks, tests,
builds and npm package contents.`}),`
`,(0,t.jsx)(n.p,{children:`Perform a dry run first:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run release:dry-run`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Inspect the output and confirm that every package is included.`}),`
`,(0,t.jsx)(n.p,{children:`A dry run must not publish packages, create commits or create Git tags.`}),`
`,(0,t.jsx)(n.h2,{id:`7-publishing`,children:`7. Publishing`}),`
`,(0,t.jsx)(n.p,{children:`Before a real release:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Confirm the npm account is authenticated.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm that the package scope is available.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm the intended release type.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm the CI checks are green.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm the working tree is clean.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Start the release:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run release`})})})})}),`
`,(0,t.jsx)(n.p,{children:`Select one of:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`patch`}),`
`,(0,t.jsx)(n.li,{children:`minor`}),`
`,(0,t.jsx)(n.li,{children:`major`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`The release procedure publishes packages in dependency order.`}),`
`,(0,t.jsx)(n.p,{children:`It then commits and tags the release and pushes the commit and tag.`}),`
`,(0,t.jsx)(n.p,{children:`Do not interrupt a release after one or more packages have been published.`}),`
`,(0,t.jsx)(n.p,{children:`If publishing fails partway through, inspect the npm registry before retrying.
Already published versions cannot be overwritten.`}),`
`,(0,t.jsx)(n.h2,{id:`8-post-release-verification`,children:`8. Post-release verification`}),`
`,(0,t.jsx)(n.p,{children:`Verify each package on npm:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/core`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/theme`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/hooks`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/icons`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/ui`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/pieces`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/create`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/storage`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/session`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/storage-d1`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/storage-mongodb`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/auth`}),`
`,(0,t.jsx)(n.li,{children:`@puzzle-ui/fullstack`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Verify:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Package versions match the release tag.`}),`
`,(0,t.jsx)(n.li,{children:`Package exports resolve.`}),`
`,(0,t.jsx)(n.li,{children:`Type declarations are present.`}),`
`,(0,t.jsx)(n.li,{children:`ESM entry points resolve.`}),`
`,(0,t.jsx)(n.li,{children:`CommonJS entry points resolve where provided.`}),`
`,(0,t.jsx)(n.li,{children:`CSS files are included where required.`}),`
`,(0,t.jsx)(n.li,{children:`Peer dependencies are documented.`}),`
`,(0,t.jsx)(n.li,{children:`Package installation works in a clean consumer project.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Run a production smoke test using the published packages.`}),`
`,(0,t.jsx)(n.h2,{id:`9-rollback`,children:`9. Rollback`}),`
`,(0,t.jsx)(n.p,{children:`Published npm versions must never be overwritten.`}),`
`,(0,t.jsx)(n.p,{children:`If a release contains a critical issue:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsx)(n.li,{children:`Stop further deployments.`}),`
`,(0,t.jsx)(n.li,{children:`Identify the affected packages.`}),`
`,(0,t.jsx)(n.li,{children:`Revert the application deployment where possible.`}),`
`,(0,t.jsx)(n.li,{children:`Publish a corrected patch release.`}),`
`,(0,t.jsx)(n.li,{children:`Verify dependency compatibility.`}),`
`,(0,t.jsx)(n.li,{children:`Invalidate affected sessions when security requires it.`}),`
`,(0,t.jsx)(n.li,{children:`Review audit events and security logs.`}),`
`,(0,t.jsx)(n.li,{children:`Communicate the issue and remediation.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`For compromised credentials or encryption keys, follow the application's
incident response procedure.`}),`
`,(0,t.jsx)(n.h2,{id:`10-runtime-validation-limitations`,children:`10. Runtime validation limitations`}),`
`,(0,t.jsx)(n.p,{children:`Passing Node.js and Miniflare tests does not replace deployment smoke tests.`}),`
`,(0,t.jsx)(n.p,{children:`Before declaring a production deployment ready, test the actual deployment
environment.`}),`
`,(0,t.jsx)(n.p,{children:`This includes:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`A real Node.js deployment.`}),`
`,(0,t.jsx)(n.li,{children:`A real Cloudflare Workers deployment when D1 is used.`}),`
`,(0,t.jsx)(n.li,{children:`The configured production database.`}),`
`,(0,t.jsx)(n.li,{children:`Production cookie behavior behind the actual reverse proxy.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn using the actual production domain.`}),`
`,(0,t.jsx)(n.li,{children:`Email delivery and recovery flows.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Record the tested runtime versions and deployment configuration alongside
the release.`})]})}function o(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}export{o as default,n as frontmatter,r as structuredData,i as toc};