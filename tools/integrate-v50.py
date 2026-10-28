from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'tools/assemble-families-v50.py';s=p.read_text().replace("export const FAMILY_CAMPAIGNS_V50=","export const FAMILY_CAMPAIGNS=");p.write_text(s)
# Intentional many-to-many family membership without cloning IDs or recipes.
p=r/'client/src/discoveries.js';s=p.read_text()
old="export const familyFor=(item)=>['Moon','Planet','Space','Star','Bread'].includes(item?.name)?'nature':CATEGORY_FAMILY.get(item.category)||'fantasy';"
assert old in s
report=__import__('json').loads((r/'shared/v50-multifamily-report.json').read_text())
pairs=[(it['id'],'nature') for it in report['shared']]
new=old+"\n// V50: explicit overlapping memberships. An element still exists just once in the catalog.\nconst SECONDARY_FAMILY_IDS = new Map("+__import__('json').dumps(pairs,separators=(',',':'))+");\nexport const familiesFor=(item)=>{const primary=familyFor(item);const secondary=SECONDARY_FAMILY_IDS.get(item?.id);return secondary&&secondary!==primary?[primary,secondary]:[primary];};"
s=s.replace(old,new)
old="for(const item of items){let g=groups[familyFor(item)];g.ids.push(item.id);g.total++;if(unlocked.has(item.id))g.found++;}"
assert old in s
s=s.replace(old,"for(const item of items){for(const family of familiesFor(item)){const g=groups[family];g.ids.push(item.id);g.total++;if(unlocked.has(item.id))g.found++;}}")
p.write_text(s)
p=r/'client/src/app.js';s=p.read_text()
s=s.replace("import { ORGANIC_V47 } from './organic-pack-v47.js';","import { ORGANIC_V47 } from './organic-pack-v47.js';\nimport { ORGANIC_V50 } from './organic-pack-v50.js';")
s=s.replace("import { ORGANIC_ART_V47 } from './organic-art-v47.js';","import { ORGANIC_ART_V47 } from './organic-art-v47.js';\nimport { ORGANIC_ART_V50 } from './organic-art-v50.js';")
s=s.replace("import { FAMILIES, familyFor, groupFamilies, recipesForTarget, candidatesForFamily } from './discoveries.js';","import { FAMILIES, familyFor, familiesFor, groupFamilies, recipesForTarget, candidatesForFamily } from './discoveries.js';")
s=s.replace("import { FAMILY_CAMPAIGNS } from './family-mode-v48.js';","import { FAMILY_CAMPAIGNS } from './family-mode-v50-campaigns.js';")
s=s.replace('ORGANIC_V46,ORGANIC_V47]);','ORGANIC_V46,ORGANIC_V47,ORGANIC_V50]);')
s=s.replace('const newArt=ORGANIC_ART_V47[itemName]','const newArt=ORGANIC_ART_V50[itemName]||ORGANIC_ART_V47[itemName]')
s=s.replace("ids=ids.filter(id=>familyFor(byId.get(id))===playFamily);","ids=ids.filter(id=>familiesFor(byId.get(id)).includes(playFamily));")
p.write_text(s)
p=r/'tools/build-standalone.py';s=p.read_text();s=s.replace('Bundle the fully offline 35K Alchemy V49 UI','Bundle the fully offline 35K Alchemy V50 UI')
s=s.replace("subprocess.run(['node','tools/validate-v48.mjs','--quiet'],cwd=root,check=True)","subprocess.run(['node','tools/validate-v48.mjs','--quiet'],cwd=root,check=True)\nsubprocess.run(['node','tools/validate-v50.mjs','--quiet'],cwd=root,check=True)")
s=s.replace("organic47=(root/'client/src/organic-pack-v47.js').read_text(encoding='utf-8').replace('export const ORGANIC_V47 =','const ORGANIC_V47 =')", "organic47=(root/'client/src/organic-pack-v47.js').read_text(encoding='utf-8').replace('export const ORGANIC_V47 =','const ORGANIC_V47 =')\norganic50=(root/'client/src/organic-pack-v50.js').read_text(encoding='utf-8').replace('export const ORGANIC_V50 =','const ORGANIC_V50 =')")
s=s.replace("organicart47=(root/'client/src/organic-art-v47.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V47 =','const ORGANIC_ART_V47 =')", "organicart47=(root/'client/src/organic-art-v47.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V47 =','const ORGANIC_ART_V47 =')\norganicart50=(root/'client/src/organic-art-v50.js').read_text(encoding='utf-8').replace('export const ORGANIC_ART_V50 =','const ORGANIC_ART_V50 =')")
s=s.replace("family=(root/'client/src/family-mode-v48.js').read_text(encoding='utf-8').replace('export const FAMILY_CAMPAIGNS=','const FAMILY_CAMPAIGNS=')","family=(root/'client/src/family-mode-v50-campaigns.js').read_text(encoding='utf-8').replace('export const FAMILY_CAMPAIGNS=','const FAMILY_CAMPAIGNS=')")
s=s.replace("app=app.replace(\"import { FAMILY_CAMPAIGNS } from './family-mode-v48.js';\",'const {FAMILY_CAMPAIGNS}=window.__familyMode48;')","app=app.replace(\"import { FAMILY_CAMPAIGNS } from './family-mode-v50-campaigns.js';\",'const {FAMILY_CAMPAIGNS}=window.__familyMode50;')")
s=s.replace("app=app.replace(\"import { ORGANIC_V47 } from './organic-pack-v47.js';\",'const {ORGANIC_V47}=window.__gameverseOrganic47;')","app=app.replace(\"import { ORGANIC_V47 } from './organic-pack-v47.js';\",'const {ORGANIC_V47}=window.__gameverseOrganic47;')\napp=app.replace(\"import { ORGANIC_V50 } from './organic-pack-v50.js';\",'const {ORGANIC_V50}=window.__gameverseOrganic50;')")
s=s.replace("app=app.replace(\"import { ORGANIC_ART_V47 } from './organic-art-v47.js';\",'const {ORGANIC_ART_V47}=window.__gameverseOrganicArt47;')","app=app.replace(\"import { ORGANIC_ART_V47 } from './organic-art-v47.js';\",'const {ORGANIC_ART_V47}=window.__gameverseOrganicArt47;')\napp=app.replace(\"import { ORGANIC_ART_V50 } from './organic-art-v50.js';\",'const {ORGANIC_ART_V50}=window.__gameverseOrganicArt50;')")
s=s.replace("app=app.replace(\"import { FAMILIES, familyFor, groupFamilies, recipesForTarget, candidatesForFamily } from './discoveries.js';\",'const {FAMILIES,familyFor,groupFamilies,recipesForTarget,candidatesForFamily}=window.__gameverseDiscoveries;')","app=app.replace(\"import { FAMILIES, familyFor, familiesFor, groupFamilies, recipesForTarget, candidatesForFamily } from './discoveries.js';\",'const {FAMILIES,familyFor,familiesFor,groupFamilies,recipesForTarget,candidatesForFamily}=window.__gameverseDiscoveries;')")
s=s.replace("js='window.__familyMode48=(function(){'+family+'return {FAMILY_CAMPAIGNS};})();", "js='window.__familyMode50=(function(){'+family+'return {FAMILY_CAMPAIGNS};})();")
s=s.replace("return {FAMILIES,familyFor,groupFamilies,recipesForTarget,candidatesForFamily};})();", "return {FAMILIES,familyFor,familiesFor,groupFamilies,recipesForTarget,candidatesForFamily};})();")
s=s.replace("js=js.replace('window.__gameverseArt23=(function(){', 'window.__gameverseOrganic47=(function(){'+organic47+'return {ORGANIC_V47};})();", "js=js.replace('window.__gameverseArt23=(function(){', 'window.__gameverseOrganic50=(function(){'+organic50+'return {ORGANIC_V50};})();\\nwindow.__gameverseOrganicArt50=(function(){'+organicart50+'return {ORGANIC_ART_V50};})();\\nwindow.__gameverseOrganic47=(function(){'+organic47+'return {ORGANIC_V47};})();")
s=s.replace("out=root/'35K_Alchemy_V49_Offline.html'", "out=root/'35K_Alchemy_V50_Offline.html'")
p.write_text(s)
