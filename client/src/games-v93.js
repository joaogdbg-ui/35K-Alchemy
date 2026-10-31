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
 {id:'grand',name:'Championship',focus:'all',blurb:'Run, swim, fly, climb and THINK — every stat counts.',plan:['run','swim','fly','climb','run','swim','fly','climb','run'],locked:true}
];
const SEG_WORD={run:'RUN',swim:'SWIM',fly:'FLY',climb:'CLIMB',puzzle:'THINK'};
const SEG_LEN=90,UNIT_SPEED=80;
/**
 * V99 continuous course (owner: take the Chao Race STRUCTURE, keep our approved 2D art). The track is
 * ONE side-view terrain drawn as a single SVG, so sections flow into each other with no seams:
 * grass paths, rock walls the racers climb (the race carries on up there, up to 3 steps), pools to
 * swim, chasms to glide over (landing a step lower) and ALCHEMY GATES where the companion has to
 * THINK (pick the result of the recipe on the sign). Each course has its own authored structure.
 * Pure data: buildCourse(plan) → zones in race units + world px; groundAt / posAt / courseSvg.
 */
const RC={PX:2.2,GATE:150,Y0:250,LVL:48,BAND:100,H:1000,MAXL:3,LANE:18,SK:0.32};
const lerp=(a,b,k)=>a+(b-a)*k;
const smooth=k=>k*k*(3-2*k);
/** V99 alchemy gates (the THINK sections): two elements on the sign, four answers on the floor. */
const GATE_RECIPES=[['💧','🔥','☁️',['🪨','🌱','⚡']],['🔥','🪨','🌋',['❄️','🌊','🌸']],['🌱','☀️','🌻',['🧊','🔥','🌙']],['☁️','⚡','⛈️',['🌵','🍄','🪵']],['💧','❄️','🧊',['🔥','🌳','⭐']],['🪨','💧','🌱',['⚡','🔥','☁️']]];
export function buildCourse(plan,seed=1){
 let rs=(seed*7919+13)%233280;const rnd=()=>{rs=(rs*9301+49297)%233280;return rs/233280;};
 const Y=h=>RC.Y0-h*RC.LVL;const zones=[];let x=0,px=RC.GATE,h=0;
 const add=z=>{z.a=x;z.b=x+z.len;z.pa=px;z.pb=px+(z.kind==='wall'?0:z.len*RC.PX);z.i=zones.length;z.y0=Y(z.h0);z.y1=Y(z.h1);x=z.b;px=z.pb;zones.push(z);return z;};
 plan.forEach((sg,i)=>{
  const L=sg.len,last=i===plan.length-1,next=plan[i+1]?.t,b={seg:i,t:sg.t};
  const run=(f,h1,extra={})=>{add({...b,kind:'run',len:L*f,h0:h,h1,...extra});h=h1;};
  if(sg.t==='run'){
   if(last)run(1,h,{bump:2});
   else{let h1=h;if(next==='climb'&&h>=RC.MAXL)h1=h-1;else if(h>0&&(next==='swim'||next==='run')&&rnd()<0.6)h1=h-1;
    if(h1!==h){run(0.4,h,{bump:1});run(0.6,h1);}else run(1,h,{bump:2});}
  }else if(sg.t==='swim')add({...b,kind:'swim',len:L,h0:h,h1:h});
  else if(sg.t==='climb'){const down=h>=RC.MAXL;if(down)run(0.3,h-1);else run(0.15,h);add({...b,kind:'wall',len:L*0.3,h0:h,h1:h+1});h++;run(down?0.4:0.55,h,{bump:1});}
  else if(sg.t==='fly'){run(0.12,h);const h1=Math.max(0,h-1);add({...b,kind:'glide',len:L*0.76,h0:h,h1});h=h1;run(0.12,h);}
  else if(sg.t==='puzzle'){const r=GATE_RECIPES[Math.floor(rnd()*GATE_RECIPES.length)];const opts=[r[2],...r[3]];for(let j=3;j>0;j--){const k=Math.floor(rnd()*(j+1));[opts[j],opts[k]]=[opts[k],opts[j]];}
   run(0.2,h);add({...b,kind:'puzzle',len:L*0.6,h0:h,h1:h,recipe:[r[0],r[1]],opts,ans:opts.indexOf(r[2])});run(0.2,h);}
 });
 return {zones,L:x,finishPx:px,finishY:Y(h),W:px+220};
}
const zoneAt=(c,x)=>{const z=c.zones;let lo=0,hi=z.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(z[m].a<=x)lo=m;else hi=m-1;}return z[lo];};
/** Ground top at progress k of a zone (shared by renderer and racers, so feet sit on the art). */
export function groundAt(z,k){
 if(z.kind==='swim')return z.y0+12*Math.min(1,k/0.1,(1-k)/0.1);
 if(z.kind==='glide')return lerp(z.y0,z.y1,k)-40*Math.sin(Math.PI*k);
 if(z.kind==='wall')return lerp(z.y0,z.y1,k);
 return lerp(z.y0,z.y1,smooth(k))-(z.bump?3*Math.sin(Math.PI*k*z.bump*2):0);
}
export const panelPx=(z,i)=>z.pa+(z.pb-z.pa)*(0.15+i*0.18);
/** Depth into the track (oblique view): lane 0 runs at the back, lane 4 at the front. */
const laneD=lane=>14+lane*RC.LANE;
export function posAt(c,x,lane=0){const z=zoneAt(c,Math.min(x,c.L-1e-6));const k=Math.max(0,Math.min(1,(x-z.a)/z.len));const d=laneD(lane);
 const px=(z.kind==='wall'?z.pa-24:lerp(z.pa,z.pb,k))+d*RC.SK;return {z,k,px,y:groundAt(z,k)+d};}

const f1=n=>Math.round(n*10)/10;
/**
 * V100: the track is drawn in an oblique view: the path has real depth (5 lanes side by side),
 * walls are the riser face of the next step (racers climb its face), pools are sunk into the
 * path, the chasm shows the far cliff's face, and start / finish are lines painted ACROSS the
 * path with a post on each side and the banner over it. The earth runs to the bottom of the screen.
 * Art: the approved V95 tiles (run = path, climb = rock and walls, swim = water, fly = chasm).
 */
export function courseSvg(c,art={}){
 const {BAND:B,H,SK}=RC;const Bs=B*SK;const back=[],mid=[];
 let rs=7;const rnd=()=>{rs=(rs*9301+49297)%233280;return rs/233280;};
 const uri=k=>'data:image/svg+xml,'+encodeURIComponent(art[k]||'');
 const pat=(id,k,w,h,fb,crop=0)=>`<pattern id="${id}" width="${w}" height="${h-2*crop}" patternUnits="userSpaceOnUse">${art[k]?`<image href="${uri(k)}" y="${-crop}" width="${w}" height="${h}" preserveAspectRatio="none"/>`:`<rect width="${w}" height="${h}" fill="${fb}"/>`}</pattern>`;
 const P=pts=>pts.map(([x,y])=>f1(x)+' '+f1(y)).join('L');
 const off=(T,d)=>T.map(([x,y])=>[x+d*SK,y+d]);
 const pts=z=>{const n=Math.max(2,Math.ceil((z.pb-z.pa)/8));const o=[];for(let j=0;j<=n;j++){const k=j/n;o.push([lerp(z.pa,z.pb,k),groundAt(z,k)]);}o[o.length-1][0]+=0.8;return o;};
 const strip=(T,d1,d2,fill,extra='')=>`<path d="M${P(off(T,d1))}L${P(off(T,d2).reverse())}Z" fill="${fill}" ${extra}/>`;
 const face=(T,fill,extra='')=>{const F=off(T,B);return `<path d="M${P(F)}L${f1(F.at(-1)[0])} ${H}L${f1(F[0][0])} ${H}Z" fill="${fill}" ${extra}/>`;};
 const ground=T=>[face(T,'url(#rcRock)'),strip(T,B,B+7,'#5c4330','opacity=".35"'),strip(T,0,B,'url(#rcGrass)'),strip(T,0,6,'#6f9e50'),strip(T,B-6,B,'#7FAF5C'),`<path d="M${P(off(T,B))}" stroke="#4d7a3c" stroke-width="2.5" fill="none"/>`].join('');
 const riser=(x,yTop,yBot,shade=0.18)=>`<path d="M${f1(x)} ${f1(yTop)}L${f1(x+Bs)} ${f1(yTop+B)}L${f1(x+Bs)} ${f1(yBot+B)}L${f1(x)} ${f1(yBot)}Z" fill="url(#rcRock)" stroke="#6b4f36" stroke-width="2.5"/><path d="M${f1(x)} ${f1(yTop)}L${f1(x+Bs)} ${f1(yTop+B)}L${f1(x+Bs)} ${f1(yBot+B)}L${f1(x)} ${f1(yBot)}Z" fill="#3b2a1c" opacity="${shade}"/>`;
 const bush=(x,y)=>`<g transform="translate(${f1(x)} ${f1(y)})" stroke="#4d7a3c" stroke-width="2"><circle cx="-11" cy="-6" r="10" fill="#7aae58"/><circle cx="4" cy="-11" r="13" fill="#8fbf68"/><circle cx="17" cy="-5" r="9" fill="#7aae58"/></g>`;
 // glide voids first (everything else is drawn over them)
 for(const z of c.zones)if(z.kind==='glide'){const xa=z.pa,xb=z.pb,ya=z.y0,yb=z.y1;
  mid.push(`<path d="M${f1(xa)} ${f1(ya)}L${f1(xb)} ${f1(yb)}L${f1(xb+Bs)} ${H}L${f1(xa)} ${H}Z" fill="url(#rcChasm)"/>`,riser(xb,yb,H-B,0.3));
  back.push(`<rect x="${f1(xa-4)}" y="${f1(ya-26)}" width="7" height="30" rx="2" fill="#a0683c" stroke="#6b4426" stroke-width="2"/><rect x="${f1(xb-3)}" y="${f1(yb-26)}" width="7" height="30" rx="2" fill="#a0683c" stroke="#6b4426" stroke-width="2"/><path d="M${f1(xa)} ${f1(ya-22)}q10 34 22 44M${f1(xb)} ${f1(yb-22)}q-10 30 -20 40" stroke="#c99b62" stroke-width="2" fill="none"/><path d="M${f1(xa+6)} ${f1(ya+18)}l14 26l8-4l-12-26Z" fill="#b8744a" stroke="#6b4426" stroke-width="2"/>`);}
 mid.push(ground([[-80,RC.Y0],[RC.GATE+0.8,RC.Y0]]));
 for(const z of c.zones){
  if(z.kind==='glide')continue;
  if(z.kind==='wall'){const x=z.pa;mid.push(riser(x,z.y1,z.y0),`<path d="M${f1(x)} ${f1(z.y1)}L${f1(x+Bs)} ${f1(z.y1+B)}" stroke="#7FAF5C" stroke-width="6" stroke-linecap="round"/>`,
    ...Array.from({length:Math.max(1,Math.floor((z.y0-z.y1)/16))},(_,j)=>{const yy=z.y1+12+j*16;return `<path d="M${f1(x+4)} ${f1(yy+4/SK*SK)}L${f1(x+Bs-4)} ${f1(yy+B-4)}" stroke="#6b4f36" stroke-width="2" opacity=".55" stroke-dasharray="${j%2?'6 10':'10 6'}"/>`;}));continue;}
  const T=pts(z);
  if(z.kind==='swim'){mid.push(face(T,'url(#rcRock)'),strip(T,0,B,'url(#rcWater)'),strip(T,0,4,'#5b8f9e','opacity=".5"'),strip(T,B-5,B,'#e6d29a'),`<path d="M${P(off(T,B))}" stroke="#b79a5c" stroke-width="2" fill="none"/>`);
   const n=Math.floor((z.pb-z.pa)/36);for(let j=0;j<n;j++){const x=z.pa+18+j*36,k=(x-z.pa)/(z.pb-z.pa),d=10+((j*37)%70),y=groundAt(z,k);mid.push(j%3===1?`<ellipse cx="${f1(x+d*SK)}" cy="${f1(y+d)}" rx="9" ry="4" fill="#6fa65a" stroke="#4d7a3c" stroke-width="1.5"/>`:`<path d="M${f1(x+d*SK)} ${f1(y+d)}q5-4 10 0" stroke="#fff" stroke-width="2.2" fill="none" opacity=".8"/>`);}
   back.push(`<path d="M${f1(z.pa+10)} ${f1(z.y0+2)}v-20M${f1(z.pa+16)} ${f1(z.y0+2)}v-27M${f1(z.pb-12)} ${f1(z.y0+2)}v-23" stroke="#6d8f3e" stroke-width="3" stroke-linecap="round"/><ellipse cx="${f1(z.pa+16)}" cy="${f1(z.y0-24)}" rx="3" ry="6" fill="#9a6a3e"/>`);continue;}
  mid.push(ground(T));
  if(z.kind!=='puzzle'){const n=Math.floor((z.pb-z.pa)/150);for(let j=0;j<n;j++){if(rnd()<0.45)continue;const x=z.pa+40+j*150+rnd()*40,y=groundAt(z,(x-z.pa)/(z.pb-z.pa));back.push(bush(x,y+4));}}
  else{const yy=z.y0,gx=z.pa+(z.pb-z.pa)*0.9;
   for(let i=0;i<4;i++){const x=panelPx(z,i),d=B*0.55;mid.push(`<g id="rcP${z.i}_${i}" class="rc-panel"><ellipse cx="${f1(x+d*SK)}" cy="${f1(yy+d)}" rx="16" ry="10" fill="#e9dcc6" stroke="#8a6a4a" stroke-width="2.5"/><text x="${f1(x+d*SK)}" y="${f1(yy+d+6)}" text-anchor="middle" font-size="16">${z.opts[i]}</text></g>`);}
   back.push(`<rect x="${f1(gx-4)}" y="${yy-96}" width="9" height="100" rx="3" fill="#C9934E" stroke="#7a5b3a" stroke-width="2.5"/><rect x="${f1(gx-40)}" y="${yy-120}" width="80" height="34" rx="9" fill="#fff8ec" stroke="#7a5b3a" stroke-width="3"/><text x="${f1(gx)}" y="${yy-96}" text-anchor="middle" font-size="17">${z.recipe[0]}+${z.recipe[1]}</text>`);}
 }
 const fx=c.finishPx,fy=c.finishY??RC.Y0;
 mid.push(ground([[fx,fy],[c.W,fy]]));
 // start / finish: lines painted across the path + back post and banner start (front post in the overlay)
 for(const [x,y,fin] of [[RC.GATE,RC.Y0,false],[fx,fy,true]]){
  mid.push(`<path d="M${f1(x)} ${f1(y)}L${f1(x+12)} ${f1(y)}L${f1(x+12+Bs)} ${f1(y+B)}L${f1(x+Bs)} ${f1(y+B)}Z" fill="${fin?'url(#rcCheck)':'#fff'}" opacity=".95"/>`);
  back.push(`<rect x="${f1(x-4)}" y="${f1(y-118)}" width="10" height="122" rx="3" fill="#C9934E" stroke="#7a5b3a" stroke-width="2.5"/><circle cx="${f1(x+1)}" cy="${f1(y-121)}" r="6" fill="#e0b25a" stroke="#7a5b3a" stroke-width="2"/>`);}
 const defs=`<defs>${pat('rcGrass','run',100,150,'#8FBF68',28)}${pat('rcRock','climb',120,180,'#b98a5e')}${pat('rcWater','swim',110,165,'#7cc3e0',26)}<linearGradient id="rcChasm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6f7b"/><stop offset=".35" stop-color="#2f3b46"/><stop offset="1" stop-color="#1b242c"/></linearGradient><linearGradient id="rcDeep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a1c" stop-opacity="0"/><stop offset="1" stop-color="#3b2a1c" stop-opacity=".55"/></linearGradient><pattern id="rcCheck" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/><rect width="6" height="6" fill="#2b3640"/><rect x="6" y="6" width="6" height="6" fill="#2b3640"/></pattern></defs>`;
 mid.push(`<rect x="0" y="${RC.Y0+B+50}" width="${f1(c.W)}" height="${H-RC.Y0-B-50}" fill="url(#rcDeep)"/>`);
 return `<svg class="rc-svg" xmlns="http://www.w3.org/2000/svg" width="${f1(c.W)}" height="${H}" viewBox="0 0 ${f1(c.W)} ${H}">${defs}<g>${back.join('')}</g><g>${mid.join('')}</g></svg>`;
}
/** Overlay drawn ABOVE the racers: front posts of the start / finish gates and their banners. */
export function courseFrontSvg(c){
 const {BAND:B,H,SK}=RC;const Bs=B*SK;const fx=c.finishPx,fy=c.finishY??RC.Y0;const o=[];
 for(const [x,y,fin] of [[RC.GATE,RC.Y0,false],[fx,fy,true]]){const xf=x+Bs,yf=y+B,top=y-118,flag=['#e0675a','#f1c26b','#5aaed2','#8dbf8a','#9b7fc4'];
  o.push(`<path d="M${f1(x+1)} ${f1(top)}L${f1(xf+1)} ${f1(top+B)}L${f1(xf+1)} ${f1(top+B+26)}L${f1(x+1)} ${f1(top+26)}Z" fill="${fin?'url(#rcCheck2)':'#fff8ec'}" stroke="#7a5b3a" stroke-width="2.5"/>`,
   ...[0.15,0.35,0.55,0.75,0.95].map((k,i)=>`<path d="M${f1(x+1+Bs*k-4)} ${f1(top+26+B*k-4*SK)}l8 ${f1(8*SK)}l-5 12Z" fill="${flag[i]}"/>`),
   `<rect x="${f1(xf-4)}" y="${f1(top+B-4)}" width="10" height="${f1(yf-top-B+6)}" rx="3" fill="#C9934E" stroke="#7a5b3a" stroke-width="2.5"/><circle cx="${f1(xf+1)}" cy="${f1(top+B-7)}" r="6" fill="#e0b25a" stroke="#7a5b3a" stroke-width="2"/>`);
  if(!fin)o.push(`<text x="${f1(x+Bs/2+1)}" y="${f1(top+B/2+15)}" text-anchor="middle" font-size="11" font-weight="900" fill="#7a5b3a" font-family="system-ui,sans-serif" transform="rotate(${f1(Math.atan(1/SK)*180/Math.PI)} ${f1(x+Bs/2+1)} ${f1(top+B/2+10)})">GO</text>`);}
 return `<svg class="rc-front" xmlns="http://www.w3.org/2000/svg" width="${f1(c.W)}" height="${H}" viewBox="0 0 ${f1(c.W)} ${H}"><defs><pattern id="rcCheck2" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><rect width="5" height="5" fill="#2b3640"/><rect x="5" y="5" width="5" height="5" fill="#2b3640"/></pattern></defs>${o.join('')}</svg>`;
}

export const statSpeed=lv=>0.55+Math.max(0,Math.min(99,lv))/99*0.9;
export const energyMax=lv=>60+Math.max(0,Math.min(99,lv))*1.6;
export function opponentStats(course,level,seed){
 let s=seed*9301+level*49297+course.id.length*233;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
 const base=LEVEL_POWER[level],out={};
 for(const k of ['hp','stamina','run','power','swim','fly']){let v=base*(0.7+rnd()*0.6);if(course.focus===k||course.focus==='all')v*=1.25;out[k]=Math.round(Math.max(0,Math.min(99,v)));}
 return out;
}
/**
 * V99 authored structure per course (Chao Race idea: every course has its own objective and shape).
 * Each level plays the first n sections of the course's route (Rookie 6 … Champion 14), so higher
 * levels are longer and add the harder pieces at the end of the route.
 *  Pebble Pond — chained pools, longer swims as it goes.     Breezy Cliffs — climb up, glide down, repeat.
 *  Meadow Dash — long open runs over gentle hills.           Boulder Wall — a staircase of walls (up to 3 steps).
 *  Long Trail — a bit of everything, long and draining.      Championship — every stat plus alchemy gates.
 */
export const ROUTES={
 pond:['swim','run','swim','swim','run','swim','fly','swim','swim','run','swim','swim'],
 cliffs:['climb','fly','run','climb','climb','fly','fly','run','climb','fly','swim','fly'],
 meadow:['run','run','swim','run','climb','run','run','puzzle','run','fly','run','run'],
 boulder:['climb','run','climb','climb','run','fly','climb','climb','puzzle','climb','run','climb'],
 trail:['swim','run','climb','run','fly','puzzle','swim','run','climb','fly','run','swim'],
 grand:['swim','climb','fly','puzzle','run','swim','climb','climb','fly','puzzle','swim','fly']
};
const FOCUS_SEG={swim:'swim',fly:'fly',run:'run',power:'climb'};
export function planFor(course,level){
 const n=[6,8,10,12,14][level];const route=ROUTES[course.id]||ROUTES.trail;const out=[{t:'run',len:SEG_LEN}];
 for(let i=0;i<n-2;i++){const t=route[i%route.length];
  const focus=FOCUS_SEG[course.focus]===t;
  const len=t==='puzzle'?Math.round(SEG_LEN*1.6):t==='run'?Math.round(SEG_LEN*(course.focus==='run'?1.3+level*0.1:1)):Math.round(SEG_LEN*(1+level*0.12+(focus&&level>=2?0.3:0)));
  out.push({t,len});}
 out.push({t:'run',len:SEG_LEN});
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
  const C=buildCourse(planFor(course,level),course.id.length*31+level);const L=C.L;
  const rivals=opponentsFor(4,pid);const growth=Number(ctx.alchemyGrowth?.()||1);
  const st=stage(`${course.name} · ${LEVELS[level]}`,'race');st.dataset.level=level;const body=st.querySelector('.g-stage-body'),hud=st.querySelector('.g-hud');
  body.innerHTML=`<div class="g-sky" style="background-image:${bg('sky')}"><i class="g-cloud" style="--d:0"></i><i class="g-cloud" style="--d:1"></i><i class="g-cloud" style="--d:2"></i></div><div class="g-mid" style="background-image:${bg('mid')}"></div><div class="g-track is-v99" style="width:${C.W}px">${courseSvg(C,art)}${courseFrontSvg(C)}</div><div class="g-fore" style="background-image:${bg('mid')}"></div><div class="g-tint"></div>`;
  body.classList.add('has-v99');const track=body.querySelector('.g-track'),hills=body.querySelector('.g-mid');
  const avg=s=>['run','swim','fly','power','stamina'].reduce((n,k)=>n+(s[k]||0),0)/5/99;
  const racers=[{id:pid,me:true,stats:Object.fromEntries(Object.entries(me.stats).map(([k,v])=>[k,v.level])),mood:me.mood,name:me.name},...rivals.map((c,i)=>({id:c.id,stats:opponentStats(course,level,i+1+Date.now()%97),mood:60,name:companionInfo(c.id).name}))];
  racers.forEach((r,i)=>{r.x=0;r.lane=i;r.max=energyMax(r.stats.stamina);r.energy=r.max;r.rest=0;r.boost=0;r.done=false;r.ai=2+Math.random()*2;r.fx=0;r.seg=-1;r.kind='';r.solved=new Set();r.pz=null;
   r.wits=Math.min(0.95,0.25+0.45*avg(r.stats)+(r.me?0.3*(growth-1):0.05*level));
   r.el=actor(r.id,r.me?'is-me':'');r.el.style.setProperty('--lane',i);
   const tag=document.createElement('b');tag.className='g-tag';tag.innerHTML=r.me?`<em>${i+1}</em>${escapeText(r.name)}`:`<em>${i+1}</em>`;if(!r.me)tag.classList.add('is-mini');r.el.append(tag);r.tag=tag;track.append(r.el);});
  dress(track);
  hud.innerHTML=`<div class="g-hud-row"><div class="g-energy"><i>Stamina</i><b><em id="gEnergy"></em></b></div><div class="g-place" id="gPlace">—</div></div><div class="g-progress"><i id="gProg"></i>${C.zones.filter(z=>z.kind!=='run').map(z=>`<b class="is-${z.kind}" style="left:${(100*z.a/L).toFixed(1)}%;width:${(100*z.len/L).toFixed(1)}%"></b>`).join('')}</div>${cheerBtn('CHEER')}`;
  const energyEl=hud.querySelector('#gEnergy'),placeEl=hud.querySelector('#gPlace'),cheer=hud.querySelector('#gCheer'),prog=hud.querySelector('#gProg');
  let raf=0,last=0,finished=[],quit=false,running=false,lastPlace=0;
  const doCheer=()=>{const r=racers[0];if(!running||r.done||r.rest>0||r.pz)return;if(r.energy<6){r.el.classList.add('g-tired');cheer.classList.add('is-no');sfx.tired();setTimeout(()=>{r.el.classList.remove('g-tired');cheer.classList.remove('is-no');},300);return;}
   r.energy-=6;r.boost=0.8;sfx.cheer();cheer.classList.remove('is-pop');void cheer.offsetWidth;cheer.classList.add('is-pop');const b=document.createElement('i');b.className='g-burst';r.el.append(b);setTimeout(()=>b.remove(),500);};
  body.addEventListener('pointerdown',doCheer);cheer.addEventListener('pointerdown',e=>{e.stopPropagation();doCheer();});
  st.querySelector('.g-quit').onclick=()=>{quit=true;cancelAnimationFrame(raf);st.remove();};
  const flash=(z,i,ok)=>{const el=track.querySelector(`#rcP${z.i}_${i}`);if(!el)return;el.classList.remove('is-ok','is-bad');void el.getBoundingClientRect();el.classList.add(ok?'is-ok':'is-bad');setTimeout(()=>el.classList.remove('is-ok','is-bad'),600);};
  const ANIM={run:'walk',swim:'hopwalk',wall:'climb',glide:'fly',puzzle:'walk'},CLS={run:'run',swim:'swim',wall:'climb on-wall',glide:'fly',puzzle:'run'};
  const step=now=>{if(quit)return;const dt=Math.min(0.05,(now-(last||now))/1000);last=now;
   for(const r of racers){if(r.done)continue;let P=posAt(C,r.x,r.lane);let z=P.z;
    if(r.seg!==z.seg){r.seg=z.seg;if(r.me&&z.a>0){banner(st,SEG_WORD[z.t],'is-seg is-'+(z.t==='puzzle'?'climb':z.t),700);sfx.section();}}
    if(r.kind!==z.kind){const was=r.kind;r.kind=z.kind;if(z.kind==='swim'&&was)fxAt(r.el,'is-splash is-big',10,40,700),r.me&&sfx.splash();if(z.kind==='glide'&&r.me)sfx.flap();if(was==='wall'&&r.me)fxAt(r.el,'is-dust',20,50,500);}
    let px=P.px,cls=CLS[z.kind],anim=ANIM[z.kind];
    if(r.rest>0){r.rest-=dt;if(r.rest<=0)r.energy=r.max*0.5;anim='sleep';cls+=' is-resting';}
    else if(z.kind==='puzzle'&&!r.solved.has(z.i)&&r.x>=z.a+z.len*0.06){
     // THINK: stop at the panels, think (wits), step on one; wrong panels drop and the companion tries again.
     r.x=z.a+z.len*0.06;P=posAt(C,r.x,r.lane);px=P.px;anim='idle';cls='run is-think';
     if(!r.pz||r.pz.zi!==z.i){r.pz={zi:z.i,ph:'think',t:Math.max(0.35,1.7-1.2*r.wits)+Math.random()*0.4,left:[0,1,2,3]};if(r.me)sfx.tick();}
     const q=r.pz;q.t-=dt;
     if(q.ph==='pick'){px=panelPx(z,q.pick)+(14+r.lane*RC.LANE)*RC.SK;anim='jump';if(q.t<=0){if(q.pick===z.ans){r.solved.add(z.i);r.pz=null;r.x=z.a+z.len*0.66;fxAt(r.el,'is-ok',26,-10,700);if(r.me){flash(z,q.pick,true);sfx.pass();}}
       else{q.left=q.left.filter(i=>i!==q.pick);q.ph='think';q.t=Math.max(0.3,1.1-0.8*r.wits);fxAt(r.el,'is-bad',26,-10,700);if(r.me){flash(z,q.pick,false);sfx.tired();}}}}
     else if(q.t<=0){const ok=Math.random()<Math.max(1/q.left.length,Math.min(0.95,0.25+0.7*r.wits));const wrong=q.left.filter(i=>i!==z.ans);q.pick=ok||!wrong.length?z.ans:wrong[Math.floor(Math.random()*wrong.length)];q.ph='pick';q.t=0.5;if(r.me)sfx.flap();}
    }else{
     if(!r.me){r.ai-=dt;if(r.ai<=0){r.ai=(4-level*0.6)+Math.random()*2.5;if(r.energy>r.max*0.4&&Math.random()<0.35+level*0.16){r.energy-=8;r.boost=0.9;}}}
     const S=statSpeed,st_=r.stats;let v=UNIT_SPEED*(z.kind==='swim'?0.8*S(st_.swim)+0.2*S(st_.run):z.kind==='wall'?0.42*S(st_.power)+0.06*S(st_.stamina):z.kind==='glide'?(0.8*S(st_.fly)+0.2*S(st_.run))*(st_.fly<15?0.75:1):S(st_.run));
     if(r.mood>=70)v*=1.05;else if(r.mood<=30)v*=0.92;
     if(!r.me)v*=LEVEL_EASE[level];
     if(r.boost>0){v*=1.6;r.boost-=dt;cls+=' is-boost';}
     const d=v*dt;r.x+=d;r.energy-=d*({run:0.10,swim:0.14,wall:0.18,glide:0.05,puzzle:0.08}[z.kind])*(r.boost>0?1.3:1);
     if(r.energy<=0){r.energy=0;r.rest=1.1;fxAt(r.el,'is-sweat',30,-6,900);if(r.me)sfx.rest();}
     P=posAt(C,r.x,r.lane);px=P.px;
     r.fx-=dt;if(r.fx<=0&&!reducedMotion()){r.fx=z.kind==='swim'?0.35:0.22;fxAt(r.el,z.kind==='swim'?'is-splash':z.kind==='glide'?'is-wind':z.kind==='wall'?'is-pebble':'is-dust',z.kind==='glide'?-6:6,z.kind==='glide'?20:50,600);}
    }
    if(r.x>=L){r.x=L;r.done=true;finished.push(r);P=posAt(C,L,r.lane);px=P.px+26;cls='run is-happy';anim='idle';if(r.me){if(finished.length===1){confetti(body);sfx.finish();banner(st,'WINNER!','is-go',1200);}else if(finished.length<=3){sfx.medal();banner(st,ORD(finished.length)+'!','is-pass',900);}else{sfx.lose();}}}
    r.el.className=`companion g-actor ${r.me?'is-me':''} seg-${cls}`;r.el.dataset.anim=anim;
    r.el.style.setProperty('--x',px.toFixed(1)+'px');r.el.style.setProperty('--y',P.y.toFixed(1)+'px');}
   const mine=racers[0];const order=[...racers].sort((a,b)=>(b.done?1e6-finished.indexOf(b):b.x)-(a.done?1e6-finished.indexOf(a):a.x));
   const place=order.indexOf(mine)+1;if(place!==lastPlace){if(lastPlace&&!mine.done){if(place<lastPlace){banner(st,ORD(place)+'!','is-pass',600);sfx.pass();}else sfx.passed();}lastPlace=place;}
   order.forEach((r,i)=>{r.tag.querySelector('em').textContent=i+1;});
   placeEl.textContent=`${ORD(place)} / ${racers.length}`;placeEl.dataset.place=place;prog.style.left=(100*mine.x/L).toFixed(1)+'%';
   energyEl.style.width=(100*mine.energy/mine.max)+'%';energyEl.parentElement.classList.toggle('is-low',mine.energy<mine.max*0.2);cheer.classList.toggle('is-dim',mine.energy<6||mine.rest>0||!!mine.pz);
   const vw=body.clientWidth,mx=posAt(C,mine.x,0).px,cam=Math.max(Math.min(0,vw-C.W),Math.min(0,-(mx-vw*0.36)));track.style.transform=`translateX(${cam.toFixed(1)}px)`;hills.style.backgroundPositionX=(cam*0.45)+'px';body.querySelector('.g-fore').style.backgroundPositionX=(cam*1.25-60)+'px';body.querySelector('.g-sky').style.backgroundPositionX=(cam*0.15)+'px';
   if(mine.done){cancelAnimationFrame(raf);setTimeout(()=>{if(quit)return;st.remove();finishRace(mount,course,level,finished.indexOf(mine)+1,racers,finished);},1300);return;}
   raf=requestAnimationFrame(step);};
  racers.forEach(r=>{const P=posAt(C,0,r.lane);r.el.style.setProperty('--x',(P.px-22)+'px');r.el.style.setProperty('--y',P.y+'px');});
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
