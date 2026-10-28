#!/usr/bin/env python3
"""35K Alchemy V24: safe rebrand, offline crossovers, incremental curated release catalog.
Maintains all historic IDs and pair precedences; 35k is a future target, not a falsified count.
"""
from pathlib import Path
import json,re,unicodedata,collections,shutil,subprocess,zipfile
SRC=Path('/mnt/data/Gameverse_Infinite_V23_Project'); ROOT=Path('/mnt/data'); DST=ROOT/'35K_Alchemy_V24_Project'
if DST.exists(): shutil.rmtree(DST)
shutil.copytree(SRC,DST,ignore=shutil.ignore_patterns('*.png','Gameverse_Infinite_V*_Offline.html','catalog-v*-report.json','node_modules','__pycache__'))
p=DST/'client/src'
def get(name):return json.loads((p/name).read_text().split(' = ',1)[1].rstrip(' ;\n'))
D=get('legacy-data.js');PACK=get('creative-pack.js');V22=get('gaming-pack-v22.js');V23=get('gaming-pack-v23.js')
normalize=lambda s:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',str(s).lower().replace('’',"'")).encode('ascii','ignore').decode())
items={f'legacy:{i}':{'id':f'legacy:{i}','name':r[0],'category':r[1]} for i,r in enumerate(D['items'])}
for it in PACK['items']+V22['items']+V23['items']:items[it['id']]=it
byname={normalize(it['name']):id for id,it in items.items()}
def lookup(v):return byname.get(normalize(v))
key=lambda a,b:'|'.join(sorted([a,b]))
existing={key(f'legacy:{a}',f'legacy:{b}'):f'legacy:{c}' for a,b,c in D['recipes']}
for a,b,c in PACK['recipes']+V22['recipes']+V23['recipes']: existing.setdefault(key(a,b),c)
added=[]; recipes=[];stats=collections.Counter(); rejected=[];source_records=[]
icons={'racing':'racer','sports':'soccer','music':'rhythm','puzzle':'puzzle','horror':'specter','stealth':'stealth','scifi':'starship','strategy':'strategy','action':'action','fighter':'fighter','rpg':'fantasy','adventure':'fantasy','platform':'platformer','game':'game_case'}
GENRE={'racing':'Racing Game','sports':'Sports Game','music':'Music','puzzle':'Puzzle','horror':'Terror','stealth':'Stealth','scifi':'Science Fiction','strategy':'Strategy','action':'Action','fighter':'Fighting Game','rpg':'RPG','adventure':'Adventure','platform':'Platform Game','game':'Video Game'}
# Avoid grossly misrepresenting game titles via one-word adjective modifiers.
# Groups: platform|known existing franchise anchor (or explicit known prior title)|genre|titles ordered by series progression.
GROUPS=r'''
Nintendo Switch 2|Mario Kart|racing|Mario Kart World
Nintendo Switch 2|Donkey Kong|adventure|Donkey Kong Bananza
Nintendo Switch 2|Kirby|racing|Kirby Air Riders
Nintendo Switch 2|Mario Tennis|sports|Mario Tennis Fever
Nintendo Switch 2|Pokémon|game|Pokémon Pokopia
Nintendo Switch 2|Hyrule Warriors|action|Hyrule Warriors: Age of Imprisonment
Nintendo Switch 2|Nintendo|game|Nintendo Switch 2 Welcome Tour
Nintendo Switch|Mario|platform|Super Mario Maker 2;Super Mario Bros. Wonder
Nintendo Switch|Paper Mario|rpg|Paper Mario: The Origami King;Paper Mario: The Thousand-Year Door (Switch)
Nintendo Switch|Splatoon|action|Splatoon 3
Nintendo Switch|Metroid|action|Metroid Dread
Nintendo Switch|Zelda|adventure|The Legend of Zelda: Skyward Sword HD
Nintendo Switch|Fire Emblem|strategy|Fire Emblem: Three Houses;Fire Emblem Warriors: Three Hopes
Nintendo Switch|Animal Crossing|game|Animal Crossing: New Horizons
Nintendo Switch|Xenoblade|rpg|Xenoblade Chronicles 2;Xenoblade Chronicles 3
Nintendo Switch|Luigi|adventure|Luigi's Mansion 3
Nintendo Switch|Pikmin|strategy|Pikmin 3 Deluxe
Nintendo Switch|Nintendo|game|Ring Fit Adventure;Nintendo Labo Variety Kit;Nintendo Labo Robot Kit
Nintendo 3DS|Mario|platform|Super Mario 3D Land;New Super Mario Bros. 2
Nintendo 3DS|Zelda|adventure|The Legend of Zelda: A Link Between Worlds;The Legend of Zelda: Tri Force Heroes
Nintendo 3DS|Monster Hunter|action|Monster Hunter 4 Ultimate;Monster Hunter Generations
Nintendo 3DS|Pokémon|rpg|Pokémon X;Pokémon Y;Pokémon Omega Ruby;Pokémon Alpha Sapphire
Nintendo 3DS|Professor Layton|puzzle|Professor Layton and the Miracle Mask;Professor Layton and the Azran Legacy
Nintendo 3DS|Animal Crossing|game|Animal Crossing: New Leaf
Nintendo 3DS|Fire Emblem|strategy|Fire Emblem Awakening;Fire Emblem Fates
Nintendo 3DS|Kid Icarus|action|Kid Icarus: Uprising
Nintendo DS|Mario|racing|Mario Kart DS
Nintendo DS|Pokémon|rpg|Pokémon Black;Pokémon White;Pokémon Black 2;Pokémon White 2
Nintendo DS|Zelda|adventure|The Legend of Zelda: Phantom Hourglass;The Legend of Zelda: Spirit Tracks
Nintendo DS|Mario|rpg|Mario & Luigi: Bowser's Inside Story
Nintendo DS|Phoenix Wright|adventure|Phoenix Wright: Ace Attorney - Justice for All;Phoenix Wright: Ace Attorney - Trials and Tribulations
Nintendo DS|Nintendo|music|Elite Beat Agents
Nintendo DS|Nintendo|puzzle|Ghost Trick: Phantom Detective
Game Boy Advance|Metroid|action|Metroid: Zero Mission
Game Boy Advance|Mario|rpg|Mario & Luigi: Superstar Saga
Game Boy Advance|Castlevania|action|Castlevania: Circle of the Moon;Castlevania: Harmony of Dissonance;Castlevania: Aria of Sorrow
Game Boy Advance|Advance Wars|strategy|Advance Wars 2: Black Hole Rising
Game Boy Advance|Fire Emblem|strategy|Fire Emblem: The Sacred Stones
Nintendo Wii|Mario|platform|New Super Mario Bros. Wii;Super Mario Galaxy 2
Nintendo Wii|Zelda|adventure|The Legend of Zelda: Twilight Princess;The Legend of Zelda: Skyward Sword
Nintendo Wii|Metroid|action|Metroid Prime 3: Corruption;Metroid: Other M
Nintendo Wii|Kirby|platform|Kirby's Epic Yarn;Kirby's Return to Dream Land
Nintendo Wii|Nintendo|game|Wii Fit;Wii Fit Plus;Wii Party;Wii Play
Nintendo Wii U|Mario|platform|Super Mario 3D World;New Super Mario Bros. U
Nintendo Wii U|Zelda|action|Hyrule Warriors
Nintendo Wii U|Splatoon|action|Splatoon
Nintendo Wii U|Nintendo|game|Nintendo Land;Game & Wario
Nintendo GameCube|Zelda|adventure|The Legend of Zelda: The Wind Waker;The Legend of Zelda: Four Swords Adventures
Nintendo GameCube|Mario|platform|Super Mario Sunshine
Nintendo GameCube|Metroid|action|Metroid Prime 2: Echoes
Nintendo GameCube|Paper Mario|rpg|Paper Mario: The Thousand-Year Door
Nintendo GameCube|Fire Emblem|strategy|Fire Emblem: Path of Radiance
Nintendo GameCube|Pikmin|strategy|Pikmin 2
Nintendo GameCube|Luigi|adventure|Luigi's Mansion
Nintendo 64|Zelda|adventure|The Legend of Zelda: Majora's Mask
Nintendo 64|Mario|game|Mario Party 2;Mario Party 3
Nintendo 64|Nintendo|action|GoldenEye 007;Perfect Dark
Nintendo 64|Nintendo|racing|Wave Race 64;F-Zero X;Diddy Kong Racing
SNES|Metroid|action|Super Metroid
SNES|Kirby|platform|Kirby's Dream Course;Kirby's Dream Land 3
SNES|Nintendo|rpg|Secret of Mana;Secret of Evermore;EarthBound
SNES|Nintendo|action|Super Castlevania IV;Contra III: The Alien Wars
NES|Nintendo|action|Balloon Fight;Excitebike;Ice Climber;Kid Icarus;Duck Hunt
NES|Ninja Gaiden|action|Ninja Gaiden II: The Dark Sword of Chaos;Ninja Gaiden III: The Ancient Ship of Doom
Game Boy|Kirby|platform|Kirby's Dream Land 2
Game Boy|Mario|platform|Super Mario Land 2: 6 Golden Coins
Game Boy Color|Zelda|adventure|The Legend of Zelda: Oracle of Ages;The Legend of Zelda: Oracle of Seasons
Sega Genesis|Sonic|platform|Sonic the Hedgehog 2;Sonic the Hedgehog 3;Sonic & Knuckles
Sega Genesis|Sega|action|Shinobi III: Return of the Ninja Master;Golden Axe II;Streets of Rage 2
Sega Genesis|Sega|platform|Ristar;Dynamite Headdy;Earthworm Jim
Sega Saturn|Sega|adventure|NiGHTS into Dreams...;Burning Rangers
Sega Saturn|Sega|fighter|Virtua Fighter 2;Fighters Megamix
Sega Dreamcast|Sega|adventure|Shenmue;Skies of Arcadia;Grandia II
Sega Dreamcast|Sega|action|Jet Set Radio;ChuChu Rocket!
Sega Dreamcast|Sega|music|Space Channel 5;Rez
Sega Dreamcast|Sega|fighter|Soulcalibur;Power Stone;Power Stone 2
PlayStation|Sony|rpg|Legend of Legaia;Vagrant Story;Suikoden II;Wild Arms
PlayStation|Sony|action|Ape Escape;MediEvil;Syphon Filter;Tomba!
PlayStation|Final Fantasy|rpg|Final Fantasy VIII;Final Fantasy IX
PlayStation|Metal Gear Solid|stealth|Metal Gear Solid
PlayStation|Spyro|platform|Spyro 2: Ripto's Rage!;Spyro: Year of the Dragon
PlayStation|Crash Bandicoot|platform|Crash Bandicoot 2: Cortex Strikes Back;Crash Bandicoot: Warped
PlayStation 2|Sly Cooper|stealth|Sly 3: Honor Among Thieves
PlayStation 2|Jak and Daxter|platform|Jak II;Jak 3;Jak X: Combat Racing
PlayStation 2|Ratchet & Clank|action|Ratchet: Deadlocked;Ratchet & Clank: Up Your Arsenal
PlayStation 2|Silent Hill|horror|Silent Hill 2;Silent Hill 3;Silent Hill 4: The Room
PlayStation 2|Burnout|racing|Burnout 3: Takedown;Burnout Revenge
PlayStation 2|Need for Speed|racing|Need for Speed: Underground;Need for Speed: Underground 2;Need for Speed: Most Wanted (2005)
PlayStation 2|Kingdom Hearts|rpg|Kingdom Hearts II;Kingdom Hearts: Re:Chain of Memories
PlayStation 2|Dragon Ball|fighter|Dragon Ball Z: Budokai Tenkaichi;Dragon Ball Z: Budokai Tenkaichi 2;Dragon Ball Z: Budokai Tenkaichi 3
PlayStation 2|God of War|action|God of War II
PlayStation 2|Sony|action|God Hand;Ōkami;Shadow of the Colossus
PlayStation 3|Uncharted|adventure|Uncharted 2: Among Thieves;Uncharted 3: Drake's Deception
PlayStation 3|LittleBigPlanet|platform|LittleBigPlanet 2;LittleBigPlanet Karting
PlayStation 3|inFAMOUS|action|inFAMOUS 2
PlayStation 3|Resistance|action|Resistance 2;Resistance 3
PlayStation 3|Killzone|action|Killzone 2;Killzone 3
PlayStation 3|Sony|adventure|Heavy Rain;Journey;The Unfinished Swan
PlayStation 3|Sony|racing|MotorStorm;MotorStorm: Pacific Rift
PlayStation 3|Sony|rpg|Demon's Souls;Ni no Kuni: Wrath of the White Witch
PlayStation 4|Uncharted|adventure|Uncharted 4: A Thief's End;Uncharted: The Lost Legacy
PlayStation 4|Sony|adventure|The Last Guardian;Until Dawn;Detroit: Become Human
PlayStation 4|Sony|action|Bloodborne;Days Gone;Ghost of Tsushima
PlayStation 4|Horizon|action|Horizon Forbidden West
PlayStation 4|Spider-Man|action|Marvel's Spider-Man;Marvel's Spider-Man: Miles Morales
PlayStation 4|The Last of Us|action|The Last of Us Part II
PlayStation 5|Sony|platform|Astro Bot;Astro's Playroom
PlayStation 5|Sony|action|Returnal;Stellar Blade;Rise of the Ronin
PlayStation 5|Final Fantasy|rpg|Final Fantasy XVI;Final Fantasy VII Rebirth
PlayStation 5|Ratchet & Clank|action|Ratchet & Clank: Rift Apart
PSP|God of War|action|God of War: Chains of Olympus;God of War: Ghost of Sparta
PSP|Metal Gear Solid|stealth|Metal Gear Solid: Peace Walker;Metal Gear Acid;Metal Gear Acid 2
PSP|Sony|music|Patapon;Patapon 2;LocoRoco;LocoRoco 2
PSP|Final Fantasy|rpg|Crisis Core: Final Fantasy VII;Dissidia Final Fantasy
PS Vita|Persona|rpg|Persona 4 Golden
PS Vita|Sony|adventure|Gravity Rush;Tearaway;Uncharted: Golden Abyss
PS Vita|Sony|action|Killzone: Mercenary;Freedom Wars
Xbox|Halo|scifi|Halo 2
Xbox|Xbox|action|Ninja Gaiden Black;Jade Empire;MechAssault
Xbox|Xbox|racing|Project Gotham Racing;Project Gotham Racing 2
Xbox 360|Halo|scifi|Halo 3;Halo 3: ODST;Halo: Reach;Halo 4
Xbox 360|Gears of War|action|Gears of War 2;Gears of War 3;Gears of War: Judgment
Xbox 360|Fable|rpg|Fable II;Fable III
Xbox 360|Xbox|rpg|Lost Odyssey;Blue Dragon
Xbox 360|Xbox|racing|Forza Horizon;Forza Motorsport 4
Xbox One|Halo|scifi|Halo 5: Guardians;Halo Wars 2
Xbox One|Xbox|action|Quantum Break;Sunset Overdrive
Xbox One|Forza Horizon|racing|Forza Horizon 3;Forza Horizon 4
Xbox Series X|Xbox|music|Hi-Fi Rush
Xbox Series X|Forza Horizon|racing|Forza Horizon 5
PC gaming|Baldur's Gate|rpg|Baldur's Gate II: Shadows of Amn;Baldur's Gate 3
PC gaming|Diablo|rpg|Diablo II;Diablo III;Diablo IV
PC gaming|Half-Life|scifi|Half-Life 2;Half-Life: Alyx
PC gaming|Portal|puzzle|Portal 2
PC gaming|Age of Empires|strategy|Age of Empires II: The Age of Kings;Age of Empires III;Age of Empires IV
PC gaming|Civilization|strategy|Sid Meier's Civilization IV;Sid Meier's Civilization V;Sid Meier's Civilization VI
PC gaming|The Sims|game|The Sims 2;The Sims 3;The Sims 4
PC gaming|Counter-Strike|action|Counter-Strike: Source;Counter-Strike: Global Offensive;Counter-Strike 2
PC gaming|The Witcher|rpg|The Witcher 2: Assassins of Kings;The Witcher 3: Wild Hunt
PC gaming|DOOM|action|DOOM II;DOOM 3;DOOM Eternal
PC gaming|Resident Evil|horror|Resident Evil 7: Biohazard;Resident Evil Village
PC gaming|Minecraft|game|Minecraft Dungeons;Minecraft Legends
PC gaming|Hollow Knight|platform|Hollow Knight: Silksong
'''
# New platform anchor: a real console (Nintendo's release reference is recorded in editorial docs).
newConsole='Nintendo Switch 2'
if not lookup(newConsole):
    pid='gaming24:nintendoswitch2';it={'id':pid,'name':newConsole,'category':'console','summary':'Nintendo console, launched in June 2025.','iconFamily':'console','paletteVariant':'cool','v19Art':'console','sourceTag':'v24-curation'}
    items[pid]=it;byname[normalize(newConsole)]=pid;added.append(it)

REPR_ANCHOR={'Mario':'Super Mario Bros.','Kirby':'Kirby’s Dream Land','Zelda':'The Legend of Zelda','Sonic':'Sonic the Hedgehog','God of War':'God of War','Pokémon':'Pokémon','Mario Tennis':'Mario Tennis','Paper Mario':'Paper Mario','Animal Crossing':'Animal Crossing','Metroid':'Metroid','Donkey Kong':'Donkey Kong Country','Dragon Ball':'Dragon Ball','Ratchet & Clank':'Ratchet & Clank','Final Fantasy':'Final Fantasy','Spider-Man':'Spider-Man','The Last of Us':'The Last of Us','Sony':'PlayStation','Sega':'Sega','Nintendo':'Nintendo','Persona':'Persona 4','Mortal Kombat':'Mortal Kombat','Castlevania':'Castlevania','Fire Emblem':'Fire Emblem','Halo':'Halo: Combat Evolved','Need for Speed':'Need for Speed','Civilization':'Sid Meier’s Civilization','Hyrule Warriors':'Hyrule Warriors: Age of Calamity','Mario Kart':'Mario Kart','Luigi':'Luigi','Ninja Gaiden':'Ninja Gaiden','The Witcher':'The Witcher','DOOM':'DOOM','Splatoon':'Splatoon','Spyro':'Spyro the Dragon','Crash Bandicoot':'Crash Bandicoot','Burnout':'Burnout','Advance Wars':'Advance Wars','Phoenix Wright':'Phoenix Wright: Ace Attorney'}

def recipe(a,b,out,label='other'):
    aa= a if a in items else lookup(a)
    bb= b if b in items else lookup(b)
    oo= out if out in items else lookup(out)
    if not (aa and bb and oo):return False
    pair=key(aa,bb)
    if pair in existing:return False
    existing[pair]=oo;recipes.append([aa,bb,oo]);stats[label]+=1
    return True

def add_item(name,platform,series,genre):
    found=lookup(name)
    if found:return found,False
    id='gaming24:'+normalize(name)
    if id in items:return id,False
    it={'id':id,'name':name,'category':'game','summary':f'Known released videogame; representative platform: {platform}. Franchise/theme: {series}.','iconFamily':genre,'paletteVariant':'cool' if genre in ('scifi','puzzle','strategy') else 'warm' if genre in ('racing','action','fighter') else 'emerald','v19Art':icons.get(genre,'game_case'),'sourceTag':'v24-curation'}
    items[id]=it;byname[normalize(name)]=id;added.append(it)
    return id,True

# Console seed: Nintendo Switch + Sequel is the most explicit route if unused, otherwise version of an existing console.
console_id=lookup(newConsole)
if console_id:
    assert recipe('Nintendo Switch','Sequel',console_id,'console-seed') or recipe('Nintendo Switch','Hybrid',console_id,'console-seed') or any(c==console_id for c in existing.values()),'Switch 2 has no route'

series_last={};skipped=[]
for row in GROUPS.splitlines():
 row=row.strip()
 if not row:continue
 platform,series,genre,names=row.split('|',3)
 p_id=lookup(platform)
 if not p_id:skipped.append({'row':row,'reason':'Unknown platform'});continue
 anchor_name=REPR_ANCHOR.get(series,series)
 anchor_id=lookup(anchor_name)
 if not anchor_id:
  possibles=[id for id,o in items.items() if normalize(o['name']).startswith(normalize(series))]
  anchor_id=possibles[0] if possibles else None
 if not anchor_id:skipped.append({'row':row,'reason':'Unknown franchise/anchor'});continue
 for name in names.split(';'):
  name=name.strip();id,created=add_item(name,platform,series,genre)
  stats['candidates']+=1
  if not created:
   # An established item may still get new genuine crossovers without a duplicate.
   recipe(id,p_id,id,'platform-identity')
   continue
  seed=False
  # Generic publishers are NOT franchises: avoid Sony + PS2 = unrelated game.
  is_generic=series in ('Nintendo','Sony','Sega','Xbox')
  if is_generic:
   seed=False
  else:
   seed=recipe(anchor_id,p_id,id,'franchise-platform')
  prev=None if is_generic else series_last.get((platform,series))
  if not seed and not prev and series not in ('Nintendo','Sony','Sega','Xbox'):
   # A known original franchise/platform recipe is a legitimate predecessor for an actual sequel.
   base_id=existing.get(key(anchor_id,p_id))
   if base_id and base_id!=id:
    prev_name=items[base_id]['name'].lower()
    root=series.lower().replace('zelda','the legend of zelda')
    if (prev_name.startswith(root) or (series=='Kirby' and 'kirby' in prev_name) or (series=='Zelda' and 'zelda' in prev_name)):
     prev=base_id
  if not seed and prev:seed=recipe(prev,'Sequel',id,'sequel')
  if not seed and not is_generic:
   prev_global=series_last.get(('global',series))
   if prev_global:seed=recipe(prev_global,'Sequel',id,'cross-generation-sequel')
  if not seed:
   # Genre+platform identifies a representative title for the stated genre.
   ga=lookup(GENRE.get(genre,''))
   if ga:seed=recipe(ga,p_id,id,'genre-platform')
  if not seed:
   # No defensible route: remove ununlockable game instead of stuffing catalog to pad metrics.
   items.pop(id);byname.pop(normalize(name),None);added.remove(next(i for i in added if i['id']==id));skipped.append({'title':name,'reason':'No defensible crafting route'});continue
  series_last[(platform,series)]=id;series_last[('global',series)]=id
  recipe(id,p_id,id,'platform-recognition')
  recipe(id,anchor_id,id,'franchise-recognition')
  ga=lookup(GENRE.get(genre,''))
  if ga:recipe(id,ga,id,'genre-recognition')
  stats['new-seeded-games']+=1

# Bonus curated non-overwriting paths for prominent console/software crossovers.
CROSS=[('Mario Kart','Nintendo Switch 2','Mario Kart World'),('Donkey Kong Country','Nintendo Switch 2','Donkey Kong Bananza'),('Son Goku','PlayStation 2','Dragon Ball Z: Budokai 3'),('Metroid','Nintendo Switch','Metroid Dread'),('Mario Tennis','Nintendo Switch 2','Mario Tennis Fever'),('Sonic the Hedgehog','Sega Genesis','Sonic the Hedgehog 2'),('Mario','Nintendo Wii','Super Mario Galaxy 2'),('The Legend of Zelda','Nintendo 64','The Legend of Zelda: Majora\'s Mask'),('Halo: Combat Evolved','Xbox 360','Halo 3'),('Half-Life','PC gaming','Half-Life 2')]
for a,b,c in CROSS:recipe(a,b,c,'crossovers')

# Keep only reachable: import base graph + new recipes with fixed-point, not a made-up progress number.
reach={'legacy:0','legacy:1','legacy:2','legacy:3'}
for _ in range(200):
 before=len(reach)
 for pair,target in existing.items():
  a,b=pair.split('|')
  if a in reach and b in reach:reach.add(target)
 if before==len(reach):break
unreachable={it['id'] for it in added if it['id'] not in reach}
if unreachable:
 added=[x for x in added if x['id'] not in unreachable]
 recipes=[x for x in recipes if not any(z in unreachable for z in x)]
 stats['unreachable-pruned']=len(unreachable)
assert len({key(a,b) for a,b,_ in recipes})==len(recipes)
oldIds=set(x['id'] for x in PACK['items']+V22['items']+V23['items'])
assert not (oldIds&{x['id'] for x in added})
assert all(x['id'] in reach for x in added)
newpack={'version':24,'gameName':'35K Alchemy','targetElements':35000,'items':added,'recipes':recipes}
(p/'gaming-pack-v24.js').write_text('export const GAMING_V24 = '+json.dumps(newpack,ensure_ascii=False,separators=(',',':'))+';\n')
# Client: compose V24 without touching earlier data or storage keys.
app=(p/'app.js').read_text()
app=app.replace("import { GAMING_V23 } from './gaming-pack-v23.js';", "import { GAMING_V23 } from './gaming-pack-v23.js';\nimport { GAMING_V24 } from './gaming-pack-v24.js';")
app=app.replace("for(const it of GAMING_V23.items)ITEMS.push({...it,iconStatus:'curated'});", "for(const it of GAMING_V23.items)ITEMS.push({...it,iconStatus:'curated'});\nfor(const it of GAMING_V24.items)ITEMS.push({...it,iconStatus:'curated'});")
app=app.replace("for(const [a,b,out] of GAMING_V23.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}","for(const [a,b,out] of GAMING_V23.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}\nfor(const [a,b,out] of GAMING_V24.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}")
# New IDs are saved in the existing V11 key, preserving all prior versions.
app=app.replace("i.startsWith('gaming23:')","i.startsWith('gaming23:')||i.startsWith('gaming24:')")
app=app.replace("last?.startsWith('gaming23:')","last?.startsWith('gaming23:')||last?.startsWith('gaming24:')")
app=app.replace("$('familiesTotal').textContent=\x60${FAMILIES.length} families\x60;", "$('familiesTotal').textContent=\x60${FAMILIES.length} families\x60;\n $('catalogTargetProgress').textContent=\x60${total.toLocaleString('en-US')} / ${GAMING_V24.targetElements.toLocaleString('en-US')} planned elements\x60;\n $('catalogTargetFill').style.width=Math.min(100,100*total/GAMING_V24.targetElements).toFixed(2)+'%';")
app=app.replace('<h2>Gameverse Offline</h2>','<h2>35K Alchemy</h2>')
app=app.replace('All discoveries are processed on your device.','Goal: a curated catalog of 35,000 elements. The current catalog count is shown under Discoveries. All recipes available now are processed on your device.')
(p/'app.js').write_text(app)
# Brand exact string and metadata. Target is explicitly labelled as PLANNED.
html=(DST/'client/index.html').read_text()
html=html.replace('<title>Gameverse Infinite — V20 Offline</title>','<title>35K Alchemy — V24 Offline</title>')
html=html.replace('<span>Gameverse<span class="brand-dot">.</span></span>','<span>35K <span class="brand-word">Alchemy</span><span class="brand-dot">.</span></span>')
html=html.replace('<div class="discover-caption">COLLECT BY FAMILY <span id="familiesTotal"></span></div>', '<div class="catalog-target" aria-label="Catalog growth toward the 35,000 element goal"><div><span>CATALOG GROWTH</span><strong id="catalogTargetProgress"></strong></div><div class="catalog-target-track"><i id="catalogTargetFill"></i></div></div><div class="discover-caption">COLLECT BY FAMILY <span id="familiesTotal"></span></div>')
(DST/'client/index.html').write_text(html)
css=(p/'styles.css').read_text()
css+='''\n/* V24 — 35K Alchemy restrained identity and honest long-range catalog target. */\n.brand{white-space:nowrap;letter-spacing:-.055em}.brand-word{font-weight:700;letter-spacing:-.06em}.brand-mark{color:#e9a34d}.catalog-target{margin:4px 15px 13px;padding:11px 13px;background:#fbf9f6;border:1px solid #efe6db;border-radius:13px}.catalog-target>div:first-child{display:flex;justify-content:space-between;align-items:center;gap:8px;color:#958778;font-size:10px;font-weight:790;letter-spacing:.07em}.catalog-target strong{letter-spacing:0;font-weight:700;color:#62584b;text-align:right}.catalog-target-track{height:5px;background:#e7ded1;border-radius:99px;overflow:hidden;margin-top:8px}.catalog-target-track i{display:block;height:100%;background:#d69a48;border-radius:99px}.section-head h1{letter-spacing:-.055em}\n'''
(p/'styles.css').write_text(css)
# Bundler: same format as V23, add V24 globals + imports and use new filename.
b=DST/'tools/build-standalone.py';bs=b.read_text()
bs=bs.replace('fully offline V23','fully offline 35K Alchemy V24')
bs=bs.replace("art23=(root/'client/src/gameverse-art-v23.js')", "gaming24=(root/'client/src/gaming-pack-v24.js').read_text(encoding='utf-8').replace('export const GAMING_V24 =','const GAMING_V24 =')\nart23=(root/'client/src/gameverse-art-v23.js')")
bs=bs.replace("app=app.replace(\"import { GAMING_V23 } from './gaming-pack-v23.js';\",'const {GAMING_V23}=window.__gameverseGaming23;')", "app=app.replace(\"import { GAMING_V23 } from './gaming-pack-v23.js';\",'const {GAMING_V23}=window.__gameverseGaming23;')\napp=app.replace(\"import { GAMING_V24 } from './gaming-pack-v24.js';\",'const {GAMING_V24}=window.__gameverseGaming24;')")
bs=bs.replace("'window.__gameverseGaming23=(function(){'+gaming23+'return {GAMING_V23};})();\\nwindow.__gameverseArt23", "'window.__gameverseGaming23=(function(){'+gaming23+'return {GAMING_V23};})();\\nwindow.__gameverseGaming24=(function(){'+gaming24+'return {GAMING_V24};})();\\nwindow.__gameverseArt23")
bs=bs.replace("out=Path('/mnt/data/Gameverse_Infinite_V23_Offline.html')", "out=Path('/mnt/data/35K_Alchemy_V24_Offline.html')")
b.write_text(bs)
# Source evidence is editorial; no cover imagery copied.
report={'name':'35K Alchemy','version':24,'target_elements':35000,'previous_items':3098,'previous_recipes':7667,'added_items':len(added),'added_recipes':len(recipes),'total_items':3098+len(added),'total_recipes':7667+len(recipes),'reachable_new_items':len(added),'skipped_candidates':len(skipped),'breakdown':dict(stats),'skipped_examples':skipped[:35]}
(DST/'catalog-v24-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
(DST/'data-v24-editorial.json').write_text(json.dumps({'groups':GROUPS.strip(),'crossovers':CROSS,'sources':['https://www.nintendo.com/pt-pt/Consolas-e-acessorios/Nintendo-Switch-2/Jogos-para-a-Nintendo-Switch-2/Nintendo-Switch-2-Jogos-2785634.html'],'warnings':['35K is a roadmap target, not currently released element count.','All title/platform associations still require individual licensing/editorial review for a commercial release.']},ensure_ascii=False,indent=2))
result=subprocess.run(['python',str(b)],capture_output=True,text=True)
print(result.stdout,result.stderr)
assert result.returncode==0,result.stderr
out=ROOT/'35K_Alchemy_V24_Offline.html'
assert out.exists() and out.stat().st_size>1000000
shutil.copy2(out,DST/'35K_Alchemy_V24_Offline.html')
print(json.dumps(report,ensure_ascii=False,indent=2)[:5000])
