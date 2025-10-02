import type {
    SearchMembersQueryInput,
    SearchMembersQueryResult,
} from "@/application/queries/member/search-members.query";
import type SearchMembersQuery from "@/application/queries/member/search-members.query";
import type { PrismaClientLike } from "@/infrastructure/prisma/types";

import { getMemberDelegate } from "./member-delegate";
import { mapPrismaMemberToView } from "./member-record.mapper";

type MemberWhereInput = Record<string, unknown>;

type OrderByFullName = {
    fullName: "asc" | "desc";
};

type FindManyArgs = {
    where?: MemberWhereInput;
    skip?: number;
    take?: number;
    orderBy?: OrderByFullName | OrderByFullName[];
};

type CountArgs = {
    where?: MemberWhereInput;
};

export class PrismaSearchMembersQuery implements SearchMembersQuery {
    constructor(private readonly getClient: () => PrismaClientLike) {}

    public async execute(input: SearchMembersQueryInput): Promise<SearchMembersQueryResult> {
        const page = normalizePage(input.page);
        const pageSize = normalizePageSize(input.pageSize);
        const where = this.buildWhere(input);
        const members = getMemberDelegate(this.getClient);

        const [records, total] = await Promise.all([
            members.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { fullName: "asc" },
            } as FindManyArgs),
            members.count({ where } as CountArgs),
        ]);

        return {
            items: records.map(mapPrismaMemberToView),
            total,
            page,
            pageSize,
        };
    }

    private buildWhere(input: SearchMembersQueryInput): MemberWhereInput {
        const where: MemberWhereInput = {};

        const name = input.name?.trim();
        if (name) {
            where.fullName = { contains: name, mode: "insensitive" };
        }

        const profile = input.profile?.trim();
        if (profile) {
            where.profile = { equals: profile };
        }

        const visibility = input.visibility ?? "active";
        if (visibility === "active" || visibility === "archived") {
            where.status = visibility;
        }

        return where;
    }
}

function normalizePage(page: number | undefined): number {
    if (typeof page !== "number" || Number.isNaN(page) || page < 1) {
        return 1;
    }
    return Math.floor(page);
}

function normalizePageSize(pageSize: number | undefined): number {
    if (typeof pageSize !== "number" || Number.isNaN(pageSize) || pageSize < 1) {
        return 10;
    }

    const normalized = Math.floor(pageSize);
    return normalized > 100 ? 100 : normalized;
}

export default PrismaSearchMembersQuery;
