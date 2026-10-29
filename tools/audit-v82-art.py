#!/usr/bin/env python3
"""Structural/source checks for V82 authored SVGs. WIP, no artistic sign-off."""
from pathlib import Path
from xml.etree import ElementTree as ET
from hashlib import sha256
import json

root=Path(__file__).resolve().parents[1]
m=json.loads((root/'shared/v82-approved.json').read_text(encoding='utf-8'))
assert m['status']=='WIP_NOT_RELEASED' and 0<len(m['new_items'])<200
assert len(m['new_items'])==m['cohort_count']
allowed={'svg','g','path','rect','circle','ellipse','line','polygon','polyline','defs','linearGradient','stop'}
seen=set()
for record in m['new_items']:
 path=root/record['path'];raw=path.read_text(encoding='utf-8')
 xml=ET.fromstring(raw)
 assert xml.tag=='{http://www.w3.org/2000/svg}svg',path
 assert xml.attrib.get('viewBox')=='0 0 100 100',path
 count=0
 for node in xml.iter():
  tag=node.tag.rsplit('}',1)[-1]
  assert tag in allowed,(path,tag)
  assert all(not key.lower().startswith('on') and 'http:' not in val.lower() for key,val in node.attrib.items()),path
  if tag in {'path','rect','circle','ellipse','line','polygon','polyline'}:count+=1
 assert count>=5 and len(raw)>=410,(path,count)
 signature=sha256(raw.encode('utf-8')).hexdigest()
 assert signature not in seen,path
 seen.add(signature)
print('V82 WIP SVG structural PASS:',len(seen),'distinct hand-authored files; 35px aesthetic/device review pending')
