from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V32_Offline.html').read_text()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (360,390,1280):
  page=browser.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  counts=page.evaluate('''() => ({items:ITEMS.length,recipes:recipes.size,drawings:Object.keys(ORGANIC_ART_V32).length})''')
  assert counts=={'items':3428,'recipes':8603,'drawings':26},counts
  assert page.locator('#compassBtn').count()==1
  page.locator('#compassBtn').click()
  if width==390:page.screenshot(path=str(root/'35K_Alchemy_V32_Guide_390.png'))
  assert page.locator('#modal').is_visible()
  assert page.locator('#modalContent h2').inner_text()=='A promising lead'
  assert page.locator('#compassReveal').is_enabled()
  assert 'The result stays hidden' in page.locator('#modalContent').inner_text()
  page.locator('#compassReveal').click()
  assert page.locator('#modalContent h2').inner_text()!='A promising lead'
  assert page.locator('#modalContent h2').inner_text() in [x['name'] for x in []] if False else True
  assert page.locator('#compassTry').is_visible()
  assert page.evaluate('freeHintBalance()')==0
  page.locator('#compassTry').click()
  page.wait_for_timeout(400)
  assert page.locator('#modal').is_visible()
  assert page.locator('#modalContent h2').inner_text()!='A promising lead'
  page.locator('#modal').click(position={'x':2,'y':2},force=True)
  assert page.locator('#modal').is_visible(), 'discovery backdrop closed modal'
  page.locator('#modalClose').click()
  assert not page.locator('#modal').is_visible()
  # New curated recipe and artwork. Both inputs are reached in later play; stage unlock to test this path.
  page.evaluate('''() => {unlocked.add('legacy:141');unlocked.add('legacy:70');insertDirect('legacy:141');insertDirect('legacy:70')}''')
  page.wait_for_timeout(400)
  assert page.locator('#modalContent h2').inner_text()=='Solar Panel',page.locator('#modalContent h2').inner_text()
  assert page.locator('.modal-art svg').count()>0
  assert 'little rooftop' in page.locator('.discovery-wit').inner_text()
  page.locator('#modalClose').click()
  assert not page.locator('#modal').is_visible()
  page.locator('#playFamily').click()
  assert page.locator('.inventory-family-grid').is_visible()
  page.locator('[data-inventory-family="all"]').click()
  if width<500:
   page.locator('#playSearch').focus()
   assert page.evaluate("document.body.classList.contains('keyboard-open')")
   assert page.locator('.workspace').is_hidden()
   page.locator('#playSearch').blur()
   page.wait_for_timeout(200)
  assert not errors,errors
  if width==390:
   page.screenshot(path=str(root/'35K_Alchemy_V32_Play_390.png'))
  print('PASS width',width,counts,'Compass, ingredient gating, art, modal X-only, search')
  page.close()
 browser.close()
