'use server';

import type SearchMembersQuery from "@/application/queries/member/search-members.query";
import type { SearchMembersQueryResult } from "@/application/queries/member/search-members.query";

import { resolve } from "@/infrastructure/container";

import { QueryTokens } from "@/shared/constants/query-constants";

import { sanitizeOptionalString } from "./validators";

export interface SearchMembersActionInput {
    page?: number | string | null;
    pageSize?: number | string | null;
    name?: string | null;
    profile?: string | null;
    visibility?: string | null;
}

export async function searchMembersAction(
    input: SearchMembersActionInput = {},
): Promise<SearchMembersQueryResult> {
    const page = normalizePositiveInteger(input.page, 1);
    const pageSize = normalizePositiveInteger(input.pageSize, 10);

    const name = sanitizeOptionalString(input.name);
    const profile = sanitizeOptionalString(input.profile);
    const visibility = normalizeVisibility(input.visibility);

    const query = resolve<SearchMembersQuery>(QueryTokens.SearchMembersQuery);
    const result = await query.execute({
        page,
        pageSize,
        name: name ?? undefined,
        profile: profile ?? undefined,
        visibility: visibility ?? undefined,
    });
    return result;
}

function normalizePositiveInteger(value: number | string | null | undefined, fallback: number): number {
    if (typeof value === "number") {
        if (Number.isFinite(value) && value >= 1) return Math.floor(value);
        return fallback;
    }

    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed) && parsed >= 1) {
            return parsed;
        }
        return fallback;
    }

    return fallback;
}

function normalizeVisibility(value: string | null | undefined): "active" | "archived" | "all" | undefined {
    const cleaned = sanitizeOptionalString(value);
    if (!cleaned) return undefined;

    if (cleaned === "active" || cleaned === "archived" || cleaned === "all") {
        return cleaned;
    }

    throw new Error("Invalid visibility filter.");
}
