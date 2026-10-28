from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import io, json, cairosvg,math
R=Path(__file__).resolve().parents[1]
manifest=json.loads((R/'shared/v53-art-manifest.json').read_text())['icons']
cols=6;cellw=188;cellh=150;pad=18;head=86;rows=math.ceil(len(manifest)/cols)
im=Image.new('RGB',(cols*cellw+2*pad,head+rows*cellh+pad),(248,247,245));d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fontBold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
F=ImageFont.truetype(fontBold,24);S=ImageFont.truetype(font,12)
d.text((pad,18),'35K Alchemy — V53',font=F,fill=(55,50,47));d.text((pad,52),'48 new original static SVG icons  ·  Nature + Culture + Shared',font=S,fill=(117,104,92))
for i,item in enumerate(manifest):
 x=pad+(i%cols)*cellw;y=head+(i//cols)*cellh
 d.rounded_rectangle((x,y,x+cellw-9,y+cellh-10),radius=16,fill=(255,255,255),outline=(227,222,216),width=2)
 b=(R/item['path']).read_bytes();icon=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=b,output_width=92,output_height=92))).convert('RGBA')
 im.paste(icon,(x+43,y+9),icon)
 name=item['name'];bb=d.textbbox((0,0),name,font=S);tw=bb[2]-bb[0]
 if tw>cellw-17:
  pieces=name.split();lines=[''];
  for word in pieces:
   candidate=(lines[-1]+' '+word).strip();width=d.textbbox((0,0),candidate,font=S)[2]
   if width>cellw-20:lines.append(word)
   else:lines[-1]=candidate
  for q,line in enumerate(lines[:2]):
   w=d.textbbox((0,0),line,font=S)[2];d.text((x+(cellw-9-w)/2,y+107+q*13),line,font=S,fill=(63,57,53))
 else:d.text((x+(cellw-9-tw)/2,y+116),name,font=S,fill=(63,57,53))
out=R/'V53_Icon_Gallery.png';im.save(out,optimize=True);print(out,out.stat().st_size)
