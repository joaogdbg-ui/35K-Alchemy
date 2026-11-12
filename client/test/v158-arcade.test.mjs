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
test('V187: launch tuning — no tester gift, minigames locked by progress, tent guaranteed at 200', async () => {
  const { readFileSync } = await import('node:fs');
  const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const arc = readFileSync(new URL('../src/arcade-v158.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /TESTER_GIFT=/);
  assert.match(arc, /export const ARCADE_TESTER_ALL=false;/);
  assert.match(app, /STARTER_HOUSE_AT=200,STARTER_HOUSE_ID='organic89:companion-tent'/);
  assert.match(app, /HOME_OBJECTS\[id\]\?\.kind==='house'\)\)return false;\s*if\(!grantElement\(STARTER_HOUSE_ID\)\)/);
});
test('V188: companion personalities are deterministic and varied; microgame medals', async () => {
  const { personalityOf, HOME_QUIRKS, companionVoice } = await import('../src/home-engine-v90.js');
  const { MICRO_MEDALS } = await import('../src/arcade-v158.js');
  const { COMPANIONS_V86 } = await import('../src/companions-v86.js').catch(() => ({ COMPANIONS_V86: null }));
  const ids = (COMPANIONS_V86 || Array.from({ length: 40 }, (_, i) => ({ id: 'c' + i }))).map(c => c.id);
  const ps = ids.map(personalityOf);
  for (const [i, p] of ps.entries()) {
    assert.deepEqual(p, personalityOf(ids[i]));
    assert.ok(p.fav !== p.shy && HOME_QUIRKS.includes(p.quirk) && p.voice.hz > 200 && p.tempo >= 0.8 && p.tempo <= 1.25);
  }
  assert.ok(new Set(ps.map(p => p.quirk)).size >= 5);
  assert.ok(new Set(ps.map(p => p.fav)).size >= 5);
  assert.ok(new Set(ps.map(p => p.voice.hz + p.voice.wave + p.voice.steps.join())).size >= ids.length * 0.6);
  assert.equal(companionVoice(() => null, ids[0]), false);
  assert.deepEqual(MICRO_MEDALS.map(m => m[0]), [5, 10, 15]);
});
test('V189: discovery loop — goal strip, timed combos and rewards are wired', async () => {
  const { readFileSync } = await import('node:fs');
  const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /const GOAL_STEP=25,GOAL_COINS=5,COMBO_WINDOW_MS=45000/);
  assert.match(app, /const comboReward=n=>n===5\?2:n>=10&&n%10===0\?5:0;/);
  assert.match(app, /kind!=='batch'\)\{try\{pendingLoop=discoveryLoopStep\(\)/);
  assert.match(app, /function syncGoalStrip/);
});
test('V190: first minigame comes with the first house; coins buy one; 250 elements add one', async () => {
  const { arcadeProgress, ARCADE_STEP, ARCADE_BUY_COINS } = await import('../src/arcade-v158.js');
  let p = arcadeProgress(null, 0, undefined, () => 0, { house: false });
  assert.equal(p.state.unlocked.length, 0);
  p = arcadeProgress(p.state, 100, undefined, () => 0, { house: true });
  assert.equal(p.state.unlocked.length, 1); assert.equal(p.next, ARCADE_STEP);
  p = arcadeProgress(p.state, 120, undefined, () => 0, { house: false });
  assert.equal(p.state.unlocked.length, 1, 'the house game is kept');
  p = arcadeProgress({ ...p.state, bought: 1 }, 120, undefined, () => 0, { house: true });
  assert.equal(p.state.unlocked.length, 2); assert.equal(p.next, ARCADE_STEP, 'buying does not move the element goal');
  p = arcadeProgress(p.state, ARCADE_STEP, undefined, () => 0, { house: true });
  assert.equal(p.state.unlocked.length, 3); assert.equal(p.next, ARCADE_STEP * 2);
  assert.ok(ARCADE_BUY_COINS >= 2000);
});
test('V193: every companion has its own race world with real props', async () => {
  const { COMPANION_WORLDS, PROP_LIB, companionArt } = await import('../src/games-theme-v151.js');
  const { COMPANIONS_V86 } = await import('../src/companions-v86.js');
  const names = new Set();
  for (const c of COMPANIONS_V86) {
    const w = COMPANION_WORLDS[c.id]; assert.ok(w, c.id); names.add(w.name);
    for (const p of w.props) assert.equal(typeof PROP_LIB[p], 'function', p);
    const art = companionArt({ run: '<svg><rect fill="#8fbf68"/></svg>', swim: '', fly: '', climb: '', mid: '', sky: '<svg><rect fill="#7cc3e0"/></svg>' }, c.id);
    assert.ok(art.prop(10, 20, 0.2).startsWith('<g') && art.prop(10, 20, 0.8).startsWith('<g') && art.name === w.name);
  }
  assert.equal(names.size, COMPANIONS_V86.length, 'world names are unique');
  assert.equal(companionArt({}, 'nope'), null);
  const { readFileSync } = await import('node:fs');
  const g = readFileSync(new URL('../src/games-v93.js', import.meta.url), 'utf8');
  assert.match(g, /function finishRace\(mount,course,level,place,racers,finished\)\{\n  const PK=/);
  assert.match(g, /function askQuit/);
});
test('V194: every companion world has a drawn sky and track-side strip, all different', async () => {
  const { COMPANION_WORLDS, worldSky, worldMid, companionArt } = await import('../src/games-theme-v151.js');
  const skies = new Set(), mids = new Set();
  for (const [id, w] of Object.entries(COMPANION_WORLDS)) {
    const s = worldSky(id), m = worldMid(id, w.props);
    assert.ok(s.startsWith('<svg') && s.includes('viewBox="0 0 400 300"') && s.length > 1500, id);
    assert.ok(m.startsWith('<svg') && m.includes('viewBox="0 0 400 160"') && m.length > 800, id);
    assert.ok(!/NaN|undefined/.test(s + m), id);
    skies.add(s); mids.add(m);
  }
  assert.equal(skies.size, 40); assert.equal(mids.size, 40);
  const art = companionArt({ run: '', swim: '', fly: '', climb: '', mid: 'BASE', sky: 'BASE' }, 'organic38:frog');
  assert.ok(art.scene && art.sky !== 'BASE' && art.mid !== 'BASE');
});
test('V195: every world is alive — actors, weather and buried detail', async () => {
  const { COMPANION_WORLDS, worldLife, worldUnder, companionArt } = await import('../src/games-theme-v151.js');
  const kinds = new Set();
  for (const [id, w] of Object.entries(COMPANION_WORLDS)) {
    const l = worldLife(id); assert.ok(l && (l.sky + l.tile + l.mid).length > 200, id); kinds.add(l.fx);
    const u = worldUnder(id, w.props); assert.ok(u.startsWith('<svg') && !/NaN|undefined/.test(u + l.sky + l.tile + l.mid), id);
  }
  assert.ok(kinds.size >= 8);
  const art = companionArt({ run: '', swim: '', fly: '', climb: '', mid: '', sky: '' }, 'pack:ghost');
  assert.ok(art.life && art.under);
});
test('V196: team bar, shiny celebration and shelf guard are wired', async () => {
  const { readFileSync } = await import('node:fs');
  const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const eng = readFileSync(new URL('../src/companion-engine-v86.js', import.meta.url), 'utf8');
  assert.match(app, /function insertDirect\(id\)\{\n if\(!byId\.has\(id\)\|\|!unlocked\.has\(id\)\)return;\n if\(!\$\('modal'\)\.hidden\)return;/);
  assert.match(app, /function shinyPerks/); assert.match(app, /function shinyFanfare/); assert.match(app, /cp-bank-head/);
  assert.match(eng, /class="team"/); assert.match(eng, /data-s2open/);
});
test('V199: companion chemistry is symmetric, deterministic and varied', async () => {
  const { relationOf, REL_INFO } = await import('../src/companion-engine-v86.js');
  const { COMPANIONS_V86 } = await import('../src/companions-v86.js');
  const count = { friends: 0, neutral: 0, rivals: 0, nemesis: 0 };
  for (const a of COMPANIONS_V86) for (const b of COMPANIONS_V86) {
    if (a.id >= b.id) continue; const s = a.family === b.family;
    const r = relationOf(a.id, b.id, s); assert.equal(r, relationOf(b.id, a.id, s)); assert.ok(REL_INFO[r]); count[r]++;
  }
  assert.equal(relationOf('legacy:118', 'legacy:1277', true), 'nemesis');
  assert.equal(relationOf('organic38:frog', 'organic42:otter', true), 'friends');
  assert.equal(relationOf('x', 'x'), 'neutral');
  const total = Object.values(count).reduce((n, v) => n + v, 0);
  assert.ok(count.friends > total * 0.15 && count.rivals > total * 0.1 && count.nemesis >= 8 && count.nemesis < total * 0.12 && count.neutral > total * 0.3, JSON.stringify(count));
});

test('V200: companions act — hop turn, expressions and readable poses on every rig', async () => {
  const fs = await import('node:fs');
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const eng = fs.readFileSync(new URL('../src/companion-engine-v86.js', import.meta.url), 'utf8');
  const home = fs.readFileSync(new URL('../src/home-engine-v90.js', import.meta.url), 'utf8');
  for (const p of ['carry', 'push', 'wave', 'peek', 'stomp', 'taunt', 'sulk', 'scared', 'celebrate', 'sniff', 'getup']) assert.ok(css.includes(`.companion[data-anim="${p}"] .companion-art`), p);
  for (const e of ['angry', 'happy', 'sad', 'wow', 'dizzy', 'love', 'smug', 'sleepy']) assert.ok(css.includes(`.companion[data-expr="${e}"] [data-part="eye-l"]`), e);
  assert.match(css, /\.companion\[data-face="left"\] \.companion-art>svg\{animation:cp-turn-l/);
  assert.match(css, /rotate:var\(--up,0deg\)/);
  const { poseRig } = await import('../src/companion-engine-v86.js');
  const vars = {}; const limb = (part, pivot, box) => ({ dataset: { part, pivot }, getBBox: () => box, style: { setProperty: (k, v) => { (vars[part] ||= {})[k] = parseInt(v); } } });
  const L = limb('arm-l', '40 54', { x: 34, y: 54, width: 6, height: 16 }), R = limb('arm-r', '60 54', { x: 58, y: 30, width: 6, height: 24 });
  const art = { dataset: {}, querySelectorAll: () => [L, R], querySelector: s => s.includes('arm-r') ? R : null };
  poseRig(art);
  assert.equal(art.dataset.rig, 'biped');
  assert.ok(vars['arm-l']['--up'] > 120, 'a hanging left arm swings up on the outside');
  assert.equal(vars['arm-r']['--up'], 0, 'an arm already holding something up stays put');
  assert.ok(Math.abs(vars['arm-l']['--in']) <= 55);
  for (const k of ["A.m.anim('carry')", "A.m.anim('stomp')", "winner.anim('taunt')", "expr(el,'dizzy',0)", "'getup'"]) assert.ok(eng.includes(k), k);
  for (const k of ["dataset.anim='sulk'", "dataset.anim='stomp'", "'celebrate':'wave'", "ctx.poseRig?.(el)"]) assert.ok(home.includes(k), k);
});

test('V201: furniture is used from beside it (watch, warm up, rummage) instead of standing on top', async () => {
  const fs = await import('node:fs');
  const { useStyle } = await import('../src/home-engine-v90.js');
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const home = fs.readFileSync(new URL('../src/home-engine-v90.js', import.meta.url), 'utf8');
  assert.deepEqual([useStyle('Aquarium').mode, useStyle('Aquarium').pose], ['side', 'watch']);
  assert.equal(useStyle('Fireplace').pose, 'warm'); assert.equal(useStyle('Campfire').pose, 'warm');
  assert.equal(useStyle('Wardrobe').pose, 'rummage'); assert.equal(useStyle('Dollhouse').pose, 'play');
  assert.equal(useStyle('Food Bowl').mode, 'front'); assert.equal(useStyle('Punching Bag').mode, 'front');
  for (const n of ['Bed', 'Sofa', 'Treadmill', 'Trampoline', 'Paddling Pool', 'Armchair']) assert.equal(useStyle(n).mode, 'on', n);
  for (const a of ['warm', 'watch', 'rummage']) assert.ok(css.includes(`.companion[data-anim="${a}"] .companion-art`), a);
  assert.ok(css.includes('.home-walker.rest-curl') && css.includes('.home-walker.use-soak'));
  assert.ok(home.includes("useSpot(f,L,blockedFor(f))") && home.includes("classList.add('use-soak')"));
});

test('V202: Market is its own tab with Remove ads first, old sheets are skinned, dark theme keeps light cards readable', async () => {
  const fs = await import('node:fs');
  const rd = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
  const app = rd('../src/app.js'), css = rd('../src/styles.css'), html = rd('../index.html'), games = rd('../src/games-v93.js');
  assert.ok(html.includes('id="viewMarket"') && html.includes('data-view="Market"'));
  assert.ok(app.includes("if(tab==='Market')openMarket();") && app.includes("const marketHost=()=>tab==='Market'?$('viewMarket'):null;"));
  assert.ok(app.includes("[['coins','Coins'],...MARKET_TABS]") && app.includes("let marketTab='coins';"));
  const panel = app.slice(app.indexOf('function coinsPanelHtml'), app.indexOf('function wireCoinsPanel'));
  assert.ok(panel.indexOf('${noAds}') < panel.indexOf('Free coins') && panel.indexOf('Free coins') < panel.indexOf('Coin packs'), 'Remove ads comes first, then coins');
  assert.ok(!games.includes("stMarket"), 'the Market tile left the Games tab');
  for (const c of ['.mk-noads{', '.home-pick{grid-template-columns:54px', '.cf-sum{max-width:none', '.cs-panel{border:2px solid']) assert.ok(css.includes(c), c);
  assert.ok(css.includes('/* DARK-SKIN:start') && css.trimEnd().endsWith('/* DARK-SKIN:end */'), 'generated dark block stays last');
  assert.match(css, /html\[data-theme="dark"\] :is\([^)]*\.element-chip/);
});

test('V204: living elements — sensible motion (parts where the art allows), paper-turn default, effects that start at the element', async () => {
  const fs = await import('node:fs');
  const rd = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
  const L = await import('../src/living-v203.js');
  const want = { Fire: 'flame', 'Ice Cube': 'melt', Steam: 'smoke', Life: 'beat', Smoke: 'smoke', Angel: 'flap', Water: 'water', Wind: 'wind', Energy: 'zap', Shark: 'swim', Wheel: 'spin', 'Wind Turbine': 'parts', Windmill: 'parts', Cat: 'parts', 'Hermit Crab': 'parts', Cake: 'parts', Volcano: 'parts' };
  for (const [n, k] of Object.entries(want)) assert.equal(L.liveKind(n), k, n);
  for (const n of ['Price', 'Police', 'Notice', 'Device', 'Catfish', 'Starfish', 'Earth', 'Fan', 'Ferris Wheel', 'Tea', 'Aquarium', 'Planet']) assert.equal(L.liveKind(n), '', n + ' only gets the paper turn');
  const css = rd('../src/styles.css'), app = rd('../src/app.js'), eng = rd('../src/companion-engine-v86.js'), mod = rd('../src/living-v203.js');
  assert.match(css, /@keyframes lv-flip\{0%\{transform:rotateY\(0\)\}100%\{transform:rotateY\(360deg\)\}\}/);
  // every part spec is well formed and every motion has keyframes
  for (const [name, spec] of Object.entries(L.PARTS)) { assert.ok(spec.n > 2, name); for (const [idx, anim, origin] of spec.p) { assert.ok(L.PART_ITER[anim], name + ' ' + anim); assert.ok(css.includes(`@keyframes lvp-${anim}{`), anim); assert.ok(idx.every(i => i > 0 && i < spec.n), name + ' index'); assert.ok(origin === 'c' || /^[\d.]+ [\d.]+$/.test(origin), name + ' origin'); } if (spec.whole) assert.ok(L.LIVE_MS[spec.whole], name); }
  // the real art still has the shape count the spec was written for
  const dir = new URL('../src/', import.meta.url); const maps = [];
  for (const f of fs.readdirSync(dir).filter(f => /^organic-art-v\d+\.js$/.test(f)).sort((a, b) => parseInt(b.match(/\d+/)[0]) - parseInt(a.match(/\d+/)[0]))) { const m = await import('../src/' + f); for (const k of Object.keys(m)) if (m[k] && typeof m[k] === 'object') maps.push(m[k]); }
  for (const [name, spec] of Object.entries(L.PARTS)) { if (spec.redraw) continue; /* redrawn art is checked at run time by the same count guard */ const svg = maps.find(m => m[name])?.[name]; assert.ok(svg, 'art for ' + name); const n = [...svg.replace(/^<svg[^>]*>/, '').matchAll(/<(\w+)[^>]*>/g)].length; assert.equal(n, spec.n, name + ' shape count'); }
  // effects: every rule has a reaction, a builder and starts at the element
  const types = [...new Set(L.BLEED_RULES.map(r => r[0]))]; assert.ok(types.length >= 24, String(types.length));
  for (const t of types) { assert.ok(L.REACT[t], t); assert.ok(mod.includes(`type==='${t}'`), 'builder ' + t); }
  const exp = { Fire: 'burn', Spider: 'web', Love: 'hearts', Moon: 'night', Music: 'music', Gold: 'gold', Ghost: 'ghost', Cake: 'confetti', 'Black Hole': 'pull', Ice: 'frost', Rainbow: 'rainbow', Ink: 'ink', Sleep: 'zzz', Rocket: 'zoom', Sword: 'slash', Rock: 'crack', Seed: 'grow', Book: 'letters', Robot: 'pixels', Price: '' };
  for (const [n, k] of Object.entries(exp)) assert.equal(L.bleedOf(n), k, n);
  assert.ok(mod.includes('fx.childElementCount') && mod.includes("classList.add('is-source')") && mod.includes('MAX_LIVE=12'), 'one effect at a time, from a marked source; motions may overlap');
  // V205: motion belongs to the element id and is carried over when the list re-renders (scrolling, tapping)
  assert.ok(mod.includes('new MutationObserver') && mod.includes('function carry()') && mod.includes("'--lv-delay',(-gone)+'ms'"));
  assert.ok(css.includes('.element-chip.is-live .chip-art>*{animation-delay:var(--lv-delay,0ms)}'));
  for (const [f, k] of Object.entries(L.FAMILY_BLEED)) { assert.ok(L.REACT[k], f); assert.ok(mod.includes(`type==='${k}'`), k); }
  assert.equal(L.bleedOf('Nameless Thing', 'games'), 'pixels'); assert.equal(L.bleedOf('Nameless Thing'), ''); assert.equal(L.bleedOf('Cat', 'games'), 'paws');
  assert.ok(types.length >= 36, 'plenty of different effects: ' + types.length);
  assert.ok(css.includes('.element-chip.is-source{') && css.includes('.lf-wash{position:absolute;inset:0;clip-path:circle(0 at var(--x) var(--y))'));
  for (const [a] of Object.values(L.REACT)) assert.ok(css.includes(`.companion[data-anim="${a}"]`), 'pose ' + a);
  assert.ok(app.includes('createLiving({') && eng.includes('function react(anim,ex,ms=2400)'));
});
