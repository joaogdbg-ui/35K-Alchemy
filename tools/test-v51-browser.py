"""UI tests for V51 shared unlocks across Family Only; Android SDK mock is tests-only."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V51_Offline.html').read_text(encoding='utf-8')
mock_storage="""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>"""
html=html.replace('<div id="app"',mock_storage+'<div id="app"')
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  page.set_default_timeout(17000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3975
  assert page.evaluate('familyCampaigns.size')==2
  page.locator('[data-mode-choice="families"]').click()
  assert page.locator('[data-campaign-id="people"]').count()==1
  page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentFamilyId')=='nature'
  assert page.evaluate('unlocked.size')==4
  # Real in-game combination. The test seeds the required ingredients but does not grant the result.
  nature_recipe=page.evaluate("""() => [...recipes].find(([p,id])=>sharedCatalogIds.has(id)&&!unlocked.has(id))""")
  assert nature_recipe
  key, first=nature_recipe
  a,b=key.split('|')
  page.evaluate("([a,b])=>{unlocked.add(a);unlocked.add(b)}",[a,b])
  page.evaluate("([a,b])=>{place(0,a);place(1,b)}",[a,b])
  page.wait_for_function('(id)=>unlocked.has(id)',arg=first)
  assert page.evaluate('(id)=>familyProfiles.people.unlocked.includes(id)',first)
  assert page.evaluate('(id)=>familyProfiles.people.ledger.find(([x])=>x===id)?.[1].source',first)=='family-shared'
  assert page.evaluate('familyProfiles.people.known.length')==0
  assert '5 / 167 discovered' not in page.locator('body').inner_text() # not always visible until picker
  if not page.locator('#modal').is_hidden():page.locator('#modalClose').click()
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="families"]').click()
  assert '5 / 167 discovered' in page.locator('[data-campaign-id="people"]').inner_text()
  # Offline HTML never pretends an ad was watched.
  page.locator('[data-campaign-id="people"]').click()
  assert page.evaluate('currentFamilyId')=='nature'
  assert page.get_by_text('Ads unavailable').count()==1
  # Only testing the genuine callback contract; this mock is NOT shipped.
  page.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:true})}}}")
  page.locator('#modalClose').click()
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="families"]').click();page.locator('[data-campaign-id="people"]').click()
  assert page.evaluate('currentFamilyId')=='people'
  assert page.evaluate('(id)=>unlocked.has(id)',first)
  assert page.evaluate('unlocked.size')==5
  # Discover a SECOND multi-family item from People, propagate back to Nature.
  other=page.evaluate("""() => [...recipes].find(([p,id])=>sharedCatalogIds.has(id)&&!unlocked.has(id))""")
  assert other
  second_key,second_id=other
  c,d=second_key.split('|')
  page.evaluate("([a,b])=>{unlocked.add(a);unlocked.add(b)}",[c,d])
  page.evaluate("([a,b])=>{place(0,a);place(1,b)}",[c,d])
  page.wait_for_function('(id)=>unlocked.has(id)',arg=second_id)
  assert page.evaluate('(id)=>familyProfiles.nature.unlocked.includes(id)',second_id)
  page.locator('#modalClose').click()
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="families"]').click();page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentFamilyId')=='nature'
  assert page.evaluate('(id)=>unlocked.has(id)',second_id)
  # Switch to Classic; shared family discoveries must NOT appear in its progress.
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.evaluate('(id)=>!unlocked.has(id)',first)
  assert page.evaluate('(id)=>!unlocked.has(id)',second_id)
  assert not errors,errors
  print(f'PASS {width}x{height}: actual two-way shared craft, gallery progress, ad protection, Classic separate')
  page.close()
 browser.close()
