from pathlib import Path
import json,io
import cairosvg
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]
items=json.loads((R/'shared/v55-editorial-plan.json').read_text())['items']
cols=10;cell_w=155;cell_h=157;header_h=105
img=Image.new('RGB',(cols*cell_w,header_h+10*cell_h+44),(248,246,242))
draw=ImageDraw.Draw(img)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font_b='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
fb=ImageFont.truetype(font_b,25);fn=ImageFont.truetype(font,12)
draw.text((38,22),'35K Alchemy  |  V55',fill=(50,43,40),font=fb)
draw.text((39,61),'100 new discoveries — 100 distinct offline SVG illustrations',fill=(118,108,101),font=ImageFont.truetype(font,17))
for i,item in enumerate(items):
 x=(i%cols)*cell_w;y=header_h+(i//cols)*cell_h
 draw.rounded_rectangle((x+6,y+5,x+cell_w-7,y+cell_h-7),radius=16,fill=(255,255,255),outline=(229,221,214),width=2)
 svg=(R/'client/assets/v55'/ (item['id'].split(':')[1]+'.svg')).read_text()
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=94,output_height=94)
 piece=Image.open(io.BytesIO(png)).convert('RGBA');img.paste(piece,(x+30,y+10),piece)
 name=item['name']
 if draw.textbbox((0,0),name,font=fn)[2]>cell_w-14:
  words=name.split();lines=[];buf=''
  for word in words:
   test=buf+' '+word if buf else word
   if draw.textbbox((0,0),test,font=fn)[2] > cell_w-18 and buf:lines.append(buf);buf=word
   else:buf=test
  if buf:lines.append(buf)
 else:lines=[name]
 for k,line in enumerate(lines[:2]):
  box=draw.textbbox((0,0),line,font=fn);dw=box[2]-box[0];draw.text((x+(cell_w-dw)/2,y+107+k*16),line,font=fn,fill=(69,63,60))
img.save(R/'V55_Icon_Gallery.png',optimize=True)
print('Gallery',img.size)
