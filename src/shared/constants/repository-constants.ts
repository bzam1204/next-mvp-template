export const RepositoryTokens = {
    HeroRepository: Symbol("HeroRepository"),
    MemberRepository: Symbol("MemberRepository"),
} as const;

export type RepositoryTokenKeys = keyof typeof RepositoryTokens;
export type RepositoryToken = (typeof RepositoryTokens)[RepositoryTokenKeys];
