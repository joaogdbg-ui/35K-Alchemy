/**
 * V86 Companions (owner request 30/10/2026).
 * Five companion elements per family. Once discovered (in any mode) a companion can be made
 * active; it then lives on top of the interface: walks along the edges of the cards, hops,
 * climbs, knocks on the screen, passes in front of and behind the frames, points at the locked
 * left ingredient when it has no combination left, drops a gift (the Stegosaurus lays an egg)
 * that stays until tapped, and eats elements dragged onto it (Tamagotchi style), which raises
 * its mood and XP. Levels go to 100 and grow four stats (stamina, strength, speed, HP);
 * a Shiny companion starts slightly stronger. Mini-games will use these stats later.
 *
 * No imports: everything the engine needs comes in `ctx` so tools/build-standalone.py can
 * inline this file like the other V85/V86 modules.
 */
export const COMPANION_STORAGE_KEY='alchemy10k_companions_v1';
export const COMPANION_MAX_LEVEL=100;
export const COMPANION_STATS=['stamina','strength','speed','hp'];
export const FEED_COOLDOWN_MS=30*60*1000;
export const GIFT_INTERVAL_MS=[150*1000,320*1000];

export function xpForLevel(level){return 10+level*3;}               // XP needed to go from `level` to `level+1`
export function totalXpForLevel(level){let t=0;for(let l=1;l<level;l++)t+=xpForLevel(l);return t;}
export function levelFromXp(xp){let level=1;while(level<COMPANION_MAX_LEVEL&&xp>=totalXpForLevel(level+1))level++;return level;}

const FAMILY_BASE={
 games:{stamina:30,strength:28,speed:34,hp:30},anime:{stamina:34,strength:30,speed:30,hp:28},
 nature:{stamina:32,strength:22,speed:38,hp:30},fantasy:{stamina:28,strength:36,speed:26,hp:34},
 people:{stamina:36,strength:26,speed:28,hp:32},mythology:{stamina:30,strength:38,speed:30,hp:36},
 prehistoric:{stamina:28,strength:40,speed:24,hp:40},world:{stamina:34,strength:30,speed:30,hp:30}
};
const MOVE_BONUS={fly:{speed:8,hp:-4},roll:{speed:6,stamina:-2},hop:{stamina:4},waddle:{hp:4,speed:-4},walk:{}};
export function companionStats(meta,level,isShiny){
 const base=FAMILY_BASE[meta.family]||FAMILY_BASE.nature,bonus=MOVE_BONUS[meta.move]||{};
 const out={};
 for(const s of COMPANION_STATS){
  const growth=0.62+((meta.name.length*7+s.length*13)%17)/100; // stable per companion/stat, 0.62–0.78
  let v=(base[s]||30)+(bonus[s]||0)+(level-1)*growth;
  if(isShiny)v*=1.05;
  out[s]=Math.round(Math.min(100,v));
 }
 return out;
}
export const MOOD={happy:70,sad:30};
export function moodLabel(m){return m>=MOOD.happy?'Happy':m<=MOOD.sad?'Sad':'Content';}

export function createCompanionSystem(ctx){
 const {roster,sprites,$,escapeText,byId,uiName,staticArt,familyFor,isDiscovered,isShiny,elementIsUseful,getSlots,isLeftLocked,toast,showModal,closeModal,reducedMotion,FAMILIES}=ctx;
 const metaById=new Map(roster.map(c=>[c.id,c]));
 let state={active:null,pets:{},v:1};
 try{const raw=JSON.parse(localStorage.getItem(COMPANION_STORAGE_KEY)||'null');if(raw&&typeof raw==='object'&&raw.pets)state={active:raw.active||null,pets:raw.pets,v:1};}catch{}
 const save=()=>{try{localStorage.setItem(COMPANION_STORAGE_KEY,JSON.stringify(state));}catch{}};
 const pet=id=>{if(!state.pets[id])state.pets[id]={xp:0,mood:60,moodAt:Date.now(),fed:{},gifts:0,meals:0,since:Date.now()};return state.pets[id];};
 const now=()=>Date.now();
 function settleMood(p){const elapsed=now()-(p.moodAt||now());if(elapsed>60000){p.mood=Math.max(0,p.mood-Math.floor(elapsed/600000));p.moodAt=now();}}
 const level=id=>levelFromXp(pet(id).xp);
 const unlocked=()=>roster.filter(c=>isDiscovered(c.id));
 const activeMeta=()=>state.active&&isDiscovered(state.active)?metaById.get(state.active):null;

 // ---------- DOM ----------
 let layerFront=null,layerBack=null,sprite=null,timer=null,giftTimer=null,blinkTimer=null,idleSince=now(),lastPoint=0,destroyed=false;
 let pos={x:40,y:200,face:1},rail=null,sleeping=false,busy=false,lastInput=now();
 function ensureLayer(){
  if(layerFront)return;
  layerBack=document.createElement('div');layerBack.className='companion-layer is-back';layerBack.id='companionLayerBack';
  layerFront=document.createElement('div');layerFront.className='companion-layer is-front';layerFront.id='companionLayer';
  document.body.append(layerBack,layerFront);
  sprite=document.createElement('button');sprite.type='button';sprite.className='companion';sprite.id='companionSprite';sprite.setAttribute('aria-label','Your companion');
  sprite.innerHTML='<span class="companion-shadow" aria-hidden="true"></span><span class="companion-art" aria-hidden="true"></span><span class="companion-bubble" hidden></span><span class="companion-ripple" aria-hidden="true"></span>';
  sprite.addEventListener('click',e=>{e.stopPropagation();openCard(state.active);});
  layerFront.append(sprite);
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{lastInput=now();if(sleeping)wake();},{passive:true}));
  window.addEventListener('resize',()=>{if(activeMeta())goTo(pickRail(),true);});
 }
 function setArt(meta){
  const svg=sprites[meta.id]||'';
  const art=sprite.querySelector('.companion-art');art.innerHTML=svg;
  for(const g of art.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}
  sprite.dataset.move=meta.move;sprite.dataset.companion=meta.id;sprite.classList.toggle('is-shiny',isShiny(meta.id));
  const svgEl=art.querySelector('svg');if(svgEl){svgEl.setAttribute('width','100%');svgEl.setAttribute('height','100%');}
 }
 const SIZE=58;
 function rect(sel){const el=document.querySelector(sel);if(!el||el.hidden)return null;const r=el.getBoundingClientRect();return r.width>0&&r.height>0?r:null;}
 function rails(){
  const list=[],vw=window.innerWidth,vh=window.innerHeight;
  const card=rect('#viewPlay:not([hidden]) .craft-card'),shelf=rect('#viewPlay:not([hidden]) .shelf'),tabbar=rect('.tabbar'),banner=rect('#familyBanner:not([hidden])'),world=rect('#viewWorld:not([hidden]) .catalog-target'),pets=rect('#viewPets:not([hidden]) .pets-hero');
  const top=r=>({kind:'top',y:r.top-SIZE+6,x1:r.left+4,x2:r.right-SIZE-4,layer:'front',ref:r});
  if(banner)list.push(top(banner));
  if(card){list.push(top(card));list.push({kind:'behind',y:card.bottom-SIZE*0.55,x1:card.left+8,x2:card.right-SIZE-8,layer:'back',ref:card});list.push({kind:'side',x:card.right-SIZE*0.45,y1:card.top+4,y2:card.bottom-SIZE,layer:'front',ref:card});}
  if(shelf)list.push(top(shelf));
  if(world)list.push(top(world));
  if(pets)list.push(top(pets));
  if(tabbar)list.push(top(tabbar));
  return list.filter(r=>r.kind==='side'||r.x2>r.x1+40).filter(r=>(r.y??r.y1)>0&&(r.y??r.y2)<vh-20);
 }
 function pickRail(){const rs=rails();if(!rs.length)return null;const walk=rs.filter(r=>r.kind==='top');const pool=Math.random()<0.75&&walk.length?walk:rs;return pool[Math.floor(Math.random()*pool.length)];}
 function place(x,y,instant=false){pos.x=x;pos.y=y;sprite.style.transition=instant?'none':'';sprite.style.setProperty('--x',x+'px');sprite.style.setProperty('--y',y+'px');sprite.dataset.face=pos.face>0?'right':'left';}
 function setLayer(which){(which==='back'?layerBack:layerFront).append(sprite);}
 function anim(name,ms){return new Promise(res=>{sprite.dataset.anim=name;setTimeout(res,ms);});}
 function bubble(html,ms=1400){const b=sprite.querySelector('.companion-bubble');b.innerHTML=html;b.hidden=false;clearTimeout(b._t);b._t=setTimeout(()=>{b.hidden=true;},ms);}
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const speed=()=>{const m=activeMeta();const lvl=level(m.id);const base=m.move==='fly'?170:m.move==='roll'?150:m.move==='hop'?110:m.move==='waddle'?80:120;return base*(1+lvl/200)*(pet(m.id).mood<=MOOD.sad?0.6:1);}; // px/s
 async function walkTo(x,y){const d=Math.hypot(x-pos.x,y-pos.y);if(d<2)return;pos.face=x>=pos.x?1:-1;const ms=Math.max(250,1000*d/speed());sprite.style.setProperty('--ms',ms+'ms');sprite.dataset.anim=activeMeta().move==='fly'?'fly':activeMeta().move==='roll'?'roll':activeMeta().move==='hop'?'hopwalk':'walk';place(x,y);await wait(ms+40);sprite.dataset.anim='idle';}
 function goTo(r,instant=false){if(!r)return;rail=r;setLayer(r.layer);if(r.kind==='side'){place(r.x,r.y2,instant);}else{const x=Math.min(Math.max(pos.x,r.x1),r.x2);place(x,r.y,instant);}}
 async function jumpTo(r){if(!r)return;setLayer('front');sprite.classList.add('is-jumping');const tx=r.kind==='side'?r.x:Math.min(Math.max(pos.x+(Math.random()*160-80),r.x1),r.x2),ty=r.kind==='side'?r.y2:r.y;pos.face=tx>=pos.x?1:-1;sprite.style.setProperty('--ms','650ms');sprite.dataset.anim='jump';place(tx,ty);await wait(700);sprite.classList.remove('is-jumping');sprite.dataset.anim='idle';rail=r;setLayer(r.layer);}
 function lockedUseless(){const s=getSlots();if(!isLeftLocked()||!s[0])return null;if(elementIsUseful(s[0]))return null;return rect('#slot0');}

 // ---------- behaviours ----------
 async function loop(){
  if(destroyed)return;const meta=activeMeta();if(!meta){stop();return;}
  if(busy||sleeping||document.hidden){timer=setTimeout(loop,900);return;}
  if(!rail||!rails().some(r=>r.kind===rail.kind&&Math.abs((r.y??r.y1)-(rail.y??rail.y1))<2)){goTo(pickRail(),true);}
  if(now()-lastInput>150000&&!sleeping){await sleep();timer=setTimeout(loop,500);return;}
  const slot=lockedUseless();
  if(slot&&now()-lastPoint>60000){lastPoint=now();await pointAtSlot(slot);timer=setTimeout(loop,800);return;}
  const roll=Math.random();
  try{
   if(rail?.kind==='side'){await climb();}
   else if(roll<0.42)await stroll();
   else if(roll<0.55)await anim('hop',520).then(()=>{sprite.dataset.anim='idle';});
   else if(roll<0.68)await jumpTo(pickRail());
   else if(roll<0.78)await knock();
   else if(roll<0.86)await peekBehind();
   else if(roll<0.94)await quirk(meta);
   else await anim('look',900).then(()=>{sprite.dataset.anim='idle';});
  }catch(e){console.warn('companion',e);}
  timer=setTimeout(loop,500+Math.random()*1400);
 }
 async function stroll(){if(!rail||rail.kind==='side')return;const x=rail.x1+Math.random()*(rail.x2-rail.x1);await walkTo(x,rail.y);}
 async function climb(){const r=rail;const up=Math.random()<0.5;sprite.dataset.anim='climb';sprite.classList.add('is-climbing');const ty=up?r.y1:r.y2;const ms=Math.max(400,1000*Math.abs(ty-pos.y)/speed());sprite.style.setProperty('--ms',ms+'ms');place(r.x,ty);await wait(ms+50);sprite.classList.remove('is-climbing');sprite.dataset.anim='idle';if(up){const tops=rails().filter(x=>x.kind==='top'&&x.ref===r.ref);await jumpTo(tops[0]||pickRail());}else await jumpTo(pickRail());}
 async function knock(){if(!rail||rail.kind==='side')return;const left=Math.random()<0.5;await walkTo(left?rail.x1:rail.x2,rail.y);pos.face=left?-1:1;sprite.dataset.face=left?'left':'right';sprite.dataset.anim='knock';const rip=sprite.querySelector('.companion-ripple');rip.classList.remove('is-on');void rip.offsetWidth;rip.classList.add('is-on');bubble('<i class="knock">toc toc</i>',1300);await wait(1300);sprite.dataset.anim='idle';}
 async function peekBehind(){const back=rails().find(r=>r.kind==='behind');if(!back)return;await jumpTo(back);await walkTo(back.x1+Math.random()*(back.x2-back.x1),back.y);await wait(400);await jumpTo(rails().find(r=>r.kind==='top'&&r.ref===back.ref)||pickRail());}
 async function pointAtSlot(slotRect){const r=rails().find(x=>x.kind==='top'&&x.ref&&x.ref.top<slotRect.top&&x.ref.bottom>slotRect.bottom);if(r&&r!==rail)await jumpTo(r);const x=Math.min(Math.max(slotRect.left+slotRect.width/2-SIZE/2,rail?.x1??0),rail?.x2??window.innerWidth-SIZE);await walkTo(x,pos.y);pos.face=1;sprite.dataset.face='right';sprite.dataset.anim='point';bubble('<i class="nope">no combos left</i>',1800);await wait(900);sprite.dataset.anim='shake';await wait(1000);sprite.dataset.anim='idle';}
 async function quirk(meta){sprite.dataset.anim='quirk-'+(meta.move==='fly'?'loop':meta.move==='roll'?'spin':meta.family==='games'?'glitch':meta.family==='people'?'wave':meta.family==='mythology'?'glow':meta.family==='prehistoric'?'stomp':'wiggle');bubble(escapeText(meta.quirk.split(/[;,(]/)[0]),1600);await wait(1500);sprite.dataset.anim='idle';}
 async function sleep(){sleeping=true;sprite.dataset.anim='sleep';bubble('<i class="zzz">z z z</i>',4000);}
 function wake(){if(!sleeping)return;sleeping=false;sprite.dataset.anim='idle';}

 // ---------- gifts ----------
 const GIFT_ART=new Map();
 function giftArt(meta){if(GIFT_ART.has(meta.id))return GIFT_ART.get(meta.id);const el=[...byId.values()].find(i=>i.name.toLowerCase()===meta.gift.toLowerCase());const html=el?staticArt(el):'<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="26" fill="#f1c76b" stroke="#657D89" stroke-width="4"/></svg>';GIFT_ART.set(meta.id,html);return html;}
 function scheduleGift(){clearTimeout(giftTimer);const [a,b]=GIFT_INTERVAL_MS;giftTimer=setTimeout(dropGift,a+Math.random()*(b-a));}
 async function dropGift(){const meta=activeMeta();if(!meta||document.hidden||sleeping){scheduleGift();return;}
  if(layerFront.querySelectorAll('.companion-gift').length>=3){scheduleGift();return;}
  busy=true;sprite.dataset.anim='gift';bubble(escapeText(meta.gift)+'!',1200);await wait(900);
  const g=document.createElement('button');g.type='button';g.className='companion-gift';g.setAttribute('aria-label','Tap to collect the '+meta.gift);g.innerHTML=giftArt(meta);
  g.style.setProperty('--x',(pos.x+(pos.face>0?-26:SIZE-8))+'px');g.style.setProperty('--y',(pos.y+SIZE-30)+'px');
  g.onclick=()=>{g.classList.add('is-taken');setTimeout(()=>g.remove(),420);const p=pet(meta.id);p.gifts++;p.mood=Math.min(100,p.mood+6);p.xp=Math.min(totalXpForLevel(COMPANION_MAX_LEVEL),p.xp+2);save();toast(meta.gift+' collected · +2 XP','new');refreshViews();};
  layerFront.append(g);sprite.dataset.anim='idle';busy=false;scheduleGift();}

 // ---------- feeding (drag an element onto the companion) ----------
 function likes(meta,item){const fam=familyFor(item);if(fam===meta.family)return 'love';if(meta.family==='games'&&['life','nature','food'].includes(item.category))return 'no';if(['nature','prehistoric'].includes(meta.family)&&['technology','brand','console','portable','computer'].includes(item.category))return 'no';if(meta.family==='anime'&&['material','science'].includes(item.category))return 'no';return 'ok';}
 async function feed(elementId){
  const meta=activeMeta(),item=byId.get(elementId);if(!meta||!item)return false;
  const p=pet(meta.id);settleMood(p);
  const taste=likes(meta,item);
  busy=true;pos.face=1;sprite.dataset.face='right';
  if(taste==='no'){sprite.dataset.anim='refuse';bubble(`<span class="bite">${staticArt(item)}</span><i class="nope">no thanks</i>`,1500);p.mood=Math.max(0,p.mood-3);p.moodAt=now();save();await wait(1400);sprite.dataset.anim='idle';busy=false;refreshViews();toast(uiName(item)+' refused','repeat');return true;}
  const last=p.fed[elementId]||0,fresh=now()-last>FEED_COOLDOWN_MS;
  const gain=fresh?(taste==='love'?3:1):0;
  sprite.dataset.anim='eat';bubble(`<span class="bite">${staticArt(item)}</span>`,1500);
  p.mood=Math.min(100,p.mood+(taste==='love'?12:5));p.moodAt=now();
  const before=levelFromXp(p.xp);p.xp=Math.min(totalXpForLevel(COMPANION_MAX_LEVEL),p.xp+gain);if(fresh)p.fed[elementId]=now();p.meals++;save();
  await wait(1500);sprite.dataset.anim='idle';busy=false;
  const after=levelFromXp(p.xp);
  toast(gain?`${uiName(item)} eaten · +${gain} XP${taste==='love'?' (favourite!)':''}`:`${uiName(item)} eaten · already full of this one`,'new');
  if(after>before){sprite.dataset.anim='levelup';bubble(`<i class="lvl">Level ${after}!</i>`,2200);await wait(2000);sprite.dataset.anim='idle';}
  refreshViews();return true;
 }
 function hitTest(x,y){if(!sprite||!activeMeta())return false;const r=sprite.getBoundingClientRect();return x>=r.left-12&&x<=r.right+12&&y>=r.top-12&&y<=r.bottom+12;}

 // ---------- lifecycle ----------
 function start(){ensureLayer();const meta=activeMeta();if(!meta){stop();return;}setArt(meta);sprite.hidden=false;layerFront.hidden=false;layerBack.hidden=false;settleMood(pet(meta.id));sprite.dataset.mood=moodLabel(pet(meta.id).mood).toLowerCase();goTo(pickRail(),true);clearTimeout(timer);clearInterval(blinkTimer);
  if(reducedMotion()){sprite.dataset.anim='idle';sprite.classList.add('is-static');return;}
  blinkTimer=setInterval(()=>{if(!sleeping&&sprite.dataset.anim==='idle'){sprite.classList.add('is-blinking');setTimeout(()=>sprite.classList.remove('is-blinking'),160);}},3200+Math.random()*1500);
  timer=setTimeout(loop,800);scheduleGift();}
 function stop(){clearTimeout(timer);clearTimeout(giftTimer);clearInterval(blinkTimer);if(sprite){sprite.hidden=true;}if(layerFront)layerFront.querySelectorAll('.companion-gift').forEach(g=>g.remove());}
 function setActive(id){if(id&&!isDiscovered(id))return false;state.active=id||null;save();if(state.active){pet(state.active);start();}else stop();refreshViews();return true;}
 function onDiscovery(id){if(metaById.has(id)&&!state.pets[id]){pet(id);save();toast('New companion: '+uiName(byId.get(id))+' · see the Companions tab','new');}if(state.active&&sprite&&!sprite.hidden){const p=pet(state.active);p.xp=Math.min(totalXpForLevel(COMPANION_MAX_LEVEL),p.xp+1);save();}}

 // ---------- views ----------
 const listeners=new Set();function refreshViews(){for(const fn of listeners)try{fn();}catch(e){console.warn(e);}}
 function statBar(label,v){return `<div class="pet-stat"><span>${label}</span><i><b style="width:${v}%"></b></i><strong>${v}</strong></div>`;}
 function cardHtml(meta,{full=false}={}){
  const have=isDiscovered(meta.id),p=have?pet(meta.id):null,lvl=have?levelFromXp(p.xp):0,sh=isShiny(meta.id);
  const el=byId.get(meta.id),name=uiName(el)||meta.name;
  const xpIn=have?p.xp-totalXpForLevel(lvl):0,xpNeed=xpForLevel(lvl),pct=lvl>=COMPANION_MAX_LEVEL?100:Math.round(100*xpIn/xpNeed);
  const stats=have?companionStats(meta,lvl,sh):null;
  return `<article class="pet-card ${have?'is-unlocked':'is-locked'} ${state.active===meta.id?'is-active':''} ${sh?'is-shiny':''}" data-pet="${meta.id}">
   <div class="pet-preview" aria-hidden="true">${have?(sprites[meta.id]||staticArt(el)):'<span class="pet-silhouette">'+staticArt(el)+'</span>'}</div>
   <div class="pet-main">
    <strong>${have?(sh?'✦ ':'')+escapeText(name):'???'}</strong>
    <small>${have?`Level ${lvl} · ${moodLabel(p.mood)}`:'Discover '+escapeText(name)+' to unlock'}</small>
    ${have?`<span class="pet-xp" title="${xpIn} / ${xpNeed} XP"><i style="width:${pct}%"></i></span>`:''}
    ${have&&full?`<div class="pet-stats">${statBar('Stamina',stats.stamina)}${statBar('Strength',stats.strength)}${statBar('Speed',stats.speed)}${statBar('HP',stats.hp)}</div><p class="pet-quirk">${escapeText(meta.quirk)}. Gift: ${escapeText(meta.gift)}.</p>`:''}
   </div>
   ${have?`<button type="button" class="pet-activate" data-activate="${meta.id}" aria-pressed="${state.active===meta.id}">${state.active===meta.id?'Active':'Choose'}</button>`:''}
  </article>`;
 }
 function renderTab(){
  const root=$('viewPets');if(!root)return;
  const act=activeMeta();const have=unlocked().length;
  const groups=FAMILIES.map(f=>({f,list:roster.filter(c=>c.family===f.id)})).filter(g=>g.list.length);
  root.innerHTML=`<div class="pets-scroll"><div class="section-head"><h2>Companions</h2><p>${have} of ${roster.length} unlocked · a companion lives on your screen, eats what you drag onto it and levels up to ${COMPANION_MAX_LEVEL}.</p></div>
   <section class="pets-hero">${act?cardHtml(act,{full:true}):`<div class="pets-empty"><strong>No companion active</strong><small>Discover one of the ${roster.length} companion elements (five per family) and tap Choose.</small></div>`}
   ${act?`<button type="button" class="pet-dismiss" id="petDismiss">Send home</button>`:''}</section>
   ${groups.map(g=>`<h3 class="pets-family">${escapeText(g.f.name)}</h3><div class="pets-grid">${g.list.map(c=>cardHtml(c)).join('')}</div>`).join('')}
   <section class="pets-help"><h3>How companions work</h3><ul>
    <li><strong>Unlock:</strong> discover the element in Classic or in its family campaign.</li>
    <li><strong>On screen:</strong> it walks along the cards, hops, climbs, knocks on the glass, passes behind the frames, and points at a locked ingredient that has no combination left.</li>
    <li><strong>Gifts:</strong> every few minutes it leaves its gift (the Stegosaurus lays an egg). Tap it: +2 XP and a happier companion.</li>
    <li><strong>Feeding:</strong> drag any element from your list onto the companion. Elements of its own family are favourites (+3 XP); others give +1 XP; a few are refused. Each element feeds it once per 30 minutes.</li>
    <li><strong>Mood:</strong> fades slowly over time; a sad companion moves slower. Feeding, gifts and new discoveries cheer it up.</li>
    <li><strong>Levels &amp; stats:</strong> up to level ${COMPANION_MAX_LEVEL}. Each level raises Stamina, Strength, Speed and HP. A Shiny companion starts about 5% stronger. New discoveries made while it is active give +1 XP.</li>
   </ul><h3>Coming next: companion mini-games</h3><p>Each companion will unlock a different mini-game that it plays on its own (racing, climbing, swimming, digging, flying…). You only tap the screen for a boost, which spends Stamina; Strength, Speed and HP decide how it performs. The goal: a gold medal in every mini-game. Level up your companions now to be ready.</p></section></div>`;
  root.querySelectorAll('[data-activate]').forEach(b=>b.onclick=()=>{setActive(state.active===b.dataset.activate?null:b.dataset.activate);});
  const d=$('petDismiss');if(d)d.onclick=()=>setActive(null);
 }
 function openCard(id){const meta=metaById.get(id);if(!meta)return;showModal(`<div class="modal-tag">COMPANION</div>${cardHtml(meta,{full:true})}<p class="mini-muted">Drag an element from your list onto ${escapeText(uiName(byId.get(meta.id)))} to feed it. Tap its gifts when they appear.</p><button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);$('petCardClose').onclick=closeModal;$('modalContent').querySelectorAll('[data-activate]').forEach(b=>b.onclick=()=>{setActive(state.active===b.dataset.activate?null:b.dataset.activate);closeModal();});}
 listeners.add(renderTab);
 return {start,stop,setActive,feed,hitTest,onDiscovery,renderTab,openCard,get active(){return activeMeta();},state:()=>state,unlocked,refreshViews,
  onViewChange(){if(activeMeta()&&sprite&&!sprite.hidden)setTimeout(()=>goTo(pickRail(),true),80);},
  importState(raw){if(raw&&raw.pets){state={active:raw.active||null,pets:raw.pets,v:1};save();}}};
}
