from pathlib import Path
from playwright.sync_api import sync_playwright
from collections import Counter
import json,hashlib
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V30_Offline.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,390,1280]:
  page=b.new_page(viewport={'width':width,'height':850},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}''')
  page.set_content(html,wait_until='domcontentloaded')
  counts=page.evaluate('''() => ({items:ITEMS.length,recipes:recipes.size,art:Object.keys(GAMEVERSE_ART_V30_SEMANTIC).length})''')
  print('WIDTH',width,counts, 'ERRORS', errors[:3]);assert not errors
  assert counts['items']==3402 and counts['recipes']==8555,counts
  if width==390:
   page.evaluate('''() => {document.body.innerHTML='<div id="art-test" style="display:grid;grid-template-columns:repeat(4,100px);gap:8px;background:#f8f6f1;padding:8px"></div>';
     const names=['Sun','Sky','Wind','Crystal','Moon','Star','Water','Fire','Earth','Mountain','Cloud','Rain','Ice','Lightning','Rain','Ocean','Forest','Tree','Camera','Battery'];
     document.querySelector('#art-test').innerHTML=names.map(n=>{let it=ITEMS.find(x=>x.name===n);return `<div style="width:100px;text-align:center;font-size:12px"><div style="width:92px;height:92px">${staticArt(it)}</div>${n}</div>`}).join('');}''')
   page.add_style_tag(content='''#art-test svg{width:92px;height:92px}#art-test .gameverse-art{width:92px;height:92px}''')
   page.screenshot(path=str(root/'35K_Alchemy_V30_Art_Audit.png'),full_page=True)
  page.close()
 b.close()
print('PASS V30 browser and exact semantic icons')
