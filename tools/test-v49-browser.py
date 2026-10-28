"""V49 two-stage mode selection browser tests. SDK mock is test-only.
No real ad is delivered by this harness.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V49_Offline.html').read_text(encoding='utf-8')
MEMORY="""<script>
window.__testMemoryStore={};
Object.defineProperty(window,'localStorage',{configurable:true,value:{
  getItem(k){return Object.prototype.hasOwnProperty.call(window.__testMemoryStore,k)?window.__testMemoryStore[k]:null},
  setItem(k,v){window.__testMemoryStore[k]=String(v)},
  removeItem(k){delete window.__testMemoryStore[k]}
}});
</script>"""
html=html.replace('<div id="app"',MEMORY+'<div id="app"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(360,740),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<500,has_touch=w<500)
  page.set_default_timeout(9000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3963
  assert page.locator('#modalContent [data-mode-choice]').count()==2
  assert page.locator('#modalContent [data-mode-choice="families"]').count()==1
  assert page.locator('[data-campaign-id]').count()==0
  if w==390:page.screenshot(path=str(ROOT/'V49_Mode_390.png'))
  page.locator('[data-mode-choice="families"]').click()
  assert page.locator('[data-campaign-id]').count()==9
  assert page.locator('[data-campaign-id="nature"]').is_enabled()
  assert page.locator('[data-campaign-id="music"]').is_disabled()
  assert page.locator('.family-hero-art img, .family-hero-art svg').count()>=9
  assert page.locator('.family-hero-card.is-locked').count()==8
  assert page.locator('.family-hero-card.is-ready').count()==1
  # Verify all family illustrations are decoded/inlined and non-empty.
  assert page.evaluate('''()=>[...document.querySelectorAll('.family-hero-art img')].every(el=>el.complete && el.naturalWidth>0)''')
  if w==390:page.screenshot(path=str(ROOT/'V49_Families_390.png'))
  page.locator('#backToModes').click()
  assert page.locator('[data-mode-choice]').count()==2
  page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.evaluate('unlocked.size')==4
  page.locator('#modeBtn').click()
  assert page.locator('[data-mode-choice]').count()==2
  page.locator('[data-mode-choice="families"]').click()
  page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.locator('#modalContent').get_by_text('Ads unavailable').count()==1
  # Abort / failed reward cannot change the mode.
  page.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:false})}}}")
  page.locator('#modalClose').click();page.locator('#modeBtn').click()
  page.locator('[data-mode-choice="families"]').click();page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.locator('#modalContent').get_by_text('Mode unchanged').count()==1
  # Positive reward signal is the ONLY path to changing campaigns.
  page.evaluate("window.__rewardRequests=[];window.Capacitor.Plugins.GameverseRewardedAds.showRewarded=async(o)=>{window.__rewardRequests.push(o);return {earned:true}}")
  page.locator('#modalClose').click();page.locator('#modeBtn').click()
  page.locator('[data-mode-choice="families"]').click();page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentMode')=='family'
  assert page.evaluate('currentFamilyId')=='nature'
  assert page.evaluate('recipes.size')==1646
  assert page.evaluate('window.__rewardRequests.some(x=>x?.kind==="mode_switch")')
  # Actual family craft and save isolation.
  ids=page.evaluate("['Water','Fire','Steam'].map(n=>ITEMS.find(i=>i.name===n).id)")
  page.evaluate('(a)=>{place(0,a[0]);place(1,a[1])}',ids[:2]);page.wait_for_function('(id)=>unlocked.has(id)',arg=ids[2]);assert page.evaluate('unlocked.size')==5
  page.locator('#modalClose').click();page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.evaluate('recipes.size')==12069
  assert not page.evaluate('(id)=>unlocked.has(id)',ids[2])
  # Tests first choice Families directly on another independent page too.
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  assert not errors,errors
  print('PASS',w,h,'two-stage picker, nine images, coming-soon, back, no-ad, cancelled ad, earned switch, gameplay, restore')
  page.close()
 # Separate first-run Families Only path
 page=browser.new_page(viewport={'width':390,'height':820},is_mobile=True,has_touch=True)
 page.set_content(html,wait_until='domcontentloaded')
 page.locator('[data-mode-choice="families"]').click()
 page.locator('[data-campaign-id="nature"]').click()
 assert page.evaluate('currentMode')=='family'
 assert page.evaluate('recipes.size')==1646
 assert page.evaluate('JSON.parse(window.__testMemoryStore["35k_mode_selected_v48"]).family')=='nature'
 page.locator('#settingsBtn').click();page.locator('[data-theme-choice="dark"]').click()
 page.locator('#modalClose').click();page.locator('#modeBtn').click()
 page.locator('[data-mode-choice="families"]').click()
 page.screenshot(path=str(ROOT/'V49_Families_Dark_390.png'))
 assert not page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
 print('PASS first-run family free, dark-theme gallery')
 browser.close()
