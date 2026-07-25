# AI Usage — Testing Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Integration tests, unit tests, frontend component tests

This document records AI prompts used during testing, including what was accepted, modified, or rejected.

---

## Prompt 1: State Machine Integration Tests

### Original Prompt

```
Role: Senior backend engineer writing mandatory Jest/Supertest integration tests for a MERN ticket system.

Context:
Support Ticket Management System assessment. Backend uses Express + Mongoose + MongoDB.
The status state machine is the assessment’s mandatory test tier and lives in a pure domain module,
enforced by the ticket service on status-update endpoints.
Seed users/tickets/comments already exist for known starting statuses.

Objective:
Create integration tests that prove valid transitions succeed and invalid transitions fail end-to-end
(HTTP → service → DB), not just unit-level domain checks.

Constraints:
- Use Jest + Supertest against the real Express app
- Use an isolated in-memory MongoDB (mongodb-memory-server), not a shared/dev database
- Seed the test database before each test (or suite) so starting states are deterministic
- Do NOT mock the service layer or Mongoose models (defeats integration purpose)
- Assert both HTTP responses and persisted DB state

Verify (minimum):
1. Valid transitions succeed (correct HTTP status + updated ticket status in DB)
2. Invalid transitions fail (correct HTTP status + stable error code/message)
3. Database updates correctly after each successful transition
4. Error messages are human-readable (not opaque stack dumps)
5. Coverage spans transitions reachable from seed data

Assumptions:
- Seed data provides tickets in multiple statuses for valid/invalid cases
- Soft-deleted tickets must not be treated as successfully transitionable
- Error envelope follows project convention: { error: { code, message, details } }

Acceptance criteria:
- Dedicated file under server/tests/integration/ for state-machine cases
- Shared test environment helper used for connect/seed/teardown
- Assertions cover status codes, error codes, messages, and DB state
- Suite is stable under single-worker Jest (memory server)

Output format:
- Integration test file(s) + any minimal shared helper changes
- Brief summary of cases added (valid vs invalid)
```

### AI Summary

The AI created `tests/integration/stateMachine.integration.test.js` with a shared test environment helper (`connectIntegrationEnvironment`, `seedIntegrationDatabase`), 19 test cases covering all valid transitions from seed data, invalid transitions returning 409 with `INVALID_TRANSITION`, DB state verification after each transition, and human-readable error messages.

### Accepted

- `mongodb-memory-server` for isolated test database
- `testEnvironment.js` helper shared across integration suites
- Seed data loaded before each test (`beforeEach`)
- Assertions on HTTP status, error code, error message, and DB state
- `maxWorkers: 1` in Jest config (memory server stability)

### Modified

- `Ticket.syncIndexes()` added to test environment setup (see debugging.md) after search tests revealed index gap
- Test timeout increased to 30s for memory server startup

### Rejected

- Hitting a real MongoDB instance in CI
- Mocking the service layer in integration tests (defeats purpose)
- Skipping DB verification (HTTP-only assertions insufficient)

### Reason

State machine integration tests are the assessment's mandatory test tier. Seeded data provides known starting states; DB verification confirms persistence, not just HTTP responses.

---

## Prompt 2: Additional Test Coverage

### Original Prompt

```
Role: Test engineer expanding coverage beyond the mandatory state-machine suite.

Context:
State-machine integration tests already exist and pass.
We still need broader API and frontend confidence for CRUD, validation, comments, search,
backend error mapping, and high-value UI utilities/components.

Objective:
Generate additional automated tests that close the highest-value coverage gaps without
building a full browser E2E suite.

Constraints:
- Prefer backend integration tests (Jest + Supertest + memory MongoDB) for API correctness
- Keep frontend tests focused on pure utilities and small isolated components (Vitest + Testing Library)
- Do NOT introduce Cypress/Playwright or snapshot-heavy UI suites
- Do NOT target 100% line coverage as a goal
- Reuse existing seed/test helpers where possible
- Follow existing test file naming and folder conventions

Deliverables:
1. Backend CRUD integration tests (ticket lifecycle with seed data)
2. Validation integration tests (ticket + comment field rules)
3. Comment integration tests (seed-based threads)
4. Search/filter integration tests (keyword, status, combined filters, pagination)
5. Backend error-path tests (404, cast errors, soft-delete 404)
6. Useful frontend tests (validation utils, API error helpers, retry, debounce, StatusBadge/StatusActions, ErrorAlert)
7. Users endpoint coverage if already implemented

Assumptions:
- mongodb-memory-server + shared testEnvironment helper remain the integration baseline
- Text indexes / syncIndexes may be required for $text search tests (fix helper if needed)
- Frontend page-level E2E is out of scope for this pass

Acceptance criteria:
- New suites are green under npm test (server) and npm test (client)
- Search tests assert meaningful filter combinations, not only happy-path keyword
- Error tests assert stable error codes from the shared envelope
- Frontend tests avoid brittle full-page mounts

Output format:
- New/updated test files only (plus minimal helper/config fixes if required)
- Short inventory of suites and what each covers
```

### AI Summary

The AI added six backend integration test files (CRUD, search, validation, comments, backend errors, users), expanded existing suites, set up Vitest + Testing Library in the client, and created 14 frontend tests for validation utils, API error helpers, retry logic, debounce hook, StatusBadge, StatusActions, and ErrorAlert components.

### Accepted

**Backend integration tests:**

| File | Coverage |
|------|----------|
| `crud.integration.test.js` | Full ticket lifecycle with seed data |
| `search.integration.test.js` | Keyword, status, combined filters, pagination |
| `validation.integration.test.js` | Field validation for tickets and comments |
| `comments.seed.integration.test.js` | Seed-based comment threads |
| `backendErrors.integration.test.js` | 404, cast errors, soft-delete 404 |
| `users.integration.test.js` | User list, role filter, get by ID |

**Backend unit tests:** `statusMachine`, `ticketQuery`, `errors`, `models`

**Frontend tests (Vitest):** `validation.test.js`, `apiError.test.js`, `retry.test.js`, `useDebounce.test.js`, `StatusBadge.test.jsx`, `ErrorAlert.test.jsx`

### Modified

- Frontend test scope limited to utilities and small components (not full page E2E)
- `StatusBadge.test.jsx` also covers `StatusActions` (combined file)
- Search integration tests required `Ticket.syncIndexes()` fix in test helper

### Rejected

- Cypress/Playwright E2E tests (time/scope constraint)
- Testing every React page component (diminishing returns)
- Snapshot testing for UI components
- 100% code coverage target

### Reason

Integration tests provide highest value for API correctness. Frontend tests focus on pure utilities and isolated components where logic is non-trivial (retry, debounce, validation). Page-level tests would mostly duplicate integration coverage.

---

## Test Results (AI-Assisted)

| Suite | Tests | Status |
|-------|-------|--------|
| Backend unit | 4 files | All passing |
| Backend integration | 11 files | 173 tests passing |
| Frontend (Vitest) | 6 files | 14 tests passing |
| **Total** | **187** | **All passing** |

### Commands

```bash
cd server && npm test        # Jest + Supertest (requires full permissions for memory server)
cd client && npm test        # Vitest
```

---

## Testing Phase Summary

| Metric | Value |
|--------|-------|
| Prompts logged | 2 |
| Backend tests | 173 |
| Frontend tests | 14 |
| Mandatory tier | State machine integration — complete |
| Test helper | `server/tests/helpers/testEnvironment.js` |

## Related Artifacts

- [`../test-strategy.md`](../test-strategy.md)
- [`../test-results.md`](../test-results.md)
- [`../server/tests/`](../server/tests/)
- [`../client/src/**/*.test.*`](../client/src/)
- [`./05-testing-and-debugging.md`](./05-testing-and-debugging.md)
- [`./debugging.md`](./debugging.md)
