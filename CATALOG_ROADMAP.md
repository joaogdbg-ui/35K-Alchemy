# Alchemy 10K — current catalog roadmap (29 October 2026)

Active goal: **10,000+ meaningful discoveries**, starting from V81's verified **5,812** IDs / **14,149** global combinations. Exactly 21 remaining content batches of 200 IDs reach **10,012**; do not publish smaller content batches. The introductory standalone Family Only campaigns **Mythology & Gods** and **Prehistory & Dinosaurs** are implemented as a zero-new-ID technical addition in `feature/alchemy-10k-mythology-prehistory`. Their first graphs have 16 and 9 existing discoveries, respectively. Full pantheons and varied prehistoric species remain planned for V82 and later, not counted in the catalog yet.

Read [Alchemy 10K themed expansion](docs/ALCHEMY_10K_THEMATIC_EXPANSION.md), [new handoff](HANDOFF_ALCHEMY_10K.md), [family independence rules](docs/FAMILIES_ONLY_CONTRACT_PT.md) and [200-item delivery rules](docs/CONTENT_200_BATCH_POLICY_PT.md). The original 35K roadmap retained below is historical rather than current.

---

# Art-first content road map

Goal: 35,000 recognizable, meaningful discoveries, not merely 35,000 nouns.

Current: 5,106 elements, 13,443 recipes. The first art-gated batch adds 35 genuinely new elements while preserving all 13,408 prior recipe outputs.

1. Prioritize distinctive new element concepts and coherent ingredient relationships.
2. Draw the actual subject; forbid generic main-motif plus accessory template icons.
3. Review contact sheets at 35 px and at full size, with Light/Dark UI contexts.
4. Block normalized name/ID/pair duplicates and unreachable output at build time.
5. Never alter an existing A+B result between Classic and Families Only.
6. Aim toward 200 new elements per release, but reduce the batch if visual review fails.
7. Retouch older legacy icons progressively; V61 still has 184 generic silhouettes flagged.

## V65 art-first update
- +12 truly new elements, +12 distinct recipes, +20 legacy redraws; totals 5,136 / 13,473.
- 144 legacy motif-composite SVGs from V61 remain for manual redesign.
- Next releases should keep broad thematic variety, readable 35 px icon identities and no arbitrary one-size-fits-all compositions.

## V67 art-first continuation
- +12 new elements / +12 recipes / 24 V61 redraws = **5,162 elements / 13,499 recipes**.
- **100 identified V61 generic icons remain** after this release.
- Continue diversity of silhouettes, not motif permutations. Review at 35 px, not only in SVG source.

## V69 — 76 art-only replacements (no added recipes)

- Stable total: **5,172 unique elements / 13,509 fixed recipes**.
- Created 76 subject-specific V61 legacy redraws with 35px Light/Dark reviews and checksummed runtime SVGs.
- Historical count correction: the V68 "76 pending" note included 14 previously redrawn items already marked art-directed; 90 motif-composite entries were still pending before V69, **14 after V69**.
- Do not treat pHash/hash uniqueness as proof of artistic or semantic quality; inspect each icon and the remaining 14 before resuming ~200-new-element batches.
