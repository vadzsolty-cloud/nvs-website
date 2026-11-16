# Webes belépés és nyomva tartós jelszómutató – 2026-11-16

## Megállapítás

A tulajdonos által megadott egyetlen fiókot csak olvasással ellenőriztük: a közös Firebase Authentication projektben létezik, jelszavas szolgáltatóval, nincs letiltva, de az `emailVerified` állapota hamis. A fiók e-mail-címét és azonosítóját nem tesszük a nyilvános hibajegybe vagy dokumentációba. Jelszót nem kértünk vagy olvastunk ki, a fiók állapotát nem módosítottuk.

A korábbi frontend a hitelesítési hibát, az `EMAIL_NOT_VERIFIED` választ és az autók betöltési hibáját egyetlen általános belépési hibaüzenetté alakította. Emiatt helyes jelszó mellett sem derült ki, hol akadt el a folyamat.

## Változás

- HU/RO/EN szöveg különbözteti meg az érvénytelen belépési adatot, a nem megerősített e-mailt, a letiltást, a korlátozást, a hálózati/konfigurációs hibát, a lejárt munkamenetet és az autóbetöltési hibát. A nem létező fiók és hibás jelszó továbbra is azonos üzenetet kap; nincs fiókfelderítő API.
- A jelszómutató csak nyomva tartás alatt működik: egér, érintés, Space/Enter. Felengedés, elhúzás, megszakítás, fókuszvesztés, lap elhagyása/elrejtése vagy beküldés visszarejti. Az akadálymentes állapotot az `aria-pressed` jelzi. A gomb nem küldi be az űrlapot.
- A nem megerősített, de sikeresen hitelesített fiókhoz külön, tudatos kattintásra kérhető Firebase-megerősítő levél. REST: `accounts:sendOobCode`, `requestType: VERIFY_EMAIL`, a sikeres belépés tokenjével. Nincs automatikus levélküldés. A frontend egyperces újraküldési várakozást ad a Firebase saját korlátozásai mellett. Ez a levél a Firebase Auth szolgáltatástól érkezik, nem a műhelyi SMTP-értesítőből.
- A megerősítő link megnyitása után ismételt belépés szükséges: ez friss tokent kér, és a backend ismét ellenőrzi a tényleges állapotot. Nem kerül meg sem e-mail-megerősítést, sem jármű-jogosultságot.
- A token kizárólag a lap memóriájában marad. A jelszó sikeres teljes belépéskor vagy kijelentkezéskor törlődik; hibánál a mezőben marad ellenőrzéshez/javításhoz, külön tárolás nélkül. A belépési adatok változtatása törli a korábbi megerősítési lehetőséget.

## Béta fiókok

Az eredeti app `patch-v386-beta-firebase-compat.py` forrásában a `loginBeta` ugyanazt a Firebase `signInWithEmailAndPassword` belépést használja; a jóváhagyott béta státusz ezután demószerepeket enged. A béta azonosító nem e-mail-cím, és a demószerep önmagában nem jogosít élő foglalásra. Egy béta felhasználó ugyanazzal az NVS e-mail/jelszó párral hitelesíthet, de a webes időpontkéréshez is megerősített e-mail és ténylegesen hozzá tartozó, NVS-hez rendelt autó szükséges.

## Ellenőrzés és határok

`npm run build`, `npm test`, `node scripts/check-booking-ui.cjs` és `node scripts/check-auth-ui.cjs`. Az utóbbi külön `/nvs-website/` builden, Chromiumban ellenőrzi a három nyelvet, világos/sötét mobilos elrendezést, a nyomva tartás megszakításait, a különböző hibákat, a megerősítőlevél tudatos kérését és korlátozását, a kijelentkezést és a titkok tárolásának hiányát. Minden Auth/API/e-mail hívás elfogott, szintetikus válaszú. Nem teszteltünk a felhasználó valódi jelszavával, nem küldtünk a nevében megerősítő levelet, nem hoztunk létre éles foglalást.

Kizárólag a weboldal forrása változik. Nincs eredeti app/APK/frissítési módosítás, Firebase-szabálytelepítés vagy backendváltoztatás.

## Utólagos javítás: kis ikon és mezőszerkesztés

A tulajdonos kérésére a szöveges jelszómutató helyett 20 × 20 px szem ikon jelenik meg a jelszómező jobb szélén; a láthatatlan érintési terület 44 × 44 px. A mező teljes szélességű, az ikon számára külön jobb oldali belső térrel. A gomb akadálymentes neve és címe mindhárom nyelven megmarad; a dekoratív SVG nem vesz át pointereseményt.

A láthatósági kezelő csak akkor állítja át az input típusát, ha az ténylegesen változik; egy szokásos mezőérintés/felengedés nem írja újra a típusát. Láthatóságváltáskor megőrzi a fókuszban lévő mező kijelölését és kurzorát. Az új böngészős regresszió érintés utáni tényleges billentyűeseményekkel gépel, középre beszúr, szemgomb használata után ellenőrzi a fókuszt/kurzort/értéket, valamint szövegbeillesztést és ikonméretet is ellenőriz. Az eredeti általános gépelési panasz nem volt reprodukálható a korábbi szintetikus `fill()` alapú teszttel; a bővített teszt ellenőrzi a korábban nem lefedett interakciókat is. Valódi mobileszközön a tulajdonosi visszaellenőrzés továbbra is szükséges.

Hivatalos referencia: [Firebase Auth REST API – belépés és e-mail-megerősítés](https://firebase.google.com/docs/reference/rest/auth/).

## Automatikus kitöltés utáni eltűnés és letiltott szem ikon

A pontosított panasz vizsgálatakor két konkrét okot találtunk: a bejelentkezési kezelő minden végállapotban kiürítette a jelszómezőt (`finally`), és a feldolgozás idejére minden gombot, így a szem ikont is letiltotta. A szintetikus automatikus kitöltés + implicit űrlapbeküldés regressziós teszt a régi kódon elbukott a letiltott jelszóellenőrzésnél. A tulajdonos saját jelszókezelőjének automatikus beküldését nem figyeltük meg közvetlenül.

A webes belépés most külön, normál gomb tudatos felhasználói aktiválására indul (egér, érintés vagy a fókuszált gomb Enter/Space aktiválása). Az űrlap implicit `submit`, a mezőből küldött Enter és a szkriptből hívott gombkattintás nem indít hitelesítést. A böngésző automatikus jelszókitöltése megmarad, a felhasználó a szem ikonnal ellenőrizhet, majd a Belépés gombbal folytathatja.

Hibás belépés, nem megerősített e-mail, járműbetöltési hiba és elérhetetlen szolgáltatás után a jelszó a mezőben marad. Nem kerül localStorage-ba, sessionStorage-ba, naplóba vagy további szerverhez. A teljes sikeres belépés és a kijelentkezés továbbra is üríti. Várakozáskor csak az adatot küldő gombok tiltottak, a mezők átmenetileg csak olvashatók; a szem ikon végig működik, és csak felengedésre/megszakításra rejt vissza. A hálózati kérések 15 másodperces megszakítást kaptak, hogy ne maradjon vég nélkül várakozó felület.

A bővített HU/RO/EN böngészőteszt kitölti a mezőket szintetikus jelszókezelő-eseményekkel, implicit/programozott beküldést próbál, majd ellenőrzi, hogy nincs Auth-kérés, nem tűnt el a jelszó, és a szem működik. Külön ellenőrzi a sikertelen belépés utáni megőrzést, a lassú/hibás backend közbeni megtekintést és a teljes siker utáni törlést. Valódi jelszókezelővel és mobileszközzel a tulajdonosi visszaellenőrzés szükséges; éles belépési adatot nem kértünk vagy használtunk.

A build tartalomlenyomattal ellátott fájlnéven hivatkozik a belépési JavaScriptre, hogy az új HTML ne kapja a böngészőben maradt régi belépési kódot. A konfiguráció és a nyelvi szövegek frissen töltődnek. A kezelő az előző HTML régi submit gombját is felismeri és normál gombként kezeli, így a gyorsítótárban maradt régi HTML és friss JavaScript párosítása is támogatott.
