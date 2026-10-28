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
import {ORGANIC_V46} from '../client/src/organic-pack-v46.js';
import {ORGANIC_ART_V46} from '../client/src/organic-art-v46.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
export function validateV46(){
 const older=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44,ORGANIC_V45];
 const base=buildCatalog(DATA,older),all=buildCatalog(DATA,[...older,ORGANIC_V46]);
 if(base.items.length!==3803||base.recipes.size!==11631)throw Error('V45 counts drift');
 const snap=JSON.parse(readFileSync('shared/v45-catalog-snapshot-complete.json','utf8'));
 if(JSON.stringify(base.items.map(({id,name,category})=>({id,name,category})))!==JSON.stringify(snap.items)||JSON.stringify([...base.recipes].map(([k,v])=>[...k.split('|'),v]))!==JSON.stringify(snap.recipes))throw Error('V45 snapshot mutated');
 for(const [pair,out] of base.recipes)if(all.recipes.get(pair)!==out)throw Error('V45 recipe overwritten: '+pair);
 const n=ORGANIC_V46.items.length,m=ORGANIC_V46.recipes.length;
 if(n!==80||m<160||m>240||all.items.length!==base.items.length+n||all.recipes.size!==base.recipes.size+m)throw Error('V46 counts wrong');
 const art=JSON.parse(readFileSync('shared/v46-art-manifest.json','utf8'));
 if(art.icons.length!==80||Object.keys(ORGANIC_ART_V46).length!==80||new Set(Object.values(ORGANIC_ART_V46)).size!==80)throw Error('V46 art count or repeated art');
 const map=new Map(all.items.map(i=>[i.id,i]));const perTarget=new Map();
 for(const [a,b,out] of ORGANIC_V46.recipes){
  if(!out.startsWith('organic46:'))throw Error('New-first violation, V46 recipe does not produce new item');
  if(a===out||b===out)throw Error('Trivial self-result not permitted');
  const k=[a,b].sort().join('|');if(base.recipes.has(k)||all.recipes.get(k)!==out)throw Error('Existing or duplicated pair '+k);
  perTarget.set(out,(perTarget.get(out)||0)+1);
 }
 const names=new Set(all.items.map(i=>normalizeCatalogName(i.name)));
 if(names.size!==all.items.length)throw Error('Name duplicate');
 const tight=new Map();const exceptions=new Set(['legacy:368|legacy:1416','legacy:370|legacy:1417']);
 for(const item of all.items){let k=normalizeCatalogName(item.name).replace(/[^a-z0-9]/g,'');const other=tight.get(k);if(other&&!exceptions.has(other+'|'+item.id))throw Error('Near duplicate '+other+' / '+item.id);tight.set(k,item.id);}
 for(const item of ORGANIC_V46.items){
  if(perTarget.get(item.id)<2||perTarget.get(item.id)>3)throw Error('V46 new item must have 2-3 novel paths: '+item.name);
  const s=ORGANIC_ART_V46[item.name.toLowerCase()],meta=art.icons.find(x=>x.id===item.id);
  if(!s?.startsWith('<svg')||!s.endsWith('</svg>')||s.length<280||/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i.test(s))throw Error('V46 missing/unsafe art '+item.name);
  if(meta?.path!==`client/assets/v46/${item.id.slice(10)}.svg`)throw Error('V46 icon path mismatch '+item.name);
  const file=readFileSync(meta.path,'utf8');if(file!==s||createHash('sha256').update(file).digest('hex')!==meta.sha256)throw Error('Art manifest hash mismatch '+item.name);
 }
 const report={release:'V46',status:'PASS',elements:all.items.length,recipes:all.recipes.size,new_elements:n,new_recipes:m,new_output_ratio:1,art_unique:art.icons.length,prior_pairs_unchanged:base.recipes.size,reachable:all.items.length};
 if(!process.argv.includes('--quiet')){writeFileSync('shared/v46-catalog-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
 return report;
}
try{validateV46()}catch(e){console.error('V46 validation failed:',e.stack||e);process.exitCode=1;}
