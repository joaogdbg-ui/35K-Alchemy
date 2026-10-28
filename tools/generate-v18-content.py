#!/usr/bin/env python3
"""V18: deterministic semantic catalog expansion. Only fixed, human-legible concept datasets.
No LLM calls, no arbitrary word concatenation, no substitutions to legacy identities.
"""
from pathlib import Path
from collections import Counter,defaultdict
import json, shutil, re, unicodedata
SRC=Path(__file__).resolve().parents[1]
DST=SRC
# The previous pack is retained only as a fixed compatibility reference for regeneration.
legacy=json.loads((DST/'client/src/legacy-data.js').read_text().split('export const DATA = ',1)[1].strip().rstrip(';'))
old=json.loads((SRC/'shared/v17_creative_pack_reference.json').read_text())
ref={name.casefold():f'legacy:{i}' for i,(name,*_) in enumerate(legacy['items'])}
ref.update({it['name'].casefold():it['id'] for it in old['items']})
items=[]; recipes=[]; existing={tuple(sorted((f'legacy:{a}',f'legacy:{b}'))):f'legacy:{c}' for a,b,c in legacy['recipes']}
existing.update({tuple(sorted((a,b))):c for a,b,c in old['recipes']})
links=defaultdict(list);basecats=Counter();skipped=Counter()
slug=lambda s: re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())).strip('-')
def idof(n):
 if isinstance(n,int):return f'legacy:{n}'
 if n.startswith(('legacy:','pack:')):return n
 if n.casefold() not in ref:raise ValueError('Missing ingredient '+n)
 return ref[n.casefold()]
def addrecipe(a,b,target,reason='alternate'):
 try:aa,bb,cc=idof(a),idof(b),idof(target)
 except ValueError:return False
 key=tuple(sorted((aa,bb)))
 if key in existing:
  if existing[key]!=cc:skipped['collision']+=1
  return False
 existing[key]=cc;recipes.append([aa,bb,cc]);links[cc].append((aa,bb,reason));return True

def add(name,cat='anime',a=None,b=None,*,icon=None,palette=None,summary=None,source=None):
 key=name.casefold()
 if key in ref:
  if a is not None and b is not None:addrecipe(a,b,name,'existing')
  return name
 ident='pack:'+slug(name)
 # Preserve old items and reject normalized collisions, including accents.
 if any(it['id']==ident for it in items) or any(it['id']==ident for it in old['items']):raise AssertionError(('slug',name,ident))
 it={'id':ident,'name':name,'category':cat,'summary':summary or (f'{source} universe.' if source else f'{cat.title()} concept.'),'iconFamily':icon or {'anime':'hero','manga':'book','character':'hero','film':'film','music':'music','fantasy':'dragon','technology':'robot','game':'game','concept':'book','culture':'book','object':'tool','series':'film','power':'energy','genre':'book'}.get(cat,'book'),'paletteVariant':palette or {'anime':'warm','manga':'cool','character':'warm','film':'spectral','music':'spectral','power':'warm','object':'cool'}.get(cat,'cool')}
 items.append(it);ref[key]=ident;basecats[cat]+=1
 if a is not None and b is not None:
  if not addrecipe(a,b,name,'discovery'):raise AssertionError(('NO_SEED',name,a,b))
 return name

# Map gameplay descriptors to the existing 54 licensed/embedded colorful icon families.
ROLE_ICONS={'Hero':'actor','Villain':'shadow','Rival':'samurai','Mentor':'actor','Sensei':'actor','Friend':'actor',
 'Family':'actor','Science':'science','God':'fantasy','Angel':'fantasy','Princesa':'actor','Sword':'samurai',
 'Fire':'fire','Ice':'ice','Water':'water','Lightning':'lightning','Wind':'air','Shadow':'shadow',
 'Spirit':'fantasy','Ghost':'shadow','Magia':'fantasy','Dark Magic':'shadow','Superpower':'energy',
 'Animal':'life','Dragon':'dragon','Robot':'robot','Computer':'computer','Strategy':'board',
 'Music':'music','Singer':'musician','Piano':'music','Gold':'gold','Stone':'stone',
 'Planet':'space','Space':'space','Time Travel':'clock','Tempo':'clock','Sea':'water',
 'Stealth':'shadow','Ninja':'samurai','Martial Arts':'samurai','Martial Artist':'samurai',
 'Pirate':'water','Pirate Ship':'water','Alvo':'game','Band':'music','Metal':'metal',
 'Power Level':'energy','Energy':'energy','Vision':'science','Curse':'shadow',
 'Book':'book','Knowledge':'book','History':'book','Legend':'book','Life':'life',
 'Technology Advanced':'technology','Electricity':'lightning','Villain':'shadow'}

# Foundational concepts; guaranteed reachable from the original four via legacy recipes.
SEEDS=[
 ('Manga','Japan','Book'),('Anime','Japan','Animation'),('Shonen','Anime','Hero'),('Seinen','Anime','Human'),
 ('Martial Arts','Luta','Human'),('Battle Anime','Anime','Luta'),('Magic Anime','Anime','Magia'),
 ('Mecha Anime','Anime','Robot'),('Sports Anime','Anime','Desporto'),('Anime Film','Anime','Cinema'),
 ('Fantasy Anime','Anime','Fantasia'),('Horror Anime','Anime','Terror'),('Romance','Human','Amizade'),
 ('Friend','Human','Amizade'),('Rival','Competition','Human'),('Mentor','Knowledge','Human'),
 ('Family','Human','House'),('Prince','Hero','Princesa'),('Pirate','Sea','Villain'),
 ('Sword','Metal','Luta'),('Swordfighter','Sword','Hero'),('Demon','Monstro','Shadow'),
 ('Spirit','Life','Shadow'),('Soul','Spirit','Human'),('Curse','Magia','Shadow'),('Cursed Energy','Curse','Energy'),
 ('Superpower','Hero','Energy'),('Transformation','Hero','Magia'),('God','Magia','Sky'),
 ('Angel','Light','Human'),('Fusion','Science','Human'),('Ki','Energy','Martial Arts'),
 ('Saiyan','Dragon','Alien'),('Power Level','Ki','Number'),('Super Saiyan','Saiyan','Transformation'),
 ('God Ki','God','Ki'),('Ultra Instinct','Ki','Vision'),('Time Travel','Futuro','Clock'),
 ('Ninja Clan','Ninja','Family'),('Jutsu','Ninja','Magia'),('Hidden Village','Ninja','Village'),
 ('Sharingan','Ninja','Vision'),('Hokage','Ninja','Hero'),('Chakra','Energy','Ninja'),
 ('Pirate Ship','Pirate','Naves'),('Devil Fruit','Pirate','Plant'),('Haki','Pirate','Ki'),
  ('Giant','Human','Mountain'),('Titan','Giant','Monstro'),('Giant Robot','Robot','Giant'),
 ('Monster Hunter','Hero','Monstro'),('Alchemist','Science','Magia'),('Notebook','Book','Writing'),
 ('Detective','Knowledge','Villain'),('Psychic','Human','Magia'),('Time Loop','Time Travel','Clock'),
 ('Vampire','Human','Shadow'),('Ghost','Spirit','Shadow'),('Witch','Human','Magia'),
 ('Magic Girl','Princesa','Magia'),('Space Opera','Science Fiction','Teatro'),
 ('Spaceship','Naves','Technology Advanced'),('Team','Amizade','Cooperativo'),
 ('Superhero Team','Hero','Team'),('Musician','Human','Music'),('Singer','Music','Human'),
 ('Album','Music','Disc'),('Song','Music','Sound'),('Rock Music','Music','Luta'),
 ('Pop Music','Music','Cor'),('Hip Hop','Music','Rhythm Game'),('Jazz','Music','Science'),
 ('Electronic Music','Music','Electricity'),('Orchestra','Music','Society'),
 ('Film Score','Cinema','Banda sonora'),('Director','Cinema','Human'),('Actor','Cinema','Hero'),
 ('TV Series','Television','Story Mode'),('Science Fiction Film','Cinema','Science Fiction'),
 ('Fantasy Film','Cinema','Fantasia'),('Horror Film','Cinema','Terror'),
 ('Mystery Film','Cinema','Puzzle'),('Comedy Film','Cinema','Fun'),
 ('Space','Sky','Science Fiction'),('Superhero Film','Cinema','Superhero'),
 ('Superhero','Hero','Superpower'),('Antihero','Hero','Shadow'),
 ('Comic Book','Book','Superhero'),('Anime Game','Anime','Video Game'),
 ('Anime Soundtrack','Anime','Film Score'),('OST','Game','Banda sonora'),
 ('Duel','Rival','Luta'),('Tournament','Competition','Luta'),
 ('Dark Magic','Magia','Shadow'),('Dragon Slayer','Dragon','Sword'),
 ('Martial Artist','Human','Martial Arts'),('Sensei','Mentor','Japan'),
 ('Samurai Sword','Sword','Japan'),('Masked Hero','Hero','Mask') if False else ('Mask','Terror','Arte'),
 ('Masked Hero','Hero','Mask'),('Sacred Sword','Sword','Magia'),
 ('Supervillain','Villain','Superpower'),('Dragon Rider','Dragon','Hero'),
 ('Ancient Scroll','Book','History'),('Parallel World','Space','Time Travel'),
 ('Apocalypse','Futuro','Terror'),('Artificial Intelligence','Computer','Knowledge'),
 ('Digital World','Computer','Space'),('Robot Pilot','Robot','Hero'),
 ('Treasure','Gold','Aventura'),('Bounty','Pirate','Money'),('Adventure Guild','Aventura','Team'),
 ('Time Machine','Time Travel','Factory'),('Dark Hero','Hero','Dark Magic'),
 ('Shapeshifter','Transformation','Human'),('Dragon Spirit','Dragon','Soul'),
 ('Fire Magic','Fire','Magia'),('Ice Magic','Ice','Magia'),('Lightning Magic','Lightning','Magia'),
 ('Wind Magic','Wind','Magia'),('Water Magic','Water','Magia'),('Earth Magic','Earth','Magia'),
 ('Mystic Eye','Vision','Magia'),('Nature','Forest','Life'),
 ('Elemental Power','Energy','Nature'),
 ('Legend','History','Hero'),('Prophecy','Legend','Futuro'),('Otherworld','Fantasy Anime','Parallel World'),
 ('Isekai','Anime','Parallel World'),('Magical Girl Anime','Anime','Magic Girl'),
 ('Shonen Jump','Shonen','Manga'),('Live Action','Cinema','Human'),('Wizard','Knowledge','Magia'),
]
# Remove intentionally duplicated list entries while preserving order; seed alternate fallback for pair collisions.
for name,a,b in SEEDS:
 if name.casefold() in ref:continue
 pair_options=[(a,b)]
 # When a conflicting V17 recipe exists, use a different grounded, related medium.
 for x in ['Manga','Anime','Japan','History','Story Mode']:
  if x.casefold() in ref and x not in (a,b):pair_options.append((a,x))
 ok=False
 for x,y in pair_options:
  try:
   k=tuple(sorted((idof(x),idof(y))))
   if k in existing:continue
   add(name,'genre' if name in ['Anime','Manga','Shonen','Seinen','Isekai','Anime Film','Battle Anime','Magic Anime','Mecha Anime','Sports Anime','Fantasy Anime','Horror Anime','Magical Girl Anime'] else 'concept',x,y,icon='book',summary='Gameverse foundation for themed discoveries.');ok=True;break
  except ValueError:pass
 if not ok:raise AssertionError(('seed',name,a,b))

# Curated anime and manga encyclopedia. A cast record is (name, signature context).
# Distinct context is intentionally meaningful inside its own series; collisions never override older recipes.
ANIME=[
 ('Dragon Ball','Dragon','martial arts, Saiyans and cosmic battles',
  'Son Goku:Hero;Vegeta:Rival;Son Gohan:Family;Piccolo:Mentor;Bulma:Science;Krillin:Friend;Frieza:Villain;Trunks:Time Travel;Broly:Superpower;Beerus:God;Whis:Angel;Chi-Chi:Princesa;Master Roshi:Sensei;Cell:Artificial Intelligence;Majin Buu:Dark Magic;Goten:Martial Artist;Android 18:Robot;Yamcha:Duel;Tien Shinhan:Mystic Eye;Shenron:Dragon;Goku Black:Dark Hero;Zamasu:Curse',
  'Dragon Balls:Magia;Kamehameha:Energy;Spirit Bomb:Soul;Capsule Corporation:Technology Advanced;Flying Nimbus:Cloud;Namek:Planet;Potara Earrings:Fusion;Hyperbolic Time Chamber:Time Travel;Scouter:Vision;Dragon Radar:Radar',
  'martial'),
 ('Naruto','Ninja','shinobi and the Hidden Leaf',
  'Naruto Uzumaki:Hero;Sasuke Uchiha:Rival;Sakura Haruno:Friend;Kakashi Hatake:Mentor;Itachi Uchiha:Shadow;Hinata Hyuga:Vision;Jiraiya:Sensei;Tsunade:Science;Madara Uchiha:Villain;Obito Uchiha:Mask;Gaara:Sand;Rock Lee:Martial Arts;Shikamaru Nara:Strategy;Orochimaru:Dark Magic;Pain:Curse;Kurama:Spirit;Minato Namikaze:Tempo;Boruto Uzumaki:Family;Might Guy:Martial Artist',
  'Rasengan:Energy;Chidori:Lightning;Shadow Clone:Jutsu;Nine-Tails:Monstro;Akatsuki:Shadow;Hidden Leaf:Hidden Village;Sage Mode:Nature;Susanoo:Magia;Byakugan:Vision;Rinnegan:God',
  'ninja'),
 ('One Piece','Pirate','pirates and the Grand Line',
  'Monkey D. Luffy:Hero;Roronoa Zoro:Sword;Nami:Weather;Sanji:Fire;Usopp:Alvo;Tony Tony Chopper:Animal;Nico Robin:Knowledge;Franky:Robot;Brook:Music;Jinbe:Sea;Shanks:Mentor;Portgas D. Ace:Fire Magic;Sabo:Friend;Trafalgar Law:Science;Blackbeard:Villain;Kaido:Dragon;Big Mom:Family;Boa Hancock:Princesa;Gol D. Roger:Legend;Buggy:Comedy Film',
  'Straw Hat Pirates:Team;Thousand Sunny:Pirate Ship;Grand Line:Sea;Haki:Ki;Conqueror Haki:Superpower;Devil Fruit:Plant;Gear Second:Energy;Gear Fourth:Transformation;Gear Fifth:God;Marineford:War;Wano:Japan',
  'pirate'),
 ('Bleach','Soul','Soul Reapers and spirit worlds',
  'Ichigo Kurosaki:Hero;Rukia Kuchiki:Spirit;Orihime Inoue:Friend;Uryu Ishida:Rival;Renji Abarai:Sword;Byakuya Kuchiki:Mentor;Sosuke Aizen:Villain;Kenpachi Zaraki:Luta;Toshiro Hitsugaya:Ice;Yoruichi Shihoin:Lightning;Kisuke Urahara:Science;Yhwach:God;Grimmjow:Monstro;Ulquiorra:Shadow',
  'Soul Reaper:Hero;Zanpakuto:Sword;Bankai:Transformation;Hollow:Ghost;Soul Society:Society;Hueco Mundo:Otherworld;Getsuga Tensho:Energy;Quincy:Alvo',
  'soul'),
 ('Attack on Titan','Titan','humanity against Titans',
  'Eren Yeager:Hero;Mikasa Ackerman:Sword;Armin Arlert:Strategy;Levi Ackerman:Mentor;Erwin Smith:Leader;Hange Zoe:Science;Historia Reiss:Princesa;Reiner Braun:Rival;Annie Leonhart:Martial Arts;Zeke Yeager:Villain;Jean Kirstein:Friend;Sasha Blouse:Food;Ymir:Spirit',
  'Attack Titan:Hero;Colossal Titan:Giant;Armored Titan:Metal;Founding Titan:God;Survey Corps:Team;Wall Maria:Stone;ODM Gear:Technology Advanced;The Rumbling:Apocalypse',
  'titan'),
 ('Demon Slayer','Demon','demon hunters and breathing styles',
  'Tanjiro Kamado:Hero;Nezuko Kamado:Family;Zenitsu Agatsuma:Lightning;Inosuke Hashibira:Animal;Giyu Tomioka:Water;Kyojuro Rengoku:Fire;Shinobu Kocho:Science;Mitsuri Kanroji:Romance;Muichiro Tokito:Cloud;Sanemi Shinazugawa:Wind;Gyomei Himejima:Stone;Muzan Kibutsuji:Villain;Akaza:Luta;Doma:Ice;Kokushibo:Shadow',
  'Nichirin Blade:Sword;Water Breathing:Water;Flame Breathing:Fire;Thunder Breathing:Lightning;Sun Breathing:Light;Hashira:Team;Demon Slayer Corps:Monster Hunter;Infinity Castle:Otherworld',
  'demon'),
 ('Jujutsu Kaisen','Curse','sorcerers and cursed energy',
  'Yuji Itadori:Hero;Megumi Fushiguro:Shadow;Nobara Kugisaki:Friend;Satoru Gojo:Mentor;Ryomen Sukuna:Villain;Yuta Okkotsu:Spirit;Maki Zenin:Sword;Toji Fushiguro:Antihero;Suguru Geto:Dark Magic;Kento Nanami:Strategy;Mahito:Shapeshifter;Panda:Animal;Toge Inumaki:Language;Aoi Todo:Martial Artist',
  'Domain Expansion:Space;Cursed Technique:Magia;Six Eyes:Vision;Limitless:Space;Hollow Purple:Energy;Black Flash:Lightning;Ten Shadows:Shadow;Cursed Object:Stone',
  'sorcery'),
 ('My Hero Academia','Superhero','hero academies and Quirks',
  'Izuku Midoriya:Hero;Katsuki Bakugo:Fire;Shoto Todoroki:Ice;Ochaco Uraraka:Friend;All Might:Mentor;Tomura Shigaraki:Villain;Endeavor:Heat;Hawks:Sky;Tenya Iida:Speed;Eijiro Kirishima:Stone;Tsuyu Asui:Animal;Himiko Toga:Shapeshifter;Dabi:Dark Hero;Shota Aizawa:Shadow',
  'Quirk:Superpower;One For All:Hero;All For One:Villain;UA High School:School;Plus Ultra:Energy;Hero License:Writing;Nomu:Monstro',
  'superhero'),
 ('Pokémon','Animal','collecting and training creatures',
  'Ash Ketchum:Hero;Pikachu:Electricity;Charizard:Fire;Bulbasaur:Plant;Squirtle:Water;Mewtwo:Psychic;Mew:Magia;Eevee:Transformation;Lucario:Martial Arts;Gengar:Ghost;Snorlax:Sleep;Jigglypuff:Music;Greninja:Ninja;Arceus:God;Team Rocket:Villain;Professor Oak:Science',
  'Poké Ball:Bola;Pokédex:Knowledge;Pokémon Trainer:Hero;Gym Badge:Competition;Evolution Stone:Stone;Master Ball:Gold;Pokémon League:Tournament;Kanto:Japan',
  'monster'),
 ('Fullmetal Alchemist','Alchemist','alchemy and equivalent exchange',
  'Edward Elric:Hero;Alphonse Elric:Robot;Roy Mustang:Fire;Riza Hawkeye:Alvo;Winry Rockbell:Engineering;Scar:Antihero;King Bradley:Villain;Father:God;Maes Hughes:Friend;Lust:Romance;Envy:Shapeshifter;Greed:Money;Ling Yao:Prince;Van Hohenheim:Mentor',
  'Philosopher Stone:Stone;Equivalent Exchange:Trade;Automail:Metal;Transmutation Circle:Magia;Homunculus:Life;State Alchemist:Society',
  'alchemy'),
 ('Death Note','Notebook','supernatural detective thriller',
  'Light Yagami:Hero;L Lawliet:Detective;Ryuk:Spirit;Misa Amane:Music;Near:Knowledge;Mello:Rival;Soichiro Yagami:Family;Rem:Ghost',
  'Death Note Notebook:Notebook;Shinigami:Spirit;Kira:Villain;Death Note Rule:Regra',
  'mystery'),
 ('Neon Genesis Evangelion','Giant Robot','pilots and apocalyptic mecha',
  'Shinji Ikari:Hero;Rei Ayanami:Spirit;Asuka Langley:Rival;Misato Katsuragi:Mentor;Gendo Ikari:Villain;Kaworu Nagisa:Angel;Ritsuko Akagi:Science;Mari Makinami:Pilot',
  'Evangelion Unit-01:Robot;Evangelion Unit-02:Fire;NERV:Organization;AT Field:Energy;Second Impact:Apocalypse;Spear of Longinus:Sword',
  'mecha'),
 ('Cowboy Bebop','Space Opera','space bounty hunters and jazz',
  'Spike Spiegel:Hero;Jet Black:Mentor;Faye Valentine:Money;Edward Wong:Computer;Ein:Animal;Vicious:Villain;Julia:Romance',
  'Swordfish II:Spaceship;Bebop Spaceship:Naves;Space Bounty:Bounty;Tank! Theme:Jazz',
  'space'),
 ('One Punch Man','Superhero Team','overpowered heroes and monsters',
  'Saitama:Hero;Genos:Robot;King:Fun;Tatsumaki:Psychic;Fubuki:Wind;Garou:Rival;Bang:Mentor;Boros:Alien;Mumen Rider:Desporto',
  'Serious Punch:Superpower;Hero Association:Society;Monster Association:Monstro;One Punch:Martial Arts',
  'superhero'),
 ('Chainsaw Man','Demon Slayer','devils and demon hunters',
  'Denji:Hero;Power:Blood;Aki Hayakawa:Sword;Makima:Villain;Pochita:Animal;Kobeni Higashiyama:Friend;Kishibe:Mentor;Reze:Fire;Himeno:Ghost',
  'Chainsaw Devil:Sword;Blood Devil:Life;Public Safety:Society;Devil Contract:Regra',
  'horror'),
 ('Spy x Family','Family','spies and found families',
  'Loid Forger:Stealth;Yor Forger:Assassin;Anya Forger:Psychic;Bond Forger:Animal;Damian Desmond:Rival;Becky Blackbell:Friend;Franky Franklin:Technology Advanced',
  'Operation Strix:Strategy;Eden Academy:School;Secret Identity:Mask;Telepathy:Psychic',
  'spy'),
 ('JoJo Bizarre Adventure','Superpower','family sagas and Stand battles',
  'Jonathan Joestar:Hero;Joseph Joestar:Strategy;Jotaro Kujo:Mentor;Josuke Higashikata:Family;Giorno Giovanna:Gold;Jolyne Cujoh:Thread;Dio Brando:Villain;Kars:God;Yoshikage Kira:Shadow;Diavolo:Tempo',
  'Stand Power:Spirit;Star Platinum:Power Level;The World:Tempo;Stone Mask:Mask;Hamon:Sol;Golden Experience:Life',
  'fantasy'),
 ('Hunter x Hunter','Adventure Guild','hunters and Nen abilities',
  'Gon Freecss:Hero;Killua Zoldyck:Lightning;Kurapika:Rival;Leorio Paradinight:Friend;Hisoka:Villain;Chrollo Lucilfer:Shadow;Meruem:Monstro;Isaac Netero:Mentor;Biscuit Krueger:Martial Arts;Alluka Zoldyck:Family',
  'Nen:Ki;Hunter Exam:Tournament;Greed Island:Game;Phantom Troupe:Team;Chimera Ant:Animal',
  'fantasy'),
 ('Sailor Moon','Magic Girl','magical girl guardians',
  'Usagi Tsukino:Hero;Sailor Mercury:Water;Sailor Mars:Fire;Sailor Jupiter:Lightning;Sailor Venus:Light;Sailor Saturn:Shadow;Sailor Uranus:Wind;Sailor Neptune:Sea;Sailor Pluto:Tempo;Tuxedo Mask:Romance;Luna:Animal;Queen Beryl:Villain',
  'Moon Prism:Moon;Silver Crystal:Crystal;Sailor Guardians:Team;Moon Kingdom:History',
  'magic'),
 ('Haikyuu!!','Sports Anime','volleyball competition',
  'Shoyo Hinata:Hero;Tobio Kageyama:Rival;Daichi Sawamura:Leader;Kosuke Sugawara:Friend;Kei Tsukishima:Strategy;Yu Nishinoya:Speed;Toru Oikawa:Villain;Wakatoshi Ushijima:Power Level',
  'Karasuno High:School;Volleyball:Desporto;Quick Attack:Speed;Nationals:Tournament',
  'sports'),
 ('Blue Lock','Futebol','football competition and ego',
  'Yoichi Isagi:Hero;Meguru Bachira:Friend;Rin Itoshi:Rival;Seishiro Nagi:Sleep;Hyoma Chigiri:Speed;Shoei Baro:Prince;Jinpachi Ego:Mentor;Reo Mikage:Money',
  'Blue Lock Facility:School;Striker:Desporto;Egoist:Antihero;World Cup:Competition',
  'sports'),
 ('Berserk','Dark Fantasy','dark medieval fantasy',
  'Guts:Hero;Griffith:Villain;Casca:Sword;Skull Knight:Ghost;Puck:Spirit;Farnese:Friend;Serpico:Shadow;Schierke:Witch;Zodd:Demon',
  'Dragon Slayer Sword:Sword;Behelit:Stone;Berserker Armor:Metal;Band of the Hawk:Team;Brand of Sacrifice:Curse',
  'fantasy'),
 ('Frieren Beyond Journeys End','Fantasy Anime','fantasy travel after the adventure',
  'Frieren:Witch;Fern:Friend;Stark:Sword;Himmel:Hero;Heiter:Mentor;Eisen:Metal;Serie:God;Aura:Villain',
  'Grimoire:Book;Mana:Energy;Hero Party:Team;Spell Collection:Knowledge',
  'fantasy'),
 ('Vinland Saga','History','Vikings and historical adventure',
  'Thorfinn:Hero;Askeladd:Mentor;Thors:Sword;Canute:Prince;Thorkell:Giant;Einar:Friend;Floki:Villain',
  'Viking Ship:Pirate Ship;Vinland:Land;Jomsvikings:Team;Pacifism:Regra',
  'history'),
 ('Solo Leveling','RPG','a hunter who grows stronger',
  'Sung Jinwoo:Hero;Cha Hae-in:Sword;Yoo Jinho:Friend;Igris:Spirit;Beru:Animal;Ashborn:Shadow;Antares:Dragon',
  'Shadow Monarch:Shadow;Dungeon Gate:Cave;Hunter Rank:Level;System Quest:Story Mode;Shadow Army:Team',
  'fantasy'),
 ('Dragon Ball Super','Dragon Ball','god transformations and multiverse battles',
  'Grand Zeno:God;Jiren:Rival;Hit:Tempo;Caulifla:Super Saiyan;Kale:Power Level;Cabba:Saiyan;Toppo:Justice;Vados:Angel',
  'Tournament of Power:Tournament;Universe 7:Space;Super Dragon Balls:Dragon Balls;God of Destruction:God',
  'martial'),
 ('Boruto','Naruto','next-generation shinobi stories',
  'Sarada Uchiha:Sharingan;Mitsuki:Science;Kawaki:Rival;Momoshiki Otsutsuki:Alien;Kashin Koji:Sensei;Code:Villain',
  'Karma Seal:Curse;Otsutsuki Clan:Alien;Scientific Ninja Tool:Technology Advanced',
  'ninja'),
 ('Dragon Ball GT','Dragon Ball','later alternate Dragon Ball television continuity',
  'Pan:Family;Baby:Villain;Super Saiyan 4 Goku:Transformation;Omega Shenron:Dragon;Uub:Martial Arts',
  'Black Star Dragon Balls:Dragon Balls;Shadow Dragons:Shadow;Super Saiyan 4:Super Saiyan',
  'martial'),
]
# Foundation tokens needed for series casts (series-specific traits deliberately use stable, accessible concepts).
EXTRA_TOKENS={
 'Planet':('Earth','Sky'),'Radar':('Radio','Vision'),'Weather':('Cloud','Wind'),'War':('History','Luta'),
 'Leader':('Hero','Society'),'Food':('Plant','Human'),'Speed':('Movimento','Time'),
 'Sleep':('Human','Noite'),'School':('Knowledge','House'),'Organization':('Team','Society'),
 'Pilot':('Spaceship','Human'),'Blood':('Life','Fire'),'Assassin':('Stealth','Villain'),
 'Thread':('Material digital','Wire'),'Moon':('Sky','Noite'),'Land':('Earth','Continent'),
 'Justice':('Regra','Hero'),'Dragon Balls':('Dragon Ball','Magia') if False else ('Dragon','Magia'),
 'Dark Fantasy':('Fantasia','Shadow'),'Friendship':('Amizade','Team'),
}
for name,(a,b) in EXTRA_TOKENS.items():
 if name.casefold() in ref:continue
 # Some tokens use concepts defined before their source series, avoid cycles.
 for x,y in [(a,b),(a,'Manga'),(a,'Anime')]:
  if x.casefold() in ref and y.casefold() in ref and tuple(sorted((idof(x),idof(y)))) not in existing:
   add(name,'concept',x,y,icon='book');break
 else:raise AssertionError(('extra-token',name,a,b))

# Establish title seeds via thematic trigger. 'Anime + trigger' is a discovery association, not a claim about authorship.
# Some names have multiple editions, so order and fallback catalysts give each an unambiguous craft path.
for title,theme,_,_,_,_ in ANIME:
 for a in ['Manga','Anime','Shonen','Japan','Battle Anime','Fantasy Anime']:
  if a.casefold() not in ref or theme.casefold() not in ref:continue
  if tuple(sorted((idof(a),idof(theme)))) not in existing:
   add(title,'anime',a,theme,icon='film',summary=f'Anime/manga title: {title}.');break
 else:raise AssertionError(('title',title,theme))

# Each cast member is associated with an explicit descriptor within its series.
# Alternative recipes use related lore and identity redundancies, never random token stacking.
for title,theme,summary,cast,objects,branch in ANIME:
 roles=set()
 for raw in cast.split(';'):
  name,role=raw.split(':',1)
  if role.casefold() not in ref:raise AssertionError(('role',title,name,role))
  if name.casefold() in ref:continue
  seeds=[(title,role)]
  # A second route uses franchise lore + category when the main route is already occupied.
  for x in ['Shonen','Anime','Manga',theme,'Hero','Character','Japan']:
   if x.casefold() in ref and x.casefold()!=role.casefold():seeds.append((x,role))
  for x,y in seeds:
   if tuple(sorted((idof(x),idof(y)))) not in existing:
    add(name,'character',x,y,icon=ROLE_ICONS.get(role,'actor'),summary=f'Character associated with {title}.',source=title)
    break
  else:raise AssertionError(('cast-seed',title,name,role))
  # Two distinct lore-signpost recipes: both are consistent identity reinforcements.
  for a,b in [(name,title),(name,'Anime'),(name,'Manga'),(name,role)]:addrecipe(a,b,name,'identity')
  # Alternate discovery path where series + a different descriptor points to the same character.
  # Prefer a relation like hero/main cast; never displace any competing role.
  if role not in ('Hero','Villain'):
   for attr in ('Character','Hero','Team'):
    if attr.casefold() in ref and attr.casefold()!=role.casefold():
     if addrecipe(name,attr,name,'character context'):break
 # Series artefacts. Terms named as unique entities have a meaningful series relationship.
 for raw in objects.split(';'):
  name,role=raw.split(':',1)
  if role.casefold() not in ref:raise AssertionError(('artefact-role',title,name,role))
  if name.casefold() not in ref:
   ok=False
   for a,b in [(title,role),(theme,role),('Manga',role),('Anime',role)]:
    if tuple(sorted((idof(a),idof(b)))) not in existing:
     add(name,'object' if role not in ('Energy','Superpower') else 'power',a,b,icon='energy' if role in ('Energy','Superpower') else 'book',summary=f'Concept, place, item or ability associated with {title}.',source=title);ok=True;break
   if not ok:raise AssertionError(('item-seed',title,name,role))
  for a,b in [(name,title),(name,'Anime'),(name,'Manga'),(name,role)]:addrecipe(a,b,name,'identity')

# Precisely curated transformation and relationship graph in popular anime worlds.
SPECIAL_RECIPES='''
Dragon Ball + Power Level = Ki
Dragon Ball + Super Saiyan = Super Saiyan Goku
Son Goku + Super Saiyan = Super Saiyan Goku
Super Saiyan Goku + Power Level = Super Saiyan 2 Goku
Super Saiyan 2 Goku + Power Level = Super Saiyan 3 Goku
Son Goku + God Ki = Super Saiyan God Goku
Super Saiyan Goku + God Ki = Super Saiyan God Goku
Super Saiyan God Goku + God Ki = Super Saiyan Blue Goku
Super Saiyan God Goku + Ki = Super Saiyan Blue Goku
Son Goku + Ultra Instinct = Ultra Instinct Goku
Vegeta + Super Saiyan = Super Saiyan Vegeta
Super Saiyan Vegeta + God Ki = Super Saiyan God Vegeta
Super Saiyan God Vegeta + Ki = Super Saiyan Blue Vegeta
Super Saiyan Blue Vegeta + Superpower = Super Saiyan Blue Evolution Vegeta
Son Gohan + Super Saiyan = Super Saiyan Gohan
Son Gohan + Power Level = Gohan Beast
Piccolo + Superpower = Orange Piccolo
Goku Black + Super Saiyan = Super Saiyan Rosé Goku Black
Goku Black + God Ki = Super Saiyan Rosé Goku Black
Son Goku + Vegeta = Gogeta
Son Goku + Fusion = Gogeta
Vegeta + Fusion = Vegito
Gogeta + Super Saiyan = Super Saiyan Gogeta
Gogeta + God Ki = Super Saiyan Blue Gogeta
Vegito + God Ki = Super Saiyan Blue Vegito
Broly + Super Saiyan = Legendary Super Saiyan Broly
Dragon Ball + Saiyan = Son Goku
Dragon Ball Super + Tournament = Tournament of Power
Dragon Ball Super + Son Goku = Ultra Instinct Goku
Dragon Ball GT + Son Goku = Super Saiyan 4 Goku
Naruto Uzumaki + Kurama = Nine-Tails Chakra Mode
Naruto Uzumaki + Sage Mode = Sage Mode Naruto
Naruto Uzumaki + Rasengan = Rasenshuriken
Naruto Uzumaki + Shadow Clone = Shadow Clone Jutsu
Sasuke Uchiha + Sharingan = Mangekyō Sharingan Sasuke
Sasuke Uchiha + Chidori = Chidori Sasuke
Sasuke Uchiha + Susanoo = Sasuke Susanoo
Itachi Uchiha + Sharingan = Mangekyō Sharingan Itachi
Naruto Uzumaki + Six Paths Power = Six Paths Naruto
Sasuke Uchiha + Six Paths Power = Rinnegan Sasuke
Naruto + Hokage = Seventh Hokage Naruto
Monkey D. Luffy + Gear Second = Gear Second Luffy
Monkey D. Luffy + Gear Fourth = Gear Fourth Luffy
Monkey D. Luffy + Gear Fifth = Gear Fifth Luffy
Monkey D. Luffy + Haki = Haki Luffy
Roronoa Zoro + Sword = Three-Sword Style
Sanji + Fire = Diable Jambe
Tony Tony Chopper + Transformation = Monster Point Chopper
Ichigo Kurosaki + Bankai = Bankai Ichigo
Ichigo Kurosaki + Hollow = Hollow Ichigo
Eren Yeager + Attack Titan = Attack Titan Eren
Eren Yeager + Founding Titan = Founding Titan Eren
Levi Ackerman + Sword = ODM Blade Levi
Tanjiro Kamado + Water Breathing = Water Breathing Tanjiro
Tanjiro Kamado + Sun Breathing = Hinokami Kagura
Zenitsu Agatsuma + Thunder Breathing = Thunderclap and Flash
Satoru Gojo + Domain Expansion = Unlimited Void
Ryomen Sukuna + Domain Expansion = Malevolent Shrine
Megumi Fushiguro + Ten Shadows = Ten Shadows Technique
Izuku Midoriya + One For All = One For All Deku
Shoto Todoroki + Fire = Half-Cold Half-Hot
Eevee + Water = Vaporeon
Eevee + Fire = Flareon
Eevee + Lightning = Jolteon
Eevee + Ice = Glaceon
Eevee + Psychic = Espeon
Eevee + Shadow = Umbreon
Eevee + Plant = Leafeon
Eevee + Magic Girl = Sylveon
Pikachu + Evolution Stone = Raichu
Charmander + Fire = Charmeleon
Charmeleon + Evolution Stone = Charizard
Bulbasaur + Plant = Ivysaur
Ivysaur + Evolution Stone = Venusaur
Squirtle + Water = Wartortle
Wartortle + Evolution Stone = Blastoise
Edward Elric + Philosopher Stone = Human Transmutation
Alphonse Elric + Automail = Armored Alphonse
Light Yagami + Death Note Notebook = Kira
Shinji Ikari + Evangelion Unit-01 = Eva-01 Pilot Shinji
Saitama + Serious Punch = Serious Series Saitama
Denji + Chainsaw Devil = Chainsaw Man Denji
Usagi Tsukino + Moon Prism = Sailor Moon Transformation
Jotaro Kujo + Star Platinum = Star Platinum Jotaro
Dio Brando + The World = The World DIO
Gon Freecss + Nen = Jajanken
Killua Zoldyck + Nen = Godspeed Killua
Frieren + Grimoire = Frieren the Mage
Sung Jinwoo + Shadow Monarch = Shadow Monarch Jinwoo
'''
# Extra readable concepts referenced above that need to be introduced in a way that is reachable.
for name,a,b in [
 ('Six Paths Power','Hokage','God Ki'),('Mangekyō Sharingan','Sharingan','Superpower'),
 ('Charmander','Pokémon','Fire Magic'),('Vaporeon','Eevee','Water'), # first fallback duplicate handled below
]:
 if name.casefold() not in ref:
  for x,y in [(a,b),(a,'Anime'),(a,'Manga')]:
   if x.casefold() in ref and y.casefold() in ref and tuple(sorted((idof(x),idof(y)))) not in existing:
    add(name,'power' if 'Power' in name or 'Sharingan' in name else 'character',x,y);break

for line in SPECIAL_RECIPES.strip().splitlines():
 left,right=line.split(' = ');a,b=[x.strip() for x in left.split(' + ',1)];out=right.strip()
 if a.casefold() not in ref or b.casefold() not in ref:raise AssertionError(('special operand',line))
 if out.casefold() not in ref:
  if tuple(sorted((idof(a),idof(b)))) in existing:
   # Offer further alternatives if original legacy or curated pair has priority.
   for alt in ['Anime','Manga','Shonen','Superpower']:
    if alt.casefold() in ref and tuple(sorted((idof(a),idof(alt)))) not in existing:
     add(out,'character' if any(z in out for z in ['Goku','Vegeta','Luffy','Sasuke','Naruto','Deku','Piccolo','Gohan','Gogeta','Vegito']) else 'power',a,alt,icon='actor',summary='Recognizable fictional form or signature ability.');break
   else:raise AssertionError(('special cannot seed',line))
  else:add(out,'character' if any(z in out for z in ['Goku','Vegeta','Luffy','Sasuke','Naruto','Deku','Piccolo','Gohan','Gogeta','Vegito']) else 'power',a,b,icon='actor',summary='Recognizable fictional form or signature ability.')
 else:addrecipe(a,b,out,'transformation')

# Film and television: each franchise is seeded with a thematic catalyst and each named character
# with a franchise+role connection. Famous film entities use a shared cartoon icon family.
FILMS=[
 ('Star Wars','Space Opera','Luke Skywalker:Hero;Darth Vader:Villain;Leia Organa:Princesa;Han Solo:Pirate;Obi-Wan Kenobi:Mentor;Yoda:Sensei;Chewbacca:Animal;R2-D2:Robot;C-3PO:Language;Rey:Magia;Kylo Ren:Dark Hero;Palpatine:God;Boba Fett:Bounty;Ahsoka Tano:Sword;Mandalorian:Masked Hero','Lightsaber:Sword;The Force:Energy;Jedi Order:Team;Sith:Villain;Death Star:Moon;Millennium Falcon:Spaceship;Tatooine:Sand;Hyperspace:Space;X-Wing:Spaceship'),
 ('Harry Potter','Wizard','Harry Potter:Hero;Hermione Granger:Knowledge;Ron Weasley:Friend;Albus Dumbledore:Mentor;Lord Voldemort:Villain;Severus Snape:Antihero;Draco Malfoy:Rival;Rubeus Hagrid:Giant;Luna Lovegood:Vision;Sirius Black:Shadow;Bellatrix Lestrange:Dark Magic;Dobby:Spirit','Hogwarts:School;Sorting Hat:Mask;Elder Wand:Sacred Sword;Horcrux:Curse;Patronus:Spirit;Quidditch:Desporto;Golden Snitch:Gold;Deathly Hallows:Legend'),
 ('The Lord of the Rings','Fantasy Film','Frodo Baggins:Hero;Samwise Gamgee:Friend;Gandalf:Mentor;Aragorn:Prince;Legolas:Alvo;Gimli:Metal;Gollum:Shadow;Sauron:Villain;Saruman:Dark Magic;Galadriel:God;Boromir:Sword;Bilbo Baggins:Adventure Guild','One Ring:Gold;Mordor:Fire;Middle-earth:Earth;Rivendell:Forest;Mithril:Metal;Mount Doom:Mountain;Fellowship of the Ring:Team;Palantír:Mystic Eye'),
 ('The Matrix','Digital World','Neo:Hero;Trinity:Friend;Morpheus:Mentor;Agent Smith:Villain;The Oracle:Prophecy;Niobe:Strategy;The Architect:Artificial Intelligence;Merovingian:Money','Red Pill:Choice;Blue Pill:Sleep;Bullet Time:Tempo;Zion:City;Simulation:Computer;Matrix Code:Code'),
 ('Jurassic Park','Fossil','Alan Grant:Science;Ellie Sattler:Plant;Ian Malcolm:Mathematics;John Hammond:Money;Robert Muldoon:Hunter;Dennis Nedry:Computer','Tyrannosaurus Rex:Dragon;Velociraptor:Animal;Isla Nublar:Island;Amber DNA:Fossil;Dinosaur Egg:Life;Dinosaur Park:Tourism'),
 ('Back to the Future','Time Machine','Marty McFly:Hero;Doc Brown:Science;Biff Tannen:Villain;Jennifer Parker:Romance;George McFly:Family;Lorraine Baines:Friend','DeLorean Time Machine:Car;Flux Capacitor:Energy;Hill Valley:City;Hoverboard:Portabilidade;Future Almanac:Book'),
 ('The Avengers','Superhero Film','Iron Man:Metal;Captain America:Hero;Thor:God;Hulk:Superpower;Black Widow:Stealth;Hawkeye:Alvo;Loki:Villain;Nick Fury:Leader;Doctor Strange:Magia;Scarlet Witch:Witch;Black Panther:Animal;Ant-Man:Miniaturization;Spider-Man:Animal','Infinity Stones:Crystal;Mjolnir:Hammer;Arc Reactor:Energy;SHIELD:Organization;Avengers Tower:City;Multiverse:Parallel World'),
 ('Batman','Comic Book','Bruce Wayne:Hero;Joker:Villain;Alfred Pennyworth:Mentor;Robin:Friend;Catwoman:Antihero;Harley Quinn:Comedy Film;Bane:Superpower;Riddler:Puzzle;Penguin:Animal;Two-Face:Mask','Batmobile:Car;Batcave:Cave;Gotham City:City;Batsuit:Metal;Bat-Signal:Light'),
 ('Superman','Superhero','Clark Kent:Hero;Lois Lane:Writing;Lex Luthor:Villain;General Zod:Alien;Supergirl:Family;Krypto:Animal;Jimmy Olsen:Friend','Krypton:Planet;Kryptonite:Crystal;Fortress of Solitude:Ice;Daily Planet:Writing;Heat Vision:Heat'),
 ('Spider-Man','Superhero Team','Peter Parker:Hero;Mary Jane Watson:Romance;Aunt May:Family;Green Goblin:Villain;Doctor Octopus:Robot;Venom:Shadow;Miles Morales:Rival;Gwen Stacy:Friend;J. Jonah Jameson:Writing','Web Shooter:Tool;Spider Sense:Vision;Symbiote Suit:Alien;Daily Bugle:Writing;Oscorp:Factory'),
 ('Ghostbusters','Ghost','Peter Venkman:Hero;Ray Stantz:Science;Egon Spengler:Knowledge;Winston Zeddemore:Friend;Dana Barrett:Romance;Slimer:Monstro','Proton Pack:Energy;Ghost Trap:Tool;Ecto-1:Car;Stay Puft Marshmallow Man:Giant'),
 ('Pirates of the Caribbean','Pirate Ship','Jack Sparrow:Pirate;Will Turner:Sword;Elizabeth Swann:Princesa;Davy Jones:Ghost;Hector Barbossa:Rival;Cutler Beckett:Villain;Tia Dalma:Witch','Black Pearl:Pirate Ship;Flying Dutchman:Ghost;Aztec Gold:Gold;Dead Man Chest:Treasure'),
 ('Indiana Jones','Treasure','Indiana Jones:Hero;Marion Ravenwood:Friend;Henry Jones Sr.:Mentor;Short Round:Family;Belloq:Villain','Ark of the Covenant:Legend;Holy Grail:Crystal;Lost Temple:Cave;Golden Idol:Gold'),
 ('Toy Story','Brinquedo','Woody:Hero;Buzz Lightyear:Space;Jessie:Friend;Rex:Animal;Bo Peep:Romance;Lotso:Villain','Andy Room:House;Claw Machine:Arcade;Toy Rocket:Naves'),
 ('The Lion King','Animal','Simba:Hero;Mufasa:Mentor;Scar:Villain;Nala:Friend;Timon:Comedy Film;Pumbaa:Food;Rafiki:Sensei','Pride Rock:Mountain;Circle of Life:Life;Hakuna Matata:Song'),
 ('Frozen','Ice','Elsa:Witch;Anna:Princesa;Olaf:Snow;Kristoff:Friend;Sven:Animal;Hans:Villain','Arendelle:Village;Let It Go:Song;Ice Palace:Ice'),
 ('Stranger Things','TV Series','Eleven:Psychic;Mike Wheeler:Hero;Dustin Henderson:Science;Lucas Sinclair:Friend;Will Byers:Ghost;Max Mayfield:Rival;Jim Hopper:Mentor;Vecna:Villain;Steve Harrington:Sword','Upside Down:Otherworld;Demogorgon:Monstro;Hawkins:City;Mind Flayer:Shadow'),
 ('Breaking Bad','TV Series','Walter White:Science;Jesse Pinkman:Friend;Saul Goodman:Money;Gus Fring:Villain;Hank Schrader:Detective;Skyler White:Family','Los Pollos Hermanos:Shop;Heisenberg:Antihero;RV Laboratory:Factory'),
 ('Doctor Who','Time Travel','The Doctor:Hero;Dalek:Robot;Cyberman:Artificial Intelligence;The Master:Villain;Rose Tyler:Friend;Donna Noble:Human;River Song:Tempo','TARDIS:Time Machine;Sonic Screwdriver:Tool;Gallifrey:Planet;Regeneration:Transformation'),
 ('Wednesday','Horror Film','Wednesday Addams:Hero;Enid Sinclair:Friend;Thing:Hand;Morticia Addams:Family;Gomez Addams:Romance;Tyler Galpin:Villain','Nevermore Academy:School;Addams Family:Family;Raven Vision:Vision'),
]
FILM_EXTRA={'Choice':('Rival','Regra'),'Hunter':('Animal','Hero'),'Island':('Sea','Earth'),'Tourism':('Aventura','Money'),'Car':('Wheel','Motor') if False else ('Wheel','Fuel'),'Hammer':('Metal','Tool'),'Hand':('Human','Button')}
for name,(a,b) in FILM_EXTRA.items():
 if name.casefold() in ref:continue
 for x,y in [(a,b),(a,'Cinema'),(a,'History')]:
  if x.casefold() in ref and y.casefold() in ref and tuple(sorted((idof(x),idof(y)))) not in existing:
   add(name,'concept',x,y);break
 else:raise AssertionError(('film token',name))
for title,theme,cast,objects in FILMS:
 if title.casefold() not in ref:
  for a in ('Cinema','Film Score','TV Series','Science Fiction Film','Fantasy Film','Horror Film','Mystery Film'):
   if tuple(sorted((idof(a),idof(theme)))) not in existing:
    add(title,'film',a,theme,icon='film',summary=f'Film or television franchise: {title}.');break
  else:raise AssertionError(('film seed',title))
 for raw in (cast+';'+objects).split(';'):
  name,role=raw.split(':',1)
  if role.casefold() not in ref:raise AssertionError(('film role',title,name,role))
  if name.casefold() not in ref:
   for a,b in [(title,role),('Cinema',role),('Film Score',role),('TV Series',role)]:
    if tuple(sorted((idof(a),idof(b)))) not in existing:
     add(name,'character' if raw in cast.split(';') else 'object',a,b,icon=ROLE_ICONS.get(role,'actor') if raw in cast.split(';') else ROLE_ICONS.get(role,'book'),summary=f'Film/series character, object, or setting associated with {title}.');break
   else:raise AssertionError(('film cast-seed',title,name))
  for a,b in [(name,title),(name,'Cinema'),(name,'TV Series'),(name,role)]:addrecipe(a,b,name,'cinema context')

MUSIC=[
 ('Rock','Rock Music','Queen:Band;The Beatles:History;David Bowie:Space;Elvis Presley:Hero;AC/DC:Electricity;Led Zeppelin:Legend;Nirvana:Shadow;Foo Fighters:Team;The Rolling Stones:Stone;Pink Floyd:Cor;Radiohead:Radio;Fleetwood Mac:Sea'),
 ('Pop','Pop Music','Michael Jackson:Moon;Madonna:Hero;Taylor Swift:Story Mode;Lady Gaga:Mask;Ariana Grande:Voice;Beyoncé:Princesa;Britney Spears:Star;Katy Perry:Fire;Dua Lipa:Dance Game;The Weeknd:Noite;Billie Eilish:Shadow'),
 ('Electronic','Electronic Music','Daft Punk:Robot;Deadmau5:Mouse;The Chemical Brothers:Science;Kraftwerk:Factory;Avicii:Light;Skrillex:Energy;Jean-Michel Jarre:Space;Justice:Regra'),
 ('Hip Hop','Hip Hop','Eminem:Writing;Kendrick Lamar:Knowledge;Tupac Shakur:History;The Notorious B.I.G.:Legend;Dr. Dre:Science;Snoop Dogg:Animal;Jay-Z:Money;Missy Elliott:Innovation'),
 ('Jazz','Jazz','Miles Davis:Trumpet;John Coltrane:Saxophone;Ella Fitzgerald:Singer;Louis Armstrong:History;Duke Ellington:Orchestra;Nina Simone:Piano;Herbie Hancock:Electricity'),
 ('Classical','Orchestra','Ludwig van Beethoven:Piano;Wolfgang Amadeus Mozart:Knowledge;Johann Sebastian Bach:History;Antonio Vivaldi:Seasons;Frédéric Chopin:Romance;Pyotr Ilyich Tchaikovsky:Ballet;Hans Zimmer:Film Score;John Williams:Cinema'),
 ('Metal Music','Rock Music','Metallica:Metal;Iron Maiden:History;Black Sabbath:Shadow;System of a Down:Strategy;Rammstein:Fire;Nightwish:Fantasy Anime;Slipknot:Mask'),
 ('Gaming Soundtracks','OST','Koji Kondo:Nintendo;Nobuo Uematsu:JRPG;Yoko Shimomura:Kingdom Hearts;Akira Yamaoka:Terror;Mick Gordon:FPS;Toby Fox:Indie Game;Jesper Kyd:Stealth'),
]
MUSIC_TOKENS={'Band':('Team','Music'),'Voice':('Singer','Sound'),'Star':('Sky','Light'),'Mouse':('Animal','Computer'),'Innovation':('Invention','Computer'),'Trumpet':('Music','Metal'),'Saxophone':('Music','Wire'),'Piano':('Music','Button'),'Seasons':('Clock','Nature'),'Ballet':('Music','Teatro'),'Dance':('Music','Dance Game')}
for name,(a,b) in MUSIC_TOKENS.items():
 if name.casefold() not in ref:
  for x,y in [(a,b),(a,'Manga'),(a,'Japan')]:
   if x.casefold() in ref and y.casefold() in ref and tuple(sorted((idof(x),idof(y)))) not in existing:
    add(name,'music' if name in ('Band','Piano','Trumpet','Saxophone','Ballet') else 'concept',x,y);break
  else:raise AssertionError(('music token',name))
for genre,seed,people in MUSIC:
 if genre.casefold() not in ref:
  for a in ('Music','Album','Song'):
   if tuple(sorted((idof(a),idof(seed)))) not in existing:
    add(genre,'music',a,seed,icon='music',summary=f'Music genre: {genre}.');break
  else:raise AssertionError(('music seed',genre))
 for raw in people.split(';'):
  name,role=raw.split(':',1)
  if role.casefold() not in ref:raise AssertionError(('music role',genre,name,role))
  if name.casefold() not in ref:
   for a,b in [(genre,role),(seed,role),('Musician',role),('Singer',role)]:
    if tuple(sorted((idof(a),idof(b)))) not in existing:
     add(name,'music',a,b,icon='music',summary=f'Musician or group associated with {genre}.');break
   else:raise AssertionError(('music artist',genre,name))
  for a,b in [(name,'Music'),(name,genre),(name,'Album'),(name,role)]:addrecipe(a,b,name,'musical context')

# Cross-media creations; game-related names overlap intentionally with the large legacy library.
CROSS='''
Dragon Ball + Video Game = Dragon Ball Game
Naruto + Video Game = Naruto Game
One Piece + Video Game = One Piece Game
Pokémon + Video Game = Pokémon Game
Bleach + Video Game = Bleach Game
Demon Slayer + Video Game = Demon Slayer Game
Jujutsu Kaisen + Video Game = Jujutsu Kaisen Game
Attack on Titan + Video Game = Attack on Titan Game
Dragon Ball + Film Score = Dragon Ball Soundtrack
Naruto + Music = Naruto Soundtrack
One Piece + Music = One Piece Soundtrack
Pokémon + Film Score = Pokémon Soundtrack
Dragon Ball + Comic Book = Dragon Ball Manga
Naruto + Comic Book = Naruto Manga
One Piece + Comic Book = One Piece Manga
Demon Slayer + Comic Book = Demon Slayer Manga
Star Wars + Video Game = Star Wars Game
The Matrix + Video Game = Matrix Video Game
Harry Potter + Video Game = Harry Potter Game
The Lord of the Rings + Video Game = Middle-earth Game
One Piece + Pirate Ship = Thousand Sunny
Star Wars + Sword = Lightsaber
Harry Potter + Magia = Hogwarts
The Matrix + Artificial Intelligence = Agent Smith
The Lord of the Rings + Gold = One Ring
Batman + Car = Batmobile
Spider-Man + Tool = Web Shooter
Pokémon + Bola = Poké Ball
Daft Punk + Robot = Daft Punk
Koji Kondo + Nintendo = Koji Kondo
John Williams + Star Wars = Star Wars Soundtrack
Hans Zimmer + Science Fiction Film = Film Score
'''
for line in CROSS.strip().splitlines():
 left,out=line.split(' = ');a,b=left.split(' + ',1)
 if a.casefold() not in ref or b.casefold() not in ref:continue
 if out.casefold() not in ref:
  if tuple(sorted((idof(a),idof(b)))) not in existing:add(out,'game' if 'Game' in out else 'music',a,b,icon='game')
 else:addrecipe(a,b,out,'cross-media')

# Canonical crossover routes for ensembles and casts. Combining two people from the same
# fictional universe points to the series (not a made-up person); original fixed lore
# transformations such as Goku+Vegeta=>Gogeta always retain priority.
for title,theme,_,cast,objects,_ in ANIME:
 names=[x.split(':',1)[0] for x in cast.split(';') if x.split(':',1)[0].casefold() in ref]
 for i,name in enumerate(names):
  for delta in (1,2,3):
   if i+delta<len(names):addrecipe(name,names[i+delta],title,'related cast')
for title,theme,cast,objects in FILMS:
 names=[x.split(':',1)[0] for x in cast.split(';') if x.split(':',1)[0].casefold() in ref]
 for i,name in enumerate(names):
  for delta in (1,2,3):
   if i+delta<len(names):addrecipe(name,names[i+delta],title,'film ensemble')
for genre,seed,people in MUSIC:
 names=[x.split(':',1)[0] for x in people.split(';') if x.split(':',1)[0].casefold() in ref]
 for i,name in enumerate(names):
  for delta in (1,2):
   if i+delta<len(names):addrecipe(name,names[i+delta],genre,'musical genre association')

# Combine a real relationship map with genuine alternative paths. Every identity reinforcement means
# (specific named entity + its known medium, franchise, or category) -> the same identity; never new text.
# Sibling characters do not generate a fabricated character or unsupported lore.
for title,theme,summary,cast,objects,branch in ANIME:
 addrecipe(title,'Anime',title,'franchise recognition');addrecipe(title,'Manga',title,'franchise recognition')
 addrecipe(title,theme,title,'franchise recognition')
for title,theme,cast,objects in FILMS:
 addrecipe(title,'Cinema',title,'franchise recognition');addrecipe(title,theme,title,'franchise recognition')
for genre,seed,people in MUSIC:
 addrecipe(genre,'Music',genre,'genre recognition');addrecipe(genre,seed,genre,'genre recognition')

# Semantic identity routes for previously curated elements, still preserving all legacy recipes.
# These improve recipe density but are intentionally limited to concepts with named categories.
for it in old['items']:
 name=it['name'];category=it['category']
 for marker in ['Manga','Anime'] if category=='fantasy' else ['Video Game'] if category=='arcade' else ['Technology Advanced'] if category=='technology' else ['Game'] if category=='game' else ['Fantasy Anime']:
  addrecipe(name,marker,name,'legacy pack thematic identity')

# Meaningful additional thematic bonds: within a franchise a character + its signature mechanic
# reinforces identity; each pair is unique, never a made-up output.
for title,theme,summary,cast,objects,branch in ANIME:
 names=[x.split(':',1)[0] for x in cast.split(';')]
 for idx,name in enumerate(names):
  if name.casefold() not in ref:continue
  for marker in [theme,'Anime','Manga','Shonen','Hero','Character','Battle Anime']:
   if marker.casefold() in ref:addrecipe(name,marker,name,'franchise context')
for title,theme,cast,objects in FILMS:
 for raw in cast.split(';'):
  name,role=raw.split(':',1)
  for marker in [theme,'Cinema','Film Score','Actor','Story Mode','Live Action','Hero']:
   if marker.casefold() in ref:addrecipe(name,marker,name,'screen character context')
for genre,seed,people in MUSIC:
 for raw in people.split(';'):
  name,role=raw.split(':',1)
  for marker in [seed,'Music','Musician','Album','Song','Singer','Orchestra']:
   if marker.casefold() in ref:addrecipe(name,marker,name,'artist recognition')

# Further specific contextual recipes that all converge onto existing named discoveries.  Some are
# redundant intentionally: the player has requested sensible redundancy rather than useless outputs.
for title,theme,summary,cast,objects,branch in ANIME:
 for raw in objects.split(';'):
  name,role=raw.split(':',1)
  for marker in ['Anime','Manga','Shonen',title,theme,role,'Battle Anime']:
   if marker.casefold() in ref:addrecipe(name,marker,name,'anime-world concept')
for title,theme,cast,objects in FILMS:
 for raw in objects.split(';'):
  name,role=raw.split(':',1)
  for marker in ['Cinema','Film Score',title,theme,role,'Live Action']:
   if marker.casefold() in ref:addrecipe(name,marker,name,'film-world concept')

# If excessive identity routes make >5000, trim exclusively identity routes after all first-discovery
# and explicit creative routes; keep all 1,809 V17 recipes unchanged. Stable deterministic order.
TARGET=5000;need=TARGET-len(existing)+len(recipes) # not used; exact original + new
old_count=len(legacy['recipes'])+len(old['recipes'])
new_needed=TARGET-old_count
if len(recipes)<new_needed:
 # Supplement with meaningful franchise cross-medium affirmations, never arbitrary unrelated pairs.
 # This list cannot manufacture any new name and never claims equivalence of two different works.
 for it in items:
  if len(recipes)>=new_needed:break
  name=it['name'];category=it['category']
  markers={'character':['Hero','Story Mode','History','Shonen','Television','Anime Film','Legend','Human'],
           'anime':['Anime Film','Television','Shonen Jump','Story Mode','Book'],
           'film':['Live Action','Screen' if 'Screen'.casefold() in ref else 'Television','DVD','Blu-ray','Story Mode'],
           'music':['Radio','Speaker','Audio' if 'Audio'.casefold() in ref else 'Sound','Streaming','Concert' if 'Concert'.casefold() in ref else 'Music'],
           'object':['Story Mode','Legend','Book','History','Comic Book'],
           'power':['Superpower','Energy','Magia','Transformation'],
           'genre':['Culture' if 'Culture'.casefold() in ref else 'Music','History','Television']}.get(category,['Story Mode'])
  for m in markers:
   if len(recipes)>=new_needed:break
   if m.casefold() in ref:addrecipe(name,m,name,'context association')
if len(recipes)<new_needed:raise AssertionError(('NOT_ENOUGH_RECIPES',len(recipes),new_needed,dict(skipped)))
# Drop surplus context-only identity routes in reverse order; preserve all concrete discovery and
# transformation routes even if resulting target would exceed 5000 (target design below is exact).
if len(recipes)>new_needed:
 non=['context association','franchise context','screen character context','artist recognition','anime-world concept','film-world concept','character context','cinema context','musical context','identity']
 keep=[];dropped=0
 for r in recipes:
  reason=next((why for a,b,why in links[r[2]] if tuple(sorted((a,b)))==tuple(sorted(r[:2]))),'alternate')
  if len(recipes)-dropped>new_needed and reason in non:
   dropped+=1;existing.pop(tuple(sorted(r[:2])),None)
  else:keep.append(r)
 recipes=keep
 if len(recipes)>new_needed:raise AssertionError(('NON_IDENTITY_EXCESS',len(recipes),new_needed))

# Enforce reachability of every additional output from the four original starters.
all_pairs=[(f'legacy:{a}',f'legacy:{b}',f'legacy:{c}') for a,b,c in legacy['recipes']]+old['recipes']+recipes
reached={f'legacy:{i}' for i in range(4)}
for passes in range(200):
 before=len(reached)
 for a,b,c in all_pairs:
  if a in reached and b in reached:reached.add(c)
 if len(reached)==before:break
unreachable=[it['name'] for it in items if it['id'] not in reached]
if unreachable:raise AssertionError(('UNREACHABLE',len(unreachable),unreachable[:50]))
assert len(set(tuple(sorted(x[:2])) for x in all_pairs))==len(all_pairs)
assert len(all_pairs)==TARGET,(len(all_pairs),len(recipes))
assert all(any(x[2]==it['id'] for x in recipes) for it in items)
print('TOTAL:',len(all_pairs),'V18 new recipes:',len(recipes),'V18 new elements:',len(items),'reachable',len(reached),'passes',passes)
print('NEW CATEGORY DISTRIBUTION:',dict(basecats),'skipped:',dict(skipped))
for name in ['Anime','Manga','Dragon Ball','Son Goku','Vegeta','Super Saiyan Goku','Ultra Instinct Goku','Goku Black','Super Saiyan Rosé Goku Black','Naruto','One Piece','Pokémon','Star Wars','The Matrix','Music','Mecha Samurai']:
 print('CHECK',name,ref.get(name.casefold()))

# Final pack contains stable V14 IDs and only appended V18 assets and recipes.
final={'version':18,'items':old['items']+items,'recipes':old['recipes']+recipes}
(DST/'shared/creative-pack.json').write_text(json.dumps(final,ensure_ascii=False,separators=(',',':'))+'\n')
(DST/'client/src/creative-pack.js').write_text('export const PACK = '+json.dumps(final,ensure_ascii=False,separators=(',',':'))+';\n')
(DST/'server/src/creative-pack.mjs').write_text('export const PACK = '+json.dumps(final,ensure_ascii=False,separators=(',',':'))+';\n')
# Write export specifically for audit and content review.
(DST/'shared/v18_new_recipes.json').write_text(json.dumps({'newItems':items,'newRecipes':recipes},ensure_ascii=False,indent=2)+'\n')
report={'totalRecipes':len(all_pairs),'previousRecipes':old_count,'addedRecipes':len(recipes),'newElements':len(items),'totalElements':len(legacy['items'])+len(final['items']),'reachable':len(reached),'unreachable':unreachable,'categories':dict(basecats)}
(DST/'shared/v18_stats.json').write_text(json.dumps(report,indent=2)+'\n')
