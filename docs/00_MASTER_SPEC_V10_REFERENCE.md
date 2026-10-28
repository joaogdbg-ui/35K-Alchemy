# GAMEVERSE INFINITE — MASTER SPECIFICATION

Version 0.1 — 2026-10-27

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


---

# Gameverse Infinite — V10 UI/UX Contract

## Interaction model
Three views only. **Play**: lightweight header, two craft slots plus left lock, a compact latest-discovery line, searchable scrollable element inventory. **Discoveries**: approved shared feed (Latest, World Firsts, Trending). **Collection**: personal encyclopedia with category filters, favorites later, item details and report option when public.

## Visual system
- Background: `#f7f5f2`; surface: `#ffffff`; canvas: `#efeeeb`; ink `#171717`; muted `#827d78`; fine borders `#e3dfda`.
- Shapes: rounded 14–19 px; understated shadows; no gradients/neon/mountain/sci-fi floor on the normal play surface.
- Typography: UI sans; 21 px compact name, 12–14 px item names; short labels only.
- Element artwork: colorful premium 2D cartoon, permanent static image (not animated sprite), transparent background, readable at 35–40 px.
- No explanatory headline blocks, no permanent text paragraphs, no animated icon frames.
- Discovery feedback: compact modal with unique icon + name + formula; first-world discovery may get extra accent but must be dismissible.

## Performance and accessibility
- Virtualized collection rendering; draw only visible rows plus overscan. Initial cap on DOM cards should scale with viewport instead of total unlocks.
- Icon URLs loaded lazily, decoded asynchronously, size-stable to avoid layout shifts. Cache via normal browser cache and future service-worker policy.
- Pointer gestures from icon region, vertical scroll from label/spacing. Do not re-render the gesture source mid-drag.
- Proper touch targets (ideally 44px), tab labels, aria roles, reduced-motion support, scroll containers with contained overscroll.
- Avoid text injection: player- or AI-provided values are escaped before HTML insertion.

## Navigation and offline states
- World feed displays a clear 'connect to server' state if offline; never fabricated items.
- A combination unknown to the offline pack uses an explicit status; no silent invention.
- UI state (selected tab, filters, query, lock) is separate from global element/recipe data.
- Original `gameverse_alchemy_v2` legacy save remains readable. Native app migration needs one-time import/export of the browser save, since file origins do not automatically share storage.

## Current executable proof
`Gameverse_Infinite_V10_Offline.html` is a new simplified visual shell using all 1,591 original elements and 1,735 original recipes. It preserves the two-slot interaction, left lock, automatic combination, search, and static vector artwork. The global feed is intentionally empty when no API is connected. The V10 shell is an engineering baseline for iterative usability tests, **not** a completed commercial app.

## Required visual acceptance checks
1. On 360x740 and 390x844 Android screens, inventory cards remain fully visible and scrollable.
2. With left lock on, input A survives success, failure, and repeated trials; click A to remove.
3. Fire + Water reveals Steam and increments the user's count exactly once.
4. World view is distinct from personal collection; no fake results while disconnected.
5. Search with 1,000+ unlocked elements does not create 1,000 DOM cards.
6. Artwork is static at rest; the only temporary feedback is the discovery modal/toast.


---

# Gameverse Infinite — Backend and API Contract

## Environment / boundaries
- Development proof: dependency-free Node >=22 HTTP API in `server/src/server.mjs`, in-memory seeded catalog. **Binds to `127.0.0.1` by default. Will refuse `APP_ENV=production`.**
- Proposed production: Node + TypeScript service with PostgreSQL, durable quota enforcement, idempotent jobs, Redis only when justified, queue/worker for art and moderation, object storage/CDN.
- Production must add real authentication, scoped tokens, durable player IDs, moderation tooling, GDPR deletion/export, receipts and purchases if monetized, backups, abuse protection, TLS and CORS allowlist.
- The development API is not a finished Railway deployment and does **not** support live multi-player persistence. SQL schema and legacy seed are supplied for the migration.

## API v1 (development proof)
### `GET /health`
Reports development mode, AI enabled flag, seeded counts.

### `GET /v1/catalog?limit=25&cursor=legacy:...`
Public approved catalog records, paged. In production use signed opaque keyset cursors.

### `POST /v1/combinations/resolve`
Request `{"leftId":"legacy:1","rightId":"legacy:0"}`. Ingredient order is commutative, sorted before lookup. Response for cached/seeded recipe:
`{"status":"approved","source":"catalog","result":{"id":"legacy:4","name":"Steam",...}}`
Unknown pair when AI is disabled: `{"status":"no_match","reason":"AI_generation_not_enabled"}`.
With AI enabled: typed proposal, quality validation, then `202 {"status":"pending_review","candidateId":"..."}`. **Never show as global before moderation.**

### `GET /v1/world-discoveries?mode=latest|first|trending&limit=25&cursor=...`
Only approved events, paged. In the local prototype, only events explicitly approved through development moderation appear.

### `POST /v1/reports`
Reason enum: `offensive|misleading|copyright|other`; production requires authenticated user, per-user caps and audit trail.

### Development-only endpoints
- `GET /dev/pending`: requires `X-Demo-Admin-Token`.
- `POST /dev/approve` body `{ "candidateId": "..." }`: requires token; publishes pending candidate in the local in-memory store.
**Remove the development endpoints for production.**

## Atomic global-publication protocol (PostgreSQL)
1. Sort element IDs into `ingredient_low_id` and `ingredient_high_id`.
2. Begin a transaction. Insert recipe row with unique pair; serialize concurrent proposals with pair row locking or advisory lock.
3. Normalize generated name; try canonical key uniqueness before new element insertion.
4. Run moderation/quality checks; publish only if approved.
5. Insert recipe outcome; `INSERT world_firsts ... ON CONFLICT DO NOTHING` ensures a single world first per element.
6. Create a world event in the same transaction, then commit.
7. Submit an idempotent icon job keyed by element ID + style version; never make gameplay wait for an image.

## IDs, migration, uniqueness
- Legacy ID: `legacy:{0..1590}`; generated ID: `generated:<UUID>`.
- SQL `uq_recipe_pair` on sorted IDs; `elements.canonical_key` unique; alternative aliases/translated names stored in separate alias table in production.
- Do **not** recalculate the 1,735 seed outcomes. Preserve existing player saves during import.
- `player_discoveries` is private; `world_events` only stores approved public milestones. Nickname visible only with opt-in.

## Limits and resiliency
- Known recipes served from PostgreSQL or in-memory cache; no model call.
- Unknown pairs bounded by user quotas, in-flight dedupe, and an idempotency key (to implement durably).
- Missing provider/timeout/unsafe output must return explicit typed status; fail closed before public publication.
- Persist audit logs for decisions with prompt/model versions and reviewer ID, not full raw personal data unless justified.
- Measure p95 known lookup, p95 generated latency, cache-hit ratio, DB size, provider costs, report turnaround and image processing delay.

## Security gaps before production
The provided memory API has a demo-only per-IP in-process quota and permissive CORS. These are unsuitable for the internet. Do not deploy or expose it publicly as-is. Implement authentication, IP reputation and account quotas, Redis/DB rate limiting, concurrency control across replicas, DDoS protection, abuse and fraud detection, validated OAuth login and monitoring.


---

# Gameverse Infinite — AI, Semantic Quality and Moderation

## Text model: `gameverse_element_proposal` v1
System goal: construct one meaningful, reusable entity from ingredient A and B, not a concatenation. Supply names, types, canonical IDs and relevant known relationships; ask model for a structured proposal. When ambiguous, prefer `no_match` over unsupported factual claims. Never allow user-provided output to override system rules.

The schema fields implemented in `server/src/ai-provider.mjs`:
- `status`: `candidate`, `no_match`, `blocked`
- `name`, `category`, `summary`, `reason`, `icon_brief`
- `fictional` and `real_person_sensitive` boolean flags

**Validation beyond JSON schema**: canonical name uniqueness, alias resolution, causal/factual plausibility, semantic relevance to both ingredients, distinct reuse potential, adult/child safety, brand/character rights, output formatting. Structured outputs guarantee shape, not factual truth. Model generated results remain `pending_review` until a moderator or vetted policy path approves them.

### Good / bad contrast
- Input `Samurai + Robot` → **good**: `Mecha Samurai`, a cybernetic swordsman with a coherent visual identity; **bad**: `Super Ultra Samurai Robot 9000` with no distinctive meaning.
- Input `Film + Shark` → **good**: `Jaws`, with verified relationship; **bad**: a made-up movie presented as real.
- Input `Living Politician + Fictional Villain` → **manual review**; no fake factual accusations or claims of real association.
- Input `Anime Character + Metal Armor` → **possible fictional concept**, not automatic publishing of derivative franchise likeness or word stack. Distinguish unofficial fan concepts, impersonation, trademarks and rights before art/publication.

## Safety pipeline
1. **Input**: ingredient ID allowlist and authentication, no free-form prompt injection from client.
2. **Lexical and language-aware filters**: profanity, threats, sexual exploitation of minors, hate slurs, spam, URL injection, PII exposure.
3. **Semantic model moderation**: context-sensitive safety classifier; treat sexual content involving real people, defamatory links, hateful/violent content, extremist glorification and illicit instructions as blockers or reviewer-only.
4. **Truth/identity**: names, titles, actors, politicians, facts; verify through authoritative source catalog, or mark explicitly fictional and route to review.
5. **Originality**: avoid existing canonical keys, aliases, banal duplication and meaningless modifier stacking.
6. **Post-publication**: report button, quarantine/flag, human appeal and takedown workflow. Never assume a blocklist alone solves all harms.

For a public store launch add an actual moderation service (e.g., model-based text/image moderation), multilingual test sets, queue SLAs, reviewer tools, complaint contact and audit trails. The regex patterns in the starter are deliberately insufficient.

## Icon style lock v1
- Colored premium cartoon 2D object art, centered and recognizably relevant; transparent background; no labels, watermark, card frame, template cube, photorealism or sprite animation.
- Fixed 1:1 aspect; generate a high-quality 1024x1024 source if supported, crop with transparent margin, downsample to **256x256 master** and **128x128 thumbnail** with proper alpha.
- Consistent contour thickness and soft shadows. Avoid text/letters inside art (except physical hardware where essential and rights-safe).
- Describe primary object, silhouette, color palette, two distinctive details, exclusion list. Keep only approved art.
- If a player discovers a new element before art exists, show a relevant **curated** icon family temporarily; generate/validate art asynchronously; do not block crafting.
- Save `icon_style_version`, generation model/version, image provenance, moderation outcome, hash and final asset key.
- Human and fictional IP likenesses default to **manual review**. Do not automatically create copyrighted logo/trademark replicas or deepfake realism for famous people.

### Reference icon brief
```json
{
 "element": "Mecha Samurai",
 "primary_subject": "futuristic armored samurai",
 "silhouette": "distinctive kabuto helmet and sheathed katana",
 "palette": ["warm red", "steel silver", "teal accent"],
 "details": ["segmented shoulder plates", "glowing visor"],
 "negative_constraints": ["no text", "no logo", "no photo", "no background scene"],
 "style_version": "gameverse-cartoon-v1"
}
```

## Icon pipeline states
`queued -> generating -> visual_qa -> rights_review(if needed) -> ready`, or `failed` with bounded retries. Worker uses idempotent `(element_id, style_version)` key. Assets stored in S3/R2 or equivalent, served via CDN. No direct generated base64 blob stored in a SQL row.

## Image QA gates
- PNG/WebP alpha present; correct dimensions and crop; no extra background or illegible parts.
- Perceptual-hash duplicate scan plus semantic embedding similarity versus adjacent known assets.
- Content moderation of image and description.
- Icon still reads at 40px. If a source model cannot generate transparent backgrounds, apply a reviewed isolation pipeline rather than claiming transparency.

## Public feed and real people
Names of actors, musicians or political figures can appear as factual catalogue entries; invented relationships must not be presented as fact. Generic cartoon symbols are safest as interim art. The public feed only contains approved discoveries, and users have a report/appeal path. Public credit is opt-in, not a side effect of discovering an element.


---

# Gameverse Infinite — Delivery Plan and Release Gates

| Stage | Scope | Exit criteria |
|---|---|---|
| **V10 UI foundation** | Minimal responsive Play/World/Collection, static colorful art, virtualized elements | Android touch drag to either slot, auto-fuse, left lock, scroll, accessible controls; original catalog and recipes pass regression |
| **V11 Assets** | Style lock, icon worker/provider, thumbnail pipeline and CDN cache | Consistent samples from nature, consoles, films, music, people; no duplicate generic cube icons; no blocking UI while art is generated |
| **V12 Infinite Engine** | PostgreSQL, authentication, API, AI provider, semantic moderation, per-user quotas | Novel pair produces pending proposal; reviewed proposal becomes globally reusable; concurrent attempts resolve to one canonical pair |
| **V13 World** | Feed, world-first awards, player opt-in names, reports/moderator console, privacy/export/delete | Real 2+ accounts observe exactly one world-first, feed pages correctly, report/takedown works |
| **V14 Beta & Store** | Capacitor Android, signed build, crash/performance monitoring, legal and platform policies | End-to-end test on physical mid-range Android, privacy notice, content policy, support contact, launch metrics and app review checklist |

## Current build truth
- **Implemented here:** V10 client prototype, offline import and static artwork, seeded recipes, local Node developer API, optional AI text adapter, semantic gates, local moderator endpoint, schema & seed SQL, docs and tests.
- **Not implemented:** deployed production PostgreSQL adapter, user accounts, durable generation queue, real AI icon generation and storage/CDN, human reviewer interface, authentic global feed, synchronization, billing, signed APK/AAB, GDPR workflows, Apple/iOS build and store approvals.
- Do not call the project publicly multiplayer or truly infinite until V12–V13 exits are met.

## Critical acceptance tests
1. Verify 1,591 items and 1,735 old recipes; preserve `gameverse_alchemy_v2` unlocks.
2. iOS and Android pointer/touch on element art moves ghost instantly; gesture leaves inventory scroll intact.
3. Fire + Water gives Steam once; second identical combination is cached, no new unlock.
4. Left lock persists after valid/invalid pair; click locked element still removes it.
5. 1,000 unlocked items show only a bounded number of DOM cards; measure memory/scroll FPS.
6. Fresh AI pair -> semantic candidate -> `pending_review`; no public feed event until approved.
7. Approve same element under race: single canonical `elements` row, one world-first entry.
8. Flag abusive output; remove from public feed; appeal state present.
9. Generated image undergoes style and image-content QA; static thumbnails remain recognisable at 40px.
10. Simulate network loss mid-craft and app restart: no loss of approved offline progress.

## Release safeguards
- Store: Android target SDK, explicit account deletion when accounts exist, Data Safety declarations, AI generated content reports inside app, age rating, copyright/trademark policy, crash tracking, Play signing, AAB distribution.
- Apple: App Review Guideline 1.2 UGC and AI-content controls, moderation, report/block controls, published contact, privacy notice and real native-value gameplay.
- EU: GDPR deletion/export/retention, controller/processor agreement, minors and age handling, AI transparency where relevant, IP takedown.
- Costs: hard budgets by user/day and system/day, caching/deduplication, monitored image-generation queue, alerting, test of 100k novel-pair monthly scenarios under verified provider tariffs.
- No live deployment before security review and legal/store checklist.

## Reference URLs checked 27 Oct 2026
- Google Play AI-generated content policy: https://support.google.com/googleplay/android-developer/answer/13985936?hl=en
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI Moderation: https://developers.openai.com/api/docs/guides/moderation
- OpenAI Image Generation API: https://developers.openai.com/api/docs/guides/image-generation
- Railway PostgreSQL: https://docs.railway.com/databases/postgresql
