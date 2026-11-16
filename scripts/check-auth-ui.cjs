const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
(async()=>{
 const {nativeCopy}=await import('../src/native-booking.mjs');
 const {createPreviewServer}=await import('./preview-server.mjs');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',OUTPUT_DIR:'artifacts/auth-pages',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false'}});
 const server=createPreviewServer({output:'artifacts/auth-pages',basePath:'/nvs-website'});await new Promise(r=>server.listen(4184,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.PW_EXECUTABLE?{executablePath:process.env.PW_EXECUTABLE}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  let authError=null,carsError='EMAIL_NOT_VERIFIED',verificationError=null,authCalls=0,mailCalls=0,bookingCalls=0,networkError=false,noCars=false,activeLang='hu';
  const authHosts=['identitytoolkit.googleapis.com','europe-west1-night-vision-service.cloudfunctions.net'];
  await context.route('**/*',async route=>{
   const req=route.request(),url=new URL(req.url());
   if(url.origin==='http://127.0.0.1:4184')return route.continue();
   if(!authHosts.includes(url.hostname))return route.abort();
   if(url.hostname==='identitytoolkit.googleapis.com'){
    const body=req.postDataJSON();assert.equal(req.headers()['x-firebase-locale'],activeLang);
    if(url.pathname.endsWith(':sendOobCode')){
     mailCalls++;assert.deepEqual(body,{requestType:'VERIFY_EMAIL',idToken:'synthetic-token'});
     return route.fulfill({status:verificationError?400:200,json:verificationError?{error:{message:verificationError}}:{email:'fixture@example.invalid'}});
    }
    assert.ok(url.pathname.endsWith(':signInWithPassword'));authCalls++;
    assert.deepEqual(body,{email:'fixture@example.invalid',password:'synthetic-only',returnSecureToken:true});
    if(networkError)return route.abort();
    return route.fulfill({status:authError?400:200,json:authError?{error:{message:authError}}:{idToken:'synthetic-token'}});
   }
   if(url.pathname.endsWith('/health'))return route.fulfill({json:{bookingEnabled:true,mailConfigured:true}});
   assert.equal(req.headers().authorization,'Bearer synthetic-token');
   if(url.pathname.endsWith('/cars'))return route.fulfill({status:carsError?403:200,json:carsError?{error:carsError}:noCars?[]:[{id:'fixture-car',plate:'FIXTURE',linked:true}]});
   bookingCalls++;throw Error('Unexpected booking write in auth regression test');
  });
  const page=await context.newPage();
  const login=async()=>{await page.locator('#native-email').fill('fixture@example.invalid');await page.locator('#native-password').fill('synthetic-only');await page.locator('#native-login button[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#native-login button[type=submit]').disabled);};
  for(const lang of ['hu','ro','en']){
   const t=nativeCopy[lang];activeLang=lang;authError=null;carsError='EMAIL_NOT_VERIFIED';verificationError=null;
   await page.goto('http://127.0.0.1:4184/nvs-website/'+lang+'/');
   if(await page.locator('#privacy-preferences').isVisible())await page.locator('[data-consent=reject]').click();
   assert.equal(await page.locator('#native-verification').isVisible(),false);
   const pass=page.locator('#native-password'),show=page.locator('#native-password-show');
   await pass.fill('synthetic-only');await show.scrollIntoViewIfNeeded();
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    await show.dispatchEvent('pointerdown',{button:0,pointerType:'touch',isPrimary:true});assert.equal(await pass.getAttribute('type'),'text');
    assert.equal(await show.getAttribute('aria-pressed'),'true');
    await show.dispatchEvent('pointerup',{button:0,pointerType:'touch'});assert.equal(await pass.getAttribute('type'),'password');
    assert.equal(await show.getAttribute('aria-pressed'),'false');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    if(lang==='hu')await page.screenshot({path:'artifacts/auth-hu-'+theme+'.png'});
   }
   for(const event of ['pointerleave','pointercancel','lostpointercapture','blur']){await show.dispatchEvent('pointerdown',{button:0});await show.dispatchEvent(event);assert.equal(await pass.getAttribute('type'),'password');}
   const box=await show.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();assert.equal(await pass.getAttribute('type'),'text');await page.mouse.move(box.x-10,box.y);assert.equal(await pass.getAttribute('type'),'password');await page.mouse.up();
   await show.focus();
   const callsBefore=authCalls;
   for(const key of ['Space','Enter']){await page.keyboard.down(key);assert.equal(await pass.getAttribute('type'),'text');await page.keyboard.up(key);assert.equal(await pass.getAttribute('type'),'password');}
   assert.equal(authCalls,callsBefore,'Reveal button must not submit login');
   await show.dispatchEvent('pointerdown',{button:0});await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await pass.getAttribute('type'),'password');
   await login();assert.equal(await page.locator('#native-status').innerText(),t.emailUnverified);
   assert.equal(await page.locator('#native-verification').isVisible(),true);assert.equal(await page.locator('#native-account').isVisible(),false);assert.equal(await pass.inputValue(),'');
   const beforeMail=mailCalls;
   await page.locator('#native-verify-email').click();await page.waitForFunction(()=>!document.querySelector('#native-verify-email').disabled);
   assert.equal(await page.locator('#native-status').innerText(),t.verifySent);assert.equal(mailCalls,beforeMail+1);
   await page.locator('#native-verify-email').click();assert.equal(await page.locator('#native-status').innerText(),t.verifyWait);assert.equal(mailCalls,beforeMail+1);
   await page.locator('#native-email').fill('changed@example.invalid');assert.equal(await page.locator('#native-verification').isVisible(),false);
   for(const code of ['INVALID_LOGIN_CREDENTIALS','INVALID_PASSWORD','EMAIL_NOT_FOUND','USER_DISABLED','TOO_MANY_ATTEMPTS_TRY_LATER','OPERATION_NOT_ALLOWED']){
    authError=code;await login();const expected=['INVALID_LOGIN_CREDENTIALS','INVALID_PASSWORD','EMAIL_NOT_FOUND'].includes(code)?t.authInvalid:code==='USER_DISABLED'?t.authDisabled:code==='OPERATION_NOT_ALLOWED'?t.authConfig:t.authThrottled;
    assert.equal(await page.locator('#native-status').innerText(),expected);assert.equal(await page.locator('#native-verification').isVisible(),false);
   }
   authError=null;networkError=true;await login();assert.equal(await page.locator('#native-status').innerText(),t.authNetwork);networkError=false;
   carsError='SERVICE_UNAVAILABLE';await login();assert.equal(await page.locator('#native-status').innerText(),t.carsError);
   carsError=null;noCars=true;await login();assert.equal(await page.locator('#native-status').innerText(),t.noCars);assert.equal(await page.locator('#native-account').isVisible(),false);
   noCars=false;await login();assert.equal(await page.locator('#native-account').isVisible(),true);assert.equal(await pass.inputValue(),'');
   assert.equal(await page.evaluate(()=>Object.values(localStorage).some(v=>/synthetic-token|synthetic-only/.test(v))||Object.values(sessionStorage).some(v=>/synthetic-token|synthetic-only/.test(v))),false);
   await page.locator('#native-logout').click();assert.equal(await page.locator('#native-account').isVisible(),false);
   await page.screenshot({path:'artifacts/auth-'+lang+'-mobile.png'});
  }
  // A rejected verification request must not display a successful-send message.
  await page.goto('http://127.0.0.1:4184/nvs-website/en/');carsError='EMAIL_NOT_VERIFIED';verificationError='TOO_MANY_ATTEMPTS_TRY_LATER';
  await login();await page.locator('#native-verify-email').click();await page.waitForFunction(()=>!document.querySelector('#native-verify-email').disabled);assert.equal(await page.locator('#native-status').innerText(),nativeCopy.en.authThrottled);
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'artifacts/auth-en-desktop.png'});
  assert.equal(bookingCalls,0);console.log('PASS: HU/RO/EN auth errors, unverified account, explicit verification email + cooldown, no credential storage; hold-to-show pointer/touch/keyboard/cancel/blur, light/dark mobile layout, Pages subpath. Auth/mail/booking traffic intercepted; no live writes or emails.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
