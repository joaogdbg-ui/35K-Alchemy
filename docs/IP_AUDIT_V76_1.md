# 35K Alchemy — V76.1 editorial IP-risk audit (29 Oct 2026)

## Scope and known limitations
Historical catalogue strings contain many real console brands, game franchises, characters and titles. The V49 keyword report flagged **495 source items** in a smaller 3,963-item catalogue; that was *not* a clearance and did not rename anything. V76 adds new hardware references. Product names and brand identifiers usually raise **trademark / confusion** issues; artwork, expressive character likenesses, game art, music and audiovisual content raise **copyright** issues. Neither a changed spelling nor an original tracing guarantees clearance.

## Implementation
- Fictional, non-affiliation labels are now produced centrally by `client/src/ip-safe-names.js` for player-facing element names and other themed text. Sample changes: PlayStation → **Qelvorune**, Nintendo Switch → **GlidePort**, Xbox → **Zerqadyn**, Game Boy → **PocketNova**, Mario → **Mosskip**, Pokémon → **Critter Atlas**.
- Do not adopt PolyStation or Soarnic as cleared: both were explicitly rejected as too close in the V49 naming policy.
- Keep all historical immutable IDs and every recipe untouched. Internal source references and older archive files may retain original names for saves, historical recipe lookup, art lookup and audits. Do not use those identifiers in storefront artwork or promotional text.
- Screen public labels and V76 embedded SVG content with `node tools/audit-ip-safe-names.mjs`. It is a heuristic **release gate**, not independent legal certification.
- Previous original vector images have not been certified safe by a person. Before commercial launch, visually compare *every* icon resembling a proprietary console, character, emblem or logo and redraw or replace any confusingly similar design; include screenshots, sounds, app icon, store listing, and third-party dependency licenses.
- **V76 implemented:** 39 branded source item names, 39 corresponding SVG asset paths, all five active SVG maps, approved manifest, five batch manifests and art-review gallery have been migrated in sync. All 50 immutable IDs and recipes have been preserved; source paths and public labels now match.

## Additional code audit observations
- `buildCatalog` already rejects duplicate IDs, normalized names, unordered formula conflicts, and unreachable elements.
- The application uses offline saved IDs, independent campaign progress, virtualized scrolling and a reusable Android test-only signature; retaining these is mandatory.
- Rewarded-ad native SDK, server verification, privacy consent, production signing/AAB, physical device QA, and license/IP clearance remain **open release blockers**. Do not describe the debug APK as store-ready.

## Primary policy reading
- Google Play Intellectual Property: https://support.google.com/googleplay/android-developer/answer/9888072?hl=en
- EUIPO likelihood-of-confusion guidelines: https://guidelines.euipo.europa.eu/2319054/1983183/trade-mark-guidelines/1-introduction
- U.S. Copyright Office names and short phrases: https://copyright.gov/help/faq/faq-protect.html

**No automated scan can guarantee absence of trademark or copyright risk.** An independent legal and visual review is still required before publishing.
