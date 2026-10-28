/** Required release gate V53: actual catalog closure, visual coverage, deterministic crafting and shared-family progress. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V53} from '../client/src/organic-pack-v53.js';
import {ORGANIC_ART_V53} from '../client/src/organic-art-v53.js';
import {familiesFor} from '../client/src/discoveries.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
import {synchronizeFamilyProfiles,sharedMembership} from '../client/src/family-shared-v51.js';
const modules=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52'];
const packs=[PACK];for(const n of modules){const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');packs.push(Object.values(await import(`../client/src/${f}.js`))[0]);}
const baseline=buildCatalog(DATA,packs),full=buildCatalog(DATA,[...packs,ORGANIC_V53]);
assert.equal(baseline.items.length,4023);assert.equal(baseline.recipes.size,12189);
assert.equal(full.items.length,4071);assert.equal(full.recipes.size,12285);
assert.equal(ORGANIC_V53.items.length,48);assert.equal(ORGANIC_V53.recipes.length,96);
for(const [pair,out] of baseline.recipes) assert.equal(full.recipes.get(pair),out,'Changed historical recipe '+pair);
const validNames=new Set(),validIds=new Set();for(const it of full.items){const key=normalizeCatalogName(it.name);assert.ok(!validNames.has(key),'Duplicate name: '+it.name);assert.ok(!validIds.has(it.id),'Duplicate ID');validNames.add(key);validIds.add(it.id);}
const newIDs=new Set(ORGANIC_V53.items.map(i=>i.id)),newPairs=new Set();
for(const [a,b,out] of ORGANIC_V53.recipes){const k=[a,b].sort().join('|');assert.ok(!baseline.recipes.has(k),'Previous recipe redefined');assert.ok(!newPairs.has(k),'Duplicate unordered pair');assert.equal(full.recipes.get(k),out);assert.ok(newIDs.has(out),'New recipe returned an old element');assert.equal(full.recipes.get([b,a].sort().join('|')),out);newPairs.add(k);}
for(const item of ORGANIC_V53.items)assert.equal(ORGANIC_V53.recipes.filter(x=>x[2]===item.id).length,2,'Not 2 routes: '+item.name);
const manifest=JSON.parse(readFileSync(new URL('../shared/v53-art-manifest.json',import.meta.url)));const hashes=new Set(),motifs=new Set();
assert.equal(manifest.icons.length,48);assert.equal(Object.keys(ORGANIC_ART_V53).length,48);
for(const it of ORGANIC_V53.items){const svg=ORGANIC_ART_V53[it.name.toLowerCase()];assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>')&&svg.length>400);assert.ok(!/<script|<image|<foreignObject|<animate|onload=|href=|<use|<text/i.test(svg));const entry=manifest.icons.find(x=>x.id===it.id);assert.ok(entry);const disk=readFileSync(new URL('../'+entry.path,import.meta.url),'utf8');assert.equal(svg,disk);const hash=createHash('sha256').update(svg).digest('hex');assert.equal(hash,entry.sha256);hashes.add(hash);motifs.add(entry.motifs.join('/'));}
assert.equal(hashes.size,48);assert.equal(motifs.size,48);
const f=FAMILY_CAMPAIGNS.families;assert.equal(f.length,2);assert.equal(FAMILY_CAMPAIGNS.version,53);
const index=new Map(full.items.map(i=>[i.id,i]));
for(const campaign of f){const ids=new Set(campaign.items);assert.equal(ids.size,campaign.items.length);assert.equal(campaign.starters.length,4);const known=new Set(campaign.starters);const seen=new Set();for(const [pair,out] of campaign.recipes){assert.equal(pair,pair.split('|').sort().join('|'));assert.ok(!seen.has(pair));seen.add(pair);const [a,b]=pair.split('|');assert.ok(ids.has(a)&&ids.has(b)&&ids.has(out),'Family recipe crosses its boundary');if(full.recipes.has(pair))assert.equal(full.recipes.get(pair),out,'Classic/Family conflict');}
for(let i=0;i<ids.size+1;i++){const before=known.size;for(const [pair,out] of campaign.recipes){const [a,b]=pair.split('|');if(known.has(a)&&known.has(b))known.add(out);}if(before===known.size)break;}
assert.equal(known.size,ids.size,'Unreachable in '+campaign.id+': '+[...ids].filter(id=>!known.has(id)).join(','));for(const id of ids)assert.ok(index.has(id)&&familiesFor(index.get(id)).includes(campaign.id));}
assert.deepEqual(f.map(x=>[x.id,x.items.length,x.recipes.length]),[['nature',476,1781],['people',211,266]]);
const shared=sharedMembership(f);assert.equal(shared.size,31);
for(const id of shared.keys()){const state=synchronizeFamilyProfiles({nature:{unlocked:[...f[0].starters,id]},people:{unlocked:[...f[1].starters]}},f);assert.ok(state.profiles.people.unlocked.includes(id),'Shared unlock failed');assert.deepEqual(synchronizeFamilyProfiles(state.profiles,f).profiles,state.profiles);}
assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V53,{items:[{...ORGANIC_V53.items[0],id:'bad-id'}],recipes:[]}],{checkReachability:false}),/duplicate name/);
const [a,b,out]=ORGANIC_V53.recipes[0];assert.throws(()=>buildCatalog(DATA,[...packs,ORGANIC_V53,{items:[],recipes:[[b,a,out]]}],{checkReachability:false}),/duplicate unordered recipe/);
if(!process.argv.includes('--quiet'))console.log('V53 PASS: 4,071 unique items, 12,285 recipes, 48 original SVGs, 2 closed family campaigns (476/211), 31 shared IDs, all older recipes immutable');
