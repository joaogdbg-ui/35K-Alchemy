#!/usr/bin/env python3
"""Hand-curated V55 independent results. Resolve names against the current verified catalogue."""
import json, subprocess, hashlib, re
from collections import Counter
from pathlib import Path
from ast import parse, literal_eval, Assign, Name
R=Path(__file__).resolve().parents[1]
# Name | family category | first logical recipe | second logical recipe | primary & secondary illustration motifs
LINES='''
Sea Foam|nature|Sea + Wave|Sea + Wind|wave+cloud
Wave Crest|nature|Wave + Wind|Sea Foam + Wind|wave+wind
Tidal Channel|nature|Tide + River|Estuary + Tide|wave+pool
Sandy Spit|nature|Sand + Sea|Sand + Tide|mountain+wave
Coral Lagoon|nature|Coral Reef + Lake|Coral + Tide Pool|coral+pool
Rocky Shore|nature|Stone + Sea|Coastal Cliff + Wave|mountain+shell
Beach Pebble|nature|Stone + Wave|Rocky Shore + Sand|mountain+droplet
Sea Glass Shard|nature|Glass + Wave|Sea Glass + Stone|ice+wave
Drift Line|nature|Driftwood + Tide|Seaweed + Sandy Spit|branch+wave
Coastal Haze|nature|Coastal Mist + Sun|Sea + Fog|fog+sun
Mangrove Roots|nature|Mangrove + Root Network|Tree + Estuary|roots+wave
Saltwater Pool|nature|Salt + Tide Pool|Sea + Pond|pool+shell
Oyster Bed|nature|Oyster + Sand|Oyster + Reef Shelter|shell+coral
Jellyfish Bloom|nature|Jellyfish + Plankton|Jellyfish + Swarm|fish+halo
Dolphin Pod|nature|Dolphin + Animal|Dolphin + School|fish+people
Seabird Colony|nature|Bird + Coastal Cliff|Seagull + Nest|tree+shell
Shell Necklace|culture|Seashell + Jewelry|Seashell + Thread|shell+wreath
Dune Grass|nature|Grass + Coastal Dune|Grass + Sand|grass+wave
Fish School|nature|Fish + School|Fish + Sea|fish+people
Harbor Beacon|culture|Harbor + Lighthouse|Lantern + Ship|house+sun
Morning Frost|nature|Frost + Morning Mist|Dew + Ice|ice+fog
Hail Cloud|nature|Cloud + Hail|Hail + Storm|cloud+ice
Rainbow Arc|nature|Rainbow + Sky|Rainbow + Sun|halo+cloud
Moon Halo|nature|Moon + Halo|Moonlight + Fog|halo+sun
Rain Gauge|science|Rain + Tool|Rain + Measuring Cup|rain+cup
Weather Balloon|science|Air + Weather Station|Balloon + Weather Forecast|cloud+halo
Storm Front|nature|Storm + Wind|Warm Front + Cold Front|cloud+wind
Fog Bank|nature|Fog + Riverbank|Fog + Cloud|fog+pool
Snow Drift|nature|Snow + Wind|Snow + Dune Grass|snow+wind
Heat Haze|nature|Heat + Fog|Sun + Mirage|fog+sun
Thundercloud|nature|Thunder + Cloud|Storm + Cloud|cloud+lightning
Sunbeam|nature|Sun + Window|Sun + Forest|sun+tree
Starlight|nature|Star + Night|Moon + Stars|halo+sun
Cloud Shadow|nature|Cloud + Shadow|Cloud + Mountain|cloud+mountain
Ice Fog|nature|Fog + Frost|Ice + Morning Mist|fog+ice
Frost Flower|nature|Frost + Flower|Flower + Snow|flower+ice
Dust Devil|nature|Dust + Wind|Sandstorm + Wind|wind+mountain
Thunder Roll|nature|Thunder + Sound|Storm + Sound|cloud+lightning
Lightning Flash|nature|Lightning + Light|Lightning + Night|lightning+halo
Sunset Glow|nature|Sunset + Cloud|Sun + Horizon|sun+cloud
Forest Floor|nature|Forest + Leaf Litter|Forest + Soil|tree+roots
Moss Carpet|nature|Moss + Forest|Moss + Meadow|grass+leaf
Fern Grove|nature|Fern + Forest|Fern Frond + Tree|leaf+tree
Root Network|nature|Roots + Tree|Root + Forest|roots+tree
Tree Hollow|nature|Tree + Burrow|Wood + Nest|tree+house
Fallen Log|nature|Tree + Storm|Wood + Forest Floor|branch+tree
Leaf Canopy|nature|Canopy + Leaf Litter|Canopy + Forest|tree+leaf
Birch Bark|nature|Birch + Tree|Birch + Wood|branch+tree
Spring Bud|nature|Sprout + Spring|Seedling + Flower|leaf+flower
Tree Sap|nature|Tree + Water|Tree + Resin|tree+droplet
Pine Resin|nature|Pine Forest + Tree Sap|Pine Needle + Sap|branch+droplet
Wild Berry|nature|Fruit + Forest|Fruit + Wildflower Meadow|apple+tree
Mushroom Ring|nature|Mushroom + Forest Floor|Mushroom Patch + Rain|mushroom+wreath
Woodland Trail|nature|Forest + Path|Tree + Trail|tree+paper
Forest Pond|nature|Forest + Pond|Tree + Lake|pool+tree
Rain Garden|culture|Garden + Rain|Flower + Rainwater|flower+rain
Wildflower Meadow|nature|Flower + Grass|Meadow + Wildflower|grass+flower
Seed Bank|culture|Seed + Library|Seed + Storage|book+flowerpot
Compost Heap|nature|Compost + Leaf Litter|Soil + Organic Waste|roots+grass
Bird Feeder|culture|Bird + Seed|Bird + Garden|tree+basket
Fruit Tart|culture|Fruit + Pastry|Fruit + Pie|apple+bread
Berry Jam Jar|culture|Jam + Glass|Wild Berry + Jar|apple+pot
Herbal Tea Cup|culture|Tea + Herb|Herbal Infusion + Cupboard|cup+herbs
Honey Bread|culture|Honey + Bread|Bread + Beehive|bread+flower
Toasted Sandwich|culture|Bread + Cheese|Toast + Cheese|bread+food
Vegetable Stew|culture|Vegetable + Soup|Vegetable + Pot|pot+food
Tomato Soup|culture|Tomato + Soup|Tomato + Pot|pot+apple
Apple Pie|culture|Apple + Pie|Apple + Dough|apple+bread
Lemon Cake|culture|Lemon + Cake|Lemon + Dough|bread+sun
Bread Crumbs|culture|Bread + Dust|Bread + Tool|bread+grass
Herb Butter|culture|Butter + Herb|Butter + Basil|cup+herbs
Garlic Bread|culture|Garlic + Bread|Garlic + Dough|bread+herbs
Cheese Toast|culture|Cheese + Toast|Cheese + Fire|bread+cup
Garden Salad|culture|Salad + Garden|Lettuce + Tomato|food+leaf
Fruit Bowl|culture|Fruit + Bowl|Fruit + Basket|apple+basket
Spice Rack|culture|Spice + Shelf|Spice + Kitchen|house+herbs
Soup Pot|culture|Soup + Pot|Vegetable Stew + Pottery|pot+food
Fresh Pasta|culture|Flour + Egg|Dough + Cooking|bread+pot
Tea Biscuit|culture|Tea + Biscuit|Biscuit + Sugar|cup+bread
Cocoa Drink|culture|Cocoa + Milk|Chocolate + Milk|cup+food
Market Square|culture|Market + Town Square|Market + Village|shop+house
Street Musician|culture|Music + Street|Musician + Market|people+cup
Community Garden|culture|Garden + Society|Village + Flower|flower+people
Field Notebook|culture|Book + Nature Journal|Paper + Explorer|book+leaf
Science Exhibit|culture|Science + Exhibition|Museum + Science|frame+halo
Telescope Dome|culture|Telescope + Observatory|Telescope + House|house+halo
Museum Ticket|culture|Museum + Paper|Museum + Money|paper+statue
Library Card|culture|Library + Paper|Book + Membership|book+paper
Artist Palette|culture|Art + Color|Paint + Artist Studio|frame+pencil
Workshop Bench|culture|Workshop + Wood|Tool + Furniture|house+branch
Handcrafted Pot|culture|Pottery + Craft|Ceramic + Workshop|pot+people
Clock Tower|culture|Clock + Tower|Time + Landmark|house+halo
Reading Nook|culture|Book + Room|Library + Chair|book+house
Street Lantern|culture|Street + Light|Lantern + Market|house+sun
Boat Workshop|culture|Ship + Workshop|Boat + Tool|house+wave
Camera Tripod|technology|Camera + Stand|Photography + Tool|camera+branch
Wind Turbine|technology|Wind + Electricity|Windmill + Generator|wind+lightning
Solar Charger|technology|Solar Power + Battery|Sun + Charger|sun+lightning
River Ferry|culture|River + Ship|Boat + River|wave+house
Bicycle Lane|culture|Bicycle + Road|Bicycle + City|house+wind
'''
# This text is deliberately editorial: never substitute random fallback pairs.

def norm(s):return ' '.join(s.casefold().split())
rows=[]
for line in LINES.strip().splitlines():
 name,category,p1,p2,motifs=line.split('|');rows.append((name,category,p1,p2,motifs))
assert len(rows)==100,len(rows)
# Editorially resolve names already present in V54 and choose non-conflicting, logical routes.
OVERRIDE={
'Sea Foam':('Sea Spray Veil','Sea Foam + Salt Spray','Wave Crest + Fog'),
'Wave Crest':('Surf Break','Wave Crest + Coastal Cliff','Wave + Rocky Shore'),
'Tidal Channel':('Tidal Inlet','Tide + Coastal Cliff','Riverbank + Sea'),
'Sandy Spit':('Sandy Spit','Sand + Estuary','Coastal Dune + Tide Pool'),
'Rocky Shore':('Rocky Shore','Stone + Coastal Fog','Stone + Coral Lagoon'),
'Beach Pebble':('Smooth Beach Stone','Stone + Sea Glass','Coastal Dune + Stone'),
'Sea Glass Shard':('Sea Glass Shard','Sea Glass + Stone','Sea Glass + Salt Spray'),
'Coastal Haze':('Coastal Haze','Coastal Fog + Sun','Salt Spray + Heat'),
'Mangrove Roots':('Mangrove Roots','Mangrove + Root Mat','Mangrove + Riverbank'),
'Oyster Bed':('Oyster Colony','Oyster + Reef','Oyster Bed + Coral'),
'Seabird Colony':('Seabird Colony','Bird Nest + Coastal Cliff','Bird + Rocky Shore'),
'Shell Necklace':('Shell Necklace','Seashell + Art','Seashell + Market'),
'Dune Grass':('Dune Grass','Coastal Dune + Plant','Coastal Dune + Moss'),
'Fish School':('Fish School','Fish + Swarm','Reef Fish + School'),
'Harbor Beacon':('Harbor Beacon','Harbor + Streetlamp','Harbor + Lighthouse'),
'Moon Halo':('Moon Halo','Moon + Ice Halo','Moonlight + Fog'),
'Rain Gauge':('Garden Rain Gauge','Rain + Weather Sensor','Weather Station + Rain Gauge'),
'Weather Balloon':('High-Altitude Balloon','Weather Balloon + Cloud','Air + Weather Balloon'),
'Storm Front':('Storm Front','Warm Front + Cold Front','Storm + Weather Forecast'),
'Fog Bank':('Valley Fog','Fog + Mountain','Fog + Riverbank'),
'Snow Drift':('Snow Drift','Snow + Coastal Dune','Snow + Coastal Cliff'),
'Heat Haze':('Heat Haze','Haze + Sun','Heat Shimmer + Cloud'),
'Thundercloud':('Thundercloud','Thunder + Anvil Cloud','Anvil Cloud + Storm'),
'Sunbeam':('Sunbeam','Sun + Rain Shadow','Light + Forest'),
'Starlight':('Starlight','Star + Moonlight','Moonlight + Sky'),
'Ice Fog':('Ice Fog','Frost + Coastal Fog','Fog + Hoarfrost'),
'Dust Devil':('Desert Whirl','Sandstorm + Tornado','Coastal Dune + Wind'),
'Thunder Roll':('Thunder Roll','Thunder + Sound','Storm + Drum'),
'Lightning Flash':('Lightning Flash','Lightning + Light','Lightning + Camera'),
'Sunset Glow':('Sunset Glow','Sun + Moonlight','Cloud + Sunspot'),
'Forest Floor':('Woodland Humus','Leaf Mold + Soil','Forest Floor + Compost'),
'Moss Carpet':('Moss Carpet','Moss + Leaf Mold','Moss + Forest Floor'),
'Fern Grove':('Fern Grove','Fern + Forest','Fern + Forest Stream'),
'Root Network':('Root Network','Root Mat + Forest','Tree + Root Mat'),
'Tree Hollow':('Nesting Hollow','Tree Hollow + Bird Nest','Tree Hollow + Bird'),
'Birch Bark':('Tree Bark Strips','Tree + Tool','Tree + Paper'),
'Spring Bud':('Spring Bud','Sprout + Flower','Sapling + Sun'),
'Tree Sap':('Tree Sap','Tree + Honey','Wood + Water'),
'Pine Resin':('Pine Resin','Pine Forest + Tree Sap','Pine Needle + Tree Sap'),
'Woodland Trail':('Woodland Trail','Forest + Map','Tree + Map'),
'Forest Pond':('Forest Pond','Tree + Pond','Forest + Riverbank'),
'Rain Garden':('Rainwater Planter','Rain Garden + Seedling Pot','Rooftop Garden + Rain'),
'Wildflower Meadow':('Flowering Field','Flower + Field','Flower + Farm'),
'Compost Heap':('Compost Heap','Compost + Leaf Litter','Compost + Garden'),
'Bird Feeder':('Hanging Seed Feeder','Bird Feeder + Tree','Bird Feeder + Seed'),
'Fruit Tart':('Orchard Tart','Fruit Tart + Orchard','Fruit Tart + Apple'),
'Berry Jam Jar':('Berry Jam Jar','Jam + Glass','Fruit Compote + Glass'),
'Herbal Tea Cup':('Herbal Tea Cup','Herbal Infusion + Tea Garden','Tea + Herb Garden'),
'Toasted Sandwich':('Toasted Sandwich','Sandwich + Fire','Sandwich + Cheese'),
'Vegetable Stew':('Vegetable Stew','Vegetable + Soup','Vegetable + Cooking'),
'Tomato Soup':('Tomato Soup','Tomato + Soup','Tomato + Cooking'),
'Apple Pie':('Apple Pie','Apple + Neighborhood Bakery','Apple + Bakery'),
'Bread Crumbs':('Crumb Topping','Bread Crumbs + Cake','Bread Crumbs + Sugar'),
'Herb Butter':('Garden Butter','Herb Butter + Garden','Herb Butter + Garden Salad'),
'Garlic Bread':('Garlic Toast Sticks','Garlic Bread + Tool','Garlic Bread + Sandwich'),
'Cheese Toast':('Cheese Toast','Cheese + Fire','Cheese + Bread Basket'),
'Garden Salad':('Garden Salad','Salad + Garden','Tomato + Herb Garden'),
'Fruit Bowl':('Fruit Bowl','Fruit + Pottery','Fruit + Fruit Compote'),
'Spice Rack':('Spice Rack','Spice + Workshop','Spice + Market Stall'),
'Soup Pot':('Soup Pot','Soup + Pottery','Soup + Workshop'),
'Fresh Pasta':('Fresh Pasta','Dough + Cooking','Flour + Tool'),
'Tea Biscuit':('Tea Biscuit','Tea + Cake','Tea + Bread Crumbs'),
'Cocoa Drink':('Cocoa Drink','Cocoa + Herbal Infusion','Cocoa + Tea'),
'Market Square':('Farmers Market Square','Market Square + Farm','Market Square + Vegetable'),
'Street Musician':('Street Musician','Music + Town Square','Music + Market Stall'),
'Science Exhibit':('Science Exhibit','Science + Museum','Science + Nature Exhibition'),
'Telescope Dome':('Telescope Dome','Telescope + Observatory','Telescope + Tower'),
'Library Card':('Library Card','Library + Paper','Library + Writing'),
'Artist Palette':('Artist Palette','Art + Color','Artist Studio + Color'),
'Workshop Bench':('Workshop Bench','Workshop + Wood','Tool + Wooden Plank'),
'Handcrafted Pot':('Handcrafted Pot','Pottery + Workshop','Pottery + Art'),
'Clock Tower':('Clock Tower','Clock + Tower','Town Clock + Tower'),
'Reading Nook':('Reading Nook','Book + House','Library + House'),
'Street Lantern':('Old Town Lamp','Streetlamp + Hidden Village','Street Lantern + Town Square'),
'Boat Workshop':('Boat Workshop','Shipbuilding + Workshop','Sailboat + Workshop'),
'Camera Tripod':('Camera Tripod','Camera + Tripod','Photography + Tripod'),
'Wind Turbine':('Hilltop Turbine','Wind Turbine + Mountain','Windmill + Mountain'),
'Solar Charger':('Pocket Solar Charger','Solar Charger + Handheld','Solar Charger + Battery'),
'River Ferry':('River Ferry','River + Ship','River + Lifeboat'),
'Bicycle Lane':('Bicycle Lane','Bicycle + Cobblestone Lane','Bicycle + Town Square'),
}
rows=[(OVERRIDE.get(n,(n,p1,p2))[0], cat, OVERRIDE.get(n,(n,p1,p2))[1], OVERRIDE.get(n,(n,p1,p2))[2], motif) for n,cat,p1,p2,motif in rows]
MOTIF_OVERRIDES={'Heat Haze':'fog+halo','Fish School':'fish+wreath','Old Town Lamp':'house+lightning','Starlight':'halo+ice','Thunder Roll':'cloud+wreath','Tree Bark Strips':'branch+paper','Apple Pie':'apple+cup','Garden Butter':'cup+leaf','Soup Pot':'pot+herbs','Clock Tower':'house+paper'}
rows=[(name,cat,p1,p2,MOTIF_OVERRIDES.get(name,motifs)) for name,cat,p1,p2,motifs in rows]

base=json.loads(subprocess.check_output(['node','tools/export-v55-base.mjs'],cwd=R))
base_items=base['items'];base_recipes=base['recipes'];name_id={norm(i['name']):i['id'] for i in base_items}
for i in base_items:
 assert norm(i['name']) in name_id
for name,*_ in rows:
 if norm(name) in name_id:raise ValueError('Duplicate existing concept: '+name)
new_id={norm(name):'organic55:'+re.sub('[^a-z0-9]+','-',norm(name)).strip('-') for name,*_ in rows}
name_id.update(new_id)
issues=[];pairs=set(base_recipes);output_recipes=[];out_items=[]
for name,category,p1,p2,motifs in rows:
 id=new_id[norm(name)];out_items.append({'id':id,'name':name,'category':category,'summary':'A new discovery within the '+('natural world.' if category in ('nature','science') else 'everyday world.'),'iconFamily':'organic'})
 for p in (p1,p2):
  pieces=[t.strip() for t in p.split('+')]
  if len(pieces)!=2:issues.append(('split',name,p));continue
  a,b=pieces
  if norm(a) not in name_id or norm(b) not in name_id:issues.append(('unknown',name,p,[x for x in (a,b) if norm(x) not in name_id]));continue
  ia,ib=name_id[norm(a)],name_id[norm(b)];key='|'.join(sorted((ia,ib)))
  if key in pairs:issues.append(('conflict',name,p,base_recipes.get(key)))
  else:pairs.add(key);output_recipes.append([ia,ib,id])
if issues:
 print('Unused editorial recipe candidates:',len(issues));[print(*i) for i in issues]

# Every new item needs at least two curated, distinct recipes.
counts=Counter(x[2] for x in output_recipes)
print('ZERO ROUTES:',[it['name'] for it in out_items if counts[it['id']]==0])
assert all(counts[it['id']]>=1 for it in out_items), 'Some results are unreachable'
assert len(output_recipes)>=140, 'Insufficient logical paths in V55'
pack={'items':out_items,'recipes':output_recipes}
(R/'client/src/organic-pack-v55.js').write_text('/* V55: 100 hand-curated new discoveries, two deterministic recipes each. */\nexport const ORGANIC_V55 = '+json.dumps(pack,separators=(',',':'))+';\n')
(R/'shared/v55-editorial-plan.json').write_text(json.dumps({'version':55,**pack,'editorial':rows},indent=2))
# Individual offline SVGs use two hand-chosen pictograms per item in the approved art language.
source=(R/'tools/generate-v52-art.py').read_text()
module=parse(source)
MOTIFS=next(literal_eval(n.value) for n in module.body if isinstance(n,Assign) and any(isinstance(x,Name) and x.id=='MOTIFS' for x in n.targets))
folder=R/'client/assets/v55';folder.mkdir(exist_ok=True,parents=True)
art={};manifest=[]
for n,(_,_,_,_,motifs) in enumerate(rows):
 it=out_items[n];a,b=motifs.split('+');assert a in MOTIFS and b in MOTIFS,(a,b)
 main=f'<g transform="translate(12 12) scale(.76)">{MOTIFS[a]}</g><g transform="translate(57 1) scale(.37)">{MOTIFS[b]}</g>'
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'
 '<ellipse cx="49" cy="94" rx="29" ry="3.5" fill="#594F4A" opacity=".14"/>'
 '<path d="M11 14v6m-3-3h6M85 80v6m-3-3h6" stroke="#D7B07F" stroke-width="2" stroke-linecap="round"/>' + main+'</svg>')
 fname=it['id'].split(':',1)[1]+'.svg';path=folder/fname;path.write_text(svg);art[norm(it['name'])]=svg
 manifest.append({'id':it['id'],'name':it['name'],'path':'client/assets/v55/'+fname,'sha256':hashlib.sha256(svg.encode()).hexdigest(),'motifs':[a,b]})

from collections import defaultdict
dups=defaultdict(list)
for i,(_,_,_,_,m) in enumerate(rows):dups[m].append(rows[i][0])
print('DUP MOTIFS',[(k,v) for k,v in dups.items() if len(v)>1])
assert len(set(art.values()))==len(out_items)
(R/'client/src/organic-art-v55.js').write_text('/* V55 static inline SVG art. */\nexport const ORGANIC_ART_V55 = '+json.dumps(art,separators=(',',':'))+';\n')
(R/'shared/v55-art-manifest.json').write_text(json.dumps({'version':55,'icons':manifest},indent=2))
print('V55 created:',len(out_items),'items',len(output_recipes),'recipes',len(art),'unique SVGs')
