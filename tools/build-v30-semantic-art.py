#!/usr/bin/env python3
"""35K Alchemy V30 original semantic sticker artwork; all SVGs static and self-authored.
The resolver uses exact names, never vague substring heuristics that mistakenly turn
Skyward Sword into a sky icon or Pokémon Crystal into a gemstone.
"""
import json, math, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
P=ROOT/'client/src'
D=lambda p,fill,stroke='#2e465b',w=2.7:f'<path d="{p}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
C=lambda x,y,r,fill,stroke='none',w=0:f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
E=lambda x,y,rx,ry,fill,stroke='none',w=0:f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
R=lambda x,y,w,h,rad,fill,stroke='none',sw=0:f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rad}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
L=lambda d,col='#3f708c',w=3:f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def svg(body):
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'+body+'</svg>'
def rays(cx,cy,dist=30,length=10,count=12,col='#f4a240',wid=4):
 return ''.join(L(f'M{cx+math.cos(i*2*math.pi/count)*dist:.2f} {cy+math.sin(i*2*math.pi/count)*dist:.2f} {cx+math.cos(i*2*math.pi/count)*(dist+length):.2f} {cy+math.sin(i*2*math.pi/count)*(dist+length):.2f}',col,wid) for i in range(count))
def sparkle(x,y,col='#ffdf91',size=6):return D(f'M{x} {y-size}l{size*.27} {size*.73} {size*.73} {size*.27}-{size*.73} {size*.27}L{x} {y+size}l-{size*.27}-{size*.73}-{size*.73}-{size*.27} {size*.73}-{size*.27}Z',col,'none',0)
def cloud(x=12,y=39,s=1,col='#fff',stroke='#84b7cc'):
 return f'<g transform="translate({x} {y}) scale({s})">'+D('M11 32C-3 30 -4 14 10 12C10 -2 30 -8 39 5C52 -2 70 5 69 19C84 21 84 36 67 38H13Z',col,stroke,2.2)+'</g>'
def droplet(x,y,size=25,color='#53c0ee'):
 return D(f'M{x} {y-size}C{x-7} {y-7} {x-size} {y+8} {x-15} {y+size*.65} C{x-8} {y+size+5} {x+8} {y+size+5} {x+15} {y+size*.65} C{x+size} {y+8} {x+7} {y-7} {x} {y-size}Z',color,'#478dad',2.4)+L(f'M{x-10} {y+6}q-3 13 9 17','#defbff',3)
crystal=lambda hue='#986ce0':D('M46 7 73 24 83 60 51 94 19 61 26 24Z',hue,'#71508e',3)+D('M26 24 46 7 55 35 19 61Z','#d4b0ff','none',0)+D('M46 7 73 24 55 35Z','#eee0ff','none',0)+D('M55 35 83 60 51 94Z','#8053ce','none',0)+D('M19 61 55 35 51 94Z','#b885fc','none',0)+L('M26 24 55 35 73 24M55 35 51 94M19 61l36-26','#e5d5ff',1.7)
# Motivic geometry. Do not use hash-scrambled substitutions for these named elements.
art={}
def add(name,body):art[name.casefold()]=svg(body)
add('Sun',rays(50,50,29,10,12,'#f5a32f',4.5)+C(50,50,27,'#ffd057','#dd8e2b',3)+C(44,41,16,'#ffe595')+C(55,58,5,'#fbb543'))
add('Sky', D('M8 70Q3 63 8 41Q25 9 52 10Q83 14 91 43V80H8Z','#9edafa','#71bddf',2.7)+D('M8 68q25-8 45 2 21-11 38-1v11H8Z','#d3effc','none',0)+cloud(14,33,.52)+cloud(50,45,.48)+C(77,26,9,'#ffda80'))
add('Wind',L('M12 28q23-17 48-9 20 6 11 20-9 12-20 3','#58bde0',6)+L('M7 52q27-14 57-8 28 7 18 22-7 10-17 4','#86d2ec',6)+L('M21 78q13-11 30-8 14 2 8 13','#60a9dc',5)+D('M24 50Q7 38 10 26Q23 28 33 49Z','#8dcf91','#679f7b',2))
add('Air',L('M9 32Q28 19 54 24Q78 14 85 29','#83caef',5)+L('M7 51Q37 39 75 48','#70b6df',5)+L('M14 71Q40 59 65 69','#9bdbf4',5)+cloud(55,17,.31,'#f5fcff'))
add('Crystal',crystal())
add('Diamond',D('M21 34 36 12H65L81 34 51 91Z','#81d9ef','#4b9bbf',3)+D('M21 34H81L51 91Z','#91e4f5','none',0)+D('M36 12 41 34 51 91 59 34 65 12Z','#e3fdff','none',0)+L('M21 34h60M41 34 36 12M59 34l6-22','#50a9cc',1.8))
add('Gold',D('M13 61 26 41H62L77 61 72 80H6Z','#f3ad26','#ba801d',3)+D('M26 41H62L77 61H13Z','#ffe58c','none',0)+L('M19 66h46','#fff3bd',3))
add('Moon',C(50,49,31,'#efecb3','#a4aecb',3)+C(65,33,29,'#b3b7e5')+sparkle(25,27,'#fbe493',7)+sparkle(79,65,'#fbe493',5))
add('Star',D('M50 9 61 37 91 39 69 58 76 88 50 72 24 88 31 58 9 39 39 37Z','#ffd166','#cf9d4a',3)+D('M50 14l9 26 26 2-19 17-16 8Z','#ffe795','none',0))
add('Cloud',cloud(8,23,1.05,'#f8fdff','#8dbad4')+L('M23 76h47','#bfddeb',2))
add('Rain',cloud(15,13,.84,'#effaff','#80b4d8')+''.join(droplet(x,66,7,'#50b9e9') for x in [31,49,67]))
add('Storm',cloud(12,17,.9,'#7893b1','#4b6488')+D('M52 53 38 73H53L45 95 75 62H58l9-9Z','#ffe079','#d9a549',3)+''.join(L(f'M{x} 69l-4 9','#66c8ec',2.3) for x in [25,75]))
add('Lightning',D('M56 6 25 53H48L34 96 83 40H57L67 6Z','#ffd258','#bb884c',3.2)+L('M52 20l-14 29h19','#fff4af',3))
add('Rainbow',''.join(L(f'M{10+i*5} {80-i*1.5}Q50 {10+i*2} {90-i*5} {80-i*1.5}',col,5) for i,col in enumerate(['#e76368','#f6ac53','#ffe37b','#71ca8a','#63b3e3','#a88adb']))+cloud(5,63,.27)+cloud(74,63,.27))
add('Water',droplet(50,42,33,'#59bdeb'))
add('Sea',D('M5 50Q22 35 41 50T79 50Q90 47 95 54V87H5Z','#4fb2d2','#3c8aaa',2.5)+L('M9 57Q29 43 48 57T91 57','#e1fbff',4)+L('M11 73Q30 60 49 73T89 73','#8adee7',3))
add('Ocean',D('M5 40Q29 15 45 42Q63 28 96 50V86H5Z','#2c86c8','#276b9f',3)+D('M17 50Q38 22 55 53q20-10 37 6','#76d7ee','none',0)+L('M6 61q20-15 43 0t43 0','#e4ffff',4)+L('M10 78q18-9 36 0t42-1','#a7e5fc',3))
add('Lake',D('M7 60Q33 34 91 55V79Q53 97 7 79Z','#70c5e7','#489bc3',3)+E(50,68,28,5,'#b9e9fb')+D('M18 51 39 26 60 52Z','#8da8b1','#7996a6',2)+D('M41 54 64 37 79 51Z','#6f9f8c','#5c8b7b',2))
add('River',D('M56 6Q9 19 47 38T38 90H64Q97 64 62 43T79 6Z','#5cb8e6','#347ba5',3)+L('M68 15Q48 34 61 49T52 80','#d5faff',3)+D('M7 6h29L23 27 10 34Z','#6ab793','#4e9274',2)+D('M73 72 94 59v31H79Z','#6ab793','#4e9274',2))
add('Ice',D('M18 27 47 11 78 28 84 71 52 89 20 73Z','#b3f1ff','#5eadd3',3)+D('M47 11l5 78 32-18-6-43Z','#5db8ea','none',0)+D('M18 27 47 11 78 28 50 47Z','#e0fcff','none',0)+L('M18 27 50 47 84 71M50 47l2 42','#eefeff',2))
add('Snow',D('M6 81 28 40 45 64 65 23 95 81Z','#9dc5d3','#7199ab',3)+D('M13 67 28 40 45 64l-14-5-8 8Z','#fff')+D('M48 49 65 23 87 68l-20-8-10 7Z','#f8fcff')+''.join(C(x,y,2,'#e3f7ff') for x,y in [(11,24),(24,13),(78,14),(89,42),(30,87)]))
add('Earth',C(50,50,37,'#65bcdb','#3c8ca4',3)+D('M25 21Q40 16 48 31l-8 14-20-4 8 15-5 10Q7 45 25 21Z','#6ab981','#3c8b69',1.5)+D('M61 17Q91 32 86 54L66 48 61 61l-13-7-1-21Z','#76c68b','#3d8f68',1.5)+D('M56 75l7-18 19 5Q78 84 61 87Z','#6fb580','#3c8b69',1.5)+C(31,25,6,'#e5f8ff'))
add('Mountain',D('M5 82 35 25 52 53 68 32 96 82Z','#9eafc0','#6b879d',3)+D('M35 25 22 51 34 46 45 53 51 53Z','#f5fcff','none',0)+D('M68 32 56 56l12-7 15 12Z','#f5fcff','none',0)+D('M5 82h91','#709c86','none',0))
add('Stone',D('M12 69 23 39 54 29 80 45 89 74 74 88H27Z','#9daab9','#677d91',3)+D('M23 39 54 29 64 54 32 64Z','#d4dde8','none',0)+L('M64 54 80 45M32 64 27 86','#edf4fa',2))
add('Sand',D('M5 76q15-25 36-14 22-35 52 14v11H5Z','#e5c17c','#bd9561',3)+D('M9 78q24-9 41-3 22-10 40-3','#f6deaa','none',0)+C(64,65,3,'#fff0be')+C(28,81,2,'#b78c60'))
add('Desert',D('M5 63Q35 40 54 62T95 58V90H5Z','#f1cc86','#d3a36c',3)+C(75,27,14,'#ffd56b')+D('M45 74V29M45 42q-17 0-17-16m17 29q15 0 15-17','none','#42876a',7)+L('M10 76q23-8 42 0','#eec07b',3))
add('Cave',D('M8 88V46Q14 4 50 8Q89 4 92 46V88Z','#928c91','#555e72',3)+D('M29 88V54q0-22 21-23 21 1 21 23v34Z','#293b5a','none',0)+D('M16 38 23 51 33 28 42 47 51 22 58 44 70 29 82 44V18Q51 1 20 19Z','#bbb1a1','none',0))
add('Coal',D('M18 64 27 27 64 22 85 49 77 85 32 88Z','#383b4d','#1e2636',3)+D('M27 27 64 22 49 52Z','#626779','none',0)+D('M32 88 49 52 77 85Z','#252b39','none',0)+L('M27 27 49 52l35-3','#878d9a',2))
add('Metal',D('M13 60 27 42h49l13 18-6 21H7Z','#b9c9dd','#697b91',3)+D('M27 42h49l13 18H13Z','#eef6fd','none',0)+L('M15 65h70','#a7bcce',3))
add('Iron',D('M12 57 25 39h47l16 18-8 24H10Z','#7a8b9d','#475568',3)+D('M25 39h47l16 18H12Z','#c8d7e4','none',0)+L('M23 62h55','#e1f0f7',3))
add('Copper',D('M13 60 27 42h49l13 18-6 21H7Z','#bf774f','#86543f',3)+D('M27 42h49l13 18H13Z','#f2b88e','none',0)+L('M15 66h70','#f5d3a9',3))
add('Glass',D('M24 10h52l-7 70q-19 18-38 0Z','#a9eaf2','#72aecb',3)+D('M27 16h46l-7 48H34Z','#d8fcff','none',0)+L('M38 20 33 62','#fff',4)+L('M66 23l-3 29','#83d3e8',2))
add('Wood',R(22,8,56,83,14,'#c78c57','#8c5e45',3)+L('M43 17q-22 20 0 34t5 29','#eabb81',4)+L('M62 17q-18 11-8 30t1 25','#8c6045',3)+E(51,58,8,15,'#9f6d45','#e5b17d',3))
add('Tree',D('M44 48h15v39H44Z','#997350','#624e45',2)+C(48,44,27,'#76c184','#4e9467',3)+C(28,40,18,'#89d08b')+C(64,31,22,'#63b376')+C(56,23,14,'#a6de92'))
add('Forest',D('M5 85h90','#5c9e74','#5c9e74',5)+''.join(D(f'M{x} 68v18', '#9d7954','#75583f',5)+D(f'M{x-17} 69 {x} {13+(i%3)*9} {x+17} 69Z',['#79bb80','#57ac85','#a0c783'][i%3],'#4d8d68',2) for i,x in enumerate([23,48,75])))
add('Plant',D('M48 83V27','#5ca76e','#38865d',5)+D('M46 57Q11 55 13 28q27-5 33 29Z','#86c681','#599964',2)+D('M52 70Q87 69 87 42q-31-3-35 28Z','#63b77c','#428f65',2)+D('M25 85h53L72 95H31Z','#b27f5b','#8e5c4c',2))
add('Flower',D('M49 49v40','#5baf71','#3f9165',4)+''.join(C(round(49+math.cos(k*math.pi/3)*20,2),round(40+math.sin(k*math.pi/3)*20,2),14,['#e99bd4','#f2a4c5','#ec9eec'][k%3],'#c782b0',1.3) for k in range(6))+C(49,40,14,'#ffd66c','#daaa4b',2)+D('M47 77Q19 64 25 53q17 2 22 24Z','#75c486','#519d71',2))
add('Life',D('M12 91Q20 61 43 60q8 0 15 0 24 4 29 31Z','#76bce5','#5e99bd',2.5)+C(50,33,20,'#ffce9f','#ad806e',2.5)+R(43,53,14,12,5,'#e7ac84')+sparkle(18,22,'#6fd3b7',6)+sparkle(81,14,'#f8ca7b',5))
add('Fire',D('M49 8Q67 29 65 48q11-6 10-20 24 26 8 50Q66 98 42 93 8 84 16 54q3-13 16-26-2 20 11 27Q34 28 49 8Z','#f36d51','#ad554f',3)+D('M50 42Q67 59 62 79q-8 17-22 7-13-13-1-29Z','#ffda78','#f4a947',2)+L('M40 77q0 8 8 10','#fff2b0',3))
add('Lava',D('M8 28 42 19 63 32 89 25 92 82H8Z','#6e605e','#494551',3)+D('M8 55q17-11 28 2t29 0 26 3v22H8Z','#e96644','none',0)+L('M12 65q12-7 26 5 9 10 22-5 18-7 26 3','#ffce55',5))
add('Volcano',D('M8 85 32 55 41 26h24l8 29 20 30Z','#887e81','#554b64',3)+D('M41 26q13 10 24 0L77 76 55 62 32 85H8Z','#a49384','none',0)+D('M40 25q9-15 18-7t7 7v6q-10 6-25 0Z','#f07c48','#d2564f',2)+D('M43 30l5 30 9-10 4 29','#ffb153','none',0)+cloud(34,0,.34,'#adb2c6'))
add('Steam',cloud(15,38,.70,'#e9f8fd')+L('M39 48Q20 31 39 17Q52 8 44 0','#8dbbd7',4)+L('M61 51Q45 36 65 18','#acd4ea',4))
add('Heat',C(50,52,19,'#fbc066','#dd8c4c',3)+rays(50,52,27,7,8,'#ee9072',3)+L('M22 80q-9-12 2-24M77 80q10-12 1-24','#df7161',3))
add('Energy',D('M56 9 23 54H48L39 93 82 39H59L69 9Z','#65e3c0','#299c9c',3)+sparkle(22,23,'#ffda7b',7)+sparkle(79,69,'#f1e292',5))
add('Shadow',E(50,78,36,13,'#48455e','#3b3d5a',3)+D('M29 69Q17 35 39 20q28-18 42 21L69 71Z','#696780','#51546b',3)+C(41,49,4,'#dac3fa')+C(63,49,4,'#dac3fa'))
add('Night',D('M16 12H84V87H16Z','#354a79','#354a79',2)+C(44,36,19,'#ffe9a3')+C(55,25,18,'#354a79')+sparkle(74,28,'#f9e6bd',6)+sparkle(28,72,'#fff2cd',5))
add('Day',C(49,42,24,'#ffd76b','#dfad55',2)+rays(49,42,30,6,10,'#e2b06b',3)+D('M7 78q20-22 42-6 18-18 45 4v12H7Z','#8bd4a1','#61aa8b',2))
add('Rainbow',art['rainbow'][art['rainbow'].find('>')+1:-6]) if False else None
# Technology and culture distinctive original motifs
add('Battery',R(22,18,55,66,10,'#84bf8a','#527f80',3)+R(40,9,19,12,3,'#c1d7db')+D('M55 30 37 55h15l-8 20 24-29H51Z','#ffe17c','#c5a34f',2))
add('Circuit',R(14,13,72,74,11,'#6fb19d','#467e78',3)+R(33,31,34,36,5,'#3e547a','#283e60',2)+''.join(L(f'M{x} 15v16M{x} 67v19','#e2ca85',3) for x in [39,50,61])+''.join(L(f'M15 {y}h18M67 {y}h18','#e2ca85',3) for y in [39,51,63]))
add('Microchip',R(22,22,56,56,9,'#4d6384','#344e6b',3)+R(35,35,30,30,5,'#92c7b5','#5dafa1',2)+''.join(L(f'M{x} 13v9M{x} 78v9','#d9b88d',3) for x in [32,48,64])+''.join(L(f'M13 {y}h9M78 {y}h9','#d9b88d',3) for y in [32,48,64]))
add('Processor',R(20,20,60,60,10,'#51658f','#3c4e72',3)+R(33,33,34,34,5,'#a2d2f3','#73abc9',2)+D('M40 57 50 38 58 57Z','#ffe19b','none',0)+''.join(L(f'M{x} 12v8M{x} 80v8','#c5e1c6',3) for x in [34,50,66]))
add('Screen',R(10,16,80,58,10,'#40597b','#30445e',3)+R(18,23,64,43,3,'#9dd9ef')+D('M18 53 38 33l17 21 15-16 12 15v13H18Z','#5abb9c')+R(44,74,12,12,2,'#708ba9')+R(30,85,40,5,2,'#566d89'))
add('Camera',R(13,26,74,52,12,'#4b6484','#334b64',3)+R(22,17,26,14,4,'#6e8da3')+C(52,50,22,'#93def1','#1b4c72',5)+C(52,50,12,'#3b80ad','#d4f6fc',2)+C(73,37,4,'#ffda88')+sparkle(45,45,'#e5feff',4))
add('Book',D('M13 21q21-8 37 5v58Q31 73 13 82Z','#fbefdc','#917f77',2.3)+D('M87 21q-21-8-37 5v58q19-11 37-2Z','#f5dfc6','#917f77',2.3)+L('M50 26v58M21 38q12-4 22 2M57 40q13-4 22 1M22 53q11-2 19 2M57 55q13-4 23 0','#8d8f9d',2))
add('Music',D('M51 15v53M51 16l29-6v49','#4f7cb4','none',0)+L('M51 15v53M51 16l29-6v49','#6380bb',6)+E(39,72,13,9,'#f69bb8','#b277a6',2)+E(68,63,13,9,'#f6bc73','#be9a62',2)+sparkle(20,26,'#93d4e6',7))
add('Film',R(13,32,74,55,8,'#47546e','#344156',3)+D('M13 32h74V19q0-5-6-5H19q-6 0-6 5Z','#f3c981','#997a65',3)+''.join(L(f'M{x} 15l9 16','#495778',4) for x in [20,43,66])+D('M41 45 41 75 67 60Z','#eff6fa','#aac3d3',1.5))
add('Joystick',R(14,45,73,37,14,'#536c8f','#31425c',3)+L('M42 48v-21','#56627b',6)+C(42,26,10,'#ea7687','#a44c68',2)+C(66,58,6,'#f7d384')+C(76,69,5,'#7ad2e9')+R(23,61,21,6,3,'#c6dce4'))
add('Controller',D('M16 36q-12 3-13 27-1 28 18 22l19-18h20l19 18q19 6 18-22-1-24-13-27-17-11-35-4Z','#7a91b7','#4b6184',3)+L('M18 55h24M30 43v24','#dbeafa',5)+C(68,53,5,'#f6a0ba')+C(80,63,5,'#f8d385'))
add('Radio',R(13,29,74,54,10,'#c98b61','#906751',3)+L('M22 29 74 12','#7e8ca1',3)+R(21,40,41,20,4,'#536e86')+''.join(L(f'M{x} 43v15','#b8d1d9',2) for x in [26,34,42,50,58])+C(72,64,9,'#f2c877','#9c755a',2))
add('Television',R(10,22,80,62,12,'#667f91','#3f576c',3)+R(19,31,62,43,5,'#a2ddef')+D('M19 69l17-25 18 17 10-14 17 22Z','#6ab1a2')+L('M39 22 25 9M58 22 75 9','#596b7a',3))
add('Computer',R(17,12,66,51,8,'#536880','#3a4c65',3)+R(24,19,52,36,4,'#9fd9ed')+R(45,63,11,14,2,'#849aa7')+R(30,77,41,5,2,'#6d8596')+R(19,85,62,7,3,'#ccd9dc'))
add('Clock',C(50,50,38,'#f7ecce','#957f71',3)+C(50,50,30,'#fff9e8','#ddd3c1',2)+L('M50 50V26M50 50l18 11','#4f5f77',5)+C(50,50,4,'#e7ab6d')+''.join(C(50+27*math.cos(i*math.pi/6),50+27*math.sin(i*math.pi/6),1.8,'#6d7f8c') for i in range(12)))
add('Time',art['clock'][art['clock'].find('>')+1:-6])
add('Wheel',C(50,51,35,'#535d72','#344454',4)+C(50,51,25,'#d7ccac','#6e6d77',3)+C(50,51,9,'#8ca8bb','#495879',2)+''.join(L(f'M50 51  {50+25*math.cos(i*math.pi/4):.1f} {51+25*math.sin(i*math.pi/4):.1f}','#637b8f',3) for i in range(8)))
add('House',D('M13 45 49 12 88 45v43H13Z','#e8b781','#a37b69',3)+D('M8 44 49 10l43 35-9 9-34-28-34 28Z','#bd715b','#945e55',3)+R(38,59,24,29,3,'#a48068')+R(21,48,13,12,2,'#a5d8e8'))
add('City',D('M8 88V47h24v41M31 88V17h30v71M61 88V34h31v54Z','#88b2c1','#667e99',2.8)+''.join(R(x,y,5,7,1,'#f8e1a5') for x,y in [(15,57),(24,72),(39,28),(50,28),(39,44),(50,44),(38,62),(50,62),(71,44),(83,44),(71,62),(83,62)]))
add('Flower',art['flower'][art['flower'].find('>')+1:-6]) if False else None

add('Sword',D('M50 5 60 19 57 63 50 74 43 63 40 19Z','#b9dbeb','#597997',3)+D('M50 10 51 66 46 58Z','#f1faff','none',0)+L('M28 64h44','#c79c56',7)+R(46,66,8,22,2,'#7b596c','#604f66',2)+C(50,89,6,'#f2cc74','#a98153',2))
add('Shield',D('M50 7Q73 18 86 22V52Q83 76 50 94Q17 77 14 52V22Z','#6e9dcb','#445c92',3)+D('M50 17v67q-26-14-27-37V30Z','#a4c5ed','none',0)+D('M50 28l7 14 16 2-11 11 2 17-14-8-14 8 2-17-11-11 16-2Z','#f3d178','#b29164',2))
add('Dragon',D('M19 72Q10 36 31 32L44 14 54 33Q76 28 86 43L69 48Q93 71 75 83L52 72 37 83Z','#69b878','#326e65',3)+D('M34 40 20 21 40 29 52 12 63 35','#95db87','#326e65',2)+D('M52 48Q66 31 79 52L69 63Z','#9fc98a','#578a73',1.8)+C(69,44,3,'#f8d769')+D('M26 75Q16 91 9 73','#66b679','#3c7f64',3))
add('Robot',R(22,25,56,51,11,'#8195be','#435978',3)+R(29,35,18,16,4,'#6bcad5')+R(53,35,18,16,4,'#6bcad5')+L('M39 61h23','#edf5ff',3)+L('M50 25V13','#4f6f8d',3)+C(50,10,6,'#edb27c')+R(29,77,42,8,3,'#a3b7d6','#617999',2))
add('Human',D('M16 90Q18 64 42 61h17Q84 67 85 90Z','#7dbccf','#5e8ea4',3)+C(50,35,22,'#eec69b','#9c7f77',2.5)+D('M29 32Q23 14 41 11Q68 4 73 31q-8-7-15-11Q38 30 29 32Z','#695662','#695662',2)+C(43,39,2,'#43506a')+C(59,39,2,'#43506a'))
add('Fish',D('M21 45Q42 23 73 44L90 30V69L74 57Q43 78 21 57Q10 47 21 45Z','#6cc4d8','#428cac',2.8)+D('M41 34 50 16 62 39Z','#90dfea','#428cac',2)+C(32,44,3,'#274f73')+L('M23 60q-8 12-17 5','#76bedf',3))
add('Animal',E(50,61,26,22,'#e7bc8e','#a97960',3)+C(33,39,11,'#e2b080','#9b765d',2)+C(67,39,11,'#e2b080','#9b765d',2)+E(50,56,19,19,'#f3d6ad','#a97960',2)+C(43,53,3,'#615765')+C(58,53,3,'#615765')+D('M46 63q4 5 8 0','#ac7a6f','none',2))
add('Fossil',D('M13 81 18 32 59 16 87 45 82 84Z','#d9c5a5','#ab967f',3)+D('M28 59Q33 29 54 32Q75 38 63 56Q44 71 44 51Q45 42 56 49','#f4e9d7','none',3)+C(40,39,4,'#f0e4cb'))
add('Oil',D('M50 8Q31 39 29 56q-2 26 21 32 25-5 23-31Q68 39 50 8Z','#596c81','#3e5064',3)+D('M38 58Q39 79 53 79','#b4b3c8','none',3)+C(54,40,7,'#8499a7'))
add('Fuel',R(29,16,46,69,6,'#cf6465','#a04d5b',3)+R(35,26,33,20,3,'#fff0d6','#d6bfae',2)+D('M46 30q17 8 0 15q-7-7 0-15','#f4ae63','#d48663',2)+L('M63 51v15q0 7 8 7h12V42','#554f66',4)+C(84,37,6,'#384c5f'))
add('Sunflower',D('M49 62v30','#5c9d63','#458361',5)+D('M48 78q-29-9-26-24 21 0 26 24Z','#89c981','#548e67',2)+''.join(D(f'M{49+24*math.cos(i*math.pi/6):.1f} {39+24*math.sin(i*math.pi/6):.1f}q-12 -13 0 -24q12 11 0 24Z','#f6be55','#c78e45',1.4) for i in range(12))+C(49,39,17,'#805840','#5b453d',2)+''.join(C(x,y,2,'#ecbb69') for x,y in [(43,32),(54,32),(40,42),(52,45),(58,39)]))
add('Factory',D('M10 87V50l23-15v15l22-15v20l29-12v44Z','#98aabe','#627f99',3)+R(16,67,12,13,2,'#e7c586')+R(39,67,12,13,2,'#e7c586')+R(64,67,12,13,2,'#e7c586')+R(67,16,13,31,3,'#697b91')+cloud(65,2,.29,'#d4d7df'))
add('Wheel',art['wheel'][art['wheel'].find('>')+1:-6]) if False else None


add('Castle',D('M15 85V31h15V19h15v12h10V17h15v14h15v54Z','#95a7c4','#566b8c',3)+D('M24 32 24 60h54V32Z','#c4d1e3','none',0)+D('M41 85V65q9-12 18 0v20Z','#455875','none',0)+R(23,41,9,13,2,'#7fa9bf')+R(67,41,9,13,2,'#7fa9bf')+L('M12 85h77','#d0b885',4))
add('Drum',E(50,32,31,12,'#f9cf96','#a57d69',3)+D('M19 33v38q30 27 62 0V33Z','#d48576','#9b616a',3)+E(50,69,31,12,'#be6b6c','#9b616a',2)+L('M22 36l18 36M40 41l21 36M61 40l19 30','#eabe94',4)+L('M20 14 72 44M79 10 31 46','#936c58',4))
add('Dice',R(19,17,62,65,11,'#f9ede4','#97a1ae',3)+C(36,35,6,'#678eb5')+C(64,35,6,'#678eb5')+C(50,50,6,'#e9ab83')+C(36,65,6,'#678eb5')+C(64,65,6,'#678eb5'))
add('Monkey',C(50,51,32,'#a87355','#765848',3)+C(24,46,13,'#b88563','#8a634d',3)+C(76,46,13,'#b88563','#8a634d',3)+E(50,60,23,21,'#f0c9a0','#af8b70',1.5)+C(40,47,4,'#424458')+C(62,47,4,'#424458')+E(51,61,6,4,'#806658')+L('M44 71q8 6 16 0','#916355',2))
add('Dolphin',D('M11 61Q20 21 68 26L82 15 81 36Q97 52 81 69L72 58Q47 87 22 70Z','#69c0df','#428fae',3)+D('M40 38 52 10 61 33Z','#8cdaec','#428fae',2)+C(67,36,3,'#294e6a')+L('M14 86q20-10 41 0','#b2eaf5',3))
add('Tank',D('M16 57h68v20H16Z','#748ba0','#50647f',3)+D('M26 46h39l12 11H20Z','#a3b4a5','#668774',3)+R(42,31,23,16,5,'#6e9786')+L('M61 36h30','#738a78',7)+''.join(C(x,75,8,'#d8dbd4','#536778',3) for x in [27,50,73]))
add('Hat',D('M23 67 38 18q17-12 29 0l8 49Z','#74bc83','#46795c',3)+D('M36 48 50 30 67 48Z','#a7dd92','none',0)+D('M10 73q41 18 80 0l-7-12q-32 11-66 0Z','#4e966a','#3b795d',3)+sparkle(64,36,'#f8d986',7))
add('Umbrella',D('M9 47Q50 1 92 47Q72 36 51 47Q31 36 9 47Z','#b28fba','#765e89',3)+L('M51 47v29q0 17 14 9','#785e86',4)+sparkle(30,27,'#e1b7df',5))
add('Toy',R(19,25,62,55,10,'#81c8c4','#4e959e',3)+R(27,33,22,20,3,'#f6cc7a')+C(65,49,12,'#ed90a6')+D('M35 60 50 74 64 60Z','#e2edf2','#698d9f',2)+L('M30 87h40','#91b4ac',3))
add('Glove',D('M24 81Q11 68 22 50L35 31Q43 24 50 30L56 35 62 17Q69 9 75 16Q80 22 75 34L68 57Q86 64 80 81Z','#de8e83','#a7636e',3)+L('M39 52q14 10 29 4','#f3baab',4))
add('Cartridge',R(20,12,60,76,7,'#667b9d','#435c7e',3)+R(29,27,42,37,5,'#a8d5e6')+D('M30 64h40V40H30Z','#7ebcaa','none',0)+R(34,75,32,7,1,'#e7bd88'))
add('Board',R(11,11,78,78,10,'#e7c999','#ab8a62',3)+''.join(R(22+x*17,22+y*17,17,17,0,('#9b91ba' if (x+y)%2 else '#f6ebdc')) for x in range(3) for y in range(3))+C(30,30,8,'#ed907b','#a76164',2)+C(63,62,8,'#80bed2','#478ea6',2))
# Individually assigned game illustrations. These are authored, pre-rendered icon
# compositions, not downloaded cover art or protected character portraits.
GAME_CONCEPTS={
'Mega Man Battle Network 3 Blue':('Robot','Circuit','#cdeaf3'),
'Castlevania: Portrait of Ruin':('Castle','Book','#ddd1e8'),
'Golden Sun: Dark Dawn':('Sun','Book','#f3e4b6'),
'Kirby: Squeak Squad':('Toy','Star','#f4d8e5'),
'Sonic X Shadow Generations':('Wind','Star','#c9dbf0'),
'Resident Evil: The Umbrella Chronicles':('Castle','Umbrella','#e3d7e5'),
'New Super Mario Bros. U Deluxe':('Cartridge','Star','#e9d7b7'),
'Advance Wars 1+2: Re-Boot Camp':('Tank','Board','#d7e2ce'),
'Ecco the Dolphin: Defender of the Future':('Dolphin','Ocean','#b6e5f1'),
'Mega Man Network Transmission':('Robot','Microchip','#bfd7ed'),
'Mega Man Star Force: Dragon':('Dragon','Robot','#bfded7'),
'LocoRoco Midnight Carnival':('Toy','Music','#eeddeb'),
'Patapon 3':('Drum','Music','#e9cfc4'),
'Shining the Holy Ark':('Crystal','Castle','#e6d8ed'),
'Resident Evil Outbreak':('Cave','Fossil','#d9d6c9'),
'The Legend of Zelda: The Minish Cap':('Hat','Sword','#d6ecd7'),
'Tetris 99':('Board','Crystal','#d3dfef'),
'Syphon Filter: The Omega Strain':('Radio','Circuit','#e0dfd8'),
'Jak and Daxter: The Lost Frontier':('Sky','Spaceship','#d9e7e1'),
'Ape Escape: On the Loose':('Monkey','Tool','#f3e2cb'),
'Mario vs. Donkey Kong 2: March of the Minis':('Toy','Wheel','#eadfcc'),
'Final Fantasy Tactics: The War of the Lions':('Shield','Board','#e8dfd0'),
'Castlevania: The Dracula X Chronicles':('Night','Castle','#d4cde0'),
'Dragon Ball Z: Shin Budokai - Another Road':('Glove','Energy','#e6d7c0'),
'Shining Force: Resurrection of the Dark Dragon':('Dragon','Sword','#d5e2c6'),
'Mario Party DS':('Dice','Board','#ead5c9'),
}
# A few extra independently drawn game-context objects reused in the new artwork.
add('Spaceship',D('M50 10 65 42 78 71 50 62 22 71 35 42Z','#8fb6d2','#557996',3)+D('M42 39Q50 20 58 39L59 57H41Z','#c9f3fb','#6b9eb8',2)+D('M30 65 22 86 44 72Z','#eea389','#b56a72',2)+D('M70 65 78 86 56 72Z','#eea389','#b56a72',2))
add('Tool',D('M32 17Q15 23 20 43L43 58 68 88l15-15-30-30Q58 21 43 17L37 35 22 35Z','#b4c6d2','#6e8a9b',3)+C(74,75,4,'#5a788b'))
def art_body(name):return art[name.casefold()].split('>',1)[1].rsplit('</svg>',1)[0]
def game_compose(title,main,accent,bg):
 assert main.casefold() in art and accent.casefold() in art,(title,main,accent)
 # Consistent Gameverse shape, intentionally not a platform/game cover.
 background=R(5,5,90,90,17,bg,'#dfd2c7',1.5)
 mainmark=f'<svg x="10" y="8" width="79" height="79" viewBox="0 0 100 100">{art_body(main)}</svg>'
 badge=C(77,76,19,'#fffdf8','#ddd5c5',2)
 marker=f'<svg x="62" y="61" width="30" height="30" viewBox="0 0 100 100">{art_body(accent)}</svg>'
 return svg(background+mainmark+badge+marker)
for title,(main,accent,bg) in GAME_CONCEPTS.items():art[title.casefold()]=game_compose(title,main,accent,bg)

# Create exact mappings only for existing labels, plus direct visual subtypes.
base=json.loads((P/'legacy-data.js').read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
existing={name.casefold():name for name,*_ in base['items']}
for filename in ['creative-pack.js','gaming-pack-v22.js','gaming-pack-v23.js','gaming-pack-v24.js','gaming-pack-v26.js','gaming-pack-v27.js','gaming-pack-v30.js']:
 pack=json.loads((P/filename).read_text(encoding='utf8').split(' = ',1)[1].rstrip(' ;\n'))
 for it in pack['items']:existing[it['name'].casefold()]=it['name']
selected={key:svgdata for key,svgdata in art.items() if key in existing}
# Known icon categories which were previously mismatched: no potion for crystal,
# no star for sun, no thunder emblem for sky or wind.
assert all(k in selected for k in ['sun','sky','wind','crystal','air','cloud','rain','lightning'])
output=P/'gameverse-art-v30-semantic.js'
output.write_text('export const GAMEVERSE_ART_V30_SEMANTIC = '+json.dumps(selected,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(ROOT/'shared/v30-semantic-audit.json').write_text(json.dumps({'authored_motifs':len(art),'existing_exact_names_used':len(selected),'names':sorted(selected)},indent=2),encoding='utf8')
print('Authored motifs:',len(art),'active exact-name semantic icons:',len(selected),'size',output.stat().st_size)
