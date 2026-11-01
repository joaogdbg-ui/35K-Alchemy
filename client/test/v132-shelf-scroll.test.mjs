import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('V132: the element list scroller sits outside the toolbar (toolbar div is closed)',()=>{
 const start=html.indexOf('id="shelfToolbar"'),scroll=html.indexOf('id="inventoryScroll"');assert.ok(start>0&&scroll>start);
 const seg=html.slice(html.lastIndexOf('<div',start),html.lastIndexOf('<div',scroll));const opens=(seg.match(/<div\b/g)||[]).length,closes=(seg.match(/<\/div>/g)||[]).length;
 assert.equal(opens,closes,'every div opened in the toolbar is closed before the list');
});
