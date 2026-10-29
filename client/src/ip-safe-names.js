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
  [/\bNintendo 64DD\b/gi,'Orilux 64 Disk'],
  [/\bNintendo 64\b/gi,'Orilux 64'],
  [/\bNintendo\b/gi,'Orilux'],
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
  [/\bPlayStation Portal\b/gi,'Auralis Streamscreen'],
  [/\bPlayStation\b/gi,'Auralis'],
  [/\bPS Vita\b/gi,'Auralis Vista'],
  [/\bPSP\b/gi,'Auralis Pocket'],
  [/\bPS([1-5])\b/gi,'Auralis $1'],
  [/\bXbox Series X\b/gi,'AsterCube Zenith'],
  [/\bXbox Series S\b/gi,'AsterCube Nova'],
  [/\bXbox 360\b/gi,'AsterCube Orbit'],
  [/\bXbox One\b/gi,'AsterCube One'],
  [/\bXbox\b/gi,'AsterCube'],
  [/\bSega Genesis\b/gi,'Virex Origin'],
  [/\bSega Saturn\b/gi,'Virex Ring'],
  [/\bSega Dreamcast\b/gi,'Virex Lucent'],
  [/\bSega Game Gear\b/gi,'Virex Pocket'],
  [/\bSega Nomad\b/gi,'Virex Rover'],
  [/\bSega\b/gi,'Virex'],
  [/\bDreamcast\b/gi,'Lucent Orbit'],
  [/\bGame Gear\b/gi,'Pocket Arc'],
  [/\bAtari\b/gi,'Vextro'],
  [/\bSony\b/gi,'Auralis Works'],
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
  [/\bKonami\b/gi,'Kairosoft Arts'],
  [/\bSquare Enix\b/gi,'Crystalvale Studio']
]);

// Additional context-sensitive editorial mock game/media names. This list is a
// screening aid only, NOT a license or trademark-clearance finding.
const MEDIA_NAME_PAIRS = [["WarioWare","Pocket Mischief"],["Wario Land","Gilded Hills"],["Ocarina of Time","Chronoflute"],["A Link to the Past","Path Through Ages"],["The Wind Waker","Gale Baton"],["Twilight Princess","Dusk Princess"],["Breath of the Wild","Wildwind Breath"],["Tears of the Kingdom","Crownfall Tears"],["F-Zero","Velocity Zero"],["Star Fox","Nebula Fox"],["Fire Emblem","Cinder Sigil"],["Animal Crossing","Meadow Village"],["Pikmin","Spriglings"],["Splatoon","Inkstrike"],["Super Smash Bros","Champions Clash"],["Nintendogs","PetPals"],["Advance Wars","Frontier Tactics"],["Xenoblade","Aetherblade"],["Streets of Rage","Rebel Streets"],["Shinobi","Nightblade"],["Phantasy Star","Ethereal Star"],["Panzer Dragoon","Steel Drake"],["Virtua Fighter","Vector Duel"],["Crazy Taxi","Street Cab Chaos"],["Crash Bandicoot","Tumblefox"],["Spyro","Emberling Dragon"],["Ratchet & Clank","Cogtail and Bolt"],["Jak and Daxter","Jet and Bristle"],["Sly Cooper","Shade Fox"],["Uncharted","Lost Atlas"],["The Last of Us","The Last Ember"],["Ghost of Tsushima","Specter of the Isles"],["Bloodborne","Crimson Reliquary"],["Gran Turismo","Grand Motorway"],["LittleBigPlanet","Pocket Planet"],["Tekken","Iron Fists"],["Forza","Turbo Circuit"],["Gears of War","Iron Gears"],["Age of Empires","Age of Kingdoms"],["Half-Life","Half Dawn"],["Counter-Strike","Counterforce"],["Terraria","Caverncraft"],["Stardew Valley","Fernbrook Valley"],["Celeste","Cloudpeak"],["Cuphead","Teacup Hero"],["Undertale","Underpath"],["Hades","Underrealm"],["Dead Cells","Fallen Cells"],["Slay the Spire","Ascend the Tower"],["Among Us","Within the Crew"],["The Sims","Life Neighbors"],["SimCity","City Architect"],["Tomb Raider","Crypt Explorer"],["Chrono Trigger","Hourglass Trigger"],["Dragon Quest","Dragon Voyage"],["Persona","Mirrorbound"],["Elden Ring","Elder Circle"],["Dark Souls","Ashen Pilgrims"],["Monster Hunter","Beastward"],["Grand Theft Auto","Metro Outlaws"],["GTA","Metro Outlaws"],["Red Dead Redemption","Crimson Prairie"],["The Witcher","Wanderer of Runes"],["Fallout","Wasteland Echo"],["Mass Effect","Cosmic Resonance"],["Battlefield","Warfront"],["Rocket League","Turbo League"],["Guitar Hero","String Champion"],["Professor Layton","Professor Wren"],["Castlevania","Castle Eclipse"],["Bayonetta","Midnight Enchantress"],["Demon Slayer","Dusk Hunter"],["Attack on Titan","Giantfall"],["Bleach","Spirit Blade"],["Jujutsu Kaisen","Spectral Academy"],["Indiana Jones","Arden Explorer"],["Diablo","Infernal Depths"],["League of Legends","Dawn League"],["Baldur's Gate","Boulder Gate"],["Danganronpa","School Mystery Trial"]];
const MEDIA_NAME_RULES = Object.freeze(MEDIA_NAME_PAIRS.slice()
 .sort((a,b)=>b[0].length-a[0].length)
 .map(([original,fiction]) => {
   const escaped=original.replace(/[^A-Za-z0-9 ]/g,ch=>'\\'+ch);
   return [new RegExp('\\b'+escaped+'\\b','gi'),fiction];
 }));
const MEDIA_CATEGORIES=new Set(['game','film','movie','anime','manga','series','character','music']);
export const PUBLIC_IP_SIGNALS = Object.freeze(
  [...RULES,...MEDIA_NAME_RULES].map(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')))
);
export function publicText(value) {
  let result=String(value??'');
  for(const [pattern, replacement] of RULES)result=result.replace(pattern,replacement);
  return result;
}
export function publicName(item) {
  let label=publicText(item?.name??'');
 if(MEDIA_CATEGORIES.has(item?.category))for(const [pattern,fiction] of MEDIA_NAME_RULES)label=label.replace(pattern,fiction);
 return label;
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
  return RULES.some(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')).test(label))
    || (MEDIA_CATEGORIES.has(item?.category)
      && MEDIA_NAME_RULES.some(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')).test(label)));
}
