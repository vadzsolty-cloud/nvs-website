const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');
 const server=createPreviewServer();await new Promise(r=>server.listen(4182,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
 const context=await browser.newContext();const page=await context.newPage();let maps=0,facebook=0;
 await context.route('https://maps.google.com/**',r=>{maps++;return r.fulfill({body:'<!doctype html><title>Map test</title>',contentType:'text/html'});});
 await context.route('https://www.facebook.com/**',r=>{facebook++;return r.fulfill({body:'<!doctype html><title>Facebook test</title>',contentType:'text/html'});});
 await page.goto('http://127.0.0.1:4182/hu/',{waitUntil:'load'});
 assert.equal(maps,0);assert.equal(facebook,0);assert.equal(await page.locator('iframe[src]').count(),0);
 await page.locator('[data-consent=reject]').click();await page.reload({waitUntil:'load'});
 assert.equal(await page.locator('#privacy-preferences').isVisible(),false);assert.equal(maps,0);assert.equal(facebook,0);
 await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('#consent-maps').check();await page.locator('[data-consent=save]').click();
 await page.waitForFunction(()=>document.querySelector('[data-consent-category=maps]').hasAttribute('src'));
 assert.equal(await page.locator('iframe[data-consent-category=facebook][src]').count(),0);
 await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('[data-consent=reject]').click();
 assert.equal(await page.locator('iframe[src]').count(),0);
 await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('[data-consent=accept]').click();
 assert.equal(await page.locator('iframe[data-consent-category=maps][src]').count(),1);
 assert.equal(await page.locator('iframe[data-consent-category=facebook]').count(),0);
 await page.goto('http://127.0.0.1:4182/hu/facebook/',{waitUntil:'load'});assert.equal(await page.locator('iframe[data-consent-category=facebook][src]').count(),0);
 assert.ok(maps>0);
 for(const l of ['hu','ro','en'])for(const kind of ['company','privacy','cookies','terms']){
  const response=await page.goto('http://127.0.0.1:4182/'+l+'/'+kind+'/',{waitUntil:'load'});assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.locator('.legal-footer').count());
 }
 await context.clearCookies();await page.goto('http://127.0.0.1:4182/hu/',{waitUntil:'load'});
 await page.evaluate(()=>localStorage.setItem('nvs-consent-v1',JSON.stringify({version:1,at:1,maps:true,facebook:true})));
 await page.reload({waitUntil:'load'});assert.equal(await page.locator('iframe[src]').count(),0);assert.ok(await page.locator('#privacy-preferences').isVisible());
 await page.locator('[data-consent=reject]').click();await page.setViewportSize({width:390,height:844});await page.locator('.legal-footer [data-privacy-settings]').click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'artifacts/privacy-mobile.png'});
 console.log('PASS: cold-load blocks vendors; reject persists; granular map-only choice; withdrawal unloads; accept enables; expiry resets; legal pages HU/RO/EN; mobile width');
 await browser.close();await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
