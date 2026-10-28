#!/usr/bin/env python3
"""Curated, reachable, English-only offline gaming pack for 35K Alchemy V30.
Never override a shipped pair; prefer franchise prequel + documented platform.
"""
from pathlib import Path
import json,re,unicodedata,collections
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'client/src'
def read(f):return json.loads((P/f).read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
base=read('legacy-data.js');old=[read(n) for n in ['creative-pack.js','gaming-pack-v22.js','gaming-pack-v23.js','gaming-pack-v24.js','gaming-pack-v26.js','gaming-pack-v27.js']]
ids={f'legacy:{i}':it[0] for i,it in enumerate(base['items'])}
for p in old:
 for it in p['items']:ids[it['id']]=it['name']
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',str(s).casefold()).encode('ascii','ignore').decode())
by_name={norm(name):id for id,name in ids.items()}
def get(name):return by_name.get(norm(name))
def pair(a,b):return '|'.join(sorted([a,b]))
recipes={pair(f'legacy:{a}',f'legacy:{b}'):f'legacy:{o}' for a,b,o in base['recipes']}
for p in old:
 for a,b,out in p['recipes']:recipes.setdefault(pair(a,b),out)
pre_count=len(recipes)
# The association is first a documented original or widely available release platform,
# then a coherent series sequel. Branches are represented as separate lines.
GROUPS=[
 # Mega Man Battle Network titles and exact spelling based on Capcom's official anthology.
 ('Mega Man Battle Network','Game Boy Advance','rpg', 'Mega Man Battle Network 2;Mega Man Battle Network 3 Blue;Mega Man Battle Network 3 White'),
 ('Mega Man Battle Network 3 Blue','Game Boy Advance','rpg','Mega Man Battle Network 4 Red Sun;Mega Man Battle Network 4 Blue Moon'),
 ('Mega Man Battle Network 4 Red Sun','Game Boy Advance','rpg','Mega Man Battle Network 5 Team Protoman;Mega Man Battle Network 5 Team Colonel'),
 ('Mega Man Battle Network 5 Team Protoman','Game Boy Advance','rpg','Mega Man Battle Network 6 Cybeast Gregar;Mega Man Battle Network 6 Cybeast Falzar'),
 ('Mega Man Battle Network 6 Cybeast Gregar','Nintendo Switch','rpg','Mega Man Battle Network Legacy Collection'),
 ('Mega Man Zero','Game Boy Advance','action','Mega Man Zero 2;Mega Man Zero 3;Mega Man Zero 4'),
 ('Mega Man ZX','Nintendo DS','action','Mega Man ZX Advent'),
 ('Castlevania','Game Boy Advance','adventure','Castlevania: Circle of the Moon;Castlevania: Harmony of Dissonance;Castlevania: Aria of Sorrow'),
 ('Castlevania: Aria of Sorrow','Nintendo DS','adventure','Castlevania: Dawn of Sorrow;Castlevania: Portrait of Ruin;Castlevania: Order of Ecclesia'),
 ('Metroid','Game Boy Advance','action','Metroid: Zero Mission'),
 ('Metroid Prime','Nintendo GameCube','adventure','Metroid Prime 2: Echoes'),
 ('Metroid Prime 2: Echoes','Nintendo DS','action','Metroid Prime Hunters'),
 ('Metroid Prime Hunters','Nintendo DS','puzzle','Metroid Prime Pinball'),
 ('Metroid Prime 2: Echoes','Nintendo Switch','adventure','Metroid Prime Remastered'),
 ('Metroid: Zero Mission','Nintendo Switch','action','Metroid Dread'),
 ('The Legend of Zelda','Nintendo GameCube','adventure','The Legend of Zelda: Four Swords Adventures'),
 ('The Legend of Zelda: A Link Between Worlds','Nintendo 3DS','adventure','The Legend of Zelda: Tri Force Heroes'),
 ('The Legend of Zelda: Tears of the Kingdom','Nintendo Switch','adventure','The Legend of Zelda: Echoes of Wisdom'),
 ('Golden Sun','Nintendo DS','rpg','Golden Sun: Dark Dawn'),
 ('Professor Layton','Nintendo DS','puzzle','Professor Layton and the Curious Village;Professor Layton and the Diabolical Box;Professor Layton and the Unwound Future'),
 ('Professor Layton and the Unwound Future','Nintendo 3DS','puzzle','Professor Layton and the Miracle Mask;Professor Layton and the Azran Legacy'),
 ('Phoenix Wright: Ace Attorney','Nintendo DS','adventure','Phoenix Wright: Ace Attorney - Justice for All;Phoenix Wright: Ace Attorney - Trials and Tribulations'),
 ('Phoenix Wright: Ace Attorney - Trials and Tribulations','Nintendo DS','adventure','Apollo Justice: Ace Attorney;Ace Attorney Investigations: Miles Edgeworth'),
 ('Fire Emblem','Game Boy Advance','strategy','Fire Emblem: The Sacred Stones'),
 ('Fire Emblem: Awakening','Nintendo 3DS','strategy','Fire Emblem Fates;Fire Emblem Echoes: Shadows of Valentia'),
 ('Fire Emblem Fates','Nintendo Switch','strategy','Fire Emblem Engage'),
 ('Mario Kart','Nintendo DS','racing','Mario Kart DS'),
 ('Mario Kart DS','Nintendo 3DS','racing','Mario Kart 7'),
 ('Mario Kart 7','Nintendo Switch','racing','Mario Kart 8 Deluxe'),
 ('Paper Mario','Nintendo GameCube','rpg','Paper Mario: The Thousand-Year Door'),
 ('Paper Mario: The Thousand-Year Door','Nintendo Wii','rpg','Super Paper Mario'),
 ('Paper Mario: The Thousand-Year Door','Nintendo Switch','rpg','Paper Mario: The Origami King'),
 ('Kirby’s Dream Land','Game Boy Advance','platform','Kirby: Nightmare in Dream Land;Kirby & the Amazing Mirror'),
 ('Kirby & the Amazing Mirror','Nintendo DS','platform','Kirby: Squeak Squad;Kirby: Canvas Curse'),
 ('Kirby: Squeak Squad','Nintendo 3DS','platform','Kirby: Planet Robobot'),
 ('Sonic the Hedgehog','Sega Genesis','platform','Sonic the Hedgehog 3;Sonic & Knuckles'),
 ('Sonic Adventure 2','Nintendo GameCube','platform','Sonic Adventure 2: Battle'),
 ('Sonic Mania','Nintendo Switch','platform','Sonic Origins;Sonic Superstars'),
 ('Sonic Frontiers','Nintendo Switch','platform','Sonic X Shadow Generations'),
 ('Resident Evil','PlayStation 2','horror','Resident Evil Outbreak;Resident Evil Outbreak File #2'),
 ('Resident Evil 4','Nintendo Wii','horror','Resident Evil: The Umbrella Chronicles'),
 ('Resident Evil: The Umbrella Chronicles','Nintendo Wii','horror','Resident Evil: The Darkside Chronicles'),
 ('Final Fantasy','PlayStation 2','rpg','Final Fantasy X-2;Final Fantasy XII'),
 ('Final Fantasy XII','PlayStation 4','rpg','Final Fantasy XII: The Zodiac Age'),
 ('Dragon Quest','Nintendo DS','rpg','Dragon Quest IX: Sentinels of the Starry Skies'),
 ('Chrono Trigger','Nintendo DS','rpg','Chrono Trigger DS'),
 ('Super Mario Bros.','Nintendo DS','platform','New Super Mario Bros.'),
 ('New Super Mario Bros.','Nintendo Switch','platform','New Super Mario Bros. U Deluxe'),
 ('New Super Mario Bros. U Deluxe','Nintendo Switch','platform','Super Mario Bros. Wonder'),
 ('Advance Wars','Nintendo Switch','strategy','Advance Wars 1+2: Re-Boot Camp'),
 ('Shovel Knight','Nintendo Switch','platform','Shovel Knight: Treasure Trove'),

 ('Crazy Taxi','Sega Dreamcast','arcade','Crazy Taxi 2;The Typing of the Dead'),
 ('Sonic Adventure','Sega Dreamcast','platform','Sonic Shuffle'),
 ('Shenmue','Sega Dreamcast','adventure','Shenmue II'),
 ('Phantasy Star','Sega Dreamcast','rpg','Phantasy Star Online;Phantasy Star Online Ver. 2'),
 ('Ecco the Dolphin','Sega Dreamcast','adventure','Ecco the Dolphin: Defender of the Future'),
 ('Mega Man Battle Network','Nintendo GameCube','action','Mega Man Network Transmission'),
 ('Mega Man Battle Network','Game Boy Advance','rpg','Mega Man Battle Chip Challenge'),
 ('Mega Man X','Nintendo DS','rpg','Mega Man Star Force: Dragon;Mega Man Star Force 2: Zerker x Ninja;Mega Man Star Force 3: Black Ace'),
 ('Wario Land 4','Game Boy Advance','arcade','WarioWare, Inc.: Mega Microgame$!;WarioWare: Twisted!'),
 ('WarioWare, Inc.: Mega Microgame$!','Nintendo DS','arcade','WarioWare: Touched!;WarioWare: D.I.Y.'),
 ('WarioWare: Touched!','Nintendo Wii','arcade','WarioWare: Smooth Moves'),
 ('WarioWare: D.I.Y.','Nintendo 3DS','arcade','WarioWare Gold'),
 ('WarioWare Gold','Nintendo Switch','arcade','WarioWare: Get It Together!;WarioWare: Move It!'),
 ('Boktai: The Sun Is in Your Hand','Game Boy Advance','action','Boktai 2: Solar Boy Django'),
 ('Metroid Prime','Nintendo DS','action','Metroid Prime Hunters;Metroid Prime Pinball'),
 ('F-Zero','Nintendo GameCube','racing','F-Zero GX'),
 ('Star Fox','Nintendo GameCube','shooter','Star Fox Adventures;Star Fox Assault'),
 ('Kirby & the Amazing Mirror','Nintendo DS','platform','Kirby: Mass Attack;Kirby: Canvas Curse'),
 ('Pokémon','Nintendo GameCube','rpg','Pokémon Channel;Pokémon Colosseum;Pokémon XD: Gale of Darkness'),
 ('Animal Crossing','Nintendo GameCube','simulation','Animal Crossing'),
 ('Animal Crossing','Nintendo DS','simulation','Animal Crossing: Wild World'),
 ('Animal Crossing: Wild World','Nintendo 3DS','simulation','Animal Crossing: New Leaf'),
 ('Animal Crossing: New Leaf','Nintendo Switch','simulation','Animal Crossing: New Horizons'),
 ('LocoRoco','PSP','platform','LocoRoco 2;LocoRoco Midnight Carnival'),
 ('Patapon','PSP','rhythm','Patapon 2;Patapon 3'),
 ('Pursuit Force','PSP','action','Pursuit Force: Extreme Justice'),
 ('Ratchet & Clank','PlayStation 2','platform','Ratchet: Deadlocked'),
 ('Jak and Daxter','PlayStation 2','racing','Jak X: Combat Racing'),
 ('Shining Force','Sega Saturn','strategy','Shining Force III;Shining the Holy Ark'),
 ('Panzer Dragoon','Sega Saturn','shooter','Panzer Dragoon Zwei;Panzer Dragoon Saga'),
 ('NiGHTS into Dreams','Sega Saturn','platform','Christmas NiGHTS into Dreams'),
 ('Resident Evil 4','PlayStation 2','horror','Resident Evil Outbreak;Resident Evil Outbreak File #2'),
 ('Silent Hill','PlayStation 2','horror','Silent Hill: Origins;Silent Hill: Shattered Memories'),
 ('Final Fantasy','PlayStation 2','rpg','Dirge of Cerberus: Final Fantasy VII'),
 ('Dragon Quest','PlayStation 2','rpg','Dragon Quest VIII: Journey of the Cursed King'),
 ('Tales of Symphonia','Nintendo GameCube','rpg','Tales of Symphonia'),
 ('The Legend of Zelda','Game Boy Advance','adventure','The Legend of Zelda: The Minish Cap'),
 ('Castlevania','Nintendo DS','adventure','Castlevania: Order of Ecclesia'),
 ('Golden Sun','Nintendo DS','rpg','Golden Sun: Dark Dawn'),
 ('Hollow Knight','Nintendo Switch','platform','Hollow Knight: Silksong'),
 ('Shovel Knight','Nintendo Switch','platform','Shovel Knight: Treasure Trove;Shovel Knight Dig'),
 ('Fire Emblem','Nintendo Switch','strategy','Fire Emblem Warriors: Three Hopes'),
 ('Mario Kart','Nintendo Switch','racing','Mario Kart 8 Deluxe'),
 ('Tetris','Nintendo Switch','puzzle','Tetris 99;Tetris Effect: Connected'),
 ('Sonic the Hedgehog','Nintendo Switch','platform','Sonic Colors: Ultimate;Sonic Origins'),
 ('Resident Evil 4','PlayStation 4','horror','Resident Evil 7: Biohazard;Resident Evil Village'),
 ('Metal Gear Solid','PSP','stealth','Metal Gear Acid;Metal Gear Acid 2'),
 ('The Sims','PC','simulation','The Sims 2;The Sims 3;The Sims 4'),

 ('Syphon Filter','PlayStation 2','action','Syphon Filter: The Omega Strain'),
 ('Killzone','PSP','shooter','Killzone: Liberation'),
 ('Resistance: Fall of Man','PSP','shooter','Resistance: Retribution'),
 ('Jak II','PSP','platform','Jak and Daxter: The Lost Frontier'),
 ('Ratchet & Clank','PSP','platform','Ratchet & Clank: Size Matters;Secret Agent Clank'),
 ('Ape Escape','PSP','platform','Ape Escape: On the Loose'),
 ('Sonic the Hedgehog','Nintendo DS','platform','Sonic Rush;Sonic Rush Adventure'),
 ('Mario vs. Donkey Kong','Nintendo DS','puzzle','Mario vs. Donkey Kong 2: March of the Minis;Mario vs. Donkey Kong: Mini-Land Mayhem!'),
 ('Final Fantasy Tactics','PSP','rpg','Final Fantasy Tactics: The War of the Lions'),
 ('Castlevania','PSP','platform','Castlevania: The Dracula X Chronicles'),
 ('Crash Bandicoot','PSP','platform','Crash of the Titans'),
 ('Spyro','Nintendo DS','adventure','The Legend of Spyro: A New Beginning;The Legend of Spyro: The Eternal Night'),
 ('Dragon Ball Z: Budokai 3','PSP','fighter','Dragon Ball Z: Shin Budokai;Dragon Ball Z: Shin Budokai - Another Road'),
 ('Sonic the Hedgehog','Xbox 360','platform','Sonic Unleashed;Sonic Generations'),
 ('Ecco the Dolphin','Sega Genesis','adventure','Ecco: The Tides of Time'),
 ('Shining Force','Game Boy Advance','strategy','Shining Force: Resurrection of the Dark Dragon'),
 ('Harvest Moon','Nintendo DS','simulation','Harvest Moon DS;Harvest Moon DS Cute'),
 ('Harvest Moon DS','Nintendo Wii','simulation','Harvest Moon: Tree of Tranquility;Harvest Moon: Animal Parade'),
 ('Rune Factory','Nintendo DS','rpg','Rune Factory: A Fantasy Harvest Moon;Rune Factory 2: A Fantasy Harvest Moon;Rune Factory 3: A Fantasy Harvest Moon'),
 ('Mario Party','Nintendo DS','board','Mario Party DS'),
 ('Mario Party','Nintendo Wii','board','Mario Party 8;Mario Party 9'),
 ('Mario Party','Nintendo Switch','board','Super Mario Party;Mario Party Superstars;Super Mario Party Jamboree'),
]
# Most games are previously discovered by franchise/platform rather than invented modifiers.
added=[];created=[];skip=[];by_group=collections.Counter()
for seed,platform,genre,names in GROUPS:
 platform_id=get(platform);seed_id=get(seed)
 if not platform_id or not seed_id:
  skip.append({'seed':seed,'platform':platform,'reason':'missing anchor'});continue
 prev=seed_id
 for title in [x.strip() for x in names.split(';')]:
  identity=get(title)
  if identity:
   prev=identity
   continue
  uid='gaming30:'+norm(title)
  # Safe pair priority: the immediately prior release (or parent franchise) + documented platform.
  alternatives=[(prev,platform_id),(seed_id,platform_id)]
  # A second route via prequel plus the broad franchise is used only for same-series titles.
  if prev!=seed_id:alternatives.append((prev,seed_id))
  viable=next(((a,b) for a,b in alternatives if a and b and a!=b and pair(a,b) not in recipes),None)
  if viable is None:
   skip.append({'title':title,'platform':platform,'reason':'occupied semantic paths'});prev=seed_id;continue
  a,b=viable
  summary=f'Curated released video game; documented platform: {platform}.'
  new={'id':uid,'name':title,'category':'game','summary':summary,'iconFamily':genre,'sourceTag':'v30-curated'}
  added.append(new);ids[uid]=title;by_name[norm(title)]=uid;recipes[pair(a,b)]=uid;created.append([a,b,uid]);prev=uid;by_group[seed]+=1
  # Reinforce the platform as a safe recognition route if not the creation pair.
  for x,y in ((uid,platform_id),(uid,seed_id)):
   if x!=y and pair(x,y) not in recipes:
    recipes[pair(x,y)]=uid;created.append([x,y,uid])
# Prevent new elements that have no valid journey from the four original elements.
reachable={f'legacy:{i}' for i in range(4)}
for k in range(80):
 n=len(reachable)
 for comb,out in recipes.items():
  a,b=comb.split('|')
  if a in reachable and b in reachable:reachable.add(out)
 if len(reachable)==n:break
unreachable=[e for e in added if e['id'] not in reachable]
if unreachable:
 bad={e['id'] for e in unreachable};added=[x for x in added if x['id'] not in bad];created=[x for x in created if not any(y in bad for y in x)];skip.extend({'title':x['name'],'reason':'unreachable'} for x in unreachable)
print('items',len(added),'recipes',len(created),'skipped',len(skip),'prior',pre_count,'total',pre_count+len(created))
print('skipped',skip[:18])
assert len({x['id'] for x in added})==len(added)
for a,b,o in created:assert o in ids and a in ids and b in ids
pack={'version':30,'items':added,'recipes':created,'source':'editorially selected real released games, verified anchor platforms; never replaces an existing pair'}
(P/'gaming-pack-v30.js').write_text('export const GAMING_V30 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(ROOT/'shared/v30-content-audit.json').write_text(json.dumps({'new_elements':len(added),'new_recipes':len(created),'skipped':skip,'by_franchise':by_group,'total_elements':len(ids),'total_recipes':pre_count+len(created)},indent=2,ensure_ascii=False),encoding='utf8')
