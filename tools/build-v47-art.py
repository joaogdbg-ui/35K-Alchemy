#!/usr/bin/env python3
"""80 individually composed, static SVG illustrations, offline, no fonts or external links."""
from pathlib import Path
import json,hashlib,math,re
ROOT=Path(__file__).resolve().parents[1]
pack=json.loads((ROOT/'client/src/organic-pack-v47.js').read_text().split('=',1)[1].strip().rstrip(';'))
ASSET=ROOT/'client/assets/v47';ASSET.mkdir(exist_ok=True,parents=True)
INK='#60798A';LINE='#677B87';SEA='#81C5D4';DEEP='#639FAF';MINT='#91C2A4';GREEN='#77A88C';GOLD='#F2C880';ROSE='#E9A49A';VIOLET='#B4A1D4';CREAM='#F5E4C2';BROWN='#C49B7C';STONE='#C5C1B9';BLUE='#90BBD8';DARK='#596C82'
def p(d,fill='none',stroke=LINE,w=3,extra=''):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def c(x,y,r,fill=CREAM,stroke=LINE,w=3):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def e(x,y,rx,ry,fill=CREAM,stroke=LINE,w=3):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def r(x,y,w,h,fill=CREAM,stroke=LINE,rad=6,sw=3):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rad}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def wave(y=78):return p(f'M9 {y}q11-6 22 0t22 0t22 0t17 0','none',SEA,5)
def spark(x=78,y=19,col=GOLD):return p(f'M{x} {y-8}v16M{x-8} {y}h16','none',col,3)
def sun(x=75,y=22,rad=11):return c(x,y,rad,GOLD,'#D5A66C',2)+''.join(p(f'M{x+math.cos(k*math.pi/4)*(rad+5):.1f} {y+math.sin(k*math.pi/4)*(rad+5):.1f}l{math.cos(k*math.pi/4)*5:.1f} {math.sin(k*math.pi/4)*5:.1f}','none','#E8BD79',2) for k in range(8))
def cloud(x=46,y=30,fill='#D3E5E8'):return c(x-14,y+4,12,fill,'none',0)+c(x,y-3,16,fill,'none',0)+c(x+17,y+6,12,fill,'none',0)+r(x-27,y,57,17,fill,'none',4,0)
def leaf(x=48,y=51,col=GREEN):return p(f'M{x-19} {y+16}Q{x-18} {y-23} {x+18} {y-18}Q{x+22} {y+18} {x-19} {y+16}Z',col,'#6F9980',3)+p(f'M{x-17} {y+14}L{x+15} {y-14}','none','#E4EBC8',2)
def small_leaf(x,y,s=1):return p(f'M{x} {y}q{-15*s} {-18*s} {-20*s} {2*s}q{16*s} {10*s} {20*s} {-2*s}',GREEN,'#6B9480',2)
def tree():return p('M49 29v54m0-33L31 34m19 10 19-20','none','#917E73',7)+c(31,31,14,MINT,'#719B87',2)+c(54,20,20,MINT,'#719B87',2)+c(71,37,15,MINT,'#719B87',2)
def star(x=50,y=46,radius=24,fill=GOLD,n=5):
 pts=[(x+(radius if i%2==0 else radius*.44)*math.cos(-math.pi/2+i*math.pi/n),y+(radius if i%2==0 else radius*.44)*math.sin(-math.pi/2+i*math.pi/n)) for i in range(2*n)]
 return p('M'+'L'.join(f'{a:.1f} {b:.1f}' for a,b in pts)+'Z',fill,'#A89075',2)
def mountain():return p('M12 77 35 40 49 61 61 27 90 77Z','#B8C3C0','#8099A5',3)+p('M55 41l6-14 11 20-8-3-7 7Z','#EAF4F1','none',0)
def seabed():return wave(82)+p('M10 88q19-10 40 0t40 0','none','#DCC9A5',4)
def grass():return ''.join(p(f'M{x} 83q{-10 if i%2==0 else 8}-16-2-27','none',GREEN,4) for i,x in enumerate([25,37,65,76]))
def bread():return p('M20 67q-6-35 23-43 30-11 39 19 7 20-11 31H27Z','#E3B77D','#AF8765',4)+''.join(p(f'M{x} 41l-5 10','none','#FAEAC8',4) for x in (41,55,69))
def fish():return p('M26 54q19-22 42 0l17-12v24L68 55q-23 22-42-1Z',ROSE,'#9D7B88',3)+c(36,51,2,DARK,'none',0)
def gear(x=50,y=51,rad=24):return c(x,y,rad,STONE,INK,4)+''.join(p(f'M{x+rad*math.cos(i*math.pi/4):.1f} {y+rad*math.sin(i*math.pi/4):.1f}l{8*math.cos(i*math.pi/4):.1f} {8*math.sin(i*math.pi/4):.1f}','none',INK,7) for i in range(8))+c(x,y,7,CREAM,INK,3)
def bolt(x=50,y=43):return p(f'M{x+4} {y-20}l-18 24h16l-5 22 22-29h-15Z',GOLD,'#B28E70',3)
def drop(x=50,y=48):return p(f'M{x} {y-23}Q{x-28} {y+6} {x-13} {y+19}Q{x+3} {y+35} {x+16} {y+15}Q{x+23} {y+2} {x} {y-23}Z',SEA,'#639CB6',3)
def house():return p('M16 45 50 17 84 45v37H16Z',CREAM,'#A18D7D',4)+r(40,54,20,28,BROWN,'#936D62',3,3)
def box():return r(18,26,64,56,CREAM,'#AFA091',7,4)
def ruler():return r(16,51,69,18,CREAM,'#A68F81',3,3)+''.join(p(f'M{x} 52v{7 if i%2 else 12}','none','#9A8477',2) for i,x in enumerate(range(22,82,6)))
def panel():return r(21,27,59,49,BLUE,'#698CA4',5,3)+''.join(p(f'M{x} 29v46','none','#D9E8E9',2) for x in (41,61))+p('M22 51h58','none','#D9E8E9',2)
def dial():return c(50,48,29,'#E7EBDF','#8098A2',4)+p('M50 48 68 34','none',ROSE,4)+c(50,48,4,DARK,'none',0)
def eye(x,y):return c(x,y,3,DARK,'none',0)
def pebble(x,y,rad=10,col=STONE):return e(x,y,rad,rad*.6,col,'#8B99A1',2)
def waves():return ''.join(p(f'M11 {y}q13-8 26 0t26 0t26 0','none',SEA,4) for y in (73,85))
def long_cloud():return cloud(45,30)+p('M12 58h77','none',BLUE,4)
def tower():return r(35,27,30,57,CREAM,'#958A87',3,4)+p('M30 28 50 12 70 28','none',BROWN,6)
def camera():return r(19,39,62,39,DARK,'#8994A0',6,4)+c(51,59,16,BLUE,'#C7D1DB',4)+c(51,59,7,DARK,'none',0)+r(29,32,25,9,STONE,'#8793A5',2,2)
def moon(x=72,y=26):return c(x,y,15,CREAM,'#8B9FB6',2)+c(x+7,y-5,12,'#FFFFFF','none',0)
def film():return r(24,20,52,65,DARK,'#7D8C9A',4,3)+''.join(r(x,y,7,5,CREAM,'none',0,0) for y in (27,43,59,75) for x in (27,66))+r(37,31,26,42,BLUE,'none',2,0)
def pot():return p('M24 43h52v25q0 18-26 18t-26-18Z',STONE,'#8497A1',4)+p('M20 42h60','none',DARK,5)+p('M32 27q-6-9 3-17m17 18q-6-9 3-17','none',BLUE,3)
def cake():return p('M18 63h64l-6 23H24Z',GOLD,'#B38E70',4)+p('M18 63q13-19 32-4t32 4','none',ROSE,9)
def berry(x,y,col=ROSE):return c(x,y,7,col,'#A4817B',2)+small_leaf(x+3,y-8,.4)
def chimney():return house()+r(63,15,9,26,BROWN,'#8F786D',1,2)
def flower(x=50,y=45):return ''.join(e(x+14*math.cos(i*math.pi/3),y+14*math.sin(i*math.pi/3),9,12,ROSE,'#C98A88',2) for i in range(6))+c(x,y,10,GOLD,'#B99573',2)
def sprout():return p('M50 82V44','none',GREEN,5)+leaf(36,49)+leaf(66,35)+p('M22 84h56','none',BROWN,5)
def bridge():return p('M12 71h76M19 71q31-58 62 0M28 53v18M50 39v32M72 53v18','none',STONE,5)+waves()
def badge_art():return c(50,52,32,CREAM,'#A39183',3)
def ring(x=50,y=50):return e(x,y,40,14,'none',GOLD,5)+c(x,y,24,BLUE,'#8498B1',3)
def magnetometer():return dial()+p('M29 83l14-16 13 10 15-22','none',ROSE,4)
def smallstar(x,y):return star(x,y,9,GOLD)

SC={
# Coast: sea spray, sand and erosion are recognisably different objects.
'Sea Foam':waves()+''.join(c(x,y,rr,'#E9F5F1','#9ECBD0',1) for x,y,rr in ((31,60,8),(47,55,10),(61,63,6),(73,52,5)))+spark(81,19,BLUE),
'Rip Current':waves()+p('M47 89q-13-18-4-30t7-23','none',DARK,7)+p('M32 48l18-15 15 15','none',BLUE,5)+p('M50 33v-18','none',DARK,4),
'Salt Spray':wave(82)+''.join(drop(x,y) if i==0 else c(x,y,3+i,SEA,'#7AA7B8',1) for i,(x,y) in enumerate(((35,39),(62,24),(73,43),(24,23))))+p('M12 60q23-24 62 0','none',BLUE,4),
'Sea Stack':waves()+p('M34 78 41 36 53 26 65 48 69 81Z',STONE,'#8297A3',4)+p('M41 48l15-6-4 19','none',CREAM,3)+sun(78,17,6),
'Coastal Dune':p('M9 84q19-53 40-26t43-8','none',GOLD,9)+p('M10 89h80','none','#D8B999',4)+''.join(p(f'M{x} 74q-8-20 7-24','none',GREEN,3) for x in (35,58,78)),
'Tidal Channel':p('M10 81q25-17 35-3t42-19','none',SEA,14)+p('M17 45q26 3 19 20M70 35q-24 8-16 24','none',BROWN,6)+spark(77,23),
'Seagrass Meadow':wave(83)+''.join(p(f'M{x} 83q{20 if j%2 else -17}-32 1-50','none',GREEN,5) for j,x in enumerate((23,39,56,71,83)))+fish(),
'Wave Crest':p('M10 83q15-8 21-31 15-36 39-9 17 15 20 45','none',SEA,11)+p('M44 31q10-17 28-6','none',CREAM,5)+c(70,56,5,CREAM,'none',0),
'Coastal Fog':wave(83)+cloud(33,51)+cloud(66,44)+p('M8 72h84','none','#C4D6DC',5),
'Beach Pebble':wave(82)+pebble(36,67,17)+pebble(66,71,12,GOLD)+pebble(52,81,10,BROWN)+sun(82,20,6),
# Insects and plant structures.
'Caterpillar Cocoon':p('M50 13v18','none',BROWN,5)+e(50,53,23,30,CREAM,'#A7A58D',4)+''.join(p(f'M{34+i*5} 33q{-10+i*4} 25 {2+i*2} 44','none','#D4CDB0',2) for i in range(6))+small_leaf(78,27,.8),
'Butterfly Chrysalis':p('M25 18h48','none',BROWN,5)+p('M49 19q-27 21-10 49t18 3q17-30-8-52Z',GREEN,'#759C8A',4)+p('M50 34v37','none',CREAM,3)+spark(78,45),
'Ant Trail':p('M10 80q20-27 40-14t40-48','none',BROWN,4, 'stroke-dasharray="5 7"')+''.join(c(x,y,6,DARK,'#72878D',2)+c(x+7,y+3,4,DARK,'none',0) for x,y in ((18,75),(44,60),(70,37))),
'Nectar Drop':flower(48,36)+drop(52,76)+spark(76,16),
'Pollen Basket':e(48,50,19,24,GOLD,'#BC9E6C',3)+p('M33 40q19 10 33 2M32 58q19 8 33-3','none',BROWN,3)+c(73,43,9,ROSE,'#A38178',2)+flower(23,26),
'Bee Colony':e(50,48,29,30,GOLD,'#B89465',3)+''.join(p(f'M{x} 23v51','none',CREAM,4) for x in (33,45,57,69))+p('M24 51h51','none',BROWN,4)+c(50,60,9,DARK,'none',0),
'Firefly Glow':c(50,46,27,GOLD,'none',0)+e(49,50,16,21,DARK,'#7C93A0',3)+e(50,62,12,14,CREAM,'none',0)+p('M40 30 29 19m30 11 13-11','none',INK,4)+spark(83,19),
'Leaf Vein':leaf(50,50,MINT)+p('M30 66 66 32m-28 25-8-6m17-7 12 7m-7-17 2-10','none',CREAM,3)+small_leaf(79,63,.7),
'Bark Beetle':r(21,20,62,67,BROWN,'#A28071',13,4)+e(49,54,14,20,DARK,'#5C7286',3)+p('M49 35v39M38 49l-14-11m14 21-13 8m35-18 14-10m-14 20 14 9','none',CREAM,3),
'Moth Wing':p('M50 44q-45-38-36 15 7 38 36 7q31 31 37-7 6-41-37-15Z',VIOLET,'#9182B6',3)+c(50,51,6,GOLD,'none',0)+''.join(c(x,y,5,ROSE,'none',0) for x,y in ((29,44),(73,47),(26,67),(73,67))),
# Geology and moving water.
'Cave Pool':p('M9 40q14-33 41-20t41 20V87H9Z',STONE,'#8396A5',4)+e(50,73,31,12,SEA,'#779DAE',3)+p('M34 32v23m33-20v17','none',CREAM,6),
'Flowstone':p('M27 16q-18 24 3 46t-10 23h55q-20-16-6-35t-19-33Z',CREAM,'#A5A49C',4)+''.join(p(f'M{x} 37q-10 21 4 41','none','#D1C7B9',3) for x in (39,52,65)),
'Calcite Crystal':p('M50 9 73 38 62 83 38 83 27 38Z',BLUE,'#758FA5',4)+p('M27 38h46M50 9v74m-23-45 23 12 23-12','none',CREAM,3)+spark(82,24,BLUE),
'Volcanic Bomb':p('M19 45q-7-34 30-31 31 1 32 34l-16 30-31-1Z',STONE,'#80919C',4)+p('M23 44q7-15 11-4t15 6 10-13 16 10','none',ROSE,7)+spark(80,15,ROSE),
'Basalt Column':''.join(p(f'M{x} 83V{y}l12-7 10 7v{83-y}Z',STONE,'#778A9B',3) for x,y in ((13,40),(36,27),(59,34)))+p('M11 84h77','none',DARK,4),
'Pumice Raft':waves()+''.join(pebble(x,y,rad,CREAM) for x,y,rad in ((31,63,12),(51,61,14),(69,62,11)))+''.join(c(x,y,2,DARK,'none',0) for x,y in ((35,61),(48,58),(61,68))),
'River Delta':p('M51 15v35m0 0-23 29m23-29 24 29M49 51l-1 31','none',SEA,13)+p('M15 84h70','none',BROWN,5)+small_leaf(79,25,.5),
'Oxbow Lake':p('M14 28q63-24 67 12 4 23-29 25-22 0-23 20','none',SEA,10)+p('M18 81q25-18 41-9','none',GREEN,4)+sun(83,18,5),
'Fossil Imprint':e(50,53,35,30,STONE,'#998F88',4)+p('M28 62q9-25 29-26t19 29','none','#776F70',4)+''.join(c(x,y,4,BROWN,'none',0) for x,y in ((38,49),(48,40),(60,43),(68,54))),
'Sediment Layer':''.join(p(f'M14 {y}q20-7 37 0t35 0','none',col,8) for y,col in ((30,CREAM),(45,BROWN),(60,GOLD),(76,STONE)))+spark(79,16),
# Electronics. Specific foreground silhouettes, not icon recolours.
'Circuit Trace':r(15,20,70,65,DARK,'#657C8F',7,3)+p('M25 35h18v19h21v-17h13M27 73h26V64h21','none',GOLD,5)+''.join(c(x,y,5,MINT,'#83A29D',2) for x,y in ((25,35),(77,37),(27,73),(74,64))),
'Capacitor Bank':r(17,45,66,35,DARK,'#7D91A2',6,3)+''.join(r(x,22,14,48,col,'#77869B',5,3) for x,col in ((23,BLUE),(43,MINT),(63,GOLD)))+p('M19 82h62','none',STONE,4),
'Optical Switch':r(17,35,26,39,DARK,'#758AA2',4,3)+r(57,35,26,39,DARK,'#758AA2',4,3)+p('M41 53h18','none',ROSE,5, 'stroke-dasharray="4 4"')+c(31,53,7,BLUE,'none',0)+bolt(73,55),
'LED Array':r(19,21,62,64,DARK,'#718399',6,3)+''.join(c(x,y,5,col,'none',0) for i,x in enumerate((33,50,67)) for j,y in enumerate((35,51,67)) for col in ([GOLD,MINT,ROSE][(i+j)%3],)),
'Electric Relay':r(19,34,63,44,STONE,'#758D9B',5,4)+p('M29 44h21l17 16H46L33 70','none',DARK,5)+bolt(73,28),
'Solar Inverter':panel()+r(64,52,25,32,CREAM,'#7D92A1',4,3)+p('M70 70q6-12 12 0','none',GREEN,4)+sun(83,18,6),
'Temperature Probe':r(41,17,18,58,STONE,'#8A97A6',8,3)+c(50,76,12,ROSE,'#B58D8D',3)+p('M50 62V30m-7 24h14','none',ROSE,4)+spark(76,16),
'Robot Gripper':p('M30 81 50 61 67 40','none',STONE,12)+c(50,61,10,GOLD,'#A98B73',3)+p('M64 34l-10-13m15 16 15-12m-20 10 6 20','none',DARK,7)+c(25,82,7,DARK,'none',0),
'Weather Node':r(25,37,50,45,STONE,'#8194A6',6,3)+sun(74,24,8)+p('M35 72V55m14 17V45m13 27V51','none',SEA,6)+r(36,19,29,16,BLUE,'#8292A1',3,2),
'Electronic Compass':c(50,51,33,CREAM,'#839AAA',4)+p('M50 20v62M19 51h62','none',BLUE,3)+p('M44 62 64 27 55 64 35 73Z',ROSE,'#AA8184',3),
# Food. Make each plated treat visibly unlike its neighbour.
'Herb Butter':e(50,76,35,11,CREAM,'#B39D8F',3)+r(28,38,44,35,GOLD,'#B89C6D',10,3)+''.join(small_leaf(x,46,.5) for x in (36,49,62)),
'Garlic Bread':bread()+p('M29 44l8 8m10-19 9 7m12-5 5 10','none',CREAM,5)+''.join(small_leaf(x,56,.4) for x in (36,59)),
'Apple Turnover':p('M18 73 60 24q31 6 22 42L40 84Z',GOLD,'#AD886B',4)+p('M33 68q27-27 38-5','none',CREAM,5)+small_leaf(68,20,.6),
'Fruit Compote':pot()+''.join(berry(x,y,col) for x,y,col in ((39,52,ROSE),(56,49,VIOLET),(67,57,GOLD)))+p('M22 44h57','none',CREAM,4),
'Cinnamon Roll':p('M19 78q-6-47 29-49 33-3 34 28 2 29-30 30t-33-9Z',GOLD,'#B08766',4)+p('M36 45q24-21 34 2 8 22-18 24-17 1-7-15 7-14 11-2','none',CREAM,6),
'Honey Glaze':cake()+drop(50,34)+p('M22 64q27 15 55-3','none',GOLD,6),
'Cheese Pastry':p('M17 78 49 28 84 78Z',GOLD,'#AA8567',4)+p('M37 66 49 45 64 66Z',CREAM,'#D7B279',3)+''.join(c(x,70,2,BROWN,'none',0) for x in (32,47,64)),
'Chocolate Truffle':e(50,83,35,9,CREAM,'#A69B90',3)+''.join(c(x,y,11,DARK,'#83695F',3)+p(f'M{x-8} {y}q8-9 16 0','none',GOLD,2) for x,y in ((32,57),(60,54),(48,71))),
'Fruit Sorbet':p('M26 52h48l-6 30H33Z',CREAM,'#8F9AA2',3)+e(50,43,26,25,ROSE,'#B68B96',3)+berry(65,26,MINT)+spark(22,20,BLUE),
'Toasted Seeds':e(50,73,36,16,CREAM,'#A69B8A',3)+''.join(e(x,y,5,3,col,'#AA8E6F',1) for x,y,col in ((29,69,GOLD),(44,61,BROWN),(57,72,ROSE),(70,65,GOLD),(47,79,BROWN)))+sun(78,21,7),
# Buildings and public spaces.
'Rain Gutter':house()+p('M14 43h72l-9 13-9-2','none',STONE,7)+drop(81,76)+p('M74 54v14','none',BLUE,4),
'Tram Stop':p('M17 85V39h65v46M17 40 32 24h37l13 16','none',STONE,6)+r(30,51,41,26,BLUE,'#7D94A1',5,3)+c(38,81,5,DARK,'none',0)+c(67,81,5,DARK,'none',0),
'Street Lantern':p('M50 87V30q0-16 17-16','none',DARK,6)+p('M56 27 71 19 84 29 77 49 60 48Z',GOLD,'#927E73',4)+p('M22 88h55','none',STONE,5)+spark(80,17),
'Pedestrian Bridge':bridge()+''.join(c(x,y,3,GOLD,'none',0) for x,y in ((28,61),(48,52),(67,61))),
'Public Fountain':e(50,83,37,9,BLUE,'#8398AA',3)+p('M50 31v44m-18-19q18-21 36 0m-33 5q15-12 30 0','none',SEA,5)+c(50,32,7,GOLD,'#B59A79',2),
'Green Roof':house()+p('M15 43 50 17 85 43','none',GREEN,12)+''.join(flower(x,30) if x==49 else small_leaf(x,25,.6) for x in (27,49,73)),
'Urban Orchard':tree()+''.join(c(x,y,6,ROSE,'#B08783',2) for x,y in ((29,35),(54,31),(70,47)))+p('M15 85h70','none',BROWN,5),
'Market Stall':r(19,47,62,35,CREAM,'#A18D7A',4,3)+p('M15 48 24 27h52l9 21Z',ROSE,'#A8897F',3)+''.join(p(f'M{x} 29v17','none',CREAM,5) for x in (37,50,63))+e(50,78,19,7,GOLD,'none',0),
'Town Clock':tower()+c(50,47,19,CREAM,'#9A9E9E',4)+p('M50 46v-12m0 12 10 8','none',DARK,4)+p('M21 86h58','none',STONE,5),
'Cobblestone Lane':p('M21 86 38 20h24l17 66Z',STONE,'#979A98',3)+''.join(p(f'M{26+i*4} {y}h{50-i*8}','none',CREAM,3) for i,y in enumerate((43,59,74)))+sun(82,19,6),
# Photography - iconic camera mechanisms rather than vague pictograms.
'Photo Negative':film()+p('M36 44h28v20H36Z','none',ROSE,5)+spark(78,17,BLUE),
'Long Exposure':camera()+p('M12 21q35-23 76 0','none',GOLD,4)+''.join(smallstar(x,y) for x,y in ((22,18),(75,14))),
'Photo Album':r(24,16,53,69,CREAM,'#A18D7E',5,4)+r(34,29,34,31,BLUE,'#96ABB1',3,2)+p('M31 18v64','none',ROSE,5)+p('M40 73h25','none',BROWN,3),
'Contact Sheet':r(15,16,70,70,CREAM,'#A8A29B',5,3)+''.join(r(x,y,17,17,BLUE,'#8B98A5',2,2) for x in (23,42,61) for y in (24,48)),
'Film Canister':r(32,29,36,52,DARK,'#7F8FA5',8,3)+e(50,30,20,7,STONE,'#8194A5',3)+p('M42 44h16v19H42Z',ROSE,'none',0)+spark(80,20),
'Studio Light':p('M45 57 27 87M45 57 62 87M45 57v32','none',STONE,6)+p('M21 23 54 13l23 35-29 13Z',GOLD,'#A59177',4)+spark(80,23),
'Tripod Head':r(37,25,27,23,DARK,'#7D93A7',5,4)+p('M50 49 24 85m26-36 27 36M50 47v38','none',STONE,6)+c(50,35,7,BLUE,'none',0),
'Macro Lens':e(50,52,31,31,DARK,'#71889F',4)+c(50,52,23,BLUE,'#84A3B7',4)+c(50,52,12,MINT,'none',0)+flower(49,52),
'Star Trail':moon(80,22)+''.join(p(f'M{x} {y}q12-16 35-8','none',col,4) for x,y,col in ((10,44,BLUE),(22,62,CREAM),(10,79,GOLD)))+smallstar(28,23),
'Photo Collage':r(17,21,35,43,CREAM,'#A68E7C',3,3)+r(46,33,37,47,BLUE,'#8799AA',3,3)+p('M25 53 40 41m13 29 18-19','none',GREEN,5)+spark(78,20),
# Space imagery.
'Planetary Ring':ring()+smallstar(84,15),
'Cosmic Dust':''.join(c(x,y,rad,col,'none',0) for x,y,rad,col in ((28,30,6,ROSE),(67,36,4,BLUE),(45,56,8,GOLD),(76,75,5,VIOLET),(22,73,3,CREAM)))+''.join(smallstar(x,y) for x,y in ((70,16),(20,54))),
'Solar Wind':sun(30,49,18)+''.join(p(f'M47 {y}q19-18 43 0','none',ROSE,4) for y in (31,49,67))+spark(83,15),
'Moonrise':p('M9 78h82','none',SEA,7)+c(50,58,25,CREAM,'#96AAB6',3)+p('M18 78h64','none',DARK,5)+smallstar(83,23),
'Aurora Curtain':p('M23 17q-13 30 7 50t7 13M45 12q-13 30 6 48t8 22M67 16q-12 27 8 48','none',MINT,9)+p('M18 85h70','none',BLUE,5)+smallstar(83,17),
'Comet Tail':c(34,53,18,STONE,'#8C9BA5',3)+p('M49 43q33-29 43-33M51 56q34-6 42-8M50 67q31 6 40 14','none',GOLD,6)+spark(83,15),
'Orbiting Satellite':r(41,37,18,28,GOLD,'#918A81',4,3)+r(10,39,27,21,BLUE,'#7996AC',2,2)+r(63,39,27,21,BLUE,'#7996AC',2,2)+p('M50 35V19','none',DARK,4)+smallstar(80,19),
'Impact Crater':e(50,65,37,18,STONE,'#8A9399',4)+e(50,61,24,9,DARK,'#A4A6A4',3)+p('M61 18 45 35l23 8','none',GOLD,6)+spark(80,18),
'Stellar Nursery':cloud(50,46,VIOLET)+''.join(star(x,y,rad,col) for x,y,rad,col in ((28,32,10,GOLD),(52,40,14,CREAM),(76,28,8,ROSE)))+smallstar(65,72),
'Space Weather':sun(30,40,17)+p('M50 25q24-8 34 11M49 42q35-12 39 14','none',ROSE,6)+c(75,75,12,BLUE,'#7A9CB2',3)+spark(82,17)
}
assert set(SC)=={i['name'] for i in pack['items']},(len(SC),[i['name'] for i in pack['items'] if i['name'] not in SC])
illustrations={};manifest=[]
for item in pack['items']:
 name=item['name'];slug=item['id'].split(':')[1]
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'+e(50,94,29,3,'#8C8B89','none',0)+SC[name]+'</svg>'
 if any(s in svg.lower() for s in ('<script','<image','<text','<use','<foreignobject','href=','onload=')):raise ValueError('Unsafe SVG: '+name)
 asset=ASSET/(slug+'.svg');asset.write_text(svg)
 illustrations[name.lower()]=svg
 manifest.append({'id':item['id'],'path':str(asset.relative_to(ROOT)),'sha256':hashlib.sha256(svg.encode()).hexdigest()})
assert len(set(illustrations.values()))==len(illustrations)==80
(ROOT/'client/src/organic-art-v47.js').write_text('export const ORGANIC_ART_V47 = '+json.dumps(illustrations,separators=(',',':'))+';\n')
(ROOT/'shared/v47-art-manifest.json').write_text(json.dumps({'release':'V47','icons':manifest},indent=2)+'\n')
print('V47: 80 separate custom illustrated SVG assets, unique and offline')
