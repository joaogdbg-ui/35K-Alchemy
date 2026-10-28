#!/usr/bin/env python3
"""V61: select 200 curated, conflict-free discoveries and compose offline illustrated SVGs.
Editorial input is explicit; no runtime generation, no redefinition of historical recipes.
"""
from pathlib import Path
import json, subprocess, ast, re, hashlib, collections
ROOT=Path(__file__).resolve().parents[1]
base=json.loads(subprocess.check_output(['node','tools/export-v61-base.mjs'],cwd=ROOT))
names={x['name'].casefold().strip():x['id'] for x in base['items']}
used=set(base['recipes']); selected=set(); groups=collections.defaultdict(list)
renames={'Tech':'Technology','Space':'Astronomy','Craft':'Materials','Ecology':'Forest'}
for filename in ['v61-proposals.txt','v61-alternatives.txt','v61-reserve.txt']:
    for raw in (ROOT/'shared'/filename).read_text().splitlines():
        if not raw or raw.startswith('#'):continue
        parts=raw.strip().split('|'); d,name,cat,a,b=parts[:5];d=renames.get(d,d)
        if name.casefold() in names or name.casefold() in selected:continue
        if a.casefold() not in names or b.casefold() not in names:continue
        pk='|'.join(sorted([names[a.casefold()],names[b.casefold()]]))
        if pk in used:continue
        used.add(pk);selected.add(name.casefold());groups[d].append((name,cat,a,b))
PICKS={
'Ocean':[1,2,3,4,5,7,8,9,10,11,12,14,17,19,21,22,24,25,31,35],
'Geology':[1,2,3,4,5,6,8,9,10,11,12,13,14,15,17,19,20,21,23,24],
'Forest':[1,2,3,4,5,6,8,9,10,11,12,14,16,18,19,20,21,24,25,28],
'Weather':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,23],
'Food':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,24],
'Materials':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
'Technology':[1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,19,20,21,23],
'Astronomy':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
'Culture':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
'Habitats':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
}
assert all(len(groups[x])>=max(idx) for x,idx in PICKS.items()), {k:len(v) for k,v in groups.items()}
chosen=[(d,*groups[d][i-1]) for d,ix in PICKS.items() for i in ix]
assert len(chosen)==200 and len({x[1].casefold() for x in chosen})==200
# original motif library from project; no third-party asset dependency
module=ast.parse((ROOT/'tools/generate-v52-art.py').read_text());motifs=None
for n in module.body:
 if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='MOTIFS' for t in n.targets):motifs=ast.literal_eval(n.value)
assert motifs and len(motifs)>=40
# Prefer semantically relevant motifs, selected from the object named (never SVG label text).
keywords=[('mushroom','mushroom'),('fungus','mushroom'),('kelp','kelp'),('coral','coral'),('shell','shell'),('seaside','wave'),('coastal','wave'),('harbor','shop'),('ocean','wave'),('sea','wave'),('reef','coral'),('fish','fish'),('dolphin','fish'),('crab','crab'),('garden','flower'),('forest','tree'),('wood','branch'),('pine','tree'),('bird','tree'),('owl','tree'),('fern','leaf'),('moss','grass'),('pollen','flower'),('leaf','leaf'),('seed','pot'),('tree','tree'),('flower','flower'),('honey','flower'),('butterfly','flower'),('pond','pool'),('water','droplet'),('river','wave'),('rain','rain'),('storm','cloud'),('cloud','cloud'),('snow','snow'),('ice','ice'),('fog','fog'),('dew','droplet'),('wind','wind'),('sun','sun'),('moon','halo'),('star','halo'),('solar','sun'),('asteroid','mountain'),('meteor','sun'),('crystal','ice'),('quartz','ice'),('rock','mountain'),('stone','mountain'),('cave','mountain'),('canyon','mountain'),('basalt','mountain'),('granite','mountain'),('lava','geyser'),('volcanic','geyser'),('salt','shell'),('copper','statue'),('clay','pot'),('ceramic','pot'),('bread','bread'),('cake','food'),('cookie','food'),('tart','food'),('rice','food'),('soup','food'),('food','food'),('cream','cup'),('tea','cup'),('caramel','cup'),('berry','apple'),('apple','apple'),('carrot','apple'),('chocolate','food'),('camera','camera'),('photo','camera'),('lens','camera'),('sensor','camera'),('radio','camera'),('robot','statue'),('computer','camera'),('electric','lightning'),('battery','lightning'),('glass','frame'),('paper','paper'),('book','book'),('library','book'),('art','frame'),('mosaic','frame'),('painting','frame'),('market','shop'),('village','house'),('museum','frame'),('concert','people'),('community','people'),('lantern','cup'),('music','people'),('weather','cloud'),('mural','frame'),('pendant','wreath'),('shell','shell'),('tide','wave'),('sand','mountain')]
by_domain={'Ocean':('wave','coral'),'Geology':('mountain','ice'),'Forest':('tree','leaf'),'Weather':('cloud','rain'),'Food':('food','cup'),'Materials':('pot','frame'),'Technology':('camera','lightning'),'Astronomy':('halo','sun'),'Culture':('book','people'),'Habitats':('tree','fish')}
def find_motif(s,default):
 s=s.lower()
 for key,shape in keywords:
  if key in s:return shape
 return default
pal={'Ocean':'#70B6C6','Geology':'#B7A3A3','Forest':'#85BA93','Weather':'#9DBCE1','Food':'#E5B47E','Materials':'#D6AD82','Technology':'#8CAED2','Astronomy':'#AFA2DC','Culture':'#CBA4B4','Habitats':'#87B89D'}
items=[];recipes=[];arts={};plan=[];manifest=[];reserved=set(base['recipes']);root=ROOT/'client/assets/v61';root.mkdir(parents=True,exist_ok=True)
for d,name,cat,a,b in chosen:
 rid='organic61:'+re.sub('[^a-z0-9]+','-',name.casefold()).strip('-')
 x,y=names[a.casefold()],names[b.casefold()];key='|'.join(sorted([x,y]));assert key not in reserved,(name,a,b)
 reserved.add(key)
 m1=find_motif(name,by_domain[d][0]);m2=find_motif(b,by_domain[d][1]);
 if m1==m2:m2=find_motif(a,by_domain[d][1])
 if m1==m2:m2=by_domain[d][1] if m1!=by_domain[d][1] else 'halo'
 h=int(hashlib.sha256(name.encode()).hexdigest()[:12],16);dx=h%9-4;dy=(h>>5)%7-3
 col=pal[d]; accent_x=[53,58,62,66][h%4];accent_y=[7,14,25,34][(h>>3)%4]
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'
     '<ellipse cx="49" cy="93" rx="28" ry="3.5" fill="#524943" opacity=".13"/>'
     f'<circle cx="78" cy="20" r="12" fill="{col}" opacity=".17"/>'
     f'<g transform="translate({10+dx} {12+dy}) scale(.77)">{motifs[m1]}</g>'
     f'<g transform="translate({accent_x} {accent_y}) scale(.33)">{motifs[m2]}</g>'
     f'<path d="M10 18v7m-3.5-3.5h7M84 77v7m-3.5-3.5h7" stroke="{col}" stroke-width="2.5" stroke-linecap="round"/>'
     '</svg>')
 # Individually art-directed replacements take precedence over the generic V61 motif composer.
 # The override files are version-controlled source assets, not post-build patches.
 override=ROOT/'client/assets/v61-art-directed'/(rid.split(':')[1]+'.svg')
 if override.is_file():
  svg=override.read_text(encoding='utf-8').strip()
  assert svg.startswith('<svg') and svg.endswith('</svg>'),('bad icon override',name)
 assert svg not in arts.values(),('duplicate art',name)
 file=root/(rid.split(':')[1]+'.svg');file.write_text(svg,encoding='utf-8')
 items.append({'id':rid,'name':name,'category':cat,'summary':'A new '+d.lower()+' discovery made from '+a.lower()+' and '+b.lower()+'.','iconFamily':'organic'})
 recipes.append([x,y,rid]);arts[name.casefold()]=svg
 plan.append({'branch':d,'name':name,'id':rid,'ingredients':[a,b],'icon':file.name})
 manifest.append({'id':rid,'name':name,'path':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(svg.encode()).hexdigest(),'art_mode':'art-directed' if override.is_file() else 'motif-composite','motifs':([] if override.is_file() else [m1,m2])})
assert len(items)==len(recipes)==len(arts)==len(manifest)==200
(ROOT/'client/src/organic-pack-v61.js').write_text('/* V61: 200 verified new elements, global deterministic recipes */\nexport const ORGANIC_V61 = '+json.dumps({'items':items,'recipes':recipes},separators=(',',':'))+';\n')
(ROOT/'client/src/organic-art-v61.js').write_text('/* V61: 200 individually composed, self-contained offline SVGs */\nexport const ORGANIC_ART_V61 = '+json.dumps(arts,separators=(',',':'))+';\n')
(ROOT/'shared/v61-approved-200.json').write_text(json.dumps({'version':61,'count':200,'results':plan},indent=2)+'\n')
(ROOT/'shared/v61-art-manifest.json').write_text(json.dumps({'version':61,'icons':manifest},indent=2)+'\n')
print('V61 built:',len(items),'unique new elements;',len(recipes),'recipes;',len(arts),'individually composed SVG assets')
print('Themes:',dict(collections.Counter(x['branch'] for x in plan)))
