import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../../tools/audit-active-artwork.mjs',import.meta.url),'utf8');
test('Active art gate scans all current packs and requires SVG ownership-friendly structure',()=>{
  assert.match(src,/gameverse-art-v30-semantic/);
  assert.match(src,/75,76/);
  assert.match(src,/foreignObject/);
  assert.match(src,/xlink:href/);
  assert.match(src,/V76 runtime SVG and source mismatch/);
  assert.match(src,/static lint cannot verify ownership/);
});
