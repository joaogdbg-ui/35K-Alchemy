#!/usr/bin/env python3
"""V44: Reviewed, named-ingredient recipes emitted as an immutable offline pack.
No randomness, lexical guessing or runtime fallback. Old pair results win unconditionally.
"""
from pathlib import Path
from collections import defaultdict,Counter
import json,re
ROOT=Path(__file__).resolve().parents[1]
snap=json.loads((ROOT/'shared/v43-catalog-snapshot.json').read_text())
names={item['name'].casefold():item['id'] for item in snap['items']}
assert len(names)==3778 and len(snap['recipes'])==10275,(len(names),len(snap['recipes']))
base={ '|'.join(sorted(row[:2])):row[2] for row in snap['recipes']}
new=[
 ('Balloon','culture','An inflated, floating party decoration.'),
 ('Campfire','nature','A small controlled outdoor fire, surrounded by stones.'),
 ('Sandcastle','culture','A temporary castle sculpted from damp sand.'),
 ('Wind Chime','culture','Hanging pieces that play gentle notes in the breeze.'),
 ('Driftwood','material','Wood smoothed and carried by moving water.'),
 ('Rain Gauge','technology','A graduated vessel for measuring rainfall.'),
 ('Lightning Rod','technology','A metal conductor protecting buildings from lightning.'),
 ('Water Filter','technology','Layers of material that remove impurities from water.'),
 ('Birdsong','nature','The melodic calls of birds at dawn.'),
 ('Hot Air Balloon','technology','A balloon rising as its enclosed air warms.'),
 ('Terracotta','material','Porous reddish clay pottery hardened by firing.'),
 ('Smoke Signal','culture','A distant message sent using visible puffs of smoke.'),
 ('Weather Vane','technology','A rooftop arrow that shows which way the wind blows.'),
]
new_items=[]
for name,category,summary in new:
    assert name.casefold() not in names,name
    ident='organic44:'+re.sub('[^a-z0-9]+','-',name.lower()).strip('-')
    names[name.casefold()]=ident
    new_items.append(dict(id=ident,name=name,category=category,summary=summary,iconFamily='organic'))

def idof(name):
    name=name.strip(); k=name.casefold()
    if k not in names:raise ValueError(f'Unknown editorial ingredient/result: {name!r}')
    return names[k]
chosen={}; conflicts=[]; existing=Counter();added=Counter()
def record(a,b,out,theme):
    ai,bi,oi=idof(a),idof(b),idof(out)
    key='|'.join(sorted((ai,bi)))
    if key in base:
        existing[theme]+=1;return
    if key in chosen:
        if chosen[key][0]!=oi:conflicts.append(dict(pair=key,kept=chosen[key][0],rejected=oi,theme=theme))
        return
    chosen[key]=(oi,theme);added[theme]+=1

# Exact, explicitly authored recipes receive highest priority.
manual='''
Air + Toy = Balloon
Air + Silk = Balloon
Air + Paper = Balloon
Stone + Fire = Campfire
Stone + Spark = Campfire
Field + Fire = Campfire
Wood + Stone = Campfire
Sand + Castle = Sandcastle
Sand + Tool = Sandcastle
Sand + House = Sandcastle
Beach + Castle = Sandcastle
Wind + Bell = Wind Chime
Wind + Glass = Wind Chime
Wind + Music = Wind Chime
Breeze + Metal = Wind Chime
Wood + River = Driftwood
Wood + Ocean = Driftwood
Tree + Sea = Driftwood
Waterfall + Wood = Driftwood
Rain + Glass = Rain Gauge
Rain + Thermometer = Rain Gauge
Weather + Glass = Rain Gauge
Rain + Measurement = Rain Gauge
Storm + Copper = Lightning Rod
Lightning + Tower = Lightning Rod
Thunderstorm + Metal = Lightning Rod
Lightning + Iron = Lightning Rod
Water + Charcoal = Water Filter
Water + Tool = Water Filter
Sand + Charcoal = Water Filter
Water + Filter = Water Filter
Bird + Music = Birdsong
Bird + Sound = Birdsong
Forest + Music = Birdsong
Bird + Song = Birdsong
Sky + Balloon = Hot Air Balloon
Heat + Balloon = Hot Air Balloon
Fire + Balloon = Hot Air Balloon
Air + Balloon = Hot Air Balloon
Brick + Art = Terracotta
Clay + Sun = Terracotta
Pottery + Earth = Terracotta
Clay + Art = Terracotta
Smoke + Language = Smoke Signal
Smoke + Writing = Smoke Signal
Smoke + Mountain = Smoke Signal
Campfire + Language = Smoke Signal
Wind + Compass = Weather Vane
Wind + Roof = Weather Vane
Wind + Tower = Weather Vane
Weather + Arrow = Weather Vane
'''
# Some names may be absent, which must be corrected editorially, never silently substituted.
# Explicitly controlled synonym resolutions retain the true target item names in reports.
ALIASES={'Beach':'Sand','Bell':'Music','Breeze':'Wind','Measurement':'Science','Filter':'Tool',
         'Roof':'House','Arrow':'Compass'}
def resolve(x):return ALIASES.get(x,x)
for line in manual.splitlines():
    if not line.strip():continue
    left,result=line.split(' = ');a,b=left.split(' + ')
    record(resolve(a),resolve(b),result,'manual')

# Thematic relations. Each set is a hand-selected list of concrete ingredient names;
# the cross-product contains no type inference. Counts may rise with new catalog versions
# ONLY after explicitly editing these lists and passing the tests below.
RULES=[]
def rule(theme,result,left,right):
    a=[resolve(x.strip()) for x in left.split(',')]
    b=[resolve(x.strip()) for x in right.split(',')]
    RULES.append((theme,result,a,b))
# Atmosphere and water cycle
rule('rainfall','Rain','Cloud,Storm,Thunderstorm,Monsoon,Weather','Water,Sea,Ocean,River,Lake,Mist,Humidity')
rule('clouds','Cloud','Steam,Mist,Fog,Humidity','Air,Wind,Cold,Sea,Sun,Water')
rule('thunder','Thunder','Storm,Thunderstorm,Lightning','Air,Cloud,Rain,Mountain,Sound')
rule('fog','Fog','River,Lake,Pond,Marsh,Bog,Sea,Ocean,Waterfall','Cold,Frost,Air,Mist,Cloud')
rule('dew','Dew','Rain,Mist,Fog,Humidity','Grass,Plant,Flower,Leaf,Soil,Cold')
rule('ice','Ice','Water,Rain,Puddle,Lake,Pond,River','Frost,Snow,Glacier,Cold,Blizzard')
rule('snow','Snow','Cloud,Storm,Rain,Mist','Frost,Cold,Ice,Winter')
rule('storm','Storm','Cloud,Wind,Rain,Sea,Weather','Lightning,Energy,Thunder,Electricity,Thunderstorm')
rule('wave','Wave','Sea,Ocean,Lake,Water,River','Wind,Storm,Thunderstorm,Current,Hurricane')
rule('whirlpool','Whirlpool','River,Ocean,Sea,Water,Current','Wind,Storm,Wave,Current,Tide')
rule('tide','Tide','Moon,Gravity,Ocean,Sea','Ocean,Sea,Water,Wave,Island')
rule('rainbow','Rainbow','Rain,Water,Drizzle,Sunshower,Mist,Waterfall','Light,Sun,Prism,Crystal,Glass')
rule('aurora','Aurora','Sky,Night,Space,Star','Energy,Electricity,Light,Magnetism')
rule('sunshower','Sunshower','Sun,Sunlight,Light,Sky','Rain,Drizzle,Mist,Cloud')
rule('rain-gauge','Rain Gauge','Rain,Weather,Monsoon,Drizzle,Storm','Glass,Science,Tool,Thermometer,Measurement')
rule('weather-vane','Weather Vane','Wind,Storm,Weather,Tornado','Compass,House,Tower,Metal,Tool')
rule('heatwave','Heatwave','Sun,Heat,Desert,Drought','Summer,Air,Weather,City,Field')
rule('drought','Drought','Sun,Heat,Desert,Field','Soil,Water,Weather,Plant,Forest')
rule('erosion','Erosion','River,Wave,Wind,Rain,Water','Stone,Mountain,Rock,Canyon,Cliff,Soil')
rule('sediment','Sediment','River,Wave,Erosion,Waterfall,Current','Rock,Stone,Sand,Soil,Mud,Clay')
rule('delta','Delta','River,Current,Sediment','Ocean,Sea,Island,Sand,Soil,Coast')
rule('puddle','Puddle','Rain,Storm,Drizzle,Monsoon','Stone,House,Concrete,Brick,Street,Field')
# Fire, stone, materials and crafts
rule('campfire','Campfire','Spark,Fire,Heat,Wood,Charcoal','Stone,Rock,Field,Forest,Tool')
rule('ash','Ash','Wildfire,Fire,Heat,Lava','Paper,Plant,Tree,Flower,Seed,Grass,Fossil')
rule('smoke','Smoke','Fire,Heat,Wildfire,Campfire','Coal,Charcoal,Paper,Fuel,Oil,Wood,Leaf')
rule('soot','Soot','Smoke,Campfire,Wildfire','Glass,Metal,Stone,Brick,Paper,House')
rule('smog','Smog','Smoke,Soot,Haze,Factory,Industry','Fog,Mist,City,Air,Cloud')
rule('charcoal','Charcoal','Wood,Tree,Forest,Coal','Heat,Kiln,Fire,Campfire,Tool')
rule('smoke-signal','Smoke Signal','Smoke,Soot,Campfire','Language,Writing,Communication,Mountain,Tower,Wind')
rule('wildfire','Wildfire','Fire,Heat,Lightning,Lava','Forest,Plant,Grass,Tree,Field,Wood')
rule('geyser','Geyser','Lava,Volcano,Magma Chamber,Heat','Water,River,Lake,Ocean,Spring,Sea')
rule('obsidian','Obsidian','Volcano,Lava,Heat,Magma Chamber','Water,Ice,Glacier,Sea,Glass')
rule('basalt','Basalt','Volcano,Lava,Magma Chamber','Water,Sea,Ocean,Stone,Rock')
rule('glass','Glass','Sand,Quartz,Crystal,Silicon','Fire,Heat,Kiln,Lava,Electricity')
rule('ceramic','Ceramic','Pottery,Clay,Mud','Kiln,Fire,Heat,Factory,Tool')
rule('terracotta','Terracotta','Clay,Pottery,Brick,Mud','Sun,Heat,Art,Earth,Kiln')
rule('brick','Brick','Clay,Mud,Pottery','Fire,Heat,Kiln,Factory,Stone')
rule('concrete','Concrete','Cement,Sand,Stone','Water,Rain,Tool,Engineering,House')
rule('crystal','Crystal','Stone,Rock,Geode,Quartz','Pressure,Heat,Cave,Mineral,Ice')
rule('salt','Salt','Sea,Ocean,Salt Marsh,Water','Sun,Heat,Fire,Crystal,Steam')
rule('sandcastle','Sandcastle','Sand,Beach,Desert,Soil','Water,Castle,House,Tool,Stone')
rule('driftwood','Driftwood','Wood,Tree,Forest,Log','Sea,Ocean,River,Wave,Current,Waterfall')
rule('water-filter','Water Filter','Water,Charcoal,Sand,Stone,Gravel','Tool,Charcoal,Science,Glass,Engineering')
# Ecosystems, animals and sound
rule('sprout','Sprout','Seed,Soil,Plant,Greenhouse','Water,Rain,Sun,Light,Soil')
rule('flower','Flower','Seed,Sprout,Plant,Garden','Water,Rain,Sun,Soil,Pollination')
rule('tree','Tree','Seed,Sapling,Plant,Forest','Soil,Sun,Rain,Water,Time')
rule('forest','Forest','Tree,Sapling,Plant,Seed','Soil,Rain,Water,Tree,Field')
rule('rainforest','Rainforest','Tree,Forest,Plant,Canopy','Rain,Monsoon,Water,Humidity,Cloud')
rule('mangrove','Mangrove','Tree,Forest,Plant,Seed','Marsh,Estuary,Salt Marsh,Lagoon,Ocean')
rule('moss','Moss','Rock,Stone,Tree,Forest,Soil','Water,Rain,Mist,Fog,Shade')
rule('lichen','Lichen','Rock,Stone,Tree,Forest','Mushroom,Algae,Moss,Rain,Mist')
rule('mushroom','Mushroom','Forest,Soil,Tree,Wood,Compost','Rain,Mist,Water,Shade,Moss')
rule('cactus','Cactus','Desert,Sand,Drought,Seed','Sun,Heat,Soil,Oasis,Plant')
rule('fruit','Fruit','Flower,Tree,Orchard,Plant','Sun,Rain,Water,Harvest,Pollination')
rule('honey','Honey','Bee,Beehive,Bee Bread','Flower,Nectar,Pollination,Garden,Pollen')
rule('butterfly','Butterfly','Caterpillar,Cocoon,Flower','Garden,Sun,Time,Flower,Plant')
rule('birdsong','Birdsong','Bird,Bird Nest,Owl,Woodpecker,Forest','Sound,Music,Song,Dawn,Wind,Tree')
rule('nest','Nest','Bird,Bird Nest,Owl,Woodpecker','Tree,Forest,Wood,Field,Grass')
rule('wetland','Wetland','Marsh,Bog,Swamp,Pond,River','Water,Plant,Grass,Soil,Rain')
rule('frog','Frog','Tadpole,Pond,Marsh,Wetland','Water,Rain,Lily Pad,Insect,Bog')
rule('fish','Fish','Sea,River,Lake,Pond,Ocean,Reef','Plankton,Algae,Life,Water,Food')
rule('coral','Coral','Sea,Ocean,Reef,Coral Reef','Fish,Life,Shell,Plankton,Animal')
rule('kelp','Kelp','Ocean,Sea,Kelp Forest,Water','Sun,Plant,Algae,Life,Sunlight')
rule('tidal-pool','Tide Pool','Tide,Sea,Ocean,Wave','Rock,Stone,Reef,Coast,Island')
rule('seashell','Seashell','Sea,Ocean,Beach,Reef','Clam,Oyster,Animal,Wave,Shell')
# Engineering, craft, signals
rule('wind-chime','Wind Chime','Wind,Storm,Music,Sound','Glass,Metal,Copper,Flute,Wood')
rule('lightning-rod','Lightning Rod','Storm,Lightning,Thunderstorm,Electricity','Copper,Iron,Tower,Metal,House')
rule('motor','Motor','Electricity,Battery,Energy,Power','Gear,Wheel,Circuit,Wire,Tool')
rule('battery','Battery','Electricity,Energy,Copper,Metal','Power,Tool,Circuit,Factory,Science')
rule('circuit','Circuit','Electricity,Wire,Metal,Copper','Microchip,Battery,Tool,Engineering,Computer')
rule('windmill','Windmill','Wind,Storm,Weather,Air','Wheel,Gear,House,Factory,Tool')
rule('watermill','Watermill','River,Waterfall,Current,Water','Wheel,Gear,Factory,Tool,Engineering')
rule('solar-panel','Solar Panel','Sun,Light,Solar Power','Silicon,Glass,Electricity,Engineering,Factory')
rule('telescope','Telescope','Glass,Lens,Prism,Optics','Star,Night,Space,Science,Sun')
rule('microscope','Microscope','Glass,Lens,Optics,Science','Plant,Life,Microbe,Crystal,Water')
rule('camera','Camera','Light,Photography,Photograph,Lens','Tool,Electronics,Optics,Glass,Science')
rule('photograph','Photograph','Camera,Digital Camera,Photographer,Film','Light,Flash,Sun,Portrait,Family')
rule('rain-gauge-science','Rain Gauge','Weather,Rain,Forecast,Drizzle','Science,Glass,Tool,Thermometer')
rule('hot-air-balloon','Hot Air Balloon','Heat,Fire,Air,Sky,Wind','Balloon')
rule('ship','Ship','Sailboat,Sail,Wood,Sea','Tool,Engineering,Metal,Trade,Navigation')
rule('compass','Compass','Map,Navigation,Explorer,Ship','Magnet,Metal,Iron,Sun,Star')
rule('lighthouse','Lighthouse','Sea,Ocean,Harbor,Coast','Light,House,Tower,Electricity,Fire')
rule('sonar','Sonar','Ship,Submarine,Ocean,Sea','Sound,Wave,Electricity,Engineering')
# Food and everyday creativity
rule('dough','Dough','Flour,Yeast,Grain','Water,Milk,Oil,Butter,Egg')
rule('bread','Bread','Dough,Flour,Yeast','Heat,Fire,Oven,Campfire,Kiln')
rule('soup','Soup','Water,Vegetable,Carrot,Potato,Onion','Heat,Fire,Chef,Kitchen,Campfire')
rule('tea','Tea','Water,Mint,Herb,Leaf','Heat,Fire,Campfire,Tool,Sun')
rule('popcorn','Popcorn','Corn,Seed,Grain','Heat,Fire,Campfire,Oil,Sun')
rule('cake','Cake','Flour,Dough,Pastry,Butter','Sugar,Cream,Milk,Chocolate,Heat')
rule('cookie','Cookie','Flour,Dough,Butter','Sugar,Chocolate,Heat,Fire,Oven')
rule('jam','Jam','Fruit,Orchard,Apple,Strawberry','Sugar,Honey,Heat,Fire,Sun')
rule('ice-cream','Ice Cream','Ice,Snow,Milk,Cream','Sugar,Vanilla,Chocolate,Fruit,Cold')
rule('butter','Butter','Milk,Cream','Tool,Heat,Chef,Time,Churn')
rule('cheese','Cheese','Milk,Cream','Time,Heat,Chef,Microbe,Yeast')
rule('lemonade','Lemonade','Lemon,Fruit','Water,Ice,Sugar,Honey,Sun')
rule('pasta','Pasta','Flour,Dough,Water','Egg,Heat,Chef,Tool,Oil')
rule('salad','Salad','Vegetable,Tomato,Leaf','Herb,Oil,Fruit,Chef,Water')
rule('cooking','Cooking','Food,Vegetable,Fish,Potato,Meat','Heat,Fire,Chef,Kitchen,Campfire')
rule('book','Book','Writing,Paper,Ink,Language','Knowledge,History,Art,Story,Science')
rule('song','Song','Birdsong,Music,Melody,Lyrics','Voice,Sound,Human,Choir,Time')
rule('melody','Melody','Music,Piano,Guitar,Flute','Sound,Rhythm,Harmony,Song,Time')
rule('orchestra','Orchestra','Violin,Piano,Flute,Guitar','Music,Harmony,Concert,Choir,Sound')
rule('village','Village','House,Farm,Building,Family','Society,Trade,Field,People,House')
rule('city','City','Village,House,Architecture,Building','Society,Factory,Industry,Trade,Engineering')

# Explicit curated substitutions for words that have no catalog element, maintained as a review list.
# If a term already exists, always use that exact name, never an alias.
ALIASES.update({'Cold':'Frost','Winter':'Snow','Grass':'Plant','Leaf':'Plant','Shade':'Shadow',
 'Quartz':'Crystal','Gravel':'Stone','Mineral':'Crystal','Log':'Wood','Coast':'Sea','Shell':'Seashell',
 'Microbe':'Life','Dawn':'Sun','Sunlight':'Sun','Magnetism':'Electricity','Communication':'Language',
 'Summer':'Sun','Cliff':'Canyon','Spring':'Hot Spring','Street':'City','Swamp':'Marsh',
 'Building':'House','Architecture':'Engineering','People':'Human','Grain':'Rice','Corn':'Rice',
 'Oven':'Kiln','Kitchen':'House','Churn':'Tool','Meat':'Fish','Apple':'Fruit',
 'Strawberry':'Fruit','Silk':'Paper','Canvas':'Paper','Magnet':'Metal','Harbor':'Port',
 'Game':'Video Game','Story':'History','Voice':'Sound','Lyrics':'Writing','Time':'Time',
 'Fog':'Fog','Space':'Space','Science':'Science','Arrow':'Compass','Sail':'Sail','Silicon':'Silicon'})
for theme,out,left,right in RULES:
    for a in left:
        for b in right:
            record(ALIASES.get(a,a),ALIASES.get(b,b),ALIASES.get(out,out),theme)
# Old pairs are immutable: V44 never replaces them, including reverse-ingredient duplicates.
assert all(k not in base for k in chosen)
for item in new_items:
    route_count=sum(v[0]==item['id'] for v in chosen.values())
    if route_count<2:raise RuntimeError(f'V44 new element needs multiple paths: {item["name"]}: {route_count}')
pack={'items':new_items,'recipes':[[*key.split('|'),out] for key,(out,_) in sorted(chosen.items())]}
(ROOT/'client/src/organic-pack-v44.js').write_text('export const ORGANIC_V44 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n')
report={'release':'V44','old_elements':len(snap['items']),'old_recipes':len(base),'new_elements':len(new_items),'added_recipes':len(chosen),'curated_rule_sets':len(RULES),'historical_pairs_preserved':True,'old_pairs_encountered':sum(existing.values()),'competing_proposals_rejected':len(conflicts),'conflict_examples':conflicts[:40],'theme_yields':dict(added),'new_result_routes':{item['name']:sum(r[2]==item['id'] for r in pack['recipes']) for item in new_items}}
(ROOT/'shared/v44-density-generation.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:report[k] for k in ['new_elements','added_recipes','curated_rule_sets','old_pairs_encountered','competing_proposals_rejected','new_result_routes']},indent=2))
