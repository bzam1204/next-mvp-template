import type { MemberView } from '@/application/dtos/member/member.view';
import type { RegisterMemberActionInput } from '@/infrastructure/actions/members/register-member.action';
import type { UpdateMemberActionInput } from '@/infrastructure/actions/members/update-member.action';

import { createEmptyMemberFormValues, type MemberFormValues } from './member-form';

function toDateInput(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getUTCFullYear();
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function toNullable(value: string): string | null {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function toOptional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

export function memberViewToFormValues(view: MemberView): MemberFormValues {
    const base = createEmptyMemberFormValues();

    return {
        ...base,
        fullName: view.fullName ?? '',
        email: view.email ?? '',
        phone: view.phone ?? '',
        cpf: view.cpf ?? '',
        sex: view.sex ?? '',
        maritalStatus: view.maritalStatus ?? '',
        classification: view.classification ?? base.classification,
        birthDate: toDateInput(view.birthDate),
        placeOfBirth: view.placeOfBirth ?? '',
        literacy: true, // MemberView ainda não expõe literacy; manter valor padrão.
        profession: view.profession ?? '',
        celebrant: view.celebrant ?? '',
        religiousBackground: view.religiousBackground ?? '',
        receptionDate: toDateInput(view.reception?.date ?? ''),
        receptionMode: view.reception?.mode ?? '',
        receptionLocation: view.reception?.location ?? '',
        baptizedInInfancy: Boolean(view.baptizedInInfancy),
        addressStreet: view.address?.street ?? '',
        addressNumber: view.address?.number ?? '',
        addressDistrict: view.address?.district ?? '',
        addressCity: view.address?.city ?? '',
        addressState: view.address?.state ?? '',
        addressZip: view.address?.zip ?? '',
        addressComplement: view.address?.complement ?? '',
    };
}

export function buildRegisterMemberInput(values: MemberFormValues): RegisterMemberActionInput {
    return {
        fullName: values.fullName,
        email: toNullable(values.email),
        phone: toNullable(values.phone),
        cpf: toNullable(values.cpf),
        classification: values.classification,
        sex: values.sex,
        maritalStatus: values.maritalStatus,
        birthDate: values.birthDate,
        placeOfBirth: values.placeOfBirth,
        literacy: values.literacy,
        profession: values.profession,
        celebrant: values.celebrant,
        religiousBackground: values.religiousBackground,
        baptizedInInfancy: values.baptizedInInfancy,
        reception: {
            date: values.receptionDate,
            mode: values.receptionMode,
            location: values.receptionLocation,
        },
        address: {
            street: values.addressStreet,
            city: values.addressCity,
            number: toOptional(values.addressNumber),
            district: toOptional(values.addressDistrict),
            state: toOptional(values.addressState),
            zip: toOptional(values.addressZip),
            complement: toOptional(values.addressComplement),
        },
    };
}

export function buildUpdateMemberInput(memberId: string, values: MemberFormValues): UpdateMemberActionInput {
    return {
        memberId,
        fullName: values.fullName,
        email: toNullable(values.email),
        phone: toNullable(values.phone),
        cpf: toNullable(values.cpf),
        sex: values.sex,
        maritalStatus: values.maritalStatus,
        birthDate: values.birthDate,
        placeOfBirth: values.placeOfBirth,
        literacy: values.literacy,
        profession: values.profession,
        celebrant: values.celebrant,
        religiousBackground: values.religiousBackground,
        baptizedInInfancy: values.baptizedInInfancy,
        reception: {
            date: values.receptionDate,
            mode: values.receptionMode,
            location: values.receptionLocation,
        },
        address: {
            street: values.addressStreet,
            city: values.addressCity,
            number: toOptional(values.addressNumber),
            district: toOptional(values.addressDistrict),
            state: toOptional(values.addressState),
            zip: toOptional(values.addressZip),
            complement: toOptional(values.addressComplement),
        },
    };
}
