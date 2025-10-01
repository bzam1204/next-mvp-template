import type { HeroListItemView, ListHeroesView } from "@/application/dtos/hero/list-heroes.view";
import type HeroQuery from "@/application/queries/hero-query/hero.query";
import type { PrismaClientLike } from "@/infrastructure/prisma/types";

export class PrismaHeroQuery implements HeroQuery {
    constructor(private readonly getClient: () => PrismaClientLike) {}

    private get prisma(): PrismaClientLike {
        return this.getClient();
    }

    public async listHeroes(): Promise<ListHeroesView> {
        const records = await this.prisma.hero.findMany({
            orderBy: { createdAt: "desc" },
        });

        const items = records.map((record) => ({
            id: record.heroId,
            name: record.name,
            power: record.power,
            alive: record.alive,
            createdAt: record.createdAt.toISOString(),
        }));

        return {
            items,
            total: items.length,
        };
    }

    public async findHeroById(heroId: string): Promise<HeroListItemView | null> {
        const record = await this.prisma.hero.findUnique({
            where: { heroId },
        });

        if (!record) return null;

        return {
            id: record.heroId,
            name: record.name,
            power: record.power,
            alive: record.alive,
            createdAt: record.createdAt.toISOString(),
        };
    }
}

export default PrismaHeroQuery;
