'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { MemberView } from '@/application/dtos/member/member.view';
import { getMemberByIdAction } from '@/infrastructure/actions/members/get-member-by-id.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export interface UseMemberByIdOptions {
    enabled?: boolean;
}

function normalizeMemberId(memberId?: string | null): string {
    if (!memberId) return '';
    return memberId.trim();
}

export function useMemberById(memberId: string | null | undefined, options: UseMemberByIdOptions = {}) {
    const normalizedMemberId = normalizeMemberId(memberId);
    const isEnabled = Boolean(normalizedMemberId) && (options.enabled ?? true);
    const queryKey = useMemo(
        () => QueryKeys.members.byId(normalizedMemberId || 'missing-member'),
        [normalizedMemberId],
    );

    return useQuery<MemberView | null>({
        queryKey,
        queryFn: () => getMemberByIdAction({ memberId: normalizedMemberId }),
        enabled: isEnabled,
    });
}
