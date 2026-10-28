from pathlib import Path
import json,io
import cairosvg
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]
rows=json.loads((R/'shared/v61-approved-200.json').read_text())['results']
assert len(rows)==200
W=1800; columns=10; cw=180;ch=149;title_h=100;band_h=34
H=title_h+10*(2*ch+band_h)+24
im=Image.new('RGB',(W,H),'#f7f5f1');d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
large=ImageFont.truetype(font,33);medium=ImageFont.truetype(font,20);small=ImageFont.truetype(font,12)
d.text((30,23),'35K Alchemy  •  V61 — 200 new icons',font=large,fill='#2d2926')
d.text((33,68),'Original local SVG compositions · 10 thematic branches · offline',font=small,fill='#81776c')
for g in range(10):
 ybase=title_h+g*(2*ch+band_h)
 d.rounded_rectangle((16,ybase,W-16,ybase+band_h-5),radius=9,fill='#e9e2d9')
 d.text((30,ybase+4),rows[g*20]['branch'].upper(),font=medium,fill='#655449')
 for j in range(20):
  row=rows[g*20+j];index=g*20+j;col=j%10;line=j//10
  x=col*cw;y=ybase+band_h+line*ch
  d.rounded_rectangle((x+9,y+7,x+cw-9,y+ch-6),radius=13,fill='#fffdf9',outline='#e8dfd4',width=2)
  svg=(R/'client/assets/v61'/row['icon']).read_text()
  png=cairosvg.svg2png(bytestring=svg.encode(),output_width=100,output_height=100)
  ico=Image.open(io.BytesIO(png)).convert('RGBA');im.paste(ico,(x+40,y+9),ico)
  name=row['name']
  # up to 2 lines fitted, no ellipsis in underlying asset
  if len(name)>22:
   cut=name.rfind(' ',0,22)
   if cut==-1:cut=22
   lines=[name[:cut].strip(),name[cut:].strip()]
  else:lines=[name]
  if len(lines)>2:lines=lines[:2]
  if len(lines)==2 and len(lines[1])>22:lines[1]=lines[1][:21]+'…'
  for k,label in enumerate(lines):
   bbox=d.textbbox((0,0),label,font=small);tx=x+(cw-(bbox[2]-bbox[0]))/2
   d.text((tx,y+111+k*14),label,font=small,fill='#534a43')
out=R/'V61_Icon_Gallery.png';im.save(out,optimize=True)
print(out,out.stat().st_size)
