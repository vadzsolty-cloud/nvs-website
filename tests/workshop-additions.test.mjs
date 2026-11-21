import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {placement,photos,assetStem} from '../src/photos.mjs';
import {airConditioningPage,airConditioningCard,airConditioningCopy} from '../src/air-conditioning.mjs';
test('new AC service is reachable in every language with its own reviewed photo set',()=>{
 assert.equal(placement.airConditioningSlides.length,7);
 for(const l of ['hu','ro','en']){
  const page=airConditioningPage(l),card=airConditioningCard(l);
  assert.ok(page.includes('<h1>'+airConditioningCopy[l].title+'</h1>'));
  assert.ok(card.includes('href="/'+l+'/services/air-conditioning/"'));
  assert.equal((page.match(/data-lightbox/g)||[]).length,7);
  assert.ok(page.includes('href="/'+l+'/account/"'));
  assert.ok(!page.includes('undefined'));
  for(const slug of placement.airConditioningSlides)assert.ok(page.includes('/assets/photos/'+assetStem(slug)+'-'));
 }
});
test('photo placements do not repeat a photograph and preserve the owner-selected leads',()=>{
 for(const list of [...Object.values(placement.serviceSlides),placement.gearboxOilSlides,placement.airConditioningSlides]){
  assert.equal(new Set(list).size,list.length);
  assert.equal(new Set(list.map(s=>photos[s].original)).size,list.length);
 }
 assert.equal(placement.services['hunter-3d'],'hunter-audi-front-wheel');
 assert.equal(placement.services.acc,'acc-radar-workshop-overview');
 const catalogue=Object.values(photos);
 assert.equal(new Set(catalogue.map(p=>p.original)).size,catalogue.length);
});
