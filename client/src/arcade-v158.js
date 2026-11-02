/* V158: Arcade minigames. One new minigame unlocks for every 250 new elements found in Alchemy
 * (the first one straight away). After all 16 planned minigames are unlocked, every 250 elements pays coins.
 * School levels and stats help in the matching minigames. No imports: everything comes through ctx. */
export const ARCADE_KEY='alchemy10k_arcade_v158';
/** V159 TESTER: every minigame open for testing. Set to false before the Play release. */
export const ARCADE_TESTER_ALL=true;
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
 function sync(){const p=arcadeProgress(st,ctx.count());st=p.state;if(ARCADE_TESTER_ALL){for(const g of ARCADE_GAMES)if(!st.unlocked.includes(g.id))st.unlocked.push(g.id);p.fresh=[];}save();
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
 // ---------- V160: props drawn in the game's own style (slate outlines, soft palette) ----------
 const SV=(vb,b)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" stroke="#657D89" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${b}</svg>`;
 const fishSvg=(c,belly,extra='')=>SV('0 0 60 36',`<path d="M15 18L3 7Q6 18 3 29Z" fill="${c}"/><path d="M27 8Q33 1 41 8" fill="${c}"/><ellipse cx="32" cy="18" rx="20" ry="12" fill="${c}"/><path d="M15 21Q32 33 50 21Q32 27 15 21Z" fill="${belly}" stroke="none"/>${extra}<circle cx="43" cy="15" r="2.8" fill="#20262b" stroke="none"/><circle cx="44" cy="14" r="1" fill="#fff" stroke="none"/><path d="M50 21q-2 1.6 -4 0" fill="none" stroke-width="1.6"/>`);
 const PROP={
  fishS:fishSvg('#7cc3e0','#dff1f7'),fishM:fishSvg('#e8a35f','#fff1dc','<path d="M26 9v18M34 7v22" stroke="#fff8ec" stroke-width="3"/>'),
  fishL:fishSvg('#f2a7b8','#fde6ec','<path d="M22 8l-3-5M32 6v-5M42 8l3-5M22 28l-3 5M42 28l3 5" stroke-width="2"/>'),fishG:fishSvg('#ffd166','#fff5d6','<path d="M30 12l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5Z" fill="#fff" stroke="none"/>'),
  boot:SV('0 0 40 40','<path d="M12 4h13v18l9 4q4 2 3 6v4H6V8Z" fill="#a0683c" stroke="#6b4426"/><path d="M12 11h13M6 31h31" stroke="#6b4426" stroke-width="2"/><path d="M9 4h19" stroke="#6b4426" stroke-width="3"/>'),
  chest:SV('0 0 44 36','<rect x="4" y="15" width="36" height="17" rx="3" fill="#C9934E" stroke="#7a5b3a"/><path d="M4 16Q4 4 22 4Q40 4 40 16Z" fill="#d9a466" stroke="#7a5b3a"/><path d="M4 16h36" stroke="#7a5b3a"/><rect x="18" y="12" width="8" height="9" rx="2" fill="#ffd166" stroke="#7a5b3a"/><circle cx="31" cy="9" r="2" fill="#fff" stroke="none"/>'),
  basket:SV('0 0 70 36','<path d="M12 16Q35 -8 58 16" fill="none" stroke="#7a5b3a" stroke-width="3.5"/><path d="M5 15h60l-7 19H12Z" fill="#e0b25a" stroke="#7a5b3a"/><path d="M9 22h52M11 28h48" stroke="#c9933e" stroke-width="2"/><path d="M20 15l3 19M35 15v19M50 15l-3 19" stroke="#c9933e" stroke-width="2"/><rect x="2" y="11" width="66" height="7" rx="3.5" fill="#C9934E" stroke="#7a5b3a"/>'),
  bucket:SV('0 0 44 46','<path d="M8 14Q22 -6 36 14" fill="none" stroke-width="2"/><path d="M7 14h30l-4 29H11Z" fill="#C9934E" stroke="#7a5b3a"/><path d="M8 22h28M10 33h24" stroke="#7a5b3a" stroke-width="2.5"/><ellipse cx="22" cy="14" rx="15" ry="4.5" fill="#7cc3e0" stroke="#7a5b3a"/>'),
  rock:SV('0 0 40 34','<path d="M6 24Q2 12 12 7Q20 2 30 6Q39 11 37 22Q34 31 22 31Q10 31 6 24Z" fill="#b8ada0"/><path d="M13 13q4-3 9-2" fill="none" stroke="#e9e4dc" stroke-width="2.5"/><path d="M25 21l5 3M21 25l2 3" stroke-width="2"/>'),
  bob:SV('0 0 20 30','<path d="M10 1v6" stroke-width="2"/><circle cx="10" cy="16" r="8" fill="#fff8ec"/><path d="M2 16a8 8 0 0 1 16 0Z" fill="#e0675a"/><circle cx="7" cy="12" r="1.6" fill="#fff" stroke="none"/>'),
  back:SV('0 0 60 80','<rect x="2" y="2" width="56" height="76" rx="9" fill="#d08a4c" stroke="#a86a33"/><rect x="8" y="8" width="44" height="64" rx="6" fill="none" stroke="#f3dfc8" stroke-width="2" stroke-dasharray="3 4"/><circle cx="30" cy="40" r="16" fill="#e8a35f" stroke="#f3dfc8" stroke-width="2"/><path d="M26 28h8M27.5 28v8l-6 10q-1.5 4 3 4h11q4.5 0 3-4l-6-10v-8" fill="#fff8ec" stroke="#a86a33" stroke-width="2"/><path d="M23 44h14l2.5 4q1 2-1.5 2h-16q-2.5 0-1.5-2Z" fill="#8fbf68" stroke="none"/><path d="M14 16l2 2M46 64l-2-2M46 16l-2 2M14 64l2-2" stroke="#f3dfc8" stroke-width="2"/>'),
  cauldron:SV('0 0 160 124','<g class="ar-flame"><path d="M56 116q6-24 22-30q-4 15 12 30Z" fill="#e8a35f" stroke="#c9733a"/><path d="M84 116q4-18 16-22q-2 12 8 22Z" fill="#e8a35f" stroke="#c9733a"/><path d="M68 116q5-12 11-14q-2 8 6 14Z" fill="#ffd166" stroke="none"/></g><rect x="36" y="110" width="88" height="10" rx="5" fill="#a0683c" stroke="#6b4426"/><path d="M40 98l-7 14M120 98l7 14" stroke="#4a555e" stroke-width="7"/><path d="M20 40Q16 104 80 106Q144 104 140 40Z" fill="#5b6770"/><path d="M33 56Q33 88 58 97" fill="none" stroke="#83939c" stroke-width="6"/><ellipse cx="80" cy="40" rx="64" ry="15" fill="#4a555e"/><ellipse class="ar-liq" cx="80" cy="40" rx="55" ry="10" fill="#9fd08c" stroke="none"/><circle class="ar-b1" cx="60" cy="40" r="5" fill="#c3e6a8" stroke="none"/><circle class="ar-b2" cx="96" cy="38" r="4" fill="#c3e6a8" stroke="none"/>'),
 };
 const LAB=SV('0 0 390 640','<rect width="390" height="640" fill="#efe3cf" stroke="none"/><g stroke="#e0d0b6" stroke-width="2" fill="none"><path d="M0 60h390M0 120h390M0 180h390M0 240h390M0 300h390M0 360h390M0 420h390M0 480h390"/><path d="M60 0v60M180 0v60M300 0v60M120 60v60M240 60v60M360 60v60M60 120v60M180 120v60M300 120v60M120 180v60M240 180v60M360 180v60M60 240v60M180 240v60M300 240v60M120 300v60M240 300v60M60 360v60M180 360v60M300 360v60M120 420v60M240 420v60"/></g>'
  +'<path d="M276 40h86v110h-86Z" fill="#bfe2f0"/><path d="M276 120q20-26 43-14q20-16 43 6v38h-86Z" fill="#9fcc72" stroke="none"/><path d="M319 40v110M276 95h86" stroke="#a0683c" stroke-width="5"/><rect x="270" y="34" width="98" height="122" rx="6" fill="none" stroke="#a0683c" stroke-width="7"/><rect x="264" y="152" width="110" height="10" rx="4" fill="#C9934E" stroke="#7a5b3a"/>'
  +'<rect x="16" y="128" width="170" height="11" rx="4" fill="#C9934E" stroke="#7a5b3a"/><path d="M34 139l10 16M168 139l-10 16" stroke="#7a5b3a" stroke-width="4"/><rect x="16" y="226" width="150" height="11" rx="4" fill="#C9934E" stroke="#7a5b3a"/><path d="M34 237l10 16M148 237l-10 16" stroke="#7a5b3a" stroke-width="4"/>'
  +'<path d="M30 128v-26q0-6 6-6h10q6 0 6 6v26Z" fill="#dff1f7"/><path d="M30 128v-14h22v14Z" fill="#b39ddb" stroke="none"/><rect x="33" y="88" width="16" height="8" rx="2" fill="#a0683c"/>'
  +'<path d="M70 128q-12 0-12-14t14-16v-10h8v10q14 2 14 16t-12 14Z" fill="#dff1f7"/><path d="M59 116q2 12 23 12q10 0 13-12Z" fill="#8fbf68" stroke="none"/><path d="M70 128q-12 0-12-14t14-16v-10h8v10q14 2 14 16t-12 14Z" fill="none"/>'
  +'<rect x="104" y="100" width="18" height="28" rx="4" fill="#dff1f7"/><rect x="104" y="112" width="18" height="16" rx="4" fill="#f2a7b8" stroke="none"/><rect x="104" y="100" width="18" height="28" rx="4" fill="none"/><rect x="132" y="82" width="40" height="46" rx="6" fill="#e9dcc6"/><path d="M140 96h24M140 106h20M140 116h24" stroke-width="2"/>'
  +'<path d="M36 226v-20l-6-12h24l-6 12v20Z" fill="#dff1f7"/><path d="M36 226v-10h12v10Z" fill="#7cc3e0" stroke="none"/><circle cx="84" cy="208" r="16" fill="#dff1f7"/><path d="M68 210q16 8 32 0q0 14-16 14t-16-14Z" fill="#ffd166" stroke="none"/><circle cx="84" cy="208" r="16" fill="none"/><rect x="80" y="186" width="8" height="8" fill="#a0683c"/><path d="M116 226h40v-26q0-4-4-4h-32q-4 0-4 4Z" fill="#a0683c" stroke="#6b4426"/><path d="M116 208h40" stroke="#6b4426"/>'
  +'<path d="M210 0v40M240 0v28M226 0v54" stroke="#7a5b3a" stroke-width="2"/><path d="M204 40q6 14 12 0q-6-4-12 0ZM234 28q6 14 12 0q-6-4-12 0ZM220 54q6 14 12 0q-6-4-12 0Z" fill="#8fbf68" stroke="#4d7a3c" stroke-width="2"/>'
  +'<rect x="0" y="500" width="390" height="140" fill="#d9b27c" stroke="none"/><path d="M0 500h390" stroke="#a0683c" stroke-width="5"/><g stroke="#b88a52" stroke-width="2"><path d="M0 540h390M0 580h390M0 620h390M70 500v40M200 500v40M330 500v40M140 540v40M270 540v40M40 580v40M180 580v40M310 580v40"/></g>').replace('<svg ','<svg preserveAspectRatio="xMidYMax slice" ');
 const svgUrl=k=>ctx.art?.[k]?`url("data:image/svg+xml,${encodeURIComponent(ctx.art[k])}")`:'none';
 const SCENE={
  memory:'<i class="ar-sky"></i><i class="ar-mid"></i><i class="ar-grass"></i>',
  duel:'<i class="ar-dojo"></i>',
  recipe:`<div class="ar-lab">${LAB}</div>`,
  catch:'<i class="ar-sky"></i>'+'<i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:1"></i><i class="g-cloud" style="--d:2"></i>'+'<i class="ar-mid"></i><i class="ar-grass"></i>',
  fish:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-water"><b></b></i>',
  glide:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:1"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',
 };
 // ---------- shared stage (V159: scenery, countdown, pops, bursts, animated companion) ----------
 function companionEl(cls=''){const id=ctx.activeId?.();const el=document.createElement('span');el.className='companion ar-cmp '+cls;el.dataset.anim='idle';el.dataset.face='right';if(id)el.dataset.companion=id;
  const a=document.createElement('span');a.className='companion-art';a.innerHTML=ctx.sprite?.(id)||'';for(const g of a.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}
  const sv=a.querySelector('svg');if(sv){sv.setAttribute('width','100%');sv.setAttribute('height','100%');}el.append(a);const sh=document.createElement('i');sh.className='ar-shadow';el.append(sh);return el;}
 function stage(title,scene){const s=document.createElement('div');s.className='ar-stage is-'+scene;for(const k of ['sky','mid','run','swim','climb','dojo'])s.style.setProperty('--'+k,svgUrl(k));s.innerHTML=`<div class="g-stage-top ar-top"><strong>${escapeText(title)}</strong><span class="ar-combo" hidden></span><span class="ar-score">0</span><span class="ar-time"></span><button type="button" class="g-quit" aria-label="Quit">✕</button></div><div class="ar-body"><div class="ar-scene">${SCENE[scene]||''}</div></div><div class="ar-hint"></div>`;document.body.append(s);
  const sc=s.querySelector('.ar-score');
  const o={el:s,body:s.querySelector('.ar-body'),score:0,over:false,timers:[],combo:0,
   set(v){const n=Math.max(0,Math.round(v));if(n!==o.score){o.score=n;sc.textContent=n;sc.classList.remove('is-bump');void sc.offsetWidth;sc.classList.add('is-bump');}},add(v){o.set(o.score+v);},
   time(t){const e=s.querySelector('.ar-time');e.textContent=t>=0?`⏱ ${Math.ceil(t)}`:'';e.classList.toggle('is-low',t>=0&&t<=5);},hint(t){s.querySelector('.ar-hint').textContent=t||'';},
   later(fn,ms){const t=setTimeout(()=>{if(!o.over)fn();},ms);o.timers.push(t);return t;},
   streak(ok){o.combo=ok?o.combo+1:0;const c=s.querySelector('.ar-combo');c.hidden=o.combo<2;if(o.combo>=2){c.textContent=`x${o.combo}`;c.classList.remove('is-bump');void c.offsetWidth;c.classList.add('is-bump');}return o.combo;},
   pop(x,y,text,cls=''){const e=document.createElement('span');e.className='ar-pop '+cls;e.textContent=text;e.style.left=x+'px';e.style.top=y+'px';o.body.append(e);setTimeout(()=>e.remove(),900);},
   burst(x,y,kind='star',n=10){const b=document.createElement('span');b.className='ar-burst is-'+kind;b.style.left=x+'px';b.style.top=y+'px';for(let i=0;i<n;i++){const p=document.createElement('i');const a=(i/n)*Math.PI*2+Math.random()*0.4,d=34+Math.random()*30;p.style.setProperty('--dx',(Math.cos(a)*d).toFixed(1)+'px');p.style.setProperty('--dy',(Math.sin(a)*d).toFixed(1)+'px');b.append(p);}o.body.append(b);setTimeout(()=>b.remove(),800);},
   shake(){s.classList.remove('is-shake');void s.offsetWidth;s.classList.add('is-shake');},
   rect(el){const r=el.getBoundingClientRect(),b=o.body.getBoundingClientRect();return {x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2,w:r.width,h:r.height};},
   end:null};
  s.querySelector('.g-quit').onclick=()=>o.finish(true);
  o.finish=(quit=false)=>{if(o.over)return;o.over=true;o.timers.forEach(clearTimeout);cancelAnimationFrame(o.raf);o.end?.();if(quit){s.remove();return;}
   const t=document.createElement('div');t.className='g-banner is-in ar-end';t.textContent=o.endText||'Time!';s.append(t);sfx.prize();setTimeout(()=>{s.remove();result(o.id,o.score,o.statKey);},1100);};
  o.countdown=(go)=>{const c=document.createElement('div');c.className='g-banner is-count';s.append(c);const seq=['3','2','1','GO!'];let i=0;const tick=()=>{if(o.over){c.remove();return;}c.textContent=seq[i];c.className='g-banner '+(i===3?'is-go':'is-count');void c.offsetWidth;c.classList.add('is-in');i===3?sfx.go():sfx.tick();i++;if(i<seq.length)setTimeout(tick,650);else setTimeout(()=>{c.remove();if(!o.over)go();},500);};tick();};
  return o;}
 function result(id,score,statKey){const g=ARCADE_GAMES.find(x=>x.id===id);const prev=st.best[id]||0;const rec=score>prev;if(rec){st.best[id]=score;save();}
  const coins=Math.min(300,Math.round(score/20));if(coins)ctx.addCoins?.(coins);if(statKey&&score>0)ctx.train?.(statKey,Math.min(12,1+Math.round(score/150)));
  const stars=score>=prev*1.2&&score>0?3:score>0?(rec?3:2):1;
  showModal(`<div class="modal-tag">MINIGAME</div><div class="ar-res-stars">${[1,2,3].map(i=>`<i class="${i<=stars?'on':''}" style="--i:${i}">★</i>`).join('')}</div><div class="ar-big">${g.icon}</div><h2 class="ar-res-score" data-to="${score}">0</h2><p>${rec?'<b class="ar-rec-badge">New best!</b>':`Best: ${prev.toLocaleString('en-US')}`}</p><p class="ar-help">🪙 +${coins} coins${statKey&&score>0?` · ${({run:'Run',swim:'Swim',fly:'Fly',power:'Power',stamina:'Stamina'})[statKey]} training`:''}</p>
   <button type="button" class="modal-button" id="arAgain">Play again</button><button type="button" class="modal-button secondary" id="arDone">Back to minigames</button>`);
  const h=document.querySelector('.ar-res-score');const t0=performance.now();const up=t=>{const k=Math.min(1,(t-t0)/700);if(h&&document.body.contains(h)){h.textContent=Math.round(score*k).toLocaleString('en-US')+' pts';if(k<1)requestAnimationFrame(up);}};requestAnimationFrame(up);
  $('arAgain').onclick=()=>{closeModal();setTimeout(()=>GAMES[id](),300);};$('arDone').onclick=()=>open();}
 const timer=(o,secs,done)=>{let t=secs;o.time(t);const tick=()=>{t-=0.25;o.time(t);if(t<=0){done();return;}if(t<=5&&Math.abs(t-Math.round(t))<0.01)sfx.tick();o.later(tick,250);};o.later(tick,250);};
 // ---------- 1. Element Memory: 3D flips, companion really shuffles the cards ----------
 function memory(){const o=stage('Element Memory','memory');o.id='memory';const d=lvl('draw');const ids=pick(ctx.unlocked(),6);if(ids.length<6){o.finish(true);toast('Find a few more elements first','repeat');return;}
  const cards=pick([...ids,...ids],12);const me=companionEl('ar-mem-cmp');
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-blanket"></div><div class="ar-mem">${cards.map((id,i)=>`<button type="button" class="ar-card is-up" data-id="${id}" style="--i:${i}"><span class="ar-card-in"><span class="ar-face">${art(id)}</span><span class="ar-back">${PROP.back}</span></span></button>`).join('')}</div>`);o.body.prepend(me);ctx.wear?.(o.body);
  const grid=o.body.querySelector('.ar-mem');let open=[],lock=true,pairs=0,left=60;
  o.hint('Remember them!');
  const shuffle=()=>{const live=[...grid.querySelectorAll('.ar-card:not(.is-done)')];if(live.length<=3||lock){o.later(shuffle,4000);return;}
   lock=true;me.dataset.anim='duo-throw';o.hint('Shuffle!');sfx.swish?.();const first=new Map(live.map(c=>[c,c.getBoundingClientRect()]));const order=pick(live,live.length);const slots=live.map(c=>c.nextSibling);
   order.forEach(n=>grid.append(n));[...grid.children].filter(c=>c.classList.contains('is-done')).forEach(c=>grid.append(c));
   for(const c of live){const a=first.get(c),b=c.getBoundingClientRect();c.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) rotate(0)`},{transform:`translate(${(a.left-b.left)/2}px,${(a.top-b.top)/2-40}px) rotate(${Math.random()*30-15}deg)`},{transform:'none'}],{duration:650,easing:'ease-in-out'});}
   o.later(()=>{me.dataset.anim='idle';lock=false;o.hint('Find the pairs');},700);o.later(shuffle,(14+d*5)*1000);};
  o.countdown(()=>{o.later(()=>{grid.querySelectorAll('.ar-card').forEach((c,i)=>setTimeout(()=>c.classList.remove('is-up'),i*40));lock=false;o.hint('Find the pairs');},1200+d*500);o.later(shuffle,(14+d*5)*1000);timer(o,60,()=>{o.endText='Time!';o.finish();});const lt=setInterval(()=>{left-=1;if(o.over)clearInterval(lt);},1000);});
  grid.onclick=e=>{const c=e.target.closest('.ar-card');if(!c||lock||c.classList.contains('is-up'))return;c.classList.add('is-up');open.push(c);sfx.tap?.();
   if(open.length===2){lock=true;const [a,b]=open;if(a.dataset.id===b.dataset.id){const k=o.streak(true);setTimeout(()=>{a.classList.add('is-done');b.classList.add('is-done');const p=o.rect(b);o.burst(p.x,p.y,'star');o.pop(p.x,p.y-20,`+${100*Math.min(k||1,3)}`);o.add(100*Math.min(k||1,3));me.dataset.anim='duo-cheer';setTimeout(()=>me.dataset.anim='idle',700);sfx.unlock?.();open=[];lock=false;pairs++;if(pairs===6){o.add(Math.round(left*5));o.endText='All pairs!';o.finish();}},350);}
    else{o.streak(false);setTimeout(()=>{a.classList.add('is-wrong');b.classList.add('is-wrong');me.dataset.anim='shake';},350);o.later(()=>{a.classList.remove('is-up','is-wrong');b.classList.remove('is-up','is-wrong');me.dataset.anim='idle';open=[];lock=false;},900);}}};}
 // ---------- 2. Fire · Water · Earth: cards fly and clash ----------
 function duel(){const o=stage('Fire · Water · Earth','duel');o.id='duel';const j=lvl('juggle');const T=['fire','water','earth'],BEATS={water:'fire',fire:'earth',earth:'water'};const EL={water:'legacy:0',fire:'legacy:1',earth:'legacy:2'};const ICON={fire:art(EL.fire)||'🔥',water:art(EL.water)||'💧',earth:art(EL.earth)||'🪨'};
  const me=companionEl('ar-duel-me');const foeC=companionEl('ar-duel-foe');foeC.dataset.face='left';
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-duel"><div class="ar-arena"><span class="ar-foe-card"><b></b><i class="ar-ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/></svg></i></span></div><div class="ar-hand">${T.map(t=>`<button type="button" class="ar-pick is-${t}" data-t="${t}"><span class="ar-pick-art">${ICON[t]}</span><small>${t}</small></button>`).join('')}</div></div>`);
  const arena=o.body.querySelector('.ar-arena');arena.append(me,foeC);ctx.wear?.(o.body);foeC.querySelector('.companion-art').style.filter='hue-rotate(160deg) saturate(.8)';
  const foe=o.body.querySelector('.ar-foe-card'),face=foe.querySelector('b'),ring=foe.querySelector('circle');let cur=null,deadline=0,win=1.8+j*0.2;
  const next=()=>{win=Math.max(0.95,1.8-o.score/800)+j*0.2;cur=T[Math.floor(Math.random()*3)];face.innerHTML=ICON[cur];foe.className='ar-foe-card is-in is-'+cur;foeC.dataset.anim='duo-throw';setTimeout(()=>foeC.dataset.anim='idle',400);deadline=performance.now()+win*1000;};
  const fly=(t,ok)=>{const b=o.body.querySelector(`[data-t="${t}"]`);const a=o.rect(b),f=o.rect(foe);const m=document.createElement('span');m.className='ar-fly ar-fly-el';m.innerHTML=ICON[t];m.style.left=a.x+'px';m.style.top=a.y+'px';o.body.append(m);
   m.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:`translate(calc(-50% + ${(f.x-a.x)/2}px),calc(-50% + ${(f.y-a.y)/2-60}px)) scale(1.4) rotate(180deg)`},{transform:`translate(calc(-50% + ${f.x-a.x}px),calc(-50% + ${f.y-a.y}px)) scale(1) rotate(360deg)`}],{duration:260,easing:'ease-in'}).onfinish=()=>{m.remove();o.burst(f.x,f.y,ok===1?t:ok===0?'smoke':'smoke',ok===1?14:8);};};
  const loop=t=>{if(o.over)return;const k=Math.max(0,(deadline-t)/(win*1000));ring.style.strokeDashoffset=(107*(1-k)).toFixed(1);if(cur&&k<=0){o.add(-5);o.streak(false);foe.className='ar-foe-card is-miss';o.shake();sfx.miss?.();me.dataset.anim='shake';setTimeout(()=>me.dataset.anim='idle',500);cur=null;o.later(next,450);}o.raf=requestAnimationFrame(loop);};
  o.body.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{if(!cur)return;const t=b.dataset.t;b.classList.remove('is-tap');void b.offsetWidth;b.classList.add('is-tap');me.dataset.anim='duo-throw';setTimeout(()=>me.dataset.anim='idle',350);
   const f=o.rect(foe);if(BEATS[t]===cur){const k=o.streak(true);const pts=(10+Math.round(10*Math.max(0,(deadline-performance.now())/(win*1000))))*Math.min(3,1+Math.floor(k/5));fly(t,1);setTimeout(()=>{o.add(pts);o.pop(f.x,f.y-50,`+${pts}`);foe.className='ar-foe-card is-win';foeC.dataset.anim='shake';sfx.kick?.();},260);}
   else if(t===cur){fly(t,0);setTimeout(()=>{foe.className='ar-foe-card is-tie';o.pop(f.x,f.y-50,'tie','is-meh');},260);}else{o.streak(false);fly(t,-1);setTimeout(()=>{o.add(-5);o.pop(f.x,f.y-50,'-5','is-bad');foe.className='ar-foe-card is-miss';o.shake();sfx.miss?.();},260);}cur=null;o.later(next,620);});
  o.hint('Water › Fire › Earth › Water');o.countdown(()=>{next();o.raf=requestAnimationFrame(loop);timer(o,30,()=>o.finish());});}
 // ---------- 3. Recipe Rush: the pair drops into a bubbling cauldron ----------
 function recipe(){const o=stage('Recipe Rush','recipe');o.id='recipe';const m=lvl('magic');const pool=ctx.knownRecipes();if(pool.length<6){o.finish(true);toast('Discover a few more recipes first','repeat');return;}
  let round=0;const N=10,secs=5+m*0.3;const me=companionEl('ar-rec-cmp');
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-rec"><small class="ar-rec-n"></small><div class="ar-rec-target"></div><div class="ar-cauldron">${PROP.cauldron}<i class="ar-bub"></i><i class="ar-bub"></i><i class="ar-bub"></i><i class="ar-fuse"><em></em></i></div><div class="ar-rec-opts"></div></div>`);
  o.body.querySelector('.ar-rec').append(me);ctx.wear?.(o.body);const tgt=o.body.querySelector('.ar-rec-target'),opts=o.body.querySelector('.ar-rec-opts'),fuse=o.body.querySelector('.ar-fuse em'),cauldron=o.body.querySelector('.ar-cauldron');
  const ask=()=>{if(round>=N){o.endText='Done!';o.finish();return;}round++;o.body.querySelector('.ar-rec-n').textContent=`Question ${round}/${N}`;const [ra,rb,res]=pool[Math.floor(Math.random()*pool.length)];const wrong=pick(pool.filter(p=>p[2]!==res),3).map(p=>[p[0],p[1]]);const list=pick([[ra,rb],...wrong],4);
   tgt.innerHTML=`<span class="ar-rec-glow">${art(res)}</span><b>${escapeText(itemName(res))}</b>`;tgt.classList.remove('is-in');void tgt.offsetWidth;tgt.classList.add('is-in');
   opts.innerHTML=list.map(([a,b],i)=>`<button type="button" class="ar-rec-opt" style="--i:${i}" data-ok="${a===ra&&b===rb?1:0}"><span>${art(a)}</span><em>+</em><span>${art(b)}</span></button>`).join('');
   const t0=performance.now();let done=false;
   if(m>=2){const bad=[...opts.querySelectorAll('[data-ok="0"]')];o.later(()=>bad[0]?.classList.add('is-fade'),1500);if(m>=4)o.later(()=>bad[1]?.classList.add('is-fade'),2500);}
   const loop=t=>{if(o.over||done)return;const k=1-(t-t0)/(secs*1000);fuse.style.width=Math.max(0,k*100)+'%';fuse.parentElement.classList.toggle('is-low',k<0.3);if(k<=0){done=true;opts.querySelector('[data-ok="1"]').classList.add('is-ok');o.streak(false);me.dataset.anim='shake';cauldron.classList.add('is-smoke');sfx.miss?.();o.later(()=>{cauldron.classList.remove('is-smoke');me.dataset.anim='idle';ask();},1000);return;}o.raf=requestAnimationFrame(loop);};o.raf=requestAnimationFrame(loop);
   opts.querySelectorAll('.ar-rec-opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=b.dataset.ok==='1';
    // the two ingredients fly into the cauldron
    const c=o.rect(cauldron);b.querySelectorAll('span').forEach((sp,i)=>{const r=o.rect(sp);const f=document.createElement('span');f.className='ar-ingr';f.innerHTML=sp.innerHTML;f.style.left=r.x+'px';f.style.top=r.y+'px';o.body.append(f);f.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${(c.x-r.x)/2}px),calc(-50% + ${(c.y-r.y)/2-70}px)) rotate(${i?200:-200}deg)`},{transform:`translate(calc(-50% + ${c.x-r.x}px),calc(-50% + ${c.y-40-r.y}px)) scale(.4)`}],{duration:420,easing:'ease-in'}).onfinish=()=>f.remove();});
    setTimeout(()=>{if(ok){const k=o.streak(true);const pts=(100+Math.round(100*Math.max(0,1-(performance.now()-t0)/(secs*1000))))*(k>=3?2:1);o.add(pts);o.pop(c.x,c.y-80,`+${pts}`);o.burst(c.x,c.y-40,'magic',16);cauldron.classList.add('is-boil');me.dataset.anim='duo-cheer';tgt.classList.add('is-made');sfx.unlock?.();}
     else{o.streak(false);opts.querySelector('[data-ok="1"]').classList.add('is-ok');b.classList.add('is-bad');cauldron.classList.add('is-smoke');me.dataset.anim='shake';o.shake();sfx.miss?.();}
     o.later(()=>{cauldron.classList.remove('is-boil','is-smoke');tgt.classList.remove('is-made');me.dataset.anim='idle';ask();},900);},430);
    b.classList.add(ok?'is-ok':'is-picked');});};
  o.time(-1);o.countdown(ask);}
 // ---------- 4. Falling Finds: parallax meadow, basket, tumbling items ----------
 function catcher(){const o=stage('Falling Finds','catch');o.id='catch';o.statKey='run';const sp=1+stat('run')/99,wide=1+0.06*lvl('dance');const ids=pick(ctx.unlocked(),12);
  const me=companionEl('ar-catcher');me.style.setProperty('--w',wide);me.insertAdjacentHTML('beforeend',`<i class="ar-basket">${PROP.basket}</i>`);o.body.append(me);ctx.wear?.(o.body);const box=o.body;
  let W=box.clientWidth,H=box.clientHeight,x=W/2,tx=x,stun=0,items=[],spawn=0,run=false;
  box.addEventListener('pointerdown',e=>{tx=e.clientX-box.getBoundingClientRect().left;});box.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')tx=e.clientX-box.getBoundingClientRect().left;});
  let last=performance.now();const loop=t=>{if(o.over)return;const dt=Math.min(0.05,(t-last)/1000);last=t;W=box.clientWidth;H=box.clientHeight;const gy=H*0.82;
   if(stun<=0){const dx=tx-x;const step=Math.sign(dx)*Math.min(Math.abs(dx),dt*360*sp);x+=step;me.dataset.anim=Math.abs(dx)>4?'walk':'idle';if(Math.abs(dx)>4)me.dataset.face=dx>0?'right':'left';}else{stun-=dt;me.dataset.anim='shake';}
   me.style.transform=`translate3d(${x-29}px,${gy-58}px,0)`;
   if(run){spawn-=dt;if(spawn<=0){spawn=Math.max(0.32,0.6-o.score/2000);const kind=Math.random();const rock=kind<0.2,gold=!rock&&kind>0.93;const el=document.createElement('span');el.className='ar-fall'+(rock?' is-rock':gold?' is-gold':'');el.innerHTML=rock?PROP.rock:art(ids[Math.floor(Math.random()*ids.length)]);box.append(el);items.push({el,x:24+Math.random()*(W-48),y:-40,v:140+Math.random()*90+o.score*0.12,rock,gold,r:Math.random()*360,vr:(Math.random()-.5)*300});}}
   for(const it of items){it.y+=it.v*dt;it.r+=it.vr*dt;it.el.style.transform=`translate3d(${it.x-18}px,${it.y}px,0) rotate(${it.r}deg)`;
    if(!it.hit&&it.y>gy-90&&it.y<gy-30&&Math.abs(it.x-x)<34*wide){it.hit=true;it.el.remove();if(it.rock){o.add(-20);o.streak(false);stun=0.8;o.shake();o.burst(x,gy-60,'smoke',8);o.pop(x,gy-90,'-20','is-bad');sfx.miss?.();}else{const k=o.streak(true);const pts=(it.gold?50:10)*Math.min(3,1+Math.floor(k/8));o.add(pts);o.pop(x,gy-90,`+${pts}`,it.gold?'is-gold':'');o.burst(x,gy-70,it.gold?'gold':'star',it.gold?14:6);sfx.tap?.();me.classList.remove('is-catch');void me.offsetWidth;me.classList.add('is-catch');}}
    if(!it.hit&&it.y>gy){it.hit=true;it.el.classList.add('is-land');setTimeout(()=>it.el.remove(),400);if(!it.rock)o.streak(false);}}
   items=items.filter(i=>!i.hit);o.raf=requestAnimationFrame(loop);};o.raf=requestAnimationFrame(loop);o.hint('Drag to move · golden ones are worth 50');o.countdown(()=>{run=true;timer(o,40,()=>o.finish());});}
 // ---------- 5. Pond Fishing: ripples, fish shadows, rod cast, catch flies to the bucket ----------
 function fish(){const o=stage('Pond Fishing','fish');o.id='fish';o.statKey='swim';const win=450+lvl('drums')*80+stat('swim')*2;const FISH=[[PROP.fishS,30,'Minnow'],[PROP.fishM,50,'Clownfish'],[PROP.fishL,80,'Puffer'],[PROP.chest,120,'Treasure'],[PROP.fishG,150,'Golden fish'],[PROP.boot,5,'Old boot']];
  const me=companionEl('ar-fisher');o.body.insertAdjacentHTML('beforeend',`<div class="ar-pond"><i class="ar-dock"></i>${'<i class="ar-shadowfish"></i>'.repeat(4)}<svg class="ar-rod" viewBox="0 0 300 200" preserveAspectRatio="none"><path class="ar-line2" d="M66 52 Q120 58 165 84" fill="none" stroke="#657D89" stroke-width="1.6"/></svg><span class="ar-bob">${PROP.bob}<i></i></span><span class="ar-bucket">${PROP.bucket}<b>0</b></span><span class="ar-catchfx"></span><button type="button" class="g-cheer ar-act">CAST</button></div>`);
  const pond=o.body.querySelector('.ar-pond');pond.append(me);ctx.wear?.(o.body);const btn=pond.querySelector('.ar-act'),bob=pond.querySelector('.ar-bob'),fx=pond.querySelector('.ar-catchfx'),line=pond.querySelector('.ar-line2'),bucket=pond.querySelector('.ar-bucket b');let phase='idle',biteAt=0,caught=0;
  const say=t=>{fx.textContent=t;fx.classList.remove('is-in');void fx.offsetWidth;fx.classList.add('is-in');};
  btn.onclick=()=>{if(o.over)return;if(phase==='idle'){phase='wait';me.dataset.anim='duo-throw';setTimeout(()=>me.dataset.anim='idle',400);pond.classList.add('is-cast');bob.className='ar-bob is-cast';btn.textContent='WAIT…';sfx.swish?.();const w=1000+Math.random()*3000;
    o.later(()=>{if(phase!=='wait')return;bob.classList.add('is-nibble');},w*0.6);
    o.later(()=>{if(phase!=='wait')return;phase='bite';biteAt=performance.now();bob.className='ar-bob is-bite';btn.textContent='PULL!';btn.classList.add('is-hot');sfx.tick?.();const r=o.rect(bob);o.burst(r.x,r.y,'water',8);
     o.later(()=>{if(phase==='bite'){phase='idle';bob.className='ar-bob';pond.classList.remove('is-cast');btn.textContent='CAST';btn.classList.remove('is-hot');say('Got away…');o.streak(false);}},win);},w);}
   else if(phase==='wait'){phase='idle';bob.className='ar-bob';pond.classList.remove('is-cast');btn.textContent='CAST';say('Too early!');o.streak(false);}
   else if(phase==='bite'){phase='idle';btn.classList.remove('is-hot');const q=1-(performance.now()-biteAt)/win;const roll=Math.random()*(0.6+q*0.6);const f=roll>1.05?FISH[4]:roll>0.9?FISH[3]:roll>0.7?FISH[2]:roll>0.35?FISH[1]:roll>0.12?FISH[0]:FISH[5];
    const k=f[1]>5?o.streak(true):o.streak(false);const pts=f[1]*(k>=3?2:1);me.dataset.anim=f[1]>5?'duo-cheer':'shake';setTimeout(()=>me.dataset.anim='idle',800);
    const r=o.rect(bob),b=o.rect(pond.querySelector('.ar-bucket'));const c=document.createElement('span');c.className='ar-fly ar-fly-fish';c.innerHTML=f[0];c.style.left=r.x+'px';c.style.top=r.y+'px';o.body.append(c);o.burst(r.x,r.y,'water',12);
    c.animate([{transform:'translate(-50%,-50%) scale(.6)'},{transform:`translate(calc(-50% + ${(b.x-r.x)/2}px),calc(-50% + ${-140}px)) scale(1.8) rotate(-30deg)`},{transform:`translate(calc(-50% + ${b.x-r.x}px),calc(-50% + ${b.y-r.y}px)) scale(.8)`}],{duration:800,easing:'ease-in-out'}).onfinish=()=>{c.remove();if(f[1]>5){caught++;bucket.textContent=caught;}o.add(pts);o.pop(b.x,b.y-40,`+${pts}`);};
    bob.className='ar-bob';pond.classList.remove('is-cast');btn.textContent='CAST';say(f[1]>5?`${f[2]}!`:'An old boot…');sfx.unlock?.();}};
  o.countdown(()=>timer(o,45,()=>o.finish()));}
 // ---------- 6. Sky Glide (V161: Flappy-style tight controls) ----------
 // Fixed 120 Hz physics, a tap SETS the upward speed (never adds), constant gravity, capped fall speed,
 // nose follows the speed, and a small round hitbox tested against the pillar rectangles.
 function glide(){const o=stage('Sky Glide','glide');o.id='glide';o.statKey='fly';const f=stat('fly');const ids=pick(ctx.unlocked(),8);
  const G=1900-f*4,FLAP=560+f*0.8,MAXV=820,R=17,SZ=56,PX=72,COLW=56,STEP=1/120;
  const me=companionEl('ar-glider');me.dataset.anim='fly';o.body.append(me);ctx.wear?.(o.body);const box=o.body;
  let W=box.clientWidth,H=box.clientHeight,GY=H*0.78;const ro=new ResizeObserver(()=>{W=box.clientWidth;H=box.clientHeight;GY=H*0.78;});ro.observe(box);o.end=()=>ro.disconnect();
  let y=H*0.4,py=y,v=0,rot=0,dist=0,obs=[],gap=0,started=false,dead=false,acc=0,passed=0,trailT=0;o.bonus=0;
  const flap=e=>{e?.preventDefault?.();if(o.over||dead)return;if(!started){started=true;o.hint('');}v=-FLAP;me.classList.remove('is-flap');void me.offsetWidth;me.classList.add('is-flap');sfx.tap?.();};
  box.addEventListener('pointerdown',flap);
  const hit=(cx,cy,rx,ry,rw,rh)=>{const nx=Math.max(rx,Math.min(cx,rx+rw)),ny=Math.max(ry,Math.min(cy,ry+rh));return (cx-nx)**2+(cy-ny)**2<R*R;};
  const spawn=()=>{const hole=Math.max(150,185-dist/250)+Math.min(45,f*0.45);const top=60+Math.random()*Math.max(10,GY-hole-120);
   const el=document.createElement('div');el.className='ar-col';el.innerHTML=`<i style="height:${top+6}px"></i><i style="top:${top+hole}px"></i>`;box.append(el);
   const pk=document.createElement('span');pk.className='ar-fall is-pick';pk.innerHTML=art(ids[Math.floor(Math.random()*ids.length)]);box.append(pk);obs.push({el,pk,x:W+20,top,hole,scored:false});};
  const die=()=>{dead=true;sfx.miss?.();o.shake();o.burst(PX+SZ/2,y+SZ/2,'smoke',12);me.dataset.anim='shake';o.endText='Bonk!';setTimeout(()=>o.finish(),350);};
  const physics=dt=>{py=y;v=Math.min(MAXV,v+G*dt);y+=v*dt;if(y<-SZ*0.3){y=-SZ*0.3;v=0;}
   const speed=Math.min(240,165+dist*0.004);dist+=speed*dt;
   gap-=speed*dt;if(gap<=0){gap=235;spawn();}
   const cx=PX+SZ/2,cy=y+SZ/2;if(cy+R>=GY){y=GY-R-SZ/2;return die();}
   for(const ob of obs){ob.x-=speed*dt;
    if(ob.x<cx+R&&ob.x+COLW>cx-R&&(hit(cx,cy,ob.x,-50,COLW,ob.top+50)||hit(cx,cy,ob.x,ob.top+ob.hole,COLW,H)))return die();
    if(ob.pk&&Math.abs(ob.x+COLW/2-cx)<R+16&&Math.abs(ob.top+ob.hole/2-cy)<R+16){const p={x:ob.x+COLW/2,y:ob.top+ob.hole/2};ob.pk.remove();ob.pk=null;o.bonus+=25;o.pop(p.x,p.y-20,'+25');o.burst(p.x,p.y,'star',8);sfx.unlock?.();}
    if(!ob.scored&&ob.x+COLW<cx-R){ob.scored=true;passed++;o.bonus+=10;}
    if(ob.x<-80){ob.el.remove();ob.pk?.remove();ob.gone=true;}}
   obs=obs.filter(b=>!b.gone);};
  let last=performance.now();
  const loop=t=>{if(o.over)return;const dt=Math.min(0.1,(t-last)/1000);last=t;
   if(!started){y=H*0.4+Math.sin(t/260)*7;me.style.transform=`translate3d(${PX}px,${y}px,0)`;o.raf=requestAnimationFrame(loop);return;}
   if(!dead){acc+=dt;while(acc>=STEP&&!dead){physics(STEP);acc-=STEP;}}
   const a=dead?1:acc/STEP,ry=py+(y-py)*a;
   // Flappy feel: nose up right after a tap, dives once falling fast
   const want=v<0?-22:Math.min(70,-22+(v/MAXV)*110);rot+=(want-rot)*Math.min(1,dt*(v<0?20:7));
   me.style.transform=`translate3d(${PX}px,${ry.toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg)`;
   for(const ob of obs){ob.el.style.transform=`translate3d(${ob.x.toFixed(1)}px,0,0)`;if(ob.pk)ob.pk.style.transform=`translate3d(${(ob.x+COLW/2-19).toFixed(1)}px,${(ob.top+ob.hole/2-19).toFixed(1)}px,0)`;}
   o.set(dist/10+o.bonus);o.el.style.setProperty('--px',(-dist*0.15%4000).toFixed(1)+'px');o.el.style.setProperty('--px2',(-dist*0.5%4000).toFixed(1)+'px');
   trailT-=dt;if(!dead&&trailT<=0){trailT=0.06;const s=document.createElement('i');s.className='ar-trail';s.style.transform=`translate3d(${PX+6}px,${ry+SZ/2}px,0)`;box.append(s);setTimeout(()=>s.remove(),600);}
   o.raf=requestAnimationFrame(loop);};
  o.time(-1);o.hint('Tap to start · each tap is one flap');o.raf=requestAnimationFrame(loop);}
 const GAMES={memory,duel,recipe,catch:catcher,fish,glide};
 return {open,sync,state:()=>st,games:ARCADE_GAMES};
}
