# 35K Alchemy V68 — Handoff / 28 October 2026

## Canonical output and source
- Offline HTML: `35K_Alchemy_V68_Offline.html` (self-contained, no external art or API dependency).
- Source: `client/`, `shared/`, and `tools/`. Build with `python tools/build-standalone.py`.
- Catalog: **5,172 unique elements**, **13,509 fixed unordered recipes** (V67: 5,162 / 13,499).

## V68 content and art
- **10 new elements**, each with one curated new recipe and bespoke SVG: Starfish Fossil, Sunflower Seeds, Harbor Buoy, Porcelain Vase, Bee Smoker, Seed Bomb, Glow Mushroom, Sea Urchin Shell, Golden Acorn, Botanical Stained Glass.
- **24 older V61 generic motif-composite icons redrawn** without changing their IDs, names, recipes, or save keys. Subject names and SHA-256 hashes are in `shared/v68-approved.json`.
- Art is in `client/assets/v68/new/` and `client/assets/v68/redrawn-v61/`, mirrored byte-for-byte in `client/src/organic-art-v68.js`. Gameplay catalog content: `client/src/organic-pack-v68.js`.
- The V61 visual rework backlog is now **76** (100 carried from V67 minus 24 redrawn in V68). This is a bounded prior audit, not an assessment that all other icons are perfect.
- 34-icon gallery `V68_Art_Gallery.png`; actual-size 35px dark review `V68_35px_Review.png`.

## Permanent rules retained
- All modes use a globally consistent single result per unordered pair; A+B and B+A are identical. Historical V67 recipes cannot be changed.
- New elements must have unique normalized names and IDs, be reachable from classic starters, and have their own recognisable artwork. Artwork should portray the subject, not merely combine recycled generic stamps.
- Classic starts with Water, Fire, Earth, Air. Family Only retains Nature & Science and People & Culture with their own four thematic starters; 31 multi-family IDs propagate unlocks, while Classic progress stays independent.
- Family-to-Classic Merge requires two separately confirmed rewarded advertisements and preserves 1/2 progress. Offline HTML deliberately does not simulate rewarded ads; real AdMob/native callbacks and server-side verification are still unimplemented.
- Sort A–Z, Old first, New first, virtualized inventory, Dark Mode, tap feedback, settings sound control and the V64 composer remain.
- Project remains English-only UI.

## Tests and limits
- **252/252 Node tests pass**, including 4 V68-specific tests.
- V68 validator: 5,172 unique IDs and names, 13,509 unique fixed unordered recipes, no historical result changes, all items reachable, 34 runtime/source SVGs matching their hashes.
- Art audit: no exact SHA-256 duplicates and no pHash pairs within distance <= 6 **inside the 34-art V68 batch**. Automated image similarity alone does not prove perfect art variety across the entire catalog.
- Chromium tests at 360×740, 390×820, and 1280×820: start Classic, craft one V68 recipe, verify SVG, cycle 3 Sort choices, virtualized list (<80 rendered chips), no JavaScript page exceptions.
- Family regression at all 3 sizes: both campaigns, shared IDs and offline ad gate; Merge tests at 390×820: no-reward offline and a test-only sequence 1/2 → failed ad → 2/2 with persisted Classic unlock.
- Repeated standalone build yielded byte-identical HTML (SHA-256 stable).
- **Not yet tested:** native Android device performance, real AdMob consent/rewards, server-side ad verification, and exhaustive editorial review of historical names/IP.

## Next
- Redraw remaining 76 flagged V61 generic icon composites.
- Continue original element expansion with distinct art; ~200 remains an aspirational batch, not a minimum quota. Test real 35px legibility.
- Expand Family Only campaigns only with independently validated reachability and global recipe consistency.
