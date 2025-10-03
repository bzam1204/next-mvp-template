'use server';

import type { CreateMemberInput } from "@/application/dtos/member/create-member.input";
import type { MemberView } from "@/application/dtos/member/member.view";
import RegisterMemberUseCase from "@/application/use-cases/member/register-member.use-case";

import { resolve } from "@/infrastructure/container";

import { invalidateMembersCache } from "@/infrastructure/cache/members-cache";

import { ServiceTokens } from "@/shared/constants/service-constants";
import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

import {
    buildMemberAddress,
    buildMemberReception,
    ensureMemberClassification,
    ensureMemberMaritalStatus,
    ensureMemberSex,
    ensureNonEmptyString,
    parseBoolean,
    parseDate,
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

export interface RegisterMemberActionInput {
    sex?: string;
    cpf?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: AddressLike;
    fullName?: string;
    literacy?: BooleanLike;
    birthDate?: DateLike;
    reception?: ReceptionLike;
    celebrant?: string;
    professionOfFaithDate?: DateLike;
    placeOfBirth?: string;
    maritalStatus?: string;
    classification?: string;
    baptizedInInfancy?: BooleanLike;
    religiousBackground?: string;
}

export async function registerMemberAction(rawInput: RegisterMemberActionInput): Promise<MemberView> {
    if (!rawInput) {
        throw new Error("Input is required.");
    }

    const normalized = normalizeRegisterInput(rawInput);
    const useCase = resolve<RegisterMemberUseCase>(ServiceTokens.RegisterMemberUseCase);
    const output = await useCase.execute(normalized);
    await invalidateMembersCache({ memberId: output.id });
    return output;
}

function normalizeRegisterInput(raw: RegisterMemberActionInput): CreateMemberInput {
    const classification = ensureMemberClassification(raw.classification);
    const sex = ensureMemberSex(raw.sex);
    const maritalStatus = ensureMemberMaritalStatus(raw.maritalStatus);
    const birthDate = parseDate(raw.birthDate, MemberErrorCodes.INVALID_BIRTH_DATE);
    const literacy = parseBoolean(raw.literacy, "Member literacy must be true or false.");
    const baptizedInInfancy = parseBoolean(raw.baptizedInInfancy, "Member baptizedInInfancy must be true or false.");
    const religiousBackground = ensureNonEmptyString(raw.religiousBackground, "Member religious background is required.");
    const placeOfBirth = ensureNonEmptyString(raw.placeOfBirth, "Member place of birth is required.");
    const professionOfFaithDate = parseDate(raw.professionOfFaithDate, MemberErrorCodes.INVALID_RECEPTION_DATE);
    const celebrant = ensureNonEmptyString(raw.celebrant, "Member celebrant is required.");
    const fullName = ensureNonEmptyString(raw.fullName, MemberErrorCodes.INVALID_FULL_NAME);
    const address = buildMemberAddress(raw.address);
    const reception = buildMemberReception(raw.reception, MemberErrorCodes.INVALID_RECEPTION_DATE);

    const normalized: CreateMemberInput = {
        sex,
        classification,
        fullName,
        birthDate,
        literacy,
        celebrant,
        professionOfFaithDate,
        placeOfBirth,
        religiousBackground,
        maritalStatus,
        reception,
        address,
        baptizedInInfancy,
        cpf: toNullableString(raw.cpf),
        email: toNullableString(raw.email),
        phone: toNullableString(raw.phone),
    };

    return normalized;
}
