#!/usr/bin/env python3
from pathlib import Path
from collections import Counter,deque
from PIL import Image
import json,io,sys
root=Path(__file__).resolve().parents[1]
d=json.loads((root/'client/src/legacy-data.js').read_text().split('export const DATA = ',1)[1].rstrip().rstrip(';'))
p=json.loads((root/'shared/creative-pack.json').read_text())
names={f'legacy:{i}':row[0] for i,row in enumerate(d['items'])};names.update({r['id']:r['name'] for r in p['items']})
assert len(names)==len(d['items'])+len(p['items'])
recipes=[(f'legacy:{a}',f'legacy:{b}',f'legacy:{c}') for a,b,c in d['recipes']]+p['recipes']
keys=[tuple(sorted((a,b))) for a,b,c in recipes]
assert len(set(keys))==len(keys),"duplicate ingredient pair"
assert len(recipes)==5078 and len(names)==2788
assert all(a in names and b in names and c in names for a,b,c in recipes)
R={key:c for key,(_,_,c) in zip(keys,recipes)}
nameid={n.casefold():i for i,n in names.items()}
assert R[tuple(sorted((nameid['son goku'],nameid['playstation 2'])))]==nameid['dragon ball z: budokai 3']
# Confirm all new target concepts are reachable from the four starters.
reachable={f'legacy:{i}' for i in range(4)}
for _ in range(len(names)):
 after=set(reachable)
 for a,b,c in recipes:
  if a in reachable and b in reachable:after.add(c)
 if len(after)==len(reachable):break
 reachable=after
missing={r['id']:r['name'] for r in p['items'] if r['id'] not in reachable}
assert not missing, 'Unreachable pack elements: '+str(list(missing.values())[:10])
assets=list((root/'client/assets/v19').glob('*.webp'))
assert len(assets)==12
for f in assets:
 im=Image.open(f);assert im.size==(192,192) and im.mode=='RGBA',f
assert (root/'client/standalone.html').stat().st_size>1400000
assert 'data:image/webp;base64,' in (root/'client/standalone.html').read_text()
print(json.dumps({'items':len(names),'recipes':len(recipes),'reachable':len(reachable),'crossovers':len(json.loads((root/'shared/v19_crossovers.json').read_text())['recipes']),'static_icon_families':len(assets)},indent=2))
