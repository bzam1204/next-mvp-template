# Member Registration Implementation Task Summary

## Relevant Files

### Core Implementation Files

- `prisma/schema.prisma` - Member model, enums, indexes
- `src/domain/member/Member.ts` - Aggregate and invariants
- `src/domain/member/events/*.ts` - Domain events
- `src/application/dtos/*.ts` - DTOs and view models
- `src/application/use-cases/*.ts` - Write-side ports and implementations
- `src/application/queries/*.ts` - Read-side ports and implementations
- `src/infrastructure/repositories/prisma-member.repository.ts` - Prisma repository (write)
- `src/infrastructure/queries/prisma-search-members.query.ts` - Read model (search)
- `src/infrastructure/queries/prisma-get-member-by-id.query.ts` - Read model (detail)
- `src/infrastructure/uow/index.ts` - Unit of Work wrapper
- `src/infrastructure/events/event-bus.ts` - Event bus post-commit publisher
- `src/infrastructure/cache/query-keys.ts` - React Query keys
- `src/infrastructure/container.ts` - DI wiring
- `src/infrastructure/actions/members/*.ts` - Server Actions controllers
- `src/infrastructure/hooks/members/*.ts` - React Query hooks
- `src/app/members/page.tsx` - List with filters/pagination
- `src/app/members/[id]/page.tsx` - Member detail
- `src/app/members/new/page.tsx` - Create form
- `src/app/members/[id]/edit/page.tsx` - Edit form

### Integration Points

- `Postgres/Prisma` - Persistence for members
- `TanStack Query` - Client caching and invalidations
- `Shadcn UI` - Shell and components for list/detail/forms

### Documentation Files

- `tasks/prd-member-registration/_prd.md` - PRD
- `tasks/prd-member-registration/_techspec.md` - Technical Specification
- `rules/architecture.rules.md` - Architecture standards
- `rules/layers.rules.md` - Layering and patterns

## Tasks

- [X] 1.0 Domain: Member aggregate and invariants
- [X] 2.0 Application: DTOs and write use cases
- [X] 3.0 Application: Read queries (search/detail)
- [X] 4.0 Persistence: Prisma schema + migration + indexes
- [X] 5.0 Infrastructure: Repository, UoW, EventBus
- [X] 6.0 DI: Container registrations for ports
- [X] 7.0 Controllers: Server Actions (CRUD, status)
- [X] 8.0 Caching: QueryKeys + invalidations
- [ ] 9.0 Hooks: React Query hooks (CRUD/search/detail)
- [ ] 10.0 UI: Pages (list/detail/forms) + UX
- [ ] 11.0 Hard Delete: Two-step confirmation UX + enforcement

Out of scope in this phase: Testing (Task 12.0 is excluded)
