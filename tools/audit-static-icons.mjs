import { DATA } from '../client/src/legacy-data.js';
import { legacyIcon,setIconCatalog } from '../client/src/icons.js';
import assert from 'node:assert/strict';
const catalog=DATA.items.map(([name,category,year,note],id)=>({id,name,category,year,note}));
setIconCatalog(catalog);
const svgs=catalog.map((_,id)=>legacyIcon(id));
assert.equal(svgs.length,1591);assert.equal(new Set(svgs).size,1591);
assert.ok(svgs.every(svg=>svg.includes('<svg') && !svg.includes('gv-pose-') && !svg.includes('<animate')));
console.log('Static icon audit:',svgs.length,'SVG outputs, all distinct, no animation frames.');
