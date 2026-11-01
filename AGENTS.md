# Alchemy 10K — instruções obrigatórias para desenvolvimento

Ler primeiro `docs/WORKING_RULES_PT.md`, `docs/CONTENT_200_BATCH_POLICY_PT.md`, `docs/ANDROID_BUILD.md`, `docs/ALCHEMY_10K_THEMATIC_EXPANSION.md` e o handoff atual (`HANDOFF_ALCHEMY_10K.md`).

## Produção de conteúdo — REGRA ABSOLUTA

- **Cada entrega de expansão após V80B exige exatamente +200 elementos NOVOS no catálogo verificado**, relativamente à baseline do PR. Não publicar lotes parciais de 8/20/40/50, não fazer merge desses parciais nem disponibilizar um APK de expansão antes dos 200. Ondas internas de 25/50 apenas em branch WIP; continuar até 200.
- **Nunca preencher artificialmente 200**: ID/nome/receita únicos e coerentes, origem/reachability, descrição em inglês, SVG próprio reconhecível a 35px e testes obrigatórios para cada elemento. Sem desenhos "genéricos diferentes por hash", falsos IDs ou receitas alternativas contadas como novos.
- V80B e V81 são **histórico concluído**: a base atual V81 tem **5.812 elementos e 14.149 receitas**. Meta atual **Alchemy 10K**, pelo menos 10.000 elementos: **21 lotes futuros de exatamente +200** chegam a 10.012. O próximo lote editorial é V82, nunca publicar 1–199 novos elementos.
- **Exceção do dono (V139):** quando o dono pede explicitamente uma funcionalidade que precisa de elementos novos (ex.: artigos do Market como elementos), esses elementos podem entrar fora dos lotes de 200. O manifesto `shared/vNNN-approved.json` leva `"owner_exception": true` e o gate aceita o lote. Continua obrigatório: receitas coerentes na família, SVG próprio e testes.
- O gate `node tools/check-content-batch-200.mjs --base <SHA>` verifica o incremento real e deve passar em PR e build Android. Mudanças técnicas com **zero** novos elementos são permitidas, mas não contam como expansão.
- Uma conversa interrompida deve deixar progresso WIP guardado e retomar na mesma branch; não confundir checkpoint com entrega, não alegar testes/arte/IP/QA não feitos.

## Invariantes imutáveis

- `A+B=B+A=C` em todos os modos; resultados, IDs e saves anteriores são imutáveis. Validar nomes normalizados, pares e acessibilidade desde os quatro iniciais Classic.
- Classic e Families Only têm progresso separado e quatro starters temáticos por família; um elemento multifamília tem único ID. Merge só com **duas** recompensas verificadas e crédito 1/2 persistente. HTML offline nunca simula anúncios.
- UI inglês; preservar Settings, Sort, combiner, sons, tema, pesquisa, scroll, Family Only e Merge. Ilustrações SVG originais, semanticamente distintas; evitar direitos de terceiros.
- Tests: `npm test`, validadores, auditorias de SVG e IP, builder standalone, comparação de deltas +200 em CI. Confirmar 320/360/390/1280px e testar APK físico antes da distribuição comercial.
- Não apresentar Google Cloud, Google leaderboard, AdMob real nem assinatura release como concluídos sem verificação.

## Families Only e consumo de CI — PONTOS INEGOCIÁVEIS

- **Cada família é completável a 100% APENAS com os seus 4 starters temáticos**, sem Classic, outras famílias, anúncios ou Merge. Verificar fecho de alcance isolado por família em todas as expansões.
- **Multifamília:** mesmo ID/receita/arte em todas as famílias elegíveis; descoberta sincroniza entre elas; Classic independente, exceto Merge após 2 recompensas reais.
- V53 contém uma exceção ainda por corrigir: Nature & Science usa os 4 starters Classic (apesar de alcançar 476/476); corrigir grafo com cuidado, não só os iniciais. Ler `docs/FAMILIES_ONLY_CONTRACT_PT.md`.
- **NÃO desencadear GitHub Actions a cada push WIP.** Produzir os +200 completos, rever sem CI cobrada, abrir um único PR com CI, e só após merge uma compilação Android. Ler `docs/CI_BUDGET_POLICY_PT.md`.
