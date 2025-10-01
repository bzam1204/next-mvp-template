import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type HeroRepository from "@/domain/repositories/hero.repository";

import type { HeroView } from "@/application/dtos/hero/hero.view";
import type { RenameHeroInput } from "@/application/dtos/hero/rename-hero.input";

import HeroMapper from "@/shared/mappers/hero.mapper";

export default class RenameHeroUseCase {
    constructor(
        private readonly unitOfWork: UnitOfWork,
        private readonly heroRepositoryFactory: () => HeroRepository,
    ) {}

    public async execute(input: RenameHeroInput): Promise<HeroView> {
        return this.unitOfWork.runInTransaction(async () => {
            const repository = this.heroRepositoryFactory();
            const hero = await repository.findById(input.heroId);
            hero.rename(input.newName);
            await repository.save(hero);
            const events = hero.pullEvents();
            const output = { result: HeroMapper.toView(hero), events };
            return output;
        });
    }
}
