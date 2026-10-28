# 35K Alchemy — V49 fictional naming and IP review

## Decision
Humorous, invented names can be used (e.g. the user's suggested *PolyStation* and *Soarnic*), but a small spelling change is **not legal clearance**. Those two examples are candidates **not cleared for shipping**. Both names and audiovisual presentation matter. Google Play can remove apps that infringe third-party intellectual property or falsely imply affiliation.

## Recommended editorial rules
1. Prefer names that are creatively and visually distinct from existing entertainment characters and brands; humour may be retained without copied identities.
2. Review every proper name, title, game/console name, character, logo-like glyph, costume, silhouette, artwork, and marketing screenshot. An independently drawn image can still evoke a protected character too closely.
3. Screen the new names for collisions with **our catalog**, and search official trademark registries (EUIPO / national / WIPO) and relevant commercial usage. Screening is not a guarantee.
4. Keep each internal immutable element ID and its recipe targets stable. Plan renaming as an explicit editorial migration of display labels, not as rewriting recipe IDs or auto-remapping the existing catalog.
5. Do not use a generic regex to replace `Sonic`, `PlayStation`, etc. inside thousands of names. It can create duplicate names and unintelligible chains. Curate concepts and corresponding recipes as a set.
6. Differentiate **a fictional inspired concept** from **a renamed reference to the original work**. Replacing the text of a famous character while displaying that character's likeness is not adequate.
7. Re-run anti-duplicate, reachability and UI tests after every approved batch of name/art revisions.
8. Do not state that a particular fictional name is trademark-safe without an appropriate search and counsel. Keep a review status for proposed names.

## Status V49
`tools/audit-ip-names-v49.mjs` creates `shared/v49-ip-name-screening.json` with potential keyword matches. It is only a prioritization list. **No catalog display name has been changed** in V49 because the user asked whether a fictional naming policy is possible, not to approve an exhaustive mapping.

## Authoritative background (checked 28 Oct 2026)
- Google Play IP policy: https://support.google.com/googleplay/android-developer/answer/9888072?hl=pt
- Google Play impersonation policy: https://support.google.com/googleplay/android-developer/answer/9888374?hl=en
- EU trademark regulation 2017/1001 (Article 9): https://eur-lex.europa.eu/eli/reg/2017/1001/oj?locale=pt
