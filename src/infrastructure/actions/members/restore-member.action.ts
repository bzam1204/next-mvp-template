'use server';

import RestoreMemberUseCase from "@/application/use-cases/member/restore-member.use-case";

import { resolve } from "@/infrastructure/container";

import { invalidateMembersCache } from "@/infrastructure/cache/members-cache";

import { ServiceTokens } from "@/shared/constants/service-constants";

import { ensureMemberId } from "./validators";

export interface RestoreMemberActionInput {
    memberId?: string;
}

export async function restoreMemberAction(input: RestoreMemberActionInput): Promise<void> {
    if (!input) {
        throw new Error("Input is required.");
    }

    const memberId = ensureMemberId(input.memberId);
    const useCase = resolve<RestoreMemberUseCase>(ServiceTokens.RestoreMemberUseCase);
    await useCase.execute({ memberId });
    await invalidateMembersCache({ memberId });
}
