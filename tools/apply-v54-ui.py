from pathlib import Path
p=Path(__file__).resolve().parents[1]
app_path=p/'client/src/app.js'; app=app_path.read_text()
app=app.replace("import { GAMEVERSE_ART } from './gameverse-art.js';","import { GAMEVERSE_ART } from './gameverse-art.js';\nimport { FAMILY_ICONS_V54 } from './family-icons-v54.js';",1)
anchor="function familyCardArtwork(f){\n // Reuse the ORIGINAL in-game art instead of fetching third-party artwork."
assert anchor in app
app=app.replace(anchor,"function familyCardArtwork(f){\n const src=FAMILY_ICONS_V54[f.id];\n if(src)return `<img src=\"${src}\" alt=\"\" loading=\"lazy\" decoding=\"async\">`;\n // Original in-game fallback, if a new family has not been illustrated.",1)
# Same icons in discovery family list and inventory filters; no mixed legacy family art.
app=app.replace("const icon=GAMEVERSE_ART[g.icon]?`<img src=\"${GAMEVERSE_ART[g.icon]}\" alt=\"\" loading=\"lazy\">`:fallbackIcon();", "const icon=familyCardArtwork(f);",1)
app=app.replace("const iconHtml=f=>GAMEVERSE_ART[f.icon]\n    ?`<img src=\"${GAMEVERSE_ART[f.icon]}\" decoding=\"async\" loading=\"lazy\" alt=\"\">`\n    :fallbackIcon();", "const iconHtml=f=>familyCardArtwork(f);",1)
# Family Only mode first screen: new family-themed original art instead of dragon.
app=app.replace('GAMEVERSE_ART.dragon?`<img src="${GAMEVERSE_ART.dragon}" alt="">`', 'FAMILY_ICONS_V54.nature?`<img src="${FAMILY_ICONS_V54.nature}" alt="">`',1)
# One tiny visual acknowledgement whenever an unlocked ingredient is selected.
anchor="// One tap selects immediately. When both slots are occupied, replace only the right slot."
assert anchor in app
app=app.replace(anchor,"""// V54: pulsing feedback follows an actual ingredient selection (tap, pointer or keyboard).
// The visual state is short-lived and never alters the recipes or the inventory order.
function pulseSelectedElement(id){
 const tile=[...$('inventoryVirtual').querySelectorAll('.element-chip')].find(node=>node.dataset.id===id);
 if(!tile)return;
 tile.classList.remove('element-chip-pulse');
 void tile.offsetWidth;
 tile.classList.add('element-chip-pulse');
 clearTimeout(tile._tapFeedbackTimer);
 tile._tapFeedbackTimer=setTimeout(()=>tile.classList.remove('element-chip-pulse'),370);
}
"""+anchor,1)
app=app.replace("function insertDirect(id){\n if(!byId.has(id)||!unlocked.has(id))return;", "function insertDirect(id){\n if(!byId.has(id)||!unlocked.has(id))return;\n pulseSelectedElement(id);",1)
# Drag-to-slot should also give visible confirmation of the source tile when placed.
app=app.replace("if(target)place(Number(target.id.slice(-1)),id);else toast('Drop onto a craft slot','error');", "if(target){pulseSelectedElement(id);place(Number(target.id.slice(-1)),id);}else toast('Drop onto a craft slot','error');",1)
app_path.write_text(app)
css_path=p/'client/src/styles.css';css=css_path.read_text()
css+='''
/* V54 — quiet tactile confirmation for a genuinely selected inventory item.
   GPU-friendly transform + box shadow only. Never animates every element. */
.element-chip.element-chip-pulse{position:relative;z-index:2;animation:chip-selected-v54 .34s ease-out both}
@keyframes chip-selected-v54{
 0%{transform:scale(1);box-shadow:0 0 0 0 rgba(169,129,89,.20)}
 36%{transform:scale(1.035);border-color:#c5a079;box-shadow:0 0 0 3px rgba(194,151,103,.26),0 3px 9px #00000010}
 100%{transform:scale(1);box-shadow:0 0 0 0 rgba(169,129,89,0)}
}
html[data-theme="dark"] .element-chip.element-chip-pulse{animation-name:chip-selected-v54-dark}
@keyframes chip-selected-v54-dark{
 0%{transform:scale(1);box-shadow:0 0 0 0 rgba(207,176,139,.20)}
 36%{transform:scale(1.035);border-color:#c9a480;box-shadow:0 0 0 3px rgba(207,176,139,.24),0 3px 9px #00000027}
 100%{transform:scale(1);box-shadow:0 0 0 0 rgba(207,176,139,0)}
}
/* Family art now uses the exact same small, flat, original SVG icon language as in-game tiles. */
.family-hero-art{background:transparent}
.family-hero-art img,.family-icon img,.batch-family-picture img{object-fit:contain;image-rendering:auto}
html[data-theme="dark"] .family-hero-art{background:transparent}
@media(prefers-reduced-motion:reduce){
 .element-chip.element-chip-pulse{animation:none!important;border-color:#c29a76;outline:2px solid #c29a76;outline-offset:1px}
}
'''
css_path.write_text(css)
# Modify build in a deterministic way without restructuring the legacy pipeline.
b=p/'tools/build-standalone.py'; src=b.read_text();
src=src.replace('"""Bundle the fully offline 35K Alchemy V53 UI', '"""Bundle the fully offline 35K Alchemy V54 UI',1)
src=src.replace("subprocess.run(['node','tools/validate-v53.mjs','--quiet'],cwd=root,check=True)","subprocess.run(['node','tools/validate-v53.mjs','--quiet'],cwd=root,check=True)\nsubprocess.run(['node','tools/validate-v54.mjs','--quiet'],cwd=root,check=True)",1)
src=src.replace("html=(root/'client/index.html').read_text(encoding='utf-8')", "family54=(root/'client/src/family-icons-v54.js').read_text(encoding='utf-8').replace('export const FAMILY_ICONS_V54 =','const FAMILY_ICONS_V54 =')\nhtml=(root/'client/index.html').read_text(encoding='utf-8')",1)
anchor="app=app.replace(\"import { GAMEVERSE_ART } from './gameverse-art.js';\",'const {GAMEVERSE_ART}=window.__gameverseArt;')"
assert anchor in src
src=src.replace(anchor, anchor+"\napp=app.replace(\"import { FAMILY_ICONS_V54 } from './family-icons-v54.js';\",'const {FAMILY_ICONS_V54}=window.__familyIconsV54;')",1)
anchor="js='window.__familyShared51=(function(){'"
assert anchor in src
src=src.replace(anchor,"js='window.__familyIconsV54=(function(){'+family54+'return {FAMILY_ICONS_V54};})();\\n'+\"\\n\"+\"\"\njs+='window.__familyShared51=(function(){'",1)
src=src.replace("out=root/'35K_Alchemy_V53_Offline.html'","out=root/'35K_Alchemy_V54_Offline.html'",1)
b.write_text(src)
# New original art source/manifest is checked before each release.
validate=p/'tools/validate-v54.mjs'
validate.write_text('''import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {FAMILIES} from '../client/src/discoveries.js';
import {FAMILY_ICONS_V54} from '../client/src/family-icons-v54.js';
const manifest=JSON.parse(readFileSync('shared/v54-family-art-manifest.json','utf8'));
assert.equal(FAMILIES.length,9);
assert.deepEqual(Object.keys(FAMILY_ICONS_V54).sort(),FAMILIES.map(x=>x.id).sort());
const unique=new Set();
for(const f of FAMILIES){
 const file=readFileSync(`client/assets/families-v54/${f.id}.svg`);
 assert.equal(createHash('sha256').update(file).digest('hex'),manifest[f.id]);
 const encoded='data:image/svg+xml;base64,'+file.toString('base64');
 assert.equal(FAMILY_ICONS_V54[f.id],encoded);
 assert.match(file.toString(),/viewBox="0 0 100 100"/);
 assert(!unique.has(manifest[f.id]),`duplicate family art: ${f.id}`);unique.add(manifest[f.id]);
}
const app=readFileSync('client/src/app.js','utf8');const css=readFileSync('client/src/styles.css','utf8');
assert.match(app,/function pulseSelectedElement\(id\)/);
assert.match(app,/function insertDirect\(id\)\{[\s\S]{0,110}pulseSelectedElement\(id\)/);
assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/chip-selected-v54/);
assert.match(app,/const src=FAMILY_ICONS_V54\[f.id\]/);
if(!process.argv.includes('--quiet'))console.log('V54 PASS: 9 unique embedded family icons, inventory pulse, reduced-motion support, no catalog changes');
''')
print('V54 app, style and build updated')
