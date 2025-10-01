import type { HeroListItemView, ListHeroesView } from "@/application/dtos/hero/list-heroes.view";

export default interface HeroQuery {
    listHeroes(): Promise<ListHeroesView>;
    findHeroById(heroId: string): Promise<HeroListItemView | null>;
}
