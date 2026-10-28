"""Generate contact sheet for all 80 distinct V41 vector icons."""
from pathlib import Path
import subprocess,json,cairosvg,io
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]
js="import{ORGANIC_ART_V41}from'./client/src/organic-art-v41.js';import{ORGANIC_V41}from'./client/src/organic-pack-v41.js';console.log(JSON.stringify(ORGANIC_V41.items.map(i=>[i.name,ORGANIC_ART_V41[i.name.toLowerCase()]])))"
entries=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
W,H=160,149;COLS=8;ROWS=(len(entries)+COLS-1)//COLS
im=Image.new('RGB',(COLS*W+30,ROWS*H+110),'#F5F3EF');d=ImageDraw.Draw(im)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
title=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',27)
d.text((23,14),'35K Alchemy  /  V41',fill='#282727',font=title)
d.text((23,54),'80 original static SVGs  ·  Weather  /  Insects  /  Architecture  /  Maritime  /  Exploration',fill='#817A71',font=font)
for j,(name,svg) in enumerate(entries):
 col,row=j%COLS,j//COLS;x=15+col*W;y=93+row*H
 d.rounded_rectangle((x+4,y+3,x+W-4,y+H-6),radius=16,fill='white',outline='#DED8CF',width=2)
 pix=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode('utf8'),output_width=100,output_height=100))).convert('RGBA')
 im.paste(pix,(x+30,y+5),pix)
 bb=d.textbbox((0,0),name,font=font);tw=bb[2]-bb[0]
 d.text((x+(W-tw)//2,y+116),name,font=font,fill='#453C38')
out=ROOT/'V41_Icon_Gallery.png';im.save(out,optimize=True)
print(out,'icons',len(entries),'dimensions',im.size)
