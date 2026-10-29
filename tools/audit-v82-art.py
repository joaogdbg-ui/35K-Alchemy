#!/usr/bin/env python3
"""Structural V82 SVG audit; not a manual icon readability or IP clearance."""
from pathlib import Path
from xml.etree import ElementTree as ET
import hashlib,json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'shared/v82-approved.json').read_text(encoding='utf-8'))
assert len(manifest['new_items'])==28
allowed={'svg','g','path','rect','circle','ellipse','line','polygon','polyline','defs','linearGradient','stop'}
seen=set()
for item in manifest['new_items']:
 p=root/item['path'];raw=p.read_text(encoding='utf-8');svg=ET.fromstring(raw)
 assert svg.tag=='{http://www.w3.org/2000/svg}svg' and svg.get('viewBox')=='0 0 100 100',(p,'root/viewport')
 count=0
 for node in svg.iter():
  tag=node.tag.rsplit('}',1)[-1]
  assert tag in allowed,(p,tag)
  assert all(not k.lower().startswith('on') and 'http:' not in v.lower() for k,v in node.attrib.items()),p
  count+=tag in {'path','rect','ellipse','circle','polygon','polyline','line'}
 assert count>=5,(p,count)
 digest=hashlib.sha256(raw.encode()).hexdigest()
 assert digest not in seen,p
 seen.add(digest)
print('V82 ART structural PASS:',len(seen),'source SVGs; manual meaning/35px review pending')
