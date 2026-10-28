#!/usr/bin/env python3
"""V54 original 9 flat pastel family badges, matching the in-game item icon silhouette language.
Assets are deterministic local SVG files and embedded data URLs; no web requests.
"""
from pathlib import Path
import base64, json, hashlib
from PIL import Image, ImageDraw, ImageFont
import cairosvg, io
ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/'client/assets/families-v54';TARGET.mkdir(parents=True,exist_ok=True)
# Each family has a distinctive primary visual, no third-party iconography or trademark artwork.
ART={
'games':('Video Games','''<path d="M21 42q4-10 14-11h30q11 1 14 11l8 23q4 13-8 15-6 1-14-11H35q-8 12-15 11-11-3-7-16z" fill="#A8BEDA" stroke="#7189AC" stroke-width="3.8"/><path d="M29 49v18m-9-9h18" stroke="#627A98" stroke-width="5" stroke-linecap="round"/><circle cx="65" cy="52" r="5" fill="#EAB7A1"/><circle cx="74" cy="61" r="5" fill="#F6D17B"/><circle cx="56" cy="61" r="4" fill="#88C3AC"/>'''),
'consoles':('Consoles & Hardware','''<rect x="23" y="18" width="54" height="67" rx="9" fill="#B7B9D9" stroke="#7D83A6" stroke-width="4"/><rect x="31" y="26" width="38" height="33" rx="4" fill="#C9E6E6" stroke="#779DAE" stroke-width="3"/><path d="m37 44 9 7 16-17" stroke="#87B9A3" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M36 69v11m-6-6h12" stroke="#6F729A" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="72" r="4" fill="#E6AB98"/><circle cx="69" cy="78" r="3" fill="#F1CB81"/>'''),
'arcades':('Arcade & Tabletop','''<path d="M28 15h44l6 69H22z" fill="#C6B7DB" stroke="#8977AA" stroke-width="4" stroke-linejoin="round"/><path d="M33 24h34l3 26H30z" fill="#D3E9E7" stroke="#6C9DA6" stroke-width="3"/><circle cx="49" cy="37" r="10" fill="#F2D289"/><path d="M47 34v15m0-15 10-7" stroke="#88B39A" stroke-width="3.5" stroke-linecap="round"/><path d="M42 65v12m-6-6h12" stroke="#806BA0" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="67" r="4" fill="#ECA1A9"/><circle cx="68" cy="76" r="3.3" fill="#F3C977"/>'''),
'anime':('Anime & Manga','''<path d="M13 27q17-6 35 4 20-10 39-4v53q-20-5-39 7-17-11-35-7z" fill="#E2D2F1" stroke="#9F87BB" stroke-width="4" stroke-linejoin="round"/><path d="M49 31v56M23 43h17m-17 9h17m-17 9h14M59 44h18m-18 10h18" stroke="#9E8CBE" stroke-width="3" stroke-linecap="round"/><path d="m71 9 4 8 9 2-8 4-2 9-4-8-9-3 8-3z" fill="#F2CE7A" stroke="#CFAB64" stroke-width="2"/>'''),
'cinema':('Cinema & TV','''<rect x="19" y="36" width="63" height="47" rx="6" fill="#A8C5C9" stroke="#688E9B" stroke-width="4"/><rect x="15" y="20" width="65" height="21" rx="3" transform="rotate(-10 15 20)" fill="#E0B7A1" stroke="#B58578" stroke-width="3"/><path d="m30 19 11 19m8-23 11 19m7-23 10 19" stroke="#FFF0D9" stroke-width="6"/><path d="m44 47 22 12-22 12z" fill="#F9E4A7" stroke="#CBAB78" stroke-width="2"/>'''),
'music':('Music','''<path d="M52 19v45q-2 15-20 15-11 0-13-7-2-11 14-14 8-2 13-1V29l32-8v34q-2 15-20 14-11-1-12-9-1-10 15-12 7-1 11 1V14z" fill="#D5BDE7" stroke="#9379AF" stroke-width="3.5" stroke-linejoin="round"/><path d="M54 28 74 23" stroke="#AF9AC7" stroke-width="3"/><circle cx="83" cy="81" r="4" fill="#F2C979"/>'''),
'nature':('Nature & Science','''<path d="M48 81V42" fill="none" stroke="#6F9C80" stroke-width="5" stroke-linecap="round"/><path d="M48 56Q18 61 18 28q29-7 30 28M49 47Q52 14 81 18q2 30-32 29" fill="#A0D4A9" stroke="#579B7B" stroke-width="3.8" stroke-linejoin="round"/><path d="M48 81q6-6 15-7" stroke="#7CB597" stroke-width="4" stroke-linecap="round"/><circle cx="71" cy="72" r="9" fill="#F7D78D" stroke="#D9B56B" stroke-width="3"/><path d="M70 64v16m-8-8h16" stroke="#E6BD72" stroke-width="2"/>'''),
'fantasy':('Fantasy & Objects','''<path d="M51 14 78 45 64 78H39L23 45z" fill="#D2C0F1" stroke="#9578BE" stroke-width="3.8" stroke-linejoin="round"/><path d="M51 14 43 44 64 78 78 45z" fill="#B49AE1"/><path d="M23 45h55M43 44 51 14M43 44l-4 34" fill="none" stroke="#E7DBF7" stroke-width="2.6"/><path d="m15 17 2 7 6 2-6 2-2 7-2-7-7-2 7-2z" fill="#F4D68A"/><path d="m82 70 2 7 6 2-6 2-2 7-2-7-6-2 6-2z" fill="#F4D68A"/>'''),
'people':('People & Culture','''<circle cx="49" cy="30" r="13" fill="#EDC0A4" stroke="#B98974" stroke-width="3"/><path d="M25 78Q22 47 49 47q28 0 26 31z" fill="#95C8CB" stroke="#5F999E" stroke-width="3.5"/><circle cx="20" cy="39" r="9" fill="#E5C29C" stroke="#B99A79" stroke-width="2.5"/><path d="M7 74q0-24 15-24 9 0 12 8" fill="#D8B8D9" stroke="#A483AE" stroke-width="3"/><circle cx="80" cy="39" r="9" fill="#D5B091" stroke="#AA866E" stroke-width="2.5"/><path d="M94 74q0-24-16-24-9 0-12 8" fill="#B6CDA9" stroke="#80A076" stroke-width="3"/>'''),
}
assets={}; tiles=[]; names=[]
for key,(name,body) in ART.items():
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><ellipse cx="50" cy="90" rx="28" ry="3" fill="#5C5551" opacity=".12"/><path d="M10 12v6m-3-3h6M88 77v6m-3-3h6" stroke="#D8B37E" stroke-width="2" stroke-linecap="round"/>{body}</svg>'''
 (TARGET/f'{key}.svg').write_text(svg,encoding='utf-8')
 assets[key]='data:image/svg+xml;base64,'+base64.b64encode(svg.encode()).decode()
 tiles.append(Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(),output_width=180,output_height=180))).convert('RGBA'))
 names.append(name)
(R0:=ROOT/'client/src/family-icons-v54.js').write_text('// V54: nine original self-contained illustrated family icons.\nexport const FAMILY_ICONS_V54 = Object.freeze('+json.dumps(assets,separators=(',',':'))+');\n',encoding='utf-8')
manifest={key:hashlib.sha256((TARGET/f'{key}.svg').read_bytes()).hexdigest() for key in ART}
(ROOT/'shared/v54-family-art-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
canvas=Image.new('RGB',(1000,1050),'#F8F7F5');d=ImageDraw.Draw(canvas)
try:font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17);big=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
except:font=big=ImageFont.load_default()
d.text((28,20),'35K Alchemy  —  Family Icons V54',font=big,fill='#33302B')
d.text((28,62),'Nine original pastel icons · Same silhouette language as element illustrations',font=font,fill='#817B75')
for i,(tile,name) in enumerate(zip(tiles,names)):
 x=28+(i%3)*325;y=112+(i//3)*300
 d.rounded_rectangle([x,y,x+295,y+280],radius=20,fill='#FFFFFF',outline='#E5DDD5',width=2)
 canvas.paste(tile,(x+56,y+18),tile)
 bb=d.textbbox((0,0),name,font=font);tx=x+147-(bb[2]-bb[0])//2
 d.text((tx,y+226),name,font=font,fill='#433A33')
canvas.save(ROOT/'V54_Family_Icon_Gallery.png')
print('Built',len(ART),'family icons')
