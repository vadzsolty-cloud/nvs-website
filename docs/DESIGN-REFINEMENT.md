# Prémium dizájnfelmérés és ügyfélkapu

## Cél és vizuális irány

A tulajdonos egyszerű, gondosan kidolgozott, Tesla ihlette megjelenést kért. Referencia: [Tesla Model 3](https://www.tesla.com/model3). A megvalósítás az NVS saját fekete/zöld/fehér arculatát, eredeti logóját és valódi műhelyfotóit használja; nem vesz át Tesla-képeket vagy logót.

## Felmérés és megvalósítás

| Terület | Korábbi helyzet | Finomítás |
| --- | --- | --- |
| Fejléc | Hosszú navigáció, külön ügyfélbelépő nélkül | Rögzített, kompakt fejléc; jobb felül felhasználóikon és belépés, mellette gyorsmenü; nyelv- és témaváltó |
| Gyors navigáció | Oldalon belüli linkek | Natív dialog oldalsó menü: ügyfélkapu, szolgáltatások, műhely, referenciák, kapcsolat, webes app, Android; Esc, fókuszvisszaadás és érthető ikonok |
| Hero | Szűkebb, sok apró vizuális elem | Tágasabb kétsávos elrendezés, erősebb betűhierarchia, nagy valódi fotó, visszafogott lapozó és három rövid minőségi alapelv |
| Szolgáltatások | Kisméretű szöveges kártyák | Hat nagyméretű fotós csempe, egységes vonalas ikonok, rövid leírás és részletek; mobilon egyoszlopos |
| Műhely | Számozott felszereléslista | Diagnosztika, jármű, kalibrálás, futómű, felfüggesztés, fék és fényszóró saját SVG-ikonjai; a tulajdonosi szöveg és a kiválasztott kék lépcsős fotó megmarad |
| Időpontkérés | A főoldal hosszú belépési űrlapja | Külön `/hu/account/`, `/ro/account/`, `/en/account/` ügyféloldalak; a főoldalon tiszta, egyértelmű belépési felhívás |
| Regisztráció | Közvetlen link a meglévő apphoz | Külön regisztrációs kártya és lépések az ügyfélkapuban; a tulajdonos kifejezetten jóváhagyta az eredeti közös regisztráció használatát |
| Alkalmazások | Vegyes hivatkozások | Külön webes és Android-csempe az ügyféloldalon és a főoldalon |
| Android-letöltés | Letöltési bemutatóoldalra vezető gomb | Saját nyelvi letöltőoldal, amely a hivatalos nyilvános kiadások közül kiválasztja és közvetlenül indítja a legfrissebb stabil APK-t |

Az új ikonok kódban rajzolt SVG-k (`src/icons.mjs`), nem betöltött ikonfontok vagy generált referenciafotók. A színek mindkét témában a meglévő változókat követik. Csökkentett mozgásnál nincs lebegtetési/nagyítási effekt. A menü és a vezérlők billentyűzettel használhatók; JavaScript nélkül az alap navigáció és a tartalom olvasható marad.

## Ügyfélfolyamat

1. A jobb felső Belépés, a fő CTA vagy a menü megnyitja az ügyfélkaput.
2. A meglévő NVS-fiók hitelesítése és a valódi, műhelyi visszaigazolásra váró időpontkérés az eddigi backenddel működik. A jelszómutatás, automatikus kitöltés elleni beküldésvédelem és hiba esetén megtartott jelszó változatlan.
3. Az új ügyfél a regisztrációs kártyáról az eredeti online app teljes regisztrációját nyitja meg. Nem vezetünk be második fiókrendszert vagy egyszerűsített jármű-kisajátítási folyamatot.
4. A webes app külön elérhető, az Android-gomb a saját nyelvi letöltőoldalra visz.

## APK-forrás és működés

Csak olvasással ellenőriztük a meglévő `nvs-app-letoltes` projekt `gh-pages/index.html` letöltőjét. Annak mintájára a weboldal ezt a nyilvános listát olvassa: `https://api.github.com/repos/vadzsolty-cloud/nvs-app-letoltes/releases?per_page=10`. Elfogadott tag: `apk-vX.Y.Z-runN`, hozzá tartozó pontos fájlnév: `NightVisionService-vX.Y.Z.apk`. A draft és prerelease kimarad, a verziókat számok szerint rendezzük. Azonos verziónál a magasabb run nyer. Csak ugyanazon repository megfelelő kiadási útvonalán lévő GitHub asset fogadható el.

A letöltés csak a kifejezetten megnyitott `/LANG/download/` oldalon indul, oldalmegnyitásonként egyszer. A főoldal/ügyfélkapu nem kérdez kiadást és nem indít letöltést. API-hiba vagy hiányzó APK esetén a felhasználó a hivatalos kiadásokhoz vezető működő linket kapja; JavaScript nélkül is van kézi út. A telefon/böngésző biztonsági és telepítési megerősítését nem kerüljük meg. Nem módosítottunk APK-t, appos frissítőlogikát vagy közzétételi repositoryt.

## Ellenőrzés

- Buildelt HTML: 39 nyelvi oldal, külön account/download title, leírás, canonical és hreflang; az ügyfél- és letöltőoldal noindex marad.
- Meglévő statikus, fotós, SEO-, adatvédelmi, belépési és foglalási regressziók.
- Új `scripts/check-premium.cjs`: HU/RO/EN, 320/390/768/1440 px, világos/sötét téma; nincs vízszintes kilógás; menü, Esc, fókusz, ügyfélkapu, regisztrációs link; helyesen rendezett kiadások, draft/prerelease/idegen APK kizárása; egyszeri szintetikus letöltés és API-hiba esetén kézi út.
- A tesztek nem hitelesítenek valódi ügyfelet, nem írnak Firebase-be és nem töltenek le valódi APK-t; a külső kéréseket elfogott, szintetikus válaszok helyettesítik.

Források: `src/premium.mjs`, `src/icons.mjs`, `public/assets/premium.css`, `public/assets/premium.js`. A CSS és a JS tartalomlenyomatos fájlnevet kap a buildben, hogy a friss HTML ne maradjon régi megjelenítési kóddal. A fő fejlesztés kizárólag az `nvs-website` repositoryban történik.
