"""V53 Chromium user path: craft, shared family item, offline ad gate and new-first Classic."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V53_Offline.html').read_text()
shim="""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>"""
html=html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in ((360,740),(390,820),(1280,820)):
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  page.set_default_timeout(18000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==4071
  assert page.evaluate('classicRecipes.size')==12285
  assert page.evaluate('familyCampaigns.size')==2
  page.locator('[data-mode-choice="families"]').click()
  assert '476' in page.locator('[data-campaign-id="nature"]').inner_text()
  assert '211' in page.locator('[data-campaign-id="people"]').inner_text()
  if width==390:page.screenshot(path=str(R/'V53_Families_390.png'))
  page.locator('[data-campaign-id="nature"]').click()
  assert page.evaluate('currentMode')=='family' and page.evaluate('currentFamilyId')=='nature'
  # Real recipe in Nature: complete via in-game combine, not by awarding its target from tests.
  target=page.evaluate("() => ORGANIC_V53.items.find(x=>x.name==='Herb Garden').id")
  pair=page.evaluate("(id) => [...recipes].find(([k,v])=>v===id&&k.split('|').every(x=>familyCampaigns.get('nature').itemSet.has(x)))[0]",target)
  a,b=pair.split('|')
  page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[a,b])
  page.wait_for_function('(id)=>unlocked.has(id)',arg=target)
  assert page.evaluate('(id)=>familyProfiles.people.unlocked.includes(id)',target)
  assert page.evaluate('sharedCatalogIds.size')==31
  if not page.locator('#modal').is_hidden():page.locator('#modalClose').click()
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="families"]').click()
  assert '5 / 211 discovered' in page.locator('[data-campaign-id="people"]').inner_text()
  page.locator('[data-campaign-id="people"]').click()
  assert page.evaluate('currentFamilyId')=='nature' # unavailable ad = no mode change
  assert page.get_by_text('Ads unavailable').count()==1
  page.locator('#modalClose').click()
  page.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:true})}}}")
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="families"]').click();page.locator('[data-campaign-id="people"]').click()
  assert page.evaluate('currentFamilyId')=='people'
  assert page.evaluate('(id)=>unlocked.has(id)',target)
  assert page.evaluate('unlocked.size')==5
  # Standard people-only new-first recipe - result is actually earned.
  result=page.evaluate("() => ORGANIC_V53.items.find(x=>x.name==='Village Market Day').id")
  pair=page.evaluate('(id)=>[...recipes].find(([k,v])=>v===id)[0]',result)
  c,d=pair.split('|')
  page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[c,d])
  page.wait_for_function('(id)=>unlocked.has(id)',arg=result)
  assert page.evaluate('(id)=>!familyProfiles.nature.unlocked.includes(id)',result)
  page.locator('#modalClose').click()
  # Classic does not inherit the family discovery.
  page.locator('#modeBtn').click();page.locator('[data-mode-choice="classic"]').click()
  assert page.evaluate('currentMode')=='classic'
  assert page.evaluate('(id)=>!unlocked.has(id)',target)
  assert not errors,errors
  if width==390:
   page.evaluate("() => {selectedTheme='dark';applyTheme();}")
   page.screenshot(path=str(R/'V53_Dark_390.png'))
  print(f'PASS {width}x{height}: actual V53 craft, 31 shared IDs, visual family gallery, offline ad gate, classic separation')
  page.close()
 browser.close()
