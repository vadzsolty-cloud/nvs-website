# GitHub feltöltési állapot – 2026-11-14

- Repository: https://github.com/vadzsolty-cloud/nvs-website
- Teljes weboldalforrás: `dev/website-v1`.
- Forráscommit: `095b5567c606bf6a8a9b667af507a6f239ba35a5`.
- Sikeres CI: https://github.com/vadzsolty-cloud/nvs-website/actions/runs/43640711711
- A `main` csak indító README-t és a kézi workflow felismeréséhez szükséges `pages.yml` fájlt tartalmazza. A teljes weboldalforrás nem került a főágra.
- Pages beállítás ellenőrizve: GitHub Actions forrás; kötelező HTTPS; nincs egyéni domain.
- A kézi demótelepítés buildje és tesztje sikeres, de a deploy job a környezet ágszabályán megállt: https://github.com/vadzsolty-cloud/nvs-website/actions/runs/43640939003
- Hiba: a `dev/website-v1` ág még nem jogosult a `github-pages` környezetbe telepíteni. Az engedélyezett telepítési ágak bővítését külön tulajdonosi megerősítéshez kötöttük.
- Előkészített cím: `https://vadzsolty-cloud.github.io/nvs-website/hu/`. Csak sikeres deploy és böngészős ellenőrzés után tekinthető működőnek.

A demo noindex, nem hoz létre ügyfélfiókot vagy valódi foglalást. A Firebase, az alkalmazás repositoryja és az APK-frissítési rendszer változatlan.
