# ADR 001: Mobile App Stack

## Status

Accepted for MVP scaffold.

## Decision

Use Expo + React Native + TypeScript for the first production mobile app scaffold.

## Rationale

- Foobow is mobile-first and needs iOS/Android reach without duplicating native code.
- React Native uses native platform UI primitives while keeping a shared TypeScript codebase.
- Expo provides a faster MVP path, local development tooling, web preview, and an established path to hosted/mobile CI through EAS Build.
- Expo Router provides file-based routing for React Native and web, which matches the app's tab-based product shape.
- The current static prototype can be ported into reusable TypeScript data and screen components without discarding product work.

## Alternatives Considered

- Static web-only prototype: useful for early validation, but not enough for the requested mobile app direction.
- Native iOS/Android separately: stronger platform control, but too much duplicate work for MVP.
- Flutter: viable cross-platform option, but the repo already uses JavaScript/TypeScript tests and prototype logic.

## Consequences

- The app scaffold should live under `apps/mobile`.
- Root CI should keep fast docs/prototype checks and add mobile type/build checks as the app matures.
- The static prototype remains as a reference artifact until the Expo app reaches parity.
- Backend implementation remains stack-neutral for now, guided by the database/API docs.

