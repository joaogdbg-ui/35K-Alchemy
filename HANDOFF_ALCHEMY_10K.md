# Alchemy 10K — V82 candidate handoff (29 October 2026)

## Branch, goal and release truth
- Development branch: `feature/alchemy-10k-mythology-prehistory`.
- V81 baseline on main: SHA `2aba8395f48082964bc2af2ff20a468c56dd464b`, **5,812 original elements and 14,149 recipes**.
- V82 authored candidate: **+200 permanent IDs and +200 new unordered global recipes**, giving **6,012 elements / 14,349 recipes** when passed and merged. This is the FIRST of 21 planned +200 expansions from V81; after V82 the goal of >=10,000 needs 20 more complete deliveries.
- V82 catalog mix: **93 mythology and 107 prehistory items**, all with exact source SVG files, entries in `client/src/organic-art-v82.js`, unique primary recipes and explicit familyCampaigns metadata.
- Manifest `shared/v82-approved.json`: `expansion_progress=200`, `remaining_to_goal=0`, `cycle_complete=true`, `status=QA_PENDING_UNMERGED`. **Not published, not merged, no V82 APK**.
- Rebranding: public `Alchemy 10K` display title, but original Android `appId=com.joaogdbg.alchemy35k` and legacy save keys intentionally retained.

## Content and quality details
- Greek, Roman, Norse and Egyptian mythologies: pantheons, public-domain deities and original interpretations of ancient creatures, places and artifacts.
- Dinosaur families: theropods, sauropods, armored, ceratopsians, hadrosaurs; also pterosaurs, marine reptiles, Paleozoic life and Ice Age mammals.
- 120 individually composed original illustrations; 80 species-parameterized anatomical SVGs (renderer: `tools/v82-fauna-renderer.js`), each with distinct vector source and morphological input.
- `Hades the God` is distinct from prior `legacy:941` Hades game. `Fossilized Dinosaur Egg` is distinct from `pack:dinosaur-egg`, a franchise prop. Internal new IDs remain immutable `organic82:hades` and `organic82:dinosaur-egg`.
- Every SVG is independently stored at `client/assets/v82/<id-suffix>.svg`; the [full 200-item thumbnail contact sheet](docs/V82_ART_REVIEW.md) renders 35px and 90px views for human/device art review.
- Primary recipes must be semantically sensible and globally unique. Confirm end-to-end before release: source-only static checks do not establish real gameplay quality.

## Four Family Only closures, checked directly from source
| Campaign | Reachable / total | Internal global-compatible recipes |
|---|---:|---:|
| Nature & Science | 476/476 | 1,781 |
| People & Culture | 211/211 | 266 |
| Mythology & Gods | 109/109 | 105 |
| Prehistory & Dinosaurs | 116/116 | 112 |

- All four use four starter IDs and are independently craftable according to source-derived recipe graph traversal. New mythology starts Human, History, Magic, Sky; new prehistory starts Animal, Stone, Life, History. Nature still has the historical defect that its starters coincide with Classic; address separately without silently changing progress.
- No new family-specific alternative A+B result. Earned multi-family IDs share one stable identity, Classic save/progress remains separate, free family starter IDs do not transfer as earned discoveries. Optional merge still requires 2 actual verified rewarded ads with saved 1/2 credit.

## Committed content and code
- `client/src/organic-pack-v82.js`, `client/src/organic-art-v82.js`, `client/assets/v82/*.svg`, `shared/v82-approved.json`.
- Authoring inputs: `tools/v82-greek-authoring.js`, `tools/v82-roman-authoring.js`, `tools/v82-norse-authoring.js`, `tools/v82-egypt-authoring.js`, `tools/v82-prehistory-foundations-authoring.js`, `tools/v82-fauna-dinosaurs.json`, `tools/v82-fauna-other.json`, `tools/v82-fauna-renderer.js`.
- App + offline integration: `client/src/app.js`, `tools/build-standalone.py`; active art scan includes V82.
- Gates: `tools/validate-v82.mjs`, `tools/audit-v82-art.py`, `client/test/v82-content.test.mjs`, historical V80/V81 regression updates, and `tools/check-content-batch-200.mjs` with specific original art modes `bespoke-subject` and `species-specific-anatomy`.
- Marketing/review: `docs/V82_ART_REVIEW.md`.

## Verified versus pending
**Done:** 200 committed candidate IDs and unique visual source files, four source-level isolated family traversals, no conflicting output found among inspected foundation/catalog subsets, preexisting name collisions resolved, old unchanged code kept in branch. Previous exact candidate name scans covered 46 historical catalog modules.

**Not done:** local complete repo checkout; full historical `node tools/validate-v82.mjs` execution; `npm test`; `python tools/audit-v82-art.py`; end-to-end HTML build; 35px physical Android light/dark visual review; CI; Android APK build and signing; full revenue/cloud/leaderboard integrations. Do not claim CI green or a released V82 APK.

## Combiner motion (V83 technical change, zero new elements)
- Three tile animations now run on fixed-position ghost tiles appended to `<body>`, never on the real slots: the slots are cleared the instant a pair resolves, so tapping the next ingredient is never delayed (`captureCraftScene` → `finishSlots` → `playCraftMotion` in `client/src/app.js`; CSS `.craft-ghost` in `client/src/styles.css`).
- No recipe: the right tile slides until it touches the left one, bounces back and fades out; no sound, toast or feedback line (unchanged rule).
- Already discovered: the right tile slides onto the left one, the result tile pops and floats up; the existing "Already discovered" feedback line is the only message.
- New discovery: the merged result tile floats up and morphs into the artwork of the discovery window while the window fades in; the window still closes only with X.
- V83.1: the discovery art is drawn at its final size over the window art and scaled up from the tile art, so it ends pixel-identical (no size snap, no blur).
- A new ingredient entering a slot dismisses only the ghost covering that slot; `prefers-reduced-motion` disables all of it. Durations total under 0.9 s for a new discovery and under 0.5 s otherwise.
- Checked locally in headless Chromium at 360×640, 390×820 and 1280×820 (light and dark, locked left, rapid consecutive pairs, no page errors) and with `npm test` (330/330, new `client/test/v83-combiner-motion.test.mjs`). Not yet checked on a physical Android device.

## V84 interface redesign (30 October 2026, owner request)
- `client/src/styles.css` rewritten as one system (tokens, warm paper + white cards, slate outlines matching the icons, one ochre accent); `client/index.html` restructured. All element IDs and functions kept.
- Play: one combiner card (two slots, corner lock, status line, Hint · ad / Batch row); search always visible; filter chips on the shelf (sort, family, All / To explore / Completed / Saved); Sort sheet keeps order + list size.
- Collection (tab label; `data-view="World"` unchanged): progress card, family grid, themed collections carousel, family detail with scrollable chips ("Missing" instead of "????").
- Dialogs are bottom sheets on phones, centred cards from 850 px. Settings order: Sound, Theme, Game mode, Progress (backup/restore/delete), Google Play Games, Help, Privacy & ads.
- Old V71–V76 layout nudges (`.craft-row{transform:translateY(9px)}`, workspace flex-basis clamps) are gone; their validators/tests now assert the `.craft-card` layout.
, owner request 30 October 2026)
- Owner chose the V83 art direction for the whole game, replaced in waves, earliest-seen first. Mechanism: `client/src/art-redraw.js` (`ART_REDRAW`, keyed by stable element ID) is checked first in `staticArt()`; names, recipes and saves are unchanged.
- Sources: `tools/art-redraw-manifest.json` ({id, name, file, wave}) + `client/assets/redraw/*.svg` → `python tools/redraw-assemble.py`. Gates: `tools/validate-art-redraw.mjs` (in the build), `tools/audit-art-redraw.py` (perceptual pairs), `client/test/art-redraw.test.mjs`. Style kit + illustrator brief: `docs/ART_REDRAW_KIT.md`.
- **Wave 1 (done): 1,080 icons** — every element of Classic generations 0–5 plus all older Mythology & Gods and Prehistory & Dinosaurs members. **Wave 2 (done): 941 icons** — Classic generations 6–7. Total redrawn: 2,021. Remaining ≈3,990 older icons, in Classic generation order (gen 8: ~483, gen 9: ~393, gen 10: ~767, gen 11: ~646, gen 12+: ~1,900). Reviewed false-alarm pairs for the perceptual audit live in `tools/art-redraw-reviewed-pairs.json`, ~27 icons per illustrator batch with contact-sheet review.
 (+200, 30 October 2026)
- 100 Mythology & Gods + 100 Prehistory & Dinosaurs → **6,212 elements**; families Mythology & Gods 209/209 and Prehistory & Dinosaurs 216/216, independently completable.
- Sources: `tools/v83-blueprint.json` (names, recipes, summaries, witty lines, art briefs), `tools/v83-alt-recipes.json` (36 alternative in-family recipes), `client/assets/v83/*.svg`. Generated by `python tools/v83-assemble.py` → `client/src/organic-pack-v83.js`, `client/src/organic-art-v83.js`, `shared/v83-approved.json`.
- Gates: `tools/validate-v83.mjs`, `tools/audit-v83-art.py` (also perceptual near-duplicates vs V82), `client/test/v83-content.test.mjs`, `tools/check-content-batch-200.mjs`. Review: `docs/V83_ART_REVIEW.md`. Long-term plan: `docs/V83_MYTH_PREHISTORY_LONG_TERM_PLAN.md`.
- New items may carry `wit`; `wittyDiscovery()` falls back to it.
 (V83 technical change, zero new elements, 30 October 2026)
- Google rewarded TEST ads packaged in the APK (`native/android/GameverseRewardedAdsPlugin.java`, `tools/configure-android-admob.py`); Settings → Privacy & ads.
- Settings → Progress: Export backup (Android share sheet via `native/android/AlchemyBackupPlugin.java`, browser download, or copyable code), Import backup (file or pasted code), Delete progress (Classic / all Families Only / everything, double confirmation, settings kept).
- Discovery popups show the witty line or, failing that, the element's summary (4,421 elements have one).
- Sort sheet is now Sort & filter: Show All / To explore / Completed ★ / Saved, View Normal / Compact (3 columns at 390 px).
- Timed hint: one free recipe hint every 10 minutes only when no ad can be shown (owner decision; rule 7 in `docs/WORKING_RULES_PT.md`).
- Discoveries header shows the player's collection (X / total · %) instead of the 10K development goal.

1. Run `npm test`, `node tools/validate-v82.mjs`, `python tools/audit-v82-art.py`, `node tools/audit-active-artwork.mjs`, and exact +200 Git diff gate against baseline.
2. Run `python tools/build-standalone.py` and verify output `Alchemy_10K_V82_WIP_Offline.html` plus legacy output for Android compatibility.
3. Inspect the 200 thumbnails at 35px in dark/light mode at 320/360/390px and audit distinct recognizable silhouettes.
4. One draft pull request and its one planned CI run after 200; repair failures without unnecessary repeated Actions minutes.
5. Test on an actual Android device, publish a single verified release APK only after QA, CI and merge.

Preserve 200-per-batch policy and do not start another content release on top of unpublished unstable V82.

## V85 — complete family campaigns, Countries & Landmarks, Shiny, Remove ads (owner request 30 October 2026)
- **Every family is an independent campaign** (12 families): own 4 starters (never Water/Fire/Earth/Air), every member craftable with in-family recipes only. `client/src/family-campaigns-v85.js` builds the campaigns at runtime from the global recipe map plus `client/src/family-data-v85.js` (2,849 authored recipes + per-family starters/addMembers), generated by `node tools/v85-assemble-families.mjs` from `tools/v85-family-proposals/*.json` (brief: `BRIEF.md` there). New pairs are global (also valid in Classic) and never overwrite an existing pair. Nature now starts Sun/Sky/Cloud/Stone. Test: `client/test/v85-families-shiny.test.mjs`.
- **Countries & Landmarks** (`world`, category `geography`): +200 elements (`tools/v85-blueprint.json` → `python tools/v85-assemble.py` → `organic-pack-v85.js`, `organic-art-v85.js`, `shared/v85-approved.json`, `client/assets/v85/`), starters Continent/Color/Monument/Food, 240 members. Facts were written from general knowledge; spot-check before release.
- **Family mode looks different**: green banner above the combiner (family art, name, progress, Merge button), green-tinted combiner and tab.
- **Merge both ways**: Families → Classic (existing V60 flow) and Classic → Families (`commitMergeToFamilies`), 2 rewarded ads each (1/2 credit saved), from the Play banner, the Collection button or Settings.
- **Mode-switch grace**: after a rewarded mode-switch ad, switching again within 5 minutes is free.
- **Shiny elements**: each successful combination (not Batch) has 1% chance (5% without ads) to make its result Shiny — twinkling overlay, Shiny filter chip, trivia card (`item.trivia`, else wit/summary). Saved in `alchemy10k_shiny_v1`, included in backups.
- **Remove ads** (Google Play Billing, `native/android/AlchemyBillingPlugin.java`, product id `no_ads`, owner price €1.50): no forced ads (mode switch, Batch, Merge free), 10-hint bank +1 every 15 min, optional ad for extra hints, 5% Shiny. **Owner must create the in-app product `no_ads` in Play Console**; until then the purchase button reports it is unavailable.

- **Art redraw wave 3 (V85, done): 3,991 icons** — every remaining older element. All 6,012 pre-V83 elements now use the 2026 art direction (`ART_REDRAW`), plus 200 V83 and 200 V85 originals. Six near-duplicates found by the audit were redrawn; 36 reviewed false alarms are in `tools/art-redraw-reviewed-pairs.json` (the audit now also honours them for V83 comparisons).

## V130 — feed and pet the second companion (1 November 2026)
- `swapInPlace()` swaps main/buddy roles without moving them (art, rails, layers and positions are exchanged). Dropping an element closer to the buddy (`hitTest`) or stroking it (own pointer handlers with pointer capture) swaps first, then runs the normal feed/petting flow. Tapping the buddy swaps in place and opens its card.

## V129 — rival companions in minigames have looks (1 November 2026)
- `rivalLook(seed,level)` (companion-engine) simulates a few themed meals (more meals, radiant depth and a second mixed theme at higher levels). games-v93 `opponentsFor(n,exclude,level)` stores one per rival (`rivalLooks`, `rivalLookOf`), marks rival elements `data-rival="1"`; app `wearAll` applies it via `companions.applyRivalLook` (filter key `<id>-rival`) unless the rival is one of the player's own companions with a real look.
- Roster reviewed (all 40 have body + head + legs rigs); owner confirmed all designs are fine, no sprite changes.

## V128 — saved look shown on launch (1 November 2026)
- Bug: on app start `setArt` called `ctx.wear(sprite.parentElement||sprite)` before the sprite was attached to a layer (wearAll only searches descendants) and while hidden (getBBox = 0), so the companion showed its plain look until the next meal. Fix: `rewear()` re-applies looks/belts on both layers one frame after `start()`/`startBuddy()`.

## V127 — game-like filters & settings, centred description, TEMP free duo unlock (1 November 2026)
- Alchemy filters: segmented view tabs with live counts (All / To find / Done ★ / Saved / ✦ Shiny) in `.view-seg`, then tool chips `.tool-chip` (⇅ sort, family with its artwork as icon, ◉ Looks) that light up when non-default. Counts computed in `syncInventoryButton()` (called from rerenderCollections). validate-v55 accepts `tool-chip sort-button`.
- Settings: AD-FREE banner (same `.bx-noads` as the combiner; OWNED when bought), "SAVE FILE" tiles (export/import/delete), "MORE" list with icon badges and a SOON tag. Same ids as before.
- `.discovery-wit` centred (justify-self/width fit-content).
- **TEMPORARY:** `SLOT2_TEST_FREE=true` in app.js makes the Duo "INSTANT" button unlock the second slot for "€0.00 · TEST" without Play, so the owner can test on the phone. Set to false (or remove) before the store release.

## V126 — game-like combiner & duo panels, Batch all, Remove ads €2 (1 November 2026)
- Family combiner sheet redesigned: locked element token × selected family art, family grid, two action cards ("<family> · N combos · ▶ 1 AD" and "All families · ▶ 4 ADS" with progress pips), and an AD-FREE banner (`billingPrice`, opens Remove ads). Free trial button removed (`batchTrialUsed` dormant).
- Batch all: `beginBatch('all',…)` scans every collected element; 4 rewarded ads (`kind:'batch_all'`, credit per locked element in `alchemy10k_batch_all_v126`), free with no-ads.
- Remove ads default label €2.00 — **owner must change the `no_ads` price in Play Console to EUR 2.00** (the app shows Play's formatted price when available).
- Home "Duo mode" locked card is now a game panel: main sprite + locked "?" slot, 3 perk tiles, INSTANT (price) and FREE PATH tiles (element progress bar to 2,000, then 20 ad pips).

## V125 — second companion slot + duo play, starter packs on the Alchemy screen (1 November 2026)
- Starter packs: "✦ Packs" button next to Hint in the craft card; sheet opens with a "why" box (companions/houses/furniture sooner) then the pack list. Removed from Settings (only Remove ads stays) and from the family filter.
- Second on-screen slot (`state.buddy`): unlocked by Play product **`companion_slot` (owner must create it in Play Console, EUR 1.00)** via `AlchemyBilling.purchaseCompanionSlot` (plugin now queries both products and reports `companionSlot`, `slotPrice`, `slotAvailable`; purchase results re-query all owned purchases so buying one never hides the other), or free at 2,000 Classic elements + 20 earned rewarded ads (`kind:'companion_slot'`, key `alchemy10k_slot2_v125`). Home → On screen shows a locked card / choose / change / send home. Tapping the buddy on screen swaps main and buddy (feeding stays on the main one).
- Buddy actor (`#companionBuddy`) walks/jumps the same rails, follows the main one, sleeps with it. Duo games from the main loop (~20% per tick after 18 s cooldown, or `requestDuo(kind)`): spar, throwing (random owned element), tag (across rails), hide-and-seek (behind cards), ball game (kicks/headers, last ball escapes). New rig states `duo-*` in styles.css (whole-body motion via individual translate/rotate with `--dir`, limbs via parts), `.duo-flyer` projectiles, `fx-impact`/`fx-spark`, new sfx whoosh/bounce/kick/giggle/count/found/peek/swish. Feeding/petting aborts a duo game.
- Duo bonus: all companion growth ×1.25 while two are on screen; idle finds count the duo as explorers (+0.9 rate, +3 cap) even without house residents.

## V124 — Classic only, family starter packs, Looks filter (1 November 2026)
- Owner decision: one game mode. Boot no longer shows the mode picker; `migrateFamiliesIntoClassic()` copies every Family Only discovery into Classic once (free, key `alchemy10k_classic_only_v124`). Mode button + family/classic banner hidden; Settings "Game mode" and "Merge" rows replaced by "Family starter packs". Family-mode code (activateMode, merge hub, modePicker) left dormant.
- Family starter packs (`starterPacks`/`buyStarterPack`): unlock a family's 4 campaign starters into Classic; 2 rewarded ads (`kind:'starter_pack'`, step credit kept in `alchemy10k_starter_pack_v124`), free with no-ads, explanatory modal in the HTML build (no simulated ads). Opened from Settings and from the family filter sheet. Verified family recipes are a subset of classic (0 extra/0 conflicts) and all 6612 items are classic-reachable.
- Looks chip in Alchemy filters: ??? Not fed yet, known colours (with swatch), known unlocked traits, bigger/smaller, resets — only from elements the player fed (`companions.tasted`, `companions.looksOf`).

## V123 — Collection tab removed (1 November 2026)
- Owner decision: the Collection tab only added complexity (Alchemy already has search, sort, family filter, Saved/Shiny/To explore, Merge, Hint with "try combination", element sheets). Nav button removed from index.html; `switchTab('World')` now falls back to Play. The hidden #viewWorld markup/renderDiscoveries code is left dormant (old tests reference it) — safe to delete later.

## V122 — looks in the after-meal window (1 November 2026)
- After a player-given meal the stat window gets a LOOKS block (`lookDiff(before,after,tintKey)`): Colour (swatch + tint name of the eaten element, k% before → after), Size, and each spot (Head/Back/Tail/Around) with trait % before → after, shrinking traits listed as "(morphing)"; resets as ↺ lines; "No change" otherwise. Window re-clamped and held 4.2s.

## V121 — hand-picked looks, hidden effects, silent powers (1 November 2026)
- Powers are purely visual: no "New power" note, no label/preview text (`powersOf` still drives `usePower`).
- Meal preview shows `???` for Grows/Looks until that element has been fed by the player once (`state.tasted[id]`; old saves count any `pet.fed` entry). `mealPreview().known`.
- `LOOK_OVERRIDES` + `LOOK_OVERRIDE_PREFIX` (themeFor): hand-picked fixes for regex false matches (Halo/Fire Emblem/KOF/Prince of Persia/Dragon Ball series, Phoenix Wright, Demon Slayer, Star Fox stays fox, etc.), re-themes (Ice Halo→ice, Rhythm Heaven→music, Hinokami Kagura→phoenix, Ice Cream→sweet…), and hand-picked names never trigger reset/wash/mirror (Dragon Egg Cradle, Black Sabbath, FFVII Rebirth, Meteor Shower…). Review list was made from all 6612 elements' theme matches.

## V120 — looks only from player feeding + signature powers (1 November 2026)
- `eatSequence(...,{self:true})` (companion eats on its own) no longer calls `lookAfterMeal`: self-meals grow stats/belly/mood only. Easy elements (tier 1, depth<4) still only tint/size.
- `LOOK_POWERS`/`powersOf(look)`: a power unlocks when enough RADIANT traits (tier 3, depth≥9) are ≥75% grown — Fire breath (2 of dragon horns/wings/tail), Fairy dust (butterfly wings), Phoenix blaze (fire wings), Frost breath (flake), Shadow smoke (2 demon traits), Holy light (halo + feather wings), Water spout (fish tail). Idle loop uses one ~10% of ticks (`usePower`, `.fx-power` CSS particles, sfx). Meal notes "New power: X!", look label "⚡ X", meal preview shows "⚡ X · power when fully grown" for tier-3 themed elements.
- Main screen companion only (houses don't show powers yet). Test: V120 in v116-looks.test.mjs.

## V119b — organic shape morphing (1 November 2026)
- Replaced the V119 opacity crossfade: every wing/tail/horn/topper/aura trait is now an outline resampled to the same number of points (`morphBlend`, `smoothPath` in companion-engine-v86.js). A slot's mix is drawn as ONE shape whose points are the weighted average of its traits' outlines, so edges bend gradually (bat-wing fingers round into butterfly lobes). Colour blends the same way. Halo/antenna/notes keep their own drawing.
- Test: V119b in v116-looks.test.mjs. Render check: /tmp/v86/t38.py (Demon×4 → Fairy×3).

## V119 — traits grow gradually and morph (1 November 2026)
- Owner: looks should appear gradually and blend, not swap. Each spot holds `look.mix[slot] = {traitId: weight}` (sum ≤ 1). A meal adds 0.25 (0.4 for radiant/rare) to its trait and shrinks the others proportionally when the spot is full; drawing shows every trait in the mix, sized by how grown the spot is (35%→100%) and faded by its share, so bat wings blend into butterfly wings over a few meals. Notes: "Bat wings growing (25%)", "Bat wings morphing into butterfly wings (40%)", "… fully grown!". Labels: "Bat wings / butterfly wings mix", "Devil horns 50%".
- Old saves (single trait per spot) load as fully grown traits (`normLook`).

## V118 — element sheet previews what a meal does (1 November 2026)
- Long-press sheet adds "If <companion> eats it": taste (loves / won't eat), XP per stat right now (or cooldown minutes), tint with colour swatch, size change, traits with their spot (head/back/tail/around) — greyed "needs a harder element" for easy versions, ✦ for radiant — and resets; footer with rarity stars, recipe depth and growth multiplier. `companions.mealPreview(id)`, pure `lookEffects(name,family,category,depth)`.
- Mix-and-match is by design: one trait per spot from any theme (fairy wings + devil horns is allowed); the sheet says so.

## V117 — themed looks + rarer elements are more extravagant (1 November 2026)
- `LOOK_THEMES` (word-boundary keywords, first match wins) give whole coherent sets: Demon (shadowy tint, devil horns, bat wings, devil tail), Vampire/Bat, Angel (bright tint, halo, feathered wings), Phoenix (warm, flame, fire wings, embers), Dragon (horns, dragon wings, spiked tail), Fairy (butterfly wings, sparkles), Ocean (fin, fish tail, bubbles), Fox (fox tail), Robot, Bird, Ice, Fire, Flower, Plant, Space, Royal, Love, Music, Magic, Bubbles, Metal, Gold, Sweet, Water. New slot: tail. New tints: dark, light.
- Extravagance by recipe depth (`lookTier`): ≤3 only tint/size; 4–8 traits; 9+ RADIANT traits (×1.4, glow, flapping wings, swaying tail) and stronger tint (cap 0.62). Card shows ✦ on radiant traits.
- Phoenix is now a theme; resets are egg/rebirth/reset (soap/mirror unchanged). Accessories may overflow the sprite (svg overflow visible).

## V116 — what companions eat changes how they look (1 November 2026)
- Owner idea from SA2 Chao (animals change body parts; newer parts replace old ones). `lookAfterMeal(look,name,family,category)` (pure, companion-engine): tint toward a colour (warm/cool/leafy/metallic/mystic/golden/rosy, by name keywords or family; +0.06 per meal, cap 0.45), size ±2% per meal (food/big grow, air/feather/tiny shrink; ±15% cap), one trait per slot — head (leaf, flower, flame, snowflake, antenna, star, crown, horns), back (wings, fin), aura (sparkles, bubbles, hearts, music notes).
- Resets: soap/bath/shower/wash wash most of the tint off; mirror undoes size and head trait; phoenix/egg/rebirth/reset restores the natural look. Refused food changes nothing.
- Rendering (`applyLookSvg`, via `companions.applyLook` in `wearAll`): luminance-preserving feColorMatrix filter per companion (#lookDefs), CSS `scale`, small SVG accessories attached to the head/body parts so they move with the rig. Shown everywhere companions are drawn; card line "✨ Warm tint · Little flame · Wings · Size +2%"; the feeding window lists look changes.

## V115 — harder elements feed more (1 November 2026)
- `feedDepthMult(depth)` = min(1.8, 0.6 + 0.12×recipe depth): starters ×0.6, depth 5 ×1.2, depth 10+ ×1.8 (×2 more for shiny). Applied in `feedPlan`; companions get `ctx.depthOf` (routeDepth). Measured: Air +34 vs a depth-11 element +101 total stat XP.

## V114 — "while you were away" when returning to Home (1 November 2026)
- Leaving the Home tab stamps `homeAwaySince`; coming back after ≥2 min runs `homeAwaySummary`: every house resident uses each training/food/fun piece min(30, 1.5×minutes) times through `companions.homeEffect` (same daily cap as the live room), and a sheet lists per resident the XP gained per stat (level-ups highlighted, "Lv 3→4"), plus mood/belly.
- Separate from the V91 idle finds (app closed).

## V113 — residents walk around furniture (1 November 2026)
- `findPath` (pure BFS, 8 directions, no corner cutting): standing (object-layer) pieces block their tiles, rugs/mats stay walkable, the piece being used is enterable. Walking is a chain of per-tile CSS transitions; wander targets are free tiles; residents start on free tiles. Unreachable targets are skipped.
- Running wheel: the resident stands on the drum floor (lift −0.36 tile).

## V112 — house objects move while used (1 November 2026)
- Residents stand in the centre of the piece they use (fractional tiles; lifted into the wheel/onto the bike/seesaw; in front of desks/bags).
- `motionOf(id,name,effect)`: wheel / treadmill / bike get moving-part overlays drawn in the sprite viewBox (spinning wheel, running belt, turning bike wheels, front/back views); trampoline squashes in time with the bounce, punching bag swings, seesaw/rocking horse rock with the rider, swings swing the rider, hurdles/jump rope hop, pools ripple, music pieces float notes, stoves/fires/tubs steam, globes spin.
- Fix: the starter Frog (not an unlocked element) could not live in houses — homes now use `companionOwned`.

## V111 — feeding always shows a window (1 November 2026)
- Owner bug: sometimes no window after feeding. Cases with no growth showed nothing: same element within the 30-minute cooldown, refused element, maxed stats. `showNoteWindow` now explains each (e.g. "Already ate Air recently · No growth for 23 min — try another element · Belly +10 · Mood +12").
- Also fixed: the stat window's 400 ms hide timer was not tracked, so a window opened right after another faded could be hidden (`statHideTimer`).
- Note: race/karate prizes (trophies) are house furniture only; they are not catalog elements and cannot be combined.

## V110 — picker previews, Change confirms (1 November 2026)
- Owner: the V109 medal tallies on the picker tiles were not the right idea (removed). Now, with the picker open, tapping a companion only previews it: the entrant card, header medal counts, course medal dots and Prizes row show that companion. It becomes the entrant only when **Change** is tapped (highlighted while a different companion is previewed); the current entrant's tile has a dashed border. Tapping a Play button while previewing confirms that companion and starts.

## V109 — medals visible per companion in the picker (1 November 2026)
- The Stadium companion picker ("Change") shows on every tile that companion's gold/silver/bronze counts, trophies (🏆n) and belt badge, sorted by medals (gold first); tiles with medals get a golden border. No switching needed to compare.

## V108 — medals and trophies per companion (1 November 2026)
- Games progress is stored per companion (`state.pets[cid] = {races, karate}`); level unlocks, medal dots, header medal counts and the Championship unlock follow the selected entrant. Old shared progress migrated once to the companion that was competing (else the Frog); other companions start at Rookie. Belts were already per companion.
- Prizes: each companion wins its own trophy per course — `prize:<course>:<cid>`, "Frog's Pond Fountain" — the course trophy with the winner's figure (`personalPrize`, built on demand). Registered as house furniture for every companion × course (ROOM_SPRITES lazy getters). Prize sheet shows the current companion's six trophies and a count for the others.

## V107 — urgent: slow taps opened the element sheet instead of combining (31 October 2026)
- Owner report: combining showed an element already owned instead of the discovery. Cause: V104 long press (480 ms) fired on slow taps of the second element, opening its sheet and skipping the combination. Recipes were re-audited (Classic + 9 families, 120 random new combinations per mode and 37 real touch taps): every result window matched the recipe.
- Fix: long press needs 700 ms, a ring fills on the chip from 200 ms, and the sheet is titled "ABOUT THIS ELEMENT". Taps up to ~650 ms always combine.

## V106 — karate that reads as a fight (31 October 2026)
- Fighters (140px) stand on the middle of the mat (bottom 27%, 9% from each side) in a bobbing stance with a floor shadow.
- Each attack is a Web Animations sequence: wind-up (step back, crouch) → dash to the opponent → impact at 330 ms → back. Outcome at impact: dodge (jump up and back + ghost), braced block (small push + block ring), hit (knockback, bigger and airborne on heavy hits, white flash) or KO (thrown back and over, stays down until the next round).

## V105 — recipe audit, starter Frog, companion sounds (31 October 2026)
- Recipe audit: Classic (19,829 recipes) and all 9 family maps use order-free keys (`[a,b].sort()`), and every family recipe agrees with Classic — no A+B ≠ B+A anywhere. The "House + Wood → Companion Hut" path was a stale discovery-ledger record from before V91; `discoveredRecipes` now shows a recorded pair only if it still makes the element.
- Starter companion: `STARTER_COMPANION='organic38:frog'` is owned by every player (`companionOwned`) and is on screen in new games; the free first choice is kept.
- Sounds (shared `SFX` synth, Settings toggle applies): companion tap/boop, petting purr, happy chirp, grab, nom per bite, refuse, knocks, hop, level-up; races: footsteps/paddles/grips/wind for your racer, louder CHEER with a short vibration (double buzz when too tired).

## V104 — gate walking, long-press element sheet (31 October 2026)
- Alchemy gates: phases think → go (walk to the chosen stone) → pick (hop) → right: carry on from that stone / wrong: walk back and think again. Display x is smoothed (`r.dpx`, 120 px/s inside gates, 300 px/s catch-up elsewhere); racers face left when walking back.
- Alchemy tab: long press (480 ms, no movement) on an element opens `elementInfo` (description, companion/house callouts, families, Use / Recipes). Tap and drag unchanged.
- Discovery callout for furniture now shows its bonus and stars.

## V103 — furniture quality and bonus breakdown (31 October 2026)
- A piece's bonus depends on its recipe depth (`ctx.depthOf` = routeDepth): ★ ≤5 +10%, ★★ ≤7 +15%, ★★★ ≤9 +20%, ★★★★ ≤11 +25%, ★★★★★ 12+ +30%; race prizes ★★★★★; decor 0. Per-bonus cap raised to +75%. `growthMultiplier(...,bonusOf)`.
- The furniture picker and piece sheet show each piece's bonus and stars.
- Chips under the room are buttons: `bonusSheet` explains the house growth (ladder of houses), the alchemy multiplier, each piece's contribution and the final multiplier.

## V102 — ravines instead of a black void; grounded background (31 October 2026)
- Chasms are ravines cut into the earth: shaded rock back wall (`rcShade` over `rcRock`), the far cliff face and the grass/water floor. No dark void.
- Background: the stage has continuous meadow (#A9CF8E) below the horizon behind the hills (mid layer at full opacity, sky ends above it), so no sky ever shows under the track.

## V101 — glides can fall short (31 October 2026)
- `glideReach(fly)` = 0.35 + 0.75×Fly/99 (Fly 87+ always crosses). A racer short of the far side, or out of stamina mid-air ("NO STAMINA!"), drops to the chasm floor, crosses it (grass = Run, water = Swim) and climbs the far cliff with Power. CHEER mid-air adds +0.08 reach.
- Chasms now have a floor (`z.floor` water/grass, `z.floorY`) drawn in the course SVG; the far cliff riser goes down to it.
- Weak fliers sink along `glideY` on the way to the drop point.

## V100 — track with depth, gates across the path (31 October 2026)
- Owner feedback: vertical start/finish lines, track too thin (racers piled up), walls/pools looked pasted on, background floating.
- Oblique view (`RC.SK=0.32`, `BAND=100`): the path has depth and the 5 lanes run side by side (`laneD`); walls are the riser face of the next step (racers climb its face at their lane depth); pools are sunk into the path; the chasm shows the far cliff's face.
- Start/finish are lines painted across the path; the back post and banner are in the course SVG, the front post in `courseFrontSvg` (overlay above racers).
- The earth runs to the bottom of the screen (SVG 1000px tall, darker with depth); hills sit on the horizon; the foreground fence layer is hidden in races. Rival tags show only the place number.
- APP_VERSION 1.0.0.

## V99 — one continuous race track, own route per course (31 October 2026)
- Owner: take the Chao Race STRUCTURE (sections that flow into each other, climb and carry on above, glides, THINK), adapted to our game, keeping the approved V95 2D art. No copied props.
- `buildCourse(plan)` → zones (run / swim / wall / glide / puzzle) in race units + world px; `groundAt`, `posAt` shared by renderer and racers. Heights 0..3 steps (`RC.LVL=50`). Walls climb one step and the race continues on top; glides land a step lower; the finish straight stays flat (Boulder Wall ends on the summit).
- `courseSvg(C,art)` draws the whole track as ONE SVG with the V95 tiles as patterns (run = grass path, climb = every cliff face and wall, swim = pools, fly = chasm with the broken bridge) and the original start/finish gates — no seams between sections.
- `ROUTES` per course: Pond = chained pools, Cliffs = climb up/glide down, Meadow = long runs, Boulder = staircase of walls, Trail = mix, Championship (renamed from Grand Circuit) = everything + alchemy gates. Level n plays the first 6/8/10/12/14 sections.
- ALCHEMY GATES (THINK): a sign shows two elements, four answer stones on the floor; the companion thinks and steps on one (wrong stones flash red, it retries). Wits = 0.25 + 0.45×average stat level + 0.3×(alchemy growth − 1), so classic discoveries make companions smarter.
- HUD: section map under the stamina bar.

## V98 — climbs are steps: the race continues on top (31 October 2026)
- Owner feedback (drawing): the climb should be a step — run, climb the wall, keep running on the higher ground.
- `elevate(segs)` (pure, exported) gives each section `elev0/elev`: a climb raises the ground one level (max 2, `STEP_H=56px`), the race continues up there; the next water section (dive + splash) or the final section brings it back to 0.
- Elevated sections render raised with a `.g-cliff` rock face beneath; `.g-step` rock strips mark every level change.
- On the first 30% of a climb section the racer is pinned to the rock face (Power-driven speed, `on-wall`); afterwards it runs on top at Run speed. Drops are a short hop down.
- Test: V97 planFor test now also checks `elevate`.

## V97 — climbing walls and different levels (31 October 2026)

- **Climb sections are a standing rock wall** (like Chao Race walls): racers run up to it, climb straight up ~170 px (Power decides the speed, a little Stamina), then jump down the far side. Wall drawn with the climb art, a grassy top and side shading.
- **Each level is its own course** (`planFor(course, level)`): Rookie 6 sections → Junior 8 → Pro 10 → Expert 12 → Champion 14, more section types and longer sections at higher levels (total length more than doubles). Time of day changes per level (morning, noon, afternoon, sunset, night with stars). The event sheet shows the next level's section count and layout strip.

## V96 — simple Stadium hub, Classic-discoveries growth bonus (31 October 2026)

- **Alchemy bonus**: companions grow faster with the player's Classic progress — +10% per 400 elements found in Classic, up to ×2 at 4,000 (`alchemyGrowth()`, multiplied into `growthFor`; future gains only, like houses). Shown on the Stadium entrant card and in the companion stats card.
- **Stadium hub simplified**: entrant card (sprite, name, Lv, mood, belt, growth line; tap → stats card), then one list: each race / the Karate Dojo as a row with five medal dots and a single button that starts the next level (or "Replay"); tapping a row opens a sheet with the description, terrain strip, prize and all levels; a Prizes row opens the toys/belts sheet. No tabs, no grades grid, no per-course level grids.

## V95 — Stadium scenery, sound, feedback; Alchemy tab (31 October 2026)

- **Scenery** (`client/assets/v95-stadium/`, `tools/v95-assemble-stadium-art.py` → `stadium-art-v95.js`): seamless terrain tiles (meadow, pond with lily pads, ravine with broken bridge, rock wall with holds), sky with sun/hills/trees, hedge-and-fence mid layer (also used as a faster foreground), start and finish gates with bunting/crowd/trophy; karate dojo (shoji, pillars, lanterns, blossoms, spectators, taiko) and tatami ring with rope. Three-layer parallax.
- **Sound** (`stadium-sfx-v95.js`, Web Audio synth, honours the Settings sound toggle): countdown ticks/GO, cheer, tired, splash, flap, section chime, pass/passed, rest, finish fanfare, lose, medal, prize, gong, FIGHT, hit, big hit, block, miss, charge, K.O., breath.
- **Feedback**: damage numbers, POW!/WHAM! bursts and hit-stop on big hits, KO zoom, confetti on a KO win, WINNER!/place banners at the finish, bigger actors (64 px) with glow ring under the player's companion, big splash when entering water.
- Bottom tab "Play" is now labelled **Alchemy** (view id unchanged).

## V94 — Stadium redesign, prizes and belts (31 October 2026)

- Games tab rebuilt as the **Stadium** (Chao Stadium model): entrant card (big sprite, name, total Lv, six stat grades E–S with levels, belt), Change picker with levels, then Races / Karate / Prizes tabs. `client/src/games-v93.js` (V94 content), `client/src/prizes-v94.js`.
- **Races**: countdown 3-2-1-GO, parallax sky/hills, richer sections (waves, bridge posts, climbing holds), name tags with live place, dust/splash/wind/pebble FX, speed lines on cheer, section banners (RUN/SWIM/FLY/CLIMB), overtaking pops, sweat when exhausted, confetti on a win, podium + medal drop in results. Terrain strip and prize preview on each course card.
- **Karate**: best of three rounds, ROUND/FIGHT!/K.O. banners, portraits + HP + zeal bars, lunge, hit sparks, screen shake on big hits, dodge afterimage (Fly), block ring (Swim as defence), breath when out of zeal, KO fall with stars.
- **Prizes (Chao Garden model)**: Champion gold on a course gives a **toy for the house** (Pond Fountain, Cliff Kite, Meadow Flag, Boulder Stone, Trail Lantern, Grand Cup — placeable furniture with their own room sprites); winning a karate level ties a **belt** (white → black) the winner wears everywhere (drawn on the body of the rigged sprite: screen, Home, houses, Stadium). Prizes tab lists toys and belts.
- Cheer button with pop/dim/“no” feedback; cheering spends Stamina.

## V93 — Games tab: Chao-style races and sparring (31 October 2026)

- 4th tab **Games** (hidden until the player has a house and a companion; `!` badge first time). `client/src/games-v93.js`, state `alchemy10k_games_v1`.
- **Races** (Chao Race dynamics): sections use Run (ground), Swim (water), Fly (gaps), Power (rock walls); Stamina drains and a tired racer rests. Courses: Pebble Pond (Swim), Breezy Cliffs (Fly), Meadow Dash (Run), Boulder Wall (Power), Long Trail (Stamina, longer), Grand Circuit (all; opens after winning Rookie on the other five). Levels Rookie → Champion, each opened by winning the previous; rivals' stats scale per level.
- **Sparring Ring** (Chao Karate-like): HP = health, Power = damage, Run = dodge, Stamina = punches; Rookie → Champion.
- The companion plays on its own; tapping cheers (race sprint / power strike) and spends Stamina — over-cheering tires it out. Medals gold/silver/bronze; every race/bout trains the stats it used (growth multipliers apply).
- Companion tiles in Home now show "Lv N".

## V92 — simpler Home tab, growth multipliers (31 October 2026)

- **Houses give growth multipliers, never stats**: residents grow ×1.1 (Tent) … ×2 (Castle) faster from meals, gifts, discoveries and training; each training/food/fun/book piece adds +15% for its kind (max +60%). `growthMultiplier`, `homes.growthFor`; applied in the companion engine to future gains only — moving a companion never removes anything.
- Tap a house chip → info sheet (summary, tier, room, ×growth, furniture bonuses, Go to this house). Undiscovered houses show tier/room/growth without the recipe.
- Tap a resident → its stats (mood, belly, six stat rows) + Move out. Tap any companion in the roster → stats card (choose, rename).
- Home tab simplified: house card, compact "On screen" row (Stats / Send home), companions as a 5-per-family avatar grid (green dot = on screen, ochre = lives in a house), help collapsed.
- Room sprite fixes: punching bag side matches its A-frame, clearer radio, TVs, picket gate and drum kit side views.

## V91 — house tiers, drag & drop, idle discoveries (31 October 2026)

- **House tiers**: upgrade chain Tent (House + Thread) → Hut (Tent + Wood) → Cabin → Cottage → Villa → Castle; measured generations 6 → 7 → 8 → 11 → 12 → 13. `recipe-polish-v91.js` (House + Wood now gives Floorboards). Chips show tier dots.
- **Drag & drop**: press and hold a piece (~0.3 s) or tap Move, then drag over the grid; green = fits, red = blocked, invalid drop snaps back.
- **Idle discoveries** (`alchemy10k_idle_v1`): after ≥30 min away, residents find elements that are craftable right now (rate grows with residents, their levels and discovery furniture; max 8 h, cap 2 + residents + discovery/2, ≤15). 1 kept free (2 when 5+), the rest with one rewarded ad (`idle_finds`); all with Remove ads. Residents also train on their house's furniture while away (daily cap).

## V90 — Home screen: companion houses (31 October 2026)

- The third tab is now **Home**: house selector (6 houses), a cosy 3/4 room per house (floor grid by capacity: 4×3 … 8×8, themed walls/floors), residents (up to capacity) and the companion roster below.
- **Room sprites** for all 143 furniture pieces (`client/assets/v90-room/`, `tools/v90-assemble-room.py` → `room-sprites-v90.js`): footprint-sized, front/back/side so pieces rotate in 4 directions; layers floor (rugs, mats, pools — furniture may stand on them), object (depth-sorted) and wall (frames, clocks, curtains on the back wall).
- Tap floor/wall → pick discovered furniture; tap a piece → Rotate / Move / Put away (rugs also "Put furniture on it"). One instance per element across houses.
- Residents walk to pieces and **use** them (run in place, swim half-submerged with ripples, bounce on the trampoline, sleep lying down, eat, punch, climb). Effects are real via `companions.homeEffect`: training +2 bar points per use (max 200/day per companion), food +8 belly, mood pieces +2 mood.
- State: `alchemy10k_homes_v1` (backup + reset). Next phase: idle discoveries while away.

## V89 — +200 Home & Living batch (31 October 2026)

- **+200 elements** (6,412 → 6,612), `tools/v89-blueprint.json` → `tools/v89-assemble.py` → `organic-pack-v89.js`, `organic-art-v89.js`, `shared/v89-approved.json`, 200 SVGs in `client/assets/v89/`.
- **New family Home & Living** (`home`, category `home`): starters House, Wood, Tool, Thread; existing members (Workbench, Yarn, Loom, Wooden Plank…) in `tools/v89-home-family.json` → `family-data-v89.js`, merged with V85 data by `mergeFamilyData`. 172 members, 100% craftable in-family.
- **Companion houses**: Tent 1, Hut 2, Cabin 3, Cottage 4, Villa 6, Castle 8 (deeper recipes for bigger ones). **Furniture** with effects (run/swim/power/fly/stamina/hp training, mood, food, discovery, decor) and tile sizes in `home-objects-v89.js` (also 34 existing elements such as Television, Piano, Telescope). Discovery sheet shows a "Companion house!" / "Furniture" note. The Home screen (map, placement) is the next phase.
- 45 missing classics from the V87 review: Diamond, Bat, Lion, Bear, Camel, Cow, Cat, Dog, Wolf, Snowman, Beach, Jungle, Earthquake, Light Bulb, Candle, Mermaid, Unicorn, Fairy, Yeti…

## V88 — Collection cleanup, family art, launcher (31 October 2026)

- Themed collections removed from the Collection tab (obsolete; data kept for old saves).
- Seven family icons redrawn in the 2026 art direction (`client/src/family-art-v88.js`); Countries keeps the Globe art.
- Launcher icon: alchemy flask holding a little garden with an original sprout-eared companion creature, a hatched egg and a care heart, on an ochre background (adaptive `#E3A15F`) — Alchemy + garden + virtual pet in one image.
- Idea under discussion with the owner: Companion Houses (house elements of several sizes, furniture elements as multipliers, idle discoveries while offline). Not implemented.

## V87 — recipe polish, companion ads/badge, Chao Garden pass, new launcher (31 October 2026)

- **Recipe polish** (`client/src/recipe-polish-v87.js`, list in `docs/RECIPE_POLISH_V87.md`): new logical recipes on free pairs (Ink + Paper = Book, God + Sea = Poseidon, Bird + Fire = Phoenix…) and forced recipes remapped (Book + Ink → Writing, Water + Campfire → Steam…). Zero new elements. Applied in `buildCompleteFamilyCampaigns(..., polish)` after the V85 recipes; validated: Classic 6,412/6,412 and every family unchanged at 100%. Owner exception to the "results immutable" rule recorded in `docs/WORKING_RULES_PT.md`. Ideas that need new elements (Letter, Beach, Wool, Farmer, Pharaoh…) are kept for the next +200 batch.
- **Companions**: first choice free, later switches = rewarded ad (`companion_switch`) + 5 free minutes; NEW COMPANION discovery sheet + Companions tab `!` badge; stroking/petting, emotion orb, belly/hunger, renaming. Details in `docs/COMPANIONS_V86.md` (V87).
- **Launcher icon** redrawn in the game palette (paper background, slate flask, ochre brew); adaptive background `#F3E6D3`.

## V86 — merged families, public-name review, Classic banner, Companions (31 October 2026)
- **Families merged (owner request)**: Video Games + Consoles & Hardware + Arcade & Tabletop → `games` "Games & Consoles"; Anime & Manga + Music + Cinema & TV → `anime` "Anime, Music & Cinema". 8 families remain. `MERGED_FAMILY_IDS`/`canonicalFamilyId` in `discoveries.js`; old Family Only saves are folded into the absorbing family at load (app.js). Merged campaigns stay complete via 16 bridge recipes (`tools/v85-family-proposals/*-v86-bridge.json`); `tools/v85-assemble-families.mjs` applies the merge.
- **Public names**: 1,400 explicit reviewed labels in `tools/public-labels-v86.json` → `client/src/public-labels-v86.js`, applied by `buildPublicNameIndex(items, overrides)` ahead of the regex rules. Real titles, franchises, characters, consoles, brands, bands/musicians and franchise-only moves/items now show invented names; generic words and public-domain composers stay. Still only a display layer: IDs, recipes, saves and art keys unchanged. Not a legal clearance; element summaries/wit text still go through the old `publicText` regexes only.
- **Mode banner** now also shows in Classic (ochre) with progress and the ⇄ Merge button.
- **Companions**: see `docs/COMPANIONS_V86.md`. New third tab. 40 rigged sprites.
