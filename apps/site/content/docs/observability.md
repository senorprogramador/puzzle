---
title: Puzzle Authentication Observability
description: Monitoring, metrics, health checks, and operational requirements for production authentication deployments.
---

This document describes the recommended monitoring and operational
requirements for production authentication deployments.

## Health checks

Use two separate health concepts.

### Liveness

Liveness determines whether the application process is running.

It should not depend on database availability.

A temporary database outage should not automatically restart every
application instance.

### Readiness

Readiness determines whether an instance can safely serve authentication
requests.

Use the server-side createAuthReadinessHandler from
@puzzle-ui/fullstack/auth/server.

Recommended checks:

- Database connectivity.
- Required authentication collections.
- Session storage availability.
- Migration readiness.
- Shared rate-limit storage availability.

Readiness checks should have bounded execution times.

Do not expose provider exceptions or infrastructure details through
public health endpoints.

## Structured logging

Use structured JSON logs.

Recommended fields:

- timestamp
- level
- service
- environment
- requestId
- operation
- outcome
- durationMs
- errorCode
- storageAdapter

Do not include credentials or raw user identifiers.

Never log:

- Session tokens.
- MFA challenge tokens.
- Password reset tokens.
- Email verification tokens.
- Passwords.
- Password hashes.
- TOTP secrets.
- Recovery codes.
- WebAuthn private material.
- Database connection strings.

Authentication failures should use stable error codes rather than exposing
provider-specific exceptions.

## Recommended metrics

### Authentication

- auth_requests_total
- auth_request_duration_seconds
- auth_sign_in_failures_total
- auth_registration_total
- auth_password_reset_requests_total
- auth_email_verification_total

### MFA

- auth_mfa_challenges_total
- auth_mfa_verifications_total
- auth_mfa_failures_total
- auth_mfa_recovery_code_usage_total
- auth_passkey_verifications_total

### Sessions

- auth_session_creations_total
- auth_session_rotations_total
- auth_session_revocations_total
- auth_session_validation_failures_total

### Storage

- auth_storage_operations_total
- auth_storage_operation_duration_seconds
- auth_storage_errors_total
- auth_storage_conflicts_total

### Rate limiting

- auth_rate_limit_allowed_total
- auth_rate_limit_rejected_total
- auth_rate_limit_storage_errors_total

Use bounded labels such as:

- operation
- adapter
- outcome
- authentication method
- error code

Never use email addresses, session IDs, tokens, IP addresses or user IDs as
metric labels.

Avoid unbounded cardinality.

## Performance monitoring

Measure at least:

- Registration latency.
- Password sign-in latency.
- MFA verification latency.
- Passkey verification latency.
- Session validation latency.
- Session rotation latency.
- Recovery-code verification latency.
- Storage query latency.
- Rate-limit latency.

Record p50, p95 and p99 latency.

### Argon2id

Benchmark the actual production password hashing provider.

Measure:

- CPU time.
- Memory consumption.
- Concurrent hash operations.
- Authentication latency under load.
- Resource exhaustion behavior.

Choose Argon2id parameters according to the production runtime and available
resources.

Do not assume parameters suitable for a Node.js server are automatically
suitable for Cloudflare Workers.

### MongoDB

Monitor:

- Connection pool utilization.
- Connection wait time.
- Transaction duration.
- Transaction failures.
- Query latency.
- Conditional-write conflicts.

### Cloudflare D1

Monitor:

- Query latency.
- Transaction duration.
- Database errors.
- Worker CPU time.
- Worker memory usage.
- D1 limits and throttling.

### Session load

Test:

- Concurrent session creation.
- Session validation under load.
- Concurrent rotation.
- Revocation of multiple sessions.
- Expiration cleanup.

### Rate limiting

Run the local concurrency benchmark:

    bun run benchmark:auth

This benchmark uses MemoryStorage and is intended for regression comparisons.

Production capacity measurements must use the actual MongoDB or D1 adapter.

## Fault injection

Production-readiness testing should include:

- Database connection loss.
- Database write failures.
- Conditional-write conflicts.
- Transaction failures.
- Rate-limit provider failure.
- Email provider failure.
- Session provider failure.
- WebAuthn provider errors.

Verify that:

- Authentication fails closed when required security dependencies fail.
- Failed writes do not partially commit security-critical operations.
- Consumed challenges cannot be restored.
- Recovery codes cannot be reused.
- Failed initialization can be retried.
- Existing sessions are not incorrectly authorized after security failures.

## Alerting

Recommended alerts:

- Elevated authentication failure rate.
- Elevated HTTP 5xx rate on auth routes.
- Database connection failures.
- Increased transaction conflicts.
- Rate-limit storage failures.
- Unusual recovery-code usage.
- Repeated WebAuthn verification failures.
- Unexpected session revocation spikes.
- Increased p95 authentication latency.

Alerts must not contain secrets or personal authentication data.

## Operational dashboards

Maintain separate dashboards for:

1. Authentication availability.
2. Authentication latency.
3. MFA security events.
4. Session activity.
5. Database performance.
6. Rate-limit behavior.
7. Infrastructure resource usage.

Use the same service and environment identifiers across logs, traces and
metrics.

## Production acceptance

Before production approval:

- Verify liveness and readiness endpoints.
- Verify that readiness becomes unavailable when storage fails.
- Verify that liveness remains independent of storage.
- Confirm that metrics have bounded cardinality.
- Confirm that sensitive information is absent from logs.
- Record performance baselines for the actual production adapters.
- Test recovery after transient provider failures.
