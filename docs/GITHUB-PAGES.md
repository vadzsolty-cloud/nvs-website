# GitHub Pages előkészítés

Kizárólag `vadzsolty-cloud/nvs-website`. A foglalás továbbra is demó; nincs Firebase, e-mail-küldés vagy ügyféladatmentés.

## Beállítások ellenőrzése közzététel előtt

1. Repository: `https://github.com/vadzsolty-cloud/nvs-website`.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**. Ne válassz semmilyen más NVS repositoryt, ne adj meg egyéni domaint.
3. Settings → Environments → `github-pages`: a `dev/website-v1` ágról történő deploy engedélyezett legyen. Szükség esetén review védelem állítható be.
4. A `pages.yml` buildje sikeres legyen. A push csak ellenőriz és artifactot készít, nem publikál. A `deploy` job csak kézi indítás és `publish_preview=true` esetén fut, kizárólag a fejlesztői ágról.
5. GitHub csak akkor kínálja fel a `workflow_dispatch` kézi indítását, ha a workflow az alapértelmezett ágon is jelen van. Új repository esetén állítsd az alapértelmezett ágat `dev/website-v1`-re, vagy a workflow-t külön review után juttasd el az alapértelmezett ágra. A fejlesztői forrást nem másoljuk automatikusan `main`-re.
6. Actions → Website checks and optional Pages preview → Run workflow → branch `dev/website-v1` → `publish_preview=true`. A `configure-pages` ellenőrzi a Pages-konfigurációt; a workflow nem kapcsolja be automatikusan a Pages-t.

Sikeres deploy után várható cím: `https://vadzsolty-cloud.github.io/nvs-website/`, magyar főoldal: `/nvs-website/hu/`. **A várható cím önmagában nem bizonyít működő publikálást.** A workflow deployment outputja és a tényleges HTTP-válasz alapján kell ellenőrizni.

Ez nyilvánosan elérhető, keresőindexelésből kizárt DEMÓ lenne. A `noindex` nem hozzáférésvédelem. Végleges éles domain, indexelés és Firebase-integráció nem része ennek a telepítésnek.

## Helyi reprodukció PowerShellben

```powershell
$env:SITE_URL='https://vadzsolty-cloud.github.io'
$env:BASE_PATH='/nvs-website'
$env:PRODUCTION='false'
npm run build
npm test
npm run preview
```

Helyi cím: `http://localhost:4180/nvs-website/hu/`. A gyökérútvonalas fejlesztéshez `BASE_PATH` legyen üres, `SITE_URL` pedig `http://localhost:4180`. A `dist` tartalma a tárhely projektgyökerébe kerül; **nem** kell benne külön `nvs-website` almappát létrehozni. A build prefixeli a nyelvi útvonalakat, az asseteket, a root redirectet, a 404 nyelvi linkjeit és az összes SEO URL-t. A tesztek mindkét módot ellenőrzik, valamint hálózat nélkül, közvetlen kéréskezelő-hívással tesztelik a kiszolgálást és a demót.

Hivatalos útmutató: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Alternatív korábbi tárhely

A `.openai/hosting.json` a korábban létrehozott, még nem publikált Sites-projekt azonosítóját őrzi. GitHub Pages nem használja. A mostani workflow kizárólag a GitHub Pages környezetre készít buildet; nincs Sites-, Firebase- vagy APK-deploy.
