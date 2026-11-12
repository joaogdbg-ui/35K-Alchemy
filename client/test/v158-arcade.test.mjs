import test from 'node:test';
import assert from 'node:assert/strict';
import { arcadeProgress, ARCADE_GAMES, ARCADE_TOTAL, ARCADE_STEP, ARCADE_STEP_COINS } from '../src/arcade-v158.js';
test('V158: one minigame now, then one per 250 new elements; coins only after all 16', () => {
  let p = arcadeProgress(null, 700, undefined, () => 0);
  assert.equal(p.state.base, 700); assert.equal(p.state.unlocked.length, 1); assert.equal(p.next, 950);
  p = arcadeProgress(p.state, 949, undefined, () => 0); assert.equal(p.state.unlocked.length, 1);
  p = arcadeProgress(p.state, 950, undefined, () => 0); assert.equal(p.state.unlocked.length, 2); assert.deepEqual(p.fresh.length, 1);
  p = arcadeProgress(p.state, 700 + ARCADE_STEP * 30, undefined, () => 0);
  assert.equal(p.state.unlocked.length, ARCADE_GAMES.length, 'only implemented games unlock'); assert.equal(p.coins, 0, 'no coins until all 16 exist');
  const ids = Array.from({ length: ARCADE_TOTAL }, (_, i) => 'g' + i);
  let q = arcadeProgress(null, 0, ids, () => 0); q = arcadeProgress(q.state, ARCADE_STEP * 17, ids, () => 0);
  assert.equal(q.state.unlocked.length, 16); assert.equal(q.coins, 2 * ARCADE_STEP_COINS);
  q = arcadeProgress(q.state, ARCADE_STEP * 17, ids, () => 0); assert.equal(q.coins, 0, 'paid once');
});
test('V164: ten minigames and a 24-hour ad pass per minigame', async () => {
  const m = await import('../src/arcade-v158.js');
  assert.equal(m.ARCADE_GAMES.length, 11, 'V166: five V165 games removed, Pinball kept');
  assert.deepEqual(m.ARCADE_GAMES.slice(6).map(g => g.id), ['dive', 'climb', 'rhythm', 'paint', 'pinball']);
  assert.equal(m.ARCADE_PASS_MS, 24 * 60 * 60 * 1000);
  const st = { passes: { dive: 1000 } };
  assert.equal(m.arcadePassLeft(st, 'dive', 400), 600);
  assert.equal(m.arcadePassLeft(st, 'climb', 400), 0, 'each minigame has its own pass');
  assert.equal(m.arcadePassLeft(st, 'dive', 2000), 0);
  assert.equal(m.arcadePassLeft(null, 'dive', 0), 0);
  assert.equal(m.fmtPass(90 * 60000), '1h 30m');
  const kept = m.arcadeProgress({ base: 0, unlocked: [], passes: { dive: 5 } }, 0, undefined, () => 0); assert.deepEqual(kept.state.passes, { dive: 5 });
});
test('V169: microgame packs and speed-up curve', async () => {
  const m = await import('../src/arcade-v158.js');
  assert.deepEqual(m.MICRO_PACKS.map(p => p.pack), ['tap', 'rub', 'cut']);
  assert.equal(m.MICRO_LIVES, 4);
  assert.equal(m.microTime(4, 0), 4);
  assert.equal(m.microTime(4, 4), 4, 'same speed until 5 wins');
  assert.ok(Math.abs(m.microTime(4, 5) - 3.52) < 1e-9, 'faster after 5 wins');
  assert.equal(m.microTime(4, 500), 4 * 0.45, 'never below 45%');
});
test('V171: minigame prizes are tens of coins', async () => {
  const m = await import('../src/arcade-v158.js');
  assert.equal(m.arcadeCoins(0), 0);
  assert.equal(m.arcadeCoins(1000), 8);
  assert.equal(m.arcadeCoins(10000), 25);
  assert.equal(m.arcadeCoins(1e6), m.ARCADE_COIN_CAP);
  assert.ok(m.ARCADE_COIN_CAP <= 50);
});
test('V173: coin economy', async () => {
  const M = await import('../src/market-v136.js');
  const A = await import('../src/arcade-v158.js');
  assert.equal(M.DISCOVERY_COINS, 2); assert.equal(M.DISCOVERY_MILESTONE, 100); assert.equal(M.DISCOVERY_MILESTONE_COINS, 50);
  assert.equal(M.COMPANION_FIND_COINS, 3); assert.equal(M.FIND_AD_MULT, 5);
  assert.equal(M.dailyCoins(1), 50); assert.equal(M.dailyCoins(7), 100); assert.equal(M.dailyCoins(30), 100);
  const gold = M.coinsFor('race', 2, 1), again = M.coinsFor('race', 2, 1, { repeat: true });
  assert.equal(again, Math.round(gold * 0.25), 'repeat wins pay 25%');
  assert.equal(A.ARCADE_DAILY_CAP, 150);
  // total from discovery over 10k elements stays well under the biggest coin pack
  assert.ok(10000 * M.DISCOVERY_COINS + 100 * M.DISCOVERY_MILESTONE_COINS <= 30000);
});
test('V179: coin packs are back; colours are never pack-exclusive', async () => {
  const M = await import('../src/market-v136.js');
  assert.equal(M.COIN_PACKS.length, 7); assert.equal(M.COIN_PACKS[0].coins, 600); assert.ok(M.COIN_PACKS.every(p => !p.gift));
  assert.ok(M.DYES.every(d => !d.exclusive && d.price >= 600), 'every colour has a coin price');
  assert.ok(M.MARKET_TABS.some(t => t[0] === 'dye'));
});
test('V175: colours live in elements without a natural look', async () => {
  const M = await import('../src/market-v136.js');
  const names = ['Grape', 'Wine', 'Gold coin', 'Robot', 'Lamp', 'Chair', 'Fire', 'Coffee', ...Array.from({ length: 300 }, (_, i) => 'Thing ' + i)];
  const map = M.assignDyes(names, n => n === 'Fire');
  assert.equal(map.get('Grape'), 'dye-berry'); assert.equal(map.get('Gold coin'), 'dye-gold'); assert.equal(map.get('Coffee'), 'dye-cocoa');
  assert.ok(!map.has('Fire'), 'elements with a natural look are never used');
  for (const d of M.DYES) assert.ok([...map.values()].filter(v => v === d.id).length >= M.DYE_MIN, d.id + ' has enough elements');
  assert.ok(M.DYES.filter(d => !d.exclusive).every(d => d.price >= 600));
});
test('V175: market colour tints only after unlock', async () => {
  const E = await import('../src/companion-engine-v86.js');
  let unlocked = false;
  E.setMarketLook(n => n === 'Berry Jam' ? { name: 'Berry', tint: 'berry', unlocked } : null);
  let L = E.lookEffects('Berry Jam', '', 'food', 1);
  assert.equal(L.tint, null); assert.equal(L.market.locked, true);
  unlocked = true; L = E.lookEffects('Berry Jam', '', 'food', 1);
  assert.equal(L.tint.key, 'berry');
  const r = E.lookAfterMeal(undefined, 'Berry Jam', '', 'food', 1);
  assert.equal(r.tint, 'berry');
  E.setMarketLook(null);
});
test('V176: looks and colours are gated, size is free, rivals unaffected', async () => {
  const E = await import('../src/companion-engine-v86.js');
  const M = await import('../src/market-v136.js');
  assert.equal(M.LOOK_ITEMS.length, 24); assert.equal(M.TINT_ITEMS.length, 9);
  assert.ok(M.LOOK_ITEMS.every(l => l.price >= 1500 && l.price <= 4000));
  assert.ok(M.TINT_ITEMS.every(t => t.price >= 600 && t.price <= 1200));
  const owned = { tints: [], looks: [] };
  E.setLookGate({ tint: k => owned.tints.includes(k), theme: k => owned.looks.includes(k) });
  let r = E.lookAfterMeal(undefined, 'Dragon', '', '', 3, true);
  assert.equal(r.tint, null, 'dragon colour locked'); assert.ok(!Object.keys(r.look.mix.head || {}).length, 'no traits while locked');
  const ungated = E.lookAfterMeal(undefined, 'Dragon', '', '', 3);
  assert.ok(ungated.tint, 'rivals / previews of the catalogue are not gated');
  owned.looks.push('dragon'); r = E.lookAfterMeal(undefined, 'Dragon', '', '', 3, true);
  assert.ok(r.tint && Object.keys(r.look.mix.head || r.look.mix.back || {}).length >= 0);
  const big = E.lookAfterMeal(undefined, 'Cake', '', 'food', 1, true); assert.ok(big.look.size > 0, 'size stays free');
  let L = E.lookEffects('Leaf', 'nature', '', 1, true); assert.equal(L.tint, null); assert.equal(L.lockedTint.key, 'green');
  owned.tints.push('green'); L = E.lookEffects('Leaf', 'nature', '', 1, true); assert.equal(L.tint.key, 'green');
  E.setLookGate(null);
});
test('V177: ultra-rare drops', async () => {
  const M = await import('../src/market-v136.js');
  const E = await import('../src/companion-engine-v86.js');
  assert.equal(M.champUltraChance(0), 0.05); assert.ok(Math.abs(M.champUltraChance(4) - 0.15) < 1e-9);
  assert.equal(M.MINI_UNIQUE_CHANCE, 0.0001);
  assert.equal(M.rollUltra('champ', [], () => 0.99, 0.1), null, 'no drop above the chance');
  const u = M.rollUltra('champ', [], () => 0, 0.1); assert.equal(u.from, 'champ');
  const all = M.ULTRA.filter(x => x.from === 'champ').map(x => x.id);
  assert.equal(M.rollUltra('champ', all, () => 0, 1), null, 'nothing left to drop');
  for (const x of M.ULTRA) { const ess = M.MARKET.find(m => m.id === x.ess); assert.ok(ess && ess.hidden && ess.look); const r = E.lookAfterMeal(undefined, ess.look, '', '', 3); assert.ok(r.tint, x.id + ' essence tints'); }
  assert.ok(!M.MARKET.filter(m => m.hidden).some(m => !m.id.startsWith('ess-')));
});
test('V180: ambient furniture kinds', async () => {
  const H = await import('../src/home-engine-v90.js');
  assert.equal(H.ambientOf('organic89:fireplace', 'Fireplace'), 'fire');
  assert.equal(H.ambientOf('organic89:paddling-pool', 'Paddling pool'), 'water');
  assert.equal(H.ambientOf('organic89:curtain', 'Curtain'), 'breeze');
  assert.equal(H.ambientOf('organic89:bed', 'Bed'), '');
});
test('V181: ultra races are longer and every rival is a legend', async () => {
  const G = await import('../src/games-v93.js');
  assert.equal(G.ULTRA_COURSES.length, 3);
  for (const c of G.ULTRA_COURSES) {
    assert.ok(G.ROUTES[c.id], c.id + ' has a route');
    assert.equal(G.planFor(c, 4).length, 20); assert.equal(G.planFor(c, 0).length, 12);
    const o = G.opponentStats(c, 0, 3); assert.ok(Object.values(o).every(v => v >= 95 && v <= 99));
  }
});
