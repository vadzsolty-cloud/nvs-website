import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopSection,workshopCopy,generalWorkshop} from '../src/workshop.mjs';
import {equipmentTopics,equipmentGuides,equipmentLabels} from '../src/equipment-guides.mjs';

for(const lang of ['hu','ro','en'])test('all eight equipment cards have localized, native explanations: '+lang,()=>{
 const html=workshopSection(lang,'<figure>owner-photo-marker</figure>');
 assert.equal((html.match(/class="equipment-card"/g)||[]).length,8);
 assert.equal((html.match(/<summary /g)||[]).length,8);
 assert.ok(html.includes('owner-photo-marker'));
 assert.ok(!html.includes('general-workshop-card'));assert.ok(!html.includes('general-workshop-label'));
 assert.ok(!/<a\b/.test(html),'Explanations should not add booking or contact prompts');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 assert.equal(workshopCopy[lang].equipment.length,7);assert.ok(html.includes(generalWorkshop[lang].title));
 for(const topic of equipmentTopics){
  const guide=equipmentGuides[lang][topic];assert.equal(guide.length,2);assert.ok(guide[0].length>90);assert.ok(guide[1].length>60);
  const card=html.match(new RegExp('<details class="equipment-card" data-equipment="'+topic+'">([\\s\\S]*?)</details>'));
  assert.ok(card,topic);assert.ok(card[1].includes('aria-labelledby="equipment-'+lang+'-'+topic+'-title"'));
  assert.ok(card[1].includes('aria-describedby="equipment-'+lang+'-'+topic+'-teaser"'));
  assert.ok(card[1].includes(equipmentLabels[lang].meaning));assert.ok(card[1].includes(equipmentLabels[lang].when));
  assert.ok(card[1].includes('data-icon="plus"'));assert.ok(card[1].includes('data-icon="minus"'));
 }
 assert.ok(!/<details\b[^>]*\sopen(?:\s|>|=)/.test(html));
});
