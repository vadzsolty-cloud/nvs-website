const {chromium}=require('playwright'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');const {portalCopy}=await import('../src/premium.mjs');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',OUTPUT_DIR:'artifacts/premium-pages',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/premium-pages',basePath:'/nvs-website'});await new Promise(r=>server.listen(4188,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
  const context=await browser.newContext({acceptDownloads:true,hasTouch:true});let releaseCalls=0,authCalls=0,apkCalls=0,apiFails=false;
  const asset=v=>({name:'NightVisionService-v'+v+'.apk',browser_download_url:'https://github.com/vadzsolty-cloud/nvs-app-letoltes/releases/download/apk-v'+v+'-run2/NightVisionService-v'+v+'.apk'});
  const releases=[{tag_name:'apk-v5.0.2-run2',assets:[asset('5.0.2')]},{tag_name:'apk-v99.0.0-run2',prerelease:true,assets:[asset('99.0.0')]},{tag_name:'apk-v5.0.10-run2',assets:[asset('5.0.10')]},{tag_name:'apk-v98.0.0-run2',draft:true,assets:[asset('98.0.0')]},{tag_name:'apk-v97.0.0-run2',assets:[{name:'NightVisionService-v97.0.0.apk',browser_download_url:'https://example.invalid/forged.apk'}]}];
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());if(u.origin==='http://127.0.0.1:4188')return route.continue();
   if(u.hostname==='api.github.com'){releaseCalls++;assert.equal(u.pathname,'/repos/vadzsolty-cloud/nvs-app-letoltes/releases');return route.fulfill({status:apiFails?403:200,json:apiFails?{message:'synthetic rate limit'}:releases});}
   if(u.hostname==='github.com'&&u.pathname.endsWith('.apk')){apkCalls++;return route.fulfill({headers:{'Content-Type':'application/vnd.android.package-archive','Content-Disposition':'attachment; filename="fixture.apk"'},body:'synthetic-apk-fixture'});}
   if(/identitytoolkit|cloudfunctions/.test(u.hostname))authCalls++;return route.abort();
  });
  const page=await context.newPage();await page.emulateMedia({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['hu','ro','en'])for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:950});await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/');
   if(await page.locator('#privacy-preferences').isVisible())await page.locator('[data-consent=reject]').click();
   assert.equal(await page.locator('.account-link').getAttribute('href'),'/nvs-website/'+lang+'/account/');
   assert.equal(await page.locator('#native-login').count(),0);assert.equal(await page.locator('#services .tile-visual picture').count(),6);
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&!el.closest('.slides,.site-menu,.lightbox');}).map(el=>({tag:el.tagName,class:el.className,id:el.id,right:el.getBoundingClientRect().right})).slice(0,12)}));
    assert.ok(overflow.scroll<=overflow.width,lang+' '+width+' '+theme+' '+JSON.stringify(overflow));
    await page.locator('.menu-toggle').click();assert.equal(await page.locator('#site-menu').evaluate(e=>e.open),true);assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');assert.equal(await page.locator('#site-menu').evaluate(e=>e.open),false);assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
    if(lang==='hu'){
     await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});await page.screenshot({path:'artifacts/premium-home-'+width+'-'+theme+'.png'});
     await page.locator('#services').scrollIntoViewIfNeeded();
     await page.locator('#services .tile-visual img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
     assert.equal(await page.locator('#services .tile-visual img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),true);
     await page.locator('#services').screenshot({path:'artifacts/premium-tiles-'+width+'-'+theme+'.png'});
    }
   }
   await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/account/');
   assert.equal(await page.locator('#native-login').count(),1);assert.equal(await page.locator('#register a').getAttribute('href'),'https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/');
   assert.equal(await page.locator('.languages a[lang=en]').getAttribute('href'),'/nvs-website/en/account/');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(lang==='hu')await page.screenshot({path:'artifacts/premium-account-'+width+'.png',fullPage:true});
  }
  assert.equal(releaseCalls,0,'APK resolution is only allowed on the download page');assert.equal(authCalls,0);
  const downloadEvent=page.waitForEvent('download');await page.goto('http://127.0.0.1:4188/nvs-website/hu/download/');
  const download=await downloadEvent;assert.equal(download.url(),asset('5.0.10').browser_download_url);assert.equal(releaseCalls,1);assert.equal(apkCalls,1);await download.delete();
  apiFails=true;await page.goto('http://127.0.0.1:4188/nvs-website/en/download/');await page.waitForFunction(()=>document.querySelector('[data-download-status]').textContent===document.querySelector('[data-download-status]').dataset.error);
  assert.equal(await page.locator('[data-apk-link]').getAttribute('href'),'https://github.com/vadzsolty-cloud/nvs-app-letoltes/releases/latest');assert.equal(apkCalls,1);assert.equal(await page.locator('[data-download-status]').innerText(),portalCopy.en.downloadError);assert.equal(authCalls,0);
  assert.deepEqual(errors,[]);console.log('PASS: HU/RO/EN premium layout and account links, accessible menu/Escape/focus, photo tiles, no overflow, existing shared registration, version sorting, prerelease/draft/foreign APK rejection, one automatic download and API failure fallback. All external traffic intercepted.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
