import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ART_REDRAW} from '../src/art-redraw.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('redrawn icons override older art by stable ID only',()=>{
 const app=read('client/src/app.js');
 assert.match(app,/const redrawn=ART_REDRAW\[item\.id\];if\(redrawn\)return redrawn;/);
 const manifest=JSON.parse(read('tools/art-redraw-manifest.json'));
 assert.equal(Object.keys(ART_REDRAW).length,manifest.length);
 for(const e of manifest){
  assert.equal(ART_REDRAW[e.id],read('client/assets/redraw/'+e.file).trim(),e.name);
  assert.ok(!/<(?:script|image|use|text|style)\b/.test(ART_REDRAW[e.id]),e.name);
 }
});
test('redraw map is bundled offline and validated in the build',()=>{
 const b=read('tools/build-standalone.py');
 assert.match(b,/window\.__gameverseArtRedraw/);
 assert.match(b,/tools\/validate-art-redraw\.mjs/);
 assert.match(read('tools/audit-active-artwork.mjs'),/'art-redraw\.js'/);
});
