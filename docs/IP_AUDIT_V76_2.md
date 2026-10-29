# 35K Alchemy — V76.2 expanded IP-risk audit

**Outcome: automated engineering checks, not legal or artistic clearance.**

## Changes
- Expanded curated legacy game/media mock names by 154 additional mappings, on top of existing V76.1 rules. Existing canonical IDs and all recipes remain immutable.
- Names with separate scientific, technical, mythological or other common meanings (Valve, Halo, Portal, Sonic Wave, Hades) retain those meanings outside media categories.
- New `tools/audit-active-artwork.mjs` scans active organic SVGs and semantic vector art for executable markup, embedded links, raster images and text, and confirms V76 source art equals its runtime SVG.
- `tools/audit-ip-safe-names.mjs` prints the count of remaining unchanged media entries as a *human editorial review queue*. These entries may be generic/public domain or third-party titles; no automated binary legal conclusion is valid.
- Both audits run on builds and pull requests.

## Remaining release blockers
1. An artist must examine all older icons, WebP motifs, family icons and SVGs for resemblance to console trade dress, copyright characters, costumes, box art or logos. A markup check cannot identify these.
2. Review historical media names and descriptions, sound effects, screenshots, app icon, promotional assets and the third-party license/attribution chain. Avoid merely recoloring third-party designs.
3. Verify each proposed fictional brand through appropriate EUIPO/INPI/WIPO searches; no algorithm or superficial spelling change provides trademark clearance.
4. Verify local Android gameplay, backups, saved profiles, reward monetization and production signing. Debug APK is for testing only.

Google Play states that modifying copyrighted content can still infringe, and may require proof of rights. See [Intellectual Property](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en).

**Do not describe the result as legally guaranteed safe before a human art and legal review.**
