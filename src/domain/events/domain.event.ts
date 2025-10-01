import { randomUUID } from "crypto";

export interface DomainEventInit<TPayload> {
    payload: TPayload;
    occurredAt?: Date;
    id?: string;
}

export default abstract class DomainEvent<TPayload = unknown> {
    public readonly id: string;
    public readonly occurredAt: Date;
    public readonly payload: TPayload;

    protected constructor(init: DomainEventInit<TPayload>) {
        this.payload = init.payload;
        this.occurredAt = init.occurredAt ?? new Date();
        this.id = init.id ?? randomUUID();
    }

    public abstract get name(): string;
}
