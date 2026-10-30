import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V79} from '../src/organic-pack-v79.js';
import {ORGANIC_ART_V79} from '../src/organic-art-v79.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const approved=JSON.parse(read('shared/v79-approved.json'));
test('V79 is exactly 50 new discoveries, completing 200 of 200 in this cycle',()=>{
 assert.equal(approved.cohort_count,50);
 assert.equal(approved.expansion_progress,200);
 assert.equal(approved.remaining_to_goal,0);
 assert.equal(approved.cycle_complete,true);
 assert.equal(ORGANIC_V79.items.length,50);
 assert.equal(ORGANIC_V79.recipes.length,50);
 assert.equal(Object.keys(ORGANIC_ART_V79).length,50);
});
test('Every V79 item has a unique recipe, bespoke SVG source and valid summary',()=>{
 const pairs=new Set(),art=new Set();
 for(const e of approved.new_items){
  const r=ORGANIC_V79.recipes.find(x=>x[2]===e.id),svg=read(e.path);
  assert.deepEqual(r?.slice(0,2),e.ingredients);
  assert.equal(ORGANIC_ART_V79[e.name.toLowerCase()],svg);
  assert.match(svg,/viewBox="0 0 100 100"/);
  assert.doesNotMatch(svg,/<(?:image|script|foreignObject|text|use)\b|href\s*=/i);
  const key=r.slice(0,2).sort().join('|');
  assert.ok(!pairs.has(key),key);pairs.add(key);
  assert.ok(!art.has(svg),e.name);art.add(svg);
  assert.ok(e.summary.length>=40,e.name);
 }
});
test('V79 is wired to game, offline bundle, IP scan and Android packaging without altering settings',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82,ORGANIC_V83\]/);
 assert.match(app,/ORGANIC_ART_V80\[itemName\]\|\|ORGANIC_ART_V79\[itemName\]\|\|ORGANIC_ART_V78/);
 assert.match(build,/window\.__gameverseOrganic79/);
 assert.match(build,/window\.__gameverseOrganicArt79/);
 assert.match(build,/35K_Alchemy_V81_Offline\.html/);
 assert.match(read('tools/prepare-android-web.py'),/35K_Alchemy_V81_Offline\.html/);
 assert.match(read('tools/audit-ip-safe-names.mjs'),/organic-v79/);
 assert.match(read('tools/audit-active-artwork.mjs'),/,79,80,81,82,83\]/);
 assert.match(app,/function selectSettingsPage\(next/);
 assert.match(app,/No cloud backup exists in this version/);
});
