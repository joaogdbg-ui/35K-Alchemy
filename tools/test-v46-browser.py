"""V46 Playwright: real crafts at multiple resolutions, new art, inverse, quiet misses and themes."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V46_Offline.html').read_text()
rows=json.loads((ROOT/'shared/v46-editorial-report.json').read_text())['editorial_routes']
# sample two branches for each theme; prefer old+old routes for user-natural progression
cases=[]
for i in (0,3,10,16,20,23,31,35,40,43,49,53,61,65,71,75):
 row=rows[i];a,b=row['recipes'][0].split(' + ');cases.append((a,b,row['name']))
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<500,has_touch=w<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3883
  assert page.evaluate('recipes.size')==11847
  assert page.evaluate('Object.keys(ORGANIC_ART_V46).length')==80
  for a,b,result in cases:
   ia,ib,ic=page.evaluate('names=>names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,result]);assert all((ia,ib,ic)),(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ia,ib])==ic
   assert page.evaluate('([a,b])=>recipes.get(pairKey(b,a))',[ia,ib])==ic
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ia,ib])
   page.wait_for_function('id=>unlocked.has(id)',arg=ic,timeout=5000)
   assert page.evaluate('id=>staticArt(byId.get(id))===ORGANIC_ART_V46[byId.get(id).name.toLowerCase()]',ic)
   if page.locator('#modal').is_visible():page.locator('#modalClose').click()
  ia,ib=page.evaluate("['Smoke','Sequel'].map(n=>ITEMS.find(i=>i.name===n).id)")
  assert not page.evaluate('([a,b])=>recipes.has(pairKey(a,b))',[ia,ib])
  page.evaluate('([a,b])=>{place(0,a);place(1,b)}',[ia,ib]);page.wait_for_timeout(80)
  assert page.locator('#toast').is_hidden()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  page.locator('#settingsBtn').click();page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark';page.locator('#modalClose').click()
  if (w,h)==(390,820):
   page.screenshot(path=str(ROOT/'V46_Dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V46_Light_390.png'))
  assert not errors,errors
  print('PASS',w,h,len(cases),'new crafts, art, parity, theme, silent invalid, no errors')
  page.close()
 browser.close()
