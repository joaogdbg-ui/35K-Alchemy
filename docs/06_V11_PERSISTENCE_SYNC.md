# Gameverse Infinite V11 — persistence & sync

## Scope delivered
- PostgreSQL `PgStore` implementation with parameterized queries, reviewed transactions, consistent pair keys, candidate review and world-first event insertion.
- `003_runtime.sql` for secure opaque anonymous sessions (only SHA-256 hashes in DB), persistent per-account AI daily quota, and moderated candidate staging.
- Player endpoints: create/delete anonymous identity, import/retrieve personal discoveries (paginated), optional public handle; world feed hides handle unless opted in.
- V11 client: manual server connection, anonymous session provisioning, legacy collection upload and reconciliation, generated element/recipe local cache and offline fallback.
- Existing 1,591 elements, 1,735 recipes and V1/V2 drag, auto-combine, left lock maintained.

## Local workflow

```bash
cd Gameverse_Infinite_V11_Project
# Local PostgreSQL only if Docker is available:
docker compose up -d postgres
cd server
npm install  # needs package registry access
export DATABASE_URL='postgres://gameverse_dev:change_me_local_only@127.0.0.1:5433/gameverse_dev'
npm run migrate
export HOST=127.0.0.1 PORT=8787 APP_ENV=development DEV_ALLOW_ANY_ORIGIN=true
npm run dev
```

For zero-dependency tests, leave `DATABASE_URL` blank; server uses **ephemeral memory** and no `pg` import. `node --test test/*.test.mjs` uses only native Node features.

Open `client/standalone.html` as a downloaded file or serve `client/`; offline combinations work. In Settings, connect to a trusted local development API. The app **only creates an anonymous account after an explicit Connect action**. Previously connected accounts will sync when reopened. A mobile browser on a different device cannot use `localhost` to reach your workstation: configure a secure reachable endpoint first and do not expose this development API on the public internet.

## API example

```
POST   /v1/session              -> {playerId,token,expiresInDays}
DELETE /v1/session              Authorization: Bearer <token>
PATCH  /v1/me/profile           {publicHandle,displayPublicly}
GET    /v1/me/discoveries       ?limit=200&cursor=...
POST   /v1/me/discoveries       {ids:[...]}
POST   /v1/combinations/resolve {leftId,rightId}
GET    /v1/catalog              ?limit=25&cursor=...
GET    /v1/world-discoveries    ?mode=latest|first&limit=25&cursor=...
POST   /v1/reports              {elementId,reason}
GET    /dev/pending             X-Demo-Admin-Token: ...
POST   /dev/approve             {candidateId} + X-Demo-Admin-Token
```

Approved seed pair → immediate approved response; missing pair with disabled AI → no_match; missing pair with AI configured → `pending_review`, never auto-published. Only an admin-reviewed candidate can become public. When an element is truly novel, one world-first record and one review-pending icon job are created in a transaction.

## Image pipeline status
`icon_jobs` is a durable queue, not an already running worker. `icon-provider.mjs` can request PNG drafts when given authorized credentials, but never auto-publishes files. Object storage, resized 256/128 art, visual quality checks, rights reviews, queue retries and a signed asset CDN remain work for the next stage.

## Limitations / release blockers
1. **Not production-safe**. Public deployment is deliberately blocked in `server-v11.mjs` (host restriction and `APP_ENV=production` guard). More robust antifraud, verified user recovery, incident monitoring and human moderation are required.
2. `pg` dependency could not be installed and no PostgreSQL daemon was available in the packaging environment. SQL migrations and PG adapter have NOT been integration-tested against a live DB here. Explicitly run the migration then integration tests in a local Docker/real PostgreSQL staging setup before deployment.
3. Abuse prevention against anonymous session cycling needs independent IP/device protections and a spending cap. AI text/images are provider-billed; keep AI off until configured.
4. Client sessions are in browser localStorage; they can be lost on app data clearing, and are vulnerable to script compromise. Harden with CSP, packaged trusted assets, secure native storage and recovery before release.
5. User-imported legacy discoveries are accepted as self-claims, **not** proof of a world first or leaderboard rank. World first attribution arises only from moderated generation.
6. User-facing reports, manual review tooling, privacy/terms, content policy compliance, data retention, and consumer purchase configuration are not production-complete.
7. World `trending` is intentionally empty until backed by meaningful authenticated metrics; no imaginary activity is shown.

## Seed nuance
The V10 normalizer collapses the `+` in **Atari 2600+ / Atari 7800+**. V11 reserves canonical keys `atari 2600 plus` and `atari 7800 plus` for their `legacy:1416/1417` records while preserving both display names and all stable identifiers.
