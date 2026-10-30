# Alchemy 10K — active catalog roadmap (29 October 2026)

V81 main baseline: **5,812 items / 14,149 global unordered recipes**. V82 authored QA candidate on `feature/alchemy-10k-mythology-prehistory`: **+200 real new IDs, +200 recipes and 200 SVG source files**. Candidate total **6,012 / 14,349**, of which **93 new mythology elements** and **107 new prehistory items**. Content count is full but branch is **unmerged and not an APK release**. Manual at-35px art review, full tests, CI and Android build remain pending.

Four Family Only source-level isolated closure checks: Nature & Science **476/476**, People & Culture **211/211**, Mythology & Gods **109/109**, Prehistory & Dinosaurs **116/116**. Existing Nature campaign continues to use the historical Classic starters (known defect); the two new campaigns have four unique thematic starters. One global result for each unordered pair applies to Classic and all campaigns.

Active minimum goal: **10,000+ unique elements** in full **+200 content releases**. Starting from V81 there are 21 batches to reach **10,012**; V82 would complete the first, leaving **20 more 200-item batches** and no filler allowed.

Read the [200-illustration V82 art contact sheet](docs/V82_ART_REVIEW.md), [V82 handoff](HANDOFF_ALCHEMY_10K.md), [thematic contract](docs/ALCHEMY_10K_THEMATIC_EXPANSION.md), [Family Only invariants](docs/FAMILIES_ONLY_CONTRACT_PT.md) and [200-item release policy](docs/CONTENT_200_BATCH_POLICY_PT.md). The old 35K roadmap below is historical and not active development policy.

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
