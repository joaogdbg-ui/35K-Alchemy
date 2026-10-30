import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V78} from '../src/organic-pack-v78.js';
import {ORGANIC_ART_V78} from '../src/organic-art-v78.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const approved=JSON.parse(read('shared/v78-approved.json'));
test('V78 is exactly 50 new discoveries, completing 150 of 200 in this cycle',()=>{
 assert.equal(approved.cohort_count,50);
 assert.equal(approved.expansion_progress,150);
 assert.equal(approved.remaining_to_goal,50);
 assert.equal(ORGANIC_V78.items.length,50);
 assert.equal(ORGANIC_V78.recipes.length,50);
 assert.equal(Object.keys(ORGANIC_ART_V78).length,50);
});
test('Every V78 item has a unique recipe, bespoke SVG source and valid summary',()=>{
 const pairs=new Set(),art=new Set();
 for(const e of approved.new_items){
  const r=ORGANIC_V78.recipes.find(x=>x[2]===e.id),svg=read(e.path);
  assert.deepEqual(r?.slice(0,2),e.ingredients);
  assert.equal(ORGANIC_ART_V78[e.name.toLowerCase()],svg);
  assert.match(svg,/viewBox="0 0 100 100"/);
  assert.doesNotMatch(svg,/<(?:image|script|foreignObject|text|use)\b|href\s*=/i);
  const key=r.slice(0,2).sort().join('|');
  assert.ok(!pairs.has(key),key);pairs.add(key);
  assert.ok(!art.has(svg),e.name);art.add(svg);
  assert.ok(e.summary.length>=40,e.name);
 }
});
test('V78 is wired to game, offline bundle, IP scan and Android packaging without altering settings',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V77,ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82,ORGANIC_V83\]/);
 assert.match(app,/ORGANIC_ART_V78\[itemName\]\|\|ORGANIC_ART_V77/);
 assert.match(build,/window\.__gameverseOrganic78/);
 assert.match(build,/window\.__gameverseOrganicArt78/);
 assert.match(build,/35K_Alchemy_V78_Offline\.html/);
 assert.match(read('tools/prepare-android-web.py'),/35K_Alchemy_V81_Offline\.html/);
 assert.match(read('tools/audit-ip-safe-names.mjs'),/organic-v78/);
 assert.match(read('tools/audit-active-artwork.mjs'),/,78,79,80,81,82\]/);
 assert.match(app,/function selectSettingsPage\(next/);
 assert.match(app,/No cloud backup exists in this version/);
});
