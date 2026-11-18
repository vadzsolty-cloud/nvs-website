# Rendszerkövető téma és vizuális audit

Dátum: 2026. november 18. Hatókör: nvs-website, HU / RO / EN.

## Elkészült

- Az alapbeállítás **Rendszer**: a `prefers-color-scheme` böngészőbeállítást követi már az első megjelenítéskor, és az oldal megnyitása közben történő változásokat is átveszi. A böngésző által jelentett érték az irányadó; külön böngészőbeállítás felülírhatja az operációs rendszerét.
- A fejléc gombja Rendszer → Világos → Sötét → Rendszer sorrendben vált. A kézi választás megmarad újratöltés és nyelvváltás után; Rendszer módban újra él az automatikus követés. A mobilos ikon és a lokalizált akadálymentes címke az aktuális módot jelzi.
- Saját tárolási kulcs: `nvs-website-theme-mode`. A korábbi általános `nvs-theme` kulcsot nem írjuk és nem töröljük, mert a GitHub Pages más alkalmazásaival közös az origin. Korábbi weboldalpreferencia helyett az új rendszerkövető alapbeállítás lép életbe; kézi mód újra választható.
- Tiltott localStorage mellett is használható a témaváltás, de a választás nem marad meg következő betöltésre. A böngésző felületének színét jelző `theme-color` metaadat és a natív űrlapok `color-scheme` értéke is követi a témát.
- A téma JavaScript tartalomazonosítós fájlnevet kap mind a 39 oldalon, beleértve a jogi oldalakat is, hogy a korábbi gyorsítótárazott kód ne maradjon használatban.
- Minden Facebook-referenciakártya borítójáról eltűnt az ismétlődő NIGHT VISION SERVICE felirat, és a két általános kártya NVS felirata is. A forrásfotókat, a bennük látható eredeti műhelyfeliratokat és a Facebook által megjelenített beágyazások tartalmát nem módosítjuk.
- A tárolási kulcs leírása mindhárom nyelvű adatvédelmi tájékoztatóban frissült.

## Audit: további egyeztetésre javasolt egyszerűsítések

Ezek megfigyelések és javaslatok; ebben a módosításban nem hajtottuk végre őket.

| Megfigyelés | Javaslat |
| --- | --- |
| A főoldal tartalmában 4 látható időpontkérési útvonal van: hero gomb, kiemelt sáv, általános műhelykártya és az alsó ügyfélkapu. Ezen felül elérhető a közös fejléc/lábléc. | A hero és az alsó ügyfélkapu maradjon; a középső sáv és a műhelykártya ismétlődő felhívása egyszerűsíthető. |
| A referenciarész 9 válogatott Facebook-kártyát és 20 műhelyfotót sorol fel, továbbá két élő beágyazást kínál. Mobilon hosszú a görgetés. | Kezdetben 3–6 kártya és 6–8 fotó jelenjen meg, a többi „További referenciák / Összes fotó” megnyitással. |
| 7 borítón maradt szolgáltatáskategória, miközben a kártya alatti konkrét munkacím is leírja a témát. A többi két borítón már nincs szöveg. | Egységes, felirat nélküli fotók vagy kicsi kategóriacímke a képek alatti szövegrészben. |
| Közvetlenül a lábléc felett minden normál oldalon fejlesztői előnézeti értesítés ismétlődik, benne az időpontkérés említésével. | Végleges induláskor a kiadási állapot és indexelési döntés részeként vizsgáljuk felül; addig ne állítsuk véglegesnek az előnézetet. |

A szolgáltatási cikkek fő tartalma továbbra is mentes az ismétlődő időpontkérő blokkoktól és a műhelycím ismétlésétől. A szükséges adatvédelmi vezérlők, cégadatok és szerzői jogi tájékoztatás megmaradnak. Ez a felmérés vizuális és felületi audit, nem új jogi vagy éles Firebase-audit.

## Ellenőrzés

- Build: 39 statikus, háromnyelvű oldal; gyökér és `/nvs-website/` alútvonal.
- 18 automatizált teszt: a rendszer változásának követése, kézi felülbírálás, visszatérés Rendszer módba, tárolási hiba, régebbi médiafigyelő, más apphoz tartozó kulcs érintetlensége; minden oldaltípus verziózott témafájlja és a borítófeliratok hiánya.
- Playwright: HU/RO/EN, világos/sötét elrendezés 320–2560 px között; élő rendszerkövetés, nyelvi/jogi oldalak közötti preferencia, fejléc, menü, szolgáltatási oldalak, lábléc, mozgáscsökkentés, letöltési tesztadatok. A külső forgalom a helyi tesztekben elfogott; nincs valódi bejelentkezés, foglalás vagy e-mail.
- Saját műhelyfotókat használó Facebook-borítók betöltésének ellenőrzése.

A Firebase, a meglévő alkalmazás, az APK-k és a frissítési rendszer nem része ennek a változtatásnak. Az éles közzététel utáni eredmény és a CI állapota a #1 GitHub-feladatban szerepel.
