#!/usr/bin/env python3
"""V43 handcrafted semantic pair authoring. Deterministic source generator, NEVER game-time guessing."""
from pathlib import Path
from collections import defaultdict
import json, re
root=Path(__file__).resolve().parents[1]
base=json.loads((root/'shared/v42-catalog-snapshot.json').read_text()) if (root/'shared/v42-catalog-snapshot.json').exists() else None
if base is None:
    raise SystemExit('Extract canonical V42 with tools/tmp-inspect-v42.mjs first')
items=base['items']; names={x['name'].casefold():x['id'] for x in items}; old=dict(base['recipes']);
new_names=['Smoke','Ash','Sandstorm','Wildfire','Puddle','Soot','Smog','Mudslide','Sunshower','Haze','Slush','Charcoal']
categories=['nature','material','nature','nature','nature','material','nature','nature','nature','nature','nature','material']
summaries=[
 'A drifting cloud of fine particles produced by incomplete burning.',
 'Powdery mineral residue left after something burns.',
 'A powerful dusty wind that obscures the landscape.',
 'An uncontrolled fire spreading through natural vegetation.',
 'A small pool of water left on the ground after rain.',
 'Fine black carbon particles left by smoky flames.',
 'Polluted haze made of smoke mixed with fog.',
 'Earth and water sliding down a steep slope.',
 'Sunlight shining while rain is still falling.',
 'Fine suspended particles or moisture blurring the view.',
 'Snow and ice melting into wet, mushy water.',
 'A lightweight black fuel made by slowly heating wood.']
news={n.casefold():f'organic43:{re.sub(r"[^a-z0-9]+","-",n.lower()).strip("-")}' for n in new_names}
names.update(news)
new_items=[dict(id=news[n.lower()],name=n,category=c,summary=s,iconFamily='organic') for n,c,s in zip(new_names,categories,summaries)]
for i in new_items:
    if i['name'].lower() not in names:raise AssertionError(i)
# Every manual pair means two named ingredients make a carefully selected existing or new concept.
# No learning engine, generic category-to-result random fallback, or runtime content generation.
manual='''
Air + Continent = Sky
Air + Dust = Haze
Air + Heat = Heatwave
Air + Mud = Dust
Air + Sea = Wave
Air + Wind = Wind
Continent + Continent = Planet
Continent + Dust = Desert
Continent + Energy = Life
Continent + Fire = Wildfire
Continent + Heat = Drought
Continent + Lava = Volcano
Continent + Mud = Soil
Continent + Rain = Forest
Continent + Steam = Cloud
Continent + Water = River
Continent + Wind = Weather
Dust + Dust = Sand
Dust + Earth = Soil
Dust + Energy = Explosion
Dust + Fire = Explosion
Dust + Heat = Haze
Dust + Lava = Pumice
Dust + Mud = Clay
Dust + Rain = Mud
Dust + Sea = Sediment
Dust + Steam = Haze
Dust + Water = Mud
Dust + Wind = Sandstorm
Earth + Energy = Life
Earth + Heat = Desert
Earth + Mud = Soil
Earth + Wind = Erosion
Energy + Energy = Power
Energy + Heat = Fire
Energy + Lava = Volcano
Energy + Mud = Life
Energy + Rain = Lightning
Energy + Sea = Wave
Energy + Steam = Electricity
Energy + Water = Electricity
Energy + Wind = Wind Turbine
Fire + Heat = Lava
Fire + Lava = Volcano
Fire + Rain = Steam
Fire + Steam = Energy
Fire + Wind = Wildfire
Heat + Heat = Fire
Heat + Lava = Volcano
Heat + Mud = Clay
Heat + Rain = Steam
Heat + Sea = Steam
Heat + Steam = Energy
Heat + Wind = Heatwave
Lava + Lava = Volcano
Lava + Mud = Stone
Lava + Rain = Stone
Lava + Sea = Stone
Lava + Steam = Geyser
Lava + Wind = Pumice
Mud + Mud = Clay
Mud + Rain = Mud
Mud + Sea = Sediment
Mud + Steam = Clay
Mud + Water = Mud
Mud + Wind = Dust
Rain + Rain = Flood
Rain + Sea = Ocean
Rain + Steam = Cloud
Rain + Water = River
Sea + Sea = Ocean
Sea + Steam = Cloud
Sea + Water = Ocean
Steam + Steam = Cloud
Steam + Water = Water
Steam + Wind = Cloud
Wind + Wind = Tornado
Fire + Paper = Ash
Fire + Wood = Smoke
Fire + Forest = Wildfire
Wood + Heat = Charcoal
Smoke + Fog = Smog
Rain + Sun = Sunshower
Sun + Drizzle = Sunshower
Water + Snow = Slush
Rain + Soil = Mud
Mud + Mountain = Mudslide
Dust + Smoke = Soot
Steam + Dust = Haze
Water + Earth = Mud
Wind + Sand = Sandstorm
Water + Water = Lake
Puddle + Sun = Steam
Puddle + Cold = Ice
Smoke + Rain = Smog
Ash + Water = Mud
Charcoal + Fire = Heat
'''
# A rule is a curated, meaningful family of pair-specific recipes; output is deterministic and static.
# Format: (theme, result, left named inputs, right named inputs).
RULES=[]
def rule(theme,out,a,b):RULES.append(dict(theme=theme,out=out,a=[x.strip() for x in a.split(',') if x.strip()],b=[x.strip() for x in b.split(',') if x.strip()]))
# Physics & weather
rule('evaporation','Steam','Fire,Heat,Lava,Volcano,Geyser','Water,Rain,Sea,Ocean,River,Lake,Pond,Waterfall')
rule('melting','Water','Fire,Heat,Sun,Lava','Ice,Snow,Glacier,Iceberg,Frost,Slush')
rule('freezing','Ice','Ice,Snow,Frost,Blizzard','Water,Rain,Puddle,Lake,Pond')
rule('condensation','Cloud','Steam,Mist,Fog','Air,Wind,Cold,Cloud,Sea')
rule('cloud-forming','Rain','Cloud,Storm,Thunderstorm,Monsoon','Water,Steam,Mist,Humidity')
rule('fog-forming','Fog','Water,Sea,River,Lake,Pond,Marsh,Bog,Ocean','Cold,Air,Mist')
rule('mist-forming','Mist','Steam,Water,Sea,Lake,Ocean,River','Air,Wind,Cloud')
rule('groundwater','Puddle','Rain,Drizzle,Monsoon,Thunderstorm','Earth,Soil,Stone,Concrete,Brick,Rock')
rule('storm-wind','Storm','Wind,Cloud,Rain,Sea','Energy,Lightning,Thunder')
rule('rainbow','Rainbow','Rain,Water,Drizzle,Mist,Waterfall','Sun,Light')
rule('sunshower','Sunshower','Sun,Sunlight','Rain,Drizzle,Monsoon')
rule('sunlight-haze','Haze','Heat,Sun,Fire,Smoke,Dust','Air,Wind,Cloud,Fog')
rule('wind-blown-sand','Sandstorm','Wind,Storm,Hurricane,Tornado','Sand,Dust,Desert,Drought')
rule('wind-blown-sea','Wave','Wind,Storm,Hurricane,Tornado','Sea,Ocean,Lake,Water')
rule('tides','Tide','Moon,Gravity','Sea,Ocean,Water,Wave')
rule('ice-storm','Blizzard','Snow,Ice,Frost,Glacier','Wind,Storm,Hurricane')
rule('wet-snow','Slush','Snow,Ice,Frost,Hail','Water,Rain,Drizzle,Heat')
rule('mudslides','Mudslide','Mud,Rain,Monsoon,Flood,Storm','Mountain,Cliff,Hill,Canyon,Earth,Soil')
rule('floods','Flood','Rain,Monsoon,Storm,Thunderstorm,Water','River,Lake,Pond,Marsh,Delta')
rule('droughts','Drought','Heat,Sun,Heatwave,Fire','Soil,Earth,Field,Farm,Desert')
rule('erosion','Erosion','Rain,River,Water,Wave,Wind,Storm','Stone,Rock,Earth,Mountain,Canyon,Sand')
rule('sediment','Sediment','Erosion,River,Water,Wave','Stone,Rock,Sand,Dust,Mud,Soil')
rule('silt-mud','Mud','Rain,Drizzle,Water,River,Lake,Puddle','Earth,Soil,Dust,Sand,Clay')
rule('clay-from-mud','Clay','Mud,Soil,Earth','Water,Rain,River,Stone')
rule('mineral-stone','Stone','Lava,Magma Chamber,Volcano','Water,Rain,Sea,Ocean,Cold')
rule('volcanic-ash','Ash','Volcano,Lava,Magma Chamber','Air,Cloud,Wind,Water')
rule('geyser','Geyser','Lava,Volcano,Heat,Magma Chamber','Water,Sea,River,Lake,Spring')
rule('pumice','Pumice','Lava,Volcano','Air,Steam,Wave,Water')
rule('obsidian','Obsidian','Lava,Volcano','Ice,Glass,Water,Sea')
rule('sea-salt','Salt','Sea,Ocean','Heat,Sun,Fire,Evaporation,Crystal')
rule('salty-ocean','Ocean','Sea,Water,Lake,River','Sea,Ocean,Water,Island')
rule('pond-water','Pond','Puddle,Rain','Puddle,Water,River,Field')
# Combustion; avoid adding generic arbitrary element outcomes
rule('burning-wood','Smoke','Fire,Heat,Lightning,Wildfire','Wood,Tree,Forest,Paper,Fuel,Oil,Coal,Charcoal')
rule('burning-plant','Ash','Fire,Wildfire,Lava','Plant,Flower,Tree,Forest,Paper,Wood,Seed')
rule('smoke-residue','Soot','Smoke,Wildfire','Stone,Glass,House,Metal,Brick,Paper')
rule('smog','Smog','Smoke,Soot','Fog,Mist,Haze,City,Industry,Factory')
rule('wildfire','Wildfire','Fire,Heat,Lightning','Forest,Tree,Field,Grass,Plant,Drought')
rule('charcoal','Charcoal','Wood,Tree,Coal','Heat,Kiln,Fire')
rule('smoke-cloud','Cloud','Smoke,Steam','Air,Cloud,Wind')
rule('smoky-haze','Haze','Soot,Smoke,Ash,Dust','Air,Wind,Heat,Sun')
rule('fire-intensity','Heat','Fire,Flame,Wildfire','Coal,Oil,Fuel,Charcoal,Wood')
rule('fire-energy','Energy','Heat,Fire,Lightning','Coal,Fuel,Oil,Electricity')
# Organisms and habitats
rule('watering-plant','Plant','Plant,Seed,Sprout,Sapling','Rain,Water,River,Lake,Pond')
rule('growth-sprout','Sprout','Seed,Plant','Rain,Water,Soil,Sun')
rule('plant-growth','Flower','Sprout,Plant,Seed','Sun,Rain,Water,Garden')
rule('forest','Forest','Tree,Sapling,Plant','Tree,Soil,Rain,Field,Earth')
rule('garden','Garden','Flower,Plant,Seed,Sprout','Soil,Field,Water,House')
rule('rainforest','Rainforest','Forest,Tree','Rain,Water,Cloud,Monsoon')
rule('compost','Compost','Plant,Wood,Leaf,Tree,Grass','Soil,Earth,Mushroom,Water')
rule('mushrooms','Mushroom','Forest,Tree,Wood,Soil','Rain,Mud,Shade,Moss')
rule('moss','Moss','Stone,Rock,Forest,Tree','Water,Rain,Mist,Fog')
rule('algae','Algae','Sea,Ocean,Pond,Lake,Water','Sun,Plant,Life')
rule('plankton','Plankton','Sea,Ocean,Water,Algae','Sun,Life,Rain')
rule('fish','Fish','Sea,Ocean,River,Lake,Pond','Life,Animal,Plankton,Water')
rule('coral-reef','Coral Reef','Coral,Reef,Sea','Animal,Fish,Life,Ocean')
rule('bee-pollen','Pollination','Bee,Butterfly,Insect','Flower,Pollen,Plant,Garden')
rule('honey','Honey','Bee,Beehive','Flower,Nectar,Pollen,Garden')
rule('flower-fruit','Fruit','Flower,Tree,Orchard','Sun,Rain,Plant,Water')
rule('wetland','Wetland','Marsh,Bog,Swamp,Water,Pond','Grass,Plant,Tree,Soil,Earth')
rule('mangrove','Mangrove','Tree,Forest,Plant','Marsh,Lagoon,Sea,Ocean,Salt Marsh')
rule('life-ground','Life','Water,Rain,Sea,Ocean,Earth,Mud','Energy,Sun,Heat')
rule('fossil','Fossil','Animal,Fish,Tree,Plant,Bone','Stone,Rock,Earth,Sediment,Pressure')
# Materials / industry
rule('sand-glass','Glass','Sand,Quartzite,Crystal','Heat,Fire,Kiln,Lightning')
rule('clay-brick','Brick','Clay,Mud','Fire,Heat,Kiln,Stone')
rule('clay-ceramic','Ceramic','Clay,Mud,Pottery','Fire,Heat,Kiln')
rule('metal-iron','Iron','Metal,Rock','Heat,Fire,Factory,Mining')
rule('electric-wires','Wire','Metal,Copper,Iron','Electricity,Tool,Engineering')
rule('electric-circuit','Circuit','Wire,Electricity','Metal,Computer,Energy')
rule('battery','Battery','Electricity,Energy','Metal,Copper,Tool,Factory')
rule('solar-power','Solar Power','Sun,Light','Solar Panel,Energy,Electricity')
rule('wind-power','Wind Turbine','Wind,Storm','Turbine,Wheel,Energy,Electricity')
rule('motor','Motor','Electricity,Energy,Battery','Wheel,Gear,Tool,Wire')
rule('factory','Factory','Engineering,Industry,Robot','Metal,Tool,Machine,Power')
# Food and kitchens
rule('grain-flour','Flour','Wheat,Rice,Seed,Grain','Stone,Tool,Mill,Factory')
rule('mixing-dough','Dough','Flour','Water,Milk,Oil,Yeast')
rule('baking-bread','Bread','Dough,Flour,Yeast','Fire,Heat,Kiln,Oven')
rule('food-cooking','Cooking','Food,Vegetable,Fish,Meat,Soup','Heat,Fire,Chef,Kitchen')
rule('sugar-syrup','Syrup','Sugar,Honey,Caramel','Water,Heat,Sun')
rule('honey-tea','Tea','Water,Rain,Leaf,Mint,Herb','Heat,Fire,Kettle')
rule('soup','Soup','Water,Vegetable,Carrot,Potato,Onion','Heat,Fire,Pot,Chef')
rule('jam','Jam','Fruit,Strawberry,Apple','Sugar,Heat,Honey')
rule('cake','Cake','Flour,Dough,Pastry','Sugar,Butter,Cream,Heat')
rule('dessert','Ice Cream','Ice,Snow,Cream,Milk','Sugar,Chocolate,Vanilla,Fruit')
# Optics, navigation, culture
rule('camera-photo','Photograph','Camera,Digital Camera,Photographer,Film','Light,Sun,Flash,Portrait')
rule('light-prism','Rainbow','Prism,Glass,Crystal','Sun,Light,Rain,Water')
rule('science-optics','Optics','Lens,Prism,Glass','Light,Science,Camera')
rule('film-development','Negative','Film,Photograph','Darkroom,Exposure,Light')
rule('map-direction','Compass','Map,Navigation,Explorer','Magnet,Metal,Iron,Ship')
rule('star-navigation','Navigation','Star,Sun,Constellation,Compass','Map,Ship,Sea,Ocean')
rule('lighthouse','Lighthouse','Sea,Ocean,Harbor,Port','Light,House,Tower')
rule('music-rhythm','Rhythm','Music,Drum,Drum Kit,Sound','Time,Beat,Clock')
rule('melody','Melody','Music,Guitar,Piano,Sound','Rhythm,Instrument,Song')
rule('story-book','Book','Writing,Paper,Language','Knowledge,History,Art,Story')
rule('city-architecture','City','House,Village,Building','Society,Trade,Technology,Industry')
rule('stone-building','House','Brick,Concrete,Stone,Wood','Tool,Architecture,Engineering')

# Expand the finite editorial rules; skip existing legacy outcomes without overwriting.
chosen={}; audit=[]; stats=defaultdict(lambda:defaultdict(int))
ALIAS={
 'Architecture':'Engineering','Bone':'Fossil','Building':'House','Cliff':'Canyon',
 'Cold':'Frost','Evaporation':'Steam','Flame':'Fire','Grain':'Rice',
 'Grass':'Plant','Hill':'Mountain','Instrument':'Guitar','Kettle':'Tool',
 'Kitchen':'House','Leaf':'Plant','Machine':'Robot','Magnet':'Metal',
 'Meat':'Fish','Mill':'Tool','Mining':'Tool','Oven':'Kiln',
 'Pot':'Tool','Shade':'Shadow','Spring':'Hot Spring','Story':'History',
 'Strawberry':'Fruit','Sunlight':'Sun','Swamp':'Marsh','Technology':'Engineering',
 'Wheat':'Rice'}
def get_id(name):
    k=ALIAS.get(name,name).casefold();
    if k not in names:raise KeyError(f'Unrecognised editorial element {name!r}')
    return names[k]
def add(a,b,out,tag):
    a,b,out=get_id(a),get_id(b),get_id(out)
    key='|'.join(sorted((a,b)))
    if key in old:
        stats[tag]['preserved_legacy']+=1
        return
    if key in chosen:
        if chosen[key][0]!=out:
            stats[tag]['overlapping_rule']+=1
            audit.append({'pair':key,'first':chosen[key][0],'competing':out,'rule':tag})
        else:stats[tag]['same_new_pair']+=1
        return
    chosen[key]=(out,tag);stats[tag]['added']+=1
for line in manual.strip().splitlines():
    if not line.strip() or line.startswith('#'):continue
    a,b=line.split('=',1)[0].split('+',1)
    out=line.split('=',1)[1]
    add(a.strip(),b.strip(),out.strip(),'first-14')
for r in RULES:
    for a in r['a']:
        for b in r['b']:
            add(a,b,r['out'],r['theme'])
# Every new discovery is reachable through at least two genuine recipes; check at runtime too.
for name in new_names:
    n=sum(out==news[name.lower()] for out,_ in chosen.values())
    if n<2:raise ValueError(f"New element {name} has only {n} unique crafting routes")
recipes=[(*key.split('|'),out) for key,(out,tag) in sorted(chosen.items())]
pack={'items':new_items,'recipes':recipes}
(root/'client/src/organic-pack-v43.js').write_text('export const ORGANIC_V43 = '+json.dumps(pack,separators=(',',':'),ensure_ascii=False)+';\n')
report={'edition':'V43','scope':'Curated early-game and semantic cross-family coverage','old_recipes':len(old),'new_recipe_pairs':len(chosen),'new_elements':len(new_items),'total_recipes':len(old)+len(chosen),'items':len(items)+len(new_items),'rules':len(RULES),'stats':{k:dict(v) for k,v in stats.items()},'competing_new_rule_proposals':audit}
(root/'shared/v43-density-generation.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print('Created',len(chosen),'additional recipes and',len(new_items),'new elements; proposals requiring editorial attention',len(audit))
print('New items',[(n,sum(out==news[n.lower()] for out,_ in chosen.values())) for n in new_names])
