# Tulajdonosi műhelyfotók

Alapesetben a tulajdonos valódi műhelyfotói használhatók. A korábban kizárt AI-jelölt képek továbbra is kizártak. A 2026-11-25-i kifejezett tulajdonosi kérés két, külön megjelölt szolgáltatási illusztrációra ad kivételt (lásd alább). A HU/RO/EN képleírásokat a media/photos.json tartalmazza; a méretek a src/photo-variants.json fájlban vannak.

## Kötelező rendszámvédelem

A tulajdonos 2026-11-21-i kérése szerint minden rendszámot ki kell takarni. Ellenőrizni kell a részleges rendszámokat, háttérjárműveket, tükröződéseket és a kijelzők kameranézeteit is. A rendszám helyét fedő, átlátszatlan maszk a JPEG forrásba és minden AVIF/WebP/JPEG változatba be van égetve; nagyításkor és közvetlen képmegnyitáskor is megmarad. A már publikált, javított képek új fizikai fájlnevet kaptak, logikai azonosítójuk és kiválasztott helyük változatlan. A régi, olvasható rendszámos webváltozatok törlendők az aktuális közzétett fájlkészletből.

A privacy mező dátummal és „masked” vagy „no-registration-visible” állapottal rögzíti a kézi ellenőrzést. A maszkolt képek régiói [bal, fent, jobb, lent] egész koordináták az eredeti pixelméretben. Az NVS feliratú bemutatótáblák nem forgalmi rendszámok.

A media/photo-privacy.json a források, az összes publikált képváltozat és az ellenőrzési adatok SHA-256 lenyomatát tartalmazza. A build ellenőrzi ezeket, az előírt méreteket és a fölösleges fájlokat. Új vagy megváltozott, nem ellenőrzött kép esetén leáll. Előző buildből maradt, nem engedélyezett képfájlokat kizárólag a checkouton belüli generált fotókönyvtárból távolít el.

Ez a védelem az aktuális saját webes képekre és az aktuális forrásfájlokra vonatkozik. Nem írja át a Git előzményeit és a külső Facebook-tartalmakat.

## Új képek előkészítése

1. Tekintsd meg minden eredeti teljes képét; jelöld a rendszámok összes régióját. Készíts ellenőrzési tervet egy figyelmen kívül hagyott helyi JSON fájlban.
2. A terv alakja: {photos:[{source:"helyi forrásútvonal",photo:{slug,original,position,tag:{hu,ro,en},alt:{hu,ro,en},privacy:{reviewedAt:"ÉÉÉÉ-HH-NN",registration:"masked",regions:[[x1,y1,x2,y2]]}}}],placements:{airConditioningSlides:["slug"],"serviceSlides.acc":["slug"]}}. Rendszám nélküli képnél registration: "no-registration-visible"; regions nem szükséges.
3. Futtasd Sharp elérhetőségével: node scripts/prepare-photos.cjs <ellenőrzési-terv.json>. A segédprogram csak új, kézzel ellenőrzött képeket vesz fel. Elutasítja az ismétlődő azonosítókat, forrásneveket és dekódolt képpontokat. A régi képek átnézését nem hagyja jóvá újra automatikusan.
4. Szemrevételezd a kész JPEG-et és a képméreteket; ellenőrizd, hogy sehol nem látszik rendszám. Futtasd az npm test és npm run build ellenőrzéseket, majd a böngészős regressziót.
5. Csak az előkészített media/originals, public/assets/photos és szöveges forrásfájlok kerüljenek a PR-ba. A nyers csatolmányok és az artifacts/private-photo-backups tartalma nem publikálható. A Sharp csak helyi előkészítési függőség; a buildhez nem szükséges.

## 2026-11-21-i képsorok és szolgáltatás

A korábbi 64 fotó teljes átnézése mellett 54 új kép került feldolgozásra: 11 váltóolajcsere, 12 ACC, 7 klíma és 24 futóműállítás. Két erősen hasonló felvétel kimaradt (1000141304.jpg a 1000141302.jpg mellett; 1000141229.jpg a 1000141231.jpg mellett). Egy képsoron belül minden fotó egyszer szerepel. A fotók alapállapota és a különböző gépkocsik felvételei nem keverednek más munkatípusok közé.

Az Audi maradt a Hunter szolgáltatás főfotója, az ACC főfotója továbbra is az eredetileg kiválasztott műhely-áttekintés. A váltóolajcsere külön főoldali képsort kapott. A klímatöltés és -javítás önálló HU/RO/EN szolgáltatási oldalon, főoldali kártyával érhető el. A meglévő foglalási szolgáltatásazonosítók, az alkalmazás és a backend nem változtak.

## A műhely külső főfotója

2026-11-21: 1000141397.jpg → workshop-exterior-main került a „Műhelyünk” bemutatkozó rész főképeként a szöveg mellé, mindhárom nyelven. A két jobb oldali autó rendszáma a forrásban és mind a hét webváltozatban fedett. A kártya 3:2 arányú, épületre igazított képkivágást mutat; nagyításkor a teljes álló fotó nyílik meg. Az előző műhelykép a katalógusban megmarad, az új fotó egyszer szerepel a főoldalon. A katalógus így 119 egyedi képet tartalmaz.

## Diagnosztikai képsor bővítése

2026-11-21: a tulajdonos kérésére a diagnosztika korábbi utolsó képe, az `adas-station` (IMG-20260816-WA0000.jpg) lett a nyitókép a főoldali szolgáltatásnál, a részletes képsorban. A képsor a már jóváhagyott katalógusból három további felvételt kapott: Audi utastér diagnosztikai laptoppal (1000141173.jpg), MAHLE diagnosztikai eredményképernyő (1000141265.jpg), illetve diagnosztikai laptop a Volkswagen mellett (1000141260.jpg). Mind a hat kép egyedi a képsoron belül; új képfájl, másolat vagy adatvédelmi felülvizsgálat nem keletkezett. A három felvétel korábbi Night Vision/ACC elhelyezése megmarad.

## 2026-11-25: szolgáltatási képek és kifejezett kivételek

A tulajdonos a Ford Mondeót (1000113223.jpg) választotta a gépi váltóolajcsere kártyájához és részletes oldalának nyitóképéhez. A beküldött képen AI-jelölés látszik; ezt a katalógus provenance mezője őrzi. A tulajdonos későbbi, 2026-11-25-i kérésére a külön webes AI-feliratot levettük a Ford kártyájáról és képaláírásáról; az eredeti kép saját jelölése változatlan marad.

A fékpados Audi külön, a tulajdonos kérésére generált illusztráció. Az ACC-kalibrálás helyszínének fotói a környezet referenciái; a kép nem bizonyítja az autó vagy a bemutatott fékpad tényleges jelenlétét. Nem kerül valódi ügyfélreferenciák közé. A kártyán és a részletes képen diszkrét „AI” jelölés, a nagyított képleírásban rövid „· AI” utótag szerepel. A képaláírás „Fékpadi fékerőmérés Audival”; a helyszínreferenciát nem említi nyilvános képleírásként. A készítési specifikáció: BRAKE-ILLUSTRATION.md.

A 1000119148.jpg és 1000114323.jpg további, egyedi váltóolajcsere-felvételek. A közel azonos Audi-nézeteket nem duplázzuk; a további két beküldött AI-jelölt Audi-kép nincs felvéve. A három váltós kép egyszer szerepel a részletes képsoron belül. Az új képek teljes szemrevételezésekor nem volt látható forgalmi rendszám: a Ford táblája üres, az Audikon nincs látható rendszám, a generált Audi táblája jelöletlen sötét felület. Minden új forrás és változat a meglévő adatvédelmi lenyomat-ellenőrzés alá tartozik.
