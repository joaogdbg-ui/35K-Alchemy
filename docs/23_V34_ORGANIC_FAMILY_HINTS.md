# V34 — Organic expansion and actionable discovery hints

## Player promise

The goal is to make mixing rewarding by logic rather than blind guessing. The growth chain of plants, pollination, beekeeping, weather, electricity and game creation is handcrafted. Natural combinations may have alternative valid ingredient paths. No random combination generator is used to inflate counts.

## Additions

- 30 individual elements in `organic-pack-v34.js` with stable `organic34:` IDs and concise English descriptions.
- 89 unique, unordered recipes. The generator intentionally skips any candidate pair already defined in a previous catalog and validates at least two valid results per new item. Reproducible source is `tools/build-v34-organic.py`.
- 30 distinct purpose-drawn, inline, static SVGs in `organic-art-v34.js`, prioritized by `staticArt` over legacy art or genre heuristics.
- Additional brief humorous first-discovery lines. No additional tabs or heavier animation.

## Hints

- Global Compass: calculate suggestions from currently owned ingredients; prioritize unseen recipe hints until no unseen alternatives remain; never silently unlock an element from a hint.
- Family hint: require `ready===2` (both ingredients owned). When viewing a themed collection, candidates must belong to that same collection rather than just the parent family.
- If no actionable recipe exists, disable the action; if the player already owns an actionable revealed recipe, allow viewing it again without a new rewarded ad.
- In an APK, only the actual native reward callback may grant the recipe. No credits, timers, fake ad completion or web shortcuts. The HTML alone has no rewarded ad functionality.

## Validation and next tasks

Reachability, historic collision guards, icon uniqueness, saved progress, browser widths, gameplay and mock ad contract are tested. Real Android AdMob SDK + UMP integration and device QA are **still necessary**, not silently asserted complete.
