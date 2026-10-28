from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V61_Offline.html').read_text()
shim="""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>"""
html=html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(390,820),(1280,820)]:
  p=b.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500);p.set_default_timeout(13000)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded')
  assert p.evaluate('familyCampaigns.size')==2
  p.locator('[data-mode-choice="families"]').click()
  assert '476' in p.locator('[data-campaign-id="nature"]').inner_text()
  assert '211' in p.locator('[data-campaign-id="people"]').inner_text()
  p.locator('[data-campaign-id="nature"]').click()
  assert p.evaluate('currentMode')=='family' and p.evaluate('currentFamilyId')=='nature'
  assert p.evaluate('sharedCatalogIds.size')==31
  p.locator('#modeBtn').click();p.locator('[data-mode-choice="families"]').click()
  p.locator('[data-campaign-id="people"]').click()
  assert p.evaluate('currentFamilyId')=='nature'
  assert p.get_by_text('Ads unavailable').count()==1
  assert not errors,errors
  print('PASS',width,height,'family profiles and 31 shared IDs retained; offline ad gate intact')
  p.close()
 b.close()
