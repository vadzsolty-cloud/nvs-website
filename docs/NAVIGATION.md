# Menüpontok és szakaszra ugrás

2026-11-21: a mobilmenü bezárása visszaadta a fókuszt a menügombnak, de az alapértelmezett fókuszgörgetés megszakíthatta a kiválasztott szakaszhoz indított görgetést. A „Szolgáltatások” kiválasztásakor a szakasz teteje így a kijelző alsó részén maradhatott. A fókusz visszaállítása most `preventScroll: true` beállítással történik; az Escape utáni billentyűzetes fókusz megmarad.

A fejléc és a mobilmenü négy közös célja: `#services`, `#about`, `#references`, `#contact`. Aloldalról a megfelelő nyelvű főoldal szakaszára vezetnek. Az ügyfélkapu, a nyelvváltás, az Android-letöltési oldal, a webalkalmazás, a telefon és a lábléc jogi hivatkozásai változatlan célpontokat használnak.

A `scripts/check-navigation.cjs` böngészős regresszió a HU/RO/EN oldalak 390 és 1440 pixeles nézetében ellenőrzi az asztali és a mobilmenü ugrásait, az aloldalról visszatérést, az ismételt fragmenthivatkozást, az ügyfélkaput, az Escape utáni fókuszt, valamint a menü és a lábléc belső céloldalait/azonosítóit. A külső alkalmazást nem módosítja, valódi APK-letöltést vagy ügyfélműveletet nem indít. A meglévő CI böngészős ellenőrzés részeként fut.
