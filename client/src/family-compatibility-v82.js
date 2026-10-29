/**
 * V82: reconcile V53's historical Family Only recipes into one global A+B=C map.
 * Old V53 campaigns were independently completable but not globally deterministic:
 * 199 family-only recipes were missing from Classic, and 8 pairs later acquired
 * different Classic results. Never overwrite an existing Classic pair.
 *
 * This module adds missing family formulas globally, discards 8 conflicting
 * family-specific formulas, and replaces 6 essential paths with distinct,
 * editorially chosen new globally valid recipes. Existing family discoveries
 * are all still reachable from their original four starters.
 */
export const HISTORICAL_FAMILY_REPAIRS_V82 = Object.freeze([
 {family:'nature', old:'legacy:10|organic38:pond',output:'organic42:lagoon',
  ingredients:['legacy:10','organic34:coral-reef'],rationale:'Sea and a coral reef enclose a lagoon'},
 {family:'nature',old:'legacy:16|legacy:34',output:'legacy:218',
  ingredients:['legacy:34','organic32:microscope'],rationale:'Crystalline patterns examined under a microscope reveal geometry'},
 {family:'nature',old:'legacy:63|organic41:fog',output:'organic46:lighthouse-beam',
  ingredients:['legacy:63','organic47:coastal-fog'],rationale:'A light shone through coastal fog becomes a lighthouse beam'},
 {family:'people',old:'legacy:207|legacy:46',output:'organic37:harvest',
  ingredients:['legacy:46','organic53:village-market-day'],rationale:'A village market day celebrates the harvest'},
 {family:'people',old:'legacy:46|organic37:harvest',output:'organic38:milk',
  ingredients:['legacy:46','organic52:village-feast'],rationale:'A village feast serves local dairy produce'},
 {family:'people',old:'organic40:workshop|organic41:harbor',output:'organic41:shipyard',
  ingredients:['organic41:harbor','organic53:art-workshop'],rationale:'A craft workshop at the harbor builds and repairs boats'}
]);
const unreplaced = Object.freeze([
 ['nature','legacy:14|pack:moon','organic46:lunar-crater'],
 ['nature','legacy:65|organic40:moonlight','organic47:moonrise']
]);
const pairKey=(a,b)=>[a,b].sort().join('|');
export function reconcileLegacyFamilies(globalRecipes, historicalFamilies) {
 if(!(globalRecipes instanceof Map)||!Array.isArray(historicalFamilies))throw Error('V82 family reconciliation expects global recipe Map and legacy family source');
 const original=new Map(globalRecipes), additions=[], oldConflicts=[],families=[];
 const expectedConflicts=new Set([...HISTORICAL_FAMILY_REPAIRS_V82.map(x=>x.family+'|'+x.old),
  ...unreplaced.map(([family,pair])=>family+'|'+pair)]);
 const observedConflicts=new Set();
 for(const family of historicalFamilies) {
  const validIds=new Set(family.items),accepted=new Map();
  for(const [pair,out] of family.recipes) {
   const [a,b]=pair.split('|');
   if(!a||!b||!validIds.has(a)||!validIds.has(b)||!validIds.has(out))
    throw Error('V82 family campaign has an invalid member recipe: '+family.id+' '+pair+' => '+out);
   const canonical=globalRecipes.get(pair);
   if(canonical===undefined) {
    globalRecipes.set(pair,out);
    additions.push([a,b,out]);
    accepted.set(pair,out);
   } else if(canonical===out)accepted.set(pair,out);
   else {
    const key=family.id+'|'+pair;
    if(!expectedConflicts.has(key))throw Error('Unreviewed historical Family Only recipe conflict '+key+' => '+out+' vs '+canonical);
    observedConflicts.add(key);
    oldConflicts.push({family:family.id,pair,oldFamilyOutput:out,globalOutput:canonical});
    // Never invent another result for an already assigned global pair.
    if(validIds.has(canonical))accepted.set(pair,canonical);
   }
  }
  for(const repair of HISTORICAL_FAMILY_REPAIRS_V82.filter(x=>x.family===family.id)){
   if(!validIds.has(repair.output)||repair.ingredients.some(id=>!validIds.has(id)))
    throw Error('Invalid editorial family repair '+repair.output);
   const pair=pairKey(...repair.ingredients);
   if(globalRecipes.has(pair)||accepted.has(pair))
    throw Error('Family repair would overwrite a globally registered pair '+pair+' for '+repair.output);
   globalRecipes.set(pair,repair.output);
   additions.push([...repair.ingredients,repair.output]);
   accepted.set(pair,repair.output);
  }
  const reached=new Set(family.starters);
  for(let i=0;i<=family.items.length;i++) {
   let prior=reached.size;
   for(const [pair,out]of accepted) {
    const [a,b]=pair.split('|');
    if(reached.has(a)&&reached.has(b))reached.add(out);
   }
   if(reached.size===prior)break;
  }
  if(reached.size!==family.items.length)
   throw Error('Reconciled historical family not independently completable: '+family.id+' '+family.items.filter(id=>!reached.has(id)).slice(0,10).join(', '));
  families.push({...family,recipes:[...accepted]});
 }
 if(observedConflicts.size!==expectedConflicts.size||[...expectedConflicts].some(id=>!observedConflicts.has(id)))
  throw Error('Unexpected historical Family Only conflict count; review against canonical Classic recipes');
 for(const [key,value]of original)if(globalRecipes.get(key)!==value)
  throw Error('Historical Classic formula was changed '+key);
 if(additions.length!==205||oldConflicts.length!==8)
  throw Error('Unexpected historical family reconciliation size: '+additions.length+' additions and '+oldConflicts.length+' conflicts');
 return {families,recipes:globalRecipes,addedGlobalRecipes:additions,oldConflicts};
}
