import type { MemberView } from "@/application/dtos/member/member.view";

interface RawAddress {
    street?: unknown;
    number?: unknown;
    district?: unknown;
    city?: unknown;
    state?: unknown;
    zip?: unknown;
    complement?: unknown;
}

export interface PrismaMemberRecord {
    memberId: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    cpf: string | null;
    classification: "communicant" | "non-communicant" | null;
    status: "active" | "archived" | null;
    sex: "male" | "female" | null;
    maritalStatus: "single" | "married" | "divorced" | "widowed" | null;
    address: unknown;
    birthDate: Date | null;
    createdAt: Date | null;
    receptionDate: Date | null;
    receptionMode: "profession_of_faith" | "transfer" | "restoration" | null;
    receptionLocation: string | null;
    celebrant: string | null;
    profession: string | null;
    placeOfBirth: string | null;
    baptizedInInfancy: boolean | null;
    religiousBackground: string | null;
}

export function mapPrismaMemberToView(record: PrismaMemberRecord): MemberView {
    const address = parseAddress(record.address);

    return {
        id: record.memberId,
        fullName: record.fullName,
        email: record.email ?? null,
        phone: record.phone ?? null,
        cpf: record.cpf ?? null,
        classification: (record.classification ?? "communicant") as MemberView["classification"],
        status: (record.status ?? "active") as MemberView["status"],
        sex: (record.sex ?? "male") as MemberView["sex"],
        maritalStatus: (record.maritalStatus ?? "single") as MemberView["maritalStatus"],
        address,
        birthDate: toIsoString(record.birthDate),
        createdAt: toIsoString(record.createdAt),
        reception: {
            date: toIsoString(record.receptionDate),
            mode: (record.receptionMode ?? "profession_of_faith") as MemberView["reception"]["mode"],
            location: record.receptionLocation ?? "",
        },
        celebrant: record.celebrant ?? "",
        profession: record.profession ?? "",
        placeOfBirth: record.placeOfBirth ?? "",
        baptizedInInfancy: record.baptizedInInfancy ?? false,
        religiousBackground: record.religiousBackground ?? "",
    };
}

function parseAddress(raw: unknown): MemberView["address"] {
    if (!raw) {
        return { street: "", city: "" };
    }

    let value: RawAddress | null = null;

    if (typeof raw === "string") {
        try {
            value = JSON.parse(raw) as RawAddress;
        } catch {
            return { street: "", city: "" };
        }
    } else if (typeof raw === "object") {
        value = raw as RawAddress;
    }

    if (value === null) {
        return { street: "", city: "" };
    }

    return {
        street: asString(value.street),
        city: asString(value.city),
        number: optionalString(value.number),
        district: optionalString(value.district),
        state: optionalString(value.state),
        zip: optionalString(value.zip),
        complement: optionalString(value.complement),
    };
}

function asString(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function optionalString(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}

function toIsoString(value: Date | null): string {
    return value ? value.toISOString() : "";
}
