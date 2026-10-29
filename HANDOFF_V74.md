# 35K Alchemy V74 — first validated subbatch towards the remaining 116

V73 baseline: **5,256 elements and 13,593 recipes**.

V74 source expansion: **48 new subject-specific SVGs** and **48 new Classic recipes**. Expected counts after validation: **5,304 elements / 13,641 recipes**. In the current 200-item cycle, 132/200 are addressed; **68 are still outstanding**. Do not describe them as complete.

Art: `client/assets/v74/*.svg`, `client/src/organic-art-v74.js`, `shared/v74-approved.json`.
Recipes and IDs: `client/src/organic-pack-v74.js`. Validation: `tools/validate-v74.mjs` checks uniqueness, deterministic mappings, and preservation of the entire V73 history.
The project-specific Alchemy Android test certificate, full-screen mode, inventory scroll anchor and targeted V73 crafting-space adjustment are unchanged.

This edition prioritizes gaming/arcade subject variety over filling the full remaining 116 with generic icons. Graphic recognition at 35px still requires a human pass on-device and an additional visual audit to avoid collections of superficially different repeated geometric motifs.

Next: improve any suspect silhouettes, close the remaining 68 with fresh subject-specific drawings and logical recipes, then start 200-element batches only where QA can keep up.

Latest Android APK: https://github.com/joaogdbg-ui/35K-Alchemy/releases/download/latest/35K-Alchemy.apk
Release: https://github.com/joaogdbg-ui/35K-Alchemy/releases/tag/latest
