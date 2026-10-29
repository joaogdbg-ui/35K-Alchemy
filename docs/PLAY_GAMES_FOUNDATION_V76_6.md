# V76.6 — Settings and Google Play Games foundations

Settings now has Profile, Game, Appearance tabs, accessible tab controls, compact scrollable panels, real offline discovery stats, and dark-mode support. Manual import/export are not visible in the menu; historical backup functions and save keys remain in the source for compatibility.

## Current capabilities
The standalone game and debug APK remain offline. The UI explicitly displays "Not connected" for Google Play Games, "Not active" for Saved Games, and disables "Recover from cloud" and "View leaderboards". Do not assert cloud uploads or restore. Native bridge optional identifier: AlchemyPlayerServices.getStatus() => {authenticated:boolean, playerId?:string, displayName?:string}. A browser cannot impersonate a native bridge, and only authenticated=true with a real playerId changes the profile label. No Google tokens or player account identifiers are written into localStorage.

## Integration required
1. Google Play Console Play Games Services project ID, signing fingerprint/OAuth, tester accounts, Android v2 SDK initialization, and verified game profile. Play Games platform identity is distinct from a separate in-game account.
2. Native Android SnapshotsClient with Saved Games enabled in Play Console: versioned snapshots, writing/reading, conflict resolution, checksum, authentication, offline fallback; preserve classic, family profiles, favorites, recipe history, and pending ad-merge credits. Never overwrite local data on failed network/empty cloud.
3. After native integration passes QA, enable explicit "Recover from cloud" with confirmation and local rollback copy, then add automatic sync. Before that, **do not uninstall an app containing unsynced progress without making a backup**.
4. Native leaderboards configured in Play Console with score definitions, proper player account authentication and anti-cheat. Real leaderboards/achievements only, never fabricated rankings or percentages.

Official docs:
- https://developer.android.com/games/pgs/platform-authentication
- https://developer.android.com/games/pgs/android/saved-games
- https://developer.android.com/games/pgs/android/leaderboards
- https://developer.android.com/games/pgs/console/enable-features
