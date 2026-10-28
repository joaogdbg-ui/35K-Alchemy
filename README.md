# 35K Alchemy — V68

Repositório oficial do jogo **35K Alchemy**, incluindo o código-fonte completo da V68 e o pipeline Android.

## Estado verificado — 28 de outubro de 2026

- **Migração GitHub concluída**: fontes, SVGs, testes, documentação e histórico de arte foram importados no commit [2159fa9](https://github.com/joaogdbg-ui/35K-Alchemy/commit/2159fa9f5f62f9065e595227748035a6afccb79b).
- **5.172 elementos**, **13.509 receitas** globalmente determinísticas.
- **252 testes Node aprovados** na compilação Android.
- **HTML V68, validadores de catálogo e auditorias de arte aprovados**.
- **APK debug Android compilado com sucesso** pelo GitHub Actions em [Build Android debug APK #1](https://github.com/joaogdbg-ui/35K-Alchemy/actions/runs/40782252239), em 28/10/2026.
- Artefacto: **35K-Alchemy-V68-debug-APK**, disponível no separador **Artifacts** da execução até 11/11/2026. O ficheiro ZIP contém `app-debug.apk`.

## Construir novos APKs

Em [GitHub Actions](https://github.com/joaogdbg-ui/35K-Alchemy/actions), selecionar **Build Android debug APK → Run workflow**. O workflow usa Node 22, Python 3.12 (com dependências de auditoria), JDK 21, Android API 36 e Capacitor 8. Compila e valida o projeto a partir do código atual da branch `main`.

A importação V68 por arquivo foi **executada e concluída**. **Não é necessário voltar a carregar o arquivo** nem executar `Import full V68 source and build APK`. Este workflow inicial serviu apenas para importar o projeto.

## Limites antes de lançamento comercial

O APK produzido é **debug para testes**: ainda não foi testado num aparelho Android real. AdMob recompensado, UMP, validação das recompensas (SSV), migração de saves existentes, assinatura release e AAB Google Play continuam por implementar e validar. O HTML offline não pode simular anúncios nem conceder recompensas fictícias.

Ler [regras permanentes](docs/WORKING_RULES_PT.md), [guia Android](docs/ANDROID_BUILD.md) e [instruções de desenvolvimento](AGENTS.md).

Este repositório é público: fontes e assets ficam acessíveis aos visitantes.
