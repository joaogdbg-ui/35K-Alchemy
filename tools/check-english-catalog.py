#!/usr/bin/env python3
"""Reject reintroduction of localized legacy display names into the game."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
filename=root/'client/src/legacy-data.js'
s=filename.read_text(encoding='utf8')
key='export const DATA = '
data,_=json.JSONDecoder().raw_decode(s[s.index(key)+len(key):])
changes=json.loads((root/'ENGLISH_NAME_MIGRATION.json').read_text())['translations']
for item in changes:
 idx=int(item['id'].split(':')[1]); assert data['items'][idx][0]==item['after'],item
assert len(data['items'])==1591 and len(data['recipes'])==1735
print('PASS English catalogue label guardrail:',len(changes),'translations')
