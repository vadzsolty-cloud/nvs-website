# NVS – Facebook, hiteles cégadatok, Firebase időpontkérés

## Cégadatok

A tulajdonos által jelzett helyi mappában megtalált Certificat de inregistrare.PDF képi ellenőrzése és az ANAF nyilvános v9 szolgáltatásának 2026-11-15-i válasza alapján: NICHTVISION SERVICE S.R.L.; CUI 52237744; aktív TVA-regisztráció, ezért RO52237744; cégjegyzékszám J2025056583000; EUID ROONRC.J2025056583000; székhely Jud. Harghita, sat Văcărești, comuna Mihăileni, nr.244/A. A Night Vision Service márkanév megmarad. A hivatalos jogi névben szereplő NICHTVISION betűzést az ANAF igazolja. A tulajdonos megerősítette, hogy műhely és központ ugyanott található. Az eredeti PDF és a teljes ANAF-válasz nem nyilvános repoanyag. Törzstőke és alkalmazandó műhelyengedély nincs a kapott igazolásban; nem találunk ki adatot.

ANAF szolgáltatás: https://static.anaf.ro/static/10/Anaf/Informatii_R/Servicii_web/servicii_sincron.html

## Facebook

A főoldalon egyetlen kiemelt videólejátszó és egy élő Facebook-idővonal van, mindkettő csak Facebook-hozzájárulás után töltődik. A szolgáltatási oldalakon nincsenek további videólejátszók. A többi kártya saját, valódi NVS-fotóból, feliratból és márkajelölésből készült HTML/CSS-borítót kapott; nem első videóképkocka és nem generált referenciakép. A kártyák egyértelműen illusztrációként jelölik a saját műhelyfotót, nem állítják, hogy pontosan az adott autós munkáról származik.

Az új posztokat a Meta Page Plugin timeline mutatja a következő megnyitáskor; nincs saját Graph API másolat vagy jogosulatlan scraping. Az egyedi válogatott kártyák nem bővülnek automatikusan. A Meta bejelentkezési, régiós és nyilvánossági korlátozásai továbbra is számítanak; mindenütt eredeti Facebook-link marad. A beágyazott timeline saját képkockáit a Meta vezérli, nem a weboldal. Dokumentáció: https://developers.facebook.com/documentation/plugins/page-plugin

## Éles Firebase-erőforrások

Kizárólag új website erőforrások: nvswebsite codebase, nvsWebsiteApi és nvsWebsiteMail, europe-west1, Node22; dedikált nvs-website szolgáltatásfiók. API: https://europe-west1-night-vision-service.cloudfunctions.net/nvsWebsiteApi . A meglévő betaFeedback (us-central1) és a két eredeti repository változatlan. APK, automatikus frissítés és éles Firestore Rules nem módosult.

- Csak megerősített, nem tiltott Firebase-fiók; revocation ellenőrzés.
- Meglévő autótulajdon vagy jogosult céges tagság, csak ténylegesen NVS-hez rendelt jármű. A műhelyazonosító szerveroldalon rögzített és jóváhagyott státusza ellenőrzött.
- Nincs új profil-/autó-/shop-hozzárendelési írási API; a regisztráció és tulajdonosátadás az eredeti appban marad.
- Új webes kérés appointments alatt pending, source=web, capacityGuaranteed=false. Ez nem automatikus, garantált kapacitásfoglalás. Minden meglévő appos írási út átállítása nélkül nem ígérünk globális ütközésmentességet.
- Tranzakciós duplikációvédelem, idempotenciakulcs és 5 kérés/perc limit. Nincs kliens által választható shopId, ownerUid vagy státusz.
- A jelszó közvetlenül Firebase Authenticationhöz megy; a weboldal csak memóriában tartja a munkamenet ID tokenjét.
- A valóban telepített Firestore Rules csak olvasási auditja megtörtént: az ismeretlen gyűjteményeket záró szabály tiltja. Az új outbox és guard gyűjtemények kliensből nem írhatók; a backend Admin SDK-ja kifejezetten ellenőrzi a jogosultságokat. A rules fájl helyi auditpéldánya nem lett publikálva.

## Gmail és fennmaradó aktiválási lépés

Feladó és címzett: nightvisionservice2025@gmail.com. Gmail alkalmazásjelszó, smtp.gmail.com:465 TLS. A normál Gmail-jelszó nem használható. Új, érték nélküli Secret Manager-tároló: NVS_GMAIL_APP_PASSWORD. A felhasználó ide mentheti az alkalmazásjelszót: https://console.cloud.google.com/security/secret-manager/secret/NVS_GMAIL_APP_PASSWORD/versions?project=night-vision-service

A titok csak a dedikált szolgáltatásfióknak olvasható; nincs a repóban, HTML-ben, frontendkonfigurációban vagy naplóban. A booking-config.json Firebase apiKey mezője a Firebase által nyilvános böngészős konfigurációként kiadott kulcs, nem SMTP-titok vagy Admin kulcs.

A /health csak akkor ad bookingEnabled=true állapotot, ha a titok megvan, 16 karakteres alkalmazásjelszóként érvényes és az SMTP verify sikeres. Előtte a közvetlen kérésmentés MAIL_NOT_CONFIGURED hibával leáll, nem keletkezik félrevezető foglalás. Az online NVS-app linkje mindvégig működik. A titok mentése önmagában nem bizonyít kézbesítést: egyszeri, címzett által engedélyezett tesztlevél és valós ügyféllel egyeztetett próba szükséges az end-to-end igazoláshoz.

Az outbox neve nvsWebsiteMailOutbox. Legfeljebb öt próbálkozás után dead állapot, nincs végtelen alkalmazásszintű retry. A Gmail SMTP nem biztosít erős idempotencia-API-t; determinisztikus Message-ID és lease csökkenti a duplikációt, de send/ack üzemzavar esetén ismételt értesítés elméletileg lehetséges. Erre nem állítunk exactly-once garanciát. Az elutasított/kézbesíthetetlen outbox-elemeket az üzemeltetőnek felügyelnie kell.

## Telepítés és ellenőrzés

Telepítés a website repo backend könyvtárából, mindig ezzel a szűk hatókörrel: firebase deploy --config backend/firebase.json --only functions:nvswebsite --project night-vision-service --non-interactive --force . Nem futtatunk teljes projektdeployt vagy Rules-deployt. A --force az új retry policy CLI-megerősítése miatt szükséges; nem adatfelülírás.

A körben a hiányzó Eventarc receive jogosultságot a dedikált identitáson pótoltuk; a kézbesítési identitás csak a saját nvswebsitemail Cloud Run szolgáltatáson kapott invoker jogot. Az alapértelmezett Compute-fiók nem kapott új, tartós Eventarc jogot. Secret Manager API engedélyezve, a projektben a számlázás már eleve aktív volt. Az SDK a saját regionális artifact registryben 1 napos image cleanupot állított be.

Tesztelés: statikus/site tesztek, böngészős consent/layout, egyetlen videó/idővonal/borító ellenőrzése, natív UI teszt kizárólag szintetikus, interceptált Auth/booking hálózattal. A produkciós kérésmentő kódút külön emulátortesztet kapott (jogosultság, hamis mezők, notice, párhuzamos idempotencia, függő outbox). Éles ügyfélrekordot tesztből nem hoztunk létre.

A végleges jogi adatmegőrzési rend, törzstőke, alkalmazandó engedély és a Gmail-jelszó/tesztlevél ellenőrzése hiányában nem állítunk minden részletre kiterjedő jogi/üzemi készültséget.
