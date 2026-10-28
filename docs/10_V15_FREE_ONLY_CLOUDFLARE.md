# Gameverse Infinite V15 — Free Only Cloud Architecture

**Status:** implemented prototype, integration-tested against local SQLite mock and fake Workers AI, **not deployed**.

## Fixed product decisions

1. Free Only by default: no paid API accounts, no external provider keys, no billing gateway and no LLM on Android. The owner operates one Cloudflare account, normally Workers Free.
2. Guest player: cryptographic random 256-bit bearer token, SHA-256 digest persisted in D1. No player AI-provider registration.
3. Approved recipes take priority, then client-side semantic redundancy. Unknown unordered pairs are persisted in a deduplicated durable D1 queue.
4. Cron dispatcher selects from a configurable, explicitly vetted Workers AI allowlist. A model error or bad-format response can trigger fallback. A safety block must **not** trigger fallback that seeks an unsafe output from another model.
5. Successful proposals never instantly become public. Manual review (including intellectual property, defamation, real people, and minors) is necessary; publication atomically associates pair with result and records World First when a genuinely new entity is approved.
6. Icon system remains local and static. Any generated item uses its inherited `iconFamily` + `paletteVariant`. No per-image AI expense.
7. When all models fail or free quota is exhausted, keep the job deferred; when the player's submission quota is exhausted, return an honest `capacity_limited` result without claiming the pair is queued.
8. Existing recipes stay playable offline; the client is not tied to an online server for every drag gesture.

## Request sequence

Gameverse client -> local cache -> POST resolve -> D1 approved recipes -> D1 existing job -> rate-limited enqueue -> scheduled Worker -> free-model A -> fallback B/C/... (shared daily pool) -> basic validation -> manual moderation -> D1 approved recipe and World First -> all other players reuse it from DB.

## Operational guards

- Browser's trusted origin must be on a literal allowlist; don't accept `*` or `null` in production.
- No Worker-exposed paid API credentials; database guest tokens are hashes, not raw tokens.
- `AI_ENABLED=false` initially. No auto-toggle to paid.
- Default daily AI attempt cap: **30 total attempts**, not 30 pairs (fallback attempts count).
- Session/IP rate limits and pair/IP/player quotas are in D1, plus add Cloudflare WAF/Turnstile before public release.
- Only admin can publish or flag new generated elements. Report endpoint allows anonymous guests to report offensive, misleading and infringing items.
- Existing D1 data and asset licenses must be reviewed prior to production; local prototype's legacy icon pack is independent of this backend.

## Validated data

Legacy: 1,591 element IDs, 1,735 recipes, in fixed order.
Curated V14 additions: 61 element IDs, 74 recipes.
Combined Cloudflare seed: **1,652 elements, 1,809 unique recipes** with exact-original precedence.

## Launch checklist

Cloudflare account and D1 setup; local/remote Wrangler migrations; remote seed; exact allowed origin; configure secrets; deploy to test URL; verify mobile session and sync; verify real quota behavior; verify actual AI model response shapes; build proper admin console and human workflow; stress-test; harden bot controls; privacy/GDPR and rights review; make the HTML client accessible over HTTPS; build Android package; policy tests; only then turn on AI requests with measured capacity. Avoid suggesting guaranteed 0 cost if the operator activates a paid tier or optional products.
