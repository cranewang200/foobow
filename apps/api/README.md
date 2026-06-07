# Foobow API Runtime

This is a dependency-light executable scaffold for the Foobow API contract. It uses Node's built-in HTTP server and test runner so the first backend slice can validate product behavior without locking the production framework.

## Run

```text
npm --prefix apps/api start
```

Default local URL:

```text
http://127.0.0.1:8787
```

## Test

```text
npm --prefix apps/api test
```

## Scope

- In-memory sample data only.
- No production authentication, persistence, payment provider, moderation queue, or rate limiter yet.
- Public response shape follows `docs/api-interface.md` and `docs/openapi.json`.
- Donation creation enforces verified campaigns and idempotency-key behavior so payment safety rules are testable early.
