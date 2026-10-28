from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import cairosvg,io
P=Path(__file__).resolve().parents[1]
cols=4; cellw=242; cellh=235; top=107; margin=24
names=['smoke','ash','sandstorm','wildfire','puddle','soot','smog','mudslide','sunshower','haze','slush','charcoal']
W=cols*cellw+2*margin;H=top+3*cellh+margin
im=Image.new('RGB',(W,H),'#F5F3F1');d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
try:hdr=ImageFont.truetype(font,28);ft=ImageFont.truetype(font,18);small=ImageFont.truetype(font,13)
except:hdr=ImageFont.load_default();ft=hdr;small=hdr
d.text((margin,23),'35K Alchemy  /  V43',font=hdr,fill='#2D2B2A');d.text((margin,68),'12 new hand-authored, offline SVG illustrations',font=small,fill='#7F7771')
for i,name in enumerate(names):
 row,col=divmod(i,cols); x=margin+col*cellw;y=top+row*cellh
 d.rounded_rectangle((x,y,x+cellw-12,y+cellh-12),radius=16,fill='white',outline='#E4DFD8',width=2)
 png=cairosvg.svg2png(url=str(P/'client/assets/v43'/f'{name}.svg'),output_width=146,output_height=146)
 art=Image.open(io.BytesIO(png)).convert('RGBA');im.paste(art,(x+(cellw-12-146)//2,y+13),art)
 title=name.replace('-',' ').title();bbox=d.textbbox((0,0),title,font=ft)
 d.text((x+(cellw-12-(bbox[2]-bbox[0]))//2,y+176),title,font=ft,fill='#3D3935')
output=P/'V43_Icon_Gallery.png';im.save(output)
print('Saved',output)
