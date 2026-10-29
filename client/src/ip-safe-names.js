/**
 * V76.1 - Fictional public labels for third-party entertainment references.
 *
 * Preserve canonical IDs, historic formulas, saved games, source-art lookup keys
 * and internal curated links. Labels are fictional editorial alternatives,
 * NOT a trademark clearance or permission to reproduce protected likenesses.
 */
const RULES = Object.freeze([
  // Specific device families before broad manufacturers.
  [/\bNintendo Switch 2\b/gi,'GlidePort II'],
  [/\bNintendo Switch OLED\b/gi,'GlidePort Aurora'],
  [/\bNintendo Switch\b/gi,'GlidePort'],
  [/\bNintendo 3DS\b/gi,'TriFold'],
  [/\bNintendo DSi\b/gi,'Twinleaf i'],
  [/\bNintendo DS\b/gi,'Twinleaf'],
  [/\bNintendo 64DD\b/gi,'Velqryon 64 Disk'],
  [/\bNintendo 64\b/gi,'Velqryon 64'],
  [/\bNintendo\b/gi,'Velqryon'],
  [/\bGame Boy Advance\b/gi,'PocketNova Advance'],
  [/\bGame Boy Color\b/gi,'PocketNova Color'],
  [/\bGame Boy\b/gi,'PocketNova'],
  [/\bGameCube\b/gi,'Cubelet'],
  [/\bGame & Watch\b/gi,'Pocket Chronograph'],
  [/\bGame and Watch\b/gi,'Pocket Chronograph'],
  [/\bSuper Famicom\b/gi,'Super Homebit'],
  [/\bFamicom\b/gi,'Homebit'],
  [/\bWii U\b/gi,'MotionArc Plus'],
  [/\bWii\b/gi,'MotionArc'],
  [/\bPlayStation Portal\b/gi,'Qelvorune Streamscreen'],
  [/\bPlayStation\b/gi,'Qelvorune'],
  [/\bPS Vita\b/gi,'Qelvorune Vista'],
  [/\bPSP\b/gi,'Qelvorune Pocket'],
  [/\bPS([1-5])\b/gi,'Qelvorune $1'],
  [/\bXbox Series X\b/gi,'Zerqadyn Zenith'],
  [/\bXbox Series S\b/gi,'Zerqadyn Nova'],
  [/\bXbox 360\b/gi,'Zerqadyn Orbit'],
  [/\bXbox One\b/gi,'Zerqadyn One'],
  [/\bXbox\b/gi,'Zerqadyn'],
  [/\bSega Genesis\b/gi,'Thrynovex Origin'],
  [/\bSega Saturn\b/gi,'Thrynovex Ring'],
  [/\bSega Dreamcast\b/gi,'Thrynovex Lucent'],
  [/\bSega Game Gear\b/gi,'Thrynovex Pocket'],
  [/\bSega Nomad\b/gi,'Thrynovex Rover'],
  [/\bSega\b/gi,'Thrynovex'],
  [/\bDreamcast\b/gi,'Lucent Orbit'],
  [/\bGame Gear\b/gi,'Pocket Arc'],
  [/\bAtari\b/gi,'Qintavyr'],
  [/\bSony\b/gi,'Qelvorune Works'],
  [/\bMicrosoft\b/gi,'Gridline Labs'],
  [/\bSteam Deck\b/gi,'Cloudforge Portable'],
  [/\bValve\b/gi,'Cloudforge Labs'],
  // Recognisable media franchises, characters and publishers.
  [/\bSuper Mario Bros\.?/gi,'Mosskip Duo'],
  [/\bMario\b/gi,'Mosskip'],
  [/\bLuigi\b/gi,'Fernwick'],
  [/\bYoshi\b/gi,'Leafhopper'],
  [/\bBowser\b/gi,'Emberjaw'],
  [/\bDonkey Kong\b/gi,'Timber Monarch'],
  [/\bDiddy Kong\b/gi,'Timber Cub'],
  [/\bPrincess Peach\b/gi,'Princess Coral'],
  [/\bThe Legend of Zelda\b/gi,'Mooncrest Chronicles'],
  [/\bZelda\b/gi,'Mooncrest'],
  [/\bHyrule\b/gi,'Lunewood'],
  [/\bKirby\b/gi,'Pufflet'],
  [/\bPok[eé]mon\b/gi,'Critter Atlas'],
  [/\bPikachu\b/gi,'Sparksnout'],
  [/\bSonic\b/gi,'Windrush'],
  [/\bKnuckles\b/gi,'Stonefist'],
  [/\bMega Man\b/gi,'Volt Guardian'],
  [/\bMegaman\b/gi,'Volt Guardian'],
  [/\bMetal Gear\b/gi,'Shadow Circuit'],
  [/\bSolid Snake\b/gi,'Silent Viper'],
  [/\bFinal Fantasy\b/gi,'Crystal Odyssey'],
  [/\bDragon Ball\b/gi,'Sky Orbs'],
  [/\bSon Goku\b/gi,'Kairo Sun'],
  [/\bGoku\b/gi,'Kairo Sun'],
  [/\bVegeta\b/gi,'Prince Cinder'],
  [/\bNaruto\b/gi,'Gale Ninja'],
  [/\bOne Piece\b/gi,'Oceanbound Saga'],
  [/\bStar Wars\b/gi,'Nebula Tales'],
  [/\bMarvel\b/gi,'Heroic Atlas'],
  [/\bSpider[ -]Man\b/gi,'Web Sentinel'],
  [/\bBatman\b/gi,'Night Warden'],
  [/\bSuperman\b/gi,'Sky Guardian'],
  [/\bDisney\b/gi,'Storyvale'],
  [/\bLEGO\b/gi,'Brickwell'],
  [/\bHalo\b/gi,'Aegis Horizon'],
  [/\bMinecraft\b/gi,'Blockhaven'],
  [/\bAssassin['’]s Creed\b/gi,'Veilbound Oath'],
  [/\bGod of War\b/gi,'Ashen Deities'],
  [/\bStreet Fighter\b/gi,'Street Duel'],
  [/\bMortal Kombat\b/gi,'Mortal Arena'],
  [/\bResident Evil\b/gi,'Midnight Outbreak'],
  [/\bSilent Hill\b/gi,'Stillwater Mist'],
  [/\bDead Space\b/gi,'Voidwreck'],
  [/\bFortnite\b/gi,'Stormhaven'],
  [/\bRoblox\b/gi,'Voxel Commons'],
  [/\bTetris\b/gi,'Blockfall'],
  [/\bPac[ -]?Man\b/gi,'Maze Muncher'],
  [/\bMetroid\b/gi,'Starvault'],
  [/\bHollow Knight\b/gi,'Cavern Knight'],
  [/\bKingdom Hearts\b/gi,'Realm Keys'],
  [/\bHarry Potter\b/gi,'Elmwood Apprentice'],
  [/\bHogwarts\b/gi,'Elmwood Academy'],
  [/\bStarCraft\b/gi,'Stellar Conquest'],
  [/\bWarcraft\b/gi,'Warrealm'],
  [/\bGundam\b/gi,'Starframe'],
  [/\bCall of Duty\b/gi,'Frontline Dispatch'],
  [/\bDOOM\b/gi,'Inferno Protocol'],
  [/\bPortal\b/gi,'Riftgate'],
  [/\bCapcom\b/gi,'Arcforge Studio'],
  [/\bKonami\b/gi,'Nayvuril Studio'],
  [/\bSquare Enix\b/gi,'Crystalvale Studio']
]);

// Additional context-sensitive editorial mock game/media names. This list is a
// screening aid only, NOT a license or trademark-clearance finding.
// V76.4: readable, descriptive hardware types; not imitation trademarks.
// Changes only public display text, never immutable element IDs or recipe keys.
const READABLE_DEVICE_PAIRS = [["GlidePort Aurora","Hybrid OLED Console"],["GlidePort II","Hybrid Console 2"],["GlidePort","Hybrid Console"],["TriFold","3D Dual-Screen Handheld"],["Twinleaf i","Dual-Screen Pocket i"],["Twinleaf","Dual-Screen Pocket"],["Velqryon 64 Disk","64-Bit Disk Expansion"],["Velqryon 64","64-Bit Cartridge Console"],["Velqryon","Cartridge Console"],["PocketNova Advance","Pixel Pocket Advance"],["PocketNova Color","Pixel Pocket Color"],["PocketNova","Pixel Pocket"],["Cubelet","Cube Console"],["Pocket Chronograph","Pocket Game Clock"],["Super Homebit","16-Bit Console"],["Homebit","8-Bit Console"],["MotionArc Plus","Motion Remote Console Plus"],["MotionArc","Motion Remote Console"],["Qelvorune Streamscreen","Remote Play Screen"],["Qelvorune Vista","Pocket OLED Handheld"],["Qelvorune Pocket","Pocket Disc Handheld"],["Qelvorune Works","Disc Console Studio"],["Qelvorune","Disc Console"],["Zerqadyn Zenith","Power Console X"],["Zerqadyn Nova","Compact Power Console"],["Zerqadyn Orbit","Orbit Console"],["Zerqadyn One","Power Console One"],["Zerqadyn","Power Console"],["Thrynovex Origin","16-Bit Arcade Console"],["Thrynovex Ring","Disc Arcade Console"],["Thrynovex Lucent","Dream-Era Console"],["Thrynovex Pocket","Pocket Arcade Console"],["Thrynovex Rover","Portable Arcade Console"],["Thrynovex","Arcade Console"],["Lucent Orbit","Dream-Era Console"],["Pocket Arc","Pocket Arcade Console"],["Qintavyr","Retro Console"],["Cloudforge Portable","Portable PC Console"],["Cloudforge Labs","Computer Game Studio"],["Gridline Labs","Software Studio"],["Nayvuril Studio","Arcade Game Studio"]];
const READABLE_DEVICE_RULES=READABLE_DEVICE_PAIRS.slice().sort((a,b)=>b[0].length-a[0].length)
 .map(([original,description])=>[new RegExp('\\b'+original.replace(/[^A-Za-z0-9 ]/g,ch=>'\\'+ch)+'\\b','gi'),description]);
function readableDeviceNames(label){for(const [pattern,description] of READABLE_DEVICE_RULES)label=label.replace(pattern,description);return label;}
const MEDIA_NAME_PAIRS = [["WarioWare","Pocket Mischief"],["Wario Land","Gilded Hills"],["Ocarina of Time","Chronoflute"],["A Link to the Past","Path Through Ages"],["The Wind Waker","Gale Baton"],["Twilight Princess","Dusk Princess"],["Breath of the Wild","Wildwind Breath"],["Tears of the Kingdom","Crownfall Tears"],["F-Zero","Velocity Zero"],["Star Fox","Nebula Fox"],["Fire Emblem","Cinder Sigil"],["Animal Crossing","Meadow Village"],["Pikmin","Spriglings"],["Splatoon","Inkstrike"],["Super Smash Bros","Champions Clash"],["Nintendogs","PetPals"],["Advance Wars","Frontier Tactics"],["Xenoblade","Aetherblade"],["Streets of Rage","Rebel Streets"],["Shinobi","Nightblade"],["Phantasy Star","Ethereal Star"],["Panzer Dragoon","Steel Drake"],["Virtua Fighter","Vector Duel"],["Crazy Taxi","Street Cab Chaos"],["Crash Bandicoot","Tumblefox"],["Spyro","Emberling Dragon"],["Ratchet & Clank","Cogtail and Bolt"],["Jak and Daxter","Jet and Bristle"],["Sly Cooper","Shade Fox"],["Uncharted","Lost Atlas"],["The Last of Us","The Last Ember"],["Ghost of Tsushima","Specter of the Isles"],["Bloodborne","Crimson Reliquary"],["Gran Turismo","Grand Motorway"],["LittleBigPlanet","Pocket Planet"],["Tekken","Iron Fists"],["Forza","Turbo Circuit"],["Gears of War","Iron Gears"],["Age of Empires","Age of Kingdoms"],["Half-Life","Half Dawn"],["Counter-Strike","Counterforce"],["Terraria","Caverncraft"],["Stardew Valley","Fernbrook Valley"],["Celeste","Cloudpeak"],["Cuphead","Teacup Hero"],["Undertale","Underpath"],["Hades","Underrealm"],["Dead Cells","Fallen Cells"],["Slay the Spire","Ascend the Tower"],["Among Us","Within the Crew"],["The Sims","Life Neighbors"],["SimCity","City Architect"],["Tomb Raider","Crypt Explorer"],["Chrono Trigger","Hourglass Trigger"],["Dragon Quest","Dragon Voyage"],["Persona","Mirrorbound"],["Elden Ring","Elder Circle"],["Dark Souls","Ashen Pilgrims"],["Monster Hunter","Beastward"],["Grand Theft Auto","Metro Outlaws"],["GTA","Metro Outlaws"],["Red Dead Redemption","Crimson Prairie"],["The Witcher","Wanderer of Runes"],["Fallout","Wasteland Echo"],["Mass Effect","Cosmic Resonance"],["Battlefield","Warfront"],["Rocket League","Turbo League"],["Guitar Hero","String Champion"],["Professor Layton","Professor Wren"],["Castlevania","Castle Eclipse"],["Bayonetta","Midnight Enchantress"],["Demon Slayer","Dusk Hunter"],["Attack on Titan","Giantfall"],["Bleach","Spirit Blade"],["Jujutsu Kaisen","Spectral Academy"],["Indiana Jones","Arden Explorer"],["Diablo","Infernal Depths"],["League of Legends","Dawn League"],["Baldur's Gate","Boulder Gate"],["Danganronpa","School Mystery Trial"],["Ninja Gaiden","Nightsunder Legacy"],["Contra","Rebel Horizon"],["Double Dragon","Twin Wyverns"],["Battletoads","Marsh Brawlers"],["Blaster Master","Cannonwright"],["Tecmo Bowl","Stadium Crown"],["Excitebike","Revwheel"],["Killer Instinct","Feral Duel"],["ActRaiser","Celestrum"],["Pilotwings","Skypilot Trials"],["Punch-Out","Corner Clash"],["Chibi-Robo","Little Circuit"],["Viewtiful Joe","Jovial Vanguard"],["Mole Mania","Tunnel Tinker"],["Shantae","Sundancer"],["Dragon Warrior Monsters","Wyvern Tamer"],["Golden Sun","Amber Dawn"],["Astro Boy","Meteor Apprentice"],["Kid Icarus","Skyforge Squire"],["No More Heroes","Last Vanguard"],["The Wonderful 101","The Mighty Hundred"],["Vagrant Story","Wayfarer Chronicle"],["Parasite Eve","Midnight Parasite"],["Suikoden","Riverbound Tales"],["Dino Crisis","Raptor Emergency"],["Okami","Brushwolf"],["Bully","Campus Rebellion"],["Devil May Cry","Demon's Lament"],["Burnout","Overheat Circuit"],["Heavy Rain","Downpour Mystery"],["inFAMOUS","Voltage Renegade"],["Killzone","The Fallen Front"],["Ni no Kuni","Realm Beyond"],["NieR","Forgotten Automaton"],["Days Gone","Vanishing Days"],["Returnal","Cycle Return"],["Stellar Blade","Astral Saber"],["Death Stranding","The Long Crossing"],["Lumines","Lumen Puzzles"],["Tearaway","Paper Trailways"],["Freedom Wars","Liberty Front"],["Soul Sacrifice","Spirit Offering"],["Hotline Miami","Neon Nightline"],["Spelunky","Tunnelbound"],["Guacamelee","Masked Grappler"],["Dragon’s Crown","Wyvern Throne"],["Dragon's Crown","Wyvern Throne"],["Jet Set Radio","Skyline Broadcast"],["Tom Clancy’s Splinter Cell","Splinter Signal"],["Tom Clancy's Splinter Cell","Splinter Signal"],["Project Gotham Racing","Midnight Borough Rally"],["Psychonauts","Mind Wanderers"],["Jade Empire","Jade Dominion"],["Crimson Skies","Scarlet Clouds"],["Lost Odyssey","Forgotten Voyage"],["Blue Dragon","Azure Wyrm"],["Sunset Overdrive","Dusk Dash"],["Quantum Break","Quantum Fracture"],["Titanfall","Titan Descent"],["Senua’s Saga","The Wanderer's Saga"],["Senua's Saga","The Wanderer's Saga"],["Avowed","Sworn Anew"],["Mickey Mouse","Mouse of Moonlight"],["Earthworm Jim","Worm Commander"],["Shining Force","Luminous Legion"],["Road Rash","Road Riot"],["Guardian Heroes","Sentinel Champions"],["Burning Rangers","Flamewatch Rangers"],["Dragon Force","Drake Battalion"],["Saturn Bomberman","Orbit Bomber"],["Fighters Megamix","Dueler Medley"],["Power Stone","Spirit Gems"],["Grandia","Grand Voyage"],["Tails Adventure","Skyfox Expedition"],["Defenders of Oasis","Oasis Wardens"],["Civilization","Realmcraft Empires"],["Sid Meier's","Elder Cartographer's"],["Sid Meier’s","Elder Cartographer's"],["Pitfall","Chasm Chase"],["Yars’ Revenge","Veyran Retribution"],["Yars' Revenge","Veyran Retribution"],["River Raid","Rapids Assault"],["Berzerk","Frenzied Arcade"],["Enduro","Endurance Sprint"],["Kaboom","Firecracker Frenzy"],["Tempest 2000","Cyclone 2000"],["Alien vs Predator","Hunter of the Void"],["Rayman","Elastic Ranger"],["Kasumi Ninja","Mistblade"],["Cybermorph","Cyber Shifter"],["Garou","Wolfmark"],["Art of Fighting","Duelcraft"],["Windjammers","Gale Discs"],["Rhythm Heaven","Beat Paradise"],["Link's Crossbow Training","Crossbow Trials"],["Link’s Crossbow Training","Crossbow Trials"],["Donkey Konga","Timber Drums"],["Terranigma","Terra Awakening"],["Illusion of Gaia","Gaia Mirage"],["Soul Blazer","Soul Spark"],["Sackboy","Stitchling"],["Rise of the Ronin","Rise of the Wandering Blade"],["Daxter","Bristle Scout"],["Syphon Filter","Signal Strainer"],["Twisted Metal","Wrecksteel"],["Alundra","Dreamcaster"],["The Legend of Dragoon","Legend of the Wingguard"],["MechAssault","Mech Siege"],["Viva Piñata","Garden Carnival"],["Banjo-Kazooie","Bramble Partners"],["Alan Wake","Arlen Night"],["State of Decay","Realm in Ruins"],["Secret of Evermore","Secrets of Always"],["MediEvil","Gravebound"],["Sly 3","Shade Fox Three"],["Jak X","Jet Racer"],["Ratchet","Cogtail"],["Resistance","Last Bastion"],["Prince of Persia","Prince of the Dunes"],["Lara Croft","Mara Flint"],["Dr. Robotnik","Professor Gearlock"],["Tails' Skypatrol","Skyscout Patrol"],["Tails’ Skypatrol","Skyscout Patrol"],["Secret Agent Clank","Agent Bolt"],["PokéPark","Creature Meadow"],["Phoenix Wright","Phoenix Vale"],["The Great Ace Attorney","The Great Verdict"],["Ace Attorney","Verdict Advocate"],["Tony Hawk","Skate Captain"],["Yu-Gi-Oh","Cardbound Legends"],["Wario World","Gilded World"],["Game & Wario","Pocket Mischief Show"],["The Urbz","The Metrofolk"],["Fable","Fablegrove"],["Quake","Tremorfall"],["Rogue Squadron","Star Patrol"],["Metal Slug","Iron Shell"],["R-Type","Vector-Type"],["Puyo Puyo","Color Globes"],["Banjo-Tooie","Bramble Encore"],["Wipeout","Neon Velocity"],["Mortal Kombat","Arena of Mortals"],["Street Fighter","Street Duel"],["The Matrix","Gridrealm"],["Middle-earth","Eldervale"],["Call of Duty","Frontline Dispatch"],["Starfield","Star Garden"],["Horizon Zero Dawn","Horizon of Embers"],["Horizon Forbidden West","Horizon of Ash"],["Katamari","Rolling Cosmos"],["Pikachu","Sparksnout"],["Ghost of Yōtei","Specter of the Peaks"],["Killer7","Seventh Shadow"],["Mickey","Moonmouse"]];
const MEDIA_NAME_RULES = Object.freeze(MEDIA_NAME_PAIRS.slice()
 .sort((a,b)=>b[0].length-a[0].length)
 .map(([original,fiction]) => {
   const escaped=original.replace(/[^A-Za-z0-9 ]/g,ch=>'\\'+ch);
   return [new RegExp('\\b'+escaped+'\\b','gi'),fiction];
 }));
const MEDIA_CATEGORIES=new Set(['game','film','movie','anime','manga','series','character','music']);
// These words are also normal vocabulary in science, astronomy or hardware.
const AMBIGUOUS_BRAND_SOURCES=new Set([String.raw`\bPortal\b`,String.raw`\bHalo\b`,String.raw`\bValve\b`,String.raw`\bDOOM\b`,String.raw`\bSonic\b`,String.raw`\bKnuckles\b`]);
const isMedia=item=>MEDIA_CATEGORIES.has(item?.category);
const isContextual=([pattern],item)=>isMedia(item)||!AMBIGUOUS_BRAND_SOURCES.has(pattern.source);
export const PUBLIC_IP_SIGNALS = Object.freeze(
  [...RULES,...MEDIA_NAME_RULES].map(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')))
);
export function publicText(value) {
  let result=String(value??'');
  for(const [pattern, replacement] of RULES)result=result.replace(pattern,replacement);
  return readableDeviceNames(result);
}
export function publicName(item) {
  let label=String(item?.name??'');
  for(const rule of RULES)if(isContextual(rule,item))label=label.replace(rule[0],rule[1]);
  if(isMedia(item))for(const [pattern,fiction] of MEDIA_NAME_RULES)label=label.replace(pattern,fiction);
 return readableDeviceNames(label);
}
/** Stable UI labels; collisions get an explicit distinction, never change IDs. */
export function buildPublicNameIndex(items) {
  const result=new Map(),seen=new Set();
  for(const item of items) {
    const base=publicName(item);
    let label=base,number=2;
    while(seen.has(label.toLocaleLowerCase('en-US')))label=base+' — Edition '+number++;
    seen.add(label.toLocaleLowerCase('en-US'));
    result.set(item.id,label);
  }
  return result;
}

/** False positives for common terms are excluded outside media categories. */
export function hasUnresolvedPublicIPSignal(item, label=publicName(item)) {
  return RULES.some(rule=>isContextual(rule,item)&&new RegExp(rule[0].source,rule[0].flags.replace('g','')).test(label))
    || (isMedia(item)
      && MEDIA_NAME_RULES.some(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')).test(label)));
}
