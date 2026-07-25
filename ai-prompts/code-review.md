# AI Usage — Code Review Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Self-review during and after implementation

This document records AI-assisted code review observations — strengths identified, issues found, and decisions on what to fix vs defer. Several reviews were originally implicit (continuous self-checks during implementation); they are restated below as explicit high-quality review prompts while preserving accurate findings and dispositions.

---

## Review 1: Architecture Compliance

### Original Prompt

```
Role: Staff engineer reviewing this MERN ticket system against the agreed architecture.

Context:
(Originally implicit — continuous review during implementation against design-notes.md and cursor-rules.)
Design requires: pure domain status machine, validation at route boundary, business rules in services,
thin controllers, consistent error envelope, and no secrets in source.

Objective:
Perform an architecture compliance review of the implemented backend/frontend layers and report
drift, violations, and acceptable temporary coexistence of legacy utilities.

Constraints:
- Do NOT propose large framework changes (e.g. Redux) unless a hard violation requires it
- Do NOT move state-machine enforcement into Mongoose middleware
- Prefer evidence (file/path references) over vague style opinions
- Stretch auth must remain labeled stretch — not treated as a core architecture failure

Review checklist:
1. domain/statusMachine.js has zero Mongoose imports
2. Controllers only delegate; services own business rules
3. Validators contain input rules only (no transition/domain policy)
4. Error envelope consistency across routes
5. No credentials or secrets in code

Assumptions:
- design-notes.md and cursor-rules are the source of truth
- Legacy utils may temporarily coexist if new code uses the intended modules

Acceptance criteria:
- Clear Accepted / Modified / Rejected findings with rationale
- Any architecture drift is either fixed or explicitly deferred with reason

Output format:
- Structured review notes (strengths, issues, dispositions)
```

### AI Summary

During implementation, the AI self-reviewed each feature against the architecture document: state machine in domain layer only, validation at route boundary, business rules in services, consistent error envelope, no secrets in code.

### Accepted

- Layer separation maintained across all implemented features
- `domain/statusMachine.js` has zero Mongoose imports
- Controllers are thin delegators to services
- Validators do not contain business logic

### Modified

- Legacy `utils/ApiError.js` coexists briefly with new `errors/` module — new code uses `errors/`

### Rejected

- Moving state machine checks to Mongoose middleware
- Adding Redux for state management

### Reason

Architecture compliance is an assessment evaluation criterion. Self-review during each prompt prevents drift from design decisions.

---

## Review 2: Security Review

### Original Prompt

```
Role: Application security reviewer for a student/assessment MERN API (secure-by-default, not pen-test).

Context:
(Originally implicit — security defaults in cursor-rules and workspace rules.)
Core scope excludes full JWT auth/RBAC (stretch). Seed users exist for demos/tests. API is CORS-enabled
for a configured client origin.

Objective:
Review current security defaults and call out must-fix issues vs intentional stretch deferrals.

Constraints:
- Do NOT require full auth middleware as a core blocker (document as stretch/limitation instead)
- Do NOT recommend disabling CORS, returning stack traces in production responses, or plaintext passwords
- Do NOT introduce eval, unsafe deserialization, or hardcoded production secrets
- Keep recommendations proportional to assessment scope

Review areas:
1. Credentials handling (seed hashing, password serialization)
2. Input validation on write endpoints + ObjectId format checks
3. CORS configuration source (env vs wildcard)
4. Error responses (no sensitive stack leakage in production paths)
5. Obvious insecure patterns (eval, hardcoded secrets)

Assumptions:
- Demo seed password may appear in README for assessors; not a production secret store
- Auth middleware may exist as a TODO stub

Acceptance criteria:
- Zero critical issues left unaddressed without explicit deferral + README limitation note
- Accepted/Rejected lists distinguish design deferrals from real defects

Output format:
- Security findings table or bullets with severity and disposition
```

### AI Summary

Review covered: no hardcoded credentials, bcrypt for seed passwords, password excluded from JSON serialization, CORS restricted to `CLIENT_URL`, no `eval`, input validation on all write endpoints, ObjectId format validation.

### Accepted

- bcrypt hashing in seed script
- `toJSON` transform hiding password field
- express-validator sanitization (trim, escape where applicable)
- CORS origin from environment variable

### Modified

- Auth middleware left as TODO stub (stretch feature)

### Rejected

- Disabling CORS entirely
- Returning stack traces in API error responses (production)
- Storing plaintext passwords

### Reason

Auth is explicitly out of core scope. Other security defaults follow secure-by-default principles without over-engineering.

---

## Review 3: Error Handling Consistency

### Original Prompt

```
Role: API designer reviewing error-handling consistency across backend and frontend.

Context:
(Originally implicit — review after centralized error handling implementation.)
Backend should return a stable JSON envelope { error: { code, message, details } }.
Frontend helpers parse that envelope for user-facing messages and field errors.
Integration tests should assert codes, not only status numbers.

Objective:
Verify end-to-end consistency of typed errors, Mongoose mapping, HTTP statuses, and client parsers.

Constraints:
- Do NOT invent per-endpoint custom error shapes
- Do NOT return HTML error pages from the JSON API
- Prefer shared errorCodes constants over string literals
- Keep frontend parsing tolerant but aligned with the envelope

Review checklist:
1. Typed error classes expose statusCode + code
2. Global handler maps Mongoose/cast/validation errors correctly
3. Frontend getErrorMessage / getFieldErrors match envelope fields
4. Integration tests lock critical codes (e.g. INVALID_TRANSITION, NOT_FOUND)

Assumptions:
- Centralized errors/ module is the intended path; legacy ApiError may still exist

Acceptance criteria:
- Consistent envelope on sampled success/failure paths
- Any literal code strings migrated or noted as Modified
- Rejected alternatives documented

Output format:
- Consistency review with Accepted/Modified/Rejected
```

### AI Summary

Review verified all error paths return `{ error: { code, message, details } }`, HTTP status codes match error types, and frontend `apiError.js` correctly parses the envelope.

### Accepted

- Typed error classes with `statusCode` and `code`
- Mongoose error mapping in global handler
- Frontend `getErrorMessage` and `getFieldErrors` utilities
- Integration tests asserting error codes

### Modified

- Standardized on `errors/errorCodes.js` constants instead of string literals

### Rejected

- Per-endpoint custom error formats
- HTML error pages from API

### Reason

Consistent errors reduce frontend complexity and make integration tests deterministic.

---

## Review 4: Test Coverage Gaps

### Original Prompt

```
Role: QA lead reviewing coverage after the mandatory state-machine suite lands.

Context:
(Originally started from “Generate additional tests,” then followed by an explicit coverage-gap review.)
State-machine integration tests exist. Remaining gaps suspected: CRUD lifecycle, search combinations,
frontend utilities, seed-based comment threads.

Objective:
Identify the highest-value missing tests and drive gap-fill that maximizes assessment confidence
per hour of work.

Constraints:
- Prefer integration tests for API behavior
- Limit frontend to utilities/small components (no full browser E2E)
- Do NOT mock the database in integration tests
- Do NOT pursue 100% coverage or Cypress/Playwright in this pass

Deliverables:
1. Gap list prioritized by risk
2. Concrete suites to add (CRUD, search combos, comments, errors, frontend utils)
3. Disposition for out-of-scope items (E2E, page mounts)

Assumptions:
- Shared testEnvironment + seed data remain available
- Target is a green suite around the existing ~187 test count after gap-fill

Acceptance criteria:
- Gaps either closed with new tests or explicitly rejected with rationale
- Frontend scope stays utility/component-level

Output format:
- Coverage gap review + resulting test inventory
```

### AI Summary

Review identified gaps after initial state machine tests: no dedicated CRUD lifecycle test, no search combination tests, no frontend utility tests, no seed-based comment thread tests.

### Accepted

- Added 6 new integration test files
- Added Vitest setup for frontend
- 187 total tests all passing

### Modified

- Frontend limited to utility/component tests (not page E2E)

### Rejected

- Full E2E browser test suite
- Mocking database in integration tests

### Reason

Targeted gap filling provides best coverage-to-effort ratio for assessment submission.

---

## Review 5: Code Quality and Duplication

### Original Prompt

```
Role: Frontend/backend code quality reviewer focusing on DRY without over-abstraction.

Context:
(Originally implicit — review during hook and service layer implementation.)
React hooks may duplicate fetch/mutation/error handling. Backend validators may repeat field rules.
Service layer should centralize HTTP concerns where appropriate.

Objective:
Review duplication and naming consistency; recommend consolidations that reduce drift without
introducing generic factories or HOC sprawl.

Constraints:
- Do NOT abstract every component into HOCs
- Do NOT create a generic CRUD hook factory unless duplication is severe and proven
- Prefer small shared hooks (useAsync/useMutation) and shared field validators
- Keep naming consistent with existing project conventions

Review areas:
1. Duplicated API call / retry logic across hooks
2. Ticket mutation hook consolidation opportunities
3. Shared validators vs copy-pasted express-validator chains
4. Missing error handling in hooks

Assumptions:
- Service layer is the right place for HTTP + retry
- Some duplication is acceptable if abstraction would obscure intent

Acceptance criteria:
- Clear Accepted consolidations vs Rejected over-abstractions
- Any consolidation (e.g. useTicketMutations) called out under Modified

Output format:
- Quality/duplication review with dispositions
```

### AI Summary

Review checked for duplicated API call logic, inconsistent naming, and missing error handling in React hooks.

### Accepted

- `useAsync` and `useMutation` base hooks reduce duplication
- Service layer centralizes HTTP + retry logic
- Shared field validators reduce validator duplication

### Modified

- Consolidated ticket mutation hooks into `useTicketMutations.js`

### Rejected

- Abstracting every component into HOCs
- Creating a generic CRUD hook factory (over-abstraction)

### Reason

Reusable hooks and services follow DRY without introducing unnecessary abstraction layers.

---

## Issues Found and Disposition

| Severity | Finding | Action |
|----------|---------|--------|
| High | Text index missing in test DB | Fixed — `syncIndexes()` in test helper |
| High | No auth on API endpoints | Deferred — stretch feature, documented in README |
| Medium | `requirements-analysis.md` still TODO placeholders | Deferred — candidate artifact |
| Medium | Logger noise in test output | Accepted — informational only |
| Low | Legacy `ApiError` utility | Deferred — no runtime impact |
| Low | No comment edit/delete | Deferred — out of scope |

---

## Code Review Phase Summary

| Metric | Value |
|--------|-------|
| Review passes | 5 |
| Fixes applied | 1 (test index sync) |
| Deferred items | 4 (auth, docs, legacy util, comment CRUD) |
| Security issues | 0 critical (auth deferred by design) |

## Related Artifacts

- [`../code-review-notes.md`](../code-review-notes.md)
- [`../review-fixes.md`](../review-fixes.md)
- [`../tool-specific/cursor-workflow/cursor-rules-or-instructions.md`](../tool-specific/cursor-workflow/cursor-rules-or-instructions.md)
- [`./06-code-review.md`](./06-code-review.md)
- [`./testing.md`](./testing.md)
- [`./debugging.md`](./debugging.md)
