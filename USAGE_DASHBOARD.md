# Foobow AI Team Usage Dashboard

Last updated: 2026-06-07 15:59 America/Toronto

## Current Load

| Agent | 5h Window Used | Weekly Used | Requests Today | Est. Tokens In/Out | Load % | Last Task |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Codex 5.5 | ~8 min | Unknown | 4 | ~18k in / ~4k out | 8% | Orchestrated dashboard setup, CLI availability checks, Claude/Gemini assignment, and planning integration |
| Claude 4.8 | ~1 min attempted | Unknown | 1 failed | ~2k in / 0 out | 2% | Planning request attempted; failed with `API Error: Unable to connect to API (FailedToOpenSocket)` |
| Gemini 3.5 | ~3 min | Unknown | 2 | ~5k in / ~1.5k out | 6% | Acknowledged executor readiness and produced full project plan + sprint backlog + Kanban |

## Assignment Rules

- Claude 4.8: deep planning, architecture, documentation. Use only while under 60% 5h load.
- Gemini 3.5: high-volume execution, implementation support, creative alternatives. Prefer while under 70% load.
- Codex 5.5: orchestration, diff review, integration, tests, DevOps, final decisions.
- Reassign future tasks away from any agent at or above 80% 5h load.

## Current Repo State

- Local branch: `main`.
- Remote: `origin/main`.
- Status before dashboard update: clean working tree, local `main` was ahead of `origin/main` by 1 commit.
- Pending local commit: `b14d6d9 Record PA audit findings`.
- Current top project concern: real PA audit found mobile prototype layout gaps; remote CI also needs follow-up for mobile dependency resolution.

## Last Sync Notes

- Dashboard initialized from zero counters as requested.
- `claude` and `gemini` CLIs are available on PATH.
- Claude planning assignment failed due API socket connectivity, so planning was reassigned to Gemini under the smart load-balancing rule.
- Gemini plan prioritizes CI dependency stabilization, PA layout fixes, Node/Prisma unblock, mobile component extraction, and persistent NestJS routes.
