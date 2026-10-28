"""V50 mobile/desktop UI regression: two complete families, overlaps and new-first catalog.
The mocked Android reward signal exists solely in browser tests, not in shipped HTML.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V50_Offline.html').read_text(encoding='utf-8')
M="""<script>window.__testMemory={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]},data:{}}});</script>"""
html=html.replace('<div id="app"',M+'<div id="app"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  pg=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  pg.set_default_timeout(14000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html,wait_until='domcontentloaded')
  assert pg.evaluate('ITEMS.length')==3975
  assert pg.evaluate('classicRecipes.size')==12093
  assert pg.locator('#modalContent [data-mode-choice]').count()==2
  pg.locator('[data-mode-choice="families"]').click()
  assert pg.locator('[data-campaign-id]').count()==9
  assert pg.locator('.family-hero-card.is-ready').count()==2
  assert pg.locator('.family-hero-card.is-locked').count()==7
  assert pg.locator('[data-campaign-id="people"]').is_enabled()
  assert pg.locator('[data-campaign-id="nature"]').is_enabled()
  assert '15 shared' in pg.locator('[data-campaign-id="people"]').inner_text()
  if width==390:pg.screenshot(path=str(ROOT/'V50_Families_390.png'))
  # Free first choice in People & Culture, then a real in-campaign craft.
  pg.locator('[data-campaign-id="people"]').click()
  assert pg.evaluate('currentMode')=='family'
  assert pg.evaluate('currentFamilyId')=='people'
  assert pg.evaluate('unlocked.size')==4
  assert pg.evaluate('recipes.size')==194
  # Switching without ads is forbidden.
  if not pg.locator('#modal').is_hidden():pg.locator('#modalClose').click()
  pg.locator('#modeBtn').click();pg.locator('[data-mode-choice="families"]').click();pg.locator('[data-campaign-id="nature"]').click()
  assert pg.evaluate('currentFamilyId')=='people'
  assert pg.locator('#modalContent').get_by_text('Ads unavailable').count()==1
  # Failed reward never switches. Successful Android test stub switches.
  pg.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:false})}}}")
  pg.locator('#modalClose').click();pg.locator('#modeBtn').click();pg.locator('[data-mode-choice="families"]').click();pg.locator('[data-campaign-id="nature"]').click()
  assert pg.evaluate('currentFamilyId')=='people'
  pg.evaluate("window.Capacitor.Plugins.GameverseRewardedAds.showRewarded=async()=>({earned:true})")
  pg.locator('#modalClose').click();pg.locator('#modeBtn').click();pg.locator('[data-mode-choice="families"]').click();pg.locator('[data-campaign-id="nature"]').click()
  assert pg.evaluate('currentFamilyId')=='nature'
  assert pg.evaluate('recipes.size')==1661
  assert pg.evaluate('unlocked.size')==4
  assert pg.evaluate("familiesFor(ITEMS.find(i=>i.name==='Tea')).join(',')")=='people,nature'
  assert pg.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  if not pg.locator('#modal').is_hidden():pg.locator('#modalClose').click()
  pg.locator('#modeBtn').click();pg.locator('[data-mode-choice="classic"]').click()
  assert pg.evaluate('currentMode')=='classic'
  assert pg.evaluate('recipes.size')==12093
  # Test one of the new-first recipes. Ingredients are force-unlocked in test only.
  pg.evaluate("()=>{unlocked.add(ITEMS.find(i=>i.name==='Camera').id);unlocked.add(ITEMS.find(i=>i.name==='Sea').id)}")
  camera,sea,under=pg.evaluate("['Camera','Sea','Underwater Camera'].map(n=>ITEMS.find(i=>i.name===n).id)")
  pg.evaluate('(ids)=>{place(0,ids[0]);place(1,ids[1])}',[camera,sea])
  pg.wait_for_function('(id)=>unlocked.has(id)',arg=under,timeout=8000)
  assert pg.evaluate('(id)=>staticArt(byId.get(id)).includes("<svg")',under)
  assert not errors,errors
  print('PASS',width,height,'family gallery, 15 shared, separate campaign, ad gate, Classic new discovery')
  pg.close()
 browser.close()
