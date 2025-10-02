'use server';

import type { UpdateMemberInput } from "@/application/dtos/member/update-member.input";
import type { MemberView } from "@/application/dtos/member/member.view";
import UpdateMemberUseCase from "@/application/use-cases/member/update-member.use-case";

import { resolve } from "@/infrastructure/container";

import { invalidateMembersCache } from "@/infrastructure/cache/members-cache";

import { ServiceTokens } from "@/shared/constants/service-constants";
import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

import {
    buildMemberAddress,
    buildMemberReception,
    ensureMemberId,
    ensureMemberMaritalStatus,
    ensureMemberSex,
    ensureNonEmptyString,
    parseOptionalBoolean,
    parseOptionalDate,
    toNullableString,
} from "./validators";

type BooleanLike = boolean | string | number | undefined | null;
type DateLike = string | Date | undefined | null;

type AddressLike = {
    street?: string;
    number?: string | null;
    district?: string | null;
    city?: string;
    state?: string | null;
    zip?: string | null;
    complement?: string | null;
} | null | undefined;

type ReceptionLike = {
    date?: DateLike;
    mode?: string;
    location?: string;
} | null | undefined;

export interface UpdateMemberActionInput {
    memberId?: string;
    cpf?: string | null;
    sex?: string | null;
    email?: string | null;
    phone?: string | null;
    fullName?: string | null;
    address?: AddressLike;
    literacy?: BooleanLike;
    birthDate?: DateLike;
    reception?: ReceptionLike;
    celebrant?: string | null;
    profession?: string | null;
    placeOfBirth?: string | null;
    maritalStatus?: string | null;
    baptizedInInfancy?: BooleanLike;
    religiousBackground?: string | null;
}

export async function updateMemberAction(rawInput: UpdateMemberActionInput): Promise<MemberView> {
    if (!rawInput) {
        throw new Error("Input is required.");
    }

    const useCase = resolve<UpdateMemberUseCase>(ServiceTokens.UpdateMemberUseCase);
    const normalized = normalizeUpdateInput(rawInput);
    const output = await useCase.execute(normalized);
    await invalidateMembersCache({ memberId: output.id });
    return output;
}

function normalizeUpdateInput(raw: UpdateMemberActionInput): UpdateMemberInput {
    const memberId = ensureMemberId(raw.memberId);
    const normalized: UpdateMemberInput = { memberId };

    if (hasOwn(raw, "fullName")) {
        normalized.fullName = ensureNonEmptyString(raw.fullName, MemberErrorCodes.INVALID_FULL_NAME);
    }

    if (hasOwn(raw, "email")) {
        normalized.email = toNullableString(raw.email);
    }

    if (hasOwn(raw, "phone")) {
        normalized.phone = toNullableString(raw.phone);
    }

    if (hasOwn(raw, "cpf")) {
        normalized.cpf = toNullableString(raw.cpf);
    }

    if (hasOwn(raw, "sex")) {
        if (raw.sex === null) {
            throw new Error("Member sex cannot be null.");
        }
        normalized.sex = ensureMemberSex(raw.sex);
    }

    if (hasOwn(raw, "maritalStatus")) {
        if (raw.maritalStatus === null) {
            throw new Error("Member marital status cannot be null.");
        }
        normalized.maritalStatus = ensureMemberMaritalStatus(raw.maritalStatus);
    }

    if (hasOwn(raw, "address")) {
        normalized.address = buildMemberAddress(raw.address);
    }

    if (hasOwn(raw, "literacy")) {
        const literacy = parseOptionalBoolean(raw.literacy);
        if (literacy === undefined) {
            throw new Error("Member literacy must be true or false.");
        }
        normalized.literacy = literacy;
    }

    if (hasOwn(raw, "birthDate")) {
        normalized.birthDate = parseOptionalDate(raw.birthDate, MemberErrorCodes.INVALID_BIRTH_DATE);
    }

    if (hasOwn(raw, "reception")) {
        normalized.reception = buildMemberReception(raw.reception, MemberErrorCodes.INVALID_RECEPTION_DATE);
    }

    if (hasOwn(raw, "celebrant")) {
        normalized.celebrant = ensureNonEmptyString(raw.celebrant, "Member celebrant is required.");
    }

    if (hasOwn(raw, "profession")) {
        normalized.profession = ensureNonEmptyString(raw.profession, "Member profession is required.");
    }

    if (hasOwn(raw, "placeOfBirth")) {
        normalized.placeOfBirth = ensureNonEmptyString(raw.placeOfBirth, "Member place of birth is required.");
    }

    if (hasOwn(raw, "baptizedInInfancy")) {
        const baptizedInInfancy = parseOptionalBoolean(raw.baptizedInInfancy);
        if (baptizedInInfancy === undefined) {
            throw new Error("Member baptizedInInfancy must be true or false.");
        }
        normalized.baptizedInInfancy = baptizedInInfancy;
    }

    if (hasOwn(raw, "religiousBackground")) {
        normalized.religiousBackground = ensureNonEmptyString(raw.religiousBackground, "Member religious background is required.");
    }

    return normalized;
}

function hasOwn(object: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
}
