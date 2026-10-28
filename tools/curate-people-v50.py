#!/usr/bin/env python3
"""Create one audited People & Culture family-only graph. No random/fallback recipes."""
import json,collections,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads(ROOT/'shared/v50-base-catalog.json'.read_text())
items=data['items']; by_id={x['id']:x for x in items}; by_name={x['name']:x['id'] for x in items}
# category mapping defined by familyFor() in discoveries.js: special names are not people.
family={i['id'] for i in items if i['category'] in ['politician','culture'] and i['name'] not in ['Moon','Planet','Space','Star','Bread']}
assert len(family)==167,len(family)
name=lambda n:by_name[n]
starts=['House','Book','Art','Trade']; starters=list(map(name,starts))
recipes={key:out for key,out in data['recipes'] if out in family and all(p in family for p in key.split('|'))}
original_count=len(recipes); classic=dict(data['recipes'])
# Every custom relationship has been individually authored. No automatic mixing of random elements.
# Each entry expresses result: (ingredient A, ingredient B) with optional well-grounded alternatives.
plan='''
Society : Village + Trade | Village + House
Language : Book + Trade | Village + Book
Writing : Language + Art | Language + Book
Knowledge : Book + Number | Museum + Book
Money : Market + Trade | Shop + Trade
Number : Knowledge + Trade | Money + Book
Rule : Society + Knowledge | History + Society
Hero : History + Art | Princess + History
Villain : Hero + Fantasy | Hero + Monster
Fantasy : Art + Knowledge | Book + Art
Monster : Fantasy + Art | Villain + Fantasy
Dragon : Monster + Fantasy | Monster + Magic
Magic : Fantasy + History | Fantasy + Knowledge
Science Fiction : Fantasy + Developer | Fantasy + Knowledge
Europe : History + Trade | City + History
United States : Europe + Trade | Europe + History
United Kingdom : Europe + Society | Europe + Village
Company : Market + Trade | Shop + Society
Developer : Company + Knowledge | Knowledge + Studio
Content Creator : Art + Developer | Studio + Writing
Music : Theater + Art | Art + Playtime
Soundtrack : Music + Writing | Music + Book
Toy : Art + House | Art + Village
Playtime : Toy + Society | Toy + House
Fun : Art + Playtime | Music + Playtime
Competition : Rule + Playtime | Challenge + Playtime
Challenge : Competition + Knowledge | Competition + Rule
Strategy : Challenge + Book | Challenge + Knowledge
Achievement : Competition + Challenge | Challenge + History
Esports : Competition + Developer | Competition + Video Game Museum
Painting : Art + Workshop | Art + Studio
Theater : Society + Art | Music + Art
Nostalgia : History + Toy | History + Art
Pixel art : Art + Developer | Art + Number
Animation : Pixel art + Art | Pixel art + Studio
Luck : Playtime + Trade | Competition + Trade
Retro gaming : Developer + Nostalgia | Toy + Nostalgia
Studio : Company + Art | Company + Music
High Score : Competition + Number | Achievement + Number
Collector : Trade + History | Money + Nostalgia
Video Game Museum : Collector + History | Collector + Retro gaming
Coreia : Japan + Trade | Japan + Music
Sequel : History + Animation | History + Developer
Expansion : Sequel + Developer | Studio + Sequel
Definitive Edition : Expansion + History | Expansion + Collector
Friendship : Fun + Society | Society + Playtime
Game Jam : Developer + Playtime | Developer + Studio

Harvest : House + Village | Art + Village
Beekeeper : Harvest + House | Harvest + Village
Bakery : Shop + Chef | Market + Chef
Chef : House + Market | House + Knowledge
Soup : Chef + House | Chef + Market
Salad : Chef + Harvest | Harvest + Market
Jam : Harvest + Chef | Harvest + Shop
Pastry : Bakery + Chef | Bakery + Art
Recipe Book : Book + Chef | Book + Bakery
Tea : Harvest + Book | Harvest + Shop
Cupcake : Bakery + Jam | Bakery + Pastry
Milk : Village + Harvest | Harvest + House
Cream : Milk + Chef | Milk + Bakery
Bonsai : Art + Harvest | Art + Village
Terrarium : Bonsai + House | Bonsai + Art
Cheese : Milk + Chef | Milk + Trade
Butter : Cream + Chef | Cream + Milk
Omelet : Chef + Milk | Milk + House
Pasta : Chef + Pastry | Chef + Book
Pizza : Bakery + Cheese | Chef + Cheese
Chocolate : Shop + Cream | Milk + Pastry
Coffee : Market + Tea | Tea + Chef
Cookie : Bakery + Butter | Pastry + Butter
Sandwich : Bakery + Chef | Bakery + Soup
Lemonade : Tea + Harvest | Tea + Jam
Ice Cream : Cream + Chocolate | Milk + Chocolate

Constellation : History + Science Fiction | Art + Science Fiction
Concert : Music + City | Music + Theater
Choir : Music + Friendship | Music + Village
Sheet Music : Music + Writing | Music + Book
Workshop : Company + Art | Studio + Trade
Pottery : Art + Workshop | Workshop + House
Arch : Workshop + House | Art + House
Column : Arch + House | Arch + Workshop
Tower : Column + Village | Column + City
Cathedral : Choir + Tower | Choir + Arch
Ruins : History + House | History + Village
Monument : History + Column | History + Art
Plaza : City + Market | City + Art
Museum : Art + History | House + Artifact
Library : House + Book | City + Book
Harbor : City + Workshop | Village + Workshop
Port : Trade + Harbor | Market + Harbor
Shipyard : Workshop + Harbor | Harbor + Company
Shipwreck : Shipyard + History | Shipyard + Ruins
Treasure Chest : Trade + Collector | Collector + Shipwreck
Artifact : History + Pottery | History + Art
Relic : Artifact + History | Artifact + Museum
Pyramid : Monument + History | Ruins + Monument
Mummy : Pyramid + Relic | Tomb + Relic
Hieroglyphics : Writing + Pyramid | Pyramid + Art
Explorer : History + Trade | Artifact + Trade
Expedition : Explorer + Trade | Explorer + History
Landmark : Explorer + Monument | Expedition + Monument
Rock Art : Painting + History | Art + Ruins
Tomb : History + Pyramid | History + Ruins
Archaeologist : Artifact + Explorer | Relic + Explorer
Treasure Map : Explorer + Treasure Chest | Explorer + Book
Ancient City : City + History | City + Ruins
Cave Painting : Painting + Ruins | Rock Art + History
Sarcophagus : Mummy + Tomb | Tomb + Artifact

Croissant : Pastry + Butter | Bakery + Butter
Bagel : Bakery + Pastry | Bakery + Trade
Pretzel : Pastry + Trade | Bakery + Trade
Pancake : Bakery + Milk | Milk + Jam
Waffle : Pancake + Bakery | Pancake + Pastry
Cake : Pastry + Cream | Pastry + Chocolate
Popcorn : Chef + Playtime | Chef + Toy
Noodles : Soup + Pasta | Pasta + Chef
Dumpling : Soup + Pastry | Soup + Chef
Pie : Jam + Pastry | Pastry + Harvest
Photograph : Photographer + Portrait | Painting + Developer
Darkroom : Photograph + House | Photographer + House
Photographer : Painting + Developer | Portrait + Art
Portrait : Painting + Society | Painting + Hero
Balloon : Art + Playtime | Toy + Art
Sandcastle : House + Playtime | Village + Playtime
Wind Chime : Music + House | Music + Workshop
Smoke Signal : History + Trade | Ruins + History
Bird Feeder : Beekeeper + House | Harvest + Toy
Aquarium : Terrarium + House | Terrarium + Museum
Kaleidoscope : Art + Magic | Art + Nostalgia
Sourdough : Bakery + History | Bakery + History
Baguette : Bakery + Trade | Bakery + History
Custard : Cream + Milk | Cream + Bakery
Meringue : Cream + Cake | Cream + Chef
Fruit Tart : Pie + Custard | Pie + Cream
Marmalade : Jam + Tea | Jam + Harvest
Crouton : Soup + Bakery | Soup + Sandwich
Smithy : Workshop + Trade | Workshop + Tower
Watchtower : Tower + Trade | Tower + History
Street Market : City + Trade | Market + Town Square
Town Square : Village + Plaza | City + Plaza
Herb Butter : Butter + Harvest | Butter + Chef
Garlic Bread : Bakery + Herb Butter | Baguette + Herb Butter
Apple Turnover : Pastry + Harvest | Pie + Pastry
Fruit Compote : Jam + Harvest | Jam + Chef
Cinnamon Roll : Pastry + Chocolate | Bakery + Marmalade
Honey Glaze : Jam + Pastry | Jam + Cream
Cheese Pastry : Pastry + Cheese | Butter + Cheese
Chocolate Truffle : Chocolate + Custard | Chocolate + Cream
Fruit Sorbet : Fruit Compote + Cream | Jam + Cream
Toasted Seeds : Chef + Harvest | Bakery + Harvest
Tram Stop : City + Trade | City + Tower
Public Fountain : Plaza + Art | Monument + Plaza
Market Stall : Market + Shop | Shop + Plaza
Cobblestone Lane : City + Ruins | City + Arch
Photo Album : Book + Photograph | Book + Photographer
Photo Collage : Art + Photo Album | Photograph + Art
'''
choices={}
for ln in plan.splitlines():
 ln=ln.strip()
 if not ln or ln.startswith('#'):continue
 target,raw=ln.split(' : ',1)
 assert target in by_name,target
 assert name(target) in family,target
 options=[tuple(x.strip() for x in alt.split(' + ')) for alt in raw.split(' | ')]
 for a,b in options:
  assert a in by_name,(target,a)
  assert b in by_name,(target,b)
  assert name(a) in family,(target,a,'outside family')
  assert name(b) in family,(target,b,'outside family')
 choices[target]=options

reachable=set(starters); selected=[]
for round_number in range(300):
 before=len(reachable)
 for pair,out in recipes.items():
  a,b=pair.split('|')
  if a in reachable and b in reachable:reachable.add(out)
 for target,options in choices.items():
  out=name(target)
  if out in reachable:continue
  for a,b in options:
   A,B=name(a),name(b)
   if A not in reachable or B not in reachable:continue
   key='|'.join(sorted((A,B)))
   if key in classic and classic[key]!=out:continue
   if key in recipes and recipes[key]!=out:continue
   if key not in recipes:
    recipes[key]=out;selected.append({'a':a,'b':b,'result':target,'pair':key})
   reachable.add(out)
   break
 if len(reachable)==before:break
missing=[by_id[x]['name'] for x in family-reachable]
print('family',len(family),'existing recipes',original_count,'added',len(selected),'reachable',len(reachable),'unreachable',len(missing))
print('missing:',missing)
print('reachable names:',sorted(by_id[x]['name'] for x in reachable))
print('unused plans:',[x for x in choices if name(x) not in reachable])
for target in ['Language','Writing','Knowledge','Fantasy','Developer','Harvest','Milk','Painting','Music','Harbor','Rule']:
 print('BLOCK',target,[(a,b,a in [by_id[x]['name'] for x in reachable],b in [by_id[x]['name'] for x in reachable],by_id.get(classic.get('|'.join(sorted([name(a),name(b)]))),{}).get('name','free')) for a,b in choices[target]])
# Only ship a complete graph, never hide missing elements or seed them for free.
for target in [by_id[x]['name'] for x in family-reachable]:
 if target not in choices:print('NO PLAN:',target);continue
 print('MISS:',target,[(a,b,a in [by_id[x]['name'] for x in reachable],b in [by_id[x]['name'] for x in reachable],by_id.get(classic.get('|'.join(sorted([name(a),name(b)]))),{}).get('name','free'),by_id.get(recipes.get('|'.join(sorted([name(a),name(b)]))),{}).get('name','free')) for a,b in choices[target]])
if missing: raise SystemExit(2)
output={'id':'people','name':'People & Culture','starters':starters,'items':sorted(family),'recipes':sorted(recipes.items()),'curatedCount':len(selected),'originalCount':original_count,'totalFamilyElements':len(family)}
(ROOT/'shared/v50-people-editorial-report.json').write_text(json.dumps({'version':50,'family':'people','starters':starts,'addedRecipes':selected,'existingInternalRecipes':original_count,'reachability':len(reachable),'missing':missing},indent=2)+'\n')
(ROOT/'client/src/family-mode-v50.js').write_text('/* V50: curated, independently complete People & Culture family campaign. */\nexport const FAMILY_V50 = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n')
