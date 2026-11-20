export const equipmentTopics=['autel','odis','adas','alignment','suspension','brakes','headlights','general'];
export const equipmentLabels={
 "hu": {
  "meaning": "Mit jelent?",
  "when": "Mikor hasznos?",
  "hint": "Nyisd le a kártyákat, és ismerd meg, mire használjuk ezeket a műhelyben."
 },
 "ro": {
  "meaning": "Ce înseamnă?",
  "when": "Când este util?",
  "hint": "Deschide cardurile și descoperă cum folosim aceste echipamente și servicii în atelier."
 },
 "en": {
  "meaning": "What does it mean?",
  "when": "When is it useful?",
  "hint": "Open a card to discover how we use this equipment and these services in the workshop."
 }
};
// Customer explanations for the equipment already confirmed by the owner.
export const equipmentGuides={
 "hu": {
  "autel": [
   "A diagnosztikai eszköz az autó vezérlőegységeinek hibakódjait és működési adatait segít értelmezni. Ezeket az ellenőrző mérésekkel együtt használjuk a hiba okának feltárásához, elektromos és hibrid járművek rendszereinél is.",
   "Hibajelző lámpánál, időszakos működési zavarnál vagy elektronikai hiba keresésekor. Az elérhető vizsgálatok az autó típusától és rendszerétől függnek."
  ],
  "odis": [
   "Az ODIS a Volkswagen-csoport járműveihez készült diagnosztikai szoftver. A vezérlőegységek adatait és a típushoz tartozó diagnosztikai funkciókat használjuk, a szükséges műveleteket a gyártó eljárásaihoz igazítva.",
   "Volkswagen, Audi, Škoda vagy SEAT járművek hibafeltárásánál és megfelelő szervizműveleteinél. A pontos lehetőségeket az adott autó és feladat alapján ellenőrizzük."
  ],
  "adas": [
   "Az ADAS a vezetéstámogató rendszerek gyűjtőneve. Kamerák és radarok segíthetik például a sávtartást vagy a követési távolság szabályozását. Kalibráláskor az érzékelők járműhöz viszonyított helyzetét a gyári eljárás szerint állítjuk be.",
   "Szélvédőcsere, érzékelő körüli javítás vagy bizonyos futóműmunkák után, amikor a gyártó előírja; illetve vezetéstámogató hibajelzés kivizsgálásakor."
  ],
  "alignment": [
   "A 3D mérőrendszer a kerekek helyzetét és a futómű szögeit, például az összetartást és a kerékdőlést ellenőrzi. A mérési eredményeket a jármű előírt értékeivel vetjük össze, majd az állítható pontokat ennek megfelelően korrigáljuk.",
   "Ha az autó félrehúz, a kormány nem áll középen vagy egyenetlen a gumikopás, továbbá futóműjavítás után. A kopott alkatrészeket a beállítás előtt is ellenőrizni kell."
  ],
  "suspension": [
   "A rugók, lengéscsillapítók és a futómű kapcsolódó elemei együtt befolyásolják a stabilitást és az úttartást. A berendezés ellenőrzött körülmények között segít vizsgálni a futómű reakcióját; a mért viselkedést a mechanikus átvizsgálással együtt értékeljük.",
   "Szokatlan rázkódásnál, bizonytalan úttartásnál vagy futóműpanaszoknál. Az eredmények megmutathatják, hol szükséges további részletes vizsgálat."
  ],
  "brakes": [
   "A fékhatásmérés megmutatja, milyen fékezőerőt fejtenek ki az egyes kerekek, és van-e számottevő eltérés egy tengely két oldala között. A mérési eredményt a fékrendszer állapotának ellenőrzésével együtt értékeljük.",
   "Fékkel kapcsolatos panaszok kivizsgálásakor, javítás utáni ellenőrzésnél vagy állapotfelmérés részeként. A szükséges munkát az eredmények alapján egyeztetjük."
  ],
  "headlights": [
   "A fényszóró beállítása a fénykéve irányának, magasságának és vetítési képének ellenőrzését jelenti. A megfelelő beállítás segíti az út megvilágítását és a szembejövők vakításának csökkentését. Egyes LED- és Matrix-rendszereknél diagnosztikai eljárás is szükséges.",
   "Lámpacsere vagy kapcsolódó javítás után, illetve ha rövidnek, ferdének vagy szokatlannak tűnik a megvilágított útszakasz. A műveletet a jármű rendszeréhez igazítjuk."
  ],
  "general": [
   "A korszerű mérőberendezések mellett a mindennapi szervizmunkákat is elvégezzük: időszakos karbantartás, olaj- és szűrőcsere, fék- és futóműjavítás, valamint mechanikus és elektronikus hibák feltárása.",
   "Esedékes karbantartásnál, használt autó állapotfelmérésénél vagy új zaj, rezgés, működési hiba megjelenésekor. Az átvizsgálás után érthetően elmondjuk, milyen munkát és miért javaslunk."
  ]
 },
 "ro": {
  "autel": [
   "Aparatul de diagnoză ajută la interpretarea codurilor de eroare și a datelor de funcționare ale unităților de comandă. Le corelăm cu măsurătorile de verificare pentru a identifica sursa problemei, inclusiv în sistemele vehiculelor electrice și hibride.",
   "La aprinderea unui martor, defecțiuni intermitente sau probleme electronice. Verificările disponibile depind de modelul și sistemul vehiculului."
  ],
  "odis": [
   "ODIS este software-ul de diagnoză pentru vehiculele grupului Volkswagen. Folosim datele unităților de comandă și funcțiile de diagnoză specifice modelului, adaptând operațiunile la procedurile producătorului.",
   "La investigarea defecțiunilor și efectuarea operațiunilor de service potrivite pentru Volkswagen, Audi, Škoda sau SEAT. Posibilitățile exacte se verifică pentru mașina și lucrarea respectivă."
  ],
  "adas": [
   "ADAS înseamnă sisteme de asistență la conducere. Camerele și radarele pot ajuta la menținerea benzii sau a distanței față de vehiculul din față. Calibrarea stabilește poziția senzorilor față de mașină conform procedurii producătorului.",
   "După înlocuirea parbrizului, reparații în zona senzorilor ori anumite lucrări la suspensie, când producătorul o cere; sau la investigarea avertizărilor ADAS."
  ],
  "alignment": [
   "Sistemul 3D verifică poziția roților și unghiurile geometriei, precum convergența și căderea. Comparăm măsurătorile cu valorile prescrise pentru vehicul și corectăm punctele care permit reglaj.",
   "Dacă mașina trage într-o parte, volanul nu este centrat sau anvelopele se uzează neuniform, precum și după reparații la suspensie. Componentele uzate trebuie verificate înaintea reglajului."
  ],
  "suspension": [
   "Arcurile, amortizoarele și celelalte componente ale suspensiei influențează stabilitatea și contactul cu drumul. Echipamentul permite verificarea reacțiilor suspensiei în condiții controlate; interpretăm măsurătorile împreună cu inspecția mecanică.",
   "La vibrații neobișnuite, comportament instabil sau alte probleme ale suspensiei. Rezultatele pot indica unde este necesară o investigație suplimentară."
  ],
  "brakes": [
   "Măsurarea eficienței frânării arată forța de frânare dezvoltată la fiecare roată și eventualele diferențe importante între cele două părți ale unei punți. Interpretăm rezultatul împreună cu verificarea stării sistemului de frânare.",
   "La investigarea problemelor de frânare, la verificarea după reparație sau ca parte a unei evaluări a stării mașinii. Stabilim lucrările necesare pe baza rezultatelor."
  ],
  "headlights": [
   "Reglarea farurilor presupune verificarea direcției, înălțimii și formei fasciculului luminos. Un reglaj corect ajută la iluminarea drumului și la reducerea orbirii celor care vin din sens opus. Unele sisteme LED și Matrix necesită și o procedură de diagnoză.",
   "După înlocuirea farurilor sau reparații asociate, ori când zona iluminată pare prea scurtă, înclinată sau neobișnuită. Adaptăm procedura la sistemul mașinii."
  ],
  "general": [
   "Pe lângă echipamentele moderne de măsurare, efectuăm lucrările obișnuite de service: întreținere periodică, schimb de ulei și filtre, reparații la frâne și suspensie, precum și identificarea defecțiunilor mecanice și electronice.",
   "La întreținerea scadentă, evaluarea unei mașini second-hand sau apariția unui zgomot, a unei vibrații ori a unei probleme de funcționare. După verificare explicăm clar ce lucrări recomandăm și de ce."
  ]
 },
 "en": {
  "autel": [
   "The diagnostic tool helps interpret fault codes and operating data from the vehicle’s control units. We combine these with verification measurements to investigate the cause, including in electric and hybrid vehicle systems.",
   "For warning lights, intermittent faults or electronic problems. Available checks depend on the vehicle model and system."
  ],
  "odis": [
   "ODIS is diagnostic software for Volkswagen Group vehicles. We use control-unit information and model-specific diagnostic functions, following the manufacturer’s procedures for the work required.",
   "For fault investigation and appropriate service operations on Volkswagen, Audi, Škoda or SEAT vehicles. The exact functions are checked for the individual vehicle and job."
  ],
  "adas": [
   "ADAS means advanced driver assistance systems. Cameras and radar sensors may support functions such as lane keeping or following-distance control. Calibration establishes the sensors’ relationship to the vehicle according to the manufacturer’s procedure.",
   "After windscreen replacement, repairs around sensors or certain suspension work when specified by the manufacturer, or when investigating driver assistance warnings."
  ],
  "alignment": [
   "The 3D system measures wheel positions and alignment angles, including toe and camber. We compare the measurements with the vehicle’s specified values and correct the points that allow adjustment.",
   "When the car pulls to one side, the steering wheel is off-centre or tyre wear is uneven, and after suspension repairs. Worn components also need checking before adjustment."
  ],
  "suspension": [
   "Springs, dampers and related suspension components work together to influence stability and road holding. The equipment helps assess suspension responses under controlled conditions; we interpret the measurements alongside a mechanical inspection.",
   "For unusual vibration, unsettled handling or other suspension concerns. The results can help identify where further investigation is needed."
  ],
  "brakes": [
   "Brake performance testing measures the braking force at individual wheels and highlights significant differences between the two sides of an axle. We assess the readings alongside a check of the braking system’s condition.",
   "When investigating braking concerns, checking completed repairs or assessing the vehicle’s condition. We agree any necessary work on the basis of the findings."
  ],
  "headlights": [
   "Headlight adjustment checks the direction, height and pattern of the light beam. Correct aiming helps illuminate the road and reduce glare for oncoming drivers. Some LED and Matrix systems also require a diagnostic procedure.",
   "After lamp replacement or related repairs, or when the illuminated area appears too short, uneven or unusual. The procedure is matched to the vehicle’s lighting system."
  ],
  "general": [
   "Alongside advanced measuring equipment, we carry out everyday servicing: routine maintenance, oil and filter changes, brake and suspension repairs, and investigation of mechanical and electronic faults.",
   "For scheduled maintenance, a used-car condition assessment, or a new noise, vibration or operating problem. After inspection, we clearly explain what work we recommend and why."
  ]
 }
};
