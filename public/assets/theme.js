(()=>{
 const root=document.documentElement,key='nvs-website-theme-mode',modes=['system','light','dark'];
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 let mode='system',button=null;
 // Leave the old generic key untouched: other GitHub Pages apps share this origin.
 try{const saved=localStorage.getItem(key);if(modes.includes(saved))mode=saved;}catch{}
 const label=value=>button?.dataset[value]||value;
 const syncButton=()=>{
  if(!button)return;
  const actual=root.dataset.theme,next=modes[(modes.indexOf(mode)+1)%modes.length];
  button.dataset.mode=mode;
  button.textContent=(mode==='system'?'◐':mode==='light'?'☀':'☾')+' '+label(mode);
  const description=label('label')+': '+label(mode)+(mode==='system'?' ('+label(actual)+')':'')+'. '+label('next')+': '+label(next)+'.';
  button.setAttribute('aria-label',description);button.title=description;
 };
 const apply=()=>{
  const actual=mode==='system'?(system.matches?'dark':'light'):mode;
  root.dataset.theme=actual;root.dataset.themeMode=mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',actual==='light'?'#f5f7f3':'#0b0e0e');
  syncButton();
 };
 apply();
 const changed=()=>{if(mode==='system')apply();};
 if(system.addEventListener)system.addEventListener('change',changed);else if(system.addListener)system.addListener(changed);
 document.addEventListener('DOMContentLoaded',()=>{
  button=document.querySelector('.theme-toggle');if(!button)return;
  syncButton();
  button.addEventListener('click',()=>{
   mode=modes[(modes.indexOf(mode)+1)%modes.length];
   try{localStorage.setItem(key,mode);}catch{}
   apply();
  });
 });
})();
