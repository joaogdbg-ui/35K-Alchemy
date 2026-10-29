# 35K Alchemy — V75 complete 200-element expansion cycle

## Verified target counts

- V70 baseline: **5,172 elements / 13,509 recipes**.
- V71: **+40** elements and 40 recipes, individually illustrated.
- V72: **+20**.
- V73: **+24**.
- V74: **+48**.
- **V75: +68**.
- **Total newly added in cycle: 40 + 20 + 24 + 48 + 68 = 200.**
- Expected final: **5,372 elements / 13,709 globally deterministic unordered recipes**.

## Fidelity contracts

- Every V75 element has its own original hand-authored semantic SVG in `client/assets/v75/`, drawn for legibility near 35 px. No procedural motive mashup, placeholders, shape-set hash variants, or runtime API calls are used to create icons.
- Five reviewed source segments `client/src/organic-art-v75-{a,b,c,d,e}.js` combine into one art map through `client/src/organic-art-v75.js`. The Android offline bundler embeds exactly those five source segments without network calls.
- `client/src/organic-pack-v75.js` contains 68 new individually named items, English descriptions, and globally fixed combinations from items already available in V74 and earlier.
- `shared/v75-approved.json` binds every element ID to its SVG and formula. `tools/validate-v75.mjs` rejects duplication of IDs, names, unordered pairs, visual asset hashes and any prior recipe change.
- `tools/audit-v75-art.py` parses all 68 SVG files, rejecting malformed XML or external runtime content.
- `docs/V75_ART_REVIEW.md` supplies a gallery with each icon at **35 px** and **88 px** for human art acceptance. Formal visual testing on a real Android phone remains worthwhile; tests cannot assess every object's clarity or subject fidelity.

## Existing behavior preserved

- Classic + Families Only remain independently progressive. The Merge into Classic / two confirmed rewarded ads rules, fractional credits, save IDs, sorting, hints and no-recipe behavior are unchanged.
- Inventory scroll anchor after discovery remains.
- The V73 *top-of-combiner slots* breathing-room correction remains, without extra space below.
- Fullscreen immersive Android configuration, dedicated signing certificate and APK name stay unchanged.

## Next expansion cadence

The user wants to move to **200 new elements per delivery**, provided quality does not fall. Internally this should remain 4 subbatches of ~50: validate recipes globally; audit silhouette originality and meaning; review at 35 px; build and sign only when all 200 are ready. Never pad a batch with abstract generic icon compositions to hit the number.

Permanent APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
GitHub Release: https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest
