import{t as e}from"./jsx-runtime-LKYXHABd.js";var t=e(),n={title:`Puzzle Authentication Observability`,description:`Monitoring, metrics, health checks, and operational requirements for production authentication deployments.`},r={contents:[{heading:void 0,content:`This document describes the recommended monitoring and operational
requirements for production authentication deployments.`},{heading:`health-checks`,content:`Use two separate health concepts.`},{heading:`liveness`,content:`Liveness determines whether the application process is running.`},{heading:`liveness`,content:`It should not depend on database availability.`},{heading:`liveness`,content:`A temporary database outage should not automatically restart every
application instance.`},{heading:`readiness`,content:`Readiness determines whether an instance can safely serve authentication
requests.`},{heading:`readiness`,content:`Use the server-side createAuthReadinessHandler from
@puzzle-ui/fullstack/auth/server.`},{heading:`readiness`,content:`Recommended checks:`},{heading:`readiness`,content:`Database connectivity.`},{heading:`readiness`,content:`Required authentication collections.`},{heading:`readiness`,content:`Session storage availability.`},{heading:`readiness`,content:`Migration readiness.`},{heading:`readiness`,content:`Shared rate-limit storage availability.`},{heading:`readiness`,content:`Readiness checks should have bounded execution times.`},{heading:`readiness`,content:`Do not expose provider exceptions or infrastructure details through
public health endpoints.`},{heading:`structured-logging`,content:`Use structured JSON logs.`},{heading:`structured-logging`,content:`Recommended fields:`},{heading:`structured-logging`,content:`timestamp`},{heading:`structured-logging`,content:`level`},{heading:`structured-logging`,content:`service`},{heading:`structured-logging`,content:`environment`},{heading:`structured-logging`,content:`requestId`},{heading:`structured-logging`,content:`operation`},{heading:`structured-logging`,content:`outcome`},{heading:`structured-logging`,content:`durationMs`},{heading:`structured-logging`,content:`errorCode`},{heading:`structured-logging`,content:`storageAdapter`},{heading:`structured-logging`,content:`Do not include credentials or raw user identifiers.`},{heading:`structured-logging`,content:`Never log:`},{heading:`structured-logging`,content:`Session tokens.`},{heading:`structured-logging`,content:`MFA challenge tokens.`},{heading:`structured-logging`,content:`Password reset tokens.`},{heading:`structured-logging`,content:`Email verification tokens.`},{heading:`structured-logging`,content:`Passwords.`},{heading:`structured-logging`,content:`Password hashes.`},{heading:`structured-logging`,content:`TOTP secrets.`},{heading:`structured-logging`,content:`Recovery codes.`},{heading:`structured-logging`,content:`WebAuthn private material.`},{heading:`structured-logging`,content:`Database connection strings.`},{heading:`structured-logging`,content:`Authentication failures should use stable error codes rather than exposing
provider-specific exceptions.`},{heading:`authentication`,content:`auth_requests_total`},{heading:`authentication`,content:`auth_request_duration_seconds`},{heading:`authentication`,content:`auth_sign_in_failures_total`},{heading:`authentication`,content:`auth_registration_total`},{heading:`authentication`,content:`auth_password_reset_requests_total`},{heading:`authentication`,content:`auth_email_verification_total`},{heading:`mfa`,content:`auth_mfa_challenges_total`},{heading:`mfa`,content:`auth_mfa_verifications_total`},{heading:`mfa`,content:`auth_mfa_failures_total`},{heading:`mfa`,content:`auth_mfa_recovery_code_usage_total`},{heading:`mfa`,content:`auth_passkey_verifications_total`},{heading:`sessions`,content:`auth_session_creations_total`},{heading:`sessions`,content:`auth_session_rotations_total`},{heading:`sessions`,content:`auth_session_revocations_total`},{heading:`sessions`,content:`auth_session_validation_failures_total`},{heading:`storage`,content:`auth_storage_operations_total`},{heading:`storage`,content:`auth_storage_operation_duration_seconds`},{heading:`storage`,content:`auth_storage_errors_total`},{heading:`storage`,content:`auth_storage_conflicts_total`},{heading:`rate-limiting`,content:`auth_rate_limit_allowed_total`},{heading:`rate-limiting`,content:`auth_rate_limit_rejected_total`},{heading:`rate-limiting`,content:`auth_rate_limit_storage_errors_total`},{heading:`rate-limiting`,content:`Use bounded labels such as:`},{heading:`rate-limiting`,content:`operation`},{heading:`rate-limiting`,content:`adapter`},{heading:`rate-limiting`,content:`outcome`},{heading:`rate-limiting`,content:`authentication method`},{heading:`rate-limiting`,content:`error code`},{heading:`rate-limiting`,content:`Never use email addresses, session IDs, tokens, IP addresses or user IDs as
metric labels.`},{heading:`rate-limiting`,content:`Avoid unbounded cardinality.`},{heading:`performance-monitoring`,content:`Measure at least:`},{heading:`performance-monitoring`,content:`Registration latency.`},{heading:`performance-monitoring`,content:`Password sign-in latency.`},{heading:`performance-monitoring`,content:`MFA verification latency.`},{heading:`performance-monitoring`,content:`Passkey verification latency.`},{heading:`performance-monitoring`,content:`Session validation latency.`},{heading:`performance-monitoring`,content:`Session rotation latency.`},{heading:`performance-monitoring`,content:`Recovery-code verification latency.`},{heading:`performance-monitoring`,content:`Storage query latency.`},{heading:`performance-monitoring`,content:`Rate-limit latency.`},{heading:`performance-monitoring`,content:`Record p50, p95 and p99 latency.`},{heading:`argon2id`,content:`Benchmark the actual production password hashing provider.`},{heading:`argon2id`,content:`Measure:`},{heading:`argon2id`,content:`CPU time.`},{heading:`argon2id`,content:`Memory consumption.`},{heading:`argon2id`,content:`Concurrent hash operations.`},{heading:`argon2id`,content:`Authentication latency under load.`},{heading:`argon2id`,content:`Resource exhaustion behavior.`},{heading:`argon2id`,content:`Choose Argon2id parameters according to the production runtime and available
resources.`},{heading:`argon2id`,content:`Do not assume parameters suitable for a Node.js server are automatically
suitable for Cloudflare Workers.`},{heading:`mongodb`,content:`Monitor:`},{heading:`mongodb`,content:`Connection pool utilization.`},{heading:`mongodb`,content:`Connection wait time.`},{heading:`mongodb`,content:`Transaction duration.`},{heading:`mongodb`,content:`Transaction failures.`},{heading:`mongodb`,content:`Query latency.`},{heading:`mongodb`,content:`Conditional-write conflicts.`},{heading:`cloudflare-d1`,content:`Monitor:`},{heading:`cloudflare-d1`,content:`Query latency.`},{heading:`cloudflare-d1`,content:`Transaction duration.`},{heading:`cloudflare-d1`,content:`Database errors.`},{heading:`cloudflare-d1`,content:`Worker CPU time.`},{heading:`cloudflare-d1`,content:`Worker memory usage.`},{heading:`cloudflare-d1`,content:`D1 limits and throttling.`},{heading:`session-load`,content:`Test:`},{heading:`session-load`,content:`Concurrent session creation.`},{heading:`session-load`,content:`Session validation under load.`},{heading:`session-load`,content:`Concurrent rotation.`},{heading:`session-load`,content:`Revocation of multiple sessions.`},{heading:`session-load`,content:`Expiration cleanup.`},{heading:`rate-limiting-1`,content:`Run the local concurrency benchmark:`},{heading:`rate-limiting-1`,content:`This benchmark uses MemoryStorage and is intended for regression comparisons.`},{heading:`rate-limiting-1`,content:`Production capacity measurements must use the actual MongoDB or D1 adapter.`},{heading:`fault-injection`,content:`Production-readiness testing should include:`},{heading:`fault-injection`,content:`Database connection loss.`},{heading:`fault-injection`,content:`Database write failures.`},{heading:`fault-injection`,content:`Conditional-write conflicts.`},{heading:`fault-injection`,content:`Transaction failures.`},{heading:`fault-injection`,content:`Rate-limit provider failure.`},{heading:`fault-injection`,content:`Email provider failure.`},{heading:`fault-injection`,content:`Session provider failure.`},{heading:`fault-injection`,content:`WebAuthn provider errors.`},{heading:`fault-injection`,content:`Verify that:`},{heading:`fault-injection`,content:`Authentication fails closed when required security dependencies fail.`},{heading:`fault-injection`,content:`Failed writes do not partially commit security-critical operations.`},{heading:`fault-injection`,content:`Consumed challenges cannot be restored.`},{heading:`fault-injection`,content:`Recovery codes cannot be reused.`},{heading:`fault-injection`,content:`Failed initialization can be retried.`},{heading:`fault-injection`,content:`Existing sessions are not incorrectly authorized after security failures.`},{heading:`alerting`,content:`Recommended alerts:`},{heading:`alerting`,content:`Elevated authentication failure rate.`},{heading:`alerting`,content:`Elevated HTTP 5xx rate on auth routes.`},{heading:`alerting`,content:`Database connection failures.`},{heading:`alerting`,content:`Increased transaction conflicts.`},{heading:`alerting`,content:`Rate-limit storage failures.`},{heading:`alerting`,content:`Unusual recovery-code usage.`},{heading:`alerting`,content:`Repeated WebAuthn verification failures.`},{heading:`alerting`,content:`Unexpected session revocation spikes.`},{heading:`alerting`,content:`Increased p95 authentication latency.`},{heading:`alerting`,content:`Alerts must not contain secrets or personal authentication data.`},{heading:`operational-dashboards`,content:`Maintain separate dashboards for:`},{heading:`operational-dashboards`,content:`Authentication availability.`},{heading:`operational-dashboards`,content:`Authentication latency.`},{heading:`operational-dashboards`,content:`MFA security events.`},{heading:`operational-dashboards`,content:`Session activity.`},{heading:`operational-dashboards`,content:`Database performance.`},{heading:`operational-dashboards`,content:`Rate-limit behavior.`},{heading:`operational-dashboards`,content:`Infrastructure resource usage.`},{heading:`operational-dashboards`,content:`Use the same service and environment identifiers across logs, traces and
metrics.`},{heading:`production-acceptance`,content:`Before production approval:`},{heading:`production-acceptance`,content:`Verify liveness and readiness endpoints.`},{heading:`production-acceptance`,content:`Verify that readiness becomes unavailable when storage fails.`},{heading:`production-acceptance`,content:`Verify that liveness remains independent of storage.`},{heading:`production-acceptance`,content:`Confirm that metrics have bounded cardinality.`},{heading:`production-acceptance`,content:`Confirm that sensitive information is absent from logs.`},{heading:`production-acceptance`,content:`Record performance baselines for the actual production adapters.`},{heading:`production-acceptance`,content:`Test recovery after transient provider failures.`}],headings:[{id:`health-checks`,content:`Health checks`},{id:`liveness`,content:`Liveness`},{id:`readiness`,content:`Readiness`},{id:`structured-logging`,content:`Structured logging`},{id:`recommended-metrics`,content:`Recommended metrics`},{id:`authentication`,content:`Authentication`},{id:`mfa`,content:`MFA`},{id:`sessions`,content:`Sessions`},{id:`storage`,content:`Storage`},{id:`rate-limiting`,content:`Rate limiting`},{id:`performance-monitoring`,content:`Performance monitoring`},{id:`argon2id`,content:`Argon2id`},{id:`mongodb`,content:`MongoDB`},{id:`cloudflare-d1`,content:`Cloudflare D1`},{id:`session-load`,content:`Session load`},{id:`rate-limiting-1`,content:`Rate limiting`},{id:`fault-injection`,content:`Fault injection`},{id:`alerting`,content:`Alerting`},{id:`operational-dashboards`,content:`Operational dashboards`},{id:`production-acceptance`,content:`Production acceptance`}]},i=[{depth:2,url:`#health-checks`,title:(0,t.jsx)(t.Fragment,{children:`Health checks`})},{depth:3,url:`#liveness`,title:(0,t.jsx)(t.Fragment,{children:`Liveness`})},{depth:3,url:`#readiness`,title:(0,t.jsx)(t.Fragment,{children:`Readiness`})},{depth:2,url:`#structured-logging`,title:(0,t.jsx)(t.Fragment,{children:`Structured logging`})},{depth:2,url:`#recommended-metrics`,title:(0,t.jsx)(t.Fragment,{children:`Recommended metrics`})},{depth:3,url:`#authentication`,title:(0,t.jsx)(t.Fragment,{children:`Authentication`})},{depth:3,url:`#mfa`,title:(0,t.jsx)(t.Fragment,{children:`MFA`})},{depth:3,url:`#sessions`,title:(0,t.jsx)(t.Fragment,{children:`Sessions`})},{depth:3,url:`#storage`,title:(0,t.jsx)(t.Fragment,{children:`Storage`})},{depth:3,url:`#rate-limiting`,title:(0,t.jsx)(t.Fragment,{children:`Rate limiting`})},{depth:2,url:`#performance-monitoring`,title:(0,t.jsx)(t.Fragment,{children:`Performance monitoring`})},{depth:3,url:`#argon2id`,title:(0,t.jsx)(t.Fragment,{children:`Argon2id`})},{depth:3,url:`#mongodb`,title:(0,t.jsx)(t.Fragment,{children:`MongoDB`})},{depth:3,url:`#cloudflare-d1`,title:(0,t.jsx)(t.Fragment,{children:`Cloudflare D1`})},{depth:3,url:`#session-load`,title:(0,t.jsx)(t.Fragment,{children:`Session load`})},{depth:3,url:`#rate-limiting-1`,title:(0,t.jsx)(t.Fragment,{children:`Rate limiting`})},{depth:2,url:`#fault-injection`,title:(0,t.jsx)(t.Fragment,{children:`Fault injection`})},{depth:2,url:`#alerting`,title:(0,t.jsx)(t.Fragment,{children:`Alerting`})},{depth:2,url:`#operational-dashboards`,title:(0,t.jsx)(t.Fragment,{children:`Operational dashboards`})},{depth:2,url:`#production-acceptance`,title:(0,t.jsx)(t.Fragment,{children:`Production acceptance`})}];function a(e){let n={code:`code`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,span:`span`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:`This document describes the recommended monitoring and operational
requirements for production authentication deployments.`}),`
`,(0,t.jsx)(n.h2,{id:`health-checks`,children:`Health checks`}),`
`,(0,t.jsx)(n.p,{children:`Use two separate health concepts.`}),`
`,(0,t.jsx)(n.h3,{id:`liveness`,children:`Liveness`}),`
`,(0,t.jsx)(n.p,{children:`Liveness determines whether the application process is running.`}),`
`,(0,t.jsx)(n.p,{children:`It should not depend on database availability.`}),`
`,(0,t.jsx)(n.p,{children:`A temporary database outage should not automatically restart every
application instance.`}),`
`,(0,t.jsx)(n.h3,{id:`readiness`,children:`Readiness`}),`
`,(0,t.jsx)(n.p,{children:`Readiness determines whether an instance can safely serve authentication
requests.`}),`
`,(0,t.jsx)(n.p,{children:`Use the server-side createAuthReadinessHandler from
@puzzle-ui/fullstack/auth/server.`}),`
`,(0,t.jsx)(n.p,{children:`Recommended checks:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Database connectivity.`}),`
`,(0,t.jsx)(n.li,{children:`Required authentication collections.`}),`
`,(0,t.jsx)(n.li,{children:`Session storage availability.`}),`
`,(0,t.jsx)(n.li,{children:`Migration readiness.`}),`
`,(0,t.jsx)(n.li,{children:`Shared rate-limit storage availability.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Readiness checks should have bounded execution times.`}),`
`,(0,t.jsx)(n.p,{children:`Do not expose provider exceptions or infrastructure details through
public health endpoints.`}),`
`,(0,t.jsx)(n.h2,{id:`structured-logging`,children:`Structured logging`}),`
`,(0,t.jsx)(n.p,{children:`Use structured JSON logs.`}),`
`,(0,t.jsx)(n.p,{children:`Recommended fields:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`timestamp`}),`
`,(0,t.jsx)(n.li,{children:`level`}),`
`,(0,t.jsx)(n.li,{children:`service`}),`
`,(0,t.jsx)(n.li,{children:`environment`}),`
`,(0,t.jsx)(n.li,{children:`requestId`}),`
`,(0,t.jsx)(n.li,{children:`operation`}),`
`,(0,t.jsx)(n.li,{children:`outcome`}),`
`,(0,t.jsx)(n.li,{children:`durationMs`}),`
`,(0,t.jsx)(n.li,{children:`errorCode`}),`
`,(0,t.jsx)(n.li,{children:`storageAdapter`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Do not include credentials or raw user identifiers.`}),`
`,(0,t.jsx)(n.p,{children:`Never log:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Session tokens.`}),`
`,(0,t.jsx)(n.li,{children:`MFA challenge tokens.`}),`
`,(0,t.jsx)(n.li,{children:`Password reset tokens.`}),`
`,(0,t.jsx)(n.li,{children:`Email verification tokens.`}),`
`,(0,t.jsx)(n.li,{children:`Passwords.`}),`
`,(0,t.jsx)(n.li,{children:`Password hashes.`}),`
`,(0,t.jsx)(n.li,{children:`TOTP secrets.`}),`
`,(0,t.jsx)(n.li,{children:`Recovery codes.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn private material.`}),`
`,(0,t.jsx)(n.li,{children:`Database connection strings.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Authentication failures should use stable error codes rather than exposing
provider-specific exceptions.`}),`
`,(0,t.jsx)(n.h2,{id:`recommended-metrics`,children:`Recommended metrics`}),`
`,(0,t.jsx)(n.h3,{id:`authentication`,children:`Authentication`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`auth_requests_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_request_duration_seconds`}),`
`,(0,t.jsx)(n.li,{children:`auth_sign_in_failures_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_registration_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_password_reset_requests_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_email_verification_total`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`mfa`,children:`MFA`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`auth_mfa_challenges_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_mfa_verifications_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_mfa_failures_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_mfa_recovery_code_usage_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_passkey_verifications_total`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`sessions`,children:`Sessions`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`auth_session_creations_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_session_rotations_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_session_revocations_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_session_validation_failures_total`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`storage`,children:`Storage`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`auth_storage_operations_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_storage_operation_duration_seconds`}),`
`,(0,t.jsx)(n.li,{children:`auth_storage_errors_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_storage_conflicts_total`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`rate-limiting`,children:`Rate limiting`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`auth_rate_limit_allowed_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_rate_limit_rejected_total`}),`
`,(0,t.jsx)(n.li,{children:`auth_rate_limit_storage_errors_total`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Use bounded labels such as:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`operation`}),`
`,(0,t.jsx)(n.li,{children:`adapter`}),`
`,(0,t.jsx)(n.li,{children:`outcome`}),`
`,(0,t.jsx)(n.li,{children:`authentication method`}),`
`,(0,t.jsx)(n.li,{children:`error code`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Never use email addresses, session IDs, tokens, IP addresses or user IDs as
metric labels.`}),`
`,(0,t.jsx)(n.p,{children:`Avoid unbounded cardinality.`}),`
`,(0,t.jsx)(n.h2,{id:`performance-monitoring`,children:`Performance monitoring`}),`
`,(0,t.jsx)(n.p,{children:`Measure at least:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Registration latency.`}),`
`,(0,t.jsx)(n.li,{children:`Password sign-in latency.`}),`
`,(0,t.jsx)(n.li,{children:`MFA verification latency.`}),`
`,(0,t.jsx)(n.li,{children:`Passkey verification latency.`}),`
`,(0,t.jsx)(n.li,{children:`Session validation latency.`}),`
`,(0,t.jsx)(n.li,{children:`Session rotation latency.`}),`
`,(0,t.jsx)(n.li,{children:`Recovery-code verification latency.`}),`
`,(0,t.jsx)(n.li,{children:`Storage query latency.`}),`
`,(0,t.jsx)(n.li,{children:`Rate-limit latency.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Record p50, p95 and p99 latency.`}),`
`,(0,t.jsx)(n.h3,{id:`argon2id`,children:`Argon2id`}),`
`,(0,t.jsx)(n.p,{children:`Benchmark the actual production password hashing provider.`}),`
`,(0,t.jsx)(n.p,{children:`Measure:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`CPU time.`}),`
`,(0,t.jsx)(n.li,{children:`Memory consumption.`}),`
`,(0,t.jsx)(n.li,{children:`Concurrent hash operations.`}),`
`,(0,t.jsx)(n.li,{children:`Authentication latency under load.`}),`
`,(0,t.jsx)(n.li,{children:`Resource exhaustion behavior.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Choose Argon2id parameters according to the production runtime and available
resources.`}),`
`,(0,t.jsx)(n.p,{children:`Do not assume parameters suitable for a Node.js server are automatically
suitable for Cloudflare Workers.`}),`
`,(0,t.jsx)(n.h3,{id:`mongodb`,children:`MongoDB`}),`
`,(0,t.jsx)(n.p,{children:`Monitor:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Connection pool utilization.`}),`
`,(0,t.jsx)(n.li,{children:`Connection wait time.`}),`
`,(0,t.jsx)(n.li,{children:`Transaction duration.`}),`
`,(0,t.jsx)(n.li,{children:`Transaction failures.`}),`
`,(0,t.jsx)(n.li,{children:`Query latency.`}),`
`,(0,t.jsx)(n.li,{children:`Conditional-write conflicts.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`cloudflare-d1`,children:`Cloudflare D1`}),`
`,(0,t.jsx)(n.p,{children:`Monitor:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Query latency.`}),`
`,(0,t.jsx)(n.li,{children:`Transaction duration.`}),`
`,(0,t.jsx)(n.li,{children:`Database errors.`}),`
`,(0,t.jsx)(n.li,{children:`Worker CPU time.`}),`
`,(0,t.jsx)(n.li,{children:`Worker memory usage.`}),`
`,(0,t.jsx)(n.li,{children:`D1 limits and throttling.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`session-load`,children:`Session load`}),`
`,(0,t.jsx)(n.p,{children:`Test:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Concurrent session creation.`}),`
`,(0,t.jsx)(n.li,{children:`Session validation under load.`}),`
`,(0,t.jsx)(n.li,{children:`Concurrent rotation.`}),`
`,(0,t.jsx)(n.li,{children:`Revocation of multiple sessions.`}),`
`,(0,t.jsx)(n.li,{children:`Expiration cleanup.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{id:`rate-limiting-1`,children:`Rate limiting`}),`
`,(0,t.jsx)(n.p,{children:`Run the local concurrency benchmark:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{children:`bun run benchmark:auth`})})})})}),`
`,(0,t.jsx)(n.p,{children:`This benchmark uses MemoryStorage and is intended for regression comparisons.`}),`
`,(0,t.jsx)(n.p,{children:`Production capacity measurements must use the actual MongoDB or D1 adapter.`}),`
`,(0,t.jsx)(n.h2,{id:`fault-injection`,children:`Fault injection`}),`
`,(0,t.jsx)(n.p,{children:`Production-readiness testing should include:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Database connection loss.`}),`
`,(0,t.jsx)(n.li,{children:`Database write failures.`}),`
`,(0,t.jsx)(n.li,{children:`Conditional-write conflicts.`}),`
`,(0,t.jsx)(n.li,{children:`Transaction failures.`}),`
`,(0,t.jsx)(n.li,{children:`Rate-limit provider failure.`}),`
`,(0,t.jsx)(n.li,{children:`Email provider failure.`}),`
`,(0,t.jsx)(n.li,{children:`Session provider failure.`}),`
`,(0,t.jsx)(n.li,{children:`WebAuthn provider errors.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Verify that:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Authentication fails closed when required security dependencies fail.`}),`
`,(0,t.jsx)(n.li,{children:`Failed writes do not partially commit security-critical operations.`}),`
`,(0,t.jsx)(n.li,{children:`Consumed challenges cannot be restored.`}),`
`,(0,t.jsx)(n.li,{children:`Recovery codes cannot be reused.`}),`
`,(0,t.jsx)(n.li,{children:`Failed initialization can be retried.`}),`
`,(0,t.jsx)(n.li,{children:`Existing sessions are not incorrectly authorized after security failures.`}),`
`]}),`
`,(0,t.jsx)(n.h2,{id:`alerting`,children:`Alerting`}),`
`,(0,t.jsx)(n.p,{children:`Recommended alerts:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Elevated authentication failure rate.`}),`
`,(0,t.jsx)(n.li,{children:`Elevated HTTP 5xx rate on auth routes.`}),`
`,(0,t.jsx)(n.li,{children:`Database connection failures.`}),`
`,(0,t.jsx)(n.li,{children:`Increased transaction conflicts.`}),`
`,(0,t.jsx)(n.li,{children:`Rate-limit storage failures.`}),`
`,(0,t.jsx)(n.li,{children:`Unusual recovery-code usage.`}),`
`,(0,t.jsx)(n.li,{children:`Repeated WebAuthn verification failures.`}),`
`,(0,t.jsx)(n.li,{children:`Unexpected session revocation spikes.`}),`
`,(0,t.jsx)(n.li,{children:`Increased p95 authentication latency.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Alerts must not contain secrets or personal authentication data.`}),`
`,(0,t.jsx)(n.h2,{id:`operational-dashboards`,children:`Operational dashboards`}),`
`,(0,t.jsx)(n.p,{children:`Maintain separate dashboards for:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsx)(n.li,{children:`Authentication availability.`}),`
`,(0,t.jsx)(n.li,{children:`Authentication latency.`}),`
`,(0,t.jsx)(n.li,{children:`MFA security events.`}),`
`,(0,t.jsx)(n.li,{children:`Session activity.`}),`
`,(0,t.jsx)(n.li,{children:`Database performance.`}),`
`,(0,t.jsx)(n.li,{children:`Rate-limit behavior.`}),`
`,(0,t.jsx)(n.li,{children:`Infrastructure resource usage.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Use the same service and environment identifiers across logs, traces and
metrics.`}),`
`,(0,t.jsx)(n.h2,{id:`production-acceptance`,children:`Production acceptance`}),`
`,(0,t.jsx)(n.p,{children:`Before production approval:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Verify liveness and readiness endpoints.`}),`
`,(0,t.jsx)(n.li,{children:`Verify that readiness becomes unavailable when storage fails.`}),`
`,(0,t.jsx)(n.li,{children:`Verify that liveness remains independent of storage.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm that metrics have bounded cardinality.`}),`
`,(0,t.jsx)(n.li,{children:`Confirm that sensitive information is absent from logs.`}),`
`,(0,t.jsx)(n.li,{children:`Record performance baselines for the actual production adapters.`}),`
`,(0,t.jsx)(n.li,{children:`Test recovery after transient provider failures.`}),`
`]})]})}function o(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}export{o as default,n as frontmatter,r as structuredData,i as toc};