const {chromium}=require('playwright'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');
 const {rankedFacebookPosts}=await import('../src/facebook-ranking.mjs');
 const {business}=await import('../src/business.mjs');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,OUTPUT_DIR:'artifacts/embed-pages',BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/embed-pages',basePath:'/nvs-website'});await new Promise(r=>server.listen(4191,'127.0.0.1',r));
 let browser;try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
  const page=await browser.newPage();await page.emulateMedia({reducedMotion:'reduce'});const vendors=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin==='http://127.0.0.1:4191')return r.continue();vendors.push(u.href);if(u.hostname==='maps.google.com')return r.fulfill({contentType:'text/html',body:'<!doctype html><p>Satellite map fixture</p>'});return r.abort();});
  await page.goto('http://127.0.0.1:4191/nvs-website/hu/');assert.equal(vendors.length,0);
  await page.locator('[data-consent=accept]').click();
  for(const lang of ['hu','ro','en'])for(const width of [320,390,768,1280,1920]){
   await page.setViewportSize({width,height:950});await page.goto('http://127.0.0.1:4191/nvs-website/'+lang+'/');
   const map=new URL(await page.locator('.map-loaded iframe').getAttribute('src'));assert.equal(map.searchParams.get('t'),'k');assert.equal(map.searchParams.get('z'),'18');
   assert.equal(await page.locator('.facebook-entry').count(),0);
   await page.goto('http://127.0.0.1:4191/nvs-website/'+lang+'/facebook/');
   assert.equal(await page.locator('.fb-card').count(),10);assert.equal(await page.locator('iframe').count(),0);
   const ranks=await page.locator('[data-ranking-views]').evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.rankingViews)));
   assert.deepEqual(ranks,rankedFacebookPosts.map(p=>p.views));assert.equal(ranks.length,10);assert.deepEqual(ranks,[...ranks].sort((a,b)=>b-a));
   assert.equal(await page.locator('.fb-card').first().getAttribute('href'),rankedFacebookPosts[0].url);
   for(const [kind,url] of [['page','https://www.facebook.com/61572089218581'],['group',business.facebookGroup]]){
    const link=page.locator('.social-page-heading .hero-social-'+kind);assert.equal(await link.getAttribute('href'),url);assert.equal(await link.getAttribute('target'),'_blank');
    await page.mouse.move(0,0);assert.equal(await link.evaluate(e=>getComputedStyle(e).color),'rgb(162, 255, 38)');
    await link.hover();await page.waitForFunction(k=>getComputedStyle(document.querySelector('.hero-social-'+k)).color==='rgb(24, 119, 242)',kind);
   }
   await page.mouse.move(0,0);
   const heading=await page.locator('.social-page-heading').evaluate(e=>{const title=e.querySelector('h1').getBoundingClientRect(),links=e.querySelector('.hero-social-links').getBoundingClientRect();return {titleRight:title.right,titleBottom:title.bottom,linksLeft:links.left,linksTop:links.top};});
   assert.ok(width>900?heading.linksLeft>=heading.titleRight:heading.linksTop>=heading.titleBottom,lang+' '+width+' social destinations placement');
   assert.equal(await page.locator('.facebook-featured').count(),0);
   assert.equal(await page.locator('a[href*="1726574845200133"]').count(),0);
   for(const theme of ['light','dark']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.equal(await page.locator('.fb-cover img').first().evaluate(e=>getComputedStyle(e).objectFit),'contain');
    const sizes=await page.locator('.fb-card').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height};}));
    assert.ok(sizes.every(r=>Math.abs(r.width-sizes[0].width)<1&&Math.abs(r.height-sizes[0].height)<1),lang+' '+width+' '+theme+' equal work cards '+JSON.stringify(sizes));}
   if(lang==='hu'&&[390,1280].includes(width))await page.locator('.social-page-heading').screenshot({path:'artifacts/social-visit-'+width+'.png'});
  }
  const social=page.locator('.header-social');assert.equal(await social.locator('svg').evaluate(e=>getComputedStyle(e).color),'rgb(162, 255, 38)');
  await social.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.header-social svg')).color==='rgb(24, 119, 242)');
  assert.equal(vendors.some(u=>new URL(u).hostname.includes('facebook')),false,'Static social posts never load Facebook before opening a link');
  await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('[data-consent=reject]').click();assert.equal(await page.locator('iframe[src]').count(),0);assert.deepEqual(errors,[]);
  console.log('PASS: ten ranked workshop projects in equal cards, source URLs, Page and Group links beside the heading, neon green and hover blue, consent-safe static previews; HU/RO/EN 320–1920px, both themes.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
