# Eventos de Domínio no Next (PoC)

Objetivo: padronizar como publicar e tratar eventos de domínio no backend do Next.js sem broker externo (RabbitMQ, etc.) nesta PoC, preservando invariantes e permitindo evolução futura (Outbox/Worker) sem reescrever o domínio.

## Decisão
- **In-process event bus**: publicar eventos após commit da transação, num singleton de processo.
- **Sem broker externo** na PoC. Para tarefas longas, persistir “jobs” e processar via rota/cron, não bloquear requisições.

## Fluxo
1. Use Case executa mudanças em Aggregates dentro de transação (Prisma).
2. Aggregates acumulam `DomainEvents` ao alterar estado.
3. Após `commit`, a Unit of Work coleta e publica todos os eventos no `EventBus`.
4. Handlers (camada `application`) processam efeitos colaterais curtos e invalidam caches.

```
Use Case → Repo (Tx) → Commit → EventBus.publishAll(events) → Handlers
```

## Contratos
```ts
// src/domain/events/domain-event.ts
export interface DomainEvent {
  readonly name: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
}

// Padrão para Aggregates: acumular eventos e expor pullEvents()
export interface PublishesDomainEvents {
  pullEvents(): DomainEvent[]; // esvazia e retorna
}
```

## Event Bus (infra)
```ts
// src/infrastructure/events/event-bus.ts
type Handler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export class EventBus {
  private handlers = new Map<string, Handler[]>();
  subscribe<T extends DomainEvent>(name: string, handler: Handler<T>) {
    const list = this.handlers.get(name) ?? [];
    list.push(handler as Handler);
    this.handlers.set(name, list);
  }
  async publishAll(events: DomainEvent[]) {
    for (const e of events) {
      const hs = this.handlers.get(e.name) ?? [];
      for (const h of hs) await h(e);
    }
  }
}

// Singleton de processo (Node runtime; não compartilhado entre instâncias)
export const eventBus = globalThis.__eventBus ?? (globalThis.__eventBus = new EventBus());
declare global { var __eventBus: EventBus | undefined }
```

## Unit of Work (publicação pós-commit)
```ts
// src/infrastructure/db/unit-of-work.ts
import { prisma } from '@/infrastructure/db/prisma';
import { eventBus } from '@/infrastructure/events/event-bus';

export async function inTransaction<T>(work: () => Promise<{ result: T; events: any[] }>): Promise<T> {
  return prisma.$transaction(async () => {
    const { result, events } = await work();
    // commit implícito ao sair do callback; publicar depois
    await eventBus.publishAll(events);
    return result;
  });
}
```

Use Cases devem coletar eventos dos aggregates salvos e retorná-los para `inTransaction` publicar.

## Handlers (application)
```ts
// src/application/events/handlers/member-admitted.handler.ts
import { eventBus } from '@/infrastructure/events/event-bus';

type MemberAdmitted = { name: 'MemberAdmitted'; aggregateId: string; occurredAt: Date; payload: { memberId: string } };

export function registerMemberAdmittedHandler() {
  eventBus.subscribe<MemberAdmitted>('MemberAdmitted', async (e) => {
    // efeitos curtos: invalidar cache, disparar e-mail curto, logar auditoria
    // revalidateTag(NextKeys.members());
  });
}
```

Registro dos handlers acontece na inicialização do app (p.ex. dentro do container/loader da infra) em ambiente server.

## Assíncrono e limites
- Preferir processamento curto e síncrono após commit para previsibilidade.
- Para tarefas longas: persistir em tabela `Job` e processar por rota/cron (p.ex. Vercel Cron). Evitar `setTimeout` longos em serverless.
- Em ambientes com múltiplas instâncias, o singleton é por instância. Como não há broker, eventos não cruzam instâncias (aceitável para PoC). Evolução: Outbox + worker dedicado.

## Localização
- Tipos de eventos (interfaces) no domínio quando fizer sentido sem dependências de infraestrutura.
- Bus/registro e handlers em `infrastructure` (bus) e `application` (regras de reação).
- Publicação disparada pela Unit of Work depois do commit.

