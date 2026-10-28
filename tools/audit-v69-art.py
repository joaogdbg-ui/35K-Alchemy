#!/usr/bin/env python3
"""V69 SVG audit: validate 76 subjects and render 35px Light/Dark evidence.

Automated similarity screening is not a substitute for human recognizability QA.
"""
from pathlib import Path
import json,hashlib,io,sys
import cv2,numpy as np,cairosvg
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'shared/v69-approved.json').read_text())
entries=m['redrawn_v61']
assert len(entries)==76
art=[];features=[];seen=set()
for e in entries:
    src=(root/e['path']).read_text(encoding='utf-8')
    sha=hashlib.sha256(src.encode()).hexdigest()
    assert sha==e['sha256'] and sha not in seen,('SVG SHA failure',e['name'])
    seen.add(sha)
    assert not any(token in src for token in ('<script','<image','<text','<foreignObject','onload='))
    raw=cairosvg.svg2png(bytestring=src.encode(),output_width=112,output_height=112)
    image=Image.open(io.BytesIO(raw)).convert('RGBA');art.append(image)
    bg=Image.new('RGBA',(112,112),'#292C32');bg.alpha_composite(image)
    gray=cv2.cvtColor(np.asarray(bg.convert('RGB')),cv2.COLOR_RGB2GRAY)
    dct=cv2.dct(cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32'))[:8,:8].flatten()[1:]
    features.append(dct>np.median(dct))
near=[]
for i in range(len(entries)):
    for j in range(i+1,len(entries)):
        distance=int(np.count_nonzero(features[i]!=features[j]))
        if distance<=8:near.append({'distance':distance,'a':entries[i]['name'],'b':entries[j]['name']})
near.sort(key=lambda p:p['distance'])
assert not near, ('V69 batch contains possible too-similar icons; editorial review required',near[:5])
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
boldpath='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font=ImageFont.truetype(fontpath,11)
bold=ImageFont.truetype(boldpath,18)
sheet=Image.new('RGB',(1128,56+10*177),'#F7F5F2');pen=ImageDraw.Draw(sheet)
pen.text((14,9),'35K ALCHEMY — V69 / 76 BESPOKE V61 REDRAWS',font=ImageFont.truetype(boldpath,22),fill='#33312D')
for i,(e,img) in enumerate(zip(entries,art)):
    x=12+(i%8)*140;y=57+(i//8)*177
    pen.rounded_rectangle((x,y,x+130,y+164),radius=12,fill='#FFFDF8',outline='#DCCABD',width=2)
    bg=Image.new('RGBA',(114,114),'#292C32');bg.alpha_composite(img,(1,1))
    sheet.paste(bg.convert('RGB'),(x+8,y+6))
    lines=[];cur=''
    for word in e['name'].split():
        if len(cur+' '+word)>17:lines.append(cur);cur=word
        else:cur=(cur+' '+word).strip()
    if cur:lines.append(cur)
    pen.multiline_text((x+7,y+123),'\n'.join(lines[:3]),fill='#423B34',font=font,spacing=2)
    pen.text((x+7,y+150),'REDRAW',font=font,fill='#A88674')
sheet.save(root/'V69_Art_Gallery.png')
for theme,bg in [('Dark','#292C32'),('Light','#F7F5F2')]:
    preview=Image.new('RGB',(950,52+7*95),bg);draw=ImageDraw.Draw(preview)
    color='#F5EFE6' if theme=='Dark' else '#302C29'
    draw.text((14,10),f'35K ALCHEMY · V69 · REAL 35 px · {theme.upper()}',font=bold,fill=color)
    for i,img in enumerate(art):
        x=16+(i%12)*78;y=52+(i//12)*95
        small=img.resize((35,35),Image.Resampling.LANCZOS)
        cell=Image.new('RGBA',(60,60),bg);cell.alpha_composite(small,(12,7))
        preview.paste(cell.convert('RGB'),(x,y))
        draw.text((x+23,y+61),str(i+1),font=font,fill=color)
    preview.save(root/f'V69_35px_{theme}_Review.png')
report={'count':76,'identical_svg_sha256':0,'perceptual_pairs_at_distance_le_8':near,
        'actual_motif_composites_still_queued':14,
        'review_method':'Full gallery and actual 35px sheets in dark and light; visually inspect each item',
        'limitations':'Automated pHash tests do not prove subjective meaning, recognizability or originality'}
(root/'docs/V69_ART_QA.json').write_text(json.dumps(report,indent=2)+'\n')
print('V69 ART PASS:',len(entries),'original icon SVGs; zero exact or <=8 pHash pairs; 14 earlier miscounted generic motifs remain')
