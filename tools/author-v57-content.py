#!/usr/bin/env python3
"""V57: 200 editorially reviewed new items and original offline static icon compositions.
Strict: source catalog integrity; unknown ingredients, duplicate names or occupied input pairs fail."""
from pathlib import Path
import json, hashlib, re, ast, subprocess, collections
R=Path(__file__).resolve().parents[1]
base=json.loads(subprocess.check_output(['node','tools/export-v57-base.mjs'],cwd=R))
ids={x['name'].casefold().strip():x['id'] for x in base['items']}
prior=base['recipes']; used=set(prior)
raw=[line.strip().split('|') for line in (R/'shared/v57-approved-200.txt').read_text().splitlines() if line.strip()]
assert len(raw)==200 and all(len(row)==5 for row in raw)
assert len(set(x[1].casefold().strip() for x in raw))==200
node=ast.parse((R/'tools/generate-v52-art.py').read_text());motifs=None
for n in node.body:
 if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='MOTIFS' for t in n.targets):motifs=ast.literal_eval(n.value)
assert motifs and len(motifs)>40
palette={'Marine':'#73B8CA','Weather':'#A6B7DA','Plants':'#85BA9E','Wildlife':'#D0AB7A','Geology':'#B19DAC','Food':'#E5B37B','Culture':'#C6A2BB','Technology':'#89A9CF','Astronomy':'#9F9DC4','Crafts':'#D4AB90'}
items=[];recipes=[];icons={};manifest=[];editorial=[];folder=R/'client/assets/v57';folder.mkdir(exist_ok=True,parents=True)
for i,(domain,name,cat,recipe,motif) in enumerate(raw):
 key=name.casefold().strip(); assert key not in ids,('existing name',name)
 rid='organic57:'+re.sub(r'[^a-z0-9]+','-',key).strip('-');assert rid not in ids.values()
 a,b=[x.strip() for x in recipe.split('+')];assert a.casefold() in ids and b.casefold() in ids,(name,recipe)
 aid,bid=ids[a.casefold()],ids[b.casefold()];pk='|'.join(sorted([aid,bid]));assert pk not in used,('occupied unordered recipe',name,recipe)
 used.add(pk)
 x,y=motif.split('+');assert x in motifs and y in motifs,(name,motif)
 # Domain-specific palette and readable, vector shapes; both graphic parts are supplied by original pictogram motifs.
 color=palette[domain];variation=int(hashlib.sha256(name.encode()).hexdigest()[:4],16)%5
 orientation=['left','right','top','bottom','overlap'][variation]
 coords={'left':(7,8,53,16),'right':(14,8,4,44),'top':(10,8,54,52),'bottom':(11,10,51,12),'overlap':(6,12,51,33)}[orientation]
 lx,ly,rx,ry=coords
 # Meaningful motif pairing has a subtle item-specific arrangement, reducing identical silhouettes.
 seed=int(hashlib.sha256(name.encode()).hexdigest()[4:10],16)
 lx+=(seed%7)-3; ly+=((seed//7)%7)-3; rx+=((seed//49)%9)-4; ry+=((seed//441)%9)-4
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'
   f'<circle cx="82" cy="17" r="9" fill="{color}" opacity=".20"/>'
   '<ellipse cx="48" cy="94" rx="29" ry="3" fill="#5A514B" opacity=".10"/>'
   f'<g transform="translate({lx} {ly}) scale(.78)">{motifs[x]}</g>'
   f'<g transform="translate({rx} {ry}) scale(.32)">{motifs[y]}</g>'
   f'<path d="M12 16v7m-3.5-3.5h7M84 72v6m-3-3h6" stroke="{color}" stroke-width="2.5" stroke-linecap="round"/>'
   '</svg>')
 assert svg not in icons.values(), ('same SVG',name)
 fn=re.sub(r'[^a-z0-9]+','-',key).strip('-')+'.svg';path=folder/fn;path.write_text(svg)
 icons[key]=svg;items.append({'id':rid,'name':name,'category':cat,'summary':'Explore '+name.lower()+' through a meaningful combination.','iconFamily':'organic'})
 recipes.append([aid,bid,rid]);manifest.append({'id':rid,'name':name,'file':str(path.relative_to(R)),'sha256':hashlib.sha256(svg.encode()).hexdigest(),'motifs':[x,y]})
 editorial.append({'family':domain,'name':name,'id':rid,'ingredients':[a,b],'result':name,'icon':fn})
 assert all(z!='' for z in [name,rid,cat])
assert len(items)==200 and len(recipes)==200 and len(icons)==200
(R/'client/src/organic-pack-v57.js').write_text('/* Original deterministic V57 recipes, new outputs only */\nexport const ORGANIC_V57 = '+json.dumps({'items':items,'recipes':recipes},separators=(',',':'))+';\n')
(R/'client/src/organic-art-v57.js').write_text('/* Original offline V57 SVG illustrations */\nexport const ORGANIC_ART_V57 = '+json.dumps(icons,separators=(',',':'))+';\n')
(R/'shared/v57-editorial-plan.json').write_text(json.dumps({'version':57,'count':200,'results':editorial},indent=2))
(R/'shared/v57-art-manifest.json').write_text(json.dumps({'version':57,'icons':manifest},indent=2))
print('V57: generated 200 curated outputs, 200 unique deterministic recipes and 200 independent SVG icons')
print('By group:',dict(collections.Counter(x['family'] for x in editorial)))
