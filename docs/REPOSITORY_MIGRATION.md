# Migração integral para GitHub

O repositório recebeu a documentação de regras, configuração Capacitor e workflow APK. O código-fonte V67 com milhares de SVGs, arquivos shared, ferramentas e fixtures históricas **ainda precisa de upload**.

Foi preparado o arquivo **35K_Alchemy_GitHub_Import.zip**, que inclui todo esse conteúdo, um `IMPORT_TO_GITHUB.sh` e verificações já executadas localmente.

## Com computador que tenha Git e permissão de escrita

1. Descomprimir o ZIP.
2. Executar `bash IMPORT_TO_GITHUB.sh` na pasta extraída (pode exigir login GitHub).
3. Confirmar que `client/src/app.js`, `client/assets/`, `shared/` e `tools/build-standalone.py` surgem no repositório.
4. No GitHub → Actions → **Build Android debug APK** → Run workflow. Descarregar o artefacto APK depois da execução bem-sucedida.

Não apagar as fixtures HTML antigas por enquanto: alguns testes de regressão dependem delas.

O APK debug não deve ser confundido com AAB release assinado para a Play Store. Não colocar keystore, tokens ou credenciais no Git.
