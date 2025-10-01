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

# Task 2.0: Application DTOs and Write Use Cases

## Overview

Define DTOs and implement use cases for register, update, archive, restore, delete (with confirmation), and classification change. Ensure clear error messages and proper mapping to domain operations.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Register must validate required PRD R1.1/R1.3 fields and return `MemberView`.
- Update must allow non-immutable fields per PRD R2.1; no audit trail per R2.2.
- Archive/Restore must satisfy PRD R3.1–R3.3.
- Hard Delete must require two-step confirmation per PRD R4.1–R4.3.
- Classification change must satisfy PRD R5.1–R5.2.
</requirements>

## Subtasks

- [ ] 2.1 Define `CreateMemberDTO`, `UpdateMemberDTO`, and `MemberView` DTOs
- [ ] 2.2 Implement use cases: register, update, archive, restore, delete, changeClassification

## Implementation Details

Reference Tech Spec: Implementation Design → Core Interfaces, Data Models.

### Relevant Files

- `src/application/dtos/*.ts`
- `src/application/use-cases/*.ts`

### Dependent Files

- `src/infrastructure/container.ts`
- `src/infrastructure/actions/members/*.ts`

## Success Criteria

- All use cases return expected DTOs and errors.
- No direct persistence logic in application layer.
