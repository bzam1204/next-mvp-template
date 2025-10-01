'use server';

import type { LoggedEvent } from "@/infrastructure/events/in-memory-event-log";
import { resolve } from "@/infrastructure/container";
import { ServiceTokens } from "@/shared/constants/service-constants";
import { InMemoryEventLog } from "@/infrastructure/events/in-memory-event-log";

const eventLog = resolve<InMemoryEventLog>(ServiceTokens.EventLog);

export async function listHeroEventsAction(limit = 20): Promise<LoggedEvent[]> {
    const events = eventLog.list(limit);
    return events.filter((event) => event.name.startsWith("Hero"));
}
