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
