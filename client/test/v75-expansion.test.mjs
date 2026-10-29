import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V75} from '../src/organic-pack-v75.js';
import {ORGANIC_ART_V75} from '../src/organic-art-v75.js';
const text=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('V75 closes exactly the first 200-element content expansion',()=>{
 const m=JSON.parse(text('shared/v75-approved.json'));
 assert.equal(m.cohort_count,68);
 assert.equal(m.expansion_complete,200);
 assert.equal(m.remaining_to_200,0);
 assert.equal(ORGANIC_V75.items.length,68);
 assert.equal(ORGANIC_V75.recipes.length,68);
 assert.equal(Object.keys(ORGANIC_ART_V75).length,68);
});
test('Every V75 icon has a matching subject key, original recipe, and SVG source',()=>{
 const m=JSON.parse(text('shared/v75-approved.json'));
 const pairs=new Set();
 for(const item of m.new_items){
  assert.match(ORGANIC_ART_V75[item.name.toLowerCase()],/^<svg /);
  assert.equal(text(item.path),ORGANIC_ART_V75[item.name.toLowerCase()]);
  const rec=ORGANIC_V75.recipes.find(r=>r[2]===item.id);
  assert.deepEqual(rec?.slice(0,2),item.ingredients);
  const pair=rec.slice(0,2).sort().join('|');
  assert.equal(pairs.has(pair),false);
  pairs.add(pair);
 }
});
test('V75 keeps Android packaging, scroll anchors and targeted combiner spacing',()=>{
 const app=text('client/src/app.js');
 const build=text('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V73,ORGANIC_V74,ORGANIC_V75\]/);
 assert.match(app,/ORGANIC_ART_V75\[itemName\]\|\|ORGANIC_ART_V74/);
 assert.match(app,/const anchorId=this.ids\[previousIndex\]/);
 assert.match(build,/window\.__gameverseOrganicArt75/);
 assert.match(build,/35K_Alchemy_V75_Offline\.html/);
 assert.match(text('client/src/styles.css'),/\.craft-row\{transform:translateY\(9px\)\}/);
});
