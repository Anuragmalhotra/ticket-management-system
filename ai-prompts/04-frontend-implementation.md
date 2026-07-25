# Prompt Pack: Frontend Implementation

## Metadata

| Field | Value |
|-------|-------|
| **Date** | 20 July 2026 |
| **Tool** | Cursor (Claude) |
| **Phase** | Implementation (Client) |
| **Historical log** | [implementation.md](./implementation.md) Prompts 2, 11–12 |

## Purpose

Build the React (Vite) SPA to match `ui-flow.md`, calling the Express API via Axios with loading, error, and toast UX.

## Canonical Prompt Sequence

### 1) Scaffold only

```
Role: Frontend lead scaffolding a Vite React SPA.

Objective: Create client/ with pages, components (tickets/comments/common/layout),
hooks, api/, services/, context stubs, AppRoutes, Layout.

Stack: React, Vite, React Router, Axios, Context API. JavaScript only.

Constraints: Scaffolding + stubs only — no live API wiring yet.
Proxy /api to the backend in Vite config.

Acceptance criteria: App boots; routes render stubs; folder layout matches ui-flow.md.
```

### 2) Wire pages

```
Implement Dashboard, Ticket List, Create, Detail, Edit.
Include search/filter on list (URL-synced), StatusActions (allowed transitions only),
CommentSection, loading skeletons, ErrorAlert + retry, client validation before submit.
Connect via Axios. No Redux. No mock/MSW mode required.
```

### 3) Services + hooks

```
Add service layer (httpClient, retry on network/5xx, ticket/comment/user services)
and reusable hooks (useAsync, useMutation, useTickets, useTicket, useDebounce, toasts).
Keep components free of raw Axios calls.
```

## AI Response Summary

Scaffolded Vite React app, then wired pages to the API with hooks/services, debounced search, status actions, comments, and toast feedback.

## Refinements

### Iteration 1 — Form state bug prevention

```
Review controlled forms: never reset local form state from unstable default object
identities (e.g. initialValues = {}). Prefer stable empty constants / primitive deps.
```

### Iteration 2 — List UX

```
Ensure Ticket List supports search, status filter, and clear loading/empty states
per ui-flow.md. Keep search on the list page (not a separate route).
```

## Mistakes Corrected

| Issue | Fix |
|-------|-----|
| Create ticket inputs clearing on keystroke | Stable `initialValues` + primitive sync deps in TicketForm |

## Human Decisions

| Decision | Rationale |
|----------|-----------|
| Context + hooks over Redux | Assessment simplicity |
| Custom hooks over React Query | No extra dependency |
| Search on list page | Matches design |

## Outcome

- Implementation log: [implementation.md](./implementation.md)
- Code: [`../client/src/`](../client/src/)
- Design: [`../ui-flow.md`](../ui-flow.md)
