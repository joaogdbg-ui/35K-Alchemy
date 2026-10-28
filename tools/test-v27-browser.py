from pathlib import Path
from playwright.sync_api import sync_playwright
P=Path(__file__).resolve().parents[1]
HTML=(P/'35K_Alchemy_V27_Offline.html').read_text(encoding='utf8')
seed={'gameverse_alchemy_v2':{'v':2,'u':[0,1,2,3,193,416,494],'r':[],'recent':[],'last':None}}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,780),(390,844),(1280,900)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<800,has_touch=width<800,accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''(seed)=>{const store=Object.fromEntries(Object.entries(seed).map(([k,v])=>[k,JSON.stringify(v)]));Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>delete store[k],clear:()=>{Object.keys(store).forEach(k=>delete store[k]);}}});window.__store=store;}''',seed)
  page.set_content(HTML,wait_until='domcontentloaded')
  page.wait_for_timeout(180)
  assert '35K Alchemy' in page.title(),page.title()
  assert page.locator('.tab').count()==2
  count=page.evaluate('''()=>{
    const groups=new Map(); const imgs=new Set();
    for(const it of ITEMS){const motif=v27Motif(it);if(!motif)continue;let h=2166136261;for(const ch of String(it.id||it.name||'')){h=Math.imul(h^ch.charCodeAt(0),16777619)};
      let v=(h>>>0)%12;let key=motif+'~'+v;
      if(GAMEVERSE_ART_V27_VARIANTS[key]){imgs.add(key);groups.set(motif,true)}
    }
    return {items:ITEMS.length,recipes:recipes.size,assetVariants:Object.keys(GAMEVERSE_ART_V27_VARIANTS).length,uniqueImagesUsed:imgs.size,genresUsed:groups.size};
  }''')
  assert count['items']==3376,count
  assert count['recipes']==8477,count
  assert count['assetVariants']==540,count
  assert count['uniqueImagesUsed']>180,count
  # Main game uses the new static assets, no frame animation.
  page.locator('#playSearch').fill('RPG');page.wait_for_timeout(50)
  page.locator('.element-chip').filter(has_text='RPG').first.click()
  page.locator('#playSearch').fill('PlayStation 2');page.wait_for_timeout(50)
  page.locator('.element-chip').filter(has_text='PlayStation 2').first.click()
  page.wait_for_timeout(350)
  assert 'Dark Cloud' in page.locator('#modal').inner_text(),page.locator('#modal').inner_text()[:250]
  assert page.locator('#modal img.gameverse-art-v27').count()>=1
  page.screenshot(path=str(P/f'35K_Alchemy_V27_Discovery_{width}.png'))
  page.locator('#modalClose').click()
  page.locator('.tab[data-view="World"]').click()
  assert '3,376' in page.locator('#catalogTargetProgress').inner_text(),page.locator('#catalogTargetProgress').inner_text()
  page.screenshot(path=str(P/f'35K_Alchemy_V27_Discoveries_{width}.png'))
  assert not errors,errors
  print('PASS',width,count)
  page.close()
 browser.close()
