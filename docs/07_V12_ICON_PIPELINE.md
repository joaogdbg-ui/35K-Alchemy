# Gameverse Infinite V12 — icon pipeline and operator review

## Goal
Convert a newly approved AI discovery into a colorful **static** cartoon icon, with consistent style and human review, without stalling touch gameplay or exposing private drafts.

## State machine

1. Candidate generated / moderated → `pending_review` (text). All new AI candidates require human approval.
2. Operator approves candidate → global element + deterministic recipe + `icon_jobs` row with status `queued`.
3. **Separate opt-in** worker claims one job (`queued` → `processing`) using PostgreSQL `FOR UPDATE SKIP LOCKED`; stale processing jobs can be reclaimed before three attempts.
4. Image provider generates one 1024×1024 transparent PNG according to `gameverse-cartoon-v1` style lock.
5. PNG is checked for RGBA, square dimensions 256–2048 and size ≤15MB, stored privately and marked `needs_review`.
6. Operator opens admin/review.html locally, enters HTTPS staging URL + long admin token; only admin can view draft and approve/reject.
7. On approval, optional `sharp` processor creates 256×256 and 128×128 WebP assets, and database switches `elements.icon_status` to `ready` with its asset key. Only then public image URL works.
8. Client keeps its existing category-specific colorful placeholder until icon is ready, then uses the served static image.

No sprite frames, no animated media. Historical seed retains its existing 1,591 unique static SVGs.

## Setup

From project root (local staging):

```sh
docker compose up -d postgres
cd server
npm install
export DATABASE_URL='postgres://gameverse_dev:change_me_local_only@127.0.0.1:5433/gameverse_dev'
export APP_ENV=development HOST=127.0.0.1
npm run migrate  # 001,002,003,004
npm run smoke:pg
npm run dev
```

Configure a **long, random** `DEMO_ADMIN_TOKEN` locally. Open `admin/review.html` from your machine. The secret stays only in memory on this page. Do not publish the admin tool on the internet.

To process **one** pending icon only after explicitly consenting to paid API requests:

```sh
export OPENAI_API_KEY='...'
export OPENAI_IMAGE_MODEL='gpt-image-2.5-flare'
export ICON_WORKER_ENABLED=true
export ICON_STORAGE_ROOT=./private-icon-storage
npm run icons:one
```

`OPENAI_IMAGE_MODEL` is configurable; verify pricing, availability and your account before running. The client NEVER receives the API key or private drafts. Image generation can cost money. No automatic worker loops or production deployment included.

## Admin endpoints (local/staging only)

- `GET /dev/pending` — AI text candidates
- `POST /dev/approve` / `POST /dev/reject` — operator candidate decisions
- `GET /dev/icons/queue` — icon draft review queue
- `GET /dev/icons/draft/:jobId` — protected private PNG
- `POST /dev/icons/approve` / `POST /dev/icons/reject` — operator decision
- `GET /v1/icons/:elementId` — public WebP **only when approved**

Admin endpoints require an `X-Demo-Admin-Token`; the server by design refuses production environment and public binds. Do not equate this single shared token with sufficient production authentication.

## Limitations / next steps

- PostgreSQL adapter and migrations were **not live-tested** in this execution environment; Docker/PostgreSQL daemon and npm dependencies were unavailable.
- `sharp` dependency is declared but not installed here; live raster transformation/approval still needs validation.
- Private storage is local filesystem, suitable for **staging only**, not durable when containers restart. Next phase: S3/R2 object storage with private/public buckets and CDN, checksums, signed admin review.
- PNG header/alpha checks are structural; they do not guarantee true transparency or artistic quality. Add image QA, perceptual duplicates, caption consistency, licensed-image checks and manual moderation.
- A crash after a worker has incremented the third attempt can leave `processing`; implement lease heartbeat/dead-letter sweep and operational monitoring before production.
- For public launch: real operator login/MFA, CSRF/CSP, per-account anti-abuse, full content and rights policy, real-person safeguards, appeals, billing ceilings, documented retention/privacy and developer account verification.
