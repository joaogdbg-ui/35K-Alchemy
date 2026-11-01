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
 * V87: first activation free, later switches through ctx.requestActivation (rewarded ad +
 * 5-minute grace in the app); a "seen" list drives the Companions tab badge; stroking the
 * companion (rub it) pets it; an emotion orb (heart / spiral / bowl / burst) floats over its
 * head for moments; a belly meter empties over hours and makes it hungry; companions can be renamed.
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
/** V115: feeding value grows with how hard the element is to make (recipe depth). */
export const feedDepthMult=d=>Number.isFinite(d)?Math.round(Math.min(1.8,0.6+0.12*Math.max(0,d))*100)/100:1;
export const GIFT_INTERVAL_MS=[150*1000,320*1000];
export const SELF_FEED_INTERVAL_MS=[200*1000,420*1000];
export const HUNGRY_SELF_FEED_MS=[60*1000,120*1000];
export const BELLY_DECAY_MS=6*60*1000;   // -1 belly every 6 min (full → empty in ~10 h)
export const PET_MOOD_CAP=12;            // mood gained by stroking per 10 minutes
export const NICK_MAX=16;
export const HOME_DAILY_CAP=200;          // V90: stat bar points a companion can gain per day from house furniture

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

/**
 * V116/V117 companion looks (owner idea from SA2 Chao: what they eat changes how they look).
 * V117: coherent THEMES — one element can give a whole matching set (Demon: shadowy tint + devil
 * horns + bat wings + devil tail; Angel: bright tint + halo + feathered wings; Dragon, Fairy,
 * Phoenix, Ocean, Fox, Robot, Ice, Fire…). Slots: head, back, tail, aura (newer replaces older).
 * Harder elements are more extravagant (recipe depth): depth ≤3 only tints/sizes, 4–8 also gives
 * traits, 9+ gives RADIANT traits (bigger, glowing, animated) and a deeper tint.
 * Resets: soap/bath wash the tint, mirror undoes size and head, egg/rebirth/reset restores all.
 */
export const LOOK_COLORS={warm:[255,138,61],cool:[74,168,255],green:[79,191,90],metal:[150,165,180],purple:[160,112,224],gold:[232,192,64],pink:[255,143,192],dark:[70,48,92],light:[255,250,232]};
const TINT_NAME={warm:'Warm',cool:'Cool',green:'Leafy',metal:'Metallic',purple:'Mystic',gold:'Golden',pink:'Rosy',dark:'Shadowy',light:'Bright'};
const TRAIT_NAME={leaf:'Leaf sprout',flower:'Flower',flame:'Little flame',flake:'Snowflake',antenna:'Antenna',star:'Star',crown:'Crown','devil-horns':'Devil horns','dragon-horns':'Dragon horns',halo:'Halo','bat-wings':'Bat wings','feather-wings':'Feathered wings','butterfly-wings':'Butterfly wings','dragon-wings':'Dragon wings','fire-wings':'Fire wings',fin:'Fin','devil-tail':'Devil tail','fox-tail':'Fox tail','fish-tail':'Fish tail','dragon-tail':'Dragon tail',sparkle:'Sparkles',bubbles:'Bubbles',hearts:'Hearts',notes:'Music notes',embers:'Embers'};
export const LOOK_THEMES=[
 ['demon',/\b(demon|devil|imp|fiend|lucifer|hellhound|inferno|underworld|diablo)\b/,{tint:'dark',head:'devil-horns',back:'bat-wings',tail:'devil-tail'}],
 ['vampire',/\b(vampire|dracula|bat)\b/,{tint:'dark',back:'bat-wings'}],
 ['angel',/\b(angel|angels|heaven|holy|divine|saint|halo|cherub|seraph)\b/,{tint:'light',head:'halo',back:'feather-wings'}],
 ['phoenix',/\bphoenix\b/,{tint:'warm',head:'flame',back:'fire-wings',aura:'embers'}],
 ['dragon',/\b(dragon|dragons|wyvern|drake)\b/,{tint:'green',head:'dragon-horns',back:'dragon-wings',tail:'dragon-tail'}],
 ['fairy',/\b(fairy|pixie|sprite|butterfly|moth)\b/,{tint:'pink',back:'butterfly-wings',aura:'sparkle'}],
 ['ocean',/\b(fish|mermaid|shark|whale|dolphin|seahorse|octopus|squid|koi)\b/,{tint:'cool',back:'fin',tail:'fish-tail',aura:'bubbles'}],
 ['fox',/\b(fox|kitsune|wolf)\b/,{tail:'fox-tail'}],
 ['robot',/\b(robot|android|cyborg|mech|robotics)\b/,{tint:'metal',head:'antenna'}],
 ['bird',/\b(bird|eagle|owl|parrot|feather|pegasus|griffin|swan|dove)\b/,{back:'feather-wings'}],
 ['ice',/\b(ice|snow|frost|glacier|yeti|blizzard|iceberg)\b/,{tint:'cool',head:'flake'}],
 ['fire',/\b(fire|flame|lava|magma|volcano|ember|torch|wildfire|campfire)\b/,{tint:'warm',head:'flame'}],
 ['flower',/\b(flower|rose|tulip|blossom|daisy|sunflower|lily|orchid)\b/,{tint:'pink',head:'flower'}],
 ['plant',/\b(leaf|tree|plant|sprout|seed|herb|vine|bonsai|forest|moss)\b/,{tint:'green',head:'leaf'}],
 ['space',/\b(star|stars|planet|galaxy|comet|moon|astronaut|rocket|nebula)\b/,{tint:'purple',head:'star'}],
 ['royal',/\b(king|queen|crown|royal|prince|princess|throne)\b/,{tint:'gold',head:'crown'}],
 ['love',/\b(love|heart|valentine|romance)\b/,{tint:'pink',aura:'hearts'}],
 ['music',/\b(music|song|guitar|piano|drum|melody|vinyl|concert)\b/,{aura:'notes'}],
 ['magic',/\b(magic|crystal|potion|spell|wizard|witch|arcane|gem|diamond)\b/,{tint:'purple',aura:'sparkle'}],
 ['bubbles',/\b(bubble|bubbles|soda|fizz|foam)\b/,{aura:'bubbles'}],
 ['metal',/\b(metal|steel|iron|gear|machine|computer|console|engine)\b/,{tint:'metal'}],
 ['gold',/\b(gold|golden|treasure|coin|trophy|jewel)\b/,{tint:'gold'}],
 ['sweet',/\b(candy|sugar|cake|sweet|cupcake|cookie)\b/,{tint:'pink'}],
 ['water',/\b(water|rain|river|lake|ocean|sea|wave)\b/,{tint:'cool'}]];
/** V121: hand-picked corrections. name (lower case) → theme key, or '-' for no theme. A hand-picked name
 * never triggers reset/wash/mirror (e.g. "Dragon Egg Cradle" is a dragon, "Black Sabbath" is not a bath). */
export const LOOK_OVERRIDES={
 'demon slayer':'-','demon slayer corps':'-','demon slayer game':'-','demon slayer manga':'-','demon slayer: the hinokami chronicles':'-','tomb raider: underworld':'-','dust devil':'-',
 'bat-signal':'-','sun halo observatory':'-','ice halo':'ice','ice-crystal halo':'ice','moon halo':'space','rhythm heaven':'music','rhythm heaven fever':'music','mont-saint-michel':'-','temple of heaven':'-','angel falls':'water','shining the holy ark':'-',
 'phoenix wright: ace attorney':'-','phoenix wright: ace attorney - dual destinies':'-','phoenix wright: ace attorney - spirit of justice':'-','hinokami kagura':'phoenix',
 'uncharted: drake’s fortune':'-','double dragon':'-','dragon slayer':'-','dragon slayer sword':'-','dragon balls':'-','super dragon balls':'-','black star dragon balls':'-','dragon radar':'-','dragon egg cradle':'dragon',
 'pixel sprite sheet':'-','pixel dinosaur sprite':'-','pixel sprite lightbox':'-','sprite animation light table':'-',
 'dolphin emulator':'-','doctor octopus':'-','fish and chips':'-','toby fox':'-','operation wolf':'-','mechassault 2: lone wolf':'-','android 18':'-','milk foam art':'sweet','faye valentine':'-','weighing of the heart':'-',
 'ice cream':'sweet','citrus ice pops':'sweet','sonic boom: fire & ice':'-','snow bunting':'bird','rose tyler':'-','enchanted compass rose':'-','sea lily':'-',
 'king bradley':'-','king of tokyo':'-','warcraft iii: the frozen throne':'-','paper mario: the origami king':'-','persona 5 royal':'-','twilight princess':'-','twilight princess hd':'-','the legend of zelda: twilight princess':'-','the legend of zelda: twilight princess hd':'-',
 'river song':'-','pokémon crystal':'-','pokémon diamond':'-','kirby 64: the crystal shards':'-','sonic boom: shattered crystal':'-',
 'kirby super star':'-','kirby super star ultra':'-','kirby star allies':'-','pokémon moon':'-','pokémon ultra moon':'-','chuchu rocket!':'-','rocket league':'-','super mario 3d all-stars':'-','star platinum':'-','star platinum jotaro':'-','team rocket':'-','daily planet':'-','jojo\'s bizarre adventure: all star battle':'-','luigi’s mansion: dark moon':'-','castlevania: circle of the moon':'vampire','mega man star force':'-','mega man star force 2':'-','mega man star force 3':'-','brittle star':'ocean','moon jellyfish':'ocean','kirby: planet robobot':'robot',
 'animal crossing: new leaf':'-','hidden leaf':'-','gold leaf frame':'gold','gold leaf bookmark':'gold','copper leaf foil':'metal',
 'black sabbath':'-','final fantasy vii rebirth':'-','kirby & the amazing mirror':'-','castlevania: lords of shadow - mirror of fate':'-','syphon filter: dark mirror':'-','sunshower':'water','meteor shower':'space','meteor shower calendar':'space','meteor shower almanac':'space','sun shower garden':'flower','egg custard':'sweet','spider egg sac':'-','enchanted egg ward':'magic','tide-washed pebble':'-','storm-washed shore':'water'};
const LOOK_OVERRIDE_PREFIX=[['halo:','-'],['halo ','-'],['fire emblem','-'],['the king of fighters','-'],['prince of persia','-'],['dragon ball','-']];
function lookOverride(name){const n=String(name||'').toLowerCase().trim();if(Object.hasOwn(LOOK_OVERRIDES,n))return LOOK_OVERRIDES[n];const pf=LOOK_OVERRIDE_PREFIX.find(([p])=>n.startsWith(p));return pf?pf[1]:undefined;}
function themeFor(name){const ov=lookOverride(name);if(ov!==undefined)return {theme:ov==='-'?null:LOOK_THEMES.find(([k])=>k===ov)||null,picked:true};const t=` ${String(name||'').toLowerCase()} `;return {theme:LOOK_THEMES.find(([,re])=>re.test(t))||null,picked:false};}
const FAMILY_TINT={nature:'green',fantasy:'purple',mythology:'gold',games:'metal'};
export const lookTier=d=>!Number.isFinite(d)?2:d>=9?3:d>=4?2:1;
export const defaultLook=()=>({tint:null,k:0,size:0,head:null,back:null,tail:null,aura:null,lux:{},mix:{head:{},back:{},tail:{},aura:{}}});
/** V119: each spot holds a MIX of traits with weights (sum ≤ 1). Traits grow over several meals and
 * morph into each other: eating another kind for the same spot shifts weight to it. head/back/… keep
 * the dominant trait (for labels and old saves). */
export function normLook(look){const L={...defaultLook(),...(look||{})};L.lux={...(L.lux||{})};const m=look?.mix||{};L.mix={};
 for(const sl of ['head','back','tail','aura']){L.mix[sl]={...(m[sl]||{})};if(!look?.mix&&L[sl]){L.mix[sl][L[sl]]=1;if(L.lux[sl])L.lux[sl+':'+L[sl]]=1;}}
 return L;}
const dominant=(mx)=>{const e=Object.entries(mx||{}).filter(([,w])=>w>0.04).sort((a,b)=>b[1]-a[1]);return e[0]?.[0]||null;};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
/** particle paths per power: [dx,dy,scale] (mouth/body-relative, facing right) */
const POWER_FX={fire:(i,n,r)=>[48+i*5+r*14,(r-.5)*18-i,1.2+i*.12],frost:(i,n,r)=>[44+i*5+r*12,(r-.5)*16,1+i*.1],
 fairy:(i,n,r)=>[(r-.5)*80,24+r*40,.6+r*.6],phoenix:(i,n)=>{const a=i/n*2*Math.PI;return [Math.cos(a)*46,Math.sin(a)*40-10,1];},
 shadow:(i,n,r)=>[(r-.5)*60,-30-r*30,1.4+r],holy:(i,n,r)=>[(i-n/2)*7,-18-r*14,.8+r*.4],water:(i,n,r)=>[(r-.5)*44,-28-i*2+r*8,.8+r*.5]};
export function lookAfterMeal(look,name,family='',category='',depth){
 const L=normLook(look);const tf=themeFor(name);const t=tf.picked?' ':` ${String(name||'').toLowerCase()} `;const notes=[];const tier=lookTier(depth);
 if(/rebirth|\begg\b|reset|reincarnat/.test(t)&&(L.k>0||L.size||['head','back','tail','aura'].some(sl=>Object.keys(L.mix[sl]).length))){notes.push('Back to its natural look');return {look:defaultLook(),notes};}
 const wash=/soap|bath|shower|wash|sponge|clean/.test(t);
 if(wash&&L.k>0){L.k=Math.round(L.k*0.4*100)/100;if(L.k<0.04){L.k=0;L.tint=null;}L.aura=null;notes.push('Washed some colour off');}
 if(/mirror|reflection/.test(t)&&(L.size||Object.keys(L.mix.head).length)){L.size=Math.round(L.size*0.4*100)/100;L.mix.head={};L.head=null;notes.push('Looks more like itself');}
 const theme=tf.theme;const set=theme?theme[2]:{};const tl=` ${String(name||'').toLowerCase()} `;
 const tk=set.tint||FAMILY_TINT[family];
 if(tk&&!wash){const c=LOOK_COLORS[tk];const step=[0,0.05,0.07,0.1][tier],cap=tier===3?0.62:0.5;L.tint=L.tint&&L.k>0?mix(L.tint,c,tier===3?0.6:0.4):c;const was=L.k;L.k=Math.min(cap,Math.round((L.k+step)*100)/100);if(L.k>was)notes.push(`A little more ${TINT_NAME[tk].toLowerCase()}`);}
 const grow=category==='food'||/\b(food|cake|bread|pie|burger|pizza|meal|feast|mountain|whale|giant|elephant|huge|titan|mammoth)\b/.test(tl),shrink=/\b(air|feather|cloud|bubble|tiny|mini|small|ant|mouse|dust|pebble)\b/.test(tl);
 if(grow&&!shrink&&L.size<0.15){L.size=Math.min(0.15,Math.round((L.size+0.02)*100)/100);notes.push('Grew a bit');}
 else if(shrink&&!grow&&L.size>-0.15){L.size=Math.max(-0.15,Math.round((L.size-0.02)*100)/100);notes.push('Got a bit smaller');}
 if(tier>=2)for(const slot of ['head','back','tail','aura']){const v=set[slot];if(!v)continue;const mx=L.mix[slot];const gain=tier===3?0.4:0.25;
  const before=dominant(mx),had=mx[v]||0;mx[v]=Math.min(1,had+gain);const others=Object.keys(mx).filter(k=>k!==v);const oSum=others.reduce((n,k)=>n+mx[k],0);
  if(mx[v]+oSum>1&&oSum>0){const f=Math.max(0,1-mx[v])/oSum;for(const k of others){mx[k]=Math.round(mx[k]*f*100)/100;if(mx[k]<0.04)delete mx[k];}}
  mx[v]=Math.round(mx[v]*100)/100;if(tier===3)L.lux[slot+':'+v]=1;
  const pct=Math.round(mx[v]*100),name=TRAIT_NAME[v];
  notes.push(before&&before!==v&&mx[before]>0.04?`${TRAIT_NAME[before]} morphing into ${name.toLowerCase()} (${pct}%)`:pct>=100&&had<1?`${tier===3?'Radiant ':''}${name} fully grown!`:`${tier===3?'Radiant ':''}${name} growing (${pct}%)`);}
 for(const sl of ['head','back','tail','aura'])L[sl]=dominant(L.mix[sl]);
 return {look:L,notes,theme:theme?.[0]||null,tier,tint:tk||null};
}
/** V120: signature powers — only the most extravagant looks (radiant traits from hard elements, ≥75% grown)
 * give the companion a little special move it does now and then. need = how many of the traits must qualify. */
export const LOOK_POWERS=[
 {id:'fire',name:'Fire breath',theme:'dragon',traits:['head:dragon-horns','back:dragon-wings','tail:dragon-tail'],need:2,sfx:'breath'},
 {id:'fairy',name:'Fairy dust',theme:'fairy',traits:['back:butterfly-wings'],need:1,sfx:'happy'},
 {id:'phoenix',name:'Phoenix blaze',theme:'phoenix',traits:['back:fire-wings'],need:1,sfx:'flap'},
 {id:'frost',name:'Frost breath',theme:'ice',traits:['head:flake'],need:1,sfx:'breath'},
 {id:'shadow',name:'Shadow smoke',theme:'demon',traits:['head:devil-horns','back:bat-wings','tail:devil-tail'],need:2,sfx:'purr'},
 {id:'holy',name:'Holy light',theme:'angel',traits:['head:halo','back:feather-wings'],need:2,sfx:'medal'},
 {id:'water',name:'Water spout',theme:'ocean',traits:['tail:fish-tail'],need:1,sfx:'splash'}];
export function powersOf(look){if(!look)return [];const N=normLook(look);
 return LOOK_POWERS.filter(pw=>pw.traits.filter(k=>{const [sl,id]=k.split(':');return N.lux[k]&&(N.mix[sl][id]||0)>=0.75;}).length>=pw.need);}
/** V118: what an element WOULD do to a companion's looks (for the element sheet), from a plain look. */
export function lookEffects(name,family='',category='',depth){const tf=themeFor(name);const t=tf.picked?' ':` ${String(name||'').toLowerCase()} `;const tier=lookTier(depth);const r=lookAfterMeal(defaultLook(),name,family,category,depth).look;
 const theme=tf.theme;const set=theme?theme[2]:{};const tk=set.tint||FAMILY_TINT[family]||null;
 const traits=['head','back','tail','aura'].filter(sl=>set[sl]).map(sl=>({slot:sl,label:TRAIT_NAME[set[sl]],lux:tier===3,locked:tier<2}));
 const resets=[];if(/rebirth|\begg\b|reset|reincarnat/.test(t))resets.push('Restores the natural look');if(/soap|bath|shower|wash|sponge|clean/.test(t))resets.push('Washes colour off');if(/mirror|reflection/.test(t))resets.push('Undoes size and head trait');
 return {tint:tk&&!/soap|bath|shower|wash|sponge|clean/.test(t)?{key:tk,name:TINT_NAME[tk],rgb:LOOK_COLORS[tk]}:null,size:r.size,traits,resets,tier,theme:theme?.[0]||null};}
export function lookLabel(look){if(!look)return '';const out=[];const tk=look.tint&&look.k>0.02?Object.entries(LOOK_COLORS).sort((a,b)=>dist(a[1],look.tint)-dist(b[1],look.tint))[0][0]:null;
 if(tk)out.push(`${TINT_NAME[tk]} tint`);const N=normLook(look);for(const sl of ['head','back','tail','aura']){const e=Object.entries(N.mix[sl]).filter(([,w])=>w>0.04).sort((a,b)=>b[1]-a[1]);if(!e.length)continue;const lx=e.some(([k])=>N.lux[sl+':'+k]);const tot=e.reduce((n,[,w])=>n+w,0);
  out.push((lx?'✦ ':'')+(e.length>1?`${TRAIT_NAME[e[0][0]]} / ${TRAIT_NAME[e[1][0]].toLowerCase()} mix`:TRAIT_NAME[e[0][0]])+(tot<0.99?` ${Math.round(tot*100)}%`:''));}if(Math.abs(look.size||0)>=0.01)out.push(`Size ${look.size>0?'+':''}${Math.round(look.size*100)}%`);return out.join(' · ');}
/** V122: rows for the after-meal window: what changed in colour, size and each spot. */
export function lookDiff(before,after,tintKey){const A=normLook(before),B=normLook(after);const rows=[];
 const tn=L=>L.tint&&L.k>0.02?Object.entries(LOOK_COLORS).sort((a,b)=>dist(a[1],L.tint)-dist(b[1],L.tint))[0][0]:null;
 const pc=v=>Math.round(v*100);
 if(pc(A.k)!==pc(B.k)||String(A.tint)!==String(B.tint)){const k=tintKey&&B.k>A.k?tintKey:tn(B);rows.push({kind:'colour',label:'Colour',rgb:B.k>0.02?B.tint:null,text:k?`${TINT_NAME[k]} ${pc(A.k)}% → ${pc(B.k)}%`:'Back to natural'});}
 if(pc(A.size)!==pc(B.size)){const f=v=>`${v>0?'+':''}${pc(v)}%`;rows.push({kind:'size',label:'Size',text:`${f(A.size)} → ${f(B.size)}`});}
 const SL={head:'Head',back:'Back',tail:'Tail',aura:'Around'};
 for(const sl of ['head','back','tail','aura']){const ids=new Set([...Object.keys(A.mix[sl]),...Object.keys(B.mix[sl])]);const ch=[...ids].filter(id=>pc(A.mix[sl][id]||0)!==pc(B.mix[sl][id]||0));if(!ch.length)continue;
  const up=ch.filter(id=>(B.mix[sl][id]||0)>(A.mix[sl][id]||0)),down=ch.filter(id=>!up.includes(id));
  const parts=up.map(id=>`${B.lux[sl+':'+id]?'✦ ':''}${TRAIT_NAME[id]} ${pc(A.mix[sl][id]||0)}% → ${pc(B.mix[sl][id]||0)}%`);
  if(down.length)parts.push(down.map(id=>`${TRAIT_NAME[id].toLowerCase()} ${pc(B.mix[sl][id]||0)}%`).join(', ')+(up.length?' (morphing)':''));
  rows.push({kind:'trait',label:SL[sl],text:parts.join(' · ')});}
 return rows;}
const dist=(a,b)=>a.reduce((n,v,i)=>n+(v-b[i])**2,0);
/** Luminance-preserving tint matrix for an SVG feColorMatrix. */
export function tintMatrix(rgb,k){const [r,g,b]=rgb.map(v=>v/255*1.15);const T=[[.3*r,.59*r,.11*r],[.3*g,.59*g,.11*g],[.3*b,.59*b,.11*b]];const m=[];for(let i=0;i<3;i++){for(let j=0;j<3;j++)m.push(((1-k)*(i===j?1:0)+k*T[i][j]).toFixed(3));m.push('0','0');}m.push('0','0','0','1','0');return m.join(' ');}
const S='#4a4a5a';
const f1=n=>Math.round(n*10)/10;
// head traits: drawn around (0,0) = top centre of the head, size s
const HEAD={
 leaf:s=>`<path d="M0 0v${f1(-s*.35)}" stroke="#3f7d3a" stroke-width="${f1(s*.08)}"/><path d="M0 ${f1(-s*.3)}C${f1(-s*.55)} ${f1(-s*.45)} ${f1(-s*.35)} ${f1(-s*1.1)} 0 ${f1(-s*1.15)}C${f1(s*.35)} ${f1(-s*1.1)} ${f1(s*.55)} ${f1(-s*.45)} 0 ${f1(-s*.3)}Z" fill="#7cc463" stroke="${S}" stroke-width="${f1(s*.07)}"/>`,
 flower:s=>[0,72,144,216,288].map(a=>`<circle cx="${f1(Math.cos(a*Math.PI/180)*s*.28)}" cy="${f1(-s*.55+Math.sin(a*Math.PI/180)*s*.28)}" r="${f1(s*.2)}" fill="#f7a6c8" stroke="${S}" stroke-width="${f1(s*.05)}"/>`).join('')+`<circle cx="0" cy="${f1(-s*.55)}" r="${f1(s*.16)}" fill="#f3d266" stroke="${S}" stroke-width="${f1(s*.05)}"/>`,
 flame:s=>`<path d="M0 0C${f1(-s*.45)} ${f1(-s*.2)} ${f1(-s*.3)} ${f1(-s*.7)} 0 ${f1(-s*1.1)}C${f1(s*.3)} ${f1(-s*.7)} ${f1(s*.45)} ${f1(-s*.2)} 0 0Z" fill="#ff9a3d" stroke="${S}" stroke-width="${f1(s*.07)}"/><path d="M0 ${f1(-s*.12)}C${f1(-s*.2)} ${f1(-s*.25)} ${f1(-s*.12)} ${f1(-s*.5)} 0 ${f1(-s*.65)}C${f1(s*.12)} ${f1(-s*.5)} ${f1(s*.2)} ${f1(-s*.25)} 0 ${f1(-s*.12)}Z" fill="#ffe27a"/>`,
 flake:s=>[0,60,120].map(a=>`<path d="M${f1(-Math.cos(a*Math.PI/180)*s*.4)} ${f1(-s*.5-Math.sin(a*Math.PI/180)*s*.4)}L${f1(Math.cos(a*Math.PI/180)*s*.4)} ${f1(-s*.5+Math.sin(a*Math.PI/180)*s*.4)}" stroke="#8fd0f5" stroke-width="${f1(s*.12)}" stroke-linecap="round"/>`).join(''),
 antenna:s=>`<path d="M0 0L${f1(s*.1)} ${f1(-s*.8)}" stroke="${S}" stroke-width="${f1(s*.08)}"/><circle cx="${f1(s*.1)}" cy="${f1(-s*.85)}" r="${f1(s*.16)}" fill="#e0675a" stroke="${S}" stroke-width="${f1(s*.06)}"/>`,
 star:s=>`<path d="${[0,1,2,3,4,5,6,7,8,9].map(i=>{const r=i%2?s*.2:s*.45,a=-Math.PI/2+i*Math.PI/5;return (i?'L':'M')+f1(Math.cos(a)*r)+' '+f1(-s*.55+Math.sin(a)*r);}).join('')}Z" fill="#f3d266" stroke="${S}" stroke-width="${f1(s*.06)}"/>`,
 crown:s=>`<path d="M${f1(-s*.42)} 0L${f1(-s*.42)} ${f1(-s*.5)}L${f1(-s*.2)} ${f1(-s*.25)}L0 ${f1(-s*.6)}L${f1(s*.2)} ${f1(-s*.25)}L${f1(s*.42)} ${f1(-s*.5)}L${f1(s*.42)} 0Z" fill="#f1c26b" stroke="${S}" stroke-width="${f1(s*.07)}"/>`,
 'devil-horns':s=>[-1,1].map(d=>`<path d="M${f1(d*s*.18)} ${f1(s*.05)}C${f1(d*s*.3)} ${f1(-s*.35)} ${f1(d*s*.55)} ${f1(-s*.55)} ${f1(d*s*.62)} ${f1(-s*.85)}C${f1(d*s*.42)} ${f1(-s*.6)} ${f1(d*s*.15)} ${f1(-s*.45)} ${f1(d*s*.02)} ${f1(-s*.05)}Z" fill="#c8303a" stroke="${S}" stroke-width="${f1(s*.06)}"/>`).join(''),
 'dragon-horns':s=>[-1,1].map(d=>`<path d="M${f1(d*s*.15)} ${f1(s*.05)}Q${f1(d*s*.35)} ${f1(-s*.5)} ${f1(d*s*.8)} ${f1(-s*.6)}Q${f1(d*s*.4)} ${f1(-s*.25)} ${f1(d*s*.35)} ${f1(s*.05)}Z" fill="#efe3cf" stroke="${S}" stroke-width="${f1(s*.06)}"/>`).join(''),
 halo:s=>`<ellipse cx="0" cy="${f1(-s*.55)}" rx="${f1(s*.5)}" ry="${f1(s*.16)}" fill="none" stroke="#f3d266" stroke-width="${f1(s*.13)}"/><ellipse cx="0" cy="${f1(-s*.55)}" rx="${f1(s*.5)}" ry="${f1(s*.16)}" fill="none" stroke="#fff6c4" stroke-width="${f1(s*.04)}"/>`};
// back traits: one wing drawn to the LEFT of (0,0) (shoulder), mirrored for the right
const WING={
 'bat-wings':s=>`<path d="M0 0C${f1(-s*.3)} ${f1(-s*.6)} ${f1(-s*.8)} ${f1(-s*.75)} ${f1(-s*1.1)} ${f1(-s*.45)}C${f1(-s*.95)} ${f1(-s*.2)} ${f1(-s*.85)} ${f1(-s*.1)} ${f1(-s*.75)} ${f1(s*.05)}C${f1(-s*.62)} ${f1(-s*.08)} ${f1(-s*.5)} ${f1(-s*.05)} ${f1(-s*.42)} ${f1(s*.12)}C${f1(-s*.3)} ${f1(s*.02)} ${f1(-s*.15)} ${f1(s*.05)} 0 ${f1(s*.15)}Z" fill="#5b3a6e" stroke="${S}" stroke-width="${f1(s*.04)}"/><path d="M0 0L${f1(-s*1.1)} ${f1(-s*.45)}M${f1(-s*.25)} ${f1(-s*.25)}L${f1(-s*.75)} ${f1(s*.05)}M${f1(-s*.2)} ${f1(-s*.1)}L${f1(-s*.42)} ${f1(s*.12)}" stroke="#2f1e3b" stroke-width="${f1(s*.03)}"/>`,
 'feather-wings':s=>[0,1,2].map(i=>`<ellipse cx="${f1(-s*(.35+i*.18))}" cy="${f1(-s*(.25-i*.07))}" rx="${f1(s*(.42-i*.06))}" ry="${f1(s*.16)}" transform="rotate(${-20+i*12} ${f1(-s*(.35+i*.18))} ${f1(-s*(.25-i*.07))})" fill="#fbfaf4" stroke="${S}" stroke-width="${f1(s*.035)}"/>`).join(''),
 'butterfly-wings':s=>`<path d="M0 0C${f1(-s*.2)} ${f1(-s*.7)} ${f1(-s*.95)} ${f1(-s*.8)} ${f1(-s*.85)} ${f1(-s*.25)}C${f1(-s*.8)} ${f1(-s*.05)} ${f1(-s*.35)} ${f1(-s*.02)} 0 0Z" fill="#f7a6c8" stroke="${S}" stroke-width="${f1(s*.04)}"/><path d="M0 ${f1(s*.02)}C${f1(-s*.35)} ${f1(s*.05)} ${f1(-s*.7)} ${f1(s*.15)} ${f1(-s*.55)} ${f1(s*.42)}C${f1(-s*.35)} ${f1(s*.55)} ${f1(-s*.1)} ${f1(s*.3)} 0 ${f1(s*.05)}Z" fill="#a7d3f2" stroke="${S}" stroke-width="${f1(s*.04)}"/><circle cx="${f1(-s*.55)}" cy="${f1(-s*.38)}" r="${f1(s*.1)}" fill="#fff"/>`,
 'dragon-wings':s=>`<path d="M0 0L${f1(-s*.35)} ${f1(-s*.7)}L${f1(-s*1.15)} ${f1(-s*.55)}L${f1(-s*.9)} ${f1(-s*.25)}L${f1(-s*1)} 0L${f1(-s*.65)} ${f1(-s*.02)}L${f1(-s*.62)} ${f1(s*.18)}L${f1(-s*.3)} ${f1(s*.08)}L0 ${f1(s*.18)}Z" fill="#5e9e5a" stroke="${S}" stroke-width="${f1(s*.04)}"/><path d="M${f1(-s*.35)} ${f1(-s*.7)}L${f1(-s*.9)} ${f1(-s*.25)}M${f1(-s*.35)} ${f1(-s*.7)}L${f1(-s*.65)} ${f1(-s*.02)}M${f1(-s*.35)} ${f1(-s*.7)}L${f1(-s*.3)} ${f1(s*.08)}" stroke="#2f5a2e" stroke-width="${f1(s*.03)}"/>`,
 'fire-wings':s=>[0,1,2].map(i=>`<path d="M0 0C${f1(-s*(.3+i*.2))} ${f1(-s*(.75-i*.12))} ${f1(-s*(.75+i*.18))} ${f1(-s*(.5-i*.15))} ${f1(-s*(.9+i*.15))} ${f1(-s*(.15-i*.12))}C${f1(-s*(.55+i*.1))} ${f1(-s*(.12-i*.05))} ${f1(-s*.3)} ${f1(s*.02)} 0 ${f1(s*.12)}Z" fill="${['#ffcf5a','#ff9a3d','#e0573a'][i]}" stroke="${S}" stroke-width="${f1(s*.03)}"/>`).join('')};
// tail traits: drawn from (0,0) (lower back) towards the LEFT
const TAIL={
 'devil-tail':s=>`<path d="M0 0C${f1(-s*.4)} ${f1(s*.1)} ${f1(-s*.5)} ${f1(-s*.35)} ${f1(-s*.8)} ${f1(-s*.45)}" fill="none" stroke="#7a2230" stroke-width="${f1(s*.09)}" stroke-linecap="round"/><path d="M${f1(-s*.8)} ${f1(-s*.45)}l${f1(-s*.12)} ${f1(-s*.2)}l${f1(s*.28)} ${f1(s*.02)}Z" fill="#c8303a" stroke="${S}" stroke-width="${f1(s*.04)}" transform="rotate(-20 ${f1(-s*.8)} ${f1(-s*.45)})"/>`,
 'fox-tail':s=>`<path d="M0 0C${f1(-s*.45)} ${f1(s*.05)} ${f1(-s*.85)} ${f1(-s*.25)} ${f1(-s*.75)} ${f1(-s*.7)}C${f1(-s*.5)} ${f1(-s*.45)} ${f1(-s*.25)} ${f1(-s*.25)} 0 ${f1(-s*.15)}Z" fill="#e8834a" stroke="${S}" stroke-width="${f1(s*.04)}"/><path d="M${f1(-s*.75)} ${f1(-s*.7)}C${f1(-s*.7)} ${f1(-s*.5)} ${f1(-s*.6)} ${f1(-s*.42)} ${f1(-s*.5)} ${f1(-s*.42)}C${f1(-s*.55)} ${f1(-s*.55)} ${f1(-s*.65)} ${f1(-s*.65)} ${f1(-s*.75)} ${f1(-s*.7)}Z" fill="#fbf6ec"/>`,
 'fish-tail':s=>`<path d="M0 0C${f1(-s*.25)} ${f1(-s*.05)} ${f1(-s*.45)} ${f1(-s*.1)} ${f1(-s*.55)} ${f1(-s*.15)}L${f1(-s*.85)} ${f1(-s*.45)}L${f1(-s*.78)} ${f1(-s*.1)}L${f1(-s*.9)} ${f1(s*.2)}L${f1(-s*.55)} ${f1(-s*.02)}C${f1(-s*.4)} ${f1(s*.05)} ${f1(-s*.2)} ${f1(s*.08)} 0 ${f1(s*.08)}Z" fill="#6fb5d8" stroke="${S}" stroke-width="${f1(s*.04)}"/>`,
 'dragon-tail':s=>`<path d="M0 0C${f1(-s*.45)} ${f1(s*.15)} ${f1(-s*.7)} ${f1(-s*.1)} ${f1(-s*.95)} ${f1(-s*.35)}C${f1(-s*.65)} ${f1(-s*.2)} ${f1(-s*.4)} ${f1(-s*.05)} 0 ${f1(-s*.15)}Z" fill="#5e9e5a" stroke="${S}" stroke-width="${f1(s*.04)}"/>${[0.3,0.55,0.78].map(k=>`<path d="M${f1(-s*k)} ${f1(-s*(.08+k*.2))}l${f1(s*.05)} ${f1(-s*.14)}l${f1(s*.07)} ${f1(s*.12)}Z" fill="#f3d266" stroke="${S}" stroke-width="${f1(s*.025)}"/>`).join('')}`};
/* V119b: ORGANIC morphing — every trait of a spot is an outline resampled to the same number of
 * points, so a mix is a weighted average of the points (a straight edge slowly bends into a curve,
 * bat-wing fingers round off into butterfly lobes). Colour blends the same way. */
function resample(raw,N){const P=[...raw,raw[0]];const seg=[];let L=0;for(let i=0;i<P.length-1;i++){const d=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);seg.push(d);L+=d;}
 const out=[];let i=0,acc=0;for(let k=0;k<N;k++){const target=k*L/N;while(i<seg.length-1&&acc+seg[i]<target){acc+=seg[i];i++;}const t=seg[i]?(target-acc)/seg[i]:0;out.push([P[i][0]+(P[i+1][0]-P[i][0])*t,P[i][1]+(P[i+1][1]-P[i][1])*t]);}return out;}
const polar=(fn,n=48,cy=0)=>Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const r=fn(a);return [Math.cos(a)*r,cy+Math.sin(a)*r];});
const MORPH_RAW={
 back:{'bat-wings':[[0,0],[-.25,-.5],[-.65,-.72],[-1.05,-.55],[-.98,-.38],[-.9,-.18],[-.82,.02],[-.7,-.06],[-.6,.12],[-.45,.02],[-.32,.16],[-.18,.06],[0,.14]],
  'butterfly-wings':[[0,0],[-.15,-.55],[-.5,-.8],[-.85,-.65],[-.9,-.35],[-.7,-.1],[-.55,0],[-.75,.2],[-.7,.45],[-.45,.5],[-.2,.3],[0,.1]],
  'feather-wings':[[0,0],[-.3,-.45],[-.7,-.6],[-1,-.5],[-.92,-.35],[-.98,-.25],[-.85,-.12],[-.9,-.02],[-.72,.05],[-.75,.15],[-.55,.14],[-.5,.24],[-.3,.18],[0,.14]],
  'dragon-wings':[[0,0],[-.3,-.7],[-1.15,-.55],[-.9,-.28],[-1,0],[-.65,-.02],[-.62,.18],[-.3,.08],[0,.18]],
  'fire-wings':[[0,0],[-.3,-.6],[-.55,-.4],[-.75,-.75],[-.85,-.35],[-1.05,-.45],[-.9,-.1],[-.7,0],[-.45,.1],[0,.14]],
  fin:[[0,0],[-.15,-.35],[-.38,-.48],[-.32,-.12],[-.25,.05],[0,.1]]},
 tail:{'devil-tail':[[0,-.05],[-.3,-.02],[-.55,-.2],[-.72,-.4],[-.8,-.52],[-.95,-.62],[-.85,-.42],[-.98,-.3],[-.78,-.36],[-.66,-.28],[-.5,-.08],[-.28,.06],[0,.05]],
  'fox-tail':[[0,-.12],[-.3,-.25],[-.6,-.55],[-.8,-.75],[-.85,-.55],[-.8,-.3],[-.6,-.05],[-.3,.08],[0,.06]],
  'fish-tail':[[0,-.05],[-.3,-.1],[-.55,-.15],[-.85,-.45],[-.78,-.1],[-.9,.2],[-.55,0],[-.3,.07],[0,.06]],
  'dragon-tail':[[0,-.15],[-.3,-.12],[-.35,-.22],[-.45,-.15],[-.55,-.3],[-.65,-.22],[-.8,-.38],[-.95,-.35],[-.7,-.12],[-.4,.02],[0,.05]]},
 horn:{'devil-horns':[[-.15,0],[-.1,-.35],[.05,-.6],[.3,-.85],[.22,-.55],[.12,-.3],[.15,0]],'dragon-horns':[[-.15,0],[-.05,-.3],[.2,-.5],[.6,-.6],[.3,-.35],[.18,-.15],[.15,0]]},
 top:{leaf:[[0,0],[-.35,-.25],[-.4,-.6],[-.15,-.95],[0,-1.1],[.15,-.95],[.4,-.6],[.35,-.25]],flame:[[0,0],[-.38,-.2],[-.35,-.55],[-.15,-.7],[-.12,-.95],[.05,-1.1],[.1,-.85],[.3,-.65],[.38,-.25]],
  star:polar(a=>{const k=((a+Math.PI/2)/(2*Math.PI)*10)%2;return .2+.25*Math.abs(1-k);},40,-.55),crown:[[-.42,0],[-.42,-.5],[-.2,-.25],[0,-.6],[.2,-.25],[.42,-.5],[.42,0]],
  flower:polar(a=>.3+.14*Math.cos(5*a),40,-.55),flake:polar(a=>.16+.3*Math.abs(Math.cos(3*a))**4,48,-.55)},
 aura:{sparkle:polar(a=>.25+.75*Math.abs(Math.cos(2*a))**6,32),bubbles:polar(()=>.6,32),embers:polar(()=>.38,32),
  hearts:Array.from({length:32},(_,i)=>{const t=i/32*2*Math.PI;return [ .045*16*Math.sin(t)**3,-.045*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))];})}};
const MORPH_N={back:30,tail:26,horn:18,top:28,aura:24};
const MORPH_COLOR={'bat-wings':'#5b3a6e','butterfly-wings':'#f7a6c8','feather-wings':'#fbfaf4','dragon-wings':'#5e9e5a','fire-wings':'#ff9a3d',fin:'#6fb5d8','devil-tail':'#7a2230','fox-tail':'#e8834a','fish-tail':'#6fb5d8','dragon-tail':'#5e9e5a','devil-horns':'#c8303a','dragon-horns':'#efe3cf',leaf:'#7cc463',flame:'#ff9a3d',star:'#f3d266',crown:'#f1c26b',flower:'#f7a6c8',flake:'#bfe6fa',sparkle:'#ffe27a',bubbles:'#bfe3f7',embers:'#ff9a3d',hearts:'#ef7f9b'};
const MORPH=Object.fromEntries(Object.entries(MORPH_RAW).map(([g,v])=>[g,Object.fromEntries(Object.entries(v).map(([id,raw])=>[id,resample(raw,MORPH_N[g])]))]));
const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
/** Weighted blend of the outlines of one morph group in a spot's mix → {pts, color, grow, lux} or null. */
export function morphBlend(group,mix,lux={},slot=''){const V=MORPH[group];const e=Object.entries(mix||{}).filter(([id,w])=>w>0.04&&V[id]);if(!e.length)return null;
 const tot=e.reduce((n,[,w])=>n+w,0);const N=MORPH_N[group];const pts=Array.from({length:N},()=>[0,0]);let col=[0,0,0];
 for(const [id,w] of e){const f=w/tot;V[id].forEach(([x,y],i)=>{pts[i][0]+=x*f;pts[i][1]+=y*f;});col=col.map((v,i)=>v+hex(MORPH_COLOR[id])[i]*f);}
 return {pts,color:`rgb(${col.map(Math.round).join(',')})`,grow:0.35+0.65*Math.min(1,tot),lux:e.some(([id])=>lux[slot+':'+id])};}
/** Smooth closed path through points (quadratic curves via midpoints), scaled and placed. */
export function smoothPath(pts,s,ox=0,oy=0){const P=pts.map(([x,y])=>[ox+x*s,oy+y*s]);const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let d=`M${f1(m(P[P.length-1],P[0])[0])} ${f1(m(P[P.length-1],P[0])[1])}`;
 for(let i=0;i<P.length;i++){const n=P[(i+1)%P.length],q=m(P[i],n);d+=`Q${f1(P[i][0])} ${f1(P[i][1])} ${f1(q[0])} ${f1(q[1])}`;}return d+'Z';}

export function applyLookSvg(svg,look,key){
 if(!svg)return;svg.querySelectorAll('[data-acc="look"]').forEach(n=>n.remove());
 const L={...defaultLook(),...(look||{})};const lux=L.lux||{};const tinted=L.tint&&L.k>0.02;
 if(tinted){let defs=document.getElementById('lookDefs');if(!defs){defs=document.createElementNS('http://www.w3.org/2000/svg','svg');defs.id='lookDefs';defs.setAttribute('width','0');defs.setAttribute('height','0');defs.style.position='absolute';document.body.append(defs);}
  const id='look-'+String(key).replace(/[^a-z0-9]/gi,'_');let f=defs.querySelector('#'+id);if(!f){f=document.createElementNS('http://www.w3.org/2000/svg','filter');f.id=id;f.setAttribute('color-interpolation-filters','sRGB');f.innerHTML='<feColorMatrix type="matrix"/>';defs.append(f);}
  f.firstChild.setAttribute('values',tintMatrix(L.tint,L.k));svg.style.filter=`url(#${id})`;}else svg.style.filter='';
 svg.style.scale=Math.abs(L.size||0)>=0.01?String(1+L.size):'';svg.style.transformOrigin='50% 90%';svg.style.overflow='visible';
 const add=(parent,html,before=false,cls='')=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-acc','look');if(cls)g.setAttribute('class',cls);g.innerHTML=html;before?parent.insertBefore(g,parent.firstChild):parent.append(g);return g;};
 const bb=el=>{try{const b=el.getBBox();return b.width?b:null;}catch{return null;}};
 const head=svg.querySelector('[data-part="head"]')||svg.querySelector('[data-part="body"]');const body=svg.querySelector('[data-part="body"]')||head;
 // V119b: organic morph — outlines of all traits in a spot are blended point by point.
 const N=normLook(look);const hb=head?bb(head):null,bdb=body?bb(body):null;const SW=w=>f1(Math.max(1,w));
 const gl=x=>x?.lux?'look-lux':'';
 const back=morphBlend('back',N.mix.back,N.lux,'back');
 if(back&&bdb){const b=bdb,s=b.width*.5*(back.lux?1.4:1)*back.grow,y=b.y+b.height*.32;const d=smoothPath(back.pts,s),hi=smoothPath(back.pts.map(([x,yy])=>[x*.62,yy*.62-.04]),s);
  add(body,`<g><g transform="translate(${f1(b.x+b.width*.22)} ${f1(y)})"><g class="look-wing is-l"><path d="${d}" fill="${back.color}" stroke="${S}" stroke-width="${SW(s*.035)}"/><path d="${hi}" fill="#fff" opacity=".18"/></g></g><g transform="translate(${f1(b.x+b.width*.78)} ${f1(y)}) scale(-1 1)"><g class="look-wing is-r"><path d="${d}" fill="${back.color}" stroke="${S}" stroke-width="${SW(s*.035)}"/><path d="${hi}" fill="#fff" opacity=".18"/></g></g></g>`,true,gl(back));}
 const tail=morphBlend('tail',N.mix.tail,N.lux,'tail');
 if(tail&&bdb){const b=bdb,s=b.width*.55*(tail.lux?1.4:1)*tail.grow;add(body,`<g transform="translate(${f1(b.x+b.width*.12)} ${f1(b.y+b.height*.72)})"><g class="look-tail"><path d="${smoothPath(tail.pts,s)}" fill="${tail.color}" stroke="${S}" stroke-width="${SW(s*.035)}"/></g></g>`,true,gl(tail));}
 const horn=morphBlend('horn',N.mix.head,N.lux,'head'),top=morphBlend('top',N.mix.head,N.lux,'head');
 if(hb&&(horn||top)){const cx=hb.x+hb.width/2;let html='';
  if(horn){const s=hb.width*.42*(horn.lux?1.4:1)*horn.grow;const d=smoothPath(horn.pts,s);html+=[1,-1].map(dir=>`<g transform="translate(${f1(cx+dir*s*.22)} ${f1(hb.y+s*.1)}) scale(${dir} 1)"><path d="${d}" fill="${horn.color}" stroke="${S}" stroke-width="${SW(s*.06)}"/></g>`).join('');}
  if(top){const s=Math.max(8,hb.width*.32)*(top.lux?1.4:1)*top.grow;html+=`<path d="${smoothPath(top.pts,s,cx,hb.y+s*.12)}" fill="${top.color}" stroke="${S}" stroke-width="${SW(s*.07)}"/>`;}
  add(head,html,false,gl(horn)||gl(top));}
 // non-shape extras keep their own drawing, faded by their share: halo, antenna
 for(const id of ['halo','antenna']){const w=N.mix.head[id];if(!w||!hb)continue;const s=Math.max(8,hb.width*.32)*(N.lux['head:'+id]?1.4:1)*(0.35+0.65*Math.min(1,w));add(head,`<g transform="translate(${f1(hb.x+hb.width/2)} ${f1(hb.y+s*.12)})" opacity="${Math.min(1,.3+w).toFixed(2)}">${HEAD[id](s)}</g>`,false,N.lux['head:'+id]?'look-lux':'');}
 const aura=morphBlend('aura',N.mix.aura,N.lux,'aura'),notesW=N.mix.aura.notes||0;
 if((aura||notesW)){const b=bb(svg);if(b){const g=aura?aura.grow:0.35+0.65*Math.min(1,notesW);const n=aura?.lux?5:Math.max(1,Math.round(3*g));const pts=[[-.05,.2],[1.02,.35],[.15,.85],[.9,.9],[.5,-.05]].slice(0,n).map(([x,y])=>[b.x+b.width*x,b.y+b.height*y]);const s=Math.max(5,b.width*.09)*(aura?.lux?1.4:1)*g;
  add(svg,`<g class="look-aura">${pts.map(([x,y],i)=>`<g transform="translate(${f1(x)} ${f1(y)})"><g style="animation-delay:${i*.35}s">${aura?`<path d="${smoothPath(aura.pts,s)}" fill="${aura.color}" opacity=".9"/>`:''}${notesW>0.04?`<text font-size="${f1(s*1.8)}" fill="#9b7fc4" text-anchor="middle" opacity="${Math.min(1,.3+notesW).toFixed(2)}">♪</text>`:''}</g></g>`).join('')}</g>`,false,gl(aura));}}
}

export function createCompanionSystem(ctx){
 const {roster,sprites,$,escapeText,byId,uiName,staticArt,familyFor,isDiscovered,isShiny,elementIsUseful,getSlots,isLeftLocked,toast,showModal,closeModal,reducedMotion,FAMILIES}=ctx;
 const requestActivation=ctx.requestActivation||(async()=>true);
 // V92: houses speed up growth (multipliers on future gains only — never on stats themselves).
 const growth=(id,kind)=>{try{return Math.max(1,Number(ctx.growthFor?.(id,kind))||1);}catch{return 1;}};const onBadge=ctx.onBadge||(()=>{});
 const metaById=new Map(roster.map(c=>[c.id,c]));
 const sfx=new Proxy(ctx.sfx||{},{get:(t,k)=>t[k]||(()=>{})});
 let state={active:null,pets:{},v:1};
 const starter=ctx.starterCompanion||null;
 const normalize=raw=>({active:raw.active||null,pets:raw.pets,v:1,firstFreeUsed:Boolean(raw.firstFreeUsed||(raw.active&&raw.active!==starter)),seen:Array.isArray(raw.seen)?raw.seen.filter(x=>typeof x==='string'):null});
 let loaded=false;try{const raw=JSON.parse(localStorage.getItem(COMPANION_STORAGE_KEY)||'null');if(raw&&typeof raw==='object'&&raw.pets){state=normalize(raw);loaded=true;}}catch{}
 // V105: new games start with the starter companion (Frog) on screen; the free choice is kept.
 if(!loaded&&starter&&metaById.has(starter)){state={active:starter,pets:{},v:1,firstFreeUsed:false,seen:[starter]};}
 const save=()=>{try{localStorage.setItem(COMPANION_STORAGE_KEY,JSON.stringify(state));}catch{}};
 const pet=id=>{if(!state.pets[id])state.pets[id]={mood:60,moodAt:Date.now(),fed:{},gifts:0,meals:0,since:Date.now()};const p=state.pets[id];if(typeof p.belly!=='number'){p.belly=80;p.bellyAt=Date.now();}if(!p.stats)p.stats=freshStats(metaById.get(id)||{family:'nature',move:'walk',name:''},isShiny(id));return p;};
 const totalLevel=id=>COMPANION_STATS.reduce((n,k)=>n+(pet(id).stats[k]?.level||0),0);
 /** Add progress to one stat; returns {levelUps, pointsGained}. 100 bar points = one level. */
 function gainStat(p,meta,stat,amount){const st=p.stats[stat];const g=companionGrades(meta,isShiny(meta.id))[stat];let ups=0,pts=0;if(st.level>=COMPANION_MAX_LEVEL)return {levelUps:0,pointsGained:0};st.bar+=amount;while(st.bar>=100&&st.level<COMPANION_MAX_LEVEL){st.bar-=100;st.level++;const d=levelUpGain(g);st.points=Math.min(STAT_MAX_POINTS,st.points+d);pts+=d;ups++;}if(st.level>=COMPANION_MAX_LEVEL)st.bar=0;return {levelUps:ups,pointsGained:pts};}
 const now=()=>Date.now();
 function settleBelly(p){const el=now()-(p.bellyAt||now());if(el>=BELLY_DECAY_MS){p.belly=Math.max(0,p.belly-Math.floor(el/BELLY_DECAY_MS));p.bellyAt=now()-el%BELLY_DECAY_MS;}}
 const hungry=p=>p.belly<25;
 function settleMood(p){settleBelly(p);const elapsed=now()-(p.moodAt||now());if(elapsed>60000){p.mood=Math.max(0,p.mood-Math.floor(elapsed/600000)*(hungry(p)?2:1));p.moodAt=now();}}
 const nameOf=meta=>{const p=state.pets[meta.id];return (p&&p.nick)||uiName(byId.get(meta.id))||meta.name;};
 const unlocked=()=>roster.filter(c=>isDiscovered(c.id));
 const activeMeta=()=>state.active&&isDiscovered(state.active)?metaById.get(state.active):null;

 // ---------- DOM ----------
 // Everything the companion "says" is shown by its own body: no text bubbles anywhere.
 let layerFront=null,layerBack=null,sprite=null,timer=null,giftTimer=null,blinkTimer=null,lastPoint=0,destroyed=false;
 let pos={x:40,y:200,face:1},rail=null,sleeping=false,busy=false,lastInput=now(),cancelMove=null,rollAngle=0,stroke={},petting=false,emoteTimer=null;
 const SIZE=58;
 function ensureLayer(){
  if(layerFront)return;
  layerBack=document.createElement('div');layerBack.className='companion-layer is-back';layerBack.id='companionLayerBack';
  layerFront=document.createElement('div');layerFront.className='companion-layer is-front';layerFront.id='companionLayer';
  document.body.append(layerBack,layerFront);
  sprite=document.createElement('button');sprite.type='button';sprite.className='companion';sprite.id='companionSprite';sprite.setAttribute('aria-label','Your companion');
  sprite.innerHTML='<span class="companion-shadow" aria-hidden="true"></span><span class="companion-art" aria-hidden="true"></span><span class="companion-fx" aria-hidden="true"></span><span class="companion-emote" aria-hidden="true" hidden></span>';
  sprite.addEventListener('click',e=>{e.stopPropagation();if(stroke.done){stroke.done=false;return;}sfx.boop();openCard(state.active);});
  // Stroking: rub a finger across the companion (like petting a Chao) → hearts, happy wiggle, mood.
  sprite.addEventListener('pointerdown',e=>{stroke={x:e.clientX,y:e.clientY,dist:0,on:false,done:false,id:e.pointerId,last:0};});
  sprite.addEventListener('pointermove',e=>{if(stroke.id!==e.pointerId||stroke.x==null)return;stroke.dist+=Math.hypot(e.clientX-stroke.x,e.clientY-stroke.y);stroke.x=e.clientX;stroke.y=e.clientY;if(!stroke.on&&stroke.dist>26){stroke.on=true;startPetting();}if(stroke.on&&now()-stroke.last>420){stroke.last=now();sfx.purr();petTick();}});
  const endStroke=()=>{if(stroke.on){stroke.done=true;stopPetting();}stroke.x=null;stroke.id=null;};
  sprite.addEventListener('pointerup',endStroke);sprite.addEventListener('pointercancel',endStroke);sprite.addEventListener('pointerleave',endStroke);
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{lastInput=now();if(sleeping)wake();},{passive:true}));
  window.addEventListener('resize',()=>{if(activeMeta()){const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}}});
 }
 function setArt(meta){
  const svg=sprites[meta.id]||'';
  const art=sprite.querySelector('.companion-art');art.innerHTML=svg;
  for(const g of art.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}
  sprite.dataset.move=meta.move;sprite.dataset.quirk=meta.quirkAnim||'wiggle';sprite.dataset.companion=meta.id;sprite.classList.toggle('is-shiny',isShiny(meta.id));
  const svgEl=art.querySelector('svg');if(svgEl){svgEl.setAttribute('width','100%');svgEl.setAttribute('height','100%');}
  try{ctx.wear?.(sprite.parentElement||sprite);}catch{}
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
   if(petting){res(false);return;}
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
 // Emotion orb (the floating ball of a Chao): drawn shapes only, never text.
 const EMOTE_SVG={
  heart:'<svg viewBox="0 0 40 40"><path d="M20 33C8 25 4 19 4 13a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 6-4 12-16 20Z" fill="#e0675a" stroke="#657d89" stroke-width="2.5"/></svg>',
  spiral:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#e9eef1" stroke="#657d89" stroke-width="2.5"/><path d="M20 20c0-3 4-3 4 0 0 5-8 5-8 0 0-7 12-7 12 0 0 9-16 9-16 0" fill="none" stroke="#657d89" stroke-width="2.4" stroke-linecap="round"/></svg>',
  bowl:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#fff8ee" stroke="#657d89" stroke-width="2.5"/><path d="M10 20h20a10 8 0 0 1-20 0Z" fill="#d08a4c" stroke="#657d89" stroke-width="2"/><path d="M15 14q2-3 0-5M21 15q2-3 0-5M27 14q2-3 0-5" fill="none" stroke="#9aa9b1" stroke-width="1.8" stroke-linecap="round"/></svg>',
  burst:'<svg viewBox="0 0 40 40"><path d="M20 3l4 10 10-4-5 10 8 6-11 1 1 11-7-8-7 8 1-11-11-1 8-6-5-10 10 4Z" fill="#f3c46b" stroke="#d08a4c" stroke-width="2" stroke-linejoin="round"/></svg>',
  orb:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="10" fill="#cfe3ea" stroke="#657d89" stroke-width="2.5"/><circle cx="16.5" cy="16.5" r="3" fill="#fff"/></svg>'
 };
 function emote(kind,ms=1800){if(!sprite||reducedMotion())return;const e=sprite.querySelector('.companion-emote');if(!e)return;clearTimeout(emoteTimer);e.innerHTML=EMOTE_SVG[kind]||EMOTE_SVG.orb;e.dataset.emote=kind;e.hidden=false;e.classList.remove('is-pop');void e.offsetWidth;e.classList.add('is-pop');emoteTimer=setTimeout(()=>{e.classList.remove('is-pop');e.classList.add('is-fade');setTimeout(()=>{e.hidden=true;e.classList.remove('is-fade');},300);},ms);}
 function startPetting(){const meta=activeMeta();if(!meta)return;petting=true;if(sleeping)wake();if(cancelMove)cancelMove();sprite.classList.remove('is-happy');sprite.classList.add('is-petted');emote('heart',99999);}
 function petTick(){const meta=activeMeta();if(!meta||!petting)return;fx('hearts',1300);const p=pet(meta.id);settleMood(p);
  const win=Math.floor(now()/600000);if(p.petWin!==win){p.petWin=win;p.petGain=0;}if(p.petGain<PET_MOOD_CAP){p.petGain++;p.mood=Math.min(100,p.mood+1);p.moodAt=now();p.strokes=(p.strokes||0)+1;save();}}
 function stopPetting(){if(!petting)return;petting=false;sfx.happy();sprite.classList.remove('is-petted');sprite.classList.add('is-happy');emote('heart',1200);setTimeout(()=>{sprite.classList.remove('is-happy');refreshViews();},950);}

 // ---------- behaviours ----------
 async function loop(){
  if(destroyed)return;const meta=activeMeta();if(!meta){stop();return;}
  if(busy||sleeping||petting||document.hidden){timer=setTimeout(loop,900);return;}
  const rs=rails();
  if(!rail||!rs.some(r=>r.kind===rail.kind&&r.i===rail.i)){const r=pickRail();if(!r){timer=setTimeout(loop,1200);return;}rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}
  else{rail=rs.find(r=>r.kind===rail.kind&&r.i===rail.i)||rail;}
  if(now()-lastInput>150000){await sleep();timer=setTimeout(loop,500);return;}
  {const p=pet(meta.id);settleMood(p);if(hungry(p)&&Math.random()<0.18){emote('bowl',1800);}else if(p.mood<=MOOD.sad&&Math.random()<0.12)emote('spiral',1800);}
  const slot=lockedUseless();
  if(slot&&now()-lastPoint>60000){lastPoint=now();await pointAtSlot(slot);timer=setTimeout(loop,800);return;}
  const roll=Math.random();
  {const pws=powersOf(pet(meta.id).look);if(pws.length&&rail.kind!=='side'&&Math.random()<0.1){await usePower(pws[Math.floor(Math.random()*pws.length)]);timer=setTimeout(loop,700);return;}}
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
 async function hopInPlace(){sprite.dataset.anim='crouch';await wait(120);const y=pos.y;sfx.hop();await travel({x:pos.x,y,arc:18,ms:420,anim:'jump'});sprite.dataset.anim='land';await wait(140);sprite.dataset.anim='idle';}
 async function startClimb(){const side=rails().find(r=>r.kind==='side'&&r.i===rail.i)||rails().find(r=>r.kind==='side');if(!side)return;await walkTo(clampX(rail,side.x),rail.y);
  if(Math.abs(pos.y-side.y1)>8){await jumpTo(side);}else{rail=side;}await climb();}
 async function climb(){const r=rail;if(r.kind!=='side')return;sprite.classList.add('is-climbing');const goUp=pos.y>r.y1+20;const ty=goUp?r.y1:r.y2;
  await travel({x:r.x,y:ty,anim:'climb',px:speed()*0.55});sprite.classList.remove('is-climbing');
  const top=rails().find(x=>x.kind==='top'&&x.i===r.i);
  if(goUp&&top){await travel({x:clampX(top,r.x-SIZE*0.6),y:top.y,arc:22,ms:380,anim:'jump'});sprite.dataset.anim='land';await wait(150);sprite.dataset.anim='idle';rail=top;}
  else await jumpTo(pickRail());}
 async function knock(){if(!rail||rail.kind!=='top')return;const left=Math.random()<0.5;await walkTo(left?rail.x1:rail.x2,rail.y);pos.face=left?-1:1;sprite.dataset.face=left?'left':'right';
  sprite.dataset.anim='knock';for(let i=0;i<3;i++){await wait(260);sfx.knock();fx('ripple',900);document.body.classList.add('companion-knock');setTimeout(()=>document.body.classList.remove('companion-knock'),180);}await wait(500);sprite.dataset.anim='idle';}
 async function goBehind(){const back=rails().find(r=>r.kind==='behind'&&r.i===rail.i)||pickRail('behind');if(!back)return;await jumpTo(back,pos.x);await stroll();await wait(300+Math.random()*600);const top=rails().find(r=>r.kind==='top'&&r.i===back.i);if(top)await jumpTo(top,pos.x);}
 async function pointAtSlot(slotRect){const top=rails().find(x=>x.kind==='top'&&x.ref.top<=slotRect.top&&x.ref.bottom>=slotRect.bottom);if(top&&top!==rail)await jumpTo(top);
  await walkTo(clampX(rail,slotRect.left+slotRect.width/2-SIZE/2),rail.y);pos.face=1;sprite.dataset.face='right';
  sprite.dataset.anim='point';await wait(900);sprite.dataset.anim='shake';await wait(1000);sprite.dataset.anim='idle';}
 async function usePower(pw){if(reducedMotion())return;busy=true;
  try{sprite.dataset.anim='point';await wait(250);sfx[pw.sfx]?.();const f=sprite.querySelector('.companion-fx');if(!f)return;const el=document.createElement('i');el.className='fx-power is-'+pw.id;
   const n=pw.id==='holy'?8:12;el.innerHTML=Array.from({length:n},(_,i)=>{const r=Math.random();const v=POWER_FX[pw.id](i,n,r);return `<b style="--i:${i};--dx:${v[0]}px;--dy:${v[1]}px;--s:${v[2]}"></b>`;}).join('');f.append(el);
   await wait(1500);el.remove();}
  finally{sprite.dataset.anim='idle';busy=false;}}
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
  g.onclick=()=>{g.classList.add('is-taken');setTimeout(()=>g.remove(),420);const p=pet(meta.id);p.gifts++;p.mood=Math.min(100,p.mood+6);const amt=Math.round(10*growth(meta.id,'stamina'));const r=gainStat(p,meta,'stamina',amt);save();fx('hearts',1300);showStatWindow(meta,[{stat:'stamina',amount:amt,...r}],1800);refreshViews();};
  layerFront.append(g);if(!fromQuirk){sprite.dataset.anim='idle';busy=false;}scheduleGift();}

 // ---------- feeding: the companion grabs the element, chews for a few seconds, and a floating
 // stat window shows the bars filling (level-ups flash), like feeding a Chao.
 function likes(meta,item){const fam=familyFor(item);if(fam===meta.family)return 'love';if(meta.family==='games'&&['life','nature','food'].includes(item.category))return 'no';if(['nature','prehistoric'].includes(meta.family)&&['technology','brand','console','portable','computer'].includes(item.category))return 'no';if(meta.family==='anime'&&['material','science'].includes(item.category))return 'no';return 'ok';}
 // V115: harder-to-make elements feed more (recipe depth from the four starters): starters ×0.6 … depth 10+ ×1.8.
 function feedPlan(meta,item){const fam=familyFor(item);const [main,second]=FAMILY_FEEDS[fam]||['stamina','hp'];const own=fam===meta.family;const mult=(isShiny(item.id)?2:1)*feedDepthMult(ctx.depthOf?.(item.id));return own?[{stat:main,amount:40*mult},{stat:second,amount:16*mult}]:[{stat:main,amount:24*mult},{stat:second,amount:10*mult}];}
 let statWin=null,statWinTimer=null,statHideTimer=0;
 function statRow(stat,st,g){return `<div class="cs-row" data-stat="${stat}"><span class="cs-name">${STAT_LABEL[stat]}</span><span class="cs-lv">Lv.<b>${String(st.level).padStart(2,'0')}</b></span><span class="cs-bar"><i class="cs-bar-prog" style="width:${st.bar}%"></i></span><span class="cs-grade" data-grade="${GRADES[g]}">${GRADES[g]}</span></div>`;}
 /** Animated floating window: rows for the touched stats, bars filling from the previous value. */
 // V111: feeding always explains itself, even when nothing grows (recently eaten, refused, maxed).
 function showNoteWindow(meta,lines,hold=2600){
  if(!layerFront)return;if(!statWin){statWin=document.createElement('div');statWin.className='companion-statwin';layerFront.append(statWin);}
  clearTimeout(statWinTimer);clearTimeout(statHideTimer);
  statWin.innerHTML=`<div class="cs-head"><span class="cs-face">${sprites[meta.id]||''}</span><strong>${escapeText(nameOf(meta))}</strong></div>`+lines.map(l=>`<div class="cs-note">${l}</div>`).join('');
  statWin.hidden=false;const h=statWin.offsetHeight||90;const left=Math.max(6,Math.min(window.innerWidth-226,pos.x+(pos.face>0?SIZE+8:-228))),top=Math.max(6,Math.min(window.innerHeight-h-70,pos.y-20));
  statWin.style.setProperty('--x',left+'px');statWin.style.setProperty('--y',top+'px');statWin.classList.remove('is-out');void statWin.offsetWidth;statWin.classList.add('is-in');
  statWinTimer=setTimeout(()=>{statWin.classList.remove('is-in');statWin.classList.add('is-out');clearTimeout(statHideTimer);statHideTimer=setTimeout(()=>{if(statWin)statWin.hidden=true;},400);},hold);}
 function showStatWindow(meta,changes,hold=2600){
  if(!layerFront)return;const p=pet(meta.id),grades=companionGrades(meta,isShiny(meta.id));
  if(!statWin){statWin=document.createElement('div');statWin.className='companion-statwin';layerFront.append(statWin);}
  clearTimeout(statWinTimer);clearTimeout(statHideTimer);
  const rows=changes.filter((c,i,arr)=>arr.findIndex(x=>x.stat===c.stat)===i);
  statWin.innerHTML=`<div class="cs-head"><span class="cs-face">${sprites[meta.id]||''}</span><strong>${escapeText(nameOf(meta))}</strong></div>`+rows.map(c=>{const st=p.stats[c.stat];
   // show the state BEFORE the gain, then animate to the new values
   const beforeLevel=st.level-c.levelUps;let beforeBar=st.bar-c.amount;while(beforeBar<0)beforeBar+=100;if(c.levelUps&&st.level>=COMPANION_MAX_LEVEL)beforeBar=Math.max(0,100-c.amount%100);
   return statRow(c.stat,{level:beforeLevel,bar:Math.max(0,Math.min(99,beforeBar))},grades[c.stat]);}).join('');
  statWin.hidden=false;const h=statWin.offsetHeight||140;const left=Math.max(6,Math.min(window.innerWidth-226,pos.x+(pos.face>0?SIZE+8:-228))),top=Math.max(6,Math.min(window.innerHeight-h-70,pos.y-20));
  statWin.style.setProperty('--x',left+'px');statWin.style.setProperty('--y',top+'px');statWin.classList.remove('is-out');void statWin.offsetWidth;statWin.classList.add('is-in');
  // animate each row: bar fills (wrapping on level-up), points count up, level flips with a flash
  rows.forEach((c,i)=>{const row=statWin.querySelector(`[data-stat="${c.stat}"]`);const st=p.stats[c.stat];const prog=row.querySelector('.cs-bar-prog'),lv=row.querySelector('.cs-lv b');
   const startBar=parseFloat(prog.style.width)||0,startLv=st.level-c.levelUps;
   const total=startBar+c.amount,dur=900+Math.min(1400,c.amount*12);const t0=performance.now()+250+i*180;
   const stepFn=now=>{const k=Math.max(0,Math.min(1,(now-t0)/dur));const e=1-Math.pow(1-k,3);const v=startBar+(total-startBar)*e;const ups=Math.min(c.levelUps,Math.floor(v/100));
    prog.style.width=(st.level>=COMPANION_MAX_LEVEL&&k===1?0:v%100).toFixed(1)+'%';
    const curLv=startLv+ups;if(Number(lv.textContent)!==curLv){lv.textContent=String(curLv).padStart(2,'0');row.classList.remove('is-levelup');void row.offsetWidth;row.classList.add('is-levelup');}
    if(k<1)requestAnimationFrame(stepFn);};
   requestAnimationFrame(stepFn);});
  statWinTimer=setTimeout(()=>{statWin.classList.remove('is-in');statWin.classList.add('is-out');clearTimeout(statHideTimer);statHideTimer=setTimeout(()=>{if(statWin)statWin.hidden=true;},400);},hold+rows.length*300+1800);
 }
 function morsel(item,cls=''){const m=fx('morsel '+cls,900);m.innerHTML=staticArt(item);return m;}
 async function eatSequence(meta,item,{self=false}={}){
  const p=pet(meta.id);settleMood(p);
  const taste=likes(meta,item);
  if(taste==='no'){sfx.refuse();showNoteWindow(meta,[`Doesn't like <b>${escapeText(uiName(item))}</b> · no growth`,`Mood −3`]);morsel(item,'is-refused');emote('spiral',1400);sprite.dataset.anim='refuse';p.mood=Math.max(0,p.mood-3);p.moodAt=now();save();await wait(1400);sprite.dataset.anim='idle';refreshViews();return true;}
  const last=p.fed[item.id]||0,fresh=now()-last>FEED_COOLDOWN_MS;
  // grab: the element flies into the hands and stays there while chewing
  const held=fx('held',3600);held.innerHTML=staticArt(item);sprite.dataset.anim='grab';sfx.grab();await wait(450);
  sprite.dataset.anim='hold-eat';
  const plan=fresh?feedPlan(meta,item).map(c=>({...c,amount:Math.round(c.amount*growth(meta.id,c.stat))})):[];
  const changes=plan.map(c=>({...c,...gainStat(p,meta,c.stat,c.amount)}));
  p.mood=Math.min(100,p.mood+(taste==='love'?12:5));p.moodAt=now();p.belly=Math.min(100,p.belly+Math.round((fresh?25:10)*growth(meta.id,'food')));p.bellyAt=now();if(fresh)p.fed[item.id]=now();p.meals++;save();
  // V116: what it eats changes how it looks (refused food never does)
  // V120: only meals the player gives change looks — eating on its own just grows stats
  if(!self){state.tasted=state.tasted||{};state.tasted[item.id]=1;}
  const lookBefore=p.look;
  const lk=self?{look:p.look,notes:[]}:lookAfterMeal(p.look,item.name||uiName(item),familyFor(item),item.category,ctx.depthOf?.(item.id));p.look=lk.look;save();if(lk.notes.length)try{ctx.wear?.(sprite.parentElement||sprite);}catch{}
  if(changes.length)showStatWindow(meta,changes,2800);
  else{const left=Math.max(1,Math.ceil((FEED_COOLDOWN_MS-(now()-last))/60000));showNoteWindow(meta,fresh?[`<b>${escapeText(uiName(item))}</b> · stats already at max`,`Belly +${Math.round(25*growth(meta.id,'food'))} · Mood +${taste==='love'?12:5}`]:[`Already ate <b>${escapeText(uiName(item))}</b> recently`,`No growth for ${left} min — try another element`,`Belly +${Math.round(10*growth(meta.id,'food'))} · Mood +${taste==='love'?12:5}`],3200);}
  if(!self&&statWin&&!statWin.hidden){const rows=lookDiff(lookBefore,lk.look,lk.tint);const resets=lk.notes.filter(n=>/natural|washed|itself/i.test(n));
   statWin.insertAdjacentHTML('beforeend',`<div class="cs-looks"><div class="cs-looks-h">Looks</div>${rows.length?rows.map(r=>`<div class="cs-look"><span>${r.label}</span><b>${r.rgb?`<i style="background:rgb(${r.rgb.join(',')})"></i>`:''}${escapeText(r.text)}</b></div>`).join(''):'<div class="cs-look is-none"><b>No change</b></div>'}${resets.map(n=>`<div class="cs-look"><span>↺</span><b>${escapeText(n)}</b></div>`).join('')}</div>`);
   const h=statWin.offsetHeight;const y=parseFloat(statWin.style.getPropertyValue('--y'))||0;statWin.style.setProperty('--y',Math.max(6,Math.min(window.innerHeight-h-70,y))+'px');clearTimeout(statWinTimer);statWinTimer=setTimeout(()=>{statWin.classList.remove('is-in');statWin.classList.add('is-out');clearTimeout(statHideTimer);statHideTimer=setTimeout(()=>{if(statWin)statWin.hidden=true;},400);},4200);}
  for(let i=0;i<4;i++){await wait(650);held.classList.add('bite-'+(i+1));sfx.nom();}
  await wait(500);held.remove();
  if(taste==='love'){sfx.happy();fx('hearts',1300);emote('heart',1400);}
  const ups=changes.reduce((n,c)=>n+c.levelUps,0);
  if(ups){sfx.levelup();sprite.dataset.anim='levelup';fx('stars',2000);emote('burst',1700);await wait(1800);}
  sprite.dataset.anim='idle';refreshViews();return true;
 }
 async function feed(elementId){
  const meta=activeMeta(),item=byId.get(elementId);if(!meta||!item)return false;
  if(cancelMove)cancelMove();busy=true;
  try{return await eatSequence(meta,item);}finally{busy=false;}
 }
 // The companion goes to the element list by itself and helps itself to a chip.
 let selfFeedTimer=null;
 function scheduleSelfFeed(){clearTimeout(selfFeedTimer);const m=activeMeta();const [a,b]=m&&hungry(pet(m.id))?HUNGRY_SELF_FEED_MS:SELF_FEED_INTERVAL_MS;selfFeedTimer=setTimeout(selfFeed,a+Math.random()*(b-a));}
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
 function setActive(id){if(id&&!isDiscovered(id))return false;state.active=id||null;if(id)state.firstFreeUsed=true;save();if(state.active){pet(state.active);start();}else stop();refreshViews();return true;}
 /** Player choice: the very first companion is free; every later switch goes through the app (rewarded ad + 5-min grace). Sending home is free. */
 let choosing=false;
 async function choose(id){
  if(choosing)return false;
  if(!id||id===state.active)return setActive(null);
  if(!isDiscovered(id))return false;
  if(!state.firstFreeUsed)return setActive(id);
  choosing=true;let ok=false;try{ok=await requestActivation(metaById.get(id),{from:state.active});}catch(e){console.warn('companion activation',e);}finally{choosing=false;}
  return ok?setActive(id):false;
 }
 // "Seen" companions: anything discovered but not yet seen in the Companions tab lights the tab badge.
 function syncSeen(){if(!Array.isArray(state.seen)){state.seen=unlocked().map(c=>c.id);save();}const fresh=unlocked().filter(c=>!state.seen.includes(c.id)).length;onBadge(fresh);return fresh;}
 function markSeen(){if(!Array.isArray(state.seen))state.seen=[];let changed=false;for(const c of unlocked())if(!state.seen.includes(c.id)){state.seen.push(c.id);changed=true;}if(changed)save();onBadge(0);}
 const isCompanion=id=>metaById.has(id);
 const freeChoiceLeft=()=>!state.firstFreeUsed;
 function onDiscovery(id){if(metaById.has(id)&&!state.pets[id]){pet(id);save();syncSeen();}if(state.active&&sprite&&!sprite.hidden){const p=pet(state.active),m=activeMeta();if(m){gainStat(p,m,'hp',Math.round(4*growth(m.id,'hp')));save();}}}

 // ---------- views ----------
 const listeners=new Set();function refreshViews(){for(const fn of listeners)try{fn();}catch(e){console.warn(e);}}
 function statsHtml(id){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return '';const p=pet(id);settleMood(p);return `<span class="pet-needs"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b></span></span>`+statPanel(meta,p);}
 function statPanel(meta,p){const g=companionGrades(meta,isShiny(meta.id));return `<div class="cs-panel">${COMPANION_STATS.map(k=>statRow(k,p.stats[k],g[k])).join('')}</div>`;}
 function cardHtml(meta,{full=false}={}){
  const have=isDiscovered(meta.id),p=have?pet(meta.id):null,sh=isShiny(meta.id);if(p)settleMood(p);
  const el=byId.get(meta.id),name=uiName(el)||meta.name;
  const tl=have?totalLevel(meta.id):0;
  return `<article class="pet-card ${have?'is-unlocked':'is-locked'} ${state.active===meta.id?'is-active':''} ${sh?'is-shiny':''}" data-pet="${meta.id}">
   <div class="pet-preview" aria-hidden="true">${have?(sprites[meta.id]||staticArt(el)):'<span class="pet-silhouette">'+staticArt(el)+'</span>'}</div>
   <div class="pet-main">
    <strong>${have?(sh?'✦ ':'')+escapeText(p.nick||name):'???'}</strong>
    <small>${have?`${p.nick?escapeText(name)+' · ':''}Total Lv ${tl} · ${moodLabel(p.mood)}${hungry(p)?' · Hungry':''}`:'Discover '+escapeText(name)+' to unlock'}</small>${have&&full&&lookLabel(p.look)?`<small class="pet-look">✨ ${escapeText(lookLabel(p.look))}</small>`:''}
    ${have&&full?`<span class="pet-needs"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b></span></span>`:''}
    ${have&&!full?`<span class="pet-mini">${COMPANION_STATS.map(k=>`<i title="${STAT_LABEL[k]} ${p.stats[k].points}"><b style="height:${Math.max(6,100*p.stats[k].points/STAT_MAX_POINTS)}%"></b></i>`).join('')}</span>`:''}
    ${have&&full?statPanel(meta,p)+`<p class="pet-quirk">${escapeText(meta.quirk)}. Gift: ${escapeText(meta.gift)}.</p><button type="button" class="pet-rename" data-rename="${meta.id}">Rename</button>`:''}
   </div>
   ${have?`<button type="button" class="pet-activate" data-activate="${meta.id}" aria-pressed="${state.active===meta.id}">${state.active===meta.id?'Active':(state.firstFreeUsed?'Choose · ad':'Choose · free')}</button>`:''}
  </article>`;
 }
 function renderTab(){
  const root=$('viewPets');if(!root)return;
  const act=activeMeta();const have=unlocked().length;
  const groups=FAMILIES.map(f=>({f,list:roster.filter(c=>c.family===f.id)})).filter(g=>g.list.length);
  const ava=c=>{const own=isDiscovered(c.id),p=own?pet(c.id):null,el=byId.get(c.id),house=own&&ctx.residentOf?ctx.residentOf(c.id):null;
   return `<button type="button" class="pet-ava ${own?'is-unlocked':'is-locked'} ${state.active===c.id?'is-active':''} ${own&&isShiny(c.id)?'is-shiny':''}" data-card="${c.id}" aria-label="${own?escapeText(p.nick||uiName(el)):'Undiscovered companion'}"><span class="pet-ava-art">${own?(sprites[c.id]||staticArt(el)):'<span class="pet-silhouette">'+staticArt(el)+'</span>'}</span><small>${own?escapeText(p.nick||uiName(el)):'???'}</small>${own?`<em class="pet-ava-lv">Lv ${totalLevel(c.id)}</em>`:''}${state.active===c.id?'<i class="pet-ava-tag is-screen" title="On screen"></i>':house?'<i class="pet-ava-tag is-home" title="Lives in a house"></i>':''}</button>`;};
  let now='';
  if(act){const p=pet(act.id);settleMood(p);now=`<section class="pets-now"><button type="button" class="pets-now-art" data-card="${act.id}" aria-label="Stats">${sprites[act.id]||''}</button><div class="pets-now-main"><strong>${escapeText(nameOf(act))}</strong><small>On screen · Total Lv ${totalLevel(act.id)} · ${moodLabel(p.mood)}${hungry(p)?' · Hungry':''}</small><span class="pet-needs"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b></span></span></div><div class="pets-now-actions"><button type="button" class="pets-btn" data-card="${act.id}">Stats</button><button type="button" class="pets-btn is-quiet" id="petDismiss">Send home</button></div></section>`;}
  else now=`<section class="pets-now is-empty"><small>${have?'No companion on screen. Tap a companion below to choose one.':`Discover one of the ${roster.length} companion elements (five per family) to get your first companion.`}</small></section>`;
  root.innerHTML=`<div class="pets-scroll"><div class="section-head home-title"><h2>Home</h2></div>
   <div id="homeMount"></div>
   <h3 class="pets-family">On screen</h3>${now}
   <h3 class="pets-family">Companions <span>${have}/${roster.length}</span></h3>
   <div class="pets-avatars">${groups.map(g=>`<div class="pets-ava-row"><span class="pets-ava-family">${escapeText(g.f.name)}</span><div class="pets-ava-list">${g.list.map(ava).join('')}</div></div>`).join('')}</div>
   <details class="pets-help"><summary>How companions and houses work</summary><ul>
    <li><strong>Companions:</strong> discover a companion element, tap it here and choose it. Your first one is free; switching later needs a rewarded ad (then 5 free minutes). It lives on your screen: drag elements onto it to feed it, rub it to pet it, tap its gifts.</li>
    <li><strong>Stats:</strong> HP, Stamina, Run, Power, Swim, Fly, each Lv.0–${COMPANION_MAX_LEVEL} with a grade E–S. The element's family decides which stats a meal grows.</li>
    <li><strong>Houses:</strong> discover house elements (Tent 1 → Castle 8 companions; better houses need longer recipes). Tap a house for its bonuses. Companions living in a house grow faster from everything they do — bonuses only speed up growth, so moving a companion never takes anything away.</li>
    <li><strong>Furniture:</strong> tap the floor or the wall to place pieces, press and hold to drag them, tap one to rotate or put it away. Training pieces speed up their stat, food pieces make meals fill more, fun pieces lift mood faster, books and globes bring more finds while you are away.</li>
    <li><strong>While you are away:</strong> residents find elements you could already craft. One or two are free; one ad keeps them all.</li>
   </ul></details></div>`;
  root.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>openCard(b.dataset.card));
  const d=$('petDismiss');if(d)d.onclick=()=>setActive(null);
  try{ctx.renderExtra?.(root);}catch(e){console.warn('home',e);}
  try{ctx.wear?.(root);}catch{}
  if(!root.hidden)markSeen();
 }
 function rename(id){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return;const p=pet(id);
  showModal(`<div class="modal-tag">RENAME COMPANION</div><h2>${escapeText(uiName(byId.get(id))||meta.name)}</h2><input class="pet-name-input" id="petNameInput" maxlength="${NICK_MAX}" value="${escapeText(p.nick||'')}" placeholder="${escapeText(uiName(byId.get(id))||meta.name)}" autocomplete="off"/><p class="mini-muted">Up to ${NICK_MAX} characters. Leave empty to use the original name.</p><button type="button" class="modal-button" id="petNameSave">Save name</button><button type="button" class="modal-button secondary" id="petNameCancel">Cancel</button>`);
  const inp=$('petNameInput');setTimeout(()=>inp?.focus(),50);
  $('petNameSave').onclick=()=>{const v=String(inp.value||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,NICK_MAX);if(v)p.nick=v;else delete p.nick;save();closeModal();refreshViews();};
  $('petNameCancel').onclick=closeModal;}
 function openCard(id){const meta=metaById.get(id);if(!meta)return;if(!isDiscovered(id)){showModal(`<div class="modal-tag">COMPANION</div>${cardHtml(meta,{full:true})}<button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);$('petCardClose').onclick=closeModal;return;}const hl=ctx.houseLine?.(id)||'';showModal(`<div class="modal-tag">COMPANION</div>${cardHtml(meta,{full:true})}${hl?`<p class="pet-house-line">${hl}</p>`:''}<p class="mini-muted">Drag an element from your list onto ${escapeText(nameOf(meta))} to feed it. Rub it with your finger to pet it. Tap its gifts when they appear.</p><button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);$('petCardClose').onclick=closeModal;$('modalContent').querySelectorAll('[data-activate]').forEach(b=>b.onclick=async()=>{closeModal();await choose(b.dataset.activate);});$('modalContent').querySelectorAll('[data-rename]').forEach(b=>b.onclick=()=>rename(b.dataset.rename));try{ctx.wear?.($('modalContent'));}catch{}}
 listeners.add(renderTab);
 // V90: a resident using furniture in a companion house. Training pieces add stat progress
 // (capped at HOME_DAILY_CAP bar points per companion per day), food fills the belly, beds and
 // fun pieces lift the mood. Returns true when something changed (for the little up-arrow).
 function homeEffect(id,effect){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return false;const p=pet(id);settleMood(p);
  const day=new Date().toISOString().slice(0,10);if(p.homeDay!==day){p.homeDay=day;p.homeGain=0;}
  let changed=false;
  if(COMPANION_STATS.includes(effect)){if(p.homeGain<HOME_DAILY_CAP){const g=Math.max(1,Math.round(1.5*growth(id,effect)));gainStat(p,meta,effect,g);p.homeGain+=g;changed=true;}}
  else if(effect==='food'){if(p.belly<100){p.belly=Math.min(100,p.belly+Math.round(6*growth(id,'food')));p.bellyAt=now();changed=true;}}
  else if(effect==='mood'){if(p.mood<100){p.mood=Math.min(100,p.mood+Math.round(2*growth(id,'mood')));p.moodAt=now();changed=true;}}
  if(effect==='hp'&&p.mood<100){p.mood=Math.min(100,p.mood+1);p.moodAt=now();}
  if(changed)save();return changed;}
 // V93 games: read-only info and the training reward after a race / bout (growth multipliers apply).
 function info(id){const meta=metaById.get(id);const p=pet(id);settleMood(p);return {name:p.nick||uiName(byId.get(id))||meta?.name||'',stats:p.stats,mood:p.mood,grades:companionGrades(meta,isShiny(id))};}
 function gameReward(id,stats,amount){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return [];const p=pet(id);const done=[];for(const st of stats){gainStat(p,meta,st,Math.max(1,Math.round(amount*growth(id,st))));done.push(STAT_LABEL[st]);}p.mood=Math.min(100,p.mood+3);p.moodAt=now();save();refreshViews();return done;}
 const lookOf=id=>state.pets[id]?.look||null;
 // V118: preview of a meal for the element sheet (taste, stat growth now, looks it can change)
 function mealPreview(itemId,cid=state.active){const meta=metaById.get(cid),item=byId.get(itemId);if(!meta||!item||!isDiscovered(cid))return null;const p=pet(cid);
  const taste=likes(meta,item),last=p.fed[item.id]||0,fresh=now()-last>FEED_COOLDOWN_MS,depth=ctx.depthOf?.(item.id);
  const stats=taste==='no'?[]:feedPlan(meta,item).map(c=>({stat:c.stat,label:STAT_LABEL[c.stat],amount:Math.round(c.amount*growth(cid,c.stat))}));
  const known=tasted(item.id);
  return {cid,known,name:nameOf(meta),taste,fresh,cooldownMin:fresh?0:Math.max(1,Math.ceil((FEED_COOLDOWN_MS-(now()-last))/60000)),stats,depth,depthMult:feedDepthMult(depth),looks:lookEffects(item.name||uiName(item),familyFor(item),item.category,depth)};}
 function tasted(itemId){return !!state.tasted?.[itemId]||Object.values(state.pets||{}).some(q=>q?.fed?.[itemId]);}
 function looksOf(itemId){const item=byId.get(itemId);if(!item)return null;return lookEffects(item.name||uiName(item),familyFor(item),item.category,ctx.depthOf?.(item.id));}
 return {tasted,looksOf,mealPreview,lookOf,applyLook:(svg,id)=>applyLookSvg(svg,lookOf(id),id),start,stop,setActive,statsHtml,info,gameReward,choose,homeEffect,syncSeen,markSeen,isCompanion,freeChoiceLeft,emote,feed,hitTest,onDiscovery,renderTab,openCard,get active(){return activeMeta();},state:()=>state,unlocked,refreshViews,
  onViewChange(){if(activeMeta()&&sprite&&!sprite.hidden)setTimeout(()=>{if(cancelMove)cancelMove();const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);sprite.dataset.anim='idle';}},80);},
  importState(raw){if(raw&&raw.pets){state=normalize(raw);save();syncSeen();}},grades:companionGrades};
}
