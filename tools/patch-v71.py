#!/usr/bin/env python3
"""Safely integrate the V71 source cohort into the *current GitHub V70 branch*.
Refuses mismatched source markers to avoid overwriting later Android changes.
"""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
def update(p,old,new):
    path=root/p
    c=path.read_text(encoding='utf-8')
    count=c.count(old)
    if count!=1:raise SystemExit(f'V71 patch expected exactly one {old!r} in {p}; got {count}')
    path.write_text(c.replace(old,new,1),encoding='utf-8')

update('client/src/app.js', "import { ORGANIC_V68 } from './organic-pack-v68.js';", "import { ORGANIC_V68 } from './organic-pack-v68.js';\nimport { ORGANIC_V71 } from './organic-pack-v71.js';")
update('client/src/app.js', "import { ORGANIC_ART_V70 } from './organic-art-v70.js';", "import { ORGANIC_ART_V70 } from './organic-art-v70.js';\nimport { ORGANIC_ART_V71 } from './organic-art-v71.js';")
update('client/src/app.js', 'ORGANIC_V67,ORGANIC_V68]);','ORGANIC_V67,ORGANIC_V68,ORGANIC_V71]);')
update('client/src/app.js', 'ORGANIC_ART_V70[itemName]||ORGANIC_ART_V69[itemName]', 'ORGANIC_ART_V71[itemName]||ORGANIC_ART_V70[itemName]||ORGANIC_ART_V69[itemName]')

p=root/'tools/build-standalone.py';s=p.read_text(encoding='utf-8')
# Retain V70 validator textual guard for backward regression.
if "35K_Alchemy_V70_Offline.html" not in s:raise SystemExit('V70 baseline missing')
p.write_text(s.replace('Bundle the fully offline 35K Alchemy V70 UI','Bundle the fully offline 35K Alchemy V71 UI').replace("subprocess.run(['node','tools/validate-v70.mjs','--quiet'],cwd=root,check=True)","subprocess.run(['node','tools/validate-v70.mjs','--quiet'],cwd=root,check=True)\nsubprocess.run(['node','tools/validate-v71.mjs','--quiet'],cwd=root,check=True)").replace("organicart70=(root/'client/src/organic-art-v70.js')", "organic71=(root/'client/src/organic-pack-v71.js').read_text(encoding='utf-8').replace('export const ORGANIC_V71 =','const ORGANIC_V71 =')\norganicart71=(root/'client/src/organic-art-v71.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V71 =','const ORGANIC_ART_V71 =')\norganicart70=(root/'client/src/organic-art-v70.js')").replace("app=app.replace(\"import { ORGANIC_ART_V70 }", "app=app.replace(\"import { ORGANIC_V71 } from './organic-pack-v71.js';\",'const {ORGANIC_V71}=window.__gameverseOrganic71;')\napp=app.replace(\"import { ORGANIC_ART_V71 } from './organic-art-v71.js';\",'const {ORGANIC_ART_V71}=window.__gameverseOrganicArt71;')\napp=app.replace(\"import { ORGANIC_ART_V70 }").replace("js='window.__gameverseOrganicArt70=(function(){'", "js='window.__gameverseOrganic71=(function(){'+organic71+'return {ORGANIC_V71};})();\\nwindow.__gameverseOrganicArt71=(function(){'+organicart71+'return {ORGANIC_ART_V71};})();\\n'+'window.__gameverseOrganicArt70=(function(){'").replace("out=root/'35K_Alchemy_V70_Offline.html'", "# Preserve V70 original named artifact in history: 35K_Alchemy_V70_Offline.html\nout=root/'35K_Alchemy_V71_Offline.html'"),encoding='utf-8')

p=root/'tools/prepare-android-web.py';s=p.read_text(encoding='utf-8');assert 'V70' in s;p.write_text(s.replace('V70','V71'),encoding='utf-8')
p=root/'client/index.html';s=p.read_text(encoding='utf-8');s=s.replace('V64 Offline','V71 Offline');p.write_text(s,encoding='utf-8')
p=root/'package.json';obj=json.loads(p.read_text());assert obj['version']=='0.70.0';obj['version']='0.71.0';p.write_text(json.dumps(obj,indent=2)+'\n')
p=root/'README.md';s=p.read_text(encoding='utf-8');s=s.replace('# 35K Alchemy — V69','# 35K Alchemy — V71',1)
s=s.replace('## Instalar Android (link permanente)', '## V71 — Primeiro conjunto de expansão (40/200)\n\n- 40 novos elementos originais e 40 combinações intuitivas; SVG individual em cada elemento.\n- Catálogo agora em **5.212 elementos** e **13.549 receitas**; todos os resultados anteriores preservados.\n- V71 é uma expansão progressiva **40/200**, não afirmamos que os 200 estão concluídos. Prioridade à qualidade artística a 35 px.\n- [Handoff da V71](docs/V71_HANDOFF.md).\n\n## Instalar Android (link permanente)')
p.write_text(s,encoding='utf-8')
print('V71 integrated into current V70 branch without changing the Android signing workflow.')
