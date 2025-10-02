'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MemberView } from '@/application/dtos/member/member.view';
import { updateMemberAction } from '@/infrastructure/actions/members/update-member.action';
import type { UpdateMemberActionInput } from '@/infrastructure/actions/members/update-member.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useUpdateMember() {
    const queryClient = useQueryClient();

    return useMutation<MemberView, Error, UpdateMemberActionInput>({
        mutationFn: (input) => updateMemberAction(input),
        onSuccess: async (member) => {
            queryClient.setQueryData(QueryKeys.members.byId(member.id), member);

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() }),
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.byId(member.id) }),
            ]);
        },
    });
}
