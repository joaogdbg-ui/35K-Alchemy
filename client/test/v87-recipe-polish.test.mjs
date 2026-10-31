import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const app=readFileSync(resolve(root,'client/src/app.js'),'utf8');
async function liveCatalog(){
 const mods={};
 for(const line of app.split('\n')){const m=line.match(/^import \{ (DATA|buildCatalog|PACK|GAMING_V\d+|ORGANIC_V\d+) \} from '\.\/(.+)';$/);if(m)mods[m[1]]=(await import(resolve(root,'client/src',m[2])))[m[1]];}
 const list=app.match(/buildCatalog\(DATA,\[([^\]]+)\]\)/)[1].split(',');
 const {items,recipes}=mods.buildCatalog(mods.DATA,list.map(n=>mods[n]));
 const {FAMILIES,familiesFor,registerFamilyMembership}=await import('../src/discoveries.js');
 const {FAMILY_CAMPAIGNS}=await import('../src/family-mode-v53-campaigns.js');
 const {buildThematicCampaigns}=await import('../src/family-campaigns-v82.js');
 const {reconcileLegacyFamilies}=await import('../src/family-compatibility-v82.js');
 const {buildCompleteFamilyCampaigns,mergeFamilyData}=await import('../src/family-campaigns-v85.js');
 const {FAMILY_DATA_V89}=await import('../src/family-data-v89.js');
 const {FAMILY_DATA_V85}=await import('../src/family-data-v85.js');
 const {RECIPE_POLISH_V87}=await import('../src/recipe-polish-v87.js');
 const rec=reconcileLegacyFamilies(recipes,FAMILY_CAMPAIGNS.families);
 const FAMILY_DATA=mergeFamilyData(FAMILY_DATA_V85,FAMILY_DATA_V89);
 registerFamilyMembership(FAMILY_DATA.families);
 const camps=buildCompleteFamilyCampaigns(recipes,items,FAMILIES,familiesFor,FAMILY_DATA,[...rec.families,...buildThematicCampaigns(recipes,items)],RECIPE_POLISH_V87);
 return {items,recipes,camps,FAMILIES,familiesFor,polish:RECIPE_POLISH_V87};
}
const live=liveCatalog();
const key=(a,b)=>[a,b].sort().join('|');

test('V87: app passes the recipe polish to the family builder and the standalone inlines it',()=>{
 assert.match(app,/import \{ RECIPE_POLISH_V87 \} from '\.\/recipe-polish-v87\.js';/);
 assert.match(app,/buildThematicCampaigns\(classicRecipes,ITEMS\)\],\{adds:\[\.\.\.RECIPE_POLISH_V87\.adds,\.\.\.RECIPE_POLISH_V91\.adds\]/);
 assert.match(readFileSync(resolve(root,'tools/build-standalone.py'),'utf8'),/recipe-polish-v87\.js/);
});

test('V87: every polish entry applies cleanly, no element added, nothing skipped',async()=>{
 const {items,camps,polish}=await live;
 assert.equal(items.length,6612,'recipe polish never adds elements');
 assert.ok(polish.adds.length>=300&&polish.remaps.length>=100);
 assert.equal(camps.report.polishSkipped,0);
 assert.equal(camps.report.polishAdded,polish.adds.length);
 assert.equal(camps.report.polishRemapped,polish.remaps.length);
 assert.deepEqual(camps.report.conflicts,[]);
 assert.deepEqual(camps.report.dropped,{});
 const seen=new Set();
 for(const [a,b,o] of polish.adds){const k=key(a,b);assert.ok(!seen.has(k),'duplicate pair '+k);seen.add(k);assert.ok(o!==a&&o!==b,'add echoes an input '+k);}
 for(const [a,b,old,o] of polish.remaps){const k=key(a,b);assert.ok(!seen.has(k),'duplicate pair '+k);seen.add(k);assert.notEqual(old,o);assert.ok(o!==a&&o!==b,'remap echoes an input '+k);}
});

test('V87: Classic stays 100% reachable and every remapped old result keeps a route',async()=>{
 const {items,recipes,polish}=await live;
 const byIng=new Map();for(const [k,o] of recipes){const [a,b]=k.split('|');for(const x of new Set([a,b])){if(!byIng.has(x))byIng.set(x,[]);byIng.get(x).push([a,b,o]);}}
 const got=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']),q=[...got];
 while(q.length){const x=q.pop();for(const [a,b,o] of byIng.get(x)||[])if(!got.has(o)&&got.has(a)&&got.has(b)){got.add(o);q.push(o);}}
 assert.equal(got.size,items.length);
 const results=new Set(recipes.values());
 for(const [,,old] of polish.remaps)assert.ok(results.has(old),'old result lost every route: '+old);
});

test('V87: the owner examples are logical now',async()=>{
 const {items,recipes}=await live;
 const id=n=>items.find(i=>i.name===n||i.name.toLowerCase()===n.toLowerCase())?.id;
 const get=(a,b)=>recipes.get(key(id(a),id(b)));
 assert.equal(get('Ink','Paper'),id('Book'));
 assert.equal(get('God','Sea'),id('Poseidon'));
 assert.notEqual(get('Book','Ink'),id('Fountain Pen'));
});
