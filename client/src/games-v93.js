/**
 * V93 Companion Games (owner request 31/10/2026), modelled on the Chao Garden mini-games:
 *  - RACES: obstacle courses where each section uses a different stat — Run on the ground,
 *    Swim in water, Fly over gaps, Power to climb walls — while Stamina drains (a tired racer
 *    stops to rest, like a Chao sitting down). Five courses focus on one stat each and a sixth
 *    tests everything; each has five levels (Rookie → Champion) unlocked by winning the previous.
 *  - SPARRING: a 1-on-1 ring (like Chao Karate): HP is health, Power hits harder, Run dodges,
 *    Stamina keeps the punches coming.
 * The companion plays on its own; the player only taps to cheer (a short boost / power strike)
 * which spends Stamina, so cheering at the right moment matters. Gold, silver and bronze medals
 * per level. Course and level names are original. No imports (inlined by build-standalone.py).
 */
export const GAMES_STORAGE_KEY='alchemy10k_games_v1';
export const LEVELS=['Rookie','Junior','Pro','Expert','Champion'];
export const LEVEL_POWER=[0,12,28,48,72];
export const LEVEL_EASE=[0.96,0.98,1,1,1.03];   // Rookie rivals are a little slower than a fresh companion  // average opponent stat level per difficulty
export const COURSES=[
 {id:'pond',name:'Pebble Pond',focus:'swim',blurb:'Lots of water: Swim decides it.',plan:['run','swim','run','swim','swim','run','swim','run']},
 {id:'cliffs',name:'Breezy Cliffs',focus:'fly',blurb:'Glide over the gaps: Fly decides it.',plan:['run','fly','run','fly','run','fly','fly','run']},
 {id:'meadow',name:'Meadow Dash',focus:'run',blurb:'A long sprint: Run decides it.',plan:['run','run','swim','run','run','climb','run','run']},
 {id:'boulder',name:'Boulder Wall',focus:'power',blurb:'Climb the rock walls: Power decides it.',plan:['run','climb','run','climb','run','climb','climb','run']},
 {id:'trail',name:'Long Trail',focus:'stamina',blurb:'Twice as long: Stamina decides it.',plan:['run','swim','run','climb','run','fly','run','swim','run','climb','run','run']},
 {id:'grand',name:'Grand Circuit',focus:'all',blurb:'Every kind of section: all stats count.',plan:['run','swim','fly','climb','run','swim','fly','climb','run'],locked:true}
];
const SEG_STAT={run:'run',swim:'swim',fly:'fly',climb:'power'};
const SEG_DRAIN={run:0.10,swim:0.14,climb:0.18,fly:0.05};
const SEG_ANIM={run:'walk',swim:'hopwalk',fly:'fly',climb:'climb'};
const SEG_LEN=90,UNIT_SPEED=80,PX=2.2;
/** Pure: speed multiplier from a stat level (0 → 0.55, 99 → 1.45). */
export const statSpeed=lv=>0.55+Math.max(0,Math.min(99,lv))/99*0.9;
/** Pure: stamina pool from the Stamina level. */
export const energyMax=lv=>60+Math.max(0,Math.min(99,lv))*1.6;
/** Pure: opponent stat levels for a course/level (focus stat higher), deterministic per seed. */
export function opponentStats(course,level,seed){
 let s=seed*9301+level*49297+course.id.length*233;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
 const base=LEVEL_POWER[level],out={};
 for(const k of ['hp','stamina','run','power','swim','fly']){let v=base*(0.7+rnd()*0.6);if(course.focus===k||(course.focus==='all'))v*=1.25;out[k]=Math.round(Math.max(0,Math.min(99,v)));}
 return out;
}
export function medalFor(place){return place===1?'gold':place===2?'silver':place===3?'bronze':null;}

export function createGamesSystem(ctx){
 const {$,escapeText,roster,sprites,byId,uiName,isDiscovered,companionInfo,onResult,showModal,closeModal,toast,reducedMotion,activeId}=ctx;
 let state={v:1,pick:null,races:{},spar:{}};
 try{const raw=JSON.parse(localStorage.getItem(GAMES_STORAGE_KEY)||'null');if(raw&&typeof raw==='object')state={v:1,pick:raw.pick||null,races:raw.races||{},spar:raw.spar||{}};}catch{}
 const save=()=>{try{localStorage.setItem(GAMES_STORAGE_KEY,JSON.stringify(state));}catch{}};
 const owned=()=>roster.filter(c=>isDiscovered(c.id));
 const pick=()=>{const o=owned();if(!o.length)return null;if(!o.some(c=>c.id===state.pick))state.pick=(activeId?.()&&o.some(c=>c.id===activeId()))?activeId():o[0].id;return state.pick;};
 const best=(bag,id,l)=>bag[id]?.[l]||0;   // best place (1..n), 0 = never raced
 const levelOpen=(bag,id,l)=>l===0||best(bag,id,l-1)===1;
 const courseOpen=c=>!c.locked||COURSES.filter(x=>!x.locked).every(x=>best(state.races,x.id,0)===1);
 function medalCounts(){const n={gold:0,silver:0,bronze:0};for(const bag of [state.races,state.spar])for(const lv of Object.values(bag))for(const p of Object.values(lv)){const m=medalFor(p);if(m)n[m]++;}return n;}
 const medalDot=p=>{const m=medalFor(p);return m?`<i class="g-medal is-${m}" aria-label="${m}"></i>`:p?'<i class="g-medal is-none" aria-label="finished"></i>':'<i class="g-medal is-empty" aria-hidden="true"></i>';};

 // ---------- hub ----------
 function render(mount){
  if(!mount)return;const pid=pick();const n=medalCounts();
  if(!pid){mount.innerHTML='<div class="pets-scroll"><div class="section-head"><h2>Games</h2><p>Discover a companion to play.</p></div></div>';return;}
  const info=companionInfo(pid);
  const chips=owned().map(c=>`<button type="button" class="g-pick ${c.id===pid?'is-active':''}" data-gpick="${c.id}" aria-label="${escapeText(companionInfo(c.id).name)}"><span>${sprites[c.id]||''}</span></button>`).join('');
  const stat=k=>`<span class="g-stat"><i>${({hp:'HP',stamina:'Sta',run:'Run',power:'Pow',swim:'Swim',fly:'Fly'})[k]}</i><b>${info.stats[k].level}</b></span>`;
  mount.innerHTML=`<div class="pets-scroll"><div class="section-head g-head"><h2>Games</h2><span class="g-tally"><i class="g-medal is-gold"></i>${n.gold}<i class="g-medal is-silver"></i>${n.silver}<i class="g-medal is-bronze"></i>${n.bronze}</span></div>
   <section class="g-card"><div class="g-picks">${chips}</div><div class="g-who"><strong>${escapeText(info.name)}</strong><div class="g-stats">${['hp','stamina','run','power','swim','fly'].map(stat).join('')}</div></div></section>
   <h3 class="pets-family">Races</h3>
   <div class="g-list">${COURSES.map(c=>{const open=courseOpen(c);return `<div class="g-course ${open?'':'is-locked'}"><div class="g-course-head"><span class="g-course-ico" data-focus="${c.focus}"></span><div><strong>${escapeText(c.name)}</strong><small>${open?escapeText(c.blurb):'Win the Rookie level of the other five courses'}</small></div></div>
    <div class="g-levels">${LEVELS.map((l,i)=>{const ok=open&&levelOpen(state.races,c.id,i);return `<button type="button" class="g-level ${ok?'':'is-locked'}" data-race="${c.id}" data-level="${i}" ${ok?'':'disabled'}>${medalDot(best(state.races,c.id,i))}<span>${l}</span></button>`;}).join('')}</div></div>`;}).join('')}</div>
   <h3 class="pets-family">Sparring ring</h3>
   <div class="g-course"><div class="g-course-head"><span class="g-course-ico" data-focus="spar"></span><div><strong>Sparring Ring</strong><small>One-on-one bouts: HP, Power, Run and Stamina.</small></div></div>
    <div class="g-levels">${LEVELS.map((l,i)=>{const ok=levelOpen(state.spar,'ring',i);return `<button type="button" class="g-level ${ok?'':'is-locked'}" data-spar="${i}" ${ok?'':'disabled'}>${medalDot(best(state.spar,'ring',i))}<span>${l}</span></button>`;}).join('')}</div></div>
   <details class="pets-help"><summary>How the games work</summary><ul>
    <li><strong>Your companion plays on its own.</strong> Tap the screen to cheer: in races it sprints for a moment, in the ring the next hit is a power strike. Every cheer spends Stamina — a tired companion has to stop and rest.</li>
    <li><strong>Races:</strong> ground uses Run, water uses Swim, gaps use Fly, rock walls use Power; Stamina drains all the time. Each course focuses on one stat.</li>
    <li><strong>Sparring:</strong> HP is health, Power hits harder, Run dodges, Stamina keeps the punches coming.</li>
    <li><strong>Medals:</strong> 1st gold, 2nd silver, 3rd bronze. Win a level to open the next one. Every race and bout also trains the stats it used.</li>
   </ul></details></div>`;
  mount.querySelectorAll('[data-gpick]').forEach(b=>b.onclick=()=>{state.pick=b.dataset.gpick;save();render(mount);});
  mount.querySelectorAll('[data-race]').forEach(b=>b.onclick=()=>startRace(mount,COURSES.find(c=>c.id===b.dataset.race),Number(b.dataset.level)));
  mount.querySelectorAll('[data-spar]').forEach(b=>b.onclick=()=>startSpar(mount,Number(b.dataset.spar)));
 }

 // ---------- shared stage ----------
 function rig(el,id){el.innerHTML=sprites[id]||'';for(const g of el.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}const svg=el.querySelector('svg');if(svg){svg.setAttribute('width','100%');svg.setAttribute('height','100%');}}
 function actor(id,cls=''){const el=document.createElement('span');el.className='companion g-actor '+cls;el.dataset.anim='idle';el.dataset.face='right';const art=document.createElement('span');art.className='companion-art';rig(art,id);el.append(art);return el;}
 function stage(title){const st=document.createElement('div');st.className='g-stage';st.innerHTML=`<div class="g-stage-top"><strong>${escapeText(title)}</strong><button type="button" class="g-quit" aria-label="Quit">✕</button></div><div class="g-stage-body"></div><div class="g-hud"></div>`;document.body.append(st);return st;}
 const opponentsFor=(n,exclude)=>{const pool=roster.filter(c=>c.id!==exclude);const out=[];const used=new Set();while(out.length<n&&used.size<pool.length){const c=pool[Math.floor(Math.random()*pool.length)];if(used.has(c.id))continue;used.add(c.id);out.push(c);}return out;};

 // ---------- race ----------
 function startRace(mount,course,level){
  const pid=pick();if(!pid)return;const me=companionInfo(pid);
  const plan=course.plan,segs=[];let x=0;for(const t of plan){segs.push({t,x,len:SEG_LEN});x+=SEG_LEN;}const L=x;
  const rivals=opponentsFor(4,pid);
  const st=stage(`${course.name} · ${LEVELS[level]}`);const body=st.querySelector('.g-stage-body'),hud=st.querySelector('.g-hud');
  body.innerHTML=`<div class="g-track" style="width:${L*PX+260}px">${segs.map(s=>`<div class="g-seg is-${s.t}" style="left:${s.x*PX+120}px;width:${s.len*PX}px"></div>`).join('')}<div class="g-finish" style="left:${L*PX+120}px"></div></div>`;
  const track=body.querySelector('.g-track');
  const racers=[{id:pid,me:true,stats:Object.fromEntries(Object.entries(me.stats).map(([k,v])=>[k,v.level])),mood:me.mood},...rivals.map((c,i)=>({id:c.id,stats:opponentStats(course,level,i+1+Date.now()%97),mood:60}))];
  racers.forEach((r,i)=>{r.x=0;r.lane=i;r.max=energyMax(r.stats.stamina);r.energy=r.max;r.rest=0;r.boost=0;r.done=false;r.ai=1+Math.random()*2;r.el=actor(r.id,r.me?'is-me':'');r.el.style.setProperty('--lane',i);track.append(r.el);});
  hud.innerHTML=`<div class="g-energy"><i>Stamina</i><b><em id="gEnergy"></em></b></div><div class="g-place" id="gPlace">—</div><div class="g-tip">Tap anywhere to cheer!</div>`;
  const energyEl=hud.querySelector('#gEnergy'),placeEl=hud.querySelector('#gPlace');
  let raf=0,last=performance.now(),finished=[],quit=false,countdown=1.4;
  const segAt=px=>segs.find(s=>px>=s.x&&px<s.x+s.len)||segs[segs.length-1];
  const cheer=()=>{const r=racers[0];if(r.done||r.rest>0||countdown>0)return;if(r.energy<6){r.el.classList.add('g-tired');setTimeout(()=>r.el.classList.remove('g-tired'),300);return;}r.energy-=6;r.boost=0.8;burst(r);};
  function burst(r){const b=document.createElement('i');b.className='g-burst';r.el.append(b);setTimeout(()=>b.remove(),500);}
  body.addEventListener('pointerdown',cheer);
  st.querySelector('.g-quit').onclick=()=>{quit=true;cancelAnimationFrame(raf);st.remove();};
  const step=now=>{const dt=Math.min(0.05,(now-last)/1000);last=now;
   if(countdown>0){countdown-=dt;placeEl.textContent=countdown>0.7?'Ready…':'Go!';raf=requestAnimationFrame(step);return;}
   for(const r of racers){if(r.done)continue;const seg=segAt(r.x);
    if(r.rest>0){r.rest-=dt;r.el.dataset.anim='sleep';if(r.rest<=0){r.energy=r.max*0.5;}continue;}
    if(!r.me){r.ai-=dt;if(r.ai<=0){r.ai=(4-level*0.6)+Math.random()*2.5;if(r.energy>r.max*0.4&&Math.random()<0.35+level*0.16){r.energy-=8;r.boost=0.9;}}}  // rivals cheer more at higher levels
    const lv=r.stats[SEG_STAT[seg.t]],runLv=r.stats.run;
    let v=UNIT_SPEED*(seg.t==='run'?statSpeed(lv):0.8*statSpeed(lv)+0.2*statSpeed(runLv));
    if(seg.t==='fly'&&lv<15)v*=0.75;          // weak flyers flutter down and paddle
    if(r.mood>=70)v*=1.05;else if(r.mood<=30)v*=0.92;
    if(!r.me)v*=LEVEL_EASE[level];
    if(r.boost>0){v*=1.6;r.boost-=dt;}
    const d=v*dt;r.x+=d;r.energy-=d*SEG_DRAIN[seg.t]*(r.boost>0?1.3:1);
    if(r.energy<=0){r.energy=0;r.rest=1.1;}
    r.el.dataset.anim=SEG_ANIM[seg.t];r.el.className=`companion g-actor ${r.me?'is-me':''} seg-${seg.t}`;
    if(r.x>=L){r.x=L;r.done=true;finished.push(r);r.el.dataset.anim='idle';r.el.classList.add('is-happy');}
    r.el.style.setProperty('--x',(r.x*PX+120)+'px');}
   const me=racers[0];const order=[...racers].sort((a,b)=>(b.done?1e6-finished.indexOf(b):b.x)-(a.done?1e6-finished.indexOf(a):a.x));
   placeEl.textContent=`${order.indexOf(me)+1} / ${racers.length}`;
   energyEl.style.width=(100*me.energy/me.max)+'%';energyEl.parentElement.classList.toggle('is-low',me.energy<me.max*0.2);
   const vw=body.clientWidth;track.style.transform=`translateX(${Math.min(0,-(me.x*PX+120-vw*0.35))}px)`;
   if(me.done&&!quit){cancelAnimationFrame(raf);const place=finished.indexOf(me)+1;setTimeout(()=>{st.remove();finishGame(mount,'race',course,level,place,racers.length);},900);return;}
   raf=requestAnimationFrame(step);};
  raf=requestAnimationFrame(step);
 }

 // ---------- sparring (Chao Karate-like) ----------
 function startSpar(mount,level){
  const pid=pick();if(!pid)return;const me=companionInfo(pid);const rival=opponentsFor(1,pid)[0];
  const ms=Object.fromEntries(Object.entries(me.stats).map(([k,v])=>[k,v.level]));
  const rs=opponentStats({id:'ring',focus:'all'},level,7+level);
  const st=stage(`Sparring Ring · ${LEVELS[level]}`);const body=st.querySelector('.g-stage-body'),hud=st.querySelector('.g-hud');
  body.innerHTML=`<div class="g-ring"><div class="g-ring-floor"></div></div>`;const ring=body.querySelector('.g-ring');
  const A={id:pid,s:ms,me:true},B={id:rival.id,s:rs};
  for(const f of [A,B]){f.hpMax=100+f.s.hp*4;f.hp=f.hpMax;f.max=energyMax(f.s.stamina);f.energy=f.max;f.power=false;f.el=actor(f.id,f.me?'is-me is-left':'is-right');ring.append(f.el);}
  B.el.dataset.face='left';
  hud.innerHTML=`<div class="g-bars"><div class="g-hp is-me"><b><em id="gHpA"></em></b></div><div class="g-vs">VS</div><div class="g-hp"><b><em id="gHpB"></em></b></div></div><div class="g-energy"><i>Stamina</i><b><em id="gEnergy"></em></b></div><div class="g-tip">Tap to load a power strike!</div>`;
  const upd=()=>{hud.querySelector('#gHpA').style.width=(100*A.hp/A.hpMax)+'%';hud.querySelector('#gHpB').style.width=(100*B.hp/B.hpMax)+'%';hud.querySelector('#gEnergy').style.width=(100*A.energy/A.max)+'%';};upd();
  let over=false,turn=0,timer=0;
  body.addEventListener('pointerdown',()=>{if(over||A.power)return;if(A.energy<20){A.el.classList.add('g-tired');setTimeout(()=>A.el.classList.remove('g-tired'),300);return;}A.energy-=20;A.power=true;A.el.classList.add('is-charged');upd();});
  st.querySelector('.g-quit').onclick=()=>{over=true;clearTimeout(timer);st.remove();};
  const hit=(att,def)=>{
   if(att.energy<6){att.el.dataset.anim='sleep';att.energy+=att.max*0.25;return;}   // too tired to punch: catches its breath
   att.energy-=6;att.el.dataset.anim='knock';att.el.classList.add('is-lunge');setTimeout(()=>{att.el.classList.remove('is-lunge');att.el.dataset.anim='idle';},420);
   const dodge=Math.max(0.05,Math.min(0.4,0.15+(def.s.run-att.s.run)/250));
   if(Math.random()<dodge){def.el.classList.add('is-dodge');setTimeout(()=>def.el.classList.remove('is-dodge'),400);att.power=false;att.el.classList.remove('is-charged');return;}
   let dmg=(8+att.s.power/4)*(0.85+Math.random()*0.3)*(att.me?1:LEVEL_EASE[level]);if(att.power){dmg*=1.8;att.power=false;att.el.classList.remove('is-charged');}
   if(!att.me&&Math.random()<0.15&&att.energy>att.max*0.5)dmg*=1.6;
   def.hp=Math.max(0,def.hp-dmg);def.el.classList.add('is-hit');setTimeout(()=>def.el.classList.remove('is-hit'),300);
   const b=document.createElement('i');b.className='g-burst is-hit';def.el.append(b);setTimeout(()=>b.remove(),450);};
  const loop=()=>{if(over)return;const [att,def]=turn%2?[B,A]:[A,B];turn++;hit(att,def);upd();
   if(A.hp<=0||B.hp<=0||turn>80){over=true;const win=B.hp<=0||(turn>80&&A.hp/A.hpMax>=B.hp/B.hpMax);(win?A:B).el.classList.add('is-happy');(win?B:A).el.dataset.anim='sleep';
    setTimeout(()=>{st.remove();finishGame(mount,'spar',null,level,win?1:2,2);},1100);return;}
   timer=setTimeout(loop,reducedMotion()?350:720);};
  timer=setTimeout(loop,900);
 }

 // ---------- results ----------
 function finishGame(mount,kind,course,level,place,total){
  const bag=kind==='race'?state.races:state.spar,key=kind==='race'?course.id:'ring';
  bag[key]=bag[key]||{};const prev=bag[key][level]||0;const improved=!prev||place<prev;if(improved)bag[key][level]=place;save();
  const medal=medalFor(kind==='race'?place:(place===1?1:0));
  const trained=onResult?.(pick(),kind,course?.focus,place)||[];
  const unlocked=place===1&&level<LEVELS.length-1&&!prev?`<p class="g-unlock">${LEVELS[level+1]} level unlocked!</p>`:'';
  showModal(`<div class="modal-tag">${kind==='race'?escapeText(course.name):'SPARRING RING'} · ${LEVELS[level].toUpperCase()}</div><div class="g-result">${medal?`<i class="g-medal is-${medal} is-big"></i>`:'<i class="g-medal is-none is-big"></i>'}</div><h2>${kind==='race'?(place===1?'You won!':`Finished ${place}${['st','nd','rd'][place-1]||'th'} of ${total}`):(place===1?'Victory!':'Defeated')}</h2>${unlocked}${trained.length?`<p class="mini-muted">Trained ${trained.join(', ')}.</p>`:''}<button type="button" class="modal-button" id="gAgain">Play again</button><button type="button" class="modal-button secondary" id="gBack">Back</button>`);
  $('gAgain').onclick=()=>{closeModal();kind==='race'?startRace(mount,course,level):startSpar(mount,level);};
  $('gBack').onclick=()=>{closeModal();render(mount);};
  render(mount);
 }
 return {render,state:()=>state,medalCounts};
}
