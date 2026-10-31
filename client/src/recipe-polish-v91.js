/**
 * V91 (owner request 31/10/2026): better companion houses must be harder to unlock.
 * Measured before: Hut (2 companions) was easier than Tent (1). Houses now form an upgrade chain:
 * Tent (House + Thread) → Hut (Tent + Wood) → Cabin (Hut + Door) → Cottage (Cabin + Chimney)
 * → Villa (Cottage + Staircase) → Castle (Villa + Castle Gate). House + Wood now gives Floorboards.
 * Same format as RECIPE_POLISH_V87; applied together with it. Saves keep everything discovered.
 */
export const RECIPE_POLISH_V91={version:91,
 adds:[["organic89:companion-tent","legacy:24","organic89:companion-hut"]],
 remaps:[["legacy:45","legacy:24","organic89:companion-hut","organic89:floorboards"]]};
