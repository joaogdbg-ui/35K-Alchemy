#!/usr/bin/env python3
"""Create original, offline SVG pictograms for the 48 curated V52 elements.
No third-party graphics, imports or runtime requests. Artwork is deterministic."""
import json, hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1]
items=json.loads((R/'shared/v52-editorial-plan.json').read_text())['items']
# Each illustration has a hand-composed pairing of two distinct illustrated motifs.
MOTIFS={
'cloud':('''<path d="M21 66q-14-5-11-19 2-12 17-12 5-23 29-24 23-1 29 18 15 1 18 15 4 20-18 23z" fill="#DFEAF2" stroke="#7898AC" stroke-width="4"/><path d="M31 44q5-12 16-13" fill="none" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>'''),
'fog':('''<path d="M13 39q16-12 31 0t39 0M8 57q20-12 43 1t40-1M15 75q19-10 38 0t34 0" stroke="#88AEB8" stroke-width="6" fill="none" stroke-linecap="round"/>'''),
'rain':('''<path d="M31 21q8 16 0 23-9 7-15-3-3-8 15-20zm39 16q11 15 0 24-13 9-17-4-1-5 17-20zm-29 30q8 17-2 22-11 5-14-5z" fill="#78C4DC" stroke="#397CA0" stroke-width="3"/>'''),
'snow':('''<path d="M50 8v84M8 50h84M20 20l60 60M80 20 20 80M50 8l-10 12m10-12 10 12M92 50 80 40m12 10-12 10" stroke="#77B8D8" stroke-width="5" fill="none" stroke-linecap="round"/>'''),
'ice':('''<path d="M26 24 58 12 86 45 72 85 33 88 15 52z" fill="#B6E9F4" stroke="#599CB9" stroke-width="4"/><path d="M58 12 47 53 72 85M15 52l32 1 39-8" fill="none" stroke="#FFF" stroke-width="3"/>'''),
'sun':('''<circle cx="50" cy="50" r="23" fill="#F6C45E" stroke="#D18A43" stroke-width="4"/><path d="M50 5v13M50 82v13M5 50h13M82 50h13M18 18l9 9M73 73l9 9M82 18l-9 9M27 73l-9 9" fill="none" stroke="#E7AC48" stroke-width="6" stroke-linecap="round"/>'''),
'halo':('''<circle cx="50" cy="50" r="37" stroke="#E9B964" stroke-width="8" fill="none"/><circle cx="50" cy="50" r="24" stroke="#A8D5EC" stroke-width="5" fill="none"/><circle cx="50" cy="50" r="12" fill="#FFE39E"/>'''),
'mountain':('''<path d="M5 79 34 21l18 27 12-19 32 50z" fill="#93ABC0" stroke="#55748D" stroke-width="4" stroke-linejoin="round"/><path d="m22 45 12-24 12 18-11-5zM59 39l5-10 11 19-11-4z" fill="#F1F8FA"/>'''),
'wind':('''<path d="M8 28h54q21 0 16-15-3-11-14-7M7 50h80q18 0 12-14-4-8-13-6M12 73h52q21 1 16 15-3 9-14 5" stroke="#8CC8C5" stroke-width="8" stroke-linecap="round" fill="none"/>'''),
'wave':('''<path d="M7 67q11-27 28-20 12 5 12 20 8-25 25-20 12 4 21 19v18H7z" fill="#75BAD9" stroke="#3D91AF" stroke-width="4"/><path d="M10 72q12-10 23 0t23 0 30 0" stroke="#DDF7FF" fill="none" stroke-width="5" stroke-linecap="round"/>'''),
'geyser':('''<path d="M15 81q8-23 24-23h25q16 0 21 23" fill="#B6A48D" stroke="#846F61" stroke-width="4"/><path d="M50 60q-13-24-4-43 9-13 15-2 9 17-8 45M31 55q-8-14-2-26M72 55q9-14 3-25" stroke="#74C8E5" stroke-width="7" fill="none" stroke-linecap="round"/>'''),
'lightning':('''<path d="m53 7-29 48h25l-13 39 43-55H53l13-32z" fill="#FFE46E" stroke="#DDA33B" stroke-width="4" stroke-linejoin="round"/>'''),
'droplet':('''<path d="M50 8C32 31 20 48 20 64a30 30 0 0 0 60 0C80 48 68 31 50 8z" fill="#8BD4E6" stroke="#3A94BA" stroke-width="4"/><path d="M35 61q-1 16 13 21" stroke="#F5FFFF" stroke-width="7" fill="none" stroke-linecap="round"/>'''),
'branch':('''<path d="M17 88q32-25 60-71M37 69 24 43M53 52l26-6M62 38l-5-24" stroke="#8A6757" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M24 43q-4-23 13-25 8 14-13 25M79 46q14-18 0-26-13 7 0 26" fill="#88C0A2" stroke="#4E8E75" stroke-width="3"/>'''),
'tree':('''<path d="M47 57h12v32H47z" fill="#9D7458" stroke="#735241" stroke-width="3"/><path d="M18 60 50 10l32 50z" fill="#75B89A" stroke="#4B927A" stroke-width="4"/><path d="m25 43 25-33 23 33z" fill="#9BD0A2"/>'''),
'leaf':('''<path d="M18 74Q11 18 77 16q12 65-44 66z" fill="#8EC9A1" stroke="#4A9872" stroke-width="4"/><path d="M21 89Q48 46 76 20M37 63l-11-21m27 1 18 2" stroke="#3E916E" stroke-width="4" fill="none" stroke-linecap="round"/>'''),
'flower':('''<path d="M50 55v36" stroke="#5A9E76" stroke-width="6"/><path d="M48 74q-24-22-27 3 10 9 27-3m3-7q23-20 28 5-9 13-28-5" fill="#85C2A0"/><g fill="#ED9FB0" stroke="#C97D97" stroke-width="2"><circle cx="50" cy="28" r="15"/><circle cx="27" cy="42" r="15"/><circle cx="72" cy="42" r="15"/><circle cx="39" cy="61" r="15"/><circle cx="63" cy="61" r="15"/></g><circle cx="50" cy="44" r="12" fill="#F6D16A"/>'''),
'grass':('''<path d="M13 85q-5-32 17-58-2 31 11 41Q40 31 56 13q-1 39 7 47 8-27 25-34-8 35 0 59z" fill="#8BCB9E" stroke="#4B9B79" stroke-width="4" stroke-linejoin="round"/>'''),
'roots':('''<path d="M48 11v42m0 0L20 82m28-29 28 33M48 53 43 88m-25-16 14 4m35-4-8 8M27 31l19 23 22-23" fill="none" stroke="#9A7661" stroke-width="7" stroke-linecap="round"/><path d="M16 29q17-17 28 0-11 13-28 0M54 28q14-18 32-1-14 16-32 1" fill="#8FBF99"/>'''),
'mushroom':('''<path d="M39 50h23v36H39z" fill="#EEDCC7" stroke="#9F8170" stroke-width="4"/><path d="M12 52q3-43 39-43 33 0 38 43-8 10-20 0-10 10-22 1-13 11-35-1z" fill="#D6A47C" stroke="#9A6C60" stroke-width="4"/><circle cx="45" cy="27" r="6" fill="#FFF2DC"/><circle cx="65" cy="39" r="5" fill="#FFF2DC"/>'''),
'coral':('''<path d="M49 84V18m0 30L25 25m24 37 25-24M31 84V52m36 32V65M50 35 66 15" stroke="#E59C93" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M12 86h76" stroke="#C7AD82" stroke-width="6" stroke-linecap="round"/>'''),
'kelp':('''<path d="M40 91Q57 48 40 9m14 82Q43 49 67 17" fill="none" stroke="#438F75" stroke-width="6"/><path d="M38 64Q10 42 22 30q20 3 16 34m7-24q21-20 28-15-2 17-28 15m9 29q24-17 32-10-8 17-32 10" fill="#80C6A0" stroke="#4B9C7B" stroke-width="3"/>'''),
'fish':('''<path d="M12 51q29-35 62 0-33 35-62 0l-8-22v44z" fill="#8CC9DD" stroke="#448EAA" stroke-width="4"/><circle cx="60" cy="45" r="4" fill="#284E65"/><path d="M35 35 47 21l8 16M35 67l12 12 9-16" fill="#84C6AB" stroke="#448EAA" stroke-width="3"/>'''),
'crab':('''<ellipse cx="50" cy="55" rx="25" ry="18" fill="#EBA589" stroke="#AD6B61" stroke-width="4"/><path d="M29 50 13 28m58 22 16-22M27 61 13 70m21-4-10 16m41-16 10 16m0-21 14 9" fill="none" stroke="#B56F64" stroke-width="6" stroke-linecap="round"/><path d="m8 21 13 6-12 13M92 21l-13 6 12 13" fill="#F2AF92" stroke="#B56F64" stroke-width="4"/><circle cx="42" cy="51" r="4"/><circle cx="58" cy="51" r="4"/>'''),
'shell':('''<path d="M15 65Q16 17 50 15q36 2 35 50L50 88z" fill="#F2D3AD" stroke="#B58D7F" stroke-width="4"/><path d="M50 21v61M28 30l22 52M70 30 50 82M17 55l33 27m33-27L50 82" fill="none" stroke="#D9A58D" stroke-width="3"/>'''),
'pool':('''<ellipse cx="50" cy="70" rx="42" ry="19" fill="#83CDE1" stroke="#5CA4BF" stroke-width="4"/><path d="M26 66q9-7 18 1t18 0 13 0" stroke="#D9F7F9" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M19 46q5-13 16-17M71 45q11-12 15-7" stroke="#C7AA8B" stroke-width="8" fill="none" stroke-linecap="round"/>'''),
'basket':('''<path d="M18 44h64l-8 43H26z" fill="#DAB787" stroke="#987557" stroke-width="4" stroke-linejoin="round"/><path d="M27 47q0-40 23-40 24 0 24 40" stroke="#B18A69" stroke-width="7" fill="none"/><path d="M36 50v31m15-31v31m14-31v31M26 67h48" stroke="#AF8968" stroke-width="4"/>'''),
'bread':('''<path d="M16 75V39q1-22 22-19 15-19 32 0 19-2 20 18v37q-31 17-74 0z" fill="#F1C37D" stroke="#B68153" stroke-width="4"/><path d="m33 33 6 10m10-12 7 11m11-10 5 10" stroke="#E7A05F" stroke-width="4" stroke-linecap="round"/>'''),
'shop':('''<path d="M18 36h66v54H18z" fill="#F5DFC0" stroke="#987A6A" stroke-width="4"/><path d="M12 34 22 12h56l12 22-6 14-11-10-11 10-12-10-11 10-11-10-11 10z" fill="#E9A49A" stroke="#B67876" stroke-width="4"/><path d="M45 55h18v35H45z" fill="#B6D7D8" stroke="#6B9B9E" stroke-width="3"/>'''),
'house':('''<path d="M15 48 50 16l36 32v40H15z" fill="#F4D7AE" stroke="#9B8075" stroke-width="4"/><path d="M7 49 50 8l43 41" stroke="#BC8C7A" stroke-width="7" fill="none" stroke-linejoin="round"/><rect x="41" y="56" width="18" height="32" rx="2" fill="#86B0B4"/><path d="M23 51h13v13H23m41-13h13v13H64" fill="#B1E1D7" stroke="#69999A" stroke-width="2"/>'''),
'people':('''<circle cx="50" cy="23" r="15" fill="#E5B492" stroke="#A87D68" stroke-width="3"/><path d="M21 86Q20 47 50 47t29 39z" fill="#9BC3C2" stroke="#5C9698" stroke-width="4"/><path d="M36 11q16-19 29 2" stroke="#7B675D" stroke-width="7" fill="none" stroke-linecap="round"/>'''),
'book':('''<path d="M12 17q20-7 37 4 21-12 39-4v65q-20-7-39 5-21-11-37-5z" fill="#D8C8EB" stroke="#8374AA" stroke-width="4"/><path d="M49 21v66M21 38h18m-18 12h18m19-12h21m-21 12h21" stroke="#8B83AE" stroke-width="3" fill="none"/>'''),
'paper':('''<path d="M21 9h48l12 13v68H21z" fill="#FFF1DB" stroke="#AB9482" stroke-width="4"/><path d="M69 9v16h12M31 43h40M31 56h31M31 69h35" stroke="#C1AC99" stroke-width="4" fill="none"/>'''),
'camera':('''<rect x="10" y="30" width="80" height="55" rx="9" fill="#A5B1C5" stroke="#6A7990" stroke-width="4"/><path d="M28 29 37 16h24l9 13" fill="#909FB7" stroke="#6A7990" stroke-width="4"/><circle cx="51" cy="58" r="21" fill="#C8E6E8" stroke="#668AA1" stroke-width="4"/><circle cx="51" cy="58" r="9" fill="#82ADB8"/>'''),
'frame':('''<rect x="14" y="14" width="72" height="75" rx="4" fill="#E3C49D" stroke="#B18D69" stroke-width="6"/><rect x="24" y="24" width="52" height="55" fill="#DAF0EE"/><circle cx="59" cy="42" r="9" fill="#F5D487"/><path d="M27 72 45 49l12 13 9-8 9 18z" fill="#81BCA5"/>'''),
'pot':('''<path d="M25 45h50l-8 42H33z" fill="#D59B76" stroke="#A97561" stroke-width="4"/><path d="M19 42h62v11H19z" fill="#EDB28A" stroke="#A97561" stroke-width="3"/><path d="M51 45V15m0 20q-26-2-29-20 24-4 29 20m0-5q22 0 25-17-22-5-25 17" stroke="#579D73" fill="#91C7A0" stroke-width="3"/>'''),
'cup':('''<path d="M24 32h47v39Q68 82 48 82 24 82 24 67z" fill="#F9E2C8" stroke="#A68F82" stroke-width="4"/><path d="M70 39q26-6 20 14-3 13-19 11" stroke="#A68F82" stroke-width="5" fill="none"/><path d="M37 17q-8 7 0 15m16-15q-8 7 0 15" stroke="#88B2B3" stroke-width="4" fill="none" stroke-linecap="round"/>'''),
'kettle':('''<path d="M24 48q0-25 28-28 29 3 29 28L71 76H33z" fill="#D1C4DC" stroke="#837E9B" stroke-width="4"/><path d="M36 19q14-19 31 0M24 48 9 36l4-12 15 10M76 44q23-11 13 13-5 9-15 4" stroke="#837E9B" stroke-width="5" fill="none"/>'''),
'apple':('''<path d="M49 35Q18 14 15 53q-1 32 23 35 12-1 15-4 26 15 34-24 4-34-38-25z" fill="#E9A380" stroke="#BA6D61" stroke-width="4"/><path d="M51 32q4-13 16-20M51 32q-12-15-29-12 6 18 29 12" fill="#88BE8F" stroke="#67956F" stroke-width="4"/>'''),
'wreath':('''<circle cx="50" cy="51" r="30" stroke="#78AB8B" stroke-width="12" fill="none"/><circle cx="50" cy="51" r="18" stroke="#B3D4AF" stroke-width="4" fill="none"/><circle cx="24" cy="49" r="9" fill="#E5A6B5"/><circle cx="50" cy="20" r="9" fill="#EFCE7C"/><circle cx="74" cy="66" r="9" fill="#E5A6B5"/>'''),
'herbs':('''<path d="M50 87V22m-2 42Q24 60 17 43q23-14 31 21m4-14q26-9 29-30-24-5-29 30M49 80q20 2 33-14-19-12-33 14" fill="#91C79C" stroke="#559A75" stroke-width="4" stroke-linecap="round"/>'''),
'statue':('''<path d="M27 79h48v11H27z" fill="#90A8AE" stroke="#647E87" stroke-width="3"/><path d="M50 13q14 0 13 14-1 8-7 10l10 32H34l10-32q-8-4-7-12 0-12 13-12" fill="#C3D4D6" stroke="#849AA3" stroke-width="4"/>'''),
'food':('''<ellipse cx="50" cy="70" rx="36" ry="16" fill="#F5EEE2" stroke="#BCA99A" stroke-width="4"/><path d="M21 65q10-28 27-29 22 2 31 29" fill="#E9A67E" stroke="#BC775D" stroke-width="4"/><path d="M35 43q4-12 10-17m11 13q8-12 13-14" stroke="#88B788" stroke-width="6" fill="none" stroke-linecap="round"/>'''),
'blanket':('''<path d="M15 28 84 19l6 60-72 9z" fill="#B9D5CB" stroke="#6F9A96" stroke-width="3"/><path d="m40 25 7 59M64 22l4 60M17 48l70-8M19 69l69-9" stroke="#F1D19C" stroke-width="5"/>'''),
'pencil':('''<path d="M20 79 70 20l15 13-50 57-20 7z" fill="#EBC28F" stroke="#A77E66" stroke-width="4"/><path d="m67 23 16 13m-62 44 14 11" stroke="#779AB4" stroke-width="7"/><path d="m15 97 6-18 14 12z" fill="#736E70"/>'''),
'flowerpot':('''<path d="M30 54h42l-7 35H36z" fill="#DBA886" stroke="#A77961" stroke-width="4"/><path d="M50 54V28" stroke="#579775" stroke-width="5"/><path d="M50 37q-30-6-24-23 23-2 24 23m0-6q17-20 28-11-4 19-28 11" fill="#8BC4A0" stroke="#509274" stroke-width="3"/><circle cx="50" cy="15" r="10" fill="#E9B2B7"/>'''),
}
# [primary motif, small symbolic accent] — no two records share an identical design.
PAIR={
'Virga':('cloud','rain'),'Rime Ice':('ice','fog'),'Graupel':('snow','cloud'),'Hoarfrost':('branch','ice'),'Parhelion':('halo','sun'),'Rain Shadow':('mountain','cloud'),'Sea Breeze':('wave','wind'),'Thermal Plume':('geyser','cloud'),'Anvil Cloud':('cloud','lightning'),'Snow Cornice':('mountain','snow'),'Heat Shimmer':('sun','wave'),'Ice Floe':('ice','wave'),'Tidal Stream':('wave','droplet'),'Windbreak':('tree','wind'),'Dewdrop':('droplet','leaf'),'Fog Bank':('fog','wave'),'Rock Pool Nursery':('pool','crab'),'Coral Garden':('coral','flower'),'Kelp Nursery':('kelp','fish'),'Oyster Bed':('shell','pool'),'Seagrass Bed':('grass','wave'),'Reef Fish':('fish','coral'),'Root Mat':('roots','grass'),'Fungal Network':('mushroom','roots'),'Leaf Mold':('leaf','roots'),'Woodland Spring':('pool','tree'),
'Bread Basket':('basket','bread'),'Street Bakery':('shop','bread'),'Market Square':('shop','people'),'Picnic Lunch':('blanket','basket'),'Tea Ceremony':('kettle','cup'),'Recipe Card':('paper','pencil'),'Food Stall':('shop','food'),'Craft Fair':('shop','pot'),'Photo Exhibition':('frame','camera'),'Sculpture Garden':('statue','tree'),'Community Kitchen':('food','people'),'Herb Shop':('shop','herbs'),'Story Circle':('book','people'),'Village Feast':('food','house'),
'Seedling Pot':('pot','leaf'),'Botanical Sketch':('paper','leaf'),'Terrarium Display':('pot','frame'),'Orchard Basket':('basket','apple'),'Floral Wreath':('wreath','flower'),'Botanical Walk':('people','flower'),'Nature Journal':('book','leaf'),'Herbal Infusion':('cup','herbs'),
}
assert len(PAIR)==len(items)==48
out=R/'client/assets/v52';out.mkdir(parents=True,exist_ok=True)
art={};manifest=[]
for i,item in enumerate(items):
 name=item['name'];primary,secondary=PAIR[name]
 body=f'<g transform="translate(12 12) scale(.76)">{MOTIFS[primary]}</g><g transform="translate(57 1) scale(.37)">{MOTIFS[secondary]}</g>'
 # Small illustrated star/ground shadows remain subtle and never obscure the main shape.
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'
      '<ellipse cx="49" cy="94" rx="29" ry="3.5" fill="#594F4A" opacity=".14"/>'
      '<path d="M11 14v6m-3-3h6M85 80v6m-3-3h6" stroke="#D7B07F" stroke-width="2" stroke-linecap="round"/>'
      +body+'</svg>')
 p=out/(item['id'].split(':',1)[1]+'.svg');p.write_text(svg)
 art[name.lower()]=svg
 manifest.append({'id':item['id'],'name':name,'path':str(p.relative_to(R)),'sha256':hashlib.sha256(svg.encode()).hexdigest(),'motifs':[primary,secondary]})
(R/'client/src/organic-art-v52.js').write_text('/* 48 original, individually composed static SVG illustrations, 100% offline. */\nexport const ORGANIC_ART_V52 = '+json.dumps(art,separators=(',',':'))+';\n')
(R/'shared/v52-art-manifest.json').write_text(json.dumps({'version':52,'icons':manifest},indent=2)+'\n')
print('Generated',len(art),'original illustrated static SVGs')
