# 35K Alchemy — V71 curated expansion, first 40 / target 200

## What changed
- 40 distinct new items, each with one original subject-specific SVG, one globally deterministic unordered recipe, all ingredients already present in the existing catalog.
- Groups: 20 coastal science/craft discoveries and 20 kitchen/cuisine discoveries.
- Catalog: 5172 -> **5212 elements**, 13509 -> **13549 recipes**.
- Existing IDs, recipes, saved data and modes remain intact.
- Original V70 icon-cleanup ledger remains complete (legacy generic motif debt = 0).
- 35K Alchemy Android application ID, fullscreen, distinct test signing certificate, stable `35K-Alchemy.apk` release address are unchanged.

## Quality status
- Source SVG files in `client/assets/v71/new` are written per-item, not generated as generic hashed icon combinations.
- Art is embedded in `client/src/organic-art-v71.js` as the highest-priority illustration for its unique canonical name.
- `shared/v71-approved.json` pins the 40 exact SVG SHA-256 fingerprints.
- `tools/validate-v71.mjs` rejects unchanged-name collisions, recipe key reuse, unreachable new elements, missing artwork and unexpected changes to historical recipes.
- `client/test/v71-art-catalog.test.mjs` guards counts and vector integrity.

## Next editorial work
Continue toward the 200-element target in later carefully reviewed sub-cohorts. Do not claim the 200 are complete until all are in GitHub and the physical Android quality review has passed. Maintain readable subject-specific 35px artwork and natural combinations without duplicate names or results.

## GitHub / Android
- APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
- Release: https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest
