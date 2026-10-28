#!/usr/bin/env python3
"""V62 art gate: strict structural checks + perceptual similarity review queue, not a human creativity oracle."""
from pathlib import Path
from collections import Counter
import hashlib,json,io
import cairosvg,cv2,numpy as np
from PIL import Image
R=Path(__file__).resolve().parents[1]
j=json.loads((R/'shared/v62-art-manifest.json').read_text())['icons']
assert len(j)==35
features=[];hashes=set();modes=Counter()
for e in j:
 s=(R/e['path']).read_text()
 h=hashlib.sha256(s.encode()).hexdigest();assert h==e['sha256'] and h not in hashes;hashes.add(h)
 assert '<image' not in s and '<text' not in s and '<script' not in s
 modes[e['art_mode']]+=1
 png=cairosvg.svg2png(bytestring=s.encode(),output_width=96,output_height=96)
 rgba=Image.open(io.BytesIO(png)).convert('RGBA');white=Image.new('RGBA',(96,96),'white');white.alpha_composite(rgba)
 gray=cv2.cvtColor(np.asarray(white.convert('RGB')),cv2.COLOR_RGB2GRAY)
 flat=cv2.dct(cv2.resize(gray,(32,32),interpolation=cv2.INTER_AREA).astype('float32'))[:8,:8].flatten()[1:]
 features.append(flat>np.median(flat))
near=[]
for i in range(len(j)):
 for k in range(i+1,len(j)):
  d=int(np.count_nonzero(features[i]!=features[k]));
  if d<=6:near.append({'distance':d,'first':j[i]['name'],'second':j[k]['name']})
near.sort(key=lambda a:a['distance'])
assert modes['bespoke-silhouette']==35 and not near,('near visually similar',near[:5])
report={'tested':len(j),'art_modes':dict(modes),'duplicate_hashes':0,'perceptual_pairs_distance_le_6':near,'art_size_at_35_px':'Contact sheet V62_35px_Dark_Review.png','limitations':'Phash does not establish semantic recognizability, originality, or human sign-off; manually inspect every icon.'}
(R/'docs/V62_ART_QA.json').write_text(json.dumps(report,indent=2))
print('V62 art gate PASS:',len(j),'bespoke art; no identical SVG or unusually similar perceptual hashes')
