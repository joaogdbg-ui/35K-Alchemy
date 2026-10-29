# 35K Alchemy — instruções obrigatórias para desenvolvimento

Ler primeiro `docs/WORKING_RULES_PT.md`, `docs/CONTENT_200_BATCH_POLICY_PT.md`, `docs/ANDROID_BUILD.md` e o handoff atual.

## Produção de conteúdo — REGRA ABSOLUTA

- **Cada entrega de expansão após V80B exige exatamente +200 elementos NOVOS no catálogo verificado**, relativamente à baseline do PR. Não publicar lotes parciais de 8/20/40/50, não fazer merge desses parciais nem disponibilizar um APK de expansão antes dos 200. Ondas internas de 25/50 apenas em branch WIP; continuar até 200.
- **Nunca preencher artificialmente 200**: ID/nome/receita únicos e coerentes, origem/reachability, descrição em inglês, SVG próprio reconhecível a 35px e testes obrigatórios para cada elemento. Sem desenhos "genéricos diferentes por hash", falsos IDs ou receitas alternativas contadas como novos.
- V80B 40/200 é **histórico pré-política**. A próxima entrega é **+160 V80 e +40 V81 = +200 numa só entrega**, para 5.812 elementos. A partir de 5.612, 147 lotes de +200 atingem 35.012 (meta mínima: 35K). Não publicar 160 e 40 separadamente.
- O gate `node tools/check-content-batch-200.mjs --base <SHA>` verifica o incremento real e deve passar em PR e build Android. Mudanças técnicas com **zero** novos elementos são permitidas, mas não contam como expansão.
- Uma conversa interrompida deve deixar progresso WIP guardado e retomar na mesma branch; não confundir checkpoint com entrega, não alegar testes/arte/IP/QA não feitos.

## Invariantes imutáveis

- `A+B=B+A=C` em todos os modos; resultados, IDs e saves anteriores são imutáveis. Validar nomes normalizados, pares e acessibilidade desde os quatro iniciais Classic.
- Classic e Families Only têm progresso separado e quatro starters temáticos por família; um elemento multifamília tem único ID. Merge só com **duas** recompensas verificadas e crédito 1/2 persistente. HTML offline nunca simula anúncios.
- UI inglês; preservar Settings, Sort, combiner, sons, tema, pesquisa, scroll, Family Only e Merge. Ilustrações SVG originais, semanticamente distintas; evitar direitos de terceiros.
- Tests: `npm test`, validadores, auditorias de SVG e IP, builder standalone, comparação de deltas +200 em CI. Confirmar 320/360/390/1280px e testar APK físico antes da distribuição comercial.
- Não apresentar Google Cloud, Google leaderboard, AdMob real nem assinatura release como concluídos sem verificação.
