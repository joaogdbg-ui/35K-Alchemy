#!/usr/bin/env python3
"""Editorial V47: discoveries first. Every new recipe produces a NEW illustrated element.
Rejects known pairs, duplicate concepts/IDs and uncraftable elements. Never edits earlier packs.
"""
from pathlib import Path
import json,re,unicodedata,hashlib,collections
ROOT=Path(__file__).resolve().parents[1]
# Name | family | concise description | hand-reviewed *candidate* pairs in priority order.
# If a pair was previously used, it is rejected. Two independent valid routes required.
ROWS='''
Sea Foam|nature|White bubbles whipped up at the surface of a choppy sea.|Wave & Air; Sea & Air; Wave & Wind; Ocean & Air; Tide & Air
Rip Current|nature|A concentrated seaward current flowing through breaking surf.|Tide & Current; Wave & Current; Ocean & Current; Tide & Wave; Tide & Sea Foam; Current & Tidal Channel; Wave & Tidal Channel; Sea Foam & Current
Salt Spray|nature|Fine seawater droplets carried inland by the wind.|Salt & Mist; Sea & Wind; Ocean & Wind; Wave & Wind; Salt & Air
Sea Stack|nature|A tall column of coastal rock left behind by wave erosion.|Rock & Wave; Stone & Sea; Rock & Tide; Stone & Tide; Sea & Basalt Column; Stone & Rip Current; Rock & Coastal Fog; Wave & Basalt Column
Coastal Dune|nature|A ridge of sand accumulated and shaped by coastal winds.|Sand & Wind; Sand & Tide; Sand & Sea; Sand & Storm; Sand & Salt Spray; Sand & Coastal Fog; Sand & Beach Pebble; Wind & Beach Pebble
Tidal Channel|nature|A narrow water passage carved by the rise and fall of tides.|Tide & River; Tide & Sand; Tide & Water; River & Ocean; Tide & Coastal Dune; Wave & Coastal Dune; Ocean & Sediment Layer; Tide & Rip Current
Seagrass Meadow|life|A nursery of marine plants rooted in sheltered seabed sediment.|Seaweed & Sand; Kelp & Sand; Seaweed & Soil; Reef & Plant
Wave Crest|nature|The curved peak of a wave as it begins to break.|Wave & Light; Wave & Wind; Wave & Storm; Wave & Air
Coastal Fog|nature|A low bank of fog rolling in from cooler ocean water.|Sea & Fog; Ocean & Mist; Tide & Mist; Sea & Mist; Sea & Cold Front; Ocean & Cold Front; Salt Spray & Fog; Sea Foam & Fog
Beach Pebble|material|A small smooth rock polished by repeated waves.|Stone & Wave; Rock & Sand; Stone & Tide; Rock & Sea; Sea Stack & Wave; Stone & Sea Foam; Rock & Rip Current; Rock & Tidal Channel
Caterpillar Cocoon|life|A silk shelter protecting a moth pupa during metamorphosis.|Caterpillar & Silk; Caterpillar & Nest; Caterpillar & Time; Moth & Silk
Butterfly Chrysalis|life|A butterfly pupa suspended while it transforms.|Butterfly & Caterpillar; Caterpillar & Plant; Caterpillar & Flower; Butterfly & Time
Ant Trail|life|A busy path marked by ants following chemical signals.|Ant & Sand; Ant & Soil; Ant & Forest; Ant & Garden
Nectar Drop|material|A glistening bead of sugary liquid produced by a flower.|Nectar & Water; Nectar & Flower; Nectar & Rain; Flower & Honey
Pollen Basket|life|The pollen-carrying structure of a worker bee's hind leg.|Bee & Pollen; Bee & Flower; Bee & Nectar; Bee & Honey; Bee & Nectar Drop; Bee Colony & Pollen; Honey & Pollen; Bee & Bee Colony
Bee Colony|life|A community of bees living and working together.|Bee & Nest; Bee & Forest; Bee & Garden; Bee & Society
Firefly Glow|nature|The soft light emitted by a firefly through bioluminescence.|Firefly & Light; Firefly & Night; Firefly & Energy; Firefly & Glow
Leaf Vein|life|A branching network that carries water and nutrients through a leaf.|Fern Frond & Water; Fern Frond & Light; Tree & River; Fern Frond & Rain
Bark Beetle|life|A small beetle that burrows through the tissues beneath tree bark.|Beetle & Tree; Beetle & Wood; Beetle & Forest; Beetle & Sawdust
Moth Wing|life|A delicate scale-covered wing of a nocturnal insect.|Moth & Wind; Moth & Air; Moth & Dust; Moth & Light
Cave Pool|nature|A quiet pool fed by groundwater inside a cave.|Cave & Water; Cave & Rain; Cave & River; Stalagmite & Water
Flowstone|material|A smooth layered mineral deposit formed by dripping cave water.|Limestone & Water; Cave & Limestone; Stalactite & Water; Stalagmite & Water
Calcite Crystal|material|A transparent crystal of calcium carbonate grown in mineral-rich water.|Limestone & Crystal; Stalactite & Crystal; Stalagmite & Crystal; Limestone & Rain
Volcanic Bomb|material|A lump of molten rock that cools while flying through the air.|Lava & Air; Volcano & Stone; Lava & Rock; Volcano & Explosion; Volcano & Air; Lava & Wind; Lava & Storm; Volcano & Wind
Basalt Column|material|A tall geometric column formed as thick lava slowly cools.|Lava & Stone; Lava & Time; Volcano & Rock; Lava & Ice; Lava & Cold Front; Lava & Ground Frost; Volcano & Ground Frost; Volcanic Bomb & Time
Pumice Raft|nature|A floating blanket of porous volcanic rock on the ocean.|Lava & Water; Volcano & Sea; Lava & Sea; Volcano & Ocean; Lava & Sea Foam; Volcanic Bomb & Sea; Volcanic Bomb & Water; Volcano & Wave
River Delta|nature|A branching wetland where a river deposits sediment at the sea.|River & Sea; River & Sand; River & Ocean; River & Tide; River & Sediment Layer; River & Coastal Dune; Sea & Sediment Layer; River & Seagrass Meadow
Oxbow Lake|nature|A crescent-shaped lake left behind by a migrating river.|River & Lake; River & Time; River & Mud; River & Earth
Fossil Imprint|science|An impression of ancient life preserved in a sedimentary rock.|Fossil & Clay; Fossil & Stone; Fossil & Mud; Fossil & Sand
Sediment Layer|material|A horizontal band of particles deposited through time.|Sand & Time; Mud & Time; Soil & Water; River & Dust
Circuit Trace|technology|A narrow conductive path connecting components on a circuit board.|Circuit & Wire; Circuit & Metal; Wire & Electronics; Microcontroller & Wire
Capacitor Bank|technology|A group of capacitors used to store and release electrical energy.|Battery & Circuit; Electricity & Battery; Microcontroller & Battery; Battery & Photodiode
Optical Switch|technology|A sensor-controlled switch triggered by a beam of light.|Photodiode & Circuit; Photodiode & Microcontroller; Sensor & Photodiode; Light & Microcontroller
LED Array|technology|A patterned grid of tiny light-emitting components.|Light & Circuit; Light & Electronics; Circuit & Glass; Photodiode & Light; Circuit Trace & Light; Light & Optical Switch; Light Meter & Circuit Trace; Photodiode & Optical Switch
Electric Relay|technology|An electrically controlled switch that opens or closes a circuit.|Motor & Circuit; Electricity & Microcontroller; Circuit & Thermostat; Circuit & Robot Arm
Solar Inverter|technology|Electronics converting solar panel output to usable alternating current.|Solar Panel & Electronics; Solar Panel & Circuit; Solar Charger & Motor; Solar Charger & Microcontroller
Temperature Probe|technology|A slender sensor measuring the temperature of a surface or liquid.|Thermometer & Sensor; Thermostat & Sensor; Sensor & Metal; Thermometer & Microcontroller
Robot Gripper|technology|A mechanical hand that grasps objects at the end of a robot arm.|Robot Arm & Tongs; Robot Arm & Tool; Robot Arm & Metal; Robot Arm & Anvil
Weather Node|technology|An outdoor connected sensor station collecting local weather readings.|Weather Station & Microcontroller; Rain Gauge & Microcontroller; Thermostat & Weather; Weather Forecast & Sensor
Electronic Compass|technology|A digital instrument that computes direction from electronic sensors.|Compass & Microcontroller; Compass & Circuit; Compass & Sensor; Compass & Photodiode
Herb Butter|culture|Soft butter blended with fragrant garden herbs.|Butter & Herb; Butter & Plant; Butter & Spice; Butter & Garden
Garlic Bread|culture|Bread toasted with garlic and butter.|Bread & Garlic; Garlic & Butter; Bread & Herb Butter; Bread & Herb
Apple Turnover|culture|A folded flaky pastry filled with soft apples.|Apple & Pastry; Apple & Dough; Apple & Pie; Apple & Custard
Fruit Compote|culture|Fruit gently cooked with a little sugar into a chunky sauce.|Fruit & Sugar; Fruit & Water; Fruit & Jam; Fruit & Heat; Apple & Sugar; Fruit & Cinnamon; Fruit & Honey Glaze; Apple & Syrup
Cinnamon Roll|culture|A coiled sweet pastry layered with cinnamon.|Cinnamon & Dough; Cinnamon & Bread; Cinnamon & Sugar; Cinnamon & Sourdough
Honey Glaze|culture|A glossy honey coating brushed onto warm pastries.|Honey & Heat; Honey & Butter; Honey & Syrup; Honey & Sugar
Cheese Pastry|culture|A golden pastry filled with melted cheese.|Cheese & Pastry; Cheese & Dough; Cheese & Bread; Cheese & Butter
Chocolate Truffle|culture|A small smooth confection made of chocolate and cream.|Chocolate & Cream; Chocolate & Butter; Chocolate & Sugar; Chocolate & Milk; Chocolate & Custard; Chocolate & Honey; Chocolate & Meringue; Chocolate & Fruit Compote
Fruit Sorbet|culture|A frozen dessert of fruit and ice without cream.|Fruit & Ice; Fruit & Snow; Fruit & Cold; Fruit & Water; Fruit & Snowdrift; Fruit & Ground Frost; Apple & Snow; Fruit & Cold Front
Toasted Seeds|culture|Small seeds gently browned to release their nutty aroma.|Seed & Fire; Seed & Heat; Seed & Coal; Seed & Bread
Rain Gutter|technology|A channel beneath a roof that collects rainwater.|Rain & House; Rooftop Garden & Rain; House & Water; Rain Barrel & House
Tram Stop|culture|A sheltered urban place for passengers to board a tram.|Train & City; Train & Town Square; Train & Street Market; Train & Village
Street Lantern|technology|A tall lamp casting warm light over a public street.|Light & City; Light & Town Square; Light & Street Market; Lighthouse Beam & City
Pedestrian Bridge|technology|A walkway bridging a river or road for people on foot.|Bridge & Human; Bridge & Park; Bridge & Village; Bridge & Town Square
Public Fountain|culture|An ornamental flowing water feature in a civic square.|Water & Town Square; Water & Park; Water Tower & Town Square; Water & Monument
Green Roof|nature|A building roof covered in living plants that absorb rain.|Rooftop Garden & House; Garden & Tower; Rain Garden & House; Rooftop Garden & Rain Garden
Urban Orchard|life|Fruit trees growing within a town or city.|Apple & City; Fruit & City; Tree & Town Square; Garden & Fruit
Market Stall|culture|A small stand used for selling goods at an outdoor market.|Street Market & Wood; Street Market & Tool; Market & Wooden Plank; Shop & Wood
Town Clock|technology|A large public clock fixed high on a town building.|Time & Tower; Time & Town Square; Gear & Watchtower; Gear & City
Cobblestone Lane|culture|A narrow old street paved with rounded stones.|Cobblestone & Village; Cobblestone & Street Market; Cobblestone & Town Square; Cobblestone & House
Photo Negative|technology|A photographic image with light and dark values reversed.|Negative & Film; Photograph & Film; Photography & Negative; Film & Exposure
Long Exposure|science|A photograph that gathers light over a long camera exposure.|Camera & Night; Camera & Time; Exposure & Night; Light Meter & Night
Photo Album|culture|A bound book preserving a collection of photographs.|Photograph & Book; Photograph & Paper; Album & Camera; Photograph & Album
Contact Sheet|technology|A page displaying many small photographic frames for selection.|Film & Paper; Negative & Paper; Photo Negative & Paper; Darkroom & Paper
Film Canister|technology|A light-tight cylinder protecting a roll of photographic film.|Film & Metal; Film & Glass; Film & Box; Film & Wood
Studio Light|technology|A controlled light source used to illuminate a photographic subject.|Light & Photography; Camera & Light; Flash & Camera; Light Meter & Photography; Photography & LED Array; Camera & LED Array; Tripod & Light Meter; Photography & Photodiode
Tripod Head|technology|An adjustable pivot that holds a camera steady on a tripod.|Tripod & Gear; Tripod & Camera; Tripod & Metal; Tripod & Tool
Macro Lens|technology|A camera lens designed for sharply focused close-up views.|Lens & Insect; Lens & Flower; Camera & Insect; Lens & Bee
Star Trail|science|Curved streaks of starlight captured during a long exposure.|Star & Time; Camera & Constellation; Long Exposure & Star; Camera & Night
Photo Collage|culture|An arrangement of several photographs combined into one image.|Photograph & Art; Photograph & Album; Photo Album & Art; Photograph & Paper
Planetary Ring|nature|A broad ring of icy and rocky debris orbiting a planet.|Planet & Ice; Planet & Dust; Planet & Asteroid; Planet & Gravity
Cosmic Dust|material|Tiny solid particles drifting between the stars.|Space & Dust; Galaxy & Dust; Nebula & Dust; Star & Dust
Solar Wind|science|A stream of charged particles flowing outward from the Sun.|Sun & Wind; Sunspot & Wind; Sun & Jet Stream; Solar Flare & Air
Moonrise|nature|The sight of the Moon lifting above the horizon.|Moon & Night; Moon & Sea; Moon & Sun; Moon & Mountain; Moon & Coastal Fog; Moon & Star Trail; Moon & Lighthouse Beam; Moon & Jet Stream
Aurora Curtain|nature|A flowing ribbon of colourful auroral light in the night sky.|Aurora & Wind; Aurora & Night; Aurora & Solar Wind; Aurora & Sky
Comet Tail|nature|The long glowing plume of gas and dust trailing a comet.|Comet & Wind; Comet & Sun; Comet & Dust; Comet & Ice
Orbiting Satellite|technology|An artificial satellite circling Earth and relaying information.|Space & Radio; Space & Solar Panel; Space & Camera; Planet & Radio
Impact Crater|nature|A round depression made when an asteroid strikes the surface.|Meteorite & Earth; Asteroid & Earth; Meteorite & Rock; Meteorite & Sand
Stellar Nursery|nature|A cold cloud where gas and dust collapse to form new stars.|Nebula & Star; Nebula & Life; Star Cluster & Nebula; Nebula & Dust
Space Weather|science|Changing conditions in space driven by solar activity.|Solar Flare & Earth; Sunspot & Storm; Solar Wind & Earth; Aurora & Sun
'''
rows=[]
for ln in ROWS.strip().splitlines():
 a=ln.split('|');assert len(a)==4,(ln,len(a));name,cat,summary,poss=a
 pairs=[tuple(v.strip() for v in p.split(' & ')) for p in poss.split(';')];rows.append((name,cat,summary,pairs))
assert len(rows)==80,len(rows)
snapshot=json.loads((ROOT/'shared/v46-catalog-snapshot-complete.json').read_text())
known={x['name'].casefold():x['id'] for x in snapshot['items']};bases=set(known)
for name,_,_,_ in rows:
 assert name.casefold() not in known, f'duplicate name: {name}'
 known[name.casefold()]='organic47:'+re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
assert len(set(known.values()))==len(known)
occupied={tuple(sorted(pair[:2])) for pair in snapshot['recipes']}
result=[];report=[];rejected=[]
for name,cat,summary,attempts in rows:
 out=known[name.casefold()];chosen=[]
 for a,b in attempts:
  ia=known.get(a.casefold());ib=known.get(b.casefold())
  if not ia or not ib:
   rejected.append([name,a,b,'unknown']);continue
  key=tuple(sorted((ia,ib)))
  if key in occupied or out in key:
   rejected.append([name,a,b,'pair occupied or trivial self-result']);continue
  if len(chosen)>=3:break
  result.append([ia,ib,out]);occupied.add(key);chosen.append(f'{a} + {b}')
 if len(chosen)<2: print('INSUFFICIENT',name,chosen)
 report.append({'name':name,'category':cat,'routes':chosen})
assert min(len(x['routes']) for x in report)>=2,'Not enough clean routes'
items=[{'id':known[name.casefold()],'name':name,'category':cat,'summary':summary,'iconFamily':'organic'} for name,cat,summary,_ in rows]
(ROOT/'client/src/organic-pack-v47.js').write_text('export const ORGANIC_V47 = '+json.dumps({'items':items,'recipes':result},ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'shared/v47-editorial-report.json').write_text(json.dumps({'release':'V47','priority':'new-first','new_elements':len(items),'new_recipes':len(result),'new_output_recipes':len(result),'editorial_routes':report,'rejected_candidates':rejected},indent=2)+'\n')
print('V47 new',len(items),'recipes',len(result),'rejected',len(rejected))
