'use server';

import type { LevelUpHeroInput } from "@/application/dtos/hero/level-up-hero.input";
import LevelUpHeroUseCase from "@/application/use-cases/hero/level-up-hero.use-case";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import { resolve } from "@/infrastructure/container";
import { ServiceTokens } from "@/shared/constants/service-constants";

export async function levelUpHeroAction(input: LevelUpHeroInput): Promise<HeroView> {
    if (!input?.heroId) {
        throw new Error("Hero id is required");
    }

    const useCase = resolve<LevelUpHeroUseCase>(ServiceTokens.LevelUpHeroUseCase);
    return useCase.execute({ heroId: input.heroId });
}
