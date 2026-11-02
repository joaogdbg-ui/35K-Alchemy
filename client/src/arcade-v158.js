/* V158: Arcade minigames. One new minigame unlocks for every 250 new elements found in Alchemy
 * (the first one straight away). After all 16 planned minigames are unlocked, every 250 elements pays coins.
 * School levels and stats help in the matching minigames. No imports: everything comes through ctx. */
export const ARCADE_KEY='alchemy10k_arcade_v158';
export const ARCADE_STEP=250,ARCADE_TOTAL=16,ARCADE_STEP_COINS=500;
/** Implemented minigames (more arrive in later updates up to ARCADE_TOTAL). help = School subject or stat that helps. */
export const ARCADE_GAMES=[
 {id:'memory',name:'Element Memory',icon:'🃏',desc:'Match pairs of your elements while your companion shuffles them.',help:{skill:'draw',label:'Drawing: longer peek, fewer shuffles'}},
 {id:'duel',name:'Fire · Water · Earth',icon:'🔥',desc:'Water beats Fire, Fire beats Earth, Earth beats Water. Tap the winner!',help:{skill:'juggle',label:'Juggling: more time per card'}},
 {id:'recipe',name:'Recipe Rush',icon:'⚗️',desc:'Which two elements make this one? Five seconds per question.',help:{skill:'magic',label:'Magic: more time, wrong answers fade'}},
 {id:'catch',name:'Falling Finds',icon:'🧺',desc:'Drag your companion to catch falling elements and dodge the rocks.',help:{stat:'run',skill:'dance',label:'Run: faster · Dancing: wider catch'}},
 {id:'fish',name:'Pond Fishing',icon:'🎣',desc:'Cast, wait for the splash and pull at the right moment.',help:{stat:'swim',skill:'drums',label:'Drums & Swim: wider timing window'}},
 {id:'glide',name:'Sky Glide',icon:'🪽',desc:'Tap to flap, glide between the clouds and grab elements.',help:{stat:'fly',label:'Fly: stronger flaps, softer fall'}}];
/** Pure: what the save looks like after `count` discoveries. */
export function arcadeProgress(st,count,ids=ARCADE_GAMES.map(g=>g.id),rnd=Math.random){
 const s={base:st?.base??count,unlocked:Array.isArray(st?.unlocked)?st.unlocked.filter(i=>ids.includes(i)):[],paid:st?.paid||0,best:st?.best||{}};
 const steps=Math.max(0,Math.floor((count-s.base)/ARCADE_STEP));const want=1+steps;const fresh=[];let coins=0;
 while(s.unlocked.length<Math.min(want,ARCADE_TOTAL)){const left=ids.filter(i=>!s.unlocked.includes(i));if(!left.length)break;const id=left[Math.floor(rnd()*left.length)];s.unlocked.push(id);fresh.push(id);}
 // after all 16 minigames exist and are unlocked, each further step pays coins once
 if(s.unlocked.length>=ARCADE_TOTAL){const extra=Math.max(0,want-ARCADE_TOTAL);if(extra>s.paid){coins=(extra-s.paid)*ARCADE_STEP_COINS;s.paid=extra;}}
 const next=s.base+(s.unlocked.length+s.paid)*ARCADE_STEP;
 return {state:s,fresh,coins,next};}

export function createArcade(ctx){
 const {$,escapeText,showModal,closeModal,toast,staticArt,itemName}=ctx;
 const sfx=new Proxy(ctx.sfx||{},{get:(t,k)=>t[k]||(()=>{})});
 let st=null;try{st=JSON.parse(localStorage.getItem(ARCADE_KEY)||'null');}catch{}
 const save=()=>{try{localStorage.setItem(ARCADE_KEY,JSON.stringify(st));}catch{}};
 function sync(){const p=arcadeProgress(st,ctx.count());st=p.state;save();
  for(const id of p.fresh){const g=ARCADE_GAMES.find(x=>x.id===id);if(g&&st.unlocked.length>1)toast(`New minigame unlocked: ${g.name}!`,'new');}
  if(p.coins){ctx.addCoins?.(p.coins);toast(`+${p.coins} coins · ${ARCADE_STEP} more elements found`,'new');}
  return p;}
 const lvl=(skill)=>{const id=ctx.activeId?.();return id&&skill?(ctx.skillLevel?.(id,skill)||0):0;};
 const stat=(k)=>{const id=ctx.activeId?.();return id&&k?(ctx.statLevel?.(id,k)||0):0;};
 const pick=(arr,n)=>{const a=[...arr];const out=[];while(out.length<n&&a.length)out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);return out;};
 const art=id=>staticArt(ctx.item(id))||'';
 // ---------- hub sheet ----------
 function open(back){const p=sync();const got=st.unlocked.length;
  const tiles=ARCADE_GAMES.map(g=>{const on=st.unlocked.includes(g.id),best=st.best[g.id];return `<button type="button" class="st-shop-btn ar-tile ${on?'':'is-locked'}" data-ar="${g.id}" ${on?'':'disabled'}><span>${on?g.icon:'🔒'}</span><b>${on?escapeText(g.name):'???'}</b><small>${on?(best?`Best ${best}`:'New!'):'Locked'}</small></button>`;}).join('');
  const soon=ARCADE_TOTAL-ARCADE_GAMES.length;
  showModal(`<div class="modal-tag">MINIGAMES</div><h2>${got}/${ARCADE_TOTAL} unlocked</h2><p class="mini-muted">A new minigame unlocks every ${ARCADE_STEP} new elements found in Alchemy · next at <b>${p.next.toLocaleString('en-US')}</b> (you have ${ctx.count().toLocaleString('en-US')}).${soon>0?` ${soon} more minigames are coming in updates.`:''} Once all ${ARCADE_TOTAL} are open, every ${ARCADE_STEP} elements gives 🪙${ARCADE_STEP_COINS}.</p>
   <div class="st-shop is-hub ar-grid">${tiles}</div><button type="button" class="modal-button secondary" id="arClose">${back?'Back':'Close'}</button>`);
  $('arClose').onclick=()=>back?back():closeModal();
  document.querySelectorAll('[data-ar]').forEach(b=>b.onclick=()=>intro(b.dataset.ar,back));}
 function intro(id,back){const g=ARCADE_GAMES.find(x=>x.id===id);const h=g.help;const sk=h.skill?lvl(h.skill):0,sv=h.stat?stat(h.stat):0;
  showModal(`<div class="modal-tag">MINIGAME</div><div class="ar-big">${g.icon}</div><h2>${escapeText(g.name)}</h2><p>${escapeText(g.desc)}</p><p class="ar-help">✦ ${escapeText(h.label)}${sk?` · your level ${sk}`:''}${sv?` · stat Lv ${sv}`:''}</p>${st.best[id]?`<p class="mini-muted">Best score: <b>${st.best[id]}</b></p>`:''}
   <button type="button" class="modal-button" id="arPlay">Play</button><button type="button" class="modal-button secondary" id="arBack">Back</button>`);
  $('arBack').onclick=()=>open(back);$('arPlay').onclick=()=>{closeModal();GAMES[id]();};}
 // ---------- shared stage ----------
 function stage(title){const s=document.createElement('div');s.className='ar-stage';s.innerHTML=`<div class="ar-top"><strong>${escapeText(title)}</strong><span class="ar-score">0</span><span class="ar-time"></span><button type="button" class="g-quit" aria-label="Quit">✕</button></div><div class="ar-body"></div><div class="ar-hint"></div>`;document.body.append(s);
  const o={el:s,body:s.querySelector('.ar-body'),score:0,over:false,timers:[],
   set(v){o.score=Math.max(0,Math.round(v));s.querySelector('.ar-score').textContent=o.score;},add(v){o.set(o.score+v);},
   time(t){s.querySelector('.ar-time').textContent=t>=0?`⏱ ${Math.ceil(t)}`:'';},hint(t){s.querySelector('.ar-hint').textContent=t||'';},
   later(fn,ms){const t=setTimeout(()=>{if(!o.over)fn();},ms);o.timers.push(t);return t;},
   end:null};
  s.querySelector('.g-quit').onclick=()=>o.finish(true);
  o.finish=(quit=false)=>{if(o.over)return;o.over=true;o.timers.forEach(clearTimeout);cancelAnimationFrame(o.raf);o.end?.();s.remove();if(!quit)setTimeout(()=>result(o.id,o.score,o.statKey),450);};
  return o;}
 function result(id,score,statKey){const g=ARCADE_GAMES.find(x=>x.id===id);const prev=st.best[id]||0;const rec=score>prev;if(rec){st.best[id]=score;save();}
  const coins=Math.min(300,Math.round(score/20));if(coins)ctx.addCoins?.(coins);if(statKey&&score>0)ctx.train?.(statKey,Math.min(12,1+Math.round(score/150)));sfx.prize();
  showModal(`<div class="modal-tag">MINIGAME</div><div class="ar-big">${g.icon}</div><h2>${score.toLocaleString('en-US')} points</h2><p>${rec?'<b>New best!</b>':`Best: ${prev.toLocaleString('en-US')}`}</p><p class="ar-help">🪙 +${coins} coins${statKey&&score>0?` · ${({run:'Run',swim:'Swim',fly:'Fly',power:'Power',stamina:'Stamina'})[statKey]} training`:''}</p>
   <button type="button" class="modal-button" id="arAgain">Play again</button><button type="button" class="modal-button secondary" id="arDone">Back to minigames</button>`);
  $('arAgain').onclick=()=>{closeModal();GAMES[id]();};$('arDone').onclick=()=>open();}
 const timer=(o,secs,done)=>{let t=secs;o.time(t);const tick=()=>{t-=0.25;o.time(t);if(t<=0){done();return;}o.later(tick,250);};o.later(tick,250);};
 const mySprite=()=>ctx.sprite?.(ctx.activeId?.())||'';
 // ---------- 1. Element Memory ----------
 function memory(){const o=stage('Element Memory');o.id='memory';const d=lvl('draw');const ids=pick(ctx.unlocked(),6);if(ids.length<6){o.finish(true);toast('Find a few more elements first','repeat');return;}
  const cards=pick([...ids,...ids],12);o.body.innerHTML=`<div class="ar-mem-cmp companion">${mySprite()}</div><div class="ar-mem">${cards.map((id,i)=>`<button type="button" class="ar-card is-up" data-i="${i}" data-id="${id}"><span class="ar-face">${art(id)}</span><span class="ar-back">?</span></button>`).join('')}</div>`;
  ctx.wear?.(o.body);const grid=o.body.querySelector('.ar-mem');let open=[],lock=true,pairs=0;
  o.hint('Remember them!');o.later(()=>{grid.querySelectorAll('.ar-card').forEach(c=>c.classList.remove('is-up'));lock=false;o.hint('Find the pairs');},1200+d*500);
  const shuffle=()=>{const left=[...grid.querySelectorAll('.ar-card:not(.is-done)')];if(left.length>3&&!lock){o.body.querySelector('.ar-mem-cmp').classList.add('is-shuffle');const nodes=pick(left,left.length);nodes.forEach(n=>grid.append(n));sfx.swish?.();o.hint('Shuffled!');o.later(()=>o.body.querySelector('.ar-mem-cmp')?.classList.remove('is-shuffle'),600);}o.later(shuffle,(14+d*5)*1000);};
  o.later(shuffle,(14+d*5)*1000);
  grid.onclick=e=>{const c=e.target.closest('.ar-card');if(!c||lock||c.classList.contains('is-up'))return;c.classList.add('is-up');open.push(c);sfx.tap?.();
   if(open.length===2){lock=true;const [a,b]=open;if(a.dataset.id===b.dataset.id){a.classList.add('is-done');b.classList.add('is-done');pairs++;o.add(100);sfx.unlock?.();open=[];lock=false;if(pairs===6){o.add(Math.round(left*5));o.finish();}}
    else o.later(()=>{a.classList.remove('is-up');b.classList.remove('is-up');open=[];lock=false;},700);}};
  let left=60;timer(o,60,()=>o.finish());const lt=setInterval(()=>{left-=1;if(o.over)clearInterval(lt);},1000);}
 // ---------- 2. Fire · Water · Earth ----------
 function duel(){const o=stage('Fire · Water · Earth');o.id='duel';const j=lvl('juggle');const T=['fire','water','earth'],BEATS={water:'fire',fire:'earth',earth:'water'};const ICON={fire:'🔥',water:'💧',earth:'🪨'};
  o.body.innerHTML=`<div class="ar-duel"><div class="ar-foe"><span class="ar-foe-card"></span><i class="ar-bar"><em></em></i></div><div class="ar-me companion">${mySprite()}</div><div class="ar-hand">${T.map(t=>`<button type="button" class="ar-pick" data-t="${t}">${ICON[t]}<small>${t}</small></button>`).join('')}</div></div>`;ctx.wear?.(o.body);
  const foe=o.body.querySelector('.ar-foe-card'),bar=o.body.querySelector('.ar-bar em');let cur=null,deadline=0;const win=Math.max(0.9,1.8-0.1*(o.score/200))+j*0.2;
  const next=()=>{cur=T[Math.floor(Math.random()*3)];foe.textContent=ICON[cur];foe.className='ar-foe-card is-in';deadline=performance.now()+win*1000;};
  const loop=t=>{if(o.over)return;const k=Math.max(0,(deadline-t)/(win*1000));bar.style.width=(k*100)+'%';if(cur&&k<=0){o.add(-5);foe.className='ar-foe-card is-miss';sfx.miss?.();cur=null;o.later(next,300);}o.raf=requestAnimationFrame(loop);};
  o.body.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{if(!cur)return;const t=b.dataset.t;if(BEATS[t]===cur){o.add(10+Math.round(10*Math.max(0,(deadline-performance.now())/(win*1000))));foe.className='ar-foe-card is-win';sfx.kick?.();}else if(t===cur){foe.className='ar-foe-card is-tie';}else{o.add(-5);foe.className='ar-foe-card is-miss';sfx.miss?.();}cur=null;o.later(next,260);});
  next();o.raf=requestAnimationFrame(loop);timer(o,30,()=>o.finish());}
 // ---------- 3. Recipe Rush ----------
 function recipe(){const o=stage('Recipe Rush');o.id='recipe';const m=lvl('magic');const pool=ctx.knownRecipes();if(pool.length<6){o.finish(true);toast('Discover a few more recipes first','repeat');return;}
  let round=0;const N=10,secs=5+m*0.3;
  const ask=()=>{if(round>=N){o.finish();return;}round++;const [ra,rb,res]=pool[Math.floor(Math.random()*pool.length)];const wrong=pick(pool.filter(p=>p[2]!==res),3).map(p=>[p[0],p[1]]);const opts=pick([[ra,rb],...wrong],4);
   o.body.innerHTML=`<div class="ar-rec"><small>Question ${round}/${N}</small><div class="ar-rec-target">${art(res)}<b>${escapeText(itemName(res))}</b></div><i class="ar-bar"><em></em></i><div class="ar-rec-opts">${opts.map(([a,b],i)=>`<button type="button" class="ar-rec-opt" data-ok="${a===ra&&b===rb?1:0}"><span>${art(a)}</span>+<span>${art(b)}</span></button>`).join('')}</div></div>`;
   const bar=o.body.querySelector('.ar-bar em');const t0=performance.now();let done=false;
   if(m>=2){const bad=[...o.body.querySelectorAll('[data-ok="0"]')];o.later(()=>bad[0]?.classList.add('is-fade'),1500);if(m>=4)o.later(()=>bad[1]?.classList.add('is-fade'),2500);}
   const loop=t=>{if(o.over||done)return;const k=1-(t-t0)/(secs*1000);bar.style.width=Math.max(0,k*100)+'%';if(k<=0){done=true;o.body.querySelector('[data-ok="1"]').classList.add('is-ok');sfx.miss?.();o.later(ask,900);return;}o.raf=requestAnimationFrame(loop);};o.raf=requestAnimationFrame(loop);
   o.body.querySelectorAll('.ar-rec-opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=b.dataset.ok==='1';b.classList.add(ok?'is-ok':'is-bad');if(ok){o.add(100+Math.round(100*Math.max(0,1-(performance.now()-t0)/(secs*1000))));sfx.unlock?.();}else{o.body.querySelector('[data-ok="1"]').classList.add('is-ok');sfx.miss?.();}o.later(ask,700);});};
  o.time(-1);ask();}
 // ---------- 4. Falling Finds ----------
 function catcher(){const o=stage('Falling Finds');o.id='catch';o.statKey='run';const sp=1+stat('run')/99,wide=1+0.06*lvl('dance');const ids=pick(ctx.unlocked(),12);
  o.body.innerHTML=`<div class="ar-catch"><div class="ar-catcher companion" style="--w:${wide}">${mySprite()}</div></div>`;ctx.wear?.(o.body);const box=o.body.querySelector('.ar-catch'),me=o.body.querySelector('.ar-catcher');
  let W=box.clientWidth,H=box.clientHeight,x=W/2,tx=x,stun=0,items=[],spawn=0;
  box.addEventListener('pointerdown',e=>{tx=e.clientX-box.getBoundingClientRect().left;});box.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')tx=e.clientX-box.getBoundingClientRect().left;});
  let last=performance.now();const loop=t=>{if(o.over)return;const dt=Math.min(0.05,(t-last)/1000);last=t;W=box.clientWidth;H=box.clientHeight;
   if(stun<=0)x+=Math.sign(tx-x)*Math.min(Math.abs(tx-x),dt*360*sp);else stun-=dt;me.style.transform=`translate3d(${x-29*wide}px,0,0)`;me.classList.toggle('is-stun',stun>0);
   spawn-=dt;if(spawn<=0){spawn=0.55;const rock=Math.random()<0.22;const el=document.createElement('span');el.className='ar-fall'+(rock?' is-rock':'');el.innerHTML=rock?'🪨':art(ids[Math.floor(Math.random()*ids.length)]);box.append(el);items.push({el,x:20+Math.random()*(W-40),y:-30,v:120+Math.random()*80+o.score*0.15,rock});}
   for(const it of items){it.y+=it.v*dt;it.el.style.transform=`translate3d(${it.x-16}px,${it.y}px,0)`;
    const cy=H*0.88-58;if(!it.hit&&it.y>cy-20&&it.y<cy+40&&Math.abs(it.x-x)<30*wide){it.hit=true;it.el.remove();if(it.rock){o.add(-20);stun=0.8;sfx.miss?.();}else{o.add(10);sfx.tap?.();}}
    if(it.y>H+20){it.hit=true;it.el.remove();}}
   items=items.filter(i=>!i.hit);o.raf=requestAnimationFrame(loop);};o.raf=requestAnimationFrame(loop);o.hint('Drag to move');timer(o,40,()=>o.finish());}
 // ---------- 5. Pond Fishing ----------
 function fish(){const o=stage('Pond Fishing');o.id='fish';o.statKey='swim';const win=450+lvl('drums')*80+stat('swim')*2;const FISH=[['🐟',30],['🐠',50],['🐡',80],['🦑',120],['🐙',150],['👢',5]];
  o.body.innerHTML=`<div class="ar-pond"><div class="ar-fisher companion">${mySprite()}</div><i class="ar-line"></i><span class="ar-bob">🎈</span><span class="ar-catchfx"></span><button type="button" class="modal-button ar-act">Cast</button></div>`;ctx.wear?.(o.body);
  const btn=o.body.querySelector('.ar-act'),bob=o.body.querySelector('.ar-bob'),fx=o.body.querySelector('.ar-catchfx');let phase='idle',biteAt=0;
  btn.onclick=()=>{if(phase==='idle'){phase='wait';bob.className='ar-bob is-cast';btn.textContent='Wait…';const w=1000+Math.random()*3000;o.later(()=>{if(phase!=='wait')return;phase='bite';biteAt=performance.now();bob.className='ar-bob is-bite';btn.textContent='PULL!';sfx.tick?.();o.later(()=>{if(phase==='bite'){phase='idle';bob.className='ar-bob';btn.textContent='Cast';fx.textContent='Got away…';}},win);},w);}
   else if(phase==='wait'){phase='idle';bob.className='ar-bob';btn.textContent='Cast';fx.textContent='Too early!';}
   else if(phase==='bite'){phase='idle';const q=1-(performance.now()-biteAt)/win;const roll=Math.random()*(0.6+q*0.6);const f=roll>1.05?FISH[4]:roll>0.9?FISH[3]:roll>0.7?FISH[2]:roll>0.35?FISH[1]:roll>0.12?FISH[0]:FISH[5];o.add(f[1]);fx.textContent=`${f[0]} +${f[1]}`;bob.className='ar-bob';btn.textContent='Cast';sfx.unlock?.();}};
  timer(o,45,()=>o.finish());}
 // ---------- 6. Sky Glide ----------
 function glide(){const o=stage('Sky Glide');o.id='glide';o.statKey='fly';const f=stat('fly');const lift=300+f*2.2,grav=620-f*2.4;const ids=pick(ctx.unlocked(),8);
  o.body.innerHTML=`<div class="ar-sky"><div class="ar-glider companion">${mySprite()}</div></div>`;ctx.wear?.(o.body);const box=o.body.querySelector('.ar-sky'),me=o.body.querySelector('.ar-glider');
  let W=box.clientWidth,H=box.clientHeight,y=H/2,v=0,dist=0,obs=[],gap=0,alive=true,started=false;const flap=()=>{if(!started){started=true;o.hint('');}v=-lift;me.classList.remove('is-flap');void me.offsetWidth;me.classList.add('is-flap');sfx.tap?.();};
  box.addEventListener('pointerdown',flap);let last=performance.now();
  const loop=t=>{if(o.over)return;const dt=Math.min(0.04,(t-last)/1000);last=t;W=box.clientWidth;H=box.clientHeight;if(!started){me.style.transform=`translate3d(60px,${y}px,0)`;o.raf=requestAnimationFrame(loop);return;}v+=grav*dt;y+=v*dt;if(y<0){y=0;v=0;}if(y>H-50){alive=false;}
   me.style.transform=`translate3d(60px,${y}px,0) rotate(${Math.max(-25,Math.min(35,v/12))}deg)`;const speed=150+dist*0.02;dist+=speed*dt;o.set(dist/10+o.bonus);
   gap-=speed*dt;if(gap<=0){gap=230;const hole=110+Math.min(60,f),top=40+Math.random()*(H-hole-120);const el=document.createElement('div');el.className='ar-col';el.innerHTML=`<i style="height:${top}px"></i><i style="top:${top+hole}px"></i>`;box.append(el);
    const pk=document.createElement('span');pk.className='ar-fall';pk.innerHTML=art(ids[Math.floor(Math.random()*ids.length)]);box.append(pk);obs.push({el,pk,x:W+20,top,hole});}
   for(const ob of obs){ob.x-=speed*dt;ob.el.style.transform=`translate3d(${ob.x}px,0,0)`;if(ob.pk){ob.pk.style.transform=`translate3d(${ob.x+6}px,${ob.top+ob.hole/2-16}px,0)`;}
    if(ob.x<60+50&&ob.x+44>60+8){if(y+8<ob.top||y+44>ob.top+ob.hole)alive=false;else if(ob.pk){ob.pk.remove();ob.pk=null;o.bonus+=25;sfx.unlock?.();}}
    if(ob.x<-60){ob.el.remove();ob.pk?.remove();ob.gone=true;}}
   obs=obs.filter(b=>!b.gone);if(!alive){sfx.miss?.();o.finish();return;}o.raf=requestAnimationFrame(loop);};
  o.bonus=0;o.time(-1);o.hint('Tap to start · tap to flap');o.raf=requestAnimationFrame(loop);}
 const GAMES={memory,duel,recipe,catch:catcher,fish,glide};
 return {open,sync,state:()=>st,games:ARCADE_GAMES};
}
