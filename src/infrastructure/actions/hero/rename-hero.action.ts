'use server';

import type { RenameHeroInput } from "@/application/dtos/hero/rename-hero.input";
import RenameHeroUseCase from "@/application/use-cases/hero/rename-hero.use-case";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import { resolve } from "@/infrastructure/container";
import { ServiceTokens } from "@/shared/constants/service-constants";

export async function renameHeroAction(input: RenameHeroInput): Promise<HeroView> {
    if (!input?.heroId) {
        throw new Error("Hero id is required");
    }
    if (!input?.newName || input.newName.trim().length < 2) {
        throw new Error("Hero name must be at least 2 characters long.");
    }

    const useCase = resolve<RenameHeroUseCase>(ServiceTokens.RenameHeroUseCase);
    return useCase.execute({
        heroId: input.heroId,
        newName: input.newName.trim(),
    });
}
