# Domain Entities – Quick Guide

Purpose: a fast, copy-pasteable reference for creating and maintaining domain entities/aggregates that fit our architecture and rules. Keep entities simple, consistent, and event-driven.

See also: `ipt_web/rules/architecture.rules.md` and `ipt_web/rules/layers.rules.md`.

## Principles

- Encapsulate invariants: no public setters; expose intent with methods.
- Factory pattern: private constructor + `static create()` for new instances.
- Emit domain events inside entity methods; do not publish here. Publishing happens after commit (Unit of Work) in infrastructure.
- Pure domain: no framework or IO in entities; only business logic.
- Read vs Write (CQRS): entities are for write-side invariants. Read-side uses queries returning Views/DTOs.

## Location & Naming

- Path: `src/domain/entities/<entity>/<entity>.entity.ts`
- Events: `src/domain/events/*`
- Value Objects: `src/domain/value-objects/*`
- Tests: next to implementation as `*.spec.ts`

## Checklist

- Private constructor, `static create()` provided.
- Validate and sanitize inputs in factories/methods.
- Methods return `void` (or value objects) and may `emit(event)` internally.
- Provide `pullEvents()` to expose and clear pending events.
- Keep state private; expose read-only getters.

## Example: Entity with Domain Event (Hero)

Use this as a template. Adjust names, invariants, and events.

```typescript
import DomainEvent from "@/domain/events/domain.event.example";
import HeroRenamed from "@/domain/events/hero-renamed.event.example";

export class Hero {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _name: string;
  private _power: number;
  private _alive: boolean;
  private _events: DomainEvent[] = [];

  private constructor(props: HeroConstructorProps) {
    this._id = props.id;
    this._name = props.name;
    this._power = props.power;
    this._alive = props.alive;
    this._createdAt = props.createdAt;
  }

  public static create(props: HeroFactoryProps): Hero {
    const name = Hero.sanitizeName(props.name || "");
    if (!Hero.isValidName(name)) throw new Error("Invalid name");
    return new Hero({
      id: props.id,
      createdAt: new Date(),
      name,
      power: 1,
      alive: true,
    });
  }

  public static sanitizeName(name: string): string {
    return name.trim();
  }

  public static isValidName(name: string): boolean {
    return name.length > 1;
  }

  rename(newName: string): void {
    const name = Hero.sanitizeName(newName);
    if (!Hero.isValidName(name)) throw new Error("Invalid name");
    if (name === this._name) return;
    this._name = name;
    const event = HeroRenamed.create({ heroId: this._id, newName: name });
    this.emit(event);
  }

  private emit(event: DomainEvent): void {
    this._events.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const out = [...this._events];
    this._events = [];
    return out;
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get power() { return this._power; }
  get alive() { return this._alive; }
  get createdAt() { return this._createdAt; }
}

export interface HeroConstructorProps {
  id: string;
  name: string;
  power: number;
  alive: boolean;
  createdAt: Date;
}

export interface HeroFactoryProps {
  id: string;
  name: string;
}
```

### Example: Domain Event base and concrete event

```typescript
// src/domain/events/domain.event.example.ts
export default abstract class DomainEvent {
  public static eventName: string;
}
```

```typescript
// src/domain/events/hero-renamed.event.example.ts
import DomainEvent from "./domain.event.example";

export default class HeroRenamed extends DomainEvent {
  public static eventName = HeroRenamed.name;
  public readonly payload: HeroRenamedPayload;

  private constructor(payload: HeroRenamedPayload) {
    super();
    this.payload = payload;
  }

  public static create(payload: HeroRenamedPayload): HeroRenamed {
    return new HeroRenamed(payload);
  }
}

export interface HeroRenamedPayload {
  heroId: string;
  newName: string;
}
```

## Event Flow (Write-side)

- Entities emit events during state changes.
- Use Case runs in a Unit of Work (transaction); after commit, UoW publishes accumulated events via EventBus.
- Never publish events directly inside entities or use cases before commit.

## Anti-patterns

- Public property mutation or public setters.
- IO, HTTP, DB, or framework logic in entities.
- Returning raw entities to UI; controllers must return DTOs/Views.

## Quick Verifications

Run occasionally to enforce conventions:

```bash
# No fetch in domain
rg -n "fetch\(" src/domain || true

# Event emission pattern present
rg -n "emit\(.*\)" src/domain/entities || true
```
