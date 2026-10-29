# Alchemy 10K — V82 working handoff / 29 October 2026

## Branch / baseline / release truth
- Branch: `feature/alchemy-10k-mythology-prehistory`; main baseline `2aba8395f48082964bc2af2ff20a468c56dd464b`.
- V81 baseline: **5,812 real catalog IDs / 14,149 fixed global recipes**.
- V82 WIP: **+25 genuine IDs / +25 authored recipes / +25 original SVG source files**, target branch totals **5,837 items / 14,174 recipes**, pending the entire full-history validator.
- Exactly **25/200**, **175 remain**. Neither this branch nor its HTML/APK has been published. Do **not** claim a +200 release or launch GitHub Actions for this checkpoint.
- Active project goal: **10,000+ elements**. Twenty-one complete +200 batches after V81 reach 10,012; this unfinished 25 is part of the *first* of those 21, not an additional release.
- Existing repository name and Android `appId=com.joaogdbg.alchemy35k` retained to preserve upgrade/save compatibility; app display title is **Alchemy 10K**.

## New playable content in WIP source
**Mythology & Gods (18 new, 34 currently listed):**
Mythology; Greek Pantheon; Mount Olympus; Divine Thunderbolt; Zeus; Sacred Trident; Poseidon; Ancient Wisdom; Athena; Roman Pantheon; Jupiter; Norse Mythology; Asgard; Runestone; Odin; Norse War Hammer; Thor of Asgard; Loki of Asgard.

**Prehistory & Dinosaurs (7 new, 16 currently listed):**
Mesozoic Era; Jurassic Period; Cretaceous Period; Fossil Skeleton; Dinosaur Armor; Stegosaurus; Ankylosaurus.

Each authored entry has: permanent `organic82:` ID, original English summary, semantic category, explicit `familyCampaigns` membership, one globally shared unordered recipe, hand-authored 100×100 SVG file and an exact runtime art-map entry. Drawings avoid duplicating the Marvel Thor/Loki and licensed Jurassic-film designs; review still required at 35 px.

## Family contract
- Existing Nature & Science: 476/476 reachable, **still** uses the Classic four starters (known defect).
- Existing People & Culture: 211/211 reachable.
- New thematic starter baselines are 16/16 and 9/9; V82 adds 18 and 7 closed global-recipe paths to reach 34/34 and 16/16 when integrated.
- New future elements must have explicit membership and must pass the isolated closure gate from four thematic starters. Recipe outputs and ID identities are globally identical across all modes. No family-specific alternative outputs.
- Earned multi-family IDs synchronize only among eligible family profiles; free starters are not transferred as earned items. Classic remains isolated, and Merge requires two verified rewarded callbacks with saved 1/2 credit.

## Committed files
- `client/src/organic-pack-v82.js`: 25 authored catalog entries / ordered recipes.
- `client/src/organic-art-v82.js`: exact 25 subject-specific SVG strings.
- `client/assets/v82/*.svg`: 25 editable original vector sources.
- `shared/v82-approved.json`: explicit WIP status, 25/200 and source paths, exact provisional counts.
- `docs/V82_ART_REVIEW.md`: GitHub-renderable 35/90px thumbnails, not yet a human sign-off.
- `tools/validate-v82.mjs`, `tools/audit-v82-art.py`, `client/test/v82-content.test.mjs`: completeness, global pair integrity, XML/security/duplicate/source, family reachability and WIP guard tests.
- `client/src/app.js`, `tools/build-standalone.py`, `tools/audit-active-artwork.mjs` plus historical V80/V81 tests updated to include the V82 layer.

## Checks and exclusions
- Preliminary in-memory source checks on representative legacy, creative and organic packs previously showed all starter campaigns reachable and no global pair contradictions among those checked. The four new-old primary ingredient pairs were searched against the GitHub catalog, with no matches returned.
- A **complete** repository checkout, **npm test**, full-history validator, standalone builder, browser visual audit, full 35px light/dark review, CI and Android device/APK tests have **not yet been run** in this environment. Do not imply green CI or human-reviewed artwork.
- No new APK or merged release exists. The current GitHub 'latest' APK still corresponds to a previous main-branch build.
- Real AdMob rewards, cloud sync, leaderboards, production signing and Nature & Science's starter correction are unresolved.

## Next task
Continue the SAME V82 WIP pack in editorial waves, without PR/CI or published APK until +200. Prioritize completing Greek/Roman/Norse pantheons and distinct prehistoric dinosaur families, then broad gaming/crossovers. Before each new item, check full global unordered pair and normalized-name availability, ensure an honest path from family starters, then draw its own easily identifiable 35px silhouette. After full 200, run npm test + validators + SVG/XML audit + 320/360/390/1280 browser QA + one GitHub PR CI + one Android debug build, not at WIP checkpoints.

See `docs/ALCHEMY_10K_THEMATIC_EXPANSION.md`, `docs/CONTENT_200_BATCH_POLICY_PT.md`, and `AGENTS.md`.
