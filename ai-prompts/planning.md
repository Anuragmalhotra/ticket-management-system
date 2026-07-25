# AI Usage — Planning Phase

> **Tool:** Cursor (Claude)  
> **Date:** 20 July 2026  
> **Phase:** Requirements analysis, repository scaffolding, workflow setup

This document records AI prompts used during the planning phase of the Support Ticket Management System assessment, including what was accepted, modified, or rejected.

---

## Prompt 1: Requirements Analysis

### Original Prompt

```
Role: Senior Full-Stack Software Architect specializing in MERN applications.

Context:
I am completing an AI Practical Assessment by building a Support Ticket Management System.
Fixed stack: MongoDB, Express, React, Node.js (JavaScript, not TypeScript).
Core scope: ticket CRUD, comments, status state machine, search/filter, validation, error handling, tests.
Stretch (design only for now): JWT auth and RBAC.

Objective:
Analyze the requirements thoroughly BEFORE any implementation so we can lock scope, assumptions, and milestones.

Constraints:
- Do NOT generate application code, schemas, or configuration files.
- Prefer clarity and assessor-readable structure over exhaustive enterprise architecture.
- Call out what is in-scope vs stretch vs out-of-scope.

Deliverables (markdown sections, in this order):
1. Requirements Analysis (problem statement + success criteria)
2. Functional Requirements (must-have)
3. Non-Functional Requirements (performance, maintainability, security defaults)
4. Assumptions
5. Edge Cases
6. Suggested Architecture (high level)
7. Suggested Tech Stack (within MERN constraints)
8. Suggested Folder Structure (monorepo)
9. Milestone Plan (phased)
10. Risks and Mitigations

Assumptions you may use unless contradicted:
- Single-tenant internal/helpdesk style app
- Soft delete for tickets
- Seed users/tickets/comments for demos and tests
- Auth is stretch and must not block core CRUD

Acceptance criteria:
- Every functional requirement maps to a later milestone
- Status lifecycle is identified as the primary domain “judgment” piece
- Risks include at least: scope creep, state machine bugs, test isolation, incomplete docs
- No code blocks containing implementation

Output format: structured markdown only.
```

### AI Summary

The AI analyzed assessment criteria (from related project docs) and produced a structured requirements breakdown covering ticket CRUD, comment threads, status state machine, search/filter, validation, error handling, and testing tiers. It recommended a monorepo with `client/` and `server/`, layered backend (routes → controllers → services → models), a pure domain module for the state machine, and a phased milestone plan from scaffolding through mandatory integration tests.

### Accepted

- MERN stack as the fixed technology choice
- Three core entities: User, Ticket, Comment
- Status state machine as the signature domain logic
- Service layer separation on the backend
- Phased implementation plan (models → API → UI → tests)
- Monorepo folder layout (`client/`, `server/`, `database/`, `ai-prompts/`)

### Modified

- Requirements were captured in conversation and design docs rather than fully populating `requirements-analysis.md` (left as structured TODO scaffold for candidate completion)
- Stretch features (auth, RBAC) deferred to later milestones rather than included in core scope

### Rejected

- Generating any application code at this stage (explicitly excluded by prompt)
- Alternative stacks (PostgreSQL, GraphQL, microservices) — not suitable for assessment constraints

### Reason

The prompt explicitly requested analysis only. The phased MERN architecture aligned with assessment acceptance criteria and kept scope manageable. Documentation scaffolds were preferred over premature implementation.

---

## Prompt 2: Repository Structure Scaffold

### Original Prompt

```
Role: Assessment repository scaffolder for a MERN ticket-management submission.

Objective:
Create the complete repository documentation tree required by the assessment checklist.

Constraints:
- Generate folders and Markdown files only.
- Each Markdown file must contain clear headings and TODO placeholders only.
- Do NOT generate application code, package.json files, or filled-in content.
- Do NOT invent extra top-level deliverables beyond the assessment list.

Required root Markdown files:
README.md, candidate-info.md, requirements-analysis.md, acceptance-criteria.md,
implementation-plan.md, design-notes.md, api-contract.md, data-model.md, ui-flow.md,
test-strategy.md, test-results.md, debugging-notes.md, code-review-notes.md,
review-fixes.md, reflection.md, pr-description.md, final-ai-usage-summary.md

Required directories (with placeholder docs as needed):
- database/ (schema, seed-data, setup notes)
- ai-prompts/ (phase logs + numbered prompt files)
- tool-specific/cursor-workflow/ (project memory for Cursor)

Assumptions:
- Monorepo; client and server source will be added in later phases
- Placeholder TODOs are intentional for candidate completion

Acceptance criteria:
- Every listed root file exists
- database/, ai-prompts/, and tool-specific/cursor-workflow/ exist
- No .js/.jsx/.ts source files created in this step
- README contains headings only (no full installation guide yet)

Output: create the files/folders; confirm the tree in a short summary.
```

### AI Summary

The AI created the full assessment repository tree with placeholder markdown files, subfolders for database schema/seed documentation, numbered `ai-prompts/` files, and `tool-specific/cursor-workflow/` workflow documents. No source code was generated.

### Accepted

- Complete folder hierarchy matching assessment deliverables
- TODO-placeholder pattern for traceability (candidate fills in during development)
- Separation of concerns across docs (`api-contract.md`, `data-model.md`, `ui-flow.md`, etc.)
- `ai-prompts/` and `tool-specific/cursor-workflow/` directories

### Modified

- Some design docs (`design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md`) were later populated by subsequent AI prompts instead of remaining as TODO-only files

### Rejected

- Pre-filling implementation details in planning docs at scaffold time
- Generating `server/` or `client/` source code in this step

### Reason

Assessment requires a documented, auditable repo structure before coding. Placeholder files establish the submission template without conflating planning artifacts with implementation.

---

## Prompt 3: Cursor Workflow Documents

### Original Prompt

```
Role: Staff engineer setting up durable Cursor project memory for a MERN assessment.

Objective:
Generate persistent workflow documents under tool-specific/cursor-workflow/ so future AI sessions inherit stable context.

Create these files:
- project-context.md — goals, stack, scope, non-goals
- spec.md — authoritative functional/technical specification
- tasks.md — ordered implementation checklist
- acceptance-criteria.md — mapped pass/fail criteria
- cursor-rules-or-instructions.md — coding standards + AI usage rules

Must include:
- Naming conventions and folder conventions
- Layered backend architecture rules (routes → validators → controllers → services → models)
- State machine rule: domain module only; enforce in services
- Testing strategy (unit + mandatory state-machine integration)
- AI usage rules: no blind acceptance, no secrets, minimal diffs, verify with tests

Constraints:
- Do NOT generate application code
- Do NOT embed real secrets or production credentials
- Keep docs concise enough for Cursor context windows

Acceptance criteria:
- Each file has a clear purpose statement at the top
- Rules are actionable (do / don’t), not vague advice
- Stretch features (auth/RBAC) are labeled as stretch

Output: Markdown files only, then a brief index of what each file is for.
```

### AI Summary

The AI generated persistent Cursor context files defining project goals, technical spec, task backlog, acceptance criteria mapping, and AI usage rules (validate output, no blind acceptance, security defaults, minimal diffs, test requirements).

### Accepted

- `project-context.md` as single source of project truth for AI sessions
- `spec.md` linking entities, endpoints, and state machine rules
- `tasks.md` as an implementation checklist
- `cursor-rules-or-instructions.md` with coding standards and AI guardrails
- Rule: do not generate code in workflow setup prompts

### Modified

- `tasks.md` and `acceptance-criteria.md` updated incrementally as features were implemented
- Additional files added later (`prompt-templates.md`, `session-log.md`) for session continuity

### Rejected

- Embedding secrets or environment-specific values in workflow docs
- Auto-approving terminal commands in AI rules (kept as manual approval)

### Reason

Persistent project memory reduces context loss across Cursor sessions. Coding standards and AI usage rules support responsible, reviewable development for the assessment.

---

## Prompt 4: Commit Message Suggestion

### Original Prompt

```
Role: Careful git collaborator following Conventional Commits.

Context:
I just completed Mongoose model work for User, Ticket, and Comment (indexes, enums, validation, relationships, soft delete on tickets).

Objective:
Suggest ONE concise commit message for these changes.

Constraints:
- Focus on why, not a file dump
- Prefer Conventional Commits (feat:, chore:, etc.)
- 1–2 sentence body max
- Do NOT run git commit or amend
- Do NOT suggest combining unrelated changes

Acceptance criteria:
- Message would make sense to an assessor reviewing git history
- No secrets in the message

Output: commit subject + optional short body only.
```

### AI Summary

The AI suggested a conventional commit message summarizing the Mongoose model implementation (User, Ticket, Comment) with indexes, validation, enums, timestamps, and relationships.

### Accepted

- Conventional commit style (`feat:` / `chore:`)
- Message focused on *why* (data layer foundation) rather than file list

### Modified

- Message was suggested only; commit was not executed automatically (per git safety rules)

### Rejected

- Overly long multi-paragraph commit bodies
- Combining unrelated changes into one commit

### Reason

A clear, scoped commit message helps assessment reviewers trace incremental progress. The candidate retains control over when and what to commit.

---

## Planning Phase Summary

| Metric | Value |
|--------|-------|
| Prompts logged | 4 |
| Code generated | None (by design) |
| Primary artifacts | Repo scaffold, workflow docs, requirements analysis |
| Key human decision | Defer auth/RBAC to stretch; prioritize core CRUD + state machine |

## Related Artifacts

- [`../requirements-analysis.md`](../requirements-analysis.md)
- [`../implementation-plan.md`](../implementation-plan.md)
- [`../acceptance-criteria.md`](../acceptance-criteria.md)
- [`../tool-specific/cursor-workflow/project-context.md`](../tool-specific/cursor-workflow/project-context.md)
- [`./01-requirements-analysis.md`](./01-requirements-analysis.md)
