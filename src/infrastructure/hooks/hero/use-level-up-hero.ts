'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { LevelUpHeroInput } from "@/application/dtos/hero/level-up-hero.input";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import { levelUpHeroAction } from "@/infrastructure/actions/hero/level-up-hero.action";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useLevelUpHero() {
    const queryClient = useQueryClient();

    return useMutation<HeroView, Error, LevelUpHeroInput>({
        mutationFn: (input) => levelUpHeroAction(input),
        onSuccess: (hero) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroes.all() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroes.byId(hero.id) });
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroEvents.recent() });
        },
    });
}
