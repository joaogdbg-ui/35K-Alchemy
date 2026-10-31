import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
const app=src('client/src/app.js');
async function liveCatalog(){
 const mods={};
 for(const line of app.split('\n')){const m=line.match(/^import \{ (DATA|buildCatalog|PACK|GAMING_V\d+|ORGANIC_V\d+) \} from '\.\/(.+)';$/);if(m)mods[m[1]]=(await import(resolve(root,'client/src',m[2])))[m[1]];}
 const list=app.match(/buildCatalog\(DATA,\[([^\]]+)\]\)/)[1].split(',');
 const {items,recipes}=mods.buildCatalog(mods.DATA,list.map(n=>mods[n]));
 const {FAMILIES,familiesFor,registerFamilyMembership}=await import('../src/discoveries.js');
 const {FAMILY_CAMPAIGNS}=await import('../src/family-mode-v53-campaigns.js');
 const {buildThematicCampaigns}=await import('../src/family-campaigns-v82.js');
 const {reconcileLegacyFamilies}=await import('../src/family-compatibility-v82.js');
 const {buildCompleteFamilyCampaigns}=await import('../src/family-campaigns-v85.js');
 const {FAMILY_DATA_V85}=await import('../src/family-data-v85.js');
 const rec=reconcileLegacyFamilies(recipes,FAMILY_CAMPAIGNS.families);
 registerFamilyMembership(FAMILY_DATA_V85.families);
 const camps=buildCompleteFamilyCampaigns(recipes,items,FAMILIES,familiesFor,FAMILY_DATA_V85,[...rec.families,...buildThematicCampaigns(recipes,items)]);
 return {items,recipes,camps,FAMILIES,familiesFor};
}
const live=liveCatalog();

test('V85: every one of the 12 families is a complete, independent campaign',async()=>{
 const {items,camps,FAMILIES,familiesFor}=await live;
 assert.equal(items.length,6412);
 assert.equal(camps.length,FAMILIES.length);
 assert.deepEqual(camps.report.conflicts,[]);
 assert.deepEqual(camps.report.dropped,{});
 const classic=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(const c of camps){
  const members=items.filter(i=>familiesFor(i).includes(c.id)).map(i=>i.id);
  assert.equal(c.items.length,members.length,c.id+' must contain every family member');
  assert.equal(new Set(c.starters).size,4,c.id);
  assert.ok(c.starters.every(s=>!classic.has(s)),c.id+' must not start with Water/Fire/Earth/Air');
  const set=new Set(c.items),reached=new Set(c.starters);let ch=true;
  while(ch){ch=false;for(const [k,o] of c.recipes){const [a,b]=k.split('|');assert.ok(set.has(a)&&set.has(b)&&set.has(o),'recipe escapes '+c.id);if(!reached.has(o)&&reached.has(a)&&reached.has(b)){reached.add(o);ch=true;}}}
  assert.equal(reached.size,set.size,c.id+' fully craftable from its own starters');
 }
});
test('V85: Countries & Landmarks adds exactly 200 world elements with trivia',async()=>{
 const {ORGANIC_V85}=await import('../src/organic-pack-v85.js');
 assert.equal(ORGANIC_V85.items.length,200);
 assert.ok(ORGANIC_V85.items.every(i=>i.id.startsWith('organic85:')&&i.category==='geography'&&i.familyCampaigns[0]==='world'&&i.summary.length>=40&&i.trivia));
 const {FAMILIES}=await import('../src/discoveries.js');
 assert.ok(FAMILIES.some(f=>f.id==='world'&&f.categories.includes('geography')));
 assert.match(app,/GAMING_V30,ORGANIC_V85,ORGANIC_V32/);
});
test('V85: shiny chance is 1% (5% without ads), saved, shown in list, slot and popup',()=>{
 assert.match(app,/function shinyChance\(\)\{return adFree\(\)\?0\.05:0\.01;\}/);
 assert.match(app,/const gotShiny=kind!=='batch'&&rollShiny\(resultId\)/);
 assert.match(app,/shiny\.has\(id\)\?' is-shiny':''/);
 assert.match(app,/BACKUP_KEYS=\[COMPANION_STORAGE_KEY,SHINY_KEY,/);
 assert.match(src('client/src/styles.css'),/@keyframes shiny-twinkle/);
 assert.match(src('client/index.html'),/data-show-chip="shiny"/);
});
test('V85: Remove ads keeps optional hint ads and a 10-hint bank refilled every 15 minutes',()=>{
 assert.match(app,/HINT_BANK_MAX=10,HINT_BANK_REFILL_MS=15\*60\*1000/);
 assert.match(app,/if\(adFree\(\)\)\{\n  if\(takeBankHint\(\)\)return grantRecipeHint\(elementId\);\n  if\(!\(await offerEmptyBank\(\)\)\)return false;/);
 assert.match(app,/function modeSwitchFree\(\)\{return adFree\(\)\|\|modeGraceLeft\(\)>0;\}/);
 assert.match(app,/if\(adFree\(\)&&selected\)\{beginBatch\(selected,'premium'\);return;\}/);
 assert.match(src('native/android/AlchemyBillingPlugin.java'),/PRODUCT_ID = "no_ads"/);
 assert.match(src('tools/configure-android-admob.py'),/com\.android\.billingclient:billing/);
});
test('V85: mode-switch ad grants a 5-minute free switch back; Merge works both ways and is visible in Play',()=>{
 assert.match(app,/MODE_GRACE_MS=5\*60\*1000/);
 assert.match(app,/localStorage\.setItem\(MODE_GRACE_KEY,String\(Date\.now\(\)\+MODE_GRACE_MS\)\)/);
 assert.match(app,/function commitMergeToFamilies\(\)/);
 assert.match(app,/showRewarded\(\{kind:'merge_to_families'/);
 const html=src('client/index.html');
 assert.match(html,/id="familyBanner"/);assert.match(html,/id="playMergeBtn"/);
});
