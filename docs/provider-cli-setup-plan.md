# Provider CLI Setup Plan

This plan is ready for when credentials are available. It does not require or contain secrets.

## Current Position

Foobow can continue local product and API work with Docker Postgres and placeholder public mobile keys. Real provider-backed flows should wait until the required account inputs are available and local Node is standardized.

## Required Inputs

- Supabase: access token, organization, region, database password, project names.
- Clerk: app or account access, publishable key, secret key, issuer URL, redirect/deep-link scheme.
- Mapbox: public token, style decision, mobile app identifiers for later restrictions.
- Stripe: optional test-mode account, products/prices, webhook endpoint decision.

## Setup Order

1. Standardize Node: install/use Node `20.19.4+`, or run Prisma commands through the bundled Node 24 runtime.
2. Verify local baseline: `npm test`, `npm run test:env`, `npm run test:mobile`.
3. Supabase dev project: create/link project, set `DATABASE_URL`, apply SQL migrations and seed data.
4. Clerk dev app: configure email/Google/Apple login choices, issuer URL, and mobile redirect scheme.
5. Mapbox dev token: create a public token, start with a calm standard style, add restrictions later.
6. Stripe test mode: defer until donation checkout is implemented; keep symbolic karma separate from payment.
7. Provider-backed PA: run authenticated mobile-to-API-to-database smoke tests before expanding browser PA.

## CLI Notes

Use dashboards when a CLI needs interactive billing, organization, or legal steps. Use CLI only for repeatable project setup and checks after the account exists.

Recommended future commands, after credentials are available:

```text
supabase projects list
supabase link --project-ref <project-ref>
supabase db push
```

Clerk and Mapbox can start from dashboards for MVP. Stripe CLI becomes useful once webhook verification exists.

## QA Gate

Provider-backed flows are not accepted until:

- Authenticated user can sign in through Clerk.
- API can verify the session server-side.
- Deed completion persists to Supabase/Postgres.
- Map surface loads with the Mapbox token.
- Donation copy still says payment does not buy luck, virtue, or guaranteed karma.
- Browser PA and mobile typecheck pass after provider-backed config is present.
