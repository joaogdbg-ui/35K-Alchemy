# V78 — 35K Alchemy expansion handoff (150/200)

## Delivered
- V77 source and stable Settings untouched. V77: 5,472 elements / 13,809 unordered recipes.
- V78: **+50** curated new concepts with exactly 50 dedicated SVG assets, five hand-authored source packs (V78 A-E), no fallback characters or brand-based mock names.
- Expected **5,522 elements / 13,859 recipes**, 150/200 of this 200-item development cycle, 50 remaining. No unreviewed 200-item claim.
- V78 mixes gameplay exploration, fantasy worlds, retro hardware, scientific instruments and musical/arcade culture.
- Almost every recipe consumes a previously discovered V77 ingredient, deliberately growing connected crafting branches; all pairs are globally order-independent and cannot collide with historical outcomes.
- Family Only campaigns remain unchanged by this Classic content cohort; the merge mechanism and independent save profiles are untouched.
- Settings, scroll anchoring, theme and Android package signing unchanged.

## Quality gates
`node tools/validate-v78.mjs` checks counts, previous IDs/formulas, normalized names, global unordered pair uniqueness, reachable ingredients and source/runtime illustrations. `python tools/audit-v78-art.py` validates standalone structure; `node tools/audit-active-artwork.mjs` includes V78. View real SVGs at 35/90 px in `docs/V78_ART_REVIEW.md`. No automated test can certify artwork originality, a trademark clearance, or how tiny drawings look on a physical device. The historical editorial IP review queue still exists.

Next subbatch: 50 high-quality discoveries to close this second 200-item cycle.
Download: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
Repo: https://github.com/joaogdbg-ui/35K-Alchemy
