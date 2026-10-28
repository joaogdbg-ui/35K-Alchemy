#!/usr/bin/env python3
"""Generate a faithful inspection sheet from the exact SVGs shipped in 35K Alchemy V42."""
from pathlib import Path
import json,io
import cairosvg
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]
rows=json.loads((R/'client/src/organic-pack-v42.js').read_text().split(' = ',1)[1].rstrip(' ;\n'))['items']
cols=8; tilew=202;tileh=175;head=130;w=cols*tilew;h=head+8*tileh+22
im=Image.new('RGB',(w,h),'#f6f4f1');d=ImageDraw.Draw(im)
fonts=['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
fontp=next((x for x in fonts if Path(x).exists()),None)
regular=ImageFont.truetype(fontp,17) if fontp else ImageFont.load_default()
small=ImageFont.truetype(fontp,14) if fontp else regular
big=ImageFont.truetype(fontp,32) if fontp else regular
bold=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
d.text((36,23),'35K ALCHEMY  /  V42  ICON REVIEW',font=big,fill='#3b332f')
d.text((38,75),'64 original SVG illustrations  •  geology  /  wetlands  /  bakery  /  optics',font=regular,fill='#756c65')
for k,item in enumerate(rows):
 ix=k%cols;iy=k//cols;x=ix*tilew+8;y=head+iy*tileh
 d.rounded_rectangle((x,y,x+tilew-14,y+tileh-10),radius=14,fill='#ffffff',outline='#dfd8d1',width=2)
 png=cairosvg.svg2png(url=str(R/'client/assets/v42'/f"{item['id'].split(':')[1]}.svg"),output_width=112,output_height=112)
 icon=Image.open(io.BytesIO(png)).convert('RGBA');im.paste(icon,(x+(tilew-14-112)//2,y+7),icon)
 name=item['name'];anchor=(x+(tilew-14)//2, y+123)
 if d.textbbox((0,0),name,font=small)[2]>tilew-25:
  # wrap only at spaces to keep text readable
  words=name.split();split=len(words)//2;lines=[' '.join(words[:split]),' '.join(words[split:])]
  for j,line in enumerate(lines):d.text((anchor[0],anchor[1]-8+j*20),line,font=small,fill='#453d38',anchor='ma')
 else:d.text(anchor,name,font=small,fill='#453d38',anchor='ma')
 dest=R/'V42_Icon_Gallery.png'
im.save(dest,optimize=True)
print('Saved',dest,'resolution',im.size)
