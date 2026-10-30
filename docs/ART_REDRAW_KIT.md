# V83 art kit — Alchemy 10K icon style (match V82 exactly, but every icon distinct)

Every icon is a hand-authored, self-contained SVG, 100×100, that portrays its subject so a
player recognises it at 35 px WITHOUT the label. Same visual family as V82; never the same
drawing twice.

## File skeleton (mandatory)
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g stroke-linejoin="round" stroke-linecap="round">
  <ellipse cx="50" cy="94" rx="34" ry="3" fill="#88979B" opacity=".14"/>      ← soft ground shadow (vary rx 26–38, cy 92–96)
  … subject shapes …
</g></svg>
```
- Single line, no XML declaration, no comments, no `<text>`, `<image>`, `<use>`, `<script>`, `<style>`, `<animate>`, `<foreignObject>`, no `href`, no `on*` attributes, no external URLs. Allowed tags only: svg, g, path, rect, circle, ellipse, line, polygon, polyline (gradients allowed but avoid; flat colour is the house style).
- At least 5 drawing elements (path/rect/circle/ellipse/line/polygon/polyline) and at least ~410 characters. Keep under ~3,500 characters.
- Coordinates inside 4…96. Leave ~6 px margin so the 35 px tile does not clip.

## Line and colour
- Main outline: `stroke="#657D89"` width 3–4 (big silhouettes 4, details 2–3). Darker accent outline allowed: `#4F6269`, `#374D59` for eyes/pupils/small dark details.
- Fills: muted, warm-cool pastel palette. Pick 2–4 fills + one accent per icon from:
  - sands/creams `#DBCAAC #E7D9C5 #EADFCB #E1CBB0 #D4B997 #C7BBA7 #F4E4C6`
  - sage/greens `#C5D3CC #8E9C88 #9BAC8F #BFC0A8 #7CA58B #A9C29A`
  - blue-greys `#A7B5BB #A9B0B8 #B2B9C1 #9FAEB8 #CBD5D3 #A6D0D5 #C7D9D8`
  - warm accents (sparingly) `#E3B36A #D98C5F #C9705A #EBD4A5 #E8C35D` · violet `#C7BAC4 #9D8790 #B9A5C9` · rust/brown `#A58D86 #A09089 #9C7A5B #7E6450`
- No pure black/white; lightest highlight `#F7F1E6`, darkest `#374D59`.
- Optional tiny decoration (max 2): sparkle dots `<circle r="1" fill="#EADFCB"/>`, a short ground line `<path d="M14 88h72" stroke="#9BAC8F" stroke-width="5"/>` for creatures/landscapes.

## Composition rules (from docs/ART_DIRECTION_STANDARD.md)
1. The noun decides the silhouette: a trident is a trident; a sabre-tooth cat shows the two long canines; Anubis shows a jackal head; an ammonite shows the coiled ribbed shell.
2. ONE dominant subject, large (fills ~60–75 % of the box). Recognisable at 35 px: bold shapes, few small details.
3. Vary viewpoint and framing across the batch: side profile, three-quarter, front, top-down, close-up of the head, object on a plinth, mini-landscape, cross-section. Never reuse the same body template with a recolour.
4. Creatures: give each species its defining anatomy (crest, frill, sail, armour plates, club tail, long neck, feathers, tusks, shell spiral, fins, trunk). Different poses: walking, rearing, swimming, flying, head close-up, skull, footprint, fossil slab.
5. Gods/heroes: do NOT draw the same bust with closed eyes each time. Prefer the attribute or a scene: Thoth = ibis head + scroll; Sekhmet = lioness head + sun disc; Hecate = three torches; Nike = winged figure / wreath; Tiamat = sea serpent coils; Raijin = drum ring + lightning. Faces, when drawn, vary (profile, front, mask, helmet).
6. Places/realms = mini-landscapes with a distinct landmark; artifacts = the object large and centred, slight 3/4 angle.
7. Originality: no logos, no copyrighted character designs, no modern franchise looks (no Marvel Thor helmet, no Jurassic Park logo, no God of War Kratos).

## Example (V82 style reference)
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g stroke-linejoin="round" stroke-linecap="round"><ellipse cx="50" cy="94" rx="34" ry="3" fill="#8D91A2" opacity=".15"/><path d="M28 85 20 30 37 10l32 5 12 62-14 14H28Z" fill="#9FAEB8" stroke="#6D8992" stroke-width="5"/><path d="M38 19 62 22l11 50-12 11H35l-6-48Z" fill="#CBD5D3" stroke="#8598A2" stroke-width="2"/><path d="M40 30v35m0-35 16 14-16 4m16-4v20M38 73l12-9 12 11M53 28l9 10-10 9 13 10" stroke="#597C9C" stroke-width="4" fill="none"/><path d="M14 88h72" stroke="#9BAC8F" stroke-width="6"/><circle cx="73" cy="17" r="4" fill="#EBD4A5"/></g></svg>
```
(runestone). See also /home/claude/35k-alchemy/client/assets/v82/*.svg — match their finish, but make V83 silhouettes clearly different from any V82 icon of a related subject.

## Self-check before saving each file
- Render it (python: `cairosvg.svg2png(bytestring=svg.encode(), output_width=35, output_height=35)`), look at it: can you name the subject at 35 px?
- Is it different in silhouette from the other icons you drew and from the V82 icon of the nearest subject?


---

# Redraw brief (Wave 1) — Alchemy 10K

You are an icon illustrator for the Android game Alchemy 10K. The owner loved the new V83 icons
(/home/claude/35k-alchemy/client/assets/v83/*.svg) and wants every older element redrawn in that
art direction. You redraw a batch of EXISTING elements: the old art is being replaced, so do not
copy it; draw each subject fresh.

Inputs: your batch file (fields: id, file, name, category, families, summary, madeFrom = recipes that
produce it, useful context for what it means in the game).

Follow /home/claude/redraw/ART_KIT.md exactly (skeleton, allowed tags, #657D89 rounded outlines 3–4 px,
muted pastel palette, soft ground shadow, flat colour, no text, ≥5 shapes, ≥410 chars, inside 4–96).
Render 6–8 V83 icons first to calibrate the finish and level of detail.

Write each icon to /home/claude/redraw/svg/<file> (one line). Touch only your batch's files.

Quality bar:
- Recognisable at 35 px without the label; one dominant subject, bold silhouette.
- Clearly different from every other icon in your batch (similar subjects — e.g. many weather or
  coastal items — must differ in composition, viewpoint and key object, not just colour).
- Basic elements (Water, Fire, Earth, Air, Steam, Mud…) must be iconic and simple: these are the
  first icons every player sees.
- Pop-culture or brand-like names: draw a generic object/genre (a cartridge, a handheld, a controller,
  an arcade cabinet, a stage), NEVER a character, logo, mascot or trade dress.
- Gods/creatures/dinosaurs: subject-specific anatomy and attributes; vary poses and framings; no
  generic body template, no franchise likeness.

Process: draw → render all to a contact sheet at 35 px and 96 px (python cairosvg + PIL are
installed) → view it with Read → redraw what is unclear, too similar, clipped or off-style → repeat.
Check every file programmatically (allowed tags only, no text/image/use/script/style/href/on*,
≥5 shapes, ≥410 chars, one line, exact skeleton start).

Save the final contact sheet to /home/claude/redraw/sheets/<batch name>.png and reply in ≤120 words:
files done (count), and any icon you are not happy with. Don't claim checks you didn't run.
Never edit anything under /home/claude/35k-alchemy.
