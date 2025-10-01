# Bounded Contexts e Dependências (IPTJ – v0.1)

Este documento consolida os bounded contexts da instituição e seus relacionamentos de dependência, com base em `linguagem-ubiqua.md`, `architecture/bounded-contexts.md`, `dp.md`, `user.md` e na planilha "igreja (1).xlsx".

## Contextos e Propósitos
- Rol de Membros (Core): perfil do membro + eventos (admissões, baixas, falecimento, profissão de fé, batismo infantil, ordenação).
- Atos Pastorais & Atuação Conciliar (Supporting): registro de atos (ceias, batismos, funerais, etc.) e reuniões conciliares.
- Unidades & Estrutura (Supporting): igreja (CNPJ, Presbitério, Sínodo), congregações, departamentos e liderança formal.
- Estatísticas & Relatórios (Supporting – Read Model): projeções por período, saldos, contagens e relatórios compatíveis com IPB.
- Financeiro (Supporting): lançamentos, rubricas (Côngruas/Sustento Pastoral, Verba Presbiterial, Dízimo ao SC), patrimônio e causas locais.
- Integração IPB (Generic – ACL/Export): exporta XLSX/PDF oficiais, mapeando para o vocabulário IPB.
- IAM – Identidade & Acesso (Generic): usuários, papéis e políticas de autorização.

## Diagrama (Mermaid)

```mermaid
flowchart TB

  subgraph Core
    RM[Rol de Membros]
  end

  subgraph Supporting
    UE[Unidades & Estrutura]
    AC[Atos Pastorais & Conciliar]
    FIN[Financeiro]
    STATS[Estatísticas & Relatórios (Read Model)]
  end

  subgraph Generic
    IAM[IAM]
    IPB[Integração IPB (ACL/Export)]
  end

  %% Policies upstream para todos
  IAM -->|Policies| RM
  IAM -->|Policies| UE
  IAM -->|Policies| AC
  IAM -->|Policies| FIN
  IAM -->|Policies| STATS
  IAM -->|Policies| IPB

  %% Published Language (upstream → downstream)
  UE -->|Published Language| RM
  UE -->|Published Language| AC
  UE -->|Published Language| STATS

  RM -->|Published Language| STATS
  AC -->|Published Language| STATS
  FIN -->|Published Language| STATS

  %% Export IPB com ACL (conversão de vocabulário)
  STATS -->|DTOs/Snapshots| IPB
  STATS -.->|ACL (conversão)| IPB
```

## Mapa de Contextos (ASCII)
```
                  (policies)
  IAM ─────────────────────────────────────────────────────────▶ [Todos]

  [Unidades & Estrutura] ──published language──▶ [Rol de Membros]
            │                                        │
            └────────published language──────────────┤
                                                     ▼
  [Atos & Conciliar] ─────────published language──▶ [Estatísticas & Relatórios]
                                                     ▲
  [Financeiro] ──────────────published language──────┘
                                                     │
                                                     ▼
                           [Integração IPB] ◀── ACL (converte vocabulário)
```
Legenda: setas indicam direção de dependência (downstream consome upstream). "published language" = downstream conformista, a menos que indicado ACL.

## Dependências por Contexto
- Rol de Membros
  - Consome: Unidades & Estrutura (igreja/congregação); IAM (policies).
  - Publica para: Estatísticas & Relatórios; Integração IPB (indiretamente via Stats).
  - Tipo: Published Language para Stats; referências de identidade de Unidades.

- Atos Pastorais & Atuação Conciliar
  - Consome: Unidades & Estrutura; (opcional) Rol de Membros para referenciar pessoas.
  - Publica para: Estatísticas & Relatórios.
  - Tipo: Published Language para Stats.

- Unidades & Estrutura
  - Independente (fonte de verdade para instituições); Publica para: Rol de Membros, Atos, Stats.
  - Tipo: Published Language (ids/nomes/códigos).

- Estatísticas & Relatórios (Read Model)
  - Consome: Rol de Membros; Atos & Conciliar; Unidades & Estrutura; Financeiro.
  - Publica para: Integração IPB (snapshots/DTOs estáveis).
  - Tipo: Conformist/Pub. Language; sem escrita em domínios upstream.

- Financeiro
  - (Opcional) Consome: Unidades & Estrutura (vínculo de unidade); IAM.
  - Publica para: Estatísticas & Relatórios.
  - Tipo: Published Language para Stats.

- Integração IPB (ACL/Export)
  - Consome: Estatísticas & Relatórios (DTOs/snapshots); produz arquivos oficiais (XLSX/PDF).
  - Tipo: ACL contra templates IPB (evita vazar detalhes de layout para o domínio).

- IAM – Identidade & Acesso
  - Upstream de todos (policies/guards). Sem dependências de domínio.

## Eventos Publicados (exemplos)
- Rol de Membros: MembroAdmitido, MembroRestaurado, MembroTransferido, MembroExcluido, MembroFalecido, ProfissaoDeFeRegistrada, BatismoInfantilRegistrado, OrdenacaoRegistrada.
- Atos & Conciliar: AtoPastoralRegistrado, ReuniaoConciliarRegistrada.
- Financeiro: LancamentoRegistrado, PeriodoFinanceiroFechado.
- Estatísticas & Relatórios: snapshots/relatórios consolidados (read models; não são eventos de domínio canônicos).

## Notas de Implementação
- CQRS: Estatísticas & Relatórios é exclusivamente leitura; gravações ocorrem nos contextos de origem.
- Unit of Work: operações multi‑agregado devem ser atômicas.
- Export: paridade estrutural > 99% com a planilha IPB na Fase 1; Integração IPB faz a conversão (ACL).

## Pendências
- Definir semântica de “Rol Separado”.
- Escopo de atas/documentos em Atos & Conciliar.
- Estratégia do Financeiro (integração externa vs write model próprio) no MVP.
