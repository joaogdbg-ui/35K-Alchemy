import test from 'node:test';
import assert from 'node:assert/strict';
import { themedArt, recolorSvg, THEME_MAPS, THEME_PROPS } from '../src/games-theme-v151.js';
import { STADIUM_ART_V95 } from '../src/stadium-art-v95.js';
import * as g from '../src/games-v93.js';
test('V151: every theme race has its own recoloured map and props', () => {
  for (const c of g.THEME_COURSES) {
    const t = themedArt(STADIUM_ART_V95, c.id);
    assert.ok(t && THEME_PROPS[c.id], c.id);
    for (const k of ['run', 'climb', 'swim', 'sky', 'mid']) assert.notEqual(t[k], STADIUM_ART_V95[k], `${c.id} ${k} recoloured`);
    const svg = g.courseSvg(g.buildCourse(g.planFor(c, 2), 3), t, { prop: t.prop, recolor: x => recolorSvg(x, t.map) });
    assert.ok(svg.startsWith('<svg'));
  }
  assert.equal(recolorSvg('#8FBF68', THEME_MAPS.inferno) === '#8FBF68', false);
});
test('V151: School tricks give game perks', () => {
  assert.deepEqual(Object.keys(g.SKILL_PERKS).sort(), ['dance', 'draw', 'drums', 'juggle', 'magic', 'sing']);
  assert.equal(g.perkOf({ sing: 5 }, 'sing'), 0.3);
  assert.equal(g.perkOf({}, 'magic'), 0);
});
