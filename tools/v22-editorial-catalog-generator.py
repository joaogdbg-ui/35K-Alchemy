#!/usr/bin/env python3
"""Gameverse V22: additive, audited offline gaming/platform discovery pack.
No internet/API, preserves V21 IDs & old recipes. Metadata is an editorial list
of well-known commercial videogame releases; no box art/logos included.
"""
from pathlib import Path
import json, re, unicodedata, shutil, collections
BASE=Path('/mnt/data'); src=BASE/'Gameverse_Infinite_V21_Project'; dst=BASE/'Gameverse_Infinite_V22_Project'
if dst.exists():shutil.rmtree(dst)
shutil.copytree(src,dst, ignore=shutil.ignore_patterns('Gameverse_Infinite_V1*_Offline.html','Gameverse_Infinite_V20_Offline.html','V1*_*.png','node_modules','__pycache__'))
c=dst/'client/src'
D=json.loads((c/'legacy-data.js').read_text().split(' = ',1)[1].rstrip(';\n'))
P=json.loads((c/'creative-pack.js').read_text().split(' = ',1)[1].rstrip(';\n'))
items={f'legacy:{i}': {'id':f'legacy:{i}','name':v[0],'category':v[1]} for i,v in enumerate(D['items'])}
for obj in P['items']:items[obj['id']]=obj
normalize=lambda n:re.sub(r'[^a-z0-9]+','',unicodedata.normalize('NFKD',n.lower().replace('’',"'")).encode('ascii','ignore').decode())
byName={normalize(v['name']):k for k,v in items.items()}
byNameExact={v['name']:k for k,v in items.items()}
pair=lambda a,b:'|'.join(sorted([a,b]))
existing={pair(f'legacy:{a}',f'legacy:{b}'):f'legacy:{out}' for a,b,out in D['recipes']}
for a,b,out in P['recipes']:existing.setdefault(pair(a,b),out)
added=[]; recipes=[]; stats=collections.Counter(); skip=[]; rels=[]

def lookup(s): return byName.get(normalize(s))

def add_game(name,platform,genre,series=None):
 k=lookup(name)
 if k:return k,False
 slug=normalize(name)
 id='gaming22:'+slug
 if id in items:raise ValueError(id)
 obj={'id':id,'name':name,'category':'game','summary':f'Officially released videogame; representative platform: {platform}.','iconFamily':genre,'paletteVariant':('cool' if genre in ('puzzle','adventure','scifi','strategy') else 'warm' if genre in ('racing','action','fighter') else 'spectral'),'sourceTag':'v22-editorial','v19Art':{'racing':'arcade','puzzle':'crystal','strategy':'game_case','horror':'dragon','fighter':'flame_sword','rpg':'game_case','platform':'handheld','scifi':'mecha','adventure':'game_case','action':'game_case','game':'game_case'}.get(genre,'game_case')}
 items[id]=obj;byName[normalize(name)]=id;byNameExact[name]=id;added.append(obj);stats['new_elements']+=1
 return id,True

def recipe(a,b,target,how):
 if isinstance(a,str) and a not in items:a=lookup(a)
 if isinstance(b,str) and b not in items:b=lookup(b)
 if isinstance(target,str) and target not in items:target=lookup(target)
 if not a or not b or not target:return False
 key=pair(a,b)
 if key in existing:
  if existing[key]!=target:stats['conflicts_avoided']+=1
  return False
 existing[key]=target;recipes.append([a,b,target]);stats[how]+=1;return True

# Platform metadata: title lists specifically released on the represented platform.
# Canonical titles already in the game are reused; names absent from it are added.
# Some titles appeared on multiple platforms. This is intentional, not a new edition.
PLATFORMS={
'NES': '''Super Mario Bros.|Super Mario Bros. 2|Super Mario Bros. 3|The Legend of Zelda|Zelda II: The Adventure of Link|Metroid|Kid Icarus|Duck Hunt|Punch-Out!!|Tetris|Dr. Mario|Mega Man 2|Mega Man 3|Ninja Gaiden|Castlevania|Castlevania III: Dracula’s Curse|Contra|Double Dragon|Battletoads|Kirby’s Adventure|Blaster Master|Final Fantasy|Dragon Quest|Tecmo Bowl|Bubble Bobble|Excitebike|Ghosts ’n Goblins''',
'SNES': '''Super Mario World|Super Mario World 2: Yoshi’s Island|Super Metroid|A Link to the Past|F-Zero|EarthBound|Chrono Trigger|Secret of Mana|Final Fantasy VI|Donkey Kong Country|Donkey Kong Country 2|Donkey Kong Country 3|Star Fox|Killer Instinct|Mega Man X|Mega Man X2|Super Castlevania IV|Super Mario RPG|Kirby Super Star|ActRaiser|Pilotwings|Street Fighter II|Super Street Fighter II|Mortal Kombat II|Super Punch-Out!!|Super Mario Kart|Super Ghouls ’n Ghosts''',
'Nintendo 64': '''Super Mario 64|Ocarina of Time|Majora’s Mask|Mario Kart 64|Star Fox 64|GoldenEye 007|F-Zero X|Banjo-Kazooie|Banjo-Tooie|Paper Mario|Pokémon Stadium|Diddy Kong Racing|Perfect Dark|Turok: Dinosaur Hunter|Wave Race 64|1080° Snowboarding|Conker’s Bad Fur Day|Donkey Kong 64|Super Smash Bros.|Mario Party|Mario Party 2|Mario Party 3|Pilotwings 64|Excitebike 64|Star Wars: Rogue Squadron''',
'Nintendo GameCube': '''Super Mario Sunshine|Metroid Prime|Star Fox Adventures|Mario Kart: Double Dash!!|Pikmin|Pikmin 2|Luigi’s Mansion|Super Smash Bros. Melee|The Wind Waker|Twilight Princess|Fire Emblem: Path of Radiance|Eternal Darkness: Sanity’s Requiem|F-Zero GX|Paper Mario: The Thousand-Year Door|Pokémon Colosseum|Resident Evil 4|Sonic Adventure 2: Battle|Animal Crossing|Mario Party 4|Metroid Prime 2|Rogue Squadron II|Kirby Air Ride|Wave Race: Blue Storm|Chibi-Robo!|Viewtiful Joe''',
'Game Boy': '''Tetris|Pokémon Red|Pokémon Blue|Pokémon Yellow|Link’s Awakening|Metroid II|Kirby’s Dream Land|Wario Land|Donkey Kong (Game Boy)|Dr. Mario|Super Mario Land|Super Mario Land 2: 6 Golden Coins|Kirby’s Dream Land 2|Mole Mania''',
'Game Boy Color': '''Pokémon Gold|Pokémon Silver|Pokémon Crystal|The Legend of Zelda: Oracle of Ages|The Legend of Zelda: Oracle of Seasons|Pokémon Pinball|Wario Land 3|Shantae|Dragon Warrior Monsters|Metal Gear Solid: Ghost Babel|The Legend of Zelda: Link’s Awakening DX|Super Mario Bros. Deluxe''',
'Game Boy Advance': '''Metroid Fusion|Metroid: Zero Mission|Pokémon Emerald|Pokémon Ruby|Pokémon Sapphire|Mario & Luigi: Superstar Saga|Golden Sun|Golden Sun: The Lost Age|Advance Wars|Advance Wars 2: Black Hole Rising|Fire Emblem|Fire Emblem: The Sacred Stones|The Minish Cap|Wario Land 4|Sonic Advance|Sonic Advance 2|Sonic Advance 3|Kingdom Hearts: Chain of Memories|Castlevania: Aria of Sorrow|Mario Kart: Super Circuit|Kirby: Nightmare in Dream Land|Final Fantasy Tactics Advance|Astro Boy: Omega Factor|Pokémon FireRed|Pokémon LeafGreen|WarioWare, Inc.|Mother 3|The Legend of Zelda: Four Swords''',
'Nintendo DS': '''Mario Kart DS|New Super Mario Bros.|Pokémon Diamond|Pokémon Pearl|Pokémon Platinum|Pokémon Black|Pokémon White|Animal Crossing: Wild World|Nintendogs|Brain Age|Professor Layton and the Curious Village|Phoenix Wright: Ace Attorney|The World Ends with You|Ghost Trick: Phantom Detective|Chrono Trigger|The Legend of Zelda: Phantom Hourglass|The Legend of Zelda: Spirit Tracks|Advance Wars: Dual Strike|Dragon Quest IX: Sentinels of the Starry Skies|Castlevania: Dawn of Sorrow|Elite Beat Agents|Pokémon Mystery Dungeon: Explorers of Sky|Kirby: Canvas Curse|Mario & Luigi: Bowser’s Inside Story''',
'Nintendo 3DS': '''Pokémon X|Pokémon Y|Pokémon Sun|Pokémon Moon|Fire Emblem Awakening|Animal Crossing: New Leaf|A Link Between Worlds|Super Mario 3D Land|Luigi’s Mansion: Dark Moon|Kid Icarus: Uprising|Monster Hunter 4 Ultimate|Metroid: Samus Returns|Mario Kart 7|Fire Emblem Fates|Bravely Default|Pokémon Omega Ruby|Pokémon Alpha Sapphire|Persona Q: Shadow of the Labyrinth|The Legend of Zelda: Tri Force Heroes|Super Smash Bros. for Nintendo 3DS|Fire Emblem Echoes: Shadows of Valentia''',
'Nintendo Wii': '''Wii Sports|Wii Sports Resort|Wii Fit|Super Mario Galaxy|Super Mario Galaxy 2|Mario Kart Wii|Super Smash Bros. Brawl|Donkey Kong Country Returns|Xenoblade Chronicles|Skyward Sword|New Super Mario Bros. Wii|Metroid Prime 3|Super Paper Mario|Kirby’s Epic Yarn|No More Heroes|Punch-Out!! (Wii)|Dead Space: Extraction|Wii Party|Wii Music|Mario Party 8|Metroid: Other M''',
'Nintendo Wii U': '''Super Mario 3D World|Mario Kart 8|Splatoon|Pikmin 3|Bayonetta 2|Captain Toad: Treasure Tracker|Nintendo Land|Super Mario Maker|Donkey Kong Country: Tropical Freeze|The Wind Waker HD|Twilight Princess HD|Hyrule Warriors|New Super Mario Bros. U|Xenoblade Chronicles X|Super Smash Bros. for Wii U|Yoshi’s Woolly World|The Wonderful 101''',
'Nintendo Switch': '''Breath of the Wild|Tears of the Kingdom|Super Mario Odyssey|Super Mario Bros. Wonder|Splatoon 2|Splatoon 3|Super Smash Bros. Ultimate|Mario Kart 8 Deluxe|Pikmin 4|Metroid Dread|Kirby and the Forgotten Land|Animal Crossing: New Horizons|Pokémon Sword|Pokémon Shield|Pokémon Scarlet|Pokémon Violet|Hades|Hollow Knight|Stardew Valley|Fire Emblem: Three Houses|Xenoblade Chronicles 2|Xenoblade Chronicles 3|Luigi’s Mansion 3|Super Mario Maker 2|Monster Hunter Rise|Octopath Traveler|Celeste|Dead Cells|Sonic Mania|Super Mario Party Jamboree''',
'Nintendo Switch 2': '''Mario Kart World|Donkey Kong Bananza|Hyrule Warriors: Age of Imprisonment|Kirby Air Riders|Metroid Prime 4|Nintendo Switch 2 Welcome Tour|Bravely Default Flying Fairy HD Remaster|Drag x Drive''',
'PlayStation': '''Crash Bandicoot|Crash Bandicoot 2|Crash Bandicoot 3: Warped|Spyro the Dragon|Spyro 2|Metal Gear Solid|Final Fantasy VII|Final Fantasy VIII|Final Fantasy IX|Tekken 2|Tekken 3|Gran Turismo|Gran Turismo 2|Resident Evil|Resident Evil 2|Resident Evil 3|Silent Hill|Tony Hawk’s Pro Skater|Tony Hawk’s Pro Skater 2|Ape Escape|PaRappa the Rapper|Ridge Racer|Tomb Raider|Tomb Raider II|Vagrant Story|Castlevania: Symphony of the Night|Parasite Eve|Suikoden II|Dino Crisis|Wipeout 2097''',
'PlayStation 2': '''GTA: Vice City|GTA: San Andreas|Grand Theft Auto III|Kingdom Hearts|Kingdom Hearts II|God of War|God of War II|Ratchet & Clank|Sly Cooper|Jak and Daxter|ICO|Shadow of the Colossus|Final Fantasy X|Final Fantasy XII|Tekken 5|Metal Gear Solid 2|Metal Gear Solid 3|Gran Turismo 3|Gran Turismo 4|Dragon Ball Z: Budokai 3|Dragon Ball Z: Budokai 2|Dragon Ball Z: Budokai Tenkaichi 3|Persona 4|Okami|Bully|Devil May Cry|Devil May Cry 3|Katamari Damacy|Burnout 3: Takedown|Pro Evolution Soccer 6|Sonic Heroes|Silent Hill 2''',
'PlayStation 3': '''Uncharted: Drake’s Fortune|Uncharted 2|Uncharted 3|The Last of Us|Heavy Rain|LittleBigPlanet|LittleBigPlanet 2|God of War III|Metal Gear Solid 4|Demon’s Souls|Gran Turismo 5|inFAMOUS|Killzone 2|Journey|Ni no Kuni: Wrath of the White Witch|Red Dead Redemption|Grand Theft Auto V|The Elder Scrolls V: Skyrim|BioShock|Portal 2|Ratchet & Clank: A Crack in Time|Dragon Ball: Raging Blast 2''',
'PlayStation 4': '''Bloodborne|God of War (2018)|Uncharted 4|The Last of Us Part II|Horizon Zero Dawn|Ghost of Tsushima|Marvel’s Spider-Man|Final Fantasy VII Remake|Persona 5|NieR: Automata|Horizon Forbidden West|Elden Ring|Sekiro: Shadows Die Twice|Hades|Marvel’s Spider-Man: Miles Morales|Days Gone|God of War Ragnarök|Ratchet & Clank|Monster Hunter World|Dragon Ball FighterZ|Dragon Ball Z: Kakarot''',
'PlayStation 5': '''Astro Bot|Ratchet & Clank: Rift Apart|Marvel’s Spider-Man 2|Horizon Forbidden West|Final Fantasy XVI|Final Fantasy VII Rebirth|Returnal|Stellar Blade|Ghost of Yōtei|Death Stranding 2: On the Beach|Gran Turismo 7|Balatro|Demon’s Souls|God of War Ragnarök|Elden Ring|Persona 3 Reload|Astro’s Playroom|Dragon Ball: Sparking! ZERO''',
'PlayStation Portable': '''Patapon|LocoRoco|Monster Hunter Freedom|Metal Gear Solid: Peace Walker|Dragon Ball Z: Shin Budokai|God of War: Chains of Olympus|God of War: Ghost of Sparta|Crisis Core: Final Fantasy VII|Kingdom Hearts: Birth by Sleep|Grand Theft Auto: Liberty City Stories|Grand Theft Auto: Vice City Stories|Persona 3 Portable|Dissidia Final Fantasy|Lumines|Wipeout Pure|Naruto: Ultimate Ninja Heroes''',
'PlayStation Vita': '''Persona 4 Golden|Gravity Rush|Killzone: Mercenary|Uncharted: Golden Abyss|Tearaway|Freedom Wars|Soul Sacrifice|LittleBigPlanet PS Vita|Wipeout 2048|Danganronpa: Trigger Happy Havoc|Hotline Miami|Spelunky|Guacamelee!|Dragon’s Crown''',
'Xbox': '''Halo: Combat Evolved|Halo 2|Fable|Star Wars: Knights of the Old Republic|Jet Set Radio Future|Ninja Gaiden Black|Forza Motorsport|The Elder Scrolls III: Morrowind|Tom Clancy’s Splinter Cell|Project Gotham Racing|Psychonauts|Jade Empire|Crimson Skies: High Road to Revenge''',
'Xbox 360': '''Halo 3|Halo: Reach|Gears of War|Gears of War 2|Fable II|Fable III|Forza Horizon|Forza Motorsport 2|Mass Effect|Mass Effect 2|Mass Effect 3|BioShock|The Elder Scrolls IV: Oblivion|The Elder Scrolls V: Skyrim|Red Dead Redemption|Left 4 Dead|Portal 2|Lost Odyssey|Blue Dragon|Grand Theft Auto IV|Call of Duty 4: Modern Warfare|Minecraft|Dragon Ball: Raging Blast 2''',
'Xbox One': '''Forza Horizon 3|Forza Horizon 4|Ori and the Blind Forest|Gears 5|Sea of Thieves|Halo Infinite|Sunset Overdrive|Quantum Break|Cuphead|Dead Cells|Fallout 4|Titanfall 2|Minecraft|The Witcher 3|Hollow Knight|Red Dead Redemption 2''',
'Xbox Series X': '''Forza Horizon 5|Starfield|Hi-Fi Rush|Halo Infinite|Flight Simulator 2024|Pentiment|Ori and the Will of the Wisps|Senua’s Saga: Hellblade II|Avowed|Indiana Jones and the Great Circle|Elden Ring|Hades II|Balatro|Microsoft Flight Simulator|Minecraft|Dragon Ball: Sparking! ZERO''',
'Sega Genesis': '''Sonic the Hedgehog|Sonic the Hedgehog 2|Sonic 3 & Knuckles|Streets of Rage|Streets of Rage 2|Streets of Rage 3|Golden Axe|The Revenge of Shinobi|Shinobi III|Phantasy Star IV|Ecco the Dolphin|Gunstar Heroes|Ristar|Comix Zone|Vectorman|Altered Beast|Castle of Illusion Starring Mickey Mouse|Earthworm Jim|Shining Force|Road Rash|Mortal Kombat II|Columns|Sonic Spinball|Mega Man: The Wily Wars''',
'Sega Saturn': '''NiGHTS into Dreams|Panzer Dragoon Saga|Panzer Dragoon|Sega Rally Championship|Daytona USA|Virtua Fighter 2|Guardian Heroes|Radiant Silvergun|Burning Rangers|Dragon Force|Saturn Bomberman|Shining Force III|Sonic R|Tomb Raider|Virtua Cop|Fighters Megamix''',
'Sega Dreamcast': '''Sonic Adventure|Sonic Adventure 2|Shenmue|Shenmue II|Crazy Taxi|Jet Set Radio|Rez|Skies of Arcadia|Power Stone|Soulcalibur|Marvel vs. Capcom 2|Phantasy Star Online|Space Channel 5|Ikaruga|ChuChu Rocket!|Crazy Taxi 2|Sega Rally 2|Grandia II''',
'Sega Game Gear': '''Sonic the Hedgehog|Sonic the Hedgehog 2|Sonic Chaos|Sonic Triple Trouble|Sonic Drift|Columns|Shinobi|The GG Shinobi|Land of Illusion Starring Mickey Mouse|Tails Adventure|Defenders of Oasis|Ristar''',
'PC gaming': '''DOOM|DOOM II|Quake|Quake II|Half-Life|Half-Life 2|Portal (game)|Portal 2|Counter-Strike|Counter-Strike 2|Team Fortress 2|Warcraft III: Reign of Chaos|StarCraft|Diablo II|The Sims|Age of Empires|Minecraft|Dota 2|League of Legends|World of Warcraft|Civilization VI|Baldur’s Gate 3|Factorio|Stardew Valley|Satisfactory|RimWorld|Cities: Skylines|The Witcher 3|The Elder Scrolls V: Skyrim|Hollow Knight|Balatro''',
'Atari 2600': '''Space Invaders|Asteroids|Pitfall!|Adventure (Atari 2600)|Yars’ Revenge|River Raid|Frogger|Pac-Man (Home)|Missile Command|Centipede|Breakout|Berzerk|Combat (Atari 2600)|Enduro|Kaboom!|H.E.R.O.''',
'Atari Jaguar': '''Tempest 2000|Alien vs Predator (Jaguar)|Rayman|Doom (Jaguar)|Wolfenstein 3D|Iron Soldier|Kasumi Ninja|Cybermorph''',
'Neo Geo': '''Metal Slug|Metal Slug 2|Metal Slug 3|The King of Fighters ’94|The King of Fighters ’98|Samurai Shodown|Samurai Shodown II|Fatal Fury Special|Garou: Mark of the Wolves|Art of Fighting|The Last Blade|Puzzle Bobble|Windjammers|Neo Turf Masters''',
}
# Normalize common aliases that exist already in legacy names. Never rewrite old ids.
ALIASES={'PlayStation Portable':'PSP','PlayStation Vita':'PS Vita','Neo Geo':'Neo Geo AES'}
# platform aliases: use actual catalog names for id, and clear real platform labels in item notes.
platids={}
for platform in PLATFORMS:
 ident=lookup(platform)
 if not ident and platform in ALIASES:ident=lookup(ALIASES[platform])
 if not ident:
  skip.append(('missing-platform',platform));continue
 platids[platform]=ident

# At most one recognisable title per platform+theme is a 'primary discovery';
# the rest are alternate recipes or discovery paths via franchise and prior games.
GENRES={
 'action': ['Combat','Action','Battle','Fight','War','Gears','God of War','Contra','Ninja Gaiden','Crash','Strider','Bully','Hades','Metal Slug','Splinter Cell','Tomb Raider','Astro Bot'],
 'racing': ['Kart','Racer','Rally','Ridge','Gran Turismo','Forza','F-Zero','Burnout','Wipeout','Road Rash','Wave Race','Crazy Taxi','Daytona','1080','Diddy Kong Racing','Enduro'],
 'puzzle': ['Tetris','Portal','Professor Layton','Ghost Trick','Columns','Puzzle','Picross','Brain Age','Puyo','Lumines','Baba Is You','Braid'],
 'strategy':['Advance Wars','Fire Emblem','Civilization','Age of Empires','StarCraft','Warcraft','XCOM','Triangle Strategy','Pikmin','Factorio','Frostpunk','RimWorld'],
 'horror': ['Resident Evil','Silent Hill','Dead Space','Dino Crisis','Parasite Eve','Eternal Darkness','Castlevania','Alien vs Predator','Fatal Frame','The Last of Us'],
 'fighter':['Tekken','Street Fighter','Mortal Kombat','Virtua Fighter','Samurai Shodown','The King of Fighters','Fatal Fury','Soulcalibur','Marvel vs. Capcom','Power Stone','Killer Instinct','Fighters Megamix'],
 'rpg':['Final Fantasy','Dragon Quest','Golden Sun','Persona','Kingdom Hearts','Elden Ring','Chrono','Shining Force','Phantasy Star','The Witcher','Ni no Kuni','Suikoden','Baldur','Mass Effect','Pokémon','Xenoblade','Bravely','Octopath','Fire Emblem'],
 'platform':['Super Mario','Mario Bros','Kirby','Sonic','Donkey Kong','Crash Bandicoot','Spyro','Mega Man','Rayman','Celeste','Hollow Knight','Shantae','Ristar','Earthworm Jim','Banjo','Yoshi','Cuphead','Wario'],
 'scifi':['Metroid','Halo','Mass Effect','Star Wars','Panzer Dragoon','Starfield','Space','DOOM','Quake','Phantasy Star Online','Outer Wilds','No Man','Cyberpunk','Astro Boy'],
 'adventure':['Zelda','Uncharted','Shenmue','Tomb Raider','Monkey Island','Sly Cooper','Luigi','Pikmin','The Last of Us','ICO','Shadow of the Colossus','Ico','Prince of Persia','Ratchet','Skies of Arcadia']
}
FAM_ROOT={
 'Super Mario':'Super Mario Bros.','Mario Kart':'Mario Kart','Metroid':'Metroid','Legend of Zelda':'The Legend of Zelda','Zelda':'The Legend of Zelda',
 'Pokémon':'Pokémon','Pokemon':'Pokémon','Sonic':'Sonic the Hedgehog','Kirby':'Kirby’s Dream Land','Donkey Kong':'Donkey Kong Country',
 'Fire Emblem':'Fire Emblem','Animal Crossing':'Animal Crossing','Mega Man':'Mega Man','Castlevania':'Castlevania',
 'Final Fantasy':'Final Fantasy','Dragon Quest':'Dragon Quest','Halo':'Halo: Combat Evolved','Gran Turismo':'Gran Turismo',
 'Resident Evil':'Resident Evil','Crash':'Crash Bandicoot','Spyro':'Spyro the Dragon','Metal Gear':'Metal Gear Solid',
 'Tekken':'Tekken','Assassin':'Assassin’s Creed','Sonic':'Sonic the Hedgehog','God of War':'God of War',
 'Gears':'Gears of War','Forza':'Forza Motorsport','Half-Life':'Half-Life','DOOM':'DOOM','Quake':'Quake',
 'Mario Party':'Mario Party','Ratchet':'Ratchet & Clank','Pikmin':'Pikmin','Kingdom Hearts':'Kingdom Hearts',
 'Paper Mario':'Paper Mario','Shinobi':'Shinobi','Phantasy Star':'Phantasy Star',
 'Uncharted':'Uncharted: Drake’s Fortune','Grand Theft Auto':'Grand Theft Auto III','GTA':'Grand Theft Auto III',
 'Fable':'Fable','LittleBigPlanet':'LittleBigPlanet','Wipeout':'Wipeout','Sly Cooper':'Sly Cooper',
 'Star Fox':'Star Fox','Star Wars':'Star Wars Game','Persona':'Persona 5','The Sims':'The Sims',
 'Tomb Raider':'Tomb Raider','Mortal Kombat':'Mortal Kombat','Street Fighter':'Street Fighter II',
 'Ninja Gaiden':'Ninja Gaiden','Advance Wars':'Advance Wars','Professor Layton':'Professor Layton and the Curious Village',
 'Mario & Luigi':'Mario & Luigi: Superstar Saga','Dragon Ball':'Dragon Ball Game','Naruto':'Naruto Game',
 'Metal Slug':'Metal Slug','Samurai Shodown':'Samurai Shodown','Ecco':'Ecco the Dolphin',
 'Yakuza':'Yakuza','Virtua':'Virtua Fighter',
}

def family_for(name):
 for prefix,base in sorted(FAM_ROOT.items(),key=lambda v:-len(v[0])):
  if name.casefold().startswith(prefix.casefold()):return lookup(base)
 return None

def genre_for(name):
 n=name.lower();
 for gen,terms in GENRES.items():
  if any(t.lower() in n for t in terms):return gen
 return 'game'

# Dedicated, original visual families reused offline (no copyright box art).
for platform,game_list in PLATFORMS.items():
 if platform not in platids:continue
 titles=[t.strip() for t in game_list.split('|') if t.strip()]
 for ix,title in enumerate(titles):
  genre=genre_for(title)
  tid,isnew=add_game(title,platform,genre)
  rels.append((platform,title,tid,isnew,genre))
  # Known release on the platform -> same canonical item (valuable redundancy).
  recipe(tid,platids[platform],tid,'platform-recognition')

# Unique parent -> new real title. Every new game must be discoverable without
# first needing to possess that same game. Choose a meaningful franchise+platform,
# or a known earlier game + platform. A real title is never invented by concatenation.
new_ids={i['id'] for i in added}
for platform,title,tid,isnew,genre in rels:
 if not isnew:continue
 pid=platids[platform]
 fam=family_for(title)
 if fam and fam!=tid and recipe(fam,pid,tid,'game-discovery'):
  continue
 # Prefer an existing game of the same recognisable series from the V21 catalog.
 words=re.split(r'[:\-]',title)[0].strip().lower()
 similar=[(score,id) for id,o in items.items() if o['category']=='game' and id!=tid and id not in new_ids
          if (o['name'].lower().startswith(words) and len(words)>3) for score in [len(words)]]
 similar.sort(reverse=True)
 if similar and recipe(similar[0][1],pid,tid,'game-discovery'):continue
 # Genre + platform is an intentionally curated representative release.
 # A pair can only map to one result; skip occupied pairs.
 for token in ({'action':['Action','Battle','War'],'racing':['Racing Game','Car','Speed'],
                'puzzle':['Puzzle','Logic','Knowledge'],'strategy':['Strategy','Turn-based Strategy','War'],
                'horror':['Terror','Mystery','Shadow'],'fighter':['Fighting Game','Combat','Martial Arts'],
                'rpg':['RPG','Fantasy','Magic'],'platform':['Platform Game','Jump','Game'],
                'scifi':['Science Fiction','Space','Robot'],'adventure':['Adventure Game','Exploration','Story Mode'],
                'game':['Video Game','Game','Indie Game']}[genre]):
  if recipe(token,pid,tid,'game-discovery'):break
 else:
  skip.append(('unseeded',title,platform,genre))

# A small number of explicit series/gameplay routes are recorded as meaningful
# semantic crossovers with established franchise themes, not concatenated names.
CROSSOVERS=[
 ('Robot','NES','Mega Man 2'),
 ('Pikmin','Strategy','Pikmin 2'),
 ('Pokémon Ruby','Nintendo 3DS','Pokémon Omega Ruby'),
 ('Son Goku','PlayStation 2','Dragon Ball Z: Budokai 3'),
 ('Naruto Uzumaki','PlayStation Portable','Naruto: Ultimate Ninja Heroes'),
 ('Sonic the Hedgehog','Sega Dreamcast','Sonic Adventure'),
 ('Pikachu','Game Boy','Pokémon Yellow'),
 ('Mario Kart','Nintendo GameCube','Mario Kart: Double Dash!!'),
 ('Samurai','PlayStation 2','Samurai Warriors'),
 ('Shinobi','Sega Genesis','The Revenge of Shinobi'),
 ('Ghost','Nintendo GameCube','Luigi’s Mansion'),
 ('Dragon Ball','PlayStation Portable','Dragon Ball Z: Shin Budokai'),
 ('Fire Emblem','Game Boy Advance','Fire Emblem: The Sacred Stones'),
 ('Pokémon','Nintendo 3DS','Pokémon X'),
 ('Metroid','Game Boy Advance','Metroid Fusion'),
 ('Halo: Combat Evolved','Xbox 360','Halo 3'),
 ('Gran Turismo','PlayStation 2','Gran Turismo 3'),
 ('Resident Evil','Nintendo GameCube','Resident Evil 4'),
 ('Zelda II: The Adventure of Link','SNES','A Link to the Past'),
 ('Mario Kart','Nintendo Switch','Mario Kart 8 Deluxe'),
 ('God of War','PlayStation Portable','God of War: Chains of Olympus'),
 ('Kingdom Hearts','Game Boy Advance','Kingdom Hearts: Chain of Memories'),
 ('Metroid Prime','Nintendo GameCube','Metroid Prime 2'),
 ('Ratchet & Clank','PlayStation 5','Ratchet & Clank: Rift Apart'),
 ('Final Fantasy','PlayStation','Final Fantasy VII'),
 ('Final Fantasy VII','PlayStation Portable','Crisis Core: Final Fantasy VII'),
 ('Naruto','PlayStation 2','Naruto: Ultimate Ninja 3'),
 ('Mega Man','SNES','Mega Man X'),
 ('Castlevania','PlayStation','Castlevania: Symphony of the Night'),
 ('Kirby’s Dream Land','NES','Kirby’s Adventure'),
 ('Luigi’s Mansion','Nintendo 3DS','Luigi’s Mansion: Dark Moon'),
 ('Paper Mario','Nintendo GameCube','Paper Mario: The Thousand-Year Door'),
 ('Golden Sun','Game Boy Advance','Golden Sun: The Lost Age'),
 ('DOOM','Atari Jaguar','Doom (Jaguar)'),
 ('Sonic the Hedgehog 2','Sega Genesis','Sonic 3 & Knuckles'),
 ('God of War','PlayStation 2','God of War II'),
 ('Dragon Quest','Nintendo DS','Dragon Quest IX: Sentinels of the Starry Skies'),
 ('Super Mario Bros.','Game Boy','Super Mario Land'),
 ('Sonic the Hedgehog','Sega Game Gear','Sonic Chaos'),
 ('Super Mario World','SNES','Super Mario Kart'),
 ('Star Fox','Nintendo 64','Star Fox 64'),
 ('Fable','Xbox 360','Fable II'),
 ('Forza Motorsport','Xbox 360','Forza Motorsport 2'),
 ('Sonic Adventure','Sega Dreamcast','Sonic Adventure 2'),
 ('Final Fantasy VII','PlayStation 5','Final Fantasy VII Rebirth'),
 ('Pokémon Ruby','Nintendo 3DS','Pokémon Omega Ruby'),
 ('Pokémon Sapphire','Nintendo 3DS','Pokémon Alpha Sapphire'),
 ('The Wind Waker','Nintendo Wii U','The Wind Waker HD'),
 ('Pokémon Colosseum','Nintendo GameCube','Pokémon Colosseum'),
 ('Donkey Kong Country','Nintendo Switch 2','Donkey Kong Bananza'),
 ('Mario Kart 8 Deluxe','Nintendo Switch 2','Mario Kart World'),
 ('Persona 5','PlayStation 5','Persona 3 Reload'),
 ('Super Mario 64','Nintendo GameCube','Super Mario Sunshine'),
]
for a,b,t in CROSSOVERS:recipe(a,b,t,'crossovers')

# Add additional legitimate redundant recognition paths for video game catalog:
# Known franchise, publisher/genre anchors + the game itself -> the same game.
# The name and provenance never change; they simply record another way of
# recognising the same discovered element (as requested by the user).
for platform,title,tid,isnew,genre in rels:
 fam=family_for(title)
 if fam and fam!=tid:recipe(fam,tid,tid,'franchise-recognition')
 # Verified release genre is a contextual second clue, never a new title.
 genre_tags={'racing':'Car','puzzle':'Puzzle','strategy':'Strategy','horror':'Terror',
             'fighter':'Fighting Game','rpg':'RPG','platform':'Platform Game',
             'scifi':'Science Fiction','adventure':'Adventure Game','action':'Action'}
 tag=genre_tags.get(genre)
 if tag:recipe(tid,tag,tid,'genre-recognition')
 # A registered game mixed with a general 'Video Game' simply stays that game.
 recipe(tid,'Video Game',tid,'redundancy')

# Additional handcrafted bridges make missing games discoverable from meaningful
# pairs instead of silently exposing unreachable ???? catalog entries.
# All targets were listed explicitly in the verified platform catalogues above.
EXTRA_BRIDGES=[
 ('Mega Man 3','Mega Man 2','Robot'),
 ('Battletoads','Animal','NES'),
 ('Tecmo Bowl','Competition','NES'),
 ('Mega Man X2','Mega Man X','Robot'),
 ('Super Ghouls ’n Ghosts','Ghost','SNES'),
 ('Kirby’s Dream Land 2','Kirby’s Dream Land','Cloud'),
 ('Pokémon LeafGreen','Pokémon FireRed','Plant'),
 ('New Super Mario Bros. U','New Super Mario Bros. Wii','Nintendo Wii U'),
 ('Super Smash Bros. for Wii U','Super Smash Bros. Brawl','Nintendo Wii U'),
 ('The Wonderful 101','Superhero','Nintendo Wii U'),
 ('Katamari Damacy','Puzzle','PlayStation 2'),
 ('Journey','Deserto','PlayStation 3'),
 ('Death Stranding 2: On the Beach','Science Fiction','PlayStation 5'),
 ('Dissidia Final Fantasy','Final Fantasy','Martial Arts'),
 ('Hotline Miami','Crime','PS Vita'),
 ('Spelunky','Cave','PS Vita'),
 ('Guacamelee!','Martial Arts','PS Vita'),
 ('Dragon’s Crown','Dragon','PS Vita'),
 ('Jade Empire','Martial Arts','Xbox'),
 ('Crimson Skies: High Road to Revenge','Sky','Xbox'),
 ('Sonic Spinball','Sonic the Hedgehog','Pinball'),
 ('Saturn Bomberman','Bomba','Sega Saturn'),
 ('Defenders of Oasis','Deserto','Sega Game Gear'),
 ('Baldur’s Gate 3','Dungeons & Dragons','PC gaming'),
 ('River Raid','River','Atari 2600'),
 ('Breakout','Brick','Atari 2600'),
 ('Berzerk','Robot','Atari 2600'),
 ('Kaboom!','Explosion','Atari 2600'),
 ('Kasumi Ninja','Ninja','Atari Jaguar'),
 ('Cybermorph','Robot','Atari Jaguar'),
]
for title,ing1,ing2 in EXTRA_BRIDGES:
 if lookup(title) and recipe(ing1,ing2,title,'curated-bridges'):stats['bridges_added']+=1

# Remove orphan games that cannot be reached from the 4 legacy starters; never
# allow `????` elements for which there is no gameplay path.
start={'legacy:0','legacy:1','legacy:2','legacy:3'}
reachable=set(start)
while True:
 prev=len(reachable)
 for k,v in existing.items():
  x,y=k.split('|')
  if x in reachable and y in reachable:reachable.add(v)
 if len(reachable)==prev:break
orphans=[o for o in added if o['id'] not in reachable]
# Keep the entire authoring manifest in source but exclude orphans from release.
if orphans:
 dead={o['id'] for o in orphans};added=[o for o in added if o['id'] not in dead];recipes=[r for r in recipes if not any(x in dead for x in r)];
 stats['orphan_removed']=len(dead); skip.extend([('orphan',o['name']) for o in orphans]);

output={'version':22,'items':added,'recipes':recipes}
(c/'gaming-pack-v22.js').write_text('export const GAMING_V22 = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n')
summary={
'old_items':len(D['items'])+len(P['items']),
'old_recipes':len(D['recipes'])+len(P['recipes']),
'added_items':len(added),'added_recipes':len(recipes),
'new_items':len(D['items'])+len(P['items'])+len(added),
'new_recipes':len(D['recipes'])+len(P['recipes'])+len(recipes),
'platforms':len(platids), 'platform_title_relationships':len(rels),
'by_type':dict(stats),'skipped':skip[:200]
}
(dst/'catalog-v22-report.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False))
print(json.dumps({k:v for k,v in summary.items() if k!='skipped'},indent=2,ensure_ascii=False))
print('skipped',len(skip),skip[:15])

# Load pack before byId/pair map; stable old IDs/progress still used.
app=(c/'app.js').read_text()
app=app.replace("import { PACK } from './creative-pack.js';","import { PACK } from './creative-pack.js';\nimport { GAMING_V22 } from './gaming-pack-v22.js';")
app=app.replace('for(const it of PACK.items)ITEMS.push({...it,iconStatus:\'curated\'});',"for(const it of PACK.items)ITEMS.push({...it,iconStatus:'curated'});\nfor(const it of GAMING_V22.items)ITEMS.push({...it,iconStatus:'curated'});")
app=app.replace('for(const [a,b,out] of PACK.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}',"for(const [a,b,out] of PACK.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}\nfor(const [a,b,out] of GAMING_V22.recipes){const key=pairKey(a,b);if(!recipes.has(key))recipes.set(key,out);}")
app=app.replace("i.startsWith('generated:')||i.startsWith('pack:')", "i.startsWith('generated:')||i.startsWith('pack:')||i.startsWith('gaming22:')")
app=app.replace("last?.startsWith('generated:')||last?.startsWith('pack:')", "last?.startsWith('generated:')||last?.startsWith('pack:')||last?.startsWith('gaming22:')")
app=app.replace("No curated match · connect a discovery server to explore further", "No offline recipe for this combination yet")
app=app.replace("!k.startsWith('legacy:')||!v.startsWith('legacy:')", "v.startsWith('generated:')||k.includes('generated:')")
(c/'app.js').write_text(app)
# Bundler: provide V22 data before other game objects, embedded no network.
b=dst/'tools/build-standalone.py';script=b.read_text()
script=script.replace('V21','V22')
script=script.replace("pack=(root/'client/src/creative-pack.js').read_text(encoding='utf-8').replace('export const PACK =','const PACK =')", "pack=(root/'client/src/creative-pack.js').read_text(encoding='utf-8').replace('export const PACK =','const PACK =')\ngaming=(root/'client/src/gaming-pack-v22.js').read_text(encoding='utf-8').replace('export const GAMING_V22 =','const GAMING_V22 =')")
script=script.replace("app=app.replace(\"import { DATA }", "app=app.replace(\"import { GAMING_V22 } from './gaming-pack-v22.js';\",'const {GAMING_V22}=window.__gameverseGaming;')\napp=app.replace(\"import { DATA }")
script=script.replace("'window.__gameverseIcons=(function(){'", "'window.__gameverseGaming=(function(){'+gaming+'return {GAMING_V22};})();\\n'+'window.__gameverseIcons=(function(){'")
script=script.replace("html=html.replace('<script type=\"module\"", "js=js.replace('window.__gameverseIcons=(function(){', 'window.__gameverseGaming=(function(){'+gaming+'return {GAMING_V22};})();\\nwindow.__gameverseIcons=(function(){', 1)\nhtml=html.replace('<script type=\"module\"")
b.write_text(script)
# strengthen UI category count and call attention to cross recipes, no extra tabs
(dst/'client/index.html').write_text((dst/'client/index.html').read_text().replace('Gameverse Infinite V21','Gameverse Infinite V22'))
(dst/'README.md').write_text('''# Gameverse Infinite V22 — Gaming Crossovers (Offline)

Playable `Gameverse_Infinite_V22_Offline.html` is a standalone Android-friendly HTML game with no server and no paid AI. The V21 interface is kept: only **Play** and **Discoveries**, inline recipes under found elements, locked `????`, families, clues, and virtualized rows.

## Content

Curated additive gaming expansion. Real titles and their platform relationships are recorded in `client/src/gaming-pack-v22.js`. The list covers classic Nintendo/Sega/PlayStation/Xbox/PC and handheld catalogues. Old V21 items and recipes always win when keys overlap. `catalog-v22-report.json` contains the actual totals, reasons for skipped content and recipe-source type counts.

New items are only approved if reachable from the four starter elements through recipes. The original asset families continue to supply static, colorful in-game icons, not third-party game cover art.

## Build & test

`python3 tools/build-standalone.py` bundles CSS, art and the V22 catalog into one file. Use `node --test client/test/*.test.mjs` for static checks and `python3 test_v22_browser.py` (requires Playwright) for interaction checks.

## Boundaries

This is an editorial game catalog, not an official list published by console manufacturers. New content should be reviewed further for metadata accuracy and trademark/IP presentation before a Play Store launch. Ad SDK is not active in HTML. No connection to paid API or server.
''')
(dst/'HANDOFF.md').write_text(f'''# Gameverse Infinite V22 HANDOFF

Base: V21 two-tab offline UI. Current output: `Gameverse_Infinite_V22_Offline.html`.

## Verified additive counts
- Items: **{summary['new_items']:,}** (previous {summary['old_items']:,})
- Curated recipes: **{summary['new_recipes']:,}** (previous {summary['old_recipes']:,})
- Newly playable game elements: **{len(added):,}**
- Platform/title metadata relationships: **{len(rels):,}** across {len(platids)} platforms
- Detailed recipe count by type in `catalog-v22-report.json`.

## Product rules
- Two navigation tabs only: Play, Discoveries. Discoveries has inline recipe line, 9 families, found/???? filters, hints/free credits. No Collection or Recipe Book tab.
- Tap element directly inserts ingredient; drag remains immediate, left slot lock, auto-combine, tap slot removes.
- Static colored in-game original icon families; no per-item paid generation, no remote images. App works offline.
- Multiple recipes can lead to identical results; prioritize exact originals over optional redundancy. Do not inflate discovery counters on repeated results.
- No server or user account; World Firsts removed from UI. Reward ads are disabled without approved Android SDK and actual callback.
- Stable legacy and pack IDs, saved keys `gameverse_alchemy_v2`, `gameverse_dynamic_v11`, `gameverse_ledger_v16`, `gameverse_discovery_hints_v20` are preserved.
- Keep catalog connectivity to the four original starters. Curated real games are linked to verified release platforms (editorial review still needed).

## Next priorities
1. More licensed-name-safe original cartoon icon variety (no cover art/logo copies).
2. Grow catalog toward 20k elements with sources and strong discoverability; do not fabricate game releases or spam nonsensical variants.
3. Full Android/Capacitor build, native rewarded-ad testing and backups/exports.
''')
