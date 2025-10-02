'use server';

import type GetMemberByIdQuery from "@/application/queries/member/get-member-by-id.query";
import type { MemberView } from "@/application/dtos/member/member.view";

import { resolve } from "@/infrastructure/container";

import { QueryTokens } from "@/shared/constants/query-constants";

import { ensureMemberId } from "./validators";

export interface GetMemberByIdActionInput {
    memberId?: string;
}

export async function getMemberByIdAction(input: GetMemberByIdActionInput): Promise<MemberView | null> {
    if (!input) {
        throw new Error("Input is required.");
    }

    const memberId = ensureMemberId(input.memberId);
    const query = resolve<GetMemberByIdQuery>(QueryTokens.GetMemberByIdQuery);
    const member = await query.execute({ memberId });
    return member;
}
