"""V35 UX regression tests for offline silence, chronological sorting, layout and themes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V38_Offline.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,390,1280]:
  page=browser.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda exc: errors.append(str(exc)))
  page.evaluate('''() => {const mem={};window.__storage=mem;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3572
  assert page.evaluate('recipes.size')==8998
  assert not page.locator('#latestBtn').count()
  assert not page.locator('.shelf-title').count()
  assert page.locator('#searchToggle').is_visible() and page.locator('#playSearch').is_hidden()
  assert page.locator('.shelf-filters').is_visible()
  # Identical dimensions and shape to the inventory tiles.
  page.evaluate('''() => {place(0,'legacy:0')}''')
  size=page.evaluate('''() => {const tile=document.querySelector('.element-chip').getBoundingClientRect(),slot=document.querySelector('.craft-slot').getBoundingClientRect();return {slotHeight:slot.height,tileHeight:tile.height,slotRadius:getComputedStyle(document.querySelector('.craft-slot')).borderRadius,tileRadius:getComputedStyle(document.querySelector('.element-chip')).borderRadius,overflows:document.documentElement.scrollWidth>innerWidth}}''')
  assert size['slotHeight']==size['tileHeight'],size
  assert size['slotRadius']==size['tileRadius'],size
  assert not size['overflows'],size
  # Non-existent combo should have no message, no toast, no animation and no sound.
  page.evaluate('''() => {const ids=[...byId.keys()].slice(0,120);let pair=null;for(const a of ids){for(const b of ids){if(!recipes.has(pairKey(a,b))&&!resolveLocalRedundancy(byId.get(a),byId.get(b))){pair=[a,b];break}}if(pair)break;}if(!pair)throw Error('No invalid pair');place(0,pair[0]);place(1,pair[1]);}''')
  page.wait_for_timeout(300)
  assert not page.locator('#toast').is_visible()
  assert page.locator('#combineFeedbackText').inner_text()==''
  assert page.locator('#combineFeedback').get_attribute('data-kind')=='idle'
  # Explicit oldest -> newest, even across V34 organic and legacy namespaces.
  page.evaluate('''() => {completeCombination('legacy:4','legacy:0','legacy:1');}''')
  page.locator('#modalClose').click()
  page.evaluate('''() => {completeCombination('legacy:6','legacy:0','legacy:2');}''')
  page.locator('#modalClose').click()
  page.locator('#recentBtn').click()
  assert page.evaluate('filtered("play").slice(0,6)')==['legacy:0','legacy:1','legacy:2','legacy:3','legacy:4','legacy:6'],page.evaluate('filtered("play").slice(0,6)')
  assert page.evaluate('JSON.parse(localStorage.getItem(DISCOVERY_ORDER_KEY)).slice(0,6)')==['legacy:0','legacy:1','legacy:2','legacy:3','legacy:4','legacy:6']
  page.locator('#searchToggle').click()
  assert page.locator('#playSearch').is_visible()
  assert not page.locator('.shelf-filters').is_visible()
  page.locator('#playSearch').fill('steam')
  assert page.evaluate('filtered("play").length')==1
  page.locator('#searchToggle').click()
  assert page.locator('#playSearch').is_hidden()
  assert page.locator('.shelf-filters').is_visible()
  assert page.evaluate('playQuery')==''
  page.locator('#settingsBtn').click()
  assert page.locator('[data-theme-choice="light"]').get_attribute('aria-pressed')=='true'
  page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark'
  assert page.evaluate('localStorage.getItem(THEME_KEY)')=='dark'
  assert page.evaluate('getComputedStyle(document.querySelector(".modal-card")).backgroundColor')=='rgb(37, 40, 46)'
  if width==390:
   page.locator('#modalClose').click()
   page.screenshot(path=str(root/'V38_regression_dark_390.png'))
   page.locator('#settingsBtn').click()
  page.locator('[data-theme-choice="system"]').click()
  assert page.evaluate('localStorage.getItem(THEME_KEY)')=='system'
  page.locator('[data-theme-choice="light"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='light'
  page.locator('#modalClose').click()
  if width==390:page.screenshot(path=str(root/'V38_regression_light_390.png'))
  assert not errors,errors
  print(f'PASS {width}px — silent invalid pairing, old-to-new recent, one-row search, dark/light/system, layout')
  page.close()
 browser.close()
