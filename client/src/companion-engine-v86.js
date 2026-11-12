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
/** V152: after 20 elements a companion is full for an hour (or until the player makes room: ad or coins). Hidden counter. */
export const FULL_AFTER=20,FULL_MS=60*60*1000;
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
/** V199: chemistry between two companions — friends, neutral, rivals or sworn enemies. Pure and symmetric. */
const REL_NEMESIS=[['legacy:118','legacy:1277'],['organic82:cerberus','organic82:pegasus'],['organic83:phoenix','pack:penguin'],['organic42:photographer','pack:ghost'],['organic40:fox','organic40:hedgehog'],['legacy:609','pack:wizard'],['organic82:smilodon','organic82:woolly-mammoth'],['legacy:566','organic85:day-of-the-dead']];
const REL_BEST=[['organic38:frog','organic42:otter'],['pack:panda','pack:penguin'],['organic37:beekeeper','organic37:chef'],['organic85:flamenco','organic85:tango'],['legacy:123','legacy:609'],['organic40:owl','pack:wizard'],['organic82:stegosaurus','organic82:triceratops'],['organic41:archaeologist','organic41:explorer']];
export const REL_INFO={friends:{icon:'💚',label:'Best friends',note:'They team up at the mixer and sometimes find a new element together.'},neutral:{icon:'🤝',label:'Get along',note:'They play together now and then.'},rivals:{icon:'😤',label:'Rivals',note:'They bicker and spar a lot.'},nemesis:{icon:'💥',label:'Sworn enemies',note:'Their fights end with one of them knocked out — tap it to bring it back.'}};
export function relationOf(a,b,sameFamily=false){if(!a||!b||a===b)return 'neutral';const [x,y]=[String(a),String(b)].sort();const has=L=>L.some(([p,q])=>p===x&&q===y);
 if(has(REL_NEMESIS))return 'nemesis';if(has(REL_BEST))return 'friends';let h=2166136261;for(const ch of x+'|'+y){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}const r=h%100;
 return sameFamily?(r<45?'friends':r<85?'neutral':r<98?'rivals':'nemesis'):(r<25?'friends':r<70?'neutral':r<94?'rivals':'nemesis');}
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
export const LOOK_COLORS={warm:[255,138,61],cool:[74,168,255],green:[79,191,90],metal:[150,165,180],purple:[160,112,224],gold:[232,192,64],pink:[255,143,192],dark:[70,48,92],light:[255,250,232],
 mint:[120,220,180],sky:[120,190,250],berry:[170,60,140],sunset:[255,110,80],snow:[245,248,255],cocoa:[130,85,55],aurora:[90,220,210],onyx:[40,40,52],rainbow:[255,90,200],
 starlight:[215,230,255],obsidian:[28,18,40],ember:[255,80,30],pearl:[250,238,225],neon:[60,255,170],radiant:[255,215,90]};
const TINT_NAME={warm:'Warm',cool:'Cool',green:'Leafy',metal:'Metallic',purple:'Mystic',gold:'Golden',pink:'Rosy',dark:'Shadowy',light:'Bright',mint:'Mint',sky:'Sky',berry:'Berry',sunset:'Sunset',snow:'Snow',cocoa:'Cocoa',aurora:'Aurora',onyx:'Shadow',rainbow:'Rainbow',starlight:'Starlight',obsidian:'Obsidian',ember:'Ember',pearl:'Pearl',neon:'Neon',radiant:'Radiant'};
/** V175: Market colours — elements with no natural look can carry a colour that the Market unlocks. fn(name) → {name,tint,unlocked} */
let MARKET_LOOK=null;
export function setMarketLook(fn){MARKET_LOOK=typeof fn==="function"?fn:null;}
/** V176: every look change (colours and traits; size stays free) must be bought in the Market. Gate = {tint:key=>bool, theme:key=>bool}. Rivals and previews of the full catalogue pass gate=false. */
let LOOK_GATE=null;
export function setLookGate(g){LOOK_GATE=g&&typeof g==='object'?g:null;}
const tintOpen=k=>!LOOK_GATE||!!LOOK_GATE.tint?.(k);const themeOpen=k=>!LOOK_GATE||!!LOOK_GATE.theme?.(k);
export function hasNaturalLook(name,family=''){const tf=themeFor(name);return !!(tf.theme||FAMILY_TINT[family]);}
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
 ['water',/\b(water|rain|river|lake|ocean|sea|wave)\b/,{tint:'cool'}],
 // V177 ultra-rare looks and colours: only their essences carry them
 ['celestial',/\bcelestial essence\b/,{tint:'starlight',head:'halo',back:'feather-wings',aura:'sparkle'}],
 ['abyssal',/\babyssal essence\b/,{tint:'obsidian',head:'devil-horns',back:'bat-wings',tail:'devil-tail',aura:'embers'}],
 ['titan',/\btitan essence\b/,{tint:'ember',head:'dragon-horns',back:'dragon-wings',tail:'dragon-tail',aura:'embers'}],
 ['supreme',/\bsupreme essence\b/,{tint:'radiant',head:'crown',back:'fire-wings',tail:'fox-tail',aura:'sparkle'}],
 ['u-starlight',/\bstarlight essence\b/,{tint:'starlight'}],['u-obsidian',/\bobsidian essence\b/,{tint:'obsidian'}],['u-ember',/\bember essence\b/,{tint:'ember'}],
 ['u-pearl',/\bpearl essence\b/,{tint:'pearl'}],['u-neon',/\bneon essence\b/,{tint:'neon'}]];
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
export function lookAfterMeal(look,name,family='',category='',depth,gate=false){
 const L=normLook(look);const tf=themeFor(name);const t=tf.picked?' ':` ${String(name||'').toLowerCase()} `;const notes=[];const tier=lookTier(depth);
 if(/rebirth|\begg\b|reset|reincarnat/.test(t)&&(L.k>0||L.size||['head','back','tail','aura'].some(sl=>Object.keys(L.mix[sl]).length))){notes.push('Back to its natural look');return {look:defaultLook(),notes};}
 const wash=/soap|bath|shower|wash|sponge|clean/.test(t);
 if(wash&&L.k>0){L.k=Math.round(L.k*0.4*100)/100;if(L.k<0.04){L.k=0;L.tint=null;}L.aura=null;notes.push('Washed some colour off');}
 if(/mirror|reflection/.test(t)&&(L.size||Object.keys(L.mix.head).length)){L.size=Math.round(L.size*0.4*100)/100;L.mix.head={};L.head=null;notes.push('Looks more like itself');}
 const theme=tf.theme;const set=theme?theme[2]:{};const tl=` ${String(name||'').toLowerCase()} `;
 let tk=set.tint||FAMILY_TINT[family];if(!tk&&!theme){const ml=MARKET_LOOK?.(name);if(ml?.unlocked&&LOOK_COLORS[ml.tint])tk=ml.tint;}
 if(gate&&tk&&!(theme&&set.tint===tk&&themeOpen(theme[0]))&&!(MARKET_LOOK?.(name)?.tint===tk)&&!tintOpen(tk))tk=null;
 if(tk&&!wash){const c=LOOK_COLORS[tk];const step=[0,0.05,0.07,0.1][tier],cap=tier===3?0.62:0.5;L.tint=L.tint&&L.k>0?mix(L.tint,c,tier===3?0.6:0.4):c;const was=L.k;L.k=Math.min(cap,Math.round((L.k+step)*100)/100);if(L.k>was)notes.push(`A little more ${TINT_NAME[tk].toLowerCase()}`);}
 const grow=category==='food'||/\b(food|cake|bread|pie|burger|pizza|meal|feast|mountain|whale|giant|elephant|huge|titan|mammoth)\b/.test(tl),shrink=/\b(air|feather|cloud|bubble|tiny|mini|small|ant|mouse|dust|pebble)\b/.test(tl);
 if(grow&&!shrink&&L.size<0.15){L.size=Math.min(0.15,Math.round((L.size+0.02)*100)/100);notes.push('Grew a bit');}
 else if(shrink&&!grow&&L.size>-0.15){L.size=Math.max(-0.15,Math.round((L.size-0.02)*100)/100);notes.push('Got a bit smaller');}
 if(tier>=2&&!(gate&&theme&&!themeOpen(theme[0])))for(const slot of ['head','back','tail','aura']){const v=set[slot];if(!v)continue;const mx=L.mix[slot];const gain=tier===3?0.4:0.25;
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
/** V129: a believable look for a rival companion in the minigames: it "ate" a few themed meals.
 * Higher levels → more meals, harder (radiant) elements and sometimes a second theme mixed in. */
const RIVAL_MEALS=['Demon','Dragon','Fairy','Angel','Fish','Fox','Robot','Bird','Ice','Fire','Flower','Leaf','Star','Crown','Love','Music','Magic','Bubble','Gold','Candy','Vampire'];
export function rivalLook(seed,level=0){let x=(Math.abs(Math.floor(seed))%2147483646)+1;const rnd=()=>(x=x*16807%2147483647)/2147483647;
 let L=defaultLook();const meals=1+level+Math.floor(rnd()*2);const depth=level>=3?10:level>=1?6:3;
 const a=RIVAL_MEALS[Math.floor(rnd()*RIVAL_MEALS.length)],b=level>=1&&rnd()<0.5?RIVAL_MEALS[Math.floor(rnd()*RIVAL_MEALS.length)]:null;
 for(let i=0;i<meals;i++)L=lookAfterMeal(L,b&&i%2?b:a,'','',depth).look;
 if(rnd()<0.35)for(let i=0;i<1+level;i++)L=lookAfterMeal(L,rnd()<0.5?'Cake':'Feather','','food',3).look;
 return L;}
/** V118: what an element WOULD do to a companion's looks (for the element sheet), from a plain look. */
export function lookEffects(name,family='',category='',depth,gate=false){const tf=themeFor(name);const t=tf.picked?' ':` ${String(name||'').toLowerCase()} `;const tier=lookTier(depth);const r=lookAfterMeal(defaultLook(),name,family,category,depth).look;
 const theme=tf.theme;const set=theme?theme[2]:{};const ml=!theme&&!FAMILY_TINT[family]?MARKET_LOOK?.(name):null;const tk=set.tint||FAMILY_TINT[family]||(ml?.unlocked?ml.tint:null)||null;
 const thLocked=gate&&theme&&!themeOpen(theme[0]);
 const traits=['head','back','tail','aura'].filter(sl=>set[sl]).map(sl=>({slot:sl,label:TRAIT_NAME[set[sl]],lux:tier===3,locked:tier<2,buy:thLocked}));
 const natTint=set.tint||FAMILY_TINT[family]||null;const tintLocked=gate&&natTint&&!(theme&&set.tint===natTint&&themeOpen(theme[0]))&&!tintOpen(natTint);
 const resets=[];if(/rebirth|\begg\b|reset|reincarnat/.test(t))resets.push('Restores the natural look');if(/soap|bath|shower|wash|sponge|clean/.test(t))resets.push('Washes colour off');if(/mirror|reflection/.test(t))resets.push('Undoes size and head trait');
 const wash2=/soap|bath|shower|wash|sponge|clean/.test(t);return {tint:tk&&!wash2&&!tintLocked?{key:tk,name:TINT_NAME[tk],rgb:LOOK_COLORS[tk]}:null,lockedTint:tintLocked&&!wash2?{key:natTint,name:TINT_NAME[natTint],rgb:LOOK_COLORS[natTint]}:null,lookLocked:thLocked?theme[0]:null,size:r.size,traits,resets,tier,theme:theme?.[0]||null,market:ml?{name:ml.name,locked:!ml.unlocked,rgb:LOOK_COLORS[ml.tint]||[200,200,200]}:null};}
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
/** V134: small icon of a trait (its real outline/colour) for the Looks filter. */
/** V176: what a look theme gives (for the Market). */
export function themeInfo(key){const th=LOOK_THEMES.find(([k])=>k===key);if(!th)return null;const set=th[2];const traits=['head','back','tail','aura'].filter(sl=>set[sl]).map(sl=>TRAIT_NAME[set[sl]]);return {key,traits,tint:set.tint?{key:set.tint,name:TINT_NAME[set.tint],rgb:LOOK_COLORS[set.tint]}:null,icon:traits[0]?traitIconSvg(traits[0]):''};}
export function traitIconSvg(label){const id=Object.keys(TRAIT_NAME).find(k=>TRAIT_NAME[k]===label);if(!id)return '';
 const g=Object.keys(MORPH).find(k=>MORPH[k][id]);const wrap=b=>`<svg viewBox="-24 -24 48 48" width="40" height="40" aria-hidden="true">${b}</svg>`;
 if(g){const pts=MORPH[g][id];let xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);const sc=34/Math.max(w,h);
  const cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;const d=smoothPath(pts,sc,-cx*sc,-cy*sc);const col=MORPH_COLOR[id];
  if(g==='horn')return wrap(`<g transform="translate(-7 0)"><path d="${d}" fill="${col}" stroke="${S}" stroke-width="2"/></g><g transform="translate(7 0) scale(-1 1)"><path d="${d}" fill="${col}" stroke="${S}" stroke-width="2"/></g>`);
  if(g==='aura')return wrap([[-10,-8,.55],[9,-4,.75],[-3,10,.6]].map(([x,y,k])=>`<path d="${smoothPath(pts,sc*k,x-cx*sc*k,y-cy*sc*k)}" fill="${col}" stroke="${S}" stroke-width="1.5"/>`).join(''));
  return wrap(`<path d="${d}" fill="${col}" stroke="${S}" stroke-width="2"/>`);}
 if(HEAD[id])return wrap(`<g transform="translate(0 16)">${HEAD[id](34)}</g>`);
 if(id==='notes')return wrap('<text x="0" y="12" font-size="32" text-anchor="middle" fill="#9b7fc4">♪</text>');
 return '';}
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

// V200: every rig draws its arms/wings differently, so poses are aimed from the limb's real rest direction
export function poseRig(art,tries=0){if(!art)return;const limbs=[...art.querySelectorAll('[data-part="arm-l"],[data-part="arm-r"],[data-part="wing-l"],[data-part="wing-r"]')];
 art.dataset.rig=art.querySelector('[data-part="arm-r"]')?'biped':art.querySelector('[data-part="wing-r"]')?'winged':'quad';let miss=false;
 for(const g of limbs){let b=null;try{b=g.getBBox();}catch{}if(!b||(!b.width&&!b.height)){miss=true;continue;}
  const [px,py]=(g.dataset.pivot||'50 50').split(/\s+/).map(Number),th=Math.atan2(b.y+b.height/2-py,b.x+b.width/2-px)*180/Math.PI,left=px<50;
  const d=t=>((t-th)%360+540)%360-180,set=(n,v)=>g.style.setProperty(n,Math.round(v)+'deg');
  let up=d(-90);if(Math.abs(up)>120){if(left&&up<0)up+=360;if(!left&&up>0)up-=360;}if(Math.abs(d(-90))<62)up=0;const cl=v=>Math.max(-55,Math.min(55,v));
  set('--up',up);set('--fwd',d(0));set('--back',d(180));set('--down',d(90));set('--in',cl(d(left?35:145)));set('--out',d(left?200:-20));}
 if(miss&&tries<6)setTimeout(()=>poseRig(art,tries+1),350);}
export function createCompanionSystem(ctx){
 const {roster,sprites,$,escapeText,byId,uiName,staticArt,familyFor,isDiscovered,isShiny,elementIsUseful,getSlots,isLeftLocked,toast,showModal,closeModal,reducedMotion,FAMILIES}=ctx;
 const requestActivation=ctx.requestActivation||(async()=>true);
 // V92: houses speed up growth (multipliers on future gains only — never on stats themselves).
 const growth=(id,kind)=>{let g=1;try{g=Math.max(1,Number(ctx.growthFor?.(id,kind))||1);}catch{}return g*(typeof duoActive==='function'&&duoActive()?1.25:1);};const onBadge=ctx.onBadge||(()=>{});
 const metaById=new Map(roster.map(c=>[c.id,c]));
 const sfx=new Proxy(ctx.sfx||{},{get:(t,k)=>t[k]||(()=>{})});
 let state={active:null,pets:{},v:1};
 const starter=ctx.starterCompanion||null;
 const normalize=raw=>({active:raw.active||null,pets:raw.pets,v:1,firstFreeUsed:Boolean(raw.firstFreeUsed||(raw.active&&raw.active!==starter)),seen:Array.isArray(raw.seen)?raw.seen.filter(x=>typeof x==='string'):null,buddy:typeof raw.buddy==='string'?raw.buddy:null,tasted:raw.tasted&&typeof raw.tasted==='object'?raw.tasted:{}}); // V131: keep the second slot and tasted elements across launches
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
  sprite.addEventListener('click',e=>{e.stopPropagation();if(stroke.done){stroke.done=false;return;}if(reviveIfKo('main'))return;sfx.boop();openCard(state.active);});
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
  for(const g of art.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}poseRig(art);
  sprite.dataset.move=meta.move;sprite.dataset.quirk=meta.quirkAnim||'wiggle';sprite.dataset.companion=meta.id;sprite.classList.toggle('is-shiny',isShiny(meta.id));
  const svgEl=art.querySelector('svg');if(svgEl){svgEl.setAttribute('width','100%');svgEl.setAttribute('height','100%');}
  try{ctx.wear?.(sprite.parentElement||sprite);}catch{}
 }
 // V128: looks/belts must be applied after the sprite is in a layer and visible, or the saved look is lost on launch
 function rewear(){requestAnimationFrame(()=>{try{ctx.wear?.(layerFront);ctx.wear?.(layerBack);}catch{}});}
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
 function startPetting(){const meta=activeMeta();if(!meta)return;petting=true;duoAbort=true;if(sleeping)wake();if(cancelMove)cancelMove();sprite.classList.remove('is-happy');sprite.classList.add('is-petted');emote('heart',99999);}
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
  placeToy();
  {const sk=skillsOf(meta.id);if(sk.length&&now()-lastSkill>25000&&Math.random()<0.06+0.02*Math.max(...sk.map(k=>skillLevel(meta.id,k)))){lastSkill=now();await performSkill(sk[Math.floor(Math.random()*sk.length)]);timer=setTimeout(loop,800);return;}}
  if(rail.kind==='top'&&now()-lastVisit>45000&&Math.random()<0.07){lastVisit=now();if(await visitorScene()){timer=setTimeout(loop,900);return;}}
  if(ctx.toy?.()&&rail.kind==='top'&&now()-lastToy>30000&&Math.random()<0.07){lastToy=now();if(await playToy()){timer=setTimeout(loop,800);return;}}
  if(ko.main){timer=setTimeout(loop,900);return;}
  if(rail.kind==='top'&&now()-lastHello>38000&&Math.random()<0.1){lastHello=now();const h=['wave','peek','sniff'][Math.floor(Math.random()*3)];sprite.dataset.anim=h;expr(sprite,h==='peek'?'wow':'happy',1800);if(h==='wave')sfx.boop?.();await wait(1900);if(sprite.dataset.anim===h)sprite.dataset.anim='idle';timer=setTimeout(loop,600);return;}
  if(duoActive()&&bud&&!bud.sprite.hidden&&!ko.bud&&rail.kind==='top'&&(duoRequest||(now()-lastDuo>18000&&Math.random()<0.2))){const k=duoRequest;duoRequest=null;await duoPlay(k);timer=setTimeout(loop,900);return;}
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
  p.eaten=(p.eaten||0)+1;if(p.eaten>=FULL_AFTER&&!p.fullUntil){p.fullUntil=now()+FULL_MS;setTimeout(()=>{try{showNoteWindow(meta,['<b>Full!</b> · hungry again in 1 h']);emote('heart',1600);}catch{}},3800);}
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
  // V135: filters/counts in the element list depend on what was fed — refresh them right away
  try{ctx.onMeal?.(item.id,self);}catch(e){console.warn('onMeal',e);}
  const lookBefore=p.look;
  const lk=self?{look:p.look,notes:[]}:lookAfterMeal(p.look,item.name||uiName(item),familyFor(item),item.category,ctx.depthOf?.(item.id),true);p.look=lk.look;save();if(lk.notes.length)try{ctx.wear?.(sprite.parentElement||sprite);}catch{}
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
 function fullLeft(id){const p=state.pets[id];if(!p)return 0;if(p.fullUntil&&now()>=p.fullUntil){p.fullUntil=0;p.eaten=0;save();}return p.fullUntil?p.fullUntil-now():0;}
 function makeRoom(id){const p=pet(id);p.fullUntil=0;p.eaten=0;save();refreshViews();if(id===state.active&&sprite&&!sprite.hidden){emote('heart',1200);sfx.happy();}}
 async function feed(elementId){
  const meta=activeMeta(),item=byId.get(elementId);if(!meta||!item)return false;
  const left=fullLeft(meta.id);if(left>0){if(sprite&&!sprite.hidden){emote('spiral',1200);sfx.refuse?.();}ctx.onFull?.({id:meta.id,name:nameOf(meta),leftMs:left});return false;}
  duoAbort=true;if(cancelMove)cancelMove();busy=true;
  try{return await eatSequence(meta,item);}finally{busy=false;}
 }
 // The companion goes to the element list by itself and helps itself to a chip.
 let selfFeedTimer=null;
 function scheduleSelfFeed(){clearTimeout(selfFeedTimer);const m=activeMeta();const [a,b]=m&&hungry(pet(m.id))?HUNGRY_SELF_FEED_MS:SELF_FEED_INTERVAL_MS;selfFeedTimer=setTimeout(selfFeed,a+Math.random()*(b-a));}
 async function selfFeed(){
  const meta=activeMeta();if(!meta||document.hidden||sleeping||busy||fullLeft(meta.id)>0){scheduleSelfFeed();return;}
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
 function hitTest(x,y){if(bud&&!bud.sprite.hidden&&buddyMeta()){const r=bud.sprite.getBoundingClientRect();if(x>=r.left-14&&x<=r.right+14&&y>=r.top-14&&y<=r.bottom+14){const m=sprite.getBoundingClientRect();const dm=Math.hypot(x-(m.left+m.width/2),y-(m.top+m.height/2)),db=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));if(db<dm){duoAbort=true;swapInPlace();return true;}}}if(!sprite||!activeMeta())return false;const r=sprite.getBoundingClientRect();return x>=r.left-14&&x<=r.right+14&&y>=r.top-14&&y<=r.bottom+14;}

 // ---------- lifecycle ----------
 function start(){ensureLayer();if(cancelMove)cancelMove();busy=false;sleeping=false;const meta=activeMeta();if(!meta){stop();return;}setArt(meta);sprite.hidden=false;layerFront.hidden=false;layerBack.hidden=false;settleMood(pet(meta.id));sprite.dataset.mood=moodLabel(pet(meta.id).mood).toLowerCase();
  const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);}
  clearTimeout(timer);clearInterval(blinkTimer);
  if(reducedMotion()){sprite.dataset.anim='idle';sprite.classList.add('is-static');rewear();return;}
  blinkTimer=setInterval(()=>{if(!sleeping&&sprite.dataset.anim==='idle'){sprite.classList.add('is-blinking');setTimeout(()=>sprite.classList.remove('is-blinking'),170);}},3000+Math.random()*1800);
  timer=setTimeout(loop,700);scheduleGift();scheduleSelfFeed();if(buddyMeta())startBuddy();else stopBuddy();rewear();}
 function stop(){stopBuddy();clearTimeout(timer);clearTimeout(giftTimer);clearTimeout(selfFeedTimer);if(statWin)statWin.hidden=true;clearInterval(blinkTimer);if(cancelMove)cancelMove();if(sprite){sprite.hidden=true;}if(layerFront)layerFront.querySelectorAll('.companion-gift').forEach(g=>g.remove());}
 function setActive(id){try{ko.main=false;ko.bud=false;sprite?.classList.remove('is-ko');bud?.sprite.classList.remove('is-ko');}catch{}if(id&&!isDiscovered(id))return false;if(id&&id===state.buddy)state.buddy=state.active||null;state.active=id||null;if(id)state.firstFreeUsed=true;save();if(state.active){pet(state.active);start();}else stop();refreshViews();return true;}
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

 // ---------- V125: second companion slot (duo) ----------
 // A second companion walks the same rails and, now and then, plays with the main one:
 // sparring, throwing an element, tag, hide-and-seek and a ball game. Everything is drawn by the
 // sprites' own rigs (CSS states .companion[data-anim="duo-…"]) and the synthesised sfx.
 const DUO_GROWTH=1.25;
 const slot2=()=>{try{return !!ctx.slot2Unlocked?.();}catch{return false;}};
 const buddyMeta=()=>{const id=state.buddy;if(!id||id===state.active||!activeMeta()||!isDiscovered(id)||!slot2())return null;return metaById.get(id)||null;};
 const duoActive=()=>!!buddyMeta();
 const expr=(el,k,ms=1600)=>{if(!el)return;el.dataset.expr=k;clearTimeout(el._ex);if(ms)el._ex=setTimeout(()=>{if(el.dataset.expr===k)delete el.dataset.expr;},ms);};let lastHello=0;
 const famOf=id=>metaById.get(id)?.family;const relation=(a,b)=>relationOf(a,b,!!a&&!!b&&famOf(a)===famOf(b));
 const ko={main:false,bud:false};
 function setKo(who,on){ko[who]=on;const el=who==='main'?sprite:bud?.sprite;if(!el)return;el.classList.toggle('is-ko',on);if(on){el.dataset.anim='tumble';expr(el,'dizzy',0);emoteOn(el,'spiral',600000);}else{delete el.dataset.expr;el.dataset.anim='getup';setTimeout(()=>{if(el.dataset.anim==='getup'){el.dataset.anim='celebrate';expr(el,'happy',1200);setTimeout(()=>{if(el.dataset.anim==='celebrate')el.dataset.anim='idle';},1300);}},800);const e=el.querySelector('.companion-emote');if(e)e.hidden=true;emoteOn(el,'heart',1400);sfx.happy?.();}}
 function reviveIfKo(who){if(!ko[who])return false;setKo(who,false);const id=who==='main'?state.active:state.buddy;try{toast(`${nameOf(metaById.get(id))} is back on its feet!`,'new');}catch{}return true;}
 let bud=null,budTimer=null,duoBusy=false,duoAbort=false,lastDuo=0,duoRequest=null;
 function ensureBud(){ensureLayer();if(bud)return bud;
  const s=document.createElement('button');s.type='button';s.className='companion is-buddy';s.id='companionBuddy';s.setAttribute('aria-label','Second companion — tap to make it the main one');
  s.innerHTML='<span class="companion-shadow" aria-hidden="true"></span><span class="companion-art" aria-hidden="true"></span><span class="companion-fx" aria-hidden="true"></span><span class="companion-emote" aria-hidden="true" hidden></span>';
  // V130: the second companion can be fed and petted too — it takes the main role in place (no jump), then the normal flow runs
  let bs={};
  s.addEventListener('click',e=>{e.stopPropagation();if(bs.done){bs.done=false;return;}if(reviveIfKo('bud'))return;if(duoBusy)return;sfx.boop();swapInPlace();openCard(state.active);});
  s.addEventListener('pointerdown',e=>{bs={x:e.clientX,y:e.clientY,dist:0,on:false,done:false,id:e.pointerId,last:0};try{s.setPointerCapture(e.pointerId);}catch{}});
  s.addEventListener('pointermove',e=>{if(bs.id!==e.pointerId||bs.x==null)return;bs.dist+=Math.hypot(e.clientX-bs.x,e.clientY-bs.y);bs.x=e.clientX;bs.y=e.clientY;
   if(!bs.on&&bs.dist>26){bs.on=true;duoAbort=true;swapInPlace();startPetting();}if(bs.on&&now()-bs.last>420){bs.last=now();sfx.purr();petTick();}});
  const endB=()=>{if(bs.on){bs.done=true;stopPetting();}bs.x=null;bs.id=null;};
  s.addEventListener('pointerup',endB);s.addEventListener('pointercancel',endB);s.addEventListener('lostpointercapture',endB);
  bud={sprite:s,pos:{x:140,y:200,face:-1},rail:null,cancel:null,meta:null,emoteT:null};layerFront.append(s);return bud;}
 function bPlace(x,y){bud.pos.x=x;bud.pos.y=y;bud.sprite.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;bud.sprite.dataset.face=bud.pos.face>0?'right':'left';}
 function bLayer(which){const L=which==='back'?layerBack:layerFront;if(bud.sprite.parentElement!==L)L.append(bud.sprite);}
 function bSetArt(meta){bud.meta=meta;const art=bud.sprite.querySelector('.companion-art');art.innerHTML=sprites[meta.id]||'';
  for(const g of art.querySelectorAll('[data-part]')){const p=(g.dataset.pivot||'50 50').split(/\s+/).map(Number);g.style.transformOrigin=`${p[0]}px ${p[1]}px`;g.style.transformBox='view-box';}poseRig(art);
  bud.sprite.dataset.move=meta.move;bud.sprite.dataset.companion=meta.id;bud.sprite.classList.toggle('is-shiny',isShiny(meta.id));
  const svgEl=art.querySelector('svg');if(svgEl){svgEl.setAttribute('width','100%');svgEl.setAttribute('height','100%');}
  try{ctx.wear?.(bud.sprite.parentElement||bud.sprite);}catch{}}
 const bSpeed=()=>{const m=bud.meta;const run=pet(m.id).stats.run.points;return ({fly:150,roll:140,hop:100,waddle:70,walk:105}[m.move]||105)*(1+Math.min(1,run/3375)*0.6);};
 function bTravel({x,y,arc=0,ms=null,anim=null,swapLayer=null,ease=true,px=null}){
  return new Promise(res=>{const sx=bud.pos.x,sy=bud.pos.y,d=Math.hypot(x-sx,y-sy);const dur=ms??Math.max(200,1000*d/(px||bSpeed()));
   if(x!==sx)bud.pos.face=x>sx?1:-1;const m=bud.meta;
   bud.sprite.dataset.anim=anim||(arc?'jump':m.move==='fly'?'fly':m.move==='roll'?'roll':m.move==='hop'?'hopwalk':m.move==='waddle'?'waddle':'walk');
   bud.sprite.style.setProperty('--stride',(m.move==='waddle'?0.55:m.move==='hop'?0.5:Math.max(0.24,0.5*105/(px||bSpeed()))).toFixed(2)+'s');
   let swapped=false,raf=0;const t0=performance.now();bud.cancel=()=>{cancelAnimationFrame(raf);bud.cancel=null;res(false);};
   const step=t=>{const k=Math.min(1,(t-t0)/dur);const e=ease?easeInOut(k):k;
    if(swapLayer&&!swapped&&k>=0.5){swapped=true;bLayer(swapLayer);}
    bPlace(sx+(x-sx)*e,sy+(y-sy)*e-arc*Math.sin(Math.PI*k));
    if(k<1)raf=requestAnimationFrame(step);else{bud.cancel=null;bud.sprite.dataset.anim='idle';res(true);}};
   raf=requestAnimationFrame(step);});}
 async function bJumpTo(r,xHint=null){if(!r)return;const tx=r.kind==='side'?r.x:clampX(r,xHint??bud.pos.x),ty=r.kind==='side'?r.y2:r.y;const dy=ty-bud.pos.y;
  const swap=r.layer!==(bud.sprite.parentElement===layerBack?'back':'front')?r.layer:null;bud.sprite.dataset.anim='crouch';await wait(130);sfx.hop();
  await bTravel({x:tx,y:ty,arc:Math.max(26,Math.min(70,Math.abs(dy)*0.35+24)),ms:420+Math.abs(dy)*0.9,anim:'jump',swapLayer:swap});bud.sprite.dataset.anim='land';await wait(150);bud.sprite.dataset.anim='idle';bud.rail=r;}
 function fxOn(el,kind,ms=1200){const f=el.querySelector('.companion-fx');if(!f)return null;const i=document.createElement('i');i.className='fx-'+kind;f.append(i);setTimeout(()=>i.remove(),ms);return i;}
 function emoteOn(el,kind,ms=1600){if(reducedMotion())return;const e=el.querySelector('.companion-emote');if(!e)return;e.innerHTML=EMOTE_SVG[kind]||EMOTE_SVG.orb;e.dataset.emote=kind;e.hidden=false;e.classList.remove('is-pop','is-fade');void e.offsetWidth;e.classList.add('is-pop');clearTimeout(e._t);e._t=setTimeout(()=>{e.classList.remove('is-pop');e.classList.add('is-fade');setTimeout(()=>{e.hidden=true;e.classList.remove('is-fade');},300);},ms);}
 function startBuddy(){const m=buddyMeta();if(!m){stopBuddy();return;}ensureBud();if(bud.cancel)bud.cancel();bSetArt(m);bud.sprite.hidden=false;
  const r=rail&&rail.kind==='top'?rail:pickRail();if(r){bud.rail=r;bLayer(r.layer);bud.pos.face=-1;bPlace(clampX(r,(pos.x||40)+90),r.y);}
  rewear();clearTimeout(budTimer);if(reducedMotion()){bud.sprite.dataset.anim='idle';return;}budTimer=setTimeout(budLoop,900);}
 function stopBuddy(){clearTimeout(budTimer);if(bud){if(bud.cancel)bud.cancel();bud.sprite.hidden=true;}}
 async function budLoop(){
  if(destroyed||!bud||!buddyMeta()){stopBuddy();return;}
  if(duoBusy||document.hidden||ko.bud){budTimer=setTimeout(budLoop,800);return;}
  if(sleeping){bud.sprite.dataset.anim='sleep';budTimer=setTimeout(budLoop,1500);return;}
  const rs=rails();if(!bud.rail||!rs.some(r=>r.kind===bud.rail.kind&&r.i===bud.rail.i)){const r=pickRail();if(!r){budTimer=setTimeout(budLoop,1200);return;}bud.rail=r;bLayer(r.layer);bPlace(clampX(r,bud.pos.x),r.y);}
  else bud.rail=rs.find(r=>r.kind===bud.rail.kind&&r.i===bud.rail.i)||bud.rail;
  const roll=Math.random();
  try{
   if(bud.rail.kind!=='top'){await bJumpTo(pickRail('top'),bud.pos.x);}
   else if(roll<0.32){await bTravel({x:bud.rail.x1+Math.random()*(bud.rail.x2-bud.rail.x1),y:bud.rail.y});}
   else if(roll<0.5&&rail&&rail.kind==='top'){// follow the main companion and stop next to it
    const side=bud.pos.x<pos.x?-1:1;const tr=rs.find(r=>r.kind==='top'&&r.i===rail.i)||rail;if(tr.i!==bud.rail.i)await bJumpTo(tr,pos.x+side*70);else await bTravel({x:clampX(tr,pos.x+side*70),y:tr.y});bud.pos.face=pos.x>bud.pos.x?1:-1;bud.sprite.dataset.face=bud.pos.face>0?'right':'left';if(Math.random()<0.4)emoteOn(bud.sprite,'heart',1200);}
   else if(roll<0.66){bud.sprite.dataset.anim='crouch';await wait(110);sfx.hop();await bTravel({x:bud.pos.x,y:bud.pos.y,arc:18,ms:420,anim:'jump'});bud.sprite.dataset.anim='land';await wait(150);}
   else if(roll<0.78){await bJumpTo(pickRail('top'));}
   else if(roll<0.88){bud.sprite.dataset.anim='duo-search';await wait(1400);}
   else{bud.sprite.dataset.anim='quirk-'+(bud.meta.quirkAnim||'wiggle');await wait(1600);}
  }catch(e){console.warn('buddy',e);}
  bud.sprite.dataset.anim='idle';budTimer=setTimeout(budLoop,500+Math.random()*1500);}
 function swapInPlace(){const b=state.buddy;if(!b||!buddyMeta()||!bud)return false;
  if(cancelMove)cancelMove();if(bud.cancel)bud.cancel();
  const mp={...pos},bp={...bud.pos},mr=rail,br=bud.rail,ml=sprite.parentElement,bl=bud.sprite.parentElement;
  state.buddy=state.active;state.active=b;save();
  setArt(metaById.get(state.active));bSetArt(metaById.get(state.buddy));
  rail=br;bud.rail=mr;(bl===layerBack?layerBack:layerFront).append(sprite);(ml===layerBack?layerBack:layerFront).append(bud.sprite);
  pos.face=bp.face;place(bp.x,bp.y);bud.pos.face=mp.face;bPlace(mp.x,mp.y);
  for(const id of [state.active,state.buddy]){const p=pet(id);settleMood(p);}sprite.dataset.mood=moodLabel(pet(state.active).mood).toLowerCase();
  rewear();refreshViews();return true;}
 function swapDuo(){const b=state.buddy;if(!b||!buddyMeta())return;state.buddy=state.active;state.active=b;save();start();startBuddy();refreshViews();}
 function setBuddy(id){try{ko.main=false;ko.bud=false;sprite?.classList.remove('is-ko');bud?.sprite.classList.remove('is-ko');}catch{}if(id&&(!isDiscovered(id)||id===state.active||!slot2()))return false;state.buddy=id||null;if(id)pet(id);save();if(state.buddy)startBuddy();else stopBuddy();refreshViews();return true;}
 // --- choreography helpers: same interface for both actors ---
 const A={m:{el:()=>sprite,p:()=>pos,go:o=>travel(o),face(d){pos.face=d;sprite.dataset.face=d>0?'right':'left';},anim(a){sprite.dataset.anim=a;},layer:w=>setLayer(w),jump:(r,x)=>jumpTo(r,x)},
  b:{el:()=>bud.sprite,p:()=>bud.pos,go:o=>bTravel(o),face(d){bud.pos.face=d;bud.sprite.dataset.face=d>0?'right':'left';},anim(a){bud.sprite.dataset.anim=a;},layer:w=>bLayer(w),jump:(r,x)=>bJumpTo(r,x)}};
 const chk=()=>{if(duoAbort||petting)throw new Error('duo-abort');};
 const w8=async ms=>{await wait(ms);chk();};
 const faceEach=(x,y)=>{x.face(y.p().x>x.p().x?1:-1);y.face(x.p().x>y.p().x?1:-1);};
 function flyer(itemId,cls='duo-ball'){const el=document.createElement('span');el.className='duo-flyer '+cls;const it=byId.get(itemId);el.innerHTML=it?staticArt(it):'<i class="duo-dot"></i>';layerFront.append(el);return el;}
 function arcFly(el,from,to,{ms=650,arc=60,spin=540}={}){return new Promise(res=>{const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/ms);const x=from[0]+(to[0]-from[0])*k,y=from[1]+(to[1]-from[1])*k-arc*Math.sin(Math.PI*k);el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(spin*k).toFixed(0)}deg)`;if(k<1)requestAnimationFrame(step);else res();};requestAnimationFrame(step);});}
 const handOf=(x,up=0)=>{const p=x.p();return [p.x+SIZE/2-11+p.face*16,p.y+SIZE*0.42-11-up];};
 const randomItem=()=>{try{return ctx.randomElement?.()||null;}catch{return null;}};
 async function meet(gap){// both onto the main's top rail, gap apart, facing each other
  const r=rail&&rail.kind==='top'?rail:pickRail('top');if(!r||r.x2-r.x1<gap+40)return null;
  if(rail!==r){await jumpTo(r,pos.x);}
  if(!bud.rail||bud.rail.i!==r.i||bud.rail.kind!=='top')await bJumpTo(r,pos.x+gap);
  const mid=Math.min(Math.max((pos.x+bud.pos.x)/2,r.x1+gap/2),r.x2-gap/2);const left=pos.x<=bud.pos.x;
  await Promise.all([A.m.go({x:mid+(left?-gap/2:gap/2),y:r.y}),A.b.go({x:mid+(left?gap/2:-gap/2),y:r.y})]);chk();faceEach(A.m,A.b);return r;}
 async function spar(){
  const r=await meet(48);if(!r)return;sfx.fight();A.m.anim('duo-guard');A.b.anim('duo-guard');await w8(600);
  let att=Math.random()<0.5?A.m:A.b;
  for(let i=0;i<4;i++){const def=att===A.m?A.b:A.m;const kick=Math.random()<0.4;
   att.anim(kick?'duo-kick':'duo-punch');sfx.swish();await w8(170);
   if(Math.random()<0.45){def.anim('duo-block');sfx.block();fxOn(def.el(),'spark',500);}
   else{def.anim('duo-hit');sfx.hit();fxOn(def.el(),'impact',500);const p=def.p();await def.go({x:clampX(r,p.x-def.p().face*12),y:r.y,ms:160,anim:'duo-hit',ease:false});faceEach(A.m,A.b);def.anim('duo-hit');}
   await w8(380);att.anim('duo-guard');def.anim('duo-guard');await w8(220);att=def;}
  const def=att===A.m?A.b:A.m;att.anim('duo-charge');sfx.charge();await w8(380);att.anim('duo-punch');sfx.swish();await w8(160);
  def.anim('tumble');sfx.bigHit();fxOn(def.el(),'impact',700);fxOn(def.el(),'stars',1400);const p=def.p();await def.go({x:clampX(r,p.x-def.p().face*30),y:r.y,ms:520,arc:16,anim:'tumble',ease:false});faceEach(A.m,A.b);
  await w8(500);faceEach(A.m,A.b);A.m.anim('duo-bow');A.b.anim('duo-bow');sfx.happy();await w8(1000);emoteOn(sprite,'heart',1300);emoteOn(bud.sprite,'heart',1300);}
 async function throwing(){
  const r=await meet(150);if(!r)return;let th=Math.random()<0.5?A.m:A.b;
  for(let i=0;i<3;i++){const tg=th===A.m?A.b:A.m;const id=randomItem();
   th.anim('duo-windup');sfx.grab();const ball=flyer(id,'duo-throwable');const h=handOf(th,10);ball.style.transform=`translate3d(${h[0]}px,${h[1]}px,0)`;await w8(420);
   th.anim('duo-throw');sfx.whoosh();const dodge=Math.random()<0.5;const tp=tg.p();const to=[tp.x+SIZE/2-11,tp.y+SIZE*0.35-11];
   if(dodge){setTimeout(async()=>{tg.anim('crouch');await wait(90);sfx.hop();await tg.go({x:tp.x,y:tp.y,arc:34,ms:420,anim:'jump'});tg.anim('land');},260);
    await arcFly(ball,h,[to[0]+tg.p().face*-50,to[1]+30],{ms:720,arc:50});sfx.miss();ball.classList.add('is-gone');tg.anim('duo-laugh');sfx.giggle();}
   else{await arcFly(ball,h,to,{ms:620,arc:55});sfx.hit();tg.anim('duo-hit');fxOn(tg.el(),'impact',500);emoteOn(tg.el(),'spiral',1100);ball.classList.add('is-bounce');}
   setTimeout(()=>ball.remove(),600);await w8(700);th.anim('idle');tg.anim('idle');th=tg;}
  A.m.anim('duo-laugh');A.b.anim('duo-laugh');sfx.giggle();await w8(900);}
 async function tag(){
  const r=await meet(90);if(!r)return;let chaser=Math.random()<0.5?A.m:A.b;
  for(let round=0;round<2;round++){const runner=chaser===A.m?A.b:A.m;
   chaser.anim('duo-cover');for(let k=0;k<3;k++){sfx.count();await w8(330);}
   runner.anim('duo-laugh');sfx.giggle();
   const far=runner.p().x<chaser.p().x?r.x1:r.x2;const other=rails().filter(x=>x.kind==='top'&&x.i!==r.i);
   const legRun=runner.go({x:far,y:r.y,px:230});await w8(250);const legChase=chaser.go({x:clampX(r,far+(far===r.x1?40:-40)),y:r.y,px:250});await legRun;chk();
   if(other.length){const o=other[Math.floor(Math.random()*other.length)];await runner.jump(o,runner.p().x);chk();await legChase;chk();await chaser.jump(o,runner.p().x+(Math.random()<0.5?-50:50));chk();
    const rr=o;await runner.go({x:clampX(rr,runner.p().x+(Math.random()<0.5?-90:90)),y:rr.y,px:230});chk();await chaser.go({x:clampX(rr,runner.p().x-chaser.p().face*30),y:rr.y,px:260});}
   else{await legChase;chk();}
   chk();faceEach(chaser,runner);chaser.anim('duo-punch');sfx.tap();fxOn(runner.el(),'spark',400);runner.anim('duo-hit');emoteOn(chaser.el(),'burst',1100);await w8(650);chaser.anim('duo-cheer');runner.anim('duo-laugh');sfx.giggle();await w8(700);chaser=runner;}
  const top=rails().find(x=>x.kind==='top'&&x.i===r.i);if(top&&rail?.i!==top.i)await jumpTo(top,pos.x);}
 async function hideSeek(){
  const r=await meet(80);if(!r)return;const seeker=Math.random()<0.5?A.m:A.b,hider=seeker===A.m?A.b:A.m;
  seeker.anim('duo-cover');const hides=rails().filter(x=>x.kind==='behind');if(!hides.length)return;const spot=hides[Math.floor(Math.random()*hides.length)];
  const hx=spot.x1+Math.random()*(spot.x2-spot.x1);
  const tick=(async()=>{for(let k=0;k<5;k++){sfx.count();await wait(420);}})();
  hider.anim('duo-laugh');await w8(250);await hider.jump(spot,hx);chk();hider.anim('duo-hide');await tick;chk();
  seeker.anim('duo-search');sfx.peek();await w8(1200);
  const top=rails().find(x=>x.kind==='top'&&x.i===spot.i)||spot;const wrongX=clampX(top,hx+(Math.random()<0.5?-110:110));
  if(seeker.p().y!==top.y||Math.abs(seeker.p().x-wrongX)>10){if(rails().find(x=>x.kind==='top'&&x.i===spot.i)&&(seeker===A.m?rail?.i:bud.rail?.i)!==spot.i)await seeker.jump(top,wrongX);else await seeker.go({x:wrongX,y:top.y});}
  chk();seeker.anim('duo-search');sfx.peek();await w8(1000);await seeker.go({x:clampX(top,hx+(wrongX<hx?-30:30)),y:top.y});chk();seeker.face(hx>seeker.p().x?1:-1);seeker.anim('duo-peek');await w8(500);
  sfx.found();hider.anim('crouch');await w8(110);await hider.jump(top,hx);chk();hider.anim('duo-laugh');emoteOn(seeker.el(),'burst',1200);emoteOn(hider.el(),'heart',1200);seeker.anim('duo-cheer');sfx.giggle();await w8(1000);}
 async function ballGame(){
  const r=await meet(150);if(!r)return;const id=randomItem();const ball=flyer(id,'duo-ball');let from=Math.random()<0.5?A.m:A.b;
  let at=handOf(from,26);ball.style.transform=`translate3d(${at[0]}px,${at[1]}px,0)`;sfx.bounce();await w8(350);
  const passes=4+Math.floor(Math.random()*4);
  try{
   for(let i=0;i<passes;i++){const to=from===A.m?A.b:A.m;const kick=Math.random()<0.5;from.anim(kick?'duo-kick':'duo-header');sfx.kick();
    const tp=to.p();const dest=[tp.x+SIZE/2-11+tp.face*6,tp.y+(kick?SIZE*0.55:SIZE*0.1)-11];const ms=Math.max(380,700-i*45);
    setTimeout(()=>{to.anim(Math.random()<0.5?'duo-kick':'duo-header');},ms-180);
    await arcFly(ball,at,dest,{ms,arc:70-i*4,spin:720});chk();sfx.bounce();at=dest;from.anim('duo-guard');from=to;}
   // the last one gets away: two bounces and out
   const miss=from;miss.anim('duo-header');const dir=miss.p().face;const b1=[at[0]-dir*70,miss.p().y+SIZE-18];
   sfx.whoosh();await arcFly(ball,at,b1,{ms:420,arc:40});sfx.bounce();const b2=[b1[0]-dir*55,b1[1]];await arcFly(ball,b1,b2,{ms:320,arc:22});sfx.bounce();ball.classList.add('is-gone');
   miss.anim('shake');emoteOn(miss.el(),'spiral',1100);const win=miss===A.m?A.b:A.m;win.anim('duo-cheer');sfx.cheer();await w8(1100);
  }finally{setTimeout(()=>ball.remove(),400);}}
 // V199: best friends team up at the mixer — each throws an element into a slot; the app combines them (a real discovery)
 async function coop(){const r=await meet(120);if(!r)return;A.m.anim('duo-search');A.b.anim('duo-search');sfx.peek?.();await w8(900);
  let f=null;try{f=ctx.coopFind?.()||null;}catch{}
  if(!f){A.m.anim('duo-laugh');A.b.anim('duo-laugh');sfx.giggle?.();await w8(900);return;}
  emoteOn(sprite,'burst',1200);emoteOn(bud.sprite,'burst',1200);sfx.found?.();await w8(500);
  const lr=layerFront.getBoundingClientRect();const tgt=i=>{const el=$('slot'+i);if(!el)return null;const q=el.getBoundingClientRect();return [q.left-lr.left+q.width/2-11,q.top-lr.top+q.height/2-11];};
  const t0=tgt(0),t1=tgt(1);if(!t0||!t1)return;
  expr(sprite,'wow',900);expr(bud.sprite,'wow',900);
  const fa=flyer(f.a,'duo-throwable'),fb=flyer(f.b,'duo-throwable');const ha=handOf(A.m,10),hb=handOf(A.b,10);fa.style.transform=`translate3d(${ha[0]}px,${ha[1]}px,0)`;fb.style.transform=`translate3d(${hb[0]}px,${hb[1]}px,0)`;
  A.m.anim('carry');A.b.anim('carry');const up=(el,h)=>{el.style.transform=`translate3d(${h[0]}px,${h[1]-26}px,0)`;};up(fa,ha);up(fb,hb);await w8(900);
  A.m.anim('duo-windup');A.b.anim('duo-windup');await w8(380);A.m.anim('duo-throw');A.b.anim('duo-throw');sfx.whoosh?.();
  await Promise.all([arcFly(fa,ha,t0,{ms:700,arc:90}),arcFly(fb,hb,t1,{ms:760,arc:110})]);fa.remove();fb.remove();
  try{ctx.coopCraft?.(f);}catch{}
  faceEach(A.m,A.b);A.m.anim('celebrate');A.b.anim('celebrate');expr(sprite,'love',1400);expr(bud.sprite,'love',1400);sfx.cheer?.();await w8(1400);}
 // V199: sworn enemies — a real brawl; the loser is knocked out until the player taps it
 async function brawl(){const r=await meet(46);if(!r)return;sfx.fight?.();A.m.anim('stomp');A.b.anim('stomp');expr(sprite,'angry',5000);expr(bud.sprite,'angry',5000);await w8(900);A.m.anim('duo-guard');A.b.anim('duo-guard');await w8(300);
  let att=Math.random()<0.5?A.m:A.b;for(let i=0;i<6;i++){const def=att===A.m?A.b:A.m;att.anim(i%2?'duo-kick':'duo-punch');sfx.swish?.();await w8(150);def.anim('duo-hit');sfx.hit?.();fxOn(def.el(),'impact',400);await w8(260);att=def;}
  const loser=Math.random()<0.5?A.m:A.b,winner=loser===A.m?A.b:A.m;winner.anim('duo-charge');sfx.charge?.();await w8(420);winner.anim('duo-punch');sfx.hit?.();fxOn(loser.el(),'impact',600);
  const who=loser===A.m?'main':'bud';setKo(who,true);const lid=who==='main'?state.active:state.buddy;const lp=pet(lid);settleMood(lp);lp.mood=Math.max(0,lp.mood-10);lp.moodAt=now();
  winner.anim('taunt');expr(winner.el(),'smug',1500);await wait(1500);winner.anim('idle');try{toast(`${nameOf(metaById.get(lid))} was knocked out — tap it to revive it`,'repeat');}catch{}}
 const DUO_GAMES=[spar,throwing,tag,hideSeek,ballGame];
 const DUO_BY_REL={friends:[tag,hideSeek,ballGame,coop,coop,coop],neutral:[spar,throwing,tag,hideSeek,ballGame],rivals:[spar,spar,throwing,throwing,tag],nemesis:[brawl,brawl,spar,throwing]};
 async function duoPlay(kind=null){if(duoBusy||!duoActive()||!bud||bud.sprite.hidden||sleeping||petting)return false;
  duoBusy=true;busy=true;duoAbort=false;if(bud.cancel)bud.cancel();if(cancelMove)cancelMove();lastDuo=now();
  if(ko.main||ko.bud){duoBusy=false;busy=false;return false;}
  const pool=DUO_BY_REL[relation(state.active,state.buddy)]||DUO_GAMES;
  const game=kind&&kind!=='any'?[...DUO_GAMES,coop,brawl].find(g=>g.name===kind)||DUO_GAMES[0]:pool[Math.floor(Math.random()*pool.length)];
  try{await game();}catch(e){if(e?.message!=='duo-abort')console.warn('duo',e);}
  try{const rl=relation(state.active,state.buddy);if(!ko.main&&!ko.bud&&!duoAbort&&game!==coop){
    if(rl==='rivals'){const w=Math.random()<0.5?A.m:A.b,l=w===A.m?A.b:A.m;w.anim('taunt');expr(w.el(),'smug',1500);l.anim('stomp');expr(l.el(),'angry',1500);await wait(1500);}
    else if(rl==='friends'){A.m.anim('wave');A.b.anim('wave');expr(sprite,'happy',1200);expr(bud.sprite,'happy',1200);await wait(1200);}}}catch{}
  finally{if(!ko.main&&(sprite.dataset.anim?.startsWith('duo-')||sprite.dataset.anim==='tumble'||sprite.dataset.anim==='shake'))sprite.dataset.anim='idle';if(bud&&!ko.bud){bud.sprite.dataset.anim='idle';}
   // happy play time lifts both moods a little
   for(const id of [state.active,state.buddy]){if(!id)continue;const p=pet(id);settleMood(p);p.mood=Math.min(100,p.mood+3);p.moodAt=now();}save();
   layerFront?.querySelectorAll('.duo-flyer').forEach(f=>f.remove());duoBusy=false;busy=false;}
  return true;}

 // ---------- V136: accessories, market food, school skills, on-screen toys ----------
 const ACC=ctx.accessories||{};
 function applyWearSvg(svg,id){if(!svg)return;svg.querySelectorAll('[data-acc="wear"]').forEach(n=>n.remove());const w=state.pets[id]?.wear;if(!w)return;
  const bb=el=>{try{const b=el.getBBox();return b.width?b:null;}catch{return null;}};
  const head=svg.querySelector('[data-part="head"]')||svg.querySelector('[data-part="body"]'),body=svg.querySelector('[data-part="body"]')||head;
  // V146: halos, horns and other look extras are hidden while measuring, so a hat sits on the head, not on top of a halo
  const extras=[...svg.querySelectorAll('[data-acc="look"]')];extras.forEach(n=>n.style.display='none');const hb=head&&bb(head),bdb=body&&bb(body);extras.forEach(n=>n.style.display='');
  const put=(parent,html,before=false)=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-acc','wear');g.innerHTML=html;before?parent.insertBefore(g,parent.firstChild):parent.append(g);};
  for(const [slot,aid] of Object.entries(w)){const a=ACC[aid];if(!a)continue;
   if(a.slot==='head'&&hb)put(head,`<g transform="translate(${(hb.x+hb.width/2).toFixed(1)} ${(hb.y+hb.height*0.12).toFixed(1)})">${a.draw(hb.width)}</g>`);
   else if(a.slot==='face'&&hb){const el=svg.querySelector('[data-part="eye-l"]'),er=svg.querySelector('[data-part="eye-r"]');const l=el&&bb(el),r=er&&bb(er);const cx=l&&r?(l.x+l.width/2+r.x+r.width/2)/2:hb.x+hb.width/2,cy=l&&r?(l.y+l.height/2+r.y+r.height/2)/2:hb.y+hb.height*0.45;
    const sw=l&&r?Math.max(hb.width*0.6,Math.abs((r.x+r.width/2)-(l.x+l.width/2))*2.4):hb.width;put(head,`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">${a.draw(sw)}</g>`);}
   else if(a.slot==='neck'&&bdb){const y=hb?Math.max(bdb.y,hb.y+hb.height*0.88):bdb.y;put(a.back?svg.querySelector('[data-part="body"]')||svg:body,`<g transform="translate(${(bdb.x+bdb.width/2).toFixed(1)} ${y.toFixed(1)})">${a.draw(bdb.width*0.9)}</g>`,!!a.back);}}}
 function setWear(id,aid){const a=ACC[aid];if(!isDiscovered(id))return false;const p=pet(id);p.wear=p.wear||{};if(!aid)return false;
  if(a){if(p.wear[a.slot]===aid)delete p.wear[a.slot];else p.wear[a.slot]=aid;}save();rewear();refreshViews();return true;}
 function takeOff(id,slot){const p=pet(id);if(p.wear){if(slot)delete p.wear[slot];else p.wear={};}save();rewear();refreshViews();}
 /** Market food for the companion on screen. Returns a short line for the toast. */
 function marketFeed(item){const meta=activeMeta();if(!meta)return null;const p=pet(meta.id);settleMood(p);let line='';
  if(item.stat){const r=gainStat(p,meta,item.stat,Math.round(item.amount*growth(meta.id,item.stat)));line=`${STAT_LABEL[item.stat]} +${item.amount} XP${r.levelUps?` · Lv up!`:''}`;}
  if(item.mood){p.mood=Math.min(100,p.mood+item.mood);p.moodAt=now();p.belly=Math.min(100,(p.belly||0)+30);p.bellyAt=now();line='Mood +30 · Belly +30';}
  if(item.look){const lk=lookAfterMeal(p.look,item.look,'','',3);p.look=lk.look;line=lk.notes[0]||'No change';}
  save();rewear();if(sprite&&!sprite.hidden){sfx.happy();fx('stars',1600);emote('heart',1300);}refreshViews();return {name:nameOf(meta),line};}
 // school skills (performed now and then on the main screen)
 const skillsOf=id=>Object.keys(state.pets[id]?.skills||{});
 function learn(id,skill,level=0){const p=pet(id);p.skills=p.skills||{};p.skills[skill]=Math.max(p.skills[skill]||0,level+1);save();refreshViews();}
 const skillLevel=(id,skill)=>Math.max(0,(state.pets[id]?.skills?.[skill]||1)-1);
 let lastSkill=0;
 async function performSkill(skill){if(reducedMotion()||!sprite)return;busy=true;const lv=skillLevel(state.active,skill);const f=sprite.querySelector('.companion-fx');const extra=[];const add=(html,cls)=>{const el=document.createElement('span');el.className='sk-fx '+cls;el.innerHTML=html;f.append(el);extra.push(el);return el;};
  try{
   if(skill==='sing'){sprite.dataset.anim='sk-sing';for(let i=0;i<3+lv*2;i++){const n=add(i%3===2&&lv>=2?'♫':'♪','sk-note');n.style.setProperty('--i',i);}sfx.tune?.();if(lv>=3)setTimeout(()=>sfx.tune?.(),1500);await wait(2200+lv*400);}
   else if(skill==='dance'){sprite.dataset.anim='sk-dance';for(let k=0;k<6+lv*2;k++){setTimeout(()=>sfx.count?.(),k*330);}await wait(2100);for(let t=0;t<Math.max(1,lv);t++){sprite.dataset.anim='quirk-twirl';await wait(1100);sprite.dataset.anim='sk-dance';await wait(lv>=2?600:0);}}
   else if(skill==='draw'){const easel=add(`<svg viewBox="0 0 40 46"><path d="M8 44 18 6M32 44 22 6M10 34h20" stroke="#8a6a4a" stroke-width="2.4" stroke-linecap="round"/><rect x="6" y="4" width="28" height="24" rx="2" fill="#fffaf0" stroke="#4a4a5a" stroke-width="1.6"/><path class="sk-doodle" d="${['M10 22c4-8 8-8 10-2s6 6 10-4','M12 20l6-10 6 10M14 16h8','M20 10a6 6 0 1 0 .1 0M10 24h20','M10 14c6 0 6 10 12 10s4-12 8-12'][Math.floor(Math.random()*4)]}" fill="none" stroke="${['#e0675a','#5aaed2','#7cc463','#9b7fc4'][Math.floor(Math.random()*4)]}" stroke-width="2" stroke-linecap="round"/></svg>`,'sk-easel');sprite.dataset.anim='sk-draw';await wait(2600);easel.classList.add('is-done');sfx.happy();await wait(900);}
   else if(skill==='drums'){add(`<svg viewBox="0 0 40 30"><ellipse cx="20" cy="9" rx="16" ry="5" fill="#fffaf0" stroke="#4a4a5a" stroke-width="1.6"/><path d="M4 9v12c0 3 7 6 16 6s16-3 16-6V9" fill="#e0675a" stroke="#4a4a5a" stroke-width="1.6"/><path d="M8 12l6 12M32 12l-6 12" stroke="#f3d266" stroke-width="1.5"/></svg>`,'sk-drum');sprite.dataset.anim='sk-drums';for(let k=0;k<10+lv*4;k++)setTimeout(()=>sfx.kick?.(),k*(190-lv*15));await wait(2100+lv*350);}
   else if(skill==='juggle'){const ids=Array.from({length:Math.min(5,2+lv)},()=>ctx.randomElement?.()).filter(Boolean);ids.forEach((eid,i)=>{const b=add(staticArt(byId.get(eid))||'','sk-ball');b.style.setProperty('--i',i);});sprite.dataset.anim='sk-juggle';for(let k=0;k<6;k++)setTimeout(()=>sfx.tap?.(),k*330);await wait(2300);}
   else if(skill==='magic'){add(`<svg viewBox="0 0 40 34"><ellipse cx="20" cy="30" rx="17" ry="4" fill="#3b3b48"/><rect x="9" y="8" width="22" height="22" rx="2" fill="#3b3b48" stroke="#4a4a5a" stroke-width="1.4"/><rect x="9" y="22" width="22" height="4" fill="#c8303a"/></svg>`,'sk-hat');sprite.dataset.anim='sk-magic';await wait(900);for(let k=0;k<1+Math.floor(lv/2);k++){const eid=ctx.randomElement?.();const pop=add(eid?staticArt(byId.get(eid)):'✦','sk-pop');pop.style.animationDelay=(k*0.5)+'s';}sfx.found?.();fx('stars',1400);await wait(1500+lv*300);}
  }catch(e){console.warn('skill',e);}finally{extra.forEach(e=>e.remove());sprite.dataset.anim='idle';busy=false;}}
 // on-screen toy
 let toyEl=null,lastToy=0;
 function toyRail(){const cr=rect('#viewPlay:not([hidden]) .craft-card');if(!cr)return null;return rails().find(r=>r.kind==='top'&&Math.abs(r.ref.top-cr.top)<1&&Math.abs(r.ref.left-cr.left)<1)||null;}
 function placeToy(){const t=ctx.toy?.();if(!t||reducedMotion()){if(toyEl){toyEl.remove();toyEl=null;}return null;}ensureLayer();
  if(!toyEl){toyEl=document.createElement('span');toyEl.className='screen-toy';layerFront.append(toyEl);}
  if(toyEl.dataset.toy!==t){toyEl.dataset.toy=t;toyEl.innerHTML=TOY_SVG[t]||'';}
  const r=toyRail();if(!r){toyEl.hidden=true;return null;}toyEl.hidden=false;const x=r.x2+SIZE-30,y=r.y+SIZE-22;toyEl.style.transform=`translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,0)`;toyEl._x=x;toyEl._y=y;toyEl._r=r;return toyEl;}
 const TOY_SVG={ball:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fffaf0" stroke="#4a4a5a" stroke-width="1.8"/><path d="M12 7l4 3-1.5 4.5h-5L8 10Z" fill="#4a4a5a"/></svg>',top:'<svg viewBox="0 0 24 24"><path d="M12 3v3M4 10q8-6 16 0l-8 11Z" fill="#9b7fc4" stroke="#4a4a5a" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 11q6-3 12 0" stroke="#f3d266" stroke-width="1.6" fill="none"/></svg>',drum:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="9" ry="3.2" fill="#fffaf0" stroke="#4a4a5a" stroke-width="1.6"/><path d="M3 8v8c0 2 4 4 9 4s9-2 9-4V8" fill="#e0675a" stroke="#4a4a5a" stroke-width="1.6"/></svg>'};
 async function playToy(){const t=placeToy();if(!t||!rail||rail.kind!=='top'||t._r.i!==rail.i)return false;busy=true;
  try{const kind=t.dataset.toy;await walkTo(clampX(rail,t._x-SIZE+6),rail.y);pos.face=1;sprite.dataset.face='right';
   if(kind==='ball'){sprite.dataset.anim='duo-kick';sfx.kick?.();await wait(180);t.classList.remove('is-roll');void t.offsetWidth;t.classList.add('is-roll');await wait(1300);t.classList.remove('is-roll');sprite.dataset.anim='duo-cheer';sfx.giggle?.();await wait(700);}
   else if(kind==='top'){sprite.dataset.anim='point';await wait(250);t.classList.add('is-spin');sfx.swish?.();await wait(1800);t.classList.remove('is-spin');sprite.dataset.anim='duo-laugh';await wait(700);}
   else{sprite.dataset.anim='sk-drums';t.classList.add('is-beat');for(let k=0;k<8;k++)setTimeout(()=>sfx.kick?.(),k*220);await wait(1800);t.classList.remove('is-beat');}
  }finally{sprite.dataset.anim='idle';busy=false;}return true;}
 /** How complete a themed look is (0..1): average weight of the theme's traits in their spots. */
 function themeCompletion(id,key){const th=LOOK_THEMES.find(([k])=>k===key);if(!th)return 0;const N=normLook(state.pets[id]?.look);const slots=['head','back','tail','aura'].filter(sl=>th[2][sl]);if(!slots.length)return 0;return slots.reduce((n,sl)=>n+(N.mix[sl][th[2][sl]]||0),0)/slots.length;}

 // ---------- V154: visiting elements — some elements in the list come out and play with the companion ----------
 // Each rule: name pattern → scene. Stats and School levels change how well the companion copes.
 const VISITORS=[
  ['vampire',/\b(dracula|vampire|nosferatu|bat)\b/],['mask',/\bmask\b/],['spider',/\b(spider|tarantula|web)\b/],
  ['ride',/\b(car|bus|truck|kart|tractor|scooter|motorbike|motorcycle|skateboard|bicycle|bike|taxi|jeep|van|wagon|tank|race car|go-kart)\b/],
  ['swim',/\b(pool|lake|pond|puddle|ocean|sea|river|bathtub|fountain)\b/],['float',/\b(balloon|kite|broom|umbrella|parachute|cloud)\b/],
  ['music',/\b(guitar|drum|piano|trumpet|violin|microphone|radio|harp|flute|saxophone|jukebox|speaker)\b/],['boo',/\b(ghost|spirit|skeleton|zombie|mummy|phantom)\b/],
  ['buzz',/\b(bee|wasp|mosquito|hornet|fly swarm)\b/],['kick',/\b(ball|football|soccer|basketball|beach ball)\b/],
  // V155: more visitors
  ['fire',/\b(campfire|bonfire|flame|torch|fireplace|lava|volcano)\b/],['snow',/\b(snow|snowman|ice|igloo|snowflake|glacier|frost|icicle)\b/],
  ['tag',/\b(dog|puppy|cat|kitten|mouse|rabbit|bunny|hamster|squirrel)\b/],['read',/\b(book|library|newspaper|scroll|map|letter|diary|comic)\b/],
  ['party',/\b(cake|party|birthday|gift|present|confetti|pinata)\b/],['rain',/\b(rain|storm|thunder|lightning|tornado|hurricane)\b/],
  ['photo',/\b(camera|photo|selfie|polaroid)\b/],['ufo',/\b(ufo|alien|flying saucer|spaceship)\b/],['magnet',/\bmagnet\b/],
  ['firework',/\b(firework|fireworks|rocket|bomb|dynamite|cannon)\b/],['treasure',/\b(treasure|chest|coin|gem|diamond|jewel|crown)\b/],
  ['bubble',/\b(bubble|bubbles|soap|shampoo)\b/],['mirror',/\b(mirror|reflection)\b/],['bounce',/\b(trampoline|spring|jelly|pogo)\b/],
  ['duel',/\b(sword|knight|samurai|ninja|shield|armor|armour|pirate)\b/],['paint',/\b(paint|brush|crayon|easel|palette|pencil)\b/],
  ['stars',/\b(telescope|binoculars|moon|planet|comet|galaxy|constellation)\b/],['sniff',/\b(flower|rose|tulip|sunflower|daisy|lily|bouquet|pepper)\b/],
  ['alarm',/\b(clock|alarm|bell|siren|whistle)\b/],['magic',/\b(wand|potion|spellbook|crystal ball|magician|wizard)\b/],
  // V156: 20 more, plus duo-only toys
  ['seesaw',/\b(seesaw|see-saw|teeter)\b/],['pillow',/\b(pillow|cushion|feather|mattress)\b/],['board',/\b(chess|checkers|board game|cards|domino|dominoes)\b/],['picnic',/\b(picnic|blanket|basket|lunchbox)\b/],['swing',/\b(swing|hammock|rope swing)\b/],
  ['hat',/\b(hat|cap|helmet|beret|beanie|sombrero|tiara)\b/],['shades',/\b(sunglasses|glasses|goggles|monocle)\b/],['slip',/\b(banana|peel|oil|puddle of)\b/],['fish',/\b(fish|shark|octopus|whale|dolphin|squid|jellyfish)\b/],['pinch',/\b(crab|lobster|scorpion)\b/],
  ['slow',/\b(snail|turtle|tortoise|sloth|slug)\b/],['chase',/\b(butterfly|bird|dragonfly|firefly|ladybug|moth|parrot)\b/],['ladder',/\b(ladder|stairs|staircase|step stool)\b/],['rope',/\b(rope|tightrope|wire|cable)\b/],['wind',/\b(fan|windmill|propeller|wind|breeze)\b/],
  ['idea',/\b(lamp|light ?bulb|bulb|candle|lantern|idea)\b/],['mimic',/\b(robot|android|cyborg|clone|parrot)\b/],['roar',/\b(dinosaur|dragon|monster|t-rex|lion|bear|yeti)\b/],['build',/\b(hammer|axe|wrench|tool|tools|saw|screwdriver|brick|bricks)\b/],['puzzle',/\b(puzzle|rubik|cube|riddle|maze)\b/],
  ['plant',/\b(seed|sapling|plant|shovel|watering can|sprout|tree)\b/],['phone',/\b(phone|telephone|smartphone|walkie)\b/],['archery',/\b(bow and arrow|arrow|target|dart|darts|slingshot)\b/],['dice',/\b(dice|die|casino|slot machine|lottery)\b/],['spooky',/\b(pumpkin|halloween|candy|jack-o|witch)\b/]];
 // V156: scenes only possible when two companions are on screen
 const DUO_ONLY=new Set(['seesaw','pillow','board','picnic','swing']);
 let lastVisit=0,actorEl=null;
 const visitorOf=item=>{const t=' '+String(uiName(item)||item?.name||'').toLowerCase()+' ';const v=VISITORS.find(([,re])=>re.test(t));return v?v[0]:null;};
 const statLv=(id,k)=>state.pets[id]?.stats?.[k]?.level||0;
 function actorAt(item,x,y){actorEl?.remove();const a=document.createElement('span');a.className='screen-visitor';a.innerHTML=staticArt(item)||'';layerFront.append(a);actorEl=a;a._x=x;a._y=y;a.style.transform=`translate3d(${x}px,${y}px,0)`;return a;}
 function actorMove(a,x,y,ms,arc=0){if(!a)return wait(ms);const x0=a._x,y0=a._y;a._x=x;a._y=y;const frames=[];for(let k=0;k<=8;k++){const t=k/8;frames.push({transform:`translate3d(${x0+(x-x0)*t}px,${y0+(y-y0)*t-Math.sin(Math.PI*t)*arc}px,0)`});}
  const an=a.animate(frames,{duration:ms,easing:'ease-in-out',fill:'forwards'});return new Promise(r=>{an.onfinish=()=>{a.style.transform=`translate3d(${x}px,${y}px,0)`;an.cancel();r();};});}
 // V156: duo scenes — both companions on screen play with the visitor together (A.m = main, A.b = buddy)
 const DUO_SCENES={
  ride:async({a,item,y})=>{const m=A.m,b=A.b;await actorMove(a,pos.x+6,rail.y+SIZE-34,600,30);a.style.visibility='hidden';const car=fx('vehicle',60000);car.innerHTML=staticArt(item)||'';
   await b.go({x:pos.x-14,y:rail.y-26,arc:30,ms:500,anim:'jump'});let on=true;const glue=()=>{if(!on)return;bPlace(pos.x-16,pos.y-6);requestAnimationFrame(glue);};
   await travel({x:pos.x,y:rail.y-20,arc:20,ms:300,anim:'jump'});requestAnimationFrame(glue);b.anim('duo-cheer');
   for(const tx of [rail.x2,rail.x1,(rail.x1+rail.x2)/2]){m.face(tx>pos.x?1:-1);b.face(tx>pos.x?1:-1);await travel({x:clampX(rail,tx),y:rail.y-20,ms:1000,anim:'idle'});}
   on=false;car.remove();a.style.visibility='';a._x=pos.x;a._y=rail.y+SIZE-34;a.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;await Promise.all([travel({x:pos.x,y:rail.y,arc:20,ms:350,anim:'jump'}),b.go({x:clampX(rail,pos.x-60),y:rail.y,arc:24,ms:450,anim:'jump'})]);m.anim('duo-cheer');b.anim('duo-cheer');emoteOn(bud.sprite,'heart',1200);await wait(800);},
  vampire:async({a,y})=>{const b=A.b;await actorMove(a,bud.pos.x+20,y-30,700,50);b.anim('duo-hide');emoteOn(bud.sprite,'spiral',1400);await wait(500);
   await travel({x:clampX(rail,bud.pos.x-30),y:rail.y,ms:500,anim:'walk'});A.m.face(1);for(let k=0;k<2;k++){A.m.anim('duo-punch');fx('stars',400);await actorMove(a,a._x+30,y-40,250,10);await wait(200);}await actorMove(a,a._x+120,y-80,600,40);A.m.anim('duo-cheer');b.anim('duo-cheer');emoteOn(bud.sprite,'heart',1200);await wait(800);},
  kick:async({a,y})=>{const L=rail.x1,R=rail.x2;await Promise.all([travel({x:clampX(rail,L+20),y:rail.y,ms:600}),A.b.go({x:clampX(rail,R-20),y:rail.y,ms:600})]);A.m.face(1);A.b.face(-1);await actorMove(a,pos.x+40,y+14,500,30);
   for(let k=0;k<4;k++){const toB=k%2===0;(toB?A.m:A.b).anim('duo-kick');sfx.kick?.();await actorMove(a,toB?bud.pos.x-10:pos.x+40,y+14,650,50);}A.m.anim('duo-cheer');A.b.anim('duo-cheer');await wait(700);},
  music:async({a,y})=>{await actorMove(a,(pos.x+bud.pos.x)/2+10,y-10,700,40);a.classList.add('is-beat');for(let k=0;k<8;k++)setTimeout(()=>sfx.count?.(),k*330);A.m.anim('sk-dance');A.b.anim('sk-dance');await wait(1800);A.m.anim('quirk-twirl');A.b.anim('quirk-twirl');await wait(1000);A.m.anim('duo-bow');A.b.anim('duo-bow');a.classList.remove('is-beat');await wait(700);},
  party:async({a,y})=>{await actorMove(a,(pos.x+bud.pos.x)/2+10,y,700,50);fx('confetti',1800);A.m.anim('duo-cheer');A.b.anim('duo-cheer');await wait(800);A.m.anim('quirk-twirl');A.b.anim('quirk-twirl');sfx.giggle?.();await wait(1000);say('Party for two!');},
  photo:async({a,y})=>{await actorMove(a,clampX(rail,Math.min(pos.x,bud.pos.x)-10),y-30,700,40);A.m.anim('duo-bow');A.b.anim('duo-bow');await wait(400);for(let k=0;k<2;k++){a.classList.add('is-flash');fx('flash',300);await wait(350);a.classList.remove('is-flash');A.m.anim(k?'duo-cheer':'point');A.b.anim(k?'duo-laugh':'duo-cheer');await wait(500);}say('Best friends selfie!');},
  snow:async({a,y})=>{a.style.visibility='hidden';for(let k=0;k<4;k++){const fromM=k%2===0;const src=fromM?pos:bud.pos,dst=fromM?bud.pos:pos;(fromM?A.m:A.b).anim('duo-throw');const ball=document.createElement('i');ball.className='screen-snowball';layerFront.append(ball);
    const an=ball.animate([{transform:`translate3d(${src.x+30}px,${src.y+20}px,0)`},{transform:`translate3d(${(src.x+dst.x)/2+30}px,${src.y-30}px,0)`},{transform:`translate3d(${dst.x+20}px,${dst.y+24}px,0)`}],{duration:520,fill:'forwards'});await new Promise(r=>an.onfinish=r);ball.remove();(fromM?A.b:A.m).anim('shake');await wait(350);}
   A.m.anim('duo-laugh');A.b.anim('duo-laugh');say('Snowball fight!');a.style.visibility='';await wait(700);},
  boo:async({a,y})=>{await actorMove(a,clampX(rail,(pos.x+bud.pos.x)/2),y-40,800,20);a.classList.add('is-boo');await wait(300);A.m.anim('jump');A.b.anim('jump');emote('spiral',1200);emoteOn(bud.sprite,'spiral',1200);
   await Promise.all([travel({x:clampX(rail,bud.pos.x-30),y:rail.y,ms:350,anim:'walk'})]);A.m.anim('duo-cover');A.b.anim('duo-cover');await wait(1100);a.classList.remove('is-boo');say('Hold me!');},
  bubble:async({a,y})=>{await actorMove(a,clampX(rail,pos.x+20),y-30,700,40);for(let k=0;k<4;k++){const who=k%2?A.b:A.m,wp=k%2?bud.pos:pos;const bx=clampX(rail,wp.x+(Math.random()*60-30));const bb=document.createElement('i');bb.className='screen-bubble';bb.style.transform=`translate3d(${bx+20}px,${rail.y-10}px,0)`;layerFront.append(bb);setTimeout(()=>bb.remove(),1800);
    await who.go({x:bx,y:rail.y,ms:400});who.anim('jump');await who.go({x:bx,y:rail.y-40,ms:250,anim:'jump'});bb.classList.add('is-pop');await who.go({x:bx,y:rail.y,ms:240,anim:'land'});}A.m.anim('duo-laugh');A.b.anim('duo-laugh');await wait(600);},
  tag:async({a,y})=>{const L=rail.x1,R=rail.x2;await actorMove(a,clampX(rail,pos.x+40),y+12,600,30);for(let k=0;k<3;k++){const tx=k%2?L+10:R-10;await Promise.all([actorMove(a,tx,y+12,800,24),travel({x:clampX(rail,tx+(k%2?20:-40)),y:rail.y,ms:850,anim:'walk'}),A.b.go({x:clampX(rail,tx+(k%2?60:-80)),y:rail.y,ms:950})]);}A.m.anim('duo-cheer');A.b.anim('duo-cheer');say('Teamwork!');await wait(600);},
  // duo-only toys
  seesaw:async({a,y})=>{const cx=clampX(rail,(pos.x+bud.pos.x)/2);a.style.visibility='hidden';const sw=document.createElement('i');sw.className='screen-seesaw';sw.style.transform=`translate3d(${cx-20}px,${rail.y+SIZE-18}px,0)`;layerFront.append(sw);
   await Promise.all([travel({x:cx-40,y:rail.y,ms:500}),A.b.go({x:cx+60,y:rail.y,ms:500})]);for(let k=0;k<4;k++){const up=k%2===0;sw.classList.toggle('is-tilt',up);await Promise.all([travel({x:cx-40,y:rail.y-(up?30:0),ms:420,anim:up?'jump':'land'}),A.b.go({x:cx+60,y:rail.y-(up?0:30),ms:420,anim:up?'land':'jump'})]);}
   sw.remove();A.m.anim('duo-laugh');A.b.anim('duo-laugh');a.style.visibility='';say('Up and down!');await wait(600);},
  pillow:async({a,y})=>{a.style.visibility='hidden';await Promise.all([travel({x:clampX(rail,bud.pos.x-50),y:rail.y,ms:500})]);A.m.face(1);A.b.face(-1);for(let k=0;k<4;k++){const hitB=k%2===0;(hitB?A.m:A.b).anim('duo-punch');const f=fx('feathers',700);if(!hitB)f.remove();if(hitB)emoteOn(bud.sprite,'spiral',500);(hitB?A.b:A.m).anim('shake');await wait(500);}
   A.m.anim('duo-laugh');A.b.anim('duo-laugh');say('Pillow fight!');a.style.visibility='';await wait(700);},
  board:async({a,y})=>{await actorMove(a,clampX(rail,(pos.x+bud.pos.x)/2),y+12,700,30);for(let k=0;k<3;k++){A.m.anim('point');await wait(500);A.b.anim('point');await wait(500);}const win=Math.random()<0.5;(win?A.m:A.b).anim('duo-cheer');(win?A.b:A.m).anim('shake');say(win?'Checkmate!':'Lost this round…');await wait(1000);},
  picnic:async({a,item,y})=>{const cx=clampX(rail,(pos.x+bud.pos.x)/2);await actorMove(a,cx+10,y+16,700,30);a.classList.add('is-blanket');await Promise.all([travel({x:cx-34,y:rail.y,ms:400}),A.b.go({x:cx+44,y:rail.y,ms:400})]);A.m.face(1);A.b.face(-1);A.m.anim('hold-eat');A.b.anim('hold-eat');await wait(1600);
   A.m.anim('duo-laugh');A.b.anim('duo-laugh');emote('heart',1200);emoteOn(bud.sprite,'heart',1200);say('Picnic time!');await wait(800);a.classList.remove('is-blanket');},
  swing:async({a,y})=>{const cx=clampX(rail,(pos.x+bud.pos.x)/2);await actorMove(a,cx,rail.y-30,700,20);a.classList.add('is-swing');for(let k=0;k<2;k++){for(const who of [A.m,A.b]){const wp=who===A.m?pos:bud.pos;await who.go({x:cx,y:rail.y-20,arc:20,ms:400,anim:'jump'});await wait(700);await who.go({x:clampX(rail,cx+(who===A.m?-50:50)),y:rail.y,arc:20,ms:400,anim:'jump'});}}
   a.classList.remove('is-swing');A.m.anim('duo-cheer');A.b.anim('duo-cheer');say('Your turn!');await wait(600);}
 };
 async function visitorScene(){
  const meta=activeMeta();if(!meta||!rail||rail.kind!=='top'||reducedMotion())return false;
  const chips=[...document.querySelectorAll('#viewPlay:not([hidden]) .element-chip')].filter(c=>{const r=c.getBoundingClientRect();return r.top>90&&r.bottom<window.innerHeight-70;});
  const duo=duoActive()&&bud&&!bud.sprite.hidden&&!duoBusy;
  const pool=chips.map(c=>({c,item:byId.get(c.dataset.id)})).filter(o=>{const k=o.item&&visitorOf(o.item);return k&&(duo||!DUO_ONLY.has(k));});if(!pool.length)return false;
  const {c,item}=pool[Math.floor(Math.random()*pool.length)],kind=visitorOf(item),id=meta.id;
  const cr=c.querySelector('.chip-art')?.getBoundingClientRect()||c.getBoundingClientRect();const home={x:cr.left+cr.width/2-18,y:cr.top+cr.height/2-18};
  busy=true;const art=c.querySelector('.chip-art');art?.classList.add('is-away');
  const a=actorAt(item,home.x,home.y);const y=rail.y+SIZE-36,L=rail.x1,R=rail.x2,mid=(L+R)/2;
  const say=(t,ms=1600)=>{try{showNoteWindow(meta,[t]);}catch{}};
  let duoNow=false;
  try{
   if(duo&&(DUO_ONLY.has(kind)||DUO_SCENES[kind])&&(DUO_ONLY.has(kind)||Math.random()<0.6)){duoNow=true;duoBusy=true;if(bud.cancel)bud.cancel();
    const r=await meet(70);if(r){await DUO_SCENES[kind]({a,item,id,y,L,R,mid,say,home});}
   }
   else if(kind==='vampire'){await actorMove(a,clampX(rail,pos.x+60),y-30,700,60);emote('spiral',1400);sfx.refuse?.();
    const far=pos.x-L>R-pos.x?L:R;sprite.dataset.anim='walk';const run=travel({x:far,y:rail.y,ms:900});await Promise.all([run,actorMove(a,far+(far===L?40:-40),y-26,1000,24)]);
    sprite.dataset.anim='duo-cover';await actorMove(a,pos.x+12,y-34,350,10);fx('stars',900);await wait(500);
    const back=far===L?R:L;sprite.dataset.anim='walk';await Promise.all([travel({x:back,y:rail.y,ms:1100}),actorMove(a,back+(back===L?50:-50),y-30,1250,30)]);sprite.dataset.anim='duo-laugh';emote('heart',1200);await wait(600);}
   else if(kind==='mask'){await actorMove(a,pos.x+12,y-6,700,70);sprite.dataset.anim='grab';await wait(400);a.classList.add('is-on-face');await actorMove(a,pos.x+11,rail.y+10,250,0);sprite.dataset.anim='duo-laugh';sfx.giggle?.();await wait(1500);
    sprite.dataset.anim='duo-throw';a.classList.remove('is-on-face');await actorMove(a,pos.x+(pos.x>mid?-140:140),y+10,700,90);await wait(250);}
   else if(kind==='spider'){await actorMove(a,pos.x+12,rail.y-70,700,30);a.classList.add('has-thread');await wait(300);const web=fx('web',3200);
    const esc=Math.max(900,2600-statLv(id,'power')*14);sprite.dataset.anim='refuse';emote('spiral',esc);await wait(esc);web.remove();sprite.dataset.anim='duo-cheer';say(statLv(id,'power')>=40?'Broke free in a second!':'Finally free!');await wait(600);a.classList.remove('has-thread');}
   else if(kind==='ride'){const lv=statLv(id,'run');await actorMove(a,pos.x+6,rail.y+SIZE-34,700,40);sprite.dataset.anim='jump';await travel({x:pos.x,y:rail.y-20,arc:30,ms:380,anim:'jump'});
    // the vehicle becomes part of the companion while it drives (so they always move together)
    a.style.visibility='hidden';const car=fx('vehicle',60000);car.innerHTML=staticArt(item)||'';const good=lv>=35,ms=good?900:1500;car.classList.toggle('is-wobble',!good);sprite.dataset.anim='idle';
    for(const tx of [R,L,clampX(rail,mid)]){pos.face=tx>pos.x?1:-1;sprite.dataset.face=pos.face>0?'right':'left';await travel({x:tx,y:rail.y-20,ms,anim:'idle'});}
    car.remove();a._x=pos.x+6;a._y=rail.y+SIZE-34;a.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;a.style.visibility='';await travel({x:pos.x,y:rail.y,arc:24,ms:360,anim:'jump'});if(good){sprite.dataset.anim='duo-cheer';say('Smooth driver!');}else{fx('stars',900);emote('spiral',1200);say('Bumpy ride… Run training helps');}await wait(800);}
   else if(kind==='swim'){const lv=statLv(id,'swim');await actorMove(a,clampX(rail,pos.x),y+20,700,40);a.classList.add('is-puddle');sprite.dataset.anim='jump';await travel({x:pos.x,y:rail.y+6,arc:40,ms:420,anim:'jump'});
    const good=lv>=35;for(let k=0;k<(good?3:2);k++){sprite.dataset.anim=good?'hopwalk':'refuse';fx('splash',700);await wait(good?650:900);}await travel({x:pos.x,y:rail.y,arc:30,ms:380,anim:'jump'});say(good?'Graceful laps!':'Lots of splashing… Swim training helps');sprite.dataset.anim=good?'duo-cheer':'idle';await wait(700);a.classList.remove('is-puddle');}
   else if(kind==='float'){const lv=statLv(id,'fly');await actorMove(a,pos.x+10,rail.y-34,700,40);sprite.dataset.anim='grab';await wait(300);const up=Math.min(170,50+lv*1.3);
    a.style.visibility='hidden';const bal=fx('balloon',60000);bal.innerHTML=staticArt(item)||'';bal.classList.toggle('is-wobble',lv<35);sprite.dataset.anim='fly';await travel({x:pos.x,y:rail.y-up,ms:1400,anim:'fly'});await wait(700);await travel({x:pos.x,y:rail.y,ms:1100,anim:'fly'});
    bal.remove();a._x=pos.x+10;a._y=rail.y-34;a.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;a.style.visibility='';sprite.dataset.anim='land';say(lv>=35?'Floated up high!':'Wobbly flight… Fly training helps');await wait(300);}
   else if(kind==='music'){const lv=skillsOf(id).includes('dance')?skillLevel(id,'dance')+1:0;await actorMove(a,clampX(rail,pos.x+50),y,700,40);a.classList.add('is-beat');
    sprite.dataset.anim='sk-dance';for(let k=0;k<6+lv*2;k++)setTimeout(()=>sfx.count?.(),k*330);await wait(1800);for(let t=0;t<lv;t++){sprite.dataset.anim='quirk-twirl';await wait(900);}sprite.dataset.anim='duo-cheer';await wait(500);a.classList.remove('is-beat');}
   else if(kind==='boo'){await actorMove(a,clampX(rail,pos.x+30),y-36,900,20);a.classList.add('is-boo');await wait(250);sprite.dataset.anim='jump';emote('spiral',1400);sfx.refuse?.();await travel({x:pos.x,y:rail.y-50,arc:0,ms:220});await travel({x:pos.x,y:rail.y,ms:240});sprite.dataset.anim='duo-hide';await wait(1100);sprite.dataset.anim='duo-peek';await wait(600);a.classList.remove('is-boo');}
   else if(kind==='buzz'){for(let k=0;k<3;k++){await actorMove(a,pos.x+(k%2?50:-30),y-30-k*6,500,20);}const far=pos.x-L>R-pos.x?L:R;sprite.dataset.anim='walk';await Promise.all([travel({x:far,y:rail.y,ms:800}),actorMove(a,far,y-34,850,30)]);fx('stars',700);emote('spiral',1000);await wait(500);}
   else if(kind==='kick'){await actorMove(a,clampX(rail,pos.x+40),y+14,700,50);await walkTo(clampX(rail,a._x-SIZE+20),rail.y);sprite.dataset.anim='duo-kick';sfx.kick?.();await wait(180);await actorMove(a,a._x+(a._x>mid?-160:160),y-60,700,80);sprite.dataset.anim='duo-cheer';await wait(500);}
   else if(kind==='fire'){await actorMove(a,clampX(rail,pos.x+46),y+10,700,40);a.classList.add('is-flicker');sprite.dataset.anim='jump';emote('spiral',900);await travel({x:clampX(rail,pos.x-30),y:rail.y,arc:30,ms:380,anim:'jump'});await wait(400);
    await walkTo(clampX(rail,a._x-SIZE+6),rail.y);sprite.dataset.anim='idle';fx('steam',1800);say('Nice and warm');emote('heart',1400);await wait(1800);a.classList.remove('is-flicker');}
   else if(kind==='snow'){await actorMove(a,clampX(rail,pos.x+30),y+12,700,40);sprite.dataset.anim='walk';await walkTo(clampX(rail,a._x-10),rail.y);sprite.dataset.anim='bellyslide';const far=pos.x-L>R-pos.x?L:R;await travel({x:far,y:rail.y,ms:900,anim:'bellyslide'});
    sprite.dataset.anim='shake';fx('frost',1400);say(statLv(id,'stamina')>=35?'Brr… but fine!':'Brrr! So cold…');await wait(1300);}
   else if(kind==='tag'){const lv=statLv(id,'run');await actorMove(a,clampX(rail,pos.x+50),y+12,700,40);for(let k=0;k<3;k++){const tx=k%2?L+10:R-10;sprite.dataset.anim='walk';await Promise.all([actorMove(a,tx+(k%2?-6:6),y+12,lv>=35?700:900,26),travel({x:clampX(rail,tx+(k%2?20:-40)),y:rail.y,ms:lv>=35?720:1000,anim:'walk'})]);}
    sprite.dataset.anim=lv>=35?'duo-cheer':'duo-laugh';say(lv>=35?'Caught it!':'So fast… Run training helps');await wait(700);}
   else if(kind==='read'){await actorMove(a,pos.x+14,y-4,700,50);sprite.dataset.anim='grab';a.classList.add('is-book');for(let k=0;k<3;k++){await wait(700);a.classList.toggle('is-flip');}sprite.dataset.anim='point';emote('heart',1200);say('What a story!');await wait(800);a.classList.remove('is-book','is-flip');}
   else if(kind==='party'){await actorMove(a,clampX(rail,pos.x+40),y,700,60);fx('confetti',1800);sprite.dataset.anim='duo-cheer';sfx.giggle?.();await wait(700);sprite.dataset.anim='quirk-twirl';await wait(1000);sprite.dataset.anim='duo-cheer';say('Party time!');await wait(500);}
   else if(kind==='rain'){await actorMove(a,pos.x+10,rail.y-60,800,20);a.classList.add('is-cloud');const rn=fx('rain',2600);sprite.dataset.anim='duo-cover';emote('spiral',1400);await wait(1400);
    const far=pos.x-L>R-pos.x?L:R;sprite.dataset.anim='walk';await Promise.all([travel({x:far,y:rail.y,ms:900,anim:'walk'}),actorMove(a,far+10,rail.y-60,1000,0)]);if(a.closest('body')&&/thunder|lightning|storm/.test((uiName(item)||'').toLowerCase()))fx('zap',500);await wait(700);rn.remove();a.classList.remove('is-cloud');}
   else if(kind==='photo'){await actorMove(a,clampX(rail,pos.x+70),y-10,700,40);sprite.dataset.anim='duo-bow';await wait(500);for(let k=0;k<2;k++){a.classList.add('is-flash');fx('flash',300);await wait(350);a.classList.remove('is-flash');sprite.dataset.anim=k?'duo-cheer':'point';await wait(500);}say('Say cheese!');}
   else if(kind==='ufo'){await actorMove(a,pos.x+10,rail.y-90,900,0);a.classList.add('has-beam');sprite.dataset.anim='fly';emote('spiral',1600);await travel({x:pos.x,y:rail.y-50,ms:900,anim:'fly'});await wait(500);a.classList.remove('has-beam');await travel({x:pos.x,y:rail.y,ms:300,anim:'jump'});sprite.dataset.anim='land';fx('stars',900);say('Abducted… almost!');await wait(600);}
   else if(kind==='magnet'){const tx=pos.x>mid?L+6:R-6;await actorMove(a,tx,y+6,800,40);a.classList.add('is-pull');sprite.dataset.anim='refuse';await travel({x:clampX(rail,tx+(tx<mid?20:-40)),y:rail.y,ms:1200,anim:'refuse'});a.classList.remove('is-pull');fx('stars',800);say('Stuck to the magnet!');await wait(700);}
   else if(kind==='firework'){await actorMove(a,clampX(rail,pos.x+50),y+10,700,40);await wait(300);sprite.dataset.anim='duo-cover';await actorMove(a,a._x,rail.y-140,700,0);a.style.visibility='hidden';const b=document.createElement('i');b.className='screen-burst';b.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;layerFront.append(b);sfx.kick?.();setTimeout(()=>b.remove(),1200);
    await wait(500);sprite.dataset.anim='duo-cheer';say('Boom!');await wait(800);a.style.visibility='';}
   else if(kind==='treasure'){await actorMove(a,clampX(rail,pos.x+40),y+30,700,40);a.style.opacity='.0';await walkTo(clampX(rail,a._x-SIZE/2),rail.y);sprite.dataset.anim='quirk-dig';await wait(1400);a.style.opacity='';await actorMove(a,a._x,y-20,400,20);fx('sparkle',1400);sprite.dataset.anim='duo-cheer';say(Math.random()<.5?'Shiny!':'Found treasure!');await wait(1000);}
   else if(kind==='bubble'){await actorMove(a,clampX(rail,pos.x+20),y-30,700,40);for(let k=0;k<3;k++){const bb=document.createElement('i');bb.className='screen-bubble';const bx=clampX(rail,pos.x+(Math.random()*120-60));bb.style.transform=`translate3d(${bx+20}px,${rail.y-10}px,0)`;layerFront.append(bb);setTimeout(()=>bb.remove(),1800);
     await walkTo(bx,rail.y);sprite.dataset.anim='jump';await travel({x:bx,y:rail.y-40,arc:0,ms:260,anim:'jump'});bb.classList.add('is-pop');await travel({x:bx,y:rail.y,ms:240,anim:'land'});}sprite.dataset.anim='duo-laugh';say('Pop pop pop!');await wait(600);}
   else if(kind==='mirror'){await actorMove(a,clampX(rail,pos.x+46),y-4,700,40);pos.face=a._x>pos.x?1:-1;sprite.dataset.face=pos.face>0?'right':'left';sprite.dataset.anim='duo-bow';await wait(700);sprite.dataset.anim='duo-laugh';emote('heart',1400);say('Looking good!');await wait(1100);}
   else if(kind==='bounce'){const lv=statLv(id,'fly');await actorMove(a,clampX(rail,pos.x),y+16,700,40);a.classList.add('is-squash');for(let k=0;k<3;k++){const h=40+Math.min(90,lv)*(0.6+k*0.2);sprite.dataset.anim='jump';await travel({x:pos.x,y:rail.y-h,arc:0,ms:380,anim:'jump'});await travel({x:pos.x,y:rail.y,ms:360,anim:'land'});}a.classList.remove('is-squash');say(lv>=35?'Sky high!':'Boing!');sprite.dataset.anim='duo-cheer';await wait(600);}
   else if(kind==='duel'){const lv=statLv(id,'power');await actorMove(a,clampX(rail,pos.x+56),y,700,40);pos.face=1;sprite.dataset.face='right';for(let k=0;k<3;k++){sprite.dataset.anim='duo-punch';await actorMove(a,a._x+8,y-6,180,0);fx('stars',400);await actorMove(a,a._x-8,y,180,0);await wait(250);}
    if(lv>=35){await actorMove(a,a._x+80,y-40,500,40);sprite.dataset.anim='duo-cheer';say('Victory!');}else{sprite.dataset.anim='duo-hit';say('Lost the duel… Power training helps');}await wait(800);}
   else if(kind==='paint'){const lv=skillsOf(id).includes('draw')?skillLevel(id,'draw')+1:0;await actorMove(a,pos.x+14,y-4,700,40);sprite.dataset.anim='quirk-paint';for(let k=0;k<2+lv;k++){fx('paint',900);await wait(500);}sprite.dataset.anim='duo-cheer';say(lv>=3?'A masterpiece!':lv?'Nice painting':'A little scribble… Drawing classes help');await wait(800);}
   else if(kind==='stars'){await actorMove(a,clampX(rail,pos.x+30),y-2,700,40);sprite.dataset.anim='quirk-binoculars';await wait(1600);fx('sparkle',1200);sprite.dataset.anim='point';emote('heart',1200);say('So many stars!');await wait(900);}
   else if(kind==='sniff'){await actorMove(a,pos.x+16,y,700,40);sprite.dataset.anim='sniff';await wait(1000);if(Math.random()<.5||/pepper/.test((uiName(item)||'').toLowerCase())){sprite.dataset.anim='jump';say('Achoo!');fx('stars',700);await travel({x:pos.x,y:rail.y-20,arc:0,ms:160,anim:'jump'});await travel({x:pos.x,y:rail.y,ms:200,anim:'land'});}else{emote('heart',1400);say('Smells lovely');}await wait(700);}
   else if(kind==='alarm'){await actorMove(a,clampX(rail,pos.x+40),y,700,40);a.classList.add('is-ring');await wait(300);sprite.dataset.anim='jump';emote('spiral',1200);await travel({x:pos.x,y:rail.y-46,arc:0,ms:220,anim:'jump'});await travel({x:pos.x,y:rail.y,ms:240,anim:'land'});sprite.dataset.anim='duo-cover';await wait(1000);a.classList.remove('is-ring');sprite.dataset.anim='idle';}
   else if(kind==='magic'){const lv=skillsOf(id).includes('magic')?skillLevel(id,'magic')+1:0;await actorMove(a,pos.x+12,y-6,700,40);sprite.dataset.anim='grab';await wait(300);for(let k=0;k<1+lv;k++){fx('sparkle',900);await wait(450);}
    if(lv>=2){sprite.dataset.anim='quirk-twirl';say('Abracadabra!');await wait(900);}else{fx('stars',700);sprite.dataset.anim='shake';say('Poof… Magic classes help');await wait(800);}}
   else if(kind==='hat'){await actorMove(a,pos.x+12,y-4,700,60);sprite.dataset.anim='grab';await wait(300);a.style.visibility='hidden';const h=fx('hat',2200);h.innerHTML=staticArt(item)||'';sprite.dataset.anim='duo-bow';await wait(900);sprite.dataset.anim='duo-cheer';say('Fancy hat!');await wait(1100);h.remove();a._x=pos.x+12;a._y=y-6;a.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;a.style.visibility='';}
   else if(kind==='shades'){await actorMove(a,pos.x+12,y-4,700,60);a.style.visibility='hidden';const h=fx('shades',2000);h.innerHTML=staticArt(item)||'';sprite.dataset.anim='duo-bow';await wait(700);sprite.dataset.anim='quirk-samba';say('Too cool');await wait(1200);h.remove();a._x=pos.x+12;a._y=y-6;a.style.transform=`translate3d(${a._x}px,${a._y}px,0)`;a.style.visibility='';}
   else if(kind==='slip'){const tx=clampX(rail,pos.x+60);await actorMove(a,tx+10,y+18,700,40);sprite.dataset.anim='walk';await walkTo(tx,rail.y);sprite.dataset.anim='tumble';fx('stars',900);await travel({x:clampX(rail,tx+50),y:rail.y,arc:26,ms:500,anim:'tumble'});emote('spiral',1200);say('Whoops!');await wait(900);}
   else if(kind==='fish'){const lv=statLv(id,'swim');await actorMove(a,clampX(rail,pos.x+40),y+14,700,40);a.classList.add('is-flop');for(let k=0;k<3;k++){sprite.dataset.anim='jump';const tx=clampX(rail,a._x-10);await travel({x:tx,y:rail.y-30,arc:0,ms:260,anim:'jump'});await travel({x:tx,y:rail.y,ms:240,anim:'land'});if(lv>=35&&k===1)break;await actorMove(a,clampX(rail,a._x+(Math.random()<.5?-60:60)),y+14,300,30);}
    a.classList.remove('is-flop');sprite.dataset.anim=lv>=35?'duo-cheer':'shake';say(lv>=35?'Caught a fish!':'Slippery… Swim training helps');await wait(800);}
   else if(kind==='pinch'){await actorMove(a,clampX(rail,pos.x-16),y+18,700,30);a.classList.add('is-pinch');await wait(300);sprite.dataset.anim='jump';emote('spiral',1000);await travel({x:pos.x,y:rail.y-44,arc:0,ms:220,anim:'jump'});await travel({x:clampX(rail,pos.x+70),y:rail.y,arc:20,ms:500,anim:'walk'});say('Ouch!');a.classList.remove('is-pinch');await wait(600);}
   else if(kind==='slow'){await actorMove(a,clampX(rail,pos.x+20),y+16,900,20);const far=pos.x-L>R-pos.x?L:R;await Promise.all([actorMove(a,far,y+16,3200,0),(async()=>{sprite.dataset.anim='walk';await travel({x:far,y:rail.y,ms:900,anim:'walk'});sprite.dataset.anim='idle';emote('bowl',1200);await wait(1500);sprite.dataset.anim='duo-cheer';})()]);say('Slow and steady…');await wait(500);}
   else if(kind==='chase'){const lv=statLv(id,'fly');for(let k=0;k<3;k++){const tx=clampX(rail,L+Math.random()*(R-L));await actorMove(a,tx+10,rail.y-40-Math.random()*30,600,20);sprite.dataset.anim='walk';await walkTo(tx,rail.y);sprite.dataset.anim='jump';await travel({x:tx,y:rail.y-(30+lv*0.5),arc:0,ms:280,anim:'jump'});await travel({x:tx,y:rail.y,ms:260,anim:'land'});}
    sprite.dataset.anim=lv>=50?'duo-cheer':'duo-laugh';say(lv>=50?'Almost caught it!':'It flew away…');await wait(600);}
   else if(kind==='ladder'){const lv=statLv(id,'stamina');await actorMove(a,clampX(rail,pos.x+20),y-6,700,40);a.classList.add('is-tall');await walkTo(clampX(rail,a._x-8),rail.y);sprite.dataset.anim='climb';await travel({x:pos.x,y:rail.y-(lv>=35?70:40),ms:1400,anim:'climb'});sprite.dataset.anim='point';await wait(600);await travel({x:pos.x,y:rail.y,ms:900,anim:'climb'});a.classList.remove('is-tall');say(lv>=35?'Great view up there!':'Tired legs… Stamina training helps');await wait(600);}
   else if(kind==='rope'){const lv=statLv(id,'stamina');a.style.visibility='hidden';const rp=document.createElement('i');rp.className='screen-rope';rp.style.transform=`translate3d(${L}px,${rail.y-20}px,0)`;rp.style.width=(R-L+SIZE)+'px';layerFront.append(rp);
    sprite.dataset.anim='jump';await travel({x:L,y:rail.y-60,arc:20,ms:500,anim:'jump'});sprite.dataset.anim='walk';sprite.classList.add('is-balance');await travel({x:R,y:rail.y-60,ms:lv>=35?1800:2600,anim:'walk'});sprite.classList.remove('is-balance');
    if(lv<35){sprite.dataset.anim='tumble';await travel({x:R,y:rail.y,ms:350,anim:'tumble'});say('Fell off… Stamina training helps');}else{await travel({x:R,y:rail.y,arc:20,ms:420,anim:'jump'});sprite.dataset.anim='duo-bow';say('Perfect balance!');}rp.remove();a.style.visibility='';await wait(700);}
   else if(kind==='wind'){await actorMove(a,clampX(rail,pos.x+50),y,700,40);a.classList.add('is-spin');fx('wind',1800);sprite.dataset.anim='quirk-twirl';await wait(1000);await travel({x:clampX(rail,pos.x-80),y:rail.y,ms:700,anim:'quirk-twirl'});sprite.dataset.anim='shake';say('Whoosh!');a.classList.remove('is-spin');await wait(700);}
   else if(kind==='idea'){await actorMove(a,pos.x+12,rail.y-46,700,40);a.classList.add('is-glow');sprite.dataset.anim='point';await wait(900);emote('heart',1200);say('I have an idea!');await wait(1100);a.classList.remove('is-glow');}
   else if(kind==='mimic'){await actorMove(a,clampX(rail,pos.x+60),y,700,40);for(const an of ['duo-bow','jump','quirk-twirl']){sprite.dataset.anim=an;await wait(600);a.classList.add('is-copy');await wait(500);a.classList.remove('is-copy');}sprite.dataset.anim='duo-laugh';say('Copycat!');await wait(700);}
   else if(kind==='roar'){const lv=statLv(id,'power');await actorMove(a,clampX(rail,pos.x+56),y-6,800,30);a.classList.add('is-boo');fx('stars',500);await wait(400);a.classList.remove('is-boo');
    if(lv>=40){sprite.dataset.anim='quirk-howl';await wait(900);await actorMove(a,a._x+70,y-6,500,30);say('Roared back!');}else{sprite.dataset.anim='duo-hide';emote('spiral',1200);say('Too scary!');await wait(1000);}}
   else if(kind==='build'){await actorMove(a,pos.x+14,y-2,700,40);for(let k=0;k<4;k++){sprite.dataset.anim='knock';fx('stars',300);sfx.kick?.();await wait(380);}const b=document.createElement('i');b.className='screen-built';b.style.transform=`translate3d(${clampX(rail,pos.x+50)}px,${rail.y+SIZE-30}px,0)`;layerFront.append(b);setTimeout(()=>b.remove(),2200);sprite.dataset.anim='duo-cheer';say('Built a little house!');await wait(1200);}
   else if(kind==='puzzle'){await actorMove(a,pos.x+14,y-2,700,40);sprite.dataset.anim='idle';emote('spiral',900);await wait(1200);const ok=Math.random()<0.6+0.08*(skillsOf(id).includes('draw')?skillLevel(id,'draw')+1:0);sprite.dataset.anim=ok?'duo-cheer':'shake';say(ok?'Solved it!':'So tricky…');await wait(900);}
   else if(kind==='plant'){const tx=clampX(rail,pos.x+40);await actorMove(a,tx+8,y+14,700,40);await walkTo(clampX(rail,tx-14),rail.y);sprite.dataset.anim='quirk-dig';await wait(1000);const t=document.createElement('i');t.className='screen-sprout';t.style.transform=`translate3d(${tx+12}px,${rail.y+SIZE-34}px,0)`;layerFront.append(t);setTimeout(()=>t.remove(),2600);sprite.dataset.anim='duo-cheer';say('It grows!');await wait(1500);}
   else if(kind==='phone'){await actorMove(a,clampX(rail,pos.x+40),y,700,40);a.classList.add('is-ring');await wait(700);a.classList.remove('is-ring');await actorMove(a,pos.x+18,rail.y+6,300,10);sprite.dataset.anim='quirk-hum';say('Hello? …Hello!');await wait(1600);}
   else if(kind==='archery'){const lv=statLv(id,'power');const tx=pos.x>mid?L:R;const tg=document.createElement('i');tg.className='screen-target';tg.style.transform=`translate3d(${tx}px,${rail.y+6}px,0)`;layerFront.append(tg);await actorMove(a,pos.x+10,y-4,600,30);
    pos.face=tx>pos.x?1:-1;sprite.dataset.face=pos.face>0?'right':'left';sprite.dataset.anim='duo-throw';const hit=Math.random()<0.4+lv/150;await actorMove(a,tx+(hit?6:30),rail.y+(hit?16:-20),450,30);fx('stars',500);sprite.dataset.anim=hit?'duo-cheer':'shake';say(hit?'Bullseye!':'Missed…');await wait(800);tg.remove();}
   else if(kind==='dice'){await actorMove(a,clampX(rail,pos.x+30),y+10,700,40);sprite.dataset.anim='duo-throw';a.classList.add('is-roll');await actorMove(a,clampX(rail,pos.x+90),y+14,600,30);a.classList.remove('is-roll');const n=1+Math.floor(Math.random()*6);say(n===6?'Rolled a 6!':`Rolled a ${n}`);sprite.dataset.anim=n>=5?'duo-cheer':'idle';await wait(900);}
   else if(kind==='spooky'){await actorMove(a,clampX(rail,pos.x+40),y,700,40);a.classList.add('is-glow');sprite.dataset.anim='duo-hide';await wait(700);sprite.dataset.anim='duo-peek';await wait(500);sprite.dataset.anim='duo-cheer';say('Trick or treat!');await wait(800);a.classList.remove('is-glow');}
   await actorMove(a,home.x,home.y,800,80);
  }catch(e){if(e?.message!=='duo-abort')console.warn('visitor',e);}finally{if(duoNow){duoBusy=false;if(bud)bud.sprite.dataset.anim='idle';}a.remove();if(actorEl===a)actorEl=null;art?.classList.remove('is-away');sprite.dataset.anim='idle';busy=false;}
  return true;}

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
 let homeTab='houses';
 function renderTab(){
  const root=$('viewPets');if(!root)return;
  const act=activeMeta();const have=unlocked().length;
  const groups=FAMILIES.map(f=>({f,list:roster.filter(c=>c.family===f.id)})).filter(g=>g.list.length);
  const ava=c=>{const own=isDiscovered(c.id),p=own?pet(c.id):null,el=byId.get(c.id),house=own&&ctx.residentOf?ctx.residentOf(c.id):null;
   return `<button type="button" class="pet-ava ${own?'is-unlocked':'is-locked'} ${state.active===c.id||state.buddy===c.id?'is-active':''} ${own&&isShiny(c.id)?'is-shiny':''}" data-card="${c.id}" aria-label="${own?escapeText(p.nick||uiName(el)):'Undiscovered companion'}"><span class="pet-ava-art">${own?(sprites[c.id]||staticArt(el)):'<span class="pet-silhouette">'+staticArt(el)+'</span>'}</span><small>${own?escapeText(p.nick||uiName(el)):'???'}</small>${own?`<em class="pet-ava-lv">Lv ${totalLevel(c.id)}</em>`:''}${state.active===c.id||state.buddy===c.id?'<i class="pet-ava-tag is-screen" title="On screen"></i><em class="pet-ava-on">On screen</em>':house?'<i class="pet-ava-tag is-home" title="Lives in a house"></i>':''}</button>`;};
  let now='';
  if(act){const p=pet(act.id);settleMood(p);now=`<section class="pets-now"><button type="button" class="pets-now-art" data-card="${act.id}" aria-label="Stats">${sprites[act.id]||''}</button><div class="pets-now-main"><strong>${escapeText(nameOf(act))}</strong><small>On screen · Total Lv ${totalLevel(act.id)} · ${moodLabel(p.mood)}${hungry(p)?' · Hungry':''}</small><span class="pet-needs"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b></span></span></div><div class="pets-now-actions"><button type="button" class="pets-btn" data-card="${act.id}">Stats</button><button type="button" class="pets-btn is-quiet" data-wardrobe="${act.id}">Wear</button><button type="button" class="pets-btn is-quiet" id="petDismiss">Send home</button></div></section>`;}
  else now=`<section class="pets-now is-empty"><small>${have?'No companion on screen. Tap a companion below to choose one.':`Discover one of the ${roster.length} companion elements (five per family) to get your first companion.`}</small></section>`;
  // V125: second on-screen slot
  let slot='';if(act){const info=(()=>{try{return ctx.slot2Info?.()||null;}catch{return null;}})();const bm=buddyMeta();
   if(bm){const p=pet(bm.id);settleMood(p);slot=`<section class="pets-now is-slot2"><button type="button" class="pets-now-art" data-card="${bm.id}" aria-label="Stats">${sprites[bm.id]||''}</button><div class="pets-now-main"><strong>${escapeText(nameOf(bm))}<span class="duo-chip">Duo ×${DUO_GROWTH}</span></strong><small>Second slot · Total Lv ${totalLevel(bm.id)} · ${moodLabel(p.mood)} · tap it on screen to swap</small><span class="pet-needs"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b></span></span></div><div class="pets-now-actions"><button type="button" class="pets-btn" id="buddyChange">Change</button><button type="button" class="pets-btn is-quiet" data-wardrobe="${bm.id}">Wear</button><button type="button" class="pets-btn is-quiet" id="buddyDismiss">Send home</button></div></section>`;}
   else if(info?.unlocked){slot=`<section class="pets-now is-slot2 is-empty"><small>Second slot unlocked · choose a companion to play with ${escapeText(nameOf(act))} (all growth ×${DUO_GROWTH}).</small><div class="slot2-actions"><button type="button" class="pets-btn" id="buddyChange">Choose companion</button></div></section>`;}
   else if(info){const ready=info.elements>=info.minElements;const pct=Math.min(100,100*info.elements/info.minElements);
    slot=`<section class="pets-now is-slot2 is-locked s2"><div class="s2-head"><span class="s2-ava">${sprites[act.id]||''}</span><span class="s2-plus">+</span><span class="s2-ava is-q"><i>?</i><b class="s2-lock">🔒</b></span><div class="s2-title"><small>NEW SLOT</small><strong>Duo mode</strong></div></div>
     <div class="s2-perks"><span><b>⚔</b>Duo games</span><span><b>×1.25</b>Growth</span><span><b>✦</b>More finds</span></div>
     <div class="s2-paths"><button type="button" class="s2-path is-buy" id="slot2Buy" ${info.canBuy?'':'disabled'}><small>INSTANT</small><b>${escapeText(info.price)}</b></button>
      <button type="button" class="s2-path" id="slot2Ad" ${ready&&info.canAd?'':'disabled'}><small>${ready?'FREE PATH':'FREE PATH · LOCKED'}</small>${ready?`<span class="s2-pips">${Array.from({length:info.adsNeeded},(_,k)=>`<i class="${k<info.ads?'on':''}"></i>`).join('')}</span><b>▶ Ad ${info.ads}/${info.adsNeeded}</b>`:`<span class="s2-bar"><i style="width:${pct.toFixed(1)}%"></i></span><b>${info.elements.toLocaleString('en-US')} / ${info.minElements.toLocaleString('en-US')}</b>`}</button></div></section>`;}}
  // V196: "Your team" bar at the top — who is on screen and the Duo slot, instead of a card lost at the bottom
  let team='';if(act){const info2=(()=>{try{return ctx.slot2Info?.()||null;}catch{return null;}})();const bm2=buddyMeta();const pa=pet(act.id);
   const seat=(m,pp)=>`<button type="button" class="team-slot is-on" data-onscreen="${m.id}"><span class="team-art">${sprites[m.id]||''}</span><b>${escapeText(nameOf(m))}</b><small>Lv ${totalLevel(m.id)} · ${moodLabel(pp.mood)}</small></button>`;
   const second=bm2?seat(bm2,pet(bm2.id)):info2?.unlocked?`<button type="button" class="team-slot is-free" id="buddyChange"><span class="team-art">+</span><b>Add a partner</b><small>Duo slot is open</small></button>`
    :info2?`<button type="button" class="team-slot is-locked" data-s2open="1"><span class="team-art">🔒</span><b>Duo slot</b><small>${escapeText(info2.price)} · or ${info2.elements.toLocaleString('en-US')}/${info2.minElements.toLocaleString('en-US')} elements</small><i class="team-bar"><em style="width:${Math.min(100,100*info2.elements/info2.minElements).toFixed(1)}%"></em></i></button>`:'';
   const rl=bm2?REL_INFO[relation(act.id,bm2.id)]:null;
   team=`<section class="team"><div class="team-top"><strong>Your team</strong><small>${bm2?`Duo mode · all growth ×${DUO_GROWTH}`:'On screen with you'}</small></div><div class="team-row">${seat(act,pa)}${second?`<span class="team-plus">+</span>${second}`:''}</div>${rl?`<p class="team-rel is-${relation(act.id,bm2.id)}"><b>${rl.icon} ${rl.label}</b> ${rl.note}</p>`:''}${!bm2&&info2&&!info2.unlocked?`<p class="team-note">Unlock the <b>Duo slot</b> for a second companion on screen: duo games, growth ×${DUO_GROWTH} and more finds.</p>`:''}</section>`;}
  // V151: Companions / Houses as big tiles, like the Stadium hub
  const hi=(()=>{try{return ctx.homeInfo?.()||null;}catch{return null;}})();
  const tabs=`<div class="st-shop is-hub home-tabs" role="tablist">${[['companions','🐾','Companions',`${have}/${roster.length} found${act?' · '+escapeText(nameOf(act))+' on screen':''}`],['houses','🏠','Houses',hi?`${hi.owned}/${hi.total} owned · ${hi.residents} living`:'Where they live']].map(([k,ico,t,sm])=>`<button type="button" class="st-shop-btn home-tab ${homeTab===k?'is-on':''}" data-hometab="${k}" aria-pressed="${homeTab===k}"><span>${ico}</span><b>${t}</b><small>${sm}</small></button>`).join('')}</div>`;
  root.innerHTML=homeTab==='houses'?`<div class="pets-scroll"><div class="section-head home-title"><h2>Home</h2></div>${tabs}
   <div id="homeMount"></div></div>`:`<div class="pets-scroll"><div class="section-head home-title"><h2>Home</h2></div>${tabs}
   ${act?'':now}
   ${team}
   <h3 class="team-h">Collection · ${have}/${roster.length}</h3>
   <p class="mini-muted pets-legend"><i class="pet-ava-tag is-screen"></i> On screen <i class="pet-ava-tag is-home"></i> Lives in a house</p>
   <div class="pets-avatars">${groups.map(g=>`<div class="pets-ava-row"><span class="pets-ava-family">${escapeText(g.f.name)}</span><div class="pets-ava-list">${g.list.map(ava).join('')}</div></div>`).join('')}</div>
   <details class="pets-help"><summary>How companions and houses work</summary><ul>
    <li><strong>Companions:</strong> discover a companion element, tap it here and choose it. Your first one is free; switching later needs a rewarded ad (then 5 free minutes). It lives on your screen: drag elements onto it to feed it, rub it to pet it, tap its gifts.</li>
    <li><strong>Stats:</strong> HP, Stamina, Run, Power, Swim, Fly, each Lv.0–${COMPANION_MAX_LEVEL} with a grade E–S. The element's family decides which stats a meal grows.</li>
    <li><strong>Houses:</strong> discover house elements (Tent 1 → Castle 8 companions; better houses need longer recipes). Tap a house for its bonuses. Companions living in a house grow faster from everything they do — bonuses only speed up growth, so moving a companion never takes anything away.</li>
    <li><strong>Furniture:</strong> tap the floor or the wall to place pieces, press and hold to drag them, tap one to rotate or put it away. Training pieces speed up their stat, food pieces make meals fill more, fun pieces lift mood faster, books and globes bring more finds while you are away.</li>
    <li><strong>While you are away:</strong> residents find elements you could already craft. One or two are free; one ad keeps them all.</li>
   </ul></details>
   </div>`;
  root.querySelectorAll('[data-hometab]').forEach(b=>b.onclick=()=>{homeTab=b.dataset.hometab;renderTab();});
  // V145: on-screen companions open their mood / wear / send-home card in a sheet
  root.querySelectorAll('[data-onscreen]').forEach(b=>b.onclick=()=>{const id=b.dataset.onscreen;const html=id===state.active?now:slot;
   showModal(`<div class="modal-tag">ON SCREEN</div>${html.replace(/id="buddyChange"[^>]*>Change</,'id="buddyChange">Change<')}`);const mc=$('modalContent');try{ctx.wear?.(mc);}catch{}
   mc.querySelectorAll('[data-card]').forEach(x=>x.onclick=()=>{closeModal();openCard(x.dataset.card);});
   mc.querySelectorAll('[data-wardrobe]').forEach(x=>x.onclick=()=>{closeModal();ctx.openWardrobe?.(x.dataset.wardrobe);});
   const d2=$('petDismiss');if(d2)d2.onclick=()=>{closeModal();setActive(null);};const bc2=$('buddyChange');if(bc2)bc2.onclick=()=>{closeModal();pickBuddy();};const bd2=$('buddyDismiss');if(bd2)bd2.onclick=()=>{closeModal();setBuddy(null);};});
  root.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>openCard(b.dataset.card));
  const d=$('petDismiss');if(d)d.onclick=()=>setActive(null);
  root.querySelectorAll('[data-wardrobe]').forEach(b=>b.onclick=e=>{e.stopPropagation();ctx.openWardrobe?.(b.dataset.wardrobe);});
  const bc=$('buddyChange');if(bc)bc.onclick=pickBuddy;const bd=$('buddyDismiss');if(bd)bd.onclick=()=>setBuddy(null);
  root.querySelectorAll('[data-s2open]').forEach(b=>b.onclick=()=>{showModal(`<div class="modal-tag">DUO SLOT</div>${slot}<button type="button" class="modal-button secondary" id="s2Close">Close</button>`);$('s2Close').onclick=closeModal;
   const sb2=$('slot2Buy');if(sb2)sb2.onclick=async()=>{sb2.disabled=true;try{await ctx.buySlot2?.();}finally{closeModal();refreshViews();if(slot2()&&!state.buddy)pickBuddy();}};
   const sa2=$('slot2Ad');if(sa2)sa2.onclick=async()=>{sa2.disabled=true;try{await ctx.watchSlot2Ad?.();}finally{closeModal();refreshViews();if(slot2()&&!state.buddy)pickBuddy();}};});
  const sb=$('slot2Buy');if(sb)sb.onclick=async()=>{sb.disabled=true;try{await ctx.buySlot2?.();}finally{refreshViews();if(slot2()&&!state.buddy)pickBuddy();}};
  const sa=$('slot2Ad');if(sa)sa.onclick=async()=>{sa.disabled=true;try{await ctx.watchSlot2Ad?.();}finally{refreshViews();if(slot2()&&!state.buddy)pickBuddy();}};
  try{ctx.renderExtra?.(root);}catch(e){console.warn('home',e);}
  try{ctx.wear?.(root);}catch{}
  if(!root.hidden)markSeen();
 }
 function pickBuddy(){const list=unlocked().filter(c=>c.id!==state.active);
  if(!list.length){showModal(`<div class="modal-tag">SECOND SLOT</div><h2>No other companion yet</h2><p>Discover another companion element to fill the second slot.</p>`);return;}
  showModal(`<div class="modal-tag">SECOND SLOT</div><h2>Who plays with ${escapeText(nameOf(activeMeta()))}?</h2><div class="buddy-pick">${list.map(c=>`<button type="button" data-buddy="${c.id}" data-companion="${c.id}"><span class="buddy-art">${sprites[c.id]||''}</span>${escapeText(nameOf(c))}<small>Lv ${totalLevel(c.id)}</small><em class="buddy-rel is-${relation(state.active,c.id)}">${REL_INFO[relation(state.active,c.id)].icon} ${REL_INFO[relation(state.active,c.id)].label}</em></button>`).join('')}</div><p class="mini-muted">💚 friends find elements together · 😤 rivals spar · 💥 enemies knock each other out</p>`);
  try{ctx.wear?.($('modalContent'));}catch{}
  $('modalContent').querySelectorAll('[data-buddy]').forEach(b=>b.onclick=()=>{closeModal();setBuddy(b.dataset.buddy);sfx.happy();});}
 function rename(id){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return;const p=pet(id);
  showModal(`<div class="modal-tag">RENAME COMPANION</div><h2>${escapeText(uiName(byId.get(id))||meta.name)}</h2><input class="pet-name-input" id="petNameInput" maxlength="${NICK_MAX}" value="${escapeText(p.nick||'')}" placeholder="${escapeText(uiName(byId.get(id))||meta.name)}" autocomplete="off"/><p class="mini-muted">Up to ${NICK_MAX} characters. Leave empty to use the original name.</p><button type="button" class="modal-button" id="petNameSave">Save name</button><button type="button" class="modal-button secondary" id="petNameCancel">Cancel</button>`);
  const inp=$('petNameInput');setTimeout(()=>inp?.focus(),50);
  $('petNameSave').onclick=()=>{const v=String(inp.value||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,NICK_MAX);if(v)p.nick=v;else delete p.nick;save();closeModal();refreshViews();};
  $('petNameCancel').onclick=closeModal;}
 /** V147: one companion sheet, the same whether the companion is on screen or not:
  *  stats + nickname, Add to Home, Add to Screen, Wardrobe; on-screen status (mood/belly) shown subtly at the bottom. */
 function openCard(id){const meta=metaById.get(id);if(!meta)return;
  if(!isDiscovered(id)){showModal(`<div class="modal-tag">COMPANION</div>${cardHtml(meta,{full:true})}<button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);$('petCardClose').onclick=closeModal;return;}
  const p=pet(id);settleMood(p);const el=byId.get(id),base=uiName(el)||meta.name,sh=isShiny(id);
  const onMain=state.active===id,onBuddy=state.buddy===id,on=onMain||onBuddy;
  const hid=ctx.residentOf?.(id);const hname=hid?(ctx.homeChoices?.(id)||[]).find(x=>x.id===hid)?.name:'';
  const skills=skillsOf(id);
  showModal(`<div class="modal-tag">COMPANION</div>
   <div class="cc-head"><span class="cc-art" data-companion="${id}">${sprites[id]||staticArt(el)}</span><div class="cc-id"><button type="button" class="cc-name" data-rename="${id}">${sh?'✦ ':''}${escapeText(p.nick||base)}<i aria-hidden="true">✎</i></button><small>${p.nick?escapeText(base)+' · ':''}Total Lv ${totalLevel(id)}${lookLabel(p.look)?' · ✨ '+escapeText(lookLabel(p.look)):''}</small>
    <span class="cc-tags">${on?`<em class="cc-tag is-screen">● On screen${onBuddy?' · 2nd slot':''}</em>`:''}${hid?`<em class="cc-tag is-home">⌂ ${escapeText(String(hname||'').replace(/^Companion /,''))}</em>`:''}</span></div></div>
   ${statPanel(meta,p)}
   <div class="cc-actions">
    <button type="button" class="pets-btn ${hid?'is-quiet':''}" id="ccHome"><b>⌂</b>${hid?'Change home':'Add to Home'}</button>
    <button type="button" class="pets-btn ${on?'is-quiet':''}" id="ccScreen"><b>▣</b>${on?'Remove from screen':'Add to Screen'}</button>
    <button type="button" class="pets-btn is-quiet" id="ccWear"><b>👒</b>Wardrobe</button>
   </div>
   ${on?`<div class="cc-status"><span><i>Mood</i><b><em style="width:${p.mood}%"></em></b><small>${moodLabel(p.mood)}</small></span><span><i>Belly</i><b class="is-belly"><em style="width:${p.belly}%"></em></b><small>${hungry(p)?'Hungry':'Fed'}</small></span>${onBuddy?`<span class="cc-duo">Duo ×${DUO_GROWTH}</span>`:''}</div>`:''}
   <p class="cc-quirk"><b>Quirk:</b> ${escapeText(meta.quirk)} · <b>Gift:</b> ${escapeText(meta.gift)}${skills.length?' · Tricks: '+skills.map(escapeText).join(', '):''}</p>
   <button type="button" class="modal-button secondary" id="petCardClose">Close</button>`);
  const mc=$('modalContent');try{ctx.wear?.(mc);}catch{}
  $('petCardClose').onclick=closeModal;
  mc.querySelectorAll('[data-rename]').forEach(b=>b.onclick=()=>rename(b.dataset.rename));
  $('ccWear').onclick=()=>ctx.openWardrobe?.(id);
  $('ccHome').onclick=()=>homePicker(id);
  $('ccScreen').onclick=()=>{if(on){closeModal();onMain?setActive(null):setBuddy(null);refreshViews();return;}screenPicker(id);};}
 function homePicker(id){const list=ctx.homeChoices?.(id)||[];const cur=ctx.residentOf?.(id);
  if(!list.length){showModal(`<div class="modal-tag">ADD TO HOME</div><h2>No house yet</h2><p>Discover a house element (the smallest is the Companion Tent) or buy one in the Market.</p><button type="button" class="modal-button secondary" id="hpBack">Back</button>`);$('hpBack').onclick=()=>openCard(id);return;}
  showModal(`<div class="modal-tag">ADD TO HOME</div><h2>Where does ${escapeText(nameOf(metaById.get(id)))} live?</h2><div class="home-pick-list">${list.map(h=>{const full=!h.here&&h.used>=h.cap;return `<button type="button" class="home-pick ${h.here?'is-here':''} ${full?'is-off':''}" data-hp="${h.id}" ${full?'disabled':''}><span class="home-pick-art">${h.art}</span><span class="home-pick-main"><strong>${escapeText(h.name)}</strong><small>${h.used}/${h.cap} living here${full?' · full':''}</small></span><em class="home-pick-tag">${h.here?'Here':full?'':'Move in'}</em></button>`;}).join('')}</div>${cur?'<button type="button" class="modal-button secondary" id="hpOut">Move out</button>':''}<button type="button" class="modal-button secondary" id="hpBack">Back</button>`);
  $('hpBack').onclick=()=>openCard(id);const o=$('hpOut');if(o)o.onclick=()=>{ctx.moveOut?.(id);refreshViews();openCard(id);};
  $('modalContent').querySelectorAll('[data-hp]').forEach(b=>b.onclick=()=>{if(ctx.moveIn?.(id,b.dataset.hp)){sfx.happy?.();refreshViews();}openCard(id);});}
 function screenPicker(id){const act=activeMeta(),bm=buddyMeta(),meta=metaById.get(id);
  // nothing on screen and the free first choice still unused → straight on screen
  if(!act){closeModal();choose(id).then(()=>refreshViews());return;}
  const free=!state.firstFreeUsed;const slots=[act,...(slot2()?[bm||null]:[])];
  const tile=(m,i)=>m?`<button type="button" class="home-pick" data-swap="${i}"><span class="home-pick-art">${sprites[m.id]||''}</span><span class="home-pick-main"><strong>${escapeText(nameOf(m))}</strong><small>${i?'Second slot':'Main slot'} · goes off screen</small></span><em class="home-pick-tag">Swap</em></button>`:`<button type="button" class="home-pick" data-swap="${i}"><span class="home-pick-art"><span class="home-q">+</span></span><span class="home-pick-main"><strong>Empty second slot</strong><small>Plays next to ${escapeText(nameOf(act))}</small></span><em class="home-pick-tag">Add</em></button>`;
  showModal(`<div class="modal-tag">ADD TO SCREEN</div><h2>Who makes room for ${escapeText(nameOf(meta))}?</h2><div class="home-pick-list">${slots.map(tile).join('')}</div><p class="mini-muted">${free?'Your first choice is free.':'Each swap costs one rewarded ad (then 5 free minutes).'}</p><button type="button" class="modal-button secondary" id="spBack">Back</button>`);
  try{ctx.wear?.($('modalContent'));}catch{}
  $('spBack').onclick=()=>openCard(id);
  $('modalContent').querySelectorAll('[data-swap]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.swap);closeModal();
   if(i===0){await choose(id);}
   else{let ok=free||!bm;if(!ok){try{ok=await requestActivation(meta,{from:bm.id});}catch{ok=false;}}if(ok){if(id===state.active)return;setBuddy(id);sfx.happy?.();}}
   refreshViews();});}
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
 function info(id){const meta=metaById.get(id);const p=pet(id);settleMood(p);return {name:p.nick||uiName(byId.get(id))||meta?.name||'',stats:p.stats,mood:p.mood,belly:p.belly,grades:companionGrades(meta,isShiny(id))};}
 function gameReward(id,stats,amount){const meta=metaById.get(id);if(!meta||!isDiscovered(id))return [];const p=pet(id);const done=[];for(const st of stats){gainStat(p,meta,st,Math.max(1,Math.round(amount*growth(id,st))));done.push(STAT_LABEL[st]);}p.mood=Math.min(100,p.mood+3);p.moodAt=now();save();refreshViews();return done;}
 const lookOf=id=>state.pets[id]?.look||null;
 // V118: preview of a meal for the element sheet (taste, stat growth now, looks it can change)
 function mealPreview(itemId,cid=state.active){const meta=metaById.get(cid),item=byId.get(itemId);if(!meta||!item||!isDiscovered(cid))return null;const p=pet(cid);
  const taste=likes(meta,item),last=p.fed[item.id]||0,fresh=now()-last>FEED_COOLDOWN_MS,depth=ctx.depthOf?.(item.id);
  const stats=taste==='no'?[]:feedPlan(meta,item).map(c=>({stat:c.stat,label:STAT_LABEL[c.stat],amount:Math.round(c.amount*growth(cid,c.stat))}));
  const known=tasted(item.id);
  return {cid,known,name:nameOf(meta),taste,fresh,cooldownMin:fresh?0:Math.max(1,Math.ceil((FEED_COOLDOWN_MS-(now()-last))/60000)),stats,depth,depthMult:feedDepthMult(depth),looks:lookEffects(item.name||uiName(item),familyFor(item),item.category,depth,true)};}
 function tasted(itemId){return !!state.tasted?.[itemId]||Object.values(state.pets||{}).some(q=>q?.fed?.[itemId]);}
 function looksOf(itemId){const item=byId.get(itemId);if(!item)return null;return lookEffects(item.name||uiName(item),familyFor(item),item.category,ctx.depthOf?.(item.id));}
 return {poseRig,requestDuo:k=>{duoRequest=k||'any';lastDuo=0;},koState:()=>({...ko}),relation,relInfo:r=>REL_INFO[r],visitorScene,fullLeft,makeRoom,feedStatsOf:itemId=>{const it=byId.get(itemId);return it?(FAMILY_FEEDS[familyFor(it)]||['stamina','hp']):[];},activeStats:()=>{const m=activeMeta();return m?{name:nameOf(m),family:m.family,stats:pet(m.id).stats}:null;},duoActive,applyRivalLook:(svg,id,look)=>applyLookSvg(svg,look,id+'-rival'),setBuddy,swapDuo,requestDuo:k=>{duoRequest=k||'any';},duoPlay,buddy:()=>buddyMeta()?.id||null,duoPair:()=>duoActive()?[state.active,state.buddy]:[],tasted,looksOf,mealPreview,lookOf,applyLook:(svg,id)=>{applyLookSvg(svg,lookOf(id),id);applyWearSvg(svg,id);},wearOf:id=>({...(state.pets[id]?.wear||{})}),setWear,takeOff,marketFeed,learn,skillsOf,skillLevel,themeCompletion,playToy,placeToy,performSkill,start,stop,setActive,statsHtml,info,gameReward,choose,homeEffect,syncSeen,markSeen,isCompanion,freeChoiceLeft,emote,feed,hitTest,onDiscovery,renderTab,openCard,get active(){return activeMeta();},state:()=>state,unlocked,refreshViews,
  onViewChange(){if(activeMeta()&&sprite&&!sprite.hidden)setTimeout(()=>{if(cancelMove)cancelMove();const r=pickRail();if(r){rail=r;setLayer(r.layer);place(clampX(r,pos.x),r.y);sprite.dataset.anim='idle';}},80);},
  importState(raw){if(raw&&raw.pets){state=normalize(raw);save();syncSeen();}},grades:companionGrades};
}
