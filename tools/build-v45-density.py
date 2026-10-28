#!/usr/bin/env python3
"""V45 hand-curated ingredient-group expansions; no runtime procedural recipes.
Names are literal and validated, historical unordered pairs remain immutable.
A recipe is emitted only for combinations of explicitly named ingredients.
"""
from pathlib import Path
from collections import Counter
import json,re
ROOT=Path(__file__).resolve().parents[1]
snap=json.loads((ROOT/'shared/v44-catalog-snapshot.json').read_text())
assert (len(snap['items']),len(snap['recipes']))==(3791,11111)
ids={x['name'].casefold():x['id'] for x in snap['items']}
original={'|'.join(sorted(r[:2])):r[2] for r in snap['recipes']}
novelties=[
 ('Rain Barrel','technology','A container that catches rainfall for later use.'),
 ('Bird Feeder','culture','A small station offering seeds to visiting birds.'),
 ('Water Pump','technology','A mechanism that moves water through pipes.'),
 ('Solar Oven','technology','A cooker concentrating sunlight into heat.'),
 ('Streetlamp','technology','A lamp illuminating a road after sunset.'),
 ('Aquarium','culture','A clear tank creating a home for aquatic creatures.'),
 ('Weather Balloon','science','A balloon carrying instruments high into the atmosphere.'),
 ('Tidal Turbine','technology','A turbine that draws energy from moving tides.'),
 ('Cloud Chamber','science','An instrument revealing tracks of passing particles.'),
 ('Camera Obscura','technology','A dark chamber that projects an upside-down scene.'),
 ('Kaleidoscope','culture','A tube of reflections and shifting geometric colours.'),
 ('Sea Glass','material','Glass fragments rounded and frosted by ocean waves.'),
]
items=[]
for name,cat,summary in novelties:
 if name.casefold() in ids:raise AssertionError('Duplicate new item: '+name)
 ident='organic45:'+re.sub('[^a-z0-9]+','-',name.lower()).strip('-'); ids[name.casefold()]=ident
 items.append(dict(id=ident,name=name,category=cat,summary=summary,iconFamily='organic'))
def ident(name):
 i=ids.get(name.strip().casefold())
 if not i:raise ValueError('Not a real catalog name: '+repr(name))
 return i
chosen={}; skipped=Counter(); collision=[]; themes=Counter()
def add(a,b,o,theme):
 a,b,o=ident(a),ident(b),ident(o)
 k='|'.join(sorted((a,b)))
 if k in original:skipped[theme]+=1;return
 if k in chosen:
  if chosen[k][0]!=o:collision.append((k,chosen[k][0],o,theme))
  return
 chosen[k]=(o,theme);themes[theme]+=1

def exact(text):
 for row in text.strip().splitlines():
  row=row.strip()
  if not row or row.startswith('#'):continue
  pair,out=row.split(' = ');a,b=pair.split(' + ');add(a,b,out,'hand-authored new concepts')
exact('''
Rain + Tank = Rain Barrel
Garden + Tank = Rain Barrel
Rain + Farm = Rain Barrel
Bird + Seed = Bird Feeder
Bird + Food = Bird Feeder
Nest + Seed = Bird Feeder
Water + Motor = Water Pump
Water + Gear = Water Pump
River + Motor = Water Pump
Sun + Kiln = Solar Oven
Sun + Cooking = Solar Oven
Solar Panel + Heat = Solar Oven
City + Light = Streetlamp
City + Electricity = Streetlamp
Night + Light = Streetlamp
Fish + Glass = Aquarium
Pond + Glass = Aquarium
Reef + Glass = Aquarium
Balloon + Weather = Weather Balloon
Balloon + Thermometer = Weather Balloon
Balloon + Science = Weather Balloon
Tide + Generator = Tidal Turbine
Wave + Turbine = Tidal Turbine
Current + Generator = Tidal Turbine
Cloud + Science = Cloud Chamber
Steam + Physics = Cloud Chamber
Cloud + Physics = Cloud Chamber
Camera + Shadow = Camera Obscura
Light + Photography = Camera Obscura
Lens + Shadow = Camera Obscura
Prism + Color = Kaleidoscope
Lens + Crystal = Kaleidoscope
Glass + Rainbow = Kaleidoscope
Sea + Glass = Sea Glass
Wave + Glass = Sea Glass
Ocean + Glass = Sea Glass
''')
# A tightly scoped rule combines ONLY the listed literal names; these lists are reviewed
# authoring data, not genre guesses or runtime inferred recipes.
RULES=[]
def rule(label,out,a,b):
 xs=[s.strip() for s in a.split(',')];ys=[s.strip() for s in b.split(',')]
 for x in xs+ys:ident(x)
 ident(out);RULES.append((label,out,xs,ys))
# Marine ecosystems and environmental processes
rule('Marine food chain','Fish','Sea,Ocean,Lake,River,Pond,Reef','Plankton,Algae,Life,Food')
rule('Reef habitat','Coral','Sea,Ocean,Reef,Fish','Life,Plankton,Algae')
rule('Tidal life','Crab','Sand,Sea,Tide,Reef','Animal,Life,Food')
rule('Marine predator','Shark','Ocean,Sea,Reef','Fish,Animal,Life')
rule('Intelligent sea life','Dolphin','Ocean,Sea','Animal,Fish,Life')
rule('Cephalopod habitat','Octopus','Ocean,Sea,Reef','Animal,Life,Stone')
rule('Marsh ecology','Frog','Wetland,Pond,Marsh,Rain','Insect,Life,Algae')
rule('Coastal drift','Driftwood','Sand,Sea,Ocean,Wave,Current','Wood,Tree,Forest')
rule('Salinity','Salt','Sea,Ocean,Water,Salt Marsh','Sun,Heat,Steam,Crystal')
rule('Coral seas','Reef','Coral,Sea,Ocean','Fish,Life,Stone')
rule('Aquatic bloom','Algae','Pond,Lake,Sea,Ocean,Water','Plant,Sun,Life')
rule('Watershed','Delta','River,Current,Sediment','Sea,Ocean,Sand,Soil')
rule('Pebble smoothing','Stone','River,Wave,Waterfall','Rock,Sand,Current')
rule('Water transport','Ship','Sea,Ocean,Port,Harbor','Wood,Metal,Trade,Engineering')
rule('Harbor navigation','Compass','Ship,Map,Sail,Port','Star,Sun,Metal,Navigation')
rule('Marine sensing','Sonar','Sea,Ocean,Ship','Sound,Wave,Electricity')
rule('Water filtration','Water Filter','Water,River,Rain','Sand,Charcoal,Tool,Glass')
rule('Rain collection','Rain Barrel','Rain,Garden,Farm','Tank,House,Tool')
rule('Water pumping','Water Pump','Water,River,Lake,Pond','Motor,Gear,Power')
rule('Tidal engineering','Tidal Turbine','Tide,Wave,Current','Generator,Motor,Turbine')
# Growth, farming and forests
rule('Seed germination','Sprout','Seed,Soil,Garden,Farm','Rain,Sun,Water,Time')
rule('Flowers and pollination','Flower','Plant,Sprout,Seed,Garden','Rain,Sun,Water,Pollination')
rule('Growing orchards','Fruit','Tree,Orchard,Flower,Farm','Pollination,Sun,Harvest,Water')
rule('Beekeeping','Honey','Bee,Beehive,Flower,Orchard','Nectar,Pollination,Pollen')
rule('Pollen ecology','Pollination','Bee,Butterfly,Flower','Pollen,Nectar,Garden')
rule('Habitat for birds','Nest','Bird,Tree,Forest','Plant,Wood,Plant')
rule('Bird feeding','Bird Feeder','Bird,Nest,Garden','Seed,Food,Fruit')
rule('Morning birdsong','Birdsong','Bird,Forest,Tree','Music,Sound,Sun,Song')
rule('Garden ecosystem','Butterfly','Flower,Garden,Plant','Caterpillar,Cocoon,Pollen')
rule('Forest ground cover','Moss','Rock,Stone,Tree,Forest','Rain,Fog,Mist')
rule('Fungi network','Mushroom','Forest,Soil,Tree,Compost','Rain,Mist,Wood')
rule('Food preservation','Jam','Fruit,Orchard,Honey','Sugar,Heat,Fire')
rule('Garden cultivation','Greenhouse','Garden,Farm,Plant','Glass,Sun,Engineering')
# Weather, climate and physics
rule('Atmospheric condensation','Cloud','Steam,Water,Air','Sky,Wind,Frost,Pressure')
rule('Cloud precipitation','Rain','Cloud,Storm,Weather','Water,Mist,Wind')
rule('Storm charge','Lightning','Cloud,Storm,Thunder','Electricity,Energy,Air')
rule('Frost precipitation','Snow','Cloud,Rain,Storm','Frost,Ice,Frost')
rule('Winter surface','Frost','Frost,Ice,Snow','Stone,Glass,Plant')
rule('Low altitude moisture','Fog','Mist,Cloud,Rain','Frost,Forest,Humidity')
rule('Volcanic heat','Lava','Volcano,Magma Chamber','Heat,Fire,Stone')
rule('Hot water vents','Geyser','Volcano,Lava,Heat','Water,Hot Spring,Steam')
rule('Weather instrumentation','Rain Gauge','Rain,Storm,Drizzle','Thermometer,Glass,Science')
rule('Vertical weather science','Weather Balloon','Balloon,Air,Sky','Weather,Science,Pressure')
rule('Lightning protection','Lightning Rod','Storm,Lightning,Thunder','Copper,Metal,Tower')
rule('Optical rainbow','Rainbow','Rain,Prism,Mist','Light,Sun,Waterfall')
rule('Atmosphere and rays','Sunshower','Sun,Rain,Cloud','Rain,Sun,Mist')
rule('Cloud chamber physics','Cloud Chamber','Cloud,Steam,Physics','Science,Electricity,Light')
# Materials, tools and infrastructure
rule('Glass making','Glass','Sand,Silicon,Crystal','Heat,Fire,Kiln')
rule('Pottery firing','Ceramic','Clay,Pottery,Mud','Fire,Kiln,Heat')
rule('Clay baking','Brick','Clay,Mud','Heat,Kiln,Fire')
rule('Construction concrete','Concrete','Cement,Sand,Stone','Water,Engineering,House')
rule('Water transport bridge','Bridge','River,Lake,Water','Wood,Stone,Metal,Engineering')
rule('Gear drive','Motor','Gear,Wheel,Electricity','Battery,Generator,Power')
rule('Water energy','Watermill','River,Waterfall,Current','Wheel,Gear,Engineering')
rule('Wind energy','Windmill','Wind,Storm,Air','Gear,Wheel,Engineering')
rule('Power generation','Generator','Motor,Windmill,Watermill','Wheel,Electricity,Engineering')
rule('Sunlight cooking','Solar Oven','Sun,Heat,Light','Kiln,Cooking,Solar Panel')
rule('Night street light','Streetlamp','City,City,Night','Light,Electricity,Power')
rule('Sea glass abrasion','Sea Glass','Sea,Ocean,Wave','Glass,Sand,Stone')
rule('Building tools','Tool','Stone,Wood,Metal','Engineering,Human,Science')
rule('Industrial metal','Iron','Metal,Stone,Rock','Fire,Heat,Metal')
rule('Paper from wood','Paper','Wood,Tree,Forest','Tool,Factory,Water')
rule('Writing and books','Book','Paper,Writing,Ink','Knowledge,Language,Science')
# Light, photography, optics and music
rule('Optical image','Photograph','Camera,Film,Photography','Light,Portrait,Sun')
rule('Lens imaging','Camera','Lens,Glass,Optics','Photography,Tool,Light')
rule('Projected image','Projector','Film,Photograph,Lens','Light,Electricity,Screen')
rule('Darkroom image','Camera Obscura','Camera,Lens,Photography','Shadow,Light,Glass')
rule('Colourful reflections','Kaleidoscope','Prism,Crystal,Glass','Color,Rainbow,Lens')
rule('Musical instrument','Flute','Wind,Air,Wood','Music,Sound,Song')
rule('Percussive rhythm','Rhythm','Music,Sound,Song','Time,Drum,Beat')
rule('Symphonic sound','Orchestra','Piano,Violin,Flute','Music,Concert,Harmony')
rule('Written melody','Song','Music,Melody,Birdsong','Writing,Sound,Human')
# Food and homes
rule('Bread baking','Bread','Dough,Flour,Yeast','Fire,Heat,Kiln,Campfire')
rule('Sweet baking','Cake','Dough,Flour,Butter','Sugar,Chocolate,Cream')
rule('Warm soup','Soup','Water,Potato,Vegetable','Fire,Heat,Chef')
rule('Fresh salad','Salad','Vegetable,Tomato,Herb','Fruit,Chef,Food')
rule('Milk processing','Cheese','Milk,Cream','Time,Yeast,Chef')
rule('Iced dessert','Ice Cream','Milk,Cream,Ice','Sugar,Fruit,Chocolate')
rule('Meal preparation','Cooking','Food,Vegetable,Fish','Fire,Heat,Chef')
rule('Cocoa confection','Chocolate','Cocoa,Sugar,Milk','Heat,Fire,Chef')
rule('Warm tea','Tea','Water,Mint,Herb','Heat,Fire,Sun')
rule('Coffee brewing','Coffee','Water,Coffee','Heat,Fire,Sun')
# Playful cross-family links for later gaming / technology inventories. Explicit names only.
rule('Console play','Video Game','Console,Game Boy,Computer,Handheld Console','Game,Software,Controller,Screen')
rule('Arcade hardware','Arcade Cabinet','Arcade,Video Game,Joystick,Controller','Screen,Coin,Electronics,Game')
rule('Portable gaming','Handheld Console','Console,Game Boy,Game','Battery,Screen,Electronics')
rule('Role-playing worlds','RPG','Fantasy,Adventure,Hero,Exploration','Video Game,Game,Level')
rule('Racing action','Racing','Game,Video Game,Arcade,Controller','Car,Bicycle,Wheel')
rule('Stealth genre','Stealth','Video Game,Game,Hero','Shadow,Strategy,Level')
rule('Exploration platform','Metroidvania','Platformer,Adventure,Exploration','Map,Castle,Level')
rule('Rogue exploration','Roguelike','RPG,Adventure,Game,Video Game','Challenge,Level,Exploration')
rule('Strategy play','Strategy','Game,Video Game,Computer','Map,Team,Challenge')
rule('Rhythm play','Music Game','Game,Video Game,Arcade,Controller','Music,Rhythm,Beat')
rule('Cinematic scores','Soundtrack','Film,Anime,Video Game,Game','Music,Song,Orchestra,Melody')
rule('Interactive soundtracks','Game Soundtrack','Video Game,Game,Console,Arcade','Music,Sound,Orchestra')
rule('Building game engines','Game Engine','Game Studio,Code,Software,Algorithm','Graphics,Animation,3D,Game')
rule('Modding software','Game Mod','Game,Video Game,Software','Code,Pixel Art,Graphics')
rule('Online games','Multiplayer','Game,Video Game,Console','Internet,Network,Online Platform')
rule('Gaming competitions','Game Tournament','Video Game,Game,Arcade,Multiplayer','Challenge,Online Platform,Team')
rule('Pixel graphics','Pixel Art','Game,Video Game,Graphics,Pixel','Art,Animation,Color')
rule('Neural computer systems','Artificial Intelligence','Computer,Code,Algorithm,Software','Robot,Science,Electronics')
rule('Remote game services','Cloud Gaming','Internet,Network,Streaming,Online Platform','Video Game,Game,Console,Computer')
rule('Virtual environment','Virtual Reality','Computer,Console,Game,Video Game','3D,Simulation,Graphics')
rule('Enhanced real-world visuals','Augmented Reality','Camera,Computer,Screen','3D,Graphics,Video')
rule('Online streams','Streaming','Internet,Network,Wi-Fi,Online Platform','Video,Game,Music,Television')
rule('Game progress','Save Game','Game,Video Game,Level','Memory,Computer,Software,Time')
rule('Unlocked achievements','Achievement','Game,Video Game,Challenge,Level','Team,Memory,Time')
rule('Play controllers','Controller','Game,Video Game,Console','Joystick,Electronics,Button')
rule('Robotics engineering','Robot','Computer,Artificial Intelligence,Electronics','Motor,Circuit,Battery')
rule('Silicon chips','Microchip','Silicon,Circuit,Computer','Electricity,Electronics,Factory,Science')
rule('Low earth orbit','Satellite','Rocket,Spacecraft,Space,Earth','Radio,Computer,Electronics')
rule('Stars through lenses','Telescope','Glass,Lens,Observatory,Science','Star,Moon,Space,Light')
rule('Interstellar scale','Galaxy','Space,Star,Planet','Time,Telescope,Science')
rule('Digital photography','Photography','Camera,Photograph,Lens','Light,Computer,Art')
rule('Video editing','Video','Camera,Film,Photography','Animation,Computer,Sound')
rule('Cinema projection','Cinema','Film,Projector,Screen','Sound,Music,Art')
rule('Documentaries','Film','Camera,Photograph,Cinema','Art,Sound,Writing')
rule('Wireless signals','Radio','Electricity,Electronics,Computer','Sound,Network,Wave')
rule('Video broadcasting','Television','Radio,Screen,Electronics','Video,Film,Streaming')
rule('Creative art','Art','Human,Pixel Art,Photography','Color,Writing,Music')

for theme,out,left,right in RULES:
 for a in left:
  for b in right:add(a,b,out,theme)
pack={'items':items,'recipes':[[*k.split('|'),v[0]] for k,v in sorted(chosen.items())]}
for x in items:
 if sum(r[2]==x['id'] for r in pack['recipes'])<2:raise ValueError('Not enough recipes for new item '+x['name'])
(ROOT/'client/src/organic-pack-v45.js').write_text('export const ORGANIC_V45 = '+json.dumps(pack,separators=(',',':'),ensure_ascii=False)+';\n')
report={'release':'V45','base_items':len(snap['items']),'base_recipes':len(original),'new_items':len(items),'added_recipes':len(chosen),'rule_sets':len(RULES),'old_pairs_preserved':True,'skipped_preexisting_pairs':sum(skipped.values()),'competing_proposals_rejected':len(collision),'themes':dict(themes),'new_item_routes':{x['name']:sum(r[2]==x['id'] for r in pack['recipes']) for x in items},'conflicts_illustrative':collision[:25]}
(ROOT/'shared/v45-density-generation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['new_items','added_recipes','rule_sets','skipped_preexisting_pairs','competing_proposals_rejected','new_item_routes']},indent=2))
