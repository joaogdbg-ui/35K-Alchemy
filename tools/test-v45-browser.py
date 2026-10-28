"""V45 Chromium: actual crafting, mobile layout, icons, reversed pair, quiet misses and themes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V45_Offline.html').read_text()
cases=[('Rain','Tank','Rain Barrel'),('Bird','Seed','Bird Feeder'),('Water','Motor','Water Pump'),('Sun','Kiln','Solar Oven'),('City','Light','Streetlamp'),('Fish','Glass','Aquarium'),('Balloon','Thermometer','Weather Balloon'),('Tide','Generator','Tidal Turbine'),('Cloud','Physics','Cloud Chamber'),('Camera','Shadow','Camera Obscura'),('Prism','Color','Kaleidoscope'),('Sea','Glass','Sea Glass'),('Fire','Wood','Coal'),('Wind','Music','Flute')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<500,has_touch=w<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3803
  assert page.evaluate('recipes.size')==11631
  assert page.evaluate('Object.keys(ORGANIC_ART_V45).length')==12
  for a,b,result in cases:
   ia,ib,ic=page.evaluate('names=>names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,result]);assert all((ia,ib,ic)),(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ia,ib])==ic,(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(b,a))',[ia,ib])==ic,(b,a,result)
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ia,ib])
   page.wait_for_function('id=>unlocked.has(id)',arg=ic,timeout=5000)
   if ic.startswith('organic45:'):
    assert page.evaluate('id=>staticArt(byId.get(id))===ORGANIC_ART_V45[byId.get(id).name.toLowerCase()]',ic)
   if page.locator('#modal').is_visible():page.locator('#modalClose').click()
  ia,ib=page.evaluate("['Smoke','Sequel'].map(n=>ITEMS.find(i=>i.name===n).id)")
  assert not page.evaluate('([a,b])=>recipes.has(pairKey(a,b))',[ia,ib])
  page.evaluate('([a,b])=>{place(0,a);place(1,b)}',[ia,ib]);page.wait_for_timeout(80)
  assert page.locator('#toast').is_hidden()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  page.locator('#settingsBtn').click();page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark';page.locator('#modalClose').click()
  if (w,h)==(390,820):
   page.screenshot(path=str(ROOT/'V45_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V45_light_390.png'))
  assert not errors,errors
  print('PASS',w,h,len(cases),'crafts, unique art, themes, invalid silent, no JS errors')
  page.close()
 browser.close()
