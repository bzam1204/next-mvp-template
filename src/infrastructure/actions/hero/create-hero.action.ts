'use server';

import CreateHeroUseCase from "@/application/use-cases/hero/create-hero.use-case";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import type { CreateHeroInput } from "@/application/dtos/hero/create-hero.input";

import { resolve } from "@/infrastructure/container";

import { ServiceTokens } from "@/shared/constants/service-constants";

export async function createHeroAction(input: CreateHeroInput): Promise<HeroView> {
    if (!input?.name || input.name.trim().length < 2) {
        throw new Error("Hero name must be at least 2 characters long.");
    }

    const useCase = resolve<CreateHeroUseCase>(ServiceTokens.CreateHeroUseCase);
    const output = await useCase.execute({ name: input.name.trim() });
    return output;
}
