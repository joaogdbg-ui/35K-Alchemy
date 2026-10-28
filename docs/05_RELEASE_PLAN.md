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
