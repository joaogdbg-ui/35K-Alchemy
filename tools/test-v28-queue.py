from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
HTML=(Path(__file__).resolve().parents[1] / '35K_Alchemy_V28_Offline.html').read_text('utf8')
with sync_playwright() as api:
 browser=api.chromium.launch(executable_path=shutil.which('chromium') or '/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(360,780),(390,844),(1280,900)]:
  pg=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<800,has_touch=w<800)
  errors=[]; pg.on('pageerror',lambda err:errors.append(str(err)))
  pg.evaluate('''() => {const store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k],clear:()=>{}}});window.__store=store;}''')
  pg.set_content(HTML,wait_until='domcontentloaded');pg.wait_for_timeout(170)
  assert pg.title()=='35K Alchemy — V28 Offline'
  assert pg.locator('#playFamily option').count()==10
  assert pg.locator('.shelf-filters .filter-pill').count()==1
  # search collapses workspace for virtual keyboard, but results remain visible
  pg.locator('#playSearch').fill('Earth'); pg.locator('#playSearch').focus();pg.wait_for_timeout(200)
  assert pg.locator('.workspace').is_hidden()
  assert pg.locator('.element-chip[data-id="legacy:2"]').is_visible()
  pg.locator('#playSearch').fill('');pg.locator('#playSearch').blur();pg.wait_for_timeout(180)
  # start batch with Fire to find multi-result recipes with four starters
  pg.locator('.element-chip[data-id="legacy:1"]').click()
  pg.locator('#lockLeft').click()
  pg.locator('#batchOpen').click()
  assert pg.locator('#batchDemo').is_enabled()
  pg.locator('#batchFamily').select_option('nature')
  pg.locator('#batchDemo').click()
  # no modal before all have been checked: if a new one appears early, must stay hidden while scanning
  pg.wait_for_timeout(140)
  if 'Checking' in pg.locator('#combineFeedbackText').inner_text():
   assert pg.locator('#modal').is_hidden()
  pg.locator('#modal').wait_for(state='visible', timeout=6000)
  assert 'NEW DISCOVERY' in pg.locator('#modal').inner_text(), pg.locator('#modal').inner_text()
  assert pg.locator('#batchViewAll').is_visible()
  first=pg.locator('#modal h2').inner_text()
  pg.locator('#modal').click(position={'x':3,'y':4})
  assert pg.locator('#modal h2').inner_text()==first
  pg.locator('#batchViewAll').click()
  assert pg.locator('.batch-discovery-list').is_visible()
  cnt=pg.locator('.batch-discovery-row').count()
  assert cnt>=2, 'expected >=2 newly discovered in family batch, got '+str(cnt)
  pg.screenshot(path=f'/mnt/data/35K_Alchemy_V28_All_Discoveries_{w}.png')
  assert pg.locator('.batch-discovery-list').evaluate('(e)=>getComputedStyle(e).overflowY')=='auto'
  pg.locator('#batchBackOne').click()
  assert pg.locator('#modal h2').inner_text()==first
  for i in range(cnt):
   assert 'NEW DISCOVERY' in pg.locator('.modal-tag').inner_text()
   pg.locator('#modalClose').click()
  assert 'BATCH COMPLETE' in pg.locator('#modal').inner_text()
  assert pg.locator('#modal').get_attribute('data-dismiss')=='x-only'
  pg.screenshot(path=f'/mnt/data/35K_Alchemy_V28_Batch_Completed_{w}.png')
  pg.locator('#modalClose').click()
  assert pg.locator('#modal').is_hidden()
  assert pg.evaluate("JSON.parse(window.__store['35k_alchemy_extras_v25']).batchTrialUsed") is True
  pg.locator('.tab[data-view="World"]').click()
  assert pg.locator('.family-card').count()==9
  assert not errors,errors
  print('PASS',w, 'batch discovered',cnt,'with sequential X, view-all, returned, summary; errors',len(errors))
  pg.close()
 browser.close()
