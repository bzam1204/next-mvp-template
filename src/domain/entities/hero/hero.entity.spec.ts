import { describe, expect, it } from "vitest";

import { Hero } from "./hero.entity";

const HERO_ID = "0d3b2b5c-17f0-4d35-8888-111111111111";

describe("Hero", () => {
    it("creates a hero with default values and emits HeroCreated", () => {
        const hero = Hero.create({ heroId: HERO_ID, name: "Nova" });

        expect(hero.name).toBe("Nova");
        expect(hero.power).toBe(1);
        expect(hero.alive).toBe(true);

        const events = hero.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].name).toBe("HeroCreated");
    });

    it("renames a hero and emits HeroRenamed", () => {
        const hero = Hero.create({ heroId: HERO_ID, name: "Nova" });
        hero.pullEvents();

        hero.rename("Solaria");
        const events = hero.pullEvents();

        expect(hero.name).toBe("Solaria");
        expect(events[0]?.name).toBe("HeroRenamed");
    });

    it("does not emit event when renaming with the same name", () => {
        const hero = Hero.create({ heroId: HERO_ID, name: "Nova" });
        hero.pullEvents();

        hero.rename("Nova");
        expect(hero.pullEvents()).toHaveLength(0);
    });

    it("level up increases power and emits HeroLeveledUp", () => {
        const hero = Hero.create({ heroId: HERO_ID, name: "Nova" });
        hero.pullEvents();

        hero.levelUp();
        const events = hero.pullEvents();

        expect(hero.power).toBe(2);
        expect(events[0]?.name).toBe("HeroLeveledUp");
    });

    it("rejects invalid names", () => {
        expect(() => Hero.create({ heroId: HERO_ID, name: "" })).toThrowError();
    });
});
