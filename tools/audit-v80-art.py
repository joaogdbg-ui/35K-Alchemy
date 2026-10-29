#!/usr/bin/env python3
"""V80 original SVG audit: structural validation without generic drawing fallback."""
from pathlib import Path
from xml.etree import ElementTree as ET
import hashlib
import json

base=Path(__file__).resolve().parents[1]
manifest=json.loads((base/'shared/v80-approved.json').read_text(encoding='utf-8'))
assert len(manifest['new_items']) == 8, 'Unexpected V80 source count'
seen=set()
allowed={'svg','g','path','rect','ellipse','circle','line','polygon','polyline','defs','linearGradient','stop'}
ns='{http://www.w3.org/2000/svg}'
for item in manifest['new_items']:
    file=base/item['path']
    content=file.read_text(encoding='utf-8')
    element=ET.fromstring(content)
    assert element.tag==ns+'svg' and element.get('viewBox')=='0 0 100 100', file
    count=0
    for node in element.iter():
        tag=node.tag.rsplit('}',1)[-1]
        assert tag in allowed,(file,tag)
        assert all(not attr.startswith('on') and 'http:' not in value.lower() for attr,value in node.attrib.items()),file
        count+=tag in {'path','rect','ellipse','circle','polygon','polyline','line'}
    assert count>=5, f'Insufficient SVG detail: {file}'
    checksum=hashlib.sha256(content.encode()).hexdigest()
    assert checksum not in seen, f'Identical SVG reused: {file}'
    seen.add(checksum)
print(f'V80 SVG PASS: {len(seen)} original, well-formed and independent vector assets.')
