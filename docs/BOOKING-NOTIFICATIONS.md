# Közérthető időpontkérés és visszahívható ügyféladatok

## Ügyféloldal

A sikerüzenet HU/RO/EN nyelven közérthető: a kérés elküldve, a műhely e-mailben vagy telefonon jelentkezik a visszaigazolással. Az adatbázis-azonosító továbbra is létezik az idempotenciához és az app működéséhez, de nem jelenik meg az ügyfélnek.

A kapcsolattartó neve és visszahívási telefonszáma kötelező, az ellenőrzött fiók saját regisztrációs adataiból előtöltve. Módosítható anélkül, hogy átírnánk az appos profilt. Ha nincs előtölthető adat, kézzel megadható. Az e-mail-címet a szerver a hitelesített Firebase Auth fiókból veszi; a kliens nem írhatja felül.

A hat kiemelt szolgáltatás mellett `other` / „Egyéb szervizmunka” is választható. Ennél a megjegyzés mező a kért munka kötelező leírása lesz, legfeljebb 1500 karakterrel. A többi szolgáltatásnál továbbra is opcionális. A főoldal és az ügyfélkapu jelzi az általános szervizmunkát. A tulajdonos kérésére a nem vállalt munkákat nem soroljuk fel az oldalon. A leírás a meglévő app által olvasott `note` mezőben marad.

## Értesítés a műhelynek

A tulajdonos megerősítette a `nightvisionservice2025@gmail.com` címzettet Szilárd értesítéséhez. Nem adunk hozzá más címzettet, és nem küldünk automatikus marketing- vagy ügyfél-visszaigazoló levelet. A sikerüzenet a műhely későbbi, e-mailes vagy telefonos egyeztetését jelzi, nem azt, hogy a végleges időpontot már elfogadták.

Az e-mail szöveges és HTML-változatot kap:

- Kapcsolattartó neve, visszahívható telefonszám, hitelesített e-mail-cím; hívás és e-mail-link.
- Kért nap/idő romániai helyi időként, a szolgáltatás érthető neve és a teljes munkaleírás/megjegyzés.
- A kiválasztott, jogosultság szerint ellenőrzött autó rögzített adatai: rendszám, márka, modell, évjárat, VIN, kilométeróra, valamint az elérhető hajtás-/motor-/váltó-/karosszéria-adatok, műszaki/biztosítási határidők és járműhöz rögzített tulajdonosi kapcsolat. A pontos engedélyezett lista: `backend/functions/request-details.mjs`.
- A hiányzó mezőket nem találjuk ki. Nincs teljes Firestore-payload, szerviztörténet, dokumentumkép, privát csatolmány vagy hitelesítési token az üzenetben.

Az outbox a kérés tranzakciójában rögzíti a kontakt- és járműadatok pillanatképét; egy későbbi profil-/autómódosítás nem változtatja meg az értesítést. A járműadatot nem a böngészőtől fogadjuk el. Az eredeti Message-ID, lease, retry és rögzített céges címzett megmarad. A régi, még függő outboxhoz korlátozott visszaolvasási út tartozik; csak az adott kérőhöz/céghez és műhelyhez továbbra is tartozó jármű adata olvasható. A már elküldött leveleket nem küldjük újra.

## Adatmodell és kompatibilitás

Új appointment mezők: `contactName`, `contactPhone`, `contactEmail`. Az outbox új `details` mezője tartalmazza a szűkített pillanatképet. A meglévő státuszok, dátum/idő, autó-/műhely-hozzárendelés és az appos mezők megmaradnak. Az eredeti NVS appban és a közzétételi projektben nincs módosítás; nincs Rules-, index- vagy adatmigráció.

Azonos idempotenciakulcs és változatlan kérés továbbra is ugyanazt adja vissza; megváltozott visszahívási adat eltérő tartalomnak számít. A korábbi, kontaktmezők nélküli idempotenciakulcsok visszajátszása is működik új levél nélkül. Régi nyitott kliensnél a saját regisztrációs adatok jelentik a kontaktmezők tartalékát. A kliens által jelzett adatkezelési verziót rögzítjük; a régi verzió nélküli klienshez nem állítjuk utólag az új verzió elfogadását.

## Teszt és telepítés

- Statikus/site tesztek és böngészős belépési/foglalási regresszió: előtöltött kontaktok, kötelező egyéb leírás, kétszeri idempotens beküldés, emberi sikerüzenet azonosító nélkül.
- Mail-egységteszt: kontaktadatok, VIN/évjárat/km/műszaki adatok, leírás, kattintható telefon, HTML-escaping, adatminimalizálás és rögzített címzett.
- Izolált CI-emulátor: jogosultság és kötelező kontakt, saját profil olvasása, hamis e-mail/járműadat elutasítása, pillanatkép későbbi módosítás ellenére, deduplikált értesítés és régi idempotenciakulcs. A helyi gépen nincs működő Java-futtatókörnyezet; az emulátoros kaput a GitHub CI futtatja.
- Kizárólag szintetikus tesztadat és helyettesített SMTP-küldés; nem hozunk létre tesztügyfelet vagy foglalást az éles rendszerben, nem küldünk valódi tesztlevelet.

Telepítéskor először csak a weboldal értesítő függvénye, majd csak a weboldal API-ja frissül:

```powershell
firebase deploy --config backend/firebase.json --only functions:nvswebsite:nvsWebsiteMail --project night-vision-service --non-interactive --force
firebase deploy --config backend/firebase.json --only functions:nvswebsite:nvsWebsiteApi --project night-vision-service --non-interactive --force
```

Ezután kerülhet ki az új webes felület. A `betaFeedback`, az app, a Firebase-szabályok és a titkok változatlanok. Referencia: [Firebase – függvények kezelése](https://firebase.google.com/docs/functions/manage-functions), [Firebase – codebase-ek szervezése](https://firebase.google.com/docs/functions/organize-functions).

