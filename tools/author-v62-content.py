#!/usr/bin/env python3
"""Build the V62 art-first pack. Explicitly approved recipes; no runtime synthesis."""
from pathlib import Path
import json,subprocess,hashlib,unicodedata,re,collections,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1]
base=json.loads(subprocess.check_output(['node','tools/export-v61-base.mjs'],cwd=R))
v61=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{ORGANIC_V61}from './client/src/organic-pack-v61.js';console.log(JSON.stringify(ORGANIC_V61))"],cwd=R))
norm=lambda a:unicodedata.normalize('NFKD',a).casefold().strip()
lookup={norm(x['name']):x['id'] for x in [*base['items'],*v61['items']]}
used=set(base['recipes'])|{'|'.join(sorted((a,b))) for a,b,_ in v61['recipes']}
art={};manifest=[];items=[];recipes=[];approval=[]
domcats={'Marine':'nature','Botany':'nature','Geology':'material','Food':'life','Wildlife':'life','Atmosphere':'science','Tools':'technology','Culture':'culture','Technology':'technology','Astronomy':'science'}
selected=json.loads((R/'shared/v62-audit-draft.json').read_text())['valid']
for domain,name,a,b in selected:
 assert norm(name) not in lookup,('duplicate name',name)
 x,y=lookup[norm(a)],lookup[norm(b)]
 pair='|'.join(sorted([x,y]));assert pair not in used,('occupied pair',name,a,b)
 used.add(pair)
 rid='organic62:'+re.sub(r'[^a-z0-9]+','-',name.casefold()).strip('-')
 path=R/'client/assets/v62'/(rid.split(':')[1]+'.svg')
 svg=path.read_text().strip();ET.fromstring(svg)
 assert '<image' not in svg and '<script' not in svg
 items.append({'id':rid,'name':name,'category':domcats[domain],'summary':f'{name}, created from {a.lower()} and {b.lower()}.','iconFamily':'organic'})
 recipes.append([x,y,rid]);art[norm(name)]=svg
 approval.append({'branch':domain,'name':name,'id':rid,'ingredients':[a,b],'art':path.name})
 manifest.append({'id':rid,'name':name,'path':str(path.relative_to(R)),'sha256':hashlib.sha256(svg.encode()).hexdigest(),'art_mode':'bespoke-silhouette','motifs':[]})
assert len(approval)==35 and len(set(art.values()))==35
(R/'client/src/organic-pack-v62.js').write_text('/* V62 art-first: bespoke assets and curated, global deterministic recipes */\nexport const ORGANIC_V62 = '+json.dumps({'items':items,'recipes':recipes},ensure_ascii=False,separators=(',',':'))+';\n')
(R/'client/src/organic-art-v62.js').write_text('/* V62 bespoke offline SVGs. Not constructed by the V61 generic motif composer. */\nexport const ORGANIC_ART_V62 = '+json.dumps(art,ensure_ascii=False,separators=(',',':'))+';\n')
(R/'shared/v62-approved.json').write_text(json.dumps({'version':62,'count':len(items),'results':approval},indent=2)+'\n')
(R/'shared/v62-art-manifest.json').write_text(json.dumps({'version':62,'icons':manifest},indent=2)+'\n')
print('V62 authoring complete:',len(items),'new elements',len(recipes),'new recipes',len(art),'bespoke SVGs',dict(collections.Counter(x['branch'] for x in approval)))
