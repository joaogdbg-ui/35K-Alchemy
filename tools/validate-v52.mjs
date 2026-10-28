/** Strict V52 release gate: new-first catalog, family closure and shared propagation. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V50} from '../client/src/organic-pack-v50.js';
import {ORGANIC_V52} from '../client/src/organic-pack-v52.js';
import {ORGANIC_ART_V52} from '../client/src/organic-art-v52.js';
import {familiesFor,groupFamilies} from '../client/src/discoveries.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v52-campaigns.js';
import {sharedMembership,synchronizeFamilyProfiles} from '../client/src/family-shared-v51.js';
const mods=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47'];
const packs=[PACK];for(const n of mods){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const old=buildCatalog(DATA,[...packs,ORGANIC_V50]),current=buildCatalog(DATA,[...packs,ORGANIC_V50,ORGANIC_V52]);
assert.equal(old.items.length,3975);assert.equal(old.recipes.size,12093);
assert.equal(current.items.length,4023);assert.equal(current.recipes.size,12189);
assert.equal(ORGANIC_V52.items.length,48);assert.equal(ORGANIC_V52.recipes.length,96);
for(const [pair,result] of old.recipes)assert.equal(current.recipes.get(pair),result,`Previous outcome changed: ${pair}`);
const oldPairs=new Set(old.recipes.keys());const newIDs=new Set(ORGANIC_V52.items.map(i=>i.id));const pairs=new Set();
for(const [a,b,out] of ORGANIC_V52.recipes){const k=[a,b].sort().join('|');assert.equal(current.recipes.get(k),out);assert.ok(!oldPairs.has(k));assert.ok(!pairs.has(k),'duplicate unordered pair '+k);assert.ok(newIDs.has(out),'V52 recipe yielded old item '+out);pairs.add(k);}
for(const item of ORGANIC_V52.items)assert.equal(ORGANIC_V52.recipes.filter(r=>r[2]===item.id).length,2,`Not exactly two recipes for ${item.name}`);
const manifest=JSON.parse(readFileSync(new URL('../shared/v52-art-manifest.json',import.meta.url)));
assert.equal(manifest.icons.length,48);assert.equal(Object.keys(ORGANIC_ART_V52).length,48);
const hashes=new Set(),motifs=new Set();for(const item of ORGANIC_V52.items){const svg=ORGANIC_ART_V52[item.name.toLowerCase()];assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>')&&svg.length>400);assert.ok(!/<script|<image|<foreignObject|<animate|onload=|href=|<use|<text/i.test(svg));const entry=manifest.icons.find(x=>x.id===item.id);assert.ok(entry);const disk=readFileSync(new URL(`../${entry.path}`,import.meta.url),'utf8');assert.equal(svg,disk);const sha=createHash('sha256').update(svg).digest('hex');assert.equal(sha,entry.sha256);hashes.add(sha);motifs.add(entry.motifs.join('/'));}assert.equal(hashes.size,48);assert.equal(motifs.size,48);
const idMap=new Map(current.items.map(i=>[i.id,i]));const groups=groupFamilies(current.items,new Set());const campaigns=FAMILY_CAMPAIGNS.families;assert.equal(campaigns.length,2);assert.equal(FAMILY_CAMPAIGNS.version,52);
for(const f of campaigns){const ids=new Set(f.items),seeds=new Set(f.starters);assert.equal(ids.size,f.items.length);assert.equal(seeds.size,4);assert.equal(groups[f.id].ids.length,ids.size);assert.ok(groups[f.id].ids.every(id=>ids.has(id)));
const seen=new Set(),known=new Set(f.starters);for(const [pair,out] of f.recipes){const ingredients=pair.split('|');assert.equal(ingredients.length,2);assert.equal(pair,[...ingredients].sort().join('|'));assert.ok(!seen.has(pair),`Repeated family recipe: ${f.id} ${pair}`);seen.add(pair);assert.ok(ids.has(out)&&ingredients.every(x=>ids.has(x)),`Not closed: ${f.id} ${pair}`);if(current.recipes.has(pair))assert.equal(current.recipes.get(pair),out,`Classic/family conflict ${f.id}: ${pair}`);}
for(let i=0;i<ids.size+1;i++){const before=known.size;for(const [pair,out] of f.recipes){const [a,b]=pair.split('|');if(known.has(a)&&known.has(b))known.add(out);}if(before===known.size)break;}
assert.equal(known.size,ids.size,`${f.id} has ${ids.size-known.size} unreachable elements`);assert.ok(f.items.every(id=>idMap.has(id)&&familiesFor(idMap.get(id)).includes(f.id)));}
assert.equal(campaigns[0].items.length,442);assert.equal(campaigns[1].items.length,189);assert.equal(campaigns[0].recipes.length,1721);assert.equal(campaigns[1].recipes.length,230);
const shared=sharedMembership(campaigns);assert.equal(shared.size,23);
for(const [id,owners] of shared){assert.equal(owners.size,2);for(const f of campaigns){const state=synchronizeFamilyProfiles({[f.id]:{unlocked:[...f.starters,id]}},campaigns);assert.ok(state.profiles.nature.unlocked.includes(id)&&state.profiles.people.unlocked.includes(id));assert.deepEqual(synchronizeFamilyProfiles(state.profiles,campaigns).profiles,state.profiles);}}
// Negative fixtures must fail: duplicates in names, reversed unordered recipes and unknown IDs.
assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V50,ORGANIC_V52,{items:[{...ORGANIC_V52.items[0],id:'v52:duplicate'}],recipes:[]}],{checkReachability:false}),/duplicate name/);
const [a,b,out]=ORGANIC_V52.recipes[0];assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V50,ORGANIC_V52,{items:[],recipes:[[b,a,out]]}],{checkReachability:false}),/duplicate unordered recipe/);
assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V50,ORGANIC_V52,{items:[],recipes:[['missing-id',a,out]]}],{checkReachability:false}),/unknown recipe ID/);
// Near-duplicate names should be flagged, but specific existing branded variants stay separate.
const normalized=new Set();for(const it of current.items){const name=normalizeCatalogName(it.name);assert.ok(!normalized.has(name));normalized.add(name);}
console.log('V52 PASS: 4023 unique elements, 12189 deterministic Classic recipes, 48 distinct SVGs, 2 fully reachable families (442/189), 23 shared elements; duplicate/conflict negative tests PASS');
