'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { SearchMembersQueryResult } from '@/application/queries/member/search-members.query';
import type { MemberSearchKeyParams } from '@/infrastructure/cache/query-keys';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { searchMembersAction } from '@/infrastructure/actions/members/search-members.action';

export interface UseSearchMembersOptions {
    page?: number;
    pageSize?: number;
    name?: string | null;
    profile?: string | null;
    visibility?: 'active' | 'archived' | 'all';
    enabled?: boolean;
}

function normalizeOptionalString(value?: string | null): string | undefined {
    if (value === undefined || value === null) return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

function buildSearchKeyParams(options: Required<Pick<UseSearchMembersOptions, 'page' | 'pageSize'>> &
    Omit<UseSearchMembersOptions, 'enabled'>): MemberSearchKeyParams {
    const params: MemberSearchKeyParams = {
        page: options.page,
        pageSize: options.pageSize,
    };

    const normalizedName = normalizeOptionalString(options.name ?? undefined);
    if (normalizedName !== undefined) {
        params.name = normalizedName;
    }

    const normalizedProfile = normalizeOptionalString(options.profile ?? undefined);
    if (normalizedProfile !== undefined) {
        params.profile = normalizedProfile;
    }

    if (options.visibility) {
        params.visibility = options.visibility;
    }

    return params;
}

export function useSearchMembers(options: UseSearchMembersOptions = {}) {
    const {
        page = 1,
        pageSize = 10,
        name,
        profile,
        visibility,
        enabled = true,
    } = options;

    const filters = useMemo(() => buildSearchKeyParams({ page, pageSize, name, profile, visibility }), [
        page,
        pageSize,
        name,
        profile,
        visibility,
    ]);

    return useQuery<SearchMembersQueryResult>({
        queryKey: QueryKeys.members.search(filters),
        queryFn: () =>
            searchMembersAction({
                page,
                pageSize,
                name,
                profile,
                visibility,
            }),
        enabled,
        keepPreviousData: true,
    });
}
