import type DomainEvent from "@/domain/events/domain.event";

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export default interface EventBus {
    subscribe<T extends DomainEvent = DomainEvent>(eventName: string, handler: EventHandler<T>): () => void;
    subscribeToAll(handler: EventHandler): () => void;
    publish(events: DomainEvent[]): Promise<void>;
}

