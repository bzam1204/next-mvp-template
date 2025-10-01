# Linguagem Ubíqua da IPTJ (v0.1)

Documento vivo que define termos, significados e sinônimos usados por todos (pastoral, secretaria, tesouraria e TI), alinhado aos artefatos atuais:
- Fonte: `igreja (1).xlsx` (abas Ministro; Conselho ou Mesa; Congregação; Cadastro & Estatística)
- Fonte: `user.md` (dados obrigatórios para admissão de comungantes, CI/IPB art.16)
- Complemento: `dp.md` (quebra de domínio, fases e validações)

Objetivo: reduzir ambiguidades, padronizar regras e facilitar relatórios e integrações.

## Princípios
- Termos devem existir na prática da IPTJ e na planilha oficial IPB.
- Um termo = um significado claro; sinônimos mapeados explicitamente.
- Separar “perfil” (dados estáveis) de “eventos” (histórico temporal).
- Usar recortes por data de corte para estatísticas anuais.

## Núcleo: Pessoas e Rol
- Membro (Pessoa)
  - Tipo: Entidade.
  - Definição: pessoa registrada no rol da IPTJ, com dados civis e eclesiásticos.
  - Sinônimos/planilha: “Nº de Membros” (indicadores); campos pessoais em “Ministro” e “Cadastro & Estatística”.

- Comungante
  - Tipo: Classificação de Membro.
  - Definição: membro com direito à Ceia (comunhão plena) no período de referência.
  - Sinônimos/planilha: “COMUNGANTES”.

- Não‑Comungante
  - Tipo: Classificação de Membro.
  - Definição: membro arrolado sem comunhão plena (no período de referência).
  - Sinônimos/planilha: “NÃO‑COMUNGANTES”.

- Perfil do Membro
  - Tipo: Agregado de dados estáveis.
  - Definição: dados civis e de identificação (ex.: Nome, RG, CPF, Filiação, Endereço, E‑mail; Estado Civil; Profissão; Alfabetização; Procedência religiosa).
  - Fontes: `user.md`; planilha (rótulos “Nome”, “RG”, “CPF”, “Endereço”, “Estado Civil”, “Cônjuge”, “Filiação”, “E‑mail”, etc.).

- Evento de Membro
  - Tipo: Evento temporal.
  - Definição: ocorrência que altera estado/estatística (ex.: admissão, baixa, ordenação, batismo infantil, profissão de fé).
  - Uso: permite responder “quem era comungante em 31/12/ANO?”

- Admissão
  - Tipo: Evento de Membro.
  - Definição: entrada ou regularização do membro no rol.
  - Tipos (planilha): “Profissão de Fé”; “Profissão de Fé e Batismo”; “Transferência”; “Restauração”.
  - Campos mínimos (comungantes) por `user.md`: data e lugar de nascimento, sexo, procedência religiosa, estado civil, profissão, endereço completo, alfabetização, batizado na infância (sim/não); data/local/modo de recepção (CI/IPB art.16), nome do celebrante.

- Baixa
  - Tipo: Evento de Membro.
  - Definição: saída do rol ou encerramento do vínculo estatístico.
  - Tipos (planilha): “Exclusão”; “Falecimento”.

- Ordenação
  - Tipo: Evento de Membro.
  - Definição: ato eclesiástico de investidura em ofício (ex.: presbítero, diácono, pastor), quando aplicável.
  - Sinônimos/planilha: “Ordenação”.

- Batismo Infantil
  - Tipo: Evento de Membro.
  - Definição: ato sacramental aplicado a crianças; pode impactar estatísticas específicas.
  - Sinônimos/planilha: “Batismos Infantis”.

- Profissão de Fé
  - Tipo: Evento de Membro (e também tipo de Admissão).
  - Definição: pública profissão de fé; quando combinada a batismo: “Profissão de Fé e Batismo”.

- Data de Corte (Estatística)
  - Tipo: Regra de apuração.
  - Definição: data limite para consolidar saldos e totais do ano (tipicamente 31/12).

## Unidades e Governo
- Igreja (Sede)
  - Tipo: Unidade Eclesiástica.
  - Definição: pessoa jurídica principal (CNPJ), congregações vinculadas e departamentos.
  - Campos: “Nome (Igreja/Congregação)”, “CNPJ”, “Presbitério”, “Sínodo”.

- Congregação
  - Tipo: Unidade Eclesiástica vinculada.
  - Definição: núcleo congregacional sob a Igreja sede.
  - Sinônimos/planilha: aba “Congregação”; “Congregações da Igreja”.

- Conselho (ou Mesa)
  - Tipo: Órgão de governo local.
  - Definição: colegiado que rege a Igreja local (pastor(es) e presbíteros).
  - Sinônimos/planilha: aba “Conselho ou Mesa”.

- Presbitério | Sínodo | Supremo Concílio
  - Tipo: Órgãos conciliares.
  - Definição: esferas regionais e nacional de governo da IPB.
  - Planilha: “Reuniões do Presbitério/Sínodo/SC”.

- Jurisdição
  - Tipo: Atributo institucional.
  - Definição: área/competência eclesiástica informada na planilha (“Jurisdição”).

## Estrutura e Liderança
- Ofícios e Funções
  - Pastores, Licenciados, Presbíteros, Diáconos, Evangelistas, Missionários, Candidatos.
  - Planilha: contagens e liderança formal.

- Departamentos Internos
  - UCP, UPA, UMP, SAF, UPH, Outras.
  - Planilha: “DEPARTAMENTOS INTERNOS”, “Nº Deptos.”

## Atos, Atuação e Reuniões
- Atos Pastorais
  - Santas Ceias; Batismos; Batismos Infantis; Profissões de Fé; Funerais; Aconselhamentos; Entrevistas; Estudos Bíblicos; Pregações; Palestras/Preleções; Trabalhos de Evangelização; Mensagens (Rádio/TV); Artigos (jornais/boletins/revistas).

- Atuação Conciliar
  - Reuniões do Conselho; do Presbitério; do Sínodo; do Supremo Concílio.

- Pontos de Pregação
  - Núcleos de proclamação vinculados à Igreja/Trabalho.

## Estatísticas e Contagens
- Saldos e Totais
  - “Saldo ‑ Ano anterior”; “Saldo ‑ Ano seguinte”; “TOTAL”; “Grande Total”.
  - Reconciliação: SaldoAnterior + Admissões − Baixas = SaldoSeguinte (por categoria: comungantes/não‑comungantes; M/F quando aplicável).

- Admissões (contagens)
  - Profissão de Fé; Profissão de Fé e Batismo; Transferência; Restauração.

- Baixas (contagens)
  - Exclusão; Falecimento.

- Demografia e Metrificações
  - “MASC.”, “FEM.”; “Nº de Membros”.

## Financeiro (Rubricas e Saldos)
- Receitas e Despesas
  - “Total da Receita Anual”; “Total da Despesa Anual”.

- Rubricas (exemplos citados na planilha)
  - Côngruas | Sustento Pastoral; Verba Presbiterial; Dízimo ao Supremo Concílio.

- Patrimônio e Causas
  - “Patrimônio”; “Causas Locais”.

## Identificadores e Dados Obrigatórios
- Identificadores Pessoais
  - “RG”, “CPF” (preferencial para unicidade); fallback: Nome + Data de Nascimento quando CPF ausente.

- Identificação Institucional
  - “CNPJ” (Igreja/Unidade).

- Dados Obrigatórios para Admissão de Comungantes (conforme `user.md`)
  - Data e lugar de nascimento; Sexo; Procedência religiosa; Estado civil; Profissão; Endereço completo; Alfabetização (sabe ler/escrever); Batizado na infância (sim/não); Data, local e modo de recepção (CI/IPB art.16 e alíneas); Nome do celebrante.

## Processos e Operações
- Onboarding / Admissão
  - Coleta/validação dos dados obrigatórios; classificação de tipo (PF, PFB, Transferência, Restauração); registro do evento e documentos.

- Manutenção do Rol
  - Alterações de status; transferências (entrada/saída); restaurações; exclusões; registros de falecimento.

- Fechamento e Reporte
  - Consolidação por período (data de corte); geração de relatórios e exportações com paridade à planilha.

## Regras e Validações (conceitos)
- Erro x Aviso
  - Erro: impede cadastro/fechamento (ex.: batismo antes do nascimento).
  - Aviso: requer revisão (ex.: idade atípica para cargo).

- Paridade de Exportação (XLSX)
  - Export oficial deve espelhar colunas/abas da planilha (>99% de paridade estrutural na Fase 1).

- Motor de Validação (XLSX)
  - Importa planilha legada, aplica regras declarativas e produz relatório de qualidade e, quando possível, XLSX “limpo”.

## Abreviações e Convenções
- PF: Profissão de Fé | PFB: Profissão de Fé e Batismo | TR: Transferência | RS: Restauração | EX: Exclusão | FA: Falecimento.
- IPB: Igreja Presbiteriana do Brasil | CI/IPB: Constituição e documentos correlatos.

## Itens a Confirmar (pendentes sem definição normativa aqui)
- Semântica operacional de “Rol Separado”.
- Uso exato de “Jurisdição” no contexto local.
- Escopo e formato de campos como “Casa/Apto Pastoral”, “RAIS”, “DIRF”.

---
Manter este arquivo alinhado às decisões do Conselho e aos templates IPB em uso. Atualizações devem preservar significado e histórico.

