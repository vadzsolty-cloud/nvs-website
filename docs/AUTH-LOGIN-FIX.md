# Webes belépés és nyomva tartós jelszómutató – 2026-11-16

## Megállapítás

A tulajdonos által megadott egyetlen fiókot csak olvasással ellenőriztük: a közös Firebase Authentication projektben létezik, jelszavas szolgáltatóval, nincs letiltva, de az `emailVerified` állapota hamis. A fiók e-mail-címét és azonosítóját nem tesszük a nyilvános hibajegybe vagy dokumentációba. Jelszót nem kértünk vagy olvastunk ki, a fiók állapotát nem módosítottuk.

A korábbi frontend a hitelesítési hibát, az `EMAIL_NOT_VERIFIED` választ és az autók betöltési hibáját egyetlen általános belépési hibaüzenetté alakította. Emiatt helyes jelszó mellett sem derült ki, hol akadt el a folyamat.

## Változás

- HU/RO/EN szöveg különbözteti meg az érvénytelen belépési adatot, a nem megerősített e-mailt, a letiltást, a korlátozást, a hálózati/konfigurációs hibát, a lejárt munkamenetet és az autóbetöltési hibát. A nem létező fiók és hibás jelszó továbbra is azonos üzenetet kap; nincs fiókfelderítő API.
- A jelszómutató csak nyomva tartás alatt működik: egér, érintés, Space/Enter. Felengedés, elhúzás, megszakítás, fókuszvesztés, lap elhagyása/elrejtése vagy beküldés visszarejti. Az akadálymentes állapotot az `aria-pressed` jelzi. A gomb nem küldi be az űrlapot.
- A nem megerősített, de sikeresen hitelesített fiókhoz külön, tudatos kattintásra kérhető Firebase-megerősítő levél. REST: `accounts:sendOobCode`, `requestType: VERIFY_EMAIL`, a sikeres belépés tokenjével. Nincs automatikus levélküldés. A frontend egyperces újraküldési várakozást ad a Firebase saját korlátozásai mellett. Ez a levél a Firebase Auth szolgáltatástól érkezik, nem a műhelyi SMTP-értesítőből.
- A megerősítő link megnyitása után ismételt belépés szükséges: ez friss tokent kér, és a backend ismét ellenőrzi a tényleges állapotot. Nem kerül meg sem e-mail-megerősítést, sem jármű-jogosultságot.
- A token kizárólag a lap memóriájában marad. A jelszó a próbálkozás végén törlődik; a belépési adatok változtatása törli a korábbi megerősítési lehetőséget.

## Béta fiókok

Az eredeti app `patch-v386-beta-firebase-compat.py` forrásában a `loginBeta` ugyanazt a Firebase `signInWithEmailAndPassword` belépést használja; a jóváhagyott béta státusz ezután demószerepeket enged. A béta azonosító nem e-mail-cím, és a demószerep önmagában nem jogosít élő foglalásra. Egy béta felhasználó ugyanazzal az NVS e-mail/jelszó párral hitelesíthet, de a webes időpontkéréshez is megerősített e-mail és ténylegesen hozzá tartozó, NVS-hez rendelt autó szükséges.

## Ellenőrzés és határok

`npm run build`, `npm test`, `node scripts/check-booking-ui.cjs` és `node scripts/check-auth-ui.cjs`. Az utóbbi külön `/nvs-website/` builden, Chromiumban ellenőrzi a három nyelvet, világos/sötét mobilos elrendezést, a nyomva tartás megszakításait, a különböző hibákat, a megerősítőlevél tudatos kérését és korlátozását, a kijelentkezést és a titkok tárolásának hiányát. Minden Auth/API/e-mail hívás elfogott, szintetikus válaszú. Nem teszteltünk a felhasználó valódi jelszavával, nem küldtünk a nevében megerősítő levelet, nem hoztunk létre éles foglalást.

Kizárólag a weboldal forrása változik. Nincs eredeti app/APK/frissítési módosítás, Firebase-szabálytelepítés vagy backendváltoztatás.

Hivatalos referencia: [Firebase Auth REST API – belépés és e-mail-megerősítés](https://firebase.google.com/docs/reference/rest/auth/).
