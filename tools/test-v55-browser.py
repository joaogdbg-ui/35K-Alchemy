"""V55: real Chromium Sort checks, discovery and rendering scalability on full inventory."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V55_Offline.html').read_text(encoding='utf-8')
def with_storage(data=None):
 seed=json.dumps(data or {})
 shim=f'''<script>Object.defineProperty(window,'localStorage',{{configurable:true,value:{{data:{seed},getItem(k){{return this.data[k]??null}},setItem(k,v){{this.data[k]=String(v)}},removeItem(k){{delete this.data[k]}}}}}});</script>'''
 return html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  p=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  p.set_default_timeout(12000);errors=[];p.on('pageerror',lambda err:errors.append(str(err)))
  p.set_content(with_storage(),wait_until='domcontentloaded')
  assert p.evaluate('ITEMS.length')==4171
  assert p.evaluate('classicRecipes.size')==12461
  p.locator('[data-mode-choice="classic"]').click()
  assert p.locator('#recentBtn').inner_text().strip().startswith('Sort')
  assert p.locator('#playFamilyLabel').inner_text()=='All families'
  def visible_names():return p.locator('#inventoryVirtual .element-chip .chip-label').all_inner_texts()
  assert visible_names()[:4]==['Air','Earth','Fire','Water'],visible_names()
  p.locator('#recentBtn').click()
  assert p.locator('[data-sort-option]').count()==3
  assert p.locator('#modalContent').get_by_text('A–Z').count()==1
  p.locator('[data-sort-option="old"]').click()
  assert visible_names()[:4]==['Water','Fire','Earth','Air'],visible_names()
  assert p.evaluate('sortChoice')=='old'
  p.locator('#recentBtn').click();p.locator('[data-sort-option="new"]').click()
  assert visible_names()[:4]==['Air','Earth','Fire','Water'],visible_names()
  assert p.evaluate('sortChoice')=='new'
  # Sort is an ordering choice, not a change to the unlocked set.
  assert p.evaluate('unlocked.size')==4
  p.locator('#recentBtn').click();p.locator('[data-sort-option="az"]').click()
  assert visible_names()[:4]==['Air','Earth','Fire','Water']
  # Discover Steam then verify it is the first item when choosing New first.
  p.locator('#inventoryVirtual .element-chip[data-id="legacy:0"]').click()
  p.locator('#inventoryVirtual .element-chip[data-id="legacy:1"]').click()
  p.wait_for_timeout(290)
  assert p.evaluate("unlocked.has('legacy:4')")
  if p.locator('#modal').is_visible():p.locator('#modalClose').click()
  p.locator('#recentBtn').click();p.locator('[data-sort-option="new"]').click()
  assert visible_names()[0]=='Steam',visible_names()
  # Persist order with reload; current mode state should be read from localStorage.
  saved=p.evaluate('localStorage.data')
  p.close()
  p=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  p.set_default_timeout(12000);errors=[];p.on('pageerror',lambda err:errors.append(str(err)))
  p.set_content(with_storage(saved),wait_until='domcontentloaded')
  assert p.evaluate('sortChoice')=='new',p.evaluate('sortChoice')
  # simulate large unlocked catalogue to assess virtual rendering cost
  metrics=p.evaluate('''()=>{unlocked=new Set(ITEMS.map(i=>i.id));const t=performance.now();playVirtual.refresh();const elapsed=performance.now()-t;return {ms:+elapsed.toFixed(1),domTiles:document.querySelectorAll('#inventoryVirtual .element-chip').length,total:playVirtual.ids.length,columns:playVirtual.cols}}''')
  assert metrics['total']==4171,metrics
  assert metrics['domTiles']<80,metrics
  assert not errors,errors
  if width==390:
   p.screenshot(path=str(R/'V55_Sort_Mobile_390.png'))
   p.locator('#recentBtn').click();p.screenshot(path=str(R/'V55_Sort_Menu_390.png'))
  print(f'PASS {width}x{height}: A-Z, Old, New, discovery, saved choice, {metrics["total"]} items / {metrics["domTiles"]} rendered, {metrics["ms"]}ms refreshed, no JS errors')
  p.close()
 browser.close()
