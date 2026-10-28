from pathlib import Path
import json,subprocess,unicodedata
R=Path(__file__).resolve().parents[1]
j=json.loads(subprocess.check_output(['node','tools/export-v61-base.mjs'],cwd=R))
# add v61 via direct module in node
js='''import{ORGANIC_V61}from './client/src/organic-pack-v61.js';console.log(JSON.stringify(ORGANIC_V61))'''
v=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=R))
items=j['items']+v['items'];norm=lambda a:unicodedata.normalize('NFKD',a).casefold().strip()
n={norm(i['name']):i['id'] for i in items};used=set(j['recipes']);used.update('|'.join(sorted([a,b])) for a,b,_ in v['recipes'])
valid=[];invalid=[];domain=''
for raw in (R/'shared/v62-proposals.txt').read_text().splitlines():
 if not raw or raw.startswith('#'):continue
 if raw.startswith('['):domain=raw.strip('[]');continue
 name,a,b,c,d=raw.split('|');
 if norm(name) in n:invalid.append((domain,name,'DUPLICATE NAME'));continue
 ok=None
 for x,y in [(a,b),(c,d)]:
  if norm(x) not in n or norm(y) not in n:continue
  pair='|'.join(sorted([n[norm(x)],n[norm(y)]]))
  if pair in used:continue
  ok=(x,y,pair);break
 if ok:valid.append((domain,name,ok[0],ok[1]));used.add(ok[2])
 else:invalid.append((domain,name,'occupied or absent '+str([(x,y) for x,y in [(a,b),(c,d)]])))
from collections import Counter
print('VALID',len(valid),Counter(x[0] for x in valid))
print('INVALID',len(invalid));print(*invalid,sep='\n')
(R/'shared/v62-audit-draft.json').write_text(json.dumps({'valid':valid,'invalid':invalid},indent=2))
