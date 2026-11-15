const form=document.querySelector('#booking-form');
if(form){
 const date=document.querySelector('#date'),result=document.querySelector('#result');
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 date.min=today();
 date.addEventListener('input',()=>date.setCustomValidity(''));
 form.addEventListener('submit',event=>{
  event.preventDefault();date.min=today();
  if(date.value<date.min){date.setCustomValidity(document.body.dataset.invalidDate);date.reportValidity();return;}
  if(!form.reportValidity())return;
  const service=document.querySelector('#service');
  document.querySelector('#selection').textContent=`${service.selectedOptions[0].textContent} · ${date.value} · ${document.querySelector('#time').value}`;
  form.hidden=true;result.hidden=false;document.querySelector('.step').firstChild.textContent='02 / 02 ';result.focus();
 });
 document.querySelector('#reset').addEventListener('click',()=>{form.reset();form.hidden=false;result.hidden=true;document.querySelector('#selection').textContent='';document.querySelector('.step').firstChild.textContent='01 / 02 ';document.querySelector('#service').focus();});
}

// Zoomable photo gallery: native <dialog>, keyboard (←/→/Home/End/Esc), swipe, focus return. Links work without JS.
const box=document.querySelector('.lightbox');
const triggers=box?[...document.querySelectorAll('a[data-lightbox]')]:[];
if(box&&triggers.length&&typeof box.showModal==='function'){
 const img=box.querySelector('img'),caption=box.querySelector('.lightbox-caption'),count=box.querySelector('.lightbox-count');
 const prev=box.querySelector('.lightbox-prev'),next=box.querySelector('.lightbox-next');
 let current=0,opener=null,startX=null;
 const show=i=>{
  current=(i+triggers.length)%triggers.length;const a=triggers[current],source=a.querySelector('img');
  img.src=a.getAttribute('href');img.alt=source?source.alt:'';caption.textContent=a.dataset.caption||'';
  count.textContent=triggers.length>1?`${current+1} ${box.dataset.of} ${triggers.length}`:'';
  prev.hidden=next.hidden=triggers.length<2;
 };
 triggers.forEach((a,i)=>a.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.button!==0)return;
  event.preventDefault();opener=a;show(i);box.showModal();box.querySelector('.lightbox-close').focus();
 }));
 prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
 box.querySelector('.lightbox-close').addEventListener('click',()=>box.close());
 box.addEventListener('click',event=>{if(event.target===box)box.close();});
 box.addEventListener('close',()=>{img.removeAttribute('src');if(opener)opener.focus();});
 box.addEventListener('keydown',event=>{
  const k={ArrowLeft:-1,ArrowRight:1}[event.key];
  if(k){event.preventDefault();show(current+k);}
  else if(event.key==='Home'){event.preventDefault();show(0);}
  else if(event.key==='End'){event.preventDefault();show(triggers.length-1);}
 });
 box.addEventListener('touchstart',event=>{startX=event.touches.length===1?event.touches[0].clientX:null;},{passive:true});
 box.addEventListener('touchend',event=>{
  if(startX===null)return;const dx=event.changedTouches[0].clientX-startX;startX=null;
  if(Math.abs(dx)>50)show(current+(dx<0?1:-1));
 },{passive:true});
}

// Service slider: prev/next, dots, pause/play, autoplay (paused on hover, focus, hidden tab, reduced motion).
for(const slider of (document.querySelectorAll?document.querySelectorAll('.service-slider'):[])){
 const track=slider.querySelector('.slides'),slides=[...slider.querySelectorAll('.slide')],dots=[...slider.querySelectorAll('.slider-dot')];
 const toggle=slider.querySelector('.slider-toggle'),controls=slider.querySelector('.slider-controls');
 const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 let current=0,timer=null,stopped=reduce,hold=false;
 const mark=i=>{current=i;dots.forEach((d,k)=>k===i?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current'));};
 const go=i=>{const n=(i+slides.length)%slides.length;track.scrollTo({left:slides[n].offsetLeft-slides[0].offsetLeft,behavior:reduce?'auto':'smooth'});mark(n);};
 const tick=()=>{if(!hold&&!stopped&&!document.hidden)go(current+1);};
 const sync=()=>{toggle.setAttribute('aria-label',stopped?slider.dataset.play:slider.dataset.pause);toggle.firstElementChild.textContent=stopped?'▶':'❚❚';clearInterval(timer);timer=stopped?null:setInterval(tick,5500);};
 controls.hidden=false;
 slider.querySelector('.slider-prev').addEventListener('click',()=>go(current-1));
 slider.querySelector('.slider-next').addEventListener('click',()=>go(current+1));
 dots.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
 toggle.addEventListener('click',()=>{stopped=!stopped;sync();});
 slider.addEventListener('mouseenter',()=>{hold=true;});slider.addEventListener('mouseleave',()=>{hold=false;});
 slider.addEventListener('focusin',()=>{hold=true;});slider.addEventListener('focusout',()=>{hold=false;});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1));}});
 let settle=null;track.addEventListener('scroll',()=>{clearTimeout(settle);settle=setTimeout(()=>{const w=track.clientWidth||1;mark(Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/w))));},120);},{passive:true});
 sync();
}

// Click-to-load map: nothing is requested from Google until the visitor asks for the map.
for(const panel of (document.querySelectorAll?document.querySelectorAll('.map-consent'):[])){
 const btn=panel.querySelector('.map-load');
 if(btn)btn.addEventListener('click',()=>{
  const frame=document.createElement('iframe');
  frame.src=panel.dataset.mapSrc;frame.title=panel.dataset.mapTitle;frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';frame.setAttribute('allowfullscreen','');
  panel.classList.add('map-loaded');panel.replaceChildren(frame);frame.focus();
 });
}
