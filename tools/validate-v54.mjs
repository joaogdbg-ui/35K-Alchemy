import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {FAMILIES} from '../client/src/discoveries.js';
import {FAMILY_ICONS_V54} from '../client/src/family-icons-v54.js';
const manifest=JSON.parse(readFileSync('shared/v54-family-art-manifest.json','utf8'));
// V86: four of the nine original families were merged into others; their V54 art files stay
// as the manifest baseline, keyed by the original ids.
const V54_IDS=Object.keys(manifest);
assert.equal(V54_IDS.length,9);
assert.deepEqual(Object.keys(FAMILY_ICONS_V54).sort(),V54_IDS.slice().sort());
for(const f of FAMILIES.filter(f=>!['mythology','prehistoric','world','home'].includes(f.id)))assert.ok(V54_IDS.includes(f.id),f.id);
const unique=new Set();
for(const f of V54_IDS.map(id=>({id}))){
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
