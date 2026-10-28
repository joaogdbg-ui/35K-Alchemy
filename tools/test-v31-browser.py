from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V31_Offline.html').read_text()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'])
 for width in (360,390,1280):
  page=browser.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  counts=page.evaluate('''() => ({elements:ITEMS.length, recipes:recipes.size})''')
  assert counts=={'elements':3402,'recipes':8555},counts
  if width==390: page.screenshot(path=str(root/'35K_Alchemy_V31_Play_390.png'))
  page.locator('#soundToggle').click()
  assert page.locator('#soundToggle').get_attribute('aria-pressed')=='false'
  page.locator('#soundToggle').click()
  assert page.locator('#soundToggle').get_attribute('aria-pressed')=='true'
  # First two items in DATA: Water and Fire. Use programmatic direct tap action to avoid inventory order assumptions.
  page.evaluate("insertDirect('legacy:0')")
  page.evaluate("insertDirect('legacy:1')")
  page.wait_for_timeout(360)
  assert page.locator('#modal').is_visible(),('not visible',page.locator('#combineFeedbackText').inner_text())
  assert page.locator('#modalContent h2').inner_text()=='Steam'
  assert 'Water taking the scenic route' in page.locator('.discovery-wit').inner_text()
  if width==390: page.screenshot(path=str(root/'35K_Alchemy_V31_Discovery_390.png'))
  page.locator('#modal').click(position={'x':5,'y':5},force=True)
  assert page.locator('#modal').is_visible(), 'overlay dismiss erroneously closed discovery'
  page.locator('#modalClose').click()
  assert not page.locator('#modal').is_visible()
  page.locator('#playFamily').click()
  assert page.locator('.inventory-family-grid').is_visible()
  page.locator('[data-inventory-family="all"]').click()
  assert not page.locator('#modal').is_visible()
  if width<500:
   page.locator('#playSearch').focus()
   assert page.evaluate("document.body.classList.contains('keyboard-open')")
   assert page.locator('.workspace').is_hidden()
   page.locator('#playSearch').blur()
   page.wait_for_timeout(180)
  assert not errors,errors
  if width==390:
   page.screenshot(path=str(root/'35K_Alchemy_V31_Preview_390.png'))
  print('PASS width',width,counts,'Sound, dialog X-only, descriptions, family and search validated')
  page.close()
 browser.close()
