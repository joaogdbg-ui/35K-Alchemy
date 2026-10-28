import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';

const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38];
const testItems=[['Water','nature',0,''],['Fire','nature',0,''],['Earth','nature',0,''],['Air','nature',0,'']];
const simple=()=>({items:structuredClone(testItems),recipes:[]});
const bonus=(id,name)=>({id,name,category:'concept',summary:'Test element'});
const packageOf=(items=[],recipes=[])=>({items,recipes});
const uniquePair=(a,b)=>[a,b].sort().join('|');

test('V39: entire shipping catalog has one ID, one normalized name, and one recipe per unordered pair',()=>{
 const {items,recipes}=buildCatalog(DATA,packs);
 assert.equal(items.length,3558);
 assert.equal(recipes.size,8998);
 assert.equal(new Set(items.map(i=>i.id)).size,items.length);
 assert.equal(new Set(items.map(i=>normalizeCatalogName(i.name))).size,items.length);
 const all=DATA.recipes.length+packs.reduce((n,p)=>n+p.recipes.length,0);
 assert.equal(recipes.size,all,'no recipe can be hidden by a first-wins Map');
});

test('V39: removes all 14 redundant records from the source; existing products with + remain distinct',()=>{
 const {items}=buildCatalog(DATA,packs);
 const report=JSON.parse(readFileSync(new URL('../../shared/v39-duplicate-resolution.json',import.meta.url)));
 assert.equal(Object.keys(report.removed_duplicate_ids).length,14);
 for(const removed of Object.keys(report.removed_duplicate_ids))assert.ok(!items.some(i=>i.id===removed),removed);
 for(const label of ['Atari 2600','Atari 2600+','Atari 7800','Atari 7800+'])assert.equal(items.filter(i=>i.name===label).length,1,label);
});

test('V39: formerly conflicting recipes now have four distinct, reachable outcomes',()=>{
 const {recipes}=buildCatalog(DATA,packs);
 assert.equal(recipes.get(uniquePair('legacy:545','legacy:118')),'legacy:567'); // Samurai
 assert.equal(recipes.get(uniquePair('legacy:545','legacy:187')),'pack:swordfighter');
 assert.equal(recipes.get(uniquePair('legacy:553','legacy:530')),'legacy:919'); // Wolfenstein 3D
 assert.equal(recipes.get(uniquePair('legacy:185','legacy:221')),'gaming22:worldofwarcraft');
});

test('V39: build rejects duplicate element names in another pack, regardless of case or spaces',()=>{
 const base=simple();
 for(const bad of [' WATER ', 'wAtEr','WATER','WaTeR  '])
  assert.throws(()=>buildCatalog(base,[packageOf([bonus('new:water',bad)])]),/duplicate name/);
 assert.throws(()=>buildCatalog(base,[packageOf([bonus('new:a','Magic Star'),bonus('new:b','magic   star')])]),/duplicate name/);
});

test('V39: build rejects typographic Unicode duplicates but does not erase meaningful symbols',()=>{
 assert.equal(normalizeCatalogName('  Yars’   Revenge '),normalizeCatalogName("YARS' REVENGE"));
 assert.equal(normalizeCatalogName('Pokémon'),normalizeCatalogName('Pokemon'));
 assert.notEqual(normalizeCatalogName('Atari 2600'),normalizeCatalogName('Atari 2600+'));
 assert.throws(()=>buildCatalog(simple(),[packageOf([bonus('new:a','Yars’ Revenge'),bonus('new:b',"YARS' REVENGE")])]),/duplicate name/);
 assert.doesNotThrow(()=>buildCatalog(simple(),[packageOf([bonus('new:a','Atari 2600'),bonus('new:b','Atari 2600+')])],{checkReachability:false}));
});

test('V39: build rejects duplicate IDs, including collisions across distinct content packs',()=>{
 const base=simple();
 assert.throws(()=>buildCatalog(base,[packageOf([bonus('legacy:0','Unrelated')])]),/duplicate ID/);
 assert.throws(()=>buildCatalog(base,[packageOf([bonus('new:x','Alpha')]),packageOf([bonus('new:x','Beta')])]),/duplicate ID/);
});

test('V39: build rejects repeated unordered recipes even with reversed ingredient order',()=>{
 const base=simple();base.recipes=[[0,1,2]];
 assert.throws(()=>buildCatalog(base,[packageOf([],[['legacy:1','legacy:0','legacy:2']])]),/duplicate unordered recipe/);
 assert.throws(()=>buildCatalog(base,[packageOf([],[['legacy:1','legacy:0','legacy:3']])]),/duplicate unordered recipe/);
});

test('V39: build rejects invalid ingredient/results and unreachable items',()=>{
 assert.throws(()=>buildCatalog(simple(),[packageOf([],[['legacy:0','missing:item','legacy:2']])]),/unknown recipe ID/);
 assert.throws(()=>buildCatalog(simple(),[packageOf([bonus('new:x','Inaccessible')])]),/unreachable elements/);
 assert.doesNotThrow(()=>buildCatalog(simple(),[packageOf([bonus('new:x','Accessible')],[['legacy:0','legacy:1','new:x']])]));
});

test('V39: browser and offline build cannot bypass the catalog validator',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const cli=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V39_Offline.html',import.meta.url),'utf8');
 assert.match(app,/buildCatalog\(DATA,\[PACK,/);
 assert.match(build,/subprocess\.run\(\['node','tools\/validate-catalog\.mjs','--quiet'\].*check=True/);
 assert.match(cli,/buildCatalog\(DATA,packs\)/);
 assert.match(html,/function buildCatalog\(/);
 assert.match(html,/V39 Offline/);
});
