#!/usr/bin/env python3
"""V42 authored cross-family recipes. Deterministic and conflict-safe; never overwrites prior recipes."""
from pathlib import Path
import json,re,subprocess,unicodedata
R=Path(__file__).resolve().parents[1]
ROWS=[
# UNDERGROUND GEOLOGY — caves, rock cycle and forces
('Stalactite','nature','A mineral icicle growing down from a cave roof as dripping water leaves deposits.', [('Cave','Water'),('Cave','Rain'),('Limestone','Water'),('Cave','Mineral')]),
('Stalagmite','nature','A cone of stone growing upward where mineral-rich drops reach a cave floor.', [('Stalactite','Earth'),('Cave','Stalactite'),('Stalactite','Stone'),('Limestone','Earth')]),
('Geode','material','A hollow rock lined with crystals formed from mineral-rich solutions.', [('Stone','Crystal'),('Cave','Crystal'),('Rock','Crystal'),('Stalactite','Crystal')]),
('Obsidian','material','A dark volcanic glass formed when molten rock cools very quickly.', [('Lava','Glass'),('Volcano','Glass'),('Lava','Ice'),('Lava','Cold')]),
('Basalt','material','A dark volcanic rock that forms when lava cools and solidifies.', [('Lava','Stone'),('Volcano','Rock'),('Obsidian','Stone'),('Lava','Earth')]),
('Granite','material','A hard speckled rock formed by the slow cooling of magma underground.', [('Mountain','Stone'),('Basalt','Pressure'),('Rock','Pressure'),('Cave','Heat')]),
('Limestone','material','A sedimentary rock frequently built from ancient seashells and marine remains.', [('Stone','Sea'),('Fossil','Stone'),('Rock','Ocean'),('Sediment','Sea')]),
('Marble','material','A patterned stone produced when limestone is transformed by heat and pressure.', [('Limestone','Pressure'),('Limestone','Heat'),('Granite','Art'),('Stone','Sculpture')]),
('Erosion','nature','The gradual wearing away of land by moving water, wind and weather.', [('Mountain','Rain'),('Rock','River'),('Stone','Wind'),('Mountain','Water')]),
('Sediment','material','Small particles of rock and soil carried and deposited by water or wind.', [('Erosion','River'),('Sand','River'),('Mud','River'),('Erosion','Sea')]),
('Amber','material','Golden fossilized tree resin that can preserve insects for millions of years.', [('Tree','Fossil'),('Resin','Time'),('Fossil','Insect'),('Forest','Time')]),
('Quartzite','material','Tough metamorphic rock made when quartz-rich sandstone is heated and compressed.', [('Sand','Pressure'),('Crystal','Pressure'),('Sand','Heat'),('Marble','Sand')]),
('Pumice','material','A lightweight volcanic rock filled with bubbles from trapped volcanic gas.', [('Lava','Air'),('Volcano','Steam'),('Lava','Steam'),('Basalt','Air')]),
('Magma Chamber','nature','An underground reservoir of molten rock that can feed an active volcano.', [('Cave','Lava'),('Volcano','Cave'),('Mountain','Lava'),('Basalt','Heat')]),
('Fault Line','nature','A fracture through the Earth where masses of rock may move past each other.', [('Earth','Pressure'),('Mountain','Pressure'),('Stone','Earthquake'),('Geology','Pressure')]),
('Rock Cycle','science','The continuous transformation of rocks through melting, erosion and pressure.', [('Erosion','Lava'),('Basalt','Sediment'),('Granite','Marble'),('Sediment','Pressure')]),
# WETLAND ECOLOGY — reeds, coasts, ponds, underwater life
('Mangrove','life','A salt-tolerant coastal tree with arching roots that shelter fish and shorelines.', [('Tree','Ocean'),('Forest','Sea'),('Tree','Wetland'),('Root','Estuary')]),
('Otter','life','A playful semi-aquatic mammal that hunts fish in streams and coastal waters.', [('Animal','River'),('Fish','Forest'),('Animal','Wetland'),('River','Beaver')]),
('Heron','life','A tall wading bird that waits patiently for fish in shallow water.', [('Bird','Pond'),('Bird','Wetland'),('Bird','Fish'),('Bird','Marsh')]),
('Tadpole','life','A young amphibian with a tail that transforms as it grows into a frog.', [('Frog','Egg'),('Frog','Pond'),('Frog','Water'),('Egg','Pond')]),
('Newt','life','A small amphibian that spends part of its life in ponds and damp habitats.', [('Salamander','Pond'),('Salamander','Water'),('Frog','Forest'),('Tadpole','Forest')]),
('Marsh','nature','A shallow wetland where grasses and reeds dominate the landscape.', [('Wetland','Grass'),('Pond','Plant'),('Wetland','Plant'),('River','Moss'),('Pond','Field'),('Wetland','River'),('Grasshopper','Wetland')]),
('Bog','nature','An acidic waterlogged habitat that slowly accumulates peat and moss.', [('Wetland','Moss'),('Marsh','Moss'),('Pond','Moss'),('Swamp','Moss')]),
('Lagoon','nature','A shallow body of coastal water sheltered from the open sea.', [('Sea','Island'),('Ocean','Pond'),('Estuary','Island'),('Mangrove','Sea')]),
('Clam','life','A two-shelled mollusc that burrows in sand and filters water for food.', [('Oyster','Sand'),('Pearl','Sand'),('Oyster','Sea'),('Fish','Sand')]),
('Mussel','life','A dark-shelled mollusc that anchors itself to rocks and filters seawater.', [('Clam','Rock'),('Oyster','Rock'),('Clam','Sea'),('Pearl','Rock')]),
('Kelp','life','A large brown seaweed that forms underwater forests in cool coastal water.', [('Seaweed','Forest'),('Algae','Ocean'),('Seaweed','Ocean'),('Plant','Sea')]),
('Reef','nature','A shallow underwater ridge that provides habitat for a wealth of marine life.', [('Coral Reef','Stone'),('Ocean','Rock'),('Coral Reef','Ocean'),('Fish','Rock')]),
('Coral','life','A colony of tiny marine animals that can build remarkable limestone structures.', [('Reef','Life'),('Coral Reef','Life'),('Ocean','Crystal'),('Reef','Animal')]),
('Lily Pad','life','A floating circular leaf that helps an aquatic lily reach sunlight.', [('Pond','Flower'),('Pond','Plant'),('Water','Flower'),('Wetland','Flower'),('Pond','Sun'),('Flower','Wetland'),('Lily Pad','Sun')]),
('Reed','life','A tall flexible wetland plant that bends with the wind beside waterways.', [('Marsh','Plant'),('Wetland','Wind'),('Pond','Tree'),('Marsh','Wood')]),
('Salt Marsh','nature','A coastal wetland where salt-tolerant plants flourish in tidal water.', [('Marsh','Sea'),('Mangrove','Marsh'),('Wetland','Ocean'),('Reed','Sea')]),
# BAKERY AND FLAVOUR — familiar recipes with funny natural results
('Yeast','life','A microscopic fungus that makes dough rise by fermenting sugars.', [('Bread','Life'),('Dough','Life'),('Bread','Mushroom'),('Flour','Mushroom')]),
('Croissant','culture','A buttery layered pastry that bakes into a golden crescent.', [('Pastry','Butter'),('Dough','Butter'),('Pastry','Moon'),('Bread','Butter')]),
('Bagel','culture','A ring-shaped bread traditionally boiled before being baked.', [('Bread','Water'),('Dough','Ring'),('Bread','Ring'),('Dough','Water'),('Bread','Circle'),('Dough','Heat'),('Dough','Steam'),('Bread','Steam')]),
('Pretzel','culture','A baked twisted bread with a distinctive looped shape and golden crust.', [('Dough','Salt'),('Bread','Salt'),('Dough','Knot'),('Bread','Knot')]),
('Pancake','culture','A soft round breakfast cake cooked in a pan from a pourable batter.', [('Flour','Milk'),('Egg','Flour'),('Bread','Milk'),('Dough','Milk')]),
('Waffle','culture','A crisp patterned breakfast cake cooked between two hot patterned plates.', [('Pancake','Tool'),('Pancake','Heat'),('Bread','Grid'),('Pancake','Metal')]),
('Cinnamon','material','A fragrant spice from the dried inner bark of certain evergreen trees.', [('Tree','Spice'),('Wood','Spice'),('Tree','Tea'),('Forest','Spice')]),
('Vanilla','material','A sweet aromatic flavor made from the cured pods of a tropical orchid.', [('Flower','Sugar'),('Flower','Spice'),('Plant','Sugar'),('Flower','Milk')]),
('Cake','culture','A sweet baked dessert often layered with icing for special occasions.', [('Pastry','Sugar'),('Flour','Sugar'),('Bread','Sugar'),('Pancake','Sugar')]),
('Caramel','material','Golden cooked sugar that adds a rich toasted sweetness to desserts.', [('Sugar','Heat'),('Sugar','Fire'),('Sugar','Butter'),('Sugar','Lava')]),
('Popcorn','culture','Light puffed kernels that pop when moisture inside them turns to steam.', [('Grain','Heat'),('Food','Steam'),('Seed','Heat'),('Seed','Fire')]),
('Rice','life','Small edible grains grown on a grass that thrives in flooded fields.', [('Grain','Water'),('Farm','Water'),('Field','Water'),('Seed','Wetland')]),
('Noodles','culture','Long strands of dough cooked in water and enjoyed in countless cuisines.', [('Pasta','Water'),('Dough','Water'),('Flour','Water'),('Pasta','Soup')]),
('Dumpling','culture','A small pocket of dough filled or folded then steamed, boiled or fried.', [('Dough','Soup'),('Dough','Meat'),('Noodles','Food'),('Pastry','Soup')]),
('Syrup','material','A thick sweet liquid made by dissolving sugar or reducing plant juices.', [('Sugar','Water'),('Honey','Water'),('Caramel','Water'),('Sugar','Juice')]),
('Pie','culture','A baked dish with a pastry crust around a sweet or savory filling.', [('Pastry','Fruit'),('Pastry','Jam'),('Dough','Fruit'),('Cake','Fruit')]),
# OPTICS / IMAGE MAKING — lenses, photography and light
('Lens','technology','A shaped transparent piece that bends light to form or magnify images.', [('Glass','Science'),('Camera','Glass'),('Telescope','Glass'),('Light','Glass')]),
('Prism','science','A transparent solid that refracts light and separates it into colors.', [('Crystal','Light'),('Glass','Rainbow'),('Lens','Rainbow'),('Glass','Color')]),
('Optics','science','The scientific study of light, vision, reflections and image formation.', [('Light','Science'),('Lens','Science'),('Prism','Science'),('Camera','Science')]),
('Film','material','A light-sensitive sheet used to capture photographs or moving pictures.', [('Photography','Paper'),('Camera','Paper'),('Camera','Time'),('Cinema','Paper')]),
('Photograph','culture','A captured still image that can preserve a moment of the world.', [('Camera','Light'),('Film','Camera'),('Photography','Memory'),('Camera','Memory')]),
('Negative','technology','A photographic image in which bright and dark tones are inverted.', [('Film','Shadow'),('Photograph','Shadow'),('Film','Light'),('Photography','Shadow')]),
('Darkroom','culture','A light-controlled room where photographic film and prints are developed.', [('Film','House'),('Photography','House'),('Negative','Room'),('Film','Shadow')]),
('Flash','technology','A brief brilliant burst of light used to illuminate a camera scene.', [('Camera','Lightning'),('Photograph','Lightning'),('Light','Electricity'),('Camera','Energy')]),
('Tripod','technology','A stable three-legged stand that keeps cameras steady during exposure.', [('Camera','Wood'),('Camera','Tool'),('Metal','Photography'),('Camera','Metal')]),
('Shutter','technology','A camera mechanism controlling how long light reaches the image sensor.', [('Camera','Time'),('Lens','Time'),('Camera','Clock'),('Camera','Mechanism')]),
('Projector','technology','A device that casts enlarged images onto a distant screen.', [('Light','Film'),('Camera','Cinema'),('Film','Electricity'),('Lens','Cinema')]),
('Slide','technology','A transparent photograph or image intended for projection onto a screen.', [('Photograph','Glass'),('Film','Glass'),('Projector','Photograph'),('Light','Photograph')]),
('Photographer','culture','A person who creates pictures by choosing light, framing and timing.', [('Human','Camera'),('Human','Photography'),('Photograph','Human'),('Art','Camera')]),
('Exposure','science','The amount of light reaching a photographic surface over time.', [('Shutter','Light'),('Film','Light'),('Photograph','Sun'),('Lens','Time')]),
('Portrait','culture','An image that focuses on the likeness and expression of a person.', [('Photograph','Human'),('Painting','Human'),('Photographer','Human'),('Art','Human')]),
('Aperture','technology','An adjustable opening in a lens that controls how much light enters.', [('Lens','Light'),('Lens','Hole'),('Camera','Lens'),('Optics','Camera')]),
]

BASE="""import {DATA} from './client/src/legacy-data.js';
import {PACK} from './client/src/creative-pack.js';
import {GAMING_V22} from './client/src/gaming-pack-v22.js';
import {GAMING_V23} from './client/src/gaming-pack-v23.js';
import {GAMING_V24} from './client/src/gaming-pack-v24.js';
import {GAMING_V26} from './client/src/gaming-pack-v26.js';
import {GAMING_V27} from './client/src/gaming-pack-v27.js';
import {GAMING_V30} from './client/src/gaming-pack-v30.js';
import {ORGANIC_V32} from './client/src/organic-pack-v32.js';
import {ORGANIC_V34} from './client/src/organic-pack-v34.js';
import {ORGANIC_V37} from './client/src/organic-pack-v37.js';
import {ORGANIC_V38} from './client/src/organic-pack-v38.js';
import {ORGANIC_V40} from './client/src/organic-pack-v40.js';
import {ORGANIC_V41} from './client/src/organic-pack-v41.js';
import {buildCatalog} from './client/src/catalog-integrity.js';
const cat=buildCatalog(DATA,[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41]);
console.log(JSON.stringify({items:cat.items,recipes:[...cat.recipes]}));"""

def slug(s):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s.lower())).strip('-')

def build():
 assert len(ROWS)==64
 base=json.loads(subprocess.check_output(['node','--input-type=module','-e',BASE],cwd=R,text=True))
 names={i['name'].casefold():i['id'] for i in base['items']};existing_ids=set(names.values())
 used=set(base['recipes'][i][0] for i in range(len(base['recipes'])))
 items=[];recipes=[];plan=[]
 for name,category,summary,candidates in ROWS:
  assert name.casefold() not in names, 'Duplicate name '+name
  assert len(summary)>55, name
  ident='organic42:'+slug(name)
  assert ident not in existing_ids,name
  names[name.casefold()]=ident;existing_ids.add(ident)
  items.append(dict(id=ident,name=name,category=category,summary=summary,iconFamily='organic'))
 for name,category,summary,candidates in ROWS:
  found=[]
  for a,b in candidates:
   ai=names.get(a.casefold());bi=names.get(b.casefold())
   if ai is None or bi is None or ai==bi: continue
   pair='|'.join(sorted((ai,bi)))
   if pair in used: continue
   used.add(pair);found.append([a,b]);recipes.append([ai,bi,names[name.casefold()]])
   if len(found)==2:break
  if len(found)<2:raise ValueError(f'{name}: only {len(found)} available valid recipes, tried {candidates}')
  plan.append(dict(name=name,id=names[name.casefold()],category=category,summary=summary,paths=found))
 pack={'version':42,'items':items,'recipes':recipes}
 (R/'client/src/organic-pack-v42.js').write_text('export const ORGANIC_V42 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n')
 (R/'shared/v42-editorial-plan.json').write_text(json.dumps(plan,indent=2,ensure_ascii=False)+'\n')
 print('V42 authored',len(items),'elements',len(recipes),'recipes')
 print('\n'.join(f"{p['name']}: {p['paths']}" for p in plan))
if __name__=='__main__':build()
