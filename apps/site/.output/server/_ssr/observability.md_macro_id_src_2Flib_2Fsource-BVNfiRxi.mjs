import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/observability.md_macro_id_src_2Flib_2Fsource-BVNfiRxi.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Puzzle Authentication Observability",
	"description": "Monitoring, metrics, health checks, and operational requirements for production authentication deployments."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This document describes the recommended monitoring and operational\nrequirements for production authentication deployments."
		},
		{
			"heading": "health-checks",
			"content": "Use two separate health concepts."
		},
		{
			"heading": "liveness",
			"content": "Liveness determines whether the application process is running."
		},
		{
			"heading": "liveness",
			"content": "It should not depend on database availability."
		},
		{
			"heading": "liveness",
			"content": "A temporary database outage should not automatically restart every\napplication instance."
		},
		{
			"heading": "readiness",
			"content": "Readiness determines whether an instance can safely serve authentication\nrequests."
		},
		{
			"heading": "readiness",
			"content": "Use the server-side createAuthReadinessHandler from\n@puzzle-ui/fullstack/auth/server."
		},
		{
			"heading": "readiness",
			"content": "Recommended checks:"
		},
		{
			"heading": "readiness",
			"content": "Database connectivity."
		},
		{
			"heading": "readiness",
			"content": "Required authentication collections."
		},
		{
			"heading": "readiness",
			"content": "Session storage availability."
		},
		{
			"heading": "readiness",
			"content": "Migration readiness."
		},
		{
			"heading": "readiness",
			"content": "Shared rate-limit storage availability."
		},
		{
			"heading": "readiness",
			"content": "Readiness checks should have bounded execution times."
		},
		{
			"heading": "readiness",
			"content": "Do not expose provider exceptions or infrastructure details through\npublic health endpoints."
		},
		{
			"heading": "structured-logging",
			"content": "Use structured JSON logs."
		},
		{
			"heading": "structured-logging",
			"content": "Recommended fields:"
		},
		{
			"heading": "structured-logging",
			"content": "timestamp"
		},
		{
			"heading": "structured-logging",
			"content": "level"
		},
		{
			"heading": "structured-logging",
			"content": "service"
		},
		{
			"heading": "structured-logging",
			"content": "environment"
		},
		{
			"heading": "structured-logging",
			"content": "requestId"
		},
		{
			"heading": "structured-logging",
			"content": "operation"
		},
		{
			"heading": "structured-logging",
			"content": "outcome"
		},
		{
			"heading": "structured-logging",
			"content": "durationMs"
		},
		{
			"heading": "structured-logging",
			"content": "errorCode"
		},
		{
			"heading": "structured-logging",
			"content": "storageAdapter"
		},
		{
			"heading": "structured-logging",
			"content": "Do not include credentials or raw user identifiers."
		},
		{
			"heading": "structured-logging",
			"content": "Never log:"
		},
		{
			"heading": "structured-logging",
			"content": "Session tokens."
		},
		{
			"heading": "structured-logging",
			"content": "MFA challenge tokens."
		},
		{
			"heading": "structured-logging",
			"content": "Password reset tokens."
		},
		{
			"heading": "structured-logging",
			"content": "Email verification tokens."
		},
		{
			"heading": "structured-logging",
			"content": "Passwords."
		},
		{
			"heading": "structured-logging",
			"content": "Password hashes."
		},
		{
			"heading": "structured-logging",
			"content": "TOTP secrets."
		},
		{
			"heading": "structured-logging",
			"content": "Recovery codes."
		},
		{
			"heading": "structured-logging",
			"content": "WebAuthn private material."
		},
		{
			"heading": "structured-logging",
			"content": "Database connection strings."
		},
		{
			"heading": "structured-logging",
			"content": "Authentication failures should use stable error codes rather than exposing\nprovider-specific exceptions."
		},
		{
			"heading": "authentication",
			"content": "auth_requests_total"
		},
		{
			"heading": "authentication",
			"content": "auth_request_duration_seconds"
		},
		{
			"heading": "authentication",
			"content": "auth_sign_in_failures_total"
		},
		{
			"heading": "authentication",
			"content": "auth_registration_total"
		},
		{
			"heading": "authentication",
			"content": "auth_password_reset_requests_total"
		},
		{
			"heading": "authentication",
			"content": "auth_email_verification_total"
		},
		{
			"heading": "mfa",
			"content": "auth_mfa_challenges_total"
		},
		{
			"heading": "mfa",
			"content": "auth_mfa_verifications_total"
		},
		{
			"heading": "mfa",
			"content": "auth_mfa_failures_total"
		},
		{
			"heading": "mfa",
			"content": "auth_mfa_recovery_code_usage_total"
		},
		{
			"heading": "mfa",
			"content": "auth_passkey_verifications_total"
		},
		{
			"heading": "sessions",
			"content": "auth_session_creations_total"
		},
		{
			"heading": "sessions",
			"content": "auth_session_rotations_total"
		},
		{
			"heading": "sessions",
			"content": "auth_session_revocations_total"
		},
		{
			"heading": "sessions",
			"content": "auth_session_validation_failures_total"
		},
		{
			"heading": "storage",
			"content": "auth_storage_operations_total"
		},
		{
			"heading": "storage",
			"content": "auth_storage_operation_duration_seconds"
		},
		{
			"heading": "storage",
			"content": "auth_storage_errors_total"
		},
		{
			"heading": "storage",
			"content": "auth_storage_conflicts_total"
		},
		{
			"heading": "rate-limiting",
			"content": "auth_rate_limit_allowed_total"
		},
		{
			"heading": "rate-limiting",
			"content": "auth_rate_limit_rejected_total"
		},
		{
			"heading": "rate-limiting",
			"content": "auth_rate_limit_storage_errors_total"
		},
		{
			"heading": "rate-limiting",
			"content": "Use bounded labels such as:"
		},
		{
			"heading": "rate-limiting",
			"content": "operation"
		},
		{
			"heading": "rate-limiting",
			"content": "adapter"
		},
		{
			"heading": "rate-limiting",
			"content": "outcome"
		},
		{
			"heading": "rate-limiting",
			"content": "authentication method"
		},
		{
			"heading": "rate-limiting",
			"content": "error code"
		},
		{
			"heading": "rate-limiting",
			"content": "Never use email addresses, session IDs, tokens, IP addresses or user IDs as\nmetric labels."
		},
		{
			"heading": "rate-limiting",
			"content": "Avoid unbounded cardinality."
		},
		{
			"heading": "performance-monitoring",
			"content": "Measure at least:"
		},
		{
			"heading": "performance-monitoring",
			"content": "Registration latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Password sign-in latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "MFA verification latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Passkey verification latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Session validation latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Session rotation latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Recovery-code verification latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Storage query latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Rate-limit latency."
		},
		{
			"heading": "performance-monitoring",
			"content": "Record p50, p95 and p99 latency."
		},
		{
			"heading": "argon2id",
			"content": "Benchmark the actual production password hashing provider."
		},
		{
			"heading": "argon2id",
			"content": "Measure:"
		},
		{
			"heading": "argon2id",
			"content": "CPU time."
		},
		{
			"heading": "argon2id",
			"content": "Memory consumption."
		},
		{
			"heading": "argon2id",
			"content": "Concurrent hash operations."
		},
		{
			"heading": "argon2id",
			"content": "Authentication latency under load."
		},
		{
			"heading": "argon2id",
			"content": "Resource exhaustion behavior."
		},
		{
			"heading": "argon2id",
			"content": "Choose Argon2id parameters according to the production runtime and available\nresources."
		},
		{
			"heading": "argon2id",
			"content": "Do not assume parameters suitable for a Node.js server are automatically\nsuitable for Cloudflare Workers."
		},
		{
			"heading": "mongodb",
			"content": "Monitor:"
		},
		{
			"heading": "mongodb",
			"content": "Connection pool utilization."
		},
		{
			"heading": "mongodb",
			"content": "Connection wait time."
		},
		{
			"heading": "mongodb",
			"content": "Transaction duration."
		},
		{
			"heading": "mongodb",
			"content": "Transaction failures."
		},
		{
			"heading": "mongodb",
			"content": "Query latency."
		},
		{
			"heading": "mongodb",
			"content": "Conditional-write conflicts."
		},
		{
			"heading": "cloudflare-d1",
			"content": "Monitor:"
		},
		{
			"heading": "cloudflare-d1",
			"content": "Query latency."
		},
		{
			"heading": "cloudflare-d1",
			"content": "Transaction duration."
		},
		{
			"heading": "cloudflare-d1",
			"content": "Database errors."
		},
		{
			"heading": "cloudflare-d1",
			"content": "Worker CPU time."
		},
		{
			"heading": "cloudflare-d1",
			"content": "Worker memory usage."
		},
		{
			"heading": "cloudflare-d1",
			"content": "D1 limits and throttling."
		},
		{
			"heading": "session-load",
			"content": "Test:"
		},
		{
			"heading": "session-load",
			"content": "Concurrent session creation."
		},
		{
			"heading": "session-load",
			"content": "Session validation under load."
		},
		{
			"heading": "session-load",
			"content": "Concurrent rotation."
		},
		{
			"heading": "session-load",
			"content": "Revocation of multiple sessions."
		},
		{
			"heading": "session-load",
			"content": "Expiration cleanup."
		},
		{
			"heading": "rate-limiting-1",
			"content": "Run the local concurrency benchmark:"
		},
		{
			"heading": "rate-limiting-1",
			"content": "This benchmark uses MemoryStorage and is intended for regression comparisons."
		},
		{
			"heading": "rate-limiting-1",
			"content": "Production capacity measurements must use the actual MongoDB or D1 adapter."
		},
		{
			"heading": "fault-injection",
			"content": "Production-readiness testing should include:"
		},
		{
			"heading": "fault-injection",
			"content": "Database connection loss."
		},
		{
			"heading": "fault-injection",
			"content": "Database write failures."
		},
		{
			"heading": "fault-injection",
			"content": "Conditional-write conflicts."
		},
		{
			"heading": "fault-injection",
			"content": "Transaction failures."
		},
		{
			"heading": "fault-injection",
			"content": "Rate-limit provider failure."
		},
		{
			"heading": "fault-injection",
			"content": "Email provider failure."
		},
		{
			"heading": "fault-injection",
			"content": "Session provider failure."
		},
		{
			"heading": "fault-injection",
			"content": "WebAuthn provider errors."
		},
		{
			"heading": "fault-injection",
			"content": "Verify that:"
		},
		{
			"heading": "fault-injection",
			"content": "Authentication fails closed when required security dependencies fail."
		},
		{
			"heading": "fault-injection",
			"content": "Failed writes do not partially commit security-critical operations."
		},
		{
			"heading": "fault-injection",
			"content": "Consumed challenges cannot be restored."
		},
		{
			"heading": "fault-injection",
			"content": "Recovery codes cannot be reused."
		},
		{
			"heading": "fault-injection",
			"content": "Failed initialization can be retried."
		},
		{
			"heading": "fault-injection",
			"content": "Existing sessions are not incorrectly authorized after security failures."
		},
		{
			"heading": "alerting",
			"content": "Recommended alerts:"
		},
		{
			"heading": "alerting",
			"content": "Elevated authentication failure rate."
		},
		{
			"heading": "alerting",
			"content": "Elevated HTTP 5xx rate on auth routes."
		},
		{
			"heading": "alerting",
			"content": "Database connection failures."
		},
		{
			"heading": "alerting",
			"content": "Increased transaction conflicts."
		},
		{
			"heading": "alerting",
			"content": "Rate-limit storage failures."
		},
		{
			"heading": "alerting",
			"content": "Unusual recovery-code usage."
		},
		{
			"heading": "alerting",
			"content": "Repeated WebAuthn verification failures."
		},
		{
			"heading": "alerting",
			"content": "Unexpected session revocation spikes."
		},
		{
			"heading": "alerting",
			"content": "Increased p95 authentication latency."
		},
		{
			"heading": "alerting",
			"content": "Alerts must not contain secrets or personal authentication data."
		},
		{
			"heading": "operational-dashboards",
			"content": "Maintain separate dashboards for:"
		},
		{
			"heading": "operational-dashboards",
			"content": "Authentication availability."
		},
		{
			"heading": "operational-dashboards",
			"content": "Authentication latency."
		},
		{
			"heading": "operational-dashboards",
			"content": "MFA security events."
		},
		{
			"heading": "operational-dashboards",
			"content": "Session activity."
		},
		{
			"heading": "operational-dashboards",
			"content": "Database performance."
		},
		{
			"heading": "operational-dashboards",
			"content": "Rate-limit behavior."
		},
		{
			"heading": "operational-dashboards",
			"content": "Infrastructure resource usage."
		},
		{
			"heading": "operational-dashboards",
			"content": "Use the same service and environment identifiers across logs, traces and\nmetrics."
		},
		{
			"heading": "production-acceptance",
			"content": "Before production approval:"
		},
		{
			"heading": "production-acceptance",
			"content": "Verify liveness and readiness endpoints."
		},
		{
			"heading": "production-acceptance",
			"content": "Verify that readiness becomes unavailable when storage fails."
		},
		{
			"heading": "production-acceptance",
			"content": "Verify that liveness remains independent of storage."
		},
		{
			"heading": "production-acceptance",
			"content": "Confirm that metrics have bounded cardinality."
		},
		{
			"heading": "production-acceptance",
			"content": "Confirm that sensitive information is absent from logs."
		},
		{
			"heading": "production-acceptance",
			"content": "Record performance baselines for the actual production adapters."
		},
		{
			"heading": "production-acceptance",
			"content": "Test recovery after transient provider failures."
		}
	],
	"headings": [
		{
			"id": "health-checks",
			"content": "Health checks"
		},
		{
			"id": "liveness",
			"content": "Liveness"
		},
		{
			"id": "readiness",
			"content": "Readiness"
		},
		{
			"id": "structured-logging",
			"content": "Structured logging"
		},
		{
			"id": "recommended-metrics",
			"content": "Recommended metrics"
		},
		{
			"id": "authentication",
			"content": "Authentication"
		},
		{
			"id": "mfa",
			"content": "MFA"
		},
		{
			"id": "sessions",
			"content": "Sessions"
		},
		{
			"id": "storage",
			"content": "Storage"
		},
		{
			"id": "rate-limiting",
			"content": "Rate limiting"
		},
		{
			"id": "performance-monitoring",
			"content": "Performance monitoring"
		},
		{
			"id": "argon2id",
			"content": "Argon2id"
		},
		{
			"id": "mongodb",
			"content": "MongoDB"
		},
		{
			"id": "cloudflare-d1",
			"content": "Cloudflare D1"
		},
		{
			"id": "session-load",
			"content": "Session load"
		},
		{
			"id": "rate-limiting-1",
			"content": "Rate limiting"
		},
		{
			"id": "fault-injection",
			"content": "Fault injection"
		},
		{
			"id": "alerting",
			"content": "Alerting"
		},
		{
			"id": "operational-dashboards",
			"content": "Operational dashboards"
		},
		{
			"id": "production-acceptance",
			"content": "Production acceptance"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#health-checks",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Health checks" })
	},
	{
		depth: 3,
		url: "#liveness",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Liveness" })
	},
	{
		depth: 3,
		url: "#readiness",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Readiness" })
	},
	{
		depth: 2,
		url: "#structured-logging",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Structured logging" })
	},
	{
		depth: 2,
		url: "#recommended-metrics",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Recommended metrics" })
	},
	{
		depth: 3,
		url: "#authentication",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Authentication" })
	},
	{
		depth: 3,
		url: "#mfa",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "MFA" })
	},
	{
		depth: 3,
		url: "#sessions",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Sessions" })
	},
	{
		depth: 3,
		url: "#storage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Storage" })
	},
	{
		depth: 3,
		url: "#rate-limiting",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Rate limiting" })
	},
	{
		depth: 2,
		url: "#performance-monitoring",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Performance monitoring" })
	},
	{
		depth: 3,
		url: "#argon2id",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Argon2id" })
	},
	{
		depth: 3,
		url: "#mongodb",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "MongoDB" })
	},
	{
		depth: 3,
		url: "#cloudflare-d1",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Cloudflare D1" })
	},
	{
		depth: 3,
		url: "#session-load",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Session load" })
	},
	{
		depth: 3,
		url: "#rate-limiting-1",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Rate limiting" })
	},
	{
		depth: 2,
		url: "#fault-injection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Fault injection" })
	},
	{
		depth: 2,
		url: "#alerting",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Alerting" })
	},
	{
		depth: 2,
		url: "#operational-dashboards",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Operational dashboards" })
	},
	{
		depth: 2,
		url: "#production-acceptance",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Production acceptance" })
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
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This document describes the recommended monitoring and operational\nrequirements for production authentication deployments." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "health-checks",
			children: "Health checks"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use two separate health concepts." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "liveness",
			children: "Liveness"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Liveness determines whether the application process is running." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "It should not depend on database availability." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A temporary database outage should not automatically restart every\napplication instance." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "readiness",
			children: "Readiness"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Readiness determines whether an instance can safely serve authentication\nrequests." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the server-side createAuthReadinessHandler from\n@puzzle-ui/fullstack/auth/server." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Recommended checks:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database connectivity." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Required authentication collections." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session storage availability." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Migration readiness." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Shared rate-limit storage availability." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Readiness checks should have bounded execution times." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not expose provider exceptions or infrastructure details through\npublic health endpoints." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "structured-logging",
			children: "Structured logging"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use structured JSON logs." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Recommended fields:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "timestamp" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "level" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "service" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "environment" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "requestId" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "operation" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "outcome" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "durationMs" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "errorCode" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "storageAdapter" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not include credentials or raw user identifiers." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Never log:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session tokens." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "MFA challenge tokens." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Password reset tokens." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Email verification tokens." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Passwords." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Password hashes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "TOTP secrets." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Recovery codes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn private material." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database connection strings." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Authentication failures should use stable error codes rather than exposing\nprovider-specific exceptions." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "recommended-metrics",
			children: "Recommended metrics"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "authentication",
			children: "Authentication"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_requests_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_request_duration_seconds" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_sign_in_failures_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_registration_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_password_reset_requests_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_email_verification_total" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "mfa",
			children: "MFA"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_mfa_challenges_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_mfa_verifications_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_mfa_failures_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_mfa_recovery_code_usage_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_passkey_verifications_total" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "sessions",
			children: "Sessions"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_session_creations_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_session_rotations_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_session_revocations_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_session_validation_failures_total" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "storage",
			children: "Storage"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_storage_operations_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_storage_operation_duration_seconds" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_storage_errors_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_storage_conflicts_total" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "rate-limiting",
			children: "Rate limiting"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_rate_limit_allowed_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_rate_limit_rejected_total" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "auth_rate_limit_storage_errors_total" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use bounded labels such as:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "operation" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "adapter" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "outcome" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "authentication method" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "error code" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Never use email addresses, session IDs, tokens, IP addresses or user IDs as\nmetric labels." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Avoid unbounded cardinality." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "performance-monitoring",
			children: "Performance monitoring"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Measure at least:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Registration latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Password sign-in latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "MFA verification latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Passkey verification latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session validation latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session rotation latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Recovery-code verification latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Storage query latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate-limit latency." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Record p50, p95 and p99 latency." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "argon2id",
			children: "Argon2id"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Benchmark the actual production password hashing provider." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Measure:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "CPU time." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Memory consumption." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Concurrent hash operations." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Authentication latency under load." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Resource exhaustion behavior." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Choose Argon2id parameters according to the production runtime and available\nresources." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Do not assume parameters suitable for a Node.js server are automatically\nsuitable for Cloudflare Workers." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "mongodb",
			children: "MongoDB"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Monitor:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Connection pool utilization." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Connection wait time." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Transaction duration." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Transaction failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Query latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Conditional-write conflicts." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "cloudflare-d1",
			children: "Cloudflare D1"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Monitor:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Query latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Transaction duration." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database errors." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Worker CPU time." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Worker memory usage." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "D1 limits and throttling." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "session-load",
			children: "Session load"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Test:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Concurrent session creation." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session validation under load." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Concurrent rotation." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Revocation of multiple sessions." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Expiration cleanup." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "rate-limiting-1",
			children: "Rate limiting"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Run the local concurrency benchmark:" }),
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
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "bun run benchmark:auth" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This benchmark uses MemoryStorage and is intended for regression comparisons." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Production capacity measurements must use the actual MongoDB or D1 adapter." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "fault-injection",
			children: "Fault injection"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Production-readiness testing should include:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database connection loss." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database write failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Conditional-write conflicts." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Transaction failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate-limit provider failure." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Email provider failure." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session provider failure." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "WebAuthn provider errors." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Verify that:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Authentication fails closed when required security dependencies fail." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Failed writes do not partially commit security-critical operations." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Consumed challenges cannot be restored." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Recovery codes cannot be reused." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Failed initialization can be retried." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Existing sessions are not incorrectly authorized after security failures." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "alerting",
			children: "Alerting"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Recommended alerts:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Elevated authentication failure rate." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Elevated HTTP 5xx rate on auth routes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database connection failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Increased transaction conflicts." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate-limit storage failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Unusual recovery-code usage." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Repeated WebAuthn verification failures." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Unexpected session revocation spikes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Increased p95 authentication latency." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Alerts must not contain secrets or personal authentication data." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "operational-dashboards",
			children: "Operational dashboards"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Maintain separate dashboards for:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Authentication availability." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Authentication latency." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "MFA security events." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Session activity." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Database performance." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rate-limit behavior." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Infrastructure resource usage." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the same service and environment identifiers across logs, traces and\nmetrics." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "production-acceptance",
			children: "Production acceptance"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before production approval:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify liveness and readiness endpoints." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify that readiness becomes unavailable when storage fails." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify that liveness remains independent of storage." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm that metrics have bounded cardinality." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Confirm that sensitive information is absent from logs." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Record performance baselines for the actual production adapters." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Test recovery after transient provider failures." }),
			"\n"
		] })
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
