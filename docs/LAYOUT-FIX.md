# Térkép és világos téma javítása

A map-consent osztály eltávolításával elveszett a térkép pozicionálási támpontja, miközben egy korábbi iframe CSS-szabály position:absolute és inset:0 értékei megmaradtak. Ez a térképet a lap elejére helyezte a hero alá. A javítás statikus iframe-et használ, a kontaktkártyán belül, külön mérettel és izolált szülővel.

Új theme-fixes.css biztosítja a javítás betöltését korábban gyorsítótárazott brand.css mellett is. A világos felületeken sötét szövegek és zöld kontrasztos gombok, a sötét képfeliratoknál világos szövegek maradnak.

A böngészős CI asztali (1440) és mobilos (390) szélességen, mindkét témában ellenőrzi a térkép szülőn belüli határait, a statikus pozicionálást, a vízszintes túlcsordulást és a világos főcím színét. Képernyőképet készít a heróról és a kapcsolatról. A külső Facebook/Google iframe tartalmak ebben az elrendezéstesztben blokkoltak/helyettesítettek; a valódi külső lejátszás nem része ennek a tesztnek.
