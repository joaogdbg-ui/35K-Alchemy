import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ORGANIC_ART_V69} from '../src/organic-art-v69.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('shared/v69-approved.json'));
test('V69 has exactly 76 individually authored art sources and no new recipes',()=>{
 assert.equal(manifest.redrawn_v61.length,76);assert.equal(manifest.new_items.length,0);
 assert.equal(Object.keys(ORGANIC_ART_V69).length,76);
});
test('All V69 SVG files match their embedded runtime images and fingerprints',()=>{
 const seen=new Set(),hashes=new Set();for(const e of manifest.redrawn_v61){
  const svg=read(e.path),hash=createHash('sha256').update(svg).digest('hex');
  assert.equal(hash,e.sha256);assert.equal(ORGANIC_ART_V69[e.name.toLowerCase()],svg);
  assert.ok(!seen.has(e.id));seen.add(e.id);assert.ok(!hashes.has(hash));hashes.add(hash);
  assert.doesNotMatch(svg,/<script|<image\b|<text\b|onload=|<animate/i);
 }
});
test('V69 redraws cover unique original V61 IDs; no progress identifiers changed',()=>{
 const original=new Map(JSON.parse(read('shared/v61-art-manifest.json')).icons.map(e=>[e.name,e]));
 for(const e of manifest.redrawn_v61){assert.equal(original.get(e.name).id,e.id);assert.equal(original.get(e.name).art_mode,'motif-composite');}
});
