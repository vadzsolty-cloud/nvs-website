# Csak olvasási projektvizsgálat – 2026-11-14

Issue #1 kiegészítés: a standalone blob az új vizsgálatkor is `de36a5c734eff694f651ace297b5d356a418932f`. A `normalizeVehicleIdentity` NFD/uppercase/alphanumerikus normalizálást, a `vehicleRegistryId` pedig `kind + '_' + SHA256(kind + ':' + normalized)` azonosítót használ. A labor ezt követi; ütközéskor nem vesz át járművet. Olvasással ellenőriztük a műhely shopId-, a személyes ügyfél ownerUid-lekérdezését, valamint a céges tagság/driver assignedCarIds feltételeket. Éles adatot és konfigurációt nem exportáltunk. Új tesztállapot: `docs/ISSUE-1.md`.

## Érintett források

- `vadzsolty-cloud/night-vision-service`: privát, alapértelmezett ág `main`, HTML/Capacitor alkalmazás. A `www/` egy 4,67 MB-os standalone HTML-t tartalmaz. Külön `native/`, `.github/`, `scripts/`, `app-icon/`, valamint `capacitor.config.json`, `package.json`, `firebase.json`, Firestore és Storage szabályfájlok találhatók a gyökérben. Aláírási és Firebase-konfigurációs fájlokhoz nem nyúltunk, és nem másoltuk át őket.
- A standalone fájlt blobként olvastuk (a normál fájl-lekérés üres tartalmat adott a méret miatt). Blob SHA: `de36a5c734eff694f651ace297b5d356a418932f`.
- `functions/index.js`, SHA `dcc4536a53e29271a0ff1dc1c2fb3944ee8a0ccb`: az itt látható export napi Firestore-backup, nem foglalási API vagy e-mail-küldő endpoint.
- `firestore.rules`, SHA `a6264ec9a9e6a3e532afd34cc096799577a30d15`: fejlécében kifejezetten **javaslatként** azonosítja magát, nem az élesben futó szabályok másolataként. Éles hozzáférési garancia ebből nem következik.
- `vadzsolty-cloud/nvs-app-letoltes`: nyilvános repository, `main`, GitHub Pages engedélyezett a metaadatban. A főág gyökérlistájában csak `README.md` látható (SHA `82d24baf8e02006e8f57f266a8126970f70e7a93`). Más ágak, Pages-kimenet és release-ek teljes vizsgálata nem történt meg, ezért ebből nem állítjuk, hogy nincs működő letöltési oldal.

Egyik meglévő repositoryba sem történt írás, branch-létrehozás, commit, push, szabálytelepítés vagy workflow-indítás. A vizsgálat nem olvasott éles Firestore-ügyféladatokat.

## Kódból igazolt kapcsolatok

`saveCustomerRegister`: e-mail/jelszó alapú `createUserWithEmailAndPassword`, majd `sendEmailVerification`. Telefon és járműadat (rendszám vagy márka+modell) szükséges. `customerRegistrations/{uid}` tartalmaz többek között `uid`, `accountType`, `companyId`, `name`, `contactName`, `phone`, `email`, `plate`, `make`, `model`, `createdAt`, `seenByShopIds`, `duplicateTransferPending` mezőket. Az ügyfél autója `cars/{carId}` alatt `ownerUid`-val kapcsolódik a felhasználóhoz. A céges fiók külön `companies` és `companyMembers` dokumentumokat is használ. Duplikált jármű esetén tulajdonosátadási folyamat indulhat. Ezeket webes egyszerűsített regisztrációval nem szabad megkerülni.

`submitApptRequest`: az ügyfél autójához meglévő `shopId` kell; egy önálló új webes ügyfél még nem feltétlenül foglalhat az NVS-hez. Az ID determinisztikus: `apreq_` + uid/autó/nap/idő, tisztított karakterekkel. A dokumentum mezői: `id`, `carId`, `date`, `time`, `note`, `techId`, `status`, `photoUrl`, `ownerUid`, `companyId`, `shopId`, `createdAt`, `declineReason`, `proposedDate`, `proposedTime`. Kezdeti státusz `pending`. A mentés `.set(..., {merge:true})`.

További ismert státuszok a vizsgált folyamatban: `confirmed`, `declined`, `awaiting_customer`, `customer_cancelled`, `customer_deleted`, a műhelyoldalon `done`. A módosítás `updatedAt` mezőt írhat. A jelenlegi duplikációellenőrzés az adott autó azonos időpontját vizsgálja; ez **nem bizonyít** globális műhely-/erőforrás-kapacitásvédelmet. A műhely `saveAppointment` külön `apshop_` ID-t használ, tehát ezt az útvonalat is figyelembe kell venni.

Időpont: jelenleg `date` + `time` sztring; `createdAt` több helyen epoch milliszekundum. A webes modell bővítésekor ezeket meg kell őrizni az app kompatibilitásához. A felhőben ténylegesen telepített Functions-, Auth-, index- és szabályállapotot később külön, jogosított, csak olvasási ellenőrzéssel kell igazolni.
