# Families Only recipe authoring — Alchemy 10K

Alchemy 10K is an Android "combine two elements" game (A + B = C; order never matters). It has a
Classic mode (start with Water, Fire, Earth, Air) and a **Families Only** mode: the player picks one
family (e.g. Video Games) and plays it as an independent campaign. The owner's rules:

1. A family campaign must be completable **on its own**: starting from **4 family starters**, every
   member of the family must be craftable using only recipes whose two ingredients AND result are
   all members of that same family.
2. The 4 starters are different from Classic: **never Water, Fire, Earth or Air** (legacy:0–3).
3. Every element that belongs in the family must be in it, and recipes may be added to make that
   happen.

Today almost every member is only craftable from ingredients in other families, so you will write
new in-family recipes.

## Inputs
- `/home/claude/fam/data/<family>.json` — every member: id, name, cat, summary, classicRecipe
  (how Classic makes it today: useful to understand what the element means).
- `node /home/claude/fam/find.mjs '<regex>'` — search the full 6,212-item catalog by name
  (id | name | category | families).
- `node /home/claude/fam/check.mjs <family> <your.json> [--base other.json] [--targets ids.json]`
  — validates your proposal against the real game catalog and reports errors, dead recipes and
  every member that is still UNREACHED from the starters. Run it often. (Ignore Node warnings.)

## Your proposal file (JSON)
```json
{"starters":["id","id","id","id"],
 "addMembers":["id", "..."],
 "recipes":[["ingredientA","ingredientB","result"], "..."],
 "misfiled":[{"id":"...","to":"nature","reason":"..."}]}
```
All values are element **ids** (never names).

## Recipe rules (quality matters: real players will learn these)
- Every recipe must make sense to a player at a glance: the two ingredients clearly lead to the
  result (part + part = whole, thing + modifier = variant, genre + theme = sub-genre, series +
  "sequel"-type concept = next entry, creator + medium = work, era + subject = period piece...).
  Prefer learnable **patterns** the player can reuse. No random pairings.
- Recipes are global: each new pair also becomes an alternative recipe in Classic. A pair that
  already exists in the game can never be reused for a different result (the checker reports it:
  pick another pair). A + A (same element twice) is allowed. The result may not be one of its own
  ingredients.
- Build a real progression: the starters are broad and basic (the natural roots of the theme, the
  first 4 icons a player sees), then early, simple elements, then specific ones. Don't route
  everything through one hub: keep any single ingredient under ~40 uses.
- Ingredients must be reachable before the result (the checker computes this; "DEAD" means a
  recipe whose ingredients are never reachable).
- Existing in-family recipes already count; you only add what's missing.
- Pop-culture names already exist in the game; you only write recipes for them (genre/series/
  medium logic). Don't rename or create elements.
- `addMembers`: elements currently in other families that clearly belong in yours too (they keep
  their other family; elements may be in several). Use sparingly and only when it obviously makes
  the family more complete or logical. You must make them reachable too.
- `misfiled`: members that clearly do not belong in your family. Still make them reachable with the
  most sensible in-family recipe you can; list them so the owner can move them later.

## Modes
- **Full**: make every member reachable → checker prints `OK: all targets reachable, no errors`.
- **Lead** (large families): choose the starters and build the backbone — the ~150–250 hub/core
  members everything else naturally comes from (genres, eras, platforms, franchise roots, key
  concepts) — so later agents can attach the remaining members. Also write
  `/home/claude/fam/out/<family>-patterns.md` (≤40 lines): starters, the recipe patterns you used,
  hub elements to build on, and pitfalls. No errors allowed in the final check.
- **Chunk**: given `--base out/<family>-lead.json` and a targets file, make every target reachable,
  following the lead's patterns file. Your file holds only your new recipes (no starters).

## Output
Write to the path given in your task. Touch nothing else, and never edit /home/claude/35k-alchemy.
Final reply ≤150 words: starters (names), recipes added, final checker line, anything doubtful.
Don't claim checks you didn't run.
