# Android — V68 debug APK pipeline

**State:** Source archive verified locally and Capacitor CI configured; no Android APK is claimed until the GitHub Actions build completes.

**Prerequisites in CI:** Node 22, Python 3.12, Java 21, Android SDK API 36, Capacitor 8. App ID is provisional: `com.joaogdbg.alchemy35k`. Capacitor 8 targets Android API 36.

## First run

Use [V68 single archive import](IMPORT_ONE_ARCHIVE.md). That workflow imports and commits the source, then builds the first debug APK.

## Later debug builds

From **Actions → Build 35K Alchemy APK → Run workflow**. Conceptually, the pipeline runs:

```bash
npm install
npm test
npm run web:build
npx cap add android
npx cap sync android
cd android && ./gradlew --no-daemon assembleDebug
```

Gradle internally produces `android/app/build/outputs/apk/debug/app-debug.apk` but the workflow verifies its signature, copies it to `dist/35K-Alchemy.apk` and publishes that exact filename at:

- https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest
- https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

The filename is stable for every version. The Android `versionCode` increases with each GitHub Actions run, and `versionName` includes the package.json version.

## Project-specific test signing

The project uses a **dedicated reusable test-only certificate**; it is not the Virtual Spectre signing certificate. Test certificate SHA-256:

```
B4:58:9E:5E:A8:9D:7B:0D:38:97:08:AA:F6:3D:D2:B3:88:B9:36:5F:0B:66:D2:AA:7C:BC:E4:00:47:DA:D5:2A
```

The build extracts the committed `ci/signing/35k-alchemy-debug-keystore.b64` into the runner's standard debug keystore path, and rejects the APK if its signer SHA-256 differs. This key is deliberately **public and only suitable for internal testing**. Anyone with access to the public repository can use it; it is **not a secure release key**.

For a real Google Play release, generate a **new private signing key**, store it in GitHub Actions Secrets or another secure signing service, and produce a properly signed release AAB. Never commit the production key. If the previous `app-debug.apk` was installed, its old per-runner signature may differ; back up any saved progress before uninstalling it for the new Alchemy-signed build.

Generated folders `android/` and `www/` are ignored; Capacitor recreates Android from scratch for CI. The Kotlin rewarded-ad prototype is stored under `native-reference/rewarded-ads/`, **not** the generated project.

## Release blockers

- Android build and physical-device QA, particularly 35 px icon legibility, offline startup, memory/performance, family merges and orientation.
- An existing browser/file-based save does **not automatically move** to Capacitor WebView storage; implement and test explicit backup/import.
- Rewarded adverts: native AdMob SDK, UMP consent, verified reward callbacks and preferably server-side verification; no fake reward success.
- Permanent signing keystore saved privately, release AAB and Play Console compliance.
- IP/name/rights review; check privacy disclosures and app content.
- Do not distribute an unsigned or debug APK as a release build.

Official docs: https://capacitorjs.com/docs/getting-started ; https://capacitorjs.com/docs/android ; https://capacitorjs.com/docs/updating/8-0


## Android 16/17 status-bar overlap (Capacitor 8 / API 36)

On 28 October 2026, the first physical Android screenshot showed the Android
notification icons drawn over the game's header and blocking its buttons.
This was an edge-to-edge window-insets bug, not a catalog or gameplay issue.

The Android build now:
- Declares `plugins.SystemBars.insetsHandling = "css"` and
  `initialViewportFitValueHint = "cover"` in `capacitor.config.json`.
- Uses the injected `--safe-area-inset-*` variables (with standard CSS
  `env(safe-area-inset-*)` fallback) to pad the app's top and side edges,
  while preserving bottom safe-area spacing in the navigation bar.
- Runs `python tools/configure-android-edge-to-edge.py` **after** generating
  the Capacitor project. Android 11+ calls `EdgeToEdge.enable(this)`;
  older Android versions keep the default window layout.
- Syncs the system status/navigation icon color when the user switches
  between Light, Dark and System themes.
- Adds `client/test/android-system-bars.test.mjs` regression checks.
- Retains the app ID, dedicated stable test signature, versionCode progression
  and the `35K-Alchemy.apk` GitHub Release filename.

Do not use `StatusBar.overlaysWebView = false` as a fix: it cannot opt out
of mandatory edge-to-edge for Android API 36. Avoid hardcoded 24/32/48px
status-bar offsets, because they break under display cutouts, font scaling,
landscape or newer WebView versions.

**Device QA still required:** install the newest GitHub Release APK, check
the main header no longer touches the system clock/notifications, tap Settings
and Classic, switch Light/Dark, test portrait/landscape where applicable,
scroll the inventory, use search/keyboard and confirm bottom navigation is
never obscured. Passing CI proves compilation, not physical screen geometry.



## Modo imersivo fullscreen — Android 16/17

O 35K Alchemy abre **sem a barra de estado nem a barra de navegação
permanentes**. A configuração do Capacitor 8 usa
`plugins.SystemBars.hidden = true` e mantém
`insetsHandling = "css"` para proteger o conteúdo contra o recorte
da câmara e ajustar a interface nos aparelhos diferentes.

A atividade nativa criada por `tools/configure-android-edge-to-edge.py`
usa `WindowInsetsController` em Android 11+ e o modo immersive-sticky
nas versões anteriores. As barras do Android podem ser reveladas
**temporariamente ao deslizar a partir da margem superior/inferior**;
não removemos os gestos de sistema nem bloqueamos a saída da aplicação.
Após regressar ao jogo, a interface volta ao ecrã imersivo.

Os testes em `client/test/android-system-bars.test.mjs` verificam esta
configuração. A confirmação da ergonomia (gestos, notch/câmara, teclado,
botões Settings e Classic, barra inferior e alteração de tema) requer
teste no telefone. No modo janela/multijanela, o Android pode impor
controlos do sistema.

Esta configuração **substitui**, sem eliminar, a correção anterior de
safe-area que evitava a sobreposição da barra de estado. A assinatura
exclusiva do Alchemy e o ficheiro `35K-Alchemy.apk` mantêm-se.

## Rewarded ads — Google TEST ads packaged (V83, 30 October 2026)

The APK now contains a real Google Mobile Ads SDK integration (`play-services-ads` 25.5.0 + UMP 3.2.0):

- Source: `native/android/GameverseRewardedAdsPlugin.java` (Capacitor plugin `GameverseRewardedAds`).
- CI step `python tools/configure-android-admob.py` (after the edge-to-edge patch) copies the plugin into the generated app, adds the Gradle dependencies, writes the AdMob `APPLICATION_ID` meta-data and registers the plugin in `MainActivity` before `super.onCreate`.
- IDs are Google's public **test** IDs (app `ca-app-pub-3940256099942544~3347511713`, rewarded unit `ca-app-pub-3940256099942544/5224354917`). Ads show the "Test Ad" label and earn nothing.
- `showRewarded()` resolves `{earned:true}` only when the SDK reward listener fired, after the ad closes; load failure (15 s timeout), dismissal and show failure never reward. Ads are preloaded after each show.
- UMP consent runs at startup; Settings → Privacy & ads shows status and opens the UMP privacy options form.
- Placements (JS, unchanged contract): recipe hint, batch combine per family, Classic ↔ Families mode switch (first choice free), and two-ad Merge into Classic.

**Before a Play release:** create the AdMob app and rewarded unit, replace both test IDs, configure the GDPR message in AdMob Privacy & messaging, consider SSV for Merge, decide the target audience (Families policy), and use a private release signing key.
