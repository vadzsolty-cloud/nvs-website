# GitHub feltöltési és publikálási állapot – 2026-11-14

- Repository: https://github.com/vadzsolty-cloud/nvs-website
- Teljes weboldalforrás: `dev/website-v1`.
- Publikált forráscommit: `095b5567c606bf6a8a9b667af507a6f239ba35a5`.
- Sikeres build és négy automatizált teszt: https://github.com/vadzsolty-cloud/nvs-website/actions/runs/43640711711
- Sikeres Pages-telepítés (2. kísérlet): https://github.com/vadzsolty-cloud/nvs-website/actions/runs/43640939003
- A `main` csak indító README-t és a kézi workflow felismeréséhez szükséges `pages.yml` fájlt tartalmazza. A teljes weboldalforrás nem került a főágra.
- Ellenőrzött Pages-beállítás: GitHub Actions forrás, kötelező HTTPS, nincs egyéni domain.
- Az első deploy a környezet alapértelmezett ágszabályán megállt. A tulajdonos külön engedélyével hozzáadtuk kizárólag a `dev/website-v1` ágat; a `main` engedélyét és a többi védelmi beállítást megőriztük. Az újraindított deploy sikeres.
- Működő demó: https://vadzsolty-cloud.github.io/nvs-website/hu/
- Román: https://vadzsolty-cloud.github.io/nvs-website/ro/
- Angol: https://vadzsolty-cloud.github.io/nvs-website/en/

## Publikálás utáni böngészőteszt

Külső Edge-ben betöltött a magyar, román és angol főoldal, az angol ACC aloldal, és a szolgáltatást megőrző HU nyelvváltás. A magyar foglalási demó szolgáltatás-/dátumválasztása, összegzése és újrakezdése sikeres. Asztali és 390 × 844 px mobilnézet ellenőrizve; képernyőképek a helyi artifacts könyvtárban. Ez nem teljes akadálymentességi vagy valódi telefonos audit.

A preview noindex, nem hoz létre ügyfélfiókot vagy valódi foglalást, nem ír Firebase-be és nem küld automatikus e-mailt. A működő NVS alkalmazás repositoryja és APK-frissítési rendszere érintetlen.

A dokumentációs utókövetési commitok nem váltják le automatikusan a publikált buildet; a deploy továbbra is kézi indítást igényel.
