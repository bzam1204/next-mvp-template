import { Hero } from "@/domain/entities/hero/hero.entity";

export default interface HeroRepository {
    findById(heroId: string): Promise<Hero>;
    save(hero: Hero): Promise<Hero>;
}
