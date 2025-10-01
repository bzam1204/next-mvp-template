import type DomainEvent from "@/domain/events/domain.event";
import type EventBusInterface, { EventHandler } from "@/domain/services/event-bus";

const WILDCARD = "*";

export default class EventBus implements EventBusInterface {
    private readonly handlers = new Map<string, Set<EventHandler>>();

    public subscribe<T extends DomainEvent = DomainEvent>(eventName: string, handler: EventHandler<T>): () => void {
        const subscribers = this.handlers.get(eventName) ?? new Set<EventHandler>();
        subscribers.add(handler as EventHandler);
        this.handlers.set(eventName, subscribers);
        const callback = () => {
            subscribers.delete(handler as EventHandler);
            if (subscribers.size === 0) {
                this.handlers.delete(eventName);
            }
        };
        return callback;
    }

    public subscribeToAll(handler: EventHandler): () => void {
        const callback = this.subscribe(WILDCARD, handler);
        return callback;
    }

    public async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            const listeners = [
                ...(this.handlers.get(event.name) ?? new Set<EventHandler>()),
                ...(this.handlers.get(WILDCARD) ?? new Set<EventHandler>()),
            ];
            for (const listener of listeners) {
                await listener(event);
            }
        }
    }
}
