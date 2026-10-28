"""Offline V30 game browser regressions: semantic artwork, recipe priority, saves and responsive UI."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from collections import Counter
import json
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V30_Offline.html').read_text()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (360,390,1280):
  page=browser.new_page(viewport={'width':width,'height':860},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  stats=page.evaluate('''() => {
   let samples=['Sun','Sky','Wind','Crystal','Cloud','Rain','Moon','Star','Fire','Lightning','Sword','Dragon','Camera'];
   return {itemCount:ITEMS.length,recipeCount:recipes.size,semantic:sampleNames=samples.map(n=>{
    let it=ITEMS.find(x=>x.name===n);return {n,found:!!it,semantic:!!GAMEVERSE_ART_V30_SEMANTIC[n.toLowerCase()],svg:!!it&&staticArt(it).startsWith('<svg')}
   }),artworks:new Set(ITEMS.map(i=>staticArt(i))).size,
   dataNew:GAMING_V30.items.length,recipesNew:GAMING_V30.recipes.length,
   oldRecipe:recipes.get(pairKey('legacy:0','legacy:1')),
   oldName:byId.get('legacy:545')?.name,
   batch:!!document.getElementById('batchOpen')
   }
  }''')
  assert stats['itemCount']==3402 and stats['recipeCount']==8555,stats
  assert stats['oldRecipe']=='legacy:4' and stats['oldName']=='Sword',stats
  assert not errors,errors
  if width==390:
   print('ARTWORK COUNT',stats['artworks'])
   print('SEMANTIC SAMPLES',stats['semantic'])
   page.locator('#playFamily').click()
   assert page.locator('#modalContent').inner_text().find('Choose a family')>=0
   assert page.locator('[data-inventory-family]').count()>=10
   page.locator('[data-inventory-family="all"]').click()
   # New titles can be revealed from imported progress safely, without renumbering.
   id=page.evaluate('''() => GAMING_V30.items[0].id''')
   page.evaluate('''id=>{unlocked.add(id);save();playVirtual.refresh();}''',id)
   assert page.evaluate('''id=>JSON.parse(localStorage.getItem('gameverse_dynamic_v11')).unlocked.includes(id)''',id)
   page.evaluate("() => {unlocked.add('legacy:141');unlocked.add('legacy:65');unlocked.add('legacy:12');unlocked.add('legacy:34');playVirtual.refresh()}")
   names=['Sun','Sky','Wind','Crystal']
   page.evaluate('''() => {const examples=['Sun','Sky','Wind','Crystal'];
     const root=document.createElement('div');root.id='art-test';root.style='position:fixed;z-index:2000;inset:0;background:#faf8f4;display:grid;grid-template-columns:repeat(2,1fr);align-content:center;gap:15px;padding:18px';
     root.innerHTML=examples.map(n=>{const x=ITEMS.find(i=>i.name===n);return `<div style="border:1px solid #ddd;border-radius:14px;padding:12px;display:grid;justify-items:center;font:600 16px Arial"><div style="width:120px;height:120px">${staticArt(x)}</div>${n}</div>`;}).join('');
     document.body.appendChild(root);
   }''')
   page.add_style_tag(content='#art-test svg{width:120px;height:120px}')
   page.screenshot(path=str(root/'35K_Alchemy_V30_Icons_In_Game.png'))
  print('PASS',width,stats['itemCount'],'elements',stats['recipeCount'],'recipes',len(errors),'errors')
  page.close()
 browser.close()
