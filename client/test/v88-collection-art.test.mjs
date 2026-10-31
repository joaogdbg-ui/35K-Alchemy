import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V88: Themed collections are gone from the Collection tab',()=>{
 const html=src('client/index.html');
 assert.doesNotMatch(html,/Themed collections/);assert.doesNotMatch(html,/id="thematicSets"/);
 assert.match(src('client/src/app.js'),/if\(\$\('thematicSets'\)\)\$\('thematicSets'\)\.onclick=/);
});
test('V88: older family icons redrawn in the 2026 art direction and used first',async()=>{
 const {FAMILY_ART_V88}=await import('../src/family-art-v88.js');
 assert.deepEqual(Object.keys(FAMILY_ART_V88).sort(),['anime','fantasy','games','home','mythology','nature','people','prehistoric']);
 for(const [k,svg] of Object.entries(FAMILY_ART_V88)){assert.match(svg,/^<svg /,k);assert.match(svg,/#657D89/,k);assert.doesNotMatch(svg,/<(script|image|text)\b/,k);}
 assert.match(src('client/src/app.js'),/function familyCardArtwork\(f\)\{\n if\(FAMILY_ART_V88\[f\.id\]\)return FAMILY_ART_V88\[f\.id\];/);
 assert.match(src('tools/build-standalone.py'),/family-art-v88\.js/);
});
