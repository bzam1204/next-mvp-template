# DTOs e Mapeamento – Padrão

Decisão: remover o diretório genérico `contracts/` e adotar DTOs por camada. Mantém fronteiras claras e facilita extração para outros processos (NestJS) sem confusão conceitual.

## Onde ficam os DTOs
- `src/application/dtos/`: inputs/outputs de Use Cases e Views de Queries (read models).
- `src/infrastructure/dtos/`: formas de transporte externas (APIs de terceiros) e contratos de HTTP quando necessário.
- `src/domain`: não define DTOs (apenas Entities/VO/Exceptions). Mapeamentos acontecem fora do domínio.

## Mapeamento
- `src/shared/mappers/*`: funções puras para mapear Domain ⇄ DTO (application) e Gateway ⇄ DTO (infra).
- UI consome apenas View DTOs retornados por Queries (nunca Entities do domínio).

## Convenções
- Nomes completos e descritivos (sem abreviações). `PascalCase` para tipos/classe; `kebab-case` para arquivos.
- Evitar flags booleanas em DTOs; prefira campos explícitos.

## Migração a partir de `contracts/`
1) Mover DTOs de API externa para `src/infrastructure/dtos/`.
2) Mover Views/inputs de casos de uso para `src/application/dtos/`.
3) Ajustar imports (aliases `@/application/dtos`, `@/infrastructure/dtos`).
4) Atualizar referências em docs e exemplos.

