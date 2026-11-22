import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
import {content,ids} from '../src/content.mjs';
import {getConfig} from '../scripts/config.mjs';
import {createPreviewServer} from '../scripts/preview-server.mjs';
import {business} from '../src/business.mjs';

for(const basePath of ['', '/nvs-website'])test('localized HTML, assets, redirects and preview routing: '+(basePath||'/'),async()=>{
 const output=resolve('artifacts/test-builds/'+(basePath?'pages':'root'));
 const origin='https://vadzsolty-cloud.github.io';
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:basePath,SITE_URL:origin,PRODUCTION:'false',CONTACT_APPROVED:'false',EMULATOR_UI:'false',OUTPUT_DIR:output},stdio:'pipe'});
 const titles=new Set(),descriptions=new Set();
 for(const l of Object.keys(content))for(const id of ['',...ids]){
  const path='/'+l+'/'+(id?'services/'+id+'/':'');
  const html=await readFile(output+path+'index.html','utf8');
  assert.ok(html.includes('<html lang="'+l+'">'));
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  const description=html.match(/name="description" content="([^"]+)"/)[1];assert.ok(!descriptions.has(description));descriptions.add(description);
  assert.ok(html.includes('rel="canonical" href="'+origin+basePath+path+'"'));
  for(const x of Object.keys(content))assert.ok(html.includes('hreflang="'+x+'" href="'+origin+basePath+'/'+x+'/'+(id?'services/'+id+'/':'')+'"'));
  assert.ok(html.includes('noindex,nofollow'));
  assert.ok(!html.includes('fb-cover-brand'));
  assert.ok(!html.includes('class="fb-cover-label">NVS</span>'));
  const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(json['@type'],'AutoRepair');assert.equal(json.telephone,business.phone);
  assert.equal(json.name,business.brandName);assert.equal(json.legalName,business.name);assert.equal(json.vatID,business.vatId);assert.equal(json.email,business.email);assert.equal(json.hasMap,business.maps);
  assert.ok(html.includes('href="'+business.phoneHref+'"'));assert.ok(html.includes(business.phone));assert.ok(html.includes(business.address));
  assert.ok(html.includes('href="'+business.facebook+'"'));
  assert.ok(!html.includes('connect.facebook.net'));assert.equal(html.includes('<iframe'),!id,'Only the homepage repeats embedded contact/social sections');
  if(id){
   const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
   assert.equal((main.match(/class="service-actions(?: service-actions--compact)?"/g)||[]).length,2,'Core services offer contact before and after the guide');
   assert.ok(main.includes('href="'+basePath+'/'+l+'/account/"'));
   assert.ok(main.includes('href="'+business.phoneHref+'"'));
  }else{
   assert.ok(!html.includes('class="booking-demo"'),'The public homepage should not offer an obsolete booking demo');
   const navigation=html.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
   assert.deepEqual([...navigation.matchAll(/href="[^"#]*#([^"]+)"/g)].map(m=>m[1]),['services','references','about','contact']);
   assert.ok(html.includes('<h2 id="app-title">'));
  }
  assert.ok(html.includes('href="'+business.maps+'"'),'Every page exposes the workshop map in the quick-menu contact card');assert.ok(html.includes('href="'+business.app+'"'));
  assert.ok(!html.includes('www.google.com/maps/search'));assert.ok(!html.includes('emulator-lab.js'));
  for(const link of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)){
   assert.ok(link[1].startsWith(basePath+'/'));
   const local=link[1].slice(basePath.length);
   await stat(output+local+(local.endsWith('/')?'index.html':''));
  }
  for(const link of html.matchAll(/href="(#[^"]+)"/g))assert.ok(html.includes('id="'+link[1].slice(1)+'"'));
  for(const link of html.matchAll(/href="(\/[^"#]+)#([^"]+)"/g)){
   const target=await readFile(output+link[1].slice(basePath.length)+'index.html','utf8');
   assert.ok(target.includes('id="'+link[2]+'"'));
  }
 }
 assert.equal(titles.size,21);assert.equal(descriptions.size,21);
 const index=await readFile(output+'/index.html','utf8');assert.ok(index.includes('content="0;url='+basePath+'/hu/"'));
 const notFound=await readFile(output+'/404.html','utf8');assert.ok(notFound.includes('href="'+basePath+'/hu/"'));
 const xml=await readFile(output+'/sitemap.xml','utf8');assert.equal([...xml.matchAll(/<loc>/g)].length,45);assert.ok(xml.includes(origin+basePath+'/en/services/adas/'));
 for(const l of ['hu','ro','en']){const policy=await readFile(output+'/'+l+'/privacy/index.html','utf8');assert.ok(policy.includes('<html lang="'+l+'">'));assert.ok(policy.includes('noindex,nofollow'));assert.ok(policy.includes(origin+basePath+'/'+l+'/privacy/'));}
 assert.match(await readFile(output+'/robots.txt','utf8'),/Disallow: \//);await stat(output+'/.nojekyll');
 const server=createPreviewServer({output,basePath});
 const handler=server.listeners('request')[0];
 const request=async route=>{
  const response={status:200,headers:{},body:null,writeHead(status,headers={}){this.status=status;this.headers=headers;return this;},end(body){this.body=body;return this;}};
  await handler({url:route},response);return response;
 };
 for(const route of ['/hu/','/ro/','/en/services/acc/','/hu/services/air-conditioning/','/assets/style.css','/assets/app.js','/assets/nvs-original.png','/sitemap.xml']){
  const response=await request(basePath+route);assert.equal(response.status,200,route);assert.ok(response.body.length>0);
 }
 const redirect=await request(basePath+'/en/services/acc');assert.equal(redirect.status,308);assert.equal(redirect.headers.Location,basePath+'/en/services/acc/');
 assert.equal((await request(basePath+'/missing/')).status,404);
 if(basePath)assert.equal((await request('/assets/style.css')).status,404);
});

test('configuration rejects malformed mounts and unsafe origins',()=>{
 for(const BASE_PATH of ['//bad','/../x','/x?y','/x#y','x','/x//y'])assert.throws(()=>getConfig({BASE_PATH}));
 for(const SITE_URL of ['file:///tmp/','https://example.com/x','https://user:password@example.com'])assert.throws(()=>getConfig({SITE_URL}));
 assert.equal(getConfig({BASE_PATH:'/nvs-website/'}).basePath,'/nvs-website');
 assert.throws(()=>getConfig({PRODUCTION:'true'}));
 assert.throws(()=>getConfig({EMULATOR_UI:'true',SITE_URL:'https://vadzsolty-cloud.github.io'}),/Emulator UI/);
 assert.throws(()=>getConfig({PRODUCTION:'true',SITE_URL:'https://example.com'}),/owner-approved/);
});

test('local emulator build is opt-in and owner approval controls structured street and phone',async()=>{
 const output=resolve('artifacts/test-builds/lab');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',SITE_URL:'http://localhost:4180',PRODUCTION:'false',CONTACT_APPROVED:'false',EMULATOR_UI:'true',OUTPUT_DIR:output},stdio:'pipe'});
 for(const l of ['hu','ro','en']){const html=await readFile(output+'/'+l+'/lab/index.html','utf8');assert.ok(html.includes('emulator-lab.js'));assert.ok(html.includes('noindex,nofollow'));}
 const handler=createPreviewServer({output,basePath:'/nvs-website',emulatorUi:true}).listeners('request')[0];
 for(const [route,allowed] of [['/hu/lab/',true],['/hu/',false]]){
  const response={writeHead(status,headers){this.headers=headers;return this;},end(){}};await handler({url:'/nvs-website'+route},response);
  assert.equal(response.headers['Content-Security-Policy'].includes('http://127.0.0.1:9099'),allowed);
 }
 const approved=resolve('artifacts/test-builds/approved');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',SITE_URL:'https://example.com',PRODUCTION:'true',CONTACT_APPROVED:'true',EMULATOR_UI:'false',OUTPUT_DIR:approved},stdio:'pipe'});
 const html=await readFile(approved+'/hu/index.html','utf8');const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(schema.telephone,business.phone);assert.equal(schema.address.streetAddress,business.street);
});

test('demo summarises and resets without network or persistent storage',async()=>{
 const listeners={},nodes={};
 for(const id of ['booking-form','date','result','service','selection','time','reset','.step'])nodes[id]={hidden:false,value:'',textContent:'',selectedOptions:[{textContent:'ADAS'}],firstChild:{textContent:''},addEventListener:(type,fn)=>listeners[id+type]=fn,focus(){this.focused=true;},setCustomValidity(value){this.validity=value;},reportValidity(){return true;},reset(){this.didReset=true;}};
 nodes.service.value='adas';nodes.date.value='2099-12-01';nodes.time.value='11:00';
 runInNewContext(await readFile('public/assets/app.js','utf8'),{document:{querySelector:s=>nodes[s.replace(/^#/, '')],body:{dataset:{invalidDate:'Invalid'}}},Date});
 let prevented=false;listeners['booking-formsubmit']({preventDefault(){prevented=true;}});
 assert.ok(prevented);assert.equal(nodes['booking-form'].hidden,true);assert.equal(nodes.result.hidden,false);assert.ok(nodes.result.focused);assert.equal(nodes.selection.textContent,'ADAS · 2099-12-01 · 11:00');
 listeners.resetclick();assert.equal(nodes['booking-form'].hidden,false);assert.equal(nodes.result.hidden,true);assert.equal(nodes.selection.textContent,'');assert.ok(nodes['booking-form'].didReset);
 nodes.date.value='2000-01-01';listeners['booking-formsubmit']({preventDefault(){}});assert.equal(nodes.date.validity,'Invalid');assert.equal(nodes['booking-form'].hidden,false);
});

test('map is gated before consent and theme controls are localized',async()=>{
 const output=resolve('artifacts/test-builds/map');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false',EMULATOR_UI:'false',OUTPUT_DIR:output},stdio:'pipe'});
 for(const l of ['hu','ro','en']){const html=await readFile(output+'/'+l+'/index.html','utf8');assert.ok(html.includes('src="https://maps.google.com/maps?q=46.4619963,25.7936655&amp;z=18&amp;t=k&amp;output=embed&amp;hl='+l+'"'));assert.ok(!html.includes('map-load"'));assert.ok(!/<iframe\b[^>]*\ssrc=/.test(html));assert.ok(html.includes('data-consent-category="maps"'));assert.ok(html.includes('theme-toggle'));assert.match(html,/\/nvs-website\/assets\/theme-[a-f0-9]{12}\.js/);}
 for(const l of ['hu','ro','en'])for(const path of ['',...ids.map(id=>'services/'+id+'/'),'services/air-conditioning/','account/','download/','facebook/','company/','privacy/','cookies/','terms/']){
  const html=await readFile(output+'/'+l+'/'+path+'index.html','utf8');
  const theme=html.match(/src="(\/nvs-website\/assets\/theme-[a-f0-9]{12}\.js)"/);
  assert.ok(theme,l+'/'+path+' must use the versioned theme script');await stat(output+theme[1].slice('/nvs-website'.length));
  assert.ok(html.includes('data-system="'+{hu:'Rendszer',ro:'Sistem',en:'System'}[l]+'"'));
 }
});
