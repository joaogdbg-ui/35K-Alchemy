#!/usr/bin/env python3
"""Audited incremental offline game catalog. No random invented titles and no replacement of old recipes."""
from pathlib import Path
import json,re,unicodedata,collections
root=Path(__file__).resolve().parents[1]
p=root/'client/src'
def read(fn):return json.loads((p/fn).read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
base=read('legacy-data.js')
prior=[read(f) for f in ['creative-pack.js','gaming-pack-v22.js','gaming-pack-v23.js','gaming-pack-v24.js','gaming-pack-v26.js']]
ids={f'legacy:{i}':a[0] for i,a in enumerate(base['items'])}
for pack in prior:
 for x in pack['items']:ids[x['id']]=x['name']
norm=lambda s:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',str(s).casefold()).encode('ascii','ignore').decode())
byname={norm(v):k for k,v in ids.items()}
key=lambda a,b:'|'.join(sorted((a,b)))
existing={key('legacy:'+str(a),'legacy:'+str(b)): 'legacy:'+str(o) for a,b,o in base['recipes']}
for pack in prior:
 for a,b,o in pack['recipes']:existing.setdefault(key(a,b),o)
# Confirmed well-known examples, with representative *release* platform.
# No retail pack screenshots, game logos, 3rd-party character artwork.
GROUPS='''
Sega Dreamcast|Sonic the Hedgehog|platform|Sonic Adventure;Sonic Adventure 2
Sega Dreamcast|Arcade|arcade|Crazy Taxi;Crazy Taxi 2
Sega Dreamcast|Music|music|Space Channel 5;Space Channel 5: Part 2
Sega Dreamcast|Competition|fighter|Power Stone;Power Stone 2
PlayStation 2|RPG|rpg|Dark Cloud;Dark Chronicle
PlayStation 2|Arcade|shooter|TimeSplitters 2;TimeSplitters: Future Perfect
PlayStation 2|Game|platform|Ape Escape 2;Ape Escape 3
PlayStation 2|Racing|racing|Burnout 3: Takedown;Burnout Revenge
PSP|Music|music|Patapon;Patapon 2;Patapon 3
PSP|Arcade|puzzle|Lumines;Lumines II
PSP|Action|action|Syphon Filter: Dark Mirror;Syphon Filter: Logan's Shadow
PSP|RPG|rpg|Dissidia Final Fantasy;Dissidia 012 Final Fantasy
Nintendo GameCube|Pokémon Red|rpg|Pokémon Colosseum;Pokémon XD: Gale of Darkness
Nintendo Wii|Kirby’s Dream Land|platform|Kirby's Epic Yarn;Kirby's Return to Dream Land
Nintendo Wii|Mario Kart|racing|Mario Kart Wii
Nintendo DS|Strategy|strategy|Advance Wars: Dual Strike;Advance Wars: Days of Ruin
Nintendo DS|Arcade|racing|Mario Kart DS
Nintendo 3DS|RPG|rpg|Bravely Default;Bravely Second: End Layer
Nintendo 3DS|The Legend of Zelda|adventure|The Legend of Zelda: A Link Between Worlds;The Legend of Zelda: Tri Force Heroes
Nintendo Switch|Strategy|strategy|Mario + Rabbids Kingdom Battle;Mario + Rabbids Sparks of Hope
Nintendo Switch|RPG|rpg|Octopath Traveler;Octopath Traveler II
Nintendo Switch|The Legend of Zelda|adventure|The Legend of Zelda: Breath of the Wild;The Legend of Zelda: Tears of the Kingdom
Xbox|RPG|rpg|Fable;Fable: The Lost Chapters
Xbox 360|Action|action|Crackdown;Crackdown 2
Game Boy Advance|RPG|rpg|Golden Sun;Golden Sun: The Lost Age
Game Boy Advance|Strategy|strategy|Advance Wars;Advance Wars 2: Black Hole Rising
SNES|RPG|rpg|Secret of Mana;Seiken Densetsu 3
Sega Saturn|Strategy|strategy|Dragon Force;Dragon Force II
Sega Game Gear|Sonic the Hedgehog|platform|Sonic Chaos;Sonic Triple Trouble
Atari 2600|Arcade|arcade|Pitfall!;Pitfall II: Lost Caverns
'''

# Map common genre input names to existing elements; explicit if available only.
ALIASES={'RPG':['RPG','Role-Playing Game','Role Playing Game','Role-playing games'],'Adventure':['Adventure','Adventure Game'],'Action':['Action','Action Game'],'Racing':['Racing','Racing Game'],'Platformer':['Platformer','Platform Game','Platform'],'Fighting':['Fighting','Fighting Game'],'Music':['Music'],'Strategy':['Strategy'],'Arcade':['Arcade']}
def get(s):
 n=norm(s)
 if n in byname:return byname[n]
 for alt in ALIASES.get(s,[]):
  if norm(alt) in byname:return byname[norm(alt)]
 return None
new=[];pairs=[];notes=[];by_src=collections.Counter();release_specs=[]
for line in GROUPS.strip().splitlines():
 if not line.strip() or line.lstrip().startswith('#'):continue
 platform,seed,genre,names=line.strip().split('|',3)
 p_id=get(platform);root_id=get(seed)
 if not p_id or not root_id:
  notes.append({'kind':'group-skip','platform':platform,'seed':seed,'missing': [z for z,x in [('platform',p_id),('seed',root_id)] if not x]});continue
 prev=None
 for seq,title in enumerate([x.strip() for x in names.split(';') if x.strip()]):
  got=get(title)
  if not got:
   uid='gaming27:'+norm(title)
   if uid in ids:got=uid
   else:
    got=uid
  # The discovery chain must be meaningful: same franchise/sequel, or curated genre on a platform.
  # For the first title, only use a free root+platform recipe. Later titles use direct
  # predecessor+platform. Never let redundant self-recipes occupy these slots.
  a=(root_id if seq==0 else prev)
  k=key(a,p_id) if a else None
  can_create=bool(k and a!=p_id and k not in existing)
  if not get(title) and not can_create:
   notes.append({'kind':'no-safe-path','title':title,'platform':platform,'seed':seed})
   prev=None
   continue
  if not get(title):
   byname[norm(title)]=got;ids[got]=title
   new.append({'id':got,'name':title,'category':'game','summary':f'Curated gaming catalog; representative released platform: {platform}.','iconFamily':genre,'sourceTag':'v27-editorial'})
  if can_create:
   existing[k]=got;pairs.append((a,p_id,got));by_src['inbound']+=1
  prev=got
  release_specs.append((platform,seed,title,got))
# Additional non-conflicting redundant paths: an established game combined with its own franchise
# is still itself; does not invent another release or displace existing recipes.
for platform,seed,title,got in release_specs:
 root_id=get(seed)
 if root_id and root_id!=got:
  k=key(root_id,got)
  if k not in existing:
   existing[k]=got;pairs.append((root_id,got,got));by_src['redundant']+=1
# Fact-based redundancy: a known game + its recorded platform resolves to itself.
# These do not create a fake release and intentionally reuse results, as requested.
for old in prior:
 for it in old['items']:
  if it.get('category')!='game':continue
  text=it.get('summary','')
  match=re.search(r'(?:platform|featured platform|representative platform|documented platform)\s*:\s*([^.;]+)',text,re.I)
  if not match:continue
  platform_id=get(match.group(1).strip())
  if not platform_id or platform_id==it['id']:continue
  k=key(platform_id,it['id'])
  if k not in existing:
   existing[k]=it['id'];pairs.append((platform_id,it['id'],it['id']));by_src['platform_recognition']+=1
# Reachability from starters via base+prior+new, never add a locked element that has no path.
reachable={f'legacy:{i}' for i in range(4)}
allrecipes=[(a,b,o) for k,o in existing.items() for a,b in [k.split('|')]]
for _ in range(80):
 earlier=len(reachable)
 for a,b,o in allrecipes:
  if a in reachable and b in reachable:reachable.add(o)
 if len(reachable)==earlier:break
bad=[x for x in new if x['id'] not in reachable]
if bad:
 # Do not ship unreachable unknown tiles. Their recipes can be refined in a future version.
 keep={x['id'] for x in new if x['id'] in reachable}
 pairs=[(a,b,o) for a,b,o in pairs if o in keep and (a not in {x['id'] for x in bad}) and (b not in {x['id'] for x in bad})]
 new=[x for x in new if x['id'] in keep]
notes.extend({'kind':'unreachable','title':x['name']} for x in bad)
pack={'version':27,'items':new,'recipes':pairs,'source':'explicit manually curated classic platform lists; other relations treated as controlled redundancy'}
out=p/'gaming-pack-v27.js';out.write_text('export const GAMING_V27 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(root/'shared/v27-editorial-report.json').write_text(json.dumps({'new_elements':len(new),'new_recipes':len(pairs),'notes':notes,'total_elements':len(ids)-len(bad),'total_recipes':len(existing)-len(bad),'release_specs':len(release_specs)},indent=2,ensure_ascii=False),encoding='utf8')
print('new items',len(new),'recipes',len(pairs),'unreachable',len(bad),'groups skipped',sum(x['kind']=='group-skip' for x in notes),'totals',len(ids)-len(bad),len(existing)-len(bad))
print('miss',notes[:8])
