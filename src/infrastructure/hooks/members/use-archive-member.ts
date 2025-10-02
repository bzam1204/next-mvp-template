'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { archiveMemberAction } from '@/infrastructure/actions/members/archive-member.action';
import type { ArchiveMemberActionInput } from '@/infrastructure/actions/members/archive-member.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useArchiveMember() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, ArchiveMemberActionInput>({
        mutationFn: (input) => archiveMemberAction(input),
        onSuccess: async (_data, variables) => {
            const memberId = variables?.memberId?.trim();
            const invalidations = [queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() })];

            if (memberId) {
                invalidations.push(queryClient.invalidateQueries({ queryKey: QueryKeys.members.byId(memberId) }));
            }

            await Promise.all(invalidations);
        },
    });
}
