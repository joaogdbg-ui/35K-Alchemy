#!/usr/bin/env python3
"""Art-only independent review: use before sign-off of new alchemy expansions.
Flags duplicated SVG, repetitive composition, silhouette proximity and motif reuse.
A warning is not proof of plagiarism or artistic failure; a pass is not proof of quality.
"""
from pathlib import Path
from collections import Counter,defaultdict
import argparse,json,hashlib,io,math
from PIL import Image
import numpy as np
import cv2
import cairosvg
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--strict',action='store_true');p.add_argument('--output',default='docs/V61_VISUAL_QUALITY_REPORT.md');args=p.parse_args()
manifest=json.loads((ROOT/'shared/v61-art-manifest.json').read_text())['icons']
assert len(manifest)==200
raw=[];md=[];features=[];motifs=[];counter=Counter()
for e in manifest:
 svg=(ROOT/e['path']).read_text(encoding='utf8')
 raw.append(svg)
 counter[e.get('art_mode','legacy')]+=1
 if e['motifs']:motifs.append((e['name'],tuple(e['motifs'])))
 # color and compositional shape both affect perceived similarity
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=96,output_height=96)
 im=Image.open(io.BytesIO(png)).convert('RGBA')
 white=Image.new('RGBA',im.size,(255,255,255,255));white.alpha_composite(im)
 gray=cv2.cvtColor(np.array(white.convert('RGB')),cv2.COLOR_RGB2GRAY)
 gray=cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32')
 dct=cv2.dct(gray)[:8,:8].flatten()[1:]
 bits=dct>np.median(dct)
 features.append(bits)
 sig=hashlib.sha256(svg.encode()).hexdigest();md.append((e['name'],sig))
sig_groups=defaultdict(list)
for name,h in md:sig_groups[h].append(name)
duplicates=[x for x in sig_groups.values() if len(x)>1]
reused=Counter(pair for name,pair in motifs)
primary=Counter(pair[0] for name,pair in motifs)
near=[]
for i in range(len(features)):
 for j in range(i+1,len(features)):
  dist=int(np.count_nonzero(features[i]!=features[j]))
  if dist<=5:near.append((dist,manifest[i]['name'],manifest[j]['name']))
near.sort()
# Guidelines for V62 onward: visually different icons, avoid generic two-motif templates.
issues=[]
if duplicates:issues.append(f'Identical art files: {len(duplicates)} groups')
if counter['motif-composite']>30:issues.append(f'{counter["motif-composite"]}/200 reuse the two-motif collage layout (target <=30/200)')
if primary and primary.most_common(1)[0][1]>8:issues.append(f'Overused main subject: {primary.most_common(1)[0]} (target <=8 per 200)')
lines=['# V61 — Visual variety audit (art-direction gate)','',
'## Scope and limitations','',
'- All 200 V61 SVG icons are checked. Rendering at 96×96 and a 64-bit perceptual hash identify *possible* look-alikes; this is a **review queue**, not a substitute for visual inspection.',
'- An icon file having a unique hash **does not** prove that it looks different. Likewise, semantically related objects may legitimately resemble one another.',
'- Art references: official Little Alchemy 2, Doodle God, and Infinite Craft. Study general readability and discovery experience, **never copy sprites, silhouettes, characters, brand marks, or source assets**.',
'', '## Findings','',
 f'- Icons audited: **{len(manifest)}**',
 f'- Identical SVG files: **{len(duplicates)} groups**',
 f'- Art-directed object-specific silhouettes: **{counter["art-directed"]}**',
 f'- Two-motif collage templates remaining: **{counter["motif-composite"]}**',
 f'- Unique two-motif combinations still in use: **{len(reused)}**',
 f'- Closest-looking pairs flagged by perceptual hash (distance <=5): **{len(near)}**',
 '', '## Main motifs repeatedly used (among original templates)','',
 '| Motif | Number of icons |','|---|---:|']
lines += [f'| {motif} | {count} |' for motif,count in primary.most_common(12)]
lines+=['','## Examples of potential look-alikes','','| Hamming distance | Icon A | Icon B |','|---:|---|---|']
lines += [f'| {d} | {a} | {b} |' for d,a,b in near[:25]]
lines += ['','## Proposed visual style system','','1. **Recognizable silhouette at 35×35px.** One identifiable focal object (e.g. horn, crater, shell, instrument); decorative details are secondary.',
'2. **Four compositional families:** isolated object, living organism, process/phenomenon, and miniature scene. Rotate composition and viewpoint to avoid identical two-icon collages.',
'3. **Subject-specific anatomy and materials:** food has bowl/crumb/fruit details, geology has strata/facets, machines have readable components; do not represent all devices as a camera.',
'4. **Stable visual identity:** muted warm palette, clean flat shading, consistent outline, light shadow; controlled highlights rather than random repeated sparkles.',
'5. **Editorial uniqueness:** block normalized duplicate names/IDs and recipe conflicts, plus artist review of similar silhouettes and unsupported/forced recipes.',
'6. **Non-infringing inspiration:** derive principles from other games, never recreate identifiable sprites or trace third-party artwork.',
'', '## Gates for a future 200-icon pack','',
'- `python tools/audit-v61-visual-variety.py --strict` demonstrates the strict threshold **and presently fails on the legacy 184 templates**; this must be solved before treating the entire set as approved.',
'- For **new** packs: new icon count must match new element count; no duplicate hashes; max 15% generic two-motif collages; no single generic primary motif for more than eight of 200 icons; all perceptual-hash near matches require editorial signoff.',
'- Produce a contact sheet of **all 200** icons at game size and a screenshot on mobile in Light and Dark Mode; add human acceptance after zoomed and 35px inspection.',
'', '## Current release decision','',
 '**Prototype only.** The first 16 SVGs have been redrawn as distinct illustrations. The remaining 184 deserve review before claiming the V61 visual library fully satisfies the new art standard. No recipe or element ID was changed.',
'']
if issues:lines+=['### Outstanding strict-gate issues','']+[f'- {x}' for x in issues]+['']
out=ROOT/args.output;out.parent.mkdir(parents=True,exist_ok=True);out.write_text('\n'.join(lines),encoding='utf8')
(ROOT/'docs/V61_VISUAL_AUDIT_METRICS.json').write_text(json.dumps({'counts':dict(counter),'duplicates':duplicates,'nearest_pairs':near[:100],'primary_counts':primary.most_common(),'strict_issues':issues},indent=2),encoding='utf8')
print('Visual audit:',dict(counter),'identical:',len(duplicates),'near:',len(near),'strict issues:',len(issues))
if args.strict and issues:raise SystemExit(1)
