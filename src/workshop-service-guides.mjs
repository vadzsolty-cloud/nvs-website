import {content,ids} from './content.mjs';
import {serviceGuide} from './service-guides.mjs';

export const workshopGuides={
 hu:{
  'air-conditioning':{
   question:'Gyengén hűt a klíma – elég egyszerűen feltölteni?',
   intro:'A kellemes utastéri hőmérséklethez a teljes klímarendszer összehangolt működése szükséges. A hűtőközeg mennyisége mellett a tömítettség, a hőcserélők, a kompresszor és a vezérlés állapota is számít. A klímaszervizt ezért a tapasztalt jelenség tisztázásával kezdjük.',
   fact:'A hűtőközeg típusa és előírt töltési mennyisége járművenként eltérhet. A töltést az autó adataihoz igazítjuk; a berendezés nem helyettesíti a hiba okának felderítését.',
   systems:[['Hibafeltárás és tömítettség','Gyenge vagy időszakos hűtésnél áttekintjük a rendszer működését és a szükséges ellenőrzéseket.'],['Klímatöltés TEXA berendezéssel','A járműhöz megfelelő hűtőközeggel és az előírt mennyiség figyelembevételével dolgozunk.'],['Javítás és működésellenőrzés','A feltárt hibához igazodó javítást egyeztetjük, és a munka után ellenőrizzük a hűtést.']],
   when:['Ha a megszokottnál gyengébben vagy csak időnként hűt.','Ha a korábbi töltés után rövid időn belül újra romlik a teljesítmény.','Klímaalkatrész cseréje vagy a rendszer megbontása után.'],
   steps:[['Előzmények és azonosítás','Megkérdezzük, mikor jelentkezik a hiba, és azonosítjuk a jármű klímarendszerét.'],['Ellenőrzés és egyeztetés','Áttekintjük a szükséges vizsgálatokat, az esetleges javítást és a töltés feltételeit.'],['Szerviz és visszaellenőrzés','Elvégezzük az egyeztetett munkát, majd ellenőrizzük a rendszer működését.']],
   faq:[['Minden gyengén hűtő klímán a töltés segít?','Nem feltétlenül. Szivárgás, kompresszor-, vezérlési vagy légáramlási probléma is okozhatja. A megfelelő munkát a vizsgálat alapján választjuk ki.'],['Milyen hűtőközeg kell az autómba?','A jármű adattáblája és gyártói adatai alapján azonosítjuk. A különböző hűtőközegek nem cserélhetők fel tetszőlegesen.'],['Mit mondjak el időpontkéréskor?','Az autó típusát, évjáratát, a hűtési panaszt és a korábbi klímajavítások vagy töltések előzményeit.']],related:['diagnostics']
  },
  'automatic-transmission-oil':{
   question:'Miért számít az olaj és a csereeljárás az automata váltóban?',
   intro:'Az automata váltó olaja a kenés mellett a hőelvezetésben és – a váltó felépítésétől függően – a hidraulikus működésben is részt vesz. A szervizt a váltó pontos típusához és állapotához igazítjuk. Speciális olajcsere-berendezésünk a megfelelő gépi eljárás végrehajtását segíti.',
   fact:'Az „automata váltó” többféle konstrukciót takar. Az olaj, a szűrő, az olajteknő és a feltöltési eljárás is eltérhet; a gépi csere alkalmazhatóságát mindig az adott váltó alapján döntjük el.',
   systems:[['Olaj és gyári előírás','Azonosítjuk a váltót, és a hozzá előírt specifikáció alapján választjuk ki az olajat.'],['Gépi olajcsere','A megfelelő váltóknál professzionális célberendezéssel végezzük a cserét, az egyeztetett eljárás szerint.'],['Szűrő, olajteknő és tömítések','A konstrukciótól függő alkatrészcserét és a szükséges kiegészítő munkákat előre egyeztetjük.']],
   when:['Ha elérkezett a gyártó által meghatározott karbantartás.','Ha nem ismert a váltóolajcsere előzménye.','Ha változott a kapcsolás vagy a váltó működése; ilyenkor előbb a panaszt vizsgáljuk ki.'],
   steps:[['Váltó és előzmények','Azonosítjuk a típust, átbeszéljük a futásteljesítményt, a korábbi szervizt és az esetleges panaszt.'],['A megfelelő szerviz kiválasztása','Egyeztetjük az olajat, a szükséges alkatrészeket, a csere módját és a munka terjedelmét.'],['Csere és végellenőrzés','Elvégezzük az egyeztetett munkát, és az adott váltó előírásai szerint ellenőrizzük az olajszintet, illetve a tömítettséget.']],
   faq:[['Minden automata váltón ugyanazt a gépi cserét végzitek?','Nem. A hagyományos automata, a duplakuplungos és más váltók karbantartási eljárásai eltérhetnek. Előzetesen azonosítjuk a váltót.'],['Megszünteti az olajcsere a rángatást?','Erre vizsgálat nélkül nem lehet ígéretet tenni. A panasz oka lehet olajjal összefüggő, de mechanikus vagy vezérlési hiba is.'],['Hány kilométerenként érdemes cserélni?','Az adott váltó gyártói előírása, használata és szervizelőzménye alapján egyeztetünk; nincs minden autóra érvényes egyetlen szám.']],related:['diagnostics','hunter-3d']
  },
  'brake-testing':{
   question:'Egyformán fékez a két oldal? A fékpad megmutatja.',
   intro:'A fékpadi mérés számszerű képet ad a kerekek fékerejéről. Saját fékpadunkkal összehasonlíthatóvá válik a két oldal működése, és a mért eltérések segítenek meghatározni a további vizsgálat irányát. A mérési eljárást a jármű hajtásrendszeréhez igazítjuk.',
   fact:'A vezető által tapasztalt fékhatás önmagában nem mutatja meg, hogyan oszlik meg a fékerő az egyes kerekek között. A padon mért adatok ezt az összehasonlítást teszik lehetővé.',
   systems:[['Fékerő mérése','A fékpadon mérjük a vizsgált kerekek fékerejét és áttekintjük az eredményeket.'],['Oldalak közötti eltérés','Összevetjük az azonos tengely két oldalát, és értékeljük a mérés során tapasztalt különbségeket.'],['Állapotfelmérés és utóellenőrzés','Fékkel kapcsolatos panasz kivizsgálásához vagy javítás utáni ellenőrzéshez is egyeztethető mérés.']],
   when:['Ha fékezéskor eltérést, félrehúzást vagy szokatlan viselkedést tapasztalsz.','Fékjavítás utáni ellenőrzéshez.','Ha szeretnél mért adatokat a fékrendszer működéséről egy állapotfelmérés részeként.'],
   steps:[['Jármű és mérési feltételek','Azonosítjuk a hajtásrendszert, és kiválasztjuk a járműhöz illő mérési módot.'],['Mérés a fékpadon','Elvégezzük az egyeztetett fékerőmérést, és összevetjük a kapott értékeket.'],['Érthető eredmény','Elmondjuk, mit mutatott a mérés, és milyen további vizsgálatot vagy javítást tartunk indokoltnak.']],
   faq:[['Összkerékhajtású vagy elektromos autóval is kérhetek időpontot?','Időpontkéréskor mondd el a pontos típust és hajtást. A mérés feltételeit és a szükséges üzemmódot az adott jármű gyártói eljárása alapján egyeztetjük.'],['Minden fékhiba kimutatható egy fékpadi méréssel?','A mérés a fékerőről ad adatot. A zaj, a rezgés vagy egy időszakos panasz okának feltárásához további vizsgálat is szükséges lehet.'],['Mérés után rögtön javítás következik?','Az eredményeket előbb átbeszéljük. A szükséges további munkát és annak feltételeit külön egyeztetjük.']],related:['diagnostics','hunter-3d']
  }
 },
 ro:{
  'air-conditioning':{
   question:'Climatizarea răcește slab – este suficientă o încărcare?',
   intro:'Confortul din habitaclu depinde de funcționarea întregului sistem. Pe lângă cantitatea de agent frigorific, contează etanșeitatea, schimbătoarele de căldură, compresorul și comanda electronică. Începem prin a înțelege problema observată.',
   fact:'Tipul și cantitatea de agent frigorific pot diferi de la un vehicul la altul. Încărcarea se adaptează datelor mașinii; aparatul nu înlocuiește identificarea cauzei defecțiunii.',
   systems:[['Identificarea defecțiunii și etanșeitate','Analizăm funcționarea și verificările necesare când răcirea este slabă sau intermitentă.'],['Încărcare cu echipament TEXA','Folosim agentul frigorific potrivit și cantitatea prevăzută pentru vehicul.'],['Reparații și verificare','Stabilim reparația potrivită problemei și verificăm răcirea după lucrare.']],
   when:['Când răcirea este mai slabă decât de obicei sau apare doar uneori.','Când performanța scade din nou la scurt timp după o încărcare.','După înlocuirea unei componente sau deschiderea circuitului de climatizare.'],
   steps:[['Istoric și identificare','Discutăm când apare problema și identificăm sistemul de climatizare.'],['Verificare și stabilirea lucrării','Analizăm verificările, eventualele reparații și condițiile necesare încărcării.'],['Service și control final','Efectuăm lucrarea convenită și verificăm funcționarea sistemului.']],
   faq:[['Încărcarea rezolvă orice răcire insuficientă?','Nu neapărat. Pot exista pierderi, probleme de compresor, comandă sau circulație a aerului. Alegem lucrarea după verificare.'],['Ce agent frigorific folosește mașina mea?','Îl identificăm din eticheta vehiculului și datele producătorului. Agenții frigorifici nu se înlocuiesc arbitrar între ei.'],['Ce informații sunt utile la programare?','Modelul, anul, problema de răcire și istoricul încărcărilor sau reparațiilor anterioare.']],related:['diagnostics']
  },
  'automatic-transmission-oil':{
   question:'De ce contează uleiul și procedura la o cutie automată?',
   intro:'Uleiul contribuie la lubrifiere, evacuarea căldurii și, în funcție de construcție, la funcționarea hidraulică a transmisiei. Adaptăm service-ul tipului și stării cutiei. Aparatul specializat ne ajută să executăm procedura de schimb potrivită.',
   fact:'Denumirea de „cutie automată” acoperă construcții diferite. Uleiul, filtrul, baia și procedura de umplere pot varia; stabilim pentru fiecare cutie dacă schimbul cu aparat este potrivit.',
   systems:[['Ulei și cerințe ale producătorului','Identificăm transmisia și alegem uleiul după specificația prevăzută.'],['Schimb cu aparat dedicat','La transmisiile potrivite, efectuăm schimbul cu echipament profesional și procedura convenită.'],['Filtru, baie și etanșări','Stabilim în prealabil piesele și lucrările suplimentare necesare construcției respective.']],
   when:['Când este scadentă întreținerea indicată de producător.','Când istoricul schimburilor de ulei nu este cunoscut.','Când se modifică schimbarea treptelor sau comportamentul cutiei; investigăm întâi problema.'],
   steps:[['Identificare și istoric','Stabilim tipul cutiei, kilometrajul, întreținerea anterioară și eventualele simptome.'],['Alegerea service-ului potrivit','Convenim uleiul, piesele, metoda de schimb și amploarea lucrării.'],['Schimb și control final','Efectuăm lucrarea și verificăm nivelul și etanșeitatea conform procedurii transmisiei.']],
   faq:[['Folosiți aceeași procedură pentru orice cutie automată?','Nu. Cutiile automate clasice, cele cu dublu ambreiaj și alte construcții pot necesita întreținere diferită. Identificăm mai întâi transmisia.'],['Schimbul de ulei elimină smuciturile?','Nu putem promite fără verificare. Cauza poate ține de ulei, dar și de mecanică sau comandă.'],['La câți kilometri se schimbă uleiul?','Stabilim pe baza cerințelor producătorului, utilizării și istoricului. Nu există o singură valoare valabilă pentru toate mașinile.']],related:['diagnostics','hunter-3d']
  },
  'brake-testing':{
   question:'Frânează la fel cele două părți? Standul poate arăta diferența.',
   intro:'Măsurarea pe stand oferă valori pentru forța de frânare a roților. Standul propriu permite compararea celor două părți, iar diferențele măsurate ajută la alegerea verificărilor următoare. Adaptăm procedura sistemului de tracțiune al vehiculului.',
   fact:'Senzația de frânare nu arată singură cum se distribuie forța între roți. Valorile măsurate pe stand permit această comparație.',
   systems:[['Măsurarea forței','Măsurăm forțele roților verificate și analizăm rezultatele.'],['Diferențe între părți','Comparăm cele două părți ale aceleiași axe și evaluăm diferențele observate.'],['Evaluare și control după reparație','Măsurarea poate fi convenită pentru investigarea unei probleme sau pentru verificarea unei reparații.']],
   when:['Când mașina trage într-o parte sau se comportă neobișnuit la frânare.','Pentru control după reparații la frâne.','Când dorești date măsurate despre frânare în cadrul unei evaluări a stării mașinii.'],
   steps:[['Vehicul și condiții de măsurare','Identificăm tracțiunea și alegem modul de testare potrivit.'],['Măsurare pe stand','Efectuăm măsurarea convenită și comparăm valorile obținute.'],['Rezultate explicate','Explicăm ce arată măsurarea și ce verificări sau reparații recomandăm.']],
   faq:[['Pot solicita o programare pentru o mașină electrică sau cu tracțiune integrală?','Comunică modelul exact și tracțiunea. Stabilim condițiile și modul de testare conform procedurii producătorului.'],['Standul identifică orice problemă a frânelor?','Măsurarea oferă date despre forțele de frânare. Zgomotele, vibrațiile sau problemele intermitente pot necesita verificări suplimentare.'],['Urmează automat o reparație?','Discutăm întâi rezultatele. Convenim separat lucrările suplimentare și condițiile lor.']],related:['diagnostics','hunter-3d']
  }
 },
 en:{
  'air-conditioning':{
   question:'Weak air conditioning – is a recharge enough?',
   intro:'Cabin comfort depends on the whole system working together. Refrigerant quantity matters alongside leak tightness, heat exchangers, the compressor and electronic control. We start by understanding the problem you have noticed.',
   fact:'Refrigerant type and specified charge can differ between vehicles. We match the service to the vehicle’s data; the machine does not replace finding the cause of a fault.',
   systems:[['Fault finding and leak tightness','We review operation and the checks needed when cooling is weak or intermittent.'],['Recharging with TEXA equipment','We use the correct refrigerant and specified quantity for the vehicle.'],['Repair and operation checks','We agree a repair for the fault found and check cooling after the work.']],
   when:['When cooling is weaker than usual or works only intermittently.','When performance drops again soon after a recharge.','After a component replacement or opening the air-conditioning circuit.'],
   steps:[['History and identification','We discuss when the problem occurs and identify the vehicle’s system.'],['Checks and an agreed scope','We review the checks, possible repairs and conditions required for recharging.'],['Service and final checks','We complete the agreed work and check system operation.']],
   faq:[['Will recharging fix every cooling problem?','Not necessarily. Leaks, compressor or control faults and airflow problems can also affect cooling. We choose the work after inspection.'],['Which refrigerant does my car need?','We identify it from the vehicle label and manufacturer data. Different refrigerants cannot simply be substituted for one another.'],['What should I tell you when booking?','The model, year, cooling problem and any previous recharges or repairs.']],related:['diagnostics']
  },
  'automatic-transmission-oil':{
   question:'Why do the oil and service procedure matter in an automatic transmission?',
   intro:'Transmission oil contributes to lubrication, heat removal and, depending on the design, hydraulic operation. We match the service to the transmission type and condition. Our dedicated machine helps carry out the appropriate oil-change procedure.',
   fact:'“Automatic transmission” covers several designs. Oil, filters, pans and filling procedures can differ; we establish whether machine-assisted servicing is suitable for the particular transmission.',
   systems:[['Oil and manufacturer requirements','We identify the transmission and select oil to its required specification.'],['Dedicated oil-change equipment','For suitable transmissions, we use professional equipment and the agreed service procedure.'],['Filter, pan and seals','We agree design-specific replacement parts and any additional work in advance.']],
   when:['When manufacturer-specified maintenance is due.','When the oil-service history is unknown.','When shifting or operation changes; we investigate the concern first.'],
   steps:[['Transmission and history','We identify the unit and discuss mileage, previous maintenance and any symptoms.'],['Choosing the right service','We agree the oil, parts, change method and scope of work.'],['Service and final checks','We complete the work and check oil level and leak tightness using the transmission-specific procedure.']],
   faq:[['Do you use the same procedure for every automatic transmission?','No. Conventional automatics, dual-clutch units and other designs can have different service requirements. We identify the transmission first.'],['Will an oil change cure jerky shifts?','That cannot be promised without investigation. The cause may relate to oil, but it can also be mechanical or electronic.'],['What mileage interval should I follow?','We discuss the manufacturer requirements, use and maintenance history. There is no single interval that applies to every vehicle.']],related:['diagnostics','hunter-3d']
  },
  'brake-testing':{
   question:'Do both sides brake equally? The test bench makes differences visible.',
   intro:'A brake test provides measured values for wheel braking forces. Our own test bench lets us compare the two sides, helping identify the direction of any further investigation. We match the procedure to the vehicle’s drivetrain.',
   fact:'The way braking feels does not by itself show how force is distributed between individual wheels. Test-bench readings make that comparison possible.',
   systems:[['Brake force measurement','We measure the tested wheels’ braking forces and review the results.'],['Side-to-side differences','We compare the two sides of the same axle and assess differences observed during testing.'],['Condition and post-repair checks','Testing can be agreed as part of investigating a concern or checking work after a repair.']],
   when:['When the vehicle pulls or behaves unusually while braking.','For checks after brake repairs.','When you want measured braking data as part of a vehicle condition check.'],
   steps:[['Vehicle and test conditions','We identify the drivetrain and select the appropriate test mode.'],['Test-bench measurement','We carry out the agreed brake force test and compare the readings.'],['An understandable result','We explain the findings and which further checks or repairs we recommend.']],
   faq:[['Can I enquire about an electric or all-wheel-drive vehicle?','Tell us the exact model and drivetrain. We agree the test conditions and mode using the manufacturer’s procedure for that vehicle.'],['Can the bench identify every brake fault?','It provides brake force readings. Noise, vibration or intermittent symptoms may need further investigation.'],['Does testing automatically lead to a repair?','We discuss the results first. Any additional work and its terms are agreed separately.']],related:['diagnostics','hunter-3d']
  }
 }
};

export const workshopGuideSources={
 'air-conditioning':[['TEXA · KONFORT','https://www.texa.ie/solutions/a-c-system/']],
 'automatic-transmission-oil':[['ZF · Transmission oil service','https://aftermarket.zf.com/sg/aftermarket-portal/for-workshops/useful-tips/transmission-oil-change-pc/'],['ZF · Oil and service kits','https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/oil-oil-change-kits/']],
 'brake-testing':[['MAHA · Roller brake testing principles','https://www.maha.de/restriction/check-asset/support_documents/dokumente/Betriebsanleitungen/01%20Bremspr%C3%BCftechnik/CONNECT%20SERIES/BA023001-en.pdf']]
};
export function workshopServiceGuide(l,id){return serviceGuide(l,id,{ids,names:content[l].names,guide:workshopGuides[l][id],sources:workshopGuideSources[id]});}
