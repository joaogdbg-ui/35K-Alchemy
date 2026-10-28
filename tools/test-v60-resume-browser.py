from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V60_Offline.html').read_text()
def shim(data=None):
 return """<script>Object.defineProperty(window,'localStorage',{configurable:true,value:{data:%s,getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});window.__testAdCalls=[];window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded:async function(x){window.__testAdCalls.push(x);return {earned:true};}}}};</script>""" % json.dumps(data or {})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,740),(1280,820)]:
  p=b.new_page(viewport={'width':width,'height':height});p.set_default_timeout(10000)
  p.set_content(html.replace('<div id="app"',shim()+'<div id="app"'),wait_until='domcontentloaded')
  p.locator('[data-mode-choice="families"]').click();p.locator('[data-campaign-id="people"]').click()
  id=p.evaluate('''() => {const family=familyCampaigns.get('people');const starters=new Set([...familyCampaigns.values()].flatMap(f=>f.starters));const id=family.items.find(id=>!starters.has(id)&&!classicSnapshot.unlocked.includes(id));unlocked.add(id);storeFamilyProfile();updateCounts();return id;}''')
  p.locator('[data-view="World"]').click();p.locator('#mergeClassicBtn').click();p.locator('#mergeWatchAd').click()
  p.wait_for_function('mergePending?.completed===1')
  saved=p.evaluate('localStorage.data')
  assert not p.evaluate('(id)=>classicSnapshot.unlocked.includes(id)',id)
  p.close()
  q=b.new_page(viewport={'width':width,'height':height});q.set_default_timeout(10000)
  q.set_content(html.replace('<div id="app"',shim(saved)+'<div id="app"'),wait_until='domcontentloaded')
  assert q.evaluate('currentMode')=='family'
  assert q.evaluate('mergePending?.completed')==1
  q.locator('[data-view="World"]').click();q.locator('#mergeClassicBtn').click()
  assert q.locator('#mergeWatchAd').inner_text()=='Watch ad 2 of 2'
  q.locator('#mergeWatchAd').click()
  q.wait_for_function('(id)=>classicSnapshot.unlocked.includes(id)',arg=id)
  assert q.evaluate('window.__testAdCalls.map(x=>x.step)')==[2]
  assert q.evaluate('currentMode')=='family'
  assert q.evaluate('mergePending') is None
  print('PASS',width,height,'1/2 rewarded credit resumed, only ad #2 needed')
  q.close()
 b.close()
