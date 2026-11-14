# Későbbi Firebase-integráció – megvalósítási terv

Ez terv, nem telepített integráció. Az első webes verzió sem Firebase SDK-t, sem konfigurációt, sem hálózati mentési vagy e-mail-hívást nem tartalmaz. A jelenlegi alkalmazás és éles infrastruktúra változatlan maradt. Kiindulópont: [SOURCE-AUDIT.md](SOURCE-AUDIT.md).

## 1. Integráció előtti ellenőrzés

Tulajdonossal igazolni kell az NVS tényleges Firebase project ID-ját, a szolgáltató `shopId`-ját, Auth providereit, hitelesítési domaineket, e-mail action URL-eket, Firestore-indexeket, telepített szabályokat, foglalási folyamat minden appos írási útját és az esetleges más rendszerben működő e-mail szolgáltatást. Ehhez nincs szükség ügyféladatok exportálására. A repositoryban lévő szabályjavaslatot nem szabad élesnek tekinteni vagy automatikusan telepíteni.

Előbb izolált Firebase Emulator Suite / külön tesztprojekt, kizárólag szintetikus tesztadatokkal. A production projektazonosító nem lehet alapértelmezés a tesztben. Az első integráció külön feature flag mögött és külön webes fejlesztői ágon készüljön. Éles bekötés és minden szükséges appváltozás új, külön jóváhagyott feladat.

## 2. Közös ügyfélfiók

A web ugyanahhoz a jóváhagyott Firebase Auth projekthez kapcsolódjon, hogy az UID appban és weben azonos maradjon. Meglévő felhasználó bejelentkezik, nem kap második fiókot. Elfelejtett jelszóhoz szabványos reset; provider-ütközésnél biztonságos account linking, nem puszta e-mail egyezés alapján történő összekapcsolás.

Regisztráció csak kifejezett ügyfélműveletre: a felületen világosan szerepeljen, hogy NVS-fiók jön létre, és milyen adat szükséges. Kötelező szolgáltatási/adatkezelési tájékoztatás és külön, alapból üres, opcionális marketing checkbox. A marketing elutasítása nem akadályozhatja a foglalást. E-mail megerősítés szükséges; a szerver a friss ID token `email_verified` állapotát ellenőrizze. Újraküldés legyen korlátozott, lejárt linknek érthető hiba és folytatás. Jelszavak kizárólag Auth felé kerüljenek, naplóba és Firestore-ba soha.

A jelenlegi regisztráció járműhöz és esetenként céghez kötött. Weben ugyanazt az ownership/registry/átadási szabályt kell követni; rendszám alapján nem rendelhető más tulajdonos autója a felhasználóhoz. A profil, első autó és regisztráció létrehozása legyen idempotens és megszakítás után folytatható. Az NVS-hez rendeléshez ellenőrzött műhelyazonosító és jóváhagyott üzleti folyamat szükséges; önkényes `shopId` választás nem engedhető.

## 3. Közös adatmodell és kompatibilitás

Megőrzendő gyűjtemények: `customerRegistrations/{uid}`, `cars/{carId}`, `shops/{shopId}`, `appointments/{appointmentId}`; céges esetben meglévő tagságok. A foglalási dokumentum jelenlegi mezőit és státuszait az audit felsorolja. Új mezők javaslata: `serviceId`, `startAt`, `endAt` (Firestore Timestamp), `timeZone: Europe/Bucharest`, `resourceId`, `source: web`, `schemaVersion`, `idempotencyKey`, szerveroldali `updatedAt`. A régi `date`, `time`, milliszekundumos `createdAt` mezők adapterrel megmaradnak, amíg az app kompatibilitási tesztje ezt igényli.

A szolgáltatások időtartamát, szüneteket, foglalási horizontot, munkaszüneteket, előkészítési időt, erőforrásokat és kapacitást a műhely adja meg. A demó három órája nem szolgáltatási szabály. A foglalások ügyféloldali olvasása UID/ownership alapján szűkített; nyilvános elérhetőségi API csak aggregált szabad időablakot adhat, nevet, rendszámot és foglalási dokumentumot nem.

## 4. Ütközésvédelem és szerveroldali parancsok

Javasolt callable/HTTPS backend: `getAvailability`, `createBooking`, `rescheduleBooking`, `cancelBooking`. Ellenőrzés: ID token, e-mail megerősítés, autótulajdon vagy engedélyezett céges jogosultság, jóváhagyott NVS shopId, engedélyezett szolgáltatás, dátum/idő, erőforrás, sebességkorlát, payload méret és idempotenciakulcs. App Check és abuse-védelem is szükséges, de nem helyettesítik az authorizationt.

Kapacitáskezelés javaslata: determinisztikus `bookingSlots/{shop_resource_utcSlot}` dokumentumok, a szolgáltatás teljes időtartamára és pufferére lefedett diszkrét időegységekkel. Firestore tranzakció olvassa az összes érintett lockot, ellenőrzi a kapacitást, majd atomikusan írja a lockokat, a foglalást és az outbox eseményt. Ütközéskor új időpontválasztás; hálózati retry ugyanazzal az idempotenciakulccsal ugyanazt az eredményt adja. Áthelyezéskor az új kapacitás foglalása és a régi feloldása egy tranzakcióban történjen. Lemondás engedélyezett státuszátmenettel oldjon fel lockot. Ha `pending` kérés is foglal kapacitást, lejárati és visszaigazolási szabály kell, amit a tulajdonos dönt el.

**A web önmagában nem adhat teljes közös ütközésvédelmet, ha az app továbbra is közvetlenül ír a `appointments` gyűjteménybe.** Az app összes létrehozási, jóváhagyási és áthelyezési útját ugyanazon tranzakciós kapacitáskezelésre kell majd terelni, külön jóváhagyott migrációban. Utólag futó Firestore trigger nem akadályoz meg két már létrejött ütköző foglalást. A jelenlegi szabályokat addig sem módosítjuk. Teljes átállásig a weben csak függő időpontkérés kínálható, garantált szabad kapacitás nem ígérhető.

## 5. E-mail értesítés

A sikeres tranzakció hozzon létre egy determinisztikus outbox eseményt. Külön worker/Function a Secret Managerben tárolt szolgáltatói hitelesítéssel küldjön értesítést a tulajdonos által megadott `nightvisionservice2025@gmail.com` címre; ez címzett, nem automatikusan a feladói fiók. Feladói domain, SPF/DKIM és szolgáltató tulajdonosi ellenőrzést igényel. A kliens nem kap SMTP- vagy API-titkot.

At-least-once feldolgozás esetén eseményazonosítóval deduplikálás, szolgáltatói idempotencia ahol támogatott, retry/backoff, sikertelen események felügyelete és manuális újraküldés kell. E-mailhiba nem hozhat létre új foglalást és nem törölheti az érvényes foglalást. Minimális szükséges adat kerüljön az üzenetbe; személyes dokumentumok ne. A visszaigazolás külön kezelje a beérkezett kérést és a műhely által elfogadott időpontot. A sikeroldalon NVS App ajánlás, tulajdonos által igazolt letöltési linkkel.

## 6. Hozzáférés, adatkezelés, működtetés

A jövőbeli szabálymódosítás külön diffként, emulator-tesztekkel készülhet. Kliens ne írhasson jóváhagyási státuszt, más UID-t, shopId-t, slot lockot vagy outboxot. A backend Admin SDK megkerüli a Rules-t, ezért minden jogosultságot maga is ellenőriz. Ügyfél csak saját/engedélyezett céges adatot, műhely csak saját műhelyadatot láthat. Meglévő appos folyamatok regressziós tesztje kötelező a szabályok szigorítása előtt.

Marketinghozzájárulás külön dokumentumban/mezőcsoportban: UID, cél, tájékoztató verziója, nyelv, időpont, visszavonás. Megőrzési és törlési folyamat, naplózási adatminimalizálás, felhasználói jogok és szolgáltatói adatfeldolgozás a végleges tájékoztatóban rendezendők. Nincs automatikus marketingfeliratkozás. Tokenek, jelszavak és teljes személyes payloadok ne kerüljenek logba.

## 7. Elfogadási kapuk

1. Emulator: weben regisztrált/megerősített ügyfél belép appban ugyanazzal az UID-val, és fordítva; regisztrációs megszakításból folytatás, elfelejtett jelszó, provider-ütközés.
2. Ownership: idegen autó, idegen foglalás, hamisított shopId/UID, nem megerősített e-mail és jogosulatlan céges szerep elutasítva.
3. Több párhuzamos kliens, web és app ugyanarra/átfedő időtartamra: csak engedélyezett kapacitás; idempotens újrapróbálás; áthelyezés/lemondás versenyhelyzete.
4. Europe/Bucharest óraátállítás, nem létező és kétszer előforduló helyi idő, időtartam/puffer, munkaszünet és szerveróra tesztelve.
5. E-mail trigger újrafutás nem duplikál; szolgáltatóhiba nem veszít foglalást; tesztben csak emulált e-mail sink.
6. HU/RO/EN hibák, státuszok, akadálymentes választás és valódi mobilböngésző kipróbálva.
7. Stagingben csak tesztfiókok; régi app regresszióellenőrzése; migrációs és visszaállítási terv. Éles bekapcsolás kizárólag külön tulajdonosi jóváhagyás után, megfigyeléssel. Visszaállításkor webes írás kikapcsolható, meglévő foglalás megmarad; adatot és szabályt nem törlünk automatikusan.
