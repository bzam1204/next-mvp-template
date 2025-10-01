---
alwaysApply: true
---

# CQRS (Command–Query Responsibility Segregation)

This document describes how CQRS is applied in this codebase to separate read concerns (queries) from write concerns (commands) while following our DDD approach and the project code standards in `rules/code-standards.mdc`.

## Rationale

- Reads and writes have different requirements. Writes load and persist Aggregate Roots and enforce invariants. Reads return lightweight view models optimized for presentation and reporting.
- Separating responsibilities improves performance and reduces coupling. Queries never perform side effects; commands do not return view models.

## Architecture

We explicitly separate adapters for reading and writing data:

- Read (Queries): free-form data access for projections and listings. Returns view models only. Never loads domain aggregates and never causes side effects.
- Write (Repositories): load and persist Aggregate Roots. Used exclusively by command use cases. No data shaping for presentation.

Key locations:

- Queries (interfaces): `src/application/queries/*/*`
- Query implementations: `src/infrastructure/queries/*`
- Query aggregator (DI facade): `src/application/services/query.service.ts`
- Repositories (interfaces): `src/domain/repositories/*.ts`
- Repository implementations: `src/infrastructure/repositories/prisma/*.ts`
- DI tokens: `src/shared/constants/query-constants.ts`, `src/shared/constants/repository-constants.ts`, `src/shared/constants/service-constants.ts`

## Consumers

- Use cases (commands) depend on repositories and domain services to change state.
- Controllers that read must use the `QueryService` aggregator directly. Do not create use cases for queries.

Example controller reads via the `QueryService`:

```ts
export default class MyClubController {
  constructor(@Inject(QUERY_SERVICE) private readonly queryService: QueryService) {}

  @Get('/my-club/enrollment-requests/pending')
  async findMyClubPendingEnrollmentRequests(@Request() req: HttpUser) {
    const myClubPendingEnrollmentRequests = await this.queryService.clubQuery.findMyClubPendingEnrollmentRequests(req.user.id);
    return myClubPendingEnrollmentRequests;
  }

  @Get('/my-club/enrollment-requests')
  async findMyClubEnrollmentRequests(@Request() req: HttpUser) {
    const myClubEnrollmentRequests = await this.queryService.clubQuery.findMyClubEnrollmentRequests(req.user.id);
    return myClubEnrollmentRequests;
  }
}
```

## Doctrine

- Reads: Controller -> `QueryService` -> Query -> View/DTO (no use case layer).
- Writes: Controller -> Use Case -> Repository/Domain (enforce invariants; persist aggregates).

## Conventions

- Methods are verbs and descriptive. Avoid abbreviations (see naming rules).
- Queries return view DTOs; commands return void or domain entities as appropriate.
- Lists must support search and pagination.
  - Pagination DTO: `src/domain/dtos/pagination.dto.ts`
  - Example search DTO: `src/domain/dtos/search-clubs-query.dto.ts`
- Limit constructor parameters to three; otherwise use a params object.
- Use DI tokens from `src/shared/constants/*-constants.ts`.

## Naming Conventions (Queries and DTOs)

- Interfaces: `<Entity>Query` (e.g., `ClubQuery`) in `src/application/queries/<entity>-query/<entity>.query.ts`.
- Search methods: `search<Context><EntityPlural>(query: Search<Context><EntityPlural>Query): Promise<Search<Context><EntityPlural>View>`
  - Example: `searchMyClubMembers(query: SearchMyClubMembersQuery): Promise<SearchMyClubMembersView>`
  - Files: `src/application/dtos/search-my-club-members-query.ts`, `src/application/dtos/search-my-club-members.view.ts`
- Find methods: `find<Context><Entity>(...): Promise<Find<Context><Entity>View>` or `find<Context><EntityPlural>(...): Promise<Find<Context><EntityPlural>View>`
  - Example: `findMyClubEnrollmentRequests(principalId: string): Promise<FindMyClubEnrollmentRequestsView>`
  - Files: `src/application/dtos/find-my-club-enrollment-requests.view.ts`, items in `*.item.view.ts` when needed


## Examples

### ClubQuery (read side)

Interface defining read-only operations for clubs. Returns view DTOs only.

```ts
// src/application/queries/club-query/club.query.ts
export interface ClubQuery {
  findMyClubPendingEnrollmentRequests(principalId: string): Promise<FindMyClubPendingEnrollmentRequestsView>;
  findMyClubEnrollmentRequests(principalId: string): Promise<FindMyClubEnrollmentRequestsView>;
  searchClubMembersToAdmin(query: SearchClubMembersToAdminQuery): Promise<SearchClubMembersToAdminView>;
  searchMyClubMembers(query: SearchMyClubMembersQuery): Promise<SearchMyClubMembersView>;
  searchClubs(query: SearchClubsQuery): Promise<SearchClubsView>;
}
```

The aggregator makes all queries available behind a single DI token:

```ts
// src/application/services/query.service.ts
export interface QueryService {
  readonly featuredTournamentQuery: FeaturedTournamentQuery;
  readonly tournamentQuery: TournamentQuery;
  readonly enrollmentQuery: EnrollmentQuery;
  readonly dependantQuery: DependantQuery;
  readonly trainingQuery: TrainingQuery;
  readonly clubQuery: ClubQuery;
}
```

### Club (read and write sides)

Repository interface for write operations over the Aggregate Root:

```ts
// src/domain/repositories/club-repository.ts
export default interface ClubRepository {
  save(club: Club): Promise<Club>;
  find(id: string): Promise<Club | null>;
  findAll(): Promise<Club[]>;
  findByPrincipalId(ownerId: string): Promise<Club | null>;
}
```

Command use case example (change owner):

```ts
// src/application/use-cases/club/change-club-owner.use-case.ts
@Injectable()
export class ChangeClubOwner {
  constructor(@Inject(CLUB_REPOSITORY) private readonly clubRepository: ClubRepository) {}

  async execute(params: { clubId: string; newOwnerId: string }): Promise<void> {
    const club = await this.clubRepository.find(params.clubId);
    if (!club) throw new EntityNotFoundException('Club', params.clubId);
    club.changeOwner(params.newOwnerId);
    await this.clubRepository.save(club);
  }
}
```

DI tokens used above are declared in:

- `src/shared/constants/query-constants.ts`
- `src/shared/constants/repository-constants.ts`
- `src/shared/constants/service-constants.ts`

## Validation Rules (from code standards)

- Language: all code and documentation in English.
- Naming: `camelCase` for functions/variables, `PascalCase` for classes/interfaces, `kebab-case` for files.
- Avoid boolean flag parameters; expose separate methods instead.
- Use early returns to reduce nesting; keep functions small and focused.

By following these rules, we keep the read model fast and expressive while preserving strict invariants and clarity on the write side.
