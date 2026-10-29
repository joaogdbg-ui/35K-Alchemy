# Alchemy 10K — development handoff (2026-10-29)

Branch: feature/alchemy-10k-mythology-prehistory
Starting main revision: 2aba8395f48082964bc2af2ff20a468c56dd464b.

## Catalog and target
V81 baseline: 5,812 existing items and 14,149 existing global recipes.
New objective: 10,000+ unique elements; 21 future releases of exactly 200 elements reach 10,012.
This branch adds ZERO catalog elements or recipes. This is a maintenance change, not a completed V82 content batch.

## Implemented
- Alchemy 10K display title, Android display name, catalog goal, plan and 200-item gate.
- Thematic Family Only campaign source at client/src/family-campaigns-v82.js.
- Mythology & Gods: 4 thematic starters; 16 of 16 independently reachable items.
- Prehistory & Dinosaurs: 4 thematic starters; 9 of 9 independently reachable items.
- Existing Nature & Science: 476 of 476 independently reachable.
- Existing People & Culture: 211 of 211 independently reachable.
- Two original themed card icons in the app, plus original ID preserving classifications.
- New explicit familyCampaigns metadata supported for future items. If a listed item cannot be reached from its family's own four starters through global recipes, the builder rejects the campaign.
- Shared profile fixes avoid treating free starter ingredients as earned discoveries.
- Existing Android app ID, local saves and original catalog recipe results stay unchanged.

## Validation and limitations
Direct source-level closure calculations found no contradictory recipes across the four campaigns, and all 4 campaign item sets were reachable in isolation.
Added new Node regression tests and updated historical UI/group-count tests.
Full npm test, standalone build, GitHub Actions, visual device QA and APK build HAVE NOT been run on this branch. It remains unmerged and no APK is published.
Nature & Science still has its historical four Classic starter mismatch.
Individual Greek, Roman and Norse deity and new dinosaur species illustrations are not yet created as full catalog items.

## Next action
Author and verify exactly 200 new V82 items with bespoke 35px artwork, coherent global recipes, true isolated Family Only paths and explicit membership. Suggested first wave: 50 mythology, 50 prehistory and 100 original gaming/crossovers. See docs/ALCHEMY_10K_THEMATIC_EXPANSION.md.
Do not run paid CI on incomplete content checkpoints. Preserve all old IDs, recipes and saves.
