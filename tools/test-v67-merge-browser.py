from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V67_Offline.html').read_text()
# Test-only bridge is injected before the standalone script; it is NOT bundled in the game.
shims={
 'offline':"""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>""",
 'ad_test':"""<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}}); window.__testAdReplies=[true,false,true];window.__testAdCalls=[];window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async function(opts){window.__testAdCalls.push(opts);return {earned:window.__testAdReplies.shift()??false}}}}};</script>"""
}
def simulate_discovery(page):
 return page.evaluate('''() => {
  const nature = familyCampaigns.get('nature');
  const eligible = nature.items.filter(id=>!nature.starters.includes(id) && ![...familyCampaigns.values()].some(f=>f.starters.includes(id)) && !classicSnapshot.unlocked.includes(id));
  const id = eligible[0];
  unlocked.add(id);storeFamilyProfile();updateCounts();
  return id;
 }''')

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for mode,(w,h) in [('offline',(390,820)),('ad_test',(390,820))]:
  p=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True)
  p.set_default_timeout(12000)
  errors=[];p.on('pageerror',lambda ex:errors.append(str(ex)))
  p.set_content(html.replace('<div id="app"',shims[mode]+'<div id="app"'),wait_until='domcontentloaded')
  p.locator('[data-mode-choice="families"]').click();p.locator('[data-campaign-id="nature"]').click()
  id=simulate_discovery(p)
  p.locator('[data-view="World"]').click()
  p.locator('#mergeClassicBtn').click()
  assert '1 element' in p.locator('#modalContent').inner_text()
  assert not p.evaluate('(id)=>classicSnapshot.unlocked.includes(id)',id)
  if mode=='offline':
   assert p.get_by_text('Rewarded ads are unavailable').count()==1
   assert p.locator('#mergeWatchAd').is_disabled()
   assert p.evaluate('mergePending') is None
  else:
   # first verified reward -> 1/2, transfer still blocked
   p.locator('#mergeWatchAd').click()
   p.wait_for_function('mergePending?.completed===1')
   assert not p.evaluate('(id)=>classicSnapshot.unlocked.includes(id)',id)
   assert 'Watch ad 2 of 2' in p.locator('#mergeWatchAd').inner_text()
   # second ad dismissed with no reward; 1/2 retained
   p.locator('#mergeWatchAd').click()
   p.wait_for_function('window.__testAdCalls.length===2 && !rewardedHintBusy')
   assert p.evaluate('mergePending.completed')==1
   assert not p.evaluate('(id)=>classicSnapshot.unlocked.includes(id)',id)
   # second valid earned reward -> merge exactly once without mode switch
   p.locator('#mergeWatchAd').click()
   p.wait_for_function('(id)=>classicSnapshot.unlocked.includes(id)',arg=id)
   assert p.evaluate('mergePending') is None
   assert p.evaluate('currentMode')=='family'
   assert p.evaluate('''(id) => id.startsWith("legacy:") ? JSON.parse(localStorage.getItem("gameverse_alchemy_v2")).u.includes(Number(id.slice(7))) : JSON.parse(localStorage.getItem("gameverse_dynamic_v11")).unlocked.includes(id)''',id)
   assert p.evaluate('window.__testAdCalls.map(x=>x.step)')==[1,2,2]
   assert '1 element merged' in p.locator('#modalContent').inner_text()
   p.locator('#mergeDone').click()
   assert p.locator('#mergeClassicBtn').is_disabled()
   # Need a NEW discovery for another merge; no extra ad charged for repeated click.
  assert not errors,errors
  print('PASS',mode,'390x820', ('paid 2/2 and persisted' if mode=='ad_test' else 'offline gate with no reward'))
  p.close()
 browser.close()
