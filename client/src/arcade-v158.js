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
 {id:'glide',name:'Sky Glide',icon:'🪽',desc:'Tap to flap, glide between the clouds and grab elements.',help:{stat:'fly',label:'Fly: stronger flaps, softer fall'}},
 {id:'dive',name:'Deep Dive',icon:'🤿',desc:'Steer under water to grab treasures. Deeper is worth more — come up for air!',help:{stat:'swim',label:'Swim: more air, faster strokes'}},
 {id:'climb',name:'Rock Climb',icon:'🧗',desc:'Tap left or right to switch lanes, dodge the falling rocks and climb high.',help:{stat:'power',label:'Power: climbs faster · Stamina: quicker recovery'}},
 {id:'rhythm',name:'Drum Beat',icon:'🥁',desc:'Tap the drum when a note reaches the line. Keep the combo going!',help:{skill:'drums',label:'Drums: wider timing · Singing: bigger combo bonus'}},
 {id:'paint',name:'Copy the Painting',icon:'🎨',desc:'Memorise the picture, then paint it back from memory.',help:{skill:'draw',label:'Drawing: longer look, extra peeks'}},
 {id:'expedition',name:'Expedition',icon:'🗺️',desc:'Explore a foggy map, follow the compass to the treasure and avoid the mud.',help:{stat:'run',label:'Run: walks faster across the map'}},
 {id:'cups',name:'Challenge Cups',icon:'🏆',desc:'Four quick challenges in a row: tap, stop, spot and count. Win the cup!',help:{skill:'juggle',label:'Juggling: a little more time in every challenge'}},
 {id:'pinball',name:'Pinball',icon:'🎯',desc:'Your companion is the ball! Tap left and right to flip, hit bumpers and elements.',help:{stat:'power',label:'Power: stronger flippers'}},
 {id:'cooking',name:'Cooking',icon:'🍳',desc:'Add the ingredients in the right order before the order runs out.',help:{skill:'magic',label:'Magic: more time per order'}},
 {id:'dig',name:'Treasure Dig',icon:'⛏️',desc:'Dig for buried chests. Each hole tells you how warm you are.',help:{stat:'stamina',label:'Stamina: more digs per field'}},
 {id:'bingo',name:'Element Bingo',icon:'🎱',desc:'Mark the called elements on your card. Make lines for BINGO!',help:{skill:'sing',label:'Singing: the caller is slower'}}];
/** V164: each minigame has its own pass — one ad opens THAT minigame for 24 hours. */
export const ARCADE_PASS_MS=24*60*60*1000;
export const arcadePassLeft=(st,id,now=Date.now())=>Math.max(0,(st?.passes?.[id]||0)-now);
export const fmtPass=ms=>{const m=Math.ceil(ms/60000);return m>=60?`${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`:`${m}m`;};
/** Pure: what the save looks like after `count` discoveries. */
export function arcadeProgress(st,count,ids=ARCADE_GAMES.map(g=>g.id),rnd=Math.random){
 const s={base:st?.base??count,unlocked:Array.isArray(st?.unlocked)?st.unlocked.filter(i=>ids.includes(i)):[],paid:st?.paid||0,best:st?.best||{},passes:st?.passes&&typeof st.passes==='object'?st.passes:{}};
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
 function open(back){const p=sync();const got=st.unlocked.length;const ads=!!ctx.showAd;
  const tiles=ARCADE_GAMES.map(g=>{const on=st.unlocked.includes(g.id),best=st.best[g.id];return `<button type="button" class="st-shop-btn ar-tile ${on?'':'is-locked'}" data-ar="${g.id}" ${on?'':'disabled'}><span>${on?g.icon:'🔒'}</span><b>${on?escapeText(g.name):'???'}</b><small>${on?(ads?(arcadePassLeft(st,g.id)?`⏳ ${fmtPass(arcadePassLeft(st,g.id))}`:'▶ Ad · 24h'):(best?`Best ${best}`:'New!')):'Locked'}</small></button>`;}).join('');
  const soon=ARCADE_TOTAL-ARCADE_GAMES.length;
  showModal(`<div class="modal-tag">MINIGAMES</div><h2>${got}/${ARCADE_TOTAL} unlocked</h2><p class="mini-muted">A new minigame unlocks every ${ARCADE_STEP} new elements found in Alchemy · next at <b>${p.next.toLocaleString('en-US')}</b> (you have ${ctx.count().toLocaleString('en-US')}).${soon>0?` ${soon} more minigames are coming in updates.`:''} Once all ${ARCADE_TOTAL} are open, every ${ARCADE_STEP} elements gives 🪙${ARCADE_STEP_COINS}.</p>
   ${ads?`<p class="ar-pass">▶ One ad opens a minigame for 24 hours</p>`:''}<div class="st-shop is-hub ar-grid">${tiles}</div><button type="button" class="modal-button secondary" id="arClose">${back?'Back':'Close'}</button>`);
  $('arClose').onclick=()=>back?back():closeModal();
  document.querySelectorAll('[data-ar]').forEach(b=>b.onclick=()=>intro(b.dataset.ar,back));}
 function intro(id,back){const g=ARCADE_GAMES.find(x=>x.id===id);const need=!!ctx.showAd&&!arcadePassLeft(st,id);const h=g.help;const sk=h.skill?lvl(h.skill):0,sv=h.stat?stat(h.stat):0;
  showModal(`<div class="modal-tag">MINIGAME</div><div class="ar-big">${g.icon}</div><h2>${escapeText(g.name)}</h2><p>${escapeText(g.desc)}</p><p class="ar-help">✦ ${escapeText(h.label)}${sk?` · your level ${sk}`:''}${sv?` · stat Lv ${sv}`:''}</p>${st.best[id]?`<p class="mini-muted">Best score: <b>${st.best[id]}</b></p>`:''}
   ${need?`<p class="mini-muted">Watch one ad to play ${escapeText(g.name)} as much as you like for 24 hours.</p>`:ctx.showAd?`<p class="ar-pass">⏳ Open for ${fmtPass(arcadePassLeft(st,id))}</p>`:''}
   <button type="button" class="modal-button" id="arPlay">${need?'▶ Watch ad · 24h':'Play'}</button><button type="button" class="modal-button secondary" id="arBack">Back</button>`);
  $('arBack').onclick=()=>open(back);
  $('arPlay').onclick=async()=>{if(need){const b=$('arPlay');b.disabled=true;let ok=false;try{ok=await ctx.showAd('arcade_game');}catch{}if(!ok){b.disabled=false;toast('Ad not completed','repeat');return;}st.passes[id]=Date.now()+ARCADE_PASS_MS;save();sfx.unlock();toast(`${g.name} open for 24 hours`,'new');}
   closeModal();GAMES[id]();};}
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
 const STAGE_ART=SV('0 0 390 640','<rect width="390" height="640" fill="#4a3a5c" stroke="none"/><path d="M0 0h390v40H0Z" fill="#b4483b"/><g fill="#c9584a"><path d="M0 0h70q-10 220 10 470H0Z"/><path d="M390 0h-70q10 220-10 470h80Z"/></g><path d="M70 0q-10 220 10 470M320 0q10 220-10 470" fill="none"/><path d="M20 40q10 200 0 430M45 40q-6 210 6 430M345 40q6 210-6 430M370 40q-10 200 0 430" stroke="#a03d33" stroke-width="3" fill="none"/>'
  +'<g opacity=".18" fill="#fff5d6" stroke="none"><path d="M110 0l-60 470h140Z"/><path d="M280 0l-80 470h140Z"/></g><rect y="470" width="390" height="170" fill="#C9934E" stroke="none"/><path d="M0 470h390" stroke="#7a5b3a" stroke-width="6"/><g stroke="#a0683c" stroke-width="2"><path d="M0 510h390M0 550h390M0 590h390M0 630h390M60 470v40M190 470v40M320 470v40M120 510v40M250 510v40M40 550v40M170 550v40M300 550v40"/></g>').replace('<svg ','<svg preserveAspectRatio="xMidYMax slice" ');
 const KITCHEN=SV('0 0 390 640','<rect width="390" height="640" fill="#f1e6d3" stroke="none"/><g stroke="#e0d0b6" stroke-width="2"><path d="M0 50h390M0 100h390M0 150h390M0 200h390M0 250h390M0 300h390M0 350h390M50 0v380M100 0v380M150 0v380M200 0v380M250 0v380M300 0v380M350 0v380"/></g>'
  +'<rect x="20" y="40" width="120" height="10" rx="4" fill="#C9934E" stroke="#7a5b3a"/><circle cx="45" cy="30" r="10" fill="#e0675a"/><rect x="70" y="18" width="14" height="22" rx="3" fill="#ffd166"/><circle cx="110" cy="30" r="10" fill="#8fbf68"/>'
  +'<path d="M300 20v40M330 20v52M360 20v34" stroke="#7a5b3a" stroke-width="2"/><circle cx="300" cy="66" r="8" fill="#a0683c"/><path d="M322 72h16l-2 14h-12Z" fill="#e8a35f"/><circle cx="360" cy="60" r="7" fill="#e0675a"/>'
  +'<rect y="380" width="390" height="260" fill="#C9934E" stroke="none"/><rect y="380" width="390" height="16" fill="#e0b25a" stroke="#7a5b3a"/><g stroke="#a0683c" stroke-width="2"><path d="M0 440h390M0 500h390M0 560h390M0 620h390M130 396v244M260 396v244"/></g>').replace('<svg ','<svg preserveAspectRatio="xMidYMax slice" ');
 const svgUrl=k=>ctx.art?.[k]?`url("data:image/svg+xml,${encodeURIComponent(ctx.art[k])}")`:'none';
 const SCENE={
  memory:'<i class="ar-sky"></i><i class="ar-mid"></i><i class="ar-grass"></i>',
  duel:'<i class="ar-dojo"></i>',
  recipe:`<div class="ar-lab">${LAB}</div>`,
  catch:'<i class="ar-sky"></i>'+'<i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:1"></i><i class="g-cloud" style="--d:2"></i>'+'<i class="ar-mid"></i><i class="ar-grass"></i>',
  fish:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-water"><b></b></i>',
  glide:'',dive:'',climb:'',pinball:'',cooking:`<div class="ar-lab">${KITCHEN}</div>`,expedition:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',cups:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',dig:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',bingo:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',rhythm:`<div class="ar-lab">${STAGE_ART}</div>`,paint:'<i class="ar-sky"></i><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:2"></i><i class="ar-mid"></i><i class="ar-grass"></i>',
 };
 // ---------- shared stage (V159: scenery, countdown, pops, bursts, animated companion) ----------
 function companionEl(cls=''){const id=ctx.activeId?.();const el=document.createElement('span');el.className='companion ar-cmp '+cls;el.dataset.anim='idle';el.dataset.face='right';if(id)el.dataset.companion=id;
  const a=document.createElement('span');a.className='companion-art';a.innerHTML=ctx.sprite?.(id)||'';for(const g of a.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}
  const sv=a.querySelector('svg');if(sv){sv.setAttribute('width','100%');sv.setAttribute('height','100%');}el.append(a);const sh=document.createElement('i');sh.className='ar-shadow';el.append(sh);return el;}
 function stage(title,scene){const s=document.createElement('div');s.className='ar-stage is-'+scene;for(const k of ['sky','mid','run','swim','climb','dojo'])s.style.setProperty('--'+k,svgUrl(k));s.innerHTML=`<div class="g-stage-top ar-top"><strong>${escapeText(title)}</strong><span class="ar-combo" hidden></span><span class="ar-score">0</span><span class="ar-time"></span><button type="button" class="g-quit" aria-label="Quit">✕</button></div><div class="ar-body"><div class="ar-scene">${SCENE[scene]||''}</div></div><div class="ar-hint"></div>`;document.body.append(s);ctx.pauseWorld?.();
  const sc=s.querySelector('.ar-score');
  const o={el:s,body:s.querySelector('.ar-body'),score:0,over:false,timers:[],combo:0,
   set(v,bump=false){const n=Math.max(0,Math.round(v));if(n!==o.score){o.score=n;sc.textContent=n;if(bump)sc.animate?.([{transform:'scale(1.3)'},{transform:'none'}],{duration:280,easing:'ease-out'});}},add(v){o.set(o.score+v,true);},
   time(t){const e=s.querySelector('.ar-time');e.textContent=t>=0?`⏱ ${Math.ceil(t)}`:'';e.classList.toggle('is-low',t>=0&&t<=5);},hint(t){s.querySelector('.ar-hint').textContent=t||'';},
   later(fn,ms){const t=setTimeout(()=>{if(!o.over)fn();},ms);o.timers.push(t);return t;},
   streak(ok){o.combo=ok?o.combo+1:0;const c=s.querySelector('.ar-combo');c.hidden=o.combo<2;if(o.combo>=2){c.textContent=`x${o.combo}`;c.classList.remove('is-bump');void c.offsetWidth;c.classList.add('is-bump');}return o.combo;},
   pop(x,y,text,cls=''){const e=document.createElement('span');e.className='ar-pop '+cls;e.textContent=text;e.style.left=x+'px';e.style.top=y+'px';o.body.append(e);setTimeout(()=>e.remove(),900);},
   burst(x,y,kind='star',n=10){const b=document.createElement('span');b.className='ar-burst is-'+kind;b.style.left=x+'px';b.style.top=y+'px';for(let i=0;i<n;i++){const p=document.createElement('i');const a=(i/n)*Math.PI*2+Math.random()*0.4,d=34+Math.random()*30;p.style.setProperty('--dx',(Math.cos(a)*d).toFixed(1)+'px');p.style.setProperty('--dy',(Math.sin(a)*d).toFixed(1)+'px');b.append(p);}o.body.append(b);setTimeout(()=>b.remove(),800);},
   shake(){s.classList.remove('is-shake');void s.offsetWidth;s.classList.add('is-shake');},
   rect(el){const r=el.getBoundingClientRect(),b=o.body.getBoundingClientRect();return {x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2,w:r.width,h:r.height};},
   end:null};
  s.querySelector('.g-quit').onclick=()=>o.finish(true);
  o.finish=(quit=false)=>{if(o.over)return;o.over=true;o.timers.forEach(clearTimeout);cancelAnimationFrame(o.raf);o.end?.();if(quit){s.remove();ctx.resumeWorld?.();return;}
   const t=document.createElement('div');t.className='g-banner is-in ar-end';t.textContent=o.endText||'Time!';s.append(t);sfx.prize();setTimeout(()=>{s.remove();ctx.resumeWorld?.();result(o.id,o.score,o.statKey);},1100);};
  o.countdown=(go)=>{const c=document.createElement('div');c.className='g-banner is-count';s.append(c);const seq=['3','2','1','GO!'];let i=0;const tick=()=>{if(o.over){c.remove();return;}c.textContent=seq[i];c.className='g-banner '+(i===3?'is-go':'is-count');void c.offsetWidth;c.classList.add('is-in');i===3?sfx.go():sfx.tick();i++;if(i<seq.length)setTimeout(tick,650);else setTimeout(()=>{c.remove();if(!o.over)go();},500);};tick();};
  return o;}
 function result(id,score,statKey){const g=ARCADE_GAMES.find(x=>x.id===id);const prev=st.best[id]||0;const rec=score>prev;if(rec){st.best[id]=score;save();}
  const coins=Math.min(300,Math.round(score/20));if(coins)ctx.addCoins?.(coins);if(statKey&&score>0)ctx.train?.(statKey,Math.min(12,1+Math.round(score/150)));
  const stars=score>=prev*1.2&&score>0?3:score>0?(rec?3:2):1;
  showModal(`<div class="modal-tag">MINIGAME</div><div class="ar-res-stars">${[1,2,3].map(i=>`<i class="${i<=stars?'on':''}" style="--i:${i}">★</i>`).join('')}</div><div class="ar-big">${g.icon}</div><h2 class="ar-res-score" data-to="${score}">0</h2><p>${rec?'<b class="ar-rec-badge">New best!</b>':`Best: ${prev.toLocaleString('en-US')}`}</p><p class="ar-help">🪙 +${coins} coins${statKey&&score>0?` · ${({run:'Run',swim:'Swim',fly:'Fly',power:'Power',stamina:'Stamina'})[statKey]} training`:''}</p>
   <button type="button" class="modal-button" id="arAgain">Play again</button><button type="button" class="modal-button secondary" id="arDone">Back to minigames</button>`);
  const h=document.querySelector('.ar-res-score');const t0=performance.now();const up=t=>{const k=Math.min(1,(t-t0)/700);if(h&&document.body.contains(h)){h.textContent=Math.round(score*k).toLocaleString('en-US')+' pts';if(k<1)requestAnimationFrame(up);}};requestAnimationFrame(up);
  $('arAgain').onclick=()=>{if(ctx.showAd&&!arcadePassLeft(st,id)){intro(id);return;}closeModal();setTimeout(()=>GAMES[id](),300);};$('arDone').onclick=()=>open();}
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
 // ---------- 6. Sky Glide (V162: drawn on one <canvas>) ----------
 // Phones choked on repainting big SVG backgrounds every frame. Now every picture is rasterised ONCE
 // before "Tap to start" (no first-tap stutter), and each frame is a few cheap drawImage calls.
 // Physics as V161: fixed 120 Hz, tap sets the upward speed, constant gravity, capped fall, round hitbox.
 const loadImg=svg=>new Promise(res=>{if(!svg)return res(null);let t=String(svg);if(!/xmlns=/.test(t))t=t.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t);});
 function glide(){const o=stage('Sky Glide','glide');o.id='glide';o.statKey='fly';const f=stat('fly');const ids=pick(ctx.unlocked(),6);
  const G=1900-f*4,FLAP=560+f*0.8,MAXV=820,R=17,SZ=56,PX=72,COLW=56,STEP=1/120;
  const box=o.body;const cv=document.createElement('canvas');cv.className='ar-cv';box.append(cv);const g=cv.getContext('2d',{alpha:false});
  const me=companionEl('ar-glider');me.dataset.anim='fly';box.append(me);ctx.wear?.(box);const flapArt=me.querySelector('.companion-art');
  const dpr=Math.min(1.5,window.devicePixelRatio||1);let W=0,H=0,GY=0;
  const size=()=>{W=box.clientWidth;H=box.clientHeight;GY=Math.round(H*0.78);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.width=W+'px';cv.style.height=H+'px';g.setTransform(dpr,0,0,dpr,0,0);g.imageSmoothingEnabled=true;};
  const rast=(im,w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*dpr));c.height=Math.max(1,Math.round(h*dpr));if(im)c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c;};
  let A=null;// rasterised assets
  const build=async()=>{const [sky,mid,run,climb,...el]=await Promise.all([loadImg(ctx.art?.sky),loadImg(ctx.art?.mid),loadImg(ctx.art?.run),loadImg(ctx.art?.climb),...ids.map(id=>loadImg(art(id)))]);
   const sh=GY+10,sw=sh*400/300;const rock=rast(climb,120,180);
   A={sky:rast(sky,sw,sh),sw,sh,mid:rast(mid,240,96),run:rast(run,200,300),rockPat:g.createPattern(rock,'repeat'),el:el.filter(Boolean).map(im=>rast(im,38,38))};
   if(A.rockPat?.setTransform)A.rockPat.setTransform(new DOMMatrix().scale(1/dpr));};
  let y=0,py=0,v=0,rot=0,dist=0,obs=[],gap=0,started=false,ready=false,dead=false,acc=0,trailT=0,shown=-1,lastSet=0;const trail=[];o.bonus=0;
  const flap=e=>{e?.preventDefault?.();if(o.over||dead||!ready)return;if(!started){started=true;o.hint('');last=performance.now();acc=0;}v=-FLAP;flapArt?.animate?.([{transform:'scale(1,1)'},{transform:'scale(1.15,.85)'},{transform:'scale(1,1)'}],{duration:200,easing:'ease-out'});sfx.tap?.();};
  box.addEventListener('pointerdown',flap);
  const hit=(cx,cy,rx,ry,rw,rh)=>{const nx=Math.max(rx,Math.min(cx,rx+rw)),ny=Math.max(ry,Math.min(cy,ry+rh));return (cx-nx)**2+(cy-ny)**2<R*R;};
  const spawn=()=>{const hole=Math.max(150,185-dist/250)+Math.min(45,f*0.45);const top=60+Math.random()*Math.max(10,GY-hole-120);obs.push({x:W+20,top,hole,pk:A.el.length?A.el[Math.floor(Math.random()*A.el.length)]:null,scored:false});};
  const die=()=>{dead=true;sfx.miss?.();o.shake();o.burst(PX+SZ/2,y+SZ/2,'smoke',12);me.dataset.anim='shake';o.endText='Bonk!';o.set(dist/10+o.bonus);setTimeout(()=>o.finish(),350);};
  const physics=dt=>{py=y;v=Math.min(MAXV,v+G*dt);y+=v*dt;if(y<-SZ*0.3){y=-SZ*0.3;v=0;}
   const speed=Math.min(240,165+dist*0.004);dist+=speed*dt;gap-=speed*dt;if(gap<=0){gap=235;spawn();}
   const cx=PX+SZ/2,cy=y+SZ/2;if(cy+R>=GY){y=GY-R-SZ/2;return die();}
   for(const ob of obs){ob.x-=speed*dt;
    if(ob.x<cx+R&&ob.x+COLW>cx-R&&(hit(cx,cy,ob.x,-50,COLW,ob.top+50)||hit(cx,cy,ob.x,ob.top+ob.hole,COLW,H)))return die();
    if(ob.pk&&Math.abs(ob.x+COLW/2-cx)<R+16&&Math.abs(ob.top+ob.hole/2-cy)<R+16){const px=ob.x+COLW/2,pyy=ob.top+ob.hole/2;ob.pk=null;o.bonus+=25;o.pop(px,pyy-20,'+25');o.burst(px,pyy,'star',8);sfx.unlock?.();}
    if(!ob.scored&&ob.x+COLW<cx-R){ob.scored=true;o.bonus+=10;}}
   obs=obs.filter(b=>b.x>-80);};
  const tile=(img,w,h,y0,off)=>{if(!img)return;let x=-(off%w);if(x>0)x-=w;for(;x<W;x+=w)g.drawImage(img,x,y0,w,h);};
  const pillar=(x,y0,h,capTop)=>{g.save();g.translate(x,0);g.fillStyle=A.rockPat||'#b98a5e';g.fillRect(0,y0,COLW,h);g.restore();
   g.fillStyle='#7FAF5C';const cy=capTop?y0:y0+h-10;g.fillRect(x,cy,COLW,10);g.fillStyle='#4d7a3c';g.fillRect(x,capTop?y0+10:cy-3,COLW,3);
   g.lineWidth=2.5;g.strokeStyle='#6b4f36';g.strokeRect(x+1.25,y0,COLW-2.5,h);};
  const draw=(t,ry)=>{g.fillStyle='#bfe2f0';g.fillRect(0,0,W,H);
   tile(A.sky,A.sw,A.sh,0,dist*0.15);tile(A.mid,240,96,GY-70,dist*0.45);
   g.fillStyle='#93C46C';g.fillRect(0,GY,W,H-GY);tile(A.run,200,300,GY,dist);g.fillStyle='#7FAF5C';g.fillRect(0,GY,W,6);
   for(const ob of obs){pillar(ob.x,-6,ob.top+6,false);pillar(ob.x,ob.top+ob.hole,GY-ob.top-ob.hole+3,true);
    if(ob.pk){const s=38*(1+0.08*Math.sin(t/160));g.drawImage(ob.pk,ob.x+COLW/2-s/2,ob.top+ob.hole/2-s/2,s,s);}}
   for(const p of trail){const a=1-p.age/0.6;if(a<=0)continue;g.globalAlpha=a;g.fillStyle='#fff';g.fillRect(p.x-p.age*130,p.y,12,3);}g.globalAlpha=1;};
  let last=performance.now();
  const loop=t=>{if(o.over)return;const dt=Math.min(0.1,(t-last)/1000);last=t;
   if(!started){y=H*0.4+Math.sin(t/260)*7;py=y;draw(t,y);me.style.transform=`translate3d(${PX}px,${y.toFixed(1)}px,0)`;o.raf=requestAnimationFrame(loop);return;}
   if(!dead){acc+=dt;while(acc>=STEP&&!dead){physics(STEP);acc-=STEP;}}
   const ry=dead?y:py+(y-py)*(acc/STEP);
   const want=v<0?-22:Math.min(70,-22+(v/MAXV)*110);rot+=(want-rot)*Math.min(1,dt*(v<0?20:7));
   trailT-=dt;if(!dead&&trailT<=0){trailT=0.05;trail.push({x:PX+4,y:ry+SZ/2,age:0});}for(const p of trail)p.age+=dt;while(trail.length&&trail[0].age>0.6)trail.shift();
   draw(t,ry);me.style.transform=`translate3d(${PX}px,${ry.toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg)`;
   // score text at most ~8 times a second (text layout is not free)
   if(t-lastSet>120){lastSet=t;o.set(dist/10+o.bonus);}
   o.raf=requestAnimationFrame(loop);};
  o.time(-1);o.hint('Loading…');
  requestAnimationFrame(async()=>{size();y=H*0.4;py=y;try{await build();}catch{A={el:[]};}if(o.over)return;
   const ro=new ResizeObserver(()=>{const ow=W,oh=H;size();if(oh&&Math.abs(H-oh)>40)build();});ro.observe(box);o.end=()=>ro.disconnect();
   ready=true;o.hint('Tap to start · each tap is one flap');last=performance.now();o.raf=requestAnimationFrame(loop);});}
 // ---------- V163 shared canvas kit (same approach as Sky Glide) ----------
 function canvasKit(o){const box=o.body;const cv=document.createElement('canvas');cv.className='ar-cv';box.append(cv);const g=cv.getContext('2d',{alpha:false});const dpr=Math.min(1.5,window.devicePixelRatio||1);
  const k={box,cv,g,dpr,W:0,H:0,size(){k.W=box.clientWidth;k.H=box.clientHeight;cv.width=Math.round(k.W*dpr);cv.height=Math.round(k.H*dpr);cv.style.width=k.W+'px';cv.style.height=k.H+'px';g.setTransform(dpr,0,0,dpr,0,0);},
   rast(im,w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*dpr));c.height=Math.max(1,Math.round(h*dpr));if(im)c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c;},
   async imgs(list,w,h){const ims=await Promise.all(list.map(loadImg));return ims.map(im=>im?k.rast(im,w,h):null);}};
  return k;}
 const rrect=(g,x,y,w,h,r)=>{g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);};
 // ---------- 7. Deep Dive ----------
 function dive(){const o=stage('Deep Dive','dive');o.id='dive';o.statKey='swim';const sw=stat('swim');const K=canvasKit(o),g=K.g;
  const me=companionEl('ar-diver');me.dataset.anim='fly';K.box.append(me);ctx.wear?.(K.box);
  const AIRMAX=7+sw*0.07,SPEED=200+sw*1.6,SZ=58,RAD=22;let A=null,x=0,y=0,tx=0,ty=0,air=AIRMAX,stun=0,run=false,items=[],urch=[],bub=[],bubT=0,face=1,low=false;
  const SY=()=>Math.round(K.H*0.13),FLOOR=()=>K.H-50;
  const place=()=>{const r=Math.random();const chest=r<0.08;const top=SY()+50,bot=FLOOR()-30;const yy=top+Math.random()*(bot-top);const depth=(yy-top)/(bot-top);
   items.push({x:30+Math.random()*(K.W-60),y:yy,img:chest?A.chest:A.el[Math.floor(Math.random()*A.el.length)]||A.chest,pts:chest?120:10+Math.round(depth*50),ph:Math.random()*6});};
  K.box.addEventListener('pointerdown',e=>{const r=K.box.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;});
  K.box.addEventListener('pointermove',e=>{if(!e.buttons&&e.pointerType!=='touch')return;const r=K.box.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;});
  const drawUrchin=(u)=>{g.strokeStyle='#4a3a5c';g.lineWidth=2.5;for(let i=0;i<10;i++){const a=i/10*Math.PI*2+u.ph;g.beginPath();g.moveTo(u.x+Math.cos(a)*10,u.y+Math.sin(a)*10);g.lineTo(u.x+Math.cos(a)*19,u.y+Math.sin(a)*19);g.stroke();}
   g.fillStyle='#8e6fb5';g.beginPath();g.arc(u.x,u.y,12,0,7);g.fill();g.stroke();g.fillStyle='#20262b';g.fillRect(u.x-5,u.y-3,2.5,3);g.fillRect(u.x+3,u.y-3,2.5,3);};
  const draw=t=>{const W=K.W,H=K.H,sy=SY(),fl=FLOOR();g.fillStyle='#bfe2f0';g.fillRect(0,0,W,sy);
   g.fillStyle=A.water;g.fillRect(0,sy,W,H-sy);
   g.globalAlpha=.12;g.fillStyle='#fff';for(let i=0;i<4;i++){const bx=((i*W/3.2+t*0.01)%(W+120))-60;g.beginPath();g.moveTo(bx,sy);g.lineTo(bx+40,sy);g.lineTo(bx+110,H);g.lineTo(bx+50,H);g.fill();}g.globalAlpha=1;
   g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();for(let xx=0;xx<=W;xx+=8)g.lineTo(xx,sy+Math.sin(xx/22+t/300)*3);g.stroke();
   // seabed + swaying weed
   g.fillStyle='#e6d29a';g.strokeStyle='#b79a5c';g.lineWidth=2.5;g.beginPath();g.moveTo(0,H);g.lineTo(0,fl+10);for(let xx=0;xx<=W;xx+=30)g.quadraticCurveTo(xx+15,fl+(xx/30%2?0:14),xx+30,fl+8);g.lineTo(W,H);g.fill();g.stroke();
   g.strokeStyle='#6fa65a';g.lineWidth=6;g.lineCap='round';for(let i=0;i<6;i++){const wx=(i+0.5)*W/6,sway=Math.sin(t/700+i)*10;g.beginPath();g.moveTo(wx,fl+12);g.quadraticCurveTo(wx+sway,fl-30,wx+sway*1.6,fl-60-(i%3)*14);g.stroke();}
   for(const it of items){const s=36,yy=it.y+Math.sin(t/500+it.ph)*4;if(it.img)g.drawImage(it.img,it.x-s/2,yy-s/2,s,s);}
   for(const u of urch)drawUrchin(u);
   g.fillStyle='rgba(255,255,255,.75)';for(const b of bub){g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill();}
   // air bar
   const bw=Math.min(180,W*0.45),k=air/AIRMAX;g.fillStyle='#fff8ec';g.strokeStyle='#657D89';g.lineWidth=2.5;rrect(g,12,10,bw,16,8);g.fill();g.stroke();
   g.fillStyle=k<0.3?'#e0675a':'#5aaed2';rrect(g,15,13,Math.max(0,(bw-6)*k),10,5);g.fill();g.fillStyle='#4a555e';g.font='800 11px system-ui';g.fillText('AIR',bw+18,22);};
  let last=performance.now();
  const loop=t=>{if(o.over)return;const dt=Math.min(0.05,(t-last)/1000);last=t;const sy=SY(),fl=FLOOR();
   if(run){if(stun>0){stun-=dt;ty=sy-10;}const dx=tx-x,dy=ty-y,d=Math.hypot(dx,dy);const sp=stun>0?260:SPEED;if(d>3){const st=Math.min(d,sp*dt);x+=dx/d*st;y+=dy/d*st;if(Math.abs(dx)>4)face=dx>0?1:-1;}
    x=Math.max(20,Math.min(K.W-20,x));y=Math.max(sy-14,Math.min(fl-10,y));
    const under=y>sy+12;air=under?air-dt:Math.min(AIRMAX,air+dt*4);if(under&&air/AIRMAX<0.3&&!low){low=true;o.hint('Low air — swim up!');}if(!under&&low){low=false;o.hint('');}
    if(air<=0&&stun<=0){air=0.01;stun=1.4;o.add(-30);o.streak(false);o.pop(x,y-30,'-30','is-bad');o.shake();sfx.miss();me.dataset.anim='shake';setTimeout(()=>{if(!o.over)me.dataset.anim='fly';},700);}
    for(const it of items)if(!it.got&&Math.hypot(it.x-x,it.y-y)<RAD+16){it.got=true;const k2=o.streak(true);const pts=it.pts*(k2>=5?2:1);o.add(pts);o.pop(it.x,it.y-24,`+${pts}`,it.pts>=100?'is-gold':'');o.burst(it.x,it.y,it.pts>=100?'gold':'water',10);sfx.splash();}
    if(items.some(i=>i.got)){items=items.filter(i=>!i.got);place();}
    for(const u of urch){u.x+=u.vx*dt;u.ph+=dt;if(u.x<20||u.x>K.W-20)u.vx*=-1;if(stun<=0&&Math.hypot(u.x-x,u.y-y)<RAD+12){stun=0.9;air=Math.max(0.5,air-2);o.add(-15);o.streak(false);o.pop(x,y-30,'-15','is-bad');o.shake();sfx.hit();}}
    bubT-=dt;if(under&&bubT<=0){bubT=0.22;bub.push({x:x+face*14,y:y-10,r:2+Math.random()*3});}}
   for(const b of bub)b.y-=60*dt;bub=bub.filter(b=>b.y>sy);
   draw(t);me.style.transform=`translate3d(${(x-SZ/2).toFixed(1)}px,${(y-SZ/2).toFixed(1)}px,0) rotate(${(Math.max(-1,Math.min(1,(ty-y)/80))*20*face).toFixed(1)}deg)`;me.dataset.face=face>0?'right':'left';
   o.raf=requestAnimationFrame(loop);};
  o.hint('Loading…');
  requestAnimationFrame(async()=>{K.size();const els=pick(ctx.unlocked(),6);const [chest,...el]=await K.imgs([PROP.chest,...els.map(art)],36,36);if(o.over)return;
   const wg=g.createLinearGradient(0,SY(),0,K.H);wg.addColorStop(0,'#7cc3e0');wg.addColorStop(1,'#2f6f99');A={chest,el:el.filter(Boolean),water:wg};
   x=K.W/2;y=SY();tx=x;ty=y+80;for(let i=0;i<5;i++)place();for(let i=0;i<2+Math.floor(Math.random()*2);i++)urch.push({x:40+Math.random()*(K.W-80),y:SY()+120+i*((FLOOR()-SY()-160)/2),vx:(Math.random()<.5?-1:1)*(40+Math.random()*40),ph:0});
   o.hint('Touch where to swim');o.raf=requestAnimationFrame(loop);o.countdown(()=>{run=true;timer(o,45,()=>o.finish());});});}
 // ---------- 8. Rock Climb ----------
 function climb(){const o=stage('Rock Climb','climb');o.id='climb';o.statKey='power';const pw=stat('power'),sta=stat('stamina');const K=canvasKit(o),g=K.g;
  const me=companionEl('ar-climber');me.dataset.anim='walk';K.box.append(me);ctx.wear?.(K.box);
  const SZ=60,SPEED=95+pw*1.3,STUN=Math.max(0.45,1.1-sta*0.006);let A=null,lane=1,lx=0,h=0,stun=0,run=false,rocks=[],gems=[],rockT=1.2,gemT=0.8;
  const LX=i=>K.W*(0.22+i*0.28),MY=()=>K.H*0.7;
  K.box.addEventListener('pointerdown',e=>{if(!run||o.over)return;const r=K.box.getBoundingClientRect();const nl=lane+(e.clientX-r.left<K.W/2?-1:1);if(nl>=0&&nl<=2){lane=nl;sfx.grip();}});
  const draw=t=>{const W=K.W,H=K.H;g.save();g.translate(0,h%180);g.fillStyle=A.rock||'#b98a5e';g.fillRect(0,-180,W,H+360);g.restore();
   g.fillStyle='rgba(59,42,28,.12)';for(let i=0;i<3;i++){rrect(g,LX(i)-30,0,60,H,30);g.fill();}
   // summit flags every 600 height
   const mark=600-(h%600);const my=MY()-mark+30;if(my>-40&&my<H){g.strokeStyle='#7a5b3a';g.lineWidth=4;g.beginPath();g.moveTo(16,my);g.lineTo(W-16,my);g.setLineDash([10,8]);g.stroke();g.setLineDash([]);g.fillStyle='#fff8ec';g.font='900 13px system-ui';g.fillText(`${Math.round((h+mark)/10)} m`,20,my-6);}
   for(const gm of gems)if(gm.img)g.drawImage(gm.img,LX(gm.lane)-18,gm.y-18,36,36);
   for(const r of rocks){if(r.warn>0){g.globalAlpha=0.5+0.5*Math.sin(t/60);g.fillStyle='#e0675a';g.beginPath();g.moveTo(LX(r.lane),8);g.lineTo(LX(r.lane)-14,34);g.lineTo(LX(r.lane)+14,34);g.fill();g.globalAlpha=1;g.fillStyle='#fff';g.font='900 16px system-ui';g.fillText('!',LX(r.lane)-3,30);}
    else if(A.boulder)g.drawImage(A.boulder,LX(r.lane)-22,r.y-19,44,38);}};
  let last=performance.now();
  const loop=t=>{if(o.over)return;const dt=Math.min(0.05,(t-last)/1000);last=t;const my=MY();
   if(run){if(stun>0){stun-=dt;h=Math.max(0,h-140*dt);if(stun<=0)me.dataset.anim='walk';}else h+=SPEED*dt;
    const fall=stun>0?-140:SPEED;
    rockT-=dt;if(rockT<=0){rockT=Math.max(0.55,1.25-h/4000);rocks.push({lane:Math.floor(Math.random()*3),warn:0.6,y:-30});}
    gemT-=dt;if(gemT<=0){gemT=0.9+Math.random()*0.8;gems.push({lane:Math.floor(Math.random()*3),y:-30,img:A.el[Math.floor(Math.random()*A.el.length)]});}
    for(const r of rocks){if(r.warn>0){r.warn-=dt;continue;}r.y+=(430+h*0.02)*dt;if(!r.hit&&r.lane===lane&&Math.abs(r.y-my)<34&&stun<=0){r.hit=true;stun=STUN;o.streak(false);o.add(-20);o.pop(lx,my-40,'-20','is-bad');o.shake();o.burst(lx,my-20,'earth',10);sfx.hit();me.dataset.anim='tumble';}}
    rocks=rocks.filter(r=>r.y<K.H+40);
    for(const gm of gems){gm.y+=fall*dt;if(!gm.got&&gm.lane===lane&&Math.abs(gm.y-my)<30){gm.got=true;const k=o.streak(true);const pts=20*Math.min(3,1+Math.floor(k/5));o.bonus+=pts;o.pop(lx,my-44,`+${pts}`);o.burst(lx,my-20,'star',8);sfx.boop();}}
    gems=gems.filter(gm=>!gm.got&&gm.y<K.H+40);o.set(h/10+o.bonus);}
   lx+=(LX(lane)-lx)*Math.min(1,dt*14);draw(t);me.style.transform=`translate3d(${(lx-SZ/2).toFixed(1)}px,${(my-SZ/2).toFixed(1)}px,0)`;
   o.raf=requestAnimationFrame(loop);};
  o.bonus=0;o.hint('Loading…');
  requestAnimationFrame(async()=>{K.size();const els=pick(ctx.unlocked(),6);const [rockTile,boulder,...el]=await Promise.all([loadImg(ctx.art?.climb),loadImg(PROP.rock),...els.map(id=>loadImg(art(id)))]);if(o.over)return;
   const rt=K.rast(rockTile,120,180);const pat=g.createPattern(rt,'repeat');pat?.setTransform?.(new DOMMatrix().scale(1/K.dpr));A={rock:pat,boulder:boulder?K.rast(boulder,44,38):null,el:el.filter(Boolean).map(im=>K.rast(im,36,36))};
   lx=LX(1);o.hint('Tap left or right to switch lanes');o.raf=requestAnimationFrame(loop);o.countdown(()=>{run=true;timer(o,40,()=>o.finish());});});}
 // ---------- 9. Drum Beat ----------
 function rhythm(){const o=stage('Drum Beat','rhythm');o.id='rhythm';o.statKey='stamina';const dr=lvl('drums'),sg=lvl('sing');
  const GOOD=0.13+dr*0.022,PERF=0.055+dr*0.008,TRAVEL=1.7,LEN=40;const COL=['#e8a35f','#5aaed2','#8fbf68'];
  const me=companionEl('ar-singer');o.body.insertAdjacentHTML('beforeend',`<div class="ar-rhy"><div class="ar-lanes">${[0,1,2].map(i=>`<div class="ar-lane" style="--c:${COL[i]}"></div>`).join('')}<i class="ar-hitline"></i></div><div class="ar-pads">${[0,1,2].map(i=>`<button type="button" class="ar-pad" data-l="${i}" style="--c:${COL[i]}"><i></i></button>`).join('')}</div></div>`);
  o.body.querySelector('.ar-rhy').append(me);ctx.wear?.(o.body);const lanes=[...o.body.querySelectorAll('.ar-lane')];
  // the chart: beats at a rising tempo, sometimes doubles
  const notes=[];let tt=1.2,bpm=92;while(tt<LEN-0.5){const beat=60/bpm;if(Math.random()<0.78){const l=Math.floor(Math.random()*3);notes.push({t:tt,l});if(tt>12&&Math.random()<0.18)notes.push({t:tt,l:(l+1+Math.floor(Math.random()*2))%3});}
   if(tt>8&&Math.random()<0.25){notes.push({t:tt+beat/2,l:Math.floor(Math.random()*3)});}tt+=beat;bpm=Math.min(132,bpm+0.55);}
  let t0=0,run=false,hits=0,dance=0;
  const judge=l=>{if(!run)return;const now=(performance.now()-t0)/1000;let best=null,bd=9;for(const n of notes)if(!n.done&&n.l===l){const d=Math.abs(n.t-now);if(d<bd){bd=d;best=n;}}
   const pad=o.body.querySelector(`[data-l="${l}"]`);pad.animate([{transform:'scale(.9)'},{transform:'none'}],{duration:140});
   const r=o.rect(pad);
   if(best&&bd<=GOOD){best.done=true;best.el?.remove();const perfect=bd<=PERF;const k=o.streak(true);const mult=Math.min(4,1+Math.floor(k/10))*(1+sg*0.05);const pts=Math.round((perfect?30:15)*mult);o.add(pts);
    o.pop(r.x,r.y-70,perfect?'Perfect!':'Good',perfect?'is-gold':'');o.burst(r.x,r.y-50,perfect?'gold':'star',perfect?10:6);(l===0?sfx.clack:l===1?sfx.boop:sfx.tap)();hits++;
    me.dataset.anim=k>=5?'sk-dance':'sk-sing';dance=0.6;}
   else{o.streak(false);sfx.step();}};
  o.body.querySelectorAll('.ar-pad').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();judge(+b.dataset.l);}));
  const loop=()=>{if(o.over)return;const now=(performance.now()-t0)/1000;const H=lanes[0].clientHeight,hy=H-6;
   for(const n of notes){if(n.done)continue;const k=1-(n.t-now)/TRAVEL;if(k<0)continue;
    if(!n.el){n.el=document.createElement('i');n.el.className='ar-note';n.el.textContent='♪';lanes[n.l].append(n.el);}
    n.el.style.transform=`translate3d(-50%,${(k*hy-22).toFixed(1)}px,0)`;
    if(now-n.t>GOOD){n.done=true;n.el.classList.add('is-miss');setTimeout(()=>n.el.remove(),300);o.streak(false);me.dataset.anim='shake';dance=0.5;}}
   dance-=1/60;if(dance<=0&&me.dataset.anim!=='idle')me.dataset.anim='idle';
   if(now>LEN){o.finish();return;}o.time(LEN-now);o.raf=requestAnimationFrame(loop);};
  o.hint('Tap the drum when the note hits the line');o.time(LEN);o.countdown(()=>{t0=performance.now();run=true;o.raf=requestAnimationFrame(loop);});}
 // ---------- 10. Copy the Painting ----------
 function paint(){const o=stage('Copy the Painting','paint');o.id='paint';const d=lvl('draw');const PAL=['#e0675a','#5aaed2','#ffd166','#8fbf68'];
  const me=companionEl('ar-painter');o.body.insertAdjacentHTML('beforeend',`<div class="ar-paint"><div class="ar-easel"><div class="ar-board"></div><i class="ar-leg l"></i><i class="ar-leg r"></i></div><div class="ar-pal"></div><div class="ar-paint-act"><button type="button" class="modal-button secondary" id="arPeek" hidden>👀 Peek</button><button type="button" class="g-cheer" id="arDone" hidden>DONE</button></div></div>`);
  o.body.querySelector('.ar-paint').append(me);ctx.wear?.(o.body);const board=o.body.querySelector('.ar-board'),pal=o.body.querySelector('.ar-pal'),peekB=o.body.querySelector('#arPeek'),doneB=o.body.querySelector('#arDone');
  let round=0,N=3,target=[],mine=[],color=0,phase='look',peeks=0;
  const sizes=[3,3,4,4,4,5,5,5,5];
  const paintCells=(arr,show)=>board.querySelectorAll('.ar-cell').forEach((c,i)=>{c.style.background=arr[i]==null?'':PAL[arr[i]];c.classList.toggle('is-set',arr[i]!=null);});
  const next=()=>{if(o.over)return;N=sizes[Math.min(round,sizes.length-1)];round++;const K=N===3?3:4;
   // a picture, not noise: a background colour plus a few blobs
   const bg=Math.floor(Math.random()*K);target=Array(N*N).fill(bg);const blobs=1+Math.floor(N/2);for(let b=0;b<blobs;b++){const c=(bg+1+Math.floor(Math.random()*(K-1)))%K;let i=Math.floor(Math.random()*N*N);for(let s=0;s<N;s++){target[i]=c;const r=Math.floor(i/N),q=i%N;const dir=Math.floor(Math.random()*4);const nr=Math.max(0,Math.min(N-1,r+(dir===0?1:dir===1?-1:0))),nq=Math.max(0,Math.min(N-1,q+(dir===2?1:dir===3?-1:0)));i=nr*N+nq;}}
   mine=Array(N*N).fill(null);board.style.setProperty('--n',N);board.innerHTML=Array.from({length:N*N},(_,i)=>`<button type="button" class="ar-cell" data-i="${i}"></button>`).join('');
   pal.innerHTML=PAL.slice(0,K).map((c,i)=>`<button type="button" class="ar-pot ${i===0?'is-on':''}" data-c="${i}" style="--c:${c}"></button>`).join('');color=0;
   phase='look';paintCells(target);board.classList.add('is-look');me.dataset.anim='sk-draw';doneB.hidden=true;peekB.hidden=true;peeks=d>=2?(d>=4?2:1):0;
   const look=2200+N*600+d*600;o.hint(`Round ${round} · memorise it!`);
   o.later(()=>{phase='paint';board.classList.remove('is-look');paintCells(mine);me.dataset.anim='idle';doneB.hidden=false;peekB.hidden=!peeks;peekB.textContent=`👀 Peek ×${peeks}`;o.hint('Now paint it back');},look);};
  pal.addEventListener('click',e=>{const p=e.target.closest('.ar-pot');if(!p)return;color=+p.dataset.c;pal.querySelectorAll('.ar-pot').forEach(x=>x.classList.toggle('is-on',x===p));sfx.tap();});
  board.addEventListener('click',e=>{const c=e.target.closest('.ar-cell');if(!c||phase!=='paint')return;const i=+c.dataset.i;mine[i]=color;c.style.background=PAL[color];c.classList.add('is-set');c.animate([{transform:'scale(.7)'},{transform:'scale(1.1)'},{transform:'none'}],{duration:220});sfx.boop();});
  peekB.onclick=()=>{if(phase!=='paint'||!peeks)return;peeks--;peekB.textContent=`👀 Peek ×${peeks}`;peekB.hidden=!peeks;phase='peek';paintCells(target);board.classList.add('is-look');o.later(()=>{board.classList.remove('is-look');paintCells(mine);phase='paint';},800);};
  doneB.onclick=()=>{if(phase!=='paint')return;phase='check';doneB.hidden=true;peekB.hidden=true;let ok=0;board.querySelectorAll('.ar-cell').forEach((c,i)=>{const good=mine[i]===target[i];if(good)ok++;c.classList.add(good?'is-ok':'is-bad');});
   const all=ok===N*N;const pts=ok*10+(all?50*N:0);o.add(pts);const r=o.rect(board);o.pop(r.x,r.y,all?`Perfect +${pts}`:`${ok}/${N*N} +${pts}`,all?'is-gold':'');if(all){o.burst(r.x,r.y,'magic',18);o.streak(true);me.dataset.anim='duo-cheer';sfx.unlock();}else{o.streak(false);me.dataset.anim=ok>N*N/2?'idle':'shake';sfx.miss();}
   o.later(()=>{me.dataset.anim='idle';next();},1400);};
  o.time(70);o.countdown(()=>{next();timer(o,70,()=>o.finish());});}
 // ---------- 11. Expedition ----------
 function expedition(){const o=stage('Expedition','expedition');o.id='expedition';o.statKey='run';const rn=stat('run');const C=6,R=7,STEPMS=Math.max(170,330-rn*1.6);
  const me=companionEl('ar-explorer');o.body.insertAdjacentHTML('beforeend',`<div class="ar-exp"><div class="ar-compass"><i><svg viewBox="0 0 40 40" width="34" height="34"><path d="M6 20h22" stroke="#657D89" stroke-width="4" stroke-linecap="round"/><path d="M36 20L22 10v20Z" fill="#e0675a" stroke="#657D89" stroke-width="2.5" stroke-linejoin="round"/><circle cx="8" cy="20" r="4" fill="#fff8ec" stroke="#657D89" stroke-width="2"/></svg></i></div><div class="ar-map" style="--c:${C};--r:${R}"></div></div>`);
  const map=o.body.querySelector('.ar-map'),needle=o.body.querySelector('.ar-compass i');map.append(me);ctx.wear?.(o.body);const els=pick(ctx.unlocked(),8);
  let cells=[],pos=0,busy=false,run=false,level=0;
  const nb=i=>{const r=Math.floor(i/C),c=i%C,o2=[];if(r>0)o2.push(i-C);if(r<R-1)o2.push(i+C);if(c>0)o2.push(i-1);if(c<C-1)o2.push(i+1);return o2;};
  const build=()=>{level++;const n=C*R;const k=Array(n).fill('grass');pos=(R-1)*C+Math.floor(C/2);
   const free=()=>{let i;do{i=Math.floor(Math.random()*n);}while(k[i]!=='grass'||i===pos||Math.abs(Math.floor(i/C)-Math.floor(pos/C))+Math.abs(i%C-pos%C)<2);return i;};
   for(let t=0;t<7;t++)k[free()]='tree';for(let t=0;t<4+level;t++)k[free()]='mud';for(let t=0;t<5;t++)k[free()]='find';const chest=free();k[chest]='chest';
   cells=k.map((kind,i)=>({kind,seen:false,el:null,item:kind==='find'?els[Math.floor(Math.random()*els.length)]:null,taken:false}));
   map.querySelectorAll('.ar-tile2').forEach(e=>e.remove());cells.forEach((c,i)=>{const e=document.createElement('button');e.type='button';e.className='ar-tile2 is-fog';e.dataset.i=i;map.insertBefore(e,me);c.el=e;});
   reveal();place(true);};
  const reveal=()=>{for(const i of [pos,...nb(pos),...nb(pos).flatMap(nb)]){const c=cells[i];if(c.seen)continue;c.seen=true;c.el.classList.remove('is-fog');c.el.classList.add('is-'+c.kind);
    if(c.kind==='find')c.el.innerHTML=`<span>${art(c.item)}</span>`;if(c.kind==='chest')c.el.innerHTML=`<span>${PROP.chest}</span>`;if(c.kind==='tree')c.el.innerHTML='<i class="ar-tree"></i>';if(c.kind==='mud')c.el.innerHTML='<i class="ar-mud"></i>';}
   const ch=cells.findIndex(c=>c.kind==='chest'&&!c.taken);if(ch>=0){const dy=Math.floor(ch/C)-Math.floor(pos/C),dx=ch%C-pos%C;needle.style.transform=`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`;}};
  const place=(snap)=>{const r=Math.floor(pos/C),c=pos%C;me.style.transition=snap?'none':`left ${STEPMS}ms linear,top ${STEPMS}ms linear`;me.style.left=`calc(${c} * 100% / ${C})`;me.style.top=`calc(${r} * 100% / ${R})`;};
  const path=(to)=>{const prev=new Map([[pos,-1]]);const q=[pos];while(q.length){const i=q.shift();if(i===to)break;for(const j of nb(i)){if(prev.has(j))continue;const c=cells[j];if(!c.seen||c.kind==='tree')continue;prev.set(j,i);q.push(j);}}
   if(!prev.has(to))return null;const out=[];for(let i=to;i!==pos;i=prev.get(i))out.unshift(i);return out;};
  const walk=async steps=>{busy=true;me.dataset.anim='walk';for(const i of steps){if(o.over)return;const dc=i%C-pos%C;if(dc)me.dataset.face=dc>0?'right':'left';pos=i;place();await new Promise(r=>setTimeout(r,STEPMS));reveal();const c=cells[i];
    if(c.kind==='mud'&&!c.taken){c.taken=true;o.add(-10);o.streak(false);const p=o.rect(c.el);o.pop(p.x,p.y-20,'-10 · stuck!','is-bad');o.burst(p.x,p.y,'earth',8);sfx.splash();me.dataset.anim='shake';await new Promise(r=>setTimeout(r,900));me.dataset.anim='walk';break;}
    if(c.kind==='find'&&!c.taken){c.taken=true;c.el.innerHTML='';const k=o.streak(true);const pts=20*Math.min(3,1+Math.floor(k/3));o.add(pts);const p=o.rect(c.el);o.pop(p.x,p.y-20,`+${pts}`);o.burst(p.x,p.y,'star',8);sfx.boop();}
    if(c.kind==='chest'&&!c.taken){c.taken=true;o.add(150);const p=o.rect(c.el);o.pop(p.x,p.y-20,'+150 treasure!','is-gold');o.burst(p.x,p.y,'gold',16);sfx.unlock();me.dataset.anim='duo-cheer';await new Promise(r=>setTimeout(r,900));if(!o.over){o.hint(`Map ${level+1}!`);build();}busy=false;me.dataset.anim='idle';return;}}
   busy=false;me.dataset.anim='idle';};
  map.addEventListener('click',e=>{const t=e.target.closest('.ar-tile2');if(!t||busy||!run)return;const i=+t.dataset.i;if(!cells[i].seen||cells[i].kind==='tree'||i===pos)return;const pth=path(i);if(pth)walk(pth);});
  build();o.hint('Tap a clear tile to walk · the compass points to the chest');o.countdown(()=>{run=true;timer(o,60,()=>o.finish());});}
 // ---------- 12. Challenge Cups ----------
 function cups(){const o=stage('Challenge Cups','cups');o.id='cups';const j=lvl('juggle');const T=8+j*0.6;const me=companionEl('ar-cupper');
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-cups"><div class="ar-cup-steps">${[1,2,3,4].map(i=>`<i data-s="${i}"></i>`).join('')}</div><h3 class="ar-cup-title"></h3><div class="ar-cup-area"></div><i class="ar-fuse ar-cup-fuse"><em></em></i></div>`);
  const area=o.body.querySelector('.ar-cup-area'),title=o.body.querySelector('.ar-cup-title'),fuse=o.body.querySelector('.ar-cup-fuse em');ctx.wear?.(o.body);
  const els=pick(ctx.unlocked(),10);let idx=0;const order=pick(['tap','stop','spot','count'],4);let endRound=null,t0=0;
  const bar=()=>{if(o.over||!endRound)return;const k=Math.max(0,1-(performance.now()-t0)/(T*1000));fuse.style.width=k*100+'%';if(k<=0){const f=endRound;endRound=null;f();return;}o.raf=requestAnimationFrame(bar);};
  const next=()=>{if(o.over)return;if(idx>=4){o.endText=o.score>=900?'🏆 Gold cup!':o.score>=500?'🥈 Silver cup':'🥉 Bronze cup';o.finish();return;}
   const kind=order[idx++];o.body.querySelectorAll('.ar-cup-steps i').forEach((e,i)=>e.classList.toggle('is-on',i<idx));area.innerHTML='';area.className='ar-cup-area is-'+kind;t0=performance.now();
   const done=()=>{endRound=null;o.later(next,700);};
   if(kind==='tap'){title.textContent='Tap Frenzy! Tap your companion';area.append(me);ctx.wear?.(area);let n=0;me.onpointerdown=e=>{e.preventDefault();if(!endRound)return;n++;o.add(5);me.animate([{transform:'scale(1.15,.85)'},{transform:'none'}],{duration:120});sfx.tap();if(n%10===0){const p=o.rect(me);o.pop(p.x,p.y-50,`${n}!`);}};endRound=()=>{me.onpointerdown=null;const p=o.rect(me);o.pop(p.x,p.y-60,`${n} taps`,'is-gold');done();};}
   if(kind==='stop'){title.textContent='Stop the needle in the green!';area.innerHTML=`<div class="ar-meter"><b></b><i></i></div><button type="button" class="g-cheer ar-stop">STOP</button><p class="ar-tries"></p>`;const zone=area.querySelector('.ar-meter b'),nd=area.querySelector('.ar-meter i'),tries=area.querySelector('.ar-tries');let left=3,ph=0,sp=1.3,zw=18+j*2,zx=0,moving=true;
    const newZone=()=>{zx=10+Math.random()*(80-zw);zone.style.left=zx+'%';zone.style.width=zw+'%';};newZone();tries.textContent='3 tries';
    const mv=()=>{if(!endRound)return;if(moving){ph+=sp/60;nd.style.left=(50+50*Math.sin(ph*Math.PI))+'%';}requestAnimationFrame(mv);};mv();
    area.querySelector('.ar-stop').onclick=()=>{if(!endRound||!moving)return;const x=50+50*Math.sin(ph*Math.PI);const good=x>=zx&&x<=zx+zw;const c=zx+zw/2;const pts=good?Math.round(150-Math.abs(x-c)/(zw/2)*70):0;o.add(pts);const p=o.rect(nd);o.pop(p.x,p.y-30,good?`+${pts}`:'miss',good?'is-gold':'is-bad');good?sfx.unlock():sfx.miss();
     left--;tries.textContent=`${left} tries`;moving=false;setTimeout(()=>{moving=true;sp+=0.4;newZone();},450);if(!left){endRound=null;done();}};endRound=()=>done();}
   if(kind==='spot'){title.textContent='Spot the odd one out!';let round=0;const deal=()=>{if(!endRound)return;round++;const [a,b]=pick(els,2);const n=round<3?9:16;const odd=Math.floor(Math.random()*n);area.style.setProperty('--n',n===9?3:4);
     area.innerHTML=Array.from({length:n},(_,i)=>`<button type="button" class="ar-spot" data-ok="${i===odd?1:0}">${art(i===odd?b:a)}</button>`).join('');
     area.querySelectorAll('.ar-spot').forEach(x=>x.onclick=()=>{if(!endRound)return;const ok=x.dataset.ok==='1';const p=o.rect(x);if(ok){o.add(60);o.pop(p.x,p.y-20,'+60');o.burst(p.x,p.y,'star',8);sfx.boop();deal();}else{o.add(-10);o.pop(p.x,p.y-20,'-10','is-bad');x.animate([{rotate:'-10deg'},{rotate:'10deg'},{rotate:'0deg'}],{duration:250});sfx.miss();}});};deal();endRound=()=>done();}
   if(kind==='count'){title.textContent='How many of these?';let round=0;const ask=()=>{if(!endRound)return;round++;const [a,b,c]=pick(els,3);const n=3+Math.floor(Math.random()*(round+3));const tot=n+4+Math.floor(Math.random()*4);
     const bag=pick([...Array(n).fill(a),...Array(tot-n).fill(null).map(()=>Math.random()<.5?b:c)],tot);const opts=pick([n,n+1,n-1,n+2].filter(v=>v>0),4).sort((x,y)=>x-y);
     area.innerHTML=`<div class="ar-count-q"><span>${art(a)}</span>?</div><div class="ar-count-pile">${bag.map(id=>`<i style="--r:${Math.random()*40-20}deg">${art(id)}</i>`).join('')}</div><div class="ar-count-opts">${opts.map(v=>`<button type="button" class="ar-rec-opt" data-v="${v}">${v}</button>`).join('')}</div>`;
     area.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{if(!endRound)return;const ok=+x.dataset.v===n;const p=o.rect(x);o.add(ok?80:-10);o.pop(p.x,p.y-30,ok?'+80':`it was ${n}`,ok?'':'is-bad');ok?sfx.boop():sfx.miss();ask();});};ask();endRound=()=>done();}
   requestAnimationFrame(bar);};
  o.countdown(next);}
 // ---------- 13. Pinball (the companion is the ball) ----------
 function pinball(){const o=stage('Pinball','pinball');o.id='pinball';o.statKey='power';const pw=stat('power');const K=canvasKit(o),g=K.g;
  const me=companionEl('ar-ball');me.dataset.anim='idle';K.box.append(me);ctx.wear?.(K.box);
  const BR=17,GRAV=1150,KICK=1+pw*0.006;let A=null,W=0,H=0,ball=null,balls=3,run=false,segs=[],bumps=[],targets=[],fl=[],held={L:false,R:false},rot=0,acc=0;
  const layout=()=>{W=K.W;H=K.H;const fy=H*0.86,fl1=W*0.155;segs=[[0,0,W,0],[0,0,0,H*0.74],[W,0,W,H*0.74],[0,40,40,0],[W-40,0,W,40],[0,H*0.74,W*0.3,fy],[W,H*0.74,W*0.7,fy]];
   fl=[{px:W*0.3,py:fy,len:fl1,rest:0.45,up:-0.5,a:0.45,w:0,side:1},{px:W*0.7,py:fy,len:fl1,rest:Math.PI-0.45,up:Math.PI+0.5,a:Math.PI-0.45,w:0,side:-1}];
   bumps=[{x:W*0.3,y:H*0.26,r:24,flash:0},{x:W*0.7,y:H*0.26,r:24,flash:0},{x:W*0.5,y:H*0.4,r:26,flash:0},{x:W*0.2,y:H*0.5,r:16,flash:0},{x:W*0.8,y:H*0.5,r:16,flash:0}];};
  const spawnT=()=>{while(targets.length<3){const t={x:40+Math.random()*(W-80),y:H*0.12+Math.random()*H*0.45,img:A.el[Math.floor(Math.random()*A.el.length)]};if(bumps.every(b=>Math.hypot(b.x-t.x,b.y-t.y)>b.r+40)&&targets.every(q=>Math.hypot(q.x-t.x,q.y-t.y)>60))targets.push(t);}};
  const newBall=()=>{ball={x:W*0.5+(Math.random()*60-30),y:60,vx:(Math.random()<.5?-1:1)*(80+Math.random()*120),vy:0};};
  const collideSeg=(x1,y1,x2,y2,e,surf)=>{const dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy;let t=((ball.x-x1)*dx+(ball.y-y1)*dy)/L2;t=Math.max(0,Math.min(1,t));const cx=x1+dx*t,cy=y1+dy*t;let nx=ball.x-cx,ny=ball.y-cy;const d=Math.hypot(nx,ny);if(d>=BR||d===0)return false;nx/=d;ny/=d;
   ball.x=cx+nx*BR;ball.y=cy+ny*BR;const sv=surf?surf(cx,cy):[0,0];const rvx=ball.vx-sv[0],rvy=ball.vy-sv[1];const vn=rvx*nx+rvy*ny;if(vn<0){ball.vx-=(1+e)*vn*nx;ball.vy-=(1+e)*vn*ny;}return true;};
  const step=dt=>{for(const f of fl){const want=(f.side>0?held.L:held.R)?f.up:f.rest;const prev=f.a;const sp=22;f.a+=Math.max(-sp*dt,Math.min(sp*dt,want-f.a));f.w=(f.a-prev)/dt;}
   if(!ball)return;ball.vy+=GRAV*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
   for(const sg of segs)collideSeg(...sg,0.55);
   for(const f of fl){const ex=f.px+Math.cos(f.a)*f.len,ey=f.py+Math.sin(f.a)*f.len;collideSeg(f.px,f.py,ex,ey,0.35,(cx,cy)=>[-f.w*(cy-f.py)*KICK,f.w*(cx-f.px)*KICK]);}
   for(const b of bumps){const dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy);if(d<b.r+BR&&d>0){const nx=dx/d,ny=dy/d;ball.x=b.x+nx*(b.r+BR);ball.y=b.y+ny*(b.r+BR);const sp=Math.max(560,Math.hypot(ball.vx,ball.vy));ball.vx=nx*sp;ball.vy=ny*sp;if(b.flash<=0){o.add(25);o.pop(b.x,b.y-30,'+25');sfx.boop();}b.flash=0.15;}}
   for(const t of targets)if(!t.hit&&Math.hypot(ball.x-t.x,ball.y-t.y)<BR+18){t.hit=true;const k=o.streak(true);const pts=100*Math.min(3,1+Math.floor(k/3));o.add(pts);o.pop(t.x,t.y-24,`+${pts}`,'is-gold');o.burst(t.x,t.y,'gold',12);sfx.unlock();}
   if(targets.some(t=>t.hit)){targets=targets.filter(t=>!t.hit);spawnT();}
   const sp=Math.hypot(ball.vx,ball.vy);if(sp>1500){ball.vx*=1500/sp;ball.vy*=1500/sp;}rot+=ball.vx*dt*3;
   if(ball.y>H+30){balls--;o.streak(false);sfx.miss();o.shake();ball=null;if(balls<=0){o.endText='Game over';o.finish();return;}o.hint(`${balls} ball${balls>1?'s':''} left`);o.later(newBall,700);}};
  const draw=t=>{g.fillStyle='#2f4a5c';g.fillRect(0,0,W,H);g.fillStyle=A.felt;g.fillRect(0,0,W,H);
   g.strokeStyle='rgba(255,248,236,.15)';g.lineWidth=2;for(let y=40;y<H;y+=46){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
   g.lineCap='round';g.lineWidth=8;g.strokeStyle='#C9934E';for(const s2 of segs.slice(3)){g.beginPath();g.moveTo(s2[0],s2[1]);g.lineTo(s2[2],s2[3]);g.stroke();}
   for(const b of bumps){g.fillStyle=b.flash>0?'#fff5d6':'#e0675a';g.strokeStyle='#657D89';g.lineWidth=3;g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill();g.stroke();g.fillStyle=b.flash>0?'#ffd166':'#fff8ec';g.beginPath();g.arc(b.x,b.y,b.r*0.45,0,7);g.fill();}
   for(const tg of targets){g.fillStyle='rgba(255,209,102,.35)';g.beginPath();g.arc(tg.x,tg.y,22+2*Math.sin(t/200),0,7);g.fill();if(tg.img)g.drawImage(tg.img,tg.x-17,tg.y-17,34,34);}
   for(const f of fl){const ex=f.px+Math.cos(f.a)*f.len,ey=f.py+Math.sin(f.a)*f.len;g.lineCap='round';g.strokeStyle='#657D89';g.lineWidth=17;g.beginPath();g.moveTo(f.px,f.py);g.lineTo(ex,ey);g.stroke();g.strokeStyle='#e8a35f';g.lineWidth=12;g.beginPath();g.moveTo(f.px,f.py);g.lineTo(ex,ey);g.stroke();g.fillStyle='#fff8ec';g.beginPath();g.arc(f.px,f.py,5,0,7);g.fill();}
   g.fillStyle='#fff8ec';g.font='800 12px system-ui';for(let i=0;i<balls;i++){g.beginPath();g.arc(16+i*16,H-14,5,0,7);g.fill();}};
  const press=(e,down)=>{const r=K.box.getBoundingClientRect();const left=(e.clientX-r.left)<K.W/2;if(down){(left?held.L=true:held.R=true);e.target.setPointerCapture?.(e.pointerId);sfx.clack();}else{held.L=false;held.R=false;}if(!down)return;if(left)ptr.L=e.pointerId;else ptr.R=e.pointerId;};
  const ptr={};K.box.addEventListener('pointerdown',e=>{e.preventDefault();press(e,true);});const up=e=>{if(ptr.L===e.pointerId)held.L=false;if(ptr.R===e.pointerId)held.R=false;};K.box.addEventListener('pointerup',up);K.box.addEventListener('pointercancel',up);
  let last=performance.now();const loop=t=>{if(o.over)return;const dt=Math.min(0.05,(t-last)/1000);last=t;if(run){acc+=dt;while(acc>=1/240){step(1/240);acc-=1/240;}}for(const b of bumps)b.flash-=dt;
   draw(t);if(ball){me.style.transform=`translate3d(${(ball.x-BR-3).toFixed(1)}px,${(ball.y-BR-3).toFixed(1)}px,0) rotate(${rot.toFixed(0)}deg)`;me.style.opacity=1;}else me.style.opacity=0;o.raf=requestAnimationFrame(loop);};
  o.hint('Loading…');requestAnimationFrame(async()=>{K.size();layout();const ims=await K.imgs(pick(ctx.unlocked(),6).map(art),34,34);if(o.over)return;const fg=g.createLinearGradient(0,0,0,H);fg.addColorStop(0,'#3f6f8a');fg.addColorStop(1,'#2b4f66');A={el:ims.filter(Boolean),felt:fg};spawnT();newBall();
   o.hint('Tap and hold left / right to flip');o.raf=requestAnimationFrame(loop);o.countdown(()=>{run=true;timer(o,75,()=>o.finish());});});}
 // ---------- 14. Cooking ----------
 function cooking(){const o=stage('Cooking','cooking');o.id='cooking';const m=lvl('magic');const ings=pick(ctx.unlocked(),6);if(ings.length<6){o.finish(true);toast('Find a few more elements first','repeat');return;}
  const me=companionEl('ar-chef');o.body.insertAdjacentHTML('beforeend',`<div class="ar-cook"><div class="ar-ticket"><small>ORDER</small><div class="ar-seq"></div><i class="ar-fuse"><em></em></i></div><div class="ar-pan">${SV('0 0 200 90','<path d="M150 40h46" stroke="#4a555e" stroke-width="10"/><ellipse cx="80" cy="44" rx="74" ry="26" fill="#5b6770"/><ellipse class="ar-oil" cx="80" cy="40" rx="62" ry="18" fill="#83939c"/>')}<div class="ar-in-pan"></div></div><div class="ar-bins">${ings.map((id,i)=>`<button type="button" class="ar-bin" data-i="${i}">${art(id)}</button>`).join('')}</div></div>`);
  o.body.querySelector('.ar-cook').append(me);ctx.wear?.(o.body);const seqEl=o.body.querySelector('.ar-seq'),inPan=o.body.querySelector('.ar-in-pan'),pan=o.body.querySelector('.ar-pan'),fuse=o.body.querySelector('.ar-ticket .ar-fuse em');
  let order=[],got=0,t0=0,lim=0,served=0,live=false;
  const newOrder=()=>{if(o.over)return;const n=served<3?3:served<7?4:5;order=Array.from({length:n},()=>Math.floor(Math.random()*6));got=0;lim=(3.2+n*1.3+m*0.6)*1000;t0=performance.now();live=true;
   seqEl.innerHTML=order.map((i,k)=>`<span class="${k===0?'is-next':''}">${art(ings[i])}</span>`).join('');inPan.innerHTML='';pan.classList.remove('is-smoke','is-done');o.body.querySelector('.ar-ticket').animate([{transform:'translateY(-40px)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'ease-out'});};
  const tick=()=>{if(o.over)return;if(live){const k=1-(performance.now()-t0)/lim;fuse.style.width=Math.max(0,k*100)+'%';if(k<=0){live=false;o.streak(false);pan.classList.add('is-smoke');me.dataset.anim='shake';o.pop(o.rect(pan).x,o.rect(pan).y-40,'Too slow!','is-bad');sfx.miss();o.later(()=>{me.dataset.anim='idle';newOrder();},900);}}requestAnimationFrame(tick);};
  o.body.querySelectorAll('.ar-bin').forEach(b=>b.onclick=()=>{if(!live)return;const i=+b.dataset.i;const r=o.rect(b),pr=o.rect(pan);const f=document.createElement('span');f.className='ar-ingr';f.innerHTML=art(ings[i]);f.style.left=r.x+'px';f.style.top=r.y+'px';o.body.append(f);
   f.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${(pr.x-r.x)/2}px),calc(-50% + ${(pr.y-r.y)/2-80}px)) rotate(180deg)`},{transform:`translate(calc(-50% + ${pr.x-r.x}px),calc(-50% + ${pr.y-r.y-10}px)) scale(.6)`}],{duration:350,easing:'ease-in'}).onfinish=()=>f.remove();
   if(i===order[got]){got++;sfx.boop();const sp=seqEl.children;sp[got-1].className='is-done';if(sp[got])sp[got].className='is-next';inPan.insertAdjacentHTML('beforeend',`<i style="--x:${Math.random()*60-30}px;--r:${Math.random()*90-45}deg">${art(ings[i])}</i>`);me.dataset.anim='sk-magic';setTimeout(()=>{if(!o.over)me.dataset.anim='idle';},400);
    if(got===order.length){live=false;served++;const k=o.streak(true);const left=Math.max(0,1-(performance.now()-t0)/lim);const pts=Math.round((40*order.length+120*left)*(k>=3?1.5:1));o.add(pts);pan.classList.add('is-done');o.pop(pr.x,pr.y-60,`Served! +${pts}`,'is-gold');o.burst(pr.x,pr.y-20,'magic',16);sfx.unlock();me.dataset.anim='duo-cheer';o.later(()=>{me.dataset.anim='idle';newOrder();},800);}}
   else{o.streak(false);o.add(-15);pan.classList.add('is-smoke');o.pop(pr.x,pr.y-40,'Wrong! -15','is-bad');o.shake();sfx.miss();got=0;inPan.innerHTML='';[...seqEl.children].forEach((e,k)=>e.className=k===0?'is-next':'');setTimeout(()=>pan.classList.remove('is-smoke'),500);}});
  o.hint('Tap the ingredients in the order on the ticket');o.countdown(()=>{newOrder();tick();timer(o,60,()=>o.finish());});}
 // ---------- 15. Treasure Dig ----------
 function dig(){const o=stage('Treasure Dig','dig');o.id='dig';o.statKey='stamina';const sta=stat('stamina');const N=6;const me=companionEl('ar-digger');
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-dig"><div class="ar-dig-info"><span class="ar-digs"></span><span class="ar-chests"></span></div><div class="ar-field" style="--n:${N}"></div><p class="ar-dig-legend"><i class="h"></i>hot <i class="w"></i>warm <i class="c"></i>cold</p></div>`);
  const field=o.body.querySelector('.ar-field'),digsEl=o.body.querySelector('.ar-digs'),chEl=o.body.querySelector('.ar-chests');o.body.querySelector('.ar-dig').prepend(me);ctx.wear?.(o.body);const els=pick(ctx.unlocked(),6);
  let chests=[],found=0,digs=0,run=false,round=0,busy=false;
  const build=()=>{round++;const n=N*N;const k=Math.min(4,2+Math.floor(round/2));chests=pick([...Array(n).keys()],k);found=0;digs=12+Math.floor(sta/12)+k*2;
   field.innerHTML=Array.from({length:n},(_,i)=>`<button type="button" class="ar-soil" data-i="${i}"></button>`).join('');upd();};
  const upd=()=>{digsEl.textContent=`⛏️ ${digs} digs`;chEl.textContent=`${found}/${chests.length} chests`;};
  const dist=i=>Math.min(...chests.filter(c=>!field.children[c].classList.contains('is-chest')).map(c=>Math.abs(Math.floor(c/N)-Math.floor(i/N))+Math.abs(c%N-i%N)));
  field.addEventListener('click',e=>{const c=e.target.closest('.ar-soil');if(!c||!run||busy||c.classList.contains('is-dug'))return;const i=+c.dataset.i;busy=true;me.dataset.anim='quirk-dig';sfx.grip();c.classList.add('is-digging');
   setTimeout(()=>{busy=false;if(o.over)return;me.dataset.anim='idle';c.classList.remove('is-digging');c.classList.add('is-dug');digs--;const p=o.rect(c);
    if(chests.includes(i)){c.classList.add('is-chest');c.innerHTML=PROP.chest;found++;const k=o.streak(true);const pts=150*(k>=2?2:1);o.add(pts);o.pop(p.x,p.y-24,`+${pts}`,'is-gold');o.burst(p.x,p.y,'gold',14);sfx.unlock();me.dataset.anim='duo-cheer';
     if(found===chests.length){o.add(digs*20);o.pop(p.x,p.y-60,`+${digs*20} spare digs`);upd();o.hint(`Field ${round+1}!`);o.later(()=>{me.dataset.anim='idle';build();},900);return;}}
    else{const d=dist(i);const cls=d<=1?'h':d<=2?'w':'c';c.classList.add('is-'+cls);c.textContent=d;if(Math.random()<0.18){c.innerHTML=`<span>${art(els[Math.floor(Math.random()*els.length)])}</span><b>${d}</b>`;o.add(15);o.pop(p.x,p.y-20,'+15');sfx.boop();}else sfx.step();}
    upd();if(digs<=0&&found<chests.length){o.streak(false);chests.forEach(ci=>{const s2=field.children[ci];if(!s2.classList.contains('is-chest')){s2.classList.add('is-reveal');s2.innerHTML=PROP.chest;}});o.hint('Out of digs!');o.later(()=>build(),1500);}},260);});
  build();o.hint('Numbers show how many steps away the nearest chest is');o.countdown(()=>{run=true;timer(o,75,()=>o.finish());});}
 // ---------- 16. Element Bingo ----------
 function bingo(){const o=stage('Element Bingo','bingo');o.id='bingo';const sg=lvl('sing');const pool=pick(ctx.unlocked(),24);if(pool.length<16){o.finish(true);toast('Find a few more elements first','repeat');return;}
  const card=pick(pool,16);const extra=pool.filter(id=>!card.includes(id));const GAP=Math.max(1700,2300-0)+sg*180;const me=companionEl('ar-caller');
  o.body.insertAdjacentHTML('beforeend',`<div class="ar-bingo"><div class="ar-caller-box"><div class="ar-cage">${SV('0 0 90 90','<circle cx="45" cy="40" r="32" fill="#dff1f7" opacity=".7"/><circle cx="45" cy="40" r="32" fill="none"/><path d="M13 40h64M45 8v64M22 18l46 44M68 18L22 62" stroke-width="1.6" opacity=".6"/><path d="M30 72l-8 14h46l-8-14" fill="#C9934E" stroke="#7a5b3a"/><circle cx="35" cy="34" r="6" fill="#e0675a"/><circle cx="54" cy="46" r="6" fill="#5aaed2"/><circle cx="48" cy="28" r="6" fill="#ffd166"/>')}</div><div class="ar-ball2"><span></span></div><small class="ar-calls"></small></div><div class="ar-card4">${card.map((id,i)=>`<button type="button" class="ar-bcell" data-i="${i}">${art(id)}</button>`).join('')}</div></div>`);
  o.body.querySelector('.ar-caller-box').prepend(me);ctx.wear?.(o.body);const ballEl=o.body.querySelector('.ar-ball2'),ballArt=ballEl.querySelector('span'),callsEl=o.body.querySelector('.ar-calls'),cells=[...o.body.querySelectorAll('.ar-bcell')];
  const LINES=[];for(let r=0;r<4;r++)LINES.push([0,1,2,3].map(c=>r*4+c));for(let c=0;c<4;c++)LINES.push([0,1,2,3].map(r=>r*4+c));LINES.push([0,5,10,15],[3,6,9,12]);
  const marked=new Set(),called=new Set(),doneLines=new Set();let calls=0,MAX=30,cur=null;
  // a fair deck: every card element is called once, mixed with decoys
  const deck=pick([...card,...pick(extra,Math.min(extra.length,MAX-16))],MAX);
  const call=()=>{if(o.over)return;if(calls>=deck.length){o.endText=doneLines.size?'BINGO!':'Done';o.finish();return;}cur=deck[calls++];called.add(cur);ballArt.innerHTML=art(cur);ballEl.classList.remove('is-in');void ballEl.offsetWidth;ballEl.classList.add('is-in');callsEl.textContent=`Call ${calls}/${deck.length}`;sfx.tick();me.dataset.anim='sk-sing';setTimeout(()=>{if(!o.over)me.dataset.anim='idle';},500);o.later(call,GAP);};
  cells.forEach((c,i)=>c.onclick=()=>{if(marked.has(i))return;const p=o.rect(c);if(called.has(card[i])){marked.add(i);c.classList.add('is-on');const fresh=card[i]===cur;o.add(fresh?25:15);o.pop(p.x,p.y-20,`+${fresh?25:15}`);sfx.boop();
    for(const [k,l] of LINES.entries())if(!doneLines.has(k)&&l.every(j=>marked.has(j))){doneLines.add(k);o.add(200);l.forEach(j=>cells[j].classList.add('is-line'));o.pop(p.x,p.y-60,'BINGO! +200','is-gold');o.burst(p.x,p.y,'gold',18);sfx.unlock();me.dataset.anim='duo-cheer';o.shake();}
    if(marked.size===16){o.add(500);o.endText='Full card!';o.finish();}}
   else{o.add(-10);o.pop(p.x,p.y-20,'-10','is-bad');c.animate([{rotate:'-8deg'},{rotate:'8deg'},{rotate:'0deg'}],{duration:250});sfx.miss();}});
  o.hint('Tap the called element if it is on your card');o.time(-1);o.countdown(call);}
 const GAMES={memory,duel,recipe,catch:catcher,fish,glide,dive,climb,rhythm,paint,expedition,cups,pinball,cooking,dig,bingo};
 return {open,sync,state:()=>st,games:ARCADE_GAMES};
}
