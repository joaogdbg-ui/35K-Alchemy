#!/usr/bin/env node
/**
 * Audit every WIP element against the full historical catalog, showing ALL
 * collisions in one run instead of discovering them one CI failure at a time.
 */
import {readdirSync} from 'node:fs';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V80} from '../client/src/organic-pack-v80.js';
const paths=readdirSync('client/src').filter(x=>/^(?:gaming|organic)-pack-v\d+\.js$/.test(x)&&Number(x.match(/-v(\d+)\.js$/)[1])<80);
const packs=[PACK];
for(const name of paths){const mod=await import('../client/src/'+name);packs.push(Object.values(mod)[0]);}
const base=buildCatalog(DATA,packs);
const norm=s=>normalizeCatalogName(s),allNames=new Map(base.items.map(x=>[norm(x.name),x.id]));
const oldRecipes=base.recipes,newNames=new Set(),newIds=new Set(),newPairs=new Set(),problems=[];
for(const item of ORGANIC_V80.items){
 const n=norm(item.name);
 if(allNames.has(n))problems.push('EXISTING NAME '+item.id+' '+item.name+' collides '+allNames.get(n));
 if(newNames.has(n))problems.push('DUPLICATE NEW NAME '+item.id+' '+item.name);
 newNames.add(n);
 if(newIds.has(item.id))problems.push('DUPLICATE NEW ID '+item.id);
 newIds.add(item.id);
 const recipes=ORGANIC_V80.recipes.filter(r=>r[2]===item.id);
 if(!recipes.length)problems.push('MISSING RECIPE '+item.id);
 for(const r of recipes){
  const key=r.slice(0,2).sort().join('|');
  if(oldRecipes.has(key))problems.push('EXISTING PAIR '+item.id+' '+item.name+' ('+key+') already produces '+oldRecipes.get(key));
  if(newPairs.has(key))problems.push('DUPLICATE NEW PAIR '+item.id+' ('+key+')');
  newPairs.add(key);
 }
}
console.log('WIP catalog scanned: '+base.items.length+' prior elements; '+base.recipes.size+' prior recipe pairs; '+ORGANIC_V80.items.length+' V80 items.');
for(const p of problems)console.error(p);
console.log('Total collisions detected:',problems.length);
if(problems.length)process.exitCode=1;
