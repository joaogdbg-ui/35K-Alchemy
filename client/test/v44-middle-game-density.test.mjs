import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
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
import {ORGANIC_ART_V44} from '../src/organic-art-v44.js';
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';
const source=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43];
const baseline=buildCatalog(DATA,source), current=buildCatalog(DATA,[...source,ORGANIC_V44]);
const ids=new Map(current.items.map(item=>[item.name,item.id]));
const rec=(a,b)=>current.recipes.get([ids.get(a),ids.get(b)].sort().join('|'));
const snapshot=JSON.parse(readFileSync(new URL('../../shared/v43-catalog-snapshot.json',import.meta.url)));
const metrics=JSON.parse(readFileSync(new URL('../../shared/v44-density-metrics.json',import.meta.url)));

test('V44 additive expansion has 13 genuine elements and 836 unordered recipe pairs',()=>{
 assert.equal(baseline.items.length,3778);assert.equal(baseline.recipes.size,10275);
 assert.equal(ORGANIC_V44.items.length,13);assert.equal(ORGANIC_V44.recipes.length,836);
 assert.equal(current.items.length,3791);assert.equal(current.recipes.size,11111);
});
test('V44 preserves exact A+B output for EVERY V43 recipe, including B+A',()=>{
 for(const [pair,out] of baseline.recipes){
   assert.equal(current.recipes.get(pair),out,`changed original ${pair}`);
   const [a,b]=pair.split('|');assert.equal(current.recipes.get([b,a].sort().join('|')),out);
 }
 for(const [a,b,out] of ORGANIC_V44.recipes)assert.equal(current.recipes.get([b,a].sort().join('|')),out);
});
test('V44 curated recipes resolve to intended elements and keep historical collisions untouched',()=>{
 for(const [a,b,out] of [
  ['Air','Toy','Balloon'],['Fire','Stone','Campfire'],['Sand','Castle','Sandcastle'],
  ['Wind','Glass','Wind Chime'],['Wood','River','Driftwood'],
  ['Rain','Thermometer','Rain Gauge'],['Storm','Copper','Lightning Rod'],
  ['Water','Charcoal','Water Filter'],['Bird','Music','Birdsong'],
  ['Balloon','Heat','Hot Air Balloon'],['Clay','Sun','Terracotta'],
  ['Smoke','Language','Smoke Signal'],['Wind','Compass','Weather Vane'],
  ['Fire','Wood','Coal'],['Wind','Music','Flute']
 ])assert.equal(rec(a,b),ids.get(out),`${a}+${b}`);
});
test('V44 has no duplicate names, IDs, recipe pairs, or inaccessible elements',()=>{
 assert.equal(new Set(current.items.map(x=>normalizeCatalogName(x.name))).size,3791);
 assert.equal(new Set(current.items.map(x=>x.id)).size,3791);
 assert.equal(new Set(current.recipes.keys()).size,11111);
 const [a,b,out]=ORGANIC_V44.recipes[0];
 assert.throws(()=>buildCatalog(DATA,[...source,ORGANIC_V44,{items:[],recipes:[[b,a,out]]}],{checkReachability:false}),/duplicate unordered recipe/);
 assert.throws(()=>buildCatalog(DATA,[...source,ORGANIC_V44,{items:[{id:'evil',name:'CAMpFIRE'}],recipes:[]}],{checkReachability:false}),/duplicate name/);
});
test('V44 art manifest verifies 13 different self-contained safe SVGs, hashes and files',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../../shared/v44-art-manifest.json',import.meta.url)));
 assert.equal(manifest.icons.length,13);assert.equal(new Set(Object.values(ORGANIC_ART_V44)).size,13);
 for(const item of ORGANIC_V44.items){
  const svg=ORGANIC_ART_V44[item.name.toLowerCase()],entry=manifest.icons.find(x=>x.id===item.id);
  assert.ok(entry&&svg?.startsWith('<svg')&&svg.endsWith('</svg>'),item.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i);
  const fp=new URL('../../'+entry.path,import.meta.url);assert.ok(existsSync(fp),entry.path);
  const raw=readFileSync(fp,'utf8');assert.equal(raw,svg);
  assert.equal(createHash('sha256').update(raw).digest('hex'),entry.sha256);
  assert.ok(ORGANIC_V44.recipes.filter(r=>r[2]===item.id).length>=2,item.name);
 }
});
test('V44 fixed-cohort measurements show improvement without misleading global success',()=>{
 assert.equal(metrics.total_elements,3791);assert.equal(metrics.total_recipes,11111);
 assert.equal(metrics.cohorts.find(r=>r.elements===14).after_pct,100);
 for(const size of [55,132,228,326,452]){
  const row=metrics.cohorts.find(r=>r.elements===size);assert.ok(row.after>row.before,size+' missing coverage gain');
 }
 assert.ok(metrics.global_coverage_pct<1);
});
test('V44 source snapshot pins the exact real V43 catalog and builder rejects drift',()=>{
 assert.deepEqual(snapshot.items,baseline.items);
 assert.deepEqual(snapshot.recipes,[...baseline.recipes].map(([key,out])=>[...key.split('|'),out]));
 const validator=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 assert.match(validator,/A\+B output overwritten in V44/);
 assert.match(validator,/V44 baseline does not match V43 original catalog/);
});
test('V44 pack has explicit editorial rules and keeps rejected collisions out of game',()=>{
 const generator=readFileSync(new URL('../../tools/build-v44-density.py',import.meta.url),'utf8');
 const report=JSON.parse(readFileSync(new URL('../../shared/v44-density-generation.json',import.meta.url)));
 assert.match(generator,/Exact, explicitly authored recipes/);
 assert.match(generator,/No randomness, lexical guessing or runtime fallback/);
 assert.equal(report.added_recipes,836);assert.ok(report.old_pairs_encountered>500);
 assert.ok(report.competing_proposals_rejected>50);
});
test('V44 source and offline HTML are wired to the same 13 new illustrations',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V44_Offline.html',import.meta.url),'utf8');
 assert.match(app,/ORGANIC_ART_V44\[itemName\]\|\|ORGANIC_ART_V43/);
 assert.ok(build.includes('__gameverseOrganic44')&&build.includes('__gameverseOrganicArt44'));
 assert.ok(html.includes('V44 Offline')&&html.includes('organic44:campfire'));
});
