export const QueryKeys = {
    heroes: {
        all: () => ["heroes"] as const,
        byId: (heroId: string) => ["heroes", heroId] as const,
    },
    heroEvents: {
        recent: () => ["hero-events", "recent"] as const,
    },
} as const;

export type QueryKeyOf<T extends (...args: never[]) => readonly unknown[]> = ReturnType<T>;
