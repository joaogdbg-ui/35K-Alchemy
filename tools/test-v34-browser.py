"""V34 responsive end-to-end smoke test, without claiming a real ad SDK test."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V37_Offline.html').read_text(encoding='utf8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,390,1280]:
  page=browser.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda exc: errors.append(str(exc)))
  page.evaluate('''() => { const mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3494
  assert page.evaluate('recipes.size')==8795
  assert page.locator('#viewPlay').is_visible()
  # A real old-element + old-element combination must create the new V34 seed.
  page.evaluate('''() => {unlocked.add('legacy:19');rerenderCollections();place(0,'legacy:19');place(1,'legacy:2');}''')
  page.wait_for_function('unlocked.has("organic34:seed")')
  assert page.evaluate('unlocked.has("organic34:seed")')
  page.locator('#modalClose').click()
  page.locator('#compassBtn').click()
  assert page.locator('#modalContent h2').inner_text()=='Ads are unavailable here'
  assert page.evaluate('Object.keys(hintState.clues).length')==0
  page.locator('#modalClose').click()
  page.locator('[data-view="World"]').click()
  page.locator('[data-family="nature"]').first.click()
  assert page.locator('#familyHint').is_visible()
  if not page.locator('#familyHint').is_disabled():
   selected=page.evaluate('getFamilyCandidate()')
   assert selected['ready']==2,selected
   page.locator('#familyHint').click()
   assert page.locator('#modalContent h2').inner_text()=='Ads are unavailable here'
   page.locator('#modalClose').click()
  page.locator('#familyBack').click()
  page.locator('[data-family="games"]').first.click()
  # No actionable game recipe in a nearly empty save: the ad cannot be requested.
  assert page.locator('#familyHint').is_disabled()
  assert 'No craftable' in page.locator('#familyHint').inner_text()
  page.locator('[data-view="Play"]').click()
  # Simulated Capacitor API confirms the JS contract only, not a genuine ad.
  page.evaluate('''() => {window.Capacitor={getPlatform:()=>'android',Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:false})}}}}''')
  page.locator('#compassBtn').click()
  page.wait_for_timeout(60)
  assert page.locator('#modalContent h2').inner_text()=='No reward received'
  assert page.evaluate('Object.keys(hintState.clues).length')==0
  page.locator('#modalClose').click()
  page.evaluate('''() => {window.Capacitor.Plugins.GameverseRewardedAds.showRewarded=async()=>({earned:true})}''')
  page.locator('#compassBtn').click()
  page.wait_for_timeout(60)
  assert page.locator('.compass-recipe').is_visible()
  assert page.evaluate("Object.values(hintState.clues).filter(x=>x==='recipe').length")==1
  if width==390:page.screenshot(path=str(root/'V37_regression_390.png'))
  page.locator('#modalClose').click()
  assert not errors,errors
  if width==390:
   # Fresh document, using real V33-format stored progress. No migration or reset.
   compat=browser.new_page(viewport={'width':width,'height':820})
   compat.evaluate("""() => {const st={
    gameverse_alchemy_v2:JSON.stringify({v:2,u:[0,1,2,3,19],r:[],recent:[19],last:19}),
    gameverse_dynamic_v11:JSON.stringify({v:11,items:[],recipes:[],unlocked:['organic32:solar-panel','organic34:seed'],recent:['organic34:seed'],last:'organic34:seed'}),
    gameverse_discovery_hints_v20:JSON.stringify({v:20,clues:{'organic32:rainforest':'recipe'}})
   };Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>st[k]??null,setItem:(k,v)=>st[k]=String(v),removeItem:k=>delete st[k]}})}""")
   compat.set_content(html,wait_until='domcontentloaded')
   assert compat.evaluate('unlocked.has("organic32:solar-panel") && unlocked.has("organic34:seed")')
   assert compat.evaluate('hintState.clues["organic32:rainforest"]')=='recipe'
   assert compat.evaluate('ITEMS.length')==3494
   compat.close()
  print('PASS',width,'3494 elements, 8795 recipes, craft, actionable hint, no false rewards')
  page.close()
 browser.close()
