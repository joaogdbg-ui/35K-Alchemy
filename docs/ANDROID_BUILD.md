# Android — V68 debug APK pipeline

**State:** Source archive verified locally and Capacitor CI configured; no Android APK is claimed until the GitHub Actions build completes.

**Prerequisites in CI:** Node 22, Python 3.12, Java 21, Android SDK API 36, Capacitor 8. App ID is provisional: `com.joaogdbg.alchemy35k`. Capacitor 8 targets Android API 36.

## First run

Use [V68 single archive import](IMPORT_ONE_ARCHIVE.md). That workflow imports and commits the source, then builds the first debug APK.

## Later debug builds

From **Actions → Build Android debug APK → Run workflow**. Conceptually, the pipeline runs:

```bash
npm install
npm test
npm run web:build
npx cap add android
npx cap sync android
cd android && ./gradlew --no-daemon assembleDebug
```

Successful result: `android/app/build/outputs/apk/debug/app-debug.apk`, uploaded as a GitHub Actions artifact.

Generated folders `android/` and `www/` are ignored; Capacitor recreates Android from scratch for CI. The Kotlin rewarded-ad prototype is stored under `native-reference/rewarded-ads/`, **not** the generated project.

## Release blockers

- Android build and physical-device QA, particularly 35 px icon legibility, offline startup, memory/performance, family merges and orientation.
- An existing browser/file-based save does **not automatically move** to Capacitor WebView storage; implement and test explicit backup/import.
- Rewarded adverts: native AdMob SDK, UMP consent, verified reward callbacks and preferably server-side verification; no fake reward success.
- Permanent signing keystore saved privately, release AAB and Play Console compliance.
- IP/name/rights review; check privacy disclosures and app content.
- Do not distribute an unsigned or debug APK as a release build.

Official docs: https://capacitorjs.com/docs/getting-started ; https://capacitorjs.com/docs/android ; https://capacitorjs.com/docs/updating/8-0
