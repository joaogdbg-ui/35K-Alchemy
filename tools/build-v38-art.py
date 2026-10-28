#!/usr/bin/env python3
"""78 purpose-drawn, small-scale readable SVG pictograms for the V38 catalogue.
Cartoon figures are composed from authored SVG strokes, not initials/emojis/remote assets.
"""
from pathlib import Path
import json,xml.etree.ElementTree as ET,hashlib
ROOT=Path(__file__).resolve().parents[1]
def p(d,fill='none',stroke='#5C6671',w=3,extra=''):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def c(x,y,r,fill,stroke='#5C6671',w=3):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def e(x,y,rx,ry,fill,stroke='#5C6671',w=3):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def r(x,y,w,h,fill,stroke='#5C6671',rad=3,sw=3):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rad}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def poly(pts,fill,stroke='#5C6671',w=3):return f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linejoin="round"/>'
def water(y=72,col='#6EC5DB'):return p(f'M10 {y} Q22 {y-8} 35 {y} T60 {y} T90 {y}',stroke=col,w=6)+p(f'M17 {y+11}q12 -6 23 0t23 0t20 0',stroke='#A5DDE8',w=4)
def sun(x=77,y=25):return c(x,y,11,'#FFD06B','#D99854')+p(f'M{x} {y-18}v-6M{x-18} {y}h-6M{x+18} {y}h6M{x-13} {y-13}l-5-5M{x+13} {y+13}l5 5',stroke='#E6AC59',w=3)
def cloud(x=30,y=24):return p(f'M{x-15} {y+15}q-10-12 5-19 7-17 20-6 16-6 17 16Z','#DBE7F2','#8CAABC',3)
def hill():return poly('6,83 43,25 65,61 80,41 97,83','#B7A7A0','#856F72',4)
def tree():return p('M49 55v33',stroke='#865F4D',w=10)+p('M16 59Q3 34 23 25Q28 5 48 16Q70 3 79 26Q99 37 83 57Z','#78BA7F','#438B69',4)
def leaf(x=50,y=52,fill='#85BF71',rot=0):return f'<g transform="rotate({rot} {x} {y})">'+p(f'M{x} {y+17}Q{x-30} {y-15} {x} {y-22}Q{x+24} {y-7} {x} {y+17}Z',fill,'#528F69',3)+p(f'M{x} {y+15}q-4-20 0-33',stroke='#B1D995',w=2)+'</g>'
def flower(x=50,y=48,col='#E6A4B8'):return ''.join(e(x+dx,y+dy,10,13,col,'#B77E98',2) for dx,dy in [(0,-13),(13,0),(0,13),(-13,0)])+c(x,y,10,'#E9C66E','#B98F51',3)
def drop(x=50,y=44,col='#6BC4DC'):return p(f'M{x} {y-24}Q{x+30} {y+8} {x+17} {y+23}Q{x} {y+36} {x-17} {y+23}Q{x-30} {y+8} {x} {y-24}Z',col,'#4D93B4',3)+e(x-7,y+8,4,7,'#C5F5FB','none',0)
def fish(x=48,y=55,col='#8BBCCD'):return e(x,y,24,14,col,'#4A8094',3)+poly(f'{x+17},{y} {x+40},{y-16} {x+39},{y+16}',col,'#4A8094',3)+c(x-12,y-3,2.8,'#314D62','none',0)+p(f'M{x-7} {y+8}q8-5 16 0',stroke='#DAEDEF',w=2)
def snowflake(x=50,y=48,col='#A9D9E6'):return p(f'M{x-22} {y}h44M{x} {y-23}v46M{x-16} {y-16}l32 32M{x+16} {y-16}l-32 32',stroke=col,w=5)
def pot():return p('M28 46h44l-6 37H34Z','#DCA78B','#A87863',4)+p('M24 43h52v9H24Z','#E9BF9D','#B78269',3)
def bowl(col='#E5BD96'):return p('M18 53h64Q78 80 50 82Q22 80 18 53Z',col,'#9F7A68',4)+e(50,54,32,8,'#EFE0BE','#9F7A68',3)
def cup(col='#EEE4D4'):return p('M25 35h46v32q-2 17-23 17-22 0-23-17Z',col,'#9D8177',4)+p('M72 46q20-4 17 13-3 11-17 11',stroke='#9D8177',w=5)
def jar(col='#85C1D2'):return r(26,31,49,54,col,'#749AA1',8,4)+r(23,25,55,11,'#E3C09D','#AC856B',3,3)
def seed(x=50,y=56):return e(x,y,12,18,'#BC8553','#8A6047',3)+p(f'M{x} {y-13}q-7 13 0 25',stroke='#EDC49A',w=3)
def sparkle(x=79,y=20,col='#F1CE77'):return p(f'M{x} {y-13}l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z',col,'#C99B54',2)
def steam():return p('M32 33q-11-13 0-24m17 24q-10-13 0-24m17 24q-10-13 0-24',stroke='#A8CCD2',w=4)
def milk():return r(29,34,42,50,'#F8F3E4','#97AEB9',4,4)+p('M29 35l12-19h18l12 19Z','#C4E0E7','#97AEB9',3)+p('M44 18v15',stroke='#8BA4AC',w=2)
def wave():return water(56)+water(72,'#4C9BBF')
def rock():return poly('23,81 14,63 30,46 52,48 63,37 82,54 86,80','#B0A4A0','#7F7D88',4)
def starfish():return poly('49,18 60,41 85,43 67,58 74,83 50,68 27,84 32,58 13,43 38,40','#F5AD7A','#BC765E',4)+''.join(c(x,y,2,'#FFE0B7','none',0) for x,y in [(48,38),(44,51),(57,56),(42,65),(59,44)])
def bird():return p('M18 60Q24 30 52 34Q70 27 84 52l-15 3q-4 23-27 25-23-3-24-20Z','#81B7CC','#4F8194',4)+poly('70,50 88,57 70,62','#EBC77C','#B19055',3)+c(60,46,3,'#2E5162','none',0)
def frog():return e(50,62,29,23,'#8DC979','#478B66',4)+c(35,39,10,'#A9D889','#478B66',3)+c(64,39,10,'#A9D889','#478B66',3)+c(36,40,3,'#354C44','none',0)+c(64,40,3,'#354C44','none',0)+p('M40 68q10 9 20 0',stroke='#5D996F',w=3)
def person():return c(49,30,12,'#E8BD92','#A27D69',3)+p('M21 85q5-36 29-34 24-2 30 34Z','#79A6BE','#567E91',4)
def bread():return p('M16 40q-7-19 16-21 14-14 26 0 26-4 29 19v40H16Z','#DFAE73','#A47453',4)+p('M22 52h59v24H22Z','#F4D49D','#BA906B',3)
def cheese():return poly('16,73 64,35 86,53 86,80 16,80','#F4D17E','#D2A65E',4)+e(47,68,6,5,'#D9AB59','none',0)+c(70,59,4,'#D9AB59','none',0)+c(64,73,6,'#D9AB59','none',0)
def egg():return p('M50 19q21 0 25 37 4 24-25 26-29-1-25-26 6-37 25-37Z','#FFF5D7','#BAA88D',4)+e(42,40,7,13,'#FFFFFF','none',0)
def tomato():return c(50,54,25,'#EA6D65','#B8474E',4)+p('M50 30q-5-10-11-12l11 7 9-11-2 14 16-2-11 9-13-3Z','#77B47A','#488B63',3)+e(42,50,5,9,'#F7A59B','none',0)
def carrot():return p('M36 40Q51 36 65 44L50 85Q38 77 36 40Z','#F3AA68','#BB7547',4)+leaf(37,27,'#75B87C',-38)+leaf(63,26,'#75B87C',38)
def pizza():return poly('16,69 77,21 85,80','#F5CF85','#B27C56',4)+p('M20 69q27 7 63 9',stroke='#C7905F',w=7)+c(57,58,8,'#D66C60','none',0)+c(65,38,7,'#D66C60','none',0)+c(74,69,6,'#D66C60','none',0)
def bun():return p('M17 58q3-33 33-33t33 33Z','#EAB475','#B78254',4)+p('M17 59h66v21H17Z','#E2A66E','#B78254',3)
# Explicit per-item compositions: every V38 element selects a DIFFERENT semantically legible drawing.
SCENES={
'Volcano':hill()+p('M28 47h17l10 22 10-22h10',stroke='#CD675C',w=7)+p('M43 31q9-18-1-21m15 18q13-14 1-21',stroke='#B8ACAA',w=5),
'Insect':e(50,56,17,23,'#D6AC76','#8C6A5E',4)+c(50,30,12,'#D6AC76','#8C6A5E')+p('M31 45 16 34m16 23-19 0m21 11-17 13m50-36 16-11m-15 23h18M66 69l18 13M45 22 34 11m22 11 10-11',stroke='#8C6A5E',w=4)+c(46,28,2,'#41454E','none',0)+c(55,28,2,'#41454E','none',0),
'Bird':bird()+p('M39 51q10 5 19 0',stroke='#D3E8ED',w=4),
'Milk':milk()+p('M30 48h40',stroke='#B7D8E3',w=3),
'Sugar':r(21,36,57,47,'#F6F0E2','#C5B7A3',5,4)+poly('29,47 44,39 55,50 42,64','#FFFFFF','#D1C6B9',2)+poly('54,62 68,51 79,62 66,77','#FFFFFF','#D1C6B9',2),
'Salt':jar('#EAF3EE')+p('M39 48h22m-21 10h23',stroke='#CCD4D2',w=4)+sparkle(78,23),
'Lemon':e(50,54,30,20,'#F6CE61','#C5A146',4)+poly('18,52 8,43 19,38','#F4C95A','#C5A146',3)+poly('81,52 92,45 80,37','#F4C95A','#C5A146',3)+leaf(53,23,'#71B780',34),
'Ink':jar('#7283A4')+p('M50 67q-17-8 1-25 18 17-1 25Z','#C1D9E9','#4A668C',3),
'Herb':pot()+leaf(40,38,'#75BB86',-34)+leaf(60,33,'#9CC77D',36)+p('M50 50V21',stroke='#4D9770',w=4),
'Bean':e(52,53,24,31,'#B77F60','#825843',4)+p('M50 30q-23 21 0 44',stroke='#E2AD88',w=5)+sparkle(80,26),
'Cream':bowl('#F5ECE1')+p('M28 54Q18 42 36 40q-2-20 14-17 20-3 15 17 18 0 9 15Z','#FFF7EA','#D0BCAB',3),
'Spice':r(26,29,48,54,'#CB9269','#91674E',6,3)+r(23,22,54,12,'#E8C09A','#A37D62',3,3)+p('M32 56h37',stroke='#F6C18D',w=4)+c(49,67,7,'#A75B4A','none',0),
'Glacier':hill()+poly('15,65 43,25 65,61 80,41 97,83 40,83','#D6ECF4','#7CAEC5',3)+p('M44 35 38 60 54 71m25-19-10 16',stroke='#8EBBD1',w=4),
'Avalanche':hill()+p('M21 71q28-18 52-11l-27 17Z','#F5FAFD','#A6C6D2',3)+snowflake(67,48),
'Iceberg':water(70)+poly('16,68 40,23 49,39 61,16 80,70','#D2EFF7','#7EAABD',4)+p('M43 44l12 20m7-34L50 54',stroke='#98C7DB',w=4),
'Geyser':rock()+p('M51 53q-19-16-6-34m11 34q17-19 3-43M46 52l-16-15m28 15 15-19',stroke='#71C6DC',w=7)+c(50,13,6,'#C7EDF6','none',0),
'Hot Spring':rock()+water(70,'#70BED4')+steam(),
'Canyon':poly('7,34 37,26 46,60 56,35 92,25 92,81 7,81','#C78A63','#996B5A',4)+p('M8 45h28l12 30 14-27 30-8',stroke='#E6AF7E',w=6)+water(82,'#72B7C9'),
'Dew':leaf(49,54,'#7FC39C',25)+drop(68,45,'#98D7E7'),
'Frost':snowflake(49,46)+leaf(50,70,'#A7D5C0',-22),
'Hail':cloud()+c(23,73,7,'#AEDCE9','#7AB8C9')+c(47,79,7,'#D2EFF6','#7AB8C9')+c(69,68,7,'#AEDCE9','#7AB8C9'),
'Drought':sun(73,23)+p('M10 71 32 59 49 73 71 57 91 71M20 83l15-13 13 15 18-14 12 13',stroke='#BA916C',w=5),
'Oasis':p('M13 72q36-21 74 0l-5 10H19Z','#DDB879','#B38B61',4)+e(50,76,23,8,'#7CCBD8','#559EAF')+p('M23 69q0-33 17-48',stroke='#8B7B57',w=6)+leaf(29,27,'#77AF77',-52),
'Mirage':sun(73,28)+p('M12 79q19-11 36 0t40 0m-77-20q19-12 36 0t40 0',stroke='#C89A78',w=5)+p('M27 49q18-9 36 0',stroke='#A8D8DF',w=3),
'Delta':p('M51 10v30q-8 20-30 34m30-34q7 21 31 34M49 39l-4 42m9-31 10 31',stroke='#6EC4D6',w=9)+p('M12 85h77',stroke='#D8BE96',w=8),
'Estuary':p('M18 14q32 31 19 64m36-64Q46 44 63 79',stroke='#75B2D5',w=10)+water(81,'#70BDCF')+p('M15 48q6 8 16 3m55-2q-7 8-15 3',stroke='#B8CDA8',w=5),
'Current':wave()+p('M20 35q19-14 38 0h14m-8-10 11 10-11 10',stroke='#407DAB',w=5),
'Wave':p('M9 73q7-48 37-45 22 1 33 28 5 13 12 14-26 16-38-11-15-12-22 12Z','#72C7DA','#408CAB',4)+water(77),
'Whirlpool':e(50,51,37,30,'#9AD9E6','#5298B9',4)+p('M23 53q8-29 38-17 20 12 1 29-18 14-28-3 0-16 20-13 13 6-2 15',stroke='#4A8EAC',w=5),
'Tide Pool':rock()+e(50,67,30,14,'#86CBD7','#6196A9',3)+starfish().replace('49,18 60,41 85,43 67,58 74,83 50,68 27,84 32,58 13,43 38,40','50,49 54,58 65,58 56,65 59,75 50,70 41,75 44,65 35,58 46,58'),
'Starfish':starfish()+water(82),
'Sea Urchin':c(49,54,23,'#9982B4','#6A5C87',4)+''.join(p(f'M49 54l{dx} {dy}',stroke='#826DA2',w=5) for dx,dy in [(-30,-28),(0,-40),(31,-30),(40,0),(30,29),(0,38),(-33,28),(-39,0)])+c(42,52,3,'#ECE4F6','none',0)+c(59,52,3,'#ECE4F6','none',0),
'Jellyfish':p('M17 57q1-39 33-40 32 0 33 40Z','#B4A6DB','#7B79AC',4)+p('M18 55q10 11 21 0 11 12 22 0 10 12 22 0',stroke='#8F8EC5',w=4)+p('M30 58q-9 24 0 29m17-29q-4 22 3 30m18-31q11 22 0 30',stroke='#A19DD2',w=5),
'Squid':p('M50 12 26 50l15 7h18l16-7Z','#E09B83','#AE6D68',4)+e(50,53,13,17,'#E7AE98','#AE6D68',3)+p('M36 68q-19 18-5 21m16-20q-11 15 0 23m10-23q9 16 0 23m8-23q17 12 9 22',stroke='#C88982',w=5)+c(43,49,2.5,'#4A4355','none',0)+c(58,49,2.5,'#4A4355','none',0),
'Octopus':c(50,42,26,'#C98FA6','#916879',4)+p('M28 55q-26 0-18 25 12 15 20-3m-2-20q-9 21 7 30m8-23q-8 22 7 24m13-23q17 26 26 10m-3-18q21 4 14 22',stroke='#AD7996',w=8)+c(41,42,3,'#3D4356','none',0)+c(61,42,3,'#3D4356','none',0),
'Dolphin':p('M10 64q36-38 73-13l-13 14q-23-9-45 12Z','#8BB8CB','#557E9B',4)+poly('43,45 53,24 65,40','#78A9C2','#557E9B',3)+p('M13 64 6 43l20 8m40 14 16 18-24-5',stroke='#557E9B',w=5)+c(70,53,2.7,'#314B63','none',0),
'Shark':fish(45,53,'#8DAEBF')+poly('42,42 55,19 65,43','#7B9CA9','#537F93')+poly('74,48 90,32 90,72','#7B9CA9','#537F93')+p('M35 61l5 4 5-4 5 4 5-4',stroke='#E9EBEB',w=3),
'Crab':e(50,57,24,18,'#EF9C7B','#AD6457',4)+p('M28 49 14 39l-7 10m65 0 14-10 7 10M28 62l-18 8m21-1-12 15m49-22 18 8m-21 0 12 14',stroke='#BF7567',w=5)+c(39,51,4,'#FBE8D4','none',0)+c(60,51,4,'#FBE8D4','none',0)+c(39,51,2,'#474656','none',0)+c(60,51,2,'#474656','none',0),
'Lobster':e(49,56,15,25,'#CE786C','#9E5D61',4)+p('M50 75v15m-11-43-17-12m56 0-17 12',stroke='#BB6961',w=6)+c(19,30,12,'#DF8F75','#AC675E')+c(79,30,12,'#DF8F75','#AC675E')+p('M14 25v13m64-13v13m-53 35-12 11m62 0L62 73',stroke='#AD635C',w=4),
'Shrimp':p('M18 67q0-35 35-41 26 0 26 21-4 25-39 30Z','#F0B594','#AF7A68',4)+p('M27 58l17 11m-6-22 18 13m-8-23 17 11',stroke='#CF8F79',w=4)+c(66,39,3,'#424451','none',0)+p('M24 75l-8 12m19-11-4 13m10-13-1 11',stroke='#C78976',w=3),
'Sea Anemone':rock()+''.join(p(f'M50 73Q{cx} {cy} {tx} {ty}',stroke=col,w=6) for cx,cy,tx,ty,col in [(14,51,12,19,'#E49DA5'),(30,35,33,17,'#EFB3AA'),(46,44,51,14,'#D487A6'),(65,42,76,14,'#EFBEA7'),(86,51,90,25,'#E09DAC')]),
'Seaweed':water(82)+p('M30 82Q9 57 29 18M52 83Q32 41 57 19M73 83Q59 50 83 29',stroke='#529F7C',w=9)+leaf(30,49,'#83BD88',-65)+leaf(63,45,'#8CC7A0',60),
'Moss':rock()+''.join(c(x,yy,rr,'#8ABF79','#598D62',2) for x,yy,rr in [(28,54,9),(39,43,13),(56,49,14),(71,56,8)]),
'Lichen':rock()+''.join(c(x,yy,rr,col,'#799988',2) for x,yy,rr,col in [(35,56,10,'#B9CB86'),(53,52,11,'#A4CDA9'),(65,64,8,'#D2CA89')]),
'Sprinkler':p('M49 86V53m-14 1h30',stroke='#729D89',w=9)+p('M20 56Q22 30 49 29q28 0 31 26',stroke='#79C3D9',w=5)+''.join(drop(x,yy,'#79C3D9') for x,yy in [(20,49),(49,16),(81,47)]),
'Sapling':pot()+p('M49 48V23',stroke='#4A8C66',w=6)+leaf(36,25,'#90C67F',-50)+leaf(63,22,'#80B9A3',54),
'Vine':p('M54 87q-18-31-7-63',stroke='#4D976F',w=6)+leaf(31,37,'#79B580',-65)+leaf(65,47,'#A1D180',60)+leaf(47,17,'#72AF79',6),
'Ivy':p('M41 86q-17-18 11-56t17-17',stroke='#5B986D',w=6)+poly('19,48 37,37 47,53 37,69','#7DB77E','#568C65')+poly('52,24 64,11 76,30 60,39','#7EBE9C','#568C65')+poly('48,65 66,53 82,67 68,83','#A0CA83','#568C65'),
'Basil':pot()+leaf(38,33,'#7FC382',-30)+leaf(62,33,'#90C878',29)+leaf(50,18,'#6CAF80')+p('M50 46V18',stroke='#578F61',w=3),
'Mint':pot()+leaf(38,35,'#74D0A8',-45)+leaf(64,27,'#8DCFC2',45)+leaf(51,19,'#68B49A')+p('M50 48V20',stroke='#3D9877',w=3),
'Lavender':pot()+p('M50 47V20m-13 27-7-23m32 22 7-24',stroke='#719674',w=5)+''.join(e(x,y,6,11,'#A594D3','#8577AD',2) for x,y in [(50,16),(36,25),(65,23),(43,34),(58,35)]),
'Cactus':pot()+p('M43 45V22q0-14 12-14t12 14v36H43Zm0-2Q24 45 24 27m43 14q16 1 16-19', '#7AB988','#518F69',4)+p('M50 24v5m10 8v5m-5 15v5',stroke='#D7D58A',w=3),
'Succulent':pot()+''.join(p(d,'#9BCAA2','#6EAB92',2) for d in ['M50 48Q20 37 23 18q21 9 27 30Z','M50 48Q76 33 76 18 57 22 50 48Z','M50 48q-10-31 1-38 11 12-1 38Z']),
'Bonsai':r(25,72,50,12,'#B68F6C','#8D6D5B',4,3)+p('M53 73q-15-25 4-42',stroke='#8B6853',w=7)+p('M13 44q-4-22 23-25 19-20 34 1 24 2 16 24Z','#84B57E','#558B66',4)+p('M32 44q14 9 34 0',stroke='#A7CF98',w=4),
'Terrarium':jar('#B4E3D8')+rock().replace('23,81 14,63 30,46 52,48 63,37 82,54 86,80','28,76 36,62 45,69 56,57 69,75')+leaf(50,58,'#85BD76',-10),
'Pond':e(50,72,38,15,'#9CD5D7','#6BACC0',4)+leaf(37,58,'#7FC68D',-60)+c(66,73,5,'#C9E3EB','none',0),
'Frog':frog()+p('M18 84q10-12 18-5m27 0q10-8 18 5',stroke='#599D6C',w=4),
'Lotus':water(78)+flower(50,47,'#F0B8C6')+leaf(28,66,'#85BF80',-55)+leaf(70,69,'#9BCD93',60),
'Dragonfly':e(50,54,8,23,'#6BABC0','#467993',3)+e(29,43,18,10,'#C1E5E9','#8AB6C5',3)+e(70,43,18,10,'#C1E5E9','#8AB6C5',3)+e(33,61,15,8,'#DAEBE5','#8AB6C5',2)+e(67,61,15,8,'#DAEBE5','#8AB6C5',2)+c(50,30,8,'#7CA6C6','#527F9A'),
'Firefly':e(48,60,17,24,'#696A83','#555670',3)+e(48,67,12,12,'#F8D879','#C9A456',2)+c(49,33,13,'#8B809C','#615C82')+p('M38 23 28 13m34 11 10-11',stroke='#72739B',w=4)+sparkle(79,44)+sparkle(19,64),
'Cheese':cheese()+sparkle(77,22),
'Butter':r(20,45,61,29,'#F1D680','#BC9D59',4,4)+p('M26 47 42 29h54L80 45Z','#FFE9A5','#C5A36D',3),
'Egg':egg()+sparkle(76,25),
'Omelet':bowl('#7B8493')+e(50,55,29,15,'#F3C469','#C59250',3)+c(62,54,5,'#E89D70','none',0)+c(39,55,4,'#84AC6D','none',0),
'Pasta':bowl('#E7B89E')+p('M28 55q10-21 20-3t22 0q-4-23-25-15',stroke='#E5C474',w=6)+p('M33 62q19 15 35-1',stroke='#F0D995',w=5),
'Pizza':pizza()+sparkle(86,19),
'Tomato':tomato()+leaf(47,22,'#7CB56B',-20),
'Potato':e(49,55,32,24,'#D0AC7D','#AA845F',4)+c(40,49,4,'#AC895E','none',0)+c(64,59,4,'#AC895E','none',0)+c(46,70,3,'#AC895E','none',0),
'Carrot':carrot()+p('M46 65l8 2',stroke='#DA8754',w=4),
'Onion':p('M50 17q35 29 25 52-9 19-26 18Q16 84 23 58q3-20 27-41Z','#D9B18C','#A47C69',4)+p('M51 22q-27 37-3 62m8-61q22 29 6 59',stroke='#F2D1B0',w=5),
'Garlic':p('M49 18Q26 34 19 57q-5 26 31 30 34 0 31-27Q77 33 49 18Z','#F0E7DA','#AB9A94',4)+p('M50 23v61m-6-47Q23 67 40 81m19-45Q78 65 62 81',stroke='#D1C6B7',w=4),
'Chocolate':r(18,26,63,57,'#B47C65','#785447',3,4)+p('M39 26v57m21-57v57M18 54h63',stroke='#885B4A',w=5)+e(28,42,5,8,'#D69E87','none',0),
'Cocoa':c(50,49,30,'#B67C5D','#80543F',4)+p('M42 21q-12 25 0 57m16-56q12 27 0 56m-7-56v55',stroke='#D7A17A',w=4),
'Coffee':cup('#CDB1A0')+e(48,39,24,6,'#795447','none',0)+steam(),
'Cookie':c(50,54,29,'#DFB37D','#A98061',4)+''.join(c(x,y,rr,'#936048','none',0) for x,y,rr in [(36,40,5),(59,44,6),(48,60,5),(67,64,4),(30,63,3)]),
'Sandwich':p('M17 45q13-22 34-24 20 0 32 24v29H17Z','#EBC795','#A87F62',4)+p('M17 49h66v8H17Z','#89B477','#618B69',3)+p('M17 57h66v8H17Z','#D58F79','#9A675D',3)+p('M20 69h60',stroke='#F3DAA5',w=7),
'Lemonade':r(30,29,43,54,'#F1E7A5','#9FB9BA',4,3)+p('M34 43h35v30H34Z','#F7D87E','#E2BD6E',2)+p('M53 28 72 12',stroke='#8BC9C1',w=4)+e(76,24,14,14,'#F5D369','#C8A35B')+p('M74 10v28m-14-14h28',stroke='#FFF0AF',w=3),
'Ice Cream':p('M33 48 50 87 67 48Z','#DFAD78','#A17A58',4)+c(50,36,21,'#F4D6CA','#C99E99',3)+c(45,27,14,'#F9EBD8','#C7B3A1',3)+sparkle(75,18),
}
if __name__=='__main__':
 from subprocess import check_output
 js="import{ORGANIC_V38}from'./client/src/organic-pack-v38.js';console.log(JSON.stringify(ORGANIC_V38.items))"
 item_records=json.loads(check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
 names=[it['name'] for it in item_records]
 slug_by_name={it['name']:it['id'].split(':',1)[1] for it in item_records}
 assert set(names)==set(SCENES),(len(names),len(SCENES),'missing',set(names)-set(SCENES),'extra',set(SCENES)-set(names))
 output={}
 for name in names:
  svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="93" rx="35" ry="4" fill="#607883" opacity=".10"/>'+SCENES[name]+'</svg>'
  ET.fromstring(svg)
  assert len(svg)>300,(name,len(svg))
  output[name.lower()]=svg
 assert len(set(output.values()))==len(output)
 folder=ROOT/'client/assets/v38'
 folder.mkdir(parents=True,exist_ok=True)
 manifest=[]
 for name in names:
  slug=slug_by_name[name]
  svg=output[name.lower()]
  (folder/(slug+'.svg')).write_text(svg)
  manifest.append({'id':'organic38:'+slug,'name':name,'path':'client/assets/v38/'+slug+'.svg','sha256':hashlib.sha256(svg.encode()).hexdigest(),'embedded':True,'type':'unique-original-static-svg'})
 (ROOT/'shared/v38-art-manifest.json').write_text(json.dumps({'version':38,'icons':manifest},indent=2)+'\n')
 (ROOT/'client/src/organic-art-v38.js').write_text('export const ORGANIC_ART_V38 = '+json.dumps(output,separators=(',',':'),ensure_ascii=False)+';\n')
 print('V38 original SVG art',len(output),'unique, verified and bundled, size',sum(map(len,output.values())))
