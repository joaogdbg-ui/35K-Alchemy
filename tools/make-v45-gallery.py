from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import cairosvg,io,json
root=Path(__file__).resolve().parents[1];m=json.loads((root/'shared/v45-art-manifest.json').read_text())
cols=4;w=205;h=190;pad=18
im=Image.new('RGB',(cols*w+2*pad,3*h+2*pad),'#f9f7f4');d=ImageDraw.Draw(im)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
for i,rec in enumerate(m['icons']):
 x=pad+(i%cols)*w;y=pad+(i//cols)*h
 d.rounded_rectangle((x+4,y+4,x+w-8,y+h-9),radius=17,fill='white',outline='#e6dfd9',width=2)
 png=cairosvg.svg2png(bytestring=(root/rec['path']).read_bytes(),output_width=116,output_height=116)
 image=Image.open(io.BytesIO(png)).convert('RGBA');im.paste(image,(x+(w-116)//2,y+14),image)
 label=rec['id'].split(':')[1].replace('-',' ').title()
 d.text((x+(w-d.textbbox((0,0),label,font=font)[2])/2,y+145),label,fill='#4e4139',font=font)
im.save(root/'V45_Icon_Gallery.png',optimize=True)
print('V45 icon gallery saved')
