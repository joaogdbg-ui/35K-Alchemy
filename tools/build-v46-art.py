#!/usr/bin/env python3
"""80 individually composed, static SVG illustrations, offline, no fonts or external links."""
from pathlib import Path
import json,hashlib,math,re
ROOT=Path(__file__).resolve().parents[1]
pack=json.loads((ROOT/'client/src/organic-pack-v46.js').read_text().split('=',1)[1].strip().rstrip(';'))
ASSET=ROOT/'client/assets/v46';ASSET.mkdir(exist_ok=True,parents=True)
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
# Each scene deliberately composes recognizable objects and scene details rather than a shared generic thumbnail.
SC={
'Tidepool Anemone':seabed()+''.join(p(f'M{x} 75q{(-1)**i*12}-23 0-42','none',ROSE,5) for i,x in enumerate((33,44,56,67)))+c(50,65,13,ROSE,'#BD828E',3)+sun(79,16,7),
'Sea Sponge':seabed()+p('M29 75q-9-15 0-36t26-13q17-8 19 17t-4 33Z',GOLD,'#BC9C72',4)+''.join(c(x,y,z,'#B68E73','none',0) for x,y,z in ((43,49,4),(58,52,5),(37,65,3),(59,69,3),(52,39,3))),
'Sea Cucumber':seabed()+e(49,63,29,14,MINT,'#709A86',3)+''.join(c(x,52+(i%2)*6,3,GOLD,'none',0) for i,x in enumerate((31,39,49,58,68)))+eye(25,64),
'Sea Fan':seabed()+p('M49 81V31m0 25-19-18m19 15 20-23m-39 6-9-13m9 13 2-15m34 8 4-16m-4 16 14-10','none',ROSE,6)+''.join(c(x,y,4,ROSE,'none',0) for x,y in ((49,31),(30,38),(69,30),(21,25),(32,21),(73,14),(81,20))),
'Hermit Crab':seabed()+c(54,51,21,CREAM,'#B69781',3)+p('M54 37q-21 12-8 26t24-5','none','#C6947E',5)+e(30,68,13,8,ROSE,'#B4807D',3)+p('M21 64l-12-9m27 12 12-8','none',ROSE,4)+eye(26,65),
'Nautilus':seabed()+c(55,45,26,CREAM,'#AD9585',3)+p('M70 42q-10-20-28-5-15 16 7 23 16 5 11-13-5-8-15 1','none','#AC7D86',5)+''.join(p(f'M{x} 69l-4 12','none',MINT,3) for x in (37,46,55,64)),
'Brittle Star':seabed()+c(50,53,9,ROSE,'#A77E88',2)+''.join(p(f'M50 53q{25*math.cos(i*2*math.pi/5):.0f} {25*math.sin(i*2*math.pi/5):.0f} {36*math.cos(i*2*math.pi/5):.0f} {36*math.sin(i*2*math.pi/5):.0f}','none',ROSE,5) for i in range(5)),
'Sea Slug':seabed()+p('M22 69q4-32 37-24 27 3 22 24-15 13-59 0Z',VIOLET,'#867CAA',4)+''.join(c(x,y,4,MINT,'none',0) for x,y in ((37,56),(51,62),(66,55)))+p('M35 48l-4-18m14 20 5-24','none',ROSE,4),
'Seahorse Nursery':seabed()+''.join(p(f'M{x} 81q-13-26-3-47','none',GREEN,4) for x in (19,35,76,86))+p('M54 27q22-3 17 19t-13 19q-11 14 3 14t-8-10q-8-12-5-22t6-20Z',GOLD,'#A48C73',3)+eye(61,33),
'Kelp Canopy':wave(85)+''.join(p(f'M{x} 86q{12 if i%2 else -12}-20 0-45t0-23','none',GREEN,6)+small_leaf(x+3,46) for i,x in enumerate((30,50,70)))+sun(82,15,7),
'Oak Sapling':p('M50 83V53q-12-12-15-25m15 27q18-9 21-26','none','#9D8473',5)+leaf(31,33)+leaf(68,31)+e(50,83,24,5,BROWN,'none',0),
'Squirrel Drey':tree()+e(50,60,23,15,BROWN,'#9C7D6D',4)+''.join(p(f'M{x} {55+i%3*5}l13-6','none',CREAM,2) for i,x in enumerate((33,41,53))),
'Pecked Log':r(23,37,54,43,BROWN,'#8E7567',11,4)+''.join(c(x,y,4,'#6F645B','none',0) for x,y in ((36,48),(50,59),(63,44),(56,71)))+p('M19 80h63','none',GREEN,5),
'Fern Frond':p('M47 82q17-37 3-69','none',GREEN,5)+''.join(p(f'M{49+i//2*2} {28+i*7}q{26 if i%2 else -23}-19 {15 if i%2 else -15}-1',MINT,'#6F9D85',2) for i in range(7)),
'Tree Hollow':tree()+e(50,51,12,18,'#756658','#927865',3)+c(50,44,4,'#C6B2A2','none',0),
'Tree Rings':e(50,51,32,29,BROWN,'#987A6B',4)+''.join(e(50,51,rad,rad-3,'none','#E5CCAE',3) for rad in (10,19,27))+c(50,51,3,'#8C7063','none',0),
'Leaf Litter':p('M15 81h70','none',BROWN,4)+''.join(p(f'M{x} {y}q{-11 if i%2 else 13}-20 {15 if i%2 else -15}-12q4 11 {-15 if i%2 else 15} 12Z',col,'#799783',2) for i,(x,y,col) in enumerate(((26,71,MINT),(48,81,GOLD),(63,64,ROSE),(78,80,GREEN)))),
'Forest Floor':tree()+p('M11 84q22-11 39 0t39 0','none',BROWN,6)+''.join(c(x,80,4,GOLD,'none',0) for x in (27,42,74)),
'Pine Needle':p('M25 79 71 19','none',BROWN,5)+''.join(p(f'M{39+i*5} {60-i*7}l{(-1)**i*23} {-14 if i%2 else -6}','none',GREEN,3) for i in range(6)),
'Spore Print':r(17,19,66,65,'#F9F5E9','#B6A99A',7,3)+''.join(e(50,55,rad,rad*.68,'none','#B1A18D',2) for rad in (11,19,29))+''.join(c(x,y,2,BROWN,'none',0) for x,y in ((43,48),(64,61),(31,64),(53,42))),
'Sunspot':sun(50,49,29)+c(47,43,9,DARK,'#B8886A',2)+c(61,59,5,DARK,'none',0),
'Solar Flare':sun(43,51,21)+p('M48 25q24-35 35 0t-10 46q5-27-18-26','none',ROSE,7)+spark(79,16),
'Coronal Mass Ejection':sun(44,52,21)+''.join(p(f'M61 {y}q25 {-19+i*6} 22-37','none',ROSE,5) for i,y in enumerate((32,46,59)))+spark(81,15),
'Meteor Shower':p('M15 25l26 34m12-42 24 30m-58 18 18 11','none',GOLD,6)+''.join(star(x,y,7,CREAM) for x,y in ((42,56),(78,47),(39,79)))+spark(86,17),
'Lunar Crater':c(50,49,35,'#D9D7CE','#A6A7AB',4)+e(37,42,12,8,'#B9C0C2','#89999F',2)+e(65,64,9,6,'#BAC5C4','#89999F',2)+c(63,30,4,CREAM,'none',0),
'Lunar Dust':mountain()+''.join(c(x,y,r0,'#D1C9BF','none',0) for x,y,r0 in ((19,85,3),(38,75,5),(63,86,4),(81,76,3)))+spark(79,15),
'Eclipse Glasses':p('M13 44h74','none',DARK,7)+r(14,35,30,25,'#3E506B','#8794A9',8,4)+r(57,35,30,25,'#3E506B','#8794A9',8,4)+c(50,23,10,GOLD,'#C89E68',2),
'Star Cluster':''.join(star(x,y,rr,GOLD) for x,y,rr in ((26,34,15),(53,23,11),(77,47,14),(42,73,10),(75,80,8))),
'Red Giant':c(50,52,31,ROSE,'#BA7D7C',4)+''.join(p(f'M{x} {y}l{dx} {dy}','none',GOLD,5) for x,y,dx,dy in ((50,13,0,-9),(84,50,9,0),(17,51,-9,0),(50,87,0,8)))+c(37,46,7,GOLD,'none',0),
'White Dwarf':c(50,50,15,'#F7F3E1','#94BED5',4)+''.join(p(f'M{x} {y}l{dx} {dy}','none',BLUE,4) for x,y,dx,dy in ((50,21,0,-14),(78,50,14,0),(22,50,-14,0),(50,79,0,14)))+spark(75,21),
'Dust Devil':p('M23 29q58-22 51 1t-44 13 19 13 39 14-21 22-41 17','none',BROWN,6)+''.join(c(x,y,3,GOLD,'none',0) for x,y in ((25,60),(72,72),(54,81))),
'Ice Halo':c(50,50,35,'none','#A7CCDD',5)+sun(50,50,15)+spark(78,15,BLUE),
'Sundog':c(50,52,25,'none',BLUE,3)+sun(50,52,14)+c(20,51,7,GOLD,'none',0)+c(82,51,7,GOLD,'none',0),
'Cold Front':cloud(46,34)+p('M13 70h74','none',BLUE,4)+''.join(p(f'M{x} 74l-7 13','none',BLUE,4) for x in (27,49,72))+spark(75,21,BLUE),
'Warm Front':cloud(45,32)+p('M15 70h72','none',ROSE,4)+''.join(c(x,72,7,ROSE,'none',0) for x in (27,50,73))+sun(80,17,7),
'Jet Stream':cloud(32,33)+''.join(p(f'M18 {y}q31-18 66 0','none',BLUE,4) for y in (51,64,77))+spark(83,18),
'Ground Frost':p('M12 80h76','none',BROWN,5)+''.join(p(f'M{x} 70v-23m-9 11h18m-15-11 12 12m3-12-12 12','none',BLUE,3) for x in (27,49,70)),
'Thunderhead':cloud(48,41,'#9DAFCA')+bolt(51,67)+p('M29 72l-6 12m47-10-5 9','none',SEA,4),
'Tipping-Bucket Gauge':r(20,33,59,49,STONE,'#89969E',5,3)+p('M24 47h51l-24 20Z',SEA,'#699DAC',3)+p('M50 46v-21','none',DARK,5)+c(50,26,7,ROSE,'none',0),
'Snowdrift':cloud(53,24)+p('M12 77q19-39 38-9t39-3','none',BLUE,8)+p('M13 84h73','none',CREAM,7)+spark(72,42,BLUE),
'Sourdough Starter':r(26,29,47,54,'#B5E2DF','#7B9CA3',7,4)+p('M28 55q25-11 44 3v24H28Z',CREAM,'none',0)+''.join(c(x,y,3,'#D8BD8D','none',0) for x,y in ((40,63),(55,69),(64,59))),
'Sourdough':bread()+p('M24 72q27 14 52-5','none',CREAM,4)+c(22,24,4,GOLD,'none',0),
'Baguette':p('M18 73q-8-10 1-19l50-37q16-4 13 12L34 79q-9 5-16-6Z',GOLD,'#AA806B',4)+''.join(p(f'M{x} {y}l10 10','none',CREAM,4) for x,y in ((34,52),(49,40),(63,29))),
'Custard':e(50,69,34,12,CREAM,'#B58D7A',4)+p('M16 68q6-44 34-30 31-14 34 30Z',GOLD,'#BD917B',4)+c(50,45,6,CREAM,'none',0),
'Meringue':''.join(p(f'M{x-13} 79q-8-16 13-46 20 30 13 46Z',CREAM,'#CFB9A5',3) for x in (26,50,74))+spark(80,18),
'Fruit Tart':e(50,71,35,14,GOLD,'#AC8974',4)+e(50,64,29,10,CREAM,'#BCA68D',2)+''.join(c(x,y,7,col,'none',0) for x,y,col in ((31,61,ROSE),(52,57,MINT),(68,63,VIOLET),(48,69,ROSE))),
'Lemon Curd':r(31,34,40,47,GOLD,'#A89179',8,4)+e(50,34,21,6,CREAM,'#A89179',3)+p('M58 20q13 2 17 14l-20 2Z',GOLD,'#BE9A70',2)+leaf(24,26,MINT),
'Marmalade':r(25,28,51,56,ROSE,'#A68E7D',7,4)+r(23,24,55,10,CREAM,'#A68E7D',3,2)+c(50,54,14,GOLD,'#DBA772',2)+p('M50 40v27','none',CREAM,3),
'Crouton':e(50,77,35,9,'#E6E2D3','#A08F81',4)+''.join(r(x,y,18,15,GOLD,'#A9836A',3,2) for x,y in ((23,48),(50,43),(42,62))),
'Bread Crumbs':bread()+''.join(c(x,y,s,BROWN,'none',0) for x,y,s in ((25,82,3),(34,87,2),(50,89,3),(65,84,2),(76,79,3))),
'Anvil':p('M19 39h64q0 12-18 12H52v20h13v12H33V71h12V51H25Z',STONE,'#758894',4)+spark(77,24),
'Forge':r(17,37,65,46,STONE,'#A18C7D',5,4)+p('M31 77V57q8-23 20-8t19 28Z',ROSE,'#C68F78',3)+bolt(52,52),
'Tongs':p('M38 17q-11 10-4 25l16 41m12-66q11 11 4 25L50 83','none',STONE,7)+c(50,83,6,GOLD,'#927B76',2),
'Smithy':house()+r(61,60,16,18,STONE,'#8292A0',1,2)+p('M69 58 87 31','none',BROWN,5)+spark(86,28),
'Loom':r(21,18,58,64,BROWN,'#947C6C',4,5)+''.join(p(f'M{x} 20v60','none',CREAM,3) for x in range(30,76,9))+p('M23 48h54','none',ROSE,10),
'Spinning Wheel':gear(50,49,26)+p('M50 80v13M20 85h59','none',BROWN,5)+p('M75 39 85 29','none',ROSE,3),
'Yarn':c(50,52,30,VIOLET,'#8B81AB',4)+''.join(p(f'M{x} {y}q30-16 37 6','none','#E3D8EB',3) for x,y in ((25,38),(17,53),(21,66)))+p('M66 69q20 12 20 19','none',VIOLET,4),
'Wooden Plank':r(16,21,68,55,BROWN,'#936E5E',4,4)+p('M22 37h54m-54 18h54m-47-30q13 20 0 47m39-45q-14 21 1 44','none','#E2BD97',3),
'Sawdust':p('M15 82q23-30 41-15t29 15Z',CREAM,'#BCA084',4)+''.join(c(x,y,2,BROWN,'none',0) for x,y in ((35,71),(49,63),(61,79),(44,81),(75,77)))+p('M15 48 30 18','none',STONE,5),
'Workbench':r(14,44,72,13,BROWN,'#907363',3,4)+p('M25 58v29m51-29v29','none','#897365',7)+p('M29 33h43l-12-19','none',STONE,5)+gear(60,29,8),
'Drawbridge':p('M12 84v-49l19-20h38l19 20v49','none',STONE,12)+p('M27 83 72 56v21H27Z',BROWN,'#98786E',4)+p('M23 39 72 58','none',DARK,3),
'Watchtower':r(30,31,41,54,STONE,'#928B82',4,4)+p('M22 29 50 12 80 29Z',BROWN,'#957D71',4)+r(44,48,12,15,BLUE,'#7C98A8',2,2)+p('M21 85h60','none',GREEN,4),
'Lighthouse Beam':r(42,30,18,51,CREAM,'#A0928C',4,3)+p('M35 30 50 13 67 30Z',ROSE,'#AE8D80',3)+p('M59 31 93 15 90 61 59 45Z',GOLD,'none',0)+wave(87),
'Cobblestone':''.join(p(f'M{x} {y}q12-10 22 0v15H{x}Z',col,'#9E9B96',2) for x,y,col in ((12,52,STONE),(38,50,CREAM),(64,52,STONE),(23,72,CREAM),(52,71,STONE))),
'Rooftop Garden':house()+p('M16 42 50 15 84 42','none',GREEN,10)+''.join(small_leaf(x,26,.8) for x in (30,50,70)),
'Rain Garden':grass()+drop(51,39)+p('M16 82q29 13 68 0','none',SEA,5)+small_leaf(28,61,.8),
'Street Market':p('M13 43 26 23h48l13 20Z',CREAM,'#AE9386',4)+''.join(r(x,41,18,22,col,'#AC8E7D',2,2) for x,col in ((19,ROSE),(42,GOLD),(65,MINT)))+r(23,63,54,18,BROWN,'#957A6F',3,3),
'Fountain Pen':p('M27 77 64 18l16 11-40 56Z',INK,'#6C7C86',4)+p('M27 77l12-9 4 10Z',GOLD,'#A38268',2)+p('M63 20l15 10','none',CREAM,4)+spark(80,14),
'Town Square':r(15,61,70,23,STONE,'#A39C8F',3,3)+c(50,51,14,BLUE,'#7A9EAD',3)+p('M50 37v-15m-30 32h13m54 0H68','none',SEA,5)+sun(83,19,6),
'Water Tower':r(24,33,52,30,BLUE,'#7D9BA6',5,4)+p('M35 63v24m29-24v24M28 87h45','none',STONE,6)+p('M35 27h30','none','#C2DDE2',5)+drop(50,48),
'Photodiode':c(50,53,20,'#B5D9B5','#6B9C99',4)+p('M50 26v-9m-29 14-9-9m68 9 9-9','none',GOLD,5)+p('M39 54h21M50 43v23','none',INK,4),
'Infrared Sensor':r(22,30,56,48,STONE,'#8496A7',7,4)+c(50,53,17,ROSE,'#AD888F',3)+''.join(p(f'M{x} {y}l{dx} {dy}','none',ROSE,3) for x,y,dx,dy in ((34,23,-7,-9),(51,20,0,-11),(68,23,7,-9))),
'Thermostat':dial()+p('M40 75v10h20V75','none',STONE,5)+bolt(50,50),
'Solar Charger':panel()+p('M75 53h15v28H67V62','none',DARK,5)+bolt(80,68)+sun(83,16,7),
'Wind Vane':p('M50 82V22m-28 18h55','none',DARK,5)+p('M22 40 40 30v20ZM77 40 62 31v18Z',ROSE,'#A17C7D',2)+p('M36 85h28','none',STONE,5)+spark(79,19),
'Microcontroller':r(27,29,46,44,DARK,'#596E80',6,4)+''.join(p(f'M{x} 19v10m0 44v10','none',GOLD,3) for x in (39,50,61))+''.join(p(f'M17 {y}h10m46 0h10','none',GOLD,3) for y in (39,51,64))+c(50,50,9,BLUE,'none',0),
'Robot Arm':p('M26 84h45m-34-2 2-23 27-10-5-25 13-15','none',STONE,11)+c(39,60,10,GOLD,'#A18574',4)+c(66,49,9,GOLD,'#A18574',4)+p('M74 31l13 9-14 11','none',INK,5),
'Drone Camera':p('M26 42h48M50 35v39','none',INK,7)+''.join(e(x,38,15,5,STONE,'#819CAB',2) for x in (20,80))+r(38,50,24,20,DARK,'#8099A8',7,3)+c(50,60,8,BLUE,'none',0),
'Sound Meter':r(32,21,36,61,STONE,'#8196A1',6,4)+''.join(r(x,61-h,5,h,col,'none',2,0) for x,h,col in ((39,12,MINT),(48,24,GOLD),(57,36,ROSE)))+p('M37 74h27','none',DARK,3),
'Light Meter':dial()+sun(75,21,8)+p('M33 80h35','none',STONE,5)+spark(22,24,BLUE)
}
assert set(SC)=={i['name'] for i in pack['items']},(len(SC),[i['name'] for i in pack['items'] if i['name'] not in SC])
artmap={};manifest=[]
for item in pack['items']:
 name=item['name']; slug=item['id'].split(':',1)[1]
 shadow=e(50,94,29,3,'#8C8B89','none',0)
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'+shadow+SC[name]+'</svg>'
 if '<script' in svg or '<image' in svg:raise RuntimeError(name)
 path=ASSET/(slug+'.svg');path.write_text(svg)
 artmap[name.lower()]=svg
 manifest.append({'id':item['id'],'path':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(svg.encode()).hexdigest()})
assert len(set(artmap.values()))==80
(ROOT/'client/src/organic-art-v46.js').write_text('export const ORGANIC_ART_V46 = '+json.dumps(artmap,separators=(',',':'))+';\n')
(ROOT/'shared/v46-art-manifest.json').write_text(json.dumps({'release':'V46','icons':manifest},indent=2)+'\n')
print('80 distinct hand-composed illustrated offline SVGs')
