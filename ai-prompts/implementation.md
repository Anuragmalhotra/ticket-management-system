# AI Usage — Implementation Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Backend scaffolding, frontend scaffolding, feature implementation

This document records AI prompts used during the implementation phase of the Support Ticket Management System assessment, including what was accepted, modified, or rejected.

---

## Prompt 1: Backend Scaffolding

### Original Prompt

```
Role: Senior Node.js / Express engineer scaffolding a MERN assessment backend.

Context:
I am building a Support Ticket Management System (MongoDB, Express, React, Node.js — JavaScript only).
Design docs and folder conventions already exist. This step establishes the Express MVC skeleton only.
Later prompts will add models, services, validation, and APIs.

Objective:
Generate clean Express backend scaffolding with an MVC-oriented layout and stub wiring — no business logic.

Tech stack for this step:
- Express
- MongoDB / Mongoose (connection stubs only; no schemas yet unless required for structure)
- ES modules preferred over CommonJS

Generate (folder structure + stub files):
- config
- controllers
- routes
- models
- middleware
- validators
- services
- utils
- (and any other conventional Express layout pieces needed for a testable app entry)

Constraints:
- Do NOT implement business logic (CRUD, state machine, search, etc.)
- Controllers may delegate to TODO/stub services only
- Prefer separating `app.js` from server bootstrap (`index.js`) for testability
- No monolithic single-file `server.js`
- Keep stubs assessor-readable and consistent with layered architecture (routes → controllers → services → models)

Deliverables:
1. Backend folder tree under `server/`
2. Stub controllers, routes, middleware, validators, services, config, utils
3. Minimal wiring so the app can boot with empty/TODO handlers
4. Brief summary of what was created vs intentionally left for later

Assumptions:
- Monorepo with `server/` as the backend root
- Jest (or equivalent) test folder structure may be scaffolded empty
- Auth middleware can be a stub for future stretch work

Acceptance criteria:
- Scaffolding only — no real ticket/comment/user business rules
- ES module style (not CommonJS `require`)
- Controllers do not contain business logic
- Structure is ready for subsequent feature prompts

Output format: create the scaffolding files; summarize the tree and stub conventions briefly.
```

### AI Summary

The AI scaffolded the Express server with `src/` layout (config, controllers, routes, models, middleware, validators, services, utils, constants), stub controllers delegating to TODO services, route wiring, auth middleware stub, `asyncHandler`, `ApiError`, and Jest test folder structure.

### Accepted

- ES modules (`"type": "module"`)
- `app.js` separated from `index.js` for testability
- `asyncHandler` wrapper for async route errors
- Validator files per resource (ticket, comment, user)
- Empty service files ready for business logic injection

### Modified

- `ApiError` later replaced/extended by `errors/` module with typed error classes
- Services fully implemented in subsequent prompts (no longer stubs)

### Rejected

- CommonJS `require` syntax
- Putting business logic directly in controllers
- Single-file monolithic `server.js`

### Reason

Scaffolding establishes conventions before implementation. Separating `app.js` enables Supertest integration tests without starting a live server.

---

## Prompt 2: React Frontend Scaffolding

### Original Prompt

```
Role: Senior React engineer scaffolding a Vite frontend for a MERN assessment.

Context:
Backend scaffolding exists (or is in progress). UI flow docs describe Dashboard, Ticket List, Ticket Detail, Create/Edit Ticket, comments, and status actions.
This step creates the React app skeleton and folder conventions only — no real API wiring or full UI behavior yet.

Objective:
Generate React frontend scaffolding with Vite, React Router, Axios, and Context API stubs. Pages/components/hooks/services as empty or placeholder shells only.

Use:
- React (JavaScript, not TypeScript)
- Vite
- React Router
- Axios
- Context API

Generate:
- Folder structure
- Pages
- Components (feature folders + shared/common)
- Hooks
- Services / API client stubs
- Layouts
- Shared components

Constraints:
- No full feature implementation — scaffolding and placeholders only
- Do NOT use Create React App
- Do NOT introduce TypeScript
- Do NOT add CSS-in-JS libraries (plain CSS is fine later)
- Prefer feature-based component folders aligned with `ui-flow.md`
- Stub hooks may return placeholder data shapes

Deliverables:
1. Vite React app under `client/`
2. Route shell (`AppRoutes` or equivalent) and layout shell
3. Page stubs for assessment screens
4. Axios API client stub and Context stubs (e.g. Auth, Toast)
5. Brief summary of folder conventions

Assumptions:
- Dev proxy to backend (e.g. `/api` → port 5000) is desirable if easy
- Auth Context may remain a stub until stretch work
- Hooks and services will be fully implemented in later prompts

Acceptance criteria:
- App boots with routing shell and empty/placeholder pages
- No real CRUD/search/status business UI beyond stubs
- Folder layout matches planned UI areas (tickets, comments, common, layout)

Output format: create the scaffolding; summarize structure and stub conventions briefly.
```

### AI Summary

The AI created the Vite React app with page stubs, component folders (tickets, comments, common, layout), hook stubs (`useTickets`, `useTicket`, `useUsers`), Axios API client, `AuthContext`/`ToastContext` stubs, `AppRoutes`, and `Layout` shell.

### Accepted

- Vite dev server with `/api` proxy to port 5000
- Feature-based component folders
- Page-level route components
- Stub hooks returning placeholder data shapes

### Modified

- Hooks and services fully implemented in later prompts
- `ToastContext` upgraded from stub to working auto-dismiss toasts
- Service layer (`client/src/services/`) added on top of raw `api/` wrappers

### Rejected

- Create React App (CRA) in favor of Vite
- TypeScript (project uses JavaScript per assessment simplicity)
- CSS-in-JS libraries (plain CSS used)

### Reason

Vite offers faster dev feedback. Scaffolding first ensures folder conventions match `ui-flow.md` before wiring API calls.

---

## Prompt 3: Mongoose Models

### Original Prompt

```
Role: Senior MongoDB / Mongoose data modeler for a ticket-management assessment.

Context:
Express scaffolding exists. Entities are User, Ticket, and Comment.
Design docs define relationships, enums (roles/statuses/priorities), indexes, timestamps, and soft delete on tickets.
Business rules such as status transitions must NOT live in Mongoose hooks — they belong in the service/domain layer later.

Objective:
Implement production-quality Mongoose models for User, Ticket, and Comment with validation, enums, indexes, timestamps, and relationships.

Implement models:
- User
- Ticket
- Comment

Include:
- Schema validation
- Enums matching project constants
- Indexes (including text search and compound list indexes from design docs)
- `timestamps: true`
- Relationships via `ref`
- Soft-delete support on tickets (`deletedAt`)
- Best practices (e.g. exclude sensitive fields in JSON transforms)

Constraints:
- Do NOT put status state-machine logic in pre-save hooks
- Do NOT invent ticket subtype discriminators
- Align enums and indexes with design docs / constants
- Keep models focused on persistence integrity, not HTTP concerns

Deliverables:
1. Mongoose schemas/models for User, Ticket, Comment
2. Indexes and enum validation as designed
3. Barrel export if that matches existing project patterns
4. Short notes on relationships and soft delete

Assumptions:
- Soft delete for tickets; comments/users as designed
- Password may exist on User for future auth / seed hashing
- Status transition enforcement will be implemented in the service layer later

Acceptance criteria:
- All three models compile and match design enums/refs
- Indexes needed for list/search are present
- No state-machine logic in Mongoose middleware
- Sensitive fields (e.g. password) excluded from default JSON output

Output format: implement the model files; briefly confirm indexes, enums, and relationships.
```

### AI Summary

The AI implemented three Mongoose schemas with enum validation for roles/statuses/priorities, `ref` relationships, compound and text indexes, `timestamps: true`, email uniqueness, and soft-delete support via `deletedAt` on tickets.

### Accepted

- All indexes from design docs (text search, compound list, sparse `assignedTo`)
- Schema-level enum validation matching constants files
- `toJSON` transform excluding sensitive fields (password)
- Barrel export via `models/index.js`

### Modified

- Password field added to User model for future auth (bcrypt hashed in seed only)
- `updatedAt` manually bumped when comments are added (service layer)

### Rejected

- Discriminator patterns for ticket subtypes
- Pre-save hooks for status transitions (kept in service layer per architecture rule)

### Reason

Schema validation catches data integrity issues at persistence boundary. State machine logic intentionally lives in services, not Mongoose hooks, for testability and clear error messages.

---

## Prompt 4: Ticket CRUD

### Original Prompt

```
Role: Senior Express / Node.js API engineer implementing ticket resources.

Context:
Mongoose models exist. Backend uses layered architecture: routes → validators → controllers → services → models.
Assessment requires full ticket CRUD with soft delete, request validation, proper HTTP status codes, and no business logic in controllers.

Objective:
Implement complete Ticket CRUD through the service layer with validation and production-quality responses.

Requirements:
- Create Ticket
- Get All Tickets
- Get Ticket (by id)
- Update Ticket
- Delete Ticket (soft delete preferred; implement soft delete rather than hard delete)

Also:
- Validate requests (express-validator or existing validator stubs)
- Return proper HTTP codes (e.g. 201 create, 200 success, 404 not found)
- Use the service layer for all business/query logic
- Write production-quality, assessor-readable code

Constraints:
- Controllers stay thin — no query/filter/business rules in controllers
- Soft delete: set `deletedAt`; exclude soft-deleted tickets from list/detail flows
- Do NOT hard-delete tickets
- Do NOT return deleted tickets in list results
- Reuse helpers (e.g. get-active-by-id) if useful for later comment APIs
- Pagination on list is welcome if it fits cleanly

Deliverables:
1. Ticket service with full CRUD + soft delete
2. Controllers/routes/validators wired to the service
3. Consistent population of related fields (e.g. `createdBy`, `assignedTo`) where designed
4. Integration tests covering create/read/update/delete flows if the project already has that harness

Assumptions:
- Soft delete is the default design (not merely optional)
- Active tickets are those with `deletedAt: null` / unset
- Population field selection should be consistent via shared constants if the project uses them

Acceptance criteria:
- All five operations work end-to-end
- Soft-deleted tickets are hidden from normal queries
- Service layer owns query filters and persistence rules
- Proper HTTP status codes and clear not-found behavior

Output format: implement the ticket CRUD stack; briefly list endpoints and soft-delete behavior.
```

### AI Summary

The AI implemented `ticket.service.js` with full CRUD, soft delete via `deletedAt`, population of `createdBy`/`assignedTo`, input validation through express-validator, proper HTTP status codes (201, 200, 404), and integration tests for create/read/update/delete flows.

### Accepted

- Service layer pattern (`ticket.service.js`)
- Soft delete (set `deletedAt`, exclude from queries)
- `getActiveTicketById` helper reused by comment service
- Population constants for consistent field selection
- Pagination support in `getTickets`

### Modified

- Soft delete changed from "optional" to implemented default
- Duplicate prompt sent twice — same implementation verified, no duplicate code

### Rejected

- Hard delete
- Returning deleted tickets in list results
- Business logic in controllers

### Reason

Soft delete preserves data for assessment demos and matches design docs. Service layer centralizes query filters (`deletedAt: null`).

---

## Prompt 5: Comment APIs

### Original Prompt

```
Role: Senior Express API engineer implementing nested comment resources.

Context:
Ticket CRUD and soft-delete helpers exist. Comments belong to tickets and must not create orphans.
API contract expects comments nested under tickets (e.g. `/api/tickets/:id/comments`).
Architecture remains MVC / layered: thin controllers, logic in services.

Objective:
Implement Comment APIs for creating and listing comments on a ticket, with ticket existence checks and meaningful responses.

Implement:
- Create Comment
- Get Comments (for a ticket)

Also:
- Validate that the parent ticket exists (and is active / not soft-deleted)
- Update parent ticket timestamps when comments are added (keep list “recent activity” accurate)
- Return meaningful HTTP responses (e.g. 201 create, 200 list, 404 missing ticket)
- Use MVC / service-layer architecture

Constraints:
- Nested under tickets — match the API contract route pattern
- Do NOT add comment edit/delete endpoints (out of scope)
- Do NOT allow anonymous comments without an author
- Prefer reusing ticket “get active by id” helpers
- Controllers remain thin

Deliverables:
1. Comment service + controller/route/validator wiring
2. Nested routes under tickets
3. Populated author fields in responses where designed
4. Parent ticket `updatedAt` bump on create

Assumptions:
- Comments sorted by `createdAt` ascending is appropriate for thread display
- Ticket detail responses may also include comments later; dedicated comments endpoint is still required
- Author must be a valid user reference

Acceptance criteria:
- Creating a comment on a missing/deleted ticket fails clearly (404)
- Listing comments returns only comments for that ticket
- Orphan comments are prevented by ticket existence checks
- Responses are assessor-readable and status-coded correctly

Output format: implement comment APIs; confirm routes, validation, and timestamp behavior briefly.
```

### AI Summary

The AI implemented `comment.service.js` and wired routes under `/api/tickets/:id/comments` with ticket existence checks, author validation, parent ticket `updatedAt` bump, populated author names, and 201/200/404 responses.

### Accepted

- Nested route pattern matching API contract
- Reuse of `getActiveTicketById` from ticket service
- Comments sorted by `createdAt` ascending
- Author populated in list responses

### Modified

- Comments included in ticket detail response (GET `/tickets/:id`) in addition to dedicated comments endpoint

### Rejected

- Comment edit/delete endpoints (out of scope)
- Anonymous comments without author

### Reason

Validating ticket existence prevents orphan comments. Bumping `updatedAt` keeps list sort-by-recent accurate.

---

## Prompt 6: Search and Filtering

### Original Prompt

```
Role: Senior backend engineer implementing ticket list query capabilities.

Context:
Ticket list endpoint exists. Design docs specify keyword search, status filtering, indexes, and pagination.
Query construction should be isolatable for unit tests (prefer a pure domain/helper module over burying filters only inside HTTP handlers).

Objective:
Implement search and filtering for tickets, combinable, case-insensitive where applicable, backed by MongoDB indexes, with paginated results if straightforward.

Requirements:
- Keyword search
- Status filter
- Combine filters (search + status together)
- Case-insensitive matching where relevant
- Use / respect MongoDB indexes (text index for search)
- Return paginated results if easily supported

Constraints:
- Do NOT introduce Elasticsearch / Atlas Search
- Do NOT require fuzzy matching beyond MongoDB text-index defaults
- Prefer a pure filter/sort builder (e.g. `domain/ticketQuery.js`) unit-testable without HTTP
- Keep soft-deleted tickets excluded from list results
- Controllers stay thin; service/domain own query assembly

Deliverables:
1. Filter/sort builder functions
2. List endpoint integration of search, status, and pagination
3. Query validators for list params as needed
4. Unit tests for query building if the project has a unit-test pattern

Assumptions:
- `$text` search for simple alphanumeric queries is acceptable
- Regex fallback may be used when special characters make `$text` unsuitable
- Pagination metadata should follow existing response conventions

Acceptance criteria:
- Search and status can be combined in one request
- Results remain paginated with clear metadata when pagination is used
- Query logic is unit-testable independent of Express
- No external search engine dependencies

Output format: implement search/filter/pagination; briefly explain text vs regex behavior and sort rules.
```

### AI Summary

The AI implemented `domain/ticketQuery.js` for filter building, MongoDB `$text` search with regex fallback, status filter combination, case-insensitive matching, pagination via `utils/pagination.js`, and list endpoint query validators.

### Accepted

- Pure `buildTicketListFilter` / `buildTicketListSort` functions (unit tested)
- `$text` search for simple alphanumeric queries
- Regex fallback for special characters
- Combined `search` + `status` filters
- Paginated response metadata

### Modified

- Text score sorting when using `$text`; `createdAt` sort otherwise

### Rejected

- Elasticsearch / Atlas Search integration
- Fuzzy matching beyond MongoDB text index defaults

### Reason

`ticketQuery.js` isolates query construction for unit testing independent of HTTP layer. Pagination was straightforward to add via existing list endpoint.

---

## Prompt 7: Status State Machine

### Original Prompt

```
Role: Senior domain-driven backend engineer specializing in state machines and testable service layers.

Context:
This is the assessment’s core “judgment” piece. Ticket statuses must follow a strict transition graph.
Architecture rule: business rules live in a pure domain module and are enforced in the service layer — not in Mongoose hooks, controllers, or validators alone.

Objective:
Explain the design FIRST, then implement a unit-testable ticket status state machine with clear rejection of invalid transitions.

Allowed transitions:
- Open → In Progress
- In Progress → Resolved
- Resolved → Closed
- Open → Cancelled
- In Progress → Cancelled

Reject all other transitions.

Requirements:
- Business rules must exist only in the service/domain layer (pure domain module + service enforcement)
- Return clear, human-readable error messages
- Generate a unit-testable implementation
- Explain the design before coding

Constraints:
- Do NOT implement the state machine in Mongoose pre-save hooks
- Do NOT put transition rules in the controller or validator layer as the source of truth
- Do NOT invent admin override of transitions (no auth/RBAC yet)
- Prefer a dedicated status endpoint if that matches the API contract (e.g. PATCH status)
- Domain module must have no Mongoose imports

Deliverables (in order):
1. Short design explanation (module boundaries, where enforcement happens, error shape)
2. Pure domain module (transition map, canTransition / allowedNextStatuses / assert helpers)
3. Service-layer enforcement wired to update flow / status endpoint
4. Unit tests for the domain module
5. Clear invalid-transition errors (e.g. 409 INVALID_TRANSITION)

Assumptions:
- Status labels for user-friendly messages are helpful
- `allowedNextStatuses` may be exposed to the frontend for UI action buttons
- Existing typed error / conflict patterns should be reused if present

Acceptance criteria:
- Every allowed transition succeeds; every disallowed transition fails with a clear message
- Domain module is independently unit tested
- Enforcement occurs at exactly one business layer (service), using the pure domain module
- Design explanation appears before implementation in the AI response

Output format: design notes first, then code + tests; summarize transition API briefly.
```

### AI Summary

The AI explained the design (pure `domain/statusMachine.js` module + service enforcement), then implemented `TRANSITIONS` map, `canTransition`, `allowedNextStatuses`, `assertValidStatusTransition` in service layer, `409 INVALID_TRANSITION` errors with human-readable messages, and unit tests for the domain module.

### Accepted

- Pure domain module with no Mongoose imports
- `PATCH /tickets/:id/status` dedicated endpoint
- `STATUS_LABELS` for user-friendly error messages
- `allowedNextStatuses` exposed to frontend for UI buttons
- Unit tests in `tests/unit/statusMachine.test.js`

### Modified

- Design explanation provided inline before code generation (as requested)

### Rejected

- State machine in Mongoose pre-save hooks
- State machine in controller or validator layer
- Allowing admin override of transitions (no auth/RBAC yet)

### Reason

Pure domain module is the assessment's core "judgment piece" — independently unit testable and enforced at exactly one layer (service).

---

## Prompt 8: Backend Validation

### Original Prompt

```
Role: Senior Express API engineer implementing request validation with express-validator.

Context:
Ticket and comment endpoints exist. Invalid input must be rejected consistently before it reaches services.
The API should return a standardized validation error envelope suitable for frontend field-level display.

Objective:
Implement backend validation using express-validator for ticket and comment inputs, rejecting invalid data with standardized errors.

Validate (as applicable to create/update/status/comment/assignment flows):
- Title
- Description
- Priority
- Status
- Comment body
- Assignment (assignee / ObjectId where relevant)

Also:
- Reject invalid input (do not silently coerce bad enums to defaults)
- Return standardized validation errors

Constraints:
- Use express-validator only — do NOT add Joi/Yup alongside it
- Prefer shared field validator chains reused across create/update/status endpoints
- Include ObjectId format checks where route/body ids are required
- Trim and length-constrain text fields appropriately
- Keep error shape consistent with project error conventions

Deliverables:
1. Shared field validators (e.g. under `validators/shared/`)
2. Resource-specific validator compositions
3. Validation middleware producing a standard envelope (e.g. `VALIDATION_ERROR` with field → message details)
4. Integration tests for invalid inputs if the harness exists

Assumptions:
- List query validators (`status`, `page`, `limit`) may be added even if not listed above, if needed by the list endpoint
- Enum validation must match model/constants enums
- Frontend will map `details` to field-level UI errors

Acceptance criteria:
- Invalid title/description/priority/status/comment/assignment are rejected
- Error response shape is consistent and machine-readable
- Shared validators reduce duplication between create and update
- No silent defaulting of invalid enums

Output format: implement validators + middleware; show example error JSON shape briefly.
```

### AI Summary

The AI created shared field validator chains in `validators/shared/fieldValidators.js`, resource-specific validator compositions, `validate.middleware.js` producing `{ error: { code: 'VALIDATION_ERROR', details: { field: message } } }`, and integration tests for invalid inputs.

### Accepted

- Shared validators reused across create/update/status endpoints
- ObjectId format validation middleware
- Trim and length constraints on title/description/comment body
- Enum validation for priority and status

### Modified

- List query validators added for `status`, `page`, `limit` (not in original prompt but needed)

### Rejected

- Joi/Yup alongside express-validator (single validation library)
- Silently coercing invalid enums to defaults

### Reason

Shared validators reduce duplication between create and update chains. Standardized error envelope enables frontend field-level error display.

---

## Prompt 9: Centralized Error Handling

### Original Prompt

```
Role: Senior Express engineer implementing consistent API error handling and logging.

Context:
Services throw domain/HTTP errors; validators produce validation failures; Mongoose can throw cast, validation, and duplicate-key errors.
The frontend and tests need a single JSON error shape. Controllers should not wrap every handler in try/catch.

Objective:
Implement centralized error handling with custom error classes, 404 handling, validation/Mongo/unexpected error mapping, consistent JSON responses, and logging.

Create / cover:
- Custom error classes
- 404 handler (unmatched routes)
- Validation error handling
- Mongo / Mongoose error mapping
- Unexpected errors → safe 500 responses
- Consistent JSON response envelope
- Request / error logging

Constraints:
- Prefer centralized handler over per-controller try/catch
- Do NOT expose stack traces in production API responses
- Hide internal unexpected-error messages in production where appropriate
- Reuse or supersede any legacy `ApiError` utility with a typed `errors/` module if that improves consistency
- Keep security defaults (no secret leakage in logs beyond normal request metadata)

Deliverables:
1. Typed error classes (e.g. AppError, NotFound, Validation, Conflict, BadRequest)
2. Global error middleware and not-found middleware
3. Mongoose CastError / validation / duplicate-key mapping to appropriate status codes
4. Structured logger + request logging middleware
5. Brief example of the JSON error shape

Assumptions:
- Duplicate key → 409; cast errors → 400; unknown → 500
- Existing `asyncHandler` (if present) should work with the centralized handler
- Frontend will parse a stable error envelope

Acceptance criteria:
- All error paths produce a consistent JSON shape
- Production responses do not include stacks
- Controllers remain free of repetitive try/catch error formatting
- Logging includes useful request metadata (method, path, status, duration)

Output format: implement errors module + middleware; summarize mapping table briefly.
```

### AI Summary

The AI implemented `errors/` module (`AppError`, `NotFoundError`, `ValidationError`, `ConflictError`, `BadRequestError`), global `errorHandler.middleware.js` mapping Mongoose cast/validation/duplicate errors, `notFound.middleware.js`, structured `logger.js`, and request logging middleware.

### Accepted

- Typed error classes with `statusCode` and `code`
- Mongoose `CastError` → 400, duplicate key → 409
- Unknown errors → 500 with message hidden in production
- Request logger with method, path, status, duration

### Modified

- Legacy `ApiError` in `utils/` superseded by `errors/` module

### Rejected

- Stack traces in production API responses
- Per-controller try/catch blocks (centralized handler preferred)

### Reason

Consistent error shape simplifies frontend `apiError.js` parsing and integration test assertions.

---

## Prompt 10: MongoDB Seed Script

### Original Prompt

```
Role: Senior backend engineer writing a reusable MongoDB seed for demos and tests.

Context:
Models for User, Ticket, and Comment exist. Assessment demos and integration tests need deterministic sample data with valid relationships.
Prefer a reusable seed module callable from CLI and from tests — not random faker data on every run.

Objective:
Generate a reusable MongoDB seed script that seeds Users, Tickets, and Comments with valid relationships.

Seed:
- Users
- Tickets
- Comments

Requirements:
- Relationships must be valid (comments reference real tickets/authors; tickets reference real users)
- Script must be reusable (importable module + CLI entry)
- Deterministic data preferred for reproducible tests

Constraints:
- Do NOT rely on random/faker data as the primary seed
- Do NOT auto-run production seed on server startup
- Passwords must be hashed (e.g. bcrypt) — never store plaintext
- Support clearing existing data via an option when appropriate
- Keep demo credentials documented as demo-only (not production secrets)

Deliverables:
1. Seed data definitions
2. Importable seed function (for tests)
3. CLI script (e.g. `npm run seed`)
4. Brief summary of entity counts and key relationships

Assumptions:
- A shared demo password for all seeded users is acceptable for local/demo use
- Keyed entities (`usersByKey`, `ticketsByKey`) help tests target known records
- Relative timestamps improve demo realism

Acceptance criteria:
- Seed creates coherent Users ↔ Tickets ↔ Comments graph
- Same seed can be used from CLI and integration test helpers
- Data is deterministic enough for stable tests
- No plaintext passwords persisted

Output format: implement seed modules; confirm how to run CLI and reuse in tests.
```

### AI Summary

The AI created `scripts/seed/seedData.js`, `seedDatabase.js` (importable), `seed.js` (CLI via `npm run seed`), 4 users, 8 tickets, 6 comments with valid cross-references, bcrypt password hashing, and relative timestamps.

### Accepted

- Keyed entities (`usersByKey`, `ticketsByKey`) for test reuse
- `clearExisting` option
- Demo password `Demo@1234` for all users
- `bcryptjs` dependency for password hashing

### Modified

- Seed module exported for integration test helper (`seedIntegrationDatabase`)

### Rejected

- Random/faker data (deterministic seed preferred for reproducible tests)
- Production seed on server startup

### Reason

Reusable seed function supports both CLI demo setup and automated integration tests with known data shapes.

---

## Prompt 11: Frontend Pages

### Original Prompt

```
Role: Senior React engineer wiring assessment pages to a live Express API.

Context:
Backend APIs for tickets, comments, search/filter, and status transitions exist.
Frontend scaffolding (pages, layouts, Axios client stubs) exists.
UI flow covers Dashboard, Ticket List, Ticket Detail, Create/Edit, search, status update, and comments.
Goal is end-to-end MERN demonstration for assessors — real API calls, not mocks.

Objective:
Implement frontend pages connected to the backend with Axios, including loading and error handling.

Pages / features to wire:
- Dashboard
- Ticket List
- Ticket Detail
- Create Ticket
- Edit Ticket
- Search
- Status Update
- Comment Section

Requirements:
- Connect to backend using Axios
- Handle loading and errors on every data fetch
- Keep UX assessor-readable (skeletons/alerts/retry where appropriate)
- Client-side form validation before submit is welcome

Constraints:
- Do NOT rely on mock data mode / MSW for this step
- Do NOT implement optimistic UI without refetch as the primary pattern
- Prefer search on the list page (URL-synced) rather than inventing a separate search route if design already decided that
- Preserve existing folder/routing conventions from scaffolding
- Plain CSS / existing styles — no new CSS-in-JS library

Deliverables:
1. Functional pages against the live API
2. Loading and error states with retry where useful
3. Debounced / URL-synced search on the list page
4. Status action buttons and comment form/list on detail
5. Dashboard summary from ticket list data (as designed)

Assumptions:
- Backend is running locally and reachable via the Vite `/api` proxy
- Status buttons should respect allowed transitions when API exposes them
- Basic CSS styling is sufficient for assessment polish

Acceptance criteria:
- All listed screens work end-to-end against the API
- Loading and error paths are visible and recoverable
- Search, status update, and comments function on the appropriate pages
- No mock-only development mode required to demo the app

Output format: implement/wire the pages; briefly map routes to features.
```

### AI Summary

The AI wired all pages to backend APIs with loading skeletons, error alerts with retry, debounced URL-synced search on list page, status action buttons, comment form/list on detail page, dashboard summary cards, and basic CSS styling.

### Accepted

- All pages functional against live API
- Loading and error states on every data fetch
- Client-side validation in forms before submit
- Dashboard aggregating from ticket list data

### Modified

- Search kept on list page (not separate route) per design decision

### Rejected

- Mock data mode / MSW for development
- Optimistic UI updates without refetch

### Reason

End-to-end wired pages demonstrate full MERN stack integration for assessment review.

---

## Prompt 12: Frontend Service Layer and Hooks

### Original Prompt

```
Role: Senior React engineer building a reusable API service layer and data hooks.

Context:
Pages are (or will be) calling the backend. Raw Axios usage in every component is hard to maintain.
Assessment prefers a clear client architecture: HTTP client → resource services → reusable hooks, plus toast feedback for mutations.
Avoid adding React Query / SWR unless necessary — custom hooks are preferred for this scope.

Objective:
Connect frontend to backend via an API service layer and reusable hooks that handle loading, errors, optional retries, and toast notifications.

Create / handle:
- API service layer (HTTP client + resource services)
- Loading state handling
- Error handling
- Retries (optional but welcome for network/5xx during local dev)
- Toast notifications
- Reusable hooks for list/detail/create/update/delete flows

Constraints:
- Do NOT add React Query or SWR (no new data-fetching dependency; custom hooks sufficient)
- Do NOT replace per-page error alerts with only a global error boundary
- Prefer keeping low-level `api/` wrappers beneath a `services/` layer if both exist
- Retries should use backoff and target transient failures (network / 5xx), not all 4xx
- Follow existing Context patterns for toasts

Deliverables:
1. `httpClient` (and retry helper if implemented)
2. Resource services (`ticketService`, `commentService`, `userService`, etc.)
3. Hooks such as `useAsync`, `useMutation`, `useTickets`, `useTicket`, create/update helpers
4. Working ToastContext integrated with mutations
- Barrel exports from hooks/services if that matches project style

Assumptions:
- Exponential backoff with a small retry count (e.g. 2) is enough for local resilience
- `useDebounce` for search input is useful alongside list hooks
- Components should depend on hooks/services, not raw Axios details

Acceptance criteria:
- Components can load/mutate tickets and comments through hooks/services
- Loading and error states are consistent and reusable
- Toasts provide mutation feedback
- No React Query / SWR dependency introduced

Output format: implement services + hooks; briefly document the call chain (component → hook → service → httpClient).
```

### AI Summary

The AI created `services/httpClient.js`, `retry.js` (2 retries on network/5xx), resource services (`ticketService`, `commentService`, `userService`), hooks (`useAsync`, `useMutation`, `useTickets`, `useTicket`, `useCreateTicket`, etc.), and working `ToastContext`.

### Accepted

- Retry wrapper with exponential backoff
- `useMutation` hook for create/update/delete with toast feedback
- `useDebounce` for search input
- Barrel exports from `hooks/index.js`

### Modified

- Low-level `api/` folder retained beneath `services/` layer

### Rejected

- React Query / SWR (no new dependency; custom hooks sufficient)
- Global error boundary replacing per-page error alerts

### Reason

Service layer abstracts HTTP details from components. Retries improve resilience during local dev when MongoDB is starting.

---

## Implementation Phase Summary

| Metric | Value |
|--------|-------|
| Prompts logged | 12 |
| Backend files | ~45 source files |
| Frontend files | ~78 source files |
| Key pattern | Scaffolding → models → services → UI → hooks |
| Stretch deferred | JWT auth, RBAC, protected routes |

## Related Artifacts

- [`../server/src/`](../server/src/)
- [`../client/src/`](../client/src/)
- [`../implementation-plan.md`](../implementation-plan.md)
- [`./03-backend-implementation.md`](./03-backend-implementation.md)
- [`./04-frontend-implementation.md`](./04-frontend-implementation.md)
