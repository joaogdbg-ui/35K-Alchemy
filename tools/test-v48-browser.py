"""V48 offline browser behavior. The in-memory storage and native callback are test-only.
This does NOT demonstrate a real delivered mobile ad; only the reward contract.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V48_Offline.html').read_text(encoding='utf-8')
STORAGE='''<script>window.__testMemoryStore={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return Object.prototype.hasOwnProperty.call(window.__testMemoryStore,k)?window.__testMemoryStore[k]:null},setItem(k,v){window.__testMemoryStore[k]=String(v)},removeItem(k){delete window.__testMemoryStore[k]}}});</script>'''
html=html.replace('<div id="app"',STORAGE+'<div id="app"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<500,has_touch=w<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_default_timeout(5000)
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3963
  assert page.evaluate('classicRecipes.size')==12069
  assert page.locator('[data-mode-choice="family"][data-mode-family="nature"]').is_enabled()
  assert page.locator('[data-mode-choice="family"][data-mode-family="cinema"]').is_disabled()
  page.locator('[data-mode-choice="family"][data-mode-family="nature"]').click()
  assert page.evaluate('currentMode')=='family'
  assert page.evaluate('currentFamilyId')=='nature'
  assert page.evaluate('recipes.size')==1646
  assert page.evaluate('unlocked.size')==4
  assert page.evaluate('familyCampaigns.get("nature").itemSet.size')==393
  assert page.evaluate('[...recipes].every(([pair,out])=>pair.split("|").every(id=>familyCampaigns.get("nature").itemSet.has(id))&&familyCampaigns.get("nature").itemSet.has(out))')
  # One real craft in Family Only, then check independent state.
  ids=page.evaluate("['Water','Fire','Steam'].map(n=>ITEMS.find(i=>i.name===n).id)")
  page.evaluate('([a,b])=>{place(0,a);place(1,b)}',ids[:2]);page.wait_for_function('(id)=>unlocked.has(id)',arg=ids[2]);assert page.evaluate('unlocked.size')==5
  assert page.evaluate("JSON.parse(window.__testMemoryStore['35k_family_profiles_v48']).nature.unlocked.length")==5
  page.locator('#modalClose').click()
  # No native ad: mode cannot switch even if the user requests it.
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='family'
  assert 'Ads unavailable' in page.locator('#modalContent').inner_text()
  # A cancelled reward must NOT switch mode.
  page.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:false})}}}")
  page.locator('#modalClose').click();page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='family'
  # Simulated native callback in test harness: only earned=true may switch.
  page.evaluate("window.Capacitor.Plugins.GameverseRewardedAds.showRewarded=async()=>({earned:true})")
  page.locator('#modalClose').click();page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.evaluate('recipes.size')==12069
  assert not page.evaluate('(id)=>unlocked.has(id)',ids[2])
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="family"][data-mode-family="nature"]').click()
  assert page.evaluate('currentMode')=='family'
  assert page.evaluate('(id)=>unlocked.has(id)',ids[2])
  assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
  if w==390:
   page.screenshot(path=str(ROOT/'V48_Family_390.png'))
   page.locator('#settingsBtn').click()
   page.locator('[data-theme-choice="dark"]').click()
   assert page.evaluate('document.documentElement.dataset.theme')=='dark'
   page.locator('#modalClose').click()
   page.screenshot(path=str(ROOT/'V48_Family_Dark_390.png'))
  assert not errors,errors
  print('PASS',w,h,'first choice, family craft, strict scope, independent saves, no-ad/cancel/earned contract, UI')
  page.close()
 browser.close()
