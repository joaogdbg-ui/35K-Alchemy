/**
 * V85 (owner request 30/10/2026): every family is a complete, independent Families Only campaign.
 * - Each family starts from its own 4 starters (never Classic's Water/Fire/Earth/Air).
 * - Every member of the family is craftable using only recipes whose two ingredients and result
 *   all belong to that family.
 * - Authored V85 recipes (FAMILY_DATA_V85.recipes) are global A+B=C pairs: they are added to the
 *   shared recipe map only when the pair is still free, so no existing recipe is ever overwritten.
 * V87: optional `polish` {adds:[[a,b,out]], remaps:[[a,b,old,new]]} is applied after the V85 recipes.
 * Pure function: no DOM, no imports (also inlined by tools/build-standalone.py).
 */
/** V89: combine family data packs (later packs add families; recipes are concatenated). */
export function mergeFamilyData(...packs){const out={recipes:[],families:{}};for(const p of packs){if(!p)continue;if(Array.isArray(p.recipes))out.recipes.push(...p.recipes);Object.assign(out.families,p.families||{});}return out;}
export function buildCompleteFamilyCampaigns(globalRecipes,items,families,familiesFor,data,legacyCampaigns=[],polish=null){
 if(!(globalRecipes instanceof Map)||!Array.isArray(items)||!data||!Array.isArray(data.recipes))throw Error('V85 campaigns: invalid input');
 const key=(a,b)=>[a,b].sort().join('|');
 const known=new Set(items.map(i=>i.id));
 const report={added:0,kept:0,conflicts:[],unknown:0,dropped:{}};
 for(const [a,b,out] of data.recipes){
  if(!known.has(a)||!known.has(b)||!known.has(out)){report.unknown++;continue;}
  const k=key(a,b),have=globalRecipes.get(k);
  if(have===undefined){globalRecipes.set(k,out);report.added++;}
  else if(have===out)report.kept++;
  else report.conflicts.push(k);
 }
 // V87 recipe polish (owner request 31/10/2026): logical new pairs on FREE pairs only, and
 // remaps of clearly forced recipes, applied only when the pair still gives the expected old
 // result. Every remap was validated so Classic and each family stay 100% reachable.
 report.polishAdded=0;report.polishRemapped=0;report.polishSkipped=0;
 if(polish){
  for(const [a,b,out] of polish.adds||[]){const k=key(a,b);if(known.has(a)&&known.has(b)&&known.has(out)&&!globalRecipes.has(k)){globalRecipes.set(k,out);report.polishAdded++;}else report.polishSkipped++;}
  for(const [a,b,old,out] of polish.remaps||[]){const k=key(a,b);if(known.has(out)&&globalRecipes.get(k)===old){globalRecipes.set(k,out);report.polishRemapped++;}else report.polishSkipped++;}
 }
 const legacy=new Map(legacyCampaigns.map(c=>[c.id,c]));
 const members=new Map(families.map(f=>[f.id,[]]));
 for(const it of items)for(const f of familiesFor(it))members.get(f)?.push(it.id);
 const result=[];
 for(const f of families){
  const starters=data.families?.[f.id]?.starters||legacy.get(f.id)?.starters;
  const ids=members.get(f.id)||[];
  if(!starters||starters.length!==4||!ids.length)continue;
  const set=new Set(ids);
  if(!starters.every(s=>set.has(s)))throw Error('V85 campaign starter outside family '+f.id);
  const recipes=[];
  for(const [k,out] of globalRecipes){if(!set.has(out))continue;const [a,b]=k.split('|');if(set.has(a)&&set.has(b))recipes.push([k,out]);}
  const reached=new Set(starters);let changed=true;
  while(changed){changed=false;for(const [k,out] of recipes){if(reached.has(out))continue;const [a,b]=k.split('|');if(reached.has(a)&&reached.has(b)){reached.add(out);changed=true;}}}
  const playable=ids.filter(id=>reached.has(id));
  if(playable.length!==ids.length)report.dropped[f.id]=ids.filter(id=>!reached.has(id));
  const playableSet=new Set(playable);
  result.push({id:f.id,name:f.name,starters:[...starters],items:playable,
   recipes:recipes.filter(([k,out])=>playableSet.has(out)&&k.split('|').every(x=>playableSet.has(x)))});
 }
 result.report=report;
 return result;
}
