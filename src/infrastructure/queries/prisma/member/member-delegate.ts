import type { PrismaClientLike } from "@/infrastructure/prisma/types";

import type { PrismaMemberRecord } from "./member-record.mapper";

type Delegate = {
    findMany(args: Record<string, unknown>): Promise<PrismaMemberRecord[]>;
    count(args: Record<string, unknown>): Promise<number>;
    findUnique(args: Record<string, unknown>): Promise<PrismaMemberRecord | null>;
};

export function getMemberDelegate(getClient: () => PrismaClientLike): Delegate {
    const client = getClient() as unknown as { member?: Delegate };
    if (!client.member) {
        throw new Error("Member delegate is not configured on Prisma client. Ensure Member model exists in schema.");
    }
    return client.member;
}

export type MemberDelegate = Delegate;
