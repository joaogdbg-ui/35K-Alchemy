/* V136: companion coins economy — Black Market catalogue, wearable accessories and School lessons.
 * Pure data + drawing helpers (no DOM, no storage). The app owns the wallet; the companion engine draws
 * the accessories; the games module pays coins and opens the Market/School sheets. */
const S='#4a4a5a';
const f=n=>(+n).toFixed(1);
// ---------- accessories ----------
// Each draw(s) returns SVG in a local frame: head items → origin at the top-centre of the head, s = head width;
// face items → origin between the eyes, s = head width; neck items → origin at the top-centre of the body, s = body width.
export const ACCESSORIES={
 'party-hat':{name:'Party hat',slot:'head',draw:s=>`<path d="M${f(-s*.2)} 0L0 ${f(-s*.55)}L${f(s*.2)} 0Z" fill="#9b7fc4" stroke="${S}" stroke-width="${f(s*.04)}"/><path d="M${f(-s*.12)} ${f(-s*.2)}L${f(s*.12)} ${f(-s*.2)}M${f(-s*.07)} ${f(-s*.38)}L${f(s*.07)} ${f(-s*.38)}" stroke="#f3d266" stroke-width="${f(s*.05)}"/><circle cy="${f(-s*.58)}" r="${f(s*.07)}" fill="#ef7f9b" stroke="${S}" stroke-width="${f(s*.03)}"/>`},
 'top-hat':{name:'Top hat',slot:'head',draw:s=>`<rect x="${f(-s*.36)}" y="${f(-s*.06)}" width="${f(s*.72)}" height="${f(s*.08)}" rx="${f(s*.03)}" fill="#3b3b48" stroke="${S}" stroke-width="${f(s*.03)}"/><rect x="${f(-s*.22)}" y="${f(-s*.5)}" width="${f(s*.44)}" height="${f(s*.46)}" rx="${f(s*.04)}" fill="#3b3b48" stroke="${S}" stroke-width="${f(s*.03)}"/><rect x="${f(-s*.22)}" y="${f(-s*.16)}" width="${f(s*.44)}" height="${f(s*.08)}" fill="#c8303a"/>`},
 'cap':{name:'Sports cap',slot:'head',draw:s=>`<path d="M${f(-s*.3)} 0Q${f(-s*.3)} ${f(-s*.34)} 0 ${f(-s*.36)}Q${f(s*.3)} ${f(-s*.34)} ${f(s*.3)} 0Z" fill="#5aaed2" stroke="${S}" stroke-width="${f(s*.035)}"/><path d="M${f(s*.18)} ${f(-s*.02)}Q${f(s*.45)} ${f(-s*.06)} ${f(s*.55)} ${f(s*.04)}L${f(s*.2)} ${f(s*.04)}Z" fill="#3f86b0" stroke="${S}" stroke-width="${f(s*.03)}"/><circle cy="${f(-s*.36)}" r="${f(s*.04)}" fill="#3f86b0"/>`},
 'wizard-hat':{name:'Wizard hat',slot:'head',draw:s=>`<path d="M${f(-s*.42)} 0Q0 ${f(-s*.08)} ${f(s*.42)} 0Q0 ${f(s*.08)} ${f(-s*.42)} 0Z" fill="#5a4a9a" stroke="${S}" stroke-width="${f(s*.03)}"/><path d="M${f(-s*.25)} ${f(-s*.02)}Q${f(-s*.05)} ${f(-s*.5)} ${f(s*.12)} ${f(-s*.75)}Q${f(s*.08)} ${f(-s*.4)} ${f(s*.25)} ${f(-s*.02)}Z" fill="#6c5ab8" stroke="${S}" stroke-width="${f(s*.035)}"/><path d="M${f(-s*.02)} ${f(-s*.3)}l${f(s*.04)} ${f(s*.08)}l${f(s*.08)} 0l${f(-s*.06)} ${f(s*.05)}l${f(s*.03)} ${f(s*.08)}l${f(-s*.09)} ${f(-s*.05)}" fill="#f3d266"/>`},
 'flower-crown':{name:'Flower crown',slot:'head',draw:s=>`<path d="M${f(-s*.36)} ${f(-s*.02)}Q0 ${f(-s*.14)} ${f(s*.36)} ${f(-s*.02)}" fill="none" stroke="#5e9e5a" stroke-width="${f(s*.05)}"/>`+[-.3,-.15,0,.15,.3].map((x,i)=>`<circle cx="${f(s*x)}" cy="${f(-s*(.05+.04*(1-Math.abs(x)*3)))}" r="${f(s*.07)}" fill="${['#f7a6c8','#f3d266','#ffffff','#f3d266','#f7a6c8'][i]}" stroke="${S}" stroke-width="${f(s*.025)}"/>`).join('')},
 'bow':{name:'Big bow',slot:'head',draw:s=>`<g transform="translate(${f(s*.22)} ${f(-s*.04)}) rotate(15)"><path d="M0 0L${f(-s*.2)} ${f(-s*.12)}L${f(-s*.2)} ${f(s*.12)}Z M0 0L${f(s*.2)} ${f(-s*.12)}L${f(s*.2)} ${f(s*.12)}Z" fill="#ef7f9b" stroke="${S}" stroke-width="${f(s*.03)}" stroke-linejoin="round"/><circle r="${f(s*.05)}" fill="#e0607e" stroke="${S}" stroke-width="${f(s*.025)}"/></g>`},
 'headphones':{name:'Headphones',slot:'head',draw:s=>`<path d="M${f(-s*.42)} ${f(s*.25)}Q${f(-s*.45)} ${f(-s*.2)} 0 ${f(-s*.2)}Q${f(s*.45)} ${f(-s*.2)} ${f(s*.42)} ${f(s*.25)}" fill="none" stroke="#3b3b48" stroke-width="${f(s*.06)}"/><rect x="${f(-s*.52)}" y="${f(s*.18)}" width="${f(s*.16)}" height="${f(s*.24)}" rx="${f(s*.06)}" fill="#e0675a" stroke="${S}" stroke-width="${f(s*.03)}"/><rect x="${f(s*.36)}" y="${f(s*.18)}" width="${f(s*.16)}" height="${f(s*.24)}" rx="${f(s*.06)}" fill="#e0675a" stroke="${S}" stroke-width="${f(s*.03)}"/>`},
 'headband':{name:'Sweatband',slot:'head',draw:s=>`<path d="M${f(-s*.4)} ${f(s*.12)}Q0 ${f(-s*.02)} ${f(s*.4)} ${f(s*.12)}L${f(s*.4)} ${f(s*.22)}Q0 ${f(s*.08)} ${f(-s*.4)} ${f(s*.22)}Z" fill="#e0675a" stroke="${S}" stroke-width="${f(s*.03)}"/><path d="M${f(s*.38)} ${f(s*.16)}l${f(s*.16)} ${f(s*.08)}l${f(-s*.04)} ${f(s*.1)}Z" fill="#e0675a" stroke="${S}" stroke-width="${f(s*.025)}"/>`},
 'aviator':{name:'Aviator cap',slot:'head',draw:s=>`<path d="M${f(-s*.38)} ${f(s*.2)}Q${f(-s*.42)} ${f(-s*.3)} 0 ${f(-s*.3)}Q${f(s*.42)} ${f(-s*.3)} ${f(s*.38)} ${f(s*.2)}L${f(s*.3)} ${f(s*.3)}L${f(s*.28)} ${f(s*.05)}Q0 ${f(-s*.12)} ${f(-s*.28)} ${f(s*.05)}L${f(-s*.3)} ${f(s*.3)}Z" fill="#a0724c" stroke="${S}" stroke-width="${f(s*.03)}"/><circle cx="${f(-s*.13)}" cy="${f(-s*.12)}" r="${f(s*.09)}" fill="#bfe6fa" stroke="${S}" stroke-width="${f(s*.03)}"/><circle cx="${f(s*.13)}" cy="${f(-s*.12)}" r="${f(s*.09)}" fill="#bfe6fa" stroke="${S}" stroke-width="${f(s*.03)}"/>`},
 'gold-crown':{name:'Champion crown',slot:'head',draw:s=>`<path d="M${f(-s*.28)} 0L${f(-s*.3)} ${f(-s*.3)}L${f(-s*.14)} ${f(-s*.16)}L0 ${f(-s*.36)}L${f(s*.14)} ${f(-s*.16)}L${f(s*.3)} ${f(-s*.3)}L${f(s*.28)} 0Z" fill="#f3c24a" stroke="${S}" stroke-width="${f(s*.035)}" stroke-linejoin="round"/><circle cy="${f(-s*.1)}" r="${f(s*.05)}" fill="#e0675a"/>`},
 'laurel':{name:'Golden laurel',slot:'head',draw:s=>[-1,1].map(d=>`<path d="M0 ${f(s*.02)}Q${f(d*s*.32)} ${f(-s*.02)} ${f(d*s*.4)} ${f(s*.18)}" fill="none" stroke="#d6a93a" stroke-width="${f(s*.035)}"/>`+[.1,.2,.3].map(k=>`<ellipse cx="${f(d*s*(k+.04))}" cy="${f(-s*.02+s*k*k*.9)}" rx="${f(s*.06)}" ry="${f(s*.03)}" transform="rotate(${d*-30} ${f(d*s*(k+.04))} ${f(-s*.02+s*k*k*.9)})" fill="#f3d266" stroke="${S}" stroke-width="${f(s*.02)}"/>`).join('')).join('')},
 'spiky-crown':{name:'Inferno crown',slot:'head',draw:s=>`<path d="M${f(-s*.3)} 0L${f(-s*.26)} ${f(-s*.34)}L${f(-s*.12)} ${f(-s*.14)}L0 ${f(-s*.44)}L${f(s*.12)} ${f(-s*.14)}L${f(s*.26)} ${f(-s*.34)}L${f(s*.3)} 0Z" fill="#3b2a3e" stroke="${S}" stroke-width="${f(s*.035)}" stroke-linejoin="round"/><circle cy="${f(-s*.1)}" r="${f(s*.05)}" fill="#ff5a3a"/>`},
 'dragon-helm':{name:'Dragon helm',slot:'head',draw:s=>`<path d="M${f(-s*.34)} ${f(s*.12)}Q${f(-s*.36)} ${f(-s*.3)} 0 ${f(-s*.32)}Q${f(s*.36)} ${f(-s*.3)} ${f(s*.34)} ${f(s*.12)}Z" fill="#7a9a8a" stroke="${S}" stroke-width="${f(s*.035)}"/><path d="M${f(-s*.2)} ${f(-s*.24)}L${f(-s*.36)} ${f(-s*.5)}L${f(-s*.1)} ${f(-s*.3)}M${f(s*.2)} ${f(-s*.24)}L${f(s*.36)} ${f(-s*.5)}L${f(s*.1)} ${f(-s*.3)}" fill="#efe3cf" stroke="${S}" stroke-width="${f(s*.03)}" stroke-linejoin="round"/>`},
 'snorkel':{name:'Snorkel mask',slot:'face',draw:s=>`<rect x="${f(-s*.3)}" y="${f(-s*.12)}" width="${f(s*.6)}" height="${f(s*.24)}" rx="${f(s*.1)}" fill="rgba(191,230,250,.7)" stroke="#3f86b0" stroke-width="${f(s*.04)}"/><path d="M${f(s*.32)} 0q${f(s*.1)} 0 ${f(s*.1)} ${f(-s*.1)}v${f(-s*.3)}" fill="none" stroke="#f3a23a" stroke-width="${f(s*.05)}"/>`},
 'sunglasses':{name:'Sunglasses',slot:'face',draw:s=>`<path d="M${f(-s*.32)} ${f(-s*.06)}h${f(s*.64)}" stroke="#2b2b35" stroke-width="${f(s*.03)}"/><rect x="${f(-s*.3)}" y="${f(-s*.08)}" width="${f(s*.24)}" height="${f(s*.15)}" rx="${f(s*.05)}" fill="#2b2b35"/><rect x="${f(s*.06)}" y="${f(-s*.08)}" width="${f(s*.24)}" height="${f(s*.15)}" rx="${f(s*.05)}" fill="#2b2b35"/><path d="M${f(-s*.25)} ${f(-s*.05)}l${f(s*.06)} 0" stroke="#fff" stroke-width="${f(s*.02)}" opacity=".7"/>`},
 'star-glasses':{name:'Star glasses',slot:'face',draw:s=>[-1,1].map(d=>`<path transform="translate(${f(d*s*.16)} 0)" d="${[0,1,2,3,4,5,6,7,8,9].map(i=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?s*.06:s*.14;return (i?'L':'M')+f(Math.cos(a)*r)+' '+f(Math.sin(a)*r);}).join('')}Z" fill="#f3d266" stroke="${S}" stroke-width="${f(s*.025)}"/>`).join('')},
 'monocle':{name:'Monocle',slot:'face',draw:s=>`<circle cx="${f(s*.16)}" cy="0" r="${f(s*.11)}" fill="rgba(255,255,255,.35)" stroke="#d6a93a" stroke-width="${f(s*.035)}"/><path d="M${f(s*.26)} ${f(s*.04)}q${f(s*.06)} ${f(s*.2)} ${f(-s*.02)} ${f(s*.36)}" fill="none" stroke="#d6a93a" stroke-width="${f(s*.015)}"/>`},
 'scarf':{name:'Cosy scarf',slot:'neck',draw:s=>`<path d="M${f(-s*.36)} ${f(s*.02)}Q0 ${f(s*.16)} ${f(s*.36)} ${f(s*.02)}L${f(s*.36)} ${f(s*.14)}Q0 ${f(s*.28)} ${f(-s*.36)} ${f(s*.14)}Z" fill="#e0675a" stroke="${S}" stroke-width="${f(s*.03)}"/><path d="M${f(s*.12)} ${f(s*.18)}l${f(s*.04)} ${f(s*.34)}l${f(s*.12)} ${f(-s*.02)}l${f(-s*.04)} ${f(-s*.32)}Z" fill="#c84a3e" stroke="${S}" stroke-width="${f(s*.025)}"/><path d="M${f(-s*.2)} ${f(s*.1)}v${f(s*.12)}M${f(0)} ${f(s*.13)}v${f(s*.12)}" stroke="#f3d266" stroke-width="${f(s*.03)}"/>`},
 'bandana':{name:'Bandana',slot:'neck',draw:s=>`<path d="M${f(-s*.34)} ${f(s*.02)}Q0 ${f(s*.1)} ${f(s*.34)} ${f(s*.02)}L0 ${f(s*.34)}Z" fill="#3f86b0" stroke="${S}" stroke-width="${f(s*.03)}" stroke-linejoin="round"/><circle cx="${f(-s*.08)}" cy="${f(s*.12)}" r="${f(s*.025)}" fill="#fff"/><circle cx="${f(s*.08)}" cy="${f(s*.12)}" r="${f(s*.025)}" fill="#fff"/><circle cy="${f(s*.22)}" r="${f(s*.025)}" fill="#fff"/>`},
 'bowtie':{name:'Bow tie',slot:'neck',draw:s=>`<g transform="translate(0 ${f(s*.08)})"><path d="M0 0L${f(-s*.16)} ${f(-s*.09)}L${f(-s*.16)} ${f(s*.09)}Z M0 0L${f(s*.16)} ${f(-s*.09)}L${f(s*.16)} ${f(s*.09)}Z" fill="#c8303a" stroke="${S}" stroke-width="${f(s*.03)}" stroke-linejoin="round"/><circle r="${f(s*.04)}" fill="#a02430"/></g>`},
 'medal':{name:'Gold medal',slot:'neck',draw:s=>`<path d="M${f(-s*.18)} 0L0 ${f(s*.24)}L${f(s*.18)} 0" fill="none" stroke="#5aaed2" stroke-width="${f(s*.05)}"/><circle cy="${f(s*.3)}" r="${f(s*.09)}" fill="#f3c24a" stroke="${S}" stroke-width="${f(s*.03)}"/>`},
 'cape':{name:'Hero cape',slot:'neck',back:true,draw:s=>`<path d="M${f(-s*.32)} ${f(s*.04)}Q${f(-s*.5)} ${f(s*.6)} ${f(-s*.42)} ${f(s*.95)}L${f(s*.42)} ${f(s*.95)}Q${f(s*.5)} ${f(s*.6)} ${f(s*.32)} ${f(s*.04)}Z" fill="#c8303a" stroke="${S}" stroke-width="${f(s*.03)}"/>`}
};
/** Elements that can be worn (element name → accessory). */
export const WEARABLE_ELEMENTS=[[/\btop hat\b/,'top-hat'],[/\bwizard hat\b/,'wizard-hat'],[/\bparty hat\b/,'party-hat'],[/\b(cap|baseball cap)\b/,'cap'],[/\bstar glasses\b/,'star-glasses'],[/\bsunglasses\b/,'sunglasses'],[/\bmonocle\b/,'monocle'],[/\bheadphones?\b/,'headphones'],[/\bscarf\b/,'scarf'],[/\bbandana\b/,'bandana'],[/\bbow tie\b/,'bowtie'],[/\b(flower crown|wreath)\b/,'flower-crown'],[/\bcape\b/,'cape'],[/\bhat\b/,'top-hat'],[/\bbow\b/,'bow'],[/\bmedal\b/,'medal'],[/\bsnorkel\b/,'snorkel']];
export function wearableFor(name){const t=` ${String(name||'').toLowerCase()} `;return WEARABLE_ELEMENTS.find(([re])=>re.test(t))?.[1]||null;}
// ---------- market ----------
export const COIN_PACK={id:'coins_100',coins:100,price:'€1.00'};
/** V137: bigger packs are better value (bonus vs the 100-coin pack). */
export const COIN_PACKS=[{id:'coins_100',coins:100,price:'€1.00',bonus:0},{id:'coins_210',coins:210,price:'€2.00',bonus:5},{id:'coins_550',coins:550,price:'€5.00',bonus:10},{id:'coins_1200',coins:1200,price:'€10.00',bonus:20,tag:'Popular'},{id:'coins_2600',coins:2600,price:'€20.00',bonus:30},{id:'coins_7000',coins:7000,price:'€50.00',bonus:40},{id:'coins_15000',coins:15000,price:'€100.00',bonus:50,tag:'Best value'}];
/** V149: shown in the Market and the coin shop — nothing is pay-only. */
export const FAIR_PLAY_NOTE='Everything you can buy here can also be found in Alchemy or earned by playing (races, Karate, daily coins). Buying only saves time.';
export const MARKET=[
 // food: given straight to the companion on screen
 // V137: food is placed on the main screen; drag it onto a companion
 {id:'fruit-run',kind:'food',name:'Swift fruit',icon:'🍐',price:90,stat:'run',amount:60,desc:'Run +60 XP'},
 {id:'fruit-swim',kind:'food',name:'Sea fruit',icon:'🫐',price:90,stat:'swim',amount:60,desc:'Swim +60 XP'},
 {id:'fruit-fly',kind:'food',name:'Cloud fruit',icon:'🍑',price:90,stat:'fly',amount:60,desc:'Fly +60 XP'},
 {id:'fruit-power',kind:'food',name:'Strong fruit',icon:'🍎',price:90,stat:'power',amount:60,desc:'Power +60 XP'},
 {id:'fruit-stamina',kind:'food',name:'Hearty fruit',icon:'🍊',price:90,stat:'stamina',amount:60,desc:'Stamina +60 XP'},
 {id:'fruit-hp',kind:'food',name:'Life fruit',icon:'🍓',price:90,stat:'hp',amount:60,desc:'HP +60 XP'},
 {id:'mood-cookie',kind:'food',name:'Happy cookie',icon:'🍪',price:45,mood:30,desc:'Mood +30, Belly +30'},
 {id:'soap',kind:'food',name:'Bubble soap',icon:'🧼',price:70,look:'Soap',desc:'Washes colour off'},
 {id:'mirror',kind:'food',name:'Mirror drop',icon:'🪞',price:70,look:'Mirror',desc:'Undoes size and head trait'},
 {id:'rebirth',kind:'food',name:'Rebirth egg',icon:'🥚',price:180,look:'Egg',desc:'Back to the natural look'},
 // accessories
 ...['party-hat','cap','bow','headphones','sunglasses','star-glasses','monocle','scarf','bandana','bowtie','top-hat','wizard-hat','cape'].map((a,i)=>({id:'acc-'+a,kind:'acc',acc:a,price:[180,180,160,280,240,300,360,200,200,220,420,520,650][i]})),
 // toys for the main screen
 {id:'toy-ball',kind:'toy',toy:'ball',name:'Bouncy ball',icon:'⚽',price:400,desc:'Your companions kick it around now and then'},
 {id:'toy-top',kind:'toy',toy:'top',name:'Spinning top',icon:'🪀',price:400,desc:'Spins when they give it a push'},
 {id:'toy-drum',kind:'toy',toy:'drum',name:'Little drum',icon:'🥁',price:500,desc:'They drum a little beat on it'},
 // furniture and houses: added to your elements
 ...[['organic89:running-wheel',650],['organic89:paddling-pool',650],['organic89:punching-bag',650],['organic89:trampoline',650],['organic89:climbing-wall',800],['organic89:bookshelf',800],['organic89:food-bowl',350],['organic89:ball-pit',600]].map(([el,price])=>({id:'el-'+el,kind:'furniture',element:el,price})),
 ...[['organic89:companion-tent',900],['organic89:companion-hut',1800],['organic89:companion-cabin',3200],['organic89:companion-cottage',5000],['organic89:companion-villa',7500],['organic89:companion-castle',11000],['organic139:grand-castle',16000]].map(([el,price])=>({id:'el-'+el,kind:'house',element:el,price}))
];
/** V139: every Market purchase is also a real element, so it counts in Alchemy and can be combined. */
export const MARKET_ELEMENT={'fruit-run':'organic139:swift-fruit','fruit-swim':'organic139:sea-fruit','fruit-fly':'organic139:cloud-fruit','fruit-power':'organic139:strong-fruit','fruit-stamina':'organic139:hearty-fruit','fruit-hp':'organic139:life-fruit','mood-cookie':'organic38:cookie','soap':'organic89:soap','mirror':'organic139:hand-mirror','rebirth':'organic139:rebirth-egg',
 'acc-party-hat':'organic139:party-hat','acc-cap':'organic139:sports-cap','acc-bow':'legacy:607','acc-headphones':'legacy:330','acc-sunglasses':'organic139:sunglasses','acc-star-glasses':'organic139:star-glasses','acc-monocle':'organic139:monocle','acc-scarf':'organic139:scarf','acc-bandana':'organic139:bandana','acc-bowtie':'organic139:bow-tie','acc-top-hat':'organic139:top-hat','acc-wizard-hat':'organic139:wizard-hat','acc-cape':'organic139:hero-cape',
 'toy-ball':'legacy:557','toy-top':'organic89:spinning-top','toy-drum':'organic40:drum'};
for(const it of MARKET)it.element=it.element||it.el||MARKET_ELEMENT[it.id]||null;
export const MARKET_TABS=[['food','Food'],['acc','Wear'],['toy','Toys'],['furniture','Furniture'],['house','Houses']];
/** V138: each extra copy of the same accessory costs more. */
export const accPrice=(base,owned)=>Math.round(base*Math.pow(1.6,owned||0)/10)*10;
export const DAILY_COINS=100;
/** Coins for a race/karate result. */
export function coinsFor(kind,level,place,{theme=false,firstGold=false}={}){
 let c=kind==='karate'?(place===1?25+12*level:5+level):place===1?20+10*level:place===2?12+6*level:place===3?8+4*level:3+level;
 if(theme)c=Math.round(c*1.5);if(firstGold)c*=2;return c;}
// ---------- school ----------
export const LESSON_LEVELS=['Novice','Apprentice','Skilled','Expert','Master'];
export const LESSON_MINUTES=[5,30,120,360,720];
const LESSON_MULT=[1,2.5,5,9,15];
export const lessonPrice=(l,level)=>Math.round(l.price*LESSON_MULT[level]/10)*10;
export const SCHOOL_AD_CUT_MIN=30;
export const LESSONS=[
 {id:'sing',name:'Singing',icon:'🎤',price:60,desc:'Sings a little tune with floating notes'},
 {id:'dance',name:'Dancing',icon:'💃',price:60,desc:'Busts a happy dance'},
 {id:'draw',name:'Drawing',icon:'🎨',price:80,desc:'Paints a tiny picture on an easel'},
 {id:'drums',name:'Drums',icon:'🥁',price:80,desc:'Plays a drum roll'},
 {id:'juggle',name:'Juggling',icon:'🤹',price:100,desc:'Juggles your elements'},
 {id:'magic',name:'Magic trick',icon:'🎩',price:120,desc:'Pulls elements out of a hat'}
];
