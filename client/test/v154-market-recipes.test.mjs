import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
test('V154: every Market item is an element that Alchemy can craft (reachable from the starters)', async () => {
  const app=readFileSync(resolve(root,'client/src/app.js'),'utf8');const mods={};
  for(const line of app.split('\n')){const m=line.match(/^import \{ (DATA|buildCatalog|PACK|GAMING_V\d+|ORGANIC_V\d+) \} from '\.\/(.+)';$/);if(m)mods[m[1]]=(await import(resolve(root,'client/src',m[2])))[m[1]];}
  const list=app.match(/buildCatalog\(DATA,\[([^\]]+)\]\)/)[1].split(',');
  const {items,recipes}=mods.buildCatalog(mods.DATA,list.map(n=>mods[n.replace('...','')]).flat());
  const {MARKET}=await import('../src/market-v136.js');
  const pairs=[...(recipes instanceof Map?recipes.entries():Object.entries(recipes))];
  const have=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let grew=true;
  while(grew){grew=false;for(const [k,v] of pairs){if(have.has(v))continue;const [a,b]=k.split('|');if(have.has(a)&&have.has(b)){have.add(v);grew=true;}}}
  const ids=new Set((Array.isArray(items)?items:[...items.values()]).map(i=>i.id));
  for(const it of MARKET){assert.ok(it.element,`${it.id} has an element`);assert.ok(ids.has(it.element),`${it.element} is in the catalog`);assert.ok(have.has(it.element),`${it.element} (${it.id}) can be crafted in Alchemy`);}
});
