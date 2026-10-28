from pathlib import Path
import json,io,math
import cairosvg
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
pack=json.loads((root/'client/src/organic-pack-v47.js').read_text().split('=',1)[1].strip().rstrip(';'))
items=pack['items'];W=1320;cols=8;cw=165;ch=145;rows=math.ceil(len(items)/cols)
out=Image.new('RGB',(W,rows*ch+82),'#F7F5F1');d=ImageDraw.Draw(out)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';f=ImageFont.truetype(font,13);title=ImageFont.truetype(font,26)
d.text((24,19),'35K Alchemy  /  V47  —  80 new elements',font=title,fill='#34302D')
for k,item in enumerate(items):
 x=k%cols*cw;y=k//cols*ch+82
 d.rounded_rectangle((x+6,y+5,x+cw-6,y+ch-6),radius=15,fill='white',outline='#E0DBD6',width=2)
 path=root/'client/assets/v47'/f"{item['id'].split(':')[1]}.svg"
 icon=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=path.read_bytes(),output_width=100,output_height=100))).convert('RGBA')
 out.paste(icon,(x+(cw-100)//2,y+8),icon)
 name=item['name'];lines=[]
 while name:
  if d.textbbox((0,0),name,font=f)[2]<=cw-14:lines.append(name);break
  idx=name.rfind(' ',0,max(6,len(name)//2+5))
  if idx<1:idx=12
  lines.append(name[:idx]);name=name[idx:].strip()
 for ii,line in enumerate(lines[:2]):
  w=d.textbbox((0,0),line,font=f)[2];d.text((x+(cw-w)//2,y+107+ii*15),line,font=f,fill='#5D5550')
dest=root/'V47_Icon_Gallery.png';out.save(dest,optimize=True);print(dest)
