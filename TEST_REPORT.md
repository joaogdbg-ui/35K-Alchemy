# 35K Alchemy V68 — Test report

| Check | Result |
|---|---|
| `node --test client/test/*.test.mjs` | 252/252 PASS |
| `node tools/validate-v68.mjs` | PASS: 5172 elements, 13509 recipes, V67 preserved |
| `python tools/audit-v68-art.py` | PASS: 34 hash-verified SVGs, 0 exact duplicate hashes, 0 pHash near-pairs at threshold 6 |
| `python tools/build-standalone.py` | PASS: all historical validators and art audits, standalone produced |
| Repeated standalone build | PASS: same SHA-256 |
| Browser 360×740 | PASS: Classic/new recipe/new art/Sort/virtualized list |
| Browser 390×820 | PASS: Classic/new recipe/new art/Sort/virtualized list |
| Browser 1280×820 | PASS: Classic/new recipe/new art/Sort/virtualized list |
| Family Only at three sizes | PASS: two campaigns, 31 shared IDs, unavailable reward cannot switch |
| Merge offline and test-only native reward bridge | PASS: 0/2, 1/2, failed second, 2/2; persisted unlock |

Caveats: perceptual hash screening only compares the current 34 drawn icons, not the whole library. Real rewarded ads have not been tested or delivered. Android physical devices still require testing.
