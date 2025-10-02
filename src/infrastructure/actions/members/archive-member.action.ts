'use server';

import ArchiveMemberUseCase from "@/application/use-cases/member/archive-member.use-case";

import { resolve } from "@/infrastructure/container";

import { invalidateMembersCache } from "@/infrastructure/cache/members-cache";

import { ServiceTokens } from "@/shared/constants/service-constants";

import { ensureMemberId } from "./validators";

export interface ArchiveMemberActionInput {
    memberId?: string;
}

export async function archiveMemberAction(input: ArchiveMemberActionInput): Promise<void> {
    if (!input) {
        throw new Error("Input is required.");
    }

    const memberId = ensureMemberId(input.memberId);
    const useCase = resolve<ArchiveMemberUseCase>(ServiceTokens.ArchiveMemberUseCase);
    await useCase.execute({ memberId });
    await invalidateMembersCache({ memberId });
}
