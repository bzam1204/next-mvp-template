---
status: completed
---
<task_context>
`<domain>`src/app `</domain>`
`<type>`implementation `</type>`
`<scope>`core_feature `</scope>`
`<complexity>`high `</complexity>`
`<dependencies>`shadcn `</dependencies>`
</task_context>

# Task 10.0: UI Pages (List, Detail, Forms)

## Overview

Build pages for member list with filters and pagination, member detail, and forms for create/update using Shadcn shell. Integrate hooks and ensure smooth UX with minimal unnecessary re-renders.

<import>**MUST READ BEFORE STARTING** @rules/*.md </import>

<requirements>
- List supports filtering by name/profile and visibility; paginated results.
- Detail page shows full `MemberView` and actions.
- Create/Update forms validate required fields per PRD R1.1/R1.4; surface server errors.
</requirements>

## Subtasks

- [x] 10.1 Implement `/members` page (filters, pagination, actions)
- [x] 10.2 Implement `/members/[id]` detail and `/members/new` + `/members/[id]/edit` forms

## Implementation Details

Tech Spec: UI components overview; Caching; Standards (avoid unnecessary re-renders).

### Relevant Files

- `src/app/members/page.tsx`
- `src/app/members/[id]/page.tsx`
- `src/app/members/new/page.tsx`
- `src/app/members/[id]/edit/page.tsx`

### Dependent Files

- `src/infrastructure/hooks/members/*.ts`
- `src/infrastructure/actions/members/*.ts`

## Success Criteria

- Flows: create, update, archive/restore, delete, classification change all reachable and functional.
- Validation errors clear; 95th percentile list render ≤ 1.5s on dev data.
