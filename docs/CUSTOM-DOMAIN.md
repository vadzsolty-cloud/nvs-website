# Night Vision Service saját domain

A tulajdonos 2026-11-23-án jóváhagyta a weboldal átköltöztetését a `night-vision-service.eu` címre. A kapcsolattartási cím továbbra is `nightvisionservice2025@gmail.com`; e-mail-szolgáltatóváltás nem része a feladatnak.

## Felkészített működés

- A Pages build a GitHub által konfigurált hostot és útvonalat használja. A PR-előnézet a korábbi GitHub-címen marad.
- A saját domainen készülő build éles keresőindexelést és a tulajdonos által korábban megerősített cégadatokat használja, fejlesztői előnézeti lábléc nélkül.
- A webes időpontkérő API az eredeti GitHub-origin mellett kizárólag a saját domain HTTPS apex és `www` originjét fogadja el. Az új kód külön célzott API-telepítést igényel.
- A közös Firebase-projektben az engedélyezett auth domainek listáját meg kell őrizni, és csak a két új webes hosttal bővíteni. Sem ügyféladat, sem Firestore-szabály, sem az Android-app vagy az app közzétételi projektje nem változik.

## Átállítás sorrendje

1. A DataHost-fiókban az aktív domain DNS-zónájának ellenőrzése. A regisztrációs levél a DNS-kezelést is visszaigazolta.
2. Az új hostok felvétele az Auth engedélyezett domainek közé és kizárólag a `nvsWebsiteApi` új CORS-konfigurációjának telepítése; health és nem engedélyezett origin ellenőrzése, valós foglalás nélkül.
3. A `night-vision-service.eu` kötése a meglévő `vadzsolty-cloud/nvs-website` Pages oldalhoz, az Actions-alapú közzététel megtartásával.
4. A GitHub hivatalos DNS-adatai: apex A rekordok `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME célja `vadzsolty-cloud.github.io`. Meglévő levelezési és más, nem érintett rekordok megőrzendők. Wildcard nem szükséges.
5. Új build közzététele a saját domain gyökerében; DNS, HTTPS-tanúsítvány és HTTPS-kényszerítés ellenőrzése.
6. HU/RO/EN főoldal, szolgáltatási oldalak, képek, menük, ügyfélkapu, API CORS és korábbi GitHub-linkek átirányításának ellenőrzése.

2026-11-23-i előellenőrzés: a domain regisztrált, de a DataHost névszerverei még REFUSED/SERVFAIL választ adtak. A GitHub Pages saját domainje még nem volt beállítva, az API az új originre 403 választ adott, és az Auth engedélyezett listája még nem tartalmazta az új hostokat. Ez az előellenőrzés nem jelent megtörtént költözést.

Hivatalos útmutató: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
