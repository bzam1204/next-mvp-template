'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMemberPermanentlyAction } from '@/infrastructure/actions/members/delete-member-permanently.action';
import type { DeleteMemberPermanentlyActionInput } from '@/infrastructure/actions/members/delete-member-permanently.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useDeleteMemberPermanently() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteMemberPermanentlyActionInput>({
        mutationFn: (input) => deleteMemberPermanentlyAction(input),
        onSuccess: async (_data, variables) => {
            const memberId = variables?.memberId?.trim();
            const invalidations = [queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() })];

            if (memberId) {
                invalidations.push(queryClient.invalidateQueries({ queryKey: QueryKeys.members.byId(memberId) }));
            }

            await Promise.all(invalidations);

            if (memberId) {
                queryClient.removeQueries({ queryKey: QueryKeys.members.byId(memberId) });
            }
        },
    });
}
