'use client';

import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/infrastructure/cache/query-keys";
import { listHeroEventsAction } from "@/infrastructure/actions/hero/list-hero-events.action";
import type { LoggedEvent } from "@/infrastructure/events/in-memory-event-log";

export function useHeroEvents(limit = 10) {
    return useQuery<LoggedEvent[]>({
        queryKey: [...QueryKeys.heroEvents.recent(), limit],
        queryFn: () => listHeroEventsAction(limit),
        refetchInterval: 4000,
        refetchOnWindowFocus: false,
    });
}
