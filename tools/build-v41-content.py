from pathlib import Path
import json, re, unicodedata, hashlib
ROOT=Path(__file__).resolve().parents[1]
import subprocess
# Rebuild the pre-V41 catalog from canonical source, never from a private temporary file.
BASE_SCRIPT="""import {DATA} from './client/src/legacy-data.js';
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
import {buildCatalog} from './client/src/catalog-integrity.js';
const cat=buildCatalog(DATA,[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40]);
console.log(JSON.stringify({items:cat.items,recipes:[...cat.recipes]}));"""
BASE=json.loads(subprocess.check_output(['node','--input-type=module','-e',BASE_SCRIPT],cwd=ROOT,text=True))
# Each author-selected path is a natural-language explanation through its ingredients.
# The first two compatible and unique recipes are selected; extras are editorial fallbacks if legacy recipes conflict.
ROWS=[
# Weather and climate
('Storm','nature','An intense spell of weather bringing strong winds, rain and changing skies.', [('Cloud','Wind'),('Rain','Wind'),('Weather','Lightning')]),
('Thunder','nature','A deep rumbling sound produced when lightning suddenly heats the air.', [('Lightning','Sound'),('Lightning','Storm'),('Sky','Explosion')]),
('Fog','nature','A cloud of tiny water droplets suspended close to the ground.', [('Cloud','Earth'),('Mist','Cold'),('Weather','Steam')]),
('Mist','nature','A thin veil of suspended droplets that softens distant details.', [('Rain','Air'),('Steam','Ice'),('Rain','Steam'),('Water','Cloud')]),
('Blizzard','nature','A severe snowstorm with strong wind and very poor visibility.', [('Snow','Storm'),('Snow','Wind'),('Frost','Hurricane')]),
('Tornado','nature','A rapidly rotating column of air extending down from a storm cloud.', [('Storm','Wind'),('Cloud','Vortex'),('Hurricane','Earth')]),
('Hurricane','nature','A huge tropical cyclone fueled by warm ocean water.', [('Storm','Ocean'),('Storm','Heat'),('Wind','Ocean')]),
('Monsoon','nature','A seasonal wind shift that brings intense periods of rainfall.', [('Rainforest','Storm'),('Ocean','Rain'),('Rain','Wind')]),
('Drizzle','nature','Fine and gentle rain made from very small falling droplets.', [('Mist','Rain'),('Cloud','Mist'),('Rain','Breeze')]),
('Flood','nature','Water covering land that is usually dry after heavy rain or overflow.', [('River','Storm'),('Rain','River'),('Water','Disaster')]),
('Pressure','science','The force exerted over an area, important to atmospheric changes.', [('Air','Gravity'),('Steam','Machine'),('Weather','Science')]),
('Humidity','science','The amount of water vapor present in the surrounding air.', [('Water','Weather'),('Mist','Air'),('Steam','Air')]),
('Forecast','science','A prediction of future weather from observations and models.', [('Weather','Science'),('Cloud','Knowledge'),('Storm','Telescope')]),
('Barometer','technology','An instrument that measures air pressure to track changing weather.', [('Pressure','Tool'),('Pressure','Glass'),('Forecast','Tool')]),
('Thermometer','technology','A measuring instrument that reveals the temperature of a place.', [('Heat','Tool'),('Glass','Heat'),('Science','Temperature')]),
('Heatwave','nature','An extended spell of unusually hot weather across an area.', [('Sun','Weather'),('Drought','Sun'),('Summer','Fire')]),
# Insects and ecological relationships
('Ant','life','A social insect that gathers food and works with nest mates.', [('Insect','Earth'),('Insect','Colony'),('Insect','Forest')]),
('Anthill','nature','A mound of soil built around the tunnels of an ant colony.', [('Ant','Earth'),('Ant','Nest'),('Ant','Sand')]),
('Beetle','life','A hardy insect protected by a pair of firm wing covers.', [('Insect','Wood'),('Insect','Stone'),('Insect','Garden')]),
('Ladybug','life','A colorful spotted beetle that often feeds on garden aphids.', [('Beetle','Flower'),('Beetle','Garden'),('Insect','Flower')]),
('Wasp','life','A narrow-waisted flying insect that may hunt pests or visit flowers.', [('Insect','Sting'),('Bee','Hunter'),('Insect','Nest')]),
('Mosquito','life','A small flying insect whose females can feed on blood.', [('Insect','Swamp'),('Insect','Wetland'),('Insect','Water')]),
('Moth','life','A mostly night-flying relative of the butterfly.', [('Butterfly','Night'),('Cocoon','Night'),('Insect','Night')]),
('Grasshopper','life','A long-legged insect known for jumping across grassy fields.', [('Insect','Field'),('Insect','Wind'),('Insect','Garden')]),
('Cricket','life','A chirping insect that makes rhythmic sounds by rubbing its wings.', [('Insect','Music'),('Insect','Night'),('Grasshopper','Sound')]),
('Silk','material','A smooth strong natural fiber spun by certain insects.', [('Cocoon','Thread'),('Spider','Cocoon'),('Spider','Cloth')]),
('Bee Bread','nature','Fermented pollen stored in honeycomb cells to nourish young bees.', [('Pollen','Honey'),('Hive','Pollen'),('Bee','Pollen')]),
('Insect Hotel','technology','A shelter of hollow stems and timber for beneficial garden insects.', [('Insect','Wood'),('Garden','Wood'),('Bee','Workshop')]),
('Aphid','life','A tiny plant-feeding insect commonly visited by ants and ladybugs.', [('Insect','Plant'),('Ladybug','Plant'),('Ant','Leaf')]),
('Termite','life','A wood-eating social insect that helps break down dead plants.', [('Ant','Wood'),('Insect','Tree'),('Insect','Workshop')]),
('Swarm','life','A moving cluster of insects traveling or gathering as a group.', [('Bee','Wind'),('Bee','Society'),('Insect','Society')]),
('Praying Mantis','life','A watchful insect that seizes prey with folded front legs.', [('Insect','Hunter'),('Insect','Garden'),('Insect','Predator')]),
# Architectural progress
('Brick','material','A shaped block of clay hardened by drying or firing.', [('Clay','Fire'),('Mud','Kiln'),('Earth','Kiln')]),
('Clay','material','Fine mineral-rich earth that can be shaped when wet.', [('Earth','Water'),('Mud','Stone'),('River','Mud')]),
('Cement','material','A powdered binder that hardens after reacting with water.', [('Kiln','Stone'),('Kiln','Rock'),('Stone','Factory')]),
('Concrete','material','A hard construction mix made from binder, water and aggregates.', [('Cement','Sand'),('Cement','Water'),('Stone','Cement')]),
('Arch','culture','A curved structure that carries weight across an opening.', [('Brick','Bridge'),('Stone','Bridge'),('Column','Stone')]),
('Column','culture','A tall load-bearing support used in buildings and monuments.', [('Stone','Tower'),('Concrete','Stone'),('Brick','Monument')]),
('Tower','culture','A tall structure built for defense, observation or communication.', [('Brick','House'),('Stone','Height'),('Castle','Blueprint')]),
('Cathedral','culture','A grand church built as a center of a bishop’s community.', [('Choir','Tower'),('Glass','Tower'),('Choir','Monument')]),
('Ruins','culture','Remains of buildings that reveal the passage of time.', [('Castle','Time'),('City','Time'),('Tower','Weather')]),
('Monument','culture','A structure preserving the memory of a person or event.', [('Stone','History'),('Sculpture','History'),('Column','History')]),
('Plaza','culture','An open public square where streets and communities meet.', [('City','Stone'),('Market','City'),('City','Garden')]),
('Museum','culture','A place that preserves and presents objects for learning.', [('History','House'),('Art','History'),('Artifact','House')]),
('Library','culture','A building that keeps books and knowledge accessible.', [('Book','House'),('Knowledge','House'),('City','Book')]),
('Canal','technology','A man-made waterway guiding boats or irrigation through land.', [('River','Engineering'),('Water','Road'),('River','Blueprint')]),
('Aqueduct','technology','A structure that carries water across a valley or town.', [('Canal','Bridge'),('Water','Arch'),('Canal','Stone')]),
('Scaffold','technology','A temporary frame that lets builders work above the ground.', [('Wood','Construction'),('Tool','Tower'),('Wood','Blueprint')]),
# Maritime craft and navigation
('Harbor','culture','A sheltered coastal place where vessels can safely stop.', [('Sea','Dock'),('Dock','City'),('Ship','Dock')]),
('Compass','technology','An instrument that points toward magnetic north.', [('Map','Metal'),('Map','Iron'),('Map','Navigation')]),
('Navigation','science','The art and science of finding a route from place to place.', [('Map','Ship'),('Map','Star'),('Compass','Ocean')]),
('Anchor','technology','A heavy device that holds a vessel in place against drift.', [('Ship','Metal'),('Ship','Stone'),('Harbor','Iron')]),
('Rudder','technology','A steering surface that turns a boat through water.', [('Ship','Steering'),('Ship','Wood'),('Ship','Tool')]),
('Mast','technology','An upright spar that supports a sailing vessel’s sails.', [('Sailboat','Wood'),('Ship','Tree'),('Ship','Pole')]),
('Keel','technology','The central structural spine running along the bottom of a hull.', [('Ship','Wood'),('Sailboat','Metal'),('Ship','Engineering')]),
('Sail','technology','A sheet of material that catches wind to move a boat.', [('Cloth','Wind'),('Sailboat','Wind'),('Ship','Wind')]),
('Port','culture','A maritime gateway where vessels exchange goods and people.', [('Harbor','Trade'),('Dock','Market'),('Harbor','City')]),
('Buoy','technology','A floating marker that guides boats or warns of obstacles.', [('Sea','Lighthouse'),('Harbor','Light'),('Sea','Light')]),
('Fishing Net','technology','A web of cord that catches fish while allowing water through.', [('Fish','Thread'),('Fishing','Thread'),('Ocean','Thread')]),
('Lifeboat','technology','A small boat kept ready to rescue people in danger.', [('Ship','Life'),('Shipwreck','Sailboat'),('Harbor','Life')]),
('Cargo Ship','technology','A large vessel built to carry goods across the sea.', [('Ship','Trade'),('Ship','Container'),('Port','Ship')]),
('Shipyard','culture','A waterfront workshop where boats are built and repaired.', [('Ship','Workshop'),('Harbor','Factory'),('Port','Engineering')]),
('Sonar','technology','A system that uses sound waves to detect objects underwater.', [('Sound','Ocean'),('Submarine','Sound'),('Sea','Radar')]),
('Sextant','technology','An optical instrument used to measure angles between stars and the horizon.', [('Star','Navigation'),('Telescope','Compass'),('Navigation','Sun')]),
# Exploration & history
('Artifact','culture','An object made or used by people, revealing clues about the past.', [('History','Tool'),('History','Pottery'),('Ruins','Tool')]),
('Relic','culture','A surviving object valued for its connection to earlier times.', [('Artifact','Time'),('Treasure','History'),('Ruins','Treasure')]),
('Excavation','science','Careful digging to uncover buried structures or objects.', [('Earth','Archaeology'),('Artifact','Tool'),('Ruins','Shovel')]),
('Pyramid','culture','A monumental structure with broad base and tapering sides.', [('Stone','Desert'),('Sand','Monument'),('Ancient City','Stone')]),
('Mummy','culture','A body preserved by deliberate treatment or dry conditions.', [('Human','Tomb'),('Pyramid','Human'),('Desert','Human')]),
('Hieroglyphics','culture','Picture-based writing used in ancient Egyptian inscriptions.', [('Writing','Pyramid'),('Stone','Language'),('Mummy','Writing')]),
('Explorer','culture','A curious traveler who ventures beyond familiar places.', [('Human','Map'),('Human','Compass'),('Expedition','Human')]),
('Expedition','culture','A journey organized to investigate a distant place.', [('Explorer','Map'),('Ship','Discovery'),('Explorer','Ship')]),
('Landmark','culture','A distinctive feature used to recognize and locate a place.', [('Map','Monument'),('Tower','Map'),('City','Map')]),
('Rock Art','culture','Images scratched or painted onto natural stone surfaces.', [('Stone','Painting'),('Cave','Art'),('Stone','Writing')]),
('Tomb','culture','A place built or prepared for the burial of the dead.', [('Pyramid','Stone'),('Pyramid','History'),('Mummy','Stone')]),
('Archaeologist','culture','A specialist who studies the past through material evidence.', [('Human','Archaeology'),('Explorer','Artifact'),('Excavation','Science')]),
('Treasure Map','culture','A drawn set of directions hinting at a hidden prize.', [('Map','Treasure'),('Pirate','Map'),('Explorer','Treasure')]),
('Ancient City','culture','A former urban center whose remains tell a story of civilizations.', [('City','Ruins'),('History','City'),('Ruins','Monument')]),
('Cave Painting','culture','Ancient images preserved on the stone walls of a cave.', [('Cave','Painting'),('Cave','Rock Art'),('Cave','Art')]),
('Sarcophagus','culture','A decorated stone coffin used for an important burial.', [('Tomb','Stone'),('Mummy','Stone'),('Pyramid','Tomb')]),
]
assert len(ROWS)==80,len(ROWS)

def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def norm(s):return unicodedata.normalize('NFKC',s).casefold().strip()

if __name__=='__main__':
 names={i['name']:i['id'] for i in BASE['items']}; base_keys={k:v for k,v in BASE['recipes']}
 seen_normal={norm(x) for x in names}
 for name,cat,desc,candidates in ROWS:
  if norm(name) in seen_normal:raise ValueError(f'duplicate planned catalog name: {name}')
  seen_normal.add(norm(name));names[name]='organic41:'+slug(name)
 selected=[]; used=set(base_keys); issues=[]; failures=[]
 for name,cat,desc,candidates in ROWS:
  valid=[]
  for a,b in candidates:
   if a not in names or b not in names:
    issues.append((name,a,b,'missing ingredient'))
    continue
   key='|'.join(sorted((names[a],names[b])))
   if key in used:
    issues.append((name,a,b,'recipe already assigned to '+str(base_keys.get(key,'another new outcome'))))
    continue
   if a==name or b==name:issues.append((name,a,b,'self-dependency'));continue
   valid.append([names[a],names[b],names[name]]);used.add(key)
   if len(valid)==2:break
  if len(valid)<2:
   failures.append((name,len(valid),candidates,[i for i in issues if i[0]==name])); valid += [['MISSING','MISSING',names[name]]]*(2-len(valid))
  selected.extend(valid)
 print('Failed',len(failures)); print('\n'.join(str(f) for f in failures));print('Skipped candidates',len(issues));print('\n'.join(map(str,issues)));
 if failures:raise SystemExit(2)
 items=[{'id':names[n], 'name':n,'category':cat,'summary':desc,'iconFamily':'organic'} for n,cat,desc,_ in ROWS]
 pack={'version':41,'items':items,'recipes':selected}
 out=ROOT/'client/src/organic-pack-v41.js';out.write_text('export const ORGANIC_V41 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n')
 editorial=[{'name':n,'category':cat,'description':desc,'paths':[[next(k for k,v in names.items() if v==rec[0]),next(k for k,v in names.items() if v==rec[1])] for rec in selected[2*j:2*j+2]]} for j,(n,cat,desc,_) in enumerate(ROWS)]
 (ROOT/'shared/v41-editorial-plan.json').write_text(json.dumps(editorial,ensure_ascii=False,indent=2)+'\n')
 print('Authored',len(items),'elements and',len(selected),'recipes')
