'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RenameHeroInput } from "@/application/dtos/hero/rename-hero.input";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import { renameHeroAction } from "@/infrastructure/actions/hero/rename-hero.action";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useRenameHero() {
    const queryClient = useQueryClient();

    return useMutation<HeroView, Error, RenameHeroInput>({
        mutationFn: (input) => renameHeroAction(input),
        onSuccess: (hero) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroes.all() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroes.byId(hero.id) });
            queryClient.invalidateQueries({ queryKey: QueryKeys.heroEvents.recent() });
        },
    });
}
