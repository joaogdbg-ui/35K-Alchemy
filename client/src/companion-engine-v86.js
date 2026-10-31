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
export const COMPANION_MAX_LEVEL=99;            // per-stat level, like SA2B Chao
export const COMPANION_STATS=['hp','stamina','run','power','swim','fly'];
export const STAT_LABEL={hp:'HP',stamina:'Stamina',run:'Run',power:'Power',swim:'Swim',fly:'Fly'};
export const STAT_MAX_POINTS=3375;
export const GRADES=['E','D','C','B','A','S'];
export const FEED_COOLDOWN_MS=30*60*1000;
export const GIFT_INTERVAL_MS=[150*1000,320*1000];
export const SELF_FEED_INTERVAL_MS=[200*1000,420*1000];

/** Points gained for one level-up: (grade × 3) + 13 ± 2 (E 11–15 … S 26–30), the SA2B Chao rule. */
export function levelUpGain(gradeIndex,rnd=Math.random){return gradeIndex*3+13+(Math.floor(rnd()*5)-2);}
/** Starting points of a stat: grade-dependent, 60–110. */
export function startingPoints(gradeIndex){return 60+gradeIndex*10;}
// Signature stats per family / move decide the grades (S for the family's thing, E for its opposite).
const FAMILY_GRADES={
 games:{hp:2,stamina:2,run:4,power:2,swim:1,fly:1},anime:{hp:2,stamina:2,run:3,power:4,swim:1,fly:2},
 nature:{hp:2,stamina:3,run:3,power:1,swim:3,fly:1},fantasy:{hp:2,stamina:2,run:2,power:3,swim:1,fly:3},
 people:{hp:3,stamina:4,run:2,power:2,swim:2,fly:0},mythology:{hp:3,stamina:2,run:2,power:4,swim:2,fly:3},
 prehistoric:{hp:4,stamina:2,run:2,power:5,swim:2,fly:0},world:{hp:3,stamina:3,run:3,power:2,swim:2,fly:1}
};
const MOVE_GRADES={fly:{fly:5,run:-1},roll:{run:1},hop:{stamina:1},waddle:{swim:2,run:-1},walk:{}};
const NAME_GRADES={Frog:{swim:5},Otter:{swim:5},Penguin:{swim:5},Fox:{run:5},Smilodon:{run:5},Triceratops:{power:5,hp:5},'Woolly Mammoth':{hp:5},'Giant Robot':{power:5},Giant:{power:5},Golem:{power:4},Ghost:{fly:4,hp:0},Phoenix:{fly:5,hp:4},Griffin:{fly:5},Pegasus:{fly:5,run:5},Pterosaur:{fly:5},Hedgehog:{hp:3,run:3},Owl:{fly:5},Ninja:{run:5},Hero:{power:3,hp:3},Werewolf:{run:4,power:4},Singer:{stamina:4},Panda:{hp:4,run:0},Flamenco:{stamina:4,run:3},Tango:{stamina:4},'Rio Carnival':{stamina:5},'Day of the Dead':{hp:1,stamina:5},Chef:{hp:4},Explorer:{stamina:5,swim:3},Beekeeper:{stamina:3},Archaeologist:{power:3},Photographer:{run:3},Wizard:{fly:3,power:2},'Pixel Dragon':{fly:4,power:3},'Arcade Golem':{power:5,run:0},'Pixel Dinosaur Sprite':{run:4},Robot:{power:4,swim:0},'Pixel Artist':{stamina:3},Stegosaurus:{hp:5,power:4},Sphinx:{power:3,hp:4},Cerberus:{power:5,run:3},Moai:{hp:5,run:0}};
export function companionGrades(meta,isShiny){
 const base=FAMILY_GRADES[meta.family]||FAMILY_GRADES.nature,mv=MOVE_GRADES[meta.move]||{},nm=NAME_GRADES[meta.name]||{};
 const out={};
 for(const st of COMPANION_STATS){let g=nm[st]??((base[st]||2)+(mv[st]||0));if(isShiny)g+=1;out[st]=Math.max(0,Math.min(5,g));}
 return out;
}
export function freshStats(meta,isShiny){const g=companionGrades(meta,isShiny);const st={};for(const k of COMPANION_STATS)st[k]={level:0,bar:0,points:startingPoints(g[k])};return st;}
// Which stats an element feeds (like Chaos Drive colours): by the element's family.
export const FAMILY_FEEDS={games:['run','stamina'],anime:['power','fly'],nature:['swim','stamina'],fantasy:['fly','power'],people:['stamina','hp'],mythology:['power','fly'],prehistoric:['power','hp'],world:['run','swim']};
export const MOOD={happy:70,sad:30};
export function moodLabel(m){return m>=MOOD.happy?'Happy':m<=MOOD.sad?'Sad':'Content';}

export function createCompanionSystem(ctx){
 const {roster,sprites,$,escapeText,byId,uiName,staticArt,familyFor,isDiscovered,isShiny,elementIsUseful,getSlots,isLeftLocked,toast,showModal,closeModal,reducedMotion,FAMILIES}=ctx;
 const metaById=new Map(roster.map(c=>[c.id,c]));
 let state={active:null,pets:{},v:1};
 try{const raw=JSON.parse(localStorage.getItem(COMPANION_STORAGE_KEY)||'null');if(raw&&typeof raw==='object'&&raw.pets)state={active:raw.active||null,pets:raw.pets,v:1};}catch{}
 const save=()=>{try{localStorage.setItem(COMPANION_STORAGE_KEY,JSON.stringify(state));}catch{}};
 const pet=id=>{if(!state.pets[id])state.pets[id]={mood:60,moodAt:Date.now(),fed:{},gifts:0,meals:0,since:Date.now()};const p=state.pets[id];if(!p.stats)p.stats=freshStats(metaById.get(id)||{family:'nature',move:'walk',name:''},isShiny(id));return p;};
 const totalLevel=id=>COMPANION_STATS.reduce((n,k)=>n+(pet(id).stats[k]?.level||0),0);
 /** Add progress to one stat; returns {levelUps, pointsGained}. 100 bar points = one level. */
 function gainStat(p,meta,stat,amount){const st=p.stats[stat];const g=companionGrades(meta,isShiny(meta.id))[stat];let ups=0,pts=0;if(st.level>=COMPANION_MAX_LEVEL)return {levelUps:0,pointsGained:0};st.bar+=amount;while(st.bar>=100&&st.level<COMPANION_MAX_LEVEL){st.bar-=100;st.level++;const d=levelUpGain(g);st.points=Math.min(STAT_MAX_POINTS,st.points+d);pts+=d;ups++;}if(st.level>=COMPANION_MAX_LEVEL)st.bar=0;return {levelUps:ups,pointsGained:pts};}
 const now=()=>Date.now();
 function settleMood(p){const elapsed=now()-(p.moodAt||now());if(elapsed>60000){p.mood=Math.max(0,p.mood-Math.floor(elapsed/600000));p.moodAt=now();}}
 const unlocked=()=>roster.filter(c=>isDiscovered(c.id));
 const activeMeta=()=>state.active&&isDiscovered(state.active)?metaById.get(state.active):null;

 // ---------- DOM ----------
 // Everything the companion "says" is shown by its own body: no text bubbles anywhere.
 let layerFront=null,layerBack=null,sprite=null,timer=null,giftTimer=null,blinkTimer=null,lastPoint=0,destroyed=false;
 let pos={x:40,y:200,face:1},rail=null,sleeping=false,busy=false,lastInput=now(),cancelMove=null,rollAngle=0;
 const SIZE=58;
 function ensureLayer(){
  if(layerFront)return;
  layerBack=document.createElement('div');layerBack.className='companion-layer is-back';layerBack.id='companionLayerBack';
  layerFront=document.createElement('div');layerFront.className='companion-layer is-front';layerFront.id='companionLayer';
  document.body.append(layerBack,layerFront);
  sprite=document.createElement('button');sprite.type='button';sprite.className='companion';sprite.id='companionSprite';sprite.setAttribute('aria-label','Your companion');
  sprite.innerHTML='<span class="companion-shadow" aria-hidden="true"></span><span class="companion-art" aria-hidden="true"></span><span class="companion-fx" aria-hidden="true"></span>';
  sprite.addEventListener('click',e=>{e.stopPropagation();openCard(state.active);});
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{lastInput=now();if(sleeping)wake();},{passive:true}));
  window.addEventListener('resize',()=>{if(activeMeta()){const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}}});
 }
 function setArt(meta){
  const svg=sprites[meta.id]||'';
  const art=sprite.querySelector('.companion-art');art.innerHTML=svg;
  for(const g of art.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}
  sprite.dataset.move=meta.move;sprite.dataset.quirk=meta.quirkAnim||'wiggle';sprite.dataset.companion=meta.id;sprite.classList.toggle('is-shiny',isShiny(meta.id));
  const svgEl=art.querySelector('svg');if(svgEl){svgEl.setAttribute('width','100%');svgEl.setAttribute('height','100%');}
 }
 function rect(sel){const el=document.querySelector(sel);if(!el||el.hidden)return null;const r=el.getBoundingClientRect();return r.width>0&&r.height>0?r:null;}
 // Rails are the top edges of the interface cards. Each edge exists twice: in FRONT (standing on
 // the card) and BEHIND (half hidden behind the card, drawn in the back layer).
 function rails(){
  const list=[],vh=window.innerHeight;
  const cards=[rect('#familyBanner:not([hidden])'),rect('#viewPlay:not([hidden]) .craft-card'),rect('#viewPlay:not([hidden]) .shelf'),rect('#viewWorld:not([hidden]) .catalog-target'),rect('#viewPets:not([hidden]) .pets-hero'),rect('.tabbar')].filter(Boolean);
  cards.forEach((r,i)=>{
   list.push({kind:'top',y:r.top-SIZE+6,x1:r.left+4,x2:r.right-SIZE-4,layer:'front',ref:r,i});
   list.push({kind:'behind',y:r.top-SIZE*0.52,x1:r.left+6,x2:r.right-SIZE-6,layer:'back',ref:r,i});
   if(r.height>120)list.push({kind:'side',x:r.right-SIZE*0.5,y1:r.top-SIZE+6,y2:r.bottom-SIZE,layer:'front',ref:r,i});
  });
  return list.filter(r=>r.kind==='side'||r.x2>r.x1+40).filter(r=>(r.y??r.y1)>-10&&(r.y??r.y2)<vh-20);
 }
 const clampX=(r,x)=>Math.min(Math.max(x,r.x1),r.x2);
 function pickRail(kind='top'){const rs=rails().filter(r=>r.kind===kind);return rs.length?rs[Math.floor(Math.random()*rs.length)]:null;}
 function place(x,y){pos.x=x;pos.y=y;sprite.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;sprite.dataset.face=pos.face>0?'right':'left';}
 function setLayer(which){if(sprite.parentElement!==(which==='back'?layerBack:layerFront))(which==='back'?layerBack:layerFront).append(sprite);}
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const speed=()=>{const m=activeMeta();const run=pet(m.id).stats.run.points;const base={fly:150,roll:140,hop:100,waddle:70,walk:105}[m.move]||105;return base*(1+Math.min(1,run/3375)*0.6)*(pet(m.id).mood<=MOOD.sad?0.6:1);};
 // Frame-by-frame mover: eased ground travel, parabolic jumps, rolling rotation, layer swap mid-arc.
 function travel({x,y,arc=0,ms=null,anim=null,swapLayer=null,ease=true,px=null}){
  return new Promise(res=>{
   const sx=pos.x,sy=pos.y,d=Math.hypot(x-sx,y-sy);const dur=ms??Math.max(220,1000*d/(px||speed()));
   if(x!==sx)pos.face=x>sx?1:-1;
   const meta=activeMeta();sprite.dataset.anim=anim||(arc?'jump':meta.move==='fly'?'fly':meta.move==='roll'?'roll':meta.move==='hop'?'hopwalk':meta.move==='waddle'?'waddle':'walk');
   sprite.style.setProperty('--stride',(meta.move==='waddle'?0.55:meta.move==='hop'?0.5:Math.max(0.28,0.5*105/speed())).toFixed(2)+'s');
   let swapped=false,raf=0;const t0=performance.now();
   const body=sprite.querySelector('[data-part="body"]');
   cancelMove=()=>{cancelAnimationFrame(raf);res(false);};
   const step=t=>{let k=Math.min(1,(t-t0)/dur);const e=ease?easeInOut(k):k;
    const nx=sx+(x-sx)*e,ny=sy+(y-sy)*e-arc*Math.sin(Math.PI*k);
    if(swapLayer&&!swapped&&k>=0.5){swapped=true;setLayer(swapLayer);}
    if(meta.move==='roll'&&!arc&&body){rollAngle+=((nx-pos.x)/26)*57.3;body.style.transform=`rotate(${rollAngle}deg)`;}
    place(nx,ny);
    if(k<1)raf=requestAnimationFrame(step);else{cancelMove=null;sprite.dataset.anim='idle';res(true);}
   };raf=requestAnimationFrame(step);
  });
 }
 const walkTo=(x,y)=>travel({x,y});
 async function jumpTo(r,xHint=null){if(!r)return;const tx=r.kind==='side'?r.x:clampX(r,xHint??pos.x+(Math.random()*120-60)),ty=r.kind==='side'?r.y2:r.y;
  const dy=ty-pos.y;const arc=Math.max(26,Math.min(70,Math.abs(dy)*0.35+24));
  const swap=r.layer!==(sprite.parentElement===layerBack?'back':'front')?r.layer:null;
  sprite.dataset.anim='crouch';await wait(140);
  await travel({x:tx,y:ty,arc,ms:420+Math.abs(dy)*0.9,anim:'jump',swapLayer:swap});
  sprite.dataset.anim='land';await wait(160);sprite.dataset.anim='idle';rail=r;}
 function lockedUseless(){const s=getSlots();if(!isLeftLocked()||!s[0])return null;if(elementIsUseful(s[0]))return null;return rect('#slot0');}
 function fx(kind,ms=1200){const f=sprite.querySelector('.companion-fx');const el=document.createElement('i');el.className='fx-'+kind;f.append(el);setTimeout(()=>el.remove(),ms);return el;}

 // ---------- behaviours ----------
 async function loop(){
  if(destroyed)return;const meta=activeMeta();if(!meta){stop();return;}
  if(busy||sleeping||document.hidden){timer=setTimeout(loop,900);return;}
  const rs=rails();
  if(!rail||!rs.some(r=>r.kind===rail.kind&&r.i===rail.i)){const r=pickRail();if(!r){timer=setTimeout(loop,1200);return;}rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}
  else{rail=rs.find(r=>r.kind===rail.kind&&r.i===rail.i)||rail;}
  if(now()-lastInput>150000){await sleep();timer=setTimeout(loop,500);return;}
  const slot=lockedUseless();
  if(slot&&now()-lastPoint>60000){lastPoint=now();await pointAtSlot(slot);timer=setTimeout(loop,800);return;}
  const roll=Math.random();
  try{
   if(rail.kind==='side')await climb();
   else if(rail.kind==='behind'){if(roll<0.5)await stroll();else await jumpTo(rs.find(r=>r.kind==='top'&&r.i===rail.i)||pickRail());}
   else if(roll<0.38)await stroll();
   else if(roll<0.5)await hopInPlace();
   else if(roll<0.62)await jumpTo(pickRail());
   else if(roll<0.72)await knock();
   else if(roll<0.82)await goBehind();
   else if(roll<0.9)await startClimb();
   else await quirk(meta);
  }catch(e){console.warn('companion',e);sprite.dataset.anim='idle';}
  timer=setTimeout(loop,400+Math.random()*1300);
 }
 async function stroll(){if(!rail||rail.kind==='side')return;await walkTo(rail.x1+Math.random()*(rail.x2-rail.x1),rail.y);}
 async function hopInPlace(){sprite.dataset.anim='crouch';await wait(120);const y=pos.y;await travel({x:pos.x,y,arc:18,ms:420,anim:'jump'});sprite.dataset.anim='land';await wait(140);sprite.dataset.anim='idle';}
 async function startClimb(){const side=rails().find(r=>r.kind==='side'&&r.i===rail.i)||rails().find(r=>r.kind==='side');if(!side)return;await walkTo(clampX(rail,side.x),rail.y);
  if(Math.abs(pos.y-side.y1)>8){await jumpTo(side);}else{rail=side;}await climb();}
 async function climb(){const r=rail;if(r.kind!=='side')return;sprite.classList.add('is-climbing');const goUp=pos.y>r.y1+20;const ty=goUp?r.y1:r.y2;
  await travel({x:r.x,y:ty,anim:'climb',px:speed()*0.55});sprite.classList.remove('is-climbing');
  const top=rails().find(x=>x.kind==='top'&&x.i===r.i);
  if(goUp&&top){await travel({x:clampX(top,r.x-SIZE*0.6),y:top.y,arc:22,ms:380,anim:'jump'});sprite.dataset.anim='land';await wait(150);sprite.dataset.anim='idle';rail=top;}
  else await jumpTo(pickRail());}
 async function knock(){if(!rail||rail.kind!=='top')return;const left=Math.random()<0.5;await walkTo(left?rail.x1:rail.x2,rail.y);pos.face=left?-1:1;sprite.dataset.face=left?'left':'right';
  sprite.dataset.anim='knock';for(let i=0;i<3;i++){await wait(260);fx('ripple',900);document.body.classList.add('companion-knock');setTimeout(()=>document.body.classList.remove('companion-knock'),180);}await wait(500);sprite.dataset.anim='idle';}
 async function goBehind(){const back=rails().find(r=>r.kind==='behind'&&r.i===rail.i)||pickRail('behind');if(!back)return;await jumpTo(back,pos.x);await stroll();await wait(300+Math.random()*600);const top=rails().find(r=>r.kind==='top'&&r.i===back.i);if(top)await jumpTo(top,pos.x);}
 async function pointAtSlot(slotRect){const top=rails().find(x=>x.kind==='top'&&x.ref.top<=slotRect.top&&x.ref.bottom>=slotRect.bottom);if(top&&top!==rail)await jumpTo(top);
  await walkTo(clampX(rail,slotRect.left+slotRect.width/2-SIZE/2),rail.y);pos.face=1;sprite.dataset.face='right';
  sprite.dataset.anim='point';await wait(900);sprite.dataset.anim='shake';await wait(1000);sprite.dataset.anim='idle';}
 async function quirk(meta){
  const q=meta.quirkAnim||'wiggle';busy=true;
  try{
   switch(q){
    case 'pounce':case 'stalkpounce':case 'charge':{const dir=pos.x<(rail.x1+rail.x2)/2?1:-1;pos.face=dir;sprite.dataset.face=dir>0?'right':'left';sprite.dataset.anim=q==='charge'?'charge-prep':'stalk';await wait(q==='stalkpounce'?1100:700);
      await travel({x:clampX(rail,pos.x+dir*90),y:pos.y,arc:q==='charge'?0:20,ms:q==='charge'?300:380,anim:q==='charge'?'charge':'jump',ease:false});sprite.dataset.anim=q==='charge'?'skid':'land';await wait(500);break;}
    case 'bellyslide':{const dir=pos.x<(rail.x1+rail.x2)/2?1:-1;pos.face=dir;sprite.dataset.face=dir>0?'right':'left';sprite.dataset.anim='crouch';await wait(150);await travel({x:clampX(rail,pos.x+dir*120),y:pos.y,ms:1100,anim:'bellyslide'});await wait(300);break;}
    case 'tumble':{const dir=pos.x<(rail.x1+rail.x2)/2?1:-1;await travel({x:clampX(rail,pos.x+dir*70),y:pos.y,ms:900,anim:'tumble'});break;}
    case 'phase':{sprite.dataset.anim='phase';const back=rails().find(r=>r.kind==='behind'&&r.i===rail.i);await wait(500);if(back){await travel({x:pos.x,y:back.y,ms:700,anim:'phase',swapLayer:'back'});await wait(600);const top=rails().find(r=>r.kind==='top'&&r.i===back.i);await travel({x:pos.x,y:top.y,ms:700,anim:'phase',swapLayer:'front'});}await wait(300);break;}
    case 'airgallop':{await travel({x:pos.x,y:pos.y-30,ms:500,anim:'fly'});await travel({x:clampX(rail,pos.x+(pos.face>0?90:-90)),y:pos.y,ms:900,anim:'gallop'});await travel({x:pos.x,y:pos.y+30,ms:500,anim:'fly'});break;}
    case 'smokevanish':{sprite.dataset.anim='smokevanish';await wait(600);const nx=rail.x1+Math.random()*(rail.x2-rail.x1);place(nx,pos.y);sprite.dataset.anim='smokeappear';await wait(700);break;}
    case 'spinstop':{sprite.dataset.anim='spinstop';await wait(2200);break;}
    case 'layegg':{sprite.dataset.anim='layegg';await wait(1600);await dropGift(true);break;}
    default:{sprite.dataset.anim='quirk-'+q;await wait(q==='headspin'||q==='flameburst'||q==='reboot'?2200:1700);}
   }
  }finally{sprite.dataset.anim='idle';busy=false;}
 }
 async function sleep(){sleeping=true;sprite.dataset.anim='sleep';const bub=setInterval(()=>{if(!sleeping){clearInterval(bub);return;}fx('bubble',2400);},1200);sprite._bub=bub;}
 function wake(){if(!sleeping)return;sleeping=false;clearInterval(sprite._bub);sprite.dataset.anim='stretch';setTimeout(()=>{if(sprite.dataset.anim==='stretch')sprite.dataset.anim='idle';},900);}

 // ---------- gifts ----------
 const GIFT_ART=new Map();
 function giftArt(meta){if(GIFT_ART.has(meta.id))return GIFT_ART.get(meta.id);const el=[...byId.values()].find(i=>i.name.toLowerCase()===meta.gift.toLowerCase());const html=el?staticArt(el):'<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="26" fill="#f1c76b" stroke="#657D89" stroke-width="4"/></svg>';GIFT_ART.set(meta.id,html);return html;}
 function scheduleGift(){clearTimeout(giftTimer);const [a,b]=GIFT_INTERVAL_MS;giftTimer=setTimeout(()=>dropGift(false),a+Math.random()*(b-a));}
 async function dropGift(fromQuirk){const meta=activeMeta();if(!meta||document.hidden||sleeping){scheduleGift();return;}
  if(layerFront.querySelectorAll('.companion-gift').length>=3){scheduleGift();return;}
  if(!fromQuirk){busy=true;sprite.dataset.anim=meta.quirkAnim==='layegg'?'layegg':'gift';await wait(meta.quirkAnim==='layegg'?1500:900);}
  const g=document.createElement('button');g.type='button';g.className='companion-gift';g.setAttribute('aria-label','Tap to collect the '+meta.gift);g.innerHTML=giftArt(meta);
  g.style.setProperty('--x',(pos.x+(pos.face>0?-24:SIZE-10))+'px');g.style.setProperty('--y',(pos.y+SIZE-32)+'px');
  g.onclick=()=>{g.classList.add('is-taken');setTimeout(()=>g.remove(),420);const p=pet(meta.id);p.gifts++;p.mood=Math.min(100,p.mood+6);const r=gainStat(p,meta,'stamina',10);save();fx('hearts',1300);showStatWindow(meta,[{stat:'stamina',amount:10,...r}],1800);refreshViews();};
  layerFront.append(g);if(!fromQuirk){sprite.dataset.anim='idle';busy=false;}scheduleGift();}

 // ---------- feeding: the companion grabs the element, chews for a few seconds, and a floating
 // stat window shows the bars filling (level-ups flash), like feeding a Chao.
 function likes(meta,item){const fam=familyFor(item);if(fam===meta.family)return 'love';if(meta.family==='games'&&['life','nature','food'].includes(item.category))return 'no';if(['nature','prehistoric'].includes(meta.family)&&['technology','brand','console','portable','computer'].includes(item.category))return 'no';if(meta.family==='anime'&&['material','science'].includes(item.category))return 'no';return 'ok';}
 function feedPlan(meta,item){const fam=familyFor(item);const [main,second]=FAMILY_FEEDS[fam]||['stamina','hp'];const own=fam===meta.family;const mult=isShiny(item.id)?2:1;return own?[{stat:main,amount:40*mult},{stat:second,amount:16*mult}]:[{stat:main,amount:24*mult},{stat:second,amount:10*mult}];}
 let statWin=null,statWinTimer=null;
 function fmtBar(st){const seg=10;return `<span class="cs-bar"><i class="cs-bar-prog" style="width:${st.bar}%"></i></span><span class="cs-lvbar">${Array.from({length:seg},(_,i)=>`<i class="${i<Math.floor(st.level/seg)?'on':i===Math.floor(st.level/seg)&&st.level%seg?'half':''}"></i>`).join('')}</span>`;}
 function statRow(stat,st,g){return `<div class="cs-row" data-stat="${stat}"><span class="cs-name">${STAT_LABEL[stat]}</span><span class="cs-points" data-points="${st.points}">${String(st.points).padStart(4,'0')}</span><span class="cs-lv">Lv.<b>${String(st.level).padStart(2,'0')}</b></span><span class="cs-grade" data-grade="${GRADES[g]}">${GRADES[g]}</span>${fmtBar(st)}</div>`;}
 /** Animated floating window: rows for the touched stats, bars filling from the previous value. */
 function showStatWindow(meta,changes,hold=2600){
  if(!layerFront)return;const p=pet(meta.id),grades=companionGrades(meta,isShiny(meta.id));
  if(!statWin){statWin=document.createElement('div');statWin.className='companion-statwin';layerFront.append(statWin);}
  clearTimeout(statWinTimer);
  const rows=changes.filter((c,i,arr)=>arr.findIndex(x=>x.stat===c.stat)===i);
  statWin.innerHTML=`<div class="cs-head"><span class="cs-face">${sprites[meta.id]||''}</span><strong>${escapeText(uiName(byId.get(meta.id))||meta.name)}</strong></div>`+rows.map(c=>{const st=p.stats[c.stat];
   // show the state BEFORE the gain, then animate to the new values
   const beforeLevel=st.level-c.levelUps,beforePts=st.points-c.pointsGained;let beforeBar=st.bar-c.amount;while(beforeBar<0)beforeBar+=100;if(c.levelUps&&st.level>=COMPANION_MAX_LEVEL)beforeBar=Math.max(0,100-c.amount%100);
   return statRow(c.stat,{level:beforeLevel,bar:Math.max(0,Math.min(99,beforeBar)),points:beforePts},grades[c.stat]);}).join('');
  statWin.hidden=false;const h=statWin.offsetHeight||140;const left=Math.max(6,Math.min(window.innerWidth-226,pos.x+(pos.face>0?SIZE+8:-228))),top=Math.max(6,Math.min(window.innerHeight-h-70,pos.y-20));
  statWin.style.setProperty('--x',left+'px');statWin.style.setProperty('--y',top+'px');statWin.classList.remove('is-out');void statWin.offsetWidth;statWin.classList.add('is-in');
  // animate each row: bar fills (wrapping on level-up), points count up, level flips with a flash
  rows.forEach((c,i)=>{const row=statWin.querySelector(`[data-stat="${c.stat}"]`);const st=p.stats[c.stat];const prog=row.querySelector('.cs-bar-prog'),pts=row.querySelector('.cs-points'),lv=row.querySelector('.cs-lv b');
   const startBar=parseFloat(prog.style.width)||0,startPts=st.points-c.pointsGained,startLv=st.level-c.levelUps;
   const total=startBar+c.amount,dur=900+Math.min(1400,c.amount*12);const t0=performance.now()+250+i*180;
   const stepFn=now=>{const k=Math.max(0,Math.min(1,(now-t0)/dur));const e=1-Math.pow(1-k,3);const v=startBar+(total-startBar)*e;const ups=Math.min(c.levelUps,Math.floor(v/100));
    prog.style.width=(st.level>=COMPANION_MAX_LEVEL&&k===1?0:v%100).toFixed(1)+'%';
    const curLv=startLv+ups;if(Number(lv.textContent)!==curLv){lv.textContent=String(curLv).padStart(2,'0');row.classList.remove('is-levelup');void row.offsetWidth;row.classList.add('is-levelup');row.querySelector('.cs-lvbar').innerHTML=fmtBar({level:curLv,bar:0}).match(/<span class="cs-lvbar">(.*)<\/span>$/)[1];}
    const curPts=ups>=c.levelUps?st.points:startPts+Math.round(c.pointsGained*(ups/Math.max(1,c.levelUps)));pts.textContent=String(curPts).padStart(4,'0');
    if(k<1)requestAnimationFrame(stepFn);};
   requestAnimationFrame(stepFn);});
  statWinTimer=setTimeout(()=>{statWin.classList.remove('is-in');statWin.classList.add('is-out');setTimeout(()=>{if(statWin)statWin.hidden=true;},400);},hold+rows.length*300+1800);
 }
 function morsel(item,cls=''){const m=fx('morsel '+cls,900);m.innerHTML=staticArt(item);return m;}
 async function eatSequence(meta,item,{self=false}={}){
  const p=pet(meta.id);settleMood(p);
  const taste=likes(meta,item);
  if(taste==='no'){morsel(item,'is-refused');sprite.dataset.anim='refuse';p.mood=Math.max(0,p.mood-3);p.moodAt=now();save();await wait(1400);sprite.dataset.anim='idle';refreshViews();return true;}
  const last=p.fed[item.id]||0,fresh=now()-last>FEED_COOLDOWN_MS;
  // grab: the element flies into the hands and stays there while chewing
  const held=fx('held',3600);held.innerHTML=staticArt(item);sprite.dataset.anim='grab';await wait(450);
  sprite.dataset.anim='hold-eat';
  const plan=fresh?feedPlan(meta,item):[];
  const changes=plan.map(c=>({...c,...gainStat(p,meta,c.stat,c.amount)}));
  p.mood=Math.min(100,p.mood+(taste==='love'?12:5));p.moodAt=now();if(fresh)p.fed[item.id]=now();p.meals++;save();
  if(changes.length)showStatWindow(meta,changes,2800);
  for(let i=0;i<4;i++){await wait(650);held.classList.add('bite-'+(i+1));}
  await wait(500);held.remove();
  if(taste==='love')fx('hearts',1300);
  const ups=changes.reduce((n,c)=>n+c.levelUps,0);
  if(ups){sprite.dataset.anim='levelup';fx('stars',2000);await wait(1800);}
  sprite.dataset.anim='idle';refreshViews();return true;
 }
 async function feed(elementId){
  const meta=activeMeta(),item=byId.get(elementId);if(!meta||!item)return false;
  if(cancelMove)cancelMove();busy=true;
  try{return await eatSequence(meta,item);}finally{busy=false;}
 }
 // The companion goes to the element list by itself and helps itself to a chip.
 let selfFeedTimer=null;
 function scheduleSelfFeed(){clearTimeout(selfFeedTimer);const [a,b]=SELF_FEED_INTERVAL_MS;selfFeedTimer=setTimeout(selfFeed,a+Math.random()*(b-a));}
 async function selfFeed(){
  const meta=activeMeta();if(!meta||document.hidden||sleeping||busy){scheduleSelfFeed();return;}
  const chips=[...document.querySelectorAll('#viewPlay:not([hidden]) .element-chip')].filter(c=>{const r=c.getBoundingClientRect();return r.top>80&&r.bottom<window.innerHeight-70;});
  if(!chips.length){scheduleSelfFeed();return;}
  const chip=chips[Math.floor(Math.random()*chips.length)],item=byId.get(chip.dataset.id);if(!item){scheduleSelfFeed();return;}
  busy=true;
  try{
   const r=chip.getBoundingClientRect();const tx=Math.max(4,Math.min(window.innerWidth-SIZE-4,r.left+r.width/2-SIZE/2)),ty=r.top-SIZE+10;
   setLayer('front');const dy=ty-pos.y;await travel({x:tx,y:ty,arc:Math.max(30,Math.abs(dy)*0.3+20),ms:520+Math.abs(dy)*0.8,anim:'jump'});sprite.dataset.anim='land';await wait(160);
   // the chip art lifts out of the list into the companion's hands
   const art=chip.querySelector('.chip-art');if(art){art.classList.add('is-lifted');setTimeout(()=>art.classList.remove('is-lifted'),4000);}
   sprite.dataset.anim='sniff';await wait(700);
   await eatSequence(meta,item,{self:true});
   const top=pickRail();if(top)await jumpTo(top,pos.x);
  }catch(e){console.warn('self feed',e);sprite.dataset.anim='idle';}
  finally{busy=false;scheduleSelfFeed();}
 }
 function hitTest(x,y){if(!sprite||!activeMeta())return false;const r=sprite.getBoundingClientRect();return x>=r.left-14&&x<=r.right+14&&y>=r.top-14&&y<=r.bottom+14;}

 // ---------- lifecycle ----------
 function start(){ensureLayer();if(cancelMove)cancelMove();busy=false;sleeping=false;const meta=activeMeta();if(!meta){stop();return;}setArt(meta);sprite.hidden=false;layerFront.hidden=false;layerBack.hidden=false;settleMood(pet(meta.id));sprite.dataset.mood=moodLabel(pet(meta.id).mood).toLowerCase();
  const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}
  clearTimeout(timer);clearInterval(blinkTimer);
  if(reducedMotion()){sprite.dataset.anim='idle';sprite.classList.add('is-static');return;}
  blinkTimer=setInterval(()=>{if(!sleeping&&sprite.dataset.anim==='idle'){sprite.classList.add('is-blinking');setTimeout(()=>sprite.classList.remove('is-blinking'),170);}},3000+Math.random()*1800);
  timer=setTimeout(loop,700);scheduleGift();scheduleSelfFeed();}
 function stop(){clearTimeout(timer);clearTimeout(giftTimer);clearTimeout(selfFeedTimer);if(statWin)statWin.hidden=true;clearInterval(blinkTimer);if(cancelMove)cancelMove();if(sprite){sprite.hidden=true;}if(layerFront)layerFront.querySelectorAll('.companion-gift').forEach(g=>g.remove());}
 function setActive(id){if(id&&!isDiscovered(id))return false;state.active=id||null;save();if(state.active){pet(state.active);start();}else stop();refreshViews();return true;}
 function onDiscovery(id){if(metaById.has(id)&&!state.pets[id]){pet(id);save();toast('New companion: '+uiName(byId.get(id))+' · see the Companions tab','new');}if(state.active&&sprite&&!sprite.hidden){const p=pet(state.active),m=activeMeta();if(m){gainStat(p,m,'hp',4);save();}}}

 // ---------- views ----------
 const listeners=new Set();function refreshViews(){for(const fn of listeners)try{fn();}catch(e){console.warn(e);}}
 function statPanel(meta,p){const g=companionGrades(meta,isShiny(meta.id));return `<div class="cs-panel">${COMPANION_STATS.map(k=>statRow(k,p.stats[k],g[k])).join('')}</div>`;}
 function cardHtml(meta,{full=false}={}){
  const have=isDiscovered(meta.id),p=have?pet(meta.id):null,sh=isShiny(meta.id);
  const el=byId.get(meta.id),name=uiName(el)||meta.name;
  const tl=have?totalLevel(meta.id):0;
  return `<article class="pet-card ${have?'is-unlocked':'is-locked'} ${state.active===meta.id?'is-active':''} ${sh?'is-shiny':''}" data-pet="${meta.id}">
   <div class="pet-preview" aria-hidden="true">${have?(sprites[meta.id]||staticArt(el)):'<span class="pet-silhouette">'+staticArt(el)+'</span>'}</div>
   <div class="pet-main">
    <strong>${have?(sh?'✦ ':'')+escapeText(name):'???'}</strong>
    <small>${have?`Total Lv ${tl} · ${moodLabel(p.mood)}`:'Discover '+escapeText(name)+' to unlock'}</small>
    ${have&&!full?`<span class="pet-mini">${COMPANION_STATS.map(k=>`<i title="${STAT_LABEL[k]} ${p.stats[k].points}"><b style="height:${Math.max(6,100*p.stats[k].points/STAT_MAX_POINTS)}%"></b></i>`).join('')}</span>`:''}
    ${have&&full?statPanel(meta,p)+`<p class="pet-quirk">${escapeText(meta.quirk)}. Gift: ${escapeText(meta.gift)}.</p>`:''}
   </div>
   ${have?`<button type="button" class="pet-activate" data-activate="${meta.id}" aria-pressed="${state.active===meta.id}">${state.active===meta.id?'Active':'Choose'}</button>`:''}
  </article>`;
 }
 function renderTab(){
  const root=$('viewPets');if(!root)return;
  const act=activeMeta();const have=unlocked().length;
  const groups=FAMILIES.map(f=>({f,list:roster.filter(c=>c.family===f.id)})).filter(g=>g.list.length);
  root.innerHTML=`<div class="pets-scroll"><div class="section-head"><h2>Companions</h2><p>${have} of ${roster.length} unlocked · a companion lives on your screen and eats elements to raise six stats, each up to Lv.${COMPANION_MAX_LEVEL}.</p></div>
   <section class="pets-hero">${act?cardHtml(act,{full:true}):`<div class="pets-empty"><strong>No companion active</strong><small>Discover one of the ${roster.length} companion elements (five per family) and tap Choose.</small></div>`}
   ${act?`<button type="button" class="pet-dismiss" id="petDismiss">Send home</button>`:''}</section>
   ${groups.map(g=>`<h3 class="pets-family">${escapeText(g.f.name)}</h3><div class="pets-grid">${g.list.map(c=>cardHtml(c)).join('')}</div>`).join('')}
   <section class="pets-help"><h3>How companions work</h3><ul>
    <li><strong>Unlock:</strong> discover the element in Classic or in its family campaign.</li>
    <li><strong>On screen:</strong> it walks along the cards, hops, climbs, knocks on the glass, passes behind the frames, and points at a locked ingredient that has no combination left.</li>
    <li><strong>Gifts:</strong> every few minutes it leaves its gift (the Stegosaurus lays an egg). Tap it: a little Stamina and a happier companion.</li>
    <li><strong>Feeding:</strong> drag any element from your list onto the companion, or wait: now and then it hops into your list and helps itself. It grabs the element, chews for a few seconds, and a floating window shows which stats grow. Each element feeds it once per 30 minutes; a few are refused.</li>
    <li><strong>Which stats grow:</strong> the element's family decides, like coloured drives: Games → Run; Anime, Music &amp; Cinema → Power; Nature → Swim; Fantasy → Fly; People → Stamina &amp; HP; Mythology → Power &amp; Fly; Prehistory → Power &amp; HP; Countries → Run &amp; Swim. Its own family counts almost double; a Shiny element counts double.</li>
    <li><strong>Six stats, each with its own level:</strong> HP, Stamina, Run, Power, Swim, Fly — Lv.0 to Lv.${COMPANION_MAX_LEVEL}. The pink bar fills to the next level; the blue notched bar is the level. Every companion has a grade E–S per stat (its signature stat is S): a level-up gives grade×3+13 ±2 points, so an S stat can reach ${STAT_MAX_POINTS}. A Shiny companion has every grade one step higher.</li>
    <li><strong>Mood:</strong> fades slowly over time; a sad companion moves slower. Feeding, gifts and new discoveries cheer it up. A high Run stat makes it move faster on screen.</li>
   </ul><h3>Coming next: companion mini-games</h3><p>Each companion will unlock a different mini-game that it plays on its own (racing, climbing, swimming, digging, flying…). You only tap the screen for a boost, which spends Stamina; Run, Power, Swim, Fly and HP decide how it performs. The goal: a gold medal in every mini-game. Level up your companions now to be ready.</p></section></div>`;
  root.querySelectorAll('[data-activate]').forEach(b=>b.onclick=()=>{setActive(state.active===b.dataset.activate?null:b.dataset.activate);});
  const d=$('petDismiss');if(d)d.onclick=()=>setActive(null);
 }
 function openCard(id){const meta=metaById.get(id);if(!meta)return;showModal(`<div class="modal-tag">COMPANION</div>${cardHtml(meta,{full:true})}<p class="mini-muted">Drag an element from your list onto ${escapeText(uiName(byId.get(meta.id)))} to feed it. Tap its gifts when they appear.</p><button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);$('petCardClose').onclick=closeModal;$('modalContent').querySelectorAll('[data-activate]').forEach(b=>b.onclick=()=>{setActive(state.active===b.dataset.activate?null:b.dataset.activate);closeModal();});}
 listeners.add(renderTab);
 return {start,stop,setActive,feed,hitTest,onDiscovery,renderTab,openCard,get active(){return activeMeta();},state:()=>state,unlocked,refreshViews,
  onViewChange(){if(activeMeta()&&sprite&&!sprite.hidden)setTimeout(()=>{if(cancelMove)cancelMove();const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);sprite.dataset.anim='idle';}},80);},
  importState(raw){if(raw&&raw.pets){state={active:raw.active||null,pets:raw.pets,v:1};save();}},grades:companionGrades};
}
