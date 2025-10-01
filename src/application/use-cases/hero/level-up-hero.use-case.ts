import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type HeroRepository from "@/domain/repositories/hero.repository";

import type { HeroView } from "@/application/dtos/hero/hero.view";
import type { LevelUpHeroInput } from "@/application/dtos/hero/level-up-hero.input";

import HeroMapper from "@/shared/mappers/hero.mapper";

export default class LevelUpHeroUseCase {
    constructor(
        private readonly unitOfWork: UnitOfWork,
        private readonly heroRepositoryFactory: () => HeroRepository,
    ) {}

    public async execute(input: LevelUpHeroInput): Promise<HeroView> {
        return this.unitOfWork.runInTransaction(async () => {
            const repository = this.heroRepositoryFactory();
            const hero = await repository.findById(input.heroId);
            hero.levelUp();
            await repository.save(hero);
            const events = hero.pullEvents();
            const output = { result: HeroMapper.toView(hero), events };
            return output;
        });
    }
}
