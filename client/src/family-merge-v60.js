/** V60 Family Only -> Classic transfer. Pure catalog/progress logic; no ads or UI. */
export function eligibleFamilyMerge(profiles,campaigns,classicUnlocked=[],catalog=null){
 const familyStarters=new Set(campaigns.flatMap(c=>c.starters));
 const owned=new Set(classicUnlocked);
 const catalogHas=id=>catalog?catalog.has(id):true;
 const ids=[];const added=new Set();const byFamily={};
 for(const c of campaigns){
  const allowed=new Set(c.items);
  const u=new Set(profiles?.[c.id]?.unlocked||[]);
  // Discovery order supports old files with no saved sequence and shared unlocks.
  const sequence=[...(profiles?.[c.id]?.order||[]),...u];
  for(const id of sequence){
   if(!u.has(id)||!allowed.has(id)||!catalogHas(id)||familyStarters.has(id)||owned.has(id))continue;
   if(!added.has(id)){added.add(id);ids.push(id);}
  }
  // byFamily counts distinct eligible family IDs; a shared item is in both counts,
  // but only once in ids and only once in the Classic import.
  byFamily[c.id]=new Set(sequence.filter(id=>u.has(id)&&allowed.has(id)&&!familyStarters.has(id)&&!owned.has(id)&&catalogHas(id))).size;
 }
 return {ids,byFamily};
}
export function verifyMergePending(value){
 return !!(value&&value.v===1&&[0,1,2].includes(value.completed)&&Array.isArray(value.ids)&&value.ids.length>0&&value.ids.length<100000&&value.ids.every(x=>typeof x==='string'&&x.length<160));
}
export function mergeIntoClassicState(old,ids,catalog,at){
 const state=old||{unlocked:[],known:[],recent:[],last:null,ledger:[],order:[],clues:{}};
 const owned=new Set(state.unlocked||[]),order=[...new Set(state.order||[])],recent=[...new Set(state.recent||[])];
 const ledger=new Map(state.ledger||[]);
 for(const id of ids){
  if(!catalog.has(id)||owned.has(id))continue;
  owned.add(id);
  if(!order.includes(id))order.push(id);
  if(!recent.includes(id))recent.push(id);
  if(!ledger.has(id))ledger.set(id,{at,source:'family-merge'});
 }
 return {...state,unlocked:[...owned],order,recent,ledger:[...ledger]};
}
