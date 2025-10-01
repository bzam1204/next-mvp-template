import type HeroQuery from "@/application/queries/hero-query/hero.query";
import type QueryService from "@/application/services/query.service";

export class DefaultQueryService implements QueryService {
    constructor(public readonly heroQuery: HeroQuery) {}
}

export default DefaultQueryService;
