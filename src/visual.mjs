// Original owner logo is used unchanged. The eye mark in the supplied mockup is not our logo.
export const visualCopy={
 hu:{focus:'technológia',descriptor:'ADAS · KALIBRÁLÁS · DIAGNOSZTIKA',stripTitle:'Online időpontkérés. Egy lépéssel közelebb a megoldáshoz.',stripNote:'Demófelület · Az NVS App közös foglalása fejlesztés alatt.',teasers:['Adaptív tempomat','Vezetéstámogató rendszerek','Precíz kerékgeometria','Első és járműkamerák','Korszerű világítás','Hibafeltárás és ellenőrzés'],original:'Az eredeti Night Vision Service arculat',photoNote:'Ide a saját NVS-műhelyfotónk kerül.'},
 ro:{focus:'tehnologia',descriptor:'ADAS · CALIBRARE · DIAGNOZĂ',stripTitle:'Solicitare online. Un pas mai aproape de soluție.',stripNote:'Demonstrație · Programările comune cu NVS App sunt în dezvoltare.',teasers:['Pilot automat adaptiv','Sisteme de asistență','Geometrie precisă a roților','Camere frontale și auto','Iluminare modernă','Identificare și verificare'],original:'Identitatea originală Night Vision Service',photoNote:'Aici va apărea fotografia propriului atelier NVS.'},
 en:{focus:'technology',descriptor:'ADAS · CALIBRATION · DIAGNOSTICS',stripTitle:'Request online. One step closer to the right solution.',stripNote:'Demo interface · Shared NVS App booking is in development.',teasers:['Adaptive cruise control','Driver assistance systems','Precise wheel geometry','Front and vehicle cameras','Modern vehicle lighting','Fault finding and inspection'],original:'The original Night Vision Service identity',photoNote:'Our own NVS workshop photograph will appear here.'}
};
const paths=[
 '<path d="M13 27h22l-3-8H16zM11 27v7h26v-7M15 34v3m18-3v3M18 30h1m10 0h1M17 13q7-6 14 0M12 8q12-10 24 0"/>',
 '<path d="m10 39 8-31m20 31L30 8M24 8v7m0 7v6m0 6v6M17 29h14l-2-7H19zM16 29v6h16v-6"/>',
 '<rect x="5" y="13" width="8" height="22" rx="2"/><rect x="35" y="13" width="8" height="22" rx="2"/><path d="M13 19h22M13 29h22M5 19h8m22 0h8M5 29h8m22 0h8M20 12l4-4 4 4m-4-4v9m-4 19 4 4 4-4m-4 4v-9"/>',
 '<path d="M9 16h8l3-5h8l3 5h8v23H9zM4 19v-7h7m26 0h7v7M4 37v7h7m26 0h7v-7"/><circle cx="24" cy="27" r="7"/>',
 '<path d="M25 12v24c10 0 17-4 17-12S35 12 25 12zM6 14h12M3 21h15M3 28h15M6 35h12"/>',
 '<rect x="5" y="8" width="38" height="29" rx="3"/><path d="M16 43h16m-8-6v6M10 25h7l4-9 6 17 4-10h7"/>'
];
export const serviceIcon=i=>`<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[i]}</svg>`;
export function heroTitle(title,focus){const at=title.indexOf(focus);return at<0?title:title.slice(0,at)+`<span class="hero-highlight">${focus}</span>`+title.slice(at+focus.length);}
export function bookingStrip(v){return `<a class="booking-strip" href="#booking"><span class="strip-icon" aria-hidden="true">${serviceIcon(0)}</span><span><strong>${v.stripTitle}</strong><small>${v.stripNote}</small></span><span class="strip-arrow" aria-hidden="true">↗</span></a>`;}

export const facebookCopy={hu:{official:"Hivatalos Facebook-oldalunk",references:"Műhelymunkák és referenciák a Facebookon",note:"A bejegyzések és fényképek a Facebookon, külső oldalon nyílnak meg."},ro:{official:"Pagina noastră oficială de Facebook",references:"Lucrări și referințe pe Facebook",note:"Postările și fotografiile se deschid pe Facebook, pe un site extern."},en:{official:"Our official Facebook page",references:"Workshop projects and references on Facebook",note:"Posts and photographs open on Facebook, an external website."}};
