# Cursor Prompt Templates

Reusable, assessment-ready prompts for the Support Ticket Management System.

**How to use:** Copy a template, replace `[BRACKETS]`, paste into Cursor. Keep one objective per prompt. Prefer minimal diffs and verify with tests.

---

## Template: Feature Implementation

```
Role: Senior MERN engineer implementing one feature end-to-end.

Context:
- Project: Support Ticket Management System
- Stack: MongoDB, Express, React (Vite), Node.js (JavaScript)
- Follow: design-notes.md, api-contract.md, ui-flow.md, cursor-rules

Objective:
Implement [FEATURE NAME] only.

Scope:
- Backend: [routes / service / validators / tests]
- Frontend: [pages / components / hooks] (if needed)
- Docs: update [which files] only if behavior changes

Constraints:
- Do not implement unrelated features
- No new dependencies unless justified
- Controllers stay thin; business rules in services
- State transitions only via domain/statusMachine + ticket service
- No secrets in code

Assumptions:
- [e.g. Auth remains stretch / soft delete already exists]

Acceptance criteria:
- [ ] Matches api-contract.md for affected endpoints
- [ ] Validation + error envelope consistent
- [ ] Unit or integration tests added/updated
- [ ] UI loading/error states handled (if frontend)

Output:
1. Brief design (5–10 lines)
2. Code changes
3. How to verify (commands)
```

---

## Template: Bug Fix

```
Role: Debugger focused on root cause and minimal fix.

Context:
- Symptom: [what the user sees]
- Repro steps: [1, 2, 3]
- Expected: […]
- Actual: […]
- Logs / stack (if any): […]

Objective:
Find root cause and fix with the smallest safe change.

Constraints:
- Do not “fix” by deleting tests or weakening validation
- Prefer product bug fixes over UI workarounds
- Explain why the bug happened (one short paragraph)

Acceptance criteria:
- [ ] Repro no longer fails
- [ ] Related tests pass (or a regression test is added)
- [ ] No unrelated refactors

Output:
1. Root cause
2. Fix (files + why)
3. Verification steps
```

---

## Template: Code Review

```
Role: Staff engineer reviewing for an AI Practical Assessment.

Review these paths: [paths or “current branch changes”]

Check:
1. Architecture (layers, state machine isolation)
2. Security defaults (secrets, validation, CORS)
3. Error consistency ({ error: { code, message, details } })
4. Tests (gaps vs risk)
5. Clarity / duplication

For each finding include: severity (High/Med/Low), evidence, recommendation
(fix now / defer / reject), and rationale.

Constraints:
- Be specific; cite files
- Do not invent issues
- Auth may be stretch — label deferred items clearly

Output: findings table + top 3 recommended actions.
```

---

## Template: Test Generation

```
Role: QA-minded engineer writing high-signal tests.

Target: [module or endpoint]

Add tests for:
- Happy path
- Validation failures
- Not found / soft-delete behavior (if relevant)
- State machine invalid transitions (if relevant)

Framework:
- Backend: Jest + Supertest + mongodb-memory-server
- Frontend: Vitest + Testing Library (utils/components)

Constraints:
- Prefer integration tests for HTTP↔DB behavior
- Do not mock away the code under test for integration suites
- Keep tests deterministic (seed data keys)

Acceptance criteria:
- [ ] Tests fail on the bug/requirement they protect
- [ ] Run via `npm test` (server) or `npm test` (client)
- [ ] No flaky timing assumptions

Output: test files + how to run them.
```

---

## Template: Documentation

```
Role: Technical writer for an assessment submission.

Objective:
Update [DOC PATH] so an assessor can understand and run the project.

Include only what is needed for: [overview / setup / API / limitations / AI usage].

Constraints:
- Accurate to the repo (verify commands and ports)
- No secrets beyond demo seed credentials already documented
- Prefer tables and short sections
- Do not invent features that are not implemented

Acceptance criteria:
- [ ] Fresh reader can install and run from the doc
- [ ] Known limitations listed honestly
- [ ] Links to related docs are valid

Output: updated markdown only.
```

---

## Template: Commit Message

```
Suggest one Conventional Commit message for the staged intent:
[short description of why]

Rules:
- Subject ≤ 72 chars; focus on why
- Optional 1–2 sentence body
- Do not run git commit
```

---

## Notes — Better Cursor Results

1. **One objective per prompt** — split scaffold vs business logic vs tests.
2. **Point at source of truth** — cite `spec.md` / `api-contract.md` / file paths.
3. **State constraints negatively** — “Do NOT add auth”, “Do NOT use Redux”.
4. **Require acceptance criteria** — makes “done” testable.
5. **Ask for verification commands** — reduces silent breakage.
6. **Prefer minimal diffs** — easier human review for the assessment.
7. **Log accept/modify/reject** — keep `ai-prompts/` phase files honest.

## See Also

- [`../../ai-prompts/README.md`](../../ai-prompts/README.md)
- [`./cursor-rules-or-instructions.md`](./cursor-rules-or-instructions.md)
- [`./spec.md`](./spec.md)
