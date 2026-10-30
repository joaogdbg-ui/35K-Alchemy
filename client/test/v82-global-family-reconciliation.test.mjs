import test from 'node:test';
import assert from 'node:assert/strict';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {buildCatalog} from '../src/catalog-integrity.js';
import {ORGANIC_V80} from '../src/organic-pack-v80.js';
import {ORGANIC_V81} from '../src/organic-pack-v81.js';
import {ORGANIC_V82} from '../src/organic-pack-v82.js';
import {FAMILY_CAMPAIGNS} from '../src/family-mode-v53-campaigns.js';
import {reconcileLegacyFamilies,HISTORICAL_FAMILY_REPAIRS_V82} from '../src/family-compatibility-v82.js';
import {buildThematicCampaigns} from '../src/family-campaigns-v82.js';
const versions=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79'];
const packs=[PACK];
for(const v of versions){
 const module=await import('../src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');
 packs.push(Object.values(module)[0]);
}
packs.push(ORGANIC_V80,ORGANIC_V81,ORGANIC_V82);
const catalog=buildCatalog(DATA,packs);
const source=new Map(catalog.recipes);
const result=reconcileLegacyFamilies(new Map(source),FAMILY_CAMPAIGNS.families);
const campaigns=[...result.families,...buildThematicCampaigns(result.recipes,catalog.items)];
test('V82 retains 200 real elements and reconciles the old family-only global formulas',()=>{
 assert.equal(catalog.items.length,6012);
 assert.equal(catalog.recipes.size,14349);
 assert.equal(result.recipes.size,14554);
 assert.equal(result.addedGlobalRecipes.length,205);
 assert.equal(result.oldConflicts.length,8);
 assert.equal(HISTORICAL_FAMILY_REPAIRS_V82.length,6);
 for(const [pair,id]of source)assert.equal(result.recipes.get(pair),id,'old Classic pair must not change: '+pair);
 for(const [a,b,id]of result.addedGlobalRecipes){
  const pair=[a,b].sort().join('|');
  assert.equal(result.recipes.get(pair),id);
  assert.ok(!source.has(pair),'only missing pairs may be added');
 }
});
test('All four Family Only campaigns use only globally identical recipes and close from four own starters',()=>{
 const expected=new Map([['nature',476],['people',211],['mythology',109],['prehistoric',116]]);
 assert.equal(campaigns.length,4);
 for(const family of campaigns){
  assert.equal(family.starters.length,4);
  assert.equal(new Set(family.starters).size,4);
  assert.equal(family.items.length,expected.get(family.id));
  const allowed=new Set(family.items),known=new Set(family.starters);
  assert.ok(family.starters.every(id=>allowed.has(id)));
  let progressed=true;
  while(progressed){
   progressed=false;
   for(const [pair,id]of family.recipes){
    const [a,b]=pair.split('|');
    assert.equal(result.recipes.get(pair),id,'family output differs from global: '+pair);
    assert.ok(allowed.has(a)&&allowed.has(b)&&allowed.has(id),'recipe escaped family scope');
    if(known.has(a)&&known.has(b)&&!known.has(id)){known.add(id);progressed=true;}
   }
  }
  assert.equal(known.size,allowed.size, family.name+' cannot be independently completed');
 }
});
test('A historical conflicting family pair never silently changes Classic',()=>{
 for(const {pair,oldFamilyOutput,globalOutput}of result.oldConflicts){
  assert.notEqual(oldFamilyOutput,globalOutput);
  assert.equal(source.get(pair),globalOutput);
  assert.equal(result.recipes.get(pair),globalOutput);
 }
});
