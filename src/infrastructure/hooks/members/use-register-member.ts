'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MemberView } from '@/application/dtos/member/member.view';
import { registerMemberAction } from '@/infrastructure/actions/members/register-member.action';
import type { RegisterMemberActionInput } from '@/infrastructure/actions/members/register-member.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRegisterMember() {
    const queryClient = useQueryClient();

    return useMutation<MemberView, Error, RegisterMemberActionInput>({
        mutationFn: (input) => registerMemberAction(input),
        onSuccess: async (member) => {
            queryClient.setQueryData(QueryKeys.members.byId(member.id), member);

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() }),
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.byId(member.id) }),
            ]);
        },
    });
}
