# 35K Alchemy — V69

Repositório oficial do jogo **35K Alchemy**, incluindo o código-fonte completo da V69 e o pipeline Android.

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
