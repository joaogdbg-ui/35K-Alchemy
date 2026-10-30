# Alchemy 10K — V83 WIP / continuation checkpoint

**Meta definitiva: exatamente 10.000 elementos.** V82 tem 6.012, faltam 3.988; são 19 lotes normais de 200 (incluindo V83) até 9.812, seguidos de um lote final de 188, nunca até 10.012. A exceção de +188 só se aplica ao último lote e exige validação específica do gate antes da entrega.


- Baseline: merged V82 `b75811874766a1270ac5ca908fd57719e1557c0a` — **6,012 elements, 14,349 recipes**.
- Development branch: `wip/alchemy-10k-v83-fantasy-gaming`; target **exactly +200** -> **6,212 elements / 14,549 recipes**.
- This checkpoint: **38/200 authored candidates**, **162 remaining**. The 38 are NOT ACTIVE IN THE GAME; import/integration only at finished quality-gated batch. No PR, CI or APK from WIP.
- Each candidate has an English name, permanent proposed ID, one unique ordered-independent global pair, family membership hypothesis and custom source SVG. These are editorial candidates requiring collision scans, isolated Family Only closure, native 35px art review and all existing catalog validations before release. In particular, do not present these as player-available discoveries yet.
- Wave 1 COMPLETE (25 candidate IDs): bespoke folklore and fantasy characters/creatures: trolls, Ulfhednar, Vrykolakas, wraith, banshee, dryad, basilisk, golem, griffin, chimera, harpy, centaur, satyr, leviathan, selkie, firebird, thunderbird, roc, walking tree, marsh ghostlight and gargoyle. Subject-specific vector art has been committed; 35px human QA remains outstanding.
- Planned 200 allocation: 50 folklore creatures/environments; 50 original gaming fantasy objects/genres; 50 gaming systems/arcade/board-adjacent artefacts; 50 science, fauna and cross-family recipes. The gaming component must remain meaningful, without arbitrary console+monster crossovers.
- New mythology family items must be verifiably completable from Human, History, Magic, Sky with the GLOBAL A+B=C recipe table. New V83 ancestors use existing reachable V82 nodes or earlier Wave 1 nodes. Verify against full recipe catalog, not just this set.
- Never change previously published IDs, results, save keys, the Android package, or verified-ad contracts; never perform WIP CI Actions builds. Nature & Science's classic-starter discrepancy remains a separate known issue.
- All 38 icon sketches are subject specific and not yet confirmed on a physical device; reject/rework anything unreadable at 35 px.

See [candidate JSON](shared/v83-progress.json), [source pack](client/src/organic-pack-v83.js), [art review](docs/V83_ART_REVIEW.md).

## Collision correction
The preflight historical-catalog scan found existing exact names `Werewolf` (`legacy`) and `Vampire` (`pack`). The candidate IDs and vector paths were renamed to distinct folklore subjects `organic83:ulfhednar` and `organic83:vrykolakas`, without touching historical identities. Follow-up family graph and visual QA remain necessary.

## Second folklore wave (13/25)
Kelpie, Barghest, Black Shuck, Dullahan, Leshy, Baba Yaga, Tatzelwurm, Tarasque, Wyvern, Cockatrice, Manticore, Amphisbaena and Simurgh drafted with their own source SVG. Pending family closure and human legibility check.
