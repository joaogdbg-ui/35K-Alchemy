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
export const PUBLIC_IP_SIGNALS = Object.freeze(
  RULES.map(([pattern])=>new RegExp(pattern.source,pattern.flags.replace('g','')))
);
export function publicText(value) {
  let result=String(value??'');
  for(const [pattern, replacement] of RULES)result=result.replace(pattern,replacement);
  return result;
}
export function publicName(item) {
  return publicText(item?.name??'');
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
