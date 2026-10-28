# Importação completa num ficheiro (V67)

A estrutura inicial, regras e workflows já estão publicados. Para transferir **o jogo completo** sem carregar milhares de SVGs, usar o arquivo `35K_Alchemy_GitHub_Source_V67.tar.xz` fornecido no ChatGPT.

1. Abrir a raiz do [repositório](https://github.com/joaogdbg-ui/35K-Alchemy), selecionar **Add file → Upload files**, escolher o arquivo `.tar.xz`, criar commit em `main`.
2. Abrir **Actions → Import full V67 source and build APK → Run workflow**.
3. A ação verifica o SHA-256, importa fontes e recursos, remove o arquivo da branch, preserva `.git`, executa testes, constrói HTML e tenta gerar um **APK debug**.
4. Se a construção for concluída, abrir a execução e descarregar o artefacto **35K-Alchemy-V67-debug-APK**.

SHA-256 esperado:
`5633f9b127a08f6c1f8f35f76fad1241ab1952832f1702ce9f1e468885362421`

**Avisos:** se o upload pelo browser exceder a quota permitida, usar Git CLI e `IMPORT_TO_GITHUB.sh` do pacote ZIP alternativo. A compilação Android/Gradle ainda não foi executada em runner GitHub nesta data; por isso, não há garantia de APK até o workflow passar. Este é um **APK de testes**, não AAB release assinado. Integração real de AdMob/UMP e SSV continua pendente.

Repositório é público; a importação também torna os fontes e recursos visíveis publicamente. Rever direitos e marcas antes de distribuição comercial.
