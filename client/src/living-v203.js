// V203: living elements. Now and then one element on screen moves by itself (the flame flickers, ice melts and
// re-forms, a heart beats, wings flap, a shell hides) and, rarely, its effect spills onto the screen (fire scorches
// like paper, smoke drifts up, frost creeps in) and the companions react. Never everything at once.
const W=s=>new RegExp('(^|[^a-z])('+s+')([^a-z]|$)');
export const LIVE_RULES=[
 ['shell',W('hermit crab|turtle|tortoise|snail|clam|oyster|armadillo|hedgehog|pangolin|nautilus|mussel|scallop')],
 ['erupt',W('volcano|geyser|eruption|supervolcano|lava fountain|champagne|soda')],
 ['melt',W('ice cube|ice|icicle|snowman|glacier|iceberg|ice cream|butter|popsicle|snowball|wax|chocolate|cheese fondue|sorbet|slush')],
 ['beat',W('life|heart|love|pulse|blood|heartbeat|soul|romance|valentine')],
 ['flame',W('fire|flame|campfire|bonfire|wildfire|torch|blaze|inferno|fireball|ember|match|lighter|burning bush|fireplace|pyre|hellfire|dragon breath|flamethrower')],
 ['smoke',W('smoke|steam|vapor|vapour|mist|fog|haze|smog|incense|fume|exhaust|cloud|breath|ash cloud|geyser steam|sauna|tea|coffee|hot spring|soup|ghost|spirit|phantom|wraith|specter|spectre')],
 ['glow',W('cake|birthday cake|candle|lamp|lantern|light bulb|bulb|star|sun|light|firefly|glow|aurora|gem|diamond|crystal|gold|treasure|neon|halo|chandelier|lighthouse|moon|supernova|comet|sparkler|menorah|jack-o-lantern|christmas tree')],
 ['zap',W('electricity|lightning|energy|spark|battery|plasma|laser|thunderbolt|tesla coil|static|power|voltage|circuit|taser|thunder')],
 ['flap',W('angel|bird|butterfly|bat|dragon|fairy|bee|eagle|owl|pegasus|phoenix|moth|duck|goose|swan|parrot|crow|raven|hawk|falcon|dove|pigeon|sparrow|seagull|wasp|dragonfly|griffin|pterosaur|pterodactyl|cherub|harpy|wyvern|hummingbird|pelican|vulture|chicken|rooster|turkey|penguin|fly|mosquito|ladybug|wings?')],
 ['swim',W('fish|shark|whale|dolphin|eel|squid|octopus|jellyfish|seal|otter|tadpole|goldfish|salmon|tuna|stingray|manta ray|seahorse|koi|piranha|swordfish|orca|narwhal|mermaid|kraken|anglerfish|pufferfish|clownfish|axolotl|shrimp|lobster|crab')],
 ['critter',W('cat|dog|fox|wolf|bear|lion|tiger|mouse|rat|rabbit|bunny|frog|toad|spider|lizard|monkey|horse|cow|pig|sheep|goat|deer|squirrel|raccoon|panda|koala|kangaroo|elephant|giraffe|zebra|hippo|rhino|camel|llama|alpaca|hamster|ferret|badger|beaver|mole|skunk|gorilla|chimpanzee|sloth|scorpion|ant|beetle|caterpillar|worm|snake|crocodile|alligator|dinosaur|t-rex|raptor|kitten|puppy|cub|lamb|pony|donkey|moose|bison|boar|leopard|cheetah|jaguar|puma|lynx|hyena|meerkat|gecko|iguana|chameleon|salamander|newt|unicorn|werewolf|yeti|goblin|troll|imp|gremlin|monster|creature|animal|pet|beast')],
 ['spin',W('wheel|gear|cog|fan|windmill|propeller|tornado|hurricane|cyclone|vortex|whirlpool|galaxy|planet|globe|coin|compass|turbine|spinner|spinning top|vinyl|record|carousel|ferris wheel|yo-yo|frisbee|boomerang|saw blade|black hole|portal|atom|pinwheel|roulette|disco ball|saturn|mars|jupiter|venus|neptune|uranus|mercury|pluto')],
 ['water',W('water|sea|ocean|wave|river|lake|pond|puddle|tide|pool|stream|waterfall|flood|tsunami|rain|drop|droplet|dew|fountain|swamp|bay|lagoon|creek|spring|juice|milk|potion|oil|ink|soup stock|liquid|aquarium|bath|well|rapids|current')],
 ['wind',W('wind|air|breeze|gust|gale|storm|leaf|leaves|grass|flag|tree|plant|flower|wheat|feather|kite|reed|bamboo|palm tree|willow|sail|sailboat|curtain|scarf|banner|windsock|dandelion|tumbleweed|seaweed|kelp|vine|fern|sapling|sprout|bush|corn|rice|lavender|tulip|rose|sunflower|daisy|forest|jungle|meadow|field|garden')],
 ['quake',W('earthquake|explosion|bomb|dynamite|drum|bell|alarm|avalanche|landslide|meteor|asteroid|jackhammer|rocket|firework|fireworks|grenade|tnt|nuke|cannon|gong|sonic boom|stampede|engine|motor|chainsaw|drill')],
 ['bounce',W('ball|balloon|bubble|jelly|slime|spring|trampoline|pudding|marshmallow|gum|bubblegum|rubber|basketball|football|soccer ball|tennis ball|beach ball|blob|jello|mochi|dumpling|egg|pillow|cushion|bean bag|frog jump|kangaroo jump|pogo stick|popcorn')],
];
/** Pure: which built-in motion an element name gets ('' = only the gentle turn). */
export function liveKind(name=''){const n=String(name).toLowerCase();for(const [k,re] of LIVE_RULES)if(re.test(n))return k;return '';}
export const BLEED={flame:'burn',smoke:'smoke',water:'flood',melt:'frost',wind:'gust',quake:'quake',erupt:'quake',zap:'flash'};
/** Pure: the screen effect an element can spill ('' = none). */
export const bleedOf=name=>BLEED[liveKind(name)]||'';
export const LIVE_MS={flame:3200,smoke:3600,water:3200,melt:4200,beat:2400,erupt:3000,glow:3000,zap:1800,flap:2600,swim:2800,critter:2600,spin:2600,wind:3200,quake:1500,bounce:2200,shell:3800,turn:2000};
export const REACT={burn:['scared','wow'],smoke:['sniff','dizzy'],flood:['celebrate','happy'],frost:['scared','sad'],gust:['push','angry'],quake:['scared','wow'],flash:['scared','wow']};
const DEFS=`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="lvFlame" x="-25%" y="-35%" width="150%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".03 .11" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="1.1s" values=".03 .11;.05 .17;.02 .09;.03 .11" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="lvSmoke" x="-30%" y="-40%" width="160%" height="170%"><feTurbulence type="fractalNoise" baseFrequency=".02 .035" numOctaves="2" seed="8"><animate attributeName="baseFrequency" dur="3.4s" values=".02 .035;.035 .02;.02 .035" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="G" yChannelSelector="R"/></filter>
<filter id="lvWater" x="-25%" y="-15%" width="150%" height="130%"><feTurbulence type="turbulence" baseFrequency=".012 .09" numOctaves="1" seed="5"><animate attributeName="baseFrequency" dur="2.2s" values=".012 .09;.012 .14;.012 .09" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="B"/></filter>
<filter id="lvMelt" x="-25%" y="-15%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".09 .012" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" dur="4.2s" values="0;16;16;0" keyTimes="0;.4;.62;1" repeatCount="indefinite"/></feDisplacementMap></filter>
</defs></svg>`;
export function createLiving(ctx){
 const doc=document;let timer=0,bleedTimer=0,live=0,lastSound=0,started=false,lastBleed='';
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches;}catch{return false;}};
 function ensure(){if(doc.getElementById('livingDefs'))return;const d=doc.createElement('div');d.id='livingDefs';d.innerHTML=DEFS;doc.body.append(d);const fx=doc.createElement('div');fx.id='livingFx';fx.setAttribute('aria-hidden','true');doc.body.append(fx);}
 const visible=()=>{const out=[];const H=innerHeight;for(const c of doc.querySelectorAll('#viewPlay .element-chip')){const r=c.getBoundingClientRect();if(r.top>90&&r.bottom<H-70&&r.width)out.push(c);}return out;};
 // ---------- sound: small synthesised cues, never more than one every few seconds ----------
 function noise(ac,dur){const n=Math.floor(ac.sampleRate*dur),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=b;return s;}
 function sound(kind,loud=1){const now=Date.now();if(now-lastSound<(loud>1?600:7000))return;const ac=ctx.audio?.();if(!ac||ac.state==='closed')return;lastSound=now;
  try{const t=ac.currentTime+0.02,out=ac.createGain();out.gain.value=0.05*loud;out.connect(ac.destination);
   const tone=(f0,f1,d,type='sine',v=1,at=0)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+at);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);o.connect(g);g.connect(out);o.start(t+at);o.stop(t+at+d+0.05);};
   const hiss=(d,type,f0,f1,q=1,v=1,at=0)=>{const s=noise(ac,d),f=ac.createBiquadFilter(),g=ac.createGain();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t+at);f.frequency.exponentialRampToValueAtTime(f1,t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+d*0.25);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);s.connect(f);f.connect(g);g.connect(out);s.start(t+at);s.stop(t+at+d+0.05);};
   const crackle=(d,v=1)=>{for(let i=0;i<Math.round(d*14);i++)hiss(0.03,'highpass',2500+Math.random()*3000,1800,1,v*(0.4+Math.random()*0.8),Math.random()*d);};
   if(kind==='flame'){hiss(1.4,'lowpass',500,260,0.7,0.9);crackle(1.3,0.7);}
   else if(kind==='burn'){hiss(2.6,'lowpass',700,220,0.7,1.2);crackle(2.5,1);}
   else if(kind==='smoke'){hiss(1.6,'bandpass',900,2600,0.8,0.5);}
   else if(kind==='water'||kind==='flood'){hiss(kind==='flood'?2.4:1.3,'lowpass',400,1400,0.6,0.8);for(let i=0;i<5;i++)tone(500+Math.random()*500,900+Math.random()*600,0.09,'sine',0.35,Math.random()*1.2);}
   else if(kind==='melt'){for(let i=0;i<4;i++)tone(1500-i*120,700-i*60,0.12,'sine',0.5,0.4+i*0.55);}
   else if(kind==='frost'){for(let i=0;i<7;i++)tone(2200+Math.random()*1800,2600+Math.random()*1500,0.22,'triangle',0.3,i*0.16);hiss(1.6,'highpass',5000,7000,1,0.25);}
   else if(kind==='beat'){for(const a of [0,0.26,0.95,1.21])tone(95,48,0.16,'sine',1.6,a);}
   else if(kind==='erupt'||kind==='quake'){tone(70,34,1.2,'sawtooth',0.9);hiss(1.2,'lowpass',240,90,0.8,1.6);}
   else if(kind==='glow'){for(const [f,a] of [[1320,0],[1760,0.14],[2640,0.3]])tone(f,f*1.01,0.5,'sine',0.3,a);}
   else if(kind==='zap'||kind==='flash'){for(let i=0;i<4;i++)tone(1800+Math.random()*2400,200,0.07,'square',0.35,i*0.09);if(kind==='flash'){tone(90,30,1.4,'sawtooth',0.8,0.3);hiss(1.5,'lowpass',300,80,0.7,1.5,0.3);}}
   else if(kind==='flap'){for(let i=0;i<5;i++)hiss(0.11,'bandpass',700,300,1.2,0.8,i*0.2);}
   else if(kind==='swim'){for(let i=0;i<3;i++)tone(420+i*90,820+i*120,0.12,'sine',0.4,i*0.3);}
   else if(kind==='wind'||kind==='gust'){hiss(kind==='gust'?2.4:1.6,'bandpass',300,1300,2.2,kind==='gust'?1.5:0.7);}
   else if(kind==='spin'){tone(240,520,0.9,'triangle',0.3);}
   else if(kind==='bounce'){for(const [a,v] of [[0,0.9],[0.42,0.6],[0.72,0.35]])tone(300,120,0.12,'sine',v,a);}
   else if(kind==='shell'){tone(520,260,0.1,'triangle',0.5);tone(300,560,0.12,'triangle',0.5,2.2);}
   else if(kind==='critter'){tone(880,1250,0.08,'triangle',0.35);tone(990,1400,0.08,'triangle',0.3,0.16);}
  }catch{}}
 // ---------- one element comes alive ----------
 function play(chip,kind,ms,quiet){const art=chip.querySelector('.chip-art');if(!art||chip.classList.contains('is-live'))return false;live++;chip.dataset.live=kind;chip.classList.add('is-live');art.style.setProperty('--lv-ms',ms+'ms');
  if(!quiet&&kind!=='turn'&&Math.random()<0.45)sound(kind);
  setTimeout(()=>{chip.classList.remove('is-live');delete chip.dataset.live;live=Math.max(0,live-1);},ms+60);return true;}
 function tick(){clearTimeout(timer);timer=setTimeout(tick,rnd(2400,5200));if(!ctx.canRun?.()||reduced()||live>=2)return;
  const chips=visible();if(!chips.length)return;const withKind=chips.filter(c=>liveKind(ctx.nameOf(c.dataset.id)));
  const pool=withKind.length&&Math.random()<0.75?withKind:chips;const chip=pool[Math.floor(Math.random()*pool.length)];const kind=liveKind(ctx.nameOf(chip.dataset.id))||'turn';play(chip,kind,LIVE_MS[kind]||2400);}
 // ---------- rarely, the effect spills onto the screen ----------
 const el=(cls,css)=>{const d=doc.createElement('i');d.className=cls;if(css)d.style.cssText=css;return d;};
 function bleed(chip,type){ensure();const fx=doc.getElementById('livingFx');if(!fx||fx.childElementCount)return false;const r=chip.getBoundingClientRect(),x=r.left+22,y=r.top+r.height/2;const kind=liveKind(ctx.nameOf(chip.dataset.id));const ms=type==='quake'||type==='flash'?1800:4200;
  play(chip,kind,ms,true);lastSound=0;sound(type,2);lastBleed=type;
  if(type==='burn'){fx.append(el('lf-burn',`left:${x}px;top:${y}px`));for(let i=0;i<6;i++)fx.append(el('lf-ember',`left:${x+rnd(-70,70)}px;top:${y+rnd(-30,40)}px;animation-delay:${rnd(0.3,1.8)}s`));}
  else if(type==='smoke'){for(let i=0;i<9;i++)fx.append(el('lf-puff',`left:${x+rnd(-14,14)}px;top:${y-10}px;--dx:${rnd(-70,70)}px;--s:${rnd(2.2,4.4)};animation-delay:${i*0.22}s`));}
  else if(type==='flood'){fx.append(el('lf-flood'));fx.append(el('lf-flood is-back'));}
  else if(type==='frost'){fx.append(el('lf-frost',`--x:${x}px;--y:${y}px`));}
  else if(type==='gust'){for(let i=0;i<7;i++)fx.append(el('lf-streak',`top:${rnd(18,82)}%;animation-delay:${i*0.16}s;width:${rnd(70,170)}px`));visible().forEach((c,i)=>{setTimeout(()=>{c.classList.add('lv-gusted');setTimeout(()=>c.classList.remove('lv-gusted'),1300);},Math.max(0,(c.getBoundingClientRect().left/innerWidth)*700+i*8));});}
  else if(type==='quake'){doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),1300);fx.append(el('lf-none'));}
  else if(type==='flash'){fx.append(el('lf-flash'));}
  try{const [a,e]=REACT[type]||[];if(a)ctx.react?.(a,e,Math.min(ms,3000));}catch{}
  try{navigator.vibrate?.(type==='quake'?[30,40,30,40,60]:type==='flash'?20:0);}catch{}
  setTimeout(()=>{fx.replaceChildren();},ms+400);return true;}
 function bleedTick(first){clearTimeout(bleedTimer);bleedTimer=setTimeout(bleedTick,rnd(95000,190000));if(first||!ctx.canRun?.()||reduced())return;
  const c=visible().filter(c=>bleedOf(ctx.nameOf(c.dataset.id)));if(!c.length)return;const fresh=c.filter(x=>bleedOf(ctx.nameOf(x.dataset.id))!==lastBleed);const pool=fresh.length?fresh:c;const chip=pool[Math.floor(Math.random()*pool.length)];bleed(chip,bleedOf(ctx.nameOf(chip.dataset.id)));}
 return {start(){if(started)return;started=true;ensure();timer=setTimeout(tick,3500);bleedTimer=setTimeout(()=>bleedTick(false),rnd(45000,80000));},
  /** test hooks */ playId(id,kind){ensure();const c=[...doc.querySelectorAll('#viewPlay .element-chip')].find(x=>x.dataset.id===id);return c?play(c,kind||liveKind(ctx.nameOf(id))||'turn',LIVE_MS[kind||liveKind(ctx.nameOf(id))||'turn']||2400):false;},
  bleedId(id,type){ensure();const c=[...doc.querySelectorAll('#viewPlay .element-chip')].find(x=>x.dataset.id===id);return c?bleed(c,type||bleedOf(ctx.nameOf(id))):false;},sound};
}
