# Alchemy 10K — V82 merged; V83 in development

**Exact target: 10,000 elements, not 10,012.** The V82 batch of +200 was merged into `main` in commit `b75811874766a1270ac5ca908fd57719e1557c0a`: **6,012 elements / 14,349 global recipes**. From here the remaining 3,988 elements require **19 regular +200 deliveries**, reaching 9,812, then **one exceptional final +188 delivery** reaching precisely 10,000. The last-batch gate must be adapted only when that final baseline is reached.

**Current WIP:** [V83 fantasy and gaming branch](https://github.com/joaogdbg-ui/35K-Alchemy/tree/wip/alchemy-10k-v83-fantasy-gaming), with 150 authored candidates NOT integrated into the game. V83 has 150 proposed global recipes and 150 subject-specific SVG source files: 50 original Mythology/Folklore discoveries, 75 Classic-only gaming items and 25 Classic-only living creatures. Source-level checks: 41 historical content sources inspected (39 organic modules plus legacy and creative), with no V83 normalized-name or global-pair collisions; all WIP recipe ingredients are defined and new-on-new dependencies are ordered. Mythology remains autonomously reachable 159/159 from four starters. Native 35px artistic QA and full CI remain pending. V83 will be released only at +200, targeting 6,212 elements.

**Android:** V82 signed debug/test APK successfully built after merge, [latest test APK](https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk). Production signing and actual rewarded ads are not implemented.

---

## Historical development notes (may describe earlier pre-merge states)

# Alchemy 10K — V82 content complete (200/200), release QA pending

The V81 **main** baseline is **5,812 distinct elements / 14,149 stable unordered recipes**. The V82 feature branch has **200 additional authored elements, 200 global recipes and 200 source-matched standalone SVG illustrations**: 93 Mythology & Gods and 107 Prehistory & Dinosaurs. Candidate catalog: **6,012 elements / 14,349 recipes**, not yet merged or released. The active goal remains **10,000+ genuine discoveries** in exact +200 batches; after this proposed +200 increment another **20 complete batches** would reach 10,012.

**Thematic Family Only** uses exactly four own starters for each campaign, reuses globally identical recipes and synchronizes truly earned cross-family IDs without transferring free starters. Direct independent recipe-closure checks on the current source achieved **Mythology 109/109 (105 family recipes)**, **Prehistory 116/116 (112)**, **Nature & Science 476/476 (1,781)**, and **People & Culture 211/211 (266)**. Nature & Science retains its known historical issue: starter ingredients currently match the Classic four. Stable historic saves, old recipes, original Android application ID and verified-ad rewards are not rewritten.

**Artwork:** each V82 entry has its own 100×100 SVG source file and an identical entry in the runtime vector map. The initial 120 sources are individually composed drawings; the final 80 extinct animals use the custom species-parameterized anatomical vector renderer, not pasted stock graphics. Uniqueness and SVG structure are subject to automated gates. **Real-device recognizability at 35px still needs human QA.**

**Links:** [200-SVG contact sheet at 35px / 90px](docs/V82_ART_REVIEW.md) · [200 V82 item definitions and recipes](client/src/organic-pack-v82.js) · [theme campaign contract](docs/FAMILIES_ONLY_CONTRACT_PT.md) · [V82 validator](tools/validate-v82.mjs) · [200-item delivery gate](tools/check-content-batch-200.mjs) · [complete development handoff](HANDOFF_ALCHEMY_10K.md) · [latest existing APK (earlier main build, NOT V82)](https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest).

**Verification status:** 46 historical catalog source modules examined for proposed name collisions; identified and disambiguated `Hades the God` (distinct from the historical Hades game) and `Fossilized Dinosaur Egg` (distinct from a prior franchise prop). Direct source-based family closure and subset pair checks passed. **Full npm test / Node+Python audits / standalone HTML build / GitHub Actions / manual mobile art review / APK build have not yet been executed.** No V82 APK or merged content release is claimed.


---

# 35K Alchemy — V81 release candidate: 5,812 elements / 14,149 recipes

This candidate delivers **exactly 200 new discoveries** since published V80B: **160 additional V80** plus **40 new V81** elements. All have individual original SVG illustrations and globally deterministic recipes. **Publication remains conditional on one complete CI check, merge, and Android APK build.** No fake rewarded ads or unfinished Google cloud integration.

[V81 handoff](HANDOFF_V81.md) · [V80 SVG review](docs/V80_ART_REVIEW.md) · [V81 SVG review](docs/V81_ART_REVIEW.md) · [Family Only rules](docs/FAMILIES_ONLY_CONTRACT_PT.md) · [CI minutes policy](docs/CI_BUDGET_POLICY_PT.md)

Historical release notes follow.

# 35K Alchemy — V80B: 5.612 elementos / 13.949 receitas

**Novas regras explícitas:** [Families Only independente + multifamília](docs/FAMILIES_ONLY_CONTRACT_PT.md) · [Poupança de minutos GitHub Actions](docs/CI_BUDGET_POLICY_PT.md). Os testes pesados só devem correr após concluir os +200 elementos, sem workflow a cada push WIP.

**Política de expansão atualizada:** cada nova entrega de conteúdo, a partir desta baseline, deve adicionar **exatamente 200 elementos reais** com receitas intuitivas e SVG próprio. Ondas internas de 25/50 podem ser usadas, mas **nunca lançadas como entregas isoladas**. Próximo incremento: **160 elementos para fechar V80 + 40 em V81, num único PR**, chegando a 5.812 elementos. Com 147 lotes de 200 atingiremos 35.012 (35K mínimo).

[Ler o contrato de produção de 200](docs/CONTENT_200_BATCH_POLICY_PT.md) · [Handoff V80B](HANDOFF_V80.md) · [Galeria V80](docs/V80_ART_REVIEW.md) · [APK atual de testes](https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk)

> O histórico abaixo descreve versões anteriores à regra obrigatória de 200 por entrega; não é uma autorização para micro-lotes futuros.

# 35K Alchemy — V80A: 5,580 elements / 13,917 recipes

Third 200-element cycle: eight hand-authored discoveries (8/200, 192 remain), each with a unique deterministic recipe and a bespoke SVG. No Settings, Family Only profiles, reward contract or old recipes altered. See [V80 handoff](HANDOFF_V80.md) and [35px art review](docs/V80_ART_REVIEW.md).

# 35K Alchemy — V79: 5,572 elements and 13,909 recipes

V79 completes the second 200-element cycle (V76 through V79). The new 50 discoveries each have their own source SVG, with older IDs, recipes, Settings and saved progress preserved. See [V79 art review](docs/V79_ART_REVIEW.md).

# 35K Alchemy V78 — 150/200 content cycle

5,522 elements and 13,859 unique recipes after the +50 original V78 items, all with 35px source SVGs; 50 remain in the current 200-item cycle. Settings V76.8 unchanged. [V78 handoff](HANDOFF_V78.md) · [V78 art review](docs/V78_ART_REVIEW.md).

# 35K Alchemy — V77.0 (100/200 original-content cycle)

Current: 5,472 elements and 13,809 deterministic unordered recipes. V77 adds 50 original content + SVG illustrations without changing existing element IDs, recipes or settings. The current 200-item cycle stands at 100/200, with 100 still pending. See [V77 handoff](HANDOFF_V77.md) and [35px art review](docs/V77_ART_REVIEW.md).

# 35K Alchemy — V76.4 (clear hardware names and original app icon)

Repositório oficial do jogo **35K Alchemy**, incluindo o código-fonte completo da V76 e o pipeline Android.

## Estado verificado — 28 de outubro de 2026

- **Migração GitHub concluída**: fontes, SVGs, testes, documentação e histórico de arte foram importados no commit [2159fa9](https://github.com/joaogdbg-ui/35K-Alchemy/commit/2159fa9f5f62f9065e595227748035a6afccb79b).
- **5.172 elementos**, **13.509 receitas** globalmente determinísticas.
- **252 testes Node aprovados** na compilação Android.
- **HTML V68, validadores de catálogo e auditorias de arte aprovados**.
- **APK Android de testes compilado com sucesso** pelo GitHub Actions em [Build Android debug APK #1](https://github.com/joaogdbg-ui/35K-Alchemy/actions/runs/40782252239), em 28/10/2026.
- Artefacto: **35K-Alchemy-V68-debug-APK**, disponível no separador **Artifacts** da execução até 11/11/2026. O ficheiro ZIP contém `app-debug.apk`.


## V69 — 76 desenhos originais, sem alterar as receitas

- 76 ícones antigos redesenhados individualmente em SVG, com arte específica do objeto, paleta pastel e visualização a 35 px em temas claro e escuro.
- **Os 5.172 elementos e as 13.509 receitas da V68 permanecem inalterados**; não foram criados novos elementos nem alterados IDs ou saves.
- Os desenhos estão em `client/assets/v69/redrawn-v61/`, integrados na prioridade de arte por `client/src/organic-art-v69.js`.
- `shared/v69-approved.json` fixa IDs e hashes SVG; `tools/validate-v69.mjs` e `tools/audit-v69-art.py` validam o lote.
- Correção da dívida gráfica: o handoff V68 contava 76 pendentes, mas os manifestos mostraram 90 composições genéricas efetivamente ainda por substituir. Após a V69 **restam 14**, não zero.
- [Handoff da V69](HANDOFF_V69.md) e [auditoria visual](docs/V69_ART_QA.json).


## V70 — fecho de 14 desenhos e correção do espaço superior

- 14 SVGs individuais: fecha o total de **90** casos genéricos efetivamente pendentes após a V68 (76 redesenhados na V69 e 14 na V70). A classificação original `motif-composite` da V61 fica com **zero** elementos sem redesenho.
- Manifesto: `shared/v70-approved.json`, validação `tools/validate-v70.mjs` e auditoria `tools/audit-v70-art.py`.
- UI: reduz o espaço vazio acima do cabeçalho em Android imersivo e aproxima a zona de combinação da barra superior, sem remover controlos nem alterar os layouts desktop.
- Mantém 5.172 elementos e 13.509 receitas, sem alterar IDs, modos, saves, monetização ou a assinatura Android.
- Próximo ciclo **V71**: expansão de **até 200 elementos novos**, condicionada a receitas orgânicas, SVG específico por objeto, legibilidade a 35 px e validação das campanhas.

## V71 — Primeiro conjunto de expansão (40/200)

- 40 novos elementos originais e 40 combinações intuitivas; SVG individual em cada elemento.
- Catálogo agora em **5.212 elementos** e **13.549 receitas**; todos os resultados anteriores preservados.
- V71 é uma expansão progressiva **40/200**, não afirmamos que os 200 estão concluídos. Prioridade à qualidade artística a 35 px.
- [Handoff da V71](docs/V71_HANDOFF.md).

## V72 — segundo grupo de expansão e correções de jogabilidade

- **5.232 elementos / 13.569 receitas**, contando 20 descobertas originais de videojogos e arcade nesta versão, além das 40 da V71.
- **60/200 novos elementos** no ciclo de expansão; faltam 140 para a meta. Não são consideradas concluídas descobertas ainda não implementadas.
- 20 SVGs individuais novos em `client/assets/v72/new/`, integrados via `client/src/organic-art-v72.js`, com receitas globais `client/src/organic-pack-v72.js`.
- Corrigido o **salto da lista para o topo** após novas descobertas: o inventário virtualizado conserva o elemento visível anterior. Pesquisa, Sort e filtros ainda podem regressar ao início propositadamente.
- Mais **7 px de espaço acima do combinador** nos ecrãs móveis suficientemente altos, sem alterar a posição dos restantes controlos nos ecrãs baixos.
- Verificações adicionais em `tools/validate-v72.mjs` e `client/test/v72-ui-regressions.test.mjs`.
- Handoff completo em [HANDOFF_V72.md](HANDOFF_V72.md).
- APK atualizado no endereço fixo: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

## V73 — 24 novos elementos e correção do espaço sobre o combinador

- V73 acrescenta 24 ilustrações próprias, 24 novas receitas, preservando todos os elementos anteriores.
- Catálogo após validação: **5.256 elementos, 13.593 receitas**; progresso do ciclo de 200: **84/200**, faltando 116.
- Zona superior: deslocados **apenas** os dois slots 9px para baixo em ecrãs altos, sem deslocar Hint, inventário ou o espaço inferior.
- Código: `client/src/organic-pack-v73.js`, `client/src/organic-art-v73.js`, `shared/v73-approved.json`.
- Testes: `tools/validate-v73.mjs` e `client/test/v73-ui-regressions.test.mjs`. [Handoff](HANDOFF_V73.md).
- APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

## V74 — expansão controlada

- Subconjunto de **48 novos elementos**, com 48 novas receitas e desenhos SVG individuais.
- Total alvo após testes: **5.304 elementos / 13.641 receitas**. Avanço neste ciclo: **132/200**, faltam **68**.
- Não alteramos recipes anteriores, saves ou assinatura Android.
- Documentação: [HANDOFF_V74.md](HANDOFF_V74.md).

## V75 — primeiro ciclo de expansão de 200 concluído

- **68 descobertas finais da expansão V71–V75**: cada uma com uma receita fixa, SVG individual e descrição própria em inglês.
- **5.372 elementos e 13.709 receitas** após validação; os 200 novos elementos foram distribuídos por V71 (+40), V72 (+20), V73 (+24), V74 (+48), V75 (+68).
- Todos os IDs, receitas anteriores, perfis Classic e Families Only, Merge recompensado, saves e assinatura Android continuam preservados.
- Manifests e testes: `shared/v75-approved.json`, `tools/validate-v75.mjs`, `tools/audit-v75-art.py`. [Handoff V75](HANDOFF_V75.md).
- [Galeria dos 68 SVGs a 35 px](docs/V75_ART_REVIEW.md). O teste visual em aparelho real continua recomendado.
- APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

## V76 — 50 novas descobertas e ilustrações originais (subfase 1/4)

- **50 elementos e 50 receitas** inéditos, centrados em acessórios para consolas, preservação retro, hardware e arcade.
- Contagem alvo após validação: **5.422 elementos e 13.759 receitas**.
- Primeiro sublote do próximo ciclo de 200: **50/200**, faltam **150**. Não declarar o ciclo completo antes de criar e rever os outros elementos.
- SVGs individuais em `client/assets/v76/`, 5 módulos de arte e manifesto `shared/v76-approved.json`.
- Auditorias: `tools/validate-v76.mjs` e `tools/audit-v76-art.py`; `node --test client/test/*.test.mjs`.
- [Galeria dos 50 novos desenhos, a 35 px e 90 px](docs/V76_ART_REVIEW.md) e [handoff V76](HANDOFF_V76.md).
- APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

## Instalar Android (link permanente)

- **[Descarregar 35K-Alchemy.apk](https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk)**.
- **[Página da versão Android mais recente](https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest)**.
- A publicação é uma **pré-release de testes**, assinada com o certificado próprio do 35K Alchemy. Não partilha assinatura com o Virtual Spectre.
- O workflow publica sempre o nome `35K-Alchemy.apk` e um `versionCode` crescente, permitindo atualizações subsequentes com o mesmo certificado de testes.
- **Primeira mudança de assinatura:** se já instalaste `app-debug.apk` (assinado anteriormente com a chave aleatória do runner), a próxima versão poderá exigir desinstalação. **Exporta/guarda os saves primeiro**.
- **Segurança:** o certificado de testes é público no repositório e **não deve ser usado para Google Play nem distribuição comercial**. A assinatura de produção deve ter uma chave privada exclusiva, guardada em GitHub Secrets ou num serviço seguro; nunca a publicar no repositório.

## Construir novos APKs

Em [GitHub Actions](https://github.com/joaogdbg-ui/35K-Alchemy/actions), selecionar **Build 35K Alchemy APK → Run workflow**. O workflow usa Node 22, Python 3.12 (com dependências de auditoria), JDK 21, Android API 36 e Capacitor 8. Compila e valida o projeto a partir do código atual da branch `main`.

A importação V68 por arquivo foi **executada e concluída**. **Não é necessário voltar a carregar o arquivo** nem executar `Import full V68 source and build APK`. Este workflow inicial serviu apenas para importar o projeto.

## Limites antes de lançamento comercial

O APK produzido continua a ser **debug para testes**: ainda não foi testado num aparelho Android real. AdMob recompensado, UMP, validação das recompensas (SSV), migração de saves existentes, assinatura release e AAB Google Play continuam por implementar e validar. O HTML offline não pode simular anúncios nem conceder recompensas fictícias.

Ler [regras permanentes](docs/WORKING_RULES_PT.md), [guia Android](docs/ANDROID_BUILD.md) e [instruções de desenvolvimento](AGENTS.md).

Este repositório é público: fontes e assets ficam acessíveis aos visitantes.

## V76.1 — nomes fictícios e auditoria de propriedade intelectual

- Mantidos **5.422 elementos e 13.759 receitas**; sem alteração de IDs, fórmulas, campanhas, saves ou certificados.
- Nomes apresentados ao jogador passaram para alternativas editoriais fictícias: Qelvorune, GlidePort, Zerqadyn, PocketNova, Velqryon, Mosskip, Critter Atlas, entre outros.
- A auditoria automatizada está em `tools/audit-ip-safe-names.mjs`; documentação em [IP_AUDIT_V76_1.md](docs/IP_AUDIT_V76_1.md).
- **Não existe garantia de clearance jurídico**: fontes históricas, semelhança visual, marcas, screenshots e direitos de terceiros necessitam de avaliação antes da publicação comercial.

## V76.2 — additional original names and art audit

- 154 additional curated media name aliases. Preserve ordinary terminology outside the entertainment context (e.g. technical valve or astronomical halo).
- Static structural screening of every active organic SVG map and the semantic gameverse SVG atlas via `tools/audit-active-artwork.mjs`.
- Automated audit reports names that have **not** been fictionalized as an editorial review queue. A static PASS **does not** imply a rights clearance or review of visual likeness.
- Read [IP_AUDIT_V76_2.md](docs/IP_AUDIT_V76_2.md) before any commercial release.

V76.3: nomes fictícios anteriormente coincidentes com empresas reais foram substituídos; ver a documentação de risco V76.2. IDs e receitas mantidos.
