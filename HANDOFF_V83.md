# Alchemy 10K — V83 WIP / continuation checkpoint

**Meta definitiva: exatamente 10.000 elementos.** V82 tem 6.012, faltam 3.988; são 19 lotes normais de 200 (incluindo V83) até 9.812, seguidos de um lote final de 188, nunca até 10.012. A exceção de +188 só se aplica ao último lote e exige validação específica do gate antes da entrega.


- Baseline: merged V82 `b75811874766a1270ac5ca908fd57719e1557c0a` — **6,012 elements, 14,349 recipes**.
- Development branch: `wip/alchemy-10k-v83-fantasy-gaming`; target **exactly +200** -> **6,212 elements / 14,549 recipes**.
- This checkpoint: **200/200 authored candidates**, **0 remaining**. The 200 are NOT ACTIVE IN THE GAME; import/integration only at finished quality-gated batch. No PR, CI or APK from WIP.
- Each candidate has an English name, permanent proposed ID, one unique ordered-independent global pair, family membership hypothesis and custom source SVG. These are editorial candidates requiring collision scans, isolated Family Only closure, native 35px art review and all existing catalog validations before release. In particular, do not present these as player-available discoveries yet.
- Wave 1 COMPLETE (25 candidate IDs): bespoke folklore and fantasy characters/creatures: trolls, Ulfhednar, Vrykolakas, wraith, banshee, dryad, basilisk, golem, griffin, chimera, harpy, centaur, satyr, leviathan, selkie, firebird, thunderbird, roc, walking tree, marsh ghostlight and gargoyle. Subject-specific vector art has been committed; 35px human QA remains outstanding.
- Planned 200 allocation: 50 folklore creatures/environments; 50 original gaming fantasy objects/genres; 50 gaming systems/arcade/board-adjacent artefacts; 50 science, fauna and cross-family recipes. The gaming component must remain meaningful, without arbitrary console+monster crossovers.
- New mythology family items must be verifiably completable from Human, History, Magic, Sky with the GLOBAL A+B=C recipe table. New V83 ancestors use existing reachable V82 nodes or earlier Wave 1 nodes. Verify against full recipe catalog, not just this set.
- Never change previously published IDs, results, save keys, the Android package, or verified-ad contracts; never perform WIP CI Actions builds. Nature & Science's classic-starter discrepancy remains a separate known issue.
- All 200 icon sketches are subject specific and not yet confirmed on a physical device; reject/rework anything unreadable at 35 px.

See [candidate JSON](shared/v83-progress.json), [source pack](client/src/organic-pack-v83.js), [art review](docs/V83_ART_REVIEW.md).

## Collision correction
The preflight historical-catalog scan found existing exact names `Werewolf` (`legacy`) and `Vampire` (`pack`). The candidate IDs and vector paths were renamed to distinct folklore subjects `organic83:ulfhednar` and `organic83:vrykolakas`, without touching historical identities. Follow-up family graph and visual QA remain necessary.

## Second folklore wave (13/25)
Kelpie, Barghest, Black Shuck, Dullahan, Leshy, Baba Yaga, Tatzelwurm, Tarasque, Wyvern, Cockatrice, Manticore, Amphisbaena and Simurgh drafted with their own source SVG. Pending family closure and human legibility check.

## First 50/200 ready for offline editorial QA
50 draft IDs, 50 draft recipes, 50 source-matched SVG illustrations. The second group adds Hippocampus, Naiad, Nereid, Lamia, Scylla, Charybdis, Fomorian, Puca, Undine, Pixie, Kobold and Wight. **Not yet integrated in the app or validated through CI/Android**. Global exact goal remains 10,000.

## Structural checkpoint — verified without CI/Android build
- 50/50 proposed IDs, English names, unordered pair keys and SVG paths distinct.
- Source-level independent **Mythology & Gods family closure: 159/159** members reachable from Human, History, Magic and Sky. This is a data traversal (legacy+creative+V41+V42+V82+WIP V83), not a physical-device test.
- No new pair-result conflict in this same source-level reconciliation (historical subset). 50 V83 artwork strings are distinct. Full historical catalog regression test has been authored but **not executed**; continue validation before integration.
- No GitHub Actions triggered for this WIP checkpoint, and no APK was published.

## Third wave — 25 original fantasy-gaming items
+25 gaming interface/equipment objects (Quest Notice Board, Rune-Locked Door, Checkpoint Banner, Pixel Heart Pickup, Healing Campfire, Mana Flask, Treasure Mimic, Quest Compass, Dungeon Minimap, Boss Health Bar, Loot Satchel, Teleport Waystone, Skill Tree Diagram, Arcade Claw Machine, Prize Redemption Counter, Hidden Wall Lever, Spike Trap Floor, Loot Rarity Gem, Parry Spark, Save Crystal, Save Progress Meter, Secret Treasure Cache, Boss Arena Gate, Roguelite Relic, Monster Bestiary Page). Every draft has its own detailed subject SVG and candidate global recipe. These entries are **Classic-only** for now, with `familyCampaigns: []`, because introducing them into independently finishable Family Only campaigns requires separate closed recipe chains. No content integrated into the game; full historical catalog audit and QA still pending.

## Historical collision remediation (gaming wave)
After scanning 39 organic pack modules plus legacy and creative, found previously authored names Quest Journal (V77) and Arcade Ticket Roll (V80), and conflicting Pixel + Screen (already V77 screen-calibration-grid). Replaced those with **Quest Notice Board**, **Prize Redemption Counter**, and **Save Progress Meter**, each with a new recipe and genuinely different custom SVG. No historical IDs/outputs were changed. The new pairs require another full-history scan before the 200-item merge.

## Discovery family classification correction
The Discoveries module recognizes `gamecraft`, `arcade`, and `fantasy`, but **not `gaming`** (which would silently display in Fantasy). Reclassified the 25 Wave 3 candidates into 10 gamecraft, 2 arcade and 13 fantasy using their actual subject matter. `familyCampaigns: []` still marks them as Classic-only for independent Family Only campaign progress.

## Fourth wave: 25 original gameplay/interface objects (100/200)
Added 25 drafts spanning physical arcade components (marquee, prize capsule, pinball mechanisms, rhythm lanes), game HUD (speedrun timer, replay ghost, combo counter, health pickups/gear grid), dungeon equipment and signs (warning siren, parry dummy, switch plate, portal lens). Every illustration is source-authored, not a generic hashed composition. These 25 are Classic-only; no new Family Only membership until independently valid routes exist. Still WIP; 100 more required to ship V83, and all 100 require full history and 35px review.

## Full-history QA collision remediation at 100/200
The scan found pre-existing `Pinball Plunger` (V73), `Speedrun Split Timer` (V81), `Joystick + Metal` (already V77 -> Joystick Spring) and `Arcade + Music` (legacy result 286). The WIP candidates were corrected to unique subjects `Pinball Launch Rail` and `Ghost Lap Stopwatch` with newly authored illustrations and global recipes. The proposed `Rhythm Note Lane` now uses `Arcade Marquee Panel + Music`; no original result was changed. Recheck the full catalog after edits.

## WIP dependency order fixed
At the 100/200 checkpoint, `Ghost Lap Stopwatch` depended on `Replay Ghost` but was listed one position earlier. The WIP array and manifest were topologically reordered without touching IDs or global recipe pairs. A dedicated test now rejects any V83 ingredient appearing after its result.

## Source checkpoint: 100/200 after full-history audit
- New candidate data: **100 IDs**, **100 unique normalized names**, **100 unordered recipe pairs**, **100 source SVG paths**, **100 JS art entries**, **100 manifest entries**. Of these, 50 are proposed mythology-family members and 50 are Classic-only gaming/fantasy items.
- Historical name/pair scan after corrections: **39 historical organic packs plus legacy and creative (41 sources)**, **zero WIP collisions**. This is a source-level comparison, not full integrated `npm test`.
- Every draft ingredient ID exists in the checked source set, and all WIP-to-WIP recipe dependencies are ordered after their inputs. Added a regression test for forward dependencies.
- The Mythology family is still independently craftable **159/159** in the data graph; Classic gameplay build/QA still pending.
- **No new APK or release**. WIP branch only. 100 more required to finish V83 and 3,988 total remain from merged V82 to exact 10,000.

## V83 Fifth wave — 125/200 WIP; 75 still needed
Added 25 new subject-authored original SVG sources and one proposed global recipe per item: arcade token hopper, coin door, pinball tilt pendulum, rhythm step mat, prize crane joystick, counting tray, cartridge cleaning swab, manual foldout, memory sleeve, controller cable reel, handheld dock stand, touchscreen grip, light gun holster, co-op lobby, board scorepad, dice rolling chute, fantasy dice, miniature paint stand, map tile organizer, card sleeve binder, boardgame insert, pixel sprite flipbook, launch spring, hint dial and boss victory banner.

All new items have empty `familyCampaigns` and thus are Classic-only until independently playable thematic campaigns can be proved. Draft sequence and unique names/pairs checked against V83 internally. Earlier published content and APK remain unchanged. Full-history cross-reference, original SVG file-to-art mirror audit, offline gameplay build and human 35px legibility review are **pending**. Do not merge or release at 125.

## V83 Sixth wave — 150/200 WIP: modern wildlife subjects
25 individually authored SVG animals and proposed recipes: pangolin, fennec fox, shoebill, narwhal, wombat, platypus, leafy sea dragon, arctic tern, quokka, musk ox, maned wolf, saiga antelope, aye-aye, okapi, blue-ringed octopus, tardigrade, proboscis monkey, giant isopod, binturong, secretary bird, sun bear, gerenuk, dumbo octopus, flying fish and Gila monster. These are classified as `life` in Discoveries and not assigned to any independently finishable thematic Family Only campaign without verified isolated routes.

**NOT LIVE:** full original-catalog name/pair audit for these 25, SVG visual 35px review, complete integration, test suite, and Android build still outstanding. Do not merge or release until 200 validated.

## Historical-catalog correction at 150/200
Audited all **39 old organic packs plus legacy and creative**. Discovered three already-defined global pairs: Bird + River -> Kingfisher Bird (V62), Seahorse + Kelp -> Seahorse Nursery (V46), Deep Sea + Crab -> Lobster (V38). Changed only the proposed V83 Shoebill, Leafy Sea Dragon and Giant Isopod recipes to unique pairs involving WIP source elements. No old recipe, ID, save, or item changed. Post-fix WIP: 150 unique names, 150 keys, no forward dependency. Audit does not prove intrinsic human recipe quality, native UI, or 35px readability.

## Source-only validation after 150/200 checkpoint
- **150 proposed unique IDs, 150 global unordered pairs, 150 artwork map entries and 150 SVG source paths**. Historical names/recipes compared to all **39 previous organic packs**, legacy and creative. Three conflicting historical recipes were rewritten in WIP with no changes to old results.
- Every proposed recipe's ingredient ID was resolved against the WIP pack and relevant historical source packs (legacy, creative, organic32/34/37/38/40/82). **Zero missing ingredients** and **zero forward dependencies**.
- Corrected the WIP test's category mappings to include accessory→Consoles, board→Arcades, and life→Nature.
- Source-only assertion is not a substitute for **npm tests, 35px artistic QA, Classic end-to-end run, Family Only regression or native Android device testing**. Local Git clone unavailable in this environment due DNS resolution failure; GitHub Actions intentionally not triggered at 150/200.
- Next: **50 more approved distinct items** plus full audit and integration. V82 main remains 6,012, final exact target 10,000.

## V83 Seventh wave — 175/200 WIP
25 extinct taxa with individually composed vector subjects: Olenellus, Aegirocassis, Hallucigenia, Opabinia, Wiwaxia, Pikaia, Hurdia, Cameroceras, Helicoprion, Stethacanthus, Tiktaalik, Acanthostega, Diplocaulus, Dimetrodon, Gorgonops, Lystrosaurus, Tanystropheus, Shonisaurus, Elasmotherium, Homotherium, Kelenken, Doedicurus, Hatzegopteryx, Yutyrannus, Kosmoceratops. All have **prehistoric** thematic membership, with ingredients from that same independently playable campaign; WIP family closure requires re-verification. 25 remaining until V83 200. No CI/APK release of incomplete pack.

## Eight wave — exactly 200/200 DRAFT discoveries complete, not integrated yet
25 additional bespoke game objects: stealth detection cone, patrol route marker, decoy pebble, alert beacon, tactical cover marker, silent footsteps, lockpicks, hacking circuit, laser tripwire, disguise wardrobe, radar sweep, camouflage roll, camera blindspot, grappling launcher, movement grid compass, turn order track, initiative tray, spell codex, frost rune, fireball focus, summoning chalk, mana shrine, dungeon ladder, relic socket and quest parcel.

**Exactly 200 candidate IDs and SVG sources now authored.** Do not treat this as a validated release. Immediately: scan all previous 39 organic packs and creative/legacy names and global pairs, verify 2 thematic campaign closures, run runtime tests, integrate imports into game, run the +200 content gate and Android QA workflow once. Published target after merge: 6,212 elements (toward 10,000 exact). No release or Play signing yet.

## Full 200-item QA integration commit (not yet Play-released)
- V83 now imported into runtime catalog and prioritized in staticArt; offline builder includes V83 pack and source SVG art mapping, and invokes strict V83 validator and SVG audit. Android export continues using existing unchanged save keys and package identity.
- The 50 folklore-themed entries are now tagged category mythology; the 25 extinct species category prehistoric, matching their independently playable Family Only campaign; 125 Classic-only entries remain in their respective Discoveries families.
- Baseline V82 6,012 elements/14,349 authored pairs; V83 +200 => **6,212 elements / 14,549 authored pairs**. **Mythology closure 159/159; Prehistory closure 141/141** in source-level data traversal. 200 distinct SVG sources pass structural preflight but HUMAN legibility assessment at 35px is pending.
- `shared/v83-approved.json` is a manifest for the code gate, not approval for commercial release. A CI/Android QA run, IP/art review and physical-device check must pass before merging or publishing.

## Experimental V83 QA — tactile craft motion (30 Oct 2026)

- Unreleased preview on the same V83 draft branch only; V82 main unchanged, the 200-element V83 catalog remains unchanged.
- A right-slot ingredient animates toward the left. Offline misses bump and return in 295ms; known results fuse at left and fade upward in 300ms; first discoveries fuse and expand as a full-screen tile then automatically fade.
- Animations are fully visual (cloned fixed-position tiles); game updates, saves, Family Only closures, left lock, drag and inventory scroll are not awaited or changed. Pointer input immediately cancels any active animation. Reduced-motion settings use the original no-animation modal.
- Test: `client/test/craft-motion.test.mjs` checks all three branches and input cancellation. No physical-device animation/frame-rate or accessibility QA yet.
- Build version in the Help footer is now injected from `package.json` by the standalone builder, set to 0.83.0 for this preview; Android debug signing and package ID unchanged.
- The QA workflow artifact filename now specifies V83 Motion to prevent accidental confusion with V82. Only install over existing app, do not uninstall. Do not merge/release until device test.
