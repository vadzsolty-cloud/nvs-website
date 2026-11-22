const {chromium}=require('playwright'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,OUTPUT_DIR:'artifacts/embed-pages',BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/embed-pages',basePath:'/nvs-website'});await new Promise(r=>server.listen(4191,'127.0.0.1',r));
 let browser;try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});const page=await browser.newPage();await page.emulateMedia({reducedMotion:'reduce'});const requests=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const poster='<svg data-poster xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"><rect width="360" height="640" fill="#163c21"/><rect width="360" height="14" fill="#a1ff26"/><text x="180" y="320" text-anchor="middle" fill="white" font-size="24">9:16 complete preview</text><rect y="626" width="360" height="14" fill="#a1ff26"/></svg>';
  await page.route('**/*',r=>{
   const u=new URL(r.request().url());if(u.origin==='http://127.0.0.1:4191')return r.continue();
   if(u.hostname==='www.facebook.com'){requests.push(u.href);return r.fulfill({contentType:'text/html',body:'<!doctype html><html><style>html,body{margin:0}svg{display:block;width:100%;height:auto}header,footer{height:160px;background:#fff;font:20px Arial;color:#111}</style>'+(u.pathname.endsWith('page.php')?'<header>Public page header and post caption</header>':'')+poster+(u.pathname.endsWith('page.php')?'<footer>Post actions</footer>':'')+'</html>'});}
   if(u.hostname==='maps.google.com'){requests.push(u.href);return r.fulfill({contentType:'text/html',body:'<!doctype html><p>Satellite map fixture</p>'});}
   return r.abort();
  });
  await page.setViewportSize({width:320,height:950});await page.goto('http://127.0.0.1:4191/nvs-website/hu/');
  assert.equal(requests.length,0,'Dimensions must not request vendors before consent');
  assert.equal(await page.locator('iframe[src]').count(),0);
  await page.goto('http://127.0.0.1:4191/nvs-website/hu/facebook/');assert.equal(requests.length,0);assert.equal(await page.locator('iframe[src]').count(),0);
  await page.locator('[data-consent=accept]').click();
  for(const lang of ['hu','ro','en'])for(const width of [320,390,768,1280,1920]){
   await page.setViewportSize({width,height:950});await page.goto('http://127.0.0.1:4191/nvs-website/'+lang+'/');
   const map=new URL(await page.locator('.map-loaded iframe').getAttribute('src'));assert.equal(map.searchParams.get('t'),'k');assert.equal(map.searchParams.get('z'),'18');assert.equal(await page.locator('iframe[data-consent-category=facebook]').count(),0);
   await page.goto('http://127.0.0.1:4191/nvs-website/'+lang+'/facebook/');
   await page.waitForTimeout(350);
   assert.equal(await page.locator('.fb-card').count(),8);assert.equal(await page.locator('main>section').last().getAttribute('class'),'section facebook-page-view');
   for(const selector of ['.fb-featured','.fb-timeline']){
    const el=page.locator(selector),src=new URL(await el.getAttribute('src')),box=await el.boundingBox();
    assert.equal(Number(src.searchParams.get('width')),Math.round(box.width));
    assert.equal(Number(src.searchParams.get('height')),Math.round(box.height));
    if(selector==='.fb-featured'){assert.ok(Math.abs(box.height-box.width*16/9)<1);assert.equal(new URL(src.searchParams.get('href')).pathname,'/61572089218581/videos/1697012922028515/');}
    await el.scrollIntoViewIfNeeded();const frame=await (await el.elementHandle()).contentFrame();await frame.waitForSelector('[data-poster]');
    const visible=await frame.evaluate(()=>{const b=document.querySelector('[data-poster]').getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight+1&&b.right<=innerWidth+1;});assert.equal(visible,true,lang+' '+width+' '+selector+' must show both ends of the preview');
   }
   for(const theme of ['light','dark']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.equal(await page.locator('.fb-cover img').first().evaluate(e=>getComputedStyle(e).objectFit),'contain');}
   if(lang==='hu'&&[390,1280].includes(width))await page.locator('.facebook-browser').screenshot({path:'artifacts/embeds-'+width+'.png'});
  }
  await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('[data-consent=reject]').click();const after=requests.length;
  await page.setViewportSize({width:390,height:950});await page.waitForTimeout(400);
  assert.equal(await page.locator('iframe[src]').count(),0);assert.equal(requests.length,after,'Resize must not reload Facebook after consent withdrawal');assert.deepEqual(errors,[]);
  console.log('PASS: satellite mode; direct portrait video; entire featured and first timeline previews at 320–1920px in HU/RO/EN; both themes; consent and resize remain gated.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
