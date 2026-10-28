import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v52-campaigns.js';
import {ORGANIC_V55} from '../client/src/organic-pack-v55.js';
import {ORGANIC_V56} from '../client/src/organic-pack-v56.js';
const mods=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of mods){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const {ORGANIC_V57}=await import('../client/src/organic-pack-v57.js');
const {ORGANIC_V58}=await import('../client/src/organic-pack-v58.js');
const obj=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57,ORGANIC_V58]);
console.log(JSON.stringify({items:obj.items,recipes:Object.fromEntries(obj.recipes),families:FAMILY_CAMPAIGNS.families}));
