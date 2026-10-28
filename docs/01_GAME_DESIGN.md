# GAMEVERSE INFINITE — Game Design & Product Contract
**Version:** 0.1 · 27 October 2026 · Status: architecture approved for local prototype, not store-release ready

## Product thesis
A family-friendly, near-infinite discovery game where two elements form a meaningful third. Start with Water, Fire, Earth and Air. Reach consoles, video games, films, television, albums, music genres, actors, political figures, history and original fantasy discoveries. The fun comes from semantic surprise **and** reusability, not word concatenation. All UI copy remains English.

## User experience contract (MUST NOT REGRESS)
- Android portrait-first; desktop supported.
- Immediate icon-based drag-and-drop with touch and mouse, no handle and no long press.
- First and second craft slots; entering the second automatically resolves the recipe.
- Touching a populated slot removes its occupant.
- Optional left lock preserves its ingredient after *both* valid and invalid combinations.
- Collection remains scrollable, searchable and responsive while dragging.
- All preexisting 1,591 element IDs and 1,735 recipes preserved exactly.
- Discoveries remain persistent offline; no background animation on the elements.
- Only newly unlocked elements use a brief, dismissible discovery reveal.
- Three destinations: **Play**, **Discoveries**, **Collection**. Do not add site-style hero sections.

## Domain model
A discovery is not a phrase. It is a reusable entity with `id`, `name`, `canonicalKey`, `category`, `synopsis`, `source`, `verification`, `iconBrief`, `iconStatus`, `publicationStatus`, `createdAt` and optional `worldFirst` record.

### Types
1. **Curated real-world**: genuine device, game, song, creator, inventor, historical figure, etc., backed by reliable sources when factual claims are relevant.
2. **Recognized fictional**: existing fiction and entertainment entities; preserve ownership/attribution and avoid implying official partnerships.
3. **Original conceptual**: coherent novel compound, e.g. `Samurai + Robot -> Mecha Samurai`, with a distinct visual brief and reuse potential.
4. **No Match**: a pair with no meaningful outcome, or a failed quality/safety check.
5. **Pending**: an AI idea proposed but not yet approved for shared distribution.

### Creativity policy
- Prefer a named entity or one meaningful fictional construct; an output must have a plausible relation to *both* ingredients.
- Short names encouraged, but exceptions for established titles and creative compound names.
- Reject vacuous adjective accumulation (e.g. ten unrelated "ultra, mega, god" prefixes) **unless the combination describes a semantically integrated, distinct concept**; preserve reviewer discretion rather than implementing a blanket word ban.
- Reuse first-class outcomes; never make the user re-unlock an element merely because its recipe differs.
- Relationships involving actors and politicians: factual associations require verification; mashups explicitly fictional and reviewed.
- User creativity is allowed; hate, harassment, explicit sexual content, minors in sexual context, extremist glorification, defamatory factual implications, illegal how-to, and abusive content do not enter the public catalog.

## New discovery states
`candidate_private -> pending_review -> approved_global` or `rejected`; `approved_global -> flagged -> (restored | removed)` after review. The client must never label a pending entry “World First.”

## Global universe
- `Latest`: newest approved public discoveries, newest first.
- `World Firsts`: unique first publication per element, backed by an atomic database constraint.
- `Trending`: based on privacy-preserving aggregated reuse counts; avoid manipulation.
- `My Collection`: private by default; account-linked if opted in.
- A global feed is *not* a raw stream of AI output; moderation, attribution consent and anti-spam are mandatory.
- Spoiler control: filters for undiscovered items; reveal only after opt-in where appropriate.

## Example candidate combinations (design examples, not recipes preloaded)
- `Keanu Reeves + The Matrix -> Neo` (recognized fictional, factual relationship verified)
- `Cinema + Shark -> Jaws` (recognized film)
- `Samurai + Robot -> Mecha Samurai` (original conceptual)
- `Retro Console + Black Hole -> Singularity Arcade` (original creative concept, must pass semantic evaluation)
- Complex fan creations inspired by anime or games may be explored as *unofficial fictional mashups*, but are not automatically published: trademark, character, portrait and depiction risks require additional review.

## Telemetry / quality
- p95 tap-to-drag feedback target: under 50 ms on mid-range Android (must be measured on device).
- Known-recipe resolution: local, no network.
- AI-combination result: asynchronous, cancelable, explicit pending/error UX.
- Track `attempted`, `cache_hit`, `no_match`, `pending`, `approved`, `rejected`, `reported`, cost/tokens, and icon latency; do not log sensitive personal content unnecessarily.
- Pilot acceptance: ≥95% meaningful discoveries in a manually judged balanced sample, ≤1% obvious duplicate concepts, no publicly visible unreviewed output, no scroll-lock regressions.

## Monetization constraints
Do not force users to repeatedly pay/see ads for old cached recipes. Budget AI only for genuinely novel combinations. Treat optional cosmetic upgrades, fair discovery allowances and reasonable subscriptions as later decisions, not requirements of the first MVP.
