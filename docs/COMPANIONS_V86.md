# Companions (V86) — design and roadmap

Owner request (31 Oct 2026). Five companion elements per family (8 families → 40 companions,
`tools/v86-companions.json`). A companion is unlocked when its element is discovered in any mode.

## In the game today
- **Companions tab**: active companion with level, mood and stats; every companion by family
  (locked ones as silhouettes); Choose / Send home; in-app guide and the mini-game plan.
- **On screen** (`client/src/companion-engine-v86.js`): walks along the top edges of the banner,
  combiner card, shelf and tab bar; hops; climbs the side of the combiner card; knocks on the
  screen edge (ripple + "toc toc"); passes behind the frames (a back layer under the cards);
  points at the locked left ingredient and shakes its head when it has no combination left;
  sleeps after 2.5 min without input; blinks; family/move-specific quirk animations.
- **Gifts**: every 2.5–5 min it drops its gift (Stegosaurus → Egg, Fox → Pinecone…), which stays
  (max 3) until tapped: +2 XP, +6 mood.
- **Feeding**: drag an element chip onto the companion. Own family = favourite (+3 XP, +12 mood),
  neutral (+1 XP, +5 mood), refused (category dislikes, −3 mood). An element feeds the same
  companion once per 30 min. New discoveries while active: +1 XP.
- **Levels**: `xpForLevel(l)=10+3l` up to 100 (≈15,800 XP total). Stats Stamina / Strength /
  Speed / HP from family base + move bonus + per-stat growth per level; Shiny companion ×1.05.
- **Mood**: 0–100, −1 per 10 min; sad (≤30) walks at 60% speed and looks desaturated.
- Saved in `alchemy10k_companions_v1` (in backups); respects `prefers-reduced-motion`.

## Sprites
Rigged 100×100 SVGs in `client/assets/companions/` (kit: the sprite kit used for V86), parts with
`data-part` (body, head, eye-l/r, leg-l/r, arm-l/r, wing-l/r, tail, extra) and `data-pivot`;
CSS keyframes in `styles.css` (`cp-*`) animate the parts. `tools/v86-assemble-companions.py`
validates and bundles them into `client/src/companions-v86.js`.

## Next: companion mini-games (not built yet)
Each companion unlocks a different auto-play mini-game (race, climb, swim, dig, fly, dance…):
the companion plays by itself using its stats; the player taps for a boost that spends Stamina.
Bronze/silver/gold medals; goal = gold in every mini-game. Suggested first three: Sprint
(Speed), Cliff Climb (Strength), Long Haul (Stamina/HP). XP from medals feeds the same levels.
