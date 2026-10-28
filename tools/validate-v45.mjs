import {readFileSync,writeFileSync} from 'node:fs';
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
import {ORGANIC_ART_V45} from '../client/src/organic-art-v45.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
try{
 const basePacks=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44];
 const base=buildCatalog(DATA,basePacks);
 const all=buildCatalog(DATA,[...basePacks,ORGANIC_V45]);
 if(base.items.length!==3791||base.recipes.size!==11111)throw Error('V44 baseline count drift');
 const snap=JSON.parse(readFileSync('shared/v44-catalog-snapshot.json','utf8'));
 if(JSON.stringify(snap.items)!==JSON.stringify(base.items)||JSON.stringify(snap.recipes)!==JSON.stringify([...base.recipes].map(([key,v])=>[...key.split('|'),v])))throw Error('V44 snapshot changed');
 for(const [pair,out] of base.recipes)if(all.recipes.get(pair)!==out)throw Error('Historical A+B outcome changed: '+pair);
 for(const [a,b,o] of ORGANIC_V45.recipes){const key=[b,a].sort().join('|');if(all.recipes.get(key)!==o||base.recipes.has(key))throw Error('V45 inverted duplicate or changed old result: '+key);}
 const generation=JSON.parse(readFileSync('shared/v45-density-generation.json','utf8'));
 if(ORGANIC_V45.items.length!==12||ORGANIC_V45.recipes.length!==generation.added_recipes||generation.added_recipes<400)throw Error('V45 item/recipe report drift');
 if(all.items.length!==base.items.length+12||all.recipes.size!==base.recipes.size+ORGANIC_V45.recipes.length)throw Error('Unexpected V45 totals');
 const manifest=JSON.parse(readFileSync('shared/v45-art-manifest.json','utf8'));
 if(manifest.icons.length!==12||Object.keys(ORGANIC_ART_V45).length!==12||new Set(Object.values(ORGANIC_ART_V45)).size!==12)throw Error('V45 art duplicate or incomplete');
 for(const item of ORGANIC_V45.items){
  const icon=ORGANIC_ART_V45[item.name.toLowerCase()];const m=manifest.icons.find(x=>x.id===item.id);
  if(!icon?.startsWith('<svg')||!icon.endsWith('</svg>')||icon.length<400)throw Error('Missing V45 icon: '+item.id);
  if(/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(icon))throw Error('Unsafe external/dependent V45 SVG: '+item.id);
  if(m?.path!==`client/assets/v45/${item.id.slice(10)}.svg`)throw Error('Invalid SVG path '+item.id);
  const actual=readFileSync(m.path,'utf8');
  if(actual!==icon||createHash('sha256').update(actual).digest('hex')!==m.sha256)throw Error('V45 SVG checksum mismatch '+item.id);
  if(ORGANIC_V45.recipes.filter(x=>x[2]===item.id).length<2)throw Error('V45 item insufficient routes '+item.id);
 }
 const normalized=new Set(all.items.map(x=>normalizeCatalogName(x.name)));
 if(normalized.size!==all.items.length)throw Error('Duplicate names after normalization');
 const punctuation=new Map(), reviewed=new Set(['legacy:368|legacy:1416','legacy:370|legacy:1417']);
 for(const item of all.items){const key=normalizeCatalogName(item.name).replace(/[^a-z0-9]/g,'');if(punctuation.has(key)&&!reviewed.has(punctuation.get(key)+'|'+item.id))throw Error('Unreviewed near duplicate name '+item.name);punctuation.set(key,item.id);}
 const report={release:'V45',status:'PASS',elements:all.items.length,recipes:all.recipes.size,unique_names:normalized.size,unique_ids:new Set(all.items.map(i=>i.id)).size,unique_unordered_recipe_pairs:all.recipes.size,reachable:all.items.length,old_pairs_unchanged:base.recipes.size,new_icons_verified:manifest.icons.length};
 if(!process.argv.includes('--quiet')){writeFileSync('shared/v45-catalog-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
}catch(e){console.error('V45 CATALOG VALIDATION FAILED',e.stack||e);process.exitCode=1;}
