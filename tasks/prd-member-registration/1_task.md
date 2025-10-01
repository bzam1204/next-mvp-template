---
status: completed
---

<task_context>
<domain>engine/domain</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>database</dependencies>
</task_context>

# Task 1.0: Domain Aggregate and Invariants

## Overview

Define the `Member` aggregate, value objects, and domain events capturing classification, visibility status, and PRD‑required civil/ecclesiastical fields. Enforce invariants in aggregate methods and emit events for state transitions.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Enforce PRD R1.1 and R1.3 for mandatory fields and classification on creation.
- Support lifecycle visibility per PRD R5.2 (active/archived).
- Support classification per PRD R5.1 (communicant/non‑communicant).
- Emit domain events: Registered, Updated, Archived, Restored, Deleted, ClassificationChanged.
</requirements>

## Subtasks

- [x] 1.1 Model `Member` with core profile and ecclesiastical fields; validate required fields
- [x] 1.2 Implement `archive`, `restore`, `changeClassification`, `update`, `delete` behaviors with events

## Completion

- [x] 1.0 Domain Aggregate and Invariants ✅ COMPLETED
  - [x] 1.1 Implementation completed
  - [x] 1.2 Task definition, PRD, and tech spec validated
  - [x] 1.3 Rules analysis and compliance verified
  - [x] 1.4 Code review completed with Zen MCP
  - [x] 1.5 Ready for next phase

## Implementation Details

Reference Tech Spec sections: Executive Summary, System Architecture → Domain, Data Models → Member, Domain events.

### Relevant Files

- `src/domain/member/Member.ts`
- `src/domain/member/events/*.ts`

### Dependent Files

- `src/application/use-cases/*.ts`
- `src/infrastructure/repositories/prisma-member.repository.ts`

## Success Criteria

- Aggregate rejects invalid creation without mandatory fields.
- State transitions enforce invariants and emit correct events.
