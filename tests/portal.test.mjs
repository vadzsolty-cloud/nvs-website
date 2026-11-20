import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {portalCopy,portalContactCopy} from '../src/premium.mjs';
import {business} from '../src/business.mjs';
test('localized customer and download pages preserve routes, privacy and shared registration',async()=>{
 const output=resolve('artifacts/test-builds/portal');
 execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,OUTPUT_DIR:output,BASE_PATH:'/nvs-website',SITE_URL:'https://vadzsolty-cloud.github.io',PRODUCTION:'false',EMULATOR_UI:'false'},stdio:'pipe'});
 const titles=new Set();
 for(const lang of ['hu','ro','en'])for(const kind of ['account','download']){
  const html=await readFile(`${output}/${lang}/${kind}/index.html`,'utf8'),title=html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(!titles.has(title));titles.add(title);assert.ok(html.includes(portalCopy[lang][kind+'Meta']));
  assert.ok(html.includes(`rel="canonical" href="https://vadzsolty-cloud.github.io/nvs-website/${lang}/${kind}/"`));
  for(const x of ['hu','ro','en'])assert.ok(html.includes(`hreflang="${x}" href="https://vadzsolty-cloud.github.io/nvs-website/${x}/${kind}/"`));
  assert.ok(html.includes('content="noindex,nofollow"'));assert.ok(html.includes('id="site-menu"'));assert.ok(html.includes(`href="/nvs-website/${lang}/account/"`));
  for(const asset of html.matchAll(/(?:src|href)="(\/nvs-website\/assets\/[^"#]+)"/g))await stat(output+asset[1].slice('/nvs-website'.length));
  if(kind==='account'){
   const contact=html.match(/<aside class="portal-contact"[\s\S]*?<\/aside>/)?.[0];assert.ok(contact);
   for(const value of [portalContactCopy[lang].title,business.name,business.vatId,business.tradeRegister,business.address])assert.ok(contact.includes(value));
   assert.ok(contact.includes(`href="${business.phoneHref}"`));assert.ok(contact.includes(`href="mailto:${business.email}"`));assert.ok(contact.includes(`href="${business.maps.replaceAll('&','&amp;')}"`));
   assert.ok(html.indexOf('class="portal-contact"')<html.indexOf('id="native-login"'));
   assert.ok(html.includes('id="native-contact-name"'));assert.ok(html.includes('id="native-contact-phone"'));assert.ok(html.includes('value="other"'));
   assert.ok(html.includes('id="native-login"'));assert.ok(html.includes('id="register"'));assert.ok(html.includes('href="https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/"'));assert.ok(html.includes(`href="/nvs-website/${lang}/download/"`));
  }else{
   assert.ok(html.includes('data-download-page'));assert.ok(html.includes('href="https://github.com/vadzsolty-cloud/nvs-app-letoltes/releases/latest"'));assert.ok(!html.includes('id="native-login"'));
  }
 }
});
