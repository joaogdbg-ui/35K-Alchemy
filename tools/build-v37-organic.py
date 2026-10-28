#!/usr/bin/env python3
"""Hand-authored V37 living-world paths and thirty-six original static pictograms.

The item descriptions, recipe pairings, and illustrations here are deliberately
edited rather than algorithmically concatenating concepts.
"""
import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
# Name, category, short encyclopedia description. The UI supplies separate jokes.
entries=[
('Algae','life','Simple photosynthetic organisms that thrive in water and form the base of many food webs.'),
('Plankton','life','Tiny drifting organisms that sustain much of the ocean food web.'),
('Kelp Forest','nature','An underwater forest of tall seaweed that shelters coastal wildlife.'),
('Seashell','material','A hard protective home left by a marine mollusk.'),
('Oyster','life','A shellfish that filters seawater and sometimes produces pearls.'),
('Pearl','material','A luminous gem formed as a mollusk layers nacre around an irritant.'),
('Seahorse','life','A small upright-swimming fish that grips seaweed with its tail.'),
('Sea Turtle','life','A seagoing reptile that returns to land to lay its eggs.'),
('Deep Sea','nature','The dark ocean realm far below the reach of sunlight.'),
('Bioluminescence','science','Light produced by living creatures through chemical reactions.'),
('Shipwreck','culture','The remains of a vessel resting beneath the waves.'),
('Treasure Chest','culture','A sturdy lockable chest that promises adventure before it is opened.'),
('Caterpillar','life','A hungry young butterfly or moth, built for eating and growing.'),
('Cocoon','life','A protective silk covering used by some insects during metamorphosis.'),
('Butterfly','life','A brightly winged adult insect that begins life as a caterpillar.'),
('Pollen','material','Fine grains released by seed plants during reproduction.'),
('Honeycomb','material','Hexagonal wax chambers that bees build to raise young and store honey.'),
('Beekeeper','culture','A person who cares for beehives and harvests honey.'),
('Fruit','life','The seed-bearing part of a flowering plant, often sweet and edible.'),
('Vegetable','life','An edible plant or plant part grown for meals.'),
('Harvest','culture','The gathering of crops when they are ready to be used.'),
('Irrigation','technology','The deliberate delivery of water to fields and gardens.'),
('Sunflower','life','A tall yellow-flowering plant famous for its broad sunny flower head.'),
('Bird Nest','nature','A carefully built shelter for eggs and growing chicks.'),
('Flour','material','Finely ground grain used as the foundation of many baked foods.'),
('Dough','material','A pliable blend of flour and liquid ready to be baked or cooked.'),
('Bread','culture','A simple staple food made by baking dough.'),
('Bakery','culture','A place where dough becomes bread, cakes and other baked goods.'),
('Chef','culture','A cook who plans, prepares and refines meals.'),
('Soup','culture','A warming dish made by cooking ingredients in liquid.'),
('Salad','culture','A meal of fresh vegetables, fruit or other mixed ingredients.'),
('Jam','culture','Fruit preserved by cooking it with sugar.'),
('Pastry','culture','A baked treat made with a delicate dough, often layered or filled.'),
('Recipe Book','culture','A collection of instructions that turns ingredients into dishes.'),
('Tea','culture','A fragrant drink made by steeping tea leaves or herbs in hot water.'),
('Cupcake','culture','A little cake baked in a single serving and dressed for a party.'),
]
# Each pairing is an individually reasoned alternative route to its result.
R={
'Algae':[('Sea','Plant'),('Sea','Sun'),('Ocean','Life')],
'Plankton':[('Algae','Sea'),('Water','Life'),('Algae','Fish')],
'Kelp Forest':[('Algae','Forest'),('Sea','Tree'),('Algae','Tree')],
'Seashell':[('Ocean','Sand'),('Sea','Animal'),('Sand','Animal')],
'Oyster':[('Seashell','Life'),('Sea','Seashell'),('Seashell','Water')],
'Pearl':[('Oyster','Sand'),('Oyster','Crystal'),('Seashell','Crystal')],
'Seahorse':[('Fish','Coral Reef'),('Fish','Kelp Forest'),('Fish','Plant')],
'Sea Turtle':[('Sea','Sand'),('Ocean','Animal')],
'Deep Sea':[('Ocean','Night'),('Sea','Cave')],
'Bioluminescence':[('Plankton','Light'),('Deep Sea','Life'),('Algae','Energy')],
'Shipwreck':[('Ship','Stone'),('Ship','Thunderstorm'),('Ship','Deep Sea')],
'Treasure Chest':[('Treasure','Wood'),('Shipwreck','Gold'),('Pirate','Treasure')],
'Caterpillar':[('Garden','Animal'),('Garden','Life'),('Plant','Butterfly')],
'Cocoon':[('Caterpillar','Thread'),('Caterpillar','Tree'),('Caterpillar','Forest')],
'Butterfly':[('Caterpillar','Flower'),('Cocoon','Sun'),('Cocoon','Air')],
'Pollen':[('Flower','Wind'),('Flower','Air')],
'Honeycomb':[('Beehive','Honey'),('Bee','Honey'),('Beehive','Wood')],
'Beekeeper':[('Human','Beehive'),('Human','Honey'),('Farm','Bee')],
'Fruit':[('Orchard','Sun'),('Flower','Pollination'),('Tree','Pollination')],
'Vegetable':[('Seed','Farm'),('Plant','Harvest'),('Soil','Harvest')],
'Harvest':[('Farm','Human'),('Orchard','Human'),('Farm','Fruit')],
'Irrigation':[('Farm','Water'),('Garden','River'),('Farm','River')],
'Sunflower':[('Seed','Sun'),('Garden','Sun')],
'Bird Nest':[('Tree','Animal'),('Animal','Wood'),('Tree','Plant')],
'Flour':[('Harvest','Stone'),('Farm','Food'),('Harvest','Seed')],
'Dough':[('Flour','Water'),('Flour','Food'),('Flour','Rain')],
'Bread':[('Dough','Fire'),('Dough','Heat')],
'Bakery':[('Bread','House'),('Bread','Shop'),('Dough','Factory')],
'Chef':[('Human','Food'),('Human','Recipe Book'),('Bakery','Human')],
'Soup':[('Vegetable','Water'),('Food','Steam'),('Chef','Water')],
'Salad':[('Vegetable','Fruit'),('Vegetable','Garden'),('Vegetable','Plant')],
'Jam':[('Fruit','Heat'),('Fruit','Honey'),('Fruit','Steam')],
'Pastry':[('Dough','Honey'),('Bakery','Fruit'),('Bakery','Honey')],
'Recipe Book':[('Book','Food'),('Book','Chef'),('Writing','Food')],
'Tea':[('Plant','Heat'),('Plant','Steam'),('Flower','Steam')],
'Cupcake':[('Pastry','Honey'),('Bakery','Jam'),('Dough','Fruit')],
}
# Hand drawn 100 x 100 pictograms, bold contour and readable at inventory size.
scenes={
'Algae':'''<path d="M30 80Q10 56 29 28Q49 43 37 78" fill="#62BC77" stroke="#3A8E6A" stroke-width="4"/><path d="M51 83Q36 43 61 16Q77 45 59 81" fill="#77C49A" stroke="#2B947B" stroke-width="4"/><path d="M73 82Q59 61 78 37Q92 53 81 79" fill="#4BAA8F" stroke="#318578" stroke-width="4"/><path d="M17 84q35-9 66 0" stroke="#6CB6D1" stroke-width="5" fill="none"/>''',
'Plankton':'''<circle cx="45" cy="52" r="19" fill="#ABDBA1" stroke="#4C9D82" stroke-width="4"/><circle cx="40" cy="47" r="4" fill="#4B766E"/><path d="M32 39 17 24m41 16 18-18M29 55 11 65m55-4 20 11M40 71 28 88m27-18 14 19" stroke="#83B1A8" stroke-width="4" stroke-linecap="round"/><circle cx="76" cy="35" r="7" fill="#F5D07A"/><circle cx="17" cy="78" r="5" fill="#8EC6E6"/><circle cx="72" cy="79" r="3" fill="#FFBEA1"/>''',
'Kelp Forest':'''<path d="M17 86q-4-30 13-63M39 87q8-45 7-66M61 86q-8-28 22-66M76 87q-9-39-12-51" fill="none" stroke="#347F60" stroke-width="5"/><path d="M22 41Q3 27 11 18q16 4 17 18M41 51Q19 47 21 33q19 0 25 12M61 63Q78 45 89 49 84 64 65 71M72 37q-19-8-9-22 14 4 16 18" fill="#86BE68" stroke="#44835D" stroke-width="3"/><path d="M7 88h88" stroke="#D3B783" stroke-width="6"/>''',
'Seashell':'''<path d="M16 68Q10 41 27 26q24-21 45 1 19 20 10 42L50 85Z" fill="#F4BD95" stroke="#BD776E" stroke-width="4"/><path d="M50 80 28 31m23 49L45 23m6 57 14-52M51 80l27-41" stroke="#D58D82" stroke-width="4"/><path d="M36 73h30" stroke="#FFF0CA" stroke-width="5" stroke-linecap="round"/>''',
'Oyster':'''<path d="M12 57q19-38 40-32 26-4 37 32L52 83Z" fill="#789AB2" stroke="#3C627B" stroke-width="5"/><path d="M17 58Q52 77 85 58L53 85Z" fill="#E3C9BB" stroke="#98746D" stroke-width="4"/><circle cx="52" cy="62" r="13" fill="#FFF6D8" stroke="#BFB5C5" stroke-width="3"/><path d="M27 49Q50 32 77 50" stroke="#B0D5D8" stroke-width="5" fill="none"/>''',
'Pearl':'''<circle cx="49" cy="52" r="30" fill="#F7F1EF" stroke="#B9B5D4" stroke-width="4"/><ellipse cx="40" cy="42" rx="12" ry="8" transform="rotate(-32 40 42)" fill="#fff" opacity=".95"/><path d="M26 70q20 17 45-2" fill="none" stroke="#D9C7E3" stroke-width="5" stroke-linecap="round"/><path d="m77 23 4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="#F4D68C"/>''',
'Seahorse':'''<path d="M49 16Q73 17 70 39l-13 9q-5 6 1 15 23 15 2 23-20 5-18-12" fill="#EDA66E" stroke="#A7604E" stroke-width="6" stroke-linecap="round"/><path d="M48 16 36 29 46 36 34 41l-9-8 11-14Z" fill="#FFC590" stroke="#A7604E" stroke-width="4"/><circle cx="54" cy="29" r="4" fill="#363D4F"/><path d="m47 48-17 1 14 14-11 9" stroke="#D87D65" stroke-width="4" fill="none"/><path d="M81 71q-10-6-17 2" stroke="#7DBDAA" stroke-width="4" fill="none"/>''',
'Sea Turtle':'''<ellipse cx="50" cy="53" rx="29" ry="24" fill="#85B783" stroke="#477F67" stroke-width="5"/><path d="m33 40 18-9 17 13-7 19-24 4-11-15Z" fill="#B4CA82" stroke="#608963" stroke-width="3"/><path d="M36 40 50 53 69 44M50 53l11 10m-11-10-13 14" stroke="#719568" stroke-width="3"/><ellipse cx="82" cy="55" rx="12" ry="10" fill="#A1CA92" stroke="#477F67" stroke-width="3"/><circle cx="86" cy="52" r="2.7" fill="#394853"/><path d="m27 41-14-7-5 13 16 8M29 65 13 74l15 9 12-11M66 35l8-13 13 5-11 19M68 69l9 15 12-8-12-15" fill="#85B783" stroke="#477F67" stroke-width="3"/>''',
'Deep Sea':'''<path d="M8 30q40 19 84 0v51H8Z" fill="#344D81"/><path d="M8 50q40-11 84 0v32H8Z" fill="#233A67"/><path d="M16 75q12-21 25-1t25-1q9-14 18 1" fill="none" stroke="#5875A8" stroke-width="5"/><circle cx="62" cy="48" r="6" fill="#D9D989"/><path d="M36 61q17-17 30 0-11 13-30 0Z" fill="#75B8C2"/><circle cx="41" cy="58" r="2" fill="#223755"/><circle cx="21" cy="40" r="2" fill="#F7D990"/><circle cx="77" cy="72" r="2" fill="#F7D990"/>''',
'Bioluminescence':'''<path d="M22 38Q48 9 76 38q12 17-1 30H24Q10 53 22 38Z" fill="#86C8CE" stroke="#40799C" stroke-width="4"/><path d="M28 66q0 10-7 17m23-17q0 13 5 21m16-21q7 10 2 17m10-18q10 8 6 17" stroke="#78CCCE" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="42" cy="41" r="8" fill="#EDFFB3"/><circle cx="60" cy="46" r="6" fill="#FBF6A0"/><path d="m18 16 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm64 6 3 6 5 3-5 2-3 7-3-7-6-2 6-3Z" fill="#F6E69B"/>''',
'Shipwreck':'''<path d="m9 58 73 0-17 23H27Z" fill="#BA8057" stroke="#6D513C" stroke-width="4"/><path d="M44 56V19l30 35H44Z" fill="#E7DBBA" stroke="#817969" stroke-width="4"/><path d="M42 21V55m-17-2 17-9" stroke="#6D5446" stroke-width="4"/><path d="m8 82 18-4 13 8 13-8 16 8 21-5" stroke="#69B8D0" stroke-width="5" fill="none"/><path d="M55 60 45 72m20-14-7 16" stroke="#7D4F3F" stroke-width="3"/>''',
'Treasure Chest':'''<path d="M17 45Q16 17 50 19q34-2 33 26v11H17Z" fill="#D7A465" stroke="#835739" stroke-width="5"/><rect x="15" y="49" width="70" height="33" rx="5" fill="#B97846" stroke="#835739" stroke-width="5"/><path d="M15 54h70M30 31v50m40-50v50" stroke="#E9C16F" stroke-width="6"/><rect x="42" y="51" width="16" height="22" rx="4" fill="#F7D77F" stroke="#AA8040" stroke-width="3"/><circle cx="50" cy="61" r="3" fill="#95653D"/>''',
'Caterpillar':'''<path d="M17 66q-5-21 14-23 11-20 27-8 13-14 24 3" fill="none" stroke="#6AA567" stroke-width="17" stroke-linecap="round"/><circle cx="79" cy="42" r="14" fill="#94C878" stroke="#568B56" stroke-width="4"/><circle cx="84" cy="38" r="3" fill="#394B48"/><path d="M68 30 65 18m17 12 9-10" stroke="#567E50" stroke-width="4" stroke-linecap="round"/><path d="M21 76v8m21-22v14m18-30v11" stroke="#5A7950" stroke-width="4" stroke-linecap="round"/><path d="M12 87h78" stroke="#BDA173" stroke-width="5"/>''',
'Cocoon':'''<path d="M50 9v24" stroke="#826A57" stroke-width="4"/><path d="M50 28Q26 42 33 65q3 22 17 24 18-4 17-27Q68 42 50 28Z" fill="#ECD8AD" stroke="#B39475" stroke-width="4"/><path d="M36 52q15-10 29-5M34 67q17-7 32-1M40 78q12-5 21-2" stroke="#C3A789" stroke-width="3" fill="none"/><path d="M17 16h66" stroke="#738568" stroke-width="5" stroke-linecap="round"/><path d="m18 17 10 9m45-10-11 10" stroke="#94AF77" stroke-width="5"/>''',
'Butterfly':'''<path d="M48 50Q17 7 9 39q-2 21 34 22Q10 74 26 85q15 6 23-28" fill="#EBA17E" stroke="#AC6884" stroke-width="4"/><path d="M52 50Q83 7 91 39q2 21-34 22Q90 74 74 85q-15 6-23-28" fill="#A5B8EB" stroke="#6D7EB3" stroke-width="4"/><path d="M50 40v36" stroke="#56465A" stroke-width="6" stroke-linecap="round"/><path d="M49 41 39 25m13 16 10-16" stroke="#56465A" stroke-width="3" fill="none"/><circle cx="28" cy="42" r="6" fill="#F9D78C"/><circle cx="73" cy="42" r="6" fill="#F6D28D"/>''',
'Pollen':'''<circle cx="50" cy="52" r="24" fill="#F1D377" stroke="#B89449" stroke-width="4"/><path d="m50 16v10m0 51v10m35-35H75M25 52H15m59-25-8 8M35 70l-8 9m47 0-8-8M34 34l-8-8" stroke="#E0B85C" stroke-width="6" stroke-linecap="round"/><circle cx="43" cy="45" r="3" fill="#C49B50"/><circle cx="61" cy="55" r="3" fill="#C49B50"/><circle cx="40" cy="62" r="3" fill="#C49B50"/>''',
'Honeycomb':'''<path d="m31 17 18 0 9 16-9 16H31l-9-16Zm26 0 18 0 9 16-9 16H57l-9-16ZM31 49h18l9 16-9 16H31l-9-16Zm26 0h18l9 16-9 16H57l-9-16Z" fill="#F3CA68" stroke="#B78245" stroke-width="4"/><path d="m31 17 9 16-9 16M57 17l9 16-9 16" stroke="#FFE4A2" stroke-width="3" fill="none"/>''',
'Beekeeper':'''<circle cx="48" cy="33" r="16" fill="#F0D1A1" stroke="#B18B6A" stroke-width="3"/><path d="M27 24q19-18 43 0l-5 8H33Z" fill="#F0E2B4" stroke="#9A8D73" stroke-width="4"/><path d="M27 33h44v24H27Z" fill="#E3EFF0" fill-opacity=".65" stroke="#9EB8B3" stroke-width="3"/><path d="M20 82V63q1-12 28-12t29 12v19" fill="#F5E7C0" stroke="#A99E7E" stroke-width="4"/><path d="M37 65h23v17H37Z" fill="#B8CCAD"/><path d="M76 49q9-6 13 1-6 8-13 1Z" fill="#F2BE63" stroke="#855C3F" stroke-width="2"/>''',
'Fruit':'''<circle cx="39" cy="61" r="20" fill="#EF8C6C" stroke="#A85352" stroke-width="4"/><circle cx="61" cy="58" r="20" fill="#ED9D65" stroke="#A85352" stroke-width="4"/><path d="M51 37v-16m0 5q15-12 27-3-13 15-27 11" fill="#6EA978" stroke="#477E57" stroke-width="4"/><path d="M33 48q5-5 10-4" stroke="#FFC8A6" stroke-width="4" stroke-linecap="round"/>''',
'Vegetable':'''<path d="M40 41q-11 21-7 40 7 9 16 0l12-40Z" fill="#F5AC67" stroke="#BE6F3C" stroke-width="4"/><path d="M50 42q-18-24-26-14 3 16 22 19m5-4q-1-28 11-29 8 16-9 30m1 0q15-23 27-13-10 18-24 17" fill="#75B17A" stroke="#47835F" stroke-width="3"/><path d="m41 60 12 6m-15 7 10 4" stroke="#D98552" stroke-width="3"/>''',
'Harvest':'''<path d="M22 49h56l-8 33H30Z" fill="#C99B69" stroke="#8B6549" stroke-width="4"/><path d="M30 51q-11-21 1-32 19 13 14 30M50 51Q41 19 56 12q16 15 8 37M67 51q-2-20 12-29 8 17-3 29" fill="#94BA73" stroke="#5B915E" stroke-width="4"/><path d="M22 63h56M44 52l-2 30m15-30 2 30" stroke="#AC7D52" stroke-width="3"/>''',
'Irrigation':'''<path d="M17 79q18-10 34 0t33 0" stroke="#AB8D61" stroke-width="7" fill="none"/><path d="M28 43v34m20-34v34m20-34v34" stroke="#79B36D" stroke-width="5"/><path d="M15 34h68" stroke="#6E929D" stroke-width="8" stroke-linecap="round"/><path d="m25 35-5 11m22-11-5 11m22-11-5 11m22-11-5 11" stroke="#70BDE1" stroke-width="4" stroke-linecap="round"/><path d="m28 70-7-8m27 8 7-8m13 8-7-8" stroke="#63AA6B" stroke-width="4"/>''',
'Sunflower':'''<path d="M49 54v33M49 69Q28 54 20 67q11 15 29 12M50 69q19-17 31-7Q70 80 50 80" stroke="#4E9E69" stroke-width="6" fill="#8EBD69" stroke-linecap="round"/><g fill="#F5C95A" stroke="#C18D3B" stroke-width="2"><ellipse cx="50" cy="20" rx="9" ry="16"/><ellipse cx="50" cy="63" rx="9" ry="16"/><ellipse cx="29" cy="42" rx="16" ry="9"/><ellipse cx="71" cy="42" rx="16" ry="9"/><ellipse cx="35" cy="27" rx="10" ry="15" transform="rotate(-45 35 27)"/><ellipse cx="65" cy="27" rx="10" ry="15" transform="rotate(45 65 27)"/></g><circle cx="50" cy="42" r="17" fill="#775B3B" stroke="#4E432E" stroke-width="3"/><circle cx="44" cy="38" r="2" fill="#D5AD72"/><circle cx="56" cy="46" r="2" fill="#D5AD72"/>''',
'Bird Nest':'''<path d="M13 57q38 25 74 0l-14 25H27Z" fill="#AF8154" stroke="#79593E" stroke-width="4"/><path d="m13 58 24 13 18-13 26 14m-60-19 20 12 23-11 17 9" stroke="#D1A071" stroke-width="5" fill="none"/><ellipse cx="39" cy="52" rx="12" ry="17" fill="#B8D7D0" stroke="#6C9F9C" stroke-width="3"/><ellipse cx="60" cy="49" rx="12" ry="17" fill="#F1D59D" stroke="#BA976A" stroke-width="3"/>''',
'Flour':'''<path d="M24 34h51l8 50H17Z" fill="#EFE2BB" stroke="#A89C7B" stroke-width="4"/><path d="M31 29h37l7 9H25Z" fill="#C8AA7A" stroke="#997956" stroke-width="3"/><path d="M49 43q-16 17 0 35 16-18 0-35Z" fill="#F9F8ED"/><path d="M49 46v29m-10-14 10 9m10-9-10 9" stroke="#D4C9B0" stroke-width="3"/>''',
'Dough':'''<path d="M15 64q0-26 22-25 9-22 30-7 24 3 20 33 3 20-30 20H37Q14 82 15 64Z" fill="#F3D39C" stroke="#B99160" stroke-width="4"/><path d="M27 60q9-8 18-2m10-14q8-7 18 2" stroke="#FFEAC6" stroke-width="5" stroke-linecap="round"/><path d="M25 81h54" stroke="#DFC092" stroke-width="4"/>''',
'Bread':'''<path d="M18 41Q9 23 28 19q11-17 25-4 19-9 28 8 13 8 4 22v33H18Z" fill="#DEAA68" stroke="#996943" stroke-width="4"/><path d="M26 46q18-11 47-3" fill="none" stroke="#F0C78A" stroke-width="5"/><path d="M20 52h62v27H20Z" fill="#F6DCA2" stroke="#BA8A52" stroke-width="3"/><path d="M34 56q-3 9 0 16m19-16q-4 9 0 16m17-16q-3 9 0 16" stroke="#D6AD73" stroke-width="4"/>''',
'Bakery':'''<path d="m14 46 35-27 37 27v37H14Z" fill="#F5DBBC" stroke="#A87A60" stroke-width="4"/><rect x="36" y="55" width="28" height="28" fill="#B7D5D3" stroke="#8A766A" stroke-width="4"/><path d="M11 43h77v12H11Z" fill="#E9A093" stroke="#B97265" stroke-width="3"/><path d="M20 43v12m16-12v12m16-12v12m16-12v12m16-12v12" stroke="#FFF6E2" stroke-width="6"/><path d="M40 68q10-12 20 0v8H40Z" fill="#DCA76B"/>''',
'Chef':'''<path d="M31 40q-9-9 0-19 11-10 21 0 12-12 22 0 8 11 0 20Z" fill="#F8F7EF" stroke="#A0A1A0" stroke-width="3"/><rect x="31" y="37" width="43" height="10" rx="3" fill="#F6F5EA" stroke="#A0A1A0" stroke-width="3"/><circle cx="52" cy="56" r="17" fill="#E5B88B" stroke="#AC7A64" stroke-width="3"/><path d="M22 86q4-22 30-20 27-2 29 20Z" fill="#F5F4EB" stroke="#B1B2B3" stroke-width="4"/><path d="M52 69v15" stroke="#A8A9A8" stroke-width="3"/><circle cx="44" cy="54" r="2.5" fill="#49454C"/><circle cx="60" cy="54" r="2.5" fill="#49454C"/>''',
'Soup':'''<path d="M17 48h66q0 31-33 35-33-4-33-35Z" fill="#D7A16C" stroke="#8E6C60" stroke-width="4"/><ellipse cx="50" cy="49" rx="33" ry="10" fill="#E9BA75" stroke="#AD8B6C" stroke-width="3"/><circle cx="39" cy="49" r="5" fill="#80AC6D"/><circle cx="59" cy="52" r="5" fill="#D57D65"/><path d="M32 29q-8-8 0-18m19 20q-8-8 0-18m19 20q-8-8 0-18" stroke="#94BACA" stroke-width="4" fill="none" stroke-linecap="round"/>''',
'Salad':'''<path d="M17 53h66q-1 27-33 30-32-3-33-30Z" fill="#D9BCA3" stroke="#90786B" stroke-width="4"/><path d="M27 53q-20-17 1-28 12 0 15 13Q46 16 60 24q11-12 21 0 14 22-3 31Z" fill="#86BA75" stroke="#4D9063" stroke-width="3"/><circle cx="40" cy="48" r="8" fill="#D97264"/><circle cx="65" cy="40" r="8" fill="#EDC15F"/><path d="M50 32q6 12-3 22" stroke="#B5D692" stroke-width="5"/>''',
'Jam':'''<rect x="24" y="35" width="52" height="51" rx="8" fill="#D38A90" stroke="#8E5965" stroke-width="4"/><rect x="29" y="39" width="42" height="39" rx="6" fill="#BF516A"/><path d="M21 32h58v12H21Z" fill="#EBCB9B" stroke="#A98767" stroke-width="4"/><rect x="32" y="55" width="36" height="18" rx="4" fill="#FFF0D4"/><path d="M43 62q7-7 14 0-7 7-14 0Z" fill="#C95B6C"/><path d="M44 67q8-7 13 0" fill="none" stroke="#C95B6C" stroke-width="2"/>''',
'Pastry':'''<path d="M16 70q10-42 34-42 24 0 34 42L51 84Z" fill="#E7B275" stroke="#A6764B" stroke-width="4"/><path d="M26 64q17-25 49 0M33 52q14-15 33 0" stroke="#F6D8A5" stroke-width="6" fill="none"/><path d="M20 80q28-13 61 0" stroke="#BE845D" stroke-width="5" fill="none"/><circle cx="50" cy="32" r="8" fill="#D77C85" stroke="#9B5C62" stroke-width="2"/>''',
'Recipe Book':'''<path d="M13 24q18-8 37 4v56q-18-12-37-4Zm37 4q20-13 37-4v56q-18-8-37 4Z" fill="#FFF3D9" stroke="#9F8578" stroke-width="4" stroke-linejoin="round"/><path d="M50 27v55M23 41h16m-16 9h16m-16 9h12m25-18h16m-16 9h16m-16 9h12" stroke="#BC9D85" stroke-width="3" stroke-linecap="round"/><path d="m69 60 5 8 8-3" stroke="#74AD82" stroke-width="4" fill="none"/>''',
'Tea':'''<path d="M20 41h53v27q-6 17-26 17-25-2-27-24Z" fill="#F5E6CB" stroke="#947B6E" stroke-width="4"/><path d="M73 48q23-4 18 15-3 11-21 9" stroke="#947B6E" stroke-width="5" fill="none"/><ellipse cx="46" cy="44" rx="26" ry="7" fill="#B2A067"/><path d="M32 29q-8-9 0-18m18 17q-8-9 0-18m18 17q-8-9 0-18" stroke="#A0BEB5" stroke-width="4" fill="none" stroke-linecap="round"/>''',
'Cupcake':'''<path d="M25 50h50l-9 34H34Z" fill="#E49DA5" stroke="#B96B7C" stroke-width="4"/><path d="M32 58 38 80m10-22v22m13-22-4 22" stroke="#F4C7BE" stroke-width="4"/><path d="M25 52q-15-19 7-25 6-22 23-13 19-7 21 12 18 6 0 26Z" fill="#F7E4C5" stroke="#BA9B88" stroke-width="4"/><circle cx="52" cy="20" r="8" fill="#E87883" stroke="#A85161" stroke-width="3"/><path d="M48 15q0-9 10-8" stroke="#69A778" stroke-width="3" fill="none"/>''',
}
assert len(entries)==len(R)==len(scenes)==36
# Avoid inventing translations, renaming existing items, overwriting prior recipes, or creating unreachable branches.
js="""import{DATA}from'./client/src/legacy-data.js';import{PACK}from'./client/src/creative-pack.js';import{GAMING_V22}from'./client/src/gaming-pack-v22.js';import{GAMING_V23}from'./client/src/gaming-pack-v23.js';import{GAMING_V24}from'./client/src/gaming-pack-v24.js';import{GAMING_V26}from'./client/src/gaming-pack-v26.js';import{GAMING_V27}from'./client/src/gaming-pack-v27.js';import{GAMING_V30}from'./client/src/gaming-pack-v30.js';import{ORGANIC_V32}from'./client/src/organic-pack-v32.js';import{ORGANIC_V34}from'./client/src/organic-pack-v34.js';let names={};DATA.items.forEach(([name],i)=>names[name.toLowerCase()]??='legacy:'+i);let recipes=DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]);for(const p of[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34]){for(const it of p.items)names[it.name.toLowerCase()]??=it.id;recipes.push(...p.recipes)}console.log(JSON.stringify({names,recipes}));"""
all_data=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=root,text=True))
prior=all_data['names'];seen={ '|'.join(sorted([a,b])):c for a,b,c in all_data['recipes'] }
new={n:'organic37:'+n.lower().replace(' ','-') for n,_,_ in entries}
for name in new:
 assert name.lower() not in prior,('name already exists',name)
 def_id=new[name]
 assert def_id not in prior.values()
def rid(n):
 if n in new:return new[n]
 if n.lower() in prior:return prior[n.lower()]
 raise ValueError('Unknown ingredient: '+n)
items=[{'id':new[name],'name':name,'category':category,'summary':summary,'iconFamily':'organic'} for name,category,summary in entries]
recipes=[];omitted=[]
for out,pairs in R.items():
 for a,b in pairs:
  key='|'.join(sorted((rid(a),rid(b))))
  if key in seen:
   omitted.append((out,a,b,seen[key]));continue
  seen[key]=new[out];recipes.append([rid(a),rid(b),new[out]])
for name in new:
 n=sum(r[2]==new[name] for r in recipes)
 assert n>=2,(name,n,[x for x in omitted if x[0]==name])
base='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="94" rx="36" ry="4" fill="#536C74" opacity=".10"/>'
art={name.lower():base+scenes[name]+'</svg>' for name in new}
assert len(set(art.values()))==36
(root/'client/src/organic-pack-v37.js').write_text('export const ORGANIC_V37 = '+json.dumps({'version':37,'items':items,'recipes':recipes},ensure_ascii=False,separators=(',',':'))+';\n')
(root/'client/src/organic-art-v37.js').write_text('export const ORGANIC_ART_V37 = '+json.dumps(art,ensure_ascii=False,separators=(',',':'))+';\n')
(root/'shared/v37-organic-report.json').write_text(json.dumps({'items':len(items),'recipes':len(recipes),'dropped_conflicts':omitted},indent=2)+'\n')
print('V37',len(items),'items',len(recipes),'recipes','skipped',len(omitted),'conflicts',omitted)
