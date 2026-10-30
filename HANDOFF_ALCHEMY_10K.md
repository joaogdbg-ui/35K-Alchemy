# Current status — 30 October 2026

V82 was merged as commit `b75811874766a1270ac5ca908fd57719e1557c0a` and its signed debug/test APK built successfully. The **exact** catalog target is now **10,000** (not 10,012). From V82's 6,012, complete 19 further +200 batches to 9,812 then a final exceptional +188 to 10,000. See `HANDOFF_V83.md` for active development. Historical notes below predate the merge.

---

# Alchemy 10K — V82 candidate handoff (29 October 2026)

## Branch, goal and release truth
- Development branch: `feature/alchemy-10k-mythology-prehistory`.
- V81 baseline on main: SHA `2aba8395f48082964bc2af2ff20a468c56dd464b`, **5,812 original elements and 14,149 recipes**.
- V82 authored candidate: **+200 permanent IDs and +200 new unordered global recipes**, giving **6,012 elements / 14,349 recipes** when passed and merged. This is the first batch since V81. The corrected exact target is 10,000: after V82, 19 regular +200 deliveries and the exceptional final +188.
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

## Release checklist
1. Run `npm test`, `node tools/validate-v82.mjs`, `python tools/audit-v82-art.py`, `node tools/audit-active-artwork.mjs`, and exact +200 Git diff gate against baseline.
2. Run `python tools/build-standalone.py` and verify output `Alchemy_10K_V82_WIP_Offline.html` plus legacy output for Android compatibility.
3. Inspect the 200 thumbnails at 35px in dark/light mode at 320/360/390px and audit distinct recognizable silhouettes.
4. One draft pull request and its one planned CI run after 200; repair failures without unnecessary repeated Actions minutes.
5. Test on an actual Android device, publish a single verified release APK only after QA, CI and merge.

Preserve 200-per-batch policy and do not start another content release on top of unpublished unstable V82.
