'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateHeroInput } from "@/application/dtos/hero/create-hero.input";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import { createHeroAction } from "@/infrastructure/actions/hero/create-hero.action";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useCreateHero() {
    const queryClient = useQueryClient();

    return useMutation<HeroView, Error, CreateHeroInput>({
        mutationFn: (input) => createHeroAction(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroes.all() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroEvents.recent() });
        },
    });
}
