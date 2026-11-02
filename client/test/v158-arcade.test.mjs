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
test('V163: ten minigames and a 30-minute ad pass', async () => {
  const m = await import('../src/arcade-v158.js');
  assert.equal(m.ARCADE_GAMES.length, 10);
  assert.deepEqual(m.ARCADE_GAMES.slice(6).map(g => g.id), ['dive', 'climb', 'rhythm', 'paint']);
  assert.equal(m.ARCADE_PASS_MS, 30 * 60 * 1000);
  assert.equal(m.arcadePassLeft({ passUntil: 1000 }, 400), 600);
  assert.equal(m.arcadePassLeft({ passUntil: 1000 }, 2000), 0);
  assert.equal(m.arcadePassLeft(null, 0), 0);
});
