import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
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
import {ORGANIC_V45} from '../client/src/organic-pack-v45.js';
import {ORGANIC_V46} from '../client/src/organic-pack-v46.js';
import {ORGANIC_V47} from '../client/src/organic-pack-v47.js';
import {ORGANIC_ART_V47} from '../client/src/organic-art-v47.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
export function validateV47(){
 const older=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44,ORGANIC_V45,ORGANIC_V46];
 const base=buildCatalog(DATA,older),all=buildCatalog(DATA,[...older,ORGANIC_V47]);
 if(base.items.length!==3883||base.recipes.size!==11847)throw Error('V46 counts drift');
 const snap=JSON.parse(readFileSync('shared/v46-catalog-snapshot-complete.json','utf8'));
 if(JSON.stringify(base.items.map(({id,name,category})=>({id,name,category})))!==JSON.stringify(snap.items)||JSON.stringify([...base.recipes].map(([k,v])=>[...k.split('|'),v]))!==JSON.stringify(snap.recipes))throw Error('V46 frozen snapshot changed');
 for(const [pair,out] of base.recipes)if(all.recipes.get(pair)!==out)throw Error('Old pair overwritten: '+pair);
 const n=ORGANIC_V47.items.length,m=ORGANIC_V47.recipes.length;
 if(n!==80||m<160||m>240||all.items.length!==base.items.length+n||all.recipes.size!==base.recipes.size+m)throw Error('Unexpected V47 counts');
 const art=JSON.parse(readFileSync('shared/v47-art-manifest.json','utf8'));
 if(art.icons.length!==80||Object.keys(ORGANIC_ART_V47).length!==80||new Set(Object.values(ORGANIC_ART_V47)).size!==80)throw Error('Artwork distinctness/count failure');
 const perTarget=new Map();const newPairs=new Set();
 for(const [a,b,o] of ORGANIC_V47.recipes){
  if(!o.startsWith('organic47:'))throw Error('All new recipes must produce new elements');
  if(a===o||b===o)throw Error('Self-result');
  const k=[a,b].sort().join('|');
  if(newPairs.has(k)||base.recipes.has(k)||all.recipes.get(k)!==o)throw Error('Recipe duplicate/conflict '+k);
  newPairs.add(k);perTarget.set(o,(perTarget.get(o)||0)+1);
 }
 const normalized=new Set(all.items.map(i=>normalizeCatalogName(i.name)));
 if(normalized.size!==all.items.length)throw Error('Duplicate canonical names');
 const tight=new Map(),exceptions=new Set(['legacy:368|legacy:1416','legacy:370|legacy:1417']);
 for(const item of all.items){
  const k=normalizeCatalogName(item.name).replace(/[^a-z0-9]/g,'');const old=tight.get(k);
  if(old&&!exceptions.has(old+'|'+item.id))throw Error('Near-duplicate '+old+' / '+item.id);
  tight.set(k,item.id);
 }
 for(const item of ORGANIC_V47.items){
  if((perTarget.get(item.id)||0)<2||(perTarget.get(item.id)||0)>3)throw Error('V47 item requires 2-3 authored routes: '+item.name);
  const svg=ORGANIC_ART_V47[item.name.toLowerCase()],entry=art.icons.find(e=>e.id===item.id);
  if(!svg?.startsWith('<svg')||!svg.endsWith('</svg>')||svg.length<300||/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(svg))throw Error('Missing/unsafe SVG '+item.name);
  if(entry?.path!==`client/assets/v47/${item.id.split(':')[1]}.svg`)throw Error('Wrong art manifest path '+item.name);
  const disk=readFileSync(entry.path,'utf8');if(svg!==disk||createHash('sha256').update(disk).digest('hex')!==entry.sha256)throw Error('SVG hash or content mismatch '+item.name);
 }
 const report={release:'V47',status:'PASS',elements:all.items.length,recipes:all.recipes.size,new_elements:n,new_recipes:m,new_output_ratio:1,distinct_new_icons:80,old_unordered_pairs_preserved:base.recipes.size,reachable_items:all.items.length};
 if(!process.argv.includes('--quiet')){writeFileSync('shared/v47-catalog-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
 return report;
}
try{validateV47()}catch(e){console.error('V47 validation failed:',e.stack||e);process.exitCode=1;}
