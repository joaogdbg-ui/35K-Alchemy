#!/usr/bin/env python3
"""Original V81 SVG structural/source audit; not a human 35px or trademark clearance."""
from pathlib import Path
from xml.etree import ElementTree as ET
import hashlib,json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'shared/v81-approved.json').read_text())
assert 40<=len(manifest['new_items'])<=200
assert len(manifest['new_items'])==manifest['cohort_count']
allowed={'svg','g','path','rect','circle','ellipse','line','polygon','polyline','defs','linearGradient','stop'}
seen=set()
for item in manifest['new_items']:
 path=root/item['path'];raw=path.read_text();svg=ET.fromstring(raw)
 assert svg.tag=='{http://www.w3.org/2000/svg}svg' and svg.get('viewBox')=='0 0 100 100',path
 count=0
 for node in svg.iter():
  tag=node.tag.rsplit('}',1)[-1]
  assert tag in allowed,(path,tag)
  assert all(not k.lower().startswith('on') and 'http:' not in v.lower() for k,v in node.attrib.items()),path
  count+=tag in {'path','rect','ellipse','circle','polygon','polyline','line'}
 assert count>=5,(path,count)
 fingerprint=hashlib.sha256(raw.encode()).hexdigest()
 assert fingerprint not in seen,path
 seen.add(fingerprint)
print('V81 ART structural PASS:',len(seen),'original SVGs; manual meaning review pending')
