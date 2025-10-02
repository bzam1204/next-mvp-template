'use server';

import type { MemberView } from "@/application/dtos/member/member.view";
import ChangeMemberClassificationUseCase from "@/application/use-cases/member/change-member-classification.use-case";

import { resolve } from "@/infrastructure/container";

import { ServiceTokens } from "@/shared/constants/service-constants";

import { ensureMemberClassification, ensureMemberId } from "./validators";

import { invalidateMembersCache } from "@/infrastructure/cache/members-cache";

export interface ChangeMemberClassificationActionInput {
    memberId?: string;
    classification?: string;
}

export async function changeMemberClassificationAction(input: ChangeMemberClassificationActionInput): Promise<MemberView> {
    if (!input) {
        throw new Error("Input is required.");
    }

    const memberId = ensureMemberId(input.memberId);
    const classification = ensureMemberClassification(input.classification);

    const useCase = resolve<ChangeMemberClassificationUseCase>(
        ServiceTokens.ChangeMemberClassificationUseCase,
    );

    const output = await useCase.execute({ memberId, classification });
    await invalidateMembersCache({ memberId: output.id });
    return output;
}
