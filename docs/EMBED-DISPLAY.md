# Térkép és Facebook-előnézetek

2026-11-21, tulajdonosi kérés: műholdas Google-térkép, teljes Facebook-videóelőnézet.

- A meglévő műhelykoordináták változatlanok. A beágyazott Google-térkép műholdas nézetet használ (t=k), közelebbi z=18 nagyítással. A meglévő útvonaltervező hivatkozás megmarad. Valódi Google-iframe-ben ellenőrizve: műholdképek és az „Utcatérkép megjelenítése” váltógomb.
- A kiemelt Audi SQ5 ACC-poszt URL-je nyilvánosan a /61572089218581/videos/1697012922028515/ videóra irányít át. A korábbi post URL a videópluginban nem elérhető hibát adott; a közvetlen videólink működő 9:16-os lejátszót ad.
- A videóiframe szélessége és magassága együtt igazodik a helyhez. A featuredVideo metaadat a meglévő poszthoz tartozó videót és képarányt rögzíti; új kiemelt videó választásakor ellenőrizni kell ezeket.
- Az oldal idővonalának kerete a teljes első álló videóelőnézetet, valamint a Facebook saját fejlécét és a bejegyzés kezelősávját is befogadja. A további bejegyzések továbbra is a Facebook görgethető idővonalán következnek.
- A helyi, műhelyfotós bejegyzéskártyák teljes képet mutatnak contain illesztéssel; a hover nagyítás nem vág bele az előnézetbe.
- A méretező még hozzájárulás előtt csak a helyi iframe-méreteket és a data-embed-src értékét készíti elő. Hozzájárulás nélkül vagy visszavonás után nem állít src attribútumot és nem kér le Facebook-/Google-tartalmat.
- Az embeds JavaScript tartalomlenyomatos fájlnevet kap; a hozzájárulás alkalmazása előtt készíti elő a helyes méretet. Így az új HTML az új méretezővel töltődik be.
- A Facebook-videók, előképek és az idővonal továbbra is a Facebookról érkeznek. A legfrissebb Audi Q5-poszt előképén a hiányzó médiáról szóló üzenet már a Facebook-forrás része; ezt az eredeti poszt médiájának javításával lehet megváltoztatni. A weboldali keretezés ezt a képet nem cseréli le és nem hamisítja meg.

Ellenőrzés: npm test; scripts/check-embeds.cjs (HU/RO/EN, 320–1920px, mindkét téma, teljes álló kép két vége, natív pluginparaméterek, hideg hozzájárulás és visszavonás utáni átméretezés); valódi Google- és Facebook-beágyazások képi ellenőrzése. A böngészős CI a célzott beágyazás-regressziót is futtatja.
