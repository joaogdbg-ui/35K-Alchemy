from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import cairosvg,io
ROOT=Path(__file__).resolve().parents[1]
orig=Path('/mnt/data/v61work/35K_Alchemy_V61_Project/client/assets/v61')
new=ROOT/'client/assets/v61'
selected=[p.stem for p in sorted((ROOT/'client/assets/v61-art-directed').glob('*.svg'))]
W=1200;cols=4;cw=300;rh=192;rows=(len(selected)+3)//4
img=Image.new('RGB',(W,78+rows*rh),(250,247,241));draw=ImageDraw.Draw(img)
try:head=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
except:head=font=None
draw.text((25,18),'35K ALCHEMY  •  16 icon art-direction prototypes',fill=(39,38,35),font=head)
draw.text((26,48),'LEFT: former V61 motif collage    /    RIGHT: custom distinct silhouette',fill=(117,103,90),font=font)
for index,name in enumerate(selected):
 x=(index%cols)*cw;y=78+(index//cols)*rh
 draw.rounded_rectangle((x+7,y+5,x+cw-7,y+rh-7),radius=12,fill=(255,255,255),outline=(219,211,199),width=1)
 for j,path in enumerate([orig/(name+'.svg'),new/(name+'.svg')]):
  raw=path.read_bytes()
  a=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=raw,output_width=110,output_height=110))).convert('RGBA')
  bg=Image.new('RGBA',(110,110),(255,255,255,255));bg.alpha_composite(a)
  img.paste(bg.convert('RGB'),(x+24+132*j,y+36))
  draw.text((x+39+132*j,y+16),'Before' if j==0 else 'After',fill=(135,99,76) if j else (139,139,139),font=font)
 text=name.replace('-',' ').title()
 if len(text)>28:text=text[:27]+'…'
 draw.text((x+18,y+154),text,fill=(51,48,44),font=font)
img.save(ROOT/'V61_Art_Direction_Before_After.png',optimize=True)
print(ROOT/'V61_Art_Direction_Before_After.png')
