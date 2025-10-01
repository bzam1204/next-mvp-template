import type DomainEvent from "@/domain/events/domain.event";

export interface UnitOfWork {
    runInTransaction<T>(work: Work<T>): Promise<T>;
}

export type Work<T> = () => Promise<{ result: T; events: DomainEvent[] }>;
