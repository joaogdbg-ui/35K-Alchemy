# Gameverse Infinite V13 — Engine, touch, feedback and shared cartoon icons

## Scope and honesty

V13 is a working incremental client/server release. It **does not** deliver unrestricted offline generative AI or a library of 5,000 licensed icons. It prepares a semantic resolution engine and scalable reuse metadata. The world feed requires an approved server catalogue; PostgreSQL and external model inference are not live in the offline HTML.

## 1. Input contract (touch-first)

- Single tap/click on an inventory card inserts the element immediately; **no intermediary detail modal**.
- If the left slot is empty, put the chosen element there.
- Otherwise put or replace the right ingredient. This is deliberately stable, irrespective of lock state.
- Both slots filled triggers the combination automatically after a short debounce (180ms).
- Tap an occupied craft slot to remove that ingredient.
- Left lock preserves left ingredient after both successful and unsuccessful resolutions; the right slot clears.
- Dragging from the illustration remains supported. Touch starts immediately on the artwork; vertical swipes on labels and gaps still scroll the virtual inventory.
- The latest-discovery strip remains an entry point to a detail view, not ingredient selection.

### State tests

Initial `(∅,∅)`; tap A `(A,∅)`; tap B -> resolve `A+B`; without lock `(∅,∅)`; with lock `(A,∅)`; tap C -> resolve `A+C`. Repeat taps and dragging share `place(index,id)`. If both slots are already filled and a new element is tapped, replace the right slot. Tapping the left slot removes it even when locked (lock state remains explicit).

## 2. Ordered combination resolution

Priority MUST NOT change:

1. **Curated/cached recipe**: the 1,735 legacy recipes take precedence, including cases such as Fire + Fire, which has a defined output.
2. **Deterministic redundancy**: exact A+A (if no curated recipe) yields A. A whole-word subtype with matching non-sensitive categories can dominate the general term (e.g., Fire + Greek Fire -> Greek Fire); this does not create a new global element and needs no model call.
3. **AI semantic proposal**: an unknown pairing goes to the server only, subject to player quota. Propose a meaningful real cultural concept or a clearly designated fictional creation. Semantic relationships should consider transformation, shared function, culture, medium, hybrid purpose and plausible derivative.
4. **One guarded creative retry** for weak/empty/unproductive proposals. Never retry a blocked unsafe result; no unlimited retry loop.
5. **Review or pending**: valid candidates go through moderation and review; a known canonical name may be linked to an existing element after approval, rather than rejected as a duplicate.
6. **Fail closed**: unsafe proposals are blocked, unavailable remote inference is reported honestly, and a pair with no coherent result is not converted into meaningless word stacking merely to avoid a “No Match”.

**Target:** a meaningful result for as many pairs as possible, **not a false guarantee** that every possible pair gives a new discovery. No paid AI calls are made from the standalone HTML.

## 3. Distinct feedback

| Situation | UI response | Storage |
| --- | --- | --- |
| New element | Centered *NEW DISCOVERY* card with icon, name and combination | Persist in local collection |
| Known element / cached recipe | Short, unobtrusive “Already discovered · X” toast | Keep recipe and last output; no full-screen modal |
| Semantic redundancy | Distinct “Same element · X” toast | Cache recipe locally; no new global element |
| Pending approval | “New idea submitted for review” neutral toast | Server queue only; not publicly unlocked |
| Invalid/unproductive | Low-key “No coherent result yet” toast | No fake element |
| Safety rejected | “Combination blocked by safety rules” toast | No public publication |
| Offline unknown | “New recipe needs an online discovery engine” | Retain offline collection |

No animation frames for elements. Feedback UI itself may use static modal transitions if desired, but the delivered version uses static icons.

## 4. Shared-icon contract (zero cost per artwork)

Primary art: static 1:1 colorful cartoon illustration on transparent background. Icon variants may reuse the same family silhouette.

### Metadata (for future global catalogue)

```json
{
  "id": "generated:example-id",
  "name": "Greek Fire",
  "category": "nature",
  "iconFamily": "fire",
  "paletteVariant": "emerald",
  "accentOverlay": null,
  "assetVersion": "gameverse-shared-v1"
}
```

The V13 client already reads optional `iconFamily` and `paletteVariant` for dynamic elements. A deterministic fallback derives family from the concept's name and category. `Greek Fire` reuses Fire with a green hue. `Blue Fire` uses a blue palette. Several creations can intentionally share one pictogram.

The renderer uses legacy colored static SVGs for existing items; generated items select related shared artwork or a category-based cartoon icon. No image-generation call occurs while the game runs, and only visible inventory cards are rendered.

### Future catalog expansion

- Build a licensed, audited base library of ~5,000 assets **as a separate ingestion task**. Do not advertise 5,000 icons before assets exist.
- Asset metadata: `asset_id`, `license`, `source`, `attribution`, `family`, `keywords`, `palette_slots`, `allowed_overlays`, `quality_score`.
- Reject problematic/trademark-looking content or rights claims, and store attribution requirements.
- Offer optional generated art only in an explicitly enabled, separately funded pipeline; the V13 paid-image worker is disabled by default.
- Palette changes and optional accent overlays should be flattened ahead of distribution for high-volume catalogue items. Never generate images at scroll time.

## 5. Content-quality and moderation

- Minimize profanity, slurs, explicit sexual content, exploitation, harassment, defamatory person-related fabrications, and illegal-instructional content via lexical + semantic + human review.
- For public figures, treat invented relationships and political claims as high-risk, not automatically factual. A fictional concept must be labeled as such.
- Prevent exact word concatenation, adjective stacks and meaningless descriptions, but permit longer well-defined fictional names when their semantic rationale is specific and independently interpretable.
- Public discovery feed includes **only approved elements**. Approved recipes that map onto an existing element do **not** create a new World First event.
- Moderation, rights review and an appeals workflow remain production prerequisites.

## 6. Data and migration

- Preserve 1,591 legacy item IDs and 1,735 legacy recipes.
- Keep current localStorage keys `gameverse_alchemy_v2` and `gameverse_dynamic_v11` for backward compatibility.
- V13 adds optional icon-family metadata and does not rewrite saved legacy IDs.
- Shared world publication, logged-in synchronization and generated art remain disabled from the standalone HTML until the server and policies are configured.

## 7. Testing and acceptance

- Unit tests: curated recipe precedence, same-element redundancy, whole-word specialization, unsafe person-category exclusion, independent pair ordering, catalogue integrity.
- UI tests: tap card directly, real drag from artwork, lock persistence, new discovery, repeat toast, offline unknown feedback, responsive widths (360/390/1280).
- Performance: bounded virtual inventory rendering; static SVG (no per-element frame timers); no network dependency for legacy combinations.
- Outstanding production validation: actual PostgreSQL instance, concurrent candidate approvals, moderation provider, mobile installation, global feed load, platform policy audit.
