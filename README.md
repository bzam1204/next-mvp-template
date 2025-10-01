## Hero Template – Next.js Monolith (App Router)

This repository contains a domain-first template for MVPs built with Next.js App Router, Prisma and PostgreSQL. The sample "Hero" aggregate demonstrates the complete slice: Server Actions → Use Cases → Prisma repositories → Domain events → Event bus → UI (React Query + shadcn/ui).

## Quickstart

```bash
cd ipt_web
cp .env.example .env
docker-compose up -d postgres
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the Hero playground. Creating, renaming or level-up actions trigger domain events that are streamed to the in-memory event log and rendered live in the UI.

## Project Structure

- `src/domain`: aggregates, value objects, domain events (Hero emits `HeroCreated`, `HeroRenamed`, `HeroLeveledUp`).
- `src/application`: use cases and queries (CQRS). Transactions go through `UnitOfWork` and always return DTO/View models.
- `src/infrastructure`: Prisma adapters, Server Actions (controllers), React Query hooks, EventBus + EventLog bridge, DI container.
- `src/app`: Next.js routes and pages. `app/page.tsx` shows the full template using shadcn/ui components.
- `prisma/`: schema and migrations. Update `prisma/schema.prisma` and run `npx prisma migrate dev` when evolving the data model.

## Domain Flow (Hero Example)

1. UI triggers a Server Action (e.g., `createHeroAction`).
2. Action resolves the use case via DI container (`CreateHeroUseCase`).
3. Use case runs inside `PrismaUnitOfWork`; repositories persist aggregates; domain events are collected.
4. After commit, `EventBus.publish` forwards events to subscribers and the `InMemoryEventLog`.
5. React Query hooks refetch hero lists and the event feed, keeping UI state in sync.

## Testing

Run the unit tests (domain + application slices):

```bash
npm run test
```

The Hero entity and the `CreateHeroUseCase` have sample specs under `src/domain/**/*.spec.ts` and `src/application/**/*.spec.ts`. Use the same pattern when adding new aggregates/use cases.

## Adding New Features

1. Model aggregates/events under `src/domain`.
2. Extend Prisma schema and generate migrations.
3. Implement repositories + queries in `src/infrastructure` (Prisma adapters).
4. Create use cases/queries returning DTOs in `src/application`.
5. Register everything in the DI container (`src/infrastructure/container`).
6. Expose Server Actions + React Query hooks, then compose UI with shadcn components.

Refer to the docs in `rules/` for architecture decisions (DDD, CQRS, Server Actions, layering) while expanding this template.
