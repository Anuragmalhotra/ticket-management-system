# AI Usage — Design Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Architecture, data model, API contract, UI design

This document records AI prompts used during the design phase, including what was accepted, modified, or rejected.

---

## Prompt 1: Complete Architecture Design

### Original Prompt

```
Role: Principal engineer writing an architecture decision record for a MERN helpdesk app.

Context:
Support Ticket Management System assessment. Stack: MongoDB, Express, React (Vite), Node.js.
Core: tickets, comments, status state machine, search/filter, validation, errors, tests.
Stretch: JWT auth / RBAC (scaffold-friendly design only).

Objective:
Produce a complete architecture design that an implementer (or Cursor) can follow without guessing.

Constraints:
- Do NOT generate application source code
- Prefer simple, testable designs over enterprise frameworks
- Explain the “why” for each major decision (ADR-style)

Cover these areas:
1. Frontend architecture (pages, hooks, services, state)
2. Backend architecture (layers and responsibilities)
3. MongoDB design (collections, indexes, soft delete)
4. Folder structure (monorepo)
5. REST API design conventions
6. Validation strategy
7. Error handling strategy
8. Logging strategy
9. Testing strategy (unit vs integration; mandatory state-machine tests)
10. Status state machine strategy (pure domain module)

Assumptions:
- Soft delete for tickets via deletedAt
- Comments are a separate collection
- Auth is stretch and must not block core paths

Acceptance criteria:
- Write/update design-notes.md
- Every layer has a clear responsibility boundary
- State machine is isolated from Mongoose
- Testing pyramid includes mandatory transition tests

Output: design-notes.md (markdown only).
```

### AI Summary

The AI produced `design-notes.md` — a comprehensive architecture document (~900 lines) covering layered Express MVC, React SPA with hooks and service layer, MongoDB collections and indexes, REST conventions, express-validator strategy, centralized error handling with custom error classes, structured logging, Jest/Supertest testing pyramid, and a pure `statusMachine` domain module with ADRs explaining each decision.

### Accepted

- Monorepo with decoupled client/server over REST/JSON
- Backend layering: routes → validators → controllers → services → models
- Pure domain module for state machine (unit-testable, no DB coupling)
- express-validator at route boundary; business rules in services
- Centralized error handler with consistent JSON envelope
- Soft delete via `deletedAt` on tickets
- Text index + compound indexes for search/list performance
- Jest integration tests with mongodb-memory-server

### Modified

- Redux/Zustand rejected in favor of React Context + custom hooks (documented as intentional simplification)
- JWT auth designed as stretch scaffold only — middleware stubbed, not fully implemented
- Logging kept as structured console output rather than external log aggregation (Winston/Datadog)

### Rejected

- GraphQL API layer
- Microservices decomposition
- Server-side rendering (Next.js)
- Hard delete as default (soft delete preferred for auditability)

### Reason

Assessment scope favors clarity and testability over enterprise scale. A pure state machine module and service layer satisfy the "judgment piece" requirement while keeping the architecture reviewable.

---

## Prompt 2: MongoDB Schema Design

### Original Prompt

```
Role: Data modeler for a MERN ticket system.

Objective:
Design the MongoDB data model and supporting database docs before writing Mongoose code.

Entities (required): User, Ticket, Comment.

Document:
- Collections and field definitions (types, required, enums, defaults)
- Relationships (refs / cardinality)
- Indexes (unique, text, compound) and why each exists
- Validation rules (schema-level)
- Seed data strategy (deterministic, reusable for tests)
- Migration / re-seed strategy for local development
- Environment variables needed for DB connection

Generate / update:
- data-model.md
- database/setup-notes.md (or setup.md)
- database/schema/* field docs
- database/seed-data/* sample records

Constraints:
- No application code yet (no .js models)
- Prefer normalized comments (separate collection)
- Never store plaintext passwords in seed docs

Assumptions:
- Roles: admin, manager, agent, customer
- Ticket statuses: open, in_progress, resolved, closed, cancelled
- Priorities: low, medium, high
- Soft delete on tickets only

Acceptance criteria:
- Every relationship is explicit
- Indexes map to list/search query patterns
- Seed keys (e.g. t1, admin, c1) support test reuse

Output: Markdown documentation only.
```

### AI Summary

The AI documented three collections with field-level schemas, ObjectId relationships (Ticket → User, Comment → Ticket + User), index strategy (unique email, text search, compound list indexes), Mongoose validation rules, bcrypt password hashing for seed users, idempotent seed strategy, and environment variable requirements.

### Accepted

- User roles enum: `admin`, `manager`, `agent`, `customer`
- Ticket statuses: `open`, `in_progress`, `resolved`, `closed`, `cancelled`
- Ticket priorities: `low`, `medium`, `high`
- Comment references `ticketId` + `authorId`
- Text index on `title` + `description`
- Compound indexes: `{ deletedAt, status, createdAt }`, `{ deletedAt, createdAt }`
- Seed data keyed by logical names (`t1`, `admin`, `c1`) for test reuse

### Modified

- `database/setup-notes.md` renamed/consolidated with `database/setup.md` in some paths
- Migration strategy documented as "re-seed for dev" rather than formal migration tooling (no production deployment requirement)

### Rejected

- Embedding comments array inside Ticket document (normalized to separate collection)
- Storing plaintext passwords in seed data
- Multi-tenant / organization scoping (out of assessment scope)

### Reason

Normalized comments support unbounded threads without document size limits. Separate collections align with REST nesting (`/tickets/:id/comments`) and simplify querying.

---

## Prompt 3: REST API Contract

### Original Prompt

```
Role: API designer writing a contract an assessor can validate against the running server.

Objective:
Design a complete REST API contract for the ticket system.

For EVERY endpoint document:
- Method + URL
- Purpose
- Auth expectation (none for core; note stretch)
- Request body / query params
- Success response body + status code
- Validation rules
- Possible errors (code, HTTP status, when)

Resources / capabilities to include:
- Tickets CRUD (soft delete)
- Dedicated status update endpoint
- Nested comments (list + create)
- Users (read-only for seed/dropdowns)
- Search + status filter + pagination on ticket list

Constraints:
- Markdown only — no Express code
- Prefer PATCH for partial updates
- Keep nesting to one level under tickets
- Use a consistent error envelope: { error: { code, message, details } }

Assumptions:
- Soft-deleted tickets are omitted from lists and return 404 on direct access
- Invalid status transitions return 409 with a clear message

Acceptance criteria:
- Separate PATCH /tickets/:id/status exists (not folded into generic update)
- List response includes pagination metadata
- Error codes are named and stable (VALIDATION_ERROR, NOT_FOUND, INVALID_TRANSITION, …)

Output: api-contract.md
```

### AI Summary

The AI generated `api-contract.md` documenting all ticket CRUD endpoints, dedicated `PATCH /tickets/:id/status` for state transitions, nested comment endpoints, user list/detail for dropdowns, query params for search/filter/pagination, validation rules per field, and error codes (`VALIDATION_ERROR`, `NOT_FOUND`, `INVALID_TRANSITION`, etc.).

### Accepted

- Separate status update endpoint (not generic PATCH) to isolate state machine logic
- `GET /tickets` with `search`, `status`, `page`, `limit` query params
- Paginated list response: `{ tickets, total, page, limit, totalPages }`
- Standard error envelope: `{ error: { code, message, details } }`
- Soft-deleted tickets return `404` on direct access

### Modified

- User endpoints limited to read-only (seed support) — no user CRUD API
- Search uses MongoDB `$text` for alphanumeric terms; regex fallback for special characters
- Prefer JSON success bodies over empty `204` for most mutations (consistency)

### Rejected

- `PUT` for full replacement updates (PATCH used for partial updates)
- Nested routes deeper than one level (e.g. `/tickets/:id/comments/:id/replies`)
- GraphQL or RPC-style endpoints

### Reason

REST with explicit status endpoint makes state machine enforcement visible in the API contract — a key assessment criterion. Pagination metadata supports the ticket list UI without additional round trips.

---

## Prompt 4: Frontend UI Design

### Original Prompt

```
Role: Product-minded frontend designer for a React helpdesk SPA.

Objective:
Design the frontend UX and component structure before coding pages.

Pages / areas to cover:
- Dashboard
- Ticket List (with search/filter)
- Create Ticket
- Ticket Detail (status actions + comments)
- Edit Ticket
- Status update UX (allowed transitions only)
- Comment section

Also document:
- User flows and navigation map
- Component hierarchy (pages → features → shared)
- State management approach
- Error UI and loading UI patterns
- Responsive behavior (desktop + mobile)

Constraints:
- Generate ui-flow.md only (no React code)
- Prefer integrating search into Ticket List (not a separate /search route)
- Auth/login may be scaffolded as stretch UI only

Assumptions:
- React Router + Vite
- Context API + custom hooks (no Redux)
- Toast notifications for mutation feedback

Acceptance criteria:
- Routes are enumerated
- StatusActions only exposes allowed next statuses
- Loading/error/empty states are specified per major page

Output: ui-flow.md with wireframe-style ASCII or tables as needed.
```

### AI Summary

The AI produced `ui-flow.md` with page wireframes, navigation map, component hierarchy (pages → feature components → shared UI), hook-based data fetching, debounced search with URL sync, status action buttons driven by allowed transitions, comment thread layout, error alert + retry patterns, skeleton loaders, and responsive breakpoints.

### Accepted

- React Router routes: `/`, `/tickets`, `/tickets/new`, `/tickets/:id`, `/tickets/:id/edit`
- Search/filter on list page with URL query param sync
- `StatusActions` component showing only valid next statuses
- `CommentSection` with list + form on detail page
- Toast notifications for mutation success/failure
- Shared components: `ErrorAlert`, `LoadingSkeleton`, `PageHeader`, `FormField`

### Modified

- Search integrated into Ticket List page rather than a separate `/search` route
- Auth/login page scaffolded at `/login` but not wired to backend
- Context API used instead of Redux (per architecture decision)

### Rejected

- Separate mobile-native app
- Real-time WebSocket comment updates
- Drag-and-drop kanban board view

### Reason

Integrating search into the list page matches common helpdesk UX and reduces routing complexity. Component hierarchy supports incremental implementation from scaffolding to wired pages.

---

## Design Phase Summary

| Metric | Value |
|--------|-------|
| Prompts logged | 4 |
| Code generated | None (by design) |
| Primary artifacts | `design-notes.md`, `data-model.md`, `api-contract.md`, `ui-flow.md` |
| Key human decision | Auth/RBAC designed but deferred; core flows prioritized |

## Related Artifacts

- [`../design-notes.md`](../design-notes.md)
- [`../data-model.md`](../data-model.md)
- [`../api-contract.md`](../api-contract.md)
- [`../ui-flow.md`](../ui-flow.md)
- [`../database/schema/README.md`](../database/schema/README.md)
- [`./02-architecture-design.md`](./02-architecture-design.md)
