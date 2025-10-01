import { Hero } from "@/domain/entities/hero/hero.entity";
import { EntityNotFoundException } from "@/domain/exceptions/entity-not-found.exception";
import type HeroRepository from "@/domain/repositories/hero.repository";
import type { PrismaClientLike } from "@/infrastructure/prisma/types";

export class PrismaHeroRepository implements HeroRepository {
    constructor(private readonly getClient: () => PrismaClientLike) {}

    private get prisma(): PrismaClientLike {
        return this.getClient();
    }

    public async findById(heroId: string): Promise<Hero> {
        const record = await this.prisma.hero.findUnique({
            where: { heroId },
        });

        if (!record) {
            throw new EntityNotFoundException("Hero", heroId);
        }

        return Hero.rehydrate({
            heroId: record.heroId,
            name: record.name,
            power: record.power,
            alive: record.alive,
            createdAt: record.createdAt,
        });
    }

    public async save(hero: Hero): Promise<Hero> {
        const snapshot = hero.toSnapshot();

        await this.prisma.hero.upsert({
            where: { heroId: snapshot.heroId },
            create: {
                heroId: snapshot.heroId,
                name: snapshot.name,
                power: snapshot.power,
                alive: snapshot.alive,
                createdAt: snapshot.createdAt,
            },
            update: {
                name: snapshot.name,
                power: snapshot.power,
                alive: snapshot.alive,
            },
        });

        return hero;
    }
}

export default PrismaHeroRepository;
