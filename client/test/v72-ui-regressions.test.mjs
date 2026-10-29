import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src = p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('discovering never resets inventory viewport to zero',()=>{
 const app=src('client/src/app.js');
 assert.match(app,/refresh\(\{resetScroll=false\}=\{\}\)/);
 assert.match(app,/const anchorId=this\.ids\[previousIndex\]/);
 assert.match(app,/this\.viewport\.scrollTop=Math\.floor\(index\/cols\)\*rowHeight\+intraRow/);
 assert.match(app,/function rerenderCollections\(\)\{playVirtual\.refresh\(\);/);
 assert.match(app,/playVirtual\.refresh\(\{resetScroll:true\}\)/);
});
test('craft top space is expanded only on phones with enough height',()=>{
 const css=src('client/src/styles.css');
 assert.match(css,/@media \(max-width:849px\) and \(min-height:701px\)/);
 assert.match(css,/\.craft-row\{transform:translateY\(9px\)\}/);
 assert.match(css,/\.workspace-content\{transform:none\}/);
});
