#!/usr/bin/env python3
"""Hand-curated organic expansion for V34: stable IDs, authored icon SVGs, no random recipes."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# name | catalog family | concise explanatory caption
content=[
 ('Seed','life','A plant embryo packed with everything it needs for a new beginning.'),
 ('Soil','nature','The living mixture of minerals and organic matter that supports plants.'),
 ('Sprout','life','The first tender growth emerging from a germinated seed.'),
 ('Flower','life','The blooming reproductive structure of many plants.'),
 ('Bee','life','A pollinating insect that helps flowering plants reproduce.'),
 ('Pollination','science','The transfer of pollen that helps many plants form seeds.'),
 ('Nectar','material','The sweet liquid flowers offer their pollinators.'),
 ('Honey','material','The thick, sweet food that bees make from nectar.'),
 ('Beehive','life','The wax-built home and food store of a bee colony.'),
 ('Orchard','nature','A planted grove of trees cultivated for fruit.'),
 ('Greenhouse','technology','A glass-walled space that shelters crops and captures heat.'),
 ('Compost','material','Decomposed organic material that returns nutrients to soil.'),
 ('Mycelium','life','The branching fungal network running through soil or wood.'),
 ('Coral Reef','nature','A bustling marine habitat built by colonies of coral animals.'),
 ('Tide','nature','The sea rising and falling mainly under the pull of the Moon.'),
 ('Lighthouse','technology','A shore-side beacon that guides ships away from danger.'),
 ('Sailboat','technology','A boat that turns wind into forward movement.'),
 ('Waterfall','nature','A river cascading over a sudden drop in the landscape.'),
 ('Rainbow','nature','Sunlight separated into colors by droplets in the air.'),
 ('Umbrella','technology','A small portable shelter from rain or bright sunshine.'),
 ('Weather Station','science','Instruments working together to measure changing conditions.'),
 ('Electric Motor','technology','A machine that turns electrical energy into movement.'),
 ('Electric Bicycle','technology','A pedal-powered bicycle assisted by an electric motor.'),
 ('Game Studio','gamecraft','A team of artists, designers and developers making games.'),
 ('Pixel Artist','gamecraft','An artist who tells visual stories one pixel at a time.'),
 ('Game Mod','gamecraft','A player-made alteration that changes how a game looks or plays.'),
 ('Co-op Game','genre','A game in which players work together instead of playing alone.'),
 ('Speedrun','genre','A challenge to finish a game as quickly as possible.'),
 ('Game Tournament','gamecraft','An organized competition between video game players.'),
 ('Arcade Ticket','arcade','A paper prize token from the arcade counter.'),
]
R={
'Seed':[('Tree','Earth'),('Flower','Earth'),('Tree','Soil'),('Plant','Soil')],
'Soil':[('Mud','Plant'),('Earth','Forest'),('Compost','Earth')],
'Sprout':[('Seed','Water'),('Seed','Rain'),('Seed','Soil')],
'Flower':[('Sprout','Sun'),('Plant','Sun'),('Sprout','Rain')],
'Bee':[('Flower','Animal'),('Flower','Forest'),('Flower','Life')],
'Pollination':[('Bee','Flower'),('Bee','Orchard'),('Bee','Sprout')],
'Nectar':[('Flower','Water'),('Flower','Sun'),('Flower','Rain')],
'Honey':[('Bee','Nectar'),('Beehive','Nectar'),('Beehive','Flower')],
'Beehive':[('Bee','Wood'),('Bee','Tree'),('Bee','House')],
'Orchard':[('Tree','Garden'),('Seed','Garden'),('Flower','Tree')],
'Greenhouse':[('Glass','Garden'),('Glass','Sprout'),('Glass','Soil')],
'Compost':[('Plant','Food'),('Soil','Food'),('Garden','Food')],
'Mycelium':[('Mushroom','Forest'),('Mushroom','Soil'),('Mushroom','Compost')],
'Coral Reef':[('Sea','Stone'),('Fish','Stone'),('Ocean','Plant')],
'Tide':[('Sea','Moon'),('Ocean','Moon'),('Moon','Water')],
'Lighthouse':[('Sea','Light'),('House','Sea'),('Light','Stone')],
'Sailboat':[('Wood','Wind'),('Sea','Wind'),('Wood','Sea')],
'Waterfall':[('River','Mountain'),('River','Stone'),('Rain','Mountain')],
'Rainbow':[('Sun','Rain'),('Sun','Waterfall'),('Light','Rain')],
'Umbrella':[('Rain','Tool'),('Rain','Paper'),('Rain','Glass')],
'Weather Station':[('Wind','Science'),('Thunderstorm','Science'),('Rain','Science')],
'Electric Motor':[('Electricity','Wheel'),('Electricity','Tool'),('Battery','Metal'),('Battery','Tool')],
'Electric Bicycle':[('Electric Motor','Wheel'),('Battery','Electric Motor'),('Electric Motor','Tool')],
'Game Studio':[('Video Game','Factory'),('Game','Factory'),('Game','Computer')],
'Pixel Artist':[('Human','Computer Graphics'),('Computer Graphics','Game Studio'),('Human','Game Studio')],
'Game Mod':[('Software','Game'),('Game Studio','Software'),('Software','Video Game')],
'Co-op Game':[('Friendship','Game'),('Friendship','Game Controller'),('Friendship','Video Game')],
'Speedrun':[('Speed','Game'),('Game Controller','Clock'),('Speed','Video Game')],
'Game Tournament':[('Competition','Video Game'),('Game Studio','Competition'),('Game Controller','Competition')],
'Arcade Ticket':[('Arcade','Paper'),('Arcade','Money'),('Arcade','Game Tournament')],
}
# Original vector scenes authored separately for every item (no emoji or generic colored circles).
shape={
'Seed':'''<path d="M25 71Q17 35 47 24Q77 23 77 51Q73 81 49 84Q31 84 25 71Z" fill="#B67B43" stroke="#784827" stroke-width="4"/><path d="M35 68Q44 53 64 39" stroke="#F8D5A1" stroke-width="5" stroke-linecap="round"/><path d="M53 45Q54 25 73 18" stroke="#4E965C" stroke-width="4" fill="none"/><path d="M61 29Q72 14 89 24Q80 39 61 29Z" fill="#75C878" stroke="#367A51" stroke-width="3"/>''',
'Soil':'''<path d="M14 48Q49 39 86 48L79 79Q50 90 20 79Z" fill="#9B633F" stroke="#6A472F" stroke-width="4"/><path d="M22 55q28 12 56 0M29 68q16 6 39 0" stroke="#D3A071" stroke-width="3" fill="none"/><circle cx="28" cy="48" r="5" fill="#C5A77A"/><circle cx="71" cy="64" r="4" fill="#E1C19D"/><path d="M51 48V23" stroke="#418A50" stroke-width="4"/><path d="M49 32Q27 12 22 30Q34 42 49 32ZM51 24Q62 6 77 13Q75 31 51 24Z" fill="#69BD72" stroke="#307D4E" stroke-width="3"/>''',
'Sprout':'''<path d="M18 79q35-12 65 0v8H18Z" fill="#A77B50"/><path d="M50 77Q44 55 51 38" fill="none" stroke="#397E4B" stroke-width="6" stroke-linecap="round"/><path d="M49 52Q19 50 23 32Q42 29 49 52ZM51 43Q51 17 77 18Q79 40 51 43Z" fill="#6DCB76" stroke="#2E8E57" stroke-width="3"/><circle cx="50" cy="77" r="5" fill="#E8BD87"/>''',
'Flower':'''<path d="M50 84V44" stroke="#478653" stroke-width="6" stroke-linecap="round"/><path d="M48 67Q21 49 16 65Q26 82 48 67ZM52 72Q78 52 84 69Q72 83 52 72Z" fill="#6DBA79" stroke="#418153" stroke-width="3"/><g fill="#F7A4BB" stroke="#BF5D85" stroke-width="2"><ellipse cx="50" cy="27" rx="13" ry="20"/><ellipse cx="50" cy="27" rx="13" ry="20" transform="rotate(72 50 39)"/><ellipse cx="50" cy="27" rx="13" ry="20" transform="rotate(-72 50 39)"/><ellipse cx="50" cy="27" rx="13" ry="20" transform="rotate(144 50 39)"/><ellipse cx="50" cy="27" rx="13" ry="20" transform="rotate(-144 50 39)"/></g><circle cx="50" cy="39" r="10" fill="#FFD96A" stroke="#D49A38" stroke-width="3"/>''',
'Bee':'''<ellipse cx="49" cy="54" rx="27" ry="19" fill="#FFD463" stroke="#604A3A" stroke-width="4"/><path d="M40 37v35m17-37v35" stroke="#63443A" stroke-width="9"/><ellipse cx="39" cy="32" rx="15" ry="11" transform="rotate(-30 39 32)" fill="#C9EDFB" stroke="#83B7C8" stroke-width="3"/><ellipse cx="62" cy="31" rx="15" ry="11" transform="rotate(30 62 31)" fill="#C9EDFB" stroke="#83B7C8" stroke-width="3"/><circle cx="24" cy="53" r="14" fill="#EFC26E" stroke="#604A3A" stroke-width="3"/><circle cx="19" cy="50" r="2.5" fill="#34302A"/><path d="m73 54 11 5-10 6" fill="#63443A"/>''',
'Pollination':'''<path d="M25 81V43" stroke="#498B4C" stroke-width="5"/><path d="M18 39q-10-17 7-21 16 4 8 18 18 3 8 18-12 10-18-2-13 8-17-3Q7 36 18 39Z" fill="#F3A5C5" stroke="#C8759A" stroke-width="3"/><circle cx="24" cy="42" r="7" fill="#FFC858"/><ellipse cx="68" cy="47" rx="17" ry="12" fill="#FFC94D" stroke="#694B36" stroke-width="3"/><path d="M66 36v23m9-22v21" stroke="#654737" stroke-width="6"/><ellipse cx="62" cy="29" rx="10" ry="12" fill="#B7E4F0"/><path d="M44 37q7-9 13-5m-8 17 8-2" fill="none" stroke="#D99E4E" stroke-width="3" stroke-dasharray="2 5"/>''',
'Nectar':'''<path d="M30 38h40l-4 41Q49 89 34 79Z" fill="#F5D899" stroke="#9E6A41" stroke-width="4"/><path d="M36 60Q50 53 64 60l-3 16Q49 83 39 76Z" fill="#F7AC4D"/><path d="M50 17q13 16 1 30-14-12-1-30Z" fill="#F7B84E" stroke="#E28B47" stroke-width="2"/><path d="M26 32q-15-14-17 1 8 13 21 9M73 30q19-17 18 0-8 13-21 10" fill="#F3A4C6" stroke="#C56F98" stroke-width="3"/>''',
'Honey':'''<path d="M30 32h40l5 45Q49 92 25 77Z" fill="#E6A740" stroke="#8F5D2C" stroke-width="4"/><path d="M26 32h48v9H26Z" fill="#C78532" stroke="#8F5D2C" stroke-width="3"/><path d="M34 54Q50 45 66 54l-3 22Q49 83 37 75Z" fill="#FFD570"/><path d="M35 48q2 9 0 14m26-16q-1 11 0 17" stroke="#FAE6A3" stroke-width="3"/><path d="M47 29V13m-8 5h16" stroke="#9D7148" stroke-width="5" stroke-linecap="round"/>''',
'Beehive':'''<path d="M22 71Q22 41 50 29Q78 40 78 71L73 84H27Z" fill="#F0BA59" stroke="#8F643A" stroke-width="4"/><path d="M24 51h51M22 63h56M25 75h50" stroke="#BF8B40" stroke-width="4"/><ellipse cx="50" cy="65" rx="10" ry="13" fill="#6F4630"/><path d="M48 29v-9l11-5" stroke="#6E513A" stroke-width="3"/><path d="M18 79h64" stroke="#9B6C48" stroke-width="5" stroke-linecap="round"/>''',
'Orchard':'''<path d="M21 82V43m29 40V36m26 47V45" stroke="#92613B" stroke-width="9" stroke-linecap="round"/><g fill="#79BB61" stroke="#427949" stroke-width="3"><circle cx="21" cy="38" r="19"/><circle cx="50" cy="29" r="22"/><circle cx="76" cy="39" r="18"/></g><g fill="#D95B50"><circle cx="15" cy="37" r="5"/><circle cx="35" cy="42" r="5"/><circle cx="52" cy="18" r="5"/><circle cx="45" cy="40" r="5"/><circle cx="81" cy="42" r="5"/></g><path d="M13 85h74" stroke="#78A760" stroke-width="6" stroke-linecap="round"/>''',
'Greenhouse':'''<path d="M12 42 50 15 88 42v44H12Z" fill="#D9F3E6" stroke="#5B9E9E" stroke-width="4" stroke-linejoin="round"/><path d="M50 16v70M13 43h75M31 29v57M69 29v57" stroke="#83BFC0" stroke-width="3"/><path d="M22 85q6-24 17-29 11 19 11 29m8 0q5-20 17-27 10 17 10 27" fill="#79C67C" stroke="#448950" stroke-width="3"/><path d="M36 57q-10-18 1-18 11 8 5 17M68 59q-11-18 1-18 12 9 3 18" fill="#5BBA77"/>''',
'Compost':'''<path d="M20 36h60l-7 48H27Z" fill="#946743" stroke="#6F482E" stroke-width="4"/><path d="M25 47h50M27 65h47" stroke="#CBA16E" stroke-width="4"/><path d="M29 33q3-20 19-10 14-17 23-4 14 11 7 19" fill="#649E54" stroke="#3A7041" stroke-width="3"/><path d="M45 25q-1-14-14-15 0 16 14 15m19 2q9-15 21-14-2 15-21 14" fill="#93BF6F" stroke="#39754D" stroke-width="3"/><path d="M51 35l-2 12m11-8-4 10" stroke="#E6CF83" stroke-width="4" stroke-linecap="round"/>''',
'Mycelium':'''<path d="M18 29q32-18 65 0l-5 48Q49 89 21 77Z" fill="#D6C39C" opacity=".5"/><path d="M51 20v61M51 44 28 61m23-10 24 12M28 61l-13 8m13-8-7-16m54 18 13-11m-13 11 4 15M51 30 37 19m14 10 18-12" stroke="#B28C75" stroke-width="5" stroke-linecap="round" fill="none"/><g fill="#F1E6D2" stroke="#8D746B" stroke-width="2"><circle cx="51" cy="20" r="7"/><circle cx="28" cy="61" r="6"/><circle cx="75" cy="63" r="7"/><circle cx="37" cy="19" r="4"/><circle cx="69" cy="17" r="5"/></g>''',
'Coral Reef':'''<path d="M12 84Q43 74 87 83" stroke="#69B7A2" stroke-width="9" stroke-linecap="round"/><path d="M33 80V35m0 25-16-19m16 9 17-19m-17 5-8-18m8 28 20-14" stroke="#E77870" stroke-width="9" stroke-linecap="round"/><path d="M63 81V43m0 17 15-16m-15 7-14-15M63 64l-9 9" stroke="#F6B969" stroke-width="8" stroke-linecap="round"/><path d="M58 21q13-12 24 0-10 15-24 0Z" fill="#5B9CD6"/><circle cx="76" cy="21" r="2" fill="#213D5D"/><circle cx="17" cy="15" r="4" fill="#B4E2E4"/><circle cx="88" cy="36" r="3" fill="#B4E2E4"/>''',
'Tide':'''<path d="M10 56q15-15 29 0t31 0q10-10 20 0v23q-18-10-36 0t-44 0Z" fill="#4CA8D4" stroke="#297BAE" stroke-width="3"/><path d="M10 68q18-11 37 0t43 0M18 83q12-5 28 0t35 0" stroke="#C3F0F7" stroke-width="4" fill="none"/><path d="M48 12a24 24 0 1 0 26 33A19 19 0 0 1 48 12Z" fill="#FFD987" stroke="#D8A34D" stroke-width="3"/>''',
'Lighthouse':'''<path d="M38 83 44 28h13l7 55Z" fill="#FAECDD" stroke="#B4815B" stroke-width="4"/><path d="M42 51h18l-2 14H40Z" fill="#D96A64"/><path d="M35 27h31l-4 9H39Z" fill="#637E92"/><path d="M39 24h23l-4-12H43Z" fill="#F2C878" stroke="#9B7550" stroke-width="3"/><path d="M29 24 7 13m65 11 23-11M32 35l-21 9m63-9 19 9" stroke="#F1D991" stroke-width="5" stroke-linecap="round"/><path d="M18 85h65" stroke="#5DA5C4" stroke-width="7" stroke-linecap="round"/>''',
'Sailboat':'''<path d="M48 15v58" stroke="#7B6958" stroke-width="5" stroke-linecap="round"/><path d="M45 20 18 64h27Z" fill="#F8F1DA" stroke="#6B9CA9" stroke-width="3"/><path d="M54 23v40h25Z" fill="#ECA36D" stroke="#C57755" stroke-width="3"/><path d="M16 69h69L73 84H30Z" fill="#C27C4C" stroke="#784E35" stroke-width="4"/><path d="M9 88q12-7 25 0t29 0q15-7 28 0" stroke="#63B8D7" stroke-width="5" fill="none"/>''',
'Waterfall':'''<path d="M12 45 28 24h46l14 21-20 4-12-9-14 10-13-7Z" fill="#9E9B87" stroke="#697A74" stroke-width="4"/><path d="M39 45q4 20-3 37M50 44q-4 20 2 38M62 43q4 20-2 39" stroke="#6EBADD" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M21 83q14-13 29 0 12-10 28-1" stroke="#BCECF6" stroke-width="7" fill="none"/><path d="M14 78q-8-16-2-26m73 23q8-15 2-24" stroke="#6C9D70" stroke-width="6" fill="none"/>''',
'Rainbow':'''<path d="M10 78a40 40 0 0 1 80 0" stroke="#E66D72" stroke-width="7" fill="none"/><path d="M17 78a33 33 0 0 1 66 0" stroke="#F4A658" stroke-width="7" fill="none"/><path d="M24 78a26 26 0 0 1 52 0" stroke="#F9D866" stroke-width="7" fill="none"/><path d="M31 78a19 19 0 0 1 38 0" stroke="#71BB80" stroke-width="7" fill="none"/><path d="M38 78a12 12 0 0 1 24 0" stroke="#6FA8D7" stroke-width="7" fill="none"/><path d="M12 78q8-11 18 0Q42 69 48 80v6H8Zm59 0q10-12 19 0 7-2 9 8H69Z" fill="#EDF6FC"/>''',
'Umbrella':'''<path d="M12 52Q15 15 51 16Q85 15 89 52l-14-8-12 8-12-8-13 8-12-8Z" fill="#E7798B" stroke="#A44F6A" stroke-width="4" stroke-linejoin="round"/><path d="M51 18v57q0 14-12 13-8-1-8-9" stroke="#755B4B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M51 18q-10 12-13 34m13-34q11 14 12 34" stroke="#F5B7BE" stroke-width="3" fill="none"/>''',
'Weather Station':'''<path d="M51 24v58m-26 0h52" stroke="#58728A" stroke-width="6" stroke-linecap="round"/><path d="M22 35h55M23 35l-9-7m62 7 9-8" stroke="#7298AB" stroke-width="3"/><path d="M42 28a10 10 0 0 1 20 0v15H42Z" fill="#D6F0F6" stroke="#6C9DAF" stroke-width="3"/><path d="M51 44V18" stroke="#597B89" stroke-width="3"/><path d="M15 45v18m-8-12h16" stroke="#67959B" stroke-width="3"/><path d="M70 51h19v21H70Z" fill="#F0D898" stroke="#9B7550" stroke-width="3"/><circle cx="79" cy="61" r="5" fill="#6CA8D4"/>''',
'Electric Motor':'''<path d="M18 34h57v44H18Z" rx="7" fill="#7DA5BC" stroke="#4B708B" stroke-width="4"/><path d="M28 39v33M42 39v33M57 39v33" stroke="#BFE2ED" stroke-width="4"/><circle cx="72" cy="56" r="19" fill="#B6CCD6" stroke="#567887" stroke-width="4"/><circle cx="72" cy="56" r="7" fill="#6A7884"/><path d="M90 56h8M22 26l-7-8m30 9v-12" stroke="#E4B65B" stroke-width="5" stroke-linecap="round"/><path d="m17 24 6-4m47 1 4 8" stroke="#E4B65B" stroke-width="3"/>''',
'Electric Bicycle':'''<circle cx="24" cy="73" r="17" fill="none" stroke="#486B7D" stroke-width="5"/><circle cx="77" cy="73" r="17" fill="none" stroke="#486B7D" stroke-width="5"/><path d="M24 73 43 45 57 73H24l28-28 25 28-8-33" fill="none" stroke="#5AA9A6" stroke-width="5" stroke-linejoin="round"/><path d="M37 44h14m16-4h13M22 34q9-8 17 0" stroke="#5A5863" stroke-width="5" stroke-linecap="round"/><rect x="45" y="58" width="14" height="14" rx="3" fill="#E6BD65" stroke="#957341" stroke-width="2"/><path d="m51 60-3 7h5l-2 4" stroke="#5D8090" stroke-width="2" fill="none"/>''',
'Game Studio':'''<path d="M13 39 49 16l38 23v46H13Z" fill="#F4D9B1" stroke="#9D7757" stroke-width="4" stroke-linejoin="round"/><rect x="27" y="45" width="46" height="30" rx="3" fill="#4F6D8B" stroke="#36546B" stroke-width="3"/><rect x="32" y="50" width="36" height="18" fill="#86C5D9"/><path d="M43 62v-8m-4 4h8" stroke="#FAEFCE" stroke-width="3"/><circle cx="58" cy="57" r="3" fill="#FAE17C"/><circle cx="64" cy="62" r="3" fill="#F59E82"/><path d="M49 76v8m-13 0h26" stroke="#7E725E" stroke-width="4"/><path d="M19 42h62" stroke="#C79562" stroke-width="3"/>''',
'Pixel Artist':'''<path d="M16 25h65v56H16Z" fill="#FCF5E2" stroke="#887467" stroke-width="4"/><path d="M22 31h53v44H22Z" fill="#A9DAE0"/><path d="M23 55h15V39h13v13h11v12H49v10H23Z" fill="#70B77D"/><path d="M40 33h18v13H40Z" fill="#E5A76D"/><path d="M40 46h12v9H40Z" fill="#C77463"/><path d="M66 43h8v8h-8Z" fill="#FFDB72"/><path d="m68 67 17-18 7 7-18 17-10 4Z" fill="#F4B96D" stroke="#8E6C58" stroke-width="3"/>''',
'Game Mod':'''<path d="M20 24h60v53H20Z" fill="#B3C4D5" stroke="#4E718A" stroke-width="4"/><rect x="27" y="32" width="46" height="35" fill="#34465B"/><path d="m38 50 8-9 7 9 9-10" stroke="#8CD4AD" stroke-width="4" fill="none"/><path d="m38 60 12-10 12 10" stroke="#F4C674" stroke-width="4" fill="none"/><path d="M44 78h12m-6 0v8" stroke="#708297" stroke-width="5"/><path d="M75 17l4 8 9 2-9 4-4 9-4-9-9-4 9-2Z" fill="#F4C76A" stroke="#A9773C" stroke-width="2"/>''',
'Co-op Game':'''<path d="M13 49q3-16 21-15h31q20-1 22 15l4 18q0 12-13 11l-20-14H42L21 78Q8 80 9 65Z" fill="#9BC8BE" stroke="#447D7E" stroke-width="4"/><path d="M28 48v18m-9-9h18" stroke="#345975" stroke-width="5" stroke-linecap="round"/><circle cx="68" cy="51" r="5" fill="#F0B66F"/><circle cx="78" cy="60" r="5" fill="#E78591"/><path d="M49 25q-9-14-18-5-9 11 18 23 27-12 18-23-10-10-18 5Z" fill="#E9959D" stroke="#A9596F" stroke-width="3"/>''',
'Speedrun':'''<circle cx="47" cy="56" r="28" fill="#EAF1ED" stroke="#66919A" stroke-width="5"/><circle cx="47" cy="56" r="4" fill="#C97C5A"/><path d="M47 56 61 38M47 56 43 70" stroke="#C97955" stroke-width="5" stroke-linecap="round"/><path d="M36 24V13h22v11m-8-11V7" stroke="#668893" stroke-width="5" fill="none"/><path d="M18 43H5m13 14H2m17 14H8" stroke="#F1AD68" stroke-width="6" stroke-linecap="round"/><path d="m68 37 13-9" stroke="#6C99A2" stroke-width="4"/><path d="M66 74q16-2 22-18" stroke="#E1BC68" stroke-width="4" fill="none"/>''',
'Game Tournament':'''<path d="M35 20h30v33Q59 66 50 66T35 53Z" fill="#F2CB63" stroke="#A47937" stroke-width="4"/><path d="M35 28H20q-5 17 17 23m28-23h15q5 17-17 23" fill="none" stroke="#BC9853" stroke-width="5"/><path d="M50 66v14m-18 0h36" stroke="#967146" stroke-width="6" stroke-linecap="round"/><path d="m50 29 4 9 10 2-7 7 2 10-9-5-9 5 2-10-7-7 10-2Z" fill="#FFF2B4"/><path d="m19 17-4-7m65 10 8-7" stroke="#E9AB64" stroke-width="4" stroke-linecap="round"/>''',
'Arcade Ticket':'''<path d="M12 29h76v15q-9 2-9 11t9 11v15H12V65q10-1 10-11T12 43Z" fill="#F6BF81" stroke="#B66E55" stroke-width="4" stroke-linejoin="round"/><path d="M32 33v44" stroke="#D58C6C" stroke-width="3" stroke-dasharray="4 5"/><path d="m60 41 5 10 12 2-9 8 3 12-11-6-10 6 2-12-9-8 12-2Z" fill="#FFE5A2" stroke="#C58D55" stroke-width="2"/><circle cx="21" cy="21" r="4" fill="#E9A56B"/><circle cx="86" cy="17" r="3" fill="#8CC4BF"/>'''
}
assert set(shape)=={x[0] for x in content}
# Shared illustration canvas uses no filters, scripts, external resources or CSS animations.
def svg(scene):
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="91" rx="36" ry="4" fill="#536C74" opacity=".10"/>'+scene+'</svg>'
# Names in R must match the catalog exactly, including legacy inputs.
assert set(R)==set(shape)
new={n: 'organic34:'+n.lower().replace(' ','-') for n,_,_ in content}
# Override this list using the stable IDs in older packs.
old_names={}
text=(ROOT/'client/src/legacy-data.js').read_text(encoding='utf8')
# The mapping itself is built with JS below to avoid fragile regex or a Node dependency in Python.
import subprocess
code="""import{DATA}from'./client/src/legacy-data.js';import{PACK}from'./client/src/creative-pack.js';import{GAMING_V22}from'./client/src/gaming-pack-v22.js';import{GAMING_V23}from'./client/src/gaming-pack-v23.js';import{GAMING_V24}from'./client/src/gaming-pack-v24.js';import{GAMING_V26}from'./client/src/gaming-pack-v26.js';import{GAMING_V27}from'./client/src/gaming-pack-v27.js';import{GAMING_V30}from'./client/src/gaming-pack-v30.js';import{ORGANIC_V32}from'./client/src/organic-pack-v32.js';let obj={};DATA.items.forEach(([name],i)=>obj[name.toLowerCase()]??='legacy:'+i);for(const p of [PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32])for(const it of p.items)obj[it.name.toLowerCase()]??=it.id;console.log(JSON.stringify(obj));"""
output=subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True)
old_names=json.loads(output)
for n in new:assert n.lower() not in old_names,('Duplicate name',n)
old_id_to_name={v:k for k,v in old_names.items()}
existing={}
code2="""import{DATA}from'./client/src/legacy-data.js';import{PACK}from'./client/src/creative-pack.js';import{GAMING_V22}from'./client/src/gaming-pack-v22.js';import{GAMING_V23}from'./client/src/gaming-pack-v23.js';import{GAMING_V24}from'./client/src/gaming-pack-v24.js';import{GAMING_V26}from'./client/src/gaming-pack-v26.js';import{GAMING_V27}from'./client/src/gaming-pack-v27.js';import{GAMING_V30}from'./client/src/gaming-pack-v30.js';import{ORGANIC_V32}from'./client/src/organic-pack-v32.js';let map=new Map(DATA.recipes.map(([a,b,o])=>[[`legacy:${a}`,`legacy:${b}`].sort().join('|'),`legacy:${o}`]));for(const p of [PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32])for(const [a,b,o] of p.recipes){const k=[a,b].sort().join('|');if(!map.has(k))map.set(k,o)}console.log(JSON.stringify([...map.keys()]));"""
existing=set(json.loads(subprocess.check_output(['node','--input-type=module','-e',code2],cwd=ROOT,text=True)))
def id_for(name):
 if name in new:return new[name]
 if name.lower() in old_names:return old_names[name.lower()]
 raise ValueError('Missing input: '+name)
items=[dict(id=new[n],name=n,category=cat,summary=desc,iconFamily='organic') for n,cat,desc in content]
recipes=[];dropped=[];seen=set()
for out,pairs in R.items():
 for a,b in pairs:
  key='|'.join(sorted([id_for(a),id_for(b)]))
  if key in existing or key in seen:
   dropped.append((a,b,out,'existing' if key in existing else 'duplicate'))
   continue
  seen.add(key);recipes.append([id_for(a),id_for(b),new[out]])
# Every new concept must have more than one handcrafted recipe, not collision-masked guesses.
for name in R:
 count=sum(1 for r in recipes if r[2]==new[name])
 if count<2:raise ValueError(f'{name}: only {count} unique recipes; collisions={dropped}')
pack=dict(version=34,items=items,recipes=recipes)
(ROOT/'client/src/organic-pack-v34.js').write_text('export const ORGANIC_V34 = '+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(ROOT/'client/src/organic-art-v34.js').write_text('export const ORGANIC_ART_V34 = '+json.dumps({n.lower():svg(shape[n]) for n in R},ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
report={'newElements':len(items),'newRecipes':len(recipes),'collisionsSkipped':dropped,'artworks':len(shape)}
(ROOT/'shared/v34-organic-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(report)
