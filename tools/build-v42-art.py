#!/usr/bin/env python3
"""V42: distinct hand-composed, static and offline 100x100 SVG art for every new concept."""
from pathlib import Path
from importlib.machinery import SourceFileLoader
import json, hashlib, xml.etree.ElementTree as ET, math
R=Path(__file__).resolve().parents[1]
v=SourceFileLoader('v38',str(R/'tools/build-v38-art.py')).load_module()
p,c,e,r,poly=v.p,v.c,v.e,v.r,v.poly
water,sun,cloud,leaf,flower,fish,rock,tree,drop,starfish,sparkle,steam=v.water,v.sun,v.cloud,v.leaf,v.flower,v.fish,v.rock,v.tree,v.drop,v.starfish,v.sparkle,v.steam
INK='#657585'; SAND='#D6B69A'; LILAC='#B6A7D6'; SKY='#93C5D8'; MINT='#8FC3A8'; TEAL='#6BAEAF'; CORAL='#E69C89'; HONEY='#E7BE76'; WOOD='#B58E73'; STEEL='#A9BAC3'; CREAM='#F6E9C9'
def L(d,col=INK,w=3):return p(d,stroke=col,w=w)
def P(d,color=SAND,stroke=INK,w=3):return p(d,color,stroke,w)
def B(x,y,w,h,color,rad=4):return r(x,y,w,h,color,INK,rad,3)
def grain():return ''.join(c(x,y,2,'#8D847A','none',0) for x,y in ((29,61),(42,53),(63,67),(72,49),(47,77)))
def crust():return L('M24 63q23 10 53 0','#D49A5A',4)
def glass():return B(24,23,53,61,'#D1EAF0',8)+L('M31 33v27','#F4FBFC',5)
def mount():return poly('12,81 46,19 66,57 76,38 92,81','#B6ACA6','#7B8087',4)
def pot():return P('M26 45h48l-7 38H33Z','#CBA685','#957D70',4)
def pan():return e(45,61,29,15,'#6F8297','#4D667D',4)+L('M73 62l20-9','#7E8290',8)
def camera():return B(17,31,68,49,'#B7BDC8',9)+B(30,22,25,12,'#8C9DAE',4)+c(51,55,20,'#DFEAF0','#6E91A6',4)+c(51,55,11,'#8EAFBE','#54758C',3)+c(73,41,4,'#F6D38E','none',0)
def butterfly():return e(37,52,18,22,'#B0D3BA','#729B89',3)+e(63,52,18,22,'#B0D3BA','#729B89',3)+e(50,55,7,25,'#728F83','#54766D',3)+L('M48 32l-10-15m14 15 10-15','#7F9390',2)
def reeds():return L('M26 82V26M47 86V19M70 84V30','#689E7C',5)+e(26,27,5,15,'#C2A378','#957F64',2)+e(47,18,5,13,'#CCB18A','#957F64',2)+e(70,31,5,16,'#BD9B76','#957F64',2)
def noodle():return ''.join(L(f'M{x} 40q-14 15 1 30t0 10','#EBC27B',4) for x in (29,42,55,68))
def bread():return P('M18 65q-3-31 29-31 35-2 36 31v15H18Z','#E3B47A','#AC7B58',4)+crust()
def petal(x,y,col):return e(x,y,8,16,col,'#C995A6',2)
def actor():return c(50,32,13,'#E6BD9D','#B78D7C',3)+P('M26 80q3-31 24-31t25 31Z','#8FA5B9','#688398',3)
def filmstrip():return B(19,29,62,43,'#454C63',5)+r(27,37,47,27,'#A7C8D6','#697B94',2,2)+''.join(r(x,y,5,5,'#EDE0BF','none',1,0) for x in (23,72) for y in (34,45,56,65))
def lens():return c(50,51,34,'#D6D9E6','#8B93AF',4)+c(50,51,23,'#8BB5CC','#608DAA',4)+c(50,51,11,'#D1EBEE','#739BAF',3)+c(42,42,4,'#F5FAFC','none',0)
def pin():return P('M50 12q23 0 23 23 0 16-23 41Q27 51 27 35q0-23 23-23Z',CORAL,'#A67C77',3)+c(50,35,9,'#FFE6CF','#B28A78',3)
def light():return sun(64,24)+L('M20 78l42-42','#F0D492',6)
def mountainrock(fill=SAND):return poly('18,76 29,42 50,37 67,49 81,75',fill,'#9B8980',4)
SCENES={
# Cave geology
'Stalactite':P('M10 16h80v12H67l-8 43-12-37-9 51-12-55H10Z','#C0AE9C','#8E827C',4)+drop(71,72,SKY),
'Stalagmite':mountainrock('#B7A79A')+P('M32 83 51 34 67 83Z','#D4C4AB','#93887B',4)+L('M51 44l-5 25','#F4E0C5',3),
'Geode':poly('50,11 84,33 80,74 52,91 16,72 12,34','#B79D95','#837F89',4)+poly('49,23 71,36 69,68 50,76 28,66 26,39','#B7A5D9','#7E83B6',3)+c(49,51,15,'#E7DEF6','#A298C8',3)+sparkle(79,20),
'Obsidian':poly('49,8 80,34 67,83 29,83 16,49','#414F62','#323D50',4)+poly('50,14 66,34 53,74 38,75','#7184A0','none',0)+L('M50 14 52 73','#D9D7E8',2)+sparkle(78,21),
'Basalt':poly('17,42 47,19 80,42 79,78 21,80','#606E78','#525D6C',4)+L('M17 43l31 24 32-25M47 67v12','#8D9BA0',4)+c(65,54,4,'#A7AFAD','none',0),
'Granite':mountainrock('#B9B8B4')+grain()+c(57,39,4,'#EDE6DA','none',0)+c(37,66,4,'#8294A0','none',0)+c(75,66,3,'#A3A0B0','none',0),
'Limestone':mountainrock('#E3D3B6')+L('M22 67h53m-38-13h31M35 45h23','#B6A18B',4)+P('M46 64q-12-6 2-16 14-6 14 6t-9 10','#C59E7C','#987F72',2),
'Marble':B(20,20,61,64,'#E5DDD6',9)+L('M22 50q19-27 34-4t26 0M23 72q24-22 36-3t23-4','#AAA6B0',4)+sparkle(77,14),
'Erosion':mountainrock('#C9AE8F')+L('M26 50q23 3 30 12l24 12','#E0C4A3',7)+water(83,'#84C4D6'),
'Sediment':water(40)+P('M14 72q23-20 39-8t33 8v12H14Z','#CCA785','#AD8D7E',3)+grain(),
'Amber':P('M50 14Q84 27 78 65q-5 27-35 19Q12 73 20 43q5-25 30-29Z','#E4AE58','#AD8353',4)+e(50,52,10,16,'#B97C52','#9D694E',2)+L('M49 35v31m-6-25-8-8m21 10 9-9','#AD7252',3)+sparkle(74,27),
'Quartzite':poly('52,11 76,41 66,78 33,90 18,47','#E4D3DC','#9B93A5',4)+poly('52,11 52,75 18,47','#C2B1C6','#A39BAF',3)+L('M76 41 52 75 33 90','#F5E9EA',4),
'Pumice':mountainrock('#D7BEA9')+''.join(c(x,y,rad,'#A68F82','none',0) for x,y,rad in [(35,55,6),(56,45,5),(49,72,8),(71,65,4),(28,76,3)])+sparkle(79,24),
'Magma Chamber':mount()+P('M30 80q1-25 19-27t22 27Z','#EFA26F','#B56659',3)+L('M49 51v-24m0 25 13-12','#DC8267',7)+sparkle(77,18),
'Fault Line':poly('11,34 46,24 82,34 90,79 11,82','#C5B3A3','#968D80',4)+L('M50 22 44 44l13 9-15 32','#BD776C',6)+L('M17 56h24m20-4h21','#E4CEB4',4),
'Rock Cycle':c(50,50,31,'#EBDED0','#A29A95',3)+L('M51 19q29 1 29 31m-7-12 7 12 8-7M80 50q-6 30-30 31m11-8-11 8 8 8M50 81Q21 79 20 50m-9 8 9-8-9-8M20 50q1-28 30-31m-10-8 10 8-7 9','#9D9DA0',3)+c(50,50,10,'#AC9F9B','#817B7B',2),
# Wetland ecology
'Mangrove':L('M49 41v40m-2-14-21 20m24-23 23 19m-23-34-12 32','#9F7A63',7)+P('M15 45q-9-28 21-28 22-21 37 1 23-2 20 24Z',MINT,'#62987E',3)+water(84),
'Otter':e(50,62,25,14,'#B89275','#806954',3)+c(30,53,13,'#BE9A7B','#806954',3)+e(29,59,7,5,'#E0C0A0','none',0)+c(25,52,2.5,'#364A54','none',0)+L('M69 62q15-21 22-9','#8B745F',7)+water(85),
'Heron':L('M50 61 34 87m19-26 14 26','#A58473',4)+P('M34 63q-11-24 15-29 22-1 21 19l-17 13Z','#9AC3C5','#728F97',3)+L('M51 39q12-12 3-26','#88ADB0',7)+c(55,12,7,'#AFD1CF','#738F98',2)+poly('60,13 81,19 60,21',HONEY,'#B6956C',2)+water(89),
'Tadpole':e(45,49,23,18,'#839C98','#627A77',3)+P('M63 49Q90 35 89 65q-13-8-25 0','#A1BAB1','#779089',3)+c(35,45,3,'#344D53','none',0)+water(87),
'Newt':e(50,53,12,26,'#D69D74','#AC7766',3)+c(50,25,15,'#D69D74','#AC7766',3)+L('M45 50 24 34m31 16 19-16M43 70 24 81m34-12 19 13m-26 5 8-9','#AC7967',5)+c(44,25,2,'#3C4952','none',0)+c(57,25,2,'#3C4952','none',0),
'Marsh':water(77)+reeds()+sun(79,18),
'Bog':e(50,74,38,12,'#938B79','#6E7F73',3)+''.join(c(x,yy,rad,MINT,'#679A7E',2) for x,yy,rad in [(29,55,12),(52,51,14),(71,59,11)])+water(86),
'Lagoon':water(66)+poly('12,78 30,46 43,71 78,46 92,78','#D6BE92','#A7937C',3)+e(53,73,24,9,'#7EC5D0','#5BA2B4',3)+sun(72,19),
'Clam':P('M18 67q2-37 32-39 35-3 34 39Z','#D6B6C7','#A5879E',3)+L('M18 67h66M50 30v37m-15-33 5 33m28-33-5 33','#F0D7E0',3)+c(50,60,6,'#F9EEDF','#C3B39C',2),
'Mussel':P('M50 12Q79 48 64 82 41 94 29 76 18 54 50 12Z','#566A82','#41576E',4)+L('M45 26q-12 35-6 49m18-43q10 29 1 44','#90A2B6',3)+sparkle(71,24),
'Kelp':water(86)+L('M50 85q-25-27-7-68','#5B9E77',6)+''.join(leaf(x,y,'#8FC29B',rot) for x,y,rot in [(32,58,-35),(61,41,44),(43,25,-23)])+fish(72,72,'#E2B986'),
'Reef':P('M10 81q18-23 32-10t25-12q17 3 21 22Z','#CAA69A','#97877F',3)+''.join(L(f'M{x} 75l-5-26m5 17 13-17',col,5) for x,col in [(26,CORAL),(49,LILAC),(74,MINT)])+water(88),
'Coral':P('M46 87V29m0 25L25 38m21 26 23-24M27 39V21m43 20 5-21',CORAL,'#B86F76',8)+water(89),
'Lily Pad':e(51,68,32,18,'#8EC88B','#5E9B78',3)+poly('51,66 79,51 69,78','#9FD2C0','none',0)+flower(46,40,'#E5B9D0')+water(87),
'Reed':reeds()+water(86),
'Salt Marsh':P('M11 77q18-16 39-7 16-10 39 3v15H11Z','#D9C6A0','#9C9B82',3)+water(83)+''.join(L(f'M{x} 72q-6-17-1-29m1 29q8-19 13-21','#76A989',3) for x in (23,49,73))+c(27,40,5,'#F4E8D5','none',0),
# Bakery
'Yeast':e(37,48,20,24,'#D3B88B','#A48D70',3)+e(68,68,18,14,'#E8D4A9','#A48D70',3)+c(27,40,5,'#EEE4C7','none',0)+c(56,69,5,'#F7EBC9','none',0)+sparkle(73,23),
'Croissant':P('M14 71Q13 28 50 29q38-3 37 42L69 62q-7-20-19-20T30 63Z','#E7B276','#AA7D59',4)+L('M32 50l-9-9m46 8 11-11M40 36l-6-12m23 13 5-13','#F8D397',4),
'Bagel':e(50,54,35,30,'#D8A877','#AF7C58',4)+e(50,55,14,12,'#F8F2E8','#AF7C58',3)+''.join(c(x,y,2,'#F7E1B4','none',0) for x,y in [(30,40),(68,45),(32,68),(66,69)])+sparkle(84,16),
'Pretzel':L('M29 38q-15 6-4 25 11 20 23 7 2-4-10-17-23-30-5-33 19-2 31 36 15 36 29 9 11-21-6-27','#C38C5E',13)+L('M32 39q15 10 36 0','#E3BA85',5)+''.join(c(x,y,2,'#F6E8CD','none',0) for x,y in [(39,41),(66,57),(34,61)]),
'Pancake':''.join(e(50,y,33,11,'#E1AF74','#B6845D',3) for y in (67,57,47))+P('M29 44q22-7 42 0v11q-18 9-42 0Z','#EEC58A','#B5855F',2)+B(41,33,18,11,HONEY,2)+L('M50 35v-12','#D9A65B',4),
'Waffle':r(17,18,66,66,'#E8BB81','#AF7D57',8,4)+''.join(L(f'M{x} 22v58','#BD895F',3) for x in (34,50,66))+''.join(L(f'M22 {y}h57','#BD895F',3) for y in (34,50,66))+sparkle(80,16),
'Cinnamon':L('M21 70q24 10 35-22t18-15','#A46E55',12)+c(28,64,13,'#CE9C7B','#936751',3)+P('M28 57q-14 0-7 12 12 5 14-3 2-8-7-9Z','#885C4D','#B88E71',2)+leaf(75,26,MINT,28),
'Vanilla':L('M34 79q-8-31 12-55M53 80q-1-40 20-55','#896A55',8)+flower(64,28,'#F0DCB7')+leaf(41,42,'#8CB894',-40),
'Cake':B(21,50,60,33,'#E9C79D',5)+B(20,41,62,17,'#F5E3D4',8)+''.join(c(x,43,6,'#F7B1B7','none',0) for x in (32,51,70))+L('M50 38V20','#9AA7C3',5)+P('M50 12q-12 16 0 18 10-10 0-18Z',HONEY,'#C79A55',2),
'Caramel':P('M21 45q15-12 31 0t29 0v28q-29 16-60 0Z','#CE8C51','#9D6E52',4)+L('M22 54q28 15 58 0','#F3BE7B',5)+sparkle(80,26),
'Popcorn':B(25,44,52,40,'#E7A09B',3)+poly('20,40 81,40 74,84 28,84','#F1C0AB','#B68C78',3)+''.join(c(x,y,rad,'#FFF0C8','#D2BC95',2) for x,y,rad in [(28,37,12),(45,31,13),(63,37,12),(51,45,11),(75,44,9)])+L('M43 54v24m14-24v24','#FFF5E7',6),
'Rice':e(48,63,32,21,'#EAD9B3','#A9917E',4)+''.join(e(x,y,6,3,'#FFF7E2','#D8C8AA',1) for x,y in [(28,56),(41,52),(57,59),(70,65),(47,73),(30,68)])+L('M52 38 69 15m-10 27 17-22','#9F8D7B',5),
'Noodles':P('M17 58q5 27 33 27t33-27Z','#DBA88B','#9F7C70',4)+noodle()+L('M26 56h49','#E5C78D',4)+L('M58 22l25 23m-32-13 25 23','#A58C6A',4),
'Dumpling':P('M15 73Q21 31 49 35q36-4 37 38-32 23-71 0Z','#F5D6AA','#B88F72',4)+L('M24 59 38 44m0-1 11 15 12-15m0 0 15 17','#E1B58E',4),
'Syrup':B(31,26,39,55,'#B88356',6)+B(26,20,49,13,'#D8B390',5)+L('M40 46q8-12 18 2t-7 15','#EDC68B',5)+sparkle(78,16),
'Pie':P('M15 65Q19 30 49 29q34 1 36 36Z','#ECC690','#AC805E',4)+P('M15 65h70v16H15Z','#D8A673','#A97B5E',4)+L('M31 51l41 21m0-22L32 71','#B58D66',4)+sparkle(79,21),
# Optics and photography
'Lens':lens()+sparkle(84,14),
'Prism':poly('24,77 49,17 79,75','#B9D5DE','#769AA9',4)+L('M10 45 44 53m6-1 42-30','#EAD995',5)+L('M51 55 90 58','#D99BA8',3)+L('M51 59 90 68','#8FC9BA',3)+L('M51 63 87 79','#AFA3D8',3),
'Optics':P('M12 51q36-36 76 0-36 37-76 0Z','#DCE8E5','#8EA9AF',4)+c(50,51,16,'#8FB7C5','#6C91A5',3)+c(50,51,8,'#466781','#405D73',2)+c(44,44,4,'#FAF8EF','none',0)+L('M16 23 28 35m46 0 11-12M20 77 32 65m43 0 12 12',HONEY,3),
'Film':filmstrip()+sparkle(81,19),
'Photograph':B(22,22,58,61,'#FAF4E7',3)+r(28,28,46,43,'#B7DCE9','#8BA6B6',2,2)+poly('30,68 46,46 58,57 69,43 74,70','#8FBEA6','#6D9D8A',2)+sun(63,39),
'Negative':filmstrip()+L('M22 29 78 72m0-43L22 72','#E8CCB2',3)+c(51,52,12,'#46516E','#C0B3BE',3),
'Darkroom':B(16,20,70,66,'#5E6176',5)+L('M48 24v16','#C9B9B6',4)+e(49,44,13,7,'#ECAD9C','#B97775',3)+r(28,63,42,15,'#E0D5CC','#A99D9F',3,2),
'Flash':camera()+P('M78 14l-22 21h14l-8 20 28-29H76Z','#F8DA86','#C6A05D',2),
'Tripod':camera()+L('M51 80 21 93m30-13 27 13m-27-13V93','#788A99',6),
'Shutter':lens()+''.join(P(f'M50 50 50 17 70 32Z',col,'#788CA3',1) for col in [])+poly('50,24 71,35 70,62 50,77 29,63 28,36','#62788C','#516A7E',3)+c(50,51,12,'#B9DFE6','#8AABBE',3),
'Projector':filmstrip()+c(38,34,12,'#8FA9BD','#647B90',3)+c(65,34,12,'#8FA9BD','#647B90',3)+P('M79 49l15-14v47L79 67Z','#D3C6B3','#978B83',3),
'Slide':r(17,20,67,60,'#F7E9D7','#BEAD9D',3,4)+r(29,32,43,35,'#ADD8E5','#85A9B6',2,2)+poly('31,65 45,44 55,53 64,40 72,65',MINT,'#759889',1)+sun(67,34),
'Photographer':actor()+camera().replace('17" y="31"','32" y="48"').replace('width="68" height="49"','width="53" height="34"')+sparkle(83,25),
'Exposure':r(18,32,64,51,'#F2E9D8','#A7A199',7,3)+c(49,59,22,'#D9E4DF','#8AA8AD',3)+L('M49 60 63 45','#D39D82',5)+L('M31 60h36','#B8C1BC',2)+sun(79,19),
'Portrait':r(16,12,68,76,'#D3BBA1','#A18D80',6,4)+r(22,18,56,64,'#EDE8DD','#B8ABA0',4,2)+c(50,43,12,'#E3B692','#A88878',2)+P('M27 79q5-24 23-24t23 24Z','#8CA8B8','#70889D',3),
'Aperture':lens()+''.join(P(f'M50 50l{int(20*math.cos(k*math.pi/3))} {int(20*math.sin(k*math.pi/3))}', '#7B9DAD','#688A9B',2) for k in range(6)),
}
if __name__=='__main__':
 rows=json.loads((R/'client/src/organic-pack-v42.js').read_text().split(' = ',1)[1].rstrip(' ;\n'))['items']; names={i['name'] for i in rows}
 assert len(names)==64 and names==set(SCENES),f'Missing drawings: {names-set(SCENES)}; extras: {set(SCENES)-names}'
 output={};manifest=[];dest=R/'client/assets/v42';dest.mkdir(parents=True,exist_ok=True)
 for row in rows:
  name=row['name']; slug=row['id'].split(':')[1]
  svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="94" rx="35" ry="4" fill="#607883" opacity=".10"/>'+SCENES[name]+'</svg>'
  ET.fromstring(svg)
  assert len(svg)>340,name
  assert not any(k in svg.lower() for k in ['<script','<image','<foreignobject','<animate','onload=','href=','<text','<use'])
  (dest/f'{slug}.svg').write_text(svg,encoding='utf8')
  output[name.lower()]=svg
  manifest.append(dict(id=row['id'],name=name,path=f'client/assets/v42/{slug}.svg',sha256=hashlib.sha256(svg.encode()).hexdigest()))
 assert len(output)==64 and len(set(output.values()))==64
 (R/'client/src/organic-art-v42.js').write_text('export const ORGANIC_ART_V42 = '+json.dumps(output,separators=(',',':'))+';\n')
 (R/'shared/v42-art-manifest.json').write_text(json.dumps({'version':42,'icons':manifest},indent=2)+'\n')
 print('Generated 64 original V42 SVG drawings, all XML valid and individually hashed')
