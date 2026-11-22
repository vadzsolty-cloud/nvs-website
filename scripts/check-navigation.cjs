const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');

(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');
 const {content}=await import('../src/content.mjs');
 const {portalCopy}=await import('../src/premium.mjs');
 const {business}=await import('../src/business.mjs');
 const base='/nvs-website',origin='http://127.0.0.1:4192';
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:base,OUTPUT_DIR:'artifacts/navigation-pages',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/navigation-pages',basePath:base});
 await new Promise(r=>server.listen(4192,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
  const context=await browser.newContext({reducedMotion:'no-preference'});
  await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const targets=['services','about','references','contact'];
  const aligned=async target=>{
   await page.waitForURL(url=>url.hash==='#'+target&&!url.pathname.includes('/services/'));
   await page.waitForFunction(id=>{
    const section=document.getElementById(id);
    // All destinations align their visible content below the full header.
    const arrival=section.firstElementChild;
    const top=arrival.getBoundingClientRect().top;
    const header=document.querySelector('.site-header').getBoundingClientRect().bottom;
    const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return top>=header+8&&top<=header+40&&Math.abs(top-padding)<=4;
   },target);
   assert.equal(new URL(page.url()).hash,'#'+target);
   assert.equal(await page.locator('#site-menu').evaluate(el=>el.open),false);
   assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('menu-open')),false);
  };
  const openMenu=()=>page.locator('.menu-toggle').click();
  const menuLink=(lang,index)=>page.locator('#site-menu').getByRole('link',{name:content[lang].nav[index],exact:true});
  for(const width of [390,1440])for(const lang of ['hu','ro','en']){
   await page.setViewportSize({width,height:900});
   const home=origin+base+'/'+lang+'/';
   await page.goto(home);
   if(await page.locator('#privacy-preferences').isVisible())await page.locator('[data-consent=reject]').click();
   const links=await page.locator('.site-header a,#site-menu a,.legal-footer a').evaluateAll(els=>els.map(a=>({href:a.href,text:a.textContent.trim()})));
   for(const link of links){
    const url=new URL(link.href);
    if(url.origin===origin){
     const response=await context.request.get(url.href);
     assert.equal(response.status(),200,link.href);
     if(url.hash){
      const html=await response.text();
      assert.ok(html.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),link.href);
     }
    }
   }
   assert.equal(await page.locator('#site-menu').getByRole('link',{name:portalCopy[lang].online,exact:true,includeHidden:true}).getAttribute('href'),business.app);
   assert.equal(await page.locator('#site-menu .menu-contact .portal-contact-phone').getAttribute('href'),business.phoneHref);
   // Desktop navigation and drawer navigation must land at the same section start.
   if(width===1440)for(let i=0;i<targets.length;i++){
    await page.locator('.desktop-nav').getByRole('link',{name:content[lang].nav[i],exact:true}).click();
    await aligned(targets[i]);
   }
   for(let i=0;i<targets.length;i++){
    await openMenu();await menuLink(lang,i).click();await aligned(targets[i]);
   }
   // Repeat the existing fragment after the visitor has manually scrolled elsewhere.
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   for(let i=0;i<targets.length;i++)for(let repeat=0;repeat<2;repeat++){
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await openMenu();await menuLink(lang,i).click();await aligned(targets[i]);
   }
   // Each drawer link also works when navigating back from a service subpage.
   for(let i=0;i<targets.length;i++){
    await page.goto(home+'services/diagnostics/');
    await openMenu();await menuLink(lang,i).click();await aligned(targets[i]);
   }
   await openMenu();
   await page.locator('#site-menu').getByRole('link',{name:portalCopy[lang].account,exact:true}).click();
   await page.waitForURL(home+'account/');
   await openMenu();await page.keyboard.press('Escape');
   assert.equal(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),true);
   console.log('PASS navigation',lang,width);
  }
  // Reading header follows scroll direction without shifting the document or hiding navigation.
  for(const lang of ['hu','ro','en'])for(const [width,height] of [[320,640],[390,844],[768,900],[1366,600],[1440,900]]){
   await page.setViewportSize({width,height});
   await page.goto(origin+base+'/'+lang+'/');
   const full=await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().height);
   const position=()=>page.locator('#services').evaluate(el=>el.getBoundingClientRect().top+scrollY);
   const documentTop=await position();
   await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
   if(width<=1200||height<=700){
    await page.waitForFunction(()=>Math.abs(document.querySelector('.site-header').getBoundingClientRect().height-64)<1);
    assert.ok(Math.abs(await position()-documentTop)<1,'Collapsing must not shift document content');
    const controls=await page.locator('.site-header').evaluate(el=>{
     const brand=el.querySelector('.brand').getBoundingClientRect(),account=el.querySelector('.account-link').getBoundingClientRect(),menu=el.querySelector('.menu-toggle').getBoundingClientRect();
     return {clear:brand.right<=account.left&&account.right<=menu.left,menuHeight:menu.height,accountHeight:account.height,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.ok(controls.clear&&controls.menuHeight>=44&&controls.accountHeight>=44&&!controls.overflow,JSON.stringify(controls));
    if(lang==='hu'&&width===390)await page.screenshot({path:'artifacts/header-mobile-compact.png'});
    await page.evaluate(()=>scrollTo({top:840,behavior:'instant'}));
    await page.waitForFunction(full=>Math.abs(document.querySelector('.site-header').getBoundingClientRect().height-full)<1,full);
    assert.ok(Math.abs(await position()-documentTop)<1,'Expanding must not shift document content');
    await page.evaluate(()=>scrollTo({top:1100,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-compact'));
    await openMenu();await menuLink(lang,1).click();await aligned('about');
   }else assert.equal(await page.locator('.site-header').evaluate(el=>el.classList.contains('is-compact')),false);
   console.log('PASS reading header',lang,width,height);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:844});await page.goto(origin+base+'/hu/');
  await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-compact'));
  assert.equal(await page.locator('.site-header').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  await page.emulateMedia({reducedMotion:'no-preference'});
  // The complete menu, including its contact card, fits typical laptop windows.
  for(const lang of ['hu','ro','en']){
   await page.goto(origin+base+'/'+lang+'/');
   await openMenu();
   for(const [width,height] of [[1366,600],[1280,640],[1440,768],[1920,1080],[390,844],[320,640]]){
    await page.setViewportSize({width,height});
    const menu=await page.locator('#site-menu').evaluate(el=>{
     const r=el.getBoundingClientRect(),heading=el.querySelector('.menu-heading').getBoundingClientRect(),card=el.querySelector('.menu-contact').getBoundingClientRect();
     return {scroll:el.scrollHeight,client:el.clientHeight,width:r.width,top:heading.top,bottom:card.bottom,viewport:innerHeight,navMin:Math.min(...Array.from(el.querySelectorAll('nav a'),a=>a.getBoundingClientRect().height))};
    });
    assert.ok(menu.scroll<=menu.client+1&&menu.top>=0&&menu.bottom<=menu.viewport&&menu.navMin>=36,lang+' '+width+'x'+height+' '+JSON.stringify(menu));
    if(lang==='hu'&&width===1366)await page.screenshot({path:'artifacts/menu-laptop-fit.png'});
   }
   await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1;});
