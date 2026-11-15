(()=>{
 const root=document.querySelector('.native-booking');if(!root)return;
 const base=new URL('./',document.currentScript.src),lang=root.dataset.lang;
 let token=null,key=null,digest=null,config=null,copy=null,busy=false;
 const q=id=>document.getElementById('native-'+id),status=q('status');
 const display=(message)=>{status.textContent=message;};
 async function setup(){if(!config){config=await (await fetch(new URL('booking-config.json',base))).json();copy=(await (await fetch(new URL('native-copy.json',base))).json())[lang];}return config;}
 async function api(path,body){const r=await fetch(config.apiBase+path,{method:body?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw Error(data.error||'FAILED');return data;}
 function lock(value){busy=value;root.querySelectorAll('button').forEach(b=>b.disabled=value);}
 q('login').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;lock(true);try{await setup();display(copy.busy);try{const health=await api('/health');if(!health.bookingEnabled||!health.mailConfigured)throw Error('MAIL_NOT_CONFIGURED');}catch{display(copy.notReady);return;}
  const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+encodeURIComponent(config.apiKey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:q('email').value.trim(),password:q('password').value,returnSecureToken:true})});q('password').value='';const data=await r.json();if(!r.ok)throw Error('AUTH');token=data.idToken;
  const cars=(await api('/cars')).filter(c=>c.linked);q('car').replaceChildren();for(const car of cars){const o=document.createElement('option');o.value=car.id;o.textContent=[car.plate,car.make,car.model].filter(Boolean).join(' · ');q('car').append(o);}if(!cars.length){token=null;display(copy.noCars);return;}
  q('login').hidden=true;q('account').hidden=false;display('');q('car').focus();
 }catch{token=null;display(copy?.authError||'NVS: sign-in unavailable');}finally{q('password').value='';lock(false);}});
 q('logout').addEventListener('click',()=>{token=null;key=null;digest=null;q('login').reset();q('request').reset();q('car').replaceChildren();q('login').hidden=false;q('account').hidden=true;display('');});
 q('request').addEventListener('submit',async e=>{e.preventDefault();if(busy||!token)return;lock(true);display(copy.busy);try{const body={carId:q('car').value,serviceId:q('service').value,date:q('date').value,time:q('time').value,note:q('note').value,lang,acceptNotice:q('notice').checked};const d=JSON.stringify(body);if(d!==digest){key=crypto.randomUUID();digest=d;}body.idempotencyKey=key;const result=await api('/request',body);display(copy.success+' ID: '+result.id);}catch(e){display(e.message==='MAIL_NOT_CONFIGURED'?copy.notReady:copy.error);}finally{lock(false);}});
 const d=new Date();q('date').min=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
})();
