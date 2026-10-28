# V61 — Visual variety audit (art-direction gate)

## Scope and limitations

- All 200 V61 SVG icons are checked. Rendering at 96×96 and a 64-bit perceptual hash identify *possible* look-alikes; this is a **review queue**, not a substitute for visual inspection.
- An icon file having a unique hash **does not** prove that it looks different. Likewise, semantically related objects may legitimately resemble one another.
- Art references: official Little Alchemy 2, Doodle God, and Infinite Craft. Study general readability and discovery experience, **never copy sprites, silhouettes, characters, brand marks, or source assets**.

## Findings

- Icons audited: **200**
- Identical SVG files: **0 groups**
- Art-directed object-specific silhouettes: **16**
- Two-motif collage templates remaining: **184**
- Unique two-motif combinations still in use: **123**
- Closest-looking pairs flagged by perceptual hash (distance <=5): **9**

## Main motifs repeatedly used (among original templates)

| Motif | Number of icons |
|---|---:|
| flower | 27 |
| tree | 21 |
| wave | 13 |
| camera | 11 |
| mountain | 11 |
| frame | 9 |
| cloud | 9 |
| food | 8 |
| sun | 7 |
| branch | 6 |
| halo | 6 |
| ice | 5 |

## Examples of potential look-alikes

| Hamming distance | Icon A | Icon B |
|---:|---|---|
| 2 | Floating Reed Bed | Heron Wetland Nest |
| 4 | Greenhouse Thermostat | Aquarium Temperature Monitor |
| 4 | Heatwave Garden Thermometer | Honeybee Swarm Cluster |
| 4 | Ocean Plankton Bloom | River Otter Slide |
| 4 | Orchard Fruit Press | Heron Wetland Nest |
| 4 | Orchard Fruit Press | Squirrel Cache |
| 4 | Snow Covered Bird Feeder | Desert Burrow |
| 4 | Squirrel Cache | Floating Reed Bed |
| 4 | Squirrel Cache | Heron Wetland Nest |

## Proposed visual style system

1. **Recognizable silhouette at 35×35px.** One identifiable focal object (e.g. horn, crater, shell, instrument); decorative details are secondary.
2. **Four compositional families:** isolated object, living organism, process/phenomenon, and miniature scene. Rotate composition and viewpoint to avoid identical two-icon collages.
3. **Subject-specific anatomy and materials:** food has bowl/crumb/fruit details, geology has strata/facets, machines have readable components; do not represent all devices as a camera.
4. **Stable visual identity:** muted warm palette, clean flat shading, consistent outline, light shadow; controlled highlights rather than random repeated sparkles.
5. **Editorial uniqueness:** block normalized duplicate names/IDs and recipe conflicts, plus artist review of similar silhouettes and unsupported/forced recipes.
6. **Non-infringing inspiration:** derive principles from other games, never recreate identifiable sprites or trace third-party artwork.

## Gates for a future 200-icon pack

- `python tools/audit-v61-visual-variety.py --strict` demonstrates the strict threshold **and presently fails on the legacy 184 templates**; this must be solved before treating the entire set as approved.
- For **new** packs: new icon count must match new element count; no duplicate hashes; max 15% generic two-motif collages; no single generic primary motif for more than eight of 200 icons; all perceptual-hash near matches require editorial signoff.
- Produce a contact sheet of **all 200** icons at game size and a screenshot on mobile in Light and Dark Mode; add human acceptance after zoomed and 35px inspection.

## Current release decision

**Prototype only.** The first 16 SVGs have been redrawn as distinct illustrations. The remaining 184 deserve review before claiming the V61 visual library fully satisfies the new art standard. No recipe or element ID was changed.

### Outstanding strict-gate issues

- 184/200 reuse the two-motif collage layout (target <=30/200)
- Overused main subject: ('flower', 27) (target <=8 per 200)
