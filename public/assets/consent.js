(()=>{
 const panel=document.querySelector('#privacy-preferences');if(!panel)return;
 const key='nvs-consent-v1',ttl=180*86400000,version=1;
 const fields={maps:panel.querySelector('#consent-maps'),facebook:panel.querySelector('#consent-facebook')};
 let choice={maps:false,facebook:false},saved=false,lastOpener=null;
 try{const data=JSON.parse(localStorage.getItem(key));if(data?.version===version&&Number.isFinite(data.at)&&Date.now()-data.at>=0&&Date.now()-data.at<ttl&&typeof data.maps==='boolean'&&typeof data.facebook==='boolean'){choice=data;saved=true;}}catch{}
 function apply(){
  for(const frame of document.querySelectorAll('iframe[data-consent-category]')){
   const allowed=choice[frame.dataset.consentCategory]===true;
   if(allowed&&!frame.hasAttribute('src'))frame.src=frame.dataset.embedSrc;
   if(!allowed&&frame.hasAttribute('src'))frame.removeAttribute('src');
   frame.hidden=!allowed;
   const placeholder=frame.previousElementSibling;if(placeholder?.classList.contains('embed-permission'))placeholder.hidden=allowed;
  }
  fields.maps.checked=choice.maps;fields.facebook.checked=choice.facebook;
  document.dispatchEvent(new Event('nvs-consent-change'));
 }
 function save(next){choice={version,at:Date.now(),maps:!!next.maps,facebook:!!next.facebook};try{localStorage.setItem(key,JSON.stringify(choice));}catch{}apply();panel.hidden=true;lastOpener?.focus();}
 panel.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.consent;save(action==='accept'?{maps:true,facebook:true}:action==='reject'?{maps:false,facebook:false}:{maps:fields.maps.checked,facebook:fields.facebook.checked});}));
 document.querySelectorAll('[data-privacy-settings]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();lastOpener=button;panel.hidden=false;panel.querySelector('button').focus();}));
 panel.hidden=saved;apply();
})();
