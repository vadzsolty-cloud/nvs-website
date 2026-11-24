(()=>{
 const toolbar=document.querySelector('.fb-playback-controls');
 if(!toolbar||!('IntersectionObserver' in window))return;
 const t=JSON.parse(toolbar.dataset.fbCopy),toggle=toolbar.querySelector('[data-fb-toggle]'),status=toolbar.querySelector('[role=status]');
 const items=[...document.querySelectorAll('[data-fb-preview]')],visible=new Set(),failed=new Set();
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),saveData=navigator.connection?.saveData===true;
 let enabled=!motion.matches&&!saveData,active=null,cursor=-1,turn=0,sdkPromise=null,sdkSubscribed=false,advanceTimer,readyTimer,permissionOpener=null;
 const permitted=()=>document.querySelector('#consent-facebook')?.checked===true;
 const runnable=()=>enabled&&permitted()&&!document.hidden;
 const label=()=>{toggle.textContent=!permitted()?t.enable:enabled?t.pause:t.play;toggle.setAttribute('aria-pressed',String(permitted()&&enabled));};
 function stop(){
  clearTimeout(advanceTimer);clearTimeout(readyTimer);turn++;
  const old=active;active=null;
  if(old){try{old.player?.pause();}catch{}old.stage.remove();old.item.removeAttribute('data-fb-playing');old.item.querySelector('.fb-preview-play').setAttribute('aria-label',t.one+' — '+old.title);}
 }
 function fail(entry){
  if(active!==entry)return;
  failed.add(entry.item);stop();status.textContent=t.error;
  schedule(true);
 }
 function advance(entry){if(active!==entry)return;stop();schedule(true);}
 function ready(message){
  const entry=active;if(!entry||message.type!=='video'||message.id!==entry.id)return;
  clearTimeout(readyTimer);entry.player=message.instance;
  try{
   entry.player.subscribe('startedPlaying',()=>{
    if(active!==entry)return;
    entry.stage.classList.add('is-playing');entry.item.dataset.fbPlaying='true';
    entry.item.querySelector('.fb-preview-play').setAttribute('aria-label',t.stop+' — '+entry.title);
    status.textContent='';clearTimeout(advanceTimer);if(!entry.manual)advanceTimer=setTimeout(()=>advance(entry),15000);
   });
   entry.player.subscribe('paused',()=>{
    if(active!==entry||!entry.stage.classList.contains('is-playing'))return;
    clearTimeout(advanceTimer);enabled=false;label();
   });
   entry.player.subscribe('finishedPlaying',()=>advance(entry));
   entry.player.subscribe('error',()=>fail(entry));
   entry.player.mute();if(entry.start>0)entry.player.seek(entry.start);entry.player.play();
  }catch{fail(entry);}
 }
 function sdk(){
  if(sdkPromise)return sdkPromise;
  sdkPromise=new Promise((resolve,reject)=>{
   let timeout;
   const complete=()=>{
    if(!window.FB?.XFBML||!window.FB?.Event)return;
    clearTimeout(timeout);
    if(!sdkSubscribed){window.FB.Event.subscribe('xfbml.ready',ready);sdkSubscribed=true;}
    resolve(window.FB);
   };
   if(window.FB?.XFBML){complete();return;}
   window.fbAsyncInit=complete;
   let root=document.querySelector('#fb-root');if(!root){root=document.createElement('div');root.id='fb-root';root.hidden=true;document.body.append(root);}
   const script=document.createElement('script');script.id='nvs-facebook-sdk';script.async=true;
   script.src='https://connect.facebook.net/'+({hu:'hu_HU',ro:'ro_RO',en:'en_US'}[document.documentElement.lang]||'en_US')+'/sdk.js#xfbml=0&version=v24.0';
   script.onerror=()=>{clearTimeout(timeout);script.remove();sdkPromise=null;reject(new Error('Facebook SDK unavailable'));};
   timeout=setTimeout(()=>{script.remove();sdkPromise=null;reject(new Error('Facebook SDK timeout'));},12000);
   document.head.append(script);
  });return sdkPromise;
 }
 async function start(item,{manual=false}={}){
  stop();if(!runnable())return;
  const title=item.querySelector('.fb-card>strong').textContent,id='nvs-preview-'+items.indexOf(item)+'-'+turn;
  const stage=document.createElement('div');stage.className='fb-video-overlay';
  const plugin=document.createElement('div');plugin.id=id;plugin.className='fb-video';
  plugin.setAttribute('data-href',item.dataset.fbPreview);plugin.setAttribute('data-width',String(Math.max(220,Math.floor(item.querySelector('.fb-cover').getBoundingClientRect().width))));
  plugin.setAttribute('data-autoplay','false');plugin.setAttribute('data-show-text','false');plugin.setAttribute('data-allowfullscreen','true');
  stage.append(plugin);item.append(stage);
  const entry={item,stage,plugin,id,title,start:Number(item.dataset.fbStart)||0,manual,player:null};active=entry;cursor=items.indexOf(item);
  try{const api=await sdk();if(active!==entry||!runnable())return;readyTimer=setTimeout(()=>fail(entry),15000);api.XFBML.parse(stage);}
  catch{if(active===entry){stop();enabled=false;status.textContent=t.error;label();}}
 }
 function schedule(next=false){
  if(!runnable()){stop();return;}
  if(active&&visible.has(active.item)&&!next)return;
  if(active)stop();
  const available=items.filter(item=>visible.has(item)&&!failed.has(item));
  const item=available.find(item=>items.indexOf(item)>cursor)||available[0];
  if(item)start(item);else if(visible.size&&failed.size){enabled=false;label();}
 }
 function preferences(opener=toggle){permissionOpener={element:opener,x:window.scrollX,y:window.scrollY};enabled=true;document.querySelector('[data-privacy-settings]')?.click();status.textContent=t.permission;}
 toolbar.hidden=false;
 for(const item of items){
  const button=document.createElement('button');button.type='button';button.className='fb-preview-play';
  button.setAttribute('aria-label',t.one+' — '+item.querySelector('.fb-card>strong').textContent);
  button.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor"/></svg>';
  button.addEventListener('click',()=>{
   if(!permitted()){preferences(button);return;}
   if(active?.item===item){enabled=false;stop();label();return;}
   enabled=true;failed.delete(item);visible.add(item);start(item,{manual:true});label();
  });item.append(button);
 }
 toggle.addEventListener('click',()=>{
  if(!permitted()){preferences();return;}
  enabled=!enabled;failed.clear();status.textContent='';label();if(enabled&&active?.player){try{active.player.mute();active.player.play();}catch{stop();schedule();}}else schedule();
 });
 const header=document.querySelector('.site-header'),top=Math.ceil(header?.getBoundingClientRect().height||110);
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){const item=entry.target.closest('[data-fb-preview]');if(entry.isIntersecting&&entry.intersectionRatio>=.5)visible.add(item);else visible.delete(item);}
  schedule();
 },{threshold:[0,.5,1],rootMargin:'-'+top+'px 0px -24px 0px'});
 items.forEach(item=>observer.observe(item.querySelector('.fb-cover')));
 document.addEventListener('nvs-consent-change',()=>{
  if(permissionOpener){const opener=permissionOpener;permissionOpener=null;queueMicrotask(()=>{opener.element.focus({preventScroll:true});window.scrollTo({left:opener.x,top:opener.y,behavior:'instant'});});}
  if(!permitted()){stop();document.querySelector('#fb-root')?.replaceChildren();document.querySelector('#nvs-facebook-sdk')?.remove();status.textContent='';}
  label();schedule();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else schedule();});
 motion.addEventListener?.('change',()=>{if(motion.matches){enabled=false;stop();label();}});
 addEventListener('pagehide',stop);label();schedule();
})();
