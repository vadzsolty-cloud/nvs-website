// This module is never loaded by the public demo. It cannot connect to production.
if(!['localhost','127.0.0.1'].includes(location.hostname)||location.protocol!=='http:')throw new Error('LOCAL_EMULATOR_ONLY');
const lang=document.documentElement.lang;
const all=await (await fetch(new URL('lab-copy.json',import.meta.url))).json(),t=all[lang];
const api='http://127.0.0.1:5001/demo-nvs-website/europe-west1/websiteApi';
const auth='http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/';
const $=s=>document.querySelector(s),value=id=>$('#lab-'+id).value.trim();
let token=null,busy=false,lastPayload='',key=null;
const announce=message=>{$('#lab-status').textContent=message;$('#lab-status').focus();};
async function json(url,options){const r=await fetch(url,options),body=await r.json();if(!r.ok)throw new Error(typeof body.error==='string'?body.error:'AUTH_FAILED');return body;}
async function action(fn){if(busy)return;busy=true;for(const b of document.querySelectorAll('button'))b.disabled=true;try{await fn();}catch(e){announce(t.error[e.message]||t.failed);}finally{busy=false;for(const b of document.querySelectorAll('button'))b.disabled=false;}}
const authCall=(route,data)=>json(auth+route+'?key=emulator-only',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
const call=(route,data)=>{if(!token)throw new Error('UNAUTHENTICATED');return json(api+route,{method:data?'POST':'GET',headers:{Authorization:'Bearer '+token,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});};
async function refresh(){
 const cars=await call('/cars'),requests=await call('/requests');
 const select=$('#lab-car');select.replaceChildren();
 for(const car of cars){const o=document.createElement('option');o.value=car.id;o.textContent=[car.plate,car.make,car.model,car.linked?'':t.unlinked].filter(Boolean).join(' · ');o.disabled=!car.linked;select.append(o);}
 if(!cars.length){const o=document.createElement('option');o.value='';o.textContent=t.empty;select.append(o);}
 $('#lab-requests').replaceChildren();for(const req of requests){const li=document.createElement('li');li.textContent=`${req.date} ${req.time} · ${req.status}`;$('#lab-requests').append(li);}
}
function session(result){token=result.idToken;$('#lab-auth').hidden=true;$('#lab-session').hidden=false;$('#lab-password').value='';}
$('#lab-auth').addEventListener('submit',e=>{e.preventDefault();action(async()=>{session(await authCall('accounts:signInWithPassword',{email:value('email'),password:$('#lab-password').value,returnSecureToken:true}));announce(t.signed);await refresh();});});
$('#lab-signup').addEventListener('click',()=>action(async()=>{
 if(!$('#lab-notice').checked||!$('#lab-auth').reportValidity()){announce(t.notice);return;}
 session(await authCall('accounts:signUp',{email:value('email'),password:$('#lab-password').value,returnSecureToken:true}));
 await authCall('accounts:sendOobCode',{requestType:'VERIFY_EMAIL',idToken:token});announce(t.registered);
}));
$('#lab-verify').addEventListener('click',()=>action(async()=>{await authCall('accounts:sendOobCode',{requestType:'VERIFY_EMAIL',idToken:token});announce(t.sent);}));
$('#lab-refresh').addEventListener('click',()=>action(refresh));
$('#lab-logout').addEventListener('click',()=>{token=null;key=null;lastPayload='';$('#lab-session').hidden=true;$('#lab-auth').hidden=false;$('#lab-auth').reset();$('#lab-profile').reset();$('#lab-request').reset();$('#lab-requests').replaceChildren();announce('');});
$('#lab-profile').addEventListener('submit',e=>{e.preventDefault();action(async()=>{await call('/register-profile',{name:value('name'),phone:value('phone'),plate:value('plate'),make:value('make'),model:value('model'),lang,acceptNotice:$('#lab-notice').checked,marketing:$('#lab-marketing').checked});await refresh();announce(t.profileSaved);});});
$('#lab-request').addEventListener('submit',e=>{e.preventDefault();action(async()=>{
 const payload={carId:value('car'),date:value('date'),time:value('time'),serviceId:value('service'),note:value('note'),lang};
 const encoded=JSON.stringify(payload);if(encoded!==lastPayload){key=crypto.randomUUID();lastPayload=encoded;}
 const result=await call('/request',{...payload,idempotencyKey:key});await refresh();announce(result.status==='pending'?t.pending:t.failed);
});});
