# 35K Alchemy V33 — Rewarded-only hints (canonical)

- There is no clue-credit currency, cost, daily free balance, or automatic credit grant. Previous versions' earned recipe clues remain visible through the v20 hint storage key; the obsolete `spent` value is ignored.
- The crafting `✧ Hint` button selects one achievable undiscovered recipe and immediately invokes the native Android rewarded ad bridge. On `{earned:true}`, the pair is revealed and stored as `recipe` (greyed target in Discoveries). The target stays `????` until crafted.
- The family action `Watch Ad · Reveal Recipe` also requests one rewarded advertisement and reveals one full recipe within that family after successful reward. Unknown entry details offer the same action.
- Existing revealed recipes are free to inspect; no new ad for viewing a saved pair.
- **Standalone offline HTML does not play ads.** Pressing Hint displays an explanation; it never grants a reward, starts a fake advertisement, or uses credits. The Android plugin is scaffolding, not a compiled, published AdMob integration.
- Reward requires a genuine Android Capacitor plugin callback (not a browser shim), `earned===true`. Dismissal, load/show failures, errors, and cancelled video do not reveal recipes.
- The legacy `gameverse_discovery_hints_v20` storage and backup keys are preserved for progress compatibility, with v=20 and clues. Imported legacy partial hints remain readable.
- Batch Combine has its own separate one-time free trial and optional rewarded ad mechanism; V33 does not alter it.
- Before publishing: compile Capacitor Android, configure AdMob with approved IDs, privacy/consent (incl. EEA UMP), validate plugin registration, lifecycle, offlining, ad availability and reward callbacks on physical devices. Native client rewards can be tampered with; do not use as globally trusted currency.
