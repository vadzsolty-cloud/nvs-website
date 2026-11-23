import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {searchMetadata} from '../src/search.mjs';
import {ids} from '../src/content.mjs';

test('production sitemap points only to indexable canonical pages with reciprocal language alternates',async()=>{
 const output=resolve('artifacts/test-builds/search'),origin='https://night-vision-service.eu';
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,OUTPUT_DIR:output,SITE_URL:origin,BASE_PATH:'',PRODUCTION:'true',CONTACT_APPROVED:'true',EMULATOR_UI:'false'},stdio:'pipe'});
 const xml=await readFile(output+'/sitemap.xml','utf8'),blocks=[...xml.matchAll(/<url>(.*?)<\/url>/g)].map(m=>m[1]);
 assert.equal(blocks.length,24);assert.ok(!/\/(account|download|facebook|privacy|company|cookies|terms)\//.test(xml));
 for(const block of blocks){
  const url=block.match(/<loc>(.*?)<\/loc>/)[1],path=new URL(url).pathname,parts=path.split('/').filter(Boolean),lang=parts[0],id=parts[2];
  assert.equal(new URL(url).origin,origin);
  const html=await readFile(output+path+'index.html','utf8');
  assert.ok(html.includes('content="index,follow"'));assert.ok(html.includes('rel="canonical" href="'+url+'"'));
  for(const l of ['hu','ro','en'])assert.ok(block.includes('hreflang="'+l+'" href="'+origin+path.replace('/'+lang+'/','/'+l+'/')+'"'));
  const meta=searchMetadata(lang,id);assert.ok(html.includes('<title>'+meta.title.replaceAll('&','&amp;')+'</title>'));
  const data=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.equal(data[0]['@type'],'AutoRepair');assert.equal(data[0].hasOfferCatalog.itemListElement.length,7);assert.equal(data[0].url,origin+'/'+lang+'/');
  if(id){assert.ok([...ids,'air-conditioning'].includes(id));assert.equal(data[1][0]['@type'],'Service');assert.equal(data[1][0].url,url);assert.equal(data[1][0].provider['@id'],data[0]['@id']);assert.equal(data[1][1].itemListElement.at(-1).item,url);}
  else assert.ok(html.includes('id="partner-workshops-title"'));
 }
 for(const lang of ['hu','ro','en'])for(const kind of ['account','download','facebook','privacy','company','cookies','terms'])assert.ok((await readFile(output+'/'+lang+'/'+kind+'/index.html','utf8')).includes('noindex,nofollow'));
 assert.match(await readFile(output+'/robots.txt','utf8'),/^User-agent: \*\nAllow: \/\nSitemap: https:\/\/night-vision-service\.eu\/sitemap\.xml/);
 assert.equal((await readFile(output+'/googlea9e351af3f0ba3f9.html','utf8')).trim(),'google-site-verification: googlea9e351af3f0ba3f9.html');
});
