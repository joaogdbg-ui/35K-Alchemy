/**
 * V94 Stadium (owner request 31/10/2026): the Games tab redone on the Chao Stadium model.
 *  Hub: one entrant card (big sprite, name, total level, six stat grades, belt), then Races /
 *  Karate / Prizes. Everything the player needs is on the card: levels, grades, mood.
 *  RACES (Chao Race dynamics): sections use Run (ground), Swim (water), Fly (gaps), Power (rock
 *  walls); Stamina drains and a tired racer sits down to rest. Six courses × five levels; each
 *  level is opened by winning the previous one. Winning Champion gives a TOY for the house.
 *  KARATE (Chao Karate dynamics): best of three rounds. HP = health, Power = damage, Swim =
 *  defence, Fly = dodge, Run = attack speed, Stamina = zeal (tired fighters stop to breathe).
 *  Winning a level gives a BELT the companion wears from then on.
 *  The companion plays by itself; the player taps CHEER (a sprint / a power strike) which costs
 *  Stamina. Feedback everywhere: countdown, section banners, dust, splashes, speed lines, place
 *  pops, hit sparks, screen shake, KO stars, podium and medal drop. No imports.
 */
export const GAMES_STORAGE_KEY='alchemy10k_games_v1';
export const LEVELS=['Rookie','Junior','Pro','Expert','Champion'];
export const LEVEL_POWER=[0,12,28,48,72];
export const LEVEL_EASE=[0.96,0.98,1,1,1.03];
export const COURSES=[
 {id:'pond',name:'Pebble Pond',focus:'swim',blurb:'Shallow pools and reeds. Swim decides it.',plan:['run','swim','run','swim','swim','run','swim','run']},
 {id:'cliffs',name:'Breezy Cliffs',focus:'fly',blurb:'Wooden bridges are out — glide the gaps. Fly decides it.',plan:['run','fly','run','fly','run','fly','fly','run']},
 {id:'meadow',name:'Meadow Dash',focus:'run',blurb:'Open grass all the way. Run decides it.',plan:['run','run','swim','run','run','climb','run','run']},
 {id:'boulder',name:'Boulder Wall',focus:'power',blurb:'Rock walls to climb. Power decides it.',plan:['run','climb','run','climb','run','climb','climb','run']},
 {id:'trail',name:'Long Trail',focus:'stamina',blurb:'Twice as long, a bit of everything. Stamina decides it.',plan:['run','swim','run','climb','run','fly','run','swim','run','climb','run','run']},
 {id:'grand',name:'Grand Circuit',focus:'all',blurb:'The champions’ course: every stat counts.',plan:['run','swim','fly','climb','run','swim','fly','climb','run'],locked:true}
];
const SEG_STAT={run:'run',swim:'swim',fly:'fly',climb:'power'};
const SEG_DRAIN={run:0.10,swim:0.14,climb:0.18,fly:0.05};
const SEG_ANIM={run:'walk',swim:'hopwalk',fly:'fly',climb:'climb'};
const SEG_WORD={run:'RUN',swim:'SWIM',fly:'FLY',climb:'CLIMB'};
const SEG_LEN=90,UNIT_SPEED=80,PX=2.2,LANE0=34,LANE_H=52,ACTOR=64,GATE=120;
const STEP_H=56,MAX_ELEV=2,WALL_PART=0.3,DROP_PART=0.18;
/**
 * Pure (V98): ground height of every section. A climb section starts with a cliff the racers climb
 * and the race CONTINUES ON TOP (one level higher, max 2). Racers jump back down into the next
 * water section (a dive with a splash) or before the finish. Returns segs with elev0 (start) / elev.
 */
export function elevate(segs){let e=0;const last=segs.length-1;return segs.map((sg,i)=>{const e0=e;
 if(sg.t==='climb')e=Math.min(MAX_ELEV,e+1);
 else if((sg.t==='swim'||i===last)&&e>0)e=0;
 return {...sg,elev0:e0,elev:e};});}
export const statSpeed=lv=>0.55+Math.max(0,Math.min(99,lv))/99*0.9;
export const energyMax=lv=>60+Math.max(0,Math.min(99,lv))*1.6;
export function opponentStats(course,level,seed){
 let s=seed*9301+level*49297+course.id.length*233;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
 const base=LEVEL_POWER[level],out={};
 for(const k of ['hp','stamina','run','power','swim','fly']){let v=base*(0.7+rnd()*0.6);if(course.focus===k||course.focus==='all')v*=1.25;out[k]=Math.round(Math.max(0,Math.min(99,v)));}
 return out;
}
/**
 * Pure: the course layout for a level. Higher levels are longer and mix more section types
 * (Rookie 6 sections, Champion 14), with longer sections, so no two levels feel the same.
 */
export function planFor(course,level){
 const focusSeg={swim:'swim',fly:'fly',run:'run',power:'climb',stamina:null,all:null}[course.focus];
 const others=['run','swim','fly','climb'];
 let seed=course.id.length*131+level*17;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
 const n=[6,8,10,12,14][level];const out=[];
 for(let i=0;i<n;i++){
  let t;
  if(i===0||i===n-1)t='run';
  else if(focusSeg){const share=[0.45,0.5,0.5,0.45,0.4][level];t=rnd()<share?focusSeg:(level===0?'run':others[Math.floor(rnd()*others.length)]);}
  else t=level===0&&i%2?'run':others[Math.floor(rnd()*others.length)];
  if(out.length&&out[out.length-1].t===t&&t!=='run'&&level<3)t='run';
  const len=t==='run'?SEG_LEN:Math.round(SEG_LEN*(1+level*0.12+(level>=3&&rnd()<0.3?0.5:0)));
  out.push({t,len});
 }
 return out;
}
export function medalFor(place){return place===1?'gold':place===2?'silver':place===3?'bronze':null;}
const ORD=p=>p+(['st','nd','rd'][p-1]||'th');

export function createGamesSystem(ctx){
 const {$,escapeText,roster,sprites,isDiscovered,companionInfo,onResult,onBelt,wear,showModal,closeModal,toast,reducedMotion,activeId,prizes,belts,art={}}=ctx;
 const sfx=new Proxy(ctx.sfx||{},{get:(t,k)=>t[k]||(()=>{})});
 const bg=k=>art[k]?`url('data:image/svg+xml,${encodeURIComponent(art[k]).replace(/'/g,'%27')}')`:'none';
 let state={v:2,pick:null,view:'race',races:{},karate:{},prizes:[],belts:{}};
 try{const raw=JSON.parse(localStorage.getItem(GAMES_STORAGE_KEY)||'null');if(raw&&typeof raw==='object')state={v:2,pick:raw.pick||null,view:raw.view||'race',races:raw.races||{},karate:raw.karate||raw.spar?.ring&&{...raw.spar.ring}||{},prizes:raw.prizes||[],belts:raw.belts||{}};}catch{}
 const save=()=>{try{localStorage.setItem(GAMES_STORAGE_KEY,JSON.stringify(state));}catch{}};
 const owned=()=>roster.filter(c=>isDiscovered(c.id));
 const pick=()=>{const o=owned();if(!o.length)return null;if(!o.some(c=>c.id===state.pick))state.pick=(activeId?.()&&o.some(c=>c.id===activeId()))?activeId():o[0].id;return state.pick;};
 const best=(bag,l)=>bag?.[l]||0;
 const levelOpen=(bag,l)=>l===0||best(bag,l-1)===1;
 const courseOpen=c=>!c.locked||COURSES.filter(x=>!x.locked).every(x=>best(state.races[x.id],0)===1);
 const beltOf=cid=>state.belts[cid]||null;
 const hasPrize=id=>state.prizes.includes(id);
 function medalCounts(){const n={gold:0,silver:0,bronze:0};const all=[...Object.values(state.races),state.karate];for(const lv of all)for(const p of Object.values(lv||{})){const m=medalFor(p);if(m)n[m]++;}return n;}
 const medalDot=(p,big=false)=>{const m=medalFor(p);return `<i class="g-medal ${big?'is-big':''} ${m?'is-'+m:p?'is-none':'is-empty'}"></i>`;};
 const totalLv=info=>Object.values(info.stats).reduce((n,s)=>n+(s.level||0),0);
 const GR=['E','D','C','B','A','S'];
 const rig=(el,id)=>{el.innerHTML=sprites[id]||'';for(const g of el.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}const svg=el.querySelector('svg');if(svg){svg.setAttribute('width','100%');svg.setAttribute('height','100%');}};
 const dress=root=>{try{wear?.(root);}catch{}};

 // ---------- hub (V96: one entrant card, one event list, no tabs) ----------
 const EVENTS=()=>[...COURSES.map(c=>({kind:'race',id:c.id,name:c.name,focus:c.focus,course:c})),{kind:'karate',id:'dojo',name:'Karate Dojo',focus:'karate'}];
 const bagOf=e=>e.kind==='race'?(state.races[e.id]||{}):state.karate;
 const nextLevel=e=>{const bag=bagOf(e);for(let i=0;i<LEVELS.length;i++)if(best(bag,i)!==1)return i;return LEVELS.length-1;};
 const dots=e=>{const bag=bagOf(e);return `<span class="st-dots">${LEVELS.map((_,i)=>medalDot(best(bag,i))).join('')}</span>`;};
 function render(mount){
  if(!mount)return;const pid=pick();
  if(!pid){mount.innerHTML='<div class="pets-scroll"><div class="section-head"><h2>Stadium</h2><p>Discover a companion to enter the races.</p></div></div>';return;}
  const info=companionInfo(pid),n=medalCounts(),belt=belts.find(b=>b.id===beltOf(pid));
  const toys=Object.values(prizes.RACE_PRIZES),won=toys.filter(p=>hasPrize(p.id)).length;
  const rows=EVENTS().map(e=>{const open=e.kind!=='race'||courseOpen(e.course);const lv=nextLevel(e);const done=best(bagOf(e),LEVELS.length-1)===1;
   return `<div class="st-row ${open?'':'is-locked'}" data-ev="${e.id}"><span class="st-course-ico" data-focus="${e.focus}"></span><div class="st-row-main"><strong>${escapeText(e.name)}</strong>${dots(e)}</div>${open?`<button type="button" class="st-play" data-play="${e.id}">${done?'Replay':LEVELS[lv]}<i></i></button>`:'<span class="st-lock"></span>'}</div>`;}).join('');
  mount.innerHTML=`<div class="pets-scroll st-scroll"><div class="section-head g-head"><h2>Stadium</h2><span class="g-tally"><i class="g-medal is-gold"></i>${n.gold}<i class="g-medal is-silver"></i>${n.silver}<i class="g-medal is-bronze"></i>${n.bronze}</span></div>
   <section class="st-entrant is-simple"><button type="button" class="st-entrant-art companion" data-companion="${pid}" data-card="${pid}" aria-label="Stats"><span class="companion-art"></span>${belt?`<span class="st-entrant-belt">${prizes.beltSvg(belt,22)}</span>`:''}</button>
    <button type="button" class="st-entrant-main" data-card="${pid}"><strong>${escapeText(info.name)}</strong><small>Lv ${totalLv(info)} · ${info.mood>=70?'Happy':info.mood<=30?'Sad':'Content'}${belt?' · '+escapeText(belt.name):''}</small><em>Growth ×${ctx.alchemyGrowth?.()||1} from ${(ctx.classicCount?.()||0).toLocaleString('en-US')} Classic finds</em></button>
    <button type="button" class="st-change" id="stChange">Change</button></section>
   <div class="st-picker" id="stPicker" hidden>${owned().map(c=>{const ci=companionInfo(c.id);return `<button type="button" class="st-pick ${c.id===pid?'is-active':''}" data-gpick="${c.id}"><span class="companion" data-companion="${c.id}"><span class="companion-art"></span></span><small>${escapeText(ci.name)}</small><em>Lv ${totalLv(ci)}</em></button>`;}).join('')}</div>
   <div class="st-rows">${rows}
    <button type="button" class="st-row is-prizes" id="stPrizes"><span class="st-course-ico" data-focus="all"></span><div class="st-row-main"><strong>Prizes</strong><small>${won}/${toys.length} toys · ${belt?escapeText(belt.name):'no belt yet'}</small></div><span class="st-chev">›</span></button></div>
   <p class="mini-muted st-tip">Your companion competes on its own. Tap CHEER for a sprint or a power strike — it costs Stamina.</p></div>`;
  mount.querySelectorAll('.companion[data-companion] .companion-art').forEach(a=>rig(a,a.parentElement.dataset.companion));dress(mount);
  $('stChange').onclick=()=>{const p=$('stPicker');p.hidden=!p.hidden;};
  mount.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>ctx.openCard?.(b.dataset.card));
  mount.querySelectorAll('[data-gpick]').forEach(b=>b.onclick=()=>{state.pick=b.dataset.gpick;save();render(mount);});
  mount.querySelectorAll('[data-play]').forEach(b=>b.onclick=e=>{e.stopPropagation();const ev=EVENTS().find(x=>x.id===b.dataset.play);const lv=nextLevel(ev);ev.kind==='race'?startRace(mount,ev.course,lv):startKarate(mount,lv);});
  mount.querySelectorAll('[data-ev]').forEach(r=>r.onclick=()=>eventSheet(mount,EVENTS().find(x=>x.id===r.dataset.ev)));
  $('stPrizes').onclick=()=>prizeSheet(mount);
 }
 function eventSheet(mount,e){
  const bag=bagOf(e),open=e.kind!=='race'||courseOpen(e.course);
  const levels=LEVELS.map((l,i)=>{const ok=open&&levelOpen(bag,i);return `<button type="button" class="st-level ${ok?'':'is-locked'} ${best(bag,i)===1?'is-gold':''}" data-lv="${i}" ${ok?'':'disabled'}>${medalDot(best(bag,i))}<span>${l}</span></button>`;}).join('');
  let extra='';
  if(e.kind==='race'){const c=e.course,prize=prizes.RACE_PRIZES[c.id],won=hasPrize(prize.id);const lvN=nextLevel(e),plan=planFor(c,lvN);extra=`<p>${escapeText(c.blurb)}</p><small class="st-foot">${LEVELS[lvN]}: ${plan.length} sections · ${['morning','noon','afternoon','sunset','night'][lvN]}</small><div class="st-strip">${plan.map(x=>`<i class="is-${x.t}" style="flex:${x.len}"></i>`).join('')}</div><div class="st-prizeline ${won?'is-won':''}"><span>${prize.art}</span><small>${won?'Toy won: ':'Champion gold wins the '}<b>${escapeText(prize.name)}</b>${won?'':' for your house'}</small></div>${open?'':'<p class="mini-muted">Win Rookie on the other five courses to open it.</p>'}`;}
  else extra=`<p>Best of three rounds. HP is health, Power hits, Swim blocks, Fly dodges, Run strikes faster, Stamina keeps the fight going.</p><div class="st-belts">${belts.map((b,i)=>`<span class="st-belt ${best(bag,i)===1?'is-won':''}">${prizes.beltSvg(b,28)}<small>${b.name.replace(' Belt','')}</small></span>`).join('')}</div>`;
  showModal(`<div class="modal-tag">${e.kind==='race'?'RACE':'KARATE'}</div><h2>${escapeText(e.name)}</h2>${extra}<div class="st-levels">${levels}</div><button type="button" class="modal-button secondary" id="stClose">Close</button>`);
  $('stClose').onclick=closeModal;
  $('modalContent').querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{closeModal();const lv=Number(b.dataset.lv);e.kind==='race'?startRace(mount,e.course,lv):startKarate(mount,lv);});
 }
 function prizeSheet(mount){
  const toys=Object.values(prizes.RACE_PRIZES);
  const beltRows=owned().filter(c=>beltOf(c.id)).map(c=>{const b=belts.find(x=>x.id===beltOf(c.id));return `<span class="st-beltrow">${prizes.beltSvg(b,26)}<b>${escapeText(companionInfo(c.id).name)}</b><small>${b.name}</small></span>`;}).join('');
  showModal(`<div class="modal-tag">PRIZES</div><strong class="st-h">Toys for the house</strong><div class="st-toys">${toys.map(p=>`<span class="st-toy ${hasPrize(p.id)?'is-won':''}"><span class="st-toy-art">${p.art}</span><small>${escapeText(p.name)}</small><em>${hasPrize(p.id)?'Place it from Home':COURSES.find(c=>prizes.RACE_PRIZES[c.id]===p).name+' · Champion'}</em></span>`).join('')}</div>
   <strong class="st-h">Belts</strong>${beltRows?`<div class="st-beltrows">${beltRows}</div>`:'<p class="mini-muted">No belts yet — win a Karate level.</p>'}<button type="button" class="modal-button secondary" id="stClose">Close</button>`);
  $('stClose').onclick=closeModal;
 }

 // ---------- shared stage ----------
 function actor(id,cls=''){const el=document.createElement('span');el.className='companion g-actor '+cls;el.dataset.anim='idle';el.dataset.face='right';el.dataset.companion=id;const art=document.createElement('span');art.className='companion-art';rig(art,id);el.append(art);return el;}
 function stage(title,kind){const st=document.createElement('div');st.className='g-stage is-'+kind;st.innerHTML=`<div class="g-stage-top"><strong>${escapeText(title)}</strong><button type="button" class="g-quit" aria-label="Quit">✕</button></div><div class="g-stage-body"></div><div class="g-hud"></div><div class="g-banner" hidden></div>`;document.body.append(st);return st;}
 function banner(st,text,cls='',ms=900){const b=st.querySelector('.g-banner');b.textContent=text;b.className='g-banner '+cls;b.hidden=false;b.classList.remove('is-in');void b.offsetWidth;b.classList.add('is-in');clearTimeout(b._t);b._t=setTimeout(()=>{b.hidden=true;},ms);}
 const countdown=(st,done)=>{const seq=['3','2','1','GO!'];let i=0;const tick=()=>{banner(st,seq[i],seq[i]==='GO!'?'is-go':'is-count',seq[i]==='GO!'?700:800);if(seq[i]==='GO!')sfx.go();else sfx.tick();i++;if(i<seq.length)setTimeout(tick,800);else setTimeout(done,150);};tick();};
 const fxAt=(parent,cls,x,y,ms=700)=>{const f=document.createElement('i');f.className='g-fx '+cls;f.style.left=x+'px';f.style.top=y+'px';parent.append(f);setTimeout(()=>f.remove(),ms);return f;};
 const shake=st=>{if(reducedMotion())return;st.classList.remove('is-shake');void st.offsetWidth;st.classList.add('is-shake');};
 const opponentsFor=(n,exclude)=>{const pool=roster.filter(c=>c.id!==exclude);const out=[];const used=new Set();while(out.length<n&&used.size<pool.length){const c=pool[Math.floor(Math.random()*pool.length)];if(used.has(c.id))continue;used.add(c.id);out.push(c);}return out;};
 const cheerBtn=label=>`<button type="button" class="g-cheer" id="gCheer"><span>${label}</span><i></i></button>`;

 // ---------- race ----------
 function startRace(mount,course,level){
  const pid=pick();if(!pid)return;const me=companionInfo(pid);
  const raw=[];let x=0;for(const {t,len} of planFor(course,level)){raw.push({t,x,len});x+=len;}const L=x;const segs=elevate(raw);
  const rivals=opponentsFor(4,pid);
  const st=stage(`${course.name} · ${LEVELS[level]}`,'race');st.dataset.level=level;const body=st.querySelector('.g-stage-body'),hud=st.querySelector('.g-hud');
  body.innerHTML=`<div class="g-sky" style="background-image:${bg('sky')}"><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:1"></i><i class="g-cloud" style="--d:2"></i></div><div class="g-mid" style="background-image:${bg('mid')}"></div><div class="g-fore" style="background-image:${bg('mid')}"></div><div class="g-track" style="width:${L*PX+GATE+220}px"><div class="g-gate is-start" style="left:0;background-image:${bg('start')}"></div>${segs.map(s=>{const left=s.x*PX+GATE,w=s.len*PX,up=s.elev*STEP_H,tile=s.t==='climb'?'run':s.t;
   const block=`<div class="g-seg is-${tile}" style="left:${left}px;width:${w+1}px;top:${-up}px;bottom:${up}px;background-image:${bg(tile)}"><b></b></div>`+(up?`<div class="g-cliff" style="left:${left}px;width:${w+1}px;height:${up}px;background-image:${bg('climb')}"></div>`:'');
   const step=s.elev!==s.elev0?`<div class="g-step ${s.elev>s.elev0?'is-up':'is-down'}" style="left:${left-14}px;top:${-Math.max(s.elev,s.elev0)*STEP_H}px;bottom:${Math.min(s.elev,s.elev0)*STEP_H}px;background-image:${bg('climb')}"></div>`:'';
   return block+step;}).join('')}<div class="g-gate is-finish" style="left:${L*PX+GATE-10}px;background-image:${bg('finish')}"></div></div><div class="g-tint"></div>`;
  const track=body.querySelector('.g-track'),hills=body.querySelector('.g-mid');
  const racers=[{id:pid,me:true,stats:Object.fromEntries(Object.entries(me.stats).map(([k,v])=>[k,v.level])),mood:me.mood,name:me.name},...rivals.map((c,i)=>({id:c.id,stats:opponentStats(course,level,i+1+Date.now()%97),mood:60,name:companionInfo(c.id).name}))];
  racers.forEach((r,i)=>{r.x=0;r.lane=i;r.max=energyMax(r.stats.stamina);r.energy=r.max;r.rest=0;r.boost=0;r.done=false;r.ai=2+Math.random()*2;r.fx=0;r.seg=null;r.place=i+1;r.el=actor(r.id,r.me?'is-me':'');r.el.style.setProperty('--lane',i);
   const tag=document.createElement('b');tag.className='g-tag';tag.innerHTML=`<em>${i+1}</em>${escapeText(r.name)}`;r.el.append(tag);r.tag=tag;track.append(r.el);});
  dress(track);
  hud.innerHTML=`<div class="g-hud-row"><div class="g-energy"><i>Stamina</i><b><em id="gEnergy"></em></b></div><div class="g-place" id="gPlace">—</div></div>${cheerBtn('CHEER')}`;
  const energyEl=hud.querySelector('#gEnergy'),placeEl=hud.querySelector('#gPlace'),cheer=hud.querySelector('#gCheer');
  let raf=0,last=0,finished=[],quit=false,running=false,lastPlace=0;
  const segAt=px=>segs.find(s=>px>=s.x&&px<s.x+s.len)||segs[segs.length-1];
  const doCheer=()=>{const r=racers[0];if(!running||r.done||r.rest>0)return;if(r.energy<6){r.el.classList.add('g-tired');cheer.classList.add('is-no');sfx.tired();setTimeout(()=>{r.el.classList.remove('g-tired');cheer.classList.remove('is-no');},300);return;}
   r.energy-=6;r.boost=0.8;sfx.cheer();cheer.classList.remove('is-pop');void cheer.offsetWidth;cheer.classList.add('is-pop');const b=document.createElement('i');b.className='g-burst';r.el.append(b);setTimeout(()=>b.remove(),500);r.el.classList.add('is-boost');setTimeout(()=>r.el.classList.remove('is-boost'),800);};
  body.addEventListener('pointerdown',doCheer);cheer.addEventListener('pointerdown',e=>{e.stopPropagation();doCheer();});
  st.querySelector('.g-quit').onclick=()=>{quit=true;cancelAnimationFrame(raf);st.remove();};
  const step=now=>{if(quit)return;const dt=Math.min(0.05,(now-(last||now))/1000);last=now;
   for(const r of racers){if(r.done)continue;const seg=segAt(r.x);
    if(r.seg!==seg){const prev=r.seg;r.seg=seg;if(r.me&&seg.x>0){banner(st,SEG_WORD[seg.t],'is-seg is-'+seg.t,700);sfx.section();}if(seg.t==='swim'&&prev&&!seg.elev0)fxAt(r.el,'is-splash is-big',10,40,700),r.me&&sfx.splash();if(seg.t==='fly'&&prev&&r.me)sfx.flap();}
    if(r.rest>0){r.rest-=dt;r.el.dataset.anim='sleep';r.el.className=`companion g-actor ${r.me?'is-me':''} is-resting`;if(r.rest<=0){r.energy=r.max*0.5;}continue;}
    if(!r.me){r.ai-=dt;if(r.ai<=0){r.ai=(4-level*0.6)+Math.random()*2.5;if(r.energy>r.max*0.4&&Math.random()<0.35+level*0.16){r.energy-=8;r.boost=0.9;}}}
    const lv=r.stats[SEG_STAT[seg.t]],runLv=r.stats.run;
    const onCliff=seg.t==='climb'&&seg.elev>seg.elev0&&(r.x-seg.x)/seg.len<WALL_PART;
    let v=UNIT_SPEED*(seg.t==='run'||(seg.t==='climb'&&!onCliff)?statSpeed(seg.t==='climb'?runLv:lv):onCliff?0.42*statSpeed(r.stats.power)+0.06*statSpeed(r.stats.stamina):0.8*statSpeed(lv)+0.2*statSpeed(runLv));
    if(seg.t==='fly'&&lv<15)v*=0.75;
    if(r.mood>=70)v*=1.05;else if(r.mood<=30)v*=0.92;
    if(!r.me)v*=LEVEL_EASE[level];
    if(r.boost>0){v*=1.6;r.boost-=dt;}
    const d=v*dt;r.x+=d;r.energy-=d*SEG_DRAIN[seg.t]*(r.boost>0?1.3:1);
    if(r.energy<=0){r.energy=0;r.rest=1.1;fxAt(r.el,'is-sweat',30,-6,900);if(r.me)sfx.rest();}
    // V98: ground height; on a cliff the racer is pinned to the rock and climbs straight up, then runs on top.
    let dx=0,dy;const pr=(r.x-seg.x)/seg.len;const up=seg.elev>seg.elev0,down=seg.elev<seg.elev0;
    if(up&&pr<WALL_PART){const k=pr/WALL_PART;dx=(seg.x-r.x)*PX-26;dy=-(seg.elev0+k*(seg.elev-seg.elev0))*STEP_H;r.climbing=true;r.dropping=false;}
    else if(down&&pr<DROP_PART){const k=pr/DROP_PART;dy=-(seg.elev0*STEP_H)*(1-k*k)+(-18*Math.sin(Math.PI*k));r.climbing=false;if(!r.dropping){r.dropping=true;if(r.me)sfx.flap();}if(k>0.9&&seg.t==='swim'&&!r.splashed){r.splashed=true;fxAt(r.el,'is-splash is-big',10,40,700);if(r.me)sfx.splash();}}
    else{dy=-seg.elev*STEP_H;if(r.climbing&&r.me){fxAt(r.el,'is-dust',20,44,500);}r.climbing=false;r.dropping=false;r.splashed=false;}
    r.el.style.setProperty('--dy',dy.toFixed(1)+'px');r.el.style.setProperty('--dx',dx.toFixed(1)+'px');r.el.classList.toggle('on-wall',r.climbing);
    const onWall=r.climbing;r.el.dataset.anim=onWall?'climb':r.dropping?'jump':seg.t==='climb'?'walk':SEG_ANIM[seg.t];r.el.className=`companion g-actor ${r.me?'is-me':''} seg-${seg.t} ${r.boost>0?'is-boost':''} ${r.dropping?'is-drop':''} ${onWall?'on-wall':''}`;
    r.fx-=dt;if(r.fx<=0&&!reducedMotion()){r.fx=seg.t==='swim'?0.35:0.22;fxAt(r.el,seg.t==='swim'?'is-splash':seg.t==='fly'?'is-wind':r.climbing?'is-pebble':'is-dust',seg.t==='fly'?-6:6,seg.t==='fly'?20:44,600);}
    if(r.x>=L){r.x=L;r.done=true;finished.push(r);r.el.className=`companion g-actor ${r.me?'is-me':''} is-happy`;r.el.dataset.anim='idle';if(r.me){if(finished.length===1){confetti(body);sfx.finish();banner(st,'WINNER!','is-go',1200);}else if(finished.length<=3){sfx.medal();banner(st,ORD(finished.length)+'!','is-pass',900);}else{sfx.lose();}}}
    r.el.style.setProperty('--x',(r.x*PX+GATE)+'px');}
   const mine=racers[0];const order=[...racers].sort((a,b)=>(b.done?1e6-finished.indexOf(b):b.x)-(a.done?1e6-finished.indexOf(a):a.x));
   const place=order.indexOf(mine)+1;if(place!==lastPlace){if(lastPlace&&!mine.done){if(place<lastPlace){banner(st,ORD(place)+'!','is-pass',600);sfx.pass();}else sfx.passed();}lastPlace=place;}
   order.forEach((r,i)=>{r.tag.querySelector('em').textContent=i+1;});
   placeEl.textContent=`${ORD(place)} / ${racers.length}`;placeEl.dataset.place=place;
   energyEl.style.width=(100*mine.energy/mine.max)+'%';energyEl.parentElement.classList.toggle('is-low',mine.energy<mine.max*0.2);cheer.classList.toggle('is-dim',mine.energy<6||mine.rest>0);
   const vw=body.clientWidth,cam=Math.min(0,-(mine.x*PX+GATE-vw*0.32));track.style.transform=`translateX(${cam}px)`;hills.style.backgroundPositionX=(cam*0.45)+'px';body.querySelector('.g-fore').style.backgroundPositionX=(cam*1.25-60)+'px';body.querySelector('.g-sky').style.backgroundPositionX=(cam*0.15)+'px';
   if(mine.done){cancelAnimationFrame(raf);setTimeout(()=>{if(quit)return;st.remove();finishRace(mount,course,level,finished.indexOf(mine)+1,racers,finished);},1100);return;}
   raf=requestAnimationFrame(step);};
  racers.forEach(r=>{r.el.style.setProperty('--x',GATE+'px');});
  setTimeout(()=>countdown(st,()=>{running=true;last=0;raf=requestAnimationFrame(step);}),400);
 }
 function confetti(parent){if(reducedMotion())return;for(let i=0;i<26;i++){const f=document.createElement('i');f.className='g-confetti';f.style.setProperty('--i',i);f.style.left=(20+Math.random()*60)+'%';f.style.setProperty('--c',['#e0675a','#f1c26b','#5aaed2','#8dbf8a','#9b7fc4'][i%5]);parent.append(f);setTimeout(()=>f.remove(),1800);}}
 function finishRace(mount,course,level,place,racers,finished){
  const bag=state.races[course.id]=state.races[course.id]||{};const prev=bag[level]||0;const improved=!prev||place<prev;if(improved)bag[level]=place;
  const prize=prizes.RACE_PRIZES[course.id];let newPrize=false;if(place===1&&level===LEVELS.length-1&&!hasPrize(prize.id)){state.prizes.push(prize.id);newPrize=true;}
  save();
  if(newPrize)setTimeout(()=>sfx.prize(),500);else if(place<=3)setTimeout(()=>sfx.medal(),300);
  const trained=onResult?.(pick(),'race',course.focus,place)||[];
  const podium=[0,1,2].map(i=>finished[i]||racers.find(r=>!finished.includes(r)&&r!==finished[0])).filter(Boolean);
  const unlocked=place===1&&level<LEVELS.length-1&&!prev?`<p class="g-unlock">${LEVELS[level+1]} unlocked!</p>`:'';
  showModal(`<div class="modal-tag">${escapeText(course.name)} · ${LEVELS[level].toUpperCase()}</div>
   <div class="g-podium">${podium.map((r,i)=>`<div class="g-pod is-${i+1}"><span class="companion" data-companion="${r.id}"><span class="companion-art"></span></span><b>${i+1}</b></div>`).join('')}</div>
   <div class="g-result">${medalDot(place,true)}</div><h2>${place===1?'You won!':`Finished ${ORD(place)} of ${racers.length}`}</h2>${unlocked}
   ${newPrize?`<div class="g-prize"><span>${prize.art}</span><div><b>New toy for your house!</b><small>${escapeText(prize.name)} — place it from the Home tab.</small></div></div>`:''}
   ${trained.length?`<p class="mini-muted">Trained ${trained.join(', ')}.</p>`:''}
   <button type="button" class="modal-button" id="gAgain">Race again</button><button type="button" class="modal-button secondary" id="gBack">Back to the Stadium</button>`);
  $('modalContent').querySelectorAll('.companion[data-companion] .companion-art').forEach(a=>rig(a,a.parentElement.dataset.companion));dress($('modalContent'));
  $('gAgain').onclick=()=>{closeModal();startRace(mount,course,level);};
  $('gBack').onclick=()=>{closeModal();render(mount);};
  render(mount);
 }

 // ---------- karate (best of three rounds) ----------
 function startKarate(mount,level){
  const pid=pick();if(!pid)return;const me=companionInfo(pid);const rival=opponentsFor(1,pid)[0];
  const ms=Object.fromEntries(Object.entries(me.stats).map(([k,v])=>[k,v.level]));const rs=opponentStats({id:'dojo',focus:'all'},level,7+level);
  const st=stage(`Karate Dojo · ${LEVELS[level]}`,'karate');const body=st.querySelector('.g-stage-body'),hud=st.querySelector('.g-hud');
  body.innerHTML=`<div class="g-dojo" style="background-image:${bg('dojo')}"></div><div class="g-ring"><div class="g-ring-floor" style="background-image:${bg('ring')}"></div></div>`;const ring=body.querySelector('.g-ring');
  const A={id:pid,s:ms,me:true,name:me.name,wins:0},B={id:rival.id,s:rs,name:companionInfo(rival.id).name,wins:0};
  for(const f of [A,B]){f.hpMax=100+f.s.hp*4;f.max=energyMax(f.s.stamina);f.el=actor(f.id,f.me?'is-me is-left':'is-right');ring.append(f.el);}
  B.el.dataset.face='left';dress(ring);
  hud.innerHTML=`<div class="g-fighters"><div class="g-fighter is-me"><span class="g-port companion" data-companion="${A.id}"><span class="companion-art"></span></span><div><b>${escapeText(A.name)}</b><span class="g-hp is-me"><b><em id="gHpA"></em></b></span><span class="g-zeal"><em id="gZealA"></em></span></div><i class="g-rounds" id="gRoundsA"></i></div>
   <div class="g-fighter is-them"><div><b>${escapeText(B.name)}</b><span class="g-hp"><b><em id="gHpB"></em></b></span><span class="g-zeal"><em id="gZealB"></em></span></div><span class="g-port companion" data-companion="${B.id}"><span class="companion-art"></span></span><i class="g-rounds" id="gRoundsB"></i></div></div>${cheerBtn('POWER STRIKE')}`;
  hud.querySelectorAll('.companion[data-companion] .companion-art').forEach(a=>rig(a,a.parentElement.dataset.companion));dress(hud);
  const el=id=>hud.querySelector('#'+id),cheer=el('gCheer');
  const upd=()=>{el('gHpA').style.width=(100*A.hp/A.hpMax)+'%';el('gHpB').style.width=(100*B.hp/B.hpMax)+'%';el('gZealA').style.width=(100*A.energy/A.max)+'%';el('gZealB').style.width=(100*B.energy/B.max)+'%';el('gRoundsA').innerHTML='<b></b>'.repeat(A.wins);el('gRoundsB').innerHTML='<b></b>'.repeat(B.wins);cheer.classList.toggle('is-dim',A.energy<20||A.power);};
  let over=false,turn=0,timer=0,round=0,live=false,hitStop=0;
  const arm=()=>{if(over||!live||A.power)return;if(A.energy<20){cheer.classList.add('is-no');sfx.tired();setTimeout(()=>cheer.classList.remove('is-no'),300);return;}A.energy-=20;A.power=true;A.el.classList.add('is-charged');sfx.charge();cheer.classList.remove('is-pop');void cheer.offsetWidth;cheer.classList.add('is-pop');upd();};
  body.addEventListener('pointerdown',arm);cheer.addEventListener('pointerdown',e=>{e.stopPropagation();arm();});
  st.querySelector('.g-quit').onclick=()=>{over=true;clearTimeout(timer);st.remove();};
  const hit=(att,def)=>{
   if(att.energy<6){sfx.breath();att.el.dataset.anim='sleep';att.el.classList.add('is-breath');att.energy=Math.min(att.max,att.energy+att.max*0.3);setTimeout(()=>{att.el.classList.remove('is-breath');att.el.dataset.anim='idle';},500);return;}
   att.energy-=6;att.el.dataset.anim='knock';att.el.classList.add('is-lunge');setTimeout(()=>{att.el.classList.remove('is-lunge');att.el.dataset.anim='idle';},380);
   const dodge=Math.max(0.05,Math.min(0.4,0.12+(def.s.fly-att.s.run)/250));
   if(Math.random()<dodge){def.el.classList.add('is-dodge');const ghost=def.el.cloneNode(true);ghost.className=def.el.className+' is-ghost';ring.append(ghost);setTimeout(()=>ghost.remove(),350);setTimeout(()=>def.el.classList.remove('is-dodge'),380);att.power=false;att.el.classList.remove('is-charged');banner(st,'MISS','is-miss',450);sfx.miss();return;}
   let dmg=(8+att.s.power/4)*(0.85+Math.random()*0.3)*(att.me?1:LEVEL_EASE[level]);
   const block=Math.max(0,Math.min(0.5,def.s.swim/200));dmg*=1-block;
   if(att.power){dmg*=1.8;att.power=false;att.el.classList.remove('is-charged');}
   if(!att.me&&Math.random()<0.15&&att.energy>att.max*0.5)dmg*=1.6;
   def.hp=Math.max(0,def.hp-dmg);def.el.classList.add('is-hit');setTimeout(()=>def.el.classList.remove('is-hit'),320);
   const big=dmg>18,powered=att.power===false&&dmg>26;fxAt(def.el,big?'is-spark is-big':'is-spark',att.me?10:50,30,420);if(block>0.2){fxAt(def.el,'is-block',att.me?6:60,40,400);sfx.block();}
   const num=document.createElement('b');num.className='g-dmg '+(big?'is-big':'');num.textContent='-'+Math.round(dmg);def.el.append(num);setTimeout(()=>num.remove(),800);
   if(big){shake(st);sfx.bigHit();const pow=document.createElement('b');pow.className='g-pow';pow.textContent=['POW!','WHAM!','BAM!','SMACK!'][Math.floor(Math.random()*4)];pow.style.left=(att.me?'55%':'30%');ring.append(pow);setTimeout(()=>pow.remove(),650);hitStop=0.18;}else sfx.hit();
   if(def.hp<=0){def.el.dataset.anim='sleep';def.el.classList.add('is-ko');fxAt(def.el,'is-stars',30,-10,1400);body.classList.add('is-zoom');setTimeout(()=>body.classList.remove('is-zoom'),1400);}};
  const startRound=()=>{round++;for(const f of [A,B]){f.hp=f.hpMax;f.energy=f.max;f.power=false;f.el.className=`companion g-actor ${f.me?'is-me is-left':'is-right'}`;f.el.dataset.anim='idle';}upd();banner(st,`ROUND ${round}`,'is-round',900);sfx.gong();setTimeout(()=>{banner(st,'FIGHT!','is-go',600);sfx.fight();live=true;timer=setTimeout(loop,500);},1000);};
  const loop=()=>{if(over)return;const [att,def]=turn%2?[B,A]:[A,B];turn++;hit(att,def);upd();
   if(A.hp<=0||B.hp<=0){live=false;const w=B.hp<=0?A:B;w.wins++;upd();banner(st,'K.O.','is-ko',1000);sfx.ko();if(w.me)confetti(body);w.el.classList.add('is-happy');
    if(w.wins>=2){over=true;setTimeout(()=>{st.remove();finishKarate(mount,level,w===A,A,B);},1500);}else setTimeout(startRound,1700);return;}
   const speed=Math.max(380,760-att.s.run*3)+hitStop*1000;hitStop=0;timer=setTimeout(loop,reducedMotion()?250:speed);};
  setTimeout(startRound,500);
 }
 function finishKarate(mount,level,win,A,B){
  const prev=state.karate[level]||0;if(win)state.karate[level]=1;else if(!prev)state.karate[level]=2;
  let newBelt=null;if(win){const b=belts[level];const cur=belts.findIndex(x=>x.id===state.belts[A.id]);if(level>cur){state.belts[A.id]=b.id;newBelt=b;onBelt?.(A.id,b.id);}}
  save();
  if(newBelt)setTimeout(()=>sfx.prize(),500);else setTimeout(()=>win?sfx.medal():sfx.lose(),300);
  const trained=onResult?.(pick(),'karate','all',win?1:2)||[];
  const unlocked=win&&level<LEVELS.length-1&&prev!==1?`<p class="g-unlock">${LEVELS[level+1]} unlocked!</p>`:'';
  showModal(`<div class="modal-tag">KARATE DOJO · ${LEVELS[level].toUpperCase()}</div><div class="g-versus"><span class="companion ${win?'is-happy':''}" data-companion="${A.id}"><span class="companion-art"></span></span><b>${A.wins} – ${B.wins}</b><span class="companion ${win?'':'is-happy'}" data-companion="${B.id}"><span class="companion-art"></span></span></div>
   <div class="g-result">${medalDot(win?1:0,true)}</div><h2>${win?'Victory!':'Defeated'}</h2>${unlocked}
   ${newBelt?`<div class="g-prize"><span>${prizes.beltSvg(newBelt,56)}</span><div><b>${escapeText(newBelt.name)} earned!</b><small>${escapeText(A.name)} wears it from now on.</small></div></div>`:''}
   ${trained.length?`<p class="mini-muted">Trained ${trained.join(', ')}.</p>`:''}
   <button type="button" class="modal-button" id="gAgain">Fight again</button><button type="button" class="modal-button secondary" id="gBack">Back to the Stadium</button>`);
  $('modalContent').querySelectorAll('.companion[data-companion] .companion-art').forEach(a=>rig(a,a.parentElement.dataset.companion));dress($('modalContent'));
  $('gAgain').onclick=()=>{closeModal();startKarate(mount,level);};
  $('gBack').onclick=()=>{closeModal();render(mount);};
  render(mount);
 }
 return {render,state:()=>state,medalCounts,hasPrize,beltOf,prizeIds:()=>[...state.prizes]};
}
