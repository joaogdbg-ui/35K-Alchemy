import {EMOJI_ATLAS} from "./emoji-atlas.js";
/* Static vector catalog, adapted from the established V9.1 artwork.
 * All generated icons are static: no frame changes or CSS animation.
 * AI-generated art, when approved, replaces these placeholders by icon_url. */
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ITEMS=[];
export function setIconCatalog(items){ITEMS=items;}
const CATS={nature:'Nature',material:'Materials',life:'Life',science:'Science',culture:'Culture',concept:'Ideas',technology:'Technology',accessory:'Accessories',brand:'Brands',console:'Consoles',portable:'Handhelds',computer:'Computers',arcade:'Arcades',board:'Board Games',genre:'Genres',game:'Video Games'};
const COLORS={nature:['#67d8fa','#9ff4dd'],material:['#efbb8b','#ed8967'],life:['#9beb7f','#55d5ae'],science:['#ffdb6f','#8fdbff'],culture:['#ffd28f','#ffa1a3'],concept:['#bf9fff','#74f3f0'],technology:['#5fd1e8','#b7b0ff'],accessory:['#e3b5f6','#9dccfa'],brand:['#ffd68c','#ff91b8'],console:['#abb9ff','#6ecfff'],portable:['#a0dbff','#99eab8'],computer:['#76dffa','#c6b9fd'],arcade:['#fda6cf','#fac67f'],board:['#ead18e','#b9a1e6'],genre:['#d3a8fb','#65e7d3'],game:['#8cc7ff','#f59ab7']};
const hash=s=>{let h=2166136261;for(const ch of s){h=Math.imul(h^ch.charCodeAt(0),16777619);}return h>>>0;};
const rect=(x,y,w,h,r,fill,stroke='',sw=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="${sw}"`:''}/>`;
const circ=(x,y,r,fill,stroke='',sw=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="${sw}"`:''}/>`;
const path=(d,fill,stroke='',sw=1)=>`<path d="${d}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`:''}/>`;
const line=(x,y,x2,y2,col,w=2)=>`<path d="M${x} ${y} ${x2} ${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const txt=(x,y,t,size=7,col='#fff',weight=800)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${col}" font-size="${size}" font-weight="${weight}" font-family="Arial,sans-serif" letter-spacing=".2">${escapeText(t)}</text>`;
const shape=(d,fill,outline='#1a2847',w=3)=>path(d,fill,outline,w);
function controls(x=0,y=0,s=1,col='#172135'){return `<g transform="translate(${x} ${y}) scale(${s})">${rect(0,7,20,5,1,col)}${rect(7,0,5,20,1,col)}${circ(37,8,4,'#e97691')}${circ(45,16,4,'#79bdeb')}</g>`;}
function pixelScene(h,a,b,motif=''){
 const px=(x,y,w,hh,color)=>rect(x,y,w,hh,0,color);let body='',v=h%13;
 let sky=rect(0,0,68,60,3,'#182b50');for(let i=0;i<8;i++)sky+=circ(3+((h>>((i*3)%24))%62),4+((h>>((i*2+2)%25))%25),.6+(i%2)*.55,'#ffffffb0');
 if(/mario|platform|sonic|kirby|yoshi|celeste|banjo|donkey|crash|spyro|adventure|rayman/i.test(motif)||v===0){body=path('M0 48 16 43 30 48 38 38 50 47 68 41v19H0Z','#4e995b')+rect(4,34,16,16,2,'#b47e55')+rect(4,31,16,4,0,'#70d17b')+rect(39,25,18,6,2,'#c9ac69')+circ(33,28,7,a)+rect(28,33,9,10,1,b)+circ(34,25,1.5,'#fff');}
 else if(/pokemon|pikachu|monster|pocket/i.test(motif)||v===1){body=circ(35,31,20,'#f9faf4','#202a3c',2)+path('M16 31h38v3H16z','#262c44')+path('M16 31a20 20 0 0 1 38 0z','#ef5e74')+circ(35,33,7,'#f4f2e8','#2b3650',2)+circ(35,33,3,'#6ba4cf')+circ(58,10,3,'#fbcc79');}
 else if(/space|halo|metroid|star|naves|alien|mass effect|no man's|r-type|raiden|gradius|doom|dead space|asteroids|galax/i.test(motif)||v===2){body=circ(54,17,12,'#6f75b7')+path('M15 40 34 7 52 42 34 33Z',a)+path('M28 31 21 51 32 45 42 52 38 32Z','#f0ba8a')+circ(33,24,5,'#b8ecf3');}
 else if(/racing|race|kart|car|forza|rally|taxi|daytona|gran turismo|wipeout|ridge|out run/i.test(motif)||v===3){body=path('M0 60 18 30h34l16 30z','#3e4b69')+line(35,31,35,59,'#fff4ae',2)+path('M9 33 20 20h27l12 13Z',a)+rect(12,33,46,17,5,b)+rect(24,25,22,10,3,'#a2dff5')+circ(19,50,7,'#19243a','#bac6d0',2)+circ(51,50,7,'#19243a','#bac6d0',2);}
 else if(/tetris|puzzle|portal|blocks|minecraft|terraria|2048|columns|candy|patchwork/i.test(motif)||v===4){for(let i=0;i<13;i++)body+=rect(7+(i%5)*11,8+Math.floor(i/5)*14,10,12,1,[a,b,'#ffc65f','#93eaca','#eaa2ed'][i%5]);}
 else if(/fight|fighter|mortal|tekken|war|street|combat|metal slug|samurai|ninja|sword|sekiro|hades|elden|zelda|hero|assassin|shodown/i.test(motif)||v===5){body=path('M0 54 18 43 29 50 42 35 68 52V60H0Z','#586489')+path('M19 43 17 19 28 13 41 27 40 51z',a)+path('M33 17 36 2 41 17 38 44Z','#d6e7fc','#5d7eab',2)+circ(24,13,8,b);}
 else if(/horror|resident|silent|zombie|dead|blood|night|dark|last of/i.test(motif)||v===6){body=circ(49,17,12,'#ffe6c9')+path('M0 53 11 39 22 48 37 24 53 52 68 37v23H0Z','#31334c')+rect(16,24,18,32,5,'#111e31')+circ(21,39,1.8,'#fc6680')+circ(29,39,1.8,'#fc6680');}
 else if(/farm|animal|wild|stardew|crossing|wingspan|nature|forest|monster|pikmin/i.test(motif)||v===7){body=path('M0 48 20 34l13 11 16-14 19 15v14H0Z','#437e5d')+rect(43,28,7,26,1,'#9c755a')+path('M28 33 46 3 63 34Z','#61d39a')+rect(9,37,19,17,3,'#f0c08f')+path('M6 37 19 25 32 37Z','#ed8293');}
 else if(/music|dance|rhythm|guitar|beat|parappa|patapon/i.test(motif)||v===8){body=circ(23,36,13,b)+circ(48,38,12,a)+path('M46 8v35M46 9l15-5v11l-15 6','none','#f7f2e4',3)+circ(41,44,6,'#e4e2ff')+circ(62,31,6,'#e4e2ff');}
 else if(/football|sport|fifa|nba|tennis|golf|wii fit|skate/i.test(motif)||v===9){body=path('M0 47Q30 25 68 47v13H0Z','#378264')+circ(35,30,17,'#eee7db')+path('M35 20 43 24 42 34 32 39 25 31 27 24z','#293248');}
 else if(/city|sim|skylines|cyberpunk|gta|theft|sims/i.test(motif)||v===10){body=rect(0,48,68,12,0,'#343c56')+rect(7,23,14,34,1,'#506c8d')+rect(24,11,18,46,1,a)+rect(45,23,19,34,1,b)+Array.from({length:9},(_,i)=>rect(28+(i%3)*5,18+Math.floor(i/3)*10,2,4,0,'#fff1a5')).join('');}
 else if(/chess|strategy|age of|civilization|empire|warcraft/i.test(motif)||v===11){body=rect(0,49,68,12,0,'#334569')+path('M26 51 28 32 20 27 25 12 39 12 46 29 38 34 42 51Z',a)+rect(18,48,33,6,1,'#e7be8e')+circ(29,9,5,b);}
 else{body=path('M0 54 17 44l17 7 15-12 19 13v8H0Z','#4c4275')+circ(35,27,18,a)+path('M35 10 44 27 35 43 26 27Z',b)+circ(35,27,5,'#fdf3d3');}
 return sky+body;
}
function gamingArt(id){const it=ITEMS[id],n=it.name,c=it.category,h=hash(n),colors=COLORS[c],a=colors[h%2],b=colors[1-h%2];let g='';
 if(c==='portable'){
  const folded=/Nintendo DS|Nintendo 3DS|Nintendo DSi|Game Boy Advance SP|New Nintendo|2DS XL/i.test(n);
  const wide=/Switch|Steam Deck|ROG|Legion|PSP|PS Vita|Lynx|Game Gear|Neo Geo Pocket|WonderSwan|SwanCrystal|GBA|Advance(?! SP)|GP|Nomad|TurboExpress|Zodiac|Evercade|Portal/i.test(n);
  let shell=/Game Boy(?! Color|Advance)/.test(n)?'#c7c9ad':/Game Boy Color/.test(n)?'#957cbb':/Atari Lynx/.test(n)?'#373b47':/Game Gear/.test(n)?'#2b354a':/Neo Geo Pocket/.test(n)?'#5b7180':/PSP|Vita|Deck/.test(n)?'#2f354a':/Switch/.test(n)?'#282e43':/DS|3DS/.test(n)?'#c8d5ea':/Advance/.test(n)?'#aa92dd':/Playdate/.test(n)?'#f1ce60':h%2?'#57738d':'#b7c5d2';
  if(folded){g=rect(17,7,66,40,8,shell,'#182b4b',3)+rect(25,13,50,28,3,'#203950')+rect(30,17,40,19,1,'#64b5d1')+rect(16,47,68,42,8,shell,'#172d4e',3)+rect(33,53,33,26,3,'#223d58')+rect(36,55,28,19,1,a)+controls(21,64,.26)+circ(73,68,3,'#ff8caf')+line(20,46,82,46,'#ffffff8c',2);}
  else if(wide){g=rect(5,27,90,48,17,shell,'#7586a5',2)+rect(23,30,53,42,5,'#0b1d36')+rect(28,35,43,31,2,'#32678f')+pixelScene(h,a,b,n).replace(/<rect x="0" y="0"[^>]+>/,'')+controls(9,46,.26)+circ(82,47,4,'#ee8098')+circ(87,57,3,a);if(/Switch/.test(n)){g+=rect(5,27,16,48,10,'#69c7e7')+rect(79,27,16,48,10,'#fb777d')+circ(13,47,5,'#202c44')+circ(86,60,5,'#202c44')}if(/Lynx/.test(n))g+=rect(27,34,45,34,4,'#1d303e','#b7ada1',2);}
  else{g=rect(22,5,55,90,12,shell,'#273953',3)+rect(29,15,41,45,7,'#273f54')+rect(34,20,31,34,2,/Color/.test(n)?'#6cbdc1':'#acc597')+path('M35 48 49 30l15 18z','#698c86')+rect(35,69,15,5,1,'#2e4456')+rect(40,64,5,15,1,'#2e4456')+circ(62,70,5,'#ae4f88')+circ(70,78,4,'#ae4f88')+line(48,87,65,87,'#374b62',2);}
  // Model-specific silhouettes: the old revisions are not just recolored clones.
  if(/Game Boy Micro/i.test(n))g=rect(4,34,92,35,16,'#a9aab9','#485c7a',3)+rect(29,37,42,29,4,'#223c55')+rect(33,41,34,21,1,'#92d8ae')+controls(10,42,.26)+circ(83,48,4,'#ea6d8f')+circ(88,57,3,'#6da5db');
  if(/Game Boy Pocket/i.test(n))g=rect(29,4,43,90,8,'#bbc2c7','#41566d',2)+rect(33,12,36,46,5,'#343d48')+rect(37,17,28,31,2,'#a9ba9a')+rect(35,69,13,4,1,'#313f50')+rect(40,64,4,13,1,'#313f50')+circ(60,68,5,'#40375a')+circ(66,77,3,'#40375a');
  if(/Game Boy Light/i.test(n))g=rect(25,6,50,89,12,'#c9c098','#8c7e61',3)+rect(30,14,40,46,6,'#304d57')+rect(33,19,34,35,3,'#c8edb9')+path('M39 45 49 27 61 45Z','#57958c')+rect(36,70,14,5,1,'#625f53')+rect(40,65,5,16,1,'#625f53')+circ(62,69,5,'#884c69')+circ(69,79,3,'#884c69')+circ(65,15,2,'#fff8c6');
  if(/Game Boy Color/i.test(n))g+=circ(31,65,2,'#f4da7c')+circ(71,43,2,'#93e0cd')+rect(37,88,19,2,1,'#d9c7f8');
 }
 else if(c==='console'){
  const shell=/NES|Famicom|PlayStation(?! 2|3|4|5)|PS one|Dreamcast/i.test(n)?'#cbd6d8':/SNES|Super Famicom/.test(n)?'#b7bbd1':/Mega Drive|Genesis|Neo Geo|Xbox|Saturn/.test(n)?'#252b3d':/PlayStation 5|PS5/.test(n)?'#e5efff':/PlayStation [234]|PS[234]/.test(n)?'#273147':/GameCube/.test(n)?'#7372c7':'#74879a';
  if(/PlayStation 5|PS5/i.test(n))g=path('M20 9 31 15V80L20 90Z','#e5effe')+path('M80 9 69 15v65L80 90Z','#e5effe')+rect(31,15,38,65,2,'#273046')+line(35,22,35,73,'#71baf5',2)+line(65,22,65,73,'#71baf5',2);
  else if(/PlayStation 2|PS2/i.test(n))g=rect(20,21,60,60,4,shell,'#506c92',3)+Array.from({length:8},(_,i)=>line(28,27+i*5,72,27+i*5,'#394961',1.5)).join('')+rect(31,22,4,56,0,'#5a91d4');
  else if(/Xbox Series X/i.test(n))g=rect(32,8,37,82,5,'#1d2a31','#526f6f',2)+Array.from({length:24},(_,i)=>circ(40+(i%4)*8,18+Math.floor(i/4)*8,2,'#53746d')).join('')+circ(61,76,4,'#86da81');
  else if(/GameCube/i.test(n))g=rect(18,24,65,53,10,shell,'#30265b',3)+rect(29,12,44,18,4,'#a299f9')+circ(50,49,18,'#a0a1df')+circ(50,49,7,'#7168b1')+rect(28,70,43,7,2,'#29244c');
  else if(/Wii/i.test(n))g=rect(28,14,45,74,6,/Mini/.test(n)?'#ed7685':'#e1e8ec','#6b849e',2)+rect(36,22,27,5,2,'#7ac7e8')+rect(35,72,30,5,2,'#788da7');
  else if(/Dreamcast/i.test(n))g=rect(11,28,78,45,10,shell,'#738fa3',2)+circ(50,47,17,'#f1ece3','#abb5b7',3)+circ(50,47,6,'#ea8e6d')+rect(25,65,48,3,0,'#758a98');
  else if(/Atari 2600/i.test(n))g=rect(7,29,86,46,10,'#2d3037','#ad9d84',3)+rect(8,35,82,10,0,'#926146')+Array.from({length:4},(_,i)=>rect(16+i*13,49,9,4,2,'#44424b')).join('')+rect(37,63,27,5,1,'#797e82');
  else if(/Atari 5200/i.test(n))g=rect(5,33,90,42,13,'#252e36','#788899',3)+path('M16 40h68M16 44h68','none','#424f58',2)+rect(35,58,30,6,2,'#788792')+circ(13,64,2,'#ec969d');
  else if(/Atari 7800/i.test(n))g=rect(6,37,88,36,10,'#292d35','#8392a2',3)+rect(10,39,80,5,2,'#969b9e')+rect(16,49,68,4,2,'#3a424b')+rect(38,62,30,4,2,'#728b9c');
  else if(/Atari VCS/i.test(n))g=rect(7,31,86,41,11,'#262f3a','#8594a7',2)+rect(12,32,76,11,4,'#b68464')+rect(18,49,64,4,2,'#3e4a53')+circ(77,62,3,'#80d7af');
  else if(/Atari Jaguar CD/i.test(n))g=rect(13,29,75,50,13,'#343743','#65768b',2)+circ(51,37,18,'#555967','#a4adba',2)+circ(51,37,7,'#313b46')+rect(25,66,50,7,3,'#232e3a');
  else if(/Atari Jaguar/i.test(n))g=path('M14 50q-4-20 20-22h35q23 2 18 22l-8 28H24Z','#30343f','#8793a7',3)+rect(25,43,50,15,7,'#4f5463')+rect(35,64,31,6,3,'#1f2735');
  else if(/Atari XE|Atari XEGS/i.test(n))g=rect(10,32,80,42,6,'#d7d2c5','#586c8b',3)+rect(16,39,68,15,2,'#708caa')+rect(20,60,60,5,1,'#929491');
  else if(/Neo Geo Mini/i.test(n))g=path('M27 9h47l6 16-5 61H23l-3-61Z','#c6d9e0','#334b6a',3)+rect(31,13,39,11,2,'#243d5c')+txt(50,21,'NEO',7,'#ffb8c0')+rect(33,30,34,27,2,'#253f5e')+rect(39,37,22,14,1,a)+circ(54,63,5,'#e9a5c8')+circ(66,65,3,'#72cfee');
  else if(/Neo Geo CD/i.test(n))g=rect(8,25,84,52,11,'#3a4558','#8c9eae',3)+circ(51,49,22,'#4b5364','#a0aebb',2)+circ(51,49,14,'#232b3b')+circ(51,49,5,'#6c778d')+rect(24,68,50,4,2,'#7d929c');
  else if(/Neo Geo AES/i.test(n))g=rect(7,29,86,49,15,'#272b35','#6b7d90',3)+rect(28,34,47,29,7,'#1d2535')+rect(36,39,31,15,4,'#434857')+rect(27,65,49,4,2,'#7d8189')+circ(18,67,3,'#edb6aa');
  else if(/Nintendo 64|N64/i.test(n))g=path('M17 42Q10 29 24 23h52Q90 30 83 42L78 76H23Z','#66777f','#293e5a',3)+circ(50,45,20,'#929eb2')+circ(50,45,11,'#273e58')+rect(25,67,51,4,2,'#536f91');
  else if(/Mega Drive|Genesis|Saturn|Neo Geo/i.test(n))g=rect(7,30,86,45,12,shell,'#768599',2)+circ(50,49,21,'#1c2331','#546a85',3)+circ(50,49,12,'#3b4357')+rect(29,62,44,4,2,'#abb6c3');
  else{g=rect(7,33,86,43,9,shell,'#637b91',2)+rect(19,39,62,25,6,'#8499aa')+rect(30,45,40,11,2,'#2c465a')+rect(34,65,32,4,1,'#df7e98')+circ(17,66,3,'#ffc48c')+circ(82,66,3,a);}
  const sig=n.match(/(NES|SNES|N64|PS[1-5]|XBOX|WII|SEGA|ATARI)/i);if(sig)g+=txt(50,88,sig[0].slice(0,5).toUpperCase(),7.2,'#e6efff');
 }
 else if(c==='arcade'){
  g=path('M27 5h47l8 18-5 63H21l-3-63z',h%2?'#614c8c':'#854662','#1b273a',3)+rect(26,8,51,16,3,'#192c4b')+rect(30,11,44,10,2,a)+txt(52,18,n.replace(/\(arcade\)/i,'').slice(0,6).toUpperCase(),7,'#202d45')+path('M28 29h47l-6 30H34z','#0a1a2e')+rect(36,32,36,23,3,'#163c60')+rect(40,36,28,16,2,b)+circ(54,44,5,a)+path('M22 62h56l-8 12H29z','#1d2f4e')+line(43,63,43,70,'#e9f2fa',2)+circ(43,62,4,'#fa8aa1')+circ(59,68,3,a)+circ(68,68,3,b)+rect(35,77,30,9,2,'#293d5a');
 }
 else if(c==='board'){
  g=rect(12,11,76,76,8,'#966d4c','#f0d8a7',2)+rect(17,16,66,66,3,'#f0d8b1');
  if(/chess|checkers|draughts/i.test(n)){for(let i=0;i<8;i++)for(let j=0;j<8;j++)if((i+j)%2)g+=rect(18+i*8,17+j*8,8,8,0,'#715a5f');g+=path('M41 59l4-25-5-8 10-10 10 10-5 8 4 25Z','#e9d7bd','#3a3643',2)+rect(37,58,27,9,2,'#f6cda7');}
  else if(/poker|uno|card|solitaire|magic|tcg|balatro/i.test(n)){g=rect(27,25,33,46,4,'#fbf4e6','#8a6273',2)+rect(42,31,31,46,4,'#ffebd6','#9e6c68',2)+txt(56,60,['A','♠','7','♥'][h%4],26,'#d5546c');}
  else if(/dice|ludo|monopoly|goose|sorry/i.test(n)){g=rect(22,22,55,55,4,'#adcd92')+rect(35,30,32,32,2,'#fff1d2','#78664b',1)+circ(43,39,4,'#ce6b7a')+circ(59,54,4,'#5368a2')+circ(54,39,3,'#5368a2');}
  else if(/domino/i.test(n)){g=rect(29,18,43,65,6,'#f6efe6','#383b4c',3)+line(29,50,72,50,'#414455',2)+circ(43,34,4,'#343b49')+circ(58,66,4,'#343b49')+circ(40,68,4,'#343b49');}
  else {for(let i=0;i<6;i++)for(let j=0;j<6;j++)if((i+j+(h%3))%2)g+=rect(19+i*10,18+j*10,10,10,0,h%2?'#765d56':'#81a9a1');g+=circ(34,42,8,a,'#2b3951',2)+circ(60,57,8,b,'#2b3951',2)+rect(47,25,13,13,2,'#faf4e2','#967b5e',1);}
 }
 else if(c==='game'){
   const emblem=gameBadge(n,h,a,b);
   g=rect(11,6,78,89,9,'#1b2b4a','#64799d',2)+rect(16,11,68,65,3,'#132b4f')+`<g transform="translate(16 11) scale(1 1.085)">${pixelScene(h,a,b,n)}</g>`+`<g transform="translate(21 16) scale(.57)">${emblem}</g>`+rect(16,77,68,13,2,'#18243d')+txt(50,86,n.replace(/[^A-Za-z0-9 ]/g,'').trim().slice(0,12).toUpperCase(),7.6,'#f8f6e9',900);
 }
 return wrap(n,g,h,a,b,false,c);
}
function gameBadge(n,h,a,b){if(/mario/i.test(n))return circ(50,52,26,'#dd4949','#642e3d',3)+txt(50,64,'M',35,'#fff6e9',900);if(/sonic/i.test(n))return path('M15 41 36 18 54 28 75 16 69 40 86 45 69 57 77 75 51 64 30 77 31 59z','#489cee','#1d416e',3)+circ(48,47,6,'#f0f5ff');if(/pokemon|pokémon/i.test(n))return circ(50,50,31,'#fff4e5','#273049',4)+path('M19 49a31 31 0 0 1 62 0z','#ed6c76')+line(19,50,81,50,'#252d45',4)+circ(50,50,9,'#f9f5e7','#252d45',3);if(/pac.man/i.test(n))return path('M50 50 77 29a32 32 0 1 0 0 42z','#ffd36d','#9d7b39',2)+circ(50,26,4,'#263754');if(/zelda/i.test(n))return path('M50 10 68 26 57 72 50 89 43 72 32 26Z','#e2edf9','#447295',3)+path('M35 31h30l-15-19Z','#f6d27f');if(/doom|halo|metroid/i.test(n))return path('M24 51 32 24 50 14 68 24 76 51 65 75H35Z','#728f92','#21374c',3)+rect(31,39,38,16,7,'#e5a876');if(/tetris|minecraft/i.test(n))return rect(18,39,25,25,1,a)+rect(43,18,21,46,1,b)+rect(64,38,18,25,1,'#ffd28b');if(/kart|forza|gran turismo/i.test(n))return path('M13 60 24 38h52l12 22z','#fa967a','#1e2b48',3)+circ(26,68,10,'#192335','#b3d6ec',4)+circ(73,68,10,'#192335','#b3d6ec',4);if(/final fantasy|dragon quest|fire emblem/i.test(n))return path('M49 9 59 39 80 60 55 53 50 88 43 53 20 60 40 39Z','#e8e0d4','#6489ad',3);return path('M50 8 65 36 90 50 65 64 50 92 35 64 10 50 35 36Z',a,'#1c3e61',3)+circ(50,50,14,b)+txt(50,57,n.replace(/[^A-Za-z0-9]/g,'').slice(0,1).toUpperCase(),17,'#17233f');}
// Each element stays fixed in space. Frames depict semantic states INSIDE its illustration.
// Four SVG drawings change in discrete poses; there is no sprite bounce, icon shaking or generic motion.
function animationKind(category,name){
 const n=name.toLowerCase();
 if(category==='portable')return 'portable';
 if(category==='console')return 'console';
 if(category==='arcade')return /pinball/.test(n)?'pinball':'arcade';
 if(category==='board')return /card|poker|uno|solitaire|magic|deck|tcg|tarot|blackjack/.test(n)?'cards':'board';
 if(category==='game')return /racing|kart|forza|gran turismo|rally|burnout|f1|need for speed/.test(n)?'racing':/tetris|puzzle|2048|block|minecraft/.test(n)?'puzzle':/fight|tekken|mortal kombat|samurai|smash|shodown|street fighter|boxing/.test(n)?'fighter':/shooter|doom|halo|contra|space invader|metal slug|quake|1942|raiden|galaga/.test(n)?'shooter':'game';
 if(/^(fire|heat|lava|volcano)|flame|burn|explosion|dragon|inferno/.test(n))return /lava|volcano/.test(n)?'volcano':'fire';
 if(/^(water|sea|ocean|lake|river)|beach|wave|liquid/.test(n))return n==='water'?'drop':'waves';
 if(/steam|smoke|mist/.test(n))return 'steam';
 if(/rain|storm|downpour/.test(n))return 'rain';
 if(/^(air|wind|breeze)$/.test(n))return 'wind';
 if(/cloud|fog|sky/.test(n))return 'cloud';
 if(/^(plant|seed|sprout|flower|grass)|leaf|garden/.test(n))return 'plant';
 if(/tree|forest|jungle/.test(n))return 'tree';
 if(/ice|snow|frost|winter/.test(n))return 'snow';
 if(/lightning|electric|spark|energy|power|light|sun|star/.test(n))return 'electric';
 if(/fish|shark|whale|dolphin/.test(n))return 'fish';
 if(/animal|alien|human|hero|person|villain|monster|robot/.test(n))return 'character';
 if(/sound|audio|music|rhythm|radio|speaker|guitar|melody|dance/.test(n))return 'sound';
 if(/clock|time|year|decade|watch|history/.test(n))return 'clock';
 if(/book|novel|page|text|writing|story|language|knowledge/.test(n))return 'book';
 if(/disc|dvd|cd$|blu.ray|vinyl/.test(n))return 'disc';
 if(/coin|money|trade|market|currency|gold/.test(n))return 'coin';
 if(/planet|galaxy|space|moon|orbit|solar/.test(n))return 'orbit';
 if(/screen|display|television|monitor|laptop|computer|graphics|lcd|oled/.test(n)||category==='computer')return 'screen';
 if(/gamepad|controller|joystick|pad|remote|input|button|trigger/.test(n)||category==='accessory')return 'controller';
 if(/battery|battery charge/.test(n))return 'battery';
 if(/chip|circuit|silicon|processor|transistor|electronics|binary|byte|code|memory|wifi|network|internet/.test(n)||category==='science'||category==='technology')return 'circuit';
 if(/mechanic|machine|wheel|engine|gear|factory|tool|invention/.test(n))return 'gear';
 if(/house|village|city|building|museum|shop|factory/.test(n))return 'house';
 if(/earth|mountain|stone|rock|sand|metal|crystal|gem|iron|copper|cave|coal|wood|glass|fossil/.test(n)||category==='material')return 'material';
 if(category==='life')return 'character';
 if(category==='brand')return 'brand';
 if(category==='culture')return 'book';
 return 'symbol';
}
function animatedDetails(category,name,h,a,b){
 const n=name.toLowerCase(),kind=animationKind(category,name);
 const P=(d,col=a,w=2)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const C=(x,y,r,col=a)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
 const R=(x,y,w,hh,col=a)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="1" fill="${col}"/>`;
 const centered=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`;
 const result=[];
 const seed=(h>>>7)%4;
 // Several objects of the same family have different colors, sprite motifs, and offsets.
 for(let i=0;i<4;i++){
  const f=(i+seed)%4,k=i%4;
  let g='';
  if(kind==='fire'){
   const flame=[
    'M48 83 Q36 68 49 51 Q51 61 57 54 Q70 75 53 84 Z',
    'M48 83 Q41 72 44 60 Q54 69 52 48 Q69 71 58 82 Z',
    'M47 83 Q34 72 49 55 Q48 68 61 58 Q68 78 54 84 Z',
    'M48 83 Q38 68 47 57 Q56 65 56 49 Q68 76 55 84 Z'
   ];g=`<path d="${flame[f]}" fill="#fff4a4" stroke="#ffd75b" stroke-width="1.5"/>`+C(24+f*9,23+((f+2)%3)*5,2,'#ffbd69');
  }
  else if(kind==='volcano'){
   g=P(`M42 ${25-f*3} Q${33+f*2} ${13-f*4} ${43+f*4} ${7-f*2}`,'#ffa77b',3)+P(`M55 ${27-f*2} Q${70-f*3} ${15-f*3} ${63+f} ${8-f}`,'#ffbf83',2.5)+C(47+f*4,16-f*2,2.5,'#fff0a1');
  }
  else if(kind==='drop'){
   const ys=[55,60,63,58], xs=[40,43,47,42];g=P(`M${xs[f]-7} ${ys[f]} Q${xs[f]+1} ${ys[f]-5} ${xs[f]+12} ${ys[f]-1}`,'#dcffff',3)+C(61-f*3,39+f*5,2.3,'#a5eeff');
  }
  else if(kind==='waves'){
   const y=54+f*5;g=P(`M18 ${y} Q30 ${y-8} 43 ${y} T70 ${y} T91 ${y}`,'#e7ffff',3.6)+P(`M${20+f*3} ${y+13} q15 -7 30 0`,'#92efff',2.4);
  }
  else if(kind==='rain'){
   for(let j=0;j<4;j++){const x=27+j*13,y=69+((f+j)%4)*5;g+=P(`M${x} ${y} l-4 10`,'#6edfff',3);} 
  }
  else if(kind==='steam'){
   for(let j=0;j<3;j++){let y=25+f*5+(j%2)*7;g+=P(`M${24+j*23} ${y+22} Q${10+j*24} ${y+10} ${28+j*23} ${y-1}`,'#e9ffff',2.4);}
  }
  else if(kind==='wind'){
   g=P(`M${11+f*7} 35 q14 -8 27 -4`,'#9eeaff',3.5)+P(`M${7+f*9} 60 q13 -8 31 -2`,'#c7f9ff',3.3)+P(`M${20+f*8} 78 q9 -5 19 -1`,'#83dce9',2.5);
  }
  else if(kind==='cloud'){
   g=P(`M${24+f*4} 70 q13 -5 26 0`,'#f5ffff',2.5)+C(29+f*9,64-(f%2)*2,2.5,'#edfaff')+C(62+f*5,47,2.5,'#ffffff');
  }
  else if(kind==='plant'){
   const bx=[-3,0,4,0][f],by=[0,-2,-1,1][f];g=`<path d="M49 64 Q${42+bx} 54 ${34+bx} ${43+by} Q${47+bx} 43 49 64Z" fill="#a6f995" stroke="#447f62" stroke-width="1.1"/>`+`<path d="M52 55 Q${64+bx} 37 ${72+bx} ${35+by} Q${73+bx} 52 52 55Z" fill="#91efba" stroke="#3b9068" stroke-width="1.1"/>`;
  }
  else if(kind==='tree'){
   const p=[[33,39],[60,30],[47,19],[26,52]][f];g=`<path d="M${p[0]-6} ${p[1]}q7-10 14-2q-7 9-14 2Z" fill="#cbffae"/>`+C(53+f*3,33+(f%2)*8,3,'#b3fa99');
  }
  else if(kind==='snow'){
   for(let j=0;j<3;j++){let x=21+j*27+((h>>j)&3),y=22+((f+j)%4)*15;g+=P(`M${x-4} ${y}h8M${x} ${y-4}v8`,'#f2fdff',1.9);}
  }
  else if(kind==='electric'){
   const x=26+f*10,y=[23,37,20,45][f];g=P(`M${x} ${y}l-5 7 5 0-3 8`,'#fff3a1',2.5)+P(`M${75-f*6} ${63-f*7}l7-7-5 0 6-9`,'#f8e6a0',2.3);
  }
  else if(kind==='fish'){
   const fins=['M78 48L91 37 91 69 78 55Z','M78 48L94 43 85 64 78 55Z','M78 48L92 37 92 65 78 55Z','M78 48L87 43 94 65 78 55Z'];g=`<path d="${fins[f]}" fill="#b9e9ff" stroke="#418cac" stroke-width="2"/>`+C(36,47,f===2?2:4,'#1f3b58');
  }
  else if(kind==='character'){
   g=P(`M${23+f*4} ${70-(f%2)*3}q7-5 13 0`,'#b8ebf2',2.8)+C(47+f*3,23,2,'#fff8d4');
  }
  else if(kind==='sound'){
   const radius=10+f*5;g=P(`M75 ${42-radius/2}q${radius} ${radius/2} 0 ${radius}`,'#e9d1ff',2.7)+P(`M81 ${45-radius/2}q${radius} ${radius/2} 0 ${radius}`,'#8edaff',2.2);
  }
  else if(kind==='clock'){
   const points=[[50,27],[68,36],[72,52],[58,69]];g=P(`M50 50L${points[f][0]} ${points[f][1]}`,'#ffce77',3)+C(50,50,3,'#fff4c8');
  }
  else if(kind==='book'){
   const xx=[51,59,70,64][f];g=P(`M50 79 Q${xx} 52 ${xx+11} 30`,'#ffffff',2.6)+P(`M${58+f*2} 61 q12 -5 20 -4`,'#b1dbff',2);
  }
  else if(kind==='disc'){
   const q=f*Math.PI/2;const x1=50+32*Math.cos(q),y1=50+32*Math.sin(q),x2=50+32*Math.cos(q+.65),y2=50+32*Math.sin(q+.65);g=P(`M${centered(x1,y1)} A32 32 0 0 1 ${centered(x2,y2)}`,'#fff7ff',5)+C(50,50,3,'#e2efff');
  }
  else if(kind==='coin'){
   g=P(`M${30+f*6} ${36-f*3}v9M${36+f*4} ${36+f*3}v9`,'#fff5cd',2)+C(38+f*5,29,2,'#fff2af');
  }
  else if(kind==='orbit'){
   const angle=(f*.5)*Math.PI;g=C(50+40*Math.cos(angle),49+13*Math.sin(angle),4,'#ffde9c')+P('M27 39q7-13 20-17','#eef2ff',2);
  }
  else if(kind==='screen'){
   g=R(24+f*9,30+(f%2)*9,10,4,'#8ff1ee')+P(`M23 57h${12+f*8}`,'#87d7fc',2)+R(68-f*5,34+(f%2)*4,4,4,a);
  }
  else if(kind==='controller'){
   const xx=67+(f%2)*3, yy=50+(f===2?3:0);g=C(xx,yy,3.8,'#fff8c8')+C(80-(f%2)*3,59,2.2,'#90ecfa');
  }
  else if(kind==='battery'){
   for(let j=0;j<=f;j++)g+=R(35,65-j*10,32,6,'#ecffb5');
  }
  else if(kind==='circuit'){
   const x=34+f*8,y=50+(f%2)*9;g=C(x,y,4,'#cffffb')+P(`M22 73L${x} ${y}`,'#84edff',1.7)+C(50,50,3,'#fff0aa');
  }
  else if(kind==='gear'){
   const angle=f*Math.PI/4,gx=50+13*Math.cos(angle),gy=52+13*Math.sin(angle);g=P(`M${centered(gx,gy)}L50 52`,'#d3fdff',4)+C(50,52,5,'#8de7ff');
  }
  else if(kind==='house'){
   g=R(68,51,11,9, f%2?'#ffd78a':'#76cbe3')+P(`M45 62v18`,'#edb68e',2);
  }
  else if(kind==='material'){
   const points=[[28,45],[43,35],[62,51],[54,70]];const [x,y]=points[f];g=P(`M${x-5} ${y}h10M${x} ${y-5}v10`,'#fff0de',2)+C(x+8,y+9,1.6,'#f6dca7');
  }
  else if(kind==='portable'){
   const fold=/Nintendo DS|Nintendo 3DS|Nintendo DSi|Game Boy Advance SP|New Nintendo|2DS XL/i.test(name);
   const wide=/Switch|Steam Deck|ROG|Legion|PSP|PS Vita|Lynx|Game Gear|Neo Geo Pocket|WonderSwan|SwanCrystal|GBA|Advance(?! SP)|GP|Nomad|TurboExpress|Zodiac|Evercade|Portal|Game Boy Micro/i.test(name);
   const special=/Game Boy Pocket|Game Boy Light/i.test(name);
   const rectPos=fold?[35,20,29,12]:wide?[35,39,31,17]:special?[40,27,22,18]:[36,29,24,18];
   const [xx,yy,w,hh]=rectPos;
   // A moving player and a changing tile, entirely inside the actual LCD glass.
   const px=xx+(f%4)*Math.max(3,Math.floor((w-9)/4)),py=yy+hh-5-(f%2)*3;
   g=R(px,py,5,5,'#ffe394')+R(xx+((f+2)%4)*Math.max(3,Math.floor((w-8)/4)),yy+hh-8,4,3,'#b4ffb1')+P(`M${xx+1} ${yy+4+f*2}h${8+f*2}`,'#d2ffff',1.3);
  }
  else if(kind==='console'){
   // Hardware stays solid. A power LED / access indicator changes state by frame.
   const power=/PlayStation 5|PS5/.test(name)?[35,68]:/Xbox Series X/.test(name)?[62,76]:/Wii/.test(name)?[65,22]:[82,66];
   g=C(power[0],power[1],f===0?2.2:3,f%2?'#a8ff8b':'#63d9f7')+R(33+f*7,64,5,2,'#b0c5d9');
  }
  else if(kind==='arcade'){
   const x=41+f*6;g=R(x,39+(f%2)*3,5,6,'#fff2ba')+R(60-f*4,45,3,3,'#b5f5fb')+P(`M43 52h${5+f*3}`,'#ffe7ad',1.4);
  }
  else if(kind==='pinball'){
   const pts=[[44,40],[61,48],[53,60],[38,47]],pt=pts[f];g=C(pt[0],pt[1],3.2,'#f5ffff')+P(`M${pt[0]-5} ${pt[1]+5}q4 4 8 2`,'#ffd4b1',1.2);
  }
  else if(kind==='cards'){
   const yy=[31,28,34,30][f];g=R(37+f*3,yy,17,24,'#fff9ea')+P(`M${39+f*3} ${yy+5}h11`,'#e77b97',2)+C(44+f*3,yy+15,3,'#d95569');
  }
  else if(kind==='board'){
   const pts=[[31,40],[47,39],[57,55],[42,66]],pt=pts[f];g=C(pt[0],pt[1],6,'#fff0cc')+C(pt[0]-2,pt[1]-2,2.4,a);
  }
  else if(['game','racing','puzzle','fighter','shooter'].includes(kind)){
   // Pixel graphics come alive INSIDE the video-game cover rather than moving the cover.
   if(kind==='racing')g=R(32+f*9,62-(f%2)*3,12,5,'#ffa888')+P(`M${19+f*5} 66h12`,'#fce3b1',1.8);
   else if(kind==='puzzle')g=R(54,24+f*9,7,7,'#ffe29a')+R(63,23+((f+2)%4)*8,7,7,'#9bf6ff');
   else if(kind==='fighter')g=P(`M${57+f*3} 49l6-7 6 7`,'#ffdaa0',3)+C(72-f*3,43,3,'#f8f8ff');
   else if(kind==='shooter')g=R(48+f*5,39-(f%2)*4,7,3,'#ffd88e')+P(`M${50+f*5} 42v8`,'#91e8ff',2);
   else g=R(59+f*5,47-(f%2)*6,6,7,'#fff5b0')+R(42,54+f*3,5,3,'#90f2fa');
  }
  else if(kind==='brand'){
   g=P(`M${32+f*6} 72h${13+f*3}`,'#ffefd0',2)+C(43+f*5,31,3,a);
  }
  else { // Abstract concepts receive small symbolic progress/projection, not object wobble.
   const xx=30+f*11;g=P(`M${xx} 77v${-7-f*3}`,'#d8f5fc',2.5)+C(xx,60-f*4,3,a);
  }
  result.push(g);
 }
 return result;
}
function wrap(name,center,h,a,b,decorate=true,category='concept'){
 // Any static sparkle in the illustration is STATIC. All four poses are deliberately drawn independently.
 let ornaments='';
 if(decorate){for(let i=0;i<3;i++)ornaments+=circ(9+((h>>(i*4))%80),9+((h>>(i*3+2))%80),i%2?1.25:1.6,i%2?a:b);}
 else ornaments=circ(10+(h%8),18,1.5,a)+circ(84-(h%7),12,1.5,b);
 const frames=animatedDetails(category,name,h,a,b);
 const time=(1.75+(h%6)*.21).toFixed(2),phase=((h%13)*.13).toFixed(2);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${escapeText(name)}" style="--gv-time:${time}s;--gv-phase:-${phase}s"><g>${center}${ornaments}</g><g>${frames[0]||''}</g></svg>`;
}
function illustration(id){const it=ITEMS[id],n=it.name,c=it.category,h=hash(n),palette=COLORS[c]||COLORS.concept,a=palette[h%2],b=palette[1-h%2],s=n.toLowerCase();if(['console','portable','arcade','board','game'].includes(c))return gamingArt(id);
 let g='',mode='';
 const exact=(...names)=>names.some(x=>s===x);
 const has=(regex)=>regex.test(s);
 const drop=()=>shape('M50 7C40 25 22 45 22 62a28 28 0 0 0 56 0C78 45 61 25 50 7Z','#3dbbfa','#c2faff',2.7)+path('M34 63q-2 15 15 18','none','#efffff',4)+circ(60,39,4,'#c3f9ff');
 const fire=()=>shape('M51 7Q65 28 64 45q13-5 11-17 22 30 5 52-17 22-45 8-28-16-19-43 4-11 15-22 0 20 9 27Q38 25 51 7Z','#fb7762','#ffd4a2',3)+shape('M52 42q17 19 13 34-7 16-23 11-19-9-8-29Q39 50 52 42Z','#ffdf82','#ffb961',2)+path('M45 64q-7 11 2 17','none','#fff9ca',4);
 const rock=()=>shape('M9 69 29 34l22-7 18 17 18 29-12 13H19Z','#859cb4','#d4e2ed',2.3)+shape('M9 69 29 34l12 40-22 12z','#526783')+shape('M51 27 69 44 53 84 41 74z','#acc1d5')+path('M29 34 41 74 53 84','none','#d5ecfd',2);
 const cloud=()=>circ(35,52,18,'#d4eaff')+circ(51,41,23,'#f3fbff')+circ(71,54,15,'#b8d9f0')+rect(22,49,61,23,12,'#d7ecfa')+path('M27 70h47','none','#9dc7dd',3);
 const wind=()=>path('M9 34q36-18 62-9 20 9 5 22-13 10-20-1M5 58q31-17 69-6 23 13 4 23-13 6-23-4M16 80q18-11 30-1','none','#dff7ff',6)+circ(72,23,4,'#a3ecff');
 const mountain=()=>shape('M7 79 39 26l16 29 11-16 29 40Z','#c0876e','#ffc491',3)+path('M25 55 39 26l13 26-13-8-7 12z','#fde3b8')+path('M66 39 86 75H58l14-19z','#895d60');
 const sprout=()=>path('M49 83V46','none','#67d5a8',7)+shape('M50 55Q18 52 19 22q30 3 31 33Z','#91eb78','#275d59',2)+shape('M50 46q2-31 36-31 2 33-36 31z','#4ddf9e','#27625a',2)+path('M44 70q-5-20-21-19','none','#6dbb79',3);
 const tree=()=>rect(45,52,13,34,3,'#9f6652')+circ(37,38,18,'#46bd7b')+circ(62,35,21,'#53d37e')+circ(51,23,16,'#8ae98b')+circ(27,54,11,'#2b946e')+path('M51 64v-33','none','#c3f4a0',3);
 const lightning=()=>shape('M54 6 25 54h24l-9 40 38-53H53l14-35Z','#ffdb59','#fff6a1',3)+path('M48 32 39 49h16l-7 21','none','#fff4bd',3);
 const ocean=()=>path('M4 46q15-17 30 0t32 0 30 0v39H4Z','#56cbee')+path('M5 57q13-11 29 0t32 0 29 0M7 75q16-11 31 0t34 0 21 0','none','#d2ffff',4)+circ(76,20,10,'#ffe6a0');
 const sand=()=>shape('M7 78Q29 43 43 57q16-36 30 0 11 4 21 22Z','#edbe77','#fff0b5',2)+path('M23 74q25-17 44 0','none','#d9964e',3)+circ(58,60,2,'#bf814b');
 const ice=()=>shape('M48 7 83 30 81 72 48 92 18 72 18 30Z','#b9e8ff','#f0ffff',3)+path('M48 7v85M18 30l30 21 35-21','none','#8fc9ee',3)+path('M28 36 43 21M59 63l14-15','none','#fff',3);
 const volcano=()=>shape('M6 82 40 27l20 5 34 50Z','#79475a','#f77b5b',3)+shape('M30 49 40 27l20 5 12 31-15-10-8 19-11-16-12 12Z','#ff814b')+path('M40 27q-9-18 2-27m14 29q18-13 11-25','none','#ffa18d',6)+circ(54,10,5,'#fff1b3');
 const gear=()=>`<g transform="translate(50 52)">${Array.from({length:10},(_,i)=>`<g transform="rotate(${i*36})">${rect(-5,-37,10,15,2,a)}</g>`).join('')}${circ(0,0,27,a)}${circ(0,0,17,'#254762')}${circ(0,0,7,'#b5f2f7')}</g>`;
 const music=()=>path('M43 17v54M43 17l32-8v48','none','#ffdba0',8)+circ(31,73,13,'#f4a5c7')+circ(63,61,13,'#80c3ff');
 const book=()=>shape('M11 22q22-11 39 5 17-16 39-5v57q-22-9-39 4-17-13-39-4Z','#d7d9fa','#7f93c8',3)+path('M50 27v56M18 36q17-4 25 3M58 39q14-8 24-3M18 52q15-4 25 3','none','#647da9',3);
 const crown=()=>shape('M11 32 28 50 49 15 70 50 89 32 79 78H20Z','#f3c66e','#ffe8a8',3)+circ(49,57,7,'#fd7191');
 const house=()=>shape('M13 43 51 12 88 43v44H13Z','#d99d70','#f9d0a0',3)+shape('M7 46 49 11l44 35-10 6-34-26-34 26Z','#e36972')+rect(41,57,19,29,3,'#75566a')+rect(66,50,13,12,3,'#8fd8ee');
 const star=()=>shape('M50 8 62 36 92 40 69 59 76 90 50 74 24 90 31 59 8 40 38 36Z','#e7bf75','#fff2bf',3)+circ(50,52,5,'#fff7e0');
 const person=()=>circ(50,25,16,'#f8c49e','#7b5f71',2)+path('M18 81q0-35 32-35 32 0 32 35z','#7fc4d5','#e6edff',2)+rect(42,43,16,15,6,'#f7c19c');
 const sword=()=>shape('M54 7 62 20 45 61 37 53Z','#c7edfd','#6c94bd',3)+line(30,48,53,59,'#e8b87a',7)+line(27,52,19,69,'#d58aa3',6);
 const controller=()=>path('M17 39q-9 5-10 26-1 21 18 17l19-13h13l19 13q19 4 18-17-1-21-10-26-8-11-28-9H45q-19-2-28 9Z','#a5b2c5','#1a304b',3)+controls(19,46,.52)+circ(70,50,6,'#dc739e')+circ(82,58,5,'#69c6e9');
 const chip=()=>rect(20,20,60,61,8,'#467899','#91c9e5',3)+rect(33,32,34,35,5,'#1e3752')+Array.from({length:6},(_,i)=>line(9,26+i*10,20,26+i*10,'#abbff4',4)+line(80,26+i*10,91,26+i*10,'#abbff4',4)).join('')+circ(50,50,9,a);
 const monitor=()=>rect(11,15,78,59,8,'#566988','#a4bbdc',3)+rect(18,23,64,43,3,'#193854')+path('M20 63 40 41l12 8 14-17 15 31Z',a)+rect(44,73,13,9,0,'#c7cdda')+rect(28,81,45,6,2,'#869db4');
 const battery=()=>rect(24,22,53,63,8,'#344f68','#a9e6e9',3)+rect(41,15,20,9,2,'#a4e6e6')+rect(30,34,41,42,3,'#9de2ab')+path('M54 36 41 56h13l-6 14 18-24H53Z','#e7fa93');
 const disc=()=>circ(50,50,34,'#b7d7e6','#f7fbfc',3)+circ(50,50,22,'#90a7cb')+circ(50,50,9,'#213d5d')+path('M20 40A30 30 0 0 1 44 21','none','#fff8fb',5)+path('M61 70a22 22 0 0 0 12-21','none','#e7a8c1',5);
 const globe=()=>circ(50,49,34,'#79bfdb','#d0f2ff',2)+path('M30 21 45 23 52 38 44 53 26 45 19 30ZM63 48 81 45l-4 21-22 14-11-18Z','#65b68a')+path('M15 49h70M50 15v68','none','#d9faff82',2);
 const clock=()=>circ(50,50,34,'#d0e5e7','#7193ab',3)+circ(50,50,27,'#1b3556')+line(50,50,50,28,'#f9ecc7',4)+line(50,50,64,58,'#f9ecc7',4)+circ(50,50,4,'#ffe2a6');
 const coins=()=>Array.from({length:3},(_,i)=>circ(34+i*15,48-i*9,18,'#ecb768','#fff2bb',2)).join('')+txt(50,61,'$',20,'#8f683d');
 const planet=()=>circ(50,49,26,'#a9a4ec','#d4c8ff',2)+`<ellipse cx="50" cy="49" rx="42" ry="12" fill="none" stroke="#fad79a" stroke-width="8" transform="rotate(-20 50 49)"/>`+circ(40,39,8,'#c9d2ff');
 if(exact('fire')||has(/^(flame|hot|heat)$/))g=fire();
 else if(exact('water')||has(/^(rainwater|freshwater)$/))g=drop();
 else if(exact('air','wind','breeze'))g=wind();
 else if(exact('earth'))g=mountain();
 else if(exact('planet earth','world'))g=globe();
 else if(exact('steam','smoke'))g=path('M22 80Q6 59 30 43T37 14M49 82Q28 60 53 43T57 10M72 81Q54 62 76 44T75 18','none','#bde8f4',7)+cloud();
 else if(exact('lava','volcano','volcanic rock'))g=volcano();
 else if(exact('stone','rock','ore','granite','boulder','iron ore'))g=rock();
 else if(exact('sand','dune','desert'))g=sand();
 else if(exact('plant','seed','sprout','flower','grass'))g=sprout();
 else if(exact('tree','forest','jungle','woodland'))g=tree();
 else if(exact('rain','storm','thunderstorm'))g=cloud()+Array.from({length:4},(_,i)=>line(28+i*13,73,24+i*13,89,'#68d7fa',3)).join('');
 else if(exact('cloud','fog','mist'))g=cloud();
 else if(exact('sea','ocean','river','lake','beach'))g=ocean();
 else if(exact('ice','snow','snowflake','iceberg','frost'))g=ice();
 else if(exact('mountain','continent','hill','cave'))g=mountain();
 else if(exact('energy','electricity','lightning','spark','power'))g=lightning();
 else if(exact('sun','light','day','star','stars'))g=star();
 else if(exact('metal','iron','steel','gold','copper','silver','alloy','aluminium','aluminum'))g=shape('M22 42 70 35 84 66 34 74 13 65Z',/gold/i.test(s)?'#ffe29d':'#accbda','#ededef',3)+path('M22 42 34 74l50-8M22 42 70 35l14 31','none','#627f96',2);
 else if(exact('wood','log','timber'))g=rect(12,28,71,48,12,'#a77755','#d3a17d',3)+circ(27,51,18,'#e4af83','#70492f',4)+circ(27,51,9,'#bf845e','#7e4b32',2);
 else if(exact('glass','crystal','diamond'))g=shape('M48 6 77 31 66 75 49 93 22 68 20 31Z','#a8eff8','#efffff',3)+path('M20 31h57M48 7l1 86M22 68l54-37','none','#66bbdf',2);
 else if(exact('mud','clay','dirt','dust'))g=path('M13 75q2-33 27-26 12-31 27-8 25 8 21 34Z','#be9870','#f0c79a',3)+circ(33,60,4,'#917056')+circ(65,59,3,'#917056');
 else if(exact('life','animal','human','person','hero','villain'))g=person();
 else if(exact('fish','shark'))g=shape('M16 52q32-40 60 0l12-16v33L76 54Q44 88 16 52Z','#81c9e8','#d8effc',3)+circ(36,47,4,'#223c60')+path('M48 59l12-10','none','#388aad',3);
 else if(exact('fossil','bone'))g=path('M21 25q10-17 17 1l28 38q18-11 19 7 0 13-16 11-8 17-19 6L18 39q-15 1-12-12z','#e9d6b5','#6d6b72',3);
 else if(exact('clock','time','decade','history'))g=clock();
 else if(has(/music|audio|speaker|sound|song|melody|radio|microphone|rhythm|dance/))g=music();
 else if(has(/electric|bolt|lightning|power|lightbulb|spark|battery|volt/))g=has(/battery/)?battery():lightning();
 else if(has(/plant|leaf|garden|forest|tree|wood|nature|seed|flower/))g=sprout();
 else if(has(/snow|winter|ice|frost|cold/))g=ice();
 else if(has(/ocean|sea|river|lake|water|fish|boat|wave/))g=ocean();
 else if(has(/mountain|volcano|island|land|terrain|earth|cave/))g=has(/volcano/)?volcano():mountain();
 else if(has(/cloud|rain|weather/))g=cloud();
 else if(has(/fire|burn|flame|lava|heat|explos/))g=fire();
 else if(has(/book|writing|story|knowledge|code|language|text|literature|library/))g=book();
 else if(has(/computer|pc|laptop|monitor|television|video|display|screen|pixel|graphics/))g=monitor();
 else if(has(/chip|transistor|circuit|semiconductor|processor|cpu|silicon|hardware|electronics|technology/))g=chip();
 else if(has(/joystick|control|mouse|pad|remote|wheel|gun|button|input|sensor/))g=controller();
 else if(has(/memory card|storage card|memory pak|cartridge|game cart/))g=shape('M25 12h41l11 15v61H22V17Z','#445f7f','#bdd8e7',3)+rect(31,33,38,33,4,'#273d60')+rect(35,38,30,23,2,a)+Array.from({length:5},(_,i)=>rect(31+i*8,77,5,11,1,'#e4b976')).join('')+txt(50,53,n.split(' ')[0].slice(0,5).toUpperCase(),7,'#152b48');
 else if(has(/disk|disc|cd|dvd|optical|vinyl|storage|memory/))g=disc();
 else if(has(/house|building|factory|shop|city|village|studio|home|industry|museum/))g=house();
 else if(has(/coin|gold|money|commerce|trade|shop|market|econom|price|currency/))g=coins();
 else if(has(/engineering|machine|factory|gear|tool|mechanic|robot|wheel|craft|invention/))g=gear();
 else if(has(/hero|war|battle|weapon|sword|action|adventure|fight|knight|dragon|combat/))g=sword();
 else if(has(/king|queen|royal|empire|monarch|crown|legend|victory/))g=crown();
 else if(has(/galaxy|space|cosmo|astron|universe|planet|future|moon|stars/))g=planet();
 else if(has(/science|atom|physics|energy|chemical|formula|math/)){g=circ(50,50,11,a)+`<ellipse cx="50" cy="50" rx="35" ry="14" stroke="${b}" fill="none" stroke-width="4"/>`+`<ellipse cx="50" cy="50" rx="35" ry="14" stroke="${b}" fill="none" stroke-width="4" transform="rotate(60 50 50)"/>`+`<ellipse cx="50" cy="50" rx="35" ry="14" stroke="${b}" fill="none" stroke-width="4" transform="rotate(-60 50 50)"/>`;}
 else if(has(/party|social|culture|society|community|human|person|character/))g=person();
 else if(has(/puzzle|strategy|tactics|turn|challenge|idea|concept|fun|game|simulation|arcade|virtual|digital/))g=shape('M32 16h16q-4 16 8 17 12 1 10-15h11v23q-14-5-16 8 0 13 16 8v25H60q4-13-9-15-13-2-10 15H18V56q15 6 16-8 1-13-16-10V16Z',a,'#33577a',3)+circ(62,50,5,b);
 else { // Specific abstract emblem with name-derived, independently shaped strokes, not a reusable cube.
  const sides=5+(h%4), cx=50,cy=50,pts=[];for(let i=0;i<sides;i++){const ang=-Math.PI/2+i*Math.PI*2/sides,r=(i%2===0?34:24)+((h>>(i%16))%8);pts.push([cx+Math.cos(ang)*r,cy+Math.sin(ang)*r]);}
  g=shape('M'+pts.map(p=>p.map(Math.round).join(' ')).join('L')+'Z',a,'#355b80',2.5)+circ(50,50,19,'#263e60','#e1e5ff',2)+txt(50,57,n.replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase(),22,'#f7f4e9',900)+circ(70,25,5,b);
 }
 // Distinct, relevant sub-motifs on shared object classes; each ID has unique art data and geometry.
 const accents=Array.from({length:3},(_,i)=>{const angle=(h%360+i*137)*Math.PI/180,x=50+Math.cos(angle)*43,y=50+Math.sin(angle)*43;return circ(x.toFixed(1),y.toFixed(1),i===0?2:1.25,i===0?a:b);}).join('');
 return wrap(n,g+accents,h,a,b,false,c);
}

const cache=new Map();
export function legacyIcon(id){if(!Number.isInteger(id)||id<0||id>=ITEMS.length)return fallbackIcon();if(!cache.has(id))cache.set(id,illustration(id));return cache.get(id);}
export function fallbackIcon(category='other'){
 const subjects={
 film:'<rect x="16" y="25" width="68" height="52" rx="8" fill="#484f6a"/><path d="M17 25h66v15H17Z" fill="#ffca81"/><path d="m19 26 13 14m4-14 13 14m4-14 13 14m4-14 13 14" stroke="#66536b" stroke-width="6"/><path d="m41 48 19 10-19 10z" fill="#fff1d2"/>',
 series:'<rect x="15" y="24" width="70" height="54" rx="11" fill="#79bad7" stroke="#324f74" stroke-width="4"/><rect x="23" y="32" width="53" height="36" rx="4" fill="#d6ebff"/><path d="M36 82h28" stroke="#324f74" stroke-width="5"/>',
 music:'<circle cx="50" cy="50" r="34" fill="#af9af8"/><path d="M55 23v43m0-36 18-5v33" stroke="#faf3ff" stroke-width="7" stroke-linecap="round"/><circle cx="43" cy="67" r="10" fill="#ffdc7a"/><circle cx="66" cy="60" r="9" fill="#ffdc7a"/>',
 musician:'<path d="M51 19a17 17 0 0 1 17 17c0 9-7 15-17 15S34 45 34 36a17 17 0 0 1 17-17Z" fill="#ffcc95"/><path d="M22 81c1-20 14-27 29-27s28 7 29 27" fill="#65b6cf"/><path d="M30 36c5-23 33-27 42-4" fill="none" stroke="#694f68" stroke-width="11"/><path d="M80 49v26" stroke="#53566f" stroke-width="5"/><circle cx="80" cy="46" r="7" fill="#cfd5e6"/>',
 actor:'<circle cx="50" cy="34" r="17" fill="#f5bc91"/><path d="M20 82c4-21 16-27 30-27s26 6 30 27" fill="#8db8ed"/><path d="M32 32Q31 9 51 12T69 30" fill="none" stroke="#554557" stroke-width="10"/>',
 politician:'<circle cx="50" cy="31" r="17" fill="#f2bc93"/><path d="M20 85c3-25 14-30 30-30s27 5 30 30" fill="#58698e"/><path d="M45 54h10l-5 22z" fill="#e36d78"/><path d="M28 29c5-20 32-21 44-3" fill="none" stroke="#534b4f" stroke-width="8"/>',
 historical_person:'<path d="M27 76h46l-6 11H33z" fill="#98c8bc"/><circle cx="50" cy="33" r="18" fill="#d8ab86"/><path d="M26 78q-1-26 24-26t24 26" fill="#798da9"/><path d="M38 36q11 7 24 0" stroke="#765849" stroke-width="5" fill="none"/>',
 fantasy:'<path d="M50 11 63 35l22 8-14 16 1 24-22-11-22 11 1-24-14-16 22-8z" fill="#ba9af1" stroke="#6e5bb5" stroke-width="4"/><circle cx="50" cy="49" r="12" fill="#ffe7a5"/>',
 console:'<rect x="9" y="31" width="82" height="44" rx="12" fill="#59687b"/><rect x="22" y="36" width="56" height="22" rx="5" fill="#9adaf0"/><circle cx="26" cy="65" r="5" fill="#ffc38f"/><circle cx="73" cy="65" r="5" fill="#aef3d6"/>',
 portable:'<rect x="12" y="29" width="76" height="44" rx="12" fill="#6e86c2"/><rect x="29" y="35" width="42" height="30" rx="4" fill="#aaf0e3"/><circle cx="19" cy="51" r="6" fill="#ffe1a2"/><circle cx="80" cy="51" r="6" fill="#ffadb0"/>',
 board:'<rect x="18" y="18" width="64" height="64" rx="8" fill="#d8ad76"/><path d="M26 26h48v48H26Z" fill="#f9e3bf"/><path d="M26 42h48M26 58h48M42 26v48M58 26v48" stroke="#88654d" stroke-width="2"/><circle cx="49" cy="48" r="9" fill="#b785dc"/>',
 nature:'<path d="M50 10Q22 48 22 61a28 28 0 0 0 56 0Q78 47 50 10Z" fill="#79c9f5" stroke="#469dcf" stroke-width="4"/><path d="M35 62q0 12 13 16" fill="none" stroke="#efffff" stroke-width="5"/>',
 };
 const subject=subjects[category]||subjects.fantasy;
 return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${subject}</svg>`;
}

// V13 zero-cost shared icon system: static, consistent and deterministic.
// The same base icon can represent related elements, with a few named palette variants.
// No image-generation API is called and no on-screen animation frames exist.
const SHARED_FAMILIES={
 fire:1,water:0,earth:2,air:3,steam:4,lava:8,stone:14,plant:15,cloud:17,
 tree:19,forest:20,metal:22,ice:35,lightning:18,energy:5,book:51,
 dragon:122,samurai:567,robot:123,pixel:146,arcade:171,circuit:70,console:168,
};
function iconFamilyFor(it){
 const n=String(it.name||'').toLowerCase();
 if(it.iconFamily && Object.hasOwn(SHARED_FAMILIES,it.iconFamily))return it.iconFamily;
 const patterns=[['fire',/\b(fire|flame|inferno|blaze|pyro|wildfire|ember)\b/],['water',/\b(water|aqua|rainwater|spring)\b/],['ice',/\b(ice|frost|snow|glacier)\b/],['lava',/\b(lava|magma|volcano)\b/],['lightning',/\b(lightning|electricity|thunderbolt)\b/],['steam',/\b(steam|vapor|vapour|mist)\b/],['tree',/\b(tree|oak|willow)\b/],['forest',/\b(forest|jungle|woodland)\b/],['plant',/\b(plant|flower|herb|grass|seed)\b/],['stone',/\b(stone|rock|granite|marble)\b/],['metal',/\b(metal|iron|steel|alloy|copper|gold)\b/],['cloud',/\b(cloud|fog)\b/],['air',/\b(air|wind|breeze)\b/],['book',/\b(book|novel|manuscript)\b/]];
 for(const [family,pattern] of patterns)if(pattern.test(n))return family;
 return it.category;
}
// V18: reusable 2D character illustration, deliberately not a protected portrait.
// Stable vector, no sprites, frames or image-generation calls. Name-driven color variants
// preserve recognition at very small sizes without downloading thousands of images.
function cartoonAvatar(it){
 const n=String(it.name||'').toLowerCase();
 const golden=/super saiyan|naruto|zenitsu|sailor|thor|blonde|blond|gohan/.test(n) && !/goku black/.test(n);
 const rose=/rosé|rose|sakura|misa/.test(n);
 const jade=/piccolo|shrek|goblin/.test(n);
 const silver=/ultra instinct|kakashi|white hair|whis/.test(n);
 const hair=rose?'#E99ABA':silver?'#DCE4E9':golden?'#F9CD46':/blue|cyber/.test(n)?'#4C82C8':'#25334B';
 const outfit=/goku|dragon ball/.test(n)?'#EC7B35':/vegeta|saiyan/.test(n)?'#5174B5':/naruto/.test(n)?'#E59C35':/sailor/.test(n)?'#6C85C8':/villain|black|shadow/.test(n)?'#63567A':'#529E9E';
 const skin=jade?'#86C56B':'#F4C79B';
 const spikes=/goku|vegeta|saiyan|naruto|ichigo|luffy|spiky|shonen/.test(n);
 const hairstyle=spikes?
   `<path d="M29 43 17 30 30 31 23 13 43 24 54 8 64 25 84 16 76 35 86 39 72 49 37 48Z" fill="${hair}" stroke="#3E4159" stroke-width="2" stroke-linejoin="round"/>`:
   `<path d="M29 49Q20 25 32 17Q49 6 68 18Q84 31 72 53L67 36Q49 43 32 35Z" fill="${hair}" stroke="#3E4159" stroke-width="2"/>`;
 return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M14 95Q19 74 36 70L48 76 61 70Q82 75 87 95Z" fill="${outfit}" stroke="#55536A" stroke-width="2.3" stroke-linejoin="round"/>
  <path d="M42 62H58V76Q50 86 42 76Z" fill="${skin}" stroke="#986D63" stroke-width="1.5"/>
  <ellipse cx="29" cy="51" rx="5" ry="8" fill="${skin}"/><ellipse cx="71" cy="51" rx="5" ry="8" fill="${skin}"/>
  <path d="M30 35Q50 23 70 35L69 53Q65 70 50 73Q34 70 31 53Z" fill="${skin}" stroke="#986D63" stroke-width="2"/>
  ${hairstyle}
  <path d="M37 52h9m8 0h9" stroke="#39465D" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="43" cy="53" r="1.4" fill="#202C3D"/><circle cx="59" cy="53" r="1.4" fill="#202C3D"/>
  <path d="M45 63q5 3 10 0" fill="none" stroke="#985F57" stroke-width="1.7" stroke-linecap="round"/>
  <path d="M14 95h72" stroke="#425071" stroke-width="2" stroke-linecap="round"/>
 </svg>`;
}
export function sharedIcon(it){
 if(it.category==='character' && it.iconFamily==='actor')return cartoonAvatar(it);
 const family=iconFamilyFor(it);
 const base=SHARED_FAMILIES[family];
 const emojiData=EMOJI_ATLAS[family]||EMOJI_ATLAS[it.category]||EMOJI_ATLAS.other;
 const drawing=emojiData?`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><image href="${emojiData}" x="8" y="8" width="84" height="84" preserveAspectRatio="xMidYMid meet"/></svg>`:(Number.isInteger(base)?legacyIcon(base):fallbackIcon(family));
 const n=String(it.name||'').toLowerCase();
 // Color-transform applies only to static SVG; a shared base stays recognizable.
 const hue=it.paletteVariant==='spectral'?145:it.paletteVariant==='emerald'?90:it.paletteVariant==='cool'?195:it.paletteVariant==='warm'?-24:it.paletteVariant==='shadow'?250:
   /greek fire|acid fire|toxic fire/.test(n)?85:/soul fire|ghost fire|blue fire/.test(n)?185:
   /holy fire|golden fire/.test(n)?-22:/dark fire|shadow fire/.test(n)?245:0;
 const accent=it.accentOverlay||'';
 const mark=accent==='dragon'?'<path d="M78 16q9 2 10 12q-5-3-12 1" stroke="#f5c96b" stroke-width="4" fill="none"/>':accent==='samurai'?'<path d="M77 20L91 9" stroke="#e3e7ef" stroke-width="4" stroke-linecap="round"/>':accent==='robot'?'<circle cx="84" cy="22" r="6" fill="#ffe184" stroke="#6476aa" stroke-width="2"/>':accent==='circuit'?'<path d="M74 15h13v12" fill="none" stroke="#9cecd8" stroke-width="4"/>':accent==='arcade'?'<circle cx="85" cy="16" r="5" fill="#ffca88"/>':accent==='spark'?'<path d="M82 12l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffdfa0" stroke="#a18caa" stroke-width="1.5"/>':'';
 const staticSvg=mark?drawing.replace('</svg>',mark+'</svg>'):drawing;
 if(!hue)return staticSvg;
 return staticSvg.replace('<svg ',`<svg style="filter:hue-rotate(${hue}deg)" `);
}
