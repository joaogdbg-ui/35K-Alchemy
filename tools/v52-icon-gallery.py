#!/usr/bin/env python3
from pathlib import Path
import io,json,math
import cairosvg
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
plan=json.loads((root/'shared/v52-editorial-plan.json').read_text())
items=plan['items'];cols=8;cw=158;ch=166;pad=25;rows=math.ceil(len(items)/cols)
canvas=Image.new('RGB',(cols*cw+pad*2,rows*ch+pad*2+95),'#F9F5F0')
d=ImageDraw.Draw(canvas)
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,12);titlefont=ImageFont.truetype(fontpath,28);small=ImageFont.truetype(fontpath,14)
d.text((pad,14),'35K Alchemy — V52',font=titlefont,fill='#33343B')
d.text((pad,51),'48 new illustrations · 96 new-first recipes · 8 multi-family discoveries',font=small,fill='#75777B')
for idx,item in enumerate(items):
 col,row=idx%cols,idx//cols;x=pad+col*cw;y=pad+row*ch+96
 d.rounded_rectangle((x+4,y+2,x+cw-7,y+ch-6),radius=16,fill='white',outline='#DFD8D1',width=2)
 svg=(root/'client/assets/v52'/f"{item['id'].split(':')[1]}.svg").read_text()
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=103,output_height=103)
 art=Image.open(io.BytesIO(png)).convert('RGBA');canvas.paste(art,(x+27,y+9),art)
 name=item['name'];parts=name.split(' ');lines=[];line=''
 for p in parts:
  candidate=(line+' '+p).strip()
  if d.textlength(candidate,font=font)>cw-18 and line:lines.append(line);line=p
  else:line=candidate
 if line:lines.append(line)
 for q,ln in enumerate(lines[:2]):
  tw=d.textlength(ln,font=font);d.text((x+cw/2-tw/2,y+116+q*15),ln,font=font,fill='#454047')
out=root/'V52_Icon_Gallery.png';canvas.save(out,optimize=True)
print(out)
