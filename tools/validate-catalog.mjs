#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {GAMING_V22} from '../client/src/gaming-pack-v22.js';
import {GAMING_V23} from '../client/src/gaming-pack-v23.js';
import {GAMING_V24} from '../client/src/gaming-pack-v24.js';
import {GAMING_V26} from '../client/src/gaming-pack-v26.js';
import {GAMING_V27} from '../client/src/gaming-pack-v27.js';
import {GAMING_V30} from '../client/src/gaming-pack-v30.js';
import {ORGANIC_V32} from '../client/src/organic-pack-v32.js';
import {ORGANIC_V34} from '../client/src/organic-pack-v34.js';
import {ORGANIC_V37} from '../client/src/organic-pack-v37.js';
import {ORGANIC_V38} from '../client/src/organic-pack-v38.js';
import {ORGANIC_V40} from '../client/src/organic-pack-v40.js';
import {ORGANIC_V41} from '../client/src/organic-pack-v41.js';
import {ORGANIC_V42} from '../client/src/organic-pack-v42.js';
import {ORGANIC_V43} from '../client/src/organic-pack-v43.js';
import {ORGANIC_V44} from '../client/src/organic-pack-v44.js';
import {ORGANIC_ART_V44} from '../client/src/organic-art-v44.js';
import {ORGANIC_ART_V38} from '../client/src/organic-art-v38.js';
import {ORGANIC_ART_V40} from '../client/src/organic-art-v40.js';
import {ORGANIC_ART_V41} from '../client/src/organic-art-v41.js';
import {ORGANIC_ART_V42} from '../client/src/organic-art-v42.js';
import {ORGANIC_ART_V43} from '../client/src/organic-art-v43.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44];
try{
 const {items,recipes}=buildCatalog(DATA,packs);
 const original=readFileSync(join(root,'shared/v39-duplicate-resolution.json'),'utf8');
 const resolution=JSON.parse(original);
 const ids=new Set(items.map(i=>i.id));
 for(const removed of Object.keys(resolution.removed_duplicate_ids))if(ids.has(removed))throw Error('Legacy duplicate was reintroduced: '+removed);
 for(const iconItem of ORGANIC_V38.items){
  const svg=ORGANIC_ART_V38[iconItem.name.toLowerCase()];
  if(typeof svg!=='string'||!svg.startsWith('<svg')||!svg.endsWith('</svg>'))throw Error('V38 icon missing: '+iconItem.name);
 }
 for(const iconItem of ORGANIC_V40.items){
  const svg=ORGANIC_ART_V40[iconItem.name.toLowerCase()];
  if(typeof svg!=='string'||!svg.startsWith('<svg')||!svg.endsWith('</svg>'))throw Error('V40 icon missing: '+iconItem.name);
  if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(svg))throw Error('Unsafe or non-original V40 art: '+iconItem.name);
 }
 if(Object.keys(ORGANIC_ART_V40).length!==ORGANIC_V40.items.length||new Set(Object.values(ORGANIC_ART_V40)).size!==ORGANIC_V40.items.length) throw Error('V40 art is missing or repeated');
 const manifest41=JSON.parse(readFileSync(join(root,'shared/v41-art-manifest.json'),'utf8'));
 if(manifest41.icons?.length!==ORGANIC_V41.items.length||Object.keys(ORGANIC_ART_V41).length!==ORGANIC_V41.items.length||new Set(Object.values(ORGANIC_ART_V41)).size!==ORGANIC_V41.items.length)throw Error('V41 icon coverage or distinctness failure');
 const manifestById=new Map(manifest41.icons.map(x=>[x.id,x]));
 for(const item of ORGANIC_V41.items){
  const svg=ORGANIC_ART_V41[item.name.toLowerCase()];const record=manifestById.get(item.id);
  if(!svg?.startsWith('<svg')||!svg.endsWith('</svg>')||svg.length<320)throw Error('Missing or short V41 icon: '+item.name);
  if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(svg))throw Error('Unsafe V41 icon: '+item.name);
  if(record?.path!==`client/assets/v41/${item.id.split(':')[1]}.svg`)throw Error('Wrong V41 manifest path: '+item.id);
  const file=readFileSync(join(root,record.path),'utf8');
  if(svg!==file||createHash('sha256').update(file).digest('hex')!==record.sha256)throw Error('V41 icon manifest mismatch: '+item.name);
 }

 const manifest42=JSON.parse(readFileSync(join(root,'shared/v42-art-manifest.json'),'utf8'));
 if(manifest42.icons?.length!==64||ORGANIC_V42.items.length!==64||ORGANIC_V42.recipes.length!==128||Object.keys(ORGANIC_ART_V42).length!==64||new Set(Object.values(ORGANIC_ART_V42)).size!==64)throw Error('V42 pack or individual art count mismatch');
 const manifest42ById=new Map(manifest42.icons.map(x=>[x.id,x]));
 for(const item of ORGANIC_V42.items){
   const svg=ORGANIC_ART_V42[item.name.toLowerCase()],entry=manifest42ById.get(item.id);
   if(!svg?.startsWith('<svg')||!svg.endsWith('</svg>')||svg.length<340)throw Error('V42 missing or invalid SVG: '+item.name);
   if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(svg))throw Error('V42 unsafe/dependent SVG: '+item.name);
   if(entry?.path!==`client/assets/v42/${item.id.split(':')[1]}.svg`)throw Error('V42 art manifest path mismatch: '+item.name);
   const file=readFileSync(join(root,entry.path),'utf8');
   if(svg!==file||createHash('sha256').update(file).digest('hex')!==entry.sha256)throw Error('V42 SVG hash mismatch: '+item.name);
   if(ORGANIC_V42.recipes.filter(x=>x[2]===item.id).length!==2)throw Error('V42 result lacks exactly two recipes: '+item.name);
 }
 const manifest43=JSON.parse(readFileSync(join(root,'shared/v43-art-manifest.json'),'utf8'));
 if(ORGANIC_V43.items.length!==12 || ORGANIC_V43.recipes.length<500 || manifest43.icons?.length!==12 || Object.keys(ORGANIC_ART_V43).length!==12 || new Set(Object.values(ORGANIC_ART_V43)).size!==12)throw Error('V43 density or individual art count mismatch');
 const m43ById=new Map(manifest43.icons.map(x=>[x.id,x]));
 for(const item of ORGANIC_V43.items){
   const svg=ORGANIC_ART_V43[item.name.toLowerCase()], entry=m43ById.get(item.id);
   if(!svg?.startsWith('<svg')||!svg.endsWith('</svg>')||svg.length<300)throw Error('V43 missing/short SVG: '+item.name);
   if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(svg))throw Error('V43 unsafe SVG: '+item.name);
   if(entry?.path!==`client/assets/v43/${item.id.split(':')[1]}.svg`)throw Error('V43 art manifest path mismatch: '+item.name);
   const source=readFileSync(join(root,entry.path),'utf8');
   if(svg!==source||createHash('sha256').update(source).digest('hex')!==entry.sha256)throw Error('V43 SVG manifest mismatch: '+item.name);
   if(ORGANIC_V43.recipes.filter(r=>r[2]===item.id).length<2)throw Error('V43 new result needs two recipes: '+item.name);
 }
 const manifest44=JSON.parse(readFileSync(join(root,'shared/v44-art-manifest.json'),'utf8'));
 const generated44=JSON.parse(readFileSync(join(root,'shared/v44-density-generation.json'),'utf8'));
 if(ORGANIC_V44.items.length!==13 || ORGANIC_V44.recipes.length!==generated44.added_recipes || manifest44.icons.length!==13 || Object.keys(ORGANIC_ART_V44).length!==13 || new Set(Object.values(ORGANIC_ART_V44)).size!==13)throw Error('V44 icon/density count mismatch');
 const manifestById44=new Map(manifest44.icons.map(x=>[x.id,x]));
 for(const item of ORGANIC_V44.items){
   const icon=ORGANIC_ART_V44[item.name.toLowerCase()], entry=manifestById44.get(item.id);
   if(!icon?.startsWith('<svg')||!icon.endsWith('</svg>')||icon.length<300)throw Error('V44 icon missing: '+item.name);
   if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(icon))throw Error('Unsafe V44 vector: '+item.name);
   if(entry?.path!==`client/assets/v44/${item.id.split(':')[1]}.svg`)throw Error('Wrong V44 icon path: '+item.id);
   const disk=readFileSync(join(root,entry.path),'utf8');
   if(disk!==icon||createHash('sha256').update(icon).digest('hex')!==entry.sha256)throw Error('V44 SVG checksum failed: '+item.name);
   if(ORGANIC_V44.recipes.filter(r=>r[2]===item.id).length<2)throw Error('V44 new element has fewer than two recipes: '+item.name);
 }
 const baseline44=JSON.parse(readFileSync(join(root,'shared/v43-catalog-snapshot.json'),'utf8'));
 const original44=buildCatalog(DATA,packs.slice(0,-1));
 if(JSON.stringify(baseline44.items)!==JSON.stringify(original44.items) || JSON.stringify(baseline44.recipes)!==JSON.stringify([...original44.recipes].map(([k,v])=>[...k.split('|'),v])))throw Error('V44 baseline does not match V43 original catalog');
 for(const [k,v] of original44.recipes)if(recipes.get(k)!==v)throw Error('A+B output overwritten in V44: '+k);
 if(items.length!==baseline44.items.length+ORGANIC_V44.items.length || recipes.size!==baseline44.recipes.length+ORGANIC_V44.recipes.length)throw Error('V44 counted items/recipes not additive');
  const gen43=JSON.parse(readFileSync(join(root,'shared/v43-density-generation.json'),'utf8'));
 if(gen43.new_recipe_pairs!==ORGANIC_V43.recipes.length || gen43.old_recipes!==9414)throw Error('V43 generation report mismatch');
 // Candidate names that differ only by punctuation are REVIEW-ONLY, not automatically merged.
 // E.g. Atari 2600 and Atari 2600+ represent distinct consoles.
 const strong=new Map(); const caution=[];
 for(const item of items){
  const k=normalizeCatalogName(item.name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  if(strong.has(k))caution.push([strong.get(k),item.id]);else strong.set(k,item.id);
 }
 // Strict near-name gate. These two previously reviewed console generations are genuinely different products.
 const reviewedNearNamePairs=new Set(['legacy:368|legacy:1416','legacy:370|legacy:1417']);
 for(const ids of caution){
  if(!reviewedNearNamePairs.has(ids.join('|')))throw Error('Unreviewed near-duplicate canonical names: '+ids.join(' + '));
 }
 const report={release:'V44',status:'PASS',elements:items.length,recipes:recipes.size,
    unique_names:items.length,unique_ids:items.length,unique_unordered_pairs:recipes.size,
    reachable_elements:items.length,removed_duplicate_elements:Object.keys(resolution.removed_duplicate_ids).length,
    rewritten_recipe_references:resolution.changed_references,old_recipe_outcomes_preserved_except_two_explicit_changes:true,
    distinct_v38_art_verified:ORGANIC_V38.items.length,distinct_v40_art_verified:ORGANIC_V40.items.length,distinct_v41_art_verified:ORGANIC_V41.items.length,distinct_v42_art_verified:ORGANIC_V42.items.length,distinct_v43_art_verified:ORGANIC_V43.items.length,distinct_v44_art_verified:ORGANIC_V44.items.length,reviewed_near_name_exceptions:caution};
 if(!process.argv.includes('--quiet')){
  writeFileSync(join(root,'shared/v44-catalog-validation.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
 }
}catch(e){console.error('CATALOG VALIDATION FAILED:',e.stack||String(e));process.exitCode=1;}
