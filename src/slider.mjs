// Homepage service slider (hero, right side). Real photos only where the service is recognisable on them;
// services without an approved photo get a clearly labelled icon slide instead of a substitute image.
import {picture,placement,galleryCopy} from './photos.mjs';
import {serviceIcon,visualCopy} from './visual.mjs';

export const sliderOrder=['led-matrix','adas','acc','hunter-3d','camera','diagnostics'];
export const sliderCopy={
 hu:{label:'Szolgáltatásaink képekben',pause:'Automatikus lapozás szüneteltetése',play:'Automatikus lapozás indítása',prev:'Előző szolgáltatás',next:'Következő szolgáltatás',goto:'Ugrás ide:',more:'Részletek'},
 ro:{label:'Serviciile noastre în imagini',pause:'Oprește derularea automată',play:'Pornește derularea automată',prev:'Serviciul anterior',next:'Serviciul următor',goto:'Mergi la:',more:'Detalii'},
 en:{label:'Our services in pictures',pause:'Pause automatic rotation',play:'Start automatic rotation',prev:'Previous service',next:'Next service',goto:'Go to:',more:'Details'}
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

export function serviceSlider(l,{ids,names,path}){
 const c=sliderCopy[l],n=sliderOrder.length;
 const slides=sliderOrder.map((id,k)=>{
  const i=ids.indexOf(id),slug=placement.services[id];
  const media=slug?picture(slug,l,{sizes:'(min-width: 1001px) 55vw, 100vw',priority:k===0,className:'slide-photo'})
   :`<div class="slide-icon" aria-hidden="true">${serviceIcon(i)}</div>`;
  return `<li class="slide${slug?'':' slide-no-photo'}" role="group" aria-roledescription="slide" aria-label="${k+1} / ${n}: ${esc(names[i])}" data-slide="${k}">${media}<div class="slide-caption"><span class="slide-index">NVS / ${String(i+1).padStart(2,'0')}</span><strong>${names[i]}</strong><small>${slug?visualCopy[l].teasers[i]:galleryCopy[l].placeholderTitle+' · '+galleryCopy[l].placeholder}</small><a class="slide-link" href="${path(l,id)}">${c.more}<span aria-hidden="true"> ↗</span></a></div></li>`;
 }).join('');
 const dots=sliderOrder.map((id,k)=>`<button type="button" class="slider-dot" data-goto="${k}" aria-label="${esc(c.goto+' '+names[ids.indexOf(id)])}"${k===0?' aria-current="true"':''}></button>`).join('');
 return `<section class="service-slider" aria-roledescription="carousel" aria-label="${c.label}" data-pause="${esc(c.pause)}" data-play="${esc(c.play)}"><ul class="slides" tabindex="0">${slides}</ul><div class="slider-controls" hidden><button type="button" class="slider-prev" aria-label="${c.prev}">‹</button><div class="slider-dots">${dots}</div><button type="button" class="slider-toggle" aria-label="${c.pause}"><span aria-hidden="true">❚❚</span></button><button type="button" class="slider-next" aria-label="${c.next}">›</button></div></section>`;
}

// Per-service photo slideshow (service pages): several real photos of the same kind of work, each zoomable.
const photoCopySlider={hu:{label:'Fotók a munkáról',goto:'Kép:'},ro:{label:'Fotografii din lucrare',goto:'Imaginea:'},en:{label:'Photos of the work',goto:'Photo:'}};
export function photoSlider(l,slugs,{name,alt,fullSize,open}){
 const c={...sliderCopy[l],...photoCopySlider[l]},n=slugs.length;
 const slides=slugs.map((slug,k)=>`<li class="slide" role="group" aria-roledescription="slide" aria-label="${k+1} / ${n}"><a class="zoom slide-zoom" href="${fullSize(slug)}" data-lightbox data-caption="${esc(alt(slug,l))}" aria-label="${esc(open+': '+alt(slug,l))}">${picture(slug,l,{sizes:'(min-width: 1001px) 45vw, 100vw',priority:k===0,className:'slide-photo'})}<span class="zoom-icon" aria-hidden="true">⤢</span></a><div class="slide-caption slide-caption-small"><span class="slide-index">${String(k+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}</span><small>${alt(slug,l)}</small></div></li>`).join('');
 const dots=slugs.map((s,k)=>`<button type="button" class="slider-dot" data-goto="${k}" aria-label="${esc(c.goto+' '+(k+1)+' / '+n)}"${k===0?' aria-current="true"':''}></button>`).join('');
 return `<section class="service-slider photo-slider" aria-roledescription="carousel" aria-label="${esc(name+' – '+c.label)}" data-pause="${esc(c.pause)}" data-play="${esc(c.play)}"><ul class="slides" tabindex="0">${slides}</ul><div class="slider-controls" hidden><button type="button" class="slider-prev" aria-label="${c.prev}">‹</button><div class="slider-dots">${dots}</div><button type="button" class="slider-toggle" aria-label="${c.pause}"><span aria-hidden="true">❚❚</span></button><button type="button" class="slider-next" aria-label="${c.next}">›</button></div></section>`;
}
