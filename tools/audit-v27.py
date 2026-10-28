from pathlib import Path
import json,hashlib,collections
r=Path(__file__).resolve().parents[1]
p=r/'client/src'
def j(n):return json.loads((p/n).read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
base=j('legacy-data.js')
packs=[j(x) for x in ['creative-pack.js','gaming-pack-v22.js','gaming-pack-v23.js','gaming-pack-v24.js','gaming-pack-v26.js','gaming-pack-v27.js']]
allids={f'legacy:{i}' for i in range(len(base['items']))}
for pack in packs:
 for obj in pack['items']:
  assert obj['id'] not in allids,('duplicate id',obj)
  allids.add(obj['id'])
recipes={}
for a,b,o in base['recipes']:
 assert 0<=a<len(base['items']) and 0<=b<len(base['items']) and 0<=o<len(base['items'])
 recipes['|'.join(sorted([f'legacy:{a}',f'legacy:{b}']))]=f'legacy:{o}'
oldrecipes=recipes.copy()
for pack in packs:
 for a,b,o in pack['recipes']:
  assert a in allids and b in allids and o in allids,(a,b,o)
  key='|'.join(sorted([a,b]))
  if key in recipes:assert recipes[key]==o,('conflict',key,recipes[key],o)
  recipes[key]=o
for k,o in oldrecipes.items():assert recipes[k]==o
reachable={f'legacy:{i}' for i in range(4)}
for _ in range(100):
 before=len(reachable)
 for k,o in recipes.items():
  a,b=k.split('|')
  if a in reachable and b in reachable:reachable.add(o)
 if len(reachable)==before:break
assert len(allids-reachable)==0,('unreachable',len(allids-reachable),list(allids-reachable)[:10])
assetdir=r/'client/assets/v27'
variants=list(assetdir.glob('*~*.webp'))
assert len(variants)==540,len(variants)
assert len({hashlib.sha256(x.read_bytes()).hexdigest() for x in variants})==540,'duplicate image compositions'
assert len(list(assetdir.glob('*.svg')))==45
assert all(x.stat().st_size<17000 for x in variants)
s= (r/'35K_Alchemy_V27_Offline.html').read_text(encoding='utf8')
assert s.count('<script')==1 and 'V27 Offline' in s and 'GAMEVERSE_ART_V27_VARIANTS' in s
assert 'animation' in (p/'styles.css').read_text()
counts={'elements':len(allids),'recipes':len(recipes),'new_elements':len(packs[-1]['items']),'new_recipes':len(packs[-1]['recipes']),'hand_drawn':45,'static_compositions':len(variants),'image_bytes':sum(x.stat().st_size for x in variants),'standalone_html_bytes':len(s.encode('utf8')),'all_reachable':True}
(r/'TEST_REPORT_V27.json').write_text(json.dumps(counts,indent=2),encoding='utf8')
print(json.dumps(counts,indent=2))
