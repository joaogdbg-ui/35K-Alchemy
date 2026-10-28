"""Preview sheet for art QA, not a runtime asset."""
import subprocess,json,cairosvg,io
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
root=Path(__file__).resolve().parents[1]
js="import{ORGANIC_ART_V38}from'./client/src/organic-art-v38.js';import{ORGANIC_V38}from'./client/src/organic-pack-v38.js';console.log(JSON.stringify(ORGANIC_V38.items.map(i=>[i.name,ORGANIC_ART_V38[i.name.toLowerCase()]])))"
arr=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=root,text=True))
cellw,cellh=158,153; cols=6; rows=(len(arr)+cols-1)//cols
im=Image.new('RGB',(cols*cellw+32,rows*cellh+96),(245,244,241));d=ImageDraw.Draw(im)
try:
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
 titlefont=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',24)
except:font=ImageFont.load_default();titlefont=font
d.text((23,15),'35K Alchemy  /  V38',fill=(37,35,34),font=titlefont)
d.text((23,52),'78 original vector icons  •  light + dark compatible',fill=(95,89,82),font=font)
for idx,(name,svg) in enumerate(arr):
 col,row=idx%cols,idx//cols;x=16+col*cellw;y=89+row*cellh
 d.rounded_rectangle((x+4,y+3,x+cellw-4,y+cellh-7),radius=15,fill=(255,255,255),outline=(222,217,209),width=2)
 asset=cairosvg.svg2png(bytestring=svg.encode('utf8'),output_width=99,output_height=99)
 pic=Image.open(io.BytesIO(asset)).convert('RGBA');im.paste(pic,(x+(cellw-99)//2,y+8),pic)
 w=d.textbbox((0,0),name,font=font)[2]
 d.text((x+cellw//2-w//2,y+118),name,fill=(59,52,46),font=font)
path=root/'V38_icon_gallery.png';im.save(path,optimize=True)
print(path,im.size)
