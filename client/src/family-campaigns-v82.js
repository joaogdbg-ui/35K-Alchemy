/**
 * Alchemy 10K: real, closed, independently playable thematic campaigns.
 * This maintenance change adds no IDs or recipes. Never invent family-only
 * recipe outputs: every pair is read from the global Classic catalog.
 * Future deity/dinosaur expansion must use the +200 authored content gate.
 */
export const THEMATIC_CAMPAIGN_BLUEPRINTS = Object.freeze([
  {
    id:'mythology',name:'Mythology & Gods',
    starters:['legacy:28','legacy:64','legacy:125','legacy:65'], // Human, History, Magic, Sky
    items:['legacy:28','legacy:64','legacy:125','legacy:65',
      'legacy:48','legacy:118','legacy:185','legacy:586','legacy:47',
      'pack:transformation','pack:god','pack:psychic','pack:shapeshifter',
      'pack:legend','pack:leader','organic41:ancient-city']
  },
  {
    id:'prehistoric',name:'Prehistory & Dinosaurs',
    starters:['legacy:26','legacy:14','legacy:21','legacy:64'], // Animal, Stone, Life, History
    items:['legacy:26','legacy:14','legacy:21','legacy:64',
      'legacy:41','legacy:575','legacy:580','organic41:monument','organic42:limestone']
  }
]);

export function buildThematicCampaigns(catalogRecipes, allItems) {
  const known = new Set(allItems.map(x=>x.id));
  const result=[];
  for(const plan of THEMATIC_CAMPAIGN_BLUEPRINTS) {
    const allowed = new Set(plan.items);
    if(allowed.size!==plan.items.length || new Set(plan.starters).size!==4 ||
      !plan.starters.every(x=>allowed.has(x)) || !plan.items.every(x=>known.has(x)))
      throw Error('Invalid thematic campaign membership: '+plan.id);
    const recipes=[];
    for(const [rawPair,output] of catalogRecipes) {
      if(!allowed.has(output))continue;
      const inputs=rawPair.split('|');
      if(inputs.length!==2 || !inputs.every(x=>allowed.has(x)))continue;
      recipes.push([inputs.sort().join('|'),output]);
    }
    const reached = new Set(plan.starters);
    let changed=true;
    while(changed){
      changed=false;
      for(const [pair,output] of recipes){
        const [a,b]=pair.split('|');
        if(reached.has(a)&&reached.has(b)&&!reached.has(output)){
          reached.add(output);changed=true;
        }
      }
    }
    const blocked=plan.items.filter(id=>!reached.has(id));
    if(blocked.length)throw Error('Family '+plan.id+' is not independently completable: '+blocked.join(', '));
    result.push({id:plan.id,name:plan.name,starters:[...plan.starters],
      items:[...plan.items],recipes});
  }
  return result;
}
