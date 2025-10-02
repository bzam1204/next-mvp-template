---
status: completed
---

<task_context>
<domain>engine/infra/controllers</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Task 7.0: Server Actions (Controllers)

## Overview

Create Server Actions for register, update, archive, restore, delete (with confirmation), change classification, search, and get by id. Perform basic input validation and return DTOs only.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Implement endpoints per PRD Core Features R1–R5.
- Hard delete must enforce typed confirmation phrase exactly (e.g., `DELETE {memberId}`).
- Consistent error handling and messages per standards.
</requirements>

## Subtasks

- [X] 7.1 Implement actions: register/update/changeClassification
- [X] 7.2 Implement actions: archive/restore/delete + search/getById

## Implementation Details

Tech Spec: Core Interfaces; Integration Points; Error handling; Hard delete special requirement.

### Relevant Files

- `src/infrastructure/actions/members/*.ts`

### Dependent Files

- `src/infrastructure/container.ts`
- `src/application/*`

## Success Criteria

- All actions return correct DTOs and status codes.
- Validation errors are user-friendly and consistent.
- Hard delete confirmation enforced server-side.
