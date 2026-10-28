from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];html=(R/'35K_Alchemy_V67_Offline.html').read_text()
shim='<script>Object.defineProperty(window,"localStorage",{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>'
html=html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500);page.set_default_timeout(16000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==5162
  assert page.evaluate('classicRecipes.size')==13499
  page.locator('[data-mode-choice="classic"]').click()
  for opt in ['old','new','az']:
   page.locator('#recentBtn').click();page.locator(f'[data-sort-option="{opt}"]').click();assert page.evaluate('sortChoice')==opt
  a,b,out=page.evaluate('''()=>{const [a,b,out]=ORGANIC_V67.recipes[0];unlocked.add(a);unlocked.add(b);playVirtual.refresh();return [a,b,out]}''')
  page.evaluate('''([a,b])=>{place(0,a);place(1,b)}''',[a,b]);page.wait_for_timeout(230)
  assert page.evaluate('(id)=>unlocked.has(id)',out)
  assert page.locator('#modalContent svg').count()>0
  page.locator('#modalClose').click()
  metrics=page.evaluate('''()=>{unlocked=new Set(ITEMS.map(x=>x.id));sortChoice='az';const t=performance.now();playVirtual.refresh();return {ms:+(performance.now()-t).toFixed(1),dom:document.querySelectorAll('#inventoryVirtual .element-chip').length,total:playVirtual.ids.length}}''')
  assert metrics['total']==5162 and metrics['dom']<80,metrics
  assert not errors,errors
  if width==390:page.screenshot(path=str(R/'V67_Mobile_Dark_390.png'))
  print('PASS',width,height,metrics,'Classic / 3 Sort choices / V67 new recipe / SVG / virtualized inventory / no JS errors')
  page.close()
 browser.close()
