from pathlib import Path
import json,subprocess,re,hashlib,ast,collections
root=Path(__file__).resolve().parents[1];raw=(root/'shared/v56-editorial-candidates.txt').read_text().strip().splitlines()
base=json.loads(subprocess.check_output(['node','tools/export-v56-base.mjs'],cwd=root));existing={x['name'].casefold().strip():x['id'] for x in base['items']};pair_map=base['recipes'];pairs=set(pair_map)
assert len(raw)==100
rows=[x.split('|') for x in raw];assert all(len(x)==5 for x in rows)
all_ids=dict(existing)
for name,cat,p,q,motif in rows:
 key=name.casefold().strip();assert key not in all_ids, ('duplicate name',name)
 all_ids[key]='organic56:'+re.sub('[^a-z0-9]+','-',key).strip('-')
assert len(set(all_ids.values()))==len(all_ids)
items=[];recipes=[];report=[]
for name,cat,p,q,motif in rows:
 rid=all_ids[name.casefold().strip()];valid=[];skipped=[]
 for r in [p,q]:
  a,b=[x.strip() for x in r.split('+')];ka,kb=a.lower(),b.lower()
  if ka not in existing or kb not in existing:skipped.append({'recipe':r,'reason':'unknown ingredient'});continue
  ia,ib=existing[ka],existing[kb];key='|'.join(sorted([ia,ib]))
  if key in pairs:skipped.append({'recipe':r,'reason':'pair already taken'});continue
  pairs.add(key);recipes.append([ia,ib,rid]);valid.append(r)
 assert valid,('no valid routes',name,p,q)
 items.append({'id':rid,'name':name,'category':cat,'summary':'Discover '+name.lower()+' by combining related ingredients.','iconFamily':'organic'})
 report.append({'name':name,'id':rid,'accepted':valid,'rejected':skipped})
assert len(items)==100 and len(set(i['name'].lower() for i in items))==100
assert all(r[2] in {x['id'] for x in items} for r in recipes)
# Art from approved V52 pictogram shapes, unique SVG artwork per new element
mod=ast.parse((root/'tools/generate-v52-art.py').read_text());motifs=None
for n in mod.body:
 if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='MOTIFS' for t in n.targets):motifs=ast.literal_eval(n.value)
assert motifs
icons={};manifest=[];folder=root/'client/assets/v56';folder.mkdir(parents=True,exist_ok=True)
for i,(name,cat,p,q,motif) in enumerate(rows):
 a,b=motif.split('+');assert a in motifs and b in motifs,(name,motif)
 # Identifying shape language: two larger pictograms, subtle unique placement, hue tint
 accent=['#D7B07F','#9CB6D5','#8BBFAB','#D8A194','#BCA4C9'][i%5]
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'
 '<ellipse cx="50" cy="94" rx="28" ry="3" fill="#524944" opacity=".12"/>'
 f'<circle cx="76" cy="20" r="9" fill="{accent}" opacity=".20"/>'
 f'<g transform="translate(10 12) scale(.77)">{motifs[a]}</g><g transform="translate(56 2) scale(.37)">{motifs[b]}</g>'
 '<path d="M14 15v6m-3-3h6M84 75v5m-3-2.5h6" stroke="#d5ac7b" stroke-width="2" stroke-linecap="round"/>'
 '</svg>')
 fn=re.sub('[^a-z0-9]+','-',name.lower()).strip('-')+'.svg';f=folder/fn;f.write_text(svg)
 icons[name.casefold()]=svg
 manifest.append({'id':all_ids[name.casefold()],'name':name,'path':'client/assets/v56/'+fn,'sha256':hashlib.sha256(svg.encode()).hexdigest(),'motifs':[a,b]})
assert len(set(icons.values()))==100
pack={'items':items,'recipes':recipes}
(root/'client/src/organic-pack-v56.js').write_text('/* V56 original, deterministic new discoveries. */\nexport const ORGANIC_V56 = '+json.dumps(pack,separators=(',',':'))+';\n')
(root/'client/src/organic-art-v56.js').write_text('/* V56 static SVGs, stored offline. */\nexport const ORGANIC_ART_V56 = '+json.dumps(icons,separators=(',',':'))+';\n')
(root/'shared/v56-editorial-plan.json').write_text(json.dumps({'version':56,'items':items,'recipes':recipes,'review':report},indent=2))
(root/'shared/v56-art-manifest.json').write_text(json.dumps({'version':56,'icons':manifest},indent=2))
print('V56 AUTHORED',len(items),'new elements',len(recipes),'new recipes',len(manifest),'SVGs')
print('one-route',sum(len(x['accepted'])==1 for x in report),'two-route',sum(len(x['accepted'])==2 for x in report))
