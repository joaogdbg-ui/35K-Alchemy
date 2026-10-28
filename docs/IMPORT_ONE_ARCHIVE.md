# One-file V68 GitHub import — no manual extraction

Use the tested source file **`35K_Alchemy_V68_GitHub_Import.tar.xz`** (about 8.7 MB) from the ChatGPT V68 migration response.

1. On GitHub, open [35K-Alchemy](https://github.com/joaogdbg-ui/35K-Alchemy).
2. Select **Add file → Upload files**. Upload the original `.tar.xz` (not the 52 MB original V68 ZIP); **Commit directly to main**.
3. Open [Actions](https://github.com/joaogdbg-ui/35K-Alchemy/actions), select **Import full V68 source and build APK**, and click **Run workflow** on `main`.
4. The workflow checks the archive SHA-256, extracts V68 source + 2,963 files, removes the archive, commits the project to GitHub, runs Node tests and the standalone build, then builds a Capacitor Android debug APK.
5. On success, download the artifact **35K-Alchemy-V68-debug-APK** from the workflow run; unzip the artifact and install `app-debug.apk` on Android.
6. For later builds use the separate **Build Android debug APK** action.

Pinned SHA-256:
```
24f348a349d0b5b8f26ebf99f12662bf17163e57cb6866287c2d35572c425c92
```

Do not upload the historical full V68 project ZIP and do not upload a random renamed archive; the checksum is deliberate.

## Boundaries

- Tested: 252 Node tests, V68 HTML rebuilt byte-for-byte from staged source, V68 art audit.
- Not yet tested: successful remote GitHub Actions/Gradle Android build, in-device behavior, old browser save migration, native AdMob callbacks, UMP, SSV.
- Current config uses provisional app ID `com.joaogdbg.alchemy35k`. Confirm before publishing.
- The repository is **public**, so imported sources and SVGs will be visible. Review IP and marketing assets before release.
- Android-rewarded-ad Kotlin reference sits in `native-reference/rewarded-ads/` to prevent conflicts with `npx cap add android`. It is **not automatically installed**.
