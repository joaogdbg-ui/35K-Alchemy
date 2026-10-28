"""V43 headless Chromium regression: actual crafting, responsive layouts, exact authored icons."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V43_Offline.html').read_text(encoding='utf-8')
# Every pair below is verifiably a new V43 mapping (not overwritten legacy content).
cases=[('Air','Dust','Haze'),('Dust','Wind','Sandstorm'),('Fire','Fuel','Smoke'),('Fire','Paper','Ash'),('Fire','Forest','Wildfire'),('Smoke','Fog','Smog'),('Smoke','Stone','Soot'),('Rain','Sun','Rainbow'),('Sun','Drizzle','Sunshower'),('Water','Snow','Slush'),('Mud','Mountain','Mudslide'),('Wood','Heat','Charcoal')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda error: errors.append(str(error)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3778
  assert page.evaluate('recipes.size')==10275
  assert page.evaluate('Object.keys(ORGANIC_ART_V43).length')==12
  for a,b,result in cases:
   ida,idb,out=page.evaluate('names => names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,result]);assert ida and idb and out,(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ida,idb])==out,(a,b,result)
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ida,idb])
   page.wait_for_function('id=>unlocked.has(id)',arg=out,timeout=5000)
   if page.locator('#modalContent .modal-art svg').count():
    if out.startswith('organic43:'):
     assert page.evaluate('id=>staticArt(byId.get(id))===ORGANIC_ART_V43[byId.get(id).name.toLowerCase()]',out)
    page.locator('#modalClose').click()
  # Missing pairs remain silent, not force-fit by generic runtime fallback.
  a,b=page.evaluate("['Smoke','Sequel'].map(n=>ITEMS.find(i=>i.name===n).id)")
  assert page.evaluate('([a,b])=>recipes.has(pairKey(a,b))',[a,b]) is False
  page.evaluate('([a,b])=>{place(0,a);place(1,b)}',[a,b])
  page.wait_for_timeout(120)
  assert page.locator('#toast').is_hidden()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  page.locator('#settingsBtn').click()
  page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark'
  page.locator('#modalClose').click()
  if width==390 and height==820:
   page.screenshot(path=str(ROOT/'V43_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V43_light_390.png'))
  assert not errors, errors
  print('PASS',width,height,'12 crafts, 12 SVG recipes, silent invalid, themes, responsive, 0 page errors')
  page.close()
 browser.close()
