import { describe, expect, it } from "vitest";

import { resolve } from "@/infrastructure/container";
import { QueryTokens, type QueryToken } from "@/shared/constants/query-constants";
import { RepositoryTokens, type RepositoryToken } from "@/shared/constants/repository-constants";
import { ServiceTokens, type ServiceToken } from "@/shared/constants/service-constants";

import RegisterMemberUseCase from "@/application/use-cases/member/register-member.use-case";
import UpdateMemberUseCase from "@/application/use-cases/member/update-member.use-case";
import ArchiveMemberUseCase from "@/application/use-cases/member/archive-member.use-case";
import RestoreMemberUseCase from "@/application/use-cases/member/restore-member.use-case";
import DeleteMemberPermanentlyUseCase from "@/application/use-cases/member/delete-member-permanently.use-case";
import ChangeMemberClassificationUseCase from "@/application/use-cases/member/change-member-classification.use-case";
import PrismaSearchMembersQuery from "@/infrastructure/queries/prisma/member/prisma-search-members.query";
import PrismaGetMemberByIdQuery from "@/infrastructure/queries/prisma/member/prisma-get-member-by-id.query";
import PrismaMemberRepository from "@/infrastructure/repositories/prisma/member.repository.prisma";
import PrismaUnitOfWork from "@/infrastructure/uow/prisma-unit-of-work";

import type SearchMembersQuery from "@/application/queries/member/search-members.query";
import type GetMemberByIdQuery from "@/application/queries/member/get-member-by-id.query";
import type MemberRepository from "@/domain/repositories/member.repository";
import type { UnitOfWork } from "@/domain/services/unit-of-work";

type Token = ServiceToken | RepositoryToken | QueryToken;

const expectResolution = <C extends new (...args: any[]) => object>(
    token: Token,
    ctor: C,
) => {
    const instance = resolve<InstanceType<C>>(token);
    expect(instance).toBeInstanceOf(ctor);
    return instance;
};

describe("infrastructure/container member registrations", () => {
    it("resolves PrismaUnitOfWork as a singleton", () => {
        const first = resolve<UnitOfWork>(ServiceTokens.UnitOfWork);
        const second = resolve<UnitOfWork>(ServiceTokens.UnitOfWork);

        expect(first).toBeInstanceOf(PrismaUnitOfWork);
        expect(second).toBe(first);
    });

    it("resolves PrismaMemberRepository as a singleton", () => {
        const first = resolve<MemberRepository>(RepositoryTokens.MemberRepository);
        const second = resolve<MemberRepository>(RepositoryTokens.MemberRepository);

        expect(first).toBeInstanceOf(PrismaMemberRepository);
        expect(second).toBe(first);
    });

    it("resolves PrismaSearchMembersQuery", () => {
        const query = expectResolution(QueryTokens.SearchMembersQuery, PrismaSearchMembersQuery);
        const typedQuery: SearchMembersQuery = query;

        expect(typeof typedQuery.execute).toBe("function");
    });

    it("resolves PrismaGetMemberByIdQuery", () => {
        const query = expectResolution(QueryTokens.GetMemberByIdQuery, PrismaGetMemberByIdQuery);
        const typedQuery: GetMemberByIdQuery = query;

        expect(typeof typedQuery.execute).toBe("function");
    });

    const memberUseCases = [
        { token: ServiceTokens.RegisterMemberUseCase, ctor: RegisterMemberUseCase },
        { token: ServiceTokens.UpdateMemberUseCase, ctor: UpdateMemberUseCase },
        { token: ServiceTokens.ArchiveMemberUseCase, ctor: ArchiveMemberUseCase },
        { token: ServiceTokens.RestoreMemberUseCase, ctor: RestoreMemberUseCase },
        { token: ServiceTokens.DeleteMemberPermanentlyUseCase, ctor: DeleteMemberPermanentlyUseCase },
        { token: ServiceTokens.ChangeMemberClassificationUseCase, ctor: ChangeMemberClassificationUseCase },
    ] as const;

    memberUseCases.forEach(({ token, ctor }) => {
        it(`resolves ${ctor.name}`, () => {
            const useCase = expectResolution(token, ctor);
            expect(typeof useCase.execute).toBe("function");
        });
    });
});
