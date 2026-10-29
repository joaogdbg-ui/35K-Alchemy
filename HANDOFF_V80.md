# V80B — 40/200 (third content cycle)

- V79 prior catalog: **5,572 elements / 13,909 recipes**. V80B includes all eight V80A discoveries plus **32 newly written, individually illustrated** discoveries. Integrated Classic: **5612 elements / 13949 fixed unordered recipes**; **160 still required** to reach this cycle's 200.
- New recipe bridges with accessible legacy inputs (Sea, Wind, Tool, Glass, Book, Cave, etc.) aim to prevent every late-game recipe requiring two late-game ingredients. Existing recipe results, public IDs, player saves and modes remain unchanged.
- SVG source in `client/assets/v80`, exact-match inline runtime map `client/src/organic-art-v80.js`, manifest `shared/v80-approved.json`, visual gallery `docs/V80_ART_REVIEW.md`.
- Validator asserts recipe immutability, name and pair uniqueness, stage-local dependency order, catalog reachability from four Classic starters, source/art integrity. Full CI remains mandatory for merge. Target of 200 in one future iteration is a **quality-contingent goal, not yet achieved**.
- Family Only campaigns, Settings V76.8, Cloud/Google leaderboards (unimplemented) and rewarded ads (not simulated) remain untouched.
- Device-level 35px QA, real Android gameplay, visual duplicate review and IP clearance require manual work.

After CI and GitHub Android build: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
