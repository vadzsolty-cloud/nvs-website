# Menüpontok és szakaszra ugrás

2026-11-21: a mobilmenü bezárása visszaadta a fókuszt a menügombnak, de az alapértelmezett fókuszgörgetés megszakíthatta a kiválasztott szakaszhoz indított görgetést. A „Szolgáltatások” kiválasztásakor a szakasz teteje így a kijelző alsó részén maradhatott. A fókusz visszaállítása most `preventScroll: true` beállítással történik; az Escape utáni billentyűzetes fókusz megmarad.

A fejléc és a mobilmenü négy közös célja: `#services`, `#about`, `#references`, `#contact`. Aloldalról a megfelelő nyelvű főoldal szakaszára vezetnek. Az ügyfélkapu, a nyelvváltás, az Android-letöltési oldal, a webalkalmazás, a telefon és a lábléc jogi hivatkozásai változatlan célpontokat használnak.

A `scripts/check-navigation.cjs` böngészős regresszió a HU/RO/EN oldalak 390 és 1440 pixeles nézetében ellenőrzi az asztali és a mobilmenü ugrásait, az aloldalról visszatérést, az ismételt fragmenthivatkozást, az ügyfélkaput, az Escape utáni fókuszt, valamint a menü és a lábléc belső céloldalait/azonosítóit. A külső alkalmazást nem módosítja, valódi APK-letöltést vagy ügyfélműveletet nem indít. A meglévő CI böngészős ellenőrzés részeként fut.

2026-11-22: a gyorsmenü alján lévő önálló telefonszám helyére a fiókoldali „Kapcsolat regisztráció nélkül” kártya kompakt változata került, közös renderelővel és cégadatokkal. A hívás, a térképre mutató cím és az e-mail mindhárom nyelven elérhető; az account- és menükártya külön címazonosítót kap. A menü rövid kijelzőn függőlegesen görgethető, a kártya nem zsugorodik és nem lóg ki vízszintesen.

A további tulajdonosi kérés alapján a gyorsmenü térközei a böngésző tényleges magasságához igazodnak (`dvh` és `clamp`). Laptopon kisebb sorközök és belső térközök, egysoros kapcsolati címkék és a hívógomb rugalmas elrendezése biztosítja, hogy a menü és a teljes kapcsolatkártya egy képernyőn elférjen. Az érintéses menüpontok legalább 44 px magasak; a rendkívül kis ablakokban megmarad a görgetési lehetőség. A regresszió külön ellenőrzi a 1366×600, 1280×640, 1440×768, 1920×1080, 390×844 és 320×640 nézetet mindhárom nyelven.

A képernyőkép alapján finomított arányok: a fennmaradó magasságot a hét menüsor egyenlően kapja meg. A kapcsolatkártya feletti automatikus margó helyett így egyenletes sorritmus alakul ki, a kártya a menü végén marad. A minimális kattintási magasságok és a kis ablakokra vonatkozó görgetési tartalék változatlanok.
