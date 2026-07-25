# Prompt Pack: Requirements Analysis

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Planning |
| **Historical log** | [planning.md](./planning.md) Prompt 1 |

## Purpose

Lock scope, assumptions, risks, and milestones for the Support Ticket Management System **before** any implementation.

## Canonical Prompt

```
Role: Senior Full-Stack Software Architect specializing in MERN applications.

Context:
AI Practical Assessment — Support Ticket Management System.
Fixed stack: MongoDB, Express, React, Node.js (JavaScript).
Core scope: ticket CRUD, comments, status state machine, search/filter, validation, error handling, tests.
Stretch (design only for now): JWT auth and RBAC.

Objective:
Analyze requirements thoroughly so we can lock scope, assumptions, and milestones before coding.

Constraints:
- Do NOT generate application code, schemas, or config files.
- Prefer assessor-readable structure over enterprise complexity.
- Explicitly separate in-scope vs stretch vs out-of-scope.

Deliverables (markdown, in order):
1. Requirements Analysis (problem + success criteria)
2. Functional Requirements
3. Non-Functional Requirements
4. Assumptions
5. Edge Cases
6. Suggested Architecture (high level)
7. Suggested Tech Stack (within MERN)
8. Suggested Folder Structure (monorepo)
9. Milestone Plan
10. Risks and Mitigations

Assumptions (unless contradicted):
- Soft delete for tickets
- Deterministic seed data for demos/tests
- Auth must not block core CRUD

Acceptance criteria:
- Status lifecycle identified as primary domain judgment piece
- Every must-have maps to a milestone
- Risks include scope creep, state-machine bugs, test isolation, incomplete docs
- No implementation code

Output format: structured markdown only.
```

## AI Response Summary

Produced a structured requirements breakdown for tickets, comments, status transitions, search/filter, validation, errors, and testing tiers. Recommended monorepo layout, layered Express backend, pure domain state machine, and phased milestones.

## Refinements

### Iteration 1 — Scope freeze

```
Refine the analysis: mark JWT auth and RBAC as stretch only.
Confirm soft delete, three entities (User, Ticket, Comment), and mandatory state-machine integration tests as core.
Update the milestone plan accordingly. No code.
```

**Outcome:** Stretch deferred; core CRUD + state machine prioritized.

### Iteration 2 — Artifact mapping

```
Map each functional requirement to the assessment markdown artifact that will capture it
(requirements-analysis, acceptance-criteria, implementation-plan, design-notes).
Keep placeholders acceptable where candidate text will be filled later.
```

**Outcome:** Traceability between analysis and submission docs.

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Accept MERN + monorepo | Matches assessment constraints |
| Defer auth/RBAC | Reduces risk; still documentable as stretch |
| Keep `requirements-analysis.md` as scaffold | Candidate-owned narrative |

## Outcome

- Planning log: [planning.md](./planning.md)
- Artifacts: [`../requirements-analysis.md`](../requirements-analysis.md), [`../acceptance-criteria.md`](../acceptance-criteria.md), [`../implementation-plan.md`](../implementation-plan.md)
