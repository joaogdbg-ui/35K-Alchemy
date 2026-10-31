import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ORGANIC_V83} from '../src/organic-pack-v83.js';
import {ORGANIC_ART_V83} from '../src/organic-art-v83.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('shared/v83-approved.json'));

test('V83 adds exactly 200 elements: 100 Mythology & Gods + 100 Prehistory & Dinosaurs',()=>{
 assert.equal(ORGANIC_V83.items.length,200);
 assert.equal(ORGANIC_V83.items.filter(i=>i.familyCampaigns[0]==='mythology').length,100);
 assert.equal(ORGANIC_V83.items.filter(i=>i.familyCampaigns[0]==='prehistoric').length,100);
 assert.equal(new Set(ORGANIC_V83.items.map(i=>i.id)).size,200);
 assert.ok(ORGANIC_V83.items.every(i=>i.id.startsWith('organic83:')&&i.summary.length>=40));
});
test('each new element has one primary recipe and unique unordered pairs',()=>{
 const pairs=new Set();
 for(const r of ORGANIC_V83.recipes){const k=[r[0],r[1]].sort().join('|');assert.ok(!pairs.has(k),k);pairs.add(k);}
 for(const it of ORGANIC_V83.items)assert.equal(ORGANIC_V83.recipes.filter(r=>r[2]===it.id).length,1,it.name);
});
test('every element has its own SVG, byte-identical to the asset file, no duplicates',()=>{
 const hashes=new Set();
 for(const entry of manifest.new_items){
  const raw=read(entry.path);
  assert.equal(ORGANIC_ART_V83[entry.name.toLowerCase()],raw,entry.name);
  assert.ok(raw.includes('viewBox="0 0 100 100"')&&!/<(?:script|image|use|text|foreignObject)\b/.test(raw),entry.name);
  const h=createHash('sha256').update(raw).digest('hex');assert.ok(!hashes.has(h),'duplicate art '+entry.name);hashes.add(h);
 }
});
test('V83 is wired into the game and the offline build',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V82,ORGANIC_V83\]\);/);
 assert.match(app,/const newArt=ORGANIC_ART_V89\[itemName\]\|\|ORGANIC_ART_V85\[itemName\]\|\|ORGANIC_ART_V83\[itemName\]\|\|/);
 assert.match(app,/\|\|item\?\.wit\|\|''/);
 assert.match(build,/tools\/validate-v83\.mjs/);
 assert.match(build,/tools\/audit-v83-art\.py/);
});
