import {equipmentTopics,equipmentLabels,equipmentGuides} from './equipment-guides.mjs';
import {uiIcon} from './icons.mjs';
export const workshopCopy={
 hu:{
  label:'Műhelyünk',title:'Műhelyünk – Modern technológia, kompromisszumok nélküli precizitás',
  intro:'A modern autók intelligens rendszereket rejtenek. Mi rendelkezünk azzal a technológiával és szakértelemmel, amellyel megérthetjük, ellenőrizhetjük és szakszerűen javíthatjuk őket.',
  investment:'A Night Vision Service műhelyét úgy alakítottuk ki, hogy megfeleljen a mai és a jövő autóipari kihívásainak. Folyamatosan beruházunk a korszerű diagnosztikai eszközökbe, precíziós mérőberendezésekbe és professzionális szerviztechnológiákba.',
  equipmentTitle:'Technológia, amelyre büszkék vagyunk',equipmentIntro:'Műhelyünkben többek között az alábbi rendszerekkel dolgozunk:',
  equipment:[
   ['Autel MaxiSYS Ultra EV','Fejlett járműdiagnosztika, beleértve az elektromos és hibrid járművek rendszereinek vizsgálatát.'],
   ['ODIS gyári diagnosztika','A Volkswagen-csoport járműveinek professzionális diagnosztizálásához és szervizfunkcióihoz.'],
   ['MAHLE TechPRO Digital ADAS 2.0','Korszerű vezetéstámogató rendszerek, radarok és kamerák precíz kalibrálásához.'],
   ['3D futómű-geometriai mérőrendszer','A futómű pontos ellenőrzéséhez és beállításához.'],
   ['Futómű- és útszimulációs berendezés','A jármű viselkedésének és a futómű működésének részletes vizsgálatához.'],
   ['Professzionális fékhatásmérő berendezés','A fékrendszer teljesítményének és működésének ellenőrzéséhez.'],
   ['Korszerű fényszóró-ellenőrző rendszer','A hagyományos és modern világítástechnikai rendszerek pontos beállításához.']
  ],
  principle:'Nálunk a diagnosztika nem találgatás, hanem méréseken és adatokon alapuló szakmai munka.',
  approach:'Legyen szó összetett elektronikai hibáról, automata sebességváltóról, vezetéstámogató rendszerről vagy elektromos járműről, célunk minden esetben a hiba okának pontos feltárása és a megfelelő javítási megoldás megtalálása.',
  belief:'Hiszünk abban, hogy a minőségi autójavítás alapja a szaktudás, a megfelelő technológia és az apró részletekre fordított figyelem.',
  signature:'Night Vision Service – Nemcsak lépést tartunk az autóipar fejlődésével. Arra törekszünk, hogy mindig egy lépéssel előtte járjunk.'
 },
 ro:{
  label:'Atelierul nostru',title:'Atelierul nostru – Tehnologie modernă, precizie fără compromisuri',
  intro:'Automobilele moderne ascund sisteme inteligente. Dispunem de tehnologia și expertiza necesare pentru a le înțelege, verifica și repara în mod profesionist.',
  investment:'Am amenajat atelierul Night Vision Service pentru a răspunde provocărilor industriei auto de astăzi și de mâine. Investim permanent în echipamente moderne de diagnoză, aparatură de măsurare de precizie și tehnologii profesionale de service.',
  equipmentTitle:'Tehnologie cu care ne mândrim',equipmentIntro:'În atelierul nostru lucrăm, printre altele, cu următoarele sisteme:',
  equipment:[
   ['Autel MaxiSYS Ultra EV','Diagnoză auto avansată, inclusiv verificarea sistemelor vehiculelor electrice și hibride.'],
   ['Diagnoză de fabrică ODIS','Pentru diagnoza profesională și funcțiile de service ale vehiculelor din grupul Volkswagen.'],
   ['MAHLE TechPRO Digital ADAS 2.0','Pentru calibrarea precisă a sistemelor moderne de asistență la conducere, a radarelor și a camerelor.'],
   ['Sistem 3D pentru măsurarea geometriei roților','Pentru verificarea și reglarea precisă a geometriei roților.'],
   ['Echipament pentru testarea suspensiei și simularea condițiilor de drum','Pentru investigarea detaliată a comportamentului vehiculului și a funcționării suspensiei.'],
   ['Echipament profesional pentru măsurarea eficienței frânării','Pentru verificarea performanței și funcționării sistemului de frânare.'],
   ['Sistem modern de verificare a farurilor','Pentru reglarea precisă a sistemelor de iluminat convenționale și moderne.']
  ],
  principle:'La noi, diagnoza nu înseamnă presupuneri, ci muncă de specialitate bazată pe măsurători și date.',
  approach:'Fie că este vorba despre o defecțiune electronică complexă, o cutie de viteze automată, un sistem de asistență la conducere sau un vehicul electric, obiectivul nostru este întotdeauna identificarea exactă a cauzei și găsirea soluției de reparație potrivite.',
  belief:'Credem că o reparație auto de calitate are la bază cunoștințele de specialitate, tehnologia potrivită și atenția acordată celor mai mici detalii.',
  signature:'Night Vision Service – Nu doar ținem pasul cu evoluția industriei auto. Ne străduim să fim mereu cu un pas înainte.'
 },
 en:{
  label:'Our workshop',title:'Our workshop – Modern technology, uncompromising precision',
  intro:'Modern cars are built around intelligent systems. We have the technology and expertise to understand, inspect and professionally repair them.',
  investment:'We designed the Night Vision Service workshop to meet the automotive challenges of today and tomorrow. We continually invest in modern diagnostic tools, precision measuring equipment and professional service technologies.',
  equipmentTitle:'Technology we are proud of',equipmentIntro:'Our workshop uses the following systems, among others:',
  equipment:[
   ['Autel MaxiSYS Ultra EV','Advanced vehicle diagnostics, including the inspection of electric and hybrid vehicle systems.'],
   ['ODIS factory diagnostics','For professional diagnostics and service functions on Volkswagen Group vehicles.'],
   ['MAHLE TechPRO Digital ADAS 2.0','For precise calibration of modern driver assistance systems, radar sensors and cameras.'],
   ['3D wheel alignment measuring system','For precise inspection and adjustment of wheel geometry.'],
   ['Suspension testing and road simulation equipment','For detailed investigation of vehicle behaviour and suspension operation.'],
   ['Professional brake performance testing equipment','For checking the performance and operation of the braking system.'],
   ['Modern headlight testing system','For precise adjustment of conventional and modern vehicle lighting systems.']
  ],
  principle:'For us, diagnostics means professional work based on measurements and data, rather than guesswork.',
  approach:'Whether we are dealing with a complex electronic fault, an automatic transmission, a driver assistance system or an electric vehicle, our aim is always to identify the precise cause and find the right repair solution.',
  belief:'We believe that quality vehicle repairs start with expertise, the right technology and attention to the smallest details.',
  signature:'Night Vision Service – We do more than keep pace with the automotive industry. We strive to stay one step ahead.'
 }
};
export const generalWorkshop={
 hu:{title:'Általános szerviz és karbantartás',text:'Átvizsgálás, időszakos karbantartás és a mindennapi mechanikus, elektronikus hibák javítása.'},
 ro:{title:'Service general și întreținere',text:'Verificări, întreținere periodică și remedierea problemelor mecanice și electronice de zi cu zi.'},
 en:{title:'General servicing and maintenance',text:'Vehicle inspections, routine maintenance and repair of everyday mechanical and electronic faults.'}
};
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function workshopSection(lang,photo){
 const t=workshopCopy[lang],g=generalWorkshop[lang],labels=equipmentLabels[lang];
 const equipment=[...t.equipment,[g.title,g.text]];
 const cards=equipment.map(([name,description],i)=>{
  const topic=equipmentTopics[i],id=`equipment-${lang}-${topic}`,guide=equipmentGuides[lang][topic];
  return `<li><details class="equipment-card" data-equipment="${topic}"><summary aria-labelledby="${id}-title" aria-describedby="${id}-teaser"><span class="equipment-number" aria-hidden="true">${uiIcon(['diagnostic','car','target','wheel','suspension','brake','headlight','wrench'][i])}</span><span class="equipment-summary-copy"><span class="equipment-name" id="${id}-title">${esc(name)}</span><span class="equipment-teaser" id="${id}-teaser">${esc(description)}</span></span><span class="equipment-toggle" aria-hidden="true"><span class="equipment-expand">${uiIcon('plus')}</span><span class="equipment-collapse">${uiIcon('minus')}</span></span></summary><div class="equipment-explanation"><p><strong>${esc(labels.meaning)}</strong> ${esc(guide[0])}</p><p><strong>${esc(labels.when)}</strong> ${esc(guide[1])}</p></div></details></li>`;
 }).join('');
 return `<section id="about" class="section workshop-story" aria-labelledby="workshop-title"><div class="workshop-intro"><div class="about-photo">${photo}</div><div><p class="eyebrow">NIGHT VISION SERVICE / ${esc(t.label)}</p><h2 id="workshop-title">${esc(t.title)}</h2><p class="lead">${esc(t.intro)}</p><p>${esc(t.investment)}</p></div></div><div class="workshop-equipment"><h3>${esc(t.equipmentTitle)}</h3><p>${esc(t.equipmentIntro)}</p><p class="equipment-hint">${esc(labels.hint)}</p><ul class="equipment-list" role="list">${cards}</ul></div><div class="workshop-values"><p class="workshop-principle">${esc(t.principle)}</p><div><p>${esc(t.approach)}</p><p>${esc(t.belief)}</p></div></div><p class="workshop-signature">${esc(t.signature)}</p></section>`;
}
