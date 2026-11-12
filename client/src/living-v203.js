// V203: living elements. Now and then one element on screen moves by itself (the flame flickers, ice melts and
// re-forms, a heart beats, wings flap, a shell hides) and, rarely, its effect spills onto the screen (fire scorches
// like paper, smoke drifts up, frost creeps in) and the companions react. Never everything at once.
// A term matches a name only when it IS the name or its head noun (last words): "Wild Fire" burns, "Fire Truck" does not.
const X=s=>{const terms=new Set(s.split('|'));return {test:n=>terms.has(n)};};   // exact names only (a Ferris Wheel is not a wheel)
const W=s=>{const terms=s.split('|');const hit=n=>terms.some(t=>n===t||n.endsWith(' '+t));return {test:n=>hit(n)||(n.endsWith('s')&&hit(n.slice(0,-1)))};};
export const LIVE_RULES=[
 ['shell',W('hermit crab|turtle|tortoise|snail|clam|oyster|armadillo|hedgehog|pangolin|nautilus|mussel|scallop')],
 ['erupt',W('volcano|geyser|eruption|supervolcano|lava fountain|champagne|soda')],
 ['melt',W('ice cube|ice|icicle|snowman|glacier|iceberg|ice cream|butter|popsicle|snowball|wax|chocolate|cheese fondue|sorbet|slush')],
 ['beat',W('life|heart|love|pulse|blood|heartbeat|soul|romance|valentine')],
 ['flame',W('fire|flame|campfire|bonfire|wildfire|torch|blaze|inferno|fireball|ember|burning bush|pyre|hellfire|dragon breath')],
 ['smoke',W('smoke|steam|vapor|vapour|mist|fog|haze|smog|incense|fume|exhaust|cloud|breath|ash cloud|ghost|spirit|phantom|wraith|specter|spectre')],
 ['glow',W('cake|birthday cake|candle|lamp|lantern|light bulb|bulb|star|sun|light|firefly|glow|aurora|gem|diamond|crystal|gold|treasure|neon|halo|chandelier|lighthouse|moon|supernova|comet|sparkler|menorah|jack-o-lantern|christmas tree')],
 ['zap',W('electricity|lightning|energy|spark|battery|plasma|laser|thunderbolt|tesla coil|static|power|voltage|circuit|taser|thunder')],
 ['flap',W('angel|bird|butterfly|bat|dragon|fairy|bee|eagle|owl|pegasus|phoenix|moth|duck|goose|swan|parrot|crow|raven|hawk|falcon|dove|pigeon|sparrow|seagull|wasp|dragonfly|griffin|pterosaur|pterodactyl|cherub|harpy|wyvern|hummingbird|pelican|vulture|chicken|rooster|turkey|penguin|fly|mosquito|ladybug|wings?')],
 ['swim',W('fish|shark|whale|dolphin|eel|squid|octopus|jellyfish|seal|otter|tadpole|goldfish|salmon|tuna|stingray|manta ray|seahorse|koi|piranha|swordfish|orca|narwhal|mermaid|kraken|anglerfish|pufferfish|clownfish|axolotl|shrimp|lobster|crab')],
 ['critter',W('cat|dog|fox|wolf|bear|lion|tiger|mouse|rat|rabbit|bunny|frog|toad|spider|lizard|monkey|horse|cow|pig|sheep|goat|deer|squirrel|raccoon|panda|koala|kangaroo|elephant|giraffe|zebra|hippo|rhino|camel|llama|alpaca|hamster|ferret|badger|beaver|mole|skunk|gorilla|chimpanzee|sloth|scorpion|ant|beetle|caterpillar|worm|snake|crocodile|alligator|dinosaur|t-rex|raptor|kitten|puppy|cub|lamb|pony|donkey|moose|bison|boar|leopard|cheetah|jaguar|puma|lynx|hyena|meerkat|gecko|iguana|chameleon|salamander|newt|unicorn|werewolf|yeti|goblin|troll|imp|gremlin|monster|creature|animal|pet|beast')],
 ['spin',X('wheel|cog|hurricane|cyclone|vortex|whirlpool|galaxy|coin|spinner|vinyl|record|yo-yo|frisbee|boomerang|saw blade|black hole|portal|pinwheel|roulette|donut|bagel|tire|tyre|ring|shuriken|snowflake|cookie|pizza|steering wheel')],
 ['water',W('water|sea|ocean|wave|river|lake|pond|puddle|tide|pool|stream|waterfall|flood|tsunami|drop|droplet|dew|swamp|bay|lagoon|creek|rapids|liquid|puddle')],
 ['hover',W('hot air balloon|ufo|drone|satellite|kite|cloud nine|blimp|zeppelin|space station|parachute|paper plane|feather|magic carpet|hoverboard|levitation')],
 ['wind',W('wind|air|breeze|gust|gale|leaf|leaves|grass|flag|tree|plant|flower|wheat|feather|kite|reed|bamboo|palm tree|willow|sail|sailboat|curtain|scarf|banner|windsock|dandelion|tumbleweed|seaweed|kelp|vine|fern|sapling|sprout|bush|corn|rice|lavender|tulip|rose|sunflower|daisy')],
 ['quake',W('earthquake|explosion|bomb|dynamite|drum|bell|alarm|alarm clock|avalanche|landslide|jackhammer|grenade|tnt|gong|sonic boom|chainsaw|drill|phone|telephone|maraca|rattle')],
 ['bounce',W('ball|balloon|bubble|jelly|slime|spring|trampoline|pudding|marshmallow|gum|bubblegum|rubber|basketball|football|soccer ball|tennis ball|beach ball|blob|jello|mochi|pogo stick|popcorn')],
];

// V204: where the art is made of known shapes, only the right part moves (blades, wings, tail, eyes, flame, pendulum...).
// [shape indexes, motion, origin 'x y' in the 100×100 art ('c' = the shape's own centre), css vars, delay fraction]
export const PARTS={
 'wind turbine':{n:12,redraw:1,p:[[[6,7,9],'spin','50 34']]},
 'windmill':{n:24,redraw:1,p:[[[7,11,15,19],'spin','50 36']]},
 'gear':{n:12,redraw:1,p:[[[2,3,4,5,6,7,8,9,10],'spin','50 48']]},
 'hermit crab':{n:18,redraw:1,p:[[[3,4,8,9,10,11,12,13,14,15,16,17],'tuck','34 60',{'--px':'24px','--py':'-12px'}],[[5,6,7],'wiggle','55 66']]},
 'cake':{n:9,redraw:1,p:[[[8],'flick','50 30']]},
 'candle':{n:11,p:[[[9,10],'flick','50 35'],[[2],'pulse','50 24']]},
 'campfire':{n:18,redraw:1,p:[[[5,6],'flick','50 76'],[[16,17],'rise','50 18']]},
 'butterfly':{n:7,p:[[[1,2,5,6],'flapc','50 55']],whole:'hover'},
 'bat':{n:18,p:[[[2,3,4],'flapc','50 50'],[[13,14],'look','c']],whole:'hover'},
 'bee':{n:8,p:[[[3],'buzz','46 42'],[[4],'buzz','55 42']],whole:'hover'},
 'metronome':{n:10,redraw:1,p:[[[6,7],'tilt','50 76',{'--pa':'-37deg'}]]},
 'seesaw':{n:12,p:[[[5,6,7,8,9,10,11],'tilt','50 56',{'--pa':'37deg'}]]},
 'compass':{n:5,p:[[[2,3],'swing','50 50',{'--pa':'38deg'}]]},
 'weather vane':{n:9,p:[[[4,5],'twist','50 31']]},
 'tornado':{n:3,p:[[[2],'twist','50 60'],[[1],'bob','50 25']]},
 'crab':{n:7,p:[[[2],'pinch','50 57'],[[5,6],'look','c']]},
 'octopus':{n:5,p:[[[2],'pinch','50 55'],[[3,4],'blink','c']]},
 'jellyfish':{n:4,p:[[[1,2],'pulse','50 57'],[[3],'squish','50 58']],whole:'hover'},
 'lighthouse':{n:7,p:[[[5],'blinko','50 28']]},
 'satellite':{n:7,p:[[[6],'blinko','c']],whole:'hover'},
 'volcano':{n:11,redraw:1,p:[[[7,8,9],'rise','50 20'],[[4],'pulse','50 36'],[[5,6],'squish','50 38']],whole:'erupt'},
 'hourglass':{n:13,p:[[[3],'drain','50 48'],[[5],'fill','50 81']]},
 'owl':{n:10,p:[[[5,6,7,8],'look','c'],[[3,4],'blink','c',null,0.5]]},
 'bird':{n:5,p:[[[2],'tilt','70 56',{'--pa':'14deg'}],[[3],'blink','c']],whole:'critter'},
 'frog':{n:8,p:[[[4,5],'blink','c'],[[1],'puff','50 84']]},
 'balloon':{n:5,p:[[[1,2,3],'bob','50 66'],[[4],'wiggle','50 73']]},
 'sailboat':{n:6,p:[[[1,2,3,4],'swing','48 84',{'--pa':'6deg'}],[[5],'slide','50 88']]},
 'flower':{n:14,redraw:1,p:[[[5,6,7,8,9,10,11,12,13],'pulse','50 36'],[[3,4],'wiggle','50 76']]},
 'flag':{n:9,p:[[[5,6,7,8],'wave','23 38']]},
 'cat':{n:20,p:[[[2,3,4],'wag','66 86'],[[13,14,15,16],'blink','c'],[[8],'tap','c'],[[9],'tap','c',null,0.5]]},
 'dog':{n:24,p:[[[2,3],'wag','66 80'],[[15,16],'pant','50 47'],[[12],'wiggle','37 24'],[[13],'wiggle','63 24'],[[19,20,21,22],'blink','c']]},
 'whale':{n:17,p:[[[3,4,5,6,7],'spout','34 36'],[[12,13],'blink','c'],[[2],'slide','50 84']]},
 'grandfather clock':{n:16,p:[[[5,6],'swing','50 41',{'--pa':'13deg'}],[[11],'spin','50 21']]},
 'cuckoo clock':{n:20,p:[[[17,18],'pop','50 28',{'--px':'9px','--py':'-1px'}],[[7,8],'swing','50 68',{'--pa':'13deg'}],[[14],'spin','50 51']]},
 'rocking horse':{n:19,p:[[[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],'swing','50 88',{'--pa':'8deg'}]]},
 'snake':{n:12,p:[[[6],'tongue','84 18.5'],[[7,8,9,10,11],'bob','62 22'],[[9,10],'blink','c',null,0.5]]},
 'hot air balloon':{n:8,p:[[[7],'blinko','c']],whole:'hover'},
};
export const PART_ITER={spin:1,swing:3,tilt:2,flapc:7,flick:6,tuck:1,pop:1,wiggle:6,pinch:6,look:1,blink:1,blinko:4,rise:3,pulse:3,puff:2,drain:1,fill:1,twist:2,bob:3,slide:2,wave:3,wag:7,tap:5,pant:8,spout:1,squish:3,buzz:16,tongue:4};
/** Pure: the whole-picture motion an element name gets from the rules ('' = none). */
export function ruleKind(name=''){const n=String(name).toLowerCase();for(const [k,re] of LIVE_RULES)if(re.test(n))return k;return '';}
/** Pure: which built-in motion an element name gets ('' = only the paper turn). */
export function liveKind(name=''){const n=String(name).toLowerCase();return PARTS[n]?'parts':ruleKind(n);}
// V204: effects that spill onto the screen — many elements have one, always starting visibly AT the element
export const BLEED_RULES=[
 ['web',W('spider|web|cobweb|spiderweb|tarantula')],
 ['pull',W('gravity|black hole|magnet|vortex|whirlpool|vacuum|vacuum cleaner|tractor beam|ufo')],
 ['ghost',W('ghost|spirit|phantom|halloween|haunted house|poltergeist|wraith|specter|spectre|graveyard|zombie|skeleton|soul|grim reaper')],
 ['rainbow',W('rainbow|prism|unicorn|aurora')],
 ['ink',W('ink|squid|octopus|oil|tar|paint|kraken|oil spill|petroleum')],
 ['gold',W('gold|treasure|coin|money|jackpot|bank|pirate|leprechaun|diamond|vault|casino|slot machine|treasure chest')],
 ['sparks',W('firework|fireworks|spark|sparkler|comet|shooting star|supernova|star|magic|wizard|wand|fairy|spell|wish')],
 ['confetti',W('party|birthday|celebration|cake|festival|carnival|new year|parade|pinata|circus|clown|gift|present|birthday cake')],
 ['music',W('music|song|melody|piano|guitar|flute|sound|violin|radio|orchestra|band|singer|trumpet|harp|jukebox|concert|drum|music box|opera|choir|metronome|bell')],
 ['hearts',W('love|heart|life|romance|kiss|valentine|cupid|wedding|hug|friendship')],
 ['zzz',W('sleep|dream|pillow|bed|lullaby|nap|hypnosis|sloth|sandman')],
 ['stink',W('garbage|trash|skunk|rotten egg|sewer|onion|garlic|fart|stink|manure|compost|dung|sock|durian|landfill')],
 ['bubbles',W('bubble|soap|shampoo|foam|soda|champagne|bath|bubblegum|detergent|washing machine|jacuzzi|beer')],
 ['bloom',W('flower|garden|spring|blossom|pollen|rose|tulip|cherry blossom|meadow|bouquet|sakura|daisy|sunflower|lotus|butterfly|bee')],
 ['snow',W('snow|blizzard|winter|snowflake|snowman|snowstorm|avalanche')],
 ['frost',W('ice|ice cube|frost|glacier|iceberg|freezer|icicle|permafrost|ice age')],
 ['burn',W('fire|flame|wildfire|bonfire|blaze|inferno|fireball|lava|magma|dragon|torch|hellfire|phoenix|candle')],
 ['smoke',W('smoke|steam|campfire|smog|exhaust|incense|chimney|cigar|factory|ash|fog|mist')],
 ['bolt',W('lightning|thunder|electricity|energy|thunderstorm|storm|tesla coil|plasma|zeus|thor')],
 ['quake',W('earthquake|volcano|explosion|bomb|dynamite|meteor|asteroid|tnt|eruption|landslide|giant|stampede|dinosaur|kaiju')],
 ['gust',W('wind|air|breeze|gale|hurricane|tornado|typhoon|cyclone|fan|wind turbine|windmill')],
 ['flood',W('water|sea|ocean|wave|tsunami|flood|river|rain|waterfall|tide|lake|monsoon|whale')],
 ['night',W('moon|night|darkness|shadow|eclipse|midnight|dusk|bat|vampire|owl')],
 ['sunrise',W('sun|day|sunlight|sunshine|dawn|sunrise|summer|light|daylight|lighthouse')],
 ['sand',W('sand|desert|sandstorm|dust|dune|dust storm|beach|hourglass')],
];
/** Pure: the screen effect an element can spill ('' = none). */
export function bleedOf(name=''){const n=String(name).toLowerCase();for(const [k,re] of BLEED_RULES)if(re.test(n))return k;return '';}
// how the companions take it: [pose, expression]
export const REACT={burn:['scared','wow'],smoke:['sniff','dizzy'],flood:['hopwalk','happy'],frost:['scared','sad'],snow:['scared','sad'],gust:['push','angry'],quake:['scared','wow'],bolt:['scared','wow'],
 hearts:['wave','love'],bubbles:['jump','happy'],night:['sleep','sleepy'],zzz:['sleep','sleepy'],sunrise:['stretch','happy'],music:['duo-cheer','happy'],bloom:['sniff','happy'],confetti:['celebrate','happy'],sparks:['celebrate','wow'],
 gold:['celebrate','wow'],ink:['sulk','sad'],web:['scared','wow'],pull:['tumble','dizzy'],ghost:['duo-cover','wow'],rainbow:['wave','wow'],sand:['shake','dizzy'],stink:['refuse','sad']};
export const LIVE_MS={flame:3200,smoke:3600,water:3200,melt:4200,beat:2400,erupt:3000,glow:3000,zap:1800,flap:2600,swim:2800,critter:2600,spin:2600,wind:3200,quake:1500,bounce:2200,shell:3800,hover:3000,parts:3400,turn:2000};
export const BLEED_MS={quake:2000,bolt:2000,pull:2600};
const DEFS=`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="lvFlame" x="-25%" y="-35%" width="150%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".03 .11" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="1.1s" values=".03 .11;.05 .17;.02 .09;.03 .11" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="lvSmoke" x="-30%" y="-40%" width="160%" height="170%"><feTurbulence type="fractalNoise" baseFrequency=".02 .035" numOctaves="2" seed="8"><animate attributeName="baseFrequency" dur="3.4s" values=".02 .035;.035 .02;.02 .035" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="G" yChannelSelector="R"/></filter>
<filter id="lvWater" x="-25%" y="-15%" width="150%" height="130%"><feTurbulence type="turbulence" baseFrequency=".012 .09" numOctaves="1" seed="5"><animate attributeName="baseFrequency" dur="2.2s" values=".012 .09;.012 .14;.012 .09" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="B"/></filter>
<filter id="lvMelt" x="-25%" y="-15%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".09 .012" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" dur="4.2s" values="0;16;16;0" keyTimes="0;.4;.62;1" repeatCount="indefinite"/></feDisplacementMap></filter>
</defs></svg>`;
export function createLiving(ctx){
 const doc=document;let timer=0,bleedTimer=0,live=0,lastSound=0,started=false,lastBleed='';
 const MAX_LIVE=8;
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches;}catch{return false;}};
 function ensure(){if(doc.getElementById('livingDefs'))return;const d=doc.createElement('div');d.id='livingDefs';d.innerHTML=DEFS;doc.body.append(d);const fx=doc.createElement('div');fx.id='livingFx';fx.setAttribute('aria-hidden','true');doc.body.append(fx);}
 const visible=()=>{const out=[];const H=innerHeight;for(const c of doc.querySelectorAll('#viewPlay .element-chip')){const r=c.getBoundingClientRect();if(r.top>90&&r.bottom<H-70&&r.width)out.push(c);}return out;};
 const nameOf=c=>ctx.nameOf(c.dataset.id)||'';
 // ---------- sound: small synthesised cues ----------
 function noise(ac,dur){const n=Math.floor(ac.sampleRate*dur),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=b;return s;}
 function sound(kind,loud=1){const now=Date.now();if(now-lastSound<(loud>1?600:6000))return;const ac=ctx.audio?.();if(!ac||ac.state==='closed')return;lastSound=now;
  try{const t=ac.currentTime+0.02,out=ac.createGain();out.gain.value=0.05*loud;out.connect(ac.destination);
   const tone=(f0,f1,d,type='sine',v=1,at=0)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+at);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);o.connect(g);g.connect(out);o.start(t+at);o.stop(t+at+d+0.05);};
   const hiss=(d,type,f0,f1,q=1,v=1,at=0)=>{const s=noise(ac,d),f=ac.createBiquadFilter(),g=ac.createGain();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t+at);f.frequency.exponentialRampToValueAtTime(f1,t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+d*0.25);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);s.connect(f);f.connect(g);g.connect(out);s.start(t+at);s.stop(t+at+d+0.05);};
   const crackle=(d,v=1)=>{for(let i=0;i<Math.round(d*14);i++)hiss(0.03,'highpass',2500+Math.random()*3000,1800,1,v*(0.4+Math.random()*0.8),Math.random()*d);};
   const notes=(fs,step=0.16,type='sine',v=0.4,d=0.3)=>fs.forEach((f,i)=>tone(f,f*1.005,d,type,v,i*step));
   if(kind==='flame'){hiss(1.4,'lowpass',500,260,0.7,0.9);crackle(1.3,0.7);}
   else if(kind==='burn'){hiss(2.6,'lowpass',700,220,0.7,1.2);crackle(2.5,1);}
   else if(kind==='smoke'){hiss(1.6,'bandpass',900,2600,0.8,0.5);}
   else if(kind==='water'||kind==='flood'){hiss(kind==='flood'?2.4:1.3,'lowpass',400,1400,0.6,0.8);for(let i=0;i<5;i++)tone(500+Math.random()*500,900+Math.random()*600,0.09,'sine',0.35,Math.random()*1.2);}
   else if(kind==='melt'){for(let i=0;i<4;i++)tone(1500-i*120,700-i*60,0.12,'sine',0.5,0.4+i*0.55);}
   else if(kind==='frost'||kind==='snow'){for(let i=0;i<7;i++)tone(2200+Math.random()*1800,2600+Math.random()*1500,0.22,'triangle',0.3,i*0.16);hiss(1.6,'highpass',5000,7000,1,0.25);}
   else if(kind==='beat'){for(const a of [0,0.26,0.95,1.21])tone(95,48,0.16,'sine',1.6,a);}
   else if(kind==='hearts'){notes([660,880,990,1320],0.2,'sine',0.4,0.5);for(const a of [0,0.26])tone(95,48,0.16,'sine',1.2,a);}
   else if(kind==='erupt'||kind==='quake'){tone(70,34,1.2,'sawtooth',0.9);hiss(1.2,'lowpass',240,90,0.8,1.6);}
   else if(kind==='glow'||kind==='sunrise'){notes(kind==='sunrise'?[523,659,784,1047,1319]:[1320,1760,2640],0.15,'sine',0.3,0.6);}
   else if(kind==='zap'||kind==='bolt'){for(let i=0;i<4;i++)tone(1800+Math.random()*2400,200,0.07,'square',0.35,i*0.09);if(kind==='bolt'){tone(90,30,1.4,'sawtooth',0.8,0.3);hiss(1.5,'lowpass',300,80,0.7,1.5,0.3);}}
   else if(kind==='flap'||kind==='hover'){for(let i=0;i<5;i++)hiss(0.11,'bandpass',700,300,1.2,0.8,i*0.2);}
   else if(kind==='swim'||kind==='bubbles'){for(let i=0;i<(kind==='bubbles'?9:3);i++)tone(420+Math.random()*500,900+Math.random()*700,0.1,'sine',0.4,i*(kind==='bubbles'?0.17:0.3));}
   else if(kind==='wind'||kind==='gust'||kind==='sand'){hiss(kind==='wind'?1.6:2.4,'bandpass',300,kind==='sand'?2400:1300,2.2,kind==='wind'?0.7:1.5);}
   else if(kind==='spin'||kind==='pull'){tone(kind==='pull'?700:240,kind==='pull'?60:520,kind==='pull'?1.4:0.9,'triangle',0.4);}
   else if(kind==='bounce'){for(const [a,v] of [[0,0.9],[0.42,0.6],[0.72,0.35]])tone(300,120,0.12,'sine',v,a);}
   else if(kind==='shell'){tone(520,260,0.1,'triangle',0.5);tone(300,560,0.12,'triangle',0.5,2.2);}
   else if(kind==='critter'||kind==='parts'){tone(880,1250,0.08,'triangle',0.35);tone(990,1400,0.08,'triangle',0.3,0.16);}
   else if(kind==='music'){notes([523,659,784,659,880,784,1047],0.17,'triangle',0.45,0.28);}
   else if(kind==='bloom'||kind==='rainbow'){notes(kind==='rainbow'?[523,587,659,698,784,880,988,1047]:[784,988,1175,1568],0.13,'sine',0.3,0.45);}
   else if(kind==='confetti'||kind==='sparks'){for(let i=0;i<6;i++)hiss(0.06,'highpass',1800,900,1,1,i*0.11+Math.random()*0.05);crackle(1.2,0.5);if(kind==='sparks')tone(300,1800,0.4,'sine',0.3);}
   else if(kind==='gold'){for(let i=0;i<8;i++)tone(2400+Math.random()*900,2300,0.09,'triangle',0.45,i*0.11);}
   else if(kind==='ink'){tone(160,60,0.5,'sine',1);hiss(0.5,'lowpass',500,120,1,0.9);}
   else if(kind==='web'){for(let i=0;i<5;i++)tone(900+i*220,880+i*220,0.18,'triangle',0.3,i*0.1);}
   else if(kind==='ghost'){const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.frequency.setValueAtTime(420,t);o.frequency.linearRampToValueAtTime(620,t+1);o.frequency.linearRampToValueAtTime(380,t+2.2);l.frequency.value=6;lg.gain.value=18;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.8,t+0.4);g.gain.exponentialRampToValueAtTime(0.0001,t+2.3);o.connect(g);g.connect(out);o.start(t);l.start(t);o.stop(t+2.4);l.stop(t+2.4);}
   else if(kind==='night'||kind==='zzz'){notes([784,659,587,523,392],0.32,'sine',0.35,0.7);}
   else if(kind==='stink'){tone(110,70,0.35,'sawtooth',0.7);hiss(0.4,'bandpass',300,180,3,0.9,0.05);}
  }catch{}}
 // ---------- one element comes alive ----------
 function applyParts(art,spec,ms){const svg=art.querySelector('svg');if(!svg)return null;const all=[...svg.querySelectorAll('*')];if(all.length!==spec.n)return null;const done=[],wraps=[];
  for(const [idx,anim,origin,vars,delay] of spec.p){const it=PART_ITER[anim]||1;for(const i of idx){let g=all[i];if(!g)continue;if(g.hasAttribute('transform')){const w=doc.createElementNS('http://www.w3.org/2000/svg','g');g.replaceWith(w);w.append(g);wraps.push(w);g=w;}if(origin==='c'){g.style.transformBox='fill-box';g.style.transformOrigin='50% 50%';}else{const [x,y]=origin.split(' ');g.style.transformBox='view-box';g.style.transformOrigin=`${x}px ${y}px`;}
    if(vars)for(const k in vars)g.style.setProperty(k,vars[k]);g.style.animation=`lvp-${anim} ${Math.round(ms/it)}ms ease-in-out ${delay?Math.round(ms/it*delay):0}ms ${it} both`;done.push(g);}}
  return ()=>{for(const g of done){g.style.animation='';g.style.transformBox='';g.style.transformOrigin='';}for(const w of wraps){try{w.replaceWith(...w.childNodes);}catch{}}};}
 function play(chip,kind,ms,quiet){const art=chip.querySelector('.chip-art');if(!art||chip.classList.contains('is-live'))return false;let undo=null;
  if(kind==='parts'){const spec=PARTS[nameOf(chip).toLowerCase()];undo=spec?applyParts(art,spec,ms):null;if(!undo){kind=ruleKind(nameOf(chip))||'turn';ms=LIVE_MS[kind]||ms;}else kind=spec.whole||'parts';}
  live++;chip.dataset.live=kind;chip.classList.add('is-live');art.style.setProperty('--lv-ms',ms+'ms');
  if(!quiet&&kind!=='turn'&&Math.random()<0.3)sound(kind);
  setTimeout(()=>{chip.classList.remove('is-live');delete chip.dataset.live;try{undo?.();}catch{}live=Math.max(0,live-1);},ms+60);return true;}
 function tick(){clearTimeout(timer);timer=setTimeout(tick,rnd(650,1500));if(!ctx.canRun?.()||reduced()||live>=MAX_LIVE)return;
  const chips=visible().filter(c=>!c.classList.contains('is-live'));if(!chips.length)return;const withKind=chips.filter(c=>liveKind(nameOf(c)));
  const pool=withKind.length&&Math.random()<0.6?withKind:chips;const chip=pool[Math.floor(Math.random()*pool.length)];const kind=liveKind(nameOf(chip))||'turn';play(chip,kind,LIVE_MS[kind]||2400);}
 // ---------- one effect at a time spills onto the screen, clearly from its element ----------
 const el=(cls,css,txt)=>{const d=doc.createElement('i');d.className=cls;if(css)d.style.cssText=css;if(txt)d.textContent=txt;return d;};
 function bleed(chip,type){ensure();const fx=doc.getElementById('livingFx');if(!fx||fx.childElementCount||!REACT[type])return false;const r=chip.getBoundingClientRect(),x=r.left+24,y=r.top+r.height/2;const ms=BLEED_MS[type]||4400;
  fx.style.setProperty('--x',x+'px');fx.style.setProperty('--y',y+'px');
  const kind=liveKind(nameOf(chip))||'turn';play(chip,kind,Math.max(ms,LIVE_MS[kind]||0),true);chip.classList.add('is-source');lastSound=0;sound(type,2);lastBleed=type;
  // the source is unmistakable: the chip lifts and two rings leave it
  for(let i=0;i<2;i++)fx.append(el('lf-ring',`animation-delay:${i*0.28}s`));
  const at=(dx=0,dy=0)=>`left:${x+dx}px;top:${y+dy}px;`;
  const rise=(cls,n,txts,spread=40)=>{for(let i=0;i<n;i++)fx.append(el('lf-rise '+cls,at(rnd(-12,12),-8)+`--dx:${rnd(-spread,spread)}px;--s:${rnd(0.8,1.5)};--r:${rnd(-30,30)}deg;animation-delay:${0.25+i*(2.6/n)}s`,txts?txts[i%txts.length]:''));};
  const burst=(cls,n,txts,cols)=>{for(let i=0;i<n;i++){const a=rnd(-Math.PI,0.25),d=rnd(70,230);fx.append(el('lf-burst '+cls,at()+`--bx:${Math.cos(a)*d}px;--by:${Math.sin(a)*d}px;--fall:${rnd(160,420)}px;--r:${rnd(-360,360)}deg;animation-delay:${0.2+rnd(0,0.9)}s;${cols?'background:'+cols[i%cols.length]:''}`,txts?txts[i%txts.length]:''));}};
  const wash=cls=>fx.append(el('lf-wash '+cls));
  if(type==='burn'){fx.append(el('lf-burn',at()));for(let i=0;i<7;i++)fx.append(el('lf-ember',at(rnd(-70,70),rnd(-30,40))+`animation-delay:${rnd(0.3,1.8)}s`));}
  else if(type==='smoke'){for(let i=0;i<10;i++)fx.append(el('lf-puff',at(rnd(-14,14),-10)+`--dx:${rnd(-70,70)}px;--s:${rnd(2.2,4.4)};animation-delay:${0.2+i*0.22}s`));}
  else if(type==='flood'){wash('is-water');rise('lf-bubble',8);}
  else if(type==='frost'){wash('is-frost');burst('lf-glyph is-ice',10,['❄','✦','❄']);}
  else if(type==='snow'){burst('lf-glyph is-ice',22,['❄','•','❄','·']);wash('is-snow');}
  else if(type==='gust'){for(let i=0;i<8;i++)fx.append(el('lf-streak',at(0,rnd(-60,60))+`animation-delay:${0.2+i*0.14}s;width:${rnd(70,170)}px`));visible().forEach(c=>{const b=c.getBoundingClientRect();setTimeout(()=>{c.classList.add('lv-gusted');setTimeout(()=>c.classList.remove('lv-gusted'),1300);},300+Math.max(0,Math.hypot(b.left-x,b.top-y))*2.2);});}
  else if(type==='quake'){for(let i=0;i<3;i++)fx.append(el('lf-ring is-shock',`animation-delay:${0.15+i*0.22}s`));setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),1300);},250);}
  else if(type==='bolt'){const pts=[];let px=x,py=y;while(py>0){pts.push(px+','+py);px+=rnd(-34,34);py-=rnd(30,70);}pts.push(px+',-10');const b=el('lf-bolt');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><polyline points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#9AD8FF" stroke-width="3" stroke-linejoin="round"/></svg>`;fx.append(b);fx.append(el('lf-flash'));}
  else if(type==='hearts')rise('lf-glyph is-heart',14,['❤','♥','❤'],70);
  else if(type==='bubbles')rise('lf-bubble',16,null,90);
  else if(type==='night'){wash('is-night');burst('lf-glyph is-star',12,['✦','✧','★']);}
  else if(type==='zzz'){wash('is-dim');rise('lf-glyph is-zzz',9,['z','Z','z'],50);}
  else if(type==='sunrise'){wash('is-sun');fx.append(el('lf-rays',at()));}
  else if(type==='music')rise('lf-glyph is-note',13,['♪','♫','♩','♬'],80);
  else if(type==='bloom')burst('lf-petal',22,null,['#F7A4BB','#F9C5D1','#FFD96A','#F28FAD']);
  else if(type==='confetti')burst('lf-confetti',30,null,['#E8843C','#6FB26A','#FFD166','#5AAED2','#D9584A','#B39DDB']);
  else if(type==='sparks'){burst('lf-spark',26,null,['#FFD166','#FFF3C4','#FFB347','#9AD8FF']);}
  else if(type==='gold')burst('lf-coin',18);
  else if(type==='ink'){fx.append(el('lf-ink',at()));for(let i=0;i<5;i++)fx.append(el('lf-drip',at(rnd(-60,60),rnd(10,50))+`animation-delay:${0.7+i*0.2}s;height:${rnd(40,110)}px`));}
  else if(type==='web'){const W=innerWidth,H=innerHeight;const ends=[[0,0],[W/2,0],[W,0],[W,H/2],[W,H],[W/2,H],[0,H],[0,H/2]];const b=el('lf-web');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke="rgba(245,245,250,.9)" stroke-width="1.6">${ends.map(([ex,ey])=>`<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}"/>`).join('')}${[50,110,180,260].map(q=>`<polygon points="${ends.map(([ex,ey])=>{const d=Math.hypot(ex-x,ey-y)||1;return (x+(ex-x)/d*q)+','+(y+(ey-y)/d*q);}).join(' ')}"/>`).join('')}</svg>`;fx.append(b);}
  else if(type==='pull'){fx.append(el('lf-hole',at()));visible().forEach(c=>{if(c===chip)return;const b=c.getBoundingClientRect();c.style.setProperty('--gx',(x-b.left-b.width/2)*0.28+'px');c.style.setProperty('--gy',(y-b.top-b.height/2)*0.28+'px');c.classList.add('lv-pulled');setTimeout(()=>c.classList.remove('lv-pulled'),2300);});}
  else if(type==='ghost'){fx.append(el('lf-ghost',at()+`--gx:${(x<innerWidth/2?1:-1)*rnd(120,220)}px`));wash('is-dim');}
  else if(type==='rainbow')fx.append(el('lf-rainbow',at()));
  else if(type==='sand'){wash('is-sand');for(let i=0;i<8;i++)fx.append(el('lf-streak is-sand',at(0,rnd(-80,80))+`animation-delay:${0.2+i*0.14}s;width:${rnd(60,150)}px`));}
  else if(type==='stink')rise('lf-glyph is-stink',10,['〰','~','〰'],60);
  try{const [a,e]=REACT[type];setTimeout(()=>ctx.react?.(a,e,Math.min(ms-500,3200)),500);}catch{}
  try{if(type==='quake')navigator.vibrate?.([30,40,30,40,60]);else if(type==='bolt')navigator.vibrate?.(25);}catch{}
  setTimeout(()=>{fx.replaceChildren();chip.classList.remove('is-source');},ms+300);return true;}
 function bleedTick(){clearTimeout(bleedTimer);bleedTimer=setTimeout(bleedTick,rnd(55000,110000));if(!ctx.canRun?.()||reduced())return;
  const c=visible().filter(c=>bleedOf(nameOf(c)));if(!c.length)return;const fresh=c.filter(x=>bleedOf(nameOf(x))!==lastBleed);const pool=fresh.length?fresh:c;const chip=pool[Math.floor(Math.random()*pool.length)];bleed(chip,bleedOf(nameOf(chip)));}
 const find=id=>[...doc.querySelectorAll('#viewPlay .element-chip')].find(x=>x.dataset.id===id);
 return {start(){if(started)return;started=true;ensure();timer=setTimeout(tick,2500);bleedTimer=setTimeout(bleedTick,rnd(25000,45000));},
  /** test hooks */ playId(id,kind){ensure();const c=find(id);const k=kind||liveKind(ctx.nameOf(id))||'turn';return c?play(c,k,LIVE_MS[k]||2400):false;},
  bleedId(id,type){ensure();const c=find(id);return c?bleed(c,type||bleedOf(ctx.nameOf(id))):false;},sound};
}
