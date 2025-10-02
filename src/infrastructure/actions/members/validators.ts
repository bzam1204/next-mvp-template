import type {
    MemberAddress,
    MemberClassification,
    MemberMaritalStatus,
    MemberReception,
    MemberReceptionMode,
    MemberSex,
} from "@/domain/entities/member/member.entity";

import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

const MEMBER_SEX_VALUES: ReadonlySet<MemberSex> = new Set<MemberSex>(["male", "female"]);
const MEMBER_MARITAL_STATUS_VALUES: ReadonlySet<MemberMaritalStatus> = new Set<MemberMaritalStatus>([
    "single",
    "married",
    "divorced",
    "widowed",
]);
const MEMBER_RECEPTION_MODE_VALUES: ReadonlySet<MemberReceptionMode> = new Set<MemberReceptionMode>([
    "profession_of_faith",
    "transfer",
    "restoration",
]);
const MEMBER_CLASSIFICATION_VALUES: ReadonlySet<MemberClassification> = new Set<MemberClassification>([
    "communicant",
    "non-communicant",
]);

type UnknownRecord = Record<string, unknown>;

function assertRecord(value: unknown, message: string): asserts value is UnknownRecord {
    if (!value || typeof value !== "object") {
        throw new Error(message);
    }
}

export function ensureNonEmptyString(value: unknown, message: string): string {
    if (typeof value !== "string") {
        throw new Error(message);
    }

    const trimmed = value.trim();
    if (!trimmed) {
        throw new Error(message);
    }

    return trimmed;
}

export function toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

export function toOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

export function parseBoolean(value: unknown, message: string): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true" || normalized === "1") return true;
        if (normalized === "false" || normalized === "0") return false;
    }
    if (typeof value === "number") {
        if (value === 1) return true;
        if (value === 0) return false;
    }

    throw new Error(message);
}

export function parseOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    return parseBoolean(value, "Value must be a boolean.");
}

export function parseDate(value: unknown, message: string): Date {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new Error(message);
        }
        return value;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            throw new Error(message);
        }

        const parsed = new Date(trimmed);
        if (Number.isNaN(parsed.getTime())) {
            throw new Error(message);
        }
        return parsed;
    }

    throw new Error(message);
}

export function parseOptionalDate(value: unknown, message: string): Date | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    return parseDate(value, message);
}

export function ensureMemberSex(value: unknown): MemberSex {
    const sex = ensureNonEmptyString(value, "Member sex is required.") as MemberSex;
    if (!MEMBER_SEX_VALUES.has(sex)) {
        throw new Error("Invalid member sex.");
    }
    return sex;
}

export function ensureMemberMaritalStatus(value: unknown): MemberMaritalStatus {
    const status = ensureNonEmptyString(value, "Member marital status is required.") as MemberMaritalStatus;
    if (!MEMBER_MARITAL_STATUS_VALUES.has(status)) {
        throw new Error("Invalid member marital status.");
    }
    return status;
}

export function ensureMemberReceptionMode(value: unknown): MemberReceptionMode {
    const mode = ensureNonEmptyString(value, "Member reception mode is required.") as MemberReceptionMode;
    if (!MEMBER_RECEPTION_MODE_VALUES.has(mode)) {
        throw new Error("Invalid member reception mode.");
    }
    return mode;
}

export function ensureMemberClassification(value: unknown): MemberClassification {
    const classification = ensureNonEmptyString(value, MemberErrorCodes.INVALID_CLASSIFICATION) as MemberClassification;
    if (!MEMBER_CLASSIFICATION_VALUES.has(classification)) {
        throw new Error(MemberErrorCodes.INVALID_CLASSIFICATION);
    }
    return classification;
}

export function ensureMemberId(value: unknown): string {
    return ensureNonEmptyString(value, "Member id is required.");
}

export function buildMemberAddress(value: unknown): MemberAddress {
    assertRecord(value, "Member address is required.");
    const street = ensureNonEmptyString(value.street, "Member street is required.");
    const city = ensureNonEmptyString(value.city, "Member city is required.");

    return {
        street,
        city,
        number: toOptionalString(value.number),
        district: toOptionalString(value.district),
        state: toOptionalString(value.state),
        zip: toOptionalString(value.zip),
        complement: toOptionalString(value.complement),
    };
}

export function buildMemberReception(value: unknown, dateMessage: string): MemberReception {
    assertRecord(value, "Member reception details are required.");
    return {
        date: parseDate(value.date, dateMessage),
        mode: ensureMemberReceptionMode(value.mode),
        location: ensureNonEmptyString(value.location, "Member reception location is required."),
    };
}

export function sanitizeOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

export function sanitizeNullableString(value: unknown): string | null {
    const optional = sanitizeOptionalString(value);
    if (optional === undefined) return null;
    return optional;
}
