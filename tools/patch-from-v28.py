from pathlib import Path
src=Path('/mnt/data/35K_Alchemy_V28_Offline.html').read_text('utf-8')

# Make the in-game family chooser look and behave like Discoveries.
css='''
/* V29: game-native family picker. No Android-native dark select list. */
.modal:has(.batch-family-grid) .modal-card{width:min(460px,100%);max-height:88dvh;padding:25px 15px 15px;overflow-y:auto;overscroll-behavior:contain}
.batch-intro{font-size:12px!important;margin:8px 3px 13px;color:#81796f!important}
.batch-locked{display:inline-flex;align-items:center;gap:5px;color:#624a3c;font-weight:800}
.batch-family-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:min(41dvh,356px);overflow-y:auto;scrollbar-width:thin;overscroll-behavior:contain;padding:2px 2px 5px;margin:8px 0}
.batch-family-choice{display:flex;align-items:center;gap:8px;min-height:66px;text-align:left;border:1px solid #e4ddd4;border-radius:16px;background:#fffdfb;padding:7px;min-width:0;cursor:pointer;transition:border-color .12s,background .12s}
.batch-family-choice[aria-pressed="true"]{border:2px solid #bd986b;background:#fbf2e7;padding:6px;box-shadow:0 0 0 2px #f0e0cf}
.batch-family-choice:disabled{opacity:.43;cursor:default}
.batch-family-picture{flex:0 0 43px;width:43px;height:43px;display:grid;place-items:center;background:#f7f2ec;border-radius:11px}
.batch-family-picture img{width:41px;height:41px;object-fit:contain}
.batch-family-data{display:flex;flex-direction:column;gap:4px;min-width:0;flex:1}
.batch-family-data strong{color:#38302b;font-size:11px;line-height:1.12;overflow-wrap:anywhere}
.batch-family-data small{color:#9a8c7e;font-size:10px;line-height:1.2;white-space:nowrap}
.batch-selection{margin:6px 0;padding:8px 10px;border-radius:12px;background:#f9f6f2;display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:11px;color:#776b5d;text-align:left}
.batch-selection strong{color:#514339;font-size:12px}
.batch-quiet-note{margin:9px 3px 0!important;font-size:10px!important}
.batch-running-art{width:64px;height:64px;margin:5px auto 9px;display:grid;place-items:center;background:#fbf5ee;border-radius:15px}
.batch-running-art img{width:59px;height:59px;object-fit:contain}
.batch-running-progress{height:9px;background:#eee8e2;border-radius:50px;overflow:hidden;margin:18px 1px 8px}
.batch-running-fill{height:100%;width:0%;background:#c59a72;border-radius:50px;transition:width .09s linear}
.batch-running-count{font-size:12px;color:#756a5e;font-variant-numeric:tabular-nums}
.batch-running-totals{font-size:11px;color:#9d8d7c;margin-top:8px}
.batch-fast-tag{display:inline-block;background:#f4eee8;padding:5px 9px;border-radius:99px;color:#8a7566;font-size:10px;font-weight:750}
.batch-list-spacer{position:relative;min-height:1px;width:100%}
.batch-list-window{position:absolute;left:0;right:0;display:flex;flex-direction:column;gap:0}
.batch-discovery-list.is-virtual{display:block;padding:0 5px}
.batch-discovery-list.is-virtual .batch-discovery-row{height:70px;box-sizing:border-box}
@media(max-width:390px){.modal:has(.batch-family-grid) .modal-card{padding:23px 10px 11px}.batch-family-grid{gap:6px}.batch-family-choice{gap:5px;padding:6px;min-height:62px}.batch-family-choice[aria-pressed="true"]{padding:5px}.batch-family-picture{flex-basis:38px;width:38px;height:38px}.batch-family-picture img{width:37px;height:37px}.batch-family-data strong{font-size:10px}}
@media(prefers-reduced-motion:reduce){.batch-running-fill,.batch-family-choice{transition:none}}
'''
assert '</style>' in src
src=src.replace('</style>',css+'\n</style>',1)
src=src.replace('35K Alchemy — V28 Offline','35K Alchemy — V29 Offline')
# update modal close/cancel for progress X
old="function closeModal(){\n const st=batchState;\n if(st?.phase==='review'){"
new="function closeModal(){\n const st=batchState;\n if(st?.phase==='scanning'){batchState=null;slots[1]=null;updateSlotUI();announceCraft('idle','Family scan cancelled · No new results published');$('modal').hidden=true;$('modal').dataset.dismiss='any';return;}\n if(st?.phase==='review'){"
assert old in src
src=src.replace(old,new,1)

beg=src.index('function familyBatchCandidates(family){')
end=src.index('function showBatchDiscovery(){',beg)
replacement='''// Build one snapshot of the discovered ingredients, grouped by family.
// No repeated full-catalog sort when a family is selected.
function batchFamilySnapshot(){
 const groups=new Map(FAMILIES.map(f=>[f.id,[]]));
 for(const id of unlocked){const item=byId.get(id);if(item)groups.get(familyFor(item))?.push(id);}
 return groups;
}
let pendingBatchFamilies=null;
function familyBatchCandidates(family){return (pendingBatchFamilies?.get(family)||batchFamilySnapshot().get(family)||[]).slice().sort((a,b)=>byId.get(a).name.localeCompare(byId.get(b).name));}
function batchChooser(){
 if(!leftLocked||!slots[0]){toast('Lock an element on the left first','error');return;}
 pendingBatchFamilies=batchFamilySnapshot();
 const nonEmpty=FAMILIES.find(f=>pendingBatchFamilies.get(f.id).length>0);
 let selected=nonEmpty?.id||null;
 const familyCards=FAMILIES.map(f=>{
  const count=pendingBatchFamilies.get(f.id).length;
  const icon=GAMEVERSE_ART[f.icon]?`<img src="${GAMEVERSE_ART[f.icon]}" loading="lazy" decoding="async" alt="">`:fallbackIcon();
  return `<button type="button" class="batch-family-choice" data-batch-family="${f.id}" aria-pressed="${f.id===selected}" ${count?'':'disabled'}><span class="batch-family-picture">${icon}</span><span class="batch-family-data"><strong>${escapeText(f.name)}</strong><small>${count.toLocaleString('en-US')} found</small></span></button>`;
 }).join('');
 showModal(`<div class="modal-tag">FAMILY COMBINER</div><h2>Choose a family</h2><p class="batch-intro"><span class="batch-locked">♧ ${escapeText(byId.get(slots[0]).name)}</span> stays locked. Scan all collected elements, then review new discoveries.</p><div class="batch-family-grid" role="group" aria-label="Family to combine">${familyCards}</div><div class="batch-selection"><strong id="batchSelectedName"></strong><span id="batchEstimate"></span></div><div class="batch-actions"><button class="modal-button" id="batchDemo" ${batchTrialUsed||!selected?'disabled':''}>${batchTrialUsed?'Free trial used':'Free trial'}</button><button class="modal-button secondary" id="batchRewarded" ${rewardedAvailable()&&selected?'':'disabled'}>Watch Ad</button></div><p class="mini-muted batch-quiet-note">Offline fast scan · No per-element animations. Rewarded ads need a configured Android build.</p>`);
 const redraw=()=>{
  document.querySelectorAll('[data-batch-family]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.batchFamily===selected)));
  $('batchSelectedName').textContent=FAMILIES.find(f=>f.id===selected)?.name||'No available elements';
  $('batchEstimate').textContent=`${(pendingBatchFamilies.get(selected)||[]).length.toLocaleString('en-US')} checks`;
 };
 $('modalContent').querySelectorAll('[data-batch-family]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.batchFamily;redraw();}));
 redraw();
 $('batchDemo').onclick=()=>{if(batchTrialUsed||!selected)return;if(beginBatch(selected,'trial')){batchTrialUsed=true;saveExtras();}};
 $('batchRewarded').onclick=async()=>{
  if(!rewardedAvailable()||!selected)return;
  const family=selected,locked=slots[0];
  $('batchRewarded').disabled=true;$('batchDemo').disabled=true;
  let result;try{result=await getRewardBridge().showRewarded({kind:'batch_family',family,elementId:locked});}catch(err){console.warn('Rewarded ad unavailable',err);}
  if(result?.earned!==true){toast('Ad not completed · No batch reward','error');if(!$('modal').hidden)batchChooser();return;}
  if(slots[0]!==locked||!leftLocked){toast('Locked element changed · Cancelled','error');return;}
  beginBatch(family,'ad');
 };
}
// Fast index for the locked ingredient: only its actual recipes, not the entire
// cross-product. The semantic fallback is checked once per discovered partner.
function batchPartnerIndex(fixed){
 const out=new Map();
 for(const [key,result] of recipes){
  const divider=key.indexOf('|');if(divider<0)continue;
  const a=key.slice(0,divider),b=key.slice(divider+1);
  if(a===fixed)out.set(b,result);else if(b===fixed)out.set(a,result);
 }
 return out;
}
function beginBatch(family,source){
 if(batchState||!leftLocked||!slots[0]){toast('Lock an element on the left first','error');return false;}
 const fixed=slots[0],ids=familyBatchCandidates(family);
 if(!ids.length){toast('Discover some elements in this family first','error');return false;}
 clearTimeout(autoTimer);pendingBatchFamilies=null;
 batchState={fixed,fixedItem:byId.get(fixed),family,source,ids,recipeIndex:batchPartnerIndex(fixed),index:0,fresh:0,repeat:0,miss:0,phase:'scanning',discoveries:[],newRecent:[],reviewIndex:0,viewAll:false,startedAt:performance.now()};
 const f=FAMILIES.find(f=>f.id===family);
 const art=GAMEVERSE_ART[f.icon]?`<img src="${GAMEVERSE_ART[f.icon]}" alt="" decoding="async">`:fallbackIcon();
 showModal(`<div class="modal-tag">SCANNING FAMILY</div><div class="batch-running-art">${art}</div><h2>${escapeText(f.name)}</h2><p>Combining with <strong>${escapeText(batchState.fixedItem.name)}</strong> · Checking recipes locally</p><span class="batch-fast-tag">Fast offline mode</span><div class="batch-running-progress"><div class="batch-running-fill" id="batchRunningFill"></div></div><div class="batch-running-count" id="batchRunningCount">0 / ${ids.length.toLocaleString('en-US')}</div><div class="batch-running-totals" id="batchRunningTotals">Searching for discoveries…</div><p class="mini-muted">Cancel with X. No animations or remote requests.</p>`);
 $('modal').dataset.dismiss='x-only';
 slots[1]=null;updateSlotUI();announceCraft('idle',`Scanning ${ids.length.toLocaleString('en-US')} combinations…`);
 requestAnimationFrame(batchScanChunk);
 return true;
}
function batchScanChunk(){
 const st=batchState;if(!st||st.phase!=='scanning')return;
 if(!leftLocked||slots[0]!==st.fixed){batchState=null;$('modal').hidden=true;toast('Batch cancelled · Locked element changed','error');return;}
 // Time budget protects input latency. Even 10,000 discovered elements should
 // need only a handful of frames, not 10,000 visual updates or timers.
 const deadline=performance.now()+7;
 let processed=0;
 while(st.index<st.ids.length&&processed<1500){
  const other=st.ids[st.index++],otherItem=byId.get(other);processed++;
  const cached=st.recipeIndex.get(other);
  const result=cached||resolveLocalRedundancy(st.fixedItem,otherItem);
  if(!result||!byId.has(result)){st.miss++;if(performance.now()>=deadline)break;continue;}
  const key=pairKey(st.fixed,other),fresh=!unlocked.has(result);
  known.add(key);
  if(!cached){recipes.set(key,result);st.recipeIndex.set(other,result);}
  if(fresh){
   unlocked.add(result);
   if(!STARTERS.has(result))discoveryLedger.set(result,{at:new Date().toISOString(),source:cached?'recipe':'redundant',ingredients:[st.fixed,other]});
   st.discoveries.push({id:result,a:st.fixed,b:other});st.newRecent.push(result);st.fresh++;
  }else st.repeat++;
  if(performance.now()>=deadline)break;
 }
 const percent=st.index/st.ids.length*100;
 if($('batchRunningFill'))$('batchRunningFill').style.width=percent.toFixed(1)+'%';
 if($('batchRunningCount'))$('batchRunningCount').textContent=`${st.index.toLocaleString('en-US')} / ${st.ids.length.toLocaleString('en-US')}`;
 if($('batchRunningTotals'))$('batchRunningTotals').textContent=`${st.fresh} new · ${st.repeat} repeated · ${st.miss} no match`;
 if(st.index<st.ids.length){requestAnimationFrame(batchScanChunk);return;}
 // Persist ONCE at the end; no thousands of costly DOM or storage updates.
 if(st.newRecent.length){last=st.newRecent[st.newRecent.length-1];recent=[...new Set([...st.newRecent.reverse(),...recent])].slice(0,350);}
 slots[1]=null;updateSlotUI();save();updateCounts();updateLatest();rerenderCollections();if(tab==='World')renderDiscoveries();
 const elapsed=Math.round(performance.now()-st.startedAt);
 announceCraft('idle',`Batch complete · ${st.fresh} new · ${st.repeat} repeated · ${st.miss} unmatched`);
 st.elapsedMs=elapsed;st.recipeIndex.clear();st.recipeIndex=null;
 if(st.discoveries.length){st.phase='review';st.reviewIndex=0;showBatchDiscovery();}
 else showBatchSummary();
}
'''
src=src[:beg]+replacement+src[end:]

# Make the View All modal virtualized for huge discovery results too.
start=src.index('function showBatchAll(){')
end=src.index('function showBatchSummary(){',start)
repl='''function batchResultRow(d,i){const item=byId.get(d.id);
 return `<div class="batch-discovery-row"><div class="batch-discovery-art">${staticArt(item)}</div><div class="batch-discovery-name"><strong>${escapeText(item.name)}</strong><small>${escapeText(byId.get(d.a).name)} + ${escapeText(byId.get(d.b).name)}</small></div><span>${i+1}</span></div>`;
}
function showBatchAll(){
 const st=batchState;if(!st||st.phase!=='review')return;
 st.viewAll=true;
 const large=st.discoveries.length>80;
 const rows=large?`<div class="batch-list-spacer" style="height:${st.discoveries.length*70}px"><div class="batch-list-window" id="batchListWindow"></div></div>`:
  st.discoveries.map(batchResultRow).join('');
 showModal(`<div class="modal-tag">ALL NEW DISCOVERIES</div><h2>${st.discoveries.length} discoveries</h2><p>From ${escapeText(FAMILIES.find(f=>f.id===st.family)?.name||st.family)} · ${st.ids.length.toLocaleString('en-US')} combinations checked</p><div class="batch-discovery-list ${large?'is-virtual':''}" tabindex="0" aria-label="Scroll through all new discoveries">${rows}</div><button type="button" class="modal-button secondary" id="batchBackOne">Back to individual discoveries</button><p class="mini-muted">X closes this list and shows the final summary.</p>`);
 $('modal').dataset.dismiss='x-only';
 $('batchBackOne').onclick=showBatchDiscovery;
 if(large){
  const list=$('modal').querySelector('.batch-discovery-list'),windowEl=$('batchListWindow');
  const render=()=>{const start=Math.max(0,Math.floor(list.scrollTop/70)-5),end=Math.min(st.discoveries.length,start+24);
   windowEl.style.top=`${start*70}px`;
   windowEl.innerHTML=st.discoveries.slice(start,end).map((d,i)=>batchResultRow(d,start+i)).join('');
  };
  list.addEventListener('scroll',render,{passive:true});render();
 }
}
'''
src=src[:start]+repl+src[end:]

out=Path('/mnt/data/35K_Alchemy_V29_Offline.html');out.write_text(src,encoding='utf-8')
print('created',out, 'bytes',out.stat().st_size)
