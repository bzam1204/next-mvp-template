# Padrão de Camadas (UI → Controller → Aplicação)

## Visão Geral

Fluxo acordado para a PoC: Hook (infra) → Server Action (Controller) → Porta da Aplicação (Use Case ou Query). Sem camada de Gateway HTTP interno. As Actions fazem o papel de controller/adapter, resolvendo dependências via Container e retornando DTOs para a UI.

## Arquitetura

### Fluxo de Dados

```
Cliente (Hook infra) → Server Action (Controller) → Container.resolve(UseCase|Query) → Domínio/Infra → DTO/View
```

1. Hooks (infra): usam @tanstack/react-query diretamente para chamar Server Actions; cuidam de cache, loading, invalidações (somente React Query).
2. Server Actions (Controllers): 'use server', validam input mínimo, resolvem portas (Use Case/Query) via Container e mapeiam resposta (DTO/View).
3. Aplicação (ports): Use Cases orquestram domínio (Aggregates, Repositórios, UoW, EventBus); Queries produzem Views otimizadas sem efeitos colaterais.

### Responsabilidades

- Hooks (infra): estado da UI, useQuery/useMutation, invalidação pós-mutação; nunca fazem fetch direto.
- Server Actions: controller/adapter; validação mínima; DI via Container; retorno consistente em DTO/View.
- Use Cases: transações, invariantes via Aggregates; entidades emitem eventos dentro dos métodos; publicação apenas pós-commit (UoW/EventBus).
- Queries: leitura projetada (Views), sem side effects.

## Exemplos

### Hook Padrão (infra)

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/infrastructure/cache/query-keys';

import { findMembersAction } from '@/infrastructure/actions/members/find-members.action';

export function useMembers(search: string) {
  return useQuery({
    queryKey: QueryKeys.members.search(search),
    queryFn: () => findMembersAction({ search }),
    enabled: search.length > 0,
  });
}
```

### Server Action Padrão (Controller)

```typescript
'use server';
import { container } from '@/infrastructure/container';

export async function admitMemberAction(input: { name: string }) {
  // validação mínima de input
  if (!input?.name || input.name.trim().length < 3) throw new Error('Invalid name');

  const useCase = container.resolve('AdmitMember');
  const result = await useCase.execute(input);

  return result; // DTO para a UI
}
```

## Cache e Invalidação

### QueryKeys (Hooks)

Centralize chaves para consistência e invalidação previsível.

```typescript
import { QueryKeys } from '@/infrastructure/cache/query-keys';
// Query
queryKey: QueryKeys.members.search(search)
// Invalidação após mutação
queryClient.invalidateQueries({ queryKey: QueryKeys.members.root() });
```

 

## Regras

### ❌ Proibido nos Hooks (infra)

- fetch direto ao backend
- Acesso a segredos/tokens

### ✅ Permitido/Esperado

- useQuery/useMutation chamando Server Actions (controllers)
- Uso de QueryKeys para cache e invalidar pós-mutação
- Transformações de dados apenas para apresentação

## Estrutura de Arquivos (camadas)

```
src/
├── infrastructure/
│   ├── hooks/                      # Hooks (React Query direto)
│   ├── cache/
│   │   ├── query-keys.ts           # TanStack Query keys
│   ├── actions/                    # Server Actions (controllers)
│   ├── repositories/               # Prisma repositories (write)
│   ├── queries/                    # Prisma-based read models
│   ├── events/                     # EventBus
│   ├── uow/                        # Unit of Work (Prisma tx)
│   └── container.ts                # DI container
├── application/
│   ├── use-cases/                  # Commands
│   ├── queries/                    # Query interfaces
│   └── dtos/                       # DTOs & Views
├── domain/                         # Aggregates, VOs, exceptions
└── app/
    └── (rotas e páginas)
```

## Checklist de Desenvolvimento

### Hooks (infra)

- [ ] Usa apenas Server Actions; nunca fetch
- [ ] Usa QueryKeys oficiais
- [ ] Mutações invalidam chaves relacionadas

### Server Actions (Controllers)

- [ ] Marca 'use server'
- [ ] Valida input mínimo; checagem simples de papéis quando necessário
- [ ] Resolve Use Case/Query via Container


### Aplicação

- [ ] Use Cases com UoW; entidades emitem eventos em métodos
- [ ] Publicação de eventos apenas pós-commit (EventBus)
- [ ] Queries retornam Views (sem efeitos colaterais)

### Pull Requests

- [ ] Ausência de fetch em infrastructure/hooks
- [ ] Invalidações QueryKeys consistentes (React Query)
- [ ] Testes presentes em domain/application (*.spec.ts ao lado)

## Comandos de Verificação

```bash
# Verificar fetch em hooks
rg -n "fetch\(" src/infrastructure/hooks/

# Verificar Actions com 'use server'
rg -n "'use server'" src/infrastructure/actions/
```
