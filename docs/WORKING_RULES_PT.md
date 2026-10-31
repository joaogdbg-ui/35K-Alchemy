# Regras permanentes do Alchemy 10K

**Meta vigente desde 29/10/2026:** 10.000+ elementos; base V81 = 5.812 elementos / 14.149 receitas, 21 entregas futuras de exatamente +200 para 10.012. Qualquer referência abaixo à antiga meta 35K, ao antigo objetivo de 147 lotes ou à próxima entrega V80/V81 pertence ao histórico e está substituída por este contrato. Ver `docs/ALCHEMY_10K_THEMATIC_EXPANSION.md`.

## Conteúdo e motor

1. Receita determinística e global: `A+B=C`, `B+A=C` e **nunca** `A+B=D` noutro modo.
2. Não alterar IDs ou resultados anteriores, nem introduzir nomes normalizados e pares duplicados. **Exceção decidida pelo dono a 31/10/2026 (V87):** receitas claramente forçadas podem mudar de resultado através de `client/src/recipe-polish-v87.js` (ou sucessor), só quando o resultado antigo mantém outra receita e a validação confirma Classic e todas as famílias a 100%. IDs, elementos e saves nunca mudam; pares livres podem receber receitas lógicas novas.
3. Classic começa com Water, Fire, Earth e Air, deve alcançar todo o catálogo.
4. Campanhas Families Only começam com quatro elementos temáticos diferentes; têm de ser alcançáveis autonomamente, com receitas compatíveis com Classic.
5. Um ID multifamília é partilhado: descobri-lo numa campanha desbloqueia-o nas demais. Classic mantém progresso distinto.
6. Merge Elements into Classic transfere em lote descobertas obtidas nas famílias e ainda em falta no Classic; exclui elementos iniciais gratuitos, não duplica IDs, cobra **duas recompensas de anúncios distintas**. Salvar 1/2 até concluir 2/2; não mudar de modo.
7. Anúncios recompensados: primeira escolha de modo gratuita; mudanças posteriores, hints, Batch Combine e Merge só com recompensa SDK confirmada. HTML offline nunca simula anúncio ou concede desbloqueio sem recompensa. **Exceção decidida pelo dono a 30/10/2026:** quando não há anúncio disponível (sem SDK ou falha de carregamento), o jogador pode usar UMA hint grátis a cada 10 minutos; não acumula, não é saldo de créditos, e fechar um anúncio a meio não a desbloqueia.
8. Novos elementos têm prioridade sobre receitas alternativas para elementos existentes. Receitas precisam de coerência intuitiva.
9. **OBRIGATÓRIO: cada entrega futura de expansão acrescenta exatamente 200 elementos NOVOS e validados face ao último commit publicado.** Se houver 1–199 prontos, manter numa branch WIP e continuar; não publicar um micro-lote. Qualidade não se negocia: substituir elementos rejeitados em vez de encher a quota. Ler `docs/CONTENT_200_BATCH_POLICY_PT.md`.
10. Cada elemento novo precisa de SVG específico e legível a 35 px. Evitar motivos genéricos repetidos; revisão humana + verificador de semelhança.
11. UI em inglês: modo claro/escuro/sistema, contador junto ao logótipo, som em Settings, botão de modo à direita, Hint e Batch na mesma linha, Already discovered em linha própria sem toast duplicado, pesquisa compacta e Sort A–Z / Old first / New first.
12. Proteção de marcas e copyright: ilustrações originais, revisão de referências a terceiros antes da Google Play.

## Produção escalável de 200 — regra de entrega

- A partir de V80B, **um lote publicado = +200 IDs novos**, com receitas próprias, nomes normalizados únicos, SVGs individuais semanticamente distintos e 35px legíveis. Ondas internas 25/50 não são entregas e não podem ser integradas em `main` como conteúdo parcial.
- V80B é a base histórica de **5.612** elementos; a próxima entrega inclui **160 elementos restantes em V80 + 40 iniciais em V81, num mesmo merge**, total **5.812**. Após 147 entregas de +200 a partir desta base chega-se a **35.012** elementos (35K é mínimo, não contagem exata).
- Não admitir atalhos de geração de nomes arbitrários, receitas sem lógica, cópias de SVG ou motivos repetidos. O artefacto de produção só conta após validações e revisão visual.
- O CI e build Android executam `tools/check-content-batch-200.mjs` e **bloqueiam conteúdo parcial**; zero novos elementos para correções técnicas é permitido. Para continuidade entre conversas, manter sempre branch WIP e estado do handoff.
- Produzir por blueprint de 200, 8 frentes de 25 e 4 ondas internas de 50; rever e corrigir sem cortar a quota. O processo completo está em `docs/CONTENT_200_BATCH_POLICY_PT.md`.

## Processo obrigatório

- Ler handoff e normas antes de editar; incrementar versão, documentação e testes.
- Executar `node --test client/test/*.test.mjs`, validador do catálogo, auditor de arte e `python tools/build-standalone.py`.
- Verificar 320/360/390/1280 px, Sort, combinação normal e inexistente, temas, Family Only e Merge.
- Nunca juntar uma mudança de sistema Android à expansão editorial sem testes de regressão separados.
- Guardar chaves e credenciais fora do Git. Publicação Android só após teste físico, consentimento, revisão IP e assinatura.

## Contrato obrigatório — Families Only, independente e completo

- **Todas as campanhas Family Only são experiências autónomas e termináveis a 100%.** Cada campanha tem **exatamente 4 ingredientes iniciais próprios, temáticos e gratuitos**; não utilizar os quatro iniciais do Classic como conjunto da família. Não é necessário jogar Classic, trocar de família, ver anúncios, fazer Merge ou importar progresso para terminar uma campanha.
- Para cada família `f`, começar **apenas** nos seus quatro `starters`; aplicar repetidamente receitas globais A+B=C cujos dois ingredientes já estejam disponíveis **na mesma família**, até não desbloquear mais nada. O conjunto final deve ser **exatamente** `f.items`. Verificar o **100% do grafo isolado** sem usar partilha multifamília — esta partilha é um bónus de progresso, não uma condição de completabilidade.
- **Um elemento multifamília é uma entidade única:** mesmo ID estável, mesmo nome, mesmos dados, mesma imagem única e **mesmo resultado global A+B=C** independentemente do modo. Um desbloqueio genuíno na família A é propagado às outras famílias que listam esse mesmo ID, uma vez apenas e de forma persistente. A sincronização pode importar o ID descoberto, **nunca** receitas inventadas, progressos Classic nem elementos de famílias não elegíveis.
- **Classic e Families Only têm saves separados.** A propagação multifamília acontece apenas entre famílias. Para transferir descobertas para Classic usar exclusivamente `Merge Elements into Classic` após as **duas recompensas de anúncios realmente confirmadas**; 1/2 persiste. Os quatro starters gratuitos de qualquer campanha não contam para Merge.
- Todos os 200 novos elementos devem ter **filiação explícita** quando são adicionados ao modo Families Only: associar IDs a `items` das campanhas relevantes, registar receitas globais utilizáveis na família, preservar ID único e testar a completabilidade isolada de **cada** família após as alterações. A mera associação por categoria não garante que seja possível descobrir o elemento.
- **QA mínimo antes de qualquer publicação:** quatro starters únicos e temáticos; `items` sem duplicados; receitas sem conflitos; fecho de alcance a 100% sem partilhas; teste de sincronização de IDs em todas as famílias elegíveis; isolamento Classic; Merge sem duplicados e sem fraude em rewarded ads.
- **Débito real identificado em 29/10/2026:** na V53 atual, Nature & Science ainda começa com `legacy:0,1,2,3` (Water, Fire, Earth, Air). A simulação confirma que os **476/476** elementos são atingíveis independentemente; People & Culture completa **211/211**; existem **31 IDs partilhados**. Porém, os starters da Nature **não cumprem** o critério temático distinto do Classic. Corrigir conscientemente as receitas/árvore antes de considerar esta regra plenamente implementada; **não alterar os starters isoladamente** para evitar partidas impossíveis.
- Referência: `docs/FAMILIES_ONLY_CONTRACT_PT.md`.

## Economia de GitHub Actions — REGRA OBRIGATÓRIA

- **Trabalhar até aos +200 elementos na branch WIP SEM executar GitHub Actions a cada push.** Não manter workflows `on: push` para branches WIP; não abrir PR de conteúdo aos 25/50/100/150. O workflow temporário `.github/workflows/wip-200-qa.yml` foi removido da branch WIP em 29/10/2026 por consumir minutos.
- Fazer as pré-verificações baratas com JavaScript/ferramentas locais, revisão de dados, fichas de receitas, SVGs e galeria durante a produção. **Não afirmar que a CI completa passou** enquanto não for executada.
- **Só aos +200 prontos**, abrir PR de conteúdo e executar a auditoria completa do GitHub Actions **uma vez por candidato**; só após CI verde integrar em `main` e executar o build Android **uma vez por entrega**. Corrigir todos os problemas detetáveis antes da PR; evitar commits de correção que desencadeiem execuções repetidas.
- Não iniciar `workflow_dispatch` ou `re-run` por rotina. Reexecuções excecionais apenas se houver falha real ou um motivo explícito; registar custo e motivo.
- **Commits e pushes sem workflows associados não gastam minutos de Actions por si só.** O custo surge dos jobs realmente executados. `docs/CI_BUDGET_POLICY_PT.md` é a referência permanente.
