export const QueryTokens = {
    QueryService: Symbol("QueryService"),
    HeroQuery: Symbol("HeroQuery"),
    SearchMembersQuery: Symbol("SearchMembersQuery"),
    GetMemberByIdQuery: Symbol("GetMemberByIdQuery"),
} as const;

export type QueryTokenKeys = keyof typeof QueryTokens;
export type QueryToken = (typeof QueryTokens)[QueryTokenKeys];
