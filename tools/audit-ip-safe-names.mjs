/**
 * Non-legal build-time screening. Historical IDs and original third-party
 * references are intentionally preserved; only *public* labels are assessed.
 */
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
import {publicName,buildPublicNameIndex,hasUnresolvedPublicIPSignal} from '../client/src/ip-safe-names.js';
import {readFileSync} from 'node:fs';
const versions=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76'];
const packs=[PACK];
for(const v of versions){const path=v.replace('gaming','gaming-pack').replace('organic','organic-pack');const mod=await import('../client/src/'+path+'.js');packs.push(Object.values(mod)[0]);}
const {items,recipes}=buildCatalog(DATA,packs);
const visible=buildPublicNameIndex(items);
const risky=items.filter(it=>publicName(it)!==it.name);
const unresolved=items.filter(it=>hasUnresolvedPublicIPSignal(it,visible.get(it.id)));
if(unresolved.length)throw Error('Public IP signals remain: '+unresolved.slice(0,20).map(it=>it.name+' => '+visible.get(it.id)).join(', '));
if(new Set(visible.values()).size!==items.length)throw Error('Duplicate public labels');
if(items.length!==5422||recipes.size!==13759)throw Error('Unexpected catalog size during IP audit');
for(const it of items)if(!visible.has(it.id))throw Error('Missing public label for '+it.id);
const v76=JSON.parse(readFileSync('shared/v76-approved.json','utf8'));
for(const item of v76.new_items){
 const svg=readFileSync(item.path,'utf8');
 if(/<image\b|<text\b|<foreignObject|<script\b|<use\b|href\s*=|url\s*\(\s*['\"]?https?:|data:image/i.test(svg))throw Error('V76 active SVG contains external, text, or reusable logo material: '+item.path);
}
console.log('IP display screen PASS:',items.length,'IDs,',recipes.size,'recipes;',risky.length,'fictionalized labels;',unresolved.length,'known pattern hits. Artwork and trademark clearance still require human review.');
