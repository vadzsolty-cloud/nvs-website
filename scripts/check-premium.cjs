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
   assert.equal(await page.locator('.fb-card').count(),0);assert.equal(await page.locator('iframe[data-consent-category=facebook]').count(),0);
   assert.equal(await page.locator('.photo-gallery .zoom:visible').count(),6);assert.equal(await page.locator('.photo-gallery .zoom').count(),20);
   assert.equal(await page.locator('main a[href*="/account/"]:visible').count(),2);
   assert.equal(await page.locator('.booking-strip').count(),0);
   assert.equal(await page.locator('.hero .slider-prev [data-icon="chevron-left"],.hero .slider-next [data-icon="chevron-right"]').count(),2);
   assert.equal(await page.locator('#services .card-top .service-icon .icon-depth').count(),6);
   assert.equal(await page.locator('#services .card-link').first().evaluate(e=>parseFloat(getComputedStyle(e).borderTopWidth)>=1&&getComputedStyle(e).boxShadow!=='none'),true);
   assert.equal(await page.locator('.equipment-list>li').count(),8);
   assert.equal(await page.locator('.equipment-card').count(),8);
   assert.equal(await page.locator('.equipment-card[open]').count(),0);
   assert.equal(await page.locator('.general-workshop-card,.general-workshop-label').count(),0);
   const equipmentStyles=await page.locator('.equipment-list>li').evaluateAll(items=>items.map(e=>{const s=getComputedStyle(e);return {background:s.backgroundColor,radius:s.borderRadius,padding:s.padding};}));
   assert.ok(equipmentStyles.every(s=>JSON.stringify(s)===JSON.stringify(equipmentStyles[0])),'All eight cards should share the same base styling');
   for(const theme of ['light','dark']){
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>!document.querySelector('.site-header').classList.contains('is-compact'));
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    assert.ok(['rgb(245, 248, 242)','rgb(162, 255, 38)'].includes(await page.locator('.hero .slider-prev').evaluate(e=>getComputedStyle(e).color)));
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&!el.closest('.slides,.site-menu,.lightbox');}).map(el=>({tag:el.tagName,class:el.className,id:el.id,right:el.getBoundingClientRect().right})).slice(0,12)}));
    assert.ok(overflow.scroll<=overflow.width,lang+' '+width+' '+theme+' '+JSON.stringify(overflow));
    const readability=await page.evaluate(()=>{
     const rect=s=>document.querySelector(s).getBoundingClientRect(),brand=rect('.site-header .brand'),account=rect('.account-link'),social=rect('.header-social'),menu=rect('.menu-toggle');
     return {logo:rect('.site-logo').width,navFont:parseFloat(getComputedStyle(document.querySelector('.languages a')).fontSize),tileFont:parseFloat(getComputedStyle(document.querySelector('#services .service-card p')).fontSize),brandClear:brand.right<=account.left+1,actionsClear:account.right<=social.left+1&&social.right<=menu.left+1,canvas:rect('#services').width};
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
    const menuContact=page.locator('#site-menu .menu-contact');
    assert.equal(await menuContact.locator('.portal-contact-phone').getAttribute('href'),'tel:+40741738604');
    assert.equal(await menuContact.locator('.portal-contact-email').getAttribute('href'),'mailto:nightvisionservice2025@gmail.com');
    await menuContact.scrollIntoViewIfNeeded();
    const compactContact=await menuContact.evaluate(el=>{const r=el.getBoundingClientRect(),dialog=el.closest('dialog').getBoundingClientRect();return {left:r.left,right:r.right,dialogLeft:dialog.left,dialogRight:dialog.right,font:parseFloat(getComputedStyle(el.querySelector('.portal-contact-phone strong')).fontSize)};});
    assert.ok(compactContact.left>=compactContact.dialogLeft&&compactContact.right<=compactContact.dialogRight&&compactContact.font===22,JSON.stringify(compactContact));
    if(lang==='hu'&&[320,390,1440].includes(width))await page.locator('#site-menu').screenshot({path:'artifacts/menu-contact-'+width+'-'+theme+'.png'});
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.body.classList.contains('menu-open'));assert.equal(await page.locator('#site-menu').evaluate(e=>e.open),false);assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
    if(lang==='hu'){
     await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});await page.screenshot({path:'artifacts/premium-home-'+width+'-'+theme+'.png'});
     await page.locator('#services').scrollIntoViewIfNeeded();
     await page.locator('#services .tile-visual img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
     assert.equal(await page.locator('#services .tile-visual img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),true);
     await page.locator('#services').screenshot({path:'artifacts/premium-tiles-'+width+'-'+theme+'.png'});
    }
   }
   if([320,768,1440].includes(width)){
    const equipment=page.locator('.equipment-card');
    for(let i=0;i<8;i++){
     const card=equipment.nth(i);await card.locator('summary').press('Enter');await card.locator('.equipment-explanation').waitFor({state:'visible'});
     assert.equal(await card.evaluate(e=>e.open),true,lang+' '+width+' equipment '+i+' keyboard toggle');assert.equal(await card.locator('.equipment-explanation').isVisible(),true);
     assert.equal(await card.locator('.equipment-collapse').isVisible(),true);assert.equal(await card.locator('.equipment-expand').isVisible(),false);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lang+' '+width+' equipment '+i);
    }
    assert.equal(await page.locator('.equipment-card[open]').count(),8,'Equipment explanations should open independently');
    for(const theme of ['light','dark']){
     await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lang+' '+width+' open equipment '+theme);
    }
    if(lang==='hu'&&width===1440)await page.locator('.workshop-equipment').screenshot({path:'artifacts/equipment-expanded-desktop.png'});
    for(let i=0;i<8;i++){const card=equipment.nth(i);await card.locator('summary').focus();await page.keyboard.press('Space');assert.equal(await card.evaluate(e=>e.open),false);}
    assert.equal(await page.locator('.equipment-explanation:visible').count(),0);
   }
   if([320,390,1440].includes(width))for(const kind of ['photos']){
    const more=page.locator('[data-reference-more="'+kind+'"]'),summary=more.locator('summary');
    assert.equal(await more.evaluate(e=>e.open),false);
    await summary.focus();await page.keyboard.press('Enter');assert.equal(await more.evaluate(e=>e.open),true);
    assert.equal(await page.locator(kind==='posts'?'.fb-card:visible':'.photo-gallery .zoom:visible').count(),kind==='posts'?9:20);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(kind==='photos'){
     const photo=more.locator('.zoom').first();await photo.click();assert.equal(await page.locator('.lightbox').evaluate(e=>e.open),true);
     const before=await page.locator('.lightbox-count').innerText();await page.locator('.lightbox-next').click();assert.notEqual(await page.locator('.lightbox-count').innerText(),before);await page.locator('.lightbox-prev').click();assert.equal(await page.locator('.lightbox-count').innerText(),before);
     for(const theme of ['light','dark']){
      await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
      assert.ok(['rgb(245, 248, 242)','rgb(162, 255, 38)'].includes(await page.locator('.lightbox-prev').evaluate(e=>getComputedStyle(e).color)));
      assert.equal(await page.locator('.lightbox-prev [data-icon="chevron-left"] .icon-depth').count(),1);
      if(width<=700){const positions=await page.locator('.lightbox').evaluate(e=>({caption:e.querySelector('figcaption').getBoundingClientRect().bottom,controls:e.querySelector('.lightbox-prev').getBoundingClientRect().top}));assert.ok(positions.caption<=positions.controls-4,JSON.stringify(positions));}
     }
     assert.ok(await page.locator('.lightbox-caption').innerText());
     // Native dialog close restores focus in a queued event; await its handler before the next keypress.
     await page.evaluate(()=>{window.__nvsTestDialogClosed=new Promise(resolve=>document.querySelector('.lightbox').addEventListener('close',()=>resolve(true),{once:true}));});
     await page.keyboard.press('Escape');await page.evaluate(()=>window.__nvsTestDialogClosed);await page.evaluate(()=>{delete window.__nvsTestDialogClosed;});
     assert.equal(await photo.evaluate(e=>e===document.activeElement),true);
     assert.ok((await more.locator('li>p span').first().innerText()).startsWith('07'));
    }
    await summary.press('Space');await page.waitForFunction(kind=>!document.querySelector('[data-reference-more="'+kind+'"]').open,kind);assert.equal(await more.evaluate(e=>e.open),false);
   }
   await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/account/');
   assert.equal(await page.locator('#native-login').count(),1);assert.equal(await page.locator('#register a').getAttribute('href'),'https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/');
   assert.equal(await page.locator('.back [data-icon="arrow-left"] .icon-depth').count(),1);
   assert.equal(await page.locator('.back').evaluate(e=>parseFloat(getComputedStyle(e).borderTopWidth)>=1&&getComputedStyle(e).boxShadow!=='none'),true);
   assert.equal(await page.locator('.languages a[lang=en]').getAttribute('href'),'/nvs-website/en/account/');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('.copyright').count(),1);
   const contact=page.locator('.portal-hero .portal-contact');await contact.waitFor({state:'visible'});
   assert.equal(await contact.locator('.portal-contact-phone').getAttribute('href'),'tel:+40741738604');
   assert.equal(await contact.locator('.portal-contact-email').getAttribute('href'),'mailto:nightvisionservice2025@gmail.com');
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lang+' '+width+' contact '+theme);
    const layout=await page.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),phone=r('.portal-hero .portal-contact-phone'),contact=r('.portal-hero .portal-contact'),heading=r('.portal-heading');return {phoneTop:phone.top,phoneHeight:phone.height,font:parseFloat(getComputedStyle(document.querySelector('.portal-hero .portal-contact-phone strong')).fontSize),contactTop:contact.top,contactBottom:contact.bottom,contactLeft:contact.left,headingRight:heading.right,headingBottom:heading.bottom,loginTop:r('#native-login').top};});
    assert.ok(layout.font>=24&&layout.phoneHeight>=44,JSON.stringify(layout));
    assert.ok(layout.phoneTop<950,lang+' '+width+' phone should be immediately available '+JSON.stringify(layout));
    if(width>1000)assert.ok(layout.contactLeft>=layout.headingRight,JSON.stringify(layout));
    else assert.ok(layout.contactTop>=layout.headingBottom&&layout.contactBottom<layout.loginTop,JSON.stringify(layout));
    if(lang==='hu'&&[320,390,1280,1440].includes(width))await page.locator('.portal-hero').screenshot({path:'artifacts/portal-contact-'+width+'-'+theme+'.png'});
   }
   if(lang==='hu')await page.screenshot({path:'artifacts/premium-account-'+width+'.png',fullPage:true});
  }
  const guideIds=['acc','adas','hunter-3d','camera','led-matrix','diagnostics'];
  for(const lang of ['hu','ro','en'])for(const id of guideIds){
   await page.goto('http://127.0.0.1:4188/nvs-website/'+lang+'/services/'+id+'/');
   assert.equal(await page.locator('#service-guide').count(),1);assert.equal(await page.locator('.education-faq details').count(),2);
   assert.equal(await page.locator('.education-systems dt').count(),3);assert.equal(await page.locator('.education-process article').count(),3);
   assert.ok(await page.locator('.education-heading .lead').innerText());
   assert.equal(await page.locator('main a[href*="/account/"]').count(),2,'Core services offer appointment actions before and after the guide');
   assert.equal(await page.locator('#service-guide a[href*="/account/"]').count(),0,'Educational reading content stays uninterrupted');
   assert.equal(await page.locator('main #booking,main #contact,main #app,main .booking-demo,main .education-help').count(),0);
   assert.equal(await page.locator('.detail-hero p').filter({hasText:'Strada Principală'}).count(),0);
   assert.equal(await page.locator('.site-header .account-link').count(),1);assert.equal(await page.locator('.footer-apps a[href*="/account/"]').count(),1);
   await page.locator('.education-faq summary').first().click();assert.equal(await page.locator('.education-faq details').first().evaluate(el=>el.open),true);
   assert.equal(await page.locator('.education-faq details').first().locator('p').isVisible(),true);
   for(const width of [320,768,1280,1440])for(const theme of ['light','dark']){
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
   const social=motion.locator('.header-social');assert.equal(await social.count(),1);
   assert.equal(await social.getAttribute('href'),'/nvs-website/hu/facebook/');assert.equal(await social.getAttribute('aria-label'),'Social media');assert.equal(await social.innerText(),'');
   const green='rgb(162, 255, 38)';assert.equal(await social.locator('svg').evaluate(el=>getComputedStyle(el).color),green);
   await social.hover();await motion.waitForFunction(()=>getComputedStyle(document.querySelector('.header-social svg')).color==='rgb(24, 119, 242)');
   await social.screenshot({path:'artifacts/facebook-hover-'+theme+'.png'});
   await motion.mouse.move(0,0);await motion.waitForFunction(c=>getComputedStyle(document.querySelector('.header-social svg')).color===c,green);
   await motion.keyboard.press('Tab');await social.focus();assert.equal(await social.evaluate(el=>el.matches(':focus-visible')),true);
   await motion.waitForFunction(()=>getComputedStyle(document.querySelector('.header-social svg')).color==='rgb(24, 119, 242)');
   await social.evaluate(el=>el.blur());
   for(const selector of ['#services .service-card','.service-slider','.photo-gallery .zoom','.portal-entry','[data-reference-more]>summary'])await lifted(selector);
   await motion.locator('.equipment-card>summary').first().hover();assert.equal(await motion.locator('.equipment-list>li').first().evaluate(e=>getComputedStyle(e).transform),'none');await motion.waitForFunction(()=>getComputedStyle(document.querySelector('.equipment-list>li')).boxShadow!=='none');
   await motion.emulateMedia({reducedMotion:'reduce'});
   for(const selector of ['#services .service-card','.header-social']){await motion.locator(selector).first().hover();assert.equal(await motion.locator(selector).first().evaluate(el=>getComputedStyle(el).transform),'none');}
   await motion.emulateMedia({reducedMotion:'no-preference'});
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/facebook/');await lifted('.fb-card');
   await motion.emulateMedia({reducedMotion:'reduce'});await motion.locator('.fb-card').first().hover();assert.equal(await motion.locator('.fb-card').first().evaluate(el=>getComputedStyle(el).transform),'none');await motion.emulateMedia({reducedMotion:'no-preference'});
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/account/');
   await motion.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   for(const selector of ['.register-card','.portal-tile'])await lifted(selector);
   await motion.goto('http://127.0.0.1:4188/nvs-website/hu/services/adas/');await lifted('.process article');
  }
  await desktop.close();
  const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:950}});
  await noScript.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4188'?r.continue():r.abort());
  const plain=await noScript.newPage();await plain.goto('http://127.0.0.1:4188/nvs-website/hu/');
  assert.equal(await plain.locator('.consent-panel').evaluate(e=>getComputedStyle(e).position),'static');
  assert.equal(await plain.locator('.consent-actions').isVisible(),false);assert.equal(await plain.locator('iframe[src]').count(),0);
  const nativeCard=plain.locator('.equipment-card').last();await nativeCard.locator('summary').click();assert.equal(await nativeCard.evaluate(e=>e.open),true);assert.equal(await nativeCard.locator('.equipment-explanation').isVisible(),true);await nativeCard.locator('summary').click();assert.equal(await nativeCard.evaluate(e=>e.open),false);
  assert.equal(await plain.locator('.fb-card').count(),0);assert.equal(await plain.locator('.photo-gallery .zoom:visible').count(),6);
  for(const kind of ['photos']){await plain.locator('[data-reference-more="'+kind+'"]>summary').click();assert.equal(await plain.locator('[data-reference-more="'+kind+'"]').evaluate(e=>e.open),true);}
  assert.equal(await plain.locator('.photo-gallery .zoom:visible').count(),20);await plain.goto('http://127.0.0.1:4188/nvs-website/hu/facebook/');assert.equal(await plain.locator('.fb-card:visible').count(),10);assert.equal(await plain.locator('iframe[src]').count(),0);await noScript.close();
  const downloadEvent=page.waitForEvent('download');await page.goto('http://127.0.0.1:4188/nvs-website/hu/download/',{waitUntil:'commit'});
  const download=await downloadEvent;assert.equal(download.url(),asset('5.0.10').browser_download_url);assert.equal(releaseCalls,1);assert.equal(apkCalls,1);await download.delete();
  apiFails=true;await page.goto('http://127.0.0.1:4188/nvs-website/en/download/');await page.waitForFunction(()=>document.querySelector('[data-download-status]').textContent===document.querySelector('[data-download-status]').dataset.error);
  assert.equal(await page.locator('[data-apk-link]').getAttribute('href'),'https://github.com/vadzsolty-cloud/nvs-app-letoltes/releases/latest');assert.equal(apkCalls,1);assert.equal(await page.locator('[data-download-status]').innerText(),portalCopy.en.downloadError);assert.equal(authCalls,0);
  assert.deepEqual(errors,[]);console.log('PASS: HU/RO/EN premium layout and account links, accessible menu/Escape/focus, photo tiles, no overflow, existing shared registration, version sorting, prerelease/draft/foreign APK rejection, one automatic download and API failure fallback. All external traffic intercepted.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
