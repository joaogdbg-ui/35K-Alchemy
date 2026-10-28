from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import cairosvg, io, json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'shared/v44-art-manifest.json').read_text())
cols=5; cardw=195;cardh=183;pad=17
rows=(len(manifest['icons'])+cols-1)//cols
im=Image.new('RGB',(cols*cardw+pad*2,rows*cardh+pad*2),(249,247,244))
d=ImageDraw.Draw(im)
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,15)
for i,rec in enumerate(manifest['icons']):
 x=pad+i%cols*cardw;y=pad+i//cols*cardh
 d.rounded_rectangle((x+5,y+5,x+cardw-9,y+cardh-8),radius=17,fill='#ffffff',outline='#e6dfd9',width=2)
 data=cairosvg.svg2png(bytestring=(root/rec['path']).read_bytes(),output_width=112,output_height=112)
 icon=Image.open(io.BytesIO(data)).convert('RGBA')
 im.paste(icon,(x+(cardw-112)//2,y+18),icon)
 label=rec['name']
 bbox=d.textbbox((0,0),label,font=font);tx=x+(cardw-bbox[2])/2
 d.text((tx,y+143),label,font=font,fill='#55473c')
out=root/'V44_Icon_Gallery.png';im.save(out,optimize=True)
print(out)
