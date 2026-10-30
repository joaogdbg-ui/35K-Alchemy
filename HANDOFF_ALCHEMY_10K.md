# Alchemy 10K — V82 candidate handoff (29 October 2026)

## Branch, goal and release truth
- Development branch: `feature/alchemy-10k-mythology-prehistory`.
- V81 baseline on main: SHA `2aba8395f48082964bc2af2ff20a468c56dd464b`, **5,812 original elements and 14,149 recipes**.
- V82 authored candidate: **+200 permanent IDs and +200 new unordered global recipes**, giving **6,012 elements / 14,349 recipes** when passed and merged. This is the FIRST of 21 planned +200 expansions from V81; after V82 the goal of >=10,000 needs 20 more complete deliveries.
- V82 catalog mix: **93 mythology and 107 prehistory items**, all with exact source SVG files, entries in `client/src/organic-art-v82.js`, unique primary recipes and explicit familyCampaigns metadata.
- Manifest `shared/v82-approved.json`: `expansion_progress=200`, `remaining_to_goal=0`, `cycle_complete=true`, `status=QA_PENDING_UNMERGED`. **Not published, not merged, no V82 APK**.
- Rebranding: public `Alchemy 10K` display title, but original Android `appId=com.joaogdbg.alchemy35k` and legacy save keys intentionally retained.

## Content and quality details
- Greek, Roman, Norse and Egyptian mythologies: pantheons, public-domain deities and original interpretations of ancient creatures, places and artifacts.
- Dinosaur families: theropods, sauropods, armored, ceratopsians, hadrosaurs; also pterosaurs, marine reptiles, Paleozoic life and Ice Age mammals.
- 120 individually composed original illustrations; 80 species-parameterized anatomical SVGs (renderer: `tools/v82-fauna-renderer.js`), each with distinct vector source and morphological input.
- `Hades the God` is distinct from prior `legacy:941` Hades game. `Fossilized Dinosaur Egg` is distinct from `pack:dinosaur-egg`, a franchise prop. Internal new IDs remain immutable `organic82:hades` and `organic82:dinosaur-egg`.
- Every SVG is independently stored at `client/assets/v82/<id-suffix>.svg`; the [full 200-item thumbnail contact sheet](docs/V82_ART_REVIEW.md) renders 35px and 90px views for human/device art review.
- Primary recipes must be semantically sensible and globally unique. Confirm end-to-end before release: source-only static checks do not establish real gameplay quality.

## Four Family Only closures, checked directly from source
| Campaign | Reachable / total | Internal global-compatible recipes |
|---|---:|---:|
| Nature & Science | 476/476 | 1,781 |
| People & Culture | 211/211 | 266 |
| Mythology & Gods | 109/109 | 105 |
| Prehistory & Dinosaurs | 116/116 | 112 |

- All four use four starter IDs and are independently craftable according to source-derived recipe graph traversal. New mythology starts Human, History, Magic, Sky; new prehistory starts Animal, Stone, Life, History. Nature still has the historical defect that its starters coincide with Classic; address separately without silently changing progress.
- No new family-specific alternative A+B result. Earned multi-family IDs share one stable identity, Classic save/progress remains separate, free family starter IDs do not transfer as earned discoveries. Optional merge still requires 2 actual verified rewarded ads with saved 1/2 credit.

## Committed content and code
- `client/src/organic-pack-v82.js`, `client/src/organic-art-v82.js`, `client/assets/v82/*.svg`, `shared/v82-approved.json`.
- Authoring inputs: `tools/v82-greek-authoring.js`, `tools/v82-roman-authoring.js`, `tools/v82-norse-authoring.js`, `tools/v82-egypt-authoring.js`, `tools/v82-prehistory-foundations-authoring.js`, `tools/v82-fauna-dinosaurs.json`, `tools/v82-fauna-other.json`, `tools/v82-fauna-renderer.js`.
- App + offline integration: `client/src/app.js`, `tools/build-standalone.py`; active art scan includes V82.
- Gates: `tools/validate-v82.mjs`, `tools/audit-v82-art.py`, `client/test/v82-content.test.mjs`, historical V80/V81 regression updates, and `tools/check-content-batch-200.mjs` with specific original art modes `bespoke-subject` and `species-specific-anatomy`.
- Marketing/review: `docs/V82_ART_REVIEW.md`.

## Verified versus pending
**Done:** 200 committed candidate IDs and unique visual source files, four source-level isolated family traversals, no conflicting output found among inspected foundation/catalog subsets, preexisting name collisions resolved, old unchanged code kept in branch. Previous exact candidate name scans covered 46 historical catalog modules.

**Not done:** local complete repo checkout; full historical `node tools/validate-v82.mjs` execution; `npm test`; `python tools/audit-v82-art.py`; end-to-end HTML build; 35px physical Android light/dark visual review; CI; Android APK build and signing; full revenue/cloud/leaderboard integrations. Do not claim CI green or a released V82 APK.

## Combiner motion (V83 technical change, zero new elements)
- Three tile animations now run on fixed-position ghost tiles appended to `<body>`, never on the real slots: the slots are cleared the instant a pair resolves, so tapping the next ingredient is never delayed (`captureCraftScene` → `finishSlots` → `playCraftMotion` in `client/src/app.js`; CSS `.craft-ghost` in `client/src/styles.css`).
- No recipe: the right tile slides until it touches the left one, bounces back and fades out; no sound, toast or feedback line (unchanged rule).
- Already discovered: the right tile slides onto the left one, the result tile pops and floats up; the existing "Already discovered" feedback line is the only message.
- New discovery: the merged result tile floats up and morphs into the artwork of the discovery window while the window fades in; the window still closes only with X.
- V83.1: the discovery art is drawn at its final size over the window art and scaled up from the tile art, so it ends pixel-identical (no size snap, no blur).
- A new ingredient entering a slot dismisses only the ghost covering that slot; `prefers-reduced-motion` disables all of it. Durations total under 0.9 s for a new discovery and under 0.5 s otherwise.
- Checked locally in headless Chromium at 360×640, 390×820 and 1280×820 (light and dark, locked left, rapid consecutive pairs, no page errors) and with `npm test` (330/330, new `client/test/v83-combiner-motion.test.mjs`). Not yet checked on a physical Android device.

## Art redraw (2026 art direction, owner request 30 October 2026)
- Owner chose the V83 art direction for the whole game, replaced in waves, earliest-seen first. Mechanism: `client/src/art-redraw.js` (`ART_REDRAW`, keyed by stable element ID) is checked first in `staticArt()`; names, recipes and saves are unchanged.
- Sources: `tools/art-redraw-manifest.json` ({id, name, file, wave}) + `client/assets/redraw/*.svg` → `python tools/redraw-assemble.py`. Gates: `tools/validate-art-redraw.mjs` (in the build), `tools/audit-art-redraw.py` (perceptual pairs), `client/test/art-redraw.test.mjs`. Style kit + illustrator brief: `docs/ART_REDRAW_KIT.md`.
- **Wave 1 (done): 1,080 icons** — every element of Classic generations 0–5 plus all older Mythology & Gods and Prehistory & Dinosaurs members. **Wave 2 (done): 941 icons** — Classic generations 6–7. Total redrawn: 2,021. Remaining ≈3,990 older icons, in Classic generation order (gen 8: ~483, gen 9: ~393, gen 10: ~767, gen 11: ~646, gen 12+: ~1,900). Reviewed false-alarm pairs for the perceptual audit live in `tools/art-redraw-reviewed-pairs.json`, ~27 icons per illustrator batch with contact-sheet review.
 (+200, 30 October 2026)
- 100 Mythology & Gods + 100 Prehistory & Dinosaurs → **6,212 elements**; families Mythology & Gods 209/209 and Prehistory & Dinosaurs 216/216, independently completable.
- Sources: `tools/v83-blueprint.json` (names, recipes, summaries, witty lines, art briefs), `tools/v83-alt-recipes.json` (36 alternative in-family recipes), `client/assets/v83/*.svg`. Generated by `python tools/v83-assemble.py` → `client/src/organic-pack-v83.js`, `client/src/organic-art-v83.js`, `shared/v83-approved.json`.
- Gates: `tools/validate-v83.mjs`, `tools/audit-v83-art.py` (also perceptual near-duplicates vs V82), `client/test/v83-content.test.mjs`, `tools/check-content-batch-200.mjs`. Review: `docs/V83_ART_REVIEW.md`. Long-term plan: `docs/V83_MYTH_PREHISTORY_LONG_TERM_PLAN.md`.
- New items may carry `wit`; `wittyDiscovery()` falls back to it.
 (V83 technical change, zero new elements, 30 October 2026)
- Google rewarded TEST ads packaged in the APK (`native/android/GameverseRewardedAdsPlugin.java`, `tools/configure-android-admob.py`); Settings → Privacy & ads.
- Settings → Progress: Export backup (Android share sheet via `native/android/AlchemyBackupPlugin.java`, browser download, or copyable code), Import backup (file or pasted code), Delete progress (Classic / all Families Only / everything, double confirmation, settings kept).
- Discovery popups show the witty line or, failing that, the element's summary (4,421 elements have one).
- Sort sheet is now Sort & filter: Show All / To explore / Completed ★ / Saved, View Normal / Compact (3 columns at 390 px).
- Timed hint: one free recipe hint every 10 minutes only when no ad can be shown (owner decision; rule 7 in `docs/WORKING_RULES_PT.md`).
- Discoveries header shows the player's collection (X / total · %) instead of the 10K development goal.

1. Run `npm test`, `node tools/validate-v82.mjs`, `python tools/audit-v82-art.py`, `node tools/audit-active-artwork.mjs`, and exact +200 Git diff gate against baseline.
2. Run `python tools/build-standalone.py` and verify output `Alchemy_10K_V82_WIP_Offline.html` plus legacy output for Android compatibility.
3. Inspect the 200 thumbnails at 35px in dark/light mode at 320/360/390px and audit distinct recognizable silhouettes.
4. One draft pull request and its one planned CI run after 200; repair failures without unnecessary repeated Actions minutes.
5. Test on an actual Android device, publish a single verified release APK only after QA, CI and merge.

Preserve 200-per-batch policy and do not start another content release on top of unpublished unstable V82.
