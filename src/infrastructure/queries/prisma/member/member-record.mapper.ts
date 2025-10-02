import type { Member as PrismaMember } from "@prisma/client";

import type { MemberView } from "@/application/dtos/member/member.view";

type PrismaMemberRecord = PrismaMember;

function normalizeClassification(value: PrismaMemberRecord["classification"] | null): MemberView["classification"] {
    if (value === "nonCommunicant") return "non-communicant";
    return "communicant";
}

function normalizeMaritalStatus(value: PrismaMemberRecord["maritalStatus"] | null): MemberView["maritalStatus"] {
    switch (value) {
        case "married":
        case "divorced":
        case "widowed":
            return value;
        case "single":
        default:
            return "single";
    }
}

function normalizeReceptionMode(value: PrismaMemberRecord["receptionMode"] | null): MemberView["reception"]["mode"] {
    switch (value) {
        case "transfer":
        case "restoration":
            return value;
        case "profession_of_faith":
        default:
            return "profession_of_faith";
    }
}

function toIsoString(value: Date | null): string {
    return value ? value.toISOString() : "";
}

export function mapPrismaMemberToView(record: PrismaMemberRecord): MemberView {
    return {
        id: record.memberId,
        fullName: record.fullName,
        email: record.email ?? null,
        phone: record.phone ?? null,
        cpf: record.cpf ?? null,
        classification: normalizeClassification(record.classification ?? "communicant"),
        status: record.status,
        sex: record.sex,
        maritalStatus: normalizeMaritalStatus(record.maritalStatus),
        address: {
            street: record.addressStreet,
            city: record.addressCity,
            number: record.addressNumber ?? undefined,
            district: record.addressDistrict ?? undefined,
            state: record.addressState ?? undefined,
            zip: record.addressZip ?? undefined,
            complement: record.addressComplement ?? undefined,
        },
        birthDate: toIsoString(record.birthDate),
        createdAt: toIsoString(record.createdAt),
        reception: {
            date: toIsoString(record.receptionDate),
            mode: normalizeReceptionMode(record.receptionMode),
            location: record.receptionLocation ?? "",
        },
        celebrant: record.celebrant ?? "",
        profession: record.profession ?? "",
        placeOfBirth: record.placeOfBirth ?? "",
        baptizedInInfancy: record.baptizedInInfancy ?? false,
        religiousBackground: record.religiousBackground ?? "",
    };
}
