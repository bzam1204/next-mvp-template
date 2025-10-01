---
alwaysApply: true
---
# DDD Aggregate Root Standardization

<introduction>

## Introduction

Aggregate Roots represent consistency boundaries in our Domain-Driven Design. They encapsulate entities and value objects, expose only behavior that preserves invariants, and are the only objects persisted via repositories. This document standardizes how we define, construct, and use Aggregate Roots across the project to ensure consistency, readability, and maintainability.

</introduction>

<implementation>

## Structure and Location

- Entities (including aggregate roots) live under `@/domain/entities/<entity-name>/`.
- Repositories live under `@/domain/repositories/` with implementation adapters under `@/infrastructure/repositories/`.
- Injection tokens for repositories are centralized in `@/shared/constants/repository-constants.ts`.

## Class Design Rules

- Use private fields with getters to protect invariants.
- Keep identity (`id`) and `createdAt` immutable after construction.
- Expose intent-revealing methods (no direct property mutation from outside).
- Validate invariants at creation and on every state change using domain exceptions.
- Prefer a single constructor receiving a `ConstructorProps` interface when there are more than 3 properties.
- Provide a `static create(props: CreateXProps, idGenerator: IdGenerator)` factory for new instances.

Example skeleton:

```typescript
import { DomainException, EntityNotFoundException, InvalidOperationException } from '@/domain/exceptions/domain-exception';

import IdGenerator from '@/application/services/id-generator';

export default class ExampleAggregate {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _name: string;

  constructor(props: ExampleAggregateConstructorProps) {
    this._id = props.id;
    this._name = props.name;
    this._createdAt = props.createdAt;
  }

  public static create(props: CreateExampleAggregateProps, idGenerator: IdGenerator): ExampleAggregate {
    if (!ExampleAggregate.isValidName(props.name)) {
      throw new InvalidOperationException('Name is required and must have at least 3 characters.');
    }
    return new ExampleAggregate({ id: idGenerator.generate(), createdAt: new Date(), name: props.name });
  }

  public rename(newName: string): void {
    if (!ExampleAggregate.isValidName(newName)) {
      throw new InvalidOperationException('Name must have at least 3 characters.');
    }
    this._name = newName;
  }

  private static isValidName(name: string): boolean {
    return typeof name === 'string' && name.trim().length >= 3;
  }

  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get name(): string {
    return this._name;
  }
}

interface CreateExampleAggregateProps {
  name: string;
}

interface ExampleAggregateConstructorProps {
  id: string;
  createdAt: Date;
  name: string;
}
```

## Repository Interfaces

- Define repository interfaces in `@/domain/repositories` with the name `<Entity>Repository`.
- Methods must be explicit and use complete names (no abbreviations):
  - `save(entity: Entity): Promise<Entity>`
  - `findById(id: string): Promise<Entity | null>`
  - `delete(id: string): Promise<void>`
  - Additional `findBy<UniqueField>` as needed.

```typescript
export interface ExampleAggregateRepository {
  save(entity: ExampleAggregate): Promise<ExampleAggregate>;
  findById(id: string): Promise<ExampleAggregate | null>;
  delete(id: string): Promise<void>;
}
```

## Repository Injection Tokens

- Always declare tokens in `@/shared/constants/repository-constants.ts` and import them from there.
- Example: `export const EXAMPLE_AGGREGATE_REPOSITORY = Symbol('EXAMPLE_AGGREGATE_REPOSITORY');`

Usage in a use case:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { EXAMPLE_AGGREGATE_REPOSITORY } from '@/shared/constants/repository-constants';

@Injectable()
export class DeleteExampleAggregate {
  constructor(@Inject(EXAMPLE_AGGREGATE_REPOSITORY) private readonly repository: ExampleAggregateRepository) {}

  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new EntityNotFoundException('ExampleAggregate', id);
    await this.repository.delete(id);
  }
}
```

## Construction and Parameters

- Use complete property names; abbreviations are not welcome.
- When constructor requires more than 3 properties, use a `...ConstructorProps` interface.
- Apply access modifiers to all constructor-initialized properties when they are public; prefer private fields + getters otherwise.

## Domain Exceptions

- Throw `InvalidOperationException` to prevent invalid state transitions.
- Throw `EntityNotFoundException` for missing aggregates.
- Use `DomainException` for business rule violations that do not fit previous cases.

## Unit of Work

- For operations that change more than one aggregate/repository, use the Unit of Work service (`@/domain/services/unit-of-work.ts`) or the infrastructure implementation to ensure atomicity.

## Read vs Write

- Do not use repositories for complex read models. Follow CQRS: place read queries under `@/application/queries/**` and repository mutations under `@/domain/repositories/**` with infrastructure implementations.

</implementation>

<consumers>

## Consumers

- Controllers call application use cases for write operations against aggregate roots.
- Controllers must not return domain entities; map to DTOs using mappers under `@/shared/mappers/**`.
- Queries for listing or projections must use Query services (see `docs/cqrs.std.md`).

</consumers>

<critical>

## Critical Rules

- Use complete names for methods, properties, and tokens; avoid abbreviations.
- Keep aggregate fields private; expose intent via methods.
- Validate all state transitions with domain exceptions.
- Centralize repository tokens in `@/shared/constants/repository-constants.ts`.
- If more than 3 constructor parameters, use a props interface.
- Do not mix read and write: repositories are for aggregates; queries for projections with pagination when listing.

</critical>
