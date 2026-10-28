# Android — preparação para APK

**Estado:** Capacitor 8 configurado, mas o SDK Android, o plugin de AdMob e o APK **ainda não foram compilados neste ambiente**. O pipeline só funciona depois de importar o jogo completo.

- Node 22+, Python 3, Java 21 e Android SDK API 36.
- Identificador provisório: `com.joaogdbg.alchemy35k` — confirmar **antes de publicar**.
- Capacitor 8 suporta target SDK 36, necessário para novas apps submetidas à Google Play em outubro de 2026.

## Compilação após importar a fonte

```bash
npm install
npm test
npm run web:build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

O APK debug fica normalmente em `android/app/build/outputs/apk/debug/app-debug.apk`. O workflow do GitHub Actions pode fazê-lo num runner com SDK. **Debug APK não é AAB assinado para Google Play.**

## Antes de lançar

- Implementar AdMob recompensado real, consentimento UMP e idealmente SSV para recompensas; sem simulação em produção.
- Rever o adaptador Kotlin de referência e alinhar o namespace do plugin com o appId.
- Confirmar persitência: `content://` do navegador e a origem do WebView Capacitor têm armazenamento diferente; importar saves explicitamente.
- Criar chave de assinatura e protegê-la em segredos, gerar release AAB, testar em Android físico e testar políticas Google Play.
- Auditar a propriedade intelectual de nomes, personagens, marcas e imagens.

Fontes: https://capacitorjs.com/docs/getting-started ; https://capacitorjs.com/docs/android ; https://support.google.com/googleplay/android-developer/answer/11926878
