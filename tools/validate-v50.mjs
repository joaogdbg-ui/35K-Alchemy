import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog } from '../client/src/catalog-integrity.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v50-campaigns.js';
import {familiesFor,familyFor,groupFamilies} from '../client/src/discoveries.js';
import {ORGANIC_V50} from '../client/src/organic-pack-v50.js';
import {ORGANIC_ART_V50} from '../client/src/organic-art-v50.js';
import {createHash} from 'node:crypto';
const packs=[PACK];for(const v of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47']){const mod=await import(`../client/src/${v.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const base=buildCatalog(DATA,packs),updated=buildCatalog(DATA,[...packs,ORGANIC_V50]);
const classic=base.recipes,newRecipes=updated.recipes;
if(base.items.length!==3963||classic.size!==12069)throw Error('Unexpected V49 source of truth');
if(updated.items.length!==3975||newRecipes.size!==12093)throw Error('Incorrect V50 catalog count');
if(ORGANIC_V50.items.length!==12||ORGANIC_V50.recipes.length!==24)throw Error('New-first expansion must have 12 elements and 24 recipes');
for(const [key,out] of classic)if(newRecipes.get(key)!==out)throw Error('V49 changed '+key);
for(const [key,out] of newRecipes)if(!classic.has(key)&&!out.startsWith('organic50:'))throw Error('V50 new recipe does not create new item: '+key);
const artEntries=Object.entries(ORGANIC_ART_V50);if(artEntries.length!==12)throw Error('V50 art coverage wrong');
const artHashes=new Set();for(const e of ORGANIC_V50.items){const svg=ORGANIC_ART_V50[e.name.toLowerCase()];if(!svg?.startsWith('<svg')||!svg.includes('</svg>')||/https?:\/\/(?!www\.w3\.org)|<script|onload=|<image\b/i.test(svg))throw Error('Invalid SVG '+e.name);artHashes.add(createHash('sha256').update(svg).digest('hex'));}
if(artHashes.size!==12)throw Error('Duplicate V50 art');
if(FAMILY_CAMPAIGNS.version!==50||FAMILY_CAMPAIGNS.families.length!==2)throw Error('Two family campaigns required');
const familyById=new Map(FAMILY_CAMPAIGNS.families.map(c=>[c.id,c]));const groups=groupFamilies(updated.items,new Set());
const addedSharedIds=new Set();
for(const c of FAMILY_CAMPAIGNS.families){
 const ids=new Set(c.items),starters=new Set(c.starters),r=new Map(c.recipes);
 if(starters.size!==4||r.size!==c.recipes.length||ids.size!==c.items.length)throw Error('Duplicate starters, item IDs or recipes in '+c.id);
 for(const id of ids){const item=updated.items.find(x=>x.id===id);if(!item||!familiesFor(item).includes(c.id))throw Error('Invalid category membership '+id);}
 if(groups[c.id].ids.length!==ids.size ||groups[c.id].ids.some(id=>!ids.has(id)))throw Error('Incomplete family '+c.id);
 const reached=new Set(starters);
 for(const [key,out] of r){const [a,b]=key.split('|');if(key!==[a,b].sort().join('|')||!ids.has(a)||!ids.has(b)||!ids.has(out))throw Error('Invalid family recipe '+key);if(newRecipes.has(key)&&newRecipes.get(key)!==out)throw Error('Classic conflict '+key);}
 for(let i=0;i<ids.size+1;i++){let old=reached.size;for(const [key,out] of r){const [a,b]=key.split('|');if(reached.has(a)&&reached.has(b))reached.add(out)}if(reached.size===old)break;}
 if(reached.size!==ids.size)throw Error('Not all reached: '+c.id+' '+[...ids].filter(id=>!reached.has(id)).join(','));
 if(!process.argv.includes('--quiet'))console.log(`Family ${c.id}: ${ids.size} items, ${r.size} recipes, four starters; all reachable`);
}
for(const item of updated.items){if(familiesFor(item).length>1){if(familyFor(item)==='people'&&familiesFor(item).includes('nature'))addedSharedIds.add(item.id);}}
if(addedSharedIds.size!==15)throw Error('Expected exactly fifteen shared People/Nature elements');
const nature=familyById.get('nature'),people=familyById.get('people');if(nature.items.length!==408||people.items.length!==167||nature.recipes.length!==1661||people.recipes.length!==194)throw Error('Unexpected family graph sizes');
for(const id of addedSharedIds)if(!nature.items.includes(id)||!people.items.includes(id))throw Error('Lost multi-family shared ID '+id);
console.log('V50 PASS: 3975 unique elements, 12093 fixed Classic recipes, 15 shared elements, two complete campaigns and 12 unique SVGs');
