# AI Usage — Debugging Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Test failures, environment issues, integration debugging

This document records issues discovered and resolved during AI-assisted development, framed as debugging prompts and outcomes. Several issues were originally implicit (surfaced during test runs); they are restated below as explicit engineer-style debugging prompts while preserving accurate outcomes.

---

## Issue 1: MongoDB Text Index Missing in Tests

### Original Prompt

```
Role: Backend engineer debugging failing search integration tests.

Context:
(Originally implicit — surfaced when running search integration tests after Prompt 2 in testing.md.)
We just added search/filter integration coverage. Three tests fail with HTTP 500.
Server logs / Mongo errors mention text index requirements for $text queries.
Ticket schema defines a text index, but tests use mongodb-memory-server with seed/reset helpers.

Objective:
Find the root cause of the 500s on search endpoints in the integration environment and apply the
smallest reliable fix so search tests pass without weakening search behavior.

Constraints:
- Prefer fixing the test environment / index lifecycle over changing production search semantics
- Do NOT switch search to regex-only just to make tests pass
- Do NOT skip or delete the failing search tests
- Keep using mongodb-memory-server (no move to a shared real MongoDB for CI)

Investigate:
1. Whether schema indexes are actually present in the ephemeral DB before $text queries run
2. Whether seed/deleteMany clears documents but leaves indexes missing on cold start
3. Whether Ticket.syncIndexes() (or equivalent) belongs in the shared test helper

Assumptions:
- Application search correctly uses MongoDB $text when a keyword is provided
- Schema index definitions are correct; the failure is environmental/timing related

Acceptance criteria:
- Search integration tests pass
- Full backend suite remains green (173/173 after fix)
- Fix is documented if it is a known test-environment requirement

Output format:
- Root cause explanation
- Minimal code/config change
- Confirmation of re-run results
```

### AI Summary

Three search integration tests failed with `500 Internal Server Error`. Root cause: `MongoServerError: text index required for $text query`. The in-memory MongoDB instance did not have the text index created before search queries ran, even though indexes were defined on the Mongoose schema.

### Accepted

- Fix: add `await Ticket.syncIndexes()` in `tests/helpers/testEnvironment.js` after `connectDB()`
- Re-run full suite to confirm 173/173 passing

### Modified

- Test environment helper now syncs indexes on every integration suite connect
- Documented in README under known limitations (text index requirement)

### Rejected

- Changing search implementation to regex-only (loses text relevance scoring)
- Skipping search integration tests
- Using real MongoDB for tests instead of memory server

### Reason

`syncIndexes()` ensures schema-defined indexes exist in the ephemeral test database. `deleteMany` in seed does not drop indexes, but memory server cold starts may not auto-build them before first query.

---

## Issue 2: MongoMemoryServer Sandbox Failure

### Original Prompt

```
Role: Developer debugging Jest hangs/failures in Cursor’s sandboxed terminal.

Context:
(Originally implicit — Jest test run in sandboxed terminal.)
Running npm test for backend integration suites. mongodb-memory-server appears to fail during
download/start. Tests hang or fail in beforeAll connect. Sandbox restricts network/syscalls.

Objective:
Determine whether this is an application bug or an environment/sandbox limitation, and document
the correct way to run the suite locally/in Cursor.

Constraints:
- Do NOT remove integration tests to “fix” the hang
- Do NOT replace integration tests with fully mocked Mongoose models
- Prefer documenting permission requirements over weakening the test pyramid

Investigate:
1. Whether memory-server binary download/start requires unrestricted permissions
2. Whether Jest worker count / timeout contributes to flaky startup
3. What README note assessors/developers need

Assumptions:
- The suite works when the process can spawn binaries and use network for first-time download
- Application code is not the primary fault if connect never completes

Acceptance criteria:
- Clear runbook: how to execute tests successfully in this environment
- Any Jest stability knobs (workers/timeout) justified and minimal
- Outcome distinguishes environment limitation vs app bug

Output format:
- Diagnosis + recommended command/permissions
- Optional Jest config tweaks
- Short README note if needed
```

### AI Summary

`mongodb-memory-server` failed to download/start inside the Cursor sandbox due to restricted syscalls and network. Tests appeared to fail or hang on `beforeAll` connect.

### Accepted

- Run tests with `required_permissions: ["all"]` to disable sandbox
- Document in README that integration tests need unrestricted permissions

### Modified

- Jest config: `maxWorkers: 1`, `testTimeout: 30000` for stability

### Rejected

- Removing integration tests
- Switching to mocked Mongoose models for all integration tests

### Reason

Memory server needs process spawning and binary download outside sandbox constraints. This is an environment limitation, not an application bug.

---

## Issue 3: Duplicate Ticket CRUD Prompt

### Original Prompt

```
Role: Careful implementer avoiding accidental duplication from repeated AI prompts.

Context:
The prompt “Implement complete Ticket CRUD” was sent twice in succession (duplicate user submit /
retry). Ticket routes, controllers, services, and validators may already exist from the first run.

Objective:
Handle the duplicate request safely: verify what already exists and only fill genuine gaps.
Do not create parallel CRUD implementations.

Constraints:
- Do NOT re-implement CRUD from scratch
- Do NOT add duplicate routes, service methods, or models
- Prefer an idempotent audit: “already present” vs “missing pieces”

Deliverables:
1. Inventory of existing ticket CRUD endpoints and layers
2. Confirmation that no duplicate files/methods were created
3. Only minimal gap-fills if something is truly incomplete

Assumptions:
- First CRUD implementation was largely complete
- Duplicate prompts are a common workflow hazard with AI assistants

Acceptance criteria:
- No merge-conflict-prone duplicate code
- Response states clearly that CRUD already exists (if true)
- Diff remains empty or minimal

Output format:
- Short verification report + any tiny gap fixes only
```

### AI Summary

The same CRUD implementation prompt was submitted twice. The AI verified existing implementation rather than duplicating code.

### Accepted

- Idempotent response: confirmed CRUD already implemented
- No duplicate service methods or routes created

### Modified

- None required

### Rejected

- Re-implementing CRUD from scratch (would cause merge conflicts)

### Reason

Duplicate prompts are a common AI workflow issue. Verifying existing code before regenerating prevents unnecessary diffs.

---

## Issue 4: Direct `npx jest` vs `npm test`

### Original Prompt

```
Role: Backend engineer debugging a single-file Jest run failure.

Context:
(Originally implicit — running a single test file with npx jest.)
Command used: npx jest tests/integration/search.integration.test.js
Failure: SyntaxError: Cannot use import statement outside a module.
npm test works for the full suite. package.json likely sets node --experimental-vm-modules.

Objective:
Explain why direct npx jest fails and document the correct way to run a single test file
without converting the project module system.

Constraints:
- Do NOT convert the project to CommonJS solely to make npx jest work
- Prefer using existing npm scripts / flags
- Keep ESM + Jest experimental VM modules setup intact

Investigate:
1. Difference between npm test script and bare npx jest
2. Correct invocation for --testPathPattern / single-file filtering
3. Whether any docs need updating

Assumptions:
- Server package is ESM; Jest requires the experimental VM modules flag from scripts

Acceptance criteria:
- Working single-file command documented
- No module-system rewrite
- Root cause clearly attributed to bypassing npm scripts

Output format:
- Root cause + recommended commands only
```

### AI Summary

Running `npx jest tests/integration/search.integration.test.js` directly failed with `SyntaxError: Cannot use import statement outside a module` because it bypassed the `npm test` script which uses `node --experimental-vm-modules`.

### Accepted

- Always use `npm test` or `npm run test:watch` for backend tests
- Use `npm test -- --testPathPattern=search` for single-file runs

### Modified

- None to application code

### Rejected

- Converting project to CommonJS

### Reason

ES module Jest configuration requires the experimental VM modules flag defined in `package.json` scripts.

---

## Issue 5: Logger Noise in Test Output

### Original Prompt

```
Role: Engineer evaluating noisy console output during integration test runs.

Context:
(Originally implicit — observed during test runs.)
Integration tests print verbose [INFO] / [WARN] lines from request logger and error handler,
cluttering Jest output even when assertions pass. NODE_ENV handling may already suppress debug
in non-development environments.

Objective:
Decide whether to mute logging in test env, keep it for failure debugging, or adjust levels —
without hiding useful failure context.

Constraints:
- Do NOT disable all logging if it reduces ability to debug failing integration cases
- Prefer environment-based level control over ad-hoc console silencing in every test
- Tests must remain green; this is about signal-to-noise, not correctness

Investigate:
1. Current logger behavior under NODE_ENV=test
2. Whether testEnvironment already sets NODE_ENV=test
3. Trade-off: quiet CI vs rich local failure diagnostics

Assumptions:
- Logger output is informational; failures are still assertion-driven
- CI can separate streams if needed later

Acceptance criteria:
- Explicit decision recorded (mute vs keep)
- NODE_ENV=test set in test helper if not already
- No change that masks real errors

Output format:
- Recommendation + any minimal env/logger tweak (or “defer mute”)
```

### AI Summary

Integration tests produced verbose `[INFO]` and `[WARN]` console output from the request logger and error handler, cluttering test results.

### Accepted

- Logger suppresses debug in non-development environments
- Test `NODE_ENV=test` set in test environment helper
- Console output is informational only — tests still pass

### Modified

- Considered muting logger in test env (deferred — output helps debug failures)

### Rejected

- Disabling all logging in tests (reduces debuggability)

### Reason

Request logs aid debugging integration test failures. Noise is acceptable for local development; CI can pipe stderr separately.

---

## Debugging Tools Used

| Tool | Purpose |
|------|---------|
| Jest verbose output | Identify failing test file and assertion |
| Supertest response bodies | Inspect error envelopes and status codes |
| MongoDB error messages | Diagnose missing index (`$text query`) |
| `rg` / grep on codebase | Trace search filter construction |
| Terminal permission flags | Resolve memory server sandbox issues |

---

## Debugging Phase Summary

| Metric | Value |
|--------|-------|
| Issues logged | 5 |
| Code fixes | 1 (`syncIndexes` in test helper) |
| Config fixes | 2 (Jest timeout, npm test script) |
| Process fixes | 2 (sandbox permissions, duplicate prompt) |

## Related Artifacts

- [`../debugging-notes.md`](../debugging-notes.md)
- [`../server/tests/helpers/testEnvironment.js`](../server/tests/helpers/testEnvironment.js)
- [`./05-testing-and-debugging.md`](./05-testing-and-debugging.md)
- [`./testing.md`](./testing.md)
