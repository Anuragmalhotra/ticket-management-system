# Prompt Pack: Backend Implementation

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Implementation (Server) |
| **Historical log** | [implementation.md](./implementation.md) Prompts 1, 3–10 |

## Purpose

Implement the Express/Mongoose API in layers: scaffold → models → services → validators → errors → seed, matching `api-contract.md` and `design-notes.md`.

## Canonical Prompt Sequence

### 1) Scaffold only

```
Role: Backend lead scaffolding an Express ESM API.

Objective: Create server/ folder structure (config, routes, controllers, services,
models, middleware, validators, utils, constants, domain) with stubs only.

Constraints: No business logic yet. Separate app.js from index.js for Supertest.
Use ES modules. Follow MVC + service layer.

Acceptance criteria: Routes mount; health endpoint exists; Jest folder ready.
```

### 2) Models

```
Implement Mongoose models User, Ticket, Comment with enums, indexes, timestamps,
refs, soft delete on tickets, password excluded from JSON.
Follow data-model.md. No route handlers in this step.
```

### 3) Ticket CRUD + comments + search

```
Implement ticket CRUD (soft delete), nested comment APIs, and search/filter/pagination
via pure ticketQuery helpers. Validate with express-validator. Controllers stay thin.
Return proper HTTP codes and the standard error envelope.
```

### 4) Status state machine (explain first)

```
Explain the design, then implement a pure domain/statusMachine.js plus service
enforcement on PATCH /tickets/:id/status.
Transitions: open→in_progress|cancelled; in_progress→resolved|cancelled; resolved→closed.
Reject invalid transitions with 409 + clear message. Unit-test the domain module.
Business rules live only in the service layer (not Mongoose hooks).
```

### 5) Validation, errors, seed

```
Add shared express-validator chains, centralized error classes + middleware,
structured logging, and a reusable seed script (users/tickets/comments, bcrypt passwords).
Seed must be importable by integration tests.
```

## AI Response Summary

Delivered layered Express API with models, CRUD, comments, search, status machine, validators, error handling, and deterministic seed data (~173 backend tests later).

## Refinements

### Iteration 1 — Architecture guardrails

```
Audit: no business rules in controllers/validators; state machine has zero Mongoose imports.
Fix any violations with minimal diffs.
```

### Iteration 2 — Contract alignment

```
Diff server routes against api-contract.md. Align status codes, error codes, and
pagination metadata. Do not expand scope (no auth).
```

## Mistakes Corrected

| Issue | Fix |
|-------|-----|
| Text index missing in memory-server tests | `Ticket.syncIndexes()` in test helper |
| Duplicate CRUD prompt | Idempotent verify; no duplicate code |

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Soft delete default | Matches design |
| Dedicated status endpoint | Visible state machine |
| Deterministic seed | Reproducible tests |

## Outcome

- Implementation log: [implementation.md](./implementation.md)
- Code: [`../server/src/`](../server/src/)
- Tests: [`../server/tests/`](../server/tests/)
