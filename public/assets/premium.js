(()=>{
 const compactFooter=matchMedia('(max-width:700px)'),footerGroups=document.querySelectorAll('[data-footer-group]');
 const arrangeFooter=()=>footerGroups.forEach(group=>{group.open=!compactFooter.matches;});
 arrangeFooter();compactFooter.addEventListener('change',arrangeFooter);
 const menu=document.getElementById('site-menu'),toggle=document.querySelector('.menu-toggle');
 if(menu&&toggle&&typeof menu.showModal==='function'){
  document.documentElement.classList.add('js-ready');
  toggle.hidden=false;
  const close=()=>{if(menu.open)menu.close();};
  toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');menu.querySelector('.menu-close').focus();});
  menu.querySelector('.menu-close').addEventListener('click',close);
  menu.addEventListener('click',e=>{if(e.target===menu||e.target.closest('a'))close();});
  // Restore keyboard focus without cancelling the selected anchor's scrolling.
  menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');toggle.focus({preventScroll:true});});
 }
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
