/**
 * V51 — Family Only shared discoveries.
 * A shared catalog ID unlocked in ANY eligible Family Only campaign is unlocked
 * in EVERY campaign containing that ID. Classic progress is intentionally absent.
 * Does not share recipes, clues, achievements, last discovery or family-only items.
 * Pure and idempotent, so it also migrates V48/V49/V50 saved family profiles.
 */
export function sharedMembership(campaigns) {
  const owners = new Map();
  for (const campaign of campaigns) {
    for (const id of new Set(campaign.items)) {
      if (!owners.has(id)) owners.set(id, new Set());
      owners.get(id).add(campaign.id);
    }
  }
  return new Map([...owners].filter(([, families]) => families.size > 1));
}

export function synchronizeFamilyProfiles(input, campaigns) {
  const membership = sharedMembership(campaigns);
  const campaignsById = new Map(campaigns.map(c => [c.id, c]));
  const profiles = {...(input || {})};
  const discovered = new Map();

  // Only valid discoveries already in an eligible family may contribute.
  // Never import discoveries from Classic, or IDs outside their own campaign.
  for (const campaign of campaigns) {
    const profile = profiles[campaign.id];
    if (!profile || !Array.isArray(profile.unlocked)) continue;
    for (const id of profile.unlocked) {
      // Free starters are not earned discoveries: never leak them to other campaigns.
      if (campaign.starters.includes(id)) continue;
      if (!membership.get(id)?.has(campaign.id) || discovered.has(id)) continue;
      const record = Array.isArray(profile.ledger)
        ? profile.ledger.find(entry => Array.isArray(entry) && entry[0] === id)?.[1]
        : undefined;
      discovered.set(id, {from:campaign.id, at: record?.at ?? null});
    }
  }

  const received = {};
  for (const campaign of campaigns) {
    const earned = [...discovered].filter(([id]) => membership.get(id)?.has(campaign.id));
    if (!earned.length) { received[campaign.id] = []; continue; }

    const previous = profiles[campaign.id] || {};
    const allowed = new Set(campaign.items);
    const existing = new Set((Array.isArray(previous.unlocked) ? previous.unlocked : []).filter(id => allowed.has(id)));
    const nextUnlocks = new Set([...campaign.starters, ...existing]);
    const added = [];
    for (const [id] of earned) if (!nextUnlocks.has(id)) {
      nextUnlocks.add(id);
      added.push(id);
    }

    const prevLedger = Array.isArray(previous.ledger) ? previous.ledger : [];
    const nextLedger = new Map(prevLedger.filter(entry => Array.isArray(entry) && nextUnlocks.has(entry[0])));
    for (const [id, origin] of earned) {
      if (campaign.starters.includes(id) || nextLedger.has(id)) continue;
      nextLedger.set(id, {at: origin.at, source:'family-shared', fromFamily:origin.from});
    }
    const oldOrder = Array.isArray(previous.order) ? previous.order.filter(id => nextUnlocks.has(id)) : [];
    const order = [...new Set([...campaign.starters, ...oldOrder, ...earned.map(([id]) => id)])];

    profiles[campaign.id] = {
      ...previous,
      unlocked: [...nextUnlocks],
      known: Array.isArray(previous.known) ? previous.known : [],
      recent: Array.isArray(previous.recent) ? previous.recent : [],
      last: typeof previous.last === 'string' && nextUnlocks.has(previous.last) ? previous.last : null,
      ledger: [...nextLedger],
      order,
      clues: previous.clues && typeof previous.clues === 'object' ? previous.clues : {},
    };
    received[campaign.id] = added;
  }
  return {profiles, sharedIds:[...discovered.keys()], received};
}
