// Redrawn-icon gate (2026 art direction): every override targets a real element, is a safe,
// self-contained original SVG, matches its source file, and is never reused for two elements.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
import {ART_REDRAW} from '../client/src/art-redraw.js';
import {ORGANIC_ART_V83} from '../client/src/organic-art-v83.js';

const insist=(v,m)=>{if(!v)throw Error('ART-REDRAW: '+m);};
const manifest=JSON.parse(readFileSync('tools/art-redraw-manifest.json','utf8'));
const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79','organic-v80','organic-v81','organic-v82','organic-v83'];
const packs=[PACK];
for(const v of vs){const m=await import('../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');packs.push(Object.values(m)[0]);}
const {items}=buildCatalog(DATA,packs);
const byId=new Map(items.map(i=>[i.id,i]));
insist(Object.keys(ART_REDRAW).length===manifest.length,'runtime map and manifest differ in size');
const hashes=new Map();
for(const svg of Object.values(ORGANIC_ART_V83))hashes.set(createHash('sha256').update(svg).digest('hex'),'V83');
for(const e of manifest){
 const it=byId.get(e.id);
 insist(it,'unknown element '+e.id);
 insist(it.name===e.name,'name mismatch '+e.id);
 insist(!e.id.startsWith('organic83:'),'V83 art is already in the new direction '+e.id);
 const raw=readFileSync('client/assets/redraw/'+e.file,'utf8').trim();
 insist(ART_REDRAW[e.id]===raw,'runtime SVG differs from source '+e.file);
 insist(raw.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">')&&raw.endsWith('</svg>'),'bad skeleton '+e.file);
 insist(raw.length>=410&&(raw.match(/<(?:path|rect|circle|line|ellipse|polygon|polyline)\b/g)||[]).length>=5,'too little drawing '+e.file);
 insist(!/<(?:script|image|use|text|style|foreignObject|iframe|animate)\b|\s(?:href|xlink:href|on\w+)\s*=|https?:/i.test(raw.replace('xmlns="http://www.w3.org/2000/svg"','')),'unsafe SVG '+e.file);
 const h=createHash('sha256').update(raw).digest('hex');
 insist(!hashes.has(h),'same drawing reused: '+e.name+' = '+hashes.get(h));hashes.set(h,e.name);
}
console.log(`ART-REDRAW PASS: ${manifest.length} redrawn icons, all real elements, safe, unique and matching their sources.`);
