'use server';

import type { ListHeroesView } from "@/application/dtos/hero/list-heroes.view";
import QueryService from "@/application/services/query.service";
import { resolve } from "@/infrastructure/container";
import { ServiceTokens } from "@/shared/constants/service-constants";

export async function listHeroesAction(): Promise<ListHeroesView> {
    const queryService = resolve<QueryService>(ServiceTokens.QueryService);
    return queryService.heroQuery.listHeroes();
}
