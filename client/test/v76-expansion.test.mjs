import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V76} from '../src/organic-pack-v76.js';
import {ORGANIC_ART_V76} from '../src/organic-art-v76.js';
const source=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('V76 is an accurate 50/200 intermediate expansion, not falsely complete',()=>{
 const m=JSON.parse(source('shared/v76-approved.json'));
 assert.equal(m.cohort_count,50);
 assert.equal(m.expansion_progress,50);
 assert.equal(m.remaining_to_goal,150);
 assert.equal(ORGANIC_V76.items.length,50);
 assert.equal(ORGANIC_V76.recipes.length,50);
 assert.equal(Object.keys(ORGANIC_ART_V76).length,50);
});
test('All fifty icon files match their actual game art and unique recipes',()=>{
 const m=JSON.parse(source('shared/v76-approved.json'));
 const pairs=new Set();
 for(const item of m.new_items){
  assert.equal(source(item.path),ORGANIC_ART_V76[item.name.toLowerCase()]);
  const recipe=ORGANIC_V76.recipes.find(r=>r[2]===item.id);
  assert.deepEqual(recipe?.slice(0,2),item.ingredients);
  const k=recipe.slice(0,2).sort().join('|');
  assert.equal(pairs.has(k),false);pairs.add(k);
 }
});
test('V76 still runs offline with unchanged inventory scroll and crafting slots',()=>{
 const app=source('client/src/app.js'),build=source('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V74,ORGANIC_V75,ORGANIC_V76,ORGANIC_V77,ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81\]/);
 assert.match(app,/ORGANIC_ART_V76\[itemName\]\|\|ORGANIC_ART_V75/);
 assert.match(app,/const anchorId=this.ids\[previousIndex\]/);
 assert.match(build,/35K_Alchemy_V76_Offline\.html/);
 assert.match(source('client/src/styles.css'),/\.craft-row\{transform:translateY\(9px\)\}/);
});
