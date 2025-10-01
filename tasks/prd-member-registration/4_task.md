---
status: pending
---

<task_context>
<domain>engine/infra/database</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>database</dependencies>
</task_context>

# Task 4.0: Prisma Schema, Migration, and Indexes

## Overview

Design and add the Prisma `Member` model, enums (classification, status), and necessary indexes to support search filters and pagination. Generate and apply the initial migration.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Map all PRD fields (R1.1, R1.2, R1.3) into schema with appropriate types.
- Include enums for `classification` and `status` reflecting PRD R5.1–R5.2.
- Add indexes on `fullName`, `status`, and fields used by filters.
</requirements>

## Subtasks

- [ ] 4.1 Update `schema.prisma` with `Member` model and enums
- [ ] 4.2 Create migration and verify constraints and indexes

## Implementation Details

Tech Spec: Data Models, Persistence; Known Risks (query performance); Integration Points.

### Relevant Files

- `prisma/schema.prisma`
- `prisma/migrations/*`

### Dependent Files

- `src/infrastructure/queries/*.ts`
- `src/infrastructure/repositories/prisma-member.repository.ts`

## Success Criteria

- Migration applies successfully; schema reflects all required fields.
- Indexes present for search performance.

