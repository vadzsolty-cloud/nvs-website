# Tesztoldal közzétételi állapota

A tulajdonos 2026-11-14-én engedélyezte a külső böngészőből tesztelhető közzétételt.

- Létrejött a külön Sites-projekt: `appgprj_6af8c67950108191ade726ca31e39af3`.
- A projektazonosító és a statikus `dist` könyvtár a `.openai/hosting.json` fájlban szerepel.
- A hozzáférés csak a tulajdonosnak engedélyezett; nem tettük nyilvánossá.
- Tervezett cím: `https://nvs-website-test.vadzsolty.chatgpt.site`. Ez még **nem igazolt működő közzététel**.
- Az új címre állított canonical/hreflang/sitemap build és a három automatizált teszt sikeres. A tesztváltozat továbbra is noindex.
- A forrásfeltöltési helper nem fejeződött be; a futtatásokat leállítottuk. A sandbox hálózatán a GitHub-ellenőrzés `Could not resolve host` hibát adott. A sandboxon kívüli feltöltést az automatikus szabályzat elutasította (`sandbox_approval: false`).
- Nincs igazolt feltöltött commit, mentett Sites-verzió vagy deployment. A következő lépés a forrás feltöltése és csomagolása ugyanahhoz a projektazonosítóhoz, majd owner-private deploy. Új Sites-projektet nem kell létrehozni.
- A rövid élettartamú feltöltési hitelesítést nem mentettük fájlba. Folytatáskor ugyanahhoz a Sites-projekthez új credential kérhető.

A két eredeti NVS repositoryhoz és a Firebase-hez továbbra sem történt írás.
