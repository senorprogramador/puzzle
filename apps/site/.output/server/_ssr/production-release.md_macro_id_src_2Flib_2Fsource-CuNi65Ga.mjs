import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/production-release.md_macro_id_src_2Flib_2Fsource-CuNi65Ga.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Puzzle Production Release",
	"description": "Release prerequisites, validation, publishing, and rollback procedures for Puzzle packages."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This document describes the release requirements for Puzzle packages."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Before preparing a release:"
		},
		{
			"heading": "1-release-prerequisites",
			"content": "All required EPICs must be complete."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "The working tree must be clean."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "All packages must use the same version."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "All workspace dependencies must resolve."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "No production secrets may be committed."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "The latest CI workflow must pass."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "The release must have an assigned semantic version."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Required development tooling:"
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Bun 1.4.4."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Node.js 22 or 24 for the validated CI matrix."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "npm CLI."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Docker with Docker Compose."
		},
		{
			"heading": "1-release-prerequisites",
			"content": "Chromium through Playwright."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "The GitHub Actions workflow must pass on both Node versions:"
		},
		{
			"heading": "2-required-ci-checks",
			"content": "CI (Node 22)"
		},
		{
			"heading": "2-required-ci-checks",
			"content": "CI (Node 24)"
		},
		{
			"heading": "2-required-ci-checks",
			"content": "Enable branch protection on main and require both checks before merging."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "The repository should require:"
		},
		{
			"heading": "2-required-ci-checks",
			"content": "Pull requests for changes to main."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "Successful required status checks."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "At least one review for security-sensitive changes."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "No force pushes to main."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "No deletion of main."
		},
		{
			"heading": "2-required-ci-checks",
			"content": "The CI workflow uses read-only repository permissions."
		},
		{
			"heading": "3-local-validation",
			"content": "Install dependencies:"
		},
		{
			"heading": "3-local-validation",
			"content": "Build every package:"
		},
		{
			"heading": "3-local-validation",
			"content": "Typecheck the complete workspace:"
		},
		{
			"heading": "3-local-validation",
			"content": "Run the complete test suite:"
		},
		{
			"heading": "3-local-validation",
			"content": "Build the documentation site:"
		},
		{
			"heading": "3-local-validation",
			"content": "The complete test command includes:"
		},
		{
			"heading": "3-local-validation",
			"content": "Core tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Theme tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Icons tests."
		},
		{
			"heading": "3-local-validation",
			"content": "UI unit tests."
		},
		{
			"heading": "3-local-validation",
			"content": "UI component tests."
		},
		{
			"heading": "3-local-validation",
			"content": "UI browser tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Pieces unit tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Pieces component tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Pieces browser tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Create CLI tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Storage tests."
		},
		{
			"heading": "3-local-validation",
			"content": "D1 conformance tests."
		},
		{
			"heading": "3-local-validation",
			"content": "MongoDB conformance tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Session tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Auth tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Fullstack integration tests."
		},
		{
			"heading": "3-local-validation",
			"content": "Fullstack browser tests."
		},
		{
			"heading": "3-local-validation",
			"content": "The MongoDB tests require Docker and a working replica set."
		},
		{
			"heading": "3-local-validation",
			"content": "The D1 tests use Miniflare."
		},
		{
			"heading": "application",
			"content": "Configure the production application to:"
		},
		{
			"heading": "application",
			"content": "Serve authentication routes over HTTPS."
		},
		{
			"heading": "application",
			"content": "Use an exact allowed-origin list."
		},
		{
			"heading": "application",
			"content": "Use secure HttpOnly session cookies."
		},
		{
			"heading": "application",
			"content": "Keep session tokens out of browser storage."
		},
		{
			"heading": "application",
			"content": "Use a restrictive SameSite policy."
		},
		{
			"heading": "application",
			"content": "Configure WebAuthn RP ID and expected origin."
		},
		{
			"heading": "application",
			"content": "Disable development-only authentication providers."
		},
		{
			"heading": "storage",
			"content": "Use durable storage."
		},
		{
			"heading": "storage",
			"content": "For MongoDB:"
		},
		{
			"heading": "storage",
			"content": "Use a replica set."
		},
		{
			"heading": "storage",
			"content": "Enable the transaction capabilities required by the adapter."
		},
		{
			"heading": "storage",
			"content": "Configure authentication and TLS."
		},
		{
			"heading": "storage",
			"content": "Configure backups."
		},
		{
			"heading": "storage",
			"content": "Monitor connection failures and transaction errors."
		},
		{
			"heading": "storage",
			"content": "For Cloudflare D1:"
		},
		{
			"heading": "storage",
			"content": "Use a production D1 database."
		},
		{
			"heading": "storage",
			"content": "Apply database migrations before enabling new application code."
		},
		{
			"heading": "storage",
			"content": "Verify unique constraints and conditional-write behavior."
		},
		{
			"heading": "storage",
			"content": "Keep local Miniflare state out of production artifacts."
		},
		{
			"heading": "storage",
			"content": "Do not use in-memory storage for production sessions or authentication."
		},
		{
			"heading": "secrets",
			"content": "Configure the following values using the deployment platform's secret manager:"
		},
		{
			"heading": "secrets",
			"content": "Rate-limit HMAC secret."
		},
		{
			"heading": "secrets",
			"content": "TOTP encryption keys."
		},
		{
			"heading": "secrets",
			"content": "Database credentials."
		},
		{
			"heading": "secrets",
			"content": "Email provider credentials."
		},
		{
			"heading": "secrets",
			"content": "Application-specific secrets."
		},
		{
			"heading": "secrets",
			"content": "Use separate secrets for development, staging and production."
		},
		{
			"heading": "secrets",
			"content": "Do not reuse test encryption keys in production."
		},
		{
			"heading": "secrets",
			"content": "Keep previous TOTP encryption keys available during a controlled key-rotation\nperiod when existing encrypted records still depend on them."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Before enabling production authentication, verify:"
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Registration and sign-in work."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Password reset does not disclose account existence."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Email verification tokens are single-use."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Password changes invalidate existing sessions."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Session rotation invalidates the previous session."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "CSRF rejects untrusted origins."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Rate limiting works across application instances."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "MFA challenges expire correctly."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Recovery codes cannot be reused."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "TOTP replay is rejected."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "WebAuthn challenge validation works."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "WebAuthn origin validation works."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "WebAuthn RP ID validation works."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Required MFA enrollment does not create a normal session before\nsuccessful enrollment."
		},
		{
			"heading": "5-authentication-security-acceptance",
			"content": "Only authenticated states authorize protected operations."
		},
		{
			"heading": "6-release-preparation",
			"content": "The release script publishes all packages in dependency order."
		},
		{
			"heading": "6-release-preparation",
			"content": "The release order is:"
		},
		{
			"heading": "6-release-preparation",
			"content": "core"
		},
		{
			"heading": "6-release-preparation",
			"content": "theme"
		},
		{
			"heading": "6-release-preparation",
			"content": "hooks"
		},
		{
			"heading": "6-release-preparation",
			"content": "icons"
		},
		{
			"heading": "6-release-preparation",
			"content": "ui"
		},
		{
			"heading": "6-release-preparation",
			"content": "pieces"
		},
		{
			"heading": "6-release-preparation",
			"content": "create"
		},
		{
			"heading": "6-release-preparation",
			"content": "storage"
		},
		{
			"heading": "6-release-preparation",
			"content": "session"
		},
		{
			"heading": "6-release-preparation",
			"content": "storage-d1"
		},
		{
			"heading": "6-release-preparation",
			"content": "storage-mongodb"
		},
		{
			"heading": "6-release-preparation",
			"content": "auth"
		},
		{
			"heading": "6-release-preparation",
			"content": "fullstack"
		},
		{
			"heading": "6-release-preparation",
			"content": "The script checks package coverage, version consistency, typechecks, tests,\nbuilds and npm package contents."
		},
		{
			"heading": "6-release-preparation",
			"content": "Perform a dry run first:"
		},
		{
			"heading": "6-release-preparation",
			"content": "Inspect the output and confirm that every package is included."
		},
		{
			"heading": "6-release-preparation",
			"content": "A dry run must not publish packages, create commits or create Git tags."
		},
		{
			"heading": "7-publishing",
			"content": "Before a real release:"
		},
		{
			"heading": "7-publishing",
			"content": "Confirm the npm account is authenticated."
		},
		{
			"heading": "7-publishing",
			"content": "Confirm that the package scope is available."
		},
		{
			"heading": "7-publishing",
			"content": "Confirm the intended release type."
		},
		{
			"heading": "7-publishing",
			"content": "Confirm the CI checks are green."
		},
		{
			"heading": "7-publishing",
			"content": "Confirm the working tree is clean."
		},
		{
			"heading": "7-publishing",
			"content": "Start the release:"
		},
		{
			"heading": "7-publishing",
			"content": "Select one of:"
		},
		{
			"heading": "7-publishing",
			"content": "patch"
		},
		{
			"heading": "7-publishing",
			"content": "minor"
		},
		{
			"heading": "7-publishing",
			"content": "major"
		},
		{
			"heading": "7-publishing",
			"content": "The release procedure publishes packages in dependency order."
		},
		{
			"heading": "7-publishing",
			"content": "It then commits and tags the release and pushes the commit and tag."
		},
		{
			"heading": "7-publishing",
			"content": "Do not interrupt a release after one or more packages have been published."
		},
		{
			"heading": "7-publishing",
			"content": "If publishing fails partway through, inspect the npm registry before retrying.\nAlready published versions cannot be overwritten."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Verify each package on npm:"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/core"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/theme"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/hooks"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/icons"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/ui"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/pieces"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/create"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/storage"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/session"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/storage-d1"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/storage-mongodb"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/auth"
		},
		{
			"heading": "8-post-release-verification",
			"content": "@puzzle-ui/fullstack"
		},
		{
			"heading": "8-post-release-verification",
			"content": "Verify:"
		},
		{
			"heading": "8-post-release-verification",
			"content": "Package versions match the release tag."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Package exports resolve."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Type declarations are present."
		},
		{
			"heading": "8-post-release-verification",
			"content": "ESM entry points resolve."
		},
		{
			"heading": "8-post-release-verification",
			"content": "CommonJS entry points resolve where provided."
		},
		{
			"heading": "8-post-release-verification",
			"content": "CSS files are included where required."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Peer dependencies are documented."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Package installation works in a clean consumer project."
		},
		{
			"heading": "8-post-release-verification",
			"content": "Run a production smoke test using the published packages."
		},
		{
			"heading": "9-rollback",
			"content": "Published npm versions must never be overwritten."
		},
		{
			"heading": "9-rollback",
			"content": "If a release contains a critical issue:"
		},
		{
			"heading": "9-rollback",
			"content": "Stop further deployments."
		},
		{
			"heading": "9-rollback",
			"content": "Identify the affected packages."
		},
		{
			"heading": "9-rollback",
			"content": "Revert the application deployment where possible."
		},
		{
			"heading": "9-rollback",
			"content": "Publish a corrected patch release."
		},
		{
			"heading": "9-rollback",
			"content": "Verify dependency compatibility."
		},
		{
			"heading": "9-rollback",
			"content": "Invalidate affected sessions when security requires it."
		},
		{
			"heading": "9-rollback",
			"content": "Review audit events and security logs."
		},
		{
			"heading": "9-rollback",
			"content": "Communicate the issue and remediation."
		},
		{
			"heading": "9-rollback",
			"content": "For compromised credentials or encryption keys, follow the application's\nincident response procedure."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "Passing Node.js and Miniflare tests does not replace deployment smoke tests."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "Before declaring a production deployment ready, test the actual deployment\nenvironment."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "This includes:"
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "A real Node.js deployment."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "A real Cloudflare Workers deployment when D1 is used."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "The configured production database."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "Production cookie behavior behind the actual reverse proxy."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "WebAuthn using the actual production domain."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "Email delivery and recovery flows."
		},
		{
			"heading": "10-runtime-validation-limitations",
			"content": "Record the tested runtime versions and deployment configuration alongside\nthe release."
		}
	],
	"headings": [
		{
			"id": "1-release-prerequisites",
			"content": "1. Release prerequisites"
		},
		{
			"id": "2-required-ci-checks",
			"content": "2. Required CI checks"
		},
		{
			"id": "3-local-validation",
			"content": "3. Local validation"
		},
		{
			"id": "4-production-configuration",
			"content": "4. Production configuration"
		},
		{
			"id": "application",
			"content": "Application"
		},
		{
			"id": "storage",
			"content": "Storage"
		},
		{
			"id": "secrets",
			"content": "Secrets"
		},
		{
			"id": "5-authentication-security-acceptance",
			"content": "5. Authentication security acceptance"
		},
		{
			"id": "6-release-preparation",
			"content": "6. Release preparation"
		},
		{
			"id": "7-publishing",
			"content": "7. Publishing"
		},
		{
			"id": "8-post-release-verification",
			"content": "8. Post-release verification"
		},
		{
			"id": "9-rollback",
			"content": "9. Rollback"
		},
		{
			"id": "10-runtime-validation-limitations",
			"content": "10. Runtime validation limitations"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-release-prerequisites",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "1. Release prerequisites" })
	},
	{
		depth: 2,
		url: "#2-required-ci-checks",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "2. Required CI checks" })
	},
	{
		depth: 2,
		url: "#3-local-validation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "3. Local validation" })
	},
	{
		depth: 2,
		url: "#4-production-configuration",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "4. Production configuration" })
	},
	{
		depth: 3,
		url: "#application",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Application" })
	},
	{
		depth: 3,
		url: "#storage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Storage" })
	},
	{
		depth: 3,
		url: "#secrets",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Secrets" })
	},
	{
		depth: 2,
		url: "#5-authentication-security-acceptance",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "5. Authentication security acceptance" })
	},
	{
		depth: 2,
		url: "#6-release-preparation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "6. Release preparation" })
	},
	{
		depth: 2,
		url: "#7-publishing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "7. Publishing" })
	},
	{
		depth: 2,
		url: "#8-post-release-verification",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "8. Post-release verification" })
	},
	{
		depth: 2,
		url: "#9-rollback",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "9. Rollback" })
	},
	{
		depth: 2,
		url: "#10-runtime-validation-limitations",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "10. Runtime validation limitations" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This document describes the release requirements for Puzzle packages." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "1-release-prerequisites",
			children: "1. Release prerequisites"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before preparing a release:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "All required EPICs must be complete." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The working tree must be clean." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "All packages must use the same version." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "All workspace dependencies must resolve." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "No production secrets may be committed." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The latest CI workflow must pass." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The release must have an assigned semantic version." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Required development tooling:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Bun 1.4.4." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Node.js 22 or 24 for the validated CI matrix." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "npm CLI." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Docker with Docker Compose." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Chromium through Playwright." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "2-required-ci-checks",
			children: "2. Required CI checks"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The GitHub Actions workflow must pass on both Node versions:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CI (Node 22)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CI (Node 24)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Enable branch protection on main and require both checks before merging." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The repository should require:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pull requests for changes to main." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Successful required status checks." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "At least one review for security-sensitive changes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "No force pushes to main." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "No deletion of main." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The CI workflow uses read-only repository permissions." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "3-local-validation",
			children: "3. Local validation"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Install dependencies:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun install --frozen-lockfile" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Build every package:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run build" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Typecheck the complete workspace:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run typecheck" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Run the complete test suite:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run vitest" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Build the documentation site:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run --filter '@puzzle-ui/site' build" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The complete test command includes:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Core tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Theme tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Icons tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "UI unit tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "UI component tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "UI browser tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pieces unit tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pieces component tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pieces browser tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Create CLI tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Storage tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "D1 conformance tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "MongoDB conformance tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Auth tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Fullstack integration tests." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Fullstack browser tests." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The MongoDB tests require Docker and a working replica set." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The D1 tests use Miniflare." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "4-production-configuration",
			children: "4. Production configuration"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "application",
			children: "Application"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Configure the production application to:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Serve authentication routes over HTTPS." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use an exact allowed-origin list." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use secure HttpOnly session cookies." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep session tokens out of browser storage." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use a restrictive SameSite policy." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Configure WebAuthn RP ID and expected origin." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Disable development-only authentication providers." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "storage",
			children: "Storage"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use durable storage." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For MongoDB:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use a replica set." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Enable the transaction capabilities required by the adapter." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Configure authentication and TLS." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Configure backups." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Monitor connection failures and transaction errors." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For Cloudflare D1:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use a production D1 database." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Apply database migrations before enabling new application code." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify unique constraints and conditional-write behavior." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep local Miniflare state out of production artifacts." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not use in-memory storage for production sessions or authentication." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "secrets",
			children: "Secrets"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Configure the following values using the deployment platform's secret manager:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate-limit HMAC secret." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "TOTP encryption keys." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database credentials." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Email provider credentials." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Application-specific secrets." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use separate secrets for development, staging and production." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not reuse test encryption keys in production." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Keep previous TOTP encryption keys available during a controlled key-rotation\nperiod when existing encrypted records still depend on them." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "5-authentication-security-acceptance",
			children: "5. Authentication security acceptance"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before enabling production authentication, verify:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Registration and sign-in work." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Password reset does not disclose account existence." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Email verification tokens are single-use." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Password changes invalidate existing sessions." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session rotation invalidates the previous session." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CSRF rejects untrusted origins." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate limiting works across application instances." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "MFA challenges expire correctly." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Recovery codes cannot be reused." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "TOTP replay is rejected." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn challenge validation works." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn origin validation works." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn RP ID validation works." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Required MFA enrollment does not create a normal session before\nsuccessful enrollment." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Only authenticated states authorize protected operations." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "6-release-preparation",
			children: "6. Release preparation"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The release script publishes all packages in dependency order." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The release order is:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "core" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "theme" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "hooks" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "icons" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "ui" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "pieces" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "create" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "storage" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "session" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "storage-d1" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "storage-mongodb" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "fullstack" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The script checks package coverage, version consistency, typechecks, tests,\nbuilds and npm package contents." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Perform a dry run first:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run release:dry-run" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Inspect the output and confirm that every package is included." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A dry run must not publish packages, create commits or create Git tags." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "7-publishing",
			children: "7. Publishing"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before a real release:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm the npm account is authenticated." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm that the package scope is available." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm the intended release type." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm the CI checks are green." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm the working tree is clean." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Start the release:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run release" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Select one of:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "patch" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "minor" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "major" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The release procedure publishes packages in dependency order." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "It then commits and tags the release and pushes the commit and tag." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not interrupt a release after one or more packages have been published." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "If publishing fails partway through, inspect the npm registry before retrying.\nAlready published versions cannot be overwritten." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "8-post-release-verification",
			children: "8. Post-release verification"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Verify each package on npm:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/core" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/theme" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/hooks" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/icons" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/ui" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/pieces" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/create" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/storage" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/session" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/storage-d1" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/storage-mongodb" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/auth" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "@puzzle-ui/fullstack" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Verify:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Package versions match the release tag." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Package exports resolve." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Type declarations are present." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "ESM entry points resolve." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CommonJS entry points resolve where provided." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CSS files are included where required." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Peer dependencies are documented." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Package installation works in a clean consumer project." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Run a production smoke test using the published packages." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "9-rollback",
			children: "9. Rollback"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Published npm versions must never be overwritten." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "If a release contains a critical issue:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Stop further deployments." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Identify the affected packages." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Revert the application deployment where possible." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Publish a corrected patch release." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify dependency compatibility." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Invalidate affected sessions when security requires it." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Review audit events and security logs." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Communicate the issue and remediation." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For compromised credentials or encryption keys, follow the application's\nincident response procedure." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "10-runtime-validation-limitations",
			children: "10. Runtime validation limitations"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Passing Node.js and Miniflare tests does not replace deployment smoke tests." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before declaring a production deployment ready, test the actual deployment\nenvironment." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This includes:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A real Node.js deployment." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A real Cloudflare Workers deployment when D1 is used." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The configured production database." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Production cookie behavior behind the actual reverse proxy." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn using the actual production domain." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Email delivery and recovery flows." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Record the tested runtime versions and deployment configuration alongside\nthe release." })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
export { MDXContent as default, frontmatter, structuredData, toc };
