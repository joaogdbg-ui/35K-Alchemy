# 35K Alchemy — Handoff V70 (28 October 2026)

## State
- Full project migrated to GitHub, Capacitor 8, Android API 36. Release `latest` publishes `35K-Alchemy.apk`.
- V70 keeps **5,172 unique elements / 13,509 globally deterministic recipes**. No new elements, new recipes, ID changes, save-key changes, campaign independence or ad reward changes.
- V69 completed 76 original legacy SVG redraws. This V70 completed the **final 14** genuine remaining V61 `motif-composite` illustrations. **Zero from the *identified V61 motif backlog* remain**. This is not a full semantic audit of all 5,172 icons.
- Newly finished: Floating Reed Bed; Riverbank Beetle; Coastal Dune Wildflower; Rainforest Mist Basin; Mangrove Bird Perch; Underwater Reef Shelter; Sandbar Fish Nursery; Forest Stream Fish Pool; Butterfly Meadow Window; Firefly Garden Lantern; Mossy Cave Pool; Heron Wetland Nest; Pine Forest Birdsong; Fox Woodland Track.
- Individual SVG files in `client/assets/v70/redrawn-v61/`; runtime values in `client/src/organic-art-v70.js`; hashes and original IDs in `shared/v70-approved.json`.
- `tools/validate-v70.mjs` enforces exactly 14 outstanding IDs, zero missing, 14 distinct hashes, immutable totals, runtime art priority. `tools/audit-v70-art.py` generates contact sheets at 100px light and *actual* 35px dark.
- V70 Android layout: immersive top status inset is capped to ~8–14px *only for detected native Android*, not web, to correct the excess blank strip shown in screenshot; mobile crafting workspace height was reduced to 176–190px to expose more inventory while preserving touch controls. Physical device QA is still necessary.
- Locally tested: **258/258 Node tests**, `node tools/validate-v70.mjs`, art audit and full standalone build PASS. GitHub V70 import CI also passed. The separate Android APK workflow must be green before claiming final release.

## Rules to preserve
1. Global recipe identity A+B=C equals B+A=C in all modes, never conflicting outputs.
2. No recycled IDs/names/recipe pairs; four starters free and family progression independent.
3. Rewards always require real Android SDK earned reward; offline HTML never fakes ads or credits.
4. Every newly added item receives its **own original subject-specific 100x100 SVG**, not templated motif composites or hash-based collages. Must pass review at 35px light/dark.
5. Human art approval cannot be automated; pHash detects obvious repetition but does not establish recognizability.
6. Releases retain the unique Alchemy debug-test signing certificate and the fixed `35K-Alchemy.apk` URL; never use Virtual Spectre signing key.
7. Continue increasing version numbers and regression tests; maintain updated handoff on each release.

## Next: V71 plan — up to 200 new elements per batch
- Resume expansion only after checking V70 on Android.
- Select approximately 200 genuinely distinct, semantically useful and humorous discoveries, distributed across thematic families and multiple recipe depths.
- Each has an organic, intuitive recipe and an original SVG individually reviewed at 35px. Prefer fewer approved elements to filler, generic art or duplicated outcomes.
- Validate global reachability from Classic starters, standalone reachability per Family Only campaign, deterministic recipe graph, cross-family shared IDs and progress migration.
- Produce grouped full-size and 35px light/dark contact sheets, SHA manifest, QA report and HTML / signed Android build.
