import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V80} from '../src/organic-pack-v80.js';
import {ORGANIC_ART_V80} from '../src/organic-art-v80.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8'),m=JSON.parse(read('shared/v80-approved.json'));
test('V80 completes the third editorial cycle with original illustrations and recipe pairs',()=>{
 assert.equal(m.expansion_progress,m.cohort_count);assert.equal(m.remaining_to_goal,200-m.cohort_count);assert.equal(m.cycle_complete,true);
 assert.equal(ORGANIC_V80.items.length,m.cohort_count);assert.equal(ORGANIC_V80.recipes.length,m.cohort_count);assert.equal(Object.keys(ORGANIC_ART_V80).length,m.cohort_count);
 const pairs=new Set(),svgs=new Set();
 for(const entry of m.new_items){
  const r=ORGANIC_V80.recipes.find(x=>x[2]===entry.id),svg=read(entry.path);
  assert.deepEqual(r?.slice(0,2),entry.ingredients);assert.ok(entry.ingredients.every(x=>x.startsWith('organic79:')||x.startsWith('organic80:')||x.startsWith('legacy:')));
  assert.equal(ORGANIC_ART_V80[entry.name.toLowerCase()],svg);assert.ok(svg.length>=410);
  const key=[...r.slice(0,2)].sort().join('|');assert.ok(!pairs.has(key));pairs.add(key);assert.ok(!svgs.has(svg));svgs.add(svg);
 }
});
test('V80 is integrated alongside V81 with unchanged Settings',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82\]/);assert.match(app,/ORGANIC_ART_V80\[itemName\]\|\|ORGANIC_ART_V79/);
 assert.match(build,/window\.__gameverseOrganic80/);assert.match(build,/window\.__gameverseOrganicArt80/);
 assert.match(read('tools/prepare-android-web.py'),/35K_Alchemy_V81_Offline\.html/);
 assert.match(app,/function selectSettingsPage\(next/);
 assert.match(app,/No cloud backup exists in this version/);
});
