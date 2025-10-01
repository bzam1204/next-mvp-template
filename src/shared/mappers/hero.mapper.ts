import { Hero } from "@/domain/entities/hero/hero.entity";

import type { HeroView } from "@/application/dtos/hero/hero.view";

export default class HeroMapper {
    public static toView(hero: Hero): HeroView {
        const snapshot = hero.toSnapshot();
        const view = {
            id: snapshot.heroId,
            name: snapshot.name,
            power: snapshot.power,
            alive: snapshot.alive,
            createdAt: snapshot.createdAt.toISOString(),
        };
        return view;
    }
}
