#!/usr/bin/env python3
"""V41 illustrated art: 80 manually composed, distinct, static, offline 100x100 SVG pictograms."""
from pathlib import Path
import sys,json,xml.etree.ElementTree as ET,hashlib,math
from importlib.machinery import SourceFileLoader
ROOT=Path(__file__).resolve().parents[1]
v38=SourceFileLoader('v38',str(ROOT/'tools/build-v38-art.py')).load_module()
p,c,e,r,poly=v38.p,v38.c,v38.e,v38.r,v38.poly
sun,cloud,water,drop,leaf,flower,fish,rock,snowflake,tree,sparkle,bird=v38.sun,v38.cloud,v38.water,v38.drop,v38.leaf,v38.flower,v38.fish,v38.rock,v38.snowflake,v38.tree,v38.sparkle,v38.bird
INK='#627080';SKY='#B8D8E6';SEA='#78BDD0';GREEN='#85B99B';GOLD='#EAC57D';PINK='#E6A4A3';LILAC='#B8A4D3';STONE='#C5B4A1';WOOD='#BF9979';SAND='#E9CCA4'
def line(d,col=INK,w=4):return p(d,stroke=col,w=w)
def shape(d,fill=SKY,stroke=INK,w=3):return p(d,fill,stroke,w)
def box(x,y,w,h,col=STONE):return r(x,y,w,h,col,'#92847D',4,3)
def ground():return line('M10 86h80','#97AF9D',4)
def building(h=60,fill=STONE):return box(24,86-h,53,h,fill)+ground()
def window(x,y):return r(x,y,10,13,'#A9D5DE','#8095A2',2,2)
def boat():return shape('M15 63h72l-13 20H29Z','#C69B7E','#927B6D',4)+line('M50 62V17','#8D8174',5)+poly('47,20 47,61 19,60','#F1DEC2','#A99580',3)+water(87)
def wheel(x=50,y=48,rad=25):return c(x,y,rad,'#D4DBDA','#728F9B',4)+c(x,y,5,'#F2E6D3','#728F9B',2)+''.join(line(f'M{x} {y}l{rad*math.cos(a):.1f} {rad*math.sin(a):.1f}','#8DA8B1',3) for a in [0,math.pi/2,math.pi,3*math.pi/2])
def insect(cx=50,cy=51,color=GOLD):return e(cx,cy+13,15,22,color,'#7D7985',3)+c(cx,cy-12,11,color,'#7D7985',3)+''.join(line(f'M{cx-11 if i<3 else cx+11} {cy+i%3*10}l{-20 if i<3 else 20} {[-13,0,13][i%3]}','#86828A',3) for i in range(6))+line(f'M{cx-5} {cy-20}l-9-12m19 12 9-12','#7D7985',2)
def eye(x,y):return c(x,y,2.5,'#40545F','none',0)
def antennae(x=50,y=30):return line(f'M{x-7} {y}l-10-16m24 16 10-16','#7D7180',2)
def papers():return r(21,15,58,71,'#F7F0DC','#A9A49C',4,3)
def star(x,y):return sparkle(x,y,GOLD)
SCENES={
# WEATHER / CLIMATE: individualized silhouettes
'Storm':cloud(45,35)+cloud(62,41)+line('M26 64l-8 13M51 65l-7 15M77 62l-9 16',SEA,5)+shape('M53 49 41 68h11l-9 17 23-26H54Z',GOLD,'#C29960',2),
'Thunder':cloud(50,34)+shape('M54 41 38 66h13l-6 22 24-34H55Z',GOLD,'#C69F61',3)+line('M15 58q-9 10 0 19M83 54q11 10 0 20','#A1AEC4',4),
'Fog':cloud(50,29)+''.join(line(f'M15 {y}q25-9 42 0t29 0','#A9C8D1',5) for y in (58,70,82)),
'Mist':''.join(line(f'M16 {y}q18-13 36 0t32 0','#B9D6DD',5) for y in (34,52,70))+drop(74,49,'#B7DFE7'),
'Blizzard':cloud(46,29)+snowflake(32,68)+snowflake(73,72)+line('M16 51q26 4 59-1','#88B6C5',4),
'Tornado':cloud(51,19)+shape('M14 42q41-14 73 0-15 9-60 13 29 15 42 11-17 12-35 10 13 9 25 3-14 17-30 9','#A9CEDC','#7AA1B2',3),
'Hurricane':c(50,53,35,'#B2D8E1','#78A8BE',3)+shape('M50 53q-19-30 10-24 26 8 18 33-9 31-46 19-27-10-13-39','#F6F8F2','#7299B5',5)+c(50,53,8,'#7BAFBF','none',0),
'Monsoon':cloud(50,25)+line('M18 59q36-11 67 0',GREEN,6)+''.join(line(f'M{x} 66l-6 13',SEA,5) for x in (28,44,62,80))+leaf(53,54,GREEN,28),
'Drizzle':cloud(50,28)+''.join(drop(x,62+(-1)**i*7,'#A7D9E4') for i,x in enumerate((25,46,68,83))),
'Flood':shape('M10 76l19-24 18 15 18-17 25 26v13H10Z',STONE,'#A49285',3)+water(66)+water(79),
'Pressure':wheel(50,48,29)+line('M50 49 69 31','#B18491',6)+line('M39 79h24','#8DA7A5',5)+c(50,49,6,'#D8B67E','none',0),
'Humidity':drop(48,50,SEA)+c(72,30,8,'#CEE5E8','none',0)+line('M22 80q26-10 55 0',SKY,5),
'Forecast':papers()+sun(64,35)+cloud(43,40)+line('M30 65l13-8 11 4 15-12','#8ABB9F',4)+line('M30 74h38','#BCB4A4',3),
'Barometer':r(32,18,36,69,'#E6E4D7','#899DA9',17,4)+c(50,54,16,'#D7E6E4','#7895A3',3)+line('M50 54 64 42','#C99587',4)+line('M44 26h13','#B9BEC4',3),
'Thermometer':r(42,14,16,55,'#E6EDF1','#87A3AF',7,3)+c(50,75,15,'#EFA88A','#BB8776',3)+line('M50 35v39','#DB8F80',7)+line('M60 36h7m-7 12h7m-7 12h7','#809BA6',2),
'Heatwave':sun(47,39)+''.join(line(f'M{x} 67q-9 8 0 16',PINK,5) for x in (26,47,68))+line('M13 87h73','#BDA084',4),
# INSECTS: individual wing patterns / nests / habitats
'Ant':insect(50,51,WOOD)+c(50,70,12,'#B17E62','#866D62',3)+eye(46,37)+eye(55,37),
'Anthill':shape('M13 81Q49 23 85 81Z','#C9A17E','#937660',4)+c(46,67,9,'#594D4A','none',0)+insect(72,69,'#C18D72'),
'Beetle':insect(50,49,'#86B8A0')+line('M50 46v37','#5C9386',3)+c(39,57,4,'#6E9B86','none',0)+c(62,69,4,'#6E9B86','none',0),
'Ladybug':e(50,57,28,28,'#E17F78','#AA625F',4)+line('M50 30v53','#664F58',3)+''.join(c(x,y,4.5,'#655C64','none',0) for x,y in ((36,47),(63,49),(37,67),(65,71)))+c(50,25,10,'#655C64','none',0),
'Wasp':insect(50,47,GOLD)+''.join(line(f'M36 {y}h28','#8B7975',4) for y in (52,64))+e(32,45,13,9,'#D1E7E7','#93B6BE',2)+e(67,45,13,9,'#D1E7E7','#93B6BE',2),
'Mosquito':e(50,49,7,23,'#9DAD9F','#647E83',3)+c(50,29,9,'#A5B8A9','#73877E',2)+e(32,49,18,9,'#DCEAE5','#91B5BE',2)+e(70,49,18,9,'#DCEAE5','#91B5BE',2)+line('M50 19 68 12M44 69l-23 18m34-19 24 17','#687D80',3),
'Moth':e(36,46,22,29,'#CBB3D5','#A18BAE',3)+e(65,46,22,29,'#D8BBD6','#A18BAE',3)+e(50,54,9,27,'#9D8CAD','#7F7899',3)+c(49,28,8,'#C3A6C6','#7F7899',2)+c(25,42,6,'#E8D7EA','none',0)+c(73,41,6,'#E8D7EA','none',0),
'Grasshopper':e(50,52,25,13,'#8DBD7C','#65966C',3)+c(73,44,11,'#A5CB87','#65966C',3)+line('M31 61 16 84m25-26L53 80m13-26 21 31','#6C986E',4)+antennae(73,33),
'Cricket':e(49,54,23,13,'#A9BD80','#768E71',3)+c(70,43,10,'#BBCB91','#768E71',3)+line('M30 60 15 79m35-18 18 21m-10-42 22-17M69 36l11-18','#7F9775',4)+star(22,25),
'Silk':shape('M26 15q55 4 48 38-8 35-46 26Q10 60 26 15Z','#E9DFD1','#B8AE9D',3)+''.join(line(f'M30 {y}q20 14 43 0','#C8C1B1',2) for y in (32,45,58,71)),
'Bee Bread':r(22,27,56,56,'#C7A67D','#9F835D',10,3)+''.join(c(x,y,8,'#DABF73','#AE9263',2) for y in (40,57,74) for x in (37,54,70) if x+y<151)+star(81,20),
'Insect Hotel':box(18,25,64,59,WOOD)+shape('M15 27 50 10 86 27Z',GOLD,'#9E8369',3)+''.join(c(x,y,6,'#7C6758','#A98A75',2) for x in (32,49,66) for y in (43,61))+line('M17 85h66','#8C7F76',4),
'Aphid':e(50,57,24,21,'#93C585','#64966B',3)+c(48,31,12,'#A8D094','#64966B',3)+c(38,56,4,'#CEE6AF','none',0)+c(61,55,4,'#CEE6AF','none',0)+antennae(50,24)+leaf(70,80,GREEN,30),
'Termite':insect(50,50,'#D3AF87')+r(37,50,25,8,'#DDBD91','#AE8F72',3,1)+shape('M19 84 13 65l16 7 5 12Z',WOOD,'#A68064',2),
'Swarm':''.join(e(x,y,9,7,'#E8C26D','#A68865',2)+line(f'M{x-2} {y-6}l-7-8','#9C8881',2) for x,y in ((23,45),(47,25),(70,42),(44,65),(78,76)))+line('M19 78q31 17 62-10',GREEN,3),
'Praying Mantis':e(51,56,13,23,'#87B989','#668C79',3)+poly('36,37 50,17 65,37','#9CC893','#668C79',3)+line('M39 52 17 39l-7 18m52-5 22-15 5 18M45 68 31 87m24-20 14 20',GREEN,5)+eye(43,32)+eye(57,32),
# ARCHITECTURE / MATERIALS
'Brick':box(14,32,72,45,'#CD967C')+line('M14 54h72M50 32v22m-20 0v23m43-23v23','#E9B79A',3),
'Clay':shape('M26 74q-14-13 4-30 12-17 26-18 24 3 25 35 2 20-24 21H37Z','#CEAA8B','#9B8373',4)+line('M30 65q17-8 38 0','#EBCCAC',4),
'Cement':r(23,26,54,56,'#CFD4D1','#8F9A9C',4,3)+line('M23 42h54M36 53h28','#EBECE2',4)+shape('M40 81l11-20 12 20Z','#B5BFBD','#879494',2),
'Concrete':box(16,45,67,37,'#B1B6BC')+line('M16 59h67m-36-13v36','#D6DADA',3)+c(29,72,4,'#8C9BA3','none',0),
'Arch':shape('M12 82V48Q50 4 88 48v34H67V51q-17-22-34 0v31Z','#D7B59B','#9D7E73',4)+line('M19 67h15m32 0h15','#F3D6B8',3),
'Column':r(32,25,36,53,'#E0CBB0','#A69285',4,3)+r(22,17,56,12,'#D9C1A8','#A69285',3,3)+r(19,77,61,10,'#D9C1A8','#A69285',3,3)+line('M43 28v45m14-45v45','#F8E6C8',3),
'Tower':building(66,'#CDB69F')+shape('M20 22 50 9 81 22Z',GOLD,'#9E8775',3)+window(33,38)+window(56,38)+r(45,65,13,21,'#958E8A','#887970',4,2),
'Cathedral':shape('M15 85V46l19-18 18 18 18-19 17 19v39Z','#D7C0AD','#9C857E',4)+shape('M38 28 50 10 61 28Z','#C8B2AB','#9C857E',3)+r(43,42,15,25,'#93BCD0','#8D89AA',6,2)+line('M50 42v23m-7-12h14','#EAE3D7',3),
'Ruins':shape('M15 85V40h25v20h14V30h30v55Z','#C2B0A0','#94837A',4)+line('M15 52h25m14-13h30M28 43v22m40-27v23','#E5D5BC',4)+ground(),
'Monument':r(30,69,42,18,'#C9BAB0','#94877D',3,3)+poly('39,68 50,17 61,68','#E4CDAA','#9F8B7E',4)+star(77,25)+ground(),
'Plaza':ground()+r(15,55,72,24,'#E1D4C1','#B49F88',3,3)+c(50,52,12,'#A1D2D7','#789AA3',3)+line('M50 38v-18m-16 31h-9m51 0h-9','#8DA7A7',3),
'Museum':shape('M15 34 50 15 85 34Z','#E0C9B1','#9E8C7F',4)+box(17,34,67,10,'#CDB6A6')+''.join(r(x,44,9,33,'#E4D2BC','#AD9787',2,2) for x in (27,46,66))+box(14,78,74,8,'#B7A89C'),
'Library':r(16,22,69,62,'#D8BB9E','#967E6A',5,4)+''.join(r(x,34,12,41,col,'#8B7680',2,2) for x,col in ((27,'#9CB7CD'),(43,'#D89B8F'),(59,'#ACC4A4')))+line('M20 79h62','#89756F',4),
'Canal':shape('M16 14h21v27h26V14h22v70H16Z','#D6BA9A','#A28E7F',4)+shape('M39 41 62 41 73 88 25 88Z','#8FC6D6','#6399B0',2)+line('M17 59h18m31 0h18','#EEDBC1',3),
'Aqueduct':water(30,SEA)+''.join(shape(f'M{x} 77V50q10-16 20 0v27Z','#D4BDA6','#9D8D7D',3) for x in (13,36,59))+line('M12 47h77m-77 32h77','#CDB59D',5),
'Scaffold':line('M22 18v70M78 18v70M20 34h60M20 60h60M20 85h60','#A88D71',6)+line('M22 34 78 60m0-26L22 60m0 0 56 25','#D3B195',3),
# MARITIME
'Harbor':water(78)+shape('M13 67h25v-17h14v17h31v15H13Z','#D4BA9D','#A48B79',3)+boat().replace('M15 63h72','M35 63h40'),
'Compass':c(50,50,36,'#E9E2D2','#A79384',4)+poly('50,15 60,52 50,85 40,52',PINK,'#9C777D',3)+poly('15,50 50,39 85,50 50,61',SKY,'#789BA8',3)+c(50,50,6,GOLD,'#A98D68',2),
'Navigation':papers()+line('M27 69 39 49 50 57 65 33','#88A8C6',4)+star(69,31)+c(27,69,5,PINK,'none',0),
'Anchor':line('M50 13v58m-18-41h37','#7E9BAB',7)+c(50,17,6,'#DDE8E6','#71949E',3)+shape('M18 59q4 27 32 26t32-26l-12 8m-52-8 12 8','none','#7499AD',6),
'Rudder':shape('M27 23h46v43L51 84 27 65Z','#BA9980','#876F69',4)+line('M51 15v69','#8C8A7E',6)+line('M35 40h32','#DEC3A2',4),
'Mast':line('M50 12v73','#99816C',7)+poly('46,17 46,69 17,68','#F5E5C5','#B29A84',3)+poly('54,22 82,68 54,68','#D7E6E7','#A0B4BA',3)+water(86),
'Keel':shape('M12 48q40 38 75 0l-15 24H31Z','#C3A083','#8F766D',4)+line('M50 30v54','#A18876',7)+water(85),
'Sail':poly('51,13 51,77 19,77','#F1E6CF','#B8A596',4)+poly('59,24 84,77 59,77','#C3DDE4','#9ABAC4',3)+line('M53 8v76','#968B79',5)+water(85),
'Port':water(83)+shape('M12 51h76v24H12Z','#D4B59A','#A18A79',4)+box(25,26,20,25,'#C9AD8E')+box(51,36,21,15,'#E3C9AA')+line('M82 23V12H58','#7B9BA3',5),
'Buoy':water(77)+c(50,60,24,'#E4A29B','#AF7C78',4)+r(40,26,20,27,'#F3E3C7','#A89E8E',5,3)+line('M25 60h51','#F3E9D2',6)+c(50,19,5,GOLD,'#BE9865',2),
'Fishing Net':shape('M19 27h62L68 85H31Z','#E4DCCB','#AA9E8C',3)+''.join(line(f'M{x} 27l{(x-50)*.32:.0f} 58','#B9AD9A',2) for x in (30,42,55,68))+''.join(line(f'M{25+i*2} {y}h{55-i*4}','#B9AD9A',2) for i,y in enumerate((43,55,68)))+fish(48,72,'#8DBDC8'),
'Lifeboat':shape('M16 58h70L69 79H30Z','#E5A18F','#B37C76',4)+line('M48 31v27','#A6A9A7',5)+poly('46,32 46,58 26,57','#F1E9D7','#A69C8D',3)+c(69,47,9,'#F7E1AD','#C1A27F',3)+water(82),
'Cargo Ship':shape('M9 61h82L74 84H28Z','#A8BEC2','#738D9C',4)+''.join(box(x,y,22,16,col) for x,y,col in ((24,39,'#D2A28E'),(48,39,'#A8C4B4'),(37,23,'#C4B3CB')))+water(86),
'Shipyard':water(82)+shape('M15 51h70l-13 18H28Z','#D1B8A1','#A78975',3)+line('M22 47V17h50M62 17v37','#91A9B1',5)+box(43,24,20,16,'#D5A57E'),
'Sonar':c(49,53,34,'#B9D5DC','#7DA2B3',3)+''.join(p(f'M49 53l{34*math.cos(a):.1f} {34*math.sin(a):.1f}',stroke='#7EAABD',w=2) for a in [i*math.pi/4 for i in range(8)])+shape('M49 53 80 38A35 35 0 0 1 71 76Z','#83C0BF','#5FA5AB',2)+c(63,55,5,GOLD,'none',0),
'Sextant':shape('M24 75 78 75A54 54 0 0 0 24 21Z','#E6CCA0','#A68D71',4)+line('M25 74 62 31m-14-18 30 24','#7A9CAE',6)+c(25,75,8,'#E9D8BF','#8C8F91',3)+star(81,19),
# HISTORY / EXPLORATION
'Artifact':shape('M25 28h50v7L65 75H35L25 35Z','#C6A27D','#957966',4)+line('M35 50q14-17 30 0m-30 16h30','#E5C7A1',4)+star(78,22),
'Relic':box(21,31,60,53,'#D0B99F')+c(50,53,18,'#D9C9A5','#99836E',3)+star(50,53)+line('M26 80h49','#B6A18A',4),
'Excavation':shape('M10 78 27 42 51 57 72 37 90 78Z','#CDB49A','#9D8977',4)+line('M55 15l-21 52m-9-12h23','#859FA1',6)+c(74,65,6,GOLD,'#A7916C',2),
'Pyramid':poly('49,16 12,82 89,82','#E6C493','#AC9475',4)+line('M49 16 50 82m-22-25h45m-35-18h23','#D5AD7B',3)+sun(82,24),
'Mummy':shape('M38 17q11-9 23 0l9 21-5 46H35l-4-46Z','#E9DABE','#AF9F8E',4)+''.join(line(f'M35 {y}l29-4','#BEAD99',3) for y in (37,49,61,73))+eye(44,29)+eye(56,29),
'Hieroglyphics':box(16,15,68,72,'#E7CCAA')+poly('30,29 40,22 51,30 41,39','#C5A17F','#967B67',2)+c(64,32,8,'#B7A7A0','#917C70',2)+line('M28 51h45m-41 0 5 17 11-15 10 14 13-16','#997F6D',3),
'Explorer':c(50,30,13,'#E3B891','#A28C7A',2)+shape('M26 83Q27 50 51 50T75 83Z','#90B4AF','#6E958F',3)+shape('M20 20q30-27 60 0v10H20Z',GOLD,'#AD976E',3)+line('M31 76 18 88m50-13 15 13','#A39483',4),
'Expedition':shape('M13 80 42 36 57 54 74 25 92 80Z','#A9B5A6','#79958B',4)+poly('42,36 50,47 34,47','#E7F0E9','#B3C7C7',2)+r(20,65,18,18,WOOD,'#997A66',3,3)+star(76,17),
'Landmark':shape('M50 13q21 0 21 21 0 20-21 45-21-25-21-45 0-21 21-21Z','#E6A99C','#A97D7D',3)+c(50,34,9,'#F9E5CD','#A97D7D',3)+line('M30 85h40','#A7B8AD',4),
'Rock Art':rock()+line('M29 64q16-20 30-2m-18-13-3-13m26 25 10-11','#A67461',5)+c(60,46,5,GOLD,'none',0),
'Tomb':shape('M21 86V40q0-27 29-27t29 27v46Z','#CBB59B','#9C867C',4)+shape('M35 87V48q0-15 15-15t15 15v39Z','#8C8883','#756F73',3)+line('M17 86h66','#B79C85',5),
'Archaeologist':c(50,30,12,'#E8C39C','#A58A78',2)+shape('M23 83Q28 51 50 52t27 31Z','#C6AC88','#9A816D',3)+poly('19,22 50,8 81,22','#E1C17B','#AB8A64',3)+line('M23 22h56','#9B8569',4)+line('M73 63 87 84','#8D9BA0',5),
'Treasure Map':shape('M16 22 39 16 60 23 84 15v63L60 85 39 78 16 85Z','#EFE3C8','#A89582',3)+line('M30 65q-7-25 16-24t29-13','#8BAA9C',3)+line('M63 55l18 19m0-19-18 19','#B58B78',4),
'Ancient City':shape('M13 83V40h21V25h26v23h26v35Z','#CDB092','#967E6E',4)+r(42,35,11,23,'#7E8F8B','#8B7B73',2,2)+line('M15 60h18m28 2h22','#EBCCAE',3)+ground(),
'Cave Painting':shape('M8 85V45q8-40 42-40t42 40v40Z','#BDAB96','#958477',4)+shape('M22 84V50q7-19 27-19t27 19v34Z','#8B827C','#756F6E',2)+line('M31 57q13-13 27 0m-13-12v26','#DDA783',5),
'Sarcophagus':r(23,15,54,70,'#D7B990','#997C63',10,4)+shape('M32 34q18-17 36 0v42H32Z','#E9CC9F','#B09478',2)+c(50,32,8,'#C39A79','#977962',2)+line('M36 56h28m-24 10h19','#B38F75',3),
}
if __name__=='__main__':
 rows=json.loads((ROOT/'client/src/organic-pack-v41.js').read_text().split(' = ',1)[1].rstrip(';\n'))['items']
 expected={row['name'] for row in rows}
 assert expected==set(SCENES),f'missing {expected-set(SCENES)} extra {set(SCENES)-expected}'
 art={};manifest=[];asset=ROOT/'client/assets/v41';asset.mkdir(exist_ok=True)
 for row in rows:
  name=row['name'];slug=row['id'].split(':',1)[1]
  svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="94" rx="35" ry="4" fill="#607883" opacity=".10"/>'+SCENES[name]+'</svg>'
  ET.fromstring(svg)
  assert len(svg)>320,(name,len(svg))
  assert not any(t in svg.lower() for t in ('<script','<image','<foreignobject','<animate','onload=','href=','<text','<use'))
  art[name.lower()]=svg
  (asset/f'{slug}.svg').write_text(svg,encoding='utf8')
  manifest.append({'id':row['id'],'name':name,'path':f'client/assets/v41/{slug}.svg','sha256':hashlib.sha256(svg.encode()).hexdigest()})
 assert len(set(art.values()))==len(art)
 (ROOT/'client/src/organic-art-v41.js').write_text('export const ORGANIC_ART_V41 = '+json.dumps(art,separators=(',',':'))+';\n',encoding='utf8')
 (ROOT/'shared/v41-art-manifest.json').write_text(json.dumps({'version':41,'icons':manifest},indent=2)+'\n')
 print('V41 icons',len(art),'assets total bytes',sum(map(len,art.values())))
