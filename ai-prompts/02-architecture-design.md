# Prompt Pack: Architecture and Design

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Design |
| **Historical log** | [design.md](./design.md) |

## Purpose

Produce assessor-ready architecture, data model, API contract, and UI flow documents with no application code.

## Canonical Prompt (Architecture)

```
Role: Principal engineer writing ADR-quality architecture for a MERN helpdesk app.

Objective:
Design the complete architecture so implementation can proceed without guessing.

Cover: frontend, backend layers, MongoDB, folder structure, REST conventions,
validation, errors, logging, testing, and status state machine strategy.

Constraints:
- Markdown only — no source code
- Prefer testable simplicity over enterprise tooling
- Isolate state machine in a pure domain module (no Mongoose)

Assumptions:
- Soft delete via deletedAt on tickets
- Comments as a separate collection
- Auth is stretch scaffold only

Acceptance criteria:
- Update design-notes.md
- Clear layer boundaries
- Testing pyramid includes mandatory transition integration tests

Output: design-notes.md
```

## Supporting Prompts

### Schema design

```
Design MongoDB schema for User, Ticket, Comment.
Document collections, relationships, indexes, validation, seed strategy,
migration/re-seed approach, and env vars.
Generate data-model.md and database/schema + seed-data docs.
No Mongoose code yet. Never document plaintext passwords.
```

### API contract

```
Design the REST API contract for tickets, nested comments, read-only users,
dedicated status update, search/filter/pagination.
For each endpoint: method, URL, purpose, body/query, responses, validation, errors.
Use error envelope { error: { code, message, details } }.
Separate PATCH /tickets/:id/status. Markdown only → api-contract.md.
```

### UI flow

```
Design frontend pages: Dashboard, Ticket List (+ search/filter), Create, Detail,
Edit, status actions, comments.
Include user flows, navigation, component hierarchy, state approach, error/loading UI,
responsive notes. Prefer search on list page (not /search). Output ui-flow.md only.
```

## AI Response Summary

Filled `design-notes.md`, `data-model.md`, `api-contract.md`, and `ui-flow.md` with layered MVC, indexes, REST contract, and React page/component hierarchy.

## Refinements

### Iteration 1

```
Confirm: no Redux; Context + hooks; soft delete; dedicated status endpoint;
$text search with regex fallback. Update docs if needed. No code.
```

### Iteration 2

```
Add ADR-style “Decision / Why” notes for state machine placement and soft delete.
Keep stretch auth clearly labeled.
```

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Pure `statusMachine` domain module | Unit-testable judgment piece |
| Soft delete | Auditability + demo safety |
| Search on list page | Simpler UX and routing |

## Outcome

- Design log: [design.md](./design.md)
- Artifacts: [`../design-notes.md`](../design-notes.md), [`../api-contract.md`](../api-contract.md), [`../data-model.md`](../data-model.md), [`../ui-flow.md`](../ui-flow.md)
