import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
test('theme follows system, switches and persists; unavailable storage does not break controls',async()=>{
 const code=await readFile('public/assets/theme.js','utf8');
 for(const blocked of [false,true]){let ready,click,saved;const root={dataset:{}};const button={dataset:{light:'Light',dark:'Dark'},setAttribute(k,v){this[k]=v;},addEventListener(t,f){click=f;}};
 runInNewContext(code,{document:{documentElement:root,addEventListener(t,f){ready=f;},querySelector:()=>button},window:{matchMedia:()=>({matches:true})},localStorage:{getItem(){if(blocked)throw Error();return null;},setItem(k,v){if(blocked)throw Error();saved=v;}}});
 assert.equal(root.dataset.theme,'light');ready();assert.equal(button['aria-pressed'],'true');click();assert.equal(root.dataset.theme,'dark');assert.equal(button['aria-pressed'],'false');assert.ok(button.textContent.includes('Light'));if(!blocked)assert.equal(saved,'dark');
 }
});
