import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const code=await readFile('public/assets/theme.js','utf8');
const key='nvs-website-theme-mode';
function setup({dark=false,saved,legacy,blocked=false,fallback=false,noButton=false}={}){
 const values=new Map([[key,saved],['nvs-theme',legacy]]),root={dataset:{}};
 let ready,click,change;
 const media={matches:dark,[fallback?'addListener':'addEventListener'](...args){change=args.at(-1);}};
 const button={dataset:{system:'System',light:'Light',dark:'Dark',label:'Theme',next:'Next'},setAttribute(k,v){this[k]=v;},addEventListener(t,f){click=f;}};
 const meta={setAttribute(k,v){this[k]=v;}};
 runInNewContext(code,{document:{documentElement:root,addEventListener(t,f){ready=f;},querySelector:s=>s==='.theme-toggle'?(noButton?null:button):meta},window:{matchMedia:()=>media},localStorage:{getItem(k){if(blocked)throw Error();return values.get(k)??null;},setItem(k,v){if(blocked)throw Error();values.set(k,v);}}});
 ready();
 return {root,button,meta,values,click:()=>click(),system(dark){media.matches=dark;change();}};
}
test('fresh visits follow the system and react to changes without reload',()=>{
 for(const dark of [false,true]){
  const s=setup({dark});assert.equal(s.root.dataset.themeMode,'system');assert.equal(s.root.dataset.theme,dark?'dark':'light');
  assert.match(s.button['aria-label'],/Theme: System/);assert.equal(s.button['aria-pressed'],undefined);
  s.system(!dark);assert.equal(s.root.dataset.theme,dark?'light':'dark');
  assert.equal(s.meta.content,dark?'#f5f7f3':'#0b0e0e');
 }
});
test('manual choices persist and returning to system resumes live following',()=>{
 const s=setup({dark:true});
 s.click();assert.equal(s.root.dataset.themeMode,'light');assert.equal(s.values.get(key),'light');
 s.system(false);s.system(true);assert.equal(s.root.dataset.theme,'light');
 const reload=setup({dark:true,saved:s.values.get(key)});assert.equal(reload.root.dataset.theme,'light');
 s.click();assert.equal(s.root.dataset.themeMode,'dark');assert.equal(s.values.get(key),'dark');
 s.click();assert.equal(s.root.dataset.themeMode,'system');assert.equal(s.values.get(key),'system');
 s.system(false);assert.equal(s.root.dataset.theme,'light');
});
test('legacy shared-origin preference is left untouched and invalid website choices use system',()=>{
 for(const saved of [undefined,'unexpected']){
  const s=setup({saved,legacy:'dark'});assert.equal(s.root.dataset.theme,'light');assert.equal(s.values.get('nvs-theme'),'dark');
  s.click();assert.equal(s.values.get('nvs-theme'),'dark');
 }
});
test('blocked storage, legacy media listener and pages without a button remain usable',()=>{
 const s=setup({blocked:true,fallback:true});s.click();assert.equal(s.root.dataset.theme,'light');s.click();assert.equal(s.root.dataset.theme,'dark');s.click();s.system(true);assert.equal(s.root.dataset.theme,'dark');
 const bare=setup({noButton:true});bare.system(true);assert.equal(bare.root.dataset.theme,'dark');
});
