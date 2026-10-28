# 35K Alchemy

Repositório oficial do projeto 35K Alchemy.

**Estado da migração:** as instruções e a configuração Android foram publicadas. O pacote integral V67 (jogo + milhares de SVGs + testes) ainda precisa de ser importado para esta branch; o simples facto de este README existir **não significa** que o jogo completo já esteja no GitHub.

## Base verificada

- V67: **5.162 elementos**, **13.499 receitas**.
- Localmente: **248/248 testes Node** e reconstrução HTML validada.
- Código: `client/`, `shared/`, `tools/` e `docs/`.
- Android: Capacitor 8; API 36, JDK 21 e Node 22.
- APK debug via GitHub Actions **depois** de importar as fontes.

## Importar o projeto

Descarregar o pacote «35K Alchemy Repository Import» entregue nesta conversa, descompactar e usar `IMPORT_TO_GITHUB.sh` num computador com Git e acesso de escrita a este repositório. O script clona esta branch e adiciona todo o código sem sobrescrever o histórico remoto.

## Regras

Ler [regras de trabalho](docs/WORKING_RULES_PT.md), [migração Android](docs/ANDROID_BUILD.md) e [instruções de agentes](AGENTS.md).

**AdMob:** o jogo HTML não pode inventar anúncios nem conceder recompensas. SDK Android real, consentimento UMP e validação de recompensas ainda estão pendentes.
