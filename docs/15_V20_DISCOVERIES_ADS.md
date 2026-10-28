# Gameverse Infinite V20 — Discoveries, secret collection and hint rewards

## Objective
The gameplay and original catalog from V19 are unchanged. V20 replaces the standalone Recipe Book tab with a discovery-first module including a browsable catalog by family, locked `????` elements, progress tracking and an integrated Recipe Book subtab.

## Families
Nine stable and mutually exclusive families:

| Family | Assigned categories | Notes |
|---|---|---|
| Video Games | game, genre | Main focus |
| Consoles & Hardware | console, portable, computer, technology, brand, accessory | Main focus |
| Arcade & Tabletop | arcade, board | Main focus |
| Anime & Manga | anime, manga, character, power | Cross-media |
| Cinema & TV | film, series | Cross-media |
| Music | music | Cross-media |
| Nature & Science | nature, material, life, science | Starting tree |
| Fantasy & Objects | fantasy, object, concept | Original elements |
| People & Culture | politician, culture | People and historical context |

IDs and category associations are implemented in `client/src/discoveries.js`, independently of how many future items are added. Each catalog entry maps to one visible family; the module shows category-level progress without revealing unearned element names.

## UI behavior
- Family overview shows an illustration, collected/total and progress bar. Only visible rows are rendered in the collection detail.
- `All`, `????`, `Found` filters and search for **already discovered names only**, to avoid search spoilers.
- Opening an unknown element displays `????`; no hidden name or icon is rendered to the user.
- Opening a known element offers direct insertion into the crafting slots.
- `Get hint` and `Reveal recipe` pick a target within the active family. A hint shows one known ingredient; a recipe shows the complete ingredient pair but the result remains `????` until crafted.
- Recipe Book displays recipes the player has successfully created. Revealing a recipe does not add it to the discovered recipe count or grant the output element.

## Reward design
- Offline builds start with **2 free clue credits** and earn **+1 credit every 12 personal discoveries** (starters excluded).
- A partial hint costs 1 credit; a recipe costs 2 credits. Free balances and revealed clues are persisted under `gameverse_discovery_hints_v20`.
- Ad-watching alternatives appear alongside the free options, but are **disabled in the standalone HTML**. A native rewarded SDK must be configured to enable them.
- Only a native adapter returning `{earned: true}` after the SDK's actual reward callback is accepted. Ad dismissal, failure or an unavailable ad do not grant a clue. No real ads are shown in this version.
- Native scaffolding is located under `android/rewarded-ads/`. The sample uses Google's test ad ID; do NOT publish the sample as a monetized integration, and follow the SDK installation, consent, privacy and production-ID steps first.
- Because this is a fully offline game, the local clue economy can be modified in a tampered app. Do not base real-money or globally competitive rewards on it.

## Offline and performance
- **0 network requests, 0 AI calls, no running server** for this HTML game.
- Native ad requests would occur only after a user voluntarily selects the rewarded option; ordinary gameplay remains offline.
- UI virtualizes the missing/discovered grid. Recipe-to-result reverse indexing is cached to keep hint retrieval fast as the catalog grows.
- New category/family elements do not create animation frames.

## Roadmap / open items
- Complete real Android Capacitor packaging, AdMob SDK setup, consent flow, production identifiers and sandbox testing on devices. Rewarded ads are not usable within standalone HTML.
- Decide whether recipes unlocked by a rewarded ad should be permanent across reinstalls; offline backup/export should be addressed before launch.
- On future content expansions, update category-to-family mappings and rerun consistency tests. The V20 catalog stays at 2,788 elements / 5,078 recipes.
