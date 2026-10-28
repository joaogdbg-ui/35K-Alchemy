#!/usr/bin/env python3
"""Idempotent migration: retain exact current GitHub Android/UI source and patch V70 only.

This script is used by a one-time archive import to avoid overwriting the
Android edge-to-edge fixes that landed after the original V69 checkout.
"""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]

def rep(path,a,b):
 f=R/path;s=f.read_text(encoding='utf-8')
 if b in s:return
 if s.count(a)!=1:raise SystemExit(f'{path}: expected exactly one old clause; got {s.count(a)}: {a[:80]}')
 f.write_text(s.replace(a,b),encoding='utf-8')

rep('client/src/app.js',"import { ORGANIC_ART_V69 } from './organic-art-v69.js';", "import { ORGANIC_ART_V70 } from './organic-art-v70.js';\nimport { ORGANIC_ART_V69 } from './organic-art-v69.js';")
rep('client/src/app.js','const newArt=ORGANIC_ART_V69[itemName]||ORGANIC_ART_V68[itemName]', 'const newArt=ORGANIC_ART_V70[itemName]||ORGANIC_ART_V69[itemName]||ORGANIC_ART_V68[itemName]')
needle="const systemDark=window.matchMedia?.('(prefers-color-scheme: dark)');"
rep('client/src/app.js',needle,needle+"\n// Android-only compact immersive layout (keep standalone/browser unchanged).\nif(window.Capacitor?.getPlatform?.()==='android')document.documentElement.classList.add('alchemy-android-immersive');")

css_path=R/'client/src/styles.css';css=css_path.read_text()
marker='/* V70 · Immersive Android compact header:'
if marker not in css and '/* V70 · Android immersive fullscreen:' not in css:
 css+='''
/* V70 · Immersive Android compact header: on Android 16/17 hidden system bars
   can leave a stale --safe-area-inset-top equal to the old status-bar height.
   Limit the blank top band, without changing normal web/browser layouts. */
html.alchemy-android-immersive .app{
  padding-top:clamp(8px, env(safe-area-inset-top, 0px), 14px);
}
@media (max-width:849px){
  .workspace{flex-basis:clamp(176px,22dvh,190px)}
}
@media (max-width:849px) and (max-height:680px){
  .workspace{flex-basis:170px}
}
@media (max-width:849px) and (max-height:560px){
  .workspace{flex-basis:153px}
}
'''
 css_path.write_text(css)

p='tools/build-standalone.py'
rep(p, 'V69 UI','V70 UI')
rep(p, "subprocess.run(['node','tools/validate-v69.mjs','--quiet'],cwd=root,check=True)","subprocess.run(['node','tools/validate-v69.mjs','--quiet'],cwd=root,check=True)\nsubprocess.run(['node','tools/validate-v70.mjs','--quiet'],cwd=root,check=True)")
rep(p, "subprocess.run(['python','tools/audit-v69-art.py'],cwd=root,check=True)","subprocess.run(['python','tools/audit-v69-art.py'],cwd=root,check=True)\nsubprocess.run(['python','tools/audit-v70-art.py'],cwd=root,check=True)")
rep(p,"organicart69=(root/'client/src/organic-art-v69.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V69 =','const ORGANIC_ART_V69 =')", "organicart70=(root/'client/src/organic-art-v70.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V70 =','const ORGANIC_ART_V70 =')\norganicart69=(root/'client/src/organic-art-v69.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V69 =','const ORGANIC_ART_V69 =')")
rep(p, "app=app.replace(\"import { ORGANIC_ART_V69 } from './organic-art-v69.js';\",'const {ORGANIC_ART_V69}=window.__gameverseOrganicArt69;')", "app=app.replace(\"import { ORGANIC_ART_V70 } from './organic-art-v70.js';\",'const {ORGANIC_ART_V70}=window.__gameverseOrganicArt70;')\napp=app.replace(\"import { ORGANIC_ART_V69 } from './organic-art-v69.js';\",'const {ORGANIC_ART_V69}=window.__gameverseOrganicArt69;')")
rep(p,"js='window.__gameverseOrganicArt69=(function(){'+organicart69+'return {ORGANIC_ART_V69};})();\\n'", "js='window.__gameverseOrganicArt70=(function(){'+organicart70+'return {ORGANIC_ART_V70};})();\\n'+'window.__gameverseOrganicArt69=(function(){'+organicart69+'return {ORGANIC_ART_V69};})();\\n'")
rep(p,'35K_Alchemy_V69_Offline.html','35K_Alchemy_V70_Offline.html')
p='tools/prepare-android-web.py';s=(R/p).read_text();s=s.replace('V69','V70');(R/p).write_text(s)
p='tools/validate-v69.mjs';s=(R/p).read_text();s=s.replace('build.includes(\"35K_Alchemy_V69_Offline.html\")', "(/35K_Alchemy_V(69|70)_Offline\\.html/.test(build))");(R/p).write_text(s)
p='package.json';cfg=json.loads((R/p).read_text());cfg['version']='0.70.0';(R/p).write_text(json.dumps(cfg,indent=2)+'\n')

readme=R/'README.md';s=readme.read_text();s=s.replace('# 35K Alchemy — V69','# 35K Alchemy — V70',1)
section='''
## V70 — fecho de 14 desenhos e correção do espaço superior

- 14 SVGs individuais: fecha o total de **90** casos genéricos efetivamente pendentes após a V68 (76 redesenhados na V69 e 14 na V70). A classificação original \\`motif-composite\\` da V61 fica com **zero** elementos sem redesenho.
- Manifesto: \\`shared/v70-approved.json\\`, validação \\`tools/validate-v70.mjs\\` e auditoria \\`tools/audit-v70-art.py\\`.
- UI: reduz o espaço vazio acima do cabeçalho em Android imersivo e aproxima a zona de combinação da barra superior, sem remover controlos nem alterar os layouts desktop.
- Mantém 5.172 elementos e 13.509 receitas, sem alterar IDs, modos, saves, monetização ou a assinatura Android.
- Próximo ciclo **V71**: expansão de **até 200 elementos novos**, condicionada a receitas orgânicas, SVG específico por objeto, legibilidade a 35 px e validação das campanhas.

'''.replace('\\`','`')
s=s.replace('## Instalar Android (link permanente)',section+'## Instalar Android (link permanente)',1)
readme.write_text(s)
print('V70 changes applied without overwriting current GitHub Android-specific fixes')
