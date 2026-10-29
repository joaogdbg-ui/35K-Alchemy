# V81 — 200-element production batch

## Actual scope

| Metric | Published V80B baseline | Proposed after batch |
|---|---:|---:|
| Catalog elements | 5,612 | 5,812 |
| Fixed global unordered recipes | 13,949 | 14,149 |

**New content = +160 V80 +40 V81 = exactly +200.** V80 editorial cycle is 200/200 including 40 already published in V80B. V81 editorial cycle begins with 40/200; it is part of the same +200 publishing batch, not a separate micro-release.

Branch: `wip/200-next-discoveries-authored`. No release/merge claim before full PR CI and Android build.

## Art and editorial rules

All 200 added items have original English names, distinct stable IDs, a single global primary combination, short descriptions and bespoke 100x100 SVGs. Sources are under `client/assets/v80` and `client/assets/v81`; exact runtime maps are `organic-art-v80.js` and `organic-art-v81.js`. Galleries: `docs/V80_ART_REVIEW.md` and `docs/V81_ART_REVIEW.md`. Static checks cannot substitute for actual 35px visual review or legal clearance.

The complete Classic catalog is checked in `tools/validate-v80.mjs` and `tools/validate-v81.mjs`, and bundled in `tools/build-standalone.py`. Earlier IDs, results, saves, rewarded ads, Settings and controls remain unchanged.

## Families Only — preservation

Existing Nature & Science and People & Culture campaigns remain autonomous, with 476/476 and 211/211 independently craftable items; 31 IDs are shared between these families and transfer within eligible family profiles only. Classic progress stays separate; rewarded Merge still requires two real confirmed ads and cannot import starter freebies.

New V80/V81 items are added to Classic, **not silently placed into Family Only graphs**. Future family assignment requires an independent 100%-reachable progression from its four starters, shared stable IDs, and unchanged global recipes. The known Nature & Science thematic-starters mismatch (still the Classic four) remains a tracked fix, not falsely claimed resolved.

## Minute-efficient validation

The WIP push-triggered Actions workflow was removed. No GitHub Actions should run during 25/50/100/150 checkpoints. Once +200 is ready, open one PR, require complete tests and exactly +200 content gate, merge when green and build one Android APK. Record links and timestamps only after actual results.

Remaining long-term goal after this release: 146 further batches of 200 to reach 35,012.
