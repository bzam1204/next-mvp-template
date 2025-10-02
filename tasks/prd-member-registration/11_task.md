---
status: pending
---

<task_context>
<domain>engine/ui</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 11.0: Hard Delete Two-Step Confirmation (UX + Enforcement)

## Overview

Implement the two-step confirmation UX for permanent delete and server-side enforcement that requires typing `DELETE {memberId}` exactly.

<import>**MUST READ BEFORE STARTING** @rules/*.md </import>

<requirements>
- PRD R4.1–R4.3: irreversible delete with explicit typed confirmation; clear warnings.
- Server action validates exact confirmation string before deleting.
</requirements>

## Subtasks

- [ ] 11.1 UX modal + typed confirmation; wire to delete mutation
- [ ] 11.2 Implement server-side confirmation check

## Implementation Details

Tech Spec: Special Requirements (Hard delete), Error handling, Observability.

### Relevant Files

- `src/infrastructure/actions/members/delete-member.action.ts`
- `src/app/members/[id]/page.tsx`

### Dependent Files

- `src/infrastructure/hooks/members/useDeleteMember.ts`
- `src/infrastructure/cache/query-keys.ts`

## Success Criteria

- Incorrect confirmation string blocks deletion with clear error.
- Successful deletion invalidates list caches and navigates appropriately.
