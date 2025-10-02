---
status: completed
---
<task_context>
`<domain>`engine/infra/cache`</domain>`
`<type>`implementation`</type>`
`<scope>`configuration`</scope>`
`<complexity>`low`</complexity>`
`<dependencies>`http_server`</dependencies>`
</task_context>

# Task 8.0: QueryKeys and Cache Invalidation

## Overview

Define centralized QueryKeys for members and implement consistent cache invalidation rules for all mutations.

`<import>`**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc`</import>`

<requirements>
- Keys for `members.root`, `members.search(params)`, and `members.byId(id)`.
- After mutations, invalidate `root()` and specific `byId` when applicable.
</requirements>

## Subtasks

- [X] 8.1 Implement `QueryKeys` object
- [X] 8.2 Apply invalidation in controllers/hooks after mutations

## Implementation Details

Tech Spec: Caching Keys; Development Sequencing.

### Relevant Files

- `src/infrastructure/cache/query-keys.ts`

### Dependent Files

- `src/infrastructure/hooks/members/*.ts`
- `src/infrastructure/actions/members/*.ts`

## Success Criteria

- Mutations reliably refresh lists and details.
- No stale data after create/update/archive/restore/delete/classification changes.
