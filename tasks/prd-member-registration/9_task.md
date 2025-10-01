---
status: pending
---

<task_context>
<domain>engine/infra/hooks</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 9.0: React Query Hooks (CRUD/Search/Detail)

## Overview

Create hooks to call Server Actions and manage caching for create/update/archive/restore/delete/classification, search, and detail retrieval.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- No direct `fetch` in hooks (standards compliance).
- Use centralized `QueryKeys` and apply invalidations consistently.
- Stable inputs/keys to avoid unnecessary re-renders.
</requirements>

## Subtasks

- [ ] 9.1 Implement `useSearchMembers` and `useMemberById`
- [ ] 9.2 Implement mutation hooks for CRUD and classification changes

## Implementation Details

Tech Spec: System Architecture; Caching; Standards Compliance (no fetch in hooks).

### Relevant Files

- `src/infrastructure/hooks/members/*.ts`

### Dependent Files

- `src/infrastructure/actions/members/*.ts`
- `src/infrastructure/cache/query-keys.ts`

## Success Criteria

- Hooks return typed data and status; invalidations update UI as expected.
- Minimal re-renders under typical usage.

