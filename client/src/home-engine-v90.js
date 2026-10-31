/**
 * V90 Companion Houses — the Home screen (owner requests 31/10/2026).
 * A discovered house element (V89: Tent 1 … Castle 8 companions) becomes a cosy room seen from
 * above at a 3/4 angle. Furniture uses dedicated room sprites (front / back / side, so it can be
 * rotated in four directions) sized to its footprint, in three layers:
 *   floor  — rugs, mats, pools, sandbox… lie on the floor; standing furniture may go on top;
 *   object — beds, sofas, treadmills… stand on the floor, never overlap, sorted by depth;
 *   wall   — frames, clocks, curtains… hang on the back wall.
 * Residents (up to the house capacity) walk to a piece and USE it: run on the treadmill, swim half
 * submerged in the pool, bounce on the trampoline, sleep on the bed, eat at the bowl, punch the
 * bag… and the piece really works (ctx.applyEffect: stats, belly, mood).
 * No imports: everything arrives in `ctx` so tools/build-standalone.py can inline it.
 */
export const HOME_STORAGE_KEY='alchemy10k_homes_v1';
export const HOUSE_LAYOUTS={1:{cols:4,rows:3,theme:'tent'},2:{cols:5,rows:4,theme:'hut'},3:{cols:6,rows:5,theme:'cabin'},4:{cols:6,rows:6,theme:'cottage'},6:{cols:7,rows:7,theme:'villa'},8:{cols:8,rows:8,theme:'castle'}};
export const EFFECT_LABEL={run:'Run',swim:'Swim',power:'Power',fly:'Fly',stamina:'Stamina',hp:'HP',mood:'Mood',food:'Food',discovery:'Discovery',decor:'Decor'};
const BAND=0.6;   // sprite height band above the footprint (in tiles)
// How a resident uses a piece: stand ON it, or stand IN FRONT of it.
const FRONT_USE=/shelf|desk|bowl|trough|stove|oven|punching|television|piano|computer|telescope|microscope|globe|aquarium|radio|arcade|pinball|cupboard|pantry|icebox|counter|sink|basin|chest|clock|kettle|jar|box|post|monitor|typewriter|guitar|drum|speaker|vinyl|loom|workbench|easel|wall|barrel|dresser|wardrobe|lamp/i;
const USE={run:{anim:'walk',cls:'use-run'},swim:{anim:'hopwalk',cls:'use-swim'},power:{anim:'knock',cls:'use-power'},fly:{anim:'jump',cls:'use-fly'},
 stamina:{anim:'climb',cls:'use-climb'},hp:{anim:'sleep',cls:'use-rest'},mood:{anim:'idle',cls:'is-happy'},food:{anim:'eat',cls:'use-eat'},discovery:{anim:'point',cls:'use-look'},decor:{anim:'idle',cls:''}};
export function layoutFor(capacity){return HOUSE_LAYOUTS[capacity]||HOUSE_LAYOUTS[Object.keys(HOUSE_LAYOUTS).map(Number).filter(n=>n<=capacity).pop()||1];}
const layerOf=(sprites,id)=>sprites[id]?.layer||'object';
/** Footprint of a placed piece, swapped when it is rotated sideways (r = 1 or 3). */
export function footprint(objects,f){const [w,h]=objects[f.id]?.size||[1,1];return f.r%2?[h,w]:[w,h];}
/** Pure: can piece `cand` ({id,x,y,r}) go there? Floor and object layers may overlap each other, never themselves. */
export function fits(house,layout,objects,sprites,cand,ignoreIndex=-1){
 const layer=layerOf(sprites,cand.id),[w,h]=footprint(objects,cand);
 if(layer==='wall'){if(cand.x<0||cand.x+w>layout.cols)return false;}
 else if(cand.x<0||cand.y<0||cand.x+w>layout.cols||cand.y+h>layout.rows)return false;
 return house.furniture.every((f,i)=>{if(i===ignoreIndex||layerOf(sprites,f.id)!==layer)return true;const [fw,fh]=footprint(objects,f);
  if(layer==='wall')return cand.x+w<=f.x||f.x+fw<=cand.x;
  return cand.x+w<=f.x||f.x+fw<=cand.x||cand.y+h<=f.y||f.y+fh<=cand.y;});
}
export function houseSummary(house,objects){const out={};for(const f of house?.furniture||[]){const e=objects[f.id]?.effect;if(e)out[e]=(out[e]||0)+1;}return out;}

export function createHomeSystem(ctx){
 const {$,escapeText,byId,uiName,staticArt,isDiscovered,objects,roomSprites,roster,sprites,companionName,applyEffect,showModal,closeModal,toast,reducedMotion,onChange}=ctx;
 const RS=roomSprites||{};
 let state={v:1,active:null,houses:{}};
 try{const raw=JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)||'null');if(raw&&raw.houses&&typeof raw.houses==='object')state={v:1,active:raw.active||null,houses:raw.houses};}catch{}
 for(const h of Object.values(state.houses))for(const f of h.furniture||[])if(typeof f.r!=='number')f.r=0;
 const save=()=>{try{localStorage.setItem(HOME_STORAGE_KEY,JSON.stringify(state));}catch{}onChange?.();};
 const houseIds=()=>Object.entries(objects).filter(([,o])=>o.kind==='house').sort((a,b)=>a[1].capacity-b[1].capacity).map(([id])=>id);
 const ownedHouses=()=>houseIds().filter(isDiscovered);
 const house=id=>{if(!state.houses[id])state.houses[id]={furniture:[],residents:[]};return state.houses[id];};
 const furnitureOwned=()=>Object.entries(objects).filter(([id,o])=>o.kind==='furniture'&&isDiscovered(id)).map(([id])=>id);
 const placedAnywhere=id=>Object.entries(state.houses).find(([,h])=>h.furniture.some(f=>f.id===id))?.[0]||null;
 const residentOf=cid=>Object.entries(state.houses).find(([,h])=>h.residents.includes(cid))?.[0]||null;
 let moving=null,wanderTimer=null;
 function activeHouse(){const own=ownedHouses();if(!own.length)return null;if(!own.includes(state.active))state.active=own[own.length-1];return state.active;}

 // ---------- drawing ----------
 function pieceArt(f){const s=RS[f.id];const it=byId.get(f.id);
  if(!s)return {html:`<span class="home-fallback">${staticArt(it)}</span>`,flip:false};
  if(s.layer==='wall')return {html:s.front,flip:false};
  if(f.r===2)return {html:s.back||s.front,flip:false};
  if(f.r===1||f.r===3)return {html:s.side||s.front,flip:f.r===3};
  return {html:s.front,flip:false};}
 function pieceHtml(f,i){
  const layer=layerOf(RS,f.id),[w,h]=footprint(objects,f),art=pieceArt(f);
  const band=layer==='object'?BAND:0;
  const style=layer==='wall'?`--x:${f.x};--w:${w}`:`--x:${f.x};--y:${f.y};--w:${w};--h:${h};--band:${band};--z:${layer==='floor'?1:10+(f.y+h)*2}`;
  return `<button type="button" class="home-piece is-${layer} ${art.flip?'is-flip':''} ${moving&&moving.index===i?'is-moving':''}" data-piece="${i}" style="${style}" aria-label="${escapeText(uiName(byId.get(f.id)))}">${art.html}<i class="home-hit" aria-hidden="true"></i></button>`;}
 function render(mount){
  if(!mount)return;stopWander();
  const hid=activeHouse();const own=ownedHouses();
  const chips=houseIds().map(id=>{const o=objects[id],have=own.includes(id),it=byId.get(id);
   return `<button type="button" class="home-chip ${id===hid?'is-active':''} ${have?'':'is-locked'}" data-house="${id}" ${have?'':'disabled'} aria-label="${have?escapeText(uiName(it)):'Undiscovered house'} · ${o.capacity}"><span class="home-chip-art">${have?staticArt(it):'<span class="home-q">?</span>'}</span><small>${o.capacity}</small></button>`;}).join('');
  if(!hid){mount.innerHTML=`<section class="home-card"><div class="home-chips">${chips}</div><div class="home-empty"><strong>No companion house yet</strong><small>Discover a house element (the smallest is the Companion Tent) to get a room where your companions live, play and train. Bigger houses fit more companions.</small></div></section>`;return;}
  const o=objects[hid],L=layoutFor(o.capacity),h=house(hid),it=byId.get(hid);
  const sum=houseSummary(h,objects);
  const sumHtml=Object.keys(sum).length?Object.entries(sum).map(([e,n])=>`<span class="home-eff" data-eff="${e}">${EFFECT_LABEL[e]} ×${n}</span>`).join(''):'<span class="home-eff is-none">Tap the floor or the wall to add furniture</span>';
  const residents=h.residents.filter(isDiscovered);
  const resHtml=residents.map(cid=>`<button type="button" class="home-res" data-res="${cid}" aria-label="${escapeText(companionName(cid))}"><span>${sprites[cid]||''}</span></button>`).join('')+(residents.length<o.capacity?`<button type="button" class="home-res is-add" id="homeAddRes" aria-label="Add a companion">+</button>`:'');
  mount.innerHTML=`<section class="home-card">
   <div class="home-chips" role="tablist" aria-label="Your houses">${chips}</div>
   <div class="home-head"><strong>${escapeText(uiName(it))}</strong><small>${residents.length}/${o.capacity} companions · ${h.furniture.length} furniture</small></div>
   <div class="home-room" data-theme="${L.theme}" style="--cols:${L.cols};--rows:${L.rows}">
    <div class="home-wall" id="homeWall">
     ${Array.from({length:L.cols},(_,i)=>`<button type="button" class="home-walltile" data-wx="${i}" aria-label="Wall"></button>`).join('')}
     ${h.furniture.map((f,i)=>layerOf(RS,f.id)==='wall'?pieceHtml(f,i):'').join('')}
     <i class="home-skirting" aria-hidden="true"></i>
    </div>
    <div class="home-floor" id="homeFloor">
     ${Array.from({length:L.cols*L.rows},(_,i)=>`<button type="button" class="home-tile" data-x="${i%L.cols}" data-y="${Math.floor(i/L.cols)}" aria-label="Floor tile"></button>`).join('')}
     ${h.furniture.map((f,i)=>layerOf(RS,f.id)!=='wall'?pieceHtml(f,i):'').join('')}
     <div class="home-residents" id="homeResidents"></div>
    </div>
    <div class="home-door" aria-hidden="true"></div>
   </div>
   ${moving?`<p class="home-hint">Tap a free spot for ${escapeText(uiName(byId.get(h.furniture[moving.index]?.id)))} · <button type="button" class="home-link" id="homeCancelMove">Cancel</button></p>`:''}
   <div class="home-effects">${sumHtml}</div>
   <div class="home-res-row"><span>Residents</span><div class="home-res-list">${resHtml}</div></div>
  </section>`;
  mount.querySelectorAll('[data-house]').forEach(b=>b.onclick=()=>{state.active=b.dataset.house;moving=null;save();render(mount);});
  mount.querySelectorAll('.home-tile').forEach(t=>t.onclick=()=>tapSpot(mount,hid,Number(t.dataset.x),Number(t.dataset.y),false));
  mount.querySelectorAll('.home-walltile').forEach(t=>t.onclick=()=>tapSpot(mount,hid,Number(t.dataset.wx),-1,true));
  mount.querySelectorAll('[data-piece]').forEach(p=>p.onclick=e=>{if(moving){const t=spotFromEvent(mount,e,hid);if(t)tapSpot(mount,hid,t.x,t.y,t.wall);return;}tapPiece(mount,hid,Number(p.dataset.piece),spotFromEvent(mount,e,hid));});
  mount.querySelectorAll('[data-res]').forEach(r=>r.onclick=()=>tapResident(mount,hid,r.dataset.res));
  const add=$('homeAddRes');if(add)add.onclick=()=>pickResident(mount,hid);
  const cm=$('homeCancelMove');if(cm)cm.onclick=()=>{moving=null;render(mount);};
  startWander(mount,hid);
 }
 // While moving a piece, a tap that lands on another piece still means "this tile".
 function spotFromEvent(mount,e,hid){const L=layoutFor(objects[hid].capacity);const fl=mount.querySelector('#homeFloor').getBoundingClientRect(),wl=mount.querySelector('#homeWall').getBoundingClientRect();
  const tile=fl.width/L.cols;if(e.clientY<fl.top&&e.clientY>=wl.top)return {x:Math.floor((e.clientX-fl.left)/tile),y:-1,wall:true};
  return {x:Math.floor((e.clientX-fl.left)/tile),y:Math.floor((e.clientY-fl.top)/tile),wall:false};}

 // ---------- furniture ----------
 function tapSpot(mount,hid,x,y,wall){
  const h=house(hid),L=layoutFor(objects[hid].capacity);
  if(moving){const f=h.furniture[moving.index];if(!f)return;const isWall=layerOf(RS,f.id)==='wall';if(isWall!==wall){toast(isWall?'Wall pieces hang on the wall':'Put it on the floor','repeat');return;}
   const cand={...f,x,y:isWall?-1:y};if(fits(h,L,objects,RS,cand,moving.index)){f.x=cand.x;f.y=cand.y;moving=null;save();render(mount);}else toast('It does not fit there','repeat');return;}
  const owned=furnitureOwned().filter(id=>(layerOf(RS,id)==='wall')===wall);
  if(!owned.length){showModal(`<div class="modal-tag">FURNITURE</div><h2>${wall?'Nothing to hang yet':'No furniture yet'}</h2><p>${wall?'Picture frames, clocks, curtains and tapestries hang on the wall.':'Furniture is discovered like any element: beds, sofas, treadmills, paddling pools, bookshelves, food bowls… Each one trains a stat, cheers companions up, feeds them or boosts discoveries.'}</p><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);$('homeClose').onclick=closeModal;return;}
  const rows=owned.map(id=>{const ob=objects[id],where=placedAnywhere(id),ok=!where&&fits(h,L,objects,RS,{id,x,y:wall?-1:y,r:0});const it=byId.get(id);
   return {ok,html:`<button type="button" class="home-pick ${ok?'':'is-off'}" data-pick="${id}" ${ok?'':'disabled'}><span class="home-pick-art">${staticArt(it)}</span><span class="home-pick-main"><strong>${escapeText(uiName(it))}</strong><small>${EFFECT_LABEL[ob.effect]} · ${ob.size[0]}×${ob.size[1]}${where?' · placed'+(where===hid?' here':' in another house'):ok?'':' · no room here'}</small></span></button>`};}).sort((a,b)=>b.ok-a.ok).map(r=>r.html).join('');
  showModal(`<div class="modal-tag">${wall?'HANG ON THE WALL':'ADD FURNITURE'}</div><h2>Choose a piece</h2><div class="home-pick-list">${rows}</div><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;
  document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{h.furniture.push({id:b.dataset.pick,x,y:wall?-1:y,r:0});save();closeModal();render(mount);});
 }
 function tapPiece(mount,hid,i,spot=null){
  const h=house(hid),f=h.furniture[i];if(!f)return;const it=byId.get(f.id),ob=objects[f.id],L=layoutFor(objects[hid].capacity),layer=layerOf(RS,f.id);
  const what=ob.effect==='decor'?'Decoration — makes the house yours.':`${EFFECT_LABEL[ob.effect]}: ${({run:'residents run on it',swim:'residents splash and swim in it',power:'residents build strength',fly:'residents bounce and glide',stamina:'residents climb and balance',hp:'residents rest and recover',mood:'residents have fun',food:'residents eat here',discovery:'residents explore and find more'})[ob.effect]}.`;
  showModal(`<div class="modal-tag">FURNITURE</div><div class="modal-art">${staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2><p>${what}</p>${layer!=='wall'?'<button type="button" class="modal-button" id="homeRotate">Rotate</button>':''}${layer==='floor'&&spot&&!spot.wall?'<button type="button" class="modal-button" id="homeOnTop">Put furniture on it</button>':''}<button type="button" class="modal-button ${layer==='wall'?'':'secondary'}" id="homeMove">Move</button><button type="button" class="modal-button secondary" id="homeRemove">Put away</button>`);
  const rot=$('homeRotate');if(rot)rot.onclick=()=>{for(let k=1;k<=3;k++){const r=(f.r+k)%4;if(fits(h,L,objects,RS,{...f,r},i)){f.r=r;save();closeModal();render(mount);return;}}toast('No room to rotate it here','repeat');};
  const top=$('homeOnTop');if(top)top.onclick=()=>{closeModal();tapSpot(mount,hid,spot.x,spot.y,false);};
  $('homeMove').onclick=()=>{moving={index:i};closeModal();render(mount);};
  $('homeRemove').onclick=()=>{h.furniture.splice(i,1);save();closeModal();render(mount);};
 }

 // ---------- residents ----------
 function pickResident(mount,hid){
  const h=house(hid),cap=objects[hid].capacity;
  const list=roster.filter(c=>isDiscovered(c.id)&&!h.residents.includes(c.id));
  if(!list.length){showModal(`<div class="modal-tag">RESIDENTS</div><h2>No companion available</h2><p>Discover companion elements (five per family) to invite them home.</p><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);$('homeClose').onclick=closeModal;return;}
  showModal(`<div class="modal-tag">INVITE A COMPANION</div><h2>${h.residents.length}/${cap} living here</h2><div class="home-pick-list">${list.map(c=>{const w=residentOf(c.id);return `<button type="button" class="home-pick" data-inv="${c.id}"><span class="home-pick-art">${sprites[c.id]||''}</span><span class="home-pick-main"><strong>${escapeText(companionName(c.id))}</strong><small>${w?'moves from '+escapeText(uiName(byId.get(w))):'free'}</small></span></button>`;}).join('')}</div><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;
  document.querySelectorAll('[data-inv]').forEach(b=>b.onclick=()=>{const cid=b.dataset.inv,w=residentOf(cid);if(w)state.houses[w].residents=state.houses[w].residents.filter(x=>x!==cid);if(h.residents.length<cap)h.residents.push(cid);save();closeModal();render(mount);});
 }
 function tapResident(mount,hid,cid){
  showModal(`<div class="modal-tag">RESIDENT</div><div class="modal-art">${sprites[cid]||''}</div><h2>${escapeText(companionName(cid))}</h2><p>Lives in ${escapeText(uiName(byId.get(hid)))} and uses its furniture: training pieces raise its stats a little every day, food bowls fill its belly, beds and toys cheer it up.</p><button type="button" class="modal-button secondary" id="homeEvict">Move out</button><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;$('homeEvict').onclick=()=>{const h=house(hid);h.residents=h.residents.filter(x=>x!==cid);save();closeModal();render(mount);};
 }

 // ---------- residents walk to furniture and use it ----------
 function rig(el,cid){el.innerHTML=sprites[cid]||'';for(const g of el.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}const svg=el.querySelector('svg');if(svg){svg.setAttribute('width','100%');svg.setAttribute('height','100%');}}
 function useSpot(f,L){const [w,h]=footprint(objects,f);const name=uiName(byId.get(f.id))||'';const layer=layerOf(RS,f.id);
  if(layer!=='floor'&&FRONT_USE.test(name)){const fy=f.y+h;return {x:f.x+Math.floor((w-1)/2),y:Math.min(L.rows-1,fy),front:true};}
  return {x:f.x+Math.floor((w-1)/2),y:f.y+Math.floor((h-1)/2),front:false};}
 function startWander(mount,hid){
  const box=mount.querySelector('#homeResidents');if(!box)return;
  const h=house(hid),L=layoutFor(objects[hid].capacity);
  const usable=h.furniture.filter(f=>layerOf(RS,f.id)!=='wall'&&objects[f.id]?.effect!=='decor');
  const walkers=h.residents.filter(isDiscovered).map((cid,i)=>{const el=document.createElement('span');el.className='companion home-walker';el.dataset.anim='idle';el.dataset.companion=cid;
   const art=document.createElement('span');art.className='companion-art';rig(art,cid);el.append(art);const fx=document.createElement('span');fx.className='home-fx';el.append(fx);box.append(el);
   const p={x:(i*2+1)%L.cols,y:L.rows-1-(i%L.rows),face:1};place(el,p);return {cid,el,p,busyUntil:0,taken:null};});
  if(!walkers.length||reducedMotion())return;
  const taken=new Set();
  const tick=()=>{if(!document.body.contains(box))return stopWander();const now=Date.now();
   for(const w of walkers){if(now<w.busyUntil)continue;
    if(w.taken){taken.delete(w.taken);w.taken=null;}
    w.el.className='companion home-walker';w.el.dataset.anim='idle';
    const free=usable.filter(f=>!taken.has(f));let f=null;
    if(free.length&&Math.random()<0.65)f=free[Math.floor(Math.random()*free.length)];
    let tx,ty,spot=null;
    if(f){spot=useSpot(f,L);tx=spot.x;ty=spot.y;taken.add(f);w.taken=f;}
    else{tx=Math.floor(Math.random()*L.cols);ty=Math.floor(Math.random()*L.rows);}
    const d=Math.hypot(tx-w.p.x,ty-w.p.y);const walkMs=Math.max(450,d*520);
    w.p.face=tx>=w.p.x?1:-1;w.el.dataset.face=w.p.face>0?'right':'left';w.el.dataset.anim='walk';
    w.el.style.transitionDuration=walkMs+'ms';w.p.x=tx;w.p.y=ty;place(w.el,w.p);
    const useMs=f?3800+Math.random()*2500:900+Math.random()*1200;w.busyUntil=now+walkMs+useMs;
    clearTimeout(w.t);w.t=setTimeout(()=>{
     if(!f){w.el.dataset.anim='idle';return;}
     const eff=objects[f.id].effect,u=USE[eff]||USE.decor;
     if(spot.front){w.p.face=1;w.el.dataset.face='right';}
     else{const [,fh]=footprint(objects,f);w.el.style.setProperty('--z',11+(f.y+fh)*2);}
     w.el.dataset.anim=u.anim;if(u.cls)w.el.classList.add(u.cls);w.el.classList.add('is-using');
     const piece=box.parentElement.querySelector(`[data-piece="${h.furniture.indexOf(f)}"]`);if(piece){piece.classList.add('is-in-use');setTimeout(()=>piece.classList.remove('is-in-use'),useMs);}
     setTimeout(()=>{if(applyEffect?.(w.cid,eff)){const fxEl=w.el.querySelector('.home-fx');fxEl.dataset.eff=eff;fxEl.classList.remove('is-pop');void fxEl.offsetWidth;fxEl.classList.add('is-pop');}},Math.min(1800,useMs/2));
    },walkMs);}
   wanderTimer=setTimeout(tick,700);};
  wanderTimer=setTimeout(tick,500);
 }
 function place(el,p){el.style.setProperty('--x',p.x);el.style.setProperty('--y',p.y);el.style.setProperty('--z',11+(p.y+1)*2);el.dataset.face=p.face>0?'right':'left';}
 function stopWander(){clearTimeout(wanderTimer);wanderTimer=null;}

 return {render,stopWander,state:()=>state,summary:id=>houseSummary(house(id),objects),ownedHouses,residentOf,
  importState(raw){if(raw&&raw.houses){state={v:1,active:raw.active||null,houses:raw.houses};save();}}};
}
