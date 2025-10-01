import { AsyncLocalStorage } from "async_hooks";
import type { Prisma, PrismaClient } from "@prisma/client";

import type { UnitOfWork, Work } from "@/domain/services/unit-of-work";
import type DomainEvent from "@/domain/events/domain.event";

import type EventBus from "@/domain/services/event-bus";

export default class PrismaUnitOfWork implements UnitOfWork {
    private readonly storage = new AsyncLocalStorage<Prisma.TransactionClient>();

    constructor(
        private readonly prisma: PrismaClient,
        private readonly eventBus: EventBus,
    ) {}

    public getClient(): PrismaClient | Prisma.TransactionClient {
        const client = this.storage.getStore() ?? this.prisma;
        return client;
    }

    public async runInTransaction<T>(work: Work<T>): Promise<T> {
        let collectedEvents: DomainEvent[] = [];
        const prismaTransactionOutput = await this.prisma.$transaction(async (transaction) => {
            const storageRunOutput = this.storage.run(transaction, async () => {
                const { result, events } = await work();
                collectedEvents = events ?? [];
                return result;
            });
            return storageRunOutput;
        });
        if (collectedEvents.length > 0) await this.eventBus.publish(collectedEvents);
        return prismaTransactionOutput;
    }
}
