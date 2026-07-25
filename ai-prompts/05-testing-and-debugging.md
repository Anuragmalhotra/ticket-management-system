# Prompt Pack: Testing and Debugging

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Testing & Debugging |
| **Historical logs** | [testing.md](./testing.md), [debugging.md](./debugging.md) |

## Purpose

Prove API correctness with Jest/Supertest (especially the status state machine), add high-value coverage, and systematically fix environment/test failures.

## Canonical Prompt — State Machine Integration Tests

```
Role: QA-minded backend engineer.

Objective:
Create Jest + Supertest integration tests focused on the ticket status state machine.

Verify:
- Valid transitions succeed (HTTP + DB)
- Invalid transitions fail with 409 and INVALID_TRANSITION (or equivalent)
- Error messages are human-readable
- Soft-deleted / missing tickets behave correctly where relevant

Setup:
- mongodb-memory-server
- Seed known tickets before each test
- Shared test environment helper

Constraints:
- Do not mock the service layer away (true HTTP → DB path)
- Prefer assertions on status code, error code, message, and persisted status

Acceptance criteria:
- Mandatory assessment tier covered
- Suite is deterministic and re-runnable via `npm test`
```

## Canonical Prompt — Expanded Coverage

```
Add additional tests with best coverage-to-effort ratio:
- Ticket CRUD lifecycle
- Validation failures
- Comments
- Search + status filter + pagination
- Backend error mapping (404, cast, soft-delete)
- Frontend Vitest tests for utilities/small components (validation, apiError, retry, debounce, badges)

Out of scope: Cypress/Playwright E2E, snapshot-heavy UI, 100% coverage chase.
```

## Canonical Prompt — Debug a Failing Suite

```
Role: Debugger.

Context: [paste failing test output / error]

Objective: Identify root cause, propose the smallest fix, and verify by re-running the suite.

Constraints:
- Prefer environment/test-helper fixes over weakening product behavior
- Document the issue in debugging notes if non-obvious
- Do not skip tests to “make CI green”

Output: root cause, fix, files touched, verification command.
```

## AI Response Summary

Built state-machine and broader integration suites plus focused frontend unit tests (187 total). Fixed missing text indexes via `Ticket.syncIndexes()`, sandbox/permission constraints for memory server, and ESM Jest invocation via `npm test`.

## Refinements

### Iteration 1

```
Search tests fail with “text index required for $text query”.
Diagnose and fix the test environment without switching to regex-only search.
```

### Iteration 2

```
Document how to run backend tests (npm test, permissions, timeouts) in README known limitations.
```

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `$text` search | Better relevance; fix indexes in tests |
| Limit frontend tests to utils/components | Highest ROI |
| Defer browser E2E | Scope/time |

## Outcome

- Logs: [testing.md](./testing.md), [debugging.md](./debugging.md)
- Artifacts: [`../test-strategy.md`](../test-strategy.md), [`../test-results.md`](../test-results.md), [`../debugging-notes.md`](../debugging-notes.md)
