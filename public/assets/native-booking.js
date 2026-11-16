(()=>{
 const root=document.querySelector('.native-booking');if(!root)return;
 const base=new URL('./',document.currentScript.src),lang=root.dataset.lang;
 let token=null,verificationToken=null,key=null,digest=null,config=null,copy=null,busy=false,verifyAfter=0;
 const q=id=>document.getElementById('native-'+id),status=q('status'),password=q('password'),reveal=q('password-show');
 // Also support a cached page from before the dedicated sign-in button existed.
 const signIn=q('sign-in')||q('login').querySelector('button[type="submit"]');
 if(!signIn)return;signIn.type='button';
 const display=(message,code='')=>{status.textContent=message;status.dataset.errorCode=code;};
 function passwordVisibility(visible){
  const type=visible?'text':'password';
  if(password.type!==type){
   const start=password.selectionStart,end=password.selectionEnd,direction=password.selectionDirection;
   password.type=type;
   if(document.activeElement===password&&start!==null)password.setSelectionRange(start,end,direction);
  }
  reveal.setAttribute('aria-pressed',String(visible));
 }
 const hidePassword=()=>passwordVisibility(false);
 const showPassword=()=>{if(!reveal.disabled)passwordVisibility(true);};
 reveal.addEventListener('pointerdown',e=>{if(e.button===0){e.preventDefault();showPassword();}});
 for(const event of ['pointerup','pointercancel','pointerleave','lostpointercapture','blur'])reveal.addEventListener(event,hidePassword);
 window.addEventListener('pointerup',hidePassword);window.addEventListener('pointercancel',hidePassword);
 window.addEventListener('pointermove',e=>{if(password.type==='text'&&e.buttons){const r=reveal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)hidePassword();}});
 window.addEventListener('blur',hidePassword);window.addEventListener('pagehide',hidePassword);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hidePassword();});
 reveal.addEventListener('contextmenu',e=>e.preventDefault());
 reveal.addEventListener('keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();showPassword();}});
 reveal.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();hidePassword();}});
 window.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key))hidePassword();});
 function clearVerification(){verificationToken=null;q('verification').hidden=true;}
 for(const input of [q('email'),password])input.addEventListener('input',clearVerification);
 async function fetchTimed(url,options){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{return await fetch(url,{...options,signal:controller.signal});}finally{clearTimeout(timer);}
 }
 async function setup(){
  if(!config||!copy){
   const responses=await Promise.all(['booking-config.json','native-copy.json'].map(path=>fetchTimed(new URL(path,base),{cache:'no-store'})));
   if(responses.some(r=>!r.ok))throw Error('CONFIG_UNAVAILABLE');
   const [settings,texts]=await Promise.all(responses.map(r=>r.json()));
   if(!settings.apiKey||!settings.apiBase||!texts[lang])throw Error('CONFIG_UNAVAILABLE');
   config=settings;copy=texts[lang];
  }
 }
 async function api(path,body){
  const r=await fetchTimed(config.apiBase+path,{method:body?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const data=await r.json();if(!r.ok)throw Error(data.error||'SERVICE_UNAVAILABLE');return data;
 }
 async function auth(action,body){
  let r;try{r=await fetchTimed('https://identitytoolkit.googleapis.com/v1/accounts:'+action+'?key='+encodeURIComponent(config.apiKey),{method:'POST',headers:{'Content-Type':'application/json','X-Firebase-Locale':lang},body:JSON.stringify(body)});}catch{throw Error('AUTH_NETWORK');}
  const data=await r.json();if(!r.ok)throw Error(data.error?.message?.split(' : ')[0]||'AUTH_FAILED');return data;
 }
 function errorMessage(code,phase){
  if(['INVALID_LOGIN_CREDENTIALS','INVALID_PASSWORD','EMAIL_NOT_FOUND','INVALID_EMAIL'].includes(code))return copy.authInvalid;
  if(code==='USER_DISABLED')return copy.authDisabled;
  if(['TOO_MANY_ATTEMPTS_TRY_LATER','QUOTA_EXCEEDED','RESET_PASSWORD_EXCEED_LIMIT'].includes(code))return copy.authThrottled;
  if(['API_KEY_INVALID','INVALID_API_KEY','OPERATION_NOT_ALLOWED','PROJECT_NOT_FOUND','CONFIGURATION_NOT_FOUND','ADMIN_ONLY_OPERATION','CONFIG_UNAVAILABLE'].includes(code))return copy.authConfig;
  if(['UNAUTHENTICATED','TOKEN_EXPIRED','INVALID_ID_TOKEN','USER_NOT_FOUND'].includes(code))return copy.sessionExpired;
  if(code==='AUTH_NETWORK'||code==='NETWORK_REQUEST_FAILED')return copy.authNetwork;
  return phase==='cars'?copy.carsError:phase==='verify'?copy.verifyError:copy.authError;
 }
 function lock(value){busy=value;if(value)hidePassword();root.querySelectorAll('button').forEach(b=>{if(b!==reveal)b.disabled=value;});q('email').readOnly=value;password.readOnly=value;q('login').setAttribute('aria-busy',String(value));}
 // Password managers may submit a form immediately after filling it. Review first;
 // only a user activation of the dedicated button starts a website sign-in.
 q('login').addEventListener('submit',e=>e.preventDefault());
 signIn.addEventListener('click',async e=>{
  e.preventDefault();if(!e.isTrusted||busy||!q('login').reportValidity())return;
  lock(true);clearVerification();token=null;let phase='auth';
  try{
   await setup();display(copy.busy);
   try{const health=await api('/health');if(!health.bookingEnabled||!health.mailConfigured)throw Error('MAIL_NOT_CONFIGURED');}catch{display(copy.notReady,'SERVICE_UNAVAILABLE');return;}
   const data=await auth('signInWithPassword',{email:q('email').value.trim(),password:password.value,returnSecureToken:true});
   if(!data.idToken)throw Error('AUTH_FAILED');token=data.idToken;phase='cars';
   const [carList,profile]=await Promise.all([api('/cars'),api('/profile').catch(()=>({}))]);
   const cars=carList.filter(c=>c.linked);q('car').replaceChildren();
   for(const car of cars){const o=document.createElement('option');o.value=car.id;o.textContent=[car.plate,car.make,car.model].filter(Boolean).join(' · ');q('car').append(o);}
   if(!cars.length){token=null;display(copy.noCars,'NO_LINKED_CARS');return;}
   q('contact-name').value=typeof profile.name==='string'?profile.name:'';q('contact-phone').value=typeof profile.phone==='string'?profile.phone:'';
   password.value='';hidePassword();q('login').hidden=true;q('account').hidden=false;display('');q('car').focus();
  }catch(e){
   if(phase==='cars'&&e.message==='EMAIL_NOT_VERIFIED'){
    verificationToken=token;q('verification').hidden=false;display(copy.emailUnverified,'EMAIL_NOT_VERIFIED');
   }else{
    const fallback={hu:'A belépés nem érhető el. Próbáld újra később.',ro:'Autentificarea nu este disponibilă. Încearcă mai târziu.',en:'Sign-in is unavailable. Try again later.'};
    display(copy?errorMessage(e.message,phase):fallback[lang],phase==='cars'?'CARS_UNAVAILABLE':'AUTH_FAILED');
   }
   token=null;
  }finally{lock(false);}
 });
 q('verify-email').addEventListener('click',async()=>{
  if(busy||!verificationToken)return;
  if(Date.now()<verifyAfter){display(copy.verifyWait);return;}
  lock(true);display(copy.busy);verifyAfter=Date.now()+60000;
  try{await auth('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:verificationToken});display(copy.verifySent);}
  catch(e){display(errorMessage(e.message,'verify'),'VERIFICATION_FAILED');}
  finally{lock(false);}
 });
 q('logout').addEventListener('click',()=>{token=null;clearVerification();key=null;digest=null;hidePassword();q('login').reset();q('request').reset();updateService();q('car').replaceChildren();q('login').hidden=false;q('account').hidden=true;display('');});
 q('request').addEventListener('submit',async e=>{
  e.preventDefault();if(busy||!token)return;lock(true);display(copy.busy);
  try{const body={carId:q('car').value,contactName:q('contact-name').value,contactPhone:q('contact-phone').value,serviceId:q('service').value,date:q('date').value,time:q('time').value,note:q('note').value,lang,noticeVersion:'2026-11-16',acceptNotice:q('notice').checked};const d=JSON.stringify(body);if(d!==digest){key=crypto.randomUUID();digest=d;}body.idempotencyKey=key;await api('/request',body);display(copy.success);}
  catch(e){display(e.message==='MAIL_NOT_CONFIGURED'?copy.notReady:e.message==='UNAUTHENTICATED'?copy.sessionExpired:e.message==='CONTACT_REQUIRED'?copy.contactError:e.message==='SERVICE_DETAILS_REQUIRED'?copy.noteError:copy.error);}
  finally{lock(false);}
 });
 const noteLabel=q('note-label');
 const updateService=()=>{const other=q('service').value==='other';q('note').required=other;noteLabel.textContent=other?noteLabel.dataset.other:noteLabel.dataset.default;};
 q('service').addEventListener('change',updateService);updateService();
 const d=new Date();q('date').min=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
})();

