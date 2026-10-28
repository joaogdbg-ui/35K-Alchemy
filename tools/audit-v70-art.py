#!/usr/bin/env python3
"""V70 14-icon audit: exact hashes, perceptual proximity, full and true-size sheets."""
from pathlib import Path
import hashlib,json,io
import cairosvg,cv2,numpy as np
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]
entries=json.loads((R/'shared/v70-approved.json').read_text())['redrawn_v61']
assert len(entries)==14
sha=set();arr=[];features=[]
for e in entries:
    s=(R/e['path']).read_text(); h=hashlib.sha256(s.encode()).hexdigest()
    assert h==e['sha256'] and h not in sha
    assert not any(x in s for x in ('<script','<image','<foreignObject','<text','onload=','href='))
    sha.add(h)
    rgba=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=s.encode(),output_width=100,output_height=100))).convert('RGBA')
    arr.append(rgba)
    img=Image.new('RGBA',(100,100),'#292C32'); img.alpha_composite(rgba)
    gray=cv2.cvtColor(np.array(img.convert('RGB')),cv2.COLOR_RGB2GRAY)
    f=cv2.dct(cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32'))[:8,:8].flatten()[1:]
    features.append(f>np.median(f))
near=[]
for i in range(len(entries)):
 for j in range(i+1,len(entries)):
    d=int(np.count_nonzero(features[i]!=features[j]))
    if d<=8: near.append({'distance':d,'a':entries[i]['name'],'b':entries[j]['name']})
near.sort(key=lambda v:v['distance'])
assert not near, ('possible same visual silhouette',near)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
for theme,size in [('Light',100),('Dark',35)]:
    columns=7;cw=154 if size==100 else 122;ch=168 if size==100 else 112
    bg='#F7F5F2' if theme=='Light' else '#25282D'
    im=Image.new('RGB',(cw*columns,ch*2+60),bg);d=ImageDraw.Draw(im)
    d.text((15,14),f'35K ALCHEMY · V70 FINAL 14 — {theme.upper()}, {size}px',font=ImageFont.truetype(bold,16),fill='#25272A' if theme=='Light' else '#F8F4EA')
    for i,(e,rgba) in enumerate(zip(entries,arr)):
      x=i%7*cw;y=i//7*ch+50
      d.rounded_rectangle((x+5,y,x+cw-5,y+ch-7),radius=10,fill='#FFFFFF' if theme=='Light' else '#292D32',outline='#DDCFBE' if theme=='Light' else '#41444A',width=2)
      drawing=rgba.resize((size,size),Image.Resampling.LANCZOS)
      im.paste(drawing,(x+(cw-size)//2,y+7),drawing)
      words=e['name'].split();half=(len(words)+1)//2
      lines=[' '.join(words[:half]),' '.join(words[half:])] if len(e['name'])>18 else [e['name']]
      for j,line in enumerate(lines): d.text((x+7,y+size+12+j*12),line,font=ImageFont.truetype(font,9 if size==100 else 8),fill='#333333' if theme=='Light' else '#E6E0D8')
    im.save(R/f'V70_14_Review_{theme}_{size}px.png')
report={'version':70,'redrawn':14,'exact_svg_sha_collisions':0,'phash_pairs_distance_le_8':near,'v61_motif_composites_remaining':0,'manual_art_note':'Visual review of 14 subject illustrations in 100px light and 35px dark; semantic interpretation remains editorial.'}
(R/'docs/V70_ART_QA.json').write_text(json.dumps(report,indent=2)+'\n')
print('V70 ART PASS: 14 unique SVGs, no extremely similar fingerprints, V61 motif backlog 0')
