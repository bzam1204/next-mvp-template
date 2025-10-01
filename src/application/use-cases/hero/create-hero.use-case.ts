import { Hero } from "@/domain/entities/hero/hero.entity";
import type HeroRepository from "@/domain/repositories/hero.repository";
import type { UnitOfWork } from "@/domain/services/unit-of-work";

import type IdGenerator from "@/application/services/id-generator.service";
import type { HeroView } from "@/application/dtos/hero/hero.view";
import type { CreateHeroInput } from "@/application/dtos/hero/create-hero.input";

import HeroMapper from "@/shared/mappers/hero.mapper";

export class CreateHeroUseCase {
    constructor(
        private readonly unitOfWork: UnitOfWork,
        private readonly idGenerator: IdGenerator,
        private readonly heroRepositoryFactory: () => HeroRepository
    ) {}

    public async execute(input: CreateHeroInput): Promise<HeroView> {
        const transactionOutput = await this.unitOfWork.runInTransaction(
            async () => {
                const hero = Hero.create({ heroId: this.idGenerator.generate(), name: input.name });
                const repository = this.heroRepositoryFactory();
                await repository.save(hero); 
                const events = hero.pullEvents();
                const output = { result: HeroMapper.toView(hero), events };
                return output;
            }
        );
        return transactionOutput;
    }
}

export default CreateHeroUseCase;
