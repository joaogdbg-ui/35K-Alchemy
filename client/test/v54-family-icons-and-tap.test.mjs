import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FAMILIES} from '../src/discoveries.js';
import {FAMILY_ICONS_V54} from '../src/family-icons-v54.js';
const app=readFileSync('client/src/app.js','utf8');
const css=readFileSync('client/src/styles.css','utf8');
test('V54 icons: exactly one original embedded family image per existing family',()=>{
 // V86: four families were merged; their V54 icons stay as art assets but every current family
 // from the original set still has its own unique embedded image.
 assert.ok(FAMILIES.length>=8);
 for(const f of FAMILIES.filter(f=>!['mythology','prehistoric','world','home'].includes(f.id)))assert.ok(FAMILY_ICONS_V54[f.id],f.id);
 assert.equal(new Set(Object.values(FAMILY_ICONS_V54)).size,9);
});
test('V54 icons: all images are self-contained SVG without external network assets',()=>{
 for(const icon of Object.values(FAMILY_ICONS_V54)){
  assert(icon.startsWith('data:image/svg+xml;base64,'));
  const svg=Buffer.from(icon.split(',')[1],'base64').toString();
  assert(svg.includes('viewBox="0 0 100 100"'));
  assert(!/<image\b|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));
 }
});
test('V54 reuses the same family artwork in gallery, Discovery and filters',()=>{
 assert.match(app,/function familyCardArtwork\(f\)/);
 assert.match(app,/const src=FAMILY_ICONS_V54\[f.id\]/);
 assert.match(app,/const iconHtml=f=>familyCardArtwork\(f\)/);
 assert.match(app,/const art=familyCardArtwork\(f\)/);
});
test('V54 tap confirmation follows ingredient selection and actual drop only',()=>{
 assert.match(app,/function insertDirect\(id\)\{[\s\S]{0,115}pulseSelectedElement\(id\)/);
 assert.match(app,/if\(target\)\{pulseSelectedElement\(id\);place/);
 assert.match(css,/chip-selected-v54/);
});
test('V54 selection feedback has a reduced-motion equivalent',()=>{
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*element-chip\.element-chip-pulse/);
});
