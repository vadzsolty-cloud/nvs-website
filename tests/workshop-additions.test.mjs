import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {placement,photos,assetStem,mediaDisclosure} from '../src/photos.mjs';
import {workshopServiceIds,workshopServiceCard,workshopServicePage} from '../src/workshop-services.mjs';
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
 for(const list of [...Object.values(placement.serviceSlides),placement.gearboxOilSlides,placement.airConditioningSlides,placement.transmissionServiceSlides]){
  assert.equal(new Set(list).size,list.length);
  assert.equal(new Set(list.map(s=>photos[s].original)).size,list.length);
 }
 assert.equal(placement.services['hunter-3d'],'hunter-audi-front-wheel');
 assert.equal(placement.services.acc,'acc-radar-workshop-overview');
 assert.equal(placement.transmissionServiceSlides[0],'gearbox-ford-mondeo-machine');
 const catalogue=Object.values(photos);
 assert.equal(new Set(catalogue.map(p=>p.original)).size,catalogue.length);
});

test('expanded workshop pages keep guides, photos and illustration provenance together',()=>{
 for(const l of ['hu','ro','en']){
  const ac=airConditioningCard(l);assert.ok(ac.includes('<span>'+airConditioningCopy[l].detail+'</span>'));
  if(l==='hu')assert.equal(airConditioningCopy[l].detail,'Részletek');
  for(const id of workshopServiceIds){
   const card=workshopServiceCard(l,id),page=workshopServicePage(l,id);
   assert.ok(card.includes('<picture'));assert.ok(page.includes('id="service-guide"'));
   assert.equal((page.match(/<details><summary>/g)||[]).length,3);
   assert.equal((page.match(/class="service-actions/g)||[]).length,2);
   assert.ok(!page.includes('undefined'));
   const slug=id==='brake-testing'?'brake-audi-bench-illustration':'gearbox-ford-mondeo-machine';
   if(id==='brake-testing'){assert.equal(mediaDisclosure(slug,l),'AI');assert.ok(card.includes('class="media-disclosure">AI</span>'));assert.ok(page.includes('<figcaption>'+photos[slug].alt[l]+' · AI</figcaption>'));assert.ok(!photos[slug].alt[l].includes('ACC'));}
   else{assert.equal(mediaDisclosure(slug,l),'');assert.ok(!card.includes('media-disclosure'));assert.ok(!page.includes('AI-labelled')&&!page.includes('AI-jelöléssel')&&!page.includes('etichetată AI'));}
   const displayed=[...page.matchAll(/<img [^>]*src="([^"]+)"/g)].map(m=>m[1]);
   assert.equal(new Set(displayed).size,displayed.length);
  }
 }
});
