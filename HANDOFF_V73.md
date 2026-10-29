# 35K Alchemy — V73 (24 new bespoke illustrations and layout fix)

## Version and counts
- Base V72: 5,232 items / 13,569 fixed Classic formulas.
- V73: +24 curated discoveries, +24 globally deterministic formulas, +24 standalone subject-specific SVGs.
- Target after validation: **5,256 items and 13,593 recipes**.
- 200-item current expansion: **84 / 200 complete** (40 V71 + 20 V72 + 24 V73); **116 remain**.
- The next cadence of 200 items per release remains a goal, not an assertion that more items have shipped.

## User-reported Android fix
The screenshot showed that the extra space was needed ABOVE the two combining slots,
not below them. V71 accidentally translated the entire .workspace-content, taking
Hint/feedback along for the ride.
V73 removes that translation and shifts only .craft-row down by 9px on tall phones,
3px on short phones. Hint/feedback/inventory stay in their established positions.
The top bar, fullscreen mode and bottom tabs remain unchanged.

## Art standard
Each new subject has its own 100x100 vector drawing with meaning-specific silhouette,
muted/pastel colors matching the V69/V70 illustrations and no text as a substitute for artwork.
The 24 source files are in `client/assets/v73/new/`; runtime mirror
`client/src/organic-art-v73.js`; recipe pack `client/src/organic-pack-v73.js`;
approval manifest `shared/v73-approved.json`. Tests ensure exact SVG parity,
distinct hashes, valid recipes, and preservation of all prior outcome mappings.
Passing software tests cannot replace checking recognizability at 35px on the user's phone.

## Compatibility
- Same Android appId and Alchemy-only signature; same GitHub Release `latest` URL.
- No changes to previous IDs, recipe outcomes, game saves, Family Only, Merge or ad reward logic.
- Browser standalone and Android are derived from identical V73 HTML payload.

## Next step
Continue the remaining 116 items in curated, visually-reviewed sublots.
Do not generate generic shape remixes or publish unreviewed collisions.

## Permanent links
https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest
https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
