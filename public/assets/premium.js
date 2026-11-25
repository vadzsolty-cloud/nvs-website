(()=>{
 // Keep anchor arrivals below the full header, even when the reading header is compact.
 const header=document.querySelector('.site-header');
 const smallViewport=matchMedia('(max-width:1200px), (max-height:700px)');
 let lastY=Math.max(0,scrollY),travel=0,direction=0,frame=0,anchorUntil=location.hash?performance.now()+1600:0,lastWidth=innerWidth;
 const expandHeader=()=>header?.classList.remove('is-compact');
 // Keep a selected section aligned while mobile chrome and delayed content settle.
 const sectionIds=new Set(['services','about','references','contact']);
 let fragment=null,settleTimer=0,expiryTimer=0,fragmentObserver=null;
 const cancelFragment=()=>{fragment=null;clearTimeout(settleTimer);clearTimeout(expiryTimer);fragmentObserver?.disconnect();anchorUntil=0;};
 const sectionStart=section=>section.id==='about'&&matchMedia('(max-width:700px)').matches?section.querySelector('.workshop-intro > div:not(.about-photo) > .eyebrow'):section.firstElementChild;
 const sectionTop=section=>Math.max(0,scrollY+sectionStart(section).getBoundingClientRect().top-parseFloat(header.style.getPropertyValue('--header-full-height'))-24);
 const settleFragment=()=>{
  clearTimeout(settleTimer);
  settleTimer=setTimeout(()=>{if(fragment&&Math.abs(scrollY-sectionTop(fragment))>1)scrollTo({top:sectionTop(fragment),behavior:'instant'});},140);
 };
 const jumpToSection=(section,behavior='smooth')=>{
  cancelFragment();expandHeader();fragment=section;anchorUntil=performance.now()+4100;
  fragmentObserver=new ResizeObserver(settleFragment);fragmentObserver.observe(document.body);
  expiryTimer=setTimeout(cancelFragment,4000);
  // Let the modal close and the full header reserve its space before measuring.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(fragment!==section)return;
   scrollTo({top:sectionTop(section),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':behavior});
   settleFragment();
  }));
 };

 const measureHeader=()=>{
  if(!header)return;
  const compact=header.classList.contains('is-compact');
  header.classList.remove('scroll-header','is-compact');
  const height=header.getBoundingClientRect().height;
  header.style.setProperty('--header-full-height',height+'px');
  document.documentElement.style.setProperty('--anchor-offset',Math.ceil(height+24)+'px');
  header.classList.toggle('scroll-header',smallViewport.matches);
  header.classList.toggle('is-compact',compact&&smallViewport.matches);
  lastY=Math.max(0,scrollY);travel=0;direction=0;
 };
 if(header){
  smallViewport.addEventListener('change',()=>{expandHeader();measureHeader();});
  addEventListener('resize',()=>{if(innerWidth!==lastWidth){lastWidth=innerWidth;measureHeader();}},{passive:true});
  addEventListener('scroll',()=>{
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight)),delta=y-lastY;
    lastY=y;
    if(fragment)settleFragment();
    if(!smallViewport.matches||document.body.classList.contains('menu-open')||performance.now()<anchorUntil){travel=0;direction=0;return;}
    if(y<24){expandHeader();travel=0;return;}
    if(Math.abs(delta)<1)return;
    const nextDirection=Math.sign(delta);
    travel=nextDirection===direction?travel+Math.abs(delta):Math.abs(delta);direction=nextDirection;
    if(direction>0&&travel>=28&&y>parseFloat(header.style.getPropertyValue('--header-full-height'))+48){
     // Do not hide a control while it is being used from the keyboard.
     if(!header.querySelector(':focus-visible'))header.classList.add('is-compact');
    }else if(direction<0&&travel>=16)expandHeader();
   });
  },{passive:true});
  const followFragment=()=>{const id=location.hash.slice(1);if(sectionIds.has(id)){const section=document.getElementById(id);if(section)jumpToSection(section,'instant');}};
  addEventListener('hashchange',followFragment);
  addEventListener('pageshow',event=>{if(!event.persisted)followFragment();});
  window.visualViewport?.addEventListener('resize',()=>{if(fragment)settleFragment();});
  // A visitor's gesture takes precedence over an in-progress anchor animation.
  for(const event of ['wheel','touchmove'])addEventListener(event,cancelFragment,{passive:true});
  addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))cancelFragment();});
  header.addEventListener('focusin',()=>{if(header.querySelector(':focus-visible'))expandHeader();});
  document.addEventListener('click',event=>{
   const link=event.target.closest('a[href]');if(!link)return;
   const destination=new URL(link.href,location.href);
   const id=destination.hash.slice(1),section=document.getElementById(id);
   if(destination.origin===location.origin&&destination.pathname===location.pathname&&sectionIds.has(id)&&section&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){
    event.preventDefault();
    if(location.hash!==destination.hash)history.pushState(null,'',destination.href);
    jumpToSection(section);
   }
  },true);
 }
 const menu=document.getElementById('site-menu'),toggle=document.querySelector('.menu-toggle');
 if(menu&&toggle&&typeof menu.showModal==='function'){
  document.documentElement.classList.add('js-ready');
  toggle.hidden=false;
  const close=()=>{if(menu.open)menu.close();};
  toggle.addEventListener('click',()=>{cancelFragment();expandHeader();menu.showModal();toggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');menu.querySelector('.menu-close').focus();});
  menu.querySelector('.menu-close').addEventListener('click',close);
  menu.addEventListener('click',e=>{if(e.target===menu||e.target.closest('a'))close();});
  // Restore keyboard focus without cancelling the selected anchor's scrolling.
  menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');toggle.focus({preventScroll:true});});
 }
 // Measure only after progressive enhancement has revealed the menu and hidden fallback navigation.
 measureHeader();
 const page=document.querySelector('[data-download-page]');if(!page)return;
 const status=page.querySelector('[data-download-status]'),link=page.querySelector('[data-apk-link]');
 async function latest(){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch('https://api.github.com/repos/vadzsolty-cloud/nvs-app-letoltes/releases?per_page=10',{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:controller.signal});
   if(!response.ok)throw Error('RELEASES_UNAVAILABLE');
   const releases=await response.json();if(!Array.isArray(releases))throw Error('INVALID_RELEASES');
   const candidates=[];
   for(const release of releases){
    const match=/^apk-v(\d+\.\d+\.\d+)-run(\d+)$/.exec(release.tag_name||'');
    if(!match||release.draft||release.prerelease)continue;
    const name='NightVisionService-v'+match[1]+'.apk',asset=(release.assets||[]).find(a=>a.name===name);
    if(!asset)continue;
    let url;try{url=new URL(asset.browser_download_url);}catch{continue;}
    const expected='/vadzsolty-cloud/nvs-app-letoltes/releases/download/'+release.tag_name+'/'+name;
    if(url.origin!=='https://github.com'||url.pathname!==expected||url.username||url.password||url.search||url.hash)continue;
    candidates.push({version:match[1],parts:match[1].split('.').map(Number),run:Number(match[2]),url:url.href});
   }
   candidates.sort((a,b)=>b.parts[0]-a.parts[0]||b.parts[1]-a.parts[1]||b.parts[2]-a.parts[2]||b.run-a.run);
   const best=candidates[0];if(!best)throw Error('NO_APK');
   link.href=best.url;link.querySelector('span').textContent='NVS '+best.version+' · APK';
   status.textContent=status.dataset.starting+' NVS '+best.version;
   // This page is reached by an explicit Android download link. One navigation
   // starts the binary download; phone/browser installation prompts still apply.
   window.location.assign(best.url);
  }catch{status.textContent=status.dataset.error;}
  finally{clearTimeout(timer);}
 }
 latest();
})();
