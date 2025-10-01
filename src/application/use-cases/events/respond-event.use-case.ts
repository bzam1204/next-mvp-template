import type DomainEvent from "@/domain/events/domain.event";
import type EventBus from "@/domain/services/event-bus";

type Listener<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export default class RespondEvent {
    constructor(private readonly bus: EventBus) {}

    public execute<T extends DomainEvent = DomainEvent>(eventName: string, listener: Listener<T>): () => void {
        return this.bus.subscribe<T>(eventName, listener);
    }

    public executeAll(listener: Listener): () => void {
        return this.bus.subscribeToAll(listener);
    }
}

