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
