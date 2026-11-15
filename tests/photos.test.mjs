import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
import {photos,placement} from '../src/photos.mjs';
import {ids} from '../src/content.mjs';

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
});

test('pages use responsive images under /nvs-website/, eager hero, lazy gallery, placeholders for missing services',async()=>{
 const output=resolve('artifacts/test-builds/photos');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false',CONTACT_APPROVED:'false',EMULATOR_UI:'false',OUTPUT_DIR:output},stdio:'pipe'});
 for(const l of ['hu','ro','en']){
  const html=await readFile(output+'/'+l+'/index.html','utf8');
  for(const m of html.matchAll(/(?:image)?srcset="([^"]+)"/g))for(const item of m[1].split(', ')){const url=item.split(' ')[0];assert.ok(url.startsWith('/nvs-website/assets/photos/'),url);await stat(output+url.slice('/nvs-website'.length));}
  const imgs=[...html.matchAll(/<img [^>]*>/g)].map(m=>m[0]).filter(t=>t.includes('/assets/photos/'));
  assert.equal(imgs.length,2+placement.gallery.length);
  for(const t of imgs){assert.match(t,/ alt="[^"]{15,}"/);assert.match(t,/ width="\d+" height="\d+"/);}
  assert.match(imgs[0],/fetchpriority="high"/);assert.ok(imgs.slice(1).every(t=>t.includes('loading="lazy"')));
  assert.ok(html.includes('rel="preload" as="image"'));
  assert.equal([...html.matchAll(/data-lightbox/g)].length,1+placement.gallery.length);
  assert.ok(html.includes('<dialog class="lightbox"'));
  assert.ok(!html.includes('/assets/workshop/'));
  for(const id of ids){
   const page=await readFile(`${output}/${l}/services/${id}/index.html`,'utf8');
   assert.equal(page.includes('service-placeholder'),!placement.services[id],id);
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
 runInNewContext(await readFile('public/assets/app.js','utf8'),{document:{querySelector:s=>s==='.lightbox'?box:null,querySelectorAll:()=>links},Math});
 let prevented=false;handlers['a1:click']({button:0,preventDefault(){prevented=true;}});
 assert.ok(prevented&&box.open);assert.equal(img.src,'/p1.jpg');assert.equal(img.alt,'Alt 1');assert.equal(caption.textContent,'C1');assert.equal(count.textContent,'2 / 3');assert.equal(focused,'close');
 const key=k=>handlers['box:keydown']({key:k,preventDefault(){}});
 key('ArrowRight');assert.equal(img.src,'/p2.jpg');key('ArrowRight');assert.equal(img.src,'/p0.jpg');key('ArrowLeft');assert.equal(img.src,'/p2.jpg');key('Home');assert.equal(img.src,'/p0.jpg');key('End');assert.equal(img.src,'/p2.jpg');
 handlers['box:touchstart']({touches:[{clientX:300}]});handlers['box:touchend']({changedTouches:[{clientX:100}]});assert.equal(img.src,'/p0.jpg');
 handlers['next:click']();assert.equal(img.src,'/p1.jpg');
 handlers['close:click']();assert.ok(!box.open);assert.equal(focused,'a1');assert.equal(img.src,undefined);
 let modified=false;handlers['a0:click']({button:0,ctrlKey:true,preventDefault(){modified=true;}});assert.ok(!modified);
});
