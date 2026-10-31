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

## V86.1 (owner feedback)
- No text anywhere: every gesture is sprite animation (tongue flick, trunk trumpet, fire breath, flame burst, sword swing, head spin, three heads, smoke vanish, belly slide, pounce/charge/skid, phase through a card…), plus drawn effects (knock ripples + screen nudge, sleep bubbles, hearts, level-up stars, the eaten element flying into the mouth).
- Continuous motion: a requestAnimationFrame mover with eased travel, parabolic jumps that swap the layer at the apex (so going behind a card is a visible jump), climbing the combiner's side, 8-step walk cycles synced to speed, counter-bobbing head, opposite arm swing.
- Companions are now only characters with bodies (people, animals, creatures, robots): Game Controller/Dice/Arcade Machine/Band/Violin/Drum/Globe/Flag/Great Sphinx/Peking Duck were replaced by Hero, Werewolf, Pixel Artist, Singer, Ninja, Giant Robot, Flamenco, Tango, Rio Carnival, Day of the Dead.
- Rig v2: every sprite has `mouth` or `jaw` and its quirk parts (`tongue`, `trunk`, `breath`, `flames`, `sparkle`, `flash`, `bee`, `sand`, `notes`, `smoke`, `antenna`, `screen`, `head-b/c`, `sword`, `brush`), validated by `tools/v86-assemble-companions.py`.

## V86.2 — Chao-style stats (owner request, SA2B model)
- Six stats, each with its own level 0–99, a 0–99 progress bar and points (cap 3,375): HP, Stamina, Run, Power, Swim, Fly. Each companion has a grade E–S per stat (`companionGrades`: family base + movement + signature overrides, Shiny +1 grade). Level-up gain = grade×3+13 ±2 (SA2B formula).
- Feeding gives bar points by the element's family (`FAMILY_FEEDS`): main stat +24 (+40 if the companion's own family), secondary +10/+16; Shiny element ×2; 30-min cooldown per element still applies (eats anyway, no gain).
- The companion grabs the element (`grab` → `hold-eat`), chews ~3 s while the held art loses bites, and a floating window (`.companion-statwin`) animates the touched rows: pink bar fills and wraps, Lv flips with a flash, points count up; stars burst on level-up.
- Self-feeding: every 3–7 min it jumps onto the element list, the chip art lifts into its hands, it sniffs and eats.
- Companions tab shows the SA2-style panel (name, points, Lv, grade, pink progress bar, blue 10-notch level bar). Run points raise on-screen speed.
