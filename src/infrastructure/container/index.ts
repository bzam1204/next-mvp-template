import { PrismaClient } from "@prisma/client";

import type EventBus from "@/domain/services/event-bus";
import type HeroQuery from "@/application/queries/hero-query/hero.query";
import type QueryService from "@/application/services/query.service";
import CreateHeroUseCase from "@/application/use-cases/hero/create-hero.use-case";
import RenameHeroUseCase from "@/application/use-cases/hero/rename-hero.use-case";
import LevelUpHeroUseCase from "@/application/use-cases/hero/level-up-hero.use-case";
import type SearchMembersQuery from "@/application/queries/member/search-members.query";
import type GetMemberByIdQuery from "@/application/queries/member/get-member-by-id.query";
import RegisterMemberUseCase from "@/application/use-cases/member/register-member.use-case";
import UpdateMemberUseCase from "@/application/use-cases/member/update-member.use-case";
import ArchiveMemberUseCase from "@/application/use-cases/member/archive-member.use-case";
import RestoreMemberUseCase from "@/application/use-cases/member/restore-member.use-case";
import DeleteMemberPermanentlyUseCase from "@/application/use-cases/member/delete-member-permanently.use-case";
import ChangeMemberClassificationUseCase from "@/application/use-cases/member/change-member-classification.use-case";
import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type HeroRepository from "@/domain/repositories/hero.repository";
import type MemberRepository from "@/domain/repositories/member.repository";

import IdGenerator from "@/application/services/id-generator.service";

import { prisma } from "@/infrastructure/db/prisma";
import InfraEventBus from "@/infrastructure/events/event-bus";
import { InMemoryEventLog } from "@/infrastructure/events/in-memory-event-log";
import PrismaHeroQuery from "@/infrastructure/queries/prisma/hero/hero.query.prisma";
import PrismaSearchMembersQuery from "@/infrastructure/queries/prisma/member/prisma-search-members.query";
import PrismaGetMemberByIdQuery from "@/infrastructure/queries/prisma/member/prisma-get-member-by-id.query";
import UuidIdGenerator from "@/infrastructure/services/uuid-id-generator.service";
import PrismaUnitOfWork from "@/infrastructure/uow/prisma-unit-of-work";
import DefaultQueryService from "@/infrastructure/services/default-query.service";
import PrismaHeroRepository from "@/infrastructure/repositories/prisma/hero.repository.prisma";
import PrismaMemberRepository from "@/infrastructure/repositories/prisma/member.repository.prisma";

import HeroMapper from "@/shared/mappers/hero.mapper";
import { QueryTokens, type QueryToken } from "@/shared/constants/query-constants";
import { ServiceTokens, type ServiceToken } from "@/shared/constants/service-constants";
import { RepositoryTokens, type RepositoryToken } from "@/shared/constants/repository-constants";

type Token = ServiceToken | RepositoryToken | QueryToken;

interface Registration<T> {
    factory: (container: Container) => T;
    instance?: T;
}

class Container {
    private readonly registry = new Map<Token, Registration<unknown>>();

    public registerSingleton<T>(token: Token, factory: (container: Container) => T): void {
        this.registry.set(token, { factory });
    }

    public resolve<T>(token: Token): T {
        const registration = this.registry.get(token);
        if (!registration) throw new Error(`Token not registered: ${String(token.description ?? token.toString())}`);
        if (registration.instance) return registration.instance as T;
        const instance = registration.factory(this);
        registration.instance = instance;
        return instance as T;
    }
}

export const container = new Container();

container.registerSingleton<EventBus>(ServiceTokens.EventBus, () => new InfraEventBus());
container.registerSingleton<InMemoryEventLog>(ServiceTokens.EventLog, (c) => {
    const bus = c.resolve<EventBus>(ServiceTokens.EventBus);
    const log = new InMemoryEventLog(100, bus);
    return log;
});
container.registerSingleton(ServiceTokens.PrismaClient, () => prisma);
container.registerSingleton<HeroMapper>(ServiceTokens.HeroMapper, () => new HeroMapper());
container.registerSingleton<IdGenerator>(ServiceTokens.IdGenerator, () => new UuidIdGenerator());

container.registerSingleton<PrismaUnitOfWork>(ServiceTokens.UnitOfWork, (c) => {
    const bus = c.resolve<EventBus>(ServiceTokens.EventBus);
    const client = c.resolve<PrismaClient>(ServiceTokens.PrismaClient);
    const prisma = new PrismaUnitOfWork(client, bus);
    return prisma;
});

container.registerSingleton<HeroRepository>(RepositoryTokens.HeroRepository, (c) => {
    const uow = c.resolve<PrismaUnitOfWork>(ServiceTokens.UnitOfWork);
    const repo = new PrismaHeroRepository(() => uow.getClient());
    return repo;
});

container.registerSingleton<MemberRepository>(RepositoryTokens.MemberRepository, (c) => {
    const uow = c.resolve<PrismaUnitOfWork>(ServiceTokens.UnitOfWork);
    const repo = new PrismaMemberRepository(() => uow.getClient());
    return repo;
});

container.registerSingleton<HeroQuery>(QueryTokens.HeroQuery, (c) => {
    const client = c.resolve<typeof prisma>(ServiceTokens.PrismaClient);
    const query = new PrismaHeroQuery(() => client);
    return query;
});

container.registerSingleton<SearchMembersQuery>(QueryTokens.SearchMembersQuery, (c) => {
    const client = c.resolve<typeof prisma>(ServiceTokens.PrismaClient);
    const query = new PrismaSearchMembersQuery(() => client);
    return query;
});

container.registerSingleton<GetMemberByIdQuery>(QueryTokens.GetMemberByIdQuery, (c) => {
    const client = c.resolve<typeof prisma>(ServiceTokens.PrismaClient);
    const query = new PrismaGetMemberByIdQuery(() => client);
    return query;
});

container.registerSingleton<QueryService>(ServiceTokens.QueryService, (c) => {
    const heroQuery = c.resolve<HeroQuery>(QueryTokens.HeroQuery);
    const service = new DefaultQueryService(heroQuery);
    return service;
});

container.registerSingleton<CreateHeroUseCase>(ServiceTokens.CreateHeroUseCase, (c) => {
    const useCase = new CreateHeroUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        c.resolve<IdGenerator>(ServiceTokens.IdGenerator),
        () => c.resolve<HeroRepository>(RepositoryTokens.HeroRepository),
    );
    return useCase;
});

container.registerSingleton<RenameHeroUseCase>(ServiceTokens.RenameHeroUseCase, (c) => {
    const useCase = new RenameHeroUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<HeroRepository>(RepositoryTokens.HeroRepository),
    );
    return useCase;
});

container.registerSingleton<LevelUpHeroUseCase>(ServiceTokens.LevelUpHeroUseCase, (c) => {
    const useCase = new LevelUpHeroUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<HeroRepository>(RepositoryTokens.HeroRepository),
    );
    return useCase;
});

container.registerSingleton<RegisterMemberUseCase>(ServiceTokens.RegisterMemberUseCase, (c) => {
    const useCase = new RegisterMemberUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        c.resolve<IdGenerator>(ServiceTokens.IdGenerator),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

container.registerSingleton<UpdateMemberUseCase>(ServiceTokens.UpdateMemberUseCase, (c) => {
    const useCase = new UpdateMemberUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

container.registerSingleton<ArchiveMemberUseCase>(ServiceTokens.ArchiveMemberUseCase, (c) => {
    const useCase = new ArchiveMemberUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

container.registerSingleton<RestoreMemberUseCase>(ServiceTokens.RestoreMemberUseCase, (c) => {
    const useCase = new RestoreMemberUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

container.registerSingleton<DeleteMemberPermanentlyUseCase>(ServiceTokens.DeleteMemberPermanentlyUseCase, (c) => {
    const useCase = new DeleteMemberPermanentlyUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

container.registerSingleton<ChangeMemberClassificationUseCase>(ServiceTokens.ChangeMemberClassificationUseCase, (c) => {
    const useCase = new ChangeMemberClassificationUseCase(
        c.resolve<UnitOfWork>(ServiceTokens.UnitOfWork),
        () => c.resolve<MemberRepository>(RepositoryTokens.MemberRepository),
    );
    return useCase;
});

// Ensure observers are initialized eagerly
void container.resolve<InMemoryEventLog>(ServiceTokens.EventLog);

export function resolve<T>(token: Token): T {
    const dependency = container.resolve<T>(token);
    return dependency;
}
