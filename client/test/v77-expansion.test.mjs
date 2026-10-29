import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V77} from '../src/organic-pack-v77.js';
import {ORGANIC_ART_V77} from '../src/organic-art-v77.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('shared/v77-approved.json'));
test('V77 is exactly 50 additional elements, not an exaggerated 200-item claim',()=>{
 assert.equal(manifest.cohort_count,50);
 assert.equal(manifest.expansion_progress,100);
 assert.equal(manifest.remaining_to_goal,100);
 assert.equal(ORGANIC_V77.items.length,50);
 assert.equal(ORGANIC_V77.recipes.length,50);
 assert.equal(Object.keys(ORGANIC_ART_V77).length,50);
});
test('Fifty individually drawn 35px SVG sources are identical to game artwork',()=>{
 const pairSet=new Set(),svgSet=new Set();
 for(const it of manifest.new_items){
  const svg=read(it.path),recipe=ORGANIC_V77.recipes.find(x=>x[2]===it.id);
  assert.equal(svg,ORGANIC_ART_V77[it.name.toLowerCase()]);
  assert.deepEqual(recipe?.slice(0,2),it.ingredients);
  const pair=it.ingredients.slice().sort().join('|');
  assert.equal(pairSet.has(pair),false,pair);pairSet.add(pair);
  assert.equal(svgSet.has(svg),false,it.name);svgSet.add(svg);
  assert.match(svg,/viewBox="0 0 100 100"/);
  assert.doesNotMatch(svg,/<(?:image|text|script|use|foreignObject|animate)\b|href\s*=/i);
 }
});
test('V77 app, offline builder, IP screen and Android payload include the new cohort',()=>{
 const app=read('client/src/app.js'),builder=read('tools/build-standalone.py'),web=read('tools/prepare-android-web.py');
 assert.match(app,/ORGANIC_V76,ORGANIC_V77,ORGANIC_V78\]/);
 assert.match(app,/ORGANIC_ART_V78\[itemName\]\|\|ORGANIC_ART_V77\[itemName\]\|\|ORGANIC_ART_V76/);
 assert.match(builder,/window\.__gameverseOrganic77/);
 assert.match(builder,/window\.__gameverseOrganicArt77/);
 assert.match(builder,/35K_Alchemy_V77_Offline\.html/);
 assert.match(web,/35K_Alchemy_V78_Offline\.html/);
 assert.match(read('tools/audit-ip-safe-names.mjs'),/organic-v77/);
 assert.match(read('tools/audit-active-artwork.mjs'),/,77,78\]/);
});
