'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreMemberAction } from '@/infrastructure/actions/members/restore-member.action';
import type { RestoreMemberActionInput } from '@/infrastructure/actions/members/restore-member.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRestoreMember() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, RestoreMemberActionInput>({
        mutationFn: (input) => restoreMemberAction(input),
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
