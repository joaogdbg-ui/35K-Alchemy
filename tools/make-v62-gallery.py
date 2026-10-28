#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import cairosvg,io,json
R=Path(__file__).resolve().parents[1]
j=json.loads((R/'shared/v62-approved.json').read_text())['results']; size=143; cols=7;rows=(len(j)+cols-1)//cols
sheet=Image.new('RGB',(cols*size+30,rows*177+68),(248,246,242));d=ImageDraw.Draw(sheet)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f=ImageFont.truetype(font,12); f2=ImageFont.truetype(font,19)
d.text((22,15),'35K ALCHEMY  /  V62  •  ART-FIRST COLLECTION',fill='#514841',font=f2)
for i,e in enumerate(j):
 x=15+(i%cols)*size;y=64+(i//cols)*177
 d.rounded_rectangle((x,y,x+132,y+133),radius=15,fill='#FFFFFF',outline='#DBD7D1',width=2)
 svg=(R/'client/assets/v62'/e['art']).read_bytes()
 png=cairosvg.svg2png(bytestring=svg,output_width=102,output_height=102)
 im=Image.open(io.BytesIO(png)).convert('RGBA');sheet.paste(im,(x+15,y+11),im)
 name=e['name'];spl=name.split();line='';lines=[]
 for word in spl:
  if len(line+' '+word)>18 and line:lines.append(line);line=word
  else:line=(line+' '+word).strip()
 lines.append(line)
 for z,t in enumerate(lines[:2]):d.text((x+5,y+138+z*15),t,fill='#655D56',font=f)
output=R/'V62_Art_Gallery.png';sheet.save(output,optimize=True);print(output)
# dedicated small-size sheet to test 35px legibility
scale=104;out=Image.new('RGB',(cols*scale+24,rows*112+54),(43,43,48));d=ImageDraw.Draw(out)
d.text((17,13),'35 px legibility on DARK UI',font=f2,fill='#F3E9DE')
for i,e in enumerate(j):
 x=12+(i%cols)*scale;y=52+(i//cols)*112
 d.rounded_rectangle((x,y,x+98,y+78),radius=12,outline='#565459',fill='#33343A',width=2)
 im=Image.open(io.BytesIO(cairosvg.svg2png(url=str(R/'client/assets/v62'/e['art']),output_width=35,output_height=35))).convert('RGBA')
 out.paste(im,(x+32,y+19),im)
 d.text((x+5,y+83),e['name'][:16],font=ImageFont.truetype(font,9),fill='#E1D8D0')
out.save(R/'V62_35px_Dark_Review.png',optimize=True)
