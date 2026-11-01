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
export const HOUSE_LAYOUTS={1:{cols:4,rows:3,theme:'tent'},2:{cols:5,rows:4,theme:'hut'},3:{cols:6,rows:5,theme:'cabin'},4:{cols:6,rows:6,theme:'cottage'},6:{cols:7,rows:7,theme:'villa'},8:{cols:8,rows:8,theme:'castle'},10:{cols:9,rows:9,theme:'castle'}};
// V92: houses speed up growth for every resident (multiplier on future gains, never on stats).
export const HOUSE_GROWTH={1:1.1,2:1.2,3:1.35,4:1.5,6:1.75,8:2,10:2.3};
// V139: house complements (garden, outdoor pool, second floor) attach to one house each.
// V140: `fits` = capacities of the houses each add-on can be attached to (the Castle with Garden and Pool has both built in).
export const EXT_INFO={garden:{label:'Garden',icon:'🌳',line:'Outdoor yard · Fun +20% · growth ×1.05',fits:[1,2,3,4,6,8]},pool:{label:'Outdoor pool',icon:'🏊',line:'Swim +25%',fits:[4,6,8]},floor:{label:'Second floor',icon:'🏠',line:'Upstairs bedroom · +2 companions',fits:[3,4,6,8,10]}};
export const FURNITURE_BONUS=0.15,FURNITURE_BONUS_MAX=0.75;
/**
 * V103: a piece's bonus depends on how hard it is to make (recipe depth = combinations needed from
 * the four starters). Race prizes (not craftable) count as top quality. Decor gives no growth.
 */
export const QUALITY=[{stars:1,pct:10,max:5},{stars:2,pct:15,max:7},{stars:3,pct:20,max:9},{stars:4,pct:25,max:11},{stars:5,pct:30,max:Infinity}];
export function pieceQuality(depth){if(depth==null||!Number.isFinite(depth))return QUALITY[4];return QUALITY.find(q=>depth<=q.max);}
export const starsText=n=>'★'.repeat(n)+'☆'.repeat(5-n);
export const EFFECT_LABEL={run:'Run',swim:'Swim',power:'Power',fly:'Fly',stamina:'Stamina',hp:'HP',mood:'Mood',food:'Food',discovery:'Discovery',decor:'Decor'};
const BAND=0.6;
/**
 * V112: objects really move while a resident uses them. Moving parts are overlaid on the static
 * sprite in its own viewBox (front/back view): the wheel spins, the treadmill belt runs, bike wheels
 * turn. Other pieces move as a whole (trampoline squashes, bag swings, seesaw/rocking horse rock,
 * pool ripples, music notes, steam) and the resident's motion matches.
 */
const MOTION_OV={
 wheel:{vb:'0 0 200 260',svg:`<circle cx="100" cy="124" r="51" fill="#F3E3C3" opacity=".9"/><g><animateTransform attributeName="transform" type="rotate" from="0 100 124" to="360 100 124" dur="1s" repeatCount="indefinite"/>${[0,30,60,90,120,150].map(a=>`<path d="M${100+54*Math.cos(a*Math.PI/180)} ${124+54*Math.sin(a*Math.PI/180)}L${100-54*Math.cos(a*Math.PI/180)} ${124-54*Math.sin(a*Math.PI/180)}" stroke="#B4875A" stroke-width="3"/>`).join('')}<circle cx="100" cy="124" r="54" fill="none" stroke="#9C7A5B" stroke-width="5" stroke-dasharray="14 10"/><circle cx="100" cy="124" r="8" fill="#8E6748" stroke="#657D89" stroke-width="3"/></g>`},
 treadmill:{vb:'0 0 200 160',svg:`<defs><clipPath id="tmc"><rect x="22" y="84" width="150" height="34" rx="4"/></clipPath></defs><g clip-path="url(#tmc)"><rect x="22" y="84" width="150" height="34" fill="#F4E9D8"/><g><animateTransform attributeName="transform" type="translate" from="0 0" to="-24 0" dur=".35s" repeatCount="indefinite"/>${Array.from({length:9},(_,i)=>`<rect x="${22+i*24}" y="84" width="10" height="34" fill="#C9584A"/>`).join('')}</g></g>`},
 bike:{vb:'0 0 200 160',svg:[[52,108],[150,108]].map(([x,y])=>`<g><animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur=".6s" repeatCount="indefinite"/>${[0,45,90,135].map(a=>`<path d="M${x+28*Math.cos(a*Math.PI/180)} ${y+28*Math.sin(a*Math.PI/180)}L${x-28*Math.cos(a*Math.PI/180)} ${y-28*Math.sin(a*Math.PI/180)}" stroke="#657D89" stroke-width="2.5"/>`).join('')}</g>`).join('')}
};

/**
 * V113: residents walk AROUND furniture. Pure BFS over the floor grid (8 directions, no corner
 * cutting); tiles under standing (object-layer) pieces are blocked, rugs and mats stay walkable,
 * and the piece being used is open so the resident can step onto it.
 */
export function findPath(L,blocked,from,to){const key=(x,y)=>y*L.cols+x;const sx=Math.round(from.x),sy=Math.round(from.y),tx=Math.round(to.x),ty=Math.round(to.y);
 if(sx===tx&&sy===ty)return [{x:tx,y:ty}];const prev=new Map([[key(sx,sy),null]]);const q=[[sx,sy]];const free=(x,y)=>x>=0&&y>=0&&x<L.cols&&y<L.rows&&(!blocked.has(key(x,y))||(x===tx&&y===ty));
 while(q.length){const [x,y]=q.shift();if(x===tx&&y===ty)break;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(!free(nx,ny)||prev.has(key(nx,ny)))continue;if(dx&&dy&&(!free(x+dx,y)||!free(x,y+dy)))continue;prev.set(key(nx,ny),key(x,y));q.push([nx,ny]);}}
 if(!prev.has(key(tx,ty)))return null;const out=[];let k=key(tx,ty);while(k!=null){out.unshift({x:k%L.cols,y:Math.floor(k/L.cols)});k=prev.get(k);}return out.slice(1);}
export function motionOf(id,name='',effect=''){const t=(id+' '+name).toLowerCase();
 if(/running-wheel|hamster wheel/.test(t))return 'wheel';if(/treadmill/.test(t))return 'treadmill';if(/bicycle|bike/.test(t))return 'bike';
 if(/trampoline/.test(t))return 'tramp';if(/punching/.test(t))return 'bag';if(/seesaw|rocking/.test(t))return 'rock';if(/swing|hammock|glider-perch/.test(t))return 'swing';
 if(/hurdle|jump-rope|balance-beam/.test(t))return 'hop';if(/speaker|piano|vinyl|radio|guitar|drum|music|jukebox/.test(t))return 'music';
 if(/stove|oven|kettle|campfire|fireplace|hot-spring|bathtub|soaking/.test(t))return 'steam';if(effect==='swim')return 'pool';if(/globe/.test(t))return 'spin';return '';}   // sprite height band above the footprint (in tiles)
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
/** Pure: growth multiplier for one resident of `house` (capacity cap) for a stat or care kind. */
export function growthMultiplier(capacity,house,objects,kind,bonusOf=()=>FURNITURE_BONUS){const base=HOUSE_GROWTH[capacity]||1;const add=(house?.furniture||[]).filter(f=>objects[f.id]?.effect===kind).reduce((n,f)=>n+bonusOf(f.id),0);return Math.round(base*(1+Math.min(FURNITURE_BONUS_MAX,add))*100)/100;}
export function houseSummary(house,objects){const out={};for(const f of house?.furniture||[]){const e=objects[f.id]?.effect;if(e)out[e]=(out[e]||0)+1;}return out;}

export function createHomeSystem(ctx){
 const {$,escapeText,byId,uiName,staticArt,isDiscovered,objects:baseObjects,roomSprites,roster,sprites,companionName,statsHtml,wear,applyEffect,showModal,closeModal,toast,reducedMotion,onChange}=ctx;
 // V143: add-on scenery pieces drawn in the room-sprite style (same palette and 3/4 view as tools/v90-assemble-room.py).
 const ZONE_OBJECTS={'zone:pool':{kind:'zone',effect:'swim',size:[3,2]},'zone:lounger':{kind:'zone',effect:'decor',size:[1,1]},'zone:stairs':{kind:'zone',effect:'decor',size:[1,2]}};
 const ZONE_SPRITES={
  'zone:pool':{layer:'floor',front:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><g stroke-linejoin="round" stroke-linecap="round"><rect x="10" y="14" width="288" height="184" rx="30" fill="#5a4a3a" opacity=".16"/><rect x="4" y="6" width="292" height="188" rx="30" fill="#DCE2E5" stroke="#657D89" stroke-width="3.5"/><rect x="4" y="6" width="292" height="6" rx="3" fill="#F2F5F6"/><rect x="26" y="28" width="248" height="144" rx="22" fill="#3F86B0" stroke="#657D89" stroke-width="3"/><rect x="26" y="28" width="248" height="130" rx="22" fill="#5AAED2"/><path d="M50 70q14-10 28 0t28 0t28 0t28 0t28 0t28 0M60 112q14-10 28 0t28 0t28 0t28 0t28 0" fill="none" stroke="#BFE6FA" stroke-width="4"/><path d="M246 14v44M262 14v44M246 26h16M246 42h16" fill="none" stroke="#F7F1E6" stroke-width="5"/><path d="M246 14v44M262 14v44M246 26h16M246 42h16" fill="none" stroke="#657D89" stroke-width="2"/><circle cx="92" cy="136" r="17" fill="#C9584A" stroke="#657D89" stroke-width="3"/><circle cx="92" cy="136" r="7" fill="#5AAED2"/><path d="M78 128l10 4M100 144l6 2" stroke="#F7F1E6" stroke-width="3"/></g></svg>`},
  'zone:lounger':{layer:'object',front:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160"><g stroke-linejoin="round" stroke-linecap="round"><ellipse cx="52" cy="148" rx="42" ry="9" fill="#5a4a3a" opacity=".16"/><path d="M14 150V108M86 150V108M22 140h56" fill="none" stroke="#9C6E4A" stroke-width="4"/><path d="M12 112h76v18H12z" fill="#F7F1E6" stroke="#657D89" stroke-width="3"/><path d="M18 112V64q32-10 64 0v48" fill="#F7F1E6" stroke="#657D89" stroke-width="3"/><path d="M30 68v44M44 66v46M58 66v46M72 68v44" stroke="#C9584A" stroke-width="7"/><path d="M12 112h76v18H12z" fill="none" stroke="#657D89" stroke-width="3"/><path d="M50 60V20" stroke="#9C6E4A" stroke-width="4"/><path d="M8 22Q50 -10 92 22Z" fill="#C9584A" stroke="#657D89" stroke-width="3"/><path d="M22 22q14-14 28 0M50 22q14-14 28 0" fill="#F7F1E6" stroke="#657D89" stroke-width="2"/></g></svg>`},
  'zone:stairs':{layer:'object',front:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 260"><g stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="236" width="90" height="18" rx="9" fill="#5a4a3a" opacity=".16"/><path d="M6 250V82h22v34h22v34h22v34h22v66z" fill="#B98A5E" stroke="#657D89" stroke-width="3.5"/><path d="M8 82h20M30 116h20M52 150h20M74 184h20" stroke="#F3E3C3" stroke-width="4"/><path d="M28 116v134M50 150v100M72 184v66" stroke="#9C6E4A" stroke-width="2"/><path d="M6 76L94 178" fill="none" stroke="#8E6748" stroke-width="5"/><path d="M6 76v-30M36 110v-30M66 144v-30M94 178v-30" stroke="#8E6748" stroke-width="3.5"/><path d="M6 46L94 148" fill="none" stroke="#9C6E4A" stroke-width="5"/></g></svg>`}};
 const objects={...baseObjects,...ZONE_OBJECTS};
 const RS={...(roomSprites||{}),...ZONE_SPRITES};
 const qOf=id=>pieceQuality(ctx.depthOf?.(id));const bonusOf=id=>objects[id]?.effect==='decor'?0:qOf(id).pct/100;
 const bonusText=id=>{const ob=objects[id];if(!ob||ob.effect==='decor')return 'Decor · no bonus';const q=qOf(id);return `${BONUS_NAME[ob.effect]||EFFECT_LABEL[ob.effect]} +${q.pct}% <span class="home-stars">${starsText(q.stars)}</span>`;};
 let state={v:1,active:null,houses:{}};
 try{const raw=JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)||'null');if(raw&&raw.houses&&typeof raw.houses==='object')state={v:1,active:raw.active||null,houses:raw.houses};}catch{}
 for(const h of Object.values(state.houses))for(const f of h.furniture||[])if(typeof f.r!=='number')f.r=0;
 const save=()=>{try{localStorage.setItem(HOME_STORAGE_KEY,JSON.stringify(state));}catch{}onChange?.();};
 const houseIds=()=>Object.entries(objects).filter(([,o])=>o.kind==='house').sort((a,b)=>a[1].capacity-b[1].capacity).map(([id])=>id);
 const ownedHouses=()=>houseIds().filter(isDiscovered);
 const house=id=>{if(!state.houses[id])state.houses[id]={furniture:[],residents:[]};return state.houses[id];};
 const extIds=()=>Object.entries(objects).filter(([id,o])=>o.kind==='extension'&&isDiscovered(id)).map(([id])=>id);
 const builtIn=(hid,kind)=>(objects[hid]?.builtin||[]).includes(kind);
 const fitsExt=(hid,kind)=>!builtIn(hid,kind)&&(EXT_INFO[kind]?.fits||[]).includes(objects[hid]?.capacity);
 const extOn=(hid,kind)=>builtIn(hid,kind)||fitsExt(hid,kind)&&(state.houses[hid]?.ext||[]).some(id=>objects[id]?.ext===kind&&isDiscovered(id));
 const shortName=hid=>uiName(byId.get(hid)).replace(/^Companion /,'');
 /** Names of the houses an add-on fits, and the ones that already have it built in. */
 function addonInfo(id){const k=objects[id]?.ext;if(!k)return null;const I=EXT_INFO[k];
  const ids=houseIds(),f=ids.filter(h=>fitsExt(h,k));const first=ids.indexOf(f[0]),last=ids.indexOf(f[f.length-1]);
  const range=!f.length?'none':f.length===1?shortName(f[0]):last-first+1===f.length?(last===ids.length-1?`${shortName(f[0])} and bigger`:`${shortName(f[0])} to ${shortName(f[f.length-1])}`):f.map(shortName).join(', ');
  return {...I,kind:k,fits:f.map(shortName),range,builtin:ids.filter(h=>builtIn(h,k)).map(shortName)};}
 // add-ons stuck on a house they do not fit (older saves) are taken off
 for(const [k,h] of Object.entries(state.houses))if(Array.isArray(h.ext))h.ext=h.ext.filter(id=>objects[id]?.kind==='extension'&&fitsExt(k,objects[id].ext));
 const extHome=id=>Object.entries(state.houses).find(([,h])=>(h.ext||[]).includes(id))?.[0]||null;
 const capOf=hid=>(objects[hid]?.capacity||1)+(extOn(hid,'floor')?2:0);
 // V142: the ground floor keeps the house's own size; add-ons are drawn outside it (upstairs bedroom, yard).
 const layoutOf=hid=>layoutFor(objects[hid]?.capacity||1);
 const extMult=(hid,kind)=>(extOn(hid,'garden')?1.05*(kind==='mood'?1.2:1):1)*(extOn(hid,'pool')&&kind==='swim'?1.25:1);
 function toggleExt(mount,hid,id){if(!fitsExt(hid,objects[id]?.ext))return;const h=house(hid);h.ext=h.ext||[];const was=extHome(id);
  if(was===hid){h.ext=h.ext.filter(x=>x!==id);}else{if(was)state.houses[was].ext=state.houses[was].ext.filter(x=>x!==id);h.ext.push(id);}
  // a removed second floor may leave too many residents: the newest move out
  for(const [k,hh] of Object.entries(state.houses))while(hh.residents.length>capOf(k))hh.residents.pop();
  save();render(mount);onChange?.();}
 const furnitureOwned=()=>Object.entries(objects).filter(([id,o])=>o.kind==='furniture'&&isDiscovered(id)).map(([id])=>id);
 const placedAnywhere=id=>Object.entries(state.houses).find(([,h])=>h.furniture.some(f=>f.id===id))?.[0]||null;
 const residentOf=cid=>Object.entries(state.houses).find(([,h])=>h.residents.includes(cid))?.[0]||null;
 let moving=null,wanderTimers=[],dragEndedAt=0;
 function activeHouse(){const own=ownedHouses();if(!own.length)return null;if(!own.includes(state.active))state.active=own[own.length-1];return state.active;}

 // ---------- drawing ----------
 function pieceArt(f){const s=RS[f.id];const it=byId.get(f.id);
  if(!s)return {html:`<span class="home-fallback">${staticArt(it)}</span>`,flip:false};
  if(s.layer==='wall')return {html:s.front,flip:false};
  if(f.r===2)return {html:s.back||s.front,flip:false};
  if(f.r===1||f.r===3)return {html:s.side||s.front,flip:f.r===3};
  return {html:s.front,flip:false};}
 function pieceHtml(f,i,attr='data-piece'){
  const layer=layerOf(RS,f.id),[w,h]=footprint(objects,f),art=pieceArt(f);const mv=attr==='data-piece'&&moving&&moving.index===i;
  const band=layer==='object'?BAND:0;
  const style=layer==='wall'?`--x:${f.x};--w:${w}`:`--x:${f.x};--y:${f.y};--w:${w};--h:${h};--band:${band};--z:${layer==='floor'?1:10+(f.y+h)*2}`;
  return `<button type="button" class="home-piece is-${layer} ${art.flip?'is-flip':''} ${mv?'is-moving':''}" ${attr}="${i}" ${attr==='data-piece'?'':'tabindex="-1"'} style="${style}" aria-label="${escapeText(uiName(byId.get(f.id)))}">${art.html}<i class="home-hit" aria-hidden="true"></i></button>`;}
 /** V140: the house's add-ons, under Residents. Built-in ones are shown fixed; ones that do not fit are greyed with where they fit. */
 function addonRow(hid){const built=Object.keys(EXT_INFO).filter(k=>builtIn(hid,k));const own=extIds();if(!built.length&&!own.length)return '';
  const chip=(cls,art,label,sub,attr='')=>`<button type="button" class="home-ext-chip ${cls}" ${attr}><span class="home-ext-art">${art}</span><b>${label}</b><small>${sub}</small></button>`;
  const html=built.map(k=>chip('is-built',(()=>{const e=Object.keys(objects).find(i=>objects[i].ext===k);return e&&byId.get(e)?staticArt(byId.get(e)):'<span class="home-ext-emoji">'+EXT_INFO[k].icon+'</span>';})(),EXT_INFO[k].label,'Built in','disabled'))
   .concat(own.map(id=>{const k=objects[id].ext,I=EXT_INFO[k],art=staticArt(byId.get(id));
    if(builtIn(hid,k))return '';
    if(!fitsExt(hid,k))return chip('is-off',art,I.label,'Fits '+escapeText(addonInfo(id).range),'disabled');
    const on=extHome(id)===hid,where=!on&&extHome(id);
    return chip(on?'is-on':'',art,I.label,on?'✓ Added · tap to remove':where?'In '+escapeText(shortName(where))+' · tap to move here':'Tap to add',`data-ext="${id}"`);})).join('');
  return `<div class="home-res-row home-addon-row"><span>Add-ons</span><div class="home-ext">${html}</div></div>`;}
 // ---------- V143: add-ons are rooms of their own, built from the game's room sprites ----------
 const UP_ROWS=3,YARD_ROWS=3;
 /** Upstairs bedroom: stairs on the left, two beds, a curtain on the wall. */
 function upstairsPlan(hid){const c=layoutOf(hid).cols;const F=[{id:'zone:stairs',x:0,y:1,r:0},{id:'organic89:bed',x:c-2,y:1,r:0},{id:'organic89:bed',x:c-4,y:1,r:0}];
  if(RS['organic89:curtain'])F.push({id:'organic89:curtain',x:1,r:0});if(RS['organic89:picture-frame']&&c>=7)F.push({id:'organic89:picture-frame',x:Math.floor(c/2)+1,r:0});return F;}
 /** Outdoor yard: garden pieces and/or the pool, laid out for the house's width. */
 function yardPlan(hid){const c=layoutOf(hid).cols,g=extOn(hid,'garden'),p=extOn(hid,'pool');const F=[];const add=(id,x,y)=>F.push({id,x,y,r:0});
  if(g){add('organic89:flower-box',0,0);add('organic89:garden-bench',1,0);add('organic89:fence',0,2);
   if(p){add('zone:pool',c-3,0);if(c>=6){add('organic89:bird-bath',3,2);add('zone:lounger',c-4,1);}}
   else{add('organic89:bird-bath',c-1,0);if(c>=6)add('organic89:rope-swing',c-2,1);add('organic89:garden-lantern',c-1,1);}}
  else if(p){add('zone:pool',c-3,0);add('zone:lounger',0,0);add('organic89:garden-lantern',0,1);add('organic89:flower-box',c-1,2);if(c>=7)add('organic89:garden-bench',1,2);}
  return F;}
 /** Who is where: ground floor, upstairs (beyond the house's own capacity) and yard visitors. */
 function splitResidents(hid,residents){const base=objects[hid]?.capacity||1;let ground=residents.slice(0,base);const up=extOn(hid,'floor')?residents.slice(base,base+2):[];let yard=[];
  if(extOn(hid,'garden')||extOn(hid,'pool')){if(ground.length>=2){const k=Math.max(1,Math.round(ground.length/3));yard=ground.slice(-k);ground=ground.slice(0,-k);}else if(ground.length===1&&Math.floor(Date.now()/90000)%2){yard=ground;ground=[];}}
  return {ground,up,yard};}
 const zoneFloor=(cls,L,F,zone,tileCls='')=>`<div class="home-floor ${cls}" data-zone="${zone}">${Array.from({length:L.cols*L.rows},(_,i)=>`<i class="home-tile ${tileCls}" aria-hidden="true"></i>`).join('')}${F.map((f,i)=>layerOf(RS,f.id)!=='wall'?pieceHtml(f,i,'data-zpiece'):'').join('')}<div class="home-residents" data-zres="${zone}"></div></div>`;
 function upstairsHtml(hid){const L={cols:layoutOf(hid).cols,rows:UP_ROWS,theme:layoutOf(hid).theme},F=upstairsPlan(hid);
  return `<div class="home-room is-upstairs" data-theme="${L.theme}" style="--cols:${L.cols};--rows:${L.rows}"><span class="home-zone-tag is-up">🏠 Upstairs · 2 beds</span>
   <div class="home-wall is-zone">${Array.from({length:L.cols},()=>'<i class="home-walltile" aria-hidden="true"></i>').join('')}${F.map((f,i)=>layerOf(RS,f.id)==='wall'?pieceHtml(f,i,'data-zpiece'):'').join('')}<i class="home-skirting" aria-hidden="true"></i></div>
   ${zoneFloor('is-up',L,F,'up')}</div><i class="home-slab" aria-hidden="true"></i>`;}
 function yardHtml(hid){const g=extOn(hid,'garden'),p=extOn(hid,'pool');const L={cols:layoutOf(hid).cols,rows:YARD_ROWS},F=yardPlan(hid);
  return `<div class="home-yard ${g?'is-grass':'is-patio'}" style="--cols:${L.cols};--rows:${L.rows}"><span class="home-zone-tags">${g?'<span class="home-zone-tag">🌳 Garden · Fun +20%</span>':''}${p?'<span class="home-zone-tag">🏊 Pool · Swim +25%</span>':''}</span>${zoneFloor('is-yard',L,F,'yard')}</div>`;}
 function render(mount){
  if(!mount)return;stopWander();
  const hid=activeHouse();const own=ownedHouses();
  const chips=houseIds().map((id,tier)=>{const o=objects[id],have=own.includes(id),it=byId.get(id);
   return `<button type="button" class="home-chip ${id===hid?'is-active':''} ${have?'':'is-locked'}" data-house="${id}" aria-label="${have?escapeText(uiName(it)):'Undiscovered house'} · ${o.capacity}"><span class="home-chip-art">${have?staticArt(it):'<span class="home-q">?</span>'}</span><small>${o.capacity}</small><i class="home-tier" aria-hidden="true">${'<b></b>'.repeat(tier+1)}</i></button>`;}).join('');
  if(!hid){mount.innerHTML=`<section class="home-card"><div class="home-chips">${chips}</div><div class="home-empty"><strong>No companion house yet</strong><small>Discover a house element (the smallest is the Companion Tent) to get a room where your companions live, play and train. Bigger houses fit more companions.</small></div></section>`;return;}
  const o=objects[hid],L=layoutOf(hid),h=house(hid),it=byId.get(hid),cap=capOf(hid);
  const sumHtml=bonusChips(hid);
  const residents=h.residents.filter(isDiscovered);
  const resHtml=residents.map(cid=>`<button type="button" class="home-res" data-res="${cid}" aria-label="${escapeText(companionName(cid))}"><span>${sprites[cid]||''}</span></button>`).join('')+(residents.length<cap?`<button type="button" class="home-res is-add" id="homeAddRes" aria-label="Add a companion">+</button>`:'');
  mount.innerHTML=`<section class="home-card">
   <div class="home-chips" role="tablist" aria-label="Your houses">${chips}</div>
   <div class="home-head"><strong>${escapeText(uiName(it))}</strong><small>${residents.length}/${cap} companions · ${h.furniture.length} furniture</small></div>
   <div class="home-plot ${extOn(hid,'floor')?'has-up':''} ${extOn(hid,'garden')||extOn(hid,'pool')?'has-yard':''}" data-theme="${L.theme}" style="--cols:${L.cols};--rows:${L.rows}">
   ${extOn(hid,'floor')?upstairsHtml(hid):''}
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
   ${extOn(hid,'garden')||extOn(hid,'pool')?yardHtml(hid):''}
   </div>
   ${moving?`<p class="home-hint">Drag ${escapeText(uiName(byId.get(h.furniture[moving.index]?.id)))} to its new spot · <button type="button" class="home-link" id="homeCancelMove">Done</button></p>`:''}
   <div class="home-effects">${sumHtml}</div>
   <div class="home-res-row"><span>Residents</span><div class="home-res-list">${resHtml}</div></div>
   ${addonRow(hid)}
  </section>`;
  mount.querySelectorAll('[data-house]').forEach(b=>b.onclick=()=>houseInfo(mount,b.dataset.house));
  mount.querySelectorAll('[data-ext]').forEach(b=>b.onclick=()=>toggleExt(mount,hid,b.dataset.ext));
  mount.querySelectorAll('.home-effects [data-eff]').forEach(b=>b.onclick=()=>bonusSheet(hid,b.dataset.eff));
  mount.querySelectorAll('#homeFloor .home-tile').forEach(t=>t.onclick=()=>tapSpot(mount,hid,Number(t.dataset.x),Number(t.dataset.y),false));
  mount.querySelectorAll('.home-walltile').forEach(t=>t.onclick=()=>tapSpot(mount,hid,Number(t.dataset.wx),-1,true));
  mount.querySelectorAll('[data-piece]').forEach(p=>{wireDrag(mount,hid,p);});
  mount.querySelectorAll('[data-piece]').forEach(p=>p.onclick=e=>{if(Date.now()-dragEndedAt<350)return;if(moving&&Number(p.dataset.piece)===moving.index)return;if(moving){const t=spotFromEvent(mount,e,hid);if(t)tapSpot(mount,hid,t.x,t.y,t.wall);return;}tapPiece(mount,hid,Number(p.dataset.piece),spotFromEvent(mount,e,hid));});
  mount.querySelectorAll('[data-res]').forEach(r=>r.onclick=()=>tapResident(mount,hid,r.dataset.res));
  const add=$('homeAddRes');if(add)add.onclick=()=>pickResident(mount,hid);
  const cm=$('homeCancelMove');if(cm)cm.onclick=()=>{moving=null;render(mount);};
  startWander(mount,hid);try{wear?.(mount);}catch{}
 }
 // While moving a piece, a tap that lands on another piece still means "this tile".
 function spotFromEvent(mount,e,hid){const L=layoutOf(hid);const fl=mount.querySelector('#homeFloor').getBoundingClientRect(),wl=mount.querySelector('#homeWall').getBoundingClientRect();
  const tile=fl.width/L.cols;if(e.clientY<fl.top&&e.clientY>=wl.top)return {x:Math.floor((e.clientX-fl.left)/tile),y:-1,wall:true};
  return {x:Math.floor((e.clientX-fl.left)/tile),y:Math.floor((e.clientY-fl.top)/tile),wall:false};}

 // ---------- bonuses (growth multipliers) ----------
 const BONUS_NAME={run:'Run',swim:'Swim',power:'Power',fly:'Fly',stamina:'Stamina',hp:'HP',food:'Meals',mood:'Fun',discovery:'Finds'};
 function bonuses(hid){const h=house(hid),cap=objects[hid].capacity,out=[];const sum=houseSummary(h,objects);
  for(const k of ['run','swim','power','fly','stamina','hp','food','mood','discovery'])if(sum[k]){const pieces=h.furniture.filter(f=>objects[f.id]?.effect===k).map(f=>({id:f.id,q:qOf(f.id)}));const raw=pieces.reduce((n,p)=>n+p.q.pct,0);const pct=Math.min(Math.round(FURNITURE_BONUS_MAX*100),raw);out.push({k,pct,raw,n:sum[k],pieces});}
  return {growth:HOUSE_GROWTH[cap]||1,list:out};}
 function bonusChips(hid){const b=bonuses(hid);return `<button type="button" class="home-eff is-growth" data-eff="growth">Growth ×${b.growth}</button>`+b.list.map(x=>`<button type="button" class="home-eff" data-eff="${x.k}">${BONUS_NAME[x.k]} +${x.pct}%</button>`).join('')+(extOn(hid,'garden')?'<span class="home-eff is-ext">🌳 Garden ×1.05 · Fun +20%</span>':'')+(extOn(hid,'pool')?'<span class="home-eff is-ext">🏊 Swim +25%</span>':'');}
 /** V103: where every bonus comes from (tap a chip under the room). */
 function bonusSheet(hid,focus){const b=bonuses(hid),o=objects[hid],it=byId.get(hid),al=ctx.alchemy?.()||{mult:1,finds:0};
  const ladder=houseIds().map(id=>`<li class="${id===hid?'is-here':''}">${escapeText(uiName(byId.get(id)))} <b>×${HOUSE_GROWTH[objects[id].capacity]}</b></li>`).join('');
  const sec=x=>{const f=Math.round(b.growth*(1+x.pct/100)*al.mult*100)/100;return `<section class="home-why ${focus===x.k?'is-focus':''}"><h3>${BONUS_NAME[x.k]} +${x.pct}%</h3><ul>${x.pieces.map(p=>`<li>${escapeText(uiName(byId.get(p.id)))} <span class="home-stars">${starsText(p.q.stars)}</span><b>+${p.q.pct}%</b></li>`).join('')}</ul>${x.raw>x.pct?`<p class="mini-muted">Pieces add up to +${x.raw}% — the cap is +${Math.round(FURNITURE_BONUS_MAX*100)}% per bonus.</p>`:''}<p class="home-why-total">${BONUS_NAME[x.k]} grows <b>×${f}</b> = house ×${b.growth} × furniture ×${(1+x.pct/100).toFixed(2)} × alchemy ×${al.mult}</p></section>`;};
  showModal(`<div class="modal-tag">WHERE THE BONUSES COME FROM</div><h2>${escapeText(uiName(it))}</h2>
   <section class="home-why ${focus==='growth'?'is-focus':''}"><h3>Growth ×${b.growth}</h3><p>Every resident of this house grows ×${b.growth} faster. Better houses grow faster:</p><ul class="home-ladder">${ladder}</ul><p class="mini-muted">On top of that, Alchemy adds <b>×${al.mult}</b> to every companion (${Number(al.finds).toLocaleString('en-US')} elements found in Classic).</p></section>
   ${b.list.map(sec).join('')||'<p class="mini-muted">No furniture bonuses yet: training, food, fun and book furniture each add their own bonus.</p>'}
   <p class="mini-muted">Each piece adds a bonus to what it trains. Pieces that need more combinations to discover are better: ★ +10% … ★★★★★ +30%. Race prizes are ★★★★★. Decor gives no bonus.</p>
   <button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;const el=document.querySelector('.home-why.is-focus');if(el)el.scrollIntoView?.({block:'nearest'});}
 function houseInfo(mount,id){const o=objects[id],have=isDiscovered(id),it=byId.get(id),tier=houseIds().indexOf(id)+1,L=layoutFor(o.capacity);
  if(!have){showModal(`<div class="modal-tag">COMPANION HOUSE · TIER ${tier}</div><div class="modal-art home-locked-art">${staticArt(it)}</div><h2>Undiscovered house</h2><p>Room for <b>${o.capacity}</b> companion${o.capacity>1?'s':''} · ${L.cols}×${L.rows} floor.</p><p class="home-bonus-line">Residents grow <b>×${HOUSE_GROWTH[o.capacity]}</b> faster.</p><p class="mini-muted">Better houses are upgrades of the previous one, so their recipes are longer.</p><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);$('homeClose').onclick=closeModal;return;}
  const b=bonuses(id),active=id===state.active;
  showModal(`<div class="modal-tag">COMPANION HOUSE · TIER ${tier}</div><div class="modal-art">${staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2><p>${escapeText(it.summary||'')}</p>
   <div class="home-bonus"><div class="home-bonus-big">×${b.growth}<small>growth for every resident</small></div>
   <ul>${b.list.length?b.list.map(x=>`<li><b>${BONUS_NAME[x.k]} +${x.pct}%</b> · ${x.pieces.map(p=>escapeText(uiName(byId.get(p.id)))+' +'+p.q.pct+'%').join(', ')}</li>`).join(''):'<li>Add training, food, fun or book furniture for extra bonuses.</li>'}</ul></div>
   ${(()=>{const ks=Object.keys(EXT_INFO).filter(k=>extOn(id,k));const can=Object.keys(EXT_INFO).filter(k=>fitsExt(id,k)&&!extOn(id,k));return (ks.length?`<ul class="home-ext-list">${ks.map(k=>`<li>${EXT_INFO[k].icon} <b>${EXT_INFO[k].label}</b>${builtIn(id,k)?' (built in)':''} · ${EXT_INFO[k].line}</li>`).join('')}</ul>`:'')+(can.length?`<p class="mini-muted">Add-ons that fit this house: ${can.map(k=>EXT_INFO[k].label).join(', ')}.</p>`:'');})()}
   <p class="mini-muted">Room for ${capOf(id)} · ${layoutOf(id).cols}×${layoutOf(id).rows} floor. Bonuses only speed up growth from meals, gifts, discoveries and training — moving a companion to another house never takes away what it already earned.</p>
   ${active?'':'<button type="button" class="modal-button" id="homeGo">Go to this house</button>'}<button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;const go=$('homeGo');if(go)go.onclick=()=>{state.active=id;moving=null;save();closeModal();render(mount);};}

 // ---------- drag and drop: press and hold a piece (or use Move) and drag it over the grid ----------
 function wireDrag(mount,hid,el){
  const hit=el.querySelector('.home-hit');if(!hit)return;
  const i=Number(el.dataset.piece);let hold=null,drag=null;
  hit.addEventListener('pointerdown',e=>{
   const start=()=>{const h=house(hid),f=h.furniture[i];if(!f)return;const L=layoutOf(hid);
    const fl=mount.querySelector('#homeFloor').getBoundingClientRect(),tile=fl.width/L.cols;
    const px=Math.floor((e.clientX-fl.left)/tile),py=Math.floor((e.clientY-fl.top)/tile);
    drag={f,L,fl,tile,offX:px-f.x,offY:f.y<0?0:py-f.y,x:f.x,y:f.y,ok:true,wall:layerOf(RS,f.id)==='wall'};
    el.classList.add('is-dragging');stopWander();try{hit.setPointerCapture(e.pointerId);}catch{}navigator.vibrate?.(12);};
   if(moving&&moving.index===i){start();}
   else hold=setTimeout(start,320);
  });
  hit.addEventListener('pointermove',e=>{
   if(!drag){if(hold&&Math.abs(e.movementX)+Math.abs(e.movementY)>8){clearTimeout(hold);hold=null;}return;}
   e.preventDefault();const {f,L,fl,tile}=drag;
   const px=Math.floor((e.clientX-fl.left)/tile),py=Math.floor((e.clientY-fl.top)/tile);
   const x=px-drag.offX,y=drag.wall?-1:py-drag.offY;
   if(x===drag.x&&y===drag.y)return;drag.x=x;drag.y=y;
   drag.ok=fits(house(hid),L,objects,RS,{...f,x,y},i);
   const [,fh]=footprint(objects,f);
   el.style.setProperty('--x',x);if(!drag.wall){el.style.setProperty('--y',y);el.style.setProperty('--z',10+(y+fh)*2);}
   el.classList.toggle('is-bad',!drag.ok);el.classList.toggle('is-good',drag.ok);
  });
  const end=()=>{clearTimeout(hold);hold=null;if(!drag)return;const d=drag;drag=null;dragEndedAt=Date.now();
   if(d.ok&&(d.x!==d.f.x||d.y!==d.f.y)){d.f.x=d.x;d.f.y=d.wall?-1:d.y;moving=null;save();}
   else if(!d.ok)toast('It does not fit there','repeat');
   render(mount);};
  hit.addEventListener('pointerup',end);hit.addEventListener('pointercancel',end);
 }

 // ---------- furniture ----------
 function tapSpot(mount,hid,x,y,wall){
  const h=house(hid),L=layoutOf(hid);
  if(moving){const f=h.furniture[moving.index];if(!f)return;const isWall=layerOf(RS,f.id)==='wall';if(isWall!==wall){toast(isWall?'Wall pieces hang on the wall':'Put it on the floor','repeat');return;}
   const cand={...f,x,y:isWall?-1:y};if(fits(h,L,objects,RS,cand,moving.index)){f.x=cand.x;f.y=cand.y;moving=null;save();render(mount);}else toast('It does not fit there','repeat');return;}
  const owned=furnitureOwned().filter(id=>(layerOf(RS,id)==='wall')===wall);
  if(!owned.length){showModal(`<div class="modal-tag">FURNITURE</div><h2>${wall?'Nothing to hang yet':'No furniture yet'}</h2><p>${wall?'Picture frames, clocks, curtains and tapestries hang on the wall.':'Furniture is discovered like any element: beds, sofas, treadmills, paddling pools, bookshelves, food bowls… Each one trains a stat, cheers companions up, feeds them or boosts discoveries.'}</p><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);$('homeClose').onclick=closeModal;return;}
  const rows=owned.map(id=>{const ob=objects[id],where=placedAnywhere(id),ok=!where&&fits(h,L,objects,RS,{id,x,y:wall?-1:y,r:0});const it=byId.get(id);
   return {ok,html:`<button type="button" class="home-pick ${ok?'':'is-off'}" data-pick="${id}" ${ok?'':'disabled'}><span class="home-pick-art">${staticArt(it)}</span><span class="home-pick-main"><strong>${escapeText(uiName(it))}</strong><small>${bonusText(id)} · ${ob.size[0]}×${ob.size[1]}${where?' · placed'+(where===hid?' here':' in another house'):ok?'':' · no room here'}</small></span></button>`};}).sort((a,b)=>b.ok-a.ok).map(r=>r.html).join('');
  showModal(`<div class="modal-tag">${wall?'HANG ON THE WALL':'ADD FURNITURE'}</div><h2>Choose a piece</h2><div class="home-pick-list">${rows}</div><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;
  document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{h.furniture.push({id:b.dataset.pick,x,y:wall?-1:y,r:0});save();closeModal();render(mount);});
 }
 function tapPiece(mount,hid,i,spot=null){
  const h=house(hid),f=h.furniture[i];if(!f)return;const it=byId.get(f.id),ob=objects[f.id],L=layoutOf(hid),layer=layerOf(RS,f.id);
  const what=ob.effect==='decor'?'Decoration — makes the house yours.':`${EFFECT_LABEL[ob.effect]}: ${({run:'residents run on it',swim:'residents splash and swim in it',power:'residents build strength',fly:'residents bounce and glide',stamina:'residents climb and balance',hp:'residents rest and recover',mood:'residents have fun',food:'residents eat here',discovery:'residents explore and find more'})[ob.effect]}.`;
  showModal(`<div class="modal-tag">FURNITURE</div><div class="modal-art">${staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2><p>${what}</p><p class="home-bonus-line">${bonusText(f.id)}${ob.effect==='decor'?'':' growth for residents'}</p><p class="mini-muted">To move it, press and hold it in the room and drag it.</p>${layer!=='wall'?'<button type="button" class="modal-button" id="homeRotate">Rotate</button>':''}${layer==='floor'&&spot&&!spot.wall?'<button type="button" class="modal-button" id="homeOnTop">Put furniture on it</button>':''}<button type="button" class="modal-button secondary" id="homeRemove">Put away</button>`);
  const rot=$('homeRotate');if(rot)rot.onclick=()=>{for(let k=1;k<=3;k++){const r=(f.r+k)%4;if(fits(h,L,objects,RS,{...f,r},i)){f.r=r;save();closeModal();render(mount);return;}}toast('No room to rotate it here','repeat');};
  const top=$('homeOnTop');if(top)top.onclick=()=>{closeModal();tapSpot(mount,hid,spot.x,spot.y,false);};
  $('homeRemove').onclick=()=>{h.furniture.splice(i,1);save();closeModal();render(mount);};
 }

 // ---------- residents ----------
 function pickResident(mount,hid){
  const h=house(hid),cap=capOf(hid);
  const list=roster.filter(c=>isDiscovered(c.id)&&!h.residents.includes(c.id));
  if(!list.length){showModal(`<div class="modal-tag">RESIDENTS</div><h2>No companion available</h2><p>Discover companion elements (five per family) to invite them home.</p><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);$('homeClose').onclick=closeModal;return;}
  showModal(`<div class="modal-tag">INVITE A COMPANION</div><h2>${h.residents.length}/${cap} living here</h2><div class="home-pick-list">${list.map(c=>{const w=residentOf(c.id);return `<button type="button" class="home-pick" data-inv="${c.id}"><span class="home-pick-art">${sprites[c.id]||''}</span><span class="home-pick-main"><strong>${escapeText(companionName(c.id))}</strong><small>${w?'moves from '+escapeText(uiName(byId.get(w))):'free'}</small></span></button>`;}).join('')}</div><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;
  document.querySelectorAll('[data-inv]').forEach(b=>b.onclick=()=>{const cid=b.dataset.inv,w=residentOf(cid);if(w)state.houses[w].residents=state.houses[w].residents.filter(x=>x!==cid);if(h.residents.length<cap)h.residents.push(cid);save();closeModal();render(mount);});
 }
 function tapResident(mount,hid,cid){
  const g=HOUSE_GROWTH[objects[hid].capacity]||1;
  showModal(`<div class="modal-tag">RESIDENT</div><div class="home-res-head"><span class="home-res-big">${sprites[cid]||''}</span><div><h2>${escapeText(companionName(cid))}</h2><small>Lives in ${escapeText(uiName(byId.get(hid)))} · grows ×${g} faster</small></div></div>${statsHtml?.(cid)||''}<button type="button" class="modal-button secondary" id="homeEvict">Move out</button><button type="button" class="modal-button secondary" id="homeClose">Close</button>`);
  $('homeClose').onclick=closeModal;$('homeEvict').onclick=()=>{const h=house(hid);h.residents=h.residents.filter(x=>x!==cid);save();closeModal();render(mount);};
 }

 // ---------- residents walk to furniture and use it ----------
 function rig(el,cid){el.innerHTML=sprites[cid]||'';for(const g of el.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}const svg=el.querySelector('svg');if(svg){svg.setAttribute('width','100%');svg.setAttribute('height','100%');}}
 function useSpot(f,L){const [w,h]=footprint(objects,f);const name=uiName(byId.get(f.id))||'';const layer=layerOf(RS,f.id);
  // V112: residents stand in the CENTRE of what they use (fractional tiles), not on its first tile.
  if(layer!=='floor'&&FRONT_USE.test(name)){const fy=f.y+h-(/punching/i.test(f.id)?1:0.45);return {x:f.x+(w-1)/2,y:Math.min(L.rows-1,fy),front:true};}
  const m=motionOf(f.id,name,objects[f.id]?.effect);const lift=m==='wheel'?-0.36:m==='bike'||m==='rock'?0.15:0;
  return {x:f.x+(w-1)/2,y:f.y+(h-1)/2-lift,front:false};}
 function startWander(mount,hid){
  const h=house(hid),L=layoutOf(hid),res=h.residents.filter(isDiscovered),{ground,up,yard}=splitResidents(hid,res);
  const ground0=mount.querySelector('#homeResidents');if(ground0)wanderZone({box:ground0,root:mount,attr:'data-piece',L,furniture:h.furniture,residents:ground,train:true});
  const upBox=mount.querySelector('[data-zres="up"]');if(upBox&&up.length)wanderZone({box:upBox,root:upBox.parentElement,attr:'data-zpiece',L:{cols:L.cols,rows:UP_ROWS},furniture:upstairsPlan(hid),residents:up,train:false});
  const yBox=mount.querySelector('[data-zres="yard"]');if(yBox&&yard.length)wanderZone({box:yBox,root:yBox.parentElement,attr:'data-zpiece',L:{cols:L.cols,rows:YARD_ROWS},furniture:yardPlan(hid),residents:yard,train:false});}
 /** One wander loop per zone (ground floor, upstairs, yard): walk around pieces, use them, loop. */
 function wanderZone({box,root,attr,L,furniture,residents,train}){
  const h={furniture};
  const usable=h.furniture.filter(f=>layerOf(RS,f.id)!=='wall'&&objects[f.id]?.effect!=='decor');
  const walkers=residents.map((cid,i)=>{const el=document.createElement('span');el.className='companion home-walker';el.dataset.anim='idle';el.dataset.companion=cid;
   const art=document.createElement('span');art.className='companion-art';rig(art,cid);el.append(art);const fx=document.createElement('span');fx.className='home-fx';el.append(fx);box.append(el);
   const p={x:(i*2+1)%L.cols,y:L.rows-1-(i%L.rows),face:1};place(el,p);return {cid,el,p,busyUntil:0,taken:null};});
  try{wear?.(box);}catch{}
  if(!walkers.length||reducedMotion())return;
  const taken=new Set();
  const blockedFor=open=>{const b=new Set();for(const f of h.furniture){if(f===open||layerOf(RS,f.id)!=='object')continue;const [fw,fh]=footprint(objects,f);for(let yy=f.y;yy<f.y+fh;yy++)for(let xx=f.x;xx<f.x+fw;xx++)b.add(yy*L.cols+xx);}return b;};
  const openTiles=()=>{const b=blockedFor(null),o=[];for(let y=0;y<L.rows;y++)for(let x=0;x<L.cols;x++)if(!b.has(y*L.cols+x))o.push({x,y});return o;};
  {const o=openTiles();walkers.forEach((w,i)=>{if(o.length){const t=o[(i*3+o.length-1)%o.length];w.p.x=t.x;w.p.y=t.y;place(w.el,w.p);}});}
  // walk a list of waypoints, one CSS transition per segment; returns the total time
  const walkPath=(w,pts)=>{let t=0;clearTimeout(w.t);(w.legs||[]).forEach(clearTimeout);w.legs=[];let cur={x:w.p.x,y:w.p.y};
   for(const pt of pts){const d=Math.hypot(pt.x-cur.x,pt.y-cur.y);const ms=Math.max(160,d*520);const at=t;const face=pt.x>cur.x+0.01?1:pt.x<cur.x-0.01?-1:0;
    w.legs.push(setTimeout(()=>{if(face){w.p.face=face;w.el.dataset.face=face>0?'right':'left';}w.el.dataset.anim='walk';w.el.style.transitionDuration=ms+'ms';w.p.x=pt.x;w.p.y=pt.y;place(w.el,w.p);},at));t+=ms;cur=pt;}
   return t;};
  const tick=()=>{if(!document.body.contains(box))return stopWander();const now=Date.now();
   for(const w of walkers){if(now<w.busyUntil)continue;
    if(w.taken){taken.delete(w.taken);w.taken=null;}
    w.el.className='companion home-walker';w.el.dataset.anim='idle';
    const free=usable.filter(f=>!taken.has(f));let f=null;
    if(free.length&&Math.random()<0.65)f=free[Math.floor(Math.random()*free.length)];
    let tx,ty,spot=null;
    if(f){spot=useSpot(f,L);tx=spot.x;ty=spot.y;}
    else{const o=openTiles();const t=o[Math.floor(Math.random()*o.length)]||{x:w.p.x,y:w.p.y};tx=t.x;ty=t.y;}
    // grid path (around furniture) to the tile of the spot, then a short final step to the exact spot
    const blocked=blockedFor(f);const tile={x:Math.max(0,Math.min(L.cols-1,Math.round(tx))),y:Math.max(0,Math.min(L.rows-1,Math.round(ty)))};
    let path=findPath(L,blocked,w.p,tile);if(!path){if(f){f=null;spot=null;}path=[];}else{if(f)taken.add(f),w.taken=f;}
    const pts=[...path];if(f&&(Math.abs(tile.x-tx)>0.01||Math.abs(tile.y-ty)>0.01))pts.push({x:tx,y:ty});
    if(!pts.length)pts.push({x:w.p.x,y:w.p.y});
    const walkMs=walkPath(w,pts);
    const useMs=f?3800+Math.random()*2500:900+Math.random()*1200;w.busyUntil=now+walkMs+useMs;
    w.t=setTimeout(()=>{
     if(!f){w.el.dataset.anim='idle';return;}
     const eff=objects[f.id].effect,u=USE[eff]||USE.decor;
     if(spot.front){w.p.face=1;w.el.dataset.face='right';}
     else{const [,fh]=footprint(objects,f);w.el.style.setProperty('--z',11+(f.y+fh)*2);}
     w.el.dataset.anim=u.anim;if(u.cls)w.el.classList.add(u.cls);w.el.classList.add('is-using');
     const piece=root.querySelector(`[${attr}="${h.furniture.indexOf(f)}"]`);const mk=motionOf(f.id,uiName(byId.get(f.id))||'',eff);
     if(mk){w.el.classList.add('m-'+mk);if(mk==='wheel'||mk==='treadmill'||mk==='bike'){w.p.face=1;w.el.dataset.face='right';w.el.dataset.anim='walk';}}
     if(piece){piece.classList.add('is-in-use');if(mk)piece.classList.add('m-'+mk);const o=MOTION_OV[mk];let ovEl=null;
      if(o&&!(f.r%2)){ovEl=document.createElement('span');ovEl.className='home-motion';ovEl.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}">${o.svg}</svg>`;piece.insertBefore(ovEl,piece.querySelector('.home-hit'));}
      setTimeout(()=>{piece.classList.remove('is-in-use');if(mk)piece.classList.remove('m-'+mk);ovEl?.remove();},useMs);}
     setTimeout(()=>{if(train&&applyEffect?.(w.cid,eff)){const fxEl=w.el.querySelector('.home-fx');fxEl.dataset.eff=eff;fxEl.classList.remove('is-pop');void fxEl.offsetWidth;fxEl.classList.add('is-pop');}},Math.min(1800,useMs/2));
    },walkMs);}
   wanderTimers.push(setTimeout(tick,700));};
  wanderTimers.push(setTimeout(tick,500));
 }
 function place(el,p){el.style.setProperty('--x',p.x);el.style.setProperty('--y',p.y);el.style.setProperty('--z',11+(p.y+1)*2);el.dataset.face=p.face>0?'right':'left';}
 function stopWander(){wanderTimers.forEach(clearTimeout);wanderTimers=[];}

 function growthFor(cid,kind){const hid=residentOf(cid);if(!hid||!isDiscovered(hid))return 1;return Math.round(growthMultiplier(objects[hid].capacity,house(hid),objects,kind,bonusOf)*extMult(hid,kind)*100)/100;}
 function houseLine(cid){const hid=residentOf(cid);if(!hid||!isDiscovered(hid))return '';return `Lives in ${escapeText(uiName(byId.get(hid)))} · grows ×${HOUSE_GROWTH[objects[hid].capacity]||1} faster`;}
 return {render,stopWander,growthFor,houseLine,addonInfo,state:()=>state,summary:id=>houseSummary(house(id),objects),ownedHouses,residentOf,
  importState(raw){if(raw&&raw.houses){state={v:1,active:raw.active||null,houses:raw.houses};save();}}};
}
