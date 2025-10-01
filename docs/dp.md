# Entendimento do Problema (dp.md)

## Introdução
Este documento sintetiza o entendimento do problema discutido a partir de:
- `user.md`: trecho sobre Comunicação de Admissão de Membros Comungantes (dados obrigatórios e referência à CI/IPB).
- `igreja (1).xlsx`: planilha com vocabulário, seções e métricas oficiais da IPB para cadastros, estatísticas e financeiro.
- `notes metting.pages`: arquivo presente, porém sem texto extraível neste ambiente (formato IWA). Partimos de suposições prudentes sobre o escopo ali tratado.

Objetivo: introduzir o leitor ao problema, estruturar o raciocínio e quebrar o tema em partes menores e coordenáveis, para orientar decisões e execução de forma humana, clara e incremental.

## Contexto e Objetivos
- Contexto: hoje, cadastros e estatísticas eclesiásticas (membros, atos pastorais, departamentos, financeiro) são mantidos majoritariamente em planilhas e textos. O reporte anual deve seguir formatos e rubricas da IPB (CI/IPB, art.16 e correlatos).
- Objetivo geral: padronizar coleta, validação, consolidação e reporte desses dados, mantendo compatibilidade com os templates atuais (XLSX) e garantindo conformidade com a IPB.
- Objetivos específicos:
  - Reduzir retrabalho e divergências na consolidação anual.
  - Aumentar integridade e rastreabilidade (histórico de eventos por membro).
  - Produzir exportações oficiais (XLSX/PDF) com paridade ao modelo atual.
  - Permitir adoção gradual (sem “big bang”), com valor desde a Fase 1.

## O que já sabemos (dos documentos)
A partir de `user.md` e da planilha:
- Cadastros de membros exigem: dados civis (nome, nascimento, sexo), procedência religiosa, estado civil, profissão, endereço, alfabetização, batismo na infância; data/local/modo de recepção; celebrante.
- A planilha inclui:
  - Identificação do ministro e da unidade (CNPJ, Presbitério, Sínodo).
  - Campo de trabalho e atuação ministerial (doutrinação, atos pastorais, reuniões, ceias, batismos, profissões de fé).
  - Estrutura e liderança (presbíteros, diáconos, departamentos internos, congregações).
  - Estatísticas de membros: admissões (profissão de fé, transferência, restauração), baixas (exclusão, falecimento), comungantes/não‑comungantes, saldos ano a ano.
  - Financeiro: receitas/despesas com rubricas IPB (côngruas, sustento pastoral, verba presbiterial, dízimo ao SC), patrimônio e causas locais.

## Hipóteses e Pendências (meeting)
- Hipóteses: MVP prioriza cadastro de membros, fluxos de admissão/baixa e exportação básica compatível com XLSX; atos pastorais e financeiro viriam em fases subsequentes.
- Pendências: confirmação do escopo do MVP; decisão sobre manter XLSX como fonte primária temporária; prazos/regime de reporte; política de hospedagem (on‑premise vs. cloud) e requisitos de privacidade.

## Quebra do Problema em Partes
1) Dados e Modelo Canônico
- Entidades núcleo: Pessoa/Membro; Unidade Eclesiástica (Igreja/Congregação); Evento Pastoral; Lançamento Financeiro.
- Separar “Perfil do Membro” (dados estáveis) de “Eventos de Membro” (histórico temporal: profissão de fé, batismo, transferência, exclusão, falecimento, ordenação). Facilita relatórios por data de corte.
- Vocabulário controlado compatível com a planilha IPB (enums/listas) para evitar variações (ex.: tipo de admissão, rubricas).

2) Fluxos Operacionais
- Onboarding/Admissão: validações conforme CI/IPB (art.16) e anexos; coleta de documentos.
- Manutenção do Rol: mudanças de status, transferências (entrada/saída), restaurações, exclusões, falecimentos.
- Registro de Atos Pastorais: pregações, santas ceias, batismos, entrevistas, aulas EBD, reuniões.
- Fechamento e Reporte: consolidação de contagens e financeiro por período; geração de relatórios.

3) Regras e Validações
- Campos obrigatórios por tipo de admissão.
- Unicidade/Integridade: evitar duplicidade (CPF; fallback Nome+Nascimento quando CPF ausente).
- Reconciliação: saldo anterior + admissões − baixas = saldo seguinte (comungantes/não‑comungantes).
- Financeiro: mapeamento de rubricas IPB e consistência de totais.

4) Relatórios e Exportações
- Exportações XLSX/PDF espelhando a planilha atual (paridade de colunas/abas).
- Relatórios ministeriais e estatísticos para Conselho, Presbitério e Sínodo.

5) Integração com Planilhas (Legado)
- Importador de XLSX com motor de validação: gera relatório de erros (bloqueantes) e avisos (revisão), além de um XLSX “limpo” quando possível.
- Execução em paralelo por um ciclo (novo sistema + planilha) para comparação de resultados.

6) Segurança e Governança
- Perfis de acesso (Secretaria, Pastor/Conselho, Tesouraria).
- Trilhas de auditoria para alterações sensíveis.
- Política de privacidade (dados pessoais e eclesiásticos), backup e retenção.

7) Entregas por Fase (Estratégia)
- Fase 1: Cadastro + Admissões/Baixas + Export básico + Motor de Validação de XLSX.
- Fase 2: Atos Pastorais + Estatísticas automatizadas.
- Fase 3: Financeiro consolidado + relatórios completos.
- Fase 4: Integrações externas (API/Presbitério), hardening de compliance.

## Think Deeper (reflexões essenciais)
- Gargalo real está na qualidade/migração de dados e na fidelidade ao vocabulário IPB. Começar pelo “motor de validação” entrega valor cedo e reduz risco.
- Modelo temporal (eventos) é chave para perguntas como: “quem era comungante em 31/12?”
- Validações em camadas: Erros (bloqueiam) vs Avisos (inspecionar). Exemplos: batismo antes do nascimento (erro); idade atípica para cargo (aviso).
- Reconciliação automática das contagens (saldos) com realce das discrepâncias.
- Adoção gradual: rodada paralela pelo menos 1 ciclo para construir confiança.

## Consensus (síntese dos modelos)
- Pontos de acordo (Gemini & GPT‑5):
  - Estratégia faseada é apropriada; foco inicial em dados/validação e paridade com XLSX.
  - Separar Perfil x Eventos de Membro para histórico fiel e relatórios por data.
  - Planejar migração com forte limpeza e controles; risco alto se subestimado.
- Complementos práticos:
  - Definir critérios de aceite por fase (ver abaixo) e conduzir “parallel run”.
  - Tiered validation (erros/avisos) e relatório detalhado de qualidade de dados.
- Observação do GPT‑5: uma avaliação plenamente “linha‑a‑linha” requer artefatos formais (templates, ERD, regras declarativas). Podemos avançar com os insumos que já temos e detalhar ao incorporar esses artefatos.

## Critérios de Aceite (AC) por Fase
- Fase 1 (Cadastro/Admissões/Baixas/Export + Validação):
  - AC‑1: Importar XLSX legado e gerar relatório de qualidade com taxa de falsos positivos < 5%.
  - AC‑2: Cadastrar/atualizar membros com validações mínimas (campos obrigatórios, unicidade básica).
  - AC‑3: Exportar XLSX com paridade estrutural (> 99% de colunas/abas) frente ao template atual.
  - AC‑4: Rodada paralela 1 ciclo com < 1% de divergência em totais oficiais.
- Fase 2 (Atos/Estatísticas):
  - AC‑5: Registro de atos com presets e vínculo a pessoas/unidades.
  - AC‑6: Estatísticas automáticas batendo com planilha em >= 99% dos casos.
- Fase 3 (Financeiro):
  - AC‑7: Rubricas IPB, totais e saldos consistentes; export oficial.
- Fase 4 (Integrações/Compliance):
  - AC‑8: API de export controlada; trilhas de auditoria completas e política de retenção.

## Próximos Passos (ação)
- Confirmar escopo do MVP (Fase 1) e perfis de usuário.
- Levantar templates XLSX “oficiais” e variações reais em uso.
- Especificar regras de validação (erros/avisos) de forma declarativa (YAML/JSON) e mapear rubricas IPB.
- Esboçar modelo lógico (ERD) separando Perfil x Eventos e definindo chaves de reconciliação.
- Planejar migração piloto com amostras reais (anonimizadas) e execução paralela.

## Referências e Observações Técnicas
- Arquivos utilizados: `user.md`, `igreja (1).xlsx`, `notes metting.pages` (não‑legível neste ambiente).
- Sugestão: disponibilizar o conteúdo de `notes metting.pages` em PDF/TXT para integrar decisões e limites de escopo ao documento.

---
Versão: 0.1 (inicial). Este documento é vivo e receberá ajustes conforme novas evidências e decisões de reunião.
