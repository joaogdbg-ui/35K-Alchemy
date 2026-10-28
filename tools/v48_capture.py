from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
h=(R/'35K_Alchemy_V48_Offline.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':820},is_mobile=True,has_touch=True)
 page.set_content(h,wait_until='domcontentloaded')
 page.screenshot(path=str(R/'V48_Mode_Selection_390.png'))
 page.locator('[data-mode-choice="family"][data-mode-family="nature"]').click()
 page.locator('#settingsBtn').click()
 page.locator('[data-theme-choice="dark"]').click()
 page.locator('#modalClose').click()
 page.screenshot(path=str(R/'V48_Family_Dark_390.png'))
 b.close()
