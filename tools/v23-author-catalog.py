#!/usr/bin/env python3
"""Gameverse V23 incremental curated games expansion; no external art or network."""
from pathlib import Path
import json, re, unicodedata, collections, shutil, io, base64, zlib
from PIL import Image
import cairosvg
BASE=Path('/mnt/data'); src=BASE/'Gameverse_Infinite_V22_Project'; dst=BASE/'Gameverse_Infinite_V23_Project'
if dst.exists():shutil.rmtree(dst)
shutil.copytree(src,dst,ignore=shutil.ignore_patterns('Gameverse_Infinite_V1*_Offline.html','Gameverse_Infinite_V20_Offline.html','Gameverse_Infinite_V21_Offline.html','Gameverse_Infinite_V22_Offline.html','V1*_*.png','node_modules','__pycache__'))
p=dst/'client/src'
parse=lambda name:json.loads((p/name).read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
D=parse('legacy-data.js');P=parse('creative-pack.js');V22=parse('gaming-pack-v22.js')
normalize=lambda s:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',str(s).lower().replace('’',"'")).encode('ascii','ignore').decode())
items={f'legacy:{i}':{'id':f'legacy:{i}','name':r[0],'category':r[1]} for i,r in enumerate(D['items'])}
for it in P['items']+V22['items']:items[it['id']]=it
byname={normalize(o['name']):id for id,o in items.items()}
def lookup(s):return byname.get(normalize(s))
key=lambda a,b:'|'.join(sorted((a,b)))
existing={key(f'legacy:{a}',f'legacy:{b}'):f'legacy:{c}' for a,b,c in D['recipes']}
for a,b,c in P['recipes']+V22['recipes']:existing.setdefault(key(a,b),c)
old_names=set(byname)
added=[];recipes=[];stats=collections.Counter();name_by_id={id:o['name'] for id,o in items.items()}; conflicts=[]

def add_game(name,platform,series,genre):
    if lookup(name):return lookup(name),False
    id='gaming23:'+normalize(name)
    if id in items:return id,False
    art={'racing':'racer','sports':'soccer','music':'rhythm','puzzle':'puzzle','horror':'specter','stealth':'stealth','scifi':'starship','strategy':'strategy','action':'action','fighter':'fighter','rpg':'fantasy','adventure':'fantasy','platform':'platformer','game':'game_case'}.get(genre,'game_case')
    low=name.lower()
    if 'tennis' in low: art='tennis'
    elif 'golf' in low: art='golf'
    elif 'kart' in low or 'strikers' in low: art='racer'
    elif 'pokémon' in low: art='monster_orb'
    elif 'ninja' in low or 'shinobi' in low: art='shuriken'
    it={'id':id,'name':name,'category':'game','summary':f'Curated videogame entry; featured platform: {platform}. Series: {series}.','iconFamily':genre,'paletteVariant': 'cool' if genre in ('scifi','strategy','puzzle') else 'warm' if genre in ('racing','fighter','action') else 'emerald' if genre in ('sports','adventure') else 'spectral','v19Art':art,'sourceTag':'v23-editorial'}
    items[id]=it;byname[normalize(name)]=id;name_by_id[id]=name;added.append(it);stats['new_games']+=1
    return id,True

def add_recipe(a,b,target,kind):
    a=a if a in items else lookup(a)
    b=b if b in items else lookup(b)
    target=target if target in items else lookup(target)
    if not(a and b and target):return False
    k=key(a,b)
    if k in existing:
        if existing[k]!=target:conflicts.append([name_by_id.get(a,a),name_by_id.get(b,b),name_by_id.get(target,target),name_by_id.get(existing[k],existing[k])]);stats['conflicts_avoided']+=1
        return False
    existing[k]=target;recipes.append([a,b,target]);stats[kind]+=1
    return True

# Named anchors can be a franchise or a canonical videogame from the earlier catalogue.
ANCHORS={'Mario':'Super Mario Bros.','Kirby':'Kirby’s Dream Land','Wario':'Wario Land','Donkey Kong':'Donkey Kong Country','Sonic':'Sonic the Hedgehog','Zelda':'The Legend of Zelda','Yoshi':'Super Mario World 2: Yoshi’s Island','Ratchet & Clank':'Ratchet & Clank','Halo':'Halo: Combat Evolved','Professor Layton':'Professor Layton and the Curious Village','Dragon Ball':'Dragon Ball','Pokémon':'Pokémon','Castlevania':'Castlevania','Mega Man':'Mega Man 2','GTA':'GTA: San Andreas','The Elder Scrolls':'The Elder Scrolls V: Skyrim','Star Wars':'Star Wars','Paper Mario':'Paper Mario','Persona':'Persona 4','Civilization':'Sid Meier’s Civilization','Final Fantasy':'Final Fantasy','God of War':'God of War','Sly Cooper':'Sly Cooper','Jak and Daxter':'Jak and Daxter','Spider-Man':'Spider-Man','Kingdom Hearts':'Kingdom Hearts','Warcraft':'World of Warcraft','Dragon Quest':'Dragon Quest','Fallout':'Fallout 3','Uncharted':'Uncharted: Drake’s Fortune','Horizon':'Horizon Zero Dawn','The Sims':'The Sims','Fire Emblem':'Fire Emblem','Yakuza':'Yakuza 0','Sega':'Sega','Nintendo':'Nintendo','Fable':'Fable','Phantasy Star':'Phantasy Star','Gears of War':'Gears of War'}

# platform / series / genre / ordered titles. The platform is a real documented release platform,
# not a claim of exclusivity or the game's first release date. Avoid speculative/future products.
GROUPS=r'''
Nintendo Switch|Mario|sports|Mario Tennis Aces;Mario Golf: Super Rush;Mario Strikers: Battle League
Nintendo Switch|Mario|platform|Super Mario 3D All-Stars;Mario vs. Donkey Kong (Switch)
Nintendo Switch|Mario|strategy|Mario + Rabbids Kingdom Battle;Mario + Rabbids Sparks of Hope
Nintendo Switch|Mario|game|Mario Party Superstars;Super Mario Party Jamboree
Nintendo Switch|Zelda|adventure|The Legend of Zelda: Echoes of Wisdom;Hyrule Warriors: Age of Calamity
Nintendo Switch|Kirby|platform|Kirby Star Allies;Kirby's Return to Dream Land Deluxe;Kirby Fighters 2
Nintendo Switch|Pokémon|rpg|Pokémon Legends: Arceus;Pokémon Mystery Dungeon: Rescue Team DX;Pokémon Let's Go, Pikachu!;Pokémon Let's Go, Eevee!
Nintendo Switch|Metroid|action|Metroid Prime Remastered
Nintendo Switch|Wario|game|WarioWare: Get It Together!;WarioWare: Move It!
Nintendo Switch|Pikmin|strategy|Pikmin 1+2
Nintendo Switch|Fire Emblem|strategy|Fire Emblem Engage
Nintendo Switch|Bayonetta|action|Bayonetta 3
Nintendo Switch|Nintendo|sports|Nintendo Switch Sports
Nintendo Switch|Monster Hunter|rpg|Monster Hunter Stories 2: Wings of Ruin
Nintendo 3DS|Pokémon|rpg|Pokémon Ultra Sun;Pokémon Ultra Moon;Detective Pikachu
Nintendo 3DS|Kirby|platform|Kirby: Triple Deluxe;Kirby: Planet Robobot
Nintendo 3DS|Mario|rpg|Mario & Luigi: Dream Team;Mario & Luigi: Paper Jam
Nintendo 3DS|Fire Emblem|strategy|Fire Emblem Echoes: Shadows of Valentia
Nintendo DS|Pokémon|rpg|Pokémon HeartGold;Pokémon SoulSilver;Pokémon Mystery Dungeon: Explorers of Time;Pokémon Mystery Dungeon: Explorers of Darkness
Nintendo DS|Mario|rpg|Mario & Luigi: Partners in Time
Nintendo DS|Professor Layton|puzzle|Professor Layton and the Diabolical Box;Professor Layton and the Unwound Future;Professor Layton and the Last Specter
Nintendo DS|Kirby|platform|Kirby Super Star Ultra;Kirby Mass Attack
Game Boy Advance|Kirby|platform|Kirby & the Amazing Mirror
Game Boy Advance|F-Zero|racing|F-Zero: Maximum Velocity;F-Zero: GP Legend
Game Boy Advance|Mario|platform|Mario vs. Donkey Kong
Game Boy Advance|Wario|game|WarioWare: Twisted!
Nintendo Wii|Mario|sports|Mario Strikers Charged;Mario & Sonic at the Olympic Games
Nintendo Wii|Nintendo|music|Rhythm Heaven Fever
Nintendo Wii|Fire Emblem|strategy|Fire Emblem: Radiant Dawn
Nintendo Wii|Zelda|adventure|Link's Crossbow Training
Nintendo GameCube|Mario|sports|Super Mario Strikers;Mario Power Tennis;Mario Golf: Toadstool Tour
Nintendo GameCube|Donkey Kong|music|Donkey Konga;Donkey Konga 2
Nintendo GameCube|Pokémon|rpg|Pokémon XD: Gale of Darkness
Nintendo GameCube|Mario|game|Mario Party 5;Mario Party 6;Mario Party 7
Nintendo 64|Mario|sports|Mario Tennis;Mario Golf (Nintendo 64)
Nintendo 64|Kirby|platform|Kirby 64: The Crystal Shards
Nintendo 64|Pokémon|adventure|Pokémon Snap
Nintendo 64|Donkey Kong|platform|Donkey Kong 64
SNES|Mega Man|action|Mega Man X3
SNES|Nintendo|rpg|Terranigma;Illusion of Gaia;Soul Blazer
SNES|Final Fantasy|rpg|Final Fantasy IV;Final Fantasy V
SNES|Street Fighter|fighter|Street Fighter Alpha 2 (SNES)
Game Boy|Donkey Kong|platform|Donkey Kong Land;Donkey Kong Land 2;Donkey Kong Land III
Game Boy|Wario|platform|Wario Land II
PlayStation 2|Ratchet & Clank|action|Ratchet & Clank: Going Commando;Ratchet & Clank: Up Your Arsenal;Ratchet: Deadlocked;Ratchet & Clank: Size Matters
PlayStation 2|Jak and Daxter|action|Jak II;Jak 3;Jak X: Combat Racing
PlayStation 2|Sly Cooper|stealth|Sly 2: Band of Thieves;Sly 3: Honor Among Thieves
PlayStation 2|Dragon Ball|fighter|Dragon Ball Z: Infinite World;Dragon Ball Z: Budokai Tenkaichi 2
PlayStation 2|Kingdom Hearts|rpg|Kingdom Hearts Re:Chain of Memories
PlayStation 2|Persona|rpg|Persona 3 FES
PlayStation 2|Silent Hill|horror|Silent Hill 3;Silent Hill 4: The Room
PlayStation 2|Metal Gear Solid|stealth|Metal Gear Solid 3: Subsistence
PlayStation 3|Ratchet & Clank|action|Ratchet & Clank Future: Tools of Destruction;Ratchet & Clank Future: A Crack in Time;Ratchet & Clank: All 4 One
PlayStation 3|God of War|action|God of War: Ascension
PlayStation 3|LittleBigPlanet|racing|LittleBigPlanet Karting
PlayStation 3|Gran Turismo|racing|Gran Turismo 6
PlayStation 3|Sly Cooper|stealth|Sly Cooper: Thieves in Time
PlayStation 3|inFAMOUS|action|inFAMOUS 2
PlayStation 3|Final Fantasy|rpg|Final Fantasy XIII;Final Fantasy XIII-2;Lightning Returns: Final Fantasy XIII
PlayStation 4|Uncharted|adventure|Uncharted: The Lost Legacy
PlayStation 4|The Last of Us|action|The Last of Us Part II
PlayStation 4|Horizon|rpg|Horizon Forbidden West
PlayStation 4|Spider-Man|action|Marvel's Spider-Man: Miles Morales
PlayStation 4|inFAMOUS|action|inFAMOUS: Second Son;inFAMOUS: First Light
PlayStation 4|God of War|action|God of War Ragnarök
PlayStation 4|LittleBigPlanet|platform|Sackboy: A Big Adventure
PlayStation 4|PlayStation|adventure|Ghost of Tsushima;Days Gone;Gravity Rush 2
PlayStation 5|Ratchet & Clank|action|Ratchet & Clank: Rift Apart
PlayStation 5|PlayStation|platform|Astro's Playroom;Astro Bot
PlayStation 5|Final Fantasy|rpg|Final Fantasy XVI;Final Fantasy VII Rebirth
PlayStation 5|Spider-Man|action|Marvel's Spider-Man 2
PlayStation 5|PlayStation|action|Stellar Blade;Rise of the Ronin;Returnal
PlayStation 5|Gran Turismo|racing|Gran Turismo 7
PSP|God of War|action|God of War: Chains of Olympus;God of War: Ghost of Sparta
PSP|Final Fantasy|rpg|Crisis Core: Final Fantasy VII;Dissidia 012 Final Fantasy
PSP|Persona|rpg|Persona 3 Portable
PSP|Jak and Daxter|platform|Daxter
PSP|Metal Gear Solid|stealth|Metal Gear Solid: Peace Walker
PSP|Monster Hunter|rpg|Monster Hunter Freedom Unite;Monster Hunter Freedom 2
PSP|PlayStation|music|Patapon;Patapon 2;LocoRoco;LocoRoco 2
PS Vita|Uncharted|adventure|Uncharted: Golden Abyss
PS Vita|Persona|rpg|Persona 4 Golden
PS Vita|PlayStation|adventure|Gravity Rush;Tearaway;Freedom Wars
PS Vita|Killzone|action|Killzone: Mercenary
PS Vita|LittleBigPlanet|platform|LittleBigPlanet PS Vita
PlayStation|Crash Bandicoot|racing|Crash Team Racing
PlayStation|Final Fantasy|rpg|Final Fantasy Tactics
PlayStation|Resident Evil|horror|Resident Evil: Survivor
PlayStation|Tomb Raider|adventure|Tomb Raider III;Tomb Raider: The Last Revelation;Tomb Raider: Chronicles
PlayStation|PlayStation|action|Syphon Filter;Syphon Filter 2;Twisted Metal;Twisted Metal 2;Alundra
PlayStation|PlayStation|rpg|The Legend of Dragoon;Chrono Cross
Sega Dreamcast|Sonic|platform|Sonic Adventure;Sonic Adventure 2;Sonic Shuffle
Sega Dreamcast|Phantasy Star|rpg|Phantasy Star Online;Phantasy Star Online Ver. 2
Sega Dreamcast|Shenmue|adventure|Shenmue II
Sega Dreamcast|Crazy Taxi|racing|Crazy Taxi 2
Sega Dreamcast|Virtua Fighter|fighter|Virtua Fighter 3tb
Sega Dreamcast|Jet Set Radio|action|Jet Set Radio Future
Sega Dreamcast|Sega|fighter|Power Stone;Power Stone 2;Marvel vs. Capcom 2
Sega Saturn|Virtua Fighter|fighter|Virtua Fighter 2;Fighters Megamix
Sega Saturn|NiGHTS into Dreams|platform|Christmas NiGHTS
Sega Saturn|Sega|rpg|Panzer Dragoon;Panzer Dragoon II Zwei;Panzer Dragoon Saga
Sega Saturn|Sega|racing|Sega Rally Championship
Sega Genesis|Sonic|platform|Sonic the Hedgehog 3;Sonic & Knuckles;Sonic 3D Blast
Sega Genesis|Sega|action|Streets of Rage;Streets of Rage 2;Streets of Rage 3;Gunstar Heroes;Comix Zone
Sega Genesis|Phantasy Star|rpg|Phantasy Star IV
Sega Game Gear|Sonic|platform|Sonic Chaos;Sonic Triple Trouble;Sonic Blast
Sega Game Gear|Sega|action|The GG Shinobi;The GG Shinobi II: The Silent Fury
Xbox|Halo|scifi|Halo 2
Xbox|Fable|rpg|Fable: The Lost Chapters
Xbox|Xbox|scifi|MechAssault;MechAssault 2: Lone Wolf
Xbox|Forza Motorsport|racing|Forza Motorsport
Xbox|Xbox|racing|Project Gotham Racing;Project Gotham Racing 2
Xbox 360|Halo|scifi|Halo 3;Halo 3: ODST;Halo: Reach;Halo 4
Xbox 360|Gears of War|action|Gears of War 2;Gears of War 3;Gears of War: Judgment
Xbox 360|Forza Motorsport|racing|Forza Motorsport 2;Forza Motorsport 3;Forza Motorsport 4
Xbox 360|Fable|rpg|Fable II;Fable III
Xbox 360|Xbox|rpg|Lost Odyssey;Blue Dragon;Viva Piñata
Xbox 360|Xbox|action|Banjo-Kazooie: Nuts & Bolts;Alan Wake
Xbox One|Halo|scifi|Halo 5: Guardians;Halo Wars 2
Xbox One|Gears of War|action|Gears of War 4;Gears 5
Xbox One|Forza Horizon|racing|Forza Horizon 3;Forza Horizon 4
Xbox One|Ori and the Blind Forest|platform|Ori and the Will of the Wisps
Xbox One|Xbox|action|Quantum Break;Sunset Overdrive;State of Decay 2
Xbox Series X|Xbox|music|Hi-Fi Rush
Xbox Series X|Forza Motorsport|racing|Forza Motorsport (2023)
Xbox Series X|Microsoft|strategy|Microsoft Flight Simulator 2024
Xbox Series X|Xbox|rpg|Avowed
PC gaming|Age of Empires|strategy|Age of Empires II: The Age of Kings;Age of Empires III;Age of Empires IV
PC gaming|StarCraft|strategy|StarCraft II: Wings of Liberty;StarCraft II: Heart of the Swarm;StarCraft II: Legacy of the Void
PC gaming|Warcraft|strategy|Warcraft III: Reign of Chaos;Warcraft III: The Frozen Throne
PC gaming|The Sims|game|The Sims 2;The Sims 3;The Sims 4
PC gaming|SimCity|strategy|SimCity 2000;SimCity 3000;SimCity 4
PC gaming|Counter-Strike|action|Counter-Strike: Source;Counter-Strike: Global Offensive;Counter-Strike 2
PC gaming|Half-Life|scifi|Half-Life 2: Episode One;Half-Life 2: Episode Two;Half-Life: Alyx
PC gaming|Portal|puzzle|Portal 2;Portal Stories: Mel
PC gaming|Diablo|rpg|Diablo II;Diablo III;Diablo IV
PC gaming|Civilization|strategy|Sid Meier's Civilization V;Sid Meier's Civilization VI;Sid Meier's Civilization VII
PC gaming|Assassin's Creed|stealth|Assassin's Creed Origins;Assassin's Creed Odyssey;Assassin's Creed Valhalla;Assassin's Creed Mirage
PC gaming|The Elder Scrolls|rpg|The Elder Scrolls IV: Oblivion;The Elder Scrolls III: Morrowind
PC gaming|The Witcher|rpg|The Witcher 2: Assassins of Kings;The Witcher 3: Wild Hunt
PC gaming|GTA|action|Grand Theft Auto IV;Grand Theft Auto V
PC gaming|Hades|action|Hades II
PC gaming|Hollow Knight|platform|Hollow Knight: Silksong
PC gaming|Slay the Spire|strategy|Slay the Spire 2
PC gaming|Resident Evil|horror|Resident Evil 7: Biohazard;Resident Evil Village;Resident Evil 2 (2019);Resident Evil 4 (2023)
PC gaming|Monster Hunter|action|Monster Hunter: World;Monster Hunter Wilds
PC gaming|Baldur's Gate|rpg|Baldur's Gate 3
PC gaming|DOOM|action|DOOM Eternal;DOOM: The Dark Ages
'''
# Corrections: don't infer title/platform incorrectly. Jet Set Radio Future is Xbox-only and Slay the Spire 2 may be early access,
# omit uncertain sequel, and avoid an edition distinction which is unclear without precise ID.
GROUPS=GROUPS.replace('Jet Set Radio Future','Jet Set Radio').replace(';Slay the Spire 2','')
# Original V22 platform naming may use Xbox/PSP aliases, resolve via known canonical names.
PLATFORM_ALIAS={'PlayStation':'PlayStation','PS Vita':'PS Vita','PSP':'PSP','Xbox One':'Xbox One','Sega Genesis':'Sega Genesis'}
GENRE_ANCHOR={'racing':'Racing Game','sports':'Sports Game','music':'Music','puzzle':'Puzzle','horror':'Horror Game','stealth':'Stealth','scifi':'Science Fiction','strategy':'Strategy','action':'Action','fighter':'Fighting Game','rpg':'RPG','adventure':'Adventure','platform':'Platform Game','game':'Video Game'}
# These semantic crossover recipes are more specific than a broad series+console pairing.
# A narrow anchor wins when available, so Mario Tennis + Switch gives Mario Tennis Aces,
# not an arbitrary Mario game.
SPECIFIC_SEEDS={
 'Mario Tennis Aces':[('Mario Tennis','Nintendo Switch')],
 'Mario Golf: Super Rush':[('Mario Golf','Nintendo Switch')],
 'Mario Party Superstars':[('Mario Party','Remaster')],
 'Super Mario 3D All-Stars':[('Super Mario Galaxy','Nintendo Switch')],
 'Pokémon Legends: Arceus':[('Pokémon','Mythology')],
 'Detective Pikachu':[('Detective','Pikachu')],
 'God of War: Chains of Olympus':[('God of War','PSP')],
 'Metal Gear Solid: Peace Walker':[('Metal Gear Solid','PSP')],
 'Ratchet & Clank: Rift Apart':[('Ratchet & Clank','PlayStation 5')],
 'Sonic Adventure':[('Sonic the Hedgehog','Sega Dreamcast')],
 'Age of Empires II: The Age of Kings':[('Age of Empires','Sequel')],
 'Resident Evil 7: Biohazard':[('Resident Evil','PC gaming')],
 'The Last of Us Part II':[('The Last of Us','Sequel')],
}
series_last={}; publication=[]; base_lookup={normalize(o['name']) for o in items.values()}
for line in GROUPS.splitlines():
    line=line.strip()
    if not line:continue
    platform,series,genre,names=line.split('|',3)
    platform=PLATFORM_ALIAS.get(platform,platform)
    pid=lookup(platform)
    if not pid:
        stats['platform_not_available']+=1;publication.append({'line':line,'reason':'platform unknown'});continue
    anchor=ANCHORS.get(series,series)
    aid=lookup(anchor)
    if not aid:
        # Try existing series game names, only exact prefix, not arbitrary unrelated games.
        candidates=[o for o in items.values() if normalize(o['name']).startswith(normalize(series))]
        aid=candidates[0]['id'] if candidates else None
    if not aid:
        stats['series_not_available']+=1;publication.append({'line':line,'reason':'series anchor unknown'});continue
    for title in names.split(';'):
        title=title.strip()
        tid,isnew=add_game(title,platform,series,genre)
        stats['entries_curated']+=1
        publication.append({'title':title,'platform':platform,'series':series,'genre':genre,'new':isnew})
        # A game is always recognized from the original franchise plus platform if unused.
        created=False
        for seed_a,seed_b in SPECIFIC_SEEDS.get(title,[]):
            if add_recipe(seed_a,seed_b,tid,'specific-crossovers'):
                created=True;break
        if not created:created=add_recipe(aid,pid,tid,'franchise-platform')
        # Sequels and spin-offs can follow the previous game in the same series.
        prev=series_last.get((series,platform))
        if not created and prev and prev!=tid:
            created=add_recipe(prev,'Sequel',tid,'series-progression')
        # Some franchise/platform pairs are already occupied; a previous entry from a different platform
        # can still produce a reasonable cross-platform sequel.
        if not created:
            prev_global=series_last.get((series,'GLOBAL'))
            if prev_global and prev_global!=tid:
                created=add_recipe(prev_global,'Sequel',tid,'cross-platform-progression')
        # If all meaningful pairings are already in use, don't introduce a UI ???? with no genuine route.
        if created:stats['seeded_games']+=1
        # Once a game has a route, its own identity and genre are safe redundant recognitions.
        if created or (not isnew):
            add_recipe(tid,pid,tid,'platform-recognition')
            add_recipe(tid,aid,tid,'franchise-recognition')
            g=lookup(GENRE_ANCHOR.get(genre,''))
            if g:add_recipe(tid,g,tid,'genre-recognition')
            # Progress the next title from this one even if the prior title already existed.
            series_last[(series,platform)]=tid
            series_last[(series,'GLOBAL')]=tid
        else:
            # Keep an unseeded item out of release and skip its own unused entries later.
            if isnew:
                items.pop(tid);byname.pop(normalize(title),None);name_by_id.pop(tid,None)
                added[:]=[x for x in added if x['id']!=tid]
                stats['removed_unseeded']+=1

# Confirmed crossovers anchored to real universes (game release platform checked during curation).
CROSSOVERS=[
 ('Son Goku','PlayStation 2','Dragon Ball Z: Budokai 3'),
 ('Spider-Man','PlayStation 5',"Marvel's Spider-Man 2"),
 ('Sonic the Hedgehog','Sega Dreamcast','Sonic Adventure'),
 ('Resident Evil','PC gaming','Resident Evil 7: Biohazard'),
 ('Kirby’s Dream Land','Nintendo 3DS','Kirby: Triple Deluxe'),
 ('Mario Kart','Nintendo Switch','Mario Kart 8 Deluxe'),
 ('Pikmin','Nintendo Switch','Pikmin 4'),
 ('Ratchet & Clank','PlayStation 5','Ratchet & Clank: Rift Apart'),
 ('The Last of Us','PlayStation 4','The Last of Us Part II'),
 ('Pokémon','Nintendo Switch','Pokémon Legends: Arceus'),
 ('Fire Emblem','Nintendo Switch','Fire Emblem Engage'),
 ('Sly Cooper','PlayStation 2','Sly 2: Band of Thieves'),
 ('God of War','PSP','God of War: Chains of Olympus'),
 ('Metal Gear Solid','PSP','Metal Gear Solid: Peace Walker'),
 ('Sonic the Hedgehog','Sega Game Gear','Sonic Chaos'),
 ('Phantasy Star','Sega Dreamcast','Phantasy Star Online'),
 ('Age of Empires','PC gaming','Age of Empires II: The Age of Kings'),
 ('Counter-Strike','PC gaming','Counter-Strike: Source'),
 ('Gran Turismo','PlayStation 5','Gran Turismo 7'),
 ('Half-Life','PC gaming','Half-Life: Alyx'),
]
for a,b,c in CROSSOVERS:add_recipe(a,b,c,'explicit-crossovers')

# Keep no unreachable new elements: run full fixed-point from the four starters.
reach={'legacy:0','legacy:1','legacy:2','legacy:3'}
for i in range(100):
    prev=len(reach)
    for k,target in existing.items():
        a,b=k.split('|')
        if a in reach and b in reach:reach.add(target)
    if len(reach)==prev:break
orphans={o['id'] for o in added if o['id'] not in reach}
if orphans:
    added=[o for o in added if o['id'] not in orphans]
    recipes=[r for r in recipes if all(z not in orphans for z in r)]
    stats['orphan_removed']=len(orphans)
# Candidate pairs guaranteed unique; existing recipes never overwritten.
assert len(set(key(a,b) for a,b,c in recipes))==len(recipes)
assert set(o['id'] for o in added).issubset(reach)
assert len(set(normalize(o['name']) for o in added))==len(added)
output={'version':23,'items':added,'recipes':recipes}
(p/'gaming-pack-v23.js').write_text('export const GAMING_V23 = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# New original static art families: SVGs produced in code; compiled to WebP and embedded in HTML.
# All shapes and palettes were created for Gameverse, not copied from game cover art.
S=256
SVG_BASE='''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4bb"/><stop offset=".5" stop-color="#ffae2a"/><stop offset="1" stop-color="#f05a49"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#96f0ff"/><stop offset=".45" stop-color="#3d80f6"/><stop offset="1" stop-color="#3930ad"/></linearGradient><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bdf39d"/><stop offset=".5" stop-color="#36c692"/><stop offset="1" stop-color="#008a8d"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd2ff"/><stop offset=".45" stop-color="#bd77e9"/><stop offset="1" stop-color="#5f36ad"/></linearGradient></defs>CONTENT</svg>'''
# Stroke style defines coherent silhouette language across icons.
path=lambda d,fill,stroke='#1e274b',sw=8:f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
circle=lambda x,y,r,fill,stroke='#1e274b',sw=8:f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
rect=lambda x,y,w,h,r,fill,stroke='#1e274b',sw=8:f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
ART={}
ART['racer']=(circle(69,191,28,'#25315d')+circle(195,191,28,'#25315d')+circle(69,191,13,'#e9faff')+circle(195,191,13,'#e9faff')+path('M48 175 L65 116 Q88 92 136 102 L191 127 L218 172 Z','url(#a)')+path('M89 109 L98 79 Q150 54 183 114 L135 122 Z','url(#b)')+rect(105,72,42,15,7,'#fff1a9')+circle(126,62,10,'#ffe28e'))
ART['soccer']=(circle(127,135,96,'#f5f9ff')+path('M128 84 L163 107 L155 146 L119 163 L92 134 L97 103 Z','#36416c')+path('M128 84 L133 44 M163 107 L191 88 M155 146 L191 174 M119 163 L94 197 M92 134 L55 125','none','#344063',7)+path('M50 84 Q66 48 109 43 L97 103 L67 113 Z','url(#c)')+circle(161,54,12,'#fff5af','#fff',0))
ART['rhythm']=(rect(34,86,193,104,19,'url(#b)')+rect(48,105,164,62,6,'#e8f6ff')+''.join(rect(58+i*18,109,13,54,1,'#fff7e5','#b7c6df',2) for i in range(8))+''.join(rect(66+i*36,109,11,34,2,'#272952','#272952',1) for i in range(4))+path('M163 72 L163 26 L198 35 L198 88','none','#ff5fa3',12)+circle(161,75,13,'url(#a)','#bf3886',4)+circle(196,88,13,'url(#d)','#9d4bd1',4))
ART['puzzle']=(path('M54 51 H107 C98 62 99 83 125 83 C148 83 152 62 140 51 H203 V108 C213 93 239 99 239 121 C239 143 214 148 203 136 V198 H146 C159 211 151 231 129 231 C108 231 100 212 112 198 H54 V143 C41 156 19 147 19 124 C19 103 42 96 54 109 Z','url(#d)')+path('M72 62 L81 69 M177 181 L190 187','none','#ffebfd',8))
ART['specter']=(path('M58 199 Q44 158 57 116 Q69 55 128 47 Q193 48 199 119 L203 210 L179 190 L156 211 L129 193 L96 216 L77 192 Z','url(#d)')+circle(100,125,13,'#18284a','#18284a',1)+circle(161,125,13,'#18284a','#18284a',1)+path('M107 163 Q131 178 150 160','none','#202b55',8)+circle(73,67,9,'#87e3ff','#fff',2))
ART['stealth']=(path('M66 199 L59 104 Q72 56 129 55 Q190 57 198 102 L190 198 Z','url(#b)')+path('M53 108 Q132 83 204 111 L194 147 Q129 167 63 146 Z','#242e59')+path('M79 128 L116 119 L130 132 L142 119 L181 128 L157 143 L97 143 Z','#8dffee','#4cc9df',4)+rect(90,192,78,20,9,'#f5ae55')+path('M108 66 L121 44 L146 66','url(#c)'))
ART['starship']=(path('M127 20 Q159 72 158 125 L215 186 L216 209 L161 192 L128 237 L95 192 L40 209 L41 186 L98 125 Q96 72 127 20 Z','url(#b)')+path('M126 65 Q147 107 135 144 L119 144 Q106 107 126 65 Z','#c6f8ff')+path('M103 171 L127 225 L151 171 Z','url(#a)')+circle(128,48,8,'#fff7c7','#fff',0))
ART['strategy']=(path('M47 196 H209 L191 232 H62 Z','url(#a)')+rect(70,173,119,29,10,'url(#b)')+path('M112 172 L98 145 L100 108 L125 74 L139 108 L139 145 L151 171 Z','url(#c)')+circle(129,61,25,'url(#a)')+path('M46 116 H83 L72 85 L91 65 L61 42 L36 73 Z','url(#d)'))
ART['action']=(path('M57 89 L90 66 L137 103 L172 72 L200 93 L185 160 L139 194 L83 172 Z','url(#a)')+path('M78 140 L108 131 L109 105 L131 104 L139 130 L176 141 L138 169 L109 169 Z','url(#b)')+path('M116 54 L141 27 L154 61','url(#c)'))
ART['fighter']=(path('M49 136 Q52 87 92 89 L103 58 L124 57 L134 95 Q161 88 174 109 L205 137 L185 193 Q130 215 74 196 Z','url(#a)')+path('M64 121 L87 91 L108 113 L111 166 L74 175 Z','url(#d)')+rect(91,170,99,39,12,'url(#b)')+path('M121 143 L177 142','none','#ffefba',8))
ART['fantasy']=(path('M107 23 L176 85 L148 157 L124 227 L91 166 L82 83 Z','url(#d)')+path('M109 59 L150 92 L125 159 L108 198 L98 119 Z','#d5eaff')+path('M41 166 Q73 139 106 166 Q142 195 186 148 L224 183 Q183 230 119 220 Q70 228 41 166 Z','url(#a)')+circle(195,90,17,'url(#b)'))
ART['tennis']=(path('M70 151 L122 110','none','#26335c',14)+path('M134 122 L212 211','none','#27335c',14)+path('M98 28 Q135 17 168 55 Q190 83 166 118 Q139 143 103 115 Q74 90 86 57 Q91 37 98 28 Z','url(#b)')+path('M95 68 L169 67 M91 86 L169 86 M109 40 L109 124 M131 32 L131 129 M153 43 L153 120','none','#d1f6ff',5)+circle(59,197,31,'url(#a)')+path('M38 181 Q55 194 75 218','none','#fff8b8',5))
ART['golf']=(path('M38 193 Q68 222 169 210 Q203 204 217 179 L221 219 H37 Z','url(#c)')+path('M104 30 L160 189','none','#daeaff',13)+path('M159 182 Q193 176 219 190 L217 218 L158 218 Z','url(#b)')+circle(87,191,29,'#f7fbff')+''.join(circle(x,y,3,'#abb6d5','#abb6d5',1) for x,y in ((77,180),(88,175),(96,189),(77,198),(95,205)))+path('M42 80 Q69 31 114 43','none','#fcd36c',8))
ART['monster_orb']=(circle(127,129,99,'#f4f5ff')+path('M28 129 A99 99 0 0 1 226 129 Z','url(#a)')+path('M28 129 H226','none','#1e274b',11)+circle(127,129,34,'#ebf5ff')+circle(127,129,17,'url(#b)')+path('M59 76 Q80 49 105 53','none','#fffbd6',10))
ART['shuriken']=(path('M131 14 L157 92 L224 65 L187 128 L237 175 L156 159 L118 240 L104 165 L23 185 L78 124 L35 62 L107 94 Z','url(#b)')+circle(130,128,26,'url(#a)')+circle(130,128,10,'#ebfaff')+path('M112 93 L118 60 M163 139 L207 152','none','#eaffff',7))
ART['platformer']=(path('M25 188 L81 188 L96 167 L148 167 L164 193 L223 193 L223 217 L25 217 Z','url(#c)')+path('M75 155 Q89 90 132 83 Q174 94 184 155 Z','url(#a)')+circle(110,127,7,'#273259','#273259',1)+circle(152,127,7,'#273259','#273259',1)+path('M109 145 Q135 159 151 144','none','#273259',6)+path('M116 80 L131 43 L149 80','url(#b)'))
new_art={}
for name,shape in ART.items():
    svg=SVG_BASE.replace('CONTENT',shape)
    png=cairosvg.svg2png(bytestring=svg.encode('utf-8'),output_width=256,output_height=256)
    img=Image.open(io.BytesIO(png)).convert('RGBA');buf=io.BytesIO();img.save(buf,format='WEBP',quality=87,method=5)
    new_art[name]='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode('ascii')
# Keep original art in a source SVG collection for revision (not required at runtime).
art_dir=dst/'assets/gameverse-v23-svg';art_dir.mkdir(parents=True,exist_ok=True)
for name,shape in ART.items():(art_dir/(name+'.svg')).write_text(SVG_BASE.replace('CONTENT',shape))
(p/'gameverse-art-v23.js').write_text('export const GAMEVERSE_ART_V23 = '+json.dumps(new_art,separators=(',',':'))+';\n')

app=(p/'app.js').read_text()
app=app.replace("import { GAMING_V22 } from './gaming-pack-v22.js';", "import { GAMING_V22 } from './gaming-pack-v22.js';\nimport { GAMING_V23 } from './gaming-pack-v23.js';\nimport { GAMEVERSE_ART_V23 } from './gameverse-art-v23.js';")
app=app.replace("for(const it of GAMING_V22.items)ITEMS.push({...it,iconStatus:'curated'});", "for(const it of GAMING_V22.items)ITEMS.push({...it,iconStatus:'curated'});\nfor(const it of GAMING_V23.items)ITEMS.push({...it,iconStatus:'curated'});")
app=app.replace("for(const [a,b,out] of GAMING_V22.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}","for(const [a,b,out] of GAMING_V22.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}\nfor(const [a,b,out] of GAMING_V23.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}")
app=app.replace("i.startsWith('gaming22:')", "i.startsWith('gaming22:')||i.startsWith('gaming23:')")
app=app.replace("last?.startsWith('gaming22:')", "last?.startsWith('gaming22:')||last?.startsWith('gaming23:')")
app=app.replace("const k=gameverseArtKey(item);", "const k=gameverseArtKey(item);")
# V23 art in the same icon matching code while keeping original gameverse art unmodified.
app=app.replace("if(item.v19Art && GAMEVERSE_ART[item.v19Art])return item.v19Art;","if(item.v19Art && (GAMEVERSE_ART[item.v19Art]||GAMEVERSE_ART_V23[item.v19Art]))return item.v19Art;")
app=app.replace('src="${GAMEVERSE_ART[k]}"','src="${GAMEVERSE_ART_V23[k]||GAMEVERSE_ART[k]}"')
app=app.replace('src="${GAMEVERSE_ART[accent]}"','src="${GAMEVERSE_ART_V23[accent]||GAMEVERSE_ART[accent]}"')
(p/'app.js').write_text(app)

b=dst/'tools/build-standalone.py';bs=b.read_text()
bs=bs.replace("gaming=(root/'client/src/gaming-pack-v22.js')", "gaming=(root/'client/src/gaming-pack-v22.js')") # keep v22 import
bs=bs.replace("atlas=(root/'client/src/emoji-atlas.js')", "gaming23=(root/'client/src/gaming-pack-v23.js').read_text(encoding='utf-8').replace('export const GAMING_V23 =','const GAMING_V23 =')\nart23=(root/'client/src/gameverse-art-v23.js').read_text(encoding='utf-8').replace('export const GAMEVERSE_ART_V23 =','const GAMEVERSE_ART_V23 =')\natlas=(root/'client/src/emoji-atlas.js')")
bs=bs.replace("app=app.replace(\"import { GAMEVERSE_ART }", "app=app.replace(\"import { GAMING_V23 } from './gaming-pack-v23.js';\",'const {GAMING_V23}=window.__gameverseGaming23;')\napp=app.replace(\"import { GAMEVERSE_ART_V23 } from './gameverse-art-v23.js';\",'const {GAMEVERSE_ART_V23}=window.__gameverseArt23;')\napp=app.replace(\"import { GAMEVERSE_ART }")
bs=bs.replace("js=js.replace('window.__gameverseIcons=(function(){',", "js=js.replace('window.__gameverseIcons=(function(){',")
bs=bs.replace("'window.__gameverseGaming=(function(){'+gaming+'return {GAMING_V22};})();\\nwindow.__gameverseIcons=(function(){'", "'window.__gameverseGaming=(function(){'+gaming+'return {GAMING_V22};})();\\nwindow.__gameverseGaming23=(function(){'+gaming23+'return {GAMING_V23};})();\\nwindow.__gameverseArt23=(function(){'+art23+'return {GAMEVERSE_ART_V23};})();\\nwindow.__gameverseIcons=(function(){'")
bs=bs.replace("out=Path('/mnt/data/Gameverse_Infinite_V22_Offline.html')","out=Path('/mnt/data/Gameverse_Infinite_V23_Offline.html')")
bs=bs.replace('fully offline V22 UI','fully offline V23 UI')
b.write_text(bs)
html=(dst/'client/index.html').read_text().replace('Gameverse Infinite V22','Gameverse Infinite V23')
(dst/'client/index.html').write_text(html)
summary={'previous_items':len(D['items'])+len(P['items'])+len(V22['items']),'previous_recipes':len(D['recipes'])+len(P['recipes'])+len(V22['recipes']), 'added_items':len(added),'added_recipes':len(recipes), 'total_items':len(D['items'])+len(P['items'])+len(V22['items'])+len(added),'total_recipes':len(D['recipes'])+len(P['recipes'])+len(V22['recipes'])+len(recipes),'original_art_families':len(ART),'stats':dict(stats),'conflict_count':len(conflicts),'sample_conflicts':conflicts[:12],'unseeded_groups':[x for x in publication if 'reason' in x][:50],'reach_total':len(reach)}
(dst/'catalog-v23-report.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False))
(dst/'data-v23-editorial.json').write_text(json.dumps({'games':publication,'note':'Curated on original franchise and console; representative platforms, not exclusive claims. Editorial review required prior commercial launch.'},indent=2,ensure_ascii=False))
print(json.dumps(summary,indent=2,ensure_ascii=False)[:3400])
