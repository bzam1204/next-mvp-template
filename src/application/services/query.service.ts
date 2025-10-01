import type HeroQuery from "@/application/queries/hero-query/hero.query";

export default interface QueryService {
    readonly heroQuery: HeroQuery;
}
