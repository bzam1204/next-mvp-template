import { revalidateTag } from "next/cache";

const MEMBERS_ROOT_TAG = "members";
const memberDetailTag = (memberId: string) => `${MEMBERS_ROOT_TAG}:${memberId}`;

export const MembersCacheTags = {
    root: MEMBERS_ROOT_TAG,
    byId: memberDetailTag,
} as const;

interface InvalidateMembersCacheOptions {
    memberId?: string | null;
}

export async function invalidateMembersCache(options: InvalidateMembersCacheOptions = {}): Promise<void> {
    await revalidateTag(MembersCacheTags.root);

    if (options.memberId) {
        await revalidateTag(memberDetailTag(options.memberId));
    }
}
