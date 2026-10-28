#!/usr/bin/env python3
"""Produce 12 visually distinct ready-to-render static compositions for each original drawing.
No device-side image synthesis; sprites are pre-rendered WEBP with alpha for the standalone HTML.
"""
from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import math,base64,json,io
root=Path(__file__).resolve().parents[1]
folder=root/'client/assets/v27'
files=sorted(folder.glob('*.webp'))
COLORS=['#5EE7E4','#F3B65A','#F2789B','#B5A4F6','#7FE1A0','#F7D78C','#8BC9F5','#F3A48F','#BDE7FF','#CFB5F5','#FFE1A3','#74DFCE']
def rgb(hex):return tuple(bytes.fromhex(hex.lstrip('#')))

def decorate(base,variant):
 if variant==0:return base
 im=base.copy();w,h=im.size
 d=ImageDraw.Draw(im,'RGBA')
 # Deterministic illustrated accessories, not rotations of the same icon.
 hue=COLORS[variant];c=rgb(hue)
 x,y=132,33
 def poly(points,fill,stroke=(39,55,83,230),width=3):
  d.polygon(points,fill=fill)
  d.line(points+[points[0]],fill=stroke,width=width,joint='curve')
 def circle(x,y,r,fill,outline=(45,61,85,220),width=3):d.ellipse((x-r,y-r,x+r,y+r),fill=fill,outline=outline,width=width)
 def star(x,y,r1,r2,n=5):
  p=[(round(x+math.cos(i*math.pi/n-math.pi/2)*(r1 if i%2==0 else r2)),round(y+math.sin(i*math.pi/n-math.pi/2)*(r1 if i%2==0 else r2))) for i in range(n*2)]
  poly(p,c+(250,),width=3)
 if variant==1: # Crown crest
  poly([(113,44),(113,25),(123,34),(131,17),(140,35),(151,25),(151,46)],c+(250,))
  circle(132,41,4,(255,246,197,255),width=1)
 elif variant==2: # Blue zigzag lightning
  poly([(136,9),(113,38),(129,37),(120,65),(154,29),(137,29)],c+(245,))
 elif variant==3: # Flame burst
  poly([(130,10),(143,31),(151,17),(156,47),(141,60),(120,56),(113,40),(121,33)],c+(250,))
  poly([(133,27),(144,44),(134,54),(124,45)],(255,220,123,245),width=2)
 elif variant==4: # constellation
  star(131,32,21,9);star(106,49,8,3);star(149,59,7,3)
 elif variant==5: # verdant leaf
  d.ellipse((111,14,152,59),fill=c+(240,),outline=(44,89,74,250),width=3)
  d.line([(121,52),(144,24)],fill=(245,253,238,250),width=4)
  d.line([(133,40),(124,29)],fill=(245,253,238,250),width=3)
 elif variant==6: # gear cog
  for i in range(10):
   a=i*math.tau/10
   bx=x+math.cos(a)*25;by=y+math.sin(a)*25
   circle(bx,by,5,c+(255,),width=2)
  circle(x,y,23,c+(255,));circle(x,y,10,(234,248,246,255),width=2)
 elif variant==7: # mini crossed blades
  d.line([(111,21),(145,55)],fill=(46,60,84,255),width=11)
  d.line([(114,17),(147,52)],fill=c+(255,),width=7)
  d.line([(149,19),(115,55)],fill=(46,60,84,255),width=11)
  d.line([(146,17),(113,53)],fill=(205,243,251,255),width=7)
 elif variant==8: # gem crystal
  poly([(130,11),(150,33),(131,59),(110,32)],c+(240,))
  poly([(130,11),(132,58),(118,33)],(247,251,255,130),width=1)
 elif variant==9: # orbit / cosmic
  circle(x,y,11,c+(255,))
  d.ellipse((105,23,160,48),outline=c+(255,),width=5)
  circle(108,43,5,(255,237,155,255),width=1)
 elif variant==10: # award ribbon / shield
  poly([(121,21),(140,19),(154,39),(135,62),(113,41)],c+(255,))
  star(134,39,14,6)
 elif variant==11: # winged star
  poly([(111,36),(91,22),(101,47),(114,49)],(208,241,253,250))
  poly([(149,35),(164,20),(161,47),(147,51)],(208,241,253,250))
  star(132,40,22,10)
 return im

assets={}
sizes=[]
for f in files:
 base=Image.open(f).convert('RGBA')
 for v in range(12):
  im=decorate(base,v)
  name=f'{f.stem}~{v}'
  output=folder/(f'{name}.webp')
  im.save(output,format='WEBP',quality=78,method=4)
  b=output.read_bytes();sizes.append(len(b))
  assets[name]='data:image/webp;base64,'+base64.b64encode(b).decode('ascii')
js=root/'client/src/gameverse-art-v27-variants.js'
js.write_text('export const GAMEVERSE_ART_V27_VARIANTS = '+json.dumps(assets,separators=(',',':'))+';\n',encoding='utf8')
(root/'shared').mkdir(exist_ok=True)
(root/'shared/v27-art-stats.json').write_text(json.dumps({'hand_drawn_motifs':len(files),'pre_rendered_unique_images':len(assets),'compressed_asset_bytes':sum(sizes),'standalone_base64_bytes':js.stat().st_size},indent=2))
print('Icon stats:',len(files),'drawn,',len(assets),'pre-rendered static variants,',sum(sizes),'bytes')
