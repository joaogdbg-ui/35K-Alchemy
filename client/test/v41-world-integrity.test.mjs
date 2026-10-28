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
import {ORGANIC_ART_V41} from '../src/organic-art-v41.js';
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';
const old=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40];
const pair=(a,b)=>[a,b].sort().join('|');
const plan=JSON.parse(readFileSync(new URL('../../shared/v41-editorial-plan.json',import.meta.url),'utf8'));
const manifest=JSON.parse(readFileSync(new URL('../../shared/v41-art-manifest.json',import.meta.url),'utf8'));

test('V41: exactly 80 canonical new concepts and 160 original recipes, older pairs unchanged',()=>{
 const before=buildCatalog(DATA,old), after=buildCatalog(DATA,[...old,ORGANIC_V41]);
 assert.equal(before.items.length,3622); assert.equal(before.recipes.size,9126);
 assert.equal(after.items.length,3702); assert.equal(after.recipes.size,9286);
 for(const [key,out] of before.recipes)assert.equal(after.recipes.get(key),out,`historical result changed ${key}`);
 assert.equal(new Set(after.items.map(i=>normalizeCatalogName(i.name))).size,3702);
 assert.equal(new Set(after.items.map(i=>i.id)).size,3702);
 assert.equal(ORGANIC_V41.items.length,80); assert.equal(ORGANIC_V41.recipes.length,160);
 for(const item of ORGANIC_V41.items){
  assert.ok(item.id.startsWith('organic41:'),item.id);
  assert.equal(ORGANIC_V41.recipes.filter(r=>r[2]===item.id).length,2,item.name);
  assert.ok(item.summary.length>=45,item.name);
 }
});

test('V41: five distinct 16-piece themed branches and two independently craftable paths',()=>{
 assert.equal(plan.length,80);
 for(let i=0;i<5;i++)assert.equal(plan.slice(16*i,16*i+16).length,16);
 const after=buildCatalog(DATA,[...old,ORGANIC_V41]);
 const ids=new Map(after.items.map(x=>[x.name,x.id]));
 for(const row of plan){
  assert.equal(row.paths.length,2,row.name);
  for(const [a,b] of row.paths)assert.equal(after.recipes.get(pair(ids.get(a),ids.get(b))),ids.get(row.name),`${a}+${b}→${row.name}`);
 }
});

test('V41: all 80 art sources match runtime SVG and SHA256 manifest, no duplicates or active embeds',()=>{
 assert.equal(Object.keys(ORGANIC_ART_V41).length,80);
 assert.equal(new Set(Object.values(ORGANIC_ART_V41)).size,80);
 assert.equal(manifest.icons.length,80);
 const byId=new Map(manifest.icons.map(m=>[m.id,m]));
 for(const item of ORGANIC_V41.items){
  const svg=ORGANIC_ART_V41[item.name.toLowerCase()];
  const record=byId.get(item.id);
  assert.ok(record,item.name);
  const path=new URL('../../'+record.path,import.meta.url);
  assert.ok(existsSync(path),record.path);
  const bytes=readFileSync(path,'utf8');
  assert.equal(bytes,svg,item.name);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,item.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i,item.name);
 }
});

test('V41: connected example discoveries in all five branches',()=>{
 const out=buildCatalog(DATA,[...old,ORGANIC_V41]);const ids=new Map(out.items.map(x=>[x.name,x.id]));
 for(const [a,b,t] of [['Snow','Storm','Blizzard'],['Lightning','Sound','Thunder'],['Ant','Earth','Anthill'],['Beetle','Flower','Ladybug'],['Clay','Fire','Brick'],['Book','House','Library'],['Map','Metal','Compass'],['Ship','Trade','Cargo Ship'],['Map','Treasure','Treasure Map'],['Writing','Pyramid','Hieroglyphics']])
  assert.equal(out.recipes.get(pair(ids.get(a),ids.get(b))),ids.get(t),`${a} + ${b} should make ${t}`);
});

test('V41: post-expansion duplicate name, ID, reversed pair and missing reference are blocked',()=>{
 const packs=[...old,ORGANIC_V41];
 assert.throws(()=>buildCatalog(DATA,[...packs,{items:[{id:'test:unrelated',name:'  tHuNdeR  '}],recipes:[]}],{checkReachability:false}),/duplicate name/i);
 assert.throws(()=>buildCatalog(DATA,[...packs,{items:[{id:'organic41:thunder',name:'Not Thunder'}],recipes:[]}],{checkReachability:false}),/duplicate ID/i);
 const [a,b,c]=ORGANIC_V41.recipes[0];
 assert.throws(()=>buildCatalog(DATA,[...packs,{items:[],recipes:[[b,a,c]]}],{checkReachability:false}),/duplicate unordered recipe/i);
 assert.throws(()=>buildCatalog(DATA,[...packs,{items:[],recipes:[['not-real',a,c]]}],{checkReachability:false}),/unknown|missing|invalid/i);
});

test('V41: installed code and offline bundle both use V41 source + exact custom icon priority',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const builder=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const validator=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V41_Offline.html',import.meta.url),'utf8');
 assert.match(app,/ORGANIC_ART_V41\[itemName\]\|\|ORGANIC_ART_V40/);
 for(const marker of ['ORGANIC_V41','ORGANIC_ART_V41','__gameverseOrganic41','__gameverseOrganicArt41'])assert.ok(builder.includes(marker),marker);
 assert.ok(validator.includes('shared/v41-art-manifest.json'));
 assert.ok(html.includes('V41 Offline')&&html.includes('ORGANIC_V41')&&html.includes('__gameverseOrganicArt41'));
 assert.ok(!html.includes('src="./src/app.js"'));
});
