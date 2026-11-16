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
  let authError=null,carsError='EMAIL_NOT_VERIFIED',verificationError=null,authCalls=0,mailCalls=0,bookingCalls=0,networkError=false,noCars=false,activeLang='hu',holdHealth=false,healthReady=true,releaseHealth=null,onHealthHeld=()=>{};
  const authHosts=['identitytoolkit.googleapis.com','europe-west1-night-vision-service.cloudfunctions.net'];
  await context.route('**/*',async route=>{
   const req=route.request(),url=new URL(req.url());
   if(url.origin==='http://127.0.0.1:4184'){
    if(url.searchParams.has('legacy')){
     const response=await route.fetch();const html=await response.text();
     return route.fulfill({response,body:html.replace('<button id="native-sign-in" class="button" type="button">','<button class="button" type="submit">')});
    }
    return route.continue();
   }
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
   if(url.pathname.endsWith('/health')){
    if(holdHealth)await new Promise(resolve=>{releaseHealth=resolve;onHealthHeld();});
    return route.fulfill({status:healthReady?200:503,json:{bookingEnabled:healthReady,mailConfigured:healthReady}});
   }
   assert.equal(req.headers().authorization,'Bearer synthetic-token');
   if(url.pathname.endsWith('/cars'))return route.fulfill({status:carsError?403:200,json:carsError?{error:carsError}:noCars?[]:[{id:'fixture-car',plate:'FIXTURE',linked:true}]});
   bookingCalls++;throw Error('Unexpected booking write in auth regression test');
  });
  const page=await context.newPage();
  const login=async()=>{await page.locator('#native-email').fill('fixture@example.invalid');const field=page.locator('#native-password');await field.fill('');await field.tap();assert.equal(await field.isEditable(),true);await page.keyboard.type('synthetic-only');assert.equal(await field.inputValue(),'synthetic-only');await page.locator('#native-sign-in').click();await page.waitForFunction(()=>!document.querySelector('#native-sign-in').disabled);};
  for(const lang of ['hu','ro','en']){
   const t=nativeCopy[lang];activeLang=lang;authError=null;carsError='EMAIL_NOT_VERIFIED';verificationError=null;
   await page.goto('http://127.0.0.1:4184/nvs-website/'+lang+'/account/');
   assert.match(await page.locator('script[src*="native-booking-"]').getAttribute('src'),/^\/nvs-website\/assets\/native-booking-[a-f0-9]{12}\.js$/);
   if(await page.locator('#privacy-preferences').isVisible())await page.locator('[data-consent=reject]').click();
   assert.equal(await page.locator('#native-verification').isVisible(),false);
   const pass=page.locator('#native-password'),show=page.locator('#native-password-show');
   const beforeAutofill=authCalls;
   await page.evaluate(()=>{
    const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    for(const [id,value] of [['native-email','fixture@example.invalid'],['native-password','synthetic-only']]){
     const input=document.getElementById(id);set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
    }
    document.getElementById('native-login').requestSubmit();
   });
   assert.equal(await show.isEnabled(),true,'Implicit autofill submission must not disable password review');
   assert.equal(await pass.inputValue(),'synthetic-only','Autofill must remain available for review');
   await page.waitForTimeout(150);assert.equal(authCalls,beforeAutofill,'Autofill must not start authentication');
   await page.evaluate(()=>document.getElementById('native-sign-in').click());
   await pass.press('Enter');assert.equal(authCalls,beforeAutofill,'Only deliberate activation of the login button signs in');
   await show.dispatchEvent('pointerdown',{button:0,pointerType:'touch'});assert.equal(await pass.getAttribute('type'),'text');assert.equal(await pass.inputValue(),'synthetic-only');await show.dispatchEvent('pointerup',{button:0,pointerType:'touch'});
   await pass.fill('');
   assert.equal((await show.innerText()).trim(),'');assert.equal(await show.getAttribute('aria-label'),t.showPassword);
   assert.equal(await show.locator('svg').count(),1);
   await pass.tap();await page.keyboard.type('abc 123 !Á');assert.equal(await pass.inputValue(),'abc 123 !Á');
   await pass.evaluate(el=>el.setSelectionRange(4,4));
   const iconBox=await show.boundingBox(),fieldBox=await pass.boundingBox();
   assert.ok(iconBox.width===44&&iconBox.height===44);assert.ok(iconBox.x>=fieldBox.x&&iconBox.x+iconBox.width<=fieldBox.x+fieldBox.width);
   await page.mouse.move(iconBox.x+22,iconBox.y+22);await page.mouse.down();assert.equal(await pass.getAttribute('type'),'text');await page.mouse.up();
   assert.equal(await pass.evaluate(el=>document.activeElement===el),true);assert.equal(await pass.evaluate(el=>el.selectionStart),4);
   await page.keyboard.type('Z');assert.equal(await pass.inputValue(),'abc Z123 !Á');
   await pass.press('ControlOrMeta+A');await page.keyboard.insertText('synthetic-only');assert.equal(await pass.inputValue(),'synthetic-only');
   await pass.fill('synthetic-only');await show.scrollIntoViewIfNeeded();
   for(const theme of ['light','dark']){
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    await page.waitForTimeout(250); // Let the existing theme color transition finish.
    assert.equal(await show.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
    await show.dispatchEvent('pointerdown',{button:0,pointerType:'touch',isPrimary:true});assert.equal(await pass.getAttribute('type'),'text');
    assert.equal(await show.getAttribute('aria-pressed'),'true');
    await show.dispatchEvent('pointerup',{button:0,pointerType:'touch'});assert.equal(await pass.getAttribute('type'),'password');
    assert.equal(await show.getAttribute('aria-pressed'),'false');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    if(lang==='hu')await page.locator('.native-booking').screenshot({path:'artifacts/auth-hu-'+theme+'.png'});
   }
   for(const event of ['pointerleave','pointercancel','lostpointercapture','blur']){await show.dispatchEvent('pointerdown',{button:0});await show.dispatchEvent(event);assert.equal(await pass.getAttribute('type'),'password');}
   const box=await show.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();assert.equal(await pass.getAttribute('type'),'text');await page.mouse.move(box.x-10,box.y);assert.equal(await pass.getAttribute('type'),'password');await page.mouse.up();
   await show.focus();
   const callsBefore=authCalls;
   for(const key of ['Space','Enter']){await page.keyboard.down(key);assert.equal(await pass.getAttribute('type'),'text');await page.keyboard.up(key);assert.equal(await pass.getAttribute('type'),'password');}
   assert.equal(authCalls,callsBefore,'Reveal button must not submit login');
   await show.dispatchEvent('pointerdown',{button:0});await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await pass.getAttribute('type'),'password');
   await login();assert.equal(await page.locator('#native-status').innerText(),t.emailUnverified);
   assert.equal(await page.locator('#native-verification').isVisible(),true);assert.equal(await page.locator('#native-account').isVisible(),false);assert.equal(await pass.inputValue(),'synthetic-only');
   const beforeMail=mailCalls;
   await page.locator('#native-verify-email').click();await page.waitForFunction(()=>!document.querySelector('#native-verify-email').disabled);
   assert.equal(await page.locator('#native-status').innerText(),t.verifySent);assert.equal(mailCalls,beforeMail+1);
   await page.locator('#native-verify-email').click();assert.equal(await page.locator('#native-status').innerText(),t.verifyWait);assert.equal(mailCalls,beforeMail+1);
   await page.locator('#native-email').fill('changed@example.invalid');assert.equal(await page.locator('#native-verification').isVisible(),false);
   for(const code of ['INVALID_LOGIN_CREDENTIALS','INVALID_PASSWORD','EMAIL_NOT_FOUND','USER_DISABLED','TOO_MANY_ATTEMPTS_TRY_LATER','OPERATION_NOT_ALLOWED']){
    authError=code;await login();const expected=['INVALID_LOGIN_CREDENTIALS','INVALID_PASSWORD','EMAIL_NOT_FOUND'].includes(code)?t.authInvalid:code==='USER_DISABLED'?t.authDisabled:code==='OPERATION_NOT_ALLOWED'?t.authConfig:t.authThrottled;
    assert.equal(await page.locator('#native-status').innerText(),expected);assert.equal(await page.locator('#native-verification').isVisible(),false);
    assert.equal(await pass.inputValue(),'synthetic-only','Failed login must preserve the entered password');assert.equal(await show.isEnabled(),true);
    await show.dispatchEvent('pointerdown',{button:0,pointerType:'touch'});assert.equal(await pass.getAttribute('type'),'text');assert.equal(await pass.inputValue(),'synthetic-only');await show.dispatchEvent('pointerup',{button:0,pointerType:'touch'});
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
  await page.goto('http://127.0.0.1:4184/nvs-website/en/account/');carsError='EMAIL_NOT_VERIFIED';verificationError='TOO_MANY_ATTEMPTS_TRY_LATER';
  await login();await page.locator('#native-verify-email').click();await page.waitForFunction(()=>!document.querySelector('#native-verify-email').disabled);assert.equal(await page.locator('#native-status').innerText(),nativeCopy.en.authThrottled);
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'artifacts/auth-en-desktop.png'});
  // The explicit button remains accessible with the keyboard.
  authError='INVALID_LOGIN_CREDENTIALS';await page.locator('#native-sign-in').focus();const beforeKeyboard=authCalls;
  await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('#native-sign-in').disabled);
  assert.equal(authCalls,beforeKeyboard+1);assert.equal(await page.locator('#native-status').innerText(),nativeCopy.en.authInvalid);assert.equal(await page.locator('#native-password').inputValue(),'synthetic-only');authError=null;
  // A slow/unavailable backend must not prevent reviewing an autofilled password.
  await page.goto('http://127.0.0.1:4184/nvs-website/en/account/');holdHealth=true;healthReady=false;
  const beforeSlowAuth=authCalls,held=new Promise(resolve=>onHealthHeld=resolve);
  await page.locator('#native-email').fill('fixture@example.invalid');await page.locator('#native-password').fill('synthetic-only');await page.locator('#native-sign-in').click();await held;
  assert.equal(await page.locator('#native-password').isEditable(),false);assert.equal(await page.locator('#native-password-show').isEnabled(),true);
  await page.locator('#native-password-show').dispatchEvent('pointerdown',{button:0,pointerType:'touch'});assert.equal(await page.locator('#native-password').getAttribute('type'),'text');
  releaseHealth();await page.waitForFunction(()=>!document.querySelector('#native-sign-in').disabled);
  assert.equal(await page.locator('#native-status').innerText(),nativeCopy.en.notReady);assert.equal(await page.locator('#native-password').inputValue(),'synthetic-only');assert.equal(await page.locator('#native-password').getAttribute('type'),'text');assert.equal(await page.locator('#native-password').isEditable(),true);
  await page.locator('#native-password-show').dispatchEvent('pointerup',{button:0,pointerType:'touch'});assert.equal(await page.locator('#native-password').getAttribute('type'),'password');assert.equal(authCalls,beforeSlowAuth);
  holdHealth=false;healthReady=true;authError='INVALID_LOGIN_CREDENTIALS';activeLang='en';
  await page.goto('http://127.0.0.1:4184/nvs-website/en/account/?legacy=1');
  const legacyButton=page.locator('#native-login > button');assert.equal(await legacyButton.getAttribute('id'),null);assert.equal(await legacyButton.getAttribute('type'),'button');
  await page.locator('#native-email').fill('fixture@example.invalid');await page.locator('#native-password').fill('synthetic-only');await legacyButton.click();await page.waitForFunction(()=>!document.querySelector('#native-login > button').disabled);
  assert.equal(await page.locator('#native-status').innerText(),nativeCopy.en.authInvalid);assert.equal(await page.locator('#native-password').inputValue(),'synthetic-only');
  assert.equal(bookingCalls,0);console.log('PASS: HU/RO/EN autofill + implicit/programmatic submit blocked; explicit sign-in; password retained on errors; eye works during slow backend and after errors; successful sign-in clears password. Typing, paste, caret, hold/cancel/blur, themes and Pages subpath verified. All Auth/mail/booking traffic synthetic.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
