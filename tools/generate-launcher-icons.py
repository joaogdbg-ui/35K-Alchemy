#!/usr/bin/env python3
"""Export wholly authored alchemy SVGs into all Android launcher densities."""
from io import BytesIO
from pathlib import Path
import re
import cairosvg
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
res=root/'android/app/src/main/res'
src=root/'client/assets/brand'
sizes={'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}
def render(filename,size):
    svg=(src/filename).read_text('utf-8')
    if re.search(r'<(?:script|image|text|foreignObject)\b|\b(?:href|xlink:href|onload|onclick)\s*=',svg,re.I):
        raise SystemExit('Unsafe/linked launcher source: '+filename)
    return Image.open(BytesIO(cairosvg.svg2png(bytestring=svg.encode(),output_width=size,output_height=size))).convert('RGBA')
def save(im,path):
    path.parent.mkdir(parents=True,exist_ok=True)
    im.save(path,format='PNG',optimize=True)
    assert path.stat().st_size>300,path
for density,size in sizes.items():
    dst=res/('mipmap-'+density)
    base=render('35k-alchemy-icon.svg',size)
    save(base,dst/'ic_launcher.png')
    circle=Image.new('L',(size,size))
    ImageDraw.Draw(circle).ellipse((0,0,size-1,size-1),fill=255)
    rounded=base.copy();rounded.putalpha(circle)
    save(rounded,dst/'ic_launcher_round.png')
    save(render('35k-alchemy-foreground.svg',round(size*108/48)),dst/'ic_launcher_foreground.png')
adaptive='''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/alchemy_launcher_background"/>
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'''
for filename in ('ic_launcher','ic_launcher_round'):
    target=res/'mipmap-anydpi-v26'/(filename+'.xml')
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(adaptive,encoding='utf-8')
target=res/'values'/'alchemy_launcher_background.xml'
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text('<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="alchemy_launcher_background">#E3A15F</color></resources>\n',encoding='utf-8')
print('Original 35K Alchemy launcher: generated legacy, round and adaptive PNGs across five densities')
