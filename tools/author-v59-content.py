#!/usr/bin/env python3
"""V59: 200 specifically authored combinations; deterministic, no prior recipe changes.
Visuals are local hand-selected object motifs, each composition independently stored as SVG.
"""
from pathlib import Path
import json, hashlib, re, ast, subprocess, collections
ROOT=Path(__file__).resolve().parents[1]
base=json.loads(subprocess.check_output(['node','tools/export-v59-base.mjs'],cwd=ROOT))
ids={x['name'].casefold().strip():x['id'] for x in base['items']};used=set(base['recipes'])
raw=[line.strip().split('|') for line in (ROOT/'shared/v59-approved-200.txt').read_text().splitlines() if line.strip()]
assert len(raw)==200 and all(len(row)==5 for row in raw)
assert len(set(x[1].casefold().strip() for x in raw))==200
node=ast.parse((ROOT/'tools/generate-v52-art.py').read_text());motifs=None
for n in node.body:
 if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='MOTIFS' for t in n.targets): motifs=ast.literal_eval(n.value)
assert motifs and len(motifs)==46
palette={'Marine':'#72B7C9','Forest':'#81B990','Sky':'#9FB9DD','Earth':'#CFAB9D','Kitchen':'#EAB580','Devices':'#91B0CE','Space':'#A9A2D4','Craft':'#D9B785','Weather':'#9FB9DD','Astronomy':'#A9A2D4','Food':'#EAB580','Materials':'#CFAB9D','Engineering':'#91B0CE','Culture':'#C8AAC8','Wildlife':'#D9B785'}
items=[];recipes=[];icons={};manifest=[];editorial=[];folder=ROOT/'client/assets/v59';folder.mkdir(exist_ok=True,parents=True)
for index,(domain,name,cat,recipe,motif) in enumerate(raw):
 key=name.casefold().strip()
 assert key not in ids,('duplicate name',name)
 rid='organic59:'+re.sub(r'[^a-z0-9]+','-',key).strip('-')
 assert rid not in ids.values(),('duplicate ID',name)
 pair=[x.strip() for x in recipe.split('+')]
 assert len(pair)==2 and all(x.casefold() in ids for x in pair),('missing ingredient',name,recipe)
 a,b=[ids[x.casefold()] for x in pair];pk='|'.join(sorted([a,b]))
 assert pk not in used,('previous or duplicate unordered recipe',name,recipe)
 used.add(pk)
 x,y=motif.split('+');assert x in motifs and y in motifs,(name,motif)
 # Domain-specific tint + relevant illustration, a distinct authored combination for every name.
 color=palette[domain];h=int(hashlib.sha256(name.encode()).hexdigest()[:12],16)
 # Vary the accent position naturally, not just hue or a label.
 sides=[(62,12),(59,48),(66,33),(50,3),(56,55)];ax,ay=sides[h%5]
 dx=((h>>5)%9)-4;dy=((h>>9)%7)-3
 art=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'
      '<ellipse cx="49" cy="93" rx="30" ry="3" fill="#5C514B" opacity=".11"/>'
      f'<circle cx="81" cy="18" r="11" fill="{color}" opacity=".15"/>'
      f'<g transform="translate({9+dx} {10+dy}) scale(.77)">{motifs[x]}</g>'
      f'<g transform="translate({ax} {ay}) scale(.33)">{motifs[y]}</g>'
      f'<path d="M12 16v7m-3.5-3.5h7M86 73v6m-3-3h6" stroke="{color}" stroke-width="2.3" stroke-linecap="round"/>'
      '</svg>')
 assert art not in icons.values(),('duplicate SVG',name)
 fn=re.sub(r'[^a-z0-9]+','-',key).strip('-')+'.svg';path=folder/fn;path.write_text(art,encoding='utf8')
 icons[key]=art
 items.append({'id':rid,'name':name,'category':cat,'summary':'Discover '+name.lower()+' by combining related elements.','iconFamily':'organic'})
 recipes.append([a,b,rid]);editorial.append({'branch':domain,'name':name,'id':rid,'ingredients':pair,'icon':fn})
 manifest.append({'id':rid,'name':name,'file':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(art.encode()).hexdigest(),'motifs':[x,y]})
assert len(items)==len(recipes)==len(icons)==200
(ROOT/'client/src/organic-pack-v59.js').write_text('/* V59: 200 new results from specific editorial combinations */\nexport const ORGANIC_V59 = '+json.dumps({'items':items,'recipes':recipes},separators=(',',':'))+';\n')
(ROOT/'client/src/organic-art-v59.js').write_text('/* V59: 200 original local SVG illustrations */\nexport const ORGANIC_ART_V59 = '+json.dumps(icons,separators=(',',':'))+';\n')
(ROOT/'shared/v59-editorial-plan.json').write_text(json.dumps({'version':58,'count':200,'results':editorial},indent=2)+'\n')
(ROOT/'shared/v59-art-manifest.json').write_text(json.dumps({'version':58,'icons':manifest},indent=2)+'\n')
print('V59 CONTENT OK',len(items),'items',len(recipes),'recipes',len(icons),'individual SVGs',dict(collections.Counter(x['branch'] for x in editorial)))
