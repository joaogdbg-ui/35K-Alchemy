from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'client/src/app.js';s=p.read_text()
s=s.replace("import { ORGANIC_V53 } from './organic-pack-v53.js';", "import { ORGANIC_V53 } from './organic-pack-v53.js';\nimport { ORGANIC_V55 } from './organic-pack-v55.js';")
s=s.replace("import { ORGANIC_ART_V53 } from './organic-art-v53.js';", "import { ORGANIC_ART_V53 } from './organic-art-v53.js';\nimport { ORGANIC_ART_V55 } from './organic-art-v55.js';")
s=s.replace('ORGANIC_V50,ORGANIC_V52,ORGANIC_V53]);','ORGANIC_V50,ORGANIC_V52,ORGANIC_V53,ORGANIC_V55]);')
s=s.replace("leftLocked=false, filterRecent=false,playFilter=", "leftLocked=false,playFilter=")
needle="// The four starters are free ingredients, not earned discoveries."
assert needle in s
s=s.replace(needle,"""// V55: stable inventory ordering, independent from Family Only progression and search.
const SORT_KEY='35k_inventory_sort_v55';
let sortChoice='az';
try {const value=localStorage.getItem(SORT_KEY);if(['az','old','new'].includes(value))sortChoice=value;}catch{}
"""+needle)
s=s.replace("const newArt=ORGANIC_ART_V53[itemName]||", "const newArt=ORGANIC_ART_V55[itemName]||ORGANIC_ART_V53[itemName]||")
s=s.replace("if(filterRecent||playFilter==='recent'){\n  syncDiscoveryOrder();const rank=new Map(discoveryOrder.map((id,i)=>[id,i]));\n  ids.sort((a,b)=>(rank.get(a)??Infinity)-(rank.get(b)??Infinity));\n }else ids.sort((a,b)=>byId.get(a).name.localeCompare(byId.get(b).name));", """if(sortChoice==='old'||sortChoice==='new'){
  syncDiscoveryOrder();const rank=new Map(discoveryOrder.map((id,i)=>[id,i]));
  ids.sort((a,b)=>sortChoice==='old'?(rank.get(a)??Infinity)-(rank.get(b)??Infinity):(rank.get(b)??-1)-(rank.get(a)??-1));
 }else ids.sort((a,b)=>byId.get(a).name.localeCompare(byId.get(b).name));""")
old="$('recentBtn').onclick=()=>{filterRecent=!filterRecent;$('recentBtn').setAttribute('aria-pressed',String(filterRecent));playVirtual.refresh();};"
assert old in s
new="""// V55: touch-friendly in-game Sort chooser (no native Android <select>).
function openInventorySorter(){
 const choices=[['az','A–Z','Alphabetical order'],['old','Old first','Earliest discoveries first'],['new','New first','Latest discoveries first']];
 const content=choices.map(([id,title,subtitle])=>`<button class="sort-option" type="button" data-sort-option="${id}" aria-pressed="${sortChoice===id}"><span class="sort-option-content"><strong>${title}</strong><small>${subtitle}</small></span><span class="sort-choice-mark" aria-hidden="true">${sortChoice===id?'✓':''}</span></button>`).join('');
 showModal(`<div class="modal-tag">ELEMENT ORDER</div><h2>Sort elements</h2><div class="sort-choices" role="group" aria-label="Sort inventory">${content}</div>`);
 $('recentBtn').setAttribute('aria-expanded','true');
 $('modalContent').querySelectorAll('[data-sort-option]').forEach(button=>button.onclick=()=>{
  sortChoice=button.dataset.sortOption;
  try{localStorage.setItem(SORT_KEY,sortChoice);}catch{}
  $('recentBtn').dataset.sort=sortChoice;
  $('recentBtn').setAttribute('aria-label','Sort elements: '+({az:'A to Z',old:'Old first',new:'New first'}[sortChoice]));
  closeModal();playVirtual.refresh();
 });
}
$('recentBtn').dataset.sort=sortChoice;
$('recentBtn').onclick=openInventorySorter;"""
s=s.replace(old,new)
assert 'filterRecent' not in s
# Keep control state correct even when dismissed via modal overlay or close X.
s=s.replace("$('playFamily').setAttribute('aria-expanded','false');\n const m=$('modal');", "$('playFamily').setAttribute('aria-expanded','false');\n $('recentBtn').setAttribute('aria-expanded','false');\n const m=$('modal');")
p.write_text(s)
p=R/'client/index.html';s=p.read_text();old='<button id="recentBtn" class="filter-pill" aria-pressed="false" title="Sort from oldest to newest discovery">Recent</button>';new='<button id="recentBtn" class="filter-pill sort-button" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Sort elements" title="Sort inventory">Sort <span aria-hidden="true">⌄</span></button>';assert old in s;s=s.replace(old,new);s=s.replace('<title>35K Alchemy — V54 Offline</title>','<title>35K Alchemy — V55 Offline</title>');p.write_text(s)
p=R/'client/src/styles.css';s=p.read_text()+"""
/* V55: sort menu is game-native, compact, and friendly to Android touch screens. */
.sort-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;min-width:75px}
.sort-button span{font-size:17px;line-height:1;color:var(--muted)}
.sort-choices{display:flex;flex-direction:column;gap:9px;padding:13px 0 3px}
.sort-option{display:flex;align-items:center;justify-content:space-between;min-height:60px;gap:12px;text-align:left;border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:12px 15px}
.sort-option[aria-pressed="true"]{border-color:#bc9a71;background:#fbf3e8}
.sort-option-content{display:flex;flex-direction:column;gap:4px}
.sort-option-content strong{font-size:13px}
.sort-option-content small{font-size:11px;color:var(--muted)}
.sort-choice-mark{font-size:18px;color:#b58a5b;min-width:20px;text-align:center}
html[data-theme="dark"] .sort-option[aria-pressed="true"]{background:#3a302b;border-color:#c6a27a}
html[data-theme="dark"] .sort-option{background:var(--surface);color:var(--ink)}
""";p.write_text(s)
# Maintain source project + test build's version string and ensure V55 assembly.
p=R/'tools/build-standalone.py';s=p.read_text()
s=s.replace('V54 UI','V55 UI')
s=s.replace("subprocess.run(['node','tools/validate-v54.mjs','--quiet'],cwd=root,check=True)","subprocess.run(['node','tools/validate-v54.mjs','--quiet'],cwd=root,check=True)\nsubprocess.run(['node','tools/validate-v55.mjs','--quiet'],cwd=root,check=True)")
s=s.replace("organic53=(root/'client/src/organic-pack-v53.js').read_text(encoding='utf-8').replace('export const ORGANIC_V53 =','const ORGANIC_V53 =')", "organic53=(root/'client/src/organic-pack-v53.js').read_text(encoding='utf-8').replace('export const ORGANIC_V53 =','const ORGANIC_V53 =')\norganic55=(root/'client/src/organic-pack-v55.js').read_text(encoding='utf-8').replace('export const ORGANIC_V55 =','const ORGANIC_V55 =')\norganicart55=(root/'client/src/organic-art-v55.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V55 =','const ORGANIC_ART_V55 =')")
s=s.replace("app=app.replace(\"import { ORGANIC_V53 } from './organic-pack-v53.js';\",'const {ORGANIC_V53}=window.__gameverseOrganic53;')", "app=app.replace(\"import { ORGANIC_V53 } from './organic-pack-v53.js';\",'const {ORGANIC_V53}=window.__gameverseOrganic53;')\napp=app.replace(\"import { ORGANIC_V55 } from './organic-pack-v55.js';\",'const {ORGANIC_V55}=window.__gameverseOrganic55;')\napp=app.replace(\"import { ORGANIC_ART_V55 } from './organic-art-v55.js';\",'const {ORGANIC_ART_V55}=window.__gameverseOrganicArt55;')")
s=s.replace("'window.__gameverseOrganic53=(function(){'+organic53", "'window.__gameverseOrganic55=(function(){'+organic55+'return {ORGANIC_V55};})();\\nwindow.__gameverseOrganicArt55=(function(){'+organicart55+'return {ORGANIC_ART_V55};})();\\nwindow.__gameverseOrganic53=(function(){'+organic53")
s=s.replace("out=root/'35K_Alchemy_V54_Offline.html'","out=root/'35K_Alchemy_V55_Offline.html'")
p.write_text(s)
print('V55 UI & source bundling applied.')
