# 35K Alchemy — Art-direction standard for 35,000 elements

## Sources of inspiration (principles, not assets)

- **Little Alchemy 2:** small, independently legible icons, with silhouettes readable on a compact inventory and a restrained palette. Official: https://littlealchemy2.com/ and https://help.littlealchemy2.com/
- **Doodle God:** meaningful thematic progression and combinations with recognizable objects, mechanisms and materials. Official developer listing: https://apps.apple.com/us/app/doodle-god-alchemy-sandbox/id427157971
- **Infinite Craft:** experimental creative exploration and frequent results, but 35K Alchemy remains curated, deterministic and offline rather than copying AI output or interface.

**Never** trace, copy, use ripped sprites or reuse third-party brand marks. These are examples of design principles.

## Required features of every new icon

1. **The noun determines the silhouette.** A seamount is underwater topography, a radio is a radio, a night moth is a winged insect, and a garnet is a gemstone. Do not reduce everything to flower + camera + a badge.
2. **Recognizable at 35 px** and at 52 px; test without the text label. In general a single primary object should dominate, not two equally-sized generic symbols.
3. **One visual family, many compositions:** isolated object, living creature/plant, cross-section/material, miniature landscape, scientific phenomenon, architecture, and device/usable object. Avoid the same framing and positioning for every icon.
4. **Consistent finish:** rounded, controlled lines; 2–4 harmonious flat colors plus accent; subtle shadow; no excessive effects, text baked into icon, or tiny unrecognizable detail.
5. **Subject-specific construction:** skin/feathers/antennae, crystal facets, layered rock, food texture, leaves, wood grain, screws/pipes/lens parts. Detail should explain the item.
6. **Creative variety:** rotate dominant shapes, viewpoints, asymmetry, negative space, palettes and orientation; no stock clipart or identical vector template with recolors.
7. **Originality and rights:** no copied trademarks, recognizable copyrighted character likenesses, traced logos or screenshots. Review potentially confusing names separately.

## Each 200-element release must pass

- Catalog rules: unique normalized element name and ID, one unordered pair -> one output globally, all new elements reachable, historical recipe outputs immutable.
- Art rules: 200 self-contained individual SVG files, no exact duplicates, **less than 15%** generic two-motif collage layouts, any one reused generic main motif in **at most eight** of the 200 icons, no unattended perceptual-hash near-matches. This is an editorial *threshold*, not a substitute for manual review.
- Two contact sheets: at normal icon size and enlarged with labels; inspect Light and Dark Mode screenshots on 360/390 px mobile.
- A human reviewer must confirm recognizability, actual subject match, compositional variety, and non-infringing originality for flagged items.
- Never claim that SHA hashes or technical uniqueness alone prove artistic individuality.
- If a 200-item batch cannot pass the checks, release fewer icons or spend an iteration improving art.

## V61 reality check

The 200 SVGs in the pre-existing V61 relied on a two-layer motif composer; 16 have now been replaced with object-specific artwork. The other 184 are currently *legacy art*, not signed off for this higher standard. Future V62+ content should be held to the strict art-direction criteria from the beginning, with flagged legacy icons fixed progressively.
