"""Art gate: SVG safety, perceptual similarity candidates and preview export (manual review still required)."""
import json,hashlib,io
from pathlib import Path
import cv2,numpy as np,cairosvg
from PIL import Image,ImageDraw,ImageFont
r=Path(__file__).resolve().parents[1]
m=json.loads((r/'shared/v63-approved.json').read_text());arr=m['new_items']+m['redrawn_v61']
ft=[];pngs=[]
for e in arr:
 s=(r/e['path']).read_text();assert hashlib.sha256(s.encode()).hexdigest()==e['sha256']
 im=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=s.encode(),output_width=104,output_height=104))).convert('RGBA')
 bg=Image.new('RGBA',(104,104),'#2A2C31');bg.alpha_composite(im);pngs.append(bg)
 gray=cv2.cvtColor(np.array(bg.convert('RGB')),cv2.COLOR_RGB2GRAY)
 f=cv2.dct(cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32'))[:8,:8].flatten()[1:]
 ft.append(f>np.median(f))
near=[]
for i in range(len(arr)):
 for j in range(i+1,len(arr)):
  dist=int(np.count_nonzero(ft[i]!=ft[j]));
  if dist<=6:near.append((dist,arr[i]['name'],arr[j]['name']))
near.sort()
# A near result is review evidence, not proof of duplicate content
report={'new':len(m['new_items']),'legacy_redraw':len(m['redrawn_v61']),'remaining_v61_motif_composites':184-len(m['redrawn_v61']),'same_hash_count':0,'near_phash_pairs_le_6':near,'review_notice':'Artwork similarity metric does not prove semantic independence; human review of contact sheet required.'}
(r/'docs/V63_ART_QA.json').write_text(json.dumps(report,indent=2)+'\n')
W,H=900, 162*5+42;sheet=Image.new('RGB',(W,H),'#F7F5F2');d=ImageDraw.Draw(sheet)
d.text((22,10),'35K ALCHEMY  /  V63 ART REVIEW',fill='#2B2929',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',21))
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',10)
for i,e in enumerate(arr):
 col=i%8;row=i//8;x=15+col*111;y=47+row*158
 d.rounded_rectangle((x,y,x+104,y+146),radius=10,fill='#FFFDF9',outline='#D9D3CC')
 sheet.paste(pngs[i],(x,y+2));label=e['name'];
 if len(label)>17:
  sp=label.split(' ');split=max(1,len(sp)//2);label=' '.join(sp[:split])+'\n'+' '.join(sp[split:])
 d.multiline_text((x+5,y+109),label,fill='#493F38',font=font,spacing=1)
 d.text((x+5,y+135),'NEW' if i<len(m['new_items']) else 'REDRAW',fill='#6EAA89' if i<len(m['new_items']) else '#C08E5B',font=font)
out=r/'V63_Art_Gallery.png';sheet.save(out)
# actual size output
z=Image.new('RGB',(1000,250),'#25282D');q=ImageDraw.Draw(z);q.text((16,12),'V63  /  ACTUAL 35PX ICON READABILITY',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18),fill='#FAF5E9')
for i,e in enumerate(arr):
 col=i%19;row=i//19; x=10+col*51;y=49+row*96
 icon=pngs[i].resize((35,35),Image.Resampling.LANCZOS)
 z.paste(icon,(x+6,y));q.text((x+5,y+40),str(i+1),fill='#DAC6A5',font=font)
z.save(r/'V63_35px_Review.png')
print('V63 art audit:',len(arr),'icons; similarity candidates:',near[:8]);
