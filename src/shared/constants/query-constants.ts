export const QueryTokens = {
    QueryService: Symbol("QueryService"),
    HeroQuery: Symbol("HeroQuery"),
} as const;

export type QueryTokenKeys = keyof typeof QueryTokens;
export type QueryToken = (typeof QueryTokens)[QueryTokenKeys];
