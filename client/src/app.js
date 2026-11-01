import { DATA } from './legacy-data.js';
import { buildCatalog } from './catalog-integrity.js';
import { publicText, publicName, buildPublicNameIndex } from './ip-safe-names.js';
import { GAMEVERSE_ART } from './gameverse-art.js';
import { FAMILY_ICONS_V54 } from './family-icons-v54.js';
import { PACK } from './creative-pack.js';
import { GAMING_V22 } from './gaming-pack-v22.js';
import { GAMING_V23 } from './gaming-pack-v23.js';
import { GAMING_V24 } from './gaming-pack-v24.js';
import { GAMING_V26 } from './gaming-pack-v26.js';
import { GAMING_V27 } from './gaming-pack-v27.js';
import { GAMING_V30 } from './gaming-pack-v30.js';
import { ORGANIC_V32 } from './organic-pack-v32.js';
import { ORGANIC_V34 } from './organic-pack-v34.js';
import { ORGANIC_V37 } from './organic-pack-v37.js';
import { ORGANIC_V38 } from './organic-pack-v38.js';
import { ORGANIC_V40 } from './organic-pack-v40.js';
import { ORGANIC_V41 } from './organic-pack-v41.js';
import { ORGANIC_V42 } from './organic-pack-v42.js';
import { ORGANIC_V43 } from './organic-pack-v43.js';
import { ORGANIC_V44 } from './organic-pack-v44.js';
import { ORGANIC_V45 } from './organic-pack-v45.js';
import { ORGANIC_V46 } from './organic-pack-v46.js';
import { ORGANIC_V47 } from './organic-pack-v47.js';
import { ORGANIC_V50 } from './organic-pack-v50.js';
import { ORGANIC_V52 } from './organic-pack-v52.js';
import { ORGANIC_V53 } from './organic-pack-v53.js';
import { ORGANIC_V55 } from './organic-pack-v55.js';
import { ORGANIC_V56 } from './organic-pack-v56.js';
import { ORGANIC_V58 } from './organic-pack-v58.js';
import { ORGANIC_V59 } from './organic-pack-v59.js';
import { ORGANIC_V61 } from './organic-pack-v61.js';
import { ORGANIC_V62 } from './organic-pack-v62.js';
import { ORGANIC_V63 } from './organic-pack-v63.js';
import { ORGANIC_V65 } from './organic-pack-v65.js';
import { ORGANIC_V66 } from './organic-pack-v66.js';
import { ORGANIC_V67 } from './organic-pack-v67.js';
import { ORGANIC_V68 } from './organic-pack-v68.js';
import { ORGANIC_V71 } from './organic-pack-v71.js';
import { ORGANIC_V72 } from './organic-pack-v72.js';
import { ORGANIC_V73 } from './organic-pack-v73.js';
import { ORGANIC_V74 } from './organic-pack-v74.js';
import { ORGANIC_V75 } from './organic-pack-v75.js';
import { ORGANIC_V76 } from './organic-pack-v76.js';
import { ORGANIC_V77 } from './organic-pack-v77.js';
import { ORGANIC_V78 } from './organic-pack-v78.js';
import { ORGANIC_V79 } from './organic-pack-v79.js';
import { ORGANIC_V80 } from './organic-pack-v80.js';
import { ORGANIC_V81 } from './organic-pack-v81.js';
import { ORGANIC_V82 } from './organic-pack-v82.js';
import { ORGANIC_V83 } from './organic-pack-v83.js';
import { ORGANIC_V57 } from './organic-pack-v57.js';
import { ORGANIC_ART_V34 } from './organic-art-v34.js';
import { ORGANIC_ART_V37 } from './organic-art-v37.js';
import { ORGANIC_ART_V38 } from './organic-art-v38.js';
import { ORGANIC_ART_V40 } from './organic-art-v40.js';
import { ORGANIC_ART_V41 } from './organic-art-v41.js';
import { ORGANIC_ART_V42 } from './organic-art-v42.js';
import { ORGANIC_ART_V43 } from './organic-art-v43.js';
import { ORGANIC_ART_V44 } from './organic-art-v44.js';
import { ORGANIC_ART_V45 } from './organic-art-v45.js';
import { ORGANIC_ART_V46 } from './organic-art-v46.js';
import { ORGANIC_ART_V47 } from './organic-art-v47.js';
import { ORGANIC_ART_V50 } from './organic-art-v50.js';
import { ORGANIC_ART_V52 } from './organic-art-v52.js';
import { ORGANIC_ART_V53 } from './organic-art-v53.js';
import { ORGANIC_ART_V55 } from './organic-art-v55.js';
import { ORGANIC_ART_V56 } from './organic-art-v56.js';
import { ORGANIC_ART_V58 } from './organic-art-v58.js';
import { ORGANIC_ART_V59 } from './organic-art-v59.js';
import { ORGANIC_ART_V61 } from './organic-art-v61.js';
import { ORGANIC_ART_V62 } from './organic-art-v62.js';
import { ORGANIC_ART_V63 } from './organic-art-v63.js';
import { ORGANIC_ART_V65 } from './organic-art-v65.js';
import { ORGANIC_ART_V66 } from './organic-art-v66.js';
import { ORGANIC_ART_V67 } from './organic-art-v67.js';
import { ORGANIC_ART_V68 } from './organic-art-v68.js';
import { ORGANIC_ART_V70 } from './organic-art-v70.js';
import { ORGANIC_ART_V71 } from './organic-art-v71.js';
import { ORGANIC_ART_V72 } from './organic-art-v72.js';
import { ORGANIC_ART_V73 } from './organic-art-v73.js';
import { ORGANIC_ART_V74 } from './organic-art-v74.js';
import { ORGANIC_ART_V75 } from './organic-art-v75.js';
import { ORGANIC_ART_V76 } from './organic-art-v76.js';
import { ORGANIC_ART_V77 } from './organic-art-v77.js';
import { ORGANIC_ART_V78 } from './organic-art-v78.js';
import { ORGANIC_ART_V79 } from './organic-art-v79.js';
import { ORGANIC_ART_V80 } from './organic-art-v80.js';
import { ORGANIC_ART_V81 } from './organic-art-v81.js';
import { ORGANIC_ART_V82 } from './organic-art-v82.js';
import { ORGANIC_ART_V83 } from './organic-art-v83.js';
import { ART_REDRAW } from './art-redraw.js';
import { ORGANIC_ART_V69 } from './organic-art-v69.js';
import { ORGANIC_ART_V57 } from './organic-art-v57.js';
import { ORGANIC_ART_V32 } from './organic-art-v32.js';
import { GAMEVERSE_ART_V23 } from './gameverse-art-v23.js';
import { GAMEVERSE_ART_V27_VARIANTS } from './gameverse-art-v27-variants.js';
import { GAMEVERSE_ART_V30_SEMANTIC } from './gameverse-art-v30-semantic.js';
import { legacyIcon, fallbackIcon, sharedIcon, setIconCatalog } from './icons.js';
import { resolveLocalRedundancy } from './semantic.js';
import { FAMILIES, familyFor, familiesFor, groupFamilies, recipesForTarget, candidatesForFamily, registerFamilyMembership, MERGED_FAMILY_IDS, canonicalFamilyId } from './discoveries.js';
import { FAMILY_CAMPAIGNS } from './family-mode-v53-campaigns.js';
import { buildThematicCampaigns } from './family-campaigns-v82.js';
import { buildCompleteFamilyCampaigns, mergeFamilyData } from './family-campaigns-v85.js';
import { FAMILY_DATA_V85 } from './family-data-v85.js';
import { RECIPE_POLISH_V87 } from './recipe-polish-v87.js';
import { RECIPE_POLISH_V91 } from './recipe-polish-v91.js';
import { FAMILY_ART_V88 } from './family-art-v88.js';
import { ORGANIC_V85 } from './organic-pack-v85.js';
import { ORGANIC_ART_V85 } from './organic-art-v85.js';
import { ORGANIC_V89 } from './organic-pack-v89.js';
import { ORGANIC_ART_V89 } from './organic-art-v89.js';
import { FAMILY_DATA_V89 } from './family-data-v89.js';
import { HOME_OBJECTS_V89 } from './home-objects-v89.js';
import { createHomeSystem, HOME_STORAGE_KEY, pieceQuality, starsText } from './home-engine-v90.js';
import { ROOM_SPRITES_V90 } from './room-sprites-v90.js';
import { createGamesSystem, GAMES_STORAGE_KEY } from './games-v93.js';
import { RACE_PRIZES, PRIZE_BY_ID, BELTS, beltSvg, wearBelt, personalPrize, personalPrizeId, parsePersonalPrize } from './prizes-v94.js';
import { STADIUM_ART_V95 } from './stadium-art-v95.js';
import { createStadiumSfx } from './stadium-sfx-v95.js';
import { COMPANIONS_V86, COMPANION_SPRITES_V86 } from './companions-v86.js';
import { createCompanionSystem, COMPANION_STORAGE_KEY } from './companion-engine-v86.js';
import { PUBLIC_LABELS_V86 } from './public-labels-v86.js';
import { reconcileLegacyFamilies } from './family-compatibility-v82.js';
import { synchronizeFamilyProfiles, sharedMembership } from './family-shared-v51.js';
import { eligibleFamilyMerge, mergeIntoClassicState, verifyMergePending } from './family-merge-v60.js';

const $ = (id) => document.getElementById(id);
const escapeText = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// V39: the same strict catalog contract runs in the browser, the build and CI.
// No hidden first-wins recipe collisions or duplicated catalog entries.
const {items: ITEMS,recipes:classicRecipes} = buildCatalog(DATA,[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V89,ORGANIC_V85,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41,ORGANIC_V42,ORGANIC_V43,ORGANIC_V44,ORGANIC_V45,ORGANIC_V46,ORGANIC_V47,ORGANIC_V50,ORGANIC_V52,ORGANIC_V53,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57,ORGANIC_V58,ORGANIC_V59,ORGANIC_V61,ORGANIC_V62,ORGANIC_V63,ORGANIC_V65,ORGANIC_V66,ORGANIC_V67,ORGANIC_V68,ORGANIC_V71,ORGANIC_V72,ORGANIC_V73,ORGANIC_V74,ORGANIC_V75,ORGANIC_V76,ORGANIC_V77,ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82,ORGANIC_V83]);
// V76.1: change only public labels. Historic recipe IDs and artwork keys are immutable.
const PUBLIC_LABELS=buildPublicNameIndex(ITEMS,PUBLIC_LABELS_V86);
function uiName(item){return item?(PUBLIC_LABELS.get(item.id)||publicName(item)):'';}
let recipes=classicRecipes;
const reconciledHistorical = reconcileLegacyFamilies(classicRecipes,FAMILY_CAMPAIGNS.families);
// V85: every family is a complete, independent campaign (own 4 starters, in-family recipes only).
// V89: Home & Living joins the V85 family data (own starters + existing members).
const FAMILY_DATA=mergeFamilyData(FAMILY_DATA_V85,FAMILY_DATA_V89);
registerFamilyMembership(FAMILY_DATA.families);
const ALL_CAMPAIGNS=buildCompleteFamilyCampaigns(classicRecipes,ITEMS,FAMILIES,familiesFor,FAMILY_DATA,[...reconciledHistorical.families,...buildThematicCampaigns(classicRecipes,ITEMS)],{adds:[...RECIPE_POLISH_V87.adds,...RECIPE_POLISH_V91.adds],remaps:[...RECIPE_POLISH_V87.remaps,...RECIPE_POLISH_V91.remaps]});
if(ALL_CAMPAIGNS.report.conflicts.length||ALL_CAMPAIGNS.report.polishSkipped||Object.keys(ALL_CAMPAIGNS.report.dropped).length)console.warn('V85 family campaigns',ALL_CAMPAIGNS.report);
const familyCampaigns=new Map(ALL_CAMPAIGNS.map(f=>[f.id,{...f,itemSet:new Set(f.items),recipeMap:new Map(f.recipes)}]));
const sharedCatalogIds=sharedMembership(ALL_CAMPAIGNS);
const MODE_SELECTION_KEY='35k_mode_selected_v48', FAMILY_SAVES_KEY='35k_family_profiles_v48';
const MERGE_PENDING_KEY='35k_family_merge_pending_v60'; // One credited ad can be resumed, never automatically rewarded.
let currentMode='classic', currentFamilyId=null, classicSnapshot=null;
let familyProfiles={};
try {const raw=JSON.parse(localStorage.getItem(FAMILY_SAVES_KEY)||'null');if(raw&&typeof raw==='object'&&!Array.isArray(raw))familyProfiles=raw;}catch{}
// V86: families merged by the owner (consoles+arcades -> games, music+cinema -> anime). Old campaign
// saves are folded into the absorbing family so no discovery is lost.
for(const [oldId,newId] of Object.entries(MERGED_FAMILY_IDS)){const o=familyProfiles[oldId];if(!o)continue;
 const t=familyProfiles[newId]||{unlocked:[],known:[],recent:[],last:null,ledger:[],order:[],clues:{}};
 const merged={...t,unlocked:[...new Set([...(t.unlocked||[]),...(o.unlocked||[])])],known:[...new Set([...(t.known||[]),...(o.known||[])])],
  recent:[...new Set([...(t.recent||[]),...(o.recent||[])])].slice(0,350),ledger:[...new Map([...(o.ledger||[]),...(t.ledger||[])])],
  order:[...new Set([...(t.order||[]),...(o.order||[])])],clues:{...(o.clues||{}),...(t.clues||{})}};
 familyProfiles[newId]=merged;delete familyProfiles[oldId];}
// V51: migrate old Family Only saves on load, including families not yet played.
// Shared discoveries never cross into the independent Classic save.
familyProfiles=synchronizeFamilyProfiles(familyProfiles,ALL_CAMPAIGNS).profiles;
try{localStorage.setItem(FAMILY_SAVES_KEY,JSON.stringify(familyProfiles));}catch{}
setIconCatalog(ITEMS);
const byId=new Map(ITEMS.map(item=>[item.id,item]));
const pairKey=(a,b)=>[a,b].sort().join('|');
const CATALOG_GOAL=10000; // Current Alchemy 10K target; historical V24 target stays archived.
const categoryNames={gamecraft:'Game creation',nature:'Nature',material:'Materials',life:'Life',science:'Science',culture:'Culture',concept:'Ideas',technology:'Technology',accessory:'Accessories',brand:'Brands',console:'Consoles',portable:'Handhelds',computer:'Computers',arcade:'Arcades',board:'Board Games',genre:'Genres',game:'Video Games',fantasy:'Fantasy',film:'Films',music:'Music',politician:'People',anime:'Anime & Manga',manga:'Manga',character:'Characters',film:'Films & TV',music:'Music',power:'Powers',object:'Objects',series:'Series'};
let unlocked = new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
let known = new Set(), recent=[], last=null, slots=[null,null],leftLocked=false,playFilter='all',playFamily='all',playQuery='',tab='Play',autoTimer=null,toastTimer=null;
// V55: stable inventory ordering, independent from Family Only progression and search.
const SORT_KEY='35k_inventory_sort_v55';
let sortChoice='az';
// V83: inventory filter (all / still has undiscovered outputs / completed / saved) and density.
const INVENTORY_VIEW_KEY='alchemy10k_inventory_view_v1';
let inventoryShow='all',inventoryDensity='normal';
try{const v=JSON.parse(localStorage.getItem(INVENTORY_VIEW_KEY)||'null');if(['all','open','done','saved','shiny'].includes(v?.show))inventoryShow=v.show;if(v?.density==='compact')inventoryDensity='compact';}catch{}
function saveInventoryView(){try{localStorage.setItem(INVENTORY_VIEW_KEY,JSON.stringify({show:inventoryShow,density:inventoryDensity}));}catch{}}
const inventoryChip=()=>inventoryDensity==='compact'?{w:100,h:48}:{w:145,h:62};
try {const value=localStorage.getItem(SORT_KEY);if(['az','old','new'].includes(value))sortChoice=value;}catch{}
// The four starters are free ingredients, not earned discoveries.
let STARTERS = new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);

// V35: Light / Dark / System. Default Light preserves the previous game's appearance.
const THEME_KEY='35k_theme_v35';
let selectedTheme='light';
try{const storedTheme=localStorage.getItem(THEME_KEY);if(['light','dark','system'].includes(storedTheme))selectedTheme=storedTheme;}catch{}
const systemDark=window.matchMedia?.('(prefers-color-scheme: dark)');
// Android-only compact immersive layout (keep standalone/browser unchanged).
if(window.Capacitor?.getPlatform?.()==='android')document.documentElement.classList.add('alchemy-android-immersive');
function applyTheme(){
 const dark=selectedTheme==='dark'||(selectedTheme==='system'&&!!systemDark?.matches);
 document.documentElement.dataset.theme=dark?'dark':'light';
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#17191d':'#f7f5f2');
 // Capacitor 8 edge-to-edge: use legible Android status/navigation bar
 // icons against the actual in-game theme. No plugin in standalone HTML.
 const systemBars=window.Capacitor?.Plugins?.SystemBars;
 if(typeof systemBars?.setStyle==='function'){
  Promise.resolve(systemBars.setStyle({style:dark?'DARK':'LIGHT'})).catch(()=>{});
 }
 document.querySelectorAll('[data-theme-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.themeChoice===selectedTheme)));
}
applyTheme();systemDark?.addEventListener?.('change',()=>{if(selectedTheme==='system')applyTheme();});

// V31: locally synthesized micro-feedback. No audio files, servers, downloads or animation frames.
const SOUND_KEY='35k_audio_enabled_v31';
let soundEnabled=true;
try{soundEnabled=localStorage.getItem(SOUND_KEY)!=='off';}catch{}
let audioEngine=null;
function acquireSoundEngine(){
 if(!soundEnabled)return null;
 try{
  if(!audioEngine){const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)return null;audioEngine=new Engine();}
  if(audioEngine.state==='suspended')audioEngine.resume().catch(()=>{});
  return audioEngine;
 }catch{return null;}
}
function soundForResult(kind){
 if(!soundEnabled||!['new','repeat','invalid'].includes(kind))return;
 const ctx=acquireSoundEngine();if(!ctx||ctx.state==='closed')return;
 const now=ctx.currentTime;
 const notes=kind==='new'?[[587.33,0,.075],[783.99,.1,.12]]:kind==='repeat'?[[440,0,.065]]:[[196,0,.09]];
 for(const [hz,offset,duration] of notes){
  try{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind==='invalid'?'triangle':'sine';osc.frequency.setValueAtTime(hz,now+offset);gain.gain.setValueAtTime(.0001,now+offset);gain.gain.exponentialRampToValueAtTime(kind==='new'?.095:.056,now+offset+.014);gain.gain.exponentialRampToValueAtTime(.0001,now+offset+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(now+offset);osc.stop(now+offset+duration+.015);}catch{}
 }
}
const DISCOVERY_LINES={
 'Sun':'A star that never misses its daytime shift.',
 'Sky':'The biggest ceiling you will ever look up at.',
 'Wind':'Air with somewhere important to be.',
 'Crystal':'Nature has a surprisingly good eye for geometry.',
 'Water':'The original ingredient in almost everything.',
 'Fire':'An excellent invention, until it starts inventing problems.',
 'Earth':'The ground floor of just about everything.',
 'Air':'Invisible, essential and impossible to keep in a box.',
 'Steam':'Water taking the scenic route through the air.',
 'Heat':'The reason ice never stays for long.',
 'Cloud':"The sky's floating collection of almost-rain.",
 'Rain':'Clouds with a delivery schedule.',
 'Lightning':'The sky really knows how to make an entrance.',
 'Ocean':'A whole world, just under the surface.',
 'Moon':"Earth's loyal night-shift companion.",
 'Star':'A distant sun with excellent stage lighting.',
 'Ice':'Water practicing its solid impression.',
 'Snow':'The weather, powdered and delivered in silence.',
 'Volcano':'A mountain with a very dramatic interior.',
 'Sword':'A sharp solution to a very old problem.',
 'Dragon':'An excellent reason to keep a fire extinguisher nearby.',
 'Camera':'A memory with a shutter button.',
 'Game Boy':'A whole arcade that fits in your pocket.',
 'PlayStation 2':'A generation of adventures under one black roof.',
 'Nintendo Switch':'A living-room game that loves to travel.',
 'Mecha Samurai':'Ancient discipline, upgraded with heavy machinery.'
};
const ORGANIC_LINES_V32={
 'Solar Panel':'A little rooftop that makes daylight do the work.',
 'Wind Turbine':'The wind finally found a part-time job.',
 'Thunderstorm':'Clouds performing a very loud duet.',
 'Rainforest':'A forest that never forgets to water itself.',
 'Telescope':'For when the stars feel a little too far away.',
 'Microscope':'A world inside a world, now with zoom.',
 'Chiptune':'An entire orchestra, squeezed into a tiny chip.',
 'Portable Arcade':'The arcade followed you home. And everywhere else.',
 'Game Jam':'A creative marathon with very little sleep.',
 'Cloud Save':'Your progress has packed its bags for the Internet.',
 'Loading Screen':'Patience is technically part of the gameplay.',
 'Gameplay':'The moment a game becomes yours to play.',
 'Computer Graphics':'Art, with an unreasonable number of pixels.',
 'Solar Power':'Sunshine, now available as electricity.',
 'Weather Forecast':'A prediction with a healthy chance of surprises.',
 'Mechanical Clock':'A hundred tiny parts agreeing on the time.',
 'Digital Camera':'Memories, now with a battery indicator.',
 'Virtual Arcade':'No tokens required. The nostalgia is included.',
 'Game Cartridge':'A small plastic box with a whole world inside.',
 'Game Soundtrack':'Every adventure deserves a theme song.',
 'Screenshot':'Proof that the impossible jump really happened.',
 'Patch Notes':'Everything that changed, and a few things that broke.',
 'Prototype':'A promising idea held together by curiosity.',
 'Circuit Board':'A tiny city where electricity lives.',
 'Save Point':'A tiny promise that your adventure can continue.',
 'Game Manual':'The ancient art of reading before pressing buttons.'
};
const ORGANIC_LINES_V34={
 'Seed':'Tomorrow, carefully folded into something tiny.',
 'Sprout':'An impressive entrance for such a small beginning.',
 'Flower':'Nature does not believe in subtle announcements.',
 'Bee':'An unusually productive frequent flyer.',
 'Pollination':'A tiny delivery with a very big future.',
 'Honey':'A sweet achievement with a lot of teamwork.',
 'Beehive':'The busiest apartment building in the garden.',
 'Greenhouse':'A little summer you can walk inside.',
 'Coral Reef':'An underwater city with no traffic lights.',
 'Tide':'The Moon still has a strong influence on beach plans.',
 'Lighthouse':'The original coastal notification system.',
 'Sailboat':'The wind became your engine.',
 'Waterfall':'Gravity showing off, with a soundtrack.',
 'Rainbow':'The weather decided to become an artist.',
 'Umbrella':'A very small roof that follows you around.',
 'Weather Station':'The sky now has a report card.',
 'Electric Bicycle':'A little help when the hill gets ambitious.',
 'Game Studio':'A thousand ideas, and one release date.',
 'Pixel Artist':'Every single square is a deliberate choice.',
 'Game Mod':'One more reason the credits are not the end.',
 'Co-op Game':'The best power-up is a friend.',
 'Speedrun':'The scenic route was never an option.',
 'Game Tournament':'Friendly competition. Usually.',
 'Arcade Ticket':'A tiny piece of paper, a huge sense of victory.'
};
const ORGANIC_LINES_V37={
 'Algae':'The ocean has been growing its own solar panels for ages.',
 'Plankton':'Small enough to drift, important enough to feed an ocean.',
 'Kelp Forest':'A forest where every path is a swimming lane.',
 'Seashell':'The world\'s tiniest seaside apartment.',
 'Oyster':'A tiny ocean jeweler with no opening hours.',
 'Pearl':'The sea believes in making its own jewelry.',
 'Seahorse':'A horse that forgot everything except the name.',
 'Sea Turtle':'The ocean\'s most patient commuter.',
 'Deep Sea':'No sunlight. Still plenty going on.',
 'Bioluminescence':'Some creatures bring their own night lights.',
 'Shipwreck':'The sea kept this one as a souvenir.',
 'Treasure Chest':'The box is half the adventure.',
 'Caterpillar':'A butterfly with a very long lunch break.',
 'Cocoon':'Renovations in progress. Please do not disturb.',
 'Butterfly':'A dramatic costume change, courtesy of nature.',
 'Pollen':'Flowers really do send things by air mail.',
 'Honeycomb':'Bees invented efficient storage before spreadsheets.',
 'Beekeeper':'Managing the busiest tiny team in the garden.',
 'Fruit':'Nature wrapped its seeds in a snack.',
 'Vegetable':'Proof that the garden has a dinner menu.',
 'Harvest':'The moment patience turns into dinner.',
 'Irrigation':'The garden just upgraded its plumbing.',
 'Sunflower':'Always dressed for the weather it prefers.',
 'Bird Nest':'A house built without a single floor plan.',
 'Flour':'A dusty beginning to something delicious.',
 'Dough':'It has potential. And it knows it.',
 'Bread':'A good idea that rose to the occasion.',
 'Bakery':'The only alarm clock that smells like breakfast.',
 'Chef':'One person, a thousand very good possibilities.',
 'Soup':'A warm hug disguised as a bowl.',
 'Salad':'The garden decided to dress for dinner.',
 'Jam':'Fruit found a sweet way to stay longer.',
 'Pastry':'A flaky plan with an excellent ending.',
 'Recipe Book':'The instruction manual for edible discoveries.',
 'Tea':'A few leaves making a strong case for a break.',
 'Cupcake':'Small cake. Very big occasion.'
};
const ORGANIC_LINES_V38={
'Volcano':'The mountain has officially lost its cool.',
'Glacier':'An ice cube that spent thousands of years on the road.',
'Avalanche':'Snow has decided to take the fast route.',
'Iceberg':'The largest part of the story is underwater.',
'Geyser':'Nature just invented the pressure cooker.',
'Canyon':'The river has been very persistent.',
'Dew':'The morning left tiny notes on every leaf.',
'Frost':'Winter tried its hand at window art.',
'Oasis':'A welcome plot twist for a desert traveler.',
'Mirage':'The desert is not promising what you think.',
'Wave':'The sea never runs out of things to say.',
'Whirlpool':'Water has taken up spinning classes.',
'Tide Pool':'The entire ocean, condensed into a puddle.',
'Starfish':'Five arms. Zero interest in waving.',
'Jellyfish':'The ocean made its own floating chandelier.',
'Octopus':'Eight arms should make moving house easier.',
'Dolphin':'The sea has a remarkably chatty neighbor.',
'Shark':'An ancient design, still wonderfully streamlined.',
'Crab':'Sideways is a perfectly valid direction.',
'Lobster':'The ocean believes in wearing armor to dinner.',
'Shrimp':'Small body, enormous place in the food chain.',
'Seaweed':'The sea grows its own salad.',
'Sapling':'Every giant tree started small.',
'Mint':'Refreshment, straight from the garden.',
'Basil':'The garden is preparing dinner.',
'Cactus':'Saving water before it became fashionable.',
'Bonsai':'A tree with very ambitious houseplant energy.',
'Terrarium':'A whole little world behind the glass.',
'Frog':'Two habitats, one very loud resident.',
'Firefly':'A nightlight with wings and its own schedule.',
'Cheese':'Milk decided to take its time.',
'Butter':'Someone shook the milk until it improved.',
'Pizza':'A circle of dough with endless possibilities.',
'Tomato':'Botanically a fruit. Spiritually a sauce.',
'Chocolate':'Happiness found a remarkably solid form.',
'Coffee':'A warm idea with a very early following.',
'Cookie':'A little circle of good decisions.',
'Lemonade':'Summer, poured into a glass.',
'Ice Cream':'The cold has never tasted this good.'
};
function wittyDiscovery(item){return DISCOVERY_LINES[item?.name]||ORGANIC_LINES_V32[item?.name]||ORGANIC_LINES_V34[item?.name]||ORGANIC_LINES_V37[item?.name]||ORGANIC_LINES_V38[item?.name]||item?.wit||'';}


let discoveryLedger=new Map(),worldFirsts=new Set(),worldStatsVerified=false,lastOnlineSync=0;
let apiBase='';
let sessionToken=null, syncing=false;
let pendingSyncing=false,pendingCount=0,lastPendingCheck=0;
// V33: one optional rewarded ad grants one full recipe. Previous clues remain valid.
const HINT_STORAGE='gameverse_discovery_hints_v20';
let hintState={clues:{}},activeFamily=null,discoveryScope='all',discoverQuery='',discoverSubtab='families';
try{const value=JSON.parse(localStorage.getItem(HINT_STORAGE)||'null');if(value?.v===20&&value.clues&&typeof value.clues==='object')hintState={clues:value.clues};}catch{}
function saveHints(){if(currentMode==='family'){storeFamilyProfile();return;}try{localStorage.setItem(HINT_STORAGE,JSON.stringify({v:20,clues:hintState.clues}));}catch{}}
// Require a REAL native Android Capacitor plugin, not an injectable browser mock.
function getRewardBridge(){
 // A browser-side mock is not an advertisement. Only a registered native Android plugin is trusted.
 const cap=window.Capacitor;
 if(!cap||typeof cap.getPlatform!=='function'||cap.getPlatform()!=='android')return null;
 const native=cap.Plugins?.GameverseRewardedAds;
 return native&&typeof native.showRewarded==='function'?native:null;
}
function rewardedAvailable(){return Boolean(getRewardBridge());}
// V85: one-time "Remove ads" purchase (Google Play Billing, product id no_ads, owner price EUR 1.50).
// Only Play's own purchase record unlocks it; the cached flag keeps it working offline.
const NO_ADS_KEY='alchemy10k_no_ads_v1';
let noAds=false;try{noAds=localStorage.getItem(NO_ADS_KEY)==='1';}catch{}
let billingPrice='€1.50',billingProductReady=false;
function billingBridge(){const cap=window.Capacitor;if(cap?.getPlatform?.()!=='android')return null;const b=cap.Plugins?.AlchemyBilling;return b&&typeof b.getStatus==='function'?b:null;}
function adFree(){return noAds;}
function setNoAds(on){
 if(noAds===on)return;noAds=on;
 try{if(on)localStorage.setItem(NO_ADS_KEY,'1');else localStorage.removeItem(NO_ADS_KEY);}catch{}
 if(on&&!hintBank.started){hintBank={count:HINT_BANK_MAX,next:0,started:true};saveHintBank();}
 refreshMonetizedLabels();
}
function applyBillingStatus(st){
 if(!st||typeof st!=='object')return;
 if(typeof st.price==='string'&&st.price)billingPrice=st.price;
 billingProductReady=st.available===true;
 if(st.noAds===true)setNoAds(true);
 else if(st.noAds===false&&st.available===true)setNoAds(false); // refunded or revoked by Play
}
async function refreshBilling(){const b=billingBridge();if(!b)return;try{applyBillingStatus(await b.getStatus());}catch(e){console.warn('Billing status unavailable',e);}}
function openRemoveAds(){
 if(adFree()){showModal(`<div class="modal-tag">REMOVE ADS</div><h2>Ads removed</h2><p>Thank you for supporting Alchemy 10K! Mode switches, Batch and Merge are free, you keep a bank of ${HINT_BANK_MAX} hints that refills one every 15 minutes, and Shiny elements appear 5× more often.</p><p class="mini-muted">Optional ads remain only if you want extra hints when your bank is empty.</p><button type="button" class="modal-button secondary" id="removeAdsClose">Close</button>`);$('removeAdsClose').onclick=closeModal;return;}
 const b=billingBridge();
 showModal(`<div class="modal-tag">REMOVE ADS</div><h2>Play without ads · ${escapeText(billingPrice)}</h2><ul class="perk-list"><li>No ads for mode switches, Batch or Merge</li><li>${HINT_BANK_MAX} hints included, +1 free hint every 15 minutes</li><li>Shiny chance 5% instead of 1%</li><li>Optional ads only for extra hints</li></ul><button type="button" class="modal-button" id="buyNoAds" ${b?'':'disabled'}>Buy · ${escapeText(billingPrice)}</button><button type="button" class="modal-button secondary" id="restoreNoAds" ${b?'':'disabled'}>Restore purchase</button><p class="mini-muted">${b?'One-time purchase through Google Play.':'Purchases need the Android app from Google Play.'}</p>`);
 if(!b)return;
 $('buyNoAds').onclick=async()=>{$('buyNoAds').disabled=true;try{const r=await b.purchaseNoAds();applyBillingStatus(r);if(r?.noAds===true){openRemoveAds();return;}toast(r?.cancelled?'Purchase cancelled':r?.pending?'Purchase pending · it unlocks when Google Play confirms it':'Purchase not completed','repeat');}catch(e){console.warn(e);toast('Google Play purchase is not available yet','error');}if(!$('modal').hidden&&$('buyNoAds'))$('buyNoAds').disabled=false;};
 $('restoreNoAds').onclick=async()=>{await refreshBilling();if(adFree())openRemoveAds();else toast('No previous purchase found','repeat');};
}
// V85 ad-free hint bank: 10 included; using one starts a timer that adds one free hint every
// 15 minutes until the bank is full. With an empty bank, an optional rewarded ad still works.
const HINT_BANK_KEY='alchemy10k_hint_bank_v1',HINT_BANK_MAX=10,HINT_BANK_REFILL_MS=15*60*1000;
let hintBank={count:HINT_BANK_MAX,next:0,started:false};
try{const raw=JSON.parse(localStorage.getItem(HINT_BANK_KEY)||'null');if(raw&&Number.isFinite(raw.count))hintBank={count:Math.max(0,Math.min(HINT_BANK_MAX,Math.floor(raw.count))),next:Number(raw.next)||0,started:true};}catch{}
function saveHintBank(){try{localStorage.setItem(HINT_BANK_KEY,JSON.stringify(hintBank));}catch{}}
function syncHintBank(){
 const now=Date.now();
 if(hintBank.count>=HINT_BANK_MAX){hintBank.next=0;return;}
 if(!hintBank.next)hintBank.next=now+HINT_BANK_REFILL_MS;
 while(hintBank.count<HINT_BANK_MAX&&now>=hintBank.next){hintBank.count++;hintBank.next+=HINT_BANK_REFILL_MS;}
 if(hintBank.count>=HINT_BANK_MAX)hintBank.next=0;
 saveHintBank();
}
function takeBankHint(){syncHintBank();if(hintBank.count<=0)return false;hintBank.count--;if(!hintBank.next)hintBank.next=Date.now()+HINT_BANK_REFILL_MS;saveHintBank();refreshMonetizedLabels();return true;}
function minutesUntil(at){return Math.max(1,Math.ceil((at-Date.now())/60000));}
function refreshMonetizedLabels(){
 const h=$('compassBtn');
 if(h){if(adFree()){syncHintBank();h.textContent=hintBank.count>0?`Hint · ${hintBank.count}`:'Hint · ad';h.title=hintBank.count>0?`${hintBank.count} of ${HINT_BANK_MAX} hints left`:`Next free hint in ${minutesUntil(hintBank.next)} min, or watch an optional ad`;}
  else{h.textContent='Hint · ad';h.title='Watch a rewarded ad to reveal a craftable recipe';}}
 refreshMergeButton();
}
// V85: after one rewarded mode-switch ad, switching again within 5 minutes is free
// (so the player can go back without another ad).
const MODE_GRACE_KEY='alchemy10k_mode_switch_grace_v1',MODE_GRACE_MS=5*60*1000;
function modeGraceLeft(){try{return Math.max(0,(Number(localStorage.getItem(MODE_GRACE_KEY))||0)-Date.now());}catch{return 0;}}
function modeSwitchFree(){return adFree()||modeGraceLeft()>0;}
function modeCostNote(){if(adFree())return 'Switching is free without ads.';const g=modeGraceLeft();if(g>0)return `Free switch for ${minutesUntil(Date.now()+g)} more min.`;return 'Changing modes or families requires a rewarded ad; after it, switching again is free for 5 minutes.';}
// V85 Shiny elements: every successful combination has a 1% chance (5% without ads) to turn
// its result Shiny: same element, a twinkling star overlay and a trivia card. Shared by all modes.
const SHINY_KEY='alchemy10k_shiny_v1';
let shiny=new Set();
try{const raw=JSON.parse(localStorage.getItem(SHINY_KEY)||'null');if(Array.isArray(raw?.ids))shiny=new Set(raw.ids.filter(x=>typeof x==='string'));}catch{}
function saveShiny(){try{localStorage.setItem(SHINY_KEY,JSON.stringify({v:1,ids:[...shiny]}));}catch{}}
function shinyChance(){return adFree()?0.05:0.01;}
function rollShiny(id){if(shiny.has(id))return false;if(Math.random()>=shinyChance())return false;shiny.add(id);saveShiny();return true;}
function shinyTrivia(item){return item?.trivia||item?.wit||wittyDiscovery(item)||item?.summary||'';}
function shinyCard(item){return `<p class="shiny-trivia"><span aria-hidden="true">✦</span> ${escapeText(publicText(shinyTrivia(item)))}</p>`;}
function showShinyFound(id){const it=byId.get(id);if(!it)return;
 showModal(`<div class="modal-tag shiny-tag">✦ SHINY ELEMENT</div><div class="modal-art is-shiny">${staticArt(it)}</div><h2>Shiny ${escapeText(uiName(it))}</h2>${shinyCard(it)}<div class="modal-milestone">${shiny.size.toLocaleString('en-US')} shiny ${shiny.size===1?'element':'elements'} · ${Math.round(shinyChance()*100)}% chance per combination</div>`);
}
const APP_VERSION='1.0.15';
// V83: status line + Google consent (UMP) privacy options, required for EEA players.
async function refreshAdStatus(){
 const el=$('settingsAdStatus'),bridge=getRewardBridge();
 if(!el||!bridge||typeof bridge.getStatus!=='function')return;
 try{
  const st=await bridge.getStatus();if(!el.isConnected)return;
  const label=st?.adReady?'Ad ready':st?.loading?'Loading ad…':st?.sdkReady?'No ad loaded yet':'Starting ads…';
  el.textContent=`${st?.test?'Test ads · ':''}${label}${st?.privacyOptionsRequired?' · Consent options':''}`;
 }catch(e){el.textContent='Ads unavailable';}
}
async function openAdPrivacyOptions(){
 const bridge=getRewardBridge();
 if(!bridge||typeof bridge.showPrivacyOptions!=='function'){toast('Ad privacy options are available in the Android app');return;}
 try{const r=await bridge.showPrivacyOptions();if(r?.shown===false)toast('No ad consent options are required on this device');}
 catch(e){toast('Ad privacy options unavailable right now','error');}
 refreshAdStatus();
}

try{
 const old=JSON.parse(localStorage.getItem('gameverse_alchemy_v2')||'null');
 if(old?.v===2){for(const id of old.u||[])if(Number.isInteger(id)&&id>=0&&id<DATA.items.length)unlocked.add(`legacy:${id}`);known=new Set(old.r||[]);recent=(old.recent||[]).filter(x=>Number.isInteger(x)&&x>=0&&x<ITEMS.length).map(x=>`legacy:${x}`);last=Number.isInteger(old.last)&&old.last>=0?`legacy:${old.last}`:null;}
 apiBase=''; // V19 offline edition: no server required
}catch{}
try{
 const dyn=JSON.parse(localStorage.getItem('gameverse_dynamic_v11')||'null');
 if(dyn?.v===11){for(const item of dyn.items||[]){if(typeof item.id==='string'&&item.id.startsWith('generated:')&&typeof item.name==='string'&&item.name.length<101&&typeof item.category==='string')byId.set(item.id,item);}
  for(const [key,value] of dyn.recipes||[]){if(typeof key==='string'&&typeof value==='string'&&byId.has(value))recipes.set(key,value);}
  for(const id of dyn.unlocked||[])if(byId.has(id))unlocked.add(id);
  if(typeof dyn.last==='string'&&byId.has(dyn.last))last=dyn.last;
  for(const id of dyn.recent||[])if(byId.has(id)&&!recent.includes(id))recent.push(id);}
 if(false&&apiBase)sessionToken=localStorage.getItem('gameverse_session_v11:'+apiBase)||null;
}catch{}
// Migration preserves every V1–V15 unlocked element but never fabricates old timestamps or World Firsts.
try {
 const state=JSON.parse(localStorage.getItem('gameverse_ledger_v16')||'null');
 if(state?.v===16)for(const [id,record] of state.entries||[])if(byId.has(id)&&!STARTERS.has(id)&&record&&typeof record==='object')discoveryLedger.set(id,record);
} catch {}
for(const id of unlocked)if(!STARTERS.has(id)&&!discoveryLedger.has(id))discoveryLedger.set(id,{at:null,source:'imported'});
// V35: chronological, never re-ordered by an ingredient being reused. Optional save key;
// older V34 progress keeps working. For imported saves, dated finds are ordered by date.
const DISCOVERY_ORDER_KEY='35k_discovery_order_v35';
const originalOrder=[...unlocked];
let discoveryOrder=[];
try {const persisted=JSON.parse(localStorage.getItem(DISCOVERY_ORDER_KEY)||'null');
 if(Array.isArray(persisted))discoveryOrder=[...new Set(persisted.filter(id=>typeof id==='string'&&unlocked.has(id)))];
} catch {}
if(!discoveryOrder.length){
 discoveryOrder=originalOrder.slice().sort((a,b)=>{
  if(STARTERS.has(a)||STARTERS.has(b))return STARTERS.has(a)?(STARTERS.has(b)?originalOrder.indexOf(a)-originalOrder.indexOf(b):-1):1;
  const da=discoveryLedger.get(a)?.at,db=discoveryLedger.get(b)?.at;
  if(da&&db&&da!==db)return da<db?-1:1;
  if(da!==db)return da?1:-1;
  return originalOrder.indexOf(a)-originalOrder.indexOf(b);
 });
}
const discoveryOrderSet=new Set(discoveryOrder);
function syncDiscoveryOrder(){for(const id of unlocked)if(!discoveryOrderSet.has(id)){discoveryOrderSet.add(id);discoveryOrder.push(id);}}

const firstStorageKey=()=>`gameverse_verified_firsts_v16:${apiBase}:${sessionToken?.slice(0,16)||'none'}`;
// V48: independent Family Only save; the classic save format is never overwritten by family play.
function snapshotPlayState(){return {
 unlocked:[...unlocked],known:[...known],recent:[...recent],last,
 ledger:[...discoveryLedger],order:[...discoveryOrder],clues:{...hintState.clues}
};}
function storeFamilyProfile(){if(progressWiping||currentMode!=='family'||!currentFamilyId)return;
 familyProfiles[currentFamilyId]=snapshotPlayState();
 // A single shared ID is owned by all eligible Family Only campaigns.
 // This makes the unlock visible on the other campaign even before visiting it.
 familyProfiles=synchronizeFamilyProfiles(familyProfiles,ALL_CAMPAIGNS).profiles;
 try{localStorage.setItem(FAMILY_SAVES_KEY,JSON.stringify(familyProfiles));}catch{}
}
function restorePlayState(raw,starterIds){const allowed=new Set(currentMode==='family'?familyCampaigns.get(currentFamilyId).items:[...byId.keys()]);
 unlocked=new Set((raw?.unlocked||starterIds).filter(id=>allowed.has(id)));
 for(const id of starterIds)unlocked.add(id);
 known=new Set((raw?.known||[]).filter(p=>recipes.has(p)));
 recent=(raw?.recent||[]).filter(id=>unlocked.has(id));
 last=unlocked.has(raw?.last)?raw.last:null;
 discoveryLedger=new Map((raw?.ledger||[]).filter(([id])=>unlocked.has(id)));
 discoveryOrder=[...new Set((raw?.order||[]).filter(id=>unlocked.has(id)))];
 discoveryOrderSet.clear();for(const id of discoveryOrder)discoveryOrderSet.add(id);
 syncDiscoveryOrder();hintState={clues:{...(raw?.clues||{})}};
}
function syncModeButton(){const c=$('modeBtn');if(!c)return;
 c.textContent=currentMode==='family'?'Family':'Classic';
 c.setAttribute('aria-label','Game mode: '+(currentMode==='family'?'Family Only':'Classic')+' — open modes');
 document.body.dataset.gameMode=currentMode;
 if(currentMode==='family')document.body.dataset.family=currentFamilyId;else delete document.body.dataset.family;
 syncFamilyBanner();
 const label=$('playFamilyLabel');if(label)label.textContent=currentMode==='family'?(FAMILIES.find(f=>f.id===currentFamilyId)?.name||'Family'):'All families';
 const picker=$('playFamily');if(picker)picker.disabled=currentMode==='family';
}
function syncFamilyBanner(){
 const bar=$('familyBanner');if(!bar)return;
 bar.hidden=false;bar.dataset.mode=currentMode;
 if(currentMode==='family'){
  const f=FAMILIES.find(x=>x.id===currentFamilyId),c=familyCampaigns.get(currentFamilyId);
  $('familyBannerArt').innerHTML=f?familyCardArtwork(f):'';
  $('familyBannerKind').textContent='Family mode';
  $('familyBannerName').textContent=f?.name||'Family';
  const found=c?[...unlocked].filter(id=>c.itemSet.has(id)).length:unlocked.size;
  $('familyBannerProgress').textContent=c?`${found.toLocaleString('en-US')} / ${c.items.length.toLocaleString('en-US')}`:'';
  const pct=c&&c.items.length?Math.min(100,100*found/c.items.length):0;bar.style.setProperty('--family-progress',pct.toFixed(1)+'%');
 } else {
  $('familyBannerArt').innerHTML=`<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3"/><path d="M7.5 15h9"/></svg>`;
  $('familyBannerKind').textContent='Classic mode';
  $('familyBannerName').textContent='All families';
  const total=ITEMS.length;
  $('familyBannerProgress').textContent=`${unlocked.size.toLocaleString('en-US')} / ${total.toLocaleString('en-US')}`;
  bar.style.setProperty('--family-progress',(100*unlocked.size/total).toFixed(2)+'%');
 }
 $('familyBannerName').title=$('familyBannerName').textContent;
}
function activateMode(next,familyId=null){
 if(next==='family'&&!familyCampaigns.has(familyId))return false;
 if(currentMode==='family')storeFamilyProfile();else classicSnapshot=snapshotPlayState();
 clearTimeout(autoTimer);slots=[null,null];leftLocked=false;
 if(next==='family'){
  const campaign=familyCampaigns.get(familyId);
  currentMode='family';currentFamilyId=familyId;
  recipes=campaign.recipeMap;STARTERS=new Set(campaign.starters);
  restorePlayState(familyProfiles[familyId],campaign.starters);
 } else {
  currentMode='classic';currentFamilyId=null;recipes=classicRecipes;
  STARTERS=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
  restorePlayState(classicSnapshot,[...STARTERS]);
 }
 recipeUses.clear();for(const [pair,out] of recipes){const [a,b]=pair.split('|');for(const id of new Set([a,b])){
  if(!recipeUses.has(id))recipeUses.set(id,[]);recipeUses.get(id).push({a,b,out});
 }}
 routeDepth.clear();for(const id of STARTERS)routeDepth.set(id,0);
 for(let i=0;i<55;i++){let updated=false;for(const [pair,out] of recipes){const [a,b]=pair.split('|');const da=routeDepth.get(a),db=routeDepth.get(b);if(da==null||db==null)continue;const nextDepth=Math.max(da,db)+1;if(nextDepth<(routeDepth.get(out)??Infinity)){routeDepth.set(out,nextDepth);updated=true;}}if(!updated)break;}
 playFamily=currentMode==='family'?familyId:'all';playQuery='';playFilter='all';activeFamily=null;activeSet=null;discoverQuery='';
 $('playSearch').value='';$('discoverSearch').value='';
 $('familiesOverview').hidden=false;$('familyDetail').hidden=true;
 worldFirsts.clear();batchState=null;clearCraftFeedback();syncModeButton();updateSlotUI();updateCounts();rerenderCollections();switchTab('Play');
 if(currentMode==='family')storeFamilyProfile();
 return true;
}
// V49: the first level is intentionally only Classic / Families Only.
// Family cards are shown on a separate image-led screen; ad-gating occurs only
// after the user chooses an AVAILABLE family. A first choice remains free.
function modePicker(firstChoice=false){
 const cards=`<button type="button" class="mode-selection-card mode-main-card" data-mode-choice="classic"><span class="mode-main-picture" aria-hidden="true">${GAMEVERSE_ART.crystal?`<img src="${GAMEVERSE_ART.crystal}" alt="">`:fallbackIcon()}</span><span class="mode-main-copy"><strong>Classic</strong><small>Begin with Water, Fire, Earth &amp; Air. Discover all ${ITEMS.length.toLocaleString('en-US')} elements.</small><em>${firstChoice?'Play for free':currentMode==='classic'?'Current mode':'Watch Ad to switch'}</em></span><span class="mode-main-arrow" aria-hidden="true">›</span></button>
 <button type="button" class="mode-selection-card mode-main-card" data-mode-choice="families"><span class="mode-main-picture" aria-hidden="true">${FAMILY_ICONS_V54.nature?`<img src="${FAMILY_ICONS_V54.nature}" alt="">`:fallbackIcon()}</span><span class="mode-main-copy"><strong>Families Only</strong><small>Pick one family and complete it on its own: four starters, in-family recipes.</small><em>Choose a family</em></span><span class="mode-main-arrow" aria-hidden="true">›</span></button>`;
 showModal(`<div class="modal-tag">${firstChoice?'FIRST LAUNCH':'GAME MODES'}</div><h2>Choose your mode</h2><p>Choose how you want to discover. Each mode saves its own progress.</p><div class="mode-selection-list mode-main-list">${cards}</div><p class="mini-muted">${firstChoice?'Your first choice is free. Later changes require a rewarded ad.':escapeText(modeCostNote())}</p>`);
 $('modal').dataset.dismiss=firstChoice?'x-only':'any';$('modalClose').hidden=firstChoice;
 $('modalContent').querySelector('[data-mode-choice="classic"]').onclick=()=>requestModeActivation('classic',null,firstChoice);
 $('modalContent').querySelector('[data-mode-choice="families"]').onclick=()=>familyModePicker(firstChoice);
}
const THEMATIC_FAMILY_ART={
 mythology:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><path d="M15 87h70v-7H15z" fill="#9D8BB0"/><path d="M18 75h64v5H18zM21 35h58v7H21z" fill="#BCA7D4"/><path d="M17 34 50 14l33 20z" fill="#EBC18E" stroke="#AE8A62" stroke-width="3"/><path d="M28 43h9v32h-9zM45 43h10v32H45zM63 43h9v32h-9z" fill="#F5E9D6" stroke="#AA98AD" stroke-width="2"/><path d="m58 8-19 31h14l-12 33 31-42H56L67 8z" fill="#FFC65C" stroke="#DB8E3C" stroke-width="2"/></svg>`,
 prehistoric:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><path d="M13 82q27-13 74 0v9H13z" fill="#C4A880"/><path d="M13 70q13-19 30-17 15-23 31-13l9 13-5 7-12-8q-9-3-14 13L27 76z" fill="#95B4A0" stroke="#557A70" stroke-width="3"/><path d="m22 70-6 11m27-17-5 17m23-16 8 15" stroke="#557A70" stroke-width="5" stroke-linecap="round"/><path d="M72 35 88 26l-4 21-12 4z" fill="#95B4A0" stroke="#557A70" stroke-width="3"/><circle cx="79" cy="39" r="2.5" fill="#283C42"/><path d="m40 52-12-14 15 4 1-11 12 15" fill="#95B4A0" stroke="#557A70" stroke-width="3" stroke-linejoin="round"/><path d="m64 64 5-5" stroke="#F8DAB5" stroke-width="3"/></svg>`
};
function familyCardArtwork(f){
 if(FAMILY_ART_V88[f.id])return FAMILY_ART_V88[f.id];
 if(THEMATIC_FAMILY_ART[f.id])return THEMATIC_FAMILY_ART[f.id];
 const src=FAMILY_ICONS_V54[f.id];
 if(src)return `<img src="${src}" alt="" loading="lazy" decoding="async">`;
 // Original in-game fallback, if a new family has not been illustrated.
 const itemNames={nature:'Tree',people:'Human',world:'Globe'};
 if(itemNames[f.id]){const item=ITEMS.find(item=>item.name===itemNames[f.id]);if(item)return staticArt(item);}
 if(GAMEVERSE_ART[f.icon])return `<img src="${GAMEVERSE_ART[f.icon]}" alt="" loading="lazy" decoding="async">`;
 return fallbackIcon();
}
function familyModePicker(firstChoice=false){
 const options=[...FAMILIES].sort((a,b)=>Number(familyCampaigns.has(b.id))-Number(familyCampaigns.has(a.id))||a.order-b.order).map(f=>{
  const campaign=familyCampaigns.get(f.id),ready=!!campaign;
  const selected=currentMode==='family'&&currentFamilyId===f.id;
  const status=ready?(firstChoice?'Play free':selected?'Currently playing':'Watch Ad to play'):'Coming Soon';
  const sharedCount=ready?campaign.items.filter(id=>[...familyCampaigns.values()].some(other=>other.id!==f.id&&other.itemSet.has(id))).length:0;
  const found=ready?new Set([...(familyProfiles[f.id]?.unlocked||[]),...campaign.starters].filter(id=>campaign.itemSet.has(id))).size:0;
  const detail=ready?`${found.toLocaleString('en-US')} / ${campaign.items.length.toLocaleString('en-US')} discovered · 4 starters${sharedCount?' · '+sharedCount+' shared':''}`:'Family recipes in development';
  return `<button type="button" class="family-hero-card ${ready?'is-ready':'is-locked'}" data-campaign-id="${f.id}" ${ready?'':'disabled'} aria-label="${escapeText(f.name)}: ${status}"><span class="family-hero-art" aria-hidden="true">${familyCardArtwork(f)}</span><span class="family-hero-copy"><strong>${escapeText(f.name)}</strong><small>${detail}</small><em>${status}</em></span><span class="family-hero-edge" aria-hidden="true">${ready?'›':'🔒'}</span></button>`;
 }).join('');
 showModal(`<div class="modal-tag">FAMILIES ONLY</div><h2>Choose a family</h2><p>Each family is complete on its own, from four starters. Shared elements unlock in every family they belong to.</p><div class="family-campaign-gallery" role="group" aria-label="Select a family to play">${options}</div><button type="button" class="family-gallery-back" id="backToModes">‹ Back to modes</button><p class="mini-muted">${firstChoice?'First choice is free.':escapeText(modeCostNote())} Every family is a complete campaign with its own four starters.</p>`);
 $('modal').dataset.dismiss=firstChoice?'x-only':'any';$('modalClose').hidden=firstChoice;
 $('backToModes').onclick=()=>modePicker(firstChoice);
 $('modalContent').querySelectorAll('[data-campaign-id]').forEach(btn=>btn.onclick=()=>requestModeActivation('family',btn.dataset.campaignId,firstChoice));
}
async function requestModeActivation(target,family,firstChoice=false){
 if(target==='family'&&!familyCampaigns.has(family))return;
 if(currentMode===target&&(target==='classic'||family===currentFamilyId)&&!firstChoice){closeModal();return;}
 if(firstChoice){
  try{localStorage.setItem(MODE_SELECTION_KEY,JSON.stringify({mode:target,family}));}catch{}
  activateMode(target,family);$('modal').hidden=true;$('modalClose').hidden=false;return;
 }
 if(modeSwitchFree()){
  activateMode(target,family);
  try{localStorage.setItem(MODE_SELECTION_KEY,JSON.stringify({mode:target,family}));}catch{}
  $('modal').hidden=true;$('modalClose').hidden=false;
  if(!adFree())toast(`Free switch · ${minutesUntil(Date.now()+modeGraceLeft())} min left`,'repeat');
  return;
 }
 if(!rewardedAvailable()){
  showModal(`<div class="modal-tag">REWARDED MODE SWITCH</div><h2>Ads unavailable</h2><p>Changing modes or families requires a completed rewarded ad in the Android app. This standalone HTML does not simulate ads.</p><p class="mini-muted">Your current mode and progress remain unchanged.</p><button type="button" id="returnToFamilyPicker" class="modal-button secondary">Back to modes</button>`);
  $('returnToFamilyPicker').onclick=()=>modePicker(false);return;
 }
 if(rewardedHintBusy)return;rewardedHintBusy=true;
 showModal(`<div class="modal-tag">REWARDED MODE SWITCH</div><h2>Loading ad…</h2><p>Switching only happens when the Android ad SDK confirms the earned reward.</p>`);
 let result=null;
 try{result=await getRewardBridge().showRewarded({kind:'mode_switch',from:currentMode,to:target,family});}
 catch(e){console.warn('Mode rewarded ad failed',e);}
 finally{rewardedHintBusy=false;}
 if(result?.earned!==true){showModal(`<h2>Mode unchanged</h2><p>The ad was unavailable, dismissed or not rewarded. Your game and progress were preserved.</p><button type="button" class="modal-button secondary" id="tryModesAgain">Back to modes</button>`);$('tryModesAgain').onclick=()=>modePicker(false);return;}
 try{localStorage.setItem(MODE_GRACE_KEY,String(Date.now()+MODE_GRACE_MS));}catch{}
 activateMode(target,family);
 try{localStorage.setItem(MODE_SELECTION_KEY,JSON.stringify({mode:target,family}));}catch{}
 $('modal').hidden=true;$('modalClose').hidden=false;
 toast('Mode changed · switching back is free for 5 minutes','repeat');
}
function showPendingCount(n){pendingCount=Math.max(0,Number(n)||0);const el=$('pendingChip');if(!el)return;el.hidden=pendingCount===0;el.textContent=`${pendingCount} pending`;}
function resetWorldFirsts(){worldFirsts.clear();worldStatsVerified=false;}
// V60: Classic saves can be written while a Family Only campaign remains active.
// Never call activateMode here; merging is not a mode switch and cannot change recipes.
function persistClassicSnapshot(state){try{
 const u=[...new Set(state.unlocked||[])].filter(id=>byId.has(id));
 const r=state.recent||[],ledger=state.ledger||[],order=state.order||[];
 localStorage.setItem(DISCOVERY_ORDER_KEY,JSON.stringify(order));
 localStorage.setItem('gameverse_ledger_v16',JSON.stringify({v:16,entries:ledger}));
 localStorage.setItem('gameverse_alchemy_v2',JSON.stringify({v:2,u:u.filter(i=>i.startsWith('legacy:')).map(i=>Number(i.slice(7))),r:state.known||[],recent:r.filter(i=>i.startsWith('legacy:')).slice(0,300).map(i=>Number(i.slice(7))),last:state.last?.startsWith('legacy:')?Number(state.last.slice(7)):null}));
 localStorage.setItem('gameverse_dynamic_v11',JSON.stringify({v:11,items:[...byId.values()].filter(i=>i.id.startsWith('generated:')).map(i=>({id:i.id,name:i.name,category:i.category,summary:i.summary||'',iconStatus:i.iconStatus||'pending',iconUrl:i.iconUrl||null,iconFamily:i.iconFamily||null,paletteVariant:i.paletteVariant||null})),recipes:[...classicRecipes.entries()].filter(([k,v])=>v.startsWith('generated:')||k.includes('generated:')),unlocked:u.filter(i=>!i.startsWith('legacy:')),recent:r.filter(i=>!i.startsWith('legacy:')).slice(0,350),last:(state.last&&!state.last.startsWith('legacy:'))?state.last:null}));
 }catch(e){console.warn('Classic progress save failed',e);return false;}return true;
}
const save=()=>{if(progressWiping)return;if(currentMode==='family'){storeFamilyProfile();return;}syncDiscoveryOrder();persistClassicSnapshot(snapshotPlayState());};
// V60: Family -> Classic batch import costs TWO separately opted-in rewarded ads.
// A completed first ad is retained if the second is unavailable or dismissed.
// The snapshot is frozen at the first ad; newly earned family items require a later merge.
let mergePending=null;
try {const raw=JSON.parse(localStorage.getItem(MERGE_PENDING_KEY)||'null');if(verifyMergePending(raw))mergePending=raw;}catch{}
function familyMergeCandidates(){
 if(currentMode==='family')storeFamilyProfile();
 return eligibleFamilyMerge(familyProfiles,ALL_CAMPAIGNS,liveClassicUnlocked(),byId);
}
function mergeStatus(){
 const current=familyMergeCandidates();
 // Only eligible recorded family discoveries can be credited; unearned starters are excluded.
 const valid=new Set(current.ids);
 if(mergePending){
  const ids=mergePending.ids.filter(id=>valid.has(id));
  if(!ids.length){mergePending=null;savePendingMerge();}
  else if(ids.length!==mergePending.ids.length){mergePending={...mergePending,ids};savePendingMerge();}
 }
 return {current,pending:mergePending,count:mergePending?mergePending.ids.length:current.ids.length};
}
function savePendingMerge(){try{if(mergePending)localStorage.setItem(MERGE_PENDING_KEY,JSON.stringify(mergePending));else localStorage.removeItem(MERGE_PENDING_KEY);}catch{}}
// V85: Merge works both ways. Classic -> Families copies Classic discoveries into every
// family campaign that contains them (Classic starters excluded); 2 rewarded ads or free without ads.
const MERGE_TO_FAMILIES_KEY='alchemy10k_merge_to_families_v1';
let mergeToFamiliesCredit=0;
try{mergeToFamiliesCredit=Math.max(0,Math.min(2,Number(JSON.parse(localStorage.getItem(MERGE_TO_FAMILIES_KEY)||'null')?.completed)||0));}catch{}
function saveMergeToFamiliesCredit(){try{if(mergeToFamiliesCredit)localStorage.setItem(MERGE_TO_FAMILIES_KEY,JSON.stringify({v:1,completed:mergeToFamiliesCredit}));else localStorage.removeItem(MERGE_TO_FAMILIES_KEY);}catch{}}
function liveClassicUnlocked(){return currentMode==='classic'?[...unlocked]:(classicSnapshot?.unlocked||[]);}
function classicToFamiliesCandidates(){
 if(currentMode==='family')storeFamilyProfile();
 const classic=new Set(liveClassicUnlocked().filter(id=>byId.has(id)&&!['legacy:0','legacy:1','legacy:2','legacy:3'].includes(id)));
 const byFamily={};let ids=new Set();
 for(const c of ALL_CAMPAIGNS){const have=new Set([...(familyProfiles[c.id]?.unlocked||[]),...c.starters]);
  const add=c.items.filter(id=>classic.has(id)&&!have.has(id));
  if(add.length){byFamily[c.id]=add;add.forEach(id=>ids.add(id));}}
 return {byFamily,count:ids.size};
}
function familyToClassicCount(){return mergeStatus().count;}
function refreshMergeButton(){
 const toClassic=familyToClassicCount(),toFamilies=classicToFamiliesCandidates().count,total=toClassic+toFamilies;
 const b=$('mergeClassicBtn');
 if(b){b.hidden=false;b.disabled=false;b.textContent=total?`⇄ Merge Classic and Families · ${total.toLocaleString('en-US')}`:'⇄ Merge · everything is up to date';}
 const p=$('playMergeBtn');
 if(p){p.hidden=false;p.textContent=total?`⇄ Merge · ${total.toLocaleString('en-US')}`:'⇄ Merge';p.classList.toggle('has-items',total>0);}
}
function mergeHub(){
 const toClassic=familyToClassicCount(),c2f=classicToFamiliesCandidates();
 const cost=adFree()?'Free · no ads':'2 rewarded ads';
 showModal(`<div class="modal-tag">MERGE</div><h2>Merge progress</h2><p>Copy discoveries between Classic and Families Only. Nothing is ever removed.</p><div class="merge-hub">
  <button type="button" class="merge-hub-option" id="mergeHubToClassic" ${toClassic?'':'disabled'}><span class="merge-hub-arrow" aria-hidden="true">↗</span><span><strong>Families → Classic</strong><small>${toClassic?`${toClassic.toLocaleString('en-US')} family discoveries missing in Classic · ${cost}`:'Classic already has every family discovery'}</small></span></button>
  <button type="button" class="merge-hub-option" id="mergeHubToFamilies" ${c2f.count?'':'disabled'}><span class="merge-hub-arrow" aria-hidden="true">↙</span><span><strong>Classic → Families</strong><small>${c2f.count?`${c2f.count.toLocaleString('en-US')} Classic discoveries for ${Object.keys(c2f.byFamily).length} ${Object.keys(c2f.byFamily).length===1?'family':'families'} · ${cost}`:'Every family already has your Classic discoveries'}</small></span></button>
 </div><button type="button" class="modal-button secondary" id="mergeHubClose">Close</button>`);
 $('mergeHubToClassic').onclick=mergeModal;$('mergeHubToFamilies').onclick=mergeToFamiliesModal;$('mergeHubClose').onclick=closeModal;
}
function mergeToFamiliesModal(){
 const c2f=classicToFamiliesCandidates();
 if(!c2f.count){mergeHub();return;}
 const credited=adFree()?2:mergeToFamiliesCredit;
 const breakdown=Object.entries(c2f.byFamily).map(([id,a])=>`<span>${escapeText(FAMILIES.find(f=>f.id===id)?.name||id)}: ${a.length}</span>`).join(' · ');
 showModal(`<div class="modal-tag">CLASSIC → FAMILIES</div><h2>Merge Classic into Families</h2><p><strong>${c2f.count.toLocaleString('en-US')} ${c2f.count===1?'element':'elements'}</strong> from Classic unlock in the family campaigns that contain them.</p>${adFree()?'':`<div class="merge-steps" role="status" aria-live="polite"><span class="${credited>=1?'is-complete':''}">${credited>=1?'✓':'1'} First ad</span><span class="${credited>=2?'is-complete':''}">2 Second ad</span></div>`}<p class="mini-muted">${breakdown}</p>${adFree()||rewardedAvailable()||credited===2?'':`<p class="merge-no-ads">Rewarded ads are unavailable in this offline HTML.</p>`}<button type="button" class="modal-button" id="mergeFamiliesGo" ${adFree()||rewardedAvailable()||credited===2?'':'disabled'}>${credited>=2?'Merge now':`Watch ad ${credited+1} of 2`}</button><button type="button" class="modal-button secondary" id="mergeFamiliesBack">Back</button>`);
 $('mergeFamiliesGo').onclick=watchMergeToFamiliesAd;$('mergeFamiliesBack').onclick=mergeHub;
}
async function watchMergeToFamiliesAd(){
 if(rewardedHintBusy)return;
 if(adFree()||mergeToFamiliesCredit>=2){commitMergeToFamilies();return;}
 if(!rewardedAvailable()){mergeToFamiliesModal();return;}
 const step=mergeToFamiliesCredit+1,btn=$('mergeFamiliesGo');if(btn){btn.disabled=true;btn.textContent=`Showing ad ${step} of 2…`;}
 rewardedHintBusy=true;let reward;
 try{reward=await getRewardBridge().showRewarded({kind:'merge_to_families',step,total:2});}catch(e){console.warn('Merge ad unavailable',e);}
 finally{rewardedHintBusy=false;}
 if(reward?.earned!==true){mergeToFamiliesModal();return;}
 mergeToFamiliesCredit=step;saveMergeToFamiliesCredit();
 if(step<2){mergeToFamiliesModal();return;}
 commitMergeToFamilies();
}
function commitMergeToFamilies(){
 const c2f=classicToFamiliesCandidates(),at=new Date().toISOString();
 for(const [fid,ids] of Object.entries(c2f.byFamily)){const c=familyCampaigns.get(fid);if(!c)continue;
  const prof=familyProfiles[fid]||{unlocked:[...c.starters],known:[],recent:[],last:null,ledger:[],order:[],clues:{}};
  const u=new Set([...(prof.unlocked||[]),...c.starters]);const ledger=new Map(prof.ledger||[]);const order=[...(prof.order||[])];
  for(const id of ids){if(u.has(id))continue;u.add(id);ledger.set(id,{at,source:'merge-classic',ingredients:[]});order.push(id);}
  familyProfiles[fid]={...prof,unlocked:[...u],ledger:[...ledger],order,recent:[...ids.slice(0,40),...(prof.recent||[])].slice(0,350)};
 }
 familyProfiles=synchronizeFamilyProfiles(familyProfiles,ALL_CAMPAIGNS).profiles;
 try{localStorage.setItem(FAMILY_SAVES_KEY,JSON.stringify(familyProfiles));}catch{}
 if(currentMode==='family'){const c=familyCampaigns.get(currentFamilyId);restorePlayState(familyProfiles[currentFamilyId],c.starters);updateCounts();rerenderCollections();syncFamilyBanner();}
 mergeToFamiliesCredit=0;saveMergeToFamiliesCredit();refreshMergeButton();
 showModal(`<div class="modal-tag">TRANSFER COMPLETE</div><h2>${c2f.count.toLocaleString('en-US')} ${c2f.count===1?'element':'elements'} merged</h2><p>Your Classic discoveries are now unlocked in ${Object.keys(c2f.byFamily).length} family ${Object.keys(c2f.byFamily).length===1?'campaign':'campaigns'}. Classic is unchanged.</p><button class="modal-button" id="mergeDone">Continue playing</button>`);
 $('mergeDone').onclick=closeModal;
}
function mergeModal(){
 const {current,pending,count}=mergeStatus();
 const credited=adFree()?2:(pending?.completed||0);
 if(!count){
  showModal(`<div class="modal-tag">FAMILY → CLASSIC</div><h2>Nothing to merge yet</h2><p>Discover more Family Only elements that are not already collected in Classic. Free starting ingredients are not counted.</p><button class="modal-button secondary" id="mergeDone">Back</button>`);
  $('mergeDone').onclick=mergeHub;return;
 }
 const breakdown=Object.entries(current.byFamily).filter(([,n])=>n>0).map(([id,n])=>`<span>${escapeText(FAMILIES.find(f=>f.id===id)?.name||id)}: ${n}</span>`).join(' · ');
 showModal(`<div class="modal-tag">FAMILY → CLASSIC</div><h2>Merge Elements into Classic</h2><p><strong>${count.toLocaleString('en-US')} ${count===1?'element':'elements'}</strong> ready for Classic. Existing recipes and Family Only progress stay unchanged.</p>${adFree()?'':`<div class="merge-steps" role="status" aria-live="polite"><span class="${credited>=1?'is-complete':''}">${credited>=1?'✓':'1'} First ad</span><span class="${credited>=2?'is-complete':''}">2 Second ad</span></div>`}<p class="mini-muted">${breakdown||'Your Family Only discoveries'} · ${adFree()?'Free without ads.':'One batch costs 2 rewarded ads, each started by you. Progress 1/2 is saved if you return later.'} Shared items count once.</p>${rewardedAvailable()||credited===2?'':`<p class="merge-no-ads">Rewarded ads are unavailable in this offline HTML. No discoveries have been transferred.</p>`}<button type="button" class="modal-button" id="mergeWatchAd" ${rewardedAvailable()||credited===2?'':'disabled'}>${credited===2?(adFree()?'Merge now':'Finish transfer'):`Watch ad ${credited+1} of 2`}</button><button type="button" class="modal-button secondary" id="mergeLater">Back</button>`);
 $('mergeWatchAd').onclick=watchFamilyMergeAd;
 $('mergeLater').onclick=mergeHub;
}
function commitFamilyMerge(){
 const eligible=new Set(familyMergeCandidates().ids);
 const transfer=mergePending.ids.filter(id=>eligible.has(id));
 const base=currentMode==='classic'?snapshotPlayState():classicSnapshot;
 const result=mergeIntoClassicState(base,transfer,byId,new Date().toISOString());
 if(!persistClassicSnapshot(result)){
  showModal(`<h2>Could not save</h2><p>Both rewarded ads were completed, but Classic progress could not be stored. The transfer stays pending so you can retry without watching another ad.</p><button id="retryMergeSave" class="modal-button">Try saving again</button>`);
  $('retryMergeSave').onclick=commitFamilyMerge;return;
 }
 classicSnapshot=result;
 if(currentMode==='classic'){restorePlayState(result,[...STARTERS]);updateCounts();rerenderCollections();}
 mergePending=null;savePendingMerge();refreshMergeButton();
 showModal(`<div class="modal-tag">TRANSFER COMPLETE</div><h2>${transfer.length} ${transfer.length===1?'element':'elements'} merged</h2><p>Your newly unlocked Family Only discoveries are now available in Classic. You can continue playing this family; no recipes or Classic discoveries were removed.</p><button class="modal-button" id="mergeDone">Continue playing</button>`);
 $('mergeDone').onclick=closeModal;
}
async function watchFamilyMergeAd(){
 if(rewardedHintBusy)return;
 const {current,pending,count}=mergeStatus();if(!count)return;
 if(adFree()){mergePending={v:1,completed:2,ids:[...current.ids]};savePendingMerge();commitFamilyMerge();return;}
 if(pending?.completed===2){commitFamilyMerge();return;}
 if(!rewardedAvailable()){mergeModal();return;}
 // Take a stable snapshot *before* the first ad. Never charge 2 ads per element.
 if(!pending){mergePending={v:1,completed:0,ids:[...current.ids]};savePendingMerge();}
 const step=mergePending.completed+1;
 const button=$('mergeWatchAd');if(button){button.disabled=true;button.textContent=`Showing ad ${step} of 2…`;}
 rewardedHintBusy=true;
 let reward;
 try {reward=await getRewardBridge().showRewarded({kind:'merge_to_classic',step,total:2,elementCount:mergePending.ids.length});}
 catch(e){console.warn('Family merge rewarded ad unavailable',e);}
 finally {rewardedHintBusy=false;}
 if(reward?.earned!==true){mergeModal();return;}
 mergePending.completed=step;
 savePendingMerge();
 if(step===1){mergeModal();return;}
 commitFamilyMerge();
}

// V25: a collection state is NOT a global statistic. Never invent percentages of players.
const EXTRA_STORAGE='35k_alchemy_extras_v25';
const OFFLINE_PLAYER_STATS=null; // Future verified opt-in aggregate pack: {updated, sampleSize, rates:{[id]:integer 0..100}}
let favorites=new Set(), activeSet=null, discoverOrder='catalog', batchTrialUsed=false;
try {const raw=JSON.parse(localStorage.getItem(EXTRA_STORAGE)||'null');
 if(raw?.v===25){if(Array.isArray(raw.favorites))favorites=new Set(raw.favorites.filter(x=>typeof x==='string'&&x.length<130));batchTrialUsed=raw.batchTrialUsed===true;}
}catch{}
function saveExtras(){try{localStorage.setItem(EXTRA_STORAGE,JSON.stringify({v:25,favorites:[...favorites],batchTrialUsed}));}catch{}}
// Group progress contains no crowd telemetry. Every public percentage needs verified sample data.
function playerRate(id){const d=OFFLINE_PLAYER_STATS;
 return d&&d.sampleSize>=100&&Number.isInteger(d.rates?.[id])?`${d.rates[id]}% of players discovered this element`:'Player discovery rate · — (offline)';
}
const recipeUses=new Map();
for(const [pair,out] of recipes){const [a,b]=pair.split('|');for(const id of new Set([a,b])){
 if(!recipeUses.has(id))recipeUses.set(id,[]);recipeUses.get(id).push({a,b,out});
}}
const routeDepth=new Map([...STARTERS].map(id=>[id,0]));
// Monotonic relaxation. Capped and only runs once on catalog load.
for(let iter=0;iter<55;iter++){let changes=0;
 for(const [pair,out] of recipes){const [l,r]=pair.split('|'),dl=routeDepth.get(l),dr=routeDepth.get(r);
 if(dl===undefined||dr===undefined)continue;const nd=Math.max(dl,dr)+1;
 if(nd<(routeDepth.get(out)??Infinity)){routeDepth.set(out,nd);changes++;}}
 if(!changes)break;
}
function difficultyFor(id){const d=routeDepth.get(id);
 return d==null?'Unrated':d<=3?'Common':d<=6?'Uncommon':d<=10?'Rare':'Very rare';
}
function elementIsUseful(id){return (recipeUses.get(id)||[]).some(r=>unlocked.has(r.a===id?r.b:r.a)&&!unlocked.has(r.out));}
function elementIsComplete(id){return unlocked.has(id)&&!(recipeUses.get(id)||[]).some(r=>!unlocked.has(r.out));}
const COLLECTION_SETS=[
 {id:'playstation',name:'Disc Console Timeline',description:'Home consoles and portable systems across the disc era.',family:'games',names:['PlayStation','PlayStation 2','PlayStation 3','PlayStation 4','PlayStation 5','PSP','PS Vita'],icon:'console'},
 {id:'nintendo',name:'Pocket Console History',description:'Handheld games, cartridges and dual-screen devices.',family:'games',names:['Game Boy','Game Boy Color','Game Boy Advance','Nintendo DS','Nintendo 3DS'],icon:'handheld'},
 {id:'classics',name:'Retro Gaming Icons',description:'Platform games, fantasy quests and creature adventures.',family:'games',names:['Super Mario Bros.','The Legend of Zelda','Pokémon Red','Pokémon Blue','Sonic the Hedgehog'],icon:'game_case'},
 {id:"sega-hardware",name:'Arcade Console History',description:'16-bit machines, disc systems and portable arcade gaming.',family:"games",names:["Sega Genesis", "Sega Saturn", "Sega Dreamcast", "Sega Game Gear", "Sega CD"],icon:"game_case"},
 {id:"xbox-history",name:'Modern Home Consoles',description:'A timeline of high-powered living-room systems.',family:"games",names:["Xbox", "Xbox 360", "Xbox One", "Xbox Series X", "Xbox Series S"],icon:"game_case"},
 {id:"mario-eras",name:'Classic Platform Adventures',description:'Jump-and-run platform games from 2D to 3D.',family:"games",names:["Super Mario Bros.", "Super Mario World", "Super Mario 64", "Super Mario Sunshine", "Super Mario Galaxy", "Super Mario Odyssey"],icon:"game_case"},
 {id:"sonic-eras",name:'High-Speed Platformers',description:'Fast-moving platform games built around momentum.',family:"games",names:["Sonic the Hedgehog", "Sonic the Hedgehog 2", "Sonic CD", "Sonic Adventure", "Sonic Adventure 2", "Sonic Mania"],icon:"game_case"},
 {id:"kirby-tour",name:'Cute Fantasy Platformers',description:'Bright, playful platform adventures with tiny heroes.',family:"games",names:["Kirby’s Dream Land", "Kirby 64: The Crystal Shards", "Kirby: Triple Deluxe", "Kirby and the Forgotten Land"],icon:"game_case"},
 {id:"pokemon-eras",name:'Creature-Collecting RPGs',description:'Explore generations of turn-based creature adventures.',family:"games",names:["Pokémon Red", "Pokémon Gold", "Pokémon Ruby", "Pokémon Diamond", "Pokémon Black", "Pokémon X", "Pokémon Sun"],icon:"game_case"},
 {id:"dragon-ball-games",name:'Anime Battle Games',description:'Arena fighting, tournaments and energetic action.',family:"games",names:["Dragon Ball Z: Budokai 3", "Dragon Ball Z: Budokai Tenkaichi 3", "Dragon Ball FighterZ", "Dragon Ball Z: Kakarot"],icon:"game_case"},
 {id:"survival-horror",name:'Survival Horror Games',description:'Scary mysteries, survival and science-fiction horror.',family:"games",names:["Resident Evil 2", "Resident Evil 4", "Silent Hill 3", "Dead Space", "Resident Evil Village"],icon:"game_case"},
 {id:"pc-classics",name:'Classic PC Games',description:'Shooters, strategy and everyday-life simulations.',family:"games",names:["Half-Life", "DOOM", "Quake", "StarCraft", "The Sims"],icon:"game_case"},
 {id:"indie",name:'Indie Game Favorites',description:'Indie platformers, farming, exploration and stories.',family:"games",names:["Celeste", "Hollow Knight", "Stardew Valley", "Undertale", "Hades"],icon:"game_case"},
 {id:"nintendo-64",name:'64-Bit Game Classics',description:'Cartridge-era 3D platforming and kart racing.',family:"games",names:["Super Mario 64", "Mario Kart 64", "Donkey Kong 64", "Pokémon Snap", "Kirby 64: The Crystal Shards"],icon:"game_case"},
 {id:"sony-portables",name:'Portable Disc Gaming',description:'Pocket consoles and their action-adventure games.',family:"games",names:["PSP", "PS Vita", "God of War: Chains of Olympus", "Metal Gear Solid: Peace Walker"],icon:"game_case"},
 {id:"fighting-legends",name:'Arcade Fighting Games',description:'One-on-one fighters and classic tournament action.',family:"games",names:["Street Fighter II", "Mortal Kombat", "Tekken 3", "Virtua Fighter 2", "Street Fighter 6"],icon:"game_case"},
 {id:"music-games",name:'Music & Rhythm Games',description:'Play to the beat in dancing and instrument games.',family:"games",names:["Guitar Hero", "Dance Dance Revolution", "Wii Music", "Just Dance", "Rhythm Heaven Fever"],icon:"game_case"},
 {id:"zelda-classics",name:'Fantasy Quest Games',description:'Swordplay, exploration, dungeons and puzzle-solving.',family:"games",names:["The Legend of Zelda", "The Legend of Zelda: Twilight Princess", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Echoes of Wisdom"],icon:"game_case"},
];
for(const set of COLLECTION_SETS){set.ids=set.names.map(n=>ITEMS.find(it=>it.name.toLowerCase()===n.toLowerCase())?.id).filter(Boolean);}
function setProgress(s){return s.ids.filter(id=>unlocked.has(id)).length;}
function toggleFavorite(id){if(!unlocked.has(id))return;
 if(favorites.has(id))favorites.delete(id);else favorites.add(id);
 saveExtras();rerenderCollections();if(tab==='World')renderDiscoveries();
}


// V19: 12 static, self-produced cartoon families; they are shared and cached by the browser.
// Never download artwork or call AI to render an element during gameplay.
function gameverseArtKey(item){
 const n=(item.name||'').toLowerCase(), f=(item.iconFamily||'').toLowerCase(), cat=(item.category||'').toLowerCase();
 if(item.v19Art && (GAMEVERSE_ART[item.v19Art]||GAMEVERSE_ART_V23[item.v19Art]))return item.v19Art;
  if(/camera|photograph|digital camera|webcam/i.test(n))return 'camera';
 if(/sword|blade|katana|sabre/i.test(n))return 'flame_sword';
 if(/dragon(?! ball)/i.test(n))return 'dragon';
 if(/arcade|pinball/i.test(n)||cat==='arcade')return 'arcade';
 if(/crystal|gemstone|jewel/i.test(n))return 'crystal';
 if(/manga|comic book|graphic novel/i.test(n)||cat==='manga')return 'manga';
 if(/film|cinema|movie|director|clapperboard/i.test(n)||cat==='film')return 'cinema';
 if(/album|soundtrack|music|synthesizer|vinyl|song/i.test(n)||cat==='music')return 'music';
 if(/robot|mecha|cyborg/i.test(n)||f==='robot')return 'mecha';
 if(/game boy|game gear|game & watch|psp|vita|handheld|portable console|nintendo ds|nintendo 3ds/i.test(n))return 'handheld';
 if(/console|playstation|xbox|nintendo switch|wii|dreamcast|sega saturn|atari 2600|gamecube/i.test(n)||cat==='console'||cat==='portable')return 'console';
 if(/goku|saiyan|vegeta|naruto|luffy|ichigo|tanjiro|anime hero/i.test(n))return 'anime_hero';
 if(cat==='game')return 'game_case';
 if(cat==='anime')return 'anime_hero';
 if(cat==='series')return 'cinema';
 if(cat==='fantasy' && /hero|samurai|warrior/i.test(n))return 'mecha';
 return null;
}
function gameverseAccentKey(item){
 const n=(item.name||'').toLowerCase();
 if(!item.v19Art||item.category!=='game')return null;
 if(/dragon ball|budokai|fighterz|sparking|raging blast|kakarot/.test(n))return 'anime_hero';
 if(/naruto|bleach|one piece|demon slayer|jojo|titan/.test(n))return 'manga';
 if(/star wars|gundam|indiana jones/.test(n))return 'mecha';
 if(/sonic|pokémon/.test(n))return 'handheld';
 if(/spider-man|batman/.test(n))return 'flame_sword';
 if(/hogwarts|harry potter/.test(n))return 'crystal';
 return null;
}

// V27: resolve a genre-specific original cartoon drawing, then select one of twelve
// distinct PRE-RENDERED static compositions. Never compose artwork during a game frame.
// Older discoveries keep their stable IDs and recipe keys; visual changes are non-destructive.
function v27Motif(item){
 const n=String(item.name||'').toLowerCase();
 const c=String(item.category||'').toLowerCase();
 const f=String(item.iconFamily||'').toLowerCase();
 const s=String(item.summary||'').toLowerCase();
 if(/\bsonic\b|tails adventure|knuckles.*chaotix|sonic x shadow|sonic riders/.test(n))return 'speed_shoe';
 if(/mario kart|crash team racing|sonic.*racing|kart|diddy kong racing/.test(n))return 'kart';
 if(/racing|burnout|rally|forza|gran turismo|wipeout|ridge racer|need for speed|out run|daytona|f-zero/.test(n))return 'racing_helmet';
 if(/mario tennis|tennis|wimbledon/.test(n))return 'trophy_cup';
 if(/mario golf|golf|football|soccer|fifa|nba|wii sports|pro evolution|pes \d/.test(n))return 'soccer_ball';
 if(/dance|dancing|just dance|pump it up/.test(n))return 'dance_pad';
 if(/guitar|rock band|beatmania|rhythm|parappa|patapon|musical|synth|song/.test(n))return 'rhythm_keys';
 if(/mega man|megaman|astro boy|cyborg|mecha|robot|gundam/.test(n))return 'mecha_core';
 if(/halo|mass effect|metroid|dead space|starfield|space|astronaut|samus/.test(n))return 'space_visor';
 if(/star wars|star fox|asteroids|gradius|r-type|space invaders/.test(n))return 'spaceship';
 if(/portal|tetris|professor layton|picross|puzzle|lumines|columns|candy crush/.test(n))return 'puzzle_bricks';
 if(/dragon ball|saiyan|son goku|vegeta|goku black|naruto|bleach|one piece|demon slayer/.test(n))return 'anime_aura';
 if(/samurai|sekiro|ninja gaiden|shinobi|onimusha|ronin|katana/.test(n))return 'samurai_mask';
 if(/street fighter|tekken|mortal kombat|virtua fighter|king of fighters|injustice|soulcalibur|super smash/.test(n))return 'fighting_glove';
 if(/metal gear|splinter cell|hitman|stealth|sly cooper/.test(n))return 'stealth_radio';
 if(/resident evil|silent hill|fatal frame|amnesia|outlast|alone in the dark|castlevania|horror/.test(n))return 'haunted_mansion';
 if(/luigi's mansion|ghost|phantom|spirit/.test(n))return 'ghost';
 if(/final fantasy|dragon quest|persona|octopath|baldur|disgaea|fire emblem|rpg|xenoblade|atelier|kingdom hearts/.test(n))return 'rpg_book';
 if(/legend of zelda|hyrule|zelda|link's awakening|shield/.test(n))return 'mystic_shield';
 if(/god of war|elden ring|dark souls|demon's souls|bloodborne|hades|assassin|warrior/.test(n))return 'fantasy_potion';
 if(/monster hunter|monster rancher|pokémon|pokemon|digimon|palworld/.test(n))return 'monster_orb';
 if(/kirby|mario bros|super mario|yoshi|donkey kong|rayman|spyro|crash bandicoot|celeste|banjo|ratchet|jak and daxter|platform/.test(n))return 'platform_boot';
 if(/ace attorney|phoenix wright|investigations|detective|la noire|professor layton/.test(n))return 'detective_lens';
 if(/pirate|one piece|assassin's creed iv|sea of thieves/.test(n))return 'pirate_ship';
 if(/stardew|animal crossing|harvest moon|farm|simcity|garden|pikmin/.test(n))return 'farm_field';
 if(/wild west|western|red dead|gunfighter/.test(n))return 'western_hat';
 if(/civilization|age of empires|age of mythology|warcraft|starcraft|fire emblem|strategy/.test(n))return 'strategy_castle';
 if(/minecraft|terraria|shovel knight|hollow knight|pixel|retro|block/.test(n))return 'pixel_mountain';
 if(/nintendo switch|game boy|game gear|psp|vita|steam deck|handheld|nintendo ds|nintendo 3ds|neo geo pocket/.test(n)||c==='portable')return 'handheld_pocket';
 if(/arcade|pinball|cabinet|neo geo mvs/.test(n)||c==='arcade')return 'arcade_stick';
 if(/playstation|xbox|nintendo 64|dreamcast|sega genesis|sega saturn|snes|nes|wii|gamecube|atari/.test(n)||c==='console')return 'retro_tv';
 if(/game card|cartridge|cartucho|game box/.test(n))return 'game_cartridge';
 if(/dragon|wyvern/.test(n))return 'ice_claw';
 if(/sword|blade|weapon/.test(n))return 'mystic_shield';
 if(/crystal|gem|jewel/.test(n))return 'fantasy_potion';
 if(/film|cinema|movie/.test(n)||c==='movie')return 'retro_tv';
 if(/manga|comic/.test(n)||c==='manga')return 'rpg_book';
 if(/anime|super saiyan/.test(n)||c==='anime')return 'anime_aura';
 if(/score|win|champion|achievement|award/.test(n))return 'trophy_cup';
 if(c==='game'){
  const genres={racing:'race_flag',sports:'soccer_ball',music:'rhythm_keys',puzzle:'puzzle_bricks',strategy:'strategy_castle',rpg:'rpg_book',platform:'platform_boot',horror:'haunted_mansion',fighter:'fighting_glove',stealth:'stealth_radio',action:'pixel_hero',adventure:'sky_airship',simulation:'farm_field',sandbox:'pixel_mountain',shooter:'spaceship',fantasy:'magic_hat'};
  return genres[f]||'game_cartridge';
 }
 if(c==='music')return 'rhythm_keys';
 if(c==='character'||c==='person')return 'pixel_hero';
 if(c==='technology')return 'robot_head';
 if(c==='board')return 'puzzle_bricks';
 return null;
}
function v27StaticArt(item){
 const motif=v27Motif(item);
 if(!motif)return null;
 // Each of the twelve compositions includes a different motif ornament and layout,
 // is pre-compressed, and never causes image generation in the Android app.
 let h=2166136261;
 for(const ch of String(item.id||item.name||'')){h=Math.imul(h^ch.charCodeAt(0),16777619);}
 const variant=(h>>>0)%12;
 const src=GAMEVERSE_ART_V27_VARIANTS[motif+'~'+variant];
 return src?'<img class="gameverse-art gameverse-art-v27" src="'+src+'" alt="" loading="lazy" decoding="async">':null;
}

function staticArt(item){
 if(!item)return fallbackIcon();
 // 2026 art direction: redrawn icons replace older art by stable ID (names, recipes and saves unchanged).
 const redrawn=ART_REDRAW[item.id];if(redrawn)return redrawn;
 // V30 highest-priority semantic art: only exact canonical names are eligible.
 // A sky is never rendered as a sword just because its name contains "sky".
 const itemName=String(item.name||'').toLowerCase();
 const newArt=ORGANIC_ART_V89[itemName]||ORGANIC_ART_V85[itemName]||ORGANIC_ART_V83[itemName]||ORGANIC_ART_V82[itemName]||ORGANIC_ART_V81[itemName]||ORGANIC_ART_V80[itemName]||ORGANIC_ART_V79[itemName]||ORGANIC_ART_V78[itemName]||ORGANIC_ART_V77[itemName]||ORGANIC_ART_V76[itemName]||ORGANIC_ART_V75[itemName]||ORGANIC_ART_V74[itemName]||ORGANIC_ART_V73[itemName]||ORGANIC_ART_V72[itemName]||ORGANIC_ART_V71[itemName]||ORGANIC_ART_V70[itemName]||ORGANIC_ART_V69[itemName]||ORGANIC_ART_V68[itemName]||ORGANIC_ART_V67[itemName]||ORGANIC_ART_V66[itemName]||ORGANIC_ART_V65[itemName]||ORGANIC_ART_V63[itemName]||ORGANIC_ART_V62[itemName]||ORGANIC_ART_V61[itemName]||ORGANIC_ART_V59[itemName]||ORGANIC_ART_V58[itemName]||ORGANIC_ART_V57[itemName]||ORGANIC_ART_V56[itemName]||ORGANIC_ART_V55[itemName]||ORGANIC_ART_V53[itemName]||ORGANIC_ART_V52[itemName]||ORGANIC_ART_V50[itemName]||ORGANIC_ART_V47[itemName]||ORGANIC_ART_V46[itemName]||ORGANIC_ART_V45[itemName]||ORGANIC_ART_V44[itemName]||ORGANIC_ART_V43[itemName]||ORGANIC_ART_V42[itemName]||ORGANIC_ART_V41[itemName]||ORGANIC_ART_V40[itemName]||ORGANIC_ART_V38[itemName]||ORGANIC_ART_V37[itemName]||ORGANIC_ART_V34[itemName]||ORGANIC_ART_V32[itemName];if(newArt)return newArt;
 const semantic=GAMEVERSE_ART_V30_SEMANTIC[itemName];
 if(semantic)return semantic;
 const v27=v27StaticArt(item);
 if(v27)return v27;
 if(item.iconUrl && (/^https:\/\//.test(item.iconUrl)||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(item.iconUrl)))return `<img src="${escapeText(item.iconUrl)}" alt="" loading="lazy" decoding="async">`;
 const k=gameverseArtKey(item);
 if(k){let hue=item.paletteVariant==='spectral'?'hue-rotate(120deg)':item.paletteVariant==='emerald'?'hue-rotate(70deg)':item.paletteVariant==='shadow'?'hue-rotate(200deg)':item.paletteVariant==='warm'?'hue-rotate(-25deg)':'';
 const main=`<img class="gameverse-art" src="${GAMEVERSE_ART_V23[k]||GAMEVERSE_ART[k]}" loading="lazy" decoding="async" alt=""${hue?` style="filter:${hue}"`:''}>`;
 const accent=gameverseAccentKey(item);
 return accent?`<span class="gameverse-composite">${main}<img class="gameverse-overlay" src="${GAMEVERSE_ART_V23[accent]||GAMEVERSE_ART[accent]}" loading="lazy" decoding="async" alt=""></span>`:main;
 }
 return item.legacy!=null?legacyIcon(item.legacy):sharedIcon(item);
}
function announceCraft(kind, text){
 const bar=$('combineFeedback');if(!bar)return;
 bar.dataset.kind=kind;
 bar.querySelector('.feedback-mark').textContent=kind==='new'?'✦':kind==='repeat'?'↻':kind==='invalid'?'×':'✧';
 $('combineFeedbackText').textContent=text;
 bar.classList.remove('has-feedback');void bar.offsetWidth; if(kind!=='idle')bar.classList.add('has-feedback');
 soundForResult(kind);
}
// A non-existent offline pairing has no feedback, no sound and no toast.
function clearCraftFeedback(){
 const bar=$('combineFeedback');if(!bar)return;
 bar.dataset.kind='idle';bar.classList.remove('has-feedback');
 bar.querySelector('.feedback-mark').textContent='';
 $('combineFeedbackText').textContent='';
}
function toast(msg,kind='info'){
 const el=$('toast');el.textContent=msg;el.dataset.kind=kind;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,kind==='error'?2600:2100);
}
function updateCounts(){try{syncGamesTab();}catch{}
 const earned=[...unlocked].filter(id=>!STARTERS.has(id)).length;
 $('discoveredCount').textContent=unlocked.size.toLocaleString('en-US');
 $('statCollected').textContent=unlocked.size.toLocaleString('en-US');
 $('statPersonal').textContent=earned.toLocaleString('en-US');
 const sh=$('statShiny');if(sh)sh.textContent=shiny.size.toLocaleString('en-US');
 const shChip=document.querySelector('[data-show-chip="shiny"]');if(shChip)shChip.hidden=shiny.size===0&&inventoryShow!=='shiny';
 syncFamilyBanner();
 refreshMergeButton();
}
function updateSlotUI(){slots.forEach((id,i)=>{const target=$(`slot${i}`),item=byId.get(id);target.classList.toggle('filled',!!item);target.classList.toggle('is-shiny',!!item&&shiny.has(id));target.innerHTML=item?`<span class="slot-art">${staticArt(item)}</span><span class="slot-name">${escapeText(uiName(item))}</span>`:'<span class="slot-plus">+</span>';});$('lockLeft').setAttribute('aria-pressed',String(leftLocked));$('batchOpen').hidden=!(leftLocked&&slots[0]);}
function updateLatest(){ /* V35: the last ID remains in saved progress, but no screen-space widget. */ }
function place(index,id){if(batchState?.phase==='scanning')return;if(!byId.has(id)||!unlocked.has(id))return;clearTimeout(autoTimer);settleGhosts(index);slots[index]=id;updateSlotUI();if(slots.every(Boolean))autoTimer=setTimeout(combine,180);}
// V54: pulsing feedback follows an actual ingredient selection (tap, pointer or keyboard).
// The visual state is short-lived and never alters the recipes or the inventory order.
function pulseSelectedElement(id){
 const tile=[...$('inventoryVirtual').querySelectorAll('.element-chip')].find(node=>node.dataset.id===id);
 if(!tile)return;
 tile.classList.remove('element-chip-pulse');
 void tile.offsetWidth;
 tile.classList.add('element-chip-pulse');
 clearTimeout(tile._tapFeedbackTimer);
 tile._tapFeedbackTimer=setTimeout(()=>tile.classList.remove('element-chip-pulse'),370);
}
// One tap selects immediately. When both slots are occupied, replace only the right slot.
// With the left lock active this gives continuous experimentation with one fixed ingredient.
function insertDirect(id){
 if(!byId.has(id)||!unlocked.has(id))return;
 pulseSelectedElement(id);
 if(tab!=='Play')switchTab('Play');
 place(slots[0]===null?0:1,id);
}
function selectForHint(a,b){slots=[a,b];updateSlotUI();clearTimeout(autoTimer);autoTimer=setTimeout(combine,220);}
function finishSlots(){const saved=slots[0];slots=leftLocked?[saved,null]:[null,null];updateSlotUI();}
function authHeaders(){return sessionToken?{'Authorization':'Bearer '+sessionToken}:{};}
async function apiJson(path,{method='GET',data,auth=true}={}){
 if(!apiBase)throw Error('offline');const resp=await fetch(apiBase+path,{method,headers:{...(data?{'Content-Type':'application/json'}:{}),...(auth?authHeaders():{})},...(data?{body:JSON.stringify(data)}:{})});
 const body=await resp.json().catch(()=>({}));if(!resp.ok)throw Error(body.error||('HTTP '+resp.status));return body;
}
function acceptRemoteElement(it){if(!it||typeof it.id!=='string'||typeof it.name!=='string'||typeof it.category!=='string')return false;
 if(it.id.startsWith('legacy:')||it.id.startsWith('pack:'))return byId.has(it.id);
 if(!it.id.startsWith('generated:')||it.name.length>100)return false;
 const imageUrl=(it.iconStatus==='ready'&&apiBase&&typeof it.iconUrl==='string'&&it.iconUrl.startsWith('/v1/icons/'))?new URL(it.iconUrl,apiBase).href:null;byId.set(it.id,{id:it.id,name:it.name,category:it.category,summary:it.summary||'',iconStatus:it.iconStatus||'pending',iconUrl:imageUrl,iconFamily:it.iconFamily||null,paletteVariant:it.paletteVariant||null});return true;
}
async function refreshWorldFirsts(){
 if(!sessionToken||!apiBase)return;
 const confirmed=new Set();let cursor=null,round=0;
 do{
  const data=await apiJson('/v1/me/world-firsts?limit=100'+(cursor?'&cursor='+encodeURIComponent(cursor):''));
  for(const it of data.items||[])if(it.id&&byId.has(it.id))confirmed.add(it.id);
  cursor=data.nextCursor||null;
 }while(cursor&&++round<100);
 // Do not announce a World First until the server itself has verified it.
 const previous=worldStatsVerified?worldFirsts:new Set(JSON.parse(localStorage.getItem(firstStorageKey())||'[]'));
 const gained=[...confirmed].filter(id=>!previous.has(id));
 worldFirsts=confirmed;worldStatsVerified=true;
 try{localStorage.setItem(firstStorageKey(),JSON.stringify([...worldFirsts]));}catch{}
 updateCounts();
 if(gained.length)toast(`★ WORLD FIRST! ${uiName(byId.get(gained[0]))||'New element'}${gained.length>1?' +'+(gained.length-1)+' more':''}`,'first');
}
// V17: one bounded inbox check handles every queued pair for a guest session.
// Completed items are acknowledged only after they have been stored locally.
async function refreshPending(announce=true){
 if(pendingSyncing||!apiBase||!sessionToken||document.visibilityState==='hidden')return;
 pendingSyncing=true;
 try{
  let cursor=null,round=0,queued=0,changed=false,worldChange=false;
  const ack=[];const newItems=[];
  do{
   const response=await apiJson('/v1/me/pending?limit=100'+(cursor?'&cursor='+encodeURIComponent(cursor):''));
   for(const entry of response.items||[]){
    if(entry.status==='pending_review'){queued++;continue;}
    if(entry.status==='rejected'){
      ack.push(entry.candidateId);
      if(announce)toast('A pending combination was not approved','error');
      continue;
    }
    if(entry.status!=='approved'||!entry.result?.id)continue;
    if(!acceptRemoteElement(entry.result))continue;
    const id=entry.result.id;
    const key=pairKey(entry.leftId,entry.rightId);
    if(!byId.has(entry.leftId)||!byId.has(entry.rightId))continue;
    const isNew=!unlocked.has(id);
    recipes.set(key,id);known.add(key);unlocked.add(id);
    if(isNew){
     if(!STARTERS.has(id))discoveryLedger.set(id,{at:new Date().toISOString(),source:'world-approved',ingredients:[entry.leftId,entry.rightId]});
     recent=[id,...recent.filter(x=>x!==id)].slice(0,350);
     last=id;newItems.push(uiName(entry.result));changed=true;
    }
    worldChange=worldChange||!!entry.worldFirst;
    ack.push(entry.candidateId);
   }
   cursor=response.nextCursor||null;
  }while(cursor&&++round<4);
  if(changed){save();updateCounts();updateLatest();rerenderCollections();}
  if(ack.length)for(let i=0;i<ack.length;i+=100)await apiJson('/v1/me/pending/ack',{method:'POST',data:{candidateIds:ack.slice(i,i+100)}});
  showPendingCount(queued);
  lastPendingCheck=Date.now();
  if(newItems.length&&announce)toast(`✦ New discovery ready: ${newItems[0]}${newItems.length>1?' +'+(newItems.length-1):''}`,'first');
  if(worldChange)await refreshWorldFirsts();
 }catch(e){console.warn('Pending inbox unavailable:',e.message);}
 finally{pendingSyncing=false;}
}
async function syncOnline(){if(syncing||!apiBase||!sessionToken)return;syncing=true;try{
 await refreshPending(true);
 const all=[...unlocked];for(let i=0;i<all.length;i+=200){await apiJson('/v1/me/discoveries',{method:'POST',data:{ids:all.slice(i,i+200)}});}
 let cursor=null,rounds=0;do{const url='/v1/me/discoveries?limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):'');const page=await apiJson(url);for(const it of page.items||[]){if(acceptRemoteElement(it)){
   if(!unlocked.has(it.id)&&!STARTERS.has(it.id))discoveryLedger.set(it.id,{at:null,source:'synced'});
   unlocked.add(it.id);
  }}cursor=page.nextCursor||null;rounds++;}while(cursor&&rounds<30);
 await refreshWorldFirsts();lastOnlineSync=Date.now();save();updateCounts();rerenderCollections();
 }catch(err){console.warn('Sync failed:',err.message);toast('Online sync unavailable; offline progress is safe');}finally{syncing=false;}}
async function connectToApi(){if(!apiBase)return;try{
 const existing=sessionToken;if(existing){try{await apiJson('/v1/me/discoveries?limit=1');await syncOnline();return;}catch(err){if(!/session_required/.test(err.message))throw err;}}
 const created=await apiJson('/v1/session',{method:'POST',auth:false});if(!created.token||!created.playerId)throw Error('invalid session');sessionToken=created.token;localStorage.setItem('gameverse_session_v11:'+apiBase,sessionToken);await syncOnline();
 }catch(err){console.warn('Connect failed:',err.message);toast('Connection failed; offline play still works');}}
// V83: combiner motion. Every animation runs on fixed-position ghost tiles appended
// to <body>, never on the real slots, so the slots are cleared and tappable the very
// instant a combination resolves. The next ingredient never waits for a ghost.
//  - no recipe:          right tile nudges the left one, bounces back, fades out
//  - already discovered: right tile slides onto the left one, the result tile pops
//                        and floats up; the feedback line says "Already discovered"
//  - new discovery:      the merged result tile floats up and morphs into the art of
//                        the discovery window, which closes only with X (unchanged)
const craftMotion={scene:null,morphCleanup:null};
const CRAFT_MOTION={touch:150,bounce:180,fade:140,merge:170,pop:120,rise:380,morph:420};
const craftMotionAllowed=()=>typeof Element.prototype.animate==='function'&&!(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
function captureCraftScene(){
 if(!craftMotionAllowed())return null;
 const l=$('slot0'),r=$('slot1');if(!l||!r)return null;
 const L=l.getBoundingClientRect(),R=r.getBoundingClientRect();if(!L.width||!R.width)return null;
 return {at:Date.now(),left:{rect:L,html:l.innerHTML},right:{rect:R,html:r.innerHTML},keepLeft:leftLocked};
}
function takeCraftScene(){const s=craftMotion.scene;craftMotion.scene=null;return s&&Date.now()-s.at<1500?s:null;}
function makeGhost(rect,html,slot,extra=''){
 const g=document.createElement('div');g.className='craft-slot filled craft-ghost'+(extra?' '+extra:'');g.setAttribute('aria-hidden','true');
 if(slot!=null)g.dataset.slot=String(slot);g.innerHTML=html;
 g.style.cssText=`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
 document.body.appendChild(g);return g;
}
function animateGhost(g,frames,opts){
 return new Promise(resolve=>{if(!g.isConnected)return resolve(false);const a=g.animate(frames,{fill:'forwards',...opts});a.onfinish=()=>resolve(g.isConnected);a.oncancel=()=>resolve(false);});
}
// Freeze whatever the ghost is doing and fade it out from there (no jump back).
function fadeGhost(g,duration=CRAFT_MOTION.fade,shrink=false){
 if(!g?.isConnected)return;
 for(const a of g.getAnimations()){try{a.commitStyles();}catch{}a.cancel();}
 const base=g.style.transform||'none';
 const a=g.animate([{opacity:1,transform:base},{opacity:0,transform:shrink?`${base==='none'?'':base+' '}scale(.82)`:base}],{duration,easing:'ease-out',fill:'forwards'});
 a.onfinish=a.oncancel=()=>g.remove();
}
// A new ingredient entering a slot dismisses only the ghost still covering that slot.
function settleGhosts(slot){document.querySelectorAll(`body>.craft-ghost[data-slot="${slot}"]`).forEach(g=>fadeGhost(g,90));}
function cancelCraftMorph(){const c=craftMotion.morphCleanup;craftMotion.morphCleanup=null;if(c)c();}
async function craftInvalidMotion(sc){
 const left=sc.keepLeft?null:makeGhost(sc.left.rect,sc.left.html,0);
 const right=makeGhost(sc.right.rect,sc.right.html,1);
 const dx=Math.round(sc.left.rect.right-sc.right.rect.left+3);
 const touched=await animateGhost(right,[{transform:'translateX(0)'},{transform:`translateX(${dx}px)`}],{duration:CRAFT_MOTION.touch,easing:'cubic-bezier(.45,0,.75,1)'});
 if(!touched){if(left)fadeGhost(left,90);return;}
 const nudged=left||(sc.keepLeft?$('slot0'):null);
 nudged?.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:170,easing:'ease-out'});
 const back=await animateGhost(right,[{transform:`translateX(${dx}px)`},{transform:'translateX(0)'}],{duration:CRAFT_MOTION.bounce,easing:'cubic-bezier(.2,.9,.3,1.25)'});
 if(!back){if(left)fadeGhost(left,90);return;}
 fadeGhost(right,CRAFT_MOTION.fade,true);
 if(left)fadeGhost(left,CRAFT_MOTION.fade);
}
async function craftMergeMotion(sc,item){
 const left=sc.keepLeft?null:makeGhost(sc.left.rect,sc.left.html,0);
 const right=makeGhost(sc.right.rect,sc.right.html,1);
 const dx=Math.round(sc.left.rect.left-sc.right.rect.left),dy=Math.round(sc.left.rect.top-sc.right.rect.top);
 const merged=await animateGhost(right,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.94)`,opacity:.9}],{duration:CRAFT_MOTION.merge,easing:'cubic-bezier(.4,0,.6,1)'});
 right.remove();if(left)left.remove();
 if(!merged)return null;
 const size=Math.round(Math.min(68,Math.max(48,sc.left.rect.height+8)));
 const cx=sc.left.rect.left+sc.left.rect.width/2,cy=sc.left.rect.top+sc.left.rect.height/2;
 const tile=makeGhost({left:cx-size/2,top:cy-size/2,width:size,height:size},`<span class="slot-art">${staticArt(item)}</span>`,null,'craft-ghost-result');
 const popped=await animateGhost(tile,[{transform:'scale(.5)',opacity:0},{transform:'scale(1.1)',opacity:1,offset:.7},{transform:'scale(1)',opacity:1}],{duration:CRAFT_MOTION.pop,easing:'ease-out'});
 return popped?tile:null;
}
async function craftRepeatMotion(sc,item){
 const tile=await craftMergeMotion(sc,item);if(!tile)return;
 await animateGhost(tile,[{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(-58px) scale(1.12)',opacity:0}],{duration:CRAFT_MOTION.rise,easing:'cubic-bezier(.2,.6,.3,1)'});
 tile.remove();
}
// The discovery window is already in the DOM (invisible); the result tile travels to
// the exact place of its artwork while the card fades in beneath it.
async function craftDiscoveryMotion(sc,item){
 const modal=$('modal'),card=modal.querySelector('.modal-card'),art=modal.querySelector('.modal-art');
 if(!card||!art||modal.hidden)return;
 const state={tile:null,morph:null,cardAnim:null,modalAnim:null,done:false};
 const cleanup=()=>{if(state.done)return;state.done=true;modal.style.opacity='';art.style.visibility='';state.modalAnim?.cancel();state.cardAnim?.cancel();state.tile?.remove();state.morph?.remove();};
 cancelCraftMorph();craftMotion.morphCleanup=cleanup;
 modal.style.opacity='0';art.style.visibility='hidden';
 const tile=await craftMergeMotion(sc,item);
 if(state.done)return;
 if(!tile||modal.hidden||!art.isConnected){cleanup();return;}
 // V83.1: the artwork is drawn once at its final size, exactly over the window's art,
 // and scaled up from the tile's art. It ends pixel-identical (crisp, no size snap).
 state.tile=tile;
 const tileArt=tile.querySelector('.slot-art')||tile,from=tileArt.getBoundingClientRect(),to=art.getBoundingClientRect();
 if(!to.width||!from.width){cleanup();return;}
 const morph=document.createElement('div');morph.className='craft-morph-art';morph.setAttribute('aria-hidden','true');
 morph.innerHTML=art.innerHTML;
 morph.style.cssText=`left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px`;
 document.body.appendChild(morph);state.morph=morph;
 const s0=from.width/to.width,dx=(from.left+from.width/2)-(to.left+to.width/2),dy=(from.top+from.height/2)-(to.top+to.height/2);
 tileArt.style.visibility='hidden';
 // The tile's card body dissolves while drifting toward the window.
 tile.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:`translate(${-dx*.35}px,${-dy*.35}px) scale(1.25)`}],{duration:Math.round(CRAFT_MOTION.morph*.6),easing:'ease-out',fill:'forwards'});
 state.modalAnim=modal.animate([{opacity:0},{opacity:1}],{duration:CRAFT_MOTION.morph,easing:'ease-out',fill:'forwards'});
 state.cardAnim=card.animate([{opacity:0},{opacity:1}],{duration:Math.round(CRAFT_MOTION.morph*.8),delay:Math.round(CRAFT_MOTION.morph*.2),easing:'ease-out',fill:'forwards'});
 await animateGhost(morph,[{transform:`translate(${dx}px,${dy}px) scale(${s0})`},{transform:`translate(${dx*.06}px,${dy*.06}px) scale(${1+(1-s0)*.03})`,offset:.82},{transform:'translate(0,0) scale(1)'}],{duration:CRAFT_MOTION.morph,easing:'cubic-bezier(.25,.8,.3,1)'});
 if(state.done)return;
 // Reveal the real art first, then drop the identical overlay on the next frame.
 art.style.visibility='';
 await new Promise(r=>requestAnimationFrame(()=>r()));
 craftMotion.morphCleanup=null;cleanup();
}
function playCraftMotion(sc,kind,item){
 if(!sc)return;
 try{(kind==='invalid'?craftInvalidMotion(sc):kind==='repeat'?craftRepeatMotion(sc,item):craftDiscoveryMotion(sc,item)).catch(e=>console.warn('Combiner motion skipped:',e));}
 catch(e){console.warn('Combiner motion skipped:',e);}
}
// This is the sole completion path: legacy, repeated, deterministic reuse, remote approval.
function completeCombination(resultId,a,b,kind='recipe'){
 if(!byId.has(resultId)||(currentMode==='family'&&!familyCampaigns.get(currentFamilyId).itemSet.has(resultId)))return;
 const key=pairKey(a,b),fresh=!unlocked.has(resultId),scene=takeCraftScene();
 recipes.set(key,resultId);known.add(key);unlocked.add(resultId);last=resultId;
 if(fresh&&!STARTERS.has(resultId))discoveryLedger.set(resultId,{at:new Date().toISOString(),source:kind,ingredients:[a,b]});
 recent=[resultId,...recent.filter(i=>i!==resultId)].slice(0,350);
 const gotShiny=kind!=='batch'&&rollShiny(resultId);
 save();updateCounts();updateLatest();syncFamilyBanner();
 if(fresh)companions.onDiscovery(resultId);
 if(fresh){announceCraft('new',(gotShiny?'✦ Shiny discovery · ':'New discovery · ')+uiName(byId.get(resultId)));rerenderCollections();if(tab==='World')renderDiscoveries();showDiscovery(resultId,a,b,scene,gotShiny);}
 else {announceCraft('repeat',(gotShiny?'✦ Shiny · ':'Already discovered · ')+uiName(byId.get(resultId)));playCraftMotion(scene,'repeat',byId.get(resultId));if(gotShiny){playVirtual.refresh();setTimeout(()=>showShinyFound(resultId),480);}}
}
async function combine(){
 if(!slots[0]||!slots[1])return;
 const [a,b]=slots;const scene=captureCraftScene();finishSlots();const key=pairKey(a,b),cached=recipes.get(key);
 craftMotion.scene=scene;
 if(cached){completeCombination(cached,a,b);return;}
 const local=currentMode==='classic'?resolveLocalRedundancy(byId.get(a),byId.get(b)):null;
 if(local){completeCombination(local,a,b,'redundant');return;}
 if(!apiBase){clearCraftFeedback();playCraftMotion(takeCraftScene(),'invalid');return;}
 toast('Discovering…');
 try{
  const response=await fetch(`${apiBase}/v1/combinations/resolve`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify({leftId:a,rightId:b})});
  const data=await response.json();if(!response.ok)throw Error(data.error||`Server error ${response.status}`);
  if(data.status==='approved'&&data.result?.id){
    const r=data.result;if(r.id.startsWith('generated:'))acceptRemoteElement(r);
    if(byId.has(r.id))completeCombination(r.id,a,b,data.source==='redundancy'?'redundant':'recipe');
    else toast('Result is not ready on this device','error');
  }else if(data.status==='pending_review'){
    toast('Discovery queued · result will arrive after approval','pending');
    showPendingCount(pendingCount+1);
    refreshPending(false);
  }
  else if(data.status==='capacity_limited')toast('Free discovery quota reached · please try later','pending');
  else if(data.status==='rejected')toast('Combination blocked by safety rules','error');
  else if(data.status==='no_match')toast('No coherent result yet · Try another pair','error');
  else toast('Discovery is temporarily unavailable','error');
 }catch(e){toast('Server unavailable · Offline progress preserved','error');console.warn(e);}
}
function showModal(content){cancelCraftMorph();settleTimedHint(false);$('modal').removeAttribute('aria-labelledby');$('modal').dataset.dismiss='any';$('modalContent').innerHTML=content;$('modal').hidden=false;}
function closeModal(){
 cancelCraftMorph();settleTimedHint(false);
 const st=batchState;
 if(st?.phase==='scanning'){batchState=null;slots[1]=null;updateSlotUI();announceCraft('idle','Family scan cancelled · No new results published');$('modal').hidden=true;$('modal').dataset.dismiss='any';return;}
 if(st?.phase==='review'){
  if(st.viewAll){st.viewAll=false;showBatchSummary();return;}
  st.reviewIndex++;if(st.reviewIndex<st.discoveries.length){showBatchDiscovery();return;}
  showBatchSummary();return;
 }
 if(st?.phase==='summary')batchState=null;
 $('playFamily').setAttribute('aria-expanded','false');
 $('recentBtn').setAttribute('aria-expanded','false');
 const m=$('modal');m.hidden=true;m.dataset.dismiss='any';
}

const PAW_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="8" r="2.2"/><circle cx="12" cy="5.5" r="2.2"/><circle cx="17" cy="8" r="2.2"/><path d="M12 11c-3.5 0-6.5 2.6-6.5 5.4 0 1.9 1.4 3.1 3.1 3.1 1.3 0 2.1-.6 3.4-.6s2.1.6 3.4.6c1.7 0 3.1-1.2 3.1-3.1C18.5 13.6 15.5 11 12 11Z"/></svg>';
function companionCallout(id){if(!companions.isCompanion(id))return '';
 return `<div class="companion-callout"><span class="companion-callout-icon">${PAW_SVG}</span><span><b>Companion element!</b> It can live on your screen, eat elements and level up. ${companions.freeChoiceLeft()?'Your first companion is free.':'Find it in the Home tab.'}</span><button type="button" class="companion-callout-go" id="meetCompanion">Meet it</button></div>`;}
// V89: companion houses and furniture are flagged in the discovery sheet (the Home screen comes next).
const HOME_EFFECT_LABEL={run:'trains Run',swim:'trains Swim',power:'trains Power',fly:'trains Fly',stamina:'trains Stamina',hp:'trains HP',mood:'cheers companions up',food:'feeds companions',discovery:'boosts idle discoveries',decor:'decoration'};
function homeCallout(id){const h=HOME_OBJECTS_V89[id];if(!h||h.kind==='material')return '';
 const q=pieceQuality(routeDepth.get(id));const txt=h.kind==='house'?`<b>Companion house!</b> Room for ${h.capacity} companion${h.capacity>1?'s':''}.`:`<b>Furniture</b> for companion houses · ${HOME_EFFECT_LABEL[h.effect]||'decoration'}${h.effect&&h.effect!=='decor'?` · +${q.pct}% <span class="home-stars">${starsText(q.stars)}</span>`:''}.`;
 return `<div class="home-callout"><span>${txt}</span></div>`;}
/** V104: element sheet opened by a long press in Alchemy: description, what it does, quick actions. */
function elementInfo(id){const it=byId.get(id);if(!it)return;const fams=familiesFor(it).map(f=>FAMILIES.find(x=>x.id===f)?.name||f);const text=wittyDiscovery(it)||it.summary;
 showModal(`<div class="modal-tag">ABOUT THIS ELEMENT · ${escapeText((categoryNames[it.category]||it.category||'').toUpperCase())}</div><div class="modal-art is-info">${COMPANION_SPRITES_V86[id]||staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2>${text?`<p class="discovery-wit">${escapeText(publicText(text))}</p>`:''}${companionCallout(id)}${homeCallout(id)}${fams.length?`<p class="mini-muted">${escapeText(fams.join(' · '))}</p>`:''}
  <button type="button" class="modal-button" id="infoUse">Use in craft table</button><button type="button" class="modal-button secondary" id="infoPaths">Recipes</button>`);
 $('infoUse').onclick=()=>{closeModal();insertDirect(id);};$('infoPaths').onclick=()=>{closeModal();openRecipePaths(id);};}
function showDiscovery(id,a,b,scene=null,isShiny=false){
 const it=byId.get(id),isFirst=worldFirsts.has(id),earned=[...unlocked].filter(x=>!STARTERS.has(x)).length,isComp=companions.isCompanion(id);
 showModal(`<div class="modal-tag ${isShiny?'shiny-tag':isFirst?'world-first-tag':isComp?'companion-tag':''}">${isShiny?'✦ SHINY DISCOVERY':isFirst?'★ WORLD FIRST':isComp?'NEW COMPANION':'✦ NEW DISCOVERY'}</div><div class="modal-art${isShiny?' is-shiny':''}${isComp?' is-companion':''}">${isComp&&COMPANION_SPRITES_V86[id]?COMPANION_SPRITES_V86[id]:staticArt(it)}</div><h2>${isShiny?'Shiny ':''}${escapeText(uiName(it))}</h2><p>${escapeText(uiName(byId.get(a)))} + ${escapeText(uiName(byId.get(b)))}</p>${isShiny?shinyCard(it):(wittyDiscovery(it)||it.summary)?`<p class="discovery-wit">${escapeText(publicText(wittyDiscovery(it)||it.summary))}</p>`:""}${companionCallout(id)}${homeCallout(id)}<div class="modal-milestone">${earned.toLocaleString('en-US')} personal discoveries</div>`);
 $('continueBtn')?.remove();$('modal').dataset.dismiss='x-only';
 playCraftMotion(scene,'new',it);
 if(isComp){const go=$('meetCompanion');if(go)go.onclick=()=>{closeModal();switchTab('Pets');};}
}
function detail(id){const it=byId.get(id);if(!it)return;const extra=familiesFor(it).length>1?`<p class="mini-muted">Shared across: ${familiesFor(it).map(f=>escapeText(FAMILIES.find(x=>x.id===f)?.name||f)).join(' · ')}</p>`:'';showModal(`<div class="modal-art">${staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2><p>${escapeText(categoryNames[it.category]||it.category)}</p>${extra}<button class="modal-button" id="useBtn">Use in craft table</button>`);$('useBtn').onclick=()=>{closeModal();switchTab('Play');if(!slots[0])place(0,id);else place(1,id);};}
const allIds=()=>[...unlocked].filter(id=>byId.has(id));
function filtered(mode){
 let ids=allIds();if(currentMode==='family')ids=ids.filter(id=>familyCampaigns.get(currentFamilyId).itemSet.has(id));const q=playQuery.trim().toLowerCase();
 if(playFamily!=='all')ids=ids.filter(id=>familiesFor(byId.get(id)).includes(playFamily));
 if(inventoryShow==='open')ids=ids.filter(id=>!elementIsComplete(id));
 else if(inventoryShow==='done')ids=ids.filter(id=>elementIsComplete(id));
 else if(inventoryShow==='saved')ids=ids.filter(id=>favorites.has(id));
 else if(inventoryShow==='shiny')ids=ids.filter(id=>shiny.has(id));
 if(q)ids=ids.filter(id=>uiName(byId.get(id)).toLowerCase().includes(q));
 if(sortChoice==='old'||sortChoice==='new'){
  syncDiscoveryOrder();const rank=new Map(discoveryOrder.map((id,i)=>[id,i]));
  ids.sort((a,b)=>sortChoice==='old'?(rank.get(a)??Infinity)-(rank.get(b)??Infinity):(rank.get(b)??-1)-(rank.get(a)??-1));
 }else ids.sort((a,b)=>uiName(byId.get(a)).localeCompare(uiName(byId.get(b))));
 return ids;
}
class VirtualElements {
 constructor(rootId,mode){this.root=$(rootId);this.viewport=this.root.parentElement;this.mode=mode;this.ids=[];this.start=-1;this.end=-1;this.cols=-1;this.viewport.addEventListener('scroll',()=>this.draw());window.addEventListener('resize',()=>this.draw(true));this.root.addEventListener('click',e=>{if(Date.now()-this.dragEnded<300)return;const chip=e.target.closest('.element-chip');if(chip)insertDirect(chip.dataset.id);});this.dragEnded=0;}
 refresh({resetScroll=false}={}){
  // Preserve the visible row while a newly discovered element enters a
  // sorted list. Rebuilding virtual DOM must never jump back to the top.
  const before=this.viewport.scrollTop;
  const chip=inventoryChip();
  const cols=Math.max(1,Math.floor(((this.viewport.clientWidth||360)-28+8)/(chip.w+8)));
  const rowHeight=chip.h;
  const previousIndex=Math.floor(before/rowHeight)*cols;
  const anchorId=this.ids[previousIndex];
  const intraRow=before%rowHeight;
  this.ids=filtered(this.mode);
  if(resetScroll){this.viewport.scrollTop=0;}
  else if(anchorId && this.ids.includes(anchorId)){
   const index=this.ids.indexOf(anchorId);
   this.viewport.scrollTop=Math.floor(index/cols)*rowHeight+intraRow;
  }else this.viewport.scrollTop=before;
  this.draw(true);
 }
 draw(force=false){const chip=inventoryChip();let width=this.viewport.clientWidth,cols=Math.max(1,Math.floor((width-28+8)/(chip.w+8))),rowHeight=chip.h,rows=Math.ceil(this.ids.length/cols),top=Math.max(0,Math.floor(this.viewport.scrollTop/rowHeight)-4),end=Math.min(rows,Math.ceil((this.viewport.scrollTop+this.viewport.clientHeight)/rowHeight)+5);if(!force&&this.start===top&&this.end===end&&this.cols===cols)return;this.start=top;this.end=end;this.cols=cols;this.root.style.height=Math.max(40,rows*rowHeight)+'px';this.root.classList.toggle('is-compact',inventoryDensity==='compact');if(!this.ids.length){const msg=inventoryShow!=='all'?'No elements match this filter.':'No elements found.';this.root.innerHTML='<div class="empty-list">'+msg+'</div>';return;}let shown=this.ids.slice(top*cols,end*cols);this.root.innerHTML=`<div class="virtual-grid" style="--cols:${cols};top:${top*rowHeight}px">${shown.map(id=>{const it=byId.get(id);return `<button class="element-chip ${worldFirsts.has(id)?'world-first-chip':''}${shiny.has(id)?' is-shiny':''}" data-id="${escapeText(id)}" aria-label="Tap or drag ${escapeText(uiName(it))}"><span class="chip-art">${staticArt(it)}</span><span class="chip-label">${escapeText(uiName(it))}</span>${elementIsComplete(id)?'<span class="chip-completed" title="No undiscovered outputs in the offline catalogue" aria-label="Completed">★</span>':''}</button>`;}).join('')}</div>`;}
}
const playVirtual=new VirtualElements('inventoryVirtual','play');
// One shared refresh path keeps Play and Discoveries in sync.
function rerenderCollections(){playVirtual.refresh();if(tab==='World')renderDiscoveries();}
function discoverGroups(){return groupFamilies([...byId.values()],unlocked);}
function renderDiscoveries(){
 const groups=discoverGroups(),total=currentMode==='family'?familyCampaigns.get(currentFamilyId).items.length:[...byId.values()].length;
 $('discoveriesSummary').textContent=currentMode==='family'?`${FAMILIES.find(f=>f.id===currentFamilyId)?.name||'Family'} campaign · tap the family to browse recipes`:`${FAMILIES.length} families · tap one to see what you found and what is missing`;
 $('familiesTotal').textContent=currentMode==='family'?'1 family':`${FAMILIES.length} families`;
 // V83: players see their own collection progress; the 10K catalog goal is a development target.
 $('catalogTargetProgress').parentElement.querySelector('span').textContent=currentMode==='family'?'Family progress':'Your collection';
 const pctFound=total?100*unlocked.size/total:0;
 $('catalogTargetProgress').textContent=`${unlocked.size.toLocaleString('en-US')} / ${total.toLocaleString('en-US')} · ${pctFound<1&&unlocked.size?'<1':Math.round(pctFound)}%`;
 $('catalogTargetFill').style.width=Math.min(100,pctFound).toFixed(2)+'%';
 const setEl=$('thematicSets');if(setEl){setEl.hidden=currentMode==='family';setEl.innerHTML=COLLECTION_SETS.map(s=>{const count=setProgress(s),total=s.ids.length,pct=total?Math.round(100*count/total):0;
 return `<button class="theme-set" data-set="${s.id}" aria-label="${escapeText(s.name)}. ${escapeText(s.description)}. ${count} of ${total} found"><strong>${escapeText(s.name)}</strong><span class="theme-set-description">${escapeText(s.description)}</span><small>${count} / ${total} found · ${pct}%</small><span class="family-line"><i style="width:${pct}%"></i></span></button>`;
 }).join('');}
 $('familiesGrid').innerHTML=FAMILIES.filter(f=>currentMode==='classic'||f.id===currentFamilyId).map(f=>{const g=groups[f.id],pct=g.total?Math.round(g.found/g.total*100):100;
  const icon=familyCardArtwork(f);
  return `<button class="family-card" data-family="${f.id}" aria-label="${escapeText(f.name)} ${g.found} of ${g.total} found"><span class="family-icon">${icon}</span><span class="family-card-main"><strong>${escapeText(f.name)}</strong><small>${g.found.toLocaleString('en-US')} / ${g.total.toLocaleString('en-US')} found</small><span class="family-line"><i style="width:${pct}%"></i></span></span><span class="family-next" aria-hidden="true">›</span></button>`;
 }).join('');
 if(activeFamily){const s=COLLECTION_SETS.find(x=>x.id===activeSet),g=s?{...groups[s.family],ids:s.ids,found:setProgress(s),total:s.ids.length,name:s.name}:groups[activeFamily];if(g){
  $('familyName').textContent=s?s.name:publicText(g.name);const setDescription=$('collectionDetailDescription');if(setDescription){setDescription.hidden=!s;setDescription.textContent=s?s.description:'';}$('familyProgressText').textContent=`${g.found.toLocaleString('en-US')} of ${g.total.toLocaleString('en-US')} discovered`;
  const pct=g.total?Math.round(100*g.found/g.total):100;$('familyPercent').textContent=(g.found>0&&pct===0?'<1%':pct+'%');$('familyProgressBar').style.width=pct+'%';
  const actionable=getFamilyCandidate(),action=$('familyHint');
  action.disabled=!actionable;
  action.textContent=!actionable?'✧ No craftable hints yet':actionable.revealed==='recipe'?'✧ View revealed recipe':'✧ Watch Ad · Reveal Recipe';
  action.title=!actionable?'Discover more ingredients to open a recipe in this collection.':'';
  discoverVirtual.refresh();
 }}
}
// Prefer recipes the player has personally tried, then the acquisition ledger,
// finally a canonical offline recipe for already unlocked elements.
function discoveredRecipes(id){
 const options=recipesForTarget(id,recipes,unlocked).filter(r=>byId.has(r.a)&&byId.has(r.b));
 const used=options.filter(r=>known.has(pairKey(r.a,r.b)));
 const recorded=discoveryLedger.get(id)?.ingredients;
 // V105: a recorded pair is shown only if it STILL makes this element (recipes remapped by polish
 // files would otherwise show stale paths, e.g. House + Wood → Hut after it became Floorboards).
 if(Array.isArray(recorded)&&recorded.length===2&&recorded.every(k=>byId.has(k))&&recipes.get(pairKey(recorded[0],recorded[1]))===id) {
  if(!used.some(r=>pairKey(r.a,r.b)===pairKey(recorded[0],recorded[1])))
   used.unshift({a:recorded[0],b:recorded[1],ready:2});
 }
 if(used.length)return used;
 // V9–V18 progress had no guaranteed recipe history: give a canonical recipe
 // for an unlocked element, rather than showing an empty entry.
 return options.length?[options[0]]:[];
}
function recipeLabel(recipe){return recipe ? `${uiName(byId.get(recipe.a))} + ${uiName(byId.get(recipe.b))}` : 'Starting element';}
function elementState(id){return unlocked.has(id)?'found':hintState.clues[id]==='recipe'?'recipe':hintState.clues[id]==='hint'?'hint':'unknown';}
function discoverMetric(id){return difficultyFor(id);} // V84: community counts are not collected offline, so the list shows only the difficulty estimate
function recipeLine(id){
 if(!unlocked.has(id)){
  if(hintState.clues[id])return formatClue(id);
  return 'Recipe hidden · Tap to reveal with an ad';
 }
 const knownPaths=discoveredRecipes(id);
 return recipeLabel(knownPaths[0]);
}
function openRecipePaths(id){
 if(!unlocked.has(id))return openDiscoverElement(id);
 const item=byId.get(id),paths=discoveredRecipes(id);
 const isShiny=shiny.has(id);
 showModal(`${isShiny?'<div class="modal-tag shiny-tag">✦ SHINY</div>':''}<div class="modal-art${isShiny?' is-shiny':''}">${staticArt(item)}</div><h2>${isShiny?'Shiny ':''}${escapeText(uiName(item))}</h2>${isShiny?shinyCard(item):''}<p>${paths.length===0?'Starting element':paths.length+' recipe path'+(paths.length===1?'':'s')+'</p>'}${familiesFor(item).length>1?`<p class="mini-muted">Shared: ${familiesFor(item).map(f=>escapeText(FAMILIES.find(x=>x.id===f)?.name||f)).join(' · ')}</p>`:''}
 <div class="paths-list">${paths.length?paths.slice(0,30).map(p=>`<div class="path-line">${escapeText(recipeLabel(p))} <span>→ ${escapeText(uiName(item))}</span></div>`).join(''):'<div class="path-line">Available from the beginning</div>'}</div>
 <button class="modal-button" id="useDiscovered">Use in craft</button>`);
 $('useDiscovered').onclick=()=>{closeModal();switchTab('Play');insertDirect(id);};
}
class VirtualDiscoveries{
 constructor(){this.root=$('discoverVirtual');this.viewport=$('discoverScroll');this.ids=[];this.start=-1;this.end=-1;this.cols=-1;this.viewport.addEventListener('scroll',()=>this.draw());window.addEventListener('resize',()=>this.draw(true));
  this.root.addEventListener('click',event=>{
   const fav=event.target.closest('button[data-favorite]');if(fav){toggleFavorite(fav.dataset.favorite);return;}
   const paths=event.target.closest('button[data-paths]');if(paths){openRecipePaths(paths.dataset.paths);return;}
   const btn=event.target.closest('button[data-element]');if(btn)openDiscoverElement(btn.dataset.element);
  });
 }
 refresh(){const group=discoverGroups()[activeFamily];const set=COLLECTION_SETS.find(s=>s.id===activeSet);this.ids=group?(set?set.ids:group.ids).filter(id=>{
   const found=unlocked.has(id),state=elementState(id);
   if(discoveryScope==='found'&&!found)return false;
   if(discoveryScope==='missing'&&state==='found')return false;
   if(discoveryScope==='recipe'&&state!=='recipe')return false;
   if(discoveryScope==='favorites'&&!favorites.has(id))return false;
   if(discoveryScope==='useful'&&(!found||!elementIsUseful(id)))return false;
   if(discoveryScope==='completed'&&(!found||!elementIsComplete(id)))return false;
   if(discoveryScope==='recent'&&(!found||!recent.includes(id)))return false;
   const q=discoverQuery.trim().toLowerCase();return !q||(found&&uiName(byId.get(id)).toLowerCase().includes(q));
  }):[];
  this.draw(true);
 }
 draw(force=false){const width=this.viewport.clientWidth||360,cols=Math.max(1,Math.floor((width-28+10)/290)),rh=103,rows=Math.ceil(this.ids.length/cols),top=Math.max(0,Math.floor(this.viewport.scrollTop/rh)-3),end=Math.min(rows,Math.ceil((this.viewport.scrollTop+this.viewport.clientHeight)/rh)+4);
  if(!force&&this.start===top&&this.end===end&&this.cols===cols)return;
  this.start=top;this.end=end;this.cols=cols;this.root.style.height=Math.max(52,rows*rh)+'px';
  if(!this.ids.length){this.root.innerHTML='<div class="empty-list">No elements match this filter.</div>';return;}
  const shown=this.ids.slice(top*cols,end*cols);
  this.root.innerHTML=`<div class="discover-virtual-grid" style="--dcols:${cols};top:${top*rh}px">${shown.map(id=>{
   const found=unlocked.has(id),state=elementState(id),it=byId.get(id),paths=found?discoveredRecipes(id):[];
   const recipe=escapeText(recipeLine(id));
   const mystery=state==='recipe'?'⌁':'?';
   const badge=found&&paths.length>1?`<button class="discover-path-count" data-paths="${escapeText(id)}" aria-label="View ${paths.length} recipes for ${escapeText(uiName(it))}">${paths.length} paths</button>`:'';
   const save=found?`<button class="discover-favorite ${favorites.has(id)?'is-favorite':''}" data-favorite="${escapeText(id)}" aria-label="${favorites.has(id)?'Remove from':'Save to'} favorites" aria-pressed="${favorites.has(id)}">${favorites.has(id)?'★':'☆'}</button>`:'';
   const status=state==='recipe'?'RECIPE KNOWN':state==='hint'?'HINT FOUND':state==='found'?'DISCOVERED':'UNDISCOVERED';
   return `<div class="discover-entry ${state}"><button class="discover-entry-main" data-element="${escapeText(id)}" aria-label="${found?'Use '+escapeText(uiName(it)):'View hidden element'}"><span class="discover-entry-art">${found?staticArt(it):'<span class="mystery-mark">'+mystery+'</span>'}</span><span class="discover-entry-text"><strong>${found?escapeText(uiName(it)):'????'} <em class="entry-state">${status}</em></strong><small>${found?'Recipe · '+recipe:recipe}</small><span class="discovery-metric" title="${escapeText(playerRate(id))}">${escapeText(discoverMetric(id))}</span></span><span class="discover-entry-arrow" aria-hidden="true">›</span></button>${save}${badge}</div>`;
  }).join('')}</div>`;
 }
}
const discoverVirtual=new VirtualDiscoveries();
function openFamily(id){if(!FAMILIES.some(f=>f.id===id))return;activeSet=null;activeFamily=id;$('discoverScroll').scrollTop=0;discoverQuery='';discoveryScope='all';$('discoverSearch').value='';document.querySelectorAll('[data-dscope]').forEach(b=>{b.classList.toggle('active',b.dataset.dscope==='all');b.setAttribute('aria-pressed',String(b.dataset.dscope==='all'));});
 $('familiesOverview').hidden=true;$('familyDetail').hidden=false;renderDiscoveries();}
function closeFamily(){activeFamily=null;activeSet=null;$('familyDetail').hidden=true;$('familiesOverview').hidden=false;renderDiscoveries();}
function candidateFor(id){const options=recipesForTarget(id,recipes,unlocked).filter(r=>byId.has(r.a)&&byId.has(r.b));return options[0]||null;}
function getFamilyCandidate(){
 const currentSet=COLLECTION_SETS.find(s=>s.id===activeSet);
 const group=currentSet?{ids:currentSet.ids}:discoverGroups()[activeFamily];if(!group)return null;
 // Ads must offer something the player can craft immediately, never an unreachable recipe.
 const choices=candidatesForFamily(group,unlocked,recipes,hintState.clues).filter(c=>c.ready===2&&byId.has(c.a)&&byId.has(c.b));
 return choices.find(c=>c.revealed!=='recipe')||choices[0]||null;
}
function formatClue(id){const c=hintState.clues[id],target=byId.get(id),option=candidateFor(id);if(!option)return 'No recipe available for this element yet.';
  if(c==='recipe')return `${escapeText(uiName(byId.get(option.a)))} + ${escapeText(uiName(byId.get(option.b)))} → ????`;
  if(c==='hint')return `${escapeText(uiName(byId.get(option.a)))} + ???? → ????`;
  return `${escapeText(categoryNames[target.category]||target.category)} · undiscovered`;}
function openDiscoverElement(id){if(!byId.has(id))return;
 if(unlocked.has(id)){switchTab('Play');insertDirect(id);return;}
 const option=candidateFor(id);showUnlockModal(id,option);
}
function explainAdUnavailable(){
 showModal(`<div class="modal-tag">REWARDED HINT</div><h2>Ads are unavailable here</h2><p>One completed rewarded ad reveals a full recipe. Ads need the installed Android app with a configured provider; they cannot play in this standalone HTML.</p><p class="mini-muted">Nothing was unlocked. The game remains playable offline.</p>`);
}
let rewardedHintBusy=false;
// V83 (owner decision, 30/10/2026): when no rewarded ad can be shown, ONE free recipe hint
// is available every 10 minutes. It is not a credit balance and never stacks; a dismissed ad
// does not trigger it, only an unavailable or failed one.
const TIMED_HINT_KEY='alchemy10k_timed_hint_next_v1',TIMED_HINT_COOLDOWN_MS=10*60*1000;
let timedHintResolve=null;
function timedHintNextAt(){try{return Number(localStorage.getItem(TIMED_HINT_KEY))||0;}catch{return 0;}}
function settleTimedHint(value){const r=timedHintResolve;timedHintResolve=null;if(r)r(value);}
function offerTimedHint(reason){
 return new Promise(resolve=>{
  const why=reason==='failed'?'The ad could not be loaded right now.':rewardedAvailable()?'No ad is available right now.':'Ads need the installed Android app.';
  const wait=timedHintNextAt()-Date.now();
  if(wait>0){const min=Math.ceil(wait/60000);showModal(`<div class="modal-tag">RECIPE HINT</div><h2>No ad available</h2><p>${why}</p><p>Your next free hint is ready in ${min} minute${min===1?'':'s'}.</p><p class="mini-muted">Nothing was unlocked. Keep experimenting!</p>`);resolve(false);return;}
  showModal(`<div class="modal-tag">RECIPE HINT</div><h2>Free hint ready</h2><p>${why} You can use one free hint every 10 minutes instead.</p><button type="button" class="modal-button" id="useTimedHint">Use free hint</button>`);
  timedHintResolve=resolve;
  $('useTimedHint').onclick=()=>{try{localStorage.setItem(TIMED_HINT_KEY,String(Date.now()+TIMED_HINT_COOLDOWN_MS));}catch{}settleTimedHint(true);};
 });
}
function grantRecipeHint(elementId){
 hintState.clues[elementId]='recipe';saveHints();
 if(tab==='World')renderDiscoveries();
 return true;
}
function offerEmptyBank(){
 return new Promise(resolve=>{
  const ad=rewardedAvailable(),m=minutesUntil(hintBank.next);
  showModal(`<div class="modal-tag">HINTS</div><h2>No hints left</h2><p>Your next free hint arrives in ${m} minute${m===1?'':'s'} (up to ${HINT_BANK_MAX}).</p>${ad?'<button type="button" class="modal-button" id="bankAd">Watch an optional ad for a hint</button>':''}<button type="button" class="modal-button secondary" id="bankWait">Wait</button>`);
  timedHintResolve=resolve;
  if(ad)$('bankAd').onclick=()=>settleTimedHint(true);
  $('bankWait').onclick=()=>{settleTimedHint(false);closeModal();};
 });
}
async function earnRecipeByAd(elementId,family){
 const option=candidateFor(elementId);
 if(!option||unlocked.has(elementId))return false;
 if(hintState.clues[elementId]==='recipe')return true;
 if(adFree()){
  if(takeBankHint())return grantRecipeHint(elementId);
  if(!(await offerEmptyBank()))return false;
 }
 const native=getRewardBridge();
 if(!native)return adFree()?false:(await offerTimedHint('unavailable'))&&grantRecipeHint(elementId);
 if(rewardedHintBusy)return false;
 rewardedHintBusy=true;
 showModal(`<div class="modal-tag">REWARDED HINT</div><h2>Preparing your ad…</h2><p>The full recipe unlocks only after the ad confirms its reward.</p>`);
 let response=null,failed=false;
 try{response=await native.showRewarded({kind:'recipe',elementId,family});}
 catch(err){failed=true;console.warn('Rewarded ad unavailable',err);}
 finally{rewardedHintBusy=false;}
 if(failed)return (await offerTimedHint('failed'))&&grantRecipeHint(elementId);
 if(response?.earned!==true){toast('Ad not completed · Recipe still hidden','error');showModal(`<div class="modal-tag">REWARDED HINT</div><h2>No reward received</h2><p>The ad was not completed. Your recipe is still hidden.</p>`);return false;}
 return grantRecipeHint(elementId);
}
async function revealRecipeWithAd(id){
 const option=candidateFor(id);
 if(option&&await earnRecipeByAd(id,activeFamily))showRecipeReward(id,option);
}
function showRecipeReward(id,option){
 showCompassRevealed({out:id,a:option.a,b:option.b,family:familyFor(byId.get(id))});
}
function showUnlockModal(id,option){
 const status=hintState.clues[id]||null,known=status==='recipe';
 showModal(`<div class="modal-tag">${known?'RECIPE KNOWN · NOT CRAFTED':'UNDISCOVERED'}</div><div class="discover-modal-mystery">?</div><h2>????</h2><p class="unlock-explanation">${formatClue(id)}</p><p class="unlock-note">${escapeText(discoverMetric(id))} · ${escapeText(playerRate(id))}</p>
 ${option?`<div class="unlock-choices"><button class="modal-button" id="watchRecipe">${known?'View known recipe':'▶ Watch ad · Reveal recipe'}</button></div>`:''}
 <p class="mini-muted">${known?'Combine the ingredients to discover the element.':rewardedAvailable()?'Only a completed rewarded ad reveals the recipe.':'Rewarded ads require the installed Android version.'}</p>`);
 if(option)$('watchRecipe').onclick=()=>known?showRecipeReward(id,option):revealRecipeWithAd(id);
}
function unlockInFamily(){
 const candidate=getFamilyCandidate();
 if(!candidate){toast('No craftable recipes in this family yet','repeat');return;}
 if(candidate.revealed==='recipe'){showRecipeReward(candidate.id,candidate);return;}
 revealRecipeWithAd(candidate.id);
}
// V114: while you play elsewhere, residents keep using their furniture. Coming back to Home shows
// what they trained (same daily cap as the live room).
let homeAwaySince=null;
const STAT_LABEL={run:'Run',swim:'Swim',power:'Power',fly:'Fly',stamina:'Stamina',hp:'HP'};
function homeAwaySummary(){
 const since=homeAwaySince;homeAwaySince=null;if(!since)return;const mins=(Date.now()-since)/60000;if(mins<2||document.querySelector('#modal:not([hidden])'))return;
 const houses=homes.state().houses||{};const rows=[];
 for(const [hid,h] of Object.entries(houses)){if(!homeDiscovered(hid))continue;
  const effs=[...new Set((h.furniture||[]).map(f=>HOME_OBJECTS[f.id]?.effect).filter(e=>e&&!['decor','discovery'].includes(e)))];if(!effs.length)continue;
  for(const cid of h.residents||[]){const pet=companions.state().pets[cid];if(!pet?.stats)continue;
   const before=Object.fromEntries(Object.entries(pet.stats).map(([k,v])=>[k,{lv:v.level,tot:v.level*100+v.bar}]));const mood0=pet.mood,belly0=pet.belly;
   const uses=Math.min(30,Math.max(1,Math.round(mins*1.5)));for(const e of effs)for(let k=0;k<uses;k++)companions.homeEffect(cid,e);
   const after=companions.state().pets[cid];const gains=Object.keys(STAT_LABEL).map(k=>({k,pts:(after.stats[k].level*100+after.stats[k].bar)-before[k].tot,lv0:before[k].lv,lv1:after.stats[k].level})).filter(g=>g.pts>0);
   const extra=[after.mood>mood0?`Mood +${Math.round(after.mood-mood0)}`:'',after.belly>belly0?`Belly +${Math.round(after.belly-belly0)}`:''].filter(Boolean);
   if(gains.length||extra.length)rows.push({cid,hid,gains,extra});}}
 if(!rows.length)return;
 const time=mins>=60?`${Math.floor(mins/60)} h ${Math.round(mins%60)} min`:`${Math.round(mins)} min`;
 showModal(`<div class="modal-tag companion-tag">WHILE YOU WERE AWAY · ${time}</div><h2>Your companions trained at home</h2>
  <div class="away-list">${rows.map(r=>`<div class="away-row"><span class="away-ava">${COMPANION_SPRITES_V86[r.cid]||''}</span><div><strong>${escapeText(companions.state().pets[r.cid]?.nick||uiName(byId.get(r.cid)))}</strong><small>${escapeText(homeUiName(homeById.get(r.hid)))}</small>
   <span class="away-gains">${r.gains.map(g=>`<b class="${g.lv1>g.lv0?'is-up':''}">${STAT_LABEL[g.k]} +${g.pts} XP${g.lv1>g.lv0?` · Lv ${g.lv0}→${g.lv1}`:''}</b>`).join('')}${r.extra.map(x=>`<b class="is-care">${x}</b>`).join('')}</span></div></div>`).join('')}</div>
  <p class="mini-muted">Residents use their furniture while you play. Furniture training has a daily limit per companion.</p><button type="button" class="modal-button" id="awayOk">Nice!</button>`);
 $('awayOk').onclick=closeModal;companions.refreshViews?.();
}
function switchTab(view){
 const wasHome=tab==='Pets';
 tab=view==='World'?'World':view==='Pets'?'Pets':view==='Games'&&gamesUnlocked()?'Games':'Play';
 for(const name of ['Play','World','Pets','Games'])$(`view${name}`).hidden=name!==tab;
 if(tab==='Games'){games.render($('viewGames'));gamesSeen();}
 document.querySelectorAll('.tab').forEach(b=>{const active=b.dataset.view===tab;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');});
 if(tab==='World')renderDiscoveries();else if(tab==='Pets')companions.renderTab();else playVirtual.draw(true);
 if(tab==='Pets')companions.markSeen();else companions.syncSeen();
 companions.onViewChange();
 if(wasHome&&tab!=='Pets')homeAwaySince=Date.now();else if(!wasHome&&tab==='Pets')setTimeout(homeAwaySummary,350);
}
// V86 Companions: five companion elements per family live on top of the interface.
// V105: every player owns the Frog from the start (shows new players this is more than an alchemy game).
const STARTER_COMPANION='organic38:frog';
// V105: one shared synth for companion and stadium sounds (respects the Settings sound toggle).
const SFX=createStadiumSfx(()=>soundEnabled?acquireSoundEngine():null);
function companionOwned(id){return id===STARTER_COMPANION||discoveredAnywhere(id);}
function discoveredAnywhere(id){
 if(unlocked.has(id)&&!STARTERS.has(id))return true;
 if(currentMode==='family'&&classicSnapshot?.unlocked?.includes(id))return true;
 return Object.entries(familyProfiles).some(([fid,p])=>Array.isArray(p?.unlocked)&&p.unlocked.includes(id)&&!familyCampaigns.get(fid)?.starters.includes(id));
}
// V87: the first companion is free; switching later needs a rewarded ad, then 5 free minutes
// (same rule as mode switching). Without ads (purchase) it is always free. Sending home is free.
const COMPANION_GRACE_KEY='alchemy10k_companion_switch_grace_v1',COMPANION_GRACE_MS=5*60*1000;
function companionGraceLeft(){try{return Math.max(0,(Number(localStorage.getItem(COMPANION_GRACE_KEY))||0)-Date.now());}catch{return 0;}}
function confirmCompanionAd(meta){return new Promise(res=>{const nm=escapeText(uiName(byId.get(meta.id))||meta.name);
 showModal(`<div class="modal-tag">REWARDED COMPANION SWITCH</div><div class="modal-art">${COMPANION_SPRITES_V86[meta.id]||staticArt(byId.get(meta.id))}</div><h2>Switch to ${nm}?</h2><p>Your first companion was free. Switching companions requires a rewarded ad; after it, switching again is free for 5 minutes.</p><button type="button" class="modal-button" id="companionAdGo">Watch ad</button><button type="button" class="modal-button secondary" id="companionAdNo">Cancel</button>`);
 $('companionAdGo').onclick=()=>res(true);$('companionAdNo').onclick=()=>{closeModal();res(false);};});}
async function requestCompanionActivation(meta){
 if(adFree())return true;
 const g=companionGraceLeft();if(g>0){toast(`Free companion switch · ${minutesUntil(Date.now()+g)} min left`,'repeat');return true;}
 if(!rewardedAvailable()){showModal(`<div class="modal-tag">REWARDED COMPANION SWITCH</div><h2>Ads unavailable</h2><p>Switching companions requires a completed rewarded ad in the Android app. This standalone HTML does not simulate ads.</p><p class="mini-muted">Your current companion stays with you.</p><button type="button" class="modal-button secondary" id="companionAdClose">Close</button>`);$('companionAdClose').onclick=closeModal;return false;}
 if(!(await confirmCompanionAd(meta)))return false;
 if(rewardedHintBusy)return false;rewardedHintBusy=true;
 showModal(`<div class="modal-tag">REWARDED COMPANION SWITCH</div><h2>Loading ad…</h2><p>The companion changes only when the Android ad SDK confirms the earned reward.</p>`);
 let result=null;
 try{result=await getRewardBridge().showRewarded({kind:'companion_switch',companion:meta.id});}
 catch(e){console.warn('Companion rewarded ad failed',e);}
 finally{rewardedHintBusy=false;}
 if(result?.earned!==true){showModal(`<h2>Companion unchanged</h2><p>The ad was unavailable, dismissed or not rewarded. Your current companion stays with you.</p><button type="button" class="modal-button secondary" id="companionAdClose">Close</button>`);$('companionAdClose').onclick=closeModal;return false;}
 try{localStorage.setItem(COMPANION_GRACE_KEY,String(Date.now()+COMPANION_GRACE_MS));}catch{}
 closeModal();toast('Companion changed · switching again is free for 5 minutes','repeat');return true;
}
function setPetsBadge(n){const b=$('petsBadge');if(b)b.hidden=!(n>0);}
const companions=createCompanionSystem({roster:COMPANIONS_V86,sprites:COMPANION_SPRITES_V86,$,escapeText,byId,uiName,staticArt,familyFor,
 requestActivation:requestCompanionActivation,onBadge:setPetsBadge,renderExtra:()=>homes.render($('homeMount')),wear:root=>wearAll(root),
 growthFor:(id,kind)=>homes.growthFor(id,kind)*alchemyGrowth(),houseLine:id=>[homes.houseLine(id),`Alchemy bonus ×${alchemyGrowth()} · ${classicDiscoveredCount().toLocaleString('en-US')} elements found in Classic`].filter(Boolean).join('<br>'),alchemyGrowth,residentOf:id=>homes.residentOf(id),
 isDiscovered:companionOwned,starterCompanion:STARTER_COMPANION,sfx:SFX,depthOf:id=>routeDepth.get(id),isShiny:id=>shiny.has(id),elementIsUseful,getSlots:()=>slots,isLeftLocked:()=>leftLocked,toast,showModal,closeModal,
 reducedMotion:()=>Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),FAMILIES});
// V90: companion houses (furniture placement, residents) on the Home tab.
// V94: Stadium prizes (toys) are placeable house objects; belts are worn by the companions.
const HOME_OBJECTS={...HOME_OBJECTS_V89,...Object.fromEntries(Object.values(RACE_PRIZES).map(p=>[p.id,{kind:p.kind,effect:p.effect,size:p.size}]))};
const ROOM_SPRITES={...ROOM_SPRITES_V90,...Object.fromEntries(Object.values(RACE_PRIZES).map(p=>[p.id,p.room]))};
// V108: every companion can win its own trophy of each course (built on demand).
const trophyFor=id=>{const t=parsePersonalPrize(id);if(!t)return null;const c=COMPANIONS_V86.find(x=>x.id===t.cid);if(!c)return null;return personalPrize(t.course,t.cid,companions?.state?.().pets?.[t.cid]?.nick||uiName(byId.get(t.cid))||c.name,COMPANION_SPRITES_V86[t.cid]);};
for(const c of COMPANIONS_V86)for(const k of Object.keys(RACE_PRIZES)){const id=personalPrizeId(k,c.id);HOME_OBJECTS[id]={kind:'furniture',effect:RACE_PRIZES[k].effect,size:[1,1]};Object.defineProperty(ROOM_SPRITES,id,{enumerable:true,get:()=>trophyFor(id)?.room});}
const homeById={get:id=>PRIZE_BY_ID[id]||trophyFor(id)||byId.get(id)};
const homeUiName=it=>it?.prize?it.name:uiName(it);
const homeStaticArt=it=>it?.prize?it.art:staticArt(it);
const homeDiscovered=id=>PRIZE_BY_ID[id]||parsePersonalPrize(id)?games.hasPrize(id):companionOwned(id);
// V96: Classic discoveries speed up companion growth — +10% per 400 elements found in Classic,
// up to ×2 at 4,000 (a multiplier on future gains only, like the houses).
function classicDiscoveredCount(){try{const list=currentMode==='classic'?[...unlocked]:(classicSnapshot?.unlocked||[]);return Math.max(0,list.filter(id=>!['legacy:0','legacy:1','legacy:2','legacy:3'].includes(id)).length);}catch{return 0;}}
function alchemyGrowth(){return Math.round((1+Math.min(1,classicDiscoveredCount()/4000))*100)/100;}
function wearAll(root){if(!root)return;const els=root.querySelectorAll?.('[data-companion], .pet-ava[data-card], .pet-card[data-pet], .home-res[data-res], .pets-now-art[data-card]')||[];for(const el of els){const id=el.dataset.companion||el.dataset.card||el.dataset.pet||el.dataset.res;const belt=games.beltOf(id);if(!belt)continue;const svg=el.querySelector('svg');if(svg)wearBelt(svg,belt);}}
const homes=createHomeSystem({$,escapeText,byId:homeById,uiName:homeUiName,staticArt:homeStaticArt,isDiscovered:homeDiscovered,objects:HOME_OBJECTS,sprites:COMPANION_SPRITES_V86,roster:COMPANIONS_V86,
 roomSprites:ROOM_SPRITES,depthOf:id=>routeDepth.get(id),alchemy:()=>({mult:alchemyGrowth(),finds:classicDiscoveredCount()}),wear:wearAll,applyEffect:(cid,eff)=>companions.homeEffect(cid,eff),
 companionName:id=>companions.state().pets[id]?.nick||uiName(byId.get(id)),statsHtml:id=>companions.statsHtml(id),showModal,closeModal,toast,reducedMotion:()=>Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)});
// V91 idle discoveries: while the game is closed, companions living in houses find elements the
// player could already craft right now (both ingredients owned, result not yet found). Rate grows
// with residents, their total level and the discovery furniture; capped by time (8 h) and size.
// On return: keep 1 free (2 when there are 5+), watch one rewarded ad to keep them all. Without
// ads (purchase) all are kept. The offline HTML never simulates the ad. Residents also train on
// their house's training furniture while away (same daily cap as live use).
const IDLE_KEY='alchemy10k_idle_v1',IDLE_MIN_MS=30*60*1000,IDLE_MAX_HOURS=8;
function idleRead(){try{return JSON.parse(localStorage.getItem(IDLE_KEY)||'null')||{};}catch{return {};}}
function idleWrite(v){try{localStorage.setItem(IDLE_KEY,JSON.stringify(v));}catch{}}
function idleTouch(){const v=idleRead();v.lastSeen=Date.now();idleWrite(v);}
function idleCandidates(){const out=[];const seen=new Set();for(const [k,o] of recipes){if(unlocked.has(o)||seen.has(o)||!byId.has(o))continue;const [a,b]=k.split('|');if(unlocked.has(a)&&unlocked.has(b)){seen.add(o);out.push([o,a,b]);}}return out;}
function idlePlan(awayMs){
 const hs=homes.state().houses,pets=companions.state().pets;let residents=[],disc=0;
 for(const [hid,h] of Object.entries(hs)){if(!discoveredAnywhere(hid))continue;const rs=(h.residents||[]).filter(discoveredAnywhere);residents.push(...rs.map(cid=>({cid,hid})));disc+=(h.furniture||[]).filter(f=>HOME_OBJECTS_V89[f.id]?.effect==='discovery').length*(rs.length?1:0);}
 if(!residents.length)return null;
 const hours=Math.min(IDLE_MAX_HOURS,awayMs/3600000);
 const lv=residents.reduce((n,r)=>n+Object.values(pets[r.cid]?.stats||{}).reduce((m,s)=>m+(s.level||0),0),0)/residents.length;
 const rate=0.3*residents.length*(1+lv/120)*(1+0.12*Math.min(10,disc));
 const cap=Math.min(15,2+residents.length+Math.floor(disc/2));
 return {residents,hours,count:Math.min(cap,Math.floor(rate*hours+Math.random()*0.6))};
}
function applyIdleFind([id,a,b]){if(unlocked.has(id))return;unlocked.add(id);if(!STARTERS.has(id))discoveryLedger.set(id,{at:new Date().toISOString(),source:'companions',ingredients:[a,b]});recent=[id,...recent.filter(x=>x!==id)].slice(0,350);companions.onDiscovery(id);}
async function checkIdleFinds(){
 const v=idleRead(),now=Date.now();const away=v.lastSeen?now-v.lastSeen:0;idleTouch();
 if(away<IDLE_MIN_MS||document.querySelector('#modal:not([hidden])'))return;
 const plan=idlePlan(away);if(!plan)return;
 // training while away (daily cap applies inside homeEffect)
 const trained={};for(const r of plan.residents){const h=homes.state().houses[r.hid];const effs=new Set((h.furniture||[]).map(f=>HOME_OBJECTS_V89[f.id]?.effect).filter(e=>['run','swim','power','fly','stamina','hp','food','mood'].includes(e)));
  for(const e of effs){const uses=Math.round(plan.hours*4);let any=false;for(let k=0;k<uses;k++)if(companions.homeEffect(r.cid,e))any=true;if(any&&!['food','mood'].includes(e))(trained[r.cid]=trained[r.cid]||[]).push(e);}}
 const pool=idleCandidates();const finds=[];while(finds.length<plan.count&&pool.length){finds.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);}
 if(!finds.length&&!Object.keys(trained).length)return;
 const free=adFree()?finds.length:Math.min(finds.length,finds.length>=5?2:1);
 const hrs=plan.hours>=1?`${Math.floor(plan.hours)} h`:`${Math.round(plan.hours*60)} min`;
 const trainedHtml=Object.entries(trained).map(([cid,es])=>`<li>${escapeText(companions.state().pets[cid]?.nick||uiName(byId.get(cid)))} trained ${es.map(e=>({run:'Run',swim:'Swim',power:'Power',fly:'Fly',stamina:'Stamina',hp:'HP'})[e]).join(', ')}</li>`).join('');
 const art=finds.map(([id],i)=>`<span class="idle-find ${i<free?'is-free':'is-locked'}" title="${escapeText(uiName(byId.get(id)))}">${staticArt(byId.get(id))}${i<free?'':'<i class="idle-lock" aria-hidden="true"></i>'}</span>`).join('');
 const canAd=!adFree()&&finds.length>free&&rewardedAvailable();
 showModal(`<div class="modal-tag companion-tag">WHILE YOU WERE AWAY · ${hrs}</div><h2>${finds.length?`Your companions discovered ${finds.length} element${finds.length>1?'s':''}!`:'Your companions trained at home'}</h2>${finds.length?`<div class="idle-finds">${art}</div><p class="mini-muted">${free===finds.length?'All of them are yours.':`${free} ${free>1?'are':'is'} yours for free. ${canAd?'Watch one ad to keep all of them.':'Ads are unavailable here, so the rest are lost this time.'}`}</p>`:''}${trainedHtml?`<ul class="idle-trained">${trainedHtml}</ul>`:''}${canAd?'<button type="button" class="modal-button" id="idleAd">Watch ad · keep all</button>':''}<button type="button" class="modal-button ${canAd?'secondary':''}" id="idleKeep">${finds.length&&free<finds.length?`Keep ${free}`:'Great'}</button>`);
 // The free finds are kept right away (closing the sheet never loses them); the ad adds the rest.
 const grant=(from,to)=>{for(const f of finds.slice(from,to))applyIdleFind(f);if(to>from){save();updateCounts();updateLatest();rerenderCollections();syncFamilyBanner();}};
 grant(0,free);
 const finish=n=>{grant(free,n);if(n)toast(`${n} new discover${n>1?'ies':'y'} from your companions`,'new');closeModal();};
 $('idleKeep').onclick=()=>finish(free);
 const ad=$('idleAd');if(ad)ad.onclick=async()=>{if(rewardedHintBusy)return;rewardedHintBusy=true;let result=null;
  try{result=await getRewardBridge().showRewarded({kind:'idle_finds',count:finds.length});}catch(e){console.warn('Idle rewarded ad failed',e);}finally{rewardedHintBusy=false;}
  if(result?.earned!==true){toast('Ad not completed · keeping the free ones','repeat');finish(free);return;}finish(finds.length);};
}
// V93: the Games tab (races + sparring ring) appears once the player has a house and a companion.
const GAMES_SEEN_KEY='alchemy10k_games_seen_v1';
function gamesUnlocked(){try{return homes.ownedHouses().length>0&&companions.unlocked().length>0;}catch{return false;}}
function syncGamesTab(){const t=document.querySelector('.tab-games');if(!t)return;const on=gamesUnlocked();t.hidden=!on;let seen=false;try{seen=localStorage.getItem(GAMES_SEEN_KEY)==='1';}catch{}const b=$('gamesBadge');if(b)b.hidden=!(on&&!seen);}
function gamesSeen(){try{localStorage.setItem(GAMES_SEEN_KEY,'1');}catch{}syncGamesTab();}
const games=createGamesSystem({$,escapeText,roster:COMPANIONS_V86,sprites:COMPANION_SPRITES_V86,byId,uiName,isDiscovered:companionOwned,companionInfo:id=>companions.info(id),activeId:()=>companions.state().active,
 prizes:{RACE_PRIZES,beltSvg,personal:(course,cid,name,sprite)=>personalPrize(course,cid,companions.state().pets?.[cid]?.nick||name,sprite)},starterCompanion:STARTER_COMPANION,belts:BELTS,wear:wearAll,alchemyGrowth,classicCount:classicDiscoveredCount,openCard:id=>companions.openCard(id),art:STADIUM_ART_V95,sfx:SFX,onBelt:()=>{companions.refreshViews();companions.start();},
 onResult:(id,kind,focus,place)=>{const amt=[0,12,8,5,3,3][place]||3;const stats=kind==='karate'?['power','hp']:focus==='all'?['run','swim','fly','power']:focus==='stamina'?['stamina','run']:[focus,'stamina'];return companions.gameReward(id,stats,amt);},
 showModal,closeModal,toast,reducedMotion:()=>Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)});
const BACKUP_KEYS=[COMPANION_STORAGE_KEY,HOME_STORAGE_KEY,GAMES_STORAGE_KEY,SHINY_KEY,HINT_BANK_KEY,FAMILY_SAVES_KEY,MODE_SELECTION_KEY,'gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_ledger_v16','gameverse_discovery_hints_v20',EXTRA_STORAGE,DISCOVERY_ORDER_KEY];
function backupJson(){
 save();
 const progress={format:'35k-alchemy-backup',version:25,savedAt:new Date().toISOString(),data:{}};
 for(const key of BACKUP_KEYS){const raw=localStorage.getItem(key);if(raw!==null){try{progress.data[key]=JSON.parse(raw);}catch{}}}
 return JSON.stringify(progress,null,2);
}
// V83: Android WebViews ignore <a download>; the APK shares the file through the
// native AlchemyBackup plugin (Drive, Files, e-mail...). Browsers download it.
function backupBridge(){const cap=window.Capacitor;if(cap?.getPlatform?.()!=='android')return null;const b=cap.Plugins?.AlchemyBackup;return b&&typeof b.shareFile==='function'?b:null;}
async function exportProgress(){
 const json=backupJson(),filename='Alchemy_10K_Backup_'+new Date().toISOString().slice(0,10)+'.json';
 const bridge=backupBridge();
 if(bridge){try{await bridge.shareFile({filename,content:json});toast('Choose where to save your backup');return;}catch(e){console.warn('Backup share failed',e);}}
 if(!window.Capacitor){
  const blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Backup exported');return;
 }
 showBackupCode(json);
}
function showBackupCode(json){
 showModal(`<div class="modal-tag">BACKUP</div><h2>Copy your backup</h2><p>Copy this code and keep it somewhere safe (notes, e-mail). Paste it in Import backup to restore.</p><textarea class="backup-code" id="backupCode" readonly rows="6"></textarea><button type="button" class="modal-button" id="copyBackup">Copy code</button>`);
 $('backupCode').value=json;
 $('copyBackup').onclick=async()=>{try{await navigator.clipboard.writeText(json);toast('Backup code copied');}catch{$('backupCode').select();toast('Select all and copy the code','error');}};
}
function openImportProgress(){
 showModal(`<div class="modal-tag">IMPORT BACKUP</div><h2>Restore progress</h2><p>Importing replaces the progress saved on this device.</p><button type="button" class="modal-button" id="importPickFile">Choose backup file</button><input type="file" id="importFile" accept="application/json,.json,text/plain" hidden><div class="settings-divider"></div><textarea class="backup-code" id="importCode" rows="5" placeholder="…or paste a backup code here"></textarea><button type="button" class="modal-button secondary" id="importPasted">Import pasted code</button>`);
 $('importPickFile').onclick=()=>$('importFile').click();
 $('importFile').onchange=e=>importProgress(e.target.files?.[0]);
 $('importPasted').onclick=()=>{const t=$('importCode').value.trim();if(!t){toast('Paste a backup code first','error');return;}importBackupText(t);};
}
function importProgress(file){
 if(!file||file.size>3_000_000){toast('Invalid backup size','error');return;}
 const reader=new FileReader();reader.onload=()=>importBackupText(String(reader.result));
 reader.readAsText(file);
}
function importBackupText(text){
  if(typeof text!=='string'||text.length>3_000_000){toast('Invalid backup size','error');return;}
  try{const state=JSON.parse(text);
    if(state.format!=='35k-alchemy-backup'||state.version!==25||!state.data||typeof state.data!=='object')throw Error('Incompatible backup');
    const allowed=Object.fromEntries(BACKUP_KEYS.filter(k=>Object.hasOwn(state.data,k)).map(k=>[k,state.data[k]]));
    if(allowed.gameverse_alchemy_v2&&allowed.gameverse_alchemy_v2.v!==2)throw Error('Invalid classic progress');
    if(!allowed.gameverse_alchemy_v2&&!allowed[FAMILY_SAVES_KEY])throw Error('Missing progress');
    if(allowed.gameverse_dynamic_v11&&allowed.gameverse_dynamic_v11.v!==11)throw Error('Unexpected dynamic progress');
    if(allowed.gameverse_discovery_hints_v20&&allowed.gameverse_discovery_hints_v20.v!==20)throw Error('Unexpected hints');
    if(allowed[EXTRA_STORAGE]&&allowed[EXTRA_STORAGE].v!==25)throw Error('Unexpected favorites');
    const entries=Object.entries(allowed).map(([k,v])=>[k,JSON.stringify(v)]);
    if(entries.some(([k,v])=>v.length>2_000_000))throw Error('Oversized data');
    if(!Object.hasOwn(allowed,DISCOVERY_ORDER_KEY))localStorage.removeItem(DISCOVERY_ORDER_KEY);
    for(const [k,v] of entries)localStorage.setItem(k,v);
    toast('Progress imported · reloading');setTimeout(()=>location.reload(),450);
  }catch(e){toast('Could not import backup: '+e.message,'error');}
}
// V83: delete progress. Families are wiped together because shared IDs re-synchronize
// between campaigns. Settings, sound, theme, sort and ad privacy choices are kept.
let progressWiping=false;
function openDeleteProgress(){
 const choices=[['classic','Classic progress','Classic discoveries, revealed recipes and order'],['families','Families Only progress','Every family campaign and any pending Merge'],['all','Everything','Classic, all families, Shiny elements and saved favorites']];
 showModal(`<div class="modal-tag">DELETE PROGRESS</div><h2>What should be deleted?</h2><div class="sort-choices">${choices.map(([id,t,d])=>`<button type="button" class="sort-option" data-wipe="${id}"><span class="sort-option-content"><strong>${t}</strong><small>${d}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div><button type="button" class="modal-button secondary" id="wipeExportFirst">Export a backup first</button><p class="mini-muted">Sound, theme, sorting and ad privacy choices are kept.</p>`);
 $('wipeExportFirst').onclick=exportProgress;
 $('modalContent').querySelectorAll('[data-wipe]').forEach(b=>b.onclick=()=>confirmWipe(b.dataset.wipe));
}
function confirmWipe(target){
 const label={classic:'Classic progress',families:'all Families Only progress',all:'everything'}[target];if(!label)return;
 showModal(`<div class="modal-tag">DELETE PROGRESS</div><h2>Delete ${label}?</h2><p>This cannot be undone unless you have a backup.</p><button type="button" class="modal-button danger" id="wipeConfirm">Delete permanently</button><button type="button" class="modal-button secondary" id="wipeCancel">Cancel</button>`);
 $('wipeCancel').onclick=openDeleteProgress;
 $('wipeConfirm').onclick=()=>wipeProgress(target);
}
function wipeProgress(target){
 const classicKeys=['gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_ledger_v16',HINT_STORAGE,DISCOVERY_ORDER_KEY];
 const familyKeys=[FAMILY_SAVES_KEY,MERGE_PENDING_KEY,MERGE_TO_FAMILIES_KEY];
 const keys=target==='classic'?classicKeys:target==='families'?familyKeys:target==='all'?[...classicKeys,...familyKeys,EXTRA_STORAGE,SHINY_KEY,COMPANION_STORAGE_KEY,HOME_STORAGE_KEY,GAMES_STORAGE_KEY,GAMES_SEEN_KEY]:null;
 if(!keys)return;
 progressWiping=true;clearTimeout(autoTimer);
 try{for(const k of keys)localStorage.removeItem(k);}catch{}
 if(target==='all'){try{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&k.startsWith('gameverse_verified_firsts_v16:'))localStorage.removeItem(k);}}catch{}}
 $('modal').hidden=true;toast('Progress deleted · restarting','error');setTimeout(()=>location.reload(),450);
}
// V76.6: Settings uses three compact tabs. No simulated Google identity or cloud save.
// V76.7: a game-first settings sheet. Profile and help are separate panels.
// Play Games identity, cloud saves and global scores are NOT simulated.
// V76.8: one plain Settings overview with separate Profile and Help screens.
// There are no tabs, fake Play Games accounts, fake rankings or fake cloud saves.
let settingsPage='main';
function getPlayerServicesBridge(){
 const cap=window.Capacitor;
 if(cap?.getPlatform?.()!=='android')return null;
 const bridge=cap.Plugins?.AlchemyPlayerServices;
 return bridge&&typeof bridge.getStatus==='function'?bridge:null;
}
async function refreshPlayerServicesStatus(){
 const bridge=getPlayerServicesBridge();if(!bridge)return;
 try{
  const state=await bridge.getStatus();
  const connected=state?.authenticated===true&&typeof state.playerId==='string'&&state.playerId.trim().length>0;
  const name=$('settingsAccountName'),status=$('settingsAccountStatus'),info=$('settingsAccountInfo');
  if(!name||!status||!info||!$('settingsPanelProfile')||!connected)return;
  name.textContent=typeof state.displayName==='string'&&state.displayName.trim()?state.displayName.trim().slice(0,70):'Play Games player';
  status.textContent='Play Games connected';status.dataset.state='available';
  info.textContent='Play Games identity is available. Leaderboards and cloud backup are not enabled in this build.';
 }catch(error){console.warn('Play Games status unavailable; local progress unchanged',error);}
}
function selectSettingsPage(next,{focus=false}={}){
 if(!['main','profile','help'].includes(next))return;
 settingsPage=next;
 const title=next==='profile'?'Google Play Games':next==='help'?'Help':'Settings';
 $('settingsHeading').textContent=title;
 const back=$('settingsBack');
 back.hidden=next==='main';
 for(const panel of $('modalContent').querySelectorAll('[data-settings-page]')){
  panel.hidden=panel.dataset.settingsPage!==next;
  if(!panel.hidden)panel.scrollTop=0;
 }
 if(focus)(next==='main'?$('settingsProfileLink'):back).focus();
}
function settings(){
 const mode=currentMode==='family'?'Families Only':'Classic';
 showModal(`<div class="settings-shell">
  <div class="settings-header">
   <button type="button" class="settings-back" id="settingsBack" aria-label="Back to settings" hidden>‹</button>
   <h2 id="settingsHeading">Settings</h2>
  </div>
  <section id="settingsPanelMain" class="settings-page" data-settings-page="main" aria-label="Game settings">
   <div class="settings-section">
    <div class="settings-row">
     <label for="settingsSoundToggle">Sound effects</label>
     <button type="button" id="settingsSoundToggle" class="settings-sound-toggle" aria-pressed="${soundEnabled}">${soundEnabled?'On':'Off'}</button>
    </div>
    <div class="settings-divider"></div>
    <div class="settings-theme">
     <div class="settings-row-title">Theme</div>
     <div class="settings-theme-choices" role="group" aria-label="Color theme">
      <button type="button" data-theme-choice="light" aria-pressed="${selectedTheme==='light'}">Light</button>
      <button type="button" data-theme-choice="dark" aria-pressed="${selectedTheme==='dark'}">Dark</button>
      <button type="button" data-theme-choice="system" aria-pressed="${selectedTheme==='system'}">Auto</button>
     </div>
    </div>
   </div>
   <div class="settings-section settings-links">
    <button type="button" id="changeGameMode" class="settings-link"><span>Game mode<small>${escapeText(mode)}</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div><button type="button" id="settingsMergeClassic" class="settings-link"><span>Merge Classic and Families<small>Both directions · ${adFree()?'free':'2 rewarded ads'}</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div><button type="button" id="settingsRemoveAds" class="settings-link"><span>${adFree()?'Ads removed ✓':'Remove ads · '+escapeText(billingPrice)}<small>${adFree()?'Thank you! 5% Shiny chance and a hint bank':'No forced ads, 10 hints included, 5% Shiny chance'}</small></span><span aria-hidden="true">›</span></button>
   </div>
   <div class="settings-section settings-links">
    <div class="settings-service-title">PROGRESS</div>
    <button type="button" id="settingsExport" class="settings-link"><span>Export backup<small>Save or send a file with all modes</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div>
    <button type="button" id="settingsImport" class="settings-link"><span>Import backup<small>Restore from a backup file or code</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div>
    <button type="button" id="settingsDelete" class="settings-link settings-danger"><span>Delete progress<small>Classic, Families Only or everything</small></span><span aria-hidden="true">›</span></button>
   </div>
   <div class="settings-section settings-links">
    <button type="button" id="settingsProfileLink" class="settings-link"><span>Google Play Games<small>Sign-in, cloud save and leaderboards · coming soon</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div>
    <button type="button" id="settingsHelpLink" class="settings-link"><span>Help &amp; about</span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div>
    <button type="button" id="settingsPrivacyAds" class="settings-link"><span>Privacy &amp; ads<small id="settingsAdStatus">${rewardedAvailable()?'Checking ads…':'Ads need the Android app'}</small></span><span aria-hidden="true">›</span></button>
   </div>
   <p class="settings-footnote">Progress is saved on this phone. Export a backup before changing device.</p>
  </section>
  <section id="settingsPanelProfile" class="settings-page" data-settings-page="profile" aria-label="Player profile" hidden>
   <div class="settings-section">
    <div class="settings-identity"><div class="settings-avatar" aria-hidden="true">✦</div><div>
      <strong id="settingsAccountName">Local player</strong>
      <span id="settingsAccountStatus" role="status" data-state="offline">Not connected</span>
      <small id="settingsAccountInfo">Google Play Games is not connected. Progress remains on this device.</small>
    </div></div>
    <div class="settings-divider"></div>
    <div class="settings-progress"><strong>${unlocked.size.toLocaleString('en-US')} <small>/ ${ITEMS.length.toLocaleString('en-US')}</small></strong><span>${escapeText(mode)} discoveries</span></div>
   </div>
   <div class="settings-section settings-links">
    <div class="settings-service-title">GOOGLE PLAY GAMES</div>
    <button type="button" class="settings-link" id="settingsLeaderboard" disabled><span>Leaderboards<small>Coming soon</small></span><span aria-hidden="true">›</span></button>
    <div class="settings-divider"></div>
    <button type="button" class="settings-link" id="recoverFromCloud" disabled><span>Recover from cloud<small>Not available yet</small></span><span aria-hidden="true">›</span></button>
   </div>
   <p class="settings-footnote">No cloud backup exists in this version. Use Settings → Export backup before uninstalling or changing phone.</p>
  </section>
  <section id="settingsPanelHelp" class="settings-page" data-settings-page="help" aria-label="Help and about" hidden>
   <div class="settings-section settings-help">
    <details><summary>How do I combine elements?</summary><p>In Classic, start with Water, Fire, Earth and Air. Tap or drag any two discovered elements into the combiner.</p></details>
    <div class="settings-divider"></div>
    <details><summary>How do hints and families work?</summary><p>Hints need a completed rewarded ad (or use your hint bank without ads). In Families Only, each family is a complete campaign from its own four starters, with separate progress. Merge copies discoveries between Classic and Families in either direction.</p></details>
    <div class="settings-divider"></div>
    <details><summary>What are companions?</summary><p>Five elements per family are companions. Once discovered, choose one in the Home tab: it walks around your screen, leaves gifts, and eats elements you drag onto it to level up. Companion houses (also in the Home tab) let several companions live, play and train together (see the Home tab for the full guide).</p></details>
    <div class="settings-divider"></div>
    <details><summary>What are Shiny elements?</summary><p>Every successful combination, including ones you already know, has a 1% chance (5% without ads) to make its result Shiny: it twinkles in your list and reveals a piece of trivia.</p></details>
    <div class="settings-divider"></div>
    <details><summary>Where is progress saved?</summary><p>Progress is stored locally. Clearing app data or uninstalling the game may erase it. Cloud recovery is not available yet.</p></details>
   </div>
   <div class="settings-about">Alchemy 10K <span>v${APP_VERSION} · ${rewardedAvailable()?'Test ads build':'Offline test build'}</span></div>
  </section>
 </div>`);
 $('modal').setAttribute('aria-labelledby','settingsHeading');
 $('settingsProfileLink').onclick=()=>selectSettingsPage('profile',{focus:true});
 $('settingsHelpLink').onclick=()=>selectSettingsPage('help',{focus:true});
 $('settingsPrivacyAds').onclick=openAdPrivacyOptions;
 $('settingsExport').onclick=exportProgress;
 $('settingsImport').onclick=openImportProgress;
 $('settingsDelete').onclick=openDeleteProgress;
 refreshAdStatus();
 $('settingsBack').onclick=()=>selectSettingsPage('main',{focus:true});
 // Escape returns from child pages before dismissing the sheet.
 $('modalContent').onkeydown=e=>{
  if(e.key==='Escape'&&settingsPage!=='main'){
   e.preventDefault();e.stopPropagation();selectSettingsPage('main',{focus:true});
  }
 };
 $('modalContent').querySelectorAll('[data-theme-choice]').forEach(btn=>btn.onclick=()=>{
  selectedTheme=btn.dataset.themeChoice;
  try{localStorage.setItem(THEME_KEY,selectedTheme);}catch{}
  applyTheme();
  $('modalContent').querySelectorAll('[data-theme-choice]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice.dataset.themeChoice===selectedTheme)));
 });
 syncSoundToggle();$('settingsSoundToggle').onclick=toggleSoundEnabled;
 $('settingsMergeClassic').onclick=mergeHub;$('settingsRemoveAds').onclick=openRemoveAds;
 $('changeGameMode').onclick=()=>modePicker(false);
 selectSettingsPage('main');
 void refreshPlayerServicesStatus();
}

// V28 family sweep: check EVERY ingredient first; only after the entire sweep do we
// show the new discoveries one by one. The alternate View All modal scrolls freely.
// No ads are simulated: the real Android bridge must positively confirm reward earned.
let batchState=null;
// Build one snapshot of the discovered ingredients, grouped by family.
// No repeated full-catalog sort when a family is selected.
function batchFamilySnapshot(){
 const groups=new Map(FAMILIES.map(f=>[f.id,[]]));
 for(const id of unlocked){const item=byId.get(id);if(item)groups.get(familyFor(item))?.push(id);}
 return groups;
}
let pendingBatchFamilies=null;
function familyBatchCandidates(family){return (pendingBatchFamilies?.get(family)||batchFamilySnapshot().get(family)||[]).slice().sort((a,b)=>uiName(byId.get(a)).localeCompare(uiName(byId.get(b))));}
function batchChooser(){
 if(!leftLocked||!slots[0]){toast('Lock an element on the left first','error');return;}
 pendingBatchFamilies=batchFamilySnapshot();
 const nonEmpty=FAMILIES.find(f=>pendingBatchFamilies.get(f.id).length>0);
 let selected=nonEmpty?.id||null;
 const familyCards=FAMILIES.map(f=>{
  const count=pendingBatchFamilies.get(f.id).length;
  const icon=familyCardArtwork(f);
  return `<button type="button" class="batch-family-choice" data-batch-family="${f.id}" aria-pressed="${f.id===selected}" ${count?'':'disabled'}><span class="batch-family-picture">${icon}</span><span class="batch-family-data"><strong>${escapeText(f.name)}</strong><small>${count.toLocaleString('en-US')} found</small></span></button>`;
 }).join('');
 showModal(`<div class="modal-tag">FAMILY COMBINER</div><h2>Choose a family</h2><p class="batch-intro"><span class="batch-locked">♧ ${escapeText(uiName(byId.get(slots[0])))}</span> stays locked. Scan all collected elements, then review new discoveries.</p><div class="batch-family-grid" role="group" aria-label="Family to combine">${familyCards}</div><div class="batch-selection"><strong id="batchSelectedName"></strong><span id="batchEstimate"></span></div><div class="batch-actions"><button class="modal-button" id="batchDemo" ${batchTrialUsed||!selected?'disabled':''}>${batchTrialUsed?'Free trial used':'Free trial'}</button><button class="modal-button secondary" id="batchRewarded" ${(adFree()||rewardedAvailable())&&selected?'':'disabled'}>${adFree()?'Scan · free':'Watch Ad'}</button></div><p class="mini-muted batch-quiet-note">Offline fast scan · No per-element animations. Rewarded ads need a configured Android build.</p>`);
 const redraw=()=>{
  document.querySelectorAll('[data-batch-family]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.batchFamily===selected)));
  $('batchSelectedName').textContent=FAMILIES.find(f=>f.id===selected)?.name||'No available elements';
  $('batchEstimate').textContent=`${(pendingBatchFamilies.get(selected)||[]).length.toLocaleString('en-US')} checks`;
 };
 $('modalContent').querySelectorAll('[data-batch-family]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.batchFamily;redraw();}));
 redraw();
 $('batchDemo').onclick=()=>{if(batchTrialUsed||!selected)return;beginBatch(selected,'trial');};
 $('batchRewarded').onclick=async()=>{
  if(adFree()&&selected){beginBatch(selected,'premium');return;}
  if(!rewardedAvailable()||!selected)return;
  const family=selected,locked=slots[0];
  $('batchRewarded').disabled=true;$('batchDemo').disabled=true;
  let result;try{result=await getRewardBridge().showRewarded({kind:'batch_family',family,elementId:locked});}catch(err){console.warn('Rewarded ad unavailable',err);}
  if(result?.earned!==true){toast('Ad not completed · No batch reward','error');if(!$('modal').hidden)batchChooser();return;}
  if(slots[0]!==locked||!leftLocked){toast('Locked element changed · Cancelled','error');return;}
  beginBatch(family,'ad');
 };
}
// Fast index for the locked ingredient: only its actual recipes, not the entire
// cross-product. The semantic fallback is checked once per discovered partner.
function batchPartnerIndex(fixed){
 const out=new Map();
 for(const [key,result] of recipes){
  const divider=key.indexOf('|');if(divider<0)continue;
  const a=key.slice(0,divider),b=key.slice(divider+1);
  if(a===fixed)out.set(b,result);else if(b===fixed)out.set(a,result);
 }
 return out;
}
function beginBatch(family,source){
 if(batchState||!leftLocked||!slots[0]){toast('Lock an element on the left first','error');return false;}
 const fixed=slots[0],ids=familyBatchCandidates(family);
 if(!ids.length){toast('Discover some elements in this family first','error');return false;}
 clearTimeout(autoTimer);pendingBatchFamilies=null;
 batchState={fixed,fixedItem:byId.get(fixed),family,source,ids,recipeIndex:batchPartnerIndex(fixed),index:0,fresh:0,repeat:0,miss:0,phase:'scanning',discoveries:[],newRecent:[],pendingIds:new Set(),pendingKnown:[],pendingRecipes:[],reviewIndex:0,viewAll:false,startedAt:performance.now()};
 const f=FAMILIES.find(f=>f.id===family);
 const art=familyCardArtwork(f);
 showModal(`<div class="modal-tag">SCANNING FAMILY</div><div class="batch-running-art">${art}</div><h2>${escapeText(f.name)}</h2><p>Combining with <strong>${escapeText(uiName(batchState.fixedItem))}</strong> · Checking recipes locally</p><span class="batch-fast-tag">Fast offline mode</span><div class="batch-running-progress"><div class="batch-running-fill" id="batchRunningFill"></div></div><div class="batch-running-count" id="batchRunningCount">0 / ${ids.length.toLocaleString('en-US')}</div><div class="batch-running-totals" id="batchRunningTotals">Searching for discoveries…</div><p class="mini-muted">Cancel with X. No animations or remote requests.</p>`);
 $('modal').dataset.dismiss='x-only';
 slots[1]=null;updateSlotUI();announceCraft('idle',`Scanning ${ids.length.toLocaleString('en-US')} combinations…`);
 requestAnimationFrame(batchScanChunk);
 return true;
}
function batchScanChunk(){
 const st=batchState;if(!st||st.phase!=='scanning')return;
 if(!leftLocked||slots[0]!==st.fixed){batchState=null;$('modal').hidden=true;toast('Batch cancelled · Locked element changed','error');return;}
 // Time budget protects input latency. Even 10,000 discovered elements should
 // need only a handful of frames, not 10,000 visual updates or timers.
 const deadline=performance.now()+7;
 let processed=0;
 while(st.index<st.ids.length&&processed<1500){
  const other=st.ids[st.index++],otherItem=byId.get(other);processed++;
  const cached=st.recipeIndex.get(other);
  const result=cached||(currentMode==='classic'?resolveLocalRedundancy(st.fixedItem,otherItem):null);
  if(!result||!byId.has(result)){st.miss++;if(performance.now()>=deadline)break;continue;}
  const key=pairKey(st.fixed,other),fresh=!unlocked.has(result)&&!st.pendingIds.has(result);
  // Stage changes in the batch transaction. Cancelling the modal does not
  // unlock half the results or consume the free trial.
  st.pendingKnown.push(key);
  if(!cached)st.pendingRecipes.push([key,result]);
  if(fresh){
   st.pendingIds.add(result);
   st.discoveries.push({id:result,a:st.fixed,b:other,source:cached?'recipe':'redundant'});st.newRecent.push(result);st.fresh++;
  }else st.repeat++;
  if(performance.now()>=deadline)break;
 }
 const percent=st.index/st.ids.length*100;
 if($('batchRunningFill'))$('batchRunningFill').style.width=percent.toFixed(1)+'%';
 if($('batchRunningCount'))$('batchRunningCount').textContent=`${st.index.toLocaleString('en-US')} / ${st.ids.length.toLocaleString('en-US')}`;
 if($('batchRunningTotals'))$('batchRunningTotals').textContent=`${st.fresh} new · ${st.repeat} repeated · ${st.miss} no match`;
 if(st.index<st.ids.length){requestAnimationFrame(batchScanChunk);return;}
 // Atomically commit results only after the ENTIRE sweep finishes.
 for(const k of st.pendingKnown)known.add(k);
 for(const [k,r] of st.pendingRecipes)recipes.set(k,r);
 for(const d of st.discoveries){unlocked.add(d.id);
  if(!STARTERS.has(d.id))discoveryLedger.set(d.id,{at:new Date().toISOString(),source:d.source,ingredients:[d.a,d.b]});
 }
 if(st.newRecent.length){last=st.newRecent[st.newRecent.length-1];recent=[...new Set([...st.newRecent.reverse(),...recent])].slice(0,350);}
 if(st.source==='trial'){batchTrialUsed=true;saveExtras();}
 slots[1]=null;updateSlotUI();save();updateCounts();updateLatest();rerenderCollections();if(tab==='World')renderDiscoveries();
 const elapsed=Math.round(performance.now()-st.startedAt);
 announceCraft('idle',`Batch complete · ${st.fresh} new · ${st.repeat} repeated · ${st.miss} unmatched`);
 st.elapsedMs=elapsed;st.recipeIndex.clear();st.recipeIndex=null;
 if(st.discoveries.length){st.phase='review';st.reviewIndex=0;showBatchDiscovery();}
 else showBatchSummary();
}
function showBatchDiscovery(){
 const st=batchState;if(!st||st.phase!=='review')return;
 st.viewAll=false;
 const d=st.discoveries[st.reviewIndex],it=byId.get(d.id);
 showModal(`<div class="modal-tag">✦ NEW DISCOVERY · ${st.reviewIndex+1} OF ${st.discoveries.length}</div><div class="modal-art">${staticArt(it)}</div><h2>${escapeText(uiName(it))}</h2><p>${escapeText(uiName(byId.get(d.a)))} + ${escapeText(uiName(byId.get(d.b)))}</p>${(wittyDiscovery(it)||it.summary)?`<p class="discovery-wit">${escapeText(publicText(wittyDiscovery(it)||it.summary))}</p>`:""}<div class="modal-milestone">${st.fresh} new · ${st.repeat} repeated · ${st.miss} no match</div><button type="button" id="batchViewAll" class="modal-button secondary">View All Discoveries (${st.discoveries.length})</button><p class="mini-muted">Close using X to view the next discovery.</p>`);
 $('modal').dataset.dismiss='x-only';
 $('batchViewAll').onclick=showBatchAll;
}
function batchResultRow(d,i){const item=byId.get(d.id);
 return `<div class="batch-discovery-row"><div class="batch-discovery-art">${staticArt(item)}</div><div class="batch-discovery-name"><strong>${escapeText(uiName(item))}</strong><small>${escapeText(uiName(byId.get(d.a)))} + ${escapeText(uiName(byId.get(d.b)))}</small></div><span>${i+1}</span></div>`;
}
function showBatchAll(){
 const st=batchState;if(!st||st.phase!=='review')return;
 st.viewAll=true;
 const large=st.discoveries.length>80;
 const rows=large?`<div class="batch-list-spacer" style="height:${st.discoveries.length*70}px"><div class="batch-list-window" id="batchListWindow"></div></div>`:
  st.discoveries.map(batchResultRow).join('');
 showModal(`<div class="modal-tag">ALL NEW DISCOVERIES</div><h2>${st.discoveries.length} discoveries</h2><p>From ${escapeText(FAMILIES.find(f=>f.id===st.family)?.name||st.family)} · ${st.ids.length.toLocaleString('en-US')} combinations checked</p><div class="batch-discovery-list ${large?'is-virtual':''}" tabindex="0" aria-label="Scroll through all new discoveries">${rows}</div><button type="button" class="modal-button secondary" id="batchBackOne">Back to individual discoveries</button><p class="mini-muted">X closes this list and shows the final summary.</p>`);
 $('modal').dataset.dismiss='x-only';
 $('batchBackOne').onclick=showBatchDiscovery;
 if(large){
  const list=$('modal').querySelector('.batch-discovery-list'),windowEl=$('batchListWindow');
  const render=()=>{const start=Math.max(0,Math.floor(list.scrollTop/70)-5),end=Math.min(st.discoveries.length,start+24);
   windowEl.style.top=`${start*70}px`;
   windowEl.innerHTML=st.discoveries.slice(start,end).map((d,i)=>batchResultRow(d,start+i)).join('');
  };
  list.addEventListener('scroll',render,{passive:true});render();
 }
}
function showBatchSummary(){
 const st=batchState;if(!st)return;
 st.phase='summary';st.viewAll=false;
 showModal(`<div class="modal-tag">BATCH COMPLETE</div><h2>Family checked</h2><p>${st.ids.length} combinations tested with ${escapeText(uiName(byId.get(st.fixed)))}.</p><div class="batch-summary"><span><strong>${st.fresh}</strong>New</span><span><strong>${st.repeat}</strong>Repeated</span><span><strong>${st.miss}</strong>No match</span></div><p class="mini-muted">Your new elements are saved in Discoveries.</p>`);
 $('modal').dataset.dismiss='x-only';
}
$('batchOpen').onclick=batchChooser;

// V33 rewarded Discovery Compass: a complete recipe after an actual SDK reward.
// Only known ingredients qualify. We never reveal the undiscovered output's name.
let compassCursor=0,compassLastTargets=[];
function compassCandidates(){
 const held=leftLocked?slots[0]:null;
 const familyCounts=new Map(FAMILIES.map(f=>[f.id,0]));
 for(const id of unlocked){const it=byId.get(id);if(it)familyCounts.set(familyFor(it),(familyCounts.get(familyFor(it))||0)+1);}
 const candidates=new Map();
 for(const [key,out] of recipes){
  if(unlocked.has(out))continue;
  const [a,b]=key.split('|');if(!unlocked.has(a)||!unlocked.has(b)||!byId.has(out))continue;
  const family=familyFor(byId.get(out)),depth=routeDepth.get(out)||99;
  // Prefer coherent nearby branches and a locked ingredient without forcing it.
  const score=(held&&(held===a||held===b)?65:0)+Math.max(0,14-depth*2)+
   (['games','anime'].includes(family)?5:0)+
   (familyCounts.get(family)===0?9:Math.max(0,7-Math.floor((familyCounts.get(family)||0)/10)));
  const prev=candidates.get(out);
  if(!prev||score>prev.score)candidates.set(out,{a,b,out,family,score});
 }
 return [...candidates.values()].sort((a,b)=>b.score-a.score||a.out.localeCompare(b.out));
}
async function hint(){
 const ready=compassCandidates();
 const unseenReady=ready.filter(c=>hintState.clues[c.out]!=='recipe');
 const all=unseenReady.length?unseenReady:ready;
 if(!all.length){toast('No immediately craftable discoveries · Explore a new family','repeat');return;}
 const unseen=all.filter(c=>!compassLastTargets.includes(c.out));
 const pool=unseen.length?unseen:all;
 const item=pool[compassCursor%Math.min(pool.length,12)];compassCursor++;
 compassLastTargets=[item.out,...compassLastTargets.filter(id=>id!==item.out)].slice(0,12);
 // V33: one tap requests one rewarded ad, then reveals the entire pair.
 // A previously revealed recipe can be shown again without another ad.
 if(hintState.clues[item.out]==='recipe'){showCompassRevealed(item);return;}
 if(await earnRecipeByAd(item.out,item.family))showCompassRevealed(item);
}
function showCompassRevealed(item){
 const fam=FAMILIES.find(f=>f.id===item.family)?.name||'Discoveries';
 showModal(`<div class="modal-tag">✧ RECIPE REVEALED</div><h2>${escapeText(fam)}</h2><div class="compass-recipe"><strong>${escapeText(uiName(byId.get(item.a)))}</strong><span>+</span><strong>${escapeText(uiName(byId.get(item.b)))}</strong></div><p>The result is still a mystery until you craft it.</p><button class="modal-button" id="compassTry">Try combination</button>`);
 $('modal').dataset.dismiss='x-only';
 $('compassTry').onclick=()=>{closeModal();switchTab('Play');selectForHint(item.a,item.b);};
}
$('compassBtn').onclick=hint;
// Immediate drag from icon only, based on the proven V1/V2/V5 pointer-capture flow.
let dragging=null;
function clearDrag(){if(dragging?.art?.hasPointerCapture?.(dragging.pointer))try{dragging.art.releasePointerCapture(dragging.pointer);}catch{} dragging=null;$('dragGhost').hidden=true;document.querySelectorAll('.craft-slot').forEach(x=>x.classList.remove('drop-target'));}
// V104: long press an element in Alchemy opens its description (same sheet as the Collection).
// V107: a slow tap must never be read as a long press (it opened the element sheet instead of combining):
// 700 ms hold, a ring fills on the chip from 200 ms so the long press is a clear, separate gesture.
let longPress=null;const cancelLong=()=>{if(longPress){clearTimeout(longPress.t);clearTimeout(longPress.h);longPress.c?.classList.remove('is-holding');longPress=null;}};
for(const v of [playVirtual]){
 const root=v.root;
 root.addEventListener('contextmenu',e=>{if(e.target.closest('.element-chip'))e.preventDefault();});
 root.addEventListener('pointerdown',e=>{const c=e.target.closest('.element-chip');if(c&&!(e.pointerType==='mouse'&&e.button!==0)){cancelLong();const id=c.dataset.id,x=e.clientX,y=e.clientY;longPress={x,y,c,h:setTimeout(()=>{if(longPress&&!dragging?.active)c.classList.add('is-holding');},200),t:setTimeout(()=>{c.classList.remove('is-holding');longPress=null;if(dragging?.active)return;clearDrag();v.dragEnded=Date.now();navigator.vibrate?.(12);elementInfo(id);},700)};}},true);
 root.addEventListener('pointermove',e=>{if(longPress&&Math.hypot(e.clientX-longPress.x,e.clientY-longPress.y)>9)cancelLong();},true);
 root.addEventListener('pointerup',cancelLong,true);root.addEventListener('pointercancel',cancelLong,true);
 root.addEventListener('pointerdown',e=>{const art=e.target.closest('.chip-art'),card=e.target.closest('.element-chip');if(!art||!card|| (e.pointerType==='mouse'&&e.button!==0))return;dragging={id:card.dataset.id,pointer:e.pointerId,x:e.clientX,y:e.clientY,active:false,art,view:v};art.setPointerCapture(e.pointerId);});
 root.addEventListener('pointermove',e=>{if(!dragging||dragging.pointer!==e.pointerId)return;if(!dragging.active&&Math.hypot(e.clientX-dragging.x,e.clientY-dragging.y)>9){dragging.active=true;if(tab!=='Play')switchTab('Play');$('dragGhost').innerHTML=staticArt(byId.get(dragging.id));$('dragGhost').hidden=false;}
  if(dragging.active){e.preventDefault();$('dragGhost').style.left=e.clientX+'px';$('dragGhost').style.top=e.clientY+'px';const under=document.elementFromPoint(e.clientX,e.clientY),target=under?.closest('.craft-slot');document.querySelectorAll('.craft-slot').forEach(el=>el.classList.toggle('drop-target',el===target));}
 });
 root.addEventListener('pointerup',e=>{if(!dragging||dragging.pointer!==e.pointerId)return;const {id,active,view}=dragging;clearDrag();view.dragEnded=Date.now();if(active){if(companions.hitTest(e.clientX,e.clientY)){companions.feed(id);return;}const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.craft-slot');if(target){pulseSelectedElement(id);place(Number(target.id.slice(-1)),id);}else toast('Drop onto a craft slot or your companion','error');}else insertDirect(id);});
 root.addEventListener('pointercancel',clearDrag);
}
// V28: on-screen keyboards must never hide matching results. Collapse the workspace
// while either search field is focused and size the app to the visual viewport.
function syncKeyboardViewport(){
 const focused=document.activeElement;
 const active=focused=== $('playSearch')||focused===$('discoverSearch');
 document.body.classList.toggle('keyboard-open',active);
 const vv=window.visualViewport;
 $('app').style.height=active&&vv?`${Math.round(vv.height)}px`:'';
 if(active){(focused===$('playSearch')?$('inventoryScroll'):$('discoverScroll')).scrollTop=0;}
}
for(const field of [$('playSearch'),$('discoverSearch')]){
 field.addEventListener('focus',()=>{syncKeyboardViewport();requestAnimationFrame(syncKeyboardViewport);});
 field.addEventListener('blur',()=>setTimeout(syncKeyboardViewport,120));
}
window.visualViewport?.addEventListener('resize',syncKeyboardViewport);
$('slot0').onclick=()=>{if(batchState?.phase==='scanning')return;slots[0]=null;clearTimeout(autoTimer);updateSlotUI();};$('slot1').onclick=()=>{if(batchState?.phase==='scanning')return;slots[1]=null;clearTimeout(autoTimer);updateSlotUI();};$('lockLeft').onclick=()=>{if(batchState?.phase==='scanning')return;leftLocked=!leftLocked;updateSlotUI();};
// WebAudio needs user interaction on mobile; never play sound on page load.
function syncSoundToggle(){const button=$('settingsSoundToggle');if(!button)return;button.setAttribute('aria-pressed',String(soundEnabled));button.setAttribute('aria-label',soundEnabled?'Mute sound effects':'Enable sound effects');button.textContent=soundEnabled?'On':'Off';}
function toggleSoundEnabled(){soundEnabled=!soundEnabled;try{localStorage.setItem(SOUND_KEY,soundEnabled?'on':'off');}catch{}syncSoundToggle();if(soundEnabled){acquireSoundEngine();soundForResult('repeat');}}
document.addEventListener('pointerdown',()=>{if(soundEnabled)acquireSoundEngine();},{passive:true});
// V84: the search field is always visible; the trailing button clears it.
function setSearchOpen(open){
 const toolbar=$('shelfToolbar'),field=$('playSearch'),toggle=$('searchToggle');
 toolbar.classList.toggle('search-open',open);
 if(open){field.focus();return;}
 field.value='';playQuery='';toggle.hidden=true;field.blur();syncKeyboardViewport();playVirtual.refresh({resetScroll:true});
}
$('searchToggle').onclick=()=>setSearchOpen(false);
$('playSearch').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();setSearchOpen(false);}});
$('playSearch').oninput=e=>{playQuery=e.target.value;$('searchToggle').hidden=!playQuery;playVirtual.refresh({resetScroll:true});};
// V55: touch-friendly in-game Sort chooser (no native Android <select>).
// V83: the same sheet also filters (still open / completed / saved) and sets density.
function syncInventoryButton(){const b=$('recentBtn');if(!b)return;b.dataset.sort=sortChoice;b.dataset.filtered=String(inventoryShow!=='all');
 const label={az:'A–Z',old:'Oldest first',new:'Newest first'}[sortChoice];
 b.textContent=label;b.setAttribute('aria-label','Sort elements: '+label);
 document.querySelectorAll('[data-show-chip]').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.showChip===inventoryShow)));}
document.querySelectorAll('[data-show-chip]').forEach(c=>c.onclick=()=>{inventoryShow=c.dataset.showChip;saveInventoryView();syncInventoryButton();playVirtual.refresh({resetScroll:true});});
function openInventorySorter(){
 const order=[['az','A–Z','Alphabetical order'],['old','Old first','Earliest discoveries first'],['new','New first','Latest discoveries first']];
 const show=[['all','All'],['open','To explore'],['done','Completed ★'],['saved','Saved']];
 const view=[['normal','Normal'],['compact','Compact']];
 const orderHtml=order.map(([id,title,subtitle])=>`<button class="sort-option" type="button" data-sort-option="${id}" aria-pressed="${sortChoice===id}"><span class="sort-option-content"><strong>${title}</strong><small>${subtitle}</small></span><span class="sort-choice-mark" aria-hidden="true">${sortChoice===id?'✓':''}</span></button>`).join('');
 const seg=(name,list,cur)=>`<div class="sort-segment" role="group" aria-label="${name}">${list.map(([id,label])=>`<button type="button" data-${name}-option="${id}" aria-pressed="${cur===id}">${label}</button>`).join('')}</div>`;
 showModal(`<div class="modal-tag">ELEMENTS</div><h2>Sort</h2><div class="sort-choices" role="group" aria-label="Sort inventory">${orderHtml}</div><div class="sort-section-title">Show</div>${seg('show',show,inventoryShow)}<p class="sort-hint">To explore: elements that still make something new. ★ Completed: nothing left to discover with them.</p><div class="sort-section-title">List size</div>${seg('density',view,inventoryDensity)}`);
 $('recentBtn').setAttribute('aria-expanded','true');
 const content=$('modalContent');
 const refresh=()=>{syncInventoryButton();playVirtual.refresh({resetScroll:true});};
 content.querySelectorAll('[data-sort-option]').forEach(button=>button.onclick=()=>{
  sortChoice=button.dataset.sortOption;
  try{localStorage.setItem(SORT_KEY,sortChoice);}catch{}
  closeModal();refresh();
 });
 content.querySelectorAll('[data-show-option]').forEach(button=>button.onclick=()=>{
  inventoryShow=button.dataset.showOption;saveInventoryView();
  content.querySelectorAll('[data-show-option]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refresh();
 });
 content.querySelectorAll('[data-density-option]').forEach(button=>button.onclick=()=>{
  inventoryDensity=button.dataset.densityOption;saveInventoryView();
  content.querySelectorAll('[data-density-option]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refresh();
 });
}
syncInventoryButton();
$('recentBtn').onclick=openInventorySorter;
// V29.2: use the illustrated in-game family selector for inventory filters.
// Unlike <select>, this does not launch Android's native dark full-screen picker.
function openInventoryFamilyPicker(){
  if(currentMode==='family'){toast('Family Only stays inside your chosen family');return;}
  $('playSearch').blur();
  const counts=new Map(FAMILIES.map(f=>[f.id,0]));
  for(const id of unlocked){const it=byId.get(id);if(!it)continue;const family=familyFor(it);counts.set(family,(counts.get(family)||0)+1);}
  const iconHtml=f=>familyCardArtwork(f);
  const allIcons=['game_case','console','anime_hero'].map(k=>GAMEVERSE_ART[k]
    ?`<img src="${GAMEVERSE_ART[k]}" decoding="async" alt="">`:'').join('');
  const choices=[`<button type="button" class="batch-family-choice" data-inventory-family="all" aria-pressed="${playFamily==='all'}"><span class="batch-family-picture"><span class="all-family-mosaic" aria-hidden="true">${allIcons}</span></span><span class="batch-family-data"><strong>All families</strong><small>${unlocked.size.toLocaleString('en-US')} elements collected</small></span></button>`,
    ...FAMILIES.map(f=>`<button type="button" class="batch-family-choice" data-inventory-family="${f.id}" aria-pressed="${f.id===playFamily}"><span class="batch-family-picture">${iconHtml(f)}</span><span class="batch-family-data"><strong>${escapeText(f.name)}</strong><small>${(counts.get(f.id)||0).toLocaleString('en-US')} discovered</small></span></button>`)].join('');
  showModal(`<div class="modal-tag">ELEMENT FILTER</div><h2>Choose a family</h2><p class="inventory-family-info">Show elements from one family or browse everything.</p><div class="batch-family-grid inventory-family-grid" role="group" aria-label="Filter collected elements by family">${choices}</div>`);
  $('playFamily').setAttribute('aria-expanded','true');
  $('modalContent').querySelectorAll('[data-inventory-family]').forEach(button=>{
    button.addEventListener('click',()=>{
      const selected=button.dataset.inventoryFamily;
      playFamily=selected;
      $('playFamilyLabel').textContent=selected==='all'?'All families':FAMILIES.find(f=>f.id===selected)?.name||'All families';
      $('playFamily').setAttribute('aria-expanded','false');
      closeModal();
      playVirtual.refresh({resetScroll:true});
    });
  });
}
$('playFamily').onclick=openInventoryFamilyPicker;
$('settingsBtn').onclick=settings;
$('modeBtn').onclick=()=>modePicker(false);
$('modalClose').onclick=closeModal;$('modal').onclick=e=>{if(e.target===$('modal')&&$('modal').dataset.dismiss!=='x-only')closeModal();};
$('familiesGrid').onclick=e=>{const el=e.target.closest('button[data-family]');if(el)openFamily(el.dataset.family);};
// V88: Themed collections removed from the Collection tab (owner: obsolete). Data stays for old saves.
if($('thematicSets'))$('thematicSets').onclick=e=>{const el=e.target.closest('[data-set]'),s=COLLECTION_SETS.find(s=>s.id===el?.dataset.set);if(!s)return;
 openFamily(s.family);activeSet=s.id;renderDiscoveries();};
$('familyBack').onclick=closeFamily;
$('familyHint').onclick=unlockInFamily;
$('mergeClassicBtn').onclick=mergeHub;
if($('playMergeBtn'))$('playMergeBtn').onclick=mergeHub;
refreshMonetizedLabels();void refreshBilling();
try{billingBridge()?.addListener?.('billingChanged',applyBillingStatus);}catch{}
setInterval(()=>{if(adFree())refreshMonetizedLabels();},60000);
$('discoverSearch').oninput=e=>{discoverQuery=e.target.value;$('discoverScroll').scrollTop=0;discoverVirtual.refresh();};
$('discoverScroll').addEventListener('pointerdown',e=>e.stopPropagation());
document.querySelectorAll('[data-dscope]').forEach(btn=>btn.onclick=()=>{discoveryScope=btn.dataset.dscope;document.querySelectorAll('[data-dscope]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});$('discoverScroll').scrollTop=0;discoverVirtual.refresh();});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.view));
updateCounts();updateSlotUI();updateLatest();rerenderCollections();switchTab('Play');
classicSnapshot=snapshotPlayState();
try{const preferred=JSON.parse(localStorage.getItem(MODE_SELECTION_KEY)||'null');if(preferred?.mode==='family'&&familyCampaigns.has(canonicalFamilyId(preferred.family)))activateMode('family',canonicalFamilyId(preferred.family));else if(!preferred)modePicker(true);}catch{modePicker(true);}
syncModeButton();
companions.start();companions.syncSeen();syncGamesTab();
setTimeout(checkIdleFinds,1200);setInterval(idleTouch,60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')idleTouch();else setTimeout(checkIdleFinds,600);});
// V19 Offline Edition: intentionally no automatic API connection.

// Global inbox polling is deliberately throttled: one request for ALL pending pairs,
// only on a visible active game, and never more than once every 90 seconds.
setInterval(()=>{if(apiBase&&sessionToken&&pendingCount>0&&document.visibilityState==='visible'&&Date.now()-lastPendingCheck>90000)refreshPending(true);},30000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&apiBase&&sessionToken&&Date.now()-lastPendingCheck>90000)refreshPending(true);});
