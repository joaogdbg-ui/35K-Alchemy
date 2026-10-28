from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[1] / '35K_Alchemy_V28_Offline.html'
HTML=p.read_text('utf8')
with sync_playwright() as api:
 browser=api.chromium.launch(executable_path=shutil.which('chromium') or '/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,780),(390,844),(1280,900)]:
  pg=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<800,has_touch=width<800)
  errors=[];pg.on('pageerror',lambda err:errors.append(str(err)))
  pg.evaluate('''() => {const store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k],clear:()=>{}}});window.__store=store;}''')
  pg.set_content(HTML,wait_until='domcontentloaded');pg.wait_for_timeout(160)
  assert pg.title()=='35K Alchemy — V28 Offline'
  assert pg.locator('#playFamily option').count()==10
  assert pg.locator('.shelf-filters .filter-pill').count()==1
  assert pg.locator('.craft-heading').is_hidden()
  # keyboard mode, results must remain visible
  pg.locator('#playSearch').fill('Earth')
  pg.locator('#playSearch').focus();pg.wait_for_timeout(170)
  assert pg.locator('.workspace').is_hidden()
  assert pg.locator('.element-chip[data-id="legacy:2"]').is_visible(), pg.locator('#inventoryVirtual').inner_text()[:200]
  search_bottom=pg.locator('#playSearch').bounding_box()['y']
  chip_y=pg.locator('.element-chip[data-id="legacy:2"]').bounding_box()['y']
  assert chip_y>search_bottom, (search_bottom,chip_y)
  pg.screenshot(path=f'/mnt/data/35K_Alchemy_V28_Search_{width}.png')
  pg.locator('#playSearch').blur();pg.wait_for_timeout(180)
  pg.locator('#playSearch').fill('');pg.locator('#playSearch').blur();pg.wait_for_timeout(180)
  # smoke test novel + repeated + invalid
  pg.locator('.element-chip[data-id="legacy:1"]').click() # Fire
  pg.locator('.element-chip[data-id="legacy:0"]').click() # Water
  pg.wait_for_timeout(450)
  assert pg.locator('#modal').is_visible(),errors
  assert 'NEW DISCOVERY' in pg.locator('#modal').inner_text()
  # close by backdrop must not close the modal
  pg.locator('#modal').click(position={'x':4,'y':4})
  assert pg.locator('#modal').is_visible(), 'Modal dismissed by backdrop'
  assert pg.locator('#continueBtn').count()==0
  assert pg.locator('#combineFeedback').get_attribute('data-kind')=='new'
  pg.locator('#modalClose').click()
  pg.locator('.element-chip[data-id="legacy:1"]').click()
  pg.locator('.element-chip[data-id="legacy:0"]').click()
  pg.wait_for_timeout(430)
  assert pg.locator('#combineFeedback').get_attribute('data-kind')=='repeat'
  # batch requires left lock
  pg.locator('.element-chip[data-id="legacy:1"]').click()
  pg.locator('#lockLeft').click()
  assert pg.locator('#batchOpen').is_visible()
  pg.locator('#batchOpen').click()
  assert pg.locator('#batchFamily option').count()==9
  assert pg.locator('#batchRewarded').is_disabled()
  pg.locator('#batchFamily').select_option('nature')
  pg.locator('#batchDemo').click()
  # 4 starters and maybe new steam - snapshot nature should be >=4; each discovery modal X-close
  for i in range(30):
   pg.wait_for_timeout(260)
   if pg.locator('#modal').is_visible():
    tag=pg.locator('#modal .modal-tag').inner_text()
    if 'BATCH COMPLETE' in tag:break
    assert 'NEW DISCOVERY' in tag,tag
    pg.locator('#modalClose').click()
  else:raise AssertionError('batch did not complete')
  assert 'BATCH COMPLETE' in pg.locator('#modal').inner_text()
  assert 'No match' in pg.locator('#modal').inner_text()
  assert pg.evaluate("JSON.parse(window.__store['35k_alchemy_extras_v25']).batchTrialUsed") is True
  pg.screenshot(path=f'/mnt/data/35K_Alchemy_V28_Batch_{width}.png')
  pg.locator('#modalClose').click()
  pg.locator('.tab[data-view="World"]').click()
  assert pg.locator('.family-card').count()==9
  assert not errors,errors
  print('PASS',width, 'keyboard, 2 statuses, x-only discovery, locked batch, free trial, 9 families; errors',len(errors))
  pg.close()
 browser.close()
