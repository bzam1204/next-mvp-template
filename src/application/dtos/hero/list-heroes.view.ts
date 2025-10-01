export interface HeroListItemView {
    id: string;
    name: string;
    power: number;
    alive: boolean;
    createdAt: string;
}

export interface ListHeroesView {
    items: HeroListItemView[];
    total: number;
}
