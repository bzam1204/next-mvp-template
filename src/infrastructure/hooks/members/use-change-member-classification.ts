'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MemberView } from '@/application/dtos/member/member.view';
import { changeMemberClassificationAction } from '@/infrastructure/actions/members/change-member-classification.action';
import type { ChangeMemberClassificationActionInput } from '@/infrastructure/actions/members/change-member-classification.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useChangeMemberClassification() {
    const queryClient = useQueryClient();

    return useMutation<MemberView, Error, ChangeMemberClassificationActionInput>({
        mutationFn: (input) => changeMemberClassificationAction(input),
        onSuccess: async (member) => {
            queryClient.setQueryData(QueryKeys.members.byId(member.id), member);

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() }),
                queryClient.invalidateQueries({ queryKey: QueryKeys.members.byId(member.id) }),
            ]);
        },
    });
}
