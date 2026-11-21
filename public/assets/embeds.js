// Resize only the website-owned iframe viewport; the Facebook content stays on Facebook.
document.querySelectorAll('.fb-embed').forEach(frame=>{
 let timer;
 const fit=()=>{
  const measured=frame.getBoundingClientRect().width||frame.parentElement?.getBoundingClientRect().width;
  if(!measured)return;
  const width=Math.min(500,Math.max(220,Math.round(measured)));
  const videoWidth=Number(frame.dataset.videoWidth)||9,videoHeight=Number(frame.dataset.videoHeight)||16;
  const height=frame.classList.contains('fb-featured')?Math.ceil(width*videoHeight/videoWidth):Math.ceil(width*16/9)+520;
  const url=new URL(frame.dataset.embedSrc);
  url.searchParams.set('width',String(width));url.searchParams.set('height',String(height));
  frame.setAttribute('width',String(width));frame.setAttribute('height',String(height));
  frame.dataset.embedSrc=url.href;
  // Preparing dimensions must never load a vendor before consent, or reload it after withdrawal.
  if(frame.hasAttribute('src')&&frame.src!==url.href)frame.src=url.href;
 };
 document.addEventListener('nvs-consent-change',fit);
 fit();
 if('ResizeObserver' in window)new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(fit,250);}).observe(frame);
});
