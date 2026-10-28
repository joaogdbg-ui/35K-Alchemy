# Gameverse Infinite V17 — cross-session delivery and persistent pending inbox

## Product behavior

Gameverse keeps the V16 UI controls (tap to slot, direct drag, lock-left, auto-combine, static colored cartoon icons) and personal progression. V17 changes **delivery** of a previously unseen pair: every authenticated guest who attempted a pair subscribes to that *one* global candidate. After AI suggestion and manual approval, every subscriber receives the approved result. Only the original approved World First creator receives the World First mark.

**Offline mode unchanged:** the entire curated set (1,652 elements, 1,809 recipes) works in a single HTML file. The online world, cross-device delivery and candidate creation need a deployed server.

## New database migration

`cloudflare/db/migrations/0003_candidate_waiters.sql` adds:

- `candidate_waiters(candidate_id,player_id,created_at)` with `(candidate_id,player_id)` unique.
- An index to query each player's pending queue efficiently.
- Backfill for creators of older queued V15/V16 candidates, without assigning new World Firsts.

When a player requests an existing pending pair, they are subscribed, **not charged another inference**. On approval, an atomic D1 batch records the shared recipe and a personal unlock for all existing subscribers. This preserves the first-creator attribution. Every account may acknowledge delivery independently. Account deletion removes that guest's subscriptions.

## New API endpoints

- `GET /v1/me/pending?limit=100&cursor=N` with guest Bearer token returns the calling player's subscribed candidates and their states. A completed entry includes approved `result`, `leftId`, `rightId`, and a World First Boolean verified by the server.
- `POST /v1/me/pending/ack` with `{candidateIds:["uuid",...]}` removes only completed/rejected deliveries for the caller. Never removes a still-pending subscription, nor one belonging to another player.

No public or anonymous access to draft suggestions. Existing endpoints, IDs and recipe precedence unchanged.

## UI delivery rules

- A subtle `N pending` chip appears only when the session actually has pending jobs.
- At initial connection the game checks the inbox, and then updates the personal collection.
- While visible and with pending requests, check one inbox endpoint every ~90 seconds, not one request per pair. Hide/idle screen does not repeatedly poll.
- Approved discoveries are saved to the offline dynamic element/recipe cache and to the local personal ledger, so the result remains usable after reconnect. A short 'New discovery ready' toast replaces disruptive surprise modals.
- Completed deliveries are acknowledged after local state is stored; if request fails they can be redelivered, but cannot increment the personal count twice.
- World First still comes exclusively from server-verified `world_firsts` data.

## Local two-player simulator

Node 22+ required. Run from the `cloudflare` directory:

```bash
npm run staging
```

Open `http://127.0.0.1:8788/` in a browser on that same computer, then Settings -> API URL `http://127.0.0.1:8788` -> Save & connect. Separate browser profiles/incognito windows yield separate guest identities. The backend uses the real Worker handler and a **file-backed SQLite test database** in `.staging/`; it does not use real D1 or Cloudflare Workers AI. Its AI feature is **disabled**. Manual review requires the development admin workflow; use the automated tests to validate approval without exposing admin secrets.

**Security:** binds loopback only, intended exclusively for local staging. Do not port-forward it or expose it to the Internet. Never copy `.staging` or secrets into a public repo/ZIP.

Run `npm test` in `cloudflare` for the persisted 2-player approval test, and `npm test` in `server` for legacy regression. For real deployment follow `cloudflare/README.md`, configure a Free Cloudflare operator account, apply all 3 migrations and the seed, leave AI disabled until real model/billing/quota behavior is verified. D1 `batch()` is transactional per Cloudflare documentation, but local SQLite success does not replace real D1 concurrency testing.

## Known limitations / required for release

No Cloudflare deployment or real AI invocation has been carried out; Cloudflare account access and explicit owner setup remain required. Admin approval concurrency, anti-abuse on session creation and candidate subscriptions, structured safety and IP rights screening, GDPR retention/backup, production monitoring, guest recovery, load testing and approved-client HTTPS connectivity remain pre-release work. Users should not be promised instant AI synthesis or unlimited free quotas. The local browser automation environment blocked direct navigation to `localhost`, so interactive browser rendering was checked separately from real HTTP two-guest API tests.
