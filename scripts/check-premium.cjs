const {chromium}=require('playwright'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');const {portalCopy}=await import('../src/premium.mjs');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',OUTPUT_DIR:'artifacts/premium-pages',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/premium-pages',basePath:'/nvs-website'});await new Promise(r=>server.listen(4188,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
  const preferences=await browser.newContext({colorScheme:'light'});
  await preferences.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4188'?r.continue():r.abort());
  await preferences.addInitScript(()=>{if(!localStorage.getItem('theme-test-seeded')){localStorage.setItem('nvs-theme','dark');localStorage.setItem('theme-test-seeded','yes');}});
  const themed=await preferences.newPage();const themeErrors=[];themed.on('pageerror',e=>themeErrors.push(e.message));
  await themed.goto('http://127.0.0.1:4188/nvs-website/hu/');
  await themed.locator('[data-consent=reject]').click();
  const actual=()=>themed.locator('html').getAttribute('data-theme');
  assert.equal(await actual(),'light');assert.equal(await themed.locator('.theme-toggle').getAttribute('data-mode'),'system');
  assert.equal(await themed.locator('.fb-cover-brand').count(),0);
  await themed.emulateMedia({colorScheme:'dark'});await themed.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
  await themed.locator('.theme-toggle').click();assert.equal(await actual(),'light');
  await themed.emulateMedia({colorScheme:'light'});await themed.emulateMedia({colorScheme:'dark'});assert.equal(await actual(),'light');
  await themed.goto('http://127.0.0.1:4188/nvs-website/ro/cookies/');
  assert.equal(await actual(),'light');assert.equal(await themed.locator('.theme-toggle').getAttribute('data-mode'),'light');
  await themed.locator('.theme-toggle').click();assert.equal(await actual(),'dark');
  await themed.locator('.theme-toggle').click();assert.equal(await themed.locator('.theme-toggle').getAttribute('data-mode'),'system');
  await themed.emulateMedia({colorScheme:'light'});await themed.waitForFunction(()=>document.documentElement.dataset.theme==='light');
  assert.equal(await themed.evaluate(()=>localStorage.getItem('nvs-theme')),'dark');assert.deepEqual(themeErrors,[]);
  await preferences.close();
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
  for(const lang of ['hu','ro','en'])for(const width of [320,390,768,1024,1280,1440,1920,2560]){
   await page.setViewportSize({width,height:950});await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/');
   if(await page.locator('#privacy-preferences').isVisible())await page.locator('[data-consent=reject]').click();
   assert.equal(await page.locator('.account-link').getAttribute('href'),'/nvs-website/'+lang+'/account/');
   assert.equal(await page.locator('#native-login').count(),0);assert.equal(await page.locator('#services .tile-visual picture').count(),6);
   assert.equal(await page.locator('.fb-cover-brand').count(),0,'Facebook photo covers should not repeat the company wordmark');
   assert.equal(await page.locator('.fb-cover-label').count(),0);
   assert.equal(await page.locator('.fb-card:visible').count(),3);assert.equal(await page.locator('.fb-card').count(),9);
   assert.equal(await page.locator('.photo-gallery .zoom:visible').count(),6);assert.equal(await page.locator('.photo-gallery .zoom').count(),20);
   assert.equal(await page.locator('main a[href*="/account/"]:visible').count(),2);
   assert.equal(await page.locator('.booking-strip').count(),0);
   assert.equal(await page.locator('.equipment-list>li').count(),8);
   assert.equal(await page.locator('.general-workshop-card a').count(),0);
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&!el.closest('.slides,.site-menu,.lightbox');}).map(el=>({tag:el.tagName,class:el.className,id:el.id,right:el.getBoundingClientRect().right})).slice(0,12)}));
    assert.ok(overflow.scroll<=overflow.width,lang+' '+width+' '+theme+' '+JSON.stringify(overflow));
    const readability=await page.evaluate(()=>{
     const rect=s=>document.querySelector(s).getBoundingClientRect(),brand=rect('.site-header .brand'),account=rect('.account-link'),menu=rect('.menu-toggle');
     return {logo:rect('.site-logo').width,navFont:parseFloat(getComputedStyle(document.querySelector('.languages a')).fontSize),tileFont:parseFloat(getComputedStyle(document.querySelector('#services .service-card p')).fontSize),brandClear:brand.right<=account.left+1,actionsClear:account.right<=menu.left+1,canvas:rect('#services').width};
    });
    assert.ok(readability.logo>=(width<=700?52:72),JSON.stringify(readability));
    assert.ok(readability.navFont>=13&&readability.tileFont>=16,JSON.stringify(readability));
    assert.ok(readability.brandClear&&readability.actionsClear,lang+' '+width+' header overlap '+JSON.stringify(readability));
    if(width>=1920)assert.ok(readability.canvas>=1900,'Wide screens should use the larger canvas');
    assert.ok((await page.locator('.copyright').innerText()).includes('Copyright © 2026 NICHTVISION SERVICE S.R.L.'));
    const footer=await page.locator('.legal-footer').evaluate(el=>({height:el.getBoundingClientRect().height,atBottom:el.nextElementSibling?.classList.contains('consent-panel'),groups:[...el.querySelectorAll('[data-footer-group]')].map(g=>g.open)}));
    assert.equal(footer.atBottom,true,'Footer should be the last normal-flow content');
    assert.deepEqual(footer.groups,[width>700,width>700]);
    assert.deepEqual(await page.locator('.footer-assurance img').evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})),{width:250,height:50});
    if(width>=1280)assert.ok(footer.height<=380,lang+' '+width+' compact desktop footer '+JSON.stringify(footer));
    if(width<=700)assert.ok(footer.height<=720,lang+' '+width+' compact mobile footer '+JSON.stringify(footer));
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
   if([390,1440].includes(width))for(const kind of ['posts','photos']){
    const more=page.locator('[data-reference-more="'+kind+'"]'),summary=more.locator('summary');
    assert.equal(await more.evaluate(e=>e.open),false);
    await summary.focus();await page.keyboard.press('Enter');assert.equal(await more.evaluate(e=>e.open),true);
    assert.equal(await page.locator(kind==='posts'?'.fb-card:visible':'.photo-gallery .zoom:visible').count(),kind==='posts'?9:20);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(kind==='photos'){
     const photo=more.locator('.zoom').first();await photo.click();assert.equal(await page.locator('.lightbox').evaluate(e=>e.open),true);
     assert.ok(await page.locator('.lightbox-caption').innerText());await page.keyboard.press('Escape');assert.equal(await photo.evaluate(e=>e===document.activeElement),true);
     assert.ok((await more.locator('li>p span').first().innerText()).startsWith('07'));
    }
    await summary.focus();await page.keyboard.press('Space');assert.equal(await more.evaluate(e=>e.open),false);
   }
   await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/account/');
   assert.equal(await page.locator('#native-login').count(),1);assert.equal(await page.locator('#register a').getAttribute('href'),'https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/');
   assert.equal(await page.locator('.languages a[lang=en]').getAttribute('href'),'/nvs-website/en/account/');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('.copyright').count(),1);
   if(lang==='hu')await page.screenshot({path:'artifacts/premium-account-'+width+'.png',fullPage:true});
  }
  const guideIds=['acc','adas','hunter-3d','camera','led-matrix','diagnostics'];
  for(const lang of ['hu','ro','en'])for(const id of guideIds){
   await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/services/'+id+'/');
   assert.equal(await page.locator('#service-guide').count(),1);assert.equal(await page.locator('.education-faq details').count(),2);
   assert.equal(await page.locator('.education-systems dt').count(),3);assert.equal(await page.locator('.education-process article').count(),3);
   assert.ok(await page.locator('.education-heading .lead').innerText());
   assert.equal(await page.locator('main a[href*="/account/"]').count(),0,'Service reading content should not repeat appointment calls to action');
   assert.equal(await page.locator('main #booking,main #contact,main #app,main .booking-demo,main .education-help').count(),0);
   assert.equal(await page.locator('.detail-hero p').filter({hasText:'Strada Principală'}).count(),0);
   assert.equal(await page.locator('.site-header .account-link').count(),1);assert.equal(await page.locator('.footer-apps a[href*="/account/"]').count(),1);
   await page.locator('.education-faq summary').first().click();assert.equal(await page.locator('.education-faq details').first().evaluate(el=>el.open),true);
   assert.equal(await page.locator('.education-faq details').first().locator('p').isVisible(),true);
   for(const width of [320,768,1440])for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:950});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lang+' '+id+' '+width+' '+theme);
    if(lang==='hu'&&width===1440&&theme==='dark')await page.locator('#service-guide').screenshot({path:'artifacts/service-guide-'+id+'.png'});
   }
  }
  assert.equal(releaseCalls,0,'APK resolution is only allowed on the download page');assert.equal(authCalls,0);
  await page.setViewportSize({width:390,height:950});await page.goto('http://127.0.0.1:4188/nvs-website/hu/');
  const footerGroup=page.locator('.footer-information');assert.equal(await footerGroup.getAttribute('open'),null);
  await footerGroup.locator('summary').click();assert.equal(await footerGroup.evaluate(el=>el.open),true);assert.equal(await footerGroup.locator('a').first().isVisible(),true);
  await page.setViewportSize({width:1440,height:950});await page.waitForFunction(()=>[...document.querySelectorAll('[data-footer-group]')].every(g=>g.open));
  const desktop=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  await desktop.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4188'?r.continue():r.abort());
  const motion=await desktop.newPage();
  const lifted=async selector=>{await motion.locator(selector).first().hover();await motion.waitForFunction(s=>{const el=document.querySelector(s);return new DOMMatrixReadOnly(getComputedStyle(el).transform).m42<-1;},selector);};
  for(const theme of ['light','dark']){
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/');
   if(await motion.locator('#privacy-preferences').isVisible())await motion.locator('[data-consent=reject]').click();
   await motion.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   const social=motion.locator('.facebook-link');assert.equal(await social.count(),1);
   assert.equal(await social.getAttribute('href'),'https://www.facebook.com/share/19q4Kb3jFq/');assert.ok(await social.getAttribute('aria-label'));
   const grey=await social.evaluate(async el=>{getComputedStyle(el).color;await Promise.all(el.getAnimations().map(a=>a.finished));return getComputedStyle(el).color;});assert.notEqual(grey,'rgb(24, 119, 242)');
   await lifted('.facebook-link');await motion.waitForFunction(()=>getComputedStyle(document.querySelector('.facebook-link')).color==='rgb(24, 119, 242)');
   await social.screenshot({path:'artifacts/facebook-hover-'+theme+'.png'});
   await motion.mouse.move(0,0);await motion.waitForFunction(c=>getComputedStyle(document.querySelector('.facebook-link')).color===c,grey);
   await motion.keyboard.press('Tab');await social.focus();assert.equal(await social.evaluate(el=>el.matches(':focus-visible')),true);
   await motion.waitForFunction(()=>getComputedStyle(document.querySelector('.facebook-link')).color==='rgb(24, 119, 242)');
   await social.evaluate(el=>el.blur());
   for(const selector of ['#services .service-card','.service-slider','.equipment-list li','.fb-card','.photo-gallery .zoom','.portal-entry','[data-reference-more]>summary'])await lifted(selector);
   await motion.emulateMedia({reducedMotion:'reduce'});
   for(const selector of ['#services .service-card','.fb-card','.facebook-link']){await motion.locator(selector).first().hover();assert.equal(await motion.locator(selector).first().evaluate(el=>getComputedStyle(el).transform),'none');}
   await motion.emulateMedia({reducedMotion:'no-preference'});
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/account/');
   await motion.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   for(const selector of ['.register-card','.portal-tile'])await lifted(selector);
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/services/adas/');await lifted('.process article');
  }
  await desktop.close();
  const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:950}});
  await noScript.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4188'?r.continue():r.abort());
  const plain=await noScript.newPage();await plain.goto('http://127.0.0.1:4188/nvs-website/hu/');
  assert.equal(await plain.locator('.fb-card:visible').count(),3);assert.equal(await plain.locator('.photo-gallery .zoom:visible').count(),6);
  for(const kind of ['posts','photos']){await plain.locator('[data-reference-more="'+kind+'"]>summary').click();assert.equal(await plain.locator('[data-reference-more="'+kind+'"]').evaluate(e=>e.open),true);}
  assert.equal(await plain.locator('.fb-card:visible').count(),9);assert.equal(await plain.locator('.photo-gallery .zoom:visible').count(),20);await noScript.close();
  const downloadEvent=page.waitForEvent('download');await page.goto('http://127.0.0.1:4188/nvs-website/hu/download/');
  const download=await downloadEvent;assert.equal(download.url(),asset('5.0.10').browser_download_url);assert.equal(releaseCalls,1);assert.equal(apkCalls,1);await download.delete();
  apiFails=true;await page.goto('http://127.0.0.1:4188/nvs-website/en/download/');await page.waitForFunction(()=>document.querySelector('[data-download-status]').textContent===document.querySelector('[data-download-status]').dataset.error);
  assert.equal(await page.locator('[data-apk-link]').getAttribute('href'),'https://github.com/vadzsolty-cloud/nvs-app-letoltes/releases/latest');assert.equal(apkCalls,1);assert.equal(await page.locator('[data-download-status]').innerText(),portalCopy.en.downloadError);assert.equal(authCalls,0);
  assert.deepEqual(errors,[]);console.log('PASS: HU/RO/EN premium layout and account links, accessible menu/Escape/focus, photo tiles, no overflow, existing shared registration, version sorting, prerelease/draft/foreign APK rejection, one automatic download and API failure fallback. All external traffic intercepted.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
