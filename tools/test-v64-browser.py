from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V64_Offline.html').read_text()
shim='<script>Object.defineProperty(window,"localStorage",{configurable:true,value:{data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});</script>'
html=html.replace('<div id="app"',shim+'<div id="app"')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(320,700),(360,740),(390,820),(1280,820)]:
  page=b.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  page.set_default_timeout(12000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  page.locator('[data-mode-choice="classic"]').click()
  # Existing combination: Earth + Fire -> Lava. Must be shown once, not toasted.
  page.evaluate('''()=>{const earth=ITEMS.find(x=>x.name==='Earth').id,fire=ITEMS.find(x=>x.name==='Fire').id,lava=ITEMS.find(x=>x.name==='Lava').id;unlocked.add(lava);place(0,earth);place(1,fire);}''')
  page.wait_for_timeout(380)
  assert page.locator('#combineFeedbackText').inner_text()=='Already discovered · Lava', page.locator('#combineFeedbackText').inner_text()
  assert page.locator('#toast').is_hidden(), 'Duplicate bottom toast is visible'
  assert page.locator('#compassBtn').evaluate('(n)=>n.parentElement.classList.contains("craft-actions")')
  assert page.locator('#batchOpen').inner_text().strip()=='✧ Batch combine a family'
  assert page.locator('#soundToggle').count()==0
  assert page.locator('#discoveredCount').evaluate('(e)=>e.parentElement.classList.contains("brand")')
  assert page.locator('#settingsBtn').evaluate('(e)=>e.nextElementSibling.id==="modeBtn"')
  # header must not run past viewport nor overlap
  metrics=page.evaluate('''()=>{const header=document.querySelector('.topbar');const a=document.querySelector('.brand').getBoundingClientRect(),b=document.querySelector('.header-end').getBoundingClientRect();const t=document.querySelector('.combine-feedback').getBoundingClientRect(),u=document.querySelector('.craft-actions').getBoundingClientRect();return {vw:innerWidth,scroll:document.documentElement.scrollWidth,brandRight:a.right,headLeft:b.left,feedbackBottom:t.bottom,actionsTop:u.top,actionsWidth:u.width,visibleFeedback:!!document.querySelector('#combineFeedbackText').textContent,buttonsSameRow:Math.abs(document.querySelector('#batchOpen').getBoundingClientRect().top-document.querySelector('#compassBtn').getBoundingClientRect().top)<4}}''')
  assert metrics['scroll']<=width+1,metrics
  assert metrics['brandRight']<=metrics['headLeft']+1,metrics
  assert metrics['feedbackBottom']<=metrics['actionsTop']+2,metrics
  # Locked left ingredient => batch visible alongside hint, including on narrow screens
  page.evaluate('''()=>{leftLocked=true;slots[0]=ITEMS.find(x=>x.name==='Earth').id;updateSlotUI();}''')
  assert page.locator('#batchOpen').is_visible()
  metrics2=page.evaluate('''()=>{const a=document.querySelector('#batchOpen').getBoundingClientRect(),b=document.querySelector('#compassBtn').getBoundingClientRect();return {sameRow:Math.abs(a.top-b.top)<4,batchEnd:a.right,hintStart:b.left,workspaceWidth:document.querySelector('.workspace').getBoundingClientRect().width}}''')
  assert metrics2['sameRow'] and metrics2['batchEnd']<=metrics2['hintStart']+1,(metrics,metrics2)
  page.locator('#settingsBtn').click()
  assert page.locator('#settingsSoundToggle').is_visible()
  assert page.locator('#settingsSoundToggle').get_attribute('aria-pressed')=='true'
  page.locator('#settingsSoundToggle').click()
  assert page.locator('#settingsSoundToggle').get_attribute('aria-pressed')=='false'
  assert page.evaluate('localStorage.getItem("35k_audio_enabled_v31")')=='off'
  page.locator('#settingsSoundToggle').click()
  assert page.locator('#settingsSoundToggle').get_attribute('aria-pressed')=='true'
  page.locator('[data-theme-choice="dark"]').click()
  page.locator('#modalClose').click()
  if width==390:
   page.screenshot(path=str(R/'V64_Mobile_Dark.png'),full_page=False)
   page.locator('#settingsBtn').click();page.screenshot(path=str(R/'V64_Settings_Dark.png'),full_page=False)
  assert not errors, errors
  print('PASS',width,height,metrics,metrics2)
  page.close()
 b.close()
