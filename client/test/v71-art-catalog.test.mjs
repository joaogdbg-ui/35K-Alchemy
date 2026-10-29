import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V71} from '../src/organic-pack-v71.js';
import {ORGANIC_ART_V71} from '../src/organic-art-v71.js';
const m=JSON.parse(readFileSync(new URL('../../shared/v71-approved.json',import.meta.url),'utf8'));
test('V71 new elements have individual original 100px SVGs and single curated recipe',()=>{
 assert.equal(ORGANIC_V71.items.length,40);
 assert.equal(ORGANIC_V71.recipes.length,40);
 assert.equal(m.new_items.length,40);
 for(const it of ORGANIC_V71.items){
  const svg=ORGANIC_ART_V71[it.name.toLowerCase()];
  assert.match(svg,/<svg[^>]+viewBox="0 0 100 100"/);
  assert.equal(ORGANIC_V71.recipes.filter(r=>r[2]===it.id).length,1);
 }
 assert.equal(new Set(Object.values(ORGANIC_ART_V71)).size,40);
});
