# Cím és térkép

- **Cím:** Strada Principală 244/A, Văcărești (Csíkvacsárcsi), Harghita, România – a tulajdonos 2026-11-15-én véglegesnek jóváhagyta. A JSON-LD `streetAddress` és `postalCode` (537203) ezért már a preview-buildben is szerepel. Az irányítószám a tulajdonos Google Cégprofiljáról származik.
- **Telefon:** +40 741 738 604 – a tulajdonos 2026-11-15-én szintén véglegesnek jóváhagyta; a JSON-LD `telephone` mezőben is szerepel, a „ellenőrzésre vár” szövegek kikerültek. A keresőindexelés (PRODUCTION=true) ettől függetlenül külön jóváhagyást igényel.
- **Koordináták:** 46.4619963, 25.7936655 – a tulajdonos Google Cégprofiljának tűje (Night Vision Service, Str. Principală nr. 244/A, 537203 Mihăileni). JSON-LD `geo`.
- **Térkép:** a Kapcsolat szakaszban kattintásra betöltődő Google Maps-térkép (`maps.google.com/maps?q=<koordináták>&output=embed`, API-kulcs nélkül). Az oldal betöltésekor semmilyen kérés nem megy a Google felé; a gomb megnyomása után jön létre az iframe. Mellette a „Megnyitás a Google Mapsen” link a cégprofilra mutat.
- A helyi előnézeti szerver CSP-je `frame-src https://maps.google.com https://www.google.com` engedélyt kapott, és helyes MIME-típust ad az AVIF/WebP képekre.
