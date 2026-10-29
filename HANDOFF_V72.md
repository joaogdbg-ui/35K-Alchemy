# 35K Alchemy — V72 / continuation of the 200-element expansion

## Counts and scope
- V70: 5,172 elements / 13,509 recipes, all V61 generic motif debt addressed.
- V71 batch 01: 40 new items and 40 individual SVGs, totals 5,212 / 13,549.
- **V72 batch 02: 20 additional hand-authored gaming/arcade accessories and objects, 20 unique one-to-one SVG artworks.**
- **New totals: 5,232 elements / 13,569 fixed unordered recipes**, if validation passes.
- Progress toward requested 200-element expansion: **60 / 200**; **140 remain**. Do not claim all 200 finished.
- V72 specifically fixes inventory scroll jumping to the top on new discoveries: the virtualized list retains the top visible item's anchor, only resetting for explicit filter/sort/search actions.
- V72 also adds +7 CSS px breathing room above the crafting row on sufficiently tall mobile screens (not on short viewports).
- No changes to mode rules, saves, rewarded-ad behavior, Android signing, application ID, or URL.

## Asset and recipe contracts
- Art source: `client/assets/v72/new/*.svg`; embedded source mirror: `client/src/organic-art-v72.js`.
- New content: `client/src/organic-pack-v72.js`, exact 20-item manifest: `shared/v72-approved.json`.
- Validators: `tools/validate-v71.mjs`, `tools/validate-v72.mjs`; `node --test client/test/*.test.mjs`.
- Every old pair must map to its old result. Every new pair must be commutative and globally deterministic.
- Playable completely offline in Classic; Families Only progress and two-reward merge untouched.
- New illustrations use muted pastel tones and meaningful shapes. Validate visual 35px on Android before considering final artistic acceptance.

## Direct APK link
https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk

## Next
Continue the remaining 140, prioritizing genuinely original, intuitive game, console, arcade, science and other family elements. Do not fill quota with generated motif mashups; review each subject separately.
