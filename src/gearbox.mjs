import {placement,alt,fullSize,galleryCopy} from './photos.mjs';
import {photoSlider} from './slider.mjs';
export const gearboxCopy={
 hu:{title:'Váltóolajcsere',tag:'MŰHELYNAPLÓ',link:'Váltóolajcsere képekben',text:'Valódi műhelyfotók egy váltóolajcsere munkafolyamatából: a jármű az emelőn, az olajcsere-berendezés és a váltó alulnézetből. A munka részletei közelről.'},
 ro:{title:'Schimb de ulei la cutia de viteze',tag:'DIN ATELIER',link:'Schimbul uleiului la cutie, în imagini',text:'Fotografii reale din atelier, din timpul unui schimb de ulei la cutia de viteze: vehiculul pe elevator, echipamentul de schimb și cutia văzută de dedesubt. Detaliile lucrării, de aproape.'},
 en:{title:'Transmission oil change',tag:'WORKSHOP JOURNAL',link:'Transmission oil change in pictures',text:'Real workshop photographs from a transmission oil change: the vehicle on the lift, the service equipment and the transmission viewed from below. A closer look at the work.'}
};
export function gearboxReport(lang){const t=gearboxCopy[lang];return '<section id="gearbox-oil" class="gearbox-report" aria-labelledby="gearbox-oil-title"><div class="gearbox-copy"><p class="eyebrow">'+t.tag+'</p><h3 id="gearbox-oil-title">'+t.title+'</h3><p>'+t.text+'</p></div><div class="gearbox-photos">'+photoSlider(lang,placement.gearboxOilSlides,{name:t.title,alt,fullSize,open:galleryCopy[lang].open,priority:false})+'</div></section>';}
