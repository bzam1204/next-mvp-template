# Arquitetura – Diretrizes Gerais (PoC IPB)

Objetivo: orientar rapidamente como pensar, organizar e implementar a PoC, consolidando decisões e apontando para os padrões específicos já definidos. Priorize simplicidade, baixo custo e extração futura para NestJS sem reescrever o domínio.

## Princípios

- **Next.js only (App Router)**: um runtime, deploy simples. Server Actions como controladores. Migrável para NestJS quando necessário (mesmo `domain`/`application`).
- **DDD primeiro**: Aggregates com invariantes, repositórios e Unit of Work. Expor intenção por métodos; nada de mutação pública.
- **CQRS explícito**: Queries retornam Views otimizadas; Commands alteram estado via Aggregates+Repositórios. Não misturar leitura com escrita.
- **Borda do sistema (Ports & Adapters)**: Hook → Server Action (Controller) → Porta da Aplicação (Use Case ou Query). Sem camada de Gateway HTTP interno nesta PoC.
- **Injeção por Container**: Server Actions resolvem Use Cases/Queries via Container (DI) desacoplado da infra.
- **Persistência (Postgres)**: Prisma com Postgres (Neon recomendado). Apenas Postgres em todos os ambientes. Transações/Unit of Work garantem atomicidade.
- **Eventos de Domínio**: eventos são emitidos nos métodos das entidades/aggregates durante a mudança de estado; a publicação ocorre somente após commit (UoW). Se o commit falhar, nenhum evento é publicado.
- **Validação declarativa**: regras mínimas obrigatórias (Erros) + avisos (Warnings). Vocabulário IPB controlado (enums).
- **Segurança (PoC)**: mínimo viável — papéis, login e senha, respostas por DTO. Sem token/sessão por enquanto.

## Onde cada coisa vive

- `src/domain`: entidades/aggregates, value objects, exceptions, serviços de domínio.
- `src/application`: use cases (commands) e queries (read models), DTOs de entrada/saída e views de leitura, serviços orquestradores (p.ex. `QueryService`).
- `src/infrastructure`: repositórios (Prisma), queries (Prisma p/ projeções), hooks (React Query direto), auth (simples), cache, event-bus, unit-of-work, container (DI).
- `src/app`: rotas Next (UI) e páginas.
- `src/infrastructure/actions`: Server Actions (controllers).
- `src/shared`: mappers, constantes de tokens, utilitários.
- `prisma/`: schema e migrações (Postgres).

## Decidir rápido (heurísticas)

- É leitura projetada? → Query em `application/queries/*`, impl. em `infrastructure/queries/*`, retornar View.
- É alteração de estado? → Use Case em `application/use-cases/*` chamando Repositório de Aggregate.
- Eventos de domínio? → A entidade emite eventos dentro de seus métodos; a publicação ocorre apenas pós-commit pela UoW (não publicar no use case).
- Borda (Controller): Server Action recebe input, valida, resolve porta (Use Case/Query) via Container e mapeia a resposta para o chamador.
- Operação de UI? → Hook (em `infrastructure/hooks`) chama Action server; não abstrair React Query.

## Fluxos padrão

- Leitura: Hook (infra) → Server Action (Controller) → Container.resolve(Query/`QueryService`) → View DTO.
- Escrita: Hook (infra) → Server Action (Controller) → Container.resolve(Use Case) → Repositório (Tx) → entidades emitem eventos → commit → UoW publica via EventBus → invalidações de cache (React Query).

## Checklists rápidos

- Hook (infra): usar React Query diretamente; sem abstração; invalidações padronizadas.
- Server Action (Controller): `'use server'`; valida input; checagem simples de papéis (quando necessário); resolve porta via Container; mapeia output.
- Aggregate: invariantes em toda transição; eventos emitidos em métodos da entidade; sem set público.
- Repositório/Query: nomes completos; nada de abreviação; transação quando necessário.

## Testes

- Escopo: apenas `domain` e `application`.
- Localização: arquivos de teste acompanham os de implementação (`*.spec.ts` ao lado), estilo NestJS.
- Sem E2E nesta PoC.

## Ponteiros

- Layers: `architecture/layers.std.md`
- CQRS: `architecture/cqrs.std.md`
- DDD Aggregate: `architecture/ddd-aggregate-root-standardization.md`
- Eventos de Domínio (Next): `architecture/domain-events-next.md`
- DTOs e Mapeamento: `architecture/dto-standards.md`
