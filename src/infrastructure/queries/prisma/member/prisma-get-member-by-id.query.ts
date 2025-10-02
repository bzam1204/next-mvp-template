import type {
    GetMemberByIdQueryInput,
} from "@/application/queries/member/get-member-by-id.query";
import type GetMemberByIdQuery from "@/application/queries/member/get-member-by-id.query";
import type { MemberView } from "@/application/dtos/member/member.view";
import type { PrismaClientLike } from "@/infrastructure/prisma/types";

import { getMemberDelegate } from "./member-delegate";
import { mapPrismaMemberToView } from "./member-record.mapper";

type FindUniqueArgs = {
    where: { memberId: string };
};

export class PrismaGetMemberByIdQuery implements GetMemberByIdQuery {
    constructor(private readonly getClient: () => PrismaClientLike) {}

    public async execute(input: GetMemberByIdQueryInput): Promise<MemberView | null> {
        const memberId = input.memberId?.trim();
        if (!memberId) {
            return null;
        }

        const members = getMemberDelegate(this.getClient);
        const record = await members.findUnique({ where: { memberId } } as FindUniqueArgs);

        if (!record) return null;

        return mapPrismaMemberToView(record);
    }
}

export default PrismaGetMemberByIdQuery;
