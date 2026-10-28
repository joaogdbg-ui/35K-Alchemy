# 35K Alchemy — V68 (source migration + Android)

Official repository for **35K Alchemy**.

**Migration status:** The Android build configuration and the one-archive V68 import workflow are ready. The **full V68 sources are not in this branch until the one-archive import workflow succeeds**. Do not mistake scaffolding for a successful migration.

## Verified V68 source

- 5,172 distinct elements and 13,509 fixed unordered recipes.
- 252/252 Node tests passed on the V68 source archive.
- Original standalone HTML was reproduced byte-for-byte after importing the archive locally.
- Full source includes `client/`, `shared/`, `tools/`, `docs/`, asset history, test fixtures and reference plugin code in `native-reference/`.
- Capacitor 8, Android API 36, Node 22 and JDK 21 prepare a **debug APK** in GitHub Actions; native build has **not** been verified until Actions passes.

## Complete the import from your phone or computer

1. Download `35K_Alchemy_V68_GitHub_Import.tar.xz` from the V68 migration handoff in ChatGPT.
2. In this repository, choose **Add file → Upload files**, select the archive, and **Commit directly to `main`**. Do not extract the archive on GitHub manually.
3. Open **Actions → Import full V68 source and build APK → Run workflow**.
4. After a successful run, open that workflow run and download the `35K-Alchemy-V68-debug-APK` artifact.
5. For future builds after import, use **Actions → Build Android debug APK**. No further archive uploads are needed.

Read [the import guide](docs/IMPORT_ONE_ARCHIVE.md), [Android packaging](docs/ANDROID_BUILD.md) and [permanent rules](docs/WORKING_RULES_PT.md).

**Important:** The repository is public; source code and assets become public after import. A debug APK is for testing, not a signed Play Store release AAB. The rewarded-ad bridge, UMP consent and SSV are **not integrated**; the offline build must never simulate ad rewards.
