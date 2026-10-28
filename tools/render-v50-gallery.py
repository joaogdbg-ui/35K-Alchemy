from pathlib import Path
import json,io
from PIL import Image,ImageDraw,ImageFont
import cairosvg
r=Path(__file__).resolve().parents[1]
def read_js(path):
 s=path.read_text();return json.loads(s[s.index('=')+1:].strip().rstrip(';'))
art=read_js(r/'client/src/organic-art-v50.js');pack=read_js(r/'client/src/organic-pack-v50.js')
cols=4;w,h=320,262
W,H=cols*w+40,3*h+105
im=Image.new('RGB',(W,H),'#F7F5F1');d=ImageDraw.Draw(im)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
fontsmall=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
fonttitle=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
d.text((37,26),'35K Alchemy  /  V50',font=fonttitle,fill='#292521')
d.text((38,67),'12 new elements  ·  12 original SVG illustrations',font=fontsmall,fill='#897F77')
for i,it in enumerate(pack['items']):
 x=20+(i%cols)*w;y=105+(i//cols)*h
 d.rounded_rectangle((x+12,y+8,x+w-12,y+h-12),radius=19,fill='#FFFFFF',outline='#E5DFD8',width=2)
 svg=art[it['name'].lower()]
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=170,output_height=170)
 icon=Image.open(io.BytesIO(png)).convert('RGBA');im.paste(icon,(x+(w-170)//2,y+23),icon)
 lab=it['name'];bbox=d.textbbox((0,0),lab,font=font);tw=bbox[2]-bbox[0]
 d.text((x+(w-tw)//2,y+211),lab,font=font,fill='#3B3431')
im.save(r/'V50_Icon_Gallery.png',quality=95)
print('Created',r/'V50_Icon_Gallery.png')
