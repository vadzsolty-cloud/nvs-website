import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
import {photos,placement} from '../src/photos.mjs';
import {ids} from '../src/content.mjs';
import {sliderOrder} from '../src/slider.mjs';
import {facebookPosts,pageId} from '../src/facebook-posts.mjs';
import {referenceCopy} from '../src/reference-disclosure.mjs';

// Files whose bottom-left corner shows the Samsung "AI által előállított tartalom" label, the edited
// crop of the same series, and the AI-generated poster graphics (file_0000*.png) must never be used.
const excluded=['IMG-20261115-WA0000.jpg','IMG-20261115-WA0003.jpg','IMG-20261115-WA0009.jpg','IMG-20261115-WA0012.jpg','IMG-20261115-WA0028.jpg','IMG-20261115-WA0032.jpg','1000115918.jpg'];

test('photo catalogue: real originals kept, trilingual alt text, every placement resolves',async()=>{
 for(const p of Object.values(photos)){
  assert.ok(!excluded.includes(p.original),p.original);assert.ok(!/\.png$/i.test(p.original));
  await stat('media/originals/'+p.original);
  for(const l of ['hu','ro','en']){assert.ok(p.alt[l].length>15,p.slug+l);assert.ok(p.tag[l]);}
  assert.notEqual(p.alt.hu,p.alt.en);assert.notEqual(p.alt.hu,p.alt.ro);
  for(const w of p.widths)for(const ext of ['avif','webp'])await stat(`public/assets/photos/${p.slug}-${w}.${ext}`);
  await stat(`public/assets/photos/${p.slug}-${p.widths.at(-1)}.jpg`);
 }
 for(const slug of [placement.hero,placement.workshop,...placement.gallery,...Object.values(placement.services).filter(Boolean)])assert.ok(photos[slug],slug);
 assert.deepEqual(Object.keys(placement.services).sort(),[...ids].sort());
 const suppliedAlignmentOrder=['1000141131.jpg','1000141128.jpg','1000141126.jpg','1000141129.jpg','1000141130.jpg'];
 assert.deepEqual(placement.serviceSlides['hunter-3d'].slice(0,5).map(slug=>photos[slug].original),suppliedAlignmentOrder);
 assert.equal(photos[placement.services['hunter-3d']].original,suppliedAlignmentOrder[0]);
 const suppliedHeadlightOrder=['1000141139.jpg','1000141142.jpg','1000141136.jpg']; // Owner selected the second attachment as the lead image.
 assert.deepEqual(placement.serviceSlides['led-matrix'].slice(0,3).map(slug=>photos[slug].original),suppliedHeadlightOrder);
 assert.equal(photos[placement.services['led-matrix']].original,suppliedHeadlightOrder[0]);
 assert.equal(placement.hero,placement.services['led-matrix']);
});

test('pages use responsive images under /nvs-website/, eager hero, lazy gallery, placeholders for missing services',async()=>{
 const output=resolve('artifacts/test-builds/photos');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false',CONTACT_APPROVED:'false',EMULATOR_UI:'false',OUTPUT_DIR:output},stdio:'pipe'});
 for(const l of ['hu','ro','en']){
  const html=await readFile(output+'/'+l+'/index.html','utf8');
  assert.ok(!html.includes('fb-cover-label'));assert.ok(!html.includes('booking-strip'));assert.ok(!html.includes('general-workshop-link'));
  for(const kind of ['posts','photos']){
   const disclosure=html.match(new RegExp('<details class="reference-disclosure" data-reference-more="'+kind+'">([\\s\\S]*?)</details>'));
   assert.ok(disclosure);assert.ok(disclosure[1].includes(referenceCopy[l][kind]));assert.ok(disclosure[1].includes(kind==='posts'?'(+6)':'(+14)'));
  }
  for(const m of html.matchAll(/(?:image)?srcset="([^"]+)"/g))for(const item of m[1].split(', ')){const url=item.split(' ')[0];assert.ok(url.startsWith('/nvs-website/assets/photos/'),url);await stat(output+url.slice('/nvs-website'.length));}
  const imgs=[...html.matchAll(/<img [^>]*>/g)].map(m=>m[0]).filter(t=>t.includes('/assets/photos/'));
  const sliderPhotos=sliderOrder.filter(id=>placement.services[id]).length;
  assert.equal(imgs.length,sliderPhotos+Object.values(placement.services).filter(Boolean).length+1+placement.gallery.length+facebookPosts.length);
  for(const t of imgs){assert.match(t,/ alt="[^"]{15,}"/);assert.match(t,/ width="\d+" height="\d+"/);}
  assert.match(imgs[0],/fetchpriority="high"/);assert.ok(imgs.slice(1).every(t=>t.includes('loading="lazy"')));
  assert.ok(html.includes('rel="preload" as="image"'));
  assert.equal([...html.matchAll(/data-lightbox/g)].length,1+placement.gallery.length);
  assert.ok(html.includes('<dialog class="lightbox"'));
  assert.ok(!html.includes('/assets/workshop/'));
  // Facebook post cards: static links only, every selected post, no embed/SDK
  for(const p of facebookPosts){assert.ok(html.includes(`href="https://www.facebook.com/${pageId}/posts/${p.id}" target="_blank" rel="noopener"`),p.id);assert.ok(html.includes(p.title[l]));}
  assert.ok(!/connect\.facebook\.net|fbq\(/.test(html));assert.ok(html.includes('https://www.facebook.com/plugins/video.php'));assert.ok(html.includes('https://www.facebook.com/plugins/page.php'));assert.equal((html.match(/plugins\/video\.php/g)||[]).length,1);
  // service slider: one slide per service, real photo or labelled icon slide, links to the service page
  const slider=html.match(/<section class="service-slider"[\s\S]*?<\/section>/)[0];
  assert.equal([...slider.matchAll(/class="slide[ "]/g)].length,ids.length);
  for(const id of ids)assert.ok(slider.includes(`href="/nvs-website/${l}/services/${id}/"`),id);
  assert.equal([...slider.matchAll(/class="slide slide-no-photo"/g)].length,ids.filter(id=>!placement.services[id]).length);
  assert.equal([...slider.matchAll(/class="slider-dot"/g)].length,ids.length);
  assert.ok(slider.includes('aria-roledescription="carousel"')&&slider.includes('class="slider-toggle"'));
  assert.ok(slider.indexOf(photos[placement.hero].alt[l])>0);
  for(const id of ids){
   const page=await readFile(`${output}/${l}/services/${id}/index.html`,'utf8');
   assert.equal(page.includes('service-placeholder'),!placement.services[id]&&!(placement.serviceSlides||{})[id],id);
   const slides=(placement.serviceSlides||{})[id]||[];
   if(slides.length){assert.ok(page.includes('class="service-slider photo-slider"'),id);for(const slug of slides)assert.ok(page.includes(`/nvs-website/assets/photos/${slug}-`),slug);assert.equal([...page.matchAll(/fetchpriority="high"/g)].length,1);}
   const rel=facebookPosts.filter(p=>p.services.includes(id));
   for(const p of rel)assert.ok(page.includes(`href="https://www.facebook.com/${pageId}/posts/${p.id}"`),p.id);
   if(placement.services[id])assert.ok(page.includes(`/nvs-website/assets/photos/${placement.services[id]}-`));
  }
 }
 const hu=await readFile(output+'/hu/index.html','utf8'),en=await readFile(output+'/en/index.html','utf8');
 assert.ok(hu.includes(photos[placement.hero].alt.hu));assert.ok(en.includes(photos[placement.hero].alt.en));
});

test('lightbox opens, navigates with keys and swipe, closes and restores focus',async()=>{
 const handlers={},el=(name)=>({name,hidden:false,textContent:'',dataset:{},attrs:{},addEventListener(t,f){handlers[name+':'+t]=f;},focus(){focused=name;},removeAttribute(a){delete this[a];},getAttribute(a){return this.attrs[a];},querySelector(){return null;}});
 let focused=null;
 const img=el('img'),caption=el('caption'),count=el('count'),prev=el('prev'),next=el('next'),close=el('close');
 const box={...el('box'),dataset:{of:'/'},showModal(){this.open=true;},close(){this.open=false;handlers['box:close']();},querySelector:s=>({img,'.lightbox-caption':caption,'.lightbox-count':count,'.lightbox-prev':prev,'.lightbox-next':next,'.lightbox-close':close})[s]};
 box.addEventListener=(t,f,)=>{handlers['box:'+t]=f;};
 const links=[0,1,2].map(i=>{const a=el('a'+i);a.attrs.href='/p'+i+'.jpg';a.dataset.caption='C'+i;a.querySelector=()=>({alt:'Alt '+i});return a;});
 runInNewContext(await readFile('public/assets/app.js','utf8'),{document:{querySelector:s=>s==='.lightbox'?box:null,querySelectorAll:s=>s.includes('lightbox')?links:[]},Math});
 let prevented=false;handlers['a1:click']({button:0,preventDefault(){prevented=true;}});
 assert.ok(prevented&&box.open);assert.equal(img.src,'/p1.jpg');assert.equal(img.alt,'Alt 1');assert.equal(caption.textContent,'C1');assert.equal(count.textContent,'2 / 3');assert.equal(focused,'close');
 const key=k=>handlers['box:keydown']({key:k,preventDefault(){}});
 key('ArrowRight');assert.equal(img.src,'/p2.jpg');key('ArrowRight');assert.equal(img.src,'/p0.jpg');key('ArrowLeft');assert.equal(img.src,'/p2.jpg');key('Home');assert.equal(img.src,'/p0.jpg');key('End');assert.equal(img.src,'/p2.jpg');
 handlers['box:touchstart']({touches:[{clientX:300}]});handlers['box:touchend']({changedTouches:[{clientX:100}]});assert.equal(img.src,'/p0.jpg');
 handlers['next:click']();assert.equal(img.src,'/p1.jpg');
 handlers['close:click']();assert.ok(!box.open);assert.equal(focused,'a1');assert.equal(img.src,undefined);
 let modified=false;handlers['a0:click']({button:0,ctrlKey:true,preventDefault(){modified=true;}});assert.ok(!modified);
});

test('service slider: controls appear, dots/prev/next move, pause toggles, autoplay respects reduced motion',async()=>{
 const make=()=>{const h={};return {h,attrs:{},hidden:true,dataset:{},addEventListener(t,f){h[t]=f;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}};};
 const run=async reduce=>{
  const slides=[0,1,2].map(i=>({...make(),offsetLeft:100+i*500})),dots=[0,1,2].map(make),track={...make(),clientWidth:500,scrollLeft:0,scrollTo(o){this.to=o;}};
  const toggle={...make(),firstElementChild:{textContent:''}},controls=make(),prev=make(),next=make();
  const slider={...make(),dataset:{pause:'Pause',play:'Play'},querySelector:s=>({'.slides':track,'.slider-toggle':toggle,'.slider-controls':controls,'.slider-prev':prev,'.slider-next':next})[s],querySelectorAll:s=>s==='.slide'?slides:dots};
  const intervals=[];
  runInNewContext(await readFile('public/assets/app.js','utf8'),{document:{querySelector:()=>null,querySelectorAll:s=>s==='.service-slider'?[slider]:[],hidden:false},matchMedia:()=>({matches:reduce}),setInterval:(f,ms)=>{intervals.push(f);return intervals.length;},clearInterval(){},setTimeout(f){f();},clearTimeout(){},Math});
  return {slides,dots,track,toggle,controls,prev,next,slider,intervals};
 };
 const s=await run(false);
 assert.equal(s.controls.hidden,false);assert.equal(s.toggle.attrs['aria-label'],'Pause');assert.equal(s.intervals.length,1);
 s.next.h.click();assert.equal(s.track.to.left,500);assert.equal(s.dots[1].attrs['aria-current'],'true');assert.equal(s.dots[0].attrs['aria-current'],undefined);
 s.prev.h.click();s.prev.h.click();assert.equal(s.track.to.left,1000);assert.equal(s.dots[2].attrs['aria-current'],'true');
 s.dots[0].h.click();assert.equal(s.track.to.left,0);
 s.intervals[0]();assert.equal(s.track.to.left,500);
 s.slider.h.mouseenter();s.intervals[0]();assert.equal(s.track.to.left,500);s.slider.h.mouseleave();
 s.track.h.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(s.track.to.left,1000);
 s.track.scrollLeft=0;s.track.h.scroll();assert.equal(s.dots[0].attrs['aria-current'],'true');
 s.toggle.h.click();assert.equal(s.toggle.attrs['aria-label'],'Play');assert.equal(s.toggle.firstElementChild.textContent,'▶');
 const r=await run(true);assert.equal(r.intervals.length,0);assert.equal(r.toggle.attrs['aria-label'],'Play');
});
