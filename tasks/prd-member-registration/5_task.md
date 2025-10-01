---
status: pending
---

<task_context>
<domain>engine/infra/persistence</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>database</dependencies>
</task_context>

# Task 5.0: Repository, Unit of Work, and Event Bus

## Overview

Implement Prisma repository for `Member`, Unit of Work abstraction wrapping transactions, and a simple Event Bus to publish domain events post-commit.

<import>**MUST READ BEFORE STARTING** @.cursor/rules/critical-validation.mdc</import>

<requirements>
- Repository implements save/find/delete for `Member` aggregate.
- UoW ensures events are published only after successful commit.
- No PII in logs; errors propagate cleanly to application layer.
</requirements>

## Subtasks

- [ ] 5.1 Implement `PrismaMemberRepository`
- [ ] 5.2 Add `UnitOfWork` and event publication on commit

## Implementation Details

Tech Spec: System Architecture (UoW, events), Integration Points, Monitoring & Observability.

### Relevant Files

- `src/infrastructure/repositories/prisma-member.repository.ts`
- `src/infrastructure/uow/index.ts`
- `src/infrastructure/events/event-bus.ts`

### Dependent Files

- `src/infrastructure/container.ts`
- `src/application/use-cases/*.ts`

## Success Criteria

- Repository methods persist and retrieve aggregates reliably.
- Events emitted by aggregate are published post-commit.

