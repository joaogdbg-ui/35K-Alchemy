import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {GAMING_V22} from '../src/gaming-pack-v22.js';
import {GAMING_V23} from '../src/gaming-pack-v23.js';
import {GAMING_V24} from '../src/gaming-pack-v24.js';
import {GAMING_V26} from '../src/gaming-pack-v26.js';
import {GAMING_V27} from '../src/gaming-pack-v27.js';
import {GAMING_V30} from '../src/gaming-pack-v30.js';
import {ORGANIC_V32} from '../src/organic-pack-v32.js';
import {ORGANIC_V34} from '../src/organic-pack-v34.js';
import {ORGANIC_V37} from '../src/organic-pack-v37.js';
import {ORGANIC_V38} from '../src/organic-pack-v38.js';
import {ORGANIC_V40} from '../src/organic-pack-v40.js';
import {ORGANIC_V41} from '../src/organic-pack-v41.js';
import {ORGANIC_V42} from '../src/organic-pack-v42.js';
import {ORGANIC_V43} from '../src/organic-pack-v43.js';
import {ORGANIC_V44} from '../src/organic-pack-v44.js';
import {ORGANIC_V45} from '../src/organic-pack-v45.js';
import {ORGANIC_ART_V45} from '../src/organic-art-v45.js';
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';
const prior=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44];
const original=buildCatalog(DATA,prior);
const current=buildCatalog(DATA,[...prior,ORGANIC_V45]);
const ids=new Map(current.items.map(x=>[x.name,x.id]));
const pair=(a,b)=>[ids.get(a),ids.get(b)].sort().join('|');
const metrics=JSON.parse(readFileSync(new URL('../../shared/v45-density-metrics.json',import.meta.url)));
const report=JSON.parse(readFileSync(new URL('../../shared/v45-density-generation.json',import.meta.url)));

test('V45 totals are additive and all elements reachable',()=>{
 assert.equal(original.items.length,3791);assert.equal(original.recipes.size,11111);
 assert.equal(current.items.length,3803);assert.equal(current.recipes.size,11631);
 assert.equal(ORGANIC_V45.items.length,12);assert.equal(ORGANIC_V45.recipes.length,520);
});
test('EVERY historical A+B outcome remains unchanged including reversed pair',()=>{
 for(const [key,out] of original.recipes){assert.equal(current.recipes.get(key),out);const [a,b]=key.split('|');assert.equal(current.recipes.get([b,a].sort().join('|')),out);}
 for(const [a,b,out] of ORGANIC_V45.recipes)assert.equal(current.recipes.get([b,a].sort().join('|')),out);
});
test('V45 actual example recipes and old collisions are fixed',()=>{
 for(const [a,b,c] of [['Rain','Tank','Rain Barrel'],['Bird','Seed','Bird Feeder'],['Water','Motor','Water Pump'],['Sun','Kiln','Solar Oven'],['City','Light','Streetlamp'],['Fish','Glass','Aquarium'],['Balloon','Thermometer','Weather Balloon'],['Tide','Generator','Tidal Turbine'],['Cloud','Physics','Cloud Chamber'],['Camera','Shadow','Camera Obscura'],['Prism','Color','Kaleidoscope'],['Sea','Glass','Sea Glass'],['Fire','Wood','Coal'],['Wind','Music','Flute']]){
  assert.equal(current.recipes.get(pair(a,b)),ids.get(c),`${a}+${b} unexpected`);
 }
});
test('V45 duplicate IDs/names/inverted pairs are rejected by buildCatalog',()=>{
 assert.equal(new Set(current.items.map(x=>normalizeCatalogName(x.name))).size,3803);
 assert.equal(new Set(current.items.map(x=>x.id)).size,3803);
 assert.throws(()=>buildCatalog(DATA,[...prior,ORGANIC_V45,{items:[],recipes:[[ORGANIC_V45.recipes[0][1],ORGANIC_V45.recipes[0][0],ORGANIC_V45.recipes[0][2]]]}],{checkReachability:false}),/duplicate unordered recipe/);
 assert.throws(()=>buildCatalog(DATA,[...prior,ORGANIC_V45,{items:[{id:'dup:rain',name:'RAIN BARREL'}],recipes:[]}],{checkReachability:false}),/duplicate name/);
});
test('All 12 V45 SVG icons are distinct, inline, checksum-verified, and safe',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../../shared/v45-art-manifest.json',import.meta.url)));
 assert.equal(manifest.icons.length,12);assert.equal(new Set(Object.values(ORGANIC_ART_V45)).size,12);
 for(const item of ORGANIC_V45.items){
  const svg=ORGANIC_ART_V45[item.name.toLowerCase()],entry=manifest.icons.find(x=>x.id===item.id);
  assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>')&&svg.length>400,item.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i);
  assert.ok(entry);const raw=readFileSync(new URL('../../'+entry.path,import.meta.url),'utf8');
  assert.equal(raw,svg);assert.equal(createHash('sha256').update(raw).digest('hex'),entry.sha256);
  assert.ok(ORGANIC_V45.recipes.filter(r=>r[2]===item.id).length>=2,item.name);
 }
});
test('V45 fixed cohort result rate improves and new-output opportunities separately reported',()=>{
 assert.equal(metrics.v45_elements,3803);assert.equal(metrics.v45_recipes,11631);
 for(const n of [55,145,251,359,482,598,732]){
  const row=metrics.cohorts.find(x=>x.owned===n);assert.ok(row,`missing ${n}`);
  assert.ok(row.gain_successful_pairs>0,n+' had no valid-pair growth');
  assert.ok(row.gain_unseen_pair_options>=0,n+' lost unseen-result pair');
  assert.equal(row.v45.successful_pairs,row.v45.already_owned_result_pairs+row.v45.unseen_result_pairs);
 }
 assert.ok(metrics.global_pair_coverage_pct<1);
 assert.equal(metrics.experimental_uniform_random_trials.length,5);
});
test('No runtime guessing: all V45 inputs and generated recipes are fixed at authoring time',()=>{
 assert.equal(report.added_recipes,520);assert.equal(report.old_pairs_preserved,true);
 assert.ok(report.skipped_preexisting_pairs>500);
 const author=readFileSync(new URL('../../tools/build-v45-density.py',import.meta.url),'utf8');
 assert.match(author,/No runtime procedural recipes/i);
 assert.match(author,/A recipe is emitted only for combinations of explicitly named ingredients/);
 const bundled=readFileSync(new URL('../../35K_Alchemy_V45_Offline.html',import.meta.url),'utf8');
 assert.match(bundled,/V45 Offline/);assert.match(bundled,/organic45:rain-barrel/);
 assert.match(bundled,/__gameverseOrganicArt45/);
});
