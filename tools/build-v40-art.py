#!/usr/bin/env python3
"""Art-directed, bespoke 64-piece SVG set for V40: no emoji, no remote image, no common glyph fallback.
Hand-designed silhouettes share the gentle V38 pastel palette and 100x100 viewBox.
"""
from pathlib import Path
import sys,json,hashlib,xml.etree.ElementTree as ET,math
from importlib.machinery import SourceFileLoader
ROOT=Path(__file__).resolve().parents[1]
v38=SourceFileLoader('v38art',str(ROOT/'tools/build-v38-art.py')).load_module()
p,c,e,r,poly=v38.p,v38.c,v38.e,v38.r,v38.poly
water,leaf,flower,bird,rock,tree,fish,sun,cloud,snowflake,drop,sparkle=v38.water,v38.leaf,v38.flower,v38.bird,v38.rock,v38.tree,v38.fish,v38.sun,v38.cloud,v38.snowflake,v38.drop,v38.sparkle
ink='#586877';blue='#88CADC';teal='#72BAA4';gold='#EBC575';cream='#F8E5BF';purple='#B0A2D4';red='#E8A18F';brown='#B79071'
# Lightweight distinctive illustrated motifs, shared vocabulary rather than copied scenes.
def star(x,y,rad=10,col=gold):
 pts=[]
 for n in range(10):
  angle=(n*math.pi/5)-math.pi/2; rr=rad if n%2==0 else rad*.48
  pts.append(f'{x+math.cos(angle)*rr:.1f},{y+math.sin(angle)*rr:.1f}')
 return poly(' '.join(pts),col,'#BA9758',2)
def moon(x=50,y=45):
 return c(x,y,25,'#F6DA97','#B89C78',3)+c(x-11,y-6,6,'#E6C28D','none',0)+c(x+10,y+9,4,'#E5BE82','none',0)
def note(x=50,y=52,color='#B48CA9'):
 return e(x-6,y+15,8,6,color,'#765B7A',2)+p(f'M{x+1} {y+15}v-29l19 -6v30',stroke='#765B7A',w=4)+e(x+12,y+10,8,6,color,'#765B7A',2)
def gear(x=49,y=52,rad=26):
 pts=[]
 for i in range(24):
  a=-math.pi/2+i*math.pi/12;rr=rad+7 if i%3==0 else (rad+2 if i%3==1 else rad-5)
  pts.append(f'{x+math.cos(a)*rr:.1f},{y+math.sin(a)*rr:.1f}')
 return poly(' '.join(pts),'#B5C6CE','#748F9B',3)+c(x,y,11,'#F8F1E4','#748F9B',3)
def box(x,y,w,h,col='#D9B18C'):return r(x,y,w,h,col,'#98775F',5,3)
def animal_eye(x,y):return c(x,y,3,'#3C5364','none',0)+c(x-1,y-1,1,'#FFFFFF','none',0)
def waterline(y=82):return water(y,blue)
def stem(x=50,y=40):return p(f'M{x} {y}v42',stroke='#639B71',w=5)
def audience():return ''.join(c(x,83,6,'#8299B7','#62748C',2) for x in (19,37,55,73))
SCENES={
# Sky / cosmos
'Comet':star(72,38,17,'#F4C97D')+p('M60 34Q36 17 12 23Q34 28 50 43Q29 49 12 73Q44 66 61 47Z','#9FCEE4','#6FAAC7',3)+sparkle(21,15),
'Meteor':p('M13 17 47 46M19 8l30 29M8 34l34 20',stroke='#F2B079',w=7)+rock()+star(71,59,12,'#F0B986'),
'Meteorite':rock()+p('M19 54q-9-22-5-28M38 46 24 15',stroke='#F5AF79',w=5)+c(51,64,7,'#897A85','none',0)+sparkle(77,25),
'Orbit':e(49,53,44,19,'none','#89B7C8',3)+e(49,53,20,37,'none','#BAC3D7',3)+c(50,52,13,'#B7B6DE','#777EAB',3)+c(88,45,6,'#F1C176','#B99A5A',2),
'Satellite':r(38,37,26,26,'#B8CAD6','#6F92A7',4)+r(7,36,27,28,'#7AAFCB','#557A99',2)+r(67,36,27,28,'#7AAFCB','#557A99',2)+p('M20 37v27m60-27v27M7 50h27m33 0h27',stroke='#C6EBF0',w=2)+p('M50 36V19h23',stroke='#78869D',w=4)+c(73,20,5,'#EFCB7F','#B69B67',2),
'Nebula':cloud(34,49)+cloud(64,46)+p('M12 67Q35 83 50 63T90 65',stroke='#B9A1D4',w=10)+star(55,30)+star(25,69,8,'#B5CBE2'),
'Eclipse':c(50,48,30,'#F1D48F','#C6A05A',3)+c(58,45,26,'#586479','#404C66',3)+p('M15 43q5-34 38-35M83 68q-4 24-25 25',stroke='#EBC478',w=4),
'Constellation':p('M17 70 32 26 52 45 77 17 85 76 52 45 17 70',stroke='#8EADCB',w=3)+''.join(star(x,y,8,'#F0D3A0') for x,y in [(17,70),(32,26),(52,45),(77,17),(85,76)]),
'Aurora':p('M13 18Q29 40 15 75M29 9Q47 39 32 84M49 15Q72 37 55 86M73 15Q89 47 79 80',stroke='#7BCBA8',w=10)+p('M22 22Q49 5 85 30',stroke='#B09FD7',w=7)+star(74,72,7),
'Supernova':star(51,48,32,'#F7C87B')+''.join(p(f'M51 48l{dx} {dy}',stroke='#E3A071',w=4) for dx,dy in [(-43,-38),(0,-45),(38,-39),(44,0),(33,35),(0,44),(-37,38),(-44,0)])+c(51,48,12,'#FFF4D2','#DAA764',3),
'Asteroid':poly('14,50 31,24 65,19 87,41 79,75 51,86 19,75','#B1A49E','#7F838E',4)+c(36,43,9,'#928B91','none',0)+c(66,59,7,'#8D8B91','none',0)+c(50,72,4,'#D3C8B9','none',0),
'Observatory':r(18,59,66,26,'#C8B9AE','#8B8892',4)+p('M25 60Q25 20 50 20T76 60Z','#A6BCD1','#6D8FA5',4)+p('M50 23v37M18 60h66',stroke='#E5ECED',w=4)+p('M51 29l28-18 6 13-30 19Z','#728BA9','#566C8E',3),
'Moonlight':moon(37,33)+water(78,'#9CB7D5')+p('M35 61 45 76 56 61 65 82 77 64',stroke='#EAD6A0',w=6)+star(80,19,7),
'Solar System':c(48,50,15,'#F3C770','#C7A058',3)+e(48,50,42,17,'none','#8AA8C0',2)+e(48,50,27,38,'none','#B4B4D2',2)+c(14,48,6,'#8EC7C3','none',0)+c(69,20,7,'#D6A0A4','none',0)+c(77,65,5,'#9EC4DD','none',0),
'Exoplanet':c(46,51,27,'#99B9D0','#638FA9',4)+p('M22 48q28-15 48 9m-46 6q24-15 47 7',stroke='#75C3B5',w=7)+e(51,50,45,12,'none','#D1BA83',3)+star(78,23,8),
'Black Hole':e(50,52,42,21,'none','#C6ABD2',9)+e(50,52,35,15,'none','#F3B67A',5)+c(50,52,23,'#333948','#333948',2)+p('M18 69Q45 88 81 66',stroke='#B7A8D4',w=4),
# Woodland
'Nest':e(50,72,39,16,'#B99574','#886F62',4)+p('M19 70l59 10M18 80l63-12m-47 20 43-22',stroke='#A27760',w=5)+e(39,54,11,14,'#F6E7C9','#AFA28A')+e(61,55,11,13,'#E4D9BD','#AB9B88'),
'Squirrel':e(45,63,21,22,'#C68C68','#96694F',4)+p('M51 66Q90 66 81 34 72 8 56 22q16 12 4 25',stroke='#BD805D',w=16)+c(40,35,15,'#D2A079','#96694F')+animal_eye(36,32)+poly('45,27 54,14 51,37','#CB9373','#96694F')+c(27,38,4,'#AA7064','none',0),
'Fox':poly('20,49 26,13 46,34 69,17 81,55 51,84 20,49','#E8A173','#A76E55',4)+poly('34,55 49,72 64,54 52,86','#FBEDD5','#CDAA8D',2)+animal_eye(37,49)+animal_eye(64,49)+c(50,67,4,'#473F48','none',0),
'Owl':e(50,58,31,34,'#BFA48D','#8F756A',4)+poly('22,37 23,14 41,31 59,31 77,14 77,38','#BBA38E','#8F756A',3)+c(39,48,12,'#FBEDD9','#987F76')+c(62,48,12,'#FBEDD9','#987F76')+animal_eye(39,47)+animal_eye(62,47)+poly('50,53 44,65 56,65','#E6B975','#B48A61'),
'Hedgehog':p('M16 64 22 37 32 42 38 20 50 35 61 17 69 39 82 33 80 58Q93 84 51 85 21 82 16 64Z','#B6A090','#7A726F',4)+p('M51 56q25-17 32 12-2 21-36 17Z','#D6BBA3','#9A8076',3)+animal_eye(70,65),
'Deer':e(48,58,20,25,'#CBA67E','#8D6C5A',4)+p('M32 32 17 14m17 15-2-24m18 27 17-22m-15 19 2-23',stroke='#A78662',w=5)+e(33,42,9,14,'#D9B390','#9F7866')+e(65,42,9,14,'#D9B390','#9F7866')+animal_eye(42,56)+animal_eye(56,56)+e(49,70,9,6,'#E9C7AA','none',0),
'Feather':p('M21 83Q13 42 46 21q34-24 39-10 7 37-21 56Q45 79 21 83Z','#9BD0D3','#659DAE',4)+p('M21 84 71 25M37 65l-2-29m14 18 17 3',stroke='#6D9CAE',w=4),
'Pinecone':p('M50 18Q10 39 28 72q16 27 39 0Q88 39 50 18Z','#BD926F','#856754',4)+''.join(poly(f'{x-9},{y-4} {x},{y+10} {x+9},{y-4}', '#A67859','#805E4D',2) for x,y in [(49,31),(37,45),(60,45),(48,60),(37,71),(60,72)])+leaf(48,16,'#7DB58B',10),
'Woodpecker':p('M30 15v75',stroke='#98735A',w=15)+bird().replace('M18 60Q24 30 52 34Q70 27 84 52l-15 3q-4 23-27 25-23-3-24-20Z','M40 53Q43 28 65 29 81 29 84 50l-14 12Q52 70 40 53Z')+poly('80,46 95,51 79,55','#E9B66D','#A98257')+c(67,41,3,'#3C5261','none',0),
'Canopy':p('M19 74v14m30-12v12m30-15v15',stroke='#8E6D55',w=10)+''.join(c(x,49,23,col,'#659872',3) for x,col in [(23,'#8CC195'),(49,'#9ECD9F'),(76,'#79BA97')])+p('M8 81h84',stroke='#BDA789',w=4),
'Burrow':p('M7 74Q45 14 92 75v14H7Z','#CEB290','#A58A72',4)+e(51,78,21,18,'#564C4B','#7B6054',4)+c(33,43,5,'#DBCA9D','none',0)+leaf(75,44,'#83B68B',45),
'Spider':c(52,57,20,'#A29EB9','#6C718F',4)+c(50,36,13,'#BBB5D0','#6C718F')+''.join(p(f'M{37 if i<4 else 66} {45+((i%4)*9)}L{8 if i<4 else 91} {27+((i%4)*16)}',stroke='#726E91',w=4) for i in range(8))+animal_eye(46,34)+animal_eye(56,34),
'Spiderweb':''.join(e(50,52,rad,rad*.7,'none','#9BA8C2',2) for rad in (16,28,41))+''.join(p(f'M50 52L{x} {y}',stroke='#9BA8C2',w=2) for x,y in [(9,50),(91,50),(50,13),(50,91),(20,23),(80,23),(19,79),(80,79)])+c(50,52,4,'#C0B4CD','none',0),
'Beaver':e(48,65,27,18,'#B88A6D','#805E51',4)+e(67,48,16,14,'#C59C7A','#805E51')+e(15,69,17,8,'#8B6A5D','#6B5550',3)+animal_eye(72,45)+r(73,58,5,12,'#F0E6D5','#A5A093',1,1),
'Beaver Dam':waterline(79)+''.join(p(f'M{x} 48l{15 if i%2 else -13} 34',stroke='#A67D61',w=9) for i,x in enumerate((20,34,49,64,79)))+p('M15 62q37-9 74 0',stroke='#CEAA7F',w=5)+leaf(80,37,'#72AB80',38),
'Wetland':waterline(74)+p('M16 78V31m-3 19 12-7M79 77V26m0 20 11-10',stroke='#739E6C',w=6)+e(16,27,6,17,'#D3B782','#9F855F',2)+e(79,23,6,15,'#D3B782','#9F855F',2)+c(49,67,8,'#98C885','#649B73',2),
# Music
'Rhythm':note(48,40)+p('M13 74h13v-17h13v28h13V58h13v17h18',stroke='#AE8EB1',w=5),
'Beat':p('M7 53h18l9-18 11 34 10-23 8 8h28',stroke='#E38B82',w=5)+c(49,50,34,'none','#BBA6B6',2)+star(77,21,8),
'Harmony':note(32,49,'#8EA9CD')+note(66,36,'#CC9DB5')+p('M17 79q35-13 68 0',stroke='#97BEA9',w=5),
'Chord':r(15,38,70,39,'#F7EAD8','#9C8C85',4)+''.join(r(x,38,9,24,'#70758E','#555F72',1,1) for x in (27,43,58,74))+note(53,15,'#DDAA85'),
'Drum':e(50,34,27,12,'#F4D3A0','#AE856A',3)+p('M23 34v37q27 19 54 0V34', '#D9AC83','#9A755C',4)+p('M26 45 72 71M74 44 27 71',stroke='#F9E5BF',w=3)+p('M17 17 34 35M82 15 63 35',stroke='#A58B79',w=5),
'Violin':e(46,59,17,18,'#CC956F','#875F50',4)+e(51,37,12,14,'#DFAF7D','#875F50',3)+p('M49 25v-18m-1 29v42M32 75l37-51',stroke='#896B59',w=5)+p('M59 12l20 71',stroke='#C4A08D',w=3),
'Flute':p('M22 77 77 20',stroke='#D7B78D',w=13)+p('M22 77 77 20',stroke='#9A8E7C',w=2)+''.join(c(x,y,3,'#BBA186','none',0) for x,y in [(36,63),(44,55),(52,47),(60,39)])+note(77,65,'#A6B7D5'),
'Harp':p('M23 82Q50 8 73 18l8 64Z','#D0A37E','#8D7266',5)+p('M28 80h50',stroke='#A47B63',w=7)+''.join(p(f'M{x} 34v42',stroke='#D9C7AE',w=2) for x in range(38,75,8)),
'Concert':p('M8 19h84v51H8Z','#A7A5C7','#6B7697',4)+p('M28 50q20-41 43 0',stroke='#F3D086',w=7)+note(52,28,'#EBC1A4')+audience(),
'Choir':''.join(c(x,34,10,col,'#837E8A',2) for x,col in [(27,'#EAC9AD'),(50,'#D5B190'),(73,'#F0D7B9')])+''.join(p(f'M{x-14} 75q1-28 14-27t14 27Z',col,'#72899F',2) for x,col in [(27,'#9BB9C9'),(50,'#C5A4C5'),(73,'#A5C4B2')])+note(73,15,'#E5B883'),
'Vinyl':c(50,50,36,'#6A7083','#4D5368',4)+''.join(c(50,50,rad,'none','#929AAF',2) for rad in (18,28))+c(50,50,13,'#D1A6A8','#806C85',2)+c(50,50,4,'#F5E7CE','none',0),
'Amplifier':r(19,23,63,62,'#897C80','#645D68',5,4)+r(25,29,51,17,'#B7B6C4','#7A7F96',3)+c(51,67,15,'#B5A7BC','#625C75',4)+c(32,36,3,'#DBB77E','none',0)+p('M89 45q8 11 0 22',stroke='#7DBBC1',w=4),
'Synthesizer':r(13,29,75,52,'#9099B6','#69718F',6,4)+r(20,52,61,23,'#F2F0E8','#A5A5AA',2)+''.join(r(x,53,6,12,'#65728E','#58617A',1,1) for x in (29,41,53,66,77))+''.join(c(x,40,4,'#E6B58E','none',0) for x in (28,46,65,79)),
'Metronome':poly('42,15 58,15 73,79 27,79','#BDA3A1','#826E79',4)+p('M50 65 68 25',stroke='#E6CB9D',w=4)+c(63,35,6,'#F5D1A1','#AC9076',2)+p('M23 83h54',stroke='#6D758C',w=6),
'Sheet Music':r(21,11,59,77,'#F9F2E5','#B9B3A3',3,3)+''.join(p(f'M28 {y}h44',stroke='#B7B4B1',w=2) for y in (34,42,50,58,66))+note(53,42,'#A38EA9')+c(33,24,3,'#D8B483','none',0),
'Music Box':box(19,41,62,41,'#CDA57F')+r(19,39,62,12,'#EDD1AD','#967565',3,3)+note(51,20,'#B397C4')+p('M75 61h15m-7-8v17',stroke='#73899C',w=4),
# Engineering / craft
'Gear':gear()+sparkle(82,18),
'Motor':r(24,32,50,43,'#A8C0CB','#698E9D',10,4)+p('M18 47h-9v13h15M74 49h16v10H74',stroke='#B08D76',w=6)+p('M37 39v30m12-30v30m12-30v30',stroke='#DDE8E7',w=3),
'Generator':r(24,28,51,52,'#BDD1C9','#719B96',5,4)+''.join(p(f'M{x} 37q10 9 0 18',stroke='#B79272',w=4) for x in (31,44,57))+p('M51 57 43 70h13l-6 12',stroke='#E7C46A',w=5),
'Turbine':c(49,51,11,'#D7D7CA','#7B97A8',3)+''.join(p(d,'#A0C5D5','#669BB4',3) for d in ['M49 44 20 19q-9 24 24 33Z','M57 52 77 22q15 25-20 33Z','M48 60 36 89q31 2 22-29Z'])+p('M49 63v27',stroke='#789EAC',w=6),
'Workshop':p('M14 43 48 17 86 43v43H14Z','#D5BC9F','#927960',4)+r(37,57,27,30,'#9F7C6A','#796358',2)+p('M30 37l18 19m-17-2 21-21',stroke='#778C9C',w=5)+c(69,37,5,'#E5C87E','none',0),
'Blueprint':r(19,15,64,69,'#79A7CA','#547C9E',4,3)+p('M29 70V35h17v15h21v20ZM27 28h43m-36 8 10 12m8-19h12',stroke='#E1F1EF',w=3)+c(29,70,3,'#EFF5F4','none',0),
'Conveyor Belt':r(12,48,75,22,'#A5ADB6','#738493',10,4)+''.join(c(x,60,5,'#DCE3E2','#8295A1',2) for x in (24,42,60,78))+box(31,25,27,23)+p('M47 27v17',stroke='#EBD8BC',w=3),
'3D Printer':r(19,17,64,69,'none','#7796A8',2,5)+p('M25 75h52M29 24h44M49 26v22',stroke='#8CABB5',w=5)+r(38,49,27,22,'#E3AC89','#B7876B',3,3)+r(40,25,18,9,'#A5B5C4','#6D8399',2,2)+p('M39 59h24',stroke='#F4D3AB',w=3),
'Bicycle':c(24,73,18,'none','#769FAD',4)+c(78,73,18,'none','#769FAD',4)+p('M24 73 47 73 35 46 62 46 78 73H47L35 46m12 27 14-18',stroke='#B18C78',w=5)+p('M29 45h15m16 0 9-8',stroke='#687E8C',w=4),
'Windmill':p('M41 87 49 42 57 87Z','#D6BFA5','#937C69',4)+c(49,40,7,'#DDBA83','#9E836E',3)+''.join(p(d,'#A8C8C3','#6B9A9C',3) for d in ['M46 37 30 8l9-4 16 32Z','M53 36 83 20l5 10-33 14Z','M54 45 69 82l-11 5-13-40Z','M44 45 11 65l-4-11 36-17Z'])+p('M10 90h80',stroke='#89B28B',w=4),
'Watermill':p('M17 40 40 23 61 40v43H17Z','#CBAF92','#917763',4)+c(72,62,20,'#B8A28D','#8B7F7A',4)+''.join(p(f'M72 62l{math.cos(a)*18:.1f} {math.sin(a)*18:.1f}',stroke='#897A76',w=4) for a in [i*math.pi/3 for i in range(6)])+waterline(83),
'Piston':r(37,21,28,54,'#B7BCC3','#777F8D',3,4)+p('M29 30h44m-23 45v16',stroke='#778B9E',w=8)+r(43,37,16,22,'#E9D0AA','#A99A85',3,2)+p('M34 22h34',stroke='#D3DFDB',w=5),
'Gearbox':r(13,26,74,57,'#CED1CF','#88949B',5,3)+gear(39,51,17)+gear(66,58,14)+r(22,76,56,7,'#7D8C93','#7D8C93',2),
'Kiln':p('M21 34Q20 14 51 14T79 34v49H21Z','#D6B5A3','#A17E71',4)+r(33,40,37,35,'#7D6867','#806766',7)+p('M38 72Q31 60 49 43q1 18 11 19 3-13 3-13 11 26-9 26Z','#F1AE6D','#CB795B',2)+p('M23 35h55',stroke='#EED7BD',w=4),
'Pottery':p('M32 22h38v10q-8 8-5 16 19 24 6 35H28q-15-15 7-36 4-9-3-15Z','#D7A783','#A77D68',4)+p('M30 67h41m-38-19h34m-33-26h34',stroke='#EECFB0',w=4),
'Ceramic':p('M40 16h23l-3 22q29 14 12 46H25q-13-27 17-46Z','#D3E4E3','#82AEB7',4)+p('M27 66q22-12 45 0M37 44q19 14 31-1',stroke='#9DC4CA',w=4)+sparkle(80,20),
}
if __name__=='__main__':
 import re
 source=(ROOT/'client/src/organic-pack-v40.js').read_text(encoding='utf8')
 items=json.loads(source.split(' = ',1)[1].rstrip(';\n'))['items']
 names={x['name'] for x in items}
 assert names==set(SCENES),('Missing',names-set(SCENES),'Extra',set(SCENES)-names)
 output={}
 manifest=[]
 (ROOT/'client/assets/v40').mkdir(exist_ok=True)
 for row in items:
  name=row['name'];slug=row['id'].split(':',1)[1]
  svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="94" rx="35" ry="4" fill="#607883" opacity=".10"/>'+SCENES[name]+'</svg>'
  ET.fromstring(svg)
  assert len(svg)>300,(name,len(svg))
  output[name.lower()]=svg
  (ROOT/'client/assets/v40'/f'{slug}.svg').write_text(svg,encoding='utf-8')
  manifest.append({'id':row['id'],'name':name,'path':f'client/assets/v40/{slug}.svg','sha256':hashlib.sha256(svg.encode()).hexdigest()})
 assert len(set(output.values()))==len(output)
 (ROOT/'client/src/organic-art-v40.js').write_text('export const ORGANIC_ART_V40 = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
 (ROOT/'shared/v40-art-manifest.json').write_text(json.dumps({'version':40,'icons':manifest},indent=2)+'\n')
 print('V40 original icons',len(output),'sum bytes',sum(map(len,output.values())))
