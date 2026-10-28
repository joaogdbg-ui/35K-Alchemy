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
