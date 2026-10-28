#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'client/src/app.js'
s=p.read_text()
if 'gameverse-art-v27-variants.js' not in s:
 s=s.replace("import { GAMEVERSE_ART_V23 } from './gameverse-art-v23.js';", "import { GAMEVERSE_ART_V23 } from './gameverse-art-v23.js';\nimport { GAMEVERSE_ART_V27_VARIANTS } from './gameverse-art-v27-variants.js';")
 token='function staticArt(item){'
 inject=r'''
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
'''
 s=s.replace(token,inject+'\n'+token)
 s=s.replace('function staticArt(item){\n if(!item)return fallbackIcon();','function staticArt(item){\n if(!item)return fallbackIcon();\n const v27=v27StaticArt(item);\n if(v27)return v27;',1)
 p.write_text(s)
else:print('already patched')
# Keep selected illustrations and rarity styling compact, never animate item imagery.
css=root/'client/src/styles.css'
c=css.read_text()
if '.gameverse-art-v27' not in c:
 c+='\n/* V27 original pre-rendered static cartoon art. */\n.gameverse-art-v27 { object-fit:contain; image-rendering:auto; max-width:100%; max-height:100%; aspect-ratio:1; }\n@media (prefers-reduced-motion: reduce){.gameverse-art-v27{animation:none!important;transition:none!important}}\n'
 css.write_text(c)
print('patched V27 app & CSS')
