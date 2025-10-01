import type EventBus from "@/domain/services/event-bus";
import type DomainEvent from "@/domain/events/domain.event";

export interface LoggedEvent {
    id: string;
    name: string;
    payload: unknown;
    occurredAt: string;
    aggregateId?: string;
}

export class InMemoryEventLog {
    private events: LoggedEvent[] = [];
    private unsubscribe?: () => void;

    constructor(private readonly maxSize = 100, bus?: EventBus) {
        if (bus) this.attach(bus);
    }

    public append(event: DomainEvent): void {
        const plainPayload = JSON.parse(JSON.stringify(event.payload ?? {}));
        const loggedEvent: LoggedEvent = {
            id: event.id,
            name: event.name,
            occurredAt: event.occurredAt.toISOString(),
            aggregateId: this.extractAggregateId(plainPayload),
            payload: plainPayload,
        };
        this.events = [loggedEvent, ...this.events].slice(0, this.maxSize);
    }

    public list(limit = 20): LoggedEvent[] {
        const events = this.events.slice(0, limit);
        return events;
    }

    public clear(): void {
        this.events = [];
    }

    public attach(bus: EventBus): void {
        this.unsubscribe?.();
        this.unsubscribe = bus.subscribeToAll((event) => {
            this.append(event);
        });
    }

    public detach(): void {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    private extractAggregateId(payload: unknown): string | undefined {
        if (payload && typeof payload === "object" && "heroId" in (payload as Record<string, unknown>)) {
            const heroId = (payload as Record<string, unknown>).heroId;
            const aggregateId = typeof heroId === "string" ? heroId : undefined;
            return aggregateId;
        }
        return undefined;
    }
}
