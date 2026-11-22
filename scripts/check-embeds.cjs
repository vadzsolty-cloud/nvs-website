const {chromium}=require('playwright'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const {createPreviewServer}=await import('./preview-server.mjs');
 const {rankedFacebookPosts}=await import('../src/facebook-ranking.mjs');
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
   assert.equal(await page.locator('.fb-card').count(),9);assert.equal(await page.locator('iframe').count(),0);
   const ranks=await page.locator('[data-ranking-views]').evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.rankingViews)));
   assert.deepEqual(ranks,rankedFacebookPosts.map(p=>p.views));assert.equal(ranks.length,10);assert.deepEqual(ranks,[...ranks].sort((a,b)=>b-a));
   assert.equal(await page.locator('.facebook-featured-poster').getAttribute('href'),rankedFacebookPosts[0].url);
   assert.equal(await page.locator('.facebook-visit-link').getAttribute('href'),'https://www.facebook.com/61572089218581');assert.equal(await page.locator('.facebook-visit-link').getAttribute('target'),'_blank');
   for(const theme of ['light','dark']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.equal(await page.locator('.fb-cover img').first().evaluate(e=>getComputedStyle(e).objectFit),'contain');}
   if(lang==='hu'&&[390,1280].includes(width))await page.locator('.facebook-visit').screenshot({path:'artifacts/social-visit-'+width+'.png'});
  }
  const social=page.locator('.desktop-nav .social-media-link');assert.equal(await social.locator('svg').evaluate(e=>getComputedStyle(e).color),'rgb(162, 255, 38)');
  await social.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.desktop-nav .social-media-link svg')).color==='rgb(24, 119, 242)');
  assert.equal(vendors.some(u=>new URL(u).hostname.includes('facebook')),false,'Static social posts never load Facebook before opening a link');
  await page.locator('.legal-footer [data-privacy-settings]').click();await page.locator('[data-consent=reject]').click();assert.equal(await page.locator('iframe[src]').count(),0);assert.deepEqual(errors,[]);
  console.log('PASS: ranked ten public video posts, source URLs, Page CTA, neon green and hover blue, consent-safe static previews; HU/RO/EN 320–1920px, both themes.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
