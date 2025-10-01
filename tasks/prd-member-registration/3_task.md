---
status: pending
---

<task_context>
<domain>engine/application</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>database</dependencies>
</task_context>

# Task 3.0: Read Queries (Search and Detail)

## Overview

Implement read-side query interfaces and Prisma-backed implementations for paginated member search with filters, and member detail by ID.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Support search filters (name, profile, visibility) per PRD user stories and Core Features.
- Return paginated results with total count; consistent DTO shapes.
- Provide `GetMemberById` for detail page data.
</requirements>

## Subtasks

- [ ] 3.1 Define `SearchMembersQuery` and `GetMemberByIdQuery` interfaces
- [ ] 3.2 Implement Prisma queries with proper indexing considerations

## Implementation Details

Tech Spec: Implementation Design → Core Interfaces; Data Models; Integration Points; Known Risks (indexes).

### Relevant Files

- `src/application/queries/*.ts`
- `src/infrastructure/queries/prisma-search-members.query.ts`
- `src/infrastructure/queries/prisma-get-member-by-id.query.ts`

### Dependent Files

- `prisma/schema.prisma`
- `src/infrastructure/cache/query-keys.ts`

## Success Criteria

- Search returns expected pagination and filtering results.
- Detail query returns full `MemberView` or null.

