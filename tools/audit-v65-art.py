#!/usr/bin/env python3
"""V65 artwork contact sheets, tiny-icon readability, structural and perceptual checks."""
import json,hashlib,io
from pathlib import Path
import numpy as np,cv2,cairosvg
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]
m=json.loads((R/'shared/v65-approved.json').read_text());entries=m['new_items']+m['redrawn_v61']
features=[];art=[];hashes=set()
for e in entries:
 s=(R/e['path']).read_text()
 sha=hashlib.sha256(s.encode()).hexdigest();assert sha==e['sha256'] and sha not in hashes;hashes.add(sha)
 assert not any(x in s for x in ('<script','<image','<text','<foreignObject','onload='))
 raw=cairosvg.svg2png(bytestring=s.encode(),output_width=100,output_height=100)
 im=Image.open(io.BytesIO(raw)).convert('RGBA')
 bg=Image.new('RGBA',(100,100),'#292C32');bg.alpha_composite(im);art.append(bg)
 gray=cv2.cvtColor(np.asarray(bg.convert('RGB')),cv2.COLOR_RGB2GRAY)
 f=cv2.dct(cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32'))[:8,:8].flatten()[1:]
 features.append(f>np.median(f))
near=[]
for i in range(len(entries)):
 for j in range(i+1,len(entries)):
  d=int(np.count_nonzero(features[i]!=features[j]));
  if d<=6:near.append(dict(distance=d,first=entries[i]['name'],second=entries[j]['name']))
near.sort(key=lambda e:e['distance'])
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
W=960;rows=(len(entries)+7)//8; H=38+rows*146
img=Image.new('RGB',(W,H),'#F7F5F1');d=ImageDraw.Draw(img)
d.text((16,9),'35K ALCHEMY — V65 SUBJECT ICONS',font=ImageFont.truetype(bold,18),fill='#342F2E')
for i,e in enumerate(entries):
 col=i%8;row=i//8;x=10+col*119;y=40+row*146
 d.rounded_rectangle((x,y,x+112,y+136),radius=12,fill='#FFFDF9',outline='#DDCEC1',width=2)
 img.paste(art[i].convert('RGB').resize((96,96)),(x+8,y+5))
 n=e['name'];words=n.split();lines=[];chunk=''
 for w in words:
  if len(chunk+' '+w)>17:lines.append(chunk);chunk=w
  else:chunk=(chunk+' '+w).strip()
 if chunk:lines.append(chunk)
 d.multiline_text((x+5,y+102),'\n'.join(lines[:2]),font=ImageFont.truetype(font,10),fill='#3B3530',spacing=0)
 d.text((x+5,y+126),'NEW' if i<12 else 'REDRAW',font=ImageFont.truetype(bold,8),fill='#638D70' if i<12 else '#A67754')
img.save(R/'V65_Art_Gallery.png')
actual=Image.new('RGB',(960,198),'#25282D');dr=ImageDraw.Draw(actual)
dr.text((16,10),'V65 — ACTUAL 35PX SIZE • DARK MODE',font=ImageFont.truetype(bold,18),fill='#FFF9E8')
for i,e in enumerate(entries):
 col=i%16;row=i//16; x=12+col*59;y=43+row*74
 small=art[i].resize((35,35),Image.Resampling.LANCZOS)
 actual.paste(small.convert('RGB'),(x,y));dr.text((x+4,y+38),str(i+1),font=ImageFont.truetype(font,10),fill='#D1C3AD')
actual.save(R/'V65_35px_Review.png')
report={'new_icons':12,'redrawn_legacy':20,'remaining_v61_generic':144,'exact_duplicates':0,'similarity_candidates_distance_6_or_less':near,'note':'Similarity test is a screen, not a substitute for reviewing recognizability and originality at 35 px.'}
(R/'docs/V65_ART_QA.json').write_text(json.dumps(report,indent=2)+'\n')
print('V65 ART AUDIT:',len(entries),'icons;',len(near),'pHash review candidates',near[:6])
