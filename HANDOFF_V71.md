# 35K Alchemy — V71 handoff (29 Oct 2026)

## Verified current state
- V70: 5,172 elements / 13,509 unordered recipes, with the audited legacy V61 motif-composite illustration backlog fully closed.
- V71 Batch 01: **40 NEW elements**, **40 globally deterministic recipes**, **40 distinct SVG illustrations**.
- V71 totals: **5,212 elements / 13,549 recipes**, with no previous IDs or outcomes changed.
- Published APK uses package `com.joaogdbg.alchemy35k`, fullscreen immersive mode and a fixed Alchemy-only TEST signing certificate.
- Stable APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
- Source: `client/src/organic-pack-v71.js`, `client/src/organic-art-v71.js`, `client/assets/v71/new/*.svg`.
- Quality manifest: `shared/v71-approved.json`. Validator: `tools/validate-v71.mjs`.
- V71 catalog and art are integrated into the main app and `tools/build-standalone.py`.

## Editorial scope and current progress
The requested expansion cadence is ~200 **new** discoveries per phase, not 200 automatic icon variants or recipe aliases. The first 40 were completed in V71 Batch 01. **160 new discoveries remain to reach 200**.

Batch 01 themes: coastal observation and handicrafts; kitchen, seeds, orchard and seasoning.

## Mandatory rules for remaining 160
1. Global result invariant: A+B=C, B+A=C regardless of Classic/Family Only, never change an existing pair outcome.
2. Every new element is reachable from Classic's four starting elements. Duplicate normalized names and duplicate unordered pairs are forbidden.
3. Add a subject-specific, original SVG per element with recognizable silhouette at **35 px**, preserving muted pastel colors and the V68–V71 art direction; avoid generic motif hashes or mechanical combinations.
4. Build and inspect both Dark and Light review sheets. Similarity checks cannot substitute for recognizing the object.
5. Maintain independence of Family Only campaigns, shared membership logic and 2-ad merge credit. Do not simulate rewarded advertisements in offline HTML.
6. Do not modify existing saves, stable Android signature, package ID or the direct GitHub download URL.
7. Run Node tests, catalog and art validators, rebuild the offline HTML and pass Android GitHub Actions **before** reporting a new version as published.
8. User prefers direct plain GitHub URL links, not buttons or artifact ZIP links.
9. Prefer gaming, consoles, arcade, anime, film and broader science themes when curating the next stages, not only nature/food.
10. Publish partial batches with their actual count; do not mark the 200 finished before 200 are verified.

## Next work
Proceed with the next carefully reviewed group (e.g. 40 original discoveries) toward the remaining 160. Explicitly audit new recipes against the existing 13,549 fixed outcomes before drawing icons. Maintain separately versioned content manifests and full regression coverage.
