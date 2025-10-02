'use server';

import DeleteMemberPermanentlyUseCase from "@/application/use-cases/member/delete-member-permanently.use-case";

import { resolve } from "@/infrastructure/container";

import { ServiceTokens } from "@/shared/constants/service-constants";
import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

import { ensureMemberId, ensureNonEmptyString } from "./validators";

export interface DeleteMemberPermanentlyActionInput {
    memberId?: string;
    confirm?: string;
}

export async function deleteMemberPermanentlyAction(
    input: DeleteMemberPermanentlyActionInput,
): Promise<void> {
    if (!input) {
        throw new Error("Input is required.");
    }

    const memberId = ensureMemberId(input.memberId);
    const confirm = ensureNonEmptyString(input.confirm, MemberErrorCodes.INVALID_DELETE_CONFIRMATION);
    const expected = `DELETE ${memberId}`;
    if (confirm !== expected) {
        throw new Error(MemberErrorCodes.INVALID_DELETE_CONFIRMATION);
    }

    const useCase = resolve<DeleteMemberPermanentlyUseCase>(ServiceTokens.DeleteMemberPermanentlyUseCase);
    await useCase.execute({ memberId, confirm });
}
