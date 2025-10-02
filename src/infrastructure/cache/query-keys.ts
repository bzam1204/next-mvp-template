export interface MemberSearchKeyParams {
    page: number;
    pageSize: number;
    name?: string;
    profile?: string;
    visibility?: "active" | "archived" | "all";
}

export const QueryKeys = {
    members: {
        root: () => ["members"] as const,
        search: (params: MemberSearchKeyParams) =>
            ["members", "search", params] as const,
        byId: (memberId: string) => ["members", "by-id", memberId] as const,
    },
    heroes: {
        all: () => ["heroes"] as const,
        byId: (heroId: string) => ["heroes", heroId] as const,
    },
    heroEvents: {
        recent: () => ["hero-events", "recent"] as const,
    },
} as const;

export type QueryKeyOf<T extends (...args: never[]) => readonly unknown[]> = ReturnType<T>;
