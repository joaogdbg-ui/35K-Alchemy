import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog } from '../client/src/catalog-integrity.js';
import { familyFor } from '../client/src/discoveries.js';
const packs=[PACK];for(const n of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47']){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const {items,recipes}=buildCatalog(DATA,packs);const map=new Map(items.map(x=>[x.id,x]));
for(const f of ['music','arcades','cinema','people','fantasy','consoles','anime','games']){
 const group=items.filter(x=>familyFor(x)===f),ids=new Set(group.map(x=>x.id));const internal=[...recipes].filter(([p,o])=>ids.has(o)&&p.split('|').every(id=>ids.has(id)));
 console.log('\n===',f,group.length,'existing internal recipes',internal.length);if(group.length<200){console.log(group.map(x=>x.name+' ['+x.id+']').join(' • ')); console.log('INTERNAL',internal.map(([p,o])=>p.split('|').map(i=>map.get(i).name).join(' + ')+' = '+map.get(o).name).slice(0,100).join(' ; '));}
}
