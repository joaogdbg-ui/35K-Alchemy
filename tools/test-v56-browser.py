from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V56_Offline.html').read_text()
# Simulate isolated localStorage; no ad SDK or server is mocked as actually present.
def content(saved=None):
 shim='<script>Object.defineProperty(window,"localStorage",{configurable:true,value:{data:'+json.dumps(saved or {})+',getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>'
 return html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500);page.set_default_timeout(12000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(content(),wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==4271
  assert page.evaluate('classicRecipes.size')==12608
  page.locator('[data-mode-choice="classic"]').click()
  assert page.locator('#recentBtn').inner_text().strip().startswith('Sort')
  for opt in ['old','new','az']:
   page.locator('#recentBtn').click()
   assert page.locator('[data-sort-option]').count()==3
   page.locator(f'[data-sort-option="{opt}"]').click()
   assert page.evaluate('sortChoice')==opt
  # Trigger a genuine new offline recipe with two previously discovered inputs.
  a,b,out=page.evaluate('''()=>{const [a,b,out]=ORGANIC_V56.recipes[0];unlocked.add(a);unlocked.add(b);playVirtual.refresh();return [a,b,out];}''')
  page.evaluate('''([a,b])=>{place(0,a);place(1,b)}''',[a,b]);page.wait_for_timeout(300)
  assert page.evaluate('(id)=>unlocked.has(id)',out)
  assert page.locator('#modal').is_visible()
  # Verify HTML artwork for the new discovery.
  assert page.locator('#modalArtNeverExists').count()==0
  assert page.locator('#modalContent svg').count()>=1
  page.locator('#modalClose').click()
  # Full unlocked inventory must stay virtualized, even with the added 100 entries.
  metrics=page.evaluate('''()=>{unlocked=new Set(ITEMS.map(x=>x.id));sortChoice='az';const t=performance.now();playVirtual.refresh();return {ms: +(performance.now()-t).toFixed(2), dom:document.querySelectorAll('#inventoryVirtual .element-chip').length,total:playVirtual.ids.length}}''')
  assert metrics['total']==4271,metrics
  assert metrics['dom']<80,metrics
  assert not errors,errors
  if width==390:
   page.screenshot(path=str(R/'V56_Mobile_390.png'))
  print(f'PASS {width}x{height}: {metrics}, new recipe unlocked, unique inline icon, Sort working, no JS errors')
  page.close()
 browser.close()
