"""V54: real Chromium tap animation + nine family picture rendering, dark and reduced-motion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V54_Offline.html').read_text()
shim="""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>"""
html=html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  page.set_default_timeout(12000)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==4071
  assert page.evaluate('classicRecipes.size')==12285
  assert page.evaluate('FAMILIES.length')==9
  page.locator('[data-mode-choice="families"]').click()
  arts=page.locator('.family-hero-art img')
  assert arts.count()==9
  assert page.evaluate("[...document.querySelectorAll('.family-hero-art img')].every(x=>x.complete&&x.naturalWidth>0)")
  assert page.locator('.family-hero-card.is-ready').count()==2
  assert page.locator('.family-hero-card.is-locked').count()==7
  if width==390:page.screenshot(path=str(R/'V54_Families_Light_390.png'))
  page.locator('#backToModes').click()
  page.locator('[data-mode-choice="classic"]').click()
  card=page.locator('#inventoryVirtual .element-chip[data-id="legacy:0"]')
  card.click()
  assert page.evaluate("slots[0]==='legacy:0'")
  assert card.evaluate("el=>el.classList.contains('element-chip-pulse')")
  assert card.evaluate("el=>getComputedStyle(el).animationName")=='chip-selected-v54'
  if width==390:page.screenshot(path=str(R/'V54_Tap_Light_390.png'))
  page.wait_for_timeout(420)
  assert not card.evaluate("el=>el.classList.contains('element-chip-pulse')")
  # Test selection of second ingredient, no duplicate event handlers.
  page.locator('#inventoryVirtual .element-chip[data-id="legacy:1"]').click()
  page.wait_for_timeout(260)
  assert page.evaluate("unlocked.has('legacy:4')")
  if page.locator('#modal').is_visible():page.locator('#modalClose').click()
  if width==390:
   page.evaluate("()=>{selectedTheme='dark';applyTheme()}")
   page.locator('#inventoryVirtual .element-chip[data-id="legacy:0"]').click()
   assert page.locator('#inventoryVirtual .element-chip[data-id="legacy:0"]').evaluate("el=>getComputedStyle(el).animationName")=='chip-selected-v54-dark'
   page.screenshot(path=str(R/'V54_Tap_Dark_390.png'))
  assert not errors,errors
  print(f'PASS {width}x{height}: nine family SVGs visible, 2 ready, 7 pending, pulse 370ms, crafting, no JS errors')
  page.close()
 # accessibility fallback for reduced motion
 p=browser.new_page(viewport={'width':390,'height':820},reduced_motion='reduce')
 p.set_content(html,wait_until='domcontentloaded')
 p.locator('[data-mode-choice="classic"]').click()
 tile=p.locator('#inventoryVirtual .element-chip[data-id="legacy:0"]');tile.click()
 assert tile.evaluate("el=>getComputedStyle(el).animationName")=='none'
 assert tile.evaluate("el=>el.classList.contains('element-chip-pulse')")
 print('PASS reduced-motion: non-animated high-contrast selection feedback')
 p.close();browser.close()
