---
status: completed
---

<task_context>
<domain>engine/infra/container</domain>
<type>implementation</type>
<scope>configuration</scope>
<complexity>low</complexity>
<dependencies>database</dependencies>
</task_context>

# Task 6.0: DI Container Registrations

## Overview

Wire application ports (use cases, queries) and infrastructure implementations into the DI container so Server Actions can resolve them.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Register repository, UoW, use cases, and queries per Tech Spec.
- Maintain stable tokens; avoid circular dependencies.
</requirements>

## Subtasks

- [x] 6.1 Add container registrations for all ports and implementations
- [x] 6.2 Verify resolving ports from Server Actions

## Implementation Details

Tech Spec: Container Registrations section.

### Relevant Files

- `src/infrastructure/container.ts`

### Dependent Files

- `src/infrastructure/actions/members/*.ts`
- `src/application/*`

## Success Criteria

- All ports resolve without runtime errors.
