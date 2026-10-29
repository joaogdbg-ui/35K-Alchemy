# 35K Alchemy — V76 / first original-gaming subbatch toward next 200

## Status

- **V75 baseline:** 5,372 elements and 13,709 deterministic unordered recipes.
- **V76:** +50 newly curated objects, each with its own individually authored 100x100 SVG and intuitive recipe.
- **New target after validation:** 5,422 elements and 13,759 recipes.
- **Current 200-item cycle:** 50/200 delivered, 150 still pending. Do not claim a 200-item delivery.
- Main families: console equipment, retro preservation, portable accessories, arcade controls, art tooling and electronic diagnostics.
- 5 editorial art groups of ten items each, `client/src/organic-art-v76-a.js` through `-e.js`.
- `shared/v76-approved.json` maps each concept's ID, pair, and SVG source to its production record. Historical pair collisions were resolved by changing new recipes, never old outcomes.

## Art and regression invariants

- The user has approved a pastel graphic identity but refuses hashed generic motif collages; each icon is a bespoke meaningful silhouette, legible around 35 px.
- `docs/V76_ART_REVIEW.md` displays all 50 actual SVGs at 35 px and 90 px. Automated XML/hash/source checks are not a substitute for human visual approval on the Android device.
- `tools/validate-v76.mjs` confirms all previous formulas unchanged, IDs/names/pairs new, all items reachable, unique SVG hashes and exact embed/source parity.
- `tools/audit-v76-art.py` validates source SVG structure.
- `client/test/v76-expansion.test.mjs` protects V76 integration.
- Same Android app ID, fullscreen behavior, Alchemy signing identity, saved game compatibility, Classics/Families Only independent progression and rewarded merge/hint semantics.
- The inventory scroll position remains anchored across discoveries. The extra space is above the combining slots, not below.

## Next steps

Work through the remaining **150** with three independently reviewed ~50-item groups before considering a complete 200-item cycle. Prioritize cross-family, recognizable games, console history, technology and science while avoiding forced equipment variants purely to hit quotas. Ship a complete 200 pack only when artistic audits and regression tests prove ready.

Android APK (stable): https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
Latest release: https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest

## V76.1 fictional-equipment migration

39 of the 50 V76 item titles previously contained product or manufacturer brand references. The source item labels, five active illustration maps, approved manifest, five batch manifests and 39 SVG filenames now use distinct mock-world identities. All immutable IDs and original recipe input/output triples remain unchanged. The illustrations themselves remain custom art and require a separate human trade-dress review.

## V76.2 — second pass of copyright/trademark risk reduction

154 additional genre-aware game/media title aliases; avoid replacing ordinary technology, astronomy, science or mythology terminology. Audit all active original SVG maps for structural hazards, and log the remaining historical media titles requiring human editorial review. No element IDs, recipe outcomes or current V76 art illustrations change. Version 0.76.2; original baseline 5,422 elements / 13,759 unordered recipes. Native rewarded monetisation and commercial IP/trade-dress clearance remain open.

## V76.3 — collision hotfix

Retired real-world-company collisions in proposed aliases (Kairosoft, AsterCube, Vextro, Orilux); synchronized seven SVG asset paths, V76 artwork keys and catalog manifests. Added regression tests. New candidate names still need formal trademark clearance. No recipe or element ID changes.

## V76.6 Settings/Profile

Settings is a compact three-tab view (Profile/Game/Appearance) with local stats and Google Play Games/cloud/leaderboard placeholders correctly marked unconfigured. Manual import/export buttons are removed from the UI, but backup routines and old save keys remain for migration. No fake account, sync, restore or leaderboard claims. A future native Android-only AlchemyPlayerServices.getStatus() may show an authenticated Play Games gamer identity. See docs/PLAY_GAMES_FOUNDATION_V76_6.md.

## V76.7 — Casual-game Settings redesign

Replaced the admin-like Settings view with a game-first **Game | Profile | Help** tabbed sheet (Game is default). Sound and Light/Dark/Auto appearance are the only core preference controls; game mode stays accessible. Profile retains local statistics and future Google Play Games, leaderboards and cloud recovery placeholders without suggesting that cloud sync already exists. Help has three tappable/keyboard-accessible native FAQ disclosures and an About panel. Removed the duplicate hint shortcut from Settings; hints remain in the Play combiner. Original backup code/save keys are intact; no import/export options in Settings. All UI works offline, no fake Google login. Test across 320/360/390 width and short Android screens; style and dark-mode regression automated; physical QA still required.

## V76.8 — genuine minimal Settings refactor

Replaced the three-tab admin/menu design with a concise Settings overview: Sound (working On/Off button), Theme (Light/Dark/Auto), Game mode, Profile & cloud, Help & about. Only active gameplay settings and two secondary links are visible by default. Profile and Help use the same modal with a Back button (no horizontal tabs), remain local/offline honest and preserve future native Play Games read-only seam and disabled cloud/leaderboards. The Hint action stays at Play; no import/export buttons in Settings. Restoring progress from cloud remains disabled until a real Google Saved Games integration is configured. All local save keys, internal legacy backup functions, catalog IDs and recipes are unchanged. Full docs: docs/SETTINGS_V76_8.md.
