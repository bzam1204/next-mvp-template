'use client';

import { useQuery } from "@tanstack/react-query";

import type { ListHeroesView } from "@/application/dtos/hero/list-heroes.view";
import { listHeroesAction } from "@/infrastructure/actions/hero/list-heroes.action";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useHeroes() {
    return useQuery<ListHeroesView>({
        queryKey: QueryKeys.heroes.all(),
        queryFn: () => listHeroesAction(),
    });
}
