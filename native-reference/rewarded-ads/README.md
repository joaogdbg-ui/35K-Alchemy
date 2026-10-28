# 35K Alchemy V33 — Rewarded recipe hints

No clue credits exist in V33. Each new hint requires a successfully completed rewarded ad in the installed Android app, after which both ingredients of one recipe are revealed.

The standalone HTML cannot display a genuine Android rewarded ad; it shows an explanatory message and gives no reward. The existing `GameverseRewardedAdsPlugin.kt` is an illustrative Capacitor adapter, not automatically packaged into an APK. To activate, install and initialize the Google Mobile Ads SDK and required UMP consent flow, configure the application ID, register the plugin and build a native Android shell. Use Google's rewarded **test unit** during development; replace it with your own configured ad unit for release.

Only an SDK reward callback may return `{earned:true}`. Dismissal, failure and cancellation must never unlock a recipe. On Android, check privacy disclosures, age settings and store policies. Review current official docs: https://developers.google.com/admob/android/rewarded

## V60: Family Only -> Classic merge (two separate rewarded ads)

The V60 Discoveries screen now offers **Merge Elements into Classic** while a Family Only campaign is active. It freezes the eligible set of actually unlocked family discoveries at the start and requires **two separately opted-in rewarded ads** (`showRewarded({kind:'merge_to_classic',step:1|2,total:2,elementCount:N})`) before copying this set to the independent Classic save. Only `earned === true` from the registered Android native reward callback counts. There is no browser-side grant or timeout fallback. If the second ad is unavailable/cancelled, 1/2 remains in the local `35k_family_merge_pending_v60` save and can be resumed; an ad that was rejected does not count. The player taps independently for each ad; the second is never auto-launched.

**Production security:** This bridge is STILL a reference Kotlin adapter and requires registration in a real Capacitor app, AdMob setup, consent/UMP, actual test-ad validation, and release keys/ad unit. Locally persisted credit is susceptible to device tampering. Before monetization, implement server-side verification (SSV) of the two unique ad events/transaction IDs and a server-authorized transfer ledger if the in-game reward must be tamper resistant. Do not accept repeated reward events for the same transaction. No third-party ads have been delivered/tested in the standalone build.

**Policy/UX:** Clearly disclose the entire two-ad requirement before the first ad, let the user opt in separately to each, do not conceal dismiss buttons, and keep ordinary play available when ads cannot be served. Review the latest Play/AdMob reward policies and age/consent compliance before shipping. Official docs: https://support.google.com/admanager/answer/7496282 and https://developers.google.com/admob/android/ssv.
