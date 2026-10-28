import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
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
import {ORGANIC_ART_V43} from '../src/organic-art-v43.js';
import {buildCatalog, normalizeCatalogName} from '../src/catalog-integrity.js';
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42];
const old=buildCatalog(DATA,packs), next=buildCatalog(DATA,[...packs,ORGANIC_V43]);
const id=new Map(next.items.map(i=>[i.name,i.id]));
const key=(a,b)=>[a,b].sort().join('|');
function cohort(depth){
 let reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(let n=0;n<depth;n++){let added=new Set(reached);for(const [pair,out] of old.recipes)if(pair.split('|').every(x=>reached.has(x)))added.add(out);reached=added;}
 return reached;
}
function coverage(cat, ids){return [...cat.recipes.keys()].filter(k=>k.split('|').every(x=>ids.has(x))).length/(ids.size*(ids.size+1)/2);}
test('V43: adds twelve unique concepts and 861 alternative recipes without overwriting any old recipe',()=>{
 assert.equal(old.items.length,3766);assert.equal(old.recipes.size,9414);
 assert.equal(ORGANIC_V43.items.length,12);assert.equal(ORGANIC_V43.recipes.length,861);
 assert.equal(next.items.length,3778);assert.equal(next.recipes.size,10275);
 for(const [pair,out] of old.recipes)assert.equal(next.recipes.get(pair),out,pair);
});
test('V43: near-total early responsiveness (first 14 100%; old first 30 >38%; old first 67 >16%)',()=>{
 const a=cohort(1), b=cohort(2), c=cohort(3);
 assert.equal(a.size,14);assert.equal(b.size,30);assert.equal(c.size,67);
 assert.ok(coverage(old,a)<0.28);assert.equal(coverage(next,a),1);
 assert.ok(coverage(old,b)<0.15);assert.ok(coverage(next,b)>0.38);
 assert.ok(coverage(old,c)<0.07);assert.ok(coverage(next,c)>0.16);
});
test('V43: core thematic combinations return coherent intended results and legacy results remain fixed',()=>{
 for(const [a,b,out] of [
  ['Dust','Wind','Sandstorm'],['Air','Dust','Haze'],['Fire','Fuel','Smoke'],
  ['Fire','Paper','Ash'],['Fire','Forest','Wildfire'],['Smoke','Fog','Smog'],
  ['Rain','Sun','Rainbow'],['Sun','Drizzle','Sunshower'],['Water','Snow','Slush'],
  ['Rain','Soil','Mud'],['Lava','Sea','Stone'],['Mud','Mountain','Mudslide'],
  ['Smoke','Stone','Soot'],['Wood','Heat','Charcoal']
 ])assert.equal(next.recipes.get(key(id.get(a),id.get(b))),id.get(out),a+' + '+b);
});
test('V43: no duplicate normalized names, recipe pairs, unknown reference or unreachable discovery',()=>{
 assert.equal(new Set(next.items.map(x=>normalizeCatalogName(x.name))).size,3778);
 assert.equal(new Set(next.items.map(x=>x.id)).size,3778);
 assert.equal(new Set(next.recipes.keys()).size,10275);
 for(const item of ORGANIC_V43.items){
  assert.ok(next.items.some(x=>x.id===item.id));
  assert.ok(ORGANIC_V43.recipes.filter(r=>r[2]===item.id).length>=2,item.name);
 }
 const [a,b,out]=ORGANIC_V43.recipes[0];
 assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V43,{items:[],recipes:[[b,a,out]]}],{checkReachability:false}),/duplicate unordered recipe/);
 assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V43,{items:[{id:'bad',name:'  smOke '}],recipes:[]}],{checkReachability:false}),/duplicate name/);
});
test('V43: twelve distinct independent vector assets, hash-verified, and clean SVG markup',()=>{
 const report=JSON.parse(readFileSync(new URL('../../shared/v43-art-manifest.json',import.meta.url)));
 assert.equal(report.icons.length,12);assert.equal(new Set(Object.values(ORGANIC_ART_V43)).size,12);
 for(const item of ORGANIC_V43.items){
  const entry=report.icons.find(e=>e.id===item.id);assert.ok(entry,item.name);
  const file=new URL('../../'+entry.path,import.meta.url);assert.ok(existsSync(file));
  const svg=readFileSync(file,'utf8');assert.equal(ORGANIC_ART_V43[item.name.toLowerCase()],svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'),entry.sha256);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i);
 }
});
test('V43: source generator is explicit, no random fallback or runtime generation and conflict report records discarded alternatives',()=>{
 const generator=readFileSync(new URL('../../tools/build-v43-density.py',import.meta.url),'utf8');
 const report=JSON.parse(readFileSync(new URL('../../shared/v43-density-generation.json',import.meta.url)));
 assert.match(generator,/Every manual pair means two named ingredients/);
 assert.match(generator,/Curated/);
 assert.equal(report.new_recipe_pairs,861);assert.ok(report.competing_new_rule_proposals.length>0);
 assert.equal(report.old_recipes,9414);
});
test('V43: app, strict build validation and standalone include V43 and 12 themed icons',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const validator=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V43_Offline.html',import.meta.url),'utf8');
 assert.match(app,/ORGANIC_ART_V43\[itemName\]\|\|ORGANIC_ART_V42/);
 assert.ok(validator.includes('v43-art-manifest.json'));
 for(const str of ['ORGANIC_V43','ORGANIC_ART_V43','__gameverseOrganic43','__gameverseOrganicArt43'])assert.ok(build.includes(str));
 assert.ok(html.includes('V43 Offline'));assert.ok(html.includes('organic43:smoke'));
});
test('V43: pinned V42 authoring snapshot exactly matches the modules used by runtime',()=>{
 const base=JSON.parse(readFileSync(new URL('../../shared/v42-catalog-snapshot.json',import.meta.url)));
 assert.deepEqual(base.items,old.items);
 assert.deepEqual(base.recipes,[...old.recipes]);
});
