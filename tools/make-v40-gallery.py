"""One-file offline art proofing reference for the 64 new bespoke icons."""
import subprocess,json,cairosvg,io
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
js="import{ORGANIC_ART_V40}from'./client/src/organic-art-v40.js';import{ORGANIC_V40}from'./client/src/organic-pack-v40.js';console.log(JSON.stringify(ORGANIC_V40.items.map(i=>[i.name,ORGANIC_ART_V40[i.name.toLowerCase()]])))"
entries=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
W,H=160,148;COLS=8;ROWS=(len(entries)+COLS-1)//COLS
im=Image.new('RGB',(COLS*W+30,ROWS*H+110),'#f6f3ef');d=ImageDraw.Draw(im)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
title=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',27)
d.text((23,14),'35K Alchemy  /  V40',fill='#282727',font=title)
d.text((23,54),'64 original SVGs · Astronomy · Woodland · Music · Machines & craft',fill='#817a71',font=font)
for j,(name,svg) in enumerate(entries):
 col,row=j%COLS,j//COLS;x=15+col*W;y=93+row*H
 d.rounded_rectangle((x+4,y+3,x+W-4,y+H-6),radius=16,fill='white',outline='#ded8cf',width=2)
 pix=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode('utf8'),output_width=100,output_height=100))).convert('RGBA')
 im.paste(pix,(x+30,y+5),pix)
 bb=d.textbbox((0,0),name,font=font);tw=bb[2]-bb[0]
 d.text((x+(W-tw)//2,y+116),name,font=font,fill='#453c38')
out=ROOT/'V40_Icon_Gallery.png';im.save(out,optimize=True)
print(out,'icons',len(entries),'dimensions',im.size)
