# Prompt Pack: Code Review

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Review |
| **Historical log** | [code-review.md](./code-review.md) |

## Purpose

Run structured self-reviews against architecture, security defaults, error consistency, test gaps, and duplication — with explicit accept/fix/defer decisions.

## Canonical Prompt

```
Role: Staff engineer performing an assessment-oriented code review.

Context:
MERN Support Ticket Management System. Core features implemented; auth is stretch.
Authoritative docs: design-notes.md, api-contract.md, cursor-rules-or-instructions.md.

Objective:
Review the codebase and produce findings with severity, evidence, and recommended action
(fix now / defer / reject).

Review dimensions:
1. Architecture compliance (layers, state machine isolation)
2. Security defaults (no secrets, validation, CORS, password hashing/serialization)
3. Error handling consistency (envelope, codes, frontend parsing)
4. Test coverage gaps (especially state machine + CRUD/search)
5. Quality & duplication (hooks/services/validators)

Constraints:
- Do not invent critical issues that are not present
- Prefer minimal, high-impact fixes
- Auth absence is known stretch — document, do not “fail” the review solely for it

Acceptance criteria:
- Findings table with severity + disposition
- At least one concrete fix applied if High issues exist
- Deferred items listed with rationale

Output: markdown report suitable for code-review-notes.md and review-fixes.md.
```

## Focused Follow-ups

### Architecture

```
Verify domain/statusMachine.js has zero Mongoose imports and controllers remain thin.
List any violations with file paths.
```

### Security

```
Scan for hardcoded secrets, plaintext passwords, permissive CORS, eval, and missing
input validation on write endpoints. Propose fixes without implementing full JWT auth.
```

### Coverage

```
Identify the top 5 missing tests by risk. Implement only those that improve assessment
confidence without requiring browser E2E.
```

## AI Response Summary

Confirmed layering and error envelope; secured seed passwords and CORS defaults; filled integration/unit gaps; deferred auth/RBAC and comment edit/delete as out of scope.

## Findings Disposition (Snapshot)

| Severity | Finding | Action |
|----------|---------|--------|
| High | Text index missing in test DB | Fixed — `syncIndexes()` |
| High | No auth on API | Deferred — stretch |
| Medium | Some candidate docs still TODO | Deferred — candidate narrative |
| Low | Legacy ApiError utility | Deferred — no runtime impact |

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Fix test index sync | Unblocks search tests |
| Defer auth | Explicit stretch |
| Avoid over-abstraction | Keep reviewable diffs |

## Outcome

- Review log: [code-review.md](./code-review.md)
- Artifacts: [`../code-review-notes.md`](../code-review-notes.md), [`../review-fixes.md`](../review-fixes.md)
