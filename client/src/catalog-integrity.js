/** V39 canonical catalog contract: used by the app, CI tests and standalone build gate. */
export function normalizeCatalogName(value) {
  return String(value).normalize('NFKD').toLocaleLowerCase('en-US')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[‘’]/g,"'").replace(/[‐‑‒–—]/g,'-')
    .replace(/\s+/g,' ').trim().replace(/\s*\+\s*/g,'+');
}

export function buildCatalog(data, packs, {checkReachability=true}={}) {
  if(!data || !Array.isArray(data.items) || !Array.isArray(data.recipes) || !Array.isArray(packs)) throw new Error('CATALOG: invalid source format');
  const items=[];
  const ids=new Set(), names=new Map();
  const add=(item,source)=>{
    if(!item || typeof item.id!=='string' || !item.id.trim() || typeof item.name!=='string' || !item.name.trim())
      throw new Error(`CATALOG: missing ID or name in ${source}`);
    if(ids.has(item.id)) throw new Error(`CATALOG: duplicate ID ${item.id} (${source})`);
    const norm=normalizeCatalogName(item.name);
    if(!norm)throw new Error(`CATALOG: blank normalized name ${item.id}`);
    if(names.has(norm)) throw new Error(`CATALOG: duplicate name '${item.name}' — ${names.get(norm)} vs ${item.id} (${source})`);
    ids.add(item.id);names.set(norm,item.id);items.push(item);
  };
  data.items.forEach(([name,category,year,note],i)=>add({id:`legacy:${i}`,legacy:i,name,category,year,note,iconStatus:'legacy'},'legacy-data'));
  for(const [index,pack] of packs.entries()){
    if(!pack || !Array.isArray(pack.items) || !Array.isArray(pack.recipes)) throw new Error(`CATALOG: invalid pack ${index}`);
    for(const item of pack.items)add({...item,iconStatus:'curated'},`pack ${index}`);
  }
  const recipes=new Map(), results=new Set();
  const key=(a,b)=>[a,b].sort().join('|');
  const accept=(a,b,out,source)=>{
    if(!ids.has(a)||!ids.has(b)||!ids.has(out))throw new Error(`CATALOG: unknown recipe ID (${a}, ${b} -> ${out}) in ${source}`);
    const k=key(a,b);
    if(recipes.has(k)) throw new Error(`CATALOG: duplicate unordered recipe '${k}' => '${recipes.get(k)}' / '${out}' in ${source}`);
    recipes.set(k,out);results.add(out);
  };
  for(const [a,b,c] of data.recipes)accept(`legacy:${a}`,`legacy:${b}`,`legacy:${c}`,'legacy-data');
  packs.forEach((pack,index)=>{for(const [a,b,c] of pack.recipes)accept(a,b,c,`pack ${index}`);});
  if(checkReachability){
    const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
    for(const starter of reached)if(!ids.has(starter))throw new Error(`CATALOG: missing starter ${starter}`);
    for(let iteration=0;iteration<=items.length;iteration++){
      const prior=reached.size;
      for(const [pair,out] of recipes){const [a,b]=pair.split('|');if(reached.has(a)&&reached.has(b))reached.add(out);}
      if(reached.size===prior)break;
    }
    if(reached.size!==items.length){
      const missing=items.filter(i=>!reached.has(i.id));
      throw new Error(`CATALOG: ${missing.length} unreachable elements: ${missing.slice(0,12).map(i=>i.id+' ('+i.name+')').join(', ')}`);
    }
  }
  return {items,recipes};
}
