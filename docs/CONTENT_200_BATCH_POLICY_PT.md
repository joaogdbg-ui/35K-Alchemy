# 35K Alchemy — política obrigatória de entregas de 200 elementos

**Normativa a partir da V80B.** Ler antes de criar conteúdo: `AGENTS.md`, `docs/WORKING_RULES_PT.md`, `HANDOFF_V80.md`. Esta política substitui qualquer indicação histórica de "até 200", "200 como objetivo" ou publicação de sublotes de 8/20/40/50. Dados históricos não devem ser reescritos.

## 1. Contrato de entrega — OBRIGATÓRIO

- **Uma entrega de expansão de conteúdo = exatamente 200 elementos NOVOS e efetivos**, contabilizados como diferença de IDs estáveis no catálogo face ao commit de base. Não basta juntar antigos elementos, receitas alternativas, variações cosméticas ou planos.
- **Não publicar APK/HTML de expansão, integrar PR de conteúdo em `main`, nem declarar lote finalizado com 1–199 elementos.** Sub-lotes de desenvolvimento 20/25/50 podem existir em branches de trabalho/draft PR sem merge, sem release e sem entrega final ao utilizador. Trabalhar progressivamente e continuar a partir do estado guardado até perfazer 200.
- PRs que **não criam elementos** (correção de bugs, UI, ícones existentes, documentação, segurança, build) são permitidos, mas não contam como "entrega de 200" nem reiniciam o progresso.
- **Nunca fabricar números:** um elemento só conta quando existe de facto (ID, nome, descrição, receita global, SVG original, catálogo integrado, testes verdes). Um lote que falha um requisito permanece WIP. Recorrência da meta não autoriza shortcuts na qualidade.
- A política aplica-se tanto a PRs como ao passo de build Android: `node tools/check-content-batch-200.mjs --base <SHA anterior>`. Não contornar o gate dividindo uma entrega em vários merges de 40.
- O gate automático prova quantidade, correspondência de ficheiros e invariantes básicos; **não pode provar bom gosto visual, intuição humana ou direitos de terceiros**. Estes exigem revisão adicional documentada.

## 2. Estado numérico verificável e caminho até 35K

- Base confirmada **V80B**, commit `c918b85d148c5daaceb0d85f1faa281e9c07bc41`: **5.612 elementos**, **13.949 receitas**. A V80B contém 40/200 do antigo ciclo; é uma exceção **histórica já publicada**, não um precedente autorizado para as novas entregas.
- Alvo mínimo = **35.000 elementos reais** (não exatamente 35.000). Faltam 29.388 desde esta base.
- **147 entregas de +200 = +29.400**, atingindo **35.012 elementos**. Isto evita reduzir artificialmente o último lote para 188 e respeita a regra de 200 até ao fim. Não contar "35K" como catálogo efetivo antes de chegar lá.
- **Próxima entrega:** +200 face aos 5.612 atuais = **5.812 elementos** e pelo menos **14.149 receitas únicas**. Para fechar o ciclo V80 sem perder os 40 existentes, desenvolver **160 adicionais para V80 + 40 iniciais para V81** na *mesma* entrega, com um único merge e um único lançamento de conteúdo. Os ciclos editoriais/versões internas não são entregas separadas.
- Após esta entrega, calcular de novo: `restantes = max(0, 35000 - total_real)`; `entregas = ceil(restantes / 200)`. Publicar a contagem real validada no handoff, nunca uma estimativa.

## 3. Linha de produção para criar 200 sem bloqueios

**Trabalhar em paralelo por função, mas validar num único lote de 200:**

1. **Blueprint de 200** antes de desenhar: selecionar aproximadamente **8 frentes de 25** (jogos/consolas/arcade/board; tecnologia; ciência/natureza; fantasia/mitologia; cultura e entretenimento), com **pelo menos metade da proposta centrada em gaming** sem sacrificar coerência. Distribuição flexível se uma família produzir conteúdo artificial.
2. **Receita primeiro**: para cada elemento escrever `id, nome inglês, category, summary, A, B, resultado, justificativa simples, ramo e dificuldade`. Confirmar uma combinação intuitiva; preferir incorporar ingredientes da base e ramos acessíveis para evitar cadeias impossíveis de adivinhar. Evitar dezenas de nomes que só trocam uma palavra ("X Scanner", "X Display", etc.).
3. **Pré-validação editorial** dos 200 pares: deduplicar IDs, nomes normalizados e pares sem ordem; verificar se A/B existem antes do resultado e são alcançáveis partindo de Water, Fire, Earth e Air. Resultados antigos são imutáveis. Vários caminhos para um resultado podem ser adicionados depois, mas **não contam** como novo elemento.
4. **Arte por sujeito**, em 4 ondas internas de 50 ou 8 de 25: um SVG 100×100 distinto por elemento, legível a **35px**, com silhueta/objeto identificável, cores, escala e materiais adequados. Não criar 200 variações de formas, cubos genéricos, flor+objeto ou SVGs de hashes diferentes com o mesmo desenho. Inserir arte original em `client/assets/vNN` e espelho exato no mapa de arte.
5. **Auditoria por onda sem publicação:** gerar galeria de 35px e 90px em claro/escuro, rejeitar motivos repetidos, identificar o objeto sem ler título, e corrigir. Não esperar pelos últimos 200 para detetar falhas.
6. **Integração final só aos 200:** packs + manifests + testes + documentação + HTML offline; verificar `npm test`, validador global, auditoria de nomes/IP, arte, `python tools/build-standalone.py` e o gate de lote. CI tem de estar verde **antes** do merge. O APK de testes só passa a nova expansão depois de validação completa.
7. **QA de jogabilidade:** ordem A+B/B+A, Classic, temas, Sort, toque/arrastar, pesquisas, scroll preservado, acessibilidade 320/360/390px e desktop 1280px, desempenho; confirmar Family Only, perfis e 2 recompensas para Merge sem simulações falsas. Teste em telemóvel e verificação legal antes de lançamento comercial.

### Quando os 200 não estão prontos

Não baixar a meta nem preencher com combinações arbitrárias. **Parar o merge/publicação do conteúdo e continuar a produção na mesma branch**, guardar todo o progresso verificável e os bloqueios no handoff. É permitido comunicar um checkpoint *WIP*, sempre marcado como não entregue; não substituir a obrigação dos 200 por micro-lançamentos. Se a revisão rejeitar um item, substituí-lo e repetir os testes até que haja 200 itens aprovados.

## 4. Critérios editoriais para aprovar CADA elemento

| Critério | Evidência obrigatória |
|---|---|
| Novo elemento verdadeiro | ID e nome normalizado inéditos; `items[]` aumenta uma unidade |
| Combinação orgânica | A+B tem ligação reconhecível ao resultado, sem arbitrariedade; A+B=B+A |
| Progressão | Ingredientes existentes e alcançáveis; pelo menos uma receita descoberta sem pré-requisitos absurdos |
| Informação | Nome inglês claro, descrição original e categoria correta |
| Arte | SVG original/seguro, silhueta específica reconhecível a ~35px; visualização 35/90px |
| Sem regressão | Nenhuma alteração de resultado, ID, save, Family Only, anúncio ou UI |
| Propriedade intelectual | Não copiar marcas, personagens, logótipos, ícones ou trade dress protegidos; paródias originais inteligíveis |

**Rejeitar** encher a quota com "Crystal Pixel Device V2", alterações de cor, renomeação de existentes ou combinações sem nexo. Deteção automática de duplicados e checksums é necessária, **mas não suficiente** para variedade real.

## 5. Manifests, QA e handoff obrigatório

- O manifesto de versão `shared/vNN-approved.json` regista o subconjunto de cada pack com `new_items[]`, `ingredients[]`, `path`, `art_mode: bespoke-subject`, contagens reais e progresso editorial. Quando uma entrega atravessa ciclos (como 160 V80 + 40 V81), cada manifesto mantém os seus próprios dados; **o gate compara o delta agregado dos packs no PR/commit**, não um único manifesto fictício de 200.
- `client/src/organic-pack-vNN.js` exporta dados JSON literais; `client/src/organic-art-vNN.js` contém SVGs idênticos aos ficheiros fonte. IDs e receitas antigas não podem ser reescritos. Novos packs exigem integração explícita no catálogo, validador, builder HTML e auditorias.
- O gate `tools/check-content-batch-200.mjs` recusa incrementos de 1–199 ou mais de 200, IDs repetidos, fontes ausentes, recipes antigas modificadas, manifests inconsistentes e SVGs duplicados entre as 200 entradas. Não corrige nem gera arte automaticamente.
- Em cada entrega, escrever: `baseline SHA`, elementos/receitas antes, **+200 IDs**, elementos/receitas depois, famílias/categorias, ícones revistos, CI URL/status, commit merged, build Android/status, APK real, anomalias e itens ainda por resolver. O reporte **não pode arredondar** números.
- **Não automatizar falsamente a revisão humana**: os relatórios distinguem claramente verificações automatizadas de testes físicos, artísticos e de IP.
- Não mexer em anúncios recompensados, cloud/leaderboards ou assinatura de produção durante uma expansão sem testes separados.

## 6. Regra de continuidade entre conversas

A instrução "avança"/"continua" significa **continuar os 200 em curso**, não publicar o que couber numa resposta. Se a execução terminar antes dos 200, conservar branch, manifests, lista de IDs e QA pendente, informar o progresso com precisão e retomar no turno seguinte. Nunca dizer que houve entrega de 200 ou APK novo quando ainda não houve. O objetivo é escalabilidade com qualidade, não passos de 20 que se tornam releases independentes.

## 7. Condição adicional de cada expansão: famílias fechadas, multifamília e orçamento CI

Antes de dar por concluído um lote de +200, aplicar integralmente `docs/FAMILIES_ONLY_CONTRACT_PT.md`. A inclusão de cada novo elemento numa família exige que o jogador o possa alcançar **a partir dos 4 starters daquela família**, mesmo sem partilhas de outras famílias. A partilha por ID único não substitui a completabilidade isolada.

**Não executar Actions por 25/50/100/150:** conservar os SVG e as receitas na branch WIP, fazer validações locais e auditoria editorial. Só abrir PR com exatamente +200, executar a CI completa uma vez e gerar um único APK após merge. Detalhes em `docs/CI_BUDGET_POLICY_PT.md`.
