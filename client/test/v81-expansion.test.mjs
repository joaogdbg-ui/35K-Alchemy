import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V80} from '../src/organic-pack-v80.js';
import {ORGANIC_V81} from '../src/organic-pack-v81.js';
import {ORGANIC_ART_V81} from '../src/organic-art-v81.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('V80 200/200 cycle and V81 40/200 first cohort constitute exactly +200 since V80B',()=>{
 const m80=JSON.parse(read('shared/v80-approved.json')),m81=JSON.parse(read('shared/v81-approved.json'));
 assert.equal(ORGANIC_V80.items.length,200);
 assert.equal(m80.cycle_complete,true);
 assert.equal(m81.expansion_goal,200);
 assert.equal(m81.expansion_progress,40);
 assert.equal(m81.remaining_to_goal,160);
 assert.equal(ORGANIC_V81.items.length,40);
 assert.equal(ORGANIC_V81.recipes.length,40);
 assert.equal(Object.keys(ORGANIC_ART_V81).length,40);
 assert.equal(ORGANIC_V80.items.length-40+ORGANIC_V81.items.length,200);
 assert.equal(m81.expected_catalog.elements,5812);
 assert.equal(m81.expected_catalog.recipes,14149);
});
test('Every V81 recipe has a unique pair and an original standalone SVG file',async()=>{
 const m=JSON.parse(read('shared/v81-approved.json')),pairs=new Set(),arts=new Set(Object.values((await import('../src/organic-art-v80.js')).ORGANIC_ART_V80));
 for(const entry of m.new_items){
  const r=ORGANIC_V81.recipes.find(x=>x[2]===entry.id),raw=read(entry.path);
  assert.deepEqual(r?.slice(0,2),entry.ingredients,entry.name);
  assert.equal(ORGANIC_ART_V81[entry.name.toLowerCase()],raw);
  assert.match(raw,/viewBox="0 0 100 100"/);
  assert.ok(raw.length>=410,entry.name);
  assert.ok(!arts.has(raw),entry.name);arts.add(raw);
  const pair=r.slice(0,2).sort().join('|');assert.ok(!pairs.has(pair),pair);pairs.add(pair);
 }
});
test('V81 is integrated in Classic, unique SVG priority and Android offline packaging',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py'),android=read('tools/prepare-android-web.py');
 assert.match(app,/ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82,ORGANIC_V83\]/);
 assert.match(app,/ORGANIC_ART_V81\[itemName\]\|\|ORGANIC_ART_V80/);
 assert.match(build,/window\.__gameverseOrganic81/);
 assert.match(build,/window\.__gameverseOrganicArt81/);
 assert.match(build,/35K_Alchemy_V81_Offline\.html/);
 assert.match(android,/35K_Alchemy_V81_Offline\.html/);
 assert.match(read('tools/audit-active-artwork.mjs'),/,80,81,82,83\]/);
});
