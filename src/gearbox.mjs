import {placement,alt,fullSize,galleryCopy} from './photos.mjs';
import {photoSlider} from './slider.mjs';
export const gearboxCopy={
 hu:{title:'Váltóolajcsere',tag:'MŰHELYNAPLÓ',link:'Váltóolajcsere képekben',text:'BMW automata váltójának olajcseréje professzionális váltóolajcsere-berendezéssel.'},
 ro:{title:'Schimb de ulei la cutia de viteze',tag:'DIN ATELIER',link:'Schimbul uleiului la cutie, în imagini',text:'Schimb de ulei la cutia automată a unui BMW, cu echipament profesional dedicat.'},
 en:{title:'Transmission oil change',tag:'WORKSHOP JOURNAL',link:'Transmission oil change in pictures',text:'BMW automatic transmission oil change using dedicated professional service equipment.'}
};
export function gearboxReport(lang){const t=gearboxCopy[lang];return '<section id="gearbox-oil" class="gearbox-report" aria-labelledby="gearbox-oil-title"><div class="gearbox-copy"><p class="eyebrow">'+t.tag+'</p><h3 id="gearbox-oil-title">'+t.title+'</h3><p>'+t.text+'</p></div><div class="gearbox-photos">'+photoSlider(lang,placement.gearboxOilSlides,{name:t.title,alt,fullSize,open:galleryCopy[lang].open,priority:false})+'</div></section>';}
