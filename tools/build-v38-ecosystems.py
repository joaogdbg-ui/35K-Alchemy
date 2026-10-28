#!/usr/bin/env python3
"""V38 curated ecology & everyday-life expansion. Stable names, independently drawn icons.

No combinatorial generator: every entry and result is authored, then graph/collision checked.
SVG images are locally authored vector art, with no network, fonts or runtime generators.
"""
from pathlib import Path
import json,subprocess,re
ROOT=Path(__file__).resolve().parents[1]
# NAME | CATEGORY | DESCRIPTION | result recipes (unordered). All recipes are explicitly editorial.
ROWS='''

Volcano|nature|An opening in the crust through which molten rock and ash can erupt.|Mountain + Lava; Mountain + Fire; Earth + Lava
Insect|life|A six-legged animal with a segmented body and a tough outer covering.|Garden + Air; Butterfly + Animal; Caterpillar + Air
Bird|life|A warm-blooded feathered animal, usually adapted for flight.|Animal + Air; Animal + Sky; Tree + Air
Milk|culture|A nutritious liquid produced by mammals to feed their young.|Animal + Farm; Animal + Food; Farm + Water
Sugar|material|A sweet crystalline ingredient obtained from plants.|Fruit + Heat; Harvest + Sun; Honey + Crystal
Salt|material|A crystalline mineral used to season food and preserve ingredients.|Sea + Fire; Ocean + Heat; Sea + Crystal
Lemon|life|A bright yellow citrus fruit with a sharp and refreshing juice.|Fruit + Sun; Orchard + Fruit; Fruit + Flower
Ink|material|A colored liquid that leaves marks on a surface.|Writing + Water; Book + Water; Writing + Plant
Herb|life|An aromatic plant valued for flavor, fragrance or remedies.|Garden + Plant; Flower + Plant; Garden + Seed
Bean|life|An edible plant seed, often rich in protein and fiber.|Seed + Harvest; Seed + Fruit; Harvest + Vegetable
Cream|culture|The rich fatty portion of milk that can be whipped or churned.|Milk + Food; Milk + Heat; Milk + Water
Spice|material|An aromatic ingredient made from seeds, roots, bark or fruit.|Herb + Food; Herb + Heat; Plant + Chef
Glacier|nature|An enormous slow-moving body of ice that reshapes valleys.|Ice + Mountain; Snow + Mountain; Ice + River
Avalanche|nature|A sudden rush of snow and debris down a steep slope.|Snow + Mountain; Glacier + Wind; Snow + Wind
Iceberg|nature|A floating piece of glacier ice, with most of its mass underwater.|Glacier + Sea; Glacier + Ocean; Ice + Sea
Geyser|nature|A hot spring that periodically shoots boiling water and steam skyward.|Lava + Water; Volcano + River; Earth + Steam
Hot Spring|nature|Groundwater naturally warmed by geothermal heat.|Geyser + Lake; Heat + River; Volcano + Water
Canyon|nature|A deep valley carved by erosion over long stretches of time.|Mountain + Sand; Stone + Wind; River + Dust
Dew|nature|Tiny droplets of water condensed on cool surfaces overnight.|Water + Night; Rain + Plant; Cloud + Garden
Frost|nature|Delicate ice crystals deposited onto a cold surface.|Snow + Plant; Dew + Ice; Ice + Wind
Hail|nature|Balls of ice produced inside powerful storm clouds.|Rain + Ice; Cloud + Ice; Thunderstorm + Snow
Drought|nature|A prolonged shortage of rainfall that leaves the landscape parched.|Sun + Desert; Heat + Desert; Rain + Desert
Oasis|nature|A fertile patch around a reliable water source in arid land.|Desert + Water; Drought + Lake; Desert + Plant
Mirage|science|An optical illusion caused when heat bends light through layers of air.|Desert + Light; Heat + Sky; Oasis + Sun
Delta|nature|A fan of sediment deposited where a river flows into slower water.|River + Sea; River + Sand; River + Ocean
Estuary|nature|A sheltered coastal place where fresh river water mixes with seawater.|River + Tide; River + Ocean; Delta + Sea
Current|nature|A persistent flow of water carrying heat, nutrients and life.|River + Sea; Tide + Wind; Ocean + Wind
Wave|nature|A moving ridge of water driven by wind or a disturbance.|Ocean + Wind; Ocean + Energy; Tide + Ocean
Whirlpool|nature|A rotating funnel of water created by intersecting currents.|Current + Current; Current + Wave; River + Wind
Tide Pool|nature|A miniature shore ecosystem left behind by the receding tide.|Tide + Stone; Tide + Seashell; Sea + Rock
Starfish|life|A star-shaped echinoderm that creeps along the sea floor.|Seashell + Life; Sea + Star; Tide Pool + Life
Sea Urchin|life|A round marine echinoderm defended by sharp spines.|Starfish + Stone; Tide Pool + Animal; Seashell + Plant
Jellyfish|life|A drifting, gelatinous sea creature with trailing tentacles.|Plankton + Sea; Ocean + Cloud; Deep Sea + Life
Squid|life|A swift ten-armed mollusk that propels itself through the sea.|Fish + Ink; Sea + Ink; Deep Sea + Animal
Octopus|life|A remarkably intelligent eight-armed marine mollusk.|Squid + Knowledge; Sea + Knowledge; Squid + Cave
Dolphin|life|A sociable, air-breathing marine mammal known for its intelligence.|Sea + Sound; Ocean + Animal; Fish + Knowledge
Shark|life|A streamlined predatory fish with cartilage instead of bone.|Fish + Tool; Fish + Animal; Deep Sea + Fish
Crab|life|A sideways-walking crustacean wearing its skeleton on the outside.|Seashell + Animal; Tide Pool + Seashell; Animal + Stone; Starfish + Seashell
Lobster|life|A long-bodied marine crustacean often armed with large claws.|Crab + Deep Sea; Crab + Ocean; Crab + Animal
Shrimp|life|A small, agile crustacean important to many marine food webs.|Plankton + Fish; Sea + Insect; Crab + Plankton
Sea Anemone|life|A flowerlike marine animal whose tentacles sting its prey.|Coral Reef + Flower; Sea + Flower; Tide Pool + Plant
Seaweed|life|A broad name for marine algae large enough to notice in the surf.|Algae + Plant; Algae + Wave; Kelp Forest + Tide
Moss|life|A tiny non-flowering plant thriving in damp shady places.|Stone + Rain; Forest + Water; Tree + Dew
Lichen|life|A partnership of fungi and photosynthetic organisms on exposed surfaces.|Moss + Stone; Algae + Mushroom; Rock + Algae
Sprinkler|technology|A simple device that sprays water evenly across a garden or lawn.|Irrigation + Tool; Garden + Water; Tool + Rain
Sapling|life|A young tree grown from a seed and starting to form a woody trunk.|Sprout + Tree; Seed + Tree; Sprout + Forest
Vine|life|A climbing plant that grips nearby structures as it grows.|Sapling + Tree; Plant + Thread; Garden + Tree
Ivy|life|An evergreen climbing plant that scales walls and tree trunks.|Vine + House; Vine + Forest; Plant + Stone
Basil|life|An aromatic culinary herb with soft green leaves.|Herb + Garden; Plant + Chef; Seed + House
Mint|life|A fragrant herb widely used in tea, desserts and cool drinks.|Herb + Water; Plant + Tea; Garden + Tea
Lavender|life|A purple-flowering herb admired for its calming scent.|Flower + Herb; Garden + Flower; Flower + Garden
Cactus|life|A water-storing desert plant protected by spines.|Plant + Desert; Drought + Plant; Seed + Desert
Succulent|life|A plant with fleshy leaves that stores water through dry weather.|Cactus + Garden; Plant + Drought; Plant + Sand
Bonsai|culture|A carefully cultivated miniature tree shaped over many years.|Tree + Art; Tree + Garden; Sapling + Knowledge
Terrarium|culture|A tiny planted landscape enclosed inside a transparent vessel.|Glass + Moss; Glass + Plant; Garden + Glass
Pond|nature|A small body of still water that supports its own ecosystem.|Water + Garden; Lake + Garden; Rain + Garden
Frog|life|An amphibian that begins life underwater and often lives on land.|Pond + Animal; Pond + Life; Rain + Animal
Lotus|life|An aquatic flowering plant with broad floating leaves.|Flower + Pond; Seed + Pond; Pond + Plant
Dragonfly|life|An agile insect whose young live in freshwater.|Pond + Insect; Frog + Insect; Pond + Butterfly
Firefly|life|A beetle whose glowing abdomen helps it communicate after dark.|Insect + Light; Forest + Light; Night + Animal
Cheese|culture|Milk transformed by cultures and enzymes into a rich solid food.|Milk + Time; Milk + Life; Milk + Salt
Butter|culture|A spreadable fat made by churning cream.|Milk + Energy; Milk + Tool; Milk + Heat
Egg|life|A protective package of nourishment for a developing animal.|Bird + Bird Nest; Bird + Farm; Animal + Bird Nest
Omelet|culture|Beaten eggs cooked quickly in a hot pan.|Egg + Heat; Egg + Chef; Egg + Fire
Pasta|culture|A versatile staple made from flour dough and shaped before cooking.|Dough + Chef; Flour + Egg; Dough + Water
Pizza|culture|A baked round of dough topped with sauce, cheese and other foods.|Bread + Cheese; Dough + Cheese; Bakery + Cheese
Tomato|life|A juicy red fruit frequently cooked as a savory vegetable.|Fruit + Vegetable; Seed + Salad; Garden + Fruit
Potato|life|An edible starchy underground tuber.|Root + Farm; Vegetable + Earth; Seed + Soil
Carrot|life|A crunchy orange root vegetable cultivated in gardens.|Vegetable + Root; Seed + Soil; Harvest + Root
Onion|life|An aromatic bulb that brings sweetness and depth to cooked food.|Vegetable + Seed; Root + House; Farm + Seed
Garlic|life|A pungent bulb made up of individual edible cloves.|Onion + Herb; Vegetable + Spice; Onion + Farm
Chocolate|culture|A sweet food made by processing roasted cacao seeds.|Cocoa + Sugar; Cocoa + Milk; Cocoa + Heat
Cocoa|life|Seeds from the cacao tree, used for chocolate and drinks.|Tree + Chocolate; Seed + Forest; Bean + Forest
Coffee|culture|A fragrant drink brewed from roasted coffee beans.|Bean + Heat; Water + Bean; Cocoa + Tea
Cookie|culture|A small baked sweet made from dough, sugar and fat.|Dough + Sugar; Bakery + Butter; Flour + Chocolate
Sandwich|culture|A filling tucked between slices of bread.|Bread + Cheese; Bread + Vegetable; Bread + Egg
Lemonade|culture|A refreshing mixture of citrus juice, water and sweetness.|Lemon + Water; Fruit + Water; Fruit + Sugar
Ice Cream|culture|A frozen, creamy dessert that turns cold into a treat.|Milk + Ice; Sugar + Snow; Cream + Ice
'''
DATA=[]
for line in ROWS.splitlines():
 if not line.strip():continue
 n,c,d,rr=[x.strip() for x in line.split('|')]
 pairs=[tuple(x.strip() for x in s.split('+')) for s in rr.split(';')]
 DATA.append({'name':n,'category':c,'summary':d,'pairs':pairs})
assert len(DATA)==78,len(DATA)
# Catalog index uses FIRST canonical name to retain historic IDs.
script='''import{DATA}from'./client/src/legacy-data.js';import{PACK}from'./client/src/creative-pack.js';import{GAMING_V22}from'./client/src/gaming-pack-v22.js';import{GAMING_V23}from'./client/src/gaming-pack-v23.js';import{GAMING_V24}from'./client/src/gaming-pack-v24.js';import{GAMING_V26}from'./client/src/gaming-pack-v26.js';import{GAMING_V27}from'./client/src/gaming-pack-v27.js';import{GAMING_V30}from'./client/src/gaming-pack-v30.js';import{ORGANIC_V32}from'./client/src/organic-pack-v32.js';import{ORGANIC_V34}from'./client/src/organic-pack-v34.js';import{ORGANIC_V37}from'./client/src/organic-pack-v37.js';let names={};DATA.items.forEach(([n],i)=>names[n.toLowerCase()]??='legacy:'+i);let recipes=DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]);for(const p of[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37]){for(const i of p.items)names[i.name.toLowerCase()]??=i.id;recipes.push(...p.recipes)}console.log(JSON.stringify({names,recipes}));'''
prior=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
names=prior['names']; allpairs={'|'.join(sorted((a,b))):c for a,b,c in prior['recipes']}
new={d['name'].lower():'organic38:'+re.sub('[^a-z0-9]+','-',d['name'].lower()).strip('-') for d in DATA}
assert len(set(new.values()))==len(new)
for n in new:assert n not in names,('Existing name',n,names.get(n))
def resolve(n):
 k=n.lower()
 if k in new:return new[k]
 if k in names:return names[k]
 raise ValueError('Unknown ingredient '+n)
items=[dict(id=new[d['name'].lower()],name=d['name'],category=d['category'],summary=d['summary'],iconFamily='organic') for d in DATA]
recipes=[];conflicts=[]
for d in DATA:
 target=new[d['name'].lower()]
 for a,b in d['pairs']:
  i,j=resolve(a),resolve(b)
  assert target!=i and target!=j,(d['name'],a,b)
  key='|'.join(sorted((i,j)))
  if key in allpairs:
   conflicts.append((d['name'],a,b,allpairs[key]));continue
  allpairs[key]=target;recipes.append([i,j,target])
for d in DATA:
 c=sum(t==new[d['name'].lower()] for _,_,t in recipes)
 if c<2:print("NEEDS ROUTES", d["name"], c, [x for x in conflicts if x[0]==d["name"]])
assert len(recipes)==len(set('|'.join(sorted((a,b))) for a,b,_ in recipes))
(ROOT/'client/src/organic-pack-v38.js').write_text('export const ORGANIC_V38 = '+json.dumps({'version':38,'items':items,'recipes':recipes},ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'shared/v38-content-report.json').write_text(json.dumps({'new_items':len(items),'new_recipes':len(recipes),'omitted_collisions':conflicts},indent=2)+'\n')
print('V38 curated',len(items),'elements',len(recipes),'recipes','excluded collisions',len(conflicts))
if conflicts:print('COLLISIONS',*conflicts,sep='\n')
