#!/usr/bin/env python3
"""V46 hand-curated new-first progression: 80 distinct concepts and multiple natural routes each.
No random recipe synthesis or unreviewed fallback result. Snapshot immutable V45 pairs.
"""
from pathlib import Path
import json, re, unicodedata, collections
ROOT=Path(__file__).resolve().parents[1]
# name | category | description | candidate ingredient pairs (reviewed in listed order)
ROWS='''
Tidepool Anemone|life|A small anemone anchored inside a sheltered rocky tidepool.|Sea Anemone & Rock; Sea Anemone & Lagoon; Sea Anemone & Shore; Sea Anemone & Tide
Sea Sponge|life|A porous marine animal that filters microscopic food from seawater.|Coral & Water; Reef & Plankton; Coral & Plankton
Sea Cucumber|life|A soft-bodied echinoderm moving slowly over the ocean floor.|Sea Urchin & Sand; Sea Urchin & Seaweed; Deep Sea & Animal; Reef & Animal
Sea Fan|life|A branching colony of sea polyps that spreads like an underwater fan.|Coral & Wind; Coral & Current; Reef & Wind; Coral & Kelp
Hermit Crab|life|A crab that shelters its soft abdomen inside a discarded shell.|Crab & Seashell; Crab & Shell; Crab & House; Crab & Shelter
Nautilus|life|A deep-sea mollusc with a chambered spiral shell.|Clam & Deep Sea; Seashell & Deep Sea; Mollusk & Spiral; Ocean & Spiral
Brittle Star|life|A relative of starfish with long slender arms that flex to crawl.|Starfish & Reef; Starfish & Deep Sea; Starfish & Sand; Starfish & Current
Sea Slug|life|A slow marine mollusc, sometimes brilliantly coloured.|Seaweed & Animal; Seaweed & Reef; Seaweed & Hermit Crab
Seahorse Nursery|nature|A protected marine habitat where young seahorses shelter among plants.|Seahorse & Kelp; Seahorse & Mangrove; Seahorse & Reef; Seahorse & Nursery
Kelp Canopy|nature|The upper layer of a kelp forest, filtering sunlight underwater.|Kelp & Sun; Kelp Forest & Sun; Kelp & Canopy; Kelp Forest & Light
Oak Sapling|life|A young oak tree growing from a germinated acorn.|Acorn & Water; Acorn & Rain; Acorn & Soil; Acorn & Plant
Squirrel Drey|nature|A squirrel's woven nest high in a tree's branches.|Squirrel & Nest; Squirrel & Tree; Squirrel & Forest; Squirrel & Wood
Pecked Log|material|A dead tree trunk marked by feeding woodpeckers.|Woodpecker & Wood; Woodpecker & Log; Woodpecker & Tree; Woodpecker & Forest; Woodpecker & Tree Hollow; Woodpecker & Wooden Plank; Woodpecker & Forest Floor; Woodpecker & Sawdust
Fern Frond|life|A single unfurling leaf of a fern, delicate and divided.|Fern & Leaf; Fern & Rain; Fern & Sun; Fern & Water
Tree Hollow|nature|A sheltered cavity inside a living or fallen tree.|Tree & Cave; Tree & Burrow; Wood & Cave; Tree & Owl
Tree Rings|science|Concentric growth records visible in a cut tree trunk.|Tree & Time; Wood & Time; Tree & History; Wood & Age
Leaf Litter|material|A soft layer of fallen leaves decomposing on the forest floor.|Leaf & Forest; Leaf & Earth; Autumn & Forest; Tree & Compost; Forest & Fern Frond; Tree & Fern Frond; Forest & Pine Needle; Forest & Oak Sapling
Forest Floor|nature|The shaded ground layer of a woodland, rich in fallen matter.|Forest & Soil; Forest & Moss; Forest & Mud; Forest & Leaf Litter; Forest & Fern Frond; Forest & Spore Print; Tree & Leaf Litter; Forest & Leaf Litter
Pine Needle|life|A thin evergreen leaf adapted to conserve moisture.|Pinecone & Leaf; Pinecone & Plant; Tree & Pinecone; Pinecone & Rain
Spore Print|science|The fine pattern left when fungal spores fall onto a surface.|Mushroom & Paper; Mushroom & Ink; Mushroom & Art; Mycelium & Paper
Sunspot|science|A darker, cooler region formed by magnetic activity on the Sun.|Sun & Shadow; Sun & Magnet; Sun & Dark; Solar Power & Shadow
Solar Flare|science|A sudden bright burst of energy from the Sun's magnetic field.|Sun & Lightning; Sun & Spark; Sunspot & Fire; Sunspot & Energy
Coronal Mass Ejection|science|A cloud of hot charged solar material cast into space.|Solar Flare & Wind; Solar Flare & Space; Sun & Storm; Sun & Plasma
Meteor Shower|nature|Many meteors briefly lighting the night sky together.|Meteor & Night; Meteor & Sky; Meteor & Rain; Comet & Night
Lunar Crater|nature|A bowl-shaped scar left by an impact on the Moon.|Moon & Meteorite; Moon & Asteroid; Moon & Meteor; Moon & Explosion
Lunar Dust|material|Powdery surface material formed from countless impacts on the Moon.|Moon & Dust; Lunar Crater & Dust; Moon & Sand; Moon & Erosion
Eclipse Glasses|technology|Protective viewing glasses made to observe a solar eclipse safely.|Eclipse & Glass; Eclipse & Glasses; Sun & Sunglasses; Eclipse & Optics
Star Cluster|nature|A family of stars bound or gathered together in space.|Star & Star; Star & Galaxy; Star & Gravity; Nebula & Star
Red Giant|nature|An aging star that has expanded and cooled at its surface.|Star & Time; Star & Heat; Star & Age; Star & Expansion
White Dwarf|nature|The compact hot stellar remnant left after a low-mass star sheds its layers.|Red Giant & Time; Red Giant & Space; Star & Gravity; Supernova & Star
Dust Devil|nature|A spinning column of dust lifted by hot rising air.|Dust & Wind; Dust & Heat; Sand & Wind; Dust & Tornado; Dust & Storm; Dust & Sandstorm; Wind & Erosion; Dust & Desert; Dust & Heatwave; Dust & Tornado
Ice Halo|nature|A luminous ring around the Sun or Moon caused by ice crystals.|Ice & Sun; Ice & Moon; Snow & Light; Frost & Rainbow
Sundog|nature|A bright patch beside the Sun formed by ice crystals refracting light.|Sun & Ice Halo; Ice Halo & Light; Ice Halo & Prism
Cold Front|science|The leading edge of colder air advancing beneath warmer air.|Cold & Wind; Snow & Wind; Ice & Air; Weather & Ice
Warm Front|science|The leading edge of warm air sliding over a cooler air mass.|Heat & Cold Front; Heatwave & Air; Weather & Heatwave
Jet Stream|nature|A fast-moving high-altitude band of wind steering many weather systems.|Sky & Wind; Wind & Altitude; Wind & Atmosphere; Storm & Sky
Ground Frost|nature|A thin layer of ice crystals formed on a cold exposed surface.|Earth & Frost; Grass & Frost; Ground & Ice; Dew & Frost
Thunderhead|nature|A towering storm cloud associated with lightning and heavy rain.|Storm & Thunder; Storm & Warm Front; Storm & Cold Front; Warm Front & Cloud
Tipping-Bucket Gauge|technology|A rain measuring instrument that counts small tipping cups.|Rain Gauge & Gear; Rain Gauge & Machine; Rain & Counter; Rain Gauge & Engineering
Snowdrift|nature|A bank of snow carried and piled up by wind.|Blizzard & Earth; Snow & Cold Front; Blizzard & Ground Frost
Sourdough Starter|life|A fermenting mixture of flour and water populated by wild yeast.|Yeast & Flour; Flour & Life; Yeast & Water; Dough & Yeast
Sourdough|culture|Slowly fermented bread with a distinctive tangy crust.|Sourdough Starter & Dough; Sourdough Starter & Bread; Bread & Fermentation; Sourdough Starter & Fire
Baguette|culture|A long French loaf with a crisp golden crust.|Sourdough & Fire; Sourdough & Heat; Sourdough & Oven
Custard|culture|A smooth sweet mixture thickened by gently heated eggs.|Egg & Milk; Egg & Sugar; Milk & Sugar; Cream & Egg
Meringue|culture|A light crisp sweet made by whipping egg whites with sugar.|Egg & Sugar; Egg & Air; Sugar & Cloud; Egg & Whisk
Fruit Tart|culture|A pastry shell filled with custard and fresh fruit.|Tart & Fruit; Pastry & Fruit; Fruit & Custard; Pie & Custard
Lemon Curd|material|A silky spread made with lemon, sugar, egg and butter.|Lemon & Custard; Lemon & Sugar; Lemon & Butter; Lemon & Egg
Marmalade|culture|A citrus preserve made from fruit, peel and sugar.|Lemon & Jam; Jam & Syrup; Lemon & Syrup
Crouton|culture|A crisp cube of toasted bread often added to soup or salad.|Bread & Soup; Bread & Salad; Bread & Oil; Bread & Toast
Bread Crumbs|material|Small dried fragments of bread used for coating or topping dishes.|Bread & Dust; Bread & Grinder; Bread & Tool; Bread & Stone
Anvil|technology|A heavy metal block used to support hammering and shaping work.|Metal & Hammer; Iron & Hammer; Metal & Forge; Iron & Stone
Forge|technology|A hot furnace used to heat metal before shaping it.|Iron & Fire; Metal & Furnace; Metal & Fire; Coal & Iron
Tongs|technology|A gripping hand tool for handling hot objects safely.|Metal & Hand; Tool & Forge; Iron & Tool; Anvil & Tool
Smithy|culture|A workshop where a blacksmith forges and repairs metalwork.|Forge & House; Forge & Workshop; Anvil & House; Forge & Village
Loom|technology|A frame that weaves yarn into cloth by crossing threads.|Silk & Tool; Fabric & Machine; Thread & Wood; Yarn & Wood
Spinning Wheel|technology|A rotating tool that twists loose fibres into thread.|Wool & Wheel; Silk & Wheel; Wheel & Yarn; Wheel & Thread
Yarn|material|A continuous strand spun from fibres ready for weaving or knitting.|Wool & Tool; Silk & Spinning Wheel; Cotton & Spinning Wheel; Silk & Loom
Wooden Plank|material|A flat length of sawn timber for building or furniture.|Wood & Tree Rings; Wood & Workbench; Tree & Sawdust; Wood & Pecked Log
Sawdust|material|Tiny wood particles produced when timber is cut or sanded.|Wood & Dust; Wood & Saw; Wooden Plank & Tool; Wood & Sand
Workbench|technology|A sturdy working table that holds tools and materials.|Wood & Tool; House & Engineering; Wooden Plank & Tool; Forge & Table; Wooden Plank & Hammer; Wooden Plank & Forge; Wooden Plank & Anvil; Wood & Anvil; Wooden Plank & Metal
Drawbridge|technology|A movable bridge that can be raised to protect a gateway.|Bridge & Castle; Bridge & Gear; Bridge & Fortress; Bridge & Hinge
Watchtower|culture|A tall structure built for viewing distant approaches.|Tower & Guard; Tower & Soldier; Tower & Forest; Castle & Tower
Lighthouse Beam|science|A focused rotating shaft of light guiding ships away from danger.|Lighthouse & Light; Lighthouse & Lens; Lighthouse & Prism; Lighthouse & Night
Cobblestone|material|A rounded paving stone used to build durable streets.|Stone & Road; Stone & City; Stone & Street; River & Road; Stone & Brick; Stone & Concrete; Stone & City; Stone & Tower; Stone & Town Square; River & Brick
Rooftop Garden|life|A planted green space above a building.|City & Garden; House & Rain Garden; Garden & Tower
Rain Garden|nature|A planted shallow basin that catches and filters stormwater.|Garden & Rain; Plant & Flood; Garden & Water; Rain Barrel & Plant
Street Market|culture|An outdoor gathering of stalls selling goods and produce.|Market & Street; Market & Road; Shop & Road; City & Trade; Market & Town Square; Market & Watchtower; City & Town Square; Market & Drawbridge
Fountain Pen|technology|A writing pen that feeds liquid ink through a nib.|Ink & Pen; Ink & Writing; Ink & Metal; Book & Ink
Town Square|culture|An open public space at the centre of community life.|Village & Plaza; City & Plaza; Village & Market; City & Monument
Water Tower|technology|An elevated tank that stores water and supplies pressure to buildings.|Tower & Water; Water & City; Reservoir & Tower; Water Pump & Tower
Photodiode|technology|A light-sensitive semiconductor that converts photons into current.|Light & Circuit; Solar Power & Sensor; Light & Silicon; Sensor & Light
Infrared Sensor|technology|An electronic detector sensitive to infrared radiation.|Heat & Sensor; Infrared & Sensor; Light & Thermometer; Sensor & Night
Thermostat|technology|A control that senses temperature and switches heating or cooling.|Thermometer & Circuit; Heat & Sensor; Temperature & Switch; Thermometer & Gear
Solar Charger|technology|A device that converts sunlight to electricity for charging batteries.|Solar Panel & Battery; Sun & Battery; Solar Power & Battery; Solar Panel & Phone
Wind Vane|technology|A rotating arrow mounted outdoors to show the direction of the wind.|Weather Station & Wind; Wind & Watchtower; Wind & Weather Forecast
Microcontroller|technology|A small programmable chip that controls electronic devices.|Computer & Circuit; Circuit & Code; Chip & Program; Electronics & Code; Circuit & Algorithm; Code & Robot Arm; Circuit Board & Algorithm; Circuit Board & Sensor; Code & Sensor
Robot Arm|technology|An articulated mechanical arm that positions tools or parts precisely.|Robot & Tool; Robot & Gear; Machine & Arm; Robotics & Tool
Drone Camera|technology|A camera carried by a flying drone for aerial photographs.|Camera & Sky; Camera & Weather Balloon; Camera & Robot
Sound Meter|technology|An instrument measuring the intensity of sound waves.|Sound & Meter; Sound & Sensor; Microphone & Meter; Sound & Scale; Sound & Microcontroller; Sound & Thermostat; Sound & Circuit Board; Sound & Amplifier; Sound & Photodiode
Light Meter|technology|A measuring instrument that gauges the amount of light.|Light & Meter; Light & Sensor; Camera & Sensor; Exposure & Instrument; Light & Photodiode; Light & Microcontroller; Camera & Photodiode; Camera & Thermostat; Lens & Photodiode
'''
rows=[]
for raw in ROWS.strip().splitlines():
 bits=raw.split('|')
 if len(bits)!=4:raise Exception(f'bad line {raw}')
 name,category,summary,candidates=bits
 pairs=[tuple(x.strip() for x in v.split(' & ')) for v in candidates.split(';')]
 rows.append((name,category,summary,pairs))
assert len(rows)==80,len(rows)
old=json.loads((ROOT/'shared/v45-catalog-snapshot-complete.json').read_text())
mapname={i['name'].casefold():i['id'] for i in old['items']};oldnames=set(mapname)
for name,cat,summary,pairs in rows:
 if name.casefold() in oldnames:raise Exception('duplicate existing '+name)
for name,cat,summary,pairs in rows:
 if name.casefold() in mapname:raise Exception('dup new '+name)
 mapname[name.casefold()]='organic46:'+re.sub('[^a-z0-9]+','-',name.lower()).strip('-')
used={tuple(sorted((a,b))) for a,b,out in old['recipes']}
new_recs=[];drops=[];report=[]
for name,cat,summary,pairs in rows:
 out=mapname[name.casefold()];accepted=[]
 for a,b in pairs:
  ia=mapname.get(a.casefold());ib=mapname.get(b.casefold())
  if not ia or not ib:
   drops.append([name,a,b,'unknown ingredient']);continue
  key=tuple(sorted((ia,ib)))
  if key in used or out in (ia,ib):
   drops.append([name,a,b,'pre-existing pair or trivial self-result']);continue
  if len(accepted)>=3:continue  # three maximum: readable branching, not recipe inflation
  used.add(key);new_recs.append([ia,ib,out]);accepted.append(f'{a} + {b}')
 if len(accepted)<2:raise Exception(f'Need two plausible routes: {name}: {accepted}')
 report.append({'name':name,'recipes':accepted})
items=[{'id':mapname[n.casefold()],'name':n,'category':cat,'summary':summary,'iconFamily':'organic'} for n,cat,summary,pairs in rows]
assert len({x['id'] for x in items})==80
pack={'items':items,'recipes':new_recs}
(ROOT/'client/src/organic-pack-v46.js').write_text('export const ORGANIC_V46 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'shared/v46-editorial-report.json').write_text(json.dumps({'release':'V46','priority':'new-first','new_elements':len(items),'new_recipes':len(new_recs),'recipes_producing_new_elements':len(new_recs),'editorial_routes':report,'rejected_candidates':drops},indent=2)+'\n')
print('V46:',len(items),'new items,',len(new_recs),'new recipes,',len(drops),'skipped candidates')
