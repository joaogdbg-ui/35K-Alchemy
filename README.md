# 35K Alchemy — V76.2 (expanded IP editorial audit)

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
- Nomes apresentados ao jogador passaram para alternativas editoriais fictícias: Qelvorune, GlidePort, AsterCube, PocketNova, Orilux, Mosskip, Critter Atlas, entre outros.
- A auditoria automatizada está em `tools/audit-ip-safe-names.mjs`; documentação em [IP_AUDIT_V76_1.md](docs/IP_AUDIT_V76_1.md).
- **Não existe garantia de clearance jurídico**: fontes históricas, semelhança visual, marcas, screenshots e direitos de terceiros necessitam de avaliação antes da publicação comercial.

## V76.2 — additional original names and art audit

- 154 additional curated media name aliases. Preserve ordinary terminology outside the entertainment context (e.g. technical valve or astronomical halo).
- Static structural screening of every active organic SVG map and the semantic gameverse SVG atlas via `tools/audit-active-artwork.mjs`.
- Automated audit reports names that have **not** been fictionalized as an editorial review queue. A static PASS **does not** imply a rights clearance or review of visual likeness.
- Read [IP_AUDIT_V76_2.md](docs/IP_AUDIT_V76_2.md) before any commercial release.
