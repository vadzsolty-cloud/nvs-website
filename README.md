# Night Vision Service Website v0.1

Önálló HU / RO / EN weboldal: 3 főoldal és 18 szolgáltatási oldal. Kizárólag az új vadzsolty-cloud/nvs-website repositoryhoz készült. A meglévő alkalmazás, APK-frissítési rendszer és Firebase változatlan.

## Futtatás

Node.js 22+ szükséges; külső függőség nincs.

    npm run dev

Helyi előnézet: http://localhost:4180/hu/ (RO: /ro/, EN: /en/).

    npm run build
    npm test
    npm run preview

A tesztek mind a gyökérútvonalas, mind a /nvs-website/ alatti buildet ellenőrzik: 21 oldal, nyelvi metaadatok, canonical/hreflang, assetek, átirányítások, belső linkek, sitemap, kiszolgálói útvonalkezelés és foglalási demó. A kiszolgálót közvetlen request-handler hívással tesztelik, hálózati hozzáférés nélkül. Ez nem távoli HTTP- vagy teljes akadálymentességi audit.

## GitHub Pages

Fejlesztői ág: dev/website-v1. Részletes útmutató: [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

PowerShell:

    $env:SITE_URL='https://vadzsolty-cloud.github.io'
    $env:BASE_PATH='/nvs-website'
    $env:PRODUCTION='false'
    npm run build
    npm test
    npm run preview

Helyi Pages-előnézet: http://localhost:4180/nvs-website/hu/.
A dist tartalma kerül a projektgyökérbe a tárhelyen. Az alútvonalat a navigáció, képek, CSS, JS, canonical, hreflang, sitemap, nyelvváltó, 404 és kezdő átirányítás is figyelembe veszi. Alapértelmezett BASE_PATH: üres; SITE_URL: http://localhost:4180.

A .github/workflows/pages.yml push esetén csak buildet és teszteket futtat, majd Pages-artifactot készít. A deploy kézi indítást, publish_preview=true választást és ellenőrzött Pages-beállítást igényel. A kézi workflow elérhetőségéhez annak az alapértelmezett ágon is szerepelnie kell; lásd a Pages-útmutatót. Publikálás nem történik pusztán a workflow előkészítésétől.

## Demó és SEO

A foglalás kizárólag felület: szolgáltatás, kívánt nap, szemléltető időpont, összegzés és újrakezdés. Nem jelez valódi szabad kapacitást. Nincs fióklétrehozás, Firebase SDK, hálózati adatküldés, tartós mentés, analitika, cookie vagy automatikus e-mail. A marketing checkbox külön és opcionális, választását sem tárolja a demó. Az e-mail link csak a levelezőprogramot nyitja meg.

A preview noindex,nofollow; a robots.txt tiltja az indexelést. A projektoldal /nvs-website/robots.txt fájlja nem vezérli a teljes github.io domain root robots szabályait; az oldalak saját noindex metaadata ettől független. A noindex nem hozzáférésvédelem. Végleges domain és indexelés külön jóváhagyása után használható a PRODUCTION=true, explicit HTTPS SITE_URL mellett. A build önmagában nem publikál.

## Források és hitelesség

- src/content.mjs: teljes HU / RO / EN tartalom.
- scripts/build.mjs és scripts/config.mjs: HTML-generálás és útvonalak.
- public/assets/style.css: reszponzív fekete / élénkzöld / fehér arculat.
- public/assets/app.js: memóriában működő demó.
- scripts/preview-server.mjs: alútvonalat támogató helyi kiszolgáló.

Az eredeti NVS-logó változtatás nélkül az alkalmazás __bundler_logo PNG-jéből származik. Eredet és csak olvasási vizsgálat: [docs/SOURCE-AUDIT.md](docs/SOURCE-AUDIT.md). Nincs generált vagy idegen műhelyfotó; minden hiányzó fotó jelölt helykitöltő. A JSON-LD kizárólag a megadott nevet és települést tartalmazza. A Google Maps gomb településkeresés. Az App gomb a meglévő közzétételi repositoryra mutat; közvetlen APK-linket nem találunk ki.

## Hátralévő munka

Szükséges a korábbi látványterv, valódi jóváhagyott fotók, végleges bemutatkozás, pontos műhelycím, telefon, nyitvatartás, domain és éles adatkezelési tájékoztató. A jelenlegi elrendezés önálló első vizuális változat. Asztali és 390 × 844 px mobilos Edge-ellenőrzés az eredeti v0.1 változaton sikerült; a mostani alútvonal-javításhoz automatizált regressziós tesztek készültek. Új távoli böngészőellenőrzés csak tényleges publikálás után állítható.

A közös Firebase Auth/foglalási modell, szerveroldali kapacitásvédelem és értesítések terve: [docs/FIREBASE-INTEGRATION.md](docs/FIREBASE-INTEGRATION.md). A korábbi, elakadt Sites-publikálás történeti állapota: [docs/PUBLISH-STATUS.md](docs/PUBLISH-STATUS.md); GitHub Pages ezt nem használja.
