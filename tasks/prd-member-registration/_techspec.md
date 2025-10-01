# Technical Specification Template

## Executive Summary

This spec defines the technical design for the Member Registration module, implementing CRUD with reversible archival, permanent deletion, classification/state management, search with pagination/filters, and a member detail view. We follow the project’s Clean Architecture and layering rules: React Query hooks in `infrastructure/hooks` call Server Actions (controllers) in `infrastructure/actions`, which resolve application ports (use cases/queries) via the DI container. Domain invariants live in aggregates, persistence uses Prisma/Postgres with Unit of Work, and domain events are published only after successful commit. No direct `fetch` from hooks and no internal HTTP between layers.

Key decisions: Next.js App Router with Server Actions as controllers; DDD with explicit CQRS (use cases for writes, queries for reads); centralized QueryKeys for cache and predictable invalidation; minimal LGPD‑aware handling for PII; no roles/authorization for MVP. The design keeps interfaces stable to enable later extraction to NestJS without rewriting `domain`/`application`.

## System Architecture

### Domain Placement

- `src/app/` – UI routes and pages (App Router)
- `src/infrastructure/hooks/` – React Query hooks to call Server Actions
- `src/infrastructure/actions/` – Server Actions (controllers)
- `src/infrastructure/repositories/` – Prisma repositories for write model
- `src/infrastructure/queries/` – Prisma-backed read models (Views)
- `src/infrastructure/uow/` – Unit of Work wrapping Prisma transactions
- `src/infrastructure/events/` – EventBus publication post-commit
- `src/infrastructure/cache/` – `QueryKeys` definitions
- `src/infrastructure/container.ts` – DI container registrations
- `src/application/use-cases/` – Commands (write)
- `src/application/queries/` – Query interfaces (read)
- `src/application/dtos/` – DTOs and View models
- `src/domain/` – Aggregates, value objects, exceptions, domain services
- `prisma/` – Prisma schema and migrations (Postgres)

### Component Overview

- UI: Form, list, and detail pages using Shadcn sidebar shell. Hooks manage data and cache.
- Controllers: Server Actions orchestrating validation and delegating to application ports via container.
- Application: Use cases for create/update/archive/restore/delete and classification changes. Queries for search and detail.
- Domain: `Member` aggregate with invariants and domain events on state changes.
- Persistence: Prisma repositories and read queries; transactions via UoW; events published post-commit.
- Caching: TanStack Query with centralized keys and consistent invalidation after mutations.

## Implementation Design

### Core Interfaces

```ts
// src/application/queries/search-members.query.ts
export interface SearchMembersQuery {
  execute(input: { page: number; pageSize: number; name?: string; profile?: string; visibility?: 'active'|'archived'|'all'; }):
    Promise<{ items: MemberView[]; total: number; page: number; pageSize: number }>;
}

// src/application/use-cases/register-member.usecase.ts
export interface RegisterMember {
  execute(input: CreateMemberDTO): Promise<MemberView>;
}

// src/application/use-cases/update-member.usecase.ts
export interface UpdateMember {
  execute(input: UpdateMemberDTO): Promise<MemberView>;
}

// src/application/use-cases/change-classification.usecase.ts
export interface ChangeMemberClassification {
  execute(input: { memberId: string; classification: 'communicant'|'non-communicant' }): Promise<MemberView>;
}

// src/application/use-cases/archive-member.usecase.ts
export interface ArchiveMember { execute(input: { memberId: string }): Promise<void>; }
export interface RestoreMember { execute(input: { memberId: string }): Promise<void>; }
export interface DeleteMemberPermanently { execute(input: { memberId: string; confirm: string }): Promise<void>; }

// src/application/repositories/member.repository.ts
export interface MemberRepository {
  save(member: Member): Promise<void>;
  findById(id: string): Promise<Member | null>;
  delete(id: string): Promise<void>;
}
```

### Data Models

- Domain entity: `Member`

  - Core profile: `id`, `fullName`, `email?`, `phone?`, `cpf?`
  - Classification: `classification` ∈ {communicant, non-communicant}
  - Visibility: `status` ∈ {active, archived}
  - Civil/ecclesiastical (per PRD R1.1): `birthDate`, `placeOfBirth`, `sex`, `religiousBackground`, `maritalStatus`, `profession`, `address`, `literacy`, `baptizedInInfancy`, `reception` {`date`, `location`, `mode`}, `celebrant`
  - Domain events: `MemberArchived`, `MemberRestored`, `MemberDeleted`, `MemberRegistered`, `MemberUpdated`, `MemberClassificationChanged`
- DTOs

  - `CreateMemberDTO`: PRD‑required fields (civil + ecclesiastical) plus profile and classification
  - `UpdateMemberDTO`: partial updatable fields (no immutable IDs)
  - `MemberView`: read-optimized projection for list/detail
- Prisma schema (excerpt, mapped to snake_case per SQL rules)

```prisma
enum MemberClassification {
  communicant
  non_communicant
}

enum MemberStatus {
  active
  archived
}

model Member {
  id                  String   @id @default(cuid())
  fullName            String   @map("full_name")
  email               String?  @unique
  phone               String?
  cpf                 String?  @unique
  classification      MemberClassification
  status              MemberStatus
  birthDate           DateTime? @map("birth_date")
  placeOfBirth        String?   @map("place_of_birth")
  sex                 String?
  religiousBackground String?   @map("religious_background")
  maritalStatus       String?   @map("marital_status")
  profession          String?
  address             String?
  literacy            Boolean?
  baptizedInInfancy   Boolean?  @map("baptized_in_infancy")
  receptionDate       DateTime? @map("reception_date")
  receptionLocation   String?   @map("reception_location")
  receptionMode       String?   @map("reception_mode")
  celebrant           String?
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt      @map("updated_at")

  @@index([status], name: "idx_members_status")
  @@index([classification], name: "idx_members_classification")
  @@index([fullName], name: "idx_members_full_name")
  @@map("members")
}
```
Note: For case-insensitive substring search on `full_name`, consider adding a trigram index via a raw SQL migration (`pg_trgm`) if needed later.

### API Endpoints

We use Server Actions instead of HTTP endpoints:

- `createMemberAction(input: CreateMemberDTO): Promise<MemberView>`
- `updateMemberAction(input: UpdateMemberDTO): Promise<MemberView>`
- `archiveMemberAction(input: { memberId: string }): Promise<void>`
- `restoreMemberAction(input: { memberId: string }): Promise<void>`
- `deleteMemberAction(input: { memberId: string; confirm: string }): Promise<void>`
- `findMembersAction(input: { page?: number; pageSize?: number; name?: string; profile?: string; visibility?: 'active'|'archived'|'all' }): Promise<{ items: MemberView[]; total: number }>`
- `getMemberByIdAction(input: { memberId: string }): Promise<MemberView>`

Controllers must `resolve(...)` ports from the container and return DTOs only. All actions include minimal input validation and consistent error messages.

### Caching Keys (React Query)

```ts
// src/infrastructure/cache/query-keys.ts
export const QueryKeys = {
  members: {
    root: () => ['members'] as const,
    search: (params: { page?: number; pageSize?: number; name?: string; profile?: string; visibility?: 'active'|'archived'|'all' }) =>
      ['members', 'search', params] as const,
    byId: (id: string) => ['members', 'byId', id] as const,
  },
} as const;
```

Invalidation after mutations: always invalidate `QueryKeys.members.root()` and any specific `byId(id)` touched. E.g., after `updateMemberAction`, invalidate `byId(memberId)` and `root()`; after archival/restore/delete/classification changes, invalidate `root()` to refresh lists.

### Container Registrations

```ts
// src/infrastructure/container.ts
container.register('MemberRepository', { useClass: PrismaMemberRepository });

container.register('RegisterMember', { useClass: RegisterMemberImpl });
container.register('UpdateMember', { useClass: UpdateMemberImpl });
container.register('ArchiveMember', { useClass: ArchiveMemberImpl });
container.register('RestoreMember', { useClass: RestoreMemberImpl });
container.register('DeleteMemberPermanently', { useClass: DeleteMemberPermanentlyImpl });
container.register('ChangeMemberClassification', { useClass: ChangeMemberClassificationImpl });

container.register('SearchMembersQuery', { useClass: PrismaSearchMembersQuery });
container.register('GetMemberByIdQuery', { useClass: PrismaGetMemberByIdQuery });
```

## Integration Points

- External integrations: none in MVP.
- Authentication/roles: not applicable for MVP (no role checks).
- Error handling: map domain errors to safe messages; surface validation errors to forms; log server errors with context.

## Impact Analysis

| Affected Component                  | Type of Impact | Description & Risk Level                             | Required Action                      |
| ----------------------------------- | -------------- | ---------------------------------------------------- | ------------------------------------ |
| `prisma/schema.prisma`            | Schema Change  | Add `Member` model. Medium risk.                   | Create migration; verify constraints |
| `src/infrastructure/container.ts` | Registrations  | Register repositories, use cases, queries. Low risk. | Add bindings + tests                 |
| `src/infrastructure/hooks/*`      | New hooks      | Add CRUD + search hooks. Low risk.                   | Define QueryKeys + invalidations     |
| `src/infrastructure/actions/*`    | New actions    | Add Server Actions per use case/query. Low risk.     | Ensure 'use server' + validation     |
| `src/application/*`               | New ports      | Define interfaces and implementations. Medium risk.  | Unit tests in place                  |
| `src/domain/*`                    | New aggregate  | Add `Member` with invariants/events. Medium risk.  | Unit tests for invariants            |

Categories considered: direct dependencies (hooks/actions/ports), shared resources (DB, cache), and performance (pagination queries). No API contract changes to existing modules.

## Testing Approach

### Unit Tests

- Domain: `Member` invariants (classification/state, archive/restore, required fields on register)
- Application: use cases (register/update/archive/restore/delete/classification) and queries
- Repositories: mock Prisma using in-memory or test doubles; verify UoW commit boundaries
- Error paths: invalid inputs, non-existent IDs, confirmation mismatch on delete

### Integration Tests

None for MVP. Per architecture rules, focus tests on `domain` and `application`. If needed later, add thin action → container → port integration tests under `test/integration/`.

## Development Sequencing

### Build Order

1. Domain: define `Member` aggregate, VOs, and domain events (foundation for invariants)
2. Application: ports and DTOs; implement use cases and queries
3. Infrastructure: Prisma schema + migrations; repositories and read queries; UoW; EventBus stub
4. Controllers: Server Actions wired to container; input validation
5. UI: Hooks with QueryKeys; list/detail/forms; cache invalidation
6. Tests: unit first (domain/application), then targeted integration

### Technical Dependencies

- Postgres database and Prisma set up (Neon recommended per rules)
- DI container initialized with all bindings
- Shadcn UI shell available for navigation

## Monitoring & Observability

- Metrics: optional basic counters for actions (create/update/archive/restore/delete/search)
- Logs: action-level logs for errors and key events with member IDs (no PII in logs)
- Tracing: optional minimal tracing via Next.js instrumentation if available

## Technical Considerations

### Key Decisions

- Server Actions act as controllers; no internal HTTP clients
- Strict layering and CQRS separation as per rules; hooks never call `fetch`
- Events emitted inside aggregate methods; publication only post-commit by UoW
- Centralized cache keys for predictable invalidation on mutations
- Hard delete requires typed confirmation: exact phrase `DELETE {memberId}` checked server-side

### Known Risks

- PII handling (LGPD): ensure hard delete fully removes personal data
- Query performance: ensure indexes on `fullName`, `status`, and filtered fields used in search
- UX consistency: confirm two-step confirmation UX for hard delete

### Special Requirements

- Internationalization: PT-BR labels; code/identifiers in EN (repo standard)
- Avoid unnecessary React re-renders: stable props, keying, and controlled state updates

### Standards Compliance

- Follows `rules/architecture.rules.md` (Next.js App Router, Server Actions as controllers, DDD/CQRS, DI, UoW, domain events)
- Applies `rules/layers.rules.md` (UI → Controller → Application; no `fetch` in hooks; QueryKeys; cache invalidation)
- Error handling and tests aligned with project standards; unit tests colocated next to implementations
